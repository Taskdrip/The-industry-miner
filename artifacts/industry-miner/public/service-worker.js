const SHELL_CACHE = "industry-miner-shell-v1";
const PUBLIC_SITE_CACHE = "industry-miner-public-sites-v1";
const SHELL_FILES = ["/", "/favicon.svg", "/pwa-icon-192.png", "/pwa-icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_FILES).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("industry-miner-") && ![SHELL_CACHE, PUBLIC_SITE_CACHE].includes(key))
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "CACHE_SITE_DATA" || !/^[a-z0-9-]{1,100}$/.test(data.slug ?? "")) return;
  event.waitUntil(
    caches.open(PUBLIC_SITE_CACHE).then(async (cache) => {
      const publishedUrl = new URL(`/api/published-websites/${data.slug}`, self.location.origin);
      const manifestUrl = new URL(`/api/website-manifests/${data.slug}`, self.location.origin);
      await cache.put(publishedUrl, new Response(JSON.stringify(data.published), {
        headers: { "Content-Type": "application/json" },
      }));
      await cache.put(manifestUrl, new Response(JSON.stringify(data.manifest), {
        headers: { "Content-Type": "application/manifest+json" },
      }));
    }),
  );
});

async function networkFirst(request, cacheName, fallbackRequest) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackRequest) {
      const fallback = await caches.match(fallbackRequest);
      if (fallback) return fallback;
    }
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (/^\/api\/published-websites\/[a-z0-9-]+$/.test(url.pathname)
    || /^\/api\/website-manifests\/[a-z0-9-]+$/.test(url.pathname)) {
    event.respondWith(networkFirst(request, PUBLIC_SITE_CACHE));
    return;
  }

  if (request.mode === "navigate" && /^\/sites\/[a-z0-9-]+(?:\/[a-z0-9-]+)?\/?$/.test(url.pathname)) {
    event.respondWith(networkFirst(request, SHELL_CACHE, "/"));
    return;
  }

  if (["script", "style", "image", "font"].includes(request.destination)) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
  }
});
