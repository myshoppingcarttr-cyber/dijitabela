/* Yorgancı Ramazan · site yönetim paneli (8 Kas 2026)
   Veri: Supabase public.site_icerik (site='yorganci-ramazan').veri — tek JSON belge. Yazma yetkisini RLS (site_yazabilir) denetler.
   Görseller: storage 'site-gorsel' / yorganci-ramazan/urun/… (telefonda WebP'ye küçültülerek yüklenir).
   Giriş: Supabase Auth (şifre ya da e-posta bağlantısı). İlk kez girecek kişi önce "davet" listesine eklenir (Diğer → Kullanıcılar).
   Yerel test: yalnız localhost'ta ?yerel=1 ile; veri yerel test sunucusuna yazılır, Supabase'e dokunulmaz. */
(function () {
"use strict";
var SB_URL = "https://ctlbhwbccqgwmtqbwtfs.supabase.co", SB_KEY = "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy", SITE = "yorganci-ramazan", BUCKET = "site-gorsel";
var YEREL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && /[?&]yerel=1\b/.test(location.search);
var KAT = { yorgan: "Yorganlar", yastik: "Yastıklar", yatak: "Döşek & minder", ortu: "Perde, örtü & battaniye", hizmet: "Tamir & yenileme" };
var DOLGU = { yun: "Yün", pamuk: "Pamuk", silikon: "Silikon", boncuk: "Boncuk silikon", elyaf: "Elyaf", sunger: "Sünger", diger: "Diğer / yok" };
var BAKIM = { yun: "Yün", pamuk: "Pamuk", sentetik: "Silikon / elyaf", boncuk: "Boncuk silikon", sunger: "Sünger", ortu: "Örtü / kumaş", perde: "Perde", cocuk: "Çocuk yorganı (pamuk)", elektrik: "Elektrikli battaniye" };
var STOK = { "": "Belirtme", hazir: "Hazır stokta – hemen kargoda", siparis: "Siparişle dikilir" };
var AILE = { yorgan: "yorgan", yastik: "yastik", yatak: "dosek" };
var DURUM = { satista: "Satışta", sor: "Stok için sorun", gizli: "Gizli (sitede görünmez)" };
var sb = YEREL ? null : window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, detectSessionInUrl: true } });
var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
var veri = null, kirli = false, sekme = "fiyat", duzenlenen = null, kullanici = null, yonetici = false;

