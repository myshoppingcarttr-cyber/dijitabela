// ===== Ana sayfa: ücretsiz taslak formu → Satış takibi (CRM) =====
(function () {
  "use strict";
  var f = document.getElementById("taslak-form"); if (!f) return;
  var durum = document.getElementById("t-durum");
  var yaz = function (m, sinif) { durum.textContent = m; durum.className = "durum " + (sinif || ""); };
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = {
      isletme: f.isletme.value.trim(), sektor: f.sektor.value, ilce: f.ilce.value.trim(),
      maps: f.maps.value.trim(), tel: f.tel.value.trim(), eposta: f.eposta.value.trim(),
      kvkk: document.getElementById("t-kvkk").checked ? new Date().toISOString() : ""
    };
    if (!d.isletme) return yaz("İşletmenizin adını yazın.", "kotu"), f.isletme.focus();
    if (String(d.tel).replace(/\D/g, "").length < 10) return yaz("Size ulaşabilmemiz için telefon numaranızı yazın.", "kotu"), f.tel.focus();
    if (d.eposta && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.eposta)) return yaz("E-posta adresini kontrol edin.", "kotu"), f.eposta.focus();
    if (!d.kvkk) return yaz("Devam etmek için KVKK onay kutusunu işaretleyin.", "kotu");
    var b = f.querySelector("button"); b.disabled = true; yaz("Gönderiliyor…");
    API.taslakIste(d).then(function () {
      f.reset(); yaz("Talebiniz alındı. Taslağınızı 2 iş günü içinde telefonunuza" + (d.eposta ? " ve e-postanıza" : "") + " göndereceğiz.", "iyi");
    }).catch(function (x) {
      yaz("Gönderilemedi: " + (x && x.message ? x.message : "bağlantı hatası") + ". Lütfen tekrar deneyin.", "kotu");
    }).then(function () { b.disabled = false; });
  });
})();

// ===== Açılıştaki telefon: ÖNCE ↔ SONRA döngüsü (az hareket tercihinde SONRA'da sabit) =====
(function () {
  var t = document.querySelector(".tel[data-durum]"); if (!t) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { t.dataset.durum = "sonra"; return; }
  setInterval(function () { if (!document.hidden) t.dataset.durum = t.dataset.durum === "once" ? "sonra" : "once"; }, 3200);
})();

// ===== "İşletmenizin adını yazın": yazılan ad LED tabelada canlı yanar =====
(function () {
  var cv = document.getElementById("yaz-led"), inp = document.getElementById("yaz-ad"); if (!cv || !inp || !window.LED) return;
  var ctx = cv.getContext("2d"), SUT = 46, SAT = 11, EN_COK = 90, az = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var metin = "İŞLETMENİZİN ADI", kolonlar = [], bas = performance.now();
  function hazirla() {
    var t = (inp.value.trim() || "İşletmenizin adı").toLocaleUpperCase("tr-TR").slice(0, 30);
    if (t === metin && kolonlar.length) return; metin = t; kolonlar = window.LED.sutunlar(t); bas = performance.now();
    SUT = Math.max(46, Math.min(EN_COK, kolonlar.length + 6)); // kısa ad sabit, uzun ad kayar
  }
  function ciz(an) {
    var w = cv.clientWidth || 600, adim = w / SUT, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(adim * SAT * dpr); cv.style.height = Math.round(adim * SAT) + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#121418"; ctx.fillRect(0, 0, w, adim * SAT);
    var sigar = kolonlar.length <= SUT - 2, kay = sigar || az ? 0 : Math.floor((an - bas) / 90) % (kolonlar.length + SUT);
    for (var x = 0; x < SUT; x++) {
      var i = sigar || az ? x - Math.floor((SUT - kolonlar.length) / 2) : x - SUT + kay, col = kolonlar[i] || [];
      for (var y = 0; y < SAT; y++) {
        ctx.fillStyle = col[y - 1] ? "#FFB000" : "#23262C";
        ctx.beginPath(); ctx.arc(x * adim + adim / 2, y * adim + adim / 2, adim * .36, 0, 6.2832); ctx.fill();
      }
    }
  }
  function dongu(an) { if (!document.hidden) ciz(an); requestAnimationFrame(dongu); }
  inp.addEventListener("input", hazirla);
  document.getElementById("yaz-form").addEventListener("submit", function (e) { e.preventDefault(); hazirla(); inp.blur(); });
  hazirla(); requestAnimationFrame(dongu);
})();

// ===== Tanıtım filmi: telefonda dikey kapak =====
(function () {
  var v = document.getElementById("v-film"); if (!v) return;
  if (window.matchMedia && matchMedia("(max-width: 700px)").matches && v.dataset.posterDikey) v.poster = v.dataset.posterDikey;
})();
