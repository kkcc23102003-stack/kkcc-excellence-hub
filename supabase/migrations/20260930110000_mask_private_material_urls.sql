-- KKCC private material URL masking hardening.
-- Safe update: no student, course, wallet, payment, material or storage object data is changed.
--
-- What this closes:
--   Direct anonymous/PostgREST reads of published materials can no longer download rows
--   containing a paid/course-included private file_url merely because the material metadata
--   is visible in the public app. Public metadata is still available through a masked RPC;
--   entitled users receive the real URL through the existing authenticated access RPC.

-- Keep blocked students from continuing to use access that was granted before they were blocked.
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
  OR (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.course_enrollments e
      WHERE e.user_id = auth.uid()
        AND e.course_id = _course_id
        AND e.status = 'active'
        AND (e.expires_at IS NULL OR e.expires_at > now())
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.student_blocks sb
      WHERE sb.user_id = auth.uid()
        AND sb.is_active = true
    )
  );
$$;

REVOKE ALL ON FUNCTION public.can_access_my_course(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_access_my_course(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.can_access_my_course(uuid) IS
  'Returns whether the current caller can read a full course deck: open published course, or active unexpired enrolment and no active student block.';

-- The helper only answers about the current caller. It cannot be used to inspect
-- another student's purchases and it returns false for blocked students.
CREATE OR REPLACE FUNCTION public.has_my_material_purchase(_material_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.material_purchases mp
      WHERE mp.user_id = auth.uid()
        AND mp.material_id = _material_id
        AND mp.status = 'active'
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.student_blocks sb
      WHERE sb.user_id = auth.uid()
        AND sb.is_active = true
    );
$$;

REVOKE ALL ON FUNCTION public.has_my_material_purchase(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_my_material_purchase(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.has_my_material_purchase(uuid) IS
  'True only when the current unblocked authenticated caller has an active purchase for the given material.';

-- Hide private material rows from ordinary direct table reads. Public free items stay
-- visible, entitled students can read their own unlocked rows, and admins keep the
-- existing separate all-materials/admin policies.
DROP POLICY IF EXISTS "Published materials are viewable by everyone" ON public.materials;
CREATE POLICY "Published free and entitled materials are viewable"
  ON public.materials FOR SELECT
  USING (
    is_published
    AND (
      course_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = course_id
          AND c.status = 'published'
      )
    )
    AND (
      COALESCE(access_type, 'course') = 'free'
      OR (course_id IS NULL AND COALESCE(access_type, 'course') <> 'paid')
      OR public.can_access_my_course(course_id)
      OR (
        COALESCE(access_type, 'course') = 'paid'
        AND public.has_my_material_purchase(id)
      )
    )
  );

-- Public metadata listing: every published material/title/price remains discoverable,
-- but private file URLs are replaced with NULL unless the caller is entitled.
-- This keeps the paid-notes shop/buy buttons usable without exposing source URLs.
CREATE OR REPLACE FUNCTION public.list_public_materials(_course_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  course_id uuid,
  lecture_id uuid,
  title text,
  material_type text,
  subject text,
  chapter text,
  class_level text,
  pages integer,
  file_url text,
  is_published boolean,
  sort_order integer,
  description text,
  thumbnail_url text,
  module_title text,
  batch text,
  access_type text,
  price integer,
  coin_price integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT
    m.id,
    m.course_id,
    m.lecture_id,
    m.title,
    m.material_type,
    m.subject,
    m.chapter,
    m.class_level,
    m.pages,
    CASE
      WHEN COALESCE(m.access_type, 'course') = 'free'
        OR (m.course_id IS NULL AND COALESCE(m.access_type, 'course') <> 'paid')
        OR public.can_access_my_course(m.course_id)
        OR (
          COALESCE(m.access_type, 'course') = 'paid'
          AND public.has_my_material_purchase(m.id)
        )
      THEN m.file_url
      ELSE NULL
    END AS file_url,
    m.is_published,
    m.sort_order,
    m.description,
    m.thumbnail_url,
    m.module_title,
    m.batch,
    m.access_type,
    m.price,
    m.coin_price,
    m.created_at,
    m.updated_at
  FROM public.materials m
  WHERE m.is_published = true
    AND (_course_id IS NULL OR m.course_id = _course_id)
    AND (
      m.course_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.courses c
        WHERE c.id = m.course_id
          AND c.status = 'published'
      )
    )
  ORDER BY m.sort_order ASC, m.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_public_materials(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_materials(uuid) TO anon, authenticated;

COMMENT ON FUNCTION public.list_public_materials(uuid) IS
  'Returns published material metadata with private file URLs masked to NULL for unauthorized callers.';
