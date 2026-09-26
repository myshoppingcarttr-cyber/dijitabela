// ===== Kaydırmalı dükkân hikâyesi, yazı şeritleri, uygulama fikri taslağı =====
// Kaydırma yalnızca transform/opacity değiştirir; az hareket tercihinde sahne son hâlinde sabit kalır.
(function () {
  "use strict";
  var az = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var kes = function (x) { return Math.max(0, Math.min(1, x)); };
  var yum = function (x) { x = kes(x); return x * x * (3 - 2 * x); };
  var ara = function (a, b, p) { return a + (b - a) * p; };

  // ---------- Dükkân hikâyesi ----------
  var hk = document.getElementById("hikaye");
  if (hk) (function () {
    var sahne = document.getElementById("hk-sahne"), katlar = [].slice.call(sahne.querySelectorAll(".hk-kat"));
    var kepenk = [].slice.call(sahne.querySelectorAll(".hk-kepenk img")), usta = document.getElementById("hk-usta");
    var adimlar = [].slice.call(hk.querySelectorAll(".hk-adim")), cip = document.getElementById("hk-cip"), cipSayi = document.getElementById("hk-cip-sayi");
    var cubuk = document.getElementById("hk-cubuk"), tel = hk.querySelector(".tel"), inp = document.getElementById("yaz-ad");
    var yayaKap = document.getElementById("hk-yayalar");
    // Sahne ölçüleri 572x1024 görsel koordinatında
    var W = 572, H = 1024, USTA_X = 190, ZEMIN = 742, KAPI = 425, YAYA_Z = 690;
    var YUR = [[234, 490], [201, 491], [232, 490], [219, 488]], DUR = [193, 380];
    var yuzde = function (x, y, w, h, el) { el.style.left = (x / W * 100) + "%"; el.style.top = (y / H * 100) + "%"; el.style.width = (w / W * 100) + "%"; if (h) el.style.height = (h / H * 100) + "%"; };
    // Yayalar: [kimlik, sahneye giriş anı (0-1), başlangıç x, yön, etiket]
    var YAYA = [[1, 0, -90, 1, "YENİ · GOOGLE"], [3, .18, 660, -1, "ESKİ MÜŞTERİ"], [2, .36, -90, 1, "YENİ · GOOGLE"], [4, .52, 660, -1, "ESKİ MÜŞTERİ"]].map(function (a) {
      var d = document.createElement("div"); d.className = "hk-yaya";
      var i1 = new Image(), i2 = new Image(); i1.src = "assets/img/sahne/yaya-" + a[0] + ".webp"; i2.src = "assets/img/sahne/yaya-" + (a[0] + 4) + ".webp"; i1.alt = i2.alt = "";
      var e = document.createElement("span"); e.textContent = a[4]; if (a[4][0] === "Y") e.className = "yeni";
      d.appendChild(i1); d.appendChild(i2); d.appendChild(e); yayaKap.appendChild(d);
      return { el: d, i1: i1, i2: i2, bas: a[1], x0: a[2], yon: a[3] };
    });

    // LED tabela (44x15 nokta)
    var cv = document.getElementById("hk-led"), ctx = cv.getContext("2d"), SUT = 44, SAT = 15, yazi = "", yaziKol = [], yaziT = 0;
    function ledYaz(t) { if (t !== yazi) { yazi = t; yaziKol = t ? window.LED.sutunlar(t) : []; yaziT = performance.now(); } }
    function ledCiz(parlak, an) {
      var w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      var ax = w / SUT, ay = h / SAT, r = Math.min(ax, ay) * .36, n = yaziKol.length, sigar = n <= SUT - 2;
      var kay = sigar || az ? 0 : Math.floor((an - yaziT) / 85) % (n + SUT);
      for (var x = 0; x < SUT; x++) for (var y = 0; y < SAT; y++) {
        var yan = false;
        if (y >= 3 && y < 12 && parlak > 0) { var i = sigar || az ? x - Math.floor((SUT - n) / 2) : x - SUT + kay; yan = !!(yaziKol[i] && yaziKol[i][y - 3]); }
        ctx.fillStyle = yan ? (parlak < 1 && ((x * 7 + y * 3) % 10) / 10 > parlak ? "#5A4310" : "#FFB000") : "#23262C";
        ctx.beginPath(); ctx.arc(x * ax + ax / 2, y * ay + ay / 2, r, 0, 6.2832); ctx.fill();
      }
    }

    var p = az ? 1 : 0, sonP = -1;
    function ilerleme() {
      var r = hk.getBoundingClientRect(), boy = hk.offsetHeight - window.innerHeight;
      return az ? 1 : kes(-r.top / Math.max(1, boy));
    }
    function kur(an) {
      p = ilerleme();
      // Aşamalar: 0 kepenk · .18 tabela · .38 telefon · .56 sektörler · .80 müşteri
      var adim = p < .16 ? 0 : p < .36 ? 1 : p < .55 ? 2 : p < .78 ? 3 : 4;
      adimlar.forEach(function (a, i) { a.classList.toggle("aktif", i === adim); });
      cubuk.style.transform = "scaleX(" + p + ")";
      // Kepenk (yalnız ilk dükkânda)
      var kep = yum(p / .14); kepenk.forEach(function (k) { k.style.transform = "translateY(" + (-kep * 100) + "%)"; k.parentNode.style.opacity = kep >= 1 ? 0 : 1; });
      // Sektör geçişleri
      var sp = kes((p - .56) / .24), sIdx = Math.min(katlar.length - 1, Math.floor(sp * (katlar.length - 1 + .999)) + (p >= .56 ? 1 : 0));
      if (p >= .78) sIdx = katlar.length - 1;
      if (p < .56) sIdx = 0;
      katlar.forEach(function (k, i) { k.style.opacity = i === 0 || i <= sIdx ? (i === sIdx || i === 0 ? 1 : 0) : 0; });
      katlar.forEach(function (k, i) { if (i > 0) k.style.opacity = i === sIdx ? 1 : 0; });
      // Tabela yazısı
      var ad = inp && inp.value.trim() ? inp.value.trim().toLocaleUpperCase("tr-TR") : "İŞLETMENİZİN ADI";
      var parlak = yum((p - .15) / .06);
      ledYaz(p < .15 ? "" : p < .55 ? ad : p < .78 ? (katlar[sIdx] && katlar[sIdx].dataset.yazi) || "AÇIK" : "HOŞ GELDİNİZ");
      ledCiz(parlak, an || performance.now());
      // Usta: kepenk açılınca yürüyerek gelir, telefon aşamasında konuşur, sonda mutlu
      var yp = kes((p - .04) / .12), ux = ara(-120, USTA_X, yp), yurur = yp > 0 && yp < 1;
      var kare, kw, kh;
      if (yurur) { var f = Math.floor((ux + 120) / 30) % 4; kare = "yurume-" + (f + 1); kw = YUR[f][0] * 342 / 490; kh = YUR[f][1] * 342 / 490; }
      else { kare = p >= .38 && p < .55 ? "usta-" + (Math.floor((an || 0) / 380) % 2 ? 7 : 8) : p >= .78 ? "usta-5" : "usta-4"; kw = DUR[0] * .9; kh = DUR[1] * .9; if (kare === "usta-7" || kare === "usta-8") kw = 209 * .9; }
      var src = "assets/img/sahne/" + kare + ".webp"; if (usta.getAttribute("src") !== src) usta.setAttribute("src", src);
      var zip = 0; if (p >= .38 && p < .42) zip = Math.sin(kes((p - .38) / .04) * Math.PI) * 10;
      yuzde(ux - kw / 2, ZEMIN - kh - zip - (yurur ? Math.abs(Math.sin((ux + 120) / 30 * Math.PI / 2)) * 4 : 0), kw, kh, usta);
      usta.style.opacity = yp > 0 ? (1 - yum((p - .55) / .03)) + yum((p - .79) / .03) : 0;
      // Telefon çipi ve harita kartı
      var cg = yum((p - .38) / .03) * (1 - yum((p - .55) / .03));
      cip.style.opacity = cg; cip.style.transform = "translateX(-50%) scale(" + (.85 + .15 * cg) + ")"; cipSayi.textContent = Math.round(kes((p - .38) / .16) * 11) + (cg > 0 ? 1 : 0);
      if (tel) tel.dataset.durum = p >= .45 ? "sonra" : "once";
      // Müşteriler kapıdan girer
      var mp = kes((p - .78) / .2);
      YAYA.forEach(function (y) {
        var q = kes((mp - y.bas) / .45); if (q <= 0) { y.el.style.opacity = 0; return; }
        var x = ara(y.x0, KAPI, Math.min(1, q * 1.25)), vardi = q * 1.25 >= 1, ad2 = Math.abs(x - y.x0) / 26;
        var ikinci = !vardi && Math.floor(ad2) % 2 === 1; y.i1.style.display = ikinci ? "none" : ""; y.i2.style.display = ikinci ? "" : "none";
        y.el.style.opacity = vardi ? 1 - kes((q * 1.25 - 1) / .25) : 1;
        y.el.style.left = ((x - 62) / W * 100) + "%"; y.el.style.top = ((YAYA_Z - 257) / H * 100) + "%";
        y.el.style.transform = "scaleX(" + y.yon + ")"; y.el.querySelector("span").style.transform = "translateX(-50%) scaleX(" + y.yon + ")";
      });
    }
    function dongu(an) { if (!document.hidden) kur(an); requestAnimationFrame(dongu); }
    if (inp) document.getElementById("yaz-form").addEventListener("submit", function (e) { e.preventDefault(); inp.blur(); });
    if (az) { hk.classList.add("durgun"); }
    requestAnimationFrame(dongu);
  })();

  // ---------- Kaydırmayla kayan dev yazı şeritleri ----------
  var seritler = [].slice.call(document.querySelectorAll(".yp-serit"));
  if (seritler.length && !az) {
    var serit = function () {
      seritler.forEach(function (s) {
        var r = s.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
        var d = (innerHeight - r.top) / (innerHeight + r.height), yon = s.dataset.yon === "sag" ? 1 : -1;
        s.firstElementChild.style.transform = "translateX(" + (yon * (d * 40 - 20) - (yon > 0 ? 25 : 0)) + "%)";
      });
    };
    addEventListener("scroll", serit, { passive: true }); serit();
  }

  // ---------- Uygulama fikri → telefon ekranı taslağı ----------
  var fm = document.getElementById("fk-metin");
  if (fm) (function () {
    var ekran = document.getElementById("fk-ekran"), alt = document.getElementById("fk-alt"), adEl = document.getElementById("fk-ad"), harf = document.getElementById("fk-harf"), isim = document.getElementById("fk-isim");
    // anahtar kelime → özellik [ikon, başlık, açıklama]
    var OZ = [
      [/randevu|rezervasyon|seans|saat al|takvim/i, ["◷", "Randevu al", "Boş saatleri görüp seçer"]],
      [/puan|sadakat|kart|damga|ödül|bedava|5\.? kahve/i, ["★", "Puan kartı", "Her ziyarette puan birikir"]],
      [/sipariş|menü|qr|masa|paket|yemek/i, ["☰", "Menü ve sipariş", "Masadan ya da evden sipariş"]],
      [/ödeme|kapora|taksit|kart ile|fatura/i, ["₺", "Online ödeme", "Kapora ve taksitli ödeme"]],
      [/bildirim|hatırlat|haber|duyur/i, ["◉", "Bildirimler", "Hatırlatma ve kampanya bildirimi"]],
      [/kampanya|indirim|kupon|fırsat/i, ["%", "Kampanyalar", "Size özel fırsatlar"]],
      [/araç|servis|bakım|tamir|durum/i, ["⚙", "Araç durumu", "Servisteki işin adım adım takibi"]],
      [/konum|harita|kurye|teslimat|kargo|nerede/i, ["⌖", "Canlı konum", "Teslimat ve kurye takibi"]],
      [/ürün|katalog|stok|mağaza|satış/i, ["▦", "Ürün kataloğu", "Fotoğraflı ürünler ve stok"]],
      [/mesaj|sohbet|whatsapp|destek|soru/i, ["✉", "Canlı destek", "Sorulara anında cevap"]],
      [/yapay|asistan|ai|akıllı/i, ["✦", "Yapay zekâ asistanı", "7/24 soruları cevaplar"]],
      [/ders|kurs|eğitim|öğrenci|kursiyer|program/i, ["▤", "Ders programı", "Program, yoklama, ödemeler"]],
      [/ilan|emlak|daire|kiralık|satılık/i, ["⌂", "İlanlar", "Filtreli ilan listesi"]],
      [/üye|giriş|hesap|profil/i, ["◎", "Üye hesabı", "Geçmiş işlemler ve bilgiler"]],
      [/yorum|puanla|değerlendir|anket/i, ["☆", "Değerlendirme", "Memnuniyet ve yorum"]],
      [/fotoğraf|galeri|video/i, ["▣", "Galeri", "Fotoğraf ve videolar"]],
      [/rapor|panel|yönetim|personel|çalışan/i, ["▥", "Yönetim paneli", "Size özel raporlar ve personel"]]
    ];
    function ciz() {
      var t = fm.value, bulunan = OZ.filter(function (o) { return o[0].test(t); }).map(function (o) { return o[1]; });
      if (!bulunan.length) bulunan = [["◷", "Randevu al", "Boş saatleri görüp seçer"], ["◉", "Bildirimler", "Hatırlatma ve kampanya"], ["◎", "Üye hesabı", "Geçmiş işlemler"]];
      var ad = (isim && isim.value.trim()) || "Uygulamanız";
      adEl.textContent = ad; harf.textContent = ad.trim()[0].toLocaleUpperCase("tr-TR");
      ekran.innerHTML = bulunan.slice(0, 6).map(function (o, i) { return '<div class="fk-kutu" style="animation-delay:' + (i * 60) + 'ms"><i>' + o[0] + "</i><b>" + o[1] + "</b><small>" + o[2] + "</small></div>"; }).join("");
      alt.innerHTML = bulunan.slice(0, 4).map(function (o, i) { return "<span" + (i === 0 ? ' class="on"' : "") + ">" + o[0] + "</span>"; }).join("");
    }
    fm.addEventListener("input", ciz); if (isim) isim.addEventListener("input", ciz);
    [].slice.call(document.querySelectorAll("[data-ornek]")).forEach(function (b) { b.addEventListener("click", function () { fm.value = b.dataset.ornek; ciz(); fm.focus(); }); });
    ciz();
    var f = document.getElementById("fk-form"), durum = document.getElementById("fk-durum");
    var yaz = function (m, s) { durum.textContent = m; durum.className = "durum " + (s || ""); };
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var tel = document.getElementById("fk-tel").value.trim();
      if (fm.value.trim().length < 10) return yaz("Önce fikrinizi birkaç kelimeyle yazın.", "kotu"), fm.focus();
      if (tel.replace(/\D/g, "").length < 10) return yaz("Size ulaşabilmemiz için telefon numaranızı yazın.", "kotu");
      if (!document.getElementById("fk-kvkk").checked) return yaz("Devam etmek için KVKK kutusunu işaretleyin.", "kotu");
      var b = f.querySelector("button"); b.disabled = true; yaz("Gönderiliyor…");
      API.taslakIste({ isletme: (isim.value.trim() || "Uygulama fikri"), sektor: "diger", tel: tel, kvkk: new Date().toISOString(), kaynak: "Uygulama fikri", not: "Uygulama fikri: " + fm.value.trim() })
        .then(function () { yaz("Fikriniz bize ulaştı. İnceleyip en geç 2 iş günü içinde sizi arayacağız.", "iyi"); f.reset(); })
        .catch(function (x) { yaz("Gönderilemedi: " + (x && x.message ? x.message : "bağlantı hatası") + ". Lütfen tekrar deneyin.", "kotu"); })
        .then(function () { b.disabled = false; });
    });
  })();
})();
