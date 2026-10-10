-- KKCC Free-plan space tools. Run ONCE in Supabase SQL Editor.
-- Installing this file deletes NOTHING. Admin panel defaults to preview only.
-- Back up before a confirmed cleanup. Submitted results/payments/users stay intact.
BEGIN;
CREATE OR REPLACE FUNCTION public.kkcc_space_report(
  p_cleanup boolean DEFAULT false,
  p_before timestamptz DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  cutoff timestamptz := coalesce(p_before, now() - interval '90 days');
  candidates integer := 0;
  removed integer := 0;
  sizes jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF cutoff > now() - interval '90 days' OR cutoff < timestamptz '2000-01-01' THEN
    RAISE EXCEPTION 'Cutoff must be at least 90 days old';
  END IF;
  -- Bound work to 5,000 rows per confirmed batch. No cron, no silent deletion.
  SELECT count(*) INTO candidates FROM (
    SELECT id FROM public.learning_attempts
    WHERE status = 'started' AND submitted_at IS NULL
      AND started_at < cutoff AND duration_seconds >= 0
      AND started_at + make_interval(secs => duration_seconds) < cutoff
    ORDER BY started_at, id LIMIT 5000
  ) eligible;
  IF p_cleanup THEN
    WITH eligible AS (
      SELECT id FROM public.learning_attempts
      WHERE status = 'started' AND submitted_at IS NULL
        AND started_at < cutoff AND duration_seconds >= 0
        AND started_at + make_interval(secs => duration_seconds) < cutoff
      ORDER BY started_at, id LIMIT 5000 FOR UPDATE SKIP LOCKED
    )
    DELETE FROM public.learning_attempts a USING eligible e
    WHERE a.id = e.id AND a.status = 'started' AND a.submitted_at IS NULL;
    GET DIAGNOSTICS removed = ROW_COUNT;
  END IF;
  SELECT coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO sizes FROM (
    SELECT c.relname AS name, pg_total_relation_size(c.oid) AS bytes
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r','m')
    ORDER BY pg_total_relation_size(c.oid) DESC LIMIT 12
  ) t;
  RETURN jsonb_build_object(
    'database_bytes', pg_database_size(current_database()),
    'tables', sizes, 'cutoff', cutoff, 'eligible_batch', candidates,
    'deleted', removed, 'batch_limit', 5000, 'preview', NOT p_cleanup
  );
END $$;
REVOKE ALL ON FUNCTION public.kkcc_space_report(boolean,timestamptz) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.kkcc_space_report(boolean,timestamptz) TO authenticated;

-- Disable the old destructive cleaner entry point. It used to delete 24-hour
-- attempts and expire grants, and could run without checking the caller's role.
-- Legacy callers now get a non-destructive, admin-only report.
CREATE OR REPLACE FUNCTION public.kkcc_clean_database_bloat()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RETURN public.kkcc_space_report(false, NULL);
END $$;
REVOKE ALL ON FUNCTION public.kkcc_clean_database_bloat() FROM PUBLIC, anon, service_role;
GRANT EXECUTE ON FUNCTION public.kkcc_clean_database_bloat() TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
-- PostgreSQL autovacuum can reuse deleted space later. File size/billed usage
-- need not shrink immediately. Do NOT run VACUUM FULL on a live app casually.
-- This report is database size, NOT Supabase Storage object quota or billing.
