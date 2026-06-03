/* NAV-IMPORT-1E / NAV-PWA-1 — GitHub Pages-safe service worker
   Caches only the Navigator app shell. User data remains in localStorage/exports and is not cached here. */
const CACHE_NAME = 'spc-navigator-nav-import-1e-2026-06-02';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of APP_SHELL) {
      try {
        await cache.add(new Request(url, {cache: 'reload'}));
      } catch (err) {
        console.warn('NAV-IMPORT-1E cache add skipped:', url, err);
      }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Only handle same-origin files inside this GitHub Pages site.
  if (url.origin !== self.location.origin) return;

  // Never interfere with browser-extension/devtools requests.
  if (!url.pathname.includes('/SPC-Navigator/') && self.location.pathname.includes('/SPC-Navigator/')) return;

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      // Cache only successful basic same-origin app-shell style responses.
      if (fresh && fresh.ok && fresh.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      // For navigation requests, fall back to cached app shell if available.
      if (req.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
