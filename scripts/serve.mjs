import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

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
/** Serves the REAL production build. Optional relative-URL fixture proxy is server-side only. */
export function createProductionServer(entry, options = {}) {
  const root = resolve("dist/client");
  return createServer(async (incoming, outgoing) => {
    try {
      const protocol = incoming.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const host = incoming.headers.host || "localhost";
      const origin = process.env.KKCC_PUBLIC_ORIGIN || `${protocol}://${host}`;
      const url = new URL(incoming.url || "/", origin);
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
      if (["GET", "HEAD"].includes(incoming.method || "GET")) {
        const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
        if (file.startsWith(`${root}${sep}`)) {
          const details = await stat(file).catch(() => null);
          if (details?.isFile()) {
            outgoing.setHeader("content-type", mime[extname(file)] || "application/octet-stream");
            outgoing.setHeader("x-content-type-options", "nosniff");
            outgoing.setHeader(
              "cache-control",
              url.pathname.startsWith("/assets/")
                ? "public,max-age=31536000,immutable"
                : url.pathname === "/secure-video.html"
                  ? "private,no-store"
                  : "public,max-age=300",
            );
            outgoing.writeHead(200);
            outgoing.end(incoming.method === "HEAD" ? undefined : await readFile(file));
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
      outgoing.writeHead(response.status);
      if (response.body && incoming.method !== "HEAD")
        Readable.fromWeb(response.body).pipe(outgoing);
      else outgoing.end();
    } catch (error) {
      console.error("[app server]", error);
      if (!outgoing.headersSent)
        outgoing.writeHead(500, { "content-type": "text/plain", "cache-control": "no-store" });
      outgoing.end("Application request failed; check the server configuration.");
    }
  });
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const module = await import(pathToFileURL(resolve("dist/server/server.js")).href);
  const entry = module.default || module;
  const port = Number(process.env.PORT || 3000);
  createProductionServer(entry).listen(port, "0.0.0.0", () =>
    console.log(`KKCC production app listening on ${port}`),
  );
}
