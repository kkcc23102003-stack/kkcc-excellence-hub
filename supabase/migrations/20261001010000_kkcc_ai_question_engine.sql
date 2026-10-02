-- KKCC AI Question Intelligence Engine
-- Stores only compact question candidates/settings; raw web research is never persisted.

CREATE TABLE IF NOT EXISTS public.ai_question_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (exam, subject, topic)
);

CREATE TABLE IF NOT EXISTS public.ai_question_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  options jsonb NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation text NOT NULL,
  exam text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Moderate' CHECK (difficulty IN ('Easy','Moderate','Difficult')),
  quality_score integer NOT NULL DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  source_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('review','approved','rejected')),
  duplicate_key text NOT NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (duplicate_key)
);

CREATE INDEX IF NOT EXISTS idx_ai_candidates_review ON public.ai_question_candidates(status, quality_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_candidates_topic ON public.ai_question_candidates(exam, subject, topic);
CREATE INDEX IF NOT EXISTS idx_ai_targets_schedule ON public.ai_question_targets(enabled, next_run_at, priority DESC);

ALTER TABLE public.ai_question_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_question_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage AI targets" ON public.ai_question_targets;
CREATE POLICY "Admins manage AI targets" ON public.ai_question_targets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage AI candidates" ON public.ai_question_candidates;
CREATE POLICY "Admins manage AI candidates" ON public.ai_question_candidates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_ai_targets_updated_at ON public.ai_question_targets;
CREATE TRIGGER update_ai_targets_updated_at BEFORE UPDATE ON public.ai_question_targets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_ai_candidates_updated_at ON public.ai_question_candidates;
CREATE TRIGGER update_ai_candidates_updated_at BEFORE UPDATE ON public.ai_question_candidates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI configuration lives in the existing private_settings table.
INSERT INTO public.private_settings(key, value)
VALUES
  ('ai_question_engine_enabled','false'),
  ('ai_question_engine_model','gemini-2.5-flash'),
  ('ai_question_engine_daily_limit','30'),
  ('ai_question_engine_min_quality','85'),
  ('ai_question_engine_auto_publish','false'),
  ('ai_question_engine_google_search','true'),
  ('ai_question_engine_gemini_api_key','')
ON CONFLICT (key) DO NOTHING;

-- Keep the free database lean: old rejected candidates are disposable.
CREATE OR REPLACE FUNCTION public.ai_question_engine_cleanup()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.ai_question_candidates
  WHERE status = 'rejected' AND created_at < now() - interval '14 days';
  -- Approved questions are permanent question-bank records; only rejected queue items are disposable.
END;
$$;
GRANT EXECUTE ON FUNCTION public.ai_question_engine_cleanup() TO service_role;


-- 24-hour scheduler support.
-- Supabase Cron invokes the Edge Function every 15 minutes. The function itself
-- respects the configured rolling 24-hour candidate limit and target next_run_at.
-- This keeps the worker alive around the clock without storing raw research.
--
-- ONE-TIME SETUP (Supabase Dashboard):
-- 1) Enable extensions pg_cron and pg_net.
-- 2) Store the following secrets in Vault:
--      kkcc_supabase_url       = your project URL
--      kkcc_ai_cron_secret     = a long random secret matching Edge Function secret AI_CRON_SECRET
-- 3) Set Edge Function secret AI_CRON_SECRET to the same random value.
-- 4) Run the scheduling statements below after replacing nothing; they read Vault.
--
-- The statements are intentionally kept separate from the migration because Vault/extension
-- availability differs between Supabase projects.
