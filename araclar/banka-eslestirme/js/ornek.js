/* Banka eşleştirme — KURGUSAL (ÖRNEK) veri üreticisi (satış faturaları + banka ekstresi): gerçek kişi/kurum/fatura yoktur. VKN'ler sağlama algoritmasına uyan uydurma numaralardır. */
(function (root) {
  "use strict";
  var D = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/ubl-fatura.js") : root.EFD;
  var Z = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/zip.js") : root.EFZ;
  var XL = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/xlsx.js") : root.EFXL;
  function vknUret(d9) { for (var c = 0; c < 10; c++) if (D.vknGecerli(d9 + c)) return d9 + c; }
  var BEN = vknUret("987654320"), T = [vknUret("123456780"), vknUret("234567810"), vknUret("345678920"), vknUret("456789030")];
  var AD = ["ÖRNEK Çınar Kırtasiye Ltd. Şti.", "ÖRNEK Işık Ambalaj A.Ş.", "ÖRNEK Güneş Elektrik Ltd. Şti.", "ÖRNEK Şahin Nakliyat A.Ş."];
  var SERI = ["ORN", "ORN", "ORN", "ORN"];
  function f2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function r2(x) { return Math.round(x * 100) / 100; }
  function uuid(n) { var h = ("00000000" + (n * 2654435761 >>> 0).toString(16)).slice(-8); return h + "-1a2b-4c3d-8e4f-" + ("000000000000" + n.toString(16)).slice(-12); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function xml(f) {
    var p = "TRY", lines = "", g = {};
    f.satir.forEach(function (s, i) {
      var t = r2(s[1] * s[2]), k = r2(t * s[3] / 100); g[s[3]] = g[s[3]] || [0, 0]; g[s[3]][0] += t; g[s[3]][1] += k;
      lines += "<cac:InvoiceLine><cbc:ID>" + (i + 1) + "</cbc:ID><cbc:InvoicedQuantity unitCode=\"C62\">" + s[1] + "</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID=\"TRY\">" + f2(t) + "</cbc:LineExtensionAmount><cac:TaxTotal><cbc:TaxAmount currencyID=\"TRY\">" + f2(k) + "</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID=\"TRY\">" + f2(t) + "</cbc:TaxableAmount><cbc:TaxAmount currencyID=\"TRY\">" + f2(k) + "</cbc:TaxAmount><cbc:Percent>" + s[3] + "</cbc:Percent><cac:TaxCategory><cac:TaxScheme><cbc:Name>KDV</cbc:Name><cbc:TaxTypeCode>0015</cbc:TaxTypeCode></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:Item><cbc:Name>" + esc(s[0]) + "</cbc:Name></cac:Item><cac:Price><cbc:PriceAmount currencyID=\"TRY\">" + s[2] + "</cbc:PriceAmount></cac:Price></cac:InvoiceLine>";
    });
    var alt = "", topK = 0, haric = 0;
    Object.keys(g).forEach(function (o) { alt += "<cac:TaxSubtotal><cbc:TaxableAmount currencyID=\"TRY\">" + f2(g[o][0]) + "</cbc:TaxableAmount><cbc:TaxAmount currencyID=\"TRY\">" + f2(g[o][1]) + "</cbc:TaxAmount><cbc:Percent>" + o + "</cbc:Percent><cac:TaxCategory><cac:TaxScheme><cbc:Name>KDV</cbc:Name><cbc:TaxTypeCode>0015</cbc:TaxTypeCode></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal>"; topK += g[o][1]; haric += g[o][0]; });
    function taraf(id, ad, rol) { return "<cac:" + rol + "><cac:Party><cac:PartyIdentification><cbc:ID schemeID=\"VKN\">" + id + "</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>" + esc(ad) + "</cbc:Name></cac:PartyName></cac:Party></cac:" + rol + ">"; }
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\"><cbc:UBLVersionID>2.1</cbc:UBLVersionID><cbc:CustomizationID>TR1.2</cbc:CustomizationID><cbc:ProfileID>TICARIFATURA</cbc:ProfileID><cbc:ID>" + f.no + "</cbc:ID><cbc:CopyIndicator>false</cbc:CopyIndicator><cbc:UUID>" + f.ettn + "</cbc:UUID><cbc:IssueDate>" + f.tarih + "</cbc:IssueDate><cbc:IssueTime>10:00:00</cbc:IssueTime><cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode><cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode>" +
      taraf(BEN, "ÖRNEK Defter Sahibi Ltd. Şti.", "AccountingSupplierParty") + taraf(f.sat[0], f.sat[1], "AccountingCustomerParty") +
      "<cac:TaxTotal><cbc:TaxAmount currencyID=\"TRY\">" + f2(topK) + "</cbc:TaxAmount>" + alt + "</cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID=\"TRY\">" + f2(haric) + "</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID=\"TRY\">" + f2(haric) + "</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID=\"TRY\">" + f2(haric + topK) + "</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID=\"TRY\">" + f2(haric + topK) + "</cbc:PayableAmount></cac:LegalMonetaryTotal>" + lines + "</Invoice>";
  }  var KALEM = [["Reklam panosu bakımı", 1250], ["Tabela yaz-sök hizmeti", 1850], ["Led modül seti", 640.4], ["Montaj işçiliği", 915.75], ["Folyo uygulama", 389.9], ["Aydınlatma kutusu", 2196.3]];
  var BANKA_AD = ["CINAR KIRTASIYE", "ISIK AMBALAJ A.S.", "GUNES ELEKTRIK LTD", "SAHIN NAKLIYAT A.S."];
  function gunEkle(iso, n) { var p = iso.split("-"), t = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]) + n * 86400000); return t.getUTCFullYear() + "-" + ("0" + (t.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + t.getUTCDate()).slice(-2); }
  function gg(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function topl(f) { var h = 0, kd = 0; f.satir.forEach(function (s) { var t = r2(s[1] * s[2]), k = r2(t * s[3] / 100); h += t; kd += k; }); return { haric: r2(h), kdv: r2(kd), toplam: r2(h + kd) }; }
  // 22 ÖRNEK satış faturası (Ekim 2026): 0-19 normal, 20-21 aynı tutarlı iki fatura (farklı cari)
  function faturalar() {
    var out = [];
    for (var i = 0; i < 22; i++) {
      var k = i < 20 ? i % 4 : (i === 20 ? 0 : 1), a = KALEM[i % 6], b = KALEM[(i * 3 + 1) % 6];
      var satir = i >= 20 ? [["Danışmanlık paketi", 1, 7000, 20]] : [[a[0], 2 + (i % 5), a[1], 20]];
      if (i < 20 && i % 3 === 0) satir.push([b[0], 1 + (i % 4), b[1], 10]);
      out.push({ no: "ORN2026" + ("000000000" + (1001 + i)).slice(-9), ettn: uuid(i + 1), tarih: gunEkle("2026-10-01", (i * 3) % 24), sat: [T[k], AD[k]], satir: satir, k: k });
    }
    return out;
  }
  // Banka hareketleri: [gün farkı, açıklama, tutar, gerçek (doğrulama için kurgusal gerçek)]
  function hareketListesi(F) {
    var tp = F.map(function (f) { return topl(f).toplam; }), H = [];
    function ekle(f, gun, acik, tutar, gercek) { H.push({ tarih: gunEkle(f.tarih, gun), aciklama: acik, tutar: r2(tutar), gercek: gercek }); }
    ekle(F[0], 6, "HAVALE ORN2026000001001 NOLU FATURA ODEMESI CINAR KIRTASIYE", tp[0], "yuksek:1001");
    ekle(F[1], 9, "GELEN EFT " + BANKA_AD[1] + " FT 1002", tp[1], "orta:1002");
    ekle(F[2], 11, "GELEN HAVALE " + BANKA_AD[2] + " STI", tp[2], "orta:1003");
    ekle(F[11], 10, "GELEN EFT " + BANKA_AD[3] + " ODEME", tp[3] + tp[7] + tp[11], "toplu:1004+1008+1012");
    ekle(F[4], 8, "ORN2026000001005 KISMI ODEME", r2(tp[4] / 2), "kismi:1005");
    ekle(F[5], 12, "ORN2026000001006 FATURA BEDELI", r2(tp[5] - 12.5), "farkli:1006");
    ekle(F[6], 13, "GELEN HAVALE", tp[6], "yalniz-tutar:1007");
    ekle(F[10], 14, "ORN2026000001011 ODEME " + BANKA_AD[2], r2(tp[10] + 500), "fazla:1011");
    ekle(F[13], 7, "GELEN HAVALE", r2(7000 * 1.2), "aday");
    ekle(F[12], 15, "POS TAHSILATI 31.10.2026", 4320.6, "kategori:pos");
    ekle(F[8], 20, "KREDI TAKSIT ODEMESI", -8750.25, "kategori:kredi");
    ekle(F[8], 21, "KDV ODEMESI VERGI DAIRESI", -12430, "kategori:vergi");
    ekle(F[8], 22, "EFT KOMISYONU", -15, "kategori:masraf");
    ekle(F[8], 23, "MAAS ODEMESI EKIM", -21500, "kategori:maas");
    ekle(F[8], 24, "AYLIK TABELA MALZEME ALIMI", -3180.4, "siniflandirilamadi");
    H.sort(function (a, b) { return a.tarih < b.tarih ? -1 : a.tarih > b.tarih ? 1 : 0; });
    return H;
  }
  function demo() {
    var F = faturalar(), dosyalar = [];
    F.forEach(function (f) { dosyalar.push({ ad: f.no + ".xml", metin: xml(f) }); });
    var H = hareketListesi(F), bak = 80000, satir = [["ÖRNEK Banka A.Ş. · Hesap Hareketleri · ÖRNEK"], ["Hesap: ÖRNEK ŞUBE · TR00 0000 0000 0000 0000 0000 00 (kurgusal)"], [], ["Tarih", "Saat", "Açıklama", "Tutar", "Bakiye", "Dekont No"]];
    var dek = 880000;
    H.forEach(function (h, i) {
      bak = r2(bak + h.tutar);
      if (h.gercek === "kategori:masraf") { return; }   // kayıp satır (bakiye zinciri kırılır) — dekont dosyada yok
      satir.push([gg(h.tarih), "09:" + ("0" + (10 + i)).slice(-2), h.aciklama, h.tutar, bak, "D" + (++dek)]);
      if (i === 1) satir.push([gg(h.tarih), "09:" + ("0" + (10 + i)).slice(-2), h.aciklama, h.tutar, bak, "D" + dek]);  // aynı satır iki kez (mükerrer)
    });
    return { faturalar: dosyalar, ekstreSatirlari: satir, ekstreAdi: "ORNEK-banka-ekstresi.xlsx", H: H, F: F };
  }
  function xlsxBayt() { var d = demo(); return XL.yaz([{ ad: "Hesap Hareketleri", satirlar: d.ekstreSatirlari }]); }
  function zipBayt() { var enc = new TextEncoder(); return Z.yaz(demo().faturalar.map(function (f) { return { ad: f.ad, veri: enc.encode(f.metin) }; })); }
  var api = { demo: demo, xlsxBayt: xlsxBayt, zipBayt: zipBayt, BEN: BEN, xml: xml, topl: topl, vknUret: vknUret, T: T, AD: AD, KALEM: KALEM, BANKA_AD: BANKA_AD, uuid: uuid, r2: r2, gunEkle: gunEkle };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BETOR = api;
})(typeof self !== "undefined" ? self : this);
