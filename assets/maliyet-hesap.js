// MALİYET HESAP — ortak modül (14 Eki 2026, Ayaz). Hem ofis-maliyet.html (tarayıcı) hem SATIS\fiyat-hesap.js (node) kullanır.
// Tarayıcıda window.MALIYET, node'da module.exports. Sayfa için kopyası: ajans-sitesi\assets\maliyet-hesap.js (yayinla öncesi eşitlenir).
// FORMÜLLER (Patron, 14 Eki):
//   saatlik sabit gider = toplam aylık sabit gider / kapasite_saat
//   KDV KURALI (danışman, 14 Eki): TÜM TUTARLAR KDV HARİÇ. teklif_fiyat KDV HARİÇ kabul edilir; kâr (kırmızı/yeşil) KDV hariç tutar üzerinden hesaplanır.
//   Faturalıysa müşteriden alınacak KDV = teklif x kdv% AYRI gösterilir (kdvTutar), kâra/maliyete KATILMAZ; kdvDahil = teklif + kdvTutar (bilgi).
//   iş maliyeti = saat x saatlik + doğrudan maliyet + teklif x komisyon% + teklif x taksit%   (KDV yok)
//   net kâr = teklif - maliyet ; kâr % = net / teklif
//   saat = ölçüm varsa saat_gercek, yoksa saat_tahmin.
//   Renk: %15 altı kırmızı, %15-40 yeşil, %40 üstü mavi.
//   Aylık başa baş: bu ay kazanılan (durum ödendi/kazanıldı) işlerin KATKI payı (teklif KDV hariç - doğrudan - komisyon - taksit; sabit pay HARİÇ,
//   çünkü sabit gider zaten payda) / toplam aylık sabit gider.
(function (kok) {
  // Bağlantı yoksa kullanılan yerel yedek (Patron TEYİTLİ değerleri, 14 Eki 2026; USD kuru TCMB 13.10.2026 satış 49,3681).
  var YEDEK = {
    kapasite_saat: 650, usd_try: 49.3681, usd_try_kaynak: "yerel yedek: TCMB 13.10.2026 USD satış",
    giderler: [
      { kalem: "Elektrik", aylik_tl: 3000, para_birimi: "TRY", teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026" },
      { kalem: "İnternet", aylik_tl: 1100, para_birimi: "TRY", teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026" },
      { kalem: "Bağkur", aylik_tl: 12000, para_birimi: "TRY", teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026" },
      { kalem: "Muhasebeci", aylik_tl: 8000, para_birimi: "TRY", teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026" },
      { kalem: "Kira", aylik_tl: 20000, para_birimi: "TRY", teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026" },
      { kalem: "Natro alan adları", aylik_tl: 22.22, para_birimi: "USD", teyit: "TEYİTLİ", kaynak: "Selin araştırması 14 Eki, 0,45 USD" },
      { kalem: "Apple Developer", aylik_tl: 407.29, para_birimi: "USD", teyit: "TEYİTLİ", kaynak: "Selin araştırması 14 Eki, 8,25 USD" },
      { kalem: "Google Play hesabı", aylik_tl: 51.34, para_birimi: "USD", teyit: "TEYİTLİ", kaynak: "Selin araştırması 14 Eki, 1,04 USD" },
      { kalem: "Claude aboneliği", aylik_tl: 9873.62, para_birimi: "USD", tutar_doviz: 200, teyit: "TEYİTLİ", kaynak: "Patron beyanı 14 Eki 2026, 200 USD x 49,3681" }
    ]
  };
  var n = function (x) { x = parseFloat(x); return isFinite(x) ? x : 0; };
  function toplamSabit(giderler) { return (giderler || []).reduce(function (t, g) { return t + n(g.aylik_tl); }, 0); }
  function saatlikSabit(toplam, kapasite) { kapasite = n(kapasite); return kapasite > 0 ? n(toplam) / kapasite : 0; }
  function renk(karPct) { return karPct < 15 ? "kirmizi" : karPct <= 40 ? "yesil" : "mavi"; }
  function isHesap(is, saatlik) {
    var teklif = n(is.teklif_fiyat), olcum = is.saat_gercek != null && is.saat_gercek !== "" && n(is.saat_gercek) > 0;
    var saat = olcum ? n(is.saat_gercek) : n(is.saat_tahmin);
    var sabitPay = saat * n(saatlik), dogrudan = n(is.dogrudan_maliyet), komisyon = teklif * n(is.komisyon_yuzde) / 100;
    var kdvO = n(is.kdv_yuzde), kdv = is.fatura ? teklif * kdvO / 100 : 0, taksit = teklif * n(is.taksit_yuzde) / 100;
    var degisken = dogrudan + komisyon + taksit, maliyet = sabitPay + degisken, net = teklif - maliyet;
    var karPct = teklif > 0 ? net / teklif * 100 : 0;
    return { teklif: teklif, kdvHaric: teklif, kdvTutar: kdv, kdvDahil: teklif + kdv, saat: saat, saatTur: olcum ? "ÖLÇÜM" : "TAHMİN", sabitPay: sabitPay, dogrudan: dogrudan, komisyon: komisyon, kdv: kdv, taksit: taksit,
      degisken: degisken, maliyet: maliyet, net: net, karPct: karPct, katki: teklif - degisken, renk: teklif > 0 ? renk(karPct) : "yok" };
  }
  function ayIci(t, simdi) { if (!t) return false; var d = new Date(t), s = simdi || new Date(); return d.getFullYear() === s.getFullYear() && d.getMonth() === s.getMonth(); }
  function basaBas(isler, toplam, saatlik, simdi) {
    var katki = 0, adet = 0;
    (isler || []).forEach(function (i) {
      if (i.durum !== "ödendi" && i.durum !== "kazanıldı") return;
      if (!ayIci(i.guncelleme || i.olusturma, simdi)) return;
      katki += isHesap(i, saatlik).katki; adet++;
    });
    return { katki: katki, adet: adet, toplamSabit: toplam, yuzde: toplam > 0 ? katki / toplam * 100 : 0 };
  }
  var tl = function (x) { return n(x).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL"; };
  var API = { YEDEK: YEDEK, toplamSabit: toplamSabit, saatlikSabit: saatlikSabit, isHesap: isHesap, basaBas: basaBas, renk: renk, tl: tl };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.MALIYET = API;
})(typeof window !== "undefined" ? window : this);
