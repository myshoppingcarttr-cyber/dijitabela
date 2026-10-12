/* Antalya BB Bilgisayar · prototip verisi (Dijitabela, 12 Eki 2026)
   Hizmet adları, telefon, e-posta ve hizmet bölgeleri işletmenin kendi sitesinden (antalyabilgisayarservisi.com) alındı.
   Müşteri adları, iş emirleri, stok, fiyat aralıkları ve rapor rakamları ÖRNEKTİR; işletme kendi verisini girer. */
window.ABS = {
  firma: { ad: "Antalya BB Bilgisayar", kisa: "BB Bilgisayar", tel: "0553 723 05 99", telHam: "+905537230599", eposta: "info@antalyabilgisayarservisi.com", site: "antalyabilgisayarservisi.com" },

  hizmetler: ["Yerinde Bilgisayar Servisi", "Laptop Tamiri – Notebook Tamiri", "Masaüstü Bilgisayar Tamiri", "Oyun Bilgisayarı Tamiri", "All In One Bilgisayar Onarımı",
    "Bilgisayar Bakımı ve Performans", "Chipset Değişimi", "Anakart Tamiri", "BGA Reballing", "BIOS ve IO Programlama", "Laptop Ekran Tamiri",
    "Laptop Kasa ve Menteşe Tamiri", "Laptop Ram Problemleri", "Laptop Fan Tamiri", "Yazıcı Tamiri", "Gaming PC / Render PC Toplama"],

  cihazlar: [
    { id: "laptop", ad: "Laptop / Notebook", kat: 1 },
    { id: "masaustu", ad: "Masaüstü", kat: 0.9 },
    { id: "oyun", ad: "Oyun bilgisayarı", kat: 1.25 },
    { id: "aio", ad: "All In One", kat: 1.15 },
    { id: "yazici", ad: "Yazıcı", kat: 0.8 }
  ],
  markalar: ["Lenovo", "HP", "Asus", "Acer", "Dell", "Apple", "MSI", "Monster", "Casper", "Toshiba", "Samsung", "Diğer"],

  /* belirti → olası nedenler + önerilen işlem (fiyat sihirbazına bağlanır) */
  belirtiler: [
    { id: "acilmiyor", ad: "Hiç açılmıyor", neden: ["Güç entegresi / anakart", "Şarj soketi (DC jack)", "BIOS bozulması"], islem: "anakart" },
    { id: "ekran", ad: "Ekran kırık / çizgili", neden: ["Ekran paneli", "Ekran kablosu (flex)", "Ekran kartı (GPU)"], islem: "ekran" },
    { id: "isinma", ad: "Aşırı ısınma, fan sesi", neden: ["Fan tozlanması", "Kurumuş termal macun", "Fan rulmanı"], islem: "fan" },
    { id: "yavas", ad: "Çok yavaş", neden: ["Eski HDD (SSD yükseltme)", "Yetersiz RAM", "Yazılım / virüs"], islem: "ssd" },
    { id: "sarj", ad: "Şarj olmuyor", neden: ["Adaptör", "Şarj soketi", "Batarya hücreleri"], islem: "soket" },
    { id: "sivi", ad: "Sıvı döküldü", neden: ["Anakartta oksitlenme", "Klavye devresi", "Kısa devre"], islem: "sivi" },
    { id: "klavye", ad: "Klavye / touchpad", neden: ["Klavye modülü", "Flex kablo", "Sıvı izi"], islem: "klavye" },
    { id: "mentese", ad: "Menteşe / kasa kırık", neden: ["Menteşe yuvası", "Kasa vida dübelleri", "Ekran çerçevesi"], islem: "mentese" },
    { id: "mavi", ad: "Mavi ekran, donma", neden: ["RAM arızası", "Disk hatası", "Sürücü / Windows"], islem: "ram" },
    { id: "veri", ad: "Veri kurtarma", neden: ["Silinmiş dosya", "Bozuk disk bölümü", "Fiziksel disk arızası"], islem: "veri" }
  ],

  /* ÖRNEK fiyat aralıkları (₺, parça dahil, KDV dahil varsayım) — işletme kendi tarifesini panelden girer */
  islemler: [
    { id: "fan", ad: "Fan temizliği + termal macun", min: 900, max: 1600, gun: "Aynı gün" },
    { id: "ekran", ad: "Laptop ekran değişimi", min: 2800, max: 5500, gun: "1–3 gün", parca: true },
    { id: "ssd", ad: "SSD yükseltme + kurulum", min: 2200, max: 3600, gun: "Aynı gün", parca: true },
    { id: "ram", ad: "RAM testi / değişimi", min: 800, max: 2400, gun: "Aynı gün", parca: true },
    { id: "soket", ad: "Şarj soketi (DC jack)", min: 900, max: 1800, gun: "1–2 gün", parca: true },
    { id: "klavye", ad: "Klavye değişimi", min: 1200, max: 2400, gun: "1–3 gün", parca: true },
    { id: "mentese", ad: "Kasa ve menteşe tamiri", min: 1200, max: 3000, gun: "1–3 gün" },
    { id: "sivi", ad: "Sıvı teması temizliği + onarım", min: 1200, max: 4000, gun: "2–4 gün" },
    { id: "anakart", ad: "Anakart tamiri", min: 2500, max: 7500, gun: "2–5 gün" },
    { id: "bga", ad: "BGA Reballing / Chipset değişimi", min: 3000, max: 8000, gun: "3–5 gün", parca: true },
    { id: "bios", ad: "BIOS ve IO programlama", min: 1200, max: 2500, gun: "1–2 gün" },
    { id: "veri", ad: "Veri kurtarma (mantıksal)", min: 1500, max: 4500, gun: "1–4 gün" }
  ],

  /* şematik harita (viewBox 1000×600) · mahalleler gerçek, konumlar yaklaşık */
  bolgeler: [
    { id: "konyaalti", ad: "Konyaaltı", ucret: 0 },
    { id: "muratpasa", ad: "Muratpaşa · Lara", ucret: 0 },
    { id: "kepez", ad: "Kepez", ucret: 0 },
    { id: "dosemealti", ad: "Döşemealtı", ucret: 250 },
    { id: "aksu", ad: "Aksu", ucret: 250 },
    { id: "serik", ad: "Serik · Belek", ucret: 400 }
  ],
  mahalleler: [
    { ad: "Sarısu", b: "konyaalti", x: 118, y: 452 }, { ad: "Hurma", b: "konyaalti", x: 168, y: 418 }, { ad: "Liman", b: "konyaalti", x: 208, y: 446 },
    { ad: "Uncalı", b: "konyaalti", x: 262, y: 372 }, { ad: "Altınkum", b: "konyaalti", x: 290, y: 424 }, { ad: "Gürsu", b: "konyaalti", x: 238, y: 410 },
    { ad: "Meltem", b: "muratpasa", x: 368, y: 404 }, { ad: "Yeşilbahçe", b: "muratpasa", x: 470, y: 412 }, { ad: "Şirinyalı", b: "muratpasa", x: 528, y: 446 },
    { ad: "Kızılarık", b: "muratpasa", x: 520, y: 378 }, { ad: "Fener", b: "muratpasa", x: 590, y: 452 }, { ad: "Güzeloba", b: "muratpasa", x: 640, y: 420 }, { ad: "Lara", b: "muratpasa", x: 686, y: 458 },
    { ad: "Fabrikalar", b: "kepez", x: 392, y: 330 }, { ad: "Teomanpaşa", b: "kepez", x: 458, y: 322 }, { ad: "Göksu", b: "kepez", x: 420, y: 274 },
    { ad: "Kütükçü", b: "kepez", x: 500, y: 250 }, { ad: "Varsak", b: "kepez", x: 560, y: 206 }, { ad: "Şafak", b: "kepez", x: 360, y: 262 },
    { ad: "Yeniköy", b: "dosemealti", x: 352, y: 128 }, { ad: "Altınkale", b: "dosemealti", x: 430, y: 94 },
    { ad: "Altıntaş", b: "aksu", x: 716, y: 316 }, { ad: "Kemerağzı", b: "aksu", x: 760, y: 404 }, { ad: "Çalkaya", b: "aksu", x: 796, y: 334 },
    { ad: "Belek", b: "serik", x: 900, y: 438 }, { ad: "Serik merkez", b: "serik", x: 936, y: 320 }
  ],
  atolye: { x: 452, y: 362, ad: "Atölye (örnek konum)" },

  saatler: ["09:00–12:00", "12:00–15:00", "15:00–18:00", "18:00–21:00"],

  /* canlı takip örneği */
  takip: {
    kod: "ABS-24117", musteri: "Selin K.", cihaz: "Lenovo IdeaPad 3 15", belirti: "Aşırı ısınma, fan sesi", mahalle: "Şirinyalı",
    adimlar: [
      { id: "alindi", ad: "Kapıdan teslim alındı", saat: "Pzt 10:42", not: "Kurye Emre cihazı çanta ve adaptörle teslim aldı. Mühürlü servis poşeti no: 0417." },
      { id: "teshis", ad: "Teşhis", saat: "Pzt 14:15", not: "Fan rulmanı aşınmış, termal macun kurumuş. Isı borusu sağlam. Fotoğraflar eklendi." },
      { id: "onay", ad: "Fiyat onayı", saat: "", not: "Teşhis sonrası net fiyat: Fan değişimi + termal macun. Onayınız olmadan işlem yapılmaz." },
      { id: "onarim", ad: "Onarım", saat: "", not: "Yeni fan takıldı, termal macun yenilendi; 2 saat yük testi." },
      { id: "teslim", ad: "Kapınıza teslim", saat: "", not: "Kurye yola çıktığında canlı konum paylaşılır." }
    ],
    teklif: { kalem: [["Laptop fanı (Lenovo IdeaPad 3 uyumlu)", 1150], ["Termal macun + temizlik", 450], ["Kapıdan alım ve teslim", 0]] }
  },

  ekip: [
    { id: "hakan", ad: "Hakan", rol: "Teknisyen · anakart", renk: "#246AF4" },
    { id: "burak", ad: "Burak", rol: "Teknisyen · laptop", renk: "#0EA5A4" },
    { id: "emre", ad: "Emre", rol: "Kurye · batı hattı", renk: "#F08A24" },
    { id: "okan", ad: "Okan", rol: "Kurye · doğu hattı", renk: "#8B5CF6" }
  ],

  kolonlar: [
    { id: "yeni", ad: "Yeni kayıt" }, { id: "alim", ad: "Alım bekliyor" }, { id: "teshis", ad: "Teşhiste" }, { id: "onay", ad: "Onay bekliyor" },
    { id: "onarim", ad: "Onarımda" }, { id: "hazir", ad: "Teslime hazır" }, { id: "teslim", ad: "Teslim edildi" }
  ],
  isler: [
    { no: "ABS-24131", ad: "Murat A.", cihaz: "Asus TUF F15", tur: "oyun", belirti: "Aşırı ısınma, fan sesi", mah: "Varsak", kol: "yeni", tek: "", saat: 0.4 },
    { no: "ABS-24130", ad: "Ece D.", cihaz: "HP 250 G8", tur: "laptop", belirti: "Ekran kırık / çizgili", mah: "Hurma", kol: "yeni", tek: "", saat: 0.9 },
    { no: "ABS-24129", ad: "Kerem Ö.", cihaz: "Canon G3410", tur: "yazici", belirti: "Kağıt çekmiyor", mah: "Fener", kol: "alim", tek: "okan", saat: 2.1 },
    { no: "ABS-24128", ad: "Nur S.", cihaz: "Dell Vostro 3510", tur: "laptop", belirti: "Şarj olmuyor", mah: "Uncalı", kol: "alim", tek: "emre", saat: 2.6 },
    { no: "ABS-24127", ad: "Ofis · Muhasebe", cihaz: "3× masaüstü", tur: "masaustu", belirti: "Bakım + SSD", mah: "Kızılarık", kol: "alim", tek: "okan", saat: 3.0, kurumsal: true },
    { no: "ABS-24125", ad: "Barış T.", cihaz: "Monster Abra A5", tur: "oyun", belirti: "Hiç açılmıyor", mah: "Göksu", kol: "teshis", tek: "hakan", saat: 5.5 },
    { no: "ABS-24123", ad: "Zehra Y.", cihaz: "Acer Aspire 5", tur: "laptop", belirti: "Sıvı döküldü", mah: "Lara", kol: "teshis", tek: "hakan", saat: 7.2, acil: true },
    { no: "ABS-24117", ad: "Selin K.", cihaz: "Lenovo IdeaPad 3", tur: "laptop", belirti: "Aşırı ısınma, fan sesi", mah: "Şirinyalı", kol: "onay", tek: "burak", saat: 20, fiyat: 1600 },
    { no: "ABS-24115", ad: "Can E.", cihaz: "MSI Katana GF66", tur: "oyun", belirti: "Ekran kartı / BGA", mah: "Altıntaş", kol: "onay", tek: "hakan", saat: 26, fiyat: 6200 },
    { no: "ABS-24112", ad: "Derya M.", cihaz: "HP Pavilion AIO", tur: "aio", belirti: "Çok yavaş", mah: "Meltem", kol: "onarim", tek: "burak", saat: 30, fiyat: 2900 },
    { no: "ABS-24110", ad: "Hasan K.", cihaz: "Lenovo V15", tur: "laptop", belirti: "Menteşe kırık", mah: "Sarısu", kol: "onarim", tek: "burak", saat: 33, fiyat: 1800 },
    { no: "ABS-24108", ad: "Gül A.", cihaz: "Casper Nirvana", tur: "laptop", belirti: "Klavye / touchpad", mah: "Teomanpaşa", kol: "onarim", tek: "burak", saat: 40, fiyat: 1700 },
    { no: "ABS-24104", ad: "Okul · İdari", cihaz: "Asus VivoBook", tur: "laptop", belirti: "BIOS şifresi", mah: "Belek", kol: "hazir", tek: "hakan", saat: 50, fiyat: 1500, kurumsal: true },
    { no: "ABS-24101", ad: "Emine B.", cihaz: "Dell Inspiron 15", tur: "laptop", belirti: "Ekran kırık", mah: "Güzeloba", kol: "hazir", tek: "burak", saat: 52, fiyat: 3900 },
    { no: "ABS-24096", ad: "Tolga Ç.", cihaz: "Toplama PC", tur: "masaustu", belirti: "Mavi ekran", mah: "Kütükçü", kol: "teslim", tek: "hakan", saat: 70, fiyat: 1400 },
    { no: "ABS-24092", ad: "Aylin R.", cihaz: "MacBook Air 2017", tur: "laptop", belirti: "Veri kurtarma", mah: "Liman", kol: "teslim", tek: "hakan", saat: 75, fiyat: 3200 }
  ],

  stok: [
    { kod: "EK-156-30", ad: "15.6\" FHD IPS ekran · 30 pin", kat: "Ekran", adet: 3, min: 4, uyum: "Lenovo / HP / Asus" },
    { kod: "EK-156-40", ad: "15.6\" FHD 144Hz ekran · 40 pin", kat: "Ekran", adet: 1, min: 2, uyum: "Oyun laptopları" },
    { kod: "SSD-512", ad: "NVMe SSD 512 GB", kat: "Depolama", adet: 9, min: 5, uyum: "M.2 2280" },
    { kod: "SSD-1TB", ad: "NVMe SSD 1 TB", kat: "Depolama", adet: 4, min: 3, uyum: "M.2 2280" },
    { kod: "RAM-8D4", ad: "8 GB DDR4 SODIMM 3200", kat: "Bellek", adet: 12, min: 6, uyum: "Laptop" },
    { kod: "RAM-16D4", ad: "16 GB DDR4 SODIMM 3200", kat: "Bellek", adet: 5, min: 4, uyum: "Laptop" },
    { kod: "FAN-LIP3", ad: "Fan · Lenovo IdeaPad 3 15", kat: "Soğutma", adet: 2, min: 2, uyum: "IdeaPad 3 15IIL05/15ITL6" },
    { kod: "FAN-HP250", ad: "Fan · HP 250 G7/G8", kat: "Soğutma", adet: 0, min: 2, uyum: "HP 250/255" },
    { kod: "TM-PRO", ad: "Termal macun (yüksek iletken)", kat: "Sarf", adet: 14, min: 6, uyum: "Genel" },
    { kod: "KLV-ASX5", ad: "Klavye · Asus X515 TR", kat: "Klavye", adet: 1, min: 2, uyum: "Asus X515/X509" },
    { kod: "DC-65W", ad: "Şarj adaptörü 65 W · USB-C", kat: "Güç", adet: 6, min: 3, uyum: "USB-C PD" },
    { kod: "DCJ-LEN", ad: "DC jack · Lenovo kare uç", kat: "Güç", adet: 7, min: 4, uyum: "Lenovo" },
    { kod: "BGA-N17", ad: "GPU çipi (reballing stoğu)", kat: "Anakart", adet: 2, min: 1, uyum: "NVIDIA N17 serisi" },
    { kod: "MNT-DLL", ad: "Menteşe takımı · Dell Inspiron 15", kat: "Kasa", adet: 3, min: 2, uyum: "Inspiron 3510/3511" }
  ],

  /* bildirim şablonları · {ad} {no} {cihaz} {saat} {tutar} {link} */
  sablonlar: [
    { id: "kayit", ad: "Kayıt alındı", acik: true, metin: "Merhaba {ad}, {cihaz} için arıza kaydınız alındı. Kayıt no: {no}. Kurye randevunuz: {saat}. Takip: {link}" },
    { id: "yolda", ad: "Kurye yolda", acik: true, metin: "{ad}, kuryemiz cihazınızı almak için yola çıktı, yaklaşık 15 dk. Canlı konum: {link}" },
    { id: "teshis", ad: "Teşhis + fiyat onayı", acik: true, metin: "{no} teşhis tamamlandı. Net tutar {tutar}. Onaylamak için: {link} · Onayınız olmadan işlem yapılmaz." },
    { id: "hazir", ad: "Onarım bitti", acik: true, metin: "Müjde {ad}! {cihaz} onarıldı ve testten geçti. Teslim saatini seçin: {link}" },
    { id: "yorum", ad: "Teslim sonrası yorum", acik: true, metin: "{ad}, cihazınız elinize ulaştı. Deneyiminizi Google'da paylaşır mısınız? {link}" },
    { id: "bakim", ad: "6 ay bakım hatırlatma", acik: false, metin: "{ad}, {cihaz} için 6 aylık fan/toz bakım zamanı geldi. Kapıdan alım randevusu: {link} (yalnız ileti izni verenlere)" }
  ],

  /* ÖRNEK aylık rapor verisi (Eylül 2026 senaryosu) — gerçek işletme verisi değil */
  rapor: {
    haftalik: [["1. hafta", 38], ["2. hafta", 44], ["3. hafta", 41], ["4. hafta", 52]],
    tur: [["Laptop / Notebook", 104], ["Masaüstü", 27], ["Oyun bilgisayarı", 22], ["All In One", 11], ["Yazıcı", 11]],
    bolge: [["Muratpaşa · Lara", 58], ["Kepez", 49], ["Konyaaltı", 39], ["Aksu", 14], ["Döşemealtı", 9], ["Serik · Belek", 6]],
    sure: [["Mar", 3.9], ["Nis", 3.6], ["May", 3.7], ["Haz", 3.3], ["Tem", 3.1], ["Ağu", 3.0], ["Eyl", 2.7]],
    onay: { gonderilen: 160, onaylanan: 131 }
  }
};
