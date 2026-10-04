-- NOTES READ-ONLY FIX: durable Supabase notes/settings, no S3 required.
-- Additive. Does not delete legacy data, student records or question banks.
-- Deploy updated app alongside this migration. Never expose service_role in VITE_*.
BEGIN;
CREATE TABLE IF NOT EXISTS public.kkcc_materials (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 course_id uuid, lecture_id uuid,
 title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '',
 subject text NOT NULL DEFAULT '', chapter text NOT NULL DEFAULT '',
 module_title text NOT NULL DEFAULT '', batch text NOT NULL DEFAULT '',
 material_type text NOT NULL DEFAULT 'Notes', class_level text NOT NULL DEFAULT '',
 pages integer NOT NULL DEFAULT 0, file_url text, thumbnail_url text,
 access_type text NOT NULL DEFAULT 'free', price integer NOT NULL DEFAULT 0,
 coin_price integer NOT NULL DEFAULT 0, is_published boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_site_settings (
 key text PRIMARY KEY, value text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_private_settings (
 key text PRIMARY KEY, value text NOT NULL DEFAULT '', updated_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.kkcc_content_files (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL DEFAULT 'supabase',
 bucket text NOT NULL DEFAULT 'course-content', path text NOT NULL,
 public_url text NOT NULL DEFAULT '', original_url text NOT NULL DEFAULT '',
 mime_type text NOT NULL DEFAULT '', size_bytes bigint NOT NULL DEFAULT 0,
 linked_table text NOT NULL DEFAULT '', linked_id uuid, created_by uuid,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
-- App server checks admin/student access before reading these tables.
-- Browser roles must NEVER read private settings or paid note bodies directly.
ALTER TABLE public.kkcc_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_private_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kkcc_content_files ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kkcc_materials,public.kkcc_site_settings,public.kkcc_private_settings,public.kkcc_content_files FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.kkcc_materials,public.kkcc_site_settings,public.kkcc_private_settings,public.kkcc_content_files TO service_role;
CREATE INDEX IF NOT EXISTS kkcc_materials_published_order ON public.kkcc_materials(is_published,sort_order);

-- Copy matching old CMS rows once, without overwriting any newer admin edits.
DO $$ BEGIN
 IF to_regclass('public.materials') IS NOT NULL THEN
   EXECUTE $copy$
     INSERT INTO public.kkcc_materials
     SELECT (jsonb_populate_record(NULL::public.kkcc_materials,
       '{"title":"","description":"","subject":"","chapter":"","module_title":"","batch":"","material_type":"Notes","class_level":"","pages":0,"access_type":"free","price":0,"coin_price":0,"is_published":false,"sort_order":0}'::jsonb
       || jsonb_build_object('created_at',now(),'updated_at',now()) || jsonb_strip_nulls(to_jsonb(m)))).*
     FROM public.materials m ON CONFLICT(id) DO NOTHING
   $copy$;
 END IF;
 IF to_regclass('public.site_settings') IS NOT NULL THEN
   EXECUTE 'INSERT INTO public.kkcc_site_settings(key,value) SELECT key,coalesce(value,'''') FROM public.site_settings ON CONFLICT(key) DO NOTHING';
 END IF;
 IF to_regclass('public.private_settings') IS NOT NULL THEN
   EXECUTE 'INSERT INTO public.kkcc_private_settings(key,value) SELECT key,coalesce(value,'''') FROM public.private_settings ON CONFLICT(key) DO NOTHING';
 END IF;
END $$;
-- Do not overwrite an existing provider and break previously uploaded objects.
INSERT INTO public.kkcc_site_settings(key,value) VALUES
 ('storage_provider','supabase'),('storage_bucket','course-content')
ON CONFLICT(key) DO NOTHING;
INSERT INTO storage.buckets(id,name,public,file_size_limit)
VALUES('course-content','course-content',false,47185920)
ON CONFLICT(id) DO NOTHING;
DROP POLICY IF EXISTS "KKCC notes admin upload" ON storage.objects;
CREATE POLICY "KKCC notes admin upload" ON storage.objects FOR INSERT TO authenticated
 WITH CHECK(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "KKCC notes admin update" ON storage.objects;
CREATE POLICY "KKCC notes admin update" ON storage.objects FOR UPDATE TO authenticated
 USING(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'))
 WITH CHECK(bucket_id='course-content' AND public.has_role(auth.uid(),'admin'));
NOTIFY pgrst,'reload schema';
COMMIT;
-- Existing file/S3 project-content documents are not in legacy SQL tables and
-- are not copied by this SQL. Export/back up and import them separately if used.
