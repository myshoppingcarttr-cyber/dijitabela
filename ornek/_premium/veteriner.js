// Veteriner premium modülü: Aşı takvimi (tür fotoğraflı, .ics) + Belirti rehberi (aciliyet) + Online randevu
(function () {
  var E = window.ESNAF;
  // [gün (doğumdan), işlem]; "y" = yıllık tekrar
  var TUR = {
    kopek: ["Köpek", [[28, "İç parazit uygulaması (ilk)"], [42, "Karma aşı 1. doz + iç/dış parazit"], [63, "Karma aşı 2. doz"], [84, "Karma aşı 3. doz"], [98, "Kuduz aşısı"], [112, "Bronşit (kennel cough) aşısı"]], [["Karma aşı tekrarı", 365], ["Kuduz aşısı tekrarı", 365], ["İç/dış parazit", 90]]],
    kedi: ["Kedi", [[42, "İç parazit uygulaması (ilk)"], [56, "Karma aşı 1. doz"], [84, "Karma aşı 2. doz"], [98, "Lösemi (FeLV) aşısı (hekim önerirse)"], [112, "Kuduz aşısı"]], [["Karma aşı tekrarı", 365], ["Kuduz aşısı tekrarı", 365], ["İç/dış parazit", 90]]],
    kus: ["Kuş", [[60, "İlk genel muayene ve dışkı (parazit) kontrolü"], [180, "Gaga, tırnak ve tüy kontrolü"]], [["Genel muayene", 365], ["Parazit kontrolü", 120]]],
    tavsan: ["Tavşan", [[56, "İlk genel muayene ve iç parazit"], [70, "Viral hemorajik hastalık (RHD) aşısı"], [180, "Diş kontrolü"]], [["RHD aşısı tekrarı", 365], ["Diş kontrolü", 180]]]
  };
  var kayitlar = [];
  function asi(k) {
    var q = function (s) { return E.q(k, s); }, tur = "kopek";
    q(".as-tur").innerHTML = Object.keys(TUR).map(function (t) { return '<button type="button" data-t="' + t + '"><img src="../img/t_' + t + '.jpg" alt="' + TUR[t][0] + '" loading="lazy"><span>' + TUR[t][0] + "</span></button>"; }).join("");
    var d0 = new Date(); d0.setDate(d0.getDate() - 35); q(".as-dogum").value = d0.toISOString().slice(0, 10);
    function hesap() {
      var dog = new Date(q(".as-dogum").value + "T10:00"), bugun = new Date(), T = TUR[tur], liste = [];
      if (isNaN(dog)) return;
      T[1].forEach(function (a) { var d = new Date(dog); d.setDate(d.getDate() + a[0]); liste.push([d, a[1]]); });
      var son = liste.length ? liste[liste.length - 1][0] : dog;
      T[2].forEach(function (r) { var d = new Date(Math.max(son, bugun)); d.setDate(d.getDate() + (r[1] === 365 ? 0 : r[1])); if (r[1] === 365) { d = new Date(son); while (d <= bugun || d <= son) d.setDate(d.getDate() + 365); } liste.push([d, r[0]]); });
      liste.sort(function (a, b) { return a[0] - b[0]; });
      var ad = q(".as-ad").value.trim();
      kayitlar = liste.filter(function (x) { return x[0] >= bugun; });
      q(".as-liste").innerHTML = (ad ? '<li style="border:0"><b style="min-width:0">' + ad.replace(/</g, "") + "</b>&nbsp;için program</li>" : "") + liste.map(function (x) { var gecti = x[0] < bugun; return '<li style="' + (gecti ? "opacity:.5" : "") + '"><b>' + x[0].toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "2-digit" }) + "</b>" + x[1] + (gecti ? " · yapıldıysa ✓" : "") + "</li>"; }).join("");
    }
    k.querySelectorAll(".as-tur button").forEach(function (b) { b.onclick = function () { k.querySelectorAll(".as-tur button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); tur = b.dataset.t; hesap(); }; });
    k.querySelector(".as-tur button").classList.add("on");
    q(".as-dogum").onchange = q(".as-ad").oninput = hesap; hesap();
    q(".as-ics").onclick = function () { var ad = q(".as-ad").value.trim() || TUR[tur][0]; E.ics("asi-takvimi", kayitlar.slice(0, 10).map(function (x) { return { tarih: x[0], baslik: ad + ": " + x[1], aciklama: (window.ISL.ad || "") + " · " + (window.ISL.tel || "") }; })); };
    q(".as-gonder").onclick = function () { waAc("Merhaba, aşı randevusu almak istiyorum.\n" + TUR[tur][0] + (q(".as-ad").value ? " · " + q(".as-ad").value : "") + " · doğum: " + q(".as-dogum").value + "\nSıradaki: " + (kayitlar[0] ? kayitlar[0][1] : "-")); };
  }
  // [ad, ağırlık] 3 = hemen
  var BELIRTI = [["Nefes almakta zorlanıyor", 3], ["Zehirli bir şey yemiş olabilir", 3], ["Nöbet / bayılma", 3], ["Durmayan kanama", 3], ["Kedi idrar yapamıyor", 3], ["Karnı şiş ve sert", 3], ["Kusma", 1], ["İshal", 1], ["Yemek yemiyor", 1], ["Halsiz, saklanıyor", 1], ["Topallıyor", 1], ["Gözde akıntı / kızarıklık", 1], ["Kaşıntı, tüy dökülmesi", 0], ["Ağız kokusu", 0]];
  function belirti(k) {
    var q = function (s) { return E.q(k, s); }, secili = {};
    q(".bl-sec").innerHTML = BELIRTI.map(function (b, i) { return '<button type="button" class="cip" data-i="' + i + '">' + b[0] + "</button>"; }).join("");
    function sonuc() {
      var s = Object.keys(secili).map(function (i) { return BELIRTI[i]; }), sure = +q(".bl-sure").value;
      if (!s.length) { q(".bl-sonuc").innerHTML = '<span class="not" style="margin:0">Bir ya da birkaç belirti seçin.</span>'; return; }
      var acil = s.some(function (b) { return b[1] === 3; }), orta = s.filter(function (b) { return b[1] === 1; }).length;
      var sev = acil ? ["acil", "Hemen arayın", "Bu belirtiler beklememeli. Yola çıkmadan önce kliniği arayın; geldiğinizde sizi hazırlıklı karşılayalım."] : (orta >= 2 || (orta && sure >= 1)) ? ["bugun", "Bugün muayene olmalı", "Birden fazla belirti ya da bir günden uzun süren şikâyet var. Bugün muayeneye getirmenizi öneririz."] : orta ? ["plan", "Yakından izleyin", "Su içtiğinden emin olun. Şikâyet artar ya da 24 saati geçerse muayeneye getirin."] : ["plan", "Randevuyla bakalım", "Acil değil; uygun bir gün randevu alın."];
      q(".bl-sonuc").innerHTML = '<span class="seviye ' + sev[0] + '">' + sev[1] + '</span><p style="margin-top:10px">' + sev[2] + '</p><p class="not">Bu rehber teşhis koymaz; şüphede kalırsanız arayın.</p>';
      q(".bl-ara").style.order = acil ? -1 : 0;
    }
    k.querySelectorAll(".bl-sec .cip").forEach(function (c) { c.onclick = function () { var i = c.dataset.i; if (secili[i]) delete secili[i]; else secili[i] = 1; c.classList.toggle("on", !!secili[i]); sonuc(); }; });
    q(".bl-sure").onchange = sonuc; sonuc();
    q(".bl-gonder").onclick = function () { waAc("Merhaba, dostumda şu belirtiler var: " + Object.keys(secili).map(function (i) { return BELIRTI[i][0]; }).join(", ") + " (" + q(".bl-sure").selectedOptions[0].text + "). Ne yapmalıyım?"); };
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".asi").forEach(asi); document.querySelectorAll(".belirti").forEach(belirti);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Genel muayene", "Aşı", "Kısırlaştırma ön görüşmesi", "Tıraş / bakım", "Diş temizliği", "Kontrol"], [["Dostum", ".rv-hayvan"]]); });
  });
})();
