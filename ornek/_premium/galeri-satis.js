// Oto galeri (alım-satım) premium modülü · YAMA-GALERI-MAGAZA 14 Eki 2026
// Araç bulucu (window.ILAN örnek ilanları) + aracı yerinde görme randevusu (talep) + taşıt kredisi taksit hesaplayıcı. Fiyat/değer biçmez.
// v2 (14 Eki): ön görüşme formu çıkarıldı (Patron kararı).
(function () {
  var sayi = function (v) { return +String(v || "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".") || 0; };
  var tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  var h = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function bulucu(k) {
    var $ = function (s) { return k.querySelector(s); }, L = (window.ILAN || []).map(function (x, i) { x.i = i; return x; }), kat = "";
    var katlar = [""].concat(L.map(function (x) { return x.kategori; }).filter(function (x, i, a) { return x && a.indexOf(x) === i; }));
    $(".g-kat").innerHTML = katlar.map(function (x) { return '<button type="button" class="cip' + (x ? "" : " on") + '" data-k="' + h(x) + '">' + (x ? h(x) : "Hepsi") + "</button>"; }).join("");
    $(".g-kat").querySelectorAll(".cip").forEach(function (c) { c.onclick = function () { kat = c.dataset.k; $(".g-kat").querySelectorAll(".cip").forEach(function (x) { x.classList.toggle("on", x === c); }); ciz(); }; });
    function ciz() {
      var v = $(".g-vites").value, km = +$(".g-km").value, sira = $(".g-sira").value;
      $(".g-km-y").textContent = km >= 250000 ? "sınır yok" : km.toLocaleString("tr-TR") + " km";
      var s = L.filter(function (x) { var o = x.ozellik || {}; return (!kat || x.kategori === kat) && (!v || o.Vites === v) && (km >= 250000 || sayi(o.Km) <= km); });
      s.sort(function (a, b) { return sira === "km" ? sayi((a.ozellik || {}).Km) - sayi((b.ozellik || {}).Km) : sayi((b.ozellik || {}).Yıl) - sayi((a.ozellik || {}).Yıl); });
      $(".ilanlar").innerHTML = s.length ? s.map(function (x) { var o = x.ozellik || {}; return '<div class="ilan"><span class="kat">' + h(x.kategori) + "</span><h4>" + h(x.baslik) + "</h4><dl>" + Object.keys(o).map(function (a) { return "<dt>" + h(a) + "</dt><dd>" + h(o[a]) + "</dd>"; }).join("") + '</dl><span class="fy">' + h(x.fiyat || "Fiyat için arayın") + '</span><button class="dg wa" data-i="' + x.i + '">Bu aracı sor</button></div>'; }).join("") : '<p class="bos-sonuc">Bu süzgece uyan araç yok. Kilometre sınırını açın ya da aradığınız aracı bize yazın.</p>';
      $(".ilanlar").querySelectorAll("[data-i]").forEach(function (b) { b.onclick = function () { var x = L[+b.dataset.i], o = x.ozellik || {}; waAc("Merhaba, sitenizdeki araçla ilgileniyorum:\n" + x.baslik + " (" + [o.Yıl, o.Km ? o.Km + " km" : "", o.Vites].filter(Boolean).join(" · ") + ")\nHâlâ satışta mı? Ne zaman görebilirim?"); }; });
    }
    $(".g-vites").onchange = $(".g-sira").onchange = ciz; $(".g-km").oninput = ciz; ciz();
  }
  function gorme(k) {
    var $ = function (s) { return k.querySelector(s); }, dilim = "";
    $(".r-arac").innerHTML = '<option value="">Henüz seçmedim</option>' + (window.ILAN || []).map(function (x) { return "<option>" + h(x.baslik) + "</option>"; }).join("");
    var g = new Date(); g.setDate(g.getDate() + 1); $(".r-gun").value = g.toISOString().slice(0, 10); $(".r-gun").min = new Date().toISOString().slice(0, 10);
    $(".r-dilim").querySelectorAll(".cip").forEach(function (c) { c.onclick = function () { dilim = c.textContent; $(".r-dilim").querySelectorAll(".cip").forEach(function (x) { x.classList.toggle("on", x === c); }); }; });
    $(".r-gonder").onclick = function () { waAc("Merhaba, sitenizdeki aracı yerinde görmek istiyorum:\nAraç: " + ($(".r-arac").value || "henüz seçmedim") + "\nTercih ettiğim gün: " + ($(".r-gun").value || "-") + "\nZaman dilimi: " + (dilim || "-") + ($(".r-not").value ? "\nNot: " + $(".r-not").value : "") + "\nUygun olup olmadığını teyit eder misiniz?"); };
  }
  function kredi(k) {
    var $ = function (s) { return k.querySelector(s); };
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hesap; });
    function hesap() {
      var b = sayi($(".k-bedel").value), p = sayi($(".k-pesin").value), n = +$(".k-vade").value, r = (parseFloat(String($(".k-oran").value).replace(",", ".")) || 0) / 100, P = b - p;
      if (!b || !$(".k-oran").value) { $(".sonuc").innerHTML = '<div class="not" style="margin:0">Araç bedelini ve bankanızın aylık oranını yazın; taksit burada görünür.</div>'; return; }
      if (P <= 0) { $(".sonuc").innerHTML = '<div class="not" style="margin:0">Peşinat araç bedelini karşılıyor; kredi gerekmiyor.</div>'; return; }
      var t = r > 0 ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
      $(".sonuc").innerHTML = '<div class="not" style="margin:0">Tahmini aylık taksit (' + n + ' ay)</div><div class="buyuk">' + tl(t) + '</div><p class="not" style="margin:6px 0 0">Kredi tutarı ' + tl(P) + " · toplam geri ödeme " + tl(t * n) + "</p>";
    }
    hesap();
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".bulucu").forEach(bulucu); document.querySelectorAll(".gorme").forEach(gorme); document.querySelectorAll(".kredi").forEach(kredi); });
})();
