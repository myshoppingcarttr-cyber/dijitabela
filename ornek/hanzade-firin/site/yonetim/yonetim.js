/* Hanzade Fırın & Cafe · site yönetim paneli (Dijitabela, 1 Kas 2026) — bensay panel desenini izler.
   Giriş: Supabase Auth (e-posta + şifre ya da şifresiz bağlantı). Yazma yetkisini Supabase RLS denetler (site_yazabilir('hanzade')):
   yalnız Hanzade işletmesinin üyeleri ve Dijitabela yöneticileri kaydedebilir. İstemcide yalnız herkese açık (publishable) anahtar var.
   Veri: public.site_icerik (site='hanzade').veri — tek JSON belge. Sürüm geçmişi: site_icerik_gecmis (tetikleyici, son 30). Görseller: storage 'site-gorsel' / hanzade/… */
(function () {
"use strict";
var R = window.HZRender;
var SB_URL = R.SB.url, SB_KEY = R.SB.key, SITE = R.SITE, BUCKET = "site-gorsel", TASLAK = "hz_yonetim_taslak_v1";
var sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true } });
var $ = function (s, k) { return (k || document).querySelector(s); };
var ic = null, kirli = false, dbHazir = false, satirYok = false, yazabilir = false, yonetici = false, onizlemeKipi = false, sekme = "urunler", katSec = "ekmek", acik = {};

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
function degisti() { kirli = true; durum(); onizGonder(); try { localStorage.setItem(TASLAK, JSON.stringify({ zaman: Date.now(), ic: ic })); } catch (e) {} }
function durum(m, sinif) {
  var d = $("#durum"); $("#kaydet").disabled = !kirli || !yazabilir;
  if (m) { d.textContent = m; d.className = "durum " + (sinif || ""); return; }
  d.textContent = kirli ? (yazabilir ? "Kaydedilmemiş değişiklik var" : "Değişiklik var (kaydetme kapalı)") : (yazabilir ? "Kaydedildi" : "Salt önizleme"); d.className = "durum " + (kirli ? "kirli" : "ok");
}
window.addEventListener("beforeunload", function (e) { if (kirli && yazabilir) { e.preventDefault(); e.returnValue = ""; } });

/* ---------- alanlar ---------- */
function alan(et, ic_, yard) { return el("div", { class: "alan" }, [et ? el("span", { class: "et", text: et }) : null, ic_, yard ? el("p", { class: "yard", text: yard }) : null]); }
function fMetin(o, k, et, ops) {
  ops = ops || {};
  var i = el(ops.uzun ? "textarea" : "input", { type: ops.tip || "text", placeholder: ops.ph || "", inputmode: ops.im || null, oninput: function () { o[k] = ops.tip === "number" ? (i.value === "" ? null : Number(i.value)) : i.value; degisti(); } });
  if (ops.tip === "number") { i.step = ops.adim || "any"; i.min = 0; }
  if (ops.max) i.maxLength = ops.max;
  i.value = o[k] == null ? "" : o[k];
  return alan(et, i, ops.yard);
}
function fBool(o, k, et, yard, cb) {
  var i = el("input", { type: "checkbox", onchange: function () { o[k] = i.checked; degisti(); if (cb) cb(); } }); i.checked = !!o[k];
  return alan(null, el("label", { class: "anahtar" }, [i, et]), yard);
}
function fSecim(o, k, et, sec, yard) {
  var s = el("select", { onchange: function () { o[k] = s.value; degisti(); } });
  sec.forEach(function (x) { var op = el("option", { value: x[0], text: x[1] }); if (String(o[k] == null ? "" : o[k]) === String(x[0])) op.selected = true; s.appendChild(op); });
  return alan(et, s, yard);
}
function fFiyat(o, k, bosYazi) {
  var i = el("input", { type: "number", inputmode: "decimal", min: "0", step: "any", "aria-label": "Fiyat (TL)", placeholder: "—",
    oninput: function () { o[k] = i.value === "" ? null : Number(i.value); not.textContent = i.value === "" ? (bosYazi || "Boş: sitede “Mağazada” yazar") : ""; degisti(); } });
  i.value = o[k] == null ? "" : o[k];
  var not = el("div", { class: "magaza-not", text: o[k] == null || o[k] === "" ? (bosYazi || "Boş: sitede “Mağazada” yazar") : "" });
  return el("div", { class: "fiyat-k" }, [el("div", { class: "fiyat" }, [i, el("span", { text: "TL" })]), not]);
}
function onizAdres(u) { return !u ? "" : /^(https?:|\/)/.test(u) ? u : "../" + u; }

