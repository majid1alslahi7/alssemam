// lib/idb.js - أدوات IndexedDB للواجهة الأمامية
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

export async function addPendingRequest(data) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).add({ data, timestamp: Date.now() });
  return tx.complete;
}

export async function registerSync(tag = 'sync-consultation') {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await registration.sync.register(tag);
      console.log('[Sync] تم تسجيل المزامنة:', tag);
    } catch (err) {
      console.error('[Sync] فشل التسجيل:', err);
    }
  }
}
