const CACHE='rooted-v813';
const ASSETS=[
  './',
  './index.html?v=rooted813',
  './styles.css?v=rooted813',
  './navigation.js?v=rooted813',
  './app.js?v=rooted813',
  './v81.js?v=rooted813',
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
      .catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html?v=rooted813')))
  );
});
