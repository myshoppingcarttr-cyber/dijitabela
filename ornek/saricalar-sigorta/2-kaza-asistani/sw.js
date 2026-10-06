// Sarıcalar kaza asistanı: çevrimdışı çalışsın (kazada çekim olmayabilir)
const ONBELLEK = "saricalar-asistan-v2";
const DOSYALAR = ["./", "./index.html", "./manifest.webmanifest", "./ikon.svg", "../img/dukkan.jpg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(ONBELLEK).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== ONBELLEK).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => { const k = r.clone(); if (new URL(e.request.url).origin === location.origin) caches.open(ONBELLEK).then((c) => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html"))));
});
