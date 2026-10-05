import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
const schema = z.object({
  database_bytes: z.number().nonnegative(),
  checked_at: z.string(),
  buckets: z.array(
    z.object({
      bucket: z.string(),
      files: z.number().nonnegative(),
      bytes: z.number().nonnegative(),
      unknown_sizes: z.number().nonnegative(),
    }),
  ),
});
export type StorageUsage = z.infer<typeof schema>;
export const checkStorageUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StorageUsage> => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const result = await context.supabase.rpc("kkcc_storage_usage");
    if (result.error)
      throw new Error(
        ["PGRST202", "42883"].includes(result.error.code)
          ? "Run KKCC-Excellence-Hub-STORAGE-USAGE.sql in Supabase SQL Editor, then retry."
          : result.error.message,
      );
    return schema.parse(result.data);
  });
