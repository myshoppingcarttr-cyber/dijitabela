/* Ege Ekin İnşaat · 3 tasarımın ortak motoru (Dijitabela prototipi, 12 Eki 2026).
   - Mimari illüstrasyon üretici (SVG): görseller temsilîdir; gerçek proje fotoğrafları gelince değiştirilir.
   - Kat karşılığı hesaplayıcı, proje filtresi, keşif talebi → WhatsApp, görünür olunca canlandırma. */
(function (w, d) {
  "use strict";
  var TEL = "0534 088 88 84", WA = "905340888884", EPOSTA = "egeekin795@gmail.com";
  w.EGE = { TEL: TEL, WA: WA, EPOSTA: EPOSTA };
  function rnd(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; }; }
  // Bina illüstrasyonu: kat sayısı, cephe paleti, saat (gün/akşam), inşaat oranı (0-1)
  function bina(o) {
    o = o || {}; var r = rnd(o.tohum || "ege"), kat = o.kat || 6, birim = o.birim || 4, W = 600, H = 460, zemin = 400;
    var P = o.palet || { gok1: "#F6E7D2", gok2: "#E9EEF2", cephe: "#F4F1EA", golge: "#DCD6CA", cam: "#9FB7C2", cam2: "#C9DCE3", vurgu: "#B5835A", zemin: "#CFC6B6", agac: "#4F6B4A" };
    if (o.aksam) P = { gok1: "#1B2333", gok2: "#3C3F5C", cephe: "#2A2F3A", golge: "#20242C", cam: "#F4C46A", cam2: "#FFDD99", vurgu: "#C98B5A", zemin: "#151820", agac: "#22302A" };
    var oran = o.oran == null ? 1 : o.oran, bw = 300 + birim * 10, bx = (W - bw) / 2, kh = Math.min(48, 300 / kat), by = zemin - kat * kh;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.etiket || "Mimari illüstrasyon") + '" preserveAspectRatio="xMidYMax slice">';
    s += '<defs><linearGradient id="g' + (o.tohum || "") + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + P.gok1 + '"/><stop offset="1" stop-color="' + P.gok2 + '"/></linearGradient></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="url(#g' + (o.tohum || "") + ')"/>';
    // dağlar (Toroslar) ve deniz çizgisi
    s += '<path d="M0 ' + (zemin - 70) + ' L80 ' + (zemin - 130) + ' L150 ' + (zemin - 95) + ' L240 ' + (zemin - 160) + ' L330 ' + (zemin - 105) + ' L420 ' + (zemin - 150) + ' L520 ' + (zemin - 92) + ' L600 ' + (zemin - 120) + ' L600 ' + zemin + ' L0 ' + zemin + 'Z" fill="' + (o.aksam ? "#2B3247" : "#C9D3D6") + '" opacity=".7"/>';
    if (!o.aksam) s += '<circle cx="' + (470 + r() * 60) + '" cy="70" r="26" fill="#F4C27A" opacity=".85"/>';
    else for (var y = 0; y < 18; y++) s += '<circle cx="' + Math.round(r() * W) + '" cy="' + Math.round(r() * 160) + '" r="' + (r() * 1.4 + .4).toFixed(1) + '" fill="#fff" opacity=".7"/>';
    var tamKat = Math.round(kat * oran);
    // vinç (inşaat sürüyorsa)
    if (oran < 1) { var vx = bx + bw + 30; s += '<g stroke="#E2A43B" stroke-width="5" fill="none"><path d="M' + vx + ' ' + zemin + ' V' + (by - 60) + '"/><path d="M' + (vx - 170) + ' ' + (by - 50) + ' H' + (vx + 60) + '"/><path d="M' + vx + ' ' + (by - 60) + ' L' + (vx - 120) + ' ' + (by - 50) + '" stroke-width="2"/></g><path d="M' + (vx - 110) + ' ' + (by - 50) + ' V' + (by - 10) + '" stroke="#555" stroke-width="1.5"/><rect x="' + (vx - 122) + '" y="' + (by - 10) + '" width="24" height="12" fill="#8B8B8B"/>'; }
    // gövde
    for (var k = 0; k < kat; k++) {
      var yy = zemin - (k + 1) * kh, yapildi = k < tamKat;
      if (!yapildi) { s += '<rect x="' + bx + '" y="' + yy + '" width="' + bw + '" height="' + kh + '" fill="none" stroke="' + P.golge + '" stroke-dasharray="6 6"/>'; continue; }
      var iskelet = oran < 1 && k >= tamKat - 1;
      s += '<rect x="' + bx + '" y="' + yy + '" width="' + bw + '" height="' + kh + '" fill="' + (iskelet ? "#BDB6A8" : P.cephe) + '"/>';
      s += '<rect x="' + bx + '" y="' + (yy + kh - 5) + '" width="' + bw + '" height="5" fill="' + P.golge + '"/>';
      if (iskelet) { for (var c = 0; c <= birim * 2; c++) s += '<rect x="' + (bx + c * bw / (birim * 2) - 3) + '" y="' + yy + '" width="6" height="' + kh + '" fill="#9A9284"/>'; continue; }
      var uw = bw / birim;
      for (var u = 0; u < birim; u++) {
        var ux = bx + u * uw, yan = r() < (o.aksam ? .55 : .2);
        s += '<rect x="' + (ux + 10) + '" y="' + (yy + 8) + '" width="' + (uw - 20) + '" height="' + (kh - 18) + '" fill="' + (yan ? P.cam2 : P.cam) + '" opacity="' + (o.aksam && !yan ? .35 : .95) + '"/>';
        s += '<rect x="' + (ux + uw / 2 - 1) + '" y="' + (yy + 8) + '" width="2" height="' + (kh - 18) + '" fill="' + P.cephe + '" opacity=".6"/>';
        if (k > 0) s += '<rect x="' + (ux + 6) + '" y="' + (yy + kh - 12) + '" width="' + (uw - 12) + '" height="3" fill="' + P.vurgu + '"/><rect x="' + (ux + 6) + '" y="' + (yy + kh - 22) + '" width="' + (uw - 12) + '" height="10" fill="none" stroke="' + P.vurgu + '" stroke-width="1.5" opacity=".8"/>';
      }
    }
    // çatı / pergola
    if (oran >= 1) s += '<rect x="' + (bx - 8) + '" y="' + (by - 8) + '" width="' + (bw + 16) + '" height="8" fill="' + P.vurgu + '"/><g stroke="' + P.vurgu + '" stroke-width="3">' + Array.apply(null, Array(9)).map(function (_, i) { return '<path d="M' + (bx + 20 + i * (bw - 40) / 8) + ' ' + (by - 8) + ' V' + (by - 26) + '"/>'; }).join("") + '<path d="M' + (bx + 14) + ' ' + (by - 26) + ' H' + (bx + bw - 14) + '"/></g>';
    // dikey vurgu şerit
    if (oran >= 1) s += '<rect x="' + (bx + bw * .5 - 14) + '" y="' + by + '" width="28" height="' + (zemin - by) + '" fill="' + P.vurgu + '" opacity=".22"/>';
    // giriş, zemin, palmiyeler
    s += '<rect x="' + (bx + bw / 2 - 30) + '" y="' + (zemin - 34) + '" width="60" height="34" fill="' + (o.aksam ? "#FFD27A" : "#6E8792") + '" opacity=".9"/>';
    s += '<rect x="0" y="' + zemin + '" width="' + W + '" height="' + (H - zemin) + '" fill="' + P.zemin + '"/><rect x="0" y="' + zemin + '" width="' + W + '" height="6" fill="' + P.golge + '"/>';
    [40, 110, W - 110, W - 40].forEach(function (px, i) { var ph = 90 + r() * 40; s += '<path d="M' + px + ' ' + zemin + ' q' + (i % 2 ? 6 : -6) + ' ' + (-ph / 2) + ' 0 ' + (-ph) + '" stroke="' + (o.aksam ? "#3A3328" : "#7A5E43") + '" stroke-width="5" fill="none"/>' + [0, 60, 120, 180, 240, 300].map(function (a) { var rad = a * Math.PI / 180; return '<path d="M' + px + ' ' + (zemin - ph) + ' q' + Math.cos(rad) * 22 + ' ' + (Math.sin(rad) * 10 - 12) + ' ' + Math.cos(rad) * 40 + ' ' + (Math.sin(rad) * 22 + 8) + '" stroke="' + P.agac + '" stroke-width="5" fill="none" stroke-linecap="round"/>'; }).join(""); });
    if (o.etiketYaz) s += '<text x="18" y="' + (H - 18) + '" font-family="system-ui" font-size="12" fill="' + (o.aksam ? "#aab" : "#6b6455") + '">Temsilî illüstrasyon</text>';
    return s + "</svg>";
  }
  w.EGE.bina = bina;
  // Projeler (ÖRNEK kartlar: gerçek projeler gelince değişir)
  w.EGE.PROJELER = [
    { id: "a", ad: "Konyaaltı Sahil Evleri", yer: "Liman Mah., Konyaaltı", durum: "devam", oran: .62, kat: 6, birim: 4, daire: "2+1 · 3+1", m2: "95-145 m²", teslim: "2027 bahar", tohum: "sahil" },
    { id: "b", ad: "Hurma Park Konutları", yer: "Hurma Mah., Konyaaltı", durum: "satilik", oran: 1, kat: 5, birim: 3, daire: "3+1 · 4+1 dubleks", m2: "140-210 m²", teslim: "Hemen teslim", tohum: "hurma" },
    { id: "c", ad: "Uncalı Bahçe Evleri", yer: "Uncalı Mah., Konyaaltı", durum: "tamam", oran: 1, kat: 4, birim: 3, daire: "1+1 · 2+1", m2: "65-110 m²", teslim: "Teslim edildi", tohum: "uncali" },
    { id: "d", ad: "Sarısu Kentsel Dönüşüm", yer: "Sarısu Mah., Konyaaltı", durum: "devam", oran: .28, kat: 7, birim: 4, daire: "2+1 · 3+1", m2: "90-150 m²", teslim: "2027 sonbahar", tohum: "sarisu" },
    { id: "e", ad: "Gürsu Butik Apartman", yer: "Gürsu Mah., Konyaaltı", durum: "tamam", oran: 1, kat: 5, birim: 2, daire: "3+1", m2: "150 m²", teslim: "Teslim edildi", tohum: "gursu" },
    { id: "f", ad: "Altınkum Rezidans", yer: "Altınkum Mah., Konyaaltı", durum: "satilik", oran: 1, kat: 8, birim: 4, daire: "1+1 · 2+1 · 3+1", m2: "60-140 m²", teslim: "Hemen teslim", tohum: "altinkum" }
  ];
  w.EGE.DURUM = { devam: "Devam eden", satilik: "Satılık daire var", tamam: "Tamamlandı" };
  // Kat karşılığı hesaplama (kaba, bilgi amaçlı)
  w.EGE.katKarsiligi = function (arsa, emsal, katSay, ortM2, pay) {
    var insaat = arsa * emsal, net = insaat * .82, daire = Math.max(1, Math.floor(net / ortM2)), sahip = Math.round(daire * pay / 100);
    return { insaat: Math.round(insaat), net: Math.round(net), daire: daire, sahip: sahip, firma: daire - sahip, katBasi: Math.max(1, Math.round(daire / katSay)) };
  };
  w.EGE.wa = function (metin) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(metin); };
  // Görünür olunca canlandır
  function gor() {
    var el = d.querySelectorAll(".gor:not(.on)"); if (!("IntersectionObserver" in w)) { el.forEach(function (e) { e.classList.add("on"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }); }, { threshold: .12 });
    el.forEach(function (e) { io.observe(e); }); setTimeout(function () { el.forEach(function (e) { e.classList.add("on"); }); }, 1800);
  }
  // [data-bina] yer tutucuları doldur
  function doldur() { d.querySelectorAll("[data-bina]").forEach(function (x) { try { x.innerHTML = bina(JSON.parse(x.getAttribute("data-bina"))); } catch (e) {} }); }
  // [data-tel] [data-wa] bağlantıları
  function baglanti() {
    d.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:+90" + TEL.replace(/\D/g, "").slice(1); if (!a.textContent.trim()) a.textContent = TEL; });
    d.querySelectorAll("[data-wa]").forEach(function (a) { a.href = w.EGE.wa(a.getAttribute("data-wa") || "Merhaba Ege Ekin, bilgi almak istiyorum."); a.target = "_blank"; a.rel = "noopener"; });
    d.querySelectorAll("[data-eposta]").forEach(function (a) { a.href = "mailto:" + EPOSTA; if (!a.textContent.trim()) a.textContent = EPOSTA; });
  }
  // Keşif / teklif formu → WhatsApp mesajı
  function formlar() {
    d.querySelectorAll("form[data-kesif]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var v = {}; new FormData(f).forEach(function (x, k) { v[k] = x; });
        var m = "Merhaba Ege Ekin, " + (v.konu || "ücretsiz keşif") + " için bilgi almak istiyorum.\n" + Object.keys(v).filter(function (k) { return k !== "konu" && v[k]; }).map(function (k) { return "• " + k + ": " + v[k]; }).join("\n");
        var s = f.querySelector(".sonuc"); if (s) { s.hidden = false; s.innerHTML = 'Talebiniz hazır. <a href="' + w.EGE.wa(m) + '" target="_blank" rel="noopener">WhatsApp\'tan gönderin →</a> ya da <a href="tel:+905340888884">hemen arayın</a>.'; }
      });
    });
  }
  // Hesaplayıcı
  function hesap() {
    d.querySelectorAll("[data-hesap]").forEach(function (h) {
      var g = function (n) { return h.querySelector('[name="' + n + '"]'); };
      function ciz() {
        var R = w.EGE.katKarsiligi(+g("arsa").value || 0, +g("emsal").value || 0, +g("kat").value || 1, +g("m2").value || 100, +g("pay").value || 50);
        ["arsa", "emsal", "kat", "m2", "pay"].forEach(function (n) { var o = h.querySelector('[data-goster="' + n + '"]'); if (o) o.textContent = g(n).value + (n === "pay" ? " %" : n === "arsa" || n === "m2" ? " m²" : ""); });
        var s = h.querySelector(".h-sonuc");
        s.innerHTML = '<div><small>Toplam inşaat alanı</small><b>' + R.insaat.toLocaleString("tr-TR") + ' m²</b></div><div><small>Tahmini daire</small><b>' + R.daire + '</b></div><div class="vurgu"><small>Arsa sahibine düşen</small><b>' + R.sahip + ' daire</b></div><div><small>Kat başına</small><b>~' + R.katBasi + ' daire</b></div>';
        var gor = h.querySelector(".h-daireler"); if (gor) { gor.innerHTML = Array.apply(null, Array(R.daire)).map(function (_, i) { return '<i class="' + (i < R.sahip ? "s" : "") + '" style="animation-delay:' + (i * 25) + 'ms"></i>'; }).join(""); }
        var b = h.querySelector(".h-gonder"); if (b) b.href = w.EGE.wa("Merhaba Ege Ekin, kat karşılığı için arsamı değerlendirmenizi istiyorum. Arsa " + g("arsa").value + " m², emsal " + g("emsal").value + ", hesaplayıcıda " + R.daire + " daire / " + R.sahip + " daire arsa sahibine çıktı.");
      }
      h.addEventListener("input", ciz); ciz();
    });
  }
  // Proje filtresi + detay
  function projeler() {
    var kap = d.querySelector("[data-projeler]"); if (!kap) return;
    var sablon = kap.getAttribute("data-projeler") || "kart";
    function ciz(f) {
      kap.innerHTML = w.EGE.PROJELER.filter(function (p) { return !f || f === "hepsi" || p.durum === f; }).map(function (p) {
        return '<article class="proje gor on" data-p="' + p.id + '"><div class="pg" data-bina=\'' + JSON.stringify({ tohum: p.tohum, kat: p.kat, birim: p.birim, oran: p.oran, aksam: sablon === "gece" }) + '\'></div><div class="pi"><span class="pd ' + p.durum + '">' + w.EGE.DURUM[p.durum] + (p.durum === "devam" ? " · %" + Math.round(p.oran * 100) : "") + '</span><h3>' + p.ad + '</h3><p>' + p.yer + '</p><dl><div><dt>Daire</dt><dd>' + p.daire + '</dd></div><div><dt>Alan</dt><dd>' + p.m2 + '</dd></div><div><dt>Teslim</dt><dd>' + p.teslim + '</dd></div></dl>' + (p.durum === "devam" ? '<div class="ilerleme"><i style="width:' + Math.round(p.oran * 100) + '%"></i></div>' : '') + '</div></article>';
      }).join("");
      doldur();
    }
    d.querySelectorAll("[data-filtre]").forEach(function (b) { b.addEventListener("click", function () { d.querySelectorAll("[data-filtre]").forEach(function (x) { x.classList.toggle("on", x === b); }); ciz(b.getAttribute("data-filtre")); }); });
    kap.addEventListener("click", function (e) {
      var a = e.target.closest(".proje"); if (!a) return; var p = w.EGE.PROJELER.filter(function (x) { return x.id === a.getAttribute("data-p"); })[0], m = d.getElementById("pmodal"); if (!m) return;
      m.querySelector(".m-ic").innerHTML = '<button class="m-kapat" aria-label="Kapat">×</button><div class="m-gor" data-bina=\'' + JSON.stringify({ tohum: p.tohum, kat: p.kat, birim: p.birim, oran: p.oran, etiketYaz: 1 }) + '\'></div><div class="m-yazi"><span class="pd ' + p.durum + '">' + w.EGE.DURUM[p.durum] + '</span><h3>' + p.ad + '</h3><p>' + p.yer + ' · ' + p.kat + ' kat · ' + p.daire + ' · ' + p.m2 + '</p>' + (p.durum === "devam" ? '<p><b>İnşaat ilerlemesi: %' + Math.round(p.oran * 100) + '</b> · kaba inşaat ' + (p.oran > .5 ? "tamamlandı, ince işler sürüyor" : "sürüyor") + '</p><div class="ilerleme"><i style="width:' + Math.round(p.oran * 100) + '%"></i></div>' : '') + '<p class="kucuk">Örnek proje kartıdır; gerçek projeleriniz, kat planları ve fotoğraflarla doldurulur.</p><a class="dg" target="_blank" rel="noopener" href="' + w.EGE.wa("Merhaba, " + p.ad + " hakkında bilgi almak istiyorum.") + '">Bu proje için WhatsApp\'tan sor</a></div>';
      m.hidden = false; doldur(); m.querySelector(".m-kapat").focus();
    });
    var m = d.getElementById("pmodal"); if (m) m.addEventListener("click", function (e) { if (e.target === m || e.target.closest(".m-kapat")) m.hidden = true; });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && m) m.hidden = true; });
    ciz("hepsi");
  }
  function basla() { doldur(); baglanti(); formlar(); hesap(); projeler(); gor(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", basla); else basla();
})(window, document);
