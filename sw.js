const CACHE='flourish-and-bloom-v3-6-3';
const ASSETS=[
  './',
  './index.html?v=flourish363',
  './styles.css?v=flourish363',
  './navigation.js?v=flourish363',
  './app.js?v=flourish363',
  './flourish-bloom-recipes.js?v=flourish363',
  './v81.js?v=flourish363',
  './manifest.json',
  './icon.svg',
  './icon-192.svg',
  './icon-512.svg'
];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html?v=flourish363')))
  );
});
