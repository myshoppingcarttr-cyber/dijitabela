/* Başlatıcı: yazı tipleri + veri yüklenir, Phaser oyunu ekrana sığacak şekilde kurulur, döndürmede yeniden yerleşir. */
(function () {
  const SV = window.SV;
  const yukleme = document.getElementById("yukleme"), cubuk = document.querySelector("#cubuk i"), yMetin = document.getElementById("yukMetin");
  SV.yuklemeIlerle = (o, m) => { cubuk.style.width = Math.round(o * 100) + "%"; if (m) yMetin.textContent = m; };
  SV.yuklemeBitti = () => { yukleme.style.opacity = "0"; setTimeout(() => (yukleme.style.display = "none"), 520); };
  const hata = (m) => { document.getElementById("hata").textContent = m; };

  function ekranBoyu() {
    const vv = window.visualViewport;
    return { w: Math.round(vv ? vv.width : innerWidth), h: Math.round(vv ? vv.height : innerHeight) };
  }

  async function basla() {
    if (!window.Phaser) { hata("Oyun motoru yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin."); return; }
    SV.yuklemeIlerle(0.05, "Yazı tipleri");
    try { await Promise.race([Promise.all([document.fonts.load("700 40px Oswald"), document.fonts.load("500 20px Oswald"), document.fonts.load("500 20px Barlow")]), new Promise((r) => setTimeout(r, 2500))]); } catch (e) {}
    SV.yuklemeIlerle(0.1, "Bölüm verileri");
    try { await SV.veriYukle(); } catch (e) { hata("Veri dosyaları okunamadı: " + e.message); return; }
    SV.Kayit.yukle();
    SV.CONFIG.grafik = SV.Kayit.ayar.grafik;

    const b = ekranBoyu();
    SV.Y = SV.yerlesimHesapla(b.w, b.h);
    SV.oyun = new Phaser.Game({
      type: Phaser.AUTO, parent: "oyun", backgroundColor: "#05070b",
      width: SV.Y.W, height: SV.Y.H,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { activePointers: 4 },
      render: { antialias: true, powerPreference: "high-performance", roundPixels: false },
      fps: { target: 60, smoothStep: true, forceSetTimeOut: SV.parametre("test") === "1" },
      audio: { noAudio: true },
      scene: [SV.SahneYukle, SV.SahneMenu, SV.SahneHikaye, SV.SahneOyun, SV.SahneArayuz, SV.SahneSonuc]
    });

    let zaman = null;
    const yenidenBoyutla = () => {
      clearTimeout(zaman);
      zaman = setTimeout(() => {
        const b2 = ekranBoyu(), y = SV.yerlesimHesapla(b2.w, b2.h);
        const degisti = y.W !== SV.Y.W || y.H !== SV.Y.H;
        SV.Y = y;
        if (degisti) SV.oyun.scale.setGameSize(y.W, y.H); else SV.oyun.scale.refresh();
      }, 120);
    };
    window.addEventListener("resize", yenidenBoyutla);
    window.addEventListener("orientationchange", yenidenBoyutla);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", yenidenBoyutla);

    const sesAc = () => SV.Ses.baslat();
    window.addEventListener("pointerdown", sesAc, true);
    window.addEventListener("keydown", sesAc, true);
    document.addEventListener("visibilitychange", () => { if (document.hidden && SV.aktifOyun) SV.aktifOyun.duraklat && SV.aktifOyun.duraklat(true); });
  }
  window.addEventListener("load", basla);
})();
