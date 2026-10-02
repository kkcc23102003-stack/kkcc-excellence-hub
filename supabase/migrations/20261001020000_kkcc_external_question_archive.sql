-- Keep the question bank out of Supabase storage.
-- Supabase retains only lightweight routing/verification metadata; the full question
-- payload is written to the external S3-compatible archive configured in Admin → Storage.
ALTER TABLE public.ai_question_candidates
  ADD COLUMN IF NOT EXISTS archive_key text,
  ADD COLUMN IF NOT EXISTS content_hash text,
  ADD COLUMN IF NOT EXISTS archive_provider text;

CREATE INDEX IF NOT EXISTS idx_ai_candidates_archive_key ON public.ai_question_candidates(archive_key);

-- New rows must not require the old full-content columns. Existing rows remain readable
-- during migration; new engine code writes NULL to these columns and stores content externally.
ALTER TABLE public.ai_question_candidates ALTER COLUMN prompt DROP NOT NULL;
ALTER TABLE public.ai_question_candidates ALTER COLUMN options DROP NOT NULL;
ALTER TABLE public.ai_question_candidates ALTER COLUMN explanation DROP NOT NULL;

COMMENT ON TABLE public.ai_question_candidates IS 'Lightweight AI question-bank index only. Full question payload lives in external S3-compatible archive; do not populate prompt/options/explanation for new rows.';

-- Approved questions are intentionally retained in the lightweight index so they remain
-- discoverable by the admin panel and usable for future tests. The large payload is external.
