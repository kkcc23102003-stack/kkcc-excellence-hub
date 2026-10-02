import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const failures = [];

function collectFiles(dir = ROOT) {
  const output = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      [".git", ".output", ".turbo", "build", "coverage", "dist", "node_modules"].includes(
        entry.name,
      )
    ) {
      continue;
    }
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...collectFiles(absolute));
      continue;
    }
    output.push(path.relative(ROOT, absolute).split(path.sep).join("/"));
  }
  return output;
}

function readZipEntries(archive) {
  const signature = 0x06054b50;
  const minimumOffset = Math.max(0, archive.length - 22 - 0xffff);
  let endRecord = -1;
  for (let offset = archive.length - 22; offset >= minimumOffset; offset -= 1) {
    if (archive.readUInt32LE(offset) === signature) {
      endRecord = offset;
      break;
    }
  }
  if (endRecord < 0) throw new Error("ZIP end-of-central-directory record is missing.");

  const entryCount = archive.readUInt16LE(endRecord + 10);
  let offset = archive.readUInt32LE(endRecord + 16);
  const entries = [];
  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Invalid ZIP central-directory entry at offset ${offset}.`);
    }
    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const nameStart = offset + 46;
    entries.push(archive.toString("utf8", nameStart, nameStart + nameLength));
    offset = nameStart + nameLength + extraLength + commentLength;
  }
  return entries;
}

// Inspect the working tree, not only git-index entries: Arena and ordinary local
// development often contain meaningful untracked files before a first commit.
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

const lockfiles = files.filter((file) =>
  ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"].includes(
    path.basename(file),
  ),
);
if (lockfiles.length > 1) {
  failures.push(`More than one package-manager lockfile: ${lockfiles.join(", ")}`);
}

const deliveredSourceZip = "public/downloads/kkcc-excellence-hub.zip";
const checksumFile = `${deliveredSourceZip}.sha256`;
const sourceArchiveAlias = "kkcc-excellence-hub-series-final-fix.zip";
const allowedArchives = new Set([deliveredSourceZip, sourceArchiveAlias]);
const unexpectedArchives = files.filter(
  (file) => /\.(zip|tar|tar\.gz|tgz)$/i.test(file) && !allowedArchives.has(file),
);
if (unexpectedArchives.length > 0) {
  failures.push(`Unexpected generated archives: ${unexpectedArchives.join(", ")}`);
}

const legacySqlFiles = files.filter(
  (file) => file.toLowerCase().endsWith(".sql") && !file.startsWith("supabase/migrations/"),
);
if (legacySqlFiles.length > 0) {
  failures.push(
    `Manual/legacy SQL must stay out of the source and public downloads: ${legacySqlFiles.join(", ")}`,
  );
}

const publicSqlFiles = files.filter(
  (file) => file.startsWith("public/") && file.toLowerCase().endsWith(".sql"),
);
if (publicSqlFiles.length > 0) {
  failures.push(
    `Educational SQL must not be published as a static download: ${publicSqlFiles.join(", ")}`,
  );
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
  "supabase/migrations/20260929150000_security_app_controls_and_health.sql",
  "supabase/migrations/20260930103000_secure_course_media_and_upload_limit.sql",
  "supabase/migrations/20260930110000_mask_private_material_urls.sql",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/downloads/index.html",
  deliveredSourceZip,
  checksumFile,
];
for (const file of criticalDocs) {
  if (!existsSync(path.join(ROOT, file)))
    failures.push(`Missing required app/release file: ${file}`);
}

const staticDownloads = readFileSync(path.join(ROOT, "public/downloads/index.html"), "utf8");
const appDownloads = readFileSync(path.join(ROOT, "src/routes/downloads.tsx"), "utf8");
if (
  /href=["'][^"']+\.sql/i.test(staticDownloads) ||
  /href:\s*["'][^"']+\.sql/i.test(appDownloads)
) {
  failures.push("Public download pages must not advertise SQL reset/setup files.");
}
if (!/href=["'](?:\.\/)?kkcc-excellence-hub\.zip["']/i.test(staticDownloads)) {
  failures.push("The static public download page must link to the repaired source ZIP.");
}
if (!/href:\s*["']\/downloads\/kkcc-excellence-hub\.zip["']/.test(appDownloads)) {
  failures.push("The app downloads route must link to the repaired source ZIP.");
}
if (
  !staticDownloads.includes("kkcc-excellence-hub.zip.sha256") ||
  !appDownloads.includes("kkcc-excellence-hub.zip.sha256")
) {
  failures.push("Both public download surfaces must identify the release SHA-256 sidecar.");
}

const publicDownloadFiles = files.filter((file) => file.startsWith("public/downloads/")).sort();
const expectedPublicDownloads = [
  "public/downloads/index.html",
  checksumFile,
  deliveredSourceZip,
].sort();
if (
  publicDownloadFiles.length !== expectedPublicDownloads.length ||
  publicDownloadFiles.some((file, index) => file !== expectedPublicDownloads[index])
) {
  failures.push(
    `Public downloads must cover only the landing page, repaired ZIP, and checksum; found: ${publicDownloadFiles.join(", ")}`,
  );
}

if (existsSync(path.join(ROOT, deliveredSourceZip))) {
  try {
    const zipBytes = readFileSync(path.join(ROOT, deliveredSourceZip));
    const actualHash = createHash("sha256").update(zipBytes).digest("hex");
    const checksumText = readFileSync(path.join(ROOT, checksumFile), "utf8").trim();
    const checksumMatch = checksumText.match(/^([a-f\d]{64})\s+\*?kkcc-excellence-hub\.zip$/i);
    if (!checksumMatch || checksumMatch[1]?.toLowerCase() !== actualHash) {
      failures.push("The delivered source ZIP SHA-256 does not match its checksum sidecar.");
    }

    const archiveEntries = readZipEntries(zipBytes);
    const requiredArchiveEntries = [
      "package.json",
      "src/lib/exam-bank/core.ts",
      "supabase/migrations/20260930110000_mask_private_material_urls.sql",
    ];
    for (const entry of requiredArchiveEntries) {
      if (!archiveEntries.includes(entry)) failures.push(`Source ZIP is missing ${entry}.`);
    }
    for (const entry of archiveEntries) {
      if (
        /(^|\/)(node_modules|\.git|dist|build)\//.test(entry) ||
        (/(^|\/)\.env(?:\..*)?$/.test(entry) && entry !== ".env.example") ||
        /(^|\/)kkcc-excellence-hub\.zip(?:\.sha256)?$/.test(entry)
      ) {
        failures.push(`Source ZIP contains a generated or secret artifact: ${entry}`);
      }
      if (entry.toLowerCase().endsWith(".sql") && !entry.startsWith("supabase/migrations/")) {
        failures.push(`Source ZIP contains standalone/legacy SQL: ${entry}`);
      }
    }

    const aliasPath = path.join(ROOT, sourceArchiveAlias);
    if (existsSync(aliasPath) && !zipBytes.equals(readFileSync(aliasPath))) {
      failures.push("The repository source archive alias must match the public repaired ZIP.");
    }
  } catch (error) {
    failures.push(`Could not verify the public source ZIP: ${String(error)}`);
  }
}

if (failures.length > 0) {
  console.error("Repository quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Repository quality check passed (${files.length} source/release files inspected; public ZIP and SHA-256 verified).`,
);
