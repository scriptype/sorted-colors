const Config = {
  cacheName: 'PWA-7008'
}

const filesToCache = [
  '.',
  './index.html',
  './app/global-events.js',
  './app/controller.js',
  './app/event-emitter.js',
  './app/table.js',
  './app/colors.js',
  './app/view/chart.js',
  './app/view/hue-control.js',
  './app/view/color-info.js',
  './app/utils.js',
  './app/model.js',
  './index.js',
  './style/reset.css',
  './style/components/chart.css',
  './style/components/hue-slider.css',
  './style/components/hue-control.css',
  './style/components/social-links.css',
  './style/components/color-info.css',
  './style/components/mono-toggle.css',
  './style/components/axis.css',
  './style/components/icons.css',
  './style/helpers.css',
  './style/mixins.css',
  './style/base.css',
  './favicon.png',
  './style.css',
  './service-worker.js',
  './vendor/inert.min.js',
  './vendor/select.js'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(Config.cacheName).then(cache => {
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== Config.cacheName) {
          console.log('[ServiceWorker] Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
})
