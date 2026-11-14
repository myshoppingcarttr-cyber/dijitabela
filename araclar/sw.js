// Dijitabela Araçlar: çevrimdışı kullanım. Önce ağ, yoksa önbellek. Yalnız aynı alan adı; kullanıcı verisi önbelleğe girmez (veri localStorage'da).
var AD = "dt-araclar-v1", ON = ["./", "kira-zam-defteri/", "pismanlik-gecikme-zammi/", "gizlilik/", "destek/", "ortak/arac.css", "ortak/oranlar.js", "ortak/hesap.js", "ortak/ortak.js", "ortak/kira-ui.js", "ortak/zam-ui.js", "../anahtar-teslim/font/archivo.ttf", "../anahtar-teslim/font/plusjakartasans-400.woff2", "../anahtar-teslim/font/plusjakartasans-700.woff2", "../anahtar-teslim/font/spacemono-bold.ttf"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(AD).then(function (c) { return Promise.all(ON.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x.indexOf("dt-araclar-") === 0 && x !== AD; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(r).then(function (y) {
    if (y.ok && y.type === "basic") { var k = y.clone(); caches.open(AD).then(function (c) { c.put(r, k); }); }
    return y;
  }).catch(function () { return caches.match(r, { ignoreSearch: true }); }));
});
