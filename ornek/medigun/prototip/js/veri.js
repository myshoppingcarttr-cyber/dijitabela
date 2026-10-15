/* Medigün prototip verisi.
   Şube adres/telefonları: medigungrup.com + şube siteleri (14.10.2026).
   Hekimler: resmî sitelerin WordPress "doktorlar" kategorisi; yalnız branşı yazı metninde açıkça geçenler.
   Ayrıntı: ../KAYNAKLAR.md */
window.MG = window.MG || {};

MG.guncelleme = "14.10.2026";
MG.cagri = { goster: "0850 260 1 222", tel: "+908502601222" };

MG.subeler = [
  {
    kod: "akhisar", ad: "Özel Medigün Hastanesi Akhisar", kisa: "Akhisar", tur: "Hastane",
    adres: "Kethüda Mh. 374 Sk. No: 2, Akhisar / Manisa",
    telGoster: "0236 404 0 404", tel: "+902364040404",
    eposta: "info@medigunakhisar.com",
    harita: "https://maps.app.goo.gl/uBJB4nD7UvspJB418",
    site: "https://www.medigunakhisar.com/",
    foto: "img/bina-akhisar.jpg",
    fotoAlt: "Özel Medigün Hastanesi Akhisar binası, cam cepheli ve kırmızı Medigün tabelalı",
    acil: true, verili: true
  },
  {
    kod: "soma", ad: "Özel Medigün Hastanesi Soma", kisa: "Soma", tur: "Hastane",
    adres: "Hamidiye (Merkez) Mah., Vefa Sk. No: 4, 45500 Soma / Manisa",
    telGoster: "0850 260 1 222", tel: "+908502601222",
    eposta: "info@medigunhastanesi.com",
    harita: "https://goo.gl/maps/jK9x92ANJgsrMceU8",
    site: "https://www.medigunhastanesi.com.tr/",
    foto: "img/bina-soma.jpg",
    fotoAlt: "Özel Medigün Hastanesi Soma binası, çok katlı, çatısında Medigün Hastanesi yazısı",
    acil: true, verili: true
  },
  {
    kod: "bergama", ad: "Medigün Tıp Merkezi Bergama", kisa: "Bergama", tur: "Tıp merkezi",
    adres: "Zafer Mah. 623. Sk., Bergama / İzmir",
    telGoster: "0850 260 1 222", tel: "+908502601222",
    harita: "https://goo.gl/maps/rNN4twaLSV3tKJCN9",
    site: "https://www.mediguntipbergama.com/",
    foto: "img/bina-bergama.jpg",
    fotoAlt: "Özel Medigün Tıp Merkezi Bergama binası, desenli cephe ve bayrak süslemeleri",
    acil: false, verili: false
  },
  {
    kod: "bornova", ad: "Yedigün Tıp Merkezi Bornova", kisa: "Bornova", tur: "Tıp merkezi",
    adres: "Atatürk Mah. Fehmi Yiğin Cad. No: 7, Bornova / İzmir",
    telGoster: "0850 260 1 222", tel: "+908502601222",
    harita: "https://maps.app.goo.gl/3bTenGgSK6YFdzpT7",
    site: "https://yediguntipmerkezi.com/",
    foto: "img/bina-bornova.jpg",
    fotoAlt: "Yedigün Tıp Merkezi Bornova binası, beyaz ve kırmızı şeritli üç katlı cephe",
    acil: false, verili: false
  },
  {
    kod: "camdibi", ad: "Yedigün Tıp Merkezi Çamdibi", kisa: "Çamdibi", tur: "Tıp merkezi",
    adres: "5454 Sk. No: 23/3, Bornova / İzmir",
    telGoster: "0850 260 1 222", tel: "+908502601222",
    harita: "https://goo.gl/maps/CHYpArhJsLwirzgg7",
    site: "https://yediguntipcamdibi.com/",
    foto: "img/bina-camdibi.jpg",
    fotoAlt: "Yedigün Tıp Merkezi Çamdibi girişi, mavi cam cepheli bina ve kırmızı tabela",
    acil: false, verili: false
  }
];

