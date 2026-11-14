/* Dijitabela · önizleme 1411, 3. tur · Gece sokağı: tabelada yanan ad, yağmur, far, kaydırmaya bağlı kamera, otuz saniye anlatısı.
   Kütüphane yok. Görseller yerelde üretildi (Z-Image Turbo); tabela yazısı tarayıcıda bindirilir. Hareket azaltmada durağan, ışıklı tek kare. */
(function () {
  "use strict";
  var W = window, D = document, C = W.F14 || {}, G = C.g3 || {};
  var $ = function (s, k) { return (k || D).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || D).querySelectorAll(s)); };
  var AZ = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, INCE = W.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;
  var SEK = G.sek || {}, SIRA = G.sira || Object.keys(SEK);
  var kis = function (v, a, b) { return v < a ? a : v > b ? b : v; }, ara = function (p, a, b) { return kis((p - a) / (b - a), 0, 1); };
  var yumus = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  /* ---- Dörtgene oturtma: dikdörtgen öğeyi dört köşeye (sol üst, sağ üst, sağ alt, sol alt) taşıyan matrix3d ---- */
  function oturt(el, w, h, q) {
    var x0 = q[0], y0 = q[1], x1 = q[2], y1 = q[3], x2 = q[4], y2 = q[5], x3 = q[6], y3 = q[7];
    var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, a, b, c, d, e, f, g, hh;
    if (Math.abs(dx3) < 1e-6 && Math.abs(dy3) < 1e-6) { a = x1 - x0; b = x3 - x0; c = x0; d = y1 - y0; e = y3 - y0; f = y0; g = 0; hh = 0; }
    else { var det = dx1 * dy2 - dx2 * dy1; g = (dx3 * dy2 - dx2 * dy3) / det; hh = (dx1 * dy3 - dx3 * dy1) / det; a = x1 - x0 + g * x1; b = x3 - x0 + hh * x3; c = x0; d = y1 - y0 + g * y1; e = y3 - y0 + hh * y3; f = y0; }
    el.style.width = w + "px"; el.style.height = h + "px";
    el.style.transform = "matrix3d(" + [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1].map(function (n) { return +n.toFixed(6); }).join(",") + ")";
  }
  var olcKalem = D.createElement("canvas").getContext("2d");
  function sigdir(metin, font, kal, w, h) {       // tek satır, tabela yüzeyine sığan en büyük punto
    olcKalem.font = kal + " 100px " + font; var g = olcKalem.measureText(metin || "M").width || 100;
    return Math.max(8, Math.min(h * .6, (w * .84) / g * 100));
  }

  /* ---- Tabelalı sahne: kahramanda ve kapanışta aynı bileşen ---- */
  function Sahne(kok, secenek) {
    this.kok = kok; this.sahne = $(".g-sahne", kok); this.img = $("img", this.sahne); this.sec = secenek || {};
    this.tab = D.createElement("div"); this.tab.className = "g-tabela"; this.tab.innerHTML = '<span class="g-ad"></span>';
    this.yan = D.createElement("div"); this.yan.className = "g-yansi zemin"; this.yan.innerHTML = '<span class="g-ad"></span>';
    this.isik = D.createElement("div"); this.isik.className = "g-isik";
    this.pano = D.createElement("div"); this.pano.className = "g-pano";
    this.ayna = D.createElement("div"); this.ayna.className = "g-ayna"; this.ayna.setAttribute("aria-hidden", "true"); this.sahne.insertBefore(this.ayna, this.sahne.firstChild);
    this.sahne.appendChild(this.isik); this.sahne.appendChild(this.yan); this.sahne.appendChild(this.pano); this.sahne.appendChild(this.tab);
    this.ad = ""; this.sek = null; this.s = 1; this.x = 0; this.y = 0;
  }
  Sahne.prototype.veri = function () { return SEK[this.sek] || SEK[SIRA[0]]; };
  Sahne.prototype.yerlestir = function () {      // kaplama; telefonda tabela sığsın diye gerekirse genişlik sınırlanır
    var v = this.veri(); if (!v) return;
    var Wk = this.kok.clientWidth, Hk = this.kok.clientHeight, ar = G.en / G.boy, q = v.tabela;
    var cx = (q[0] + q[2] + q[4] + q[6]) / 4, cy = (q[1] + q[3] + q[5] + q[7]) / 4, ten = (Math.max(q[2], q[4]) - Math.min(q[0], q[6])) / G.en;
    var sw = Math.max(Wk, Hk * ar); if (this.sec.sigdir !== false && sw * ten > Wk * .94) sw = Math.max(Wk, Wk * .94 / ten);
    var s = sw / G.en, sh = sw / ar, hedefY = this.sec.odakY != null ? this.sec.odakY : .34;
    var x = Math.min(0, Math.max(Wk - sw, Wk / 2 - cx * s)), y = sh <= Hk ? (this.sec.ust || 0) : Math.min(0, Math.max(Hk - sh, Hk * hedefY - cy * s));
    this.s = s; this.x = x; this.y = y; this.sw = sw; this.sh = sh;
    this.sahne.style.width = sw + "px"; this.sahne.style.height = sh + "px"; this.sahne.style.left = x + "px"; this.sahne.style.top = y + "px";
    this.kapi = [v.kapi[0] * s + x, v.kapi[1] * s + y];
    var ak = this.img && (this.img.currentSrc || this.img.src); if (ak && this.aynaK !== ak) { this.aynaK = ak; this.ayna.style.backgroundImage = "url(\"" + ak + "\")"; }
    this.tabelaCiz();
  };
  Sahne.prototype.tabelaCiz = function () {
    var v = this.veri(); if (!v) return; var s = this.s, q = v.tabela, el = this.tab, ad = this.ad || v.ornek;
    var w = Math.hypot(q[2] - q[0], q[3] - q[1]), h = Math.hypot(q[6] - q[0], q[7] - q[1]);
    var sq = q.map(function (n) { return n * s; });
    oturt(el, w, h, sq);
    if (v.pano) { this.pano.hidden = false; oturt(this.pano, w, h, (v.panoQ || q).map(function (n) { return n * s; })); } else this.pano.hidden = true;
    var font = v.font === "serif" ? 'var(--serif)' : 'var(--gov)', fontAd = v.font === "serif" ? '"Source Serif 4",Georgia,serif' : '"Plus Jakarta Sans",system-ui,sans-serif', kal = v.font === "serif" ? 500 : 700;
    var pt = sigdir(ad, fontAd, kal, w, h);
    var k = this.kok; k.style.setProperty("--g-renk", v.renk); k.style.setProperty("--g-yuz", v.yuz || "#FFF4E2"); k.style.setProperty("--g-font", font); k.style.setProperty("--g-kal", kal); k.style.setProperty("--g-ara", v.font === "serif" ? ".005em" : ".02em");
    [this.tab, this.yan].forEach(function (x) { var a = x.firstChild; a.textContent = ad; a.style.fontSize = pt.toFixed(1) + "px"; });
    // ıslak zemindeki yansıma: tabela zemin çizgisine göre aynalanır
    // ıslak asfaltta yansıma: yolun başladığı çizgiden aşağı, dikeyde uzamış (gerçek fotoğraflardaki ışık izi gibi)
    var zy = v.zemin, altY = Math.max(q[5], q[7]), mq = q.map(function (n, i) { return (i % 2 ? zy + (altY - n) * 1.5 : n) * s; });
    oturt(this.yan, w, h, mq);           // köşeler ters eşlenince yazı kendiliğinden ters döner
    // cepheye vuran ışık
    var minx = Math.min(q[0], q[6]), maxx = Math.max(q[2], q[4]), alt = Math.max(q[5], q[7]);
    var iw = (maxx - minx) * 1.5, ih = (alt - Math.min(q[1], q[3])) * 5;
    this.isik.style.left = ((minx - (maxx - minx) * .25) * s) + "px"; this.isik.style.top = ((Math.min(q[1], q[3]) - ih * .25) * s) + "px";
    this.isik.style.width = iw * s + "px"; this.isik.style.height = ih * s + "px";
  };
  Sahne.prototype.yak = function (gecikme) {     // titreyerek açılma
    var k = this.kok; if (AZ) { k.style.setProperty("--g-acik", 1); return; }
    var dizi = [[0, .04], [90, .55], [140, .08], [260, .9], [300, .2], [380, .25], [430, 1], [520, .7], [560, 1]];
    clearTimeout(this.zt); var self = this; (this.tz || []).forEach(clearTimeout); this.tz = [];
    dizi.forEach(function (a) { self.tz.push(setTimeout(function () { k.style.setProperty("--g-acik", a[1]); }, (gecikme || 0) + a[0])); });
  };
  Sahne.prototype.sektor = function (sek, ilk) {
    if (!SEK[sek] || sek === this.sek) return; var self = this, v = SEK[sek], eski = this.img;
    this.sek = sek; this.kok.setAttribute("data-sek", sek);
    if (ilk || !eski) { this.yerlestir(); return; }
    var yeni = new Image(); yeni.decoding = "async"; yeni.alt = ""; yeni.className = "yeni"; yeni.sizes = "100vw"; yeni.srcset = v.srcset; yeni.src = v.src;
    var bitti = function () { self.sahne.insertBefore(yeni, self.isik); self.yerlestir(); requestAnimationFrame(function () { yeni.classList.remove("yeni"); }); setTimeout(function () { if (eski.parentNode) eski.parentNode.removeChild(eski); }, 950); self.img = yeni; self.yak(120); };
    self.kok.style.setProperty("--g-acik", .05);
    if (yeni.decode) yeni.decode().then(bitti, bitti); else yeni.onload = bitti;
  };
  Sahne.prototype.yazAd = function (ad) { var once = this.ad; this.ad = ad; this.tabelaCiz(); if (!once && ad) this.yak(0); };

  /* ---- Yağmur: ince, eğik çizgiler; görünmüyorken durur ---- */
  function Yagmur(cv) {
    var x = cv.getContext("2d"), dam = [], cal = false, son = 0, oran = Math.min(2, W.devicePixelRatio || 1), self = this;
    function boy() { cv.width = cv.clientWidth * oran; cv.height = cv.clientHeight * oran; var n = Math.round(cv.clientWidth * cv.clientHeight / 9000); dam = []; for (var i = 0; i < n; i++) dam.push(yeni(true)); }
    function yeni(her) { return { x: Math.random() * cv.width * 1.2, y: her ? Math.random() * cv.height : -40, l: (10 + Math.random() * 18) * oran, v: (900 + Math.random() * 700) * oran, a: .08 + Math.random() * .2 }; }
    function kare(t) {
      if (!cal) return; var dt = Math.min(.05, (t - son) / 1000 || .016); son = t;
      x.clearRect(0, 0, cv.width, cv.height); x.lineWidth = oran; x.lineCap = "round";
      for (var i = 0; i < dam.length; i++) { var d = dam[i]; d.y += d.v * dt; d.x -= d.v * dt * .18; if (d.y > cv.height + 30) dam[i] = d = yeni(false);
        x.strokeStyle = "rgba(220,230,240," + d.a + ")"; x.beginPath(); x.moveTo(d.x, d.y); x.lineTo(d.x + d.l * .18, d.y - d.l); x.stroke(); }
      requestAnimationFrame(kare);
    }
    this.boy = boy; this.oyna = function (e) { if (e === cal) return; cal = e; if (e) { son = performance.now(); requestAnimationFrame(kare); } };
    boy();
  }

  /* ---- Kahraman ---- */
  var kah = $(".g-kah"), S1 = null, S2 = null;
  (function () {
    if (!kah || !SIRA.length) return;
    var yap = $(".g-yap", kah), ic = $(".g-ic", kah), tel = $(".g-tel", kah), anl = $(".g-anlat", kah), not = $(".g-not", kah), far = $(".g-far", kah), ust = $(".ust");
    S1 = new Sahne(yap, { odakY: .3 });
    var ilk = kah.getAttribute("data-sek") || SIRA[0]; S1.sektor(ilk, true); S1.kok.style.setProperty("--g-acik", AZ ? 1 : 0);
    function notYeri() { var v = S1.veri(); if (!not || !v) return; var q = v.tabela, s = S1.s; not.style.left = (Math.min(q[0], q[6]) * s + S1.x) + "px"; not.style.top = (Math.max(q[5], q[7]) * s + S1.y + 10) + "px"; }
    notYeri();
    setTimeout(function () { S1.yak(0); }, AZ ? 0 : 700);
    // form ve sektör düğmeleri
    var gir = $("#ad"), dug = $$(".g-sek button", kah), form = $("#g-form");
    function sekSec(k, kurdanGeldi) { dug.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-sek") === k); }); S1.sektor(k); if (S2) S2.sektor(k); setTimeout(notYeri, 60); if (!kurdanGeldi && W.G3KUR) W.G3KUR.esitle(null, k); telYenile(); }
    dug.forEach(function (b) { b.addEventListener("click", function () { sekSec(b.getAttribute("data-sek")); }); });
    var zt = 0;
    if (gir) gir.addEventListener("input", function () { var v = gir.value.replace(/\s+/g, " ").trim().slice(0, 34); S1.yazAd(v); if (S2) S2.yazAd(v); if (not) not.style.opacity = v ? 0 : 1; clearTimeout(zt); zt = setTimeout(function () { if (W.G3KUR) W.G3KUR.esitle(gir.value, null); telYenile(); }, 260); });
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); var sek = S1.sek; if (W.F14KUR) W.F14KUR.kur(gir.value, sek); var h = $("#kur"); if (h) h.scrollIntoView({ behavior: AZ ? "auto" : "smooth" }); });
    W.G3 = { ad: function (v) { if (gir && gir.value !== v) gir.value = v; v = (v || "").trim(); S1.yazAd(v); if (S2) S2.yazAd(v); if (not) not.style.opacity = v ? 0 : 1; telYenile(); }, sek: function (k) { sekSec(k, true); } };

    // elde telefon: ekranda müşterinin göreceği site taslağı
    var telImg = tel ? $("img[data-src]", tel) : null, ekr = tel ? $(".g-ekran", tel) : null, ifr = null, telHazir = false;
    function telYerlestir() {
      if (!tel || !telImg || !G.tel) return; var t = G.tel, Wk = yap.clientWidth, Hk = yap.clientHeight, ar = t.en / t.boy, q = t.ekran;
      var cx = (q[0] + q[2] + q[4] + q[6]) / 4, cy = (q[1] + q[3] + q[5] + q[7]) / 4;
      // telefon ekranı görünür alanın ~%74'ünü aşmasın; kalan yan boşlukları aynı fotoğrafın bulanık kopyası doldurur
      var ustB = parseFloat(getComputedStyle(D.documentElement).getPropertyValue("--ust-yuk")) || 64, gorH = Hk - ustB, ekH = (q[7] - q[1]);
      var dar = Wk <= 900, sw = Math.min(Math.max(Wk, Hk * ar), (gorH * (dar ? .56 : .74) / ekH) * t.en), s = sw / t.en, sh = sw / ar;
      var x = Math.min(Math.max(0, Wk - sw), Math.max(Math.min(0, Wk - sw), Wk * (Wk > 900 ? .64 : .5) - cx * s)), y = ustB + gorH * (dar ? .36 : .5) - cy * s;
      var mk = sw < Wk - 2 ? "linear-gradient(90deg,transparent 0,#000 22%,#000 78%,transparent 100%)" : "none";
      telImg.style.cssText = "width:" + sw + "px;height:" + sh + "px;left:" + x + "px;top:" + y + "px;object-fit:fill;-webkit-mask-image:" + mk + ";mask-image:" + mk;
      var arka = $(".arka", tel); if (arka) { arka.src = telImg.src; }
      var sq = q.map(function (n, i) { return n * s + (i % 2 ? y : x); }), w = 390, h = Math.round(390 * Math.hypot(q[6] - q[0], q[7] - q[1]) / Math.hypot(q[2] - q[0], q[3] - q[1]));
      oturt(ekr, w, h, sq); if (ifr) ifr.style.height = h + "px";
    }
    function telYenile() { if (!telHazir || !ifr || !W.G3KUR) return; ifr.srcdoc = W.G3KUR.belge(gir ? gir.value.trim() : "", S1.sek); }
    function telKur() { if (telHazir || !ekr) return; telHazir = true; ifr = D.createElement("iframe"); ifr.setAttribute("sandbox", "allow-same-origin"); ifr.setAttribute("tabindex", "-1"); ifr.setAttribute("aria-hidden", "true"); ifr.title = "Telefonda site taslağı"; ekr.appendChild(ifr); telImg.src = telImg.getAttribute("data-src"); telYerlestir(); telYenile(); }

    // yağmur ve far
    var cv = $(".g-yagmur", kah), yg = (cv && !AZ) ? new Yagmur(cv) : null, gorunur = true;
    if ("IntersectionObserver" in W) new IntersectionObserver(function (g) { gorunur = g[0].isIntersecting; if (yg) yg.oyna(gorunur && !D.hidden); }, { rootMargin: "100px" }).observe(kah); else if (yg) yg.oyna(true);
    D.addEventListener("visibilitychange", function () { if (yg) yg.oyna(gorunur && !D.hidden); });
    if (far && !AZ) (function farGec() { setTimeout(function () { if (gorunur && !D.hidden) { far.classList.remove("gec"); void far.offsetWidth; far.classList.add("gec"); } farGec(); }, 7000 + Math.random() * 7000); })();

    // imleçle hafif paralaks
    var mx = 0, my = 0, hx = 0, hy = 0, cal = false;
    if (INCE && !AZ) kah.addEventListener("pointermove", function (e) { var r = kah.getBoundingClientRect(); hx = (e.clientX - r.left) / r.width - .5; hy = (e.clientY - r.top) / Math.min(r.height, W.innerHeight) - .5; if (!cal) { cal = true; requestAnimationFrame(akis); } }, { passive: true });
    function akis() { mx += (hx - mx) * .08; my += (hy - my) * .08; uygula(); if (Math.abs(hx - mx) > .001 || Math.abs(hy - my) > .001) requestAnimationFrame(akis); else cal = false; }

    // kaydırma kamerası: kapıya yaklaş, sonra müşterinin elindeki telefona geç
    var p = 0, raf = 0;
    function olc() { raf = 0; var r = kah.getBoundingClientRect(), yol = Math.max(1, r.height - W.innerHeight); p = AZ ? 0 : kis(-r.top / yol, 0, 1); if (ust) ust.classList.toggle("seffaf", r.top > -40); if (p > .12) telKur(); uygula(); }
    function uygula() {
      var z = yumus(ara(p, 0, .62)), olcek = 1 + z * .9, k = S1.kapi || [0, 0];
      S1.sahne.style.transformOrigin = (k[0] - S1.x) + "px " + (k[1] - S1.y) + "px";
      S1.sahne.style.transform = "translate3d(" + (-mx * 14).toFixed(2) + "px," + (-my * 8).toFixed(2) + "px,0) scale(" + olcek.toFixed(4) + ")";
      S1.sahne.style.filter = p > .3 ? "blur(" + (ara(p, .3, .6) * 6).toFixed(2) + "px) brightness(" + (1 + ara(p, .3, .6) * .25).toFixed(3) + ")" : "";
      if (cv) cv.style.transform = "translate3d(" + (-mx * 26).toFixed(2) + "px,0,0)";
      var o = 1 - ara(p, .02, .2); ic.style.opacity = o; ic.style.transform = "translate3d(0," + (-(1 - o) * 40).toFixed(1) + "px,0)"; ic.style.visibility = o < .01 ? "hidden" : "visible";
      if (not) not.style.visibility = o < .5 ? "hidden" : "visible";
      if (tel) { var t = ara(p, .4, .66); tel.style.opacity = t; tel.style.visibility = t > 0 ? "visible" : "hidden"; tel.style.transform = "scale(" + (1.12 - .12 * yumus(t)).toFixed(4) + ")"; }
      if (anl) { var a = ara(p, .6, .76); anl.style.opacity = a; anl.style.transform = "translate3d(0," + ((1 - a) * 24).toFixed(1) + "px,0)"; }
    }
    W.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(olc); }, { passive: true });
    var bt = 0; W.addEventListener("resize", function () { clearTimeout(bt); bt = setTimeout(function () { S1.yerlestir(); notYeri(); telYerlestir(); if (S2) S2.yerlestir(); if (yg) yg.boy(); olc(); }, 120); });
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { S1.tabelaCiz(); if (S2) S2.tabelaCiz(); });
    olc();
  })();

  /* ---- Kapanış: aynı sokak, sizin adınız ---- */
  (function () {
    var s3 = $(".s3"); if (!s3 || !SIRA.length) return;
    S2 = new Sahne(s3, { sigdir: true, odakY: .32, ust: 0 }); S2.sektor((S1 && S1.sek) || SIRA[0], true);
    if (S1 && S1.ad) S2.yazAd(S1.ad);
    s3.style.setProperty("--g-acik", 0);
    if ("IntersectionObserver" in W) { var io = new IntersectionObserver(function (g) { if (g[0].isIntersecting) { io.disconnect(); S2.yerlestir(); S2.yak(200); } }, { threshold: .35 }); io.observe(s3); } else S2.yak(0);
    W.addEventListener("resize", function () { S2.yerlestir(); });
  })();

  /* ---- Otuz saniye: kaydırmaya bağlı dört an; telefon ekranı fotoğraftaki telefona oturur ---- */
  (function () {
    var a = $(".a3"); if (!a) return; var foto = $(".a3-foto", a), img = foto ? $("img", foto) : null, ekr = $(".a3-ekran", a), cizgi = $$(".a3-cizgi button", a), son = -1, raf = 0;
    function yer() {
      if (!img || !G.anlat) return; var t = G.anlat, Wk = foto.clientWidth, Hk = foto.clientHeight, ar = t.en / t.boy, q = t.ekran;
      var cx = (q[0] + q[2] + q[4] + q[6]) / 4, cy = (q[1] + q[3] + q[5] + q[7]) / 4, sw = Math.max(Wk, Hk * ar), s = sw / t.en, sh = sw / ar;
      var x = Math.min(0, Math.max(Wk - sw, Wk * .5 - cx * s)), y = Math.min(0, Math.max(Hk - sh, Hk * .5 - cy * s));
      img.style.cssText = "width:" + sw + "px;height:" + sh + "px;left:" + x + "px;top:" + y + "px;object-fit:fill;inset:auto";
      var sq = q.map(function (n, i) { return n * s + (i % 2 ? y : x); }), w = 360, h = Math.round(360 * Math.hypot(q[6] - q[0], q[7] - q[1]) / Math.hypot(q[2] - q[0], q[3] - q[1]));
      oturt(ekr, w, h, sq); ekr.style.borderRadius = (h * .045).toFixed(0) + "px";
    }
    function olc() {
      raf = 0; var r = a.getBoundingClientRect(), yol = Math.max(1, r.height - W.innerHeight), p = kis(-r.top / yol, 0, 1), n = Math.min(3, Math.floor(p * 4));
      a.style.setProperty("--p", p.toFixed(4));
      cizgi.forEach(function (b, i) { b.style.setProperty("--d", kis(p * 4 - i, 0, 1).toFixed(3)); });
      if (n !== son) { son = n; a.setAttribute("data-adim", n); cizgi.forEach(function (b, i) { b.setAttribute("aria-current", i === n ? "step" : "false"); }); }
    }
    if (AZ) { a.setAttribute("data-adim", 2); } else { W.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(olc); }, { passive: true }); olc(); }
    cizgi.forEach(function (b, i) { b.addEventListener("click", function () { var r = a.getBoundingClientRect(), yol = r.height - W.innerHeight; W.scrollTo({ top: W.scrollY + r.top + yol * ((i + .5) / 4), behavior: AZ ? "auto" : "smooth" }); }); });
    if (img && img.complete) yer(); else if (img) img.addEventListener("load", yer);
    yer(); W.addEventListener("resize", yer);
    // arama kutusuna harf harf yazı
    var yazi = $(".u-ara .yazi", a); if (yazi && !AZ) { var m = yazi.textContent, i = 0, z = 0; yazi.textContent = ""; new IntersectionObserver(function (g) { if (g[0].isIntersecting && !z) z = setInterval(function () { i++; yazi.textContent = m.slice(0, i); if (i >= m.length) clearInterval(z); }, 70); }).observe(a); }
  })();

  /* ---- Fotoğraflı bölümlerde yavaş paralaks ---- */
  (function () {
    var el = $$("[data-py]"); if (!el.length || AZ) return; var raf = 0;
    function olc() { raf = 0; var h = W.innerHeight; el.forEach(function (x) { var r = x.getBoundingClientRect(); if (r.bottom < -100 || r.top > h + 100) return; x.style.setProperty("--py", (((r.top + r.height / 2) - h / 2) / h).toFixed(4)); }); }
    W.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(olc); }, { passive: true }); olc();
  })();

  /* ---- Üst çubuk yüksekliği (kahraman çubuğun altına girer) ---- */
  (function () { var u = $(".ust"); if (u) D.documentElement.style.setProperty("--ust-yuk", u.offsetHeight + "px"); })();
})();
