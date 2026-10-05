import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { easyTestSchema } from "./easy-text-test";
import { invalidateProjectContentCache } from "./project-content.server";
export const publishEasyTextTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => easyTestSchema.parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = await supabaseAdmin.rpc("publish_easy_text_test", {
      p_actor: context.userId,
      p_payload: data,
    });
    if (result.error)
      throw new Error(
        ["PGRST202", "42883", "42P01"].includes(result.error.code)
          ? "One-time setup: run KKCC-Excellence-Hub-EASY-TESTS.sql in Supabase SQL Editor and redeploy."
          : result.error.message,
      );
    invalidateProjectContentCache("tests");
    invalidateProjectContentCache("test_questions");
    return { id: data.id, count: data.questions.length };
  });
