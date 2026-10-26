// B&B Masaj prototipleri — ortak "ÖRNEK" filigranı ve üst şerit (Dijitabela, 25 Eki 2026).
// Ödeme öncesi taslak kuralı: tüm sayfayı kaplayan çapraz Dijitabela filigranı; veriler örnektir.
(function () {
  "use strict";
  var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='420' height='260'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' transform='rotate(-28 210 130)' font-family='Arial,Helvetica,sans-serif' font-size='30' font-weight='800' fill='%23000' fill-opacity='.09' letter-spacing='4'>DİJİTABELA · ÖRNEK</text></svg>";
  var css = document.createElement("style");
  css.textContent =
    ".dj-filigran{position:fixed;inset:0;z-index:2147483000;pointer-events:none;background-image:url(\"data:image/svg+xml;utf8," + svg.replace(/"/g, "'").replace(/#/g, "%23") + "\");background-repeat:repeat}" +
    ".dj-filigran.koyu{filter:invert(1)}" +
    ".dj-serit{position:relative;z-index:2147483001;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:7px 14px;background:#16181D;color:#fff;font:600 12.5px/1.35 'Plus Jakarta Sans',system-ui,sans-serif;text-align:center}" +
    ".dj-serit b{color:#FFB000;font-weight:800}.dj-serit a{color:#FFB000;text-decoration:none;border-bottom:1px solid rgba(255,176,0,.5);white-space:nowrap}";
  document.head.appendChild(css);
  function kur() {
    var f = document.createElement("div"); f.className = "dj-filigran" + (document.documentElement.dataset.koyu ? " koyu" : ""); f.setAttribute("aria-hidden", "true");
    document.body.appendChild(f);
    if (document.documentElement.dataset.seritYok) return;
    var s = document.createElement("div"); s.className = "dj-serit";
    s.innerHTML = "<span><b>Dijitabela örnek tasarımı</b> · B&amp;B Masaj için hazırlandı · fiyat, kişi ve rakamlar örnektir</span><a href='../'>← 3 prototipe dön</a>";
    document.body.insertBefore(s, document.body.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
})();
