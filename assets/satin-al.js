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

  var TL = function (n) { return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " TL"; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var odemeNotu = function (u) { return u.oran === 1 ? (u.aylik ? "İlk ay peşin" : "Tamamı peşin") : "%" + Math.round(u.oran * 100) + " siparişte, kalanı teslimde"; };

  document.querySelectorAll(".sa-liste[data-kat]").forEach(function (L) {
    L.innerHTML = URUNLER.filter(function (u) { return u.kat === L.getAttribute("data-kat"); }).map(function (u) {
      return '<div class="sa-urun"><h3>' + esc(u.ad) + '</h3><div class="sa-fiyat">' + TL(u.tek) + (u.aylik ? "<small>/ ay</small>" : "") + "</div>" +
        '<p class="sa-kdv">+ KDV · KDV dahil ' + TL(Math.round(u.tek * (1 + KDV))) + (u.aylik ? " / ay" : "") + '</p><span class="sa-sure">' + esc(u.sure) + "</span>" +
        "<ul>" + u.madde.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
        '<p class="sa-odeme">Ödeme: ' + odemeNotu(u) + '</p><button type="button" class="btn btn-p" data-urun="' + u.kod + '">Sipariş ver</button></div>';
    }).join("");
  });

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
