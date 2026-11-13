// Uygulama kabuğunu önbellekler; hiçbir müşteri verisi burada tutulmaz (veri IndexedDB'de, istekler Supabase'e doğrudan gider).
const SURUM = "fc2af55f6e", ON = "crm-" + SURUM, DOSYA = ["/crm/","/crm/app-WPIQ2RDT.js","/crm/app-QZMZSDOV.css","/crm/manifest.webmanifest","/crm/ikon-180.png","/crm/ikon-192.png","/crm/ikon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(ON).then((c) => c.addAll(DOSYA)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x.startsWith("crm-") && x !== ON).map((x) => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || !u.pathname.startsWith("/crm/")) return;
  if (e.request.mode === "navigate") { e.respondWith(fetch(e.request).then((r) => { const k = r.clone(); caches.open(ON).then((c) => c.put("/crm/", k)); return r; }).catch(() => caches.match("/crm/"))); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((h) => h || fetch(e.request)));
});
