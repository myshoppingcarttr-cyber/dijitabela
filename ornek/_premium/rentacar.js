// Araç kiralama premium modülü: Akıllı Rezervasyon (havalimanı + uçuş takibi) + Dijital Teslim Kontrolü (hasar tutanağı) + 4 dil
window.SOZLUK = {
  en: { m1: "Fleet", m2: "Book", m3: "Digital check-in", m4: "Contact", hb: "Get my price", rez: "Book in 30 seconds", rezp: "Airport meet & greet, flight tracking, all extras and the total price before you write to us.", tes: "Digital handover check", tesp: "Tap the car to mark existing scratches. A time-stamped report protects both sides, no deposit disputes.", ilet: "Find us", ac: "Open now", kap: "Closed now" },
  de: { m1: "Flotte", m2: "Buchen", m3: "Digitale Übergabe", m4: "Kontakt", hb: "Preis berechnen", rez: "In 30 Sekunden buchen", rezp: "Abholung am Flughafen, Flugverfolgung, alle Extras und Gesamtpreis vorab.", tes: "Digitale Übergabeprüfung", tesp: "Tippen Sie auf das Auto, um vorhandene Kratzer zu markieren. Ein Protokoll mit Zeitstempel schützt beide Seiten.", ilet: "So finden Sie uns", ac: "Jetzt geöffnet", kap: "Jetzt geschlossen" },
  ru: { m1: "Автопарк", m2: "Бронирование", m3: "Цифровая сдача", m4: "Контакты", hb: "Узнать цену", rez: "Бронирование за 30 секунд", rezp: "Встреча в аэропорту, отслеживание рейса, все опции и итоговая цена заранее.", tes: "Цифровой акт осмотра", tesp: "Нажмите на машину, чтобы отметить царапины. Акт со временем защищает обе стороны, без споров о депозите.", ilet: "Как нас найти", ac: "Сейчас открыто", kap: "Сейчас закрыто" }
};
(function () {
  var SINIF = [["eko", "Ekonomik (Clio, Egea)", 28], ["kom", "Kompakt otomatik (Corolla, Megane)", 38], ["suv", "SUV (Duster, Tucson)", 55], ["min", "Minivan 7–9 kişi (Vito)", 75], ["pre", "Premium (Passat, BMW 3)", 85]];
  var EKS = [["ksig", "Tam kasko (muafiyetsiz)", 9, "gun"], ["bebek", "Bebek/çocuk koltuğu", 4, "gun"], ["ek", "Ek sürücü", 3, "gun"], ["nav", "Navigasyon + internet", 4, "gun"], ["gec", "Gece teslim (00–07)", 15, "tek"]];
  var NOK = { ayt: "Antalya Havalimanı (AYT)", gzp: "Gazipaşa Havalimanı (GZP)", otel: "Otelime getirilsin", ofis: "Ofisten alacağım" };
  function rez(k) {
    var $ = function (s) { return k.querySelector(s); };
    $(".r-sinif").innerHTML = SINIF.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + " · günlük ~" + s[2] + " €</option>"; }).join("");
    $(".r-al").innerHTML = $(".r-ver").innerHTML = Object.keys(NOK).map(function (n) { return '<option value="' + n + '">' + NOK[n] + "</option>"; }).join("");
    $(".r-eks").innerHTML = EKS.map(function (e) { return '<label class="cip"><input type="checkbox" value="' + e[0] + '" style="width:auto"> ' + e[1] + " · " + e[2] + " €" + (e[3] === "gun" ? "/gün" : "") + "</label>"; }).join(" ");
    var b = new Date(); b.setDate(b.getDate() + 7); var s = new Date(b); s.setDate(s.getDate() + 7);
    $(".r-bas").value = b.toISOString().slice(0, 10); $(".r-bit").value = s.toISOString().slice(0, 10);
    k.querySelectorAll("input,select").forEach(function (e) { e.addEventListener("change", hesap); e.addEventListener("input", hesap); });
    function hesap() {
      var gun = Math.max(1, Math.round((new Date($(".r-bit").value) - new Date($(".r-bas").value)) / 864e5)), sn = SINIF.find(function (x) { return x[0] === $(".r-sinif").value; });
      var ind = gun >= 21 ? .25 : gun >= 14 ? .18 : gun >= 7 ? .1 : 0, top = sn[2] * gun * (1 - ind), sat = [];
      k.querySelectorAll(".r-eks input:checked").forEach(function (c) { var e = EKS.find(function (x) { return x[0] === c.value; }); var t = e[3] === "gun" ? e[2] * gun : e[2]; top += t; sat.push(e[1]); });
      var al = $(".r-al").value, ver = $(".r-ver").value; if (al !== ver) { top += 25; sat.push("farklı noktada iade"); }
      var ucus = $(".r-ucus").value.trim().toUpperCase();
      $(".sonuc").innerHTML = '<div class="not" style="margin:0">' + gun + " gün · " + sn[1] + (ind ? " · uzun kiralama indirimi %" + ind * 100 : "") + '</div><div class="buyuk">~' + Math.round(top) + ' €</div><div class="not">≈ ' + Math.round(top * 37.5).toLocaleString("tr-TR") + " ₺ · depozito araç sınıfına göre · ücretsiz iptal (48 saat öncesine kadar)</div>" +
        (ucus ? '<div style="margin-top:10px;font-weight:700">✈ ' + ucus + " uçuşunuz takip edilir; rötar olursa ücretsiz bekleriz.</div>" : "") + (sat.length ? '<div class="not">Ekstralar: ' + sat.join(", ") + "</div>" : "");
      k.dataset.ozet = "Merhaba, web sitenizden rezervasyon talebi:\nAraç: " + sn[1] + "\nAlış: " + NOK[al] + " · " + $(".r-bas").value + " " + $(".r-saat").value + "\nİade: " + NOK[ver] + " · " + $(".r-bit").value + (ucus ? "\nUçuş: " + ucus : "") + (sat.length ? "\nEkstralar: " + sat.join(", ") : "") + "\nTahmini: ~" + Math.round(top) + " € (" + gun + " gün)\nMüsaitlik onayınızı bekliyorum.";
    }
    $(".r-gonder").onclick = function () { waAc(k.dataset.ozet); };
    hesap();
  }
  // ---------- Dijital Teslim Kontrolü ----------
  var BOL = [["on-tampon", "Ön tampon", 120, 18, 60, 26], ["kaput", "Kaput", 120, 48, 60, 62], ["on-cam", "Ön cam", 122, 112, 56, 26], ["tavan", "Tavan", 120, 140, 60, 70], ["arka-cam", "Arka cam", 122, 212, 56, 22], ["bagaj", "Bagaj", 120, 236, 60, 40], ["arka-tampon", "Arka tampon", 120, 278, 60, 22],
    ["sol-on-camurluk", "Sol ön çamurluk", 82, 40, 34, 70], ["sol-on-kapi", "Sol ön kapı", 82, 112, 34, 64], ["sol-arka-kapi", "Sol arka kapı", 82, 178, 34, 56], ["sol-arka-camurluk", "Sol arka çamurluk", 82, 236, 34, 56],
    ["sag-on-camurluk", "Sağ ön çamurluk", 184, 40, 34, 70], ["sag-on-kapi", "Sağ ön kapı", 184, 112, 34, 64], ["sag-arka-kapi", "Sağ arka kapı", 184, 178, 34, 56], ["sag-arka-camurluk", "Sağ arka çamurluk", 184, 236, 34, 56],
    ["jant-sol-on", "Sol ön jant", 60, 62, 20, 36], ["jant-sag-on", "Sağ ön jant", 220, 62, 20, 36], ["jant-sol-arka", "Sol arka jant", 60, 226, 20, 36], ["jant-sag-arka", "Sağ arka jant", 220, 226, 20, 36]];
  function teslim(k) {
    var svg = k.querySelector("svg"), lis = k.querySelector(".t-liste"), isaret = {};
    svg.innerHTML = '<rect x="78" y="14" width="144" height="292" rx="46" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>' + BOL.map(function (b) { return '<rect data-b="' + b[0] + '" x="' + b[2] + '" y="' + b[3] + '" width="' + b[4] + '" height="' + b[5] + '" rx="8" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".25" style="cursor:pointer"><title>' + b[1] + "</title></rect>"; }).join("");
    svg.querySelectorAll("rect[data-b]").forEach(function (r) {
      r.onclick = function () {
        var b = BOL.find(function (x) { return x[0] === r.dataset.b; }), tur = ["çizik", "göçük", "taş izi", "kırık"], s = isaret[b[0]], i = s ? tur.indexOf(s.tur) + 1 : 0;
        if (i >= tur.length) { delete isaret[b[0]]; r.setAttribute("fill", "currentColor"); r.setAttribute("fill-opacity", ".08"); }
        else { isaret[b[0]] = { ad: b[1], tur: tur[i], saat: new Date().toLocaleString("tr-TR") }; r.setAttribute("fill", ["#f08c00", "#e03131", "#ae3ec9", "#1971c2"][i]); r.setAttribute("fill-opacity", ".7"); }
        yaz();
      };
    });
    function yaz() { var v = Object.values(isaret); lis.innerHTML = v.length ? v.map(function (x) { return "<li><b>" + x.tur + "</b><span>" + x.ad + ' <span class="not">· ' + x.saat + "</span></span></li>"; }).join("") : '<li><span class="not">Araçta işaretli hasar yok. Parçaya dokundukça: çizik → göçük → taş izi → kırık → temiz.</span></li>'; }
    k.querySelector(".t-tutanak").onclick = function () {
      var v = Object.values(isaret), plaka = k.querySelector(".t-plaka").value || "—", km = k.querySelector(".t-km").value || "—", yak = k.querySelector(".t-yakit").value;
      var m = "TESLİM TUTANAĞI · " + (window.ISL && ISL.ad || "") + "\nPlaka: " + plaka + " · Km: " + km + " · Yakıt: " + yak + "\nTarih: " + new Date().toLocaleString("tr-TR") + "\n" + (v.length ? v.map(function (x) { return "• " + x.ad + ": " + x.tur; }).join("\n") : "• Hasar yok") + "\nİki taraf da bu kaydı aldı.";
      waAc(m);
    };
    yaz();
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".rez").forEach(rez); document.querySelectorAll(".teslim").forEach(teslim); });
})();
