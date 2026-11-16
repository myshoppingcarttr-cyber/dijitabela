/* KURGUSAL (ÖRNEK) veri üreticisi: gerçek kişi/kurum/fatura yoktur. VKN'ler sağlama algoritmasına uyan uydurma numaralardır. */
(function (root) {
  "use strict";
  var D = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/ubl-fatura.js") : root.EFD;
  var Z = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/zip.js") : root.EFZ;
  var XL = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/xlsx.js") : root.EFXL;
  function vknUret(d9) { for (var c = 0; c < 10; c++) if (D.vknGecerli(d9 + c)) return d9 + c; }
  var BEN = vknUret("987654320"), T = [vknUret("123456780"), vknUret("234567810"), vknUret("345678920"), vknUret("456789030")];
  var AD = ["ÖRNEK Çınar Kırtasiye Ltd. Şti.", "ÖRNEK Işık Ambalaj A.Ş.", "ÖRNEK Güneş Elektrik Ltd. Şti.", "ÖRNEK Şahin Nakliyat A.Ş."];
  var SERI = ["CNR", "ISK", "GNS", "SHN"];
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
      taraf(f.sat[0], f.sat[1], "AccountingSupplierParty") + taraf(BEN, "ÖRNEK Defter Sahibi Ltd. Şti.", "AccountingCustomerParty") +
      "<cac:TaxTotal><cbc:TaxAmount currencyID=\"TRY\">" + f2(topK) + "</cbc:TaxAmount>" + alt + "</cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID=\"TRY\">" + f2(haric) + "</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID=\"TRY\">" + f2(haric) + "</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID=\"TRY\">" + f2(haric + topK) + "</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID=\"TRY\">" + f2(haric + topK) + "</cbc:PayableAmount></cac:LegalMonetaryTotal>" + lines + "</Invoice>";
  }
  var KALEM = [["Kırtasiye seti", 12.5], ["Ofis sandalyesi", 1850], ["Toner kartuşu", 640.4], ["Temizlik paketi", 215.75], ["Su arıtma filtresi", 389.9], ["Zımba makinesi", 96.3]];
  // 22 ÖRNEK alış faturası (Ekim 2026)
  function faturalar() {
    var out = [];
    for (var i = 0; i < 22; i++) {
      var k = i % 4, a = KALEM[i % 6], b = KALEM[(i * 3 + 1) % 6];
      var satir = [[a[0], 2 + (i % 5), a[1], 20]]; if (i % 3 === 0) satir.push([b[0], 1 + (i % 4), b[1], 10]);
      out.push({ no: SERI[k] + "2026" + ("000000000" + (100 + i * 7)).slice(-9), ettn: uuid(i + 1), tarih: "2026-10-" + ("0" + (1 + (i * 5) % 28)).slice(-2), sat: [T[k], AD[k]], satir: satir });
    }
    return out;
  }
  function topl(f) { var h = 0, kd = 0; f.satir.forEach(function (s) { var t = r2(s[1] * s[2]); h += t; kd += r2(t * s[3] / 100); }); return { haric: r2(h), kdv: r2(kd), toplam: r2(h + kd) }; }
  function tarihSerisi(iso) { var p = iso.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000) + 25569; }
  function demo() {
    var F = faturalar(), dosyalar = [];
    F.forEach(function (f) { dosyalar.push({ ad: f.no + ".xml", metin: xml(f) }); });
    // Defter satırları: [sıra, tarih(metin gg.aa.yyyy), fatura no, unvan, vkn, matrah, kdv, toplam]
    var satir = [["ÖRNEK Defter Sahibi Ltd. Şti."], ["İNDİRİLECEK KDV LİSTESİ · Ekim 2026 · ÖRNEK"], [], ["Sıra No", "Fatura Tarihi", "Fatura No", "Satıcı Unvanı", "VKN/TCKN", "Matrah", "KDV", "Toplam"]];
    function gg(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
    var n = 0;
    F.forEach(function (f, i) {
      var t = topl(f), no = f.no, tarih = f.tarih, vk = f.sat[0], m = t.haric, kd = t.kdv, tp = t.toplam;
      if (i === 3 || i === 11) return;                 // deftere işlenmemiş (2)
      if (i === 5) { no = no.slice(0, -1) + (no.slice(-1) === "9" ? "8" : "9"); }  // numara yazım hatası -> olası eşleşme
      if (i === 8) { m = r2(m + 150); tp = r2(tp + 150); } // tutar farkı
      if (i === 13) { tarih = "2026-11-02"; }           // dönem kayması
      if (i === 16) { vk = T[(i + 1) % 4]; }            // VKN farklı
      if (i === 19) { tp = r2(tp + 0.02); m = r2(m + 0.02); } // kuruş yuvarlaması (fark sayılmaz)
      n++; satir.push([n, gg(tarih), no, f.sat[1], vk, m, kd, tp]);
      if (i === 9) { n++; satir.push([n, gg(tarih), no, f.sat[1], vk, m, kd, tp]); } // mükerrer kayıt
    });
    n++; satir.push([n, "14.10.2026", "ZZZ2026000000777", "ÖRNEK Bilinmeyen Tedarik A.Ş.", T[0], 1000, 200, 1200]); // faturası yüklenmemiş (e-Fatura biçiminde)
    n++; satir.push([n, "21.10.2026", "A-104522", "ÖRNEK Kırtasiye (kâğıt fatura)", T[1], 250, 50, 300]); // kâğıt fatura
    return { faturalar: dosyalar, defterSatirlari: satir, defterAdi: "ORNEK-defter-alis-kdv-listesi.xlsx" };
  }
  function xlsxBayt() { var d = demo(); return XL.yaz([{ ad: "KDV Listesi", satirlar: d.defterSatirlari }]); }
  function zipBayt() { var enc = new TextEncoder(); return Z.yaz(demo().faturalar.map(function (f) { return { ad: f.ad, veri: enc.encode(f.metin) }; })); }
  var api = { demo: demo, xlsxBayt: xlsxBayt, zipBayt: zipBayt, BEN: BEN };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.FDKOR = api;
})(typeof self !== "undefined" ? self : this);
