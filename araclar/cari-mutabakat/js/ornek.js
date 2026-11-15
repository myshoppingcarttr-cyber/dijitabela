/* ÖRNEK (kurgusal) ekstreler: gerçek kişi/kurum yok. Gerçek .xlsx baytları üretilir ve normal okuma yolundan geçer. */
(function (root) {
  "use strict";
  var B0 = ["Tarih", "Fiş No", "Açıklama", "Borç", "Alacak"];
  var bizim = [
    ["02.03.2026", "ABC2026000000101", "Satış faturası", 12000, null],
    ["09.03.2026", "ABC2026000000102", "Satış faturası", 8450.5, null],
    ["12.03.2026", "TAH00031", "Havale tahsilat", null, 12000],
    ["18.03.2026", "ABC2026000000103", "Satış faturası", 5000, null],
    ["24.03.2026", "ABC2026000000104", "Satış faturası", 21600, null],
    ["26.03.2026", "ABC2026000000105", "Satış faturası", 3300, null],
    ["28.03.2026", "ABC2026000000106", "Satış faturası", 7200, null],
    ["30.03.2026", "TAH00032", "Havale tahsilat", null, 9000],
    ["31.03.2026", "ABC2026000000107", "Satış faturası", 1850, null]
  ];
  // Karşı taraf (ayna): faturayı alış, tahsilatı ödeme olarak işlemiş; bilerek farklar bırakıldı
  var karsi = [
    ["02.03.2026", "ABC-2026-101", "Alış faturası", null, 12000],               // belge no biçimi farklı, tutar aynı
    ["10.03.2026", "ABC2026000000102", "Alış faturası", null, 8450.5],          // 1 gün tarih farkı
    ["12.03.2026", "ODM-77", "Banka ödemesi", 12000, null],                     // belge no farklı, tutar+tarih aynı
    ["18.03.2026", "ABC2026000000103", "Alış faturası", null, 4750],            // tutar farkı (iskonto)
    ["24.03.2026", "ABC2026000000104", "Alış faturası", null, 18000],           // 21.600 / 18.000 = %20 KDV farkı
    // 105 hiç işlenmemiş (yalnız bizde)
    ["28.03.2026", "ABC2026000000106", "Alış faturası", null, 7200],
    ["29.03.2026", "ODM-78a", "Banka ödemesi (1/2)", 5000, null],               // 9.000 tahsilat iki parça
    ["30.03.2026", "ODM-78b", "Banka ödemesi (2/2)", 4000, null],
    ["31.03.2026", "ABC2026000000107", "Alış faturası", null, 1850],
    ["31.03.2026", "ODM-79", "Banka ödemesi", 650, null]                        // yalnız karşıda
  ];
  function parseTl(s) { return s; }
  function xlsxBayt(rows) {
    return EFXL.yaz([{ ad: "ÖRNEK ekstre", satirlar: [["ÖRNEK — kurgusal veri, gerçek kişi/kurum değildir"], [], B0].concat(rows).concat([[null, null, "TOPLAM"]]) }]);
  }
  function demo() {
    return [
      { ad: "ÖRNEK-bizim-ekstre.xlsx", bayt: xlsxBayt(bizim) },
      { ad: "ÖRNEK-karsi-taraf-ekstre.xlsx", bayt: xlsxBayt(karsi) }
    ];
  }
  var api = { demo: demo, bizim: bizim, karsi: karsi };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CMOR = api;
})(typeof self !== "undefined" ? self : this);
