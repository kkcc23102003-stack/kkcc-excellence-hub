-- Reward vouchers a student can claim once the monthly target is reached.
--
-- Three kinds: a 23KAAT credit, an Amazon gift voucher and a Flipkart one.
-- The gift vouchers cost the centre real money, so they carry a daily quota
-- that is genuinely shared across all students, genuinely counted, and
-- resets at 1 AM IST. When the day's quota is gone the app says so and says
-- when it returns — it does not pretend the claim failed for some other
-- reason.
--
-- A claim is a request, not a payout. The desk fulfils it and marks it done.

CREATE TABLE IF NOT EXISTS public.voucher_types (
  id            text PRIMARY KEY,
  label         text NOT NULL,
  -- Rupee value of one voucher.
  value_inr     integer NOT NULL DEFAULT 100,
  -- How many may be claimed per day across all students. Null means no cap.
  daily_quota   integer,
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT voucher_types_value_sane CHECK (value_inr BETWEEN 0 AND 100000),
  CONSTRAINT voucher_types_quota_sane CHECK (daily_quota IS NULL OR daily_quota >= 0)
);

CREATE TABLE IF NOT EXISTS public.voucher_claims (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_type  text NOT NULL REFERENCES public.voucher_types (id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- The IST day this claim counts against, so the quota resets at 1 AM.
  claim_day     date NOT NULL,
  status        text NOT NULL DEFAULT 'pending',
  code          text NOT NULL DEFAULT '',
  admin_note    text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  fulfilled_at  timestamptz,

  CONSTRAINT voucher_claims_status_valid CHECK (status IN ('pending', 'fulfilled', 'rejected'))
);

-- One claim per student per voucher per day.
CREATE UNIQUE INDEX IF NOT EXISTS idx_voucher_claims_one_per_day
  ON public.voucher_claims (voucher_type, user_id, claim_day);

CREATE INDEX IF NOT EXISTS idx_voucher_claims_day
  ON public.voucher_claims (voucher_type, claim_day);

ALTER TABLE public.voucher_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_claims ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.voucher_types TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voucher_types TO authenticated;
GRANT ALL ON public.voucher_types TO service_role;

GRANT SELECT, INSERT ON public.voucher_claims TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voucher_claims TO authenticated;
GRANT ALL ON public.voucher_claims TO service_role;

DROP POLICY IF EXISTS "Anyone can read voucher types" ON public.voucher_types;
CREATE POLICY "Anyone can read voucher types" ON public.voucher_types
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage voucher types" ON public.voucher_types;
CREATE POLICY "Admins manage voucher types" ON public.voucher_types
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Students read their own claims" ON public.voucher_claims;
CREATE POLICY "Students read their own claims" ON public.voucher_claims
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage claims" ON public.voucher_claims;
CREATE POLICY "Admins manage claims" ON public.voucher_claims
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- The IST day a claim belongs to, where the day turns at 1 AM rather than
-- midnight. Anything before 1 AM still counts against the previous day.
CREATE OR REPLACE FUNCTION public.voucher_claim_day()
RETURNS date
LANGUAGE sql
STABLE
AS $$
  SELECT ((now() AT TIME ZONE 'Asia/Kolkata') - interval '1 hour')::date;
$$;

-- How many of a voucher are left today. Null quota means unlimited.
CREATE OR REPLACE FUNCTION public.voucher_remaining_today(p_type text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN t.daily_quota IS NULL THEN 2147483647
    ELSE GREATEST(
      0,
      t.daily_quota - (
        SELECT count(*) FROM public.voucher_claims c
        WHERE c.voucher_type = p_type
          AND c.claim_day = public.voucher_claim_day()
          AND c.status <> 'rejected'
      )
    )
  END
  FROM public.voucher_types t
  WHERE t.id = p_type;
$$;

GRANT EXECUTE ON FUNCTION public.voucher_claim_day() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.voucher_remaining_today(text) TO anon, authenticated;

-- The three vouchers. Quotas are yours to change from the admin screen.
INSERT INTO public.voucher_types (id, label, value_inr, daily_quota, sort_order)
VALUES
  ('amazon',   'Amazon gift voucher',   100, 100, 1),
  ('flipkart', 'Flipkart gift voucher', 100, 100, 2),
  ('23kaat',   '23KAAT coin credit',    100, NULL, 3)
ON CONFLICT (id) DO NOTHING;
