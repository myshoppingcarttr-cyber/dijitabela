/* SES MOTORU — tüm efektler ve müzik Web Audio ile gerçek zamanlı sentezlenir (dosya yok, lisans yok, ~0 KB yük).
   Kullanım: SV.Ses.cal("tabanca"), SV.Ses.muzik("gece"), SV.Ses.ortam("yagmur"). İlk dokunuşta SV.Ses.baslat(). */
(function () {
  const SV = (window.SV = window.SV || {});
  let C = null, ana, efektK, muzikK, ortamK, gurultu, yanki, yankiK;
  const R = (a, b) => a + Math.random() * (b - a);

  function gurultuTamponu() {
    const n = C.sampleRate * 2, b = C.createBuffer(1, n, C.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function yankiTamponu(sure, sonum) {
    const n = Math.floor(C.sampleRate * sure), b = C.createBuffer(2, n, C.sampleRate);
    for (let k = 0; k < 2; k++) { const d = b.getChannelData(k); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, sonum); }
    return b;
  }
  function zarf(g, t, a, tepe, d, son = 0.0001) {
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(tepe, 0.0002), t + a);
    g.gain.exponentialRampToValueAtTime(son, t + a + d);
  }
  function gurultuKaynak(t, sure) {
    const s = C.createBufferSource(); s.buffer = gurultu; s.loop = true;
    s.start(t, Math.random() * 1.5); s.stop(t + sure + 0.05); return s;
  }
  function filtre(tip, f, q = 0.7) { const x = C.createBiquadFilter(); x.type = tip; x.frequency.value = f; x.Q.value = q; return x; }
  function kazanc(v = 1) { const g = C.createGain(); g.gain.value = v; return g; }
  function osc(tip, f, t, sure) { const o = C.createOscillator(); o.type = tip; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(t + sure + 0.05); return o; }
  function bozucu(miktar) {
    const w = C.createWaveShaper(), n = 1024, e = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; e[i] = ((3 + miktar) * x * 20 * (Math.PI / 180)) / (Math.PI + miktar * Math.abs(x)); }
    w.curve = e; return w;
  }
  function baglan(zincir) { for (let i = 0; i < zincir.length - 1; i++) zincir[i].connect(zincir[i + 1]); return zincir[zincir.length - 1]; }

  /* ----------------- EFEKTLER ----------------- */
  const EFEKT = {
    tabanca(t, o) {
      const g = kazanc(); zarf(g, t, 0.002, 0.9 * o.v, 0.16);
      baglan([gurultuKaynak(t, 0.2), filtre("lowpass", R(2600, 3400), 0.8), g, efektK]);
      const g2 = kazanc(); zarf(g2, t, 0.002, 0.9 * o.v, 0.12);
      const b = osc("sine", 150, t, 0.15); b.frequency.exponentialRampToValueAtTime(45, t + 0.12); baglan([b, g2, efektK]);
      const gy = kazanc(0.25 * o.v); g.connect(gy); gy.connect(yanki);
      EFEKT.kovan(t + R(0.32, 0.42), { v: 0.5 * o.v });
    },
    tufek(t, o) {
      const g = kazanc(); zarf(g, t, 0.001, 0.75 * o.v, 0.1);
      baglan([gurultuKaynak(t, 0.14), filtre("bandpass", R(1600, 2200), 0.6), g, efektK]);
      const g2 = kazanc(); zarf(g2, t, 0.001, 0.8 * o.v, 0.09);
      const b = osc("triangle", 120, t, 0.1); b.frequency.exponentialRampToValueAtTime(40, t + 0.09); baglan([b, g2, efektK]);
      const gy = kazanc(0.18 * o.v); g.connect(gy); gy.connect(yanki);
      if (Math.random() < 0.5) EFEKT.kovan(t + R(0.3, 0.45), { v: 0.35 * o.v });
    },
    pompali(t, o) {
      const g = kazanc(); zarf(g, t, 0.003, 1.0 * o.v, 0.42);
      baglan([gurultuKaynak(t, 0.5), filtre("lowpass", 1700, 0.9), g, efektK]);
      const g2 = kazanc(); zarf(g2, t, 0.002, 1.0 * o.v, 0.25);
      const b = osc("sine", 95, t, 0.28); b.frequency.exponentialRampToValueAtTime(32, t + 0.25); baglan([b, g2, efektK]);
      const gy = kazanc(0.45 * o.v); g.connect(gy); gy.connect(yanki);
      EFEKT.tik(t + 0.33, { v: 0.6 * o.v, f: 1400 }); EFEKT.tik(t + 0.46, { v: 0.7 * o.v, f: 1100 });
      EFEKT.kovan(t + 0.62, { v: 0.4 * o.v, f: 2600 });
    },
    tik(t, o) {
      const g = kazanc(); zarf(g, t, 0.001, 0.5 * (o.v || 1), 0.05);
      baglan([gurultuKaynak(t, 0.06), filtre("bandpass", o.f || 2600, 4), g, efektK]);
    },
    bos(t, o) { EFEKT.tik(t, { v: 0.6 * o.v, f: 3200 }); },
    sarjorCikar(t, o) { EFEKT.tik(t, { v: 0.55 * o.v, f: 1800 }); EFEKT.tik(t + 0.07, { v: 0.35 * o.v, f: 900 }); },
    sarjorTak(t, o) {
      EFEKT.tik(t, { v: 0.7 * o.v, f: 1500 }); EFEKT.tik(t + 0.12, { v: 0.8 * o.v, f: 2400 });
      const g = kazanc(); zarf(g, t + 0.12, 0.001, 0.12 * o.v, 0.12); baglan([osc("square", 820, t + 0.12, 0.13), filtre("bandpass", 1600, 6), g, efektK]);
    },
    kovan(t, o) {
      const f = o.f || R(4200, 5600);
      for (let i = 0; i < 2; i++) {
        const g = kazanc(); zarf(g, t + i * 0.09, 0.001, (0.09 / (i + 1)) * (o.v || 1), 0.11);
        baglan([osc("sine", f * (1 - i * 0.07), t + i * 0.09, 0.12), g, efektK]);
      }
    },
    isabet(t, o) {
      const g = kazanc(); zarf(g, t, 0.002, 0.55 * o.v, 0.09);
      baglan([gurultuKaynak(t, 0.1), filtre("bandpass", R(500, 900), 1.2), g, efektK]);
      const g2 = kazanc(); zarf(g2, t, 0.002, 0.35 * o.v, 0.08); baglan([osc("sine", 90, t, 0.1), g2, efektK]);
    },
    kafa(t, o) {
      const g = kazanc(); zarf(g, t, 0.001, 0.7 * o.v, 0.14);
      baglan([gurultuKaynak(t, 0.16), filtre("highpass", 1200, 0.7), g, efektK]);
      EFEKT.isabet(t + 0.01, o);
    },
    inilti(t, o) {
      const sure = R(0.7, 1.4) * (o.uzun || 1), f0 = R(65, 105) * (o.perde || 1);
      const s = osc("sawtooth", f0, t, sure); s.frequency.linearRampToValueAtTime(f0 * R(0.7, 0.9), t + sure);
      const lfo = osc("sine", R(5, 9), t, sure), lg = kazanc(f0 * 0.06); lfo.connect(lg); lg.connect(s.frequency);
      const g = kazanc(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.22 * o.v, t + sure * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      const f1 = filtre("bandpass", R(450, 650), 3), f2 = filtre("bandpass", R(950, 1300), 4), m = kazanc(1);
      s.connect(f1); s.connect(f2); f1.connect(m); f2.connect(m); m.connect(g); g.connect(efektK);
      const gy = kazanc(0.25); g.connect(gy); gy.connect(yanki);
      const ng = kazanc(); ng.gain.setValueAtTime(0.0001, t); ng.gain.linearRampToValueAtTime(0.05 * o.v, t + sure * 0.4); ng.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      baglan([gurultuKaynak(t, sure), filtre("bandpass", 700, 1), ng, efektK]);
    },
    ciglik(t, o) {
      const sure = R(0.45, 0.7), s = osc("sawtooth", R(280, 340), t, sure);
      s.frequency.linearRampToValueAtTime(R(560, 700), t + sure * 0.4); s.frequency.linearRampToValueAtTime(R(380, 450), t + sure);
      const g = kazanc(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18 * o.v, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      baglan([s, bozucu(40), filtre("bandpass", 1400, 1.5), g, efektK]);
      const gy = kazanc(0.3); g.connect(gy); gy.connect(yanki);
    },
    zombiOlum(t, o) { EFEKT.inilti(t, { v: o.v * 1.1, perde: 0.8, uzun: 0.8 }); EFEKT.isabet(t, { v: o.v }); },
    kukreme(t, o) {
      const sure = 1.6;
      for (let i = 0; i < 3; i++) {
        const f0 = 48 + i * 17, s = osc("sawtooth", f0, t, sure); s.frequency.linearRampToValueAtTime(f0 * 0.7, t + sure);
        const g = kazanc(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.28 * o.v, t + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
        baglan([s, bozucu(120), filtre("lowpass", 900, 1), g, efektK]);
        const gy = kazanc(0.5); g.connect(gy); gy.connect(yanki);
      }
      const ng = kazanc(); ng.gain.setValueAtTime(0.0001, t); ng.gain.linearRampToValueAtTime(0.25 * o.v, t + 0.2); ng.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      baglan([gurultuKaynak(t, sure), filtre("bandpass", 500, 0.8), ng, efektK]);
    },
    gumburtu(t, o) {
      const g = kazanc(); zarf(g, t, 0.005, 1.0 * o.v, 0.9);
      const b = osc("sine", 70, t, 1); b.frequency.exponentialRampToValueAtTime(25, t + 0.8); baglan([b, g, efektK]);
      const g2 = kazanc(); zarf(g2, t, 0.005, 0.6 * o.v, 0.7); baglan([gurultuKaynak(t, 0.8), filtre("lowpass", 420, 0.7), g2, efektK]);
      const gy = kazanc(0.5); g2.connect(gy); gy.connect(yanki);
    },
    patlama(t, o) {
      EFEKT.gumburtu(t, o);
      const g = kazanc(); zarf(g, t, 0.003, 0.9 * o.v, 0.6); baglan([gurultuKaynak(t, 0.7), filtre("lowpass", 2400, 0.6), g, efektK]);
    },
    hasar(t, o) {
      const s = osc("sawtooth", R(125, 150), t, 0.22); s.frequency.linearRampToValueAtTime(95, t + 0.2);
      const g = kazanc(); zarf(g, t, 0.01, 0.3 * o.v, 0.2);
      baglan([s, filtre("bandpass", 700, 2), g, efektK]);
      EFEKT.isabet(t, { v: o.v * 0.8 });
    },
    topla(t, o) {
      [660, 880, 1320].forEach((f, i) => { const g = kazanc(); zarf(g, t + i * 0.07, 0.005, 0.18 * o.v, 0.25); baglan([osc("triangle", f, t + i * 0.07, 0.3), g, efektK]); });
    },
    silahAl(t, o) { EFEKT.sarjorTak(t, o); EFEKT.topla(t + 0.2, o); },
    adim(t, o) { const g = kazanc(); zarf(g, t, 0.002, 0.07 * o.v, 0.06); baglan([gurultuKaynak(t, 0.08), filtre("lowpass", 500, 1), g, efektK]); },
    yerVurus(t, o) { const g = kazanc(); zarf(g, t, 0.002, 0.5 * o.v, 0.18); baglan([osc("sine", 60, t, 0.2), g, efektK]); EFEKT.adim(t, { v: o.v * 2 }); },
    tiklama(t, o) { const g = kazanc(); zarf(g, t, 0.002, 0.14 * o.v, 0.06); baglan([osc("triangle", 1250, t, 0.08), g, efektK]); },
    onay(t, o) { [523, 784].forEach((f, i) => { const g = kazanc(); zarf(g, t + i * 0.06, 0.004, 0.13 * o.v, 0.2); baglan([osc("triangle", f, t + i * 0.06, 0.25), g, efektK]); }); },
    telsiz(t, o) {
      const g = kazanc(); zarf(g, t, 0.005, 0.12 * o.v, 0.22); baglan([gurultuKaynak(t, 0.25), filtre("bandpass", 2200, 1.5), g, efektK]);
      const g2 = kazanc(); zarf(g2, t + 0.02, 0.003, 0.07 * o.v, 0.08); baglan([osc("sine", 1750, t + 0.02, 0.1), g2, efektK]);
    },
    yildiz(t, o) { const f = 700 * Math.pow(1.26, o.i || 0); const g = kazanc(); zarf(g, t, 0.004, 0.2 * o.v, 0.5); baglan([osc("triangle", f, t, 0.55), g, efektK]); const gy = kazanc(0.4); g.connect(gy); gy.connect(yanki); },
    gokGurultu(t, o) {
      const g = kazanc(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.55 * o.v, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      baglan([gurultuKaynak(t, 3.3), filtre("lowpass", 260, 0.5), g, ortamK]);
    },
    marti(t, o) {
      for (let i = 0; i < 3; i++) {
        const tt = t + i * 0.22, s = osc("sine", 1500, tt, 0.18); s.frequency.linearRampToValueAtTime(2100, tt + 0.05); s.frequency.linearRampToValueAtTime(1300, tt + 0.17);
        const g = kazanc(); zarf(g, tt, 0.01, 0.035 * o.v, 0.16); baglan([s, g, ortamK]);
      }
    },
    kapiAcilis(t, o) {
      const s = osc("sawtooth", 55, t, 1.6), g = kazanc(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.12 * o.v, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      baglan([s, filtre("lowpass", 300, 2), g, efektK]);
    }
  };

  /* ----------------- MÜZİK (adım sıralayıcı) ----------------- */
  const NOTA = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const TEMALAR = {
    menu:  { bpm: 72,  kok: 45, akor: [[0, 3, 7], [-4, 0, 3], [-7, -4, 0], [-5, -1, 2]], bas: [0, null, null, null, 0, null, null, null], arp: null, davul: "kalp", ped: 0.10, melodi: [12, null, 15, null, 14, null, 10, null, 12, null, null, null, 7, null, null, null] },
    gece:  { bpm: 96,  kok: 45, akor: [[0, 3, 7], [-4, 0, 3], [1, 5, 8], [-2, 2, 5]], bas: [0, 0, 12, 0, 0, 0, 10, 0], arp: [0, 7, 12, 7, 3, 7, 12, 15], davul: "gergin", ped: 0.07, melodi: null },
    safak: { bpm: 104, kok: 50, akor: [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]], bas: [0, 0, 7, 0, 12, 0, 7, 0], arp: [0, 3, 7, 10, 12, 10, 7, 3], davul: "suren", ped: 0.07, melodi: null },
    boss:  { bpm: 138, kok: 40, akor: [[0, 3, 7], [1, 4, 8], [0, 3, 7], [-2, 1, 5]], bas: [0, 0, 0, 12, 0, 0, 13, 12], arp: [0, 12, 0, 13, 0, 12, 15, 13], davul: "agir", ped: 0.06, melodi: null, boz: true },
    zafer: { bpm: 84,  kok: 48, akor: [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]], bas: [0, null, 7, null, 0, null, 7, null], arp: [0, 4, 7, 12, 16, 12, 7, 4], davul: null, ped: 0.10, melodi: null }
  };
  let tema = null, siradaki = 0, adimNo = 0, zamanlayici = null;

  function muzikNota(t, f, sure, tip, v, kesim, hedef = muzikK) {
    const o = osc(tip, f, t, sure), g = kazanc(); g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + Math.min(0.02, sure * 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
    const fl = filtre("lowpass", kesim, 1); baglan([o, fl, g, hedef]); return g;
  }
  function davul(t, tur, adim) {
    const kick = (v) => { const g = kazanc(); zarf(g, t, 0.002, v, 0.25); const b = osc("sine", 120, t, 0.3); b.frequency.exponentialRampToValueAtTime(38, t + 0.2); baglan([b, g, muzikK]); };
    const hat = (v) => { const g = kazanc(); zarf(g, t, 0.001, v, 0.04); baglan([gurultuKaynak(t, 0.05), filtre("highpass", 7000, 0.7), g, muzikK]); };
    const trampet = (v) => { const g = kazanc(); zarf(g, t, 0.002, v, 0.16); baglan([gurultuKaynak(t, 0.18), filtre("bandpass", 1800, 0.8), g, muzikK]); };
    const a = adim % 16;
    if (tur === "kalp") { if (a === 0) kick(0.5); if (a === 2) kick(0.32); }
    else if (tur === "gergin") { if (a % 8 === 0) kick(0.45); if (a % 2 === 1) hat(0.05); if (a === 12) trampet(0.12); }
    else if (tur === "suren") { if (a % 4 === 0) kick(0.42); if (a % 2 === 1) hat(0.06); if (a % 8 === 4) trampet(0.14); }
    else if (tur === "agir") { if (a % 4 === 0 || a === 10) kick(0.6); hat(a % 2 ? 0.05 : 0.08); if (a % 8 === 4) trampet(0.24); }
  }
  function adimCal(t) {
    const T = TEMALAR[tema]; if (!T) return;
    const sekizlik = 60 / T.bpm / 2, a = adimNo, akor = T.akor[Math.floor(a / 16) % T.akor.length];
    if (a % 16 === 0) akor.forEach((n, i) => {
      [0, 0.07].forEach((d) => { const g = muzikNota(t, NOTA(T.kok + 12 + n) * (1 + d * 0.01), sekizlik * 16, "sawtooth", T.ped * 0.5, 900 + i * 200); });
    });
    const b = T.bas[a % 8]; if (b !== null && b !== undefined) muzikNota(t, NOTA(T.kok - 12 + akor[0] + b), sekizlik * 0.9, T.boz ? "square" : "sawtooth", 0.16, T.boz ? 700 : 420);
    if (T.arp) { const n = T.arp[a % 8]; muzikNota(t, NOTA(T.kok + 12 + akor[0] + n), sekizlik * 0.7, "triangle", 0.045, 2400); }
    if (T.melodi) { const m = T.melodi[a % 16]; if (m !== null) { const g = muzikNota(t, NOTA(T.kok + 12 + m), sekizlik * 3, "triangle", 0.07, 2000); const gy = kazanc(0.6); g.connect(gy); gy.connect(yanki); } }
    if (T.davul) davul(t, T.davul, a);
    adimNo++;
  }
  function planla() {
    if (!C || !tema) return;
    const T = TEMALAR[tema], sekizlik = 60 / T.bpm / 2;
    while (siradaki < C.currentTime + 0.18) { adimCal(siradaki); siradaki += sekizlik; }
  }

  /* ----------------- ORTAM ----------------- */
  let ortamDugum = null, ortamZaman = null;
  function ortamDurdur() { if (ortamDugum) { try { ortamDugum.forEach((d) => d.stop && d.stop()); } catch (e) {} ortamDugum = null; } clearInterval(ortamZaman); }

  SV.Ses = {
    hazir: false,
    baslat() {
      if (C) { if (C.state === "suspended") C.resume(); return; }
      try { C = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
      ana = C.createDynamicsCompressor(); ana.threshold.value = -14; ana.ratio.value = 4; ana.connect(C.destination);
      efektK = kazanc(); muzikK = kazanc(); ortamK = kazanc(); yankiK = kazanc(0.5);
      efektK.connect(ana); muzikK.connect(ana); ortamK.connect(ana);
      gurultu = gurultuTamponu();
      yanki = C.createConvolver(); yanki.buffer = yankiTamponu(1.8, 3); yanki.connect(yankiK); yankiK.connect(ana);
      this.hazir = true; this.seviyeleriUygula();
      zamanlayici = setInterval(planla, 40);
      if (this._bekleyenMuzik) { const m = this._bekleyenMuzik; this._bekleyenMuzik = null; this.muzik(m); }
      if (this._bekleyenOrtam) { const m = this._bekleyenOrtam; this._bekleyenOrtam = null; this.ortam(m); }
    },
    seviyeleriUygula() {
      if (!C) return; const a = SV.Kayit.ayar, acik = a.sesAcik ? 1 : 0;
      efektK.gain.value = a.efekt * acik; ortamK.gain.value = a.efekt * acik * 0.9; muzikK.gain.value = a.muzik * acik * 0.9; yankiK.gain.value = 0.45 * acik;
    },
    cal(ad, o = {}) {
      if (!C || !EFEKT[ad] || !SV.Kayit.ayar.sesAcik) return;
      try { EFEKT[ad](C.currentTime + (o.gecikme || 0), Object.assign({ v: 1 }, o)); } catch (e) {}
    },
    muzik(ad) {
      if (!C) { this._bekleyenMuzik = ad; return; }
      if (tema === ad) return;
      tema = ad; adimNo = 0; siradaki = C.currentTime + 0.1;
    },
    muzikDurdur() { tema = null; },
    ortam(tur) {
      if (!C) { this._bekleyenOrtam = tur; return; }
      ortamDurdur(); if (!tur) return;
      const s = C.createBufferSource(); s.buffer = gurultu; s.loop = true;
      const g = kazanc(tur === "yagmur" ? 0.09 : 0.11);
      if (tur === "yagmur") baglan([s, filtre("highpass", 500, 0.5), filtre("lowpass", 5200, 0.5), g, ortamK]);
      else {
        const lp = filtre("lowpass", 520, 0.6), lfo = C.createOscillator(), lg = kazanc(0.07); lfo.frequency.value = 0.13; lfo.connect(lg); lg.connect(g.gain); lfo.start();
        baglan([s, lp, g, ortamK]); ortamDugum = [lfo];
      }
      s.start(); ortamDugum = (ortamDugum || []).concat([s]);
      ortamZaman = setInterval(() => {
        if (tur === "yagmur" && Math.random() < 0.06) { this.cal("gokGurultu"); this.onGokGurultu && this.onGokGurultu(); }
        if (tur === "deniz" && Math.random() < 0.12) this.cal("marti", { v: 1 });
      }, 1000);
    },
    durdurHepsi() { this.muzikDurdur(); ortamDurdur(); }
  };
})();
