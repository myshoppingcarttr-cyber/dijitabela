/* Minimal .xlsx yazıcı (çoklu sayfa, metin + sayı + kalın başlık). Bağımlılık: zip.js */
(function (root) {
  "use strict";
  var Z = typeof module !== "undefined" && module.exports ? require("./zip.js") : root.EFZ;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""); }
  function kol(i) { var s = ""; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function sayfaXml(satirlar) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="30" width="22" customWidth="1"/></cols><sheetData>';
    satirlar.forEach(function (sat, r) {
      x += '<row r="' + (r + 1) + '">';
      sat.forEach(function (h, c) {
        if (h === null || h === undefined || h === "") return;
        var ref = kol(c) + (r + 1);
        if (typeof h === "number" && isFinite(h)) x += '<c r="' + ref + '"' + (r === 0 ? ' s="1"' : ' s="2"') + '><v>' + h + '</v></c>';
        else x += '<c r="' + ref + '" t="inlineStr"' + (r === 0 ? ' s="1"' : "") + '><is><t xml:space="preserve">' + esc(h) + '</t></is></c>';
      });
      x += "</row>";
    });
    return x + "</sheetData></worksheet>";
  }
  // sayfalar: [{ad, satirlar:[[...]]}] -> Uint8Array
  function yaz(sayfalar) {
    var enc = new TextEncoder(), D = [];
    function ekle(ad, s) { D.push({ ad: ad, veri: enc.encode(s) }); }
    ekle("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' + sayfalar.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join("") + "</Types>");
    ekle("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    ekle("xl/workbook.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + sayfalar.map(function (s, i) { return '<sheet name="' + esc(s.ad.slice(0, 31)) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join("") + "</sheets></workbook>");
    ekle("xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sayfalar.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join("") + '<Relationship Id="rId' + (sayfalar.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    ekle("xl/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs></styleSheet>');
    sayfalar.forEach(function (s, i) { ekle("xl/worksheets/sheet" + (i + 1) + ".xml", sayfaXml(s.satirlar)); });
    return Z.yaz(D);
  }
  var api = { yaz: yaz }; if (typeof module !== "undefined" && module.exports) module.exports = api; else root.EFXL = api;
})(typeof self !== "undefined" ? self : this);
