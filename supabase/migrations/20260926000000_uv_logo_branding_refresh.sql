-- Refresh default logo/theme values to the new UV neon KKCC look.
-- This is safe for existing projects: it only replaces old bundled defaults or blank values.
UPDATE public.site_settings
SET value = CASE key
  WHEN 'brand_logo_url' THEN '/logo.png'
  WHEN 'brand_primary_color' THEN '#18f4d6'
  WHEN 'brand_accent_color' THEN '#f5d78e'
  WHEN 'brand_background_color' THEN '#050605'
  WHEN 'brand_foreground_color' THEN '#fff8e7'
  WHEN 'brand_hero_title' THEN 'KKCC Excellence Hub — Study That Makes You Return.'
  WHEN 'brand_hero_highlight' THEN 'Learn with clarity. Practice with courage. Rise with confidence.'
  WHEN 'brand_hero_description' THEN 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.'
  ELSE value
END,
updated_at = now()
WHERE (key = 'brand_logo_url' AND value IN ('', '/favicon.png'))
   OR (key = 'brand_primary_color' AND value IN ('', '#0f766e', '#ff174f'))
   OR (key = 'brand_accent_color' AND value IN ('', '#d9b66f', '#00e5ff'))
   OR (key = 'brand_background_color' AND value = '')
   OR (key = 'brand_foreground_color' AND value = '')
   OR (key = 'brand_hero_title' AND value IN ('Education That Builds Understanding.', 'KKCC Excellence Hub — Learn with Power.', 'KKCC Excellence Hub — Study That Makes You Return.'))
   OR (key = 'brand_hero_highlight' AND value IN ('Logo-Inspired UV Learning for Bright Futures.', 'Neon Smart Learning for Bright Futures.', 'Learning That Builds Futures.', 'KKCC Excellence Learning for Bright Futures.', 'Learn with clarity. Practice with courage. Rise with confidence.'))
   OR (key = 'brand_hero_description' AND value IN ('A bold digital classroom for real KKCC students — courses, lectures, notes, tests and progress in one colourful learning hub.', 'Learn from structured courses, expert guidance, smart practice and powerful study tools — all in one place.', 'KKCC brings courses, lectures, notes, tests, and progress tracking together in one colourful learning hub.', 'KKCC brings courses, lectures, notes, tests, and progress tracking together in one colorful learning hub.', 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.'));

INSERT INTO public.site_settings (key, value)
VALUES
  ('brand_logo_url', '/logo.png'),
  ('brand_primary_color', '#18f4d6'),
  ('brand_accent_color', '#f5d78e'),
  ('brand_background_color', '#050605'),
  ('brand_foreground_color', '#fff8e7'),
  ('brand_hero_title', 'KKCC Excellence Hub — Study That Makes You Return.'),
  ('brand_hero_highlight', 'Learn with clarity. Practice with courage. Rise with confidence.'),
  ('brand_hero_description', 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.')
ON CONFLICT (key) DO NOTHING;
