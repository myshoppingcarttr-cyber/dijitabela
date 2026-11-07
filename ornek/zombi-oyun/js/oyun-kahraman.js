/* KAHRAMAN (Aras) — hareket, zıplama, silahlar, şarjör, hasar, ölüm. Sayılar veri/denge.json + silahlar.json'dan gelir. */
(function () {
  const SV = (window.SV = window.SV || {});

  SV.Kahraman = class {
    constructor(sc, x, ops = {}) {
      const D = SV.VERI.denge.oyuncu, S = SV.VERI.silahlar;
      this.sc = sc; this.D = D; this.Z = SV.CONFIG.ekran.zeminY;
      this.x = x; this.y = this.Z; this.vx = 0; this.vy = 0; this.yerde = true; this.yon = 1;
      this.canMax = D.can; this.can = ops.can || D.can;
      this.silahlar = {};
      (ops.silahlar || ["tabanca"]).forEach((s) => this.silahVer(s, true, ops.mermi && ops.mermi[s]));
      this.aktif = ops.aktif && this.silahlar[ops.aktif] ? ops.aktif : (ops.silahlar || ["tabanca"]).slice(-1)[0];
      this.atisBekle = 0; this.doldurmaKalan = 0; this.dokunulmaz = 0; this.hasarAnim = 0; this.olu = false; this.tepme = 0; this.adimZaman = 0;
      const K = SV.KARE.kahraman; this.K = K;
      this.golge = sc.add.image(x, this.Z + 4, "golge").setDepth(5).setScale(1.1, 1);
      this.spr = sc.add.sprite(x, this.Z, "kahraman").setDepth(10.5);
      this.yonAyarla(1);
      this.tema = SV.CONFIG.temalar[ops.tema || "gece"];
      this.spr.setTint(this.tema.karakterRengi);
      if (this.tema.fener) this.fener = sc.add.image(x, this.Z - 110, "koni").setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.12).setScale(1.5, 0.9).setDepth(9);
      this.animOynat("dur");
    }
    silahVer(s, sessiz, mermi) {
      const W = SV.VERI.silahlar[s]; if (!W) return false;
      if (this.silahlar[s]) { if (W.yedek_ust > 0) this.silahlar[s].yedek = Math.min(W.yedek_ust, this.silahlar[s].yedek + W.sarjor * 2); return false; }
      this.silahlar[s] = mermi ? Object.assign({}, mermi) : { sarjor: W.sarjor, yedek: W.yedek_baslangic };
      return true;
    }
    get W() { return SV.VERI.silahlar[this.aktif]; }
    get mermi() { return this.silahlar[this.aktif]; }
    yonAyarla(y) { this.yon = y; this.spr.setFlipX(y < 0); this.spr.setOrigin(y > 0 ? this.K.ox / this.K.w : 1 - this.K.ox / this.K.w, this.K.oy / this.K.h); }
    animOynat(ad, ters) {
      const k = ad === "olum" ? "kahraman_olum" : "kahraman_" + this.aktif + "_" + ad;
      if (this.spr.anims.currentAnim && this.spr.anims.currentAnim.key === k && this.spr.anims.isPlaying && !!this.spr.anims.inReverse === !!ters) return;
      if (ters) this.spr.anims.playReverse(k, true); else this.spr.play(k, true);
    }
    silahDegistir(hedef) {
      const sira = SV.VERI.silahlar.sira.filter((s) => this.silahlar[s]);
      if (sira.length < 2 && hedef === undefined) return;
      let yeni = hedef !== undefined ? hedef : sira[(sira.indexOf(this.aktif) + 1) % sira.length];
      if (!this.silahlar[yeni] || yeni === this.aktif) return;
      this.aktif = yeni; this.doldurmaKalan = 0; this.atisBekle = 0.18; SV.Ses.cal("tik", { f: 1600, v: 0.8 });
      this.animOynat("dur");
    }
    doldur() {
      const m = this.mermi, W = this.W;
      if (this.doldurmaKalan > 0 || m.sarjor >= W.sarjor || m.yedek === 0) return;
      this.doldurmaKalan = W.doldurma_suresi; SV.Ses.cal("sarjorCikar");
      this.sc.time.delayedCall(W.doldurma_suresi * 650, () => this.doldurmaKalan > 0 && SV.Ses.cal("sarjorTak"));
    }
    namluNoktasi() { const n = SV.NAMLU[this.aktif] || { x: 60, y: 106 }; return { x: this.x + this.yon * (n.x - this.tepme), y: this.y - n.y }; }

    hasarAl(miktar, kaynakYon) {
      if (this.olu || this.dokunulmaz > 0 || SV.gelistirici.olumsuz) return false;
      this.can = Math.max(0, this.can - miktar); this.dokunulmaz = this.D.hasar_sonrasi_dokunulmazlik; this.hasarAnim = 0.28;
      this.vx = kaynakYon * this.D.geri_itme; if (this.yerde) { this.vy = -220; this.yerde = false; }
      this.spr.setTintFill(0xff4040); this.sc.time.delayedCall(70, () => !this.olu && this.spr.setTint(this.tema.karakterRengi));
      SV.Ses.cal("hasar"); if (SV.Kayit.ayar.titresim && navigator.vibrate) try { navigator.vibrate(40); } catch (e) {}
      this.sc.cameras.main.shake(140, 0.006);
      this.sc.efekt.kan(this.x, this.y - 100, -kaynakYon, 6);
      if (this.can <= 0) this.ol();
      return true;
    }
    ol() { this.olu = true; this.doldurmaKalan = 0; this.animOynat("olum"); this.vx = -this.yon * 160; if (this.fener) this.fener.setVisible(false); this.sc.kahramanOldu(); }
    iyiles(m) { this.can = Math.min(this.canMax, this.can + m); }

    guncelle(dt, G, solS, sagS) {
      const D = this.D, Z = this.Z;
      this.dokunulmaz = Math.max(0, this.dokunulmaz - dt); this.hasarAnim = Math.max(0, this.hasarAnim - dt); this.atisBekle = Math.max(0, this.atisBekle - dt); this.tepme *= Math.pow(0.0001, dt);
      if (this.olu) {
        this.vx *= Math.pow(0.02, dt); this.vy += D.yercekimi * dt; this.x += this.vx * dt; this.y = Math.min(Z, this.y + this.vy * dt);
        this.spr.setPosition(this.x, this.y); this.golge.setPosition(this.x, Z + 4); return;
      }
      // yön: ateş ederken nişan yönü korunur
      if (G.ates && G.nisanYon) { if (G.nisanYon !== this.yon) this.yonAyarla(G.nisanYon); }
      else if (!G.ates && Math.abs(G.x) > 0.2 && Math.sign(G.x) !== this.yon) this.yonAyarla(Math.sign(G.x));
      const geri = Math.abs(G.x) > 0.2 && Math.sign(G.x) !== this.yon;
      const hedefV = G.x * D.hiz * (geri ? D.geri_yuruyus_carpani : 1);
      if (this.hasarAnim <= 0) this.vx += (hedefV - this.vx) * Math.min(1, dt * (this.yerde ? 14 : 5));
      else this.vx *= Math.pow(0.05, dt);
      // zıpla
      if (G.zipla && this.yerde) { this.vy = -D.ziplama_gucu; this.yerde = false; SV.Ses.cal("adim", { v: 1.4 }); this.sc.efekt.toz(this.x, Z, 2, 0.8); }
      if (!this.yerde) { this.vy += D.yercekimi * dt; this.y += this.vy * dt; if (this.y >= Z) { this.y = Z; this.vy = 0; this.yerde = true; this.sc.efekt.toz(this.x, Z, 3, 0.9); SV.Ses.cal("adim", { v: 1.8 }); } }
      this.x = Phaser.Math.Clamp(this.x + this.vx * dt, solS, sagS);
      // silah
      if (G.degis) this.silahDegistir();
      if (G.silahNo !== null && G.silahNo !== undefined) this.silahDegistir(SV.VERI.silahlar.sira[G.silahNo]);
      if (G.doldur) this.doldur();
      if (this.doldurmaKalan > 0) {
        this.doldurmaKalan -= dt;
        if (this.doldurmaKalan <= 0) { const m = this.mermi, W = this.W, gerek = W.sarjor - m.sarjor, al = m.yedek < 0 ? gerek : Math.min(gerek, m.yedek); m.sarjor += al; if (m.yedek > 0) m.yedek -= al; this.doldurmaKalan = 0; }
      }
      if (G.ates && this.atisBekle <= 0 && this.doldurmaKalan <= 0) {
        const m = this.mermi;
        if (m.sarjor > 0) { if (!SV.gelistirici.sinirsizMermi) m.sarjor--; this.atisBekle = this.W.atis_aralik; this.tepme = this.W.tepme; this.sc.atesEt(this); }
        else if (m.yedek !== 0) this.doldur();
        else { SV.Ses.cal("bos"); this.atisBekle = 0.35; const yedekSilah = SV.VERI.silahlar.sira.find((s) => s !== this.aktif && this.silahlar[s] && (this.silahlar[s].sarjor > 0 || this.silahlar[s].yedek !== 0)); if (yedekSilah) this.silahDegistir(yedekSilah); }
      }
      // animasyon
      const hareket = Math.abs(this.vx) > 25;
      if (this.hasarAnim > 0) this.animOynat("hasar");
      else if (!this.yerde) { this.animOynat("zipla"); this.spr.anims.pause(); this.spr.setFrame(SV.ANIMLER.find((a) => a.anahtar === "kahraman" && a.ad === this.aktif + "_zipla").kareler[this.vy < 0 ? 0 : 1]); }
      else if (this.doldurmaKalan > 0) { if (!hareket) this.animOynat("doldur"); else this.animOynat("kos", geri); }
      else if (hareket) { this.animOynat("kos", geri); this.spr.anims.timeScale = Math.max(0.6, Math.abs(this.vx) / D.hiz); this.adimZaman -= dt; if (this.adimZaman <= 0) { this.adimZaman = 0.27; SV.Ses.cal("adim", { v: 0.8 }); } }
      else this.animOynat("dur");
      if (!hareket || !this.yerde) this.spr.anims.timeScale = 1;
      const geriTepme = -this.yon * this.tepme * 0.6;
      this.spr.setPosition(this.x + geriTepme, this.y);
      this.spr.setAlpha(this.dokunulmaz > 0 && Math.floor(this.dokunulmaz * 20) % 2 ? 0.55 : 1);
      const yuk = Z - this.y; this.golge.setPosition(this.x, Z + 4).setScale(1.1 * Math.max(0.4, 1 - yuk / 300), 1).setAlpha(Math.max(0.3, 1 - yuk / 300));
      if (this.fener) { const n = this.namluNoktasi(); this.fener.setPosition(n.x - this.yon * 30, n.y + 4).setFlipX(this.yon < 0).setOrigin(this.yon > 0 ? 0 : 1, 0.5); }
    }
    yokEt() { this.spr.destroy(); this.golge.destroy(); this.fener && this.fener.destroy(); }
  };
})();
