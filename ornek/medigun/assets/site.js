/* Medigün tek link sayfası: slayt galerisi (kaydırma, dokunma, klavye okları) + dikey video bağlantısı */
(function () {
  "use strict";
  var basliklar = ["Kapak", "Bugün nerede duruyoruz?", "Telefonda hız ve Google görünürlüğü", "Kim ne yapabilir?", "Dikkat gerektiren teknik eksikler",
    "Hastaya etkisi", "Teknik altyapı ve sistem", "Şube seçici ve hekim bulucu", "7/24 randevu asistanı", "Sonuç bildirimi ve check-up sayfası",
    "Yorum yönetim paneli ve sağlık turizmi", "Telefonunuzdan şimdi deneyin", "Yol haritası", "Birlikte çalıştıklarımız", "Yatırım ve iletişim"];
  var serit = document.getElementById("serit"), sayac = document.getElementById("sayac");
  if (serit) {
    serit.innerHTML = basliklar.map(function (b, i) {
      var n = ("0" + (i + 1)).slice(-2);
      return '<figure><img src="sunum/slayt-' + n + '.jpg" alt="Slayt ' + (i + 1) + ': ' + b + '" width="1600" height="900"' + (i > 1 ? ' loading="lazy"' : "") + '><figcaption>' + (i + 1) + " / 15 · " + b + "</figcaption></figure>";
    }).join("");
    var simdiki = function () {
      var g = serit.clientWidth, x = serit.scrollLeft, figs = serit.children, en = 0, fark = 1e9;
      for (var i = 0; i < figs.length; i++) { var d = Math.abs(figs[i].offsetLeft - serit.offsetLeft - x - (g - figs[i].clientWidth) / 2); if (d < fark) { fark = d; en = i; } }
      return en;
    };
    var git = function (i) {
      i = Math.max(0, Math.min(basliklar.length - 1, i));
      var f = serit.children[i];
      serit.scrollTo({ left: f.offsetLeft - serit.offsetLeft - (serit.clientWidth - f.clientWidth) / 2 });
      sayac.textContent = (i + 1) + " / " + basliklar.length;
    };
    document.getElementById("onceki").addEventListener("click", function () { git(simdiki() - 1); });
    document.getElementById("sonraki").addEventListener("click", function () { git(simdiki() + 1); });
    serit.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); git(simdiki() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); git(simdiki() - 1); }
    });
    var z; serit.addEventListener("scroll", function () { clearTimeout(z); z = setTimeout(function () { sayac.textContent = (simdiki() + 1) + " / " + basliklar.length; }, 80); });
  }
  /* Video: hangi kaynak yüklendiyse (gerçek ses ya da taslak) dikey sürüm bağlantısı ona uysun */
  var v = document.getElementById("video-oynatici"), dikey = document.getElementById("dikey-indir");
  if (v && dikey) v.addEventListener("loadedmetadata", function () {
    var src = v.currentSrc || ""; var i = src.lastIndexOf("/video/");
    if (i > -1) dikey.setAttribute("href", "video/" + src.slice(i + 7).replace("16x9", "9x16"));
  });
})();
