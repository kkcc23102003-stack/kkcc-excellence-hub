-- Editable branding/theme defaults for Admin -> Branding.
-- The table already exists in the platform setup; this migration is idempotent.

INSERT INTO public.site_settings (key, value) VALUES
  ('brand_app_name', 'Kusum Kartik Coaching Centre'),
  ('brand_short_name', 'KKCC'),
  ('brand_tagline', 'Learn Better. Understand Deeper. Achieve More.'),
  ('brand_logo_url', '/logo.png'),
  ('brand_logo_alt', 'KKCC logo'),
  ('brand_show_logo_text', 'true'),
  ('brand_primary_color', '#18f4d6'),
  ('brand_accent_color', '#f5d78e'),
  ('brand_background_color', '#050605'),
  ('brand_foreground_color', '#fff8e7'),
  ('brand_hero_eyebrow', 'Learn Better. Understand Deeper. Achieve More.'),
  ('brand_hero_title', 'KKCC Excellence Hub — Study That Makes You Return.'),
  ('brand_hero_highlight', 'Learn with clarity. Practice with courage. Rise with confidence.'),
  ('brand_hero_description', 'KKCC turns lectures, notes, tests, and progress into a bright daily learning loop — so students know exactly what to open next and feel excited to continue.'),
  ('brand_cta_primary_label', 'Find My Next Win'),
  ('brand_cta_secondary_label', 'Continue Learning')
ON CONFLICT (key) DO NOTHING;
