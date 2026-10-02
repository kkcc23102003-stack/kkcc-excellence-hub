-- Idempotent repair for admin uploads. This creates the private course-content
-- bucket and refreshes storage RLS policies so admins can upload PDFs, notes,
-- thumbnails, audio, and lecture videos from the deployed admin panel.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-content', 'course-content', false, 209715200, NULL)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Course content is readable" ON storage.objects;
CREATE POLICY "Course content is readable" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'course-content');

DROP POLICY IF EXISTS "Admins upload course content" ON storage.objects;
CREATE POLICY "Admins upload course content" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update course content" ON storage.objects;
CREATE POLICY "Admins update course content" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete course content" ON storage.objects;
CREATE POLICY "Admins delete course content" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));
