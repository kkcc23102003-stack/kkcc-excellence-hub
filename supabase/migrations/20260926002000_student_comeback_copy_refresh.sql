-- Refresh default KKCC hero copy to the sharper student-comeback wording.
-- Safe for existing projects: only old bundled defaults are replaced, not custom admin text.
UPDATE public.site_settings
SET value = CASE key
  WHEN 'brand_hero_title' THEN 'KKCC Excellence Hub — Study That Makes You Return.'
  WHEN 'brand_hero_highlight' THEN 'Learn with clarity. Practice with courage. Rise with confidence.'
  WHEN 'brand_hero_description' THEN 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.'
  WHEN 'brand_cta_primary_label' THEN 'Find My Next Win'
  WHEN 'brand_cta_secondary_label' THEN 'Continue Learning'
  ELSE value
END,
updated_at = now()
WHERE (key = 'brand_hero_title' AND value IN ('Education That Builds Understanding.', 'KKCC Excellence Hub — Learn with Power.'))
   OR (key = 'brand_hero_highlight' AND value IN ('Logo-Inspired UV Learning for Bright Futures.', 'Neon Smart Learning for Bright Futures.', 'Learning That Builds Futures.', 'KKCC Excellence Learning for Bright Futures.'))
   OR (key = 'brand_hero_description' AND value IN ('A bold digital classroom for real KKCC students — courses, lectures, notes, tests and progress in one colourful learning hub.', 'Learn from structured courses, expert guidance, smart practice and powerful study tools — all in one place.', 'KKCC brings courses, lectures, notes, tests, and progress tracking together in one colourful learning hub.', 'KKCC brings courses, lectures, notes, tests, and progress tracking together in one colorful learning hub.'))
   OR (key = 'brand_cta_primary_label' AND value = 'Explore Courses')
   OR (key = 'brand_cta_secondary_label' AND value = 'Start Learning');

INSERT INTO public.site_settings (key, value)
VALUES
  ('brand_hero_title', 'KKCC Excellence Hub — Study That Makes You Return.'),
  ('brand_hero_highlight', 'Learn with clarity. Practice with courage. Rise with confidence.'),
  ('brand_hero_description', 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.'),
  ('brand_cta_primary_label', 'Find My Next Win'),
  ('brand_cta_secondary_label', 'Continue Learning')
ON CONFLICT (key) DO NOTHING;
