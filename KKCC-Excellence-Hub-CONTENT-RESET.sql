-- Requires Note Bodies + Test Bodies setup. Installer itself deletes NOTHING.
BEGIN;
DO $$ DECLARE tab text; BEGIN
 FOREACH tab IN ARRAY ARRAY['kkcc_materials','kkcc_tests','kkcc_test_questions','materials','tests','test_questions'] LOOP
  IF to_regclass('public.'||tab) IS NOT NULL THEN
   EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS content_deleted_at timestamptz',tab);
  END IF;
 END LOOP;
END $$;
-- Question-paper snapshots preserve student result/review without retaining the old library.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('kkcc-result-papers','kkcc-result-papers',false,16777216,ARRAY['application/json']) ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN IF EXISTS(SELECT 1 FROM storage.buckets WHERE id='kkcc-result-papers' AND public) THEN RAISE EXCEPTION 'Result paper bucket must be PRIVATE'; END IF; END $$;
DROP POLICY IF EXISTS kkcc_result_papers_server_only ON storage.objects;
CREATE POLICY kkcc_result_papers_server_only ON storage.objects AS RESTRICTIVE FOR ALL TO anon,authenticated
USING(bucket_id <> 'kkcc-result-papers') WITH CHECK(bucket_id <> 'kkcc-result-papers');
CREATE TABLE IF NOT EXISTS public.kkcc_attempt_papers(
 attempt_id uuid PRIMARY KEY REFERENCES public.learning_attempts(id) ON DELETE CASCADE,
 path text NOT NULL,sha256 text NOT NULL,bytes bigint NOT NULL
);
ALTER TABLE public.kkcc_attempt_papers ADD COLUMN IF NOT EXISTS verified_at timestamptz NOT NULL DEFAULT clock_timestamp();
ALTER TABLE public.kkcc_attempt_papers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_attempt_papers FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_attempt_papers TO service_role;
CREATE TABLE IF NOT EXISTS public.kkcc_removed_content_files(
 bucket text NOT NULL CHECK(bucket IN ('kkcc-note-bodies','kkcc-test-bodies')),
 path text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(bucket,path)
);
ALTER TABLE public.kkcc_removed_content_files ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_removed_content_files FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_removed_content_files TO service_role;
CREATE OR REPLACE FUNCTION public.kkcc_content_file_referenced(p_bucket text,p_path text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tab text; found_ref boolean; BEGIN
 FOREACH tab IN ARRAY CASE WHEN p_bucket='kkcc-note-bodies' THEN ARRAY['kkcc_materials','materials'] ELSE ARRAY['kkcc_test_questions','test_questions'] END LOOP
  IF to_regclass('public.'||tab) IS NOT NULL THEN
   EXECUTE format('SELECT EXISTS(SELECT 1 FROM public.%I WHERE body_storage_path=$1)',tab) INTO found_ref USING p_path;
   IF found_ref THEN RETURN true; END IF;
  END IF;
 END LOOP; RETURN false;
END $$;
REVOKE ALL ON FUNCTION public.kkcc_content_file_referenced(text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.kkcc_content_file_referenced(text,text) TO service_role;
CREATE OR REPLACE FUNCTION public.admin_remove_old_content(
 p_actor uuid,p_action text DEFAULT 'preview',p_before timestamptz DEFAULT NULL,
 p_confirmation text DEFAULT '',p_files jsonb DEFAULT '[]'
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tab text; ids uuid[]; n bigint; counts jsonb:='{}'; cutoff timestamptz:=coalesce(p_before,clock_timestamp()); bucket_name text; total bigint:=0;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false) THEN RAISE EXCEPTION 'Admin server only'; END IF;
 IF p_action NOT IN ('preview','remove','files','ack') THEN RAISE EXCEPTION 'Invalid action'; END IF;
 IF p_action='files' THEN
  DELETE FROM public.kkcc_removed_content_files WHERE public.kkcc_content_file_referenced(bucket,path);
  RETURN coalesce((SELECT jsonb_agg(to_jsonb(f)) FROM (SELECT bucket,path FROM public.kkcc_removed_content_files
   WHERE NOT public.kkcc_content_file_referenced(bucket,path) ORDER BY created_at,bucket,path LIMIT 100) f),'[]');
 END IF;
 IF p_action='ack' THEN
  DELETE FROM public.kkcc_removed_content_files f USING jsonb_to_recordset(p_files) AS done(bucket text,path text)
   WHERE f.bucket=done.bucket AND f.path=done.path;
  RETURN jsonb_build_object('ok',true);
 END IF;
 IF p_action='remove' THEN
  IF p_confirmation IS DISTINCT FROM 'DELETE OLD NOTES AND TESTS' OR p_before IS NULL OR p_before>clock_timestamp()
  THEN RAISE EXCEPTION 'Review and confirm deletion first'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('kkcc-library-removal'));
  LOCK TABLE public.learning_attempts IN SHARE ROW EXCLUSIVE MODE;
  IF EXISTS(SELECT 1 FROM public.learning_attempts a LEFT JOIN public.kkcc_attempt_papers p ON p.attempt_id=a.id WHERE p.attempt_id IS NULL OR p.verified_at < p_before)
  THEN RAISE EXCEPTION 'Protect existing attempt papers before deleting content; retry preparation'; END IF;

 END IF;
 FOREACH tab IN ARRAY ARRAY['kkcc_tests','kkcc_test_questions','kkcc_materials','tests','test_questions','materials'] LOOP
  IF to_regclass('public.'||tab) IS NULL THEN CONTINUE; END IF;
  IF p_action='remove' THEN
   EXECUTE format('SELECT array_agg(id) FROM (SELECT id FROM public.%I WHERE content_deleted_at IS NULL AND coalesce(created_at,''epoch'')<=$1 ORDER BY id LIMIT 500 FOR UPDATE) chosen',tab) INTO ids USING cutoff;
   IF coalesce(cardinality(ids),0)>0 THEN
    IF tab IN ('kkcc_materials','materials','kkcc_test_questions','test_questions') THEN
     bucket_name:=CASE WHEN tab IN ('kkcc_materials','materials') THEN 'kkcc-note-bodies' ELSE 'kkcc-test-bodies' END;
     EXECUTE format('INSERT INTO public.kkcc_removed_content_files(bucket,path) SELECT $1,body_storage_path FROM public.%I WHERE id=ANY($2) AND body_storage_path IS NOT NULL ON CONFLICT DO NOTHING',tab) USING bucket_name,ids;
    END IF;
    IF tab IN ('kkcc_materials','materials') THEN
     EXECUTE format('UPDATE public.%I SET description='''',file_url=NULL,thumbnail_url=NULL,is_published=false,body_storage_path=NULL,body_storage_sha256=NULL,body_storage_bytes=0,content_deleted_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=ANY($1)',tab) USING ids;
    ELSIF tab IN ('kkcc_test_questions','test_questions') THEN
     EXECUTE format('UPDATE public.%I SET question_text='''',options=''{}'',explanation='''',body_storage_path=NULL,body_storage_sha256=NULL,body_storage_bytes=0,content_deleted_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=ANY($1)',tab) USING ids;
    ELSE
     EXECUTE format('UPDATE public.%I SET instructions='''',is_published=false,content_deleted_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=ANY($1)',tab) USING ids;
    END IF;
   END IF;
  END IF;
  EXECUTE format('SELECT count(*) FROM public.%I WHERE content_deleted_at IS NULL AND coalesce(created_at,''epoch'')<=$1',tab) INTO n USING cutoff;
  counts:=counts||jsonb_build_object(tab,n); total:=total+n;
 END LOOP;
 IF p_action='remove' THEN
  INSERT INTO public.kkcc_site_settings(key,value) VALUES('builtin_materials_adopted','true') ON CONFLICT(key) DO UPDATE SET value='true';
 END IF;
 RETURN jsonb_build_object('cutoff',cutoff,'counts',counts,'remaining',total,'pending_files',(SELECT count(*) FROM public.kkcc_removed_content_files));
END $$;
REVOKE ALL ON FUNCTION public.admin_remove_old_content(uuid,text,timestamptz,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.admin_remove_old_content(uuid,text,timestamptz,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.restore_storage_sample_notes(p_actor uuid,p_rows jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE r public.kkcc_materials; BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false) THEN RAISE EXCEPTION 'Admin server only'; END IF;
 FOR r IN SELECT * FROM jsonb_populate_recordset(NULL::public.kkcc_materials,p_rows) LOOP
  IF coalesce(r.description,'')<>'' OR r.body_storage_path IS NULL OR r.body_storage_path NOT LIKE r.id::text||'/%.txt' OR r.body_storage_sha256 IS NULL OR r.body_storage_sha256 !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Verified Storage body required'; END IF;
  r.content_deleted_at:=NULL;
  INSERT INTO public.kkcc_materials SELECT r.* ON CONFLICT(id) DO UPDATE SET
   description='',title=excluded.title,subject=excluded.subject,chapter=excluded.chapter,class_level=excluded.class_level,
   course_id=excluded.course_id,lecture_id=excluded.lecture_id,module_title=excluded.module_title,batch=excluded.batch,
   file_url=excluded.file_url,thumbnail_url=excluded.thumbnail_url,material_type=excluded.material_type,pages=excluded.pages,
   access_type=excluded.access_type,price=excluded.price,coin_price=excluded.coin_price,is_published=excluded.is_published,
   body_storage_path=excluded.body_storage_path,body_storage_sha256=excluded.body_storage_sha256,body_storage_bytes=excluded.body_storage_bytes,
   created_at=excluded.created_at,updated_at=excluded.updated_at,content_deleted_at=NULL
  WHERE kkcc_materials.content_deleted_at IS NOT NULL;
 END LOOP; RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.restore_storage_sample_notes(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.restore_storage_sample_notes(uuid,jsonb) TO service_role;
-- Tombstones must not be offered for migration again.
DO $$ DECLARE fn regprocedure; definition text; BEGIN
 FOREACH fn IN ARRAY ARRAY['public.test_body_storage_status(uuid)'::regprocedure,'public.note_body_storage_status(uuid)'::regprocedure] LOOP
  SELECT pg_get_functiondef(fn) INTO definition;
  definition:=replace(definition,'WHERE body_storage_path IS NULL','WHERE content_deleted_at IS NULL AND body_storage_path IS NULL');
  definition:=replace(definition,'WHERE body_storage_path IS NOT NULL','WHERE content_deleted_at IS NULL AND body_storage_path IS NOT NULL');
  EXECUTE definition;
 END LOOP;
END $$;
NOTIFY pgrst,'reload schema';
COMMIT;