/* görsel yükleme: tarayıcıda küçült (en çok 1600 px, webp/jpeg) → Supabase Storage (site-gorsel/hanzade/…) → herkese açık adres */
function kucult(dosya) {
  return new Promise(function (coz) {
    if (!/^image\/(jpeg|png|webp)$/.test(dosya.type)) return coz(dosya);
    var img = new Image(), u = URL.createObjectURL(dosya);
    img.onload = function () {
      var m = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      if (m >= 1 && dosya.size < 900e3) { URL.revokeObjectURL(u); return coz(dosya); }
      var c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * m); c.height = Math.round(img.naturalHeight * m);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(function (b) { coz(b ? new File([b], dosya.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : dosya); }, "image/jpeg", .84);
    };
    img.onerror = function () { URL.revokeObjectURL(u); coz(dosya); }; img.src = u;
  });
}
function yukle(dosya) {
  if (!yazabilir) { toast(dbHazir ? "Fotoğraf yüklemek için yetkili hesapla giriş yapın." : "Fotoğraf yükleme, veritabanı kurulumu tamamlanınca açılır."); return Promise.reject(0); }
  if (dosya.size > 15e6) { toast("Dosya çok büyük (en çok 15 MB)."); return Promise.reject(0); }
  durum("Fotoğraf yükleniyor…");
  return kucult(dosya).then(function (f) {
    var uz = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, ""), yol = SITE + "/" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7) + "." + uz;
    return sb.storage.from(BUCKET).upload(yol, f, { contentType: f.type, cacheControl: "31536000", upsert: false }).then(function (r) {
      if (r.error) { toast("Yüklenemedi: " + r.error.message); durum(); throw r.error; }
      durum(); return sb.storage.from(BUCKET).getPublicUrl(yol).data.publicUrl;
    });
  });
}
function dosyaSec(cb) { var i = el("input", { type: "file", accept: "image/*" }); i.onchange = function () { if (i.files[0]) cb(i.files[0]); }; i.click(); }
function fGorsel(o, k, et) {
  var kr = el("div", { class: "kr" });
  function goster() { kr.innerHTML = ""; if (o[k]) kr.appendChild(el("img", { src: onizAdres(o[k]), alt: "" })); else kr.textContent = "fotoğraf yok"; }
  var yb = el("button", { type: "button", class: "dg i kucuk", text: "Fotoğraf yükle", onclick: function () { dosyaSec(function (f) { yukle(f).then(function (u) { o[k] = u; goster(); degisti(); formCiz(); }, function () {}); }); } });
  var sil = el("button", { type: "button", class: "dg sil kucuk", text: "Kaldır", onclick: function () { o[k] = ""; goster(); degisti(); formCiz(); } });
  goster();
  return alan(et || "Fotoğraf", el("div", { class: "gorsel" }, [kr, el("div", { class: "gd" }, [yb, sil])]), "Fotoğrafı olmayan ürün sitede fotoğrafsız kartla görünür.");
}
function satirlar(o, k, et, yard) {
  var t = el("textarea", { rows: 4, oninput: function () { o[k] = t.value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); degisti(); } });
  t.value = (o[k] || []).join("\n");
  return alan(et, t, yard || "Her satıra bir madde.");
}
function siraDugmeleri(L, i, yenile) {
  return [el("button", { type: "button", class: "ib", text: "↑", title: "Yukarı", "aria-label": "Yukarı taşı", onclick: function () { if (i > 0) { L.splice(i - 1, 0, L.splice(i, 1)[0]); degisti(); yenile(); } } }),
    el("button", { type: "button", class: "ib", text: "↓", title: "Aşağı", "aria-label": "Aşağı taşı", onclick: function () { if (i < L.length - 1) { L.splice(i + 1, 0, L.splice(i, 1)[0]); degisti(); yenile(); } } })];
}
function kutu(baslik, cocuk, yesil) { return el("div", { class: "kutu" + (yesil ? " acik" : "") }, [baslik ? el("b", { text: baslik }) : null].concat(cocuk)); }
function baslikYaz(f, b, a) { f.appendChild(el("h2", { text: b })); if (a) f.appendChild(el("p", { class: "ac", text: a })); }

/* ---------- ürün listesi (kategoriye göre) ---------- */
var BIRIMLER = [["adet", "adet"], ["kg", "kg"], ["porsiyon", "porsiyon"], ["dilim", "dilim"], ["", "—"]];
function urunListesi(f, katId) {
  var K = (ic.kategoriler || []).filter(function (k) { return k.id === katId; })[0] || {};
  var hepsi = ic.urunler = ic.urunler || [];
  var L = hepsi.filter(function (u) { return u.kat === katId; });
  var kap = el("div", { class: "liste" });
  function tasi(u, yon) { // aynı kategori içinde sırayı, genel dizide yer değiştirerek korur
    var j = L.indexOf(u), h = L[j + yon]; if (!h) return;
    var a = hepsi.indexOf(u), b = hepsi.indexOf(h); hepsi[a] = h; hepsi[b] = u; degisti(); formCiz();
  }
  L.forEach(function (u) {
    var id = "u:" + u.id, detay = el("div", { class: "us-detay" }); detay.hidden = !acik[id];
    var res = el("div", { class: "us-res" }); if (u.gorsel) res.appendChild(el("img", { src: onizAdres(u.gorsel), alt: "" })); else res.textContent = (u.ad || "?").charAt(0);
    var ad = el("input", { class: "us-ad", "aria-label": "Ürün adı", value: u.ad || "", oninput: function () { u.ad = ad.value; degisti(); } });
    var gz = el("input", { type: "checkbox", onchange: function () { u.satista = gz.checked; sat.classList.toggle("gizli", !gz.checked); degisti(); } }); gz.checked = u.satista !== false;
    var br = el("select", { "aria-label": "Birim", onchange: function () { u.birim = br.value; degisti(); } });
    BIRIMLER.forEach(function (b) { var o = el("option", { value: b[0], text: b[1] }); if ((u.birim || "") === b[0]) o.selected = true; br.appendChild(o); });
    var sat = el("div", { class: "us" + (u.satista === false ? " gizli" : "") }, [
      el("div", { class: "us-ust" }, [res, ad, fFiyat(u, "fiyat", K.fiyatsiz_yazi ? "Boş: sitede “" + K.fiyatsiz_yazi + "” yazar" : null)]),
      el("div", { class: "us-alt" }, [el("label", { class: "anahtar" }, [gz, "Satışta (sitede görünsün)"]), br,
        el("button", { type: "button", class: "ib", text: "↑", "aria-label": "Yukarı taşı", onclick: function () { tasi(u, -1); } }),
        el("button", { type: "button", class: "ib", text: "↓", "aria-label": "Aşağı taşı", onclick: function () { tasi(u, 1); } }),
        el("button", { type: "button", class: "ib", text: acik[id] ? "Kapat" : "Ayrıntı / fotoğraf", onclick: function () { acik[id] = !acik[id]; formCiz(); } }),
        el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("“" + (u.ad || "Ürün") + "” silinsin mi?")) { hepsi.splice(hepsi.indexOf(u), 1); degisti(); formCiz(); } } })]),
      detay]);
    if (acik[id]) {
      detay.appendChild(fMetin(u, "aciklama", "Kısa açıklama (isteğe bağlı)", { ph: "Örn. 1 kg · kaşarlı, peynirli" }));
      detay.appendChild(fGorsel(u, "gorsel"));
      detay.appendChild(fSecim(u, "kat", "Kategori (başka gruba taşı)", (ic.kategoriler || []).filter(function (k) { return !k.ozel; }).map(function (k) { return [k.id, k.ad]; })));
      $("select", detay.lastChild).addEventListener("change", function () { formCiz(); });
    }
    kap.appendChild(sat);
  });
  kap.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg kucuk", text: "+ Yeni ürün ekle", onclick: function () {
    var y = { id: yeniId(katId), kat: katId, ad: "Yeni ürün", fiyat: null, birim: "adet", aciklama: "", gorsel: "", satista: true };
    var son = L.length ? hepsi.indexOf(L[L.length - 1]) + 1 : hepsi.length; hepsi.splice(son, 0, y); acik["u:" + y.id] = true; degisti(); formCiz();
    setTimeout(function () { var x = document.querySelectorAll(".us-ad"); if (x.length) { x[x.length - 1].focus(); x[x.length - 1].select(); } }, 30);
  } })]));
  f.appendChild(kap);
}

