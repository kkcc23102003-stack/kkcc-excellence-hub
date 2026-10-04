-- KKCC current-project upgrade: Supabase remains the CMS/database and current file storage.
-- Future S3/R2 providers are selected from Admin -> Storage without changing content rows.

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tests') THEN
    ALTER TABLE public.tests
      ADD COLUMN IF NOT EXISTS syllabus_subject text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS syllabus_chapter text NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS syllabus_topic text NOT NULL DEFAULT '';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.syllabus_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.syllabus_nodes(id) ON DELETE CASCADE,
  node_type text NOT NULL CHECK (node_type IN ('subject','chapter','topic')),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_parent ON public.syllabus_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_nodes_type_name ON public.syllabus_nodes(node_type, name);
ALTER TABLE public.syllabus_nodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Syllabus is publicly readable" ON public.syllabus_nodes;
CREATE POLICY "Syllabus is publicly readable" ON public.syllabus_nodes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage syllabus" ON public.syllabus_nodes;
CREATE POLICY "Admins manage syllabus" ON public.syllabus_nodes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.syllabus_nodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.syllabus_nodes TO authenticated;
GRANT ALL ON public.syllabus_nodes TO service_role;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
    INSERT INTO public.site_settings(key,value)
    VALUES ('storage_provider','supabase'),('storage_bucket','course-content')
    ON CONFLICT (key) DO NOTHING;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'test_series_overrides') THEN
    UPDATE public.test_series_overrides
    SET price_inr = 0, price_coins = 0, updated_at = now()
    WHERE series_id IN ('punjab-ett-paper-a', 'punjab-ett-paper-b', 'punjab-ett-cadre');
  END IF;
END $$;

-- Current storage bucket. Keep it private; the app issues short-lived URLs after access checks.
INSERT INTO storage.buckets(id,name,public,file_size_limit)
VALUES ('course-content','course-content',false,47185920)
ON CONFLICT (id) DO UPDATE SET public=false;

DROP POLICY IF EXISTS "Admins upload course content" ON storage.objects;
CREATE POLICY "Admins upload course content" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins update course content" ON storage.objects;
CREATE POLICY "Admins update course content" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins delete course content" ON storage.objects;
CREATE POLICY "Admins delete course content" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'course-content' AND public.has_role(auth.uid(), 'admin'));
