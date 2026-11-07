/* ANA MENÜ: canlı arka plan (yağmurlu gece sokağı), logo, Oyna / Bölümler / Ayarlar / Nasıl Oynanır */
(function () {
  const SV = (window.SV = window.SV || {});

  SV.akis = {
    bolumBaslat(sc, id, hikaye = true) {
      SV.Ses.cal("onay");
      sc.cameras.main.fadeOut(350, 0, 0, 0);
      sc.time.delayedCall(360, () => {
        if (hikaye) sc.scene.start("Hikaye", { bolumId: id, tur: "giris", sonra: { sahne: "Oyun", veri: { bolumId: id } } });
        else sc.scene.start("Oyun", { bolumId: id });
      });
    }
  };

  SV.SahneMenu = class extends Phaser.Scene {
    constructor() { super("Menu"); }
    init(d) { this.veri = d || {}; }
    create() {
      SV.aktifOyun = null;
      const Y = SV.Y, W = Y.W, H = Y.H, dik = Y.dikey;
      this.cameras.main.fadeIn(500, 0, 0, 0);
      const zeminY = dik ? Math.round(H * 0.5) : 600, oy = zeminY - 600;
      this.oy = oy; this.zeminY = zeminY;
      this.kat = SV.Dunya.katmanlar(this, "gece", W, H, oy);
      this.atm = SV.Dunya.atmosfer(this, "gece", W, H, oy);
      // sahne: lamba, kahraman, uzaktaki zombiler
      const T = SV.CONFIG.temalar.gece, ADD = Phaser.BlendModes.ADD;
      const kx = dik ? 210 : Math.round(W * 0.2);
      this.add.image(kx + 40, zeminY - 18, "d_lamba").setOrigin(0.18, 1).setScrollFactor(0).setDepth(-40);
      this.add.image(kx + 90, zeminY - 420, "lambaKoni").setOrigin(0.5, 0).setBlendMode(ADD).setTint(T.isikRengi).setAlpha(0.16).setScrollFactor(0).setDepth(-31);
      this.add.image(kx + 90, zeminY - 18, "isik").setBlendMode(ADD).setTint(T.isikRengi).setScale(2.4, 0.4).setAlpha(0.4).setScrollFactor(0).setDepth(-19);
      this.lambaParla = this.add.image(kx + 90, zeminY - 420, "isik").setBlendMode(ADD).setTint(T.isikRengi).setScale(0.9).setAlpha(0.9).setScrollFactor(0).setDepth(-29);
      const K = SV.KARE.kahraman;
      this.add.image(kx, zeminY + 4, "golge").setScale(1.1, 1).setScrollFactor(0).setDepth(4);
      this.kahraman = this.add.sprite(kx, zeminY, "kahraman").setOrigin(K.ox / K.w, K.oy / K.h).setScrollFactor(0).setDepth(10).setTint(0xc9cfdf).play("kahraman_pompali_dur");
      this.fener = this.add.image(kx + 60, zeminY - 104, "koni").setOrigin(0, 0.5).setBlendMode(ADD).setAlpha(0.13).setScale(1.3, 0.9).setScrollFactor(0).setDepth(9);
      this.zombiler = [];
      this.time.addEvent({ delay: 2600, loop: true, callback: () => this.zombiGetir() });
      this.zombiGetir(); this.time.delayedCall(1200, () => this.zombiGetir());
      this.kayma = 0;

      // logo
      const lw = dik ? 660 : Math.min(820, W * 0.56);
      this.logo = this.add.image(W / 2, dik ? Math.max(150, H * 0.13) : 128, "logo").setDisplaySize(lw, lw * 0.2727).setDepth(50);
      this.tweens.add({ targets: this.logo, scaleX: this.logo.scaleX * 1.015, scaleY: this.logo.scaleY * 1.015, duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });

      // düğmeler
      const bx = dik ? W / 2 : W / 2, by0 = dik ? zeminY + 190 : 300, bw = dik ? 460 : 320, bh = dik ? 74 : 60, ara = dik ? 92 : 72;
      const devamId = this.devamBolumu();
      const D = [
        ["OYNA", () => SV.akis.bolumBaslat(this, devamId), { birincil: true, ikon: "ikon_ok" }],
        ["BÖLÜMLER", () => this.bolumlerAc(), {}],
        ["AYARLAR", () => this.ayarlarAc(), {}],
        ["NASIL OYNANIR", () => this.nasilAc(), {}]
      ];
      this.dugmeler = D.map(([e, cb, o], i) => { const d = SV.UI.dugme(this, bx, by0 + i * ara, bw, bh, e, cb, o).setDepth(50); d.setAlpha(0); this.tweens.add({ targets: d, alpha: 1, y: { from: d.y + 20, to: d.y }, delay: 250 + i * 90, duration: 420, ease: "Cubic.out" }); return d; });
      if (devamId !== "b1") this.dugmeler[0].etiket("DEVAM ET · " + SV.bolumBul(devamId).ad.toLocaleUpperCase("tr-TR"));

      this.sesDugme = SV.UI.ikonDugme(this, W - 44, 44, 26, SV.Kayit.ayar.sesAcik ? "ikon_ses" : "ikon_sessiz", () => {
        SV.Kayit.ayar.sesAcik = !SV.Kayit.ayar.sesAcik; SV.Kayit.kaydet(); SV.Ses.seviyeleriUygula();
        this.sesDugme.ikon.setTexture(SV.Kayit.ayar.sesAcik ? "ikon_ses" : "ikon_sessiz");
      }).setDepth(60);
      SV.UI.yazi(this, 16, H - 22, "v" + SV.CONFIG.surum + " · dikey dilim prototipi", 14, "#6f6a60", { ox: 0, kalin: false }).setDepth(60);
      SV.UI.yazi(this, W - 16, H - 22, "2 BÖLÜM · 3 SİLAH · 2 BOSS", 14, "#6f6a60", { ox: 1, kalin: false }).setDepth(60);
      if (dik) {
        const ip = SV.UI.yazi(this, W / 2, zeminY + 120, "⟳  Daha iyi deneyim için telefonu yatay çevirin", 20, "#c9c2b0", { govde: true }).setDepth(50);
        this.tweens.add({ targets: ip, alpha: 0.45, duration: 1200, yoyo: true, repeat: -1 });
      }

      SV.Ses.muzik("menu"); SV.Ses.ortam("yagmur");
      SV.Ses.onGokGurultu = () => this.simsek && this.simsek();
      const flas = this.add.rectangle(0, 0, W, H, 0xdfe6ff, 0).setOrigin(0, 0).setDepth(45);
      this.simsek = () => { flas.setAlpha(0.35); this.tweens.add({ targets: flas, alpha: 0, duration: 420 }); };

      this.scale.on("resize", this.yenidenKur, this);
      this.events.once("shutdown", () => this.scale.off("resize", this.yenidenKur, this));
      if (this.veri.tebrikler) this.time.delayedCall(400, () => this.tebriklerAc());
      if (this.veri.sanat) this.sanatGoster();
      this.input.keyboard.on("keydown-ENTER", () => !this.panel && SV.akis.bolumBaslat(this, devamId));
    }
    yenidenKur() { this.scene.restart(this.veri); }
    devamBolumu() {
      const k = SV.Kayit.veri, L = SV.VERI.bolumler.bolumler;
      for (let i = L.length - 1; i >= 0; i--) if (k.acik.includes(L[i].id) && !(k.yildiz[L[i].id] > 0)) return L[i].id;
      return L[0].id;
    }
    zombiGetir() {
      if (this.zombiler.length > 4) return;
      const turler = ["aylak", "aylak2", "kosucu", "aylak"], tur = turler[(Math.random() * turler.length) | 0], K = SV.KARE[tur];
      const s = 0.62 + Math.random() * 0.12, y = this.zeminY - 34 + Math.random() * 8;
      const z = this.add.sprite(SV.Y.W + 80, y, tur).setOrigin(K.ox / K.w, K.oy / K.h).setScale(s).setFlipX(true).setScrollFactor(0).setDepth(-17).setTint(0x4a5068).setAlpha(0.95);
      z.setOrigin(1 - K.ox / K.w, K.oy / K.h).play(tur + "_yuru");
      z.hiz = tur === "kosucu" ? 0 : 22 + Math.random() * 14;
      if (tur === "kosucu") { z.play("kosucu_yuru"); z.anims.timeScale = 0.25; z.hiz = 34; }
      this.zombiler.push(z);
    }
    update(t, dt) {
      this.kayma += dt * 0.012;
      this.kat.guncelle(this.kayma, t); this.atm.guncelle(this.kayma, t);
      const sinir = SV.Y.dikey ? 260 : SV.Y.W * 0.33;
      this.zombiler = this.zombiler.filter((z) => { z.x -= (z.hiz * dt) / 1000; if (z.x < sinir) { z.alpha -= dt / 1500; if (z.alpha <= 0) { z.destroy(); return false; } } return true; });
      this.lambaParla.setAlpha(Math.random() < 0.02 ? 0.3 : 0.9);
      if (Math.random() < 0.004) SV.Ses.cal("inilti", { v: 0.35 });
    }

    /* ---------- paneller ---------- */
    panelAc(w, h, baslik) {
      this.panelKapat();
      const W = SV.Y.W, H = SV.Y.H, kap = this.add.container(0, 0).setDepth(100);
      const ort = this.add.rectangle(0, 0, W, H, 0x000000, 0.72).setOrigin(0, 0).setInteractive();
      kap.add(ort);
      kap.add(SV.UI.panel(this, W / 2, H / 2, w, h));
      kap.add(SV.UI.yazi(this, W / 2, H / 2 - h / 2 + 40, baslik, 34, "#f2c14e", { harf: 2 }));
      kap.add(SV.UI.ikonDugme(this, W / 2 + w / 2 - 34, H / 2 - h / 2 + 36, 22, "ikon_geri", () => this.panelKapat()));
      kap.setAlpha(0); this.tweens.add({ targets: kap, alpha: 1, duration: 200 });
      this.panel = kap; this.dugmeler.forEach((d) => d.alan.disableInteractive());
      return kap;
    }
    panelKapat() { if (this.panel) { this.panel.destroy(); this.panel = null; this.dugmeler.forEach((d) => d.alan.setInteractive({ useHandCursor: true })); } }

    bolumlerAc() {
      const W = SV.Y.W, H = SV.Y.H, dik = SV.Y.dikey, L = SV.VERI.bolumler.bolumler;
      const pw = dik ? 640 : Math.min(980, W - 80), ph = dik ? 900 : 520, kap = this.panelAc(pw, ph, "BÖLÜMLER");
      L.forEach((b, i) => {
        const cw = dik ? pw - 60 : (pw - 90) / 2, ch = dik ? 360 : 380;
        const cx = dik ? W / 2 : W / 2 + (i - 0.5) * (cw + 30), cy = dik ? H / 2 - ph / 2 + 110 + ch / 2 + i * (ch + 24) : H / 2 + 30;
        const acik = SV.Kayit.bolumAcikMi(b.id), yildiz = SV.Kayit.veri.yildiz[b.id] || 0, enIyi = SV.Kayit.veri.enIyi[b.id] || 0;
        const px = cx - cw / 2 + 8, py = cy - ch / 2 + 8, pw2 = cw - 16, ph2 = 164;
        const gok = this.add.image(px + pw2 / 2, py + ph2 + 40, b.tema + "_gok").setOrigin(0.5, 0.86).setScale(Math.max(pw2 / 1024, 0.55));
        const orta = this.add.image(px + pw2 / 2 + 300, py + ph2 + 6, b.tema + "_orta").setOrigin(0.5, 1).setScale(0.42).setAlpha(0.9);
        const kat = this.add.image(px + pw2 / 2 - 200 * i, py + ph2 + 22, b.tema + "_yakin").setOrigin(0.5, 1).setScale(0.46);
        const g = this.add.graphics(); g.lineStyle(2, 0xefe9dc, 0.18); g.strokeRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 12);
        g.fillStyle(0x000000, 0.25); g.fillRect(px, py + ph2 - 50, pw2, 50);
        const maske = this.make.graphics(); maske.fillStyle(0xffffff); maske.fillRect(px, py, pw2, ph2); const m = maske.createGeometryMask(); [gok, orta, kat].forEach((o) => o.setMask(m));
        kap.add([gok, orta, kat, g]); kap.once("destroy", () => maske.destroy());
        kap.add(SV.UI.yazi(this, cx - cw / 2 + 22, cy - ch / 2 + 140, "BÖLÜM " + (i + 1), 18, "#f2c14e", { ox: 0 }));
        kap.add(SV.UI.yazi(this, cx - cw / 2 + 20, cy - ch / 2 + 205, b.ad.toLocaleUpperCase("tr-TR"), 34, "#efe9dc", { ox: 0 }));
        kap.add(SV.UI.yazi(this, cx - cw / 2 + 20, cy - ch / 2 + 240, b.alt_baslik, 18, "#9a9488", { ox: 0, govde: true }));
        for (let s = 0; s < 3; s++) kap.add(this.add.image(cx + cw / 2 - 40 - (2 - s) * 40, cy - ch / 2 + 208, s < yildiz ? "yildiz_dolu" : "yildiz_bos").setScale(0.5));
        kap.add(SV.UI.yazi(this, cx + cw / 2 - 20, cy - ch / 2 + 240, enIyi ? "EN İYİ " + enIyi.toLocaleString("tr-TR") : "", 16, "#9a9488", { ox: 1 }));
        if (acik) kap.add(SV.UI.dugme(this, cx, cy + ch / 2 - 48, cw - 60, 56, yildiz ? "TEKRAR OYNA" : "OYNA", () => SV.akis.bolumBaslat(this, b.id), { birincil: true, ikon: "ikon_ok" }));
        else { kap.add(this.add.rectangle(cx, cy, cw, ch, 0x000000, 0.55)); kap.add(this.add.image(cx, cy - 20, "ikon_kilit").setScale(1.1)); kap.add(SV.UI.yazi(this, cx, cy + ch / 2 - 48, "Önce Bölüm " + i + "'i bitir", 22, "#9a9488")); }
      });
    }

    ayarlarAc() {
      const W = SV.Y.W, H = SV.Y.H, A = SV.Kayit.ayar, pw = Math.min(620, W - 60), ph = 640, kap = this.panelAc(pw, ph, "AYARLAR");
      const x = W / 2, y0 = H / 2 - ph / 2 + 120, iw = pw - 90, kaydet = () => { SV.Kayit.kaydet(); SV.Ses.seviyeleriUygula(); };
      kap.add(SV.UI.kaydirici(this, x, y0, iw, "MÜZİK", A.muzik, (v) => { A.muzik = v; kaydet(); }));
      kap.add(SV.UI.kaydirici(this, x, y0 + 74, iw, "EFEKTLER", A.efekt, (v) => { A.efekt = v; kaydet(); SV.Ses.cal("tabanca", { v: 0.5 }); }));
      const Z = SV.VERI.denge.zorluk;
      kap.add(SV.UI.secici(this, x, y0 + 160, iw, "ZORLUK", Object.keys(Z).map((k) => ({ ad: Z[k].ad, deger: k })), A.zorluk, (v) => { A.zorluk = v; kaydet(); }));
      kap.add(SV.UI.secici(this, x, y0 + 220, iw, "KAN EFEKTİ", [{ ad: "Yoğun", deger: "yogun" }, { ad: "Az", deger: "az" }], A.kan, (v) => { A.kan = v; kaydet(); }));
      kap.add(SV.UI.secici(this, x, y0 + 280, iw, "GRAFİK", [{ ad: "Yüksek", deger: "yuksek" }, { ad: "Düşük", deger: "dusuk" }], A.grafik, (v) => { A.grafik = v; SV.CONFIG.grafik = v; kaydet(); }));
      kap.add(SV.UI.secici(this, x, y0 + 340, iw, "TİTREŞİM", [{ ad: "Açık", deger: true }, { ad: "Kapalı", deger: false }], A.titresim, (v) => { A.titresim = v; kaydet(); }));
      const sif = SV.UI.dugme(this, x, y0 + 430, 300, 50, "İLERLEMEYİ SIFIRLA", () => { if (sif._onay) { SV.Kayit.sifirla(); this.scene.restart(); } else { sif._onay = true; sif.etiket("EMİN MİSİN? TEKRAR BAS"); } }, { boyut: 18 });
      kap.add(sif);
    }

    nasilAc() {
      const W = SV.Y.W, H = SV.Y.H, dik = SV.Y.dikey, pw = dik ? 660 : Math.min(980, W - 60), ph = dik ? 980 : 560, kap = this.panelAc(pw, ph, "NASIL OYNANIR");
      const sutun = (x, y, baslik, satirlar) => {
        kap.add(SV.UI.yazi(this, x, y, baslik, 22, "#f2c14e", { ox: 0 }));
        satirlar.forEach(([a, b], i) => { kap.add(SV.UI.yazi(this, x, y + 42 + i * 36, a, 19, "#efe9dc", { ox: 0 })); kap.add(SV.UI.yazi(this, x + 170, y + 42 + i * 36, b, 19, "#b9b2a2", { ox: 0, govde: true })); });
      };
      const sol = dik ? W / 2 - pw / 2 + 40 : W / 2 - pw / 2 + 40, sag = dik ? sol : W / 2 + 20, ust = H / 2 - ph / 2 + 100;
      sutun(sol, ust, "TELEFON", [["Sol başparmak", "Joystick: yürü / koş"], ["ATEŞ", "Basılı tut, sürekli ateş"], ["ZIPLA", "Şok dalgası, hücum"], ["ŞARJÖR", "Elle doldur"], ["SİLAH", "Sıradaki silah"]]);
      sutun(sag, dik ? ust + 250 : ust, "KLAVYE + FARE", [["A / D  ← →", "Hareket"], ["W ↑  Boşluk", "Zıpla"], ["Sol tık / J", "Ateş (fareye nişan)"], ["R", "Şarjör"], ["Q E  1 2 3", "Silah · Esc duraklat"]]);
      const ipY = dik ? ust + 520 : ust + 270;
      ["• 2,6 saniye içinde art arda öldürmek KOMBO çarpanını büyütür (en çok x4).", "• Kafa isabetleri ek puan getirir. Pompalı yakında yıkıcıdır, tüfek delip geçer.", "• Hantal'lar yavaş ama sert vurur; mesafeni koru. Bosslar öfkelenince yardım çağırır."].forEach((s, i) => kap.add(SV.UI.yazi(this, sol, ipY + i * 40, s, 18, "#b9b2a2", { ox: 0, govde: true, sar: pw - 80 })));
    }

    tebriklerAc() {
      const W = SV.Y.W, H = SV.Y.H, pw = Math.min(720, W - 60), ph = 520, kap = this.panelAc(pw, ph, "TEBRİKLER");
      SV.Ses.muzik("zafer");
      const toplam = SV.VERI.bolumler.bolumler.reduce((a, b) => a + (SV.Kayit.veri.yildiz[b.id] || 0), 0);
      kap.add(SV.UI.yazi(this, W / 2, H / 2 - 120, "Son vardiya tamamlandı.", 30, "#efe9dc"));
      kap.add(SV.UI.yazi(this, W / 2, H / 2 - 60, "Otuz iki kişi Umut'la açık denize çıktı.\nToplam yıldız: " + toplam + " / 6", 22, "#b9b2a2", { hiza: "center", govde: true }));
      kap.add(SV.UI.yazi(this, W / 2, H / 2 + 40, "Bu bir dikey dilim prototipidir: iki bölüm, üç silah, iki boss.\nTüm değerler ve metinler veri dosyalarından düzenlenebilir.", 18, "#8a8478", { hiza: "center", govde: true, sar: pw - 80 }));
      kap.add(SV.UI.dugme(this, W / 2, H / 2 + 170, 300, 58, "ANA MENÜ", () => { this.panelKapat(); SV.Ses.muzik("menu"); }, { birincil: true }));
    }

    /* Geliştirici: tüm sprite sheet'leri göster (?sahne=sanat) */
    sanatGoster() {
      const W = SV.Y.W, H = SV.Y.H, kap = this.add.container(0, 0).setDepth(200);
      kap.add(this.add.rectangle(0, 0, W, H, 0x223, 1).setOrigin(0, 0));
      const liste = [["kahraman", "kahraman_tabanca_kos"], ["kahraman", "kahraman_pompali_doldur"], ["kahraman", "kahraman_tufek_dur"], ["kahraman", "kahraman_olum"], ["aylak", "aylak_yuru"], ["aylak2", "aylak2_saldiri"], ["kosucu", "kosucu_yuru"], ["hantal", "hantal_yuru"], ["kasap", "kasap_vurus"], ["dev", "dev_firlat"], ["aylak", "aylak_olum"], ["kasap", "kasap_hucum"]];
      liste.forEach(([t, a], i) => { const K = SV.KARE[t], x = 120 + (i % 6) * ((W - 160) / 6), y = 300 + Math.floor(i / 6) * 330; kap.add(this.add.sprite(x, y, t).setOrigin(K.ox / K.w, K.oy / K.h).play(a).setScale(t === "kasap" || t === "dev" ? 0.8 : 1)); kap.add(this.add.line(0, 0, x - 80, y, x + 80, y, 0x88ff88).setOrigin(0, 0)); });
    }
  };
})();
