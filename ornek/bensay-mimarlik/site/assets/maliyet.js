/* bensay · maliyet hesaplayıcı v2 (30 Eki 2026)
   Alan tipi (Ofis / Konut / Ticari / Kafe-Restoran / Klinik + alt tip) × m² × oda × salon × ıslak hacim × kalite → YAKLAŞIK ön teklif aralığı.
   Tüm tipler, alt tipler, birim fiyatlar ve katsayılar icerik.maliyet'ten gelir (yönetim panelinden düzenlenir). */
(function () {
"use strict";
var R, D = { tip: null, alt: "", m2: 100, oda: 3, salon: 1, islak: 1, kalite: null };
function T(o) { return R.T(o); }
function T2(a, b) { return R.T({ tr: a, en: b }); }
function tr(o) { return R.tr(o); }
function L(o) { return window.bnEn && bnEn() ? R.en(o) : R.tr(o); }
function sayi(n) { return Math.round(Number(n) || 0).toLocaleString("tr-TR"); }
function bul(l, id) { return (l || []).filter(function (x) { return x.id === id; })[0]; }

function hesap(M) {
  var t = bul(M.tipler, D.tip) || (M.tipler || [])[0] || {}, k = bul(M.kaliteler, D.kalite) || (M.kaliteler || [])[0] || {};
  var a = bul(t.altTipler, D.alt), kt = (Number(t.katsayi) || 1) * (a ? Number(a.katsayi) || 1 : 1);
  var satir = [
    { ad: { tr: "Alan", en: "Area" }, mik: D.m2 + " m²", t: D.m2 * (Number(k.m2) || 0) },
    { ad: t.odaEtiket || { tr: "Oda", en: "Rooms" }, mik: D.oda + " ×", t: D.oda * (Number(k.oda) || 0) },
    { ad: t.salonEtiket || { tr: "Salon", en: "Halls" }, mik: D.salon + " ×", t: D.salon * (Number(k.salon) || 0) },
    { ad: M.islakEtiket || { tr: "Islak hacim", en: "Wet rooms" }, mik: D.islak + " ×", t: D.islak * (Number(k.islak) || 0) }
  ];
  var ara = satir.reduce(function (s, x) { return s + x.t; }, 0), top = ara * kt, ap = (Number(M.aralikYuzde) || 0) / 100;
  return { t: t, k: k, a: a, kt: kt, satir: satir, ara: ara, alt: top * (1 - ap), ust: top * (1 + ap), top: top };
}

function sayac(id, deger, etiket, min, max) {
  return '<div class="mh-say"><span class="mh-et">' + T(etiket) + '</span><div class="mh-sd"><button type="button" data-azal="' + id + '" aria-label="Azalt">−</button>' +
    '<input id="mh-' + id + '" data-alan="' + id + '" type="number" inputmode="numeric" min="' + min + '" max="' + max + '" value="' + deger + '" aria-label="' + R.esc(tr(etiket)) + '">' +
    '<button type="button" data-art="' + id + '" aria-label="Artır">+</button></div></div>';
}

function kur(ic) {
  R = window.BNRender; var kok = document.getElementById("maliyetHesap"); if (!R || !kok) return;
  var M = ic.maliyet || {}; if (!(M.tipler || []).length || !(M.kaliteler || []).length) { kok.innerHTML = '<p class="acik">' + T2("Hesaplayıcı yakında.", "Estimator coming soon.") + "</p>"; return; }
  if (!bul(M.tipler, D.tip)) D.tip = M.tipler[0].id;
  if (!bul(M.kaliteler, D.kalite)) D.kalite = (M.kaliteler[1] || M.kaliteler[0]).id;
  var kesif = (ic.dugmeler || {}).kesif || {};

  function ciz() {
    var t = bul(M.tipler, D.tip), A = t.altTipler || [];
    if (D.alt && !bul(A, D.alt)) D.alt = "";
    kok.innerHTML = '<div class="mh-ic"><div class="mh-form">' +
      '<div class="mh-adim"><span class="mh-no">1</span><h3>' + T2("Alan tipi", "Space type") + '</h3></div><div class="mh-tipler" role="radiogroup" aria-label="Alan tipi">' +
      M.tipler.map(function (x) { return '<button type="button" role="radio" aria-checked="' + (x.id === D.tip) + '" data-tip="' + R.esc(x.id) + '">' + T(x.ad) + "</button>"; }).join("") + "</div>" +
      (A.length ? '<label class="mh-et" for="mh-alt" style="margin-top:14px;display:block">' + T(t.altBaslik && (t.altBaslik.tr || t.altBaslik.en) ? t.altBaslik : { tr: "Alt tip", en: "Subtype" }) + '</label><select id="mh-alt" class="mh-sel"><option value="">' +
        R.esc(window.bnEn && bnEn() ? "Choose (optional)" : "Seçin (isteğe bağlı)") + "</option>" + A.map(function (x) { return '<option value="' + R.esc(x.id) + '"' + (x.id === D.alt ? " selected" : "") + ">" + R.esc(L(x.ad)) + "</option>"; }).join("") + "</select>" : "") +
      '<div class="mh-adim"><span class="mh-no">2</span><h3>' + T2("Büyüklük", "Size") + '</h3></div>' +
      '<div class="mh-m2"><label class="mh-et" for="mh-m2">' + T2("Metrekare", "Area") + ' (m²)</label><div class="mh-m2s"><input id="mh-m2" data-alan="m2" type="number" inputmode="numeric" min="10" max="5000" value="' + D.m2 + '"><input id="mh-m2r" type="range" min="20" max="600" step="5" value="' + Math.min(600, D.m2) + '" aria-label="Metrekare"></div></div>' +
      '<div class="mh-sayac">' + sayac("oda", D.oda, t.odaEtiket || { tr: "Oda", en: "Rooms" }, 0, 60) + sayac("salon", D.salon, t.salonEtiket || { tr: "Salon", en: "Halls" }, 0, 20) + sayac("islak", D.islak, M.islakEtiket || { tr: "Islak hacim", en: "Wet rooms" }, 0, 30) + "</div>" +
      '<div class="mh-adim"><span class="mh-no">3</span><h3>' + T2("Malzeme kalitesi", "Material quality") + '</h3></div><div class="mh-kaliteler" role="radiogroup" aria-label="Kalite">' +
      M.kaliteler.map(function (k) { return '<button type="button" role="radio" aria-checked="' + (k.id === D.kalite) + '" data-kalite="' + R.esc(k.id) + '"><b>' + T(k.ad) + "</b><small>" + T(k.aciklama) + "</small></button>"; }).join("") +
      '</div><a class="mh-link" href="#markalar">' + T2("Hangi markaları kullanıyoruz? →", "Which brands do we use? →") + "</a></div>" +
      '<div class="mh-sonuc" aria-live="polite"><div class="etiket">' + T2("Yaklaşık ön teklif", "Approximate preliminary quote") + "</div>" + (M.ornek ? '<span class="mh-ornek">' + T2("örnek katsayılar", "sample rates") + "</span>" : "") +
      '<div class="mh-top" id="mh-top"></div><div class="mh-alt" id="mh-ozet"></div><table class="mh-tbl"><tbody id="mh-kirilim"></tbody></table>' +
      '<p class="not">' + T(M.not) + '</p><div class="dgs"><a class="dg wa" id="mh-wa" href="#" target="_blank" rel="noopener">' + T2("Ön teklifi WhatsApp'tan gönder", "Send on WhatsApp") + "</a>" +
      (kesif.hedef ? '<a class="dg i" id="mh-kesif" href="' + R.esc(kesif.hedef) + '">' + T2("Kesin fiyat için keşif iste", "Request a site visit") + "</a>" : "") + "</div></div></div>";
    guncel();
  }
  function guncel() {
    var r = hesap(M), pb = " " + (M.paraBirimi || "₺");
    var top = kok.querySelector("#mh-top"); if (!top) return;
    top.textContent = "≈ " + sayi(r.alt) + " – " + sayi(r.ust) + pb;
    kok.querySelector("#mh-ozet").innerHTML = T(r.t.ad) + (r.a ? " · " + T(r.a.ad) : "") + " · " + D.m2 + " m² · " + T(r.k.ad);
    kok.querySelector("#mh-kirilim").innerHTML = r.satir.map(function (s) { return "<tr><td>" + T(s.ad) + '</td><td class="s">' + s.mik + '</td><td class="s">' + sayi(s.t) + pb + "</td></tr>"; }).join("") +
      (r.kt !== 1 ? "<tr><td>" + T2("Alan tipi katsayısı", "Space type factor") + '</td><td class="s">× ' + r.kt.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + '</td><td class="s"></td></tr>' : "") +
      '<tr class="t"><td>' + T2("Orta değer", "Midpoint") + '</td><td></td><td class="s">' + sayi(r.top) + pb + "</td></tr>";
    var en = window.bnEn && bnEn();
    var ozet = (en ? "Estimate: " : "Ön teklif: ") + L(r.t.ad) + (r.a ? " / " + L(r.a.ad) : "") + ", " + D.m2 + " m², " + D.oda + " " + L(r.t.odaEtiket || { tr: "oda" }) + ", " + D.salon + " " + L(r.t.salonEtiket || { tr: "salon" }) +
      ", " + D.islak + " " + L(M.islakEtiket || { tr: "ıslak hacim" }) + ", " + L(r.k.ad) + " → ≈ " + sayi(r.alt) + " – " + sayi(r.ust) + pb;
    if (D.dokundu) { window.BN_MALIYET_OZET = ozet; try { sessionStorage.setItem("bn_maliyet_ozet", ozet); } catch (e) {} }
    kok.querySelector("#mh-wa").href = bnWa((en ? "Hello, I used the cost estimator on your website.\n" : "Merhaba, sitenizdeki maliyet hesaplayıcıyı kullandım.\n") + ozet + (en ? "\nCan we arrange a site visit?" : "\nKeşif için görüşebilir miyiz?"));
    document.querySelectorAll(".kk-sec").forEach(function (b) { var on = b.getAttribute("data-kalite") === D.kalite; b.setAttribute("aria-pressed", on); b.closest("th").classList.toggle("on", on); });
    document.querySelectorAll(".kk-tablo td, .kk-tablo th").forEach(function (c) { c.classList.toggle("on", c.cellIndex > 0 && M.kaliteler[c.cellIndex - 1] && M.kaliteler[c.cellIndex - 1].id === D.kalite); });
  }
  function sinirla(id, v) { var e = kok.querySelector("#mh-" + id); var mn = +e.min, mx = +e.max; v = Math.round(Number(v) || 0); return Math.max(mn, Math.min(mx, v)); }
  kok.onclick = function (e) {
    var b = e.target.closest("button"); if (!b) return; D.dokundu = true;
    if (b.dataset.tip) { D.tip = b.dataset.tip; D.alt = ""; ciz(); kok.querySelector('[data-tip="' + D.tip + '"]').focus(); }
    else if (b.dataset.kalite) { D.kalite = b.dataset.kalite; kok.querySelectorAll("[data-kalite]").forEach(function (x) { x.setAttribute("aria-checked", x === b); }); guncel(); }
    else if (b.dataset.art || b.dataset.azal) { var id = b.dataset.art || b.dataset.azal; D[id] = sinirla(id, D[id] + (b.dataset.art ? 1 : -1)); kok.querySelector("#mh-" + id).value = D[id]; guncel(); }
  };
  kok.oninput = function (e) {
    var x = e.target; D.dokundu = true;
    if (x.id === "mh-m2r") { D.m2 = +x.value; kok.querySelector("#mh-m2").value = D.m2; }
    else if (x.dataset.alan) { D[x.dataset.alan] = Math.max(0, Math.round(Number(x.value) || 0)); if (x.dataset.alan === "m2") kok.querySelector("#mh-m2r").value = Math.min(600, D.m2); }
    else if (x.id === "mh-alt") D.alt = x.value;
    guncel();
  };
  kok.onchange = function (e) { var x = e.target; if (x.dataset.alan) { D[x.dataset.alan] = sinirla(x.dataset.alan, x.value); x.value = D[x.dataset.alan]; guncel(); } };
  document.querySelectorAll(".kk-sec").forEach(function (b) { b.onclick = function () { D.dokundu = true; D.kalite = b.getAttribute("data-kalite"); ciz(); }; });
  if (!kur.dilDinle) { kur.dilDinle = 1; document.addEventListener("bn:dil", function () { if (document.getElementById("maliyetHesap") && window.BN_ICERIK) kur(window.BN_ICERIK); }); }
  ciz();
}
window.BNMaliyet = { kur: kur, hesap: function (ic, d) { R = window.BNRender; for (var k in d) D[k] = d[k]; return hesap(ic.maliyet); } };
})();
