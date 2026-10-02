-- Student Doubt Centre + personal notifications + future-ready content update notifications.

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS target_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.notifications
  DROP CONSTRAINT IF EXISTS notifications_audience_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_audience_check
  CHECK (audience IN ('all', 'students', 'admins', 'course', 'user'));

CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON public.notifications(target_user_id, created_at DESC);

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
      OR (audience = 'user' AND target_user_id = auth.uid())
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

CREATE TABLE IF NOT EXISTS public.student_doubts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  subject text NOT NULL DEFAULT 'General',
  title text NOT NULL,
  message text NOT NULL,
  attachment_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normal',
  admin_reply text NOT NULL DEFAULT '',
  answered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_doubts_status_check CHECK (status IN ('open', 'answered', 'closed')),
  CONSTRAINT student_doubts_priority_check CHECK (priority IN ('low', 'normal', 'high'))
);

ALTER TABLE public.student_doubts
  ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS attachment_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS admin_reply text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS answered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS answered_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_student_doubts_user ON public.student_doubts(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_doubts_course ON public.student_doubts(course_id, status);
CREATE INDEX IF NOT EXISTS idx_student_doubts_status ON public.student_doubts(status, priority, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_doubts TO authenticated;
GRANT ALL ON public.student_doubts TO service_role;
ALTER TABLE public.student_doubts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can create their own doubts" ON public.student_doubts;
CREATE POLICY "Students can create their own doubts"
  ON public.student_doubts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can view their own doubts" ON public.student_doubts;
CREATE POLICY "Students can view their own doubts"
  ON public.student_doubts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all doubts" ON public.student_doubts;
CREATE POLICY "Admins can manage all doubts"
  ON public.student_doubts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_student_doubts_updated_at ON public.student_doubts;
CREATE TRIGGER update_student_doubts_updated_at
  BEFORE UPDATE ON public.student_doubts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
