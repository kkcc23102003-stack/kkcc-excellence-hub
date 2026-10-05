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
    if (data.assembly_source_ids.length) {
      const sources = await projectContent
        .from("tests")
        .select("*")
        .in("id", data.assembly_source_ids);
      if (sources.error) throw new Error(sources.error.message);
      if (
        sources.data.length !== new Set(data.assembly_source_ids).size ||
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
    const result = await supabaseAdmin.rpc("publish_easy_text_test_v3", {
      p_actor: context.userId,
      p_payload: data,
    });
    if (result.error)
      throw new Error(
        ["PGRST202", "42883", "42P01"].includes(result.error.code)
          ? "Publish setup pending: run the latest KKCC-Excellence-Hub-TEST-FOLDERS.sql in Supabase SQL Editor and redeploy. No test was published; your preview is safe to retry. S3 is not required."
          : result.error.message,
      );
    invalidateProjectContentCache("tests");
    invalidateProjectContentCache("test_questions");
    return { id: data.id, count: data.questions.length, published: data.publish };
  });
