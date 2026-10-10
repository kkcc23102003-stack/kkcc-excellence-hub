import { thumbnailFields } from "./thumbnail";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
export const publicThumbnail = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    z.object({ kind: z.enum(["tests", "materials"]), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { projectContent } = await import("./project-content.server");
    const { resolveContentUrl } = await import("./content-storage.server");
    const result = await projectContent
      .from(data.kind)
      .select("*")
      .eq("id", data.id)
      .eq("is_published", true)
      .maybeSingle();
    if (result.error) throw new Error(result.error.message);
    // Only a published record's cover; never a student-supplied private file reference.
    return result.data?.thumbnail_url ? resolveContentUrl(result.data.thumbnail_url) : null;
  });

export const uploadThumbnail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        base64: z
          .string()
          .min(1)
          .max(6 * 1024 * 1024),
        mime: z.enum(["image/png", "image/jpeg", "image/webp"]),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("./learning.server");
    await assertAdmin(context);
    const { randomUUID } = await import("node:crypto");
    const { validateThumbnailBytes } = await import("./thumbnail-upload.server");
    const bytes = Buffer.from(data.base64, "base64");
    validateThumbnailBytes(bytes, data.mime);
    const path = `${randomUUID()}.${data.mime === "image/jpeg" ? "jpg" : data.mime.split("/")[1]}`;
    if (process.env["KKCC_FIXTURE_LOCAL_CMS"] === "1" && !process.env["VERCEL"]) {
      const fs = await import("node:fs/promises");
      await fs.mkdir("dist/client/uploads/thumbnails", { recursive: true });
      await fs.writeFile(`dist/client/uploads/thumbnails/${path}`, bytes);
      return { url: `/uploads/thumbnails/${path}` };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from("kkcc-thumbnails")
      .upload(path, bytes, { contentType: data.mime, cacheControl: "31536000", upsert: false });
    if (error)
      throw new Error(
        `Thumbnail upload failed: ${error.message}. Run KKCC-Excellence-Hub-THUMBNAILS.sql and retry.`,
      );
    return { url: supabaseAdmin.storage.from("kkcc-thumbnails").getPublicUrl(path).data.publicUrl };
  });

/** Cover-only metadata edits must not rebuild/revalidate an entire generated exam. */
export const saveTestThumbnail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ id: z.string().uuid(), ...thumbnailFields }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("./learning.server");
    await assertAdmin(context);
    const { projectContent } = await import("./project-content.server");
    const { id, ...cover } = data;
    const result = await projectContent
      .from("tests")
      .update({
        ...(cover.thumbnail_url !== undefined ? { thumbnail_url: cover.thumbnail_url } : {}),
        ...(cover.thumbnail_text !== undefined ? { thumbnail_text: cover.thumbnail_text } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
