-- Give offline test-series access a validity period.
--
-- Course and batch access already expires: offline_access_grants carries an
-- expires_at and the desk sets it when it takes an offline payment. Test
-- access did not. A grant made for one month's fee stayed open for ever
-- unless somebody remembered to revoke it by hand.
--
-- This adds the same expiry to test grants and, more importantly, teaches
-- has_test_access to honour it, so an expired grant stops opening the paper
-- on its own.

ALTER TABLE public.test_access_grants
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

COMMENT ON COLUMN public.test_access_grants.expires_at IS
  'When this access lapses. NULL means lifetime access, which is the old behaviour.';

-- Find live grants for a student quickly, including the expiry check.
CREATE INDEX IF NOT EXISTS idx_test_access_grants_live
  ON public.test_access_grants (user_id, test_id)
  WHERE revoked_at IS NULL;

-- A test is open when it is free, or when I hold a grant that is neither
-- revoked nor past its expiry. A NULL expiry still means lifetime, so every
-- grant already issued keeps working exactly as before.
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
        AND (g.expires_at IS NULL OR g.expires_at > now())
    );
$$;

GRANT EXECUTE ON FUNCTION public.has_test_access(uuid) TO anon, authenticated;
