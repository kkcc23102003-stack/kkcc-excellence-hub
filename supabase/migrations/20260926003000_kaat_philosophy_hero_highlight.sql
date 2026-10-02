-- Refresh default hero highlight to the KKCC 2-3-KAAT philosophy line.
-- Safe for existing projects: only old bundled/default hero highlights are replaced.
UPDATE public.site_settings
SET value = 'Learn with clarity. Practice with courage. Rise with confidence.',
updated_at = now()
WHERE key = 'brand_hero_highlight'
  AND value IN (
    'Logo-Inspired UV Learning for Bright Futures.',
    'Neon Smart Learning for Bright Futures.',
    'Learning That Builds Futures.',
    'KKCC Excellence Learning for Bright Futures.',
    'One focused session. One clear win. Every day.'
  );

INSERT INTO public.site_settings (key, value)
VALUES
  ('brand_hero_highlight', 'Learn with clarity. Practice with courage. Rise with confidence.')
ON CONFLICT (key) DO NOTHING;
