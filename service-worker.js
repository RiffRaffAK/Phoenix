/* Phoenix Wolf Systems V9 - Service Worker
 * Ghost Worker persistence layer
 * Provides: offline support, background sync, cache management, push notifications
 */

'use strict';

const CACHE_NAME = 'phoenix-v9';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/phoenixSystem.json',
  '/constitution.json',
  '/threats.json',
  '/PhoenixWolf.png'
];

const API_CACHE = 'phoenix-api-v9';
const SYNC_TAG = 'phoenix-sync';

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Phoenix Ghost Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => console.warn(`[SW] Could not cache: ${url}`))
        )
      );
    }).then(() => {
      console.log('[SW] Ghost Worker installed and ready');
      return self.skipWaiting();
    })
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Ghost Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE)
          .map(name => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Ghost Worker active — Phoenix is persistent');
      return self.clients.claim();
    })
  );
});

// ─── Fetch (network-first for API, cache-first for static) ────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.pathname.startsWith('/api/')) return;

  // API routes: network-first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstApi(event.request));
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response(offlinePage(), { headers: { 'Content-Type': 'text/html' } });
  }
}

async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline', cached: false }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function offlinePage() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Phoenix — Offline</title>
<style>
body { background: #000; color: #c4b5fd; font-family: monospace; text-align: center; padding: 4rem; }
h1 { color: #a855f7; font-size: 3rem; }
p { color: #c4b5fd; }
</style>
</head>
<body>
<h1>🔮 PHOENIX</h1>
<p>Ghost Worker active. You are offline.</p>
<p>Phoenix persists. Reconnecting when network returns...</p>
<script>
setInterval(() => { if (navigator.onLine) location.reload(); }, 3000);
</script>
</body>
</html>`;
}

// ─── Background Sync ──────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  console.log(`[SW] Background sync triggered: ${event.tag}`);
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncPendingData());
  }
  if (event.tag === 'github-sync') {
    event.waitUntil(syncToGitHub());
  }
});

async function syncPendingData() {
  try {
    const db = await openIndexedDB();
    const pending = await getPendingMessages(db);
    for (const item of pending) {
      try {
        const resp = await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${item.token}` },
          body: JSON.stringify(item.data)
        });
        if (resp.ok) await markSynced(db, item.id);
      } catch {
        console.warn('[SW] Failed to sync message, will retry');
      }
    }
    notifyClients({ type: 'sync:complete', count: pending.length });
  } catch (err) {
    console.error('[SW] Sync failed:', err);
  }
}

async function syncToGitHub() {
  // Sync state snapshot to GitHub Gist if configured
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({ type: 'github:sync:request' });
  }
}

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'Phoenix', body: event.data.text() }; }

  const options = {
    body: data.body || 'Phoenix notification',
    icon: '/PhoenixWolf.png',
    badge: '/PhoenixWolf.png',
    vibrate: [200, 100, 200],
    data: data.url ? { url: data.url } : {},
    actions: [
      { action: 'view', title: 'View', icon: '/PhoenixWolf.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔮 Phoenix Alert', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});

// ─── Message Passing (from main thread) ──────────────────────────────────────
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  if (type === 'skipWaiting') {
    self.skipWaiting();
  }

  if (type === 'cache:add') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.add(payload.url))
    );
  }

  if (type === 'cache:clear') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }

  if (type === 'ping') {
    event.source.postMessage({ type: 'pong', timestamp: Date.now() });
  }
});

// ─── IndexedDB helpers for offline queue ─────────────────────────────────────
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('phoenix-offline', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('pending')) {
        db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = reject;
  });
}

function getPendingMessages(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending', 'readonly');
    const req = tx.objectStore('pending').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}

function markSynced(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending', 'readwrite');
    const req = tx.objectStore('pending').delete(id);
    req.onsuccess = resolve;
    req.onerror = reject;
  });
}

function notifyClients(message) {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(message));
  });
}

console.log('[SW] Phoenix Ghost Worker script loaded');
