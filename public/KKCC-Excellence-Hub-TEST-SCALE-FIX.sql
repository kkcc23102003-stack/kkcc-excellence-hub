-- Requires the earlier Test Folders setup. Removes only the own-MCQ count quota.
-- Existing data, role checks, validation and transactional publication are retained.
BEGIN;
DO $$
DECLARE definition text;
BEGIN
 IF to_regprocedure('public.publish_easy_text_test_v3(uuid,jsonb)') IS NULL THEN
  RAISE EXCEPTION 'Run KKCC-Excellence-Hub-TEST-FOLDERS.sql first';
 END IF;
 SELECT pg_get_functiondef('public.publish_easy_text_test_v3(uuid,jsonb)'::regprocedure) INTO definition;
 IF position('n NOT BETWEEN 1 AND 200' in definition)>0 THEN
  EXECUTE replace(definition,'n NOT BETWEEN 1 AND 200','n < 1');
 END IF;
END $$;
NOTIFY pgrst,'reload schema';
COMMIT;
