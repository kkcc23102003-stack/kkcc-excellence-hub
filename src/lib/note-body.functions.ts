import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const manageNoteBodyStorage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .discriminatedUnion("action", [
        z.object({ action: z.literal("preview") }),
        z.object({ action: z.literal("move"), confirmation: z.literal("MOVE NOTES TO STORAGE") }),
      ])
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("./learning.server");
    await assertAdmin(context);
    const { projectContent, flushProjectContentCaches } = await import("./project-content.server");
    const { storeNoteBody } = await import("./note-body.server");
    const { isLocalManagedFixture } = await import("./managed-content-tables");
    const { createHash } = await import("node:crypto");
    const list = async () => {
      const result = await projectContent.from("materials").select("*").order("id");
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    };
    const local = isLocalManagedFixture("materials", process.env);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let moved = 0,
      skipped = 0;
    const errors: string[] = [];
    if (data.action === "move") {
      // Only five full legacy bodies cross the network in production.
      const candidates = local
        ? null
        : await supabaseAdmin
            .from("kkcc_materials")
            .select("*")
            .is("body_storage_path", null)
            .neq("description", "")
            .order("id")
            .limit(5);
      if (candidates?.error)
        throw new Error(`${candidates.error.message}. Run NOTE-BODIES SQL setup.`);
      const rows = local
        ? (await list())
            .filter((row) => !row.body_storage_path && Boolean(row.description))
            .slice(0, 5)
        : candidates?.data || [];
      for (const row of rows) {
        try {
          const body = await storeNoteBody(row.id, row.description);
          let updated = false;
          if (local) {
            const result = await projectContent
              .from("materials")
              .update({ ...body, description: "", updated_at: new Date().toISOString() })
              .eq("id", row.id)
              .eq("description", row.description)
              .eq("updated_at", row.updated_at)
              .select("*");
            if (result.error) throw new Error(result.error.message);
            updated = Boolean(result.data?.length);
          } else {
            const result = await supabaseAdmin.rpc("move_note_body_to_storage", {
              p_actor: context.userId,
              p_id: row.id,
              p_updated: row.updated_at || null,
              p_source_md5: createHash("md5").update(row.description).digest("hex"),
              p_path: body.body_storage_path!,
              p_sha256: body.body_storage_sha256!,
              p_bytes: body.body_storage_bytes!,
            });
            if (result.error)
              throw new Error(`${result.error.message}. Check NOTE-BODIES SQL setup.`);
            updated = result.data;
          }
          if (updated) moved++;
          else skipped++;
        } catch (error) {
          errors.push(`${row.title}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      flushProjectContentCaches();
    }
    if (!local) {
      const status = await supabaseAdmin.rpc("note_body_storage_status", {
        p_actor: context.userId,
      });
      if (status.error || !status.data?.[0])
        throw new Error(
          `${status.error?.message || "Storage status unavailable"}. Run NOTE-BODIES SQL setup.`,
        );
      return { moved, skipped, errors, ...status.data[0] };
    }
    const rows = await list();
    const inline = rows.filter((row) => !row.body_storage_path && Boolean(row.description));
    return {
      moved,
      skipped,
      errors,
      inline_count: inline.length,
      stored_count: rows.filter((row) => Boolean(row.body_storage_path)).length,
      inline_bytes: inline.reduce(
        (sum, row) => sum + Buffer.byteLength(row.description || "", "utf8"),
        0,
      ),
    };
  });
