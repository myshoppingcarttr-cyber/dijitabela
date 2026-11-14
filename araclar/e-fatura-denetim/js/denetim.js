/* e-Fatura / e-Arşiv (UBL-TR) toplu denetim motoru. Tarayıcıda ve Node'da çalışır. */
(function (root) {
  "use strict";
  var X = typeof module !== "undefined" && module.exports ? require("./xml.js") : root.EFX;
  var ch = X.ch, chs = X.chs, path = X.path, txt = X.txt;

  // ---- vergi no doğrulama (VKN: GİB algoritması, TCKN: NVİ algoritması) ----
  function vknGecerli(v) {
    if (!/^\d{10}$/.test(v)) return false;
    var s = 0;
    for (var i = 0; i < 9; i++) { var t = (+v[i] + 9 - i) % 10, p = (t * Math.pow(2, 9 - i)) % 9; if (t !== 0 && p === 0) p = 9; s += p; }
    return (10 - (s % 10)) % 10 === +v[9];
  }
  function tcknGecerli(v) {
    if (!/^\d{11}$/.test(v) || v[0] === "0") return false;
    var d = v.split("").map(Number);
    var o = d[0] + d[2] + d[4] + d[6] + d[8], e = d[1] + d[3] + d[5] + d[7];
    if ((((o * 7 - e) % 10) + 10) % 10 !== d[9]) return false;
    var t = 0; for (var i = 0; i < 10; i++) t += d[i];
    return t % 10 === d[10];
  }

  // ---- KDV oranları (dönemsel). Kaynak: 2007/13033 sayılı Karar; 7346 sayılı Cumhurbaşkanı Kararı (RG 7.7.2023/32241, yürürlük 10.7.2023) ----
  var ORAN_DEGISIM = "2023-07-10";
  function gecerliOranlar(tarih) { return tarih >= ORAN_DEGISIM ? [0, 1, 10, 20] : [0, 1, 8, 18]; }

  function sayi(n) { if (!n) return null; var s = n.t.trim(); if (s === "" || !/^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(s)) return NaN; return parseFloat(s); }
  function r2(x) { return Math.round(x * 100) / 100; }
  function yakin(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 0.02 : tol) + 1e-9; }

  function taraf(p) {
    var party = ch(p, "Party"), id = "", sch = "", ad = "";
    if (party) {
      var ids = chs(party, "PartyIdentification");
      for (var i = 0; i < ids.length; i++) {
        var idn = ch(ids[i], "ID"), s = idn ? (idn.a.schemeID || "").toUpperCase() : "";
        if ((s === "VKN" || s === "TCKN") && !id) { id = txt(idn); sch = s; }
      }
      if (!id && ids.length) { var i0 = ch(ids[0], "ID"); id = txt(i0); sch = i0 ? (i0.a.schemeID || "").toUpperCase() : ""; }
      ad = txt(path(party, "PartyName/Name"));
      if (!ad) { var pe = ch(party, "Person"); if (pe) ad = (txt(ch(pe, "FirstName")) + " " + txt(ch(pe, "FamilyName"))).trim(); }
    }
    return { id: id, sema: sch, ad: ad };
  }

  function kdvAlt(taxTotal) { // TaxTotal içindeki alt toplamlar
    var r = [], subs = chs(taxTotal, "TaxSubtotal");
    for (var i = 0; i < subs.length; i++) {
      var s = subs[i], cat = ch(s, "TaxCategory"), sch = cat ? ch(cat, "TaxScheme") : null;
      r.push({
        matrah: sayi(ch(s, "TaxableAmount")), vergi: sayi(ch(s, "TaxAmount")), oran: sayi(ch(s, "Percent")),
        kod: txt(sch && ch(sch, "TaxTypeCode")), ad: txt(sch && ch(sch, "Name")),
        istisna: txt(cat && ch(cat, "TaxExemptionReasonCode")) || txt(cat && ch(cat, "TaxExemptionReason"))
      });
    }
    return r;
  }
  function kdvMi(a) { return a.kod === "0015" || (!a.kod && /kdv/i.test(a.ad)); }

  // ---- tek fatura çıkarımı ----
  function cikar(xmlMetin) {
    var kok = X.parse(xmlMetin), inv = X.find(kok, "Invoice");
    if (!inv) {
      var ad = kok.n; var e = new Error(ad === "ApplicationResponse" ? "Bu dosya fatura değil, uygulama yanıtı (ApplicationResponse)" : "Fatura (Invoice) öğesi bulunamadı; kök: " + ad);
      e.fatura = false; throw e;
    }
    var f = {
      no: txt(ch(inv, "ID")), ettn: txt(ch(inv, "UUID")), tarih: txt(ch(inv, "IssueDate")), saat: txt(ch(inv, "IssueTime")),
      tip: txt(ch(inv, "InvoiceTypeCode")).toUpperCase(), senaryo: txt(ch(inv, "ProfileID")), para: txt(ch(inv, "DocumentCurrencyCode")).toUpperCase(),
      kur: sayi(path(inv, "PricingExchangeRate/CalculationRate")),
      satici: taraf(ch(inv, "AccountingSupplierParty")), alici: taraf(ch(inv, "AccountingCustomerParty")),
      iadeRef: !!path(inv, "BillingReference/InvoiceDocumentReference/ID") && !!txt(path(inv, "BillingReference/InvoiceDocumentReference/ID")),
      satirlar: [], kdv: [], digerVergi: [], tevkifat: 0, tevkifatVar: false
    };
    var lines = chs(inv, "InvoiceLine");
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i], tt = ch(L, "TaxTotal"), alt = tt ? kdvAlt(tt) : [], ind = 0, ar = chs(L, "AllowanceCharge");
      for (var k = 0; k < ar.length; k++) { var am = sayi(ch(ar[k], "Amount")) || 0; ind += txt(ch(ar[k], "ChargeIndicator")) === "true" ? -am : am; }
      f.satirlar.push({ sira: txt(ch(L, "ID")) || String(i + 1), miktar: sayi(ch(L, "InvoicedQuantity")), tutar: sayi(ch(L, "LineExtensionAmount")),
        fiyat: sayi(path(L, "Price/PriceAmount")), indirim: ind, vergi: alt, vergiToplam: tt ? sayi(ch(tt, "TaxAmount")) : null });
    }
    var tts = chs(inv, "TaxTotal"); f.kdvToplamHdr = 0; f.vergiToplamHdr = null;
    for (var j = 0; j < tts.length; j++) {
      var a = kdvAlt(tts[j]), ta = sayi(ch(tts[j], "TaxAmount"));
      f.vergiToplamHdr = (f.vergiToplamHdr || 0) + (isNaN(ta) ? NaN : ta || 0);
      for (var q = 0; q < a.length; q++) (kdvMi(a[q]) ? f.kdv : f.digerVergi).push(a[q]);
    }
    var wt = chs(inv, "WithholdingTaxTotal");
    for (var w = 0; w < wt.length; w++) { f.tevkifatVar = true; var wa = sayi(ch(wt[w], "TaxAmount")); f.tevkifat += isNaN(wa) ? 0 : wa || 0; }
    var M = ch(inv, "LegalMonetaryTotal");
    f.toplam = M ? { satir: sayi(ch(M, "LineExtensionAmount")), haric: sayi(ch(M, "TaxExclusiveAmount")), dahil: sayi(ch(M, "TaxInclusiveAmount")),
      indirim: sayi(ch(M, "AllowanceTotalAmount")), artirim: sayi(ch(M, "ChargeTotalAmount")), odenecek: sayi(ch(M, "PayableAmount")), yuvarlama: sayi(ch(M, "PayableRoundingAmount")) } : null;
    return f;
  }

  // ---- tek fatura kuralları ----
  function kontrolEt(f, ayar, bul) {
    var E = "HATA", U = "UYARI", B = "BİLGİ";
    function ekle(c, kod, bas, ayr) { bul.push({ ciddiyet: c, kod: kod, baslik: bas, ayrinti: ayr || "" }); }
    var eksik = [];
    if (!f.no) eksik.push("Fatura no (ID)"); if (!f.ettn) eksik.push("ETTN (UUID)"); if (!f.tarih) eksik.push("Düzenleme tarihi");
    if (!f.senaryo) eksik.push("Senaryo (ProfileID)"); if (!f.tip) eksik.push("Fatura tipi (InvoiceTypeCode)"); if (!f.para) eksik.push("Para birimi");
    if (!f.satici.id) eksik.push("Satıcı VKN/TCKN"); if (!f.alici.id) eksik.push("Alıcı VKN/TCKN"); if (!f.satici.ad) eksik.push("Satıcı unvanı");
    if (!f.alici.ad) eksik.push("Alıcı unvanı"); if (!f.satirlar.length) eksik.push("Fatura satırı"); if (!f.toplam) eksik.push("Parasal toplamlar (LegalMonetaryTotal)");
    if (eksik.length) ekle(E, "K02", "Zorunlu alan eksik", eksik.join(", "));

    if (f.no) {
      if (!/^[A-Za-z0-9]{3}\d{13}$/.test(f.no)) ekle(E, "K03", "Fatura numarası biçimi hatalı", "Beklenen: 3 harf/rakam + 4 hane yıl + 9 hane sıra (16 karakter, örn. ABC2026000000001). Bulunan: " + f.no + " (" + f.no.length + " karakter)");
      else if (f.tarih && f.no.substr(3, 4) !== f.tarih.slice(0, 4)) ekle(U, "K03Y", "Numaradaki yıl ile fatura yılı farklı", "No: " + f.no + " · tarih: " + f.tarih);
    }
    if (f.ettn && !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(f.ettn)) ekle(E, "K04", "ETTN (UUID) biçimi hatalı", f.ettn);
    [["Satıcı", f.satici], ["Alıcı", f.alici]].forEach(function (p) {
      var t = p[1]; if (!t.id) return;
      if (t.id === "11111111111") { ekle(B, "K05B", p[0] + " TCKN: 11111111111 (kimliği belirsiz alıcı)", "e-Arşiv'de nihai tüketici için kullanılır; sağlama kontrolü atlandı."); return; }
      if (t.sema === "VKN" ? !vknGecerli(t.id) : t.sema === "TCKN" ? !tcknGecerli(t.id) : !(vknGecerli(t.id) || tcknGecerli(t.id)))
        ekle(t.sema === "TCKN" ? E : U, "K05", p[0] + " vergi no sağlama (kontrol hanesi) tutmuyor", t.id + " (" + (t.sema || "şema yok") + ") — " + (t.ad || "unvan yok") + " · yazım hatası olabilir");
    });
    if (f.satici.id && f.satici.id === f.alici.id && f.satici.id !== "11111111111") ekle(U, "K18", "Satıcı ve alıcı aynı vergi numarası", f.satici.id);
    if (f.tarih) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(f.tarih) || isNaN(Date.parse(f.tarih))) ekle(E, "K06", "Tarih biçimi hatalı", f.tarih);
      else {
        if (f.tarih > ayar.bugun) ekle(E, "K06", "Fatura tarihi gelecekte", f.tarih + " > " + ayar.bugun);
        if (ayar.donem && f.tarih.slice(0, 7) !== ayar.donem) ekle(U, "K06D", "Fatura seçilen dönemin dışında", f.tarih + " (seçilen dönem " + ayar.donem + ")");
      }
    }
    if (f.para && f.para !== "TRY" && !(f.kur > 0)) ekle(U, "K15", "Döviz faturasında kur bilgisi yok", f.para + " — PricingExchangeRate bulunamadı");
    if (f.tip === "IADE" && !f.iadeRef) ekle(U, "K16", "İade faturasında iade edilen fatura referansı yok", "BillingReference/InvoiceDocumentReference/ID boş");

    // satırlar
    var tol = 0.02, topSatir = 0, nanVar = false;
    f.satirlar.forEach(function (L) {
      if (L.tutar === null || isNaN(L.tutar)) { ekle(E, "K02", "Satır tutarı okunamadı", "Satır " + L.sira); nanVar = true; return; }
      topSatir += L.tutar;
      if (L.tutar < 0) ekle(U, "K17", "Negatif satır tutarı", "Satır " + L.sira + ": " + L.tutar);
      if (L.miktar > 0 && L.fiyat >= 0 && !isNaN(L.fiyat)) {
        var bek = r2(L.miktar * L.fiyat - (L.indirim || 0));
        if (!yakin(bek, L.tutar, Math.max(0.02, Math.abs(L.tutar) * 0.0005))) ekle(U, "K09", "Satırda miktar × birim fiyat tutmuyor", "Satır " + L.sira + ": " + L.miktar + " × " + L.fiyat + (L.indirim ? " − " + L.indirim : "") + " = " + bek.toFixed(2) + ", satır tutarı " + L.tutar.toFixed(2));
      }
      L.vergi.forEach(function (v) {
        if (!kdvMi(v)) return;
        if (!isNaN(v.matrah) && !isNaN(v.oran) && !isNaN(v.vergi) && !yakin(r2(v.matrah * v.oran / 100), v.vergi, tol))
          ekle(E, "K08", "Satırda KDV tutarı matrah × oran ile tutmuyor", "Satır " + L.sira + ": " + v.matrah.toFixed(2) + " × %" + v.oran + " = " + r2(v.matrah * v.oran / 100).toFixed(2) + ", yazılan " + v.vergi.toFixed(2));
        if (!isNaN(v.matrah) && !yakin(v.matrah, L.tutar, 0.02) && L.vergi.filter(kdvMi).length === 1 && f.digerVergi.length === 0 && !f.satirlar.some(function (z) { return z.vergi.some(function (y) { return !kdvMi(y); }); }))
          ekle(U, "K08M", "Satır KDV matrahı satır tutarından farklı", "Satır " + L.sira + ": matrah " + v.matrah.toFixed(2) + ", satır tutarı " + L.tutar.toFixed(2));
      });
    });
    if (!nanVar && f.toplam && f.toplam.satir !== null && !isNaN(f.toplam.satir) && !yakin(topSatir, f.toplam.satir, 0.05))
      ekle(E, "K07", "Satır toplamı ile belge toplamı tutmuyor", "Satırlar toplamı " + r2(topSatir).toFixed(2) + ", LineExtensionAmount " + f.toplam.satir.toFixed(2) + " (fark " + r2(f.toplam.satir - topSatir).toFixed(2) + ")");

    // KDV oranı geçerliliği ve istisna
    var oranlar = gecerliOranlar(f.tarih || "9999-12-31"), gor = {};
    f.kdv.concat(f.satirlar.reduce(function (a, L) { return a.concat(L.vergi.filter(kdvMi)); }, [])).forEach(function (v) {
      if (isNaN(v.oran) || gor[v.oran]) return; gor[v.oran] = 1;
      if (oranlar.indexOf(v.oran) < 0 && f.tarih >= "2008-01-01") ekle(U, "K13", "KDV oranı fatura tarihinde yürürlükteki oranlar dışında", "%" + v.oran + " — " + f.tarih + " tarihinde geçerli oranlar: " + oranlar.map(function (o) { return "%" + o; }).join(", ") + " (özel durum olabilir, kontrol edin)");
      if (v.oran === 0 && !v.istisna && ["ISTISNA", "IHRACKAYITLI"].indexOf(f.tip) < 0 && f.senaryo !== "IHRACAT") ekle(U, "K14", "KDV %0 ama istisna/muafiyet sebebi yok", "Tip: " + f.tip + ", senaryo: " + f.senaryo);
    });

    // başlık KDV
    var h = f.toplam;
    var topAlt = 0, altNaN = false;
    f.kdv.forEach(function (a) { if (isNaN(a.vergi)) altNaN = true; else topAlt += a.vergi; });
    f.digerVergi.forEach(function (a) { if (!isNaN(a.vergi)) topAlt += a.vergi; });
    f.kdv.forEach(function (a) {
      if (!isNaN(a.matrah) && !isNaN(a.oran) && !isNaN(a.vergi) && !yakin(r2(a.matrah * a.oran / 100), a.vergi, tol))
        ekle(E, "K10", "Belge KDV tutarı matrah × oran ile tutmuyor", "%" + a.oran + ": " + a.matrah.toFixed(2) + " × %" + a.oran + " = " + r2(a.matrah * a.oran / 100).toFixed(2) + ", yazılan " + a.vergi.toFixed(2));
    });
    if (!altNaN && f.vergiToplamHdr !== null && !isNaN(f.vergiToplamHdr) && !yakin(topAlt, f.vergiToplamHdr, 0.02))
      ekle(E, "K10T", "Vergi alt toplamları ile toplam vergi tutmuyor", "Alt toplamlar " + r2(topAlt).toFixed(2) + ", TaxTotal " + f.vergiToplamHdr.toFixed(2));
    // satır ↔ belge KDV matrah/tutar (oran bazında)
    var sat = {}, hdr = {};
    f.satirlar.forEach(function (L) { L.vergi.filter(kdvMi).forEach(function (v) { var k = String(v.oran); sat[k] = sat[k] || { m: 0, v: 0 }; sat[k].m += v.matrah || 0; sat[k].v += v.vergi || 0; }); });
    f.kdv.forEach(function (v) { var k = String(v.oran); hdr[k] = hdr[k] || { m: 0, v: 0 }; hdr[k].m += v.matrah || 0; hdr[k].v += v.vergi || 0; });
    if (f.satirlar.some(function (L) { return L.vergi.some(kdvMi); }) && f.kdv.length) {
      var keys = Object.keys(Object.assign({}, sat, hdr));
      keys.forEach(function (k) {
        var s = sat[k] || { m: 0, v: 0 }, hh = hdr[k] || { m: 0, v: 0 };
        if (!yakin(s.m, hh.m, 0.05) || !yakin(s.v, hh.v, 0.05))
          ekle(E, "K10S", "Satırlardaki KDV ile belge KDV özeti tutmuyor (%" + k + ")", "Satırlar: matrah " + r2(s.m).toFixed(2) + " / KDV " + r2(s.v).toFixed(2) + " · Belge: matrah " + r2(hh.m).toFixed(2) + " / KDV " + r2(hh.v).toFixed(2));
      });
    }
    if (h) {
      if (!isNaN(h.haric) && !isNaN(h.satir) && h.haric !== null && h.satir !== null) {
        var bekH = (h.satir || 0) - (h.indirim || 0) + (h.artirim || 0);
        if (!yakin(bekH, h.haric, 0.02)) ekle(E, "K11H", "Vergi hariç tutar satır toplamı − iskonto + artırım ile tutmuyor", "Beklenen " + r2(bekH).toFixed(2) + ", TaxExclusiveAmount " + h.haric.toFixed(2));
      }
      if (h.haric !== null && h.dahil !== null && !isNaN(h.haric) && !isNaN(h.dahil) && f.vergiToplamHdr !== null && !isNaN(f.vergiToplamHdr) && !yakin(h.haric + f.vergiToplamHdr, h.dahil, 0.02))
        ekle(E, "K11", "Vergi hariç + vergi toplamı = vergi dahil tutmuyor", r2(h.haric).toFixed(2) + " + " + r2(f.vergiToplamHdr).toFixed(2) + " = " + r2(h.haric + f.vergiToplamHdr).toFixed(2) + ", TaxInclusiveAmount " + h.dahil.toFixed(2));
      if (h.dahil !== null && h.odenecek !== null && !isNaN(h.dahil) && !isNaN(h.odenecek)) {
        if (f.tevkifatVar) ekle(B, "K12T", "Tevkifatlı fatura: ödenecek tutar kontrolü yapılmadı", "Tevkifat toplamı " + f.tevkifat.toFixed(2));
        else if (!yakin(h.dahil + (h.yuvarlama || 0), h.odenecek, 0.02)) ekle(E, "K12", "Ödenecek tutar vergi dahil tutardan farklı", "TaxInclusiveAmount " + h.dahil.toFixed(2) + ", PayableAmount " + h.odenecek.toFixed(2));
      }
    }
    if (f.digerVergi.length) ekle(B, "K19", "KDV dışı vergi var (ÖTV vb.)", "Kodlar: " + f.digerVergi.map(function (v) { return v.kod || v.ad; }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(", ") + " — bu vergilerin oranı doğrulanmadı.");
  }

  // ---- yön ----
  function yon(f, kendi) { if (!kendi) return "?"; if (f.satici.id === kendi) return "giden"; if (f.alici.id === kendi) return "gelen"; return "dışı"; }

  // ---- toplu denetim ----
  // girdi: [{ad, metin}] ; ayar: {kendiVkn, donem:'YYYY-MM', bugun:'YYYY-MM-DD'}
  function denetle(dosyalar, ayar) {
    ayar = Object.assign({ kendiVkn: "", donem: "", bugun: new Date().toISOString().slice(0, 10) }, ayar || {});
    var faturalar = [], bulgular = [], okunamayan = [];
    dosyalar.forEach(function (d) {
      var f;
      try { f = cikar(d.metin); }
      catch (e) { okunamayan.push({ dosya: d.ad, neden: e.message }); bulgular.push({ dosya: d.ad, no: "", ciddiyet: "HATA", kod: "K01", baslik: "Dosya okunamadı", ayrinti: e.message }); return; }
      f.dosya = d.ad; f.yon = yon(f, ayar.kendiVkn);
      var b = []; kontrolEt(f, ayar, b);
      if (ayar.kendiVkn && f.yon === "dışı") b.push({ ciddiyet: "UYARI", kod: "K20", baslik: "Faturada ne satıcı ne alıcı sizin vergi numaranız", ayrinti: "Satıcı " + f.satici.id + ", alıcı " + f.alici.id });
      b.forEach(function (x) { x.dosya = d.ad; x.no = f.no; bulgular.push(x); });
      faturalar.push(f);
    });
    capraz(faturalar, bulgular, ayar);
    var sira = { "HATA": 0, "UYARI": 1, "BİLGİ": 2 };
    bulgular.sort(function (a, b) { return sira[a.ciddiyet] - sira[b.ciddiyet] || (a.dosya > b.dosya ? 1 : a.dosya < b.dosya ? -1 : 0); });
    return { faturalar: faturalar, bulgular: bulgular, okunamayan: okunamayan, ayar: ayar, ozet: ozetle(faturalar, bulgular, okunamayan, ayar) };
  }

  function capraz(F, bul, ayar) {
    function ekle(f, c, kod, bas, ayr) { bul.push({ dosya: f.dosya, no: f.no, ciddiyet: c, kod: kod, baslik: bas, ayrinti: ayr }); }
    var ettn = {}, no = {}, ayni = {};
    F.forEach(function (f) {
      if (f.ettn) { var k = f.ettn.toLowerCase(); (ettn[k] = ettn[k] || []).push(f); }
      if (f.no && f.satici.id) { var k2 = f.satici.id + "|" + f.no.toUpperCase(); (no[k2] = no[k2] || []).push(f); }
      if (f.satici.id && f.alici.id && f.tarih && f.toplam && f.toplam.odenecek !== null && !isNaN(f.toplam.odenecek)) { var k3 = [f.satici.id, f.alici.id, f.tarih, f.toplam.odenecek.toFixed(2), f.para].join("|"); (ayni[k3] = ayni[k3] || []).push(f); }
    });
    Object.keys(ettn).forEach(function (k) { var g = ettn[k]; if (g.length > 1) g.forEach(function (f) { ekle(f, "HATA", "C01", "Aynı ETTN birden fazla dosyada (mükerrer)", "ETTN " + k + " — " + g.map(function (x) { return x.dosya; }).join(" · ")); }); });
    Object.keys(no).forEach(function (k) {
      var g = no[k], uu = {}; g.forEach(function (f) { uu[(f.ettn || "").toLowerCase()] = 1; });
      if (g.length > 1 && Object.keys(uu).length > 1) g.forEach(function (f) { ekle(f, "HATA", "C02", "Aynı satıcıda aynı fatura numarası, farklı ETTN", "No " + g[0].no + " — " + g.map(function (x) { return x.dosya; }).join(" · ")); });
    });
    Object.keys(ayni).forEach(function (k) {
      var g = ayni[k], nolar = {}; g.forEach(function (f) { nolar[f.no.toUpperCase() + (f.ettn || "").toLowerCase()] = 1; });
      if (g.length > 1 && Object.keys(nolar).length > 1) {
        var uniqNo = {}; g.forEach(function (f) { uniqNo[f.no.toUpperCase()] = 1; });
        if (Object.keys(uniqNo).length > 1) g.forEach(function (f) { ekle(f, "UYARI", "C03", "Aynı taraflar, tarih ve tutarla birden fazla fatura (olası çift kesim)", g.map(function (x) { return x.no; }).join(", ") + " — " + g[0].tarih + " · " + g[0].toplam.odenecek.toFixed(2) + " " + g[0].para); });
      }
    });
    // numara boşluğu ve sıra-tarih: yalnızca giden (ya da kendi VKN verilmediyse tüm) faturalarda, satıcı+önek+yıl bazında
    var gr = {};
    F.forEach(function (f) {
      if (ayar.kendiVkn && f.yon !== "giden") return;
      if (!/^[A-Za-z0-9]{3}\d{13}$/.test(f.no) || !f.satici.id) return;
      var k = f.satici.id + "|" + f.no.substr(0, 7).toUpperCase(); (gr[k] = gr[k] || []).push(f);
    });
    Object.keys(gr).forEach(function (k) {
      var g = gr[k].filter(function (x, i, a) { return a.findIndex(function (y) { return y.no.toUpperCase() === x.no.toUpperCase(); }) === i; });
      g.sort(function (a, b) { return a.no.toUpperCase() < b.no.toUpperCase() ? -1 : 1; });
      if (g.length < 2) return;
      var eksikler = [], toplam = 0;
      for (var i = 1; i < g.length; i++) {
        var a = parseInt(g[i - 1].no.slice(7), 10), b = parseInt(g[i].no.slice(7), 10);
        if (b - a > 1) { toplam += b - a - 1; if (eksikler.length < 6) eksikler.push(b - a === 2 ? String(a + 1) : (a + 1) + "–" + (b - 1)); }
        if (g[i].tarih && g[i - 1].tarih && g[i].tarih < g[i - 1].tarih) ekle(g[i], "UYARI", "C05", "Numara büyüdü, tarih geriye gitti", g[i - 1].no + " (" + g[i - 1].tarih + ") → " + g[i].no + " (" + g[i].tarih + ")");
      }
      if (toplam) ekle(g[0], "UYARI", "C04", "Numara serisinde atlanan " + toplam + " numara", "Seri " + g[0].no.substr(0, 7) + ", eksik sıra no: " + eksikler.join(", ") + (eksikler.length >= 6 ? " …" : "") + " (yüklediğiniz dosyalar arasında yok; iptal/ayrı dönem olabilir)");
    });
  }

  function ozetle(F, bul, ok, ayar) {
    var o = { dosya: F.length + ok.length, fatura: F.length, okunamayan: ok.length, hata: 0, uyari: 0, bilgi: 0, temiz: 0, kdv: {}, yonSayi: { gelen: 0, giden: 0, "dışı": 0, "?": 0 }, doviz: 0 };
    var kotu = {};
    bul.forEach(function (b) { if (b.ciddiyet === "HATA") o.hata++; else if (b.ciddiyet === "UYARI") o.uyari++; else o.bilgi++; if (b.ciddiyet !== "BİLGİ") kotu[b.dosya] = 1; });
    F.forEach(function (f) {
      if (!kotu[f.dosya]) o.temiz++;
      o.yonSayi[f.yon]++;
      if (f.para && f.para !== "TRY") { o.doviz++; return; }
      var y = f.yon === "?" ? "tümü" : f.yon; if (f.yon === "dışı") return;
      var sg = f.tip === "IADE" ? -1 : 1;
      f.kdv.forEach(function (v) { if (isNaN(v.oran) || isNaN(v.matrah) || isNaN(v.vergi)) return; var k = y + "|" + v.oran; o.kdv[k] = o.kdv[k] || { yon: y, oran: v.oran, matrah: 0, vergi: 0, adet: 0 }; o.kdv[k].matrah += sg * v.matrah; o.kdv[k].vergi += sg * v.vergi; o.kdv[k].adet++; });
    });
    o.kdvListe = Object.keys(o.kdv).map(function (k) { var x = o.kdv[k]; x.matrah = r2(x.matrah); x.vergi = r2(x.vergi); return x; }).sort(function (a, b) { return a.yon < b.yon ? -1 : a.yon > b.yon ? 1 : a.oran - b.oran; });
    return o;
  }

  var api = { denetle: denetle, cikar: cikar, vknGecerli: vknGecerli, tcknGecerli: tcknGecerli, gecerliOranlar: gecerliOranlar, ORAN_DEGISIM: ORAN_DEGISIM };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.EFD = api;
})(typeof self !== "undefined" ? self : this);
