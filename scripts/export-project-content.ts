/** Owner-only read export. No remote mutations. Never runs automatically. */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { encryptPrivateSettingForTransfer } from "../src/lib/project-content.server";

const url = process.env["SUPABASE_URL"],
  key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
if (!url || !key)
  throw new Error(
    "Set SUPABASE_URL and the server-only service key securely in the operator environment. Do not paste credentials into chat or commit them.",
  );
const path = resolve(process.argv[2] || "data/owner-export.private.json");
if (path.includes("/public/"))
  throw new Error("Never export private educational/config data under public/.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const tables = [
  "courses",
  "lectures",
  "materials",
  "tests",
  "test_questions",
  "test_series_overrides",
  "site_settings",
  "private_settings",
  "files",
  "ai_question_targets",
  "ai_question_candidates",
  "ai_question_runs",
];
const document: { version: number; tables: Record<string, Record<string, unknown>[]> } = {
  version: 1,
  tables: {},
};
const counts: Record<string, number> = {};
const absent: string[] = [];
for (const table of tables) {
  const rows: Record<string, unknown>[] = [];
  for (let offset = 0; ; offset += 1000) {
    const response = await client
      .from(table)
      .select("*")
      .range(offset, offset + 999);
    if (response.error) {
      if (response.error.code === "42P01" || response.error.code === "PGRST205") {
        absent.push(table);
        break;
      }
      throw new Error(
        `${table} export failed (${response.error.code}); check operator privileges. No credentials/row values were logged.`,
      );
    }
    rows.push(...(response.data as Record<string, unknown>[]));
    if (response.data.length < 1000) break;
  }
  if (table === "private_settings")
    for (const row of rows)
      row["value"] = encryptPrivateSettingForTransfer(String(row["value"] || ""));
  document.tables[table] = rows;
  counts[table] = rows.length;
}
mkdirSync(dirname(path), { recursive: true });
const text = JSON.stringify(document, null, 2);
writeFileSync(path, text, { mode: 0o600, flag: "wx" });
const manifest = {
  created_at: new Date().toISOString(),
  tables: counts,
  absent,
  sha256: createHash("sha256").update(text).digest("hex"),
  private_settings_encrypted: true,
  student_auth_exported: false,
  remote_writes: 0,
};
writeFileSync(`${path}.manifest.json`, JSON.stringify(manifest, null, 2), {
  mode: 0o600,
  flag: "wx",
});
console.log(JSON.stringify(manifest, null, 2));
