/* Ortalama vade hesabı: arayüzden bağımsız. Tarayıcıda window.DTV, node'da module.exports. Tutarlar kuruşa çevrilip BigInt ile toplanır (kayan nokta hatası yok). */
(function (kok) {
  "use strict";
  var MAKS_KURUS = 1000000000000n; // 10 milyar TL
  var MAKS_SATIR = 500;
  var GUN = 86400000;

  // "15.000,50" / "15000,5" / "15000.50" / "₺ 1.250" -> kuruş (BigInt) ya da null
  function tutarKurus(s) {
    if (typeof s === "number") { if (!isFinite(s) || s <= 0) return null; s = String(s); }
    if (typeof s !== "string") return null;
    s = s.replace(/[\s ₺]|TL/gi, "");
    if (!s || /[^0-9.,]/.test(s)) return null;
    var ondalik = "00", tam;
    var vir = s.lastIndexOf(","), nok = s.lastIndexOf(".");
    if (vir >= 0 && nok >= 0) {
      if (nok > vir) return null; // 1,234.50 (İngilizce biçim) belirsiz: reddet
      if (s.indexOf(",") !== vir) return null;
      tam = s.slice(0, vir); ondalik = s.slice(vir + 1);
      if (!/^\d{1,3}(\.\d{3})*$/.test(tam)) return null;
      tam = tam.replace(/\./g, "");
    } else if (vir >= 0) {
      if (s.indexOf(",") !== vir) return null;
      tam = s.slice(0, vir); ondalik = s.slice(vir + 1);
      if (!/^\d+$/.test(tam)) return null;
    } else if (nok >= 0) {
      var parcalar = s.split(".");
      var sonu = parcalar[parcalar.length - 1];
      if (parcalar.length === 2 && sonu.length !== 3) { tam = parcalar[0]; ondalik = sonu; } // 1250.5 -> ondalık
      else { if (!/^\d{1,3}(\.\d{3})+$/.test(s)) return null; tam = s.replace(/\./g, ""); }
      if (!/^\d+$/.test(tam)) return null;
    } else tam = s;
    if (!/^\d+$/.test(ondalik) || ondalik.length > 2 || !/^\d+$/.test(tam)) return null;
    if (ondalik.length === 1) ondalik += "0";
    if (ondalik === "") ondalik = "00";
    var k = BigInt(tam) * 100n + BigInt(ondalik);
    if (k <= 0n || k > MAKS_KURUS) return null;
    return k;
  }

  // "2026-12-31" ya da "31.12.2026" -> UTC gün numarası (tam sayı) ya da null
  function tarihGun(s) {
    if (typeof s !== "string") return null;
    s = s.trim();
    var y, a, g, m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) { y = +m[1]; a = +m[2]; g = +m[3]; }
    else if ((m = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(s))) { g = +m[1]; a = +m[2]; y = +m[3]; }
    else return null;
    if (y < 1990 || y > 2100) return null;
    var d = new Date(Date.UTC(y, a - 1, g));
    if (d.getUTCFullYear() !== y || d.getUTCMonth() !== a - 1 || d.getUTCDate() !== g) return null;
    return Math.round(d.getTime() / GUN);
  }
  function gunIso(n) { return new Date(n * GUN).toISOString().slice(0, 10); }
  function gunTr(n) { var p = gunIso(n).split("-"); return p[2] + "." + p[1] + "." + p[0]; }

  // BigInt bölme, en yakın tam sayıya (yarım değerde sıfırdan uzağa)
  function bolYuvarla(a, b) { // b > 0
    var ne = a < 0n; if (ne) a = -a;
    var q = (2n * a + b) / (2n * b);
    return ne ? -q : q;
  }
  function kurusYaz(k) {
    var s = k.toString(); while (s.length < 3) s = "0" + s;
    var t = s.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, "."), o = s.slice(-2);
    return t + "," + o;
  }
  function tl(k) { return kurusYaz(k) + " TL"; }

  /* hesapla({baz:"2026-11-14", satirlar:[{tutar:"15.000,50", vade:"2027-01-15"}, ...]})
     Boş satır (tutar ve vade ikisi de boş) atlanır. Yarım dolu satır hata verir. */
  function hesapla(girdi) {
    var hatalar = [];
    if (!girdi || !Array.isArray(girdi.satirlar)) return { durum: "hata", hatalar: ["Satır listesi yok."] };
    var baz = tarihGun(girdi.baz || "");
    if (baz === null) hatalar.push("Başlangıç (bordro) tarihi geçersiz ya da boş.");
    if (girdi.satirlar.length > MAKS_SATIR) return { durum: "hata", hatalar: ["En fazla " + MAKS_SATIR + " satır girilebilir."] };
    var satirlar = [], toplam = 0n, agirlik = 0n, bosSay = 0, gunToplam = 0;
    girdi.satirlar.forEach(function (r, i) {
      var t = r && r.tutar != null ? String(r.tutar).trim() : "", v = r && r.vade != null ? String(r.vade).trim() : "";
      if (!t && !v) { bosSay++; return; }
      var no = i + 1;
      var k = t ? tutarKurus(t) : null, g = v ? tarihGun(v) : null;
      if (!t) hatalar.push(no + ". satır: tutar boş."); else if (k === null) hatalar.push(no + ". satır: tutar anlaşılmadı (örnek 15.000,50) ya da 0 / 10 milyar TL dışında.");
      if (!v) hatalar.push(no + ". satır: vade tarihi boş."); else if (g === null) hatalar.push(no + ". satır: vade tarihi geçersiz.");
      if (k === null || g === null || baz === null) return;
      var gun = g - baz;
      satirlar.push({ no: no, kurus: k, vade: g, gun: gun });
      toplam += k; agirlik += k * BigInt(gun); gunToplam += gun;
    });
    if (hatalar.length) return { durum: "hata", hatalar: hatalar };
    if (!satirlar.length) return { durum: "bos", hatalar: [] };
    var ort10 = bolYuvarla(agirlik * 10n, toplam);       // 0,1 gün hassasiyet
    var ortGun = Number(bolYuvarla(agirlik, toplam));     // tam gün
    var basit10 = Math.round(gunToplam * 10 / satirlar.length);
    var uyarilar = [];
    var gecmis = satirlar.filter(function (s) { return s.gun < 0; }).length;
    if (gecmis) uyarilar.push(gecmis + " satırın vadesi başlangıç tarihinden önce; bu satırlar negatif gün olarak hesaba girdi.");
    return {
      durum: "tamam", uyarilar: uyarilar, adet: satirlar.length, satirlar: satirlar,
      toplamKurus: toplam, agirlikliGun10: Number(ort10), agirlikliGun: ortGun,
      ortalamaVadeGun: baz + ortGun, ortalamaVadeIso: gunIso(baz + ortGun), ortalamaVadeTr: gunTr(baz + ortGun),
      basitGun10: basit10, baz: baz
    };
  }

  function gunYaz10(n10) { var ne = n10 < 0, a = Math.abs(n10), s = Math.floor(a / 10) + "," + (a % 10); return (ne ? "-" : "") + s; }

  function ozetMetin(c, bazTr) {
    if (c.durum !== "tamam") return "";
    var s = ["Ortalama vade hesabı (Dijitabela Araçlar)", "Başlangıç tarihi: " + bazTr, "Adet: " + c.adet + " · Toplam: " + tl(c.toplamKurus)];
    c.satirlar.forEach(function (r) { s.push(r.no + ") " + tl(r.kurus) + " · vade " + gunTr(r.vade) + " · " + r.gun + " gün"); });
    s.push("Tutar ağırlıklı ortalama vade: " + gunYaz10(c.agirlikliGun10) + " gün → " + c.ortalamaVadeTr);
    s.push("Basit ortalama (tutarsız): " + gunYaz10(c.basitGun10) + " gün");
    s.push("Bilgi amaçlıdır; resmi hesap yerine geçmez. dijitabela.com/araclar/ortalama-vade/");
    return s.join("\n");
  }

  var API = { tutarKurus: tutarKurus, tarihGun: tarihGun, gunIso: gunIso, gunTr: gunTr, hesapla: hesapla, tl: tl, kurusYaz: kurusYaz, gunYaz10: gunYaz10, ozetMetin: ozetMetin, MAKS_SATIR: MAKS_SATIR };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.DTV = API;
})(typeof window !== "undefined" ? window : this);
