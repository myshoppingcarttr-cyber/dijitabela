// ===== Ajans ayarları — marka adı ve iletişim bilgileri BURADAN değişir =====
window.AJANS = {
  marka: "Dijitabela",                // marka kitabı: marka/index.html
  slogan: "Yerel işletmeler için web, yazılım ve yapay zekâ",
  sahip: "Alim Hoşlar",
  telefon: "0501 945 21 84",
  whatsapp: "905019452184",
  eposta: "info@dijitabela.com",       // Natro ücretsiz mail kutusu (alan adı aktif olunca kurulacak)
  sehir: "Antalya",
  site: "https://www.dijitabela.com",  // alan adı henüz satın alınmadı
  // Havale/EFT bilgileri (şahıs şirketi)
  unvan: "Alim Hoşlar",                // vergi levhasındaki ad/unvan
  vergiDairesi: "",
  vergiNo: "",
  iban: "TR04 0006 4000 0016 2700 5489 50",                          // TR.. ile başlayan IBAN
  banka: "Türkiye İş Bankası",
  kartOdeme: false,                   // iyzico hesabı (vergi levhası sonrası) açılınca true yapın
  // Veritabanı (Supabase) — boşsa DEMO modunda çalışır
  supabaseUrl: "https://ctlbhwbccqgwmtqbwtfs.supabase.co",
  supabaseAnonKey: "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy",  // herkese açık anahtar (RLS açık); gizli anahtar ASLA buraya yazılmaz
  kdv: 0.20
};
