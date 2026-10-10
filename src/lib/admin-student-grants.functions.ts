import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export type StudentGrant = {
  id: string;
  kind: "course" | "test" | "series";
  item_id: string;
  status: string;
  expires_at: string | null;
  method: string;
};
export const listStudentGrants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }): Promise<StudentGrant[]> => {
    const role = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (role.error || !role.data) throw new Error("Admin access required");
    const rows: StudentGrant[] = [];
    for (const table of [
      "course_enrollments",
      "test_access_grants",
      "series_access_grants",
    ] as const) {
      let offset = 0;
      for (;;) {
        const result = await context.supabase
          .from(table)
          .select("*")
          .eq("user_id", data.user_id)
          .order("id")
          .range(offset, offset + 499);
        if (result.error) throw new Error(result.error.message);
        if (!result.data?.length) break;
        for (const row of result.data) {
          const kind =
            table === "course_enrollments"
              ? "course"
              : table === "test_access_grants"
                ? "test"
                : "series";
          const item_id =
            "course_id" in row ? row.course_id : "test_id" in row ? row.test_id : row.series_id;
          const revoked = "revoked_at" in row ? Boolean(row.revoked_at) : row.status !== "active";
          const expired = Boolean(row.expires_at && Date.parse(row.expires_at) <= Date.now());
          rows.push({
            id: row.id,
            kind,
            item_id,
            status: revoked ? "Revoked" : expired ? "Expired" : "Active",
            expires_at: row.expires_at,
            method: "payment_method" in row ? row.payment_method : row.method,
          });
        }
        offset += result.data.length;
      }
    }
    return rows;
  });
