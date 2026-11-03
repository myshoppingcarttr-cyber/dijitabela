/* Hanzade Fırın & Cafe · site betiği (Dijitabela, 1 Kas 2026)
   İçerik: sayfaya gömülü veri (onuret.js) → Supabase'de daha yeni yayın varsa onunla yeniden çizim → panel önizlemesinde (?onizleme=1) panelden gelen içerik.
   Davranışlar: açık/kapalı durumu, bugün fırından çıkanlar, pasta filtresi, Google yorum karekodu, pasta sipariş sihirbazı, kurumsal talep formu, katalog yazdırma.
   Hiçbir form verisi sunucuya gönderilmez: mesaj metni yalnız kullanıcının cihazında oluşur ve onun dokunuşuyla WhatsApp'a/telefona aktarılır. */
(function () {
"use strict";
var D = document, H = D.documentElement, $ = function (s, k) { return (k || D).querySelector(s); }, $$ = function (s, k) { return [].slice.call((k || D).querySelectorAll(s)); };
var CFG = window.HZ_CFG || {}, SAYFA = H.getAttribute("data-sayfa") || "index";
var Q = new URLSearchParams(location.search), ONIZ = Q.has("onizleme");
var IC = null;
function R() { return window.HZRender; }
function esc(s) { return R() ? R().esc(s) : String(s == null ? "" : s); }

/* ---------- içerik ---------- */
function gomulu() { try { return JSON.parse($("#hz-veri").textContent); } catch (e) { return null; } }
function zamanli(p, ms) { return Promise.race([p, new Promise(function (_, r) { setTimeout(function () { r(new Error("zaman aşımı")); }, ms); })]); }
function sbIcerik() {
  var sb = CFG.sb; if (!sb || !sb.url || location.protocol === "file:") return Promise.reject(0);
  return zamanli(fetch(sb.url + "/rest/v1/site_icerik?site=eq." + encodeURIComponent(CFG.site || "hanzade") + "&select=veri,guncelleme", { headers: { apikey: sb.key } }), 2500)
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (j) { var v = j && j[0] && j[0].veri; if (!v || !v.urunler) throw 0; v.meta = v.meta || {}; v.meta.guncelleme = j[0].guncelleme; return v; });
}
function ciz(ic) {
  if (!R() || !ic) return; IC = ic; var y = window.scrollY;
  R().yenidenCiz(ic, SAYFA); davranislar();
  if (ONIZ) window.scrollTo(0, y);
}
function basla() {
  IC = gomulu(); davranislar();
  if (ONIZ) {
    window.addEventListener("message", function (e) { if (e.origin !== location.origin || !e.data || e.data.tip !== "hz-icerik") return; ciz(e.data.veri); });
    try { parent.postMessage({ tip: "hz-hazir" }, location.origin); } catch (e) {}
    // önizlemede sayfa içi bağlantılar da önizleme kipinde kalsın
    D.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest("a[href]"); if (!a) return; var h = a.getAttribute("href"); if (/^[a-z-]+\.html/.test(h)) { e.preventDefault(); var p = h.split("#"); location.href = p[0] + (p[0].indexOf("?") > -1 ? "&" : "?") + "onizleme=1" + (p[1] ? "#" + p[1] : ""); } });
    return;
  }
  sbIcerik().then(function (ic) { if (ic.meta.guncelleme !== CFG.guncelleme) ciz(ic); }, function () {});
}

