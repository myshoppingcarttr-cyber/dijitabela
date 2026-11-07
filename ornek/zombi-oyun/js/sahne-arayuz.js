/* ARAYÜZ — gösterge (can, mermi, skor, görev, boss), dokunmatik kontroller, telsiz diyalogları, afişler, duraklat ve ölüm ekranları. */
(function () {
  const SV = (window.SV = window.SV || {});
  const RENK = { vurgu: 0xf2c14e, kan: 0xc0242c, can: 0x6ad18a };

  SV.SahneArayuz = class extends Phaser.Scene {
    constructor() { super("Arayuz"); }
    init(d) { this.oyun = (d && d.oyun) || SV.aktifOyun; }
    create() {
      const Y = SV.Y, W = Y.W, H = Y.H;
      this.dokunmatik = this.dokunmatik || SV.parametre("dokunmatik") === "1" || (window.matchMedia && matchMedia("(pointer: coarse)").matches);
      this.diyalogKuyruk = []; this.diyalogAktif = null; this.son = {};
      this.input.addPointer(3);
      // dikey: üst ve alt panel zemini
      if (Y.dikey) {
        const g = this.add.graphics().setDepth(-1);
        g.fillGradientStyle(0x0a0d14, 0x0a0d14, 0x05070b, 0x05070b, 1); g.fillRect(0, 0, W, Y.dunyaY);
        g.fillGradientStyle(0x05070b, 0x05070b, 0x0b0e15, 0x0b0e15, 1); g.fillRect(0, Y.dunyaY + 720, W, H - Y.dunyaY - 720);
        g.lineStyle(2, RENK.vurgu, 0.25); g.lineBetween(0, Y.dunyaY - 1, W, Y.dunyaY - 1); g.lineBetween(0, Y.dunyaY + 721, W, Y.dunyaY + 721);
      }
      this.hasarPerde = this.add.image(Y.dunyaX, Y.dunyaY, "vinyet").setOrigin(0, 0).setDisplaySize(Y.dunyaW, 720).setTint(0xff0000).setAlpha(0).setDepth(1);
      this.gostergeKur();
      this.kontrolKur();
      this.girdiKur();
      this.scale.on("resize", this.yeniden, this);
      this.events.once("shutdown", () => this.scale.off("resize", this.yeniden, this));
      if (this.oyun && this.oyun.scene.isPaused()) this.duraklatGoster(true);
      if (this.oyun && this.oyun.bolgeNo === 0 && this.oyun.B.id === "b1" && !this.dokunmatik) this.time.delayedCall(600, () => this.klavyeIpucu());
      if (this.dokunmatik && this.oyun && this.oyun.bolgeNo === 0) this.time.delayedCall(600, () => this.dokunmaIpucu());
    }
    yeniden() { this.scene.restart({ oyun: this.oyun }); }

    /* ---------------- GÖSTERGE ---------------- */
    gostergeKur() {
      const Y = SV.Y, W = Y.W, dik = Y.dikey;
      const ust = dik ? 26 : 18, sol = 22;
      this.hud = this.add.container(0, 0).setDepth(10);
      // can
      this.add.image(sol + 16, ust + 16, "ikon_kalp").setDisplaySize(30, 30).setTint(0xe5484d).setDepth(10);
      this.canG = this.add.graphics().setDepth(10);
      this.canBarW = dik ? 300 : 280; this.canX = sol + 40; this.canY = ust + 8;
      this.canYazi = SV.UI.yazi(this, this.canX + this.canBarW + 10, ust + 16, "100", 20, "#efe9dc", { ox: 0 }).setDepth(10);
      // silah + mermi
      this.silahIkon = this.add.image(sol + 60, ust + 62, "ikon_tabanca").setDepth(10).setScale(0.8).setAlpha(0.95);
      this.mermiYazi = SV.UI.yazi(this, sol + 130, ust + 62, "12", 32, "#efe9dc", { ox: 0 }).setDepth(10);
      this.yedekYazi = SV.UI.yazi(this, sol + 130, ust + 62, "/ ∞", 20, "#9a9488", { ox: 0 }).setDepth(10);
      this.doldurG = this.add.graphics().setDepth(10);
      this.doldurYazi = SV.UI.yazi(this, sol + 130, ust + 94, "ŞARJÖR…", 16, "#f2c14e", { ox: 0 }).setDepth(10).setVisible(false);
      // skor
      this.duraklatD = SV.UI.ikonDugme(this, W - 40, dik ? 44 : 40, 26, "ikon_duraklat", () => this.oyun && this.oyun.duraklat(true)).setDepth(20);
      this.skorYazi = SV.UI.yazi(this, W - 82, ust + 14, "0", 34, "#efe9dc", { ox: 1 }).setDepth(10);
      this.skorEt = SV.UI.yazi(this, W - 82, ust + 44, "PUAN", 14, "#9a9488", { ox: 1 }).setDepth(10);
      this.komboYazi = SV.UI.yazi(this, W - 82, ust + 74, "", 24, "#f2c14e", { ox: 1 }).setDepth(10);
      // görev
      const gx = dik ? W / 2 : W / 2, gy = dik ? ust + 128 : ust + 8;
      this.gorevAd = SV.UI.yazi(this, gx, gy, "", 15, "#f2c14e", { harf: 2 }).setDepth(10);
      this.gorevYazi = SV.UI.yazi(this, gx, gy + 24, "", dik ? 24 : 22, "#efe9dc", { govde: true }).setDepth(10);
      this.gorevG = this.add.graphics().setDepth(10); this.gorevBarY = gy + 50;
      this.gorevSayac = SV.UI.yazi(this, gx, gy + 76, "", 26, "#efe9dc").setDepth(10);
      // bölüm ilerleme çizgisi
      this.ilerG = this.add.graphics().setDepth(10);
      // boss
      this.bossG = this.add.graphics().setDepth(11); this.bossAd = SV.UI.yazi(this, W / 2, 0, "", 18, "#ff8a7a", { harf: 3 }).setDepth(11).setVisible(false);
      // ilerle oku
      this.ilerleOk = this.add.container(Y.dunyaX + Y.dunyaW - 70, Y.dunyaY + 330).setDepth(9).setVisible(false);
      this.ilerleOk.add([this.add.image(0, 0, "ikon_ok").setScale(1.2).setTint(0xf2c14e), SV.UI.yazi(this, 0, 46, "İLERLE", 20, "#f2c14e")]);
      this.tweens.add({ targets: this.ilerleOk, x: this.ilerleOk.x + 14, duration: 500, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    }
    guncelleGosterge() {
      const D = SV.D; if (!D) return;
      const Y = SV.Y, s = this.son;
      if (s.can !== D.can) {
        s.can = D.can; const o = D.can / D.canMax, g = this.canG; g.clear();
        g.fillStyle(0x000000, 0.55); g.fillRoundedRect(this.canX - 3, this.canY - 3, this.canBarW + 6, 22, 6);
        g.fillStyle(0x3a1214, 1); g.fillRoundedRect(this.canX, this.canY, this.canBarW, 16, 4);
        g.fillStyle(o > 0.5 ? RENK.can : o > 0.25 ? 0xf2c14e : 0xe5484d, 1); g.fillRoundedRect(this.canX, this.canY, Math.max(4, this.canBarW * o), 16, 4);
        g.fillStyle(0xffffff, 0.25); g.fillRect(this.canX + 3, this.canY + 2, Math.max(0, this.canBarW * o - 6), 4);
        for (let i = 1; i < 10; i++) { g.fillStyle(0x000000, 0.3); g.fillRect(this.canX + (this.canBarW * i) / 10, this.canY, 1.5, 16); }
        this.canYazi.setText(Math.ceil(D.can));
      }
      this.hasarPerde.setAlpha(D.can / D.canMax < 0.3 && !D.olu ? 0.35 + Math.sin(this.time.now / 200) * 0.15 : Math.max(0, this.hasarPerde.alpha - 0.02));
      if (s.silah !== D.silah) { s.silah = D.silah; this.silahIkon.setTexture("ikon_" + D.silah).setScale(D.silah === "tabanca" ? 0.7 : 0.75); this.tweens.add({ targets: this.silahIkon, scale: { from: 1.1, to: this.silahIkon.scale }, duration: 200 }); if (this.silahD) this.silahD.ikonK.setTexture("ikon_" + D.silah); }
      const mm = D.sarjor + "|" + D.yedek;
      if (s.mm !== mm) { s.mm = mm; this.mermiYazi.setText(String(D.sarjor)).setColor(D.sarjor === 0 ? "#e5484d" : D.sarjor <= D.sarjorMax * 0.25 ? "#f2c14e" : "#efe9dc"); this.yedekYazi.setText("/ " + (D.yedek < 0 ? "∞" : D.yedek)).setX(this.mermiYazi.x + this.mermiYazi.width + 6); }
      this.doldurG.clear(); this.doldurYazi.setVisible(D.doldurma >= 0);
      if (D.doldurma >= 0) { this.doldurG.fillStyle(0x000000, 0.5); this.doldurG.fillRect(this.mermiYazi.x, this.doldurYazi.y + 12, 110, 4); this.doldurG.fillStyle(RENK.vurgu, 1); this.doldurG.fillRect(this.mermiYazi.x, this.doldurYazi.y + 12, 110 * D.doldurma, 4); }
      if (s.skor !== D.skor) { s.skor = D.skor; this.skorYazi.setText(D.skor.toLocaleString("tr-TR")); }
      if (s.kombo !== D.kombo) { s.kombo = D.kombo; this.komboYazi.setText(D.kombo >= 2 ? "KOMBO " + D.kombo : ""); }
      // görev
      const G = D.gorev, gk = G ? G.ad + G.metin + (G.sayac !== null ? Math.ceil(G.sayac) : "") + (G.ilerleme !== null ? Math.round(G.ilerleme * 100) : "") : D.ilerle ? "ilerle" : "";
      if (s.gk !== gk) {
        s.gk = gk; this.gorevG.clear();
        if (G) {
          this.gorevAd.setText(G.ad.toUpperCase()); this.gorevYazi.setText(G.metin);
          if (G.ilerleme !== null) { const bw = 260, x = this.gorevAd.x - bw / 2; this.gorevG.fillStyle(0x000000, 0.55); this.gorevG.fillRoundedRect(x - 2, this.gorevBarY - 2, bw + 4, 12, 5); this.gorevG.fillStyle(G.ilerlemeAd === "KAPI" ? (G.ilerleme < 0.3 ? 0xe5484d : 0x9ec5ff) : RENK.vurgu, 1); this.gorevG.fillRoundedRect(x, this.gorevBarY, bw * G.ilerleme, 8, 4); }
          this.gorevSayac.setText(G.sayac !== null ? "0:" + String(Math.ceil(G.sayac)).padStart(2, "0") + (G.ilerlemeAd ? "   KAPI %" + Math.round(G.ilerleme * 100) : "") : "");
        } else { this.gorevAd.setText(D.ilerle ? "SIRADAKİ HEDEF" : ""); this.gorevYazi.setText(D.ilerle ? "İlerle →" : ""); this.gorevSayac.setText(""); }
      }
      this.ilerleOk.setVisible(!!D.ilerle && !this.diyalogAktif);
      // bölüm ilerleme
      const ig = this.ilerG; ig.clear(); const iw = SV.Y.dikey ? 300 : 220, ix = SV.Y.W / 2 - iw / 2, iy = SV.Y.dikey ? SV.Y.dunyaY - 16 : 700;
      ig.fillStyle(0xffffff, 0.12); ig.fillRect(ix, iy, iw, 3); ig.fillStyle(RENK.vurgu, 0.9); ig.fillRect(ix, iy, iw * Phaser.Math.Clamp(D.bolumIlerleme, 0, 1), 3); ig.fillCircle(ix + iw * Phaser.Math.Clamp(D.bolumIlerleme, 0, 1), iy + 1.5, 5);
      // boss
      const bg = this.bossG; bg.clear();
      if (D.boss) {
        const bw = Math.min(560, SV.Y.W - 120), bx = SV.Y.W / 2 - bw / 2, by = SV.Y.dikey ? SV.Y.dunyaY + 24 : 118;
        bg.fillStyle(0x000000, 0.6); bg.fillRoundedRect(bx - 4, by - 4, bw + 8, 22, 6); bg.fillStyle(0x3a0c0e, 1); bg.fillRect(bx, by, bw, 14);
        bg.fillStyle(0xd23a2e, 1); bg.fillRect(bx, by, bw * (D.boss.can / D.boss.max), 14); bg.fillStyle(0xffffff, 0.2); bg.fillRect(bx, by, bw * (D.boss.can / D.boss.max), 4);
        this.bossAd.setVisible(true).setText(D.boss.ad).setY(by + 34);
      } else this.bossAd.setVisible(false);
    }

    /* ---------------- DOKUNMATİK KONTROLLER ---------------- */
    kontrolKur() {
      const Y = SV.Y, W = Y.W, H = Y.H, dik = Y.dikey, o = SV.CONFIG.kontrol.dugmeOlcek;
      this.kontrol = this.add.container(0, 0).setDepth(15).setVisible(this.dokunmatik);
      let jx, jy, d;
      if (dik) {
        const ust = Y.dunyaY + 720, mid = ust + (H - ust) * 0.52; jx = 170; jy = mid;
        d = { ates: [W - 150, mid + 20, 88], zipla: [W - 330, mid + 110, 58], doldur: [W - 108, mid - 150, 46], degis: [W - 268, mid - 100, 46] };
      } else { jx = 170; jy = H - 160; d = { ates: [W - 140, H - 150, 80], zipla: [W - 310, H - 90, 56], doldur: [W - 110, H - 320, 44], degis: [W - 260, H - 260, 44] }; }
      this.joy = { x0: jx, y0: jy, x: jx, y: jy, r: SV.CONFIG.kontrol.joystickYaricap * 1.2, id: null };
      this.joyTaban = this.add.image(jx, jy, "joy_taban").setDisplaySize(this.joy.r * 2.2, this.joy.r * 2.2).setAlpha(0.6);
      this.joyTop = this.add.image(jx, jy, "joy_top").setDisplaySize(this.joy.r * 0.95, this.joy.r * 0.95).setAlpha(0.8);
      this.kontrol.add([this.joyTaban, this.joyTop]);
      this.dugmeler = {};
      const etiketler = { ates: "ATEŞ", zipla: "ZIPLA", doldur: "ŞARJÖR", degis: "SİLAH" }, ikonlar = { ates: "ikon_ates", zipla: "ikon_zipla", doldur: "ikon_doldur", degis: "ikon_degis" };
      Object.keys(d).forEach((k) => {
        const [x, y, r0] = d[k], r = r0 * o;
        const taban = this.add.image(x, y, "dugme_daire").setDisplaySize(r * 2, r * 2).setAlpha(k === "ates" ? 0.95 : 0.8);
        if (k === "ates") taban.setTint(0xffc9a0);
        const ik = this.add.image(x, y - (k === "ates" ? 8 : 6), k === "degis" ? "ikon_" + (SV.D ? SV.D.silah : "tabanca") : ikonlar[k]).setDisplaySize(k === "degis" ? r * 1.3 : r * 0.8, k === "degis" ? r * 0.45 : r * 0.8).setAlpha(0.9);
        const et = SV.UI.yazi(this, x, y + r * 0.55, etiketler[k], k === "ates" ? 18 : 14, "#efe9dc").setAlpha(0.8);
        this.kontrol.add([taban, ik, et]);
        this.dugmeler[k] = { x, y, r, taban, id: null, basili: false, ikonK: ik };
      });
      this.silahD = this.dugmeler.degis;
      if (dik) { const ip = SV.UI.yazi(this, W / 2, H - 40, "⟳  Telefonu yatay çevirirsen görüş alanın genişler", 17, "#8a8478", { govde: true }); this.kontrol.add(ip); }
    }
    girdiKur() {
      const enYakin = (p) => { for (const k in this.dugmeler) { const b = this.dugmeler[k]; if (Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) <= b.r * 1.15) return k; } return null; };
      const solYari = (p) => (SV.Y.dikey ? p.x < SV.Y.W * 0.5 && p.y > SV.Y.dunyaY + 720 - 40 : p.x < SV.Y.W * 0.45 && p.y > 140);
      this.input.on("pointerdown", (p) => {
        if (this.engel) return;
        if (p.wasTouch && !this.dokunmatik) { this.dokunmatik = true; this.kontrol.setVisible(true); }
        if (this.dokunmatik && p.wasTouch !== false) {
          const k = enYakin(p);
          if (k) { const b = this.dugmeler[k]; b.id = p.id; b.basili = true; b.taban.setScale(b.taban.scaleX * 0.92); b.taban.setAlpha(1); if (k === "ates") SV.dokunma.ates = true; else SV.dokunma[k] = true; return; }
          if (solYari(p) && this.joy.id === null) { this.joy.id = p.id; this.joy.x = p.x; this.joy.y = p.y; this.joyTaban.setPosition(p.x, p.y).setAlpha(0.85); this.joyTop.setPosition(p.x, p.y); return; }
          if (p.wasTouch) return;
        }
        // fare: ateş
        if (p.y < 80 && p.x > SV.Y.W - 90) return;
        SV.fare.ates = true; this.fareX(p);
      });
      this.input.on("pointermove", (p) => {
        if (this.joy.id === p.id) { const dx = p.x - this.joy.x, dy = p.y - this.joy.y, L = Math.hypot(dx, dy), m = Math.min(L, this.joy.r); this.joyTop.setPosition(this.joy.x + (dx / (L || 1)) * m, this.joy.y + (dy / (L || 1)) * m); SV.dokunma.x = Phaser.Math.Clamp(dx / (this.joy.r * 0.7), -1, 1); if (Math.abs(SV.dokunma.x) < 0.15) SV.dokunma.x = 0; if (dy < -this.joy.r * 0.75 && !this.joyZipla) { SV.dokunma.zipla = true; this.joyZipla = true; } if (dy > -this.joy.r * 0.4) this.joyZipla = false; }
        if (!p.wasTouch) this.fareX(p);
      });
      const birak = (p) => {
        if (this.joy.id === p.id) { this.joy.id = null; SV.dokunma.x = 0; this.joyZipla = false; this.joyTaban.setPosition(this.joy.x0, this.joy.y0).setAlpha(0.6); this.joyTop.setPosition(this.joy.x0, this.joy.y0); }
        for (const k in this.dugmeler) { const b = this.dugmeler[k]; if (b.id === p.id) { b.id = null; b.basili = false; b.taban.setDisplaySize(b.r * 2, b.r * 2).setAlpha(k === "ates" ? 0.95 : 0.8); if (k === "ates") SV.dokunma.ates = false; } }
        if (!p.wasTouch) SV.fare.ates = false;
      };
      this.input.on("pointerup", birak); this.input.on("pointerupoutside", birak);
      this.input.on("gameout", () => { SV.fare.ates = false; });
    }
    fareX(p) { const Y = SV.Y; SV.fare.dunyaX = (SV.fare.kamX || 0) + (p.x - Y.dunyaX); }

    /* ---------------- AFİŞLER ---------------- */
    afis(baslik, alt) {
      const Y = SV.Y, x = Y.W / 2, y = Y.dunyaY + 250;
      const k = this.add.container(x, y).setDepth(30);
      const g = this.add.graphics(); g.fillStyle(0x000000, 0.6); g.fillRect(-Y.W / 2, -46, Y.W, 92); g.fillStyle(RENK.vurgu, 1); g.fillRect(-Y.W / 2, -46, Y.W, 3); g.fillRect(-Y.W / 2, 43, Y.W, 3);
      k.add([g, SV.UI.yazi(this, 0, -12, baslik, 40, "#f2c14e", { harf: 3 }), SV.UI.yazi(this, 0, 26, alt || "", 18, "#efe9dc", { govde: true })]);
      k.setAlpha(0).setScale(1, 0.4);
      this.tweens.add({ targets: k, alpha: 1, scaleY: 1, duration: 220, ease: "Back.out", hold: 1600, yoyo: true, onComplete: () => k.destroy() });
    }
    gorevAfis(ad, gorev) { this.afis(ad.toUpperCase(), "Görev: " + gorev); }
    bossAfis(ad, unvan) {
      const Y = SV.Y, W = Y.W, k = this.add.container(0, 0).setDepth(31);
      const ust = this.add.rectangle(0, Y.dunyaY, W, 0, 0x000000).setOrigin(0, 0), alt = this.add.rectangle(0, Y.dunyaY + 720, W, 0, 0x000000).setOrigin(0, 1);
      const ad1 = SV.UI.yazi(this, W / 2, Y.dunyaY + 300, ad, 92, "#ff5a4a", { harf: 8, kontur: 8 }).setAlpha(0).setScale(1.4);
      const un = SV.UI.yazi(this, W / 2, Y.dunyaY + 372, unvan, 24, "#efe9dc", { govde: true }).setAlpha(0);
      k.add([ust, alt, ad1, un]);
      this.tweens.add({ targets: [ust, alt], height: 86, duration: 400 });
      this.tweens.add({ targets: ad1, alpha: 1, scale: 1, duration: 500, delay: 200, ease: "Back.out" });
      this.tweens.add({ targets: un, alpha: 1, duration: 500, delay: 500 });
      this.time.delayedCall(2600, () => this.tweens.add({ targets: k.list, alpha: 0, duration: 500, onComplete: () => k.destroy() }));
    }
    komboGoster(n, c) { this.tweens.add({ targets: this.komboYazi, scale: { from: 1.5, to: 1 }, duration: 220, ease: "Back.out" }); }

    /* ---------------- TELSİZ DİYALOĞU ---------------- */
    diyalog(dg) { this.diyalogKuyruk.push(dg); if (!this.diyalogAktif) this.siradakiDiyalog(); }
    siradakiDiyalog() {
      const dg = this.diyalogKuyruk.shift(); if (!dg) { this.diyalogAktif = null; return; }
      const Y = SV.Y, C = SV.karakter(dg.kim), dik = Y.dikey;
      const w = dik ? Y.W - 40 : Math.min(560, Y.W * 0.42), h = 96, x = dik ? 20 : 20, y = dik ? Y.dunyaY + 720 + 14 : 112;
      const k = this.add.container(x, y).setDepth(25);
      const g = this.add.graphics(); g.fillStyle(0x07090d, 0.82); g.fillRoundedRect(0, 0, w, h, 12); g.lineStyle(2, Phaser.Display.Color.HexStringToColor(C.renk).color, 0.6); g.strokeRoundedRect(0, 0, w, h, 12);
      k.add(g);
      let mx = 16;
      if (C.portre) { const p = this.add.image(14 + 34, h / 2, C.portre).setDisplaySize(68, 68); const m = this.add.graphics(); m.lineStyle(2, 0xffffff, 0.3); m.strokeRect(14, h / 2 - 34, 68, 68); k.add([p, m]); mx = 96; if (C.telsiz) { const tl = SV.UI.yazi(this, 48, h - 8, "TELSİZ", 11, "#7fd1c7"); k.add(tl); SV.Ses.cal("telsiz"); } }
      k.add(SV.UI.yazi(this, mx, 16, C.ad.toUpperCase(), 17, C.renk, { ox: 0, harf: 1 }));
      const metin = SV.UI.yazi(this, mx, 40, "", dik ? 21 : 19, "#efe9dc", { ox: 0, oy: 0, govde: true, sar: w - mx - 16 });
      k.add(metin);
      k.setAlpha(0); this.tweens.add({ targets: k, alpha: 1, x: { from: x - 20, to: x }, duration: 200 });
      let i = 0; const tam = dg.metin;
      const yaz = this.time.addEvent({ delay: 22, repeat: tam.length - 1, callback: () => metin.setText(tam.slice(0, ++i)) });
      this.diyalogAktif = k;
      this.time.delayedCall(Math.max(2600, tam.length * 55), () => { yaz.remove(); this.tweens.add({ targets: k, alpha: 0, duration: 250, onComplete: () => { k.destroy(); this.siradakiDiyalog(); } }); });
    }

    /* ---------------- İPUÇLARI ---------------- */
    klavyeIpucu() {
      const Y = SV.Y, k = this.add.container(Y.W / 2, Y.H - 120).setDepth(26);
      const g = this.add.graphics(); g.fillStyle(0x000000, 0.65); g.fillRoundedRect(-380, -34, 760, 68, 12);
      k.add([g, SV.UI.yazi(this, 0, 0, "A / D: yürü   ·   W / Boşluk: zıpla   ·   Sol tık / J: ateş   ·   R: şarjör   ·   Q / E: silah   ·   Esc: duraklat", 17, "#efe9dc", { govde: true })]);
      this.tweens.add({ targets: k, alpha: 0, delay: 7000, duration: 800, onComplete: () => k.destroy() });
    }
    dokunmaIpucu() {
      const Y = SV.Y, j = this.joy, a = this.dugmeler.ates;
      const t1 = SV.UI.yazi(this, j.x0, j.y0 - j.r - 30, "Sürükle: yürü", 18, "#f2c14e").setDepth(26), t2 = SV.UI.yazi(this, a.x, a.y - a.r - 26, "Basılı tut", 18, "#f2c14e").setDepth(26);
      this.tweens.add({ targets: [t1, t2], alpha: 0, delay: 6000, duration: 800, onComplete: () => { t1.destroy(); t2.destroy(); } });
    }

    /* ---------------- DURAKLAT / ÖLÜM ---------------- */
    katman(baslik, renk, dugmeler, alt) {
      if (this.ortu) this.ortu.destroy();
      const Y = SV.Y, W = Y.W, H = Y.H, k = this.add.container(0, 0).setDepth(50);
      k.add(this.add.rectangle(0, 0, W, H, 0x000000, 0.72).setOrigin(0, 0).setInteractive());
      const ph = 170 + dugmeler.length * 74 + (alt ? 40 : 0), pw = Math.min(520, W - 40);
      k.add(SV.UI.panel(this, W / 2, H / 2, pw, ph, { kenar: renk }));
      k.add(SV.UI.yazi(this, W / 2, H / 2 - ph / 2 + 56, baslik, 48, renk, { harf: 4 }));
      if (alt) k.add(SV.UI.yazi(this, W / 2, H / 2 - ph / 2 + 104, alt, 19, "#b9b2a2", { govde: true, sar: pw - 60, hiza: "center" }));
      dugmeler.forEach(([e, cb, o], i) => k.add(SV.UI.dugme(this, W / 2, H / 2 - ph / 2 + (alt ? 176 : 140) + i * 74, pw - 120, 58, e, cb, o || {})));
      k.setAlpha(0); this.tweens.add({ targets: k, alpha: 1, duration: 200 });
      this.ortu = k; this.engel = true; this.kontrolSifirla();
      return k;
    }
    katmanKapat() { if (this.ortu) { this.ortu.destroy(); this.ortu = null; } this.engel = false; }
    kontrolSifirla() { SV.dokunma.x = 0; SV.dokunma.ates = false; SV.fare.ates = false; this.joy.id = null; for (const k in this.dugmeler) this.dugmeler[k].id = null; }
    duraklatGoster() {
      const sesEt = () => (SV.Kayit.ayar.sesAcik ? "SES: AÇIK" : "SES: KAPALI");
      const k = this.katman("DURAKLATILDI", "#f2c14e", [
        ["DEVAM", () => { this.katmanKapat(); this.oyun.devam(); }, { birincil: true, ikon: "ikon_ok" }],
        ["BÖLGEYİ YENİDEN BAŞLAT", () => { this.katmanKapat(); this.oyun.devam(); this.oyun.yenidenDene(); }, { ikon: "ikon_tekrar" }],
        [sesEt(), () => { SV.Kayit.ayar.sesAcik = !SV.Kayit.ayar.sesAcik; SV.Kayit.kaydet(); SV.Ses.seviyeleriUygula(); this.duraklatGoster(); }, { ikon: SV.Kayit.ayar.sesAcik ? "ikon_ses" : "ikon_sessiz" }],
        ["ANA MENÜ", () => { this.katmanKapat(); this.oyun.scene.stop(); this.scene.start("Menu"); }, { ikon: "ikon_ev" }]
      ], this.oyun.B.ad + " · " + (this.oyun.aktifBolge ? this.oyun.aktifBolge.ad : "Yolda"));
    }
    olumEkrani(neden) {
      SV.Ses.muzikDurdur();
      this.katman("ÖLDÜN", "#e5484d", [
        ["KONTROL NOKTASINDAN DEVAM", () => { this.katmanKapat(); this.oyun.yenidenDene(); }, { birincil: true, ikon: "ikon_tekrar" }],
        ["ANA MENÜ", () => { this.katmanKapat(); this.oyun.scene.stop(); this.scene.start("Menu"); }, { ikon: "ikon_ev" }]
      ], neden + "  ·  Puan: " + (SV.D ? SV.D.skor.toLocaleString("tr-TR") : 0));
    }

    update() { this.guncelleGosterge(); }
  };
})();
