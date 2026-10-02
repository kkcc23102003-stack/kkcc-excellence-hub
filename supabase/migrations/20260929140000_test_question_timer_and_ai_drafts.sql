-- Per-test question timer controls for admin-created tests.

ALTER TABLE public.tests
  ADD COLUMN IF NOT EXISTS question_timer_seconds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS timer_mode text NOT NULL DEFAULT 'test';

ALTER TABLE public.tests
  DROP CONSTRAINT IF EXISTS tests_timer_mode_check;
ALTER TABLE public.tests
  ADD CONSTRAINT tests_timer_mode_check CHECK (timer_mode IN ('test', 'question', 'unlimited'));

ALTER TABLE public.tests
  DROP CONSTRAINT IF EXISTS tests_question_timer_seconds_check;
ALTER TABLE public.tests
  ADD CONSTRAINT tests_question_timer_seconds_check CHECK (question_timer_seconds >= 0 AND question_timer_seconds <= 7200);

COMMENT ON COLUMN public.tests.question_timer_seconds IS 'Per-question timer in seconds when timer_mode is question. 0 means no per-question limit.';
COMMENT ON COLUMN public.tests.timer_mode IS 'test = normal whole-test timer, question = per-question timer, unlimited = no timer; next question appears when student clicks Next.';
