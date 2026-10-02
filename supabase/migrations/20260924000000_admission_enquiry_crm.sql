-- Admission / enquiry CRM for future admissions and follow-ups.

CREATE TABLE IF NOT EXISTS public.admission_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  class_level text NOT NULL DEFAULT '',
  interest text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'support',
  status text NOT NULL DEFAULT 'new',
  priority text NOT NULL DEFAULT 'normal',
  admin_note text NOT NULL DEFAULT '',
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admission_enquiries_status_check CHECK (status IN ('new', 'contacted', 'admitted', 'closed', 'spam')),
  CONSTRAINT admission_enquiries_priority_check CHECK (priority IN ('low', 'normal', 'high'))
);

ALTER TABLE public.admission_enquiries
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS class_level text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS interest text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'support',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS admin_note text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_admission_enquiries_status ON public.admission_enquiries(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admission_enquiries_email ON public.admission_enquiries(lower(email));
CREATE INDEX IF NOT EXISTS idx_admission_enquiries_phone ON public.admission_enquiries(phone);

GRANT INSERT ON public.admission_enquiries TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON public.admission_enquiries TO authenticated;
GRANT ALL ON public.admission_enquiries TO service_role;
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Anyone can submit admission enquiries"
  ON public.admission_enquiries FOR INSERT
  WITH CHECK (
    status = 'new'
    AND admin_note = ''
    AND last_contacted_at IS NULL
  );

DROP POLICY IF EXISTS "Admins can manage admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Admins can manage admission enquiries"
  ON public.admission_enquiries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_admission_enquiries_updated_at ON public.admission_enquiries;
CREATE TRIGGER update_admission_enquiries_updated_at
  BEFORE UPDATE ON public.admission_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.notify_admins_on_admission_enquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    title,
    message,
    type,
    audience,
    course_id,
    priority,
    action_label,
    action_url,
    is_published,
    send_at,
    expires_at,
    created_by
  ) VALUES (
    'New admission enquiry: ' || NEW.name,
    concat_ws(E'\n',
      'Name: ' || NEW.name,
      'Email: ' || NEW.email,
      CASE WHEN NEW.phone <> '' THEN 'Phone: ' || NEW.phone ELSE NULL END,
      CASE WHEN NEW.class_level <> '' THEN 'Class/target: ' || NEW.class_level ELSE NULL END,
      CASE WHEN NEW.interest <> '' THEN 'Interest: ' || NEW.interest ELSE NULL END,
      NEW.message
    ),
    'enquiry',
    'admins',
    NULL,
    NEW.priority,
    'Open enquiry',
    '/admin/enquiries',
    true,
    NULL,
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS admission_enquiries_notify_admins ON public.admission_enquiries;
CREATE TRIGGER admission_enquiries_notify_admins
  AFTER INSERT ON public.admission_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_admission_enquiry();
