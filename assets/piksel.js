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
      '<button type="button" data-s="hayir" style="background:transparent;color:#fff;border:1px solid #555;border-radius:8px;padding:8px 14px;cursor:pointer;font:inherit">Reddet</button>' +
      '<button type="button" data-s="evet" style="background:#FFB000;color:#16181D;border:0;border-radius:8px;padding:8px 14px;cursor:pointer;font:inherit;font-weight:700">Kabul et</button>';
    b.addEventListener("click", function (e) { var s = e.target.getAttribute && e.target.getAttribute("data-s"); if (s) sec(s); });
    document.body.appendChild(b);
  });
})();
