var CACHE = 'love-garden-v4';
var FILES = [
  './', './index.html', './view.html', './style.css', './animations.css',
  './app.js', './garden.js', './plants.js', './weather.js',
  './achievements.js', './bees.js', './bouquet.js', './notes.js',
  './storage.js', './manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
});

self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
});
