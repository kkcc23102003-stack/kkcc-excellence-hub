-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'School',
  class_level text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  faculty text NOT NULL DEFAULT '',
  course_type text NOT NULL DEFAULT 'Recorded',
  thumbnail_url text,
  hue integer NOT NULL DEFAULT 187,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  outcomes text[] NOT NULL DEFAULT '{}',
  price integer NOT NULL DEFAULT 0,
  original_price integer NOT NULL DEFAULT 0,
  discount_percent integer NOT NULL DEFAULT 0,
  duration_hours integer NOT NULL DEFAULT 0,
  lectures_count integer NOT NULL DEFAULT 0,
  tests_count integer NOT NULL DEFAULT 0,
  materials_count integer NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT courses_status_check CHECK (status IN ('draft','published','archived'))
);

GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all courses"
  ON public.courses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Lectures
CREATE TABLE public.lectures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_title text NOT NULL DEFAULT 'Module 01',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text,
  duration text NOT NULL DEFAULT '00:00',
  is_free boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.lectures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lectures TO authenticated;
GRANT ALL ON public.lectures TO service_role;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectures of published courses are viewable by everyone"
  ON public.lectures FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.status = 'published'));

CREATE POLICY "Admins can view all lectures"
  ON public.lectures FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage lectures"
  ON public.lectures FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON public.lectures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Study materials
CREATE TABLE public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  material_type text NOT NULL DEFAULT 'Notes',
  subject text NOT NULL DEFAULT '',
  chapter text NOT NULL DEFAULT '',
  class_level text NOT NULL DEFAULT '',
  pages integer NOT NULL DEFAULT 0,
  file_url text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.materials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materials TO authenticated;
GRANT ALL ON public.materials TO service_role;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published materials are viewable by everyone"
  ON public.materials FOR SELECT
  USING (
    is_published
    AND (course_id IS NULL OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.status = 'published'))
  );

CREATE POLICY "Admins can view all materials"
  ON public.materials FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage materials"
  ON public.materials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_lectures_course ON public.lectures(course_id, sort_order);
CREATE INDEX idx_materials_course ON public.materials(course_id, sort_order);
CREATE INDEX idx_courses_status ON public.courses(status, sort_order);