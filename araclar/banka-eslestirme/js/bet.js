/* Banka hareketi ↔ fatura eşleştirme çekirdeği (tarayıcı + Node). Hiçbir veri dışarı gitmez.
   Mevzuat kuralı uygulamaz; iki kayıt kümesini eşleştirir ve öneri üretir (muhasebe kaydı/mahsup değildir).
   Bağımlılık: js/fdk.js (sayı/tarih çözücü, fatura normalleştirme). Tüm tutarlar kuruş (tamsayı) olarak hesaplanır. */
(function (root) {
  "use strict";
  var F = typeof module !== "undefined" && module.exports ? require("./fdk.js") : root.FDK;
  var norm = F.norm;
  function ascii(s) { return String(s === null || s === undefined ? "" : s).replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase().replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c"); }
  function cent(x) { return Math.round(x * 100 + (x < 0 ? -1e-7 : 1e-7)); }
  function gunNo(iso) { var p = iso.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function T(c) { var n = Math.abs(Math.round(c)), tam = Math.floor(n / 100), k = ("0" + (n % 100)).slice(-2); return (c < 0 ? "-" : "") + String(tam).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + k; }
  function bos(h) { return h === null || h === undefined || String(h).trim() === ""; }

  // ------------------------------------------------------------ ekstre sütunları
  var DESEN = {
    tarih: [/^(islemtarihi|islemtarih|hareketTarihi|muhasebetarihi|islemzamani|hareketzamani)$/i, /^(tarih|valor|valortarihi|tarihsaat)$/],
    aciklama: [/^(aciklama|islemaciklamasi|hareketaciklamasi|aciklamalar|islemdetayi|hareketdetayi|odemeaciklamasi|detay|islemaciklama|mesaj|islemadi|islem)$/],
    tutar: [/^(tutar|islemtutari|islemtutar|miktar|tutartl|islemtutaritl|hareketTutari|tltutar)$/i],
    giris: [/^(giris|girisler|girenmiktar|girentutar|gelen|tahsilat|girisTutari|girisler)$/i],
    cikis: [/^(cikis|cikislar|cikanmiktar|cikantutar|cikanTutar|giden|odeme|cikisTutari)$/i],
    alacak: [/^(alacak|alacaktutari|alacaktl|alacaktutar|credit)$/],
    borc: [/^(borc|borctutari|borctl|borctutar|debit)$/],
    isaret: [/^(borcalacak|ba|borcalacakisareti|islemturu|islemtipi|islemyonu|yon|giriscikis|hareketturu|dc)$/],
    bakiye: [/^(bakiye|bakiyetl|sonbakiye|hesapbakiyesi|kalanbakiye|islemsonubakiyesi|bakiyetutari)$/],
    ref: [/^(dekontno|dekontnumarasi|dekont|referans|referansno|referansnumarasi|islemno|islemnumarasi|islemref|fisno|siranumarasi|sirano|sira|dekontsirano)$/],
    taraf: [/^(gonderen|gonderenunvan|gonderenadi|gonderenadsoyad|karsitaraf|karsihesap|karsihesapunvani|aliciunvan|aliciadi|alici|gonderenalici|unvan|adsoyad|isim|karsitarafunvan|muhatap)$/]
  };
  var KOLON_ADI = { tarih: "Tarih", aciklama: "Açıklama", tutar: "Tutar (işaretli)", giris: "Giriş", cikis: "Çıkış", alacak: "Alacak", borc: "Borç", isaret: "Borç/Alacak ya da Giriş/Çıkış göstergesi", bakiye: "Bakiye", ref: "Dekont/referans no", taraf: "Gönderen / karşı taraf" };
  var SIRA = ["tarih", "aciklama", "tutar", "giris", "cikis", "alacak", "borc", "isaret", "bakiye", "ref", "taraf"];

  function baslikTani(rows) {
    var en = null;
    for (var r = 0; r < Math.min(rows.length, 40); r++) {
      var sat = rows[r] || [], normlar = sat.map(norm), kol = {}, puan = 0;
      SIRA.forEach(function (k) {
        for (var p = 0; p < DESEN[k].length && kol[k] === undefined; p++)
          for (var c = 0; c < normlar.length; c++) {
            if (normlar[c] && DESEN[k][p].test(normlar[c]) && !Object.keys(kol).some(function (x) { return kol[x] === c; })) { kol[k] = c; puan++; break; }
          }
      });
      var tutarVar = kol.tutar !== undefined || kol.giris !== undefined || kol.cikis !== undefined || kol.alacak !== undefined || kol.borc !== undefined;
      if (kol.tarih !== undefined && tutarVar && puan >= 3) { if (!en || puan > en.skor) en = { basSatir: r, kolonlar: kol, skor: puan }; if (en.skor >= 6) break; }
    }
    if (en) en.basliklar = (rows[en.basSatir] || []).map(function (x) { return String(x === null || x === undefined ? "" : x); });
    return en;
  }

  var OZET = /^(toplam|geneltoplam|devir|devirbakiye|acilisbakiyesi|kapanisbakiyesi|donemsonu|donembasi|sayfatoplami|toplamgiris|toplamcikis)/;
  function isaretCoz(v) {
    var s = ascii(v).replace(/[^a-z\/+-]/g, "");
    if (!s) return 0;
    if (/^(a|alacak|giris|gelen|c|cr|credit|tahsilat|\+)$/.test(s) || /^(alacak|giris|gelen|tahsilat)/.test(s)) return 1;
    if (/^(b|borc|cikis|giden|d|dr|debit|odeme|-)$/.test(s) || /^(borc|cikis|giden|odeme)/.test(s)) return -1;
    return 0;
  }

  // ayar: { ters: Borç/Alacak yönünü tersine çevir }
  function hareketler(rows, k, bas, ayar) {
    ayar = ayar || {};
    var out = [], atlanan = [], uyari = [], ikili = 0, isaretsiz = 0, bozukTarih = 0;
    function ham(sat) { return sat.slice(0, 8).map(function (h) { return h == null ? "" : String(h); }).join(" | "); }
    var ters = ayar.ters ? -1 : 1;
    for (var r = bas + 1; r < rows.length; r++) {
      var sat = rows[r] || [];
      if (sat.every(bos)) continue;
      var ilk = norm(sat.filter(function (h) { return !bos(h); })[0]);
      if (OZET.test(ilk)) { atlanan.push({ satir: r + 1, neden: "toplam/devir satırı", icerik: ham(sat) }); continue; }
      var tarih = F.tarihCoz(sat[k.tarih]);
      var tutar = null, kar = function (i) { return i === undefined ? null : F.sayiCoz(sat[i]); };
      if (k.tutar !== undefined) {
        tutar = kar(k.tutar);
        if (tutar !== null && k.isaret !== undefined) { var is = isaretCoz(sat[k.isaret]); if (is) tutar = Math.abs(tutar) * is * ters; else if (tutar > 0) isaretsiz++; }
      } else {
        var g = kar(k.giris !== undefined ? k.giris : k.alacak), c = kar(k.cikis !== undefined ? k.cikis : k.borc);
        if (k.giris === undefined && k.cikis === undefined) { var a = k.alacak !== undefined ? kar(k.alacak) : null, b = k.borc !== undefined ? kar(k.borc) : null; g = ters === 1 ? a : b; c = ters === 1 ? b : a; }
        if (g !== null && g !== 0 && c !== null && c !== 0) ikili++;
        if (g !== null || c !== null) tutar = Math.abs(g || 0) - Math.abs(c || 0);
      }
      if (tutar === null || tutar === 0) { atlanan.push({ satir: r + 1, neden: tutar === 0 ? "tutarı sıfır" : "tutar okunamadı", icerik: ham(sat) }); continue; }
      if (!tarih) { bozukTarih++; atlanan.push({ satir: r + 1, neden: "tarih okunamadı", icerik: ham(sat) }); continue; }
      var tx = k.taraf !== undefined && sat[k.taraf] != null ? String(sat[k.taraf]).trim() : "";
      var ac = k.aciklama !== undefined && sat[k.aciklama] != null ? String(sat[k.aciklama]).trim() : "";
      out.push({ id: out.length, satir: r + 1, tarih: tarih, gun: gunNo(tarih), c: cent(tutar), tutar: tutar, aciklama: ac, taraf: tx,
        ref: k.ref !== undefined && sat[k.ref] != null ? String(sat[k.ref]).trim() : "", bakiye: k.bakiye !== undefined ? F.sayiCoz(sat[k.bakiye]) : null });
    }
    if (ikili) uyari.push(ikili + " satırda hem giriş hem çıkış dolu; net tutar alındı.");
    if (isaretsiz) uyari.push(isaretsiz + " satırda tutar pozitif ve yön göstergesi okunamadı; giriş sayıldı. Borç/Alacak yönü yanlışsa 'Borç/Alacak yönünü ters çevir' seçeneğini kullanın.");
    return { hareket: out, atlanan: atlanan, uyari: uyari };
  }

  // Bakiye zinciri ve mükerrer satır denetimi. Ekstre artan ya da azalan sırada olabilir.
  function ekstreDenetle(H) {
    var kirik = [], mukerrer = [], gor = {};
    H.forEach(function (h, i) {
      var an = [h.tarih, h.c, ascii(h.aciklama), h.ref, h.bakiye === null ? "" : cent(h.bakiye)].join("|");
      if (gor[an] !== undefined) {
        var kesin = h.bakiye !== null || !!h.ref;
        mukerrer.push({ hareket: h, ilk: H[gor[an]], kesin: kesin });
        if (kesin) h.mukerrer = true;
      } else gor[an] = i;
    });
    var bk = H.filter(function (h) { return h.bakiye !== null && !h.mukerrer; });
    if (bk.length >= 3) {
      var say = function (sirali) { var tut = 0, yanlis = [], j; for (j = 1; j < sirali.length; j++) { var beklenen = cent(sirali[j - 1].bakiye) + sirali[j].c; if (Math.abs(beklenen - cent(sirali[j].bakiye)) <= 1) tut++; else yanlis.push(j); } return { tut: tut, yanlis: yanlis }; };
      var asc = say(bk), desc = say(bk.slice().reverse());
      var yon = asc.tut >= desc.tut ? "asc" : "desc", sirali = yon === "asc" ? bk : bk.slice().reverse(), s = yon === "asc" ? asc : desc;
      if (s.tut / (bk.length - 1) >= 0.5) {
        s.yanlis.forEach(function (j) { var h = sirali[j], on = sirali[j - 1]; kirik.push({ hareket: h, onceki: on, beklenen: (cent(on.bakiye) + h.c) / 100, fark: (cent(h.bakiye) - cent(on.bakiye) - h.c) / 100 }); });
      } else kirik = null; // zincir kurulamadı (bakiye farklı anlamda ya da sırasız)
    }
    return { kirik: kirik, mukerrer: mukerrer };
  }

  // ------------------------------------------------------------ fatura kayıtları
  function faturaXml(f, yonSecim) {
    // faturalariHazirla çıktısı -> ortak biçim
    var yon = f.yon;
    if (yon === "?" || yon === "dışı") yon = yonSecim === "alis" ? "gelen" : "giden";
    var adaylar = [], dahil = f.dahil, ode = f.odenecek;
    var para = f.para || "TRY", tl = para === "TRY";
    function ekle(v) { if (v === null || v === undefined || !isFinite(v)) return; var c = cent(v); if (adaylar.indexOf(c) < 0) adaylar.push(c); }
    if (tl) { ekle(ode); ekle(dahil); }
    else if (f.kur && f.kur > 0) { if (ode !== null) ekle(ode * f.kur); if (dahil !== null) ekle(dahil * f.kur); }
    var iade = f.tip === "IADE";
    var ana = adaylar.length ? adaylar[0] : null;
    return { no: f.no, bn: f.bn, ettn: f.ettn, tarih: f.tarih, gun: f.gun, cpId: (f.cp && f.cp.id) || "", cpAd: (f.cp && f.cp.ad) || "", yon: yon, adaylar: adaylar, ana: ana,
      kalan: ana, toplam: ana, iade: iade, para: para, kaynak: "xml", dosya: f.dosya || "", disi: ana === null };
  }
  function faturaExcel(e, yon) {
    var tp = e.toplam !== null ? e.toplam : (e.matrah !== null && e.kdv !== null ? e.matrah + e.kdv : null);
    var c = tp === null ? null : cent(tp);
    return { no: e.belge, bn: e.bn, ettn: e.ettn, tarih: e.tarih, gun: e.gun, cpId: e.vkn || "", cpAd: e.unvan || "", yon: yon, adaylar: c === null ? [] : [c], ana: c, kalan: c, toplam: c, iade: false, para: "TRY", kaynak: "excel", dosya: "", disi: c === null, satir: e.satir };
  }

  // ------------------------------------------------------------ eşleştirme
  var DURMA = /^(ltd|sti|as|san|tic|ve|ticaret|sanayi|limited|sirketi|anonim|org|ith|ihr|paz|gida|ins|taah|hiz|tur|ornek|mah|sok|cad|no|a|s)$/;
  function belirteler(s) { return ascii(s).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (x) { return x.length > 2 && !DURMA.test(x); }); }
  function taraflar(fat) { // cari anahtarı -> {id, ad, jetonlar}
    var m = {};
    fat.forEach(function (f) { var key = f.cpId || ("ad:" + norm(f.cpAd)); if (!key || key === "ad:") return; if (!m[key]) m[key] = { key: key, id: f.cpId, ad: f.cpAd, jeton: belirteler(f.cpAd) }; });
    return m;
  }
  function cariAnahtar(f) { return f.cpId || ("ad:" + norm(f.cpAd)); }
  function metinNorm(s) { return ascii(s).replace(/[^a-z0-9]/g, ""); }

  function eslestir(HAR, FAT, ayar) {
    ayar = ayar || {};
    var tolC = Math.round((ayar.tol === undefined ? 0.05 : ayar.tol) * 100), avans = ayar.avansGun === undefined ? 30 : ayar.avansGun;
    var farkOran = ayar.farkOran === undefined ? 0.02 : ayar.farkOran;
    var uyari = [];
    var iadeler = FAT.filter(function (f) { return f.iade; });
    var disi = FAT.filter(function (f) { return !f.iade && f.disi; });
    var aktif = FAT.filter(function (f) { return !f.iade && !f.disi; });
    aktif.forEach(function (f, i) { f.id = i; f.kalan = f.ana; f.odemeler = []; });
    var havuz = { giden: aktif.filter(function (f) { return f.yon === "giden"; }), gelen: aktif.filter(function (f) { return f.yon === "gelen"; }) };
    var cariler = { giden: taraflar(havuz.giden), gelen: taraflar(havuz.gelen) };
    var sonuc = HAR.filter(function (h) { return !h.mukerrer; }).sort(function (a, b) { return a.gun - b.gun || a.satir - b.satir; }).map(function (h) {
      return { h: h, yon: h.c > 0 ? "giden" : "gelen", mutlak: Math.abs(h.c), durum: null, parcalar: [], guven: "", neden: [], fark: 0, kategori: "", adaylar: [], cari: null };
    });
    function acik(f) { return f.kalan > tolC; }
    function uygunTarih(f, r) { return f.gun <= r.h.gun + avans; }
    function kalanOde(f, tutarC, r, not) { f.odemeler.push({ hareket: r.h, tutar: tutarC }); f.kalan -= tutarC; }

    // ---- kanıt çıkarımı
    sonuc.forEach(function (r) {
      var metin = (r.h.aciklama + " " + r.h.taraf), mn = metinNorm(metin), mAscii = ascii(metin);
      r.noKanit = []; r.vknKanit = []; r.adKanit = [];
      var hv = havuz[r.yon], digitTok = (mAscii.match(/\d{3,}/g) || []);
      var digitSet = {}; digitTok.forEach(function (d) { digitSet[d.replace(/^0+(?=.)/, "")] = 1; });
      hv.forEach(function (f) {
        if (!uygunTarih(f, r)) return;
        var seq = f.bn.replace(/^[A-Z0-9]{3}20\d{2}(?=\d{9}$)/, "").replace(/^0+(?=.)/, "");
        var tamNo = f.bn.length >= 5 && mn.toUpperCase().indexOf(f.bn) >= 0;
        var seqEs = !tamNo && seq.length >= 3 && /^\d+$/.test(seq) && digitSet[seq] && f.bn.length > seq.length;
        var duz = !tamNo && !seqEs && /^\d+$/.test(f.bn.replace(/^0+(?=.)/, "")) && f.bn.replace(/^0+(?=.)/, "").length >= 3 && digitSet[f.bn.replace(/^0+(?=.)/, "")];
        if (tamNo) r.noKanit.push({ f: f, tur: "tam" }); else if (seqEs || duz) r.noKanit.push({ f: f, tur: "sira" });
      });
      var vk = (mAscii.match(/\b\d{10,11}\b/g) || []);
      Object.keys(cariler[r.yon]).forEach(function (key) {
        var c = cariler[r.yon][key];
        if (c.id && vk.indexOf(c.id) >= 0) { r.vknKanit.push(c); return; }
        if (!c.jeton.length) return;
        var dTok = belirteler(metin), es = 0, uzun = false;
        c.jeton.forEach(function (p) { if (dTok.some(function (d) { return d === p || (d.length >= 5 && p.indexOf(d) === 0) || (p.length >= 5 && d.indexOf(p) === 0); })) { es++; if (p.length >= 4) uzun = true; } });
        if (uzun && es / c.jeton.length >= 0.5) r.adKanit.push({ c: c, skor: es / c.jeton.length });
      });
    });

    function parcaEkle(r, f, c, not) { r.parcalar.push({ f: f, tutar: c, not: not || "" }); kalanOde(f, c, r); }
    function altKumeKucuk(liste, hedef, tol, maks) { // numarası açıklamada geçen (az sayıda) fatura içinde tam arama
      var cozum = [], dugum = 0, LIM = 250000;
      liste = liste.slice(0, 14);
      (function ara(i, secili, toplam) {
        if (cozum.length >= 3 || dugum++ > LIM) return;
        if (Math.abs(toplam - hedef) <= tol && secili.length) { cozum.push(secili.slice()); return; }
        if (i >= liste.length || secili.length >= maks || toplam > hedef + tol) return;
        for (var j = i; j < liste.length; j++) { secili.push(liste[j]); ara(j + 1, secili, toplam + liste[j].k); secili.pop(); if (cozum.length >= 3) return; }
      })(0, [], 0);
      return cozum;
    }
    function altKume(liste, hedef, tol, maks, kap) { // 2..4 fatura toplamı hedefe eşit mi (ortada buluşma); <=3 çözüm, küçük birleşim önce. .rastgele: tesadüfen tutma beklentisi
      var n = Math.min(liste.length, kap || 60), v = liste.slice(0, n), cozum = [], pairs = [], i, j;
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) pairs.push({ s: v[i].k + v[j].k, i: i, j: j });
      pairs.sort(function (a, b) { return a.s - b.s; });
      function bul(alt, ust, fn) { var lo = 0, hi = pairs.length; while (lo < hi) { var m = (lo + hi) >> 1; if (pairs[m].s < alt) lo = m + 1; else hi = m; } for (var q = lo; q < pairs.length && pairs[q].s <= ust; q++) { if (fn(pairs[q]) === false) return; } }
      var gor = {};
      function ekle(idx) { var key = idx.join(","); if (gor[key] || cozum.length >= 3) return; gor[key] = 1; cozum.push(idx.map(function (q) { return v[q]; })); }
      bul(hedef - tol, hedef + tol, function (p) { ekle([p.i, p.j]); return cozum.length < 3; });
      if (maks >= 3 && cozum.length < 3) for (i = 0; i < n && cozum.length < 3; i++) bul(hedef - v[i].k - tol, hedef - v[i].k + tol, function (p) { if (p.i > i) ekle([i, p.i, p.j]); return cozum.length < 3; });
      if (maks >= 4 && cozum.length < 3) for (var a2 = 0; a2 < pairs.length && cozum.length < 3; a2++) { var p1 = pairs[a2]; bul(hedef - p1.s - tol, hedef - p1.s + tol, function (p2) { if (p2.i > p1.j) ekle([p1.i, p1.j, p2.i, p2.j]); return cozum.length < 3; }); }
      cozum.sort(function (a, b) { return a.length - b.length; });
      var kombi = 0, c = 1; for (var k = 1; k <= Math.min(maks, n); k++) { c = c * (n - k + 1) / k; if (k >= 2) kombi += c; }
      cozum.rastgele = kombi * (2 * tol + 1) / Math.max(hedef, 1);
      return cozum;
    }
    function tutarAday(f) { return f.adaylar.filter(function (a) { return a <= f.kalan + tolC || true; }); }
    function tutarTutar(f, c) { // fatura tutar adaylarından biri c'ye (tam kalan ile birlikte) uyuyor mu
      if (Math.abs(f.kalan - c) <= tolC) return true;
      if (f.odemeler.length === 0) return f.adaylar.some(function (a) { return Math.abs(a - c) <= tolC; });
      return false;
    }

    // ---- GEÇİŞ 1: fatura numarası kanıtı
    sonuc.forEach(function (r) {
      if (r.durum || !r.noKanit.length) return;
      var L = r.noKanit.map(function (x) { return x.f; }).filter(acik).sort(function (a, b) { return a.gun - b.gun; });
      if (!L.length) return;
      var tur = r.noKanit.every(function (x) { return x.tur === "tam"; }) ? "yuksek" : "orta";
      var kal = L.reduce(function (s, f) { return s + f.kalan; }, 0);
      r.cari = L[0].cpAd;
      var nedenNo = "Açıklamada fatura no: " + L.map(function (f) { return f.no; }).join(", ");
      if (L.length === 1) {
        var f = L[0], d = r.mutlak - f.kalan;
        if (tutarTutar(f, r.mutlak)) { parcaEkle(r, f, f.kalan, ""); r.durum = "eslesti"; r.guven = tur; r.neden = [nedenNo, "Tutar uyuyor"]; return; }
        if (f.odemeler.length === 0 && f.adaylar.some(function (a) { return Math.abs(a - r.mutlak) <= tolC; })) { var a = f.adaylar.filter(function (x) { return Math.abs(x - r.mutlak) <= tolC; })[0]; parcaEkle(r, f, f.kalan, ""); r.durum = "eslesti"; r.guven = tur; r.neden = [nedenNo, "Tutar alternatif toplamla (ödenecek/tevkifat) uyuyor"]; return; }
        if (Math.abs(d) <= farkOran * f.kalan) { var kapat = f.kalan; parcaEkle(r, f, kapat, ""); r.durum = "farkli"; r.fark = d; r.guven = tur; r.neden = [nedenNo, "Tutar farkı " + T(d) + " TL (" + (d < 0 ? "komisyon/kesinti/yuvarlama" : "fazla yatan/avans/yuvarlama") + " olabilir)"]; return; }
        if (r.mutlak < f.kalan) { parcaEkle(r, f, r.mutlak, "kısmi"); r.durum = "kismi"; r.guven = tur; r.fark = d; r.neden = [nedenNo, "Fatura kalanından az; kısmi ödeme (kalan " + T(f.kalan) + " TL)"]; return; }
        parcaEkle(r, f, f.kalan, ""); r.durum = "fazla"; r.guven = tur; r.fark = d; r.neden = [nedenNo, "Tutar faturadan " + T(d) + " TL fazla (avans ya da başka fatura olabilir)"]; return;
      }
      // birden çok numara
      if (Math.abs(kal - r.mutlak) <= tolC) { L.forEach(function (f) { parcaEkle(r, f, f.kalan, ""); }); r.durum = "toplu"; r.guven = tur; r.neden = [nedenNo, L.length + " faturanın toplamı tutara eşit"]; return; }
      var alt = altKumeKucuk(L.map(function (f) { return { f: f, k: f.kalan }; }), r.mutlak, tolC, 8);
      if (alt.length) { alt[0].forEach(function (x) { parcaEkle(r, x.f, x.k, ""); }); r.durum = "toplu"; r.guven = "orta"; r.neden = [nedenNo, "Numaralı faturalardan " + alt[0].length + " tanesinin toplamı tutara eşit (diğerleri açık kaldı)"]; return; }
      var dd = r.mutlak - kal;
      if (r.mutlak < kal) { var kalan = r.mutlak; L.forEach(function (f) { if (kalan <= 0) return; var c = Math.min(f.kalan, kalan); parcaEkle(r, f, c, c < f.kalan ? "kısmi" : ""); kalan -= c; }); r.durum = "kismi"; r.guven = "orta"; r.fark = dd; r.neden = [nedenNo, "Toplam " + T(kal) + " TL; yatan tutar daha az. En eski faturadan düşüldü"]; return; }
      L.forEach(function (f) { parcaEkle(r, f, f.kalan, ""); }); r.durum = "fazla"; r.guven = "orta"; r.fark = dd; r.neden = [nedenNo, "Tutar numaralı faturaların toplamından " + T(dd) + " TL fazla"];
    });

    // ---- GEÇİŞ 2: cari belli (VKN / unvan). Kesin eşleşmeler önce (tek fatura, sonra birleşim, sonra yakın tutar); tahmini mahsup en sona kalır.
    function cariBilgi(r) {
      var P = r.vknKanit.map(function (c) { return { c: c, skor: 2 }; }).concat(r.adKanit);
      if (!P.length) return null;
      P.sort(function (a, b) { return b.skor - a.skor; });
      var top = P[0], ayniSkor = P.filter(function (p) { return p.skor === top.skor; });
      var cks = ayniSkor.length === 1 ? [top.c] : ayniSkor.map(function (p) { return p.c; });
      var anahtarSet = {}; cks.forEach(function (c) { anahtarSet[c.key] = 1; });
      var L = havuz[r.yon].filter(function (f) { return anahtarSet[cariAnahtar(f)] && acik(f) && uygunTarih(f, r); }).sort(function (a, b) { return a.gun - b.gun; });
      var kanit = (r.vknKanit.length && r.vknKanit.indexOf(top.c) >= 0 ? "VKN eşleşti" : "Unvan benzerliği") + ": " + cks.map(function (c) { return c.ad || c.id; }).join(" / ");
      return { cks: cks, L: L, kanit: kanit, ad: cks.map(function (c) { return c.ad || c.id; }).join(" / ") };
    }
    function gecis2(mod) {
      sonuc.forEach(function (r) {
        if (r.durum) return;
        var ci = cariBilgi(r); if (!ci) return;
        var L = ci.L, kanit = ci.kanit; r.cari = ci.ad;
        if (mod === "tek") {
          if (ci.cks.length !== 1 || !L.length) return;
          var tek = L.filter(function (f) { return tutarTutar(f, r.mutlak); });
          if (!tek.length) return;
          var f = tek[0]; parcaEkle(r, f, f.kalan, ""); r.durum = "eslesti"; r.guven = tek.length === 1 ? "orta" : "dusuk";
          r.neden = [kanit, "Tutar " + f.no + " ile aynı" + (tek.length > 1 ? " (aynı tutarlı " + tek.length + " açık fatura var; en eskisi alındı, doğrulayın)" : "")];
          if (tek.length > 1) r.adaylar = tek.map(function (x) { return x.no; });
        } else if (mod === "alt") {
          if (ci.cks.length !== 1 || !L.length) return;
          var alt = altKume(L.map(function (f) { return { f: f, k: f.kalan }; }), r.mutlak, tolC, 4, 60);
          if (!alt.length) return;
          var tesaduf = alt.rastgele >= 0.02;
          alt[0].forEach(function (x) { parcaEkle(r, x.f, x.k, ""); }); r.durum = "toplu"; r.guven = alt.length === 1 && !tesaduf ? "orta" : "dusuk";
          r.neden = [kanit, alt[0].length + " açık faturanın toplamı tutara eşit" + (alt.length > 1 ? " (birden çok olası birleşim var; ilki alındı, doğrulayın)" : tesaduf ? " (carinin çok sayıda açık faturası olduğundan tutarın tesadüfen tutma olasılığı var; doğrulayın)" : "")];
          if (alt.length > 1) r.adaylar = alt.map(function (a) { return a.map(function (x) { return x.f.no; }).join("+"); });
        } else if (mod === "yakin") {
          if (ci.cks.length !== 1 || !L.length) return;
          var yak = L.filter(function (f) { return Math.abs(f.kalan - r.mutlak) <= farkOran * f.kalan; });
          if (yak.length !== 1) return;
          var y = yak[0], d = r.mutlak - y.kalan; parcaEkle(r, y, y.kalan, ""); r.durum = "farkli"; r.fark = d; r.guven = "dusuk";
          r.neden = [kanit, y.no + " ile tutar farkı " + T(d) + " TL (" + (d < 0 ? "komisyon/kesinti/yuvarlama" : "avans/yuvarlama") + " olabilir)"];
        } else if (mod === "kalan") {
          if (!L.length) { r.durum = "cariBelli"; r.guven = "dusuk"; r.neden = [kanit, "Bu carinin açık faturası yok (avans/önceki dönem faturası olabilir)"]; return; }
          if (ci.cks.length !== 1) { r.durum = "cariBelli"; r.guven = "dusuk"; r.adaylar = L.slice(0, 6).map(function (x) { return x.no; }); r.neden = [kanit, "Birden çok cari adayı; otomatik atanmadı"]; return; }
          var kal = L.reduce(function (s, f) { return s + f.kalan; }, 0);
          if (r.mutlak < kal) {
            var kalan = r.mutlak; L.forEach(function (f) { if (kalan <= 0) return; var c = Math.min(f.kalan, kalan); r.parcalar.push({ f: f, tutar: c, not: "öneri" }); kalan -= c; });
            r.durum = "kismi"; r.guven = "dusuk"; r.fark = r.mutlak - kal; r.oneri = true; r.neden = [kanit, "Tutar hiçbir fatura/birleşimle tutmadı; en eskiden başlayarak mahsup ÖNERİSİ (faturaların kalanı DÜŞÜLMEDİ; carinin toplam açığı " + T(kal) + " TL)"]; return;
          }
          r.durum = "cariBelli"; r.guven = "dusuk"; r.fark = r.mutlak - kal; r.neden = [kanit, "Tutar carinin tüm açık faturalarından (" + T(kal) + " TL) fazla (avans olabilir)"];
        }
      });
    }
    gecis2("tek"); gecis2("alt"); gecis2("yakin");

    // ---- GEÇİŞ 3: yalnız tutar
    var tutarIndeks = {};
    sonuc.forEach(function (r) {
      if (r.durum || r.vknKanit.length || r.adKanit.length) return;
      var L = havuz[r.yon].filter(function (f) { return acik(f) && uygunTarih(f, r) && tutarTutar(f, r.mutlak); });
      if (L.length === 1) {
        var f = L[0]; r.cari = f.cpAd;
        // aynı tutarda başka hareket de aynı faturaya adaylık yapıyor mu?
        var rakip = sonuc.filter(function (q) { return q !== r && !q.durum && q.yon === r.yon && Math.abs(q.mutlak - r.mutlak) <= tolC; }).length;
        if (rakip) { r.durum = "aday"; r.guven = "dusuk"; r.adaylar = [f.no]; r.neden = ["Tutar " + f.no + " ile aynı ama aynı tutarda " + (rakip + 1) + " hareket var; otomatik atanmadı"]; return; }
        parcaEkle(r, f, f.kalan, ""); r.durum = "eslesti"; r.guven = "dusuk"; r.neden = ["Yalnız tutar eşleşti (açıklamada fatura no / cari yok): " + f.no, "Cari doğrulanamadı; doğrulayın"]; return;
      }
      if (L.length > 1) { r.durum = "aday"; r.guven = "dusuk"; r.adaylar = L.slice(0, 8).map(function (f) { return f.no + " (" + f.cpAd + ")"; }); r.neden = ["Tutar " + L.length + " açık faturayla aynı; açıklamada ayırt edici bilgi yok"]; return; }
    });

    gecis2("kalan");

    // ---- eşleşmeyenler: kategori
    sonuc.forEach(function (r) {
      if (!r.durum) { r.durum = "eslesmedi"; r.kategori = kategori(r.h.aciklama + " " + r.h.taraf, r.yon === "giden"); r.neden = r.neden.length ? r.neden : ["Karşılığı açık bir faturada bulunamadı"]; }
    });

    // ---- sonuç derleme
    var acikFatura = aktif.filter(acik), kapali = aktif.filter(function (f) { return !acik(f); });
    var refGun = ayar.refGun !== undefined ? ayar.refGun : (HAR.length ? Math.max.apply(null, HAR.map(function (h) { return h.gun; })) : null);
    var ozet = ozetle(sonuc, HAR, aktif, acikFatura);
    return { sonuc: sonuc, acik: acikFatura, kapali: kapali, iadeler: iadeler, dovizDisi: disi, fatura: aktif, refGun: refGun, ozet: ozet, ayar: { tol: tolC / 100, avansGun: avans } };
  }

  function ozetle(sonuc, HAR, aktif, acikFatura) {
    var S = { hareket: HAR.length, mukerrerAtlanan: HAR.filter(function (h) { return h.mukerrer; }).length, durum: {}, girisC: 0, cikisC: 0, durumC: {}, fatura: aktif.length, faturaC: 0, kapaliC: 0, acikC: 0 };
    sonuc.forEach(function (r) {
      S.durum[r.durum] = (S.durum[r.durum] || 0) + 1; S.durumC[r.durum] = (S.durumC[r.durum] || 0) + r.h.c;
      if (r.h.c > 0) S.girisC += r.h.c; else S.cikisC += r.h.c;
    });
    var toplamDurumC = 0; Object.keys(S.durumC).forEach(function (k) { toplamDurumC += S.durumC[k]; });
    S.dengeHareket = toplamDurumC === S.girisC + S.cikisC && Object.keys(S.durum).reduce(function (s, k) { return s + S.durum[k]; }, 0) === sonuc.length;
    aktif.forEach(function (f) { S.faturaC += f.ana; S.acikC += Math.max(0, f.kalan); });
    S.odenenC = aktif.reduce(function (s, f) { return s + f.odemeler.reduce(function (t, o) { return t + o.tutar; }, 0); }, 0);
    var kalanToplam = aktif.reduce(function (s, f) { return s + f.kalan; }, 0);
    S.dengeFatura = S.faturaC === S.odenenC + kalanToplam;
    return S;
  }

  var KAT = [
    [/komisyon|masraf|ucret|bsmv|aidat|hesap isletim|eft |havale ucret|swift/, "Banka masrafı / komisyon", null],
    [/vergi|vd |v\.d|muhtasar|kdv|damga|gelir idaresi|sgk|sosyal guvenlik|bagkur|belediye|trafik cezasi/, "Vergi / SGK / resmi ödeme", false],
    [/kredi|taksit|faiz|kmh|rotatif|kkdf/, "Kredi / faiz / taksit", null],
    [/maas|personel|bordro|iscilik/, "Maaş / personel", false],
    [/pos|sanal pos|kredi karti|kart tahsilat|iyzico|paytr|param |payu|sipay/, "POS / kart tahsilatı", true],
    [/cek|senet/, "Çek / senet", null],
    [/elektrik|dogalgaz|su fatura|internet|telefon|turkcell|vodafone|turk telekom|enerjisa|igdas|iski|aski/, "Fatura / abonelik gideri", false],
    [/kira/, "Kira", null],
    [/virman|kendi hesab|hesaplar arasi|ortak|sermaye/, "Virman / ortak cari", null],
    [/nakit|atm|kasa/, "Nakit yatırma / çekme", null]
  ];
  function kategori(metin, giris) {
    var a = ascii(metin);
    for (var i = 0; i < KAT.length; i++) if (KAT[i][0].test(a) && (KAT[i][2] === null || KAT[i][2] === giris)) return KAT[i][1];
    return "Sınıflandırılamadı";
  }

  // Yaşlandırma: cari bazlı açık fatura
  function yaslandir(acik, refGun, yon) {
    var m = {}, kovalar = ["0-30", "31-60", "61-90", "90+"];
    acik.filter(function (f) { return f.yon === yon; }).forEach(function (f) {
      var key = cariAnahtar(f), c = m[key] = m[key] || { ad: f.cpAd || f.cpId || "(cari yok)", vkn: f.cpId, adet: 0, toplam: 0, kova: [0, 0, 0, 0], enEski: null, faturalar: [] };
      var gun = refGun === null ? 0 : refGun - f.gun, i = gun <= 30 ? 0 : gun <= 60 ? 1 : gun <= 90 ? 2 : 3;
      c.adet++; c.toplam += f.kalan; c.kova[i] += f.kalan; c.faturalar.push({ f: f, gun: gun }); if (c.enEski === null || gun > c.enEski) c.enEski = gun;
    });
    return { kovalar: kovalar, cariler: Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.toplam - a.toplam; }) };
  }

  var api = { baslikTani: baslikTani, hareketler: hareketler, ekstreDenetle: ekstreDenetle, faturaXml: faturaXml, faturaExcel: faturaExcel, eslestir: eslestir, yaslandir: yaslandir, kategori: kategori, KOLON_ADI: KOLON_ADI, SIRA: SIRA, cent: cent, gunNo: gunNo };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BET = api;
})(typeof self !== "undefined" ? self : this);
