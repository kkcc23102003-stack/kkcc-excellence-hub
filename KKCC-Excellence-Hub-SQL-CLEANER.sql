-- KKCC Excellence Hub — SAFE SQL CLEANER
-- Purpose: reduce accidental public exposure from legacy educational tables without
-- deleting data. It does NOT drop AI tables, student/auth tables, or question-bank source files.
-- Review the NOTICE output before applying to production.

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
      -- Remove broad client privileges; server/admin deployment can restore only what is needed.
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
      IF NOT has_rows THEN
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', t);
        RAISE NOTICE 'Dropped empty legacy table public.%', t;
      END IF;
    END IF;
  END LOOP;
END $$;

-- Remove broad function execution for legacy content helpers when they still exist.
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

-- Do not touch reviewed-AI infrastructure here: it is intentionally future functionality and stays OFF by default.
COMMIT;

-- Verify after running:
-- SELECT table_name, privilege_type, grantee FROM information_schema.role_table_grants
-- WHERE table_schema='public' AND grantee IN ('anon','authenticated')
-- ORDER BY table_name, grantee, privilege_type;
