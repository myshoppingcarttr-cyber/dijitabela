/* İlerleme ve ayar kaydı (localStorage). Tarayıcı izin vermezse oyun kayıtsız çalışmaya devam eder. */
(function () {
  const SV = (window.SV = window.SV || {});
  const VARSAYILAN = () => ({
    acik: ["b1"], yildiz: {}, enIyi: {}, silahlar: ["tabanca"],
    ayar: { muzik: SV.CONFIG.ses.muzik, efekt: SV.CONFIG.ses.efekt, sesAcik: true, titresim: true, kan: "yogun", grafik: "yuksek", zorluk: "normal" }
  });
  let veri = VARSAYILAN();

  SV.Kayit = {
    yukle() {
      try {
        const s = localStorage.getItem(SV.CONFIG.kayitAnahtari);
        if (s) { const v = JSON.parse(s), t = VARSAYILAN(); veri = Object.assign(t, v); veri.ayar = Object.assign(t.ayar, v.ayar || {}); }
      } catch (e) { /* gizli sekme vb. */ }
      return veri;
    },
    kaydet() { try { localStorage.setItem(SV.CONFIG.kayitAnahtari, JSON.stringify(veri)); } catch (e) {} },
    get veri() { return veri; },
    get ayar() { return veri.ayar; },
    bolumAcikMi(id) { return SV.GELISTIRICI || veri.acik.includes(id); },
    bolumBitti(id, puan, yildiz) {
      veri.yildiz[id] = Math.max(veri.yildiz[id] || 0, yildiz);
      veri.enIyi[id] = Math.max(veri.enIyi[id] || 0, puan);
      const liste = SV.VERI.bolumler.bolumler, i = liste.findIndex((b) => b.id === id);
      if (i >= 0 && liste[i + 1] && !veri.acik.includes(liste[i + 1].id)) veri.acik.push(liste[i + 1].id);
      this.kaydet();
    },
    sifirla() { const a = veri.ayar; veri = VARSAYILAN(); veri.ayar = a; this.kaydet(); }
  };
})();
