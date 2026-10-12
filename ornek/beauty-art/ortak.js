/* Beauty Art Güzellik Salonu · güzellik salonu · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: local.gen.tr (Cumhuriyet Cd., Muratpaşa / Antalya; 0546 667 70 14; Instagram estetisyen.ba).
   Hizmet listesi, süreler, fiyatlar ve boş saatler ÖRNEKTİR; salonun gerçek listesi/takvimi değildir. Hiçbir form gönderim yapmaz. */
(function () {
  "use strict";
  var B = {"ad":"Beauty Art Güzellik Salonu","slug":"beauty-art","adres":"Cumhuriyet Cd., Muratpaşa / Antalya","tel":"0546 667 70 14","wa":"905466677014","ig":"estetisyen.ba","igUrl":"https://www.instagram.com/estetisyen.ba/","kaynak":"https://local.gen.tr/antalya/beauty-art-guzellik-salonu/","haritaSorgu":"Beauty Art Güzellik Salonu Cumhuriyet Caddesi Muratpaşa Antalya"};
  B.waLink = function (m) { return "https://wa.me/" + B.wa + "?text=" + encodeURIComponent(m); };
  B.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(B.haritaSorgu);
  B.kat = [
    { id: "cilt", ad: "Cilt bakımı", ik: "M12 3c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10zM9.5 14a2.5 2.5 0 0 0 2.5 2.5" },
    { id: "kirpik", ad: "Kirpik ve kaş", ik: "M2 13c3-5 7-7.5 10-7.5S19 8 22 13M5 17l1.6-2.4M9 18.5l.8-2.8M13.5 18.5l-.4-2.8M17.6 17l-1.5-2.4" },
    { id: "tirnak", ad: "El ve ayak", ik: "M8 21V10a4 4 0 0 1 8 0v11M8 15h8M10.5 6.5V4M13.5 6.5V4" },
    { id: "epil", ad: "Epilasyon", ik: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
    { id: "makyaj", ad: "Makyaj ve saç", ik: "M5 20l9-9M12 4l8 8-3 3-8-8zM4 21l2-5 3 3z" }
  ];
  /* ÖRNEK hizmet listesi: dk = süre, fiyat = örnek TL */
  B.hizmet = [
    { id: 1, kat: "cilt", ad: "Klasik cilt bakımı", dk: 60, fiyat: 900, ac: "Temizleme, peeling, maske ve nemlendirme (örnek içerik)." },
    { id: 2, kat: "cilt", ad: "Derin temizlik bakımı", dk: 75, fiyat: 1500, ac: "Derin temizlik ve nem desteği (örnek içerik)." },
    { id: 3, kat: "cilt", ad: "Leke ve ton bakımı", dk: 60, fiyat: 1300, ac: "Cilt tonunu destekleyen bakım (örnek içerik)." },
    { id: 4, kat: "kirpik", ad: "İpek kirpik uygulaması", dk: 120, fiyat: 1400, ac: "Kirpik tek tek uygulanır (örnek içerik)." },
    { id: 5, kat: "kirpik", ad: "Kirpik lifting", dk: 60, fiyat: 900, ac: "Doğal kıvrım ve boya (örnek içerik)." },
    { id: 6, kat: "kirpik", ad: "Kaş tasarımı", dk: 30, fiyat: 450, ac: "Yüz hatlarına göre şekil (örnek içerik)." },
    { id: 7, kat: "tirnak", ad: "Manikür", dk: 45, fiyat: 500, ac: "Bakım ve oje (örnek içerik)." },
    { id: 8, kat: "tirnak", ad: "Kalıcı oje", dk: 60, fiyat: 650, ac: "Dayanıklı oje uygulaması (örnek içerik)." },
    { id: 9, kat: "tirnak", ad: "Pedikür", dk: 60, fiyat: 700, ac: "Ayak bakımı ve oje (örnek içerik)." },
    { id: 10, kat: "epil", ad: "Bölgesel lazer epilasyon seansı", dk: 30, fiyat: 700, ac: "Bölge seçimiyle tek seans (örnek içerik)." },
    { id: 11, kat: "epil", ad: "Tüm vücut epilasyon seansı", dk: 90, fiyat: 2800, ac: "Tek seans, bölgeler birlikte (örnek içerik)." },
    { id: 12, kat: "makyaj", ad: "Gün makyajı", dk: 45, fiyat: 800, ac: "Doğal görünümlü makyaj (örnek içerik)." },
    { id: 13, kat: "makyaj", ad: "Özel gün makyajı ve saç", dk: 120, fiyat: 2200, ac: "Makyaj + fön/toplama (örnek içerik)." }
  ];
  B.paketler = [
    { ad: "Hafta sonu bakım", ids: [1, 6, 8], not: "Cilt bakımı + kaş + kalıcı oje" },
    { ad: "Gelin öncesi", ids: [3, 5, 7, 9], not: "Leke bakımı + lifting + manikür + pedikür" },
    { ad: "Işıltı günü", ids: [2, 12], not: "Derin temizlik + gün makyajı" }
  ];
  B.bul = function (id) { return B.hizmet.filter(function (h) { return h.id === Number(id); })[0]; };
  B.tl = function (n) { return Number(n).toLocaleString("tr-TR") + " TL"; };
  B.sureYaz = function (dk) { var s = Math.floor(dk / 60), m = dk % 60; return (s ? s + " sa " : "") + (m ? m + " dk" : (s ? "" : "0 dk")); };
  /* Sepet: yalnız bu tarayıcı */
  var SK = "dj-" + B.slug + "-sepet";
  B._s = [];
  B.sepet = function () { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch (e) { return B._s; } };
  B.sepetYaz = function (l) { B._s = l; try { localStorage.setItem(SK, JSON.stringify(l)); } catch (e) {} };
  B.var = function (id) { return B.sepet().indexOf(Number(id)) > -1; };
  B.deg = function (id) { id = Number(id); var l = B.sepet(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); B.sepetYaz(l); return i < 0; };
  B.temizle = function () { B.sepetYaz([]); };
  B.toplam = function (l) { l = l || B.sepet(); var dk = 0, tl = 0; l.forEach(function (id) { var h = B.bul(id); if (h) { dk += h.dk; tl += h.fiyat; } }); return { dk: dk, tl: tl, n: l.length }; };
  /* ÖRNEK doluluk: gün ve saatten türetilen sahte desen, gerçek takvim değildir */
  B.saatler = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  B.gunler = function (n) {
    var ad = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], ay = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], r = [], d = new Date();
    for (var i = 1; r.length < n; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); r.push({ k: x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate(), g: ad[x.getDay()], n: x.getDate(), a: ay[x.getMonth()], idx: i }); }
    return r;
  };
  B.dolu = function (gunIdx, saatIdx) { return ((gunIdx * 5 + saatIdx * 3 + saatIdx * saatIdx) % 7) < 2; };
  B.mesaj = function (o) {
    var l = (o.ids || B.sepet()).map(B.bul).filter(Boolean), t = B.toplam(l.map(function (h) { return h.id; }));
    return "Merhaba, " + (o.ad ? o.ad + " adına " : "") + "randevu almak istiyorum" + (o.gun ? ": " + o.gun : "") + (o.saat ? " " + o.saat + " civarı" : "") + ".\nİstediğim hizmetler: " + (l.length ? l.map(function (h) { return h.ad; }).join(", ") : "(henüz seçmedim, bilgi alabilir miyim?)") + (l.length ? "\nTahmini süre: " + B.sureYaz(t.dk) : "") + (o.not ? "\nNot: " + o.not : "");
  };
  B.ikon = function (kat, boy) {
    var k = B.kat.filter(function (x) { return x.id === kat; })[0] || B.kat[0];
    return '<svg viewBox="0 0 24 24" width="' + (boy || 22) + '" height="' + (boy || 22) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + k.ik + '"/></svg>';
  };
  B.toast = function (m) {
    var t = document.getElementById("ts"); if (!t) return; t.textContent = m; t.classList.add("a"); clearTimeout(B._tt); B._tt = setTimeout(function () { t.classList.remove("a"); }, 2400);
  };
  B.iz = function (x) { try { window.djIzle && window.djIzle(x); } catch (e) {} };
  window.SALON = B;
})();
