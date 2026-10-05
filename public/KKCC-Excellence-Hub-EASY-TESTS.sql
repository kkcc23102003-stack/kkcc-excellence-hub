-- One-time test-builder fix: published tests/questions in Supabase, template BANK stays in source.
-- Back up first. Additive migration; no student records or old CMS rows deleted.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_tests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), course_id uuid, lecture_id uuid,
 title text NOT NULL DEFAULT '', instructions text NOT NULL DEFAULT '', subject text NOT NULL DEFAULT '',
 duration_minutes integer DEFAULT 30, question_timer_seconds integer DEFAULT 0, timer_mode text DEFAULT 'test',
 questions_count integer DEFAULT 0, total_marks numeric DEFAULT 0, is_published boolean DEFAULT false, sort_order integer DEFAULT 0,
 exam_track text DEFAULT '', level text DEFAULT 'Mixed', series_name text DEFAULT '',
 is_paid boolean DEFAULT false, price_inr integer DEFAULT 0, price_coins integer DEFAULT 0,
 question_source text DEFAULT 'manual', generation_exam text DEFAULT 'All Exams', generation_subject text DEFAULT '',
 generation_topic text DEFAULT 'Mixed', generation_difficulty text DEFAULT 'Mixed', generation_count integer DEFAULT 0,
 generation_marks numeric DEFAULT 1, generation_negative_marks numeric DEFAULT 0,
 syllabus_subject text DEFAULT '', syllabus_chapter text DEFAULT '', syllabus_topic text DEFAULT '',
 easy_request_hash text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_test_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), test_id uuid NOT NULL REFERENCES public.kkcc_tests(id) ON DELETE CASCADE,
 question_text text NOT NULL, subject text DEFAULT '', options text[] NOT NULL, correct_index integer NOT NULL,
 marks numeric DEFAULT 1, negative_marks numeric DEFAULT 0, explanation text DEFAULT '', sort_order integer DEFAULT 0,
 created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kkcc_test_questions_order ON public.kkcc_test_questions(test_id,sort_order);
ALTER TABLE public.kkcc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_test_questions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_tests,public.kkcc_test_questions FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_tests,public.kkcc_test_questions TO service_role;
-- Copy legacy rows using shared columns; do not replace newer managed edits.
DO $$ DECLARE src text; dst text; cols text; BEGIN
 FOREACH src IN ARRAY ARRAY['tests','test_questions'] LOOP
  dst := 'kkcc_' || src;
  IF to_regclass('public.' || src) IS NOT NULL THEN
   SELECT string_agg(format('%I',s.column_name),',' ORDER BY s.ordinal_position) INTO cols
   FROM information_schema.columns s JOIN information_schema.columns d ON d.column_name=s.column_name
   WHERE s.table_schema='public' AND s.table_name=src AND d.table_schema='public' AND d.table_name=dst;
   EXECUTE format('INSERT INTO public.%I (%s) SELECT %s FROM public.%I ON CONFLICT(id) DO NOTHING',dst,cols,cols,src);
  END IF;
 END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.kkcc_refresh_test_counts() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE tid uuid; BEGIN
 tid := CASE WHEN TG_OP='DELETE' THEN OLD.test_id ELSE NEW.test_id END;
 UPDATE public.kkcc_tests SET questions_count=(SELECT count(*) FROM public.kkcc_test_questions WHERE test_id=tid),
 total_marks=coalesce((SELECT sum(marks) FROM public.kkcc_test_questions WHERE test_id=tid),0),updated_at=now()
 WHERE id=tid AND question_source='manual';
 RETURN NULL; END $$;
