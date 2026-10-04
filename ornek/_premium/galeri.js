// Oto ekspertiz premium modülü: Paket Karşılaştırma + Online Randevu (saat dilimi) + Değer Kaybı Hesaplayıcı
window.SOZLUK = {
  en: { m1: "Packages", m2: "Appointment", m3: "Value loss", m4: "Contact", hb: "Book an inspection", pak: "Compare inspection packages", randevu: "Book online, skip the queue", deger: "Diminished value calculator", ilet: "Find us", ac: "Open now", kap: "Closed now" }
};
(function () {
  var PAK = [["Mini", "Motor + şanzıman + yürüyen + OBD arıza tarama", 1800], ["Standart", "Mini + kaporta boya ölçümü + fren/süspansiyon testi", 2600], ["Full", "Standart + dyno performans + yol testi + detaylı fotoğraflı rapor", 3600]];
  function randevu(k) {
    var $ = function (s) { return k.querySelector(s); };
    $(".y-pak").innerHTML = PAK.map(function (p) { return "<option>" + p[0] + " · ~" + p[2].toLocaleString("tr-TR") + " ₺</option>"; }).join("");
    var g = new Date(); g.setDate(g.getDate() + 1); $(".y-gun").value = g.toISOString().slice(0, 10);
    function saatler() {
      var gun = new Date($(".y-gun").value).getDay(), s = gun === 0 ? [] : ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
      var dolu = s.filter(function (_, i) { return (i * 7 + new Date($(".y-gun").value).getDate()) % 4 === 0; });
      $(".y-saat").innerHTML = s.length ? s.map(function (x) { var d = dolu.indexOf(x) >= 0; return '<span class="cip' + (d ? '" style="opacity:.35;text-decoration:line-through' : "") + '" data-s="' + (d ? "" : x) + '">' + x + "</span>"; }).join(" ") : '<span class="not">Pazar kapalıyız.</span>';
      $(".y-saat").querySelectorAll(".cip[data-s]").forEach(function (c) { if (!c.dataset.s) return; c.onclick = function () { $(".y-saat").querySelectorAll(".cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); k.dataset.saat = c.dataset.s; }; });
    }
    $(".y-gun").onchange = saatler; saatler();
    $(".y-gonder").onclick = function () { waAc("Merhaba, sitenizden ekspertiz randevusu:\nPaket: " + $(".y-pak").value + "\nTarih: " + $(".y-gun").value + " " + (k.dataset.saat || "(saat seçilmedi)") + "\nAraç: " + ($(".y-arac").value || "-")); };
  }
  function deger(k) {
    var $ = function (s) { return k.querySelector(s); };
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hesap; });
    function hesap() {
      var d = +$(".d-deger").value || 0, h = +$(".d-hasar").value || 0, km = +$(".d-km").value || 0;
      var hk = h / d > .3 ? 1.6 : h / d > .15 ? 1.2 : h / d > .05 ? .9 : .6, kk = km > 150000 ? .6 : km > 100000 ? .75 : km > 50000 ? .9 : 1;
      var kayip = Math.min(d * .25, d * .1 * hk * kk + h * .15);
      $(".sonuc").innerHTML = '<div class="not" style="margin:0">Tahmini değer kaybı</div><div class="buyuk">' + Math.round(kayip).toLocaleString("tr-TR") + ' ₺</div><p class="not">Örnek hesaplamadır; sigorta başvurusu için resmi ekspertiz raporumuz gerekir. Rapor 24 saatte hazır.</p>';
    }
    hesap();
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".randevu").forEach(randevu); document.querySelectorAll(".deger").forEach(deger); });
})();
