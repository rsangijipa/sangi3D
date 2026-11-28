import { defineConfig } from 'vite'
import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const offline = {
  name: 'ambiente-18-areias-do-impermanente-offline',
  apply: 'build',
  async closeBundle() {
    const index = await readFile('dist/index.html')
    const assets = (await readdir('dist/assets')).sort().map(name => 'assets/' + name)
    const revision = createHash('sha256').update(index).update(assets.join(',')).digest('hex').slice(0, 14)
    await writeFile(join('dist', 'sw.js'), `
const prefix = 'ambiente-18-areias-do-impermanente:' + self.registration.scope + ':'
const cacheName = prefix + '${revision}'
const entry = new URL('index.html', self.registration.scope).href
const files = ${JSON.stringify(['index.html', ...assets])}
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
`)
  }
}

export default defineConfig({
  base: './',
  build: { target: 'es2022' },
  server: { host: '127.0.0.1' },
  plugins: [offline]
})
