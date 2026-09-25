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

// ===== "İşletmenizin adını yazın": yazılan ad LED tabelada canlı yanar (uzun ad iki satıra bölünür) =====
(function () {
  var cv = document.getElementById("yaz-led"), inp = document.getElementById("yaz-ad"); if (!cv || !inp || !window.LED) return;
  var ctx = cv.getContext("2d"), az = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var metin = "", satirlar = [], SUT = 46, bas = performance.now();
  function bol(t) { // en dengeli boşluktan ikiye böl
    var k = t.split(" "); if (k.length < 2) return [t];
    var en = null; for (var n = 1; n < k.length; n++) { var a = k.slice(0, n).join(" "), b = k.slice(n).join(" "), f = Math.max(a.length, b.length); if (!en || f < en[2]) en = [a, b, f]; }
    return [en[0], en[1]];
  }
  function hazirla() {
    var t = (inp.value.trim() || "İşletmenizin adı").toLocaleUpperCase("tr-TR").slice(0, 32);
    if (t === metin && satirlar.length) return; metin = t; bas = performance.now();
    var tek = window.LED.sutunlar(t);
    satirlar = tek.length <= 58 ? [tek] : bol(t).map(function (x) { return window.LED.sutunlar(x); });
    var en = Math.max.apply(null, satirlar.map(function (x) { return x.length; }));
    SUT = Math.max(46, Math.min(64, en + 6));
  }
  function ciz(an) {
    var SAT = satirlar.length * 10 + 1, w = cv.clientWidth || 600, adim = w / SUT, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(adim * SAT * dpr); cv.style.height = Math.round(adim * SAT) + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#121418"; ctx.fillRect(0, 0, w, adim * SAT);
    for (var x = 0; x < SUT; x++) for (var y = 0; y < SAT; y++) {
      var s = Math.floor((y - 1) / 10), sy = (y - 1) % 10, kol = satirlar[s] || [], yan = false;
      if (y >= 1 && sy < 9) {
        var sigar = kol.length <= SUT - 2, kay = sigar || az ? 0 : Math.floor((an - bas) / 90) % (kol.length + SUT);
        var i = sigar || az ? x - Math.floor((SUT - kol.length) / 2) : x - SUT + kay;
        yan = !!(kol[i] && kol[i][sy]);
      }
      ctx.fillStyle = yan ? "#FFB000" : "#23262C";
      ctx.beginPath(); ctx.arc(x * adim + adim / 2, y * adim + adim / 2, adim * .36, 0, 6.2832); ctx.fill();
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
