import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const retentionPolicySchema = z.object({
  save_results: z.boolean(),
  epoch: z.string().uuid(),
});
const reportSchema = retentionPolicySchema.extend({
  cutoff: z.string(),
  deleted: z.number(),
  batch_limit: z.number(),
  history_count: z.number(),
  submitted_count: z.number(),
  eligible_count: z.number(),
});
export type RetentionReport = z.infer<typeof reportSchema>;
export const manageTestRetention = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .discriminatedUnion("action", [
        z.object({ action: z.literal("preview") }),
        z.object({ action: z.literal("set"), enabled: z.boolean() }),
        z.object({
          action: z.literal("cleanup"),
          before: z.string().datetime({ offset: true }),
          confirmation: z.literal("DELETE TEST HISTORY"),
        }),
      ])
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const result = await context.supabase.rpc("admin_test_retention", {
      p_action: data.action,
      ...(data.action === "set" ? { p_enabled: data.enabled } : {}),
      ...(data.action === "cleanup"
        ? { p_before: data.before, p_confirmation: data.confirmation }
        : {}),
    });
    if (result.error)
      throw new Error(
        ["PGRST202", "42883"].includes(result.error.code)
          ? "Run KKCC-Excellence-Hub-TEST-PRIVACY.sql in Supabase SQL Editor, then retry."
          : result.error.message,
      );
    return reportSchema.parse(result.data);
  });
