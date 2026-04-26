/* sw.js - Next.js PWA مع دعم Background Sync */

const CACHE_VERSION = 'v1.0.2'; // حدث الإصدار
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const NEXT_STATIC_CACHE = `next-static-${CACHE_VERSION}`;
const NEXT_DATA_CACHE = `next-data-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/robots.txt',
  '/favicon.ico'
];

const IGNORED_HOSTS = ['google-analytics.com', 'googletagmanager.com', 'gtm.js'];

const isIgnored = (url) => IGNORED_HOSTS.some(h => url.hostname.includes(h));
const isValid = (res) => res && res.status === 200 && res.type === 'basic';

// ---------- IndexedDB Helper (للمزامنة) ----------
const DB_NAME = 'PwaSyncDB';
const STORE_NAME = 'pendingRequests';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function addPendingRequest(data) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).add({ data, timestamp: Date.now() });
  return tx.complete;
}

async function getAllPendingRequests() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function deletePendingRequest(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  return tx.complete;
}

// ---------- أحداث Service Worker ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, NEXT_STATIC_CACHE, NEXT_DATA_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (!validCaches.includes(key)) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (isIgnored(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(res => {
        if (isValid(res)) {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return res;
      }).catch(() => caches.match(request).then(cached => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(NEXT_STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(netRes => {
            if (isValid(netRes)) cache.put(request, netRes.clone());
            return netRes;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  if (url.pathname.startsWith('/_next/data/')) {
    event.respondWith(
      caches.open(NEXT_DATA_CACHE).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(netRes => {
            if (isValid(netRes)) cache.put(request, netRes.clone());
            return netRes;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  if (['image','font','style'].includes(request.destination)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(netRes => {
            if (isValid(netRes)) cache.put(request, netRes.clone());
            return netRes;
          });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

// ---------- حدث المزامنة الخلفية (Background Sync) ----------
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-consultation') {
    event.waitUntil(
      (async () => {
        const pending = await getAllPendingRequests();
        for (const item of pending) {
          try {
            const response = await fetch('/api/consultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data)
            });
            if (response.ok) {
              await deletePendingRequest(item.id);
            } else {
              throw new Error(`فشل الإرسال: ${response.status}`);
            }
          } catch (err) {
            console.error('[SW Sync] خطأ:', err);
            // سيُعاد المحاولة تلقائياً في المزامنة القادمة
          }
        }
      })()
    );
  }
});

// ---------- إشعار عند تثبيت التطبيق (اختياري) ----------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
