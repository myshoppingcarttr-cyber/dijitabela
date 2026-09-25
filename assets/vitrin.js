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
