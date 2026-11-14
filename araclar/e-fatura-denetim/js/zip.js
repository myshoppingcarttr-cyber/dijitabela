/* ZIP okuma (saklı + deflate) ve yazma (saklı). Bağımlılıksız; deflate için tarayıcının DecompressionStream'i. */
(function (root) {
  "use strict";
  var SINIR = { girdi: 200 * 1024 * 1024, dosya: 20 * 1024 * 1024, toplam: 600 * 1024 * 1024, adet: 5000 };
  var CT = null;
  function crc32(u8) {
    if (!CT) { CT = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CT[n] = c >>> 0; } }
    var c2 = 0xFFFFFFFF; for (var i = 0; i < u8.length; i++) c2 = CT[(c2 ^ u8[i]) & 255] ^ (c2 >>> 8); return (c2 ^ 0xFFFFFFFF) >>> 0;
  }
  function ad(u8, bayrak) { try { return new TextDecoder(bayrak & 0x800 ? "utf-8" : "utf-8", { fatal: true }).decode(u8); } catch (e) { return new TextDecoder("windows-1254").decode(u8); } }
  async function acDeflate(u8, beklenen) {
    var ds = new DecompressionStream("deflate-raw"), w = ds.writable.getWriter();
    w.write(u8).catch(function () {}); w.close().catch(function () {});
    var r = ds.readable.getReader(), parcalar = [], top = 0;
    for (;;) { var x = await r.read(); if (x.done) break; top += x.value.length; if (top > SINIR.dosya) { try { await r.cancel(); } catch (e) {} throw new Error("Dosya sıkıştırma oranı/boyutu sınırı aştı (" + (SINIR.dosya >> 20) + " MB)"); } parcalar.push(x.value); }
    var o = new Uint8Array(top), p = 0; parcalar.forEach(function (q) { o.set(q, p); p += q.length; }); return o;
  }
  // girdi: Uint8Array -> [{ad, veri(Uint8Array)}] ; hata durumunda {ad, hata}
  async function oku(buf) {
    if (buf.length > SINIR.girdi) throw new Error("ZIP çok büyük (en fazla 200 MB)");
    var dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength), e = -1;
    for (var i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
    if (e < 0) throw new Error("Geçerli bir ZIP dosyası değil");
    var adet = dv.getUint16(e + 10, true), cdOff = dv.getUint32(e + 16, true), p = cdOff, out = [], toplam = 0;
    if (adet === 0xFFFF) throw new Error("ZIP64 desteklenmiyor");
    if (adet > SINIR.adet) throw new Error("ZIP içinde " + adet + " dosya var; en fazla " + SINIR.adet);
    for (var k = 0; k < adet; k++) {
      if (p + 46 > buf.length || dv.getUint32(p, true) !== 0x02014b50) throw new Error("ZIP dizini bozuk");
      var bayrak = dv.getUint16(p + 8, true), yontem = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), usize = dv.getUint32(p + 24, true),
        nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lo = dv.getUint32(p + 42, true);
      var ado = ad(buf.subarray(p + 46, p + 46 + nl), bayrak); p += 46 + nl + xl + cl;
      if (/\/$/.test(ado)) continue;
      if (bayrak & 1) { out.push({ ad: ado, hata: "Şifreli dosya" }); continue; }
      if (usize > SINIR.dosya) { out.push({ ad: ado, hata: "Dosya çok büyük (" + Math.round(usize / 1048576) + " MB; sınır " + (SINIR.dosya >> 20) + " MB)" }); continue; }
      toplam += usize; if (toplam > SINIR.toplam) throw new Error("ZIP açılmış boyutu sınırı aşıyor (600 MB)");
      if (lo + 30 > buf.length || dv.getUint32(lo, true) !== 0x04034b50) { out.push({ ad: ado, hata: "Yerel başlık bozuk" }); continue; }
      var ds = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true), ham = buf.subarray(ds, ds + csize);
      try {
        var veri = yontem === 0 ? ham : yontem === 8 ? await acDeflate(ham, usize) : null;
        if (!veri) { out.push({ ad: ado, hata: "Desteklenmeyen sıkıştırma yöntemi " + yontem }); continue; }
        out.push({ ad: ado, veri: veri });
      } catch (err) { out.push({ ad: ado, hata: "Açılamadı: " + err.message }); }
    }
    return out;
  }
  // girdi: [{ad, veri: Uint8Array}] -> Uint8Array (saklı)
  function yaz(dosyalar) {
    var enc = new TextEncoder(), parcalar = [], cd = [], off = 0;
    function u16(v) { return [v & 255, (v >> 8) & 255]; } function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    dosyalar.forEach(function (f) {
      var nb = enc.encode(f.ad), crc = crc32(f.veri), n = f.veri.length;
      var lh = new Uint8Array([].concat(u32(0x04034b50), u16(20), u16(0x800), u16(0), u16(0), u16(0x21), u32(crc), u32(n), u32(n), u16(nb.length), u16(0)));
      parcalar.push(lh, nb, f.veri);
      cd.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x800), u16(0), u16(0), u16(0x21), u32(crc), u32(n), u32(n), u16(nb.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(off))), nb);
      off += lh.length + nb.length + n;
    });
    var cdLen = 0; cd.forEach(function (c) { cdLen += c.length; });
    var son = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(dosyalar.length), u16(dosyalar.length), u32(cdLen), u32(off), u16(0)));
    var hepsi = parcalar.concat(cd, [son]), top = 0; hepsi.forEach(function (c) { top += c.length; });
    var o = new Uint8Array(top), q = 0; hepsi.forEach(function (c) { o.set(c, q); q += c.length; }); return o;
  }
  var api = { oku: oku, yaz: yaz, crc32: crc32, SINIR: SINIR };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.EFZ = api;
})(typeof self !== "undefined" ? self : this);