DROP TRIGGER IF EXISTS kkcc_refresh_test_counts ON public.kkcc_test_questions;
CREATE TRIGGER kkcc_refresh_test_counts AFTER INSERT OR UPDATE OR DELETE ON public.kkcc_test_questions FOR EACH ROW EXECUTE FUNCTION public.kkcc_refresh_test_counts();
REVOKE ALL ON FUNCTION public.kkcc_refresh_test_counts() FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.publish_easy_text_test(p_actor uuid,p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE tid uuid; q jsonb; n integer; pos integer:=0; fingerprint text; old_hash text; BEGIN
 IF auth.role()<>'service_role' OR NOT public.has_role(p_actor,'admin') THEN RAISE EXCEPTION 'Admin server only'; END IF;
 tid := (p_payload->>'id')::uuid;
 IF tid IS NULL OR jsonb_typeof(p_payload->'questions') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid questions'; END IF;
 n:=jsonb_array_length(p_payload->'questions');
 IF n NOT BETWEEN 1 AND 200 OR coalesce(length(trim(p_payload->>'subject')),0)=0 OR coalesce(length(trim(p_payload->>'chapter')),0)=0 OR coalesce(length(trim(p_payload->>'title')),0)<2 OR (p_payload->>'duration_minutes')::integer NOT BETWEEN 1 AND 300 THEN RAISE EXCEPTION 'Invalid test details'; END IF;
 fingerprint:=md5(p_payload::text);
 PERFORM pg_advisory_xact_lock(hashtext(tid::text));
 SELECT easy_request_hash INTO old_hash FROM public.kkcc_tests WHERE id=tid;
 IF FOUND THEN
   IF old_hash IS DISTINCT FROM fingerprint THEN RAISE EXCEPTION 'Test already saved with different content. Open it in Advanced to edit.'; END IF;
   RETURN jsonb_build_object('id',tid,'count',n);
 END IF;
 INSERT INTO public.kkcc_tests(id,title,instructions,subject,duration_minutes,syllabus_subject,syllabus_chapter,series_name,easy_request_hash,is_published,question_source)
 VALUES(tid,p_payload->>'title','Answer every question. 1 mark each; no negative marking.',p_payload->>'subject',(p_payload->>'duration_minutes')::integer,p_payload->>'subject',p_payload->>'chapter',coalesce(p_payload->>'series_name',''),fingerprint,false,'manual');
 FOR q IN SELECT value FROM jsonb_array_elements(p_payload->'questions') LOOP
  IF coalesce(length(trim(q->>'question_text')),0)<3 OR jsonb_typeof(q->'options') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid question'; END IF;
  IF jsonb_array_length(q->'options') NOT BETWEEN 2 AND 4 OR q->>'correct_index' IS NULL OR (q->>'correct_index')::integer NOT BETWEEN 0 AND jsonb_array_length(q->'options')-1 THEN RAISE EXCEPTION 'Invalid answer/options'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(q->'options') v WHERE jsonb_typeof(v)<>'string' OR length(trim(v#>>'{}'))=0) OR (SELECT count(DISTINCT lower(trim(value))) FROM jsonb_array_elements_text(q->'options'))<>jsonb_array_length(q->'options') THEN RAISE EXCEPTION 'Empty/duplicate options'; END IF;
  INSERT INTO public.kkcc_test_questions(test_id,question_text,subject,options,correct_index,marks,negative_marks,explanation,sort_order)
  VALUES(tid,q->>'question_text',p_payload->>'subject',ARRAY(SELECT jsonb_array_elements_text(q->'options')),(q->>'correct_index')::integer,1,0,coalesce(q->>'explanation',''),pos);
  pos:=pos+1;
 END LOOP;
 UPDATE public.kkcc_tests SET is_published=true WHERE id=tid;
 RETURN jsonb_build_object('id',tid,'count',n);
END $$;
REVOKE ALL ON FUNCTION public.publish_easy_text_test(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.publish_easy_text_test(uuid,jsonb) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;

-- Paid Easy Text Test; versioned RPC prevents old SQL from silently publishing paid content as free.
BEGIN;
CREATE OR REPLACE FUNCTION public.publish_easy_text_test_v2(p_actor uuid,p_payload jsonb) RETURNS jsonb
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
 INSERT INTO public.kkcc_tests(id,title,instructions,subject,duration_minutes,syllabus_subject,syllabus_chapter,series_name,easy_request_hash,is_published,question_source,is_paid,price_inr,price_coins)
 VALUES(tid,p_payload->>'title','Answer every question. 1 mark each; no negative marking.',p_payload->>'subject',(p_payload->>'duration_minutes')::integer,p_payload->>'subject',p_payload->>'chapter',coalesce(p_payload->>'series_name',''),fingerprint,false,'manual',paid,rupees,coins);
 FOR q IN SELECT value FROM jsonb_array_elements(p_payload->'questions') LOOP
  IF coalesce(length(trim(q->>'question_text')),0)<3 OR jsonb_typeof(q->'options') IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Invalid question'; END IF;
  IF jsonb_array_length(q->'options') NOT BETWEEN 2 AND 4 OR q->>'correct_index' IS NULL OR (q->>'correct_index')::integer NOT BETWEEN 0 AND jsonb_array_length(q->'options')-1 THEN RAISE EXCEPTION 'Invalid answer/options'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_array_elements(q->'options') v WHERE jsonb_typeof(v)<>'string' OR length(trim(v#>>'{}'))=0) OR (SELECT count(DISTINCT lower(trim(value))) FROM jsonb_array_elements_text(q->'options'))<>jsonb_array_length(q->'options') THEN RAISE EXCEPTION 'Empty/duplicate options'; END IF;
  INSERT INTO public.kkcc_test_questions(test_id,question_text,subject,options,correct_index,marks,negative_marks,explanation,sort_order)
  VALUES(tid,q->>'question_text',p_payload->>'subject',ARRAY(SELECT jsonb_array_elements_text(q->'options')),(q->>'correct_index')::integer,1,0,coalesce(q->>'explanation',''),pos);
  pos:=pos+1;
 END LOOP;
 UPDATE public.kkcc_tests SET is_published=true WHERE id=tid;
 RETURN jsonb_build_object('id',tid,'count',n);
END $$;
REVOKE ALL ON FUNCTION public.publish_easy_text_test_v2(uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.publish_easy_text_test_v2(uuid,jsonb) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
