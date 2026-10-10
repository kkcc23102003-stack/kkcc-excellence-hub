-- Installs private note-file support only. Does NOT move/delete existing text.
BEGIN;
ALTER TABLE public.kkcc_materials ADD COLUMN IF NOT EXISTS body_storage_path text;
ALTER TABLE public.kkcc_materials ADD COLUMN IF NOT EXISTS body_storage_sha256 text;
ALTER TABLE public.kkcc_materials ADD COLUMN IF NOT EXISTS body_storage_bytes bigint DEFAULT 0;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('kkcc-note-bodies','kkcc-note-bodies',false,1048576,ARRAY['text/plain'])
ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM storage.buckets WHERE id='kkcc-note-bodies' AND public)
 THEN RAISE EXCEPTION 'kkcc-note-bodies must be a PRIVATE bucket'; END IF;
END $$;
-- A restrictive policy also blocks this bucket if older permissive policies are broad.
DROP POLICY IF EXISTS kkcc_note_bodies_server_only ON storage.objects;
CREATE POLICY kkcc_note_bodies_server_only ON storage.objects
AS RESTRICTIVE FOR ALL TO anon,authenticated
USING(bucket_id <> 'kkcc-note-bodies')
WITH CHECK(bucket_id <> 'kkcc-note-bodies');
-- File access is through the authorized service-role server only.
CREATE OR REPLACE FUNCTION public.move_note_body_to_storage(
 p_actor uuid,p_id uuid,p_updated timestamptz,p_source_md5 text,
 p_path text,p_sha256 text,p_bytes bigint
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE changed integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false)
 THEN RAISE EXCEPTION 'Admin server only'; END IF;
 IF p_path IS NULL OR p_path NOT LIKE p_id::text || '/%.txt'
 OR p_path LIKE '%..%' OR p_sha256 IS NULL OR p_sha256 !~ '^[a-f0-9]{64}$'
 OR p_bytes IS NULL OR p_bytes NOT BETWEEN 1 AND 1048576
 THEN RAISE EXCEPTION 'Invalid verified note reference'; END IF;
 UPDATE public.kkcc_materials SET description='',body_storage_path=p_path,
 body_storage_sha256=p_sha256,body_storage_bytes=p_bytes,updated_at=clock_timestamp()
 WHERE id=p_id AND body_storage_path IS NULL
 AND updated_at IS NOT DISTINCT FROM p_updated
 AND md5(coalesce(description,''))=p_source_md5;
 GET DIAGNOSTICS changed=ROW_COUNT;
 RETURN changed=1;
END $$;
REVOKE ALL ON FUNCTION public.move_note_body_to_storage(uuid,uuid,timestamptz,text,text,text,bigint) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.move_note_body_to_storage(uuid,uuid,timestamptz,text,text,text,bigint) TO service_role;
-- Counts are computed in PostgreSQL; preview never downloads all legacy bodies.
CREATE OR REPLACE FUNCTION public.note_body_storage_status(p_actor uuid)
RETURNS TABLE(inline_count bigint,inline_bytes bigint,stored_count bigint)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' OR NOT coalesce(public.has_role(p_actor,'admin'),false)
 THEN RAISE EXCEPTION 'Admin server only'; END IF;
 RETURN QUERY SELECT
 count(*) FILTER(WHERE body_storage_path IS NULL AND coalesce(description,'')<>''),
 coalesce(sum(octet_length(description)) FILTER(WHERE body_storage_path IS NULL),0)::bigint,
 count(*) FILTER(WHERE body_storage_path IS NOT NULL)
 FROM public.kkcc_materials;
END $$;
REVOKE ALL ON FUNCTION public.note_body_storage_status(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.note_body_storage_status(uuid) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
