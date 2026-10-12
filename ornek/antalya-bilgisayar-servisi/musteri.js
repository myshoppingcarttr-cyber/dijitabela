/* Müşteri tarafı etkileşimleri · Antalya BB Bilgisayar prototipi (Dijitabela) */
(function () {
  var $ = U.$, $$ = U.$$, NS = "http://www.w3.org/2000/svg";
  var AZ = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Açılmış laptop (izometrik SVG) ---------- */
  var svg = $("#laptop"), W = 300, D = 200, ISO = "matrix(.866,.5,-.866,.5,0,0)";
  var KAT = [
    { ad: "EKRAN PANELİ", ic: function () {
        return '<rect width="300" height="200" rx="12" fill="#1B2147"/><rect x="12" y="12" width="276" height="176" rx="5" fill="url(#ekr)"/>' +
          '<rect x="26" y="26" width="90" height="10" rx="3" fill="#fff" opacity=".85"/><rect x="26" y="44" width="150" height="6" rx="3" fill="#A9C3FF" opacity=".6"/>' +
          '<rect x="26" y="70" width="120" height="70" rx="6" fill="#fff" opacity=".12"/><rect x="156" y="70" width="118" height="70" rx="6" fill="#FF7A2E" opacity=".75"/>' +
          '<rect x="26" y="150" width="248" height="24" rx="6" fill="#fff" opacity=".1"/><path d="M12 12 L150 12 L60 188 L12 188 Z" fill="#fff" opacity=".06"/>'; } },
    { ad: "KLAVYE · TOUCHPAD", ic: function () {
        var s = '<rect width="300" height="200" rx="12" fill="#D6DCEB"/><rect x="10" y="10" width="280" height="180" rx="8" fill="#C7CEE0"/>';
        for (var r = 0; r < 5; r++) for (var c = 0; c < 13; c++) s += '<rect x="' + (20 + c * 20.5) + '" y="' + (18 + r * 20) + '" width="17" height="16" rx="3" fill="#20244A"/>';
        s += '<rect x="62" y="118" width="176" height="14" rx="3" fill="#20244A"/><rect x="104" y="140" width="92" height="50" rx="6" fill="#B3BBD2" stroke="#9AA3C7"/>';
        s += '<rect x="20" y="18" width="17" height="16" rx="3" fill="#246AF4"/>';
        return s; } },
    { ad: "ANAKART · BGA", ic: function () {
        var s = '<rect width="300" height="200" rx="10" fill="#0E2A52"/>';
        for (var i = 0; i < 9; i++) s += '<path d="M' + (12 + i * 30) + ' 196 L' + (12 + i * 30) + ' ' + (150 - (i % 3) * 14) + ' L' + (40 + i * 26) + ' ' + (120 - (i % 4) * 8) + '" stroke="#2F6FBF" stroke-width="1.6" fill="none" opacity=".7"/>';
        s += '<circle cx="78" cy="74" r="46" fill="#091C3A" stroke="#5C8DFF" stroke-width="2"/>';
        for (var k = 0; k < 7; k++) { var a = k * Math.PI * 2 / 7; s += '<path d="M78 74 Q' + (78 + Math.cos(a + .6) * 30) + ' ' + (74 + Math.sin(a + .6) * 30) + ' ' + (78 + Math.cos(a) * 40) + ' ' + (74 + Math.sin(a) * 40) + '" stroke="#A9C3FF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>'; }
        s += '<circle cx="78" cy="74" r="11" fill="#20244A" stroke="#A9C3FF"/>';
        s += '<path d="M110 60 L190 58 L262 60" stroke="#E08A4A" stroke-width="9" fill="none" stroke-linecap="round"/>';
        s += '<rect x="168" y="38" width="46" height="46" rx="4" fill="#9AA3C7"/><rect x="176" y="46" width="30" height="30" rx="3" fill="#D6DCEB"/>';
        s += '<rect x="226" y="36" width="54" height="54" rx="4" fill="#151A3A" stroke="#FF7A2E" stroke-width="1.5"/>';
        for (var x = 0; x < 6; x++) for (var y = 0; y < 6; y++) s += '<circle cx="' + (234 + x * 7.6) + '" cy="' + (44 + y * 7.6) + '" r="1.8" fill="#FFB27F"/>';
        s += '<rect x="30" y="134" width="118" height="15" rx="2" fill="#1E3F6A"/><rect x="30" y="156" width="118" height="15" rx="2" fill="#1E3F6A"/><rect x="36" y="137" width="106" height="9" fill="#14A86B" opacity=".75"/>';
        s += '<rect x="168" y="138" width="110" height="28" rx="3" fill="#20244A"/><text x="178" y="157" font-family="Geist Mono" font-size="11" fill="#A9C3FF">NVMe SSD</text>';
        return s; } },
    { ad: "BATARYA", ic: function () {
        return '<rect width="300" height="200" rx="12" fill="none" stroke="#5C8DFF" stroke-dasharray="4 6" opacity=".55"/><rect x="24" y="112" width="252" height="74" rx="8" fill="#2A2F5C"/>' +
          '<path d="M108 112 V186 M192 112 V186" stroke="#0A0D1C" stroke-width="3"/><rect x="36" y="124" width="60" height="8" rx="4" fill="#14A86B"/><rect x="120" y="124" width="60" height="8" rx="4" fill="#14A86B"/><rect x="204" y="124" width="36" height="8" rx="4" fill="#E8A317"/>'; } },
    { ad: "ALT KASA", ic: function () {
        var s = '<rect width="300" height="200" rx="14" fill="#262B52"/><rect x="6" y="6" width="288" height="188" rx="10" fill="none" stroke="#3A4178"/>';
        for (var i = 0; i < 14; i++) s += '<rect x="' + (40 + i * 9) + '" y="30" width="4" height="70" rx="2" fill="#0A0D1C"/>';
        [[20, 20], [280, 20], [20, 180], [280, 180]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#0A0D1C"/>'; });
        return s; } }
  ];
  var defs = '<defs><linearGradient id="ekr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#246AF4"/><stop offset="1" stop-color="#0E1438"/></linearGradient>' +
    '<filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter></defs>' +
    '<ellipse cx="280" cy="600" rx="260" ry="40" fill="#246AF4" opacity=".35" filter="url(#gl)"/>';
  var html = defs, X0 = 236, GAP = 82, YB = 372, parcalar = [];
  KAT.forEach(function (k, i) {
    parcalar.unshift( '<g class="kat" data-i="' + i + '">' +
      '<g transform="translate(0,9)"><g transform="' + ISO + '"><rect width="' + W + '" height="' + D + '" rx="12" fill="#070918"/></g></g>' +
      '<g transform="' + ISO + '">' + k.ic() + '</g>' +
      '<g class="lbl"><line x1="' + ((300 - 70) * .866) + '" y1="' + ((300 + 70) * .5) + '" x2="300" y2="' + ((300 + 70) * .5 - 22) + '"/><circle cx="' + ((300 - 70) * .866) + '" cy="' + ((300 + 70) * .5) + '" r="4"/><text x="306" y="' + ((300 + 70) * .5 - 18) + '">' + k.ad + "</text></g></g>");
  });
  svg.innerHTML = html + parcalar.join("");
  var katlar = $$(".kat", svg).sort(function (a, b) { return a.dataset.i - b.dataset.i; });
  function patlat(e) {
    katlar.forEach(function (g, i) {
      var y = YB - (4 - i) * (GAP * e + 14 * (1 - e));
      g.style.transform = "translate(" + X0 + "px," + y + "px)";
      var l = $(".lbl", g); if (l) l.style.opacity = e > .55 ? 1 : 0;
    });
  }
  patlat(0); var hedefE = 1;
  setTimeout(function () { patlat(1); }, AZ ? 0 : 450);
  var bekleR = false;
  addEventListener("scroll", function () {
    if (bekleR) return; bekleR = true;
    requestAnimationFrame(function () {
      bekleR = false; var p = Math.min(1, Math.max(0, scrollY / 700)), e = 1 - p * .8;
      if (Math.abs(e - hedefE) > .02) { hedefE = e; patlat(e); }
      yolGuncelle();
    });
  }, { passive: true });

  /* hizmet şeridi */
  var hs = ABS.hizmetler.map(function (h) { return "<span>" + h + "</span>"; }).join("");
  $("#hiz-serit").innerHTML = hs + hs;

  /* ---------- 2. Nasıl çalışır: yol + minibüs ---------- */
  var ys = $("#yol-svg"); ys.setAttribute("preserveAspectRatio", "xMidYMid meet");
  var iz = $("#yol-iz"), dolu = $("#yol-dolu"), mb = $("#minibus"), L = iz.getTotalLength();
  dolu.style.strokeDasharray = L; dolu.style.strokeDashoffset = L;
  function yolGuncelle() {
    var r = $("#nasil").getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height * .75)));
    dolu.style.strokeDashoffset = L * (1 - p);
    var a = iz.getPointAtLength(L * p), b = iz.getPointAtLength(Math.min(L, L * p + 2)), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    mb.setAttribute("transform", "translate(" + a.x + "," + (a.y - 14) + ") rotate(" + ang * .5 + ")");
  }
  yolGuncelle();

  /* ---------- WhatsApp önizleme ---------- */
  var wa = U.waTelefon($("#wa"));
  var T = ABS.takip;

  /* ---------- 3. Arıza kaydı sihirbazı ---------- */
  var IK = {
    laptop: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="12" y="6" width="40" height="27" rx="2.5"/><rect x="16" y="10" width="32" height="19" rx="1" fill="currentColor" opacity=".12"/><path d="M5 37h54l-4 5H9z" stroke-linejoin="round"/></svg>',
    masaustu: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="36" height="25" rx="2.5"/><path d="M16 38h12M22 31v7"/><rect x="45" y="6" width="15" height="34" rx="2.5"/><circle cx="52.5" cy="28" r="4"/><path d="M49 12h7"/></svg>',
    oyun: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="18" y="3" width="28" height="42" rx="3"/><circle cx="32" cy="17" r="7"/><path d="M32 10v14M25 17h14" opacity=".5"/><circle cx="32" cy="34" r="5"/><path d="M22 41h20" stroke="#FF7A2E" stroke-width="2.5"/></svg>',
    aio: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="52" height="32" rx="3"/><path d="M6 30h52"/><path d="M26 36l-3 8h18l-3-8"/></svg>',
    yazici: '<svg viewBox="0 0 64 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 16V5h28v11"/><rect x="8" y="16" width="48" height="20" rx="3"/><rect x="18" y="30" width="28" height="14" rx="1"/><circle cx="48" cy="23" r="2" fill="currentColor"/></svg>'
  };
  var K = { cihaz: null, marka: null, bel: [], foto: [], adim: 0 };
  $("#cihaz-izg").innerHTML = ABS.cihazlar.map(function (c) { return '<button type="button" class="cihaz" data-c="' + c.id + '">' + IK[c.id] + "<b>" + c.ad + "</b></button>"; }).join("");
  $("#marka-l").innerHTML = ABS.markalar.map(function (m) { return '<button type="button" class="yonga" data-m="' + m + '">' + m + "</button>"; }).join("");
  $("#belirti-l").innerHTML = ABS.belirtiler.map(function (b) { return '<button type="button" class="yonga" data-b="' + b.id + '">' + b.ad + "</button>"; }).join("");
  function mahSecenek() {
    return ABS.bolgeler.map(function (b) {
      return '<optgroup label="' + b.ad + '">' + ABS.mahalleler.filter(function (m) { return m.b === b.id; }).map(function (m) { return "<option>" + m.ad + "</option>"; }).join("") + "</optgroup>";
    }).join("");
  }
  $("#mah").innerHTML = mahSecenek(); $("#mah").value = "Şirinyalı";
  $("#r-mah").innerHTML = mahSecenek(); $("#r-mah").value = "Şirinyalı";

  $("#cihaz-izg").addEventListener("click", function (e) { var b = e.target.closest(".cihaz"); if (!b) return; K.cihaz = b.dataset.c; $$(".cihaz").forEach(function (x) { x.classList.toggle("sec", x === b); }); teshis(); setTimeout(function () { if (K.adim === 0) git(1); }, 380); });
  $("#marka-l").addEventListener("click", function (e) { var b = e.target.closest(".yonga"); if (!b) return; K.marka = b.dataset.m; $$("#marka-l .yonga").forEach(function (x) { x.classList.toggle("sec", x === b); }); teshis(); });
  $("#belirti-l").addEventListener("click", function (e) {
    var b = e.target.closest(".yonga"); if (!b) return; var id = b.dataset.b, i = K.bel.indexOf(id);
    if (i < 0) K.bel.push(id); else K.bel.splice(i, 1); b.classList.toggle("sec", i < 0); teshis();
  });
  $("#model").addEventListener("input", teshis);

  function teshis() {
    var c = ABS.cihazlar.find(function (x) { return x.id === K.cihaz; });
    $("#t-cihaz").textContent = c ? c.ad : "—";
    $("#t-marka").textContent = K.marka ? K.marka + ($("#model").value ? " " + $("#model").value : "") : "—";
    var bs = K.bel.map(function (id) { return ABS.belirtiler.find(function (x) { return x.id === id; }); });
    $("#t-belirti").textContent = bs.length ? bs.map(function (b) { return b.ad; }).join(", ") : "—";
    $("#t-foto").textContent = K.foto.length;
    $("#t-baslik").textContent = c ? (K.marka ? K.marka + " " : "") + c.ad.split(" /")[0].toLowerCase() : "Cihaz seçin";
    var ned = []; bs.forEach(function (b) { b.neden.forEach(function (n) { if (ned.indexOf(n) < 0) ned.push(n); }); });
    $("#t-neden").innerHTML = ned.length ? ned.slice(0, 5).map(function (n, i) { return '<li style="animation-delay:' + i * .06 + 's"><i>' + (i + 1) + "</i>" + n + "</li>"; }).join("") : '<li style="color:var(--soluk-k)">Belirti seçince burada görünür.</li>';
    var ti = $("#t-islem");
    if (bs.length) {
      var is = ABS.islemler.find(function (x) { return x.id === bs[0].islem; }), k = c ? c.kat : 1;
      ti.innerHTML = '<div class="mono" style="color:var(--soluk-k);margin-bottom:6px">Muhtemel işlem</div><b>' + is.ad + '</b><div style="color:var(--mavi3);font-size:14px;margin:2px 0 10px">Örnek aralık ' + U.tl(U.yuvarla(is.min * k)) + " – " + U.tl(U.yuvarla(is.max * k)) + " · " + is.gun + '</div><button class="dg cizgi kucuk" type="button" id="t-fiyat">Fiyat sihirbazında aç</button>';
      $("#t-fiyat").onclick = function () { F.cihaz = K.cihaz || "laptop"; F.islem = is.id; fiyatCiz(); location.hash = ""; $("#fiyat").scrollIntoView({ behavior: AZ ? "auto" : "smooth" }); };
    } else ti.innerHTML = "";
  }

  function git(n) {
    K.adim = n;
    $$(".adimk").forEach(function (a) { a.classList.toggle("ac", +a.dataset.a === n); });
    $$("#ilerleme div").forEach(function (d, i) { d.className = i < n ? "ok" : i === n ? "ak" : ""; });
    $("#sih-alt").style.display = n === 5 ? "none" : "";
    $("#geri").style.visibility = n === 0 ? "hidden" : "visible";
    $("#adim-yazi").textContent = Math.min(n + 1, 5) + " / 5";
    $("#ileri").textContent = n === 4 ? "Kaydı oluştur ✓" : n === 3 && !K.foto.length ? "Fotoğrafsız devam →" : "Devam →";
  }
  $("#geri").onclick = function () { if (K.adim > 0) git(K.adim - 1); };
  $("#ileri").onclick = function () {
    if (K.adim === 0 && !K.cihaz) return U.tost("Önce cihaz türünü seçin.");
    if (K.adim === 1 && !K.marka) return U.tost("Bir marka seçin (bilmiyorsanız <b>Diğer</b>).");
    if (K.adim === 2 && !K.bel.length) return U.tost("En az bir belirti seçin.");
    if (K.adim === 4) return kaydet();
    git(K.adim + 1);
  };
  git(0);
  $("#demo-doldur").onclick = function () {
    K.cihaz = "laptop"; K.marka = "Lenovo"; K.bel = ["isinma", "yavas"]; $("#model").value = "IdeaPad 3 15ITL6";
    $$(".cihaz").forEach(function (x) { x.classList.toggle("sec", x.dataset.c === "laptop"); });
    $$("#marka-l .yonga").forEach(function (x) { x.classList.toggle("sec", x.dataset.m === "Lenovo"); });
    $$("#belirti-l .yonga").forEach(function (x) { x.classList.toggle("sec", K.bel.indexOf(x.dataset.b) >= 0); });
    $("#aciklama").value = "Oyun açınca 10 dakikada çok ısınıyor, fan yüksek ses yapıyor.";
    teshis(); git(3);
  };

  var sonKayit = null;
  function kaydet() {
    var no = "ABS-" + (24132 + Math.floor(Math.random() * 6)), c = ABS.cihazlar.find(function (x) { return x.id === K.cihaz; });
    var ad = $("#ad").value.trim() || "Değerli müşterimiz", cihaz = K.marka + ($("#model").value ? " " + $("#model").value : "") + " " + c.ad.split(" /")[0].toLowerCase();
    sonKayit = { no: no, ad: ad, cihaz: cihaz, mah: $("#mah").value, bel: K.bel.map(function (id) { return ABS.belirtiler.find(function (x) { return x.id === id; }).ad; }).join(", ") };
    $("#kayit-kod").textContent = no; $("#t-kod").value = no; git(5);
    $("#r-mah").value = sonKayit.mah; mahSec(sonKayit.mah);
    wa.ekle("Merhaba " + ad.split(" ")[0] + ", " + cihaz + " için arıza kaydınız alındı. Kayıt no: <b>" + no + "</b>. Kurye saatini seçtiğinizde onay mesajı gelecek. Takip: antalyabilgisayarservisi.com/takip/" + no.slice(4));
    U.tost("Kayıt <b>" + no + "</b> oluşturuldu · WhatsApp önizlemesine düştü");
  }

  /* fotoğraflar */
  function fotoEkle(src) { if (K.foto.length >= 6) return; K.foto.push(src); fotoCiz(); teshis(); git(K.adim); }
  function fotoCiz() {
    $("#kucukler").innerHTML = K.foto.map(function (s, i) { return '<figure><img src="' + s + '" alt="Arıza fotoğrafı ' + (i + 1) + '"><button type="button" data-s="' + i + '" aria-label="Sil">×</button></figure>'; }).join("");
  }
  $("#kucukler").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; K.foto.splice(+b.dataset.s, 1); fotoCiz(); teshis(); git(K.adim); });
  $("#foto").addEventListener("change", function () { Array.prototype.forEach.call(this.files, function (f) { fotoEkle(URL.createObjectURL(f)); }); this.value = ""; });
  var bk = $("#birak");
  ["dragenter", "dragover"].forEach(function (t) { bk.addEventListener(t, function (e) { e.preventDefault(); bk.classList.add("ust"); }); });
  ["dragleave", "drop"].forEach(function (t) { bk.addEventListener(t, function (e) { e.preventDefault(); bk.classList.remove("ust"); }); });
  bk.addEventListener("drop", function (e) { Array.prototype.forEach.call(e.dataTransfer.files, function (f) { if (/^image/.test(f.type)) fotoEkle(URL.createObjectURL(f)); }); });
  $("#ornek-foto").onclick = function () {
    var cv = document.createElement("canvas"); cv.width = 320; cv.height = 240; var x = cv.getContext("2d");
    var g = x.createLinearGradient(0, 0, 320, 240); g.addColorStop(0, "#1a2140"); g.addColorStop(1, "#05060c"); x.fillStyle = g; x.fillRect(0, 0, 320, 240);
    x.fillStyle = "#2a3466"; x.fillRect(30, 26, 260, 160); var g2 = x.createLinearGradient(30, 26, 290, 186); g2.addColorStop(0, "#3f6fe0"); g2.addColorStop(1, "#0d1640"); x.fillStyle = g2; x.fillRect(38, 32, 244, 148);
    var ox = 90 + Math.random() * 140, oy = 60 + Math.random() * 90; x.strokeStyle = "rgba(255,255,255,.85)"; x.lineWidth = 1.3;
    for (var i = 0; i < 14; i++) { x.beginPath(); x.moveTo(ox, oy); var px = ox, py = oy, a = Math.random() * 6.28; for (var s = 0; s < 6; s++) { a += (Math.random() - .5) * .8; px += Math.cos(a) * 22; py += Math.sin(a) * 22; x.lineTo(px, py); } x.stroke(); }
    for (var j = 0; j < 6; j++) { x.fillStyle = "rgba(255,80,160," + (.3 + Math.random() * .4) + ")"; x.fillRect(38 + Math.random() * 244, 32, 2, 148); }
    x.fillStyle = "#c9ced9"; x.fillRect(10, 186, 300, 40); x.fillStyle = "#11152c"; for (var k = 0; k < 12; k++) x.fillRect(22 + k * 23, 194, 18, 10);
    fotoEkle(cv.toDataURL("image/jpeg", .85));
  };

  /* ---------- 4. Fiyat tahmini ---------- */
  var F = { cihaz: "laptop", islem: "fan", parca: "muadil", hiz: "std", bolge: "muratpasa" }, onceki = [900, 1600];
  $("#f-cihaz").innerHTML = ABS.cihazlar.map(function (c) { return '<button type="button" class="yonga" data-v="' + c.id + '">' + c.ad + "</button>"; }).join("");
  $("#f-islem").innerHTML = ABS.islemler.map(function (i) { return '<button type="button" class="islem" data-v="' + i.id + '"><span>' + i.ad + "</span><small>" + i.gun + "</small></button>"; }).join("");
  $("#f-bolge").innerHTML = ABS.bolgeler.map(function (b) { return '<button type="button" data-v="' + b.id + '">' + b.ad.split(" ·")[0] + "</button>"; }).join("");
  function bagla(sel, alan, ad) { $(sel).addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; F[alan] = b.dataset.v; fiyatCiz(); }); }
  bagla("#f-cihaz", "cihaz"); bagla("#f-islem", "islem"); bagla("#f-parca", "parca"); bagla("#f-hiz", "hiz"); bagla("#f-bolge", "bolge");
  function sayac(el, a, b, c, d) {
    var t0 = performance.now(), sure = AZ ? 0 : 520;
    (function k(t) { var p = Math.min(1, (t - t0) / (sure || 1)), e = 1 - Math.pow(1 - p, 3);
      el.innerHTML = U.tl(U.yuvarla(a + (c - a) * e, 10)) + "<span>–</span>" + U.tl(U.yuvarla(b + (d - b) * e, 10)); if (p < 1) requestAnimationFrame(k); })(t0);
  }
  function fiyatCiz() {
    $$("#f-cihaz button").forEach(function (b) { b.classList.toggle("sec", b.dataset.v === F.cihaz); });
    $$("#f-islem button").forEach(function (b) { b.classList.toggle("sec", b.dataset.v === F.islem); });
    $$("#f-parca button").forEach(function (b) { b.classList.toggle("sec", b.dataset.v === F.parca); });
    $$("#f-hiz button").forEach(function (b) { b.classList.toggle("sec", b.dataset.v === F.hiz); });
    $$("#f-bolge button").forEach(function (b) { b.classList.toggle("sec", b.dataset.v === F.bolge); });
    var c = ABS.cihazlar.find(function (x) { return x.id === F.cihaz; }), is = ABS.islemler.find(function (x) { return x.id === F.islem; }), bo = ABS.bolgeler.find(function (x) { return x.id === F.bolge; });
    var mn = is.min * c.kat, mx = is.max * c.kat, sat = [["İşlem · " + is.ad, U.tl(U.yuvarla(mn)) + " – " + U.tl(U.yuvarla(mx))]];
    if (c.kat !== 1) sat.push(["Cihaz türü · " + c.ad, (c.kat > 1 ? "+" : "−") + Math.round(Math.abs(c.kat - 1) * 100) + "%"]);
    if (F.parca === "orijinal") { if (is.parca) { mn *= 1.15; mx *= 1.3; sat.push(["Orijinal parça", "+15–30%"]); } else sat.push(["Orijinal parça", "parça yok"]); }
    if (F.hiz === "eks") { mn *= 1.2; mx *= 1.2; sat.push(["Ekspres öncelik", "+20%"]); }
    mn += bo.ucret; mx += bo.ucret; sat.push(["Kapıdan alım + teslim · " + bo.ad, bo.ucret ? U.tl(bo.ucret) : "dahil"]);
    mn = U.yuvarla(mn); mx = U.yuvarla(mx);
    sayac($("#f-aralik"), onceki[0], onceki[1], mn, mx); onceki = [mn, mx];
    $("#f-sure").textContent = "Tahmini süre: " + (F.hiz === "eks" && is.gun !== "Aynı gün" ? "öncelikli sıra, " : "") + is.gun.toLowerCase();
    var b = $("#f-bant"); b.style.left = Math.min(96, mn / 100) + "%"; b.style.width = Math.max(2, Math.min(100 - mn / 100, (mx - mn) / 100)) + "%";
    $("#f-kirilim").innerHTML = sat.map(function (s) { return "<li><span>" + s[0] + "</span><b>" + s[1] + "</b></li>"; }).join("");
  }
  fiyatCiz();
  $("#f-kayit").onclick = function () {
    K.cihaz = F.cihaz; $$(".cihaz").forEach(function (x) { x.classList.toggle("sec", x.dataset.c === F.cihaz); });
    var bel = ABS.belirtiler.find(function (b) { return b.islem === F.islem; });
    if (bel && K.bel.indexOf(bel.id) < 0) { K.bel.push(bel.id); $$("#belirti-l .yonga").forEach(function (x) { x.classList.toggle("sec", K.bel.indexOf(x.dataset.b) >= 0); }); }
    teshis(); git(1); $("#kayit").scrollIntoView({ behavior: AZ ? "auto" : "smooth" });
  };

  /* ---------- 5. Kapıdan alım randevusu ---------- */
  var R = { mah: "Şirinyalı", gun: 0, slot: null };
  var H = ABSHarita($("#r-harita"), { id: "r", mahalleTik: function (m) { $("#r-mah").value = m.ad; mahSec(m.ad); }, bolgeTik: function (b) { var m = ABS.mahalleler.find(function (x) { return x.b === b; }); $("#r-mah").value = m.ad; mahSec(m.ad); } });
  $("#r-mah").onchange = function () { mahSec(this.value); };
  var GA = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], bugun = new Date();
  function gunT(i) { var d = new Date(bugun); d.setDate(d.getDate() + i); return d; }
  $("#r-gun").innerHTML = [0, 1, 2, 3, 4, 5, 6].map(function (i) { var d = gunT(i); return '<button type="button" class="gun" data-g="' + i + '"><small>' + (i === 0 ? "Bugün" : GA[d.getDay()]) + "</small><b>" + d.getDate() + "</b></button>"; }).join("");
  $("#r-gun").addEventListener("click", function (e) { var b = e.target.closest(".gun"); if (!b) return; R.gun = +b.dataset.g; R.slot = null; randevuCiz(); });
  $("#r-slot").addEventListener("click", function (e) { var b = e.target.closest(".slot"); if (!b) return; R.slot = +b.dataset.s; randevuCiz(); });
  function durum(g, s) {
    if (g === 0 && bugun.getHours() >= 9 + s * 3 + 1) return "dolu";
    var m = ABS.mahalleler.find(function (x) { return x.ad === R.mah; }), h = (g * 7 + s * 3 + (m ? m.x : 0)) % 11;
    return h < 2 ? "dolu" : h < 5 ? "az" : "uygun";
  }
  function mahSec(ad) {
    R.mah = ad; var m = ABS.mahalleler.find(function (x) { return x.ad === ad; }); H.mahalle(ad); H.bolge(m.b);
    var u = H.ust; u.innerHTML = ""; var a = ABS.atolye, mx = (a.x + m.x) / 2, my = Math.min(a.y, m.y) - 70;
    var d = "M" + a.x + "," + a.y + " Q" + mx + "," + my + " " + m.x + "," + m.y;
    var p = H.el("path", { d: d, fill: "none", stroke: "#FF7A2E", "stroke-width": 3, "stroke-dasharray": "8 8", "stroke-linecap": "round" }, u);
    H.el("animate", { attributeName: "stroke-dashoffset", from: 64, to: 0, dur: "1.2s", repeatCount: "indefinite" }, p);
    var v = H.el("g", {}, u); H.el("circle", { r: 9, fill: "#fff" }, v); H.el("circle", { r: 5, fill: "#246AF4" }, v);
    H.el("animateMotion", { dur: "3.2s", repeatCount: "indefinite", path: d }, v);
    randevuCiz();
  }
  function randevuCiz() {
    $$("#r-gun .gun").forEach(function (b) { b.classList.toggle("sec", +b.dataset.g === R.gun); });
    $("#r-slot").innerHTML = ABS.saatler.map(function (s, i) {
      var du = durum(R.gun, i); if (R.slot === i && du === "dolu") R.slot = null;
      return '<button type="button" class="slot ' + du + (R.slot === i ? " sec" : "") + '" data-s="' + i + '"><b>' + s + "</b><small>" + (du === "dolu" ? "Dolu" : du === "az" ? "Son 1 yer" : "Uygun") + "</small></button>";
    }).join("");
    var m = ABS.mahalleler.find(function (x) { return x.ad === R.mah; }), b = ABS.bolgeler.find(function (x) { return x.id === m.b; }), d = gunT(R.gun);
    $("#r-ozet").innerHTML = "<div><b>" + R.mah + "</b> · " + b.ad + "</div><div>" + d.getDate() + " " + AY[d.getMonth()] + " " + GA[d.getDay()] + " · " + (R.slot == null ? '<span class="soluk">saat aralığı seçin</span>' : "<b>" + ABS.saatler[R.slot] + "</b>") + '</div><div class="soluk">Kapıdan alım ve teslim: ' + (b.ucret ? U.tl(b.ucret) + " (örnek)" : "ücretsiz (örnek)") + "</div>";
    $("#r-onay").disabled = R.slot == null;
  }
  mahSec("Şirinyalı");
  $("#r-onay").onclick = function () {
    var d = gunT(R.gun), zaman = d.getDate() + " " + AY[d.getMonth()] + " " + GA[d.getDay()] + " " + ABS.saatler[R.slot];
    var no = sonKayit ? sonKayit.no : "ABS-24132", ad = sonKayit ? sonKayit.ad.split(" ")[0] : "Selin";
    wa.ekle(ad + ", kapıdan alım randevunuz onaylandı: <b>" + zaman + "</b>, " + R.mah + ". Kurye yola çıkınca canlı konum göndereceğiz. Kayıt: " + no, null, "Randevuyu değiştir");
    U.tost("Randevu onaylandı · <b>" + zaman + "</b>");
    this.textContent = "Randevu onaylandı ✓"; var t = this; setTimeout(function () { t.textContent = "Randevuyu onayla"; }, 2600);
  };

  /* ---------- 6. Canlı onarım takibi ---------- */
  var IKN = ['<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" fill="none" stroke="#fff" stroke-width="2"/>', '<circle cx="11" cy="11" r="6" fill="none" stroke="#fff" stroke-width="2"/><path d="M20 20l-4-4" stroke="#fff" stroke-width="2"/>',
    '<path d="M12 3v18M7 8h7a3 3 0 0 1 0 6H8" fill="none" stroke="#fff" stroke-width="2"/>', '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" fill="none" stroke="#fff" stroke-width="1.8"/>', '<path d="M20 6L9 17l-5-5" fill="none" stroke="#fff" stroke-width="2.4"/>'];
  var DURUM = ["Kurye yolda", "Teşhiste", "Onay bekliyor", "Onarımda", "Teslimata çıktı", "Teslim edildi"];
  var S = { cur: 2, saat: T.adimlar.map(function (a) { return a.saat; }), kayit: null };
  var fanFoto = '<svg viewBox="0 0 86 64"><rect width="86" height="64" fill="#1B1F33"/><circle cx="43" cy="32" r="22" fill="#2B2F45" stroke="#8B8F9F"/>' + [0, 1, 2, 3, 4, 5].map(function (i) { var a = i * 1.047; return '<path d="M43 32 L' + (43 + Math.cos(a) * 20) + " " + (32 + Math.sin(a) * 20) + '" stroke="#9A9EAE" stroke-width="5"/>'; }).join("") + '<circle cx="43" cy="32" r="6" fill="#555"/>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) { return '<circle cx="' + (20 + (i * 37) % 48) + '" cy="' + (12 + (i * 23) % 40) + '" r="1.6" fill="#C9B79A" opacity=".8"/>'; }).join("") + '<rect x="2" y="50" width="38" height="12" rx="3" fill="rgba(0,0,0,.6)"/><text x="6" y="59" font-size="7.5" fill="#fff" font-family="Geist Mono">TOZ · FAN</text></svg>';
  var macunFoto = '<svg viewBox="0 0 86 64"><rect width="86" height="64" fill="#0E2A52"/><rect x="26" y="16" width="34" height="32" rx="3" fill="#9AA3C7"/><path d="M30 22 q8 6 4 14 q6 2 12-4 q6 6 10 2" stroke="#7a6a52" stroke-width="5" fill="none" opacity=".9"/><rect x="2" y="50" width="52" height="12" rx="3" fill="rgba(0,0,0,.6)"/><text x="6" y="59" font-size="7.5" fill="#fff" font-family="Geist Mono">KURU MACUN</text></svg>';
  function toplam() { return T.teklif.kalem.reduce(function (a, k) { return a + k[1]; }, 0); }
  function takipCiz() {
    var kay = S.kayit;
    $("#tk-no").textContent = (kay ? kay.no : T.kod) + " · ÖRNEK KAYIT";
    $("#tk-cihaz").textContent = kay ? kay.cihaz : T.cihaz;
    $("#tk-alt").textContent = kay ? kay.ad + " · " + kay.mah + " · " + kay.bel : T.musteri + " · " + T.mahalle + " · " + T.belirti;
    var dr = $("#tk-durum"), bitti = S.cur >= 5;
    dr.className = "roz " + (bitti ? "iyi" : "kor canli"); dr.style.background = bitti ? "rgba(20,168,107,.18)" : "rgba(255,122,46,.16)"; dr.style.color = bitti ? "#5BE0A6" : "#FFB27F";
    dr.innerHTML = '<span class="n"></span>' + DURUM[Math.min(S.cur, 5)];
    $("#zc").innerHTML = T.adimlar.map(function (a, i) {
      var cls = i < S.cur ? "ok" : i === S.cur ? "ak" : "", not = a.not, ek = "";
      if (kay && i === 0 && S.cur === 0) not = "Kurye randevu saatinde kapınızda olacak; cihaz mühürlü servis poşetinde alınır.";
      if (i === 1 && i < S.cur && !kay) ek = '<div class="teshis-foto">' + fanFoto + macunFoto + "</div>";
      if (i === 2 && i === S.cur) ek = '<div class="teklif"><ul>' + T.teklif.kalem.map(function (k) { return "<li><span>" + k[0] + "</span><span>" + (k[1] ? U.tl(k[1]) : "dahil") + "</span></li>"; }).join("") + '<li class="top"><span>Net tutar (örnek)</span><span>' + U.tl(toplam()) + '</span></li></ul><div class="dgler"><button class="dg kor kucuk" id="tk-onay" type="button">Onaylıyorum</button><button class="dg cizgi kucuk" id="tk-soru" type="button">Soru sor</button></div></div>';
      if (i === 2 && i < S.cur) not = "Onaylandı · " + U.tl(toplam()) + " (örnek tutar).";
      if (i === 4 && i === S.cur) ek = '<div class="kurye-harita"><svg id="tk-harita"></svg></div><div style="font-size:13.5px;color:#FFB27F;margin-top:8px">Kurye Okan yolda · yaklaşık 18 dk</div>';
      return '<li class="' + cls + '"><span class="nk"><svg viewBox="0 0 24 24">' + IKN[i] + '</svg></span><div class="ust-s"><b>' + a.ad + "</b><time>" + (S.saat[i] || (i === S.cur ? "şimdi" : "bekliyor")) + "</time></div><p>" + not + "</p>" + ek + "</li>";
    }).join("");
    var on = $("#tk-onay"); if (on) on.onclick = onayla;
    var so = $("#tk-soru"); if (so) so.onclick = function () { wa.ekle("Takılan fan orijinal mi?", "ben"); setTimeout(function () { wa.ekle("Uyumlu muadil fan; 6 ay parça garantili (örnek). İsterseniz orijinal parça fiyatını da gönderelim."); }, 900); };
    var th = $("#tk-harita");
    if (th) {
      var hk = ABSHarita(th, { id: "t", viewBox: "330 270 420 236" }); th.classList.add("yakin"), at = ABS.atolye, m = ABS.mahalleler.find(function (x) { return x.ad === (kay ? kay.mah : T.mahalle); }) || ABS.mahalleler[8];
      hk.mahalle(m.ad); var d = "M" + at.x + "," + at.y + " Q" + (at.x + m.x) / 2 + "," + (Math.max(at.y, m.y) + 10) + " " + m.x + "," + m.y;
      hk.el("path", { d: d, fill: "none", stroke: "#FF7A2E", "stroke-width": 2, "stroke-dasharray": "4 4" }, hk.ust);
      var v = hk.el("g", {}, hk.ust); hk.el("circle", { r: 6, fill: "#fff" }, v); hk.el("circle", { r: 3.5, fill: "#FF7A2E" }, v);
      hk.el("animateMotion", { dur: "6s", repeatCount: "indefinite", path: d }, v);
    }
    $("#sim-ileri").disabled = S.cur >= 5;
  }
  function onayla() {
    S.saat[2] = "Bugün " + U.saat(); S.cur = 3; takipCiz();
    wa.ekle("Onaylıyorum ✓", "ben");
    setTimeout(function () { wa.ekle("Onayınız alındı, teşekkürler. Onarım başladı; bittiğinde haber vereceğiz. 🔧"); }, 800);
    U.tost("Fiyat onaylandı · onarım başladı");
  }
  function ileri() {
    var no = S.kayit ? S.kayit.no : T.kod, ad = S.kayit ? S.kayit.ad.split(" ")[0] : "Selin";
    if (S.cur === 0) { S.saat[0] = "Bugün " + U.saat(); S.cur = 1; wa.ekle("Cihazınız teslim alındı. Mühürlü poşet no: 0" + (400 + Math.floor(Math.random() * 99)) + ". Teşhis sonucu bugün gelecek."); }
    else if (S.cur === 1) { S.saat[1] = "Bugün " + U.saat(); S.cur = 2; wa.ekle(no + " teşhis tamamlandı. Net tutar " + U.tl(toplam()) + ". Onaylamak için: antalyabilgisayarservisi.com/takip/" + no.slice(4) + " · Onayınız olmadan işlem yapılmaz.", null, "Teklifi gör ve onayla"); }
    else if (S.cur === 2) return onayla();
    else if (S.cur === 3) { S.saat[3] = "Bugün " + U.saat(); S.cur = 4; wa.ekle("Müjde " + ad + "! Cihazınız onarıldı ve 2 saatlik yük testinden geçti. Kuryemiz Okan yola çıktı, yaklaşık 18 dk. Canlı konum: antalyabilgisayarservisi.com/k/" + no.slice(4)); }
    else if (S.cur === 4) { S.saat[4] = "Bugün " + U.saat(); S.cur = 5; wa.ekle("Cihazınız teslim edildi. İyi günlerde kullanın! Deneyiminizi Google'da paylaşır mısınız? g.page/bb-bilgisayar/yorum", null, "Yorum yaz"); U.tost("Teslim edildi · yorum bağlantısı gönderildi"); }
    takipCiz();
  }
  $("#sim-ileri").onclick = ileri;
  function baslangic() {
    S.kayit = null; S.cur = 2; S.saat = T.adimlar.map(function (a) { return a.saat; }); wa.temizle();
    wa.ekle("Merhaba Selin Hanım, Lenovo IdeaPad 3 için arıza kaydınız alındı. Kayıt no: <b>ABS-24117</b>. Kurye randevunuz: Pzt 09:00–12:00. Takip: antalyabilgisayarservisi.com/takip/24117");
    wa.ekle("Cihazınız 10:42'de kapınızdan teslim alındı. Mühürlü poşet no: 0417.");
    wa.ekle("ABS-24117 teşhis tamamlandı: fan rulmanı aşınmış, termal macun kurumuş. Net tutar " + U.tl(toplam()) + ". Onayınız olmadan işlem yapılmaz.", null, "Teklifi gör ve onayla");
    takipCiz();
  }
  $("#sim-bas").onclick = baslangic;
  $("#t-sorgu").onclick = function () {
    var k = $("#t-kod").value.trim().toUpperCase();
    if (sonKayit && k === sonKayit.no) { S.kayit = sonKayit; S.cur = 0; S.saat = ["", "", "", "", ""]; takipCiz(); U.tost("<b>" + k + "</b> bulundu · kurye randevusu bekleniyor"); return; }
    if (k === T.kod) { baslangic(); return; }
    U.tost("Prototipte <b>ABS-24117</b> örnek kaydı ve sizin oluşturduğunuz kayıt sorgulanabilir.");
  };
  baslangic();

  U.gorunme();
})();
