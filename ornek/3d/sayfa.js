/* Demo sayfası ortak başlatıcı: sahneyi kurar, saat kumandasını bağlar. */
(function () {
  "use strict";
  var hero = document.querySelector(".hero"), cv = hero && hero.querySelector("canvas"), o = window.SAHNE;
  if (!hero || !cv || !o || !window.Sahne3D) { if (hero) hero.classList.add("gl-yok"); return; }
  var kutu = document.querySelector(".saat"), inp = kutu && kutu.querySelector("input"), etiket = kutu && kutu.querySelector("b");
  var bas = kutu ? kutu.dataset.bas.split(":") : [0, 0], bit = kutu ? kutu.dataset.bit.split(":") : [0, 0];
  var d0 = +bas[0] * 60 + +bas[1], d1 = +bit[0] * 60 + +bit[1];
  function yaz(v) {
    if (!etiket) return;
    var d = Math.round(d0 + (d1 - d0) * v), s = Math.floor(d / 60) % 24, m = d % 60;
    etiket.textContent = (s < 10 ? "0" : "") + s + ":" + (m < 10 ? "0" : "") + m;
  }
  var q = new URLSearchParams(location.search);
  if (q.get("saat")) o.saat = Math.max(0, Math.min(1, parseFloat(q.get("saat")) || 0));
  o.canvas = cv; o.host = hero;
  var S = window.Sahne3D.kur(o);
  if (inp) {
    inp.value = Math.round(o.saat * 1000); yaz(o.saat);
    if (S) inp.addEventListener("input", function () { var v = inp.value / 1000; S.saatAyarla(v); yaz(v); });
  }
  window.S = S;
})();
