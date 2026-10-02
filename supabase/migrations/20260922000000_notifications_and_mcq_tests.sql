-- Admin notifications + text-to-MCQ test questions.

CREATE TABLE IF NOT EXISTS public.test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  subject text NOT NULL DEFAULT '',
  options text[] NOT NULL DEFAULT '{}',
  correct_index integer NOT NULL DEFAULT 0,
  marks integer NOT NULL DEFAULT 4,
  negative_marks integer NOT NULL DEFAULT 1,
  explanation text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_questions_options_min CHECK (array_length(options, 1) >= 2),
  CONSTRAINT test_questions_correct_index_range CHECK (correct_index >= 0 AND correct_index < COALESCE(array_length(options, 1), 0)),
  CONSTRAINT test_questions_marks_nonnegative CHECK (marks >= 0 AND negative_marks >= 0)
);

ALTER TABLE public.test_questions
  ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS options text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS correct_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS marks integer NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS negative_marks integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS explanation text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_test_questions_test_order ON public.test_questions(test_id, sort_order);

GRANT SELECT ON public.test_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_questions TO authenticated;
GRANT ALL ON public.test_questions TO service_role;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published test questions are viewable by everyone" ON public.test_questions;
CREATE POLICY "Published test questions are viewable by everyone"
  ON public.test_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tests t
    WHERE t.id = test_questions.test_id
      AND t.is_published = true
      AND (t.course_id IS NULL OR EXISTS (
        SELECT 1 FROM public.courses c WHERE c.id = t.course_id AND c.status = 'published'
      ))
  ));

DROP POLICY IF EXISTS "Admins can manage test questions" ON public.test_questions;
CREATE POLICY "Admins can manage test questions"
  ON public.test_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_test_questions_updated_at ON public.test_questions;
CREATE TRIGGER update_test_questions_updated_at
  BEFORE UPDATE ON public.test_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.refresh_test_question_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tid uuid;
BEGIN
  tid := COALESCE(NEW.test_id, OLD.test_id);
  IF tid IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;
  UPDATE public.tests t SET
    questions_count = (SELECT count(*) FROM public.test_questions q WHERE q.test_id = tid),
    total_marks = COALESCE((SELECT sum(q.marks) FROM public.test_questions q WHERE q.test_id = tid), 0),
    updated_at = now()
  WHERE t.id = tid;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS test_questions_refresh_counts ON public.test_questions;
CREATE TRIGGER test_questions_refresh_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.test_questions
  FOR EACH ROW EXECUTE FUNCTION public.refresh_test_question_counts();

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'announcement',
  audience text NOT NULL DEFAULT 'all',
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  priority text NOT NULL DEFAULT 'normal',
  action_label text NOT NULL DEFAULT '',
  action_url text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  send_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notifications_audience_check CHECK (audience IN ('all', 'students', 'admins', 'course')),
  CONSTRAINT notifications_priority_check CHECK (priority IN ('low', 'normal', 'high'))
);

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'announcement',
  ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS action_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS action_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS send_at timestamptz,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_notifications_visible ON public.notifications(is_published, send_at, expires_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_audience ON public.notifications(audience, course_id);

GRANT SELECT ON public.notifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read general published notifications" ON public.notifications;
CREATE POLICY "Public can read general published notifications"
  ON public.notifications FOR SELECT TO anon
  USING (
    is_published = true
    AND audience IN ('all', 'students')
    AND (send_at IS NULL OR send_at <= now())
    AND (expires_at IS NULL OR expires_at > now())
  );

DROP POLICY IF EXISTS "Authenticated users can read targeted published notifications" ON public.notifications;
CREATE POLICY "Authenticated users can read targeted published notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (
    is_published = true
    AND (send_at IS NULL OR send_at <= now())
    AND (expires_at IS NULL OR expires_at > now())
    AND (
      audience IN ('all', 'students')
      OR (audience = 'admins' AND public.has_role(auth.uid(), 'admin'))
      OR (
        audience = 'course'
        AND EXISTS (
          SELECT 1 FROM public.course_enrollments ce
          WHERE ce.user_id = auth.uid()
            AND ce.course_id = notifications.course_id
            AND ce.status = 'active'
        )
      )
    )
  );

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.notification_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (notification_id, user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_reads_unique ON public.notification_reads(notification_id, user_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_user ON public.notification_reads(user_id, read_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their notification reads" ON public.notification_reads;
CREATE POLICY "Users can view their notification reads"
  ON public.notification_reads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their notifications read" ON public.notification_reads;
CREATE POLICY "Users can mark their notifications read"
  ON public.notification_reads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notification reads" ON public.notification_reads;
CREATE POLICY "Users can update their notification reads"
  ON public.notification_reads FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all notification reads" ON public.notification_reads;
CREATE POLICY "Admins can view all notification reads"
  ON public.notification_reads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
