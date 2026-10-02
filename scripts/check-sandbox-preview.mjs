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
const seededTests = await supabase
  .from("tests")
  .select("*")
  .order("created_at", { ascending: false });
const seededSeriesAccess = await supabase
  .from("series_access_grants")
  .select("*")
  .eq("user_id", SANDBOX_ADMIN_ID)
  .is("revoked_at", null);
const seededSyllabus = await supabase
  .from("test_series_syllabi")
  .select("*")
  .eq("series_id", "ppsc-pcs")
  .maybeSingle();

assert.equal(adminRole.data, true, "the local sandbox user should be recognized as admin");
assert.equal(otherUserRole.data, false, "the sandbox must not grant admin to another user ID");
assert.equal(seededTests.error, null, "seeded test reads should work without Supabase");
assert.equal(seededTests.data.length, 2, "the sandbox should have editable seeded tests");
assert.equal(
  seededSeriesAccess.data.length,
  1,
  "the demo account should have one active series grant",
);
assert.equal(seededSyllabus.data?.status, "published", "a sample syllabus should be seeded");

const probeId = "sandbox-isolation-check";
const inserted = await supabase
  .from("test_series_overrides")
  .upsert({ series_id: probeId, enabled: true, name: "Sandbox check" }, { onConflict: "series_id" })
  .select("*")
  .single();
assert.equal(inserted.error, null, "local sandbox writes should succeed");
assert.equal(inserted.data?.name, "Sandbox check", "upsert should return the edited demo row");

const updated = await supabase
  .from("test_series_overrides")
  .update({ name: "Edited locally" })
  .eq("series_id", probeId)
  .select("*")
  .single();
assert.equal(updated.error, null, "local sandbox updates should succeed");
assert.equal(
  updated.data?.name,
  "Edited locally",
  "updates should persist within the sandbox server",
);

const deleted = await supabase.from("test_series_overrides").delete().eq("series_id", probeId);
assert.equal(deleted.error, null, "local sandbox deletes should succeed");
const afterDelete = await supabase
  .from("test_series_overrides")
  .select("*")
  .eq("series_id", probeId)
  .maybeSingle();
assert.equal(afterDelete.data, null, "local sandbox deletes should remove only local demo rows");

const functionResult = await supabase.functions.invoke("ai-question-research");
assert.equal(
  functionResult.error?.code,
  "SANDBOX_FUNCTION",
  "external Edge Functions must remain unavailable from the local sandbox",
);

console.log(
  "Supabase-independent editable sandbox, seeded admin data, and external-service isolation: PASS",
);
