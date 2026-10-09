// ===== Ajans ayarları — marka adı ve iletişim bilgileri BURADAN değişir =====
window.AJANS = {
  marka: "Dijitabela",                // marka kitabı: marka/index.html
  slogan: "Yerel işletmeler için web, yazılım ve yapay zekâ",
  sahip: "Alim Hoşlar",
  telefon: "0501 945 21 84",
  whatsapp: "905019452184",
  telefon2: "0538 676 57 27",          // 9 Eki: 0538 resmî WhatsApp hattı (7/24 asistan + ücretsiz taslak düğmesi)
  whatsapp2: "905386765727",
  eposta: "info@dijitabela.com",       // Natro ücretsiz mail kutusu (alan adı aktif olunca kurulacak)
  sehir: "Antalya",
  site: "https://dijitabela.com.tr",  // 7 Eki 2026: KANONİK ADRES .com.tr (dijitabela.com BTK Güvenli İnternet'te eski sahibinden kalma etiketle engelli). dijitabela.com aynı içeriği sunmaya devam eder (kartvizit QR).
  // Havale/EFT bilgileri (şahıs şirketi)
  unvan: "Dijitabela",                 // kullanıcı: ünvan Dijitabela (7 Eki)
  yasalAd: "Alim Hoşlar",              // vergi levhasındaki gerçek kişi adı: havale alıcısı, yasal satıcı, KVKK veri sorumlusu
  vergiDairesi: "Düden",               // vergi levhası 1 Eki 2026 (işe başlama), faaliyet 702001 İşletme ve idari danışmanlık
  vergiNo: "4641290891",               // VKN (TC kimlik no ASLA yazılmaz)
  // Levhadaki işyeri adresi Alim Bey'in EVİ (home office): sokak/bina/kapı no HİÇBİR YERDE yayınlanmaz, yalnız ilçe/il.
  adres: "Kepez / Antalya",
  adresParca: { ilce: "Kepez", il: "Antalya", ulke: "TR" },
  iban: "TR04 0006 4000 0016 2700 5489 50",                          // TR.. ile başlayan IBAN
  banka: "Türkiye İş Bankası",
  kartOdeme: true,                    // 8 Eki: PayTR canlı moda alındı (mağaza 758710), Secrets PAYTR_TEST=0. KURULUM.md §3
  // Veritabanı (Supabase) — boşsa DEMO modunda çalışır
  supabaseUrl: "https://ctlbhwbccqgwmtqbwtfs.supabase.co",
  supabaseAnonKey: "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy",  // herkese açık anahtar (RLS açık); gizli anahtar ASLA buraya yazılmaz
  kdv: 0.20
};
