// P-10 (Patron onayı 12 Eki 2026): teklif ve prototip seçim/giriş sayfalarında SABİT WhatsApp butonu + "Giriş paketi 4.900 TL'den başlar".
// Gerekçe: 35 prototip, 49 oturum, yalnız 2 teklif tıklaması. _build/wa-buton-ekle.js yalnız ornek/<slug>/index.html ve teklif.html'e ekler.
// FİYAT TEK DİL: giriş paketi 4.900 TL (başka başlangıç fiyatı yazmayın; değişirse yalnız FIYAT satırını değiştirin).
// Yerleşim: sayfada kendi "taslak" alt çubuğu varsa (tek sayfalık prototipler) ikinci çubuk açılmaz, buton o çubuğun içine girer;
// yoksa ekranın altına ince bir çubuk konur, konuşan tabela (.djr) ve uygulama alt menüsü (.yz-alt) çubuğun üstüne kaydırılır.
(function () {
  "use strict";
  if (window.DJ_WA_BUTON === false || document.getElementById("djwa") || document.querySelector(".djwa-b")) return;
  var WA_NUMARA = "905019452184"; // 15 Eki: 0538 hesabi Meta tarafindan kapatildi, gelen mesaj icin 0501 (Danisman onayli). 0538 geri gelince "905019452184" yap.
  var TEL = WA_NUMARA, FIYAT = "4.900 TL";
  // CK-2: kahve falı sayfalarında (yol bazlı) ya da <html data-fiyatsiz> işaretli sayfalarda tutar yazılmaz.
  var FIYATSIZ = /\/ornek\/kahve-fali(\/|$)/.test(location.pathname) || document.documentElement.hasAttribute("data-fiyatsiz");
  // 23 Eki (bensay): <html data-fiyat-metni="..."> varsa alt çubukta "Giriş paketi" yerine bu metin yazar (müşteriye özel kabul edilmiş paket).
  var OZEL = temizOzel(document.documentElement.getAttribute("data-fiyat-metni"));
  function temizOzel(t) { return String(t || "").replace(/[<>]/g, "").trim(); }
  var temiz = function (t) { return String(t || "").replace(/\s+/g, " ").trim(); };
  var ad = temiz(document.title.split(/\s[·|–]\s/)[0]) || temiz((document.querySelector("h1") || {}).textContent).slice(0, 60);
  if (ad.length > 70) ad = ad.slice(0, 70).replace(/\s+\S*$/, "");
  var metin = "Merhaba, " + (ad ? ad + " " : "") + "taslağını inceledim, görüşmek istiyorum";
  var href = "https://wa.me/" + TEL + "?text=" + encodeURIComponent(metin);
  var IKON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>';
  var css = document.createElement("style");
  css.textContent =
    "#djwa{position:fixed;left:0;right:0;bottom:0;z-index:9990;background:#16181D;color:#fff;box-shadow:0 -8px 24px rgba(0,0,0,.22);font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif}" +
    "#djwa .djwa-ic{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:8px 16px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}" +
    "#djwa .djwa-f{flex:1 1 auto;min-width:0;font-size:.9rem;line-height:1.3}#djwa .djwa-f small{display:block;color:#A9AFBA;font-size:.74rem}#djwa .djwa-f b{color:#FFB000}" +
    ".djwa-b{flex:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:0 18px;border-radius:999px;background:#25D366;color:#0B2E17!important;font-weight:800;font-size:.95rem;text-decoration:none!important;white-space:nowrap;box-shadow:0 4px 14px rgba(37,211,102,.35)}" +
    ".djwa-b:focus-visible{outline:3px solid #FFB000;outline-offset:2px}" +
    "html.djwa-cubuk body{padding-bottom:calc(var(--djwa-h,64px) + 8px)!important}" +
    "html.djwa-acik .djr{bottom:calc(var(--djwa-h,64px) + 12px)!important}" +
    "html.djwa-acik .yz-alt{bottom:calc(var(--djwa-h,64px) + 10px)!important}" +
    ".djwa-fy{color:#FFB000;font-weight:800;white-space:nowrap}" +
    ".taslak a.djwa-b{min-height:44px;padding:0 14px;font-size:.85rem;background:#25D366;color:#0B2E17!important;border-radius:999px}.taslak .djwa-b span{margin:0;font-size:inherit}" +
    ".taslak span.djwa-kisa{flex-direction:column;line-height:1.2;font-size:.74rem;margin-right:auto}.taslak span.djwa-kisa span{margin:0;font-size:inherit;white-space:nowrap}" +
    "@media(max-width:400px){.taslak.djwa-ici .djwa-bs{display:none}.taslak.djwa-ici .kap{gap:8px!important}.taslak.djwa-ici a{padding-left:10px!important;padding-right:10px!important}.taslak.djwa-ici a.djwa-b{padding:0!important;width:40px;min-height:40px}}" +
    "@media(max-width:600px){#djwa .djwa-ic{gap:10px;padding-left:12px;padding-right:12px}#djwa .djwa-f{font-size:.84rem}#djwa .djwa-f small{display:none}.djwa-b{padding:0 14px;font-size:.88rem}" +
    ".taslak.djwa-ici i,.taslak.djwa-ici .djwa-uzun{display:none}.taslak.djwa-ici .djwa-b span{display:none}.taslak.djwa-ici .djwa-b{width:44px;padding:0}}" +
    "@media(max-width:600px){.taslak span.djwa-kisa{display:flex}}@media(min-width:601px){.taslak span.djwa-kisa{display:none}}" +
    "@media print{#djwa,.djwa-b{display:none!important}}";
  document.head.appendChild(css);

  var taslak = document.querySelector(".taslak");
  var dugme = '<a class="djwa-b" href="' + href + '" target="_blank" rel="noopener" aria-label="WhatsApp\'tan yazın">' + IKON + "<span>WhatsApp'tan yazın</span></a>";
  if (taslak && getComputedStyle(taslak).position === "fixed") {
    // Tek sayfalık prototip: mevcut alt çubuğun içine (ikinci sabit çubuk açılmaz → asistan/alt menü ile çakışma olmaz)
    var span = taslak.querySelector("span"), link = taslak.querySelector("a");
    taslak.classList.add("djwa-ici");
    if (span) {
      span.innerHTML = '<span class="djwa-uzun">' + span.innerHTML + (OZEL ? " · " + OZEL + "</span>" : FIYATSIZ ? " · Fiyat için WhatsApp'tan yazın</span>" : ' · Giriş paketi <b class="djwa-fy">' + FIYAT + "'den</b> başlar</span>") +
        (OZEL ? '<span class="djwa-kisa"><span>' + OZEL + "</span></span>" : FIYATSIZ ? '<span class="djwa-kisa"><span>Fiyat için</span><span>WhatsApp&#39;tan yazın</span></span>' : '<span class="djwa-kisa"><span>Giriş paketi</span><span><b class="djwa-fy">' + FIYAT + "'den</b><span class=\"djwa-bs\"> başlar</span></span></span>");
      taslak.querySelector(".kap") ? (span.style.display = "contents") : 0;
    }
    var tut = document.createElement("span"); tut.innerHTML = dugme; tut = tut.firstChild;
    if (link) link.parentNode.insertBefore(tut, link); else (taslak.querySelector(".kap") || taslak).appendChild(tut);
  } else {
    var cubuk = document.createElement("div");
    cubuk.id = "djwa"; cubuk.setAttribute("role", "complementary"); cubuk.setAttribute("aria-label", "Dijitabela ile iletişim");
    cubuk.innerHTML = '<div class="djwa-ic"><div class="djwa-f">' + (OZEL ? OZEL : FIYATSIZ ? "Fiyat için WhatsApp'tan yazın" : 'Giriş paketi <b class="djwa-fy">' + FIYAT + "'den</b> başlar") + "<small>Beğendiğiniz tasarımı birlikte yayına alalım</small></div>" + dugme + "</div>";
    document.body.appendChild(cubuk);
    document.documentElement.classList.add("djwa-cubuk");
  }
  // Konuşan tabela, ekranın altındaki tam genişlik sabit çubukların (bizim çubuk / taslak çubuğu / sayfanın alt menüsü) üstünde durur → buton hiç örtülmez
  var root = document.documentElement; root.classList.add("djwa-acik");
  function olc() {
    var ust = innerHeight, adaylar = [];
    [].forEach.call(document.body.querySelectorAll("*"), function (e) {
      if (e.closest(".djr")) return;
      var cs = getComputedStyle(e); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
      var r = e.getBoundingClientRect();
      if (r.height > 0 && r.height < innerHeight * 0.4 && r.width >= innerWidth * 0.6 && r.bottom > innerHeight * 0.6) adaylar.push(r);
    });
    // alttan üste üst üste binen çubuklar (taslak çubuğu + üstündeki alt menü gibi) birlikte sayılır
    adaylar.sort(function (a, b) { return b.bottom - a.bottom; }).forEach(function (r) { if (r.bottom >= ust - 4) ust = Math.min(ust, r.top); });
    root.style.setProperty("--djwa-h", Math.round(innerHeight - ust) + "px");
  }
  olc(); addEventListener("resize", olc); addEventListener("load", olc); setTimeout(olc, 1500);
})();
