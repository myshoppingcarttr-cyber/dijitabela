/* OYUN SAHNESİ — bölge (görev) yöneticisi, dalgalar, ateş/isabet, eşyalar, boss saldırıları, kamera, kontrol noktası. */
(function () {
  const SV = (window.SV = window.SV || {});
  const R = (a, b) => a + Math.random() * (b - a);

  SV.SahneOyun = class extends Phaser.Scene {
    constructor() { super("Oyun"); }
    init(d) { this.veri = d || {}; }

    create() {
      const d = this.veri, Y = SV.Y;
      SV.aktifOyun = this;
      this.B = SV.bolumBul(d.bolumId || "b1");
      this.tema = SV.CONFIG.temalar[this.B.tema];
      const zk = SV.VERI.denge.zorluk[SV.Kayit.ayar.zorluk] || SV.VERI.denge.zorluk.normal, gc = SV.gelistirici.zorlukCarpani || 1;
      this.zorluk = { zombi_can: zk.zombi_can * gc, zombi_hasar: zk.zombi_hasar * gc, zombi_adet: zk.zombi_adet * Math.sqrt(gc), zombi_hiz: zk.zombi_hiz };
      this.Z = SV.CONFIG.ekran.zeminY;
      this.cameras.main.setBackgroundColor(this.B.tema === "gece" ? "#05070b" : "#2a2440");
      this.kameraYerlestir();
      this.kat = SV.Dunya.katmanlar(this, this.B.tema, Y.dunyaW, 720);
      this.atm = SV.Dunya.atmosfer(this, this.B.tema, Y.dunyaW, 720);
      this.dekor = SV.Dunya.dekorKur(this, this.B);
      this.efekt = new SV.Efekt(this);

      // kontrol noktası
      const k = d.kayit || {};
      this.bolgeNo = d.bolge || 0;
      const bol = this.B.bolgeler, ilk = bol[this.bolgeNo];
      const baslaX = this.bolgeNo === 0 ? SV.VERI.denge.oyuncu.baslangic_x : Math.max(ilk.sol + 120, ilk.tetik_x - 380);
      this.kahraman = new SV.Kahraman(this, baslaX, { silahlar: k.silahlar ? Object.keys(k.silahlar) : this.baslangicSilahlari(), mermi: k.silahlar, aktif: k.aktif, tema: this.B.tema });
      this.ist = Object.assign({ skor: 0, olduren: 0, atis: 0, isabet: 0, kafa: 0, maxKombo: 0, sure: 0, olum: 0 }, k.ist || {});
      if (d.olumSayisi) this.ist.olum = d.olumSayisi;
      this.kombo = 0; this.sonOldurme = -99; this.zaman = 0; this.zamanOlcek = 1;
      this.zombiler = []; this.esyalar = []; this.variller = []; this.soklar = []; this.kuyruk = [];
      this.durum = "gecis"; this.aktifBolge = null; this.kapiHedef = null; this.bitti = false;
      this.alanL = this.bolgeNo > 0 ? bol[this.bolgeNo - 1].sol : 0; this.alanR = ilk.sag;
      this.kamL = this.alanL; this.kamR = this.alanR;
      this.cameras.main.scrollX = Phaser.Math.Clamp(baslaX - Y.dunyaW * 0.35, 0, this.B.uzunluk - Y.dunyaW);
      // eşyalar (bu ve sonraki bölgeler)
      bol.forEach((b, i) => { if (i >= this.bolgeNo) (b.esyalar || []).forEach((e) => { if (!(e.tur === "pompali" || e.tur === "tufek") || !this.kahraman.silahlar[e.tur]) this.esyaKoy(e.tur, e.x); }); });
      // kapı (savunma bölgesi geçildiyse açık)
      const savunNo = bol.findIndex((b) => b.tip === "savun");
      if (this.dekor.kapi && savunNo >= 0 && this.bolgeNo > savunNo) this.dekor.kapi.setTexture("d_kapiAcik");

      // klavye
      const KB = this.input.keyboard, KC = Phaser.Input.Keyboard.KeyCodes;
      this.tus = KB.addKeys({ sol: KC.A, sag: KC.D, sol2: KC.LEFT, sag2: KC.RIGHT, z1: KC.W, z2: KC.UP, z3: KC.SPACE, ates: KC.J, ates2: KC.K, doldur: KC.R, degis: KC.Q, degis2: KC.E, s1: KC.ONE, s2: KC.TWO, s3: KC.THREE, esc: KC.ESC, p: KC.P });
      KB.addCapture([KC.SPACE, KC.UP, KC.DOWN, KC.LEFT, KC.RIGHT]);
      SV.dokunma = { x: 0, ates: false, zipla: false, doldur: false, degis: false };
      SV.fare = { ates: false, dunyaX: null };

      SV.Ses.muzik(this.B.muzik); SV.Ses.ortam(this.B.tema === "gece" ? "yagmur" : "deniz");
      SV.Ses.onGokGurultu = () => this.simsek();
      this.flas = this.add.rectangle(0, 0, 4000, 720, 0xdfe6ff, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(45);

      this.scale.on("resize", this.boyutla, this);
      this.events.once("shutdown", () => { this.scale.off("resize", this.boyutla, this); SV.Ses.onGokGurultu = null; this.anims.globalTimeScale = 1; });
      this.scene.stop("Arayuz"); this.scene.launch("Arayuz", { oyun: this });
      this.ui = this.scene.get("Arayuz");
      this.cameras.main.fadeIn(600, 0, 0, 0);
      this.durumYaz();
      if (this.bolgeNo === 0) this.time.delayedCall(900, () => this.diyalogGoster({ kim: "aras", metin: this.B.id === "b1" ? "Sakin ol Aras. Önce sokağın sonuna kadar." : "Liman sisli... Gözünü dört aç." }));
    }
    baslangicSilahlari() { const s = new Set(this.B.baslangic_silahlar || ["tabanca"]); if (SV.GELISTIRICI && SV.gelistirici.tumSilahlar) SV.VERI.silahlar.sira.forEach((x) => s.add(x)); return [...s]; }

    kameraYerlestir() { const Y = SV.Y; this.cameras.main.setViewport(Y.dunyaX, Y.dunyaY, Y.dunyaW, 720); }
    boyutla() {
      this.kameraYerlestir(); this.kat.boyutla(SV.Y.dunyaW, 720); this.atm.boyutla(SV.Y.dunyaW);
    }

    /* ---------------- eşyalar ---------------- */
    esyaKoy(tur, x) {
      const spr = this.add.image(x, this.Z - 26, "esya_" + tur).setDepth(8).setScale(tur === "can" || tur === "mermi" ? 0.9 : 0.75);
      const par = this.add.image(x, this.Z - 26, "parilti").setDepth(7).setBlendMode(Phaser.BlendModes.ADD).setScale(1.6).setAlpha(0.6);
      const isik = this.add.image(x, this.Z - 10, "isik").setDepth(-19).setBlendMode(Phaser.BlendModes.ADD).setTint(tur === "can" ? 0x6aff9a : 0xffd070).setScale(1.2, 0.3).setAlpha(0.4);
      this.esyalar.push({ tur, x, spr, par, isik, f: Math.random() * 6 });
    }
    esyaAl(e) {
      const H = this.kahraman, D = SV.VERI.denge.esyalar;
      if (e.tur === "can") { if (H.can >= H.canMax) return false; H.iyiles(D.can.deger); this.efekt.yazi(e.x, this.Z - 150, "+" + D.can.deger + " CAN", "#6ad18a"); }
      else if (e.tur === "mermi") {
        let ver = false; Object.keys(D.mermi).forEach((s) => { const m = H.silahlar[s]; if (m) { const W = SV.VERI.silahlar[s]; m.yedek = Math.min(W.yedek_ust, m.yedek + D.mermi[s]); ver = true; } });
        if (!ver) { const m = H.silahlar.tabanca; if (m) m.sarjor = SV.VERI.silahlar.tabanca.sarjor; }
        this.efekt.yazi(e.x, this.Z - 150, "MERMİ", "#f2c14e");
      } else {
        const yeni = H.silahVer(e.tur); H.silahDegistir(e.tur);
        if (yeni) this.ui.afis && this.ui.afis(SV.VERI.silahlar[e.tur].ad.toLocaleUpperCase("tr-TR") + " ALINDI", "Silah değiştir: " + (SV.Y.dikey || this.ui.dokunmatik ? "SİLAH düğmesi" : "Q / E ya da 1-2-3"));
        SV.Ses.cal("silahAl"); return true;
      }
      SV.Ses.cal("topla"); return true;
    }

    /* ---------------- ateş & isabet ---------------- */
    atesEt(H) {
      const W = H.W, n = H.namluNoktasi(), yon = H.yon;
      this.ist.atis++;
      this.efekt.namluParla(n.x, n.y, yon, H.aktif === "pompali" ? 1.4 : H.aktif === "tufek" ? 1.1 : 0.9);
      SV.Ses.cal(W.ses, { v: 0.9 });
      if (W.ekran_sarsinti) this.cameras.main.shake(70, W.ekran_sarsinti);
      if (H.aktif !== "pompali") this.efekt.kovan(n.x - yon * 34, n.y + 2, yon, H.aktif);
      else this.time.delayedCall(420, () => this.efekt.kovan(H.x + yon * 40, n.y + 4, yon, "pompali"));
      const adaylar = this.zombiler.filter((z) => z.yasiyor && (z.x - H.x) * yon > -12 && Math.abs(z.x - n.x) <= W.menzil + z.genislik && n.y >= z.ust - 6 && n.y <= z.y + 4).sort((a, b) => Math.abs(a.x - n.x) - Math.abs(b.x - n.x));
      let isabetVar = false, delinen = 0;
      const hedefSayi = {};
      for (let p = 0; p < W.sacma; p++) {
        const sapma = (Math.random() - 0.5) * 2 * W.yayilim;
        let bitX = n.x + yon * W.menzil, bitY = n.y + sapma * W.menzil;
        // havadaki variller
        const v = this.variller.find((v) => !v.patladi && (v.x - n.x) * yon > 0 && Math.abs(v.x - n.x) < W.menzil && Math.abs(v.y - (n.y + sapma * Math.abs(v.x - n.x))) < 34);
        const ilkZ = adaylar.find((z) => z.yasiyor && (hedefSayi[adaylar.indexOf(z)] || 0) < 99);
        if (v && (!ilkZ || Math.abs(v.x - n.x) < Math.abs(ilkZ.x - n.x))) { bitX = v.x; bitY = v.y; this.varilPatlat(v, true); this.efekt.iz(n.x, n.y, bitX, bitY, W.sacma > 1 ? 1.4 : 2.2); isabetVar = true; continue; }
        let delme = W.delme;
        for (const z of adaylar) {
          if (!z.yasiyor || delme <= 0) continue;
          const mes = Math.max(0, (z.x - n.x) * yon), hy = n.y + sapma * mes;
          if (hy < z.ust - 10 || hy > z.y) continue;
          const dusus = W.sacma > 1 ? Math.max(0.35, 1 - (mes / W.menzil) * 0.65) : 1;
          const kafa = !z.boss && Math.random() < W.kafa_sans;
          const hasar = W.hasar * dusus * (kafa ? 2.2 : 1);
          bitX = z.x - yon * z.genislik * 0.3; bitY = hy;
          const oldu = z.hasarAl(hasar, yon, kafa, W.geri_itme / Math.max(1, W.sacma * 0.5));
          if (kafa && oldu) { this.ist.kafa++; this.efekt.yazi(z.x, z.ust - 10, "KAFA!", "#ff6a4a", 30); SV.Ses.cal("kafa"); this.efekt.kan(z.x, z.ust + 10, yon, 14, 1.4); }
          else SV.Ses.cal("isabet", { v: 0.5 });
          isabetVar = true; delme--; delinen++;
          if (z.yasiyor || W.delme <= 1) break;
        }
        this.efekt.iz(n.x + yon * 10, n.y, bitX, bitY, W.sacma > 1 ? 1.3 : H.aktif === "tufek" ? 2.4 : 1.8, H.aktif === "pompali" ? 0xffd090 : 0xfff0c0);
      }
      if (isabetVar) this.ist.isabet++;
    }

    zombiOldu(z, kafa) {
      const P = SV.VERI.denge.puan, KD = SV.VERI.denge.kombo;
      this.ist.olduren++;
      this.kombo = this.zaman - this.sonOldurme <= KD.sure ? this.kombo + 1 : 1; this.sonOldurme = this.zaman;
      this.ist.maxKombo = Math.max(this.ist.maxKombo, this.kombo);
      const carpan = Math.min(KD.carpan_ust, 1 + Math.floor(this.kombo / KD.carpan_adim) * KD.carpan_artis);
      const puan = Math.round(z.def.puan * carpan + (kafa ? P.kafa_bonus : 0));
      this.ist.skor += puan;
      this.efekt.yazi(z.x, z.ust - 40, "+" + puan + (carpan > 1 ? "  x" + carpan : ""), carpan > 1 ? "#f2c14e" : "#efe9dc", z.boss ? 40 : 24);
      if (this.kombo >= 3 && this.ui.komboGoster) this.ui.komboGoster(this.kombo, carpan);
      if (!z.boss) {
        const Dd = SV.VERI.denge.dusurme, r = Math.random();
        if (r < Dd.can_sans) this.esyaKoy("can", z.x); else if (r < Dd.can_sans + Dd.mermi_sans && Object.keys(this.kahraman.silahlar).length > 1) this.esyaKoy("mermi", z.x);
      } else this.bossOldu(z);
    }
    zombiCagir(tur, adet) { for (let i = 0; i < adet; i++) this.kuyruk.push({ zaman: this.zaman + i * 0.5, tur, yon: i % 2 ? "sol" : "sag" }); }
    zombiDogur(tur, yon) {
      const cam = this.cameras.main, w = SV.Y.dunyaW;
      const taraf = yon === "iki" ? (Math.random() < 0.5 ? "sol" : "sag") : yon;
      let x = taraf === "sag" ? cam.scrollX + w + R(60, 180) : cam.scrollX - R(60, 180);
      x = Phaser.Math.Clamp(x, 20, this.B.uzunluk + 200);
      const z = new SV.Zombi(this, tur, x);
      if (x < this.kahraman.x) z.yonAyarla(1);
      this.zombiler.push(z); return z;
    }

    /* ---------------- boss saldırıları ---------------- */
    sokDalgasi(x, yon, def) {
      const s = this.add.image(x, this.Z + 2, "sok").setOrigin(0.5, 1).setDepth(19).setFlipX(yon < 0).setScale(0.9, 0.8).setBlendMode(Phaser.BlendModes.ADD);
      this.soklar.push({ x, yon, s, yol: 0, hiz: def.sok_hiz, hasar: def.sok_hasar * this.zorluk.zombi_hasar, vurdu: false });
    }
    varilFirlat(z, hedefX) {
      const T = 1.05, g = 1300, x = z.x + z.yon * 40, y = this.Z - 300;
      const spr = this.add.image(x, y, "varil").setDepth(21).setScale(1.6);
      this.variller.push({ x, y, vx: (hedefX + R(-60, 60) - x) / T, vy: -g * T * 0.42, g, spr, patladi: false, def: z.def });
      SV.Ses.cal("kukreme", { v: 0.4 });
    }
    varilPatlat(v, oyuncu) {
      if (v.patladi) return; v.patladi = true; v.spr.destroy();
      this.efekt.patlama(v.x, v.y); SV.Ses.cal("patlama"); this.cameras.main.shake(300, 0.012);
      const r = v.def.varil_yaricap || 130, H = this.kahraman;
      if (!oyuncu && Math.abs(H.x - v.x) < r && Math.abs(H.y - 60 - v.y) < r + 60) H.hasarAl(v.def.varil_hasar * this.zorluk.zombi_hasar, Math.sign(H.x - v.x) || 1);
      this.zombiler.forEach((z) => { if (z.yasiyor && Math.abs(z.x - v.x) < r + z.genislik * 0.5 && v.y > z.ust - 60) z.hasarAl(oyuncu ? (z.boss ? 180 : 200) : 60, Math.sign(z.x - v.x) || 1, false, 300); });
      if (oyuncu) { this.ist.skor += SV.VERI.denge.puan.varil_vurma; this.efekt.yazi(v.x, v.y - 40, "VARİL! +" + SV.VERI.denge.puan.varil_vurma, "#ffb040", 30); }
    }
    bossTanit(z) {
      SV.Ses.muzik("boss"); this.ui.bossAfis && this.ui.bossAfis(z.def.ad, z.def.unvan);
      this.bossZ = z;
    }
    bossOldu(z) {
      this.anims.globalTimeScale = 0.3; this.zamanOlcek = 0.3; this.cameras.main.shake(900, 0.015); this.cameras.main.flash(300, 255, 220, 200);
      for (let i = 0; i < 4; i++) this.time.delayedCall(i * 120, () => this.efekt.kan(z.x + R(-40, 40), z.y - R(80, 220), Math.random() < 0.5 ? 1 : -1, 20, 1.5));
      this.time.delayedCall(450, () => { this.anims.globalTimeScale = 1; this.zamanOlcek = 1; });
      SV.Ses.muzik(this.B.muzik);
    }
    kapiHasar(m) {
      const K = this.kapiHedef; if (!K || !K.aktif) return;
      K.can -= m; this.dekor.kapi.setTint(0xff8080); this.time.delayedCall(80, () => this.dekor.kapi.clearTint());
      SV.Ses.cal("yerVurus", { v: 0.6 });
      if (K.can <= 0 && !this.bitti) { K.can = 0; K.aktif = false; this.kahraman.olu = true; this.basarisiz("Kapı yıkıldı! Sığınaktakiler iskeleye ulaşamadı."); }
    }

    /* ---------------- görev (bölge) yöneticisi ---------------- */
    bolgeBasla() {
      const b = this.B.bolgeler[this.bolgeNo];
      this.aktifBolge = b; this.durum = "aktif"; this.bt = 0; this.ilerleme = 0; this.araDiyalog = (b.diyalog_ara || []).slice();
      this.kontrol = { silahlar: JSON.parse(JSON.stringify(this.kahraman.silahlar)), aktif: this.kahraman.aktif, ist: Object.assign({}, this.ist) };
      this.alanL = b.sol; this.alanR = b.sag;
      const adetC = this.zorluk.zombi_adet;
      (b.dalgalar || []).forEach((w) => { const n = Math.max(1, Math.round(w.adet * adetC)); for (let i = 0; i < n; i++) this.kuyruk.push({ zaman: this.zaman + w.t + i * (w.aralik || 0.8), tur: w.tur, yon: w.yon === "iki" ? (i % 2 ? "sol" : "sag") : w.yon }); });
      (b.diyalog_baslangic || []).forEach((dg, i) => this.time.delayedCall(i * 2600, () => this.diyalogGoster(dg)));
      if (b.tip === "topla") { this.hedefHalka = this.add.image(b.hedef_x, this.Z + 8, "hedefHalka").setDepth(4).setScale(b.hedef_genislik / 150, 1); this.tweens.add({ targets: this.hedefHalka, alpha: 0.35, duration: 600, yoyo: true, repeat: -1 }); }
      if (b.tip === "savun") {
        this.kapiHedef = { x: b.kapi_x, can: b.kapi_can, max: b.kapi_can, aktif: true };
        if (this.dekor.jenIsik) this.tweens.add({ targets: this.dekor.jenIsik, alpha: 0.8, duration: 300, yoyo: true, repeat: -1 });
        if (this.dekor.kapiIsik) this.tweens.add({ targets: this.dekor.kapiIsik, alpha: 0.9, duration: 400, yoyo: true, repeat: -1 });
        SV.Ses.cal("kapiAcilis");
      }
      if (b.tip === "boss") this.time.delayedCall(2200, () => { const z = new SV.Zombi(this, b.boss.tur, b.sag + 200, { boss: Object.assign({}, b.boss, { can: b.boss.can }) }); z.hpMax = z.hp = Math.round(b.boss.can * this.zorluk.zombi_can); this.zombiler.push(z); this.bossZ = z; });
      this.ui.gorevAfis && this.ui.gorevAfis(b.ad, b.gorev);
    }
    bolgeTamam() {
      const b = this.aktifBolge, P = SV.VERI.denge.puan;
      this.durum = "gecis"; this.kuyruk = [];
      let bonus = P.bolge_bonus;
      if (b.tip === "savun" && this.kapiHedef) { bonus += Math.round(this.kapiHedef.can * P.kapi_can_carpani); this.kapiHedef.aktif = false; this.dekor.kapi.setTexture("d_kapiAcik"); SV.Ses.cal("kapiAcilis"); }
      this.ist.skor += bonus;
      this.ui.afis && this.ui.afis(b.tip === "boss" ? "BOSS YENİLDİ" : "BÖLGE TAMAM", "+" + bonus + " puan");
      SV.Ses.cal("onay");
      if (this.hedefHalka) { this.hedefHalka.destroy(); this.hedefHalka = null; }
      (b.diyalog_bitis || []).forEach((dg, i) => this.time.delayedCall(800 + i * 2600, () => this.diyalogGoster(dg)));
      this.bolgeNo++;
      if (this.bolgeNo >= this.B.bolgeler.length) { this.bolumBitti(); return; }
      const s = this.B.bolgeler[this.bolgeNo];
      this.alanL = b.sol; this.alanR = s.sag; this.aktifBolge = null;
      if (this.kahraman.aktif !== "tabanca" && this.kahraman.mermi.sarjor < this.kahraman.W.sarjor) this.kahraman.doldur();
    }
    bolumBitti() {
      this.bitti = true; this.durum = "bitti";
      const P = SV.VERI.denge.puan, H = this.kahraman;
      const canBonus = Math.round(H.can * P.kalan_can_carpani), zamanBonus = Math.max(0, Math.round(P.zaman_bonus_ust * (1 - this.ist.sure / P.zaman_bonus_sure)));
      const toplam = this.ist.skor + canBonus + zamanBonus, y = this.B.yildiz_puan, yildiz = toplam >= y[2] ? 3 : toplam >= y[1] ? 2 : 1;
      SV.Kayit.bolumBitti(this.B.id, toplam, yildiz);
      SV.Ses.muzik("zafer");
      this.time.delayedCall(this.B.id === "b1" ? 1600 : 1600, () => {
        this.cameras.main.fadeOut(700, 0, 0, 0);
        this.time.delayedCall(720, () => { this.scene.stop("Arayuz"); this.scene.start("Sonuc", { bolumId: this.B.id, ist: this.ist, canBonus, zamanBonus, toplam, yildiz }); });
      });
    }
    basarisiz(neden) {
      if (this.bitti) return; this.bitti = true; this.durum = "bitti";
      this.time.delayedCall(1400, () => this.ui.olumEkrani && this.ui.olumEkrani(neden));
    }
    kahramanOldu() { this.ist.olum++; this.basarisiz("Aras düştü."); }
    yenidenDene() { this.scene.restart({ bolumId: this.B.id, bolge: this.aktifBolge || this.durum === "bitti" ? this.bolgeNo : this.bolgeNo, kayit: this.kontrol, olumSayisi: this.ist.olum }); }
    diyalogGoster(dg) { this.ui && this.ui.diyalog && this.ui.diyalog(dg); }
    duraklat(ac) { if (this.bitti) return; if (ac && !this.scene.isPaused()) { this.scene.pause(); this.ui.duraklatGoster && this.ui.duraklatGoster(true); } }
    devam() { this.scene.resume(); }
    simsek() { this.flas.setAlpha(0.32); this.tweens.add({ targets: this.flas, alpha: 0, duration: 380 }); }
    bolgeAtla() { // geliştirici
      if (this.durum === "gecis") { const b = this.B.bolgeler[this.bolgeNo]; this.kahraman.x = b.tetik_x + 5; return; }
      if (this.durum === "aktif") { this.zombiler.forEach((z) => z.yasiyor && z.hasarAl(99999, 1, false, 0)); this.kuyruk = []; if (this.aktifBolge.tip === "ulas") this.kahraman.x = this.aktifBolge.hedef_x; else this.bolgeTamam(); }
    }

    /* ---------------- girdi ---------------- */
    girdiOku() {
      const T = this.tus, Dk = SV.dokunma, F = SV.fare, J = Phaser.Input.Keyboard.JustDown;
      let x = (T.sag.isDown || T.sag2.isDown ? 1 : 0) - (T.sol.isDown || T.sol2.isDown ? 1 : 0);
      if (Math.abs(Dk.x) > Math.abs(x)) x = Dk.x;
      const fareAtes = F.ates;
      const G = {
        x, ates: T.ates.isDown || T.ates2.isDown || Dk.ates || fareAtes,
        nisanYon: fareAtes && F.dunyaX !== null ? (F.dunyaX >= this.kahraman.x ? 1 : -1) : null,
        zipla: J(T.z1) || J(T.z2) || J(T.z3) || Dk.zipla, doldur: J(T.doldur) || Dk.doldur, degis: J(T.degis) || J(T.degis2) || Dk.degis,
        silahNo: J(T.s1) ? 0 : J(T.s2) ? 1 : J(T.s3) ? 2 : null
      };
      Dk.zipla = Dk.doldur = Dk.degis = false;
      if (J(T.esc) || J(T.p)) this.duraklat(true);
      return G;
    }

    update(t, dtMs) {
      const dt = Math.min(0.05, dtMs / 1000) * this.zamanOlcek, H = this.kahraman, cam = this.cameras.main, w = SV.Y.dunyaW;
      this.zaman += dt; if (!this.bitti) this.ist.sure += dt;
      const G = this.bitti && !H.olu ? { x: 0.6, ates: false } : this.girdiOku();
      // kahraman sınırları
      let solS = this.alanL + 40, sagS = this.alanR - 40;
      if (this.durum === "bitti") sagS = this.B.uzunluk;
      H.guncelle(dt, G, solS, sagS);

      // görev
      if (this.durum === "gecis" && this.bolgeNo < this.B.bolgeler.length && H.x >= this.B.bolgeler[this.bolgeNo].tetik_x) this.bolgeBasla();
      if (this.durum === "aktif") {
        const b = this.aktifBolge; this.bt += dt;
        if (b.tip === "topla" && Math.abs(H.x - b.hedef_x) < b.hedef_genislik / 2 && !H.olu) { this.ilerleme += dt; if (Math.random() < dt * 2) SV.Ses.cal("tik", { f: 900, v: 0.3 }); }
        if (b.tip === "savun") this.araDiyalog = this.araDiyalog.filter((dg) => { if (this.bt >= dg.t) { this.diyalogGoster(dg); return false; } return true; });
        const canli = this.zombiler.filter((z) => z.yasiyor).length;
        const bitti =
          (b.tip === "temizle" && this.kuyruk.length === 0 && canli === 0 && this.bt > 1) ||
          (b.tip === "topla" && this.ilerleme >= b.sure) ||
          (b.tip === "savun" && this.bt >= b.sure) ||
          (b.tip === "boss" && this.bossZ && !this.bossZ.yasiyor) ||
          (b.tip === "ulas" && H.x >= b.hedef_x - 30);
        if (bitti && !H.olu) this.bolgeTamam();
      }
      // doğurma kuyruğu
      if (this.kuyruk.length && !this.bitti) {
        const canli = this.zombiler.filter((z) => z.yasiyor).length;
        this.kuyruk = this.kuyruk.filter((q) => { if (q.zaman <= this.zaman && canli < 16) { this.zombiDogur(q.tur, q.yon); return false; } return true; });
        if (this.aktifBolge && this.aktifBolge.tip === "topla" && this.kuyruk.length === 0 && this.durum === "aktif") (this.aktifBolge.dalgalar || []).slice(-3).forEach((w2) => { for (let i = 0; i < w2.adet; i++) this.kuyruk.push({ zaman: this.zaman + 3 + i * w2.aralik, tur: w2.tur, yon: i % 2 ? "sol" : "sag" }); });
      }
      // zombiler (aralarında itişme)
      const Zs = this.zombiler;
      for (let i = 0; i < Zs.length; i++) { const a = Zs[i]; if (!a.yasiyor || a.boss) continue; for (let j = i + 1; j < Zs.length; j++) { const b = Zs[j]; if (!b.yasiyor || b.boss) continue; const d = b.x - a.x; if (Math.abs(d) < 26) { const it = (26 - Math.abs(d)) * 0.5 * (d >= 0 ? 1 : -1) * dt * 8; a.x -= it; b.x += it; } } }
      Zs.forEach((z) => z.guncelle(dt));
      this.zombiler = Zs.filter((z) => z.durum !== "silindi");
      // variller
      this.variller = this.variller.filter((v) => { if (v.patladi) return false; v.vy += v.g * dt; v.x += v.vx * dt; v.y += v.vy * dt; v.spr.setPosition(v.x, v.y).setRotation(v.spr.rotation + dt * 6); if (v.y >= this.Z - 20) this.varilPatlat(v, false); return !v.patladi; });
      // şok dalgaları
      this.soklar = this.soklar.filter((s) => { const v = s.hiz * dt; s.x += s.yon * v; s.yol += v; s.s.setPosition(s.x, this.Z + 2).setAlpha(Math.max(0, 1 - s.yol / 1000)).setScale(0.9 + Math.sin(s.yol * 0.05) * 0.1, 0.8); if (!s.vurdu && Math.abs(H.x - s.x) < 46 && this.Z - H.y < 55) { s.vurdu = true; H.hasarAl(s.hasar, s.yon); } if (Math.random() < 0.3) this.efekt.toz(s.x, this.Z, 1, 0.9); if (s.yol > 1000) { s.s.destroy(); return false; } return true; });
      // eşyalar
      this.esyalar = this.esyalar.filter((e) => { e.f += dt * 3; e.spr.y = this.Z - 30 + Math.sin(e.f) * 5; e.par.setRotation(e.f * 0.3).setAlpha(0.35 + Math.sin(e.f * 2) * 0.2); if (!H.olu && Math.abs(H.x - e.x) < 50 && this.Z - H.y < 80 && this.esyaAl(e)) { e.spr.destroy(); e.par.destroy(); e.isik.destroy(); return false; } return true; });

      // kamera
      const B = this.aktifBolge;
      let hL = B ? B.sol : 0, hR = B ? B.sag : this.B.uzunluk;
      if (!B && this.durum === "gecis" && this.bolgeNo < this.B.bolgeler.length) hR = this.B.bolgeler[this.bolgeNo].sag;
      if (hR - hL < w) { const m = (hL + hR) / 2; hL = m - w / 2; hR = m + w / 2; }
      hL = Math.max(0, hL); hR = Math.min(this.B.uzunluk, Math.max(hR, hL + w));
      this.kamL += (hL - this.kamL) * Math.min(1, dt * 3); this.kamR += (hR - this.kamR) * Math.min(1, dt * 3);
      const E = SV.CONFIG.ekran, hedef = Phaser.Math.Clamp(H.x - w * (0.5 - H.yon * E.kameraOnBakis), this.kamL, Math.max(this.kamL, this.kamR - w));
      cam.scrollX += (hedef - cam.scrollX) * Math.min(1, dt * E.kameraYumusaklik);
      this.kat.guncelle(cam.scrollX, t); this.atm.guncelle(cam.scrollX, t); this.dekor.guncelle(t);
      this.efekt.guncelle(dt);
      if (SV.fare) SV.fare.kamX = cam.scrollX;
      this.durumYaz();
    }

    durumYaz() {
      const H = this.kahraman, b = this.aktifBolge, KD = SV.VERI.denge.kombo;
      const komboAktif = this.zaman - this.sonOldurme <= KD.sure;
      let gorev = null;
      if (b) {
        gorev = { ad: b.ad, metin: b.gorev, ilerleme: null, sayac: null };
        if (b.tip === "topla") { gorev.ilerleme = Math.min(1, this.ilerleme / b.sure); gorev.metin = Math.abs(H.x - b.hedef_x) < b.hedef_genislik / 2 ? "İlaçlar aranıyor… kapıda kal" : "Eczane kapısına git"; }
        if (b.tip === "savun") { gorev.sayac = Math.max(0, b.sure - this.bt); gorev.ilerleme = this.kapiHedef ? this.kapiHedef.can / this.kapiHedef.max : null; gorev.ilerlemeAd = "KAPI"; }
        if (b.tip === "temizle") { const kalan = this.kuyruk.length + this.zombiler.filter((z) => z.yasiyor).length; gorev.metin = b.gorev + (kalan ? " · " + kalan + " zombi" : ""); }
      }
      SV.D = {
        can: H.can, canMax: H.canMax, silah: H.aktif, sarjor: H.mermi.sarjor, sarjorMax: H.W.sarjor, yedek: H.mermi.yedek,
        doldurma: H.doldurmaKalan > 0 ? 1 - H.doldurmaKalan / H.W.doldurma_suresi : -1, silahSayisi: Object.keys(H.silahlar).length,
        skor: this.ist.skor, kombo: komboAktif ? this.kombo : 0, gorev, ilerle: this.durum === "gecis" && !this.bitti,
        bolumIlerleme: H.x / this.B.uzunluk, boss: this.bossZ && this.bossZ.yasiyor && this.bossZ.durum !== "giris" ? { ad: this.bossZ.def.ad, can: Math.max(0, this.bossZ.hp), max: this.bossZ.hpMax } : null,
        kahramanEkranX: SV.Y.dunyaX + (H.x - this.cameras.main.scrollX), olu: H.olu
      };
    }
  };
})();
