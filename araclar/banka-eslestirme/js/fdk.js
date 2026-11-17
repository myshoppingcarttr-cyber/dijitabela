/* Muhasebeleşmemiş fatura kontrolü — çekirdek (tarayıcı + Node). e-Fatura XML kayıtları ile muhasebe kayıt dökümünü karşılaştırır.
   Hiçbir veri dışarı gönderilmez. Mevzuat kuralı uygulamaz; yalnız iki kayıt kümesini karşılaştırır. */
(function (root) {
  "use strict";
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


  // ------------------------------------------------------------ defter sütunları
  var DESEN = {
    tarih: [/^(faturatarihi|belgetarihi|duzenlemetarihi|evraktarihi)$/, /^(tarih|islemtarihi|kayittarihi|fistarihi|valor|vade)$/],
    belge: [/^(faturano|faturanumarasi|faturanosu|efaturano|faturasiranosu|faturaserino)$/, /^(belgeno|belgenumarasi|evrakno|evraknumarasi|dokumanno|belgenosu|evraknosu|serino)$/, /^(belge|evrak|fatura)$/],
    ettn: [/^(ettn|uuid|faturaettn|faturauuid|ettnno|evrakettn)$/],
    vkn: [/^(vkn|tckn|vkntckn|vknno|vergino|vergikimlikno|vergikimliknumarasi|vergikimliknosu|tckimlikno|vergikimlikn)$/],
    unvan: [/^(unvan|unvani|cariunvan|cariunvani|firmaunvani|firma|saticiunvani|aliciunvani|musteriunvani|adsoyadunvan|adiunvani|carihesapunvani|musteri|satici|alici|cariadi|hesapadi|carihesap|cari)$/],
    matrah: [/^(matrah|kdvmatrahi|kdvharic|kdvharictutar|kdvharictutari|vergiharic|vergimatrahi|nettutar|aratoplam|matrahtutari|tutarkdvharic|malbedeli)$/],
    kdv: [/^(kdv|kdvtutari|kdvtutar|kdvtoplami|hesaplanankdv|indirilecekkdv|kdvtl|toplamkdv|vergi|vergitutari)$/],
    toplam: [/^(kdvdahil|kdvdahiltutar|kdvdahiltutari|vergidahil|toplamtutar|geneltoplam|faturatutari|belgetutari|faturabedeli|bruttutar|brut|odenecektutar|odenecek)$/, /^(toplam|tutar|bedel)$/],
    borc: [/^(borc|borctutari|borctl|borctltutari|borctutar|debit)$/],
    alacak: [/^(alacak|alacaktutari|alacaktl|alacaktltutari|alacaktutar|credit)$/],
    aciklama: [/^(aciklama|aciklamalar|ack|islemaciklamasi|hareketaciklamasi|detay|fisaciklamasi|not)$/]
  };
  var KOLON_ADI = { tarih: "Tarih", belge: "Fatura/belge no", ettn: "ETTN", vkn: "VKN/TCKN", unvan: "Unvan", matrah: "Matrah (KDV hariç)", kdv: "KDV tutarı", toplam: "Toplam (KDV dahil)", borc: "Borç", alacak: "Alacak", aciklama: "Açıklama" };
  var SIRA = ["tarih", "belge", "ettn", "vkn", "unvan", "matrah", "kdv", "toplam", "borc", "alacak", "aciklama"];

  function baslikTani(rows) {
    var en = null;
    for (var r = 0; r < Math.min(rows.length, 40); r++) {
      var sat = rows[r] || [], normlar = sat.map(norm), kol = {}, puan = 0;
      SIRA.forEach(function (k) {
        for (var p = 0; p < DESEN[k].length && kol[k] === undefined; p++)
          for (var c = 0; c < normlar.length; c++) { if (normlar[c] && DESEN[k][p].test(normlar[c]) && !Object.keys(kol).some(function (x) { return kol[x] === c; })) { kol[k] = c; puan++; break; } }
      });
      var tutarVar = kol.matrah !== undefined || kol.kdv !== undefined || kol.toplam !== undefined || kol.borc !== undefined || kol.alacak !== undefined;
      var anahtarVar = kol.belge !== undefined || kol.ettn !== undefined || kol.aciklama !== undefined;
      if (tutarVar && anahtarVar && puan >= 2) { if (!en || puan > en.skor) en = { basSatir: r, kolonlar: kol, skor: puan }; if (en.skor >= 6) break; }
    }
    if (en) en.basliklar = (rows[en.basSatir] || []).map(function (x) { return String(x === null || x === undefined ? "" : x); });
    return en;
  }
  var OZET_ADI = { toplam: 1, geneltoplam: 1, devirtoplam: 1, aratoplam: 1, sayfatoplami: 1, genel: 1 };
  var EFATURA_NO = /^[A-Z0-9]{3}20\d{2}\d{9}$/;
  function vknKarsi(v) { var s = String(v === null || v === undefined ? "" : v).trim().replace(/\.0+$/, "").replace(/\D/g, ""); if (s.length >= 7 && s.length < 10) s = ("0000000000" + s).slice(-10); return s; }

  function kayitlar(rows, k, basSatir) {
    var out = [], atlanan = [], uyari = [], c = 0;
    function ham(sat) { return sat.slice(0, 8).map(function (h) { return h == null ? "" : String(h); }).join(" | "); }
    for (var r = basSatir + 1; r < rows.length; r++) {
      var sat = rows[r] || [];
      if (sat.every(function (h) { return h === null || h === undefined || String(h).trim() === ""; })) continue;
      var ilk = norm(sat.filter(function (h) { return h != null && String(h).trim() !== ""; })[0]);
      if (OZET_ADI[ilk]) { atlanan.push({ satir: r + 1, neden: "toplam/özet satırı", icerik: ham(sat) }); continue; }
      var acik = k.aciklama !== undefined && sat[k.aciklama] != null ? String(sat[k.aciklama]) : "";
      var hamBelge = k.belge !== undefined && sat[k.belge] != null ? String(sat[k.belge]).trim() : "";
      var ettn = k.ettn !== undefined && sat[k.ettn] != null ? String(sat[k.ettn]).trim().toLowerCase() : "";
      if (ettn && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(ettn)) ettn = "";
      var bn = belgeBelirle(hamBelge, acik);
      var matrah = k.matrah !== undefined ? sayiCoz(sat[k.matrah]) : null, kdv = k.kdv !== undefined ? sayiCoz(sat[k.kdv]) : null, toplam = k.toplam !== undefined ? sayiCoz(sat[k.toplam]) : null;
      if (toplam === null && (k.borc !== undefined || k.alacak !== undefined)) {
        var b = k.borc !== undefined ? sayiCoz(sat[k.borc]) : null, a = k.alacak !== undefined ? sayiCoz(sat[k.alacak]) : null;
        if (b !== null || a !== null) toplam = Math.abs((b || 0) - (a || 0));
        if (b && a) c++;
      }
      if (toplam === null && matrah !== null && kdv !== null) toplam = Math.round((Math.abs(matrah) + Math.abs(kdv)) * 100) / 100;
      var tarih = k.tarih !== undefined ? tarihCoz(sat[k.tarih]) : null;
      if (!bn && !ettn) { atlanan.push({ satir: r + 1, neden: "belge no yok (ödeme, mahsup ya da açıklama satırı olabilir)", icerik: ham(sat) }); continue; }
      if (matrah === null && kdv === null && toplam === null) { atlanan.push({ satir: r + 1, neden: "tutar yok/okunamadı", icerik: ham(sat) }); continue; }
      out.push({ id: out.length, satir: r + 1, tarih: tarih, gun: tarih ? gunNo(tarih) : null, belge: hamBelge || bn, bn: bn, ettn: ettn,
        vkn: k.vkn !== undefined ? vknKarsi(sat[k.vkn]) : "", unvan: k.unvan !== undefined && sat[k.unvan] != null ? String(sat[k.unvan]).trim() : "",
        matrah: matrah === null ? null : Math.abs(matrah), kdv: kdv === null ? null : Math.abs(kdv), toplam: toplam === null ? null : Math.abs(toplam), aciklama: acik });
    }
    if (c) uyari.push(c + " satırda hem borç hem alacak dolu; net tutar alındı.");
    return { kayit: out, atlanan: atlanan, uyari: uyari };
  }

  // ------------------------------------------------------------ fatura (XML) tarafı
  function fSay(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function faturaNormal(f, dosya) {
    var kdvT = 0, kdvVar = false;
    f.kdv.forEach(function (v) { if (isFinite(v.vergi)) { kdvT += v.vergi; kdvVar = true; } });
    var t = f.toplam || {};
    var haric = fSay(t.haric); if (haric === null) haric = fSay(t.satir);
    var dahil = fSay(t.dahil), ode = fSay(t.odenecek);
    if (dahil === null && haric !== null && kdvVar) dahil = Math.round((haric + kdvT) * 100) / 100;
    return { dosya: dosya || f.dosya || "", no: f.no, bn: belgeNorm(f.no), ettn: (f.ettn || "").toLowerCase(), tarih: tarihCoz(f.tarih), tip: f.tip, senaryo: f.senaryo, para: f.para || "TRY", kur: fSay(f.kur),
      satici: f.satici, alici: f.alici, haric: haric, dahil: dahil, odenecek: ode, kdvT: kdvVar ? Math.round(kdvT * 100) / 100 : null, tevkifat: f.tevkifatVar ? Math.round(f.tevkifat * 100) / 100 : 0,
      sg: f.tip === "IADE" ? -1 : 1, yon: "?", cp: { id: "", ad: "" } };
  }
  // ham fatura listesi [{dosya, f}] -> { faturalar, mukerrerXml }
  function faturalariHazirla(liste, ayar) {
    var out = [], goru = {}, mukerrer = [];
    liste.forEach(function (d) {
      var n = faturaNormal(d.f, d.dosya); n.gun = n.tarih ? gunNo(n.tarih) : null;
      var anahtar = n.ettn || (n.satici.id + "|" + n.bn);
      if (goru[anahtar]) { mukerrer.push({ tur: "xml", no: n.no, ettn: n.ettn, dosya: n.dosya, ilkDosya: goru[anahtar].dosya, aciklama: "Aynı " + (n.ettn ? "ETTN" : "satıcı+fatura no") + " ikinci kez yüklenmiş; yalnız ilki sayıldı." }); return; }
      goru[anahtar] = n; out.push(n);
    });
    // kendi VKN
    var own = (ayar && ayar.kendiVkn) || "", say = {};
    if (!own) {
      out.forEach(function (f) { [f.satici.id, f.alici.id].forEach(function (id) { if (id) say[id] = (say[id] || 0) + 1; }); });
      var top = Object.keys(say).sort(function (a, b) { return say[b] - say[a]; })[0];
      if (top && say[top] >= 0.6 * out.length) own = top;
    }
    out.forEach(function (f) {
      if (own && f.alici.id === own && f.satici.id !== own) { f.yon = "gelen"; f.cp = f.satici; }
      else if (own && f.satici.id === own) { f.yon = "giden"; f.cp = f.alici; }
      else { f.yon = own ? "dışı" : "?"; f.cp = f.satici; }
    });
    return { faturalar: out, mukerrerXml: mukerrer, kendiVkn: own };
  }

  // ------------------------------------------------------------ karşılaştırma
  function yakin(a, b, tol) { return Math.abs(a - b) <= tol + 1e-9; }
  function cc(x) { return Math.round(x * 100); }
  function ay(iso) { return iso ? iso.slice(0, 7) : ""; }
  function mesafe(a, b) { // Levenshtein
    if (a === b) return 0; if (Math.abs(a.length - b.length) > 3) return 9;
    var d = [], i, j; for (i = 0; i <= a.length; i++) { d[i] = [i]; } for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function unvanBenzer(a, b) {
    function t(s) { return ascii(s).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (x) { return x.length > 2 && !/^(ltd|sti|a|as|san|tic|ve|ticaret|sanayi|limited|sirketi|anonim)$/.test(x); }); }
    var x = t(a), y = t(b); if (!x.length || !y.length) return false;
    var o = 0; x.forEach(function (w) { if (y.indexOf(w) >= 0) o++; }); return o / Math.min(x.length, y.length) >= 0.5;
  }
  function vknUyar(e, f, ownBilinen) { // defterdeki VKN faturadaki karşı tarafla uyuşuyor mu (null: karşılaştırılamaz)
    if (!e.vkn) return null;
    if (ownBilinen && f.cp.id) return e.vkn === f.cp.id;
    return e.vkn === f.satici.id || e.vkn === f.alici.id;
  }

  // tutar karşılaştırması: defter girdisi (e) ↔ fatura (f). -> {farklar:[{alan,defter,fatura,fark}], taban:'...' , dovizUyari}
  function tutarKarsi(e, f, tol) {
    var farklar = [], taban = [], doviz = f.para !== "TRY";
    function adaylar(deger) { // fatura değeri ve (dövizliyse) TL karşılığı
      if (deger === null) return [];
      var a = [{ v: deger, tol: tol, kur: false }];
      if (doviz && f.kur && f.kur > 0) a.push({ v: Math.round(deger * f.kur * 100) / 100, tol: Math.max(tol, Math.abs(deger * f.kur) * 0.01), kur: true });
      return a;
    }
    var kontrolEdilemedi = false;
    function dene(alan, dVal, adayEtiket) {
      if (dVal === null) return;
      var ok = null, enYakin = null;
      adayEtiket.forEach(function (ae) { adaylar(ae[1]).forEach(function (c) { if (ok) return; if (yakin(dVal, Math.abs(c.v), c.tol)) ok = ae[0] + (c.kur ? " (kurla TL)" : ""); else if (enYakin === null || Math.abs(dVal - Math.abs(c.v)) < Math.abs(dVal - enYakin)) enYakin = Math.abs(c.v); }); });
      if (ok) { taban.push(alan + ": " + ok); return; }
      if (doviz && !(f.kur && f.kur > 0)) { kontrolEdilemedi = true; return; }
      if (enYakin === null) return;
      farklar.push({ alan: alan, defter: dVal, fatura: enYakin, fark: Math.round((dVal - enYakin) * 100) / 100 });
    }
    if (e.toplam !== null) {
      var ad = [["KDV dahil toplam", f.dahil], ["ödenecek tutar", f.odenecek], ["KDV hariç tutar", f.haric]];
      if (f.tevkifat && f.dahil !== null) ad.splice(1, 0, ["tevkifat düşülmüş tutar", Math.round((f.dahil - f.tevkifat) * 100) / 100]);
      // ilk aday asıl kabul edilir: farkı ona göre göster
      var once = farklar.length; dene("Toplam", e.toplam, ad);
      if (farklar.length > once && f.dahil !== null) { farklar[farklar.length - 1].fatura = Math.abs(f.dahil); farklar[farklar.length - 1].fark = Math.round((e.toplam - Math.abs(f.dahil)) * 100) / 100; }
    }
    if (e.matrah !== null) dene("Matrah", e.matrah, [["KDV hariç tutar", f.haric]]);
    if (e.kdv !== null) { var kd = [["KDV toplamı", f.kdvT]]; if (f.tevkifat && f.kdvT !== null) kd.push(["tevkifat düşülmüş KDV", Math.round((f.kdvT - f.tevkifat) * 100) / 100]); dene("KDV", e.kdv, kd); }
    return { farklar: farklar, taban: taban, kontrolEdilemedi: kontrolEdilemedi };
  }

  function girdiGrupla(kayit, ayar) { // satır -> girdi (aynı fatura için bölünmüş satırlar birleşir)
    var gr = {}, sira = [];
    kayit.forEach(function (k) {
      var an = k.ettn ? "e:" + k.ettn : "b:" + k.bn + "|" + k.vkn;
      if (!gr[an]) { gr[an] = []; sira.push(an); }
      gr[an].push(k);
    });
    return sira.map(function (an) {
      var rows = gr[an], ilk = rows[0];
      function topla(alan) { var any = false, t = 0; rows.forEach(function (x) { if (x[alan] !== null) { any = true; t += cc(x[alan]); } }); return any ? t / 100 : null; }
      var e = { satirlar: rows, id: ilk.id, satir: ilk.satir, tarih: ilk.tarih, gun: ilk.gun, belge: ilk.belge, bn: ilk.bn, ettn: ilk.ettn, vkn: ilk.vkn, unvan: ilk.unvan, aciklama: ilk.aciklama,
        matrah: topla("matrah"), kdv: topla("kdv"), toplam: topla("toplam"), mukerrerAdet: 0 };
      return e;
    });
  }

  function karsilastir(faturalar, kayit, ayar) {
    ayar = Object.assign({ tol: 0.05, pencere: 7, kapsam: "otomatik", donem: "", kendiVkn: "" }, ayar || {});
    var tol = ayar.tol, sonuc = { ayar: ayar, uyari: [] };
    var ownBilinen = faturalar.some(function (f) { return f.yon === "gelen" || f.yon === "giden"; });

    // 1) kapsam (defter alış mı satış mı)
    var bnSet = {}; kayit.forEach(function (k) { if (k.bn) bnSet[k.bn] = 1; });
    var kapsam = ayar.kapsam, kapsamNedeni = "";
    if (kapsam === "otomatik") {
      var g = faturalar.filter(function (f) { return f.yon === "gelen" && bnSet[f.bn]; }).length, s = faturalar.filter(function (f) { return f.yon === "giden" && bnSet[f.bn]; }).length;
      if (!ownBilinen || g + s === 0) { kapsam = "hepsi"; kapsamNedeni = ownBilinen ? "Defterdeki hiçbir fatura no XML'lerle eşleşmedi; tüm faturalar dikkate alındı." : "Kendi VKN'niz belirlenemedi; tüm faturalar dikkate alındı."; }
      else if (g >= 0.9 * (g + s)) { kapsam = "gelen"; kapsamNedeni = "Defter ağırlıkla ALIŞ (gelen) faturalarını içeriyor (eşleşen: gelen " + g + ", giden " + s + ")."; }
      else if (s >= 0.9 * (g + s)) { kapsam = "giden"; kapsamNedeni = "Defter ağırlıkla SATIŞ (giden) faturalarını içeriyor (eşleşen: gelen " + g + ", giden " + s + ")."; }
      else { kapsam = "hepsi"; kapsamNedeni = "Defter hem alış hem satış içeriyor (eşleşen: gelen " + g + ", giden " + s + ")."; }
    }
    sonuc.kapsam = kapsam; sonuc.kapsamNedeni = kapsamNedeni;
    var disi = [], F = [];
    faturalar.forEach(function (f) { if (kapsam === "hepsi" || f.yon === kapsam) F.push(f); else disi.push(f); });
    sonuc.kapsamDisi = disi;
    if (!ownBilinen && kapsam !== "hepsi") sonuc.uyari.push("Kendi VKN'niz belirlenemediği için alış/satış ayrımı yapılamadı.");

    // 2) defter girdileri
    var E = girdiGrupla(kayit, ayar);
    var fByEttn = {}, fByBn = {};
    F.forEach(function (f) { if (f.ettn) fByEttn[f.ettn] = f; (fByBn[f.bn] = fByBn[f.bn] || []).push(f); });
    var fEs = new Map(), eEs = new Map(), eslesen = [], mukerrer = sonuc.mukerrer = [];
    function bagla(e, f, temel, ekFark) {
      if (fEs.has(f)) { e.mukerrerGrup = true; e.ilkGirdi = fEs.get(f); mukerrer.push({ tur: "defter", f: f, e: e, ilk: fEs.get(f), aciklama: "Aynı fatura defterde iki ayrı kayıtla (satır " + fEs.get(f).satir + " ve " + e.satir + ") geçiyor." }); eEs.set(e, { f: f, temel: temel, mukerrer: true }); return; }
      fEs.set(f, e); eEs.set(e, { f: f, temel: temel, ek: ekFark || "" });
    }
    // geçiş 1: ETTN
    E.forEach(function (e) { if (e.ettn && fByEttn[e.ettn]) bagla(e, fByEttn[e.ettn], "ETTN"); });
    // geçiş 2: belge no (+VKN)
    E.forEach(function (e) {
      if (eEs.has(e) || !e.bn || !fByBn[e.bn]) return;
      var adaylar = fByBn[e.bn].filter(function (f) { return !fEs.has(f) || true; });
      var vk = adaylar.filter(function (f) { return vknUyar(e, f, ownBilinen) === true; });
      var sec = null, temel = "";
      if (vk.length) { sec = vk.find(function (f) { return !fEs.has(f); }) || vk[0]; temel = e.vkn ? "VKN + fatura no" : "fatura no"; }
      else if (!e.vkn) { sec = adaylar.find(function (f) { return !fEs.has(f); }) || adaylar[0]; temel = "fatura no"; }
      else if (adaylar.length === 1) { sec = adaylar[0]; temel = "fatura no (VKN farklı)"; }
      if (sec) bagla(e, sec, temel);
    });
    // 2b) aynı faturaya ait birden çok satır: bölünmüş (KDV oranına göre) satırlar mı, mükerrer kopya mı?
    function ebob(a, b) { return b ? ebob(b, a % b) : a; }
    E.forEach(function (e) {
      var m = eEs.get(e); if (!m || m.mukerrer || e.satirlar.length < 2) return;
      var f = m.f;
      if (!tutarKarsi(e, f, tol).farklar.length) return; // birleşik toplam uyuyor: bölünmüş satırlar, mükerrer değil
      var sig = {}; e.satirlar.forEach(function (x) { var s = [x.tarih, x.matrah, x.kdv, x.toplam].join("|"); (sig[s] = sig[s] || []).push(x); });
      var anahtarlar = Object.keys(sig), g = anahtarlar.map(function (k) { return sig[k].length; }).reduce(ebob);
      if (g < 2) return;
      var tekil = []; anahtarlar.forEach(function (k) { tekil = tekil.concat(sig[k].slice(0, sig[k].length / g)); });
      function tp(alan) { var any = false, t = 0; tekil.forEach(function (x) { if (x[alan] !== null) { any = true; t += cc(x[alan]); } }); return any ? t / 100 : null; }
      var tek = { matrah: tp("matrah"), kdv: tp("kdv"), toplam: tp("toplam") };
      if (tutarKarsi(tek, f, tol).farklar.length) return;
      e.mukerrerAdet = g - 1; e.tek = tek;
      mukerrer.push({ tur: "defter", f: f, e: e, ilk: e, aciklama: "Aynı fatura defterde " + g + " kez, birebir aynı tutarlarla kayıtlı (satırlar " + e.satirlar.map(function (x) { return x.satir; }).join(", ") + "). Tek kopya faturayla uyuşuyor; fazlası mükerrer." });
    });

    // 3) eşleşen / farklar
    var donemF = function (f) { return !ayar.donem || (f.tarih && ay(f.tarih) === ayar.donem); };
    F.forEach(function (f) {
      var e = fEs.get(f); if (!e) return;
      var m = eEs.get(e), flags = [];
      var ek = e.tek || e;
      var t = tutarKarsi(ek, f, tol);
      if (t.farklar.length) flags.push("Tutar farkı");
      var vu = vknUyar(e, f, ownBilinen); if (vu === false) flags.push("VKN farklı");
      if (e.tarih && f.tarih && ay(e.tarih) !== ay(f.tarih)) flags.push("Dönem kayması");
      eslesen.push({ f: f, e: e, temel: m.temel, tutar: t, flags: flags, mukerrerFazla: e.mukerrerAdet || 0, vknFarkli: vu === false, ayFarki: e.tarih && f.tarih && ay(e.tarih) !== ay(f.tarih) });
    });

    // 4) olası eşleşme: kalan fatura ↔ kalan girdi (tutar + tarih)
    var kalanF = F.filter(function (f) { return !fEs.has(f); }), kalanE = E.filter(function (e) { return !eEs.has(e); });
    var olasi = [], fKul = new Set(), eKul = new Set();
    var adayCift = [];
    kalanF.forEach(function (f) {
      kalanE.forEach(function (e) {
        if (e.toplam === null && e.matrah === null) return;
        var t = tutarKarsi({ toplam: e.toplam, matrah: e.toplam === null ? e.matrah : null, kdv: null }, f, tol);
        if (t.farklar.length || (!t.taban.length)) return;
        var gf = e.gun !== null && f.gun !== null ? Math.abs(e.gun - f.gun) : null;
        var vu = vknUyar(e, f, ownBilinen), un = e.unvan && unvanBenzer(e.unvan, f.cp.ad || f.satici.ad);
        if (gf === null) { if (vu !== true) return; }
        else if (gf > ayar.pencere) return;
        if (vu === false) return;
        if (vu === null && !un && gf !== null && gf > 2) return; // VKN yok: unvan benzerliği ya da çok yakın tarih
        var dist = mesafe(e.bn, f.bn);
        adayCift.push({ f: f, e: e, gf: gf === null ? 99 : gf, dist: dist, taban: t.taban.join(", ") });
      });
    });
    adayCift.sort(function (a, b) { return a.dist - b.dist || a.gf - b.gf; });
    adayCift.forEach(function (a) { if (fKul.has(a.f) || eKul.has(a.e)) return; fKul.add(a.f); eKul.add(a.e); olasi.push(a); });

    // 5) eksikler
    var defterdeYok = [], faturadaYok = [], donemDisiF = 0, donemDisiE = 0;
    F.forEach(function (f) {
      if (fEs.has(f) || fKul.has(f)) return;
      if (!donemF(f)) { donemDisiF++; return; }
      var ip = [];
      if (f.tip === "IADE") ip.push("İade faturası: defterde eksi/ters kayıt aranır.");
      if (f.senaryo === "EARSIVFATURA") ip.push("e-Arşiv faturası.");
      if (f.para !== "TRY") ip.push("Dövizli fatura (" + f.para + ").");
      var yakinE = kalanE.filter(function (e) { return e.bn && f.bn && mesafe(e.bn, f.bn) <= 1 && !eKul.has(e); });
      if (yakinE.length) ip.push("Defterde benzer numara var: " + yakinE[0].belge + " (satır " + yakinE[0].satir + ") — tutar/tarih uyuşmadığı için eşleştirilmedi.");
      defterdeYok.push({ f: f, ipucu: ip.join(" ") });
    });
    E.forEach(function (e) {
      if (eEs.has(e) || eKul.has(e)) return;
      if (ayar.donem && e.tarih && ay(e.tarih) !== ayar.donem) { donemDisiE++; return; }
      var biçim = EFATURA_NO.test(e.bn) || !!e.ettn;
      var ip = biçim ? "Numara e-Fatura biçiminde ama yüklediğiniz XML'lerde yok: eksik XML ya da yanlış numara olabilir." : "Numara e-Fatura biçiminde değil: kâğıt/e-Arşiv ya da başka seri olabilir.";
      var xmlDisi = disi.filter(function (f) { return f.bn === e.bn; })[0];
      if (xmlDisi) ip = "Bu fatura XML'lerde " + (xmlDisi.yon === "gelen" ? "ALIŞ" : "SATIŞ") + " faturası olarak var; defter kapsamı farklı seçilmiş olabilir.";
      faturadaYok.push({ e: e, biçim: biçim, ipucu: ip });
    });

    // 6) toplamlar ve kontrol
    var risk = { gelen: { adet: 0, matrah: 0, kdv: 0, toplam: 0 }, giden: { adet: 0, matrah: 0, kdv: 0, toplam: 0 }, belirsiz: { adet: 0, matrah: 0, kdv: 0, toplam: 0 } };
    defterdeYok.forEach(function (x) { var f = x.f, r = risk[f.yon === "gelen" || f.yon === "giden" ? f.yon : "belirsiz"], sg = f.sg; r.adet++; r.matrah += sg * cc(f.haric || 0); r.kdv += sg * cc(f.kdvT || 0); r.toplam += sg * cc(f.dahil || 0); });
    Object.keys(risk).forEach(function (k) { ["matrah", "kdv", "toplam"].forEach(function (a) { risk[k][a] = risk[k][a] / 100; }); });
    var say = { fatura: F.length, kapsamDisi: disi.length, girdi: E.length, satir: kayit.length,
      eslesen: eslesen.length, temiz: eslesen.filter(function (x) { return !x.flags.length; }).length, tutarFarki: eslesen.filter(function (x) { return x.tutar.farklar.length; }).length,
      vknFarki: eslesen.filter(function (x) { return x.vknFarkli; }).length, donemKaymasi: eslesen.filter(function (x) { return x.ayFarki; }).length,
      olasi: olasi.length, defterdeYok: defterdeYok.length, faturadaYok: faturadaYok.length, mukerrerDefter: mukerrer.filter(function (x) { return x.tur === "defter"; }).length, donemDisiFatura: donemDisiF, donemDisiGirdi: donemDisiE };
    // sayım dengesi: kapsamdaki fatura = eşleşen + olası + defterde yok + dönem dışı (eşleşmeyen)
    var denge1 = say.fatura === say.eslesen + say.olasi + say.defterdeYok + donemDisiF;
    // girdi dengesi: girdi = eşleşen girdiler + mükerrer girdiler + olası + faturada yok + dönem dışı
    var ekGirdi = E.filter(function (e) { var m = eEs.get(e); return m && m.mukerrer; }).length;
    var denge2 = say.girdi === say.eslesen + ekGirdi + say.olasi + say.faturadaYok + donemDisiE;
    // tutar dengesi (kuruş): kapsamdaki faturaların KDV dahil toplamı = eşleşen + olası + defterde yok + dönem dışı
    function dahilCc(f) { return f.sg * cc(f.dahil || 0); }
    var tF = F.reduce(function (t, f) { return t + dahilCc(f); }, 0);
    var tA = eslesen.reduce(function (t, x) { return t + dahilCc(x.f); }, 0) + olasi.reduce(function (t, x) { return t + dahilCc(x.f); }, 0) + defterdeYok.reduce(function (t, x) { return t + dahilCc(x.f); }, 0)
      + F.filter(function (f) { return !fEs.has(f) && !fKul.has(f) && !donemF(f); }).reduce(function (t, f) { return t + dahilCc(f); }, 0);
    sonuc.kontrol = { sayiDengesi: denge1 && denge2, tutarDengesi: tF === tA, faturaToplami: tF / 100, aciklanan: tA / 100 };
    Object.assign(sonuc, { say: say, eslesen: eslesen, defterdeYok: defterdeYok, faturadaYok: faturadaYok, olasi: olasi, risk: risk, girdiler: E });
    return sonuc;
  }

  var api = { sayiCoz: sayiCoz, tarihCoz: tarihCoz, belgeNorm: belgeNorm, norm: norm, baslikTani: baslikTani, kayitlar: kayitlar, faturaNormal: faturaNormal, faturalariHazirla: faturalariHazirla, karsilastir: karsilastir, KOLON_ADI: KOLON_ADI, SIRA: SIRA, mesafe: mesafe };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.FDK = api;
})(typeof self !== "undefined" ? self : this);
