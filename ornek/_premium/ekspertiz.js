// Oto ekspertiz firması premium modülü (FİYATSIZ) · YAMA-GALERI-MAGAZA v2 14 Eki 2026
// Hizmet seçimi (window.EKH: işletmenin kendi hizmet listesi) + randevu TALEBİ (teyidi işletme verir) + satıcıya sorular listesi.
// Fiyat tutarı, paket fiyatı, süre vaadi YOK. Eski galeri.js (paket fiyatlı) değişmedi; bu dosya ayrı.
(function () {
  var secili = [];
  function kapsam(k) {
    k.querySelectorAll("button.hz").forEach(function (b) {
      b.onclick = function () {
        var ad = (window.EKH || [])[+b.dataset.i], i = secili.indexOf(ad);
        if (i >= 0) secili.splice(i, 1); else secili.push(ad);
        b.classList.toggle("on", i < 0); b.querySelector("i").textContent = i < 0 ? "Seçildi ✓" : "Seç";
      };
    });
    var g = k.querySelector(".k-gonder");
    if (g) g.onclick = function () { waAc("Merhaba, sitenizden yazıyorum. " + (secili.length ? "Şu hizmetler için kapsam ve fiyat bilgisi alabilir miyim?\n- " + secili.join("\n- ") : "Ekspertiz hizmetleriniz için kapsam ve fiyat bilgisi alabilir miyim?")); };
  }
  function randevu(k) {
    var $ = function (s) { return k.querySelector(s); }, dilim = "";
    $(".y-hiz").innerHTML = '<option value="">Henüz karar vermedim</option>' + (window.EKH || []).map(function (x) { return "<option>" + String(x).replace(/[&<>"]/g, "") + "</option>"; }).join("");
    var g = new Date(); g.setDate(g.getDate() + 1); $(".y-gun").value = g.toISOString().slice(0, 10); $(".y-gun").min = new Date().toISOString().slice(0, 10);
    $(".y-dilim").querySelectorAll(".cip").forEach(function (c) { c.onclick = function () { dilim = c.textContent; $(".y-dilim").querySelectorAll(".cip").forEach(function (x) { x.classList.toggle("on", x === c); }); }; });
    $(".y-gonder").onclick = function () { waAc("Merhaba, sitenizden ekspertiz randevu talebi:\nHizmet: " + ($(".y-hiz").value || "henüz karar vermedim") + "\nAraç: " + ($(".y-arac").value || "-") + "\nTercih ettiğim gün: " + ($(".y-gun").value || "-") + "\nZaman dilimi: " + (dilim || "-") + "\nUygun saati teyit eder misiniz?"); };
  }
  function sorular(k) {
    var b = k.querySelector(".s-kopya"), d = k.querySelector(".s-durum");
    b.onclick = function () {
      var t = "Satıcıya sorulacaklar:\n" + Array.prototype.map.call(k.querySelectorAll(".sliste li"), function (li) { return (li.querySelector("input").checked ? "[x] " : "[ ] ") + li.textContent.trim(); }).join("\n");
      var bitti = function () { d.textContent = "Kopyalandı"; }, olmadi = function () { var x = document.createElement("textarea"); x.value = t; x.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(x); x.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} x.remove(); d.textContent = ok ? "Kopyalandı" : "Kopyalanamadı; listeyi elle seçin."; };
      try { navigator.clipboard.writeText(t).then(bitti, olmadi); } catch (e) { olmadi(); }
    };
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".kapsam").forEach(kapsam); document.querySelectorAll(".eranv").forEach(randevu); document.querySelectorAll(".sorular").forEach(sorular); });
})();
