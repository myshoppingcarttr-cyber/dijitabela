// Berber premium modülü: Yüz şekline göre model (fotoğraflı) + Online randevu (.ics) + Dijital sadakat kartı
(function () {
  var E = window.ESNAF;
  var YUZ = { oval: ["Oval", "Dengeli oran; çoğu model yakışır."], yuvarlak: ["Yuvarlak", "Üstte yükseklik, yanlar kısa: yüz daha uzun görünür."], kare: ["Kare", "Güçlü çene hattı; kısa ve net kesimler öne çıkarır."], uzun: ["Uzun", "Kakül ve yan hacim yüzü dengeler."] };
  var ONERI = { oval: [["Textured crop", "Üstte doku, yanlar kısa.", "textured-crop"], ["Pompadour", "Hacimli üst, temiz yanlar.", "pompadour"], ["Klasik yan ayrım", "İş ve günlük için zamansız.", "yan-ayrim"]], yuvarlak: [["High fade + quiff", "Yüzü daha uzun gösterir.", "quiff"], ["Faux hawk", "Ortada yükseklik, yanlar sıfıra yakın.", "faux-hawk"], ["Kısa sakal + keskin hat", "Çene hattını belirginleştirir.", "kisa-sakal"]], kare: [["Buzz cut", "Güçlü çene hattını öne çıkarır.", "buzz"], ["Crew cut", "Sade, bakımı kolay.", "crew"], ["Undercut", "Üst uzun, yanlar kısa.", "undercut"]], uzun: [["Fringe / kakül", "Alnı kısaltır, yüzü dengeler.", "fringe"], ["Yanlar orta uzun", "Yüzü genişletir.", "orta-yan"], ["Doğal dalgalı üst", "Yükseklik vermeden hacim.", "dalgali"]] };
  var secModel = ONERI.oval[0];
  function model(k) {
    var q = function (s) { return E.q(k, s); };
    q(".m-yuz").innerHTML = Object.keys(YUZ).map(function (y) { return '<button type="button" class="cip" data-y="' + y + '">' + YUZ[y][0] + "</button>"; }).join("");
    function goster(m) { secModel = m; E.fotoDegis(q(".m-foto"), "../img/s_" + m[2] + ".jpg", m[0]); q(".m-alt").innerHTML = "<b>" + m[0] + "</b> · " + m[1]; k.querySelectorAll(".m-model button").forEach(function (b) { b.classList.toggle("on", b.dataset.m === m[2]); }); }
    function yuz(y) {
      k.querySelectorAll(".m-yuz .cip").forEach(function (c) { c.classList.toggle("on", c.dataset.y === y); });
      q(".m-ipucu").textContent = YUZ[y][1];
      q(".m-model").innerHTML = ONERI[y].map(function (m) { return '<button type="button" data-m="' + m[2] + '"><img src="../img/s_' + m[2] + '.jpg" alt="' + m[0] + '" loading="lazy"><span>' + m[0] + "</span></button>"; }).join("");
      k.querySelectorAll(".m-model button").forEach(function (b, i) { b.onclick = function () { goster(ONERI[y][i]); }; });
      goster(ONERI[y][0]);
    }
    k.querySelectorAll(".m-yuz .cip").forEach(function (c) { c.onclick = function () { yuz(c.dataset.y); }; }); yuz("oval");
    q(".m-sec").onclick = function () { var i = document.querySelector(".rv-model"); if (i) i.value = secModel[0]; var r = document.getElementById("randevu"); if (r) r.scrollIntoView({ behavior: "smooth" }); };
  }
  function kart(k) {
    var q = function (s) { return E.q(k, s); }, n = 3;
    function ciz() {
      q(".sk-damga").innerHTML = [0, 1, 2, 3, 4, 5].map(function (i) { return '<span class="' + (i < n ? "ok" : "") + '">' + (i === 5 ? "🎁" : i < n ? "✂" : "") + "</span>"; }).join("");
      q(".sk-sonuc").innerHTML = n >= 5 ? '<div class="buyuk" style="font-size:1.3rem">Sıradaki tıraşınız bizden!</div>' : '<div class="buyuk" style="font-size:1.3rem">' + (5 - n) + " tıraş sonra 1 tıraş bedava</div>";
    }
    q(".sk-ekle").onclick = function () { n = n >= 5 ? 0 : n + 1; ciz(); }; ciz();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".model").forEach(model); document.querySelectorAll(".kartim").forEach(kart);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Saç kesimi", "Saç + sakal", "Sakal tıraşı / şekillendirme", "Skin fade", "Çocuk tıraşı", "Damat tıraşı", "Cilt bakımı"], [["Model", ".rv-model"]]); });
  });
})();
