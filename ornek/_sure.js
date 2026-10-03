// Süreli teklif: sayfanın üstünde geri sayım şeridi; süre dolunca sayfa kapanır (asıl kapatma yayından kaldırmadır, bu ek önlem).
(function () {
  var s = document.currentScript, bitis = Date.parse(s.getAttribute("data-bitis"));
  function kapat() { document.documentElement.innerHTML = '<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Teklif süresi doldu</title></head><body style="margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#f5f4f1;text-align:center;padding:20px"><div><h1 style="font-size:1.5rem">Bu teklifin süresi doldu</h1><p style="color:#5f6168">Önizleme 7 gün geçerliydi. Yeniden görmek için bize yazın.</p><a href="https://wa.me/905533925477" style="display:inline-block;background:#25d366;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">WhatsApp\'tan yazın</a></div></body>'; }
  if (Date.now() > bitis) { kapat(); return; }
  var gun = new Date(bitis).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long", timeZone: "Europe/Istanbul" });
  function yaz() {
    var k = bitis - Date.now(); if (k <= 0) return kapat();
    var g = Math.floor(k / 864e5), sa = Math.floor(k % 864e5 / 36e5);
    b.innerHTML = "⏳ Bu teklif ve size özel önizleme <b>" + gun + " 23:59</b>'a kadar geçerlidir · <b>" + (g ? g + " gün " : "") + sa + " saat</b> kaldı";
  }
  var b = document.createElement("div");
  b.style.cssText = "position:relative;z-index:99999;background:#16171a;color:#fff;font:600 13px/1.4 system-ui,sans-serif;text-align:center;padding:7px 12px";
  function ekle() { document.body.insertBefore(b, document.body.firstChild); yaz(); setInterval(yaz, 60000); }
  document.body ? ekle() : document.addEventListener("DOMContentLoaded", ekle);
})();
