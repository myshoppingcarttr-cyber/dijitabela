// Prototip ziyaret takibi (9 Eki 2026): sayfa açılışı, kalma süresi ve düğme tıklamaları → Supabase prototip-izle.
// Çerez/IP yok; oturum kimliği yalnız bu sekmede (sessionStorage). Alim Bey'in kendi ziyaretleri sayılmaz:
// bir kez ?ben=1 ile açınca bu tarayıcı işaretlenir (localStorage "dj-ben").
(function () {
  "use strict";
  try {
    if (location.protocol === "file:") return;
    var q = new URLSearchParams(location.search);
    if (q.get("ben") === "1") localStorage.setItem("dj-ben", "1");
    if (q.get("ben") === "0") localStorage.removeItem("dj-ben");
    if (localStorage.getItem("dj-ben") === "1") return;
  } catch (e) { /* depolama kapalıysa yine say */ }
  var m = location.pathname.match(/\/ornek\/([a-z0-9-]+)\/(.*)$/); if (!m) return;
  var slug = m[1], sayfa = (m[2] || "").replace(/index\.html$/, "") || "seçim sayfası";
  var URL_ = "https://ctlbhwbccqgwmtqbwtfs.supabase.co/functions/v1/prototip-izle";
  var oturum; try { oturum = sessionStorage.getItem("dj-o") || (Math.random().toString(36).slice(2) + Date.now().toString(36)); sessionStorage.setItem("dj-o", oturum); } catch (e) { oturum = Math.random().toString(36).slice(2); }
  var cihaz = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent) ? "telefon" : "bilgisayar";
  function gonder(o) { o.slug = slug; o.sayfa = sayfa; o.oturum = oturum; o.cihaz = cihaz; var b = JSON.stringify(o); if (navigator.sendBeacon) navigator.sendBeacon(URL_, new Blob([b], { type: "text/plain" })); else fetch(URL_, { method: "POST", body: b, keepalive: true }).catch(function () {}); }
  gonder({ olay: "ac" });
  var bas = Date.now(), gorunur = 0, son = Date.now();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { gorunur += Date.now() - son; gonder({ olay: "sure", sure_sn: Math.round(gorunur / 1000) }); } else son = Date.now();
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a,button"); if (!a) return;
    var t = (a.getAttribute("href") || "") + " " + (a.textContent || "").trim().slice(0, 60);
    gonder({ olay: "tikla", hedef: t.trim().slice(0, 160) });
  }, true);
})();
