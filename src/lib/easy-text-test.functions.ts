import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { easyTestSchema } from "./easy-text-test";
import { projectContent, invalidateProjectContentCache } from "./project-content.server";
export const publishEasyTextTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => easyTestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const sourceIds = [...new Set(data.assembly_source_ids)];
    for (let offset = 0; offset < sourceIds.length; offset += 50) {
      const batch = sourceIds.slice(offset, offset + 50);
      const sources = await projectContent.from("tests").select("*").in("id", batch);
      if (sources.error) throw new Error(sources.error.message);
      if (
        sources.data.length !== batch.length ||
        sources.data.some(
          (test) =>
            (test.syllabus_subject || test.subject) !== data.subject ||
            (test.series_name || "") !== data.series_name,
        )
      )
        throw new Error(
          "Combined test must keep the selected source subject and series. Re-select folders if a source was changed or deleted.",
        );
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createHash, randomUUID } = await import("node:crypto");
    const { storeTestQuestions } = await import("./test-body.server");
    const hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
    const previous = await projectContent.from("tests").select("*").eq("id", data.id).maybeSingle();
    if (previous.error) throw new Error(previous.error.message);
    if (previous.data) {
      if (previous.data.easy_request_hash !== hash)
        throw new Error("Test already saved with different content. Open it in Advanced to edit.");
      return { id: data.id, count: data.questions.length, published: previous.data.is_published };
    }
    const rows = await storeTestQuestions(
      data.questions.map((q) => ({
        ...q,
        id: randomUUID(),
        test_id: data.id,
        option_count: q.options.length,
      })),
    );
    const result = await supabaseAdmin.rpc("publish_storage_text_test", {
      p_actor: context.userId,
      p_payload: { ...data, _request_hash: hash, questions: rows },
    });
    if (result.error)
      throw new Error(
        ["PGRST202", "42883", "42P01"].includes(result.error.code)
          ? "Publish setup pending: run the latest KKCC-Excellence-Hub-TEST-BODIES.sql in Supabase SQL Editor and redeploy. No test was published; your preview is safe to retry. S3 is not required."
          : result.error.message,
      );
    invalidateProjectContentCache("tests");
    invalidateProjectContentCache("test_questions");
    return { id: data.id, count: data.questions.length, published: data.publish };
  });
