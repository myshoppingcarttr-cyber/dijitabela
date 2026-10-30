/* bensay · site yönetim paneli (30 Eki 2026)
   Giriş: Supabase Auth (e-posta + şifre ya da şifresiz bağlantı). Yazma yetkisini Supabase RLS denetler (site_yazabilir):
   yalnız bensay işletmesinin üyeleri ve Dijitabela yöneticileri kaydedebilir. İstemcide yalnız herkese açık (publishable) anahtar var.
   Veri: public.site_icerik (site='bensay').veri — tek JSON belge. Görseller: storage 'site-gorsel' / bensay/… */
(function () {
"use strict";
var SB_URL = "https://ctlbhwbccqgwmtqbwtfs.supabase.co", SB_KEY = "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy", SITE = "bensay", BUCKET = "site-gorsel";
var TASLAK = "bn_yonetim_taslak_v2";
var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true } });
var R = window.BNRender, $ = function (s, k) { return (k || document).querySelector(s); };
var ic = null, kirli = false, dbHazir = false, yazabilir = false, yonetici = false, sekme = "genel", sayfaSec = "index", acik = {};

/* ---------- yardımcılar ---------- */
function el(etiket, ozel, cocuk) {
  var e = document.createElement(etiket);
  if (ozel) Object.keys(ozel).forEach(function (k) {
    if (k === "class") e.className = ozel[k]; else if (k === "text") e.textContent = ozel[k]; else if (k === "html") e.innerHTML = ozel[k];
    else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), ozel[k]); else if (ozel[k] != null && ozel[k] !== false) e.setAttribute(k, ozel[k] === true ? "" : ozel[k]);
  });
  (cocuk || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return e;
}
function toast(m) { var t = el("div", { class: "toast", role: "status", text: m }); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
function yeniId(on) { return (on || "x") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function trAd(o) { return typeof o === "string" ? o : (o && (o.tr || o.en)) || ""; }
function L(tr) { return { tr: tr || "", en: "" }; }
function degisti() { kirli = true; durum(); onizGonder(); try { localStorage.setItem(TASLAK, JSON.stringify({ zaman: Date.now(), ic: ic })); } catch (e) {} }
function durum(m, sinif) {
  var d = $("#durum"); $("#kaydet").disabled = !kirli || !yazabilir;
  if (m) { d.textContent = m; d.className = "durum " + (sinif || ""); return; }
  d.textContent = kirli ? (yazabilir ? "Kaydedilmemiş değişiklik var" : "Değişiklik var (kaydetme kapalı)") : (yazabilir ? "Kaydedildi" : "Salt önizleme"); d.className = "durum " + (kirli ? "kirli" : "ok");
}
window.addEventListener("beforeunload", function (e) { if (kirli) { e.preventDefault(); e.returnValue = ""; } });

/* ---------- alan oluşturucular ---------- */
// her alan: (nesne, anahtar, tanım) → DOM; değişince nesne[anahtar] güncellenir ve degisti() çağrılır
function alan(et, ic_, yard) { return el("div", { class: "alan" }, [et ? el("span", { class: "et", text: et }) : null, ic_, yard ? el("p", { class: "yard", text: yard }) : null]); }
function fMetin(o, k, et, ops) {
  ops = ops || {};
  var i = el(ops.uzun ? "textarea" : "input", { type: ops.tip || "text", placeholder: ops.ph || "", oninput: function () { o[k] = ops.tip === "number" ? (i.value === "" ? 0 : Number(i.value)) : i.value; degisti(); } });
  if (ops.tip === "number") { i.step = ops.adim || "any"; if (ops.min != null) i.min = ops.min; }
  i.value = o[k] == null ? "" : o[k];
  return alan(et, i, ops.yard);
}
function fCift(o, k, et, ops) {
  ops = ops || {}; if (!o[k] || typeof o[k] !== "object") o[k] = { tr: typeof o[k] === "string" ? o[k] : "", en: "" };
  var v = o[k];
  function g(d) {
    var i = el(ops.uzun ? "textarea" : "input", { type: "text", lang: d, "aria-label": et + (d === "en" ? " (İngilizce)" : ""), placeholder: d === "en" ? "İngilizce (boşsa Türkçesi görünür)" : (ops.ph || ""),
      oninput: function () { v[d] = i.value; degisti(); } });
    i.value = v[d] || ""; return el("div", { class: "dil " + d }, [el("span", { text: d.toUpperCase() }), i]);
  }
  return alan(et, el("div", { class: "cift" }, [g("tr"), g("en")]), ops.yard);
}
function fBool(o, k, et, yard) {
  var i = el("input", { type: "checkbox", onchange: function () { o[k] = i.checked; degisti(); } }); i.checked = !!o[k];
  return alan(null, el("label", { class: "anahtar" }, [i, et]), yard);
}
function fSecim(o, k, et, sec, yard) {
  var s = el("select", { onchange: function () { o[k] = s.value; degisti(); } });
  sec.forEach(function (x) { var op = el("option", { value: x[0], text: x[1] }); if (String(o[k] == null ? "" : o[k]) === String(x[0])) op.selected = true; s.appendChild(op); });
  return alan(et, s, yard);
}
function fRenk(o, k, et) {
  var t = el("input", { type: "text", maxlength: 7 }), c = el("input", { type: "color", "aria-label": et });
  t.value = o[k] || ""; c.value = /^#[0-9a-f]{6}$/i.test(o[k] || "") ? o[k] : "#000000";
  c.oninput = function () { t.value = c.value; o[k] = c.value; degisti(); };
  t.oninput = function () { if (/^#[0-9a-f]{6}$/i.test(t.value)) { c.value = t.value; o[k] = t.value; degisti(); } };
  return alan(et, el("div", { class: "renk" }, [c, t]));
}
var SAYFA_LINK = function () { return Object.keys(R.SAYFALAR).map(function (id) { return R.SAYFALAR[id].dosya; }).concat(["iletisim.html#kesif", "maliyet.html#hesap", "hizmetler.html#sektorler", "index.html#projeler"]); };
function fLink(o, k, et) {
  var dl = "dl-" + Math.random().toString(36).slice(2);
  var i = el("input", { type: "text", list: dl, oninput: function () { o[k] = i.value.trim(); degisti(); } }); i.value = o[k] || "";
  var d = el("datalist", { id: dl }); SAYFA_LINK().forEach(function (h) { d.appendChild(el("option", { value: h })); });
  return alan(et, el("div", null, [i, d]), "Sitedeki bir sayfa seçin (ör. iletisim.html#kesif) ya da tam adres yazın (https://…).");
}

/* görsel yükleme: tarayıcıda küçült (en çok 2000 px) → Supabase Storage → herkese açık adres */
function kucult(dosya) {
  return new Promise(function (coz) {
    if (!/^image\/(jpeg|png|webp)$/.test(dosya.type)) return coz(dosya);
    var img = new Image(), u = URL.createObjectURL(dosya);
    img.onload = function () {
      var en = img.naturalWidth, boy = img.naturalHeight, m = 2000 / Math.max(en, boy);
      if (m >= 1 && dosya.size < 1.5e6) { URL.revokeObjectURL(u); return coz(dosya); }
      m = Math.min(1, m); var c = document.createElement("canvas"); c.width = Math.round(en * m); c.height = Math.round(boy * m);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      var tip = dosya.type === "image/png" ? "image/png" : "image/jpeg";
      c.toBlob(function (b) { coz(b ? new File([b], dosya.name.replace(/\.\w+$/, tip === "image/png" ? ".png" : ".jpg"), { type: tip }) : dosya); }, tip, .86);
    };
    img.onerror = function () { URL.revokeObjectURL(u); coz(dosya); }; img.src = u;
  });
}
function yukle(dosya) {
  if (!dbHazir) { toast("Görsel yükleme, veritabanı kurulumu tamamlanınca açılır."); return Promise.reject(0); }
  if (dosya.size > 15e6) { toast("Dosya çok büyük (en çok 15 MB)."); return Promise.reject(0); }
  durum("Görsel yükleniyor…");
  return kucult(dosya).then(function (f) {
    var uz = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, ""), yol = SITE + "/" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7) + "." + uz;
    return sb.storage.from(BUCKET).upload(yol, f, { contentType: f.type, cacheControl: "31536000", upsert: false }).then(function (r) {
      if (r.error) { toast("Yüklenemedi: " + r.error.message); durum(); throw r.error; }
      durum(); return sb.storage.from(BUCKET).getPublicUrl(yol).data.publicUrl;
    });
  });
}
function dosyaSec(cok, cb) { var i = el("input", { type: "file", accept: "image/*" }); if (cok) i.multiple = true; i.onchange = function () { cb([].slice.call(i.files)); }; i.click(); }
function onizAdres(u) { return !u ? "" : /^(https?:|\/)/.test(u) ? u : "../" + u; }
function fGorsel(o, k, et, yard) {
  var kr = el("div", { class: "kucukresim" }), url = el("input", { type: "url", placeholder: "ya da görsel adresi (https://…)", "aria-label": et + " adresi" });
  function goster() { kr.innerHTML = ""; if (o[k]) kr.appendChild(el("img", { src: onizAdres(o[k]), alt: "" })); else kr.textContent = "görsel yok"; url.value = o[k] || ""; }
  url.onchange = function () { o[k] = url.value.trim(); goster(); degisti(); };
  var yb = el("button", { type: "button", class: "dg i kucuk", text: "Görsel yükle", onclick: function () { dosyaSec(false, function (f) { if (f[0]) yukle(f[0]).then(function (u) { o[k] = u; goster(); degisti(); }, function () {}); }); } });
  var sil = el("button", { type: "button", class: "dg sil kucuk", text: "Kaldır", onclick: function () { o[k] = ""; goster(); degisti(); } });
  goster();
  return alan(et, el("div", { class: "gorsel" }, [kr, el("div", { class: "gd" }, [el("div", { class: "sat" }, [yb, sil]), url])]), yard);
}
function fGorselListe(o, k, et) {
  if (!Array.isArray(o[k])) o[k] = []; var L_ = o[k], kap = el("div", { class: "gliste" });
  function ciz() {
    kap.innerHTML = "";
    L_.forEach(function (u, i) {
      kap.appendChild(el("div", { class: "gk" }, [el("div", { class: "kucukresim", style: "background-image:url('" + onizAdres(u).replace(/'/g, "%27") + "')" }),
        el("div", { class: "sat" }, [el("button", { type: "button", text: "←", "aria-label": "Sola", onclick: function () { if (i) { L_.splice(i - 1, 0, L_.splice(i, 1)[0]); ciz(); degisti(); } } }),
          el("button", { type: "button", text: "×", "aria-label": "Sil", onclick: function () { if (confirm("Bu görsel kaldırılsın mı?")) { L_.splice(i, 1); ciz(); degisti(); } } }),
          el("button", { type: "button", text: "→", "aria-label": "Sağa", onclick: function () { if (i < L_.length - 1) { L_.splice(i + 1, 0, L_.splice(i, 1)[0]); ciz(); degisti(); } } })])]));
    });
    kap.appendChild(el("button", { type: "button", class: "ekle-gorsel", text: "+ Görsel ekle", onclick: function () {
      dosyaSec(true, function (fs) { fs.reduce(function (p, f) { return p.then(function () { return yukle(f).then(function (u) { L_.push(u); ciz(); degisti(); }, function () {}); }); }, Promise.resolve()); });
    } }));
  }
  ciz(); return alan(et, kap, "İlk görsel kapak olarak kullanılır. Oklarla sıralayın.");
}
function fCiftListe(o, k, et, yard) {
  if (!Array.isArray(o[k])) o[k] = [];
  return fListe(o, k, et, { yeni: function () { return L(""); }, ozet: function (x) { return trAd(x) || "(boş)"; }, acikBasla: true, form: function (x, kap) { kap.appendChild(fCift({ v: x }, "v", "Metin")); } , duz: true, yard: yard });
}

/* sıralanabilir liste: sürükle-bırak + ↑↓ + göster/gizle + sil */
function fListe(o, k, et, ops) {
  if (!Array.isArray(o[k])) o[k] = []; var L_ = o[k], kap = el("div", { class: "liste" }), surulen = null, anahtar = et + ":" + k;
  function ciz() {
    kap.innerHTML = "";
    L_.forEach(function (x, i) {
      var id = anahtar + ":" + (x && x.id || i), ac = ops.duz ? true : acik[id];
      var ic_ = el("div", { class: "oge-ic" }); if (!ac) ic_.hidden = true;
      var goz = ops.goz ? el("button", { type: "button", class: "ib goz", "aria-pressed": x[ops.goz] !== false, title: "Sitede göster / gizle", text: "👁", onclick: function (e) { e.stopPropagation(); x[ops.goz] = x[ops.goz] === false; ciz(); degisti(); } }) : null;
      var bas = el("div", { class: "oge-bas", onclick: function () { if (ops.duz) return; acik[id] = !acik[id]; ciz(); } }, [
        el("span", { class: "tut", text: "⋮⋮", title: "Sürükleyip bırakın", "aria-hidden": "true" }),
        ops.duz ? null : el("span", { class: "oge-ad", html: R.esc(ops.ozet(x, i)) + (ops.alt ? "<small>" + R.esc(ops.alt(x)) + "</small>" : "") }),
        ops.duz ? el("div", { style: "flex:1" }, [ (function () { var d = el("div"); ops.form(x, d, i); return d; })() ]) : null,
        goz,
        el("button", { type: "button", class: "ib", text: "↑", "aria-label": "Yukarı taşı", onclick: function (e) { e.stopPropagation(); if (i) { L_.splice(i - 1, 0, L_.splice(i, 1)[0]); ciz(); degisti(); } } }),
        el("button", { type: "button", class: "ib", text: "↓", "aria-label": "Aşağı taşı", onclick: function (e) { e.stopPropagation(); if (i < L_.length - 1) { L_.splice(i + 1, 0, L_.splice(i, 1)[0]); ciz(); degisti(); } } }),
        ops.silinmez && ops.silinmez(x) ? null : el("button", { type: "button", class: "ib", text: "🗑", "aria-label": "Sil", onclick: function (e) { e.stopPropagation(); if (confirm("“" + (ops.ozet(x, i) || "Bu öge") + "” silinsin mi?")) { L_.splice(i, 1); ciz(); degisti(); } } })
      ]);
      if (!ops.duz && ac) ops.form(x, ic_, i);
      var oge = el("div", { class: "oge" + (ops.goz && x[ops.goz] === false ? " gizli" : ""), draggable: "true" }, [bas, ops.duz ? null : ic_]);
      oge.addEventListener("dragstart", function (e) { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName) && oge.contains(document.activeElement)) { e.preventDefault(); return; } surulen = i; oge.classList.add("surukle"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(i)); } catch (er) {} });
      oge.addEventListener("dragend", function () { oge.classList.remove("surukle"); });
      oge.addEventListener("dragover", function (e) { if (surulen == null) return; e.preventDefault(); oge.classList.add("uzerinde"); });
      oge.addEventListener("dragleave", function () { oge.classList.remove("uzerinde"); });
      oge.addEventListener("drop", function (e) { e.preventDefault(); oge.classList.remove("uzerinde"); if (surulen == null || surulen === i) return; L_.splice(i, 0, L_.splice(surulen, 1)[0]); surulen = null; ciz(); degisti(); });
      kap.appendChild(oge);
    });
    if (ops.ekle !== false) {
      var sat = el("div", { class: "ekle-sat" });
      if (ops.ekleSecim) { var s = el("select", { "aria-label": "Eklenecek tür" }); ops.ekleSecim.forEach(function (x) { s.appendChild(el("option", { value: x[0], text: x[1] })); }); sat.appendChild(s);
        sat.appendChild(el("button", { type: "button", class: "dg i kucuk", text: "+ Ekle", onclick: function () { var y = ops.yeni(s.value); L_.push(y); if (!ops.duz) acik[anahtar + ":" + (y.id || L_.length - 1)] = true; ciz(); degisti(); } })); }
      else sat.appendChild(el("button", { type: "button", class: "dg i kucuk", text: "+ " + (ops.ekleYazi || "Yeni ekle"), onclick: function () { var y = ops.yeni(); L_.push(y); if (!ops.duz) acik[anahtar + ":" + (y.id || L_.length - 1)] = true; ciz(); degisti(); } }));
      kap.appendChild(sat);
    }
  }
  ciz();
  return alan(et, kap, ops.yard);
}

/* ---------- bölüm (section) alanları ---------- */
function bolumForm(b, kap) {
  var t = b.tip, ortak = ["kahraman", "sayfaBasi", "hizmetler", "sektorler", "projeler", "maliyet", "markalar", "surec", "sss", "ekip", "blog", "metin", "iletisim", "kesifForm", "referanslar"];
  if (/^(projeDetay|blogDetay|araclar|takip)$/.test(t)) { kap.appendChild(el("p", { class: "ac", text: "Bu bölüm sitenin işlevsel bir parçasıdır; içeriği ilgili sekmeden (Projeler / Blog) gelir. Yalnız sırası ve görünürlüğü değiştirilebilir." })); return; }
  if (t === "anaHizmet") {
    kap.appendChild(fCift(b, "etiket", "Üst etiket"));
    kap.appendChild(fSecim(b, "hizmet", "Öne çıkan hizmet", (ic.hizmetler || []).map(function (h) { return [h.id, trAd(h.baslik)]; }), "Başlık, açıklama ve maddeler Hizmetler sekmesinden gelir."));
    kap.appendChild(fGorsel(b, "gorsel", "Görsel (boşsa hizmetin görseli)"));
    return;
  }
  if (t === "cta") { kap.appendChild(fCift(b, "baslik", "Başlık")); kap.appendChild(fCift(b, "metin", "Metin", { uzun: true })); kap.appendChild(el("p", { class: "yard ac", text: "Düğmeler: Menü sekmesindeki Keşif ve Proje planla düğmeleri." })); return; }
  if (ortak.indexOf(t) > -1) {
    kap.appendChild(fCift(b, "etiket", "Üst etiket (küçük yazı)"));
    kap.appendChild(fCift(b, "baslik", t === "kahraman" || t === "sayfaBasi" ? "Ana başlık" : "Başlık"));
    kap.appendChild(fCift(b, "metin", "Açıklama", { uzun: true, yard: t === "metin" ? "Boş satır = yeni paragraf · \"## \" ile başlayan satır = ara başlık · \"- \" = madde." : null }));
  }
  if (t === "kahraman") kap.appendChild(fGorsel(b, "gorsel", "Arka plan görseli (isteğe bağlı)", "Boşsa kurumsal yeşil zemin ve çizgi ev çizimi görünür."));
  if (t === "metin") { kap.appendChild(fGorsel(b, "gorsel", "Görsel (isteğe bağlı)")); kap.appendChild(fSecim(b, "dugme", "Düğme", [["", "Düğme yok"], ["kesif", "Keşif"], ["planla", "Proje planla"]])); }
  if (t === "hizmetler") kap.appendChild(fBool(b, "sadeceDiger", "Öne çıkan hizmeti bu listede gösterme", "Ana sayfada öne çıkan hizmet ayrı bölümde gösterildiği için."));
  if (t === "projeler") { kap.appendChild(fMetin(b, "limit", "Gösterilecek proje sayısı (0 = tümü)", { tip: "number", min: 0, adim: 1 })); kap.appendChild(fBool(b, "filtre", "Kategori filtre düğmelerini göster")); }
  if (t === "blog") kap.appendChild(fMetin(b, "limit", "Gösterilecek yazı sayısı (0 = tümü)", { tip: "number", min: 0, adim: 1, yard: "Sayı verilirse ve yayında yazı yoksa bölüm gizlenir." }));
  if (t === "referanslar") kap.appendChild(el("p", { class: "yard ac", text: "Logolar Referanslar sekmesinden eklenir. Logo yokken bu bölüm sitede görünmez." }));
}

/* ---------- sekmeler ---------- */
var SEKMELER = [
  ["genel", "Marka ve renkler"], ["iletisim", "İletişim"], ["menu", "Menü ve düğmeler"], ["sayfalar", "Sayfalar ve bölümler"],
  ["hizmetler", "Hizmetler"], ["sektorler", "Sektörler"], ["projeler", "Projeler"], ["blog", "Blog"], ["referanslar", "Referanslar"],
  ["maliyet", "Maliyet hesaplayıcı"], ["markalar", "Malzeme markaları"], ["diger", "Süreç, SSS, ekip"], ["yayin", "Yayın ve geçmiş"]
];
var ONIZ_SAYFA = { projeler: "projeler", blog: "blog", maliyet: "maliyet", markalar: "maliyet", iletisim: "iletisim", referanslar: "index", hizmetler: "hizmetler", sektorler: "hizmetler", diger: "hizmetler" };
function baslikYaz(f, b, a) { f.appendChild(el("h2", { text: b })); if (a) f.appendChild(el("p", { class: "ac", text: a })); }
var CIZ = {
  genel: function (f) {
    var m = ic.marka = ic.marka || {}; m.renkler = m.renkler || {};
    baslikYaz(f, "Marka ve renkler", "Logo, logonun yanındaki alt alta yazılar ve kurumsal renkler tüm siteye uygulanır.");
    f.appendChild(fMetin(m, "ad", "Kısa marka adı")); f.appendChild(fMetin(m, "unvan", "Ünvan (alt bilgi ve başlıklarda)"));
    f.appendChild(fGorsel(m, "logo", "Logo", "Şeffaf zeminli PNG ya da SVG önerilir."));
    f.appendChild(fBool(m, "logoMaske", "Logoyu tek renk (kurumsal yeşil) göster", "Kapalıysa logo yüklendiği renkleriyle görünür."));
    f.appendChild(fCiftListe(m, "altSatirlar", "Logonun yanındaki alt alta yazılar", "Ör. MİMARLIK / İÇ MİMARLIK / TASARIM — büyük harfe otomatik çevrilir."));
    f.appendChild(el("h3", { class: "alt-baslik", text: "Kurumsal renkler" }));
    f.appendChild(fRenk(m.renkler, "yesil", "Ana renk (yeşil)")); f.appendChild(fRenk(m.renkler, "bej", "İkincil renk (bej)"));
    f.appendChild(fRenk(m.renkler, "zemin", "Sayfa zemini")); f.appendChild(fRenk(m.renkler, "yazi", "Yazı rengi"));
    f.appendChild(fCift(m, "altMetin", "Alt bilgi tanıtım cümlesi", { uzun: true }));
    ic.site = ic.site || {}; f.appendChild(fBool(ic.site, "dil2", "İngilizce dil düğmesini göster"));
  },
  iletisim: function (f) {
    var il = ic.iletisim = ic.iletisim || {};
    baslikYaz(f, "İletişim bilgileri", "Boş bırakılan alanlar sitede “eklenecek” olarak görünür.");
    f.appendChild(fMetin(il, "tel", "Telefon", { ph: "0 312 …" })); f.appendChild(fMetin(il, "wa", "WhatsApp numarası", { ph: "90532…", yard: "Ülke koduyla, boşluksuz (ör. 905321234567). Sitedeki tüm WhatsApp düğmeleri buna gider." }));
    f.appendChild(fMetin(il, "eposta", "E-posta", { tip: "email" })); f.appendChild(fMetin(il, "adres", "Açık adres", { uzun: true }));
    f.appendChild(fMetin(il, "ilce", "İlçe")); f.appendChild(fMetin(il, "sehir", "Şehir")); f.appendChild(fCift(il, "saatler", "Çalışma saatleri", { ph: "Hafta içi 09:00–18:00" }));
    f.appendChild(fMetin(il, "harita", "Google Haritalar yerleştirme adresi", { tip: "url", yard: "Google Haritalar → Paylaş → Haritayı yerleştir → src içindeki https://www.google.com/maps/embed?… adresi." }));
    f.appendChild(fMetin(il, "instagram", "Instagram adresi", { tip: "url" })); f.appendChild(fMetin(il, "linkedin", "LinkedIn adresi", { tip: "url" }));
  },
  menu: function (f) {
    baslikYaz(f, "Menü ve düğmeler", "Üst menü öğelerini sürükleyerek sıralayın, gözle gizleyin, yenisini ekleyin.");
    f.appendChild(fListe(ic, "menu", "Üst menü", { goz: "gorunur", yeni: function () { return { ad: L("Yeni sayfa"), hedef: "index.html", gorunur: true }; }, ozet: function (x) { return trAd(x.ad); }, alt: function (x) { return x.hedef; },
      form: function (x, k) { k.appendChild(fCift(x, "ad", "Menüde görünen ad")); k.appendChild(fLink(x, "hedef", "Gideceği yer")); } }));
    ic.dugmeler = ic.dugmeler || {};
    [["kesif", "“Keşif” düğmesi", "iletisim.html#kesif"], ["planla", "“Proje planla” düğmesi", "maliyet.html#hesap"]].forEach(function (d) {
      var o = ic.dugmeler[d[0]] = ic.dugmeler[d[0]] || { etiket: L(""), hedef: d[2] };
      var kt = el("div", { class: "kutu" }, [el("b", { text: d[1] })]); kt.appendChild(fCift(o, "etiket", "Yazısı")); kt.appendChild(fLink(o, "hedef", "Gideceği yer")); f.appendChild(kt);
    });
  },
  sayfalar: function (f) {
    baslikYaz(f, "Sayfalar ve bölümler", "Bir sayfa seçin; bölümleri sürükleyerek sıralayın, gözle gizleyin, açıp metin ve görsellerini düzenleyin, yeni bölüm ekleyin.");
    var s = el("select", { onchange: function () { sayfaSec = s.value; formCiz(); onizSayfa(sayfaSec); } });
    Object.keys(R.SAYFALAR).forEach(function (id) { if (ic.sayfalar[id]) { var o = el("option", { value: id, text: R.SAYFALAR[id].ad + " — " + R.SAYFALAR[id].dosya }); if (id === sayfaSec) o.selected = true; s.appendChild(o); } });
    f.appendChild(alan("Sayfa", s));
    var sy = ic.sayfalar[sayfaSec];
    var kt = el("div", { class: "kutu" }, [el("b", { text: "Arama motoru bilgileri" })]);
    kt.appendChild(fCift(sy, "baslik", "Sayfa başlığı (tarayıcı sekmesi / Google)")); kt.appendChild(fCift(sy, "aciklama", "Kısa açıklama (Google)", { uzun: true })); f.appendChild(kt);
    var tipler = Object.keys(R.BOLUM_TIPLERI).filter(function (t) { return !/^(projeDetay|blogDetay|araclar|takip)$/.test(t); }).map(function (t) { return [t, R.BOLUM_TIPLERI[t]]; });
    f.appendChild(fListe(sy, "bolumler", "Bölümler (yukarıdan aşağı sitedeki sıra)", { goz: "gorunur", ekleSecim: tipler,
      yeni: function (t) { return { id: yeniId(t), tip: t, gorunur: true, etiket: L(""), baslik: L(R.BOLUM_TIPLERI[t]), metin: L("") }; },
      ozet: function (b) { return trAd(b.baslik) || trAd(b.etiket) || R.BOLUM_TIPLERI[b.tip] || b.tip; }, alt: function (b) { return R.BOLUM_TIPLERI[b.tip] || b.tip; },
      silinmez: function (b) { return /^(projeDetay|blogDetay|araclar|takip)$/.test(b.tip); }, form: bolumForm }));
  },
  hizmetler: function (f) {
    baslikYaz(f, "Hizmetler", "“Ana hizmet” işaretli olan sitede büyük, yeşil kartla öne çıkar.");
    f.appendChild(fListe(ic, "hizmetler", "Hizmet kartları", { yeni: function () { return { id: yeniId("hizmet"), oneCikan: false, gorsel: "", baslik: L("Yeni hizmet"), ozet: L(""), maddeler: [] }; },
      ozet: function (h) { return trAd(h.baslik); }, alt: function (h) { return h.oneCikan ? "ana hizmet" : ""; },
      form: function (h, k) { k.appendChild(fCift(h, "baslik", "Hizmet adı")); k.appendChild(fCift(h, "ozet", "Kısa açıklama", { uzun: true })); k.appendChild(fCiftListe(h, "maddeler", "Maddeler")); k.appendChild(fGorsel(h, "gorsel", "Görsel (isteğe bağlı)")); k.appendChild(fBool(h, "oneCikan", "Ana hizmet olarak öne çıkar")); } }));
  },
  sektorler: function (f) {
    baslikYaz(f, "Hizmet verilen sektörler", "Gruplar ve içindeki sektörler (ör. Özel Sağlık Hizmet Birimleri).");
    f.appendChild(fListe(ic, "sektorler", "Sektör grupları", { yeni: function () { return { id: yeniId("sektor"), ad: L("Yeni grup"), liste: [] }; }, ozet: function (g) { return trAd(g.ad); }, alt: function (g) { return (g.liste || []).length + " sektör"; },
      form: function (g, k) { k.appendChild(fCift(g, "ad", "Grup adı")); k.appendChild(fCiftListe(g, "liste", "Sektörler")); } }));
  },
  projeler: function (f) {
    baslikYaz(f, "Projeler", "Önce kategorileri, sonra projeleri düzenleyin. Projeler sitede bu sırayla görünür.");
    f.appendChild(fListe(ic, "projeKategorileri", "Kategoriler (filtre düğmeleri)", { yeni: function () { return { id: yeniId("kat"), ad: L("Yeni kategori") }; }, ozet: function (k) { return trAd(k.ad); },
      form: function (k, kap) { kap.appendChild(fCift(k, "ad", "Kategori adı")); } }));
    f.appendChild(fListe(ic, "projeler", "Projeler", { yeni: function () { return { id: yeniId("p"), ad: L("Yeni proje"), kategori: "", konum: "", yil: "", alan: "", ozet: L(""), gorseller: [] }; },
      ozet: function (p, i) { return trAd(p.ad) || "Proje " + (i + 1) + " (adsız)"; }, alt: function (p) { var k = (ic.projeKategorileri || []).filter(function (x) { return x.id === p.kategori; })[0]; return (k ? trAd(k.ad) : "kategorisiz") + " · " + (p.gorseller || []).length + " görsel"; },
      form: function (p, k) {
        k.appendChild(fCift(p, "ad", "Proje adı")); k.appendChild(fSecim(p, "kategori", "Kategori", [["", "— seçin —"]].concat((ic.projeKategorileri || []).map(function (x) { return [x.id, trAd(x.ad)]; }))));
        k.appendChild(fMetin(p, "konum", "Konum", { ph: "Çankaya, Ankara" })); k.appendChild(fMetin(p, "yil", "Yıl")); k.appendChild(fMetin(p, "alan", "Alan", { ph: "120 m²" }));
        k.appendChild(fCift(p, "ozet", "Açıklama", { uzun: true })); k.appendChild(fGorselListe(p, "gorseller", "Görseller"));
      } }));
  },
  blog: function (f) {
    baslikYaz(f, "Blog yazıları", "“Yayında” işaretli olmayan yazılar sitede görünmez (taslak).");
    f.appendChild(fListe(ic, "blog", "Yazılar", { yeni: function () { return { id: yeniId("yazi"), yayinda: false, tarih: new Date().toISOString().slice(0, 10), gorsel: "", baslik: L("Yeni yazı"), ozet: L(""), govde: L("") }; },
      ozet: function (y) { return trAd(y.baslik); }, alt: function (y) { return y.yayinda ? "yayında" : "taslak"; },
      form: function (y, k) { k.appendChild(fBool(y, "yayinda", "Yayında (sitede göster)")); k.appendChild(fCift(y, "baslik", "Başlık")); k.appendChild(fMetin(y, "tarih", "Tarih", { tip: "date" }));
        k.appendChild(fGorsel(y, "gorsel", "Kapak görseli")); k.appendChild(fCift(y, "ozet", "Kısa özet", { uzun: true }));
        k.appendChild(fCift(y, "govde", "Yazı metni", { uzun: true, yard: "Boş satır = yeni paragraf · \"## \" ile başlayan satır = ara başlık · \"- \" = madde." })); } }));
  },
  referanslar: function (f) {
    baslikYaz(f, "Referanslar / çalıştığımız firmalar", "Logosu yüklenen her firma ana sayfadaki logo şeridinde görünür. Hiç logo yokken bölüm gizlidir.");
    f.appendChild(fListe(ic, "referanslar", "Firmalar", { yeni: function () { return { id: yeniId("ref"), ad: "", logo: "", link: "" }; }, ozet: function (r) { return r.ad || "(adsız firma)"; }, alt: function (r) { return r.logo ? "logo var" : "logo yok"; },
      form: function (r, k) { k.appendChild(fMetin(r, "ad", "Firma adı")); k.appendChild(fGorsel(r, "logo", "Logo")); k.appendChild(fMetin(r, "link", "Web sitesi (isteğe bağlı)", { tip: "url" })); } }));
  },
  maliyet: function (f) {
    var M = ic.maliyet = ic.maliyet || {};
    baslikYaz(f, "Maliyet hesaplayıcı", "Sonuç = (m² × m² fiyatı + oda × oda fiyatı + salon × salon fiyatı + ıslak hacim × ıslak hacim fiyatı) × alan tipi katsayısı × alt tip katsayısı, ± aralık yüzdesi. Sitede her zaman “yaklaşık / ön teklif” yazar.");
    f.appendChild(fMetin(M, "aralikYuzde", "Aralık (± %)", { tip: "number", min: 0, adim: 1 })); f.appendChild(fMetin(M, "paraBirimi", "Para birimi simgesi"));
    f.appendChild(fBool(M, "ornek", "“Örnek katsayılar” etiketi göster", "Gerçek fiyatlar girildiğinde kapatın."));
    f.appendChild(fCift(M, "not", "Alt not", { uzun: true })); f.appendChild(fCift(M, "islakEtiket", "Islak hacim sorusunun adı"));
    f.appendChild(fListe(M, "tipler", "Alan tipleri", { yeni: function () { return { id: yeniId("tip"), ad: L("Yeni tip"), katsayi: 1, odaEtiket: L("Oda"), salonEtiket: L("Salon"), altBaslik: L(""), altTipler: [] }; },
      ozet: function (t) { return trAd(t.ad); }, alt: function (t) { return "× " + t.katsayi + ((t.altTipler || []).length ? " · " + t.altTipler.length + " alt tip" : ""); },
      form: function (t, k) {
        k.appendChild(fCift(t, "ad", "Tip adı")); k.appendChild(fMetin(t, "katsayi", "Katsayı", { tip: "number", min: 0, adim: .05, yard: "1 = temel fiyat; 1,2 = %20 daha pahalı." }));
        k.appendChild(fCift(t, "odaEtiket", "“Oda” sorusunun adı")); k.appendChild(fCift(t, "salonEtiket", "“Salon” sorusunun adı"));
        k.appendChild(fCift(t, "altBaslik", "Alt tip listesinin başlığı (ör. Özel Sağlık Hizmet Birimi)"));
        k.appendChild(fListe(t, "altTipler", "Alt tipler", { yeni: function () { return { id: yeniId("alt"), ad: L("Yeni alt tip"), katsayi: 1 }; }, ozet: function (a) { return trAd(a.ad); }, alt: function (a) { return "× " + a.katsayi; },
          form: function (a, kk) { kk.appendChild(fCift(a, "ad", "Alt tip adı")); kk.appendChild(fMetin(a, "katsayi", "Ek katsayı", { tip: "number", min: 0, adim: .05 })); } }));
      } }));
    f.appendChild(fListe(M, "kaliteler", "Kalite seviyeleri ve birim fiyatlar (₺)", { yeni: function () { return { id: yeniId("kalite"), ad: L("Yeni seviye"), aciklama: L(""), m2: 0, oda: 0, salon: 0, islak: 0 }; },
      ozet: function (q) { return trAd(q.ad); }, alt: function (q) { return Number(q.m2 || 0).toLocaleString("tr-TR") + " ₺/m²"; },
      form: function (q, k) { k.appendChild(fCift(q, "ad", "Seviye adı")); k.appendChild(fCift(q, "aciklama", "Kısa açıklama"));
        [["m2", "m² başına"], ["oda", "Oda başına"], ["salon", "Salon başına"], ["islak", "Islak hacim başına"]].forEach(function (x) { k.appendChild(fMetin(q, x[0], x[1] + " (₺)", { tip: "number", min: 0, adim: 100 })); }); } }));
  },
  markalar: function (f) {
    var M = ic.maliyet = ic.maliyet || {};
    baslikYaz(f, "Malzeme markaları (kalite karşılaştırma)", "Her malzeme kalemi için her kalite seviyesinde kullandığınız markanın adını ve/veya logosunu girin. Boş olanlar sitede “eklenecek” görünür.");
    f.appendChild(fListe(M, "malzemeler", "Malzeme kalemleri", { yeni: function () { return { id: yeniId("malz"), ad: L("Yeni malzeme"), markalar: {} }; }, ozet: function (m) { return trAd(m.ad); },
      alt: function (m) { var n = Object.keys(m.markalar || {}).filter(function (k) { var x = m.markalar[k]; return x && (x.ad || x.logo); }).length; return n + "/" + (M.kaliteler || []).length + " marka"; },
      form: function (m, k) {
        k.appendChild(fCift(m, "ad", "Malzeme adı")); m.markalar = m.markalar || {};
        var t = el("div", { class: "marka-tbl" });
        (M.kaliteler || []).forEach(function (q) { var o = m.markalar[q.id] = m.markalar[q.id] || { ad: "", logo: "" };
          t.appendChild(el("div", { class: "mh" }, [el("b", { text: trAd(q.ad) }), el("div", null, [fMetin(o, "ad", "Marka adı"), fGorsel(o, "logo", "Marka logosu (isteğe bağlı)")])])); });
        k.appendChild(t);
      } }));
  },
  diger: function (f) {
    baslikYaz(f, "Süreç, SSS ve ekip");
    f.appendChild(fListe(ic, "surec", "Süreç adımları", { yeni: function () { return { ad: L("Yeni adım"), metin: L("") }; }, ozet: function (s) { return trAd(s.ad); }, form: function (s, k) { k.appendChild(fCift(s, "ad", "Adım")); k.appendChild(fCift(s, "metin", "Açıklama", { uzun: true })); } }));
    f.appendChild(fListe(ic, "sss", "Sık sorulan sorular", { yeni: function () { return { soru: L("Yeni soru"), cevap: L("") }; }, ozet: function (s) { return trAd(s.soru); }, form: function (s, k) { k.appendChild(fCift(s, "soru", "Soru")); k.appendChild(fCift(s, "cevap", "Cevap", { uzun: true })); } }));
    f.appendChild(fListe(ic, "ekip", "Ekip", { yeni: function () { return { ad: "", unvan: L(""), foto: "" }; }, ozet: function (k) { return k.ad || "(isimsiz)"; }, form: function (e, k) { k.appendChild(fMetin(e, "ad", "Ad soyad")); k.appendChild(fCift(e, "unvan", "Unvan")); k.appendChild(fGorsel(e, "foto", "Fotoğraf")); } }));
  },
  yayin: function (f) {
    baslikYaz(f, "Yayın ve geçmiş", "“Kaydet ve yayınla” ile değişiklikler sitede hemen görünür. Her kayıttan önceki sürüm saklanır (son 30).");
    var g = el("ul", { class: "gecmis" }, [el("li", { text: dbHazir ? "Yükleniyor…" : "Geçmiş, veritabanı kurulumu tamamlanınca görünür." })]); f.appendChild(alan("Önceki sürümler", g));
    if (dbHazir) sb.from("site_icerik_gecmis").select("id,zaman").eq("site", SITE).order("zaman", { ascending: false }).limit(30).then(function (r) {
      g.innerHTML = ""; if (r.error || !r.data.length) { g.appendChild(el("li", { text: r.error ? "Geçmiş okunamadı." : "Henüz önceki sürüm yok." })); return; }
      r.data.forEach(function (x) { g.appendChild(el("li", null, [el("span", { text: new Date(x.zaman).toLocaleString("tr-TR") }), el("button", { type: "button", class: "dg i kucuk", text: "Bu sürümü aç", onclick: function () {
        if (kirli && !confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam?")) return;
        sb.from("site_icerik_gecmis").select("veri").eq("id", x.id).single().then(function (s) { if (s.data) { ic = s.data.veri; degisti(); formCiz(); toast("Sürüm açıldı. Yayınlamak için “Kaydet ve yayınla”."); } }); } })])); });
    });
    var ar = el("div", { class: "ekle-sat" }, [
      el("button", { type: "button", class: "dg i kucuk", text: "Yedek indir (JSON)", onclick: function () { var a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(ic, null, 1)], { type: "application/json" })), download: "bensay-icerik-" + new Date().toISOString().slice(0, 10) + ".json" }); a.click(); } }),
      el("button", { type: "button", class: "dg i kucuk", text: "Yedekten yükle", onclick: function () { var i = el("input", { type: "file", accept: "application/json" }); i.onchange = function () { var r = new FileReader(); r.onload = function () { try { var v = JSON.parse(r.result); if (!v.sayfalar) throw 0; ic = v; degisti(); formCiz(); toast("Yedek yüklendi; yayınlamak için kaydedin."); } catch (e) { toast("Geçersiz dosya."); } }; r.readAsText(i.files[0]); }; i.click(); } }),
      el("button", { type: "button", class: "dg sil kucuk", text: "Varsayılan içeriğe dön", onclick: function () { if (!confirm("Panelde yapılan tüm değişiklikler bırakılıp ilk teslim içeriği açılsın mı? (Kaydetmeden yayına çıkmaz.)")) return; fetch("../veri/icerik.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (v) { ic = v; degisti(); formCiz(); }); } })
    ]);
    f.appendChild(alan("Yedek", ar));
    if (yonetici) {
      var e = { eposta: "" }, kt = el("div", { class: "kutu" }, [el("b", { text: "Yetkili ekle (yalnız Dijitabela yöneticisi)" }), el("p", { class: "ac kucuk", text: "Kişinin önce hesabı olmalı (Supabase Auth daveti). Sonra e-postasını yazıp yetki verin." })]);
      kt.appendChild(fMetin(e, "eposta", "E-posta", { tip: "email" }));
      kt.appendChild(el("button", { type: "button", class: "dg kucuk", text: "Yetki ver", onclick: function () { sb.rpc("site_yetkili_ekle", { p_site: SITE, p_email: e.eposta }).then(function (r) { toast(r.error ? "Hata: " + r.error.message : r.data); }); } }));
      f.appendChild(kt);
    }
  }
};

function formCiz() {
  var f = $("#form"), sc = f.scrollTop; f.innerHTML = ""; CIZ[sekme](f);
  [].forEach.call($("#sekme").children, function (b) { b.setAttribute("aria-current", b.dataset.s === sekme); });
  f.scrollTop = sc;
}
function sekmeCiz() {
  var n = $("#sekme"); n.innerHTML = "";
  SEKMELER.forEach(function (s) { n.appendChild(el("button", { type: "button", "data-s": s[0], text: s[1], onclick: function () { sekme = s[0]; $("#form").scrollTop = 0; formCiz(); var p = sekme === "sayfalar" ? sayfaSec : ONIZ_SAYFA[sekme] || "index"; onizSayfa(p); } })); });
}

/* ---------- önizleme ---------- */
var onizHazir = false, onizZaman = null;
function onizSayfa(id) {
  var s = $("#onizSayfa"); if (s.value !== id) s.value = id;
  var ek = id === "proje" ? "&p=" + encodeURIComponent(((ic.projeler || [])[0] || {}).id || "") : id === "yazi" ? "&y=" + encodeURIComponent(((ic.blog || [])[0] || {}).id || "") : "";
  onizHazir = false; $("#onizF").src = "../" + R.sayfaDosya(id) + "?onizleme=1" + ek;
}
function onizGonder() { clearTimeout(onizZaman); onizZaman = setTimeout(function () { var w = $("#onizF").contentWindow; if (w && onizHazir) w.postMessage({ tip: "bn-icerik", veri: JSON.parse(JSON.stringify(ic)) }, location.origin); }, 250); }
window.addEventListener("message", function (e) { if (e.origin === location.origin && e.data && e.data.tip === "bn-hazir") { onizHazir = true; onizGonder(); } });
function onizKur() {
  var s = $("#onizSayfa"); s.innerHTML = "";
  Object.keys(R.SAYFALAR).forEach(function (id) { if (ic.sayfalar[id]) s.appendChild(el("option", { value: id, text: R.SAYFALAR[id].ad })); });
  s.onchange = function () { onizSayfa(s.value); };
  [].forEach.call(document.querySelectorAll(".cihaz button"), function (b) { b.onclick = function () { [].forEach.call(document.querySelectorAll(".cihaz button"), function (x) { x.setAttribute("aria-pressed", x === b); }); $("#oniz").classList.toggle("tel", b.dataset.c === "t"); }; });
  $("#onizAc").onclick = function () { $("#oniz").classList.add("ac"); };
  $("#onizKapat").onclick = function () { $("#oniz").classList.remove("ac"); };
  onizSayfa("index");
}

/* ---------- kaydet ---------- */
function kaydet() {
  if (!yazabilir) return; durum("Kaydediliyor…"); $("#kaydet").disabled = true;
  ic.meta = Object.assign({}, ic.meta, { kaynak: "panel" });
  sb.from("site_icerik").update({ veri: ic }).eq("site", SITE).select("guncelleme").then(function (r) {
    if (r.error || !r.data || !r.data.length) { durum("Kaydedilemedi", "kirli"); toast(r.error ? "Kaydedilemedi: " + r.error.message : "Kaydetme yetkiniz yok."); $("#kaydet").disabled = false; return; }
    kirli = false; try { localStorage.removeItem(TASLAK); } catch (e) {} durum(); toast("Kaydedildi — sitede yayında.");
  });
}

/* ---------- açılış ---------- */
function uyari(html) { var u = $("#uyari"); u.innerHTML = html; u.hidden = !html; }
function icerikGetir() {
  return sb.from("site_icerik").select("veri,guncelleme").eq("site", SITE).maybeSingle().then(function (r) {
    if (r.error) { dbHazir = false; return null; }
    dbHazir = true; return r.data && r.data.veri && r.data.veri.sayfalar ? r.data.veri : null;
  }, function () { dbHazir = false; return null; }).then(function (v) {
    return v || fetch("../veri/icerik.json", { cache: "no-cache" }).then(function (x) { return x.json(); });
  });
}
function uygulamaAc(user) {
  $("#giris").hidden = true; $("#uyg").hidden = false;
  Promise.all([icerikGetir(), sb.rpc("site_yazabilir", { p_site: SITE }).then(function (r) { return !r.error && r.data === true; }, function () { return false; }), sb.rpc("yonetici_mi").then(function (r) { return !r.error && r.data === true; }, function () { return false; })])
  .then(function (s) {
    ic = s[0]; yazabilir = dbHazir && s[1]; yonetici = s[2];
    var t = null; try { t = JSON.parse(localStorage.getItem(TASLAK)); } catch (e) {}
    if (t && t.ic && t.ic.sayfalar && confirm("Bu tarayıcıda kaydedilmemiş bir taslağınız var (" + new Date(t.zaman).toLocaleString("tr-TR") + "). Açılsın mı?")) { ic = t.ic; kirli = true; }
    if (!dbHazir) uyari("<b>Kurulum bekleniyor:</b> veritabanı tablosu henüz açılmadı; şu an kaydetme ve görsel yükleme kapalı. Değişiklikleri önizleyebilir ve “Yayın ve geçmiş → Yedek indir” ile Dijitabela'ya gönderebilirsiniz.");
    else if (!yazabilir) uyari("<b>" + R.esc(user.email || "") + "</b> hesabının bu sitede kaydetme yetkisi yok. Yetki için Dijitabela ile iletişime geçin. (Önizleme açık.)");
    sekmeCiz(); formCiz(); onizKur(); durum();
  });
}
function girisGoster() { $("#uyg").hidden = true; $("#giris").hidden = false; }
$("#girisForm").addEventListener("submit", function (e) {
  e.preventDefault(); var m = $("#gMsj"); m.className = "msj"; m.textContent = "Giriş yapılıyor…";
  if (!$("#gS").value) { m.className = "msj hata"; m.textContent = "Şifre yazın ya da “Şifresiz giriş bağlantısı gönder”i kullanın."; return; }
  sb.auth.signInWithPassword({ email: $("#gE").value.trim(), password: $("#gS").value }).then(function (r) {
    if (r.error) { m.className = "msj hata"; m.textContent = "E-posta ya da şifre hatalı."; return; }
    m.textContent = ""; uygulamaAc(r.data.user);
  });
});
$("#gLink").addEventListener("click", function () {
  var m = $("#gMsj"), e = $("#gE").value.trim(); if (!e) { m.className = "msj hata"; m.textContent = "Önce e-postanızı yazın."; return; }
  sb.auth.signInWithOtp({ email: e, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } }).then(function (r) {
    m.className = "msj " + (r.error ? "hata" : "ok"); m.textContent = r.error ? "Gönderilemedi (bu e-postayla kayıtlı yetkili hesap olmayabilir)." : "Giriş bağlantısı e-postanıza gönderildi.";
  });
});
$("#kaydet").addEventListener("click", kaydet);
$("#cikis").addEventListener("click", function () { if (kirli && !confirm("Kaydedilmemiş değişiklikler var. Çıkılsın mı?")) return; kirli = false; sb.auth.signOut().then(function () { location.reload(); }); });
document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); if (kirli && yazabilir) kaydet(); } });
// yalnız yerel geliştirme: arayüz testi (kaydetme yine RLS'e takılır, oturum açılmaz)
if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && location.hash === "#yerel-test") uygulamaAc({ email: "yerel-test" });
else sb.auth.getSession().then(function (r) { var s = r.data && r.data.session; if (s) uygulamaAc(s.user); else girisGoster(); });
sb.auth.onAuthStateChange(function (ev, s) { if (ev === "SIGNED_IN" && s && $("#uyg").hidden) uygulamaAc(s.user); });
})();
