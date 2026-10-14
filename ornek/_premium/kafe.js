// Kafe / restoran premium modülü (ARGE-007, 14 Eki 2026): QR menü + alerjen filtresi · masadan sipariş (sepet) · masa rezervasyonu
(function () {
  var E = window.ESNAF;
  var ALERJEN = { g: "Gluten", s: "Süt", y: "Yumurta", f: "Fındık / kuruyemiş", z: "Susam", o: "Soya" };
  // [ad, kategori, (kullanılmıyor: fiyat işletmenin menüsünden gelir; AKTARIM-SABLON), açıklama, alerjenler, etiket (v: vegan, vj: vejetaryen), foto]
  var MENU = [
    ["Espresso", "Kahve", 75, "Tek shot", "", "v", "t_espresso"], ["Latte", "Kahve", 110, "Espresso, buharda süt", "s", "vj", "t_latte"], ["Yulaf sütlü latte", "Kahve", 125, "Espresso, yulaf sütü", "g", "v", "t_latte"],
    ["Demleme çay", "Sıcak", 30, "İnce belli bardakta", "", "v", "t_cay"], ["Limonata", "Soğuk", 95, "Limon, nane", "", "v", "t_limonata"],
    ["Serpme kahvaltı (2 kişilik)", "Kahvaltı", 690, "Peynirler, zeytin, reçel, yumurta, sıcaklar", "gsyz", "vj", "t_kahvalti"], ["Menemen", "Kahvaltı", 180, "Domates, biber, yumurta", "y", "vj", "t_menemen"], ["Kaşarlı tost", "Kahvaltı", 160, "Ekşi mayalı ekmek, kaşar", "gs", "vj", "t_tost"],
    ["Akdeniz salata", "Yemek", 240, "Yeşillik, domates, zeytinyağı, nar ekşisi", "", "v", "t_salata"], ["Kremalı mantarlı makarna", "Yemek", 290, "Penne, mantar, krema, parmesan", "gs", "vj", "t_makarna"],
    ["San Sebastian cheesecake", "Tatlı", 210, "Yanık yüzeyli", "gsy", "vj", "t_cheesecake"], ["Brownie", "Tatlı", 170, "Bitter çikolata, ceviz", "gsyf", "vj", "t_brownie"], ["Tereyağlı kruvasan", "Tatlı", 120, "Fransız usulü kat kat", "gsy", "vj", "t_kruvasan"]];
  var tl = function (n) { return n.toLocaleString("tr-TR") + " ₺"; };
  var sepet = {};
  function sepetCiz() {
    document.querySelectorAll(".siparis").forEach(function (k) {
      var q = function (s) { return E.q(k, s); }, ids = Object.keys(sepet), top = 0;
      q(".s-sepet").innerHTML = ids.length ? ids.map(function (i) { var m = MENU[i]; return '<li style="align-items:center;justify-content:space-between"><span>' + m[0] + '</span><span class="sayac" data-i="' + i + '"><button type="button" aria-label="Azalt">−</button><span>' + sepet[i] + '</span><button type="button" aria-label="Artır">+</button></span></li>'; }).join("") : '<li><span class="not" style="margin:0">Sepet boş. Menüden “+” ile ekleyin.</span></li>';
      k.querySelectorAll(".s-sepet .sayac").forEach(function (s) { var i = s.dataset.i, b = s.querySelectorAll("button"); b[0].onclick = function () { ekle(i, -1); }; b[1].onclick = function () { ekle(i, 1); }; });
      var adet = ids.reduce(function (a, i) { return a + sepet[i]; }, 0);
      q(".s-sonuc").innerHTML = adet ? '<div class="buyuk">' + adet + " ürün</div><p>Masa " + (q(".s-masa").value.replace(/\D/g, "") || "?") + '</p><p class="not">Fiyatlar işletmenin güncel menüsünden gelir. Ödeme masada ya da kasada.</p>' : '<span class="not" style="margin:0">Sepetinize ürün ekleyin.</span>';
    });
    document.querySelectorAll(".urun").forEach(function (u) { var n = sepet[u.dataset.i] || 0; u.querySelector(".adet").textContent = n ? n + " sepette" : ""; });
  }
  function ekle(i, d) { sepet[i] = (sepet[i] || 0) + d; if (sepet[i] <= 0) delete sepet[i]; sepetCiz(); }
  function menu(k) {
    var q = function (s) { return E.q(k, s); }, haric = {}, kat = "Tümü";
    var katlar = ["Tümü"].concat(MENU.map(function (m) { return m[1]; }).filter(function (x, i, a) { return a.indexOf(x) === i; })).concat(["Vegan"]);
    q(".m-alerjen").innerHTML = Object.keys(ALERJEN).map(function (a) { return '<button type="button" class="cip" data-a="' + a + '">' + ALERJEN[a] + "</button>"; }).join("");
    q(".m-kat").innerHTML = katlar.map(function (x) { return '<button type="button" class="cip' + (x === "Tümü" ? " on" : "") + '" data-k="' + x + '">' + x + "</button>"; }).join("");
    q(".m-liste").innerHTML = MENU.map(function (m, i) {
      return '<div class="urun" data-i="' + i + '"><img src="../img/' + m[6] + '.jpg" alt="' + m[0] + '" loading="lazy"><div><h4>' + m[0] + (m[5] === "v" ? '<span class="rozet">VEGAN</span>' : m[5] === "vj" ? '<span class="rozet" style="color:#5c940d">VEJ.</span>' : "") + "</h4><p>" + m[3] + '</p><p class="alr">' + (m[4] ? "İçerir: " + m[4].split("").map(function (a) { return ALERJEN[a]; }).join(", ") : "Listelenen alerjen yok") + '</p><div class="alt-s"><b></b><small class="adet not" style="margin:0"></small><button type="button" class="dg" style="padding:10px 16px;min-height:44px">+</button></div></div></div>';
    }).join("");
    function suz() {
      var gor = 0;
      k.querySelectorAll(".urun").forEach(function (u) {
        var m = MENU[u.dataset.i], ok = Object.keys(haric).every(function (a) { return m[4].indexOf(a) < 0; }) && (kat === "Tümü" || (kat === "Vegan" ? m[5] === "v" : m[1] === kat));
        u.classList.toggle("gizli", !ok); if (ok) gor++;
      });
      var bos = q(".m-bos"); if (!gor) { if (!bos) q(".m-liste").insertAdjacentHTML("beforeend", '<p class="m-bos not">Bu seçimle uygun ürün yok; bir filtreyi kaldırın.</p>'); } else if (bos) bos.remove();
    }
    k.querySelectorAll(".m-alerjen .cip").forEach(function (c) { c.onclick = function () { var a = c.dataset.a; if (haric[a]) delete haric[a]; else haric[a] = 1; c.classList.toggle("on", !!haric[a]); suz(); }; });
    k.querySelectorAll(".m-kat .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".m-kat .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); kat = c.dataset.k; suz(); }; });
    k.querySelectorAll(".urun .dg").forEach(function (b) { b.onclick = function () { ekle(b.closest(".urun").dataset.i, 1); b.textContent = "✓"; setTimeout(function () { b.textContent = "+"; }, 700); }; });
  }
  function siparis(k) {
    var q = function (s) { return E.q(k, s); };
    var m = (location.search.match(/[?&]masa=(\d{1,3})/) || [])[1]; if (m) q(".s-masa").value = m;
    q(".s-masa").oninput = sepetCiz;
    q(".s-bosalt").onclick = function () { sepet = {}; sepetCiz(); };
    q(".s-gonder").onclick = function () {
      var ids = Object.keys(sepet); if (!ids.length) { q(".s-sonuc").innerHTML = '<b style="color:#e03131">Sepet boş.</b>'; return; }
      waAc("Masa " + (q(".s-masa").value || "?") + " siparişi:\n" + ids.map(function (i) { return sepet[i] + " × " + MENU[i][0]; }).join("\n") + (q(".s-not").value ? "\nNot: " + q(".s-not").value : ""));
    };
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".menu-arac").forEach(menu); document.querySelectorAll(".siparis").forEach(siparis); sepetCiz();
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Masa rezervasyonu", "Kahvaltı rezervasyonu", "Doğum günü / kutlama", "Toplantı / grup"], [["Kişi", ".rv-kisi"], ["Not", ".rv-not"]]); });
  });
})();
