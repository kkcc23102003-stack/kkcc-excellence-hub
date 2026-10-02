-- Platform controls for KKCC: initial owner admin, admin-managed roles,
-- manual/offline enrolments, payment settings, and future storage switching.

-- Keep student email searchable for admin user management.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (lower(email));

-- Earlier base migrations granted authenticated users SELECT on roles only.
-- Admins need insert/delete grants plus RLS policy to manage team access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Refresh profile creation to also store email and automatically grant the
-- initial owner account admin access when it signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, mobile, class_level, target_exam)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'mobile', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'class_level', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'target_exam', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    mobile = COALESCE(NULLIF(EXCLUDED.mobile, ''), public.profiles.mobile),
    class_level = COALESCE(NULLIF(EXCLUDED.class_level, ''), public.profiles.class_level),
    target_exam = COALESCE(NULLIF(EXCLUDED.target_exam, ''), public.profiles.target_exam),
    updated_at = now();

  IF lower(COALESCE(NEW.email, '')) = 'kkcc23102003@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill existing profile emails and owner admin if the user already exists.
UPDATE public.profiles p
SET email = COALESCE(u.email, p.email), updated_at = now()
FROM auth.users u
WHERE p.id = u.id AND COALESCE(p.email, '') IS DISTINCT FROM COALESCE(u.email, '');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'kkcc23102003@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Manual/free/Razorpay enrolment records.
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  source text NOT NULL DEFAULT 'manual',
  payment_method text NOT NULL DEFAULT 'manual',
  amount_paid integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  admin_note text NOT NULL DEFAULT '',
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id),
  CONSTRAINT course_enrollments_status_check CHECK (status IN ('active','revoked','expired')),
  CONSTRAINT course_enrollments_source_check CHECK (source IN ('free','manual','offline','razorpay','admin'))
);

GRANT SELECT ON public.course_enrollments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view own enrollments"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can view all enrollments"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can claim free published enrollments" ON public.course_enrollments;
CREATE POLICY "Users can claim free published enrollments"
  ON public.course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND source = 'free'
    AND amount_paid = 0
    AND EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.status = 'published' AND c.price = 0
    )
  );

DROP POLICY IF EXISTS "Admins can manage enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can manage enrollments"
  ON public.course_enrollments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON public.course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
  BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON public.course_enrollments(course_id, status);

-- File metadata makes future storage migration safe without breaking old links.
CREATE TABLE IF NOT EXISTS public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'supabase',
  bucket text NOT NULL DEFAULT 'course-content',
  path text NOT NULL,
  public_url text NOT NULL DEFAULT '',
  original_url text NOT NULL DEFAULT '',
  mime_type text NOT NULL DEFAULT '',
  size_bytes bigint NOT NULL DEFAULT 0,
  linked_table text NOT NULL DEFAULT '',
  linked_id uuid,
  migration_status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.files TO authenticated;
GRANT SELECT ON public.files TO anon;
GRANT ALL ON public.files TO service_role;

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published file metadata is readable" ON public.files;
CREATE POLICY "Published file metadata is readable"
  ON public.files FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage file metadata" ON public.files;
CREATE POLICY "Admins can manage file metadata"
  ON public.files FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_files_updated_at ON public.files;
CREATE TRIGGER update_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_files_provider ON public.files(provider, migration_status);
CREATE INDEX IF NOT EXISTS idx_files_linked ON public.files(linked_table, linked_id);

-- Public/admin-safe integration settings. Secrets go in private_settings.
CREATE TABLE IF NOT EXISTS public.private_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.private_settings TO authenticated;
GRANT ALL ON public.private_settings TO service_role;

ALTER TABLE public.private_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage private settings" ON public.private_settings;
CREATE POLICY "Admins can manage private settings"
  ON public.private_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_private_settings_updated_at ON public.private_settings;
CREATE TRIGGER update_private_settings_updated_at
  BEFORE UPDATE ON public.private_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Payment transaction audit table for future Razorpay verification and manual payments.
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  provider text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'pending',
  amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  provider_order_id text NOT NULL DEFAULT '',
  provider_payment_id text NOT NULL DEFAULT '',
  admin_note text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view own payment transactions"
  ON public.payment_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage payment transactions" ON public.payment_transactions;
CREATE POLICY "Admins can manage payment transactions"
  ON public.payment_transactions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Default editable settings used by admin Payment/Storage pages.
INSERT INTO public.site_settings (key, value) VALUES
  ('payment_provider', 'razorpay'),
  ('payment_enabled', 'false'),
  ('payment_mode', 'test'),
  ('razorpay_key_id', ''),
  ('offline_payment_instructions', 'Use the KKCC inquiry flow for UPI, cash or bank-transfer access. Course access is activated after the KKCC team confirms the payment.'),
  ('storage_provider', 'supabase'),
  ('storage_bucket', 'course-content'),
  ('storage_region', ''),
  ('storage_endpoint', ''),
  ('storage_public_base_url', ''),
  ('storage_migration_status', 'idle')
ON CONFLICT (key) DO NOTHING;
