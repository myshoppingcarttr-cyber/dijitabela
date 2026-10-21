/* Mermerler Gayrimenkul · 3 tasarımın ortak çalışan özellikleri (Dijitabela örneği, 21 Ekim 2026)
   İlan filtresi · WhatsApp'tan ilan sor · akşam mesajına otomatik ilk cevap (asistan demosu) · mahalle haritası ·
   kredi hesabı · kira mı kredi mi · evinizi satalım değerlemesi · akıllı ev eşleştirme · karşılaştır · gezi rotası ·
   ilan metni üretici (5 kanal) · fiyat düşünce haber ver. Sunucu yok; hepsi tarayıcıda çalışır. */
(function () {
  "use strict";
  var D = window.MG, O = D.ofis, IL = D.ilanlar;
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  var kok = (document.documentElement.getAttribute("data-kok") || "../");
  var foto = function (id, kucuk) { return kok + "img/" + (kucuk ? "k/" : "") + id + ".jpg"; };
  var depo = { al: function (k, v) { try { var x = localStorage.getItem("mg-" + k); return x ? JSON.parse(x) : v; } catch (e) { return v; } },
               koy: function (k, v) { try { localStorage.setItem("mg-" + k, JSON.stringify(v)); } catch (e) {} } };

  function fiyatYaz(il) { return il.fiyat ? tl(il.fiyat) + (il.durum === "Kiralık" ? " / ay" : "") : "Fiyat için sorun"; }
  function m2Fiyat(il) { return il.fiyat && il.m2 && il.durum === "Satılık" ? Math.round(il.fiyat / il.m2) : null; }
  function alan(v, ek) { return v === null || v === undefined || v === "" ? '<em class="mg-bos" title="İlanda yazmıyor — panelden eklenince burada görünür">Ofise sorun</em>' : esc(v) + (ek || ""); }
  function yasYaz(il) { return il.binaYasi === 0 ? "Sıfır" : il.binaYasi == null ? null : il.binaYasi + " yıl"; }
  function aidatYaz(il) { return il.aidat === 0 ? "Yok" : il.aidat == null ? null : tl(il.aidat); }
  function konutMu(il) { return /Daire|Dubleks|Müstakil/.test(il.tur); }
  function bul(no) { return IL.filter(function (x) { return x.no === no; })[0]; }
  function wa(metin) { return "https://wa.me/" + O.wa + "?text=" + encodeURIComponent(metin); }
  function ilanSor(il) {
    return "Merhaba, " + il.mahalle + " " + (il.oda ? il.oda + " " : "") + il.tur.toLowerCase() + " ilanınız (" + (il.no.indexOf("MG") === 0 ? "ilan " : "sahibinden no ") + il.no + ") hakkında bilgi almak istiyorum." +
      (il.fiyat ? "" : " Fiyatı nedir?") + " Görmek için uygun bir saat var mı?";
  }

  /* ---- Kart özet satırı (fiyat · m² · oda · bina yaşı · aidat) ---- */
  function ozet(il) {
    var r = [];
    r.push('<div><span>Fiyat</span><b>' + (il.fiyat ? esc(fiyatYaz(il)) : alan(null)) + "</b></div>");
    r.push('<div><span>' + (konutMu(il) ? "Brüt m²" : "Alan") + "</span><b>" + alan(il.m2 ? il.m2.toLocaleString("tr-TR") : null, " m²") + "</b></div>");
    if (konutMu(il)) {
      r.push("<div><span>Oda</span><b>" + alan(il.oda) + "</b></div>");
      r.push("<div><span>Bina yaşı</span><b>" + alan(yasYaz(il)) + "</b></div>");
      r.push("<div><span>Aidat</span><b>" + alan(aidatYaz(il)) + "</b></div>");
    } else {
      var mf = il.fiyat && il.m2 ? Math.round(il.fiyat / il.m2) : null;
      r.push("<div><span>m² fiyatı</span><b>" + alan(mf ? tl(mf) : null) + "</b></div>");
      r.push("<div><span>Tür</span><b>" + esc(il.tur) + "</b></div>");
    }
    return '<div class="mg-ozet">' + r.join("") + "</div>";
  }
  function rozet(il) {
    var b = [];
    if (il.yeni) b.push('<i class="mg-roz yeni">Yeni · ' + esc(il.tarih.replace(" 2026", "")) + "</i>");
    if (il.eskiFiyat) b.push('<i class="mg-roz dus">Fiyatı düştü ' + tl(il.eskiFiyat - il.fiyat) + "</i>");
    if (il.binaYasi === 0) b.push('<i class="mg-roz">Sıfır bina</i>');
    return b.join("");
  }
  function kapak(il, kucuk) {
    if (il.foto.length) return '<img loading="lazy" src="' + foto(il.foto[0], kucuk) + '" alt="' + esc(il.baslik) + '">' + (il.uydu ? '<small class="mg-uydu">Uydu görünümü · mahalle merkezi</small>' : il.harita ? '<small class="mg-uydu">Parsel sorgu görüntüsü</small>' : "");
    return '<div class="mg-fotoyok"><b>' + esc(il.mahalle) + "</b><span>" + esc(il.tur) + " · fotoğraflar ofiste</span></div>";
  }

  /* ---- Filtre ---- */
  var F = { durum: "", tur: "", oda: "", mahalle: "", azami: 0, sira: "yeni", ara: "" };
  function filtrele(f) {
    f = f || F;
    var l = IL.filter(function (il) {
      if (f.durum && il.durum !== f.durum) return false;
      if (f.tur === "konut" && !konutMu(il)) return false;
      if (f.tur === "arsa" && konutMu(il)) return false;
      if (f.oda && il.oda !== f.oda) return false;
      if (f.mahalle && il.mahalle !== f.mahalle) return false;
      if (f.azami && il.fiyat && il.fiyat > f.azami) return false;
      if (f.ara) { var t = (il.baslik + " " + il.mahalle + " " + il.ozellik.join(" ") + " " + il.no).toLocaleLowerCase("tr"); if (t.indexOf(f.ara.toLocaleLowerCase("tr")) < 0) return false; }
      return true;
    });
    var tarihSay = function (il) { return IL.indexOf(il); };
    if (f.sira === "ucuz") l.sort(function (a, b) { return (a.fiyat || 9e12) - (b.fiyat || 9e12); });
    else if (f.sira === "pahali") l.sort(function (a, b) { return (b.fiyat || 0) - (a.fiyat || 0); });
    else if (f.sira === "m2") l.sort(function (a, b) { return (b.m2 || 0) - (a.m2 || 0); });
    else l.sort(function (a, b) { return tarihSay(a) - tarihSay(b); });
    return l;
  }
  function secenekler() {
    var oda = {}, mah = {};
    IL.forEach(function (i) { if (i.oda) oda[i.oda] = 1; mah[i.mahalle] = (mah[i.mahalle] || 0) + 1; });
    return { oda: Object.keys(oda).sort(), mahalle: Object.keys(mah).sort(function (a, b) { return mah[b] - mah[a]; }), say: mah };
  }
  function filtreUI(kap, degisti) {
    var s = secenekler();
    kap.innerHTML =
      '<label><span>İlan</span><select data-f="durum"><option value="">Satılık + kiralık</option><option>Satılık</option><option>Kiralık</option></select></label>' +
      '<label><span>Tür</span><select data-f="tur"><option value="">Hepsi</option><option value="konut">Konut</option><option value="arsa">Arsa / tarla</option></select></label>' +
      '<label><span>Oda</span><select data-f="oda"><option value="">Hepsi</option>' + s.oda.map(function (o) { return "<option>" + o + "</option>"; }).join("") + "</select></label>" +
      '<label><span>Mahalle</span><select data-f="mahalle"><option value="">Tüm Korkuteli</option>' + s.mahalle.map(function (m) { return '<option value="' + esc(m) + '">' + esc(m) + " (" + s.say[m] + ")</option>"; }).join("") + "</select></label>" +
      '<label><span>En çok</span><select data-f="azami"><option value="0">Fiyat sınırı yok</option><option value="20000">20.000 TL (kira)</option><option value="1000000">1 milyon TL</option><option value="2500000">2,5 milyon TL</option><option value="4200000">4,2 milyon TL</option><option value="6000000">6 milyon TL</option></select></label>' +
      '<label><span>Sırala</span><select data-f="sira"><option value="yeni">En yeni</option><option value="ucuz">Fiyat artan</option><option value="pahali">Fiyat azalan</option><option value="m2">En geniş</option></select></label>';
    $$("select", kap).forEach(function (el) {
      el.value = F[el.getAttribute("data-f")] || el.value;
      el.onchange = function () { var k = el.getAttribute("data-f"); F[k] = k === "azami" ? +el.value : el.value; degisti(filtrele()); };
    });
    return { ayarla: function (k, v) { F[k] = v; var el = $('[data-f="' + k + '"]', kap); if (el) el.value = v; degisti(filtrele()); } };
  }

  /* ---- Favoriler + karşılaştırma + gezi rotası ---- */
  var fav = depo.al("fav", []);
  function favMi(no) { return fav.indexOf(no) >= 0; }
  function favDegis(no) { var i = fav.indexOf(no); if (i >= 0) fav.splice(i, 1); else fav.push(no); depo.koy("fav", fav); document.dispatchEvent(new CustomEvent("mg-fav")); return favMi(no); }

  /* ---- Pencere (modal) ---- */
  function pencere(html, sinif) {
    var p = document.createElement("div"); p.className = "mg-pen " + (sinif || "");
    p.innerHTML = '<div class="mg-pen-ic" role="dialog" aria-modal="true"><button class="mg-pen-x" aria-label="Kapat">×</button>' + html + "</div>";
    p.onclick = function (e) { if (e.target === p || e.target.classList.contains("mg-pen-x")) { p.remove(); document.body.style.overflow = ""; } };
    document.body.appendChild(p); document.body.style.overflow = "hidden";
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { p.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", k); } });
    return p;
  }
  function galeri(il, bas) {
    if (!il.foto.length) return detay(il);
    var i = bas || 0;
    var p = pencere('<div class="mg-gal"><img alt=""><button class="mg-gal-o" aria-label="Önceki">‹</button><button class="mg-gal-s" aria-label="Sonraki">›</button><div class="mg-gal-alt"><b></b><span></span></div></div>', "mg-pen-gal");
    var img = $("img", p);
    function goster() { img.src = foto(il.foto[i]); $(".mg-gal-alt b", p).textContent = il.baslik; $(".mg-gal-alt span", p).textContent = (i + 1) + " / " + il.foto.length + (il.uydu ? " · uydu görünümü, parsel sınırı değildir" : " · fotoğraf: Mermerler Gayrimenkul"); }
    $(".mg-gal-o", p).onclick = function () { i = (i - 1 + il.foto.length) % il.foto.length; goster(); };
    $(".mg-gal-s", p).onclick = function () { i = (i + 1) % il.foto.length; goster(); };
    var x0 = null; img.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    img.addEventListener("touchend", function (e) { if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) { i = (i + (d < 0 ? 1 : -1) + il.foto.length) % il.foto.length; goster(); } x0 = null; });
    goster();
  }
  function detay(il) {
    var mf = m2Fiyat(il);
    var html = '<div class="mg-det">' +
      '<div class="mg-det-foto">' + kapak(il) + (il.foto.length > 1 ? '<button class="mg-btn ince" data-gal>Tüm fotoğraflar (' + il.foto.length + ")</button>" : "") + "</div>" +
      '<div class="mg-det-ic"><p class="mg-ust">' + esc(il.durum + " · " + il.tur + " · " + il.mahalle) + "</p><h3>" + esc(il.baslik) + "</h3>" + rozet(il) + ozet(il) +
      (il.ozellik.length ? '<ul class="mg-ozl">' + il.ozellik.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" : "") +
      (mf ? '<p class="mg-not">Bu ilanın m² fiyatı <b>' + tl(mf) + "</b>. " + karsilastirMetni(il) + "</p>" : "") +
      '<div class="mg-det-dug"><a class="mg-btn wa" target="_blank" rel="noopener" href="' + wa(ilanSor(il)) + '">WhatsApp\'tan bu ilanı sor</a>' +
      '<a class="mg-btn ince" href="tel:+9' + O.tel1.replace(/\s/g, "") + '">Ara: ' + O.tel1 + "</a>" +
      (il.durum === "Satılık" && konutMu(il) && il.fiyat ? '<button class="mg-btn ince" data-kredi>Kredi hesapla</button>' : "") +
      '<button class="mg-btn ince" data-alarm>Fiyatı düşünce haber ver</button></div>' +
      '<p class="mg-kaynak">İlan no ' + esc(il.no) + " · " + esc(il.tarih) + " · kaynak: " + esc(il.kaynak) + "</p></div></div>";
    var p = pencere(html, "mg-pen-det");
    var g = $("[data-gal]", p); if (g) g.onclick = function () { p.remove(); galeri(il); };
    var k = $("[data-kredi]", p); if (k) k.onclick = function () { p.remove(); var hedef = $("[data-mg-kredi]"); if (hedef) { hedef.scrollIntoView({ behavior: "smooth" }); hedef.dispatchEvent(new CustomEvent("mg-tutar", { detail: il.fiyat })); } };
    $("[data-alarm]", p).onclick = function () { p.remove(); alarm(il); };
  }
  function karsilastirMetni(il) {
    var benzer = IL.filter(function (x) { return x !== il && x.durum === "Satılık" && konutMu(x) && x.fiyat && x.m2; });
    if (!benzer.length) return "";
    var ort = benzer.reduce(function (t, x) { return t + x.fiyat / x.m2; }, 0) / benzer.length, f = il.fiyat / il.m2;
    var y = Math.round((f / ort - 1) * 100);
    return "Ofisteki diğer satılık konutların ortalaması " + tl(ort) + "; bu ilan " + (y === 0 ? "ortalamada." : Math.abs(y) + "% " + (y < 0 ? "daha uygun." : "daha yüksek (yeni bina farkı)."));
  }
  function alarm(il) {
    var p = pencere('<div class="mg-form"><p class="mg-ust">Fiyat alarmı</p><h3>' + esc(il.baslik) + '</h3><p>Fiyat düşünce ya da benzer bir ilan gelince WhatsApp\'tan haber verelim. Numaranızı yazmanız yeterli; ilan başka kimseyle paylaşılmaz.</p>' +
      '<label>Adınız<input name="ad" autocomplete="name" placeholder="Adınız"></label><label>Telefon<input name="tel" inputmode="tel" autocomplete="tel" placeholder="05xx xxx xx xx"></label>' +
      '<button class="mg-btn wa" data-gonder>Haber verin</button><p class="mg-kaynak">Örnek sayfa: düğme, talebi ofisin WhatsApp\'ına hazır mesaj olarak açar.</p></div>');
    $("[data-gonder]", p).onclick = function () {
      var ad = $("[name=ad]", p).value.trim(), t = $("[name=tel]", p).value.trim();
      if (!ad || t.replace(/\D/g, "").length < 10) { $("[name=" + (!ad ? "ad" : "tel") + "]", p).focus(); return; }
      window.open(wa("Merhaba, ben " + ad + " (" + t + "). " + il.baslik + " (no " + il.no + ") ilanının fiyatı düşerse ya da benzeri gelirse haber verir misiniz?"), "_blank");
      p.remove(); document.body.style.overflow = "";
    };
  }
  function karsilastir(nolar) {
    var l = nolar.map(bul).filter(Boolean).slice(0, 3);
    if (l.length < 2) { pencere('<div class="mg-form"><h3>Karşılaştırmak için en az 2 ilan seçin</h3><p>Kartlardaki ♡ işaretine dokunun; seçtikleriniz burada yan yana gelir.</p></div>'); return; }
    var sat = [["Fiyat", function (i) { return i.fiyat ? fiyatYaz(i) : null; }], ["m²", function (i) { return i.m2 ? i.m2 + " m²" : null; }], ["m² fiyatı", function (i) { var m = m2Fiyat(i); return m ? tl(m) : null; }],
      ["Oda", function (i) { return i.oda; }], ["Kat", function (i) { return i.kat; }], ["Bina yaşı", yasYaz], ["Aidat", aidatYaz], ["Mahalle", function (i) { return i.mahalle; }]];
    var h = '<div class="mg-kar"><p class="mg-ust">Yan yana karşılaştırma</p><table><thead><tr><th></th>' + l.map(function (i) { return "<th>" + kapak(i, true) + "<b>" + esc(i.baslik) + "</b></th>"; }).join("") + "</tr></thead><tbody>" +
      sat.map(function (s) { return "<tr><td>" + s[0] + "</td>" + l.map(function (i) { return "<td>" + alan(s[1](i)) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table>" + '<a class="mg-btn wa" target="_blank" rel="noopener" href="' + wa("Merhaba, şu ilanları görmek istiyorum: " + l.map(function (i) { return i.baslik + " (no " + i.no + ")"; }).join(", ") + ". Aynı gün hepsini gezebilir miyiz?") + '">Bu ilanları aynı gün gezelim</a></div>';
    pencere(h, "mg-pen-genis");
  }

  /* ---- Mahalle haritası (Leaflet + OpenStreetMap) ---- */
  function harita(el, tikla) {
    if (!window.L) { el.innerHTML = '<p class="mg-not">Harita yüklenemedi.</p>'; return; }
    var m = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([37.085, 30.205], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(m);
    var s = secenekler(), sinir = [];
    Object.keys(D.mahalle).forEach(function (ad) {
      var mh = D.mahalle[ad], n = s.say[ad] || 0; if (!n) return;
      var ic = L.divIcon({ className: "mg-pin", html: "<b>" + n + "</b><span>" + esc(ad) + "</span>", iconSize: null });
      var mk = L.marker([mh.lat, mh.lng], { icon: ic }).addTo(m); sinir.push([mh.lat, mh.lng]);
      var ilan = IL.filter(function (i) { return i.mahalle === ad; });
      mk.bindPopup("<b>" + esc(ad) + "</b>" + (mh.yaklasik ? " <small>(yaklaşık konum)</small>" : "") + "<p>" + esc(mh.not) + "</p><ul>" + ilan.map(function (i) { return "<li>" + esc(i.oda || i.tur) + " · " + esc(fiyatYaz(i)) + "</li>"; }).join("") + '</ul><a href="#" data-mah="' + esc(ad) + '">Bu mahallenin ilanları →</a>');
      mk.on("popupopen", function (e) { var a = e.popup.getElement().querySelector("[data-mah]"); if (a) a.onclick = function (ev) { ev.preventDefault(); m.closePopup(); if (tikla) tikla(ad); }; });
    });
    L.marker([O.konum.lat, O.konum.lng], { icon: L.divIcon({ className: "mg-pin ofis", html: "<b>M</b><span>Ofis</span>", iconSize: null }) }).addTo(m).bindPopup("<b>" + esc(O.ad) + "</b><p>Google'daki konum</p>");
    if (sinir.length) m.fitBounds(sinir, { padding: [30, 30] });
    setTimeout(function () { m.invalidateSize(); }, 400);
    return m;
  }

  /* ---- Kredi hesaplayıcı ---- */
  function kredi(el) {
    el.setAttribute("data-mg-kredi", "");
    el.innerHTML = '<div class="mg-hes"><div class="mg-hes-g">' +
      '<label>Ev fiyatı<input type="range" min="500000" max="7000000" step="50000" data-k="fiyat" value="4050000"><output data-o="fiyat"></output></label>' +
      '<label>Peşinat oranı<input type="range" min="10" max="80" step="5" data-k="pes" value="30"><output data-o="pes"></output></label>' +
      '<label>Vade<input type="range" min="12" max="120" step="12" data-k="vade" value="120"><output data-o="vade"></output></label>' +
      '<label>Aylık faiz (%)<input type="number" min="0.5" max="6" step="0.01" data-k="faiz" value="2.69"></label>' +
      '<label>Hızlı seçim<select data-k="ilan"><option value="">İlan seçin…</option>' + IL.filter(function (i) { return i.durum === "Satılık" && i.fiyat && konutMu(i); }).map(function (i) { return '<option value="' + i.fiyat + '">' + esc(i.baslik) + " · " + tl(i.fiyat) + "</option>"; }).join("") + "</select></label>" +
      '</div><div class="mg-hes-s"><span>Aylık taksit</span><b data-o="taksit"></b><dl><div><dt>Peşinat</dt><dd data-o="pesinat"></dd></div><div><dt>Kredi tutarı</dt><dd data-o="kredi"></dd></div><div><dt>Toplam geri ödeme</dt><dd data-o="toplam"></dd></div><div><dt>Önerilen hane geliri</dt><dd data-o="gelir"></dd></div></dl>' +
      '<a class="mg-btn wa" target="_blank" rel="noopener" data-o="wa">Bu hesapla görüşelim</a><p class="mg-kaynak">Faiz oranını bankanızdan teyit edin; hesap bilgilendirme amaçlıdır.</p></div></div>';
    var g = function (k) { return $('[data-k="' + k + '"]', el); }, o = function (k) { return $('[data-o="' + k + '"]', el); };
    function hesapla() {
      var f = +g("fiyat").value, pes = +g("pes").value / 100, n = +g("vade").value, r = (+g("faiz").value || 0) / 100;
      var K = f * (1 - pes), t = r ? K * r / (1 - Math.pow(1 + r, -n)) : K / n;
      o("fiyat").textContent = tl(f); o("pes").textContent = "%" + Math.round(pes * 100) + " · " + tl(f * pes); o("vade").textContent = n + " ay";
      o("taksit").textContent = tl(t); o("pesinat").textContent = tl(f * pes); o("kredi").textContent = tl(K); o("toplam").textContent = tl(t * n + f * pes); o("gelir").textContent = tl(t / 0.4) + " / ay";
      o("wa").href = wa("Merhaba, " + tl(f) + " bütçeyle, %" + Math.round(pes * 100) + " peşinat ve " + n + " ay vadeyle (aylık ~" + tl(t) + ") ev bakıyorum. Uygun ilanlarınız neler?");
    }
    $$("input,select", el).forEach(function (x) { x.oninput = x.onchange = function () { if (x === g("ilan") && x.value) g("fiyat").value = x.value; hesapla(); }; });
    el.addEventListener("mg-tutar", function (e) { g("fiyat").value = e.detail; hesapla(); });
    hesapla();
  }

  /* ---- Kira mı, kredi mi? (ofisin kendi kiralık + satılık ilanlarından) ---- */
  function kiraKredi(el) {
    el.innerHTML = '<div class="mg-hes"><div class="mg-hes-g">' +
      '<label>Aylık kira<input type="range" min="8000" max="30000" step="250" data-k="kira" value="13500"><output data-o="kira"></output></label>' +
      '<label>Alacağınız ev<input type="range" min="1500000" max="7000000" step="50000" data-k="ev" value="4050000"><output data-o="ev"></output></label>' +
      '<label>Elinizdeki birikim<input type="range" min="0" max="4000000" step="50000" data-k="bir" value="1200000"><output data-o="bir"></output></label>' +
      '<label>Kira artışı (yıllık %)<input type="number" min="0" max="80" step="1" data-k="art" value="30"></label>' +
      '</div><div class="mg-hes-s"><span>Sonuç</span><b data-o="sonuc"></b><p data-o="aciklama"></p><div class="mg-cubuk"><i data-o="cKira"></i><i data-o="cKredi"></i></div><p class="mg-kaynak">Varsayılanlar ofisin gerçek ilanlarından: Yeni Mahalle kiralık 2+1 13.500 TL, Uzunoluk sıfır 2+1 4.050.000 TL. Faiz %2,69/ay, 120 ay.</p></div></div>';
    var g = function (k) { return +$('[data-k="' + k + '"]', el).value; }, o = function (k) { return $('[data-o="' + k + '"]', el); };
    function h() {
      var kira = g("kira"), ev = g("ev"), bir = Math.min(g("bir"), ev), art = g("art") / 100, r = 0.0269, n = 120, K = ev - bir, t = K > 0 ? K * r / (1 - Math.pow(1 + r, -n)) : 0;
      var top = 0, k = kira; for (var y = 0; y < 10; y++) { top += k * 12; k *= 1 + art; }
      o("kira").textContent = tl(kira); o("ev").textContent = tl(ev); o("bir").textContent = tl(bir);
      var yil = 0, kk = kira, birik = 0; while (yil < 30 && birik < t * 12 * 10 + bir) { birik += kk * 12; kk *= 1 + art; yil++; }
      o("sonuc").textContent = "10 yılda kiraya " + tl(top) + " · kredi taksiti " + tl(t) + "/ay";
      o("aciklama").textContent = "Kira her yıl %" + Math.round(art * 100) + " artarsa, " + yil + ". yılın sonunda ödediğiniz toplam kira, bu evin peşinatı + tüm kredi ödemesini geçiyor. Fark: kredi bitince ev sizin.";
      var mx = Math.max(top, t * 120 + bir); o("cKira").style.width = (top / mx * 100) + "%"; o("cKredi").style.width = ((t * 120 + bir) / mx * 100) + "%";
      o("cKira").textContent = "Kira (10 yıl)"; o("cKredi").textContent = "Peşinat + kredi";
    }
    $$("input", el).forEach(function (x) { x.oninput = h; }); h();
  }

  /* ---- Evinizi satalım: ön değer tahmini + WhatsApp ---- */
  function degerleme(el) {
    var mahs = Object.keys(D.mahalle).filter(function (m) { return !/Taşkesik|Karataş|Simandır|Bozova|Kevzer|Akyar/.test(m); });
    el.innerHTML = '<form class="mg-hes mg-deg" novalidate><div class="mg-hes-g">' +
      '<label>Mahalle<select name="mah">' + mahs.map(function (m) { return "<option>" + m + "</option>"; }).join("") + "</select></label>" +
      '<label>Oda<select name="oda"><option>1+1</option><option selected>2+1</option><option>3+1</option><option>4+1</option></select></label>' +
      '<label>Brüt m²<input name="m2" type="number" min="40" max="400" value="115" inputmode="numeric"></label>' +
      '<label>Bina yaşı<select name="yas"><option value="1">Sıfır</option><option value="0.93">1-5</option><option value="0.82">6-10</option><option value="0.66">11-15</option><option value="0.52" selected>16+</option></select></label>' +
      '<label>Kat<select name="kat"><option value="0.95">Giriş / bahçe</option><option value="1" selected>Ara kat</option><option value="0.97">En üst</option><option value="1.04">Asansörlü ara kat</option></select></label>' +
      '<label>Adınız<input name="ad" autocomplete="name" placeholder="Adınız"></label>' +
      '</div><div class="mg-hes-s"><span>Ön tahmini değer</span><b data-o="aralik"></b><p data-o="dayanak"></p><button class="mg-btn wa" type="submit">Ücretsiz yerinde değerleme iste</button><p class="mg-kaynak">Tahmin, ofisin güncel satılık ilanlarının m² fiyatlarından hesaplanır; kesin değer yerinde bakılarak verilir.</p></div></form>';
    var fm = $("form", el), o = function (k) { return $('[data-o="' + k + '"]', el); };
    var konut = IL.filter(function (i) { return i.durum === "Satılık" && i.fiyat && i.m2 && konutMu(i); });
    var sifirM2 = konut.filter(function (i) { return i.binaYasi === 0; }).reduce(function (t, i, _, a) { return t + i.fiyat / i.m2 / a.length; }, 0) || 40000;
    var CARP = { "Uzunoluk": 1.04, "Aşağıpazar": 1.0, "Kiremitli": 1.02, "Yeni Mahalle": 0.97, "Karşıyaka": 0.96, "Çomaklı": 0.7 };
    function h() {
      var v = Object.fromEntries ? Object.fromEntries(new FormData(fm)) : {};
      var m2 = Math.max(40, +v.m2 || 0), d = sifirM2 * (CARP[v.mah] || 0.95) * (+v.yas) * (+v.kat) * m2;
      o("aralik").textContent = tl(Math.round(d * 0.92 / 10000) * 10000) + " – " + tl(Math.round(d * 1.08 / 10000) * 10000);
      o("dayanak").textContent = "Dayanak: ofisteki sıfır daire ilanlarının ortalaması " + tl(sifirM2) + "/m² · " + v.mah + " · " + v.oda + " · " + m2 + " m².";
      return { v: v, d: d };
    }
    fm.oninput = h; h();
    fm.onsubmit = function (e) {
      e.preventDefault(); var r = h();
      if (!r.v.ad || !r.v.ad.trim()) { fm.ad.focus(); fm.ad.placeholder = "Adınızı yazın"; return; }
      window.open(wa("Merhaba, ben " + r.v.ad.trim() + ". " + r.v.mah + " mahallesindeki " + r.v.oda + ", " + r.v.m2 + " m² evimi satmak istiyorum. Sitedeki ön tahmin " + o("aralik").textContent + " çıktı; yerinde değerleme için ne zaman uygunsunuz?"), "_blank");
    };
  }

  /* ---- Akıllı ev eşleştirme sihirbazı ---- */
  function eslestir(el, sonucCiz) {
    var C = { amac: "", butce: 0, kisi: 0, oncelik: "" };
    var adim = [
      { k: "amac", s: "Ne arıyorsunuz?", c: [["Satılık ev", "Satılık"], ["Kiralık ev", "Kiralık"], ["Arsa / tarla", "arsa"]] },
      { k: "butce", s: "Bütçeniz en fazla ne kadar?", c: [["15.000 TL kira", 15000], ["20.000 TL kira", 20000], ["2,5 milyon", 2500000], ["4,2 milyon", 4200000], ["6 milyon +", 9e9]] },
      { k: "kisi", s: "Evde kaç kişi yaşayacak?", c: [["1-2 kişi", 2], ["3-4 kişi", 4], ["5 ve üzeri", 6]] },
      { k: "oncelik", s: "Sizin için en önemlisi?", c: [["Sıfır bina", "sifir"], ["Çarşıya yakın", "merkez"], ["Geniş metrekare", "genis"], ["En uygun fiyat", "ucuz"]] }
    ], a = 0;
    function puanla() {
      return IL.map(function (il) {
        var p = 0, neden = [];
        if (C.amac === "arsa") { if (konutMu(il)) return null; p += 40; }
        else { if (!konutMu(il) || il.durum !== C.amac) return null; p += 40; }
        if (il.fiyat && il.fiyat <= C.butce) { p += 25; neden.push("bütçenize uygun"); } else if (!il.fiyat) { p += 10; neden.push("fiyatı sorulacak"); } else p -= 15;
        var oda = il.oda ? +il.oda[0] + (+il.oda.slice(-1) || 0) : 0;
        if (C.amac !== "arsa") { if (oda >= Math.ceil(C.kisi / 2) + 1 || (C.kisi <= 2 && oda >= 2)) { p += 15; neden.push(il.oda + " " + C.kisi + " kişiye yeter"); } else p -= 5; }
        if (C.oncelik === "sifir" && il.binaYasi === 0) { p += 20; neden.push("sıfır bina"); }
        if (C.oncelik === "merkez" && /Aşağıpazar|Kiremitli|Uzunoluk/.test(il.mahalle)) { p += 20; neden.push("merkeze yürüme mesafesi"); }
        if (C.oncelik === "genis" && (il.m2 || 0) >= 115) { p += 20; neden.push(il.m2 + " m²"); }
        if (C.oncelik === "ucuz" && il.fiyat && il.fiyat <= C.butce * 0.7) { p += 20; neden.push("bütçenin altında"); }
        if (il.eskiFiyat) { p += 5; neden.push("fiyatı yeni düştü"); }
        return { il: il, p: Math.max(5, Math.min(99, p)), neden: neden };
      }).filter(Boolean).sort(function (x, y) { return y.p - x.p; }).slice(0, 3);
    }
    function ciz() {
      if (a >= adim.length) {
        var s = puanla();
        el.innerHTML = '<div class="mg-sih-son"><p class="mg-ust">Size en uygun ' + s.length + " ilan</p>" + (s.length ? s.map(function (x) {
          return '<button class="mg-sih-kart" data-no="' + x.il.no + '">' + kapak(x.il, true) + '<span><b>%' + x.p + " uyum</b>" + esc(x.il.baslik) + "<small>" + esc(x.neden.join(" · ")) + "</small><em>" + esc(fiyatYaz(x.il)) + "</em></span></button>";
        }).join("") : "<p>Şu an tam uyan ilan yok; aşağıdaki düğmeyle talebinizi bırakın, gelince ilk size haber verelim.</p>") +
          '<div class="mg-det-dug"><a class="mg-btn wa" target="_blank" rel="noopener" href="' + wa("Merhaba, sitenizdeki eşleştirmeyi yaptım: " + (C.amac === "arsa" ? "arsa/tarla" : C.amac.toLowerCase() + " ev") + ", bütçe " + (C.butce > 1e9 ? "6 milyon üzeri" : tl(C.butce)) + ", " + C.kisi + " kişi. Uygun ilan gelince haber verir misiniz?") + '">Bana uygun ilan gelince haber ver</a><button class="mg-btn ince" data-bas>Baştan</button></div></div>';
        $$("[data-no]", el).forEach(function (b) { b.onclick = function () { detay(bul(b.getAttribute("data-no"))); }; });
        $("[data-bas]", el).onclick = function () { a = 0; ciz(); };
        if (sonucCiz) sonucCiz(s);
        return;
      }
      var d = adim[a];
      if (d.k === "kisi" && C.amac === "arsa") { a++; return ciz(); }
      var secim = d.c;
      if (d.k === "butce") secim = C.amac === "Kiralık" ? d.c.slice(0, 2) : d.c.slice(2);
      el.innerHTML = '<div class="mg-sih"><p class="mg-ust">Soru ' + (a + 1) + " / " + adim.length + '</p><h3>' + d.s + '</h3><div class="mg-sih-c">' + secim.map(function (c, i) { return '<button data-i="' + i + '">' + c[0] + "</button>"; }).join("") + '</div><div class="mg-sih-bar"><i style="width:' + (a / adim.length * 100) + '%"></i></div></div>';
      $$("[data-i]", el).forEach(function (b) { b.onclick = function () { C[d.k] = secim[+b.getAttribute("data-i")][1]; a++; ciz(); }; });
    }
    ciz();
  }

  /* ---- İlan metni üretici: bir kez gir, 5 kanala hazır metin ---- */
  function ilanMetni(el) {
    el.innerHTML = '<div class="mg-hes"><div class="mg-hes-g">' +
      '<label>İlan<select data-k="il">' + IL.map(function (i, n) { return '<option value="' + n + '">' + esc(i.baslik) + "</option>"; }).join("") + "</select></label>" +
      '<label>Fiyat (TL)<input data-k="fiyat" type="number" inputmode="numeric" placeholder="ör. 3950000"></label>' +
      '<label>Bina yaşı<input data-k="yas" placeholder="ör. 3"></label><label>Aidat (TL)<input data-k="aidat" placeholder="ör. 0"></label>' +
      '</div><div class="mg-hes-s"><div class="mg-sekme"><button data-t="fb" class="on">Facebook grubu</button><button data-t="shb">sahibinden başlığı</button><button data-t="ig">Instagram</button><button data-t="wa">WhatsApp durum</button><button data-t="google">Google gönderisi</button></div><textarea data-o="metin" rows="9" readonly></textarea><button class="mg-btn" data-kopya>Metni kopyala</button><p class="mg-kaynak">Bilgileri bir kez girin; 5 kanalın kurallarına uygun metin hazır olsun. Fiyat/bina yaşı/aidat boşsa metin sizi uyarır.</p></div></div>';
    var t = "fb";
    function g(k) { return $('[data-k="' + k + '"]', el).value.trim(); }
    function uret() {
      var il = IL[+g("il")], f = +g("fiyat") || il.fiyat, yas = g("yas") || (il.binaYasi === 0 ? "0" : il.binaYasi || ""), ai = g("aidat") || (il.aidat === 0 ? "0" : il.aidat || "");
      var eksik = [!f && "fiyat", !yas && konutMu(il) && "bina yaşı", !ai && konutMu(il) && "aidat"].filter(Boolean);
      var fy = f ? tl(f) + (il.durum === "Kiralık" ? " / ay" : "") : "";
      var bas = il.durum.toLocaleUpperCase("tr") + " · KORKUTELİ " + il.mahalle.toLocaleUpperCase("tr") + " · " + (il.oda ? il.oda + " " : "") + (il.m2 ? il.m2 + " m²" : il.tur.toLocaleUpperCase("tr"));
      var ozl = il.ozellik.map(function (o) { return "✔ " + o; }).join("\n");
      var bilgi = [fy && "💰 " + fy, yas !== "" && konutMu(il) && "🏢 Bina yaşı: " + (yas === "0" ? "sıfır" : yas), ai !== "" && konutMu(il) && "🧾 Aidat: " + (ai === "0" ? "yok" : ai + " TL"), il.kat && "🪜 " + il.kat].filter(Boolean).join("\n");
      var son = "📞 " + O.tel1 + " · WhatsApp\n🔎 Tüm ilanlarımız: mermerlergayrimenkul.com (örnek adres)";
      var m = {
        fb: "MERMERLER GAYRİMENKUL'DEN\n" + bas + "\n\n" + bilgi + "\n" + ozl + "\n\n" + son,
        shb: (il.durum === "Kiralık" ? "MERMERLER'DEN KİRALIK " : "MERMERLER'DEN ") + il.mahalle.toLocaleUpperCase("tr") + " MAH " + (il.oda || "") + " " + (il.m2 ? il.m2 + " M² " : "") + (il.binaYasi === 0 ? "SIFIR " : "") + il.ozellik.slice(0, 2).join(" ").toLocaleUpperCase("tr"),
        ig: il.baslik + " ✨\n\n" + bilgi + "\n\n" + il.ozellik.slice(0, 4).join(" · ") + "\n\nDetay ve görmek için DM ya da WhatsApp 👉 " + O.tel1 + "\n\n#korkuteli #korkutelisatilik #antalyaemlak #" + il.mahalle.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g, "") + " #mermerlergayrimenkul",
        wa: "🏡 " + il.baslik + "\n" + (fy || "Fiyat için yazın") + "\nBilgi: bu mesaja cevap verin 👇",
        google: il.baslik + ". " + (fy ? "Fiyat: " + fy + ". " : "") + il.ozellik.join(", ") + ". Görmek için arayın: " + O.tel1 + "."
      }[t];
      if (t === "shb") m = m.slice(0, 60);
      $('[data-o="metin"]', el).value = (eksik.length ? "⚠ Eksik: " + eksik.join(", ") + " — alıcının ilk sorusu bu olur.\n\n" : "") + m;
    }
    $$("[data-k]", el).forEach(function (x) { x.oninput = x.onchange = uret; });
    $$("[data-t]", el).forEach(function (b) { b.onclick = function () { $$("[data-t]", el).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); t = b.getAttribute("data-t"); uret(); }; });
    $("[data-kopya]", el).onclick = function (e) { var ta = $('[data-o="metin"]', el); ta.select(); try { navigator.clipboard.writeText(ta.value); } catch (x) { document.execCommand("copy"); } e.target.textContent = "Kopyalandı ✓"; setTimeout(function () { e.target.textContent = "Metni kopyala"; }, 1500); };
    uret();
  }

  /* ---- WhatsApp asistanı demosu: akşam gelen mesaja otomatik ilk cevap ---- */
  function asistan(acik) {
    if ($(".mg-as")) return;
    var k = document.createElement("div"); k.className = "mg-as" + (acik ? " acik" : "");
    k.innerHTML = '<button class="mg-as-ac" aria-label="WhatsApp asistanını aç"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="#fff" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg><span>Akşam 21:40\'ta yazın, deneyin</span></button>' +
      '<div class="mg-as-pen" role="dialog" aria-label="WhatsApp asistan demosu"><div class="mg-as-ust"><b>' + esc(O.ad) + '</b><small data-durum></small><label class="mg-as-saat">Saat <select data-saat><option value="21.67">21:40 · akşam</option><option value="23.25">23:15 · gece</option><option value="11">11:00 · mesai</option></select></label><button class="mg-as-x" aria-label="Kapat">×</button></div>' +
      '<div class="mg-as-akis" aria-live="polite"></div><div class="mg-as-hiz"></div><form class="mg-as-yaz"><input placeholder="Mesaj yazın… (ör. Uzunoluk 3+1 fiyatı ne?)" aria-label="Mesaj"><button aria-label="Gönder">➤</button></form>' +
      '<p class="mg-as-not">Demo: gerçek kurulumda bu cevaplar ofisin kendi WhatsApp numarasından gider; Arif Bey sabah tek ekranda özeti görür.</p></div>';
    document.body.appendChild(k);
    var akis = $(".mg-as-akis", k), hiz = $(".mg-as-hiz", k), inp = $("input", k), saatSec = $("[data-saat]", k);
    var S = { ad: "", ilan: null, adim: "", baslat: false, talepler: [] };
    function saat() { return +saatSec.value; }
    function mesai() { var s = saat(); return s >= O.acilis && s < O.kapanis; }
    function saatYaz() { var s = saat(), h = Math.floor(s), m = Math.round((s - h) * 60); return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m; }
    function balon(metin, ben, gec) {
      var b = document.createElement("div"); b.className = "mg-bal " + (ben ? "ben" : "o");
      b.innerHTML = metin + '<time>' + saatYaz() + (ben ? " ✓✓" : "") + "</time>";
      if (!ben && gec !== 0) { var y = document.createElement("div"); y.className = "mg-bal o yaz"; y.innerHTML = "<i></i><i></i><i></i>"; akis.appendChild(y); akis.scrollTop = akis.scrollHeight;
        setTimeout(function () { y.remove(); akis.appendChild(b); akis.scrollTop = akis.scrollHeight; }, gec || 700); }
      else { akis.appendChild(b); akis.scrollTop = akis.scrollHeight; }
    }
    function hizli(l) { hiz.innerHTML = l.map(function (x) { return "<button>" + esc(x) + "</button>"; }).join(""); $$("button", hiz).forEach(function (b) { b.onclick = function () { gonder(b.textContent); }; }); }
    function ilanBul(t) {
      t = t.toLocaleLowerCase("tr");
      var aday = IL.filter(function (i) {
        var m = i.mahalle.toLocaleLowerCase("tr").split(" ")[0];
        return t.indexOf(m.slice(0, 5)) >= 0 || (i.oda && t.indexOf(i.oda) >= 0) || t.indexOf(i.no) >= 0;
      });
      var tam = aday.filter(function (i) { var m = i.mahalle.toLocaleLowerCase("tr").split(" ")[0]; return t.indexOf(m.slice(0, 5)) >= 0 && (!i.oda || t.indexOf(i.oda) >= 0 || !/\d\+\d/.test(t)); });
      if (/kira/.test(t)) tam = (tam.length ? tam : aday).filter(function (i) { return i.durum === "Kiralık"; });
      return (tam.length ? tam : aday)[0] || null;
    }
    function ilanCevap(il) {
      var s = "<b>" + esc(il.baslik) + "</b><br>" + esc(il.durum) + " · " + (il.m2 ? il.m2 + " m² · " : "") + esc(il.kat || il.tur) + "<br>";
      s += il.fiyat ? "Fiyat: <b>" + esc(fiyatYaz(il)) + "</b>" : "Fiyatı ilanda yazmıyor; Arif Bey size <b>sabah ilk iş</b> fiyatı ve pazarlık payını iletecek.";
      if (konutMu(il)) s += "<br>Bina yaşı: " + (yasYaz(il) || "ofis bildirecek") + " · Aidat: " + (aidatYaz(il) || "ofis bildirecek");
      if (il.ozellik.length) s += "<br>" + esc(il.ozellik.slice(0, 3).join(" · "));
      return s;
    }
    function bitir() {
      var t = { ad: S.ad, ilan: S.ilan ? S.ilan.baslik : "Genel talep", saat: saatYaz(), randevu: S.randevu || "-" };
      S.talepler.push(t);
      balon("Teşekkürler " + esc(S.ad) + " Bey/Hanım 🙏 Talebiniz kaydedildi. " + (mesai() ? "Arif Bey birazdan sizi arayacak." : "Ofisimiz <b>08:00</b>'de açılıyor; Arif Bey sabah <b>08:30</b>'da sizi arayıp görme saatini teyit edecek.") + " İyi akşamlar dileriz.", false, 900);
      setTimeout(function () {
        var oz = document.createElement("div"); oz.className = "mg-as-ozet";
        oz.innerHTML = "<b>Arif Bey'in telefonuna düşen özet</b><span>🕘 " + t.saat + " · " + esc(t.ad) + "</span><span>🏠 " + esc(t.ilan) + "</span><span>📅 İstenen görme: " + esc(t.randevu) + "</span><span>✅ Müşteriye ilk cevap " + (mesai() ? "anında" : "mesai dışında, 5 sn içinde") + " verildi</span>";
        akis.appendChild(oz); akis.scrollTop = akis.scrollHeight; hizli(["Yeni sohbet başlat"]);
      }, 1900);
      S.adim = "bitti";
    }
    function gonder(m) {
      m = String(m || "").trim(); if (!m) return; balon(esc(m), true); inp.value = ""; hiz.innerHTML = "";
      var t = m.toLocaleLowerCase("tr");
      if (m === "Yeni sohbet başlat") { akis.innerHTML = ""; S = { ad: "", ilan: null, adim: "", talepler: S.talepler }; ac(); return; }
      if (S.adim === "ad") { S.ad = m.split(" ")[0].replace(/^./, function (c) { return c.toLocaleUpperCase("tr"); }); return bitir(); }
      if (S.adim === "randevu") { S.randevu = m; S.adim = "ad"; balon("Not aldım: <b>" + esc(m) + "</b>. Son olarak adınızı yazar mısınız? Arif Bey sizi bu numaradan arayacak.", false, 800); return; }
      if (/görmek|gez|bakmak|randevu|ne zaman|görebilir/.test(t)) {
        S.adim = "randevu"; balon("Tabii! " + (S.ilan ? "<b>" + esc(S.ilan.baslik) + "</b> için " : "") + "hangi gün size uygun?", false, 800);
        return hizli(["Yarın 10:00", "Yarın 17:30", "Cumartesi 11:00"]);
      }
      var il = ilanBul(m);
      if (/kredi|taksit|peşinat/.test(t)) {
        var hedef = S.ilan || il || IL[2];
        var f = hedef.fiyat || 4050000, r = 0.0269, K = f * 0.7, ta = K * r / (1 - Math.pow(1 + r, -120));
        balon("%30 peşinat ve 120 ay vadeyle " + esc(hedef.baslik) + " için aylık taksit yaklaşık <b>" + tl(ta) + "</b> (aylık %2,69 ile). Kesin oranı bankanız verir; isterseniz görme randevusu ayarlayalım.", false, 900);
        return hizli(["Görmek istiyorum", "Başka ilan var mı?"]);
      }
      if (/aidat|bina yaşı|kaç yaşında|kaçıncı kat|fiyat|ne kadar|kaç para|bilgi|var mı|kiralık|satılık|\d\+\d/.test(t) || il) {
        if (!il && /başka|var mı|kiralık|satılık/.test(t)) {
          var l = IL.filter(function (i) { return /kira/.test(t) ? i.durum === "Kiralık" : konutMu(i) && i.durum === "Satılık"; }).slice(0, 4);
          balon("Şu an öne çıkan ilanlarımız:<br>" + l.map(function (i) { return "• " + esc(i.baslik) + " — " + esc(fiyatYaz(i)); }).join("<br>") + "<br>Hangisiyle ilgilenirsiniz?", false, 900);
          return hizli(l.slice(0, 3).map(function (i) { return i.mahalle + " " + (i.oda || i.tur); }));
        }
        il = il || S.ilan;
        if (il) { S.ilan = il; balon(ilanCevap(il), false, 1000); setTimeout(function () { balon("Fotoğrafların tamamını ve konumu da gönderebilirim. Görmek ister misiniz?", false, 600); hizli(["Görmek istiyorum", "Kredi ile alırsam taksit ne olur?", "Başka ilan var mı?"]); }, 1200); return; }
      }
      if (/merhaba|selam|iyi akşam|günaydın|kolay gelsin/.test(t)) { balon("Merhaba, hoş geldiniz! Hangi ilanımızla ilgileniyorsunuz? Mahalle ya da oda sayısı yazmanız yeterli.", false, 700); return hizli(["Uzunoluk 3+1", "Kiralık 2+1", "Arsa / tarla"]); }
      if (/arsa|tarla/.test(t)) {
        var a = IL.filter(function (i) { return !konutMu(i); }).slice(0, 5);
        balon("Arsa ve tarla ilanlarımız:<br>" + a.map(function (i) { return "• " + esc(i.baslik) + " — " + esc(fiyatYaz(i)); }).join("<br>"), false, 900); return hizli(["Karataş tarla", "Kevzer arsa", "Görmek istiyorum"]);
      }
      balon("Sorunuzu Arif Bey'e ilettim; " + (mesai() ? "birkaç dakika içinde" : "sabah 08:30'da") + " size dönecek. Bu arada adınızı yazar mısınız?", false, 800); S.adim = "ad";
    }
    function ac() {
      $("[data-durum]", k).textContent = mesai() ? "çevrimiçi" : "asistan · ofis kapalı";
      if (akis.children.length) return;
      balon(esc("Uzunoluk'taki 3+1'in fiyatı ne kadar? Aidat var mı?"), true);
      S.ilan = IL[0];
      setTimeout(function () {
        balon((mesai() ? "Merhaba, " : (saat() >= 22 ? "İyi geceler, " : "İyi akşamlar, ")) + "Mermerler Gayrimenkul'e hoş geldiniz 👋" + (mesai() ? "" : " Ofisimiz şu an kapalı ama ben hemen yardımcı olabilirim."), false, 600);
        setTimeout(function () { balon(ilanCevap(IL[0]), false, 900); setTimeout(function () { balon("Evi görmek isterseniz uygun gününüzü yazın, randevunuzu ayarlayayım.", false, 500); hizli(["Görmek istiyorum", "Kredi ile alırsam taksit ne olur?", "Başka ilan var mı?"]); }, 1100); }, 900);
      }, 500);
    }
    $(".mg-as-ac", k).onclick = function () { k.classList.add("acik"); ac(); setTimeout(function () { inp.focus({ preventScroll: true }); }, 50); };
    $(".mg-as-x", k).onclick = function () { k.classList.remove("acik"); };
    $("form", k).onsubmit = function (e) { e.preventDefault(); gonder(inp.value); };
    saatSec.onchange = function () { akis.innerHTML = ""; S = { ad: "", ilan: null, adim: "", talepler: S.talepler }; ac(); };
    window.MGU.asistanAc = function () { k.classList.add("acik"); ac(); };
  }

  /* ---- Google profil + yorum (herkese aynı bağlantı) ---- */
  function google(el) {
    el.innerHTML = '<div class="mg-goo"><div class="mg-goo-p"><b>' + O.puan + '</b><span>★★★★★</span><small>Google · ' + O.yorum + ' yorum</small></div>' +
      '<div class="mg-goo-y"><blockquote>“Çok ilgililer, güler yüzlü, cana yakın bir ekip; hayalimizdeki daireyi uygun fiyata aldık.”<cite>Google yorumu</cite></blockquote><blockquote>“Dürüst ve kaliteli, ilkeli bir emlakçı.”<cite>Google yorumu</cite></blockquote></div>' +
      '<div class="mg-goo-d"><a class="mg-btn" target="_blank" rel="noopener" href="' + O.google + '">Google\'da yorum yazın</a><a class="mg-btn ince" target="_blank" rel="noopener" href="' + O.google + '">Yol tarifi al</a><p class="mg-kaynak">Yorum bağlantısı her müşteriye aynı şekilde gönderilir.</p></div></div>';
  }

  /* ---- Filigran + Dijitabela notu ---- */
  function filigran() {
    if ($(".mg-fil")) return;
    var f = document.createElement("a"); f.className = "mg-fil"; f.href = "../"; f.textContent = "ÖRNEK · DİJİTABELA"; f.title = "Bu sayfa Dijitabela'nın hazırladığı örnek tasarımdır";
    document.body.appendChild(f);
  }

  window.MGU = { D: D, O: O, IL: IL, $: $, $$: $$, esc: esc, tl: tl, foto: foto, fiyatYaz: fiyatYaz, ozet: ozet, rozet: rozet, kapak: kapak, alan: alan, yasYaz: yasYaz, aidatYaz: aidatYaz, m2Fiyat: m2Fiyat,
    konutMu: konutMu, bul: bul, wa: wa, ilanSor: ilanSor, filtrele: filtrele, filtreUI: filtreUI, F: F, secenekler: secenekler, favMi: favMi, favDegis: favDegis, fav: function () { return fav.slice(); },
    pencere: pencere, galeri: galeri, detay: detay, alarm: alarm, karsilastir: karsilastir, harita: harita, kredi: kredi, kiraKredi: kiraKredi, degerleme: degerleme, eslestir: eslestir, ilanMetni: ilanMetni,
    asistan: asistan, google: google, filigran: filigran, depo: depo };
  document.addEventListener("DOMContentLoaded", filigran);
})();
