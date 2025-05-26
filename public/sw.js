
// public/sw.js
// This is a basic service worker.
// For PWA features like push notifications, you'll need to integrate Firebase Cloud Messaging (FCM)
// and add its service worker logic here (often in a firebase-messaging-sw.js file that this one imports).

const CACHE_NAME = 'guia-mais-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  // Add other critical assets you want to cache for offline use
  // For example: '/icons/icon-192x192.png', '/styles/globals.css' (if not inlined)
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
        return fetch(event.request);
      }
    )
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
        })
      );
    })
  );
});

// Placeholder for FCM push notification handling
// self.addEventListener('push', function(event) {
//   console.log('[Service Worker] Push Received.');
//   console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
//
//   const title = 'Guia Mais';
//   const options = {
//     body: event.data.text(),
//     icon: '/icons/icon-192x192.png', // Path to an icon
//     badge: '/icons/badge-72x72.png' // Path to a badge icon
//   };
//
//   event.waitUntil(self.registration.showNotification(title, options));
// });

// self.addEventListener('notificationclick', function(event) {
//   console.log('[Service Worker] Notification click Received.');
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow('https://example.com') // TODO: Change to your app's URL or a relevant page
//   );
// });

console.log('Guia Mais Service Worker V1 Loaded.');
