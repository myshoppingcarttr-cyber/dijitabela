/* Mermerler Gayrimenkul · örnek veri (son güncelleme 22 Ekim 2026: sahibinden mağazasındaki 14 ilanın tamamı + FB'deki yeni 3+1)
   Kapak fotoğrafları (img/sb-<ilan no>.jpg) Mermerler Gayrimenkul'ün kendi sahibinden ilanlarından.
   Kaynak: ofisin herkese açık sahibinden mağazası (başlık, fiyat, tarih) + Facebook ilan gönderileri (m², kat, cephe, fotoğraf).
   null = ilanda yazmayan bilgi → sitede "Ofise sorun" görünür; panelden doldurulunca kartta otomatik çıkar. */
window.MG = {
  ofis: {
    ad: "Mermerler Gayrimenkul",
    kisa: "MERMERLER",
    yetkili: "Arif Mermer",
    tel1: "0538 440 04 29", wa: "905384400429",
    tel2: "0538 899 28 18",
    yetki: "0703590",
    adres: "Korkuteli / Antalya",
    konum: { lat: 37.072055, lng: 30.2146784 },
    google: "https://www.google.com/maps?cid=8036669887369020694",
    puan: "5,0", yorum: 7,
    sahibinden: "https://mermerlergayrimenkulkorkuteli.sahibinden.com",
    facebook: "https://www.facebook.com/ervaemlakkorkutel",
    acilis: 8, kapanis: 19,
    guncelleme: "22 Ekim 2026",
    fotoNot: "Fotoğraflar Mermerler Gayrimenkul'ün kendi ilanlarından"
  },
  mahalle: {
    "Uzunoluk":   { lat: 37.0751, lng: 30.2032, not: "Yeni yapılaşmanın yoğun olduğu, siteli ve asansörlü binaların arttığı mahalle." },
    "Kiremitli":  { lat: 37.0703, lng: 30.1977, not: "Çarşıya yürüme mesafesi; bankalar, fırın, okul hemen yanında." },
    "Yeni Mahalle": { lat: 37.0614, lng: 30.2131, not: "Otogar ve parklara yakın; kiralık 1+1 / 2+1 talebi en yüksek bölge." },
    "Aşağıpazar": { lat: 37.0634, lng: 30.1913, not: "İlçe merkezinin kalbi; her yere yürüme mesafesi, Korkuteli manzaralı katlar." },
    "Karşıyaka":  { lat: 37.0585, lng: 30.1990, yaklasik: true, not: "Merkeze yakın, yeni binaların yükseldiği sakin mahalle." },
    "Kevzer":     { lat: 37.1831, lng: 30.1763, not: "Kuzeyde, bahçe ve konut arsası arayanların tercihi." },
    "Bozova":     { lat: 37.2138, lng: 30.2852, not: "Ateşintepe mevkii; geniş arsa ve tarla parselleri." },
    "Akyar":      { lat: 37.1605, lng: 30.1796, not: "Meyve bahçeleri; erik ve ceviz arazileri." },
    "Taşkesik":   { lat: 37.0200, lng: 30.2550, yaklasik: true, not: "Uygun fiyatlı arsa ve tarla parselleri." },
    "Karataş":    { lat: 37.0150, lng: 30.1500, yaklasik: true, not: "Taban tarla; elektrik, su ve yol mevcut parseller." },
    "Simandır (Susuz)": { lat: 37.1100, lng: 30.1300, yaklasik: true, not: "Kadastro yolu olan tarla parselleri." },
    "Çomaklı":    { lat: 37.1000, lng: 30.2500, yaklasik: true, not: "Müstakil ev ve bahçe arayanlar için köy dokusu." }
  },
  ilanlar: [
    { no: "MG-115", yeni: true, durum: "Satılık", tur: "Daire", baslik: "Uzunoluk'ta giriş kat 3+1, sıfır ayarında", mahalle: "Uzunoluk", oda: "3+1", m2: 130, kat: "Giriş kat", binaYasi: null, aidat: null, fiyat: null, tarih: "21 Ekim 2026",
      ozellik: ["Doğalgazlı", "Güney-batı-kuzey cepheli", "Panjurlu", "Merkezi konum", "Az kullanılmış"],
      foto: ["u31-16", "u31-02", "u31-03", "u31-17", "u31-12", "u31-04", "u31-09", "u31-10", "u31-11", "u31-05", "u31-06", "u31-19", "u31-18", "u31-07", "u31-08", "u31-20", "u31-21", "u31-13", "u31-14", "u31-15", "u31-01", "u31-22", "u31-23", "u31-24", "u31-25"], kaynak: "Facebook ilanı" },
    { no: "1342471715", durum: "Satılık", tur: "Daire", baslik: "Aşağıpazar'da 2+1 sıfır, kapalı otoparklı", mahalle: "Aşağıpazar", oda: "2+1", m2: 115, kat: "3. kat", binaYasi: 0, aidat: null, fiyat: 4500000, tarih: "11 Ekim 2026",
      ozellik: ["Doğalgaz kapıda", "Doğu-güney cepheli", "Kapalı otopark", "Önü açık", "Asansör yok"], foto: ["sb-1342471715", "ap-01", "ap-02", "ap-03", "ap-04", "ap-05"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-satilik-mermerler-gayrimenkul-den-korkuteli-asagipazar-mah-2-plus1-sifir-1342471715/detay" },
    { no: "1263164193", durum: "Satılık", tur: "Daire", baslik: "Uzunoluk'ta 2+1 sıfır daire, geniş balkonlu", mahalle: "Uzunoluk", oda: "2+1", m2: 95, kat: "2. kat", binaYasi: 0, aidat: null, fiyat: 4050000, tarih: "11 Ekim 2026",
      ozellik: ["Ayrı mutfak", "Güney cepheli", "Geniş balkon", "Doğalgaz kapıda", "Açık otopark"], foto: ["sb-1263164193", "us-01", "us-02", "us-03", "us-04", "us-05"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-satilik-mermerler-gayrimenkul-den-korkuteli-uzunoluk-mah-2-plus1-sifir-daire-1263164193/detay" },
    { no: "1336351016", durum: "Satılık", tur: "Daire", baslik: "Uzunoluk'ta geniş ve uygun 2+1", mahalle: "Uzunoluk", oda: "2+1", m2: 115, kat: "3. kat", binaYasi: "18-20", aidat: null, fiyat: 2250000, eskiFiyat: 2550000, tarih: "11 Ekim 2026",
      ozellik: ["Cam balkon", "Doğu-kuzey cepheli", "Yol cephe", "Masrafsız", "Takas değerlendirilir"], foto: ["sb-1336351016", "ug-02", "ug-01", "ug-03", "ug-04", "ug-05"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-satilik-mermerler-gayrimenkul-den-korkuteli-uzunoluk-mah-genis-uygun-2-plus1-1336351016/detay" },
    { no: "1288154550", durum: "Satılık", tur: "Dubleks", baslik: "Yeni Mahalle'de 4+2 dubleks, sıfır ayarında", mahalle: "Yeni Mahalle", oda: "4+2", m2: null, kat: "Dubleks", binaYasi: null, aidat: null, fiyat: 5850000, tarih: "9 Ekim 2026",
      ozellik: ["Sıfır ayarında", "Dubleks"], foto: ["sb-1288154550"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-satilik-mermerler-gayrimenkul-den-yeni-mahalle-4-plus2-dubleks-sifir-ayarind-1288154550/detay" },
    { no: "1281734244", durum: "Satılık", tur: "Müstakil ev", baslik: "Çomaklı'da müstakil ev 2+1", mahalle: "Çomaklı", oda: "2+1", m2: null, kat: "Müstakil", binaYasi: null, aidat: null, fiyat: 3650000, tarih: "22 Ekim 2026",
      ozellik: ["Müstakil", "Bahçeli yaşam"], foto: ["sb-1281734244"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-satilik-mermerler-gayrimenkul-den-korkuteli-comakli-mah-mustakil-ev-2-plus1-1281734244/detay" },
    { no: "1345943729", durum: "Kiralık", tur: "Daire", baslik: "Yeni Mahalle'de kiralık 2+1, doğalgazlı 3. kat", mahalle: "Yeni Mahalle", oda: "2+1", m2: null, kat: "3. kat", binaYasi: null, aidat: null, fiyat: 13500, tarih: "15 Ekim 2026",
      ozellik: ["Doğalgazlı", "Açık mutfak", "Güney cepheli", "Panjurlu", "Otogar yanı"], foto: ["sb-1345943729", "ky-01", "ky-02", "ky-03", "ky-04", "ky-05"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-kiralik-mermerler-gayrimenkul-den-kiralik-yeni-mah-2-plus1-dogalgazli-3.kat-1345943729/detay" },
    { no: "1342473697", durum: "Kiralık", tur: "Daire", baslik: "Kiremitli'de kiralık 3+1, doğalgazlı", mahalle: "Kiremitli", oda: "3+1", m2: 140, kat: "Ara kat", binaYasi: null, aidat: null, fiyat: 17750, tarih: "11 Ekim 2026",
      ozellik: ["Doğalgazlı", "Güney-batı-kuzey cepheli", "Çarşıya yürüme mesafesi"], foto: ["kk-03", "kk-01", "kk-02", "kk-04", "kk-05"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-konut-kiralik-mermerler-gayrimenkul-den-kiralik-kiremitli-mah-3-plus1-dogalgazli-1342473697/detay" },
    { no: "1314208519", durum: "Satılık", tur: "Tarla", baslik: "Karataş'ta 6.700 m² taban tarla", mahalle: "Karataş", oda: null, m2: 6700, kat: null, binaYasi: null, aidat: 0, fiyat: 4200000, tarih: "11 Ekim 2026",
      ozellik: ["Elektrik", "Su", "Yol mevcut", "Köye yürüme mesafesi"], foto: ["kt-02", "kt-01", "sb-1314208519"], harita: true, kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-karatas-mah-6700-m2-tarla-1314208519/detay" },
    { no: "1282232727", durum: "Satılık", tur: "Tarla", baslik: "Simandır (Susuz) mevkii tarla", mahalle: "Simandır (Susuz)", oda: null, m2: null, kat: null, binaYasi: null, aidat: 0, fiyat: 1899000, tarih: "9 Ekim 2026",
      ozellik: ["Resmi kadastro yolu", "Elektrik", "Su sıkıntısı yok"], foto: ["sb-1282232727", "st-03", "st-01", "st-02"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-satilik-korkuteli-simandir-susuz-tarla-1282232727/detay" },
    { no: "1330860239", durum: "Satılık", tur: "Arsa", baslik: "Kevzer'de 476 m² arsa", mahalle: "Kevzer", oda: null, m2: 476, kat: null, binaYasi: null, aidat: 0, fiyat: 1585000, tarih: "11 Ekim 2026",
      ozellik: ["Konut arsası"], foto: ["uydu-kevzer", "sb-1330860239"], uydu: true, kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-kevzer-mah-476-m2-arsa-1330860239/detay" },
    { no: "1336673093", durum: "Satılık", tur: "Arsa", baslik: "Bozova Ateşintepe'de 500 m² arsa", mahalle: "Bozova", oda: null, m2: 500, kat: null, binaYasi: null, aidat: 0, fiyat: 2099000, tarih: "11 Ekim 2026",
      ozellik: ["Ateşintepe mevkii"], foto: ["sb-1336673093", "uydu-bozova"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-bozova-atesintepe-500-m2arsa-1336673093/detay" },
    { no: "1330858889", durum: "Satılık", tur: "Arsa", baslik: "Taşkesik'te 500 m² arsa", mahalle: "Taşkesik", oda: null, m2: 500, kat: null, binaYasi: null, aidat: 0, fiyat: 550000, tarih: "11 Ekim 2026", ozellik: ["Uygun fiyat"], foto: ["sb-1330858889"], harita: true, kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-taskesik-mah-500-m2-arsa-1330858889/detay" },
    { no: "1315958708", durum: "Satılık", tur: "Tarla", baslik: "Taşkesik'te 778 m² tarla", mahalle: "Taşkesik", oda: null, m2: 778, kat: null, binaYasi: null, aidat: 0, fiyat: 600000, tarih: "22 Ekim 2026", ozellik: [], foto: ["sb-1315958708"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-taskesik-mah-778-m2-tarla-1315958708/detay" },
    { no: "1315954003", durum: "Satılık", tur: "Tarla", baslik: "Taşkesik'te 410 m² tarla", mahalle: "Taşkesik", oda: null, m2: 410, kat: null, binaYasi: null, aidat: 0, fiyat: 265000, tarih: "22 Ekim 2026", ozellik: [], foto: ["sb-1315954003"], kaynak: "sahibinden", shb: "https://www.sahibinden.com/ilan/emlak-arsa-satilik-mermerler-gayrimenkul-den-korkuteli-taskesik-mah-410-m2-tarla-1315954003/detay" }
  ]
};
