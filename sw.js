// Service worker del Panel Cenzontle.
// Guarda en el celular los archivos de la app para que abra rápido y funcione con mala señal.
// Los datos NO se guardan aquí: siempre se piden en línea a la API.
// Al publicar una versión nueva, cambia el número de CACHE para que los celulares la descarguen.
const CACHE = 'panel-cenzontle-v9';
const ARCHIVOS = ['./', './index.html', './portal.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
