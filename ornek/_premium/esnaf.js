// Esnaf premium modülleri ortak yardımcılar (9 Eki 2026): online randevu (gün → boş saat), takvime ekle (.ics), sayaçlar
(function () {
  var I = window.ISL || {};
  var E = window.ESNAF = {};
  E.q = function (k, s) { return k.querySelector(s); };
  E.tarih = function (d) { return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); };
  E.gunTarih = function (d) { return d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }); };
  // Takvime ekle: tek ya da çok etkinlikli .ics indirir
  E.ics = function (dosya, olaylar) {
    var p = function (n) { return String(n).padStart(2, "0"); };
    var t = function (d) { return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "T" + p(d.getHours()) + p(d.getMinutes()) + "00"; };
    var s = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dijitabela//Prototip//TR"];
    olaylar.forEach(function (o, i) {
      var b = o.tarih, bit = new Date(b.getTime() + (o.dk || 30) * 60000);
      s.push("BEGIN:VEVENT", "UID:" + Date.now() + "-" + i + "@dijitabela", "DTSTAMP:" + t(new Date()), "DTSTART:" + t(b), "DTEND:" + t(bit), "SUMMARY:" + o.baslik.replace(/\n/g, " "), "DESCRIPTION:" + (o.aciklama || "").replace(/\n/g, "\\n"), "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Hatırlatma", "END:VALARM", "END:VEVENT");
    });
    s.push("END:VCALENDAR");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s.join("\r\n")], { type: "text/calendar" })); a.download = dosya + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  };
  // Pazar açık mı? (saat metninde "Paz" geçip kapalı yazmıyorsa açık)
  var pazarAcik = /Paz(?!.*kapalı)[^·]*\d\d:\d\d/.test(I.saat || "") && !/Paz[^·]*kapalı/i.test(I.saat || "");
  // Online randevu: .rv-hiz (select), .rv-gun (gün çipleri), .rv-saat, .rv-not, .rv-gonder, .rv-ics
  E.randevu = function (k, hizmetler, ek) {
    var q = function (s) { return E.q(k, s); }, sec = { gun: null, saat: null };
    if (q(".rv-hiz")) q(".rv-hiz").innerHTML = hizmetler.map(function (h) { return "<option>" + h + "</option>"; }).join("");
    var gunler = [], g = new Date(); g.setHours(0, 0, 0, 0);
    for (var i = 0; gunler.length < 6 && i < 10; i++) { var d = new Date(g); d.setDate(g.getDate() + i); if (d.getDay() === 0 && !pazarAcik) continue; gunler.push(d); }
    q(".rv-gun").innerHTML = gunler.map(function (d, i) { return '<button type="button" class="cip" data-i="' + i + '">' + (i === 0 && d.getDate() === new Date().getDate() ? "Bugün" : d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" })) + "</button>"; }).join("");
    function saatler() {
      var d = sec.gun, simdi = new Date(), liste = [];
      for (var s = 9 * 60; s <= 18 * 60; s += 30) liste.push(s);
      q(".rv-saat").innerHTML = liste.map(function (s, i) {
        var t = new Date(d); t.setHours(Math.floor(s / 60), s % 60);
        var dolu = t < simdi || (i * 5 + d.getDate() * 3) % 7 === 0 || (i * 11 + d.getDate()) % 9 === 0;
        var e = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
        return '<button type="button" class="cip' + (dolu ? " dolu" : "") + '"' + (dolu ? " disabled" : "") + ' data-s="' + e + '">' + e + "</button>";
      }).join("");
      k.querySelectorAll(".rv-saat .cip:not(.dolu)").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".rv-saat .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); sec.saat = c.dataset.s; ozet(); }; });
      sec.saat = null; ozet();
    }
    function ozet() {
      var o = q(".rv-ozet"); if (!o) return;
      o.innerHTML = sec.saat ? "<b>" + E.gunTarih(sec.gun) + " · " + sec.saat + "</b><br>" + (q(".rv-hiz") ? q(".rv-hiz").value : "") : '<span class="not" style="margin:0">Boş bir saat seçin. Üstü çizili saatler dolu.</span>';
    }
    k.querySelectorAll(".rv-gun .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".rv-gun .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); sec.gun = gunler[+c.dataset.i]; saatler(); }; });
    k.querySelector(".rv-gun .cip").click();
    q(".rv-gonder").onclick = function () {
      if (!sec.saat) { q(".rv-ozet").innerHTML = '<b style="color:#e03131">Önce bir saat seçin.</b>'; return; }
      var ekler = (ek || []).map(function (e) { var el = q(e[1]); return el && el.value ? "\n" + e[0] + ": " + el.value : ""; }).join("");
      waAc("Merhaba, sitenizden randevu talebi:\n" + (q(".rv-hiz") ? q(".rv-hiz").value + "\n" : "") + E.gunTarih(sec.gun) + " · " + sec.saat + ekler);
    };
    if (q(".rv-ics")) q(".rv-ics").onclick = function () {
      if (!sec.saat) { q(".rv-ozet").innerHTML = '<b style="color:#e03131">Önce bir saat seçin.</b>'; return; }
      var t = new Date(sec.gun); t.setHours(+sec.saat.slice(0, 2), +sec.saat.slice(3));
      E.ics("randevu", [{ tarih: t, dk: 45, baslik: (I.ad || "Randevu") + " · " + (q(".rv-hiz") ? q(".rv-hiz").value : ""), aciklama: "Adres ve yol tarifi için siteyi açın." }]);
    };
  };
  // Sayaç: .sayac[data-k] içinde - span +
  E.sayaclar = function (k, degisti) {
    k.querySelectorAll(".sayac").forEach(function (s) {
      var sp = s.querySelector("span"), bt = s.querySelectorAll("button");
      bt[0].onclick = function () { sp.textContent = Math.max(0, +sp.textContent - 1); degisti(); };
      bt[1].onclick = function () { sp.textContent = +sp.textContent + 1; degisti(); };
    });
  };
  E.fotoDegis = function (img, src, alt) { if (!img || img.getAttribute("src") === src) return; img.style.opacity = 0; setTimeout(function () { img.src = src; img.alt = alt || ""; img.style.opacity = 1; }, 180); };
})();
