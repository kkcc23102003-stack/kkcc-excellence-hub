/** Owner-operated import. Does NOT write educational data to Supabase. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import {
  projectContent,
  PROJECT_TABLES,
  readProjectDocument,
  privateSettingForImport,
} from "../src/lib/project-content.server";

const input = process.argv[2];
if (!input)
  throw new Error("Usage: npm run content:import -- /private/path/export.json [--allow-update]");
const path = resolve(input);
if (path.includes("/public/"))
  throw new Error("Do not store an educational/private export under public/.");
const text = readFileSync(path, "utf8");
const document = z
  .object({ version: z.number().optional(), tables: z.record(z.array(z.record(z.unknown()))) })
  .parse(JSON.parse(text));
const current = (await readProjectDocument()).document;
const updates = process.argv.includes("--allow-update");
const counts: Record<string, number> = {};
for (const [table, rows] of Object.entries(document.tables)) {
  if (!PROJECT_TABLES.includes(table as (typeof PROJECT_TABLES)[number]))
    throw new Error(
      `Unsupported import table ${table}; student/user/auth tables must stay in Supabase.`,
    );
  const key = table.endsWith("settings")
    ? "key"
    : table === "test_series_overrides"
      ? "series_id"
      : "id";
  const seen = new Set<string>();
  for (const row of rows) {
    const value = z.string().min(1).parse(row[key]);
    if (seen.has(value)) throw new Error(`Duplicate ${table} ${key}: ${value}`);
    seen.add(value);
    if (["courses", "tests", "lectures", "materials"].includes(table))
      z.string().uuid().parse(row["id"]);
    if (table === "test_questions") {
      const options = z.array(z.string().min(1)).min(2).max(6).parse(row["options"]);
      const correct = z.number().int().min(0).parse(row["correct_index"]);
      if (correct >= options.length)
        throw new Error(
          `Invalid answer index for question ${value}; original ID/content was not deleted.`,
        );
      z.string().min(1).parse(row["question_text"]);
      z.number().finite().min(0).parse(row["marks"]);
      // Preserve existing real PYQ exam/year/source metadata; an unlabelled legacy row is not asserted official.
      if (!row["provenance"]) row["provenance"] = "legacy-unverified";
    }
    const prior = current.tables[table]?.find((old) => old[key] === value);
    if (prior && !updates && JSON.stringify(prior) !== JSON.stringify(row))
      throw new Error(
        `Existing ${table} ${value} differs. Review the export and rerun with --allow-update; no IDs will be regenerated.`,
      );
    if (table === "private_settings")
      row["value"] = privateSettingForImport(String(row["value"] || ""));
  }
  counts[table] = rows.length;
}
for (const [table, rows] of Object.entries(document.tables)) {
  const key = table.endsWith("settings")
    ? "key"
    : table === "test_series_overrides"
      ? "series_id"
      : "id";
  const result = await projectContent
    .from(table as (typeof PROJECT_TABLES)[number])
    .upsert(rows as never, { onConflict: key });
  if (result.error)
    throw new Error(
      `Import stopped at ${table}: ${result.error.message}. Existing rows/IDs are retained; correct the issue and resume.`,
    );
}
console.log(
  JSON.stringify(
    {
      imported: true,
      counts,
      source_sha256: createHash("sha256").update(text).digest("hex"),
      note: "No student/auth rows or educational content were written to Supabase. Verify asset copies and every legacy ID before acknowledging cutover.",
    },
    null,
    2,
  ),
);
