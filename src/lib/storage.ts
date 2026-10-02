import { supabase } from "@/integrations/supabase/client";
import {
  createStorageUploadTarget,
  recordUploadedFile,
  uploadSmallContentFileViaServer,
} from "@/lib/storage-upload.functions";

export const CONTENT_BUCKET = "course-content";
const YEAR = 60 * 60 * 24 * 365;
const SERVER_FALLBACK_MAX_BYTES = 3 * 1024 * 1024;

/**
 * Hard client-side ceiling aligned with Supabase Free project's practical single-file limit.
 * Very high-DPI scans should be compressed or split before upload instead of failing late.
 */
export const MAX_UPLOAD_BYTES = 45 * 1024 * 1024; // 45 MB

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "txt",
  "rtf",
  "csv",
  "odt",
  "epub",
  "zip",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "heic",
  "heif",
  "svg",
  "mp4",
  "webm",
  "mov",
  "m4v",
  "mp3",
  "m4a",
  "wav",
];

export function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function rawMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err ?? "");
}

function isNetworkLike(err: unknown) {
  const msg = rawMessage(err).toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("load failed") ||
    msg.includes("request could not reach")
  );
}

/** Turn any thrown value into a message a non-technical admin can act on. */
export function friendlyError(err: unknown): string {
  const raw = rawMessage(err);
  const msg = raw.toLowerCase();
  if (!raw) return "Something went wrong. Please try again.";
  if (isNetworkLike(err))
    return "Upload request could not reach the storage server. Make sure the latest app is redeployed and backend setup is applied, then retry. For urgent work, paste a hosted file link in the URL box.";
  if (msg.includes("aborted") || msg.includes("timeout"))
    return "The request timed out. Try again, or use a smaller file on a slower connection.";
  if (
    msg.includes("jwt") ||
    msg.includes("unauthorized") ||
    msg.includes("401") ||
    msg.includes("session")
  )
    return "Your session expired. Please sign in again and retry.";
  if (
    msg.includes("forbidden") ||
    msg.includes("row-level security") ||
    msg.includes("403") ||
    msg.includes("policy")
  )
    return "Permission denied — this action requires an admin account and latest storage policies.";
  if (msg.includes("payload too large") || msg.includes("entity too large") || msg.includes("413"))
    return `That file is too large for the storage limit. Keep uploads below ${humanSize(MAX_UPLOAD_BYTES)}; compress scanned PDFs to 300–450 DPI or split them by chapter.`;
  if (msg.includes("bucket") && (msg.includes("not found") || msg.includes("does not exist")))
    return "Storage bucket is missing. Apply the timestamped Supabase migration history, then confirm the private course-content bucket exists and its policies are current.";
  if (msg.includes("mime") || msg.includes("content type"))
    return "That file type is not supported.";
  if (msg.includes("duplicate") || msg.includes("already exists"))
    return "A file with that name already exists. Rename it and try again.";
  return raw;
}

function extensionOf(name: string) {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

function safeName(name: string, ext: string) {
  return (name || `upload.${ext || "bin"}`).replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-100);
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",").pop() || "" : result);
    };
    reader.readAsDataURL(file);
  });
}

async function recordUploadedFileBestEffort(input: {
  provider: string;
  bucket: string;
  path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
}) {
  try {
    await recordUploadedFile({ data: input });
  } catch (error) {
    console.warn("[storage] metadata record failed", error);
  }
}

async function uploadToSupabaseBucket({
  file,
  folder,
  bucket,
  contentType,
  ext,
}: {
  file: File;
  folder: string;
  bucket: string;
  contentType: string | undefined;
  ext: string;
}) {
  const path = `${folder}/${Date.now()}-${safeName(file.name, ext)}`;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: attempt > 0,
        ...(contentType ? { contentType } : {}),
      });
      if (error) throw error;
      lastError = null;
      break;
    } catch (err) {
      lastError = err;
      if (!isNetworkLike(err)) break;
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  if (lastError) throw lastError;

  const { data, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, YEAR);
  if (signError) throw signError;

  void recordUploadedFileBestEffort({
    provider: "supabase",
    bucket,
    path,
    public_url: data.signedUrl,
    mime_type: contentType ?? file.type ?? "",
    size_bytes: file.size,
  });

  return { path, url: data.signedUrl };
}

