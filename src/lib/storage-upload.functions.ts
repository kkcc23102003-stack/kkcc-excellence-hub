import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Buffer } from "node:buffer";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { contentStorageSettings, contentStorageClient } from "@/lib/content-storage.server";
import { projectContent } from "@/lib/project-content.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
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

export const createStorageUploadTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => uploadTargetSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const settings = await contentStorageSettings();
    if (!settings.bucket) throw new Error("Configure a storage bucket in Admin → Storage first.");
    const key = `${data.folder.replace(/\/+$/g, "")}/${Date.now()}-${safeFileName(data.file_name)}`;
    const publicImage =
      data.content_type.startsWith("image/") &&
      (/^(branding|course-thumbnails|material-thumbnails|faculty-images|website-images|logos|banners)(?:\/|$)/.test(
        data.folder,
      ) ||
        /(?:^|\/)(?:thumbnail|thumbnails)$/.test(data.folder));
    const public_url =
      publicImage && settings.public_base_url
        ? publicUrlFor(settings.public_base_url, key)
        : `kkcc-file://${encodeURIComponent(settings.bucket)}/${encodeURIComponent(key)}`;

    if (settings.provider === "supabase") {
      return {
        provider: "supabase",
        bucket: settings.bucket,
        path: key,
        public_url,
        upload: null,
      };
    }
    if (settings.provider === "external_url")
      throw new Error(
        "External URL mode does not accept file uploads. Paste the Drive/hosted URL instead.",
      );

    const client = contentStorageClient(settings);
    if (!client) throw new Error("Storage provider is not configured.");
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: settings.bucket,
        Key: key,
        ContentType: data.content_type,
        CacheControl: "private,no-store",
      }),
      { expiresIn: 900 },
    );
    return {
      provider: settings.provider,
      bucket: settings.bucket,
      path: key,
      public_url,
      upload: {
        url: uploadUrl,
        method: "PUT" as const,
        headers: { "content-type": data.content_type || "application/octet-stream" },
      },
    };
  });

export const uploadSmallContentFileViaServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => serverUploadSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const settings = await contentStorageSettings();
    if (!settings.bucket) throw new Error("Configure a storage bucket in Admin → Storage first.");
    const buffer = Buffer.from(data.base64, "base64");
    if (buffer.length > 3 * 1024 * 1024 || buffer.length !== data.size_bytes)
      throw new Error("Invalid upload size; server fallback supports up to 3 MB.");
    const key = `${data.folder.replace(/\/+$/g, "")}/${Date.now()}-${safeFileName(data.file_name)}`;
    const publicImage =
      data.content_type.startsWith("image/") &&
      (/^(branding|course-thumbnails|material-thumbnails|faculty-images|website-images|logos|banners)(?:\/|$)/.test(
        data.folder,
      ) ||
        /(?:^|\/)(?:thumbnail|thumbnails)$/.test(data.folder));
    const public_url =
      publicImage && settings.public_base_url
        ? publicUrlFor(settings.public_base_url, key)
        : `kkcc-file://${encodeURIComponent(settings.bucket)}/${encodeURIComponent(key)}`;

    if (settings.provider === "supabase") {
      const { error } = await supabaseAdmin.storage.from(settings.bucket).upload(key, buffer, {
        contentType: data.content_type,
        upsert: true,
        cacheControl: "3600",
      });
      if (error) throw new Error(error.message);
    } else {
      const client = contentStorageClient(settings);
      if (!client) throw new Error("Storage provider is not configured.");
      await client.send(
        new PutObjectCommand({
          Bucket: settings.bucket,
          Key: key,
          Body: buffer,
          ContentType: data.content_type,
          CacheControl: "private,no-store",
        }),
      );
    }

    const recorded = await projectContent.from("files").insert({
      provider: settings.provider,
      bucket: settings.bucket,
      path: key,
      public_url,
      mime_type: data.content_type,
      size_bytes: buffer.length,
      created_by: context.userId,
    });
    if (recorded.error) {
      console.warn("[storage] file metadata was not recorded", recorded.error.message);
    }
    return { provider: settings.provider, bucket: settings.bucket, path: key, public_url };
  });

export const recordUploadedFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => recordFileSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await projectContent.from("files").insert({
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
      console.warn("[storage] file metadata was not recorded", error.message);
      return { recorded: false, reason: error.message };
    }
    return { recorded: true };
  });

export const deleteEducationalFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ url: z.string().min(1).max(4000) }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const metadata = await projectContent
      .from("files")
      .select("*")
      .eq("public_url", data.url)
      .maybeSingle();
    if (metadata.error) throw new Error(metadata.error.message);
    if (!metadata.data) return { removed: false };
    const settings = await contentStorageSettings();
    if (metadata.data.bucket !== settings.bucket)
      throw new Error(
        "This file belongs to a different storage bucket/provider. Verify migration before deleting it.",
      );
    if (metadata.data.provider === "supabase") {
      const { error } = await supabaseAdmin.storage
        .from(settings.bucket)
        .remove([metadata.data.path]);
      if (error) throw new Error(error.message);
    } else {
      const client = contentStorageClient(settings);
      if (!client) throw new Error("Storage provider is not configured.");
      await client.send(
        new DeleteObjectCommand({ Bucket: settings.bucket, Key: metadata.data.path }),
      );
    }
    const deleted = await projectContent.from("files").delete().eq("id", metadata.data.id);
    if (deleted.error) throw new Error(deleted.error.message);
    return { removed: true };
  });
