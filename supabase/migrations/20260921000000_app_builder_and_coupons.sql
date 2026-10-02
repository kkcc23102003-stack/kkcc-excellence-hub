-- Live App Builder settings + coupon codes with usage limits.

INSERT INTO public.site_settings (key, value) VALUES
  ('app_builder_json', ''),
  ('social_links_json', ''),
  ('website_content_json', '')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  discount_percent integer NOT NULL DEFAULT 0,
  max_uses integer NOT NULL DEFAULT 0,
  used_count integer NOT NULL DEFAULT 0,
  per_user_limit integer NOT NULL DEFAULT 1,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  applies_to_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_codes_upper_code ON public.coupon_codes (upper(code));
CREATE INDEX IF NOT EXISTS idx_coupon_codes_active ON public.coupon_codes(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_course ON public.coupon_codes(applies_to_course_id);

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupon_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  discount_percent integer NOT NULL DEFAULT 0,
  discount_amount integer NOT NULL DEFAULT 0,
  original_amount integer NOT NULL DEFAULT 0,
  final_amount integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'redeemed',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, user_id, course_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coupon_redemptions_unique
  ON public.coupon_redemptions(coupon_id, user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON public.coupon_redemptions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON public.coupon_redemptions(coupon_id, created_at DESC);

GRANT SELECT ON public.coupon_codes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupon_codes TO authenticated;
GRANT ALL ON public.coupon_codes TO service_role;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active coupon codes" ON public.coupon_codes;
CREATE POLICY "Public can read active coupon codes"
  ON public.coupon_codes FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage coupon codes" ON public.coupon_codes;
CREATE POLICY "Admins can manage coupon codes"
  ON public.coupon_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_coupon_codes_updated_at ON public.coupon_codes;
CREATE TRIGGER update_coupon_codes_updated_at
  BEFORE UPDATE ON public.coupon_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coupon redemptions" ON public.coupon_redemptions;
CREATE POLICY "Users can view own coupon redemptions"
  ON public.coupon_redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage coupon redemptions" ON public.coupon_redemptions;
CREATE POLICY "Admins can manage coupon redemptions"
  ON public.coupon_redemptions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.redeem_coupon_for_course(_code text, _course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _coupon public.coupon_codes%ROWTYPE;
  _course public.courses%ROWTYPE;
  _existing public.coupon_redemptions%ROWTYPE;
  _user_redeem_count integer := 0;
  _original_amount integer := 0;
  _discount_amount integer := 0;
  _final_amount integer := 0;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Login required to redeem coupon.';
  END IF;

  SELECT * INTO _course FROM public.courses WHERE id = _course_id AND status = 'published';
  IF NOT FOUND THEN RAISE EXCEPTION 'Course not found.'; END IF;

  SELECT * INTO _coupon FROM public.coupon_codes WHERE upper(code) = upper(trim(_code)) FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Coupon code not found.'; END IF;

  IF _coupon.is_active IS NOT TRUE THEN RAISE EXCEPTION 'Coupon is inactive or expired.'; END IF;
  IF _coupon.starts_at IS NOT NULL AND _coupon.starts_at > now() THEN RAISE EXCEPTION 'Coupon is not active yet.'; END IF;
  IF _coupon.expires_at IS NOT NULL AND _coupon.expires_at <= now() THEN
    UPDATE public.coupon_codes SET is_active = false, updated_at = now() WHERE id = _coupon.id;
    RAISE EXCEPTION 'Coupon validity has ended.';
  END IF;
  IF _coupon.applies_to_course_id IS NOT NULL AND _coupon.applies_to_course_id <> _course_id THEN
    RAISE EXCEPTION 'Coupon is not valid for this course.';
  END IF;

  SELECT * INTO _existing FROM public.coupon_redemptions
  WHERE coupon_id = _coupon.id AND user_id = _user_id AND course_id = _course_id LIMIT 1;

  IF FOUND THEN
    IF _existing.final_amount <= 0 THEN
      INSERT INTO public.course_enrollments (user_id, course_id, status, source, payment_method, amount_paid, currency, admin_note)
      VALUES (_user_id, _course_id, 'active', 'coupon', 'coupon', 0, 'INR', 'Coupon ' || _coupon.code || ' already redeemed')
      ON CONFLICT (user_id, course_id) DO UPDATE SET
        status = 'active', source = 'coupon', payment_method = 'coupon', amount_paid = 0,
        admin_note = EXCLUDED.admin_note, updated_at = now();
    END IF;
    RETURN jsonb_build_object('ok', true, 'already_redeemed', true, 'code', _coupon.code, 'course_id', _course_id, 'discount_percent', _existing.discount_percent, 'discount_amount', _existing.discount_amount, 'final_amount', _existing.final_amount, 'enrolled', _existing.final_amount <= 0, 'message', 'Coupon already redeemed for this course.');
  END IF;

  SELECT count(*) INTO _user_redeem_count FROM public.coupon_redemptions
  WHERE coupon_id = _coupon.id AND user_id = _user_id AND status = 'redeemed';
  IF _coupon.per_user_limit > 0 AND _user_redeem_count >= _coupon.per_user_limit THEN
    RAISE EXCEPTION 'Per-student coupon limit is already used.';
  END IF;

  IF _coupon.max_uses > 0 AND _coupon.used_count >= _coupon.max_uses THEN
    UPDATE public.coupon_codes SET is_active = false, updated_at = now() WHERE id = _coupon.id;
    RAISE EXCEPTION 'Coupon usage limit is full.';
  END IF;

  _original_amount := GREATEST(COALESCE(_course.price, 0), 0);
  _discount_amount := LEAST(_original_amount, ROUND((_original_amount * _coupon.discount_percent) / 100.0)::integer);
  _final_amount := GREATEST(_original_amount - _discount_amount, 0);

  INSERT INTO public.coupon_redemptions (coupon_id, user_id, course_id, discount_percent, discount_amount, original_amount, final_amount, currency, status)
  VALUES (_coupon.id, _user_id, _course_id, _coupon.discount_percent, _discount_amount, _original_amount, _final_amount, 'INR', 'redeemed');

  UPDATE public.coupon_codes
  SET used_count = used_count + 1,
      is_active = CASE WHEN max_uses > 0 AND used_count + 1 >= max_uses THEN false ELSE is_active END,
      updated_at = now()
  WHERE id = _coupon.id;

  IF _final_amount <= 0 THEN
    INSERT INTO public.course_enrollments (user_id, course_id, status, source, payment_method, amount_paid, currency, admin_note)
    VALUES (_user_id, _course_id, 'active', 'coupon', 'coupon', 0, 'INR', 'Coupon ' || _coupon.code || ' gave 100% discount')
    ON CONFLICT (user_id, course_id) DO UPDATE SET
      status = 'active', source = 'coupon', payment_method = 'coupon', amount_paid = 0,
      admin_note = EXCLUDED.admin_note, updated_at = now();

    INSERT INTO public.payment_transactions (user_id, course_id, provider, status, amount, currency, admin_note, metadata)
    VALUES (_user_id, _course_id, 'coupon', 'paid', 0, 'INR', 'Coupon ' || _coupon.code || ' redeemed', jsonb_build_object('coupon_id', _coupon.id, 'code', _coupon.code, 'discount_percent', _coupon.discount_percent, 'discount_amount', _discount_amount, 'original_amount', _original_amount));
  END IF;

  RETURN jsonb_build_object('ok', true, 'already_redeemed', false, 'code', _coupon.code, 'course_id', _course_id, 'discount_percent', _coupon.discount_percent, 'discount_amount', _discount_amount, 'final_amount', _final_amount, 'enrolled', _final_amount <= 0, 'message', 'Coupon redeemed successfully.');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.redeem_coupon_for_course(text, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.redeem_coupon_for_course(text, uuid) TO authenticated, service_role;
