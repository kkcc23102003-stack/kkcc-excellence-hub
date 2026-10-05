import { copyFileSync, readFileSync } from "node:fs";
const files = [
  "PRODUCTION-SQL",
  "SQL-CLEANER",
  "NOTES-SUPABASE",
  "SPACE-SAVER",
  "EASY-TESTS",
  "PUBLISH-FIX",
  "TEST-FOLDERS",
].map((name) => `KKCC-Excellence-Hub-${name}.sql`);
for (const name of files) {
  if (process.argv.includes("--check")) {
    if (!readFileSync(name).equals(readFileSync(`public/${name}`)))
      throw new Error(`Stale public SQL: ${name}. Run node scripts/sync-release-sql.mjs`);
  } else copyFileSync(name, `public/${name}`);
}
console.log(
  `Release SQL ${process.argv.includes("--check") ? "verified" : "synced"}: ${files.length} files`,
);
