-- KKCC 23KAAT coin currency wallet
-- 1 coin = ₹1 app credit for KKCC purchases unless admin changes pricing copy later.
-- All grant/spend operations are server-side database functions; students cannot edit their balance.

CREATE TABLE IF NOT EXISTS public.coin_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '23KAAT Coin Pack',
  coins integer NOT NULL DEFAULT 0,
  bonus_coins integer NOT NULL DEFAULT 0,
  price integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (coins >= 0),
  CHECK (bonus_coins >= 0),
  CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  source text NOT NULL DEFAULT 'admin_grant',
  reason text NOT NULL DEFAULT '',
  related_type text NOT NULL DEFAULT '',
  related_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (amount <> 0)
);

CREATE TABLE IF NOT EXISTS public.material_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  paid_coins integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, material_id),
  CHECK (paid_coins >= 0)
);

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON public.coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_source ON public.coin_transactions(source, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coin_packages_active ON public.coin_packages(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_material_purchases_user ON public.material_purchases(user_id, status);
CREATE INDEX IF NOT EXISTS idx_material_purchases_material ON public.material_purchases(material_id, status);

GRANT SELECT ON public.coin_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coin_packages TO authenticated;
GRANT SELECT ON public.coin_transactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coin_transactions TO authenticated;
GRANT SELECT ON public.material_purchases TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.material_purchases TO authenticated;
GRANT ALL ON public.coin_packages, public.coin_transactions, public.material_purchases TO service_role;

ALTER TABLE public.coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active coin packages are public" ON public.coin_packages;
CREATE POLICY "Active coin packages are public"
  ON public.coin_packages FOR SELECT
  USING (is_active OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage coin packages" ON public.coin_packages;
CREATE POLICY "Admins manage coin packages"
  ON public.coin_packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own coin transactions" ON public.coin_transactions;
CREATE POLICY "Users view own coin transactions"
  ON public.coin_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all coin transactions" ON public.coin_transactions;
CREATE POLICY "Admins view all coin transactions"
  ON public.coin_transactions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage coin transactions" ON public.coin_transactions;
CREATE POLICY "Admins manage coin transactions"
  ON public.coin_transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own material purchases" ON public.material_purchases;
CREATE POLICY "Users view own material purchases"
  ON public.material_purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all material purchases" ON public.material_purchases;
CREATE POLICY "Admins view all material purchases"
  ON public.material_purchases FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage material purchases" ON public.material_purchases;
CREATE POLICY "Admins manage material purchases"
  ON public.material_purchases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_coin_packages_updated_at ON public.coin_packages;
CREATE TRIGGER update_coin_packages_updated_at
  BEFORE UPDATE ON public.coin_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_material_purchases_updated_at ON public.material_purchases;
CREATE TRIGGER update_material_purchases_updated_at
  BEFORE UPDATE ON public.material_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_23kaat_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM public.coin_transactions
  WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.grant_23kaat_to_user(
  _user_id uuid,
  _amount integer,
  _reason text DEFAULT 'Admin grant',
  _related_type text DEFAULT '',
  _related_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_balance integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Login required';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden — admin access required';
  END IF;
  IF _amount IS NULL OR _amount <= 0 OR _amount > 10000000 THEN
    RAISE EXCEPTION 'Enter a valid 23KAAT amount';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(_user_id::text));

  INSERT INTO public.coin_transactions(user_id, amount, source, reason, related_type, related_id, created_by)
  VALUES (_user_id, _amount, 'admin_grant', COALESCE(NULLIF(_reason, ''), 'Admin grant'), COALESCE(_related_type, ''), _related_id, auth.uid());

  next_balance := public.get_23kaat_balance(_user_id);
  RETURN jsonb_build_object('ok', true, 'user_id', _user_id, 'amount', _amount, 'balance', next_balance);
END;
$$;

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

  cost := GREATEST(0, COALESCE(course_row.price, 0));
  IF cost = 0 THEN
    INSERT INTO public.course_enrollments(user_id, course_id, status, source, payment_method, amount_paid, currency, admin_note)
    VALUES (uid, _course_id, 'active', 'free', 'free', 0, 'INR', 'Free course self-start')
    ON CONFLICT (user_id, course_id) DO UPDATE SET
      status = 'active', source = 'free', payment_method = 'free', amount_paid = 0, currency = 'INR', updated_at = now();
    RETURN jsonb_build_object('ok', true, 'free', true, 'balance', public.get_23kaat_balance(uid));
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

  RETURN jsonb_build_object('ok', true, 'spent', cost, 'balance', public.get_23kaat_balance(uid));
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
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0);
  END IF;

  IF COALESCE(material_row.access_type, 'course') = 'paid' THEN
    SELECT EXISTS(
      SELECT 1 FROM public.material_purchases
      WHERE user_id = uid AND material_id = _material_id AND status = 'active'
    ) INTO has_purchase;
    IF has_purchase THEN
      RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', material_row.price);
    END IF;
    balance := public.get_23kaat_balance(uid);
    RETURN jsonb_build_object('ok', true, 'locked', true, 'reason', 'paid', 'price', material_row.price, 'balance', balance);
  END IF;

  IF material_row.course_id IS NULL THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0);
  END IF;

  SELECT COALESCE(price, 0) INTO course_price FROM public.courses WHERE id = material_row.course_id AND status = 'published';
  IF COALESCE(course_price, 0) <= 0 THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0);
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.course_enrollments
    WHERE user_id = uid AND course_id = material_row.course_id AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO has_course_access;

  IF has_course_access THEN
    RETURN jsonb_build_object('ok', true, 'locked', false, 'file_url', material_row.file_url, 'price', 0);
  END IF;

  RETURN jsonb_build_object('ok', true, 'locked', true, 'reason', 'course_required', 'price', course_price, 'balance', public.get_23kaat_balance(uid));
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

  cost := GREATEST(0, COALESCE(material_row.price, 0));
  IF cost <= 0 THEN
    INSERT INTO public.material_purchases(user_id, material_id, paid_coins, status, created_by)
    VALUES (uid, _material_id, 0, 'active', uid)
    ON CONFLICT (user_id, material_id) DO UPDATE SET status = 'active', updated_at = now();
    RETURN jsonb_build_object('ok', true, 'free', true, 'file_url', material_row.file_url, 'balance', public.get_23kaat_balance(uid));
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

  RETURN jsonb_build_object('ok', true, 'spent', cost, 'file_url', material_row.file_url, 'balance', public.get_23kaat_balance(uid));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_23kaat_balance(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.grant_23kaat_to_user(uuid, integer, text, text, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.spend_23kaat_for_course(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_material_access_url(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.spend_23kaat_for_material(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_23kaat_balance(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.grant_23kaat_to_user(uuid, integer, text, text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_23kaat_for_course(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_my_material_access_url(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_23kaat_for_material(uuid) TO authenticated, service_role;

INSERT INTO public.coin_packages(title, coins, bonus_coins, price, description, sort_order)
VALUES
  ('Starter 23KAAT Pack', 100, 0, 100, 'Use 23KAAT coins for courses and paid notes.', 1),
  ('Smart 23KAAT Pack', 500, 50, 500, 'Bonus coins for regular KKCC learners.', 2),
  ('Champion 23KAAT Pack', 1000, 150, 1000, 'Best for full batches and notes.', 3)
ON CONFLICT DO NOTHING;