/* ---------- saat / durum ---------- */
function dk(s) { var p = String(s || "0:0").split(":"); return +p[0] * 60 + +p[1]; }
function simdi() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function bugunSaat() { var g = R() ? R().GUNLER_JS[new Date().getDay()] : ""; return ((IC && IC.isletme && IC.isletme.saatler) || []).filter(function (s) { return s.gun === g; })[0]; }
function durum() {
  var e = $("#durum"), s = bugunSaat(); if (!e || !s) return;
  var n = simdi(), acik = !s.kapali && n >= dk(s.acilis) && n < dk(s.kapanis), t;
  if (acik) { var kal = dk(s.kapanis) - n; t = "Şu an açık · " + (kal <= 60 ? "kapanışa " + kal + " dk" : s.kapanis + "'a kadar"); }
  else t = "Şu an kapalı · " + (!s.kapali && n < dk(s.acilis) ? "bugün " + s.acilis + "'da açılıyor" : "yarın sabah açılıyor");
  e.className = "durum" + (acik ? " a" : " k"); e.querySelector("span").textContent = t;
}
function saatTablo() { var g = R() ? R().GUNLER_JS[new Date().getDay()] : ""; $$("[data-saat] tr").forEach(function (tr) { var b = tr.getAttribute("data-gun") === g; tr.classList.toggle("bu", b); if (b && !/bugün/.test(tr.cells[0].textContent)) tr.cells[0].textContent += " (bugün)"; }); }
function fark(f) { if (f == null) return "Bugün henüz çıkmadı"; if (f < 1) return "Az önce çıktı"; if (f < 60) return f + " dk önce"; return Math.floor(f / 60) + " sa " + (f % 60) + " dk önce"; }
function taze() {
  var t = $("#tazeT"); if (!t || !IC || !IC.taze) return;
  var b = $("#bugun"); if (b) b.textContent = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
  var n = simdi(), L = (IC.taze.liste || []).filter(function (x) { return x && x.ad; });
  $$("tbody tr", t).forEach(function (tr) {
    var x = L[+tr.getAttribute("data-i")]; if (!x) return; var son = null, sonraki = null;
    (x.saatler || []).slice().sort().forEach(function (s) { if (dk(s) <= n) son = s; else if (!sonraki) sonraki = s; });
    var f = son ? n - dk(son) : null, sicak = f != null && f <= 45;
    tr.querySelector(".son").innerHTML = (son ? '<span class="' + (sicak ? "sicak" : "") + '">' + son + "</span>" : "—") + "<small>" + fark(f) + "</small>";
    tr.querySelector(".sonraki").textContent = sonraki || "Yarın";
  });
}

/* ---------- karekod ---------- */
function karekod() {
  $$("[data-qr]").forEach(function (el) {
    var u = el.getAttribute("data-qr"); if (!u) return;
    if (!window.qrcode) { el.innerHTML = '<a href="' + esc(u) + '" target="_blank" rel="noopener">Google\'da yorum yazın</a>'; return; }
    try { var q = qrcode(0, "M"); q.addData(u); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }) + "<small>OKUTUN · GOOGLE'DA YORUM YAZIN</small>"; } catch (e) {}
  });
}

/* ---------- pasta filtresi ---------- */
function filtre() {
  var f = $("#pastaFiltre"), izg = $("#pastaIzg"); if (!f || !izg) return;
  $$("button", f).forEach(function (b) { b.onclick = function () { $$("button", f).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); var g = b.getAttribute("data-g"); $$(".pasta", izg).forEach(function (k) { k.hidden = !(g === "hepsi" || k.getAttribute("data-grup") === g); }); }; });
}

