// Güzellik merkezi premium modülü (ARGE-007, 14 Eki 2026): işlem planlayıcı (süre, sıra, çakışma, seans takvimi) · önce/sonra kaydırıcı · randevu
(function () {
  var E = window.ESNAF;
  // [ad, dk, sıra (küçük önce), grup, foto, seans aralığı gün, seans sayısı]
  var IS = [["Ağda (bacak)", 40, 1, "agda", "t_agda"], ["Lazer epilasyon (bölge)", 30, 1, "lazer", "t_lazer", 35, 6], ["Kaş alımı", 20, 2, "kas", "t_kas"], ["Kirpik lifting", 60, 3, "kirpik", "t_kas", 45, 1],
    ["Cilt bakımı", 75, 4, "cilt", "t_cilt", 28, 1], ["Manikür", 45, 5, "el", "t_manikur"], ["Kalıcı oje", 60, 6, "el", "t_manikur", 21, 1], ["Protez tırnak", 90, 6, "el", "t_manikur", 21, 1], ["Pedikür", 50, 5, "ayak", "t_bakim"]];
  // aynı gün yapılmaz: [a grubu, b grubu, neden]
  var CAKISMA = [["agda", "lazer", "Ağda ve lazer aynı bölgeye aynı gün yapılmaz; lazerden önce 4 hafta ağda yapılmaması önerilir."], ["cilt", "lazer", "Lazer sonrası cilt hassastır; cilt bakımı en az 1 hafta sonra planlanır."], ["kirpik", "cilt", "Kirpik lifting sonrası 24 saat yüz ıslatılmaz; buharlı cilt bakımını önce yaptırın."]];
  var CAKISMA_IC = { el: "Manikür, kalıcı oje ve protez tırnak tek seansta birleşir; süre en uzun işlem kadar sayılır." };
  function planla(k) {
    var q = function (s) { return E.q(k, s); }, sec = {};
    q(".g-sec").innerHTML = IS.map(function (x, i) { return '<button type="button" class="cip" data-i="' + i + '">' + x[0] + " · " + x[1] + " dk</button>"; }).join("");
    function hes() {
      var L = Object.keys(sec).map(function (i) { return IS[i]; }).sort(function (a, b) { return a[2] - b[2]; });
      if (!L.length) { q(".g-sonuc").innerHTML = '<span class="not" style="margin:0">Bir ya da birkaç işlem seçin.</span>'; k._plan = null; return; }
      var gruplar = {}, uyari = [], ikinciGun = [];
      L.forEach(function (x) { gruplar[x[3]] = (gruplar[x[3]] || []).concat([x]); });
      CAKISMA.forEach(function (c) { if (gruplar[c[0]] && gruplar[c[1]]) { uyari.push(["acil", c[2]]); ikinciGun.push(c[1] === "lazer" ? c[0] : c[1]); } });
      var bugun = L.filter(function (x) { return ikinciGun.indexOf(x[3]) < 0; }), sonra = L.filter(function (x) { return ikinciGun.indexOf(x[3]) >= 0; });
      // süre: tırnak işlemleri tek seansta birleşir (en uzun + 15 dk); ayrı güne kalan işlemler bugünkü süreye eklenmez
      function sure(liste) {
        var g = {}, t = 0; liste.forEach(function (x) { g[x[3]] = (g[x[3]] || []).concat([x]); });
        Object.keys(g).forEach(function (k) { var a = g[k]; t += k === "el" && a.length > 1 ? Math.max.apply(null, a.map(function (x) { return x[1]; })) + 15 : a.reduce(function (s, x) { return s + x[1]; }, 0); });
        return t;
      }
      if (gruplar.el && gruplar.el.length > 1) uyari.push(["plan", CAKISMA_IC.el]);
      var dk = sure(bugun), dkSonra = sure(sonra);
      var saat = Math.floor(dk / 60), dakika = dk % 60;
      var seans = L.filter(function (x) { return x[5]; });
      q(".g-sonuc").innerHTML = '<div class="buyuk">' + (saat ? saat + " sa " : "") + (dakika ? dakika + " dk" : "") + '</div><p style="margin-top:4px">Sıra: <b>' + bugun.map(function (x) { return x[0]; }).join(" → ") + "</b>" + (sonra.length ? '<br>Ayrı güne: <b>' + sonra.map(function (x) { return x[0]; }).join(", ") + "</b> (" + dkSonra + " dk)" : "") + "</p>" +
        uyari.map(function (u) { return '<p style="margin-top:8px"><span class="seviye ' + u[0] + '">' + (u[0] === "acil" ? "Aynı gün olmaz" : "Birleşir") + "</span> " + u[1] + "</p>"; }).join("") +
        (seans.length ? '<p style="margin-top:8px">Seans takvimi: ' + seans.map(function (x) { return x[0] + " · " + (x[6] > 1 ? x[6] + " seans, " : "") + x[5] + " günde bir"; }).join("; ") + "</p>" : "") + '<p class="not">Süreler ortalamadır; cilt ve kıl tipinize göre uzmanımız netleştirir.</p>';
      var son = L[L.length - 1]; E.fotoDegis(q(".g-foto"), "../img/" + son[4] + ".jpg", son[0]); q(".g-alt").textContent = son[0];
      k._plan = { L: L, seans: seans };
    }
    k.querySelectorAll(".g-sec .cip").forEach(function (c) { c.onclick = function () { var i = c.dataset.i; if (sec[i]) delete sec[i]; else sec[i] = 1; c.classList.toggle("on", !!sec[i]); hes(); }; });
    k.querySelector('.g-sec .cip[data-i="6"]').click(); k.querySelector('.g-sec .cip[data-i="2"]').click();
    q(".g-rv").onclick = function () {
      var p = k._plan, alan = document.querySelector(".rv-plan");
      if (p && alan) alan.value = p.L.map(function (x) { return x[0]; }).join(" + ");
      var r = document.getElementById("randevu"); if (r) r.scrollIntoView({ behavior: "smooth" });
    };
    q(".g-ics").onclick = function () {
      var p = k._plan; if (!p || !p.seans.length) { q(".g-sonuc").insertAdjacentHTML("beforeend", '<p class="not" style="color:#e03131">Seçtiğiniz işlemlerde seans tekrarı yok; seanslı bir işlem (lazer, kalıcı oje, cilt bakımı) seçin.</p>'); return; }
      var ol = [], b = new Date(); b.setHours(11, 0, 0, 0);
      p.seans.forEach(function (x) { for (var i = 1; i <= Math.max(1, x[6] - 1) && ol.length < 12; i++) { var d = new Date(b); d.setDate(d.getDate() + x[5] * i); ol.push({ tarih: d, dk: x[1], baslik: x[0] + (x[6] > 1 ? " · " + (i + 1) + ". seans" : " · tazeleme"), aciklama: (window.ISL.ad || "") + " · randevu için siteyi açın" }); } });
      E.ics("seans-takvimi", ol);
    };
  }
  // Önce / sonra kaydırıcı
  var KAT = [["Tırnak", "t_manikur"], ["Cilt bakımı", "t_cilt"], ["El / ayak bakımı", "t_bakim"]];
  function oncesonra(k) {
    var q = function (s) { return E.q(k, s); }, ks = q(".os-ks");
    function ayar(v) { q(".ks-on").style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; q(".ks-cizgi").style.left = v + "%"; q(".os-ayar").value = v; }
    q(".os-ayar").oninput = function () { ayar(+this.value); };
    function surukle(e) { var r = ks.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left; ayar(Math.max(0, Math.min(100, Math.round(x / r.width * 100)))); }
    var basili = false;
    ks.addEventListener("pointerdown", function (e) { basili = true; surukle(e); }); window.addEventListener("pointerup", function () { basili = false; }); ks.addEventListener("pointermove", function (e) { if (basili) surukle(e); });
    q(".os-kat").innerHTML = KAT.map(function (x, i) { return '<button type="button" class="cip' + (i === 0 ? " on" : "") + '" data-i="' + i + '">' + x[0] + "</button>"; }).join("");
    k.querySelectorAll(".os-kat .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".os-kat .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); var s = "../img/" + KAT[+c.dataset.i][1] + ".jpg"; q(".ks-arka").src = s; q(".ks-on").src = s; ayar(50); }; });
    k.querySelector(".os-kat .cip").click();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".planla").forEach(planla); document.querySelectorAll(".oncesonra").forEach(oncesonra);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Manikür / kalıcı oje", "Protez tırnak", "Kaş ve kirpik", "Cilt bakımı", "Ağda", "Lazer epilasyon (ön görüşme)", "Pedikür"], [["İşlemler", ".rv-plan"]]); });
  });
})();
