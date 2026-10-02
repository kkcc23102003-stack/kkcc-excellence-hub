-- Manual access grants for paid tests.
--
-- Two things this unlocks for the admin panel:
--   1. A paid test can be flipped free by setting tests.is_paid = false. That
--      column already exists, so nothing new is needed for it here.
--   2. When a student pays offline - cash at the centre, UPI to the desk, a
--      bank transfer - the admin records a grant row here and the student can
--      open the paid test immediately, with no online payment step.
--
-- A grant is never deleted, only revoked, so there is always a record of who
-- opened what, for whom, and why.

CREATE TABLE IF NOT EXISTS public.test_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- How the student paid, e.g. 'cash', 'upi', 'bank transfer', 'scholarship'.
  method text NOT NULL DEFAULT 'offline',
  -- What was collected, in rupees. Zero for a free or goodwill grant.
  amount_inr integer NOT NULL DEFAULT 0,
  -- Free text for the receipt number or any context the desk wants to keep.
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

-- One live grant per student per test. A revoked grant does not block a
-- fresh one, which is what the partial index gives us.
CREATE UNIQUE INDEX IF NOT EXISTS test_access_grants_live_idx
  ON public.test_access_grants (test_id, user_id)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS test_access_grants_user_idx
  ON public.test_access_grants (user_id)
  WHERE revoked_at IS NULL;

GRANT SELECT ON public.test_access_grants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_access_grants TO authenticated;
GRANT ALL ON public.test_access_grants TO service_role;

ALTER TABLE public.test_access_grants ENABLE ROW LEVEL SECURITY;

-- A student may read their own grants and nothing else. This is what the
-- test runner checks before opening a paid paper.
DROP POLICY IF EXISTS "Students read their own test grants" ON public.test_access_grants;
CREATE POLICY "Students read their own test grants" ON public.test_access_grants
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins read all test grants" ON public.test_access_grants;
CREATE POLICY "Admins read all test grants" ON public.test_access_grants
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only an admin may create or change a grant. A student can never write here,
-- so access cannot be self-granted from the browser.
DROP POLICY IF EXISTS "Admins manage test grants" ON public.test_access_grants;
CREATE POLICY "Admins manage test grants" ON public.test_access_grants
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Convenience check used by the test runner: is this paper open for me?
-- A test is open when it is free, or when I hold a live grant for it.
CREATE OR REPLACE FUNCTION public.has_test_access(p_test_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE((SELECT NOT t.is_paid FROM public.tests t WHERE t.id = p_test_id), false)
    OR EXISTS (
      SELECT 1 FROM public.test_access_grants g
      WHERE g.test_id = p_test_id
        AND g.user_id = auth.uid()
        AND g.revoked_at IS NULL
    );
$$;

GRANT EXECUTE ON FUNCTION public.has_test_access(uuid) TO anon, authenticated;
