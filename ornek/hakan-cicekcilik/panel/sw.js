// Panel çevrimdışı açılabilsin: kabuk dosyaları önbellekte
const A="hc-panel-v1",D=["./","index.html","panel.js","ikon.svg","manifest.webmanifest"];
self.addEventListener("install",e=>e.waitUntil(caches.open(A).then(c=>c.addAll(D)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(A).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
