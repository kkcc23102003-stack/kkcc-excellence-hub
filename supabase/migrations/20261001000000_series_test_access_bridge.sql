-- Bridge a paid series grant to the individual tests inside that series.
--
-- A series grant must unlock every published paper whose tests.series_name
-- matches the purchased series id. Existing individual grants continue to work.
-- Expiry is honoured for both grant types.

CREATE OR REPLACE FUNCTION public.has_test_access(p_test_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(
      (
        SELECT NOT t.is_paid
        FROM public.tests t
        WHERE t.id = p_test_id
      ),
      false
    )
    OR EXISTS (
      SELECT 1
      FROM public.test_access_grants g
      WHERE g.test_id = p_test_id
        AND g.user_id = auth.uid()
        AND g.revoked_at IS NULL
        AND (g.expires_at IS NULL OR g.expires_at > now())
    )
    OR EXISTS (
      SELECT 1
      FROM public.tests t
      JOIN public.series_access_grants g
        ON g.series_id = t.series_name
      WHERE t.id = p_test_id
        AND g.user_id = auth.uid()
        AND g.revoked_at IS NULL
        AND (g.expires_at IS NULL OR g.expires_at > now())
    );
$$;

GRANT EXECUTE ON FUNCTION public.has_test_access(uuid) TO authenticated;

COMMENT ON FUNCTION public.has_test_access(uuid) IS
  'A test is open when free, individually granted, or covered by a live grant for its series.';
