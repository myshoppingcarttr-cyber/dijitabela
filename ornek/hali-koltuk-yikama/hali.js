/* G-37 · Halı + koltuk yıkama ortak araç motoru (yeni dosya). Bağımlılık yok.
   3 araç: [data-hali="olcu"] fiyat · [data-hali="randevu"] servis alma randevusu · [data-hali="takip"] aşama takibi.
   Fiyatlar ÖRNEKTİR (kurgusal işletme); gerçek fiyatı işletme belirler. Hiçbir şey gönderilmez: WhatsApp yalnız kullanıcı düğmesiyle açılır. */
(function () {
  var WA = "905019452184";
  var FIYAT = { // TL / m²  (örnek)
    makine: { ad: "Makine halısı", m2: 120 },
    el: { ad: "El dokuma", m2: 190 },
    yun: { ad: "Yün / ipek", m2: 220 },
    shaggy: { ad: "Shaggy / uzun tüylü", m2: 240 }
  };
  var KOLTUK = [ // [anahtar, ad, TL]
    ["k3", "3'lü koltuk", 700], ["k2", "2'li koltuk", 500], ["k1", "Tekli koltuk / berjer", 350],
    ["yt", "Tek kişilik yatak", 400], ["yc", "Çift kişilik yatak", 600]
  ];
  var MIN_M2 = 1, SERVIS = 150, SERVIS_UCRETSIZ = 800;
  var SAATLER = ["09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00", "18:00 – 21:00"];
  var ASAMA = [
    { k: "alindi", ad: "Teslim alındı", ac: "Evinizden alındı, etiketlendi ve fotoğraflandı." },
    { k: "yikaniyor", ad: "Yıkanıyor", ac: "Leke ön işlemi ve yıkama sürüyor." },
    { k: "kuruyor", ad: "Kuruyor", ac: "Kurutma ve tarama aşamasında." },
    { k: "yolda", ad: "Yolda", ac: "Kurye teslim için yola çıktı." },
    { k: "teslim", ad: "Teslim edildi", ac: "Adresinize bırakıldı." }
  ];
  var DEMO = { "HK-1041": { asama: 2, ne: "2 halı (8,4 m²) + 1 koltuk takımı", mah: "Kepez" }, "HK-1042": { asama: 1, ne: "1 el dokuma halı (6,0 m²)", mah: "Konyaaltı" }, "HK-1043": { asama: 3, ne: "Çift kişilik yatak + 2'li koltuk", mah: "Muratpaşa" } };
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var tl = function (n) { return n.toLocaleString("tr-TR") + " TL"; };
  var m2f = function (n) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
  var yuvarla = function (n) { return Math.round(n / 5) * 5; };
  var durum = { son: null, tutar: 0, ozet: "", kod: null, gun: null, saat: null };
  function aç(metin) { window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(metin), "_blank", "noopener"); }
  function waOnizle(kap, metin) {
    var o = $(".wa-onizleme", kap); if (!o) { o = document.createElement("div"); o.className = "wa-onizleme"; kap.appendChild(o); }
    o.innerHTML = '<b>WhatsApp mesajı (gönderilmeden önizleme)</b><pre></pre><button type="button" class="dg">WhatsApp\'ta aç</button>';
    $("pre", o).textContent = metin;
    $("button", o).onclick = function () { aç(metin); };
    return o;
  }

  /* ---------- 1) Ölçü → fiyat ---------- */
  function olcu(k) {
    k.innerHTML =
      '<div class="ol-mod" role="group" aria-label="Ne yıkatacaksınız">' +
      '<button type="button" class="cip on" data-m="hali">Halı</button><button type="button" class="cip on" data-m="koltuk">Koltuk &amp; yatak</button></div>' +
      '<div class="ol-hali"><div class="ol-satirlar"></div><button type="button" class="ol-ekle ikincil">+ Halı ekle</button></div>' +
      '<div class="ol-koltuk"><div class="ol-kgrid"></div></div>' +
      '<div class="ol-sonuc" aria-live="polite"></div>' +
      '<div class="ol-alt"><button type="button" class="ol-randevu dg">Bu listeyle randevu al</button><button type="button" class="ol-wa dg i">Listeyi WhatsApp\'a yaz</button></div>' +
      '<p class="ol-not">Örnek fiyatlardır; halının durumu ve lekesine göre kesin fiyatı işletme teslim alırken söyler. Her halı en az ' + MIN_M2 + ' m² sayılır.</p>';
    var sat = $(".ol-satirlar", k), kg = $(".ol-kgrid", k);
    function satirEkle(en, boy, adet, tur) {
      var d = document.createElement("div"); d.className = "ol-sat";
      d.innerHTML = '<label>En (cm)<input class="ol-en" type="number" inputmode="numeric" min="30" max="1000" value="' + en + '"></label>' +
        '<label>Boy (cm)<input class="ol-boy" type="number" inputmode="numeric" min="30" max="1500" value="' + boy + '"></label>' +
        '<label>Adet<input class="ol-adet" type="number" inputmode="numeric" min="1" max="20" value="' + adet + '"></label>' +
        '<label>Tür<select class="ol-tur">' + Object.keys(FIYAT).map(function (t) { return '<option value="' + t + '"' + (t === tur ? " selected" : "") + ">" + FIYAT[t].ad + "</option>"; }).join("") + "</select></label>" +
        '<button type="button" class="ol-sil" aria-label="Bu halıyı sil">×</button>';
      sat.appendChild(d);
    }
    satirEkle(200, 300, 1, "makine");
    kg.innerHTML = KOLTUK.map(function (r) {
      return '<div class="ol-k" data-k="' + r[0] + '"><span>' + r[1] + '</span><div class="say"><button type="button" class="eksi" aria-label="Azalt">−</button><output>0</output><button type="button" class="arti" aria-label="Artır">+</button></div></div>';
    }).join("");
    function hesapla() {
      var mod = {}; $$(".ol-mod .cip", k).forEach(function (b) { mod[b.dataset.m] = b.classList.contains("on"); });
      $(".ol-hali", k).style.display = mod.hali ? "" : "none"; $(".ol-koltuk", k).style.display = mod.koltuk ? "" : "none";
      var satirlar = [], toplam = 0, ozet = [], m2top = 0, haliAdet = 0;
      if (mod.hali) $$(".ol-sat", k).forEach(function (s) {
        var en = +$(".ol-en", s).value, boy = +$(".ol-boy", s).value, ad = Math.max(1, Math.min(20, Math.round(+$(".ol-adet", s).value || 1))), tur = $(".ol-tur", s).value;
        if (!(en >= 30 && boy >= 30)) return;
        var m2 = Math.max(MIN_M2, en * boy / 10000), tut = yuvarla(m2 * FIYAT[tur].m2 * ad);
        satirlar.push([FIYAT[tur].ad + " · " + en + "×" + boy + " cm × " + ad + " adet (" + m2f(m2 * ad) + " m²)", tut]); toplam += tut; m2top += m2 * ad; haliAdet += ad;
        ozet.push(ad + " " + FIYAT[tur].ad.toLowerCase() + " " + en + "×" + boy + " cm");
      });
      if (mod.koltuk) $$(".ol-k", k).forEach(function (e) {
        var n = +$("output", e).textContent, r = KOLTUK.filter(function (x) { return x[0] === e.dataset.k; })[0];
        if (n > 0) { var t = n * r[2]; satirlar.push([n + " × " + r[1], t]); toplam += t; ozet.push(n + " " + r[1].toLowerCase()); }
      });
      var servis = toplam === 0 ? 0 : (toplam >= SERVIS_UCRETSIZ ? 0 : SERVIS), hepsi = toplam + servis;
      var h = "";
      if (!satirlar.length) h = '<p class="bos">Ölçü girin ya da koltuk/yatak adedi seçin; fiyat anında çıkar.</p>';
      else {
        h = "<ul>" + satirlar.map(function (s) { return "<li><span>" + s[0] + "</span><b>" + tl(s[1]) + "</b></li>"; }).join("") + "</ul>";
        h += '<div class="ol-srv"><span>Alma &amp; teslim</span><b>' + (servis ? tl(servis) : "Ücretsiz") + "</b></div>";
        if (servis) h += '<p class="ipucu">' + tl(SERVIS_UCRETSIZ) + " ve üzeri siparişte alma-teslim ücretsiz.</p>";
        h += '<div class="ol-top"><span>Toplam (örnek)</span><b class="ol-tutar">' + tl(hepsi) + "</b></div>";
        if (m2top) h += '<p class="ipucu">Toplam halı alanı ' + m2f(m2top) + " m².</p>";
      }
      $(".ol-sonuc", k).innerHTML = h;
      durum.tutar = hepsi; durum.ozet = ozet.join(", "); durum.son = satirlar;
      $(".ol-randevu", k).disabled = $(".ol-wa", k).disabled = !satirlar.length;
      document.dispatchEvent(new CustomEvent("hali:olcu", { detail: durum }));
    }
    k.addEventListener("input", hesapla); k.addEventListener("change", hesapla);
    k.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.classList.contains("ol-ekle")) { satirEkle(120, 180, 1, "makine"); hesapla(); }
      else if (t.classList.contains("ol-sil")) { if ($$(".ol-sat", k).length > 1) t.closest(".ol-sat").remove(); hesapla(); }
      else if (t.closest(".ol-mod")) { t.classList.toggle("on"); if (!$$(".ol-mod .on", k).length) t.classList.add("on"); hesapla(); }
      else if (t.classList.contains("arti") || t.classList.contains("eksi")) { var o = $("output", t.closest(".ol-k")); o.textContent = Math.max(0, Math.min(9, +o.textContent + (t.classList.contains("arti") ? 1 : -1))); hesapla(); }
      else if (t.classList.contains("ol-randevu")) { document.dispatchEvent(new CustomEvent("hali:randevuya")); }
      else if (t.classList.contains("ol-wa")) { waOnizle(k, "Merhaba, yıkama için fiyat listesi çıkardım:\n" + durum.son.map(function (s) { return "• " + s[0] + ": " + tl(s[1]); }).join("\n") + "\nToplam (örnek): " + tl(durum.tutar) + "\nUygun bir servis saati var mı?"); }
    });
    hesapla();
  }

  /* ---------- 2) Servis alma randevusu ---------- */
  function randevu(k) {
    var gunler = [], b = new Date(); b.setHours(0, 0, 0, 0);
    for (var i = 1; gunler.length < 7; i++) { var d = new Date(b); d.setDate(b.getDate() + i); if (d.getDay() !== 0) gunler.push(d); }
    var GUN = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    k.innerHTML =
      '<div class="rv-ozet-kutu"><span>Siparişiniz</span><b class="rv-siparis">Henüz liste yok · yukarıdan fiyat hesaplayın (isteğe bağlı)</b></div>' +
      '<fieldset><legend>1 · Gün seçin</legend><div class="rv-gun">' + gunler.map(function (d, i) {
        return '<button type="button" class="cip" data-i="' + i + '"><small>' + GUN[d.getDay()] + "</small><b>" + d.getDate() + "." + (d.getMonth() + 1) + "</b></button>";
      }).join("") + "</div></fieldset>" +
      '<fieldset><legend>2 · Saat aralığı</legend><div class="rv-saat">' + SAATLER.map(function (s, i) { return '<button type="button" class="cip" data-s="' + i + '">' + s + "</button>"; }).join("") + "</div></fieldset>" +
      '<fieldset><legend>3 · Bilgiler</legend><div class="rv-form"><label>Ad soyad<input class="rv-ad" autocomplete="name"></label>' +
      '<label>Telefon<input class="rv-tel" type="tel" inputmode="tel" placeholder="05XX XXX XX XX" autocomplete="tel"></label>' +
      '<label>Mahalle / ilçe<select class="rv-mah"><option value="">Seçin</option><option>Kepez</option><option>Muratpaşa</option><option>Konyaaltı</option><option>Döşemealtı</option><option>Aksu</option></select></label>' +
      '<label>Adres tarifi<input class="rv-adres" placeholder="Mahalle, sokak, kapı no"></label></div>' +
      '<label class="kv"><input type="checkbox" class="kv-onay"> <span>Kişisel verilerimin (ad, telefon, adres) servis planı için işlenmesini kabul ediyorum. <a href="#kvkk" class="kv-ac">Aydınlatma özeti</a></span></label>' +
      '<div class="kv-metin" hidden>Adınız, telefonunuz ve adresiniz yalnız halı/koltuk alma-teslim randevusunu planlamak için kullanılır. WhatsApp ile iletişimde mesajlar WhatsApp\'ın altyapısından geçer. Verinizin silinmesini istemek için bize yazabilirsiniz.</div></fieldset>' +
      '<button type="button" class="rv-gonder dg">Randevu talebini hazırla</button><div class="rv-ozet" aria-live="polite"></div>';
    function dolu(g, s) { return (g * 3 + s * 2) % 5 === 0; } // örnek doluluk (sabit)
    function doluIsle() {
      $$(".rv-saat .cip", k).forEach(function (b) { var s = +b.dataset.s, bs = durum.gun !== null && dolu(durum.gun, s); b.classList.toggle("dolu", bs); b.disabled = bs; if (bs && durum.saat === s) { durum.saat = null; b.classList.remove("on"); } });
    }
    document.addEventListener("hali:olcu", function (e) { $(".rv-siparis", k).textContent = e.detail.ozet ? e.detail.ozet + " · " + tl(e.detail.tutar) + " (örnek)" : "Henüz liste yok · yukarıdan fiyat hesaplayın (isteğe bağlı)"; });
    if (durum.ozet) $(".rv-siparis", k).textContent = durum.ozet + " · " + tl(durum.tutar) + " (örnek)";
    k.addEventListener("click", function (e) {
      var t = e.target.closest("button, a"); if (!t) return;
      if (t.classList.contains("kv-ac")) { e.preventDefault(); var m = $(".kv-metin", k); m.hidden = !m.hidden; return; }
      if (t.closest(".rv-gun")) { $$(".rv-gun .cip", k).forEach(function (x) { x.classList.remove("on"); }); t.classList.add("on"); durum.gun = +t.dataset.i; doluIsle(); }
      else if (t.closest(".rv-saat") && !t.disabled) { $$(".rv-saat .cip", k).forEach(function (x) { x.classList.remove("on"); }); t.classList.add("on"); durum.saat = +t.dataset.s; }
      else if (t.classList.contains("rv-gonder")) {
        var ad = $(".rv-ad", k).value.trim(), tel = $(".rv-tel", k).value.replace(/\D/g, ""), mah = $(".rv-mah", k).value, adres = $(".rv-adres", k).value.trim(), oz = $(".rv-ozet", k), hata = [];
        if (durum.gun === null) hata.push("gün"); if (durum.saat === null) hata.push("saat aralığı"); if (!ad) hata.push("ad soyad");
        if (!/^0?5\d{9}$/.test(tel)) hata.push("geçerli telefon"); if (!mah) hata.push("mahalle/ilçe");
        if (hata.length) { oz.className = "rv-ozet hata"; oz.textContent = "Eksik: " + hata.join(", ") + "."; return; }
        if (!$(".kv-onay", k).checked) { oz.className = "rv-ozet hata"; oz.textContent = "Devam etmek için kişisel veri onayını işaretleyin."; return; }
        var d = gunler[durum.gun], gs = GUN[d.getDay()] + " " + d.getDate() + "." + (d.getMonth() + 1);
        var kod = "HK-" + (1050 + Math.floor(Math.random() * 40)); durum.kod = kod;
        DEMO[kod] = { asama: 0, ne: durum.ozet || "Listeyi alma sırasında birlikte yazacağız", mah: mah };
        var metin = "Merhaba, servis alma randevusu istiyorum.\n" + gs + ", " + SAATLER[durum.saat] + "\n" + ad + " · " + mah + (adres ? " · " + adres : "") +
          "\nİçerik: " + (durum.ozet || "yerinde belirlenecek") + (durum.tutar ? "\nÖrnek toplam: " + tl(durum.tutar) : "") + "\nKVKK: aydınlatma okundu, onay verildi.\nTakip kodu (demo): " + kod;
        oz.className = "rv-ozet ok"; oz.innerHTML = "<b>Talep hazır (demo).</b> " + gs + " · " + SAATLER[durum.saat] + ". Takip kodunuz: <b class=\"rv-kod\">" + kod + "</b>"; waOnizle(oz, metin);
        var tk = $(".tk-kod"); if (tk) tk.value = kod;
        document.dispatchEvent(new CustomEvent("hali:randevu", { detail: { kod: kod } }));
      }
    });
    doluIsle();
  }

  /* ---------- 3) Aşama takibi ---------- */
  function takip(k) {
    k.innerHTML =
      '<div class="tk-ara-kap"><label>Takip kodu<input class="tk-kod" placeholder="HK-1041" autocapitalize="characters" autocomplete="off"></label><button type="button" class="tk-ara dg">Sorgula</button></div>' +
      '<div class="tk-ornek">Demo kodlar: ' + Object.keys(DEMO).slice(0, 3).map(function (c) { return '<button type="button" class="cip" data-c="' + c + '">' + c + "</button>"; }).join("") + "</div>" +
      '<div class="tk-sonuc" aria-live="polite"></div>';
    var simdi = new Date();
    function saatYaz(g, s, d) { var x = new Date(simdi); x.setDate(x.getDate() - g); x.setHours(s, d, 0, 0); return x.getDate() + "." + (x.getMonth() + 1) + " " + String(s).padStart(2, "0") + ":" + String(d).padStart(2, "0"); }
    function goster(kod) {
      var kay = DEMO[(kod || "").trim().toUpperCase()], s = $(".tk-sonuc", k);
      if (!kay) { s.innerHTML = '<p class="tk-yok">Bu kodla kayıt bulunamadı. Kodu SMS/WhatsApp mesajınızdan kontrol edin ya da bize yazın.</p>'; return; }
      var kodU = kod.trim().toUpperCase(); k.dataset.aktif = kodU;
      var zaman = [saatYaz(2, 14, 20), saatYaz(1, 9, 40), saatYaz(1, 16, 5), saatYaz(0, 8, 30), saatYaz(0, 12, 0)];
      s.innerHTML = '<div class="tk-baslik"><b>' + kodU + "</b><span>" + kay.ne + " · " + kay.mah + "</span></div>" +
        '<ol class="tk-adim">' + ASAMA.map(function (a, i) {
          var c = i < kay.asama ? "bitti" : (i === kay.asama ? "simdi" : "bekler");
          return '<li class="' + c + '"><i></i><div><b>' + a.ad + "</b><small>" + (i <= kay.asama ? zaman[i] + " · " + a.ac : "Sıradaki aşama") + "</small></div></li>";
        }).join("") + "</ol>" +
        '<p class="tk-durum">Şu an: <b class="tk-simdi">' + ASAMA[kay.asama].ad + "</b></p>" +
        (kay.asama < 4 ? '<button type="button" class="tk-ilerle ikincil">Demo: bir sonraki aşamaya geçir</button>' : '<p class="ipucu">Teslim tamamlandı.</p>') +
        '<p class="ipucu">Bu ekran demodur; gerçek sistemde aşamayı işletme günceller, müşteriye bildirim gider.</p>';
    }
    k.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.classList.contains("tk-ara")) goster($(".tk-kod", k).value);
      else if (t.dataset.c) { $(".tk-kod", k).value = t.dataset.c; goster(t.dataset.c); }
      else if (t.classList.contains("tk-ilerle")) { var kay = DEMO[k.dataset.aktif]; if (kay && kay.asama < 4) { kay.asama++; goster(k.dataset.aktif); } }
    });
    $(".tk-kod", k).addEventListener("keydown", function (e) { if (e.key === "Enter") goster(this.value); });
    document.addEventListener("hali:randevu", function (e) { $$(".tk-ornek", k).forEach(function (o) { if (!$('[data-c="' + e.detail.kod + '"]', o)) o.insertAdjacentHTML("beforeend", '<button type="button" class="cip" data-c="' + e.detail.kod + '">' + e.detail.kod + " (yeni)</button>"); }); });
  }

  window.HALI = { WA: WA, tl: tl, durum: durum };
  document.addEventListener("DOMContentLoaded", function () {
    $$("[data-hali]").forEach(function (k) { ({ olcu: olcu, randevu: randevu, takip: takip })[k.dataset.hali](k); });
    $$("[data-wa]").forEach(function (a) { a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  });
})();
