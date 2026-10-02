-- Public aggregate counters for the website homepage.
-- This exposes only safe totals (no student names, emails, phones, or private data).
CREATE OR REPLACE FUNCTION public.get_public_platform_stats()
RETURNS TABLE (
  students_joined bigint,
  active_students bigint,
  published_courses bigint,
  published_lectures bigint,
  published_materials bigint,
  published_tests bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (
      SELECT count(*)
      FROM public.profiles p
      WHERE NOT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = p.id
          AND ur.role = 'admin'
      )
    ) AS students_joined,
    (
      SELECT count(DISTINCT ce.user_id)
      FROM public.course_enrollments ce
      WHERE ce.status = 'active'
        AND (ce.expires_at IS NULL OR ce.expires_at > now())
        AND NOT EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = ce.user_id
            AND ur.role = 'admin'
        )
    ) AS active_students,
    (
      SELECT count(*)
      FROM public.courses c
      WHERE c.status = 'published'
    ) AS published_courses,
    (
      SELECT count(*)
      FROM public.lectures l
      INNER JOIN public.courses c ON c.id = l.course_id
      WHERE c.status = 'published'
    ) AS published_lectures,
    (
      SELECT count(*)
      FROM public.materials m
      WHERE m.is_published = true
    ) AS published_materials,
    (
      SELECT count(*)
      FROM public.tests t
      WHERE t.is_published = true
    ) AS published_tests;
$$;

REVOKE ALL ON FUNCTION public.get_public_platform_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_platform_stats() TO anon, authenticated;
