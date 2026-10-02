-- Correct the UV palette to match the supplied KKCC K-logo.
-- This safely replaces the earlier temporary red/cyan defaults if they were already applied.
UPDATE public.site_settings
SET value = CASE key
  WHEN 'brand_primary_color' THEN '#18f4d6'
  WHEN 'brand_accent_color' THEN '#f5d78e'
  WHEN 'brand_background_color' THEN '#050605'
  WHEN 'brand_foreground_color' THEN '#fff8e7'
  WHEN 'brand_hero_highlight' THEN 'Learn with clarity. Practice with courage. Rise with confidence.'
  ELSE value
END,
updated_at = now()
WHERE (key = 'brand_primary_color' AND value IN ('#ff174f', '#0f766e', ''))
   OR (key = 'brand_accent_color' AND value IN ('#00e5ff', '#d9b66f', ''))
   OR (key = 'brand_background_color' AND value IN ('#07040d', ''))
   OR (key = 'brand_foreground_color' AND value IN ('#fff7ff', ''))
   OR (key = 'brand_hero_highlight' AND value IN ('Logo-Inspired UV Learning for Bright Futures.', 'Neon Smart Learning for Bright Futures.', 'Learning That Builds Futures.', 'KKCC Excellence Learning for Bright Futures.', 'Learn with clarity. Practice with courage. Rise with confidence.'));
