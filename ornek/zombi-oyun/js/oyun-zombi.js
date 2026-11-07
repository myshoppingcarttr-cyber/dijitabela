/* ZOMBİLER ve BOSSLAR — Aylak (yavaş), Koşucu (hızlı + atılma), Hantal (iri tank), Kasap (hücum + satır), Liman Devi (şok dalgası + varil). */
(function () {
  const SV = (window.SV = window.SV || {});
  const R = (a, b) => a + Math.random() * (b - a);

  SV.Zombi = class {
    constructor(sc, tur, x, ops = {}) {
      this.sc = sc; this.tur = tur; this.Z = SV.CONFIG.ekran.zeminY;
      const zor = sc.zorluk, boss = ops.boss;
      this.boss = !!boss;
      const def = boss ? boss : SV.VERI.denge.zombiler[tur];
      this.def = def;
      this.doku = boss ? boss.tur : tur === "aylak" && Math.random() < 0.45 ? "aylak2" : tur;
      const K = SV.KARE[this.doku]; this.K = K;
      this.hpMax = Math.round(def.can * zor.zombi_can * (boss ? 1 : 1)); this.hp = this.hpMax;
      this.hiz = (Array.isArray(def.hiz) ? R(def.hiz[0], def.hiz[1]) : def.hiz) * zor.zombi_hiz;
      this.hasar = def.hasar * zor.zombi_hasar;
      this.serit = boss ? 0 : Math.round(R(-8, 12));
      this.x = x; this.y = this.Z + this.serit; this.vx = 0; this.yon = -1; this.durum = "yuru"; this.t = 0; this.saldiriBekle = R(0.2, 0.8);
      this.genislik = boss ? 84 : def.isabet_genislik; this.boy = boss ? 262 : def.isabet_yukseklik;
      this.atilmaBekle = R(0.5, 1.5); this.ozelBekle = boss ? 3 : 0; this.firlatBekle = boss ? 2.5 : 0; this.ofkeli = false;
      this.golge = sc.add.image(x, this.Z + 4 + this.serit, "golge").setDepth(5).setScale((K.w / 200) * 1.15, 1);
      this.spr = sc.add.sprite(x, this.y, this.doku).setDepth(10 + (this.serit + 10) / 100 + (boss ? 0.2 : 0));
      this.spr.setTint(sc.tema.karakterRengi);
      this.yonAyarla(-1);
      this.oynat("yuru");
      if (boss) { this.durum = "giris"; this.dokunulmaz = true; }
      if (Math.random() < 0.35 && !boss) SV.Ses.cal(tur === "kosucu" ? "ciglik" : "inilti", { v: 0.5 });
      this.inleme = R(3, 9);
    }
    yonAyarla(y) { this.yon = y; this.spr.setFlipX(y < 0); this.spr.setOrigin(y > 0 ? this.K.ox / this.K.w : 1 - this.K.ox / this.K.w, this.K.oy / this.K.h); }
    oynat(ad, zorla) { const k = this.doku + "_" + ad; if (!zorla && this.spr.anims.currentAnim && this.spr.anims.currentAnim.key === k && this.spr.anims.isPlaying) return; this.spr.play(k, true); }
    get yasiyor() { return this.durum !== "olum" && this.durum !== "ceset"; }
    get ust() { return this.y - (this.durum === "hucum" ? 150 : this.boy); }

    hasarAl(m, yon, kafa, itme) {
      if (!this.yasiyor) return false;
      if (this.dokunulmaz) { this.sc.efekt.kan(this.x - yon * 20, this.y - this.boy * 0.6, yon, 1); return false; }
      if (this.durum === "sersem") m *= 1.5;
      this.hp -= m;
      this.spr.setTintFill(0xffffff); this.sc.time.delayedCall(45, () => this.spr && this.spr.active && this.spr.setTint(this.ofkeli ? 0xff9a8a : this.sc.tema.karakterRengi));
      const direnc = this.def.geri_itme_direnci ?? (this.boss ? 0.95 : 0);
      this.vx += yon * itme * (1 - direnc);
      this.sc.efekt.kan(this.x - yon * this.genislik * 0.3, kafa ? this.ust + 18 : this.y - this.boy * (0.45 + Math.random() * 0.3), yon, kafa ? 10 : 5, kafa ? 1.2 : 0.9);
      if (this.hp <= 0) { this.ol(yon, kafa); return true; }
      if (!this.boss && m >= this.def.sersemleme_esigi && this.durum !== "saldiri" && this.durum !== "atilma") { this.durum = "hasar"; this.t = 0; this.oynat("hasar", true); }
      if (this.boss && !this.ofkeli && this.hp / this.hpMax <= this.def.ofke_esigi) this.ofkelen();
      return false;
    }
    ol(yon, kafa) {
      this.durum = "olum"; this.t = 0; this.vx = yon * (this.boss ? 60 : 220);
      if (this.yon !== -yon) this.yonAyarla(-yon);
      this.oynat("olum", true);
      this.spr.setDepth(8 + (this.serit + 10) / 1000);
      SV.Ses.cal("zombiOlum", { v: this.boss ? 1.4 : 0.8 });
      this.sc.efekt.kan(this.x, this.y - this.boy * 0.6, yon, this.boss ? 40 : 14, 1.3);
      this.sc.efekt.leke(this.x + yon * 40, this.boss ? 2 : 1);
      this.sc.zombiOldu(this, kafa);
    }
    ofkelen() {
      this.ofkeli = true; this.hiz *= this.def.ofke_hiz_carpani; this.spr.setTint(0xff9a8a);
      this.durum = "kukre"; this.t = 0; this.oynat("kukre", true); SV.Ses.cal("kukreme", { v: 1.2 }); this.sc.cameras.main.shake(600, 0.008);
      const c = this.def.ofke_cagri; if (c) this.sc.time.delayedCall(500, () => this.sc.zombiCagir(c.tur, c.adet));
      this.sc.diyalogGoster && this.sc.diyalogGoster({ kim: "selin", metin: "Öfkelendi! Yardım çağırıyor, dikkat!" });
    }

    guncelle(dt) {
      const sc = this.sc, H = sc.kahraman, Z = this.Z;
      this.t += dt;
      this.x += this.vx * dt; this.vx *= Math.pow(0.004, dt);
      if (this.durum === "ceset") return this.cizimGuncelle();
      if (this.durum === "olum") { if (this.t > 7) { this.spr.setAlpha(Math.max(0, 1 - (this.t - 7))); this.golge.setAlpha(this.spr.alpha); if (this.t > 8) this.yokEt(); } return this.cizimGuncelle(); }
      // hedef: kahraman ya da (savunmada) kapı
      let hedefX = H.x, kapiyaMi = false;
      const kapi = sc.kapiHedef;
      if (kapi && kapi.aktif && !this.boss && Math.abs(H.x - this.x) > 260 && this.x < kapi.x) { hedefX = kapi.x - 40; kapiyaMi = true; }
      if (H.olu && !kapiyaMi) hedefX = this.x + this.yon * 30;
      const fark = hedefX - this.x, mesafe = Math.abs(fark), yonH = Math.sign(fark) || this.yon;
      if (this.inleme -= dt, this.inleme <= 0) { this.inleme = R(4, 10); if (mesafe < 900) SV.Ses.cal(this.tur === "kosucu" ? "ciglik" : "inilti", { v: this.boss ? 0.9 : 0.4, perde: this.boss ? 0.6 : this.tur === "hantal" ? 0.75 : 1 }); }
      if (this.boss) return this.bossGuncelle(dt, H, fark, mesafe, yonH);
      const menzil = this.def.menzil;
      switch (this.durum) {
        case "yuru": {
          if (yonH !== this.yon) this.yonAyarla(yonH);
          this.saldiriBekle -= dt; this.atilmaBekle -= dt;
          if (mesafe > menzil * 0.8) { this.x += this.yon * this.hiz * dt; this.oynat("yuru"); this.spr.anims.timeScale = this.tur === "kosucu" ? 1 : this.hiz / 55; }
          else this.spr.anims.timeScale = 0.4;
          if (this.tur === "kosucu" && !kapiyaMi && mesafe < this.def.atilma_mesafe && mesafe > menzil && this.atilmaBekle <= 0 && !H.olu) { this.durum = "atilma"; this.t = 0; this.vy = -420; this.yy = 0; this.oynat("saldiri", true); SV.Ses.cal("ciglik", { v: 0.7 }); }
          else if (mesafe <= menzil && this.saldiriBekle <= 0 && (kapiyaMi || !H.olu)) { this.durum = "saldiri"; this.t = 0; this.vurdu = false; this.oynat("saldiri", true); this.spr.anims.timeScale = 1; this.kapiyaSaldiri = kapiyaMi; }
          break;
        }
        case "saldiri": {
          if (!this.vurdu && this.t >= this.def.saldiri_vurus_ani) {
            this.vurdu = true;
            if (this.kapiyaSaldiri && kapi && kapi.aktif) sc.kapiHasar(this.hasar);
            else if (Math.abs(H.x - this.x) <= menzil + 18 && Z - H.y < 90) H.hasarAl(this.hasar, this.yon);
          }
          if (!this.spr.anims.isPlaying || this.t > 1.2) { this.durum = "yuru"; this.saldiriBekle = this.def.saldiri_aralik; this.oynat("yuru"); }
          break;
        }
        case "atilma": {
          this.yy += this.vy * dt; this.vy += 1700 * dt; this.x += this.yon * this.def.atilma_hiz * dt;
          if (!this.vurdu && Math.abs(H.x - this.x) < 60 && Z - H.y < 110) { this.vurdu = true; H.hasarAl(this.hasar * 1.3, this.yon); }
          if (this.yy >= 0 && this.t > 0.1) { this.yy = 0; this.durum = "yuru"; this.atilmaBekle = this.def.atilma_bekleme; this.vurdu = false; this.saldiriBekle = 0.5; sc.efekt.toz(this.x, Z, 2, 0.7); }
          break;
        }
        case "hasar": if (this.t > 0.32) { this.durum = "yuru"; this.oynat("yuru"); } break;
      }
      this.cizimGuncelle();
    }

    bossGuncelle(dt, H, fark, mesafe, yonH) {
      const sc = this.sc, d = this.def, Z = this.Z, B = sc.aktifBolge;
      const solS = B ? B.sol + 60 : -1e9, sagS = B ? B.sag - 60 : 1e9;
      switch (this.durum) {
        case "giris": {
          this.oynat("yuru"); this.x -= this.hiz * 1.4 * dt;
          if (this.x <= sagS - 220) { this.durum = "kukre"; this.t = 0; this.oynat("kukre", true); SV.Ses.cal("kukreme", { v: 1.3 }); sc.cameras.main.shake(900, 0.01); sc.bossTanit(this); }
          break;
        }
        case "kukre": if (this.t > 1.3) { this.durum = "yuru"; this.dokunulmaz = false; this.t = 0; } break;
        case "yuru": {
          if (yonH !== this.yon) this.yonAyarla(yonH);
          this.oynat("yuru"); this.saldiriBekle -= dt; this.ozelBekle -= dt; this.firlatBekle -= dt;
          if (mesafe > d.menzil * 0.8) this.x += this.yon * this.hiz * dt;
          if (H.olu) break;
          if (mesafe <= d.menzil && this.saldiriBekle <= 0) { this.durum = "vurus"; this.t = 0; this.vurdu = false; this.oynat("vurus", true); }
          else if (this.tur === "kasap" && this.ozelBekle <= 0 && mesafe > 260) { this.durum = "hucumHazir"; this.t = 0; this.oynat("kukre", true); this.spr.setTint(0xff7060); SV.Ses.cal("kukreme", { v: 0.9 }); sc.efekt.yazi(this.x, this.ust - 20, "!", "#ff4a3a", 64); }
          else if (this.tur === "dev" && this.ozelBekle <= 0) { this.durum = "vurus"; this.t = 0; this.vurdu = false; this.oynat("vurus", true); this.ozelBekle = d.sok_aralik / (this.ofkeli ? 1.4 : 1); }
          else if (this.tur === "dev" && this.firlatBekle <= 0 && mesafe > 300) { this.durum = "firlat"; this.t = 0; this.atti = false; this.oynat("firlat", true); this.firlatBekle = d.firlat_aralik / (this.ofkeli ? 1.4 : 1); }
          break;
        }
        case "vurus": {
          if (!this.vurdu && this.t >= 0.36) {
            this.vurdu = true; sc.cameras.main.shake(220, this.tur === "dev" ? 0.012 : 0.006); SV.Ses.cal(this.tur === "dev" ? "gumburtu" : "yerVurus", { v: 1 });
            if (Math.abs(H.x - this.x) <= d.menzil + 30 && Z - H.y < 100) H.hasarAl(this.hasar, this.yon);
            if (this.tur === "dev") { sc.sokDalgasi(this.x + this.yon * 90, 1, this.def); sc.sokDalgasi(this.x + this.yon * 90, -1, this.def); }
            sc.efekt.toz(this.x + this.yon * 100, Z, 5, 1.6);
          }
          if (this.t > 0.85) { this.durum = "yuru"; this.saldiriBekle = d.saldiri_aralik / (this.ofkeli ? 1.3 : 1); }
          break;
        }
        case "hucumHazir": {
          if (yonH !== this.yon) this.yonAyarla(yonH);
          if (this.t > 0.85) { this.durum = "hucum"; this.t = 0; this.hucumYol = 0; this.vurdu = false; this.oynat("hucum", true); }
          break;
        }
        case "hucum": {
          const v = d.hucum_hiz * dt; this.x += this.yon * v; this.hucumYol += v;
          if (Math.random() < 0.3) sc.efekt.toz(this.x - this.yon * 40, Z, 1, 1.2);
          if (!this.vurdu && Math.abs(H.x - this.x) < 70 && Z - H.y < 115) { this.vurdu = true; H.hasarAl(d.hucum_hasar, this.yon); H.vx = this.yon * 620; }
          const duvar = this.x <= solS || this.x >= sagS;
          if (duvar) { this.x = Phaser.Math.Clamp(this.x, solS, sagS); this.durum = "sersem"; this.t = 0; this.oynat("hasar", true); sc.cameras.main.shake(400, 0.014); SV.Ses.cal("gumburtu", { v: 1.2 }); sc.efekt.yazi(this.x, this.ust - 10, "SERSEMLEDİ!", "#f2c14e", 30); sc.efekt.toz(this.x, Z, 6, 1.8); }
          else if (this.hucumYol > d.hucum_mesafe) { this.durum = "yuru"; this.ozelBekle = d.hucum_aralik / (this.ofkeli ? 1.4 : 1); this.spr.setTint(this.ofkeli ? 0xff9a8a : sc.tema.karakterRengi); }
          break;
        }
        case "sersem": {
          this.spr.x += Math.sin(this.t * 40) * 1.5;
          if (this.t > 2.2) { this.durum = "yuru"; this.ozelBekle = d.hucum_aralik / (this.ofkeli ? 1.4 : 1); this.spr.setTint(this.ofkeli ? 0xff9a8a : sc.tema.karakterRengi); }
          break;
        }
        case "firlat": {
          if (yonH !== this.yon) this.yonAyarla(yonH);
          if (!this.atti && this.t >= 0.36) { this.atti = true; sc.varilFirlat(this, H.x); }
          if (this.t > 0.7) this.durum = "yuru";
          break;
        }
      }
      this.x = Phaser.Math.Clamp(this.x, Math.min(solS, this.x), Math.max(sagS, this.durum === "giris" ? this.x : sagS));
      this.cizimGuncelle();
    }
    cizimGuncelle() {
      const yy = this.durum === "atilma" ? this.yy : 0;
      this.spr.setPosition(this.x, this.y + yy);
      this.golge.setPosition(this.x, this.Z + 4 + this.serit);
    }
    yokEt() { this.durum = "silindi"; this.spr.destroy(); this.golge.destroy(); }
  };
})();
