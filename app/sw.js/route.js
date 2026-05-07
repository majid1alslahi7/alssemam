const serviceWorkerSource = `
const CACHE_VERSION = 'alssemam-cleanup-v2';
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';
const PRECACHE_ASSETS = [OFFLINE_URL, '/favicon.ico'];
const IGNORED_HOSTS = ['google-analytics.com', 'googletagmanager.com', 'gtm.js'];

const isIgnored = (url) => IGNORED_HOSTS.some((host) => url.hostname.includes(host));
const isValid = (response) => response && response.status === 200 && response.type === 'basic';

async function deleteLegacyCaches() {
  const names = await caches.keys();
  await Promise.all(
    names.map((name) => {
      if (name === STATIC_CACHE) return undefined;
      if (
        name.startsWith('static-') ||
        name.startsWith('next-data-') ||
        name.startsWith('runtime-') ||
        name.startsWith('workbox-') ||
        name.includes('next')
      ) {
        return caches.delete(name);
      }
      return undefined;
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(deleteLegacyCaches)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    deleteLegacyCaches()
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clients) => {
        clients.forEach((client) => client.postMessage({ type: 'ALSSEMAM_BUILD_CACHE_CLEARED' }));
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (isIgnored(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request, { cache: 'reload' }));
    return;
  }

  if (url.pathname === '/sw.js' || url.pathname === '/manifest.json') {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  if (['image', 'font', 'style'].includes(request.destination)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetched = fetch(request).then((response) => {
            if (isValid(response)) cache.put(request, response.clone());
            return response;
          });
          return cached || fetched;
        })
      )
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(serviceWorkerSource, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Surrogate-Control": "no-store",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
