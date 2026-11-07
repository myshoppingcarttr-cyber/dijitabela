/* Arayüz yardımcıları: yazı, düğme, panel, kaydırıcı, seçici */
(function () {
  const SV = (window.SV = window.SV || {});
  const R = () => SV.CONFIG.renkler;
  const hex = (s) => parseInt(s.replace("#", ""), 16);

  SV.UI = {
    yazi(sc, x, y, metin, boyut = 24, renk, ops = {}) {
      const t = sc.add.text(x, y, metin, {
        fontFamily: ops.govde ? "Barlow, Arial, sans-serif" : "Oswald, 'Arial Narrow', Arial, sans-serif",
        fontSize: boyut + "px", fontStyle: ops.kalin === false ? "normal" : ops.govde ? "500" : "700",
        color: renk || R().metin, align: ops.hiza || "left", wordWrap: ops.sar ? { width: ops.sar, useAdvancedWrap: true } : undefined,
        lineSpacing: ops.satir || 4, stroke: ops.kontur ? "#06070a" : undefined, strokeThickness: ops.kontur || 0
      });
      if (ops.golge !== false) t.setShadow(0, 2, "rgba(0,0,0,.75)", 6, false, true);
      if (ops.harf) t.setLetterSpacing && t.setLetterSpacing(ops.harf);
      return t.setOrigin(ops.ox ?? 0.5, ops.oy ?? 0.5);
    },

    panel(sc, x, y, w, h, ops = {}) {
      const g = sc.add.graphics();
      g.fillStyle(0x07090d, ops.alfa ?? 0.86); g.fillRoundedRect(x - w / 2, y - h / 2, w, h, ops.r ?? 14);
      g.fillStyle(0xffffff, 0.04); g.fillRoundedRect(x - w / 2, y - h / 2, w, Math.min(60, h / 3), { tl: ops.r ?? 14, tr: ops.r ?? 14, bl: 0, br: 0 });
      g.lineStyle(2, hex(ops.kenar || "#f2c14e"), ops.kenarAlfa ?? 0.35); g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, ops.r ?? 14);
      return g;
    },

    /* Düğme: kap = Container. ops: birincil, ikon, kucuk */
    dugme(sc, x, y, w, h, etiket, cb, ops = {}) {
      const kap = sc.add.container(x, y);
      const g = sc.add.graphics(), birincil = !!ops.birincil;
      const ciz = (durum) => {
        g.clear();
        const r = Math.min(12, h / 2);
        if (birincil) {
          g.fillStyle(durum === 2 ? 0xb4801f : durum === 1 ? 0xffd36b : 0xf2c14e, 1); g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
          g.fillStyle(0xffffff, 0.22); g.fillRoundedRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.42, { tl: r - 2, tr: r - 2, bl: 2, br: 2 });
          g.lineStyle(3, 0x1a1206, 0.9); g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
        } else {
          g.fillStyle(0x0b0e14, durum === 2 ? 0.95 : 0.78); g.fillRoundedRect(-w / 2, -h / 2, w, h, r);
          g.lineStyle(2, durum ? 0xf2c14e : 0xefe9dc, durum ? 0.9 : 0.32); g.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
        }
      };
      ciz(0);
      const yazi = SV.UI.yazi(sc, ops.ikon ? 16 : 0, 1, etiket, ops.boyut || Math.round(Math.min(30, h * 0.42)), birincil ? "#1a1206" : R().metin, { golge: !birincil });
      kap.add([g, yazi]);
      if (ops.ikon) { const ik = sc.add.image(-yazi.width / 2 - 8, 0, ops.ikon).setDisplaySize(h * 0.5, h * 0.5).setTint(birincil ? 0x1a1206 : 0xefe9dc); kap.add(ik); kap.ikon = ik; }
      const alan = sc.add.rectangle(0, 0, w, h, 0x000000, 0.001).setInteractive({ useHandCursor: true });
      kap.add(alan);
      let basili = false;
      alan.on("pointerover", () => !kap.pasif && ciz(1));
      alan.on("pointerout", () => { basili = false; ciz(0); kap.setScale(1); });
      alan.on("pointerdown", (p, lx, ly, ev) => { if (kap.pasif) return; basili = true; ciz(2); kap.setScale(0.97); SV.Ses.baslat(); ev && ev.stopPropagation && ev.stopPropagation(); });
      alan.on("pointerup", (p, lx, ly, ev) => { if (!basili || kap.pasif) return; basili = false; ciz(1); kap.setScale(1); SV.Ses.cal("tiklama"); ev && ev.stopPropagation && ev.stopPropagation(); cb && cb(); });
      kap.yazi = yazi; kap.alan = alan;
      kap.etiket = (s) => { yazi.setText(s); if (kap.ikon) kap.ikon.setX(-yazi.width / 2 - 8); return kap; };
      kap.pasifYap = (p) => { kap.pasif = p; kap.setAlpha(p ? 0.45 : 1); return kap; };
      return kap;
    },

    /* Yuvarlak ikon düğmesi (duraklat, ses) */
    ikonDugme(sc, x, y, r, ikon, cb) {
      const kap = sc.add.container(x, y), g = sc.add.graphics();
      const ciz = (b) => { g.clear(); g.fillStyle(0x07090d, b ? 0.95 : 0.6); g.fillCircle(0, 0, r); g.lineStyle(2, 0xefe9dc, b ? 0.8 : 0.3); g.strokeCircle(0, 0, r); };
      ciz(0);
      const ik = sc.add.image(0, 0, ikon).setDisplaySize(r * 1.1, r * 1.1);
      const alan = sc.add.circle(0, 0, r + 6, 0, 0.001).setInteractive({ useHandCursor: true });
      kap.add([g, ik, alan]);
      alan.on("pointerdown", (p, a, b, ev) => { ciz(1); SV.Ses.baslat(); ev && ev.stopPropagation && ev.stopPropagation(); });
      alan.on("pointerup", (p, a, b, ev) => { ciz(0); ev && ev.stopPropagation && ev.stopPropagation(); cb && cb(); });
      alan.on("pointerout", () => ciz(0));
      kap.ikon = ik; return kap;
    },

    /* Kaydırıcı: deger 0..1 */
    kaydirici(sc, x, y, w, etiket, deger, degisti) {
      const kap = sc.add.container(x, y);
      const ad = SV.UI.yazi(sc, -w / 2, -22, etiket, 20, R().soluk, { ox: 0 });
      const yuzde = SV.UI.yazi(sc, w / 2, -22, Math.round(deger * 100) + "%", 20, R().metin, { ox: 1 });
      const g = sc.add.graphics(), top = sc.add.circle(0, 8, 13, 0xf2c14e).setStrokeStyle(3, 0x1a1206);
      const ciz = () => { g.clear(); g.fillStyle(0xffffff, 0.15); g.fillRoundedRect(-w / 2, 4, w, 8, 4); g.fillStyle(0xf2c14e, 1); g.fillRoundedRect(-w / 2, 4, w * deger, 8, 4); top.x = -w / 2 + w * deger; yuzde.setText(Math.round(deger * 100) + "%"); };
      ciz();
      const alan = sc.add.rectangle(0, 8, w + 30, 44, 0, 0.001).setInteractive({ useHandCursor: true });
      const ayarla = (p) => { const m = kap.getWorldTransformMatrix(), lx = (p.x - m.tx) / (m.a || 1); deger = Phaser.Math.Clamp((lx + w / 2) / w, 0, 1); ciz(); degisti(deger); };
      let surukle = false;
      alan.on("pointerdown", (p) => { surukle = true; ayarla(p); });
      sc.input.on("pointermove", (p) => surukle && p.isDown && ayarla(p));
      sc.input.on("pointerup", () => (surukle = false));
      kap.add([ad, yuzde, g, top, alan]);
      return kap;
    },

    /* Seçici: secenekler = [{ad, deger}] */
    secici(sc, x, y, w, etiket, secenekler, deger, degisti) {
      const kap = sc.add.container(x, y);
      kap.add(SV.UI.yazi(sc, -w / 2, 0, etiket, 20, R().soluk, { ox: 0 }));
      const bw = Math.min(110, (w * 0.62) / secenekler.length), dugmeler = [];
      secenekler.forEach((s, i) => {
        const d = SV.UI.dugme(sc, w / 2 - (secenekler.length - i - 0.5) * (bw + 6), 0, bw, 40, s.ad, () => { deger = s.deger; boya(); degisti(s.deger); }, { boyut: 17 });
        dugmeler.push({ d, s }); kap.add(d);
      });
      const boya = () => dugmeler.forEach(({ d, s }) => { d.yazi.setColor(s.deger === deger ? "#f2c14e" : "#9a9488"); d.setAlpha(s.deger === deger ? 1 : 0.75); });
      boya();
      return kap;
    }
  };
})();
