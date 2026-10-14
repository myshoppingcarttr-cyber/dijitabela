// Dijitabela premium prototip · ortak davranış (dil, açık/kapalı rozeti, kaydırma animasyonu, WhatsApp)
(function () {
  var I = window.ISL || {};
  window.waAc = function (metin) {
    // İşletme numarası henüz yoksa (şablon önizlemesi) mesaj, gideceği biçimiyle ekranda gösterilir
    if (!I.wa) {
      var k = document.querySelector(".wa-onizleme") || document.body.appendChild(document.createElement("div"));
      k.className = "wa-onizleme"; k.setAttribute("role", "dialog");
      k.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);width:min(92vw,440px);z-index:2147483100;background:#0b141a;color:#e9edef;border-radius:16px;padding:16px;box-shadow:0 20px 50px -10px rgba(0,0,0,.6);font:500 .92rem/1.45 system-ui,sans-serif";
      k.innerHTML = '<b style="display:block;color:#25d366">Yayında bu mesaj işletmenin WhatsApp&#39;ına gider</b><pre style="white-space:pre-wrap;font:inherit;background:#005c4b;border-radius:10px;padding:10px;margin:8px 0;max-height:40vh;overflow:auto"></pre><button type="button" style="background:transparent;color:#e9edef;border:1px solid #3b4a54;border-radius:10px;padding:10px 14px;min-height:44px;cursor:pointer;font:700 .9rem system-ui">Kapat</button>';
      k.querySelector("pre").textContent = metin; k.querySelector("button").onclick = function () { k.remove(); };
      return;
    }
    window.open("https://wa.me/" + I.wa + "?text=" + encodeURIComponent(metin), "_blank");
  };
  // Açık/kapalı rozeti (saat metninden kaba çözümleme: "Pzt–Cum 09:00–20:00 · Cmt ...")
  function acikMi() {
    if (!I.saat) return null;
    var g = new Date(), gun = g.getDay(), dk = g.getHours() * 60 + g.getMinutes();
    if (/7\/24|24 saat/i.test(I.saat)) return true;
    var adlar = { Paz: 0, Pzt: 1, Sal: 2, Çar: 3, Per: 4, Cum: 5, Cmt: 6 }, parcalar = I.saat.split("·");
    for (var p of parcalar) {
      var m = p.match(/(Paz|Pzt|Sal|Çar|Per|Cum|Cmt)(?:\s*[–-]\s*(Paz|Pzt|Sal|Çar|Per|Cum|Cmt))?\s+(\d\d):(\d\d)\s*[–-]\s*(\d\d):(\d\d)/);
      if (!m) continue;
      var a = adlar[m[1]], b = m[2] ? adlar[m[2]] : a, ic = a <= b ? gun >= a && gun <= b : gun >= a || gun <= b;
      if (ic) { var s1 = +m[3] * 60 + +m[4], s2 = +m[5] * 60 + +m[6]; return dk >= s1 && dk < s2; }
    }
    return false;
  }
  document.addEventListener("DOMContentLoaded", function () {
    var r = document.querySelector("[data-acik]"), d = acikMi();
    if (r && d !== null) { r.classList.toggle("kapali", !d); r.querySelector("span").textContent = d ? (r.dataset.acik || "Şu an açık") : (r.dataset.kapali || "Şu an kapalı"); }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ok"); io.unobserve(e.target); } }); }, { threshold: .12 });
    document.querySelectorAll(".gor").forEach(function (e) { io.observe(e); });
    // Dil
    var S = window.SOZLUK || {}, kayit = "tr";
    try { kayit = localStorage.getItem("dil") || "tr"; } catch (e) {}
    function dil(k) {
      document.querySelectorAll("[data-t]").forEach(function (e) {
        if (!e.dataset.tr) e.dataset.tr = e.innerHTML;
        var c = S[k] && S[k][e.dataset.t]; e.innerHTML = k === "tr" || !c ? e.dataset.tr : c;
      });
      document.querySelectorAll(".dil button").forEach(function (b) { b.classList.toggle("on", b.dataset.d === k); });
      document.documentElement.lang = k; try { localStorage.setItem("dil", k); } catch (e) {}
      window.DIL = k; document.dispatchEvent(new Event("dil"));
    }
    document.querySelectorAll(".dil button").forEach(function (b) { b.onclick = function () { dil(b.dataset.d); }; });
    dil(S[kayit] || kayit === "tr" ? kayit : "tr");
  });
})();
