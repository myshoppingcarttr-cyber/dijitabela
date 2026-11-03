// ===== Satın al (satin-al.html, 31 Eki 2026): sabit fiyatlı ürün kartları + sipariş formu =====
// Fiyat burada YALNIZ gösterim içindir; tutar sunucuda (supabase/functions/siparis-olustur KATALOG) hesaplanır.
// İki liste aynı olmalı: _build/satin-al-kontrol.js canlı fonksiyonla karşılaştırır.
(function () {
  "use strict";
  var A = window.AJANS, KDV = 0.2;
  var URUNLER = [
    { kod: "google-vitrin", kat: "Google İşletme", ad: "Google Vitrin", tek: 2490, oran: 0.5, sure: "48 saatte teslim",
      madde: ["Sahiplik ve erişim kontrolü", "Doğru kategoriler ve anahtar kelimeli açıklama", "Çalışma saatleri, telefon, web ve WhatsApp bağlantısı", "10–15 fotoğraf (düzenlenmiş, yüklemeden önce onayınıza)", "Bütün yorumlara cevap", "Ürün ve hizmet listesi", "Baskıya hazır QR yorum kartı", "Önce / sonra raporu + 30 günlük 3 öneri"] },
    { kod: "google-vitrin-bakim", kat: "Google İşletme", ad: "Google Vitrin aylık bakım", tek: 990, aylik: true, oran: 1, sure: "Aylık · istediğiniz zaman bırakın",
      madde: ["Yorumlara 24 saat içinde cevap", "Haftalık Google gönderisi", "Ayda 4 yeni fotoğraf", "Aylık rapor"] },
    { kod: "google-profil-kurulum", kat: "Google İşletme", ad: "Google İşletme Profili açma / doğrulama / kurtarma", tek: 2500, oran: 0.5, sure: "1 iş günü + Google doğrulama süresi",
      madde: ["Profil açma ya da mevcut kaydı Google'ın resmi yoluyla sahiplenme", "Doğrulama adımlarında (video, telefon, posta) yol gösterme", "“Kalıcı olarak kapandı” görünen profili kurtarma başvurusu", "Kategori, saatler, hizmet bölgesi, web ve WhatsApp bağlantısı"] },
    { kod: "dijital-ekspertiz", kat: "Google İşletme", ad: "Detaylı dijital ekspertiz raporu", tek: 1900, oran: 1, sure: "1 iş günü",
      madde: ["Google profili ve web sitesinin eksikleri", "Çevrenizdeki rakiplerle karşılaştırma", "Öncelik sırasıyla 10 adımlık yol haritası"] },
    { kod: "tek-sayfa-site", kat: "Web sitesi", ad: "Tek sayfalık web sitesi", tek: 3900, oran: 0.5, sure: "2 iş günü",
      madde: ["Mobil uyumlu tek sayfa (kampanya, uzman, lansman)", "Arama ve WhatsApp düğmesi", "Temel SEO ayarları", "İşletmenize özel prototip, onayınızla yayın"] },
    { kod: "kurumsal-site", kat: "Web sitesi", ad: "Kurumsal web sitesi · giriş paketi", tek: 9900, oran: 0.5, sure: "Yaklaşık 1 hafta",
      madde: ["Özel tasarım", "Mobil uyum", "SEO altyapısı", "Alan adı + 1 yıl barındırma"] },
    { kod: "site-duzeltme", kat: "Web sitesi", ad: "Web sitesi hata ve hız düzeltme", tek: 1500, oran: 1, sure: "1 iş günü",
      madde: ["Kırık bağlantılar ve hatalar", "Hız ve mobil uyum sorunları", "Güvenlik güncellemesi", "Önce / sonra raporu"] },
    { kod: "site-bakim", kat: "Web sitesi", ad: "Web sitesi aylık bakım", tek: 990, aylik: true, oran: 1, sure: "Aylık · istediğiniz zaman bırakın",
      madde: ["Güncelleme ve yedek", "Hız ve hata kontrolü", "Küçük içerik değişiklikleri"] },
    { kod: "sosyal-tasarim-5", kat: "Sosyal medya", ad: "5 adet sosyal medya gönderi tasarımı", tek: 750, oran: 1, sure: "2 iş günü",
      madde: ["İşletmenize özel 5 Instagram gönderisi", "Post, carousel ya da story", "Paylaşıma hazır dosyalar"] },
    { kod: "sosyal-yonetim", kat: "Sosyal medya", ad: "Sosyal medya yönetimi · giriş", tek: 9900, aylik: true, oran: 1, sure: "Aylık · istediğiniz zaman bırakın",
      madde: ["Aylık içerik planı", "Tasarım ve paylaşım", "Aylık rapor"] }
  ];
  window.SATIN_AL_URUNLER = URUNLER;

  // ===== v2 gösterim katmanı (yalnız görünüm; sipariş mantığına dokunmaz) =====
  var V2 = (function () {
    var e = function (a, b) { return '<span class="' + a + '">' + b + "</span>"; };
    var chk = function (ad, ok) { return '<div class="v2r"><span>' + ad + "</span>" + e("v2c " + (ok ? "v2ok" : "v2no"), ok ? "✓" : "✗") + "</div>"; };
    var S = {};
    S["google-vitrin"] = '<div class="v2-iki"><div><b class="v2e">ÖNCE</b>' + chk("Saatler", 0) + chk("Fotoğraf", 0) + chk("Yorum cevabı", 0) + chk("QR kart", 0) + '</div><div class="v2s"><b class="v2e s">SONRA</b>' + chk("Saatler", 1) + chk("Fotoğraf", 1) + chk("Yorum cevabı", 1) + chk("QR kart", 1) + "</div></div>";
    S["google-vitrin-bakim"] = '<div class="v2-hafta">' + [1, 2, 3, 4].map(function (n) { return "<div><b>" + n + ". HAFTA</b><i>Gönderi</i>" + (n === 1 || n === 3 ? "<i>Fotoğraf</i>" : "<i>Yorum cevabı</i>") + "</div>"; }).join("") + '</div><div class="v2-not">Ay sonunda rapor</div>';
    S["google-profil-kurulum"] = '<div class="v2-adim"><i>1<em>Durum</em></i><i>2<em>Resmi yol</em></i><i>3<em>Doğrulama</em></i><i>4<em>Bilgiler</em></i></div><div class="v2-not">Video, telefon ya da posta ile doğrulama</div>';
    S["dijital-ekspertiz"] = '<div class="v2-halka"><div class="v2h" style="--p:58"><b>58</b></div><div class="v2b"><p>Google<u style="width:72%"></u></p><p>Web sitesi<u class="k" style="width:35%"></u></p><p>Rakipler<u style="width:55%"></u></p></div></div><div class="v2-not">Örnek rapor özeti</div>';
    S["tek-sayfa-site"] = '<div class="v2-tel"><div class="w1"></div><div class="w2"><i></i><b></b></div><div class="w3"><i></i><i></i><i></i></div><div class="w4">Ara · WhatsApp</div></div>';
    S["kurumsal-site"] = '<div class="v2-kur"><div class="nv"><i></i><i></i><i></i><i></i><i></i></div><div class="hr"></div><div class="ik"><i></i><i></i></div><div class="ft"></div></div><div class="v2-not">Anasayfa · Hizmetler · Hakkımızda · İletişim</div>';
    S["site-duzeltme"] = '<div class="v2-iki"><div><b class="v2e">ÖNCE</b><div class="v2g">74</div></div><div class="v2s"><b class="v2e s">SONRA</b><div class="v2g ok">94</div></div></div><div class="v2-not">Mobil hız puanı · örnek ölçüm</div>';
    S["site-bakim"] = '<div class="v2-liste">' + chk("Güncelleme", 1) + chk("Yedek", 1) + chk("Hız ve hata kontrolü", 1) + chk("Küçük içerik değişikliği", 1) + "</div>";
    S["sosyal-tasarim-5"] = '<div class="v2-post">' + ["post", "carousel", "story", "post", "carousel"].map(function (t, i) { return '<div class="t' + (i % 3) + '"><i></i><i></i><em>' + t + "</em></div>"; }).join("") + "</div>";
    S["sosyal-yonetim"] = '<div class="v2-plan">' + [1, 2, 3, 4].map(function (n) { return "<div><b>H" + n + "</b><i></i><i></i><i></i></div>"; }).join("") + '</div><div class="v2-not">Plan → onayınız → paylaşım → rapor</div>';
    S["beyanno-wa"] = '<div class="v2-sohbet"><p class="g">KDV\'m ne kadar?</p><p class="c">Ekim KDV\'niz 18.420 TL, son ödeme 26 Kasım.</p></div><div class="v2-not">Örnek sohbet</div>';
    S["beyanno-belge"] = '<div class="v2-belge"><div class="v2f"><b>FİŞ</b><i></i><i></i><i></i></div><div class="v2a"><span class="v2c v2ok">Tarih</span><span class="v2c v2ok">KDV</span><span class="v2c v2ok">Toplam</span><span class="v2c v2no">Uygunsuz</span></div></div>';
    S["beyanno-tam"] = '<div class="v2-mod">' + ["Soru-cevap", "Belge", "Banka", "Tahsilat", "Mutabakat", "Panel"].map(function (m) { return "<i>" + m + "</i>"; }).join("") + "</div>";
    var AK = {
      "google-vitrin": ["Sipariş", "Erişim ve eksik listesi", "Düzenleme · fotoğraflar önce size", "48 saatte teslim"],
      "google-vitrin-bakim": ["Aylık başlar", "Haftalık gönderi", "Yorum cevabı · ayda 4 fotoğraf", "Aylık rapor"],
      "google-profil-kurulum": ["Durum tespiti", "Google'ın resmi yolu", "Doğrulama adımları", "Bilgiler ve bağlantılar"],
      "dijital-ekspertiz": ["Sipariş", "Profil, site, rakip taraması", "10 adımlık yol haritası", "1 iş günü"],
      "tek-sayfa-site": ["Sipariş", "Size özel prototip", "Onayınız", "Yayın · 2 iş günü"],
      "kurumsal-site": ["Sipariş", "Özel tasarım prototipi", "Onayınız", "Yayın · yaklaşık 1 hafta"],
      "site-duzeltme": ["Tarama", "Hata ve hız düzeltme", "Önce / sonra raporu", "1 iş günü"],
      "site-bakim": ["Aylık başlar", "Güncelleme ve yedek", "Hız ve hata kontrolü", "Küçük içerik değişikliği"],
      "sosyal-tasarim-5": ["Sipariş", "5 özel tasarım", "Onayınız", "Paylaşıma hazır · 2 iş günü"],
      "sosyal-yonetim": ["Aylık plan", "Onayınız", "Tasarım ve paylaşım", "Aylık rapor"],
      "beyanno-wa": ["Kayıt · 7 gün ücretsiz", "Luca'da kısıtlı kullanıcı", "WhatsApp QR bağlantısı", "Cevaplar onayınıza ya da otomatik"],
      "beyanno-belge": ["Belge gelir", "Okunur ve kural kontrolü", "Onayınız", "Program için aktarım dosyası"],
      "beyanno-tam": ["Belge paketi", "Banka eşleştirme", "Cari mutabakat ve panel", "Aylık raporlar"]
    };
    var RE = {
      google: [["Profiliniz yok ya da “kalıcı olarak kapandı” görünüyor", "google-profil-kurulum"], ["Profil var ama saat, fotoğraf, yorum cevabı eksik", "google-vitrin"], ["Profil düzgün, düzenli bakım istiyorsunuz", "google-vitrin-bakim"], ["Önce nerede eksik olduğunu görmek istiyorsunuz", "dijital-ekspertiz"]],
      web: [["Tek kampanya, uzman ya da lansman sayfası", "tek-sayfa-site"], ["Birden çok sayfa, kurumsal görünüm", "kurumsal-site"], ["Siteniz var ama yavaş ya da hatalı", "site-duzeltme"], ["Siteniz sağlıklı kalsın", "site-bakim"]],
      beyanno: [["Yalnız mükellef sorularına cevap", "beyanno-wa"], ["Belgeler de otomatik toplansın ve okunsun", "beyanno-belge"], ["Banka, tahsilat, cari ve panel de gerekli", "beyanno-tam"]],
      sosyal: [["Bir seferlik gönderi tasarımı", "sosyal-tasarim-5"], ["Her ay düzenli içerik ve paylaşım", "sosyal-yonetim"]]
    };
    return {
      sahne: function (kod) { return S[kod] ? '<div class="sa-medya v2-sahne" data-sahne="' + kod + '">' + S[kod] + e("v2-et", "Örnek ekran") + "</div>" : ""; },
      akis: function (kod) { var a = AK[kod]; return a ? '<ol class="v2-akis" aria-label="Süreç">' + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>" : ""; },
      rehber: function (k) { var r = RE[k]; return r ? '<div class="v2-rehber"><b>Hangisi size uygun?</b>' + r.map(function (x) { return '<a href="#u-' + x[1] + '"><span>' + x[0] + "</span><em>→</em></a>"; }).join("") + "</div>" : ""; }
    };
  })();


  // ===== Ürün görselleri ve tanıtım videoları (31 Eki 2026) =====
  // Görseller bizim işlerimizin gerçek ekran görüntüleri (işletme adı/telefon gizlendi); videolar Ayşe sesli, 720p, tıklayınca oynar.
  var GD = "assets/satin-al/";
  var GOR = {
    gProfil: ["google-profil-dijitabela", "Google Haritalar'daki gerçek profilimiz: kategori, saatler, web ve telefon eksiksiz"],
    g8: ["google-vitrin-8-is", "Google Vitrin paketinde yapılan 8 iş"],
    gQr: ["google-yorum-qr", "Müşterinin yorum bıraktığı QR akışı (örnek işletme)"],
    gDuzen: ["google-profil-duzen", "Saat, yorum ve QR kartıyla düzenlenmiş profil örneği (örnek işletme)"],
    gKapali: ["google-kapali-kontrol", "“Google'da kapalı mı görünüyorum?” kontrol aracımız"],
    eks1: ["ekspertiz-rapor-1", "Gerçek ekspertiz raporu: puan ve 4 başlıkta durum (işletme adı gizlendi)"],
    eks2: ["ekspertiz-rapor-2", "Bulgular ve çözümler bölümü (aynı rapor)"],
    eks3: ["ekspertiz-baslat", "Ekspertiz başlangıç ekranı"],
    p1: ["site-p1", "Emlak ofisi için hazırladığımız site (işletme bilgileri gizlendi)"],
    p2: ["site-p2", "Diş kliniği için hazırladığımız site (işletme bilgileri gizlendi)"],
    p4t: ["site-p4-tel", "Erkek kuaförü sitesi, telefon görünümü"],
    p7: ["site-p7", "Oto servis için hazırladığımız site (işletme bilgileri gizlendi)"],
    p7t: ["site-p7-tel", "Aynı sitenin telefon görünümü"],
    p8: ["site-p8", "Oto galeri sitesi (işletme bilgileri gizlendi)"],
    dis: ["site-dis-klinigi", "Diş kliniği sektör sitemiz"],
    hiz: ["site-hiz-once-sonra", "Gerçek Lighthouse ölçümü: aynı site düzeltmeden önce 74, sonra 94"],
    hizT: ["site-hiz-rapor-tel", "Düzeltme sonrası hız raporu (mobil ölçüm)"],
    duz: ["site-duzeltilmis", "Görselleri küçültülüp hızlandırılmış site"],
    sEks: ["sosyal-eksik-1", "Mali müşavirler için hazırladığımız gönderi serisi"],
    sFis: ["sosyal-fis-1", "Aynı seriden: fişin WhatsApp'tan deftere yolculuğu"],
    sTah: ["sosyal-tahsilat-1", "Aynı seriden: tahsilat gönderisi"],
    r01: ["sosyal-reels-01", "Kafe için hazırladığımız Reels kapağı"],
    r05: ["sosyal-reels-05", "“Osmanlı esnafı dijitalde” serisinden Reels kapağı"],
    sOto: ["sosyal-otomasyon", "Sosyal medya paylaşım sistemimiz"],
    byMesaj: ["beyanno-mesaj-kutusu", "Beyanno paneli: onay bekleyen cevaplar (demo hesap)"],
    byBeyan: ["beyanno-beyannameler", "Beyanno paneli: Luca'dan okunan beyannameler (demo hesap)"],
    byKurulum: ["beyanno-kurulum", "Beyanno kurulumu: Luca, WhatsApp, cevap modu (demo hesap)"],
    byHat: ["beyanno-hatirlatma-tel", "Son gün hatırlatmaları, onayınızla gider (canlı demo, örnek veri)"],
    byTakvim: ["beyanno-takvim-tel", "Beyanno uygulaması: beyanname takvimi (demo hesap)"]
  };
  var VIDEO = {
    google: ["Google profil tanıtımı", "35"], ekspertiz: ["Dijital ekspertiz tanıtımı", "29"], web: ["Web sitesi tanıtımı", "28"],
    bakim: ["Site düzeltme ve bakım tanıtımı", "28"], sosyal: ["Sosyal medya tanıtımı", "23"], beyanno: ["Beyanno tanıtımı", "29"]
  };
  var MEDYA = {
    "google-vitrin": [["gProfil", "g8", "gQr"], "google"], "google-vitrin-bakim": [["gDuzen", "gQr", "gProfil"], "google"],
    "google-profil-kurulum": [["gKapali", "gProfil"], "google"], "dijital-ekspertiz": [["eks1", "eks2", "eks3"], "ekspertiz"],
    "tek-sayfa-site": [["p7", "p7t", "p4t"], "web"], "kurumsal-site": [["p1", "p2", "dis"], "web"],
    "site-duzeltme": [["hiz", "duz", "hizT"], "bakim"], "site-bakim": [["hizT", "p8"], "bakim"],
    "sosyal-tasarim-5": [["sEks", "sFis", "sTah"], "sosyal"], "sosyal-yonetim": [["r01", "r05", "sOto"], "sosyal"],
    "beyanno-wa": [["byMesaj", "byHat"], "beyanno"], "beyanno-belge": [["byKurulum", "sFis"], "beyanno"], "beyanno-tam": [["byBeyan", "byTakvim", "byMesaj"], "beyanno"]
  };
  var medyaHtml = function (kod) { return V2.sahne(kod); };

  var TL = function (n) { return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " TL"; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var odemeNotu = function (u) { return u.oran === 1 ? (u.aylik ? "İlk ay peşin" : "Tamamı peşin") : "%" + Math.round(u.oran * 100) + " siparişte, kalanı teslimde"; };

  document.querySelectorAll(".sa-liste[data-kat]").forEach(function (L) {
    L.innerHTML = URUNLER.filter(function (u) { return u.kat === L.getAttribute("data-kat"); }).map(function (u) {
      return '<div class="sa-urun" id="u-' + u.kod + '">' + medyaHtml(u.kod, u.ad) + '<h3>' + esc(u.ad) + '</h3><div class="sa-fiyat">' + TL(u.tek) + (u.aylik ? "<small>/ ay</small>" : "") + "</div>" +
        '<p class="sa-kdv">+ KDV · KDV dahil ' + TL(Math.round(u.tek * (1 + KDV))) + (u.aylik ? " / ay" : "") + '</p><span class="sa-sure">' + esc(u.sure) + "</span>" +
        "<ul>" + u.madde.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
        V2.akis(u.kod) + '<p class="sa-odeme">Ödeme: ' + odemeNotu(u) + '</p><button type="button" class="btn btn-p" data-urun="' + u.kod + '">Sipariş ver</button></div>';
    }).join("");
  });

  document.querySelectorAll(".sa-urun[data-medya]").forEach(function (k) {
    var h = k.querySelector("h3"), kod = k.getAttribute("data-medya"); k.id = "u-" + kod; h.insertAdjacentHTML("beforebegin", medyaHtml(kod, h.textContent));
    var ul = k.querySelector("ul"); if (ul) ul.insertAdjacentHTML("afterend", V2.akis(kod));
  });
  [["Google İşletme", "google"], ["Web sitesi", "web"], ["Sosyal medya", "sosyal"]].forEach(function (p) {
    var L = document.querySelector('.sa-liste[data-kat="' + p[0] + '"]'); if (L) L.insertAdjacentHTML("beforebegin", V2.rehber(p[1]));
  });
  var BL = document.querySelector("#beyanno .sa-liste"); if (BL) BL.insertAdjacentHTML("beforebegin", V2.rehber("beyanno"));
  document.querySelectorAll(".sa-urun").forEach(function (k) {
    var b = k.querySelector(".sa-vbtn"), s = k.querySelector(".sa-sure");
    if (b && s) s.insertAdjacentHTML("afterend", '<button type="button" class="sa-vlink" data-vid="' + b.getAttribute("data-vid") + '">▶ ' + VIDEO[b.getAttribute("data-vid")][1] + " sn tanıtım videosu</button>");
  });

  // ----- galeri / video penceresi -----
  var GL = document.getElementById("saGal"), GS = document.getElementById("saGalSahne"), GA = document.getElementById("saGalAlt"), GN = document.getElementById("saGalNokta"), GB = document.getElementById("saGalBas");
  var liste = [], sira = 0;
  function galAc() { if (GL.showModal) { if (!GL.open) GL.showModal(); } else GL.setAttribute("open", ""); }
  function galKapat() { GS.innerHTML = ""; if (GL.close) GL.close(); else GL.removeAttribute("open"); }
  function goster() {
    var g = GOR[liste[sira]];
    GS.innerHTML = '<img src="' + GD + g[0] + '.webp" alt="' + g[1] + '">' + (liste.length > 1 ? '<button type="button" class="ok g" data-ok="-1" aria-label="Önceki">‹</button><button type="button" class="ok i" data-ok="1" aria-label="Sonraki">›</button>' : "");
    GA.textContent = g[1]; GN.innerHTML = liste.length > 1 ? liste.map(function (_, i) { return '<i class="' + (i === sira ? "a" : "") + '"></i>'; }).join("") : "";
  }
  function galeri(kod, ad, bas) { liste = MEDYA[kod][0]; sira = bas || 0; GB.textContent = ad; goster(); galAc(); }
  function video(v) {
    GB.textContent = VIDEO[v][0] + " · " + VIDEO[v][1] + " sn"; GN.innerHTML = "";
    GS.innerHTML = '<video controls playsinline preload="metadata" poster="' + GD + "video-" + v + '.webp" src="' + GD + "video-" + v + '.mp4"></video>';
    GA.textContent = "Seslendirme: Ayşe (Dijitabela'nın yapay zekâ sesi). Görüntüler gerçek ekran kayıtlarıdır; örnek işletme ve demo verileri kullanıldı.";
    galAc(); var el = GS.querySelector("video"); var p = el.play(); if (p && p.catch) p.catch(function () {});
    if (window.dtOlay) try { window.dtOlay("ViewContent", { content_name: "video-" + v }); } catch (x) {}
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target : null; if (!t) return;
    var a = t.closest("[data-gal]"), v = t.closest("[data-vid]"), o = t.closest("[data-ok]");
    if (a) { var k = a.closest(".sa-urun"); galeri(a.getAttribute("data-gal"), k ? k.querySelector("h3").textContent : ""); }
    else if (v) video(v.getAttribute("data-vid"));
    else if (o) { sira = (sira + +o.getAttribute("data-ok") + liste.length) % liste.length; goster(); }
  });
  document.getElementById("saGalKapat").onclick = galKapat;
  GL.addEventListener("click", function (e) { if (e.target === GL) galKapat(); });
  GL.addEventListener("close", function () { GS.innerHTML = ""; });
  GL.addEventListener("keydown", function (e) { if (!liste.length || GS.querySelector("video")) return; if (e.key === "ArrowRight" || e.key === "ArrowLeft") { sira = (sira + (e.key === "ArrowRight" ? 1 : -1) + liste.length) % liste.length; goster(); } });
  var dx = null; GS.addEventListener("touchstart", function (e) { dx = e.touches[0].clientX; }, { passive: true });
  GS.addEventListener("touchend", function (e) { if (dx === null || GS.querySelector("video") || liste.length < 2) return; var f = e.changedTouches[0].clientX - dx; dx = null; if (Math.abs(f) > 40) { sira = (sira + (f < 0 ? 1 : -1) + liste.length) % liste.length; goster(); } });

  var D = document.getElementById("saForm"), F = document.getElementById("saF"), H = document.getElementById("saHata"), G = document.getElementById("saGonder"), secili = null;
  var hata = function (m) { H.hidden = !m; H.textContent = m || ""; };
  function ac(u) {
    secili = u; hata("");
    var kdvli = Math.round(u.tek * (1 + KDV)), ilk = Math.round(kdvli * u.oran);
    document.getElementById("saBaslik").textContent = u.ad;
    document.getElementById("saOzet").innerHTML = "<div><span>Fiyat" + (u.aylik ? " (ilk ay)" : "") + "</span><span>" + TL(u.tek) + "</span></div><div><span>KDV (%20)</span><span>" + TL(kdvli - u.tek) + "</span></div>" +
      "<div><span>Toplam (KDV dahil)</span><span>" + TL(kdvli) + "</span></div>" + '<div class="g"><span>Şimdi ödenecek</span><span>' + TL(ilk) + "</span></div>" +
      '<div class="small" style="margin-top:4px"><span>' + esc(u.sure) + " · " + odemeNotu(u) + (u.aylik ? " · sonraki aylar " + TL(kdvli) : "") + "</span></div>";
    if (D.showModal) D.showModal(); else D.setAttribute("open", "");
    setTimeout(function () { document.getElementById("fAd").focus(); }, 50);
  }
  function kapat() { if (D.close) D.close(); else D.removeAttribute("open"); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-urun]");
    if (b) ac(URUNLER.filter(function (u) { return u.kod === b.getAttribute("data-urun"); })[0]);
  });
  document.getElementById("saKapat").onclick = kapat; document.getElementById("saVazgec").onclick = kapat;
  D.addEventListener("click", function (e) { if (e.target === D) kapat(); });
  F.querySelectorAll('input[name="yontem"], input[name="alici"]').forEach(function (r) { r.onchange = function () {
    var grup = this.closest(".sa-yontem"), ad = this.name;
    grup.querySelectorAll("label").forEach(function (l) { l.classList.toggle("secili", l.contains(grup.querySelector('input[name="' + ad + '"]:checked'))); });
    if (ad === "alici") { var tk = this.value === "tuketici"; document.getElementById("fIfaK").hidden = !tk; document.getElementById("fFatura").hidden = tk; }
  }; });
  // 31 Eki 2026: hizmete özel sözleşme metni (genel + ek [+ tüketici eki]) — assets/sozlesme.js
  var aliciTuru = function () { return (F.querySelector('input[name="alici"]:checked') || {}).value === "tuketici" ? "tuketici" : "isletme"; };
  var sozKodlar = function () { return window.Sozlesme ? Sozlesme.kodlar({ urun: secili && secili.kod }, aliciTuru()) : []; };
  document.getElementById("fSozOku").onclick = function () {
    if (!window.Sozlesme || !secili) { window.open("sozlesme.html", "_blank"); return; }
    var ek0 = '<div class="soz-ek0"><h2>EK-0 — SİPARİŞ ÖZETİ</h2><p><b>' + esc(secili.ad) + "</b></p>" + document.getElementById("saOzet").innerHTML +
      "<ul>" + secili.madde.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul><p>Kalan ödeme (varsa) teslim bildiriminden itibaren 7 gün içinde. Ödeme Google, Meta gibi üçüncü tarafların onayına bağlı değildir.</p></div>";
    Sozlesme.oku("Hizmet sözleşmesi · " + secili.ad, ek0 + Sozlesme.belgeHtml(sozKodlar()));
  };

  F.onsubmit = function (e) {
    e.preventDefault(); hata("");
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var d = { urun: secili && secili.kod, ad: v("fAd"), isletme: v("fIs"), tel: v("fTel"), eposta: v("fEp"), not: v("fNot"),
      yontem: (F.querySelector('input[name="yontem"]:checked') || {}).value || "havale", kvkk: document.getElementById("fKvkk").checked, sozlesme: document.getElementById("fSoz").checked,
      alici_turu: aliciTuru(), ifa_onayi: aliciTuru() === "tuketici" && document.getElementById("fIfa").checked,
      unvan: aliciTuru() === "isletme" ? v("fUnvan") : "", vergi_no: aliciTuru() === "isletme" ? v("fVkn") : "",
      belgeler: window.Sozlesme ? Sozlesme.ozetler(sozKodlar()) : [] };
    if (d.ad.length < 2) return hata("Adınızı yazın.");
    if (!d.isletme) return hata("İşletme adını yazın.");
    if (d.tel.replace(/\D/g, "").length < 10) return hata("Telefon numaranızı yazın.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.eposta)) return hata("Geçerli bir e-posta adresi yazın.");
    if (!d.kvkk) return hata("Devam etmek için KVKK aydınlatma metnini onaylayın.");
    if (!d.sozlesme) return hata("Devam etmek için hizmet sözleşmesini okuyup onaylayın.");
    if (d.alici_turu === "tuketici" && !d.ifa_onayi) return hata("Hizmetin hemen başlaması için cayma onayını işaretleyin ya da işletme olarak devam edin.");
    G.disabled = true; G.textContent = "Sipariş oluşturuluyor…";
    fetch(A.supabaseUrl + "/functions/v1/siparis-olustur", { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey, Authorization: "Bearer " + A.supabaseAnonKey }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.token) throw new Error(r.error || "Sipariş oluşturulamadı");
        if (window.dtOlay) try { window.dtOlay("InitiateCheckout", { content_name: secili.ad, value: secili.tek, currency: "TRY" }); } catch (x) {}
        location.href = "teklif.html?t=" + encodeURIComponent(r.token) + "&siparis=1" + (d.yontem === "kart" ? "&yontem=kart" : "") + "#pay";
      })
      .catch(function (x) { G.disabled = false; G.textContent = "Sözleşmeyi onayla, siparişi oluştur"; hata(x.message + " · Sorun sürerse 0501 945 21 84'ü arayın."); });
  };
})();
