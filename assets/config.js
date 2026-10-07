// ===== Ajans ayarları — marka adı ve iletişim bilgileri BURADAN değişir =====
window.AJANS = {
  marka: "Dijitabela",                // marka kitabı: marka/index.html
  slogan: "Yerel işletmeler için web, yazılım ve yapay zekâ",
  sahip: "Alim Hoşlar",
  telefon: "0501 945 21 84",
  whatsapp: "905019452184",
  eposta: "info@dijitabela.com",       // Natro ücretsiz mail kutusu (alan adı aktif olunca kurulacak)
  sehir: "Antalya",
  site: "https://dijitabela.com",  // GitHub Pages CNAME = dijitabela.com (www → 301 buraya). Kanonik adres bu olmalı.
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
  kartOdeme: false,                   // 7 Eki: PayTR canlı mod onayına kadar GİZLİ (test modunda gerçek kart reddedilir). Onay gelince true + Secrets PAYTR_TEST=0. KURULUM.md §3
  // Veritabanı (Supabase) — boşsa DEMO modunda çalışır
  supabaseUrl: "https://ctlbhwbccqgwmtqbwtfs.supabase.co",
  supabaseAnonKey: "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy",  // herkese açık anahtar (RLS açık); gizli anahtar ASLA buraya yazılmaz
  kdv: 0.20
};
