// Service Worker for GrowthOS PWA
const CACHE_VERSION = 'growthOS-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const OFFLINE_CACHE = `${CACHE_VERSION}-offline`;

// App shell routes to cache upfront
const APP_SHELL_ROUTES = [
  '/',
  '/dashboard',
  '/pipeline',
  '/schedule',
  '/contacts',
  '/estimates',
  '/invoices',
  '/offline.html'
];

// Static assets extensions
const STATIC_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf'];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Cache static assets
        const staticCache = await caches.open(STATIC_CACHE);
        await staticCache.addAll(APP_SHELL_ROUTES.concat(['/offline.html']));
        self.skipWaiting();
      } catch (error) {
        console.error('Install event failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('growthOS-') && !name.includes(CACHE_VERSION))
          .map(name => caches.delete(name))
      );
      self.clients.claim();
    })()
  );
});

// Fetch event - routing strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls - network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Static assets - cache-first strategy
  if (STATIC_EXTENSIONS.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Navigation requests - network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigationStrategy(request));
    return;
  }

  // Default - network-first strategy
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Network-first strategy with cache fallback
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Fall back to cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // If it's an API request and no cache, throw error
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ error: 'You are offline and data is not available' }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    throw error;
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('Cache-first fetch failed:', error);
    throw error;
  }
}

// Network-first navigation strategy with offline fallback
async function networkFirstNavigationStrategy(request) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Try to return cached version
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Return offline fallback
    const offlineResponse = await caches.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
