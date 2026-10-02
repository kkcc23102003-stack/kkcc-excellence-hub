import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const sandboxBearer = "kkcc-sandbox-preview-only";
const clientGuard = readFileSync("src/integrations/supabase/auth-attacher.ts", "utf8");
const serverGuard = readFileSync("src/integrations/supabase/auth-middleware.ts", "utf8");
assert.match(
  clientGuard,
  /import\.meta\.env\.DEV\s*&&\s*isSandboxAdminSession\(\)/,
  "sandbox authorization headers must be restricted to Vite development builds",
);
assert.match(
  serverGuard,
  /import\.meta\.env\.DEV\s*&&\s*isSandboxPreviewAvailable\(\)/,
  "the sandbox admin middleware must be restricted to Vite development builds",
);

const roots = ["dist/client", "dist/server"];
const bundles = [];
function collectJavaScript(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectJavaScript(absolute);
    else if (/\.(?:m?js|cjs)$/.test(entry.name)) bundles.push(absolute);
  }
}
for (const root of roots) {
  assert.ok(existsSync(root), `production build output is missing: ${root}`);
  collectJavaScript(root);
}
assert.ok(bundles.length > 0, "production build has no JavaScript bundles to inspect");
const leakedBundles = bundles.filter((file) => readFileSync(file, "utf8").includes(sandboxBearer));
assert.deepEqual(
  leakedBundles,
  [],
  "the development-only sandbox bearer must not be emitted into production client or server bundles",
);

console.log(`Production sandbox isolation gate: PASS (${bundles.length} bundles inspected).`);
