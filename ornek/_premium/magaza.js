// Bebek & çocuk giyim mağazası premium modülü · YAMA-GALERI-MAGAZA 14 Eki 2026
// Koleksiyon süzgeci (window.URUN örnek ürünleri, yaş → beden aralığı) + Listem (WhatsApp'tan stok/beden sorusu) + beden bulucu.
(function () {
  var h = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // Genel çocuk beden kalıbı (beden = boy cm)
  var BEDEN = [[50, "Yenidoğan"], [56, "0-2 ay"], [62, "2-4 ay"], [68, "4-6 ay"], [74, "6-9 ay"], [80, "9-12 ay"], [86, "12-18 ay"], [92, "18-24 ay"], [98, "2-3 yaş"], [104, "3-4 yaş"], [110, "4-5 yaş"], [116, "5-6 yaş"], [122, "6-7 yaş"], [128, "7-8 yaş"], [134, "8-9 yaş"], [140, "9-10 yaş"], [146, "10-11 yaş"], [152, "11-12 yaş"], [158, "12-13 yaş"], [164, "13-14 yaş"]];
  var YAS = [["0-6 ay", 50, 68], ["6-12 ay", 74, 80], ["1-2 yaş", 86, 92], ["2-3 yaş", 98, 98], ["3-4 yaş", 104, 104], ["4-6 yaş", 110, 116], ["6-8 yaş", 122, 128], ["8-10 yaş", 134, 140], ["10-12 yaş", 146, 152], ["12 yaş +", 158, 176]];
  function aralik(b) { var m = String(b || "").match(/(\d{2,3})\s*[-–]\s*(\d{2,3})/) || String(b || "").match(/(\d{2,3})/); return m ? [+m[1], +(m[2] || m[1])] : null; }
  function vitrin(k) {
    var $ = function (s) { return k.querySelector(s); }, U = (window.URUN || []).map(function (x, i) { x.i = i; return x; }), kat = "", liste = [];
    var katlar = [""].concat(U.map(function (x) { return x.kategori; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; }));
    $(".m-kat").innerHTML = katlar.map(function (x) { return '<button type="button" class="cip' + (x ? "" : " on") + '" data-k="' + h(x) + '">' + (x ? h(x) : "Hepsi") + "</button>"; }).join("");
    $(".m-kat").querySelectorAll(".cip").forEach(function (c) { c.onclick = function () { kat = c.dataset.k; $(".m-kat").querySelectorAll(".cip").forEach(function (x) { x.classList.toggle("on", x === c); }); ciz(); }; });
    $(".m-yas").innerHTML += YAS.map(function (y, i) { return '<option value="' + i + '">' + y[0] + "</option>"; }).join("");
    function ciz() {
      var y = $(".m-yas").value === "" ? null : YAS[+$(".m-yas").value];
      var s = U.filter(function (x) { var a = aralik((x.ozellik || {}).Beden); return (!kat || x.kategori === kat) && (!y || !a || (a[0] <= y[2] && a[1] >= y[1])); });
      $(".urunler").innerHTML = s.length ? s.map(function (x) { var o = x.ozellik || {}, sec = liste.indexOf(x.i) >= 0; return '<div class="ilan' + (sec ? " sec" : "") + '"><span class="kat">' + h(x.kategori) + "</span><h4>" + h(x.baslik) + "</h4><dl>" + Object.keys(o).map(function (a) { return "<dt>" + h(a) + "</dt><dd>" + h(o[a]) + "</dd>"; }).join("") + '</dl><button class="dg' + (sec ? " ikinci" : "") + '" data-i="' + x.i + '">' + (sec ? "✓ Listede" : "Listeme ekle") + "</button></div>"; }).join("") : '<p class="bos-sonuc">Bu yaş ve kategoride örnek ürün yok. Aradığınızı bize yazın, mağazada bakalım.</p>';
      $(".urunler").querySelectorAll("[data-i]").forEach(function (b) { b.onclick = function () { var i = +b.dataset.i, j = liste.indexOf(i); if (j >= 0) liste.splice(j, 1); else liste.push(i); ciz(); }; });
      $(".m-say").textContent = "(" + liste.length + ")";
      $(".m-liste").innerHTML = liste.length ? liste.map(function (i) { return "• " + h(U[i].baslik); }).join("<br>") : "Henüz ürün eklemediniz.";
    }
    $(".m-yas").onchange = ciz; ciz();
    $(".m-gonder").onclick = function () { var y = $(".m-yas").value === "" ? "" : YAS[+$(".m-yas").value][0]; waAc("Merhaba, sitenizden seçtiklerim:\n" + (liste.length ? liste.map(function (i) { return "- " + U[i].baslik; }).join("\n") : "- (henüz ürün seçmedim)") + (y ? "\nÇocuğun yaşı: " + y : "") + "\nBeden ve stok durumu nedir?"); };
  }
  function beden(k) {
    var $ = function (s) { return k.querySelector(s); }, tab = document.querySelector(".b-tablo"), son = null;
    if (tab) tab.innerHTML = BEDEN.map(function (b) { return '<tr data-b="' + b[0] + '"><td>' + b[0] + "</td><td>" + (b[0] - 5) + "–" + b[0] + "</td><td>" + b[1] + "</td></tr>"; }).join("");
    function hesap() {
      var boy = parseFloat(String($(".b-boy").value).replace(",", ".")) || 0;
      if (boy < 40 || boy > 176) { son = null; $(".sonuc").innerHTML = '<div class="not" style="margin:0">Boyu santimetre olarak yazın (ör. 100).</div>'; if (tab) tab.querySelectorAll("tr").forEach(function (r) { r.classList.remove("on"); }); return; }
      var i = BEDEN.findIndex(function (b) { return b[0] >= boy; }); if (i < 0) i = BEDEN.length - 1;
      if ($(".b-pay").checked && i < BEDEN.length - 1) i++;
      son = BEDEN[i];
      $(".sonuc").innerHTML = '<div class="not" style="margin:0">Önerilen beden</div><div class="buyuk">' + son[0] + '</div><p class="not" style="margin:6px 0 0">Yaklaşık ' + son[1] + ($(".b-pay").checked ? " · büyüme payıyla" : "") + "</p>";
      if (tab) tab.querySelectorAll("tr").forEach(function (r) { r.classList.toggle("on", +r.dataset.b === son[0]); });
    }
    $(".b-boy").oninput = $(".b-pay").onchange = hesap; hesap();
    $(".b-gonder").onclick = function () { waAc("Merhaba, çocuğumun boyu " + ($(".b-boy").value || "-") + " cm" + (son ? "; sitenizde " + son[0] + " beden önerildi" : "") + ". Bu bedende neler var?"); };
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".vitrin").forEach(vitrin); document.querySelectorAll(".bedenb").forEach(beden); });
})();
