
const prefix = 'ambiente-16-vale-dos-baloes-passageiros:' + self.registration.scope + ':'
const cacheName = prefix + '565e8fe1260a5d'
const entry = new URL('index.html', self.registration.scope).href
const files = ["index.html","assets/content-BNTPG1JF.js","assets/experience-bY2ZAwYN.js","assets/fallback-DIKbfAEA.js","assets/index-DBVB0dXH.css","assets/index-estzb-Jd.js","assets/three.module-CpB-wl7P.js"]
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
