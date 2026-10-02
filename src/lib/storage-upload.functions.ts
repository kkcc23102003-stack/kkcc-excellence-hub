import { Buffer } from "node:buffer";
import { createServerFn } from "@tanstack/react-start";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DB as Database } from "@/integrations/supabase/db";
import type { SupabaseClient } from "@supabase/supabase-js";

const uploadTargetSchema = z.object({
  folder: z
    .string()
    .trim()
    .regex(/^[a-z0-9/_-]{1,120}$/i)
    .default("uploads"),
  file_name: z.string().trim().min(1).max(240),
  content_type: z.string().trim().max(160).default("application/octet-stream"),
  size_bytes: z
    .number()
    .int()
    .min(0)
    .max(1024 * 1024 * 200),
});

const serverUploadSchema = uploadTargetSchema.extend({
  base64: z
    .string()
    .min(1)
    .max(1024 * 1024 * 4),
});

const recordFileSchema = z.object({
  provider: z.string().trim().max(80),
  bucket: z.string().trim().max(180),
  path: z.string().trim().max(1000),
  public_url: z.string().trim().max(4000),
  original_url: z.string().trim().max(4000).optional().default(""),
  mime_type: z.string().trim().max(160).optional().default(""),
  size_bytes: z
    .number()
    .int()
    .min(0)
    .max(1024 * 1024 * 500)
    .optional()
    .default(0),
  linked_table: z.string().trim().max(80).optional().default(""),
  linked_id: z.string().uuid().nullable().optional().default(null),
});

type PlatformStorageSettings = {
  provider: string;
  bucket: string;
  region: string;
  endpoint: string;
  public_base_url: string;
  access_key_id: string;
  secret_access_key: string;
};

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden — admin access required");
}

function safeFileName(name: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
  return base || "file";
}

function publicUrlFor(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const encoded = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${normalizedBase}/${encoded}`;
}

async function readSettingMap(supabase: SupabaseClient<Database>) {
  const [{ data: site, error: siteError }, { data: privateRows, error: privateError }] =
    await Promise.all([
      supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "storage_provider",
          "storage_bucket",
          "storage_region",
          "storage_endpoint",
          "storage_public_base_url",
        ]),
      supabase
        .from("private_settings")
        .select("key, value")
        .in("key", ["storage_access_key_id", "storage_secret_access_key"]),
    ]);

  if (siteError) throw new Error(siteError.message);
  if (privateError) {
    console.warn(
      "[storage] private_settings not readable yet; falling back to Supabase defaults",
      privateError.message,
    );
  }

  const map = new Map<string, string>();
  for (const row of site ?? []) map.set(row.key, row.value ?? "");
  for (const row of privateError ? [] : (privateRows ?? [])) map.set(row.key, row.value ?? "");

  return {
    provider: map.get("storage_provider") || "supabase",
    bucket: map.get("storage_bucket") || "course-content",
    region: map.get("storage_region") || "auto",
    endpoint: map.get("storage_endpoint") || "",
    public_base_url: map.get("storage_public_base_url") || "",
    access_key_id: map.get("storage_access_key_id") || "",
    secret_access_key: map.get("storage_secret_access_key") || "",
  } satisfies PlatformStorageSettings;
}

function s3Client(settings: PlatformStorageSettings) {
  if (!settings.access_key_id || !settings.secret_access_key) {
    throw new Error("Storage access key and secret key are required for external storage uploads.");
  }

  return new S3Client({
    region: settings.region || "auto",
    ...(settings.endpoint ? { endpoint: settings.endpoint } : {}),
    forcePathStyle: settings.provider !== "aws_s3",
    credentials: {
      accessKeyId: settings.access_key_id,
      secretAccessKey: settings.secret_access_key,
    },
  });
}

export const createStorageUploadTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => uploadTargetSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const settings = await readSettingMap(context.supabase);

    if (settings.provider === "supabase") {
      return {
        provider: "supabase" as const,
        bucket: settings.bucket,
      };
    }

    if (settings.provider === "external_url") {
      throw new Error(
        "External URL mode does not support direct upload. Paste the already hosted file URL.",
      );
    }

    if (!settings.public_base_url) {
      throw new Error(
        "Set a public base URL for the selected storage provider before uploading public course files.",
      );
    }

    const key = `${data.folder.replace(/\/+$/g, "")}/${Date.now()}-${safeFileName(data.file_name)}`;
    const client = s3Client(settings);
    const command = new PutObjectCommand({
      Bucket: settings.bucket,
      Key: key,
      ContentType: data.content_type || "application/octet-stream",
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });

    return {
      provider: settings.provider,
      bucket: settings.bucket,
      path: key,
      public_url: publicUrlFor(settings.public_base_url, key),
      upload: {
        url: uploadUrl,
        method: "PUT" as const,
        headers: {
          "content-type": data.content_type || "application/octet-stream",
        },
      },
    };
  });

export const uploadSmallContentFileViaServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => serverUploadSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const settings = await readSettingMap(context.supabase).catch(() => ({
      provider: "supabase",
      bucket: "course-content",
      region: "",
      endpoint: "",
      public_base_url: "",
      access_key_id: "",
      secret_access_key: "",
    }));
    if (settings.provider !== "supabase") {
      throw new Error("Server fallback currently supports Supabase storage only.");
    }

    const buffer = Buffer.from(data.base64, "base64");
    if (buffer.length > 1024 * 1024 * 3) {
      throw new Error(
        "Server fallback supports files up to 3 MB. Upload larger files directly to Supabase or paste a hosted URL.",
      );
    }

    const key = `${data.folder.replace(/\/+$/g, "")}/${Date.now()}-${safeFileName(data.file_name)}`;
    const bucket = settings.bucket || "course-content";
    const { error } = await context.supabase.storage.from(bucket).upload(key, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: data.content_type || "application/octet-stream",
    });
    if (error) throw new Error(error.message);

    const { data: signed, error: signError } = await context.supabase.storage
      .from(bucket)
      .createSignedUrl(key, 60 * 60 * 24 * 365);
    if (signError) throw new Error(signError.message);

    await context.supabase
      .from("files")
      .insert({
        provider: "supabase",
        bucket,
        path: key,
        public_url: signed.signedUrl,
        mime_type: data.content_type,
        size_bytes: buffer.length,
        created_by: context.userId,
      } as never)
      .then(({ error }) => {
        if (error) console.warn("[storage] server fallback metadata record failed", error.message);
      });

    return { provider: "supabase" as const, bucket, path: key, public_url: signed.signedUrl };
  });

export const recordUploadedFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => recordFileSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("files").insert({
      provider: data.provider,
      bucket: data.bucket,
      path: data.path,
      public_url: data.public_url,
      original_url: data.original_url,
      mime_type: data.mime_type,
      size_bytes: data.size_bytes,
      linked_table: data.linked_table,
      linked_id: data.linked_id,
      created_by: context.userId,
    });
    if (error) {
      // Older databases may not have the metadata table yet. Upload success is more important
      // than blocking admins, so expose the failure in logs but keep the UI usable.
      console.warn("[storage] file metadata was not recorded", error.message);
      return { recorded: false, reason: error.message };
    }
    return { recorded: true };
  });
