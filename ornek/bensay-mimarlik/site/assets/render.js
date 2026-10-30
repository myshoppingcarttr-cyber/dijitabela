/* bensay Mimarlık · evrensel sayfa çizici (30 Eki 2026)
   Aynı kod hem Node'da (önceden üretim: MUSTERILER/bensay/onuret.js) hem tarayıcıda (yönetim panelinden gelen içerikle yeniden çizim) çalışır.
   Girdi: icerik (veri/icerik.json ya da Supabase site_icerik.veri). Çıktı: sayfa parçaları ya da tam HTML belgesi. */
(function (kok) {
"use strict";
var SAYFALAR = {
  index: { dosya: "index.html", ad: "Anasayfa" }, kurumsal: { dosya: "kurumsal.html", ad: "Kurumsal" },
  hizmetler: { dosya: "hizmetler.html", ad: "Hizmetler" }, projeler: { dosya: "projelerimiz.html", ad: "Projeler" },
  proje: { dosya: "proje.html", ad: "Proje detay" }, maliyet: { dosya: "maliyet.html", ad: "Maliyet hesaplayıcı" },
  blog: { dosya: "blog.html", ad: "Blog" }, yazi: { dosya: "yazi.html", ad: "Blog yazısı" },
  iletisim: { dosya: "iletisim.html", ad: "İletişim" }, araclar: { dosya: "araclar.html", ad: "Araçlar" }, takip: { dosya: "takip.html", ad: "Proje takip" }
};
var BOLUM_TIPLERI = {
  kahraman: "Kahraman (açılış)", sayfaBasi: "Sayfa başlığı", anaHizmet: "Öne çıkan hizmet", hizmetler: "Hizmet kartları",
  sektorler: "Sektörler", projeler: "Proje kartları", maliyet: "Maliyet hesaplayıcı", markalar: "Kalite karşılaştırma (markalar)",
  surec: "Süreç adımları", sss: "Sık sorulan sorular", ekip: "Ekip", blog: "Blog yazıları", metin: "Metin + görsel",
  referanslar: "Referanslar (logo şeridi)", cta: "Çağrı bandı", iletisim: "İletişim bilgileri", kesifForm: "Keşif formu", projeDetay: "Proje detayı (sabit)",
  blogDetay: "Yazı detayı (sabit)", araclar: "Araçlar (sabit)", takip: "Proje takip (sabit)"
};

function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function tr(o) { return o == null ? "" : typeof o === "string" ? o : (o.tr || ""); }
function en(o) { return o == null ? "" : typeof o === "string" ? o : (o.en || o.tr || ""); }
function bos(o) { return !tr(o) && !(o && o.en); }
function T(o) { var a = tr(o), b = en(o); if (a === b) return esc(a); return '<span data-l="tr">' + esc(a) + '</span><span data-l="en" lang="en">' + esc(b) + "</span>"; }
function T2(a, b) { return T({ tr: a, en: b }); }
function bek() { return '<span class="bekliyor">' + T2("eklenecek", "to be added") + "</span>"; }
/* uzun metin: boş satır = paragraf, "## " = ara başlık, "- " = madde */
function paragraf(s) {
  var out = [], liste = [];
  function kapa() { if (liste.length) { out.push("<ul>" + liste.join("") + "</ul>"); liste = []; } }
  String(s || "").split(/\n\s*\n/).forEach(function (blok) {
    blok.split("\n").forEach(function (sat) {
      var t = sat.trim(); if (!t) return;
      if (/^- /.test(t)) { liste.push("<li>" + esc(t.slice(2)) + "</li>"); return; }
      kapa();
      if (/^## /.test(t)) out.push("<h2>" + esc(t.slice(3)) + "</h2>"); else out.push("<p>" + esc(t) + "</p>");
    });
    kapa();
  });
  return out.join("");
}
function P(o) { var a = tr(o), b = en(o); if (a === b) return paragraf(a); return '<div data-l="tr">' + paragraf(a) + '</div><div data-l="en" lang="en">' + paragraf(b) + "</div>"; }
function url(u) { u = String(u || "").trim(); return /^(javascript|data):/i.test(u) ? "#" : u; }

/* renkler */
function hex(h) { h = String(h || "").replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); var n = parseInt(h, 16); return isNaN(n) ? null : [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function karart(h, k) { var c = hex(h); if (!c) return h; return "#" + c.map(function (x) { return ("0" + Math.round(x * (1 - k)).toString(16)).slice(-2); }).join(""); }
function guvenliRenk(h, yedek) { return /^#[0-9a-fA-F]{3,6}$/.test(h || "") ? h : yedek; }
function renkCSS(ic) {
  var r = (ic.marka && ic.marka.renkler) || {};
  var y = guvenliRenk(r.yesil, "#253925"), b = guvenliRenk(r.bej, "#C2B59B"), z = guvenliRenk(r.zemin, "#F4F2EE"), t = guvenliRenk(r.yazi, "#161816");
  return ":root{--yesil:" + y + ";--yesil2:" + karart(y, .3) + ";--bej:" + b + ";--bej2:" + karart(b, .42) + ";--zemin:" + z + ";--yazi:" + t + "}";
}

function sayfaDosya(id) { return (SAYFALAR[id] || {}).dosya || "index.html"; }
function dugme(ic, ad, sinif) {
  var d = (ic.dugmeler || {})[ad]; if (!d || bos(d.etiket)) return "";
  return '<a class="dg' + (sinif ? " " + sinif : "") + '" href="' + esc(url(d.hedef)) + '">' + T(d.etiket) + "</a>";
}
function logo(ic, sinif) {
  var m = ic.marka || {}, src = url(m.logo || "assets/bensay-kelime.png");
  if (m.logoMaske !== false) return '<span class="mark' + (sinif ? " " + sinif : "") + '" role="img" aria-label="' + esc(m.ad || "") + '" style="-webkit-mask-image:url(\'' + esc(src) + '\');mask-image:url(\'' + esc(src) + '\')"></span>';
  return '<img class="mark-img' + (sinif ? " " + sinif : "") + '" src="' + esc(src) + '" alt="' + esc(m.ad || "") + '">';
}
function waLink(ic) { return String((ic.iletisim || {}).wa || "").replace(/\D/g, ""); }

/* ---------- üst / alt ---------- */
function ust(ic, sayfa) {
  var dosya = sayfaDosya(sayfa), m = ic.marka || {};
  var alt = (m.altSatirlar || []).filter(function (x) { return !bos(x); }).map(function (x) { return "<span>" + T(x) + "</span>"; }).join("");
  var nav = (ic.menu || []).filter(function (x) { return x.gorunur !== false && !bos(x.ad); }).map(function (x) {
    var h = String(x.hedef || ""), akt = h.split("#")[0] === dosya && h.indexOf("#") < 0;
    return '<a href="' + esc(url(h)) + '"' + (akt ? ' aria-current="page"' : "") + ">" + T(x.ad) + "</a>";
  }).join("");
  var serit = (ic.site && ic.site.yayinda) ? "" : '<div class="onizleme" role="note">' + T2("Önizleme — yayın öncesi", "Preview — pre-launch") + "</div>";
  return serit + '<header class="ust"><div class="kap">' +
    '<a class="logo" href="index.html" aria-label="' + esc(m.unvan || m.ad || "") + '">' + logo(ic) + (alt ? '<span class="logo-alt">' + alt + "</span>" : "") + "</a>" +
    '<nav class="menu" id="menu" aria-label="Ana menü">' + nav + dugme(ic, "kesif") + "</nav>" +
    ((ic.site || {}).dil2 !== false ? '<button class="dil" id="dil" type="button" aria-label="Switch to English">EN</button>' : "") +
    '<button class="ac-kapa" id="menuDg" type="button" aria-controls="menu" aria-expanded="false" aria-label="Menü" data-al-en="Menu">☰</button>' +
    "</div></header>";
}
function alt(ic) {
  var m = ic.marka || {}, il = ic.iletisim || {};
  var tel = il.tel ? '<a href="tel:' + esc(il.tel.replace(/\s/g, "")) + '">' + esc(il.tel) + "</a>" : bek();
  var sos = [il.instagram ? '<li><a href="' + esc(url(il.instagram)) + '" target="_blank" rel="noopener">Instagram</a></li>' : "",
             il.linkedin ? '<li><a href="' + esc(url(il.linkedin)) + '" target="_blank" rel="noopener">LinkedIn</a></li>' : ""].join("");
  var sayfalar = (ic.menu || []).filter(function (x) { return x.gorunur !== false && !bos(x.ad); }).slice(1).map(function (x) { return '<li><a href="' + esc(url(x.hedef)) + '">' + T(x.ad) + "</a></li>"; }).join("") +
    '<li><a href="araclar.html">' + T2("Araçlar", "Tools") + '</a></li><li><a href="takip.html">' + T2("Proje takip", "Client portal") + "</a></li>";
  return '<footer><div class="kap"><div class="ust-alt">' +
    "<div>" + logo(ic) + '<p style="margin-top:12px;max-width:360px">' + T(m.altMetin) + "</p></div>" +
    "<div><b>" + T2("Sayfalar", "Pages") + '</b><ul style="margin-top:8px">' + sayfalar + "</ul></div>" +
    "<div><b>" + T2("İletişim", "Contact") + '</b><ul style="margin-top:8px"><li>' + T2("Telefon", "Phone") + ": " + tel + "</li>" +
    (il.eposta ? '<li><a href="mailto:' + esc(il.eposta) + '">' + esc(il.eposta) + "</a></li>" : "") + "<li>" + esc(il.sehir || "Ankara") + "</li>" + sos + "</ul></div>" +
    '</div><div class="son"><span>© ' + new Date().getFullYear() + " " + esc(m.unvan || m.ad || "") + "</span><span>" + T2("tasarım", "design") + ': <a href="https://dijitabela.com" target="_blank" rel="noopener">Dijitabela</a></span></div></div></footer>' +
    '<div class="yuzen"><a href="#" data-wa="Merhaba, web sitenizden yazıyorum." data-wa-en="Hello, I\'m writing from your website." aria-label="WhatsApp ile yazın" data-al-en="Message us on WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg></a></div>';
}

/* ---------- bölümler ---------- */
var EV_SVG = '<svg class="cizgi-ev" viewBox="0 0 400 300" aria-hidden="true"><path d="M10 290h380M40 290V150L200 40l160 110v140M120 290V200h60v90M240 170h70v50h-70zM200 40V10M90 120h220"/><path d="M40 150h320" stroke-dasharray="4 6"/></svg>';
var KUCUK_EV = '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M8 82h104M18 82V40l42-30 42 30v42M42 82V56h20v26M74 48h16v14H74z"/><path d="M60 10v-6"/></svg>';
function yakinda(tr_, en_) { return '<div class="yakinda">' + KUCUK_EV + "<span>" + T2(tr_ || "Görsel yakında", en_ || "Image coming soon") + "</span></div>"; }
function bas(b) {
  return (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + (bos(b.baslik) ? "" : "<h2>" + T(b.baslik) + "</h2>") +
    (bos(b.metin) ? "" : '<p class="acik">' + T(b.metin) + "</p>");
}
function no(i) { return (i < 9 ? "0" : "") + (i + 1); }
function katAd(ic, id) { var k = (ic.projeKategorileri || []).filter(function (x) { return x.id === id; })[0]; return k ? k.ad : null; }
function projeKart(ic, p, i) {
  var g = (p.gorseller || [])[0], ad = bos(p.ad) ? { tr: "Proje " + no(i), en: "Project " + no(i) } : p.ad, k = katAd(ic, p.kategori);
  var alt_ = [k ? T(k) : "", esc(p.konum || ""), esc(p.yil || "")].filter(Boolean).join(" · ") || T2("Bilgiler hazırlanıyor", "Details in preparation");
  return '<a class="pk" href="proje.html?p=' + esc(p.id) + '" data-kat="' + esc(p.kategori || "") + '"><div class="g">' +
    (g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(ad)) + '" loading="lazy" width="800" height="600">' : yakinda("Proje görseli yakında", "Project image coming soon")) +
    '</div><div class="m"><b>' + T(ad) + "</b><small>" + alt_ + "</small></div></a>";
}
function hizmetKart(h, i) {
  return '<article class="kart' + (h.oneCikan ? " one" : "") + '">' + (h.gorsel ? '<img class="kg" src="' + esc(url(h.gorsel)) + '" alt="' + esc(tr(h.baslik)) + '" loading="lazy">' : "") +
    '<div class="no">' + no(i) + (h.oneCikan ? ' · ' + T2("Ana hizmet", "Core service") : "") + "</div><h3>" + T(h.baslik) + '</h3><p class="acik" style="font-size:.97rem">' + T(h.ozet) + "</p>" +
    ((h.maddeler || []).length ? "<ul>" + h.maddeler.map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ul>" : "") + "</article>";
}
function blogKart(y) {
  return '<a class="pk yk" href="yazi.html?y=' + esc(y.id) + '"><div class="g">' + (y.gorsel ? '<img src="' + esc(url(y.gorsel)) + '" alt="' + esc(tr(y.baslik)) + '" loading="lazy">' : yakinda()) +
    '</div><div class="m">' + (y.tarih ? "<small>" + esc(y.tarih) + "</small>" : "") + "<b>" + T(y.baslik) + "</b>" + (bos(y.ozet) ? "" : "<small>" + T(y.ozet) + "</small>") + "</div></a>";
}
function markaHucre(mk) {
  mk = mk || {};
  var ic = mk.logo ? '<img src="' + esc(url(mk.logo)) + '" alt="' + esc(mk.ad || "Marka") + '" loading="lazy">' + (mk.ad ? "<b>" + esc(mk.ad) + "</b>" : "") : mk.ad ? "<b>" + esc(mk.ad) + "</b>" : bek();
  return '<td><small class="mk-et">' + T2("Marka", "Brand") + '</small><span class="mk">' + ic + "</span></td>";
}
function tl(n) { return Math.round(Number(n) || 0).toLocaleString("tr-TR"); }

var BOLUM = {
  kahraman: function (ic, b) {
    return '<section class="kah' + (b.gorsel ? " gorselli" : "") + '" id="' + esc(b.id) + '">' + (b.gorsel ? '<img class="kah-g" src="' + esc(url(b.gorsel)) + '" alt="" fetchpriority="high">' : "") +
      '<div class="kap">' + (b.gorsel ? "" : EV_SVG) + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + "<h1>" + T(b.baslik) + "</h1>" + (bos(b.metin) ? "" : "<p>" + T(b.metin) + "</p>") +
      '<div class="dgs">' + dugme(ic, "kesif") + dugme(ic, "planla", "i") + "</div></div></section>";
  },
  sayfaBasi: function (ic, b) {
    return '<section class="sayfa-bas" id="' + esc(b.id) + '"><div class="kap">' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + "<h1>" + T(b.baslik) + "</h1>" + (bos(b.metin) ? "" : '<p class="acik">' + T(b.metin) + "</p>") + "</div></section>";
  },
  anaHizmet: function (ic, b) {
    var h = (ic.hizmetler || []).filter(function (x) { return x.id === b.hizmet; })[0] || (ic.hizmetler || []).filter(function (x) { return x.oneCikan; })[0];
    if (!h) return "";
    var g = b.gorsel || h.gorsel;
    return '<section class="bol ana-h" id="' + esc(b.id) + '"><div class="kap ah"><div>' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") +
      "<h2>" + T(h.baslik) + '</h2><p class="acik">' + T(h.ozet) + "</p>" + ((h.maddeler || []).length ? '<ol class="ah-l">' + h.maddeler.map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ol>" : "") +
      '<div class="dgs">' + dugme(ic, "planla") + dugme(ic, "kesif", "i") + "</div></div>" +
      '<div class="ah-g">' + (g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(h.baslik)) + '" loading="lazy">' : yakinda("Tadilat görseli yakında", "Renovation image coming soon")) + "</div></div></section>";
  },
  hizmetler: function (ic, b) {
    var L = (ic.hizmetler || []).slice();
    if (b.sadeceDiger) L = L.filter(function (h) { return !h.oneCikan; });
    else L.sort(function (a, c) { return (c.oneCikan ? 1 : 0) - (a.oneCikan ? 1 : 0); });
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="hz' + (L.length === 3 ? " uc3" : "") + '">' + L.map(hizmetKart).join("") + "</div></div></section>";
  },
  sektorler: function (ic, b) {
    return '<section class="bol sek" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (ic.sektorler || []).map(function (g) {
      return '<div class="sek-g"><h3>' + T(g.ad) + '</h3><ul class="cipler">' + (g.liste || []).map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div></section>";
  },
  projeler: function (ic, b) {
    var P = ic.projeler || [], lim = Number(b.limit) || P.length;
    var fl = b.filtre ? '<div class="filtre" id="filtre" role="group" aria-label="Kategori"><button type="button" data-f="hepsi" aria-pressed="true">' + T2("Tümü", "All") + "</button>" +
      (ic.projeKategorileri || []).map(function (k) { return '<button type="button" data-f="' + esc(k.id) + '" aria-pressed="false">' + T(k.ad) + "</button>"; }).join("") + "</div>" : "";
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + fl + '<div class="izg" id="projeIzg">' + P.slice(0, lim).map(function (p, i) { return projeKart(ic, p, i); }).join("") + "</div>" +
      '<p class="acik bos-not" id="filtreBos" hidden>' + T2("Bu kategoride henüz proje yok.", "No projects in this category yet.") + "</p>" +
      (lim < P.length || (b.limit && sayfaVar(ic, "projeler")) ? '<div class="dgs"><a class="dg i" href="projelerimiz.html">' + T2("Tüm projeler", "All projects") + " →</a></div>" : "") + "</div></section>";
  },
  maliyet: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="mh" id="maliyetHesap" data-bolum="' + esc(b.id) + '"><noscript><p class="acik">' + T2("Hesaplayıcı için JavaScript gerekir.", "The estimator requires JavaScript.") + "</p></noscript></div>" +
      '<p class="not mh-not"><b>' + T2("Yaklaşık / ön teklif:", "Approximate / preliminary quote:") + "</b> " + T((ic.maliyet || {}).not) + "</p></div></section>";
  },
  markalar: function (ic, b) {
    var M = ic.maliyet || {}, K = M.kaliteler || [];
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="kk-tablo"><table><thead><tr><th scope="col">' + T2("Malzeme", "Material") + "</th>" +
      K.map(function (k) { return '<th scope="col"><button type="button" class="kk-sec" data-kalite="' + esc(k.id) + '"><b>' + T(k.ad) + "</b><small>" + T(k.aciklama) + "</small></button></th>"; }).join("") + "</tr></thead><tbody>" +
      (M.malzemeler || []).map(function (m) { return '<tr><th scope="row">' + T(m.ad) + "</th>" + K.map(function (k) { return markaHucre((m.markalar || {})[k.id]); }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></div></section>";
  },
  surec: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="surec">' + (ic.surec || []).map(function (s) { return "<div><b>" + T(s.ad) + "</b><p>" + T(s.metin) + "</p></div>"; }).join("") + "</div></div></section>";
  },
  sss: function (ic, b) {
    return '<section class="bol sss" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (ic.sss || []).map(function (s) { return "<details><summary>" + T(s.soru) + "</summary>" + P(s.cevap) + "</details>"; }).join("") + "</div></section>";
  },
  ekip: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="ekip">' + (ic.ekip || []).map(function (k) {
      var bas_ = (k.ad || "").split(/\s+/).map(function (x) { return x.charAt(0); }).join("").slice(0, 2);
      return '<article class="kart" style="padding:0">' + (k.foto ? '<img class="foto" src="' + esc(url(k.foto)) + '" alt="' + esc(k.ad) + '" loading="lazy">' : '<div class="foto" aria-hidden="true">' + esc(bas_ || "+") + "</div>") +
        '<div style="padding:18px"><b>' + (k.ad ? esc(k.ad) : T2("Ekip üyesi", "Team member")) + "</b><br><small>" + (bos(k.unvan) ? bek() : T(k.unvan)) + "</small></div></article>";
    }).join("") + "</div></div></section>";
  },
  blog: function (ic, b) {
    var Y = (ic.blog || []).filter(function (y) { return y.yayinda; }), lim = Number(b.limit) || Y.length;
    if (!Y.length && Number(b.limit)) return "";  /* özet bölümü: yayında yazı yoksa gizli */
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (Y.length ? '<div class="izg">' + Y.slice(0, lim).map(blogKart).join("") + "</div>" +
      (b.limit && Y.length > lim ? '<div class="dgs"><a class="dg i" href="blog.html">' + T2("Tüm yazılar", "All articles") + " →</a></div>" : "") :
      '<div class="bos-kutu">' + T2("Yazılarımız hazırlanıyor; çok yakında burada.", "Our articles are being prepared and will appear here soon.") + "</div>") + "</div></section>";
  },
  metin: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap ' + (b.gorsel ? "ah" : "iki") + '"><div>' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + (bos(b.baslik) ? "" : "<h2>" + T(b.baslik) + "</h2>") + "</div>" +
      '<div><div class="acik metin">' + P(b.metin) + "</div>" + (b.dugme ? '<div class="dgs">' + dugme(ic, b.dugme) + "</div>" : "") + "</div>" +
      (b.gorsel ? '<div class="ah-g"><img src="' + esc(url(b.gorsel)) + '" alt="" loading="lazy"></div>' : "") + "</div></section>";
  },
  referanslar: function (ic, b) {
    var L = (ic.referanslar || []).filter(function (r) { return r && r.logo; });
    if (!L.length) return "";  /* logo yoksa bölüm hiç görünmez (yer tutucu yok) */
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="ref-serit">' + L.map(function (r) {
      var img = '<img src="' + esc(url(r.logo)) + '" alt="' + esc(r.ad || "Referans") + '" loading="lazy">';
      return r.link ? '<a href="' + esc(url(r.link)) + '" target="_blank" rel="noopener" title="' + esc(r.ad || "") + '">' + img + "</a>" : '<div title="' + esc(r.ad || "") + '">' + img + "</div>";
    }).join("") + "</div></div></section>";
  },
  cta: function (ic, b) {
    return '<section class="cta" id="' + esc(b.id) + '"><div class="kap"><h2>' + T(b.baslik) + "</h2>" + (bos(b.metin) ? "" : '<p style="max-width:560px;color:rgba(239,233,220,.85)">' + T(b.metin) + "</p>") +
      '<div class="dgs">' + dugme(ic, "kesif") + dugme(ic, "planla", "i") + "</div></div></section>";
  },
  iletisim: function (ic, b) {
    var il = ic.iletisim || {};
    function s(a, c, v) { return "<li><span>" + T2(a, c) + "</span><span>" + (v || bek()) + "</span></li>"; }
    var sos = [il.instagram ? '<a href="' + esc(url(il.instagram)) + '" target="_blank" rel="noopener">Instagram</a>' : "", il.linkedin ? '<a href="' + esc(url(il.linkedin)) + '" target="_blank" rel="noopener">LinkedIn</a>' : ""].filter(Boolean).join(" · ");
    var harita = /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(il.harita || "") ? '<iframe class="harita" src="' + esc(il.harita) + '" loading="lazy" title="Harita" referrerpolicy="no-referrer-when-downgrade"></iframe>'
      : '<div class="harita">' + T2("Ofis adresi gelince harita burada yer alacak.", "A map will appear here once the office address is added.") + "</div>";
    return '<section class="bol ilk" id="' + esc(b.id) + '"><div class="kap iki"><div>' + bas(b) + '<ul class="bilgi">' + s("Adres", "Address", esc(il.adres)) + s("Şehir", "City", esc(il.sehir || "Ankara")) +
      s("Telefon", "Phone", il.tel ? '<a href="tel:' + esc(il.tel.replace(/\s/g, "")) + '">' + esc(il.tel) + "</a>" : "") + s("WhatsApp", "WhatsApp", esc(il.wa)) +
      s("E-posta", "Email", il.eposta ? '<a href="mailto:' + esc(il.eposta) + '">' + esc(il.eposta) + "</a>" : "") + s("Çalışma saatleri", "Opening hours", bos(il.saatler) ? "" : T(il.saatler)) +
      s("Sosyal medya", "Social media", sos) + '</ul><div class="dgs">' + dugme(ic, "kesif") + '<a class="dg i" href="#" data-wa="Merhaba, web sitenizden yazıyorum." data-wa-en="Hello, I\'m writing from your website.">WhatsApp</a></div></div>' + harita + "</div></section>";
  },
  kesifForm: function (ic, b) {
    var il = ic.iletisim || {};
    var turler = (ic.maliyet && ic.maliyet.tipler || []).map(function (t) { return "<option>" + esc(tr(t.ad)) + (en(t.ad) !== tr(t.ad) ? " / " + esc(en(t.ad)) : "") + "</option>"; }).join("");
    var hizm = (ic.hizmetler || []).map(function (h) { return "<option>" + esc(tr(h.baslik)) + "</option>"; }).join("");
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="arac"><form class="form" id="randevuForm" novalidate>' +
      '<label for="rAd">' + T2("Ad soyad", "Full name") + '</label><input id="rAd" autocomplete="name" required>' +
      '<label for="rTel">' + T2("Telefonunuz", "Your phone") + '</label><input id="rTel" type="tel" autocomplete="tel" inputmode="tel">' +
      '<label for="rKonu">' + T2("Alan tipi", "Space type") + '</label><select id="rKonu">' + turler + "</select>" +
      '<label for="rHiz">' + T2("Hizmet", "Service") + '</label><select id="rHiz">' + hizm + "</select>" +
      '<label for="rKonum">' + T2("Konum (ilçe)", "Location (district)") + '</label><input id="rKonum" placeholder="Çankaya, Ankara" data-ph-en="e.g. Çankaya, Ankara">' +
      '<label for="rGun">' + T2("Tercih ettiğiniz gün", "Preferred day") + '</label><input id="rGun" type="date">' +
      '<label for="rNot">' + T2("Kısa not (isteğe bağlı)", "Short note (optional)") + '</label><textarea id="rNot"></textarea>' +
      '<div class="dgs"><a class="dg wa" id="rGonder" href="#" target="_blank" rel="noopener">' + T2("WhatsApp'tan gönder", "Send on WhatsApp") + "</a>" +
      (il.tel ? '<a class="dg i" href="tel:' + esc(il.tel.replace(/\s/g, "")) + '">' + T2("Ara", "Call") + "</a>" : "") + "</div>" +
      '<p class="not">' + T2("Bilgileriniz yalnızca size dönüş yapmak için kullanılır.", "Your details are used only to get back to you.") + "</p></form>" +
      '<div class="panelk"><div class="etiket">' + T2("Gönderilecek mesaj", "Message preview") + '</div><div class="mesaj" id="rMesaj" aria-live="polite"></div></div></div></div></section>';
  },
  projeDetay: function (ic, b, ctx) {
    var P = ic.projeler || [], id = ctx && ctx.p, i = Math.max(0, P.map(function (x) { return x.id; }).indexOf(id)), p = P[i] || {};
    var ad = bos(p.ad) ? { tr: "Proje " + no(i), en: "Project " + no(i) } : p.ad, k = katAd(ic, p.kategori);
    var G = (p.gorseller || []).length ? p.gorseller : [0, 0, 0], o = P[(i - 1 + P.length) % P.length] || {}, s = P[(i + 1) % P.length] || {};
    return '<section class="sayfa-bas" id="projeDetay"><div class="kap"><a href="projelerimiz.html" style="font-size:.9rem;color:var(--soluk)">← ' + T2("Projeler", "Projects") + "</a>" +
      '<div class="dt-ust" style="margin-top:18px"><div><div class="etiket">' + (k ? T(k) : T2("Proje", "Project")) + "</div><h1>" + T(ad) + '</h1><div class="acik" style="margin-top:14px">' +
      (bos(p.ozet) ? "<p>" + T2("Bu projenin açıklaması, görselleri ve künyesi ofisimizden gelince burada yer alacak.", "The description, images and credits will appear here once provided.") + "</p>" : P(p.ozet)) + "</div></div>" +
      '<div class="kunye"><div><small>' + T2("Kategori", "Category") + "</small><span>" + (k ? T(k) : bek()) + "</span></div><div><small>" + T2("Konum", "Location") + "</small><span>" + (p.konum ? esc(p.konum) : bek()) +
      "</span></div><div><small>" + T2("Yıl", "Year") + "</small><span>" + (p.yil ? esc(p.yil) : bek()) + "</span></div><div><small>" + T2("Alan", "Area") + "</small><span>" + (p.alan ? esc(p.alan) : bek()) + "</span></div></div></div>" +
      '<div class="galeri">' + G.map(function (g) { return g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(ad)) + '" loading="lazy">' : yakinda("Proje görseli yakında", "Project image coming soon"); }).join("") + "</div>" +
      '<div class="gezin"><a class="dg i" href="proje.html?p=' + esc(o.id || "") + '">← ' + T2("Önceki proje", "Previous project") + '</a><a class="dg i" href="proje.html?p=' + esc(s.id || "") + '">' + T2("Sonraki proje", "Next project") + " →</a></div></div></section>";
  },
  blogDetay: function (ic, b, ctx) {
    var Y = (ic.blog || []).filter(function (y) { return y.yayinda || (ctx && ctx.onizleme); }), y = Y.filter(function (x) { return x.id === (ctx && ctx.y); })[0] || Y[0];
    if (!y) return '<section class="sayfa-bas"><div class="kap"><h1>' + T2("Yazı bulunamadı", "Article not found") + '</h1><p class="acik"><a href="blog.html">' + T2("Bloga dön", "Back to blog") + "</a></p></div></section>";
    return '<article class="sayfa-bas yazi"><div class="kap dar"><a href="blog.html" style="font-size:.9rem;color:var(--soluk)">← Blog</a>' + (y.tarih ? '<div class="etiket" style="margin-top:18px">' + esc(y.tarih) + "</div>" : "") +
      "<h1>" + T(y.baslik) + "</h1>" + (bos(y.ozet) ? "" : '<p class="acik" style="margin-top:14px">' + T(y.ozet) + "</p>") +
      (y.gorsel ? '<img class="yazi-g" src="' + esc(url(y.gorsel)) + '" alt="' + esc(tr(y.baslik)) + '">' : "") + '<div class="govde">' + (bos(y.govde) ? "<p>" + T2("Bu yazı hazırlanıyor.", "This article is being prepared.") + "</p>" : P(y.govde)) + "</div></div></article>";
  },
  takip: function () {
    return '<section class="bol ilk" style="padding-top:0"><div class="kap arac" style="margin-top:0"><div class="form"><label for="kod">' + T2("Proje kodu", "Project code") +
      '</label><input id="kod" placeholder="DEMO-2481" autocomplete="off"><button class="dg" id="kodBak" type="button" style="margin-top:14px">' + T2("Durumu göster", "Show status") +
      '</button></div><div class="panelk portal" id="portal" aria-live="polite"><p class="acik">' + T2("Kodunuzu girin.", "Enter your code.") + "</p></div></div></section>";
  },
  araclar: function () {
    function cb(v, a, c, x) { return '<label><input type="checkbox" value="' + v + '"' + (x ? " checked" : "") + ">" + T2(a, c) + "</label>"; }
    var BELGE = [["Tapu fotokopisi", "Copy of title deed"], ["İmar durumu belgesi", "Zoning status certificate"], ["Aplikasyon krokisi", "Plot application sketch"], ["Zemin etüdü raporu", "Geotechnical survey report"],
      ["Malik kimlik / vekâletname", "Owner ID / power of attorney"], ["Varsa eski ruhsat ve projeler", "Previous permits and drawings, if any"], ["Hisseli parselde muvafakatname", "Co-owner consent (shared plots)"], ["Yapı denetim sözleşmesi", "Building inspection contract"]];
    return '<div class="kap"><div class="arac-menu"><a href="#planlayici">' + T2("Süre planlayıcı", "Timeline planner") + '</a><a href="#once-sonra">' + T2("Önce / sonra", "Before / after") + '</a><a href="#ruhsat">' + T2("Ruhsat listesi", "Permit checklist") +
      '</a><a href="#stil">' + T2("Stil seçici", "Style picker") + '</a><a href="maliyet.html">' + T2("Maliyet hesaplayıcı", "Cost estimator") + "</a></div></div>" +
      '<section class="bol" id="planlayici" style="margin-top:40px"><div class="kap"><div class="etiket">01</div><h2>' + T2("Proje süre planlayıcı", "Project timeline planner") + '</h2><p class="acik">' + T2("Projenizin türünü ve büyüklüğünü seçin; tahmini takviminiz aşama aşama çıksın.", "Choose your project type and size to see an estimated, phase-by-phase timeline.") +
      '</p><div class="arac"><div class="form"><label for="tur">' + T2("Proje türü", "Project type") + '</label><select id="tur"><option value="konut">Konut / Apartment</option><option value="villa">Villa / Detached house</option><option value="ticari">Ofis, ticari / Office, commercial</option><option value="ic">İç mimari, tadilat / Interior, renovation</option><option value="rest">Restorasyon, cephe / Restoration, facade</option></select>' +
      '<label for="m2">' + T2("Yaklaşık alan (m²)", "Approx. area (m²)") + '</label><input id="m2" type="number" inputmode="numeric" value="250" min="30" step="10"><label for="kat">' + T2("Kat sayısı", "Number of floors") + '</label><input id="kat" type="number" inputmode="numeric" value="2" min="1" max="30">' +
      '<fieldset style="border:0"><legend style="font-weight:700;font-size:.9rem;margin:16px 0 8px">' + T2("İstediğiniz hizmetler", "Services required") + '</legend><div class="secim" id="hizmetler">' + cb("avan", "Konsept + avan proje", "Concept + schematic design", 1) + cb("uyg", "Uygulama projesi", "Construction drawings", 1) + cb("ruh", "Ruhsat takibi", "Permit follow-up", 1) + cb("ic", "İç mimari", "Interior design") + cb("den", "Uygulama denetimi", "Site supervision") + "</div></fieldset></div>" +
      '<div class="panelk" aria-live="polite"><div class="etiket">' + T2("Tahmini takvim", "Estimated timeline") + '</div><div class="top" id="top">—</div><div id="asamalar"></div><p class="not">' + T2("Tahminidir; arsa, belediye ve onay süreçlerine göre değişir.", "Estimate only; varies with the site and approval processes.") +
      '</p><a class="dg wa" id="planGonder" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + T2("Bu planı WhatsApp'tan gönder", "Send this plan on WhatsApp") + "</a></div></div></div></section>" +
      '<section class="bol" id="once-sonra"><div class="kap"><div class="etiket">02</div><h2>' + T2("Önce / sonra cephe", "Facade before / after") + '</h2><p class="acik">' + T2("Çizgiyi sürükleyin ya da kaydırıcıyı kullanın.", "Drag the line or use the slider.") +
      '</p><div class="os" id="os"><img src="img/once.jpg" alt="Yenileme öncesi cephe (örnek görsel)" width="1280" height="720" loading="lazy"><img class="sonra" src="img/sonra.jpg" alt="Yenileme sonrası cephe (örnek görsel)" width="1280" height="720" loading="lazy"><div class="cz"></div><span class="e e1">' + T2("ÖNCE", "BEFORE") + '</span><span class="e e2">' + T2("SONRA", "AFTER") + '</span><span class="ornek-et">' + T2("örnek görsel", "sample image") + "</span></div>" +
      '<input class="os-ar" id="osAr" type="range" min="0" max="100" value="50" aria-label="Önce / sonra karşılaştırma" data-al-en="Before / after comparison"></div></section>' +
      '<section class="bol" id="ruhsat"><div class="kap"><div class="etiket">03</div><h2>' + T2("Ruhsat belge kontrol listesi", "Building permit checklist") + '</h2><p class="acik">' + T2("Elinizde olanları işaretleyin; eksikleri tek tıkla bize sorun. Belediyeye göre farklılık gösterebilir.", "Tick what you already have and ask us about the rest.") +
      '</p><div class="arac"><ul class="liste" id="belgeler">' + BELGE.map(function (x) { return '<li><label><input type="checkbox">' + T2(x[0], x[1]) + "</label></li>"; }).join("") +
      '</ul><div class="panelk" aria-live="polite"><div class="etiket">' + T2("Hazırlık durumu", "Readiness") + '</div><div class="top" id="hazir">0 / 8</div><div class="ilerleme"><i id="hazirCubuk"></i></div><p class="acik" id="hazirNot"></p><a class="dg wa" id="belgeSor" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + T2("Eksiklerimi sor", "Ask about missing items") + "</a></div></div></div></section>" +
      '<section class="bol" id="stil"><div class="kap"><div class="etiket">04</div><h2>' + T2("İç mimari stil seçici", "Interior style picker") + '</h2><p class="acik">' + T2("Bir stil seçin; renk paleti ve önerilen malzemeler çıksın.", "Pick a style to see its colour palette and suggested materials.") +
      '</p><div class="arac"><div><div class="stiller" id="stiller" role="group" aria-label="Stil">' + [["Minimal", "Minimal"], ["Modern", "Modern"], ["Sıcak Doğal", "Warm Natural"], ["Klasik", "Classic"]].map(function (x) { return '<button type="button" aria-pressed="false">' + T2(x[0], x[1]) + "</button>"; }).join("") +
      '</div><div class="palet" id="palet"></div><p id="malzeme" class="acik"></p><a class="dg i" id="stilGonder" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + T2("Bu stili konuşalım", "Let's discuss this style") + "</a></div>" +
      '<figure style="position:relative"><img id="stilGorsel" src="img/stil0.jpg" alt="" width="1200" height="900" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover"><figcaption id="stilEtiket" class="ornek-et"></figcaption></figure></div></div></section>';
  }
};
function sayfaVar(ic, id) { return !!(ic.sayfalar && ic.sayfalar[id]); }

