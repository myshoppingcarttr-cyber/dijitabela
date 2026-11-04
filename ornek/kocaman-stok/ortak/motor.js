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
  var ANAHTAR = "stokpazari-demo-v5";
  var DEMO = { bireysel: "selin", basic: "gokdere", kurumsal: "toroslu" };
  V.BIREYSEL.forEach(function (f) { FIR[f.id] = f; });
  function tohum() {
    var t0 = Date.now();
    function zaman(o) { var c = JSON.parse(JSON.stringify(o)); c.t = t0 - (c.dk || 0) * DK; return c; }
    var kat = {}; Object.keys(V.KISI).forEach(function (k) { kat[k] = V.KISI[k].kat.slice(); });
    return {
      v: 5, t0: t0, aktif: "toroslu", uyeler: [], duzen: {}, satis: [],
      urun: {
        b1: { ilkT: t0 - 27 * GUN, yayinT: t0 - 27 * GUN, yenileme: 0 },
        b2: { ilkT: t0 - 85 * GUN, yayinT: t0 - 25 * GUN, yenileme: 2 },
        p56: { ilkT: t0 - 31 * GUN, yayinT: t0 - 31 * GUN, yenileme: 0 },
        p55: { ilkT: t0 - 370 * GUN, yayinT: t0 - 31 * GUN, yenileme: 11 }
      },
      yeni: [],
      teklif: V.TEKLIF.map(zaman).concat([
        { id: "ts1", urun: "b1", firma: "mavisehir", fiyat: 3600, adet: 1, t: t0 - 3 * SAAT, durum: "bekliyor" },
        { id: "tg1", urun: "p4", firma: "camlibel", fiyat: 1040, adet: 20, t: t0 - 5 * SAAT, durum: "bekliyor" }
      ]),
      verilen: V.VERILEN.map(zaman).map(function (v) { v.veren = "toroslu"; return v; }),
      talep: V.TALEP.map(zaman), gidenTalep: [],
      mesaj: { toroslu: V.MESAJ.kurumsal.map(zaman), selin: V.MESAJ.bireysel.map(zaman), gokdere: [] },
      kat: kat,
      goster: {}, duyuru: [{ urun: "p53", t: t0 - 0.9 * GUN, kisi: 268 }, { urun: "p9", t: t0 - 2 * GUN, kisi: 268 }, { urun: "p49", t: t0 - 3.5 * GUN, kisi: 268 }, { urun: "p10", t: t0 - 5 * GUN, kisi: 268 }, { urun: "p54", t: t0 - 9 * GUN, kisi: 266 }, { urun: "p55", t: t0 - 14 * GUN, kisi: 261 }], bildirimSiklik: "aninda"
    };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(ANAHTAR)); } catch (e) { S = null; }
  if (!S || S.v !== 5) S = tohum();
  S.uyeler.forEach(function (f) { FIR[f.id] = f; if (f.paket !== "bireysel") V.FIRMA.unshift(f); });
  SP.S = S;
  function kaydet() {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(S)); return true; }
    catch (e) { SP.toast("Tarayıcı belleği doldu", "Yüklediğiniz resimler bu tarayıcıya sığmadı. Daha küçük bir resim deneyin ya da demoyu sıfırlayın.", "uyari"); return false; }
  }
  SP.sifirla = function () { try { localStorage.removeItem(ANAHTAR); } catch (e) {} location.hash = "#/"; location.reload(); };
  function yaz(pid, o) { var m = S.urun[pid] || {}; for (var k in o) m[k] = o[k]; S.urun[pid] = m; }
  function yonetilen(id) { return id === "selin" || id === "toroslu" || id === "gokdere" || S.uyeler.some(function (u) { return u.id === id; }); }
  function yuvarla(n) { return Math.round(n * 100) / 100; }

  SP.ben = function () { return S.aktif ? FIR[S.aktif] : null; };
  SP.hesap = function () { var b = SP.ben(); return b ? b.paket : "misafir"; };
  SP.kurumsal = function () { var h = SP.hesap(); return h === "kurumsal" || h === "basic"; };
  SP.gold = function () { return SP.hesap() === "kurumsal"; };
  SP.benimFirma = function () { return S.aktif; };
  SP.kisi = function () { var b = SP.ben(); return b ? { ad: b.yetkili, eposta: b.eposta, tel: b.tel } : { ad: "Misafir", eposta: "", tel: "" }; };
  SP.paketAd = function (f) { return f.paket === "kurumsal" ? "GOLD KURUMSAL" : f.paket === "basic" ? "BASIC KURUMSAL" : "BİREYSEL"; };
  function ilanHakSayi(p) { return p === "kurumsal" ? 25 : p === "basic" ? 10 : 3; }
  function resimHakSayi(p) { return p === "kurumsal" ? 5 : p === "basic" ? 1 : 0; }
  SP.setHesap = function (h) {
    var id = DEMO[h]; if (!id) return;
    S.aktif = id; kaydet(); SP.ciz(true);
    SP.toast({ bireysel: "Bireysel örnek hesap", basic: "Basic kurumsal örnek hesap", kurumsal: "Gold kurumsal örnek hesap" }[h], { bireysel: "Selin Arıkan olarak geziyorsunuz: yılda 3 ilan, teklif verme ve teklif alma açık, üye sayfasında banner yükleme yok.", basic: "Gökdere Tarım olarak geziyorsunuz: 10 ilan, logo, üst banner ve 1 tanıtım resmi.", kurumsal: "Toroslu Mobilya olarak geziyorsunuz: 25 ilan, logo, üst banner ve kayan slayt 5 tanıtım resmi." }[h], "bilgi");
  };
  function uyeGerek() {
    if (S.aktif) return false;
    SP.modal('<div class="sp-m-ikon kilit">' + SP.ui("kisi", 26) + '</div><h3>Önce üye olun</h3><p class="sp-m-p">Satın almak, teklif vermek ve ilan girmek için üyelik gerekir. Bireysel üyelik ücretsizdir.</p><div class="sp-m-btns"><a class="sp-btn" href="#/uye-ol" data-kapat>Üye ol</a><button class="sp-btn ghost" data-hesap-sec="kurumsal" data-kapat>Örnek hesapla dene</button></div>', "dar");
    return true;
  }

  /* ---------- ürün ---------- */
  function birlestir(b) {
    var o = S.urun[b.id] || {}, p = {};
    for (var k in b) p[k] = b[k];
    for (var j in o) p[j] = o[j];
    if (!p.t) p.t = S.t0 - p.gun * GUN;
    if (!p.ilkT) p.ilkT = p.t;
    if (!p.yayinT) p.yayinT = p.ilkT;
    p.yenileme = p.yenileme || 0; p.hemenAl = +p.hemenAl || 0; p.hemenUst = +p.hemenUst || 0;
    if (p.durum !== "aktif" && !p.satisT) p.satisT = S.t0 - p.satisSaat * SAAT;
    if (p.durum === "satildi" && (p.pasifT || Date.now() - p.satisT > 3 * GUN)) p.durum = "arsiv";
    if (p.durum === "aktif") {
      var f = FIR[p.firma], bit = p.yayinT + 30 * GUN;
      if (f && f.paket !== "bireysel" && bit > p.ilkT + 365 * GUN) bit = p.ilkT + 365 * GUN;
      p.bitisT = bit;
      if (p.durdu || Date.now() > bit) p.durum = "pasif";
    }
    return p;
  }
  function hamListe() { return S.yeni.concat(V.URUN).map(birlestir); }
  /* süresi dolan ya da sahibinin durdurduğu ilan genel listelerde görünmez */
  SP.tumUrun = function () { return hamListe().filter(function (p) { return p.durum !== "pasif"; }); };
  SP.benimIlanlar = function (fid) { return hamListe().filter(function (p) { return p.firma === fid; }); };
  SP.urun = function (id) { var l = hamListe(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; };
  SP.esik = function (p) { return p.hemenAl > 0 ? yuvarla(p.fiyat * (1 - p.hemenAl / 100)) : null; };
  SP.hemenAralik = function (p) { return { alt: yuvarla(p.fiyat * (1 - p.hemenAl / 100)), ust: yuvarla(p.fiyat * (1 + p.hemenUst / 100)) }; };
  /* yalnız sunucu tarafı mantığı: alıcıya hiçbir ekranda gösterilmez */
  function hemenIcinde(p, fiyat) { if (!(p.hemenAl > 0 || p.hemenUst > 0)) return false; var a = SP.hemenAralik(p); return fiyat >= a.alt && fiyat <= a.ust; }
  SP.ilanHak = function (f) {
    var hak = ilanHakSayi(f.paket), l = SP.benimIlanlar(f.id), yil = new Date().getFullYear(), kul;
    if (f.paket === "bireysel") kul = l.filter(function (p) { return new Date(p.ilkT).getFullYear() === yil; }).length;
    else kul = l.filter(function (p) { return p.durum === "aktif"; }).length;
    return { hak: hak, kul: kul, kalan: Math.max(0, hak - kul) };
  };
  /* ilan yaşam döngüsü: bireysel 30 gün + 2 yenileme (en fazla 90 gün); kurumsal 30 günde pasif, en fazla 1 yıl; satılan yayına dönmez */
  SP.ilanDurum = function (p) {
    var f = FIR[p.firma], bir = f.paket === "bireysel", satildi = p.durum === "satildi" || p.durum === "arsiv";
    var d = { satildi: satildi, kalanGun: p.durum === "aktif" ? Math.max(0, Math.ceil((p.bitisT - Date.now()) / GUN)) : 0, yenilenebilir: false, neden: "" };
    if (satildi) { d.neden = "Satılan ilan tekrar yayına alınamaz. Yeni ilan oluşturmanız gerekir."; return d; }
    if (bir) {
      d.kalanYenileme = Math.max(0, 2 - p.yenileme);
      d.yenilenebilir = p.yenileme < 2;
      if (!d.yenilenebilir) d.neden = "Bu ilan 2 yenileme hakkını kullandı (toplam 90 gün). Üçüncü kez yayına alınamaz.";
    } else {
      d.yilBitis = p.ilkT + 365 * GUN;
      d.yenilenebilir = Date.now() < d.yilBitis;
      if (!d.yenilenebilir) d.neden = "1 ilan en fazla 1 yıl yayında kalır. Süresi dolan ilan yeniden yayınlanamaz, yeni ilan girin.";
    }
    return d;
  };
  SP.pasifHTML = function (p) {
    var f = FIR[p.firma], sahip = p.firma === S.aktif, d = SP.ilanDurum(p);
    return '<section class="sp-sayfa"><div class="sp-uyari">' + SP.ui("saat", 18) + "<div><b>" + esc(p.ad) + " şu an yayında değil.</b> " + (p.durdu ? "İlan sahibi ilanı pasife aldı." : "İlanın 30 günlük yayın süresi doldu.") + (sahip ? " " + (d.yenilenebilir ? "İlanlarım sekmesinden güncelleyip tekrar yayına alabilirsiniz." : d.neden) : "") + '</div></div><p><a class="sp-btn" href="' + (sahip ? "#/hesabim?sekme=ilanlar" : "#/firma/" + f.id) + '">' + (sahip ? "İlanlarıma git" : "Satıcı sayfasına git") + "</a></p></section>";
  };
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
    boy = boy || 48;
    var dzl = S.duzen[f.id];
    if (dzl && dzl.logo) return '<img class="sp-logo" src="' + dzl.logo + '" width="' + boy + '" height="' + boy + '" alt="' + esc(f.ad) + ' logosu" style="object-fit:cover">';
    var c = KAT[f.kat[0]].renk, v = f.no % 3, b = SP.bas(f.ad), c2 = karis(c, "#000000", 0.3);
    var sekil = v === 0 ? '<rect width="64" height="64" rx="14" fill="' + c + '"/>' : v === 1 ? '<circle cx="32" cy="32" r="32" fill="' + c2 + '"/>' : '<rect width="64" height="64" rx="6" fill="' + c2 + '"/><path d="M0 46 L64 30 V64 H0Z" fill="' + c + '"/>';
    return '<svg class="sp-logo" width="' + boy + '" height="' + boy + '" viewBox="0 0 64 64" role="img" aria-label="' + esc(f.ad) + ' logosu">' + sekil +
      '<text x="32" y="41" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="' + (b.length > 1 ? 23 : 28) + '" fill="#fff" letter-spacing="-.5">' + esc(b) + "</text></svg>";
  };
  SP.banner = function (f) {
    var dzb = S.duzen[f.id];
    if (f.paket !== "bireysel" && dzb && dzb.banner) return '<img class="sp-banner" src="' + dzb.banner + '" alt="' + esc(f.ad) + ' banner" style="object-fit:cover">';
    if (f.paket === "bireysel") {
      var kk = KAT[f.kat[0]], kr = karis(kk.renk, "#0b0f16", 0.35);
      return '<svg class="sp-banner" viewBox="0 0 1400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Reklam alanı"><rect width="1400" height="260" fill="' + kr + '"/><circle cx="1180" cy="40" r="240" fill="' + kk.renk + '" opacity=".55"/><g transform="translate(1090 60) scale(2.2)" opacity=".5">' + SP.simge(kk.ikon, "#fff", "none", 1.6) + '</g><text x="70" y="108" font-family="system-ui,Segoe UI,Arial" font-weight="800" font-size="50" fill="#fff">' + esc(kk.ad) + ' kategorisine özel reklam alanı</text><text x="70" y="160" font-family="system-ui,Segoe UI,Arial" font-weight="500" font-size="26" fill="#fff" opacity=".85">Örnek banner · Bu alanı site yönetimi reklam için kullanır</text></svg>';
    }
    var c = KAT[f.kat[0]].renk, d = karis(c, "#0b0f16", 0.55), ik = KAT[f.kat[0]].ikon, s = "";
    for (var i = 0; i < 9; i++) s += '<g transform="translate(' + (60 + i * 140) + " " + (i % 2 ? 40 : 120) + ') scale(1.6)" opacity=".13">' + SP.simge(i % 3 === 1 ? "koli" : i % 3 === 2 ? "kamyon" : ik, "#fff", "none", 1.6) + "</g>";
    return '<svg class="sp-banner" viewBox="0 0 1400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="1400" height="260" fill="' + d + '"/><circle cx="1150" cy="60" r="260" fill="' + c + '" opacity=".45"/><circle cx="200" cy="300" r="200" fill="' + c + '" opacity=".25"/>' + s + "</svg>";
  };
  var TANITIM = [["Üretim alanı", "disli"], ["Depo ve stok", "raf"], ["Showroom", null], ["Sevkiyat", "kamyon"], ["Ekibimiz", "ekip"]];
  SP.tanitimAd = function (i) { return TANITIM[i][0]; };
  SP.tanitim = function (f, i) {
    var dzt = S.duzen[f.id];
    if (dzt && dzt.resim && dzt.resim[i]) return '<img class="sp-img" src="' + dzt.resim[i] + '" alt="' + esc(TANITIM[i][0]) + '" style="width:100%;height:100%;object-fit:cover;display:block">';
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
    return '<div class="sp-m-urun"><div class="sp-m-img">' + SP.gorsel(p) + '</div><div><b>' + esc(p.ad) + "</b><small>" + esc(f.ad) + " · " + esc(p.kod) + '</small><div class="sp-m-fiyat">' + SP.tl(p.fiyat) + " <small>/ " + esc(p.birim) + "</small></div><small>Stok: " + SP.sayi(p.stok) + " " + esc(p.birim) + "</small></div></div>";
  }
  SP.yukselt = function (ne) {
    return SP.modal('<div class="sp-m-ikon kilit">' + SP.ui("kilit", 26) + '</div><h3>Bu özellik kurumsal üyelikte açık</h3><p class="sp-m-p">' + esc(ne || "Bu özellik") + " kurumsal paketlerde kullanılabilir. <b>Hesabınızı yükselterek bu özelliği kullanabilirsiniz.</b></p>" +
      '<ul class="sp-m-liste"><li>' + SP.ui("tik", 15) + "Basic: 10 ilan, logo, üst banner, 1 tanıtım resmi</li><li>" + SP.ui("tik", 15) + "Gold: 25 ilan, logo, üst banner, kayan slayt 5 tanıtım resmi</li><li>" + SP.ui("tik", 15) + "Kendi banner resminizi yükleme</li></ul>" +
      '<div class="sp-m-btns"><a class="sp-btn" href="#/paketler" data-kapat>Paketleri incele</a></div>', "dar");
  };
  /* Satın al: alıcı stoğun tamamını ilan fiyatından alır (parça alım teklifle) */
  SP.satinAlPenceresi = function (pid) {
    var p = SP.urun(pid); if (!p) return;
    if (uyeGerek()) return;
    if (p.firma === S.aktif) return SP.toast("Bu sizin ilanınız", "Kendi ilanınızı satın alamazsınız.", "bilgi");
    if (p.durum !== "aktif") return SP.talepPenceresi(pid);
    var top = yuvarla(p.fiyat * p.stok);
    var m = SP.modal("<h3>Satın al</h3>" + urunBas(p) +
      '<div class="sp-m-top">Stoğun tamamı: <b>' + SP.sayi(p.stok) + " " + esc(p.birim) + " × " + SP.tl(p.fiyat) + " = " + SP.tl(top) + '</b></div>' +
      '<p class="sp-m-p">Satın al ile ürünün tamamını ilan fiyatından alırsınız. Farklı miktar ya da fiyat istiyorsanız teklif verin.</p>' +
      '<div class="sp-m-btns"><button class="sp-btn" id="spSAG">Satın almayı onayla</button><button class="sp-btn ghost" data-teklif="' + p.id + '">Teklif ver</button></div>' +
      '<p class="sp-m-not">Sitede ödeme alınmaz; ödeme ve sevkiyat satıcıyla doğrudan yapılır. Para göndermeden önce malı görün, ödemeyi satıcının kendi hesabına yapın.</p>');
    m.querySelector("#spSAG").onclick = function () { SP.kapat(); satisYap(p, SP.ben(), p.fiyat, p.stok, "satin-al"); };
  };
  /* Teklif, Satın al ve satıcı kabulünün ortak satış kaydı. Kalan stok varsa ilan yayında kalır. */
  function satisYap(p, alici, fiyat, adet, tur) {
    var pid = p.id, f = FIR[p.firma], simdi = Date.now(), kalan = p.stok - adet, tumu = kalan <= 0, top = yuvarla(adet * fiyat);
    if (tumu) {
      yaz(pid, { durum: "satildi", satisT: simdi, alici: alici.id, satisFiyat: fiyat, satisAdet: adet });
      S.teklif.forEach(function (x) { if (x.urun === pid && x.durum === "bekliyor") x.durum = "kapandi"; });
    } else yaz(pid, { stok: kalan });
    S.satis.unshift({ urun: pid, satici: p.firma, alici: alici.id, fiyat: fiyat, adet: adet, t: simdi, tur: tur, ad: p.ad, birim: p.birim });
    kaydet(); SP.ciz(true);
    SP.toast(tumu ? "Satış tamamlandı" : "Satış tamamlandı, stok güncellendi", esc(p.ad) + " · " + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + (tumu ? ". Ürün artık SATILDI etiketiyle listede." : ". Kalan stok: " + SP.sayi(kalan) + " " + esc(p.birim) + "."), "ok");
    var neden = tur === "satin-al" ? "ilan fiyatından satın alındı" : tur === "otomatik" ? "teklif otomatik kabul edildi" : "teklif satıcı tarafından kabul edildi";
    SP.epostaGonder([
      { kime: alici.yetkili + " <" + alici.eposta + ">", rol: "Alıcıya", konu: "Satın alma onaylandı · " + p.ad, govde: ["Sayın " + esc(alici.yetkili) + ",", esc(f.ad) + " satıcısının <b>" + esc(p.ad) + "</b> ilanında satış tamamlandı.", "<b>" + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + " = " + SP.tl(top) + "</b>", "Satıcı: " + esc(f.yetkili) + " · " + esc(f.tel) + " · " + esc(f.eposta), "Ödeme ve sevkiyatı satıcıyla doğrudan planlayın. Para göndermeden önce malı görün."] },
      { kime: f.yetkili + " <" + f.eposta + ">", rol: "Satıcıya", konu: "İlanınızda satış · " + p.ad, govde: ["Sayın " + esc(f.yetkili) + ",", "<b>" + esc(p.ad) + "</b> ilanınızda " + esc(alici.ad) + " ile satış gerçekleşti (" + neden + ").", "<b>" + SP.sayi(adet) + " " + esc(p.birim) + " × " + SP.tl(fiyat) + " = " + SP.tl(top) + "</b>", "Alıcı: " + esc(alici.yetkili) + " · " + esc(alici.tel), tumu ? "Hatırlatma: ilanınızı 3 gün içinde pasife almazsanız sistem otomatik olarak yayından kaldırır." : "Kalan stok: " + SP.sayi(kalan) + " " + esc(p.birim) + ". İlan yayında kalmaya devam ediyor."] }
    ]);
  }
  SP.teklifPenceresi = function (pid, hazirFiyat) {
    var p = SP.urun(pid); if (!p) return;
    if (uyeGerek()) return;
    if (p.firma === S.aktif) { SP.toast("Bu sizin ilanınız", "Kendi ilanınıza teklif veremezsiniz. Gelen teklifleri panelinizden yönetin.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=teklifler">Gelen teklifler →</a>'); return; }
    if (p.durum !== "aktif") return SP.talepPenceresi(pid);
    var ilk = hazirFiyat || Math.round(p.fiyat * 0.94);
    var m = SP.modal('<h3>Teklif ver</h3>' + urunBas(p) +
      '<div class="sp-m-grid"><label>Teklif fiyatı <small>(birim, TL)</small><input type="number" inputmode="decimal" step="0.01" min="0" id="spTF" value="' + ilk + '"></label>' +
      '<label>Adet / miktar <small>(' + esc(p.birim) + ')</small><input type="number" inputmode="numeric" min="1" max="' + p.stok + '" id="spTA" value="1"></label></div>' +
      '<div class="sp-m-top" id="spTT"></div><div class="sp-m-sonuc hata" id="spTH" hidden></div>' +
      '<button class="sp-btn tam" id="spTG">Teklifi gönder</button><p class="sp-m-not">Teklif bağlayıcıdır. Sonuç gönderince ekranda görünür: kabul edilirse satış kesinleşir, değilse teklifiniz satıcıya iletilir. Ödeme ve sevkiyat satıcıyla doğrudan yapılır; sitede ödeme alınmaz.</p>');
    var tf = m.querySelector("#spTF"), ta = m.querySelector("#spTA"), tt = m.querySelector("#spTT");
    function guncel() {
      var f = parseFloat(tf.value) || 0, a = parseInt(ta.value, 10) || 0;
      tt.innerHTML = "Toplam: <b>" + SP.tl(yuvarla(f * a)) + "</b> <span>(" + SP.sayi(a) + " " + esc(p.birim) + " × " + SP.tl(f) + ")</span>";
    }
    tf.oninput = ta.oninput = guncel;
    m.querySelector("#spTG").onclick = function () { SP.teklifVer(pid, parseFloat(tf.value), parseInt(ta.value, 10)); };
    guncel();
  };
  SP.teklifVer = function (pid, fiyat, adet) {
    var p = SP.urun(pid);
    if (uyeGerek()) return;
    if (!(fiyat > 0)) return SP.toast("Teklif fiyatı girin", "Birim fiyat sıfırdan büyük olmalı.", "uyari");
    if (!(adet >= 1)) return SP.toast("Miktar girin", "En az 1 " + p.birim + " yazın.", "uyari");
    if (adet > p.stok) return SP.toast("Stoktan fazla miktar", "Bu ilanda en fazla " + SP.sayi(p.stok) + " " + p.birim + " var.", "uyari");
    var f = FIR[p.firma], ben = SP.ben(), simdi = Date.now();
    SP.kapat();
    if (hemenIcinde(p, fiyat)) {
      S.verilen.unshift({ id: "v" + simdi, veren: ben.id, urun: pid, fiyat: fiyat, adet: adet, t: simdi, durum: "kabul-otomatik", mesaj: "" });
      satisYap(p, ben, fiyat, adet, "otomatik");
      return;
    }
    var kayit = { id: "v" + simdi, veren: ben.id, urun: pid, fiyat: fiyat, adet: adet, t: simdi, durum: "bekliyor", mesaj: "" };
    S.verilen.unshift(kayit);
    if (yonetilen(p.firma)) {
      S.teklif.unshift({ id: "t" + simdi, urun: pid, firma: ben.id, fiyat: fiyat, adet: adet, t: simdi, durum: "bekliyor", bag: kayit.id });
      kaydet(); SP.ciz(true);
      SP.toast("Teklifiniz satıcıya iletildi", esc(f.ad) + " teklifinizi kabul ya da reddedebilir. Üstteki hesap düğmesiyle satıcı hesabına geçip deneyebilirsiniz.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=verilen">Verdiğim teklifler →</a>');
      return;
    }
    kaydet(); SP.ciz(true);
    SP.toast("Teklifiniz satıcıya iletildi", esc(f.ad) + " teklifinizi kabul ya da reddedebilir.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=verilen">Verdiğim teklifler →</a>');
    /* prototipte diğer firmalar gerçek kişi olmadığı için örnek karşı teklif üretilir */
    setTimeout(function () {
      var karsi = Math.round(p.fiyat * 0.97);
      var msj = "Merhaba " + ben.yetkili.split(" ")[0] + ", " + SP.tl(fiyat) + " teklifiniz için teşekkürler. Bu fiyattan veremiyorum ama " + SP.tl(karsi) + "'den satabilirim.";
      kayit = null;
      S.verilen.forEach(function (v) { if (v.id === "v" + simdi) { v.durum = "reddedildi"; v.mesaj = msj; } });
      if (!S.mesaj[ben.id]) S.mesaj[ben.id] = [];
      S.mesaj[ben.id].unshift({ id: "m" + Date.now(), kim: f.id, konu: p.ad + " teklifiniz", t: Date.now(), okunmadi: true, akis: [["ben", SP.sayi(adet) + " " + p.birim + " için " + SP.tl(fiyat) + " teklif verdim."], ["o", msj]] });
      kaydet(); SP.ciz(true);
      SP.toast("Satıcı yanıt verdi (örnek)", esc(f.ad) + ": “" + SP.tl(karsi) + "'den satabilirim.”", "mail", '<a class="sp-toast-a" href="#/hesabim?sekme=mesajlar">Mesajı oku →</a>');
    }, 7000);
  };
  SP.talepPenceresi = function (pid) {
    var p = SP.urun(pid); if (!p) return;
    if (uyeGerek()) return;
    if (p.firma === S.aktif) return SP.toast("Bu sizin ilanınız", "Gelen alım taleplerini panelinizde görürsünüz.", "bilgi", '<a class="sp-toast-a" href="#/hesabim?sekme=talepler">Alım talepleri →</a>');
    var m = SP.modal("<h3>Alım talebi gönder</h3><p class=\"sp-m-p\">Bu ürün satıldı. Aynı üründen almak istiyorsanız satıcıya miktarı ve istediğiniz fiyatı iletin; benzer stok ya da yeni üretim olduğunda size dönsün.</p>" + urunBas(p) +
      '<div class="sp-m-grid"><label>Ürün<input type="text" value="' + esc(p.ad) + '" readonly></label><label>Adet / kilo <small>(' + esc(p.birim) + ')</small><input type="number" id="spAA" value="1" min="1"></label><label>İstediğiniz birim fiyat <small>(TL)</small><input type="number" step="0.01" id="spAF" value="' + p.fiyat + '"></label><label class="genis">Not <small>(isteğe bağlı)</small><textarea id="spAN" rows="2" placeholder="Teslim yeri, termin, renk vb."></textarea></label></div>' +
      '<button class="sp-btn tam" id="spAG">Talebi gönder</button>');
    m.querySelector("#spAG").onclick = function () {
      var a = parseFloat(m.querySelector("#spAA").value), fy = parseFloat(m.querySelector("#spAF").value), not = m.querySelector("#spAN").value, simdi = Date.now();
      if (!(a > 0) || !(fy > 0)) return SP.toast("Miktar ve fiyat girin", "", "uyari");
      S.gidenTalep.unshift({ id: "g" + simdi, veren: S.aktif, urun: pid, adet: a, fiyat: fy, not: not, t: simdi });
      if (yonetilen(p.firma)) S.talep.unshift({ id: "a" + simdi, urun: pid, firma: S.aktif, adet: a, fiyat: fy, not: not || "Not yazılmadı.", t: simdi });
      kaydet(); SP.kapat(); SP.ciz(true);
      SP.toast("Alım talebiniz iletildi", esc(FIR[p.firma].ad) + " talebinizi panelinde görür. Gerçek sistemde satıcıya e-posta da gider.", "ok");
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
    SP.toast("Gerçek sistemde iki tarafa e-posta gider", liste.map(function (x) { return x.rol + ": " + esc(x.konu); }).join("<br>"), "mail", '<button class="sp-toast-a" data-eposta-goster>E-postaları önizle →</button>');
  };
  SP.epostaOnizle = function (liste) {
    liste = liste || S.sonEposta || [];
    SP.modal("<h3>E-posta önizlemesi (prototipte gönderilmez)</h3>" + liste.map(function (x) {
      return '<div class="sp-eposta"><div class="sp-eposta-bas"><span class="sp-rozet">' + esc(x.rol) + "</span><div><b>StokPazarı</b> &lt;bildirim@stokpazari.ornek&gt;<br><small>Kime: " + esc(x.kime) + '</small></div></div><div class="sp-eposta-konu">' + esc(x.konu) + '</div><div class="sp-eposta-govde">' + x.govde.map(function (g) { return "<p>" + g + "</p>"; }).join("") + "</div></div>";
    }).join(""), "genis");
  };

  /* ---------- satıcı eylemleri ---------- */
  function teklifBul(id) { for (var i = 0; i < S.teklif.length; i++) if (S.teklif[i].id === id) return S.teklif[i]; }
  function verilenBag(o, durum, mesaj) { if (!o.bag) return; S.verilen.forEach(function (v) { if (v.id === o.bag) { v.durum = durum; v.mesaj = mesaj || ""; } }); }
  SP.kabul = function (oid) {
    var o = teklifBul(oid), p = SP.urun(o.urun), f = FIR[o.firma];
    if (p.durum !== "aktif") return SP.toast("Bu ilan yayında değil", "Teklifi kabul etmek için ilanın yayında olması gerekir.", "uyari");
    if (o.adet > p.stok) return SP.toast("Stok yetmiyor", "Bu teklif " + SP.sayi(o.adet) + " " + p.birim + " istiyor, stokta " + SP.sayi(p.stok) + " " + p.birim + " var.", "uyari");
    o.durum = "kabul"; verilenBag(o, "kabul");
    satisYap(p, f, o.fiyat, o.adet, "kabul");
  };
  SP.reddet = function (oid) {
    var o = teklifBul(oid), p = SP.urun(o.urun), f = FIR[o.firma], onerilen = SP.esik(p) || Math.round(p.fiyat * 0.95);
    var hitap = f.yetkili.split(" ")[0];
    var m = SP.modal("<h3>Teklifi reddet</h3><p class=\"sp-m-p\"><b>" + esc(f.ad) + "</b> · " + esc(p.ad) + " için " + SP.tl(o.fiyat) + " × " + SP.sayi(o.adet) + " teklif verdi. Reddederken teklif verene kısa bir mesaj yazabilirsiniz; satış çoğu zaman bu mesajla devam eder.</p>" +
      '<label class="sp-m-tek">Mesajınız<textarea id="spRM" rows="4">Merhaba ' + esc(hitap) + ", " + SP.tl(o.fiyat) + " teklifiniz için teşekkürler. " + SP.tl(onerilen) + "'den satabilirim; ilana bu fiyattan teklif verirseniz hemen onaylarım.</textarea></label>" +
      '<div class="sp-m-btns"><button class="sp-btn" id="spRG">Reddet ve mesaj gönder</button><button class="sp-btn ghost" id="spRS">Mesajsız reddet</button></div><p class="sp-m-not">Teklif alan satıcılar, teklif verene yanıt yazabilir.</p>');
    function bitir(mesajli) {
      o.durum = "reddedildi"; o.mesaj = mesajli ? m.querySelector("#spRM").value : "";
      verilenBag(o, "reddedildi", o.mesaj);
      if (mesajli) {
        if (!S.mesaj[S.aktif]) S.mesaj[S.aktif] = [];
        S.mesaj[S.aktif].unshift({ id: "m" + Date.now(), kim: f.id, konu: p.ad + " teklifi", t: Date.now(), okunmadi: false, akis: [["o", SP.sayi(o.adet) + " " + p.birim + " için " + SP.tl(o.fiyat) + " teklif verdim."], ["ben", o.mesaj]] });
        if (yonetilen(f.id)) { if (!S.mesaj[f.id]) S.mesaj[f.id] = []; S.mesaj[f.id].unshift({ id: "m" + (Date.now() + 1), kim: S.aktif, konu: p.ad + " teklifiniz", t: Date.now(), okunmadi: true, akis: [["ben", SP.sayi(o.adet) + " " + p.birim + " için " + SP.tl(o.fiyat) + " teklif verdim."], ["o", o.mesaj]] }); }
      }
      kaydet(); SP.kapat(); SP.ciz(true);
      SP.toast("Teklif reddedildi", mesajli ? "Mesajınız " + esc(f.ad) + " üyesine iletildi." : "Teklif verene ret bildirimi gitti.", "bilgi");
    }
    m.querySelector("#spRG").onclick = function () { bitir(true); };
    m.querySelector("#spRS").onclick = function () { bitir(false); };
  };
  SP.pasifeAl = function (pid) {
    var p = SP.urun(pid);
    if (p.durum === "aktif") { yaz(pid, { durdu: true }); kaydet(); SP.ciz(true); return SP.toast("İlan pasife alındı", esc(p.ad) + " genel listelerden kalktı. İlanlarım sekmesinden tekrar yayına alabilirsiniz.", "ok"); }
    yaz(pid, { pasifT: Date.now() }); kaydet(); SP.ciz(true);
    SP.toast("İlan pasife alındı", esc(p.ad) + " genel listelerden kalktı; 'önceden satılanlar' arşivinde duruyor. Satılan ilan tekrar yayına alınamaz.", "ok");
  };
  SP.hemenAlAyarla = function (pid, tip, yuzde) { var o = {}; o[tip === "ust" ? "hemenUst" : "hemenAl"] = yuzde; yaz(pid, o); kaydet(); };
  SP.duyuruGonder = function (pid) {
    var p = SP.urun(pid), k = KAT[p.kat];
    S.duyuru.unshift({ urun: pid, t: Date.now(), kisi: k.uye }); kaydet(); SP.ciz(true);
    SP.toast("Ürün duyurusu kuyruğa alındı (örnek)", k.ad + " kategorisindeki " + SP.sayi(k.uye) + " üyeye gerçek sistemde e-posta gider. Prototipte e-posta gönderilmez.", "mail");
  };
  SP.mesajYaz = function (mid, metin) {
    if (!SP.kurumsal()) return SP.yukselt("Mesaj gönderme");
    if (!metin.trim()) return;
    (S.mesaj[S.aktif] || []).forEach(function (m) { if (m.id === mid) { m.akis.push(["ben", metin]); m.t = Date.now(); } });
    kaydet(); SP.ciz(true);
  };
  SP.katSec = function (k) {
    if (!S.kat[S.aktif]) S.kat[S.aktif] = [];
    var l = S.kat[S.aktif], i = l.indexOf(k);
    if (i >= 0) l.splice(i, 1); else l.push(k);
    kaydet(); SP.ciz(true);
  };
  SP.goster = function (fid) { return S.goster[fid] !== false; };
  SP.gosterDegis = function (fid) { S.goster[fid] = !SP.goster(fid); kaydet(); SP.ciz(true); };

  /* ilan ver / güncelle: Hemen Al oranları yalnız burada ve satıcı panelinde görünür */
  SP.ilanPenceresi = function (pid) {
    if (uyeGerek()) return;
    var ben = SP.ben(), bir = ben.paket === "bireysel", p = pid ? SP.urun(pid) : null, yenile = p && p.durum === "pasif";
    if (p && p.firma !== S.aktif) return;
    if (!SP.firmaOk(ben)) return SP.modal('<div class="sp-m-ikon kilit">' + SP.ui("kalkan", 26) + '</div><h3>Önce doğrulama</h3><p class="sp-m-p">Telefon ve e-posta doğrulaması yapılmadan ilan verilemez.</p><div class="sp-m-btns"><a class="sp-btn" href="#/hesabim?sekme=profil" data-kapat>Doğrulamaya git</a></div>', "dar");
    if (p) { var d = SP.ilanDurum(p); if (d.satildi || (yenile && !d.yenilenebilir)) return SP.toast("Yayına alınamaz", d.neden, "uyari"); }
    var hak = SP.ilanHak(ben);
    if ((!p || (yenile && !bir)) && hak.kalan <= 0) return bir ? SP.yukselt("Yılda 3'ten fazla ilan vermek") : SP.toast("İlan hakkınız doldu", SP.paketAd(ben) + " pakette aynı anda " + hak.hak + " ilan yayınlanabilir.", "uyari");
    var m = SP.modal("<h3>" + (yenile ? "İlanı güncelle ve yayına al" : p ? "İlanı düzenle" : "Yeni ilan ver") + '</h3><div class="sp-m-dogrula">' + SP.tikRozet(true, "Telefon doğrulandı") + SP.tikRozet(true, "E-posta doğrulandı") + "<small>Doğrulama olmadan ilan verilemez.</small></div>" +
      '<div class="sp-m-grid"><label class="genis">Ürün adı<input id="spIA" type="text" placeholder="Ör. Otel tipi komodin, fazla üretim" value="' + (p ? esc(p.ad) : "") + '"></label>' +
      '<label>Kategori<select id="spIK">' + V.KATEGORI.map(function (k) { return '<option value="' + k.id + '"' + ((p ? p.kat === k.id : ben.kat[0] === k.id) ? " selected" : "") + ">" + k.ad + "</option>"; }).join("") + "</select></label>" +
      '<label>Birim<select id="spIB">' + ["adet", "kg", "çuval", "koli", "takım", "m²", "palet", "litre", "teneke", "top"].map(function (b) { return "<option" + (p && p.birim === b ? " selected" : "") + ">" + b + "</option>"; }).join("") + "</select></label>" +
      '<label>Birim fiyat (TL)<input id="spIF" type="number" min="0" step="0.01" placeholder="140" value="' + (p ? p.fiyat : "") + '"></label><label>Stok miktarı<input id="spIS" type="number" min="1" placeholder="200" value="' + (p ? p.stok : "") + '"></label>' +
      '<label class="genis">Açıklama <small>(isteğe bağlı)</small><textarea id="spIC" rows="2" placeholder="Durum, teslim şekli, depo yeri">' + (p ? esc(p.aciklama) : "") + "</textarea></label>" +
      '<div class="genis sp-otosatis"><b>Hemen al ayarı</b> <small>Yalnız size görünür, alıcılar görmez.</small><div class="sp-otosatis-iki"><label>İlan fiyatından en çok düşük <small>(%)</small><input id="spIHA" type="number" min="0" max="90" step="0.5" value="' + (p ? p.hemenAl : 0) + '"></label><label>İlan fiyatından en çok yüksek <small>(%)</small><input id="spIHU" type="number" min="0" max="200" step="0.5" value="' + (p ? p.hemenUst : 0) + '"></label></div><small id="spIHn"></small></div>' +
      '</div><button class="sp-btn tam" id="spIG">' + (yenile ? "Güncelle ve yayına al" : p ? "Kaydet" : "İlanı yayınla") + '</button><p class="sp-m-not">' + (bir ? "Bireysel ilan 30 gün yayında kalır, 2 kez yenilenebilir (en fazla 90 gün). Yılda 3 ilan hakkı: kalan " + hak.kalan + "." : "İlan 30 gün sonunda pasife alınır, güncelleyip tekrar yayına alabilirsiniz. Bir ilan en fazla 1 yıl yayında kalır; satılan ilan tekrar yayına alınamaz.") + "</p>");
    var hA = m.querySelector("#spIHA"), hU = m.querySelector("#spIHU"), iF = m.querySelector("#spIF"), hN = m.querySelector("#spIHn");
    function hs() {
      var f = parseFloat(iF.value) || 0, a = parseFloat(hA.value) || 0, u = parseFloat(hU.value) || 0;
      hN.textContent = !(a > 0 || u > 0) ? "Kapalı: bütün teklifler onayınıza gelir." : !f ? "Fiyat girince aralık burada görünür." : SP.tl(yuvarla(f * (1 - a / 100))) + " ile " + SP.tl(yuvarla(f * (1 + u / 100))) + " arasındaki teklifler otomatik satılır; dışındakiler onayınıza gelir.";
    }
    hA.oninput = hU.oninput = iF.oninput = hs; hs();
    m.querySelector("#spIG").onclick = function () {
      var ad = m.querySelector("#spIA").value.trim(), kat = m.querySelector("#spIK").value, fy = parseFloat(iF.value), st = parseFloat(m.querySelector("#spIS").value), a = parseFloat(hA.value) || 0, u = parseFloat(hU.value) || 0, ac = m.querySelector("#spIC").value.trim(), br = m.querySelector("#spIB").value, k = KAT[kat], simdi = Date.now();
      if (!ad || !(fy > 0) || !(st > 0)) return SP.toast("Eksik bilgi", "Ürün adı, fiyat ve stok girin.", "uyari");
      if (a < 0 || u < 0 || a >= 100) return SP.toast("Oranı kontrol edin", "Yüzdeler 0 ile 100 arasında olmalı.", "uyari");
      if (p) {
        var o = { ad: ad, kat: kat, birim: br, fiyat: fy, stok: st, hemenAl: a, hemenUst: u, aciklama: ac, ikon: k.ikon };
        if (yenile) { o.durdu = false; o.yayinT = simdi; o.yenileme = p.yenileme + 1; }
        yaz(p.id, o); kaydet(); SP.kapat(); SP.ciz(true);
        return SP.toast(yenile ? "İlan yeniden yayında" : "İlan güncellendi", yenile ? "30 günlük yeni yayın süresi başladı." : esc(ad), "ok");
      }
      var id = "n" + simdi;
      S.yeni.unshift({ id: id, ad: ad, kat: kat, firma: S.aktif, birim: br, fiyat: fy, stok: st, hemenAl: a, hemenUst: u, durum: "aktif", gun: 0, t: simdi, ilkT: simdi, yayinT: simdi, yenileme: 0, ikon: k.ikon, kondisyon: "Yeni", aciklama: ac || "İlan açıklaması girilmedi.", satisSaat: 0, kod: k.on + "-" + String(simdi).slice(-5), barkod: "8690001" + String(simdi).slice(-5) + "7", teklifSay: 0, izlenme: 0 });
      kaydet(); SP.kapat(); location.hash = "#/urun/" + id;
      SP.toast("İlanınız yayında", "Gerçek sistemde " + k.ad + " kategorisini takip eden üyelere yeni ürün e-postası gider.", "ok");
    };
  };
  /* süre kuralını denemek için: 30 gün beklemeden zamanı ileri alır (yalnız prototip) */
  SP.ileriSar = function () {
    SP.benimIlanlar(S.aktif).forEach(function (p) { if (p.durum === "aktif" || p.durum === "pasif") yaz(p.id, { yayinT: p.yayinT - 30 * GUN, ilkT: p.ilkT - 30 * GUN }); });
    kaydet(); SP.ciz(true);
    SP.toast("Süre 30 gün ileri alındı (örnek)", "Yayın süresi dolan ilanlar pasife düştü. Kuralı görmek için tekrar yayına almayı deneyin.", "bilgi");
  };

  /* ---------- resim yükleme (tarayıcıda küçültülüp saklanır) ---------- */
  function resimOku(dosya, w, h, cb) {
    if (!dosya || !/^image\//.test(dosya.type)) return SP.toast("Resim seçin", "Yalnız resim dosyası yüklenebilir.", "uyari");
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var c = document.createElement("canvas"), o = Math.max(w / im.width, h / im.height), sw = w / o, sh = h / o;
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, 0, 0, w, h);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      im.onerror = function () { SP.toast("Resim açılamadı", "Başka bir dosya deneyin.", "uyari"); };
      im.src = r.result;
    };
    r.readAsDataURL(dosya);
  }
  function duzenim() { if (!S.duzen[S.aktif]) S.duzen[S.aktif] = {}; return S.duzen[S.aktif]; }

  /* ---------- üye ol ---------- */
  SP.bilgiMetni = function () {
    var B = V.BILGI;
    return '<div class="sp-bilgilendirme" tabindex="0">' + B.giris.map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + "<ul>" + B.adim.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul><p>" + esc(B.son) + "</p></div>";
  };
  SP.sayfaUyeOl = function (paket) {
    if (paket !== "basic" && paket !== "kurumsal") paket = "bireysel";
    var kayitli = S.uyeler.length ? '<p class="sp-bilgi">' + SP.ui("kisi", 16) + " Bu tarayıcıda kayıtlı üyeler: " + S.uyeler.map(function (u) { return '<button class="sp-link" data-uye-gir="' + u.id + '">' + esc(u.ad) + "</button>"; }).join(" · ") + "</p>" : "";
    return '<section class="sp-sayfa sp-uyeol"><div class="sp-sb"><span class="sp-ust">Üye ol</span><h1>Üyelik türünüzü seçin, bilgilerinizi yazın</h1><p>Bireysel üyelik ücretsizdir. Kayıt bu prototipte yalnız sizin tarayıcınızda tutulur.</p></div>' + kayitli +
      '<form class="sp-form" id="spUye" novalidate><fieldset class="sp-uye-tur"><legend>Üyelik türü</legend>' + PAKET.map(function (p) { return '<label class="' + (p.id === paket ? "on" : "") + '"><input type="radio" name="tur" value="' + p.id + '"' + (p.id === paket ? " checked" : "") + "><b>" + p.ad + "</b><small>" + p.ilan + " · " + p.fiyat + "</small></label>"; }).join("") + "</fieldset>" +
      '<div class="sp-m-grid"><label>Ad soyad<input name="ad" autocomplete="name" placeholder="Adınız ve soyadınız"></label><label class="sp-kur-alan">Firma unvanı<input name="firma" autocomplete="organization" placeholder="Firma unvanı"></label><label>E-posta<input name="eposta" type="email" autocomplete="email" placeholder="ornek@firma.com"></label><label>Cep telefonu<input name="tel" type="tel" autocomplete="tel" placeholder="05xx xxx xx xx"></label><label>İl<input name="il" placeholder="Antalya"></label><label>İlçe<input name="ilce" placeholder="Kepez"></label><label class="genis">Adres<input name="adres" autocomplete="street-address" placeholder="Mahalle, cadde, no"></label></div>' +
      '<fieldset class="sp-uye-kat"><legend>Faaliyet alanı <small>(birden çok seçebilirsiniz)</small></legend>' + V.KATEGORI.map(function (k) { return '<label><input type="checkbox" name="kat" value="' + k.id + '"> ' + k.ad + "</label>"; }).join("") + "</fieldset>" +
      "<h2>Bilgilendirme metni</h2>" + SP.bilgiMetni() +
      '<label class="sp-onay sp-uye-onay"><input type="checkbox" name="onay"> Bilgilendirme metnini okudum, onaylıyorum.</label><button class="sp-btn tam" type="submit">Üye ol</button><div class="sp-form-sonuc" id="spUS"></div></form></section>';
  };
  function dogrulaPenceresi() {
    var ben = SP.ben(), m = SP.modal('<div class="sp-m-ikon">' + SP.ui("kalkan", 26) + '</div><h3>Telefon ve e-posta doğrulama</h3><p class="sp-m-p">Gerçek sistemde kodlar SMS ve e-postayla gelir. Prototipte SMS ya da e-posta gönderilmez; örnek kod: <b>1234</b>.</p><div class="sp-m-grid"><label>Telefon kodu<small>' + esc(ben.tel) + '</small><input id="spDT" inputmode="numeric" placeholder="1234"></label><label>E-posta kodu<small>' + esc(ben.eposta) + '</small><input id="spDE" inputmode="numeric" placeholder="1234"></label></div><div class="sp-form-sonuc" id="spDS"></div><div class="sp-m-btns"><button class="sp-btn" id="spDG">Doğrula</button><button class="sp-btn ghost" data-kapat>Sonra doğrula</button></div>', "dar");
    m.querySelector("#spDG").onclick = function () {
      var t = m.querySelector("#spDT").value.trim() === "1234", e = m.querySelector("#spDE").value.trim() === "1234";
      if (t) ben.telOk = true; if (e) ben.epostaOk = true;
      if (!(t && e)) { var s = m.querySelector("#spDS"); s.className = "sp-form-sonuc hata"; s.textContent = "Kod yanlış. Örnek kod 1234."; kaydet(); return; }
      kaydet(); SP.kapat(); SP.ciz(true); SP.toast("Doğrulama tamam", "Bilgileriniz üye sayfanızda yeşil tik ile görünür. Artık ilan verebilirsiniz.", "ok");
    };
  }
  SP.paketSec = function (id) {
    if (!S.aktif) { location.hash = "#/uye-ol?paket=" + id; return; }
    var ben = SP.ben();
    if (!S.uyeler.some(function (u) { return u.id === ben.id; })) return SP.setHesap(id);
    var once = ben.paket; ben.paket = id;
    if (once === "bireysel" && id !== "bireysel") V.FIRMA.unshift(ben);
    if (once !== "bireysel" && id === "bireysel") V.FIRMA.splice(V.FIRMA.indexOf(ben), 1);
    kaydet(); SP.ciz(true);
    SP.toast("Paketiniz değişti (örnek)", SP.paketAd(ben) + ". Gerçek sistemde bu adımda yıllık paket ödemesi yapılır; prototipte ödeme yoktur.", "bilgi");
  };

  /* ---------- canlı akış (demo) ---------- */
  var akisSira = 0;
  SP.akisOlay = function (zamanFarki) {
    var l = SP.liste({ durum: "aktif" }); akisSira++;
    var p = l[(akisSira * 7 + 3) % l.length], fl = V.FIRMA.filter(function (f) { return f.id !== p.firma; }), f = fl[(akisSira * 5) % fl.length];
    var satis = akisSira % 4 === 0;
    var fiyat = satis ? Math.round(p.fiyat * 0.97 * 100) / 100 : Math.round(p.fiyat * (0.86 + (akisSira % 5) * 0.02) * 100) / 100;
    return { tip: satis ? "satis" : "teklif", urun: p, firma: f, fiyat: fiyat, adet: 1 + akisSira % 4, t: Date.now() - (zamanFarki || 0), fark: Math.round((1 - fiyat / p.fiyat) * 1000) / 10 };
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
    document.querySelectorAll("[data-hesap-sec]").forEach(function (a) { var on = DEMO[a.dataset.hesapSec] === S.aktif; a.classList.toggle("aktif", on); a.setAttribute("aria-pressed", on); });
    document.querySelectorAll("[data-hesap-ad]").forEach(function (a) { a.textContent = SP.kisi().ad; });
    document.querySelectorAll("[data-hesap-tur]").forEach(function (a) { a.textContent = S.aktif ? SP.paketAd(SP.ben()) : "Misafir"; });
    document.querySelectorAll("[data-okunmadi]").forEach(function (a) { var n = SP.okunmadiSay(); a.textContent = n; a.style.display = n ? "" : "none"; });
    document.body.dataset.hesap = SP.hesap(); document.body.dataset.rota = r.ad || "anasayfa";
    if (SP.tasarim.sonra) SP.tasarim.sonra(r);
    var fuye = document.getElementById("spUye"); if (fuye) fuye.classList.toggle("bireysel", fuye.tur.value === "bireysel");
    slaytKur();
    sayacGuncel();
    if (koru) window.scrollTo(0, y);
  };
  SP.okunmadiSay = function () {
    if (!S.aktif) return 0;
    var n = (S.mesaj[S.aktif] || []).filter(function (m) { return m.okunmadi; }).length;
    n += S.teklif.filter(function (t) { var u = SP.urun(t.urun); return t.durum === "bekliyor" && u && u.firma === S.aktif; }).length;
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
    else if (d.ilanVer !== undefined) { e.preventDefault(); SP.kapat(); SP.ilanPenceresi(); }
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
    var kat = S.kat[S.aktif] || [], l = SP.liste({ kat: kat, durum: "aktif", limit: 4 }), kisi = SP.kisi();
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
    { id: "bireysel", ad: "Bireysel", fiyat: "Ücretsiz", alt: "", ilan: "Yılda 3 ilan", ozet: "İş yapmak isteyen herkes için: ilan verin, teklif verin, teklif alın.", ozellik: ["Yılda 3 ilan hakkı", "İlan 30 gün yayında, 2 kez yenilenir (en fazla 90 gün)", "Teklif verme ve teklif alma açık", "Satın alma ve alım talebi", "Ad, adres, e-posta, telefon (doğrulamalı, yeşil tik)", "Faaliyet alanı: kategorileri tik ile seçme, en yeni 50 ürün ve 50 firma", "Yeni ürün gelince e-posta bildirimi", "Satıcı mesajlarını alma"], yok: ["Üye sayfasındaki banner'a resim yükleme (alan site reklamı içindir)", "Serbest mesaj gönderme"] },
    { id: "basic", ad: "Basic Kurumsal", fiyat: "₺___", alt: "/ yıl", ilan: "10 ilan", ozet: "Küçük işletmeler için firma sayfası ve teklif sistemi.", ozellik: ["10 ilan hakkı", "İlan 30 günde pasife alınır, güncelleyip tekrar yayına alınır", "1 ilan en fazla 1 yıl yayında kalır", "Firma sayfası: logo, üst banner, 1 tanıtım resmi", "Kendi banner resminizi yükleme", "Firma adı, adres, tarihçe, yetkili bilgileri", "Teklif verme, teklif alma, alım talebi", "Satıcı panelinden hemen al oranı ayarı", "Satılanları göster / gizle anahtarı", "Mesaj gönderme"], yok: ["Kayan slayt 5 tanıtım resmi", "Kategori üyelerine e-posta duyurusu"] },
    { id: "kurumsal", ad: "Gold Kurumsal", fiyat: "₺___", alt: "/ yıl", ilan: "25 ilan", one: true, ozet: "Stoğunu düzenli eriten üretici ve toptancılar için.", ozellik: ["25 ilan hakkı", "Basic paketteki her şey", "Firma sayfası: logo, üst banner, 5 tanıtım resmi (kayan slayt)", "Hakkımızda yazısı ve web sitesi bağlantısı", "Kategorideki bireysel ve kurumsal üyelere e-posta ile ürün duyurusu", "Firma kategorilerinde faaliyet gösteren en yeni 50 üye listesi", "Yılda bir kez yenileme"], yok: [] }
  ];
  SP.PAKET = PAKET;
  SP.sayfaPaketler = function () {
    var h = SP.hesap();
    return '<section class="sp-sayfa sp-paketler"><div class="sp-sb"><span class="sp-ust">Paketler</span><h1>Amacımız sizden para almak değil, iş yapmanızı sağlamak</h1><p>Bireysel üyelik ücretsizdir; teklif verir, teklif alırsınız. Daha fazla ilan ve firma sayfası için kurumsal paketlerden birini seçin. Paket fiyatları sizin onayınızdan sonra yazılacaktır.</p></div>' +
      '<div class="sp-pk-izgara">' + PAKET.map(function (p) {
        var simdiki = h === p.id;
        return '<div class="sp-pk' + (p.one ? " one" : "") + '">' + (p.one ? '<span class="sp-pk-rozet">En çok ilan hakkı</span>' : "") + '<div class="sp-pk-ad">' + p.ad + '</div><div class="sp-pk-fiyat">' + p.fiyat + " <small>" + p.alt + '</small></div><div class="sp-pk-ilan">' + SP.ui("etiket", 15) + " " + p.ilan + '</div><p class="sp-pk-oz">' + p.ozet + "</p><ul>" +
          p.ozellik.map(function (o) { return '<li class="var">' + SP.ui("tik", 15) + o + "</li>"; }).join("") + p.yok.map(function (o) { return '<li class="yok">' + SP.ui("kapat", 14) + o + "</li>"; }).join("") + "</ul>" +
          (simdiki ? '<button class="sp-btn ghost tam" disabled>Mevcut paketiniz</button>' : !S.aktif ? '<a class="sp-btn tam" href="#/uye-ol?paket=' + p.id + '">' + (p.id === "bireysel" ? "Ücretsiz üye ol" : "Bu paketle üye ol") + "</a>" : '<button class="sp-btn tam" data-paket-sec="' + p.id + '">' + p.ad + " pakete geç</button>") + "</div>";
      }).join("") + "</div>" +
      '<div class="sp-tablo-kap"><table class="sp-tablo sp-kars"><thead><tr><th>Özellik</th><th>Bireysel</th><th>Basic</th><th>Gold</th></tr></thead><tbody>' +
      [["İlan hakkı", "3 (yılda)", "10", "25"], ["İlan yayın süresi", "30 gün + 2 yenileme (en fazla 90 gün)", "30 gün, güncelleyip yayına alma (en fazla 1 yıl)", "30 gün, güncelleyip yayına alma (en fazla 1 yıl)"], ["Satılan ilanı tekrar yayınlama", "Yok, yeni ilan", "Yok, yeni ilan", "Yok, yeni ilan"], ["Teklif verme / teklif alma", "✓", "✓", "✓"], ["Satın alma / alım talebi", "✓", "✓", "✓"], ["Hemen al oranı ayarı (satıcı paneli)", "✓", "✓", "✓"], ["Mesaj gönderme", "Yalnız alma", "✓", "✓"], ["Üye sayfası üst banner", "Site reklamı", "Kendi banner'ınız", "Kendi banner'ınız"], ["Firma tanıtım resmi", "–", "1 resim", "5 resim, kayan slayt"], ["Kategori üyelerine e-posta duyurusu", "–", "–", "✓"], ["Faaliyet alanı akışı ve e-posta bildirimi", "✓", "✓", "✓"], ["Doğrulanmış bilgi rozeti (yeşil tik)", "✓", "✓", "✓"]]
        .map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<div class="sp-sss"><h2>Sık sorulan sorular</h2>' + V.SSS.map(function (s, i) { return "<details" + (i === 0 ? " open" : "") + "><summary>" + s[0] + "</summary><p>" + s[1] + "</p></details>"; }).join("") + "</div></section>";
  };
  SP.sayfaHakkimizda = function () {
    return '<section class="sp-sayfa sp-hakkimizda"><div class="sp-sb"><span class="sp-ust">Hakkımızda</span><h1>Depoda bekleyen stok, başka bir firmanın aradığı üründür</h1><p>StokPazarı; üretici, toptancı ve işletmelerin fazla, sezon sonu, iade ya da proje fazlası ürünlerini birbirine teklifle sattığı bir firmalar arası ilan platformudur. Sepet yoktur, sitede ödeme alınmaz: alıcı ürünün tamamını satın alır ya da teklif verir.</p></div>' +
      '<blockquote class="sp-alinti">“Amacımız insanlardan para almak değil; iş yapmalarını, para kazanmalarını sağlamak.”</blockquote>' +
      '<div class="sp-adimlar">' + [["etiket", "İlanı verin", "Ürün kodu, barkod, fiyat ve stok miktarıyla ilan verin. İlan 30 gün yayında kalır, güncelleyip yenileyebilirsiniz."], ["simsek", "Satın alınsın ya da teklif gelsin", "Alıcı ürünün tamamını ilan fiyatından alabilir ya da istediği miktar için teklif verebilir."], ["mesaj", "Teklifleri yönetin", "Gelen teklifi kabul edin ya da reddedip 'şu fiyattan verebilirim' diye yazın."], ["kalkan", "Satıldı, güven kazandı", "Satılan ürün SATILDI etiketiyle görünür; firma sayfanız referansa dönüşür."]].map(function (a, i) { return '<div class="sp-adim"><span class="sp-adim-no">' + (i + 1) + "</span>" + SP.ui(a[0], 22) + "<b>" + a[1] + "</b><p>" + a[2] + "</p></div>"; }).join("") + "</div>" +
      '<div class="sp-iki"><div><h2>Neden kurulduk?</h2><p>Türkiye\'de binlerce işletmenin deposunda, iptal edilen bir siparişten kalan parti, ambalajı değişen ürünler ya da sezonu geçmiş stoklar bekliyor. Bu ürünler çoğu zaman tanıdık birkaç alıcıya düşük fiyata verilir ya da yıllarca depoda kalır.</p><p>StokPazarı bu stoğu, onu gerçekten arayan firmalarla buluşturmak için kuruldu. Bireysel üyelik ücretsizdir; kurumsal paketler firma sayfası, daha fazla ilan ve kategori duyurusu gibi satışı hızlandıran araçları açar.</p></div>' +
      '<div><h2>İlkelerimiz</h2><ul class="sp-ilke"><li>' + SP.ui("kalkan", 18) + "<div><b>Doğrulanmış üyeler</b>Telefon ve e-posta doğrulaması olmadan ilan verilemez.</div></li><li>" + SP.ui("goz", 18) + "<div><b>Şeffaf geçmiş</b>Firmanın sattığı ürünler sayfasında görünür (firma isterse gizler).</div></li><li>" + SP.ui("etiket", 18) + "<div><b>Doğrudan satış</b>Satış iki firma arasında gerçekleşir; sitede ödeme alınmaz.</div></li><li>" + SP.ui("kutu", 18) + "<div><b>Güncel ilan</b>Satılan ilan 3 gün içinde pasife alınmazsa otomatik kalkar.</div></li></ul></div></div>" +
      '<div class="sp-rakam">' + [["10", "ana kategori"], [String(V.FIRMA.length), "üye firma (demo)"], [String(SP.liste({}).length), "yayında ilan (demo)"], ["7/24", "teklif alma"]].map(function (r) { return "<div><b>" + r[0] + "</b><span>" + r[1] + "</span></div>"; }).join("") + "</div></section>";
  };
  SP.blogKart = function (b) {
    return '<a class="sp-blogkart" href="#/blog/' + b.id + '"><div class="sp-blog-img">' + SP.gorsel({ id: b.id.length, kat: V.KATEGORI.filter(function (k) { return k.renk === b.renk; })[0].id, ikon: b.ikon, ad: b.baslik, kod: b.kat.toLocaleUpperCase("tr") }) + '</div><div class="sp-blog-ic"><span class="sp-ust">' + b.kat + " · " + b.dk + " dk okuma</span><b>" + esc(b.baslik) + "</b><p>" + esc(b.ozet) + "</p><small>" + b.tarih + "</small></div></a>";
  };
  SP.sayfaBlog = function () {
    return '<section class="sp-sayfa sp-blog"><div class="sp-sb"><span class="sp-ust">Blog</span><h1>Stok, teklif ve satış üzerine</h1><p>Fazla stoğu nakde çevirmek, doğru teklifi vermek ve pazarlığı kaybetmemek için kısa rehberler.</p></div><div class="sp-blog-izgara">' + V.BLOG.map(SP.blogKart).join("") + "</div></section>";
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
  function rozet(d, satici) {
    var m = { bekliyor: ["Onay bekliyor", "bekle"], kabul: ["Kabul edildi", "ok"], "kabul-otomatik": [satici ? "Otomatik satıldı" : "Kabul edildi, satış tamam", "ok"], "satin-alindi": ["Satın alındı", "ok"], reddedildi: ["Reddedildi", "red"], kapandi: ["Ürün satıldı, kapandı", "gri"] }[d] || [d, "gri"];
    return '<span class="sp-durum ' + m[1] + '">' + m[0] + "</span>";
  }
  function urunHucre(p, satici) { return '<a class="sp-uh" href="#/urun/' + p.id + '"><span class="sp-uh-img">' + SP.gorsel(p) + "</span><span><b>" + esc(p.ad) + "</b><small>" + esc(p.kod) + " · Liste " + SP.tl(p.fiyat) + "/" + esc(p.birim) + "</small></span></a>"; }
  function firmaHucre(f) { return '<a class="sp-fh" href="#/firma/' + f.id + '">' + SP.logo(f, 30) + "<span><b>" + esc(f.ad) + "</b><small>" + esc(f.yetkili) + " · " + esc(f.il) + "</small></span></a>"; }
  function farkYaz(o, p) { var fr = Math.round((o.fiyat / p.fiyat - 1) * 1000) / 10; return (fr > 0 ? "+%" : "-%") + SP.sayi(Math.abs(fr)); }
  function esikMetin(p) { return !(p.hemenAl > 0 || p.hemenUst > 0) ? "Kapalı: bütün teklifler onayınıza gelir" : SP.tl(SP.hemenAralik(p).alt) + " ile " + SP.tl(SP.hemenAralik(p).ust) + " arası otomatik satılır"; }
  SP.panel = function (sekme) {
    if (!S.aktif) return SP.sayfaUyeOl();
    var ben = SP.ben(), bid = ben.id, kur = SP.kurumsal(), gold = SP.gold();
    if (!S.mesaj[bid]) S.mesaj[bid] = [];
    if (!S.kat[bid]) S.kat[bid] = ben.kat.slice();
    var gelen = S.teklif.filter(function (t) { var u = SP.urun(t.urun); return u && u.firma === bid; });
    var bekleyen = gelen.filter(function (t) { return t.durum === "bekliyor"; }).length;
    var okm = S.mesaj[bid].filter(function (m) { return m.okunmadi; }).length;
    var benimSatilan = SP.tumUrun().filter(function (p) { return p.firma === bid && p.durum === "satildi"; });
    var talepler = S.talep.filter(function (t) { var u = SP.urun(t.urun); return u && u.firma === bid; });
    var sekmeler = [["ilanlar", "İlanlarım", 0], ["teklifler", "Gelen teklifler", bekleyen], ["satilanlar", "Satılanlar", benimSatilan.length], ["talepler", "Alım talepleri", talepler.length], ["verilen", "Tekliflerim ve aldıklarım", 0], ["mesajlar", "Mesajlar", okm], ["akis", "Faaliyet alanım", 0]];
    if (kur) sekmeler.push(["firmam", "Firma sayfam", 0]);
    if (gold) sekmeler.push(["duyuru", "Kategori duyurusu", 0]);
    sekmeler.push(["profil", "Profil ve doğrulama", 0]);
    if (!gold) sekmeler.push(["yukselt", "Hesabı yükselt", 0]);
    if (!sekme || !sekmeler.some(function (s) { return s[0] === sekme; })) sekme = sekmeler[0][0];
    var bas = '<div class="sp-panel-bas">' + SP.logo(ben, 56) + '<div><span class="sp-ust">' + SP.paketAd(ben) + " · " + (kur ? ilanHakSayi(ben.paket) + " ilan" : "ücretsiz · yılda 3 ilan") + "</span><h1>" + esc(ben.ad) + '</h1><div class="sp-panel-dogru">' + SP.tikRozet(ben.telOk, "Telefon") + SP.tikRozet(ben.epostaOk, "E-posta") + '<a href="#/firma/' + bid + '">' + (kur ? "Firma sayfam" : "Üye sayfam") + " →</a></div></div>" +
      '<div class="sp-panel-bas-sag"><button class="sp-btn" data-ilan-ver>' + SP.ui("arti", 16) + ' Yeni ilan</button><button class="sp-btn ghost" data-cikis>Çıkış yap</button></div></div>';
    var nav = '<nav class="sp-sekmeler" role="tablist">' + sekmeler.map(function (s) { return '<a role="tab" class="' + (s[0] === sekme ? "aktif" : "") + '" href="#/hesabim?sekme=' + s[0] + '">' + s[1] + (s[2] ? "<i>" + s[2] + "</i>" : "") + "</a>"; }).join("") + "</nav>";
    var ic = "", satis = S.satis.filter(function (x) { return x.satici === bid; });
    function kpi(l) { return '<div class="sp-kpi">' + l.map(function (k) { return "<div><span>" + k[0] + "</span><b>" + k[1] + "</b><small>" + k[2] + "</small></div>"; }).join("") + "</div>"; }
    if (sekme === "teklifler") {
      var tek = gelen.slice().sort(function (a, b) { return (a.durum === "bekliyor" ? 0 : 1) - (b.durum === "bekliyor" ? 0 : 1) || b.t - a.t; });
      ic = kpi([["Bekleyen teklif", bekleyen, "kabul ya da ret bekliyor"], ["Toplam gelen", gelen.length, "bu hesaptaki kayıt"], ["Bu oturumda otomatik", satis.filter(function (x) { return x.tur === "otomatik"; }).length, "hemen al ayarına göre"], ["Bu oturumda satış", satis.length, "teklif + satın al"]]) +
        '<p class="sp-bilgi">' + SP.ui("simsek", 16) + " Hemen al ayarınızın içinde kalan teklifler buraya düşmeden otomatik satılır. Burada onayınızı bekleyen teklifler görünür. Bu ayarı alıcılar görmez.</p>" +
        (tek.length ? '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Teklif veren</th><th>Birim teklif</th><th>Adet</th><th>Toplam</th><th>Fark</th><th>Zaman</th><th></th></tr></thead><tbody>' +
        tek.map(function (o) {
          var p = SP.urun(o.urun), fr = FIR[o.firma];
          return "<tr><td data-l=\"Ürün\">" + urunHucre(p) + "</td><td data-l=\"Teklif veren\">" + firmaHucre(fr) + '</td><td data-l="Birim teklif" class="sag"><b>' + SP.tl(o.fiyat) + '</b></td><td data-l="Adet" class="sag">' + SP.sayi(o.adet) + '</td><td data-l="Toplam" class="sag">' + SP.tl(yuvarla(o.fiyat * o.adet)) + '</td><td data-l="Fark" class="sag"><span class="sp-fark">' + farkYaz(o, p) + '</span></td><td data-l="Zaman">' + SP.once(o.t) + '</td><td class="sp-eylem">' +
            (o.durum === "bekliyor" ? '<button class="sp-btn kucuk" data-kabul="' + o.id + '">Kabul et</button><button class="sp-btn kucuk ghost" data-reddet="' + o.id + '">Reddet</button>' : rozet(o.durum, true) + (o.mesaj ? '<div class="sp-not-k">Mesajınız: “' + esc(o.mesaj) + "”</div>" : "")) + "</td></tr>";
        }).join("") + "</tbody></table></div>" : '<p class="sp-bos">Henüz gelen teklif yok.</p>');
    } else if (sekme === "satilanlar") {
      var arsiv = SP.liste({ firma: bid, durum: "arsiv", sirala: "satis" });
      ic = kpi([["Pasife alma bekleyen", benimSatilan.length, "3 gün kuralı"], ["Arşivde", arsiv.length, "önceden satılanlar"], ["Bu oturumda satış", satis.length, "parça satışlar dahil"]]) + (benimSatilan.length ? '<div class="sp-uyari">' + SP.ui("saat", 18) + "<div><b>" + benimSatilan.length + " satılmış ilanınız pasife alınmayı bekliyor.</b> Satılan ilanlar 3 gün içinde pasife alınmazsa sistem tarafından otomatik olarak yayından kaldırılır.</div></div>" : '<p class="sp-bilgi">' + SP.ui("tik", 16) + " Pasife alınmayı bekleyen satılmış ilanınız yok.</p>") +
        '<div class="sp-uyari">' + SP.ui("kilit", 18) + '<div><b>Satılan ilan tekrar yayına alınamaz.</b> Aynı ürünü yeniden satacaksanız yeni ilan oluşturun. <button class="sp-link" data-ilan-ver>Yeni ilan oluştur</button></div></div>' +
        '<div class="sp-satilan-liste">' + benimSatilan.map(function (p) {
          var acc = S.teklif.filter(function (t) { return t.urun === p.id && /kabul/.test(t.durum); })[0] || {};
          var al = FIR[p.alici || acc.firma || "mavisehir"], bit = p.satisT + 3 * GUN;
          return '<div class="sp-satilan"><div class="sp-satilan-img">' + SP.gorsel(p) + '<span class="sp-satildi-bant">SATILDI</span></div><div class="sp-satilan-ic"><b>' + esc(p.ad) + "</b><small>" + esc(p.kod) + " · Alıcı: " + esc(al.ad) + " · " + SP.sayi(p.satisAdet || acc.adet || p.stok) + " " + esc(p.birim) + " × " + SP.tl(p.satisFiyat || acc.fiyat || p.fiyat) + " · " + SP.once(p.satisT) + '</small><div class="sp-gs"><span>Otomatik yayından kalkmaya:</span> <b data-geri="' + bit + '">' + SP.kalan(bit - Date.now()) + '</b><div class="sp-geri-bar"><i style="width:' + Math.max(0, (bit - Date.now()) / (3 * GUN) * 100) + '%"></i></div></div></div><div class="sp-satilan-btn"><button class="sp-btn" data-pasif="' + p.id + '">Şimdi pasife al</button><a class="sp-btn ghost" href="#/urun/' + p.id + '">İlanı gör</a></div></div>';
        }).join("") + "</div>" +
        (satis.length ? '<h2>Bu oturumdaki satış kayıtları</h2><div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Alıcı</th><th>Miktar</th><th>Birim</th><th>Yol</th></tr></thead><tbody>' + satis.map(function (x) { return '<tr><td data-l="Ürün">' + esc(x.ad) + '</td><td data-l="Alıcı">' + esc(FIR[x.alici].ad) + '</td><td data-l="Miktar" class="sag">' + SP.sayi(x.adet) + " " + esc(x.birim) + '</td><td data-l="Birim" class="sag">' + SP.tl(x.fiyat) + '</td><td data-l="Yol">' + { "satin-al": "Satın al", otomatik: "Otomatik (hemen al)", kabul: "Teklif kabulü" }[x.tur] + "</td></tr>"; }).join("") + "</tbody></table></div>" : "") +
        '<div class="sp-baslik-sat"><h2>Önceden satılanlar (arşiv)</h2><label class="sp-anahtar"><input type="checkbox" data-goster="' + bid + '"' + (SP.goster(bid) ? " checked" : "") + '><span></span> Sayfamda göster</label></div><p class="sp-bilgi">Bu ürünler genel listelerde görünmez. Anahtar açıkken sayfanızın altında “satıldı” işaretiyle referans olarak gösterilir.</p><div class="sp-mini-izgara">' + arsiv.map(function (p) { return SP.miniKart(p); }).join("") + "</div>";
    } else if (sekme === "ilanlar") {
      var hak = SP.ilanHak(ben), hepsi = SP.benimIlanlar(bid), benim = hepsi.filter(function (p) { return p.durum === "aktif" || p.durum === "pasif"; }).sort(function (a, b) { return (a.durum === "aktif" ? 0 : 1) - (b.durum === "aktif" ? 0 : 1) || b.ilkT - a.ilkT; });
      ic = '<div class="sp-hak"><div><b>' + hak.kul + " / " + hak.hak + "</b> " + (kur ? "yayında ilan hakkı kullanıldı" : "ilan hakkı bu yıl kullanıldı") + '</div><div class="sp-geri-bar"><i style="width:' + Math.min(100, hak.kul / hak.hak * 100) + '%"></i></div><small>' + (kur ? "Her ilan 30 gün sonunda pasife alınır; güncelleyip tekrar yayına alabilirsiniz. 1 ilan en fazla 1 yıl yayında kalır. Satılan ilan tekrar yayına alınamaz." : "Her ilan 30 gün yayında kalır, 2 kez yenilenir (en fazla 90 gün). Üçüncü kez yayına alınamaz. Yılda 3 ilan hakkınız var; daha fazlası için kurumsal üyeliğe geçin.") + "</small></div>" +
        '<p class="sp-bilgi">' + SP.ui("simsek", 16) + " Hemen al oranlarını her ilan için ayrı belirleyin: ilan fiyatından yüzde kaç düşük ve yüzde kaç yüksek teklifin otomatik satılacağını siz seçersiniz. Bu ayarı yalnız siz görürsünüz.</p>" +
        (benim.length ? '<div class="sp-tablo-kap"><table class="sp-tablo sp-ilan-tablo"><thead><tr><th>İlan</th><th>Stok</th><th>Yayın durumu</th><th style="min-width:250px">Hemen al ayarı</th><th></th></tr></thead><tbody>' + benim.map(function (p) {
          var d = SP.ilanDurum(p), acik = p.durum === "aktif";
          return '<tr><td data-l="İlan">' + urunHucre(p) + '</td><td data-l="Stok" class="sag">' + SP.sayi(p.stok) + " " + esc(p.birim) + '</td><td data-l="Yayın durumu">' + (acik ? '<span class="sp-durum ok">Yayında</span><small class="sp-alt">' + d.kalanGun + " gün kaldı</small>" : '<span class="sp-durum gri">Pasif</span><small class="sp-alt">' + (p.durdu ? "Siz pasife aldınız" : "30 gün doldu") + "</small>") + (kur ? "" : '<small class="sp-alt">Kalan yenileme: ' + d.kalanYenileme + "</small>") + '</td><td data-l="Hemen Al"><div class="sp-esik-ayar"><label>Düşük %<input type="number" min="0" max="90" step="0.5" value="' + p.hemenAl + '" data-esik-ayar="' + p.id + '" data-tip="alt"></label><label>Yüksek %<input type="number" min="0" max="200" step="0.5" value="' + p.hemenUst + '" data-esik-ayar="' + p.id + '" data-tip="ust"></label><small>' + esikMetin(p) + '</small></div></td><td class="sp-eylem">' +
            (acik ? '<button class="sp-btn kucuk ghost" data-ilan-duzenle="' + p.id + '">Düzenle</button><button class="sp-btn kucuk ghost" data-pasif="' + p.id + '">Pasife al</button>' : d.yenilenebilir ? '<button class="sp-btn kucuk" data-ilan-duzenle="' + p.id + '">Güncelle ve yayına al</button>' : '<small class="sp-alt">' + d.neden + '</small><button class="sp-btn kucuk ghost" data-ilan-ver>Yeni ilan</button>') + "</td></tr>";
        }).join("") + "</tbody></table></div>" : '<p class="sp-bos">Henüz ilanınız yok. <button class="sp-link" data-ilan-ver>İlk ilanınızı verin</button></p>') +
        '<p class="sp-demo-not">Süre kuralını beklemeden denemek için: <button class="sp-link" data-ileri>30 gün ileri al (yalnız prototip)</button></p>';
    } else if (sekme === "talepler") {
      var giden = S.gidenTalep.filter(function (g) { return g.veren === bid; });
      ic = '<p class="sp-bilgi">' + SP.ui("mesaj", 16) + " Satılmış ilanlarınızı görüp aynı ürünü almak isteyen üyelerin talepleri. Satış bitmiş gibi görünse de alım süreci buradan devam eder.</p>" +
        (talepler.length ? '<div class="sp-talep-liste">' + talepler.map(function (t) {
          var p = SP.urun(t.urun), fr = FIR[t.firma];
          return '<div class="sp-talep">' + firmaHucre(fr) + '<div class="sp-talep-ic"><span>' + esc(p.ad) + " <em>SATILDI</em></span><b>" + SP.sayi(t.adet) + " " + esc(p.birim) + " × " + SP.tl(t.fiyat) + " = " + SP.tl(yuvarla(t.adet * t.fiyat)) + "</b><p>“" + esc(t.not) + "”</p>" + (t.yanit ? '<div class="sp-not-k">Yanıtınız: “' + esc(t.yanit) + "”</div>" : "") + "<small>" + SP.once(t.t) + '</small></div><div class="sp-talep-btn">' + (t.yanit ? rozet("kabul").replace("Kabul edildi", "Yanıtlandı") : '<button class="sp-btn kucuk" data-talep-yanit="' + t.id + '">Yanıtla</button>') + "</div></div>";
        }).join("") + "</div>" : '<p class="sp-bos">Henüz gelen alım talebi yok.</p>') +
        (giden.length ? "<h2>Gönderdiğim alım talepleri</h2>" + giden.map(function (g) { var p = SP.urun(g.urun); return '<div class="sp-talep">' + urunHucre(p) + '<div class="sp-talep-ic"><b>' + SP.sayi(g.adet) + " " + esc(p.birim) + " × " + SP.tl(g.fiyat) + "</b><small>" + SP.once(g.t) + "</small></div>" + rozet("bekliyor").replace("Onay bekliyor", "Satıcıya iletildi") + "</div>"; }).join("") : "");
    } else if (sekme === "verilen") {
      var vl = S.verilen.filter(function (v) { return v.veren === bid; }), aldim = S.satis.filter(function (x) { return x.alici === bid && x.tur === "satin-al"; });
      ic = '<p class="sp-bilgi">' + SP.ui("etiket", 16) + " Başka üyelerin ilanlarına verdiğiniz teklifler ve satın aldıklarınız. Reddedilen tekliflerde satıcının mesajını görür, yeniden teklif verirsiniz.</p>" +
        (aldim.length ? '<h2>Satın aldıklarım</h2><div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Satıcı</th><th>Miktar</th><th>Birim fiyat</th><th>Zaman</th></tr></thead><tbody>' + aldim.map(function (x) { return '<tr><td data-l="Ürün">' + esc(x.ad) + '</td><td data-l="Satıcı">' + esc(FIR[x.satici].ad) + '</td><td data-l="Miktar" class="sag">' + SP.sayi(x.adet) + " " + esc(x.birim) + '</td><td data-l="Birim fiyat" class="sag">' + SP.tl(x.fiyat) + '</td><td data-l="Zaman">' + SP.once(x.t) + "</td></tr>"; }).join("") + "</tbody></table></div><h2>Tekliflerim</h2>" : "") +
        (vl.length ? '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>Ürün</th><th>Satıcı</th><th>Teklifim</th><th>Adet</th><th>Durum</th><th>Zaman</th></tr></thead><tbody>' + vl.map(function (v) {
          var p = SP.urun(v.urun), fr = FIR[p.firma];
          return '<tr><td data-l="Ürün">' + urunHucre(p) + '</td><td data-l="Satıcı">' + firmaHucre(fr) + '</td><td data-l="Teklifim" class="sag"><b>' + SP.tl(v.fiyat) + '</b></td><td data-l="Adet" class="sag">' + SP.sayi(v.adet) + '</td><td data-l="Durum">' + rozet(v.durum) + (v.mesaj ? '<div class="sp-not-k">' + esc(fr.yetkili) + ": “" + esc(v.mesaj) + "”</div>" + (p.durum === "aktif" ? '<button class="sp-btn kucuk" data-teklif="' + p.id + '" data-fiyat="' + Math.round(p.fiyat * 0.97) + '">Yeniden teklif ver</button>' : "") : "") + '</td><td data-l="Zaman">' + SP.once(v.t) + "</td></tr>";
        }).join("") + "</tbody></table></div>" : '<p class="sp-bos">Henüz teklif vermediniz.</p>');
    } else if (sekme === "mesajlar") {
      var ml = S.mesaj[bid].slice().sort(function (a, b) { return b.t - a.t; }), sec = ml.filter(function (m) { return m.id === SP.rota().q.m; })[0] || ml[0];
      if (sec && sec.okunmadi) { sec.okunmadi = false; kaydet(); }
      ic = ml.length ? '<div class="sp-mesaj"><div class="sp-mesaj-liste">' + ml.map(function (m) { var fr = FIR[m.kim]; return '<a class="' + (m === sec ? "aktif" : "") + (m.okunmadi ? " yeni" : "") + '" href="#/hesabim?sekme=mesajlar&m=' + m.id + '">' + SP.logo(fr, 34) + "<span><b>" + esc(fr.ad) + "</b><small>" + esc(m.konu) + "</small></span><em>" + SP.once(m.t) + "</em></a>"; }).join("") + "</div>" +
        (sec ? '<div class="sp-mesaj-ic"><div class="sp-mesaj-ust">' + firmaHucre(FIR[sec.kim]) + "<span>" + esc(sec.konu) + '</span></div><div class="sp-balonlar">' + sec.akis.map(function (a) { return '<div class="sp-balon ' + (a[0] === "ben" ? "ben" : "o") + '">' + esc(a[1]) + "</div>"; }).join("") + "</div>" +
          (kur ? '<div class="sp-mesaj-yaz"><input id="spMI" placeholder="Mesajınızı yazın…" onkeydown="if(event.key===\'Enter\'){event.preventDefault();this.nextElementSibling.click()}"><button class="sp-btn" data-mesaj-gonder="' + sec.id + '">Gönder</button></div>' : '<div class="sp-mesaj-yaz kilitli">' + SP.ui("kilit", 16) + ' <span>Bireysel hesaplar mesaj alabilir ama gönderemez.</span> <a href="#/paketler">Hesabınızı yükseltin →</a></div>') + "</div>" : "") + "</div>" : '<p class="sp-bos">Henüz mesajınız yok.</p>';
    } else if (sekme === "akis") {
      var kat = S.kat[bid], urunler = SP.liste({ kat: kat, limit: 50 }), firmalar = SP.sonFirmalar(50, kat);
      ic = '<div class="sp-akis-ust"><div><h2>Faaliyet alanınız</h2><p>Kategorileri işaretleyin; listeler ve e-posta bildirimleri anında güncellenir.</p></div><div class="sp-sik"><span>Yeni ürün e-postası:</span>' + [["aninda", "Anında"], ["gunluk", "Günlük özet"], ["kapali", "Kapalı"]].map(function (s) { return '<label><input type="radio" name="sik" value="' + s[0] + '"' + (S.bildirimSiklik === s[0] ? " checked" : "") + ' data-siklik="' + s[0] + '">' + s[1] + "</label>"; }).join("") + "</div></div>" +
        '<div class="sp-katsec">' + V.KATEGORI.map(function (k) { var on = kat.indexOf(k.id) >= 0; return '<button type="button" class="' + (on ? "on" : "") + '" data-katsec="' + k.id + '" style="--kr:' + k.renk + '" aria-pressed="' + on + '"><span class="sp-kutu">' + (on ? SP.ui("tik", 13) : "") + "</span>" + k.ad + "</button>"; }).join("") + "</div>" +
        '<div class="sp-akis-iki"><div><div class="sp-baslik-sat"><h2>Seçtiğiniz kategorilerde en yeni ilanlar</h2><span class="sp-say">' + urunler.length + " / 50</span></div>" + (urunler.length ? '<div class="sp-mini-izgara">' + urunler.map(function (p) { return SP.miniKart(p); }).join("") + "</div>" : '<p class="sp-bos">Kategori seçin; o alandaki en yeni 50 ilan burada listelenir.</p>') + "</div>" +
        '<aside><div class="sp-eposta-kart"><div class="sp-eposta-kart-bas">' + SP.ui("mail", 18) + " E-posta bildirimi önizlemesi</div>" + (function () { var e = ornekEposta()[0]; return "<b>" + esc(e.konu) + "</b><div class=\"sp-eposta-govde\">" + e.govde.slice(0, 6).map(function (g) { return "<p>" + g + "</p>"; }).join("") + "</div>"; })() + '<button class="sp-btn kucuk ghost" data-eposta-ornek>Tam e-postayı aç</button></div>' +
        '<div class="sp-baslik-sat"><h2>Bu alanlardaki firmalar</h2><span class="sp-say">' + firmalar.length + " / 50</span></div><div class=\"sp-fliste\">" + firmalar.map(SP.firmaSatir).join("") + "</div></aside></div>";
    } else if (sekme === "firmam") {
      var dz = S.duzen[bid] || {}, rs = resimHakSayi(ben.paket);
      ic = '<div class="sp-firmam"><p class="sp-bilgi">' + SP.ui("etiket", 16) + " " + (gold ? "Gold pakette logo, üst banner ve kayan slayt şeklinde 5 tanıtım resmi eklersiniz." : "Basic pakette logo, üst banner ve 1 tanıtım resmi eklersiniz. 5 resim ve kayan slayt Gold pakettedir.") + ' <a href="#/firma/' + bid + '">Sayfamı gör →</a></p>' +
        '<h2>Üst banner</h2><div class="sp-yukle-banner">' + SP.banner(ben) + '</div><label class="sp-btn ghost sp-yukle">Banner resmi yükle<input type="file" accept="image/*" data-yukle="banner"></label>' +
        '<h2>Logo</h2><div class="sp-yukle-sira"><div class="sp-yukle-logo">' + SP.logo(ben, 84) + '</div><label class="sp-btn ghost sp-yukle">Logo yükle<input type="file" accept="image/*" data-yukle="logo"></label></div>' +
        "<h2>Tanıtım resmi" + (rs > 1 ? "leri (" + rs + ")" : "") + '</h2><div class="sp-yukle-resimler">' + [0, 1, 2, 3, 4].slice(0, rs).map(function (i) { return '<div><div class="sp-yukle-kare">' + SP.tanitim(ben, i) + '</div><label class="sp-btn ghost kucuk sp-yukle">Resim ' + (i + 1) + '<input type="file" accept="image/*" data-yukle="resim" data-i="' + i + '"></label></div>'; }).join("") + "</div>" +
        '<h2>Hakkımızda ve tarihçe</h2><label class="sp-m-tek"><textarea id="spFT" rows="4">' + esc(dz.tarihce || ben.tarihce) + '</textarea></label><button class="sp-btn" data-firma-kaydet>Kaydet</button></div>';
    } else if (sekme === "duyuru") {
      var benimA = SP.liste({ firma: bid, durum: "aktif" });
      if (!benimA.length) ic = '<p class="sp-bos">Duyurmak için yayında ilanınız olmalı. <button class="sp-link" data-ilan-ver>İlan verin</button></p>';
      else {
        var ilk = benimA[0], k1 = KAT[ilk.kat];
        var gidenD = S.duyuru.filter(function (d) { var u = SP.urun(d.urun); return u && u.firma === bid; });
        ic = '<p class="sp-bilgi">' + SP.ui("mail", 16) + " Gold pakette ilanınızı ürünün kategorisini faaliyet alanı olarak seçmiş bireysel ve kurumsal üyelere e-postayla duyurabilirsiniz.</p>" +
          '<div class="sp-duyuru"><div class="sp-duyuru-form"><label>Duyurulacak ilan<select id="spDuyuruSec" onchange="SP.duyuruOnizle(this.value)">' + benimA.map(function (p) { return '<option value="' + p.id + '">' + esc(p.ad) + "</option>"; }).join("") + '</select></label><div class="sp-hedef"><b id="spDH">' + SP.sayi(k1.uye) + '</b><span id="spDK">' + k1.ad + " kategorisindeki üye (örnek sayı)</span></div><button class=\"sp-btn tam\" data-duyuru=\"" + ilk.id + '">' + SP.ui("mail", 16) + " Duyuruyu gönder</button></div>" +
          '<div class="sp-eposta" id="spDO">' + duyuruHtml(ilk) + "</div></div><h2>Gönderilen duyurular</h2>" + '<div class="sp-tablo-kap"><table class="sp-tablo"><thead><tr><th>İlan</th><th>Alıcı</th><th>Tarih</th></tr></thead><tbody>' + gidenD.map(function (d) { var p = SP.urun(d.urun); return '<tr><td data-l="İlan">' + urunHucre(p) + '</td><td data-l="Alıcı">' + SP.sayi(d.kisi) + ' üye (örnek)</td><td data-l="Tarih">' + SP.once(d.t) + "</td></tr>"; }).join("") + "</tbody></table></div>";
      }
    } else if (sekme === "profil") {
      ic = '<div class="sp-profil"><dl><dt>Ad soyad</dt><dd>' + esc(ben.yetkili) + (kur ? "</dd><dt>Firma</dt><dd>" + esc(ben.ad) : "") + "</dd><dt>Adres</dt><dd>" + esc(ben.adres) + "</dd><dt>E-posta</dt><dd>" + esc(ben.eposta) + " " + SP.tikRozet(ben.epostaOk, "doğrulandı") + "</dd><dt>Cep telefonu</dt><dd>" + esc(ben.tel) + " " + SP.tikRozet(ben.telOk, "doğrulandı") + "</dd><dt>Faaliyet alanı</dt><dd>" + S.kat[bid].map(function (k) { return '<span class="sp-cip">' + KAT[k].ad + "</span>"; }).join(" ") + ' <a href="#/hesabim?sekme=akis">Düzenle</a></dd><dt>Üyelik</dt><dd>' + SP.paketAd(ben) + "</dd>" + (ben.onayT ? "<dt>Bilgilendirme metni</dt><dd>Onaylandı · " + new Date(ben.onayT).toLocaleString("tr-TR") + "</dd>" : "") + "</dl>" + (SP.firmaOk(ben) ? "" : '<div class="sp-uyari">' + SP.ui("kalkan", 18) + '<div><b>Doğrulama bekliyor.</b> Telefon ve e-posta doğrulanmadan ilan verilemez. <button class="sp-link" data-dogrula>Şimdi doğrula</button></div></div>') + '<p class="sp-bilgi">' + SP.ui("kalkan", 16) + " Doğrulanmış bilgileriniz üye sayfanızda yeşil tik ile gösterilir.</p>" + (kur ? "" : '<div class="sp-uyari">' + SP.ui("kilit", 18) + "<div><b>Üye sayfanızdaki banner alanı</b> site tarafından reklam için kullanılır; bireysel üyeler bu alana resim yükleyemez. Kendi banner'ınız için kurumsal pakete geçebilirsiniz.</div></div>") + "</div>";
    } else if (sekme === "yukselt") {
      ic = '<div class="sp-yukselt"><h2>' + (kur ? "Gold pakete geçin" : "Daha fazlası için kurumsal üyelik") + "</h2><p>" + (kur ? "Gold'da 25 ilan hakkı ve kayan slayt 5 tanıtım resmi vardır." : "Bireysel üyelikte yılda 3 ilan hakkınız var. Basic'te 10, Gold'da 25 ilan hakkı, kendi banner'ınız ve firma sayfanız olur.") + '</p><div class="sp-m-btns"><a class="sp-btn" href="#/paketler">Paketleri karşılaştır</a></div></div>';
    }
    return '<section class="sp-sayfa sp-panel">' + bas + nav + '<div class="sp-panel-ic">' + ic + '</div><p class="sp-demo-not">Örnek veri tarayıcınızda saklanır. <button class="sp-link" data-sifirla>Demoyu sıfırla</button></p></section>';
  };
  function duyuruHtml(p) {
    var k = KAT[p.kat], f = FIR[p.firma];
    return '<div class="sp-eposta-bas"><span class="sp-rozet">Önizleme</span><div><b>StokPazarı</b> &lt;duyuru@stokpazari.ornek&gt;<br><small>Kime: ' + k.ad + " kategorisindeki üyeler</small></div></div><div class=\"sp-eposta-konu\">Yeni ilan: " + esc(p.ad) + '</div><div class="sp-eposta-govde"><div class="sp-eposta-urun">' + SP.gorsel(p) + "</div><p><b>" + esc(f.ad) + "</b> faaliyet alanınızdaki yeni ilanını duyuruyor:</p><p><b>" + esc(p.ad) + "</b><br>" + SP.tl(p.fiyat) + " / " + esc(p.birim) + " · Stok " + SP.sayi(p.stok) + " " + esc(p.birim) + "</p><p>İlanı görmek ve teklif vermek için StokPazarı'na giriş yapın.</p></div>";
  }
  SP.duyuruOnizle = function (pid) {
    var p = SP.urun(pid), k = KAT[p.kat];
    document.getElementById("spDO").innerHTML = duyuruHtml(p);
    document.getElementById("spDH").textContent = SP.sayi(k.uye);
    document.getElementById("spDK").textContent = k.ad + " kategorisindeki üye (örnek sayı)";
  };
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.esikAyar) {
      var y = parseFloat(el.value) || 0, id = el.dataset.esikAyar;
      if (y < 0) y = 0;
      SP.hemenAlAyarla(id, el.dataset.tip, y);
      el.closest(".sp-esik-ayar").querySelector("small").textContent = esikMetin(SP.urun(id));
    }
  });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.esikAyar) { el.closest(".sp-esik-ayar").querySelector("small").textContent = "Kaydedildi: " + esikMetin(SP.urun(el.dataset.esikAyar)); }
    if (el.dataset && el.dataset.siklik) { S.bildirimSiklik = el.dataset.siklik; kaydet(); SP.toast("Bildirim tercihi kaydedildi", { aninda: "Yeni ilan girildiğinde anında e-posta alacaksınız.", gunluk: "Her sabah 08:00'de günlük özet gelecek.", kapali: "Yeni ürün e-postaları kapatıldı." }[el.dataset.siklik], "ok"); }
    if (el.name === "tur" && el.closest("#spUye")) {
      el.closest("#spUye").querySelectorAll(".sp-uye-tur label").forEach(function (l) { l.classList.toggle("on", l.querySelector("input").checked); });
      el.closest("#spUye").classList.toggle("bireysel", el.value === "bireysel");
    }
    if (el.dataset && el.dataset.yukle && el.files && el.files[0]) {
      var tip = el.dataset.yukle, dz = duzenim();
      if (tip === "banner") resimOku(el.files[0], 1400, 260, function (u) { dz.banner = u; if (kaydet()) { SP.ciz(true); SP.toast("Banner yüklendi", "Firma sayfanızın üstünde görünüyor.", "ok"); } });
      else if (tip === "logo") resimOku(el.files[0], 240, 240, function (u) { dz.logo = u; if (kaydet()) { SP.ciz(true); SP.toast("Logo yüklendi", "", "ok"); } });
      else resimOku(el.files[0], 1000, 625, function (u) { if (!dz.resim) dz.resim = {}; dz.resim[el.dataset.i] = u; if (kaydet()) { SP.ciz(true); SP.toast("Tanıtım resmi yüklendi", "", "ok"); } });
    }
  });
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "spUye") return;
    e.preventDefault();
    var f = e.target, tur = f.tur.value, kur = tur !== "bireysel", s = document.getElementById("spUS");
    var kat = [].slice.call(f.querySelectorAll('input[name="kat"]:checked')).map(function (x) { return x.value; });
    var ad = f.ad.value.trim(), fi = f.firma.value.trim(), ep = f.eposta.value.trim(), tl = f.tel.value.trim(), il = f.il.value.trim(), ilce = f.ilce.value.trim(), adr = f.adres.value.trim();
    var hata = !ad ? "Ad soyad yazın." : kur && !fi ? "Firma unvanı yazın." : !/.+@.+\..+/.test(ep) ? "Geçerli bir e-posta yazın." : tl.replace(/\D/g, "").length < 10 ? "Cep telefonu yazın." : !il ? "İl yazın." : !kat.length ? "En az bir faaliyet alanı seçin." : !f.onay.checked ? "Üye olmak için bilgilendirme metnini onaylamanız gerekir." : "";
    if (hata) { s.className = "sp-form-sonuc hata"; s.textContent = hata; return; }
    var id = "u" + Date.now(), yeni = { id: id, ad: kur ? fi : ad, kat: kat, il: il, ilce: ilce || il, yil: new Date().getFullYear(), paket: tur, yetkili: ad, unvan: kur ? "Yetkili" : "Bireysel üye", uzman: "", katildi: 0, telOk: false, epostaOk: false, no: 100 + S.uyeler.length, adres: adr || (ilce ? ilce + " / " + il : il), tel: tl, eposta: ep, tarihce: kur ? "Firma tanıtım yazısı henüz eklenmedi." : "Bireysel üye.", onayT: Date.now(), onaySurum: "site-duzeltmeler-0411" };
    S.uyeler.push(yeni); FIR[id] = yeni; if (kur) V.FIRMA.unshift(yeni);
    S.aktif = id; S.kat[id] = kat.slice(); S.mesaj[id] = [];
    kaydet(); location.hash = "#/hesabim?sekme=profil"; setTimeout(dogrulaPenceresi, 80);
  });

  /* kayan slayt (Gold firma sayfası) */
  var slaytZaman;
  function slaytKur() {
    clearInterval(slaytZaman);
    var l = document.querySelectorAll("[data-slayt]");
    if (!l.length) return;
    slaytZaman = setInterval(function () { document.querySelectorAll("[data-slayt]").forEach(function (s) { slaytGit(s, (+s.dataset.i || 0) + 1); }); }, 4500);
  }
  function slaytGit(s, n) {
    var k = s.querySelectorAll(".sp-slayt-k"), d = s.querySelectorAll(".sp-slayt-n button");
    n = (n + k.length) % k.length; s.dataset.i = n;
    k.forEach(function (x, i) { x.classList.toggle("on", i === n); });
    d.forEach(function (x, i) { x.classList.toggle("on", i === n); });
  }
  SP.galeri = function (f) {
    var n = resimHakSayi(f.paket);
    if (!n) return "";
    if (n === 1) return '<div class="sp-tek-resim">' + SP.tanitim(f, 0) + "</div>";
    return '<div class="sp-slayt" data-slayt data-i="0" role="group" aria-label="Tanıtım resimleri, kayan slayt">' + [0, 1, 2, 3, 4].map(function (i) { return '<div class="sp-slayt-k' + (i === 0 ? " on" : "") + '">' + SP.tanitim(f, i) + "</div>"; }).join("") +
      '<button type="button" class="sp-slayt-o sol" data-slayt-ok="-1" aria-label="Önceki resim">' + SP.ui("sol", 20) + '</button><button type="button" class="sp-slayt-o sag" data-slayt-ok="1" aria-label="Sonraki resim">' + SP.ui("sag", 20) + '</button><div class="sp-slayt-n">' + [0, 1, 2, 3, 4].map(function (i) { return '<button type="button" class="' + (i === 0 ? "on" : "") + '" data-slayt-n="' + i + '" aria-label="Resim ' + (i + 1) + '"></button>'; }).join("") + "</div></div>";
  };
  SP.slaytKur = slaytKur;
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-slayt-ok],[data-slayt-n]");
    if (o) { var s = o.closest("[data-slayt]"); slaytGit(s, o.dataset.slaytN !== undefined ? +o.dataset.slaytN : (+s.dataset.i || 0) + (+o.dataset.slaytOk)); return; }
    var fk = e.target.closest("[data-firma-kaydet]");
    if (fk) { duzenim().tarihce = document.getElementById("spFT").value; if (kaydet()) SP.toast("Kaydedildi", "Firma sayfanız güncellendi.", "ok"); }
    var d = e.target.closest("[data-dogrula]"); if (d) { e.preventDefault(); dogrulaPenceresi(); }
    var u = e.target.closest("[data-uye-gir]"); if (u) { S.aktif = u.dataset.uyeGir; kaydet(); location.hash = "#/hesabim"; }
    var c = e.target.closest("[data-cikis]"); if (c) { S.aktif = null; kaydet(); location.hash = "#/"; SP.ciz(false); SP.toast("Çıkış yapıldı", "Üstteki örnek hesap düğmeleriyle ya da Üye ol ile devam edebilirsiniz.", "bilgi"); }
    var pk = e.target.closest("[data-paket-sec]"); if (pk) { e.preventDefault(); SP.paketSec(pk.dataset.paketSec); }
    var ds = e.target.closest("[data-ilan-duzenle]"); if (ds) { e.preventDefault(); SP.ilanPenceresi(ds.dataset.ilanDuzenle); }
    var il = e.target.closest("[data-ileri]"); if (il) { e.preventDefault(); SP.ileriSar(); }
    var sa = e.target.closest("[data-satinal]"); if (sa) { e.preventDefault(); SP.satinAlPenceresi(sa.dataset.satinal); }
  });

  /* başlat */
  SP.basla = function (tasarim) {
    SP.tasarim = tasarim;
    if (!document.querySelector(".sp-ornek-serit")) document.body.insertAdjacentHTML("afterbegin", '<div class="sp-ornek-serit">Örnek prototip: firma, ürün ve rakamlar kurgudur. Gerçek e-posta, SMS ve ödeme yoktur.</div>');
    window.addEventListener("hashchange", function () { SP.kapat(); SP.ciz(false); window.scrollTo(0, 0); });
    SP.ciz(false);
  };
})();
