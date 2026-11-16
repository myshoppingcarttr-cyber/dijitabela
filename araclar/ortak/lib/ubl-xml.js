/* Küçük, bağımlılıksız XML ayrıştırıcı (UBL için yeterli). DOCTYPE/varlık genişletme yok (güvenli). */
(function (root) {
  "use strict";
  var ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  function dec(s) {
    if (s.indexOf("&") < 0) return s;
    return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-z]+);/g, function (m, e) {
      if (e.charAt(0) === "#") { var c = e.charAt(1) === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return c > 0 && c < 0x110000 ? String.fromCodePoint(c) : ""; }
      return Object.prototype.hasOwnProperty.call(ENT, e) ? ENT[e] : m;
    });
  }
  var TOK = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[([\s\S]*?)\]\]>|<!DOCTYPE[^\[>]*(?:\[[\s\S]*?\])?\s*>|<(\/?)([A-Za-z_][\w.\-]*(?::[\w.\-]+)?)((?:\s+[^\s=\/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  var ATT = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  function parse(s) {
    if (s.charCodeAt(0) === 0xFEFF) s = s.slice(1);
    var rootN = null, stack = [], last = 0, m, depth = 0;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(s)) !== null) {
      if (m.index !== last) throw new Error("XML biçimi bozuk (konum " + last + ")");
      last = TOK.lastIndex;
      if (m[6] !== undefined) {
        if (stack.length) stack[stack.length - 1].t += dec(m[6]);
        else if (m[6].trim()) throw new Error("Kök öğe dışında metin var");
      } else if (m[1] !== undefined) {
        if (stack.length) stack[stack.length - 1].t += m[1];
      } else if (m[3] !== undefined) {
        var local = m[3].slice(m[3].indexOf(":") + 1);
        if (m[2] === "/") {
          var top = stack.pop();
          if (!top || top.q !== m[3]) throw new Error("Kapanış etiketi uyuşmuyor: </" + m[3] + ">");
        } else {
          var n = { n: local, q: m[3], a: {}, c: [], t: "" };
          if (m[4]) { var am; ATT.lastIndex = 0; while ((am = ATT.exec(m[4])) !== null) n.a[am[1].slice(am[1].indexOf(":") + 1)] = dec(am[2] !== undefined ? am[2] : am[3]); }
          if (stack.length) stack[stack.length - 1].c.push(n); else if (rootN) throw new Error("Birden fazla kök öğe"); else rootN = n;
          if (m[5] !== "/") { stack.push(n); if (++depth > 200) throw new Error("XML çok derin"); } 
        }
        if (m[2] === "/") depth--;
      }
    }
    if (last !== s.length) throw new Error("XML sonu bozuk");
    if (stack.length) throw new Error("Kapanmamış etiket: <" + stack[stack.length - 1].q + ">");
    if (!rootN) throw new Error("XML içinde öğe yok");
    return rootN;
  }
  function ch(n, name) { if (!n) return null; for (var i = 0; i < n.c.length; i++) if (n.c[i].n === name) return n.c[i]; return null; }
  function chs(n, name) { var r = []; if (!n) return r; for (var i = 0; i < n.c.length; i++) if (n.c[i].n === name) r.push(n.c[i]); return r; }
  function path(n, p) { var a = p.split("/"); for (var i = 0; i < a.length && n; i++) n = ch(n, a[i]); return n; }
  function txt(n) { return n ? n.t.trim() : ""; }
  function find(n, name) { if (n.n === name) return n; for (var i = 0; i < n.c.length; i++) { var r = find(n.c[i], name); if (r) return r; } return null; }
  var api = { parse: parse, ch: ch, chs: chs, path: path, txt: txt, find: find };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.EFX = api;
})(typeof self !== "undefined" ? self : this);
