/* Kiler Toros · e-ticaret demosu (Dijitabela). Ürünler, siparişler ve stok yalnız bu tarayıcıda (localStorage) tutulur. */
(function () {
  var KOK = (document.currentScript && document.currentScript.getAttribute("data-kok")) || "";
  var URUNLER = [
    { id: "cam-bali", ad: "Çam Balı", kat: "bal", koken: "Muğla, ormanlık bölge", aciklama: "Koyu renkli, az tatlı, hafif reçineli. Kristalleşmesi yavaştır; kahvaltıda, yoğurtta ve çayın yanında.", secenek: [["460 g", 520, 34], ["850 g", 890, 18]], rozet: "Çok satan" },
    { id: "cicek-bali", ad: "Toros Yayla Çiçek Balı", kat: "bal", koken: "Toroslar, 1.200 m üstü yaylalar", aciklama: "Kekik, geven ve yayla çiçeklerinden. Açık renkli, kokulu; serin havada zamanla donması doğaldır.", secenek: [["460 g", 560, 22], ["850 g", 980, 6]] },
    { id: "harnup-pekmezi", ad: "Keçiboynuzu (Harnup) Pekmezi", kat: "bal", koken: "Gazipaşa, Antalya", aciklama: "Katkısız, şeker eklenmemiş. Tahinle karıştırıp ekmekle ya da sabah bir kaşık.", secenek: [["400 g", 230, 40], ["800 g", 420, 25]] },
    { id: "zeytinyagi", ad: "Erken Hasat Sızma Zeytinyağı", kat: "zeytin", koken: "Ekim hasadı, soğuk sıkım", aciklama: "Yeşil, meyvemsi, boğazda hafif yakıcı. Asit oranı 0,5'in altında. Salata ve çiğ kullanım için.", secenek: [["500 ml", 420, 30], ["1 L", 760, 24], ["5 L teneke", 3450, 4]], rozet: "Yeni hasat" },
    { id: "zeytin", ad: "Siyah Sele Zeytin", kat: "zeytin", koken: "Kuru tuzlama, iri dane", aciklama: "Az tuzlu, yumuşak dokulu. Kavanoza alıp üstüne bir kaşık zeytinyağı gezdirin.", secenek: [["500 g", 240, 50], ["1 kg", 440, 30]] },
    { id: "domates-kurusu", ad: "Zeytinyağlı Domates Kurusu", kat: "zeytin", koken: "Güneşte kurutma", aciklama: "Fesleğen ve sarımsakla zeytinyağında. Makarna, kahvaltı ve sandviç için.", secenek: [["350 g", 230, 3]] },
    { id: "kuru-incir", ad: "Kuru İncir", kat: "kuru", koken: "Aydın, ağaçta olgunlaşmış", aciklama: "Yumuşak, içi bal gibi. Kükürtlenmemiş; renk farkları doğaldır.", secenek: [["500 g", 290, 45], ["1 kg", 540, 20]] },
    { id: "ceviz", ad: "Ceviz İçi", kat: "kuru", koken: "Bu yılın mahsulü", aciklama: "Açık renkli, kırık oranı düşük. Buzdolabında saklayın.", secenek: [["500 g", 420, 16]] },
    { id: "nar-eksisi", ad: "Nar Ekşisi", kat: "ekşi", koken: "Ekşi nardan, katkısız", aciklama: "Kıvamlı, mayhoş. Salata, çiğ köfte ve ezme için. Şeker ya da glikoz şurubu yok.", secenek: [["330 g", 210, 36], ["700 g", 390, 12]] },
    { id: "kekik", ad: "Toros Kekiği", kat: "baharat", koken: "Yabani, elle toplanmış", aciklama: "Yaprakları ayıklanmış, sapsız. Izgara, zeytinyağlı ekmek ve çay için.", secenek: [["80 g", 140, 60]] },
    { id: "pul-biber", ad: "Pul Biber", kat: "baharat", koken: "Güneşte kurutma, az yağlı", aciklama: "Orta acı, parlak kırmızı. Ağzı kapalı kavanozda serin yerde saklayın.", secenek: [["250 g", 160, 2]] },
    { id: "tarhana", ad: "Ev Tarhanası", kat: "baharat", koken: "Yoğurt, domates, biber", aciklama: "Köyde elle ufalanmış, ekşi mayalı. 4 kişilik çorba için 3 yemek kaşığı.", secenek: [["500 g", 260, 28]] }
  ];
  var KATEGORI = { bal: "Bal ve pekmez", zeytin: "Zeytin ve yağ", kuru: "Kuru meyve ve kuruyemiş", "ekşi": "Ekşi ve sos", baharat: "Baharat ve tarhana" };
  var ANAHTAR = { urun: "kiler_urunler_v1", sip: "kiler_siparisler_v1", sepet: "kiler_sepet_v1" };
  function oku(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function tohumSiparis() {
    var u = Date.now(), g = 864e5;
    return [
      { no: "KT-48213", tarih: u - 2 * g, ad: "Selin Aksoy", tel: "0532 000 41 27", il: "İzmir", adres: "Karşıyaka (örnek adres)", kargo: "Yurtiçi", odeme: "Kart", durum: "Teslim edildi", takip: "YK 7712 4402", kalem: [["cam-bali", 1, 1], ["kekik", 0, 2]], kupon: "", },
      { no: "KT-48236", tarih: u - 1 * g, ad: "Mert Yalçın", tel: "0505 000 18 90", il: "Ankara", adres: "Çankaya (örnek adres)", kargo: "Yurtiçi", odeme: "Havale", durum: "Kargoda", takip: "YK 7712 5531", kalem: [["zeytinyagi", 1, 1], ["zeytin", 1, 1]], kupon: "" },
      { no: "KT-48241", tarih: u - 5 * 36e5, ad: "Derya Kılıç", tel: "0544 000 63 12", il: "Antalya", adres: "Muratpaşa (örnek adres)", kargo: "Aras", odeme: "Kart", durum: "Hazırlanıyor", takip: "", kalem: [["kuru-incir", 0, 2], ["nar-eksisi", 0, 1], ["ceviz", 0, 1]], kupon: "" },
      { no: "KT-48244", tarih: u - 40 * 6e4, ad: "Burak Er", tel: "0533 000 77 05", il: "İstanbul", adres: "Kadıköy (örnek adres)", kargo: "Yurtiçi", odeme: "Kapıda", durum: "Yeni", takip: "", kalem: [["cicek-bali", 1, 1], ["tarhana", 0, 2]], kupon: "" }
    ];
  }
  var V = {
    KOK: KOK, KATEGORI: KATEGORI,
    urunler: function () { var x = oku(ANAHTAR.urun, null); if (!x) { x = URUNLER.map(function (u) { return Object.assign({ aktif: true }, u); }); yaz(ANAHTAR.urun, x); } return x; },
    urunKaydet: function (x) { yaz(ANAHTAR.urun, x); },
    urun: function (id) { return V.urunler().filter(function (u) { return u.id === id; })[0]; },
    siparisler: function () { var x = oku(ANAHTAR.sip, null); if (!x) { x = tohumSiparis(); yaz(ANAHTAR.sip, x); } return x; },
    siparisKaydet: function (x) { yaz(ANAHTAR.sip, x); },
    sepet: function () { return oku(ANAHTAR.sepet, []); },
    sepetKaydet: function (x) { yaz(ANAHTAR.sepet, x); try { window.dispatchEvent(new Event("sepet")); } catch (e) {} },
    sifirla: function () { try { localStorage.removeItem(ANAHTAR.urun); localStorage.removeItem(ANAHTAR.sip); localStorage.removeItem(ANAHTAR.sepet); } catch (e) {} },
    tl: function (n) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " TL"; },
    gorsel: function (id) { var u = V.urun(id); return KOK + "img/" + ((u && u.gorselId) || id) + ".jpg"; },
    toplam: function (kalem, kupon) {
      var ara = 0; kalem.forEach(function (k) { var u = V.urun(k[0]); if (u) ara += u.secenek[k[1]][1] * k[2]; });
      var ind = kupon === "DEMO10" ? Math.round(ara * 0.1) : 0;
      var kargo = ara - ind >= 1000 || ara === 0 ? 0 : 89;
      return { ara: ara, ind: ind, kargo: kargo, genel: ara - ind + kargo };
    },
    esc: function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  };
  window.KILER = V;
})();