function ana(ic, sayfa, ctx) {
  var s = (ic.sayfalar || {})[sayfa] || { bolumler: [] };
  return (s.bolumler || []).filter(function (b) { return b && b.gorunur !== false && BOLUM[b.tip]; }).map(function (b) {
    try { return BOLUM[b.tip](ic, b, ctx || {}); } catch (e) { return "<!-- bölüm hatası: " + esc(b.tip) + " -->"; }
  }).join("\n");
}
function baslik(ic, sayfa) { var s = (ic.sayfalar || {})[sayfa] || {}; return s.baslik || { tr: (ic.marka || {}).unvan || "" }; }
function schema(ic) {
  var il = ic.iletisim || {}, m = ic.marka || {}, alan = (ic.site || {}).alan || "";
  var d = { "@context": "https://schema.org", "@type": "Architect", "@id": alan + "#ofis", name: m.unvan || m.ad, description: tr(m.altMetin), url: alan,
    areaServed: { "@type": "City", name: il.sehir || "Ankara" }, address: { "@type": "PostalAddress", streetAddress: il.adres || "", addressLocality: il.ilce || il.sehir || "Ankara", addressCountry: "TR" },
    telephone: il.tel || "", email: il.eposta || "", sameAs: [il.instagram, il.linkedin].filter(Boolean) };
  return '<script type="application/ld+json">' + JSON.stringify(d).replace(/</g, "\\u003c") + "</script>";
}
/* tam belge (Node önceden üretim) */
function belge(ic, sayfa, ops) {
  ops = ops || {};
  var dosya = sayfaDosya(sayfa), alan = (ic.site || {}).alan || "", can = alan + (dosya === "index.html" ? "" : dosya), b = baslik(ic, sayfa), ac = tr(((ic.sayfalar || {})[sayfa] || {}).aciklama);
  var yay = (ic.site || {}).yayinda, v = ops.surum || "2";
  return '<!doctype html>\n<html lang="tr" data-title-en="' + esc(en(b)) + '" data-sayfa="' + esc(sayfa) + '">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    (yay ? "" : '<meta name="robots" content="noindex, nofollow">\n') + "<title>" + esc(tr(b)) + '</title>\n<meta name="description" content="' + esc(ac) + '">\n<link rel="canonical" href="' + esc(can) + '">\n' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(tr(b)) + '"><meta property="og:description" content="' + esc(ac) + '"><meta property="og:url" content="' + esc(can) + '"><meta property="og:locale" content="tr_TR">\n' +
    '<meta name="theme-color" content="' + esc(guvenliRenk(((ic.marka || {}).renkler || {}).yesil, "#253925")) + '">\n<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..800&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="assets/site.css?v=' + v + '">\n<style id="bn-renk">' + renkCSS(ic) + "</style>\n" + (sayfa === "index" || sayfa === "iletisim" ? schema(ic) + "\n" : "") +
    "<script>window.BENSAY=" + JSON.stringify({ wa: waLink(ic), site: "bensay", sb: ops.sb || null, guncelleme: (ic.meta || {}).guncelleme || "" }).replace(/</g, "\\u003c") + ";</script>\n</head>\n<body>\n" +
    '<a class="atla" href="#icerik">' + T2("İçeriğe geç", "Skip to content") + "</a>\n" + '<div id="bn-ust">' + ust(ic, sayfa) + "</div>\n<main id=\"icerik\">\n" + ana(ic, sayfa, ops.ctx) + "\n</main>\n" + '<div id="bn-alt">' + alt(ic) + "</div>\n" +
    '<script src="assets/render.js?v=' + v + '" defer></script><script src="assets/maliyet.js?v=' + v + '" defer></script>' + (sayfa === "araclar" ? '<script src="assets/araclar.js?v=' + v + '" defer></script>' : "") +
    '<script src="assets/site.js?v=' + v + '" defer></script>\n</body>\n</html>\n';
}
/* tarayıcı: var olan sayfayı yeni içerikle yeniden çiz */
function yenidenCiz(ic, sayfa, ctx) {
  var d = document, b = baslik(ic, sayfa);
  var r = d.getElementById("bn-renk"); if (r) r.textContent = renkCSS(ic);
  var u = d.getElementById("bn-ust"); if (u) u.innerHTML = ust(ic, sayfa);
  var m = d.getElementById("icerik"); if (m) m.innerHTML = ana(ic, sayfa, ctx);
  var a = d.getElementById("bn-alt"); if (a) a.innerHTML = alt(ic);
  d.documentElement.setAttribute("data-title-en", en(b)); d.documentElement.setAttribute("data-title-tr", tr(b)); d.title = d.documentElement.classList.contains("en") ? en(b) : tr(b);
  if (window.BENSAY) window.BENSAY.wa = waLink(ic);
}
var API = { SAYFALAR: SAYFALAR, BOLUM_TIPLERI: BOLUM_TIPLERI, belge: belge, yenidenCiz: yenidenCiz, ana: ana, renkCSS: renkCSS, esc: esc, tr: tr, en: en, T: T, tl: tl, sayfaDosya: sayfaDosya };
if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.BNRender = API;
})(typeof window !== "undefined" ? window : globalThis);
