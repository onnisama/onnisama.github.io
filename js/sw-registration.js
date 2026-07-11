(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  function isLegacyBlogCache(cacheName) {
    return cacheName === 'precache-v1' ||
      cacheName === 'runtime' ||
      cacheName.indexOf('main-') === 0 ||
      cacheName.indexOf('wuxi-') === 0;
  }

  async function clearOrphanedCaches() {
    if (!('caches' in window)) return;
    var cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter(isLegacyBlogCache)
      .map(function (cacheName) { return caches.delete(cacheName); }));
  }

  async function retireLegacyServiceWorker() {
    try {
      var registrations = await navigator.serviceWorker.getRegistrations();

      // New visitors should not receive a Service Worker. We only keep this
      // script temporarily so browsers with an existing registration can
      // update to the cleanup worker at /sw.js.
      if (!registrations.length) {
        await clearOrphanedCaches();
        return;
      }

      var registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      await registration.update();
    } catch (error) {
      console.warn('Legacy Service Worker cleanup failed:', error);
    }
  }

  retireLegacyServiceWorker();
}());
