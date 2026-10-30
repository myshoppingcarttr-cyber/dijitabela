/* NVL Home prototipi · ortak çalışan özellikler (Dijitabela, 30 Eki 2026)
   Her tasarım aynı motoru kullanır; görünüm tasarımın kendi CSS'inden gelir.
   Fiyatlar ÖRNEKTİR: yayında NVL Home kendi fiyatlarını yönetim panelinden girer. */
(function () {
  "use strict";
  var WA = "905019452184"; // demo: mesajlar şimdilik Dijitabela'ya gelir; yayında NVL Home hattına bağlanır
  var IMG = (document.documentElement.getAttribute("data-img") || "../img/");
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var tl = function (n) { return Math.round(n / 10) * 10 >= 1000 ? (Math.round(n / 10) * 10).toLocaleString("tr-TR") + " TL" : Math.round(n) + " TL"; };
  var wa = function (metin) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent("[NVL Home demo] " + metin); };
  var h = function (tag, attr, ic) { var e = document.createElement(tag); for (var k in (attr || {})) { if (k === "html") e.innerHTML = attr[k]; else e.setAttribute(k, attr[k]); } (ic || []).forEach(function (c) { e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); }); return e; };

  /* ---------- Ürün verisi (örnek fiyatlar, KDV dahil) ---------- */
  var URUN = {
    tul:    { ad: "Tül perde",          birim: "m",  img: "tul",    pile: 3,   fiyat: [380, 620, 980],   not: "Pile 1:3 · ışığı yumuşatır" },
    fon:    { ad: "Fon perde",          birim: "m",  img: "fon",    pile: 2.5, fiyat: [520, 850, 1450],  not: "Pile 1:2,5 · kadife, keten, blackout" },
    stor:   { ad: "Stor perde",         birim: "m2", img: "stor",   fiyat: [950, 1350, 1900],  not: "Mutfak, banyo, çocuk odası" },
    zebra:  { ad: "Zebra perde",        birim: "m2", img: "zebra",  fiyat: [1150, 1550, 2250], not: "Gece-gündüz ayarı" },
    jaluzi: { ad: "Ahşap jaluzi",       birim: "m2", img: "jaluzi", fiyat: [2300, 3100, 4200], not: "25 / 50 mm · motorlu seçenek" },
    plicell:{ ad: "Plicell (cam balkon)",birim: "m2", img: "plicell",fiyat: [1500, 2050, 2900], not: "Cam balkon ve çatı katı" },
    dikey:  { ad: "Dikey perde",        birim: "m2", img: "dikey",  fiyat: [700, 950, 1300],   not: "Ofis, otel lobisi, geniş cam" }
  };
  var SINIF = ["Ekonomik", "Standart", "Premium"];
  var BOLGE = ["Kemer merkez", "Arslanbucak", "Göynük", "Beldibi", "Çamyuva", "Kiriş", "Tekirova", "Konyaaltı / Antalya"];

  /* ---------- 1. Ölçü ve fiyat sihirbazı ---------- */
  function olcuSihirbazi(el) {
    var pencereler = [{ oda: "Salon", urun: "tul", en: 320, boy: 260, sinif: 1 }, { oda: "Salon", urun: "fon", en: 320, boy: 260, sinif: 1 }];
    el.classList.add("nv-sih");
    el.innerHTML = '<div class="nv-sih-ust"><b>Pencerelerinizi ekleyin</b><span>Ölçüyü kabaca girin; kesin ölçüyü ustamız yerinde alır.</span></div><div class="nv-pen"></div>' +
      '<button type="button" class="nv-btn nv-ince nv-ekle">+ Pencere ekle</button>' +
      '<div class="nv-sonuc"><div class="nv-sonuc-sol"><small>Tahmini toplam (montaj dahil, örnek fiyat)</small><strong class="nv-toplam">–</strong><div class="nv-kalem"></div></div>' +
      '<div class="nv-sonuc-sag"><label>Bölge<select class="nv-bolge">' + BOLGE.map(function (b) { return "<option>" + b + "</option>"; }).join("") + '</select></label>' +
      '<label>Ölçü günü<input type="date" class="nv-tarih"></label><a class="nv-btn nv-gonder" target="_blank" rel="noopener">Ücretsiz ölçü randevusu iste</a><small class="nv-dipnot">Mesaj tüm pencere ölçüleriyle WhatsApp\'a hazır gider.</small></div></div>';
    var d = new Date(); d.setDate(d.getDate() + 2); $(".nv-tarih", el).value = d.toISOString().slice(0, 10);
    function ciz() {
      var kap = $(".nv-pen", el); kap.innerHTML = "";
      pencereler.forEach(function (p, i) {
        var u = URUN[p.urun];
        var satir = h("div", { class: "nv-pen-satir", html:
          '<img src="' + IMG + u.img + '.jpg" alt="' + u.ad + '" loading="lazy">' +
          '<label>Oda<select data-k="oda">' + ["Salon", "Yatak odası", "Çocuk odası", "Mutfak", "Banyo", "Cam balkon", "Ofis", "Otel odası"].map(function (o) { return "<option" + (o === p.oda ? " selected" : "") + ">" + o + "</option>"; }).join("") + "</select></label>" +
          '<label>Ürün<select data-k="urun">' + Object.keys(URUN).map(function (k) { return '<option value="' + k + '"' + (k === p.urun ? " selected" : "") + ">" + URUN[k].ad + "</option>"; }).join("") + "</select></label>" +
          '<label>En (cm)<input type="number" min="40" max="2000" step="5" data-k="en" value="' + p.en + '"></label>' +
          '<label>Boy (cm)<input type="number" min="40" max="600" step="5" data-k="boy" value="' + p.boy + '"></label>' +
          '<label>Kumaş<select data-k="sinif">' + SINIF.map(function (s, j) { return '<option value="' + j + '"' + (j == p.sinif ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></label>" +
          '<button type="button" class="nv-sil" aria-label="Pencereyi sil">×</button>' });
        $$("[data-k]", satir).forEach(function (inp) { inp.addEventListener("input", function () { var k = inp.getAttribute("data-k"); p[k] = k === "en" || k === "boy" || k === "sinif" ? +inp.value : inp.value; if (k === "urun") ciz(); else hesapla(); }); });
        $(".nv-sil", satir).onclick = function () { if (pencereler.length > 1) { pencereler.splice(i, 1); ciz(); } };
        kap.appendChild(satir);
      });
      hesapla();
    }
    function hesapla() {
      var top = 0, sat = [];
      pencereler.forEach(function (p) {
        var u = URUN[p.urun], f = u.fiyat[p.sinif], tutar, acik;
        if (u.birim === "m") { var m = Math.max(1, p.en / 100) * u.pile; tutar = m * f + (p.en / 100) * 290; acik = (Math.round(m * 10) / 10) + " m kumaş (pile " + u.pile + ") + ray"; }
        else { var m2 = Math.max(1, (p.en * p.boy) / 10000); tutar = m2 * f; acik = (Math.round(m2 * 100) / 100) + " m²"; }
        top += tutar; sat.push({ t: p.oda + " · " + u.ad, a: acik, f: tutar });
      });
      var bolge = $(".nv-bolge", el).value, montaj = bolge === "Konyaaltı / Antalya" ? 750 : 0;
      top += montaj;
      $(".nv-toplam", el).textContent = tl(top * 0.92) + " – " + tl(top * 1.08);
      $(".nv-kalem", el).innerHTML = sat.map(function (s) { return "<div><span>" + s.t + " <em>" + s.a + "</em></span><b>" + tl(s.f) + "</b></div>"; }).join("") + "<div><span>Montaj <em>" + (montaj ? "Antalya merkez ek ücret" : "Kemer ve köyleri ücretsiz") + "</em></span><b>" + (montaj ? tl(montaj) : "0 TL") + "</b></div>";
      var msg = "Merhaba Nevale Hanım, ücretsiz ölçü randevusu istiyorum.\nBölge: " + bolge + "\nTercih edilen gün: " + $(".nv-tarih", el).value + "\n" + pencereler.map(function (p, i) { return (i + 1) + ") " + p.oda + " · " + URUN[p.urun].ad + " · " + p.en + "×" + p.boy + " cm · " + SINIF[p.sinif]; }).join("\n") + "\nSitedeki tahmin: " + $(".nv-toplam", el).textContent;
      $(".nv-gonder", el).href = wa(msg);
    }
    $(".nv-ekle", el).onclick = function () { pencereler.push({ oda: "Yatak odası", urun: "stor", en: 160, boy: 200, sinif: 1 }); ciz(); };
    $(".nv-bolge", el).onchange = hesapla; $(".nv-tarih", el).onchange = hesapla;
    ciz();
  }

  /* ---------- 2. Stil testi + oda fotoğrafı ---------- */
  var STIL = {
    s_modern:     { ad: "Modern minimal", ozet: "Dalga pileli gri fon + beyaz tül, tavan rayı, siyah detay. Halıda düz doku.", urun: ["Dalga pile fon", "Keten görünümlü tül", "Antrasit zebra"], renk: ["#4a4d52", "#cfcac2", "#f4f2ee"] },
    s_bohem:      { ad: "Bohem doğal", ozet: "Keten tül, rattan ve jüt. Toprak tonlu kırlentler, saçaklı halı.", urun: ["Keten tül", "Jüt halı", "Toprak tonlu kırlent seti"], renk: ["#b7835a", "#d9c6a5", "#7f8a63"] },
    s_klasik:     { ad: "Klasik lüks", ozet: "Kadife ya da damask fon, saçak ve kuşak, nakışlı tül, altın korniş.", urun: ["Kadife fon", "Nakışlı tül", "Altın korniş ve aksesuar"], renk: ["#6d2e2e", "#c9a35b", "#efe4cf"] },
    s_iskandinav: { ad: "İskandinav ferah", ozet: "Bol ışık: beyaz tül, açık meşe ahşap jaluzi, yün dokulu halı.", urun: ["Beyaz düz tül", "Açık meşe jaluzi", "Yün dokulu halı"], renk: ["#ffffff", "#d8c3a5", "#9aa5a8"] },
    s_akdeniz:    { ad: "Akdeniz sahil", ozet: "Kemer'e en çok yakışan: beyaz keten, mavi aksan, cam balkonda plicell.", urun: ["Beyaz keten tül", "Plicell cam balkon", "Mavi-beyaz kırlent"], renk: ["#f7f5f0", "#2f6f8f", "#c7b89a"] }
  };
  var SORU = [
    { s: "Evinizde en çok hangi his olsun?", c: [["Sade ve düzenli", { s_modern: 2, s_iskandinav: 1 }], ["Sıcak ve doğal", { s_bohem: 2, s_akdeniz: 1 }], ["Gösterişli ve şık", { s_klasik: 3 }], ["Ferah, deniz havası", { s_akdeniz: 2, s_iskandinav: 1 }]] },
    { s: "Hangi renk paleti size yakın?", c: [["Gri, siyah, beyaz", { s_modern: 2 }], ["Toprak, hardal, yeşil", { s_bohem: 2 }], ["Bordo, altın, krem", { s_klasik: 2 }], ["Beyaz, mavi, kum", { s_akdeniz: 2, s_iskandinav: 1 }]] },
    { s: "Güneş ve ışık konusunda ne istersiniz?", c: [["Tam karartma", { s_modern: 1, s_klasik: 1 }], ["Yumuşak, süzülen ışık", { s_iskandinav: 2, s_akdeniz: 1 }], ["Gündüz ışık, gece mahremiyet", { s_modern: 1, s_bohem: 1 }]] },
    { s: "Kumaşta hangisine dokunmak istersiniz?", c: [["Keten", { s_akdeniz: 2, s_bohem: 1 }], ["Kadife", { s_klasik: 2 }], ["Pamuklu düz doku", { s_iskandinav: 2 }], ["Teknik / blackout", { s_modern: 2 }]] }
  ];
  function stilTesti(el) {
    var i = 0, puan = {}, foto = null;
    el.classList.add("nv-stil");
    function soru() {
      var q = SORU[i];
      el.innerHTML = '<div class="nv-stil-ilerle"><span style="width:' + (i / SORU.length * 100) + '%"></span></div><small class="nv-stil-no">Soru ' + (i + 1) + " / " + SORU.length + "</small><h4>" + q.s + '</h4><div class="nv-stil-cev"></div>';
      q.c.forEach(function (c) { var b = h("button", { type: "button", class: "nv-sec" }, [c[0]]); b.onclick = function () { for (var k in c[1]) puan[k] = (puan[k] || 0) + c[1][k]; i++; i < SORU.length ? soru() : sonuc(); }; $(".nv-stil-cev", el).appendChild(b); });
    }
    function sonuc() {
      var en = Object.keys(STIL).sort(function (a, b) { return (puan[b] || 0) - (puan[a] || 0); })[0], s = STIL[en];
      el.innerHTML = '<div class="nv-stil-son"><div class="nv-stil-gor"><img src="' + IMG + en + '.jpg" alt="' + s.ad + '"><span class="nv-rozet">Sizin tarzınız</span></div><div><small>Sonuç</small><h4>' + s.ad + "</h4><p>" + s.ozet + '</p><div class="nv-palet">' + s.renk.map(function (r) { return '<i style="background:' + r + '"></i>'; }).join("") + "</div><ul>" + s.urun.map(function (u) { return "<li>" + u + "</li>"; }).join("") + "</ul>" +
        '<div class="nv-foto"><label class="nv-btn nv-ince">Odanızın fotoğrafını ekleyin<input type="file" accept="image/*" hidden></label><div class="nv-foto-on"></div></div>' +
        '<a class="nv-btn" target="_blank" rel="noopener" href="' + wa("Stil testimin sonucu: " + s.ad + ". Bu tarzda perde ve halı önerisi almak istiyorum.") + '">Bu tarzla öneri iste</a> <button type="button" class="nv-btn nv-ince nv-tekrar">Testi yeniden çöz</button></div></div>';
      $(".nv-tekrar", el).onclick = function () { i = 0; puan = {}; soru(); };
      $("input[type=file]", el).onchange = function (e) {
        var f = e.target.files[0]; if (!f) return; var r = new FileReader();
        r.onload = function () { $(".nv-foto-on", el).innerHTML = '<div class="nv-foto-kart"><img src="' + r.result + '" alt="Odanız"><div><b>Fotoğraf eklendi</b><span>Nevale Hanım bu fotoğrafa göre ' + s.ad.toLowerCase() + ' tarzında 2 kombin hazırlar. Fotoğraf yalnız sizin cihazınızda; göndermek istediğinizde WhatsApp\'tan eklersiniz.</span></div></div>'; };
        r.readAsDataURL(f);
      };
    }
    soru();
  }

  /* ---------- 3. Önce / sonra ---------- */
  function onceSonra(el) {
    el.classList.add("nv-os");
    el.innerHTML = '<img src="' + IMG + 'sonra.jpg" alt="Sonra: tül ve fon perde uygulanmış salon"><div class="nv-os-once"><img src="' + IMG + 'once.jpg" alt="Önce: perdesiz pencere"></div><span class="nv-os-e a">ÖNCE</span><span class="nv-os-e b">SONRA</span><div class="nv-os-cizgi"><i></i></div><input type="range" min="0" max="100" value="50" aria-label="Önce ve sonra karşılaştırma">';
    var r = $("input", el), o = $(".nv-os-once", el), c = $(".nv-os-cizgi", el);
    var f = function () { o.style.clipPath = "inset(0 " + (100 - r.value) + "% 0 0)"; c.style.left = r.value + "%"; };
    r.oninput = f; f();
  }

  /* ---------- 4. Proje galerisi (filtreli) ---------- */
  var PROJE = [
    { t: "villa", ad: "Göynük villa · salon", img: "hero1", d: "Keten tül + taupe kadife fon, tavan rayı, 4 cephe" },
    { t: "otel", ad: "Kemer otel odaları", img: "otel", d: "Blackout + tül, 48 oda, 12 günde montaj" },
    { t: "konut", ad: "Arslanbucak daire", img: "hero3", d: "Çift katlı perde, gri blackout" },
    { t: "konut", ad: "Çatı katı plicell", img: "plicell", d: "Eğimli cam için ölçüye özel plicell" },
    { t: "ofis", ad: "Psikolog ofisi", img: "dikey", d: "Mahremiyet için dikey + tül" },
    { t: "villa", ad: "Tekirova villa · mutfak", img: "stor", d: "Keten stor, nem dayanımlı kumaş" },
    { t: "otel", ad: "Butik otel lobisi", img: "hero2", d: "Kadife fon, motorlu ahşap jaluzi" },
    { t: "konut", ad: "Beldibi yatak odası", img: "zebra", d: "Zebra + kırlent ve halı uyumu" }
  ];
  function galeri(el) {
    el.classList.add("nv-gal");
    var f = ["hepsi", "villa", "otel", "konut", "ofis"], ad = { hepsi: "Hepsi", villa: "Villa", otel: "Otel", konut: "Konut", ofis: "Ofis" };
    el.innerHTML = '<div class="nv-filtre">' + f.map(function (x, i) { return '<button type="button" data-f="' + x + '"' + (i ? "" : ' class="on"') + ">" + ad[x] + "</button>"; }).join("") + '</div><div class="nv-gal-izg">' +
      PROJE.map(function (p) { return '<figure data-t="' + p.t + '"><img src="' + IMG + p.img + '.jpg" alt="' + p.ad + '" loading="lazy"><figcaption><b>' + p.ad + "</b><span>" + p.d + "</span></figcaption></figure>"; }).join("") + '</div><small class="nv-dipnot">Örnek görsel ve proje metinleri. Yayında NVL Home\'un kendi projeleri ve fotoğrafları girilir.</small>';
    $$(".nv-filtre button", el).forEach(function (b) { b.onclick = function () { $$(".nv-filtre button", el).forEach(function (x) { x.classList.toggle("on", x === b); }); var v = b.getAttribute("data-f"); $$("figure", el).forEach(function (fg) { fg.style.display = v === "hepsi" || fg.getAttribute("data-t") === v ? "" : "none"; }); }; });
  }

  /* ---------- 5. Kumaş numune sepeti ---------- */
  var NUMUNE = [["Keten Ivory", "#efe9dd"], ["Kum Bej", "#d9c7a8"], ["Taupe Kadife", "#8b7d6b"], ["Antrasit Silüet", "#3b3d40"], ["Adaçayı", "#9aa58a"], ["Gece Mavisi", "#26364a"], ["Bordo Damask", "#6d2e2e"], ["Şampanya", "#e3cfa6"], ["Kırık Beyaz Tül", "#faf8f3"], ["Hardal", "#c7963b"]];
  function numune(el) {
    var sec = [];
    el.classList.add("nv-num");
    el.innerHTML = '<div class="nv-num-izg">' + NUMUNE.map(function (n, i) { return '<button type="button" data-i="' + i + '"><i style="background:' + n[1] + '"></i><span>' + n[0] + "</span></button>"; }).join("") + '</div><div class="nv-num-alt"><span class="nv-num-say">0 / 5 numune seçildi</span><a class="nv-btn" target="_blank" rel="noopener">Numuneleri evime getirin</a></div>';
    function guncelle() { $(".nv-num-say", el).textContent = sec.length + " / 5 numune seçildi"; $(".nv-num-alt a", el).href = wa("Şu kumaş numunelerini evimde görmek istiyorum: " + (sec.length ? sec.map(function (i) { return NUMUNE[i][0]; }).join(", ") : "(henüz seçmedim)")); }
    $$(".nv-num-izg button", el).forEach(function (b) { b.onclick = function () { var i = +b.getAttribute("data-i"), k = sec.indexOf(i); if (k > -1) sec.splice(k, 1); else if (sec.length < 5) sec.push(i); b.classList.toggle("on", sec.indexOf(i) > -1); guncelle(); }; });
    guncelle();
  }

  /* ---------- 6. Sipariş / montaj takibi ---------- */
  var TAKIP = {
    "NVL-2611": { ad: "Ayşe K. · Göynük", adim: 2, urun: "Salon tül + fon, 2 yatak odası zebra", tarih: "Montaj: 6 Kasım Perşembe, 10:00-12:00" },
    "NVL-2598": { ad: "Mehmet Y. · Beldibi villa", adim: 3, urun: "6 pencere ahşap jaluzi (motorlu)", tarih: "Montaj ekibi yarın 09:30'da yolda" },
    "NVL-2577": { ad: "Otel Sahil · Kemer", adim: 4, urun: "48 oda blackout + tül", tarih: "Teslim edildi · 28 Ekim" }
  };
  var ADIM = ["Ölçü alındı", "Kumaş siparişte", "Dikimde", "Montaj planlandı", "Teslim edildi"];
  function takip(el) {
    el.classList.add("nv-tak");
    el.innerHTML = '<form class="nv-tak-form"><input placeholder="Sipariş kodunuz (ör. NVL-2611)" value="NVL-2611" aria-label="Sipariş kodu"><button class="nv-btn">Sorgula</button></form><div class="nv-tak-son"></div><small class="nv-dipnot">Denemek için: NVL-2611 · NVL-2598 · NVL-2577</small>';
    var f = $("form", el);
    f.onsubmit = function (e) {
      e.preventDefault(); var k = $("input", f).value.trim().toUpperCase(), t = TAKIP[k], s = $(".nv-tak-son", el);
      if (!t) { s.innerHTML = '<p class="nv-uyari">Bu kodla sipariş bulunamadı. Kodunuz ölçü sonrası WhatsApp\'tan gelen mesajda yazar.</p>'; return; }
      s.innerHTML = "<div class=\"nv-tak-kart\"><b>" + k + " · " + t.ad + "</b><span>" + t.urun + '</span><ol class="nv-adim">' + ADIM.map(function (a, i) { return '<li class="' + (i < t.adim ? "bitti" : i === t.adim ? "simdi" : "") + '">' + a + "</li>"; }).join("") + '</ol><p class="nv-tak-tarih">' + t.tarih + "</p></div>";
    };
    f.onsubmit(new Event("submit"));
  }

  /* ---------- 7. Otel / villa proje teklifi ---------- */
  function projeTeklif(el) {
    el.classList.add("nv-prj");
    el.innerHTML = '<div class="nv-prj-izg"><label>Proje türü<select name="tur"><option>Otel</option><option>Villa</option><option>Site / rezidans</option><option>Ofis</option><option>Restoran / kafe</option></select></label>' +
      '<label>Oda / pencere sayısı<input type="number" name="adet" value="24" min="1"></label><label>Ürünler<select name="urun"><option>Blackout + tül</option><option>Stor / zebra</option><option>Ahşap jaluzi</option><option>Karışık (keşifte belirlenir)</option></select></label>' +
      '<label>Bitiş tarihi<input type="date" name="tarih"></label><label>Mimar / firma adı<input name="firma" placeholder="İsteğe bağlı"></label><label>Konum<input name="konum" value="Kemer"></label></div>' +
      '<div class="nv-prj-alt"><p class="nv-prj-oz"></p><a class="nv-btn" target="_blank" rel="noopener">Keşif ve proje teklifi iste</a></div>';
    var d = new Date(); d.setDate(d.getDate() + 30); $("[name=tarih]", el).value = d.toISOString().slice(0, 10);
    function g() {
      var v = function (n) { return $("[name=" + n + "]", el).value; }, adet = +v("adet") || 1, gun = Math.max(7, Math.ceil(adet / 6) + 6);
      $(".nv-prj-oz", el).innerHTML = "<b>" + adet + " oda/pencere</b> için tahmini üretim + montaj süresi: <b>" + gun + "-" + (gun + 5) + " gün</b>. Keşif ücretsiz; numune paneli ve oda başı fiyat tablosu 48 saatte hazırlanır.";
      $(".nv-prj-alt a", el).href = wa("Proje teklifi talebi\nTür: " + v("tur") + "\nAdet: " + adet + "\nÜrün: " + v("urun") + "\nBitiş: " + v("tarih") + "\nKonum: " + v("konum") + (v("firma") ? "\nFirma: " + v("firma") : ""));
    }
    $$("input,select", el).forEach(function (x) { x.addEventListener("input", g); }); g();
  }

  /* ---------- 8. WhatsApp yapay zekâ asistanı (demo sohbet) ---------- */
  var CEVAP = [
    [/fiyat|kaç|ne kadar|ücret/i, "Perde fiyatı ölçüye ve kumaşa göre değişir. Örnek: 3 m genişliğinde salon tülü standart kumaşla yaklaşık 6.500-7.500 TL. Sitedeki ölçü sihirbazına pencerelerinizi girerseniz tahmini toplamı hemen görürsünüz; kesin fiyatı ölçüden sonra Nevale Hanım verir."],
    [/ölçü|olcu|gel|randevu|ev/i, "Kemer, Göynük, Beldibi, Çamyuva ve Tekirova'ya ölçü ücretsiz. Yarın 10:00 ya da 14:00 uygun mu? Adresinizi yazarsanız randevuyu not ediyorum."],
    [/ne zaman|kaç gün|hazır|teslim|süre/i, "Stor ve zebra genelde 5-7 iş günü, dikim isteyen tül ve fon 7-10 iş günü. Siparişinizin kodu varsa yazın, durumunu söyleyeyim."],
    [/otel|villa|proje|toplu/i, "Otel ve villa projelerinde ücretsiz keşif yapıyoruz; oda başı fiyat tablosu ve numune paneli 48 saatte hazır. Kaç oda ya da pencere var?"],
    [/halı|hali|kırlent|kirlent|yastık/i, "Perdeyle uyumlu halı ve kırlent de seçiyoruz. Mağazamız Arslanbucak'ta, Cumhuriyet Caddesi'nde; uğrarsanız numunelerle birlikte bakarız."],
    [/adres|nerede|konum|mağaza/i, "Mağazamız: Arslanbucak Mah. Cumhuriyet Cad. No:111, Kemer. Pazartesi-Cumartesi açığız."]
  ];
  function asistan(el) {
    el.classList.add("nv-ai");
    el.innerHTML = '<div class="nv-ai-bas"><i></i><div><b>NVL Home asistanı</b><small>7/24 · genelde hemen cevap verir</small></div></div><div class="nv-ai-akis"></div><div class="nv-ai-hizli"></div><form class="nv-ai-form"><input placeholder="Sorunuzu yazın…" aria-label="Mesaj"><button class="nv-btn">Gönder</button></form>';
    var akis = $(".nv-ai-akis", el);
    function bal(m, kim) { var b = h("div", { class: "nv-bal " + kim }, [m]); akis.appendChild(b); akis.scrollTop = akis.scrollHeight; }
    function sor(m) { bal(m, "ben"); var c = CEVAP.filter(function (x) { return x[0].test(m); })[0]; var yaz = h("div", { class: "nv-bal o nv-yaziyor" }, ["yazıyor…"]); akis.appendChild(yaz); setTimeout(function () { yaz.remove(); bal(c ? c[1] : "Not aldım; Nevale Hanım mesai içinde size dönecek. Bu arada ölçü sihirbazından pencerelerinizi girerseniz tahmini fiyatı hemen görürsünüz.", "o"); }, 700); }
    bal("Merhaba, NVL Home'a hoş geldiniz. Perde, ölçü randevusu ya da siparişiniz hakkında sorabilirsiniz.", "o");
    ["Salon tülü ne kadar?", "Ölçüye gelir misiniz?", "Siparişim ne zaman hazır?", "Otel projesi"].forEach(function (q) { var b = h("button", { type: "button" }, [q]); b.onclick = function () { sor(q); }; $(".nv-ai-hizli", el).appendChild(b); });
    $("form", el).onsubmit = function (e) { e.preventDefault(); var i = $("input", el); if (i.value.trim()) { sor(i.value.trim()); i.value = ""; } };
  }

  /* ---------- 9. Google yorumları + yorum isteme ---------- */
  function yorumlar(el) {
    el.classList.add("nv-yor");
    el.innerHTML = '<div class="nv-yor-ust"><strong>5,0</strong><span class="nv-yildiz">★★★★★</span><small>Google\'da 13 yorum · Kemer</small></div>' +
      '<div class="nv-yor-izg"><blockquote>“Kaliteli ürünleri uygun fiyata bulabileceğiniz Kemer\'deki en iyi yer.”<cite>Sevim S. · Google</cite></blockquote>' +
      '<blockquote>“Stor perdelerimi ve halılarımı çok kısa sürede teslim ettiler.”<cite>Asiye Y. · Google</cite></blockquote></div>' +
      '<div class="nv-yor-iste"><b>Montajdan sonra otomatik yorum isteği</b><span>Teslimden 2 gün sonra müşteriye kısa bir teşekkür mesajı ve tek dokunuşla Google yorum bağlantısı gider.</span><button type="button" class="nv-btn nv-ince">Mesaj örneğini gör</button><p class="nv-yor-msj" hidden>“Merhaba Ayşe Hanım, perdeleriniz yerine oturdu mu? Memnun kaldıysanız Google\'da iki cümle yazmanız bizim için çok değerli: [Google yorum bağlantınız] 🙏 Nevale”</p></div>';
    $(".nv-yor-iste button", el).onclick = function () { var p = $(".nv-yor-msj", el); p.hidden = !p.hidden; };
  }

  /* ---------- 10. Instagram vitrini (resmî gömme) ---------- */
  function instagram(el) {
    var k = ["Dc4BW21DbOi", "Dck8Gl6t21K", "DeomNb5Npcw"];
    el.classList.add("nv-ig");
    el.innerHTML = k.map(function (c) { return '<div class="nv-ig-k"><iframe src="https://www.instagram.com/p/' + c + '/embed" loading="lazy" title="NVL Home Instagram gönderisi" allowtransparency="true" scrolling="no"></iframe></div>'; }).join("");
  }

  /* ---------- 11. Ürün kataloğu (WhatsApp'tan sor) ---------- */
  function katalog(el) {
    el.classList.add("nv-kat");
    el.innerHTML = Object.keys(URUN).map(function (k) { var u = URUN[k]; return '<article><img src="' + IMG + u.img + '.jpg" alt="' + u.ad + '" loading="lazy"><div><b>' + u.ad + "</b><span>" + u.not + "</span><em>" + (u.birim === "m" ? "metresi " : "m²'si ") + tl(u.fiyat[0]) + "'den</em></div><a class=\"nv-btn nv-ince\" target=\"_blank\" rel=\"noopener\" href=\"" + wa(u.ad + " hakkında bilgi ve numune istiyorum.") + "\">Sor</a></article>"; }).join("") +
      '<article><img src="' + IMG + 'hali.jpg" alt="Halı" loading="lazy"><div><b>Halı ve kilim</b><span>Perdeyle uyumlu seçim</span><em>Mağazada</em></div><a class="nv-btn nv-ince" target="_blank" rel="noopener" href="' + wa("Halı modelleri hakkında bilgi istiyorum.") + '">Sor</a></article>' +
      '<article><img src="' + IMG + 'kirlent.jpg" alt="Kırlent" loading="lazy"><div><b>Kırlent ve ev tekstili</b><span>Kendi üretimimiz</span><em>Online mağazada</em></div><a class="nv-btn nv-ince" href="https://www.nvlhome.com" target="_blank" rel="noopener">Mağaza</a></article>';
  }

  var MOTOR = { olcu: olcuSihirbazi, stil: stilTesti, onceSonra: onceSonra, galeri: galeri, numune: numune, takip: takip, proje: projeTeklif, asistan: asistan, yorum: yorumlar, instagram: instagram, katalog: katalog };
  function baslat() { $$("[data-nv]").forEach(function (el) { var f = MOTOR[el.getAttribute("data-nv")]; if (f && !el.__nv) { el.__nv = 1; try { f(el); } catch (e) { console.error(e); } } }); $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
