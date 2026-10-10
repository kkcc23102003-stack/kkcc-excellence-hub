-- Requires Test Folders setup. Atomic rename/delete for the manual-test organiser only.
BEGIN;
CREATE OR REPLACE FUNCTION public.manage_test_outline(
 p_actor uuid, p_level text, p_action text, p_path jsonb,
 p_name text, p_expected_ids uuid[]
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE
 s text:=coalesce(p_path->>'series_name',''); u text:=coalesce(p_path->>'subject','');
 c text:=coalesce(p_path->>'chapter',''); t text:=coalesce(p_path->>'topic','');
 ns text; nu text; nc text; nt text; old_name text; tids uuid[]; fids uuid[];
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT public.has_role(p_actor,'admin') THEN RAISE EXCEPTION 'Admin server only'; END IF;
 IF p_level NOT IN ('series','subject','chapter','topic') OR p_action NOT IN ('rename','delete') OR p_level IS NULL OR p_action IS NULL THEN RAISE EXCEPTION 'Invalid outline action'; END IF;
 IF (p_level='series' AND (u<>'' OR c<>'' OR t<>'')) OR
    (p_level='subject' AND (u='' OR c<>'' OR t<>'')) OR
    (p_level='chapter' AND (u='' OR c='' OR t<>'')) OR
    (p_level='topic' AND (u='' OR c='' OR t='')) THEN RAISE EXCEPTION 'Invalid outline path'; END IF;
 LOCK TABLE public.kkcc_tests,public.kkcc_test_questions,public.kkcc_test_folders IN SHARE ROW EXCLUSIVE MODE;
 SELECT coalesce(array_agg(id ORDER BY id),'{}'::uuid[]) INTO tids FROM public.kkcc_tests
 WHERE question_source='manual' AND series_name=s
 AND (u='' OR coalesce(nullif(syllabus_subject,''),subject)=u)
 AND (c='' OR coalesce(syllabus_chapter,'')=c) AND (t='' OR coalesce(syllabus_topic,'')=t);
 IF tids IS DISTINCT FROM ARRAY(SELECT DISTINCT x FROM unnest(coalesce(p_expected_ids,'{}'::uuid[])) x ORDER BY x) THEN
  RAISE EXCEPTION 'Saved tests changed. Reload the organiser and confirm again.';
 END IF;
 SELECT coalesce(array_agg(id),'{}'::uuid[]) INTO fids FROM public.kkcc_test_folders
 WHERE series_name=s AND (u='' OR subject=u) AND (c='' OR chapter=c) AND (t='' OR topic=t);
 IF cardinality(fids)=0 AND cardinality(tids)=0 THEN RAISE EXCEPTION 'Folder no longer exists. Reload the organiser.'; END IF;
 IF p_action='delete' THEN
  DELETE FROM public.kkcc_tests WHERE id=ANY(tids);
  DELETE FROM public.kkcc_test_folders WHERE id=ANY(fids);
 ELSE
  p_name:=trim(coalesce(p_name,''));
  IF length(p_name)=0 OR length(p_name)>(CASE WHEN p_level='subject' THEN 80 ELSE 120 END) THEN RAISE EXCEPTION 'Invalid new name'; END IF;
  old_name:=CASE p_level WHEN 'series' THEN s WHEN 'subject' THEN u WHEN 'chapter' THEN c ELSE t END;
  IF p_name=old_name THEN RETURN jsonb_build_object('tests',cardinality(tids),'folders',cardinality(fids)); END IF;
  ns:=CASE WHEN p_level='series' THEN p_name ELSE s END;
  nu:=CASE WHEN p_level='subject' THEN p_name ELSE u END;
  nc:=CASE WHEN p_level='chapter' THEN p_name ELSE c END;
  nt:=CASE WHEN p_level='topic' THEN p_name ELSE t END;
  IF EXISTS(SELECT 1 FROM public.kkcc_test_folders WHERE series_name=ns AND (nu='' OR subject=nu) AND (nc='' OR chapter=nc) AND (nt='' OR topic=nt)) OR
     EXISTS(SELECT 1 FROM public.kkcc_tests WHERE question_source='manual' AND series_name=ns AND (nu='' OR coalesce(nullif(syllabus_subject,''),subject)=nu) AND (nc='' OR coalesce(syllabus_chapter,'')=nc) AND (nt='' OR coalesce(syllabus_topic,'')=nt)) THEN
   RAISE EXCEPTION 'That name already exists here. Choose another name; folders will not be merged.';
  END IF;
  UPDATE public.kkcc_test_folders SET
   series_name=CASE WHEN p_level='series' THEN p_name ELSE series_name END,
   subject=CASE WHEN p_level='subject' THEN p_name ELSE subject END,
   chapter=CASE WHEN p_level='chapter' THEN p_name ELSE chapter END,
   topic=CASE WHEN p_level='topic' THEN p_name ELSE topic END WHERE id=ANY(fids);
  UPDATE public.kkcc_tests SET
   series_name=CASE WHEN p_level='series' THEN p_name ELSE series_name END,
   subject=CASE WHEN p_level='subject' THEN p_name ELSE subject END,
   syllabus_subject=CASE WHEN p_level='subject' THEN p_name ELSE syllabus_subject END,
   syllabus_chapter=CASE WHEN p_level='chapter' THEN p_name ELSE syllabus_chapter END,
   syllabus_topic=CASE WHEN p_level='topic' THEN p_name ELSE syllabus_topic END,
   updated_at=now() WHERE id=ANY(tids);
  -- Persisted attempt selections follow renamed subjects/chapters; question IDs and answers stay intact.
  IF p_level IN ('subject','chapter') AND p_path ? 'encoded_old' AND p_path ? 'encoded_new' THEN
   UPDATE public.learning_attempts a SET source_refs=ARRAY(
    SELECT CASE WHEN left(ref,14)='__kkcc_meta__:' AND
      split_part(ref,':',CASE WHEN p_level='subject' THEN 2 ELSE 3 END)=p_path->>'encoded_old'
     THEN '__kkcc_meta__:' ||
       CASE WHEN p_level='subject' THEN p_path->>'encoded_new' ELSE split_part(ref,':',2) END || ':' ||
       CASE WHEN p_level='chapter' THEN p_path->>'encoded_new' ELSE split_part(ref,':',3) END || ':' || split_part(ref,':',4)
     ELSE ref END FROM unnest(a.source_refs) WITH ORDINALITY AS refs(ref,ord) ORDER BY ord
   ) WHERE a.test_id=ANY(tids);
  END IF;
  IF p_level='subject' THEN
   UPDATE public.kkcc_test_questions SET subject=p_name,updated_at=now()
   WHERE test_id=ANY(tids) AND (subject=u OR subject='' OR subject='General');
  END IF;
 END IF;
 RETURN jsonb_build_object('tests',cardinality(tids),'folders',cardinality(fids));
END $$;
REVOKE ALL ON FUNCTION public.manage_test_outline(uuid,text,text,jsonb,text,uuid[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.manage_test_outline(uuid,text,text,jsonb,text,uuid[]) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
