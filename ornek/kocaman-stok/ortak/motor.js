/* StokPazarı prototip motoru (Dijitabela). Sunucu yok: durum localStorage'da tutulur. */
(function () {
  "use strict";
  var V = window.SP_VERI, SP = window.SP = { V: V };
  var GUN = 864e5, SAAT = 36e5, DK = 6e4;
  var KAT = {}, FIR = {};
  V.KATEGORI.forEach(function (k) { KAT[k.id] = k; });
  V.FIRMA.forEach(function (f) { FIR[f.id] = f; });
  SP.kategori = function (id) { return KAT[id]; };
  SP.firma = function (id) { return FIR[id]; };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  SP.esc = esc;

  /* ---------- durum ---------- */
  var ANAHTAR = "stokpazari-demo-v4";
  function tohum() {
    var t0 = Date.now();
    function zaman(o) { var c = JSON.parse(JSON.stringify(o)); c.t = t0 - (c.dk || 0) * DK; return c; }
    var mesaj = {};
    ["kurumsal", "bireysel"].forEach(function (h) { mesaj[h] = V.MESAJ[h].map(zaman); });
    return {
      v: 4, t0: t0, hesap: "kurumsal", urun: {}, yeni: [], teklif: V.TEKLIF.map(zaman), verilen: V.VERILEN.map(zaman),
      talep: V.TALEP.map(zaman), gidenTalep: [], mesaj: mesaj, bireyselIlan: [],
      kat: { bireysel: V.KISI.bireysel.kat.slice(), kurumsal: V.KISI.kurumsal.kat.slice() },
      goster: {}, duyuru: [{ urun: "p53", t: t0 - 0.9 * GUN, kisi: 268 }, { urun: "p9", t: t0 - 2 * GUN, kisi: 268 }, { urun: "p49", t: t0 - 3.5 * GUN, kisi: 268 }, { urun: "p10", t: t0 - 5 * GUN, kisi: 268 }, { urun: "p54", t: t0 - 9 * GUN, kisi: 266 }, { urun: "p55", t: t0 - 14 * GUN, kisi: 261 }], bildirimSiklik: "aninda"
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(ANAHTAR)); } catch (e) { S = null; }
  if (!S || S.v !== 4) S = tohum();
  SP.S = S;
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(S)); } catch (e) {} }
  SP.sifirla = function () { try { localStorage.removeItem(ANAHTAR); } catch (e) {} location.hash = "#/"; location.reload(); };

  SP.hesap = function () { return S.hesap; };
  SP.kurumsal = function () { return S.hesap === "kurumsal"; };
  SP.benimFirma = function () { return S.hesap === "kurumsal" ? V.KISI.kurumsal.firma : null; };
  SP.kisi = function () { return S.hesap === "kurumsal" ? V.KISI.kurumsal : V.KISI.bireysel; };
  SP.setHesap = function (h) {
    if (h !== "bireysel" && h !== "kurumsal") return;
    S.hesap = h; kaydet(); SP.ciz(true);
    SP.toast(h === "kurumsal" ? "Kurumsal hesap (demo)" : "Bireysel hesap (demo)", h === "kurumsal" ? "Toroslu Mobilya olarak geziyorsunuz: teklif, alım talebi ve satıcı paneli açık." : "Selin Arıkan olarak geziyorsunuz: ücretsiz hesap, 3 ilan hakkı. Teklif butonları yükseltme uyarısı verir.", "bilgi");
  };

  /* ---------- ürün ---------- */
  function birlestir(b) {
    var o = S.urun[b.id] || {}, p = {};
    for (var k in b) p[k] = b[k];
    for (var j in o) p[j] = o[j];
    if (!p.t) p.t = S.t0 - p.gun * GUN;
    if (p.durum !== "aktif" && !p.satisT) p.satisT = S.t0 - p.satisSaat * SAAT;
    if (p.durum === "satildi" && (p.pasifT || Date.now() - p.satisT > 3 * GUN)) p.durum = "arsiv";
    return p;
  }
  SP.tumUrun = function () { return S.yeni.concat(V.URUN).map(birlestir); };
  SP.urun = function (id) { var l = SP.tumUrun(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; };
  SP.esik = function (p) { return p.hemenAl > 0 ? Math.round(p.fiyat * (1 - p.hemenAl / 100) * 100) / 100 : null; };
  SP.liste = function (o) {
    o = o || {};
    var q = (o.q || "").toLocaleLowerCase("tr").trim();
    var l = SP.tumUrun().filter(function (p) {
      if (o.durum === "arsiv") { if (p.durum !== "arsiv") return false; }
      else if (o.durum === "aktif") { if (p.durum !== "aktif") return false; }
      else if (o.durum === "satildi") { if (p.durum !== "satildi") return false; }
      else if (p.durum === "arsiv") return false;
      if (o.kat && o.kat.length && (typeof o.kat === "string" ? p.kat !== o.kat : o.kat.indexOf(p.kat) < 0)) return false;
      if (o.firma && p.firma !== o.firma) return false;
      if (o.hemenAl && !(p.hemenAl > 0 && p.durum === "aktif")) return false;
      if (q) { var f = FIR[p.firma]; var hay = (p.ad + " " + p.kod + " " + p.barkod + " " + (f ? f.ad : "") + " " + KAT[p.kat].ad).toLocaleLowerCase("tr"); if (hay.indexOf(q) < 0) return false; }
      return true;
    });
    var s = o.sirala || "yeni";
    l.sort(function (a, b) {
      if (s === "ucuz") return a.fiyat - b.fiyat;
      if (s === "pahali") return b.fiyat - a.fiyat;
      if (s === "teklif") return b.teklifSay - a.teklifSay;
      if (s === "satis") return (b.satisT || 0) - (a.satisT || 0);
      return b.t - a.t;
    });
    if (o.limit) l = l.slice(0, o.limit);
    return l;
  };
  SP.sayac = function (katId) { return SP.liste({ kat: katId }).length; };
  SP.sonFirmalar = function (n, kat) {
    return V.FIRMA.filter(function (f) { return !kat || !kat.length || f.kat.some(function (k) { return kat.indexOf(k) >= 0; }); })
      .slice().sort(function (a, b) { return a.katildi - b.katildi; }).slice(0, n || 30);
  };
  SP.firmaUrunSay = function (fid) { return SP.liste({ firma: fid }).length; };

  /* ---------- biçim ---------- */
  var NF = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
  SP.sayi = function (n) { return NF.format(n); };
  SP.tl = function (n) { return "₺" + NF.format(n); };
  SP.once = function (t) {
    var d = Date.now() - t;
    if (d < DK) return "az önce";
    if (d < SAAT) return Math.floor(d / DK) + " dk önce";
    if (d < GUN) return Math.floor(d / SAAT) + " sa önce";
    if (d < 30 * GUN) return Math.floor(d / GUN) + " gün önce";
    return Math.floor(d / (30 * GUN)) + " ay önce";
  };
  SP.kalan = function (ms) {
    if (ms <= 0) return "süre doldu";
    var g = Math.floor(ms / GUN), s = Math.floor(ms % GUN / SAAT), d = Math.floor(ms % SAAT / DK), sn = Math.floor(ms % DK / 1000);
    return (g ? g + "g " : "") + s + "s " + ("0" + d).slice(-2) + "dk " + ("0" + sn).slice(-2) + "sn";
  };
  SP.bas = function (ad) {
    var at = { "ve": 1, "ltd.": 1, "şti.": 1, "san.": 1, "tic.": 1, "a.ş.": 1, "&": 1 };
    var w = ad.split(/\s+/).filter(function (x) { return !at[x.toLocaleLowerCase("tr")]; });
    return ((w[0] || "?")[0] + ((w[1] || "")[0] || "")).toLocaleUpperCase("tr");
  };
  function karis(hex, hedef, t) {
    var a = parseInt(hex.slice(1), 16), b = parseInt(hedef.slice(1), 16);
    var r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t), g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t), bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  SP.karis = karis;

  /* ---------- simgeler ---------- */
  function disli() {
    var p = "", n = 9, R = 23, r = 17.5;
    for (var i = 0; i < n * 4; i++) {
      var a = (i / (n * 4)) * Math.PI * 2, rr = (i % 4 === 0 || i % 4 === 1) ? R : r;
      p += (i ? "L" : "M") + (32 + rr * Math.cos(a)).toFixed(1) + " " + (32 + rr * Math.sin(a)).toFixed(1);
    }
    return '<path d="' + p + 'Z"/><circle cx="32" cy="32" r="7" fill="none"/>';
  }
  var IK = {
    cuval: '<path d="M22 12h20l-3 7c7 4 11 13 11 23 0 9-7 12-18 12S14 51 14 42c0-10 4-19 11-23z"/><path d="M25 19h14" fill="none"/><path d="M24 36h16M26 42h12" fill="none" opacity=".55"/>',
    teneke: '<rect x="17" y="13" width="30" height="41" rx="3"/><path d="M17 20h30" fill="none"/><rect x="22" y="27" width="20" height="16" rx="1.5" fill="none"/><circle cx="40" cy="16.5" r="2" fill="none"/>',
    kavanoz: '<rect x="21" y="9" width="22" height="7" rx="2"/><path d="M19 16h26c2 0 4 2 4 5v28c0 3-2 5-5 5H20c-3 0-5-2-5-5V21c0-3 2-5 4-5z"/><rect x="20" y="28" width="24" height="13" rx="1.5" fill="none"/>',
    koli: '<path d="M10 23l22-10 22 10v23L32 56 10 46z"/><path d="M10 23l22 10 22-10M32 33v23" fill="none"/><path d="M21 18l22 10v7" fill="none"/>',
    balik: '<path d="M8 32c9-11 24-13 36-4l10-7v22l-10-7c-12 9-27 7-36-4z"/><circle cx="18" cy="30" r="1.8"/><path d="M28 25c2 4 2 10 0 14" fill="none"/>',
    komodin: '<rect x="14" y="14" width="36" height="34" rx="2"/><path d="M14 31h36" fill="none"/><path d="M29 22h6M29 39h6" fill="none"/><path d="M17 48v5M47 48v5" fill="none"/>',
    koltuk: '<path d="M22 10h20c2 0 3 1 3 3l-2 18H21l-2-18c0-2 1-3 3-3z"/><path d="M16 31h32c1 0 2 1 2 2v3c0 1-1 2-2 2H16c-1 0-2-1-2-2v-3c0-1 1-2 2-2z"/><path d="M32 38v9M20 54l12-7 12 7M32 47v7" fill="none"/><circle cx="20" cy="55" r="1.5"/><circle cx="44" cy="55" r="1.5"/><circle cx="32" cy="56" r="1.5"/>',
    masa: '<rect x="8" y="22" width="48" height="6" rx="1.5"/><path d="M13 28v24M51 28v24M18 28v14h28V28" fill="none"/>',
    sandalye: '<path d="M20 10h22v22H20z"/><path d="M18 32h28v6H18z"/><path d="M20 38v16M44 38v16M20 46h24" fill="none"/>',
    mentese: '<circle cx="22" cy="32" r="11"/><circle cx="22" cy="32" r="5" fill="none"/><rect x="33" y="24" width="22" height="16" rx="3"/><circle cx="40" cy="32" r="1.6"/><circle cx="48" cy="32" r="1.6"/>',
    kanepe: '<path d="M12 26c0-4 3-6 6-6h28c3 0 6 2 6 6v8H12z"/><path d="M8 32c0-2 1-4 4-4s4 2 4 4v4h32v-4c0-2 1-4 4-4s4 2 4 4v14H8z"/><path d="M12 46v5M52 46v5" fill="none"/>',
    lastik: '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="11" fill="none"/><circle cx="32" cy="32" r="4"/><path d="M32 10v6M32 48v6M10 32h6M48 32h6M16.4 16.4l4.3 4.3M43.3 43.3l4.3 4.3M16.4 47.6l4.3-4.3M43.3 20.7l4.3-4.3" fill="none"/>',
    balata: '<circle cx="30" cy="34" r="19"/><circle cx="30" cy="34" r="6" fill="none"/><path d="M40 12c9 3 15 12 15 22s-6 19-15 22l-3-7c6-2 10-8 10-15s-4-13-10-15z"/>',
    aku: '<rect x="9" y="20" width="46" height="32" rx="3"/><rect x="15" y="14" width="8" height="6" rx="1"/><rect x="41" y="14" width="8" height="6" rx="1"/><path d="M16 33h6M19 30v6M42 33h6" fill="none"/><path d="M9 27h46" fill="none" opacity=".5"/>',
    silecek: '<path d="M8 50C16 26 40 14 56 14" fill="none"/><path d="M10 52l4-6M18 41l4-5M27 31l4-4M37 23l5-3M48 17l5-2" fill="none"/><circle cx="8" cy="50" r="3"/>',
    bidon: '<path d="M18 18h22l8 8v26c0 2-1 3-3 3H19c-2 0-3-1-3-3V20c0-1 1-2 2-2z"/><rect x="22" y="10" width="10" height="8" rx="1.5"/><rect x="21" y="30" width="20" height="14" rx="1.5" fill="none"/>',
    ampul: '<path d="M32 8c-10 0-17 7-17 16 0 6 3 10 7 14 2 2 3 4 3 7h14c0-3 1-5 3-7 4-4 7-8 7-14 0-9-7-16-17-16z"/><path d="M25 50h14M26 55h12" fill="none"/><path d="M28 30l4 6 4-6" fill="none"/>',
    krem: '<path d="M20 8h24l-2 34H22z"/><rect x="26" y="42" width="12" height="7" rx="1"/><rect x="28" y="49" width="8" height="7" rx="1.5"/><path d="M24 18h16M25 26h14" fill="none" opacity=".55"/>',
    sabun: '<rect x="10" y="26" width="38" height="24" rx="8"/><path d="M16 34c4-2 10-2 14 0" fill="none" opacity=".55"/><circle cx="48" cy="18" r="5" fill="none"/><circle cx="56" cy="28" r="3" fill="none"/><circle cx="40" cy="14" r="2.5" fill="none"/>',
    sise: '<rect x="27" y="7" width="10" height="7" rx="1.5"/><path d="M28 14h8v6c5 2 8 6 8 11v20c0 3-2 5-5 5H25c-3 0-5-2-5-5V31c0-5 3-9 8-11z"/><rect x="23" y="33" width="18" height="14" rx="1.5" fill="none"/>',
    pres: '<path d="M12 8h40v8H12zM14 16h6v32h-6zM44 16h6v32h-6z"/><rect x="24" y="16" width="16" height="12" rx="1"/><path d="M32 28v6" fill="none"/><rect x="22" y="34" width="20" height="4" rx="1"/><path d="M8 48h48v6H8z"/>',
    disli: disli(),
    silindir: '<rect x="6" y="24" width="34" height="16" rx="3"/><rect x="40" y="29" width="14" height="6" rx="1"/><circle cx="57" cy="32" r="3"/><path d="M14 24v16M32 24v16" fill="none"/>',
    mikser: '<path d="M14 30h30l-3 18H17z"/><path d="M44 30V12H22v6" fill="none"/><path d="M28 18v16" fill="none"/><path d="M12 48h36v6H12z"/><circle cx="50" cy="20" r="3" fill="none"/>',
    pulverizator: '<rect x="12" y="16" width="32" height="24" rx="10"/><rect x="24" y="10" width="8" height="6" rx="1"/><circle cx="20" cy="46" r="7"/><circle cx="20" cy="46" r="2"/><path d="M44 28h12M50 22v12M8 40h4" fill="none"/>',
    kumas: '<path d="M18 16h30c4 0 8 7 8 16s-4 16-8 16H18"/><ellipse cx="18" cy="32" rx="8" ry="16"/><ellipse cx="18" cy="32" rx="3" ry="6" fill="none"/><path d="M48 48v8H26" fill="none"/>',
    havlu: '<rect x="10" y="40" width="44" height="12" rx="4"/><rect x="13" y="28" width="38" height="12" rx="4"/><rect x="16" y="16" width="32" height="12" rx="4"/><path d="M16 46h32M19 34h26M22 22h20" fill="none" opacity=".5"/>',
    tisort: '<path d="M24 10l-14 7 5 11 6-3v29h22V25l6 3 5-11-14-7c-1 4-4 6-8 6s-7-2-8-6z"/><path d="M28 12l4 6 4-6" fill="none"/>',
    film: '<path d="M44 14H18c-5 0-9 8-9 18s4 18 9 18h26"/><ellipse cx="44" cy="32" rx="9" ry="18"/><ellipse cx="44" cy="32" rx="3" ry="6" fill="none"/><path d="M53 32h7" fill="none"/>',
    palet: '<path d="M6 26h52v6H6zM6 44h52v6H6z"/><rect x="9" y="32" width="8" height="12"/><rect x="28" y="32" width="8" height="12"/><rect x="47" y="32" width="8" height="12"/><path d="M6 20h52" fill="none"/>',
    torba: '<path d="M14 22h36l3 32H11z"/><path d="M24 22v-5c0-5 4-8 8-8s8 3 8 8v5" fill="none"/><path d="M20 30h24" fill="none" opacity=".5"/>',
    kablo: '<circle cx="28" cy="32" r="18"/><circle cx="28" cy="32" r="11" fill="none"/><circle cx="28" cy="32" r="4"/><path d="M46 32c6 0 10 4 10 10v8" fill="none"/><path d="M54 50h4v6h-4z"/>',
    panel: '<rect x="10" y="10" width="44" height="44" rx="3"/><rect x="16" y="16" width="32" height="32" rx="1" fill="none"/><path d="M32 16v32M16 32h32" fill="none" opacity=".5"/>',
    sigorta: '<rect x="18" y="8" width="28" height="48" rx="3"/><rect x="25" y="22" width="14" height="18" rx="2" fill="none"/><path d="M32 26v8" fill="none"/><path d="M24 14h16M24 50h16" fill="none" opacity=".6"/>',
    seramik: '<path d="M8 44l24-12 24 12-24 12z"/><path d="M8 30l24-12 24 12-24 12z"/><path d="M20 24l24 12M44 24L20 36" fill="none" opacity=".5"/>',
    kapi: '<rect x="16" y="6" width="32" height="52" rx="1.5"/><rect x="21" y="12" width="22" height="18" rx="1" fill="none"/><rect x="21" y="34" width="22" height="18" rx="1" fill="none"/><circle cx="43" cy="33" r="1.8"/>',
    baslik: '<path d="M8 40V20c0-4 3-6 6-6h36c3 0 6 2 6 6v20z"/><path d="M14 22h36v14H14z" fill="none" opacity=".6"/><path d="M6 40h52v8H6z"/><path d="M10 48v6M54 48v6" fill="none"/>',
    kamyon: '<path d="M4 18h34v26H4z"/><path d="M38 26h12l8 9v9H38z"/><circle cx="14" cy="47" r="5"/><circle cx="48" cy="47" r="5"/><path d="M42 30h7l4 5H42z" fill="none"/>',
    raf: '<path d="M8 8v50M56 8v50M8 22h48M8 38h48M8 54h48" fill="none"/><rect x="12" y="12" width="12" height="10"/><rect x="26" y="14" width="10" height="8"/><rect x="40" y="28" width="12" height="10"/><rect x="13" y="30" width="10" height="8"/><rect x="28" y="44" width="14" height="10"/>',
    ekip: '<circle cx="20" cy="22" r="6"/><circle cx="44" cy="22" r="6"/><circle cx="32" cy="18" r="7"/><path d="M8 50c0-8 5-14 12-14s12 6 12 14zM32 50c0-8 5-14 12-14s12 6 12 14z"/><path d="M18 52c0-9 6-16 14-16s14 7 14 16z"/>'
  };
  SP.IK = IK;
  SP.simge = function (ad, renk, dolgu, kalin) {
    return '<g fill="' + (dolgu || "#fff") + '" stroke="' + renk + '" stroke-width="' + (kalin || 2.2) + '" stroke-linejoin="round" stroke-linecap="round">' + (IK[ad] || IK.koli) + "</g>";
  };
  /* ürün görseli: kategori renginde stüdyo çekimi hissi veren SVG */
  SP.gorsel = function (p, tema) {
    var k = KAT[p.kat], c = k.renk, n = parseInt(String(p.id).replace(/\D/g, ""), 10) || 1, koyu = tema === "koyu";
    var zemin = koyu ? karis(c, "#0b0f16", 0.86) : karis(c, "#ffffff", 0.86);
    var zemin2 = koyu ? karis(c, "#0b0f16", 0.74) : karis(c, "#ffffff", 0.74);
    var cx = 70 + (n * 53) % 260, cy = 40 + (n * 31) % 60;
    var ink = koyu ? karis(c, "#ffffff", 0.25) : karis(c, "#000000", 0.25);
    var dol = koyu ? karis(c, "#0b0f16", 0.6) : "#ffffff";
    var don = (n % 5) * 3 - 6;
    return '<svg class="sp-img" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(p.ad) + '">' +
      '<rect width="400" height="300" fill="' + zemin + '"/>' +
      '<path d="M0 205 L400 185 L400 300 L0 300Z" fill="' + zemin2 + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="120" fill="' + c + '" opacity="' + (koyu ? 0.16 : 0.08) + '"/>' +
      '<circle cx="' + (400 - cx / 2) + '" cy="250" r="70" fill="' + c + '" opacity="' + (koyu ? 0.1 : 0.06) + '"/>' +
      '<ellipse cx="200" cy="236" rx="96" ry="12" fill="#000" opacity="' + (koyu ? 0.35 : 0.1) + '"/>' +
      '<g transform="translate(200 145) rotate(' + don + ') scale(2.7) translate(-32 -32)">' + SP.simge(p.ikon, ink, dol, 1.9) + "</g>" +
      '<text x="386" y="288" text-anchor="end" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="12" letter-spacing="1" fill="' + ink + '" opacity=".55">' + esc(p.kod) + "</text>" +
      "</svg>";
  };
  SP.logo = function (f, boy) {
    boy = boy || 48; var c = KAT[f.kat[0]].renk, v = f.no % 3, b = SP.bas(f.ad), c2 = karis(c, "#000000", 0.3);
    var sekil = v === 0 ? '<rect width="64" height="64" rx="14" fill="' + c + '"/>' : v === 1 ? '<circle cx="32" cy="32" r="32" fill="' + c2 + '"/>' : '<rect width="64" height="64" rx="6" fill="' + c2 + '"/><path d="M0 46 L64 30 V64 H0Z" fill="' + c + '"/>';
    return '<svg class="sp-logo" width="' + boy + '" height="' + boy + '" viewBox="0 0 64 64" role="img" aria-label="' + esc(f.ad) + ' logosu">' + sekil +
      '<text x="32" y="41" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="' + (b.length > 1 ? 23 : 28) + '" fill="#fff" letter-spacing="-.5">' + esc(b) + "</text></svg>";
  };
  SP.banner = function (f) {
    var c = KAT[f.kat[0]].renk, d = karis(c, "#0b0f16", 0.55), ik = KAT[f.kat[0]].ikon, s = "";
    for (var i = 0; i < 9; i++) s += '<g transform="translate(' + (60 + i * 140) + " " + (i % 2 ? 40 : 120) + ') scale(1.6)" opacity=".13">' + SP.simge(i % 3 === 1 ? "koli" : i % 3 === 2 ? "kamyon" : ik, "#fff", "none", 1.6) + "</g>";
    return '<svg class="sp-banner" viewBox="0 0 1400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="1400" height="260" fill="' + d + '"/><circle cx="1150" cy="60" r="260" fill="' + c + '" opacity=".45"/><circle cx="200" cy="300" r="200" fill="' + c + '" opacity=".25"/>' + s + "</svg>";
  };
  var TANITIM = [["Üretim alanı", "disli"], ["Depo ve stok", "raf"], ["Showroom", null], ["Sevkiyat", "kamyon"], ["Ekibimiz", "ekip"]];
  SP.tanitimAd = function (i) { return TANITIM[i][0]; };
  SP.tanitim = function (f, i) {
    var c = KAT[f.kat[0]].renk, t = TANITIM[i], ik = t[1] || KAT[f.kat[0]].ikon;
    var z = karis(c, "#ffffff", 0.8 - i * 0.05), z2 = karis(c, "#000000", 0.15);
    return '<svg class="sp-img" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(t[0]) + '"><rect width="400" height="300" fill="' + z + '"/>' +
      '<path d="M0 220 L400 200 L400 300 L0 300Z" fill="' + karis(c, "#ffffff", 0.68) + '"/><circle cx="' + (80 + i * 60) + '" cy="60" r="110" fill="' + c + '" opacity=".1"/>' +
      '<g transform="translate(200 140) scale(2.4) translate(-32 -32)">' + SP.simge(ik, z2, "#fff", 2) + "</g>" +
      '<rect x="14" y="252" width="' + (t[0].length * 8.6 + 22) + '" height="32" rx="16" fill="#fff" opacity=".92"/><text x="25" y="273" font-family="system-ui,Segoe UI,Arial" font-weight="700" font-size="14" fill="' + z2 + '">' + esc(t[0]) + "</text></svg>";
  };
  /* EAN-13 barkod */
  var L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
  var R = L.map(function (x) { return x.replace(/./g, function (b) { return b === "1" ? "0" : "1"; }); });
  var G = R.map(function (x) { return x.split("").reverse().join(""); });
  var PAR = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
  SP.barkod = function (k, renk) {
    renk = renk || "#111"; var d = k.split("").map(Number), bit = "101", par = PAR[d[0]];
    for (var i = 1; i <= 6; i++) bit += (par[i - 1] === "L" ? L : G)[d[i]];
    bit += "01010"; for (var j = 7; j <= 12; j++) bit += R[d[j]]; bit += "101";
    var s = "", x = 11;
    for (var b = 0; b < bit.length; b++) { if (bit[b] === "1") { var uzun = b < 3 || (b >= 45 && b < 50) || b >= 92; s += '<rect x="' + (x + b) + '" y="2" width="1" height="' + (uzun ? 46 : 40) + '"/>'; } }
    var yz = '<text x="4" y="56">' + k[0] + '</text><text x="' + (x + 24) + '" y="56" text-anchor="middle">' + k.slice(1, 7) + '</text><text x="' + (x + 70) + '" y="56" text-anchor="middle">' + k.slice(7) + "</text>";
    return '<svg class="sp-barkod" viewBox="0 0 118 60" role="img" aria-label="Barkod ' + k + '"><g fill="' + renk + '">' + s + '</g><g fill="' + renk + '" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="8.5">' + yz + "</g></svg>";
  };

  /* arayüz simgeleri (24'lük) */
  var UI = {
    ara: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    paylas: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    wa: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.3c.1 3.6 2.9 6.6 6.6 6.9l1.1-1.5-1.9-1.1-1 .8a4.6 4.6 0 0 1-2.4-2.4l.8-1L11.1 8z" fill="currentColor" stroke="none"/>',
    ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
    x: '<path d="M4 4h4.5L20 20h-4.5zM19.5 4l-6.4 7.2M4.5 20l6.4-7.2"/>',
    fb: '<path d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.5V11H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"/>',
    li: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3"/>',
    yt: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    ev: '<path d="M3.5 11L12 4l8.5 7M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    izgara: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    arti: '<path d="M12 5v14M5 12h14"/>',
    zil: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    kisi: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    sag: '<path d="M9 5l7 7-7 7"/>',
    sol: '<path d="M15 5l-7 7 7 7"/>',
    kalp: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    filtre: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    liste: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.1M4 12h.1M4 18h.1"/>',
    kapat: '<path d="M6 6l12 12M18 6L6 18"/>',
    saat: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    simsek: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    etiket: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.5"/>',
    kalkan: '<path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    mesaj: '<path d="M4 5h16v11H9l-5 4z"/>',
    grafik: '<path d="M4 20V4M4 20h16"/><path d="M7 15l4-4 3 3 5-6"/>',
    kilit: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4c0 .6-.4 1-1 1A16 16 0 0 1 4 5c0-.6.4-1 1-1z"/>',
    konum: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    yukari: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    goz: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    kopya: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    kutu: '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 11.5l8.5-4M12 11.5v9"/>'
  };
  SP.ui = function (ad, boy, sinif) {
    return '<svg class="sp-ui ' + (sinif || "") + '" width="' + (boy || 18) + '" height="' + (boy || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (UI[ad] || "") + "</svg>";
  };
  SP.tikRozet = function (ok, metin) {
    return ok ? '<span class="sp-dogru" title="Doğrulandı">' + SP.ui("tik", 13) + (metin ? " " + metin : "") + "</span>" : '<span class="sp-dogru hayir" title="Doğrulanmadı">doğrulanmadı</span>';
  };
  SP.firmaOk = function (f) { return f.telOk && f.epostaOk; };

  /* ---------- bildirim ve pencere ---------- */
  function kutu() {
    var k = document.getElementById("sp-toastlar");
    if (!k) { k = document.createElement("div"); k.id = "sp-toastlar"; k.setAttribute("aria-live", "polite"); document.body.appendChild(k); }
    return k;
  }
  SP.toast = function (baslik, metin, tur, eylem) {
    var t = document.createElement("div");
    t.className = "sp-toast " + (tur || "");
    t.innerHTML = '<div class="sp-toast-i">' + SP.ui(tur === "ok" ? "tik" : tur === "mail" ? "mail" : tur === "uyari" ? "saat" : "zil", 18) + '</div><div class="sp-toast-m"><b>' + esc(baslik) + "</b>" + (metin ? "<span>" + metin + "</span>" : "") + (eylem || "") + '</div><button class="sp-toast-x" aria-label="Kapat">' + SP.ui("kapat", 14) + "</button>";
    kutu().appendChild(t);
    var kapat = function () { t.classList.add("cik"); setTimeout(function () { t.remove(); }, 300); };
    t.querySelector(".sp-toast-x").onclick = kapat;
    setTimeout(kapat, tur === "mail" ? 11000 : 7000);
    return t;
  };
  var acikModal = null;
  SP.modal = function (html, sinif) {
    SP.kapat();
    var ov = document.createElement("div");
    ov.className = "sp-ov";
    ov.innerHTML = '<div class="sp-modal ' + (sinif || "") + '" role="dialog" aria-modal="true"><button class="sp-modal-x" data-kapat aria-label="Kapat">' + SP.ui("kapat", 18) + "</button>" + html + "</div>";
    ov.addEventListener("click", function (e) { if (e.target === ov || e.target.closest("[data-kapat]")) SP.kapat(); });
    document.body.appendChild(ov);
    document.body.classList.add("sp-kilit");
    requestAnimationFrame(function () { ov.classList.add("acik"); });
    acikModal = ov;
    var ilk = ov.querySelector("input,textarea,select");
    if (ilk && window.innerWidth > 700) setTimeout(function () { ilk.focus(); }, 60);
    return ov.querySelector(".sp-modal");
  };
  SP.kapat = function () { if (acikModal) { acikModal.remove(); acikModal = null; document.body.classList.remove("sp-kilit"); } };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") SP.kapat(); });

  function urunBas(p) {
    var f = FIR[p.firma];
    return '<div class="sp-m-urun"><div class="sp-m-img">' + SP.gorsel(p) + '</div><div><b>' + esc(p.ad) + "</b><small>" + esc(f.ad) + " · " + esc(p.kod) + '</small><div class="sp-m-fiyat">' + SP.tl(p.fiyat) + " <small>/ " + esc(p.birim) + "</small></div><small>Stok: " + SP.sayi(p.stok) + " " + esc(p.birim) + " · En az " + SP.sayi(p.min) + "</small></div></div>";
  }
  SP.yukselt = function (ne) {
    var m = SP.modal('<div class="sp-m-ikon kilit">' + SP.ui("kilit", 26) + '</div><h3>Bu özellik kurumsal hesaplarda açık</h3><p class="sp-m-p">' + esc(ne || "Teklif verme ve alım talebi") + " ücretli kurumsal paketlerde kullanılabilir. <b>Hesabınızı yükselterek bu özelliği kullanabilirsiniz.</b></p>" +
      '<ul class="sp-m-liste"><li>' + SP.ui("tik", 15) + "Ürünlere teklif verme ve alım talebi</li><li>" + SP.ui("tik", 15) + "Hemen Al eşiğiyle otomatik satış</li><li>" + SP.ui("tik", 15) + "Firma sayfası, logo, banner ve 5 tanıtım resmi</li><li>" + SP.ui("tik", 15) + "Kategorideki üyelere e-posta ile ürün duyurusu</li></ul>" +
      '<div class="sp-m-btns"><a class="sp-btn" href="#/paketler" data-kapat>Paketleri incele</a><button class="sp-btn ghost" data-hesap-sec="kurumsal" data-kapat>Demoda kurumsala geç</button></div>', "dar");
    return m;
  };
  SP.teklifPenceresi = function (pid, hazirFiyat) {
    var p = SP.urun(pid); if (!p) return;
    if (!SP.kurumsal()) return SP.yukselt("Teklif verme özelliği");
    if (p.firma === SP.benimFirma()) { SP.toast("Bu sizin ilanınız", "Kendi ilanınıza teklif veremezsiniz. Gelen teklifleri satıcı panelinden yönetin.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=teklifler">Satıcı paneli →</a>'); return; }
    if (p.durum !== "aktif") return SP.talepPenceresi(pid);
    var esik = SP.esik(p), ilk = hazirFiyat || Math.round(p.fiyat * 0.94);
    var m = SP.modal('<h3>Teklif ver</h3>' + urunBas(p) +
      '<div class="sp-m-grid"><label>Teklif fiyatı <small>(birim, TL)</small><input type="number" inputmode="decimal" step="0.01" min="0" id="spTF" value="' + ilk + '"></label>' +
      '<label>Adet / miktar <small>(' + esc(p.birim) + ')</small><input type="number" inputmode="numeric" min="' + p.min + '" max="' + p.stok + '" id="spTA" value="' + p.min + '"></label></div>' +
      '<div class="sp-m-hizli"><span>Hızlı:</span>' + [3, 5, 8, 10, 12].map(function (y) { return '<button type="button" data-y="' + y + '">-%' + y + "</button>"; }).join("") + "</div>" +
      '<div class="sp-m-sonuc" id="spTS"></div><div class="sp-m-top" id="spTT"></div>' +
      '<button class="sp-btn tam" id="spTG">Teklifi gönder</button><p class="sp-m-not">Teklif bağlayıcıdır. Ödeme ve sevkiyat satıcıyla doğrudan, faturalı yapılır; sitede ödeme alınmaz.</p>');
    var tf = m.querySelector("#spTF"), ta = m.querySelector("#spTA"), ts = m.querySelector("#spTS"), tt = m.querySelector("#spTT");
    function guncel() {
      var f = parseFloat(tf.value) || 0, a = parseInt(ta.value, 10) || 0, fark = p.fiyat ? (1 - f / p.fiyat) * 100 : 0;
      tt.innerHTML = "Toplam: <b>" + SP.tl(Math.round(f * a * 100) / 100) + "</b> <span>(" + SP.sayi(a) + " " + esc(p.birim) + " × " + SP.tl(f) + (fark > 0 ? " · liste fiyatından %" + SP.sayi(Math.round(fark * 10) / 10) + " düşük" : "") + ")</span>";
      if (!esik) { ts.className = "sp-m-sonuc onay"; ts.innerHTML = SP.ui("saat", 18) + "<div><b>Bu ilanda Hemen Al yok.</b> Teklifiniz satıcının onayına gider.</div>"; }
      else if (f >= esik && f <= p.fiyat) { ts.className = "sp-m-sonuc ok"; ts.innerHTML = SP.ui("simsek", 18) + "<div><b>Hemen Al eşiği içinde (" + SP.tl(esik) + " ve üstü).</b> Gönderdiğiniz anda ürün size satılır.</div>"; }
      else if (f > p.fiyat) { ts.className = "sp-m-sonuc hata"; ts.innerHTML = SP.ui("kapat", 18) + "<div>Teklif liste fiyatını (" + SP.tl(p.fiyat) + ") geçemez.</div>"; }
      else { ts.className = "sp-m-sonuc onay"; ts.innerHTML = SP.ui("saat", 18) + "<div><b>Eşiğin altında.</b> Hemen Al eşiği " + SP.tl(esik) + " (%" + p.hemenAl + "). Bu teklif satıcı onayına gider.</div>"; }
    }
    tf.oninput = ta.oninput = guncel;
    m.querySelectorAll("[data-y]").forEach(function (b) { b.onclick = function () { tf.value = Math.round(p.fiyat * (1 - b.dataset.y / 100) * 100) / 100; guncel(); }; });
    m.querySelector("#spTG").onclick = function () { SP.teklifVer(pid, parseFloat(tf.value), parseInt(ta.value, 10)); };
    guncel();
  };
  SP.teklifVer = function (pid, fiyat, adet) {
    var p = SP.urun(pid);
    if (!SP.kurumsal()) return SP.yukselt();
    if (!(fiyat > 0)) return SP.toast("Teklif fiyatı girin", "Birim fiyat sıfırdan büyük olmalı.", "uyari");
    if (fiyat > p.fiyat) return SP.toast("Teklif liste fiyatını geçemez", "Liste fiyatı " + SP.tl(p.fiyat) + ".", "uyari");
    if (!(adet >= p.min)) return SP.toast("Miktar en az " + SP.sayi(p.min) + " " + p.birim + " olmalı", "", "uyari");
    if (adet > p.stok) return SP.toast("Stoktan fazla miktar", "Bu ilanda en fazla " + SP.sayi(p.stok) + " " + p.birim + " var.", "uyari");
    var esik = SP.esik(p), f = FIR[p.firma], ben = FIR[SP.benimFirma()], simdi = Date.now();
    SP.kapat();
    if (esik && fiyat >= esik) {
      S.urun[pid] = { durum: "satildi", satisT: simdi, alici: ben.id, satisFiyat: fiyat, satisAdet: adet };
      S.verilen.unshift({ id: "v" + simdi, urun: pid, fiyat: fiyat, adet: adet, t: simdi, durum: "kabul-otomatik", mesaj: "" });
      kaydet(); SP.ciz(true);
      SP.toast("Satın alındı: Hemen Al eşiği içinde", esc(p.ad) + " · " + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + ". Ürün artık SATILDI etiketiyle listede.", "ok");
      SP.epostaGonder([
        { kime: ben.yetkili + " <" + ben.eposta + ">", rol: "Alıcıya", konu: "Satın alma onaylandı · " + p.ad, govde: ["Sayın " + ben.yetkili + ",", f.ad + " firmasının <b>" + esc(p.ad) + "</b> ilanına verdiğiniz teklif Hemen Al eşiği içinde olduğu için otomatik olarak kabul edildi.", "<b>" + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + " = " + SP.tl(Math.round(adet * fiyat * 100) / 100) + "</b> (KDV ve nakliye satıcıyla netleştirilir)", "Satıcı yetkilisi: " + f.yetkili + " · " + f.tel + " · " + f.eposta, "Ödeme ve sevkiyatı satıcıyla doğrudan planlayın."] },
        { kime: f.yetkili + " <" + f.eposta + ">", rol: "Satıcıya", konu: "İlanınız satıldı · " + p.ad, govde: ["Sayın " + f.yetkili + ",", "<b>" + esc(p.ad) + "</b> ilanınız Hemen Al eşiği içinde gelen teklifle " + ben.ad + " firmasına satıldı.", "<b>" + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + "</b>", "Alıcı yetkilisi: " + ben.yetkili + " · " + ben.tel, "Hatırlatma: ilanınızı 3 gün içinde pasife almazsanız sistem otomatik olarak yayından kaldırır."] }
      ]);
    } else {
      var kayit = { id: "v" + simdi, urun: pid, fiyat: fiyat, adet: adet, t: simdi, durum: "bekliyor", mesaj: "" };
      S.verilen.unshift(kayit); kaydet(); SP.ciz(true);
      SP.toast("Teklifiniz satıcı onayına gönderildi", esc(f.ad) + " teklifinizi kabul ya da reddedebilir. Satıcıya e-posta bildirimi gitti.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=verilen">Verdiğim teklifler →</a>');
      /* demo: satıcı birkaç saniye sonra karşı teklifle yanıt verir */
      setTimeout(function () {
        var karsi = esik || Math.round(p.fiyat * 0.96);
        var msj = "Merhaba " + ben.yetkili.split(" ")[0] + " Bey, " + SP.tl(fiyat) + " teklifiniz için teşekkürler. Bu fiyattan veremiyorum ama " + SP.tl(karsi) + "'den satabilirim. İlana bu fiyattan teklif verirseniz onaylarım.";
        S.verilen.forEach(function (v) { if (v.id === kayit.id) { v.durum = "reddedildi"; v.mesaj = msj; } });
        S.mesaj.kurumsal.unshift({ id: "m" + Date.now(), kim: f.id, konu: p.ad + " teklifiniz", t: Date.now(), okunmadi: true, akis: [["ben", SP.sayi(adet) + " " + p.birim + " için " + SP.tl(fiyat) + " teklif verdim."], ["o", msj]] });
        kaydet(); SP.ciz(true);
        SP.toast("Satıcı yanıt verdi (demo)", esc(f.ad) + ": “" + SP.tl(karsi) + "'den satabilirim.”", "mail", '<a class="sp-toast-a" href="#/hesabim?sekme=mesajlar">Mesajı oku →</a>');
      }, 7000);
    }
  };
  SP.talepPenceresi = function (pid) {
    var p = SP.urun(pid); if (!p) return;
    if (!SP.kurumsal()) return SP.yukselt("Alım talebi gönderme özelliği");
    if (p.firma === SP.benimFirma()) return SP.toast("Bu sizin ilanınız", "Gelen alım taleplerini satıcı panelinde görürsünüz.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=talepler">Alım talepleri →</a>');
    var m = SP.modal("<h3>Alım talebi gönder</h3><p class=\"sp-m-p\">Bu ürün satıldı. Aynı üründen almak istiyorsanız satıcıya miktarı ve istediğiniz fiyatı iletin; benzer stok ya da yeni üretim olduğunda size dönsün.</p>" + urunBas(p) +
      '<div class="sp-m-grid"><label>Ürün<input type="text" value="' + esc(p.ad) + '" readonly></label><label>Adet / kilo <small>(' + esc(p.birim) + ')</small><input type="number" id="spAA" value="' + p.min + '" min="1"></label><label>İstediğiniz birim fiyat <small>(TL)</small><input type="number" step="0.01" id="spAF" value="' + p.fiyat + '"></label><label class="genis">Not <small>(isteğe bağlı)</small><textarea id="spAN" rows="2" placeholder="Teslim yeri, termin, renk vb."></textarea></label></div>' +
      '<button class="sp-btn tam" id="spAG">Talebi gönder</button>');
    m.querySelector("#spAG").onclick = function () {
      var a = parseFloat(m.querySelector("#spAA").value), fy = parseFloat(m.querySelector("#spAF").value);
      if (!(a > 0) || !(fy > 0)) return SP.toast("Miktar ve fiyat girin", "", "uyari");
      S.gidenTalep.unshift({ id: "g" + Date.now(), urun: pid, adet: a, fiyat: fy, not: m.querySelector("#spAN").value, t: Date.now() });
      kaydet(); SP.kapat(); SP.ciz(true);
      SP.toast("Alım talebiniz iletildi", esc(FIR[p.firma].ad) + " talebinizi panelinde gördü; satıcıya e-posta bildirimi gönderildi.", "ok");
    };
  };
  SP.paylasLinkleri = function (p) {
    var url = location.href.split("#")[0] + "#/urun/" + p.id, metin = p.ad + " · " + SP.tl(p.fiyat) + "/" + p.birim + " · StokPazarı";
    var e = encodeURIComponent;
    return [
      ["wa", "WhatsApp", "https://wa.me/?text=" + e(metin + " " + url)],
      ["ig", "Instagram", "#ig"],
      ["x", "X", "https://x.com/intent/post?text=" + e(metin) + "&url=" + e(url)],
      ["fb", "Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + e(url)],
      ["mail", "E-posta", "mailto:?subject=" + e(metin) + "&body=" + e(url)]
    ];
  };
  SP.paylasHTML = function (p, etiketli) {
    return '<div class="sp-paylas"><span>' + SP.ui("paylas", 15) + " Paylaş</span>" + SP.paylasLinkleri(p).map(function (l) {
      return l[0] === "ig" ? '<button type="button" class="sp-pb ig" data-ig="' + p.id + '" title="Instagram">' + SP.ui("ig", 17) + (etiketli ? "<em>" + l[1] + "</em>" : "") + "</button>"
        : '<a class="sp-pb ' + l[0] + '" href="' + l[2] + '" target="_blank" rel="noopener" title="' + l[1] + '">' + SP.ui(l[0], 17) + (etiketli ? "<em>" + l[1] + "</em>" : "") + "</a>";
    }).join("") + "</div>";
  };
  SP.epostaGonder = function (liste) {
    S.sonEposta = liste; kaydet();
    SP.toast("Alıcıya ve satıcıya e-posta gönderildi", liste.map(function (x) { return x.rol + ": " + esc(x.konu); }).join("<br>"), "mail", '<button class="sp-toast-a" data-eposta-goster>E-postaları önizle →</button>');
  };
  SP.epostaOnizle = function (liste) {
    liste = liste || S.sonEposta || [];
    SP.modal("<h3>Gönderilen e-postalar (önizleme)</h3>" + liste.map(function (x) {
      return '<div class="sp-eposta"><div class="sp-eposta-bas"><span class="sp-rozet">' + esc(x.rol) + "</span><div><b>StokPazarı</b> &lt;bildirim@stokpazari.ornek&gt;<br><small>Kime: " + esc(x.kime) + '</small></div></div><div class="sp-eposta-konu">' + esc(x.konu) + '</div><div class="sp-eposta-govde">' + x.govde.map(function (g) { return "<p>" + g + "</p>"; }).join("") + "</div></div>";
    }).join(""), "genis");
  };

  /* ---------- satıcı eylemleri ---------- */
  function teklifBul(id) { for (var i = 0; i < S.teklif.length; i++) if (S.teklif[i].id === id) return S.teklif[i]; }
  SP.kabul = function (oid) {
    var o = teklifBul(oid), p = SP.urun(o.urun), f = FIR[o.firma], ben = FIR[SP.benimFirma()];
    o.durum = "kabul";
    S.teklif.forEach(function (x) { if (x.urun === o.urun && x.durum === "bekliyor") x.durum = "kapandi"; });
    S.urun[o.urun] = { durum: "satildi", satisT: Date.now(), alici: o.firma, satisFiyat: o.fiyat, satisAdet: o.adet };
    kaydet(); SP.ciz(true);
    SP.toast("Teklif kabul edildi, ürün SATILDI", esc(p.ad) + " · " + esc(f.ad) + " · " + SP.sayi(o.adet) + " × " + SP.tl(o.fiyat) + ". Pasife alma için 3 gün süre başladı.", "ok");
    SP.epostaGonder([
      { kime: f.yetkili + " <" + f.eposta + ">", rol: "Alıcıya", konu: "Teklifiniz kabul edildi · " + p.ad, govde: ["Sayın " + f.yetkili + ",", ben.ad + " <b>" + esc(p.ad) + "</b> ilanına verdiğiniz " + SP.tl(o.fiyat) + " × " + SP.sayi(o.adet) + " teklifinizi kabul etti.", "Satıcı yetkilisi: " + ben.yetkili + " · " + ben.tel] },
      { kime: ben.yetkili + " <" + ben.eposta + ">", rol: "Satıcıya", konu: "Satış kaydınız · " + p.ad, govde: ["<b>" + esc(p.ad) + "</b> ilanınız " + f.ad + " firmasına satıldı.", "İlanı 3 gün içinde pasife almazsanız otomatik olarak yayından kalkacak."] }
    ]);
  };
  SP.reddet = function (oid) {
    var o = teklifBul(oid), p = SP.urun(o.urun), f = FIR[o.firma], esik = SP.esik(p) || Math.round(p.fiyat * 0.95);
    var hitap = f.yetkili.split(" ")[0];
    var m = SP.modal("<h3>Teklifi reddet</h3><p class=\"sp-m-p\"><b>" + esc(f.ad) + "</b> · " + esc(p.ad) + " için " + SP.tl(o.fiyat) + " × " + SP.sayi(o.adet) + " teklif verdi. Reddederken teklif verene kısa bir mesaj yazabilirsiniz; satış çoğu zaman bu mesajla devam eder.</p>" +
      '<label class="sp-m-tek">Mesajınız<textarea id="spRM" rows="4">Merhaba ' + esc(hitap) + ", " + SP.tl(o.fiyat) + " teklifiniz için teşekkürler. " + SP.tl(esik) + "'den satabilirim; ilana bu fiyattan teklif verirseniz hemen onaylarım.</textarea></label>" +
      '<div class="sp-m-btns"><button class="sp-btn" id="spRG">Reddet ve mesaj gönder</button><button class="sp-btn ghost" id="spRS">Mesajsız reddet</button></div><p class="sp-m-not">Mesaj gönderme, teklif alan satıcılara otomatik açılır. Bireysel üyeler mesaj alabilir ama gönderemez.</p>');
    function bitir(mesajli) {
      o.durum = "reddedildi"; o.mesaj = mesajli ? m.querySelector("#spRM").value : "";
      if (mesajli) S.mesaj.kurumsal.unshift({ id: "m" + Date.now(), kim: f.id, konu: p.ad + " teklifi", t: Date.now(), okunmadi: false, akis: [["o", SP.sayi(o.adet) + " " + p.birim + " için " + SP.tl(o.fiyat) + " teklif verdim."], ["ben", o.mesaj]] });
      kaydet(); SP.kapat(); SP.ciz(true);
      SP.toast("Teklif reddedildi", mesajli ? "Mesajınız " + esc(f.ad) + " firmasına iletildi ve e-postayla bildirildi." : "Teklif veren firmaya ret bildirimi gitti.", "bilgi");
    }
    m.querySelector("#spRG").onclick = function () { bitir(true); };
    m.querySelector("#spRS").onclick = function () { bitir(false); };
  };
  SP.pasifeAl = function (pid) {
    var o = S.urun[pid] || {}; var p = SP.urun(pid);
    if (!o.durum) { o.durum = "satildi"; o.satisT = p.satisT; }
    o.pasifT = Date.now(); S.urun[pid] = o; kaydet(); SP.ciz(true);
    SP.toast("İlan pasife alındı", esc(p.ad) + " genel listelerden kalktı; firma sayfanızdaki 'önceden satılanlar' arşivinde duruyor.", "ok");
  };
  SP.hemenAlAyarla = function (pid, yuzde) {
    var o = S.urun[pid] || {}; o.hemenAl = yuzde; S.urun[pid] = o; kaydet();
  };
  SP.duyuruGonder = function (pid) {
    var p = SP.urun(pid), k = KAT[p.kat];
    S.duyuru.unshift({ urun: pid, t: Date.now(), kisi: k.uye }); kaydet(); SP.ciz(true);
    SP.toast("Ürün duyurusu gönderildi", k.ad + " kategorisindeki " + SP.sayi(k.uye) + " bireysel ve kurumsal üyeye e-posta kuyruğa alındı.", "mail");
  };
  SP.mesajYaz = function (mid, metin) {
    if (!SP.kurumsal()) return SP.yukselt("Mesaj gönderme");
    if (!metin.trim()) return;
    S.mesaj.kurumsal.forEach(function (m) { if (m.id === mid) { m.akis.push(["ben", metin]); m.t = Date.now(); } });
    kaydet(); SP.ciz(true);
  };
  SP.katSec = function (k) {
    var l = S.kat[S.hesap], i = l.indexOf(k);
    if (i >= 0) l.splice(i, 1); else l.push(k);
    kaydet(); SP.ciz(true);
  };
  SP.goster = function (fid) { return S.goster[fid] !== false; };
  SP.gosterDegis = function (fid) { S.goster[fid] = !SP.goster(fid); kaydet(); SP.ciz(true); };

  /* yeni ilan */
  SP.ilanPenceresi = function () {
    var kur = SP.kurumsal(), kisi = SP.kisi();
    var kul = kur ? SP.liste({ firma: "toroslu" }).length : V.KISI.bireysel.ilan.length + S.bireyselIlan.length;
    var hak = kur ? 25 : 3;
    if (kul >= hak) return kur ? SP.toast("İlan hakkınız doldu", "Kurumsal pakette 25 ilan hakkı var.", "uyari") : SP.yukselt("3'ten fazla ilan vermek");
    var m = SP.modal("<h3>Yeni ilan ver</h3><div class=\"sp-m-dogrula\">" + SP.tikRozet(true, "Telefon doğrulandı") + SP.tikRozet(true, "E-posta doğrulandı") + "<small>Doğrulama olmadan ilan verilemez.</small></div>" +
      '<div class="sp-m-grid"><label class="genis">Ürün adı<input id="spIA" type="text" placeholder="Ör. Otel tipi komodin, fazla üretim" value="Ahşap bar taburesi (fazla üretim)"></label>' +
      '<label>Kategori<select id="spIK">' + V.KATEGORI.map(function (k) { return '<option value="' + k.id + '"' + (k.id === "mobilya" ? " selected" : "") + ">" + k.ad + "</option>"; }).join("") + "</select></label>" +
      '<label>Birim<select id="spIB"><option>adet</option><option>kg</option><option>koli</option><option>takım</option><option>m²</option><option>palet</option><option>litre</option></select></label>' +
      '<label>Birim fiyat (TL)<input id="spIF" type="number" value="1650"></label><label>Stok miktarı<input id="spIS" type="number" value="60"></label>' +
      (kur ? '<label class="genis">Hemen Al eşiği: <b id="spIHv">%8</b><input id="spIH" type="range" min="0" max="15" value="8"><small id="spIHa"></small></label>' : '<p class="genis sp-m-not">Bireysel ilanlarda teklif alma ve Hemen Al eşiği yoktur; alıcılar size mesajla ulaşır. Kalan ilan hakkınız: ' + (hak - kul) + "</p>") +
      '</div><button class="sp-btn tam" id="spIG">İlanı yayınla</button><p class="sp-m-not">İlanın süresi yoktur: ürün satılana ya da siz pasife alana kadar yayında kalır.</p>');
    var h = m.querySelector("#spIH");
    function hs() { if (!h) return; var f = parseFloat(m.querySelector("#spIF").value) || 0; m.querySelector("#spIHv").textContent = "%" + h.value; m.querySelector("#spIHa").textContent = +h.value ? SP.tl(Math.round(f * (1 - h.value / 100) * 100) / 100) + " ve üstü teklifler otomatik satışa döner." : "Kapalı: bütün teklifler onayınıza gelir."; }
    if (h) { h.oninput = hs; m.querySelector("#spIF").oninput = hs; hs(); }
    m.querySelector("#spIG").onclick = function () {
      var ad = m.querySelector("#spIA").value.trim(), kat = m.querySelector("#spIK").value, fy = parseFloat(m.querySelector("#spIF").value), st = parseFloat(m.querySelector("#spIS").value);
      if (!ad || !(fy > 0) || !(st > 0)) return SP.toast("Eksik bilgi", "Ürün adı, fiyat ve stok girin.", "uyari");
      var k = KAT[kat];
      if (kur) {
        var id = "n" + Date.now();
        S.yeni.unshift({ id: id, ad: ad, kat: kat, firma: "toroslu", birim: m.querySelector("#spIB").value, fiyat: fy, stok: st, min: 1, hemenAl: +h.value, durum: "aktif", gun: 0, t: Date.now(), ikon: k.ikon, kondisyon: "Yeni", aciklama: "Yeni eklenen ilan (demo).", satisSaat: 0, kod: k.on + "-" + String(Date.now()).slice(-5), barkod: "8690001" + String(Date.now()).slice(-5) + "7", teklifSay: 0, izlenme: 1 });
        kaydet(); SP.kapat(); location.hash = "#/urun/" + id;
        SP.toast("İlanınız yayında", k.ad + " kategorisini takip eden " + SP.sayi(k.uye) + " üyeye yeni ürün e-postası kuyruğa alındı.", "ok");
      } else {
        S.bireyselIlan.push({ ad: ad, kat: kat, fiyat: fy, birim: m.querySelector("#spIB").value, stok: st, ikon: k.ikon });
        kaydet(); SP.kapat(); location.hash = "#/hesabim?sekme=ilanlar"; SP.ciz(true);
        SP.toast("İlanınız yayında", "3 ilan hakkınızın tamamını kullandınız. Daha fazlası için kurumsal pakete geçebilirsiniz.", "ok");
      }
    };
  };

  /* ---------- canlı akış (demo) ---------- */
  var akisSira = 0;
  SP.akisOlay = function (zamanFarki) {
    var l = SP.liste({ durum: "aktif" }); akisSira++;
    var p = l[(akisSira * 7 + 3) % l.length], fl = V.FIRMA.filter(function (f) { return f.id !== p.firma; }), f = fl[(akisSira * 5) % fl.length];
    var esik = SP.esik(p), satis = akisSira % 4 === 0 && esik;
    var fiyat = satis ? esik + Math.round((p.fiyat - esik) * 0.4 * 100) / 100 : Math.round(p.fiyat * (0.86 + (akisSira % 5) * 0.02) * 100) / 100;
    return { tip: satis ? "satis" : "teklif", urun: p, firma: f, fiyat: fiyat, adet: p.min * (1 + akisSira % 4), t: Date.now() - (zamanFarki || 0), fark: Math.round((1 - fiyat / p.fiyat) * 1000) / 10 };
  };
  SP.akisBaslangic = function (n) { var r = []; for (var i = 0; i < n; i++) r.push(SP.akisOlay((i + 1) * 7 * DK)); return r; };

  /* ---------- yönlendirme ---------- */
  SP.rota = function () {
    var h = location.hash.replace(/^#\/?/, ""), par = h.split("?"), yol = par[0].split("/"), q = {};
    (par[1] || "").split("&").forEach(function (x) { if (!x) return; var kv = x.split("="); q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); });
    return { ad: yol[0] || "", id: yol[1] ? decodeURIComponent(yol[1]) : "", q: q };
  };
  SP.qs = function (q) { var s = []; for (var k in q) if (q[k] !== "" && q[k] != null && q[k] !== false) s.push(encodeURIComponent(k) + "=" + encodeURIComponent(q[k])); return s.length ? "?" + s.join("&") : ""; };
  SP.ciz = function (koru) {
    var app = document.getElementById("app"); if (!app || !SP.tasarim) return;
    var r = SP.rota(), y = window.scrollY;
    app.innerHTML = SP.tasarim.ciz(r);
    document.querySelectorAll("[data-menu]").forEach(function (a) { a.classList.toggle("aktif", a.dataset.menu === (r.ad || "anasayfa")); });
    document.querySelectorAll("[data-hesap-sec]").forEach(function (a) { a.classList.toggle("aktif", a.dataset.hesapSec === S.hesap); a.setAttribute("aria-pressed", a.dataset.hesapSec === S.hesap); });
    document.querySelectorAll("[data-hesap-ad]").forEach(function (a) { a.textContent = SP.kisi().ad; });
    document.querySelectorAll("[data-hesap-tur]").forEach(function (a) { a.textContent = SP.kurumsal() ? "Kurumsal" : "Bireysel"; });
    document.querySelectorAll("[data-okunmadi]").forEach(function (a) { var n = SP.okunmadiSay(); a.textContent = n; a.style.display = n ? "" : "none"; });
    document.body.dataset.hesap = S.hesap; document.body.dataset.rota = r.ad || "anasayfa";
    if (SP.tasarim.sonra) SP.tasarim.sonra(r);
    sayacGuncel();
    if (koru) window.scrollTo(0, y);
  };
  SP.okunmadiSay = function () {
    var n = S.mesaj[S.hesap].filter(function (m) { return m.okunmadi; }).length;
    if (SP.kurumsal()) n += S.teklif.filter(function (t) { return t.durum === "bekliyor"; }).length;
    return n;
  };
  function sayacGuncel() {
    document.querySelectorAll("[data-geri]").forEach(function (el) {
      var bit = +el.dataset.geri, kalan = bit - Date.now();
      el.textContent = SP.kalan(kalan);
      var bar = el.parentNode.querySelector(".sp-geri-bar i"); if (bar) bar.style.width = Math.max(0, Math.min(100, kalan / (3 * GUN) * 100)) + "%";
    });
  }
  setInterval(sayacGuncel, 1000);

  /* ---------- ortak tıklama yönetimi ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-teklif],[data-talep],[data-hesap-sec],[data-ig],[data-kabul],[data-reddet],[data-pasif],[data-duyuru],[data-katsec],[data-goster],[data-ilan-ver],[data-eposta-goster],[data-eposta-ornek],[data-sifirla],[data-mesaj-gonder],[data-talep-yanit]");
    if (!el) return;
    var d = el.dataset;
    if (d.teklif) { e.preventDefault(); SP.teklifPenceresi(d.teklif, d.fiyat ? parseFloat(d.fiyat) : null); }
    else if (d.talep) { e.preventDefault(); SP.talepPenceresi(d.talep); }
    else if (d.hesapSec) { e.preventDefault(); SP.kapat(); SP.setHesap(d.hesapSec); }
    else if (d.ig) {
      e.preventDefault(); var u = location.href.split("#")[0] + "#/urun/" + d.ig;
      try { navigator.clipboard.writeText(u); } catch (er) {}
      SP.toast("Bağlantı kopyalandı", "Instagram web üzerinden doğrudan paylaşım bağlantısı sunmaz. Bağlantıyı hikâyenize, gönderinize ya da DM'e yapıştırın.", "bilgi");
    }
    else if (d.kabul) SP.kabul(d.kabul);
    else if (d.reddet) SP.reddet(d.reddet);
    else if (d.pasif) SP.pasifeAl(d.pasif);
    else if (d.duyuru) { var sel = document.getElementById("spDuyuruSec"); SP.duyuruGonder(sel ? sel.value : d.duyuru); }
    else if (d.katsec) { e.preventDefault(); SP.katSec(d.katsec); }
    else if (d.goster) SP.gosterDegis(d.goster);
    else if (d.ilanVer !== undefined) { e.preventDefault(); SP.ilanPenceresi(); }
    else if (d.epostaGoster !== undefined) SP.epostaOnizle();
    else if (d.epostaOrnek !== undefined) SP.epostaOnizle(ornekEposta());
    else if (d.sifirla !== undefined) SP.sifirla();
    else if (d.mesajGonder) { var inp = document.getElementById("spMI"); SP.mesajYaz(d.mesajGonder, inp ? inp.value : ""); }
    else if (d.talepYanit) {
      var t = S.talep.filter(function (x) { return x.id === d.talepYanit; })[0], tf = FIR[t.firma], tp = SP.urun(t.urun);
      var m = SP.modal("<h3>Alım talebini yanıtla</h3><p class=\"sp-m-p\"><b>" + esc(tf.ad) + "</b> · " + SP.sayi(t.adet) + " " + esc(tp.birim) + " × " + SP.tl(t.fiyat) + "</p><label class=\"sp-m-tek\">Mesajınız<textarea id=\"spTY\" rows=\"4\">Merhaba " + esc(tf.yetkili.split(" ")[0]) + ", aynı modelden " + SP.sayi(t.adet) + " adet için yeni üretim yapabiliriz. Termin 15 iş günü, birim fiyat " + SP.tl(tp.fiyat) + ". Uygunsa yeni ilan açıp size bildireyim.</textarea></label><button class=\"sp-btn tam\" id=\"spTYG\">Gönder</button>");
      m.querySelector("#spTYG").onclick = function () { t.yanit = m.querySelector("#spTY").value; kaydet(); SP.kapat(); SP.ciz(true); SP.toast("Yanıt gönderildi", esc(tf.ad) + " mesajınızı e-postayla da aldı.", "ok"); };
    }
  });
  function ornekEposta() {
    var kat = S.kat[S.hesap], l = SP.liste({ kat: kat, durum: "aktif", limit: 4 }), kisi = SP.kisi();
    return [{ kime: kisi.ad, rol: "Üyeye", konu: "Faaliyet alanınızda " + l.length + " yeni ilan", govde: ["Merhaba " + kisi.ad.split(" ")[0] + ",", "Takip ettiğiniz kategorilerde (" + kat.map(function (k) { return KAT[k].ad; }).join(", ") + ") yeni ilanlar var:"].concat(l.map(function (p) { return "• <b>" + esc(p.ad) + "</b> · " + SP.tl(p.fiyat) + "/" + esc(p.birim) + " · " + esc(FIR[p.firma].ad); })).concat(["Bildirim sıklığını üye panelinizden değiştirebilirsiniz."]) }];
  }
  SP.ornekEposta = ornekEposta;

  /* ---------- ortak sayfalar ---------- */
  SP.miniKart = function (p, tema) {
    var f = FIR[p.firma], sat = p.durum !== "aktif";
    return '<a class="sp-mini' + (sat ? " satildi" : "") + '" href="#/urun/' + p.id + '"><div class="sp-mini-img">' + SP.gorsel(p, tema) + (sat ? '<span class="sp-satildi-bant">SATILDI</span>' : "") + "</div><b>" + esc(p.ad) + "</b><span>" + SP.tl(p.fiyat) + " / " + esc(p.birim) + "</span><small>" + esc(f.ad) + "</small></a>";
  };
  SP.firmaSatir = function (f) {
    return '<a class="sp-fsatir" href="#/firma/' + f.id + '">' + SP.logo(f, 40) + "<div><b>" + esc(f.ad) + (SP.firmaOk(f) ? " " + SP.tikRozet(true) : "") + "</b><small>" + f.kat.map(function (k) { return KAT[k].ad; }).join(", ") + " · " + esc(f.il) + " · " + f.katildi + " gün önce katıldı</small></div></a>";
  };
  var PAKET = [
    { id: "bireysel", ad: "Bireysel", fiyat: "Ücretsiz", alt: "süresiz", ilan: "3 ilan", ozet: "Faaliyet alanınızı takip edin, ilk ilanlarınızı verin.", ozellik: ["3 ilan hakkı, süresiz", "Ad, adres, e-posta, telefon (doğrulamalı, yeşil tik)", "Faaliyet alanı: kategorileri tik ile seçme", "Seçtiğiniz kategorilerde en yeni 50 ürün ve 50 firma", "Yeni ürün gelince e-posta bildirimi", "Satıcı mesajlarını alma"], yok: ["Teklif verme ve alım talebi", "Mesaj gönderme", "Firma sayfası ve Hemen Al"] },
    { id: "basic", ad: "Basic", fiyat: "₺___", alt: "/ yıl", ilan: "10 ilan", ozet: "Küçük işletmeler için firma sayfası ve teklif sistemi.", ozellik: ["10 ilan hakkı, süresiz", "Firma sayfası: logo, üst banner, 5 tanıtım resmi", "Firma adı, adres, tarihçe, yetkili bilgileri", "Teklif verme, teklif alma, alım talebi", "Hemen Al eşiği", "Satılanları göster / gizle anahtarı", "Reddedilen teklif sahibine mesaj"], yok: ["Kategori üyelerine e-posta duyurusu"] },
    { id: "kurumsal", ad: "Kurumsal", fiyat: "₺___", alt: "/ yıl", ilan: "25 ilan", one: true, ozet: "Stoğunu düzenli eriten üretici ve toptancılar için.", ozellik: ["25 ilan hakkı, süresiz", "Basic paketteki her şey", "Hakkımızda yazısı ve web sitesi bağlantısı", "Kategorideki bireysel ve kurumsal üyelere e-posta ile ürün duyurusu", "Firma kategorilerinde faaliyet gösteren en yeni 50 üye listesi", "Satıcı paneli: teklif, satış, pasife alma takibi", "Yılda bir kez yenileme"], yok: [] }
  ];
  SP.PAKET = PAKET;
  SP.sayfaPaketler = function () {
    var h = SP.hesap();
    return '<section class="sp-sayfa sp-paketler"><div class="sp-sb"><span class="sp-ust">Paketler</span><h1>Amacımız sizden para almak değil, iş yapmanızı sağlamak</h1><p>Bireysel hesap süresiz ücretsizdir. Teklif vermek, teklif almak ve Hemen Al ile otomatik satış için kurumsal paketlerden birini seçin. Fiyatlar müşteri onayından sonra yazılacaktır.</p></div>' +
      '<div class="sp-pk-izgara">' + PAKET.map(function (p) {
        var simdiki = (h === "bireysel" && p.id === "bireysel") || (h === "kurumsal" && p.id === "kurumsal");
        return '<div class="sp-pk' + (p.one ? " one" : "") + '">' + (p.one ? '<span class="sp-pk-rozet">En çok tercih edilen</span>' : "") + '<div class="sp-pk-ad">' + p.ad + '</div><div class="sp-pk-fiyat">' + p.fiyat + " <small>" + p.alt + '</small></div><div class="sp-pk-ilan">' + SP.ui("etiket", 15) + " " + p.ilan + '</div><p class="sp-pk-oz">' + p.ozet + "</p><ul>" +
          p.ozellik.map(function (o) { return '<li class="var">' + SP.ui("tik", 15) + o + "</li>"; }).join("") + p.yok.map(function (o) { return '<li class="yok">' + SP.ui("kapat", 14) + o + "</li>"; }).join("") + "</ul>" +
          (simdiki ? '<button class="sp-btn ghost tam" disabled>Mevcut demo hesabınız</button>' : p.id === "bireysel" ? '<button class="sp-btn ghost tam" data-hesap-sec="bireysel">Ücretsiz üye ol</button>' : '<button class="sp-btn tam" data-hesap-sec="kurumsal">' + p.ad + " pakete geç</button>") + "</div>";
      }).join("") + "</div>" +
      '<div class="sp-tablo-kap"><table class="sp-tablo sp-kars"><thead><tr><th>Özellik</th><th>Bireysel</th><th>Basic</th><th>Kurumsal</th></tr></thead><tbody>' +
      [["İlan hakkı (süresiz)", "3", "10", "25"], ["Teklif verme / alım talebi", "–", "✓", "✓"], ["Teklif alma", "–", "✓", "✓"], ["Hemen Al eşiği", "–", "✓", "✓"], ["Mesaj gönderme", "Yalnız alma", "✓", "✓"], ["Firma sayfası, logo, banner, 5 resim", "–", "✓", "✓"], ["Kategori üyelerine e-posta duyurusu", "–", "–", "✓"], ["Faaliyet alanı akışı ve e-posta bildirimi", "✓", "✓", "✓"], ["Doğrulanmış bilgi rozeti (yeşil tik)", "✓", "✓", "✓"]]
        .map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<div class="sp-sss"><h2>Sık sorulan sorular</h2>' + V.SSS.map(function (s, i) { return "<details" + (i === 0 ? " open" : "") + "><summary>" + s[0] + "</summary><p>" + s[1] + "</p></details>"; }).join("") + "</div></section>";
  };
  SP.sayfaHakkimizda = function () {
    return '<section class="sp-sayfa sp-hakkimizda"><div class="sp-sb"><span class="sp-ust">Hakkımızda</span><h1>Depoda bekleyen stok, başka bir firmanın aradığı üründür</h1><p>StokPazarı; üretici, toptancı ve işletmelerin fazla, sezon sonu, iade ya da proje fazlası ürünlerini birbirine teklifle sattığı bir firmalar arası ilan platformudur. Sepet yoktur, ödeme yoktur: alıcı teklif verir, satıcı karar verir.</p></div>' +
      '<blockquote class="sp-alinti">“Amacımız insanlardan para almak değil; iş yapmalarını, para kazanmalarını sağlamak.”</blockquote>' +
      '<div class="sp-adimlar">' + [["etiket", "İlanı verin", "Ürün kodu, barkod, fiyat ve stok miktarıyla ilan verin. İlanın süresi yoktur."], ["simsek", "Hemen Al eşiğini seçin", "%5, %8 ya da %10: eşik içindeki teklifler siz uyurken bile otomatik satışa döner."], ["mesaj", "Teklifleri yönetin", "Eşik altındaki teklifi kabul edin ya da reddedip 'şu fiyattan verebilirim' diye yazın."], ["kalkan", "Satıldı, güven kazandı", "Satılan ürün SATILDI etiketiyle görünür; firma sayfanız referansa dönüşür."]].map(function (a, i) { return '<div class="sp-adim"><span class="sp-adim-no">' + (i + 1) + "</span>" + SP.ui(a[0], 22) + "<b>" + a[1] + "</b><p>" + a[2] + "</p></div>"; }).join("") + "</div>" +
      '<div class="sp-iki"><div><h2>Neden kurulduk?</h2><p>Türkiye\'de binlerce işletmenin deposunda, iptal edilen bir siparişten kalan parti, ambalajı değişen ürünler ya da sezonu geçmiş stoklar bekliyor. Bu ürünler çoğu zaman tanıdık birkaç alıcıya düşük fiyata verilir ya da yıllarca depoda kalır.</p><p>StokPazarı bu stoğu, onu gerçekten arayan firmalarla buluşturmak için kuruldu. Bireysel üyelik ücretsizdir; kurumsal paketler teklif, Hemen Al ve kategori duyurusu gibi satışı hızlandıran araçları açar.</p></div>' +
      '<div><h2>İlkelerimiz</h2><ul class="sp-ilke"><li>' + SP.ui("kalkan", 18) + "<div><b>Doğrulanmış üyeler</b>Telefon ve e-posta doğrulaması olmadan ilan verilemez.</div></li><li>" + SP.ui("goz", 18) + "<div><b>Şeffaf geçmiş</b>Firmanın sattığı ürünler sayfasında görünür (firma isterse gizler).</div></li><li>" + SP.ui("etiket", 18) + "<div><b>Doğrudan satış</b>Satış iki firma arasında gerçekleşir; sitede ödeme alınmaz.</div></li><li>" + SP.ui("kutu", 18) + "<div><b>Güncel ilan</b>Satılan ilan 3 gün içinde pasife alınmazsa otomatik kalkar.</div></li></ul></div></div>" +
      '<div class="sp-rakam">' + [["10", "ana kategori"], [String(V.FIRMA.length), "üye firma (demo)"], [String(SP.liste({}).length), "yayında ilan (demo)"], ["7/24", "teklif alma"]].map(function (r) { return "<div><b>" + r[0] + "</b><span>" + r[1] + "</span></div>"; }).join("") + "</div></section>";
  };
  SP.blogKart = function (b) {
    return '<a class="sp-blogkart" href="#/blog/' + b.id + '"><div class="sp-blog-img">' + SP.gorsel({ id: b.id.length, kat: V.KATEGORI.filter(function (k) { return k.renk === b.renk; })[0].id, ikon: b.ikon, ad: b.baslik, kod: b.kat.toLocaleUpperCase("tr") }) + '</div><div class="sp-blog-ic"><span class="sp-ust">' + b.kat + " · " + b.dk + " dk okuma</span><b>" + esc(b.baslik) + "</b><p>" + esc(b.ozet) + "</p><small>" + b.tarih + "</small></div></a>";
  };
  SP.sayfaBlog = function () {
    return '<section class="sp-sayfa sp-blog"><div class="sp-sb"><span class="sp-ust">Blog</span><h1>Stok, teklif ve satış üzerine</h1><p>Fazla stoğu nakde çevirmek, Hemen Al eşiğini doğru kurmak ve teklif pazarlığını kaybetmemek için kısa rehberler.</p></div><div class="sp-blog-izgara">' + V.BLOG.map(SP.blogKart).join("") + "</div></section>";
  };
  SP.sayfaBlogYazi = function (id) {
    var b = V.BLOG.filter(function (x) { return x.id === id; })[0]; if (!b) return SP.sayfaBlog();
    return '<article class="sp-sayfa sp-yazi"><a class="sp-geri" href="#/blog">' + SP.ui("sol", 16) + " Tüm yazılar</a><span class=\"sp-ust\">" + b.kat + " · " + b.tarih + " · " + b.dk + " dk okuma</span><h1>" + esc(b.baslik) + '</h1><p class="sp-yazi-oz">' + esc(b.ozet) + '</p><div class="sp-yazi-img">' + SP.gorsel({ id: b.id.length + 3, kat: V.KATEGORI.filter(function (k) { return k.renk === b.renk; })[0].id, ikon: b.ikon, ad: b.baslik, kod: "STOKPAZARI BLOG" }) + "</div>" +
      b.metin.map(function (m) { return "<p>" + esc(m) + "</p>"; }).join("") + '<div class="sp-yazi-alt"><span>StokPazarı Editör</span>' + SP.paylasHTML({ id: "blog", ad: b.baslik, fiyat: 0, birim: "" }).replace(/#\/urun\/blog/g, "#/blog/" + b.id) + '</div><h2>Diğer yazılar</h2><div class="sp-blog-izgara kucuk">' + V.BLOG.filter(function (x) { return x.id !== id; }).slice(0, 3).map(SP.blogKart).join("") + "</div></article>";
  };
  SP.sayfaIletisim = function () {
    return '<section class="sp-sayfa sp-iletisim"><div class="sp-sb"><span class="sp-ust">İletişim</span><h1>Bize yazın, aynı iş günü dönelim</h1><p>İnternet tabanlı bir platform olduğumuz için ziyaret adresimiz yoktur. Üyelik, paketler, ilan ve iş birlikleri için formu doldurun.</p></div>' +
      '<div class="sp-il-kap"><form class="sp-form" id="spIletisim" novalidate><div class="sp-m-grid"><label>Ad soyad<input required name="ad" placeholder="Adınız ve soyadınız"></label><label>Firma <small>(isteğe bağlı)</small><input name="firma" placeholder="Firma unvanı"></label><label>E-posta<input required type="email" name="eposta" placeholder="ornek@firma.com"></label><label>Telefon<input type="tel" name="tel" placeholder="05xx xxx xx xx"></label>' +
      '<label class="genis">Konu<select name="konu"><option>Kurumsal üyelik ve paketler</option><option>İlan verme ve doğrulama</option><option>Teklif ve satış süreci</option><option>Reklam ve iş birliği</option><option>Diğer</option></select></label><label class="genis">Mesajınız<textarea required name="mesaj" rows="5" placeholder="Size nasıl yardımcı olabiliriz?"></textarea></label>' +
      '<label class="genis sp-onay"><input type="checkbox" required name="kvkk"> Kişisel verilerimin talebime dönüş yapılması amacıyla işlenmesini kabul ediyorum (KVKK aydınlatma metni).</label></div><button class="sp-btn tam" type="submit">Mesajı gönder</button><div class="sp-form-sonuc" id="spIS"></div></form>' +
      '<aside class="sp-il-yan"><div class="sp-il-k">' + SP.ui("saat", 22) + "<b>Yanıt süresi</b><p>Hafta içi 09:00–18:00 arası gelen mesajlara aynı gün dönüş yapılır.</p></div><div class=\"sp-il-k\">" + SP.ui("kalkan", 22) + "<b>Doğrulama desteği</b><p>Telefon ya da e-posta doğrulamasında sorun yaşarsanız konu olarak \"İlan verme ve doğrulama\"yı seçin.</p></div><div class=\"sp-il-k\">" + SP.ui("mesaj", 22) + "<b>Sosyal medya</b><p>Duyurular ve yeni özellikler için bizi takip edin.</p>" + SP.sosyal() + "</div></aside></div></section>";
  };
  SP.sosyal = function () {
    return '<div class="sp-sosyal">' + [["ig", "Instagram"], ["fb", "Facebook"], ["x", "X"], ["li", "LinkedIn"], ["yt", "YouTube"], ["wa", "WhatsApp"]].map(function (s) { return '<a href="#" onclick="return false" aria-label="' + s[1] + '" title="' + s[1] + ' (demo)">' + SP.ui(s[0], 18) + "</a>"; }).join("") + "</div>";
  };
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "spIletisim") return;
    e.preventDefault(); var f = e.target, ok = f.ad.value.trim() && /.+@.+\..+/.test(f.eposta.value) && f.mesaj.value.trim() && f.kvkk.checked;
    var s = document.getElementById("spIS");
    if (!ok) { s.className = "sp-form-sonuc hata"; s.textContent = "Lütfen ad, geçerli e-posta, mesaj alanlarını doldurun ve onay kutusunu işaretleyin."; return; }
    s.className = "sp-form-sonuc ok"; s.innerHTML = SP.ui("tik", 16) + " Teşekkürler " + esc(f.ad.value.split(" ")[0]) + ", mesajınız alındı (demo). Talep numaranız: SP-" + String(Date.now()).slice(-6) + ". Aynı iş günü " + esc(f.eposta.value) + " adresine dönüş yapacağız.";
    f.reset();
  });

  /* ---------- hesap paneli ---------- */
  function rozet(d) {
    var m = { bekliyor: ["Onay bekliyor", "bekle"], kabul: ["Kabul edildi", "ok"], "kabul-otomatik": ["Hemen Al ile satıldı", "ok"], reddedildi: ["Reddedildi", "red"], kapandi: ["Ürün satıldı, kapandı", "gri"] }[d] || [d, "gri"];
    return '<span class="sp-durum ' + m[1] + '">' + m[0] + "</span>";
  }
  function urunHucre(p) { return '<a class="sp-uh" href="#/urun/' + p.id + '"><span class="sp-uh-img">' + SP.gorsel(p) + "</span><span><b>" + esc(p.ad) + "</b><small>" + esc(p.kod) + " · Liste " + SP.tl(p.fiyat) + "/" + esc(p.birim) + (SP.esik(p) ? " · Eşik " + SP.tl(SP.esik(p)) : "") + "</small></span></a>"; }
  function firmaHucre(f) { return '<a class="sp-fh" href="#/firma/' + f.id + '">' + SP.logo(f, 30) + "<span><b>" + esc(f.ad) + "</b><small>" + esc(f.yetkili) + " · " + esc(f.il) + "</small></span></a>"; }
  SP.panel = function (sekme) {
    var kur = SP.kurumsal(), kisi = SP.kisi();
    var bekleyen = S.teklif.filter(function (t) { return t.durum === "bekliyor"; }).length;
    var okm = S.mesaj[S.hesap].filter(function (m) { return m.okunmadi; }).length;
    var benimSatilan = SP.tumUrun().filter(function (p) { return p.firma === "toroslu" && p.durum === "satildi"; });
    var sekmeler = kur ? [["teklifler", "Gelen teklifler", bekleyen], ["satilanlar", "Satılanlar ve pasife alma", benimSatilan.length], ["ilanlar", "İlanlarım ve Hemen Al", 0], ["talepler", "Alım talepleri", S.talep.length], ["verilen", "Verdiğim teklifler", 0], ["mesajlar", "Mesajlar", okm], ["akis", "Faaliyet alanım", 0], ["duyuru", "Kategori duyurusu", 0]]
      : [["akis", "Faaliyet alanım", 0], ["mesajlar", "Mesajlar", okm], ["ilanlar", "İlanlarım", 0], ["profil", "Profil ve doğrulama", 0], ["yukselt", "Hesabı yükselt", 0]];
    if (!sekme || !sekmeler.some(function (s) { return s[0] === sekme; })) sekme = sekmeler[0][0];
    var f = FIR.toroslu;
    var bas = '<div class="sp-panel-bas">' + (kur ? SP.logo(f, 56) : '<span class="sp-avatar">' + V.KISI.bireysel.kisa + "</span>") + '<div><span class="sp-ust">' + (kur ? "Kurumsal paket · 25 ilan" : "Bireysel hesap · ücretsiz") + "</span><h1>" + esc(kur ? f.ad : kisi.ad) + "</h1><div class=\"sp-panel-dogru\">" + SP.tikRozet(true, "Telefon") + SP.tikRozet(true, "E-posta") + (kur ? '<a href="#/firma/toroslu">Firma sayfam →</a>' : "") + "</div></div>" +
      '<div class="sp-panel-bas-sag"><button class="sp-btn" data-ilan-ver>' + SP.ui("arti", 16) + " Yeni ilan</button></div></div>";
    var nav = '<nav class="sp-sekmeler" role="tablist">' + sekmeler.map(function (s) { return '<a role="tab" class="' + (s[0] === sekme ? "aktif" : "") + '" href="#/hesabim?sekme=' + s[0] + '">' + s[1] + (s[2] ? "<i>" + s[2] + "</i>" : "") + "</a>"; }).join("") + "</nav>";
    var ic = "";
    if (sekme === "teklifler") {
      var tek = S.teklif.slice().sort(function (a, b) { return (a.durum === "bekliyor" ? 0 : 1) - (b.durum === "bekliyor" ? 0 : 1) || b.t - a.t; });
      ic = '<div class="sp-kpi">' + [["Bekleyen teklif", bekleyen, "kabul ya da ret bekliyor"], ["Bu ay Hemen Al satışı", 3, "eşik içi otomatik"], ["Ortalama teklif farkı", "%-8,6", "liste fiyatına göre"], ["Ortalama yanıt süresi", "1 sa 40 dk", "son 30 gün"]].map(function (k) { return "<div><span>" + k[0] + "</span><b>" + k[1] + "</b><small>" + k[2] + "</small></div>"; }).join("") + "</div>" +
        '<p class="sp-bilgi">' + SP.ui("simsek", 16) + " Hemen Al eşiğinin içinde kalan teklifler buraya düşmeden otomatik satışa döner. Burada yalnızca eşik altındaki ve eşik tanımlanmamış ilanlara gelen teklifler görünür.</p>" +
        '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Teklif veren</th><th>Birim teklif</th><th>Adet</th><th>Toplam</th><th>Fark</th><th>Zaman</th><th></th></tr></thead><tbody>' +
        tek.map(function (o) {
          var p = SP.urun(o.urun), fr = FIR[o.firma], fark = Math.round((1 - o.fiyat / p.fiyat) * 1000) / 10;
          return "<tr><td data-l=\"Ürün\">" + urunHucre(p) + "</td><td data-l=\"Teklif veren\">" + firmaHucre(fr) + '</td><td data-l="Birim teklif" class="sag"><b>' + SP.tl(o.fiyat) + '</b></td><td data-l="Adet" class="sag">' + SP.sayi(o.adet) + '</td><td data-l="Toplam" class="sag">' + SP.tl(o.fiyat * o.adet) + '</td><td data-l="Fark" class="sag"><span class="sp-fark">-%' + SP.sayi(fark) + '</span></td><td data-l="Zaman">' + SP.once(o.t) + '</td><td class="sp-eylem">' +
            (o.durum === "bekliyor" ? '<button class="sp-btn kucuk" data-kabul="' + o.id + '">Kabul et</button><button class="sp-btn kucuk ghost" data-reddet="' + o.id + '">Reddet</button>' : rozet(o.durum) + (o.mesaj ? '<div class="sp-not-k">Mesajınız: “' + esc(o.mesaj) + "”</div>" : "")) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    } else if (sekme === "satilanlar") {
      var arsiv = SP.liste({ firma: "toroslu", durum: "arsiv", sirala: "satis" });
      ic = '<div class="sp-kpi">' + [["Son 30 günde satılan", benimSatilan.length + arsiv.filter(function (p) { return Date.now() - p.satisT < 30 * GUN; }).length + " ilan", "teklif + Hemen Al"], ["Hemen Al ile satış", "%57", "onay beklemeden"], ["Ortalama satış süresi", "3,4 gün", "ilan → satış"], ["Pasife alma bekleyen", benimSatilan.length, "3 gün kuralı"]].map(function (k) { return "<div><span>" + k[0] + "</span><b>" + k[1] + "</b><small>" + k[2] + "</small></div>"; }).join("") + "</div>" + (benimSatilan.length ? '<div class="sp-uyari">' + SP.ui("saat", 18) + "<div><b>" + benimSatilan.length + " satılmış ilanınız pasife alınmayı bekliyor.</b> Satılan ilanlar 3 gün içinde pasife alınmazsa sistem tarafından otomatik olarak yayından kaldırılır. Bu hatırlatma e-postayla da gönderildi.</div></div>" : '<p class="sp-bilgi">' + SP.ui("tik", 16) + " Pasife alınmayı bekleyen satılmış ilanınız yok.</p>") +
        '<div class="sp-satilan-liste">' + benimSatilan.map(function (p) {
          var acc = S.teklif.filter(function (t) { return t.urun === p.id && /kabul/.test(t.durum); })[0] || {};
          var al = FIR[p.alici || acc.firma || "mavisehir"], bit = p.satisT + 3 * GUN;
          return '<div class="sp-satilan"><div class="sp-satilan-img">' + SP.gorsel(p) + '<span class="sp-satildi-bant">SATILDI</span></div><div class="sp-satilan-ic"><b>' + esc(p.ad) + "</b><small>" + esc(p.kod) + " · Alıcı: " + esc(al.ad) + " · " + SP.sayi(p.satisAdet || acc.adet || p.stok) + " " + esc(p.birim) + " × " + SP.tl(p.satisFiyat || acc.fiyat || SP.esik(p) || p.fiyat) + (acc.durum === "kabul-otomatik" ? " · Hemen Al ile" : "") + " · " + SP.once(p.satisT) + '</small><div class="sp-gs"><span>Otomatik yayından kalkmaya:</span> <b data-geri="' + bit + '">' + SP.kalan(bit - Date.now()) + '</b><div class="sp-geri-bar"><i style="width:' + Math.max(0, (bit - Date.now()) / (3 * GUN) * 100) + '%"></i></div></div></div><div class="sp-satilan-btn"><button class="sp-btn" data-pasif="' + p.id + '">Şimdi pasife al</button><a class="sp-btn ghost" href="#/urun/' + p.id + '">İlanı gör</a></div></div>';
        }).join("") + "</div>" +
        '<div class="sp-baslik-sat"><h2>Önceden satılanlar (arşiv)</h2><label class="sp-anahtar"><input type="checkbox" data-goster="toroslu"' + (SP.goster("toroslu") ? " checked" : "") + '><span></span> Firma sayfamda göster</label></div><p class="sp-bilgi">Bu ürünler genel listelerde görünmez. Anahtar açıkken firma sayfanızın altında “satıldı” işaretiyle referans olarak gösterilir.</p><div class="sp-mini-izgara">' + arsiv.map(function (p) { return SP.miniKart(p); }).join("") + "</div>";
    } else if (sekme === "ilanlar" && kur) {
      var benim = SP.liste({ firma: "toroslu", durum: "aktif" });
      var kul = SP.liste({ firma: "toroslu" }).length;
      ic = '<div class="sp-hak"><div><b>' + kul + " / 25</b> ilan hakkı kullanıldı</div><div class=\"sp-geri-bar\"><i style=\"width:" + kul / 25 * 100 + '%"></i></div><small>İlanların süresi yoktur. Satılan ya da pasife alınan ilan hakkınızı geri açar.</small></div>' +
        '<p class="sp-bilgi">' + SP.ui("simsek", 16) + " Kaydırıcıyla her ilan için Hemen Al eşiğini ayarlayın. Eşik içindeki teklifler onayınızı beklemeden satışa döner; alıcıya ve size e-posta gider.</p>" +
        '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>İlan</th><th>Stok</th><th>Teklif</th><th>İzlenme</th><th style="min-width:230px">Hemen Al eşiği</th></tr></thead><tbody>' + benim.map(function (p) {
          return '<tr><td data-l="İlan">' + urunHucre(p) + '</td><td data-l="Stok" class="sag">' + SP.sayi(p.stok) + " " + esc(p.birim) + '</td><td data-l="Teklif" class="sag">' + p.teklifSay + '</td><td data-l="İzlenme" class="sag">' + SP.sayi(p.izlenme) + '</td><td data-l="Hemen Al"><div class="sp-esik-ayar"><input type="range" min="0" max="15" value="' + p.hemenAl + '" data-esik-ayar="' + p.id + '" data-fiyat="' + p.fiyat + '"><b>' + (p.hemenAl ? "%" + p.hemenAl : "Kapalı") + "</b><small>" + (p.hemenAl ? SP.tl(SP.esik(p)) + " ve üstü otomatik satılır" : "Bütün teklifler onayınıza gelir") + "</small></div></td></tr>";
        }).join("") + "</tbody></table></div>";
    } else if (sekme === "talepler") {
      ic = '<p class="sp-bilgi">' + SP.ui("mesaj", 16) + " Satılmış ilanlarınızı görüp aynı ürünü almak isteyen firmaların talepleri. Satış bitmiş gibi görünse de alım süreci buradan devam eder.</p>" +
        '<div class="sp-talep-liste">' + S.talep.map(function (t) {
          var p = SP.urun(t.urun), fr = FIR[t.firma];
          return '<div class="sp-talep">' + firmaHucre(fr) + '<div class="sp-talep-ic"><span>' + esc(p.ad) + " <em>SATILDI</em></span><b>" + SP.sayi(t.adet) + " " + esc(p.birim) + " × " + SP.tl(t.fiyat) + " = " + SP.tl(t.adet * t.fiyat) + "</b><p>“" + esc(t.not) + "”</p>" + (t.yanit ? '<div class="sp-not-k">Yanıtınız: “' + esc(t.yanit) + "”</div>" : "") + "<small>" + SP.once(t.t) + '</small></div><div class="sp-talep-btn">' + (t.yanit ? rozet("kabul").replace("Kabul edildi", "Yanıtlandı") : '<button class="sp-btn kucuk" data-talep-yanit="' + t.id + '">Yanıtla</button>') + "</div></div>";
        }).join("") + "</div>" +
        (S.gidenTalep.length ? "<h2>Gönderdiğim alım talepleri</h2>" + S.gidenTalep.map(function (g) { var p = SP.urun(g.urun); return '<div class="sp-talep">' + urunHucre(p) + '<div class="sp-talep-ic"><b>' + SP.sayi(g.adet) + " " + esc(p.birim) + " × " + SP.tl(g.fiyat) + "</b><small>" + SP.once(g.t) + "</small></div>" + rozet("bekliyor").replace("Onay bekliyor", "Satıcıya iletildi") + "</div>"; }).join("") : "");
    } else if (sekme === "verilen") {
      ic = '<p class="sp-bilgi">' + SP.ui("etiket", 16) + " Başka firmaların ilanlarına verdiğiniz teklifler. Reddedilen tekliflerde satıcının karşı teklif mesajını görür, tek tıkla yeniden teklif verirsiniz.</p>" +
        '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Satıcı</th><th>Teklifim</th><th>Adet</th><th>Durum</th><th>Zaman</th></tr></thead><tbody>' + S.verilen.map(function (v) {
          var p = SP.urun(v.urun), fr = FIR[p.firma];
          return '<tr><td data-l="Ürün">' + urunHucre(p) + '</td><td data-l="Satıcı">' + firmaHucre(fr) + '</td><td data-l="Teklifim" class="sag"><b>' + SP.tl(v.fiyat) + '</b></td><td data-l="Adet" class="sag">' + SP.sayi(v.adet) + '</td><td data-l="Durum">' + rozet(v.durum) + (v.mesaj ? '<div class="sp-not-k">' + esc(fr.yetkili) + ": “" + esc(v.mesaj) + "”</div>" + (p.durum === "aktif" ? '<button class="sp-btn kucuk" data-teklif="' + p.id + '" data-fiyat="' + (SP.esik(p) || Math.round(p.fiyat * 0.96)) + '">Yeniden teklif ver</button>' : "") : "") + '</td><td data-l="Zaman">' + SP.once(v.t) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    } else if (sekme === "mesajlar") {
      var ml = S.mesaj[S.hesap].slice().sort(function (a, b) { return b.t - a.t; }), sec = ml.filter(function (m) { return m.id === SP.rota().q.m; })[0] || ml[0];
      if (sec && sec.okunmadi) { sec.okunmadi = false; kaydet(); }
      ic = '<div class="sp-mesaj"><div class="sp-mesaj-liste">' + ml.map(function (m) { var fr = FIR[m.kim]; return '<a class="' + (m === sec ? "aktif" : "") + (m.okunmadi ? " yeni" : "") + '" href="#/hesabim?sekme=mesajlar&m=' + m.id + '">' + SP.logo(fr, 34) + "<span><b>" + esc(fr.ad) + "</b><small>" + esc(m.konu) + "</small></span><em>" + SP.once(m.t) + "</em></a>"; }).join("") + "</div>" +
        (sec ? '<div class="sp-mesaj-ic"><div class="sp-mesaj-ust">' + firmaHucre(FIR[sec.kim]) + "<span>" + esc(sec.konu) + '</span></div><div class="sp-balonlar">' + sec.akis.map(function (a) { return '<div class="sp-balon ' + (a[0] === "ben" ? "ben" : "o") + '">' + esc(a[1]) + "</div>"; }).join("") + "</div>" +
          (kur ? '<div class="sp-mesaj-yaz"><input id="spMI" placeholder="Mesajınızı yazın…" onkeydown="if(event.key===\'Enter\'){event.preventDefault();this.nextElementSibling.click()}"><button class="sp-btn" data-mesaj-gonder="' + sec.id + '">Gönder</button></div>' : '<div class="sp-mesaj-yaz kilitli">' + SP.ui("kilit", 16) + ' <span>Bireysel hesaplar mesaj alabilir ama gönderemez.</span> <a href="#/paketler">Hesabınızı yükseltin →</a></div>') + "</div>" : "") + "</div>";
    } else if (sekme === "akis") {
      var kat = S.kat[S.hesap], urunler = SP.liste({ kat: kat, limit: 50 }), firmalar = SP.sonFirmalar(50, kat);
      ic = '<div class="sp-akis-ust"><div><h2>Faaliyet alanınız</h2><p>Kategorileri işaretleyin; listeler ve e-posta bildirimleri anında güncellenir.</p></div><div class="sp-sik"><span>Yeni ürün e-postası:</span>' + [["aninda", "Anında"], ["gunluk", "Günlük özet"], ["kapali", "Kapalı"]].map(function (s) { return '<label><input type="radio" name="sik" value="' + s[0] + '"' + (S.bildirimSiklik === s[0] ? " checked" : "") + ' data-siklik="' + s[0] + '">' + s[1] + "</label>"; }).join("") + "</div></div>" +
        '<div class="sp-katsec">' + V.KATEGORI.map(function (k) { var on = kat.indexOf(k.id) >= 0; return '<button type="button" class="' + (on ? "on" : "") + '" data-katsec="' + k.id + '" style="--kr:' + k.renk + '" aria-pressed="' + on + '"><span class="sp-kutu">' + (on ? SP.ui("tik", 13) : "") + "</span>" + k.ad + "</button>"; }).join("") + "</div>" +
        '<div class="sp-akis-iki"><div><div class="sp-baslik-sat"><h2>Seçtiğiniz kategorilerde en yeni ilanlar</h2><span class="sp-say">' + urunler.length + " / 50</span></div>" + (urunler.length ? '<div class="sp-mini-izgara">' + urunler.map(function (p) { return SP.miniKart(p); }).join("") + "</div>" : '<p class="sp-bos">Kategori seçin; o alandaki en yeni 50 ilan burada listelenir.</p>') + "</div>" +
        '<aside><div class="sp-eposta-kart"><div class="sp-eposta-kart-bas">' + SP.ui("mail", 18) + " E-posta bildirimi önizlemesi</div>" + (function () { var e = ornekEposta()[0]; return "<b>" + esc(e.konu) + "</b><div class=\"sp-eposta-govde\">" + e.govde.slice(0, 6).map(function (g) { return "<p>" + g + "</p>"; }).join("") + "</div>"; })() + '<button class="sp-btn kucuk ghost" data-eposta-ornek>Tam e-postayı aç</button></div>' +
        '<div class="sp-baslik-sat"><h2>Bu alanlardaki firmalar</h2><span class="sp-say">' + firmalar.length + " / 50</span></div><div class=\"sp-fliste\">" + firmalar.map(SP.firmaSatir).join("") + "</div></aside></div>";
    } else if (sekme === "duyuru") {
      var benimA = SP.liste({ firma: "toroslu", durum: "aktif" });
      var ilk = benimA[0], k1 = KAT[ilk.kat];
      ic = '<p class="sp-bilgi">' + SP.ui("mail", 16) + " Kurumsal pakette, ilanınızı ürünün kategorisini faaliyet alanı olarak seçmiş bütün bireysel ve kurumsal üyelere e-postayla duyurabilirsiniz.</p>" +
        '<div class="sp-duyuru"><div class="sp-duyuru-form"><label>Duyurulacak ilan<select id="spDuyuruSec" onchange="SP.duyuruOnizle(this.value)">' + benimA.map(function (p) { return '<option value="' + p.id + '">' + esc(p.ad) + "</option>"; }).join("") + '</select></label><div class="sp-hedef"><b id="spDH">' + SP.sayi(k1.uye) + '</b><span id="spDK">' + k1.ad + " kategorisindeki üye (yaklaşık " + Math.round(k1.uye * 0.78) + " bireysel, " + Math.round(k1.uye * 0.22) + ' kurumsal)</span></div><button class="sp-btn tam" data-duyuru="' + ilk.id + '">' + SP.ui("mail", 16) + " Duyuruyu gönder</button></div>" +
        '<div class="sp-eposta" id="spDO">' + duyuruHtml(ilk) + "</div></div><h2>Gönderilen duyurular</h2>" + '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>İlan</th><th>Alıcı</th><th>Açılma</th><th>Tarih</th></tr></thead><tbody>' + S.duyuru.map(function (d, i) { var p = SP.urun(d.urun); return '<tr><td data-l="İlan">' + urunHucre(p) + '</td><td data-l="Alıcı">' + SP.sayi(d.kisi) + ' üye</td><td data-l="Açılma">%' + (i === 0 && Date.now() - d.t < DK ? "–" : 38 + (i * 7) % 20) + '</td><td data-l="Tarih">' + SP.once(d.t) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    } else if (sekme === "ilanlar") {
      var bl = V.KISI.bireysel.ilan.concat(S.bireyselIlan);
      ic = '<div class="sp-hak"><div><b>' + bl.length + " / 3</b> ücretsiz ilan hakkı kullanıldı</div><div class=\"sp-geri-bar\"><i style=\"width:" + bl.length / 3 * 100 + '%"></i></div><small>Bireysel ilanların süresi yoktur. ' + (bl.length < 3 ? "1 ilan hakkınız kaldı." : "Daha fazla ilan için kurumsal pakete geçin.") + "</small></div>" +
        '<div class="sp-mini-izgara">' + bl.map(function (x, i) { return '<div class="sp-mini">' + '<div class="sp-mini-img">' + SP.gorsel({ id: "b" + (i + 3), kat: x.kat, ikon: x.ikon, ad: x.ad, kod: "BİREYSEL İLAN" }) + "</div><b>" + esc(x.ad) + "</b><span>" + SP.tl(x.fiyat) + " / " + esc(x.birim) + "</span><small>Yayında · teklif alma kapalı</small></div>"; }).join("") +
        (bl.length < 3 ? '<button class="sp-mini sp-mini-ekle" data-ilan-ver>' + SP.ui("arti", 30) + "<b>Yeni ilan ver</b><small>1 hakkınız kaldı</small></button>" : "") + "</div>" +
        '<div class="sp-uyari">' + SP.ui("kilit", 18) + '<div><b>Bireysel ilanlarda teklif alma yoktur.</b> Teklif almak, Hemen Al eşiği kullanmak ve 10–25 ilan vermek için <a href="#/paketler">kurumsal paketleri</a> inceleyin.</div></div>';
    } else if (sekme === "profil") {
      var b = V.KISI.bireysel;
      ic = '<div class="sp-profil"><dl><dt>Ad soyad</dt><dd>' + b.ad + "</dd><dt>Adres</dt><dd>" + b.il + "</dd><dt>E-posta</dt><dd>" + b.eposta + " " + SP.tikRozet(true, "doğrulandı") + "</dd><dt>Cep telefonu</dt><dd>" + b.tel + " " + SP.tikRozet(true, "doğrulandı") + "</dd><dt>Faaliyet alanı</dt><dd>" + S.kat.bireysel.map(function (k) { return '<span class="sp-cip">' + KAT[k].ad + "</span>"; }).join(" ") + ' <a href="#/hesabim?sekme=akis">Düzenle</a></dd><dt>Üyelik</dt><dd>Bireysel · ücretsiz · süresiz</dd></dl><p class="sp-bilgi">' + SP.ui("kalkan", 16) + " Doğrulanmış bilgileriniz üye sayfanızda yeşil tik ile gösterilir. Doğrulama olmadan ilan verilemez.</p></div>";
    } else if (sekme === "yukselt") {
      ic = '<div class="sp-yukselt"><h2>Teklif verin, teklif alın, otomatik satın</h2><p>Bireysel hesapta ürünleri görür, mesaj alırsınız. Kurumsal pakette teklif ve alım talebi gönderir, Hemen Al eşiğiyle satış yaparsınız.</p><div class="sp-m-btns"><a class="sp-btn" href="#/paketler">Paketleri karşılaştır</a><button class="sp-btn ghost" data-hesap-sec="kurumsal">Demoda kurumsal hesabı dene</button></div></div>';
    }
    return '<section class="sp-sayfa sp-panel">' + bas + nav + '<div class="sp-panel-ic">' + ic + '</div><p class="sp-demo-not">Demo verisi tarayıcınızda saklanır. <button class="sp-link" data-sifirla>Demoyu sıfırla</button></p></section>';
  };
  function duyuruHtml(p) {
    var k = KAT[p.kat], f = FIR[p.firma];
    return '<div class="sp-eposta-bas"><span class="sp-rozet">Önizleme</span><div><b>StokPazarı</b> &lt;duyuru@stokpazari.ornek&gt;<br><small>Kime: ' + k.ad + " kategorisindeki üyeler</small></div></div><div class=\"sp-eposta-konu\">Yeni ilan: " + esc(p.ad) + '</div><div class="sp-eposta-govde"><div class="sp-eposta-urun">' + SP.gorsel(p) + "</div><p><b>" + esc(f.ad) + "</b> faaliyet alanınızdaki yeni ilanını duyuruyor:</p><p><b>" + esc(p.ad) + "</b><br>" + SP.tl(p.fiyat) + " / " + esc(p.birim) + " · Stok " + SP.sayi(p.stok) + " " + esc(p.birim) + (p.hemenAl ? " · Hemen Al: " + SP.tl(SP.esik(p)) + " ve üstü teklifler anında onaylanır" : "") + "</p><p>İlanı görmek ve teklif vermek için StokPazarı'na giriş yapın.</p></div>";
  }
  SP.duyuruOnizle = function (pid) {
    var p = SP.urun(pid), k = KAT[p.kat];
    document.getElementById("spDO").innerHTML = duyuruHtml(p);
    document.getElementById("spDH").textContent = SP.sayi(k.uye);
    document.getElementById("spDK").textContent = k.ad + " kategorisindeki üye (yaklaşık " + Math.round(k.uye * 0.78) + " bireysel, " + Math.round(k.uye * 0.22) + " kurumsal)";
  };
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.esikAyar) {
      var y = +el.value, f = +el.dataset.fiyat, kap = el.parentNode;
      kap.querySelector("b").textContent = y ? "%" + y : "Kapalı";
      kap.querySelector("small").textContent = y ? SP.tl(Math.round(f * (1 - y / 100) * 100) / 100) + " ve üstü otomatik satılır" : "Bütün teklifler onayınıza gelir";
      SP.hemenAlAyarla(el.dataset.esikAyar, y);
    }
  });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.esikAyar) SP.toast("Hemen Al eşiği kaydedildi", el.value > 0 ? "%" + el.value + " eşik: bu tutar ve üstündeki teklifler otomatik satışa döner." : "Eşik kapatıldı; bütün teklifler onayınıza gelecek.", "ok");
    if (el.dataset && el.dataset.siklik) { S.bildirimSiklik = el.dataset.siklik; kaydet(); SP.toast("Bildirim tercihi kaydedildi", { aninda: "Yeni ilan girildiğinde anında e-posta alacaksınız.", gunluk: "Her sabah 08:00'de günlük özet gelecek.", kapali: "Yeni ürün e-postaları kapatıldı." }[el.dataset.siklik], "ok"); }
  });

  /* başlat */
  SP.basla = function (tasarim) {
    SP.tasarim = tasarim;
    window.addEventListener("hashchange", function () { SP.kapat(); SP.ciz(false); window.scrollTo(0, 0); });
    SP.ciz(false);
  };
})();
