/* Dijitabela Araçlar: hesap çekirdeği. Arayüzden bağımsız; tarayıcıda window.DTH, node'da module.exports. */
(function (kok) {
  "use strict";
  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var UST_TUTAR = 10000000000; // 10 milyar TL; üstü kayan nokta hassasiyeti için reddedilir
  var EN_AZ_CEZA = 300; // VUK 343, 2026: 588 Sıra No.lu Tebliğ

  function yuvarla(x) { return Math.round(x * 100) / 100; } // zaten kuruşlu tutarların toplamı için
  // Tam sayıyla kuruş hesabı: tutar × pay / payda, yarım yukarı. Milyarlık tutarda da kayan nokta hatası olmaz.
  function oranli(tutar, pay, payda) {
    var k = Math.round(tutar * 100);
    if (typeof BigInt === "undefined") return Math.round(k * pay / payda) / 100;
    var P = BigInt(pay), D = BigInt(payda);
    return Number((BigInt(k) * P * BigInt(2) + D) / (D * BigInt(2))) / 100;
  }
  function binlik(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function sayi(n, kesir) {
    var f = (kesir === undefined) ? 2 : kesir, p = Math.abs(n).toFixed(f).split(".");
    return (n < 0 ? "-" : "") + binlik(p[0]) + (f ? "," + p[1] : "");
  }
  function tl(n) { return sayi(n, 2) + " TL"; }
  function oranYaz(o) { return "%" + String(Math.round(o * 100) / 100).replace(".", ","); }

  // Türkçe ve yabancı biçimi güvenle okur. Çözemezse null döner; asla tahmin etmez.
  function tutarOku(v) {
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/\s| /g, "").replace(/(TL|₺)$/i, "").replace(/^₺/, "");
    if (!s || /^-/.test(s) || !/^[\d.,]+$/.test(s)) return null;
    var nokta = s.lastIndexOf("."), virgul = s.lastIndexOf(",");
    if (nokta >= 0 && virgul >= 0) { // ikisi de var: sondaki ondalık
      var ond = nokta > virgul ? "." : ",", bin = ond === "." ? "," : ".";
      if (s.split(ond).length !== 2) return null;
      var sol = s.split(ond)[0], sag = s.split(ond)[1];
      if (!/^\d{1,2}$/.test(sag)) return null;
      if (!new RegExp("^\\d{1,3}(\\" + bin + "\\d{3})+$").test(sol)) return null;
      s = sol.split(bin).join("") + "." + sag;
    } else if (virgul >= 0) {
      if (/^\d{1,3}(,\d{3}){2,}$/.test(s)) s = s.split(",").join("");
      else if (/^\d+,\d{1,2}$/.test(s)) s = s.replace(",", ".");
      else if (/^\d{1,3},\d{3}$/.test(s)) s = s.replace(",", "");
      else return null;
    } else if (nokta >= 0) {
      if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.split(".").join("");
      else if (!/^\d+\.\d{1,2}$/.test(s)) return null;
    }
    var n = Number(s);
    return isFinite(n) ? n : null;
  }
  function oranOku(v) {
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/\s/g, "").replace(/^%|%$/g, "");
    if (!/^\d{1,3}([.,]\d{1,4})?$/.test(s)) return null;
    return Number(s.replace(",", "."));
  }

  // Tarih: 'yyyy-aa-gg' → UTC Date; gerçek olmayan tarih (31 Şubat) null
  function tarihOku(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s == null ? "" : s));
    if (!m) return null;
    var y = +m[1], a = +m[2], g = +m[3], d = new Date(Date.UTC(y, a - 1, g));
    if (d.getUTCFullYear() !== y || d.getUTCMonth() !== a - 1 || d.getUTCDate() !== g) return null;
    return d;
  }
  function tarihYaz(d) { // gg.aa.yyyy
    var g = d.getUTCDate(), a = d.getUTCMonth() + 1;
    return (g < 10 ? "0" : "") + g + "." + (a < 10 ? "0" : "") + a + "." + d.getUTCFullYear();
  }
  function isoYaz(d) { return d.toISOString().slice(0, 10); }
  function ayEkle(d, n) { // aynı gün; ayda o gün yoksa ayın son günü
    var x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
    var son = new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth() + 1, 0)).getUTCDate();
    x.setUTCDate(Math.min(d.getUTCDate(), son));
    return x;
  }
  function gunEkle(d, n) { return new Date(d.getTime() + n * 86400000); }
  function gunFark(a, b) { return Math.round((b.getTime() - a.getTime()) / 86400000); }

  /* ---------- KİRA (TBK m.344) ---------- */
  function ayAnahtari(tarih) { return tarih.toISOString().slice(0, 7); }
  function kiraOraniBul(tarihStr, oranlar) {
    var d = tarihOku(tarihStr);
    if (!d) return null;
    var k = oranlar && oranlar.kira && oranlar.kira[ayAnahtari(d)];
    return k ? { oran: k.o, veri: k.veri, ay: AYLAR[d.getUTCMonth()] + " " + d.getUTCFullYear() } : null;
  }
  // Kuruş tamsayısıyla hesap: 15000 × %32,24 gibi işlemlerde kayan nokta hatası olmaz
  function kiraHesap(kira, oran) {
    var k = tutarOku(kira), o = oranOku(oran);
    if (k === null || k <= 0) return { hata: "kira" };
    if (k > UST_TUTAR) return { hata: "kira-buyuk" };
    if (o === null || o < 0 || o > 200) return { hata: "oran" };
    var kurus = Math.round(k * 100), onbinde = Math.round(o * 100);
    var zamKurus = Math.round(kurus * onbinde / 10000);
    return { kira: kurus / 100, oran: o, zam: zamKurus / 100, yeni: (kurus + zamKurus) / 100 };
  }
  function kiraMesaj(r, sonuc, kaynak) {
    var h = sonuc; if (!h || h.hata) return "";
    var t = tarihOku(r.tarih);
    return "Merhaba" + (r.kiraci ? " " + r.kiraci : "") + ", " +
      (r.adres ? r.adres + " için kira" : "Kira") + " yenileme tarihiniz " + (t ? tarihYaz(t) : "yakında") + ". " +
      "Güncel kira " + tl(h.kira) + ". " +
      (kaynak ? "TÜİK TÜFE 12 aylık ortalaması " + oranYaz(h.oran) + " (" + kaynak + " verisi; TBK m.344 üst sınırı) üzerinden yeni kira en fazla " : "Uygulanan " + oranYaz(h.oran) + " artış ile yeni kira ") +
      tl(h.yeni) + " olur. Uygun olduğunuzda görüşelim.";
  }
  function csvHucre(v) {
    var s = String(v == null ? "" : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // Excel formül enjeksiyonuna karşı
    return '"' + s.replace(/"/g, '""') + '"';
  }
  // Satırın oranı: elle yazılan varsa o; yoksa yenileme ayının tablodaki oranı
  function kiraSatirCoz(r, oranlar) {
    var elle = (r.oranElle != null && String(r.oranElle).trim() !== "");
    if (elle) {
      var o = oranOku(r.oranElle);
      if (o === null) return { durum: "oran-gecersiz" };
      if (r.kira == null || String(r.kira).trim() === "") return { durum: "kira-bos" };
      var s1 = kiraHesap(r.kira, o);
      return { durum: s1.hata ? s1.hata : "tamam", sonuc: s1, kaynak: "Elle girilen oran", elle: true };
    }
    if (!r.tarih) return { durum: "tarih-bos" };
    if (!tarihOku(r.tarih)) return { durum: "tarih-gecersiz" };
    var b = kiraOraniBul(r.tarih, oranlar);
    if (!b) return { durum: "oran-yok" };
    if (r.kira == null || String(r.kira).trim() === "") return { durum: "kira-bos", bulunan: b };
    var s2 = kiraHesap(r.kira, b.oran);
    return { durum: s2.hata ? s2.hata : "tamam", sonuc: s2, kaynak: b.veri, bulunan: b };
  }
  function kiraCsv(satirlar, oranlar) {
    var bas = ["Kiracı", "Adres", "Yenileme", "Mevcut kira", "Oran %", "Oran kaynağı", "Azami zam", "Azami yeni kira"];
    return "﻿" + [bas.map(csvHucre).join(";")].concat(satirlar.map(function (r) {
      var c = kiraSatirCoz(r, oranlar), t = tarihOku(r.tarih), ok = c.durum === "tamam";
      return [r.kiraci, r.adres, t ? tarihYaz(t) : "",
        ok ? sayi(c.sonuc.kira) : (r.kira || ""),
        ok ? sayi(c.sonuc.oran) : "", ok ? c.kaynak : "",
        ok ? sayi(c.sonuc.zam) : "", ok ? sayi(c.sonuc.yeni) : ""].map(csvHucre).join(";");
    })).join("\r\n");
  }
  function yenilendi(r, oranlar) { // yeni kira esas alınır, tarih bir yıl ileri
    var c = kiraSatirCoz(r, oranlar), t = tarihOku(r.tarih);
    if (c.durum !== "tamam" || !t) return null;
    return { id: r.id, kiraci: r.kiraci, adres: r.adres, tarih: isoYaz(ayEkle(t, 12)), kira: sayi(c.sonuc.yeni), oranElle: "" };
  }

  /* ---------- GECİKME / PİŞMANLIK ---------- */
  function zamOrani(tarih, tablo) { // tablo yeniden eskiye sıralı
    for (var i = 0; i < tablo.length; i++) if (tarihOku(tablo[i].t).getTime() <= tarih.getTime()) return tablo[i];
    return null;
  }
  function gunlukOran(aylik) { // aylık/100/30, altıncı ondalık yukarı (Tahsilat Tebliği 434 örneği: %4 → 0,001334)
    return Math.ceil(aylik / 100 / 30 * 1e6 - 1e-7) / 1e6;
  }
  function zamHesap(g) {
    var asil = tutarOku(g.asil), v = tarihOku(g.vade), o = tarihOku(g.odeme);
    var tablo = g.oranlar.zam;
    if (asil === null || asil <= 0) return { hata: "Vergi aslını yazın. Örnek: 100.000,00" };
    if (asil > UST_TUTAR) return { hata: "Tutar 10 milyar TL'yi aşamaz." };
    if (!v) return { hata: "Vade tarihini seçin." };
    if (!o) return { hata: "Ödeme tarihini seçin." };
    if (v.getUTCFullYear() < 2005) return { hata: "Araç 2005 ve sonrası vadeleri hesaplar." };
    if (o.getUTCFullYear() > 2100) return { hata: "Ödeme tarihi geçersiz." };
    var gun = gunFark(v, o);
    if (gun <= 0) return { gecikmeYok: true, asil: asil, gun: gun };

    var tam = 0; while (ayEkle(v, tam + 1).getTime() <= o.getTime()) tam++;
    var kalan = gunFark(ayEkle(v, tam), o), satirlar = [], gz = 0, pz = 0, faiz = 0, pAy = tam + (kalan > 0 ? 1 : 0);
    // Tam aylar: bir aylık dönemin tamamına, dönemin başladığı gün yürürlükteki oran uygulanır
    for (var i = 0; i < tam; i++) {
      var bas = gunEkle(ayEkle(v, i), 1), bit = ayEkle(v, i + 1), r = zamOrani(bas, tablo);
      var tut = oranli(asil, Math.round(r.o * 100), 10000);
      gz += tut; pz += tut; faiz += tut;
      satirlar.push({ tur: "ay", bas: isoYaz(bas), bit: isoYaz(bit), oran: r.o, tutar: tut, kaynak: r.k });
    }
    // Ay kesri: gecikme zammında gün gün; yürürlük günü dahil yeni oran. Pişmanlıkta kesir tam ay.
    if (kalan > 0) {
      var kb = gunEkle(ayEkle(v, tam), 1), oncekiR = null, sayac = 0, parcaBas = kb;
      for (var j = 0; j <= kalan; j++) {
        var gunT = j < kalan ? gunEkle(kb, j) : null, gr = gunT ? zamOrani(gunT, tablo) : null;
        if (oncekiR && (!gr || gr.t !== oncekiR.t)) {
          var gun6 = gunlukOran(oncekiR.o), ptut = oranli(asil, Math.round(gun6 * 1e6) * sayac, 1000000);
          gz += ptut;
          satirlar.push({ tur: "gun", bas: isoYaz(parcaBas), bit: isoYaz(gunEkle(parcaBas, sayac - 1)), gun: sayac, oran: oncekiR.o, gunluk: gun6, tutar: ptut, kaynak: oncekiR.k });
          parcaBas = gunT; sayac = 0;
        }
        oncekiR = gr; sayac++;
      }
      pz += oranli(asil, Math.round(zamOrani(kb, tablo).o * 100), 10000);
    }
    gz = yuvarla(gz); pz = yuvarla(pz); faiz = yuvarla(faiz);
    if (gz < 1) gz = 1; // 6183 m.51: asgari gecikme zammı 1 TL (kanun metninde 1.000.000 eski lira)
    var vz = oranli(asil, 1, 2), vzKesilmez = vz < EN_AZ_CEZA; // VUK 343: bu tutara ulaşmayan ceza kesilmez
    if (vzKesilmez) vz = 0;
    return {
      vzKesilmez: vzKesilmez,
      asil: asil, gun: gun, tamAy: tam, kalanGun: kalan, pismanlikAy: pAy, satirlar: satirlar,
      gecikmeZammi: gz, gecikmeToplam: yuvarla(asil + gz),
      pismanlikZammi: pz, pismanlikToplam: yuvarla(asil + pz),
      gecikmeFaizi: faiz, vergiZiyai50: vz, pismanliksizToplam: yuvarla(asil + faiz + vz)
    };
  }
  // Geç beyan cezası. GİB Pişmanlıkla Beyan Rehberi s.14, 15, 17, 18:
  // elektronik → mük.355 (1/10, 1/5, tam), 352/I-1 ayrıca kesilmez; kâğıt → pişmanlıkla 1 kat, pişmanlıksız 2 kat I. derece
  function cezaHesap(g) {
    var v = tarihOku(g.vade), b = tarihOku(g.beyan), grp = null, list = g.oranlar.ceza2026.gruplar;
    for (var i = 0; i < list.length; i++) if (list[i].id === g.grup) grp = list[i];
    if (!v || !b || !grp) return null;
    var gun = gunFark(v, b);
    if (gun <= 0) return { gecikmeYok: true, gun: gun };
    var yil2026 = v.getUTCFullYear() === 2026 && b.getUTCFullYear() === 2026;
    if (g.sekil === "kagit") return { kagit: true, tur: "VUK 352/I-1 genel usulsüzlük (elden veya posta)", tam: grp.d1, ikiKat: grp.d1 * 2, kademe: "Pişmanlıkla 1 kat, pişmanlıksız 2 kat", tutar: grp.d1, gun: gun, yil2026: yil2026 };
    var kat = gun <= 30 ? 0.1 : (gun <= 60 ? 0.2 : 1);
    return {
      kagit: false, tur: "VUK mük.355 özel usulsüzlük (elektronik beyan)", tam: grp.ozel,
      kademe: gun <= 30 ? "İlk 30 gün: 1/10" : (gun <= 60 ? "İkinci 30 gün: 1/5" : "60 gün aşıldı: tam"),
      tutar: Math.round(grp.ozel * 100 * kat) / 100, gun: gun, yil2026: yil2026
    };
  }
  // Son toplamlar: pişmanlıklı ve pişmanlıksız geç beyanda ödenecek
  function senaryo(r, c) {
    var ceza = c && !c.gecikmeYok ? c : null, u = ceza ? ceza.tutar : 0;
    var s = { pismanlikGenel: yuvarla(r.pismanlikToplam + u), pismanlikUsulsuzluk: u };
    if (ceza && ceza.kagit) { // VUK 336 + Rehber s.17: yalnız ağır olan
      s.agirlik = r.vergiZiyai50 >= ceza.ikiKat ? "vz" : "usul";
      s.pismanliksizCeza = Math.max(r.vergiZiyai50, ceza.ikiKat);
    } else {
      s.agirlik = "ikisi"; // Rehber s.18: elektronikte özel usulsüzlük ayrıca kesilir
      s.pismanliksizCeza = yuvarla(r.vergiZiyai50 + u);
    }
    s.pismanliksizGenel = yuvarla(r.asil + r.gecikmeFaizi + s.pismanliksizCeza);
    return s;
  }
  function zamMetni(g, r, c) {
    var v = tarihOku(g.vade), o = tarihOku(g.odeme), s = [];
    s.push("Vergi aslı: " + tl(r.asil));
    s.push("Vade: " + tarihYaz(v) + " · Ödeme: " + tarihYaz(o) + " (" + r.gun + " gün; " + r.tamAy + " ay " + r.kalanGun + " gün)");
    s.push("Gecikme zammı (beyan süresinde verildiyse): " + tl(r.gecikmeZammi) + " · toplam " + tl(r.gecikmeToplam));
    var n = senaryo(r, c), ceza = c && !c.gecikmeYok ? c : null;
    if (c && c.gecikmeYok) {
      s.push("Beyan süresinde verildiği için pişmanlık ve geç beyan cezası hesaplanmadı.");
    } else {
      s.push("Pişmanlık zammı (VUK 371, " + r.pismanlikAy + " ay): " + tl(r.pismanlikZammi) + (ceza ? " + usulsüzlük " + tl(n.pismanlikUsulsuzluk) : "") + " · toplam " + tl(n.pismanlikGenel));
      s.push("Pişmanlıksız geç beyan: gecikme faizi " + tl(r.gecikmeFaizi) + " + ceza " + tl(n.pismanliksizCeza) + " · toplam " + tl(n.pismanliksizGenel));
      if (ceza) s.push(ceza.tur + " · " + ceza.kademe + (ceza.yil2026 ? "" : " · 2026 tutarıyla gösterildi"));
    }
    s.push("Bilgi amaçlı tahmindir, resmi hesap yerine geçmez. dijitabela.com/araclar/pismanlik-gecikme-zammi/");
    return s.join("\n");
  }
  function zamCsv(g, r, c) {
    var sat = [["Dönem başı", "Dönem sonu", "Tür", "Gün", "Aylık oran %", "Tutar TL", "Dayanak"].map(csvHucre).join(";")];
    r.satirlar.forEach(function (x) {
      sat.push([tarihYaz(tarihOku(x.bas)), tarihYaz(tarihOku(x.bit)), x.tur === "ay" ? "Tam ay" : "Gün", x.gun || "", sayi(x.oran), sayi(x.tutar), x.kaynak].map(csvHucre).join(";"));
    });
    sat.push(["", "", "Gecikme zammı toplam", "", "", sayi(r.gecikmeZammi), "6183 m.51"].map(csvHucre).join(";"));
    if (!(c && c.gecikmeYok)) {
      var n = senaryo(r, c), ceza = c && !c.gecikmeYok ? c : null;
      sat.push(["", "", "Pişmanlık zammı (" + r.pismanlikAy + " ay)", "", "", sayi(r.pismanlikZammi), "VUK 371"].map(csvHucre).join(";"));
      if (ceza) sat.push(["", "", "Pişmanlıkla usulsüzlük · " + ceza.kademe, "", "", sayi(n.pismanlikUsulsuzluk), ceza.tur].map(csvHucre).join(";"));
      sat.push(["", "", "Pişmanlıkla toplam", "", "", sayi(n.pismanlikGenel), ""].map(csvHucre).join(";"));
      sat.push(["", "", "Gecikme faizi (tam aylar)", "", "", sayi(r.gecikmeFaizi), "VUK 112/3"].map(csvHucre).join(";"));
      sat.push(["", "", "Pişmanlıksız ceza", "", "", sayi(n.pismanliksizCeza), "VUK 344, 336, mük.355"].map(csvHucre).join(";"));
      sat.push(["", "", "Pişmanlıksız toplam", "", "", sayi(n.pismanliksizGenel), ""].map(csvHucre).join(";"));
    }
    return "﻿" + sat.join("\r\n");
  }

  var API = { AYLAR: AYLAR, yuvarla: yuvarla, sayi: sayi, tl: tl, oranYaz: oranYaz, tutarOku: tutarOku, oranOku: oranOku, tarihOku: tarihOku, tarihYaz: tarihYaz, isoYaz: isoYaz, ayEkle: ayEkle, gunFark: gunFark, gunEkle: gunEkle,
    kiraOraniBul: kiraOraniBul, kiraHesap: kiraHesap, kiraMesaj: kiraMesaj, kiraCsv: kiraCsv, kiraSatirCoz: kiraSatirCoz, yenilendi: yenilendi, csvHucre: csvHucre,
    zamOrani: zamOrani, gunlukOran: gunlukOran, zamHesap: zamHesap, cezaHesap: cezaHesap, senaryo: senaryo, zamMetni: zamMetni, zamCsv: zamCsv };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.DTH = API;
})(typeof window !== "undefined" ? window : this);
