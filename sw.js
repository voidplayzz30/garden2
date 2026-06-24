var CACHE = 'love-garden-v2';
var FILES = [
  './',
  './index.html',
  './style.css',
  './animations.css',
  './game.css',
  './app.js',
  './garden.js',
  './plants.js',
  './weather.js',
  './achievements.js',
  './bees.js',
  './bouquet.js',
  './notes.js',
  './storage.js',
  './manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});