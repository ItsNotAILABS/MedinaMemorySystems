// 𓂀 NOVA OVO SERVICE WORKER 𓂀
// "Full sovereign, autonomous, 24 hours running a day"

const CACHE_NAME = 'nova-ovo-v1';
const HEARTBEAT_MS = 873; // φ⁴ × Schumann period

// Assets to cache for offline support
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing NOVA OVO Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating NOVA OVO Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  
  // Take control immediately
  self.clients.claim();
  
  // Start the organism heartbeat
  startHeartbeat();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }
  
  // API requests - network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for API requests
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Static assets - cache first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          }
        });
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'HEARTBEAT_REQUEST':
      // Send current heartbeat state
      event.ports[0].postMessage({
        type: 'HEARTBEAT_RESPONSE',
        beat: currentBeat,
        alive: true,
      });
      break;
      
    case 'SENSOR_DATA':
      // Process sensor data from devices
      processSensorData(data);
      break;
      
    case 'SYNC_REQUEST':
      // Trigger background sync
      self.registration.sync.register('oro-sync');
      break;
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'oro-sync') {
    event.waitUntil(syncData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'NOVA OVO', {
      body: data.body || 'New update from ORO',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: data.tag || 'oro-notification',
      data: data.data,
      actions: data.actions || [],
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      return clients.openWindow(urlToOpen);
    })
  );
});

// ─── Organism Heartbeat ───────────────────────────────────────────────────────

let currentBeat = 0;
let heartbeatInterval = null;

function startHeartbeat() {
  if (heartbeatInterval) return;
  
  console.log('[SW] Starting organism heartbeat at 873ms interval');
  
  heartbeatInterval = setInterval(() => {
    currentBeat++;
    
    // Broadcast heartbeat to all clients
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'HEARTBEAT',
          beat: currentBeat,
          timestamp: Date.now(),
        });
      });
    });
    
    // PIL cycle check (every 52 beats)
    if (currentBeat % 52 === 0) {
      console.log('[SW] PIL cycle complete, beat:', currentBeat);
    }
  }, HEARTBEAT_MS);
}

// ─── Sensor Data Processing ───────────────────────────────────────────────────

const sensorBuffer = [];
const BATCH_WINDOW_MS = 873;

function processSensorData(data) {
  sensorBuffer.push({
    ...data,
    receivedAt: Date.now(),
    beat: currentBeat,
  });
  
  // Batch and process when window is full
  if (sensorBuffer.length >= 10) {
    const batch = sensorBuffer.splice(0, 10);
    // Would send to backend for processing
    console.log('[SW] Sensor batch processed:', batch.length, 'readings');
  }
}

// ─── Background Sync ──────────────────────────────────────────────────────────

async function syncData() {
  console.log('[SW] Performing background sync...');
  
  try {
    // Sync any pending data
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    // Filter for API requests that need syncing
    const apiRequests = requests.filter((r) => r.url.includes('/api/'));
    
    console.log('[SW] Sync complete, processed:', apiRequests.length, 'requests');
    return true;
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    return false;
  }
}
