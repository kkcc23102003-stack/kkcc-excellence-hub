import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const manifestPath = path.join(publicDir, "manifest.webmanifest");
const swPath = path.join(publicDir, "sw.js");

function fail(message) {
  console.error(`PWA readiness failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

assert(fs.existsSync(manifestPath), "public/manifest.webmanifest is missing");
assert(fs.existsSync(swPath), "public/sw.js is missing");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
assert(manifest.name && manifest.short_name, "manifest needs name and short_name");
assert(manifest.start_url && manifest.scope, "manifest needs start_url and scope");
assert(
  ["standalone", "fullscreen", "minimal-ui"].includes(manifest.display),
  "manifest display must be installable",
);
assert(
  /^#[0-9a-f]{6}$/i.test(manifest.theme_color || ""),
  "manifest theme_color must be a hex color",
);
assert(
  /^#[0-9a-f]{6}$/i.test(manifest.background_color || ""),
  "manifest background_color must be a hex color",
);

const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
for (const size of ["192x192", "512x512"]) {
  const icon = icons.find((item) => String(item.sizes || "").includes(size));
  assert(icon, `manifest needs a ${size} icon`);
  assert(
    fs.existsSync(path.join(publicDir, icon.src.replace(/^\//, ""))),
    `${size} icon file is missing`,
  );
}

const sw = fs.readFileSync(swPath, "utf8");
for (const snippet of ["install", "activate", "fetch", "offline.html", "CACHE_PREFIX"]) {
  assert(sw.includes(snippet), `service worker should include ${snippet}`);
}

console.log("PWA readiness check passed");
