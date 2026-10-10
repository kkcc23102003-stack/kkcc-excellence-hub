import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
const reportSchema = z.object({
  cutoff: z.string(),
  counts: z.record(z.number()),
  remaining: z.number(),
  pending_files: z.number(),
});
export const removeOldEducationalContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        action: z.enum(["preview", "remove"]),
        cutoff: z.string().datetime({ offset: true }).optional(),
        confirmation: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("./learning.server");
    await assertAdmin(context);
    if (
      data.action === "remove" &&
      (data.confirmation !== "DELETE OLD NOTES AND TESTS" || !data.cutoff)
    )
      throw new Error("Review counts and confirm permanent content removal first.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { isLocalManagedFixture } = await import("./managed-content-tables");
    const { projectContent, mutateProjectDocument, flushProjectContentCaches } =
      await import("./project-content.server");
    const local = isLocalManagedFixture("materials", process.env);
    if (data.action === "remove") {
      const { protectExistingAttemptPapers } = await import("./result-paper.server");
      const protectedPapers = await protectExistingAttemptPapers(context, data.cutoff!);
      if (protectedPapers.remaining) {
        const preview = await supabaseAdmin.rpc("admin_remove_old_content", {
          p_actor: context.userId,
          p_action: "preview",
          p_before: data.cutoff!,
        });
        if (preview.error) throw new Error(preview.error.message);
        return {
          ...reportSchema.parse(preview.data),
          remaining: reportSchema.parse(preview.data).remaining + protectedPapers.remaining,
          errors: [
            `${protectedPapers.remaining} existing attempt papers still need protection. No library deletion yet; repeat this batch.`,
          ],
        };
      }
    }
    const params = {
      p_actor: context.userId,
      p_action: data.action,
      ...(data.cutoff ? { p_before: data.cutoff } : {}),
      ...(data.confirmation ? { p_confirmation: data.confirmation } : {}),
    };
    const result = await supabaseAdmin.rpc("admin_remove_old_content", params);
    if (result.error) throw new Error(`${result.error.message}. Install CONTENT-RESET SQL first.`);
    const report = reportSchema.parse(result.data);
    const errors: string[] = [];
    const { readCustomSeriesCatalog } = await import("./learning.server");
    const { LEARNING_SERIES, getEffectiveLearningSeries, parseCustomSeriesCatalog } =
      await import("./test-series-catalog");
    const catalogBefore = await projectContent
      .from("site_settings")
      .select("*")
      .eq("key", "test_series_custom_catalog")
      .maybeSingle();
    if (catalogBefore.error) throw new Error(catalogBefore.error.message);
    const eligibleCatalog =
      !catalogBefore.data ||
      new Date(catalogBefore.data.updated_at || "1970-01-01") <= new Date(report.cutoff);
    if (data.action === "remove") {
      if (eligibleCatalog) {
        const current = parseCustomSeriesCatalog(catalogBefore.data?.value || "{}");
        const empty = {
          includeBuiltIn: false,
          addedSeries: [],
          removedSeriesIds: [
            ...new Set([
              ...LEARNING_SERIES.map((row) => row.id),
              ...(current.addedSeries || []).map((row) => row.id),
            ]),
          ],
          syllabusBySeriesId: {},
          customQuestionsByChapter: {},
        };
        const payload = {
          key: "test_series_custom_catalog",
          value: JSON.stringify(empty),
          updated_at: new Date().toISOString(),
        };
        const saved = catalogBefore.data
          ? await projectContent
              .from("site_settings")
              .update(payload)
              .eq("key", payload.key)
              .eq("updated_at", catalogBefore.data.updated_at)
              .eq("value", catalogBefore.data.value)
          : await projectContent
              .from("site_settings")
              .upsert(payload, { onConflict: "key", ignoreDuplicates: true });
        if (saved.error) throw new Error(saved.error.message);
        if (!saved.data?.length)
          errors.push(
            "Series catalog changed during removal and was preserved. Review again if you intend to remove the changed catalog.",
          );
      } else {
        const current = parseCustomSeriesCatalog(catalogBefore.data?.value || "{}");
        if (getEffectiveLearningSeries(current).length)
          errors.push(
            "Series catalog edited after review was preserved. Review again to include it.",
          );
      }

      if (local) {
        const files: Array<{ bucket: string; path: string }> = [];
        await mutateProjectDocument((doc) => {
          const rows = (doc.tables["materials"] || [])
            .filter(
              (row) =>
                !row["content_deleted_at"] &&
                new Date(String(row["created_at"] || "1970-01-01")) <= new Date(report.cutoff),
            )
            .slice(0, 500);
          for (const row of rows) {
            if (row["body_storage_path"])
              files.push({ bucket: "kkcc-note-bodies", path: String(row["body_storage_path"]) });
            Object.assign(row, {
              description: "",
              file_url: null,
              thumbnail_url: null,
              is_published: false,
              body_storage_path: null,
              body_storage_sha256: null,
              body_storage_bytes: 0,
              content_deleted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        });
        if (files.length) {
          const queued = await supabaseAdmin
            .from("kkcc_removed_content_files")
            .upsert(files, { onConflict: "bucket,path", ignoreDuplicates: true });
          if (queued.error) throw new Error(queued.error.message);
        }
        await projectContent
          .from("site_settings")
          .upsert({ key: "builtin_materials_adopted", value: "true" }, { onConflict: "key" });
      }
      const listed = await supabaseAdmin.rpc("admin_remove_old_content", {
        p_actor: context.userId,
        p_action: "files",
      });
      if (listed.error) throw new Error(listed.error.message);
      const files = z
        .array(
          z.object({ bucket: z.enum(["kkcc-note-bodies", "kkcc-test-bodies"]), path: z.string() }),
        )
        .parse(listed.data);
      const done: Array<{ bucket: string; path: string }> = [];
      for (const file of files)
        try {
          if (!/^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(txt|json)$/.test(file.path))
            throw new Error("Unsafe object path; review manually");
          if (local && file.bucket === "kkcc-note-bodies") {
            const active = await projectContent.from("materials").select("*");
            if (active.error) throw new Error(active.error.message);
            if (active.data.some((row) => row.body_storage_path === file.path)) {
              done.push(file);
              continue;
            }
          }
          if (process.env["KKCC_FIXTURE_LOCAL_CMS"] === "1" && !process.env["VERCEL"]) {
            const fs = await import("node:fs/promises"),
              path = await import("node:path");
            await fs.rm(
              path.resolve(
                ".cache",
                file.bucket === "kkcc-note-bodies" ? "fixture-note-bodies" : "fixture-test-bodies",
                file.path,
              ),
              { force: true },
            );
          } else {
            const removed = await supabaseAdmin.storage.from(file.bucket).remove([file.path]);
            if (removed.error) throw new Error(removed.error.message);
          }
          done.push(file);
        } catch (error) {
          errors.push(
            `${file.bucket}/${file.path}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      if (done.length) {
        const ack = await supabaseAdmin.rpc("admin_remove_old_content", {
          p_actor: context.userId,
          p_action: "ack",
          p_files: done,
        });
        if (ack.error) throw new Error(ack.error.message);
      }
      flushProjectContentCaches();
    }
    const fresh = await supabaseAdmin.rpc("admin_remove_old_content", {
      p_actor: context.userId,
      p_action: "preview",
      p_before: report.cutoff,
    });
    if (fresh.error) throw new Error(fresh.error.message);
    const final = reportSchema.parse(fresh.data);
    if (local) {
      const notes = await projectContent.from("materials").select("*");
      if (notes.error) throw new Error(notes.error.message);
      const count = notes.data.filter(
        (row) => new Date(row.created_at) <= new Date(final.cutoff),
      ).length;
      final.counts["preview_notes"] = count;
      final.remaining += count;
    }
    const latestCatalog = await projectContent
      .from("site_settings")
      .select("*")
      .eq("key", "test_series_custom_catalog")
      .maybeSingle();
    if (latestCatalog.error) throw new Error(latestCatalog.error.message);
    if (!latestCatalog.data || new Date(latestCatalog.data.updated_at) <= new Date(final.cutoff)) {
      const count = getEffectiveLearningSeries(await readCustomSeriesCatalog()).length;
      final.counts["old_test_series"] = count;
      final.remaining += count;
    }
    return { ...final, errors };
  });
