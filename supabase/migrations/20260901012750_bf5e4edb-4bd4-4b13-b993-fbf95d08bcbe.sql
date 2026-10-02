ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS module_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS batch text NOT NULL DEFAULT '';