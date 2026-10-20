/* Simple offline cache: cache-first for this site's own files. */
var CACHE = 'virtual-iphone-v1';
var FILES = [
  './', 'index.html', 'style.css', 'script.js', 'manifest.webmanifest',
  'images/icon-192.png', 'images/icon-512.png', 'images/apple-touch-icon.png',
  'images/wallpaper-dusk.svg', 'images/wallpaper-aurora.svg', 'images/wallpaper-blossom.svg',
  'images/icons/kakao.svg', 'images/icons/photos.svg', 'images/icons/notes.svg', 'images/icons/instagram.svg',
  'images/icons/calendar.svg', 'images/icons/safari.svg', 'images/icons/settings.svg', 'images/icons/clock.svg',
  'images/photos/photo1.svg', 'images/photos/photo2.svg', 'images/photos/photo3.svg', 'images/photos/photo4.svg',
  'images/photos/photo5.svg', 'images/photos/photo6.svg', 'images/photos/photo7.svg', 'images/photos/photo8.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    });
  }));
});
