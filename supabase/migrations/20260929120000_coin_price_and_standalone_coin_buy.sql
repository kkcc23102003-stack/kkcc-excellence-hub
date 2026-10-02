-- KKCC 23KAAT coin pricing refresh
-- Adds separate coin prices for courses/batches and standalone paid notes/materials.
-- Rupee price and 23KAAT price can now be different; when coin_price is 0/blank,
-- paid content falls back to the rupee price to avoid accidental free unlocks.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS coin_price integer NOT NULL DEFAULT 0;

ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS coin_price integer NOT NULL DEFAULT 0;

UPDATE public.courses
SET coin_price = GREATEST(0, COALESCE(price, 0))
WHERE COALESCE(coin_price, 0) = 0 AND COALESCE(price, 0) > 0;

UPDATE public.materials
SET coin_price = GREATEST(0, COALESCE(price, 0))
WHERE COALESCE(coin_price, 0) = 0 AND COALESCE(price, 0) > 0;

ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_coin_price_non_negative;
ALTER TABLE public.courses
  ADD CONSTRAINT courses_coin_price_non_negative CHECK (coin_price >= 0);

ALTER TABLE public.materials
  DROP CONSTRAINT IF EXISTS materials_coin_price_non_negative;
ALTER TABLE public.materials
  ADD CONSTRAINT materials_coin_price_non_negative CHECK (coin_price >= 0);

CREATE OR REPLACE FUNCTION public.spend_23kaat_for_course(_course_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  course_row public.courses%ROWTYPE;
  current_balance integer;
  cost integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Login required';
  END IF;
  IF public.is_user_blocked(uid) THEN
    RAISE EXCEPTION 'Account blocked by admin';
  END IF;

  SELECT * INTO course_row
  FROM public.courses
  WHERE id = _course_id AND status = 'published';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.course_enrollments
    WHERE user_id = uid AND course_id = _course_id AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RETURN jsonb_build_object('ok', true, 'already_owned', true, 'balance', public.get_23kaat_balance(uid));
  END IF;

  cost := CASE
    WHEN COALESCE(course_row.price, 0) <= 0 THEN 0
    WHEN COALESCE(course_row.coin_price, 0) > 0 THEN GREATEST(0, course_row.coin_price)
    ELSE GREATEST(0, COALESCE(course_row.price, 0))
  END;

  IF cost = 0 THEN
    INSERT INTO public.course_enrollments(user_id, course_id, status, source, payment_method, amount_paid, currency, admin_note)
    VALUES (uid, _course_id, 'active', 'free', 'free', 0, 'INR', 'Free course self-start')
    ON CONFLICT (user_id, course_id) DO UPDATE SET
      status = 'active', source = 'free', payment_method = 'free', amount_paid = 0, currency = 'INR', updated_at = now();
    RETURN jsonb_build_object('ok', true, 'free', true, 'spent', 0, 'price', 0, 'rupee_price', COALESCE(course_row.price, 0), 'coin_price', 0, 'balance', public.get_23kaat_balance(uid));
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(uid::text));
  current_balance := public.get_23kaat_balance(uid);
  IF current_balance < cost THEN
    RAISE EXCEPTION 'Not enough 23KAAT coins. Need %, available %.', cost, current_balance;
  END IF;

  INSERT INTO public.coin_transactions(user_id, amount, source, reason, related_type, related_id, created_by)
  VALUES (uid, -cost, 'course_purchase', 'Course purchase: ' || course_row.title, 'course', _course_id, uid);

  INSERT INTO public.course_enrollments(user_id, course_id, status, source, payment_method, amount_paid, currency, admin_note, created_by)
  VALUES (uid, _course_id, 'active', '23kaat', '23KAAT Coins', cost, '23KAAT', 'Unlocked with 23KAAT coins', uid)
  ON CONFLICT (user_id, course_id) DO UPDATE SET
    status = 'active', source = '23kaat', payment_method = '23KAAT Coins', amount_paid = cost,
    currency = '23KAAT', admin_note = 'Unlocked with 23KAAT coins', updated_at = now();

  RETURN jsonb_build_object('ok', true, 'spent', cost, 'price', cost, 'rupee_price', COALESCE(course_row.price, 0), 'coin_price', cost, 'balance', public.get_23kaat_balance(uid));
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_material_access_url(_material_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  material_row public.materials%ROWTYPE;
  course_price integer;
  course_coin_price integer;
  course_cost integer;
  material_cost integer;
  has_course_access boolean;
  has_purchase boolean;
  balance integer;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'locked', true, 'reason', 'login_required');
  END IF;
  IF public.is_user_blocked(uid) THEN
    RETURN jsonb_build_object('ok', false, 'locked', true, 'reason', 'blocked');
  END IF;

  SELECT * INTO material_row
  FROM public.materials
  WHERE id = _material_id AND is_published = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'locked', true, 'reason', 'not_found');
  END IF;

  IF COALESCE(material_row.access_type, 'course') = 'free' THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0, 'rupee_price', 0, 'coin_price', 0);
  END IF;

  IF COALESCE(material_row.access_type, 'course') = 'paid' THEN
    material_cost := CASE
      WHEN COALESCE(material_row.price, 0) <= 0 THEN 0
      WHEN COALESCE(material_row.coin_price, 0) > 0 THEN GREATEST(0, material_row.coin_price)
      ELSE GREATEST(0, COALESCE(material_row.price, 0))
    END;

    SELECT EXISTS(
      SELECT 1 FROM public.material_purchases
      WHERE user_id = uid AND material_id = _material_id AND status = 'active'
    ) INTO has_purchase;
    IF has_purchase THEN
      RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', material_cost, 'rupee_price', COALESCE(material_row.price, 0), 'coin_price', material_cost);
    END IF;
    balance := public.get_23kaat_balance(uid);
    RETURN jsonb_build_object('ok', true, 'locked', true, 'reason', 'paid', 'price', material_cost, 'rupee_price', COALESCE(material_row.price, 0), 'coin_price', material_cost, 'balance', balance);
  END IF;

  IF material_row.course_id IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0, 'rupee_price', 0, 'coin_price', 0);
  END IF;

  SELECT COALESCE(price, 0), COALESCE(coin_price, 0)
  INTO course_price, course_coin_price
  FROM public.courses
  WHERE id = material_row.course_id AND status = 'published';

  course_cost := CASE
    WHEN COALESCE(course_price, 0) <= 0 THEN 0
    WHEN COALESCE(course_coin_price, 0) > 0 THEN GREATEST(0, course_coin_price)
    ELSE GREATEST(0, COALESCE(course_price, 0))
  END;

  IF COALESCE(course_price, 0) <= 0 THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0, 'rupee_price', 0, 'coin_price', 0);
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.course_enrollments
    WHERE user_id = uid AND course_id = material_row.course_id AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO has_course_access;

  IF has_course_access THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0, 'rupee_price', 0, 'coin_price', 0);
  END IF;

  RETURN jsonb_build_object('ok', true, 'locked', true, 'reason', 'course_required', 'price', course_cost, 'rupee_price', course_price, 'coin_price', course_cost, 'balance', public.get_23kaat_balance(uid));
