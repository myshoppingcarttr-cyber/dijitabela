/* SON VARDİYA — genel ayarlar.
   Oynanış sayıları veri/*.json dosyalarındadır (denge, silahlar, bölümler).
   Bu dosyada: ekran, renk temaları, kontrol düzeni, ses seviyeleri ve müşteri görsellerinin takılması. */
(function () {
  const SV = (window.SV = window.SV || {});

  SV.CONFIG = {
    surum: "2.0.0",
    oyunAdi: "SON VARDİYA",
    altBaslik: "SALGININ İLK GECESİ",
    kayitAnahtari: "sv_zombi_kayit_v2",

    ekran: {
      dunyaYukseklik: 720,      // dünya her zaman 720 birim yüksek
      zeminY: 600,              // karakterlerin ayak çizgisi
      yatayMinGenislik: 1024,   // yatay ekranda görünen dünya genişliği sınırları
      yatayMaxGenislik: 1680,
      dikeyGenislik: 720,       // dikey ekranda oyun alanı genişliği
      dikeyKontrolPayi: 400,    // dikeyde altta kontrol paneline ayrılan en az yükseklik
      kameraOnBakis: 0.16,      // kahramanın baktığı yöne kamera kayması (ekran oranı)
      kameraYumusaklik: 6       // büyüdükçe kamera daha sert takip eder
    },

    temalar: {
      gece:  { karakterRengi: 0xb9c3d9, isikRengi: 0xffb35c, sisRengi: 0x6f86a8, sisAlfa: 0.30, yagmur: true,  fener: true  },
      safak: { karakterRengi: 0xffe6da, isikRengi: 0xffc48a, sisRengi: 0xf1d2d6, sisAlfa: 0.34, yagmur: false, fener: false }
    },

    renkler: {
      vurgu: "#f2c14e", vurguKoyu: "#b4801f", kan: "#a3121b", tehlike: "#e5484d", basari: "#6ad18a",
      panel: "rgba(10,12,16,0.82)", panelKenar: "rgba(242,193,78,0.35)", metin: "#efe9dc", soluk: "#9a9488"
    },

    kontrol: {
      joystickYaricap: 70,
      dugmeOlcek: 1.0,          // ayarlardan da değiştirilebilir
      titresim: true
    },

    ses: { muzik: 0.55, efekt: 0.85 },

    /* MÜŞTERİ GÖRSELLERİ (README > "Kendi tasarımlarınızı takmak")
       Bir anahtarı doldurursanız o karakter için yordamsal çizim yerine sizin sprite sheet'iniz yüklenir.
       Kare dizilimi: README'deki tabloya uyun (ya da 'animasyonlar' ile kendi kare aralıklarınızı verin).
       Örnek:
       kahraman: { dosya: "assets/musteri/kahraman.png", kareG: 240, kareY: 170, ayakX: 110, ayakY: 164 },
    */
    hariciGorseller: {
      // kahraman: null, aylak: null, aylak2: null, kosucu: null, hantal: null, kasap: null, dev: null
    },

    grafik: "yuksek"            // "yuksek" | "dusuk" (ayarlardan değişir)
  };

  /* Ekran yerleşimi: yatayda dünya tüm ekranı kaplar; dikeyde üstte gösterge, ortada oyun, altta kontrol paneli. */
  SV.yerlesimHesapla = function (pw, ph) {
    const E = SV.CONFIG.ekran, oran = pw / Math.max(1, ph);
    if (oran >= 1.05) {
      const H = E.dunyaYukseklik;
      const W = Math.round(Math.min(E.yatayMaxGenislik, Math.max(E.yatayMinGenislik, H * oran)));
      return { W, H, dikey: false, dunyaX: 0, dunyaY: 0, dunyaW: W, dunyaH: H };
    }
    const W = E.dikeyGenislik;
    const H = Math.round(Math.min(1800, Math.max(E.dunyaYukseklik + E.dikeyKontrolPayi + 120, W / oran)));
    const bos = H - E.dunyaYukseklik - E.dikeyKontrolPayi;
    const dunyaY = Math.round(Math.max(118, Math.min(bos * 0.55, 330)));
    return { W, H, dikey: true, dunyaX: 0, dunyaY, dunyaW: W, dunyaH: E.dunyaYukseklik };
  };

  SV.parametre = function (ad) {
    try { return new URLSearchParams(location.search).get(ad); } catch (e) { return null; }
  };
  SV.GELISTIRICI = SV.parametre("gelistirici") === "1";
  SV.gelistirici = { olumsuz: false, sinirsizMermi: false, zorlukCarpani: 1, fps: SV.GELISTIRICI };

  /* veri/*.json dosyalarını yükler */
  SV.veriYukle = async function () {
    const al = async (ad) => {
      const r = await fetch("veri/" + ad + ".json?v=" + SV.CONFIG.surum, { cache: "no-cache" });
      if (!r.ok) throw new Error(ad + ".json yüklenemedi (" + r.status + ")");
      return r.json();
    };
    const [denge, silahlar, bolumler] = await Promise.all([al("denge"), al("silahlar"), al("bolumler")]);
    SV.VERI = { denge, silahlar, bolumler };
    return SV.VERI;
  };

  SV.bolumBul = (id) => SV.VERI.bolumler.bolumler.find((b) => b.id === id);
  SV.karakter = (kim) => SV.VERI.bolumler.karakterler[kim] || SV.VERI.bolumler.karakterler.anlatici;
})();
