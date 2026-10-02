-- Admin editable website content + offline access grants by Gmail/name.

INSERT INTO public.site_settings (key, value) VALUES
  ('website_content_json', '')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.offline_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  amount_paid integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  payment_method text NOT NULL DEFAULT 'offline',
  admin_note text NOT NULL DEFAULT '',
  expires_at timestamptz,
  activated_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, course_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_offline_access_email_course
  ON public.offline_access_grants (email, course_id);
CREATE INDEX IF NOT EXISTS idx_offline_access_status ON public.offline_access_grants(status);
CREATE INDEX IF NOT EXISTS idx_offline_access_activated_user ON public.offline_access_grants(activated_user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.offline_access_grants TO authenticated;
GRANT ALL ON public.offline_access_grants TO service_role;
ALTER TABLE public.offline_access_grants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage offline access grants" ON public.offline_access_grants;
CREATE POLICY "Admins can manage offline access grants"
  ON public.offline_access_grants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_offline_access_grants_updated_at ON public.offline_access_grants;
CREATE TRIGGER update_offline_access_grants_updated_at
  BEFORE UPDATE ON public.offline_access_grants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.activate_offline_access_for_user(_user_id uuid, _email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.course_enrollments (
    user_id,
    course_id,
    status,
    source,
    payment_method,
    amount_paid,
    currency,
    admin_note,
    expires_at,
    created_by
  )
  SELECT
    _user_id,
    g.course_id,
    'active',
    'offline',
    g.payment_method,
    g.amount_paid,
    g.currency,
    g.admin_note,
    g.expires_at,
    g.created_by
  FROM public.offline_access_grants g
  WHERE lower(g.email) = lower(COALESCE(_email, ''))
    AND g.status IN ('pending', 'activated')
  ON CONFLICT (user_id, course_id) DO UPDATE SET
    status = 'active',
    source = 'offline',
    payment_method = EXCLUDED.payment_method,
    amount_paid = EXCLUDED.amount_paid,
    currency = EXCLUDED.currency,
    admin_note = EXCLUDED.admin_note,
    expires_at = EXCLUDED.expires_at,
    created_by = COALESCE(EXCLUDED.created_by, public.course_enrollments.created_by),
    updated_at = now();

  UPDATE public.profiles p
  SET full_name = COALESCE(
      NULLIF((
        SELECT g.full_name
        FROM public.offline_access_grants g
        WHERE lower(g.email) = lower(COALESCE(_email, ''))
          AND g.full_name <> ''
        ORDER BY g.updated_at DESC
        LIMIT 1
      ), ''),
      p.full_name
    ),
    updated_at = now()
  WHERE p.id = _user_id;

  UPDATE public.offline_access_grants
  SET status = 'activated',
      activated_user_id = _user_id,
      updated_at = now()
  WHERE lower(email) = lower(COALESCE(_email, ''))
    AND status IN ('pending', 'activated');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.activate_offline_access_for_user(uuid, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.activate_offline_access_for_user(uuid, text) TO authenticated, service_role;

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

  PERFORM public.activate_offline_access_for_user(NEW.id, NEW.email);

  RETURN NEW;
END;
$$;

SELECT public.activate_offline_access_for_user(id, email)
FROM auth.users
WHERE email IS NOT NULL;
