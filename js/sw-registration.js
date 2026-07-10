(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  navigator.serviceWorker.register('/sw.js').then(function (registration) {
    registration.addEventListener('updatefound', function () {
      var worker = registration.installing;
      if (!worker) return;
      worker.addEventListener('statechange', function () {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          console.info('博客资源已更新，下次打开时生效。');
        }
      });
    });
  }).catch(function (error) {
    console.warn('Service Worker registration failed:', error);
  });
}());
