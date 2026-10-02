-- KKCC paid-course media hardening and scanned-PDF upload limit alignment.
-- Safe update: no student, course, wallet, payment or storage object data is changed.

-- Let policies check the signed-in student's active, unexpired course entitlement
-- without exposing other students' enrollment data through function arguments.
CREATE OR REPLACE FUNCTION public.can_access_my_course(_course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.courses c
    WHERE c.id = _course_id
      AND c.status = 'published'
      AND COALESCE(c.price, 0) <= 0
  )
  OR EXISTS (
    SELECT 1
    FROM public.course_enrollments e
    WHERE e.user_id = auth.uid()
      AND e.course_id = _course_id
      AND e.status = 'active'
      AND (e.expires_at IS NULL OR e.expires_at > now())
  );
$$;

REVOKE ALL ON FUNCTION public.can_access_my_course(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_my_course(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.can_access_my_course(uuid) IS
  'Returns whether the current signed-in user can read all lectures for a course: free courses, or an active unexpired enrolment. No PII or arbitrary user lookup is exposed.';

-- Close the direct anonymous/public API loophole for paid non-preview lecture video URLs.
-- Public users still receive free-course lectures and admin-marked free previews;
-- enrolled students receive their full course lecture deck; admins keep full access
-- through the existing admin lecture policies.
DROP POLICY IF EXISTS "Lectures of published courses are viewable by everyone" ON public.lectures;
CREATE POLICY "Lectures of published courses are viewable by everyone"
  ON public.lectures FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.id = lectures.course_id
        AND c.status = 'published'
        AND (
          COALESCE(c.price, 0) <= 0
          OR lectures.is_free = true
          OR public.can_access_my_course(lectures.course_id)
        )
    )
  );

-- Keep uploaded scanned notes aligned with the app's 45 MB guidance and the Free
-- plan's practical single-file ceiling. Existing objects are untouched.
UPDATE storage.buckets
SET file_size_limit = 47185920
WHERE id = 'course-content';

-- Do not let an anonymous caller mint fresh signed URLs merely because an object
-- path leaks. Stored signed URLs already granted by admins continue to be used by
-- the app's material-access flow; administrators retain full storage management.
DROP POLICY IF EXISTS "Course content is readable" ON storage.objects;
CREATE POLICY "Admins read course content"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));
