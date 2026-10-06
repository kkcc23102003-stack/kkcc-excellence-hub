-- Additive: preserves all notes, tests, questions, prices and student records.
-- Requires the existing KKCC Notes + Publish Fix setup.
BEGIN;
ALTER TABLE public.kkcc_materials ADD COLUMN IF NOT EXISTS thumbnail_text text;
ALTER TABLE public.kkcc_tests ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE public.kkcc_tests ADD COLUMN IF NOT EXISTS thumbnail_text text;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('kkcc-thumbnails','kkcc-thumbnails',true,4194304,
 ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;
-- Only server-admin uploads; no anonymous/student write policy is added.
NOTIFY pgrst, 'reload schema';
COMMIT;
