/* Pasaport.io prototip verisi — Dijitabela, 20 Ekim 2026
   eSIM fiyatları: pasaport2.lovable.app (20.10.2026'da okunan TRY fiyatları).
   TR ve DE paket listeleri sitedeki gerçek listedir; diğer ülkelerde site yalnız "başlayan" fiyatı gösterdiği için
   paket basamakları ÖRNEK olarak türetilmiştir (ornek:true).
   Vignette ücretleri: 2026 resmî ücretler (ASFINAG, DARS, NDS vb.; binek araç ≤3,5 t). Bilgi amaçlıdır.
   Lounge: mevcut sitede hizmet şu an kapalı → isimler/fiyatlar ÖRNEKTİR. */
window.PPV = (function () {
  var TR_PAKET = [[1, 7, 222], [2, 15, 278], [3, 30, 334], [5, 30, 501], [10, 30, 779], [20, 30, 1112], [50, 30, 1724], [100, 30, 3004]];
  var DE_PAKET = [[1, 7, 222], [2, 15, 278], [3, 30, 334], [5, 30, 501], [10, 30, 723], [20, 30, 1112], [50, 30, 1780], [100, 30, 3449]];
  function turet(baslangic) { var k = baslangic / 222; return DE_PAKET.map(function (p) { return [p[0], p[1], Math.round(p[2] * k)]; }); }
  var ulkeler = [
    { k: "TR", ad: { tr: "Türkiye", en: "Türkiye", de: "Türkei" }, img: "ulke-tr.jpg", bas: 222, paket: TR_PAKET, bolge: "Asya" },
    { k: "DE", ad: { tr: "Almanya", en: "Germany", de: "Deutschland" }, img: "ulke-de.webp", bas: 222, paket: DE_PAKET, bolge: "Avrupa" },
    { k: "AT", ad: { tr: "Avusturya", en: "Austria", de: "Österreich" }, img: "ulke-at.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "FR", ad: { tr: "Fransa", en: "France", de: "Frankreich" }, img: "ulke-fr.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "IT", ad: { tr: "İtalya", en: "Italy", de: "Italien" }, img: "ulke-it.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "ES", ad: { tr: "İspanya", en: "Spain", de: "Spanien" }, img: "ulke-es.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "NL", ad: { tr: "Hollanda", en: "Netherlands", de: "Niederlande" }, img: "ulke-nl.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "GB", ad: { tr: "Birleşik Krallık", en: "United Kingdom", de: "Vereinigtes Königreich" }, img: "ulke-gb.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "US", ad: { tr: "Amerika Birleşik Devletleri", en: "United States", de: "USA" }, img: "ulke-us.webp", bas: 222, paket: turet(222), ornek: true },
    { k: "AE", ad: { tr: "Birleşik Arap Emirlikleri", en: "United Arab Emirates", de: "Vereinigte Arabische Emirate" }, img: "ulke-ae.webp", bas: 278, paket: turet(278), ornek: true }
  ];
  var bolgeler = [
    { k: "europe", ad: { tr: "Avrupa", en: "Europe", de: "Europa" }, img: "bolge-europe.webp", kap: "2–45", bas: 222,
      paket: [[1, 7, 222], [2, 15, 278], [3, 30, 389], [5, 30, 556], [10, 30, 890], [20, 30, 1502], [50, 30, 2837], [100, 30, 5006]] },
    { k: "asia", ad: { tr: "Asya", en: "Asia", de: "Asien" }, img: "bolge-asia.webp", kap: "5–14", bas: 334 },
    { k: "middle_east", ad: { tr: "Orta Doğu", en: "Middle East", de: "Naher Osten" }, img: "bolge-middle-east.webp", kap: "8–10", bas: 334 },
    { k: "americas", ad: { tr: "Amerika", en: "Americas", de: "Amerika" }, img: "bolge-americas.webp", kap: "3–29", bas: 334 },
    { k: "africa", ad: { tr: "Afrika", en: "Africa", de: "Afrika" }, img: "bolge-africa.webp", kap: "2–12", bas: 779 },
    { k: "oceania", ad: { tr: "Okyanusya", en: "Oceania", de: "Ozeanien" }, img: "bolge-oceania.webp", kap: "2", bas: 222 }
  ];
  bolgeler.forEach(function (b) { if (!b.paket) { var k = b.bas / 222; b.paket = bolgeler[0].paket.map(function (p) { return [p[0], p[1], Math.round(p[2] * k)]; }); b.ornek = true; } });

  /* Vignette / otoyol — 2026 resmî ücretler, € (binek araç ≤3,5 t) */
  var yol = {
    DE: { ad: { tr: "Almanya", en: "Germany", de: "Deutschland" }, tur: "yok", not: { tr: "Binek araç için otoyol ücretsiz.", en: "Motorways are free for cars.", de: "Für Pkw mautfrei." } },
    NL: { ad: { tr: "Hollanda", en: "Netherlands", de: "Niederlande" }, tur: "yok", not: { tr: "Otoyol ücretsiz (bazı tüneller hariç).", en: "Motorways free (some tunnels excepted).", de: "Autobahnen frei (einige Tunnel ausgenommen)." } },
    AT: { ad: { tr: "Avusturya", en: "Austria", de: "Österreich" }, tur: "vinyet", sec: [[1, 9.6], [10, 12.8], [60, 32], [365, 106.8]],
      not: { tr: "Dijital vignette plakaya bağlı. Online alınan 1 ve 10 günlük hemen geçerli; 2 aylık ve yıllık 18 gün sonra başlar.", en: "Digital, linked to plate. 1- and 10-day valid immediately online; 2-month/annual start after 18 days.", de: "Digital, kennzeichengebunden. 1- und 10-Tages sofort gültig; 2-Monats/Jahr erst nach 18 Tagen." } },
    SI: { ad: { tr: "Slovenya", en: "Slovenia", de: "Slowenien" }, tur: "vinyet", sec: [[7, 16], [30, 32], [365, 117.5]],
      not: { tr: "Yalnız dijital e-vinjeta, plakaya bağlı.", en: "Digital e-vinjeta only, linked to plate.", de: "Nur digitale e-vinjeta, kennzeichengebunden." } },
    HR: { ad: { tr: "Hırvatistan", en: "Croatia", de: "Kroatien" }, tur: "gise", not: { tr: "Vignette yok; otoyolda km başına gişe ücreti.", en: "No vignette; distance-based toll booths.", de: "Keine Vignette; streckenbezogene Maut." } },
    RS: { ad: { tr: "Sırbistan", en: "Serbia", de: "Serbien" }, tur: "gise", not: { tr: "Vignette yok; otoyolda gişe ücreti (dinar, € veya kart).", en: "No vignette; toll booths (dinar, € or card).", de: "Keine Vignette; Mautstellen (Dinar, € oder Karte)." } },
    HU: { ad: { tr: "Macaristan", en: "Hungary", de: "Ungarn" }, tur: "vinyet", sec: [[1, 15.28], [10, 18.99], [30, 30.75], [365, 170]],
      not: { tr: "e-matrica, plakaya bağlı. Ücret forint; € karşılığı yaklaşıktır.", en: "e-matrica, linked to plate. Priced in forint; € is approximate.", de: "e-matrica, kennzeichengebunden. Preis in Forint; € ca." } },
    RO: { ad: { tr: "Romanya", en: "Romania", de: "Rumänien" }, tur: "vinyet", sec: [[1, 4.17], [10, 5.68], [30, 9.09], [365, 48.12]],
      not: { tr: "Rovinieta (Euro 6 araç, € yaklaşık). Tuna köprüsü geçişi ayrıca ücretlidir.", en: "Rovinieta (Euro 6 car, € approx.). Danube bridge toll is separate.", de: "Rovinieta (Euro 6, € ca.). Donaubrücke separat mautpflichtig." } },
    BG: { ad: { tr: "Bulgaristan", en: "Bulgaria", de: "Bulgarien" }, tur: "vinyet", sec: [[7, 10], [30, 19.9], [365, 64.5]],
      not: { tr: "e-vinetka, plakaya bağlı.", en: "e-vinetka, linked to plate.", de: "e-vinetka, kennzeichengebunden." } },
    CZ: { ad: { tr: "Çekya", en: "Czechia", de: "Tschechien" }, tur: "vinyet", sec: [[1, 9.44], [10, 12.32], [30, 19.71], [365, 105.51]],
      not: { tr: "e-dálnice, plakaya bağlı. Ücret CZK; € yaklaşık.", en: "e-dálnice, linked to plate. CZK; € approx.", de: "e-dálnice, kennzeichengebunden. CZK; € ca." } },
    SK: { ad: { tr: "Slovakya", en: "Slovakia", de: "Slowakei" }, tur: "vinyet", sec: [[1, 8.1], [10, 10.8], [30, 17.1], [365, 90]],
      not: { tr: "e-známka, plakaya bağlı.", en: "e-známka, linked to plate.", de: "e-známka, kennzeichengebunden." } },
    CH: { ad: { tr: "İsviçre", en: "Switzerland", de: "Schweiz" }, tur: "vinyet", sec: [[365, 42.87]],
      not: { tr: "Yalnız yıllık vignette (40 CHF ≈ €).", en: "Annual vignette only (CHF 40 ≈ €).", de: "Nur Jahresvignette (CHF 40 ≈ €)." } },
    IT: { ad: { tr: "İtalya", en: "Italy", de: "Italien" }, tur: "gise", not: { tr: "Vignette yok; otoyolda km başına gişe ücreti.", en: "No vignette; distance-based tolls.", de: "Keine Vignette; streckenbezogene Maut." } },
    GR: { ad: { tr: "Yunanistan", en: "Greece", de: "Griechenland" }, tur: "gise", not: { tr: "Vignette yok; otoyolda gişe ücreti.", en: "No vignette; toll booths.", de: "Keine Vignette; Mautstellen." } },
    TR: { ad: { tr: "Türkiye", en: "Türkiye", de: "Türkei" }, tur: "hgs", not: { tr: "Otoyol ve köprüler için HGS etiketi gerekir.", en: "HGS tag required for motorways and bridges.", de: "HGS-Plakette für Autobahnen und Brücken nötig." } }
  };
  var rotalar = [
    { k: "r1", ad: { tr: "Klasik Sıla Yolu (Slovenya–Sırbistan)", en: "Classic route (Slovenia–Serbia)", de: "Klassische Route (Slowenien–Serbien)" }, u: ["DE", "AT", "SI", "HR", "RS", "BG", "TR"], km: 2600 },
    { k: "r2", ad: { tr: "Macaristan–Sırbistan", en: "Hungary–Serbia", de: "Ungarn–Serbien" }, u: ["DE", "AT", "HU", "RS", "BG", "TR"], km: 2450 },
    { k: "r3", ad: { tr: "Macaristan–Romanya (AB içinden)", en: "Hungary–Romania (inside EU)", de: "Ungarn–Rumänien (innerhalb EU)" }, u: ["DE", "AT", "HU", "RO", "BG", "TR"], km: 2700 },
    { k: "r4", ad: { tr: "Çekya–Slovakya–Romanya", en: "Czechia–Slovakia–Romania", de: "Tschechien–Slowakei–Rumänien" }, u: ["DE", "CZ", "SK", "HU", "RO", "BG", "TR"], km: 2750 },
    { k: "r5", ad: { tr: "İsviçre–İtalya + feribot (Yunanistan)", en: "Switzerland–Italy + ferry (Greece)", de: "Schweiz–Italien + Fähre (Griechenland)" }, u: ["DE", "CH", "IT", "GR", "TR"], km: 2300, feribot: true }
  ];

  var havalimanlari = [
    ["FRA", "Frankfurt"], ["MUC", "München"], ["DUS", "Düsseldorf"], ["CGN", "Köln/Bonn"], ["STR", "Stuttgart"], ["BER", "Berlin"], ["HAM", "Hamburg"],
    ["VIE", "Wien"], ["AMS", "Amsterdam"], ["IST", "İstanbul"], ["SAW", "İstanbul Sabiha Gökçen"], ["AYT", "Antalya"], ["ADB", "İzmir"], ["ESB", "Ankara"]
  ];
  var lounge = [];
  havalimanlari.forEach(function (h, i) {
    lounge.push({ kod: h[0], sehir: h[1], ad: "Business Lounge", term: "Terminal " + (i % 2 + 1), saat: 3, fiyat: 1290 + (i % 4) * 150, ozel: ["wifi", "yemek", "dus"].slice(0, 2 + (i % 2)) });
    if (i % 3 === 0) lounge.push({ kod: h[0], sehir: h[1], ad: "Premium Lounge", term: "Terminal " + (i % 2 + 1), saat: 4, fiyat: 1790 + (i % 3) * 120, ozel: ["wifi", "yemek", "dus", "sessiz"] });
  });

  /* eSIM cihaz uyumluluğu (genel liste; operatör kilidi açık olmalı) */
  var cihaz = {
    Apple: ["iPhone 17 / 17 Pro / Air", "iPhone 16 serisi", "iPhone 15 serisi", "iPhone 14 serisi", "iPhone 13 serisi", "iPhone 12 serisi", "iPhone 11 serisi", "iPhone XS / XS Max", "iPhone XR", "iPhone SE (2020, 2022)", "iPhone X ve öncesi"],
    Samsung: ["Galaxy S25 serisi", "Galaxy S24 serisi", "Galaxy S23 serisi", "Galaxy S22 serisi", "Galaxy S21 serisi", "Galaxy S20 serisi", "Galaxy Z Fold / Flip (3 ve sonrası)", "Galaxy A55 / A54", "Galaxy A35", "Galaxy A14 ve eski A serisi"],
    Google: ["Pixel 10 serisi", "Pixel 9 serisi", "Pixel 8 serisi", "Pixel 7 serisi", "Pixel 6 serisi", "Pixel 5 / 4", "Pixel 3a ve öncesi"],
    Xiaomi: ["Xiaomi 15 / 15 Pro", "Xiaomi 14 / 14 Pro", "Xiaomi 13 / 13 Pro / 13T", "Xiaomi 12T Pro", "Redmi Note 13 ve öncesi"],
    Huawei: ["P40 / P40 Pro", "Mate 40 Pro", "Pura 70 / P60 (bölgeye göre)", "Diğer Huawei"],
    Motorola: ["razr 40 / 50 serisi", "edge 40 / 50 serisi", "moto g serisi (çoğu)"],
    Other: ["Modelimi bilmiyorum"]
  };
  /* uyum: 1 = destekler, 0 = desteklemez, 2 = modele/bölgeye göre değişir */
  var uyum = {
    "iPhone X ve öncesi": 0, "Galaxy A14 ve eski A serisi": 0, "Pixel 3a ve öncesi": 2, "Redmi Note 13 ve öncesi": 0, "Diğer Huawei": 0,
    "Pura 70 / P60 (bölgeye göre)": 2, "moto g serisi (çoğu)": 2, "Galaxy A35": 2, "Modelimi bilmiyorum": 2
  };

  var yorumlar = [
    { ad: "Mert M.", t: "2026-09-28", m: "Almanya seyahatimde ilk kez eSIM kullandım. QR kod ile kurulumu yaptım, uçaktan indiğimde internetim direkt çalıştı. Gerçekten çok pratik." },
    { ad: "Laura M.", t: "2026-09-17", m: "Türkiye tatilim için satın aldım. İstanbul'a indikten sonra hemen internetim oldu. Kurulum beklediğimden çok daha kolaydı.", dil: "Almanca" },
    { ad: "Sophie V.", t: "2026-09-20", m: "Japonya seyahatimiz sırasında iki hafta kullandık. Tokyo, Osaka ve Kyoto'da her şey gayet iyi çalıştı, özellikle Google Maps ve tren uygulamaları.", dil: "Felemenkçe" },
    { ad: "James W.", t: "2026-10-02", m: "İtalya gezimizde, Roma'dan Floransa'ya kadar kullandık. Kurulumu kolaydı ve bağlantı gezinin büyük bölümünde iyi çalıştı.", dil: "İngilizce" },
    { ad: "Lucía R.", t: "2026-10-01", m: "Tayland tatilim boyunca Grab, Google Maps ve WhatsApp için kullandım. Havalimanında SIM kart almak için sıraya girmek zorunda kalmamak harikaydı.", dil: "İspanyolca" },
    { ad: "Mario B.", t: "2026-09-25", m: "Dubai'ye yaptığım bir iş seyahatinde kullandım. Varır varmaz zaten internete bağlıydım ve WhatsApp, Maps ve iş uygulamalarımı hemen kullanabildim.", dil: "İtalyanca" },
    { ad: "Anna K.", t: "2026-09-09", m: "İspanya ve Portekiz için bir paket satın aldım. Çok pratik bir çözüm, çünkü diğer ülkeye geçerken eSIM kartını değiştirmem gerekmedi.", dil: "Lehçe" }
  ];
  return { ulkeler: ulkeler, bolgeler: bolgeler, yol: yol, rotalar: rotalar, havalimanlari: havalimanlari, lounge: lounge, cihaz: cihaz, uyum: uyum, yorumlar: yorumlar, KUR: 55.62, HIZMET_EUR: 1.9, PAKET_INDIRIM: 0.1 };
})();
