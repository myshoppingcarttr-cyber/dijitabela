/* YÜKLEME: müşteri görselleri (varsa) yüklenir, ardından tüm sanat yordamsal üretilir. */
(function () {
  const SV = (window.SV = window.SV || {});
  SV.SahneYukle = class extends Phaser.Scene {
    constructor() { super("Yukle"); }
    preload() {
      const H = SV.CONFIG.hariciGorseller || {};
      Object.keys(H).forEach((k) => { const a = H[k]; if (a && a.dosya) this.load.spritesheet(k, a.dosya, { frameWidth: a.kareG, frameHeight: a.kareY }); });
      this.load.on("progress", (v) => SV.yuklemeIlerle(0.1 + v * 0.1, "Görseller"));
    }
    async create() {
      await SV.Sanat.uret(this, (o, m) => SV.yuklemeIlerle(0.2 + o * 0.8, m));
      SV.yuklemeBitti();
      const hedef = SV.parametre("sahne");
      if (SV.GELISTIRICI && SV.Gelistirici) SV.Gelistirici.kur();
      if (hedef === "oyun") this.scene.start("Oyun", { bolumId: SV.parametre("bolum") || "b1", bolge: +(SV.parametre("bolge") || 0) });
      else if (hedef === "sanat") this.scene.start("Menu", { sanat: true });
      else this.scene.start("Menu");
    }
  };
})();
