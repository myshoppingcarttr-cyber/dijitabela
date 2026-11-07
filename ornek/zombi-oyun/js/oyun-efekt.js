/* EFEKTLER — havuzlu (pool) kan damlası, yer lekesi, mermi kovanı, iz (tracer), namlu parlaması, puan yazıları, patlama, toz. */
(function () {
  const SV = (window.SV = window.SV || {});
  const ADD = () => Phaser.BlendModes.ADD;

  SV.Efekt = class {
    constructor(sc) {
      this.sc = sc; this.Z = SV.CONFIG.ekran.zeminY;
      this.az = SV.Kayit.ayar.kan === "az"; this.dusuk = SV.Kayit.ayar.grafik === "dusuk";
      this.damlalar = []; this.kovanlar = []; this.izler = []; this.lekeler = []; this.yazilar = []; this.tozlar = [];
      for (let i = 0; i < (this.dusuk ? 60 : 140); i++) this.damlalar.push({ o: sc.add.image(0, 0, "kan").setDepth(21).setVisible(false), aktif: false });
      for (let i = 0; i < 36; i++) this.kovanlar.push({ o: sc.add.image(0, 0, "kovan").setDepth(19).setVisible(false), aktif: false });
      for (let i = 0; i < 28; i++) this.lekeler.push({ o: sc.add.image(0, 0, "kanLeke").setDepth(3).setVisible(false), aktif: false });
      for (let i = 0; i < 18; i++) this.tozlar.push({ o: sc.add.image(0, 0, "toz").setDepth(19).setVisible(false), aktif: false });
      for (let i = 0; i < 16; i++) { const t = SV.UI.yazi(sc, 0, 0, "", 26, "#fff", { kontur: 5 }).setDepth(36).setVisible(false); this.yazilar.push({ o: t, aktif: false }); }
      this.izG = sc.add.graphics().setDepth(22).setBlendMode(ADD());
      this.namlu = sc.add.image(0, 0, "namlu").setDepth(23).setBlendMode(ADD()).setVisible(false);
      this.namluIsik = sc.add.image(0, 0, "isik").setDepth(-28).setBlendMode(ADD()).setTint(0xffc070).setVisible(false);
      this.namluIsik2 = sc.add.image(0, 0, "isik").setDepth(24).setBlendMode(ADD()).setTint(0xffb050).setVisible(false);
      this.namluSure = 0; this.lekeSira = 0;
    }
    al(havuz) { for (const p of havuz) if (!p.aktif) return p; return null; }

    kan(x, y, yon, miktar = 8, guc = 1) {
      const n = Math.round(miktar * (this.az ? 0.35 : 1));
      for (let i = 0; i < n; i++) {
        const p = this.al(this.damlalar); if (!p) break;
        const a = (yon > 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.6 - 0.35 * yon * 0;
        const h = (140 + Math.random() * 380) * guc;
        p.aktif = true; p.x = x; p.y = y + (Math.random() - 0.5) * 16; p.vx = Math.cos(a) * h; p.vy = -Math.abs(Math.sin(a)) * h * 0.8 - Math.random() * 160; p.t = 0;
        const s = 0.25 + Math.random() * 0.55; p.o.setVisible(true).setPosition(p.x, p.y).setScale(s).setAlpha(1).setTexture(Math.random() < 0.1 ? "parca" : "kan");
      }
    }
    leke(x, olcek = 1) {
      if (this.az && Math.random() < 0.6) return;
      const p = this.lekeler[this.lekeSira++ % this.lekeler.length];
      p.aktif = true; p.t = 0; p.o.setVisible(true).setPosition(x, this.Z + 6 + Math.random() * 10).setScale(olcek * (0.6 + Math.random() * 0.6), olcek * (0.8 + Math.random() * 0.4)).setAlpha(0.9).setFlipX(Math.random() < 0.5);
    }
    kovan(x, y, yon, tur) {
      const p = this.al(this.kovanlar); if (!p) return;
      p.aktif = true; p.x = x; p.y = y; p.vx = -yon * (60 + Math.random() * 90); p.vy = -(220 + Math.random() * 160); p.r = 0; p.vr = (Math.random() - 0.5) * 40; p.t = 0; p.zipla = 0;
      p.o.setTexture(tur === "pompali" ? "kovanK" : "kovan").setVisible(true).setAlpha(1).setPosition(x, y);
    }
    iz(x1, y1, x2, y2, kalin = 2, renk = 0xffe2a0) { this.izler.push({ x1, y1, x2, y2, t: 0, kalin, renk }); }
    namluParla(x, y, yon, olcek = 1) {
      this.namlu.setVisible(true).setPosition(x, y).setFlipX(yon < 0).setOrigin(yon > 0 ? 0.06 : 0.94, 0.5).setScale(olcek * (0.8 + Math.random() * 0.4), olcek * (0.7 + Math.random() * 0.6)).setRotation((Math.random() - 0.5) * 0.15);
      this.namluIsik.setVisible(true).setPosition(x, y).setScale(3.2 * olcek).setAlpha(0.55);
      this.namluIsik2.setVisible(true).setPosition(x, y).setScale(0.7 * olcek).setAlpha(0.7);
      this.namluSure = 0.05;
    }
    yazi(x, y, metin, renk = "#ffffff", boyut = 26) {
      const p = this.al(this.yazilar) || this.yazilar[0];
      p.aktif = true; p.t = 0; p.y0 = y; p.o.setText(metin).setColor(renk).setFontSize(boyut).setPosition(x, y).setVisible(true).setAlpha(1).setScale(0.6);
    }
    toz(x, y, adet = 3, olcek = 1) {
      for (let i = 0; i < adet; i++) { const p = this.al(this.tozlar); if (!p) return; p.aktif = true; p.t = 0; p.vx = (Math.random() - 0.5) * 140; p.o.setVisible(true).setPosition(x + (Math.random() - 0.5) * 30, y - 6).setScale(olcek).setAlpha(0.8); }
    }
    patlama(x, y, r = 130) {
      const sc = this.sc, p = sc.add.image(x, y, "patlama").setDepth(24).setBlendMode(ADD()).setScale(0.3);
      sc.tweens.add({ targets: p, scale: r / 40, alpha: 0, duration: 520, ease: "Cubic.out", onComplete: () => p.destroy() });
      const i = sc.add.image(x, y, "isik").setDepth(-28).setBlendMode(ADD()).setTint(0xff9a40).setScale(6).setAlpha(0.8);
      sc.tweens.add({ targets: i, alpha: 0, duration: 700, onComplete: () => i.destroy() });
      for (let k = 0; k < 6; k++) { const d = sc.add.image(x + (Math.random() - 0.5) * r, y - Math.random() * 40, "duman").setDepth(23).setTint(0x2a2622).setScale(1.5).setAlpha(0.7); sc.tweens.add({ targets: d, y: d.y - 80 - Math.random() * 60, scale: 4, alpha: 0, duration: 1400 + Math.random() * 600, onComplete: () => d.destroy() }); }
      this.toz(x, this.Z, 6, 2);
    }

    guncelle(dt) {
      const Z = this.Z, g = 1500;
      for (const p of this.damlalar) {
        if (!p.aktif) continue;
        p.t += dt; p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y > Z + 8 && p.vy > 0) { if (Math.random() < 0.08) this.leke(p.x, 0.35); p.aktif = false; p.o.setVisible(false); continue; }
        p.o.setPosition(p.x, p.y); if (p.t > 1.2) { p.aktif = false; p.o.setVisible(false); }
      }
      for (const p of this.kovanlar) {
        if (!p.aktif) continue;
        p.t += dt;
        if (p.zipla < 3) { p.vy += 1600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; if (p.y > Z + 10) { p.y = Z + 10; p.vy = -p.vy * 0.35; p.vx *= 0.5; p.vr *= 0.5; p.zipla++; } }
        p.o.setPosition(p.x, p.y).setRotation(p.r);
        if (p.t > 2.5) { p.o.setAlpha(Math.max(0, 1 - (p.t - 2.5) * 2)); if (p.t > 3) { p.aktif = false; p.o.setVisible(false); } }
      }
      for (const p of this.lekeler) { if (!p.aktif) continue; p.t += dt; if (p.t > 14) { p.o.setAlpha(Math.max(0, 0.9 - (p.t - 14))); if (p.t > 15) { p.aktif = false; p.o.setVisible(false); } } }
      for (const p of this.tozlar) { if (!p.aktif) continue; p.t += dt; p.o.x += p.vx * dt; p.o.y -= 20 * dt; p.o.setScale(p.o.scaleX + dt * 1.2).setAlpha(Math.max(0, 0.8 - p.t * 1.3)); if (p.t > 0.65) { p.aktif = false; p.o.setVisible(false); } }
      for (const p of this.yazilar) {
        if (!p.aktif) continue; p.t += dt;
        const s = p.t < 0.12 ? 0.6 + (p.t / 0.12) * 0.6 : 1.2 - Math.min(0.2, (p.t - 0.12) * 2);
        p.o.setScale(s).setY(p.y0 - p.t * 55).setAlpha(p.t > 0.7 ? Math.max(0, 1 - (p.t - 0.7) * 3) : 1);
        if (p.t > 1.05) { p.aktif = false; p.o.setVisible(false); }
      }
      this.izG.clear();
      this.izler = this.izler.filter((z) => { z.t += dt; const a = 1 - z.t / 0.07; if (a <= 0) return false; this.izG.lineStyle(z.kalin, z.renk, a * 0.9); this.izG.lineBetween(z.x1, z.y1, z.x2, z.y2); this.izG.lineStyle(z.kalin * 3, z.renk, a * 0.15); this.izG.lineBetween(z.x1, z.y1, z.x2, z.y2); return true; });
      if (this.namluSure > 0) { this.namluSure -= dt; if (this.namluSure <= 0) { this.namlu.setVisible(false); this.namluIsik.setVisible(false); this.namluIsik2.setVisible(false); } }
    }
  };
})();
