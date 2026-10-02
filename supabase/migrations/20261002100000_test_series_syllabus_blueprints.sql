-- Editable syllabus blueprints for the paid test-series catalogue.
--
-- Admins may save a draft, preview its question-bank mappings, and publish it.
-- Public readers only see published outlines; draft syllabi remain admin-only.
-- Each topic stores an explicit exam-bank subject/topic mapping so runtime
-- generation never substitutes an unrelated question or silently guesses.

CREATE TABLE IF NOT EXISTS public.test_series_syllabi (
  series_id   text PRIMARY KEY,
  exam_track  text NOT NULL,
  syllabus    jsonb NOT NULL DEFAULT '{"subjects":[]}'::jsonb,
  status      text NOT NULL DEFAULT 'draft',
  updated_by  uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT test_series_syllabi_series_id_not_blank
    CHECK (length(btrim(series_id)) BETWEEN 1 AND 120),
  CONSTRAINT test_series_syllabi_exam_track_not_blank
    CHECK (length(btrim(exam_track)) BETWEEN 1 AND 160),
  CONSTRAINT test_series_syllabi_status_check
    CHECK (status IN ('draft', 'published')),
  CONSTRAINT test_series_syllabi_outline_object
    CHECK (jsonb_typeof(syllabus) = 'object' AND jsonb_typeof(syllabus->'subjects') = 'array')
);

CREATE INDEX IF NOT EXISTS idx_test_series_syllabi_published
  ON public.test_series_syllabi (status, series_id);

COMMENT ON TABLE public.test_series_syllabi IS
  'Admin-authored subject/chapter/topic outlines for test series; only published rows are public.';

ALTER TABLE public.test_series_syllabi ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.test_series_syllabi TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.test_series_syllabi TO authenticated;
GRANT ALL ON public.test_series_syllabi TO service_role;

DROP POLICY IF EXISTS "Public reads published series syllabi" ON public.test_series_syllabi;
CREATE POLICY "Public reads published series syllabi" ON public.test_series_syllabi
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage series syllabi" ON public.test_series_syllabi;
CREATE POLICY "Admins manage series syllabi" ON public.test_series_syllabi
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_test_series_syllabi()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_test_series_syllabi ON public.test_series_syllabi;
CREATE TRIGGER trg_touch_test_series_syllabi
  BEFORE UPDATE ON public.test_series_syllabi
  FOR EACH ROW EXECUTE FUNCTION public.touch_test_series_syllabi();
