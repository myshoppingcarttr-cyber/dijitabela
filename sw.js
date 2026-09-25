// Panel uygulaması için servis çalışanı: kurulabilirlik sağlar, veriyi ÖNBELLEĞE ALMAZ (CRM her zaman güncel)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
