-- Additive installer. Does NOT migrate/delete existing content or student data.
BEGIN;
ALTER TABLE public.kkcc_test_questions ADD COLUMN IF NOT EXISTS body_storage_path text;
ALTER TABLE public.kkcc_test_questions ADD COLUMN IF NOT EXISTS body_storage_sha256 text;
ALTER TABLE public.kkcc_test_questions ADD COLUMN IF NOT EXISTS body_storage_bytes bigint DEFAULT 0;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('kkcc-test-bodies','kkcc-test-bodies',false,16777216,ARRAY['application/json']) ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN IF EXISTS(SELECT 1 FROM storage.buckets WHERE id='kkcc-test-bodies' AND public)
THEN RAISE EXCEPTION 'kkcc-test-bodies must be PRIVATE'; END IF; END $$;
DROP POLICY IF EXISTS kkcc_test_bodies_server_only ON storage.objects;
CREATE POLICY kkcc_test_bodies_server_only ON storage.objects AS RESTRICTIVE FOR ALL TO anon,authenticated
USING(bucket_id <> 'kkcc-test-bodies') WITH CHECK(bucket_id <> 'kkcc-test-bodies');
-- Historical tables: references only; rows, IDs and FKs are preserved.
DO $$ DECLARE tab text; BEGIN
 FOREACH tab IN ARRAY ARRAY['materials','test_questions'] LOOP
  IF to_regclass('public.'||tab) IS NOT NULL THEN
   EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS body_storage_path text',tab);
   EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS body_storage_sha256 text',tab);
   EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS body_storage_bytes bigint DEFAULT 0',tab);
   EXECUTE format('GRANT SELECT,UPDATE ON public.%I TO service_role',tab);
  END IF;
 END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.move_test_question_body(
 p_actor uuid,p_id uuid,p_updated timestamptz,p_text_md5 text,p_options_md5 text,p_explanation_md5 text,
 p_path text,p_sha256 text,p_bytes bigint,p_legacy boolean DEFAULT false
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE changed integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false) THEN RAISE EXCEPTION 'Admin server only'; END IF;
 IF p_path IS NULL OR p_path LIKE '%..%' OR p_sha256 IS NULL OR p_sha256 !~ '^[a-f0-9]{64}$'
 OR p_bytes IS NULL OR p_bytes NOT BETWEEN 1 AND 16777216 THEN RAISE EXCEPTION 'Invalid verified test reference'; END IF;
 IF p_legacy THEN
 UPDATE public.test_questions SET question_text='',options='{}',explanation='',
 body_storage_path=p_path,body_storage_sha256=p_sha256,body_storage_bytes=p_bytes,updated_at=clock_timestamp()
 WHERE id=p_id AND body_storage_path IS NULL AND p_path LIKE test_id::text || '/%.json'
 AND updated_at IS NOT DISTINCT FROM p_updated
 AND md5(question_text)=p_text_md5 AND md5(array_to_json(options)::text)=p_options_md5
 AND md5(coalesce(explanation,''))=p_explanation_md5;
 ELSE
 UPDATE public.kkcc_test_questions SET question_text='',options='{}',explanation='',
 body_storage_path=p_path,body_storage_sha256=p_sha256,body_storage_bytes=p_bytes,updated_at=clock_timestamp()
 WHERE id=p_id AND body_storage_path IS NULL AND p_path LIKE test_id::text || '/%.json'
 AND updated_at IS NOT DISTINCT FROM p_updated
 AND md5(question_text)=p_text_md5 AND md5(array_to_json(options)::text)=p_options_md5
 AND md5(coalesce(explanation,''))=p_explanation_md5;
 END IF;
 GET DIAGNOSTICS changed=ROW_COUNT; RETURN changed=1;
