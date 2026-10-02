-- Admin control over the test series catalogue.
--
-- The catalogue itself lives in code, because each series is wired to real
-- subjects and chapters in the question bank. What an admin needs to change
-- day to day is not that wiring but the commercial and presentational side:
-- whether a series is on sale, what it is called, how it is described and
-- what it costs. This table stores exactly those overrides, keyed by the
-- series id already used in code, and the app layers them on top.
--
-- Nothing here can break a series. If a row is absent the code value is used,
-- and every column is nullable so an admin may override one field and leave
-- the rest alone.

CREATE TABLE IF NOT EXISTS public.test_series_overrides (
  series_id    text PRIMARY KEY,
  enabled      boolean NOT NULL DEFAULT true,
  name         text,
  summary      text,
  price_inr    integer,
  price_coins  integer,
  sort_order   integer,
  updated_by   uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT test_series_overrides_series_id_not_blank CHECK (length(btrim(series_id)) > 0),
  CONSTRAINT test_series_overrides_price_inr_sane CHECK (price_inr IS NULL OR price_inr BETWEEN 0 AND 100000),
  CONSTRAINT test_series_overrides_price_coins_sane CHECK (price_coins IS NULL OR price_coins BETWEEN 0 AND 10000000),
  CONSTRAINT test_series_overrides_name_len CHECK (name IS NULL OR length(btrim(name)) BETWEEN 3 AND 160),
  CONSTRAINT test_series_overrides_summary_len CHECK (summary IS NULL OR length(btrim(summary)) BETWEEN 10 AND 2000)
);

COMMENT ON TABLE public.test_series_overrides IS
  'Admin overrides layered on the code-defined test series catalogue. Absent row means use the code values.';

ALTER TABLE public.test_series_overrides ENABLE ROW LEVEL SECURITY;

-- Row level security decides WHICH rows a role may touch. It does not grant
-- the role access to the table in the first place. This project sets those
-- privileges explicitly on every table rather than relying on default
-- privileges, so this one needs them too. Without these the app fails with
-- "permission denied for table test_series_overrides" even though the
-- policies are correct.
GRANT SELECT ON public.test_series_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_series_overrides TO authenticated;
GRANT ALL ON public.test_series_overrides TO service_role;

-- Students need to read these so a disabled series disappears and a changed
-- price is the price they are actually charged.
DROP POLICY IF EXISTS "Anyone can read series overrides" ON public.test_series_overrides;
CREATE POLICY "Anyone can read series overrides" ON public.test_series_overrides
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins manage series overrides" ON public.test_series_overrides;
CREATE POLICY "Admins manage series overrides" ON public.test_series_overrides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_test_series_overrides()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_test_series_overrides ON public.test_series_overrides;
CREATE TRIGGER trg_touch_test_series_overrides
  BEFORE UPDATE ON public.test_series_overrides
  FOR EACH ROW EXECUTE FUNCTION public.touch_test_series_overrides();