async function uploadSmallFileViaServerFallback({
  file,
  folder,
  contentType,
  ext,
}: {
  file: File;
  folder: string;
  contentType: string | undefined;
  ext: string;
}) {
  if (file.size > SERVER_FALLBACK_MAX_BYTES) {
    throw new Error(
      `Direct upload failed and server fallback only supports files up to ${humanSize(SERVER_FALLBACK_MAX_BYTES)}. Try a smaller file, compress the PDF, or paste a hosted file link.`,
    );
  }

  const base64 = await fileToBase64(file);
  const result = await uploadSmallContentFileViaServer({
    data: {
      folder,
      file_name: file.name || `upload.${ext || "bin"}`,
      content_type: contentType ?? "application/octet-stream",
      size_bytes: file.size,
      base64,
    },
  });
  return { path: result.path, url: result.public_url };
}

/**
 * Upload a file (desktop or mobile picker) and return a long-lived signed URL
 * that can be stored in the database.
 */
export async function uploadContentFile(
  file: File,
  folder: string,
): Promise<{ path: string; url: string }> {
  if (!file || file.size === 0)
    throw new Error("The selected file is empty or could not be read by your device.");
  if (file.size > MAX_UPLOAD_BYTES)
    throw new Error(
      `File too large (${humanSize(file.size)}). Keep each upload below ${humanSize(MAX_UPLOAD_BYTES)}; for scanned notes, compress to 300–450 DPI or split the PDF by chapter.`,
    );

  const ext = extensionOf(file.name);
  if (ext && !ALLOWED_EXTENSIONS.includes(ext))
    throw new Error(
      `Unsupported file type ".${ext}". Allowed: PDF, documents, images, audio and video.`,
    );

  // Mobile pickers frequently hand over a file with an empty/odd MIME type.
  const contentType = file.type && file.type !== "application/octet-stream" ? file.type : undefined;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session)
    throw new Error("Your session expired. Please sign in again and retry.");

  // Primary fix: do not let the admin settings/server-function lookup block uploads.
  // Supabase is the current primary storage, so try the known course-content bucket first.
  try {
    return await uploadToSupabaseBucket({ file, folder, bucket: CONTENT_BUCKET, contentType, ext });
  } catch (directError) {
    console.warn("[storage] direct Supabase upload failed", directError);

    if (isNetworkLike(directError)) {
      try {
        return await uploadSmallFileViaServerFallback({ file, folder, contentType, ext });
      } catch (serverError) {
        console.warn("[storage] server fallback upload failed", serverError);
        throw new Error(friendlyError(serverError));
      }
    }

    // If the default bucket fails for a non-network reason, try the configurable
    // upload target once. This preserves the future external-storage path.
    try {
      const uploadTarget = await createStorageUploadTarget({
        data: {
          folder,
          file_name: file.name || `upload.${ext || "bin"}`,
          content_type: contentType ?? "application/octet-stream",
          size_bytes: file.size,
        },
      });

      if (uploadTarget.provider === "supabase") {
        return await uploadToSupabaseBucket({
          file,
          folder,
          bucket: uploadTarget.bucket || CONTENT_BUCKET,
          contentType,
          ext,
        });
      }

      if (!uploadTarget.upload || !uploadTarget.path || !uploadTarget.public_url) {
        throw new Error("Storage provider did not return a valid upload target.");
      }
      const response = await fetch(uploadTarget.upload.url, {
        method: uploadTarget.upload.method,
        headers: uploadTarget.upload.headers,
        body: file,
      });
      if (!response.ok) {
        throw new Error(
          `External storage upload failed (${response.status}). Check provider credentials and bucket CORS.`,
        );
      }
      void recordUploadedFileBestEffort({
        provider: uploadTarget.provider,
        bucket: uploadTarget.bucket,
        path: uploadTarget.path,
        public_url: uploadTarget.public_url,
        mime_type: contentType ?? file.type ?? "",
        size_bytes: file.size,
      });
      return { path: uploadTarget.path, url: uploadTarget.public_url };
    } catch (targetError) {
      console.warn("[storage] configurable upload target failed", targetError);
      throw new Error(friendlyError(directError));
    }
  }
}

/** Extract the storage object path from a stored signed URL (null if external). */
function storageObjectFromUrl(value?: string | null) {
  if (!value) return null;
  const match = value.match(/\/object\/sign\/([^/]+)\/(.+?)(?:\?|$)/);
  if (!match?.[1] || !match?.[2]) return null;
  return { bucket: decodeURIComponent(match[1]), path: decodeURIComponent(match[2]) };
}

export function storagePathFromUrl(value?: string | null) {
  return storageObjectFromUrl(value)?.path ?? null;
}

/** Remove the file behind a stored URL, if it lives in Supabase Storage. */
export async function removeContentFile(value?: string | null) {
  const object = storageObjectFromUrl(value);
  if (!object) return;
  await supabase.storage.from(object.bucket || CONTENT_BUCKET).remove([object.path]);
}
