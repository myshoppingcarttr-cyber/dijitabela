/* Dijitabela · önizleme 1411 (Fable 5.2). Kütüphane yok, dış kaynak yok. Her özellik yoksa sessizce atlanır. */
(function () {
  "use strict";
  var D = document, W = window, $ = function (s, k) { return (k || D).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || D).querySelectorAll(s)); };
  var AZ = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var C = W.F14 || {};
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function gorunce(el, fn, pay) { if (!el) return; if (!("IntersectionObserver" in W)) return fn(); var io = new IntersectionObserver(function (g) { if (g[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: pay || "300px" }); io.observe(el); }

  /* ---- Tema (kullanıcı seçimi saklanır; saklanamazsa sistem tercihi) ---- */
  (function () {
    var b = $(".tema"); if (!b) return;
    var kok = D.documentElement;
    function simdiki() { return kok.getAttribute("data-theme") || (W.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); }
    function yaz() { var t = simdiki(); b.setAttribute("aria-label", t === "dark" ? "Açık temaya geç" : "Koyu temaya geç"); b.setAttribute("aria-pressed", t === "light"); }
    b.addEventListener("click", function () { var y = simdiki() === "dark" ? "light" : "dark"; kok.setAttribute("data-theme", y); try { localStorage.setItem("f14-tema", y); } catch (e) {} yaz(); });
    yaz();
  })();

  /* ---- Mobil menü ---- */
  (function () {
    var a = $(".menu-ac"), m = $(".menu"); if (!a || !m) return;
    a.addEventListener("click", function () { var ac = m.classList.toggle("acik"); a.setAttribute("aria-expanded", ac); });
    m.addEventListener("click", function (e) { if (e.target.tagName === "A") { m.classList.remove("acik"); a.setAttribute("aria-expanded", "false"); } });
    D.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("acik")) { m.classList.remove("acik"); a.setAttribute("aria-expanded", "false"); a.focus(); } });
  })();

  /* ---- LED duvar: ziyaretçinin yazdığı ad gerçek zamanlı nokta nokta yanar (canvas 2B) ---- */
  (function () {
    var cv = $(".kah canvas"), giris = $("#ad"); if (!cv) return;
    var G = {
      A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.", C: ".###.#...##....#....#....#...#.###.", D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####",
      F: "######....#....####.#....#....#....", G: ".###.#...##....#.####...##...#.####", H: "#...##...##...#######...##...##...#", I: ".###...#....#....#....#....#...###.", J: "..###...#....#....#....#.#..#..##..",
      K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####", M: "#...###.###.#.##.#.##...##...##...#", N: "#...##...###..##.#.##..###...##...#", O: ".###.#...##...##...##...##...#.###.",
      P: "####.#...##...#####.#....#....#....", Q: ".###.#...##...##...##.#.##..#..##.#", R: "####.#...##...#####.#.#..#..#.#...#", S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..",
      U: "#...##...##...##...##...##...#.###.", V: "#...##...##...##...##...#.#.#...#..", W: "#...##...##...##.#.##.#.###.###...#", X: "#...##...#.#.#...#...#.#.#...##...#", Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
      "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####", "3": "####.....#....#.###.....#....#####.", "4": "...#...##..#.#.#..#.#####...#....#.",
      "5": "######....####.....#....##...#.###.", "6": ".###.#....#....####.#...##...#.###.", "7": "#####....#...#...#...#....#....#...", "8": ".###.#...##...#.###.#...##...#.###.", "9": ".###.#...##...#.####....#....#.###.",
      " ": "...................................", "/": "....#....#...#...#...#...#....#....", "·": ".................#.................", "-": "...............#####...............", ".": "..............................##...", "&": ".#...#.#..#.#...#...#.#.##..#..##.#", "'": "..#....#..........................."
    };
    var EK = { "İ": ["I", 0, [2]], "Ö": ["O", 0, [1, 3]], "Ü": ["U", 0, [1, 3]], "Ğ": ["G", 0, [1, 2, 3]], "Â": ["A", 0, [2]], "Î": ["I", 0, [2]], "Û": ["U", 0, [2]], "Ç": ["C", 1, [2]], "Ş": ["S", 1, [2]] };
    function sutunlar(metin) { var s = []; Array.from(metin.toLocaleUpperCase("tr")).forEach(function (ch) { var ek = EK[ch], tab = G[ek ? ek[0] : ch] || G[" "]; for (var x = 0; x < 5; x++) { var c = [ek && ek[1] === 0 && ek[2].indexOf(x) > -1 ? 1 : 0]; for (var y = 0; y < 7; y++) c.push(tab.charAt(y * 5 + x) === "#" ? 1 : 0); c.push(ek && ek[1] === 1 && ek[2].indexOf(x) > -1 ? 1 : 0); s.push(c); } s.push([0, 0, 0, 0, 0, 0, 0, 0, 0]); }); return s; }
    var VARS = "DİJİTABELA", ad = "", sut = [], cx = cv.getContext("2d"), w = 0, h = 0, p = 14, ol = 2, zemin = null, kay = 0, son = 0, gor = true, raf = 0;
    function metin() { var a = (ad || VARS).slice(0, 34); return a + "  ·  AÇIK  ·  7/24 CEVAP  ·  "; }
    function kur() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(W.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height)); cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      p = w < 600 ? 9 : w < 1100 ? 11 : 13; ol = 2;
      zemin = D.createElement("canvas"); zemin.width = cv.width; zemin.height = cv.height; var z = zemin.getContext("2d"); z.setTransform(dpr, 0, 0, dpr, 0, 0);
      z.fillStyle = "#0A0B0D"; z.fillRect(0, 0, w, h); z.fillStyle = "#1B1E24";
      for (var y = p / 2; y < h; y += p) for (var x = p / 2; x < w; x += p) { z.beginPath(); z.arc(x, y, p * 0.27, 0, 6.2832); z.fill(); }
      sut = sutunlar(metin()); ciz();
    }
    function ciz() {
      cx.drawImage(zemin, 0, 0, w, h);
      var kol = Math.ceil(w / p), ust = 3, n = sut.length * ol, bas = AZ ? -Math.round(kol * (w < 600 ? 0.04 : 0.42)) : Math.floor(kay);
      cx.fillStyle = "#FFB000"; cx.shadowColor = "#FFB000"; cx.shadowBlur = p * 0.9;
      for (var c = 0; c < kol; c++) {
        var k = ((c + bas) % n + n) % n, s = sut[Math.floor(k / ol)]; if (!s) continue;
        for (var y = 0; y < 9; y++) if (s[y]) for (var d = 0; d < ol; d++) { cx.beginPath(); cx.arc(c * p + p / 2, (ust + y * ol + d) * p + p / 2, p * 0.33, 0, 6.2832); cx.fill(); }
      }
      cx.shadowBlur = 0;
    }
    function dongu(t) { raf = 0; if (!gor) return; if (t - son > 70) { kay += 1; son = t; ciz(); } raf = requestAnimationFrame(dongu); }
    function baslat() { if (!AZ && !raf && gor) raf = requestAnimationFrame(dongu); }
    kur();
    var zt; W.addEventListener("resize", function () { clearTimeout(zt); zt = setTimeout(kur, 150); });
    if ("IntersectionObserver" in W) new IntersectionObserver(function (g) { gor = g[0].isIntersecting; baslat(); }).observe(cv);
    D.addEventListener("visibilitychange", function () { gor = !D.hidden; baslat(); });
    baslat();
    if (giris) {
      giris.addEventListener("input", function () { ad = giris.value.replace(/\s+/g, " ").trim(); sut = sutunlar(metin()); kay = AZ ? 0 : -Math.round(w / p * 0.5); ciz(); });
      var f = giris.form; if (f) f.addEventListener("submit", function (e) { e.preventDefault(); var r = $("#rontgen"); if (r) { r.scrollIntoView({ behavior: AZ ? "auto" : "smooth" }); var u = $("#r-url"); if (u) setTimeout(function () { u.focus({ preventScroll: true }); }, 500); } });
    }
    W.F14LED = { yaz: function (t) { ad = t; sut = sutunlar(metin()); ciz(); } };
  })();

  /* ---- Canlı röntgen: gerçek analiz servisi (kayıt açılmaz; yalnız okuma) ---- */
  (function () {
    var f = $("#r-form"), c = $("#r-cikti"); if (!f || !c || !C.fn) return;
    var ADIM = ["Siteniz açılıyor…", "Telefon ve WhatsApp düğmeleri aranıyor…", "Mobil görünüm kontrol ediliyor…", "Arama görünürlüğü işaretleri okunuyor…", "Eksikler önem sırasına diziliyor…"];
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var u = f.url.value.trim(); if (!u) return;
      if (!/^https?:\/\//i.test(u)) u = "https://" + u;
      var dug = f.querySelector("button"); dug.disabled = true;
      var i = 0; c.innerHTML = '<p class="ilr" aria-live="polite"><b>CANLI</b> · <span id="r-adim">' + ADIM[0] + '</span></p><div class="cub"><i id="r-cub"></i></div><p class="bos">Bu, hazır bir örnek değil; şu an sitenize gerçekten bakılıyor. Yaklaşık 20–40 saniye sürer.</p>';
      var zam = setInterval(function () { i = Math.min(i + 1, ADIM.length - 1); var a = $("#r-adim"), b = $("#r-cub"); if (a) a.textContent = ADIM[i]; if (b) b.style.width = Math.min(92, 8 + i * 21) + "%"; }, 4200);
      var kes = null, ctl = ("AbortController" in W) ? new AbortController() : null; if (ctl) kes = setTimeout(function () { ctl.abort(); }, 90000);
      fetch(C.fn, { method: "POST", headers: { "Content-Type": "application/json", apikey: C.anahtar || "" }, body: JSON.stringify({ url: u, maps: "", isletme: "", sehir: "" }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.hata) throw new Error(d.hata);
          if (d.skor == null) throw new Error((d.site && d.site.acilmadi) ? "Site açılamadı. Adresi kontrol edin." : "Bu adres ölçülemedi.");
          var alan = d.alanlar || {}, ad = d.alanAd || {}, B = (d.bulgular || []).filter(function (b) { return b.durum !== "ok"; }).sort(function (a, b) { return (b.oncelik || 0) - (a.oncelik || 0); });
          var h = '<div class="skor"><div class="halka" style="--p:' + Math.round(d.skor) + '" role="img" aria-label="Genel puan ' + Math.round(d.skor) + ' / 100"><b>' + Math.round(d.skor) + '</b></div><div class="alan">';
          Object.keys(alan).forEach(function (k) { var v = Math.round(alan[k]); h += "<div><span>" + esc(ad[k] || k) + '<em><i style="width:' + v + '%"></i></em></span><b>' + v + "</b></div>"; });
          h += "</div></div>";
          var ok = (d.bulgular || []).length - B.length;
          h += '<p class="ilr">' + esc(u.replace(/^https?:\/\//, "").replace(/\/$/, "")) + " · " + (d.bulgular || []).length + " kontrol · " + ok + " sağlam · " + B.length + " eksik ya da uyarı</p>";
          B.slice(0, 3).forEach(function (b) { h += '<div class="bulgu"><b><span class="rozet ' + (b.durum === "eksik" ? "k" : "u") + '">' + (b.durum === "eksik" ? "Eksik" : "Uyarı") + "</span>" + esc(b.ad) + "</b><small>" + esc(b.tespit) + "</small></div>"; });
          if (!B.length) h += '<div class="bulgu"><b>Dışarıdan ölçülen temel sağlam görünüyor.</b><small>Google profili ve rakip karşılaştırması tam raporda.</small></div>';
          var olc = (d.kapsam && d.kapsam.olculmeyen || []).map(function (x) { return ad[x.alan] || x.alan; });
          if (olc.length) h += '<p class="bos">Bu hızlı bakışta ölçülmeyen alanlar: ' + esc(olc.join(", ")) + ". Tam ekspertiz bunları da inceler.</p>";
          h += '<div class="dizi"><a class="dugme ana kucuk" href="' + C.kok + "ekspertiz.html?url=" + encodeURIComponent(u) + '">Tam raporu ve çözüm planını aç</a><a class="dugme kucuk" href="' + C.wa + '" rel="noopener">WhatsApp\'tan sor</a></div>';
          c.innerHTML = h;
        })
        .catch(function (x) { c.innerHTML = '<p class="hata" role="alert">Analiz tamamlanamadı: ' + esc(x && x.name === "AbortError" ? "süre doldu" : (x && x.message) || "bağlantı hatası") + '.</p><p class="bos">Adresi kontrol edip yeniden deneyin ya da tam ekspertiz sayfasını kullanın.</p><div class="dizi"><a class="dugme kucuk" href="' + C.kok + 'ekspertiz.html">Ekspertiz sayfası</a></div>'; })
        .then(function () { clearInterval(zam); clearTimeout(kes); dug.disabled = false; });
    });
  })();

  /* ---- Sektör sahnesi: çalışan demo sayfası aynı ekranda ---- */
  (function () {
    var kap = $("#sektor"); if (!kap) return;
    var dug = $$(".sekme button", kap), ek = $(".ekran", kap), yaf = $("#s-yafta", kap), ac = $("#s-ac", kap), cer = null, yuk = false;
    function sec(b, odak) {
      dug.forEach(function (x) { var s = x === b; x.setAttribute("aria-selected", s); x.tabIndex = s ? 0 : -1; });
      if (odak) b.focus();
      if (yaf) yaf.textContent = b.getAttribute("data-ad"); if (ac) ac.href = b.getAttribute("data-src");
      if (!yuk) return;
      if (!cer) { cer = D.createElement("iframe"); cer.title = "Çalışan sektör örneği"; cer.loading = "lazy"; cer.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups"); ek.appendChild(cer); cer.addEventListener("load", function () { var o = $(".ort", ek); if (o) o.hidden = true; }); }
      var o = $(".ort", ek); if (o) o.hidden = false; cer.src = b.getAttribute("data-src");
    }
    dug.forEach(function (b, i) {
      b.addEventListener("click", function () { sec(b); });
      b.addEventListener("keydown", function (e) { var y = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (!y) return; e.preventDefault(); sec(dug[(i + y + dug.length) % dug.length], true); });
    });
    $$("[data-cihaz]", kap).forEach(function (b) { b.addEventListener("click", function () { var t = b.getAttribute("data-cihaz") === "tel"; ek.classList.toggle("tel", t); $$("[data-cihaz]", kap).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); }); });
    if (W.innerWidth < 700) { ek.classList.add("tel"); $$("[data-cihaz]", kap).forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-cihaz") === "tel"); }); }
    gorunce(ek, function () { yuk = true; sec(dug.filter(function (x) { return x.getAttribute("aria-selected") === "true"; })[0] || dug[0]); }, "200px");
  })();

  /* ---- Kodla çizilen sahne (ham WebGL): görünür olunca yüklenir ---- */
  (function () {
    var t = $("#tuval"); if (!t || !C.motor) return;
    var cv = $("canvas", t), kay = $("#saat"), yaz = $("#saat-yazi"), S = null;
    function saatAd(v) { return v < 0.34 ? "Gün batımı" : v < 0.67 ? "Alacakaranlık" : "Akşam"; }
    function yukle(src, fn) { var s = D.createElement("script"); s.src = src; s.onload = fn; s.onerror = function () { t.classList.add("gl-yok"); }; D.body.appendChild(s); }
    gorunce(t, function () {
      yukle(C.motor, function () { yukle(C.sahne, function () {
        try { var o = W.SAHNE; o.canvas = cv; o.host = t; S = W.Sahne3D.kur(o); } catch (e) { t.classList.add("gl-yok"); }
        if (kay && S && S.saatAyarla) { kay.addEventListener("input", function () { var v = kay.value / 100; S.saatAyarla(v); if (yaz) yaz.textContent = saatAd(v); }); }
      }); });
    }, "250px");
  })();

  /* ---- Ayşe: gerçek ses kayıtları, tek Audio öğesi ---- */
  (function () {
    var k = $("#ayse"); if (!k) return;
    var dug = $$(".parca button", k), dal = $(".dalga", k), cub = $$(".dalga i", k), au = new Audio(), akt = null, raf = 0, durum = $("#a-durum", k);
    au.preload = "none";
    function dur() { cancelAnimationFrame(raf); if (dal) dal.classList.remove("cal"); cub.forEach(function (x, i) { x.style.height = (18 + (i * 37 % 22)) + "%"; }); dug.forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); akt = null; }
    function can() { var t = au.currentTime; cub.forEach(function (x, i) { x.style.height = (22 + Math.abs(Math.sin(t * 7 + i * 0.9) * Math.cos(t * 3.1 + i * 0.37)) * 74) + "%"; }); raf = requestAnimationFrame(can); }
    dug.forEach(function (b) {
      b.addEventListener("click", function () {
        if (akt === b) { au.pause(); dur(); if (durum) durum.textContent = "Duraklatıldı."; return; }
        dur(); akt = b; b.setAttribute("aria-pressed", "true"); au.src = b.getAttribute("data-ses");
        au.play().then(function () { if (dal) dal.classList.add("cal"); if (!AZ) can(); if (durum) durum.textContent = "Çalıyor: " + b.getAttribute("data-ad"); }).catch(function () { dur(); if (durum) durum.textContent = "Ses başlatılamadı."; });
      });
    });
    au.addEventListener("ended", function () { var i = dug.indexOf(akt); dur(); if (durum) durum.textContent = "Bitti."; if (i > -1 && i < dug.length - 1) dug[i + 1].click(); });
    dur();
  })();

  /* ---- Önce / sonra ---- */
  $$(".os").forEach(function (o) { var r = $("input", o); if (!r) return; function g() { o.style.setProperty("--x", r.value + "%"); } r.addEventListener("input", g); g(); });

  /* ---- Yapılandırıcı (fiyatlar karar belgesinden; hesap burada, saklı koşul yok) ---- */
  (function () {
    var k = $("#yapi"); if (!k || !C.paket) return;
    var kut = $$("input[type=checkbox]", k), o = $("#oneri", k), P = C.paket;
    function ciz() {
      var s = {}; kut.forEach(function (x) { s[x.value] = x.checked; });
      var n = Object.keys(s).filter(function (a) { return s[a]; }).length, p;
      if (!n) { o.innerHTML = '<p class="et">Öneri</p><h3>Derdinizi işaretleyin.</h3><p class="soft">Soldaki kutulardan size uyanları seçin; hangi paketin neden uygun olduğunu ve ne ödeyeceğinizi burada görürsünüz.</p>'; return; }
      p = s.ozel ? P.ozel : s.cok ? P.standart : (s.site || s.aylik) ? P.giris : P.vitrin;
      var h = '<p class="et">Size uyan</p><h3>' + esc(p.ad) + '</h3><div class="fiy">' + esc(p.fiyat) + "<small>" + esc(p.birim) + "</small></div>";
      if (p.ek) h += "<p><b>" + esc(p.ek) + "</b></p>";
      h += "<ul>" + p.icerik.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      if (s.ozel && n > 1) h += '<p class="soft">İşaretlediğiniz diğer ihtiyaçlar teklifin içine yazılır; ayrı ayrı ücretlendirilmez.</p>';
      if (!s.ozel && s.google && p !== P.vitrin) h += '<p class="soft">Google profili düzenlemesi kurulumun içindedir; ayrıca ücret alınmaz.</p>';
      h += '<p class="kdv">' + esc(p.not) + '</p><div class="dizi"><a class="dugme ana" href="' + C.wa + "?text=" + encodeURIComponent("Merhaba, sitenizdeki önerilen paket: " + p.ad + ". Bilgi almak istiyorum.") + '" rel="noopener">WhatsApp\'tan yazın</a><a class="dugme" href="tel:' + C.telHam + '">' + esc(C.tel) + "</a></div>";
      o.innerHTML = h;
    }
    kut.forEach(function (x) { x.addEventListener("change", ciz); }); ciz();
  })();

  /* ---- Yapay zekâ bizi nasıl okuyor: canlı llms.txt ---- */
  (function () {
    var k = $("#llms"); if (!k) return;
    gorunce(k, function () { fetch(C.kok + "llms.txt").then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) { k.textContent = t.slice(0, 2200) + (t.length > 2200 ? "\n…" : ""); }).catch(function () { k.textContent = "Dosya şu an okunamadı. Adres: dijitabela.com/llms.txt"; }); });
  })();
})();
