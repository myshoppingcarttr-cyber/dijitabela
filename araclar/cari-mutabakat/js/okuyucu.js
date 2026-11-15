/* Excel (.xlsx) ve CSV okuyucu. Bağımlılık: ortak/lib/zip.js (EFZ). Eski .xls (BIFF) desteklenmez. */
(function (root) {
  "use strict";
  var Z = typeof module !== "undefined" && module.exports ? require("../../ortak/lib/zip.js") : root.EFZ;
  var MAKS_SATIR = 50000, MAKS_KOLON = 60;

  function metin(u8) { try { return new TextDecoder("utf-8", { fatal: true }).decode(u8); } catch (e) { return new TextDecoder("windows-1254").decode(u8); } }
  function ent(s) { return s.replace(/&(#x[0-9a-f]+|#\d+|lt|gt|amp|quot|apos);/gi, function (m, g) { g = g.toLowerCase(); if (g === "lt") return "<"; if (g === "gt") return ">"; if (g === "amp") return "&"; if (g === "quot") return '"'; if (g === "apos") return "'"; var n = g[1] === "x" ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ""; }); }
  function kolNo(ref) { var m = /^([A-Z]+)/.exec(ref), n = 0; for (var i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64); return n - 1; }
  function tOku(x) { var out = "", re = /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g, m; while ((m = re.exec(x))) out += m[1]; return ent(out); }

  function ortakDizge(xml) {
    var out = [], re = /<si>([\s\S]*?)<\/si>|<si\/>/g, m;
    while ((m = re.exec(xml))) out.push(m[1] ? tOku(m[1].replace(/<rPh[\s\S]*?<\/rPh>/g, "")) : "");
    return out;
  }
  function sayfaOku(xml, dizge) {
    var rows = [], re = /<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g, m;
    while ((m = re.exec(xml))) {
      var rn = /\br="(\d+)"/.exec(m[1]), r = rn ? parseInt(rn[1], 10) - 1 : rows.length;
      if (r >= MAKS_SATIR) throw new Error("Sayfada " + MAKS_SATIR + " satırdan fazla var; dönemi daraltıp yeniden deneyin");
      var sat = rows[r] = rows[r] || [];
      if (!m[2]) continue;
      var cre = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g, c, pos = 0;
      while ((c = cre.exec(m[2]))) {
        var ref = /\br="([A-Z]+\d+)"/.exec(c[1]), ci = ref ? kolNo(ref[1]) : pos; pos = ci + 1;
        if (ci >= MAKS_KOLON || !c[2]) continue;
        var t = /\bt="([^"]+)"/.exec(c[1]); t = t ? t[1] : "n";
        var v = /<v>([\s\S]*?)<\/v>/.exec(c[2]), val = null;
        if (t === "s") val = v ? dizge[parseInt(v[1], 10)] : null;
        else if (t === "inlineStr") val = tOku(c[2]);
        else if (t === "str" || t === "e") val = v ? ent(v[1]) : null;
        else if (t === "b") val = v ? (v[1] === "1" ? "DOĞRU" : "YANLIŞ") : null;
        else if (v) { var n = parseFloat(v[1]); val = isFinite(n) ? n : ent(v[1]); }
        if (t === "e") val = null;
        sat[ci] = val;
      }
    }
    for (var i = 0; i < rows.length; i++) if (!rows[i]) rows[i] = [];
    return rows;
  }
  // -> [{ad, rows}]
  async function xlsxOku(u8) {
    var d = await Z.oku(u8), map = {};
    d.forEach(function (f) { if (f.veri) map[f.ad.replace(/^\//, "")] = f; });
    var wb = map["xl/workbook.xml"]; if (!wb) throw new Error("Bu bir Excel (.xlsx) dosyası gibi görünmüyor");
    var wbx = metin(wb.veri), rels = map["xl/_rels/workbook.xml.rels"] ? metin(map["xl/_rels/workbook.xml.rels"].veri) : "";
    var hedef = {}; rels.replace(/<Relationship\b([^>]*)\/?>/g, function (_, a) { var id = /\bId="([^"]+)"/.exec(a), tg = /\bTarget="([^"]+)"/.exec(a); if (id && tg) hedef[id[1]] = tg[1].replace(/^\//, "").replace(/^(?!xl\/)/, "xl/"); return ""; });
    var dizge = map["xl/sharedStrings.xml"] ? ortakDizge(metin(map["xl/sharedStrings.xml"].veri)) : [];
    var sayfalar = [], re = /<sheet\b([^>]*)\/?>/g, m;
    while ((m = re.exec(wbx))) {
      var ad = /\bname="([^"]*)"/.exec(m[1]), rid = /\br:id="([^"]+)"/.exec(m[1]);
      if (/\bstate="(hidden|veryHidden)"/.test(m[1])) continue;
      var yol = rid && hedef[rid[1]]; if (!yol || !map[yol]) continue;
      sayfalar.push({ ad: ent(ad ? ad[1] : "Sayfa"), rows: sayfaOku(metin(map[yol].veri), dizge) });
    }
    if (!sayfalar.length) throw new Error("Dosyada okunabilir sayfa yok");
    return sayfalar;
  }
  function csvOku(s) {
    s = s.replace(/^﻿/, "");
    var ilk = s.split(/\r?\n/, 5).join("\n"), sec = [";", "\t", ",", "|"], best = ";", bn = -1;
    sec.forEach(function (d) { var n = ilk.split(d).length - 1; if (n > bn) { bn = n; best = d; } });
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) { if (ch === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true;
      else if (ch === best) { row.push(f); f = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && s[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; if (rows.length > MAKS_SATIR) throw new Error("CSV " + MAKS_SATIR + " satırdan uzun"); }
      else f += ch;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows.map(function (r) { return r.slice(0, MAKS_KOLON).map(function (h) { return h === "" ? null : h; }); });
  }
  // dosya baytları -> [{ad, rows}]
  async function oku(u8, ad) {
    if (!u8 || !u8.length) throw new Error("Dosya boş");
    if (u8.length > 3 && u8[0] === 0xD0 && u8[1] === 0xCF && u8[2] === 0x11) throw new Error("Eski .xls biçimi desteklenmiyor. Excel'de 'Farklı kaydet → Excel Çalışma Kitabı (.xlsx)' ya da CSV olarak kaydedip yükleyin.");
    if (u8.length > 3 && u8[0] === 0x50 && u8[1] === 0x4B) return xlsxOku(u8);
    if (/\.(xlsx|xlsm)$/i.test(ad || "")) throw new Error("Dosya bozuk ya da .xlsx değil");
    var head = u8.subarray(0, 300), txt = metin(u8);
    if (/<html|<table/i.test(txt.slice(0, 500))) throw new Error("Bu dosya HTML tablosu (bazı programlar .xls adıyla HTML verir). Excel'de açıp .xlsx olarak kaydedin.");
    if (head.some(function (b) { return b === 0; })) throw new Error("Dosya metin/CSV ya da .xlsx değil");
    return [{ ad: "CSV", rows: csvOku(txt) }];
  }
  var api = { oku: oku, csvOku: csvOku, xlsxOku: xlsxOku };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CMO = api;
})(typeof self !== "undefined" ? self : this);
