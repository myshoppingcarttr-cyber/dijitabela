// CCH Teknoloji prototipleri için ortak veri (cchteknoloji.com.tr ve store.cchteknoloji.com'dan alındı, 4 Eki 2026)
window.CCH = {
  firma: {
    ad: "CCH Teknoloji", unvan: "CCH Teknoloji Ltd. Şti.",
    adres: "Gersan Sanayi Sitesi 2308. Cad. No: 26 Yenimahalle / ANKARA",
    tel: "+90 312 255 47 59", gsm: "0546 503 30 35", destekTel: "+90 533 580 45 43",
    eposta: "info@cchteknoloji.com.tr", destekEposta: "destek@cchteknoloji.com.tr",
    saat: "Pzt–Cum 09:00–18:00", kurulus: 2014, puan: 4.9, yorum: 107
  },
  malzemeler: ["CARBON (CF)", "ULTEM", "PA", "PP", "e-STEEL", "e-BRONZE", "e-COPPER", "ASA", "PC", "PETG", "HIPS", "TPU", "ABS+", "PLA+", "WOOD", "TPE"],
  yazicilar: [
    { id: "ct1000", ad: "CT-1000", seri: "Endüstriyel", tek: "FDM", hacim: [1000, 1000, 1000], olcu: "1900 × 1800 × 2200 mm", nozul: "0,6 / 0,8 / 1,0 / 1,2 mm", img: "ct-1000-x1.webp", img2: "ct-1000-x2.webp", fiyat: null, ozet: "Büyük boy endüstriyel üretim; 1 metreküp baskı hacmi.", tumMalzeme: true },
    { id: "m50", ad: "M50", seri: "Endüstriyel", tek: "FDM", hacim: [500, 500, 500], olcu: "850 × 800 × 1600 mm", nozul: "0,2 / 0,4 / 0,6 / 0,8 / 1,0 mm", img: "m50-x1.webp", img2: "m50-x2.webp", fiyat: null, ozet: "Orta-büyük parçalar, mühendislik malzemeleri, seri üretim.", tumMalzeme: true },
    { id: "m30", ad: "M30", seri: "Endüstriyel", tek: "FDM", hacim: [300, 300, 300], olcu: "650 × 600 × 1400 mm", nozul: "0,2 / 0,4 / 0,6 / 0,8 / 1,0 mm", img: "m30-x2.webp", img2: "m30-x2.webp", fiyat: null, ozet: "Kompakt endüstriyel; atölye ve Ar-Ge için ideal.", tumMalzeme: true },
    { id: "d400", ad: "D-400", seri: "Endüstriyel", tek: "DLP (reçine)", hacim: [300, 200, 400], olcu: "650 × 600 × 1400 mm", nozul: "—", img: "D400-x1.webp", img2: "D400-x1.webp", fiyat: null, ozet: "Reçine ile yüksek detay; diş, kuyum, medikal model.", tumMalzeme: false },
    { id: "x30", ad: "X30", seri: "Masaüstü", tek: "FDM", hacim: null, img: null, fiyat: 54000, ozet: "Masaüstü seri, profesyonel kullanım." },
    { id: "z35", ad: "Z35", seri: "Masaüstü", tek: "FDM", hacim: null, img: null, fiyat: 44000, ozet: "Masaüstü seri, geniş tabla." },
    { id: "z23", ad: "Z23", seri: "Masaüstü", tek: "FDM", hacim: null, img: null, fiyat: 37000, ozet: "Masaüstü seri, giriş seviyesi profesyonel." }
  ],
  yorumlar: [
    { ad: "Celal Ş. · Silüet Maket", metin: "Firma 3B baskı işlerinde gayet hızlı ve ilgili. 3B makine üretiminde de profesyoneller, kendi markaları MY yazıcılarla çok hassas baskılar alıyorlar." },
    { ad: "mustygurcan", metin: "Tüm çalışanlar ve cihazlar dahil her şey profesyonel. Satışını yaptığınız aletin her zaman arkasında olmanız ve bilgilendirmekten bıkmamanız için teşekkürler." }
  ],
  // 3D baskı hizmeti fiyat modeli (prototip; gerçek fiyatlar CCH tarafından girilir)
  baskiMalzeme: [
    { ad: "PLA+", yogunluk: 1.24, tlGram: 3.2, renk: "#e9e9e9" },
    { ad: "PETG", yogunluk: 1.27, tlGram: 3.6, renk: "#9fd3ff" },
    { ad: "ABS+", yogunluk: 1.04, tlGram: 3.8, renk: "#f4f4f4" },
    { ad: "ASA", yogunluk: 1.07, tlGram: 4.4, renk: "#d9d9d9" },
    { ad: "TPU", yogunluk: 1.21, tlGram: 6.5, renk: "#ff6a3d" },
    { ad: "PA (Naylon)", yogunluk: 1.14, tlGram: 7.5, renk: "#f2efe6" },
    { ad: "CARBON (CF)", yogunluk: 1.30, tlGram: 9.5, renk: "#2b2b2b" },
    { ad: "ULTEM", yogunluk: 1.27, tlGram: 38, renk: "#c98a2b" }
  ]
};