/* ---------- yardımcılar ---------- */
function el(t, o, c) {
  var e = document.createElement(t);
  Object.keys(o || {}).forEach(function (k) {
    var v = o[k]; if (v == null || v === false) return;
    if (k === "class") e.className = v; else if (k === "text") e.textContent = v;
    else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v);
  });
  (c || []).forEach(function (x) { if (x != null) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
  return e;
}
function toast(m) { var t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.z); toast.z = setTimeout(function () { t.hidden = true; }, 4200); }
function durum(m, s) { var d = $("#durum"); d.textContent = m; d.className = "durum " + (s || ""); }
function degisti() { kirli = true; $("#kaydet").disabled = false; durum("Kaydedilmemiş değişiklik var", "kirli"); }
function TL(n) { return (+n || 0).toLocaleString("tr-TR") + " TL"; }
function slug(s) { var m = { "ç": "c", "ğ": "g", "ı": "i", "İ": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" }; return String(s || "").toLocaleLowerCase("tr").replace(/[çğıİöşüâîû]/g, function (c) { return m[c] || c; }).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "urun"; }
function kombin(u) { var g = (u.secim || []).filter(function (x) { return x && x.d && x.d.length; }); if (!g.length) return []; if (g.length === 1) return g[0].d.slice(); return g[0].d.reduce(function (a, x) { return a.concat(g[1].d.map(function (y) { return x + "|" + y; })); }, []); }
function gorselUrl(u, kucuk) { var g = u.gorsel || ""; if (!g) return ""; if (/^https?:/.test(g)) return kucuk ? g.replace(/\.webp$/, "-s.webp") : g; return "../img/" + g + (kucuk ? "-s" : "") + ".webp"; }
window.addEventListener("beforeunload", function (e) { if (kirli) { e.preventDefault(); e.returnValue = ""; } });

/* ---------- doğrulama (sunucu tarafında da aynı kurallar var) ---------- */
function dogrula(v) {
  var h = [];
  if (!v.urunler.length) h.push("En az bir ürün olmalı.");
  var idler = {};
  v.urunler.forEach(function (u) {
    if (!u.ad || u.ad.length > 80) h.push("Ürün adı boş ya da çok uzun: " + (u.ad || "(adsız)"));
    if (idler[u.id]) h.push("Aynı ürün iki kez var: " + u.ad); idler[u.id] = 1;
    Object.keys(u.fiyat || {}).forEach(function (k) { var f = u.fiyat[k]; if (!(f >= 0 && f <= 1000000) || Math.floor(f) !== f) h.push(u.ad + ": fiyat geçersiz (" + k + ")"); });
    if (!kombin(u).length) h.push(u.ad + ": en az bir ölçü/seçenek yazın.");
  });
  if (!/^\d{10,12}$/.test(String(v.isletme.wa || "").replace(/\D/g, ""))) h.push("WhatsApp numarası 90 ile başlayan rakamlardan oluşmalı (ör. 905327262412).");
  if (!(+v.ayar.kargoUcret >= 0) || !(+v.ayar.kargoEsik >= 0)) h.push("Kargo ücreti ve eşiği sayı olmalı.");
  return h;
}

/* ---------- veri katmanı ---------- */
var VK = YEREL ? {
  oku: function () { return fetch("/yerel/veri").then(function (r) { return r.json(); }); },
  yaz: function (v) { return fetch("/yerel/veri", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(v) }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); }); },
  gecmis: function () { return fetch("/yerel/gecmis").then(function (r) { return r.json(); }); },
  yukle: function (ad, blob) { return fetch("/yerel/gorsel?ad=" + encodeURIComponent(ad), { method: "POST", body: blob }).then(function (r) { return r.json(); }).then(function (j) { return j.url; }); },
} : {
  oku: function () { return sb.from("site_icerik").select("veri").eq("site", SITE).single().then(function (r) { if (r.error) throw r.error; return r.data.veri; }); },
  yaz: function (v) { return sb.from("site_icerik").update({ veri: v }).eq("site", SITE).select("site").then(function (r) { if (r.error) throw r.error; if (!r.data || !r.data.length) throw new Error("Kaydetme yetkiniz yok."); }); },
  gecmis: function () { return sb.from("site_icerik_gecmis").select("id,zaman,veri").eq("site", SITE).order("zaman", { ascending: false }).limit(10).then(function (r) { if (r.error) throw r.error; return r.data; }); },
  yukle: function (ad, blob) { var yol = SITE + "/urun/" + ad; return sb.storage.from(BUCKET).upload(yol, blob, { contentType: "image/webp", upsert: true, cacheControl: "31536000" }).then(function (r) { if (r.error) throw r.error; return sb.storage.from(BUCKET).getPublicUrl(yol).data.publicUrl; }); },
};

/* ---------- fotoğraf: telefonda küçült, WebP yap ---------- */
function kucult(dosya, enBoy) {
  return new Promise(function (ok, hata) {
    if (!/^image\//.test(dosya.type)) return hata(new Error("Lütfen bir fotoğraf seçin."));
    if (dosya.size > 25 * 1024 * 1024) return hata(new Error("Fotoğraf çok büyük (25 MB üstü)."));
    var img = new Image(), url = URL.createObjectURL(dosya);
    img.onload = function () {
      var o = Math.min(1, enBoy / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * o); c.height = Math.round(img.height * o);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(function (b) { b ? ok(b) : hata(new Error("Fotoğraf dönüştürülemedi.")); }, "image/webp", 0.8);
    };
    img.onerror = function () { hata(new Error("Fotoğraf açılamadı.")); }; img.src = url;
  });
}

/* ---------- alan yardımcıları ---------- */
function metin(o, k, et, ops) {
  ops = ops || {};
  var i = el(ops.uzun ? "textarea" : "input", { type: ops.tip || "text", inputmode: ops.im, maxlength: ops.max || 400, id: "a-" + Math.random().toString(36).slice(2) });
  i.value = o[k] == null ? "" : o[k];
  i.addEventListener("input", function () { o[k] = ops.tip === "number" ? (i.value === "" ? 0 : Math.round(+i.value)) : i.value; degisti(); if (ops.sonra) ops.sonra(); });
  return el("div", { class: "alan" }, [el("label", { for: i.id, text: et }), i, ops.yard ? el("small", { text: ops.yard }) : null]);
}
function secim(o, k, et, sec, sonra) {
  var s = el("select", { id: "s-" + Math.random().toString(36).slice(2) });
  Object.keys(sec).forEach(function (x) { s.appendChild(el("option", { value: x, text: sec[x] })); });
  s.value = o[k] || Object.keys(sec)[0];
  s.addEventListener("change", function () { o[k] = s.value; degisti(); if (sonra) sonra(); });
  return el("div", { class: "alan" }, [el("label", { for: s.id, text: et }), s]);
}
function satirlar(o, k, et, yard, sonra) { // dizi ↔ her satıra bir değer
  var t = el("textarea", { id: "t-" + Math.random().toString(36).slice(2) }); t.value = (o[k] || []).join("\n");
  t.addEventListener("input", function () { o[k] = t.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 30); degisti(); if (sonra) sonra(); });
  return el("div", { class: "alan" }, [el("label", { for: t.id, text: et }), t, yard ? el("small", { text: yard }) : null]);
}
function fiyatGirdi(u, key, etiket) {
  var i = el("input", { type: "number", inputmode: "numeric", min: "0", step: "1", "aria-label": (u.ad + " " + etiket) });
  i.value = u.fiyat[key] == null ? "" : u.fiyat[key];
  i.addEventListener("input", function () { u.fiyat[key] = i.value === "" ? 0 : Math.max(0, Math.round(+i.value)); degisti(); });
  return el("div", { class: "fiyat-satir" }, [el("span", { text: etiket.replace("|", " · ") }), el("div", { class: "tl" }, [i])]);
}

