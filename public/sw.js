// public/sw.js
// Basic service worker for caching strategies (e.g., stale-while-revalidate)
// This is a very basic example. For production, you'd use Workbox or a more robust setup.

const CACHE_NAME = 'guia-mais-cache-v1';
const urlsToCache = [
  '/',
  // Add other important assets/pages you want to cache initially
  // For example: '/styles/globals.css', '/logo.png', '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null; 
        })
      );
    })
  );
});

// Basic push notification listener (requires more setup for actual display)
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data ? event.data.text() : 'no payload'}"`);

  const title = 'Guia Mais Notificação';
  const options = {
    body: event.data ? event.data.text() : 'Você tem uma nova notificação!',
    icon: '/icons/icon-192x192.png', // Ensure you have this icon
    badge: '/icons/icon-192x192.png' // Ensure you have this icon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
