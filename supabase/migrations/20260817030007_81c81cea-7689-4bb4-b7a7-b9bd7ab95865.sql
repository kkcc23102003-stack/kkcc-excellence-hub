CREATE POLICY "Course content is readable" ON storage.objects
FOR SELECT USING (bucket_id = 'course-content');

CREATE POLICY "Admins upload course content" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update course content" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete course content" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));