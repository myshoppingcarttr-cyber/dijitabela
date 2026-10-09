// Oto servis premium modülü: Arıza asistanı (fotoğraflı) + Bakım planlayıcı (.ics) + Online randevu + Canlı araç takibi
(function () {
  var E = window.ESNAF;
  var BELIRTI = [
    ["fren", "Frenden ses / titreme", "plan", "Balata aşınması, disk eğilmesi ya da kaliper sıkışması.", "1-2 saat", "Fren mesafesi uzadıysa ya da pedal boşa gidiyorsa aracı kullanmayın, bizi arayın."],
    ["motor", "Motor arıza lambası yandı", "bugun", "Sensör, ateşleme bobini, buji ya da emisyon arızası olabilir; bilgisayarlı arıza tespitiyle netleşir.", "30 dk teşhis", "Lamba yanıp sönüyorsa ya da araç çekişten düştüyse hızınızı düşürüp en kısa sürede gelin."],
    ["klima", "Klima soğutmuyor", "plan", "Gaz eksilmesi, kompresör ya da polen filtresi tıkanıklığı.", "45 dk-1 saat", "Kötü koku varsa klima temizliği ve polen filtresi değişimi de yapılır."],
    ["aku", "Araç geç çalışıyor / marş zayıf", "bugun", "Akü ömrü, şarj dinamosu ya da marş motoru.", "20-40 dk", "Akü testi birkaç dakika sürer; yolda kalmamak için ertelemeyin."],
    ["suspansiyon", "Çukurda tık tık ses / yalpalama", "plan", "Amortisör, rotil, salıncak burcu ya da rot başı.", "1-3 saat", "Lastiklerin bir tarafı daha çok aşınıyorsa rot-balans da kontrol edilir."],
    ["yag", "Bakım zamanı / yağ lambası", "bugun", "Periyodik bakım zamanı geldi ya da yağ seviyesi düşük.", "1 saat", "Kırmızı yağ lambası yanıyorsa motoru çalıştırmayın; çekici için arayın."]
  ];
  var SEV = { acil: ["acil", "Hemen gelin"], bugun: ["bugun", "Bugün-yarın bakılmalı"], plan: ["plan", "Randevuyla planlayın"] };
  function ariza(k) {
    var q = function (s) { return E.q(k, s); }, sec = BELIRTI[0];
    q(".a-sec").innerHTML = BELIRTI.map(function (b, i) { return '<button type="button" class="cip" data-i="' + i + '">' + b[1] + "</button>"; }).join("");
    function goster() {
      var s = SEV[sec[2]];
      q(".a-sonuc").innerHTML = '<span class="seviye ' + s[0] + '">' + s[1] + '</span><div class="buyuk" style="margin-top:8px;font-size:1.4rem">' + sec[1] + '</div><p style="margin-top:6px"><b>Olası neden:</b> ' + sec[3] + "</p><p><b>Tahmini servis süresi:</b> " + sec[4] + '</p><p class="not">' + sec[5] + "</p>";
      E.fotoDegis(q(".a-foto"), "../img/t_" + sec[0] + ".jpg", sec[1]); q(".a-alt").textContent = sec[1];
    }
    k.querySelectorAll(".a-sec .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".a-sec .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); sec = BELIRTI[+c.dataset.i]; goster(); }; });
    k.querySelector(".a-sec .cip").classList.add("on"); goster();
    q(".a-gonder").onclick = function () { waAc("Merhaba, sitenizdeki arıza asistanını kullandım.\nBelirti: " + sec[1] + "\nKm: " + (q(".a-km").value || "-") + "\nNe zaman gelebilirim?"); };
  }
  function bakim(k) {
    var q = function (s) { return E.q(k, s); }, sonraki = null, kalemler = [];
    function hesap() {
      var km = +q(".b-km").value || 0, son = +q(".b-son").value || 0, yil = Math.max(3000, +q(".b-yil").value || 15000), dizel = q(".b-yakit").value === "Dizel";
      var aralik = dizel ? 15000 : 10000, hedef = son + aralik, kalan = hedef - km, gun = Math.round(kalan / yil * 365);
      sonraki = new Date(); sonraki.setDate(sonraki.getDate() + Math.max(0, gun)); sonraki.setHours(10, 0);
      kalemler = ["Motor yağı + yağ filtresi", "Hava ve polen filtresi kontrolü", "Fren balata kontrolü"];
      if (Math.floor(hedef / 30000) > Math.floor(son / 30000)) kalemler.push("Hava filtresi değişimi (30.000 km)");
      if (Math.floor(hedef / 40000) > Math.floor(son / 40000) && !dizel) kalemler.push("Buji değişimi (40-60.000 km)");
      if (Math.floor(hedef / 60000) > Math.floor(son / 60000)) kalemler.push("Fren hidroliği ve antifriz kontrolü");
      if (Math.floor(hedef / 90000) > Math.floor(son / 90000)) kalemler.push("Triger seti kontrolü / değişimi (90-120.000 km, modele göre)");
      if (q(".b-yakit").value === "LPG") kalemler.push("LPG filtresi ve sistem kontrolü");
      q(".b-sonuc").innerHTML = (kalan <= 0 ? '<span class="seviye bugun">Bakımınız ' + Math.abs(kalan).toLocaleString("tr-TR") + " km geçti</span>" : '<span class="seviye plan">' + kalan.toLocaleString("tr-TR") + " km kaldı</span>") +
        '<div class="buyuk" style="margin-top:8px">' + (kalan <= 0 ? "Hemen planlayın" : "~" + E.tarih(sonraki)) + '</div><p class="not" style="margin-top:4px">Sonraki bakım: ' + hedef.toLocaleString("tr-TR") + " km</p><ul class=\"plan\" style=\"margin-top:10px\">" + kalemler.map(function (x) { return "<li><b>✓</b>" + x + "</li>"; }).join("") + "</ul><p class=\"not\">Aralıklar geneldir; aracınızın kullanım kılavuzuna göre kesinleştiririz.</p>";
    }
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hesap; }); hesap();
    q(".b-ics").onclick = function () { var t = new Date(Math.max(Date.now() + 864e5, sonraki - 7 * 864e5)); t.setHours(10, 0); E.ics("bakim-hatirlatma", [{ tarih: t, baslik: "Araç bakımı yaklaşıyor · " + (window.ISL.ad || ""), aciklama: kalemler.join(", ") }]); };
    q(".b-gonder").onclick = function () { waAc("Merhaba, bakım için fiyat almak istiyorum.\nKm: " + q(".b-km").value + " · Yakıt: " + q(".b-yakit").value + "\nYapılacaklar: " + kalemler.join(", ")); };
  }
  function takip(k) {
    var q = function (s) { return E.q(k, s); };
    var A = [["Araç kabul edildi", "09:12 · Kilometre ve hasar fotoğrafları kaydedildi"], ["Teşhis tamamlandı", "10:05 · Ön balata ve disk değişimi gerekli, onayınız alındı"], ["Parça geldi, işlem sürüyor", "11:40 · Tahmini bitiş 13:30"], ["Test sürüşü", "Fren testi ve son kontrol"], ["Aracınız hazır", "Fatura ve eski parçalar sizi bekliyor"]];
    q(".tk-bak").onclick = function () {
      var p = q(".tk-plaka").value.trim().toUpperCase();
      if (!p) return;
      var simdi = 2;
      q(".tk-liste").innerHTML = '<li style="border:0;padding-bottom:0"><b>' + p.replace(/</g, "") + "</b>&nbsp;· Ön fren bakımı</li>" + A.map(function (a, i) { return '<li class="' + (i < simdi ? "tamam" : i === simdi ? "simdi" : "bekler") + '"><i>' + (i < simdi ? "✓" : i + 1) + "</i><div><b>" + a[0] + '</b><div class="not" style="margin:2px 0 0">' + a[1] + "</div></div></li>"; }).join("");
    };
    q(".tk-bak").click();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".ariza").forEach(ariza); document.querySelectorAll(".bakim").forEach(bakim); document.querySelectorAll(".takip").forEach(takip);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Periyodik bakım", "Arıza tespiti (bilgisayarlı)", "Fren bakımı", "Klima bakımı", "Akü / elektrik", "Rot-balans ve süspansiyon"], [["Araç", ".rv-arac"]]); });
  });
})();
