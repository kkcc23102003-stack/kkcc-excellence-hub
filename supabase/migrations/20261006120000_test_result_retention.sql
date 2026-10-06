-- Installs controls only. Existing results are NOT deleted automatically.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_test_retention (
 id boolean PRIMARY KEY DEFAULT true CHECK(id),
 save_results boolean NOT NULL DEFAULT true,
 epoch uuid NOT NULL DEFAULT gen_random_uuid(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.kkcc_test_retention(id) VALUES(true) ON CONFLICT DO NOTHING;
ALTER TABLE public.kkcc_test_retention ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_test_retention FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_test_retention TO service_role;

CREATE OR REPLACE FUNCTION public.get_test_retention() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 RETURN (SELECT jsonb_build_object('save_results',save_results,'epoch',epoch) FROM public.kkcc_test_retention WHERE id);
END $$;
REVOKE ALL ON FUNCTION public.get_test_retention() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_test_retention() TO authenticated;

CREATE OR REPLACE FUNCTION public.guard_test_retention() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE enabled boolean;
BEGIN
 SELECT save_results INTO enabled FROM public.kkcc_test_retention WHERE id FOR SHARE;
 IF NOT coalesce(enabled,false) THEN RAISE EXCEPTION 'Test result saving is OFF. Start a new temporary test.'; END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.guard_test_retention() FROM PUBLIC,anon,authenticated;
DROP TRIGGER IF EXISTS guard_test_retention ON public.learning_attempts;
CREATE TRIGGER guard_test_retention BEFORE INSERT OR UPDATE OF answers,status,score,total_marks,correct_count,attempted_count,answer_revision
ON public.learning_attempts FOR EACH ROW EXECUTE FUNCTION public.guard_test_retention();

CREATE OR REPLACE FUNCTION public.admin_test_retention(
 p_action text DEFAULT 'preview', p_enabled boolean DEFAULT NULL,
 p_before timestamptz DEFAULT NULL, p_confirmation text DEFAULT ''
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE policy public.kkcc_test_retention%ROWTYPE; removed integer:=0; cutoff timestamptz:=clock_timestamp();
BEGIN
 IF NOT coalesce(public.has_role(auth.uid(),'admin'),false) THEN RAISE EXCEPTION 'Admin access required'; END IF;
 SELECT * INTO policy FROM public.kkcc_test_retention WHERE id FOR UPDATE;
 IF p_action='set' THEN
  IF p_enabled IS NULL THEN RAISE EXCEPTION 'Choose ON or OFF'; END IF;
  UPDATE public.kkcc_test_retention SET save_results=p_enabled,
   epoch=CASE WHEN save_results IS DISTINCT FROM p_enabled THEN gen_random_uuid() ELSE epoch END,
   updated_at=clock_timestamp() WHERE id RETURNING * INTO policy;
 ELSIF p_action='cleanup' THEN
  IF policy.save_results THEN RAISE EXCEPTION 'Turn result saving OFF before cleanup'; END IF;
  IF p_confirmation IS DISTINCT FROM 'DELETE TEST HISTORY' OR p_before IS NULL OR p_before>clock_timestamp() THEN RAISE EXCEPTION 'Preview and confirm DELETE TEST HISTORY first'; END IF;
  cutoff:=p_before;
  DELETE FROM public.learning_attempts WHERE id IN (
   SELECT id FROM public.learning_attempts WHERE started_at<=cutoff ORDER BY started_at,id LIMIT 5000
  );
  GET DIAGNOSTICS removed=ROW_COUNT;
 ELSIF p_action IS DISTINCT FROM 'preview' THEN RAISE EXCEPTION 'Invalid action';
 END IF;
 RETURN jsonb_build_object('save_results',policy.save_results,'epoch',policy.epoch,
  'cutoff',cutoff,'deleted',removed,'batch_limit',5000,
  'history_count',(SELECT count(*) FROM public.learning_attempts),
  'submitted_count',(SELECT count(*) FROM public.learning_attempts WHERE status='submitted'),
  'eligible_count',(SELECT count(*) FROM public.learning_attempts WHERE started_at<=cutoff));
END $$;
REVOKE ALL ON FUNCTION public.admin_test_retention(text,boolean,timestamptz,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_test_retention(text,boolean,timestamptz,text) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
