-- Durable database bank for AI-authored questions explicitly reviewed by an admin.
-- Candidates remain in the review queue until an admin promotes them; this table
-- is not public and is never populated by the research engine automatically.

CREATE TABLE IF NOT EXISTS public.ai_question_bank (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  uuid NOT NULL UNIQUE REFERENCES public.ai_question_candidates (id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options       jsonb NOT NULL,
  correct_index integer NOT NULL,
  explanation   text NOT NULL,
  exam          text NOT NULL,
  subject       text NOT NULL,
  topic         text NOT NULL,
  difficulty    text NOT NULL,
  quality_score integer NOT NULL,
  source_urls   jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_notes  text NOT NULL DEFAULT '',
  reviewed_by   uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  reviewed_at   timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ai_question_bank_prompt_length CHECK (length(btrim(question_text)) BETWEEN 12 AND 4000),
  CONSTRAINT ai_question_bank_options_shape CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4),
  CONSTRAINT ai_question_bank_correct_index CHECK (correct_index BETWEEN 0 AND 3),
  CONSTRAINT ai_question_bank_explanation_length CHECK (length(btrim(explanation)) BETWEEN 12 AND 6000),
  CONSTRAINT ai_question_bank_exam_length CHECK (length(btrim(exam)) BETWEEN 1 AND 160),
  CONSTRAINT ai_question_bank_subject_length CHECK (length(btrim(subject)) BETWEEN 1 AND 120),
  CONSTRAINT ai_question_bank_topic_length CHECK (length(btrim(topic)) BETWEEN 1 AND 200),
  CONSTRAINT ai_question_bank_difficulty_check CHECK (difficulty IN ('Easy', 'Moderate', 'Difficult')),
  CONSTRAINT ai_question_bank_quality_check CHECK (quality_score BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS idx_ai_question_bank_scope
  ON public.ai_question_bank (exam, subject, topic, difficulty);

COMMENT ON TABLE public.ai_question_bank IS
  'Question bank entries explicitly promoted from the AI review queue by an admin.';

ALTER TABLE public.ai_question_bank ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_question_bank TO authenticated;
GRANT ALL ON public.ai_question_bank TO service_role;

DROP POLICY IF EXISTS "Admins manage reviewed AI question bank" ON public.ai_question_bank;
CREATE POLICY "Admins manage reviewed AI question bank" ON public.ai_question_bank
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_ai_question_bank()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_ai_question_bank ON public.ai_question_bank;
CREATE TRIGGER trg_touch_ai_question_bank
  BEFORE UPDATE ON public.ai_question_bank
  FOR EACH ROW EXECUTE FUNCTION public.touch_ai_question_bank();
