
const prefix = 'ambiente-07-sala-das-cadeiras-possiveis:' + self.registration.scope + ':'
const cacheName = prefix + 'e3121691d85932'
const entry = new URL('index.html', self.registration.scope).href
const files = ["index.html","assets/content-DmBJfi0r.js","assets/experience-r-6sNJFd.js","assets/fallback-Cqo5Fzwi.js","assets/index-BGPrcbqL.js","assets/index-DBVB0dXH.css","assets/rules-D2DEilzX.js","assets/three.module-CpB-wl7P.js"]
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
