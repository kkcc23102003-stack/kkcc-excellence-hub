import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";
import { createGzip, gzipSync } from "node:zlib";

const mime = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};
const compressibleExt = new Set([".js", ".css", ".html", ".json", ".svg", ".webmanifest"]);
const staticAssetCache = new Map();

/** Serves the REAL production build. Optional relative-URL fixture proxy is server-side only. */
export function createProductionServer(entry, options = {}) {
  const root = resolve("dist/client");
  const server = createServer(async (incoming, outgoing) => {
    try {
      const protocol = incoming.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const host = incoming.headers.host || "localhost";
      const origin = process.env.KKCC_PUBLIC_ORIGIN || `${protocol}://${host}`;
      const url = new URL(incoming.url || "/", origin);
      const acceptEncoding = String(incoming.headers["accept-encoding"] || "");
      const supportsGzip = /\bgzip\b/i.test(acceptEncoding);
      const headers = new Headers();
      for (const [key, value] of Object.entries(incoming.headers))
        if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(",") : value);
      let body;
      if (!["GET", "HEAD"].includes(incoming.method || "GET")) {
        const chunks = [];
        let size = 0;
        for await (const chunk of incoming) {
          size += chunk.length;
          if (size > 8 * 1024 * 1024) {
            outgoing.writeHead(413);
            outgoing.end("Request too large");
            return;
          }
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }
      if (options.proxy && url.pathname.startsWith(options.proxy.prefix)) {
        const target = `${options.proxy.target}${url.pathname.slice(options.proxy.prefix.length)}${url.search}`;
        headers.delete("host");
        for (const key of [
          "connection",
          "upgrade",
          "proxy-connection",
          "transfer-encoding",
          "keep-alive",
          "te",
          "trailer",
        ])
          headers.delete(key);
        const response = await fetch(target, {
          method: incoming.method,
          headers,
          ...(body ? { body } : {}),
          redirect: "manual",
        });
        response.headers.forEach((value, key) => outgoing.setHeader(key, value));
        outgoing.setHeader("cache-control", "private,no-store");
        outgoing.writeHead(response.status);
        if (response.body && incoming.method !== "HEAD")
          Readable.fromWeb(response.body).pipe(outgoing);
        else outgoing.end();
        return;
      }
      if (url.pathname === "/__fixture__/supabase/zip") {
        const zipFile = resolve("full fledge kkcc excellence hub.zip");
        const details = await stat(zipFile).catch(() => null);
        if (details?.isFile()) {
          const zipBytes = await readFile(zipFile);
          outgoing.writeHead(200, {
            "content-type": "application/zip",
            "content-disposition": 'attachment; filename="full fledge kkcc excellence hub.zip"',
            "content-length": String(zipBytes.byteLength),
            "cache-control": "no-store",
          });
          outgoing.end(incoming.method === "HEAD" ? undefined : zipBytes);
          return;
        }
      }
      if (url.pathname === "/__fixture__/supabase/download/production.sql") {
        const sqlFile = resolve("KKCC-Excellence-Hub-PRODUCTION-SQL.sql");
        const details = await stat(sqlFile).catch(() => null);
        if (details?.isFile()) {
          const sqlBytes = await readFile(sqlFile);
          outgoing.writeHead(200, {
            "content-type": "text/sql; charset=utf-8",
            "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-PRODUCTION-SQL.sql"',
            "content-length": String(sqlBytes.byteLength),
            "cache-control": "no-store",
          });
          outgoing.end(incoming.method === "HEAD" ? undefined : sqlBytes);
          return;
        }
      }
      if (url.pathname === "/__fixture__/supabase/download/notes-supabase.sql") {
        const sqlFile = resolve("KKCC-Excellence-Hub-NOTES-SUPABASE.sql");
        const details = await stat(sqlFile).catch(() => null);
        if (details?.isFile()) {
          const sqlBytes = await readFile(sqlFile);
          outgoing.writeHead(200, {
            "content-type": "text/sql; charset=utf-8",
            "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-NOTES-SUPABASE.sql"',
            "content-length": String(sqlBytes.byteLength),
            "cache-control": "no-store",
          });
          outgoing.end(incoming.method === "HEAD" ? undefined : sqlBytes);
          return;
        }
      }
      if (url.pathname === "/__fixture__/supabase/download/space-saver.sql") {
        const sqlFile = resolve("KKCC-Excellence-Hub-SPACE-SAVER.sql");
        const details = await stat(sqlFile).catch(() => null);
        if (details?.isFile()) {
          const sqlBytes = await readFile(sqlFile);
          outgoing.writeHead(200, {
            "content-type": "text/sql; charset=utf-8",
            "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-SPACE-SAVER.sql"',
            "content-length": String(sqlBytes.byteLength),
            "cache-control": "no-store",
          });
          outgoing.end(incoming.method === "HEAD" ? undefined : sqlBytes);
          return;
        }
      }
      if (url.pathname === "/__fixture__/supabase/download/cleaner.sql") {
        const sqlFile = resolve("KKCC-Excellence-Hub-SQL-CLEANER.sql");
        const details = await stat(sqlFile).catch(() => null);
        if (details?.isFile()) {
          const sqlBytes = await readFile(sqlFile);
          outgoing.writeHead(200, {
            "content-type": "text/sql; charset=utf-8",
            "content-disposition": 'attachment; filename="KKCC-Excellence-Hub-SQL-CLEANER.sql"',
            "content-length": String(sqlBytes.byteLength),
            "cache-control": "no-store",
          });
          outgoing.end(incoming.method === "HEAD" ? undefined : sqlBytes);
          return;
        }
      }
      if (url.pathname === "/__fixture__/supabase/sql") {
        const cleanerSql = await readFile(
          resolve("KKCC-Excellence-Hub-SQL-CLEANER.sql"),
          "utf8",
        ).catch(() => "");
        const productionSql = await readFile(
          resolve("KKCC-Excellence-Hub-PRODUCTION-SQL.sql"),
          "utf8",
        ).catch(() => "");
        const payload = JSON.stringify({ cleanerSql, productionSql });
        outgoing.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        });
        outgoing.end(payload);
        return;
      }
      if (["GET", "HEAD"].includes(incoming.method || "GET")) {
        const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
        if (file.startsWith(`${root}${sep}`)) {
          const isImmutableAsset = url.pathname.startsWith("/assets/");
          let cached = staticAssetCache.get(file);
          if (!cached || !isImmutableAsset) {
            const details = await stat(file).catch(() => null);
            if (details?.isFile()) {
              if (!cached || cached.mtimeMs !== details.mtimeMs) {
                const raw = await readFile(file);
                const ext = extname(file);
                const gzipped =
                  compressibleExt.has(ext) && raw.byteLength > 512
                    ? gzipSync(raw, { level: 6 })
                    : null;
                cached = { mtimeMs: details.mtimeMs, raw, gzipped, ext };
                if (raw.byteLength <= 4 * 1024 * 1024) {
                  staticAssetCache.set(file, cached);
                }
              }
            } else {
              cached = null;
            }
          }
          if (cached) {
            outgoing.setHeader("content-type", mime[cached.ext] || "application/octet-stream");
            outgoing.setHeader("x-content-type-options", "nosniff");
            outgoing.setHeader(
              "cache-control",
              isImmutableAsset
                ? "public,max-age=31536000,immutable"
                : url.pathname === "/secure-video.html"
                  ? "private,no-store"
                  : "public,max-age=300",
            );
            const useGzip = Boolean(supportsGzip && cached.gzipped);
            const payload = useGzip ? cached.gzipped : cached.raw;
            if (cached.gzipped) outgoing.setHeader("vary", "Accept-Encoding");
            if (useGzip) outgoing.setHeader("content-encoding", "gzip");
            outgoing.setHeader("content-length", String(payload.byteLength));
            outgoing.writeHead(200);
            outgoing.end(incoming.method === "HEAD" ? undefined : payload);
            return;
          }
        }
      }
      const request = new Request(url, {
        method: incoming.method,
        headers,
        ...(body ? { body } : {}),
      });
      const response = await entry.fetch(request, {}, {});
      response.headers.forEach((value, key) => outgoing.setHeader(key, value));
      outgoing.setHeader("x-content-type-options", "nosniff");
      outgoing.setHeader("referrer-policy", "strict-origin-when-cross-origin");
      const contentType = String(response.headers.get("content-type") || "");
      const alreadyEncoded = response.headers.has("content-encoding");
      const shouldCompressSsr =
        supportsGzip &&
        !alreadyEncoded &&
        incoming.method !== "HEAD" &&
        Boolean(response.body) &&
        /^(text\/|application\/(json|javascript|manifest\+json))/i.test(contentType);
      if (shouldCompressSsr && response.body) {
        outgoing.removeHeader("content-length");
        outgoing.setHeader("content-encoding", "gzip");
        outgoing.setHeader("vary", "Accept-Encoding");
        outgoing.writeHead(response.status);
        Readable.fromWeb(response.body)
          .pipe(createGzip({ level: 5 }))
          .pipe(outgoing);
      } else {
        outgoing.writeHead(response.status);
        if (response.body && incoming.method !== "HEAD")
          Readable.fromWeb(response.body).pipe(outgoing);
        else outgoing.end();
      }
    } catch (error) {
      console.error("[app server]", error);
      if (!outgoing.headersSent)
        outgoing.writeHead(500, { "content-type": "text/plain", "cache-control": "no-store" });
      outgoing.end("Application request failed; check the server configuration.");
    }
  });
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;
  return server;
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const module = await import(pathToFileURL(resolve("dist/server/server.js")).href);
  const entry = module.default || module;
  const port = Number(process.env.PORT || 3000);
  createProductionServer(entry).listen(port, "0.0.0.0", () =>
    console.log(`KKCC production app listening on ${port}`),
  );
}
