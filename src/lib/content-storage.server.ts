import { decodeSecureVideoToken } from "@/lib/video";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { projectContent } from "@/lib/project-content.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function contentStorageSettings() {
  const [publicRows, privateRows] = await Promise.all([
    projectContent
      .from("site_settings")
      .select("key,value")
      .in("key", [
        "storage_provider",
        "storage_bucket",
        "storage_region",
        "storage_endpoint",
        "storage_public_base_url",
      ]),
    projectContent
      .from("private_settings")
      .select("key,value")
      .in("key", ["storage_access_key_id", "storage_secret_access_key"]),
  ]);
  if (publicRows.error || privateRows.error)
    throw new Error(
      publicRows.error?.message || privateRows.error?.message || "Storage settings failed.",
    );
  const map = new Map([...publicRows.data, ...privateRows.data].map((row) => [row.key, row.value]));
  return {
    provider: map.get("storage_provider") || "supabase",
    bucket:
      map.get("storage_bucket") ||
      ((map.get("storage_provider") || "supabase") === "supabase" ? "course-content" : ""),
    region: map.get("storage_region") || "auto",
    endpoint: map.get("storage_endpoint") || "",
    public_base_url: map.get("storage_public_base_url") || "",
    access_key_id: map.get("storage_access_key_id") || "",
    secret_access_key: map.get("storage_secret_access_key") || "",
  };
}
export function contentStorageClient(settings: Awaited<ReturnType<typeof contentStorageSettings>>) {
  if (settings.provider === "supabase") return null;
  if (!["aws_s3", "cloudflare_r2", "backblaze_b2", "wasabi", "minio"].includes(settings.provider))
    throw new Error(
      "This storage provider does not support direct uploads. Paste an external URL instead.",
    );
  if (!settings.access_key_id || !settings.secret_access_key || !settings.bucket)
    throw new Error(
      "Configure the external bucket and server-only storage credentials before uploading.",
    );
  return new S3Client({
    region: settings.region,
    ...(settings.endpoint ? { endpoint: settings.endpoint } : {}),
    forcePathStyle: settings.provider !== "aws_s3",
    credentials: {
      accessKeyId: settings.access_key_id,
      secretAccessKey: settings.secret_access_key,
    },
  });
}
/** Durable private references are stored in PROJECT data; expiring links are issued only after an access check. */
export async function resolveContentUrl(value: string | null | undefined) {
  if (!value) return null;
  if (value.startsWith("kkccv1.")) {
    if (!decodeSecureVideoToken(value)) throw new Error("Invalid protected video token.");
    return value;
  }
  if (value.startsWith("kkcc-file://")) {
    const encoded = value.slice("kkcc-file://".length);
    const slash = encoded.indexOf("/");
    if (slash < 1) throw new Error("Invalid private file reference.");
    const bucket = decodeURIComponent(encoded.slice(0, slash));
    const path = decodeURIComponent(encoded.slice(slash + 1));
    const settings = await contentStorageSettings();
    if (bucket !== settings.bucket || !path || path.includes(".."))
      throw new Error("Private file is not in the configured educational bucket.");
    if (settings.provider === "supabase") {
      const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 3600);
      if (error || !data?.signedUrl)
        throw new Error(error?.message || "Unable to create a Supabase Storage URL.");
      return data.signedUrl;
    }
    const client = contentStorageClient(settings);
    if (!client) throw new Error("Storage provider is not configured.");
    return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: path }), {
      expiresIn: 3600,
    });
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") return null;
  if (
    trimmed.startsWith("data:application/pdf") ||
    trimmed.startsWith("data:text/html") ||
    trimmed.startsWith("data:text/plain") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

/** Call only after access checks (or for an explicitly free public note). */
export async function resolveNoteImages(text: string): Promise<string> {
  const { noteImageRefs, replaceNoteImageRefs } = await import("./note-image-refs");
  const urls = Object.fromEntries(
    await Promise.all(
      noteImageRefs(text).map(async (ref) => [ref, (await resolveContentUrl(ref)) || ref]),
    ),
  );
  return replaceNoteImageRefs(text, urls);
}
