#!/usr/bin/env node
/**
 * Sitemap generator.
 *
 * Writes `public/sitemap.xml` so Google can index the public pages. The site
 * origin must come from the environment, because a sitemap with a guessed
 * domain is worse than no sitemap at all:
 *
 *   SITE_URL="https://your-real-domain.com" npm run sitemap
 *
 * Course / test-series URLs are read from the content document when it exists
 * locally, so a rebuild after adding a batch also publishes its URL. Nothing is
 * written and no file is overwritten when SITE_URL is missing.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || "")
  .trim()
  .replace(/\/+$/, "");

/** Pages that exist for everyone, with a sensible crawl priority. */
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/courses", priority: "0.9", changefreq: "daily" },
  { path: "/test-series", priority: "0.9", changefreq: "daily" },
  { path: "/study-material", priority: "0.8", changefreq: "weekly" },
  { path: "/games", priority: "0.7", changefreq: "weekly" },
  { path: "/classes", priority: "0.7", changefreq: "weekly" },
  { path: "/coins", priority: "0.6", changefreq: "monthly" },
  { path: "/faculty", priority: "0.6", changefreq: "monthly" },
  { path: "/results", priority: "0.6", changefreq: "weekly" },
  { path: "/downloads", priority: "0.5", changefreq: "monthly" },
  { path: "/support", priority: "0.5", changefreq: "monthly" },
  { path: "/login", priority: "0.3", changefreq: "yearly" },
  { path: "/signup", priority: "0.4", changefreq: "yearly" },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function contentRoutes() {
  const candidates = ["data/project-content.json", "data/fixture-content.runtime.json"];
  const routes = [];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    try {
      const parsed = JSON.parse(await readFile(candidate, "utf8"));
      const tables = parsed?.tables ?? {};
      const courses = Array.isArray(tables.courses) ? tables.courses : [];
      for (const course of courses) {
        if (!course?.slug || course.status === "draft") continue;
        routes.push({
          path: `/courses/${encodeURIComponent(course.slug)}`,
          priority: "0.8",
          changefreq: "weekly",
          lastmod: course.updated_at ?? course.created_at,
        });
      }
    } catch (error) {
      console.warn(
        `[sitemap] could not read ${candidate}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return routes;
}

async function main() {
  if (!SITE_URL) {
    console.log(
      "[sitemap] SITE_URL is not set, so no sitemap was written.\n" +
        "          Run it once you know your live address:\n" +
        '            SITE_URL="https://your-domain.com" npm run sitemap',
    );
    return;
  }

  const routes = [...STATIC_ROUTES, ...(await contentRoutes())];
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((route) =>
      [
        "  <url>",
        `    <loc>${escapeXml(`${SITE_URL}${route.path}`)}</loc>`,
        `    <lastmod>${(route.lastmod ?? today).slice(0, 10)}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile("public/sitemap.xml", xml, "utf8");
  console.log(`[sitemap] wrote public/sitemap.xml with ${routes.length} URLs for ${SITE_URL}`);
}

main().catch((error) => {
  console.error("[sitemap] failed:", error);
  process.exitCode = 1;
});
