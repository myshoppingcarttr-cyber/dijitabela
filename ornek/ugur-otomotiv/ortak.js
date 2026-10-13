/* Uğur Otomotiv · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: arabam.com galeri sayfası (Gülveren, kapalı halk pazarı oto galericiler sitesi No:48 D, Kepez; 0532 297 59 22 / 0242 922 04 16).
   Araçlar, fiyatlar ve oranlar ÖRNEKTİR; gerçek stok değildir. Hiçbir form gönderim yapmaz. */
(function () {
  "use strict";
  var U = {
    ad: "Uğur Otomotiv",
    adres: "Gülveren, kapalı halk pazarı oto galericiler sitesi No:48 D, Kepez / Antalya",
    tel1: "0532 297 59 22", tel2: "0242 922 04 16",
    wa: "905322975922",
    kaynak: "https://www.arabam.com/galeri/ugur-otomotiv-antalya"
  };
  U.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Uğur Otomotiv Kapalı Halk Pazarı Oto Galericiler Sitesi No:48 D Kepez Antalya");
  /* ÖRNEK araçlar */
  U.arac = [
    { id: 1, marka: "Renault", model: "Clio", pk: "1.5 dCi Joy", yil: 2019, km: 98000, yakit: "Dizel", vites: "Manuel", tip: "hatchback", renk: "#C9CED6", fiyat: 745000 },
    { id: 2, marka: "Fiat", model: "Egea", pk: "1.4 Fire Easy", yil: 2020, km: 76000, yakit: "Benzin", vites: "Manuel", tip: "sedan", renk: "#F1F1EE", fiyat: 820000 },
    { id: 3, marka: "Volkswagen", model: "Passat", pk: "1.6 TDI Comfortline", yil: 2018, km: 142000, yakit: "Dizel", vites: "Otomatik", tip: "sedan", renk: "#2B3441", fiyat: 1150000 },
    { id: 4, marka: "Dacia", model: "Duster", pk: "1.5 dCi Comfort", yil: 2021, km: 61000, yakit: "Dizel", vites: "Manuel", tip: "suv", renk: "#7D8B6A", fiyat: 1240000 },
    { id: 5, marka: "Hyundai", model: "i20", pk: "1.4 MPI Style", yil: 2018, km: 88000, yakit: "Benzin", vites: "Otomatik", tip: "hatchback", renk: "#B8352B", fiyat: 690000 },
    { id: 6, marka: "Toyota", model: "Corolla", pk: "1.6 Vision", yil: 2019, km: 83000, yakit: "Benzin", vites: "Otomatik", tip: "sedan", renk: "#D9DBDF", fiyat: 960000, foto: "gercek-1.webp" },
    { id: 7, marka: "Ford", model: "Focus", pk: "1.6 Trend", yil: 2005, km: 212000, yakit: "Benzin", vites: "Manuel", tip: "hatchback", renk: "#1F2630", fiyat: 385000, foto: "gercek-2.webp" },
    { id: 8, marka: "Nissan", model: "Qashqai", pk: "1.5 dCi Black Edition", yil: 2016, km: 171000, yakit: "Dizel", vites: "Manuel", tip: "suv", renk: "#1F2630", fiyat: 905000 },
    { id: 9, marka: "Opel", model: "Astra", pk: "1.6 CDTI Enjoy", yil: 2017, km: 129000, yakit: "Dizel", vites: "Otomatik", tip: "hatchback", renk: "#3E6B94", fiyat: 780000 },
    { id: 10, marka: "Peugeot", model: "207", pk: "1.4 VTi Trendy", yil: 2010, km: 168000, yakit: "Benzin", vites: "Manuel", tip: "hatchback", renk: "#8E9399", fiyat: 420000, foto: "gercek-3.webp" },
    { id: 11, marka: "Skoda", model: "Octavia", pk: "1.6 TDI Elegance", yil: 2019, km: 118000, yakit: "Dizel", vites: "Otomatik", tip: "sedan", renk: "#E8E2D2", fiyat: 1085000 },
    { id: 12, marka: "Kia", model: "Sportage", pk: "1.6 GDI Concept", yil: 2020, km: 69000, yakit: "Benzin", vites: "Otomatik", tip: "suv", renk: "#9C2F2F", fiyat: 1480000 }
  ];
  /* Gerçek ilan fotoğrafı olan araçlar (arabam.com galerisi; plaka bulanık). Yıl/km/fiyat ÖRNEKTİR. */
  U.fotolu = function () { return U.arac.filter(function (a) { return a.foto; }); };
  U.resim = function (a, kls) { return '<img class="arac-foto ' + (kls || "") + '" src="../img/' + a.foto + '" alt="' + a.marka + " " + a.model + ' ilan fotoğrafı" loading="lazy" decoding="async">'; };
  U.tipAd = { hatchback: "Hatchback", sedan: "Sedan", suv: "SUV", pickup: "Pikap" };
  U.tl = function (n) { return Number(n).toLocaleString("tr-TR") + " TL"; };
  U.kmf = function (n) { return Number(n).toLocaleString("tr-TR") + " km"; };
  U.ad2 = function (a) { return a.marka + " " + a.model; };
  U.bul = function (id) { return U.arac.filter(function (a) { return a.id === Number(id); })[0]; };
  /* Süzme */
  U.suz = function (f) {
    f = f || {}; var q = (f.q || "").toLocaleLowerCase("tr").trim();
    var r = U.arac.filter(function (a) {
      if (f.tip && f.tip !== "hepsi" && a.tip !== f.tip) return false;
      if (f.yakit && f.yakit !== "hepsi" && a.yakit !== f.yakit) return false;
      if (f.vites && f.vites !== "hepsi" && a.vites !== f.vites) return false;
      if (f.max && a.fiyat > Number(f.max)) return false;
      if (q && (a.marka + " " + a.model + " " + a.pk + " " + a.yil).toLocaleLowerCase("tr").indexOf(q) < 0) return false;
      return true;
    });
    var s = f.sirala || "yeni";
    r.sort(function (a, b) { return s === "ucuz" ? a.fiyat - b.fiyat : s === "pahali" ? b.fiyat - a.fiyat : s === "km" ? a.km - b.km : b.yil - a.yil || a.km - b.km; });
    return r;
  };
  /* Favoriler (yalnız bu tarayıcı) */
  var FK = "dj-ugur-fav";
  U.favler = function () { try { return JSON.parse(localStorage.getItem(FK) || "[]"); } catch (e) { return U._fav || []; } };
  U.favVar = function (id) { return U.favler().indexOf(Number(id)) > -1; };
  U.favDeg = function (id) {
    id = Number(id); var l = U.favler(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id);
    U._fav = l; try { localStorage.setItem(FK, JSON.stringify(l)); } catch (e) {}
    return i < 0;
  };
  /* Taksit: eşit taksitli kredi formülü. Oran kullanıcı girer; örnek hesap, banka teklifi değildir. */
  U.taksit = function (fiyat, pesin, ay, aylikOran) {
    var anapara = Math.max(0, fiyat - pesin), i = aylikOran / 100;
    if (anapara <= 0) return { aylik: 0, toplam: 0, anapara: 0 };
    var aylik = i > 0 ? anapara * i / (1 - Math.pow(1 + i, -ay)) : anapara / ay;
    return { aylik: aylik, toplam: aylik * ay, anapara: anapara };
  };
  /* WhatsApp bağlantısı: yalnız bağlantı üretir, tıklayınca kullanıcı kendi uygulamasında açar */
  U.waLink = function (m) { return "https://wa.me/" + U.wa + "?text=" + encodeURIComponent(m); };
  U.soru = function (a) { return "Merhaba, " + a.yil + " " + U.ad2(a) + " " + a.pk + " aracı hâlâ var mı? Görmek istiyorum."; };
  /* Araç çizimi: gövde tipine göre SVG illüstrasyon */
  var G = {
    sedan: "M26 138 L26 112 Q26 103 38 101 L96 94 L134 64 Q142 58 154 58 L252 58 Q266 58 276 68 L302 94 L352 100 Q372 104 374 120 L374 138 Z",
    hatchback: "M26 138 L26 110 Q26 100 38 98 L104 92 L142 60 Q150 55 162 55 L296 55 Q310 55 318 66 L342 100 Q372 104 374 120 L374 138 Z",
    suv: "M26 140 L26 104 Q26 92 40 90 L86 86 L118 50 Q126 44 138 44 L292 44 Q306 44 314 56 L334 88 L358 92 Q376 98 376 114 L376 140 Z",
    pickup: "M26 140 L26 108 Q26 98 38 96 L118 90 L152 58 Q160 52 172 52 L236 52 Q248 52 254 62 L268 86 L360 86 Q376 88 376 104 L376 140 Z"
  };
  var CAM = {
    sedan: "M108 96 L140 68 Q146 64 154 64 L196 64 L196 96 Z M206 64 L250 64 Q258 64 264 70 L286 96 L206 96 Z",
    hatchback: "M116 94 L146 66 Q152 62 160 62 L202 62 L202 94 Z M212 62 L290 62 Q298 62 304 70 L324 94 L212 94 Z",
    suv: "M98 86 L124 56 Q130 52 138 52 L190 52 L190 86 Z M200 52 L288 52 Q296 52 300 60 L318 86 L200 86 Z",
    pickup: "M128 88 L156 62 Q162 58 170 58 L206 58 L206 88 Z M216 58 L234 58 Q240 58 244 64 L256 88 L216 88 Z"
  };
  function sh(c, k) { var n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = function (x) { return Math.max(0, Math.min(255, Math.round(x * k))); }; return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")"; }
  U.svg = function (tip, renk, kls) {
    tip = G[tip] ? tip : "sedan"; renk = renk || "#B8352B";
    var id = "g" + Math.random().toString(36).slice(2, 7), yr = tip === "suv" || tip === "pickup" ? 24 : 22;
    return '<svg class="arac-svg ' + (kls || "") + '" viewBox="0 0 400 190" role="img" aria-label="Araç çizimi (örnek)" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sh(renk, 1.12) + '"/><stop offset="1" stop-color="' + sh(renk, .78) + '"/></linearGradient></defs>' +
      '<ellipse cx="200" cy="168" rx="170" ry="9" fill="#000" opacity=".18"/>' +
      '<path d="' + G[tip] + '" fill="url(#' + id + ')"/><path d="' + CAM[tip] + '" fill="#1b2430" opacity=".88"/><path d="' + CAM[tip] + '" fill="#9fc3e6" opacity=".18"/>' +
      '<rect x="30" y="118" width="22" height="7" rx="3" fill="#ffe9a8" opacity=".95"/><rect x="352" y="120" width="20" height="6" rx="3" fill="#d6403a" opacity=".9"/>' +
      '<path d="M26 138 L374 138" stroke="#000" stroke-opacity=".18" stroke-width="3"/>' +
      '<g class="te"><circle cx="100" cy="142" r="' + (yr + 3) + '" fill="#10141a"/><circle cx="100" cy="142" r="' + (yr - 8) + '" fill="#cfd5dc"/><circle cx="100" cy="142" r="6" fill="#10141a"/></g>' +
      '<g class="te"><circle cx="300" cy="142" r="' + (yr + 3) + '" fill="#10141a"/><circle cx="300" cy="142" r="' + (yr - 8) + '" fill="#cfd5dc"/><circle cx="300" cy="142" r="6" fill="#10141a"/></g></svg>';
  };
  U.etiketliOrnek = "ÖRNEK";
  window.UGUR = U;
})();
