// Meta Pixel — yalnızca ziyaretçi "Kabul et" derse yüklenir (KVKK açık rıza). Seçim bu tarayıcıda saklanır.
// Olay göndermek için: window.dtOlay("Lead") · window.dtOlay("ViewContent", { content_name: "..." })
(function () {
  var PIKSEL = "3285759788480155", ANAHTAR = "dt-cerez-izni";
  var izin = null; try { izin = localStorage.getItem(ANAHTAR); } catch (e) {}
  var bekleyen = [];
  window.dtOlay = function (ad, veri) { if (window.fbq) window.fbq("track", ad, veri || {}); else if (izin !== "hayir") bekleyen.push([ad, veri]); };

  function yukle() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIKSEL); window.fbq("track", "PageView");
    bekleyen.forEach(function (o) { window.fbq("track", o[0], o[1] || {}); }); bekleyen = [];
  }
  function sec(deger) { izin = deger; try { localStorage.setItem(ANAHTAR, deger); } catch (e) {} var b = document.getElementById("dt-cerez"); if (b) b.remove(); if (deger === "evet") yukle(); else bekleyen = []; }

  if (izin === "evet") return yukle();
  if (izin === "hayir") return;
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.createElement("div"); b.id = "dt-cerez";
    b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Çerez tercihi");
    b.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#16181D;color:#fff;border:1px solid #2C3038;border-radius:12px;padding:14px 16px;font:14px/1.45 'Plus Jakarta Sans',system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35);display:flex;flex-wrap:wrap;gap:10px;align-items:center";
    b.innerHTML = '<span style="flex:1 1 260px">Reklamlarımızın işe yarayıp yaramadığını ölçmek için Meta (Facebook/Instagram) çerezi kullanmak istiyoruz. Ayrıntılar: <a href="gizlilik.html#cerezler" style="color:#FFB000">gizlilik politikası</a>.</span>' +
      '<button type="button" data-s="hayir" style="background:#16181D;color:#fff;border:1.5px solid #fff;border-radius:8px;cursor:pointer;font:inherit;font-weight:700;padding:8px 14px">Reddet</button>' +
      '<button type="button" data-s="evet" style="background:#16181D;color:#fff;border:1.5px solid #fff;border-radius:8px;cursor:pointer;font:inherit;font-weight:700;padding:8px 14px">Kabul et</button>';
    // 7 Kas (iPhone 15 Pro Max testi): telefonda (<=768px) alttaki büyük bant ekranın ~1/4'ünü kaplıyor, ilk ekran düğmelerinin
    // ve Safari'nin alt çubuğunun üstüne biniyordu. Telefonda kompakt bant (12 Kas'tan beri ALTTA, aşağıya bakın) (düğmeler ilk ekranın altında kalır),
    // çentik/ada için safe-area payı alır. Metin ve iki düğme aynen kalır. Masaüstü yukarıdaki gibi değişmez.
    if (window.matchMedia && matchMedia("(max-width:768px)").matches) {
      b.style.cssText = "position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:9999;background:#16181D;color:#fff;border:1px solid #2C3038;border-radius:10px;padding:8px 10px;font:12.5px/1.35 'Plus Jakarta Sans',system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.4);display:flex;gap:8px;align-items:center";
      b.innerHTML = '<span style="flex:1 1 auto;min-width:0">Reklam ölçümü için Meta (Facebook/Instagram) çerezi kullanmak istiyoruz. <a href="gizlilik.html#cerezler" style="color:#FFB000">Gizlilik politikası</a>.</span>' +
        '<span style="display:flex;flex-direction:column;gap:6px;flex:0 0 auto">' +
        '<button type="button" data-s="evet" style="background:#16181D;color:#fff;border:1.5px solid #fff;border-radius:8px;cursor:pointer;font:inherit;font-weight:700;padding:0 12px;min-height:40px">Kabul et</button>' +
        '<button type="button" data-s="hayir" style="background:#16181D;color:#fff;border:1.5px solid #fff;border-radius:8px;cursor:pointer;font:inherit;font-weight:700;padding:0 12px;min-height:40px">Reddet</button></span>';
    }
    b.addEventListener("click", function (e) { var s = e.target.getAttribute && e.target.getAttribute("data-s"); if (s) sec(s); });
    document.body.appendChild(b);
    // 12 Kas (Patron: bant menüyü örtüyordu): telefonda bant ALTTA. Sayfanın alttaki geniş sabit çubuğu (WhatsApp/randevu barı vb.) varsa onun üstüne oturur;
    // bant açıkken sayfa sonuna bant yüksekliği kadar boşluk eklenir ki son içerik altında kalmasın. Karar verilince boşluk geri alınır.
    if (window.matchMedia && matchMedia("(max-width:768px)").matches) {
      var pb = document.body.style.paddingBottom, yerlestir = function () {
        if (!b.isConnected) return;
        var alt = 0; document.querySelectorAll("body *").forEach(function (el) {
          if (el === b || b.contains(el)) return; var cs = getComputedStyle(el); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
          var r = el.getBoundingClientRect(); if (r.width >= innerWidth * 0.6 && r.height > 0 && r.height < innerHeight * 0.4 && r.bottom >= innerHeight - 4) alt = Math.max(alt, innerHeight - r.top);
        });
        b.style.bottom = "calc(" + (8 + alt) + "px + env(safe-area-inset-bottom,0px))";
        document.body.style.paddingBottom = (b.offsetHeight + alt + 16) + "px";
      };
      yerlestir(); setTimeout(yerlestir, 600); setTimeout(yerlestir, 2000); addEventListener("resize", yerlestir);
      new MutationObserver(function () { if (!b.isConnected) document.body.style.paddingBottom = pb; }).observe(document.body, { childList: true });
    }
  });
})();
