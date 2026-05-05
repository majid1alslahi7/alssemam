'use client';

import { useEffect } from 'react';

const RECOVERY_KEY = 'alssemam-chunk-recovery-attempted';

function errorMessage(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return [value.name, value.message, value.stack].filter(Boolean).join('\n');
}

function isChunkLoadFailure(value) {
  const message = errorMessage(value);
  return /ChunkLoadError|Loading chunk \d+ failed|CSS_CHUNK_LOAD_FAILED|failed to fetch dynamically imported module|Importing a module script failed/i.test(message);
}

async function clearBrowserBuildCaches() {
  if ('caches' in window) {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
  }

  if (navigator.serviceWorker?.getRegistrations) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    let recoveryStarted = false;

    const recover = async () => {
      if (recoveryStarted || sessionStorage.getItem(RECOVERY_KEY) === '1') return;

      recoveryStarted = true;
      sessionStorage.setItem(RECOVERY_KEY, '1');

      try {
        await clearBrowserBuildCaches();
      } catch {
        // Reload even if cache cleanup is unavailable.
      }

      window.location.reload();
    };

    const handleRejection = (event) => {
      if (isChunkLoadFailure(event.reason)) {
        event.preventDefault?.();
        void recover();
      }
    };

    const handleError = (event) => {
      const target = event.target;
      const failedNextAsset =
        target instanceof HTMLScriptElement &&
        typeof target.src === 'string' &&
        target.src.includes('/_next/static/');

      if (failedNextAsset || isChunkLoadFailure(event.error) || isChunkLoadFailure(event.message)) {
        void recover();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}
