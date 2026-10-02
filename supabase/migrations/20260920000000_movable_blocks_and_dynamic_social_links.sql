-- Movable website content blocks are stored inside website_content_json.
-- Dynamic future social/app/community links are stored in social_links_json.

INSERT INTO public.site_settings (key, value) VALUES
  ('website_content_json', ''),
  ('social_links_json', '')
ON CONFLICT (key) DO NOTHING;