MG.branslar = {
  acil: "Acil Servis",
  algoloji: "Algoloji (Ağrı Polikliniği)",
  anestezi: "Anestezi ve Reanimasyon",
  beslenme: "Beslenme ve Diyetetik",
  beyin: "Beyin ve Sinir Cerrahisi",
  biyokimya: "Biyokimya",
  cocuk: "Çocuk Sağlığı ve Hastalıkları",
  dahiliye: "Dahiliye (İç Hastalıkları)",
  dermatoloji: "Dermatoloji",
  enfeksiyon: "Enfeksiyon Hastalıkları",
  ftr: "Fizik Tedavi ve Rehabilitasyon",
  genelcerrahi: "Genel Cerrahi",
  gogus: "Göğüs Hastalıkları",
  goz: "Göz Hastalıkları",
  kadin: "Kadın Hastalıkları ve Doğum",
  kardiyoloji: "Kardiyoloji",
  kbb: "Kulak Burun Boğaz",
  noroloji: "Nöroloji",
  ortopedi: "Ortopedi ve Travmatoloji",
  psikiyatri: "Psikiyatri",
  psikoterapi: "Psikoterapi (Uzm. Klinik Psikolog)",
  radyoloji: "Radyoloji",
  uroloji: "Üroloji"
};

/* Resmî sitelerin "Branşlar" kategorisi */
MG.subeBrans = {
  akhisar: ["acil","algoloji","anestezi","beslenme","beyin","biyokimya","cocuk","dahiliye","dermatoloji","ftr","genelcerrahi","goz","kardiyoloji","kadin","kbb","noroloji","ortopedi","gogus","radyoloji","psikiyatri","psikoterapi","uroloji"],
  soma: ["acil","anestezi","beyin","cocuk","dahiliye","beslenme","enfeksiyon","ftr","genelcerrahi","gogus","goz","kadin","kardiyoloji","kbb","noroloji","ortopedi","psikiyatri","uroloji","radyoloji"],
  bergama: [], bornova: [], camdibi: []
};

