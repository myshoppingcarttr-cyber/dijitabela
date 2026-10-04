// Dijitabela premium prototip · ortak davranış (dil, açık/kapalı rozeti, kaydırma animasyonu, WhatsApp)
(function () {
  var I = window.ISL || {};
  window.waAc = function (metin) { window.open("https://wa.me/" + (I.wa || "") + "?text=" + encodeURIComponent(metin), "_blank"); };
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