/* ---------- EKRANLAR ---------- */
function ciz() {
  var e = $("#ekran"); e.innerHTML = "";
  $$(".alt-nav button").forEach(function (b) { if (b.dataset.sekme === sekme && !duzenlenen) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  if (duzenlenen) return urunDuzenle(e, duzenlenen);
  ({ fiyat: ekranFiyat, urun: ekranUrun, dukkan: ekranDukkan, ana: ekranAna, diger: ekranDiger })[sekme](e);
  e.focus({ preventScroll: true }); window.scrollTo(0, 0);
}
function ekranFiyat(e) {
  e.appendChild(el("h2", { text: "Fiyatlar" }));
  e.appendChild(el("p", { class: "aciklama", text: "Rakamı değiştirip alttaki “Kaydet”e basın. 0 yazarsanız sitede “Teklif ile” görünür." }));
  Object.keys(KAT).forEach(function (kat) {
    var liste = veri.urunler.filter(function (u) { return u.kat === kat; });
    if (!liste.length) return;
    e.appendChild(el("p", { class: "grup-baslik", text: KAT[kat] }));
    liste.forEach(function (u) {
      u.fiyat = u.fiyat || {};
      var k = el("div", { class: "kart" }, [el("h3", {}, [el("span", { text: u.ad }), u.durum !== "satista" ? el("span", { class: "cip " + u.durum, text: DURUM[u.durum] || "" }) : null])]);
      kombin(u).forEach(function (key) { k.appendChild(fiyatGirdi(u, key, key)); });
      e.appendChild(k);
    });
  });
}
function ekranUrun(e) {
  e.appendChild(el("h2", { text: "Ürünler" }));
  var ara = el("input", { type: "search", placeholder: "Ürün ara…", "aria-label": "Ürün ara" });
  var yeni = el("button", { class: "dg pir", type: "button", text: "+ Yeni ürün ekle", onclick: function () {
    var u = { id: "", ad: "", kat: "yorgan", dolgu: "yun", durum: "satista", el: true, ozet: "", secim: [{ ad: "Ölçü", d: ["Tek kişilik · 155×215 cm", "Çift kişilik · 195×215 cm"] }], fiyat: {}, ozellik: {}, kimler: [], bakim: "yun", gorsel: "", yeni: true };
    veri.urunler.unshift(u); duzenlenen = u; degisti(); ciz();
  } });
  e.appendChild(el("div", { class: "ara" }, [ara]));
  e.appendChild(yeni);
  var kap = el("div", { style: "margin-top:12px" }); e.appendChild(kap);
  function listele() {
    kap.innerHTML = ""; var q = ara.value.toLocaleLowerCase("tr").trim();
    veri.urunler.filter(function (u) { return !q || (u.ad || "").toLocaleLowerCase("tr").indexOf(q) > -1; }).forEach(function (u) {
      var src = gorselUrl(u, true);
      kap.appendChild(el("button", { class: "liste-urun", type: "button", onclick: function () { duzenlenen = u; ciz(); } }, [
        src ? el("img", { src: src, alt: "", loading: "lazy" }) : el("span", { class: "bos" }),
        el("span", {}, [el("b", { text: u.ad || "(adsız ürün)" }), el("small", { text: (KAT[u.kat] || "") + " · " + (DOLGU[u.dolgu] || "") })]),
        el("span", { class: "cip " + u.durum, text: u.durum === "satista" ? "Satışta" : u.durum === "sor" ? "Sorun" : "Gizli" }),
      ]));
    });
  }
  ara.addEventListener("input", listele); listele();
}
function urunDuzenle(e, u) {
  u.fiyat = u.fiyat || {}; u.ozellik = u.ozellik || {}; u.secim = u.secim || [];
  e.appendChild(el("button", { class: "geri", type: "button", text: "← Ürün listesine dön", onclick: function () { duzenlenen = null; sekme = "urun"; ciz(); } }));
  e.appendChild(el("h2", { text: u.ad || "Yeni ürün" }));
  // fotoğraf
  var foto = el("div", { class: "kart" }), onizle = gorselUrl(u) ? el("img", { src: gorselUrl(u, true), alt: "Ürün fotoğrafı" }) : el("span", { class: "bos", text: "Fotoğraf yok" });
  var dosya = el("input", { type: "file", accept: "image/*", id: "foto-girdi" });
  var fmsj = el("small", { text: "Telefonda “Fotoğraf çek” ya da galeriden seçin. Otomatik küçültülür." });
  dosya.addEventListener("change", function () {
    var f = dosya.files[0]; if (!f) return; fmsj.textContent = "Yükleniyor…";
    var ad = (u.id || slug(u.ad)) + "-" + Date.now().toString(36);
    Promise.all([kucult(f, 1400), kucult(f, 640)]).then(function (b) { return VK.yukle(ad + ".webp", b[0]).then(function (url) { return VK.yukle(ad + "-s.webp", b[1]).then(function () { return url; }); }); })
      .then(function (url) { u.gorsel = url; degisti(); fmsj.textContent = "Fotoğraf eklendi. Kaydet'e basmayı unutmayın."; var y = el("img", { src: gorselUrl(u, true), alt: "Ürün fotoğrafı" }); onizle.replaceWith(y); onizle = y; })
      .catch(function (x) { fmsj.textContent = "Olmadı: " + (x.message || x); });
  });
  foto.appendChild(el("div", { class: "foto" }, [onizle, el("div", {}, [el("label", { class: "dg", for: "foto-girdi", text: "📷 Fotoğraf çek / seç" }), dosya, fmsj])]));
  e.appendChild(foto);
  // temel bilgiler
  var tem = el("div", { class: "kart" });
  tem.appendChild(metin(u, "ad", "Ürün adı", { max: 80 }));
  tem.appendChild(secim(u, "kat", "Kategori", KAT, function () { u.aile = AILE[u.kat] && u.dolgu !== "diger" ? AILE[u.kat] : undefined; }));
  tem.appendChild(secim(u, "dolgu", "Dolgu", DOLGU));
  tem.appendChild(metin(u, "ozet", "Kısa açıklama", { uzun: true, max: 220, yard: "Ürün kartında ve sayfanın başında görünür (1–2 cümle)." }));
  var dur = el("div", { class: "alan" }, [el("label", { text: "Durum" })]);
  var sec = el("div", { class: "secenekler" });
  Object.keys(DURUM).forEach(function (d) {
    var r = el("input", { type: "radio", name: "durum", value: d }); r.checked = (u.durum || "satista") === d;
    r.addEventListener("change", function () { u.durum = d; degisti(); });
    sec.appendChild(el("label", { class: "secenek" }, [r, el("span", { text: DURUM[d] })]));
  });
  dur.appendChild(sec); tem.appendChild(dur);
  tem.appendChild(secim(u, "stok", "Stok rozeti", STOK));
  [["el", "Dükkânda dikilir (rozet çıkar)"], ["ozel", "Ölçüye özel üretilir (iade yok uyarısı çıkar)"]].forEach(function (x) {
    var c = el("input", { type: "checkbox" }); c.checked = !!u[x[0]]; c.addEventListener("change", function () { u[x[0]] = c.checked; degisti(); });
    tem.appendChild(el("label", { class: "secenek", style: "margin-bottom:8px" }, [c, el("span", { text: x[1] })]));
  });
  e.appendChild(tem);
  // seçenekler ve fiyatlar
  var sk = el("div", { class: "kart" }, [el("h3", { text: "Ölçüler ve fiyatlar" })]);
  if (!u.secim[0]) u.secim[0] = { ad: "Ölçü", d: [] };
  var g1 = u.secim[0], g2 = u.secim[1] || { ad: "", d: [] };
  var fiyatKap = el("div");
  function fiyatlariCiz() {
    u.secim = [g1].concat(g2.ad && g2.d.length ? [g2] : []);
    var anahtarlar = kombin(u), yeniF = {};
    anahtarlar.forEach(function (k) { yeniF[k] = u.fiyat[k] != null ? u.fiyat[k] : 0; }); u.fiyat = yeniF;
    fiyatKap.innerHTML = ""; anahtarlar.forEach(function (k) { fiyatKap.appendChild(fiyatGirdi(u, k, k)); });
    if (!anahtarlar.length) fiyatKap.appendChild(el("p", { class: "aciklama", text: "Önce en az bir ölçü yazın." }));
  }
  sk.appendChild(metin(g1, "ad", "Birinci seçim adı", { max: 30, yard: "Genelde “Ölçü”." }));
  sk.appendChild(satirlar(g1, "d", "Seçenekler (her satıra bir tane)", "Örnek: Tek kişilik · 155×215 cm", fiyatlariCiz));
  sk.appendChild(metin(g2, "ad", "İkinci seçim adı (isteğe bağlı)", { max: 30, yard: "Örnek: “Kumaş”. Boş bırakırsanız kullanılmaz.", sonra: fiyatlariCiz }));
  sk.appendChild(satirlar(g2, "d", "İkinci seçim seçenekleri", "Örnek: Saten / Pamuklu", fiyatlariCiz));
  sk.appendChild(el("p", { class: "grup-baslik", text: "Fiyatlar (TL, KDV dahil)" })); sk.appendChild(fiyatKap);
  e.appendChild(sk); fiyatlariCiz();
  // ayrıntılar
  var ay = el("div", { class: "kart" }, [el("h3", { text: "Ayrıntılar (isteğe bağlı)" })]);
  var oz = { metin: Object.keys(u.ozellik).map(function (k) { return k + ": " + u.ozellik[k]; }).join("\n") };
  var ozT = metin(oz, "metin", "Özellikler (her satıra “Başlık: değer”)", { uzun: true, max: 2000, yard: "Örnek: Dolgu: Doğal koyun yünü", sonra: function () {
    var o = {}; oz.metin.split("\n").forEach(function (s) { var i = s.indexOf(":"); if (i > 0) o[s.slice(0, i).trim().slice(0, 40)] = s.slice(i + 1).trim().slice(0, 200); }); u.ozellik = o;
  } });
  ay.appendChild(ozT);
  ay.appendChild(satirlar(u, "kimler", "Kimler için (her satıra bir madde)"));
  ay.appendChild(metin(u, "uyari", "“Bilmeniz gereken” notu", { uzun: true, max: 300 }));
  ay.appendChild(secim(u, "bakim", "Bakım bilgisi", BAKIM));
  ay.appendChild(metin(u, "gorselNot", "Fotoğraf altı yazısı", { max: 80, yard: "Örnek: Dükkândan: yün yorgan" }));
  e.appendChild(ay);
  // sil
  e.appendChild(el("button", { class: "dg sil", type: "button", text: "Bu ürünü sil", onclick: function () {
    if (!confirm("“" + (u.ad || "Bu ürün") + "” silinsin mi? Kaydettikten sonra sitede görünmez. (Geri almak için Diğer → Geçmiş)")) return;
    veri.urunler.splice(veri.urunler.indexOf(u), 1); duzenlenen = null; sekme = "urun"; degisti(); ciz(); toast("Silindi. Kalıcı olması için Kaydet'e basın.");
  } }));
}
function ekranDukkan(e) {
  var i = veri.isletme, a = veri.ayar;
  e.appendChild(el("h2", { text: "Dükkân bilgileri" }));
  var k1 = el("div", { class: "kart" }, [el("h3", { text: "İletişim" })]);
  k1.appendChild(metin(i, "tel", "Telefon (sitede görünen)", { tip: "tel", im: "tel", max: 20 }));
  k1.appendChild(metin(i, "wa", "WhatsApp numarası", { im: "numeric", max: 14, yard: "90 ile başlayan rakamlar, boşluksuz. Örnek: 905327262412" }));
  k1.appendChild(metin(i, "eposta", "E-posta", { tip: "email", im: "email", max: 80 }));
  k1.appendChild(metin(i, "odeme", "Ödeme yolları (sitede görünür)", { max: 160, yard: "Örnek: Nakit, havale/EFT ve dükkânda POS ile kredi/banka kartı" }));
  k1.appendChild(metin(i, "saatler", "Çalışma saatleri", { uzun: true, max: 200, yard: "Örnek: Pazartesi–Cumartesi 09:00–19:00, Pazar kapalı" }));
  k1.appendChild(metin(i, "adres", "Adres", { max: 120 }));
  k1.appendChild(el("div", { class: "iki" }, [metin(i, "ilce", "İlçe", { max: 40 }), metin(i, "il", "İl", { max: 40 })]));
  e.appendChild(k1);
  var k2 = el("div", { class: "kart" }, [el("h3", { text: "Kargo" })]);
  k2.appendChild(el("div", { class: "iki" }, [metin(a, "kargoUcret", "Kargo ücreti (TL)", { tip: "number", im: "numeric" }), metin(a, "kargoEsik", "Bu tutardan sonra ücretsiz (TL)", { tip: "number", im: "numeric" })]));
  e.appendChild(k2);
  var k3 = el("div", { class: "kart" }, [el("h3", { text: "Ödeme ve yasal bilgiler" })]);
  k3.appendChild(metin(a, "iban", "IBAN (havale için)", { max: 40, yard: "Ödeme sayfasında havale seçilince görünür." }));
  k3.appendChild(metin(a, "hesapAdi", "Hesap sahibi adı", { max: 80 }));
  k3.appendChild(metin(a, "unvan", "Ticari unvan / ad soyad", { max: 120, yard: "Mesafeli satış sözleşmesinde görünür." }));
  k3.appendChild(el("div", { class: "iki" }, [metin(a, "vergiDairesi", "Vergi dairesi", { max: 60 }), metin(a, "vergiNo", "Vergi no", { im: "numeric", max: 20 })]));
  k3.appendChild(metin(a, "mersis", "MERSİS / esnaf sicil no (varsa)", { max: 40 }));
  e.appendChild(k3);
}
function ekranAna(e) {
  var s = veri.anasayfa; s.duyuru = s.duyuru || ["", "", ""]; s.one = s.one || [];
  e.appendChild(el("h2", { text: "Ana sayfa yazıları" }));
  var k = el("div", { class: "kart" });
  k.appendChild(metin(s, "ustBaslik", "Küçük üst yazı", { max: 80 }));
  k.appendChild(metin(s, "baslik", "Büyük başlık (1. satır)", { max: 60 }));
  k.appendChild(metin(s, "baslikVurgu", "Büyük başlık (2. satır, altın renkli)", { max: 60 }));
  k.appendChild(metin(s, "giris", "Tanıtım paragrafı", { uzun: true, max: 500 }));
  k.appendChild(metin(s, "kabiliyet", "Vurgulu bant yazısı", { max: 120, yard: "Ana sayfada ve ürünler sayfasında görünür." }));
  e.appendChild(k);
  var d = el("div", { class: "kart" }, [el("h3", { text: "En üstteki ince şerit (3 kısa yazı)" })]);
  [0, 1, 2].forEach(function (n) { var o = { v: s.duyuru[n] || "" }; d.appendChild(metin(o, "v", (n + 1) + ". yazı", { max: 60, sonra: function () { s.duyuru[n] = o.v; } })); });
  e.appendChild(d);
  var o = el("div", { class: "kart" }, [el("h3", { text: "Öne çıkan ürünler (en çok 6)" })]);
  veri.urunler.filter(function (u) { return u.durum !== "gizli" && u.id; }).forEach(function (u) {
    var c = el("input", { type: "checkbox" }); c.checked = s.one.indexOf(u.id) > -1;
    c.addEventListener("change", function () { var i = s.one.indexOf(u.id); if (c.checked && i < 0) { if (s.one.length >= 6) { c.checked = false; toast("En çok 6 ürün seçilebilir."); return; } s.one.push(u.id); } if (!c.checked && i > -1) s.one.splice(i, 1); degisti(); });
    o.appendChild(el("label", { class: "secenek", style: "margin-bottom:8px" }, [c, el("span", { text: u.ad })]));
  });
  e.appendChild(o);
}
function ekranDiger(e) {
  e.appendChild(el("h2", { text: "Diğer" }));
  // geçmiş
  var g = el("div", { class: "kart" }, [el("h3", { text: "Son kayıtlar (geri al)" }), el("p", { class: "aciklama", text: "Yanlış bir şey kaydettiyseniz önceki hâli açın, sonra Kaydet'e basın." })]);
  var ul = el("ul", { class: "gecmis" }, [el("li", { text: "Yükleniyor…" })]); g.appendChild(ul); e.appendChild(g);
  VK.gecmis().then(function (l) {
    ul.innerHTML = ""; if (!l.length) ul.appendChild(el("li", { text: "Henüz önceki kayıt yok." }));
    l.forEach(function (x) {
      ul.appendChild(el("li", {}, [el("span", { text: new Date(x.zaman).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" }) }), el("button", { class: "dg kucuk", type: "button", text: "Bu hâli aç", onclick: function () {
        if (kirli && !confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam?")) return;
        veri = tamamla(JSON.parse(JSON.stringify(x.veri))); degisti(); sekme = "fiyat"; ciz(); toast("Önceki hâl açıldı. Sitede görünmesi için Kaydet'e basın.");
      } })]));
    });
  }).catch(function () { ul.innerHTML = ""; ul.appendChild(el("li", { text: "Geçmiş okunamadı." })); });
  // hesap
  var h = el("div", { class: "kart" }, [el("h3", { text: "Şifrem" }), el("p", { class: "aciklama", text: "Bir sonraki girişte e-posta bağlantısı beklemeden şifreyle girebilmek için kendi şifrenizi belirleyin (en az 8 karakter)." })]);
  var s1 = el("input", { type: "password", autocomplete: "new-password", "aria-label": "Yeni şifre", placeholder: "Yeni şifre" });
  var s2 = el("input", { type: "password", autocomplete: "new-password", "aria-label": "Yeni şifre (tekrar)", placeholder: "Yeni şifre (tekrar)", style: "margin-top:8px" });
  h.appendChild(s1); h.appendChild(s2);
  h.appendChild(el("button", { class: "dg", type: "button", style: "margin-top:10px", text: "Şifremi kaydet", onclick: function () {
    if (YEREL) return toast("Yerel testte şifre yok.");
    if (s1.value.length < 8) return toast("Şifre en az 8 karakter olmalı."); if (s1.value !== s2.value) return toast("İki şifre aynı değil.");
    sb.auth.updateUser({ password: s1.value }).then(function (r) { s1.value = s2.value = ""; toast(r.error ? "Olmadı: " + r.error.message : "Şifreniz kaydedildi."); });
  } }));
  e.appendChild(h);
  // kullanıcılar
  var k = el("div", { class: "kart" }, [el("h3", { text: "Panele girebilecek kişiler" }), el("p", { class: "aciklama", text: "Yeni kişinin e-postasını ekleyin. O kişi giriş ekranında “İlk kez mi giriyorsunuz?”a basar, e-postasına gelen bağlantıyla girer ve şifresini kendisi belirler." })]);
  var kl = el("ul", { class: "gecmis" }); k.appendChild(kl);
  var ye = el("input", { type: "email", inputmode: "email", placeholder: "ornek@gmail.com", "aria-label": "Eklenecek e-posta" });
  k.appendChild(ye);
  k.appendChild(el("button", { class: "dg", type: "button", style: "margin-top:8px", text: "Kişiyi ekle", onclick: function () {
    var m = ye.value.trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(m)) return toast("Geçerli bir e-posta yazın.");
    if (YEREL) return toast("Yerel testte kullanıcı eklenmez.");
    sb.from("site_davet").insert({ site: SITE, email: m }).then(function (r) { if (r.error) return toast("Olmadı: " + r.error.message); ye.value = ""; kisiler(); toast(m + " eklendi."); });
  } }));
  e.appendChild(k);
  function kisiler() {
    if (YEREL) { kl.innerHTML = ""; kl.appendChild(el("li", { text: "Yerel test modu" })); return; }
    sb.from("site_davet").select("email,kullanildi").eq("site", SITE).order("email").then(function (r) {
      kl.innerHTML = ""; (r.data || []).forEach(function (x) {
        kl.appendChild(el("li", {}, [el("span", { text: x.email + (x.kullanildi ? " ✓" : " (henüz girmedi)") }), el("button", { class: "dg kucuk sil", type: "button", text: "Çıkar", onclick: function () {
          if (!confirm(x.email + " davet listesinden çıkarılsın mı?")) return;
          sb.from("site_davet").delete().eq("site", SITE).eq("email", x.email).then(function () { kisiler(); });
        } })]));
      });
      if (!(r.data || []).length) kl.appendChild(el("li", { text: "Davet edilmiş kişi yok." }));
    });
  }
  kisiler();
}

/* ---------- kaydet ---------- */
function tamamla(v) {
  v.isletme = v.isletme || {}; v.ayar = v.ayar || {}; v.anasayfa = v.anasayfa || {}; v.urunler = v.urunler || [];
  v.urunler.forEach(function (u) { u.durum = u.durum || "satista"; u.fiyat = u.fiyat || {}; u.secim = u.secim || []; });
  return v;
}
function kaydet() {
  var b = $("#kaydet");
  // yeni ürünlere kalıcı kimlik ver
  var var_ = {}; veri.urunler.forEach(function (u) { if (u.id) var_[u.id] = 1; });
  veri.urunler.forEach(function (u) { if (!u.id) { var id = slug(u.ad), n = 2; while (var_[id]) id = slug(u.ad) + "-" + n++; u.id = id; var_[id] = 1; } delete u.yeni; if (!u.aile && AILE[u.kat] && u.dolgu !== "diger" && u.dolgu !== "sunger") u.aile = AILE[u.kat]; });
  var h = dogrula(veri);
  if (h.length) { durum("Kaydedilmedi: " + h[0], "hata"); toast(h[0]); return; }
  b.disabled = true; durum("Kaydediliyor…");
  VK.yaz(veri).then(function () {
    kirli = false; durum("Kaydedildi ✓ Sitede hemen görünür.", "ok");
    toast("Kaydedildi ✓");
    ciz();
  }).catch(function (x) { b.disabled = false; durum("Kaydedilemedi: " + (x.message || x), "hata"); });
}

/* ---------- açılış ---------- */
function uygulamaAc() {
  $("#giris").hidden = true; $("#uyg").hidden = false; durum("Yükleniyor…");
  VK.oku().then(function (v) { veri = tamamla(v); kirli = false; durum("Değişiklik yok"); $("#kaydet").disabled = true; ciz(); })
    .catch(function (x) { durum("Veri okunamadı: " + (x.message || x), "hata"); });
}
function yetkiKontrol(u) {
  kullanici = u;
  // davet listesindeyse üyeliği tamamla (ilk giriş); sonra yazma yetkisini sor
  return sb.rpc("site_davet_kabul", { p_site: SITE }).then(function () { return sb.rpc("site_yazabilir", { p_site: SITE }); }).then(function (r) {
    if (r.data === true) return uygulamaAc();
    sb.auth.signOut(); girisGoster("Bu e-posta için yetki yok. Dükkân sahibinden ya da Dijitabela'dan sizi eklemesini isteyin.", "hata");
  });
}
function girisGoster(m, s) { $("#uyg").hidden = true; $("#giris").hidden = false; var g = $("#gMsj"); g.textContent = m || ""; g.className = "msj " + (s || ""); }
$("#girisForm").addEventListener("submit", function (ev) {
  ev.preventDefault(); var e = $("#gE").value.trim(), s = $("#gS").value;
  if (!e || !s) return girisGoster("E-posta ve şifre yazın ya da “Şifresiz giriş bağlantısı”nı kullanın.", "hata");
  girisGoster("Giriş yapılıyor…");
  sb.auth.signInWithPassword({ email: e, password: s }).then(function (r) { if (r.error) return girisGoster("E-posta ya da şifre yanlış. Birkaç denemeden sonra kısa süre beklemeniz gerekebilir.", "hata"); yetkiKontrol(r.data.user); });
});
function baglantiGonder(ilk) {
  var e = $("#gE").value.trim().toLowerCase(); if (!/^[^@\s]+@[^@\s]+$/.test(e)) return girisGoster("Önce e-posta adresinizi yazın.", "hata");
  girisGoster("Gönderiliyor…");
  var git = function (yeni) { return sb.auth.signInWithOtp({ email: e, options: { shouldCreateUser: yeni, emailRedirectTo: location.origin + location.pathname } }); };
  (ilk ? sb.rpc("site_davet_var", { p_site: SITE, p_email: e }).then(function (r) { if (r.data !== true) throw new Error("Bu e-posta davet listesinde yok. Dükkân sahibinden sizi eklemesini isteyin."); return git(true); }) : git(false))
    .then(function (r) { if (r && r.error) throw r.error; girisGoster("E-postanıza giriş bağlantısı gönderildi. Bağlantıya bu telefonda dokunun.", "iyi"); })
    .catch(function (x) { girisGoster(x.message || "Gönderilemedi.", "hata"); });
}
$("#gLink").addEventListener("click", function () { baglantiGonder(false); });
$("#gIlk").addEventListener("click", function () { baglantiGonder(true); });
$("#cikis").addEventListener("click", function () { if (kirli && !confirm("Kaydedilmemiş değişiklikler var. Çıkılsın mı?")) return; kirli = false; if (YEREL) return location.reload(); sb.auth.signOut().then(function () { location.reload(); }); });
$("#kaydet").addEventListener("click", kaydet);
$$(".alt-nav button").forEach(function (b) { b.addEventListener("click", function () { duzenlenen = null; sekme = b.dataset.sekme; ciz(); }); });

if (YEREL) { $("#uyari").hidden = false; $("#uyari").textContent = "YEREL TEST MODU — değişiklikler yalnız bu bilgisayara yazılır."; uygulamaAc(); }
else sb.auth.getSession().then(function (r) { var s = r.data && r.data.session; if (s) yetkiKontrol(s.user); else girisGoster(); });
if (sb) sb.auth.onAuthStateChange(function (ev, s) { if (ev === "SIGNED_IN" && s && $("#uyg").hidden && !kullanici) yetkiKontrol(s.user); });
})();
