const CACHE_PREFIX = "kkcc-excellence-hub";
const APP_CACHE = `${CACHE_PREFIX}-app-v8-student-private-no-store`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-v8-student-private-no-store`;
const CACHE_LIMITS = {
  [APP_CACHE]: 24,
  [ASSET_CACHE]: 96,
};
const APP_SHELL = [
  "/",
  "/offline.html",
  "/logo.png",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];
const PRIVATE_NAV_PREFIXES = [
  "/admin",
  "/dashboard",
  "/learn",
  "/checkout",
  "/test",
  "/tests",
  "/test-series/learn",
  "/coins",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/api",
  "/__fixture__",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter(
                (key) => key.startsWith(CACHE_PREFIX) && ![APP_CACHE, ASSET_CACHE].includes(key),
              )
              .map((key) => caches.delete(key)),
          ),
        ),
      self.registration.navigationPreload?.enable?.().catch(() => undefined),
    ]).then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

function canCache(response) {
  return (
    response &&
    response.ok &&
    !/no-store|private/i.test(response.headers.get("cache-control") || "") &&
    (response.type === "basic" || response.type === "default")
  );
}

async function trimCache(cacheName) {
  const limit = CACHE_LIMITS[cacheName];
  if (!limit) return;
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    await Promise.all(
      keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)),
    );
  } catch {
    // Ignore quota/cache cleanup errors.
  }
}

async function putInCache(cacheName, request, response) {
  if (!canCache(response)) return response;
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    trimCache(cacheName);
  } catch {
    // Ignore quota/cache write errors; the network response is still returned.
  }
  return response;
}

function isHashedAsset(url) {
  return url.pathname.startsWith("/assets/");
}

function isStaticAsset(url) {
  if (url.pathname === "/sw.js") return false;
  return (
    isHashedAsset(url) ||
    /\.(?:css|js|png|jpg|jpeg|webp|gif|svg|ico|woff2?|json|webmanifest)$/i.test(url.pathname)
  );
}

function isPrivateNavigation(url) {
  if (
    url.searchParams.has("attempt") ||
    url.searchParams.has("token") ||
    url.pathname === "/secure-video.html"
  )
    return true;
  return PRIVATE_NAV_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`),
  );
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  putInCache(cacheName, request, response);
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => putInCache(cacheName, request, response))
    .catch(() => cached);
  return cached || network;
}

async function networkFirst(request, cacheName, fallbackPath = "/offline.html", preloadResponse) {
  try {
    const response = (await preloadResponse) || (await fetch(request));
    putInCache(cacheName, request, response);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match(fallbackPath) || caches.match("/");
  }
}

async function networkOnly(request, preloadResponse) {
  try {
    return (await preloadResponse) || (await fetch(request));
  } catch {
    return caches.match("/offline.html");
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_server") || url.pathname.startsWith("/__server")) return;
  if (
    url.pathname.startsWith("/downloads/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/__fixture__/")
  )
    return;
  if (
    request.mode !== "navigate" &&
    (request.headers.has("authorization") ||
      url.searchParams.has("token") ||
      url.searchParams.has("attempt") ||
      url.pathname === "/secure-video.html")
  )
    return;

  if (request.mode === "navigate") {
    if (isPrivateNavigation(url)) {
      // Logged-in/admin/learn/test pages may contain private content. Keep them
      // network-only so they are not stored in this device cache.
      event.respondWith(networkOnly(request, event.preloadResponse));
      return;
    }

    event.respondWith(networkFirst(request, APP_CACHE, "/offline.html", event.preloadResponse));
    return;
  }

  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});
