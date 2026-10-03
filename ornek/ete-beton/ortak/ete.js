// Ete Beton · üç tasarım seçeneğinin ortak motoru (Dijitabela taslağı)
// Proje Sihirbazı (ön teklif talebi), proje haritası (Leaflet), teknik soru asistanı, WhatsApp/telefon bağlantıları.
// Sihirbazdan gelen talepler bu cihazda "ete-talepler" anahtarına yazılır; aynı adresteki teklif takip paneli (../panel/) onları gösterir.
(function () {
  "use strict";
  var F = window.FIRMA = {
    ad: "Ete Beton Prefabrik", wa: "905533925477", tel: "+904322260202", telYazi: "0432 226 02 02", eposta: "info@etebeton.com.tr",
    adres: "Şemsibey Organize Sanayi Bölgesi 1. Sokak No: 5, Tuşba / Van",
    birimler: [["Merkez", "0432 226 02 02", "info@etebeton.com.tr"], ["Üst Yapı Birimi", "0532 504 53 24 · 0506 747 07 21", "teknik@etebeton.com.tr"], ["Alt Yapı Birimi", "0506 747 07 21", "satis@etebeton.com.tr"], ["Muhasebe", "0553 392 54 77", "muhasebe@etebeton.com.tr"], ["Ankara Ofis", "0312 448 24 47", "Çankaya / Ankara"]],
    insta: "https://www.instagram.com/etebetonprefabrik/", yt: "https://www.youtube.com/@etebetonprefabrik", x: "https://x.com/EteBeton", li: "https://www.linkedin.com/company/ete-beton-prefabri%CC%87k/", katalog: "https://www.etebeton.com.tr/e-katalog"
  };
  var KOK = (function () { var s = document.currentScript && document.currentScript.src || ""; return s.replace(/ortak\/ete\.js.*$/, ""); })();
  var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var wa = function (m) { return "https://wa.me/" + F.wa + "?text=" + encodeURIComponent(m); };

  // ---------- Projeler (etebeton.com.tr proje sayfalarından) ----------
  var PROJELER = [
    { ad: "Van Edremit Güzel Sanatlar Lisesi", tur: "Okul", sistem: "Prekast çift duvar", yer: "Edremit / Van", k: [38.418, 43.262], foto: "p-lise.jpg" },
    { ad: "Ardahan Ziraat Bankası", tur: "Kamu / banka", sistem: "Prekast çift duvar", yer: "Ardahan", k: [41.110, 42.702], foto: "p-ardahan.jpg" },
    { ad: "Prefabrik Ara Katlı İkmal Binası", tur: "Endüstriyel", sistem: "Prefabrik yapı", yer: "Gaziantep", k: [37.066, 37.383], foto: "p-gaziantep.jpg" },
    { ad: "Şemdinli Aslandağı Hidroelektrik Santrali", tur: "Enerji", sistem: "Prefabrik / betonarme", yer: "Şemdinli / Hakkari", k: [37.305, 44.573], foto: "p-hes.jpg" },
    { ad: "My Land Vista Konutları", tur: "Konut", sistem: "Prekast yapı sistemi", yer: "Van", k: [38.505, 43.372], foto: "p-mylandvista.jpg" },
    { ad: "Orsay Edremit Konakları", tur: "Konut", sistem: "Prekast yapı sistemi", yer: "Edremit / Van", k: [38.396, 43.248], foto: "p-orsay.jpg" },
    { ad: "Van İki Nisan Kavşağı Alt Geçit Duvarları", tur: "Altyapı", sistem: "Prefabrik duvar elemanları", yer: "Van", k: [38.494, 43.383], foto: "k-altyapi.jpg" }
  ];
  F.projeler = PROJELER;

  function haritaKur(k) {
    var kutu = $(".hr-harita", k), liste = $(".hr-liste", k);
    liste.innerHTML = PROJELER.map(function (p, i) { return '<button type="button" class="hr-kart" data-i="' + i + '"><img src="' + KOK + "img/" + p.foto + '" alt="" loading="lazy"><span><b>' + p.ad + "</b><small>" + p.tur + " · " + p.yer + "</small></span></button>"; }).join("");
    if (!window.L) { kutu.innerHTML = '<p style="padding:20px">Harita yüklenemedi.</p>'; return; }
    var m = L.map(kutu, { scrollWheelZoom: false }).setView([39.2, 38.5], 6);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 18, attribution: "© OpenStreetMap · © CARTO" }).addTo(m);
    var ik = L.divIcon({ className: "hr-ik", html: "<i></i>", iconSize: [22, 22] });
    var fab = L.marker([38.553, 43.418], { icon: L.divIcon({ className: "hr-ik fab", html: "<i>🏭</i>", iconSize: [34, 34] }) }).addTo(m).bindPopup("<b>Ete Beton fabrikası</b><br>Şemsibey OSB, Van<br>4.000 m² kapalı · 16.000 m² açık alan");
    var im = PROJELER.map(function (p) { return L.marker(p.k, { icon: ik }).addTo(m).bindPopup('<img src="' + KOK + "img/" + p.foto + '" style="width:200px;border-radius:8px"><br><b>' + p.ad + "</b><br>" + p.sistem + " · " + p.yer); });
    liste.addEventListener("click", function (e) { var b = e.target.closest(".hr-kart"); if (!b) return; var p = PROJELER[+b.dataset.i]; m.flyTo(p.k, 11, { duration: .8 }); im[+b.dataset.i].openPopup(); });
    fab.openPopup();
  }

  // ---------- Proje Sihirbazı (ön teklif talebi) ----------
  var TURLER = {
    konut: { ad: "Konut / villa", em: "🏠", sistem: ["Prekast çift duvar", "Prekast filigran döşeme"], birim: "m² inşaat alanı", min: 100, max: 20000, adim: 50, var: 1500, kat: true },
    okul: { ad: "Okul / yurt", em: "🏫", sistem: ["Prekast çift duvar", "Prekast filigran döşeme"], birim: "m² inşaat alanı", min: 500, max: 30000, adim: 100, var: 4000, kat: true },
    saglik: { ad: "Hastane / sağlık", em: "🏥", sistem: ["Prekast çift duvar", "Prekast filigran döşeme"], birim: "m² inşaat alanı", min: 500, max: 40000, adim: 100, var: 6000, kat: true },
    fabrika: { ad: "Fabrika / depo", em: "🏭", sistem: ["Prefabrik kolon, kiriş, çatı makası", "Prefabrik cephe panelleri"], birim: "m² kapalı alan", min: 300, max: 50000, adim: 100, var: 3000, kat: false },
    ticari: { ad: "Ticari / kamu binası", em: "🏢", sistem: ["Prekast çift duvar", "Prefabrik yapı elemanları"], birim: "m² inşaat alanı", min: 200, max: 30000, adim: 100, var: 2000, kat: true },
    altyapi: { ad: "Altyapı (boru, menfez)", em: "🛣️", sistem: ["Beton / betonarme boru (contalı/contasız)", "Ard germeli / ard germesiz kutu menfez"], birim: "metre hat", min: 10, max: 10000, adim: 10, var: 300, kat: false }
  };
  F.turler = TURLER;
  function sihirbazKur(k) {
    var durum = { tur: "konut", alan: 1500, kat: 3, il: "", zaman: "3 ay içinde" }, adim = 1, TOP = 4;
    var t = $(".sh-turler", k);
    t.innerHTML = Object.keys(TURLER).map(function (x) { return '<button type="button" data-t="' + x + '"' + (x === durum.tur ? ' class="on"' : "") + "><span>" + TURLER[x].em + "</span>" + TURLER[x].ad + "</button>"; }).join("");
    var r = $(".sh-alan", k), rd = $(".sh-alan-yazi", k), kat = $(".sh-kat", k);
    function turAyarla() { var T = TURLER[durum.tur]; r.min = T.min; r.max = T.max; r.step = T.adim; r.value = durum.alan = T.var; $(".sh-birim", k).textContent = T.birim; $(".sh-kat-kutu", k).style.display = T.kat ? "" : "none"; alanYaz(); }
    function alanYaz() { rd.textContent = (+r.value).toLocaleString("tr-TR") + " " + (TURLER[durum.tur].birim.split(" ")[0]); durum.alan = +r.value; }
    t.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; durum.tur = b.dataset.t; $$("button", t).forEach(function (x) { x.classList.toggle("on", x === b); }); turAyarla(); });
    r.addEventListener("input", alanYaz); kat.addEventListener("input", function () { durum.kat = +kat.value; $(".sh-kat-yazi", k).textContent = kat.value + " kat"; });
    $$(".sh-zaman button", k).forEach(function (b) { b.onclick = function () { durum.zaman = b.textContent; $$(".sh-zaman button", k).forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    function goster() {
      $$(".sh-adim", k).forEach(function (a, i) { a.hidden = i !== adim - 1; });
      $(".sh-ilerleme i", k).style.width = (adim / TOP * 100) + "%"; $(".sh-sayac", k).textContent = adim + " / " + TOP;
      $(".sh-geri", k).style.visibility = adim > 1 && adim < TOP + 1 ? "visible" : "hidden";
      $(".sh-ileri", k).textContent = adim === TOP - 1 ? "Özeti gör →" : adim === TOP ? "✓ Talebi gönder" : "Devam →";
      if (adim === TOP) ozet();
    }
    function ozet() {
      var T = TURLER[durum.tur]; durum.il = $(".sh-il", k).value.trim() || "belirtilmedi";
      $(".sh-ozet", k).innerHTML = '<div class="sh-ozet-bas"><span>' + T.em + "</span><div><b>" + T.ad + "</b><small>" + (+durum.alan).toLocaleString("tr-TR") + " " + T.birim + (T.kat ? " · " + durum.kat + " kat" : "") + " · " + durum.il + " · başlangıç: " + durum.zaman + "</small></div></div>" +
        "<p><b>Önerilen sistem:</b></p><ul>" + T.sistem.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul>" +
        "<p class='sh-not'>Ön değerlendirme: projenizin statik, nakliye ve montaj planı Ete Beton yapı tasarım ofisi tarafından netleştirilir. Fiyat ve süre bilgisi teknik ekipten gelir.</p>";
    }
    $(".sh-ileri", k).onclick = function () {
      if (adim === 3 && !$(".sh-il", k).value.trim()) { $(".sh-il", k).focus(); return; }
      if (adim < TOP) { adim++; goster(); return; }
      var ad = $(".sh-ad", k).value.trim(), tel = $(".sh-tel", k).value.trim(), firma = $(".sh-firma", k).value.trim();
      if (!ad || !tel) { (!ad ? $(".sh-ad", k) : $(".sh-tel", k)).focus(); return; }
      var T = TURLER[durum.tur], talep = { id: Date.now(), tarih: new Date().toISOString(), ad: ad, firma: firma, tel: tel, tur: T.ad, alan: durum.alan, birim: T.birim, kat: T.kat ? durum.kat : null, il: durum.il, zaman: durum.zaman, kaynak: "Web · Proje Sihirbazı", asama: "yeni" };
      try { var l = JSON.parse(localStorage.getItem("ete-talepler") || "[]"); l.unshift(talep); localStorage.setItem("ete-talepler", JSON.stringify(l)); } catch (e) {}
      var msg = "Merhaba, web sitenizdeki Proje Sihirbazı'ndan ön teklif talebi:\n• Yapı: " + T.ad + "\n• Büyüklük: " + (+durum.alan).toLocaleString("tr-TR") + " " + T.birim + (T.kat ? " · " + durum.kat + " kat" : "") + "\n• Yer: " + durum.il + "\n• Başlangıç: " + durum.zaman + "\n• Ad: " + ad + (firma ? " (" + firma + ")" : "") + "\n• Telefon: " + tel;
      $(".sh-sonuc", k).innerHTML = '<div class="sh-tamam">✓ Talebiniz alındı. Teknik ekibimiz sizi arayacak.<br><a href="' + wa(msg) + '" target="_blank">WhatsApp\'tan da iletmek için dokunun →</a></div>';
      $(".sh-ileri", k).disabled = true;
    };
    $(".sh-geri", k).onclick = function () { if (adim > 1) { adim--; goster(); } };
    turAyarla(); goster();
  }

  // ---------- Teknik soru asistanı (taslak: hazır cevaplar; canlıda yapay zekâ) ----------
  var SSS = [
    ["Prekast çift duvar nedir?", "Fabrikada, bilgisayar kontrollü hatlarda üretilen iki ince betonarme kabuk ve aralarındaki kafes donatıdan oluşan duvar elemanıdır. Şantiyede yerine konur, arası beton ile doldurulur; böylece monolitik (yekpare) ve deprem dayanım performansı yüksek bir taşıyıcı sistem oluşur."],
    ["Hangi yapılarda kullanılıyor?", "Konut ve villa, okul, hastane, kamu ve banka binaları, ticari yapılar. Fabrika ve depolarda prefabrik kolon-kiriş sistemi; altyapıda beton/betonarme boru ve kutu menfez üretiyoruz."],
    ["Türkiye'nin her yerine teslim ediyor musunuz?", "Evet. Van'daki fabrikamızdan kendi nakliye organizasyonumuzla farklı illerdeki projelere sevkiyat yapıyoruz; Ankara'da da ofisimiz var. Projenizin yerini Proje Sihirbazı'nda belirtmeniz yeterli."],
    ["Teklif almak için ne gerekiyor?", "Mimari proje ya da en azından yapı tipi, yaklaşık inşaat alanı, kat sayısı ve şehir bilgisi yeterli. Proje Sihirbazı'nı 1 dakikada doldurabilirsiniz; yapı tasarım ofisimiz projeyi inceleyip size döner."],
    ["Klasik betonarmeye göre farkı ne?", "Elemanlar fabrikada kontrollü ortamda üretildiği için kalite standarttır, şantiyede kalıp ve iskele ihtiyacı azalır ve yapım süresi kısalır. Sistemi yerli ve yabancı üniversitelerdeki akademisyenlerle iş birliği içinde geliştirdik."],
    ["Teknik kataloglara nereden ulaşırım?", "Ürün, uygulama ve simülasyon kataloglarımız (Türkçe ve İngilizce) e-katalog sayfamızda: etebeton.com.tr/e-katalog"]
  ];
  function asistanKur() {
    var d = document.createElement("div"); d.className = "as";
    d.innerHTML = '<button class="as-dugme" aria-label="Teknik asistan">💬<span>Soru sor</span></button><div class="as-pencere" hidden><div class="as-bas"><b>Ete Beton Teknik Asistan</b><small>Yapay zekâ asistanı · demo</small><button class="as-kapat" aria-label="Kapat">×</button></div><div class="as-akis"><div class="as-m a">Merhaba 👋 Prekast sistemler, teslimat ya da teklif hakkında sorunuzu seçin veya yazın.</div></div><div class="as-hazir">' + SSS.map(function (s, i) { return '<button data-i="' + i + '">' + s[0] + "</button>"; }).join("") + '</div><form class="as-form"><input placeholder="Sorunuzu yazın…" maxlength="200"><button>➤</button></form></div>';
    document.body.appendChild(d);
    var p = $(".as-pencere", d), akis = $(".as-akis", d);
    var yaz = function (t, kim) { var m = document.createElement("div"); m.className = "as-m " + kim; m.textContent = t; akis.appendChild(m); akis.scrollTop = akis.scrollHeight; };
    $(".as-dugme", d).onclick = function () { p.hidden = !p.hidden; };
    $(".as-kapat", d).onclick = function () { p.hidden = true; };
    $(".as-hazir", d).onclick = function (e) { var b = e.target.closest("button"); if (!b) return; var s = SSS[+b.dataset.i]; yaz(s[0], "z"); setTimeout(function () { yaz(s[1], "a"); }, 450); };
    $(".as-form", d).onsubmit = function (e) {
      e.preventDefault(); var i = $("input", this), q = i.value.trim(); if (!q) return; yaz(q, "z"); i.value = "";
      var ql = q.toLocaleLowerCase("tr"), en = SSS.map(function (s) { var puan = 0; s[0].toLocaleLowerCase("tr").split(/\W+/).concat(s[1].toLocaleLowerCase("tr").split(/\W+/).slice(0, 25)).forEach(function (w) { if (w.length > 3 && ql.indexOf(w) >= 0) puan++; }); return puan; });
      var en_i = en.indexOf(Math.max.apply(null, en));
      setTimeout(function () { yaz(Math.max.apply(null, en) > 0 ? SSS[en_i][1] : "Bu konuda teknik ekibimiz size en doğru bilgiyi verir. WhatsApp'tan sorunuzu iletebilirsiniz.", "a"); }, 500);
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.dataset.wa || "Merhaba, projem için bilgi almak istiyorum."); a.target = "_blank"; });
    $$("[data-tel]").forEach(function (a) { a.href = "tel:" + F.tel; });
    $$("[data-link]").forEach(function (a) { a.href = F[a.dataset.link]; a.target = "_blank"; a.rel = "noopener"; });
    $$(".sh").forEach(sihirbazKur); $$(".hr").forEach(haritaKur); asistanKur();
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("gor"); io.unobserve(x.target); } }); }, { threshold: .1 }); $$(".bel").forEach(function (x) { io.observe(x); }); } else $$(".bel").forEach(function (x) { x.classList.add("gor"); });
    // Sayaçlar
    $$("[data-say]").forEach(function (el) { var hedef = +el.dataset.say, i = 0, s = setInterval(function () { i += Math.ceil(hedef / 40); if (i >= hedef) { i = hedef; clearInterval(s); } el.textContent = i.toLocaleString("tr-TR"); }, 30); });
  });
})();
