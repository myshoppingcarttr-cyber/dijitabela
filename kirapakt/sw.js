// KiraPakt service worker: yalnızca /kirapakt/ kapsamındaki GET isteklerini önbelleğe alır.
// Sayfalar önce ağdan gelir, böylece yeni sürüm hemen görünür; çevrimdışıyken önbellek kullanılır.
const VERSION = "v1";
const PAGES = `kirapakt-sayfalar-${VERSION}`;
const ASSETS = `kirapakt-dosyalar-${VERSION}`;
const BASE = new URL("./", self.location).pathname;
const OFFLINE = `${BASE}offline.html`;
const PRECACHE = [
  BASE,
  OFFLINE,
  `${BASE}manifest.json`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`,
  `${BASE}sequence/m/f0001.webp`,
  `${BASE}sequence/d/f0001.webp`,
];
const IMMUTABLE = [`${BASE}_next/static/`, `${BASE}sequence/`, `${BASE}foto/`, `${BASE}icons/`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("kirapakt-") && key !== PAGES && key !== ASSETS).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const store = async (name, request, response) => {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(name);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  // Next'in sayfa geçiş verisi saklanmaz: çevrimdışıyken Next tam sayfa geçişe döner ve aşağıdaki yol devreye girer.
  if (url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => store(PAGES, request, response))
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE))),
    );
    return;
  }

  if (IMMUTABLE.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((response) => store(ASSETS, request, response))));
    return;
  }

  event.respondWith(fetch(request).then((response) => store(PAGES, request, response)).catch(() => caches.match(request).then((hit) => hit || Response.error())));
});
