/* Hanzade Fırın & Cafe · evrensel sayfa çizici (Dijitabela, 1 Kas 2026)
   Aynı kod hem Node'da (önceden üretim: MUSTERILER/hanzade-firin/onuret.js) hem tarayıcıda (Supabase'deki ya da panelden gelen içerikle yeniden çizim) çalışır.
   Girdi: içerik (veri/icerik.json ya da Supabase public.site_icerik.veri, site = "hanzade"). Çıktı: sayfa parçaları ya da tam HTML belgesi. */
(function (kok) {
"use strict";
/* Alan adı: kanonik/OG adresleri buradan üretilir. Alan adı değişirse YALNIZ bu satırı değiştirip onuret.js'i yeniden çalıştırın. */
var ALAN = "https://hanzadefirin.com/";
var SB = { url: "https://ctlbhwbccqgwmtqbwtfs.supabase.co", key: "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy" }; // herkese açık okuma anahtarı (RLS)
var SITE = "hanzade";

var SAYFALAR = {
  index: { dosya: "index.html", ad: "Ana sayfa" },
  menu: { dosya: "menu.html", ad: "Menü ve fiyatlar" },
  sabah: { dosya: "sabah-paketleri.html", ad: "Sabah paketleri" },
  pasta: { dosya: "pasta-siparisi.html", ad: "Pasta siparişi" },
  yilbasi: { dosya: "yilbasi-pastasi.html", ad: "Yılbaşı pastası" },
  kurumsal: { dosya: "kurumsal.html", ad: "Kurumsal" },
  katalog: { dosya: "katalog.html", ad: "Katalog" },
  hakkimizda: { dosya: "hakkimizda.html", ad: "Hakkımızda" },
  iletisim: { dosya: "iletisim.html", ad: "İletişim" },
  kvkk: { dosya: "kvkk.html", ad: "KVKK ve çerezler" }
};
var GUNLER_JS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

/* ---------- yardımcılar ---------- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function url(u) { u = String(u || "").trim(); return /^(javascript|data|vbscript):/i.test(u) ? "#" : u; }
function bosMu(v) { return v == null || v === "" || (typeof v === "number" && isNaN(v)); }
function tl(n) { return Math.round(Number(n)).toLocaleString("tr-TR") + " TL"; }
function fiyatVar(f) { return !bosMu(f) && !isNaN(Number(f)) && Number(f) > 0; }
var BIRIM = { kg: "/kg", porsiyon: "/porsiyon", dilim: "/dilim", adet: "" };
function fiyatHTML(f, birim, bosYazi) {
  if (!fiyatVar(f)) return '<span class="magaza">' + esc(bosYazi || "Mağazada") + "</span>";
  return '<b class="fy">' + tl(f) + (BIRIM[birim] ? "<small>" + BIRIM[birim] + "</small>" : "") + "</b>";
}
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
function I(ic) { return ic.isletme || {}; }
function telLink(t) { var d = String(t || "").replace(/\D/g, ""); if (!d) return ""; if (d.indexOf("90") === 0 && d.length === 12) return "tel:+" + d; if (d[0] === "0") d = d.slice(1); return "tel:+90" + d; }
function waNo(n) { var d = String(n || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "90" + d.slice(1); else if (d.length === 10 && d[0] === "5") d = "90" + d; return d.length >= 11 ? d : ""; }
function waLink(ic, metin) { var n = waNo(I(ic).siparis_whatsapp); return n ? "https://wa.me/" + n + (metin ? "?text=" + encodeURIComponent(metin) : "") : ""; }
function tamAdres(ic) { var i = I(ic); return [i.adres, [i.ilce, i.sehir].filter(Boolean).join(" / ")].filter(Boolean).join(", "); }
function haritaGom(ic) { var i = I(ic); return "https://maps.google.com/maps?q=" + encodeURIComponent([i.ad, i.adres, i.ilce, i.sehir].filter(Boolean).join(", ")) + "&z=17&output=embed"; }
function yorumLink(ic) { var i = I(ic); return url(i.google_yorum || i.harita_link || ""); }
function saatOzet(ic) {
  var s = (I(ic).saatler || []).filter(function (x) { return x; });
  if (!s.length) return "";
  var acik = s.filter(function (x) { return !x.kapali; });
  var hepsiAyni = acik.length === s.length && acik.every(function (x) { return x.acilis === acik[0].acilis && x.kapanis === acik[0].kapanis; });
  if (hepsiAyni) return "Her gün " + acik[0].acilis + "–" + acik[0].kapanis;
  return acik.length ? acik[0].acilis + "–" + acik[0].kapanis + " (günlere göre değişir)" : "";
}
function gorsel(u, alt, ops) {
  ops = ops || {};
  if (!u) return "";
  return '<img src="' + esc(url(u)) + '" alt="' + esc(alt || "") + '"' + (ops.lazy === false ? "" : ' loading="lazy" decoding="async"') + (ops.w ? ' width="' + ops.w + '" height="' + ops.h + '"' : "") + ">";
}
function fotosuz(ad, et) {
  var h = String(ad || "?").trim().charAt(0).toLocaleUpperCase("tr-TR");
  return '<div class="fotosuz" aria-hidden="true"><span>' + esc(h) + "</span>" + (et ? "<small>" + esc(et) + "</small>" : "") + "</div>";
}
function sayfaDosya(id) { return (SAYFALAR[id] || {}).dosya || "index.html"; }
function kat(ic, id) { return (ic.kategoriler || []).filter(function (k) { return k.id === id; })[0]; }
function urunler(ic, katId) { return (ic.urunler || []).filter(function (u) { return u && u.kat === katId && u.satista !== false && u.ad; }); }
function cesitler(ic) { return ((ic.pasta || {}).cesitler || []).filter(function (c) { return c && c.satista !== false && c.ad; }); }
function boylar(ic) { return ((ic.pasta || {}).boylar || []).filter(function (b) { return b && b.ad; }); }
function minBoy(ic) { var f = boylar(ic).map(function (b) { return Number(b.fiyat) || 0; }).filter(Boolean); return f.length ? Math.min.apply(null, f) : 0; }
function paketler(ic) { return ((ic.sabah || {}).paketler || []).filter(function (p) { return p && p.satista !== false && p.ad; }); }
function yilbasiAcik(ic) { var y = (ic.duyurular || {}).yilbasi; return !!(y && y.acik); }
function bas(etiket, baslik, metin, sag) {
  return '<div class="bas"><div>' + (etiket ? '<p class="mono">' + esc(etiket) + "</p>" : "") + "<h2>" + esc(baslik) + "</h2>" + (metin ? "<p>" + esc(metin) + "</p>" : "") + "</div>" + (sag || "") + "</div>";
}

/* ---------- üst / alt ---------- */
function ust(ic, sayfa) {
  var d = ic.duyurular || {}, i = I(ic);
  var serit = d.serit && d.serit.acik && d.serit.metin ? '<div class="duyuru" role="note">' + esc(d.serit.metin) + "</div>" : "";
  var linkler = [["menu", "Menü & fiyatlar"], ["sabah", "Sabah paketleri"], ["pasta", "Pasta siparişi"]];
  if (yilbasiAcik(ic)) linkler.push(["yilbasi", "Yılbaşı pastası"]);
  linkler = linkler.concat([["kurumsal", "Kurumsal"], ["hakkimizda", "Hakkımızda"], ["iletisim", "İletişim"]]);
  var nav = linkler.map(function (l) { return '<a href="' + sayfaDosya(l[0]) + '"' + (l[0] === sayfa ? ' aria-current="page"' : "") + ">" + esc(l[1]) + "</a>"; }).join("");
  return serit + '<header class="ust"><div class="kap">' +
    '<a class="logo" href="index.html" aria-label="' + esc(i.ad || "Hanzade") + ' ana sayfa"><b>' + esc((i.kisaAd || "Hanzade").toLocaleUpperCase("tr-TR")) + "</b><small>FIRIN &amp; CAFE · UNCALI</small></a>" +
    '<nav class="nav" id="nav" aria-label="Ana menü">' + nav + '<a class="nav-tel" href="' + esc(telLink(i.telefon)) + '">' + esc(i.telefon || "") + "</a></nav>" +
    '<span class="durum" id="durum"><i></i><span>' + esc(saatOzet(ic)) + "</span></span>" +
    '<a class="btn d ust-btn" href="pasta-siparisi.html">Pasta siparişi</a>' +
    '<button class="menu-dg" id="menuDg" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menüyü aç"><span></span></button>' +
    "</div></header>";
}
function alt(ic) {
  var i = I(ic), yil = new Date().getFullYear();
  var plat = (i.platformlar || []).filter(function (p) { return p && p.ad; }).map(function (p) { return p.link ? '<a href="' + esc(url(p.link)) + '" target="_blank" rel="noopener">' + esc(p.ad) + "</a>" : "<span>" + esc(p.ad) + "</span>"; }).join(" · ");
  return '<footer class="alt"><div class="kap alt-ic">' +
    '<div><a class="logo" href="index.html"><b>' + esc((i.kisaAd || "Hanzade").toLocaleUpperCase("tr-TR")) + "</b><small>FIRIN &amp; CAFE · UNCALI</small></a><p>" + esc(i.slogan || "") + "</p></div>" +
    "<div><h3>Adres</h3><p>" + esc(tamAdres(ic)) + '</p><p><a href="' + esc(url(i.harita_link)) + '" target="_blank" rel="noopener">Yol tarifi al →</a></p></div>' +
    "<div><h3>İletişim</h3><p><a href=\"" + esc(telLink(i.telefon)) + '">' + esc(i.telefon || "") + "</a></p>" +
    (i.instagram ? '<p><a href="' + esc(url(i.instagram)) + '" target="_blank" rel="noopener">Instagram @' + esc(String(i.instagram).replace(/\/+$/, "").split("/").pop()) + "</a></p>" : "") +
    "<p>" + esc(saatOzet(ic)) + "</p></div>" +
    (plat ? "<div><h3>Paket servis</h3><p>" + plat + "</p></div>" : "") +
    '</div><div class="kap alt-son"><span>© ' + yil + " " + esc(i.ad || "") + '</span><span><a href="menu.html">Menü</a> · <a href="katalog.html">Katalog</a> · <a href="kvkk.html">KVKK ve çerezler</a></span></div></footer>' +
    '<nav class="alt-cubuk" aria-label="Hızlı erişim"><a href="' + esc(telLink(i.telefon)) + '">Ara</a><a href="' + esc(url(i.harita_link)) + '" target="_blank" rel="noopener">Yol tarifi</a><a class="d" href="pasta-siparisi.html">Pasta siparişi</a></nav>';
}

/* ---------- bölümler ---------- */
function kapak(ic) {
  var i = I(ic), slogan = esc(i.slogan || "").replace(/(\d+\s+yıldır)/, "<span>$1</span>");
  return '<section class="kapak"><div class="foto"><img src="img/vitrin.webp" alt="Hanzade vitrini: ekmek, poğaça ve açma rafları" width="1350" height="1063" fetchpriority="high"></div>' +
    '<div class="kap kapak-alt"><div><p class="mono">Uncalı · Konyaaltı · Antalya</p><h1>' + slogan + "</h1></div>" +
    "<div><p>" + esc(i.tanitim || "") + '</p><div class="dug"><a class="btn d" href="menu.html">Menü ve fiyatlar</a><a class="btn" href="pasta-siparisi.html">Pasta siparişi ver</a></div></div></div></section>' +
    '<div class="serit"><div><b>' + esc((saatOzet(ic).match(/\d\d:\d\d–\d\d:\d\d/) || [""])[0] || "Her gün") + "</b><span>" + esc(/Her gün/.test(saatOzet(ic)) ? "Her gün açığız" : "Açılış saatleri") + "</span></div>" +
    "<div><b>20 yıl</b><span>Uncalı Caddesi'nde</span></div><div><b>Kendi üretimhanemiz</b><span>Ekmek, pasta, poğaça, kurabiye</span></div>" +
    "<div><b>Paket servis</b><span>" + esc((i.platformlar || []).map(function (p) { return p.ad; }).join(", ") || "Gel-al") + "</span></div></div>";
}
function aksam(ic) {
  var a = (ic.duyurular || {}).aksam; if (!a || !a.acik) return "";
  var oran = Number(a.oran) > 0 ? '<p class="aksam-oran">Seçili ürünlerde <b>%' + esc(Math.round(Number(a.oran))) + "</b> avantaj</p>" : "";
  return '<section class="aksam" aria-label="Duyuru"><div class="kap aksam-ic"><div class="aksam-saat"><small>Her akşam</small><b>' + esc(a.saat || "") + "</b><small>sonrası</small></div><div><h2>" + esc(a.baslik || "Akşam fırsatı") + "</h2><p>" + esc(a.metin || "") + "</p>" + oran + "</div></div></section>";
}
function yilbasi(ic, tam) {
  var y = (ic.duyurular || {}).yilbasi; if (!y || !y.acik) return "";
  var kartlar = (y.modeller || []).filter(function (m) { return m && m.ad; }).map(function (m) {
    return '<article class="yb-kart">' + (m.gorsel ? '<div class="yb-foto">' + gorsel(m.gorsel, m.ad) + "</div>" : '<div class="yb-foto yb-bos" aria-hidden="true"><span>❄</span></div>') +
      "<h3>" + esc(m.ad) + "</h3><p>" + esc(m.aciklama || "") + '</p><a class="lnk" href="pasta-siparisi.html?model=' + encodeURIComponent(m.id) + '#siparis">Bu modeli sipariş et →</a></article>';
  }).join("");
  return '<section class="bol yilbasi" id="yilbasi"><div class="kap">' +
    bas("Aralık kampanyası", y.baslik || "Yılbaşı pastası", y.metin, '<div class="yb-tarih"><div><small>Erken sipariş</small><b>' + esc(y.erken_son || "") + "</b><small>'a kadar</small></div><div><small>Teslim</small><b>" + esc(y.teslim || "") + "</b></div></div>") +
    '<div class="yb-grid">' + kartlar + "</div>" +
    (tam ? '<p class="not">Boy fiyatları yaş pasta fiyatlarıyla aynıdır (' + boylar(ic).map(function (b) { return b.ad + " " + tl(b.fiyat); }).join(" · ") + "); süslemeye göre fark siparişte bildirilir. Günlük üretimimiz sınırlı, erken sipariş verin.</p>" : "") +
    '<div class="dug"><a class="btn d" href="pasta-siparisi.html?model=' + encodeURIComponent(((y.modeller || [])[0] || {}).id || "") + '#siparis">Yılbaşı pastası sipariş et</a>' + (tam ? "" : '<a class="btn" href="yilbasi-pastasi.html">Ayrıntılar</a>') + "</div></div></section>";
}
function taze(ic) {
  var t = ic.taze || {}, l = (t.liste || []).filter(function (x) { return x && x.ad; });
  if (!l.length || t.acik === false) return "";
  return '<section class="bol taze-bol" id="taze"><div class="kap">' + bas("Bugün fırından çıkanlar", t.baslik || "Sıcak çıkış saatleri", t.metin || "") +
    '<p class="mono" id="bugun"></p><table class="taze" id="tazeT"><thead><tr><th scope="col">Ürün</th><th scope="col">Son çıkış</th><th scope="col">Çıkış saatleri</th><th scope="col">Sonraki</th></tr></thead><tbody>' +
    l.map(function (x, j) { return '<tr data-i="' + j + '"><td><span class="u">' + (x.gorsel ? gorsel(x.gorsel, "") : "") + esc(x.ad) + '</span></td><td class="s son">—</td><td class="s tum">' + esc((x.saatler || []).join(" · ")) + '</td><td class="s sonraki">—</td></tr>'; }).join("") +
    "</tbody></table>" + (t.not ? '<p class="not">' + esc(t.not) + "</p>" : "") + "</div></section>";
}
function grupOf(c) {
  if (c.grup) return c.grup;
  var a = String(c.ad || "").toLocaleLowerCase("tr-TR");
  if (/muz|çilek|frambuaz|meyve/.test(a)) return "meyveli";
  if (/fıstık|lotus|kestane|krokan/.test(a)) return "ozel";
  return "cikolata";
}
var GRUPLAR = [["hepsi", "Hepsi"], ["cikolata", "Çikolatalı"], ["meyveli", "Meyveli"], ["ozel", "Fıstık · lotus · kestane · krokan"]];
function pastaKart(ic, c) {
  return '<article class="pasta" data-grup="' + esc(grupOf(c)) + '">' + (c.gorsel ? '<div class="pf">' + gorsel(c.gorsel, c.ad + " yaş pasta") + "</div>" : fotosuz(c.ad, "Yaş pasta")) +
    '<p class="mono">Yaş pasta</p><h3>' + esc(c.ad) + "</h3><p>" + esc(c.aciklama || "") + '</p><div class="fy-sat"><b>' + tl(minBoy(ic)) + "'den</b>" +
    '<a class="lnk" href="pasta-siparisi.html?model=' + encodeURIComponent(c.id) + '#siparis">Sipariş et →</a></div></article>';
}
function pastaVitrin(ic, ops) {
  ops = ops || {};
  var C = cesitler(ic);
  if (ops.secili) { var s = ops.secili; C = s.map(function (id) { return C.filter(function (c) { return c.id === id; })[0]; }).filter(Boolean); if (!C.length) C = cesitler(ic).slice(0, 4); }
  if (!C.length) return "";
  var filtre = ops.filtre ? '<div class="filtre" id="pastaFiltre" role="group" aria-label="Pasta çeşidi filtresi">' + GRUPLAR.map(function (g, j) { return '<button type="button" data-g="' + g[0] + '" aria-pressed="' + (j === 0) + '">' + esc(g[1]) + "</button>"; }).join("") + "</div>" : "";
  return '<section class="bol" id="pastalar"><div class="kap">' + bas(ops.etiket || "Yaş pasta", ops.baslik || "Pasta vitrini", ops.metin || (ic.pasta || {}).not,
    ops.tumu ? '<a class="btn" href="pasta-siparisi.html">Tüm çeşitler</a>' : "") + filtre +
    '<div class="pastalar" id="pastaIzg">' + C.map(function (c) { return pastaKart(ic, c); }).join("") + "</div>" +
    (ops.siparisKutu ? '<div class="siparis-kutu"><div><h3>Aklınızdaki model listede yok mu?</h3><p>' + esc((ic.pasta || {}).ozel_not || "") + '</p></div><div class="dug"><a class="btn d" href="pasta-siparisi.html#siparis">Siparişe başla</a></div></div>' : "") +
    "</div></section>";
}
function boyTablo(ic) {
  var B = boylar(ic); if (!B.length) return "";
  return '<div class="boylar">' + B.map(function (b) { return '<div class="boy"><span class="mono">' + esc(b.ad) + "</span><b>" + esc(b.kisi || "") + "</b><strong>" + tl(b.fiyat) + "</strong></div>"; }).join("") + "</div>";
}
function paketKart(ic, p) {
  var fiyat = fiyatVar(p.fiyat) ? '<b class="fy">' + tl(p.fiyat) + "</b>" : '<span class="magaza">Fiyat için sorun</span>';
  var sor = !fiyatVar(p.fiyat) ? '<a class="lnk" data-sor="' + esc(p.ad) + '" href="' + esc(waLink(ic, "Merhaba, " + p.ad + " için fiyat ve kişi sayısı bilgisi almak istiyorum.") || telLink(I(ic).telefon)) + '">' + (waLink(ic) ? "WhatsApp'tan sorun →" : esc(I(ic).telefon || "") + " · arayın →") + "</a>" : "";
  return '<article class="paket">' + (p.gorsel ? '<div class="pf">' + gorsel(p.gorsel, p.ad) + "</div>" : fotosuz(p.ad, p.kisi)) +
    '<div class="paket-ic"><p class="mono">' + esc(p.kisi || "") + "</p><h3>" + esc(p.ad) + "</h3><ul>" + (p.icerik || []).filter(Boolean).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><div class="fy-sat">' + fiyat + sor + "</div></div></article>";
}
function sabahBolum(ic, ops) {
  ops = ops || {}; var s = ic.sabah || {}, P = paketler(ic); if (!P.length) return "";
  return '<section class="bol sabah" id="sabah"><div class="kap">' + bas("Gel-al" + (s.saat ? " · " + s.saat : ""), s.baslik || "Sabah paketleri", s.metin, ops.tumu ? '<a class="btn" href="sabah-paketleri.html">Paketler</a>' : "") +
    '<div class="paketler">' + P.map(function (p) { return paketKart(ic, p); }).join("") + "</div>" + (s.not ? '<p class="not">' + esc(s.not) + "</p>" : "") + "</div></section>";
}
function yorum(ic) {
  var u = yorumLink(ic); if (!u) return "";
  return '<section class="bol" id="yorum"><div class="kap yorum"><div class="qr" data-qr="' + esc(u) + '" role="img" aria-label="Google yorum karekodu"><noscript><a href="' + esc(u) + '">Google</a></noscript></div>' +
    '<div><p class="mono">Görüşünüz bizim için önemli</p><h2>Nasıldı? Google\'da yorum yazın.</h2><p>Karekodu telefonunuzla okutun ya da aşağıdaki düğmeye dokunun. İyi de olsa eleştiri de olsa her yorumu okuyoruz.</p>' +
    '<a class="btn" href="' + esc(u) + '" target="_blank" rel="noopener">Google\'da yorum yazın</a></div></div></section>';
}
function saatTablo(ic) {
  return '<table class="saat" data-saat>' + (I(ic).saatler || []).map(function (s) { return '<tr data-gun="' + esc(s.gun) + '"><td>' + esc(s.gun) + "</td><td>" + (s.kapali ? "Kapalı" : esc(s.acilis) + " – " + esc(s.kapanis)) + "</td></tr>"; }).join("") + "</table>";
}
function ziyaret(ic, h1) {
  var i = I(ic);
  var platform = (i.platformlar || []).filter(function (p) { return p && p.ad; }).map(function (p) { return p.link ? '<a href="' + esc(url(p.link)) + '" target="_blank" rel="noopener">' + esc(p.ad) + "</a>" : esc(p.ad); }).join(", ");
  var w = waLink(ic);
  return '<section class="bol" id="ziyaret"><div class="kap ziyaret"><div><p class="mono">Adres &amp; saatler</p>' + (h1 ? "<h1>" : "<h2>") + "Uncalı Caddesi, No:2/A" + (h1 ? "</h1>" : "</h2>") +
    '<address><p>' + esc(tamAdres(ic)) + '</p><p>Tel <a href="' + esc(telLink(i.telefon)) + '">' + esc(i.telefon || "") + "</a>" + (w ? ' · <a href="' + esc(w) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") + "</p></address>" +
    saatTablo(ic) + (i.saat_notu ? '<p class="not">' + esc(i.saat_notu) + "</p>" : "") +
    (platform ? '<p class="not">Evinize paket isterseniz ' + platform + "'de de varız.</p>" : "") +
    '<div class="dug"><a class="btn d" href="' + esc(url(i.harita_link)) + '" target="_blank" rel="noopener">Yol tarifi al</a><a class="btn" href="' + esc(telLink(i.telefon)) + '">Arayın</a></div></div>' +
    '<div class="harita"><iframe src="' + esc(haritaGom(ic)) + '" title="' + esc(i.ad || "Hanzade") + ' konumu (Google Haritalar)" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>';
}
function sayfaBasi(etiket, baslik, metin, foto) {
  return '<section class="sayfa-basi' + (foto ? " fotolu" : "") + '">' + (foto ? '<div class="foto">' + gorsel(foto, "", { lazy: false }) + "</div>" : "") + '<div class="kap"><p class="mono">' + esc(etiket) + "</p><h1>" + esc(baslik) + "</h1>" + (metin ? "<p>" + esc(metin) + "</p>" : "") + "</div></section>";
}
function urunKart(u, katAd, bosYazi) {
  return '<article class="urun">' + (u.gorsel ? '<div class="uf">' + gorsel(u.gorsel, u.ad) + "</div>" : fotosuz(u.ad, katAd)) +
    '<div class="urun-ic"><h3>' + esc(u.ad) + "</h3>" + (u.aciklama ? "<p>" + esc(u.aciklama) + "</p>" : "") + fiyatHTML(u.fiyat, u.birim, bosYazi) + "</div></article>";
}
function kurumsalUrunler(ic) {
  var U = ((ic.metinler || {}).kurumsal_urunler || []).filter(function (u) { return u && u.ad && u.satista !== false; }); if (!U.length) return "";
  var tel = I(ic).telefon || "";
  return '<div class="paketler kurum-urun">' + U.map(function (u) {
    return '<article class="paket">' + (u.gorsel ? '<div class="pf">' + gorsel(u.gorsel, u.ad) + "</div>" : fotosuz(u.ad, u.kisi)) + '<div class="paket-ic"><p class="mono">' + esc(u.kisi || "") + "</p><h3>" + esc(u.ad) + "</h3><p>" + esc(u.aciklama || "") + '</p><div class="fy-sat">' +
      (fiyatVar(u.fiyat) ? '<b class="fy">' + tl(u.fiyat) + "</b>" : '<a class="lnk" href="' + esc(telLink(tel)) + '">Fiyat için arayın · ' + esc(tel) + "</a>") + '<a class="lnk" href="#talep">Talep et →</a></div></div></article>';
  }).join("") + "</div>";
}

/* ---------- sayfalar ---------- */
var SAYFA = {
  index: function (ic) {
    return kapak(ic) + taze(ic) + aksam(ic) + yilbasi(ic, false) +
      pastaVitrin(ic, { secili: (ic.one_cikan || {}).pastalar, baslik: "Öne çıkan pastalar", tumu: true, siparisKutu: true }) +
      sabahBolum(ic, { tumu: true }) + yorum(ic) + ziyaret(ic);
  },
  menu: function (ic) {
    var K = (ic.kategoriler || []).filter(function (k) {
      if (k.ozel === "pasta") return cesitler(ic).length; if (k.ozel === "sabah") return paketler(ic).length; return urunler(ic, k.id).length;
    });
    var cips = '<nav class="cips" aria-label="Kategoriler"><div class="kap">' + K.map(function (k) { return '<a href="#k-' + esc(k.id) + '">' + esc(k.ad) + "</a>"; }).join("") + "</div></nav>";
    var bolum = K.map(function (k) {
      var ic_ = "";
      if (k.ozel === "pasta") ic_ = boyTablo(ic) + '<p class="not">' + esc((ic.pasta || {}).not || "") + '</p><div class="urunler">' + cesitler(ic).map(function (c) { return urunKart({ ad: c.ad, aciklama: c.aciklama, gorsel: c.gorsel, fiyat: minBoy(ic), birim: "" }, "Yaş pasta").replace(/(<b class="fy">)([^<]+)/, "$1$2'den"); }).join("") + '</div><div class="dug"><a class="btn d" href="pasta-siparisi.html#siparis">Pasta siparişi ver</a></div>';
      else if (k.ozel === "sabah") ic_ = '<div class="paketler">' + paketler(ic).map(function (p) { return paketKart(ic, p); }).join("") + "</div>";
      else ic_ = '<div class="urunler">' + urunler(ic, k.id).map(function (u) { return urunKart(u, k.ad, k.fiyatsiz_yazi); }).join("") + "</div>";
      return '<section class="kat" id="k-' + esc(k.id) + '"><div class="kap"><div class="kat-bas"><h2>' + esc(k.ad) + "</h2>" + (k.aciklama ? "<p>" + esc(k.aciklama) + "</p>" : "") + "</div>" + ic_ + "</div></section>";
    }).join("");
    return sayfaBasi("Menü · dükkân fiyatları", "Menü ve fiyatlar", "Fırından, pastaneden ve kahvaltılık köşemizden ne varsa burada. Fiyatı yazmayan ürünlerin fiyatı mağazadaki etikette.") + cips + taze(ic) + bolum +
      '<section class="bol"><div class="kap menu-son"><p>Listeyi yazdırmak ya da PDF olarak kaydetmek ister misiniz?</p><a class="btn" href="katalog.html">Yazdırılabilir katalog</a></div></section>';
  },
  sabah: function (ic) {
    var s = ic.sabah || {};
    return sayfaBasi("Gel-al" + (s.saat ? " · " + s.saat : ""), s.baslik || "Sabah paketleri", s.metin, "img/kahvalti.webp") +
      '<section class="bol"><div class="kap"><div class="paketler">' + paketler(ic).map(function (p) { return paketKart(ic, p); }).join("") + "</div>" + (s.not ? '<p class="not">' + esc(s.not) + "</p>" : "") + "</div></section>" +
      '<section class="bol"><div class="kap adimlar"><div><b>1</b><h3>Gelin</h3><p>' + (s.saat ? esc(s.saat) + " arası kasaya" : "Kasaya") + " uğrayıp paketin adını söylemeniz yeterli.</p></div><div><b>2</b><h3>Sorun</h3><p>Güncel içerik ve fiyatı dükkânda ya da telefonla öğrenebilirsiniz.</p></div><div><b>3</b><h3>Ofise mi?</h3><p>4–6 kişilik kutu ya da ofis tepsisi için önce bizi arayın; süre ve teslim şeklini birlikte netleştirelim. <a href=\"kurumsal.html\">Kurumsal</a></p></div></div></section>" + ziyaret(ic);
  },
  pasta: function (ic) {
    var p = ic.pasta || {};
    return sayfaBasi("Kişiye özel yaş pasta", "Pasta siparişi", "Modeli seçin, boyu ve teslim gününü belirleyin, pasta üzerine yazılacak yazıyı yazın. Siparişiniz WhatsApp'tan bize ulaşır, onaylayıp dönüş yaparız.") +
      '<section class="bol"><div class="kap">' + bas("Fiyat boya göre", "Boy ve fiyatlar", p.not) + boyTablo(ic) + "</div></section>" + yilbasi(ic, false) +
      '<section class="bol siparis" id="siparis"><div class="kap"><div class="bas"><div><p class="mono">Adım adım</p><h2>Siparişinizi hazırlayın</h2><p>Birkaç adımda siparişinizi hazırlayın; son adımda özetiniz WhatsApp\'a hazır gelir.</p></div></div>' +
      '<div class="sihirbaz" id="sihirbaz"><noscript><p>Sipariş için bizi arayın: <a href="' + esc(telLink(I(ic).telefon)) + '">' + esc(I(ic).telefon || "") + "</a></p></noscript></div></div></section>" +
      pastaVitrin(ic, { baslik: "Çeşitlerimiz", filtre: true }) +
      ((p.ornekler || []).length ? '<section class="bol"><div class="kap">' + bas("Nişan · söz · doğum günü", "Özel tasarım pastalar", p.ozel_not) + '<div class="galeri">' + p.ornekler.map(function (u) { return '<figure>' + gorsel(u, "Hanzade özel tasarım pasta örneği") + "</figure>"; }).join("") + "</div></div></section>" : "");
  },
  yilbasi: function (ic) {
    var y = (ic.duyurular || {}).yilbasi || {};
    if (!y.acik) return sayfaBasi("Aralık kampanyası", "Yılbaşı pastası", "Yılbaşı pastası siparişlerimiz Aralık başında açılır. Bu sırada kişiye özel yaş pasta siparişi verebilirsiniz.") +
      '<section class="bol"><div class="kap"><div class="dug"><a class="btn d" href="pasta-siparisi.html">Pasta siparişi</a><a class="btn" href="' + esc(url(I(ic).instagram)) + '" target="_blank" rel="noopener">Duyurular için Instagram</a></div></div></section>';
    return sayfaBasi("Aralık kampanyası · teslim " + (y.teslim || ""), y.baslik || "Yılbaşı pastası", y.metin) + yilbasi(ic, true) + pastaVitrin(ic, { baslik: "Klasik çeşitlerimiz", tumu: true });
  },
  kurumsal: function (ic) {
    var m = ic.metinler || {};
    var kart = (m.kurumsal_maddeler || []).filter(function (x) { return x && x.ad; }).map(function (x, j) { return '<article class="kurum"><span class="mono">0' + (j + 1) + "</span><h3>" + esc(x.ad) + "</h3><p>" + esc(x.metin || "") + "</p></article>"; }).join("");
    return sayfaBasi("Ofisler ve firmalar için", "Sabah tepsisi, toplantı ikramı, kurumsal pasta", m.kurumsal, "img/kurupasta.webp") +
      '<section class="bol"><div class="kap">' + bas("Ofis kutuları", "Ofis sabah tepsisi ve toplantı kutusu", "Kişi sayısı, gün ve saat için bizi arayın ya da formu doldurun; planı birlikte yapalım.") + kurumsalUrunler(ic) + "</div></section>" +
      '<section class="bol"><div class="kap"><div class="kurumlar">' + kart + "</div></div></section>" +
      '<section class="bol" id="talep"><div class="kap form-dz"><div><p class="mono">Teklif isteyin</p><h2>Talep formu</h2><p>Formu doldurun; talebiniz ' + (waLink(ic) ? "WhatsApp'tan" : "telefonla") + ' bize ulaşsın. Kişi sayısına ve güne göre fiyat bildiririz.</p><p class="not">Form bilgileri sitede saklanmaz; yalnız sizin gönderdiğiniz mesaja yazılır.</p></div>' +
      '<form class="form" id="kurumsalForm" novalidate><label>Firma adı<input name="firma" required autocomplete="organization"></label><label>Yetkili adı soyadı<input name="ad" required autocomplete="name"></label>' +
      '<label>Telefon<input name="tel" type="tel" inputmode="tel" autocomplete="tel"></label><label>Talep<select name="talep"><option>Sabah tepsisi</option><option>Toplantı ikramı</option><option>Doğum günü pastası</option><option>Logolu pasta</option><option>Düzenli haftalık sipariş</option><option>Diğer</option></select></label>' +
      '<label>Kişi sayısı<input name="kisi" type="number" min="1" inputmode="numeric"></label><label>Tarih<input name="tarih" type="date"></label><label class="genis">Adres / not<textarea name="not" rows="3"></textarea></label>' +
      '<div class="genis form-son" id="kurumsalSon"></div></form></div></section>' + sabahBolum(ic, { tumu: true });
  },
  katalog: function (ic) {
    var i = I(ic);
    var K = (ic.kategoriler || []).map(function (k) {
      var satir = "";
      if (k.ozel === "pasta") {
        if (!cesitler(ic).length) return "";
        satir = boylar(ic).map(function (b) { return "<li><span>" + esc(b.ad) + " <small>" + esc(b.kisi || "") + "</small></span><i></i><b>" + tl(b.fiyat) + "</b></li>"; }).join("") +
          '<li class="k-not">Çeşitler: ' + esc(cesitler(ic).map(function (c) { return c.ad; }).join(", ")) + "</li>";
      } else if (k.ozel === "sabah") {
        if (!paketler(ic).length) return "";
        satir = paketler(ic).map(function (p) { return "<li><span>" + esc(p.ad) + " <small>" + esc((p.icerik || []).join(", ")) + "</small></span><i></i><b>" + (fiyatVar(p.fiyat) ? tl(p.fiyat) : "Sorun") + "</b></li>"; }).join("");
      } else {
        var U = urunler(ic, k.id); if (!U.length) return "";
        satir = U.map(function (u) { return "<li><span>" + esc(u.ad) + (u.aciklama ? " <small>" + esc(u.aciklama) + "</small>" : "") + "</span><i></i><b>" + (fiyatVar(u.fiyat) ? tl(u.fiyat) + (BIRIM[u.birim] || "") : esc(k.fiyatsiz_yazi || "Mağazada")) + "</b></li>"; }).join("");
      }
      return '<section class="k-kat"><h2>' + esc(k.ad) + (k.ozel === "sabah" && (ic.sabah || {}).saat ? " <small>" + esc(ic.sabah.saat) + "</small>" : "") + "</h2><ul>" + satir + "</ul></section>";
    }).join("");
    var KU = ((ic.metinler || {}).kurumsal_urunler || []).filter(function (u) { return u && u.ad && u.satista !== false; });
    if (KU.length) K += '<section class="k-kat"><h2>Kurumsal · ofis</h2><ul>' + KU.map(function (u) { return "<li><span>" + esc(u.ad) + " <small>" + esc([u.kisi, u.aciklama].filter(Boolean).join(" · ")) + "</small></span><i></i><b>" + (fiyatVar(u.fiyat) ? tl(u.fiyat) : "Sorun") + "</b></li>"; }).join("") + "</ul></section>";
    return '<div class="katalog-ust"><div class="kap"><div><p class="mono">Katalog</p><h1>Ürün kataloğu ve fiyat listesi</h1><p>Bu sayfa sitedeki güncel fiyatlardan otomatik hazırlanır. A4 olarak yazdırın ya da PDF kaydedin.</p></div><button class="btn d" type="button" data-yazdir>Yazdır / PDF</button></div></div>' +
      '<article class="katalog"><header class="k-bas"><div class="logo"><b>' + esc((i.kisaAd || "Hanzade").toLocaleUpperCase("tr-TR")) + "</b><small>FIRIN &amp; CAFE · UNCALI</small></div><div><p>" + esc(tamAdres(ic)) + "</p><p>Tel " + esc(i.telefon || "") + " · " + esc(saatOzet(ic)) + "</p><p>" + esc(ALAN.replace(/^https?:\/\//, "").replace(/\/$/, "")) + (i.instagram ? " · instagram.com/" + esc(String(i.instagram).replace(/\/+$/, "").split("/").pop()) : "") + "</p></div></header>" +
      '<div class="k-kolon">' + K + "</div>" +
      '<footer class="k-alt"><span>Fiyatlar etiket fiyatıdır ve değişebilir. Fiyatı yazmayan ürünler için mağazadaki etikete bakın.</span><span data-tarih>' + esc((ic.meta || {}).tarih || "") + "</span></footer></article>";
  },
  hakkimizda: function (ic) {
    var m = ic.metinler || {};
    return sayfaBasi("20 yıllık Uncalı fırını", "Hakkımızda", "", "img/dukkan.webp") +
      '<section class="bol"><div class="kap metin-dz"><div class="metin">' + paragraf(m.hakkimizda) + '</div><div class="metin-foto">' + gorsel("img/dis-cephe.webp", "Hanzade Fırın dış cephesi, Uncalı Caddesi") + gorsel("img/usta.webp", "Üretimhanemizde yaş pasta hazırlığı") + "</div></div></section>" +
      '<div class="serit"><div><b>20 yıl</b><span>Aynı köşede</span></div><div><b>16 kişi</b><span>Ekibimiz</span></div><div><b>' + esc((saatOzet(ic).match(/\d\d:\d\d/) || ["06:00"])[0]) + "</b><span>Her sabah açılış</span></div><div><b>Kendi üretim</b><span>Üst kattaki üretimhane</span></div></div>" +
      ziyaret(ic);
  },
  iletisim: function (ic) {
    var i = I(ic), w = waLink(ic);
    var kartlar = '<div class="iletisim-k"><a class="ik" href="' + esc(telLink(i.telefon)) + '"><span class="mono">Telefon</span><b>' + esc(i.telefon || "") + "</b></a>" +
      (w ? '<a class="ik" href="' + esc(w) + '" target="_blank" rel="noopener"><span class="mono">WhatsApp sipariş</span><b>+' + esc(waNo(i.siparis_whatsapp)) + "</b></a>" : "") +
      (i.instagram ? '<a class="ik" href="' + esc(url(i.instagram)) + '" target="_blank" rel="noopener"><span class="mono">Instagram</span><b>@' + esc(String(i.instagram).replace(/\/+$/, "").split("/").pop()) + "</b></a>" : "") +
      '<a class="ik" href="' + esc(url(i.harita_link)) + '" target="_blank" rel="noopener"><span class="mono">Yol tarifi</span><b>Google Haritalar</b></a></div>';
    return ziyaret(ic, true) + '<section class="bol"><div class="kap">' + bas("Bize ulaşın", "İletişim", "Pasta siparişi, ofis ikramı ya da bir sorunuz için.") + kartlar + "</div></section>" + yorum(ic);
  },
  kvkk: function (ic) {
    var i = I(ic);
    var t = "## Veri sorumlusu\n" + (i.ad || "") + " · " + tamAdres(ic) + " · Tel " + (i.telefon || "") +
      "\n\n## Bu sitede hangi veriler işlenir?\nBu site bir tanıtım sitesidir. Üyelik, sepet ya da online ödeme yoktur.\n- Pasta sipariş ve kurumsal talep formlarına yazdığınız bilgiler sitede ya da bir sunucuda SAKLANMAZ. Formu tamamladığınızda bilgiler yalnızca sizin cihazınızda bir mesaj metnine dönüştürülür ve sizin onayınızla WhatsApp uygulamasına aktarılır ya da bizi telefonla aramanız istenir.\n- WhatsApp üzerinden bize gönderdiğiniz mesajlar, siparişinizi hazırlamak ve size dönüş yapmak amacıyla işlenir; bu iletişim WhatsApp'ın kendi gizlilik koşullarına tabidir." +
      "\n\n## Çerezler\nSitemiz reklam ya da izleme çerezi kullanmaz. Sayfaların çalışması için yazı tipleri (Google Fonts) ve harita (Google Haritalar) gibi üçüncü taraf hizmetler yüklenir; bu hizmetler kendi çerez ve kayıt politikalarını uygulayabilir. Tarayıcınızın ayarlarından çerezleri dilediğiniz zaman silebilir ya da engelleyebilirsiniz." +
      "\n\n## Haklarınız\n6698 sayılı KVKK'nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini ya da silinmesini isteme gibi haklarınızı kullanmak için yukarıdaki adresten ya da telefondan bize ulaşabilirsiniz." +
      "\n\n## Güncelleme\nBu metin gerektiğinde güncellenir. Son güncelleme: " + ((ic.meta || {}).tarih || "");
    return sayfaBasi("Yasal bilgilendirme", "KVKK ve çerez aydınlatma metni", "") + '<section class="bol"><div class="kap metin dar">' + paragraf(t) + "</div></section>";
  }
};

function ana(ic, sayfa) { try { return (SAYFA[sayfa] || SAYFA.index)(ic); } catch (e) { return "<!-- çizim hatası: " + esc(e && e.message) + " -->"; } }
function sayfaMeta(ic, sayfa) { var s = (ic.sayfalar || {})[sayfa] || {}; return { baslik: s.baslik || I(ic).ad || "Hanzade", aciklama: s.aciklama || I(ic).tanitim || "" }; }
var GUN_SCHEMA = { "Pazartesi": "Monday", "Salı": "Tuesday", "Çarşamba": "Wednesday", "Perşembe": "Thursday", "Cuma": "Friday", "Cumartesi": "Saturday", "Pazar": "Sunday" };
function schema(ic, sayfa) {
  var i = I(ic), tel = telLink(i.telefon).replace("tel:", "");
  var d = { "@context": "https://schema.org", "@type": "Bakery", "@id": ALAN + "#isletme", name: i.ad, alternateName: i.kisaAd, description: i.tanitim, url: ALAN, image: ALAN + "img/og.jpg",
    telephone: tel, priceRange: "₺", servesCuisine: ["Fırın", "Pastane", "Kahvaltılık"], hasMap: i.harita_link, menu: ALAN + "menu.html", acceptsReservations: false,
    address: { "@type": "PostalAddress", streetAddress: i.adres, addressLocality: i.ilce, addressRegion: i.sehir, postalCode: i.posta_kodu || undefined, addressCountry: "TR" },
    openingHoursSpecification: (i.saatler || []).filter(function (s) { return !s.kapali && GUN_SCHEMA[s.gun]; }).map(function (s) { return { "@type": "OpeningHoursSpecification", dayOfWeek: GUN_SCHEMA[s.gun], opens: s.acilis, closes: s.kapanis }; }),
    sameAs: [i.instagram].concat((i.platformlar || []).map(function (p) { return p.link; })).filter(Boolean) };
  var ek = "";
  if (sayfa === "sabah") ek = '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Sabah paketleri", itemListElement: paketler(ic).map(function (p, j) { var o = { "@type": "ListItem", position: j + 1, item: { "@type": "Product", name: p.ad, description: (p.icerik || []).join(", ") } }; if (fiyatVar(p.fiyat)) o.item.offers = { "@type": "Offer", price: String(p.fiyat), priceCurrency: "TRY" }; return o; }) }).replace(/</g, "\\u003c") + "</script>\n";
  return '<script type="application/ld+json">' + JSON.stringify(d).replace(/</g, "\\u003c") + "</script>\n" + ek;
}
/* tam belge (Node önceden üretim) */
function belge(ic, sayfa, ops) {
  ops = ops || {};
  var dosya = sayfaDosya(sayfa), can = ALAN + (dosya === "index.html" ? "" : dosya), m = sayfaMeta(ic, sayfa), v = ops.surum || "1";
  var yay = (ic.site || {}).yayinda, noindex = !yay || (sayfa === "yilbasi" && !yilbasiAcik(ic));
  var veri = JSON.stringify(ic).replace(/</g, "\\u003c");
  return '<!doctype html>\n<html lang="tr" data-sayfa="' + esc(sayfa) + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    (noindex ? '<meta name="robots" content="noindex, nofollow">\n' : "") +
    "<title>" + esc(m.baslik) + '</title>\n<meta name="description" content="' + esc(m.aciklama) + '">\n<link rel="canonical" href="' + esc(can) + '">\n' +
    '<meta property="og:type" content="website">\n<meta property="og:site_name" content="' + esc(I(ic).ad || "") + '">\n<meta property="og:title" content="' + esc(m.baslik) + '">\n<meta property="og:description" content="' + esc(m.aciklama) + '">\n<meta property="og:url" content="' + esc(can) + '">\n<meta property="og:image" content="' + ALAN + 'img/og.jpg">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:locale" content="tr_TR">\n<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="theme-color" content="#22170f">\n<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400;62..125,600;62..125,800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="assets/site.css?v=' + v + '">\n' + (sayfa === "index" || sayfa === "iletisim" || sayfa === "hakkimizda" || sayfa === "sabah" ? schema(ic, sayfa) : "") +
    "<script>window.HZ_CFG=" + JSON.stringify({ site: SITE, sb: SB, guncelleme: (ic.meta || {}).guncelleme || "" }) + ";</script>\n</head>\n<body>\n" +
    '<a class="atla" href="#icerik">İçeriğe geç</a>\n<div id="hz-ust">' + ust(ic, sayfa) + '</div>\n<main id="icerik">\n' + ana(ic, sayfa) + '\n</main>\n<div id="hz-alt">' + alt(ic) + "</div>\n" +
    '<script type="application/json" id="hz-veri">' + veri + "</script>\n" +
    (sayfa === "index" || sayfa === "iletisim" ? '<script src="assets/qrcode.min.js" defer></script>\n' : "") +
    '<script src="assets/render.js?v=' + v + '" defer></script>\n<script src="assets/site.js?v=' + v + '" defer></script>\n</body>\n</html>\n';
}
/* tarayıcı: var olan sayfayı yeni içerikle yeniden çiz */
function yenidenCiz(ic, sayfa) {
  var d = document, m = sayfaMeta(ic, sayfa);
  var u = d.getElementById("hz-ust"); if (u) u.innerHTML = ust(ic, sayfa);
  var a = d.getElementById("icerik"); if (a) a.innerHTML = ana(ic, sayfa);
  var l = d.getElementById("hz-alt"); if (l) l.innerHTML = alt(ic);
  d.title = m.baslik;
  var md = d.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", m.aciklama);
}
var API = { ALAN: ALAN, SB: SB, SITE: SITE, SAYFALAR: SAYFALAR, GUNLER_JS: GUNLER_JS, belge: belge, yenidenCiz: yenidenCiz, ana: ana, esc: esc, tl: tl, url: url, fiyatVar: fiyatVar,
  waLink: waLink, waNo: waNo, telLink: telLink, tamAdres: tamAdres, sayfaDosya: sayfaDosya, cesitler: cesitler, boylar: boylar, paketler: paketler, yilbasiAcik: yilbasiAcik, saatOzet: saatOzet, yorumLink: yorumLink, grupOf: grupOf };
if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.HZRender = API;
})(typeof window !== "undefined" ? window : globalThis);
