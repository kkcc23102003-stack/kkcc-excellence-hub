import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const manageTestBodyStorage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        action: z.enum(["preview", "move"]),
        source: z.enum(["questions", "legacy-questions", "legacy-notes"]).default("questions"),
        confirmation: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { assertAdmin } = await import("./learning.server");
    await assertAdmin(context);
    if (data.action === "move" && data.confirmation !== "MOVE CONTENT TO STORAGE")
      throw new Error("Separate migration confirmation required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { flushProjectContentCaches } = await import("./project-content.server");
    const { createHash } = await import("node:crypto");
    const md5 = (text: string) => createHash("md5").update(text).digest("hex");
    let moved = 0,
      skipped = 0;
    const errors: string[] = [];
    if (data.action === "move") {
      if (data.source === "legacy-notes") {
        const rows = await supabaseAdmin
          .from("materials")
          .select("*")
          .is("body_storage_path", null)
          .neq("description", "")
          .order("id")
          .limit(5);
        if (rows.error) throw new Error(rows.error.message);
        const { storeNoteBody } = await import("./note-body.server");
        for (const row of rows.data || [])
          try {
            const ref = await storeNoteBody(row.id, row.description || "");
            const result = await supabaseAdmin.rpc("move_legacy_note_body", {
              p_actor: context.userId,
              p_id: row.id,
              p_updated: row.updated_at || null,
              p_source_md5: md5(row.description || ""),
              p_path: ref.body_storage_path!,
              p_sha256: ref.body_storage_sha256!,
              p_bytes: ref.body_storage_bytes!,
            });
            if (result.error) throw new Error(result.error.message);
            if (result.data) moved++;
            else skipped++;
          } catch (error) {
            errors.push(`${row.title}: ${error instanceof Error ? error.message : String(error)}`);
          }
      } else {
        const rows = await supabaseAdmin
          .from(data.source === "questions" ? "kkcc_test_questions" : "test_questions")
          .select("*")
          .is("body_storage_path", null)
          .order("test_id")
          .order("id")
          .limit(100);
        if (rows.error) throw new Error(rows.error.message);
        if (rows.data?.length) {
          const { storeTestQuestions } = await import("./test-body.server");
          // All original rows remain intact if upload/read-back fails.
          const prepared = await storeTestQuestions(rows.data);
          for (let start = 0; start < prepared.length; start += 8)
            await Promise.all(
              prepared.slice(start, start + 8).map(async (ref, offset) => {
                const old = rows.data[start + offset]!;
                try {
                  const result = await supabaseAdmin.rpc("move_test_question_body", {
                    p_actor: context.userId,
                    p_id: old.id,
                    p_updated: old.updated_at || null,
                    p_text_md5: md5(old.question_text),
                    p_options_md5: md5(JSON.stringify(old.options)),
                    p_explanation_md5: md5(old.explanation || ""),
                    p_path: ref.body_storage_path!,
                    p_sha256: ref.body_storage_sha256!,
                    p_bytes: ref.body_storage_bytes!,
                    p_legacy: data.source === "legacy-questions",
                  });
                  if (result.error) throw new Error(result.error.message);
                  if (result.data) moved++;
                  else skipped++;
                } catch (error) {
                  errors.push(
                    `${old.id}: ${error instanceof Error ? error.message : String(error)}`,
                  );
                }
              }),
            );
        }
      }
      flushProjectContentCaches();
    }
    const report = await supabaseAdmin.rpc("test_body_storage_status", { p_actor: context.userId });
    if (report.error)
      throw new Error(
        `${report.error.message}. Install KKCC-Excellence-Hub-TEST-BODIES.sql first.`,
      );
    const counts = report.data?.find((row) => row.source === data.source) || {
      inline_count: 0,
      inline_bytes: 0,
      stored_count: 0,
    };
    return { moved, skipped, errors, ...counts };
  });
