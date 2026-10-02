-- Lock legacy first-user admin claiming. Admin access must be assigned by the
-- site owner in Supabase `public.user_roles`, so a random first signup cannot
-- take control of the website.
DO $$
BEGIN
  IF to_regprocedure('public.claim_admin()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM anon, public, authenticated;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Admin claiming is disabled. Assign admins in public.user_roles from Supabase.';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM anon, public, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO service_role;
