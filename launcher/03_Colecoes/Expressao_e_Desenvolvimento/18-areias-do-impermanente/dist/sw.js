
const prefix = 'ambiente-18-areias-do-impermanente:' + self.registration.scope + ':'
const cacheName = prefix + '939e90f94f5078'
const entry = new URL('index.html', self.registration.scope).href
const files = ["index.html","assets/content-Cttjni00.js","assets/experience-elAjKJ9C.js","assets/fallback-BxjYmWs4.js","assets/index-1TbKmmfS.js","assets/index-DBVB0dXH.css","assets/three.module-CpB-wl7P.js"]
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
