/* Dijitabela · önizleme 1411, 2. tur (Fable 5.2). Kütüphane yok, dış kaynak yok. Her özellik, öğesi sayfada yoksa sessizce atlanır.
   Kahraman tabelası: led.js · Canlı kurulum: kur.js · Kod sahnesi: motor.js + sahne.js (görünür olunca yüklenir). */
(function () {
  "use strict";
  var D = document, W = window, $ = function (s, k) { return (k || D).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || D).querySelectorAll(s)); };
  var AZ = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, INCE = W.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;
  var C = W.F14 || {};
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  function gorunce(el, fn, pay) { if (!el) return; if (!("IntersectionObserver" in W)) return fn(); var io = new IntersectionObserver(function (g) { if (g[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: pay || "300px" }); io.observe(el); }
  function say(el, hedef, sure, bicim) { if (!el) return; if (AZ) { el.textContent = bicim ? bicim(hedef) : hedef; return; } var bas = parseFloat(el.getAttribute("data-v")) || 0, t0 = performance.now(); el.setAttribute("data-v", hedef); (function k(t) { var p = Math.min(1, (t - t0) / sure), e = 1 - Math.pow(1 - p, 3), v = bas + (hedef - bas) * e; el.textContent = bicim ? bicim(v) : Math.round(v); if (p < 1) requestAnimationFrame(k); })(t0); }

  /* ---- Tema ---- */
  (function () {
    var b = $(".tema"); if (!b) return; var kok = D.documentElement;
    function simdiki() { return kok.getAttribute("data-theme") || (W.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); }
    function yaz() { var t = simdiki(); b.setAttribute("aria-label", t === "dark" ? "Açık temaya geç" : "Koyu temaya geç"); b.setAttribute("aria-pressed", t === "light"); }
    b.addEventListener("click", function () { var y = simdiki() === "dark" ? "light" : "dark"; kok.setAttribute("data-theme", y); try { localStorage.setItem("f14-tema", y); } catch (e) {} yaz(); W.dispatchEvent(new Event("f14-tema")); });
    yaz();
  })();

  /* ---- Mobil menü ---- */
  (function () {
    var a = $(".menu-ac"), m = $(".menu"); if (!a || !m) return;
    a.addEventListener("click", function () { var ac = m.classList.toggle("acik"); a.setAttribute("aria-expanded", ac); });
    m.addEventListener("click", function (e) { if (e.target.tagName === "A") { m.classList.remove("acik"); a.setAttribute("aria-expanded", "false"); } });
    D.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("acik")) { m.classList.remove("acik"); a.setAttribute("aria-expanded", "false"); a.focus(); } });
  })();

  /* ---- Görünüme girişte sıralı belirme (kardeşler arasında gecikme) ---- */
  (function () {
    var el = $$(".gir"); if (!el.length) return;
    if (AZ || !("IntersectionObserver" in W)) { el.forEach(function (x) { x.classList.add("gel"); }); return; }
    var io = new IntersectionObserver(function (g) { g.forEach(function (k) { if (!k.isIntersecting) return; var x = k.target, kar = x.parentNode ? Array.prototype.filter.call(x.parentNode.children, function (c) { return c.classList.contains("gir"); }) : [x]; x.style.setProperty("--i", Math.min(6, Math.max(0, kar.indexOf(x)))); x.classList.add("gel"); io.unobserve(x); }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    el.forEach(function (x) { io.observe(x); });
  })();

  /* ---- İmleç: manyetik düğmeler ve ışık takip eden kartlar (yalnız fare; dokunmatikte yok) ---- */
  if (INCE && !AZ) {
    $$(".mig").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    D.addEventListener("pointermove", function (e) { var k = e.target && e.target.closest ? e.target.closest(".isik") : null; if (!k) return; var r = k.getBoundingClientRect(); k.style.setProperty("--mx", (e.clientX - r.left) + "px"); k.style.setProperty("--my", (e.clientY - r.top) + "px"); }, { passive: true });
  }

  /* ---- Kahraman formu: ad + sektör → canlı kurulum ---- */
  (function () {
    var f = $("#k-form"); if (!f) return; var sek = $("#sek");
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var hedef = $("#kur"); if (!hedef) return;
      if (W.F14KUR) W.F14KUR.kur(f.ad.value, sek ? sek.value : null);
      hedef.scrollIntoView({ behavior: AZ ? "auto" : "smooth" });
      if (!f.ad.value.trim()) setTimeout(function () { var g = $("#k-ad"); if (g) g.focus({ preventScroll: true }); }, 700);
    });
    if (sek) sek.addEventListener("change", function () { var r = $('#kur input[name="k-sek"][value="' + sek.value + '"]'); if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); } });
  })();

  /* ---- Anlatı: kaydırmaya bağlı dört sahne (hareket azaltmada dört durağan ekran) ---- */
  (function () {
    var k = $(".hik"); if (!k || AZ) return;
    k.classList.add("canli"); var raf = 0, son = -1;
    function olc() { raf = 0; var r = k.getBoundingClientRect(), yol = Math.max(1, r.height - W.innerHeight), p = Math.max(0, Math.min(1, -r.top / yol)), a = Math.min(3, Math.floor(p * 4)); k.style.setProperty("--p", p.toFixed(4)); if (a !== son) { son = a; k.setAttribute("data-adim", a); } }
    W.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(olc); }, { passive: true }); W.addEventListener("resize", olc); olc();
    $$(".hik-adim li", k).forEach(function (li, i) { li.addEventListener("click", function () { var r = k.getBoundingClientRect(), yol = r.height - W.innerHeight; W.scrollTo({ top: W.scrollY + r.top + yol * ((i + 0.5) / 4), behavior: "smooth" }); }); });
  })();

  /* ---- Canlı röntgen: gerçek analiz servisi (kayıt açılmaz; yalnız okuma) ---- */
  (function () {
    var f = $("#r-form"), c = $("#r-cikti"); if (!f || !c || !C.fn) return;
    var ASAMA = [[0, "Siteniz açılıyor"], [5, "Telefon, WhatsApp ve yol tarifi düğmeleri aranıyor"], [12, "Telefon görünümü ve hız işaretleri okunuyor"], [20, "Arama motorlarının göreceği bilgiler kontrol ediliyor"], [30, "Yapay zekâ asistanlarının okuyacağı veriler aranıyor"], [40, "Eksikler önem sırasına diziliyor"], [60, "Site yavaş cevap veriyor; biraz daha bekleniyor"]];
    var BILGI = ["Telefon numaranız sitede tıklanabilir değilse müşteri numarayı elle yazmak zorunda kalır.", "Çalışma saatleri sitede ve Google kaydında farklıysa müşteri hangisine inanacağını bilemez.", "Arama motorları ve sohbet asistanları, adresinizi ve saatlerinizi sitedeki yapısal veriden okur.", "Bu sırada sitenize gerçek bir tarayıcı gibi bakılıyor; hazır bir örnek gösterilmiyor."];
    var calisiyor = false;
    function bekleme(u) {
      c.className = "cikti cam tara";
      c.innerHTML = '<div class="r-tara"><div class="r-tel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></div><div><p class="ilr"><b>CANLI</b> · <span id="r-sure">0 sn</span></p><p class="r-asama" id="r-adim">' + ASAMA[0][1] + '…</p><div class="cub"><i id="r-cub"></i></div><p class="bos">' + esc(u.replace(/^https?:\/\//, "")) + " şu an gerçekten inceleniyor. Yaklaşık 45 saniye sürer; sayfadan ayrılmayın.</p></div></div>" + '<p class="r-bilgi" id="r-bilgi">' + BILGI[0] + "</p>";
    }
    function hata(baslik, metin) {
      c.className = "cikti cam";
      c.innerHTML = '<div class="r-hata" role="alert"><span class="rozet k">Tamamlanamadı</span><h3>' + esc(baslik) + "</h3><p>" + esc(metin) + '</p><div class="dizi"><button type="button" class="dugme kucuk" id="r-yine">Yeniden dene</button><a class="dugme kucuk" href="' + C.kok + 'ekspertiz.html">Tam ekspertiz sayfası</a></div></div>';
      var y = $("#r-yine", c); if (y) y.addEventListener("click", function () { f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit", { cancelable: true })); });
    }
    function sonuc(d, u) {
      var alan = d.alanlar || {}, ad = d.alanAd || {}, T = d.bulgular || [], B = T.filter(function (b) { return b.durum !== "ok"; }).sort(function (a, b) { return (b.oncelik || 0) - (a.oncelik || 0); }), skor = Math.round(d.skor);
      var h = '<div class="skor"><div class="halka" id="r-halka" style="--p:0" role="img" aria-label="Genel puan ' + skor + ' / 100"><b id="r-puan" data-v="0">0</b></div><div class="alan">';
      Object.keys(alan).forEach(function (k) { var v = Math.round(alan[k]); h += "<div><span>" + esc(ad[k] || k) + '<em><i data-w="' + v + '"></i></em></span><b>' + v + "</b></div>"; });
      h += '</div></div><p class="ilr">' + esc(u.replace(/^https?:\/\//, "").replace(/\/$/, "")) + " · " + T.length + " kontrol · " + (T.length - B.length) + " sağlam · " + B.length + " eksik ya da uyarı</p>";
      B.slice(0, 5).forEach(function (b, i) { h += '<details class="bulgu" style="--i:' + i + '"' + (i === 0 ? " open" : "") + '><summary><span class="rozet ' + (b.durum === "eksik" ? "k" : "u") + '">' + (b.durum === "eksik" ? "Eksik" : "Uyarı") + "</span>" + esc(b.ad) + "</summary><p>" + esc(b.tespit) + "</p>" + (b.cozum ? '<p class="coz"><b>Çözüm:</b> ' + esc(b.cozum) + "</p>" : "") + "</details>"; });
      if (!B.length) h += '<div class="bulgu acik"><b>Dışarıdan ölçülen temel sağlam görünüyor.</b><p>Google profili ve rakip karşılaştırması tam raporda.</p></div>';
      if (B.length > 5) h += '<p class="bos">' + (B.length - 5) + " madde daha tam raporda.</p>";
      var olc = (d.kapsam && d.kapsam.olculmeyen || []).map(function (x) { return ad[x.alan] || x.alan; });
      if (olc.length) h += '<p class="bos">Bu hızlı bakışta ölçülmeyen alanlar: ' + esc(olc.join(", ")) + ". Tam ekspertiz bunları da inceler.</p>";
      h += '<div class="dizi"><a class="dugme ana kucuk" href="' + C.kok + "ekspertiz.html?url=" + encodeURIComponent(u) + '">Tam raporu ve çözüm planını aç</a><a class="dugme kucuk" href="' + C.wa + "?text=" + encodeURIComponent("Merhaba, sitenizdeki röntgende puanım " + skor + " çıktı. Eksikleri konuşmak istiyorum: " + u) + '" rel="noopener">WhatsApp\'tan sor</a></div>';
      c.className = "cikti cam bitti"; c.innerHTML = h;
      var halka = $("#r-halka", c);
      requestAnimationFrame(function () { $$(".alan i", c).forEach(function (x) { x.style.width = x.getAttribute("data-w") + "%"; }); });
      say($("#r-puan", c), skor, 1400); if (AZ) halka.style.setProperty("--p", skor); else { var t0 = performance.now(); (function k(t) { var p = Math.min(1, (t - t0) / 1400); halka.style.setProperty("--p", (skor * (1 - Math.pow(1 - p, 3))).toFixed(1)); if (p < 1) requestAnimationFrame(k); })(t0); }
    }
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (calisiyor) return;
      var u = f.url.value.trim(); if (!u) { f.url.focus(); return; }
      if (!/^https?:\/\//i.test(u)) u = "https://" + u;
      if (!/^https?:\/\/[^\s\/]+\.[^\s\/]{2,}/i.test(u)) return hata("Adres eksik görünüyor", "Örnek: ornekisletme.com biçiminde yazın.");
      var dug = f.querySelector("button"); dug.disabled = true; calisiyor = true; bekleme(u);
      var t0 = Date.now(), zam = setInterval(function () {
        var s = (Date.now() - t0) / 1000, a = $("#r-adim", c), b = $("#r-cub", c), sr = $("#r-sure", c), bl = $("#r-bilgi", c), ad = ASAMA[0][1];
        ASAMA.forEach(function (x) { if (s >= x[0]) ad = x[1]; });
        if (a && a.textContent !== ad + "…") a.textContent = ad + "…"; if (sr) sr.textContent = Math.floor(s) + " sn"; if (b) b.style.width = Math.min(96, 100 * (1 - Math.exp(-s / 20))).toFixed(1) + "%";
        var bi = BILGI[Math.floor(s / 8) % BILGI.length]; if (bl && bl.textContent !== bi) bl.textContent = bi;
      }, 500);
      var kes = null, ctl = ("AbortController" in W) ? new AbortController() : null; if (ctl) kes = setTimeout(function () { ctl.abort(); }, 90000);
      fetch(C.fn, { method: "POST", headers: { "Content-Type": "application/json", apikey: C.anahtar || "" }, body: JSON.stringify({ url: u, maps: "", isletme: "", sehir: "" }), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { if (!r.ok && r.status >= 500) throw new Error("sunucu"); return r.json(); })
        .then(function (d) {
          if (d.hata) return hata("Servis bu adresi işleyemedi", String(d.hata));
          if (d.skor == null) return hata((d.site && d.site.acilmadi) ? "Site açılamadı" : "Bu adres ölçülemedi", (d.site && d.site.acilmadi) ? "Adres yanlış yazılmış ya da site şu an kapalı olabilir. Kontrol edip yeniden deneyin." : "Siteden okunabilir bir sayfa alınamadı. Tam ekspertiz sayfasında işletme adıyla deneyebilirsiniz.");
          sonuc(d, u);
        })
        .catch(function (x) {
          if (x && x.name === "AbortError") hata("Süre doldu", "Site 90 saniye içinde cevap vermedi. Çok yavaş açılıyor olabilir; bu da başlı başına bir bulgudur.");
          else if (x && x.message === "sunucu") hata("Analiz servisi şu an cevap vermiyor", "Birkaç dakika sonra yeniden deneyin ya da tam ekspertiz sayfasını kullanın.");
          else hata("Bağlantı kurulamadı", "İnternet bağlantınızı kontrol edip yeniden deneyin.");
        })
        .then(function () { clearInterval(zam); clearTimeout(kes); dug.disabled = false; calisiyor = false; });
    });
  })();

  /* ---- Sekmeli canlı çerçeve: sektör örnekleri ve araçlar ---- */
  function cerceve(kap, dugS, ek, baslik, bitince) {
    var dug = $$(dugS, kap); if (!dug.length || !ek) return;
    var cer = null, yuk = false, isk = $(".ort", ek);
    function sec(b, odak) {
      dug.forEach(function (x) { var s = x === b; x.setAttribute("aria-selected", s); if (x.getAttribute("role") === "tab") x.tabIndex = s ? 0 : -1; });
      if (odak) b.focus(); if (bitince) bitince(b);
      if (!yuk) return;
      if (!cer) { cer = D.createElement("iframe"); cer.title = baslik; cer.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups"); ek.appendChild(cer); cer.addEventListener("load", function () { if (isk) isk.hidden = true; }); }
      if (isk) isk.hidden = false; cer.src = b.getAttribute("data-src");
    }
    dug.forEach(function (b, i) {
      b.addEventListener("click", function () { sec(b); });
      b.addEventListener("keydown", function (e) { var y = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (!y) return; e.preventDefault(); sec(dug[(i + y + dug.length) % dug.length], true); });
    });
    gorunce(ek, function () { yuk = true; sec(dug.filter(function (x) { return x.getAttribute("aria-selected") === "true"; })[0] || dug[0]); }, "200px");
  }
  (function () {
    var kap = $("#sektor"); if (!kap) return;
    var ek = $(".ekran", kap), yaf = $("#s-yafta", kap), ac = $("#s-ac", kap);
    cerceve(kap, ".sekme button", ek, "Çalışan sektör örneği", function (b) { if (yaf) yaf.textContent = b.getAttribute("data-ad"); if (ac) ac.href = b.getAttribute("data-src"); });
    function cihaz(t) { ek.classList.toggle("tel", t); $$("[data-cihaz]", kap).forEach(function (x) { x.setAttribute("aria-pressed", (x.getAttribute("data-cihaz") === "tel") === t); }); }
    $$("[data-cihaz]", kap).forEach(function (b) { b.addEventListener("click", function () { cihaz(b.getAttribute("data-cihaz") === "tel"); }); });
    if (W.innerWidth < 700) cihaz(true);
  })();
  (function () { var kap = $("#arac"); if (kap) cerceve(kap, ".sekme2 button", $(".arac-e", kap), "Çalışan küçük işletme aracı"); })();

  /* ---- Kodla çizilen sahne (ham WebGL): görünür olunca yüklenir; saat ve hava ---- */
  (function () {
    var t = $("#tuval"); if (!t || !C.motor) return;
    var cv = $("canvas", t), kay = $("#saat"), yaz = $("#saat-yazi"), hav = $("#hava"), hyaz = $("#hava-yazi"), ms = $("#sah-ms"), S = null;
    function saatAd(v) { return v < 0.34 ? "Gün batımı" : v < 0.67 ? "Alacakaranlık" : "Akşam"; }
    function havaAd(v) { return v < 0.25 ? "Açık" : v < 0.62 ? "Parçalı bulutlu" : "Bulutlu"; }
    function yok() { t.classList.add("gl-yok"); if (kay) kay.disabled = true; if (hav) hav.disabled = true; }
    function yukle(src, fn) { var s = D.createElement("script"); s.src = src; s.onload = fn; s.onerror = yok; D.body.appendChild(s); }
    gorunce(t, function () {
      yukle(C.motor, function () { yukle(C.sahne, function () {
        try { var o = W.SAHNE; o.canvas = cv; o.host = t; S = W.Sahne3D.kur(o); } catch (e) { S = null; }
        if (!S || !S.saatAyarla) return yok();
        t.classList.add("hazir");
        if (kay) kay.addEventListener("input", function () { var v = kay.value / 100; S.saatAyarla(v); if (yaz) yaz.textContent = saatAd(v); });
        if (hav && S.havaAyarla) hav.addEventListener("input", function () { var v = hav.value / 100; S.havaAyarla(v); if (hyaz) hyaz.textContent = havaAd(v); });
        if (ms && S.durum) setInterval(function () { var d = S.durum(); if (d && d.ms) ms.textContent = d.ms < 10 ? d.ms.toFixed(1).replace(".", ",") : Math.round(d.ms); }, 1200);
        W.F14SAHNE = S;
      }); });
    }, "250px");
  })();

  /* ---- Ayşe: gerçek kayıt, gerçek dalga biçimi, konuşurken yazıya dökülen balonlar. Ses yalnız kullanıcı başlatınca çalar. ---- */
  (function () {
    var k = $("#ayse"), V = C.ayse; if (!k || !V || !V.length) return;
    var dug = $$(".parca button", k), cv = $("#a-dalga", k), bal = $("#a-bal", k), durum = $("#a-durum", k), cx = cv.getContext("2d");
    var au = new Audio(), akt = -1, raf = 0, tepe = {}, actx = null, gosterilen = 0, N = 96;
    au.preload = "none";
    var bosDalga = null;
    function sahte(i) { var o = [], s = 7 + i * 13; for (var j = 0; j < N; j++) { s = (s * 1103515245 + 12345) & 0x7fffffff; o.push(0.18 + (s % 1000) / 1000 * 0.5 * Math.abs(Math.sin(j * 0.21 + i))); } return o; }
    bosDalga = sahte(3).map(function (v) { return v * 0.45; });
    function tepeAl(i) {
      if (tepe[i] || !W.fetch) return;
      tepe[i] = sahte(i);
      var AC = W.AudioContext || W.webkitAudioContext; if (!AC) return;
      fetch(V[i].ses).then(function (r) { return r.arrayBuffer(); }).then(function (b) { actx = actx || new AC(); return new Promise(function (ok, no) { actx.decodeAudioData(b, ok, no); }); }).then(function (buf) {
        var d = buf.getChannelData(0), adim = Math.floor(d.length / N), o = [], enb = 0.001;
        for (var j = 0; j < N; j++) { var m = 0; for (var q = j * adim; q < (j + 1) * adim; q += 8) { var v = Math.abs(d[q]); if (v > m) m = v; } o.push(m); if (m > enb) enb = m; }
        tepe[i] = o.map(function (v) { return Math.max(0.04, v / enb); }); tepe[i].gercek = true; ciz();
      }).catch(function () {});
    }
    function ciz() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(W.devicePixelRatio || 1, 2), w = Math.max(1, r.width), h = Math.max(1, r.height);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, w, h);
      var st = getComputedStyle(k), bos = st.getPropertyValue("--line").trim() || "#444", dolu = "#FFB000", T = tepe[akt] || bosDalga, ilr = akt > -1 && au.duration ? au.currentTime / au.duration : 0, g = w / N;
      for (var j = 0; j < N; j++) { var v = T ? T[j] : 0.05, y = Math.max(2, v * (h - 8)); cx.fillStyle = akt > -1 && j / N < ilr ? dolu : bos; cx.fillRect(j * g + g * 0.2, (h - y) / 2, Math.max(1.5, g * 0.6), y); }
    }
    function balon() {
      if (akt < 0) return; var s = V[akt].s, t = au.currentTime;
      while (gosterilen < s.length && t >= s[gosterilen][0]) { var p = D.createElement("p"); p.className = "a-b"; p.textContent = s[gosterilen][2]; bal.appendChild(p); gosterilen++; bal.scrollTop = bal.scrollHeight; }
    }
    function dongu() { ciz(); balon(); raf = requestAnimationFrame(dongu); }
    function isaretle() { dug.forEach(function (x, i) { x.setAttribute("aria-pressed", i === akt && !au.paused); }); k.classList.toggle("caliyor", akt > -1 && !au.paused); }
    function sec(i) {
      if (akt === i) { if (au.paused) au.play().then(function () { if (durum) durum.textContent = "Çalıyor: " + V[i].ad; isaretle(); if (!raf) dongu(); }).catch(function () {}); else { au.pause(); if (durum) durum.textContent = "Duraklatıldı. Devam için aynı bölüme basın."; isaretle(); } return; }
      akt = i; gosterilen = 0; bal.innerHTML = ""; tepeAl(i); au.src = V[i].ses;
      au.play().then(function () { if (durum) durum.textContent = "Çalıyor: " + V[i].ad; isaretle(); if (!raf) dongu(); }).catch(function () { akt = -1; isaretle(); bal.innerHTML = '<p class="a-ipucu">Ses başlatılamadı. Cihazınızın sesi kapalı olabilir; metinler aşağıdaki bölümlerde yazılıdır.</p>'; if (durum) durum.textContent = "Ses başlatılamadı."; });
    }
    dug.forEach(function (b, i) { b.addEventListener("click", function () { sec(i); }); });
    au.addEventListener("ended", function () { cancelAnimationFrame(raf); raf = 0; balon(); ciz(); isaretle(); if (durum) durum.textContent = "Bitti. Başka bir bölüm seçebilirsiniz."; });
    W.addEventListener("resize", ciz); W.addEventListener("f14-tema", ciz); gorunce(cv, ciz, "100px");
    W.F14AYSE = { durum: function () { return { akt: akt, t: au.currentTime, balon: gosterilen, gercekDalga: !!(tepe[akt] && tepe[akt].gercek), duraklı: au.paused }; } };
  })();

  /* ---- Önce / sonra ---- */
  $$(".os").forEach(function (o) { var r = $("input", o); if (!r) return; function g() { o.style.setProperty("--x", r.value + "%"); } r.addEventListener("input", g); g(); });

  /* ---- Hizmet sayfası: ne ödersiniz (rakamlar karar belgesinden; hesap burada, saklı koşul yok) ---- */
  (function () {
    var k = $("#hesap"); if (!k) return; var KUR = 4900, VIT = 2490;
    function hes() {
      var ay = +(($('input[name="kademe"]:checked', k) || {}).value || 3900), v = $("#hs-vitrin", k).checked, kur = KUR - (v ? VIT : 0);
      say($("#hs-kur", k), kur, 500, tl); say($("#hs-ay", k), ay, 500, tl); say($("#hs-ilk", k), kur + ay, 500, tl); say($("#hs-uc", k), kur + ay * 3, 500, tl);
      var g = $("#ay-g"); if (g) g.setAttribute("data-k", ay); var t = $("#hz-tablo"); if (t) t.setAttribute("data-k", ay);
    }
    $$("input", k).forEach(function (x) { x.addEventListener("change", hes); });
    ["#hs-kur", "#hs-ay", "#hs-ilk", "#hs-uc"].forEach(function (s, i) { var e = $(s, k); if (e) e.setAttribute("data-v", [4900, 3900, 8800, 16600][i]); });
  })();

  /* ---- Teklif: dört soruluk konuşan yapılandırıcı. Hiçbir yere kayıt yazmaz; gönderime hazır mesaj üretir. ---- */
  (function () {
    var k = $("#sohbet"); if (!k || !C.paket) return;
    var f = $("form", k), o = $("#oneri", k), adimlar = $$("fieldset[data-adim]", f), nok = $$(".soh-ilr i", f), ileri = $("#soh-ileri", f), geri = $("#soh-geri", f), P = C.paket, a = 0, q = {}, elle = false;
    var DIL = { a: "Keskin", b: "Sıcak", c: "Sade" };
    try { var sp = new URLSearchParams(location.search); ["ad", "sehir", "sektor", "dil"].forEach(function (x) { if (sp.get(x)) q[x] = sp.get(x).slice(0, 60); }); } catch (e) {}
    if (q.ad) f.ad.value = q.ad; if (q.sehir) f.sehir.value = q.sehir;
    if (q.sektor) { var r0 = $('input[name="sektor"][value="' + q.sektor.replace(/[^a-z]/g, "") + '"]', f); if (r0) r0.checked = true; }
    function durum() {
      var sek = $('input[name="sektor"]:checked', f), dert = $$('input[name="dert"]:checked', f), s = {}; dert.forEach(function (x) { s[x.value] = true; });
      return { sek: sek ? sek.getAttribute("data-ad") : "", vr: $$('input[name="var"]:checked', f).map(function (x) { return x.value; }), dert: dert.map(function (x) { return x.getAttribute("data-ad"); }), s: s, n: dert.length, ad: f.ad.value.trim(), sehir: f.sehir.value.trim() };
    }
    function paket(d) { return !d.n ? null : d.s.ozel ? P.ozel : d.s.cok ? P.standart : (d.s.site || d.s.aylik) ? P.giris : P.vitrin; }
    function mesaj(d, p) {
      var m = ["Merhaba, dijitabela.com üzerinden yazıyorum."];
      if (d.ad || d.sehir) m.push("İşletme: " + (d.ad || "-") + (d.sehir ? " (" + d.sehir + ")" : ""));
      if (d.sek) m.push("Sektör: " + d.sek);
      m.push("Şu an: " + (d.vr.length ? d.vr.join(", ") : "Google kaydım ve sitem yok ya da emin değilim"));
      if (d.dert.length) m.push("İhtiyacım: " + d.dert.join("; "));
      if (p) m.push("Sitenin önerdiği: " + p.ad + " (" + p.fiyat + (p.birim ? ", " + p.birim : "") + ")");
      if (q.dil && DIL[q.dil]) m.push("Sitede kurduğum taslak: " + DIL[q.dil] + " tasarım dili");
      m.push("Bilgi almak istiyorum.");
      return m.join("\n");
    }
    function ciz() {
      var d = durum(), p = paket(d), h = "";
      if (q.ad && q.dil) h += '<p class="tas-not"><b>Kurduğunuz taslak:</b> ' + esc(q.ad) + " · " + esc(DIL[q.dil] || "") + " tasarım dili. Mesaja eklendi.</p>";
      if (!p) h += '<p class="et">Öneri</p><h3>Cevaplarınız burada pakete dönüşür.</h3><p class="soft">Üçüncü soruda en az bir kutuyu işaretleyince size uyan paket, fiyatı ve nedeni görünür.</p>';
      else {
        h += '<p class="et">Size uyan</p><h3>' + esc(p.ad) + '</h3><div class="fiy">' + esc(p.fiyat) + "<small>" + esc(p.birim) + "</small></div>";
        if (p.ek) h += "<p><b>" + esc(p.ek) + "</b></p>";
        h += "<ul>" + p.icerik.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
        if (d.s.ozel && d.n > 1) h += '<p class="soft">İşaretlediğiniz diğer ihtiyaçlar teklifin içine yazılır; ayrı ayrı ücretlendirilmez.</p>';
        if (!d.s.ozel && d.s.google && p !== P.vitrin) h += '<p class="soft">Google profili düzenlemesi kurulumun içindedir; ayrıca ücret alınmaz.</p>';
        h += '<p class="kdv">' + esc(p.not) + "</p>";
      }
      h += '<div class="msj"><label for="t-msj">Gönderime hazır mesaj <small>düzenleyebilirsiniz</small></label><textarea id="t-msj" rows="8"></textarea><div class="dizi"><a class="dugme ana" id="t-wa" href="' + C.wa + '" rel="noopener">WhatsApp\'ta aç</a><button type="button" class="dugme kucuk" id="t-kop">Metni kopyala</button><a class="dugme kucuk" href="tel:' + C.telHam + '">' + esc(C.tel) + '</a></div><p class="kdv" id="t-bilgi" aria-live="polite">Mesaj siz gönderene kadar hiçbir yere iletilmez.</p></div>';
      var eski = $("#t-msj", o), tut = elle && eski ? eski.value : null; o.innerHTML = h;
      var ta = $("#t-msj", o), wa = $("#t-wa", o), bilgi = $("#t-bilgi", o);
      ta.value = tut != null ? tut : mesaj(d, p);
      function bag() { wa.href = C.wa + "?text=" + encodeURIComponent(ta.value); } bag();
      ta.addEventListener("input", function () { elle = true; bag(); });
      $("#t-kop", o).addEventListener("click", function () { var tamam = function () { bilgi.textContent = "Metin kopyalandı."; }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(tamam, function () { ta.select(); bilgi.textContent = "Metni seçtik; kopyalamak için Ctrl+C."; }); else { ta.select(); try { D.execCommand("copy"); tamam(); } catch (e) { bilgi.textContent = "Metni seçtik; elle kopyalayın."; } } });
      o.setAttribute("data-paket", p ? p.ad : "");
    }
    function goster(odak) {
      adimlar.forEach(function (x, i) { x.classList.toggle("aktif", i === a); }); nok.forEach(function (x, i) { x.className = i < a ? "gecti" : i === a ? "simdi" : ""; });
      geri.disabled = a === 0; ileri.textContent = a === adimlar.length - 1 ? "Mesajımı göster" : "Devam";
      if (odak) { var ilk = $("input", adimlar[a]); if (ilk) ilk.focus({ preventScroll: true }); }
    }
    ileri.addEventListener("click", function () { if (a < adimlar.length - 1) { a++; goster(true); } else { var ta = $("#t-msj", o); o.scrollIntoView({ behavior: AZ ? "auto" : "smooth", block: "center" }); if (ta) setTimeout(function () { ta.focus({ preventScroll: true }); }, 400); } });
    geri.addEventListener("click", function () { if (a > 0) { a--; goster(true); } });
    f.addEventListener("submit", function (e) { e.preventDefault(); });
    f.addEventListener("input", function () { elle = false; ciz(); }); f.addEventListener("change", function () { elle = false; ciz(); });
    $$('input[name="sektor"]', f).forEach(function (x) { x.addEventListener("change", function () { if (a === 0 && !AZ) setTimeout(function () { if (a === 0) { a = 1; goster(false); } }, 260); }); });
    k.classList.add("canli"); if (q.sektor && $('input[name="sektor"]:checked', f)) a = 1; goster(false); ciz();
  })();

  /* ---- Yapay zekâ bizi nasıl okuyor: canlı llms.txt ---- */
  (function () {
    var k = $("#llms"); if (!k) return;
    gorunce(k, function () { fetch(C.kok + "llms.txt").then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) { k.textContent = t.slice(0, 2200) + (t.length > 2200 ? "\n…" : ""); }).catch(function () { k.textContent = "Dosya şu an okunamadı. Adres: dijitabela.com/llms.txt"; }); });
  })();
})();
