/* Cari ekstre mutabakatı — çekirdek (tarayıcı + Node). Hiçbir veri dışarı gönderilmez. */
(function (root) {
  "use strict";
  var KDV = [0.01, 0.08, 0.10, 0.18, 0.20];

  function tr(s) { return String(s === null || s === undefined ? "" : s).replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase(); }
  function ascii(s) { return tr(s).replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c"); }
  function norm(s) { return ascii(s).replace(/[^a-z0-9]/g, ""); }

  // Sayı: 1.234,56 · 1,234.56 · 1234,56 · (1.234,56) · -1.234,56 · 1.234,56 TL · 1.234,56 B/A
  function sayiCoz(v) {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v).trim().replace(/ /g, " ");
    if (!s) return null;
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
    s = s.replace(/(₺|tl|try|eur|usd|€|\$|£)/ig, "").trim();
    var m = /^(.*?)\s*([BbAa])$/.exec(s); // sondaki B/A işareti: Alacak negatif sayılır
    var baIsaret = null;
    if (m && /\d/.test(m[1])) { baIsaret = m[2].toUpperCase(); s = m[1].trim(); }
    if (/^[-−–]/.test(s)) { neg = !neg; s = s.slice(1).trim(); }
    if (/-$/.test(s)) { neg = !neg; s = s.slice(0, -1).trim(); }
    if (!/^[\d.,\s']+$/.test(s) || !/\d/.test(s)) return null;
    s = s.replace(/[\s']/g, "");
    var nokta = s.indexOf(".") >= 0, virgul = s.indexOf(",") >= 0, x;
    if (nokta && virgul) { // tutarlı biçim: binlik ayırıcı tek tür, ondalık tek ve en sonda
      var ds = s.lastIndexOf(",") > s.lastIndexOf(".") ? "," : ".", bs = ds === "," ? "." : ",", pr = s.split(ds);
      if (pr.length !== 2 || pr[1].indexOf(bs) >= 0 || !new RegExp("^\\d{1,3}(\\" + bs + "\\d{3})+$").test(pr[0])) return null;
    } else if (nokta && s.split(".").length > 2 && !/^\d{1,3}(\.\d{3})+$/.test(s)) return null;
    else if (virgul && s.split(",").length > 2 && !/^\d{1,3}(,\d{3})+$/.test(s)) return null;
    if (nokta && virgul) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) x = s.replace(/\./g, "").replace(",", ".");
      else x = s.replace(/,/g, "");
    } else if (virgul) {
      var p = s.split(",");
      if (p.length === 2 && p[1].length <= 2) x = p[0] + "." + p[1];       // 1234,5 / 1234,56
      else if (p.length > 2 || p[1].length === 3) x = s.replace(/,/g, ""); // 1,234 / 1,234,567
      else x = p[0] + "." + p[1];
    } else if (nokta) {
      var q = s.split(".");
      if (q.length > 2 || (q.length === 2 && q[1].length === 3 && q[0].length <= 3 && q[0] !== "0")) x = s.replace(/\./g, ""); // Türkçe binlik: 1.234
      else x = s;
    } else x = s;
    var n = parseFloat(x);
    if (!isFinite(n)) return null;
    if (neg) n = -n;
    if (baIsaret === "A") n = -Math.abs(n); else if (baIsaret === "B") n = Math.abs(n);
    return n;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function gecerli(y, m, d) { if (y < 1990 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null; var t = new Date(Date.UTC(y, m - 1, d)); if (t.getUTCMonth() !== m - 1) return null; return y + "-" + pad(m) + "-" + pad(d); }
  function tarihCoz(v) {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number") {
      if (v >= 32000 && v <= 80000) { var t = new Date(Math.round((Math.floor(v) - 25569) * 86400000)); return gecerli(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); }
      return null;
    }
    var s = String(v).trim(), m;
    if ((m = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[T\s].*)?$/.exec(s))) return gecerli(+m[1], +m[2], +m[3]);
    if ((m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})(?:\s.*)?$/.exec(s))) return gecerli(+m[3], +m[2], +m[1]);
    if ((m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2})(?:\s.*)?$/.exec(s))) return gecerli(2000 + (+m[3]), +m[2], +m[1]);
    if (/^\d{5}(\.\d+)?$/.test(s)) return tarihCoz(parseFloat(s));
    return null;
  }
  function gunNo(iso) { var p = iso.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function belgeNorm(s) {
    var x = String(s === null || s === undefined ? "" : s).toLocaleUpperCase("tr-TR").replace(/İ/g, "I").replace(/Ş/g, "S").replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ö/g, "O").replace(/Ç/g, "C").replace(/[^A-Z0-9]/g, "");
    return x.replace(/^0+(?=.)/, "");
  }
  function belgeBelirle(belge, aciklama) {
    var b = belgeNorm(belge);
    if (b) return b;
    var m = /\b([A-Z0-9]{3}20\d{2}\d{9})\b/i.exec(String(aciklama || ""));
    return m ? belgeNorm(m[1]) : "";
  }

  var DESEN = {
    tarih: /^(tarih|islemtarihi|fistarihi|belgetarihi|faturatarihi|kayittarihi|duzenlemetarihi|evraktarihi|hareketTarihi|hareket)$/i,
    belge: /^(belgeno|faturano|evrakno|fisno|belgenumarasi|faturanumarasi|evraknumarasi|fisnumarasi|dekontno|belge|evrak|fatura|fis|belgeno\d?|faturanosu|evraknosu|islemno|vsno)$/i,
    aciklama: /^(aciklama|aciklamalar|ack|islemaciklamasi|islemturu|islemtipi|tur|fisturu|belgeturu|hareketaciklamasi|detay)$/i,
    borc: /^(borc|borctutari|borctl|borctltutari|borcdovizi|borctutar|debit|borctutariTL)$/i,
    alacak: /^(alacak|alacaktutari|alacaktl|alacaktltutari|alacakdovizi|alacaktutar|credit|alacaktutariTL)$/i,
    bakiye: /^(bakiye|bakiyetl|kalan|yurubakiye|yurumebakiye|kumulatifbakiye|balance)$/i,
    tutar: /^(tutar|islemtutari|tutartl|miktar|hareketTutari)$/i,
    ba: /^(borcalacak|ba|bortipi|bakiyetipi|hesapyonu|yon|bortur|borcalacakdurumu|dc)$/i,
    para: /^(parabirimi|dovizcinsi|doviz|pb|cins|paratipi|dovizkodu|para)$/i
  };
  var KOLON_ADI = { tarih: "Tarih", belge: "Belge/Fatura no", aciklama: "Açıklama", borc: "Borç", alacak: "Alacak", tutar: "Tutar (tek sütun)", ba: "Borç/Alacak işareti", bakiye: "Bakiye", para: "Para birimi" };

  // İlk 40 satırda başlık satırını ve sütunları bul
  function baslikTani(rows) {
    var en = null;
    for (var r = 0; r < Math.min(rows.length, 40); r++) {
      var sat = rows[r] || [], kol = {}, puan = 0;
      for (var c = 0; c < sat.length; c++) {
        var n = norm(sat[c]); if (!n) continue;
        for (var k in DESEN) if (kol[k] === undefined && DESEN[k].test(n)) { kol[k] = c; puan++; break; }
      }
      var sayiKol = (kol.borc !== undefined && kol.alacak !== undefined) || kol.tutar !== undefined;
      if (kol.tarih !== undefined && sayiKol) { var skor = puan + (kol.belge !== undefined ? 1 : 0); if (!en || skor > en.skor) en = { basSatir: r, kolonlar: kol, skor: skor }; if (en.skor >= 4) break; }
    }
    if (en) en.basliklar = (rows[en.basSatir] || []).map(function (x) { return String(x === null || x === undefined ? "" : x); });
    return en;
  }

  var YOK = { toplam: 1, geneltoplam: 1, devirtoplam: 1, aratoplam: 1 };
  function kayitlar(rows, kolonlar, basSatir, etiket) {
    var out = [], atlanan = [], uyari = [], paraSet = {}, ikisiDolu = 0;
    var k = kolonlar;
    for (var r = basSatir + 1; r < rows.length; r++) {
      var sat = rows[r] || [];
      if (sat.every(function (h) { return h === null || h === undefined || String(h).trim() === ""; })) continue;
      var tarih = tarihCoz(sat[k.tarih]);
      var acik = k.aciklama !== undefined && sat[k.aciklama] != null ? String(sat[k.aciklama]) : "";
      var borc = null, alacak = null, tutar = null;
      if (k.borc !== undefined) borc = sayiCoz(sat[k.borc]);
      if (k.alacak !== undefined) alacak = sayiCoz(sat[k.alacak]);
      var v;
      if (k.borc !== undefined && k.alacak !== undefined) {
        v = (borc || 0) - (alacak || 0);
        if (borc && alacak) ikisiDolu++;
      } else {
        tutar = sayiCoz(sat[k.tutar]);
        v = tutar === null ? 0 : tutar;
        if (k.ba !== undefined && tutar !== null) { var i = norm(sat[k.ba]); if (/^(a|alacak|c|credit)/.test(i)) v = -Math.abs(tutar); else if (/^(b|borc|d|debit)/.test(i)) v = Math.abs(tutar); }
        if (v > 0) borc = v; else if (v < 0) alacak = -v;
      }
      var hamBelge = k.belge !== undefined && sat[k.belge] != null ? String(sat[k.belge]).trim() : "";
      var devir = /(devir|acilis|açılış|acılıs)/i.test(ascii(acik) + " " + ascii(hamBelge)) || /devir|acilis/.test(ascii(acik));
      if (!tarih) {
        var ilk = norm(sat.filter(function (h) { return h != null && String(h).trim() !== ""; })[0]);
        if (devir && v !== 0) tarih = null;
        else { atlanan.push({ satir: r + 1, neden: YOK[ilk] || /toplam|bakiye|ozet/.test(ilk) ? "toplam/bakiye satırı" : "tarih okunamadı", icerik: sat.slice(0, 6).map(function (h) { return h == null ? "" : String(h); }).join(" | ") }); continue; }
      }
      if (v === 0 && !devir) { atlanan.push({ satir: r + 1, neden: "tutar yok/sıfır", icerik: sat.slice(0, 6).map(function (h) { return h == null ? "" : String(h); }).join(" | ") }); continue; }
      if (k.para !== undefined && sat[k.para] != null && String(sat[k.para]).trim()) { var pb = String(sat[k.para]).trim().toLocaleUpperCase("tr-TR"); if (pb === "TL") pb = "TRY"; paraSet[pb] = (paraSet[pb] || 0) + 1; }
      var bak = k.bakiye !== undefined ? sayiCoz(sat[k.bakiye]) : null;
      out.push({ id: out.length, satir: r + 1, tarih: tarih, gun: tarih ? gunNo(tarih) : null, belge: hamBelge, bn: devir ? "DEVIR" : belgeBelirle(hamBelge, acik), aciklama: acik, borc: borc || 0, alacak: alacak || 0, v: v, c: Math.round(v * 100), bakiye: bak, taraf: etiket });
    }
    if (ikisiDolu) uyari.push(ikisiDolu + " satırda hem borç hem alacak dolu; net (borç − alacak) alındı.");
    var pbler = Object.keys(paraSet);
    if (pbler.length > 1) uyari.push("Birden fazla para birimi var (" + pbler.map(function (p) { return p + ": " + paraSet[p]; }).join(", ") + "). Tutarlar olduğu gibi (çevrilmeden) karşılaştırılır; kur farkı ayrıca incelenmelidir.");
    return { kayit: out, atlanan: atlanan, uyari: uyari, paralar: paraSet };
  }

  function topla(liste) { var t = 0; liste.forEach(function (x) { t += Math.round(x.v * 100); }); return t / 100; }

  // Yön: karşı tarafın ekstresi çoğunlukla ters (ayna) gelir. Her iki yönde tam tutar çakışmasını say.
  function yonTahmin(A, B) {
    function say(isaret) {
      var m = {}; A.forEach(function (a) { m[a.c] = (m[a.c] || 0) + 1; });
      var n = 0; B.forEach(function (b) { var c = isaret * b.c; if (m[c] > 0) { m[c]--; n++; } });
      return n;
    }
    var ters = say(-1), ayni = say(1);
    return { ters: ters, ayni: ayni, secim: ayni > ters ? "ayni" : "ters" };
  }

  function kdvIpucu(fark, a, b) {
    var x = Math.abs(a), y = Math.abs(b);
    if (!x || !y) return "";
    var hi = Math.max(x, y), lo = Math.min(x, y), oran = hi / lo - 1;
    for (var i = 0; i < KDV.length; i++) if (Math.abs(oran - KDV[i]) < 0.0025 + 0.01 / lo) return "Fark %" + Math.round(KDV[i] * 100) + " KDV oranına denk geliyor: bir taraf KDV dahil, öteki KDV hariç yazmış olabilir";
    return "";
  }
  function sebepFark(a, b) {
    var f = Math.round((a.c - b.c)) / 100, af = Math.abs(f);
    var ip = kdvIpucu(f, a.v, b.v); if (ip) return ip;
    if (af <= 1) return "Kuruş/yuvarlama farkı";
    if (a.v !== 0 && af / Math.abs(a.v) < 0.03) return "Küçük oranlı fark: iskonto, vade farkı ya da kur/yuvarlama olabilir";
    return "Tutar farkı: bir taraf kısmi tutarı, iskontoyu ya da düzeltmeyi işlemiş olabilir";
  }

  function eslestir(Aham, Bham, ayar) {
    ayar = ayar || {};
    var pencere = ayar.pencere === undefined ? 5 : ayar.pencere;
    var yon = ayar.yon || "otomatik", yonBilgi = null;
    var A = Aham.map(function (x) { return Object.assign({}, x); });
    var B = Bham.map(function (x) { return Object.assign({}, x); });
    if (yon === "otomatik") { yonBilgi = yonTahmin(A, B); yon = yonBilgi.secim; }
    var isaret = yon === "ters" ? -1 : 1;
    B.forEach(function (b) { b.vv = isaret * b.v; b.cc = isaret * b.c; });
    A.forEach(function (a) { a.vv = a.v; a.cc = a.c; });
    var cift = []; // {tur, a:[], b:[], fark(kuruş), sebep}
    var aKul = {}, bKul = {};
    function al(a, b, tur, sebep, guven) { aKul[a.id] = 1; bKul[b.id] = 1; cift.push({ tur: tur, a: [a], b: [b], fark: a.cc - b.cc, sebep: sebep || "", guven: guven || "yüksek" }); }
    function gunFark(a, b) { return a.gun !== null && b.gun !== null ? Math.abs(a.gun - b.gun) : (a.gun === b.gun ? 0 : 99999); }
    function kalanA() { return A.filter(function (a) { return !aKul[a.id]; }); }
    function kalanB() { return B.filter(function (b) { return !bKul[b.id]; }); }

    // Geçiş 1: aynı belge no + aynı tutar
    (function () {
      var idx = {}; B.forEach(function (b) { if (b.bn) (idx[b.bn] = idx[b.bn] || []).push(b); });
      A.forEach(function (a) {
        if (!a.bn || !idx[a.bn]) return;
        var best = null; idx[a.bn].forEach(function (b) { if (bKul[b.id] || b.cc !== a.cc) return; if (!best || gunFark(a, b) < gunFark(a, best)) best = b; });
        if (best) { var g = gunFark(a, best); al(a, best, g === 0 ? "ESLESTI" : "TARIH_FARKLI", g === 0 ? "" : (g > 3000 ? "Tarih biri boş" : g + " gün tarih farkı (belge no ve tutar aynı)")); }
      });
    })();
    // Geçiş 2: aynı belge no, tutar farklı (aynı yön)
    (function () {
      var idx = {}; kalanB().forEach(function (b) { if (b.bn && b.bn !== "DEVIR") (idx[b.bn] = idx[b.bn] || []).push(b); });
      kalanA().forEach(function (a) {
        if (!a.bn || a.bn === "DEVIR" || !idx[a.bn]) return;
        var best = null; idx[a.bn].forEach(function (b) { if (bKul[b.id] || (a.cc > 0) !== (b.cc > 0)) return; if (!best || Math.abs(a.cc - b.cc) < Math.abs(a.cc - best.cc)) best = b; });
        if (best) al(a, best, "TUTAR_FARKI", sebepFark(a, best), "yüksek");
      });
    })();
    // Geçiş 3-4: aynı tutar; tarih penceresi içinde, sonra pencere dışı
    function tutarGecisi(maks, etiketTur) {
      var gb = {}; kalanB().forEach(function (b) { (gb[b.cc] = gb[b.cc] || []).push(b); });
      var ga = {}; kalanA().forEach(function (a) { (ga[a.cc] = ga[a.cc] || []).push(a); });
      Object.keys(ga).forEach(function (c) {
        var LA = ga[c], LB = gb[c]; if (!LB) return;
        var pairs = [];
        if (LA.length * LB.length <= 40000) {
          LA.forEach(function (a) { LB.forEach(function (b) { var g = gunFark(a, b); if (g <= maks) pairs.push([g, a.id, b.id, a, b]); }); });
          pairs.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; });
          pairs.forEach(function (p) { if (aKul[p[3].id] || bKul[p[4].id]) return; emit(p[3], p[4], p[0]); });
        } else { // çok büyük özdeş-tutar grubu: tarih sırasıyla eşle
          var sa = LA.slice().sort(function (x, y) { return (x.gun || 0) - (y.gun || 0) || x.id - y.id; }), sb = LB.slice().sort(function (x, y) { return (x.gun || 0) - (y.gun || 0) || x.id - y.id; });
          for (var i = 0; i < Math.min(sa.length, sb.length); i++) if (gunFark(sa[i], sb[i]) <= maks) emit(sa[i], sb[i], gunFark(sa[i], sb[i]));
        }
      });
      function emit(a, b, g) {
        var belgeFarkli = a.bn && b.bn && a.bn !== b.bn;
        if (etiketTur === "pencere") {
          if (belgeFarkli) al(a, b, "BELGE_FARKLI", "Tutar ve tarih tutuyor, belge no farklı: " + (a.belge || a.bn) + " ↔ " + (b.belge || b.bn), "orta");
          else al(a, b, g === 0 ? "ESLESTI" : "TARIH_FARKLI", g === 0 ? "Belge no yok/aynı, tutar ve tarih aynı" : g + " gün tarih farkı", g === 0 ? "yüksek" : "orta");
        } else al(a, b, "TARIH_FARKLI", "Yalnız tutar tutuyor; tarih " + (g > 3000 ? "boş" : g + " gün farklı") + (belgeFarkli ? ", belge no da farklı" : "") + " — elle doğrulayın", "düşük");
      }
    }
    tutarGecisi(pencere, "pencere");
    tutarGecisi(99999, "uzak");
    // Geçiş 5: küçük tutar farkı (≤1 TL) ya da KDV oranı farkı; tarih penceresi içinde
    (function () {
      var ka = kalanA(), kb = kalanB();
      if (ka.length * kb.length > 4000000) return;
      var pairs = [];
      ka.forEach(function (a) { kb.forEach(function (b) {
        if ((a.cc > 0) !== (b.cc > 0) || a.cc === 0) return;
        var g = gunFark(a, b), fark = Math.abs(a.cc - b.cc);
        if (g > Math.max(pencere, 10)) return;
        var kdv = kdvIpucu(0, a.vv, b.vv);
        if (fark <= 100) pairs.push([fark, g, a.id, b.id, a, b]);
        else if (kdv) pairs.push([fark + 100000, g, a.id, b.id, a, b]);
      }); });
      pairs.sort(function (x, y) { return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || x[3] - y[3]; });
      pairs.forEach(function (p) { if (aKul[p[4].id] || bKul[p[5].id]) return; al(p[4], p[5], "TUTAR_FARKI", sebepFark(p[4], p[5]), "orta"); });
    })();
    // Geçiş 6: bire-çok (1 kayıt = 2-3 karşı kayıt toplamı), aynı yön, 45 gün
    (function () {
      var ka = kalanA(), kb = kalanB();
      if (ka.length > 400 || kb.length > 400) return;
      function dene(tek, tekTaraf, coklu, cokTaraf) {
        var adaylar = coklu.filter(function (x) { return !((cokTaraf === "b" ? bKul : aKul)[x.id]) && (x.cc > 0) === (tek.cc > 0) && Math.abs(x.cc) < Math.abs(tek.cc) && (tek.gun === null || x.gun === null || Math.abs(tek.gun - x.gun) <= 45); });
        if (adaylar.length > 60 || adaylar.length < 2) return false;
        var hedef = tek.cc, n = adaylar.length, bulundu = null;
        for (var i = 0; i < n && !bulundu; i++) for (var j = i + 1; j < n && !bulundu; j++) {
          if (adaylar[i].cc + adaylar[j].cc === hedef) bulundu = [adaylar[i], adaylar[j]];
          else if (n <= 40) for (var k = j + 1; k < n; k++) if (adaylar[i].cc + adaylar[j].cc + adaylar[k].cc === hedef) { bulundu = [adaylar[i], adaylar[j], adaylar[k]]; break; }
        }
        if (!bulundu) return false;
        var tekKul = tekTaraf === "a" ? aKul : bKul, cokKul = tekTaraf === "a" ? bKul : aKul;
        tekKul[tek.id] = 1; bulundu.forEach(function (x) { cokKul[x.id] = 1; });
        var sT = bulundu.reduce(function (t, x) { return t + x.cc; }, 0);
        cift.push({ tur: "COKLU", a: tekTaraf === "a" ? [tek] : bulundu, b: tekTaraf === "a" ? bulundu : [tek], fark: tekTaraf === "a" ? tek.cc - sT : sT - tek.cc, sebep: "Bir kayıt, karşı tarafın " + bulundu.length + " kaydının toplamına eşit (parçalı ödeme/tahsilat ya da birleştirilmiş fatura olabilir)", guven: "orta" });
        return true;
      }
      ka.forEach(function (a) { if (!aKul[a.id]) dene(a, "a", kb, "b"); });
      kalanB().forEach(function (b) { if (!bKul[b.id]) dene(b, "b", kalanA(), "a"); });
    })();

    // Eşleşmeyenler
    var sA = kalanA(), sB = kalanB();
    function ipucu(x, kendi, karsi, adi) {
      var ip = [];
      var ayniKendi = kendi.filter(function (y) { return y.id !== x.id && y.cc === x.cc && y.bn && y.bn === x.bn; });
      if (x.bn && ayniKendi.length) ip.push("Aynı belge no ve tutar " + adi + " tarafta " + (ayniKendi.length + 1) + " kez geçiyor (mükerrer kayıt olabilir)");
      var ters = kendi.filter(function (y) { return y.id !== x.id && y.cc === -x.cc; });
      if (ters.length) ip.push("Aynı tutarlı ters kayıt var (iade/iptal çifti olabilir): satır " + ters[0].satir);
      if (x.bn && x.bn !== "DEVIR" && !karsi.some(function (y) { return y.bn === x.bn; })) ip.push("Belge no karşı tarafta hiç yok");
      if (x.bn === "DEVIR") ip.push("Devir/açılış bakiyesi: iki tarafın devri farklı");
      return ip.join(" · ");
    }
    sA.forEach(function (a) { cift.push({ tur: "SADECE_A", a: [a], b: [], fark: a.cc, sebep: ipucu(a, A, B, "bu") || "Karşı tarafta karşılığı bulunamadı", guven: "" }); });
    sB.forEach(function (b) { cift.push({ tur: "SADECE_B", a: [], b: [b], fark: -b.cc, sebep: ipucu(b, B, A, "karşı") || "Sizde karşılığı bulunamadı", guven: "" }); });

    var topA = A.reduce(function (t, a) { return t + a.cc; }, 0), topB = B.reduce(function (t, b) { return t + b.cc; }, 0);
    var kopru = cift.reduce(function (t, c) { return t + c.fark; }, 0);
    var say = {}; cift.forEach(function (c) { say[c.tur] = (say[c.tur] || 0) + 1; });
    return { yon: yon, yonBilgi: yonBilgi, pencere: pencere, A: A, B: B, cift: cift, say: say,
      bakA: topA / 100, bakB: topB / 100, fark: (topA - topB) / 100, korpuToplam: kopru / 100, korpuTutuyor: kopru === topA - topB,
      sadeceAToplam: sA.reduce(function (t, a) { return t + a.cc; }, 0) / 100, sadeceBToplam: sB.reduce(function (t, b) { return t + b.cc; }, 0) / 100 };
  }

  var api = { sayiCoz: sayiCoz, tarihCoz: tarihCoz, belgeNorm: belgeNorm, baslikTani: baslikTani, kayitlar: kayitlar, eslestir: eslestir, yonTahmin: yonTahmin, topla: topla, norm: norm, KOLON_ADI: KOLON_ADI, gunNo: gunNo };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CM = api;
})(typeof self !== "undefined" ? self : this);
