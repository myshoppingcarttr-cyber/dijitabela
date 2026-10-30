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
    tul:    { ad: "Tül perde",          birim: "m",  img: "tul",    pile: 3,   fiyat: [380, 620, 980],   not: "Tam, orta ya da az pile · ışığı yumuşatır", grup: "perde", seri: "Gana, Vista nakışlı, Nora, Nero, Verde, Side ve Didim 300 cm nakışlı, Alaçatı, Bergama" },
    fon:    { ad: "Fon perde",          birim: "m",  img: "kendi-fon-attiymon", pile: 2.5, fiyat: [520, 850, 1450],  not: "Kadife, keten, nakışlı · özel dikim", grup: "perde", seri: "Dolly, Pinna, Zeugma, Troya Rome, Nova, Vasko, Attiymon, İpek kadife, Gabon nakışlı" },
    stor:   { ad: "Stor perde",         birim: "m2", img: "stor",   fiyat: [950, 1350, 1900],  not: "Screen, simli, blackout stor", grup: "sistem", seri: "SC ve İbiza screen, PT Como, PS simli, Panama; blackout: PX, LX, YMX sedefli, XX süper" },
    zebra:  { ad: "Zebra perde",        birim: "m2", img: "zebra",  fiyat: [1150, 1550, 2250], not: "Gece-gündüz ayarı · bambu ve baskılı", grup: "sistem", seri: "Bambu, Eco bambu, Blackstar, Pırıltı, Hasır, Mikro pilse, dijital baskılı" },
    jaluzi: { ad: "Ahşap jaluzi",       birim: "m2", img: "jaluzi", fiyat: [2300, 3100, 4200], not: "25 / 50 mm · motorlu seçenek", grup: "sistem", seri: "25 ve 50 mm polywood, 50 mm blackout polywood, Truwood, ahşap; AJ metal jaluzi" },
    plicell:{ ad: "Plicell (cam balkon)",birim: "m2", img: "kendi-plicell",fiyat: [1500, 2050, 2900], not: "Cam balkon, çatı katı, kış bahçesi", grup: "sistem", seri: "Lucidum, Clover, Leafy, Moon, Windy, Dutch, Bright, Niteflite, Lattice" },
    dikey:  { ad: "Dikey perde",        birim: "m2", img: "dikey",  fiyat: [700, 950, 1300],   not: "Ofis, otel lobisi, geniş cam", grup: "sistem", seri: "Kumaş dikey 89 / 127 mm, PVC dikey, tül dikey" }
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
    s_modern:     { ad: "Modern minimal", ozet: "Tek hareketle ışığı yöneten koyu tonlar, sade tül, düz dokulu halı. Açıkken ferah, kapalıyken daha özel.", urun: ["Koyu Antrasit Silüet perde (yeni)", "PX Panama blackout stor", "Ambiance serisi halı"], renk: ["#3b3d40", "#cfcac2", "#f4f2ee"] },
    s_bohem:      { ad: "Bohem doğal", ozet: "Soft gold dokunuşlar, katmanlı tüller ve bohem sıcaklık; doğal dokulu keten tül ve ona eşlik eden özel fon.", urun: ["Keten tül + özel fon", "Katmanlı tül (soft gold)", "Sisal halı"], renk: ["#b7835a", "#d9c6a5", "#c9a35b"] },
    s_klasik:     { ad: "Klasik lüks", ozet: "Mekâna karakter katan kadife fonlar, nakışlı tül, zarafeti tamamlayan rustik kuşak ve püskül detayları.", urun: ["İpek kadife ya da Gabon nakışlı fon", "Vista / Side nakışlı tül", "Rustik kuşak ve aksesuar"], renk: ["#6d2e2e", "#c9a35b", "#efe4cf"] },
    s_iskandinav: { ad: "İskandinav ferah", ozet: "Bol ışık: soft dokulu beyaz tül, açık tonlu ahşap jaluzi, sade halı. Perde evin önüne geçmez, güzelliğini tamamlar.", urun: ["Soft dokulu beyaz tül", "Truwood / 50 mm polywood jaluzi", "Sade dokulu halı"], renk: ["#ffffff", "#d8c3a5", "#9aa5a8"] },
    s_akdeniz:    { ad: "Akdeniz sahil", ozet: "Kemer'e en çok yakışan: beyaz keten tül, cam balkonda yıkanabilir plicell; manzaradan ödün vermeden mahremiyet.", urun: ["Beyaz keten tül", "Plicell cam balkon (Leafy, Windy)", "Mavi-beyaz kırlent"], renk: ["#f7f5f0", "#2f6f8f", "#c7b89a"] }
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
    el.innerHTML = '<img src="' + IMG + 'sonra.jpg" alt="Sonra: aynı odaya tül, fon perde ve uyumlu mobilya"><div class="nv-os-once"><img src="' + IMG + 'once.jpg" alt="Önce: perdesiz pencere"></div><span class="nv-os-e a">ÖNCE</span><span class="nv-os-e b">SONRA</span><div class="nv-os-cizgi"><i></i></div><input type="range" min="0" max="100" value="50" aria-label="Önce ve sonra karşılaştırma">';
    var r = $("input", el), o = $(".nv-os-once", el), c = $(".nv-os-cizgi", el);
    var f = function () { o.style.clipPath = "inset(0 " + (100 - r.value) + "% 0 0)"; c.style.left = r.value + "%"; };
    r.oninput = f; f();
  }

  /* ---------- 4. Proje galerisi (filtreli) ---------- */
  /* Gerçek projeler: nvlhome.com "Perde projelerimiz" fotoğrafları + @nvlhomedesign gönderileri (Instagram'a bağlantı) */
  var PROJE = [
    { t: "konut", ad: "Kemer · salon projesi", img: "kendi-salon-genis", d: "Desenli fon + beyaz tül, korniş ve halıyla uyumlu salon" },
    { t: "konut", ad: "Kemer · fon detayı", img: "kendi-salon-fon", d: "Özel dikim desenli fon, yere zarif düşüş" },
    { t: "konut", ad: "Kemer · tül ve fon katmanı", img: "kendi-salon-tul", d: "Gündüz tül, akşam fon; tavandan yere" },
    { t: "ofis", ad: "Psikolog ofisi · oyun köşesi", img: "kendi-ofis-oyun", d: "Bej fon perde ile ayrılan sakin oyun alanı" },
    { t: "ofis", ad: "Psikolog ofisi · kuşak detayı", img: "kendi-ofis-kusak", d: "Rustik kuşakla toplanan fon" },
    { t: "balkon", ad: "Kumluca yayla evi · cam balkon", ig: "p/DbIN8YpjZXO", d: "Plicell: güneşi ve ısıyı azaltır, istenen bölüm açılır, kumaşı yıkanabilir" },
    { t: "konut", ad: "Mutfaktan salona · motorlu ahşap jaluzi", ig: "reel/Dck8Gl6t21K", d: "Kahve tonları, mermer dokular, özel dikim fon" },
    { t: "konut", ad: "Yıllardır aynı ailenin evi", ig: "reel/DbKflrNNcGF", d: "Soft gold dokunuşlar, katmanlı tüller, bohem sıcaklık" },
    { t: "konut", ad: "Salon · keten tül + özel fon", ig: "reel/DbTo-pCt9Ih", d: "Gün ışığını yumuşatan doğal dokulu keten" },
    { t: "konut", ad: "Lüks Home", ig: "reel/DbgaE-RN5Ue", d: "Kişiye özel proje, premium kumaş, kusursuz pile, profesyonel uygulama" },
    { t: "konut", ad: "Atölyeden evinize", ig: "reel/Dc1flo_NAFV", d: "Kadife fonlar ve zarafeti tamamlayan rustik detaylar" },
    { t: "konut", ad: "Koyu Antrasit Silüet", ig: "reel/DeomNb5Npcw", d: "Yeni nesil perde: tek hareketle ışık kontrolü" }
  ];
  function galeri(el) {
    el.classList.add("nv-gal");
    var ad = { hepsi: "Hepsi", konut: "Konut", ofis: "Ofis", balkon: "Cam balkon", villa: "Villa", otel: "Otel" }, f = ["hepsi"];
    PROJE.forEach(function (p) { if (f.indexOf(p.t) < 0) f.push(p.t); });
    el.innerHTML = '<div class="nv-filtre">' + f.map(function (x, i) { return '<button type="button" data-f="' + x + '"' + (i ? "" : ' class="on"') + ">" + ad[x] + "</button>"; }).join("") + '</div><div class="nv-gal-izg">' +
      PROJE.map(function (p) {
        if (p.ig) return '<figure data-t="' + p.t + '" class="nv-gal-ig"><a href="https://www.instagram.com/' + p.ig + '/" target="_blank" rel="noopener"><span class="nv-gal-igb">Instagram · @nvlhomedesign</span><b>' + p.ad + "</b><span>" + p.d + '</span><em>Gönderide izle →</em></a></figure>';
        return '<figure data-t="' + p.t + '"><img src="' + IMG + p.img + '.jpg" alt="' + p.ad + '" loading="lazy"><figcaption><b>' + p.ad + "</b><span>" + p.d + "</span></figcaption></figure>";
      }).join("") + '</div><small class="nv-dipnot">Fotoğraflar NVL Home\'un kendi sitesindeki "Perde projelerimiz" sayfalarından; diğer işler Instagram gönderilerine bağlanır. Yayında villa ve otel projeleri de eklenir.</small>';
    $$(".nv-filtre button", el).forEach(function (b) { b.onclick = function () { $$(".nv-filtre button", el).forEach(function (x) { x.classList.toggle("on", x === b); }); var v = b.getAttribute("data-f"); $$("figure", el).forEach(function (fg) { fg.style.display = v === "hepsi" || fg.getAttribute("data-t") === v ? "" : "none"; }); }; });
  }

  /* ---------- 5. Kumaş numune sepeti ---------- */
  /* Numune adları NVL Home kataloğundaki (nvlhome.com.tr) serilerden; renk kareleri temsilidir */
  var NUMUNE = [["Gana tül", "#f3efe6"], ["Vista nakışlı tül", "#faf8f3"], ["Nora tül", "#e9e4da"], ["Dolly fon", "#d9c7a8"], ["Zeugma fon", "#8b7d6b"], ["İpek kadife", "#6d2e2e"], ["Ultra BLC blackout", "#3f4347"], ["Koyu Antrasit Silüet", "#2f3134"], ["Plicell Leafy", "#9aa58a"], ["Sisal 1825 halı", "#c7a77a"]];
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
    [/balkon|plicell|pilsel|plise|çatı|cati/i, "Cam balkon, çatı katı ve kış bahçesi için plicell öneriyoruz: güneşi ve ısıyı azaltır, istediğiniz bölümü açıp kapatırsınız, kumaşı yıkanabilir. Balkonunuzun fotoğrafını gönderin, uygun sistemi birlikte planlayalım."],
    [/marka|kumaş|kumas|seri|model/i, "Rome Plus, Quba, Ahsen, Magia Fabrics, Ercan Tekstil, Norr, Arline ve Premier kumaşlarıyla çalışıyoruz; halıda Apex. Tülde Gana, Vista, Nora; fonda Dolly, Zeugma, Troya Rome gibi seriler var. Numuneleri ölçü günü getiririz."],
    [/halı|hali|kırlent|kirlent|yastık|çarşaf|carsaf|nevresim/i, "Perdeyle uyumlu halı ve kırlent de seçiyoruz. Lastikli çarşaf, yastık kılıfı ve oda kokusu nvlhome.com'da online satışta. Mağazamız Arslanbucak'ta, Cumhuriyet Bulvarı'nda."],
    [/dantel|kanaviçe|kanavice|çeyiz|ceyiz/i, "Anne yadigârı dantel ve kanaviçeleri bugünün evine uygun, kullanışlı ürünlere dönüştürüyoruz; çeyiz hazırlığında da yanınızdayız. Fotoğraflarını gönderirseniz fikir verelim."],
    [/adres|nerede|konum|mağaza/i, "Mağazamız: Arslanbucak Mah. Cumhuriyet Bulvarı No:111/B, Kemer / Antalya. Sabit hat: 0242 814 61 49."]
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
    /* Son gönderiler: açıklamalardan kısa özet + gönderiye bağlantı (ağır gömme yerine) */
    var L = [["reel/DbgaE-RN5Ue", "Lüks Home", "Kişiye özel proje, premium kumaş, kusursuz pile, profesyonel uygulama"], ["reel/DbKflrNNcGF", "Aynı ailenin evine yeniden", "Soft gold, katmanlı tüller, bohem sıcaklık"], ["p/DbIN8YpjZXO", "Kumluca · cam balkon plicell", "Dört mevsim kullanılan yayla evi balkonu"], ["reel/DbTo-pCt9Ih", "Keten tül + özel fon", "Gün ışığını yumuşatan doğal doku"], ["reel/Dc1flo_NAFV", "Atölyeden evinize", "Kadife fonlar ve rustik detaylar"], ["reel/DelhvFYtclS", "Halı serisi", "Modern çizgiler, sade şıklık"], ["p/DcWI8otNKRK", "Özel tasarım yatak örtüsü", "Ölçüye ve odanın karakterine göre"], ["reel/DeomNb5Npcw", "Koyu Antrasit Silüet", "Tek hareketle ışık kontrolü"]];
    var liste = h("div", { class: "nv-ig-liste", html: L.map(function (x) { return '<a href="https://www.instagram.com/' + x[0] + '/" target="_blank" rel="noopener"><b>' + x[1] + "</b><span>" + x[2] + "</span></a>"; }).join("") });
    el.parentNode.insertBefore(liste, el.nextSibling);
  }

  /* ---------- 11. Ürün kataloğu (WhatsApp'tan sor) ---------- */
  function katalog(el) {
    /* Kategoriler ve seri adları NVL Home'un kendi sitelerinden (nvlhome.com.tr katalog, nvlhome.com mağaza) */
    var GRUP = { hepsi: "Hepsi", perde: "Tül ve fon", sistem: "Stor · zebra · jaluzi · plicell", ev: "Halı ve ev tekstili" };
    var K = Object.keys(URUN).map(function (k) { var u = URUN[k]; return { g: u.grup, img: u.img, ad: u.ad, not: u.not, seri: u.seri, em: (u.birim === "m" ? "metresi " : "m²'si ") + tl(u.fiyat[0]) + "'den (örnek)", a: wa(u.ad + " hakkında bilgi ve numune istiyorum."), d: "Sor" }; });
    K.splice(2, 0, { g: "perde", img: "fon", ad: "Blackout perde", not: "Tam karartma · otel ve yatak odası", seri: "Ultra BLC, Night BLC, Duo Velvet, Linen blackout, Nord Dark", em: "Fiyat için sorun", a: wa("Blackout perde hakkında bilgi istiyorum."), d: "Sor" });
    K.push({ g: "ev", img: "hali", ad: "Halı ve kilim", not: "Salon, çocuk odası, mutfak, banyo, yolluk; dokuma kilim", seri: "Sisal 1822-1826, Ambiance serisi", em: "Mağazada", a: wa("Halı modelleri hakkında bilgi istiyorum."), d: "Sor" },
      { g: "ev", img: "kirlent", ad: "Yastık kılıfı ve lastikli çarşaf", not: "Kendi üretimimiz · ücretsiz kargo", seri: "Turkuaz Rüya, Kum Tanesi, Zarif Nağme, Nehir Esintisi; 14 renk lastikli çarşaf", em: "nvlhome.com'da 90 TL'den", a: "https://www.nvlhome.com", d: "Mağaza", dis: 1 },
      { g: "ev", img: "kendi-oda-parfumu", ad: "NVL Home oda parfümü", not: "Kendi markamız", seri: "Aqua Marine", em: "nvlhome.com'da 400 TL", a: "https://www.nvlhome.com/oda-kokusu", d: "Mağaza", dis: 1 },
      { g: "ev", img: "ceyiz", ad: "Çeyiz ve dantel dönüşümü", not: "Anne yadigârı dantel ve kanaviçe, kullanışlı ürüne", seri: "Nevresim, pike, uyku seti, yorgan, kırlent", em: "Kişiye özel", a: wa("Çeyiz hazırlığı ve dantel dönüşümü hakkında bilgi istiyorum."), d: "Sor" });
    el.classList.add("nv-katk");
    el.innerHTML = '<div class="nv-kat-ust"><div class="nv-filtre">' + Object.keys(GRUP).map(function (g, i) { return '<button type="button" data-g="' + g + '"' + (i ? "" : ' class="on"') + ">" + GRUP[g] + "</button>"; }).join("") + '</div><input type="search" class="nv-kat-ara" placeholder="Model ara: Gana, Leafy, Sisal…" aria-label="Katalogda ara"></div><div class="nv-kat">' +
      K.map(function (u) { return '<article data-g="' + u.g + '" data-ara="' + (u.ad + " " + u.not + " " + u.seri).toLocaleLowerCase("tr") + '"><img src="' + IMG + u.img + '.jpg" alt="' + u.ad + '" loading="lazy"><div><b>' + u.ad + "</b><span>" + u.not + '</span><small class="nv-seri">' + u.seri + "</small><em>" + u.em + '</em></div><a class="nv-btn nv-ince" target="_blank" rel="noopener" href="' + u.a + '">' + u.d + "</a></article>"; }).join("") + '</div><p class="nv-kat-yok" hidden>Bu aramayla eşleşen model yok. WhatsApp\'tan sorun, kataloğumuzda 500\'den fazla model var.</p>';
    var aktif = "hepsi", ara = $(".nv-kat-ara", el);
    function suz() { var q = ara.value.trim().toLocaleLowerCase("tr"), n = 0; $$("article", el).forEach(function (a) { var ok = (aktif === "hepsi" || a.getAttribute("data-g") === aktif) && (!q || a.getAttribute("data-ara").indexOf(q) > -1); a.style.display = ok ? "" : "none"; if (ok) n++; }); $(".nv-kat-yok", el).hidden = n > 0; }
    $$(".nv-filtre button", el).forEach(function (b) { b.onclick = function () { aktif = b.getAttribute("data-g"); $$(".nv-filtre button", el).forEach(function (x) { x.classList.toggle("on", x === b); }); suz(); }; });
    ara.addEventListener("input", suz);
  }

  /* ---------- 12. Kampanya bandı (NVL Home'un kendi sitelerindeki kampanyalar) ---------- */
  function kampanya(el) {
    var M = ["Online mağazada ilk üyelikte %20 indirim kuponu", "Katalog perdelerinde %30 indirim", "Kemer ve köylerine ücretsiz keşif", "Fotoğraf gönderin, ücretsiz ön değerlendirme", "nvlhome.com'da ücretsiz kargo"];
    el.classList.add("nv-kamp");
    el.innerHTML = '<div class="nv-kamp-ic"><span>' + M.concat(M).join("</span><span>") + "</span></div>";
    el.setAttribute("aria-label", "Kampanyalar: " + M.join(", "));
  }

  /* ---------- 13. Sık sorulanlar (bilgiler NVL Home sitesi ve Instagram açıklamalarından) ---------- */
  var SSS = [
    ["Ölçüye gelir misiniz, ücretli mi?", "Kemer ve köylerinde keşif ve ölçü ücretsiz. Evinize gelip ölçüyü alıyor, kumaşları yerinde birlikte seçiyoruz."],
    ["Gelmeden fikir alabilir miyim?", "Evet. Pencerenin ya da odanın fotoğrafını WhatsApp'tan gönderin; size uygun perde için ücretsiz ön değerlendirme yapalım."],
    ["Cam balkon ve çatı katı için ne önerirsiniz?", "Plicell (pilsel) sistemi: güneşi ve ısıyı önemli ölçüde azaltır, istediğiniz bölümü açıp kapatırsınız, kumaşı yıkanabilir ve çabuk deforme olmaz. Manzaradan ödün vermeden mahremiyet sağlar."],
    ["Hangi kumaş markalarıyla çalışıyorsunuz?", "Rome Plus, Quba, Ahsen, Magia Fabrics, Ercan Tekstil, Norr, Arline ve Premier; halıda Apex. Kataloğumuzda tül, fon, blackout, stor, zebra ve plicell olmak üzere 500'den fazla model var."],
    ["Tülde pile oranını nasıl seçeceğim?", "Tam, orta ve az pile seçenekleri var. Pile sıklığından yere düşüşüne kadar her detayı mekânın bütünlüğüne göre birlikte belirliyoruz."],
    ["Annemin dantellerini ne yapabilirsiniz?", "Anne yadigârı dantel ve kanaviçeleri bugünün modasına uygun, kullanışlı ürünlere dönüştürüyoruz. Çeyiz hazırlığında da nevresimden perdeye yanınızdayız."],
    ["Online alışveriş yapabilir miyim?", "Yastık kılıfı, lastikli çarşaf ve oda kokusu nvlhome.com'da satışta: iyzico ya da havale ile ödeme, mağazadan teslim ya da kargo. NVL Home'u Trendyol, Hepsiburada ve n11'de de bulabilirsiniz."]
  ];
  function sss(el) {
    el.classList.add("nv-sss");
    el.innerHTML = SSS.map(function (s, i) { return "<details" + (i ? "" : " open") + "><summary>" + s[0] + "</summary><p>" + s[1] + "</p></details>"; }).join("") + '<a class="nv-btn nv-ince" target="_blank" rel="noopener" href="' + wa("Sitede cevabını bulamadığım bir sorum var:") + '">Başka sorunuz mu var? WhatsApp</a>';
  }

  var MOTOR = { kampanya: kampanya, sss: sss, olcu: olcuSihirbazi, stil: stilTesti, onceSonra: onceSonra, galeri: galeri, numune: numune, takip: takip, proje: projeTeklif, asistan: asistan, yorum: yorumlar, instagram: instagram, katalog: katalog };
  function baslat() { $$("[data-nv]").forEach(function (el) { var f = MOTOR[el.getAttribute("data-nv")]; if (f && !el.__nv) { el.__nv = 1; try { f(el); } catch (e) { console.error(e); } } }); $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
