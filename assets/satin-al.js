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
  var medyaHtml = function (kod, ad) {
    var m = MEDYA[kod]; if (!m) return "";
    var g = GOR[m[0][0]], v = VIDEO[m[1]];
    return '<div class="sa-medya"><button type="button" class="sa-ana" data-gal="' + kod + '" aria-label="' + ad + ' görsellerini büyüt"><img src="' + GD + g[0] + '.webp" alt="' + g[1] + '" loading="lazy" decoding="async" width="1200" height="750"></button>' +
      '<span class="sa-say">' + m[0].length + " görsel</span>" +
      (v ? '<button type="button" class="sa-vbtn" data-vid="' + m[1] + '" aria-label="' + v[0] + ' videosunu oynat"><img src="' + GD + "video-" + m[1] + '.webp" alt="" loading="lazy" width="72" height="128"><span>' + v[1] + " sn</span></button>" : "") + "</div>";
  };

  var TL = function (n) { return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " TL"; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var odemeNotu = function (u) { return u.oran === 1 ? (u.aylik ? "İlk ay peşin" : "Tamamı peşin") : "%" + Math.round(u.oran * 100) + " siparişte, kalanı teslimde"; };

  document.querySelectorAll(".sa-liste[data-kat]").forEach(function (L) {
    L.innerHTML = URUNLER.filter(function (u) { return u.kat === L.getAttribute("data-kat"); }).map(function (u) {
      return '<div class="sa-urun">' + medyaHtml(u.kod, u.ad) + '<h3>' + esc(u.ad) + '</h3><div class="sa-fiyat">' + TL(u.tek) + (u.aylik ? "<small>/ ay</small>" : "") + "</div>" +
        '<p class="sa-kdv">+ KDV · KDV dahil ' + TL(Math.round(u.tek * (1 + KDV))) + (u.aylik ? " / ay" : "") + '</p><span class="sa-sure">' + esc(u.sure) + "</span>" +
        "<ul>" + u.madde.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
        '<p class="sa-odeme">Ödeme: ' + odemeNotu(u) + '</p><button type="button" class="btn btn-p" data-urun="' + u.kod + '">Sipariş ver</button></div>';
    }).join("");
  });

  document.querySelectorAll(".sa-urun[data-medya]").forEach(function (k) {
    var h = k.querySelector("h3"); h.insertAdjacentHTML("beforebegin", medyaHtml(k.getAttribute("data-medya"), h.textContent));
  });
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
  F.querySelectorAll('input[name="yontem"]').forEach(function (r) { r.onchange = function () { F.querySelectorAll(".sa-yontem label").forEach(function (l) { l.classList.toggle("secili", l.contains(F.querySelector('input[name="yontem"]:checked'))); }); }; });

  F.onsubmit = function (e) {
    e.preventDefault(); hata("");
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var d = { urun: secili && secili.kod, ad: v("fAd"), isletme: v("fIs"), tel: v("fTel"), eposta: v("fEp"), not: v("fNot"),
      yontem: (F.querySelector('input[name="yontem"]:checked') || {}).value || "havale", kvkk: document.getElementById("fKvkk").checked, sozlesme: document.getElementById("fSoz").checked };
    if (d.ad.length < 2) return hata("Adınızı yazın.");
    if (!d.isletme) return hata("İşletme adını yazın.");
    if (d.tel.replace(/\D/g, "").length < 10) return hata("Telefon numaranızı yazın.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.eposta)) return hata("Geçerli bir e-posta adresi yazın.");
    if (!d.kvkk) return hata("Devam etmek için KVKK aydınlatma metnini onaylayın.");
    if (!d.sozlesme) return hata("Devam etmek için mesafeli satış sözleşmesini onaylayın.");
    G.disabled = true; G.textContent = "Sipariş oluşturuluyor…";
    fetch(A.supabaseUrl + "/functions/v1/siparis-olustur", { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey, Authorization: "Bearer " + A.supabaseAnonKey }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.token) throw new Error(r.error || "Sipariş oluşturulamadı");
        if (window.dtOlay) try { window.dtOlay("InitiateCheckout", { content_name: secili.ad, value: secili.tek, currency: "TRY" }); } catch (x) {}
        location.href = "teklif.html?t=" + encodeURIComponent(r.token) + "&siparis=1" + (d.yontem === "kart" ? "&yontem=kart" : "") + "#pay";
      })
      .catch(function (x) { G.disabled = false; G.textContent = "Siparişi oluştur"; hata(x.message + " · Sorun sürerse 0501 945 21 84'ü arayın."); });
  };
})();