/* ---------- sekmeler ---------- */
var SEKMELER = [["urunler", "Ürünler ve fiyatlar"], ["pasta", "Yaş pasta"], ["sabah", "Sabah paketleri"], ["sarkuteri", "Şarküteri"], ["kurumsal", "Kurumsal kutular"],
  ["duyuru", "Duyurular"], ["taze", "Sıcak çıkış saatleri"], ["isletme", "İşletme bilgileri"], ["metin", "Sayfa yazıları"], ["yayin", "Yayın ve geçmiş"]];
var ONIZ = { urunler: "menu", sarkuteri: "menu", pasta: "pasta", sabah: "sabah", kurumsal: "kurumsal", duyuru: "index", taze: "index", isletme: "iletisim", metin: "hakkimizda", yayin: "index" };
var CIZ = {
  urunler: function (f) {
    baslikYaz(f, "Ürünler ve fiyatlar", "Önce grubu seçin. Fiyatı büyük kutuya yazın; fiyatı boş bırakılan ürün sitede “Mağazada” etiketiyle görünür. Satıştan kalkan ürünün tikini kaldırın, silmenize gerek yok.");
    var gruplar = (ic.kategoriler || []).filter(function (k) { return !k.ozel && k.id !== "sarkuteri"; });
    if (!gruplar.some(function (k) { return k.id === katSec; })) katSec = (gruplar[0] || {}).id;
    var c = el("div", { class: "cips", role: "group", "aria-label": "Ürün grubu" });
    gruplar.forEach(function (k) { var n = (ic.urunler || []).filter(function (u) { return u.kat === k.id; }).length; c.appendChild(el("button", { type: "button", "aria-pressed": k.id === katSec, html: R.esc(k.ad) + "<small>" + n + "</small>", onclick: function () { katSec = k.id; formCiz(); } })); });
    f.appendChild(c);
    urunListesi(f, katSec);
    var K = gruplar.filter(function (k) { return k.id === katSec; })[0];
    if (K) f.appendChild(kutu("Grup bilgisi", [fMetin(K, "ad", "Grup adı"), fMetin(K, "aciklama", "Grup açıklaması")]));
  },
  sarkuteri: function (f) {
    baslikYaz(f, "Kahvaltılık ve şarküteri", "Peynir, zeytin, bal, reçel… Fiyat yazmak zorunda değilsiniz; boş bırakılan ürün sitede “Mağazada” görünür.");
    urunListesi(f, "sarkuteri");
  },
  pasta: function (f) {
    var p = ic.pasta = ic.pasta || {}; p.boylar = p.boylar || []; p.cesitler = p.cesitler || [];
    baslikYaz(f, "Yaş pasta", "Fiyat boya göre belirlenir. Çeşitler sipariş sayfasında ve pasta vitrininde görünür.");
    f.appendChild(el("h3", { text: "Boylar ve fiyatlar" }));
    var bl = el("div", { class: "liste" });
    p.boylar.forEach(function (b, i) {
      bl.appendChild(el("div", { class: "us" }, [el("div", { class: "us-ust" }, [el("div", { class: "us-res", text: b.ad ? b.ad.charAt(0) : "#" }),
        el("div", null, [fMetin(b, "ad", "Boy adı", { ph: "0 No" }), fMetin(b, "kisi", "Kişi sayısı", { ph: "4 kişilik" })]), fFiyat(b, "fiyat", "Fiyat girin")]),
        el("div", { class: "us-alt" }, siraDugmeleri(p.boylar, i, formCiz).concat([el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("Bu boy silinsin mi?")) { p.boylar.splice(i, 1); degisti(); formCiz(); } } })]))]));
    });
    bl.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg i kucuk", text: "+ Boy ekle", onclick: function () { p.boylar.push({ id: yeniId("boy"), ad: "", kisi: "", fiyat: null }); degisti(); formCiz(); } })]));
    f.appendChild(bl);
    f.appendChild(el("h3", { text: "Çeşitler", style: "margin-top:24px" }));
    var cl = el("div", { class: "liste" });
    p.cesitler.forEach(function (c, i) {
      var id = "c:" + c.id, detay = el("div", { class: "us-detay" }); detay.hidden = !acik[id];
      var res = el("div", { class: "us-res" }); if (c.gorsel) res.appendChild(el("img", { src: onizAdres(c.gorsel), alt: "" })); else res.textContent = (c.ad || "?").charAt(0);
      var gz = el("input", { type: "checkbox", onchange: function () { c.satista = gz.checked; degisti(); formCiz(); } }); gz.checked = c.satista !== false;
      var ad = el("input", { class: "us-ad", value: c.ad || "", "aria-label": "Çeşit adı", oninput: function () { c.ad = ad.value; degisti(); } });
      if (acik[id]) { detay.appendChild(fMetin(c, "aciklama", "Kısa açıklama")); detay.appendChild(fSecim(c, "grup", "Filtre grubu", [["", "Otomatik (adına göre)"], ["cikolata", "Çikolatalı"], ["meyveli", "Meyveli"], ["ozel", "Fıstık · lotus · kestane · krokan"]])); detay.appendChild(fGorsel(c, "gorsel")); }
      cl.appendChild(el("div", { class: "us" + (c.satista === false ? " gizli" : "") }, [el("div", { class: "us-ust", style: "grid-template-columns:64px minmax(0,1fr)" }, [res, ad]),
        el("div", { class: "us-alt" }, [el("label", { class: "anahtar" }, [gz, "Satışta"])].concat(siraDugmeleri(p.cesitler, i, formCiz)).concat([
          el("button", { type: "button", class: "ib", text: acik[id] ? "Kapat" : "Ayrıntı / fotoğraf", onclick: function () { acik[id] = !acik[id]; formCiz(); } }),
          el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("“" + c.ad + "” silinsin mi?")) { p.cesitler.splice(i, 1); degisti(); formCiz(); } } })])), detay]));
    });
    cl.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg kucuk", text: "+ Yeni çeşit ekle", onclick: function () { var y = { id: yeniId("pasta"), ad: "Yeni çeşit", aciklama: "", gorsel: "", satista: true }; p.cesitler.push(y); acik["c:" + y.id] = true; degisti(); formCiz(); } })]));
    f.appendChild(cl);
    var oc = ic.one_cikan = ic.one_cikan || { pastalar: [] }, sec = el("div", { class: "cips" });
    p.cesitler.forEach(function (c) { var s = oc.pastalar.indexOf(c.id) > -1; sec.appendChild(el("button", { type: "button", "aria-pressed": s, text: c.ad, onclick: function () { var j = oc.pastalar.indexOf(c.id); if (j > -1) oc.pastalar.splice(j, 1); else oc.pastalar.push(c.id); degisti(); formCiz(); } })); });
    f.appendChild(kutu("Ana sayfada öne çıkan pastalar", [el("p", { class: "ac kucuk", text: "Dokunarak seçin (3–4 tane önerilir)." }), sec]));
    f.appendChild(kutu("Diğer", [fMetin(p, "not", "Fiyat notu (sitede boy tablosunun altında)", { uzun: true }), fMetin(p, "on_gun", "En az kaç gün önceden sipariş?", { tip: "number", adim: 1 }), fMetin(p, "ozel_not", "Özel tasarım pasta notu", { uzun: true })]));
  },
  sabah: function (f) {
    var s = ic.sabah = ic.sabah || {}; s.paketler = s.paketler || [];
    baslikYaz(f, "Sabah paketleri", "Fiyatı boş bırakılan pakette sitede “Fiyat için sorun” yazar.");
    f.appendChild(kutu(null, [fMetin(s, "saat", "Satış saati", { ph: "06:00–11:00" }), fMetin(s, "baslik", "Başlık"), fMetin(s, "metin", "Açıklama", { uzun: true })]));
    var l = el("div", { class: "liste" });
    s.paketler.forEach(function (p, i) {
      var id = "p:" + p.id, detay = el("div", { class: "us-detay" }); detay.hidden = !acik[id];
      var res = el("div", { class: "us-res" }); if (p.gorsel) res.appendChild(el("img", { src: onizAdres(p.gorsel), alt: "" })); else res.textContent = (p.ad || "?").charAt(0);
      var ad = el("input", { class: "us-ad", value: p.ad || "", "aria-label": "Paket adı", oninput: function () { p.ad = ad.value; degisti(); } });
      var gz = el("input", { type: "checkbox", onchange: function () { p.satista = gz.checked; degisti(); formCiz(); } }); gz.checked = p.satista !== false;
      if (acik[id]) { detay.appendChild(fMetin(p, "kisi", "Kişi / etiket", { ph: "1 kişilik" })); detay.appendChild(satirlar(p, "icerik", "Paketin içindekiler")); detay.appendChild(fGorsel(p, "gorsel")); }
      l.appendChild(el("div", { class: "us" + (p.satista === false ? " gizli" : "") }, [el("div", { class: "us-ust" }, [res, ad, fFiyat(p, "fiyat", "Boş: sitede “Fiyat için sorun” yazar")]),
        el("div", { class: "us-alt" }, [el("label", { class: "anahtar" }, [gz, "Satışta"])].concat(siraDugmeleri(s.paketler, i, formCiz)).concat([
          el("button", { type: "button", class: "ib", text: acik[id] ? "Kapat" : "İçindekiler / fotoğraf", onclick: function () { acik[id] = !acik[id]; formCiz(); } }),
          el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("“" + p.ad + "” silinsin mi?")) { s.paketler.splice(i, 1); degisti(); formCiz(); } } })])), detay]));
    });
    l.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg kucuk", text: "+ Yeni paket ekle", onclick: function () { var y = { id: yeniId("paket"), ad: "Yeni paket", fiyat: null, icerik: [], kisi: "", gorsel: "", satista: true }; s.paketler.push(y); acik["p:" + y.id] = true; degisti(); formCiz(); } })]));
    f.appendChild(l);
    f.appendChild(fMetin(s, "not", "Alt not", { uzun: true }));
  },
  kurumsal: function (f) {
    var m = ic.metinler = ic.metinler || {}; m.kurumsal_urunler = m.kurumsal_urunler || [];
    baslikYaz(f, "Kurumsal kutular", "Ofis sabah tepsisi ve toplantı kutusu. Fiyatı boş bırakırsanız sitede “Fiyat için arayın” yazar.");
    var l = el("div", { class: "liste" });
    m.kurumsal_urunler.forEach(function (u, i) {
      var id = "k:" + u.id, detay = el("div", { class: "us-detay" }); detay.hidden = !acik[id];
      var res = el("div", { class: "us-res" }); if (u.gorsel) res.appendChild(el("img", { src: onizAdres(u.gorsel), alt: "" })); else res.textContent = (u.ad || "?").charAt(0);
      var ad = el("input", { class: "us-ad", value: u.ad || "", "aria-label": "Ürün adı", oninput: function () { u.ad = ad.value; degisti(); } });
      var gz = el("input", { type: "checkbox", onchange: function () { u.satista = gz.checked; degisti(); formCiz(); } }); gz.checked = u.satista !== false;
      if (acik[id]) { detay.appendChild(fMetin(u, "kisi", "Kişi sayısı", { ph: "10–15 kişilik" })); detay.appendChild(fMetin(u, "aciklama", "İçindekiler / açıklama", { uzun: true })); detay.appendChild(fGorsel(u, "gorsel")); }
      l.appendChild(el("div", { class: "us" + (u.satista === false ? " gizli" : "") }, [el("div", { class: "us-ust" }, [res, ad, fFiyat(u, "fiyat", "Boş: sitede “Fiyat için arayın” yazar")]),
        el("div", { class: "us-alt" }, [el("label", { class: "anahtar" }, [gz, "Sitede göster"])].concat(siraDugmeleri(m.kurumsal_urunler, i, formCiz)).concat([
          el("button", { type: "button", class: "ib", text: acik[id] ? "Kapat" : "Ayrıntı / fotoğraf", onclick: function () { acik[id] = !acik[id]; formCiz(); } }),
          el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("“" + u.ad + "” silinsin mi?")) { m.kurumsal_urunler.splice(i, 1); degisti(); formCiz(); } } })])), detay]));
    });
    l.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg kucuk", text: "+ Yeni kurumsal ürün", onclick: function () { var y = { id: yeniId("kurum"), ad: "Yeni kutu", kisi: "", aciklama: "", fiyat: null, gorsel: "", satista: true }; m.kurumsal_urunler.push(y); acik["k:" + y.id] = true; degisti(); formCiz(); } })]));
    f.appendChild(l);
  },
  duyuru: function (f) {
    var d = ic.duyurular = ic.duyurular || {}; d.serit = d.serit || {}; d.aksam = d.aksam || {}; d.yilbasi = d.yilbasi || { modeller: [] };
    baslikYaz(f, "Duyurular", "Açtığınız duyuru sitede hemen görünür (kaydedince). Kapatınca kaybolur, metin silinmez.");
    f.appendChild(kutu("Üst duyuru şeridi", [fBool(d.serit, "acik", "Şeridi göster", "Sitenin en üstünde ince bir duyuru bandı.", formCiz), fMetin(d.serit, "metin", "Duyuru metni", { ph: "Örn. Bayramda 07:00–20:00 açığız", max: 140 })], d.serit.acik));
    f.appendChild(kutu("Akşam fırsat saati", [fBool(d.aksam, "acik", "Akşam fırsatını göster", "Ana sayfada koyu bir bantla görünür.", formCiz), fMetin(d.aksam, "saat", "Saat", { tip: "time" }),
      fMetin(d.aksam, "oran", "Avantaj oranı (%)", { tip: "number", adim: 1, yard: "Sitede “Seçili ürünlerde %… avantaj” yazar. Boş bırakırsanız oran yazmaz." }),
      fMetin(d.aksam, "baslik", "Başlık"), fMetin(d.aksam, "metin", "Metin", { uzun: true, yard: "Genel indirim gibi değil, seçili taze ürünlere özel bir avantaj olarak yazın." })], d.aksam.acik));
    var y = d.yilbasi; y.modeller = y.modeller || [];
    var ml = el("div", { class: "liste" });
    y.modeller.forEach(function (mo, i) {
      ml.appendChild(el("div", { class: "us" }, [fMetin(mo, "ad", "Model adı"), fMetin(mo, "aciklama", "Kısa açıklama"), fGorsel(mo, "gorsel"),
        el("div", { class: "us-alt" }, siraDugmeleri(y.modeller, i, formCiz).concat([el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("Model silinsin mi?")) { y.modeller.splice(i, 1); degisti(); formCiz(); } } })]))]));
    });
    ml.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg i kucuk", text: "+ Model ekle", onclick: function () { y.modeller.push({ id: yeniId("yb"), ad: "Yeni model", aciklama: "", gorsel: "" }); degisti(); formCiz(); } })]));
    f.appendChild(kutu("Yılbaşı pastası kampanyası", [fBool(y, "acik", "Kampanyayı aç", "Açınca ana sayfada, menüde ve sipariş sihirbazında yılbaşı modelleri görünür.", formCiz), fMetin(y, "baslik", "Başlık"), fMetin(y, "metin", "Açıklama", { uzun: true }),
      fMetin(y, "erken_son", "Erken sipariş son günü", { ph: "20 Aralık" }), fMetin(y, "teslim", "Teslim tarihleri", { ph: "28–31 Aralık" }), el("b", { text: "Modeller" }), ml], y.acik));
  },
  taze: function (f) {
    var t = ic.taze = ic.taze || {}; t.liste = t.liste || [];
    baslikYaz(f, "Sıcak çıkış saatleri", "Ana sayfanın üstünde ve menüde “şu an sıcak / sonraki çıkış” tablosu olarak görünür. Saatleri virgülle ayırın (ör. 07:15, 12:00).");
    f.appendChild(kutu(null, [fBool(t, "acik", "Bölümü göster", null, formCiz), fMetin(t, "baslik", "Başlık"), fMetin(t, "metin", "Açıklama"), fMetin(t, "not", "Alt not")], t.acik !== false));
    var l = el("div", { class: "liste" });
    t.liste.forEach(function (x, i) {
      var s = el("input", { type: "text", value: (x.saatler || []).join(", "), "aria-label": "Çıkış saatleri", placeholder: "07:15, 12:00", oninput: function () { x.saatler = s.value.split(/[,\s;]+/).map(function (v) { var m = /^(\d{1,2})[:.](\d{2})$/.exec(v.trim()); return m ? ("0" + m[1]).slice(-2) + ":" + m[2] : ""; }).filter(Boolean); degisti(); } });
      l.appendChild(el("div", { class: "us" }, [fMetin(x, "ad", "Ürün"), alan("Çıkış saatleri", s), fGorsel(x, "gorsel"),
        el("div", { class: "us-alt" }, siraDugmeleri(t.liste, i, formCiz).concat([el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { if (confirm("Satır silinsin mi?")) { t.liste.splice(i, 1); degisti(); formCiz(); } } })]))]));
    });
    l.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg kucuk", text: "+ Satır ekle", onclick: function () { t.liste.push({ ad: "Yeni ürün", gorsel: "", saatler: [] }); degisti(); formCiz(); } })]));
    f.appendChild(l);
  },
  isletme: function (f) {
    var i = ic.isletme = ic.isletme || {}; i.saatler = i.saatler || []; i.platformlar = i.platformlar || [];
    baslikYaz(f, "İşletme bilgileri", "Telefon, adres, saatler ve bağlantılar sitenin her yerinde (alt bilgi, iletişim, harita, Google bilgileri) kullanılır.");
    f.appendChild(kutu("İletişim", [fMetin(i, "telefon", "Telefon", { tip: "tel" }),
      fMetin(i, "siparis_whatsapp", "Sipariş WhatsApp numarası", { tip: "tel", ph: "0532 … … ..", yard: "Pasta siparişi ve kurumsal talepler bu numaraya WhatsApp mesajı olarak gelir. Boş bırakılırsa sitede “Telefonla arayın” düğmesi görünür." }),
      fMetin(i, "instagram", "Instagram adresi", { tip: "url" })]));
    f.appendChild(kutu("Adres", [fMetin(i, "adres", "Açık adres"), fMetin(i, "ilce", "İlçe"), fMetin(i, "sehir", "Şehir"),
      fMetin(i, "harita_link", "Google Haritalar bağlantısı (yol tarifi)", { tip: "url" }),
      fMetin(i, "google_yorum", "Google yorum bağlantısı", { tip: "url", yard: "Google İşletme Profili → “Yorum iste / Daha fazla yorum alın” bağlantısı (g.page/r/… ). Karekod bu bağlantıyı açar. Boşsa harita bağlantısı kullanılır." })]));
    var st = el("div", { class: "saat-tbl" });
    i.saatler.forEach(function (s) {
      var a = el("input", { type: "time", value: s.acilis || "", "aria-label": s.gun + " açılış", oninput: function () { s.acilis = a.value; degisti(); } });
      var k = el("input", { type: "time", value: s.kapanis || "", "aria-label": s.gun + " kapanış", oninput: function () { s.kapanis = k.value; degisti(); } });
      var c = el("input", { type: "checkbox", onchange: function () { s.kapali = c.checked; degisti(); } }); c.checked = !!s.kapali;
      st.appendChild(el("div", { class: "saat-sat" }, [el("b", { text: s.gun }), a, k, el("label", null, [c, "Kapalı"])]));
    });
    f.appendChild(kutu("Çalışma saatleri", [st, fMetin(i, "saat_notu", "Saat notu (isteğe bağlı)")]));
    var pl = el("div", { class: "liste" });
    i.platformlar.forEach(function (p, j) { pl.appendChild(el("div", { class: "us" }, [fMetin(p, "ad", "Platform"), fMetin(p, "link", "Mağaza sayfası bağlantısı (isteğe bağlı)", { tip: "url" }), el("div", { class: "us-alt" }, [el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { i.platformlar.splice(j, 1); degisti(); formCiz(); } })])])); });
    pl.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg i kucuk", text: "+ Platform ekle", onclick: function () { i.platformlar.push({ ad: "", link: "" }); degisti(); formCiz(); } })]));
    f.appendChild(kutu("Paket servis platformları", [pl]));
    f.appendChild(kutu("Tanıtım", [fMetin(i, "slogan", "Slogan (ana sayfa başlığı)"), fMetin(i, "tanitim", "Kısa tanıtım", { uzun: true })]));
  },
  metin: function (f) {
    var m = ic.metinler = ic.metinler || {}; m.kurumsal_maddeler = m.kurumsal_maddeler || [];
    baslikYaz(f, "Sayfa yazıları", "Hakkımızda ve kurumsal sayfa yazıları, Google'da görünen sayfa başlıkları.");
    f.appendChild(fMetin(m, "hakkimizda", "Hakkımızda yazısı", { uzun: true, yard: "Boş satır = yeni paragraf · “## ” ile başlayan satır = ara başlık · “- ” = madde." }));
    f.appendChild(fMetin(m, "kurumsal", "Kurumsal sayfa giriş yazısı", { uzun: true }));
    var kl = el("div", { class: "liste" });
    m.kurumsal_maddeler.forEach(function (x, j) { kl.appendChild(el("div", { class: "us" }, [fMetin(x, "ad", "Başlık"), fMetin(x, "metin", "Açıklama", { uzun: true }), el("div", { class: "us-alt" }, siraDugmeleri(m.kurumsal_maddeler, j, formCiz).concat([el("button", { type: "button", class: "ib sil", text: "Sil", onclick: function () { m.kurumsal_maddeler.splice(j, 1); degisti(); formCiz(); } })]))])); });
    kl.appendChild(el("div", { class: "ekle-sat" }, [el("button", { type: "button", class: "dg i kucuk", text: "+ Madde ekle", onclick: function () { m.kurumsal_maddeler.push({ ad: "", metin: "" }); degisti(); formCiz(); } })]));
    f.appendChild(kutu("Kurumsal hizmet maddeleri", [kl]));
    var s = ic.sayfalar = ic.sayfalar || {};
    Object.keys(R.SAYFALAR).forEach(function (id) { s[id] = s[id] || {}; f.appendChild(kutu("Google bilgisi · " + R.SAYFALAR[id].ad, [fMetin(s[id], "baslik", "Sayfa başlığı", { max: 70 }), fMetin(s[id], "aciklama", "Kısa açıklama", { uzun: true, max: 170 })])); });
  },
  yayin: function (f) {
    baslikYaz(f, "Yayın ve geçmiş", "“Kaydet ve yayınla” ile değişiklikler sitede hemen görünür. Her kayıttan önceki sürüm saklanır (son 30).");
    var g = el("ul", { class: "gecmis" }, [el("li", { text: dbHazir && !onizlemeKipi ? "Yükleniyor…" : "Geçmiş, veritabanı kurulumu ve giriş tamamlanınca görünür." })]); f.appendChild(alan("Önceki sürümler", g));
    if (dbHazir && !onizlemeKipi) sb.from("site_icerik_gecmis").select("id,zaman").eq("site", SITE).order("zaman", { ascending: false }).limit(30).then(function (r) {
      g.innerHTML = ""; if (r.error || !r.data.length) { g.appendChild(el("li", { text: r.error ? "Geçmiş okunamadı." : "Henüz önceki sürüm yok." })); return; }
      r.data.forEach(function (x) { g.appendChild(el("li", null, [el("span", { text: new Date(x.zaman).toLocaleString("tr-TR") }), el("button", { type: "button", class: "dg i kucuk", text: "Bu sürümü aç", onclick: function () {
        if (kirli && !confirm("Kaydedilmemiş değişiklikler kaybolacak. Devam?")) return;
        sb.from("site_icerik_gecmis").select("veri").eq("id", x.id).single().then(function (s) { if (s.data) { ic = s.data.veri; degisti(); formCiz(); toast("Sürüm açıldı. Yayınlamak için “Kaydet ve yayınla”."); } }); } })])); });
    });
    f.appendChild(alan("Yedek", el("div", { class: "ekle-sat" }, [
      el("button", { type: "button", class: "dg i kucuk", text: "Yedek indir (JSON)", onclick: function () { var a = el("a", { href: URL.createObjectURL(new Blob([JSON.stringify(ic, null, 1)], { type: "application/json" })), download: "hanzade-icerik-" + new Date().toISOString().slice(0, 10) + ".json" }); document.body.appendChild(a); a.click(); a.remove(); } }),
      el("button", { type: "button", class: "dg i kucuk", text: "Yedekten yükle", onclick: function () { var i = el("input", { type: "file", accept: "application/json" }); i.onchange = function () { var r = new FileReader(); r.onload = function () { try { var v = JSON.parse(r.result); if (!v.urunler) throw 0; ic = v; degisti(); formCiz(); toast("Yedek yüklendi; yayınlamak için kaydedin."); } catch (e) { toast("Geçersiz dosya."); } }; r.readAsText(i.files[0]); }; i.click(); } }),
      el("button", { type: "button", class: "dg sil kucuk", text: "İlk teslim içeriğine dön", onclick: function () { if (!confirm("Panelde yapılan değişiklikler bırakılıp ilk teslim içeriği açılsın mı? (Kaydetmeden yayına çıkmaz.)")) return; fetch("../veri/icerik.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (v) { ic = v; degisti(); formCiz(); }); } })
    ]), "Yedek dosyasını Dijitabela'ya da gönderebilirsiniz."));
    if (yonetici || onizlemeKipi) {
      ic.site = ic.site || {};
      var kt = kutu("Dijitabela ayarları", [fBool(ic.site, "yayinda", "Arama motorlarına açık (alan adı bağlanınca açın)", "Kapalıyken sayfalar “noindex” üretilir. Değişiklik, sayfalar yeniden üretilince (onuret.js) etkili olur.")]);
      if (yonetici) {
        var e = { eposta: "" };
        kt.appendChild(el("p", { class: "ac kucuk", text: "Yetkili ekle: kişinin önce Supabase Auth hesabı olmalı (davet)." }));
        kt.appendChild(fMetin(e, "eposta", "E-posta", { tip: "email" }));
        kt.appendChild(el("button", { type: "button", class: "dg kucuk", text: "Yetki ver", onclick: function () { sb.rpc("site_yetkili_ekle", { p_site: SITE, p_email: e.eposta }).then(function (r) { toast(r.error ? "Hata: " + r.error.message : r.data); }); } }));
      }
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
  SEKMELER.forEach(function (s) { n.appendChild(el("button", { type: "button", "data-s": s[0], text: s[1], onclick: function () { sekme = s[0]; $("#form").scrollTop = 0; formCiz(); onizSayfa(ONIZ[sekme] || "index"); } })); });
}

/* ---------- önizleme ---------- */
var onizHazir = false, onizZaman = null;
function onizSayfa(id) {
  var s = $("#onizSayfa"); if (s.value !== id) s.value = id;
  onizHazir = false; $("#onizF").src = "../" + R.sayfaDosya(id) + "?onizleme=1" + (id === "pasta" ? "#siparis" : "");
}
function onizGonder() { clearTimeout(onizZaman); onizZaman = setTimeout(function () { var w = $("#onizF").contentWindow; if (w && onizHazir) w.postMessage({ tip: "hz-icerik", veri: JSON.parse(JSON.stringify(ic)) }, location.origin); }, 250); }
window.addEventListener("message", function (e) { if (e.origin === location.origin && e.data && e.data.tip === "hz-hazir") { onizHazir = true; onizGonder(); } });
function onizKur() {
  var s = $("#onizSayfa"); s.innerHTML = "";
  Object.keys(R.SAYFALAR).forEach(function (id) { s.appendChild(el("option", { value: id, text: R.SAYFALAR[id].ad })); });
  s.onchange = function () { onizSayfa(s.value); };
  $("#oniz").classList.add("tel");
  [].forEach.call(document.querySelectorAll(".cihaz button"), function (b) { b.onclick = function () { [].forEach.call(document.querySelectorAll(".cihaz button"), function (x) { x.setAttribute("aria-pressed", x === b); }); $("#oniz").classList.toggle("tel", b.dataset.c === "t"); }; });
  $("#onizAc").onclick = function () { $("#oniz").classList.add("ac"); };
  $("#onizKapat").onclick = function () { $("#oniz").classList.remove("ac"); };
  onizSayfa(ONIZ[sekme] || "index");
}

/* ---------- kaydet (yalnız yetkili + satır varken) ---------- */
function kaydet() {
  if (!yazabilir) return; durum("Kaydediliyor…"); $("#kaydet").disabled = true;
  ic.meta = Object.assign({}, ic.meta, { kaynak: "panel", tarih: new Date().toISOString().slice(0, 10) });
  sb.from("site_icerik").update({ veri: ic }).eq("site", SITE).select("guncelleme").then(function (r) {
    if (r.error || !r.data || !r.data.length) { durum("Kaydedilemedi", "kirli"); toast(r.error ? "Kaydedilemedi: " + r.error.message : "Kaydetme yetkiniz yok."); $("#kaydet").disabled = false; return; }
    kirli = false; try { localStorage.removeItem(TASLAK); } catch (e) {} durum(); toast("Kaydedildi — sitede yayında.");
  });
}

/* ---------- açılış ---------- */
function uyari(html) { var u = $("#uyari"); u.innerHTML = html; u.hidden = !html; }
function icerikGetir() {
  return sb.from("site_icerik").select("veri,guncelleme").eq("site", SITE).maybeSingle().then(function (r) {
    if (r.error) { dbHazir = false; satirYok = false; return null; }
    if (!r.data) { dbHazir = false; satirYok = true; return null; }
    dbHazir = true; return r.data.veri && r.data.veri.urunler ? r.data.veri : null;
  }, function () { dbHazir = false; return null; }).then(function (v) {
    return v || fetch("../veri/icerik.json", { cache: "no-cache" }).then(function (x) { return x.json(); });
  });
}
function uygulamaAc(user) {
  onizlemeKipi = !user;
  $("#giris").hidden = true; $("#uyg").hidden = false;
  var yetki = user ? Promise.all([sb.rpc("site_yazabilir", { p_site: SITE }).then(function (r) { return !r.error && r.data === true; }, function () { return false; }), sb.rpc("yonetici_mi").then(function (r) { return !r.error && r.data === true; }, function () { return false; })]) : Promise.resolve([false, false]);
  Promise.all([icerikGetir(), yetki]).then(function (s) {
    ic = s[0]; yazabilir = dbHazir && s[1][0]; yonetici = s[1][1];
    var t = null; try { t = JSON.parse(localStorage.getItem(TASLAK)); } catch (e) {}
    if (t && t.ic && t.ic.urunler && confirm("Bu tarayıcıda kaydedilmemiş bir taslağınız var (" + new Date(t.zaman).toLocaleString("tr-TR") + "). Açılsın mı?")) { ic = t.ic; kirli = true; }
    var u = [];
    if (!dbHazir) u.push("<b>Kurulum bekleniyor:</b> " + (satirYok ? "Hanzade içerik kaydı veritabanında henüz açılmadı" : "veritabanına ulaşılamadı") + "; şu an kaydetme ve fotoğraf yükleme kapalı. Değişiklikleri sağdaki önizlemede görebilir, “Yayın ve geçmiş → Yedek indir” ile Dijitabela'ya gönderebilirsiniz.");
    else if (onizlemeKipi) u.push("<b>Önizleme kipi:</b> giriş yapmadınız; değişiklikler kaydedilmez.");
    else if (!yazabilir) u.push("<b>" + R.esc(user.email || "") + "</b> hesabının bu sitede kaydetme yetkisi yok. Yetki için Dijitabela ile iletişime geçin. (Önizleme açık.)");
    uyari(u.join(" "));
    $("#cikis").textContent = onizlemeKipi ? "Girişe dön" : "Çıkış";
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
$("#gOniz").addEventListener("click", function () { uygulamaAc(null); });
$("#kaydet").addEventListener("click", kaydet);
$("#cikis").addEventListener("click", function () {
  if (kirli && yazabilir && !confirm("Kaydedilmemiş değişiklikler var. Çıkılsın mı?")) return; kirli = false;
  if (onizlemeKipi) { location.reload(); return; }
  sb.auth.signOut().then(function () { location.reload(); });
});
document.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); if (kirli && yazabilir) kaydet(); } });
if (location.hash === "#onizleme") uygulamaAc(null);
else sb.auth.getSession().then(function (r) { var s = r.data && r.data.session; if (s) uygulamaAc(s.user); else girisGoster(); });
sb.auth.onAuthStateChange(function (ev, s) { if (ev === "SIGNED_IN" && s && $("#uyg").hidden) uygulamaAc(s.user); });
})();
