// Kafe demo: üç ekranın ortak verisi (tarayıcıda saklanır; saklama kapalıysa bellekte çalışır)
window.KAFE = (function () {
  const ANAHTAR = "dijitabela-kafe-demo-v1";
  const HAM = [
    { id: "kc", ad: "Espresso çekirdeği", birim: "g", stok: 2400, kritik: 1000, maliyet: 1.15 },
    { id: "tk", ad: "Türk kahvesi", birim: "g", stok: 900, kritik: 500, maliyet: 0.9 },
    { id: "su", ad: "Süt", birim: "ml", stok: 9000, kritik: 4000, maliyet: 0.045 },
    { id: "cy", ad: "Çay", birim: "g", stok: 1800, kritik: 600, maliyet: 0.32 },
    { id: "lm", ad: "Limon", birim: "adet", stok: 22, kritik: 15, maliyet: 6 },
    { id: "ek", ad: "Tost ekmeği", birim: "dilim", stok: 46, kritik: 20, maliyet: 3.2 },
    { id: "ks", ad: "Kaşar", birim: "g", stok: 1900, kritik: 800, maliyet: 0.42 },
    { id: "sc", ad: "Sucuk", birim: "g", stok: 700, kritik: 400, maliyet: 0.9 },
    { id: "ch", ad: "Cheesecake", birim: "dilim", stok: 9, kritik: 4, maliyet: 48 },
    { id: "br", ad: "Brownie", birim: "adet", stok: 14, kritik: 5, maliyet: 26 },
    { id: "sw", ad: "Su (0,5 L)", birim: "adet", stok: 60, kritik: 24, maliyet: 4.5 },
    { id: "sd", ad: "Soda", birim: "adet", stok: 18, kritik: 24, maliyet: 7 },
    { id: "bd", ad: "Karton bardak", birim: "adet", stok: 140, kritik: 100, maliyet: 2.1 }
  ];
  const URUN = [
    { id: 1, ad: "Türk kahvesi", kat: "Sıcak", f: 80, r: { tk: 7 }, yer: "bar" },
    { id: 2, ad: "Espresso", kat: "Sıcak", f: 75, r: { kc: 9 }, yer: "bar" },
    { id: 3, ad: "Americano", kat: "Sıcak", f: 95, r: { kc: 18 }, yer: "bar" },
    { id: 4, ad: "Latte", kat: "Sıcak", f: 115, r: { kc: 18, su: 220 }, yer: "bar" },
    { id: 5, ad: "Cappuccino", kat: "Sıcak", f: 110, r: { kc: 18, su: 160 }, yer: "bar" },
    { id: 6, ad: "Çay", kat: "Sıcak", f: 25, r: { cy: 3 }, yer: "bar" },
    { id: 7, ad: "Ice latte", kat: "Soğuk", f: 125, r: { kc: 18, su: 200, bd: 1 }, yer: "bar" },
    { id: 8, ad: "Limonata", kat: "Soğuk", f: 90, r: { lm: 2, bd: 1 }, yer: "bar" },
    { id: 9, ad: "Su", kat: "Soğuk", f: 20, r: { sw: 1 }, yer: "bar" },
    { id: 10, ad: "Soda", kat: "Soğuk", f: 35, r: { sd: 1 }, yer: "bar" },
    { id: 11, ad: "Kaşarlı tost", kat: "Yiyecek", f: 120, r: { ek: 2, ks: 60 }, yer: "mutfak" },
    { id: 12, ad: "Karışık tost", kat: "Yiyecek", f: 145, r: { ek: 2, ks: 50, sc: 40 }, yer: "mutfak" },
    { id: 13, ad: "Cheesecake", kat: "Tatlı", f: 140, r: { ch: 1 }, yer: "mutfak" },
    { id: 14, ad: "Brownie", kat: "Tatlı", f: 110, r: { br: 1 }, yer: "mutfak" }
  ];
  function ornekSatis() {
    const s = [], simdi = Date.now();
    const sec = [[1, 2], [4, 1], [6, 4], [11, 1], [5, 2], [8, 1], [13, 1], [3, 1], [12, 2], [7, 1]];
    for (let i = 0; i < 26; i++) {
      const k = [sec[i % sec.length], sec[(i * 3 + 1) % sec.length]];
      const kalem = k.map(x => ({ id: x[0], adet: x[1] }));
      s.push({ no: 1000 + i, t: simdi - (26 - i) * 17 * 60000, masa: "M" + (1 + (i % 8)), kalem, odeme: i % 3 ? "Kart" : "Nakit" });
    }
    return s;
  }
  function yeni() { return { ham: JSON.parse(JSON.stringify(HAM)), satis: ornekSatis(), fatura: [], acik: {} }; }
  let veri;
  try { veri = JSON.parse(localStorage.getItem(ANAHTAR)) || yeni(); } catch (e) { veri = yeni(); }
  if (!veri.satis || !veri.satis.some(s => Date.now() - s.t < 864e5)) veri.satis = ornekSatis();
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(veri)); } catch (e) {} }
  function urun(id) { return URUN.find(u => u.id === id); }
  function ham(id) { return veri.ham.find(h => h.id === id); }
  function toplam(kalem) { return kalem.reduce((t, k) => t + urun(k.id).f * k.adet, 0); }
  function maliyet(u) { return Object.entries(u.r).reduce((t, [h, m]) => t + ham(h).maliyet * m, 0); }
  function satisYap(masa, kalem, odeme) {
    kalem.forEach(k => Object.entries(urun(k.id).r).forEach(([h, m]) => { ham(h).stok = Math.max(0, ham(h).stok - m * k.adet); }));
    const no = (veri.satis.length ? veri.satis[veri.satis.length - 1].no : 999) + 1;
    veri.satis.push({ no, t: Date.now(), masa, kalem, odeme });
    kaydet(); return no;
  }
  function faturaIsle(f) { f.kalem.forEach(k => { const h = ham(k.id); const eski = h.stok * h.maliyet; h.stok += k.miktar; h.maliyet = +((eski + k.tutar) / h.stok).toFixed(4); }); veri.fatura.unshift(f); kaydet(); }
  function sifirla() { veri = yeni(); kaydet(); }
  const tl = n => (Math.round(n * 100) / 100).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " ₺";
  return { get veri() { return veri; }, URUN, urun, ham, toplam, maliyet, satisYap, faturaIsle, kaydet, sifirla, tl };
})();
