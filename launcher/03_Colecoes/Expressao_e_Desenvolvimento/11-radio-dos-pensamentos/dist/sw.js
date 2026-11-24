
const prefix = 'ambiente-11-radio-dos-pensamentos:' + self.registration.scope + ':'
const cacheName = prefix + '277c8850eba49f'
const entry = new URL('index.html', self.registration.scope).href
const files = ["index.html","assets/content-DLLUDfV9.js","assets/experience-O1bqTnBa.js","assets/fallback-xpxhvjGy.js","assets/index-CHVrVUOV.js","assets/index-DBVB0dXH.css","assets/three.module-CpB-wl7P.js"]
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