var A = "https://www.medigunakhisar.com", S = "https://www.medigunhastanesi.com.tr";
MG.hekimler = [
  { ad: "Op. Dr. Yusuf Kürşad Özdamar", brans: "uroloji", sube: "akhisar", kaynak: A + "/2026/03/06/op-dr-yusuf-kursad-ozdamar/" },
  { ad: "Uzm. Dr. Mesut Toydemir", brans: "ftr", sube: "akhisar", kaynak: A + "/2026/03/04/uzm-dr-mesut-toydemir/" },
  { ad: "Op. Dr. Gökhan Özkan", brans: "goz", sube: "akhisar", kaynak: A + "/2025/07/10/op-dr-gokhan-ozkan/" },
  { ad: "Uzm. Dr. Emine Şahin", brans: "gogus", sube: "akhisar", kaynak: A + "/2025/02/11/uzm-dr-emine-sahin/" },
  { ad: "Op. Dr. Levent Çelik", brans: "beyin", sube: "akhisar", kaynak: A + "/2022/09/26/dr-celik/" },
  { ad: "Op. Dr. Fatma Selcen Karakuş", brans: "kadin", sube: "akhisar", kaynak: A + "/2022/09/26/dr-skarakus/" },
  { ad: "Uzm. Dyt. Betül Gülşen Yıldız", brans: "beslenme", sube: "akhisar", kaynak: A + "/2026/03/06/uzm-dyt-betul-gulsen-yildiz/" },

  { ad: "Op. Dr. Khatai Gurbanlı", brans: "uroloji", sube: "soma", kaynak: S + "/2026/06/30/op-dr-khatai-gurbanli/" },
  { ad: "Op. Dr. Buket Karataş Aslan", brans: "kadin", sube: "soma", kaynak: S + "/2025/10/09/op-dr-buket-karatas-aslan/" },
  { ad: "Op. Dr. Uğur Mehmet İçke", brans: "beyin", sube: "soma", kaynak: S + "/2025/10/09/op-dr-ugur-mehmet-icke/" },
  { ad: "Uzm. Dr. Reza Arabzadeh", brans: "cocuk", sube: "soma", kaynak: S + "/2025/02/11/uzm-dr-reza-arabzadeh/" },
  { ad: "Op. Dr. Yusuf Kılıç", brans: "genelcerrahi", sube: "soma", kaynak: S + "/2024/07/20/op-dr-yusuf-kilic/" },
  { ad: "Op. Dr. Levent Çelik", brans: "beyin", sube: "soma", kaynak: S + "/2024/02/06/op-dr-levent-celik/" },
  { ad: "Uzm. Dr. Ahmet Atalan", brans: "gogus", sube: "soma", kaynak: S + "/2023/09/26/uzm-dr-emre-selvi/" },
  { ad: "Dyt. Selinay Erol", brans: "beslenme", sube: "soma", kaynak: S + "/2023/01/11/dyt-selinay-erol/" },
  { ad: "Uzm. Dr. Sermin Toydemir", brans: "dahiliye", sube: "soma", kaynak: S + "/2022/10/22/uzm-dr-sermin-toydemir/" },
  { ad: "Uzm. Dr. Nimet Kayacıoğlu", brans: "cocuk", sube: "soma", kaynak: S + "/2022/10/22/uzm-dr-nimet-kayacioglu/" },
  { ad: "Uzm. Dr. Mustafa Demirci", brans: "enfeksiyon", sube: "soma", kaynak: S + "/2022/10/22/uzm-dr-mustafa-demirci/" },
  { ad: "Uzm. Dr. Mustafa Torun", brans: "enfeksiyon", sube: "soma", kaynak: S + "/2022/10/11/uzm-dr-mustafa-torun/" },
  { ad: "Uzm. Dr. Mesut Toydemir", brans: "ftr", sube: "soma", kaynak: S + "/2022/09/26/uzm-dr-mesut-toydemir/" },
  { ad: "Op. Dr. Erol Gilim", brans: "ortopedi", sube: "soma", kaynak: S + "/2022/09/26/op-dr-erol-gilim/" },
  { ad: "Op. Dr. Bedri Baysal", brans: "kbb", sube: "soma", kaynak: S + "/2022/09/26/op-dr-bedri-baysal/" },
  { ad: "Op. Dr. Mehmet Duman", brans: "kadin", sube: "soma", kaynak: S + "/2022/09/26/uzm-dr-mehmet-duman/" },
  { ad: "Uzm. Dr. Burçin Uz", brans: "radyoloji", sube: "soma", kaynak: S + "/2022/09/26/uzm-dr-burcin-uz/" }
];

MG.subeBul = function (kod) {
  for (var i = 0; i < MG.subeler.length; i++) if (MG.subeler[i].kod === kod) return MG.subeler[i];
  return MG.subeler[0];
};
/* Türkçe karakter ve büyük/küçük harf duyarsız karşılaştırma */
MG.sade = function (s) {
  return String(s || "").toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
};
MG.esc = function (s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
};
/* Seçili şube: adres çubuğu > tarayıcı hafızası > Akhisar */
MG.secili = (function () {
  var k = null;
  try { k = new URLSearchParams(location.search).get("sube"); } catch (e) {}
  if (!k) { try { k = localStorage.getItem("mg-sube"); } catch (e) {} }
  return MG.subeBul(k).kod;
})();
MG.subeKaydet = function (kod) {
  MG.secili = kod;
  try { localStorage.setItem("mg-sube", kod); } catch (e) {}
};
