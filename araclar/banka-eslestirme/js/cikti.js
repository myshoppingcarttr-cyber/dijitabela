/* Excel (.xlsx) çıktısı için sayfa içerikleri. Tarayıcı + Node. */
(function (root) {
  "use strict";
  function tl(c) { return c === null || c === undefined ? null : c / 100; }
  function iso(g) { return new Date(g * 86400000).toISOString().slice(0, 10); }
  function sayfalar(r, y) {
    var S = r.ozet, t = new Date().toISOString().slice(0, 10), tr = y.trTarih;
    var fatNo = function (x) { return x.parcalar.map(function (p) { return p.f.no; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", "); };
    var fatTut = function (x) { return (x.oneri ? "ÖNERİ (düşülmedi): " : "") + x.parcalar.map(function (p) { return p.f.no + ": " + (p.tutar / 100).toFixed(2); }).join("; "); };
    var tum = [["Ekstre satırı", "Tarih", "Açıklama", "Gönderen/karşı taraf", "Dekont/ref", "Tutar", "Sonuç", "Güven", "Grup", "Eşleşen fatura(lar)", "Fatura bazında düşülen tutar", "Fark (hareket − fatura kalanı)", "Cari", "Neden", "Aday faturalar", "Kategori önerisi"]];
    r.sonuc.forEach(function (x) { tum.push([x.h.satir, tr(x.h.tarih), x.h.aciklama, x.h.taraf, x.h.ref, x.h.tutar, y.DURUM_AD[x.durum], y.GUVEN_AD[x.guven] || "", y.grup(x), fatNo(x), fatTut(x), x.fark ? x.fark / 100 : "", x.cari || "", x.neden.join(" · "), x.adaylar.join("; "), x.kategori]); });
    var dog = [tum[0]].concat(tum.slice(1).filter(function (s) { return s[8] === "dogrula" || s[8] === "aday"; }));
    var esm = [["Ekstre satırı", "Tarih", "Açıklama", "Gönderen/karşı taraf", "Tutar", "Kategori önerisi (anahtar kelimeye dayalı, muhasebe kararı değil)"]];
    r.sonuc.forEach(function (x) { if (x.durum === "eslesmedi") esm.push([x.h.satir, tr(x.h.tarih), x.h.aciklama, x.h.taraf, x.h.tutar, x.kategori]); });
    var ac = [["Fatura no", "ETTN", "Tarih", "Yön", "Cari", "VKN/TCKN", "Fatura tutarı", "Ödenen", "Kalan", "Yaş (gün)", "Not"]];
    r.acik.slice().sort(function (a, b) { return a.gun - b.gun; }).forEach(function (f) { ac.push([f.no, f.ettn, tr(f.tarih), f.yon === "giden" ? "Satış" : "Alış", f.cpAd, f.cpId, tl(f.ana), tl(f.ana - f.kalan), tl(f.kalan), r.refGun === null ? "" : r.refGun - f.gun, f.odemeler.length ? "Kısmen ödenmiş" : ""]); });
    var ka = [["Fatura no", "Tarih", "Yön", "Cari", "Fatura tutarı", "Ödeme tarihleri", "Not"]];
    r.kapali.forEach(function (f) { ka.push([f.no, tr(f.tarih), f.yon === "giden" ? "Satış" : "Alış", f.cpAd, tl(f.ana), f.odemeler.map(function (o) { return tr(o.hareket.tarih) + " " + (o.tutar / 100).toFixed(2); }).join("; "), f.kalan < 0 ? "Fazla düşüldü" : ""]); });
    var ya = [["Yön", "Cari", "VKN/TCKN", "Açık fatura adedi", "Toplam açık", "0-30 gün", "31-60 gün", "61-90 gün", "90+ gün", "En eski (gün)"]];
    ["giden", "gelen"].forEach(function (yn) { r.yas[yn].cariler.forEach(function (c) { ya.push([yn === "giden" ? "Satış alacağı" : "Alış borcu", c.ad, c.vkn, c.adet, c.toplam / 100, c.kova[0] / 100, c.kova[1] / 100, c.kova[2] / 100, c.kova[3] / 100, c.enEski]); }); });
    var ek = [["Uyarı", "Ekstre satırı", "Tarih", "Tutar", "Açıklama"]];
    if (r.den.kirik) r.den.kirik.forEach(function (x) { ek.push(["Bakiye zinciri kırık", x.hareket.satir, tr(x.hareket.tarih), x.hareket.tutar, "Beklenen bakiye " + x.beklenen.toFixed(2) + ", ekstrede " + x.hareket.bakiye.toFixed(2) + ", fark " + x.fark.toFixed(2)]); });
    r.den.mukerrer.forEach(function (x) { ek.push([x.kesin ? "Aynı satır iki kez (eşleştirmeden çıkarıldı)" : "Benzer satır tekrarı (sayıldı)", x.hareket.satir, tr(x.hareket.tarih), x.hareket.tutar, "İlk satır " + x.ilk.satir]); });
    var at = [["Kaynak", "Satır no", "Neden", "İçerik"]];
    r.girdi.atlanan.forEach(function (x) { at.push(["Ekstre", x.satir, x.neden, x.icerik]); });
    (r.girdi.faturaAtlanan || []).forEach(function (x) { at.push(["Fatura listesi", x.satir, x.neden, x.icerik]); });
    r.iadeler.forEach(function (f) { at.push(["İade faturası (eşleştirme dışı)", "", f.no, f.cpAd]); });
    r.dovizDisi.forEach(function (f) { at.push(["Dövizli fatura, kur yok (eşleştirme dışı)", "", f.no, f.cpAd]); });
    r.girdi.xmlOkunamayan.forEach(function (x) { at.push(["Okunamayan XML", "", x.dosya, x.neden]); });
    var ozet = [["Ölçüt", "Değer"], ["Tarih", t], ["Ekstre dosyası", r.girdi.bankaAd], ["Fatura kaynağı", r.girdi.fatKaynak], ["Tutar toleransı (TL)", r.ayar.tol], ["Peşin ödeme penceresi (gün)", r.ayar.avansGun],
      ["Banka hareketi (eşleştirilen)", r.sonuc.length], ["Mükerrer sayılıp çıkarılan satır", S.mukerrerAtlanan], ["Toplam giriş (TL)", S.girisC / 100], ["Toplam çıkış (TL)", S.cikisC / 100]];
    Object.keys(y.DURUM_AD).forEach(function (k) { ozet.push(["Hareket: " + y.DURUM_AD[k], S.durum[k] || 0]); });
    ozet.push(["Fatura sayısı (eşleştirmeye giren)", S.fatura], ["Fatura toplamı (TL)", S.faturaC / 100], ["Ödenen toplam (TL)", S.odenenC / 100], ["Açık fatura sayısı", r.acik.length], ["Açık toplam (TL)", S.acikC / 100],
      ["Kontrol: hareket toplamı = gruplar toplamı", S.dengeHareket ? "Tutuyor" : "TUTMUYOR"], ["Kontrol: fatura = ödenen + kalan", S.dengeFatura ? "Tutuyor" : "TUTMUYOR"],
      ["Not", "Eşleştirme önerisidir; muhasebe kaydı, mahsup ya da resmi işlem yerine geçmez. Düşük güvenli eşleşmeleri doğrulayın. dijitabela.com"]);
    return [{ ad: "Özet", satirlar: ozet }, { ad: "Tüm hareketler", satirlar: tum }, { ad: "Doğrulanacaklar", satirlar: dog }, { ad: "Eşleşmeyen hareketler", satirlar: esm }, { ad: "Açık faturalar", satirlar: ac }, { ad: "Cari yaşlandırma", satirlar: ya }, { ad: "Kapanan faturalar", satirlar: ka }, { ad: "Ekstre uyarıları", satirlar: ek }, { ad: "Atlananlar", satirlar: at }];
  }
  var api = { sayfalar: sayfalar };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.BETX = api;
})(typeof self !== "undefined" ? self : this);