/* ---------- gönder: WhatsApp ya da telefon ---------- */
function gonderHTML(metin, etiket) {
  var r = R(), w = r.waLink(IC, metin), tel = IC.isletme.telefon || "", tl = r.telLink(tel);
  if (w) return '<a class="btn wa" href="' + esc(w) + '" target="_blank" rel="noopener">' + esc(etiket || "WhatsApp ile gönder") + "</a>";
  return '<a class="btn d" href="' + esc(tl) + '">' + esc(tel) + "'i arayın</a>" + '<button type="button" class="btn" data-kopya>Özeti kopyala</button>' +
    '<p class="not">Siparişi telefonla verirken bu özeti okuyabilirsiniz.</p>';
}
function kopyaBagla(kap, metin) {
  var b = $("[data-kopya]", kap); if (!b) return;
  b.onclick = function () {
    var ok = function () { b.textContent = "Kopyalandı ✓"; setTimeout(function () { b.textContent = "Özeti kopyala"; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(metin).then(ok, function () {}); else { var t = D.createElement("textarea"); t.value = metin; D.body.appendChild(t); t.select(); try { D.execCommand("copy"); ok(); } catch (e) {} t.remove(); }
  };
}

/* ---------- pasta sipariş sihirbazı ---------- */
var AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"], GUNK = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
var SAATLER = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
var ADIMLAR = ["Model", "Boy", "Gün ve saat", "Pasta üzeri yazı", "Teslim", "Özet"];
var S = null;
function modeller() {
  var r = R(), l = r.cesitler(IC).map(function (c) { return { id: c.id, ad: c.ad, aciklama: c.aciklama, gorsel: c.gorsel, yb: false }; });
  if (r.yilbasiAcik(IC)) l = (IC.duyurular.yilbasi.modeller || []).filter(function (m) { return m && m.ad; }).map(function (m) { return { id: m.id, ad: m.ad + " (yılbaşı)", aciklama: m.aciklama, gorsel: m.gorsel, yb: true }; }).concat(l);
  return l;
}
function gunListesi(yb) {
  var g = [], d = new Date(); d.setHours(0, 0, 0, 0);
  if (yb) { var y = d.getFullYear(); [28, 29, 30, 31].forEach(function (n) { var x = new Date(y, 11, n); if (x >= d) g.push(x); }); if (g.length) return g; }
  var on = Math.max(0, Number(((IC.pasta || {}).on_gun)) || 1);
  for (var i = on; i < on + 14; i++) { var x = new Date(d); x.setDate(d.getDate() + i); g.push(x); }
  return g;
}
function iso(x) { return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
function gunYaz(x) { return x.getDate() + " " + AY[x.getMonth()] + " " + ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"][x.getDay()]; }
function secModel() { var M = modeller(); return M.filter(function (m) { return m.id === S.model; })[0]; }
function secBoy() { return R().boylar(IC).filter(function (b) { return String(b.id) === String(S.boy); })[0]; }
function ozetMetin() {
  var m = secModel(), b = secBoy();
  return "Merhaba Hanzade, web sitenizden pasta siparişi vermek istiyorum.\n" +
    "• Model: " + (m ? m.ad : "-") + "\n" +
    "• Boy: " + (b ? b.ad + " (" + (b.kisi || "") + ") · " + R().tl(b.fiyat) + (m && m.yb ? " + süs farkı" : "") : "-") + "\n" +
    "• Teslim: " + (S.tarihYazi || "-") + " · " + S.saat + "\n" +
    "• Pasta üzeri yazı: " + (S.yazi ? "\"" + S.yazi + "\"" : "Yazısız") + "\n" +
    (S.not ? "• Not: " + S.not + "\n" : "") +
    "• Teslim şekli: " + (S.teslim === "gelal" ? "Gel-al (Uncalı Cad. No:2/A)" : "Adrese teslim: " + S.adres) + "\n" +
    "• Ad soyad: " + S.ad + (S.tel ? "\n• Telefon: " + S.tel : "");
}
function hazirMi() {
  switch (S.adim) {
    case 0: return !!secModel();
    case 1: return !!secBoy();
    case 2: return !!S.tarih && !!S.saat;
    case 3: return true;
    case 4: return S.ad.trim().length >= 2 && (S.teslim === "gelal" || S.adres.trim().length >= 8);
    default: return true;
  }
}
function sihirbaz() {
  var k = $("#sihirbaz"); if (!k || !IC) return;
  if (!S) { S = { adim: 0, model: Q.get("model") || "", boy: "", tarih: "", tarihYazi: "", saat: "14:00", yazi: "", not: "", teslim: "gelal", adres: "", ad: "", tel: "" }; if (secModel()) S.adim = 1; else S.model = ""; }
  sihirbazCiz();
}
function sihirbazCiz() {
  if (S.adim > 0 && !secModel()) S.adim = 0;
  if (S.adim > 1 && !secBoy()) S.adim = 1;
  if (S.adim > 2 && !S.tarih) S.adim = 2;
  var k = $("#sihirbaz"), r = R(), m = secModel(), b = secBoy(), h = "";
  var cubuk = '<ol class="sb-adim" aria-label="Adımlar">' + ADIMLAR.map(function (a, i) { return '<li class="' + (i < S.adim ? "ok" : i === S.adim ? "su" : "") + '"' + (i === S.adim ? ' aria-current="step"' : "") + "><span>" + (i + 1) + "</span><em>" + a + "</em></li>"; }).join("") + "</ol>";
  if (S.adim === 0) {
    h = "<h3>Hangi pasta?</h3><p class=\"al\">Fotoğraftaki süsleme örnektir; her çeşidi istediğiniz süslemeyle yaparız.</p><div class=\"sb-model\">" + modeller().map(function (x) {
      return '<button type="button" data-m="' + esc(x.id) + '" aria-pressed="' + (S.model === x.id) + '">' + (x.gorsel ? '<img src="' + esc(x.gorsel) + '" alt="" loading="lazy">' : '<span class="sb-bos">' + esc(x.ad.charAt(0)) + "</span>") + "<b>" + esc(x.ad) + "</b><small>" + esc(x.aciklama || "") + "</small></button>";
    }).join("") + "</div>";
  } else if (S.adim === 1) {
    h = "<h3>Kaç kişilik?</h3><p class=\"al\">" + esc(m.ad) + (m.yb ? " · süslemeye göre fiyat farkı siparişte bildirilir." : "") + "</p><div class=\"sb-sec\">" + r.boylar(IC).map(function (x) {
      return '<button type="button" data-b="' + esc(x.id) + '" aria-pressed="' + (String(S.boy) === String(x.id)) + '"><span><b>' + esc(x.kisi || x.ad) + "</b><small>" + esc(x.ad) + "</small></span><strong>" + r.tl(x.fiyat) + "</strong></button>";
    }).join("") + "</div>";
  } else if (S.adim === 2) {
    var G = gunListesi(m.yb);
    h = "<h3>Ne zaman lazım?</h3><p class=\"al\">" + (m.yb ? "Yılbaşı pastaları 28–31 Aralık arası teslim edilir." : (Number((IC.pasta || {}).on_gun) > 0 ? "Pastalar en az " + Number(IC.pasta.on_gun) + " gün önceden hazırlanır. Daha erken lazımsa bizi arayın." : "İstediğiniz günü seçin; hazırlık süresini ve gerekiyorsa kapora bilgisini siparişinizi onaylarken netleştiririz.")) + "</p>" +
      '<div class="sb-gun" role="group" aria-label="Teslim günü">' + G.map(function (x, i) { var v = iso(x); return '<button type="button" data-t="' + v + '" data-y="' + esc(gunYaz(x)) + '" aria-pressed="' + (S.tarih === v) + '"><small>' + (i === 0 && !m.yb && (Number((IC.pasta || {}).on_gun) || 1) === 1 ? "Yarın" : GUNK[x.getDay()]) + "</small><b>" + x.getDate() + "</b><small>" + AY[x.getMonth()].slice(0, 3) + "</small></button>"; }).join("") + "</div>" +
      '<p class="sb-et">Teslim saati</p><div class="sb-saat" role="group" aria-label="Teslim saati">' + SAATLER.map(function (s) { return '<button type="button" data-s="' + s + '" aria-pressed="' + (S.saat === s) + '">' + s + "</button>"; }).join("") + "</div>";
  } else if (S.adim === 3) {
    h = '<h3>Pastanın üzerine ne yazalım?</h3><p class="al">En fazla 30 harf. Yazı istemiyorsanız boş bırakın.</p><label class="sb-alan">Pasta üzeri yazı<input id="sbYazi" maxlength="30" placeholder="Örn. İyi ki doğdun Elif" value="' + esc(S.yazi) + '"></label>' +
      '<div class="sb-onz" aria-hidden="true"><div' + (m.gorsel ? ' style="background-image:url(\'' + esc(m.gorsel) + '\')"' : "") + '><span id="sbOnz">' + esc(S.yazi || "İyi ki doğdun") + "</span></div></div>" +
      '<label class="sb-alan">Not (isteğe bağlı)<textarea id="sbNot" rows="2" maxlength="200" placeholder="Renk, süsleme, alerji, mum isteği…">' + esc(S.not) + "</textarea></label>";
  } else if (S.adim === 4) {
    h = '<h3>Nasıl teslim alacaksınız?</h3><div class="sb-sec">' +
      '<button type="button" data-tes="gelal" aria-pressed="' + (S.teslim === "gelal") + '"><span><b>Gel-al</b><small>' + esc(r.tamAdres(IC)) + "</small></span></button>" +
      '<button type="button" data-tes="adres" aria-pressed="' + (S.teslim === "adres") + '"><span><b>Adrese teslim</b><small>Teslim ücreti ve saati sipariş onayında bildirilir.</small></span></button></div>' +
      (S.teslim === "adres" ? '<label class="sb-alan">Teslim adresi<textarea id="sbAdres" rows="2" autocomplete="street-address" placeholder="Mahalle, cadde, apartman, daire">' + esc(S.adres) + "</textarea></label>" : "") +
      '<label class="sb-alan">Adınız soyadınız<input id="sbAd" autocomplete="name" value="' + esc(S.ad) + '"></label>' +
      '<label class="sb-alan">Telefon (isteğe bağlı)<input id="sbTel" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(S.tel) + '"></label>';
  } else {
    var metin = ozetMetin();
    h = "<h3>Sipariş özeti</h3>" +
      '<table class="sb-ozet"><tr><th>Model</th><td>' + esc(m.ad) + "</td></tr><tr><th>Boy</th><td>" + esc(b.ad + " · " + (b.kisi || "")) + "</td></tr><tr><th>Teslim</th><td>" + esc(S.tarihYazi + " · " + S.saat) + "</td></tr><tr><th>Yazı</th><td>" + esc(S.yazi || "Yazısız") + "</td></tr>" +
      (S.not ? "<tr><th>Not</th><td>" + esc(S.not) + "</td></tr>" : "") + "<tr><th>Teslim şekli</th><td>" + esc(S.teslim === "gelal" ? "Gel-al" : "Adrese: " + S.adres) + "</td></tr><tr><th>Ad</th><td>" + esc(S.ad) + "</td></tr>" +
      '<tr class="top"><th>Tutar</th><td>' + r.tl(b.fiyat) + (m.yb ? " + süs farkı" : "") + "</td></tr></table>" +
      '<p class="not">Siparişiniz biz onaylayınca kesinleşir. Kapora ve teslim ayrıntısını size yazarak bildiririz.</p>' +
      '<details class="sb-mesaj"><summary>Gönderilecek mesajı gör</summary><pre>' + esc(metin) + "</pre></details>" +
      '<div class="sb-gonder" id="sbGonder">' + gonderHTML(metin) + "</div>";
  }
  var alt = '<div class="sb-alt"><div><small>' + (b ? "Tutar" : "Adım " + (S.adim + 1) + " / " + ADIMLAR.length) + "</small><strong>" + (b ? r.tl(b.fiyat) + (m && m.yb ? " +" : "") : "—") + "</strong></div><div class=\"dug\">" +
    (S.adim > 0 ? '<button type="button" class="btn" data-geri>Geri</button>' : "") +
    (S.adim < 5 ? '<button type="button" class="btn d" data-ileri' + (hazirMi() ? "" : " disabled") + ">" + (S.adim === 4 ? "Özeti gör" : "Devam") + "</button>" : '<button type="button" class="btn" data-bastan>Yeni sipariş</button>') + "</div></div>";
  k.innerHTML = cubuk + '<div class="sb-ic" id="sbIc">' + h + "</div>" + alt;
  // olaylar
  function yenile() { var i = $("[data-ileri]", k); if (i) i.disabled = !hazirMi(); }
  $$("[data-m]", k).forEach(function (x) { x.onclick = function () { S.model = x.getAttribute("data-m"); S.tarih = ""; S.adim = 1; sihirbazCiz(); odak(); }; });
  $$("[data-b]", k).forEach(function (x) { x.onclick = function () { S.boy = x.getAttribute("data-b"); sihirbazCiz(); }; });
  $$("[data-t]", k).forEach(function (x) { x.onclick = function () { S.tarih = x.getAttribute("data-t"); S.tarihYazi = x.getAttribute("data-y"); sihirbazCiz(); }; });
  $$("[data-s]", k).forEach(function (x) { x.onclick = function () { S.saat = x.getAttribute("data-s"); sihirbazCiz(); }; });
  $$("[data-tes]", k).forEach(function (x) { x.onclick = function () { S.teslim = x.getAttribute("data-tes"); sihirbazCiz(); }; });
  var y = $("#sbYazi", k); if (y) y.oninput = function () { S.yazi = y.value; $("#sbOnz", k).textContent = y.value || "İyi ki doğdun"; };
  var n = $("#sbNot", k); if (n) n.oninput = function () { S.not = n.value; };
  var ad = $("#sbAdres", k); if (ad) ad.oninput = function () { S.adres = ad.value; yenile(); };
  var a2 = $("#sbAd", k); if (a2) a2.oninput = function () { S.ad = a2.value; yenile(); };
  var t2 = $("#sbTel", k); if (t2) t2.oninput = function () { S.tel = t2.value; };
  var g = $("[data-geri]", k); if (g) g.onclick = function () { S.adim--; sihirbazCiz(); odak(); };
  var i = $("[data-ileri]", k); if (i) i.onclick = function () { if (!hazirMi()) return; S.adim++; sihirbazCiz(); odak(); };
  var bs = $("[data-bastan]", k); if (bs) bs.onclick = function () { S = null; history.replaceState(null, "", location.pathname + (ONIZ ? "?onizleme=1" : "") + "#siparis"); Q.delete("model"); sihirbaz(); odak(); };
  if (S.adim === 5) kopyaBagla(k, ozetMetin());
}
function odak() { var k = $("#sihirbaz"); if (!k) return; var t = k.getBoundingClientRect().top; if (t < 0 || t > window.innerHeight * .5) window.scrollTo({ top: window.scrollY + t - 90, behavior: "smooth" }); var h = $("#sbIc h3", k); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }

/* ---------- kurumsal talep formu ---------- */
function kurumsal() {
  var f = $("#kurumsalForm"), son = $("#kurumsalSon"); if (!f || !son || !IC) return;
  function v(n) { var e = f.elements[n]; return e ? String(e.value || "").trim() : ""; }
  function metin() {
    var t = v("tarih") ? v("tarih").split("-").reverse().join(".") : "";
    return "Merhaba Hanzade, web sitenizden kurumsal talep:\n• Firma: " + (v("firma") || "-") + "\n• Yetkili: " + (v("ad") || "-") + (v("tel") ? "\n• Telefon: " + v("tel") : "") +
      "\n• Talep: " + v("talep") + (v("kisi") ? "\n• Kişi sayısı: " + v("kisi") : "") + (t ? "\n• Tarih: " + t : "") + (v("not") ? "\n• Not: " + v("not") : "");
  }
  function guncel() { var ok = v("firma").length >= 2 && v("ad").length >= 2; son.innerHTML = ok ? gonderHTML(metin(), "WhatsApp ile gönder") : '<p class="not">Firma ve yetkili adını yazınca gönderme düğmesi açılır.</p>'; kopyaBagla(son, metin()); }
  f.oninput = guncel; f.onchange = guncel; f.onsubmit = function (e) { e.preventDefault(); }; guncel();
}

/* ---------- genel ---------- */
function menu() {
  var b = $("#menuDg"), n = $("#nav"); if (!b || !n) return;
  b.onclick = function () { var a = n.classList.toggle("ac"); b.setAttribute("aria-expanded", a); b.setAttribute("aria-label", a ? "Menüyü kapat" : "Menüyü aç"); D.body.classList.toggle("menu-acik", a); };
}
function yazdir() { $$("[data-yazdir]").forEach(function (b) { b.onclick = function () { window.print(); }; }); var t = $("[data-tarih]"); if (t) t.textContent = "Güncelleme: " + new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); }
function davranislar() { menu(); durum(); saatTablo(); taze(); karekod(); filtre(); sihirbaz(); kurumsal(); yazdir(); }
setInterval(function () { durum(); taze(); }, 60000);
if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", basla); else basla();
window.HZ = { icerik: function () { return IC; } };
})();
