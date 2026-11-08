/* Ana sayfa sinematik açılış: kaydırdıkça oynayan kare dizisi (img/acilis/). Üretim: _kaynak/uret.js içindeki ACILIS bölümü.
   - İlk kare <picture> poster olarak anında görünür; kareler yalnız ziyaretçi sayfayla etkileşince (kaydırma/dokunma/tuş) iner.
   - Önce seyrek kareler (her 8.), sonra aradakiler: film hemen oynar, akıcılık yüklendikçe artar.
   - prefers-reduced-motion veya JS yoksa CSS durağan hero gösterir; bu dosya hiçbir şey yapmaz. */
(function () {
  var bol = document.getElementById("acilis");
  if (!bol || !window.HTMLCanvasElement) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var tuval = bol.querySelector("canvas"), ctx = tuval.getContext("2d");
  var yazilar = [].slice.call(bol.querySelectorAll("[data-a]"));
  var cizgi = bol.querySelector(".acilis-ilerleme i");
  var mobil = matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
  var taban = bol.getAttribute("data-kok") || "./";
  var bilgi = null, kare = [], hedef = 0, gorunen = 0, son = -1, basladi = false, dongude = false;

  function ilerleme() {
    var r = bol.getBoundingClientRect(), boy = bol.offsetHeight - innerHeight;
    return boy > 0 ? Math.min(1, Math.max(0, -r.top / boy)) : 0;
  }
  function boyut() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    tuval.width = Math.round(tuval.clientWidth * dpr); tuval.height = Math.round(tuval.clientHeight * dpr);
    son = -1; ciz();
  }
  function enYakin(i) { // yüklenmiş en yakın kare
    for (var d = 0; d < kare.length; d++) {
      if (kare[i - d] && kare[i - d].ok) return kare[i - d];
      if (kare[i + d] && kare[i + d].ok) return kare[i + d];
    }
    return null;
  }
  function ciz() {
    if (!bilgi) return;
    var i = Math.max(0, Math.min(kare.length - 1, Math.round(gorunen)));
    var k = enYakin(i); if (!k) return;
    if (k === son) return; son = k;
    var im = k.im, s = Math.max(tuval.width / im.naturalWidth, tuval.height / im.naturalHeight);
    var w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (tuval.width - w) / 2, (tuval.height - h) / 2, w, h);
    bol.classList.add("film");
  }
  function yaziGuncelle(p) {
    yazilar.forEach(function (y) {
      var on = p >= +y.getAttribute("data-a") && p < +y.getAttribute("data-b");
      if (y.classList.contains("acik") !== on) { y.classList.toggle("acik", on); y.setAttribute("aria-hidden", on ? "false" : "true"); [].forEach.call(y.querySelectorAll("a"), function (a) { a.tabIndex = on ? 0 : -1; }); }
    });
    if (cizgi) cizgi.style.transform = "scaleX(" + p.toFixed(3) + ")";
    bol.classList.toggle("kaydi", p > 0.02);
  }
  function dongu() {
    gorunen += (hedef - gorunen) * 0.18;
    if (Math.abs(hedef - gorunen) < 0.05) gorunen = hedef;
    ciz();
    if (gorunen !== hedef) requestAnimationFrame(dongu); else dongude = false;
  }
  function kaydir() {
    var p = ilerleme();
    yaziGuncelle(p);
    if (!bilgi) return;
    hedef = p * (kare.length - 1);
    if (!dongude) { dongude = true; requestAnimationFrame(dongu); }
  }
  function yukle() {
    if (basladi) return; basladi = true;
    fetch(taban + "img/acilis/acilis.json").then(function (r) { return r.json(); }).then(function (j) {
      bilgi = mobil ? j.m : j.d;
      var klasor = taban + "img/acilis/" + (mobil ? "m" : "d") + "/";
      kare = new Array(bilgi.n);
      var sira = [];
      [8, 4, 2, 1].forEach(function (adim) { for (var i = 0; i < bilgi.n; i += adim) if (sira.indexOf(i) < 0) sira.push(i); });
      sira.push(bilgi.n - 1);
      var ac = 0, idx = 0;
      function sonraki() {
        while (ac < 6 && idx < sira.length) {
          (function (i) {
            if (kare[i]) return;
            var im = new Image(); im.decoding = "async"; kare[i] = { im: im, ok: false }; ac++;
            im.onload = function () { kare[i].ok = true; ac--; if (Math.abs(i - hedef) < 9) { son = -1; ciz(); } sonraki(); };
            im.onerror = function () { ac--; sonraki(); };
            im.src = klasor + "f_" + ("000" + (i + 1)).slice(-4) + ".webp";
          })(sira[idx++]);
        }
      }
      sonraki(); boyut(); kaydir();
    }).catch(function () { basladi = false; });
  }
  ["scroll", "wheel", "touchstart", "keydown", "pointerdown"].forEach(function (o) { addEventListener(o, yukle, { passive: true, once: true }); });
  if (scrollY > 0) yukle();
  addEventListener("scroll", kaydir, { passive: true });
  addEventListener("resize", function () { boyut(); kaydir(); });
  var gec = bol.querySelector(".acilis-gec");
  if (gec) gec.addEventListener("click", function (e) {
    var hedefEl = document.getElementById("acilis-sonra");
    if (!hedefEl) return;
    e.preventDefault(); hedefEl.scrollIntoView({ behavior: "auto", block: "start" });
    var ilk = document.querySelector("#acilis-sonra ~ section a, #acilis-sonra ~ section button"); if (ilk) ilk.focus({ preventScroll: true });
  });
  yaziGuncelle(ilerleme());
})();
