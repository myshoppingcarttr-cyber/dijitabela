/* HİKÂYE KARTLARI — sinematik şeritli, resimli (sahne + portre) ve atlanabilir diyalog kartları. Metinler veri/bolumler.json içinde. */
(function () {
  const SV = (window.SV = window.SV || {});

  SV.SahneHikaye = class extends Phaser.Scene {
    constructor() { super("Hikaye"); }
    init(d) { this.veri = d; this.i = d.i || 0; }
    create() {
      SV.aktifOyun = null;
      const d = this.veri, B = SV.bolumBul(d.bolumId);
      this.B = B; this.kartlar = (d.tur === "giris" ? B.giris_kartlari : B.cikis_kartlari) || [];
      if (!this.kartlar.length) return this.bitir();
      const Y = SV.Y, W = Y.W, H = Y.H;
      this.sahneAd = null; this.arka = []; this.kayma = 0; this.hedefKayma = 0;
      this.cameras.main.fadeIn(500, 0, 0, 0);
      const bar = Y.dikey ? Math.round(H * 0.12) : 64;
      this.ustBar = this.add.rectangle(0, 0, W, bar, 0x000000).setOrigin(0, 0).setDepth(60);
      this.altBar = this.add.rectangle(0, H, W, bar, 0x000000).setOrigin(0, 1).setDepth(60);
      this.baslik = SV.UI.yazi(this, 28, bar / 2, "BÖLÜM " + (SV.VERI.bolumler.bolumler.indexOf(B) + 1) + "  ·  " + B.ad.toUpperCase() + (d.tur === "cikis" ? "  ·  SONRASI" : ""), 20, "#f2c14e", { ox: 0, harf: 3 }).setDepth(61);
      this.altBaslik = SV.UI.yazi(this, 28, bar / 2 + 24, d.tur === "giris" ? B.alt_baslik : "", 15, "#9a9488", { ox: 0, govde: true }).setDepth(61);
      if (Y.dikey) { this.baslik.setY(bar / 2 - 10); this.altBaslik.setY(bar / 2 + 18); }
      const atla = SV.UI.dugme(this, W - 90, bar / 2, 130, 44, "ATLA  ⏭", () => this.bitir(), { boyut: 18 }).setDepth(62);
      // diyalog kutusu
      const kw = Math.min(1100, W - 40), kh = Y.dikey ? 300 : 178, kx = W / 2, ky = H - bar - kh / 2 - 14;
      this.kutu = this.add.container(kx, ky).setDepth(55);
      const g = this.add.graphics(); g.fillStyle(0x06080c, 0.86); g.fillRoundedRect(-kw / 2, -kh / 2, kw, kh, 14); g.lineStyle(2, 0xf2c14e, 0.35); g.strokeRoundedRect(-kw / 2, -kh / 2, kw, kh, 14);
      this.portreCerceve = this.add.graphics();
      this.portre = this.add.image(-kw / 2 + 20 + 70, Y.dikey ? -kh / 2 + 90 : 0, "portre_aras").setDisplaySize(140, 140);
      this.telsizEt = SV.UI.yazi(this, this.portre.x, this.portre.y + 84, "◉ TELSİZ", 13, "#7fd1c7");
      this.tarama = this.add.graphics();
      this.ad = SV.UI.yazi(this, 0, -kh / 2 + 30, "", 22, "#f2c14e", { ox: 0, harf: 2 });
      this.metin = SV.UI.yazi(this, 0, -kh / 2 + 58, "", Y.dikey ? 27 : 25, "#efe9dc", { ox: 0, oy: 0, govde: true, sar: kw - 220, satir: 6 });
      this.devamIpucu = SV.UI.yazi(this, kw / 2 - 24, kh / 2 - 22, "dokun / boşluk ▶", 14, "#9a9488", { ox: 1, govde: true });
      this.tweens.add({ targets: this.devamIpucu, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
      this.sayac = SV.UI.yazi(this, -kw / 2 + 24, kh / 2 - 22, "", 13, "#6f6a60", { ox: 0 });
      this.kutu.add([g, this.portreCerceve, this.portre, this.tarama, this.telsizEt, this.ad, this.metin, this.devamIpucu, this.sayac]);
      this.kw = kw; this.kh = kh;
      this.input.on("pointerdown", (p) => { if (p.y > this.ustBar.height + 4 || p.x < W - 170) this.ilerle(); });
      this.input.keyboard.on("keydown-SPACE", () => this.ilerle()); this.input.keyboard.on("keydown-ENTER", () => this.ilerle()); this.input.keyboard.on("keydown-ESC", () => this.bitir());
      SV.Ses.muzik(d.tur === "cikis" ? "zafer" : "menu");
      this.scale.on("resize", this.yeniden, this);
      this.events.once("shutdown", () => this.scale.off("resize", this.yeniden, this));
      this.goster();
    }
    yeniden() { this.scene.restart(Object.assign({}, this.veri, { i: this.i })); }

    arkaKur(sahne) {
      if (this.sahneAd === sahne) return;
      this.arka.forEach((o) => o.yokEt ? o.yokEt() : o.destroy()); this.arka = []; this.sahneAd = sahne;
      const Y = SV.Y, W = Y.W, H = Y.H;
      if (sahne === "siginak") {
        const s = Math.max(W / 1280, H / 720), im = this.add.image(W / 2, H / 2, "sahne_siginak").setScale(s * 1.08);
        this.tweens.add({ targets: im, scale: s * 1.16, duration: 14000 });
        this.arka.push(im); SV.Ses.ortam(null); return;
      }
      const tema = sahne === "liman" ? "safak" : "gece", zeminY = Y.dikey ? H * 0.58 : 610, oy = zeminY - 600;
      const kat = SV.Dunya.katmanlar(this, tema, W, H, oy), atm = SV.Dunya.atmosfer(this, tema, W, H, oy);
      this.arka.push(kat, atm); this.kat = kat; this.atm = atm;
      const ADD = Phaser.BlendModes.ADD;
      if (tema === "gece") {
        const K = SV.KARE.kahraman, x = W * 0.3;
        const l = this.add.image(x + 60, zeminY - 18, "d_lamba").setOrigin(0.18, 1).setDepth(-40), li = this.add.image(x + 110, zeminY - 420, "lambaKoni").setOrigin(0.5, 0).setBlendMode(ADD).setTint(0xffb35c).setAlpha(0.15).setDepth(-31);
        const amb = this.add.image(W * 0.72, zeminY - 6, "d_ambulans").setOrigin(0.5, 1).setDepth(-12).setTint(0x9aa4bd);
        const k = this.add.sprite(x, zeminY, "kahraman").setOrigin(K.ox / K.w, K.oy / K.h).setDepth(10).setTint(0xb9c3d9).play("kahraman_tabanca_dur").setScale(1.25);
        const r1 = this.add.image(W * 0.72 - 120, zeminY - 170, "isik").setBlendMode(ADD).setTint(0xff3a2a).setDepth(-11).setAlpha(0.6), r2 = this.add.image(W * 0.72 - 80, zeminY - 170, "isik").setBlendMode(ADD).setTint(0x3a6bff).setDepth(-11).setAlpha(0);
        this.tweens.add({ targets: r1, alpha: 0, duration: 300, yoyo: true, repeat: -1 }); this.tweens.add({ targets: r2, alpha: 0.6, duration: 300, yoyo: true, repeat: -1 });
        this.arka.push(l, li, amb, k, r1, r2); SV.Ses.ortam("yagmur");
      } else {
        const t = this.add.image(W * 0.62, zeminY + 6, "d_tekne").setOrigin(0.5, 1).setDepth(-44).setScale(Y.dikey ? 0.8 : 1);
        this.tweens.add({ targets: t, y: t.y + 5, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        const K = SV.KARE.kahraman, k = this.add.sprite(W * 0.2, zeminY, "kahraman").setOrigin(K.ox / K.w, K.oy / K.h).setDepth(10).setTint(0xffe6da).play("kahraman_pompali_dur").setScale(1.2);
        this.arka.push(t, k); SV.Ses.ortam("deniz");
      }
    }
    goster() {
      const kart = this.kartlar[this.i], C = SV.karakter(kart.kim);
      this.arkaKur(kart.sahne);
      this.hedefKayma = (kart.kamera || 0) * 2400;
      const kw = this.kw, kh = this.kh, portreVar = !!C.portre;
      this.portre.setVisible(portreVar); this.portreCerceve.clear(); this.tarama.clear(); this.telsizEt.setVisible(portreVar && C.telsiz);
      const mx = portreVar ? -kw / 2 + 180 : -kw / 2 + 36;
      if (portreVar) {
        this.portre.setTexture(C.portre).setDisplaySize(140, 140);
        this.portreCerceve.lineStyle(3, Phaser.Display.Color.HexStringToColor(C.renk).color, 0.8).strokeRect(this.portre.x - 72, this.portre.y - 72, 144, 144);
        if (C.telsiz) { this.tarama.fillStyle(0x7fd1c7, 0.1); for (let y = -70; y < 70; y += 4) this.tarama.fillRect(this.portre.x - 70, this.portre.y + y, 140, 1.5); SV.Ses.cal("telsiz"); }
        this.portre.setAlpha(0); this.tweens.add({ targets: this.portre, alpha: 1, duration: 250 });
      }
      this.ad.setPosition(mx, -kh / 2 + 30).setText(C.ad ? C.ad.toUpperCase() : "").setColor(C.renk);
      this.metin.setPosition(mx, C.ad ? -kh / 2 + 58 : -kh / 2 + 34).setWordWrapWidth(kw / 2 - 24 - mx, true).setFontStyle(C.ad ? "500" : "italic 500");
      this.sayac.setText(this.i + 1 + " / " + this.kartlar.length);
      this.tam = kart.metin; this.harf = 0; this.yaziyor = true;
      if (this.yazOlay) this.yazOlay.remove();
      this.yazOlay = this.time.addEvent({ delay: 24, repeat: this.tam.length - 1, callback: () => { this.harf++; this.metin.setText(this.tam.slice(0, this.harf)); if (this.harf % 3 === 0 && C.ad) SV.Ses.cal("tiklama", { v: 0.15 }); if (this.harf >= this.tam.length) this.yaziyor = false; } });
      this.kutu.setAlpha(0.0); this.tweens.add({ targets: this.kutu, alpha: 1, duration: 220 });
    }
    ilerle() {
      if (this.bitiyor) return;
      if (this.yaziyor) { this.yazOlay.remove(); this.metin.setText(this.tam); this.yaziyor = false; return; }
      SV.Ses.cal("tiklama", { v: 0.6 });
      this.i++;
      if (this.i >= this.kartlar.length) return this.bitir();
      this.goster();
    }
    bitir() {
      if (this.bitiyor) return; this.bitiyor = true;
      const s = this.veri.sonra || { sahne: "Menu" };
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(420, () => this.scene.start(s.sahne, s.veri || {}));
    }
    update(t, dt) {
      this.kayma += (this.hedefKayma - this.kayma) * Math.min(1, dt / 900) + dt * 0.01;
      if (this.kat && this.kat.gok && this.kat.gok.active) { this.kat.guncelle(this.kayma, t); this.atm.guncelle(this.kayma, t); }
    }
  };
})();
