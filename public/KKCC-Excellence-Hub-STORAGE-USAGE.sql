-- Read-only usage report. Installs no cleanup/deletion job.
BEGIN;
CREATE OR REPLACE FUNCTION public.kkcc_storage_usage()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE buckets jsonb;
BEGIN
 IF NOT coalesce(public.has_role(auth.uid(),'admin'),false) THEN
  RAISE EXCEPTION 'Admin access required';
 END IF;
 SELECT coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) INTO buckets FROM (
  SELECT b.id AS bucket,
   count(o.id) AS files,
   coalesce(sum(CASE WHEN o.metadata->>'size' ~ '^[0-9]+$'
     THEN (o.metadata->>'size')::numeric ELSE 0 END),0) AS bytes,
   count(o.id) FILTER (WHERE o.metadata->>'size' IS NULL OR NOT (o.metadata->>'size' ~ '^[0-9]+$')) AS unknown_sizes
  FROM storage.buckets b LEFT JOIN storage.objects o ON o.bucket_id=b.id
  GROUP BY b.id ORDER BY b.id
 ) r;
 RETURN jsonb_build_object('database_bytes',pg_database_size(current_database()),
  'buckets',buckets,'checked_at',now());
END $$;
REVOKE ALL ON FUNCTION public.kkcc_storage_usage() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.kkcc_storage_usage() TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
