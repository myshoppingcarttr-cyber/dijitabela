/* Fincan Falı demo servis çalışanı: yalnız bu klasör kapsamında (scope = bu dosyanın klasörü). Sitenin kök sw.js'ine dokunmaz. */
var SURUM = "fincanfali-1013-v1";
var CEKIRDEK = ["ortak/fal.css", "ortak/fal.js", "ortak/panel.js", "ortak/ikon.svg", "manifest.webmanifest", "3-uygulama/", "1-gece/", "2-mistik/", "panel/"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(SURUM).then(function (c) { return Promise.all(CEKIRDEK.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== SURUM; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var r = e.request; if (r.method !== "GET") return;
  var u = new URL(r.url); if (u.origin !== location.origin || u.pathname.indexOf(new URL("./", self.registration.scope).pathname) !== 0) return;
  e.respondWith(fetch(r).then(function (res) { var kopya = res.clone(); caches.open(SURUM).then(function (c) { c.put(r, kopya); }); return res; }).catch(function () { return caches.match(r); }));
});
