
const prefix = 'cidade-das-conversas:' + self.registration.scope + ':'
const cacheName = prefix + 'b5317b94e55b1f'
const entry = new URL('index.html', self.registration.scope).href
const files = ["index.html","assets/index-BP1TDaeR.css","assets/index-C33ckXpT.js","assets/miniatura-DJ-4Mi_I.png","assets/scene-CFdLJkTL.js"]
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(files)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(cacheName).then(cache => cache.match(entry)).then(hit => hit || fetch(request)))
    return
  }
  event.respondWith(caches.open(cacheName).then(cache => cache.match(request, { ignoreVary: true })).then(hit => hit || fetch(request)))
})
