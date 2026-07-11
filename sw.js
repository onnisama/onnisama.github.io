/*
 * One-time Service Worker retirement script.
 *
 * Keep this file available at /sw.js long enough for returning visitors to
 * receive it. It replaces the old cache-first worker, clears every cache that
 * worker created, unregisters itself, and reloads open pages from the network.
 * There is intentionally no fetch handler: once this worker activates, all
 * requests fall through to GitHub Pages.
 */

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));

    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });

    await self.registration.unregister();

    await Promise.all(windows.map(client => (
      client.navigate(client.url).catch(() => undefined)
    )));
  })());
});
