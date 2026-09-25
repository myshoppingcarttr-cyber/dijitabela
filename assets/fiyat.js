// ===== Fiyat motoru: hizmet kalemleri, paketler ve anlık teklif hesabı =====
(function () {
  "use strict";
  // tek: tek seferlik (TL, KDV hariç) · ay: aylık (TL, KDV hariç)
  // Fiyatlar Eylül 2026 Türkiye pazar araştırmasına göre piyasanın alt-orta bandında tutuldu (talep çekmek için).
  var KALEMLER = {
    site:      { ad: "Kurumsal web sitesi", acik: "Mobil uyumlu, hizmet sayfaları, galeri, harita, WhatsApp randevu", tek: 17500, grup: "Görünürlük" },
    seo:       { ad: "Google SEO + Google İşletme Profili", acik: "SEO altyapısı, 6 blog yazısı, Google İşletme kurulum/kurtarma", tek: 7500, grup: "Görünürlük" },
    crm:       { ad: "Müşteri takip yazılımı (CRM)", acik: "Müşteri/kayıt paneli, geçmiş, hatırlatmalar, müşteri girişi", tek: 30000, grup: "Yazılım" },
    uygulama:  { ad: "Telefon ve bilgisayar uygulaması", acik: "Yüklenebilir uygulama (Android, iPhone, masaüstü)", tek: 10000, grup: "Yazılım", gerekli: "crm" },
    magaza:    { ad: "Google Play + App Store yayını", acik: "Mağaza uygulaması, push bildirim", tek: 35000, grup: "Yazılım", gerekli: "crm" },
    odeme:     { ad: "Online ödeme ve taksit", acik: "iyzico / PayTR entegrasyonu ve yasal metinler", tek: 15000, grup: "Yazılım" },
    randevu:   { ad: "Online randevu sistemi", acik: "Takvimli randevu, onay ve hatırlatma", tek: 10000, grup: "Yazılım" },
    wa:        { ad: "WhatsApp yapay zekâ asistanı", acik: "7/24 otomatik cevap, randevu alma, ustaya/personele devretme", tek: 20000, ay: 2500, grup: "Yapay zekâ" },
    icerik:    { ad: "Otomatik içerik ve sosyal medya", acik: "Fotoğraftan paylaşım metni, onaylı otomatik paylaşım", tek: 15000, ay: 1500, grup: "Yapay zekâ" },
    yorum:     { ad: "Google yorum toplama otomasyonu", acik: "Memnuniyet sorusu + yorum linki", tek: 6000, ay: 500, grup: "Yapay zekâ" },
    bakim:     { ad: "Bakım ve destek", acik: "Güncelleme, yedek, küçük değişiklikler", ay: 1500, grup: "Aylık" },
    seoAylik:  { ad: "Aylık SEO ve içerik", acik: "Aylık 4 blog, Google gönderileri, rapor", ay: 5000, grup: "Aylık" },
    sosyal:    { ad: "Sosyal medya yönetimi", acik: "Aylık 12 paylaşım", ay: 6000, grup: "Aylık" }
  };

  var PAKETLER = [
    { id: "vitrin", ad: "Dijital Vitrin", kisa: "Google'da görünür olun, müşteri sizi bulsun.", kalemler: ["site", "seo"], fiyat: 19900, sure: "1 hafta", destek: "1 ay" },
    { id: "servis", ad: "Dijital İşletme", kisa: "Müşterinizi takip edin, geri çağırın.", kalemler: ["site", "seo", "crm", "uygulama"], fiyat: 49900, sure: "2–3 hafta", destek: "3 ay", onerilen: true },
    { id: "tam", ad: "Tam Dijital Dönüşüm", kisa: "Mağaza uygulaması, online ödeme ve büyüme desteği.", kalemler: ["site", "seo", "crm", "uygulama", "magaza", "odeme"], fiyat: 89900, sure: "5–6 hafta", destek: "6 ay" }
  ];

  var OLCEK = { tek: { ad: "Tek şube", k: 1 }, cok: { ad: "2–3 şube", k: 1.3 }, buyuk: { ad: "4+ şube / zincir", k: 1.6 } };
  var ACIL = { normal: { ad: "Normal", k: 1 }, hizli: { ad: "Hızlı (süre yarıya)", k: 1.2 } };

  // Seçilen kalemlerden teklif hesaplar; paket kalemlerini kapsıyorsa paket fiyatı uygulanır
  function hesapla(secim, olcek, acil) {
    secim = (secim || []).filter(function (k) { return KALEMLER[k]; });
    // bağımlılık: uygulama/mağaza CRM gerektirir
    secim.slice().forEach(function (k) { var g = KALEMLER[k].gerekli; if (g && secim.indexOf(g) < 0) secim.push(g); });
    var ko = (OLCEK[olcek] || OLCEK.tek).k, ka = (ACIL[acil] || ACIL.normal).k;

    // en büyük uyan paketi bul
    var paket = null;
    PAKETLER.forEach(function (p) { if (p.kalemler.every(function (k) { return secim.indexOf(k) > -1; })) paket = p; });

    var satirlar = [], tek = 0, ay = 0;
    if (paket) {
      var liste = paket.kalemler.reduce(function (s, k) { return s + (KALEMLER[k].tek || 0); }, 0);
      satirlar.push({ ad: paket.ad + " paketi", acik: paket.kalemler.map(function (k) { return KALEMLER[k].ad; }).join(" · "), tek: paket.fiyat, liste: liste });
      tek += paket.fiyat;
    }
    secim.forEach(function (k) {
      if (paket && paket.kalemler.indexOf(k) > -1) return;
      var it = KALEMLER[k];
      satirlar.push({ ad: it.ad, acik: it.acik, tek: it.tek || 0, ay: it.ay || 0 });
      tek += it.tek || 0;
    });
    secim.forEach(function (k) { ay += KALEMLER[k].ay || 0; });
    var carpan = ko * ka;
    // çarpan yoksa liste fiyatı aynen kalır (19.900 gibi); çarpan varsa 500 TL'ye yuvarlanır
    if (carpan !== 1) tek = Math.round(tek * carpan / 500) * 500;
    var liste = satirlar.reduce(function (s, r) { return s + (r.liste || r.tek); }, 0);
    return {
      secim: secim, paket: paket && paket.id, satirlar: satirlar, carpan: carpan,
      olcek: olcek || "tek", acil: acil || "normal",
      tek: tek, ay: ay, indirim: paket ? Math.max(0, Math.round(liste * carpan) - tek) : 0,
      kdv: Math.round(tek * (window.AJANS ? AJANS.kdv : 0.2)),
      kapora: Math.round(tek / 2)
    };
  }

  var TL = function (n) { return (Number(n) || 0).toLocaleString("tr-TR") + " TL"; };
  window.FIYAT = { KALEMLER: KALEMLER, PAKETLER: PAKETLER, OLCEK: OLCEK, ACIL: ACIL, hesapla: hesapla, TL: TL };
})();
