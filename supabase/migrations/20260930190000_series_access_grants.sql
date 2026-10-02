-- Make the test series catalogue actually sellable.
--
-- Until now the 55 series on /test-series were a syllabus map. The card
-- showed a price and a lock badge, but clicking it opened free practice.
-- There was no purchase, no lock and no way to grant access, because
-- test_access_grants keys on tests.id and a catalogue series has no row in
-- the tests table at all.
--
-- This table grants access to a series by the id the catalogue already uses
-- in code, so one grant opens a whole series rather than one paper.

CREATE TABLE IF NOT EXISTS public.series_access_grants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id    text NOT NULL,
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  granted_by   uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  -- How the student paid: cash, upi, bank transfer, scholarship.
  method       text NOT NULL DEFAULT 'offline',
  -- What was collected, in rupees. Zero for a free or goodwill grant.
  amount_inr   integer NOT NULL DEFAULT 0,
  -- Receipt number or any context the desk wants to keep.
  note         text NOT NULL DEFAULT '',
  -- When the access lapses. NULL means lifetime.
  expires_at   timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT series_access_grants_series_id_not_blank CHECK (length(btrim(series_id)) > 0),
  CONSTRAINT series_access_grants_amount_sane CHECK (amount_inr BETWEEN 0 AND 1000000)
);

COMMENT ON TABLE public.series_access_grants IS
  'Access to a code-defined test series, keyed by the series id used in the catalogue. One grant opens the whole series.';

-- One live grant per student per series; renewing extends that row.
CREATE UNIQUE INDEX IF NOT EXISTS idx_series_access_grants_one_live
  ON public.series_access_grants (series_id, user_id)
  WHERE revoked_at IS NULL;

ALTER TABLE public.series_access_grants ENABLE ROW LEVEL SECURITY;

-- Row level security picks the rows; these grants let the role reach the
-- table at all. This project sets them explicitly on every table.
GRANT SELECT ON public.series_access_grants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.series_access_grants TO authenticated;
GRANT ALL ON public.series_access_grants TO service_role;

DROP POLICY IF EXISTS "Students read their own series grants" ON public.series_access_grants;
CREATE POLICY "Students read their own series grants" ON public.series_access_grants
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage series grants" ON public.series_access_grants;
CREATE POLICY "Admins manage series grants" ON public.series_access_grants
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Is this series open for me? Live grant, not revoked, not expired.
CREATE OR REPLACE FUNCTION public.has_series_access(p_series_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.series_access_grants g
    WHERE g.series_id = p_series_id
      AND g.user_id = auth.uid()
      AND g.revoked_at IS NULL
      AND (g.expires_at IS NULL OR g.expires_at > now())
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_series_access(text) TO authenticated;
