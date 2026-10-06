import type { SupabaseClient } from "@supabase/supabase-js";
import type { DB } from "@/integrations/supabase/db";
import { retentionPolicySchema } from "./test-retention.functions";
export async function readTestRetention(db: SupabaseClient<DB>) {
  const result = await db.rpc("get_test_retention");
  if (result.error)
    throw new Error(
      ["PGRST202", "42883"].includes(result.error.code)
        ? "Test privacy setup required: ask Admin to run KKCC-Excellence-Hub-TEST-PRIVACY.sql. No new attempt was saved."
        : result.error.message,
    );
  return retentionPolicySchema.parse(result.data);
}
export async function requireSavedTestMode(db: SupabaseClient<DB>) {
  if (!(await readTestRetention(db)).save_results)
    throw new Error(
      "Test result saving is OFF. This saved attempt cannot record more data; start a new temporary test.",
    );
}
