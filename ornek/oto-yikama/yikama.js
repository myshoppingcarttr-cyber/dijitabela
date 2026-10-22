/* Dijitabela · oto yıkama + mobil yıkama modülü (G-38, 22 Eki 2026). Bağımsız dosya; hiçbir dış istek yok.
   Veri tamamen DEMO/örnek: kuyruk sayısı, fiyat listesi, boş saatler işletmenin kendi verisiyle değişir.
   Kullanım: <div data-yk="kuyruk|fiyat|abonelik|mobil"></div>  (her biri kendi kutusuna çizilir) */
(function () {
  "use strict";
  var TIP = { binek: "Binek", suv: "SUV / crossover", ticari: "Ticari / minibüs" };
  var PAKET = { dis: "Dış yıkama", icdis: "İç + dış", detay: "Detaylı temizlik" };
  // ÖRNEK fiyat listesi (TL, KDV dahil varsayım). İşletme kendi listesini girer; sayfada "örnek" etiketi vardır.
  var FIYAT = {
    tesis: { dis: { binek: 350, suv: 425, ticari: 500 }, icdis: { binek: 600, suv: 725, ticari: 850 }, detay: { binek: 1800, suv: 2200, ticari: 2600 } },
    mobil: { dis: { binek: 450, suv: 550, ticari: 650 }, icdis: { binek: 750, suv: 900, ticari: 1050 }, detay: { binek: 2200, suv: 2700, ticari: 3200 } }
  };
  var SURE_TESIS = { dis: 12, icdis: 25, detay: 60 };      // dakika (kuyruk tahmini için)
  var SURE_MOBIL = { dis: 45, icdis: 90, detay: 180 };     // dakika (saat aralığı sayısı için)
  var ABONE = {
    dis: { ad: "Dış Sınırsız", not: "Ayda sınırsız dış yıkama", f: { binek: 1490, suv: 1790, ticari: 2090 } },
    icdis: { ad: "İç-Dış Sınırsız", not: "Ayda sınırsız iç + dış yıkama", f: { binek: 2490, suv: 2990, ticari: 3490 } },
    aile: { ad: "Aile (2 araç)", not: "İki araç, ayda sınırsız dış + 4 iç temizlik", f: { binek: 2790, suv: 3290, ticari: 3790 } }
  };
  var TL = function (n) { return n.toLocaleString("tr-TR") + " TL"; };
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var H = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var uid = 0;
  function sec(name, secenekler, varsayilan, onChange) {   // erişilebilir radyo düğme grubu
    var id = "yk" + (++uid), w = H("div", "yk-sec"); w.setAttribute("role", "radiogroup");
    Object.keys(secenekler).forEach(function (k) {
      var l = H("label", "yk-chip"), i = H("input"); i.type = "radio"; i.name = id; i.value = k; if (k === varsayilan) i.checked = true;
      i.addEventListener("change", function () { onChange(k); });
      l.appendChild(i); l.appendChild(H("span", null, esc(secenekler[k]))); w.appendChild(l);
    });
    return w;
  }
  function alan(etiket, el) { var l = H("label", "yk-alan"); l.appendChild(H("span", null, esc(etiket))); l.appendChild(el); return l; }
  function girdi(tip, ph, max) { var i = H("input"); i.type = tip; i.placeholder = ph || ""; if (max) i.maxLength = max; i.autocomplete = "off"; return i; }

  /* ---------------- 1) KUYRUK ---------------- */
  function kuyruk(kok) {
    var hat = +(kok.getAttribute("data-hat") || 2), tip = "binek", paket = "dis";
    var plakalar = ["07 ••• 41", "07 ••• 18", "34 ••• 92", "07 ••• 05", "07 ••• 63", "06 ••• 27"];
    var is = [{ p: plakalar[0], t: "suv", k: "icdis", kalan: 14 }, { p: plakalar[1], t: "binek", k: "dis", kalan: 9 },
      { p: plakalar[2], t: "binek", k: "icdis", kalan: 25 }, { p: plakalar[3], t: "ticari", k: "dis", kalan: 12 }];
    var ben = null, say = 0;
    kok.innerHTML = "";
    var ust = H("div", "yk-kpi"), liste = H("ol", "yk-kuyruk"), form = H("div", "yk-form"), sonuc = H("p", "yk-sonuc"); sonuc.setAttribute("aria-live", "polite");
    var notEl = H("p", "yk-not", "Demo veri: sayılar her birkaç saniyede kendiliğinden değişir. Gerçek kullanımda işletmenin kasasından gelir. Süre tahminidir; yoğunluğa göre değişir.");
    form.appendChild(alan("Araç tipi", sec("tip", TIP, tip, function (v) { tip = v; hesap(); })));
    form.appendChild(alan("Yıkama", sec("pk", PAKET, paket, function (v) { paket = v; hesap(); })));
    var btn = H("button", "yk-btn", "Sıraya yaz (demo)"); btn.type = "button";
    form.appendChild(btn); form.appendChild(sonuc);
    kok.appendChild(ust); kok.appendChild(liste); kok.appendChild(form); kok.appendChild(notEl);
    function sureOf(j) { return j.kalan; }
    function bekleme(ekle) {            // hat sayısına bölünmüş toplam süre, 5 dk'ya yuvarlı
      var t = is.reduce(function (a, j) { return a + sureOf(j); }, 0);
      return Math.max(0, Math.round(t / hat / 5) * 5);
    }
    function hesap() {
      var b = bekleme(), kendi = SURE_TESIS[paket];
      var toplam = Math.round((is.reduce(function (a, j) { return a + j.kalan; }, 0) / hat + kendi) / 5) * 5;
      if (ben) sonuc.textContent = "Sıran: " + (is.indexOf(ben) + 1) + ". araç · tahmini başlama ~" + Math.round((is.slice(0, is.indexOf(ben)).reduce(function (a, j) { return a + j.kalan; }, 0) / hat) / 5) * 5 + " dk sonra.";
      else sonuc.textContent = "Şimdi gelirsen: " + TIP[tip] + " · " + PAKET[paket] + " için tahmini toplam ~" + toplam + " dk (bekleme ~" + b + " dk + yıkama " + kendi + " dk).";
    }
    function ciz() {
      ust.innerHTML = '<div><b>' + is.length + '</b><span>araç kuyrukta</span></div><div><b>~' + bekleme() + ' dk</b><span>tahmini bekleme</span></div><div><b>' + hat + '</b><span>açık yıkama hattı</span></div>';
      liste.innerHTML = "";
      is.forEach(function (j, i) {
        var li = H("li", j === ben ? "yk-ben" : "", '<b>' + (j === ben ? "Sen" : esc(j.p)) + '</b><span>' + TIP[j.t] + ' · ' + PAKET[j.k] + '</span><em>' + (i < hat ? "yıkamada · ~" + j.kalan + " dk kaldı" : "sırada") + '</em>');
        liste.appendChild(li);
      });
      hesap();
    }
    btn.addEventListener("click", function () {
      if (ben) { sonuc.textContent = "Zaten sıradasın. Çıkmak için sayfayı yenile (demo)."; return; }
      ben = { p: "Sen", t: tip, k: paket, kalan: SURE_TESIS[paket] }; is.push(ben); ciz();
    });
    setInterval(function () {          // demo: yıkamadakiler ilerler, bitenler çıkar, yeni araç gelir
      say++; is.forEach(function (j, i) { if (i < hat) j.kalan -= 3; });
      var bit = is.filter(function (j) { return j.kalan <= 0; });
      bit.forEach(function (j) { if (j === ben) ben = null; is.splice(is.indexOf(j), 1); });
      if (is.length < 3 || (say % 2 === 0 && is.length < 8)) { var k = ["dis", "icdis", "dis"][say % 3]; is.push({ p: plakalar[say % plakalar.length], t: ["binek", "suv", "ticari"][say % 3], k: k, kalan: SURE_TESIS[k] }); }
      is.forEach(function (j) { if (j.kalan <= 0) j.kalan = 3; }); ciz();
    }, 5000);
    ciz();
  }

  /* ---------------- 2) FİYAT ---------------- */
  function fiyat(kok) {
    var mobil = kok.getAttribute("data-tur") === "mobil", tab = mobil ? FIYAT.mobil : FIYAT.tesis;
    var t = H("table", "yk-tablo"), th = "<thead><tr><th>Yıkama</th>" + Object.keys(TIP).map(function (k) { return "<th>" + TIP[k] + "</th>"; }).join("") + "</tr></thead>";
    t.innerHTML = th + "<tbody>" + Object.keys(PAKET).map(function (p) { return "<tr><th scope='row'>" + PAKET[p] + "</th>" + Object.keys(TIP).map(function (k) { return "<td data-l='" + TIP[k] + "'>" + TL(tab[p][k]) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
    var tip = "binek", paket = "dis", o = H("p", "yk-sonuc"); o.setAttribute("aria-live", "polite");
    function g() { o.innerHTML = "Seçimin: <b>" + TIP[tip] + " · " + PAKET[paket] + "</b> → <b>" + TL(tab[paket][tip]) + "</b>"; }
    var f = H("div", "yk-form"); f.appendChild(alan("Araç tipi", sec("tip", TIP, tip, function (v) { tip = v; g(); })));
    f.appendChild(alan("Yıkama", sec("pk", PAKET, paket, function (v) { paket = v; g(); }))); f.appendChild(o);
    kok.innerHTML = ""; kok.appendChild(f); var sar = H("div", "yk-tablosar"); sar.appendChild(t); kok.appendChild(sar);
    kok.appendChild(H("p", "yk-not", "Örnek fiyat listesi: işletme kendi listesini girer. Kirli araç/aşırı kir için fark yerinde söylenir."));
    g();
  }

  /* ---------------- 3) ABONELİK ---------------- */
  function abonelik(kok) {
    var plan = "icdis", tip = "binek", adim = 1, veri = {};
    function render() {
      kok.innerHTML = "";
      var dots = H("ol", "yk-adim"); ["Plan", "Araç", "Ödeme (demo)", "Kart"].forEach(function (a, i) { dots.appendChild(H("li", i + 1 === adim ? "on" : (i + 1 < adim ? "ok" : ""), a)); }); kok.appendChild(dots);
      if (adim === 1) {
        var gr = H("div", "yk-planlar");
        Object.keys(ABONE).forEach(function (k) {
          var c = H("label", "yk-plan" + (k === plan ? " on" : "")), i = H("input"); i.type = "radio"; i.name = "plan"; i.value = k; i.checked = k === plan;
          i.addEventListener("change", function () { plan = k; render(); });
          c.appendChild(i); c.appendChild(H("div", null, "<b>" + ABONE[k].ad + "</b><span>" + ABONE[k].not + "</span><em>" + TL(ABONE[k].f[tip]) + " / ay</em>")); gr.appendChild(c);
        });
        kok.appendChild(alan("Araç tipi", sec("tip", TIP, tip, function (v) { tip = v; render(); }))); kok.appendChild(gr);
        kok.appendChild(H("p", "yk-not", "Sınırsız = adil kullanım: günde en fazla 1 yıkama (işletme belirler). Örnek fiyat; KDV dahil varsayım. İstediğin zaman iptal."));
        var b = H("button", "yk-btn", "Devam: araç bilgisi"); b.type = "button"; b.onclick = function () { adim = 2; render(); }; kok.appendChild(b);
      } else if (adim === 2) {
        var ad = girdi("text", "Ad Soyad"), pl = girdi("text", "07 ABC 123", 11), hata = H("p", "yk-hata"); hata.setAttribute("role", "alert");
        ad.value = veri.ad || ""; pl.value = veri.pl || "";
        kok.appendChild(alan("Ad Soyad", ad)); kok.appendChild(alan("Plaka" + (plan === "aile" ? " (1. araç)" : ""), pl));
        var ge = H("button", "yk-btn yk-ikinci", "Geri"), ile = H("button", "yk-btn", "Devam: ödeme"); ge.type = ile.type = "button";
        ge.onclick = function () { adim = 1; render(); };
        ile.onclick = function () {
          var p = pl.value.toUpperCase().replace(/\s+/g, " ").trim();
          if (ad.value.trim().length < 3) { hata.textContent = "Ad soyad yaz."; ad.focus(); return; }
          if (!/^\d{2} ?[A-ZÇĞİÖŞÜ]{1,3} ?\d{2,4}$/.test(p)) { hata.textContent = "Plaka biçimi: 07 ABC 123"; pl.focus(); return; }
          veri.ad = ad.value.trim(); veri.pl = p; adim = 3; render();
        };
        kok.appendChild(hata); var s = H("div", "yk-satir"); s.appendChild(ge); s.appendChild(ile); kok.appendChild(s);
      } else if (adim === 3) {
        var fy = ABONE[plan].f[tip];
        kok.appendChild(H("p", "yk-demo", "DEMO ÖDEME EKRANI — gerçek ödeme alınmaz, gerçek kart numarası girme. Aşağıya herhangi 16 rakam yaz."));
        kok.appendChild(H("p", "yk-ozet", "<b>" + ABONE[plan].ad + "</b> · " + TIP[tip] + " · " + esc(veri.pl) + " → <b>" + TL(fy) + " / ay</b>"));
        var kn = girdi("text", "0000 0000 0000 0000", 19), sk = girdi("text", "AA/YY", 5), cv = girdi("text", "CVC", 3), hata2 = H("p", "yk-hata"); hata2.setAttribute("role", "alert");
        kn.inputMode = sk.inputMode = cv.inputMode = "numeric";
        kn.addEventListener("input", function () { kn.value = kn.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); });
        sk.addEventListener("input", function () { var d = sk.value.replace(/\D/g, "").slice(0, 4); sk.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; });
        cv.addEventListener("input", function () { cv.value = cv.value.replace(/\D/g, ""); });
        kok.appendChild(alan("Kart numarası (demo)", kn)); var s2 = H("div", "yk-satir"); s2.appendChild(alan("Son kullanma", sk)); s2.appendChild(alan("CVC", cv)); kok.appendChild(s2);
        var ge2 = H("button", "yk-btn yk-ikinci", "Geri"), ode = H("button", "yk-btn", "Aboneliği başlat (demo)"); ge2.type = ode.type = "button";
        ge2.onclick = function () { adim = 2; render(); };
        ode.onclick = function () {
          var ay = +sk.value.slice(0, 2);
          if (kn.value.replace(/\s/g, "").length !== 16) { hata2.textContent = "16 haneli demo numara yaz."; kn.focus(); return; }
          if (!/^\d{2}\/\d{2}$/.test(sk.value) || ay < 1 || ay > 12) { hata2.textContent = "Son kullanma AA/YY olmalı (ay 01-12)."; sk.focus(); return; }
          if (cv.value.length !== 3) { hata2.textContent = "CVC 3 hane."; cv.focus(); return; }
          veri.son = kn.value.slice(-4); veri.kod = "AB-" + (1000 + Math.floor(Math.random() * 9000)); adim = 4; render();
        };
        kok.appendChild(hata2); var s3 = H("div", "yk-satir"); s3.appendChild(ge2); s3.appendChild(ode); kok.appendChild(s3);
      } else {
        var d = new Date(), y = new Date(d.getTime() + 30 * 864e5), f = function (x) { return x.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }); };
        var kart = H("div", "yk-uye");
        kart.innerHTML = "<small>ABONELİK KARTI · DEMO</small><b>" + esc(ABONE[plan].ad) + "</b><span>" + esc(veri.pl) + " · " + TIP[tip] + "</span><span>" + esc(veri.ad) + "</span><i aria-hidden='true'>" + qr(veri.kod) + "</i><em>" + veri.kod + " · kart •••• " + veri.son + "</em>";
        kok.appendChild(kart);
        kok.appendChild(H("p", "yk-ozet", "Başlangıç <b>" + f(d) + "</b> · sonraki yenileme <b>" + f(y) + "</b>. Kasada plakan okununca (ya da kartı okutunca) ‘abonelik geçerli’ görünür; günlük limit dolarsa uyarır."));
        var ip = H("button", "yk-btn yk-ikinci", "Aboneliği iptal et (demo)"), yn = H("button", "yk-btn", "Yeni demo"); ip.type = yn.type = "button";
        ip.onclick = function () { kok.querySelector(".yk-ozet").innerHTML = "Abonelik <b>iptal edildi</b>: bir sonraki yenilemede çekim yapılmaz; dönem sonuna kadar kullanabilirsin."; ip.disabled = true; };
        yn.onclick = function () { adim = 1; veri = {}; render(); };
        var s4 = H("div", "yk-satir"); s4.appendChild(ip); s4.appendChild(yn); kok.appendChild(s4);
      }
    }
    function qr(kod) {   // süs desen (gerçek QR değil): koddan türetilmiş kareler
      var h = 7, c = ""; for (var i = 0; i < kod.length; i++) h = (h * 31 + kod.charCodeAt(i)) >>> 0;
      for (var y = 0; y < 7; y++) for (var x = 0; x < 7; x++) { h = (h * 1103515245 + 12345) >>> 0; if ((h >> 16) & 1 || ((x < 2 || x > 4) && (y < 2 || y > 4) && (x + y) % 3 === 0)) c += "<rect x='" + x * 6 + "' y='" + y * 6 + "' width='5' height='5'/>"; }
      return "<svg viewBox='0 0 42 42' width='64' height='64' fill='currentColor'>" + c + "</svg>";
    }
    render();
  }

  /* ---------------- 4) MOBİL YIKAMA: harita → bölge → boş saat → randevu ---------------- */
  var BOLGE = {
    konyaalti: { ad: "Konyaaltı", gun: [1, 3, 5], p: "10,150 120,120 200,150 190,260 80,290 10,260", x: 100, y: 205 },
    muratpasa: { ad: "Muratpaşa", gun: [2, 4, 6], p: "200,150 300,130 360,190 340,270 190,260", x: 270, y: 205 },
    lara: { ad: "Lara", gun: [1, 4, 6], p: "360,190 470,170 560,230 540,290 340,270", x: 450, y: 235 },
    kepez: { ad: "Kepez", gun: [2, 5], p: "120,120 170,40 330,30 300,130 200,150", x: 220, y: 90 },
    aksu: { ad: "Aksu", gun: [1, 6], p: "330,30 540,50 570,130 470,170 360,190 300,130", x: 440, y: 105 },
    dosemealti: { ad: "Döşemealtı", gun: [3], p: "10,150 40,40 170,40 120,120", x: 90, y: 85 }
  };
  var KGUN = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  var GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var SLOT = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"];
  function tohum(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function mobil(kok) {
    var bolge = "", tip = "binek", paket = "icdis", gunIdx = 0, sec_ = -1, nokta = null;
    var gunler = []; for (var i = 0; i < 7; i++) { var d = new Date(); d.setDate(d.getDate() + i); gunler.push(d); }
    kok.innerHTML = "";
    var svgNS = "http://www.w3.org/2000/svg", harita = H("div", "yk-harita");
    var svg = document.createElementNS(svgNS, "svg"); svg.setAttribute("viewBox", "0 0 580 340"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Antalya şematik bölge haritası; bir bölgeye dokun");
    svg.innerHTML = "<rect width='580' height='340' class='deniz'/><path d='M0 280 L80 290 190 260 340 270 540 290 580 280 V340 H0Z' class='deniz2'/>" +
      Object.keys(BOLGE).map(function (k) { var b = BOLGE[k]; return "<polygon data-b='" + k + "' points='" + b.p + "' class='bolge' tabindex='0' role='button' aria-label='" + b.ad + "'/><text x='" + b.x + "' y='" + b.y + "' class='bad'>" + b.ad + "</text>"; }).join("") +
      "<g id='yk-pin' visibility='hidden'><path d='M0 0 C-12 -16 -10 -30 0 -30 C10 -30 12 -16 0 0Z' class='pin' transform='translate(0,0)'/><circle cx='0' cy='-20' r='4' fill='#fff'/></g>" +
      "<text x='566' y='330' text-anchor='end' class='kaynak'>şematik harita · gerçek sınır değildir</text>";
    harita.appendChild(svg); kok.appendChild(harita);
    var secEl = H("select"); secEl.innerHTML = "<option value=''>Bölge seç…</option>" + Object.keys(BOLGE).map(function (k) { return "<option value='" + k + "'>" + BOLGE[k].ad + "</option>"; }).join("");
    var adres = H("input"); adres.placeholder = "Mahalle, sokak, apartman/site, kapı no"; adres.autocomplete = "off";
    var f1 = H("div", "yk-form"); f1.appendChild(alan("Bölge (haritaya dokun ya da listeden seç)", secEl)); f1.appendChild(alan("Adres", adres)); kok.appendChild(f1);
    var f2 = H("div", "yk-form"); f2.appendChild(alan("Araç tipi", sec("tip", TIP, tip, function (v) { tip = v; ciz(); })));
    f2.appendChild(alan("Yıkama", sec("pk", PAKET, paket, function (v) { paket = v; sec_ = -1; ciz(); }))); kok.appendChild(f2);
    var gunKutu = H("div", "yk-gunler"), rota = H("p", "yk-rota"), slotKutu = H("div", "yk-slotlar"), ozet = H("div", "yk-ozet2"), hata = H("p", "yk-hata"); hata.setAttribute("role", "alert");
    var etk = H("div", "yk-etiket", "Gün"); kok.appendChild(etk); kok.appendChild(gunKutu); kok.appendChild(rota);
    kok.appendChild(H("div", "yk-etiket", "Boş saat aralıkları")); kok.appendChild(slotKutu);
    var not = alan("Park / giriş notu (opsiyonel)", H("input")); not.querySelector("input").placeholder = "Örn. site otoparkı B blok önü"; kok.appendChild(not);
    var onay = H("button", "yk-btn", "Randevuyu onayla (demo)"); onay.type = "button"; kok.appendChild(hata); kok.appendChild(onay); kok.appendChild(ozet);
    kok.appendChild(H("p", "yk-not", "Demo: saatler örnek veriyle üretilir; ekip günleri ve bölgeler işletmeye göre ayarlanır. Randevu onayı gerçek kayıt oluşturmaz."));

    function secBolge(k, px, py) {
      bolge = k; sec_ = -1; secEl.value = k; var b = BOLGE[k], p = $("#yk-pin", svg);
      p.setAttribute("transform", "translate(" + (px != null ? px : b.x) + "," + (py != null ? py + 14 : b.y + 14) + ")"); p.setAttribute("visibility", "visible");
      [].forEach.call(svg.querySelectorAll(".bolge"), function (e) { e.classList.toggle("on", e.getAttribute("data-b") === k); });
      // ekip günü olan ilk güne atla
      for (var i = 0; i < 7; i++) if (BOLGE[k].gun.indexOf(gunler[i].getDay()) >= 0) { gunIdx = i; break; }
      ciz();
    }
    function svgNokta(e) { var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return { x: (e.clientX - r.left) / r.width * vb.width, y: (e.clientY - r.top) / r.height * vb.height }; }
    svg.addEventListener("click", function (e) { var k = e.target.getAttribute && e.target.getAttribute("data-b"); if (!k) return; var n = svgNokta(e); secBolge(k, n.x, n.y); });
    svg.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute("data-b")) { e.preventDefault(); secBolge(e.target.getAttribute("data-b")); } });
    secEl.addEventListener("change", function () { if (secEl.value) secBolge(secEl.value); });

    function bosluk(k, d, i) { return tohum(k + d.toDateString() + i) > 0.35; }
    function baslangicSlotlari() {   // paket süresi kadar ardışık boş slot gerektirir
      var k = bolge, d = gunler[gunIdx], need = Math.ceil(SURE_MOBIL[paket] / 120), out = [];
      var bugun = gunIdx === 0, saat = new Date().getHours();
      for (var i = 0; i + need <= SLOT.length; i++) {
        var ok = true; for (var j = 0; j < need; j++) if (!bosluk(k, d, i + j)) ok = false;
        var gecti = bugun && (8 + 2 * i) <= saat;
        out.push({ i: i, ok: ok && !gecti, gecti: gecti, need: need });
      }
      return out;
    }
    function ciz() {
      gunKutu.innerHTML = "";
      gunler.forEach(function (d, i) {
        var ekip = bolge && BOLGE[bolge].gun.indexOf(d.getDay()) >= 0;
        var b = H("button", "yk-gun" + (i === gunIdx ? " on" : "") + (ekip ? " ekip" : " yok"), "<small>" + (i === 0 ? "Bugün" : KGUN[d.getDay()]) + "</small><b>" + d.getDate() + "</b>");
        b.type = "button"; b.disabled = !!bolge && !ekip; b.setAttribute("aria-pressed", i === gunIdx);
        b.onclick = function () { gunIdx = i; sec_ = -1; ciz(); }; gunKutu.appendChild(b);
      });
      slotKutu.innerHTML = ""; ozet.innerHTML = "";
      if (!bolge) { rota.textContent = "Önce haritadan bir bölge seç; ekibin o bölgeye gittiği günler açılır."; slotKutu.appendChild(H("p", "yk-bos", "Bölge seçilince boş saatler görünür.")); return; }
      var gunAdi = GUN[gunler[gunIdx].getDay()];
      rota.innerHTML = "<b>" + BOLGE[bolge].ad + "</b> ekip günleri: " + BOLGE[bolge].gun.map(function (g) { return GUN[g]; }).join(", ") + ". Seçili gün (" + gunAdi + ") ekip rotası: " +
        Object.keys(BOLGE).filter(function (k) { return BOLGE[k].gun.indexOf(gunler[gunIdx].getDay()) >= 0; }).map(function (k) { return BOLGE[k].ad; }).join(" → ") + ".";
      var sl = baslangicSlotlari(), var_ = false;
      sl.forEach(function (s) {
        var son = s.i + s.need - 1, etiket = SLOT[s.i].split("-")[0] + "-" + SLOT[son].split("-")[1];
        var b = H("button", "yk-slot" + (s.i === sec_ ? " on" : ""), etiket + (s.need > 1 ? "<small>" + s.need + " aralık (uzun işlem)</small>" : "")); b.type = "button";
        if (!s.ok) { b.disabled = true; b.classList.add("dolu"); b.innerHTML = etiket + "<small>" + (s.gecti ? "geçti" : "dolu") + "</small>"; } else var_ = true;
        b.setAttribute("aria-pressed", s.i === sec_); b.onclick = function () { sec_ = s.i; ciz(); }; slotKutu.appendChild(b);
      });
      if (!var_) slotKutu.appendChild(H("p", "yk-bos", "Bu gün için boş aralık kalmadı; başka bir gün seç."));
      var fy = FIYAT.mobil[paket][tip];
      ozet.innerHTML = "<b>" + TIP[tip] + " · " + PAKET[paket] + "</b> · yerinde ~" + SURE_MOBIL[paket] + " dk · örnek fiyat <b>" + TL(fy) + "</b>";
    }
    onay.addEventListener("click", function () {
      hata.textContent = "";
      if (!bolge) { hata.textContent = "Bölge seç."; return; }
      if (adres.value.trim().length < 6) { hata.textContent = "Adresi yaz (mahalle ve sokak/site en az)."; adres.focus(); return; }
      if (sec_ < 0) { hata.textContent = "Bir saat aralığı seç."; return; }
      var s = baslangicSlotlari().filter(function (x) { return x.i === sec_; })[0]; if (!s || !s.ok) { hata.textContent = "Seçtiğin aralık artık uygun değil."; return; }
      var son = sec_ + s.need - 1, kod = "YK-" + (1000 + Math.floor(tohum(adres.value + sec_) * 9000)), g = gunler[gunIdx];
      ozet.innerHTML = "<div class='yk-onay'><b>Randevu alındı (demo) · " + kod + "</b><span>" + g.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }) + " · " + SLOT[sec_].split("-")[0] + "-" + SLOT[son].split("-")[1] + "</span><span>" + esc(BOLGE[bolge].ad) + " · " + esc(adres.value.trim()) + "</span><span>" + TIP[tip] + " · " + PAKET[paket] + "</span>" +
        "<small>Ekip yola çıkınca ‘yolda’ mesajı gelir (demo). Onay metni WhatsApp’a bu biçimde düşer:</small><pre>Merhaba, " + kod + " numaralı randevunuz: " + g.getDate() + "." + (g.getMonth() + 1) + " " + SLOT[sec_].split("-")[0] + "-" + SLOT[son].split("-")[1] + ", " + esc(BOLGE[bolge].ad) + ". Ekibimiz geldiğinde arayacağız.</pre></div>";
    });
    ciz();
  }

  function basla() {
    [].forEach.call(document.querySelectorAll("[data-yk]"), function (k) {
      var t = k.getAttribute("data-yk"); try { ({ kuyruk: kuyruk, fiyat: fiyat, abonelik: abonelik, mobil: mobil })[t](k); } catch (e) { console.error("yikama.js", t, e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
