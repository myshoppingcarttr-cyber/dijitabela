/* Site menüsü (12 Kas 2026, Patron: "Sitemizde menü alanı nerede?")
   Tüm sayfaların üst başlığına telefonda görünen "Menü" düğmesi + açılır panel ekler.
   Masaüstünde yatay menü sayfanın kendi HTML'inde durur; bu düğme yalnız o menü gizlendiğinde görünür.
   Başlık türleri: header.ust (ana sayfa, ekspertiz), header.hdr (derlenen sayfalar), diğer <header> (vitrin sayfaları). */
(function () {
  if (window.__dmMenu) return; window.__dmMenu = 1;
  var LINKLER = [
    ["/hangi-hizmet.html", "Hizmetler"],
    ["/calismalarimiz.html", "Çalışmalarımız"],
    ["/ekibimiz.html", "Ekibimiz"],
    ["/#teklif", "Fiyatlar"],
    ["/ekspertiz.html", "Ücretsiz Ekspertiz"],
    ["/blog.html", "Blog"],
    ["/iletisim.html", "İletişim"]
  ];
  function kur() {
    var h = document.querySelector("header.ust, header.hdr") || document.querySelector("header");
    if (!h || document.getElementById("dm-panel")) return;
    var tur = h.classList.contains("ust") ? "ust" : h.classList.contains("hdr") ? "hdr" : "genel";
    var st = document.createElement("style");
    st.textContent =
      ".dm-ac{display:none;align-items:center;justify-content:center;gap:7px;min-height:44px;min-width:44px;padding:0 12px;margin-left:8px;border:1.5px solid currentColor;border-radius:10px;background:transparent;color:inherit;font:700 15px/1 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer;flex-shrink:0;-webkit-tap-highlight-color:transparent}" +
      ".dm-ac svg{width:20px;height:20px;flex:none}.dm-ac:focus-visible{outline:3px solid #FFB000;outline-offset:2px}" +
      ".dm-t-ust .dm-ac{color:#F3F1EA}.dm-t-hdr .dm-ac{color:#16181D}" +
      "@media (max-width:1180px){.dm-t-ust .dm-ac{display:inline-flex}}" +
      "@media (max-width:1100px){.dm-t-hdr .dm-ac{display:inline-flex}}" +
      ".dm-t-genel .dm-ac{display:inline-flex}" +
      "@media (max-width:600px){.dm-ac{flex-direction:column;gap:2px;min-width:48px;padding:3px 6px;margin-left:6px;font-size:10.5px;letter-spacing:.02em}.dm-ac svg{width:20px;height:20px}" +
      ".dm-t-ust .sar{gap:10px}.dm-t-ust .logo{height:30px}.dm-t-ust .sar>.dugme{padding:8px 12px;font-size:14px}" +
      ".dm-t-hdr .nav{gap:8px}.dm-t-hdr .nav>.btn{padding:9px 11px;font-size:13.5px;white-space:nowrap;margin-left:auto}.dm-t-hdr .logo{gap:8px;font-size:1.02rem}.dm-t-hdr .logo-m svg{width:30px;height:30px}}" +
      "@media (max-width:380px){.dm-t-ust .logo{height:26px}.dm-t-ust .sar>.dugme{padding:8px 9px;font-size:13px}.dm-ac{margin-left:4px;min-width:44px;padding:3px 4px}" +
      ".dm-t-hdr .nav{gap:6px}.dm-t-hdr .nav>.btn{padding:8px 8px;font-size:12.5px}.dm-t-hdr .logo{gap:6px;font-size:.95rem}.dm-t-hdr .logo-m svg{width:26px;height:26px}}" +
      ".dm-panel{position:fixed;left:0;right:0;z-index:10000;background:#111316;color:#F3F1EA;border-top:3px solid #FFB000;box-shadow:0 22px 50px rgba(0,0,0,.5);overflow:auto;overscroll-behavior:contain;padding:6px 16px 18px}" +
      ".dm-panel[hidden]{display:none}" +
      ".dm-panel .dm-ic{max-width:640px;margin:0 auto}" +
      ".dm-panel .dm-ust{display:flex;justify-content:space-between;align-items:center;min-height:48px;font:700 12px/1 'Space Mono',ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#9AA0A8}" +
      ".dm-panel .dm-kapat{min-width:44px;min-height:44px;border:0;background:transparent;color:#F3F1EA;font:400 28px/1 system-ui,sans-serif;cursor:pointer}" +
      ".dm-panel ul{list-style:none;margin:0;padding:0}" +
      ".dm-panel li a{display:flex;justify-content:space-between;align-items:center;min-height:54px;padding:0 4px;border-bottom:1px solid #2C3036;color:#F3F1EA;text-decoration:none;font:700 19px/1.2 'Plus Jakarta Sans',system-ui,sans-serif}" +
      ".dm-panel li a::after{content:'\\2192';color:#FFB000;font-weight:400}" +
      ".dm-panel li a[aria-current]{color:#FFB000}" +
      ".dm-panel li a:focus-visible{outline:3px solid #FFB000;outline-offset:-3px}" +
      ".dm-panel .dm-tel{display:flex;gap:10px;margin-top:16px}.dm-panel .dm-tel a{flex:1;display:flex;align-items:center;justify-content:center;min-height:50px;border-radius:10px;font:700 16px/1 'Plus Jakarta Sans',system-ui,sans-serif;text-decoration:none}" +
      ".dm-panel .dm-tel .a1{background:#FFB000;color:#15171A}.dm-panel .dm-tel .a2{border:1.5px solid #F3F1EA;color:#F3F1EA}";
    document.head.appendChild(st);
    h.classList.add("dm-t-" + tur);

    var yol = location.pathname.replace(/\/index\.html$/, "/");
    var p = document.createElement("nav");
    p.id = "dm-panel"; p.className = "dm-panel"; p.hidden = true; p.setAttribute("aria-label", "Site menüsü");
    p.innerHTML = '<div class="dm-ic"><div class="dm-ust"><span>Menü</span><button type="button" class="dm-kapat" aria-label="Menüyü kapat">&times;</button></div><ul>' +
      LINKLER.map(function (l) { var ak = l[0].indexOf("#") < 0 && (yol === l[0] || yol === l[0].replace(/\.html$/, "")); return '<li><a href="' + l[0] + '"' + (ak ? ' aria-current="page"' : "") + ">" + l[1] + "</a></li>"; }).join("") +
      '</ul><div class="dm-tel"><a class="a1" href="https://wa.me/905019452184" target="_blank" rel="noopener">WhatsApp</a><a class="a2" href="tel:+905019452184">Ara</a></div></div>';
    document.body.appendChild(p);

    var b = document.createElement("button");
    b.type = "button"; b.className = "dm-ac"; b.setAttribute("aria-label", "Menüyü aç"); b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "dm-panel");
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menü</span>';
    var yer = tur === "ust" ? h.querySelector(".sar") : tur === "hdr" ? h.querySelector(".nav") : h.querySelector("nav");
    (yer || h).appendChild(b);
    if (tur === "genel" && yer) { yer.style.display = "flex"; yer.style.alignItems = "center"; }

    function acik() { return !p.hidden; }
    function konum() { var r = h.getBoundingClientRect(), t = Math.max(0, Math.round(r.bottom)); if (r.bottom > innerHeight * 0.6) t = 0; p.style.top = t + "px"; p.style.maxHeight = (innerHeight - t) + "px"; }
    function ac() { konum(); p.hidden = false; b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-label", "Menüyü kapat"); var a = p.querySelector("li a"); if (a) a.focus({ preventScroll: true }); }
    function kapat(odak) { if (!acik()) return; p.hidden = true; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Menüyü aç"); if (odak) b.focus({ preventScroll: true }); }
    b.addEventListener("click", function (e) { e.stopPropagation(); acik() ? kapat(false) : ac(); });
    p.querySelector(".dm-kapat").addEventListener("click", function () { kapat(true); });
    p.addEventListener("click", function (e) { if (e.target.closest("a")) kapat(false); });
    document.addEventListener("click", function (e) { if (acik() && !p.contains(e.target) && !b.contains(e.target)) kapat(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && acik()) kapat(true); });
    addEventListener("resize", function () { if (acik()) konum(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
})();
