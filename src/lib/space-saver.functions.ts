import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.discriminatedUnion("cleanup", [
  z.object({ cleanup: z.literal(false) }),
  z.object({
    cleanup: z.literal(true),
    cutoff: z.string().datetime({ offset: true }),
    confirmation: z.literal("CLEAN OLD DRAFTS"),
  }),
]);
const reportSchema = z.object({
  database_bytes: z.number().nonnegative(),
  tables: z.array(z.object({ name: z.string(), bytes: z.number().nonnegative() })),
  cutoff: z.string(),
  eligible_batch: z.number().int().nonnegative(),
  deleted: z.number().int().nonnegative(),
  batch_limit: z.number().int(),
  preview: z.boolean(),
});
export type SpaceReport = z.infer<typeof reportSchema>;
export const inspectDatabaseSpace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ context, data }): Promise<SpaceReport> => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const result = await context.supabase.rpc("kkcc_space_report", {
      p_cleanup: data.cleanup,
      ...(data.cleanup ? { p_before: data.cutoff } : {}),
    });
    if (result.error) {
      if (["PGRST202", "42883"].includes(result.error.code))
        throw new Error(
          "Setup required: run KKCC-Excellence-Hub-SPACE-SAVER.sql in Supabase SQL Editor, then retry. Installation deletes nothing.",
        );
      throw new Error(result.error.message);
    }
    return reportSchema.parse(result.data);
  });
