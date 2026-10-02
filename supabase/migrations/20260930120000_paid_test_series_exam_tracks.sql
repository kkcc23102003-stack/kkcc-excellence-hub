-- Paid test series support for public.tests.
--
-- Adds the fields the Test section needs to sell a test series and to state,
-- on every single test, which exam that test is oriented for. Rupee and coin
-- pricing sit side by side because students can pay either way.
--
-- Every column is added with IF NOT EXISTS and a safe default, so existing
-- rows stay valid and free tests keep working exactly as before.

alter table public.tests
  add column if not exists exam_track text not null default '',
  add column if not exists level text not null default 'Mixed',
  add column if not exists series_name text not null default '',
  add column if not exists is_paid boolean not null default false,
  add column if not exists price_inr integer not null default 0,
  add column if not exists price_coins integer not null default 0;

-- A test is either free or priced; never a paid test with no price at all.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tests_paid_needs_price'
  ) then
    alter table public.tests
      add constraint tests_paid_needs_price
      check (is_paid = false or price_inr > 0 or price_coins > 0);
  end if;
end $$;

-- Prices can never be negative.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tests_prices_non_negative'
  ) then
    alter table public.tests
      add constraint tests_prices_non_negative
      check (price_inr >= 0 and price_coins >= 0);
  end if;
end $$;

-- Only the three ladder levels, or Mixed for a full-length paper.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tests_level_allowed'
  ) then
    alter table public.tests
      add constraint tests_level_allowed
      check (level in ('Easy', 'Moderate', 'Difficult', 'Mixed'));
  end if;
end $$;

comment on column public.tests.exam_track is
  'Which exam this test is oriented for, shown on the test card.';
comment on column public.tests.level is
  'Easy, Moderate, Difficult or Mixed. Drives the three-level ladder order.';
comment on column public.tests.series_name is
  'Groups tests that belong to the same series.';
comment on column public.tests.is_paid is
  'True when the test needs a purchase before it can be started.';

-- Listing a series is a filter on exam and publication state, so index those.
create index if not exists tests_exam_track_idx
  on public.tests (exam_track)
  where is_published = true;

create index if not exists tests_series_sort_idx
  on public.tests (series_name, sort_order);

-- Column-level grants follow the table grants already in place.
grant select on public.tests to anon;
grant select, insert, update, delete on public.tests to authenticated;
