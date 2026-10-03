-- ============================================================================
-- KKCC Excellence Hub — SAFE SQL & DATABASE BLOAT CLEANER
-- ============================================================================
-- Purpose:
--   1. Reduce accidental public exposure from legacy educational tables without
--      deleting non-empty owner data, and drop empty legacy tables.
--   2. Clean abandoned/unsubmitted test attempts older than 24 hours.
--   3. Clean notification_reads for expired notifications.
--   4. Clean revoked or long-expired access grants older than 90 days.
--   5. Remove rejected/failed AI draft rows so Supabase storage never fills up.
--   6. Ensure Punjab ETT Cadre Paper A & Paper B are 100% Free (₹0 / 0 Coins).
-- ============================================================================

BEGIN;

DO $$
DECLARE
  t text;
  exists_table boolean;
  has_rows boolean;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'courses','lectures','materials','tests','test_questions',
    'site_settings','private_settings','test_series_overrides','files'
  ] LOOP
    SELECT to_regclass('public.' || t) IS NOT NULL INTO exists_table;
    IF exists_table THEN
      EXECUTE format('SELECT EXISTS (SELECT 1 FROM public.%I)', t) INTO has_rows;
      RAISE NOTICE 'Legacy table public.% exists; nonempty=%', t, has_rows;
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
      IF NOT has_rows THEN
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', t);
        RAISE NOTICE 'Dropped empty legacy table public.%', t;
      END IF;
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public'
      AND p.prokind='f'
      AND pg_get_functiondef(p.oid) ~* '(courses|lectures|materials|tests|test_questions|site_settings|private_settings|test_series_overrides|files)'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.signature);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.kkcc_clean_database_bloat()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_abandoned_attempts integer := 0;
  v_old_reads integer := 0;
  v_expired_grants integer := 0;
  v_ett_free integer := 0;
BEGIN
  IF to_regclass('public.learning_attempts') IS NOT NULL THEN
    DELETE FROM public.learning_attempts
    WHERE status = 'started'
      AND started_at < now() - interval '24 hours';
    GET DIAGNOSTICS v_abandoned_attempts = ROW_COUNT;
  END IF;

  IF to_regclass('public.notification_reads') IS NOT NULL AND to_regclass('public.notifications') IS NOT NULL THEN
    DELETE FROM public.notification_reads nr
    USING public.notifications n
    WHERE nr.notification_id = n.id
      AND n.expires_at IS NOT NULL
      AND n.expires_at < now() - interval '7 days';
    GET DIAGNOSTICS v_old_reads = ROW_COUNT;
  END IF;

  IF to_regclass('public.test_access_grants') IS NOT NULL THEN
    DELETE FROM public.test_access_grants
    WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '90 days')
       OR (expires_at IS NOT NULL AND expires_at < now() - interval '90 days');
    GET DIAGNOSTICS v_expired_grants = ROW_COUNT;
  END IF;

  IF to_regclass('public.series_access_grants') IS NOT NULL THEN
    DELETE FROM public.series_access_grants
    WHERE (revoked_at IS NOT NULL AND revoked_at < now() - interval '90 days')
       OR (expires_at IS NOT NULL AND expires_at < now() - interval '90 days');
  END IF;

  IF to_regclass('public.ai_question_candidates') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.ai_question_candidates WHERE status = ''rejected''';
  END IF;
  IF to_regclass('public.ai_question_runs') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.ai_question_runs WHERE created_at < now() - interval ''30 days''';
  END IF;

  IF to_regclass('public.test_series_overrides') IS NOT NULL THEN
    EXECUTE $sql$
      UPDATE public.test_series_overrides
      SET price_inr = 0, price_coins = 0, updated_at = now()
      WHERE series_id IN ('punjab-ett-paper-a', 'punjab-ett-paper-b', 'punjab-ett-cadre')
    $sql$;
    GET DIAGNOSTICS v_ett_free = ROW_COUNT;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'cleaned_abandoned_attempts', v_abandoned_attempts,
    'cleaned_expired_notification_reads', v_old_reads,
    'cleaned_expired_grants', v_expired_grants,
    'ett_series_free_updated', v_ett_free,
    'cleaned_at', now()
  );
END $$;

REVOKE ALL ON FUNCTION public.kkcc_clean_database_bloat() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.kkcc_clean_database_bloat() TO authenticated, service_role;

SELECT public.kkcc_clean_database_bloat() AS cleaner_report;

NOTIFY pgrst, 'reload schema';

COMMIT;
