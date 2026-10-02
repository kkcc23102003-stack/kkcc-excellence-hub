import assert from "node:assert/strict";
import { createSandboxSupabaseClient } from "../src/integrations/supabase/sandbox-database.ts";
import { SANDBOX_ADMIN_ID } from "../src/integrations/supabase/sandbox.ts";

const supabase = createSandboxSupabaseClient();
const adminRole = await supabase.rpc("has_role", {
  _user_id: SANDBOX_ADMIN_ID,
  _role: "admin",
});
const otherUserRole = await supabase.rpc("has_role", {
  _user_id: "00000000-0000-4000-8000-000000000002",
  _role: "admin",
});
const read = await supabase.from("courses").select("*");

assert.equal(adminRole.data, true, "the local sandbox user should be recognized as admin");
assert.equal(otherUserRole.data, false, "the sandbox must not grant admin to another user ID");
assert.equal(read.error, null, "sandbox reads should be available without Supabase");
assert.deepEqual(read.data, [], "sandbox data should remain isolated and empty");

const mutations = [
  supabase.from("courses").insert({ title: "read-only probe" }),
  supabase.from("courses").upsert({ title: "read-only probe" }),
  supabase.from("courses").update({ title: "read-only probe" }).eq("id", "probe"),
  supabase.from("courses").delete().eq("id", "probe"),
];
for (const mutation of mutations) {
  const result = await mutation;
  assert.equal(result.error?.code, "SANDBOX_READ_ONLY", "sandbox writes must always be rejected");
}

const functionResult = await supabase.functions.invoke("ai-question-research");
assert.equal(
  functionResult.error?.code,
  "SANDBOX_READ_ONLY",
  "server-function proxies must not escape the read-only sandbox",
);

console.log("Supabase-independent sandbox admin and read-only write gates: PASS");
