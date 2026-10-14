// Terraura prototipleri için ortak veri (terraura.com.tr fiyat listesi ve sayfalarından alındı, 4 Eki 2026).
// "ornek: true" olan fiyatlar sitede bulunamadı; prototip için konuldu, panelden değiştirilir.
window.TR = {
  firma: { ad: "Terraura Koltuk Yıkama", yetkili: "Mehmet Yaprak", tel: "0507 724 08 99", wa: "905077240899", eposta: "info@terraura.com.tr",
    adres: "Liman Mah. 37. Sok. No: 9A, Konyaaltı / Antalya", ig: "terraurakoltukyikama", igTakip: "2,6 B" },
  // birim fiyatlar (sitedeki indirimli fiyatlar)
  urunler: [
    { id: "tekli", ad: "Tekli koltuk / berjer / TV koltuğu", fiyat: 300, sure: 25, ikon: "🪑" },
    { id: "kanepe", ad: "Kanepe / çekyat", fiyat: 800, sure: 50, ikon: "🛋️" },
    { id: "kose22", ad: "Köşe koltuk 2×2 (L)", fiyat: 1100, sure: 70, ikon: "📐" },
    { id: "kose33", ad: "Köşe koltuk 3×3 (L)", fiyat: 1600, sure: 90, ikon: "📐" },
    { id: "chester", ad: "Chester takım", fiyat: 2750, sure: 120, ikon: "👑" },
    { id: "bebek", ad: "Bebek yatağı", fiyat: 500, sure: 25, ikon: "🍼" },
    { id: "yatak2", ad: "Çift kişilik yatak", fiyat: 1450, sure: 45, ikon: "🛏️" },
    { id: "sandalye", ad: "Sandalye (adet)", fiyat: 150, sure: 8, ikon: "🪑", ornek: true },
    { id: "arac", ad: "Araç koltuğu (takım)", fiyat: 1500, sure: 90, ikon: "🚗", ornek: true },
    { id: "ofis", ad: "Ofis koltuğu (adet)", fiyat: 250, sure: 12, ikon: "💺", ornek: true }
  ],
  // sitedeki paket fiyatları: bu kombinasyon seçilirse otomatik uygulanır
  paketler: [
    { ad: "2 kanepe + 2 tekli", ic: { kanepe: 2, tekli: 2 }, fiyat: 2200 },
    { ad: "2 kanepe + 1 tekli", ic: { kanepe: 2, tekli: 1 }, fiyat: 2000 },
    { ad: "2 kanepe", ic: { kanepe: 2 }, fiyat: 1500 },
    { ad: "Kanepe + tekli", ic: { kanepe: 1, tekli: 1 }, fiyat: 1000 }
  ],
  ekler: [
    { id: "uvc", ad: "UV-C akar ve bakteri uygulaması", fiyat: 0, not: "Her işte dahil" },
    { id: "koruma", ad: "Leke koruyucu kaplama", fiyat: 250, ornek: true },
    { id: "evcil", ad: "Evcil hayvan kokusu giderme", fiyat: 200, ornek: true },
    { id: "hizli", ad: "Hızlı kurutma (fan)", fiyat: 150, ornek: true }
  ],
  ilceler: ["Konyaaltı", "Muratpaşa", "Lara", "Kepez", "Döşemealtı", "Aksu", "Kundu", "Kemer", "Serik"],
  // ilçe → hafta içi gün (rota planı: aynı gün aynı bölge)
  ilceGun: { "Konyaaltı": [1, 3, 5, 6], "Muratpaşa": [1, 2, 4, 6], "Lara": [2, 4, 6], "Kundu": [2, 4], "Kepez": [1, 3, 5], "Döşemealtı": [3, 6], "Aksu": [2, 5], "Kemer": [6], "Serik": [4] },
  hizmetler: ["Koltuk ve kanepe", "Yatak ve yatak başlığı", "Sandalye", "Araç koltuğu", "Ofis koltuğu", "Kafe – restoran koltuğu"],
  yontem: ["Kumaş analizi", "UV-C uygulaması", "Köpüklü fırçalama", "Buhar", "Güçlü vakumlama"]
};
window.tl = (n) => Number(n).toLocaleString("tr-TR") + " ₺";
// Seçilen ürünlerden fiyat: önce paketler (en avantajlı), kalan adetler birim fiyattan
window.fiyatHesapla = (adet) => {
  const kalan = { ...adet }, satir = []; let toplam = 0;
  for (const p of TR.paketler) {
    while (Object.entries(p.ic).every(([k, n]) => (kalan[k] || 0) >= n)) {
      Object.entries(p.ic).forEach(([k, n]) => (kalan[k] -= n));
      const liste = Object.entries(p.ic).reduce((s, [k, n]) => s + TR.urunler.find((u) => u.id === k).fiyat * n, 0);
      satir.push({ ad: "Paket: " + p.ad, fiyat: p.fiyat, kazanc: liste - p.fiyat }); toplam += p.fiyat;
    }
  }
  for (const u of TR.urunler) if (kalan[u.id] > 0) { satir.push({ ad: kalan[u.id] + " × " + u.ad, fiyat: u.fiyat * kalan[u.id], ornek: u.ornek }); toplam += u.fiyat * kalan[u.id]; }
  const sure = TR.urunler.reduce((s, u) => s + (adet[u.id] || 0) * u.sure, 0);
  return { satir, toplam, sure, kazanc: satir.reduce((s, x) => s + (x.kazanc || 0), 0) };
};