END $$;
REVOKE ALL ON FUNCTION public.move_test_question_body(uuid,uuid,timestamptz,text,text,text,text,text,bigint,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.move_test_question_body(uuid,uuid,timestamptz,text,text,text,text,text,bigint,boolean) TO service_role;
CREATE OR REPLACE FUNCTION public.test_body_storage_status(p_actor uuid)
RETURNS TABLE(source text,inline_count bigint,inline_bytes bigint,stored_count bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false) THEN RAISE EXCEPTION 'Admin server only'; END IF;
 RETURN QUERY SELECT 'questions'::text,count(*) FILTER(WHERE body_storage_path IS NULL),
 coalesce(sum(octet_length(question_text)+octet_length(array_to_json(options)::text)+octet_length(coalesce(explanation,''))) FILTER(WHERE body_storage_path IS NULL),0)::bigint,
 count(*) FILTER(WHERE body_storage_path IS NOT NULL) FROM public.kkcc_test_questions;
 IF to_regclass('public.test_questions') IS NOT NULL THEN
 RETURN QUERY EXECUTE 'SELECT ''legacy-questions''::text,count(*) FILTER(WHERE body_storage_path IS NULL),coalesce(sum(octet_length(question_text)+octet_length(array_to_json(options)::text)+octet_length(coalesce(explanation,''''))) FILTER(WHERE body_storage_path IS NULL),0)::bigint,count(*) FILTER(WHERE body_storage_path IS NOT NULL) FROM public.test_questions'; END IF;
 IF to_regclass('public.materials') IS NOT NULL THEN
 RETURN QUERY EXECUTE 'SELECT ''legacy-notes''::text,count(*) FILTER(WHERE body_storage_path IS NULL AND coalesce(description,'''')<>''''),coalesce(sum(octet_length(description)) FILTER(WHERE body_storage_path IS NULL),0)::bigint,count(*) FILTER(WHERE body_storage_path IS NOT NULL) FROM public.materials'; END IF;

END $$;
REVOKE ALL ON FUNCTION public.test_body_storage_status(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.test_body_storage_status(uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.move_legacy_note_body(
 p_actor uuid,p_id uuid,p_updated timestamptz,p_source_md5 text,
 p_path text,p_sha256 text,p_bytes bigint
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE changed integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false)
 THEN RAISE EXCEPTION 'Admin server only'; END IF;
 IF p_path IS NULL OR p_path NOT LIKE p_id::text || '/%.txt'
 OR p_path LIKE '%..%' OR p_sha256 IS NULL OR p_sha256 !~ '^[a-f0-9]{64}$'
 OR p_bytes IS NULL OR p_bytes NOT BETWEEN 1 AND 1048576
 THEN RAISE EXCEPTION 'Invalid verified note reference'; END IF;
 UPDATE public.materials SET description='',body_storage_path=p_path,
 body_storage_sha256=p_sha256,body_storage_bytes=p_bytes,updated_at=clock_timestamp()
 WHERE id=p_id AND body_storage_path IS NULL
 AND updated_at IS NOT DISTINCT FROM p_updated
 AND md5(coalesce(description,''))=p_source_md5;
 GET DIAGNOSTICS changed=ROW_COUNT;
 RETURN changed=1;
END $$;
REVOKE ALL ON FUNCTION public.move_legacy_note_body(uuid,uuid,timestamptz,text,text,text,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.move_legacy_note_body(uuid,uuid,timestamptz,text,text,text,bigint) TO service_role;
CREATE OR REPLACE FUNCTION public.publish_storage_text_test(p_actor uuid,p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tid uuid; q jsonb; n integer; pos integer:=0; fingerprint text; old_hash text; paid boolean; rupees integer; coins integer; BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false) THEN RAISE EXCEPTION 'Admin server only'; END IF;
 tid := (p_payload->>'id')::uuid;
 IF tid IS NULL OR jsonb_typeof(p_payload->'questions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid questions'; END IF;
 n:=jsonb_array_length(p_payload->'questions');
 IF n < 1 OR coalesce(length(trim(p_payload->>'subject')),0)=0 OR coalesce(length(trim(p_payload->>'chapter')),0)=0 OR coalesce(length(trim(p_payload->>'title')),0)<2 OR (p_payload->>'duration_minutes')::integer NOT BETWEEN 1 AND 300 THEN RAISE EXCEPTION 'Invalid test details'; END IF;
 paid := coalesce((p_payload->>'is_paid')::boolean,false);
 rupees := coalesce((p_payload->>'price_inr')::integer,0);
 coins := coalesce((p_payload->>'price_coins')::integer,0);
 IF rupees NOT BETWEEN 0 AND 100000 OR coins NOT BETWEEN 0 AND 1000000 THEN RAISE EXCEPTION 'Invalid price'; END IF;
 IF paid AND rupees=0 AND coins=0 THEN RAISE EXCEPTION 'A paid test needs a rupee price, a coin price, or both'; END IF;
 IF NOT paid THEN rupees:=0; coins:=0; END IF;
 fingerprint:=p_payload->>'_request_hash';
 IF fingerprint IS NULL OR fingerprint !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid request fingerprint'; END IF;
 PERFORM pg_advisory_xact_lock(hashtext(tid::text));
 SELECT easy_request_hash INTO old_hash FROM public.kkcc_tests WHERE id=tid;
 IF FOUND THEN
   IF old_hash IS DISTINCT FROM fingerprint THEN RAISE EXCEPTION 'Test already saved with different content. Open it in Advanced to edit.'; END IF;
   RETURN jsonb_build_object('id',tid,'count',n);
 END IF;
 INSERT INTO public.kkcc_tests(id,title,instructions,subject,duration_minutes,syllabus_subject,syllabus_chapter,series_name,easy_request_hash,is_published,question_source,is_paid,price_inr,price_coins,syllabus_topic,assembly_source_ids)
 VALUES(tid,p_payload->>'title','Answer every question. 1 mark each; no negative marking.',p_payload->>'subject',(p_payload->>'duration_minutes')::integer,p_payload->>'subject',p_payload->>'chapter',coalesce(p_payload->>'series_name',''),fingerprint,false,'manual',paid,rupees,coins,coalesce(p_payload->>'topic',''),ARRAY(SELECT value::uuid FROM jsonb_array_elements_text(coalesce(p_payload->'assembly_source_ids','[]'::jsonb))));
 FOR q IN SELECT value FROM jsonb_array_elements(p_payload->'questions') LOOP
  IF q->>'body_storage_path' IS NULL OR q->>'body_storage_path' NOT LIKE tid::text || '/%.json'
  OR q->>'body_storage_path' LIKE '%..%' OR q->>'body_storage_sha256' IS NULL
  OR q->>'body_storage_sha256' !~ '^[a-f0-9]{64}$'
  OR coalesce((q->>'body_storage_bytes')::bigint,0) NOT BETWEEN 1 AND 16777216
  OR q->>'id' IS NULL OR coalesce((q->>'option_count')::integer,0) NOT BETWEEN 2 AND 6
  OR q->>'correct_index' IS NULL OR (q->>'correct_index')::integer NOT BETWEEN 0 AND (q->>'option_count')::integer-1
  THEN RAISE EXCEPTION 'Invalid verified question reference'; END IF;
  INSERT INTO public.kkcc_test_questions(id,test_id,question_text,subject,options,correct_index,marks,negative_marks,explanation,sort_order,body_storage_path,body_storage_sha256,body_storage_bytes)
  VALUES((q->>'id')::uuid,tid,'',p_payload->>'subject','{}',(q->>'correct_index')::integer,1,0,'',pos,q->>'body_storage_path',q->>'body_storage_sha256',(q->>'body_storage_bytes')::bigint);
  pos:=pos+1;
 END LOOP;
 UPDATE public.kkcc_tests SET is_published=coalesce((p_payload->>'publish')::boolean,true) WHERE id=tid;
 INSERT INTO public.kkcc_test_folders(series_name,subject,chapter,topic)
 SELECT coalesce(p_payload->>'series_name',''),p_payload->>'subject',v.chapter,v.topic
 FROM (VALUES ('',''),(p_payload->>'chapter',''),(p_payload->>'chapter',coalesce(p_payload->>'topic',''))) AS v(chapter,topic)
 ON CONFLICT(series_name,subject,chapter,topic) DO NOTHING;
 RETURN jsonb_build_object('id',tid,'count',n);
END $$;
REVOKE ALL ON FUNCTION public.publish_storage_text_test(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.publish_storage_text_test(uuid,jsonb) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