END;
$$;

CREATE OR REPLACE FUNCTION public.spend_23kaat_for_material(_material_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  material_row public.materials%ROWTYPE;
  current_balance integer;
  cost integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Login required';
  END IF;
  IF public.is_user_blocked(uid) THEN
    RAISE EXCEPTION 'Account blocked by admin';
  END IF;

  SELECT * INTO material_row
  FROM public.materials
  WHERE id = _material_id AND is_published = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Material not found';
  END IF;

  IF COALESCE(material_row.access_type, 'course') <> 'paid' THEN
    RETURN public.get_my_material_access_url(_material_id);
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.material_purchases
    WHERE user_id = uid AND material_id = _material_id AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('ok', true, 'already_owned', true, 'file_url', material_row.file_url, 'balance', public.get_23kaat_balance(uid));
  END IF;

  cost := CASE
    WHEN COALESCE(material_row.price, 0) <= 0 THEN 0
    WHEN COALESCE(material_row.coin_price, 0) > 0 THEN GREATEST(0, material_row.coin_price)
    ELSE GREATEST(0, COALESCE(material_row.price, 0))
  END;

  IF cost <= 0 THEN
    INSERT INTO public.material_purchases(user_id, material_id, paid_coins, status, created_by)
    VALUES (uid, _material_id, 0, 'active', uid)
    ON CONFLICT (user_id, material_id) DO UPDATE SET status = 'active', updated_at = now();
    RETURN jsonb_build_object('ok', true, 'free', true, 'spent', 0, 'price', 0, 'rupee_price', COALESCE(material_row.price, 0), 'coin_price', 0, 'file_url', material_row.file_url, 'balance', public.get_23kaat_balance(uid));
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(uid::text));
  current_balance := public.get_23kaat_balance(uid);
  IF current_balance < cost THEN
    RAISE EXCEPTION 'Not enough 23KAAT coins. Need %, available %.', cost, current_balance;
  END IF;

  INSERT INTO public.coin_transactions(user_id, amount, source, reason, related_type, related_id, created_by)
  VALUES (uid, -cost, 'material_purchase', 'Notes/material purchase: ' || material_row.title, 'material', _material_id, uid);

  INSERT INTO public.material_purchases(user_id, material_id, paid_coins, status, created_by)
  VALUES (uid, _material_id, cost, 'active', uid)
  ON CONFLICT (user_id, material_id) DO UPDATE SET
    paid_coins = EXCLUDED.paid_coins,
    status = 'active',
    updated_at = now();

  RETURN jsonb_build_object('ok', true, 'spent', cost, 'price', cost, 'rupee_price', COALESCE(material_row.price, 0), 'coin_price', cost, 'file_url', material_row.file_url, 'balance', public.get_23kaat_balance(uid));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.spend_23kaat_for_course(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_material_access_url(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.spend_23kaat_for_material(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.spend_23kaat_for_course(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_my_material_access_url(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_23kaat_for_material(uuid) TO authenticated, service_role;
