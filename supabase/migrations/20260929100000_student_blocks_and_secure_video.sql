-- KKCC student app block/unblock security
-- Additive and non-destructive. Students cannot remove their own block.

CREATE TABLE IF NOT EXISTS public.student_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  reason text NOT NULL DEFAULT '',
  blocked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  blocked_at timestamptz NOT NULL DEFAULT now(),
  unblocked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  unblocked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.student_blocks
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reason text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS blocked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS blocked_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS unblocked_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS unblocked_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'student_blocks_user_id_key'
      AND conrelid = 'public.student_blocks'::regclass
  ) THEN
    ALTER TABLE public.student_blocks ADD CONSTRAINT student_blocks_user_id_key UNIQUE (user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_student_blocks_active ON public.student_blocks(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_student_blocks_blocked_at ON public.student_blocks(blocked_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_blocks TO authenticated;
GRANT ALL ON public.student_blocks TO service_role;
ALTER TABLE public.student_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own block status" ON public.student_blocks;
CREATE POLICY "Users can view own block status"
  ON public.student_blocks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all student blocks" ON public.student_blocks;
CREATE POLICY "Admins can view all student blocks"
  ON public.student_blocks FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage student blocks" ON public.student_blocks;
CREATE POLICY "Admins can manage student blocks"
  ON public.student_blocks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_student_blocks_updated_at ON public.student_blocks;
CREATE TRIGGER update_student_blocks_updated_at
  BEFORE UPDATE ON public.student_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_user_blocked(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_blocks sb
    WHERE sb.user_id = _user_id
      AND sb.is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.get_my_block_status()
RETURNS TABLE(is_blocked boolean, reason text, blocked_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(sb.is_active, false) AS is_blocked,
    COALESCE(sb.reason, '') AS reason,
    sb.blocked_at
  FROM (SELECT auth.uid() AS uid) me
  LEFT JOIN public.student_blocks sb
    ON sb.user_id = me.uid
   AND sb.is_active = true
  LIMIT 1
$$;

REVOKE EXECUTE ON FUNCTION public.is_user_blocked(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_my_block_status() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_user_blocked(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_my_block_status() TO authenticated, service_role;
