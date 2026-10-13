/* Marka config - TEK DOSYA. Kurulumda yalnız bu dosyadaki VARSAYILAN bloğu değiştirilir; tüm sayfalar (index, teklif, 3 tema, panel)
   bu dosyayı yükler. Panel > Yönetici > "Marka" sekmesi önizleme içindir: değişiklik bu tarayıcının localStorage'ına yazılır
   ve aynı tarayıcıdaki sayfalara anında uygulanır (storage olayı). Kalıcı marka = bu dosya.
   NOT (manifest): manifest.webmanifest statik dosyadır; burada JS ile marka adı/renklerle dinamik manifest üretilir (blob).
   Kurulumda statik manifest.webmanifest içindeki name/short_name da bu dosyadaki ad ile aynı yapılmalıdır (JS çalışmayan kurulumlar için). */
(function () {
  "use strict";
  var VARSAYILAN = {
    ad: "Fincan Falı",
    slogan: "Fincanın söylediğini dinle",
    logo: "",            // "" = yerleşik fincan logosu; "<svg ...>" metni; ya da görsel yolu / data: adresi
    wa: "905386765727",  // WhatsApp numarası (ülke koduyla, + ve boşluk olmadan)
    alan: "fincanfali.com",
    tema: {              // 3 temanın her biri için birincil (altın) ve vurgu (mor) renk; *2 = açık ton
      gece:      { birincil: "#d9ab55", birincil2: "#f2d391", vurgu: "#6b3fa0", vurgu2: "#9b72d0" },
      mistik:    { birincil: "#d8b25e", birincil2: "#f1dca0", vurgu: "#7a49b8", vurgu2: "#b48ae6" },
      uygulama:  { birincil: "#e0b25a", birincil2: "#f6dc9f", vurgu: "#7448b0", vurgu2: "#a780dd" }
    }
  };
  var ANAHTAR = "kahvefali_marka_v1", ILK_AD = "Fincan Falı";

  function kopya(o) { return JSON.parse(JSON.stringify(o)); }
  function oku() { try { var r = localStorage.getItem(ANAHTAR); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function birlestir(o) {
    var m = kopya(VARSAYILAN); if (!o) return m;
    ["ad", "slogan", "logo", "wa", "alan"].forEach(function (k) { if (typeof o[k] === "string") m[k] = o[k]; });
    if (o.tema) for (var t in m.tema) if (o.tema[t]) for (var a in m.tema[t]) if (/^#[0-9a-f]{6}$/i.test(o.tema[t][a] || "")) m.tema[t][a] = o.tema[t][a];
    return m;
  }
  function temaAdi() { var p = location.pathname; return /3-uygulama/.test(p) ? "uygulama" : /2-mistik/.test(p) ? "mistik" : "gece"; }
  function acik(hex, y) { // rengi beyaza doğru y oranında açar
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.round(c + (255 - c) * y); }
    return "#" + [f(r), f(g), f(b)].map(function (c) { return ("0" + c.toString(16)).slice(-2); }).join("");
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var M = birlestir(oku()), sablon = null, kok = (function () {
    var s = document.currentScript; try { return new URL("../", s.src).href; } catch (e) { return location.href; }
  })();

  function logoHtml(m) {
    m = m || M; var l = (m.logo || "").trim();
    if (!l) return null;
    if (/^<svg/i.test(l)) return l.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "").replace(/<svg/i, '<svg class="fc-logo"');
    return '<img class="fc-logo" src="' + esc(l) + '" alt="" style="object-fit:contain">';
  }

  function renkler() {
    var t = M.tema[temaAdi()], s = document.documentElement.style;
    s.setProperty("--altin", t.birincil); s.setProperty("--altin2", t.birincil2);
    s.setProperty("--mor", t.vurgu); s.setProperty("--mor2", t.vurgu2);
  }
  function baslik() {
    if (sablon === null) sablon = document.title;
    document.title = sablon.split(ILK_AD).join(M.ad);
  }
  function manifest() {
    var l = document.querySelector('link[rel="manifest"]'); if (!l) return;
    if (!l.hasAttribute("data-asil")) l.setAttribute("data-asil", l.getAttribute("href"));
    var t = M.tema[temaAdi()], ik = /^data:image\//.test(M.logo) ? M.logo : (/^<svg/i.test(M.logo) ? null : (M.logo ? new URL(M.logo, kok).href : null));
    var tip = ik && /^data:(image\/[a-z+.-]+)/i.exec(ik); tip = tip ? tip[1] : (ik && /\.svg/i.test(ik) ? "image/svg+xml" : "image/png");
    var ikon = ik ? [{ src: ik, sizes: "any", type: tip, purpose: "any" }] : [{ src: kok + "ortak/ikon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }, { src: kok + "ortak/ikon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" }];
    var js = { name: M.ad, short_name: M.ad.slice(0, 14), description: M.slogan, lang: "tr", start_url: kok + "3-uygulama/", scope: kok, display: "standalone", orientation: "portrait", background_color: "#1a0f0a", theme_color: "#1a0f0a", icons: ikon };
    try { l.href = URL.createObjectURL(new Blob([JSON.stringify(js)], { type: "application/manifest+json" })); } catch (e) {}
  }
  function dom() {
    var lg = logoHtml();
    [].slice.call(document.querySelectorAll("[data-marka]")).forEach(function (e) { e.textContent = M.ad; });
    [].slice.call(document.querySelectorAll("[data-slogan]")).forEach(function (e) { e.textContent = M.slogan; });
    [].slice.call(document.querySelectorAll("[data-alan]")).forEach(function (e) { e.textContent = M.alan; });
    [].slice.call(document.querySelectorAll("[data-wa]")).forEach(function (e) { e.setAttribute("href", "https://wa.me/" + M.wa.replace(/\D/g, "")); });
    [].slice.call(document.querySelectorAll("[data-logo]")).forEach(function (e) { if (lg) e.innerHTML = lg; else if (window.FAL && FAL.logoSvg) e.innerHTML = FAL.logoSvg(); });
    var d = document.querySelector('meta[name="description"]'); if (d) d.setAttribute("content", M.slogan);
  }
  function uygula() { renkler(); baslik(); if (document.body) { dom(); manifest(); } }

  window.MARKA = {
    get: function () { return M; },
    varsayilan: function () { return kopya(VARSAYILAN); },
    ilkAd: ILK_AD, logoHtml: function () { return logoHtml(M); }, acik: acik, temaAdi: temaAdi,
    kaydet: function (o) { // o: kısmi nesne; localStorage'a yazar ve anında uygular
      var mevcut = oku() || {}; for (var k in o) mevcut[k] = o[k];
      M = birlestir(mevcut);
      try { localStorage.setItem(ANAHTAR, JSON.stringify(mevcut)); } catch (e) {}
      uygula(); document.dispatchEvent(new CustomEvent("marka-degisti"));
    },
    sifirla: function () { try { localStorage.removeItem(ANAHTAR); } catch (e) {} M = birlestir(null); uygula(); document.dispatchEvent(new CustomEvent("marka-degisti")); }
  };
  Object.defineProperty(window.MARKA, "ad", { get: function () { return M.ad; } });

  renkler(); baslik();
  var hazir = function () { dom(); manifest(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hazir); else hazir();
  window.addEventListener("load", function () { dom(); });
  window.addEventListener("storage", function (e) {
    if (e.key !== ANAHTAR) return; M = birlestir(oku()); uygula(); document.dispatchEvent(new CustomEvent("marka-degisti"));
  });
})();
