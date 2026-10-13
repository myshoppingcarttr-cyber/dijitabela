/* Sarıtaş Emlak · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: emlakclick.com (Ahatlı, Kepez; 0501 744 44 87).
   İlanlar, projeler ve fiyatlar ÖRNEKTİR; gerçek portföy değildir. Hiçbir form gönderim yapmaz. */
(function () {
  "use strict";
  var K = {
    ad: "Sarıtaş Emlak", adres: "Ahatlı, Kepez / Antalya",
    tel: "0501 744 44 87", wa: "905017444487", kaynak: "https://emlakclick.com/emlak-ofisi/kepez-ahatli"
  };
  K.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Sarıtaş Emlak Ahatlı Kepez Antalya");
  K.ilan = [
    { id: 1, amac: "satilik", tur: "daire", mah: "Gülveren", oda: "3+1", m2: 125, kat: "4. kat", fiyat: 3450000, renk: "#C8825A" },
    { id: 2, amac: "kiralik", tur: "daire", mah: "Erenköy", oda: "2+1", m2: 95, kat: "2. kat", fiyat: 18000, renk: "#6E8FB5" },
    { id: 3, amac: "satilik", tur: "villa", mah: "Karşıyaka", oda: "4+1", m2: 210, kat: "Müstakil", fiyat: 8900000, renk: "#7FA17A" },
    { id: 4, amac: "satilik", tur: "arsa", mah: "Ahatlı", oda: "-", m2: 520, kat: "İmarlı (örnek)", fiyat: 2750000, renk: "#B49A5E" },
    { id: 5, amac: "kiralik", tur: "dukkan", mah: "Gülveren", oda: "-", m2: 60, kat: "Zemin", fiyat: 32000, renk: "#A5586B" },
    { id: 6, amac: "satilik", tur: "daire", mah: "Erenköy", oda: "2+1", m2: 88, kat: "1. kat", fiyat: 2150000, renk: "#5E8F98" },
    { id: 7, amac: "kiralik", tur: "daire", mah: "Karşıyaka", oda: "3+1", m2: 120, kat: "3. kat", fiyat: 24000, renk: "#9A7DB5" },
    { id: 8, amac: "satilik", tur: "dukkan", mah: "Ahatlı", oda: "-", m2: 85, kat: "Zemin + asma", fiyat: 4300000, renk: "#C2A15B" },
    { id: 9, amac: "satilik", tur: "daire", mah: "Gülveren", oda: "1+1", m2: 62, kat: "5. kat", fiyat: 1650000, renk: "#D08A6E" }
  ];
  K.turAd = { daire: "Daire", villa: "Villa", arsa: "Arsa", dukkan: "Dükkan" };
  K.amacAd = { satilik: "Satılık", kiralik: "Kiralık" };
  K.mahler = ["Ahatlı","Gülveren","Erenköy","Karşıyaka"];
  K.projeler = [
    { id: 1, ad: "Örnek Proje A", tip: "6 katlı apartman", durum: "devam", yuzde: 62, not: "Kaba inşaat tamam, ince işler sürüyor (örnek)." },
    { id: 2, ad: "Örnek Proje B", tip: "Müstakil villa", durum: "bitti", yuzde: 100, not: "Teslim edildi (örnek)." },
    { id: 3, ad: "Örnek Proje C", tip: "Dükkanlı apartman", durum: "plan", yuzde: 8, not: "Ruhsat aşamasında (örnek)." }
  ];
  K.durumAd = { devam: "Devam ediyor", bitti: "Tamamlandı", plan: "Planlanıyor" };
  K.tl = function (n) { return "Fiyat sorun"; };
  K.fiyatYaz = function (i) { return i.amac === "kiralik" ? K.tl(i.fiyat) + " / ay" : K.tl(i.fiyat); };
  K.baslik = function (i) { return i.mah + " · " + (i.oda !== "-" ? i.oda + " " : "") + K.turAd[i.tur] + " " + K.amacAd[i.amac]; };
  K.bul = function (id) { return K.ilan.filter(function (a) { return a.id === Number(id); })[0]; };
  K.suz = function (f) {
    f = f || {}; var q = (f.q || "").toLocaleLowerCase("tr").trim();
    var r = K.ilan.filter(function (i) {
      if (f.amac && f.amac !== "hepsi" && i.amac !== f.amac) return false;
      if (f.tur && f.tur !== "hepsi" && i.tur !== f.tur) return false;
      if (f.mah && f.mah !== "hepsi" && i.mah !== f.mah) return false;
      if (q && (K.baslik(i) + " " + i.kat).toLocaleLowerCase("tr").indexOf(q) < 0) return false;
      return true;
    });
    var s = f.sirala || "yeni";
    r.sort(function (a, b) { return s === "ucuz" ? a.fiyat - b.fiyat : s === "pahali" ? b.fiyat - a.fiyat : s === "m2" ? b.m2 - a.m2 : b.id - a.id; });
    return r;
  };
  var FK = "dj-saritas-fav", TK = "dj-saritas-talep";
  function oku(k, y) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return K[y] || []; } }
  function yaz(k, y, v) { K[y] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  K.favler = function () { return oku(FK, "_f"); };
  K.favVar = function (id) { return K.favler().indexOf(Number(id)) > -1; };
  K.favDeg = function (id) { id = Number(id); var l = K.favler(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); yaz(FK, "_f", l); return i < 0; };
  /* Alıcı/kiracı talep listesi: yalnız bu tarayıcıda saklanır, hiçbir yere gönderilmez */
  K.talepler = function () { return oku(TK, "_t"); };
  K.talepEkle = function (t) { var l = K.talepler(); t.z = Date.now(); l.unshift(t); yaz(TK, "_t", l.slice(0, 20)); };
  K.talepSil = function (z) { yaz(TK, "_t", K.talepler().filter(function (x) { return x.z !== z; })); };
  K.waLink = function (m) { return "https://wa.me/" + K.wa + "?text=" + encodeURIComponent(m); };
  K.soru = function (i) { return "Merhaba, " + K.baslik(i) + " (" + i.m2 + " m²) ilanı hâlâ güncel mi? Görmek istiyorum."; };
  K.talepMesaj = function (t) { return "Merhaba, " + K.amacAd[t.amac].toLocaleLowerCase("tr") + " " + (K.turAd[t.tur] || "gayrimenkul").toLocaleLowerCase("tr") + " arıyorum" + (t.mah && t.mah !== "hepsi" ? ", " + t.mah + " çevresi" : "") + (t.butce ? ", bütçem en çok " + K.tl(t.butce) + (t.amac === "kiralik" ? " / ay" : "") : "") + ". Uygun ilan çıkınca haber verir misiniz? Ad: " + (t.ad || "-"); };
  /* İlan paylaşım metni: haftalık paylaşım düzeni için */
  K.paylas = function (i) { return K.amacAd[i.amac].toUpperCase() + " " + K.turAd[i.tur].toUpperCase() + "\n" + i.mah + " · " + (i.oda !== "-" ? i.oda + " · " : "") + i.m2 + " m² · " + i.kat + "\n" + K.fiyatYaz(i) + " (örnek)\nBilgi: " + K.tel + "\n" + K.ad; };
  function sh(c, k) { var n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = function (x) { return Math.max(0, Math.min(255, Math.round(x * k))); }; return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")"; }
  K.svg = function (tur, renk, kls) {
    renk = renk || "#C8825A"; var s = "", gz = '<rect width="400" height="190" fill="#DCEAF5"/><circle cx="332" cy="38" r="17" fill="#FFE9A8" opacity=".9"/><path d="M0 160 H400 V190 H0 Z" fill="#8FA88A" opacity=".55"/>';
    var c1 = sh(renk, 1.1), c2 = sh(renk, .78), pen = "#25364A", pn = "#BFE0F5";
    function pencere(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + pn + '" stroke="' + pen + '" stroke-opacity=".5"/>'; }
    if (tur === "daire") {
      s = '<rect x="110" y="22" width="180" height="140" fill="' + c1 + '"/><rect x="110" y="22" width="180" height="10" fill="' + c2 + '"/>';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) s += pencere(124 + c * 40, 42 + r * 30, 22, 18) + (c % 2 ? '<rect x="' + (124 + c * 40) + '" y="' + (62 + r * 30) + '" width="22" height="3" fill="' + c2 + '"/>' : "");
      s += '<rect x="186" y="136" width="28" height="26" fill="' + c2 + '"/>';
    } else if (tur === "villa") {
      s = '<rect x="90" y="86" width="220" height="76" fill="' + c1 + '"/><path d="M76 90 L200 36 L324 90 Z" fill="' + c2 + '"/><rect x="262" y="52" width="14" height="30" fill="' + c2 + '"/>' + pencere(112, 106, 40, 30) + pencere(248, 106, 40, 30) + '<rect x="180" y="118" width="40" height="44" fill="' + sh(renk, .6) + '"/><circle cx="52" cy="130" r="22" fill="#5B8F5A"/><rect x="49" y="146" width="6" height="16" fill="#6b4a2f"/><circle cx="352" cy="136" r="16" fill="#5B8F5A"/>';
    } else if (tur === "arsa") {
      s = '<path d="M60 160 L120 96 L330 96 L350 160 Z" fill="' + c1 + '" opacity=".75" stroke="' + c2 + '" stroke-width="3" stroke-dasharray="10 6"/>';
      for (var p = 0; p < 4; p++) s += '<circle cx="' + [60, 120, 330, 350][p] + '" cy="' + [160, 96, 96, 160][p] + '" r="6" fill="' + c2 + '"/>';
      s += '<path d="M150 150 L200 110 M200 150 L250 110" stroke="' + c2 + '" stroke-opacity=".5" stroke-width="2"/><rect x="190" y="70" width="4" height="40" fill="#5b4a3a"/><rect x="190" y="70" width="52" height="22" fill="#fff" stroke="#5b4a3a" stroke-width="2"/><text x="216" y="86" font-size="11" font-family="Arial" font-weight="700" text-anchor="middle" fill="' + c2 + '">ARSA</text>';
    } else {
      s = '<rect x="80" y="64" width="240" height="98" fill="' + c1 + '"/><rect x="80" y="64" width="240" height="14" fill="' + c2 + '"/>' + pencere(100, 98, 100, 54) + '<rect x="220" y="98" width="38" height="64" fill="' + sh(renk, .6) + '"/>' + pencere(272, 98, 30, 30) + '<path d="M92 84 H308 L300 100 H100 Z" fill="' + sh(renk, .5) + '"/><path d="M92 84 h20 l-4 16 h-20z M132 84 h20 l-4 16 h-20z M172 84 h20 l-4 16 h-20z M212 84 h20 l-4 16 h-20z M252 84 h20 l-4 16 h-20z" fill="#fff" opacity=".85"/>';
    }
    return '<svg class="ev-svg ' + (kls || "") + '" viewBox="0 0 400 190" role="img" aria-label="Gayrimenkul çizimi (örnek)" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' + gz + s + "</svg>";
  };
  /* Proje çizimi: aşamaya göre iskelet / bitmiş bina */
  K.projeSvg = function (y) {
    var kat = 6, t = Math.round(kat * y / 100), s = '<rect width="300" height="170" fill="#E7EEF3"/><rect y="150" width="300" height="20" fill="#9AA79A"/>';
    for (var k = 0; k < kat; k++) { var yy = 144 - k * 22, dolu = k < t; s += '<rect x="80" y="' + (yy - 20) + '" width="140" height="22" fill="' + (dolu ? "#D4A373" : "none") + '" stroke="#3b4a5a" stroke-width="2" ' + (dolu ? "" : 'stroke-dasharray="5 4"') + "/>"; if (dolu) s += '<rect x="94" y="' + (yy - 14) + '" width="18" height="10" fill="#BFE0F5"/><rect x="132" y="' + (yy - 14) + '" width="18" height="10" fill="#BFE0F5"/><rect x="170" y="' + (yy - 14) + '" width="18" height="10" fill="#BFE0F5"/>'; }
    if (y < 100) s += '<path d="M232 150 V30 H282 M232 40 H300 M268 30 V70" stroke="#E0A100" stroke-width="4" fill="none"/>';
    return '<svg class="pr-svg" viewBox="0 0 300 170" role="img" aria-label="Proje çizimi (örnek)" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' + s + "</svg>";
  };
  window.KEPEZ = K;
})();
