import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const failures = [];

function collectFiles(dir = ROOT, parts = []) {
  const output = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      [
        ".git",
        ".output",
        ".turbo",
        "build",
        "coverage",
        "dist",
        "node_modules",
        "test-results",
        "playwright-report",
        "private-attempt-papers",
        ".tanstack",
        ".vercel",
        ".cache",
      ].includes(entry.name)
    ) {
      continue;
    }
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...collectFiles(absolute, parts));
      continue;
    }
    const relative = path.relative(ROOT, absolute).split(path.sep).join("/");
    if (
      /\.runtime\.json(?:[.]|$)/.test(relative) ||
      relative.startsWith("data/owner-export.private")
    )
      continue;
    output.push(relative);
  }
  return output;
}

function trackedFiles() {
  try {
    const output = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" });
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return collectFiles();
  }
}

// Inspect the actual delivery, including untracked edits/new routes; a parent Git repo can report zero files.
const files = collectFiles();
const uniqueFiles = new Set(files);
if (uniqueFiles.size !== files.length) {
  failures.push("Duplicate tracked source paths found.");
}

const forbiddenPatterns = [
  [/(^|\/)__MACOSX\//, "macOS archive metadata"],
  [/(^|\/)\.DS_Store$/, "macOS .DS_Store file"],
  [/(^|\/)thumbs\.db$/i, "Windows thumbnail cache"],
  [/(^|\/)- Copy\./i, "OS duplicate-copy file"],
  [/(^|\/)\.(env|env\..*)$/i, "environment secret file"],
  [/\.(pem|key|p12|pfx)$/i, "private key/certificate material"],
  [/\.(exe|dll|apk|aab)$/i, "compiled binary artifact"],
  [/\.(log|trace)$/i, "runtime log artifact"],
  [/(^|\/)playwright-report\//i, "Playwright report artifact"],
  [/(^|\/)test-results\//i, "test output artifact"],
];

for (const file of files) {
  // `.env.example` is safe documentation and contains only publishable values.
  if (path.basename(file) === ".env.example") continue;
  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(file)) failures.push(`${label}: ${file}`);
  }
}



const publicDownloadSql = files.filter(
  (file) => file.startsWith("public/downloads/") && /\.sql$/i.test(file),
);
if (publicDownloadSql.length > 0) {
  failures.push(
    `Legacy Supabase SQL must not be publicly downloadable: ${publicDownloadSql.join(", ")}`,
  );
}

const lockfiles = files.filter((file) =>
  ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"].includes(
    path.basename(file),
  ),
);
if (lockfiles.length > 1) {
  failures.push(`More than one package-manager lockfile: ${lockfiles.join(", ")}`);
}

const trackedArchives = files.filter((file) => /\.(zip|tar|tar\.gz|tgz)$/i.test(file));
if (trackedArchives.length > 0) {
  failures.push(`Generated archives must not be tracked: ${trackedArchives.join(", ")}`);
}

const duplicateShortNames = new Map();
for (const file of files) {
  if (!file.startsWith("src/") && !file.startsWith("supabase/")) continue;
  const name = path.basename(file).toLowerCase();
  duplicateShortNames.set(name, [...(duplicateShortNames.get(name) ?? []), file]);
}
const accidentalDuplicates = [...duplicateShortNames.entries()].filter(
  ([name, paths]) =>
    !["index.ts", "index.tsx", ".gitkeep", "privacy-policy.txt", "config.toml"].includes(name) &&
    paths.length > 1,
);
for (const [name, paths] of accidentalDuplicates) {
  failures.push(`Possible accidental duplicate source names (${name}): ${paths.join(", ")}`);
}

const criticalDocs = [
  "supabase/STUDENT_ONLY_SCHEMA.sql",
  "supabase/migrations/20261001120000_student_only_learning_access.sql",
  "supabase/migrations/20260929150000_security_app_controls_and_health.sql",
  "public/manifest.webmanifest",
  "public/sw.js",
];
for (const file of criticalDocs) {
  if (!existsSync(path.join(ROOT, file))) failures.push(`Missing required app file: ${file}`);
}

if (failures.length > 0) {
  console.error("Repository quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Repository quality check passed (${files.length} source files inspected).`);
