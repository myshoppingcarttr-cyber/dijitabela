// Uluslararası emlak premium modülü: Vatandaşlık Uygunluk + Kira Getirisi hesaplayıcı + 4 dil
window.SOZLUK = {
  en: { m1: "Portfolio", m2: "Citizenship check", m3: "Rental yield", m4: "Contact", hb: "Check my eligibility", vat: "Turkish citizenship by investment", vatp: "Enter the property value: we show the 400,000 USD threshold, the gap and the timeline instantly.", kir: "Rental yield calculator", kirp: "Monthly rent, fees and occupancy: gross and net yield, payback period.", ilet: "Visit our office", ac: "Open now", kap: "Closed now" },
  de: { m1: "Portfolio", m2: "Staatsbürgerschaft", m3: "Mietrendite", m4: "Kontakt", hb: "Berechtigung prüfen", vat: "Türkische Staatsbürgerschaft durch Investition", vatp: "Immobilienwert eingeben: 400.000-USD-Grenze, Differenz und Zeitplan sofort.", kir: "Mietrendite-Rechner", kirp: "Miete, Nebenkosten und Auslastung: Brutto-/Nettorendite und Amortisation.", ilet: "Unser Büro", ac: "Jetzt geöffnet", kap: "Jetzt geschlossen" },
  ru: { m1: "Объекты", m2: "Гражданство", m3: "Доходность", m4: "Контакты", hb: "Проверить", vat: "Гражданство Турции за инвестиции", vatp: "Введите стоимость: порог 400 000 USD, разница и сроки сразу.", kir: "Калькулятор доходности", kirp: "Аренда, расходы и загрузка: валовая и чистая доходность, окупаемость.", ilet: "Наш офис", ac: "Сейчас открыто", kap: "Сейчас закрыто" }
};
(function () {
  var KUR = { USD: 1, EUR: 1.08, GBP: 1.27, TRY: 1 / 34.8, RUB: 1 / 92 };
  function vat(k) {
    var $ = function (s) { return k.querySelector(s); };
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hesap; });
    function hesap() {
      var usd = (+$(".v-fiyat").value || 0) * KUR[$(".v-para").value], esik = 400000, ok = usd >= esik, oran = Math.min(100, usd / esik * 100);
      $(".sonuc").innerHTML = '<div class="buyuk">' + (ok ? "✅ Uygun" : "⏳ " + Math.round(esik - usd).toLocaleString("tr-TR") + " $ eksik") + '</div><div style="height:10px;border-radius:9px;background:var(--cizgi);margin:12px 0;overflow:hidden"><i style="display:block;height:100%;width:' + oran + '%;background:var(--vurgu)"></i></div>' +
        '<div class="not" style="margin:0">Yatırım ≈ ' + Math.round(usd).toLocaleString("tr-TR") + " $ · eşik 400.000 $ · 3 yıl satmama şerhi</div>" +
        '<ul class="plan" style="margin-top:12px"><li><b>1. hf</b><span>Tapu kontrolü, SPK değerleme raporu</span></li><li><b>2–3. hf</b><span>Tapu devri + uygunluk belgesi</span></li><li><b>4–6. ay</b><span>İkamet ve vatandaşlık başvurusu (aile dahil)</span></li></ul><p class="not">Bilgilendirme amaçlıdır; güncel mevzuat ve kur için uzman danışmanımız yazılı teyit verir.</p>';
      k.dataset.ozet = "Merhaba, sitenizdeki vatandaşlık hesaplayıcısından yazıyorum. Bütçem ≈ " + Math.round(usd).toLocaleString("tr-TR") + " $. Uygun portföyleri görmek istiyorum.";
    }
    $(".v-gonder").onclick = function () { waAc(k.dataset.ozet); };
    hesap();
  }
  function kira(k) {
    var $ = function (s) { return k.querySelector(s); };
    k.querySelectorAll("input").forEach(function (e) { e.oninput = hesap; });
    function hesap() {
      var f = +$(".k-fiyat").value || 1, ki = +$(".k-kira").value || 0, ai = +$(".k-aidat").value || 0, dol = (+$(".k-dol").value || 0) / 100;
      var brut = ki * 12 * dol, net = brut - ai * 12, by = brut / f * 100, ny = net / f * 100, geri = net > 0 ? f / net : 0;
      $(".sonuc").innerHTML = '<div class="izgara i3"><div><div class="not" style="margin:0">Brüt getiri</div><div class="buyuk">%' + by.toFixed(1) + '</div></div><div><div class="not" style="margin:0">Net getiri</div><div class="buyuk">%' + ny.toFixed(1) + '</div></div><div><div class="not" style="margin:0">Geri dönüş</div><div class="buyuk">' + (geri ? geri.toFixed(1) + " yıl" : "—") + "</div></div></div>";
    }
    hesap();
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".vat").forEach(vat); document.querySelectorAll(".kira").forEach(kira); });
})();
