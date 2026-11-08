/* Yorgancı Ramazan · sepet, filtre, seçici, formlar. Sunucu yok: sipariş WhatsApp / e-posta ile ustaya gider. */
(function () {
  "use strict";
  var C = window.YR || {}, U = window.YR_U || [], F = window.YR_FIYAT || {}, A = window.YR_AYAR || {};
  for (var ak in A) C[ak] = A[ak];
  U.forEach(function (u) { u.fiyat = F[u.id] || {}; });
  var KOK = document.documentElement.getAttribute("data-kok") || "./";
  var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var TL = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  var urun = function (id) { for (var i = 0; i < U.length; i++) if (U[i].id === id) return U[i]; return null; };
  var anahtar = function (u, sec) { return sec.join("|"); };
  var fiyatBul = function (u, sec) { var f = u.fiyat[anahtar(u, sec)]; return typeof f === "number" ? f : 0; };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var wa = function (metin) { return "https://wa.me/" + C.wa + "?text=" + encodeURIComponent(metin); };

  // ---- depolama (gizli pencerede yoksa bellekte tut)
  var bellek = {};
  function oku(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return bellek[k] || v; } }
  function yaz(k, v) { bellek[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var sepet = function () { return oku("yr-sepet", []); };
  function sepetYaz(s) { yaz("yr-sepet", s); rozet(); }
  function rozet() { var n = sepet().reduce(function (a, x) { return a + x.adet; }, 0); $$("[data-sepet-adet]").forEach(function (e) { e.textContent = n; }); }
  function bildir(m) { var b = $("#bildirim"); if (!b) return; b.textContent = m; b.classList.add("goster"); clearTimeout(bildir.t); bildir.t = setTimeout(function () { b.classList.remove("goster"); }, 2600); }
  function ekle(id, sec, adet) {
    var u = urun(id); if (!u) return; var f = fiyatBul(u, sec); if (!f) { location.href = wa("Merhaba Ramazan usta, " + u.ad + " (" + sec.join(", ") + ") için fiyat almak istiyorum."); return; }
    var s = sepet(), k = id + "::" + sec.join("|"), var_ = null;
    s.forEach(function (x) { if (x.k === k) var_ = x; });
    if (var_) var_.adet = Math.min(99, var_.adet + adet); else s.push({ k: k, id: id, sec: sec, adet: adet });
    sepetYaz(s); bildir(u.ad + " sepete eklendi");
  }
  function sepetSatirlari() {
    return sepet().map(function (x) { var u = urun(x.id); if (!u || !Array.isArray(x.sec) || !fiyatBul(u, x.sec)) return null; var f = fiyatBul(u, x.sec); return { x: x, u: u, birim: f, tutar: f * x.adet }; }).filter(Boolean);
  }
  function kargoUcreti(ara, teslim) {
    if (teslim !== "kargo") return 0;
    return ara >= C.kargo.esik ? 0 : C.kargo.ucret;
  }

  // ---- kart "sepete ekle" (varsayılan seçenek)
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-hizli-ekle]"); if (!b) return;
    var u = urun(b.getAttribute("data-hizli-ekle")); if (!u) return;
    ekle(u.id, u.secim.map(function (s) { return s.d[0]; }), 1);
  });

  // ---- ürün sayfası
  var detay = $("[data-urun-detay]");
  if (detay) {
    var u = urun(detay.getAttribute("data-urun-detay")), sel = $$("select[data-secim]", detay), adetI = $("#adet", detay);
    var guncelle = function () {
      var sec = sel.map(function (s) { return s.value; }), f = fiyatBul(u, sec);
      $("#fiyat-goster").textContent = f ? TL(f) : "Teklif ile";
      $("#ekle-dugme").textContent = f ? "Sepete ekle" : "Fiyat al (WhatsApp)";
      $("#wa-sor").href = wa("Merhaba Ramazan usta, sitenizden yazıyorum. " + u.ad + " (" + sec.join(", ") + ") hakkında bilgi almak istiyorum.");
    };
    sel.forEach(function (s) { s.addEventListener("change", guncelle); });
    $$("[data-adet]", detay).forEach(function (b) { b.addEventListener("click", function () { adetI.value = Math.max(1, Math.min(99, (+adetI.value || 1) + (+b.getAttribute("data-adet")))); }); });
    $("#ekle-dugme").addEventListener("click", function () { ekle(u.id, sel.map(function (s) { return s.value; }), Math.max(1, +adetI.value || 1)); });
    guncelle();
  }

  // ---- katalog filtresi
  var katalog = $("[data-katalog]");
  if (katalog) {
    var durum = { kat: "hepsi", dolgu: "hepsi", sira: "onerilen" }, kartlar = $$(".kart", katalog);
    var p = new URLSearchParams(location.search); if (p.get("kat")) durum.kat = p.get("kat"); if (p.get("dolgu")) durum.dolgu = p.get("dolgu");
    var uygula = function () {
      var sayi = 0;
      kartlar.forEach(function (k) { var g = (durum.kat === "hepsi" || k.dataset.kat === durum.kat) && (durum.dolgu === "hepsi" || k.dataset.dolgu === durum.dolgu); k.hidden = !g; if (g) sayi++; });
      var sirali = kartlar.slice().sort(function (a, b) {
        if (durum.sira === "artan") return (+a.dataset.fiyat || 1e9) - (+b.dataset.fiyat || 1e9);
        if (durum.sira === "azalan") return (+b.dataset.fiyat || 0) - (+a.dataset.fiyat || 0);
        return +a.dataset.sira - +b.dataset.sira;
      });
      sirali.forEach(function (k) { katalog.appendChild(k); });
      $$("[data-f-kat]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.fKat === durum.kat); });
      $$("[data-f-dolgu]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.fDolgu === durum.dolgu); });
      var s = $("#sonuc-sayi"); if (s) s.textContent = sayi + " ürün";
    };
    $$("[data-f-kat]").forEach(function (b) { b.addEventListener("click", function () { durum.kat = b.dataset.fKat; uygula(); }); });
    $$("[data-f-dolgu]").forEach(function (b) { b.addEventListener("click", function () { durum.dolgu = b.dataset.fDolgu; uygula(); }); });
    var sr = $("#sira"); if (sr) sr.addEventListener("change", function () { durum.sira = sr.value; uygula(); });
    uygula();
  }

  // ---- doğru yorganı seç
  $$("[data-quiz]").forEach(function (q) {
    var sorular = $$(".soru", q), cevap = {}, i = 0;
    var goster = function () { sorular.forEach(function (s, j) { s.classList.toggle("aktif", j === i); }); var il = $(".ilerleme", q); if (il) il.textContent = "SORU " + (i + 1) + " / " + sorular.length; };
    $$(".cevaplar button", q).forEach(function (b) {
      b.addEventListener("click", function () {
        cevap[b.closest(".soru").dataset.soru] = b.dataset.deger;
        i++; if (i < sorular.length) { goster(); var ilk = $(".soru.aktif button", q); if (ilk) ilk.focus(); } else sonuc();
      });
    });
    function sonuc() {
      var p = { yun: 0, pamuk: 0, silikon: 0, boncuk: 0, elyaf: 0 }, neden = [];
      if (cevap.kim === "cocuk") { p.pamuk += 3; p.silikon += 2; neden.push("Çocuk yatağında hafif, yıkanabilir ya da nefes alan dolgu öne çıkar."); }
      if (cevap.isi === "usur") { p.yun += 3; p.boncuk += 1; neden.push("Üşüyorsanız yün, ısıyı en iyi tutan dolgudur; boncuk silikon da kabarık ve sıcak tutar."); }
      if (cevap.isi === "terler") { p.pamuk += 3; p.yun += 1; p.silikon -= 1; p.elyaf -= 1; neden.push("Terliyorsanız nem emen ve nefes alan pamuk (ve yün) daha rahat ettirir."); }
      if (cevap.isi === "normal") { p.pamuk += 1; p.silikon += 1; p.yun += 1; }
      if (cevap.alerji === "evet") { p.silikon += 2; p.boncuk += 3; p.yun -= 1; neden.push("Alerji/astım varsa 60 °C'ye kadar yıkanabilen sentetik dolgu ve sık yıkanan kılıf pratik olur; doktorunuzun önerisi önceliklidir."); }
      if (cevap.agirlik === "agir") { p.yun += 2; p.pamuk += 2; neden.push("Sarıp sarmalayan, ağır yorgan sevenler el dikimi yün/pamuğu sever."); }
      if (cevap.agirlik === "hafif") { p.boncuk += 2; p.silikon += 2; p.elyaf += 1; p.yun -= 1; neden.push("Hafif yorgan sevenler için silikon ve boncuk silikon iyi seçeneklerdir."); }
      if (cevap.bakim === "makine") { p.boncuk += 2; p.silikon += 2; p.elyaf += 1; p.yun -= 1; p.pamuk -= 1; neden.push("Makinede yıkamak istiyorsanız boncuk silikon ve silikon kolaydır; boncuk silikon yıkamadan sonra topaklanmaz."); }
      if (cevap.bakim === "kabartma") { p.yun += 2; p.pamuk += 1; neden.push("Yün ve pamuk yıkanmaz ama dükkânda kabartılıp yıllarca yenilenir."); }
      var sira = Object.keys(p).sort(function (a, b) { return p[b] - p[a]; }).slice(0, 2);
      var es = { yun: "yun-yorgan", pamuk: "pamuk-yorgan", silikon: "silikon-yorgan", boncuk: "boncuk-silikon-yorgan", elyaf: "elyaf-yorgan" };
      if (cevap.kim === "cocuk") neden.push("Çocuk yatağı için yorganı küçük ölçüde (ör. 95×145 cm) diktirebilirsiniz; ölçüyü sipariş notuna yazın. 1 yaş altı bebeklere yorgan önerilmez.");
      var html = sira.map(function (d, j) { var u = urun(es[d]); if (!u) return ""; return '<div class="oneri"><img src="' + KOK + "img/" + u.gorsel + '-s.webp" alt="" loading="lazy" width="96" height="72"><div><b>' + (j ? "İkinci seçenek: " : "Önerimiz: ") + u.ad + "</b><br><a href=\"" + KOK + "urunler/" + u.id + '.html">Ürünü incele →</a></div></div>'; }).join("");
      var s = $(".sonuc", q); $(".oneriler", s).innerHTML = html; $(".nedenler", s).innerHTML = neden.map(function (n) { return "<li>" + n + "</li>"; }).join("");
      var wq = $(".sonuc-wa", s); if (wq) wq.href = wa("Merhaba Ramazan usta, sitedeki yorgan seçiciyi doldurdum. Önerilen: " + sira.map(function (d) { var u = urun(es[d]); return u ? u.ad : d; }).join(" / ") + ". Bilgi alabilir miyim?");
      sorular.forEach(function (x) { x.classList.remove("aktif"); }); var il = $(".ilerleme", q); if (il) il.textContent = "SONUÇ";
      s.classList.add("aktif"); s.setAttribute("tabindex", "-1"); s.focus();
    }
    var bas = $(".yeniden", q); if (bas) bas.addEventListener("click", function () { i = 0; cevap = {}; $(".sonuc", q).classList.remove("aktif"); goster(); });
    goster();
  });

  // ---- isteğe özel üretim formu
  var oz = $("#ozel-form");
  if (oz) {
    var metin = function () {
      var f = new FormData(oz), s = ["Merhaba Ramazan usta, sitenizden İSTEĞE ÖZEL ÜRETİM talebi:"];
      [["urun", "Ürün"], ["olcu", "Ölçü"], ["en", "Özel en (cm)"], ["boy", "Özel boy (cm)"], ["dolgu", "Dolgu"], ["agirlik", "Dolgu ağırlığı"], ["yuz", "Yüz kumaşı"], ["renk", "Renk"], ["desen", "Desen / işleme"], ["adet", "Adet"], ["tarih", "İstenen teslim"], ["ad", "Ad soyad"], ["tel", "Telefon"], ["ilce", "İl / ilçe"], ["not", "Not"]].forEach(function (a) { var v = (f.get(a[0]) || "").toString().trim(); if (v) s.push("• " + a[1] + ": " + v); });
      return s.join("\n");
    };
    var olcuSec = $("#olcu", oz), ozelAlan = $("#ozel-olcu", oz);
    var ol = function () { ozelAlan.hidden = olcuSec.value !== "Özel ölçü"; }; olcuSec.addEventListener("change", ol); ol();
    oz.addEventListener("submit", function (e) { e.preventDefault(); if (!oz.reportValidity()) return; window.open(wa(metin()), "_blank", "noopener"); });
    $("#ozel-eposta").addEventListener("click", function () { if (!oz.reportValidity()) return; location.href = "mailto:" + C.eposta + "?subject=" + encodeURIComponent("İsteğe özel üretim talebi") + "&body=" + encodeURIComponent(metin()); });
  }

  // ---- sepet sayfası
  var sp = $("#sepet-liste");
  function sepetCiz() {
    var satir = sepetSatirlari(), ara = satir.reduce(function (a, r) { return a + r.tutar; }, 0);
    if (!satir.length) { sp.innerHTML = '<p>Sepetiniz boş. <a href="' + KOK + 'urunler/">Ürünlere göz atın</a>.</p>'; $("#sepet-ozet").hidden = true; return; }
    $("#sepet-ozet").hidden = false;
    sp.innerHTML = satir.map(function (r) {
      return '<div class="sepet-satir"><img src="' + KOK + "img/" + (r.u.gorsel || "yun-ham") + '-s.webp" alt="" width="72" height="72" loading="lazy"><div><div class="ust-s"><div><b><a href="' + KOK + "urunler/" + r.u.id + '.html">' + r.u.ad + '</a></b><br><span class="kucuk soluk">' + esc(r.x.sec.join(" · ")) + '</span></div><b>' + TL(r.tutar) + '</b></div><div class="kontrol"><span class="adet-kutu"><button type="button" aria-label="Azalt" data-d="-1" data-k="' + esc(r.x.k) + '">−</button><input aria-label="Adet" inputmode="numeric" value="' + r.x.adet + '" data-a="' + esc(r.x.k) + '"><button type="button" aria-label="Arttır" data-d="1" data-k="' + esc(r.x.k) + '">+</button></span><span class="kucuk soluk">Birim: ' + TL(r.birim) + '</span><button type="button" class="sil" data-sil="' + esc(r.x.k) + '">Kaldır</button></div></div></div>';
    }).join("");
    $("#ara-toplam").textContent = TL(ara);
  }
  if (sp) {
    sp.addEventListener("click", function (e) {
      var d = e.target.closest("[data-d]"), sl = e.target.closest("[data-sil]"), s = sepet();
      if (d) s.forEach(function (x) { if (x.k === d.dataset.k) x.adet = Math.max(1, Math.min(99, x.adet + +d.dataset.d)); });
      if (sl) s = s.filter(function (x) { return x.k !== sl.dataset.sil; });
      if (d || sl) { sepetYaz(s); sepetCiz(); }
    });
    sp.addEventListener("change", function (e) { var a = e.target.getAttribute("data-a"); if (!a) return; var s = sepet(); s.forEach(function (x) { if (x.k === a) x.adet = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)); }); sepetYaz(s); sepetCiz(); });
    sepetCiz();
  }

  // ---- ödeme sayfası
  var od = $("#odeme-form");
  if (od) {
    var satirlar = sepetSatirlari();
    if (!satirlar.length) { $("#odeme-alan").innerHTML = '<p class="durum">Sepetiniz boş. <a href="' + KOK + 'urunler/">Ürünlere dönün</a>.</p>'; }
    else {
      var paytr = $("#odeme-paytr"); if (paytr && !C.PAYTR_AKTIF) { paytr.disabled = true; paytr.closest(".secenek").classList.add("kapali"); }
      var ozetCiz = function () {
        var f = new FormData(od), teslim = f.get("teslim") || "kargo", ara = satirlar.reduce(function (a, r) { return a + r.tutar; }, 0), kargo = kargoUcreti(ara, teslim), odeme = f.get("odeme");
        $("#o-satirlar").innerHTML = satirlar.map(function (r) { return '<div class="tut"><span>' + r.x.adet + " × " + r.u.ad + '<br><small class="soluk">' + esc(r.x.sec.join(" · ")) + "</small></span><b>" + TL(r.tutar) + "</b></div>"; }).join("");
        $("#o-ara").textContent = TL(ara); $("#o-kargo").textContent = teslim === "kargo" ? (kargo ? TL(kargo) : "Ücretsiz") : "—";
        $("#o-toplam").textContent = TL(ara + kargo);
        $("#adres-alan").hidden = teslim === "dukkan";
        $$("#adres-alan input, #adres-alan textarea").forEach(function (i) { i.required = teslim !== "dukkan" && i.hasAttribute("data-zorunlu"); });
        var kapi = $("#odeme-kapida"); if (kapi) { var uygun = teslim !== "kargo"; kapi.disabled = !uygun; kapi.closest(".secenek").classList.toggle("kapali", !uygun); if (!uygun && kapi.checked) $("#odeme-wa").checked = true; }
        $("#havale-bilgi").hidden = odeme !== "havale";
        $("#gonder").textContent = odeme === "kart" ? "Kartla öde" : "Siparişi WhatsApp ile tamamla";
        return { ara: ara, kargo: kargo, toplam: ara + kargo, teslim: teslim, odeme: odeme };
      };
      od.addEventListener("change", ozetCiz); ozetCiz();
      od.addEventListener("submit", function (e) {
        e.preventDefault(); if (!od.reportValidity()) return;
        var t = ozetCiz(), f = new FormData(od);
        if (t.odeme === "kart") { if (!C.PAYTR_AKTIF) { bildir("Kartla ödeme henüz açık değil; WhatsApp ile tamamlayın."); return; } /* PayTR açılınca: iframe token sunucu fonksiyonundan alınacak (bkz. _kaynak/PAYTR-NOT.md) */ return; }
        var no = "YR-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);
        var tes = { kargo: "Kargo ile adrese", dukkan: "Dükkândan teslim alacağım (Korkuteli)", elden: "Korkuteli içi elden teslim" }[t.teslim];
        var odm = { wa: "WhatsApp'ta konuşalım", havale: "Havale / EFT", kapida: "Kapıda / teslimde ödeme" }[t.odeme];
        var m = ["Merhaba Ramazan usta, sitenizden SİPARİŞ veriyorum.", "Sipariş no: " + no, ""];
        satirlar.forEach(function (r) { m.push("• " + r.x.adet + " × " + r.u.ad + " (" + r.x.sec.join(", ") + ") — " + TL(r.tutar)); });
        m.push("", "Ara toplam: " + TL(t.ara), "Kargo: " + (t.teslim === "kargo" ? (t.kargo ? TL(t.kargo) : "ücretsiz") : "yok"), "TOPLAM: " + TL(t.toplam) + " (fiyatları usta teyit eder)", "", "Teslimat: " + tes, "Ödeme: " + odm, "", "Ad soyad: " + f.get("ad"), "Telefon: " + f.get("tel"));
        if (f.get("eposta")) m.push("E-posta: " + f.get("eposta"));
        if (t.teslim !== "dukkan") m.push("Adres: " + [f.get("adres"), f.get("ilce"), f.get("il")].filter(Boolean).join(", "));
        if (f.get("not")) m.push("Not: " + f.get("not"));
        yaz("yr-son-siparis", { no: no, metin: m.join("\n"), toplam: t.toplam, tarih: Date.now() });
        window.open(wa(m.join("\n")), "_blank", "noopener");
        sepetYaz([]); location.href = KOK + "siparis-alindi.html";
      });
    }
  }
  var sa = $("#siparis-ozet");
  if (sa) { var so = oku("yr-son-siparis", null); if (so) { sa.textContent = so.metin; $("#siparis-no").textContent = so.no; $("#tekrar-wa").href = wa(so.metin); } }

  // ---- dükkân içi 360° (fotoğraf yüklenince açılır)
  var pn = $("#pano-dukkan");
  if (pn && pn.getAttribute("data-src")) {
    var yukle = function () {
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css"; document.head.appendChild(l);
      var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js";
      s.onload = function () { var y = pn.parentNode.querySelector(".yer"); if (y) y.hidden = true; window.pannellum.viewer("pano-dukkan", { type: "equirectangular", panorama: pn.getAttribute("data-src"), autoLoad: true, autoRotate: -2, compass: false, showZoomCtrl: true, strings: { loadingLabel: "Yükleniyor…" } }); };
      document.head.appendChild(s);
    };
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (g) { if (g[0].isIntersecting) { io.disconnect(); yukle(); } }); io.observe(pn); } else yukle();
  }
  // fiyat yazılarını tek kaynaktan tazele (fiyatlar.js değişip site yeniden üretilmediyse de doğru görünsün)
  $$("[data-fiyat-id]").forEach(function (e) { var u = urun(e.getAttribute("data-fiyat-id")); if (!u) return; var v = Object.keys(u.fiyat).map(function (k) { return u.fiyat[k]; }).filter(function (x) { return x > 0; }); var c = e.closest(".kart"); if (c && v.length) c.dataset.fiyat = Math.min.apply(null, v); e.textContent = v.length ? (v.length > 1 ? Math.min.apply(null, v).toLocaleString("tr-TR") + " TL'den" : TL(v[0])) : "Teklif ile"; });
  $$("[data-iban]").forEach(function (e) { e.textContent = C.iban + " · " + C.hesapAdi; });
  rozet();
})();
