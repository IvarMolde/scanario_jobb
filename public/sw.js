const CACHE = 'jobbreisen-offline-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['./', './index.html', './favicon.svg', './manifest.webmanifest']),
    ),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      try {
        const svar = await fetch(event.request)
        if (svar.ok) await cache.put(event.request, svar.clone())
        return svar
      } catch {
        const lagret = await cache.match(event.request)
        if (lagret) return lagret
        if (event.request.mode === 'navigate') {
          const start = await cache.match('./index.html')
          if (start) return start
        }
        throw new Error('offline')
      }
    }),
  )
})
