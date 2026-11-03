const CACHE_NAME = "akla-pwa-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/home",
  "/week",
  "/shopping",
  "/favorites",
  "/profile",
  "/manifest.json",
  "/icon.svg",
  "/favicon.svg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/maskable-icon-512x512.png",
  "/icons/apple-touch-icon.png",
  "/assets/logo-mark.png"
];

// Install: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("PWA pre-cache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first with Cache fallback for navigation, Cache-first for images/fonts
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Don't intercept non-GET requests or Firestore API requests
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin.includes("firestore.googleapis.com") || url.origin.includes("firebase") || url.origin.includes("identitytoolkit")) {
    return;
  }

  // Static images and fonts: Cache first
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".webp") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.googleapis.com")
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML Pages and JS bundles: Network first, fallback to cache
  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === "navigate") {
            return caches.match("/home") || caches.match("/");
          }
          return null;
        });
      })
  );
});

