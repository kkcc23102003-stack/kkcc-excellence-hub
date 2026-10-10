-- Apply after the previous KKCC Publish Fix SQL. Additive; no saved content deleted.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_test_folders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 series_name text NOT NULL DEFAULT '', subject text NOT NULL,
 chapter text NOT NULL DEFAULT '', topic text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(length(trim(subject))>0), CHECK(topic='' OR chapter<>''),
 UNIQUE(series_name,subject,chapter,topic)
);
ALTER TABLE public.kkcc_test_folders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_test_folders FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_test_folders TO service_role;
ALTER TABLE public.kkcc_tests ADD COLUMN IF NOT EXISTS assembly_source_ids uuid[] NOT NULL DEFAULT '{}';
CREATE OR REPLACE FUNCTION public.publish_easy_text_test_v3(p_actor uuid,p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tid uuid; q jsonb; n integer; pos integer:=0; fingerprint text; old_hash text; paid boolean; rupees integer; coins integer; BEGIN
 IF auth.role()<>'service_role' OR NOT public.has_role(p_actor,'admin') THEN RAISE EXCEPTION 'Admin server only'; END IF;
 tid := (p_payload->>'id')::uuid;
 IF tid IS NULL OR jsonb_typeof(p_payload->'questions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid questions'; END IF;
 n:=jsonb_array_length(p_payload->'questions');
 IF n NOT BETWEEN 1 AND 200 OR coalesce(length(trim(p_payload->>'subject')),0)=0 OR coalesce(length(trim(p_payload->>'chapter')),0)=0 OR coalesce(length(trim(p_payload->>'title')),0)<2 OR (p_payload->>'duration_minutes')::integer NOT BETWEEN 1 AND 300 THEN RAISE EXCEPTION 'Invalid test details'; END IF;
 paid := coalesce((p_payload->>'is_paid')::boolean,false);
 rupees := coalesce((p_payload->>'price_inr')::integer,0);
 coins := coalesce((p_payload->>'price_coins')::integer,0);
 IF rupees NOT BETWEEN 0 AND 100000 OR coins NOT BETWEEN 0 AND 1000000 THEN RAISE EXCEPTION 'Invalid price'; END IF;
 IF paid AND rupees=0 AND coins=0 THEN RAISE EXCEPTION 'A paid test needs a rupee price, a coin price, or both'; END IF;
 IF NOT paid THEN rupees:=0; coins:=0; END IF;
 fingerprint:=md5(p_payload::text);
 PERFORM pg_advisory_xact_lock(hashtext(tid::text));
 SELECT easy_request_hash INTO old_hash FROM public.kkcc_tests WHERE id=tid;
 IF FOUND THEN
   IF old_hash IS DISTINCT FROM fingerprint THEN RAISE EXCEPTION 'Test already saved with different content. Open it in Advanced to edit.'; END IF;
   RETURN jsonb_build_object('id',tid,'count',n);
 END IF;
 INSERT INTO public.kkcc_tests(id,title,instructions,subject,duration_minutes,syllabus_subject,syllabus_chapter,series_name,easy_request_hash,is_published,question_source,is_paid,price_inr,price_coins,syllabus_topic,assembly_source_ids)
 VALUES(tid,p_payload->>'title','Answer every question. 1 mark each; no negative marking.',p_payload->>'subject',(p_payload->>'duration_minutes')::integer,p_payload->>'subject',p_payload->>'chapter',coalesce(p_payload->>'series_name',''),fingerprint,false,'manual',paid,rupees,coins,coalesce(p_payload->>'topic',''),ARRAY(SELECT value::uuid FROM jsonb_array_elements_text(coalesce(p_payload->'assembly_source_ids','[]'::jsonb))));
 FOR q IN SELECT value FROM jsonb_array_elements(p_payload->'questions') LOOP
  IF coalesce(length(trim(q->>'question_text')),0)<3 OR jsonb_typeof(q->'options') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid question'; END IF;
  IF jsonb_array_length(q->'options') NOT BETWEEN 2 AND 6 OR q->>'correct_index' IS NULL OR (q->>'correct_index')::integer NOT BETWEEN 0 AND jsonb_array_length(q->'options')-1 THEN RAISE EXCEPTION 'Invalid answer/options'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(q->'options') v WHERE jsonb_typeof(v)<>'string' OR length(trim(v#>>'{}'))=0) OR (SELECT count(DISTINCT lower(trim(value))) FROM jsonb_array_elements_text(q->'options'))<>jsonb_array_length(q->'options') THEN RAISE EXCEPTION 'Empty/duplicate options'; END IF;
  INSERT INTO public.kkcc_test_questions(test_id,question_text,subject,options,correct_index,marks,negative_marks,explanation,sort_order)
  VALUES(tid,q->>'question_text',p_payload->>'subject',ARRAY(SELECT jsonb_array_elements_text(q->'options')),(q->>'correct_index')::integer,1,0,coalesce(q->>'explanation',''),pos);
  pos:=pos+1;
 END LOOP;
 UPDATE public.kkcc_tests SET is_published=coalesce((p_payload->>'publish')::boolean,true) WHERE id=tid;
 INSERT INTO public.kkcc_test_folders(series_name,subject,chapter,topic)
 SELECT coalesce(p_payload->>'series_name',''),p_payload->>'subject',v.chapter,v.topic
 FROM (VALUES ('',''),(p_payload->>'chapter',''),(p_payload->>'chapter',coalesce(p_payload->>'topic',''))) AS v(chapter,topic)
 ON CONFLICT(series_name,subject,chapter,topic) DO NOTHING;
 RETURN jsonb_build_object('id',tid,'count',n);
END $$;
REVOKE ALL ON FUNCTION public.publish_easy_text_test_v3(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.publish_easy_text_test_v3(uuid,jsonb) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
