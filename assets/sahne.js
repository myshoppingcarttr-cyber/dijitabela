// ===== Ortak kaydırmalı sahne motoru (sektör, ekspertiz, hakkımızda sayfaları) =====
// Bölüm: <section class="hk ss" data-ss='{...}'> · her adım bir .hk-adim · sahne katmanları .hk-kat[data-k]
// Ayar: { adim:[{kat, led, gece, poz, cip:{t,renk,max}, musteri, isik}], kar:{tip:"usta"|"yeni", ad, W, k:[[x,w,h]]} }
(function () {
  "use strict";
  var az = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var kes = function (x) { return Math.max(0, Math.min(1, x)); };
  var yum = function (x) { x = kes(x); return x * x * (3 - 2 * x); };
  var ara = function (a, b, p) { return a + (b - a) * p; };
  var W = 572, H = 1024;

  [].slice.call(document.querySelectorAll(".ss")).forEach(function (bol) {
    var A; try { A = JSON.parse(bol.dataset.ss); } catch (e) { return; }
    var sahne = bol.querySelector(".hk-sahne"), katlar = [].slice.call(sahne.querySelectorAll(".hk-kat"));
    var adimlar = [].slice.call(bol.querySelectorAll(".hk-adim")), n = adimlar.length;
    var cubuk = bol.querySelector(".hk-cubuk i"), gece = sahne.querySelector(".ss-gece"), cip = sahne.querySelector(".hk-cip");
    var cipYazi = cip && cip.querySelector("span"), cipSayi = cip && cip.querySelector("b");
    var isiklar = [].slice.call(sahne.querySelectorAll(".ss-isik")), kar = sahne.querySelector(".hk-usta");
    var cv = sahne.querySelector(".hk-led"), ctx = cv && cv.getContext("2d");
    if (az) bol.classList.add("durgun");

    // Karakter pozları → dosya ve ölçü
    var POZ = A.kar.tip === "usta" ? { normal: [4, 4], dert: [1, 2], mutlu: [5, 6], telefon: [8, 7], konus: [4, 6] } : { normal: [4, 4], dert: [1, 2], mutlu: [5, 6], telefon: [8, 7], konus: [6, 6] };
    function karakter(poz, t, x, zemin) {
      var ps = POZ[poz] || POZ.normal, no = ps[Math.floor(t / 420) % 2], src = "assets/img/sahne/" + A.kar.ad + "-" + no + ".webp";
      if (kar.getAttribute("src") !== src) kar.setAttribute("src", src);
      var w, h, sol;
      if (A.kar.tip === "usta") { var U = [[193, 380], [193, 380], [193, 380], [193, 380], [196, 382], [278, 382], [209, 382], [209, 382]][no - 1]; w = U[0] * .9; h = U[1] * .9; sol = x - w / 2; }
      else { var k = A.kar.k[no - 1], o = 342 / 318; w = k[1] * o; h = k[2] * o; sol = x - ((no - 1) % 4 * A.kar.W / 4 + A.kar.W / 8 - k[0]) * o; }
      kar.style.left = (sol / W * 100) + "%"; kar.style.top = ((zemin - h) / H * 100) + "%"; kar.style.width = (w / W * 100) + "%";
    }

    // LED
    var yazi = null, kol = [], yT = 0;
    function led(t, parlak, an) {
      if (!ctx) return;
      if (t !== yazi) { yazi = t; kol = t ? window.LED.sutunlar(t) : []; yT = an; }
      var w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1); if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      var S = 44, R = 15, ax = w / S, ay = h / R, r = Math.min(ax, ay) * .36, m = kol.length, sigar = m <= S - 2, kay = sigar || az ? 0 : Math.floor((an - yT) / 85) % (m + S);
      for (var x = 0; x < S; x++) for (var y = 0; y < R; y++) {
        var yan = false; if (y >= 3 && y < 12) { var i = sigar || az ? x - Math.floor((S - m) / 2) : x - S + kay; yan = !!(kol[i] && kol[i][y - 3]); }
        ctx.fillStyle = yan ? (((x * 7 + y * 3) % 10) / 10 > parlak ? "#5A4310" : "#FFB000") : "#23262C";
        ctx.beginPath(); ctx.arc(x * ax + ax / 2, y * ay + ay / 2, r, 0, 6.2832); ctx.fill();
      }
    }

    // Müşteriler (son adımda kapıdan girer)
    var yk = sahne.querySelector(".hk-yayalar"), YAYA = [];
    if (yk && A.adim.some(function (a) { return a.musteri; })) YAYA = [[1, 0, -90, 1, "YENİ · GOOGLE"], [3, .2, 660, -1, "ESKİ MÜŞTERİ"], [2, .4, -90, 1, "YENİ · GOOGLE"]].map(function (a) {
      var d = document.createElement("div"); d.className = "hk-yaya"; var i1 = new Image(), i2 = new Image(); i1.alt = i2.alt = "";
      i1.src = "assets/img/sahne/yaya-" + a[0] + ".webp"; i2.src = "assets/img/sahne/yaya-" + (a[0] + 4) + ".webp";
      var e = document.createElement("span"); e.textContent = a[4]; if (a[4][0] === "Y") e.className = "yeni";
      d.appendChild(i1); d.appendChild(i2); d.appendChild(e); yk.appendChild(d); return { el: d, i1: i1, i2: i2, bas: a[1], x0: a[2], yon: a[3] };
    });

    function kur(an) {
      var r = bol.getBoundingClientRect(), boy = bol.offsetHeight - innerHeight;
      var p = az ? .999 : kes(-r.top / Math.max(1, boy)), f = p * n, i = Math.min(n - 1, Math.floor(f)), ic = f - i, a = A.adim[i], onceki = A.adim[Math.max(0, i - 1)];
      adimlar.forEach(function (el, j) { el.classList.toggle("aktif", j === i); });
      if (cubuk) cubuk.style.transform = "scaleX(" + p + ")";
      katlar.forEach(function (k) { k.style.opacity = +k.dataset.k === (a.kat || 0) ? 1 : 0; });
      if (gece) gece.style.opacity = ara(onceki.gece || 0, a.gece || 0, yum(ic / .3)) ;
      led(a.led || "", yum(ic / .25) * (a.led ? 1 : 0) + (a.led && onceki.led ? 1 : 0), an);
      // Işıklı noktalar (ekspertiz alanları)
      isiklar.forEach(function (el) { var s = +el.dataset.adim; el.classList.toggle("yan", s <= i && (a.isikHepsi || s === i)); });
      // Çip
      if (cip) { var c = a.cip; cip.style.opacity = c ? yum(ic / .12) : 0; if (c) { cipYazi.textContent = c.t; cip.dataset.renk = c.renk || ""; cipSayi.textContent = Math.max(1, Math.round(kes(ic / .8) * c.max)); } }
      // Karakter
      if (kar) { var icMi = katlar[a.kat || 0] && katlar[a.kat || 0].dataset.ic; karakter(a.poz || "normal", an, icMi ? 175 : 190, icMi ? 720 : 742); kar.style.opacity = 1; }
      // Müşteriler
      var mp = a.musteri ? kes(ic / .85) : 0;
      YAYA.forEach(function (y) {
        var q = kes((mp - y.bas) / .45); if (q <= 0) { y.el.style.opacity = 0; return; }
        var x = ara(y.x0, 425, Math.min(1, q * 1.25)), vardi = q * 1.25 >= 1, ad = Math.abs(x - y.x0) / 26, ikinci = !vardi && Math.floor(ad) % 2 === 1;
        y.i1.style.display = ikinci ? "none" : ""; y.i2.style.display = ikinci ? "" : "none";
        y.el.style.opacity = vardi ? 1 - kes((q * 1.25 - 1) / .25) : 1; y.el.style.left = ((x - 62) / W * 100) + "%"; y.el.style.top = ((690 - 257) / H * 100) + "%";
        y.el.style.transform = "scaleX(" + y.yon + ")"; y.el.querySelector("span").style.transform = "translateX(-50%) scaleX(" + y.yon + ")";
      });
    }
    function dongu(an) { if (!document.hidden) { var r = bol.getBoundingClientRect(); if (r.bottom > -100 && r.top < innerHeight + 100) kur(an); } requestAnimationFrame(dongu); }
    kur(0); requestAnimationFrame(dongu);
  });

  // ===== Hakkımızda: tabelanın hikâyesi =====
  var tbb = document.querySelector(".tb");
  if (tbb) (function () {
    if (az) { tbb.classList.add("durgun"); }
    var yazilar = tbb.dataset.yazilar.split("|"), cv = tbb.querySelector("canvas"), ctx = cv.getContext("2d");
    var adim = [].slice.call(tbb.querySelectorAll(".tb-adim")), don = [].slice.call(tbb.querySelectorAll(".tb-donem span")), son = -1, kol = [];
    function ciz(i) {
      var w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1); if (!w) return;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var R = 11, a = h / R, S = Math.floor(w / a), m = kol.length, bas = Math.floor((S - m) / 2);
      // dönemlere göre renk: levha (sıcak kahve), neon (pembe), pano (beyaz), LED ve Google (kehribar)
      var renk = ["#C98B4A", "#FF5FA2", "#F4F3EF", "#FFB000", "#FFB000"][i];
      ctx.clearRect(0, 0, w, h);
      for (var x = 0; x < S; x++) for (var y = 0; y < R; y++) {
        var c = kol[x - bas], yan = y >= 1 && y < 10 && c && c[y - 1];
        ctx.fillStyle = yan ? renk : "#262A31"; ctx.beginPath(); ctx.arc(x * a + a / 2, y * a + a / 2, a * .36, 0, 6.2832); ctx.fill();
      }
    }
    function kur() {
      var r = tbb.getBoundingClientRect(), p = az ? .99 : kes(-r.top / Math.max(1, tbb.offsetHeight - innerHeight)), i = Math.min(yazilar.length - 1, Math.floor(p * yazilar.length));
      if (i === son) return; son = i; kol = window.LED.sutunlar(yazilar[i]);
      adim.forEach(function (el, k) { el.classList.toggle("aktif", k === i); }); don.forEach(function (el, k) { el.classList.toggle("aktif", k === i); });
      ciz(i);
    }
    addEventListener("scroll", kur, { passive: true }); addEventListener("resize", function () { son = -1; kur(); }); kur();
  })();

  // ===== Blog: okuma çubuğu + içindekiler (aktif başlık işaretlenir) =====
  var govde = document.querySelector(".b-govde");
  if (govde) (function () {
    var bar = document.createElement("div"); bar.className = "okuma"; bar.innerHTML = "<i></i>"; document.body.appendChild(bar);
    var h2 = [].slice.call(govde.querySelectorAll("h2")), ic = document.getElementById("b-icindekiler");
    if (ic && h2.length > 2) {
      h2.forEach(function (h, i) { h.id = h.id || "b" + (i + 1); });
      ic.innerHTML = '<p class="v-etiket">İçindekiler</p><ol>' + h2.map(function (h) { return '<li><a href="#' + h.id + '">' + h.textContent + "</a></li>"; }).join("") + "</ol>";
      ic.hidden = false;
    }
    var bag = ic ? [].slice.call(ic.querySelectorAll("a")) : [];
    function guncelle() {
      var r = govde.getBoundingClientRect(), p = kes(-r.top / Math.max(1, r.height - innerHeight * .6));
      bar.firstChild.style.transform = "scaleX(" + p + ")";
      var aktif = 0; h2.forEach(function (h, i) { if (h.getBoundingClientRect().top < innerHeight * .35) aktif = i; });
      bag.forEach(function (a, i) { a.classList.toggle("aktif", i === aktif); });
    }
    addEventListener("scroll", guncelle, { passive: true }); guncelle();
  })();
})();
