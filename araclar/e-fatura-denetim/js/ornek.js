/* KURGUSAL (ÖRNEK) UBL-TR fatura üreticisi. Gerçek kişi/kurum yoktur; vergi numaraları sağlama algoritmasına uyan uydurma numaralardır. */
(function (root) {
  "use strict";
  var D = typeof module !== "undefined" && module.exports ? require("./denetim.js") : root.EFD;
  function vknUret(d9) { for (var c = 0; c < 10; c++) if (D.vknGecerli(d9 + c)) return d9 + c; }
  function tcknUret(d9) { var d = d9.split("").map(Number), o = d[0] + d[2] + d[4] + d[6] + d[8], e = d[1] + d[3] + d[5] + d[7], d10 = (((o * 7 - e) % 10) + 10) % 10, t = d.reduce(function (a, b) { return a + b; }, 0) + d10; return d9 + d10 + (t % 10); }
  var SATICI = vknUret("123456780"), ALICI1 = vknUret("234567810"), ALICI2 = vknUret("345678920"), ALICI3 = tcknUret("100000001");
  function f2(x) { return (Math.round(x * 100) / 100).toFixed(2); }
  function uuid(n) { var h = ("00000000" + (n * 2654435761 >>> 0).toString(16)).slice(-8); return h + "-1a2b-4c3d-8e4f-" + ("000000000000" + n.toString(16)).slice(-12); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  // o: {no, ettn, tarih, tip, senaryo, para, satici:[id,sema,ad], alici:[id,sema,ad], satirlar:[{ad, miktar, fiyat, oran}], bozKdv, bozToplam, ...}
  function fatura(o) {
    o = Object.assign({ tip: "SATIS", senaryo: "TICARIFATURA", para: "TRY", satici: [SATICI, "VKN", "ÖRNEK Tedarik A.Ş."], alici: [ALICI1, "VKN", "ÖRNEK Market Ltd. Şti."] }, o);
    var sat = o.satirlar, topSatir = 0, grup = {}, satXml = "";
    sat.forEach(function (s, i) {
      var tutar = Math.round(s.miktar * s.fiyat * 100) / 100, kdv = Math.round(tutar * s.oran) / 100;
      if (s.bozKdv) kdv += s.bozKdv; if (s.bozTutar) tutar += s.bozTutar;
      topSatir += tutar; var g = grup[s.oran] = grup[s.oran] || { m: 0, v: 0 }; g.m += tutar; g.v += kdv;
      satXml += "<cac:InvoiceLine><cbc:ID>" + (i + 1) + "</cbc:ID><cbc:InvoicedQuantity unitCode=\"C62\">" + s.miktar + "</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID=\"" + o.para + "\">" + f2(tutar) + "</cbc:LineExtensionAmount>" +
        "<cac:TaxTotal><cbc:TaxAmount currencyID=\"" + o.para + "\">" + f2(kdv) + "</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID=\"" + o.para + "\">" + f2(tutar) + "</cbc:TaxableAmount><cbc:TaxAmount currencyID=\"" + o.para + "\">" + f2(kdv) + "</cbc:TaxAmount><cbc:Percent>" + s.oran + "</cbc:Percent><cac:TaxCategory>" + (s.oran === 0 && s.istisna ? "<cbc:TaxExemptionReasonCode>" + s.istisna + "</cbc:TaxExemptionReasonCode>" : "") + "<cac:TaxScheme><cbc:Name>KDV</cbc:Name><cbc:TaxTypeCode>0015</cbc:TaxTypeCode></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal>" +
        "<cac:Item><cbc:Name>" + esc(s.ad) + "</cbc:Name></cac:Item><cac:Price><cbc:PriceAmount currencyID=\"" + o.para + "\">" + s.fiyat + "</cbc:PriceAmount></cac:Price></cac:InvoiceLine>";
    });
    var topKdv = 0, altXml = ""; Object.keys(grup).forEach(function (k) { var g = grup[k], v = g.v + (o.bozBaslikKdv || 0); topKdv += v; altXml += "<cac:TaxSubtotal><cbc:TaxableAmount currencyID=\"" + o.para + "\">" + f2(g.m) + "</cbc:TaxableAmount><cbc:TaxAmount currencyID=\"" + o.para + "\">" + f2(v) + "</cbc:TaxAmount><cbc:Percent>" + k + "</cbc:Percent><cac:TaxCategory><cac:TaxScheme><cbc:Name>KDV</cbc:Name><cbc:TaxTypeCode>0015</cbc:TaxTypeCode></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal>"; });
    var haric = topSatir, dahil = haric + topKdv + (o.bozDahil || 0), odenecek = dahil + (o.bozOdenecek || 0);
    function taraf(t, rol) { return "<cac:" + rol + "><cac:Party><cac:PartyIdentification><cbc:ID schemeID=\"" + t[1] + "\">" + t[0] + "</cbc:ID></cac:PartyIdentification>" + (t[2] ? "<cac:PartyName><cbc:Name>" + esc(t[2]) + "</cbc:Name></cac:PartyName>" : "") + "<cac:PostalAddress><cbc:CityName>Antalya</cbc:CityName><cac:Country><cbc:Name>Türkiye</cbc:Name></cac:Country></cac:PostalAddress></cac:Party></cac:" + rol + ">"; }
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\" xmlns:cac=\"urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2\" xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\">" +
      "<cbc:UBLVersionID>2.1</cbc:UBLVersionID><cbc:CustomizationID>TR1.2</cbc:CustomizationID><cbc:ProfileID>" + o.senaryo + "</cbc:ProfileID><cbc:ID>" + o.no + "</cbc:ID><cbc:CopyIndicator>false</cbc:CopyIndicator><cbc:UUID>" + o.ettn + "</cbc:UUID><cbc:IssueDate>" + o.tarih + "</cbc:IssueDate><cbc:IssueTime>10:15:00</cbc:IssueTime><cbc:InvoiceTypeCode>" + o.tip + "</cbc:InvoiceTypeCode><cbc:Note>ÖRNEK — kurgusal fatura, dijitabela.com</cbc:Note><cbc:DocumentCurrencyCode>" + o.para + "</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>" + sat.length + "</cbc:LineCountNumeric>" +
      (o.iadeRef ? "<cac:BillingReference><cac:InvoiceDocumentReference><cbc:ID>" + o.iadeRef + "</cbc:ID><cbc:IssueDate>" + o.tarih + "</cbc:IssueDate></cac:InvoiceDocumentReference></cac:BillingReference>" : "") +
      taraf(o.satici, "AccountingSupplierParty") + taraf(o.alici, "AccountingCustomerParty") +
      "<cac:TaxTotal><cbc:TaxAmount currencyID=\"" + o.para + "\">" + f2(topKdv) + "</cbc:TaxAmount>" + altXml + "</cac:TaxTotal>" +
      "<cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID=\"" + o.para + "\">" + f2(topSatir + (o.bozToplam || 0)) + "</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID=\"" + o.para + "\">" + f2(haric) + "</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID=\"" + o.para + "\">" + f2(dahil) + "</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID=\"" + o.para + "\">" + f2(odenecek) + "</cbc:PayableAmount></cac:LegalMonetaryTotal>" + satXml + "</Invoice>";
  }
  var KALEM = [["Kırtasiye seti", 12.5], ["Ofis sandalyesi", 1850], ["Toner kartuşu", 640.4], ["Temizlik paketi", 215.75], ["Su arıtma filtresi", 389.9], ["Zımba makinesi", 96.3]];
  function seri(n, bas) { // n adet temiz fatura
    var out = [];
    for (var i = 0; i < n; i++) {
      var k1 = KALEM[i % 6], k2 = KALEM[(i * 3 + 1) % 6], gun = 1 + (i % 27);
      out.push({ ad: "ornek-" + (bas + i) + ".xml", metin: fatura({ no: "ORN2026" + ("000000000" + (bas + i)).slice(-9), ettn: uuid(bas + i), tarih: "2026-10-" + ("0" + gun).slice(-2), alici: [[ALICI1, ALICI2][i % 2], "VKN", "ÖRNEK Alıcı " + (i % 2 + 1)], satirlar: [{ ad: k1[0], miktar: 1 + (i % 5), fiyat: k1[1], oran: 20 }, { ad: k2[0], miktar: 2 + (i % 3), fiyat: k2[1], oran: i % 4 === 0 ? 10 : 20 }] }) });
    }
    return out;
  }
  // Küçük demo seti: planlı hatalarla (her biri belgelenmiş)
  function demo() {
    var d = seri(12, 1), n = 13;
    function ek(ad, o) { d.push({ ad: ad, metin: fatura(Object.assign({ ettn: uuid(n), no: "ORN2026" + ("000000000" + n).slice(-9), tarih: "2026-10-20", satirlar: [{ ad: "Toner kartuşu", miktar: 3 + (n % 7), fiyat: 640.4, oran: 20 }] }, o)) }); n++; }
    ek("hatali-satir-kdv.xml", { satirlar: [{ ad: "Toner kartuşu", miktar: 3, fiyat: 640.4, oran: 20, bozKdv: 12.5 }] });
    ek("hatali-toplam.xml", { bozToplam: 150 });
    ek("hatali-odenecek.xml", { bozOdenecek: -200 });
    ek("eski-oran-2026.xml", { satirlar: [{ ad: "Zımba makinesi", miktar: 4, fiyat: 96.3, oran: 18 }] });
    ek("kdv-sifir-sebepsiz.xml", { satirlar: [{ ad: "Danışmanlık", miktar: 1, fiyat: 5000, oran: 0 }] });
    ek("hatali-vkn.xml", { alici: ["2345678199", "VKN", "ÖRNEK Hatalı VKN Ltd."] });
    ek("gelecek-tarih.xml", { tarih: "2027-03-01" });
    ek("kisa-numara.xml", { no: "ORN202600099" });
    d.push({ ad: "mukerrer-ettn-kopya.xml", metin: d[2].metin }); // aynı dosya ikinci kez
    d.push({ ad: "ayni-no-farkli-ettn.xml", metin: d[3].metin.replace(/<cbc:UUID>[^<]+/, "<cbc:UUID>" + uuid(900)) });
    d.push({ ad: "bozuk.xml", metin: "<Invoice><cbc:ID>ORN2026000000500</cbc:ID>" });
    d.push({ ad: "numara-atlayan-1.xml", metin: fatura({ no: "ORN2026000000030", ettn: uuid(30), tarih: "2026-10-22", satirlar: [{ ad: "Kırtasiye seti", miktar: 2, fiyat: 12.5, oran: 20 }] }) });
    d.push({ ad: "uygulama-yaniti.xml", metin: "<?xml version=\"1.0\"?><ApplicationResponse xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2\"><ID>1</ID></ApplicationResponse>" });
    return d;
  }
  var api = { fatura: fatura, seri: seri, demo: demo, uuid: uuid, vknUret: vknUret, tcknUret: tcknUret, SATICI: SATICI, ALICI1: ALICI1, ALICI3: ALICI3 };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.EFO = api;
})(typeof self !== "undefined" ? self : this);
