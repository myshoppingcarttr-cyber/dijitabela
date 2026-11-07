/* DÜNYA KURULUMU — paralaks katmanlar, bölüm dekorları, ışıklar, yağmur/sis. Menü ve hikâye sahneleri de aynı katmanları kullanır. */
(function () {
  const SV = (window.SV = window.SV || {});
  const ZEMIN = () => SV.CONFIG.ekran.zeminY;

  const KATMAN = {
    gece: [
      { ad: "gece_uzak", y: 180, f: 0.06, d: -90 }, { ad: "gece_orta", y: 128, f: 0.22, d: -85 }, { ad: "gece_yakin", y: 246, f: 0.6, d: -80 }
    ],
    safak: [
      { ad: "safak_uzak", y: 356, f: 0.03, d: -90 }, { ad: "safak_orta", y: 150, f: 0.2, d: -85 }, { ad: "safak_yakin", y: 216, f: 0.6, d: -80 }
    ]
  };

  /* Ekrana sabit (scrollFactor 0) paralaks katmanlar. oy = dikey kaydırma (menü/hikâyede ufuk konumu) */
  SV.Dunya = {
    katmanlar(scene, tema, w, h, oy = 0, olcek = 1) {
      const L = [], ekle = (o) => { o.setScrollFactor(0); L.push(o); return o; };
      const gok = ekle(scene.add.image(0, 0, tema + "_gok").setOrigin(0, 0).setDepth(-100));
      const katmanlar = KATMAN[tema].map((k) => ({ k, o: ekle(scene.add.tileSprite(0, oy + k.y * olcek, w, scene.textures.get(k.ad).getSourceImage().height, k.ad).setOrigin(0, 0).setDepth(k.d).setTileScale(1, 1).setScale(1, olcek)) }));
      const zH = 150, zemin = ekle(scene.add.tileSprite(0, oy + (ZEMIN() - 30) * olcek, w, zH, tema + "_zemin").setOrigin(0, 0).setDepth(-20).setScale(1, olcek));
      let su = null; if (tema === "safak") su = ekle(scene.add.tileSprite(0, oy + (ZEMIN() + 44) * olcek, w, 80, "safak_su").setOrigin(0, 0).setDepth(-19).setScale(1, olcek));
      const alt = ekle(scene.add.rectangle(0, oy + (ZEMIN() + 120) * olcek, w, 2000, tema === "gece" ? 0x0e1016 : 0x18182c).setOrigin(0, 0).setDepth(-21));
      const nesne = {
        L, gok, katmanlar, zemin, su,
        boyutla(w2, h2) {
          w = w2; h = h2 || h;
          gok.setDisplaySize(w, Math.max(h, oy + 720 * olcek));
          katmanlar.forEach(({ o }) => o.setSize(w, o.height)); zemin.setSize(w, zH); if (su) su.setSize(w, 80); alt.setSize(w, 2000);
        },
        guncelle(sx, t) {
          katmanlar.forEach(({ k, o }) => (o.tilePositionX = sx * k.f));
          zemin.tilePositionX = sx; if (su) su.tilePositionX = sx + t * 0.018;
        },
        yokEt() { L.forEach((o) => o.destroy()); }
      };
      nesne.boyutla(w, h);
      return nesne;
    },

    /* Sis + yağmur + vinyet (ekrana sabit) */
    atmosfer(scene, tema, w, h, oy = 0, olcek = 1) {
      const T = SV.CONFIG.temalar[tema], dusuk = SV.Kayit.ayar.grafik === "dusuk";
      const A = { sis: [], yagmur: null, w, h };
      [{ y: 300, f: 0.35, a: 1, d: -15, hz: 6 }, { y: 420, f: 1.15, a: 0.7, d: 30, hz: 14 }].forEach((s, i) => {
        if (dusuk && i === 1) return;
        const o = scene.add.tileSprite(0, oy + s.y * olcek, w, 300, "sis").setOrigin(0, 0).setScrollFactor(0).setDepth(s.d).setAlpha(T.sisAlfa * s.a).setTint(T.sisRengi).setScale(1, olcek);
        A.sis.push({ o, s });
      });
      const yagmurKur = (w2) => {
        if (A.yagmur) { A.yagmur.destroy(); A.damla.destroy(); }
        A.yagmur = scene.add.particles(0, 0, "yagmur", { x: { min: -100, max: w2 + 200 }, y: oy - 40, lifespan: 900, speedY: { min: 950, max: 1150 }, speedX: { min: -170, max: -140 }, rotate: 9, alpha: { min: 0.25, max: 0.7 }, scaleY: { min: 0.7, max: 1.2 }, frequency: 14, quantity: 2 }).setScrollFactor(0).setDepth(35);
        A.damla = scene.add.particles(0, 0, "damla", { x: { min: 0, max: w2 }, y: { min: oy + (ZEMIN() - 20) * olcek, max: oy + (ZEMIN() + 110) * olcek }, lifespan: 260, scale: { start: 0.4, end: 1.4 }, alpha: { start: 0.7, end: 0 }, frequency: 30, quantity: 1 }).setScrollFactor(0).setDepth(-18);
      };
      if (T.yagmur && !dusuk) yagmurKur(w);
      A.vinyet = scene.add.image(0, oy, "vinyet").setOrigin(0, 0).setScrollFactor(0).setDepth(40).setDisplaySize(w, 720 * olcek).setAlpha(tema === "gece" ? 0.95 : 0.6);
      if (tema === "safak") A.gunes = scene.add.image(w * 0.18, oy + 120 * olcek, "isik").setScrollFactor(0).setDepth(39).setBlendMode(Phaser.BlendModes.ADD).setTint(0xffb46a).setAlpha(0.28).setScale(6 * olcek, 3.2 * olcek);
      A.boyutla = (w2) => { A.w = w2; A.sis.forEach(({ o }) => o.setSize(w2, 300)); if (A.yagmur) yagmurKur(w2); A.vinyet.setDisplaySize(w2, 720 * olcek); };
      A.guncelle = (sx, t) => { A.sis.forEach(({ o, s }) => (o.tilePositionX = sx * s.f + (t / 1000) * s.hz)); };
      A.yokEt = () => { A.sis.forEach(({ o }) => o.destroy()); A.yagmur && A.yagmur.destroy(); A.damla && A.damla.destroy(); A.vinyet.destroy(); A.gunes && A.gunes.destroy(); };
      return A;
    },

    /* Bölüm dekorları (dünya koordinatında) + ışıklar. Döner: {kapi, isiklar[], guncelle(t)} */
    dekorKur(scene, bolum) {
      const Z = ZEMIN(), tema = bolum.tema, T = SV.CONFIG.temalar[tema], r = SV.Sanat.rng(bolum.id === "b1" ? 101 : 202), ADD = Phaser.BlendModes.ADD;
      const sonuc = { isiklar: [], titreyen: [], yanip: [], kapi: null, duman: [] };
      const resim = (ad, x, y, d, ox = 0.5, oy = 1) => scene.add.image(x, y, "d_" + ad).setOrigin(ox, oy).setDepth(d);
      const isik = (x, y, renk, olcek, alfa, d = -30, sy = 1) => { const o = scene.add.image(x, y, "isik").setBlendMode(ADD).setTint(renk).setScale(olcek, olcek * sy).setAlpha(alfa).setDepth(d); sonuc.isiklar.push(o); return o; };
      const lamba = (x, bozuk) => {
        if (tema === "gece") {
          resim("lamba", x, Z - 18, -40, 0.18, 1);
          const hx = x + 50, hy = Z - 18 - 430 + 28;
          const koni = scene.add.image(hx, hy, "lambaKoni").setOrigin(0.5, 0).setBlendMode(ADD).setTint(T.isikRengi).setAlpha(0.13).setDepth(-31);
          const parla = isik(hx, hy, T.isikRengi, 0.9, 0.85, -29);
          const zemin = isik(hx, Z - 6, T.isikRengi, 2.2, 0.33, -19, 0.16);
          if (bozuk) sonuc.titreyen.push([koni, parla, zemin]);
        } else {
          resim("limanLamba", x, Z - 18, -40);
          isik(x - 11, Z - 18 - 380 + 36, 0xffe2b0, 0.5, 0.55, -29); isik(x + 11, Z - 18 - 380 + 36, 0xffe2b0, 0.5, 0.55, -29);
        }
      };
      // otomatik dekor
      const ozel = (bolum.dekor || []).map((d) => d.x);
      const yakin = (x, m) => ozel.some((o) => Math.abs(o - x) < m);
      const kopru = (bolum.dekor || []).find((d) => d.tur === "kopru");
      for (let x = 300 + r() * 200; x < bolum.uzunluk + 200; x += 520 + r() * 180) {
        if (kopru && x > kopru.x && x < kopru.x + kopru.genislik) continue;
        lamba(x, r() < 0.3);
      }
      for (let x = 600; x < bolum.uzunluk; x += 380 + r() * 520) {
        if (yakin(x, 380)) continue;
        if (tema === "gece") { const t = r(); if (t < 0.32) resim(r() < 0.5 ? "araba1" : "araba2", x, Z - 6, -12).setFlipX(r() < 0.5); else if (t < 0.55) resim("cop", x, Z - 12, -12); else if (t < 0.72) resim("copTorba", x, Z - 10, -11); else if (t < 0.85) resim("yangin", x, Z - 14, -11); else resim("bariyer", x, Z - 10, -11); }
        else { const t = r(); if (t < 0.45) { const k = 1 + ((r() * 4) | 0); resim("konteyner" + k, x, Z - 24, -46); if (r() < 0.5) resim("konteyner" + (1 + ((r() * 4) | 0)), x + (r() - 0.5) * 60, Z - 24 - 126, -47); } else if (t < 0.62) resim("varil", x, Z - 10, -12); else if (t < 0.8) resim("kasa", x, Z - 12, -12); else resim("babalik", x, Z - 6, -12); }
      }
      // bölüme özel dekorlar
      (bolum.dekor || []).forEach((d) => {
        const x = d.x;
        if (d.tur === "ambulans") { resim("ambulans", x + 150, Z - 6, -12); const l1 = isik(x + 70, Z - 170, 0xff8a1a, 0.6, 0.0, -11), l2 = isik(x + 110, Z - 170, 0x3a6bff, 0.6, 0, -11); sonuc.yanip.push({ o: [l1, l2], h: 2.2 }); sonuc.duman.push({ x: x + 330, y: Z - 90, renk: 0x333333 }); }
        if (d.tur === "polis") { resim("polis", x, Z - 6, -12); const l1 = isik(x - 5, Z - 128, 0xff2a2a, 0.9, 0, -11), l2 = isik(x + 30, Z - 128, 0x2a5bff, 0.9, 0, -11); sonuc.yanip.push({ o: [l1, l2], h: 3.4 }); isik(x, Z - 60, 0x4a6bff, 3.2, 0.12, -31, 0.5); }
        if (d.tur === "otobus") { resim("otobus", x, Z - 6, -13); const a = isik(x, Z - 120, 0xff6a1a, 2.6, 0.45, -11, 0.5); sonuc.titreyen.push([a]); sonuc.duman.push({ x: x - 80, y: Z - 200, renk: 0x222222 }); sonuc.duman.push({ x: x + 120, y: Z - 200, renk: 0x2a2a2a }); }
        if (d.tur === "bariyer") { resim("bariyer", x, Z - 8, -11); resim("bariyer", x + 190, Z - 8, -11); }
        if (d.tur === "eczane") { resim("eczane", x, Z - 22, -45); const n = isik(x - 200, Z - 22 - 168, 0xff2a3a, 1.4, 0.5, -30); sonuc.titreyen.push([n]); isik(x + 80, Z - 60, 0x9affd8, 2.2, 0.16, -30, 0.6); }
        if (d.tur === "metro") { resim("metro", x, Z - 22, -45); isik(x, Z - 90, 0xffb050, 3.4, 0.4, -30, 0.6); }
        if (d.tur === "kopru") {
          const g = d.genislik; scene.add.tileSprite(x, 30, g, 130, "d_kopruTabla").setOrigin(0, 0).setDepth(-14);
          for (let k = 0; k <= 3; k++) resim("kopruKolon", x + 80 + (k * (g - 160)) / 3, Z - 18, -15);
          scene.add.rectangle(x, 0, g, 720, 0x000000, 0.28).setOrigin(0, 0).setDepth(26);
          isik(x + g * 0.5, Z - 300, 0xffa04a, 2.8, 0.2, -30); sonuc.duman.push({ x: x + g * 0.7, y: Z - 40, renk: 0x3a2a22 });
        }
        if (d.tur === "kulube") { resim("kulube", x, Z - 18, -40); isik(x - 20, Z - 120, 0xffe2a0, 1.6, 0.35, -30); }
        if (d.tur === "forklift") resim("forklift", x, Z - 8, -12);
        if (d.tur === "vinc") resim("vinc", x, Z - 18, -48);
        if (d.tur === "jenerator") { resim("jenerator", x, Z - 14, -12); sonuc.jenIsik = isik(x + 40, Z - 80, 0xffd84a, 0.8, 0.0, -11); }
        if (d.tur === "kapi") { const k = resim("kapi", x, Z - 14, -10); sonuc.kapi = k; sonuc.kapiIsik = isik(x, Z - 390, 0xffa020, 1.2, 0, -9); }
        if (d.tur === "depo") resim("depo", x, Z - 22, -46);
        if (d.tur === "tekne") { scene.add.image(x - 900, Z - 22, "d_denizPerde").setOrigin(0, 1).setDepth(-60).setDisplaySize(2200, 300); resim("tekne", x, Z + 6, -44); isik(x - 60, Z - 200, 0xffe2b0, 1.4, 0.4, -30); }
      });
      // duman kaynakları
      if (SV.Kayit.ayar.grafik !== "dusuk") sonuc.duman.forEach((dm) => { scene.add.particles(dm.x, dm.y, "duman", { lifespan: 4200, speedY: { min: -50, max: -30 }, speedX: { min: -24, max: 6 }, scale: { start: 1.4, end: 4.5 }, alpha: { start: 0.45, end: 0 }, tint: dm.renk, frequency: 260 }).setDepth(-16); });
      sonuc.guncelle = (t) => {
        sonuc.titreyen.forEach((grp, i) => { const a = Math.sin(t * 0.03 + i * 7) > 0.85 || Math.random() < 0.04 ? 0.15 : 1; grp.forEach((o) => { if (o._a === undefined) o._a = o.alpha; o.setAlpha(o._a * a); }); });
        sonuc.yanip.forEach((y) => { const f = Math.floor((t / 1000) * y.h * 2) % 2; y.o[0].setAlpha(f ? 0.85 : 0.05); y.o[1].setAlpha(f ? 0.05 : 0.85); });
      };
      return sonuc;
    }
  };
})();
