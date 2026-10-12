/* Gökhan Otomotiv · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: arabam.com (Güneş Mah. 15 Temmuz Şehitler Cd. No:96, Kepez; 0545 366 38 38).
   Araçlar, fiyatlar ve oranlar ÖRNEKTİR; gerçek stok değildir. Hiçbir form gönderim yapmaz. */
(function () {
  "use strict";
  var U = {
    ad: "Gökhan Otomotiv",
    adres: "Güneş Mah. 15 Temmuz Şehitler Cd. No:96, Kepez / Antalya",
    tel1: "0545 366 38 38", tel2: "0242 922 04 16",
    wa: "905453663838",
    kaynak: "https://www.arabam.com/galeri/gokhan-otomotiv-antalya-kepez-gunes-mahallesi"
  };
  U.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Gökhan Otomotiv Kapalı Halk Pazarı Oto Galericiler Sitesi No:48 D Kepez Antalya");
  /* ÖRNEK araçlar */
  U.arac = [
    { id: 1, marka: "Ford", model: "Ranger", pk: "2.2 TDCi XLT", yil: 2018, km: 148000, yakit: "Dizel", vites: "Manuel", tip: "pickup", renk: "#4A5563", fiyat: 1420000 },
    { id: 2, marka: "Renault", model: "Megane", pk: "1.5 dCi Touch", yil: 2019, km: 104000, yakit: "Dizel", vites: "Otomatik", tip: "sedan", renk: "#E8E2D2", fiyat: 910000 },
    { id: 3, marka: "Fiat", model: "Doblo", pk: "1.3 Multijet Safeline", yil: 2017, km: 167000, yakit: "Dizel", vites: "Manuel", tip: "hatchback", renk: "#F1F1EE", fiyat: 640000 },
    { id: 4, marka: "Hyundai", model: "Tucson", pk: "1.6 CRDi Elite", yil: 2018, km: 119000, yakit: "Dizel", vites: "Otomatik", tip: "suv", renk: "#2B3441", fiyat: 1380000 },
    { id: 5, marka: "Volkswagen", model: "Golf", pk: "1.6 TDI Comfortline", yil: 2017, km: 138000, yakit: "Dizel", vites: "Otomatik", tip: "hatchback", renk: "#B8352B", fiyat: 925000 },
    { id: 6, marka: "Toyota", model: "Hilux", pk: "2.4 D-4D Adventure", yil: 2019, km: 92000, yakit: "Dizel", vites: "Manuel", tip: "pickup", renk: "#C9CED6", fiyat: 1750000 },
    { id: 7, marka: "Opel", model: "Corsa", pk: "1.4 Enjoy", yil: 2018, km: 87000, yakit: "Benzin", vites: "Otomatik", tip: "hatchback", renk: "#3E6B94", fiyat: 640000 },
    { id: 8, marka: "Honda", model: "Civic", pk: "1.6 i-VTEC Eco Elegance", yil: 2019, km: 81000, yakit: "Benzin", vites: "Otomatik", tip: "sedan", renk: "#D9DBDF", fiyat: 1190000 },
    { id: 9, marka: "Dacia", model: "Sandero", pk: "1.0 SCe Stepway", yil: 2021, km: 48000, yakit: "Benzin", vites: "Manuel", tip: "hatchback", renk: "#7D8B6A", fiyat: 720000 },
    { id: 10, marka: "Nissan", model: "Juke", pk: "1.5 dCi Black Edition", yil: 2017, km: 133000, yakit: "Dizel", vites: "Manuel", tip: "suv", renk: "#1F2630", fiyat: 810000 },
    { id: 11, marka: "Fiat", model: "Fiorino", pk: "1.3 Multijet Combi", yil: 2019, km: 111000, yakit: "Dizel", vites: "Manuel", tip: "hatchback", renk: "#8E9399", fiyat: 690000 },
    { id: 12, marka: "Mitsubishi", model: "L200", pk: "2.5 DI-D Invite", yil: 2016, km: 189000, yakit: "Dizel", vites: "Manuel", tip: "pickup", renk: "#4A5563", fiyat: 1090000 }
  ];
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
  var FK = "dj-gokhan-fav";
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
