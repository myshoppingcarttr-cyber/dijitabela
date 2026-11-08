/* =====================================================================
   YORGANCI RAMAZAN · FİYAT LİSTESİ (TEK KAYNAK)
   Fiyatı değiştirmek için yalnız bu dosyadaki rakamı değiştirin (TL, KDV dahil).
   0 yazılan seçenek "teklif ile" gösterilir, sepete eklenmez (WhatsApp'tan fiyat sorulur).
   Kaynak: Trendyol orta segment ilanları, 8 Kasım 2026 (ayrıntı: DIJITABELA/MUSTERILER/yorganci-ramazan/FIYAT-LISTESI-TASLAK.md).
   Usta (Ramazan Hoşlar) gerçek fiyatları verince burası güncellenecek.
   Sayfadaki fiyat yazıları açılışta bu dosyadan yeniden okunur; siteyi yeniden üretmek SEO metni için önerilir: node _kaynak/uret.js
   ===================================================================== */
window.YR_FIYAT = {
  "yun-yorgan": { "Tek kişilik · 155×215 cm · ~3 kg yün": 3500, "Çift kişilik · 195×215 cm · ~4 kg yün": 4500, "Geniş (king) · 220×240 cm · ~5 kg yün": 5500 },
  "pamuk-yorgan": { "Tek kişilik · 155×215 cm": 2250, "Çift kişilik · 195×215 cm": 3000, "Geniş (king) · 220×240 cm": 3750 },
  "silikon-yorgan": { "Tek kişilik · 155×215 cm": 1100, "Çift kişilik · 195×215 cm": 1400, "Geniş (king) · 220×240 cm": 1800 },
  "elyaf-yorgan": { "Tek kişilik · 155×215 cm": 800, "Çift kişilik · 195×215 cm": 1000 },
  "kaz-tuyu-yorgan": { "Tek kişilik · 155×215 cm": 2500, "Çift kişilik · 195×215 cm": 3200 },
  "bambu-yorgan": { "Tek kişilik · 155×215 cm": 1300, "Çift kişilik · 195×215 cm": 1700 },
  "microfiber-yorgan": { "Tek kişilik · 155×215 cm": 750, "Çift kişilik · 195×215 cm": 1000 },
  "ceyiz-yorgani": { "Çift kişilik · 195×215 cm|Yün": 5500, "Çift kişilik · 195×215 cm|Pamuk": 4500, "Geniş (king) · 220×240 cm|Yün": 6500, "Geniş (king) · 220×240 cm|Pamuk": 5500 },
  "bebek-yorgani": { "Pamuk · 95×145 cm": 900, "Yün · 95×145 cm": 1100, "Silikon · 95×145 cm": 500 },
  "silikon-yastik": { "50×70 cm": 300, "50×80 cm": 350 },
  "pamuk-yastik": { "50×70 cm": 850 },
  "yun-yastik": { "50×70 cm": 800 },
  "elyaf-yastik": { "50×70 cm": 200 },
  "kaz-tuyu-yastik": { "50×70 cm": 1200 },
  "cocuk-yastigi": { "35×45 cm": 250 },
  "yun-dosek": { "90×190 cm": 3500, "100×200 cm": 3900, "Özel ölçü (teklif)": 0 },
  "sunger-dosek": { "Ölçüye göre (teklif)": 0 },
  "yatak-pedi": { "90×190 cm": 600, "160×200 cm": 900, "180×200 cm": 1000 },
  "alez": { "90×190 cm": 450, "160×200 cm": 600 },
  "battaniye": { "Tek kişilik": 900, "Çift kişilik": 1300 },
  "nevresim": { "Tek kişilik": 1000, "Çift kişilik": 1300 },
  "yorgan-yuzu": { "Tek kişilik|Saten": 900, "Tek kişilik|Pamuklu": 850, "Çift kişilik|Saten": 1200, "Çift kişilik|Pamuklu": 1100 },
  "hali-ortusu": { "Ölçüye göre (teklif)": 0 },
  "piknik-hasiri": { "Standart": 350 },
  "yorgan-yenileme": { "Tek kişilik · 155×215 cm": 1400, "Çift kişilik · 195×215 cm": 1800 },
  "yastik-kabartma": { "50×70 cm": 250 },
  "dosek-kabartma": { "90×190 cm": 1200, "Özel ölçü (teklif)": 0 }
};
/* Kargo ve ödeme ayarları — usta/Patron teyidi bekliyor */
window.YR_AYAR = {
  kargo: { ucret: 250, esik: 5000 },   // yorgan hacimli: 5.000 TL altı siparişte 250 TL kargo (TEYİT BEKLİYOR)
  PAYTR_AKTIF: false,                  // PayTR mağaza hesabı açılınca true yapılır (bkz. _kaynak/PAYTR-NOT.md)
  iban: "[IBAN — Ramazan Hoşlar teyidi bekliyor]",
  hesapAdi: "[Hesap sahibi adı — teyit bekliyor]"
};
