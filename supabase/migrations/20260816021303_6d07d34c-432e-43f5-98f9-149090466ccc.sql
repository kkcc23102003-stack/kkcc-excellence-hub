CREATE TABLE public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  instructions text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 60,
  questions_count integer NOT NULL DEFAULT 0,
  total_marks integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tests TO authenticated;
GRANT ALL ON public.tests TO service_role;

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published tests are viewable by everyone" ON public.tests
FOR SELECT USING (is_published AND (course_id IS NULL OR EXISTS (
  SELECT 1 FROM public.courses c WHERE c.id = tests.course_id AND c.status = 'published')));

CREATE POLICY "Admins can view all tests" ON public.tests
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage tests" ON public.tests
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.refresh_course_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cid uuid;
BEGIN
  cid := COALESCE(NEW.course_id, OLD.course_id);
  IF cid IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;
  UPDATE public.courses c SET
    lectures_count = (SELECT count(*) FROM public.lectures l WHERE l.course_id = cid),
    materials_count = (SELECT count(*) FROM public.materials m WHERE m.course_id = cid),
    tests_count = (SELECT count(*) FROM public.tests t WHERE t.course_id = cid)
  WHERE c.id = cid;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER lectures_refresh_counts AFTER INSERT OR UPDATE OR DELETE ON public.lectures
FOR EACH ROW EXECUTE FUNCTION public.refresh_course_counts();
CREATE TRIGGER materials_refresh_counts AFTER INSERT OR UPDATE OR DELETE ON public.materials
FOR EACH ROW EXECUTE FUNCTION public.refresh_course_counts();
CREATE TRIGGER tests_refresh_counts AFTER INSERT OR UPDATE OR DELETE ON public.tests
FOR EACH ROW EXECUTE FUNCTION public.refresh_course_counts();

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

UPDATE public.courses c SET
  lectures_count = (SELECT count(*) FROM public.lectures l WHERE l.course_id = c.id),
  materials_count = (SELECT count(*) FROM public.materials m WHERE m.course_id = c.id),
  tests_count = (SELECT count(*) FROM public.tests t WHERE t.course_id = c.id);