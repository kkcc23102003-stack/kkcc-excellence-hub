-- Admins never run out of 23KAAT.
--
-- The balance is the sum of a user's coin_transactions, which means an admin
-- starts at zero like anybody else and has to grant coins to themselves
-- before they can do anything that spends. That is busywork with no purpose:
-- an admin already decides who gets coins, so limiting their own balance
-- protects nothing.
--
-- Admins now read as effectively unlimited. Their transactions are still
-- recorded, so the ledger stays complete and auditable; only the balance
-- they are checked against stops running down.

CREATE OR REPLACE FUNCTION public.get_23kaat_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN public.has_role(_user_id, 'admin') THEN 2000000000
    ELSE COALESCE(
      (SELECT SUM(amount) FROM public.coin_transactions WHERE user_id = _user_id),
      0
    )::integer
  END;
$$;

GRANT EXECUTE ON FUNCTION public.get_23kaat_balance(uuid) TO anon, authenticated;
