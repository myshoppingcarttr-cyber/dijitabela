/* BÖLÜM SONU — istatistikler sayarak gelir, yıldızlar tek tek düşer; Devam / Tekrar / Menü */
(function () {
  const SV = (window.SV = window.SV || {});
  SV.SahneSonuc = class extends Phaser.Scene {
    constructor() { super("Sonuc"); }
    init(d) { this.v = d; }
    create() {
      SV.aktifOyun = null;
      const Y = SV.Y, W = Y.W, H = Y.H, v = this.v, B = SV.bolumBul(v.bolumId), L = SV.VERI.bolumler.bolumler, sira = L.indexOf(B), sonraki = L[sira + 1];
      this.cameras.main.fadeIn(500, 0, 0, 0);
      const kat = SV.Dunya.katmanlar(this, B.tema, W, H, Y.dikey ? H * 0.55 - 600 : 0); this.kat = kat; this.kay = 0;
      this.add.rectangle(0, 0, W, H, 0x000000, 0.55).setOrigin(0, 0).setDepth(1);
      const pw = Math.min(660, W - 40), ph = Y.dikey ? 1020 : 640, cy = H / 2;
      this.add.existing(SV.UI.panel(this, W / 2, cy, pw, ph).setDepth(2));
      const ust = cy - ph / 2;
      SV.UI.yazi(this, W / 2, ust + 50, "BÖLÜM TAMAMLANDI", 40, "#f2c14e", { harf: 4 }).setDepth(3);
      SV.UI.yazi(this, W / 2, ust + 90, B.ad, 22, "#efe9dc", { govde: true }).setDepth(3);
      // yıldızlar
      const yy = ust + 170;
      for (let i = 0; i < 3; i++) {
        const x = W / 2 + (i - 1) * 110, s = i === 1 ? 1.5 : 1.2;
        this.add.image(x, yy - (i === 1 ? 10 : 0), "yildiz_bos").setScale(s).setDepth(3);
        if (i < v.yildiz) { const y = this.add.image(x, yy - (i === 1 ? 10 : 0), "yildiz_dolu").setScale(s * 2.4).setAlpha(0).setDepth(4).setAngle(-30); this.tweens.add({ targets: y, alpha: 1, scale: s, angle: 0, delay: 1700 + i * 380, duration: 360, ease: "Back.out", onStart: () => { SV.Ses.cal("yildiz", { i }); this.cameras.main.shake(120, 0.004); } }); }
      }
      const I = v.ist, isabet = I.atis ? Math.round((I.isabet / I.atis) * 100) : 0, dk = Math.floor(I.sure / 60), sn = Math.floor(I.sure % 60);
      const satirlar = [["Öldürülen zombi", I.olduren], ["Kafa isabeti", I.kafa], ["İsabet oranı", "%" + isabet], ["En uzun kombo", I.maxKombo], ["Süre", dk + ":" + String(sn).padStart(2, "0")], ["Kalan can bonusu", "+" + v.canBonus], ["Zaman bonusu", "+" + v.zamanBonus]];
      const sx = W / 2 - pw / 2 + 60, ex = W / 2 + pw / 2 - 60, y0 = ust + 250, ara = Y.dikey ? 46 : 36;
      satirlar.forEach(([a, b], i) => {
        const t1 = SV.UI.yazi(this, sx, y0 + i * ara, a, 20, "#b9b2a2", { ox: 0, govde: true }).setDepth(3).setAlpha(0), t2 = SV.UI.yazi(this, ex, y0 + i * ara, String(b), 22, "#efe9dc", { ox: 1 }).setDepth(3).setAlpha(0);
        this.tweens.add({ targets: [t1, t2], alpha: 1, x: "+=0", delay: 200 + i * 150, duration: 250, onStart: () => SV.Ses.cal("tiklama", { v: 0.4 }) });
      });
      const ty = y0 + satirlar.length * ara + 26;
      const g = this.add.graphics().setDepth(3); g.lineStyle(1, 0xefe9dc, 0.2); g.lineBetween(sx, ty - 14, ex, ty - 14);
      SV.UI.yazi(this, sx, ty + 16, "TOPLAM PUAN", 24, "#f2c14e", { ox: 0 }).setDepth(3);
      const top = SV.UI.yazi(this, ex, ty + 16, "0", 40, "#f2c14e", { ox: 1 }).setDepth(3);
      const say = { n: 0 }; this.tweens.add({ targets: say, n: v.toplam, delay: 1300, duration: 900, ease: "Cubic.out", onUpdate: () => top.setText(Math.round(say.n).toLocaleString("tr-TR")) });
      const enIyi = SV.Kayit.veri.enIyi[B.id] || 0;
      if (v.toplam >= enIyi) SV.UI.yazi(this, ex, ty + 50, "YENİ REKOR", 14, "#6ad18a", { ox: 1, harf: 2 }).setDepth(3);
      const by = cy + ph / 2 - (Y.dikey ? 220 : 120), bw = Y.dikey ? pw - 100 : 240;
      const devam = () => {
        const son = !sonraki;
        this.scene.start("Hikaye", { bolumId: B.id, tur: "cikis", sonra: son ? { sahne: "Menu", veri: { tebrikler: true } } : { sahne: "Hikaye", veri: { bolumId: sonraki.id, tur: "giris", sonra: { sahne: "Oyun", veri: { bolumId: sonraki.id } } } } });
      };
      const D = [[sonraki ? "SONRAKİ BÖLÜM" : "FİNAL", devam, { birincil: true, ikon: "ikon_ok" }], ["TEKRAR", () => SV.akis.bolumBaslat(this, B.id, false), { ikon: "ikon_tekrar" }], ["MENÜ", () => this.scene.start("Menu"), { ikon: "ikon_ev" }]];
      D.forEach(([e, cb, o], i) => {
        const x = Y.dikey ? W / 2 : W / 2 + (i - 1) * (bw / 1.5 + 16), y = Y.dikey ? by + i * 72 : by, w = Y.dikey ? bw : i === 0 ? bw : bw / 1.6;
        const d = SV.UI.dugme(this, Y.dikey ? x : i === 0 ? W / 2 - 110 : W / 2 + (i === 1 ? 95 : 225), y, Y.dikey ? w : i === 0 ? 260 : 120, 58, e, cb, o).setDepth(5);
        d.setAlpha(0); this.tweens.add({ targets: d, alpha: 1, delay: 2600 + i * 100, duration: 300 });
      });
      this.input.keyboard.on("keydown-ENTER", devam);
      const yb = () => this.scene.restart(this.v);
      this.scale.on("resize", yb);
      this.events.once("shutdown", () => this.scale.off("resize", yb));
    }
    update(t, dt) { this.kay += dt * 0.02; this.kat.guncelle(this.kay, t); }
  };
})();
