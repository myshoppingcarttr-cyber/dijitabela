// Dijitabela canlı taslak motoru: 3 ayrı yerleşim, sektör profili, gerçek işlevler. Ana sayfa bunu iframe ile açar; tek başına tam ekran da çalışır.
(function () {
"use strict";
var TV = window.TV, Kok = document.getElementById("kok"), AZ = matchMedia("(prefers-reduced-motion: reduce)").matches;
var e = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
var trk = function (s) { return String(s || "").toLocaleLowerCase("tr-TR").trim(); };
var buyuk = function (s) { return String(s).toLocaleUpperCase("tr-TR"); };
var ilkB = function (s) { s = String(s); return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1); };
var TL = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
var hash = function (s) { var h = 7; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
var GUN = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"], GK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
var IK = {
  takvim: '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
  tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  sohbet: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ok: '<path d="M5 12h14M12 5l7 7-7 7"/>', tik: '<path d="M20 6 9 17l-5-5"/>', arti: '<path d="M12 5v14M5 12h14"/>', eksi: '<path d="M5 12h14"/>',
  fiyat: '<path d="M4 7h16M4 12h16M4 17h10"/>'
};
var ik = function (a, s) { s = s || 18; return '<svg class="ik" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IK[a] + "</svg>"; };

/* ---------- Sektör tablosu ve profil ---------- */
// sektor.js satırı: "Ad,Ad2@kategori@foto>Hizmet:fiyat/birim;Hizmet2"
var SATIR = {};
TV.S.split("\n").forEach(function (l) {
  var i = l.indexOf(">"); if (i < 0) return;
  var bas = l.slice(0, i).split("@"), kal = l.slice(i + 1).split(";").map(function (x) { var m = x.trim().match(/^(.*?)(?::(\d+)(?:\/(.+))?)?$/); return [m[1], "", m[2] ? +m[2] : 0, m[3] || ""]; }).filter(function (x) { return x[0]; });
  bas[0].split(",").forEach(function (a) { SATIR[trk(a)] = { ad: a.trim(), kat: bas[1], foto: bas[2], hiz: kal }; });
});
function saatYap(s) { var o = [null, null, null, null, null, null, null]; if (s === "7/24") { o.yirmiDort = true; return o; } s.split(";").forEach(function (p) { var m = p.trim().match(/^(\d)(?:-(\d))? (\d\d:\d\d)-(\d\d:\d\d)$/); if (!m) return; for (var i = +m[1]; i <= +(m[2] || m[1]); i++) o[i - 1] = [m[3], m[4]]; }); return o; }
function profil(sek) {
  var t = trk(sek), kay = SATIR[t];
  if (!kay && t) { var bul = Object.keys(SATIR).filter(function (a) { return a.indexOf(t) > -1 || (t.length > 3 && t.indexOf(a) > -1); })[0]; if (bul) kay = SATIR[bul]; }
  var pk = kay ? TV.ESLES[trk(kay.ad)] : TV.ESLES[t], p;
  if (pk) { p = Object.assign({ oncelik: true }, TV.P[pk]); p.kod = pk; p.katKod = TV.P[pk].kat || pk; }
  else {
    var k = TV.K[kay ? kay.kat : "genel"] || TV.K.genel; p = Object.assign({}, k); p.katKod = kay ? kay.kat : "genel"; p.kod = p.katKod;
    p.hizmet = (kay ? kay.hiz : TV.K.genel.hizmet).map(function (h) { return h.slice(); });
    var ilk = p.hizmet.slice(0, 3).map(function (h) { return trk(h[0]); }).join(", ");
    p.ozet = ilkB(ilk) + (p.hizmet.length > 3 ? " ve diğer işlerimiz. " : ". ") + p.ozet;
    p.not = p.not.replace("{liste}", ilk);
  }
  p.fotoKod = (kay && kay.foto) || p.foto || p.katKod; if (!TV.FOTO[p.fotoKod]) p.fotoKod = TV.FOTO[p.katKod] ? p.katKod : "ofis";
  p.saatD = saatYap(p.saat);
  return p;
}
function fotolar(kod, n, kay) { var a = TV.FOTO[kod] || [], c = [], s = {}; for (var i = 0; i < Math.min(n, a.length); i++) c.push(a[(i + (kay || 0)) % a.length]); while (c.length && c.length < n) c.push(c[c.length % a.length]); return c; }
function img(f, cls, yukle) { if (!f) return ""; return '<img class="' + (cls || "") + '" src="foto/' + f.d + '" alt="' + e(f.a) + '" width="' + f.w + '" height="' + f.h + '"' + (yukle === "hemen" ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"') + ">"; }

/* ---------- Çalışma saati: Türkiye saatine göre canlı ---------- */
function simdiTR() { try { var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()), o = {}; p.forEach(function (x) { o[x.type] = x.value; }); return new Date(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute); } catch (x) { return new Date(); } }
var gi = function (d) { return (d.getDay() + 6) % 7; };
var dk = function (s) { var a = s.split(":"); return +a[0] * 60 + +a[1]; };
function durum(p) {
  var S = p.saatD; if (S.yirmiDort) return { acik: true, t: "Şu an açık · 7/24" };
  var n = simdiTR(), g = gi(n), m = n.getHours() * 60 + n.getMinutes(), b = S[g];
  if (b && m >= dk(b[0]) && m < dk(b[1])) return { acik: true, t: "Şu an açık · kapanış " + b[1] };
  if (b && m < dk(b[0])) return { acik: false, t: "Şu an kapalı · bugün açılış " + b[0] };
  for (var i = 1; i < 8; i++) { var x = S[(g + i) % 7]; if (x) return { acik: false, t: "Şu an kapalı · " + (i === 1 ? "yarın" : GUN[(g + i) % 7]) + " açılış " + x[0] }; }
  return { acik: false, t: "Randevuyla" };
}
function saatTablo(p, cls) {
  if (p.saatD.yirmiDort) return '<p class="saat-247">Her gün 24 saat açığız.</p>';
  var g = gi(simdiTR()), sat = []; p.saatD.forEach(function (b, i) { sat.push("<tr" + (i === g ? ' class="bugun"' : "") + "><th>" + GUN[i] + (i === g ? " <small>bugün</small>" : "") + "</th><td>" + (b ? b[0] + " – " + b[1] : "Kapalı") + "</td></tr>"); });
  return '<table class="saatler ' + (cls || "") + '"><caption class="gizli">Çalışma saatleri</caption><tbody>' + sat.join("") + "</tbody></table>";
}

/* ---------- Harita: ağır kütüphane yok, işletmeye göre değişen sokak planı ---------- */
function harita(C) {
  var h = hash(C.ad + C.sek), r = function (a, b, i) { return a + ((h >> i) & 31) / 31 * (b - a); }, cad = Math.round(r(80, 200, 1)), cad2 = Math.round(r(430, 620, 6)), cad3 = Math.round(r(150, 290, 11));
  var bloklar = ""; for (var x = 0; x < 11; x++) for (var y = 0; y < 6; y++) { var hx = hash(h + ":" + x + ":" + y); if (hx % 5 === 0) continue; bloklar += '<rect class="hb' + (hx % 7 === 0 ? " park" : "") + '" x="' + (x * 72 + 8 + hx % 6) + '" y="' + (y * 68 + 8 + hx % 5) + '" width="' + (48 + hx % 14) + '" height="' + (44 + hx % 12) + '" rx="2"/>'; }
  var yer = e(C.p.adres);
  return '<figure class="harita"><svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Örnek konum planı: ' + yer + '">' + bloklar +
    '<path class="hy" d="M-10 ' + cad3 + " L810 " + (cad3 + 46) + '"/><path class="hy" d="M' + cad + " -10 L" + (cad + 70) + ' 430"/><path class="hy2" d="M' + cad2 + " -10 C" + (cad2 - 60) + " 160 " + (cad2 + 90) + " 260 " + (cad2 + 20) + ' 430"/><path class="hy2" d="M-10 340 L810 310"/>' +
    '<g transform="translate(400 206)"><g class="hp"><circle class="hp-h" cy="4" r="13"/><path class="hp-p" d="M0 4c-15-15-21-24-21-34a21 21 0 0 1 42 0c0 10-6 19-21 34z"/><circle class="hp-n" cy="-30" r="7.5"/></g></g></svg>' +
    "<figcaption><b>" + e(C.ad) + "</b><span>" + yer + "</span><small>Örnek konum. Gerçek sitede Google Haritalar kaydınız ve yol tarifi açılır.</small></figcaption></figure>";
}

/* ---------- Fiyat hesaplama ---------- */
function hesapVeri(p) {
  if (p.arac) return p.arac;
  var fiyatli = p.hizmet.filter(function (h) { return h[2]; });
  return { baslik: p.fiyatBaslik || (fiyatli.length ? "Fiyatı kendiniz hesaplayın" : "İstediklerinizi seçin, fiyat sorun"), gruplar: [{ ad: p.secEtiket || "Neye ihtiyacınız var?", tip: "coklu", sec: p.hizmet.map(function (h) { return [h[0], h[2], h[3]]; }) }], teklif: fiyatli.length === 0 };
}
var VAR = { "m²": [50, 5], "metre": [10, 1], "kişi": [4, 1], "gece": [2, 1], "seans": [6, 1], "saat": [2, 1], "adet": [1, 1], "kg": [1, 1], "ay": [1, 1], "gün": [2, 1], "ders": [8, 1], "koli": [1, 1], "dönüm": [5, 1], "ton": [1, 1], "km": [20, 5], "sayfa": [10, 5], "kapı": [1, 1] };
function hesapBaslat(C) { var a = hesapVeri(C.p), st = {}; a.gruplar.forEach(function (g, i) { if (g.tip === "tek" || g.tip === "carpan") st[i] = g.bas || 0; else { st[i] = {}; (g.bas || [0]).forEach(function (j) { var bm = g.sec[j] && g.sec[j][2]; st[i][j] = bm ? (VAR[bm] || [1, 1])[0] : 1; }); } }); C.h = st; C.hv = a; }
function hesapla(C) {
  var a = C.hv, st = C.h, top = 0, car = 1, sat = [];
  a.gruplar.forEach(function (g, i) {
    if (g.tip === "tek") { var s = g.sec[st[i]]; top += s[1] || 0; sat.push([s[0], s[1] || 0]); }
    else if (g.tip === "carpan") { var c = g.sec[st[i]]; car *= c[1]; if (c[1] !== 1) sat.push([c[0], "×" + String(c[1]).replace(".", ",")]); }
    else Object.keys(st[i]).forEach(function (j) { var s2 = g.sec[j], q = st[i][j], b = s2[2], f = (s2[1] || 0) * q; top += f; sat.push([s2[0] + (b ? " · " + q + " " + b : ""), f]); });
  });
  return { sat: sat, top: Math.round(top * car / 10) * 10 };
}
function hesapGrup(C, g, i) {
  var st = C.h[i];
  return '<fieldset class="h-g"><legend>' + e(g.ad) + "</legend>" + g.sec.map(function (s, j) {
    var tek = g.tip !== "coklu", sec = tek ? st === j : st[j] != null, b = s[2], fy = g.tip === "carpan" ? (s[1] === 1 ? "" : "×" + String(s[1]).replace(".", ",")) : (s[1] ? TL(s[1]) + (b ? " / " + b : "") : (C.hv.teklif ? "" : "fiyat sorun"));
    return '<div class="h-s' + (sec ? " on" : "") + '"><button type="button" class="h-b" data-act="hsec" data-g="' + i + '" data-j="' + j + '" aria-pressed="' + sec + '"><i class="h-k' + (tek ? " yuv" : "") + '">' + (sec ? ik("tik", 13) : "") + "</i><span>" + e(s[0]) + "</span><em>" + e(fy) + "</em></button>" +
      (!tek && sec && b ? '<div class="h-q"><button type="button" data-act="hadet" data-g="' + i + '" data-j="' + j + '" data-y="-1" aria-label="Azalt">' + ik("eksi", 14) + "</button><b>" + st[j] + " " + e(b) + '</b><button type="button" data-act="hadet" data-g="' + i + '" data-j="' + j + '" data-y="1" aria-label="Artır">' + ik("arti", 14) + "</button></div>" : "") + "</div>";
  }).join("") + "</fieldset>";
}
function hesapOzet(C) {
  var r = hesapla(C), a = C.hv, T = C.p.talep;
  return '<div class="f-ust"><span>' + (a.teklif ? "Seçimleriniz" : "Tahmini tutar") + "</span><small>" + (a.teklif ? "Teklif talebi" : "Örnek fiyat") + '</small></div><ul class="f-kal">' + (r.sat.length ? r.sat.map(function (x) { return "<li><span>" + e(x[0]) + "</span><b>" + (a.teklif ? "" : (typeof x[1] === "number" ? (x[1] ? TL(x[1]) : "fiyat sorun") : e(x[1]))) + "</b></li>"; }).join("") : '<li class="bos"><span>Seçim yapın, tutar burada oluşur.</span></li>') + "</ul>" +
    (a.teklif ? "" : '<div class="f-top"><span>Toplam</span><b>' + TL(r.top) + "</b></div>") +
    '<p class="f-not">' + e(a.not || "Fiyatlar taslak için örnektir; gerçek sitede kendi fiyat listeniz çalışır.") + '</p><button type="button" class="dg ana tam" data-act="hgit"' + (r.sat.length ? "" : " disabled") + ">" + e(a.teklif ? (C.p.teklifDugme || "Bu iş için teklif iste") : "Bu seçimle devam et") + " " + ik("ok", 16) + "</button>";
}
function hesapHTML(C) { return '<div class="hesap"><div class="h-sol">' + C.hv.gruplar.map(function (g, i) { return hesapGrup(C, g, i); }).join("") + '</div><aside class="fis" aria-live="polite">' + hesapOzet(C) + "</aside></div>"; }

/* ---------- Randevu / rezervasyon / talep akışı ---------- */
function gunler() { var n = simdiTR(), o = []; for (var i = 0; i < 14; i++) o.push(new Date(n.getFullYear(), n.getMonth(), n.getDate() + i)); return o; }
function slotlar(C, d) {
  var T = C.p.talep, S = C.p.saatD, g = gi(d), b = S.yirmiDort ? ["09:00", "21:00"] : S[g]; if (!b) return [];
  if (T.bant) return T.bant.map(function (x) { return { t: x, dolu: hash(d.toDateString() + x + C.sek) % 5 === 0 }; });
  var o = [], ad = T.adim || 60, n = simdiTR(), bugun = n.toDateString() === d.toDateString(), sim = n.getHours() * 60 + n.getMinutes(), bi = dk(b[1]) < dk(b[0]) ? 1440 : dk(b[1]), son = bi - ad;
  for (var m = dk(b[0]); m <= son; m += ad) { if (bugun && m <= sim + 45) continue; var hh = String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); o.push({ t: hh, dolu: hash(d.toDateString() + hh + C.sek) % 4 === 0 }); }
  return o;
}
function secenekler(C) { return C.p.talep.secenek || C.p.hizmet.map(function (h) { return h[0]; }); }
function talepHTML(C) {
  var T = C.p.talep, st = C.t, gl = gunler(), secil = gl[st.g] || gl[0], sl = slotlar(C, secil);
  if (st.bitti) {
    var wa = "https://wa.me/905019452184?text=" + encodeURIComponent("Merhaba, Dijitabela taslağında " + C.ad + " (" + C.sek + ") için gördüğüm talep sistemini kendi siteme istiyorum.");
    return '<div class="onay" aria-live="polite"><p class="onay-b">' + ik("tik", 18) + " " + e(T.onay || "Talebiniz hazır") + '</p><div class="balon"><small>İşletmenin WhatsApp hattına düşen mesaj</small><p>' + e(talepMesaj(C)) + '</p></div><p class="onay-n">Bu bir taslak olduğu için mesaj gönderilmedi. Gerçek sitede bu talep doğrudan sizin WhatsApp hattınıza gelir, müşteriye de onay gider.</p><div class="dgler"><a class="dg ana" href="' + wa + '" target="_blank" rel="noopener">' + ik("sohbet", 16) + ' Bu sistemi sitemde istiyorum</a><button type="button" class="dg" data-act="tyeni">Yeniden dene</button></div></div>';
  }
  var h = '<div class="t-ad"><label class="t-et" for="t-h">' + e(T.hizmetEtiket || "Hangi iş için?") + '</label><div class="sec-sar"><select id="t-h" data-act="thiz">' + secenekler(C).map(function (x, i) { return '<option value="' + i + '"' + (st.h === i ? " selected" : "") + ">" + e(x) + "</option>"; }).join("") + "</select></div></div>";
  if (T.kisi) h += '<div class="t-ad"><span class="t-et">' + e(T.kisi) + '</span><div class="h-q"><button type="button" data-act="tkisi" data-y="-1" aria-label="Azalt">' + ik("eksi", 14) + "</button><b>" + st.k + " " + e(T.kisiBirim || "kişi") + '</b><button type="button" data-act="tkisi" data-y="1" aria-label="Artır">' + ik("arti", 14) + "</button></div></div>";
  if (T.gece) h += '<div class="t-ad"><span class="t-et">Kaç gece?</span><div class="h-q"><button type="button" data-act="tgece" data-y="-1" aria-label="Azalt">' + ik("eksi", 14) + "</button><b>" + st.n + ' gece</b><button type="button" data-act="tgece" data-y="1" aria-label="Artır">' + ik("arti", 14) + "</button></div></div>";
  h += '<div class="t-ad"><span class="t-et">' + e(T.gunEtiket || "Hangi gün?") + '</span><div class="gunler" role="group" aria-label="Gün seçimi">' + gl.map(function (d, i) { var kap = !C.p.saatD.yirmiDort && !C.p.saatD[gi(d)]; return '<button type="button" data-act="tgun" data-i="' + i + '"' + (kap ? " disabled" : "") + ' aria-pressed="' + (st.g === i) + '"><small>' + GK[gi(d)] + "</small><b>" + d.getDate() + "</b><small>" + AY[d.getMonth()].slice(0, 3) + "</small></button>"; }).join("") + "</div></div>";
  if (!T.gece) h += '<div class="t-ad"><span class="t-et">' + e(T.saatEtiket || "Hangi saat?") + ' <small>örnek doluluk</small></span><div class="slot" role="group" aria-label="Saat seçimi">' + (sl.length ? sl.map(function (x) { return '<button type="button" data-act="tslot" data-s="' + e(x.t) + '"' + (x.dolu ? " disabled" : "") + ' aria-pressed="' + (st.s === x.t) + '">' + e(x.t) + "</button>"; }).join("") : '<p class="bos">Bu gün için boş saat kalmadı. Başka gün seçin.</p>') + "</div></div>";
  h += '<div class="t-ad t-kim"><div><label class="t-et" for="t-a">Adınız</label><input id="t-a" data-alan="ad" value="' + e(st.ad) + '" autocomplete="off" placeholder="Örn. Mehmet Y."></div><div><label class="t-et" for="t-e">' + e(T.ekEtiket || "Not") + '</label><input id="t-e" data-alan="ek" value="' + e(st.ek) + '" autocomplete="off" placeholder="' + e(T.ekOrnek || "Kısa not") + '"></div></div>';
  var hazir = T.gece || st.s;
  h += '<button type="button" class="dg ana tam" data-act="tgonder"' + (hazir ? "" : " disabled") + ">" + e(T.fiil || "Talep oluştur") + " " + ik("ok", 16) + "</button>" + (hazir ? "" : '<p class="t-ipucu">Devam etmek için bir saat seçin.</p>');
  return h;
}
function talepMesaj(C) {
  var T = C.p.talep, st = C.t, d = gunler()[st.g], m = "Merhaba, " + (st.ad ? "ben " + st.ad + ". " : "");
  m += secenekler(C)[st.h] + (T.kisi ? " · " + st.k + " " + (T.kisiBirim || "kişi") : "") + (T.gece ? " · " + st.n + " gece" : "");
  m += " · " + d.getDate() + " " + AY[d.getMonth()] + " " + GUN[gi(d)] + (st.s ? " · " + st.s : "");
  if (st.ek) m += " · " + st.ek;
  if (st.hOzet) m += " · Seçimim: " + st.hOzet;
  return m + ".";
}

/* ---------- Sektöre özel modüller ---------- */
function sekme(liste, akt, act, etiket) { return '<div class="sekme" role="group" aria-label="' + e(etiket || "Seçenekler") + '">' + liste.map(function (x, i) { var v = act === "mf" ? x : i; return '<button type="button" data-act="' + act + '" data-v="' + e(v) + '" aria-pressed="' + (act === "mf" ? x === akt : i === akt) + '">' + e(x) + "</button>"; }).join("") + "</div>"; }
var MOD = {
  durum: function (C, M) { var s = C.m.a == null ? 2 : C.m.a, son = M.adim.length - 1; return '<div class="d-sor"><span>' + e(M.alan) + "</span><b>" + e(M.ornek) + '</b></div><ol class="d-ad">' + M.adim.map(function (a, i) { return '<li class="' + (i < s ? "tam" : i === s ? "su" : "") + '"><i>' + (i < s ? ik("tik", 14) : i + 1) + "</i><b>" + e(a[0]) + "</b><span>" + e(a[1]) + "</span></li>"; }).join("") + '</ol><div class="d-kart"><b>' + e(s === 2 ? M.onayB : s >= son ? M.bitB : M.yolB) + "</b><p>" + e(s === 2 ? M.onayT : s >= son ? M.bitT : M.yolT) + "</p>" + (s < son ? '<button type="button" class="dg ana" data-act="mileri">' + e(s === 2 ? M.onayD : "Sonraki adımı göster") + "</button>" : '<button type="button" class="dg" data-act="msifir">Başa al</button>') + "</div>"; },
  ilan: function (C, M) { var f = C.m.f || "Tümü", lst = M.liste.filter(function (x) { return f === "Tümü" || x.t === f; }), fo = fotolar(M.foto || C.p.fotoKod, 6, 1); return sekme(["Tümü"].concat(M.filtre), f, "mf") + '<div class="ilanlar">' + lst.map(function (x) { var ff = fo[M.liste.indexOf(x) % fo.length]; return '<article class="ilan">' + img(ff, "ilan-f") + "<div><small>" + e(x.t) + " · örnek " + e(M.tekil || "ilan") + "</small><h4>" + e(x.b) + "</h4><p>" + e(x.d) + "</p><b>" + e(x.f) + '</b><button type="button" class="dg" data-act="mgit" data-v="' + e(x.b) + '">' + e(M.dugme) + "</button></div></article>"; }).join("") + "</div>"; },
  menu: function (C, M) { var ad = M.grup.map(function (x) { return x[0]; }), f = C.m.f || ad[0], g = M.grup[ad.indexOf(f)]; return sekme(ad, f, "mf", "Menü bölümü") + '<ul class="menu-l">' + g[1].map(function (x) { return "<li><div><b>" + e(x[0]) + "</b><small>" + e(x[1]) + "</small></div><i></i><span>" + TL(x[2]) + "</span></li>"; }).join("") + '</ul><p class="m-not">Örnek menü. Gerçek menüde fotoğraf, alerjen ve stok bilgisi de güncellenir.</p>'; },
  oda: function (C, M) { var fo = fotolar(C.p.fotoKod, 4, 1); return '<div class="ilanlar">' + M.liste.map(function (x, i) { return '<article class="ilan">' + img(fo[i % fo.length], "ilan-f") + "<div><small>En çok " + x.k + " kişi · örnek oda</small><h4>" + e(x.b) + "</h4><p>" + e(x.d) + "</p><b>Gecelik " + TL(x.f) + '</b><button type="button" class="dg" data-act="mgit" data-v="' + e(x.b) + '">Müsaitliğe bak</button></div></article>'; }).join("") + "</div>"; },
  takvim: function (C, M) { var n = simdiTR(), bg = new Date(n.getFullYear(), n.getMonth(), n.getDate()), o = []; for (var k = 0; k < 3; k++) M.liste.forEach(function (x) { var d = new Date(n.getFullYear(), n.getMonth() + k, x[0]), kal = Math.round((d - bg) / 864e5); if (kal >= 0) o.push({ d: d, kal: kal, b: x[1], a: x[2] }); }); o.sort(function (a, b) { return a.kal - b.kal; }); return '<ol class="tk">' + o.slice(0, 4).map(function (x) { return "<li><time>" + x.d.getDate() + " " + AY[x.d.getMonth()] + "</time><div><b>" + e(x.b) + "</b><small>" + e(x.a) + "</small></div><span>" + (x.kal === 0 ? "bugün" : x.kal + " gün kaldı") + "</span></li>"; }).join("") + '</ol><p class="m-not">' + e(M.not) + "</p>"; },
  rehber: function (C, M) { var f = C.m.i || 0, r = M.liste[f]; return sekme(M.liste.map(function (x) { return x[0]; }), f, "mi", M.soru) + '<div class="rh"><h4>' + e(M.listeB) + "</h4><ul>" + r[1].map(function (x) { return "<li>" + ik("tik", 15) + "<span>" + e(x) + "</span></li>"; }).join("") + "</ul><p>" + e(r[2]) + '</p><button type="button" class="dg ana" data-act="mgit" data-v="' + e(r[0]) + '">' + e(M.dugme) + "</button></div>"; },
  program: function (C, M) { var f = C.m.i == null ? Math.min(gi(simdiTR()), M.gun.length - 1) : C.m.i, g = M.gun[f]; return sekme(M.gun.map(function (x) { return x[0]; }), f, "mi", "Gün") + '<ul class="pr">' + g[1].map(function (x) { return "<li><time>" + e(x[0]) + "</time><div><b>" + e(x[1]) + "</b><small>" + e(x[2]) + '</small></div><button type="button" class="dg" data-act="mgit" data-v="' + e(x[1]) + '">' + e(M.dugme) + "</button></li>"; }).join("") + '</ul><p class="m-not">Örnek program.</p>'; },
  metraj: function (C, M) { var m = C.m.m || M.bas, i = C.m.i || 0, t = M.is[i], tut = m * t[1], gn = Math.max(1, Math.ceil(m / t[2])); return sekme(M.is.map(function (x) { return x[0]; }), i, "mi", "İş türü") + '<label class="mt-l">' + e(M.etiket) + ": <b>" + m + ' m²</b><input type="range" min="' + M.min + '" max="' + M.max + '" step="5" value="' + m + '" data-act="mm"></label><dl class="mt-s"><div><dt>Tahmini tutar</dt><dd>' + TL(Math.round(tut * .9 / 100) * 100) + " – " + TL(Math.round(tut * 1.15 / 100) * 100) + "</dd></div><div><dt>Tahmini süre</dt><dd>" + gn + " iş günü</dd></div><div><dt>Birim</dt><dd>" + TL(t[1]) + ' / m²</dd></div></dl><p class="m-not">' + e(M.not) + '</p><button type="button" class="dg ana" data-act="mgit" data-v="' + e(t[0] + " · " + m + " m²") + '">Keşif iste</button>'; },
  asi: function (C, M) { var ad = M.tur.map(function (x) { return x[0]; }), t = C.m.f || ad[0], l = M.tur[ad.indexOf(t)], a = C.m.ay == null ? 2 : C.m.ay; return sekme(ad, t, "mf", "Tür") + '<label class="mt-l">Dostunuzun yaşı: <b>' + a + ' aylık</b><input type="range" min="1" max="12" value="' + a + '" data-act="may"></label><ol class="tk asi">' + l[1].map(function (x) { var kal = x[0] - a; return "<li><time>" + x[0] + ". ay</time><div><b>" + e(x[1]) + "</b><small>" + e(x[2]) + "</small></div><span>" + (kal < 0 ? "zamanı geçti, sorun" : kal === 0 ? "bu ay" : kal + " ay sonra") + "</span></li>"; }).join("") + '</ol><p class="m-not">' + e(M.not) + "</p>"; },
  oneri: function (C, M) { var f = C.m.i || 0, r = M.liste[f]; return sekme(M.liste.map(function (x) { return x[0]; }), f, "mi", M.soru) + '<div class="on-k">' + img(fotolar(C.p.fotoKod, 5, f + 1)[0], "on-f") + "<div><h4>" + e(r[1]) + "</h4><p>" + e(r[2]) + '</p><button type="button" class="dg ana" data-act="mgit" data-v="' + e(r[1]) + '">' + e(M.dugme) + "</button></div></div>"; },
  hazirlik: function (C, M) { var se = C.m.s || {}, msg = M.liste.filter(function (x, i) { return se[i]; }); return '<div class="hz"><ul>' + M.liste.map(function (x, i) { var on = !!se[i]; return '<li><button type="button" data-act="ms" data-v="' + i + '" aria-pressed="' + on + '"><i class="h-k">' + (on ? ik("tik", 13) : "") + "</i><span>" + e(x) + "</span></button></li>"; }).join("") + '</ul><div class="balon"><small>İşaretledikçe hazırlanan mesaj</small><p>' + e(msg.length ? M.bas + " " + msg.map(trk).join(", ") + "." : "İşaretleyin, mesajınız burada yazılsın.") + "</p></div></div>"; }
};
function modHTML(C) { var M = C.p.imza; return M && MOD[M.tur] ? MOD[M.tur](C, M) : ""; }

/* ---------- Ortak parçalar ---------- */
function sssHTML(C) { var p = C.p, l = p.sss.concat([["Çalışma saatleriniz nedir?", p.saatD.yirmiDort ? "7 gün 24 saat açığız." : "Güncel saatlerimiz iletişim bölümündeki tabloda; bugün açık mıyız, sayfanın üstünde canlı görünür."]]); return l.map(function (x, i) { return "<details" + (i === 0 ? " open" : "") + "><summary>" + e(x[0]) + "</summary><p>" + e(x[1]) + "</p></details>"; }).join(""); }
function kredi(C) { var g = {}, l = []; (C.kull || []).forEach(function (f) { if (!g[f.d]) { g[f.d] = 1; l.push(f); } }); return '<details class="kredi"><summary>Görsel kaynakları</summary><ul>' + l.map(function (f) { return '<li><a href="' + e(f.u) + '" target="_blank" rel="noopener nofollow">' + e(f.c || "Kaynak") + "</a> · " + e(f.l) + "</li>"; }).join("") + "</ul></details>"; }
function ilkAcik(p) { var n = simdiTR(), g = gi(n); if (p.saatD.yirmiDort) return 1; for (var i = 1; i < 14; i++) if (p.saatD[(g + i) % 7]) return i; return 0; }
var basH = function (s) { return String(s).split(/\s+/).map(ilkB).join(" "); };
function ctx(o) { var p = profil(o.sek), C = { sek: o.sek, ad: o.ad || ("Örnek " + basH(o.sek)), tarz: o.tarz, renk: o.renk, p: p, m: {}, t: { h: 0, g: ilkAcik(p), s: "", k: p.talep.kisiBas || 2, n: 2, ad: "", ek: "", bitti: false } }; hesapBaslat(C); return C; }
function nv(p, a) { var A = { hizmet: p.hizmetBaslik || "Hizmetler", fiyat: p.fiyatYok ? "Ücret" : (p.fiyatNav || "Fiyat"), galeri: "Galeri", iletisim: "İletişim", surec: "Süreç", sss: "SSS", randevu: p.talep.nav || "Randevu" }; return a.map(function (x) { return '<a href="#' + x + '" data-git="' + x + '">' + e(A[x]) + "</a>"; }).join(""); }
function yorumKart() { return '<li class="yorum-bos"><h3>Google yorumlarınız burada</h3><p>Gerçek sitede Google profilinizdeki yorumlar bu alanda görünür. Taslakta uydurma yorum ve puan göstermiyoruz.</p></li>'; }
function fiyatB(C, cls) { var p = C.p; if (p.fiyatYok) return '<section class="' + cls + '" id="fiyat"><h2><small>Ücret bilgisi</small>' + e(p.fiyatYok.b) + '</h2><p class="yasal">' + e(p.fiyatYok.t) + "</p></section>"; return '<section class="' + cls + '" id="fiyat"><h2><small>' + e(p.fiyatNav || "Fiyat") + "</small>" + e(C.hv.baslik) + '</h2><div id="hesap">' + hesapHTML(C) + "</div></section>"; }
function randevuB(C, cls) { var T = C.p.talep; return '<section class="' + cls + '" id="randevu"><h2><small>' + e(T.nav || "Randevu") + "</small>" + e(T.baslik) + '</h2><p class="bol-a">' + e(T.acik) + '</p><div class="talep" id="talep">' + talepHTML(C) + "</div></section>"; }
function modB(C, cls) { var M = C.p.imza; if (!M) return ""; return '<section class="' + cls + '" id="ozel"><h2><small>' + e(M.ust) + "</small>" + e(M.baslik) + '</h2><p class="bol-a">' + e(M.acik) + '</p><div class="mod mod-' + M.tur + '" id="mod">' + modHTML(C) + "</div></section>"; }
function altB(C) { return '<footer class="alt"><div><b>' + e(C.ad) + "</b><span>" + e(C.p.adres) + '</span></div><div class="alt-s"><span>Bu sayfa Dijitabela örnek taslağıdır; işletme, fiyat ve bilgiler temsilîdir.</span>' + kredi(C) + "</div></footer>"; }
function altCubuk(C, cls) { return '<nav class="alt-cub ' + cls + '" aria-label="Hızlı işlemler"><button type="button" data-act="ornek" data-t="tel">' + ik("tel", 18) + '<span>Ara</span></button><button type="button" data-act="ornek" data-t="wa">' + ik("sohbet", 18) + '<span>WhatsApp</span></button><a href="#fiyat" data-git="fiyat">' + ik("fiyat", 18) + "<span>" + e(C.p.fiyatYok ? "Ücret" : (C.p.fiyatNav || "Fiyat")) + '</span></a><a class="on" href="#randevu" data-git="randevu">' + ik("takvim", 18) + "<span>" + e(C.p.talep.nav || "Randevu") + "</span></a></nav>"; }
var hrf = function (ad) { return ad.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toLocaleUpperCase("tr-TR"); };
var fiyatYaz = function (p, h) { return p.fiyatYok ? "" : h[2] ? TL(h[2]) + (h[3] ? " / " + e(h[3]) : "'den") : (p.hizmet.some(function (x) { return x[2]; }) ? "fiyat sorun" : ""); };
function kayan(hz) { return hz.map(function (h) { return "<span>" + e(h[0]) + "</span>"; }).join(""); }
function yakinSlot(C) { var T = C.p.talep, gl = gunler(); for (var i = 0; i < gl.length; i++) { var d = gl[i], et = i === 0 ? "Bugün " : i === 1 ? "Yarın " : d.getDate() + " " + AY[d.getMonth()] + " "; if (T.gece) return et + "giriş müsait"; var s = slotlar(C, d).filter(function (x) { return !x.dolu; })[0]; if (s) return et + s.t; } return "Bu hafta"; }

/* ---------- A · VİTRİN: tabela hissi, fotoğraf önde yazısız, koyu zemin, dar başlık ---------- */
function vitrin(C) {
  var p = C.p, F = fotolar(p.fotoKod, 5), ad = e(C.ad), d = durum(p), hz = p.hizmet;
  C.kull = F;
  return '<header class="a-ust"><div class="a-ser"><span class="d-n' + (d.acik ? " ac" : "") + '">' + e(d.t) + "</span><span>" + e(p.adres) + '</span><span class="etik">Örnek taslak · bilgiler temsilîdir</span></div><nav class="a-nav" aria-label="Bölümler"><a class="a-mar" href="#ust" data-git="ust">' + ad + "</a><div>" + nv(p, ["hizmet", "fiyat", "galeri", "surec", "iletisim"]) + '</div><a class="dg ana" href="#randevu" data-git="randevu">' + e(p.cta) + "</a></nav></header>" +
  '<main id="ust"><section class="a-hero"><figure>' + img(F[0], "a-hf", "hemen") + '</figure><div class="a-tabela"><span class="a-sek">' + e(buyuk(C.sek)) + " · ANTALYA</span><h1>" + ad + '</h1></div><div class="a-alt"><p class="a-slo">' + e(p.slogan) + "</p><div><p>" + e(p.ozet) + '</p><div class="dgler"><a class="dg ana" href="#randevu" data-git="randevu">' + ik("takvim", 16) + " " + e(p.cta) + '</a><button type="button" class="dg" data-act="ornek" data-t="tel">' + ik("tel", 16) + " Arayın</button></div></div></div></section>" +
  '<div class="a-kayan" aria-hidden="true"><div>' + kayan(hz) + kayan(hz) + kayan(hz) + "</div></div>" +
  '<section class="a-bol" id="hizmet"><h2><small>' + e(p.hizmetBaslik || "Hizmetlerimiz") + "</small>" + e(p.hizmetUst || "Neler yapıyoruz") + '</h2><ol class="a-hz">' + hz.map(function (h, i) { return "<li><span>" + String(i + 1).padStart(2, "0") + "</span><div><h3>" + e(h[0]) + "</h3>" + (h[1] ? "<p>" + e(h[1]) + "</p>" : "") + "</div><b>" + fiyatYaz(p, h) + "</b></li>"; }).join("") + "</ol></section>" +
  '<section class="a-gal" id="galeri" aria-label="Galeri"><div class="a-gal-b"><h2><small>Galeri</small>İşimizden kareler</h2><div class="a-oklar"><button type="button" data-act="kay" data-y="-1" aria-label="Geri">' + ik("ok", 18) + '</button><button type="button" data-act="kay" data-y="1" aria-label="İleri">' + ik("ok", 18) + '</button></div></div><div class="a-serit" id="serit" tabindex="0">' + F.slice(1).concat(F[0]).map(function (f) { return "<figure>" + img(f) + "<figcaption>" + e(f.a) + "</figcaption></figure>"; }).join("") + "</div></section>" +
  fiyatB(C, "a-bol a-fiy") + randevuB(C, "a-bol a-ran") + modB(C, "a-bol a-mod") +
  '<section class="a-bol a-sur" id="surec"><h2><small>Süreç</small>Nasıl çalışırız</h2><ol>' + p.surec.map(function (s, i) { return "<li><i>" + (i + 1) + "</i><h3>" + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></li>"; }).join("") + "</ol></section>" +
  '<section class="a-bol a-guv" id="guven"><h2><small>Güven</small>Söz verdiklerimiz</h2><ul>' + p.guven.map(function (s) { return "<li><h3>" + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></li>"; }).join("") + yorumKart() + "</ul></section>" +
  '<section class="a-har" id="iletisim">' + harita(C) + '<div class="a-har-k"><h2><small>İletişim</small>Buradayız</h2><p class="d-n' + (d.acik ? " ac" : "") + '">' + e(d.t) + "</p>" + saatTablo(p) + "</div></section>" +
  '<section class="a-bol a-sss" id="sss"><h2><small>Sık sorulanlar</small>Aklınızdaki sorular</h2><div>' + sssHTML(C) + "</div></section>" +
  '<section class="a-son"><h2>' + e(p.sonBaslik || "Bir mesaj uzağınızdayız.") + '</h2><div class="dgler"><a class="dg ana" href="#randevu" data-git="randevu">' + e(p.cta) + '</a><button type="button" class="dg" data-act="ornek" data-t="wa">' + ik("sohbet", 16) + " WhatsApp</button></div></section></main>" + altB(C) + altCubuk(C, "a-cub");
}

/* ---------- B · MODERN: açık zemin, bento, uygulama hissi ---------- */
function modern(C) {
  var p = C.p, F = fotolar(p.fotoKod, 5, 1), d = durum(p), hz = p.hizmet, ad = e(C.ad);
  C.kull = F;
  return '<nav class="b-nav" aria-label="Bölümler"><a class="b-mar" href="#ust" data-git="ust"><i>' + e(hrf(C.ad)) + "</i><span>" + ad + "</span></a><div>" + nv(p, ["hizmet", "fiyat", "surec", "sss", "iletisim"]) + '</div><a class="dg ana" href="#randevu" data-git="randevu">' + e(p.cta) + '</a></nav><main id="ust">' +
  '<section class="b-hero"><div class="b-h-sol"><span class="b-cip"><i class="d-n' + (d.acik ? " ac" : "") + '"></i>' + e(d.t) + "</span><h1>" + e(p.slogan) + "</h1><p>" + e(p.ozet) + '</p><div class="dgler"><a class="dg ana" href="#randevu" data-git="randevu">' + e(p.cta) + " " + ik("ok", 16) + '</a><a class="dg" href="#fiyat" data-git="fiyat">' + e(p.fiyatYok ? "Ücret bilgisi" : (p.fiyatNav || "Fiyat")) + '</a></div><small class="etik">' + e(C.sek) + " · Antalya · örnek taslak</small></div>" +
  '<div class="b-h-sag">' + img(F[0], "b-hf", "hemen") + '<div class="b-kart"><small>' + e(p.talep.yakin || "En yakın boş saat") + "</small><b>" + e(yakinSlot(C)) + '</b><a href="#randevu" data-git="randevu">Yerinizi ayırın ' + ik("ok", 14) + "</a></div></div></section>" +
  '<section class="b-bol" id="hizmet"><div class="b-bas"><h2>' + e(p.hizmetUst || "Neler yapıyoruz") + "</h2><p>" + e(p.hizmetBaslik || "Hizmetlerimiz") + '</p></div><div class="b-bento">' + hz.map(function (h, i) { var fo = i === 0 ? F[1] : i === 3 ? F[2] : null; return '<article class="' + (i === 0 ? "gen" : i === 3 ? "uzun" : "") + (fo ? " fotolu" : "") + '">' + (fo ? img(fo) : "") + "<div><span>" + String(i + 1).padStart(2, "0") + "</span><h3>" + e(h[0]) + "</h3>" + (h[1] ? "<p>" + e(h[1]) + "</p>" : "") + (fiyatYaz(p, h) ? "<b>" + fiyatYaz(p, h) + "</b>" : "") + "</div></article>"; }).join("") + "</div></section>" +
  fiyatB(C, "b-bol b-kutu") + randevuB(C, "b-bol b-ran") + modB(C, "b-bol b-mod") +
  '<section class="b-bol b-sur" id="surec"><div class="b-sur-sol"><h2>Nasıl çalışırız</h2><p>İlk mesajdan işin bitişine kadar her adımı görürsünüz.</p>' + img(F[3], "b-sf") + "</div><ol>" + p.surec.map(function (s, i) { return "<li><i>" + (i + 1) + "</i><div><h3>" + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></div></li>"; }).join("") + "</ol></section>" +
  '<section class="b-bol" id="galeri"><div class="b-bas"><h2>Yerimizden kareler</h2><p>Gerçek sitede kendi fotoğraflarınız yer alır.</p></div><div class="b-gal">' + F.map(function (f) { return "<figure>" + img(f) + "<figcaption>" + e(f.a) + "</figcaption></figure>"; }).join("") + "</div></section>" +
  '<section class="b-bol b-guv" id="guven"><div class="b-bas"><h2>Neden bize güvenebilirsiniz</h2></div><ul>' + p.guven.map(function (s) { return "<li><h3>" + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></li>"; }).join("") + yorumKart() + "</ul></section>" +
  '<section class="b-bol b-sss" id="sss"><h2>Sık sorulanlar</h2><div>' + sssHTML(C) + "</div></section>" +
  '<section class="b-bol b-ilet" id="iletisim"><div class="b-il-k"><h2>İletişim</h2><p class="b-durum"><i class="d-n' + (d.acik ? " ac" : "") + '"></i>' + e(d.t) + "</p>" + saatTablo(p) + '<div class="dgler"><button type="button" class="dg ana" data-act="ornek" data-t="wa">' + ik("sohbet", 16) + ' WhatsApp</button><button type="button" class="dg" data-act="ornek" data-t="tel">' + ik("tel", 16) + " Ara</button></div></div>" + harita(C) + "</section></main>" + altB(C) + altCubuk(C, "b-cub");
}

/* ---------- C · KLASİK: kâğıt, tırnaklı yazı, kitap düzeni ---------- */
function klasik(C) {
  var p = C.p, F = fotolar(p.fotoKod, 5, 2), d = durum(p), hz = p.hizmet, ad = e(C.ad), R = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  C.kull = F;
  return '<header class="c-bas"><p class="c-ust"><span>' + e(p.adres) + "</span><span>" + e(d.t) + '</span><span class="etik">Örnek taslak</span></p><div class="c-kunye"><span>' + e(C.sek) + "</span><h1>" + ad + '</h1><span>Antalya</span></div><nav aria-label="Bölümler">' + nv(p, ["hizmet", "fiyat", "randevu", "surec", "iletisim"]) + '</nav></header><main id="ust">' +
  '<section class="c-acilis"><figure>' + img(F[0], "c-hf", "hemen") + "<figcaption>" + e(F[0] ? F[0].a : "") + '</figcaption></figure><article class="c-mek"><p class="c-slo">' + e(p.slogan) + '</p><p class="c-mt">' + e(p.not) + '</p><p class="c-imza">' + e(p.imzaAd || "İşletme sahibi") + '</p><a class="dg ana" href="#randevu" data-git="randevu">' + e(p.cta) + "</a></article></section>" +
  '<section class="c-bol" id="hizmet"><h2>' + e(p.hizmetBaslik || "Hizmetlerimiz") + '</h2><ol class="c-liste">' + hz.map(function (h, i) { var f = fiyatYaz(p, h); return "<li><span>" + R[i] + "</span><div><h3>" + e(h[0]) + "</h3>" + (h[1] ? "<p>" + e(h[1]) + "</p>" : "") + "</div>" + (f ? "<i></i><b>" + f + "</b>" : "") + "</li>"; }).join("") + "</ol></section>" +
  '<section class="c-uc" id="galeri" aria-label="Galeri">' + F.slice(1, 4).map(function (f) { return "<figure>" + img(f) + "<figcaption>" + e(f.a) + "</figcaption></figure>"; }).join("") + "</section>" +
  '<section class="c-bol c-sur" id="surec"><h2>Nasıl çalışırız</h2><ol>' + p.surec.map(function (s, i) { return "<li><h3><span>" + (i + 1) + ".</span> " + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></li>"; }).join("") + "</ol></section>" +
  fiyatB(C, "c-bol c-fiy") + randevuB(C, "c-bol c-ran") + modB(C, "c-bol c-mod") +
  '<section class="c-bol c-guv" id="guven"><h2>Söz verdiklerimiz</h2><ul>' + p.guven.map(function (s) { return "<li><h3>" + e(s[0]) + "</h3><p>" + e(s[1]) + "</p></li>"; }).join("") + yorumKart() + "</ul></section>" +
  '<section class="c-bol c-zi" id="iletisim"><h2>Ziyaret</h2><div>' + saatTablo(p, "c-t") + harita(C) + "</div></section>" +
  '<section class="c-bol c-sss" id="sss"><h2>Sık sorulanlar</h2><div>' + sssHTML(C) + '</div></section><section class="c-son"><p>' + e(p.sonBaslik || "Bir mesaj uzağınızdayız.") + '</p><div class="dgler"><button type="button" class="dg ana" data-act="ornek" data-t="wa">' + ik("sohbet", 16) + ' WhatsApp\'tan yazın</button><button type="button" class="dg" data-act="ornek" data-t="tel">' + ik("tel", 16) + " Arayın</button></div></section></main>" + altB(C) + altCubuk(C, "c-cub");
}

/* ---------- Çizim ve olaylar ---------- */
var C = null, tur = null, q = new URLSearchParams(location.search), yalnizMi = window.parent === window;
function ciz(o) {
  o = Object.assign({ ad: "", sek: "Oto servis", tarz: "vitrin", renk: "#1F3A5F" }, o || {});
  var ayni = C && C.sek === o.sek, n = ctx(o);
  if (ayni) { n.t = C.t; n.m = C.m; n.h = C.h; n.hv = C.hv; }
  C = n; turDur();
  var kk = document.documentElement; kk.style.setProperty("--r", o.renk); kk.dataset.tarz = o.tarz;
  document.title = C.ad + " · canlı taslak";
  Kok.className = "s-" + o.tarz;
  Kok.innerHTML = (o.tarz === "modern" ? modern : o.tarz === "klasik" ? klasik : vitrin)(C) + '<div class="tost" id="tost" role="status" hidden></div>' + (yalnizMi ? tamUst(C) : "");
  scrollTo(0, 0);
  if (yalnizMi) { try { var u = new URL(location.href); u.searchParams.set("sek", o.sek); u.searchParams.set("tarz", o.tarz); u.searchParams.set("renk", o.renk); if (o.ad) u.searchParams.set("ad", o.ad); else u.searchParams.delete("ad"); history.replaceState(null, "", u); } catch (x) {} }
}
function tamUst(C) { var wa = "https://wa.me/905019452184?text=" + encodeURIComponent("Merhaba, " + C.ad + " (" + C.sek + ") için " + C.tarz + " taslağının gerçeğini istiyorum."); return '<div class="tam-ust"><span>Dijitabela canlı taslak</span><a href="' + wa + '" target="_blank" rel="noopener">Bu taslağın gerçeğini isteyin</a></div>'; }
function bol(id) { var el = document.getElementById(id); if (!el) return; turDur(); var y = id === "ust" ? 0 : el.getBoundingClientRect().top + scrollY - 76; scrollTo({ top: y, behavior: AZ ? "auto" : "smooth" }); }
function tost(t) { var x = document.getElementById("tost"); if (!x) return; x.textContent = t; x.hidden = false; clearTimeout(tost.z); tost.z = setTimeout(function () { x.hidden = true; }, 4200); }
function yenile(id, f) { var el = document.getElementById(id); if (el) { var y = scrollY; el.innerHTML = f(C); scrollTo(0, y); } }
function talepYenile() { var t = document.getElementById("talep"); if (t) t.querySelectorAll("[data-alan]").forEach(function (i) { C.t[i.dataset.alan] = i.value; }); yenile("talep", talepHTML); }
Kok.addEventListener("click", function (ev) {
  var g = ev.target.closest("[data-git]"); if (g) { ev.preventDefault(); bol(g.dataset.git); return; }
  var b = ev.target.closest("[data-act]"); if (!b || b.tagName === "SELECT" || b.tagName === "INPUT") return;
  var a = b.dataset.act, d = b.dataset;
  if (a === "hsec") { var i = +d.g, j = +d.j, G = C.hv.gruplar[i]; if (G.tip === "coklu") { if (C.h[i][j] != null) delete C.h[i][j]; else { var bm = G.sec[j][2]; C.h[i][j] = bm ? (VAR[bm] || [1, 1])[0] : 1; } } else C.h[i] = j; yenile("hesap", hesapHTML); }
  else if (a === "hadet") { var bm2 = C.hv.gruplar[+d.g].sec[+d.j][2], ad = (VAR[bm2] || [1, 1])[1]; C.h[+d.g][+d.j] = Math.max(ad, C.h[+d.g][+d.j] + (+d.y) * ad); yenile("hesap", hesapHTML); }
  else if (a === "hgit") { var r = hesapla(C); C.t.hOzet = r.sat.map(function (x) { return x[0]; }).join(", ") + (C.hv.teklif ? "" : " · tahmini " + TL(r.top)); C.t.bitti = false; talepYenile(); bol("randevu"); tost("Seçiminiz talebe eklendi."); }
  else if (a === "tgun") { C.t.g = +d.i; C.t.s = ""; talepYenile(); }
  else if (a === "tslot") { C.t.s = d.s; talepYenile(); }
  else if (a === "tkisi") { C.t.k = Math.max(1, Math.min(C.p.talep.kisiMax || 20, C.t.k + +d.y)); talepYenile(); }
  else if (a === "tgece") { C.t.n = Math.max(1, Math.min(30, C.t.n + +d.y)); talepYenile(); }
  else if (a === "tgonder") { talepYenile(); C.t.bitti = true; talepYenile(); }
  else if (a === "tyeni") { C.t.bitti = false; C.t.s = ""; talepYenile(); }
  else if (a === "ornek") tost(d.t === "tel" ? "Taslakta numara yok. Gerçek sitede bu düğme sizin numaranızı arar." : "Taslakta mesaj gitmez. Gerçek sitede bu düğme sizin WhatsApp hattınızı açar.");
  else if (a === "kay") { var s = document.getElementById("serit"); if (s) s.scrollBy({ left: +d.y * s.clientWidth * .7, behavior: AZ ? "auto" : "smooth" }); }
  else if (a === "mileri") { C.m.a = Math.min(C.p.imza.adim.length - 1, (C.m.a == null ? 2 : C.m.a) + 1); yenile("mod", modHTML); }
  else if (a === "msifir") { C.m.a = 2; yenile("mod", modHTML); }
  else if (a === "mf") { C.m.f = d.v; yenile("mod", modHTML); }
  else if (a === "mi") { C.m.i = +d.v; yenile("mod", modHTML); }
  else if (a === "ms") { C.m.s = C.m.s || {}; C.m.s[d.v] = !C.m.s[d.v]; yenile("mod", modHTML); }
  else if (a === "mgit") { C.t.ek = d.v; C.t.bitti = false; talepYenile(); bol("randevu"); tost("Seçiminiz talebe eklendi."); }
});
Kok.addEventListener("change", function (ev) { var t = ev.target; if (t.dataset.act === "thiz") C.t.h = +t.value; });
Kok.addEventListener("input", function (ev) {
  var t = ev.target, a = t.dataset.act;
  if (a === "mm" || a === "may") { if (a === "mm") C.m.m = +t.value; else C.m.ay = +t.value; yenile("mod", modHTML); var n = document.querySelector('#mod input[data-act="' + a + '"]'); if (n) n.focus({ preventScroll: true }); }
  else if (t.dataset.alan) C.t[t.dataset.alan] = t.value;
});
Kok.addEventListener("error", function (ev) { if (ev.target.tagName === "IMG") ev.target.classList.add("yok"); }, true);

/* Taslağı gez: yavaşça aşağı kayar, dokunulunca durur */
function turDur() { if (tur) { cancelAnimationFrame(tur); tur = null; } }
function gez() { turDur(); if (AZ) return; var bas = performance.now(), son = Math.max(0, document.documentElement.scrollHeight - innerHeight), sure = Math.min(42000, son * 3.2 + 5000); scrollTo(0, 0); function ad(t) { var p = Math.min(1, (t - bas - 900) / sure); if (p < 0) { tur = requestAnimationFrame(ad); return; } scrollTo(0, son * (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)); tur = p < 1 ? requestAnimationFrame(ad) : null; } tur = requestAnimationFrame(ad); }
["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (x) { addEventListener(x, turDur, { passive: true }); });

if (yalnizMi) document.documentElement.classList.add("tam");
window.DTaslak = { ciz: ciz, gez: gez, dur: turDur, bilgi: function () { return C; } };
ciz({ ad: q.get("ad") || "", sek: q.get("sek") || "Oto servis", tarz: q.get("tarz") || "vitrin", renk: q.get("renk") || "#1F3A5F" });
try { if (!yalnizMi && window.parent.taslakHazir) window.parent.taslakHazir(); } catch (x) {}
})();
