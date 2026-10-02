-- KKCC on-demand deterministic test papers.
--
-- A published generated test stores ONLY its generation recipe. The actual
-- question text/options/explanations are generated in the server request from
-- the local deterministic template bank and are never inserted into
-- public.test_questions.

ALTER TABLE public.tests
  ADD COLUMN IF NOT EXISTS question_source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS generation_exam text NOT NULL DEFAULT 'All Exams',
  ADD COLUMN IF NOT EXISTS generation_subject text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS generation_topic text NOT NULL DEFAULT 'Mixed',
  ADD COLUMN IF NOT EXISTS generation_difficulty text NOT NULL DEFAULT 'Difficult',
  ADD COLUMN IF NOT EXISTS generation_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.tests
  DROP CONSTRAINT IF EXISTS tests_question_source_check;
ALTER TABLE public.tests
  ADD CONSTRAINT tests_question_source_check
  CHECK (question_source IN ('manual', 'deterministic'));

ALTER TABLE public.tests
  DROP CONSTRAINT IF EXISTS tests_generation_difficulty_check;
ALTER TABLE public.tests
  ADD CONSTRAINT tests_generation_difficulty_check
  CHECK (generation_difficulty IN ('Easy', 'Moderate', 'Difficult', 'Mixed'));

ALTER TABLE public.tests
  DROP CONSTRAINT IF EXISTS tests_generation_count_check;
ALTER TABLE public.tests
  ADD CONSTRAINT tests_generation_count_check
  CHECK (generation_count >= 0 AND generation_count <= 1000);

COMMENT ON COLUMN public.tests.question_source IS
  'manual = questions come from public.test_questions; deterministic = fresh questions are generated on demand and are never stored.';
COMMENT ON COLUMN public.tests.generation_exam IS 'Exam filter used by the deterministic question generator.';
COMMENT ON COLUMN public.tests.generation_subject IS 'Subject filter used by the deterministic question generator.';
COMMENT ON COLUMN public.tests.generation_topic IS 'Topic/chapter filter; Mixed means all chapters in the subject.';
COMMENT ON COLUMN public.tests.generation_difficulty IS 'Difficulty layer for generated papers; Mixed splits the requested count across all three levels.';
COMMENT ON COLUMN public.tests.generation_count IS 'Number of fresh questions requested each time the paper is opened.';

-- The current KKCC build intentionally does not use the AI question engine.
-- Keep its legacy tables for compatibility, but make the engine explicitly off.
INSERT INTO public.private_settings(key, value)
VALUES
  ('ai_question_engine_enabled', 'false'),
  ('ai_question_engine_auto_publish', 'false'),
  ('ai_question_engine_google_search', 'false'),
  ('ai_question_engine_gemini_api_key', '')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- IMPORTANT: Existing manually-authored questions are untouched. When an
-- admin switches a test to deterministic generation through the app, the app
-- removes that test's old test_questions rows before enabling generation so
-- the generated paper has no stored MCQ copies.
