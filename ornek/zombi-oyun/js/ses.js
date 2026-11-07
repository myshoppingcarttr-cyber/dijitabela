/* SES MOTORU — CC0 ses dosyaları (assets/ses/*.ogg, yedek *.mp3; kaynak listesi assets/LISANS.txt).
   Web Audio ile çalınır: müzik ve efekt ayrı kanallarda, müzik yumuşak girişli ve geçişli, aynı sesten aşırı üst üste binme sınırlı.
   API: SV.Ses.yukle(ilerleme) · baslat() · cal(ad, {v, hiz}) · muzik(tema) · ortam(tur) · seviyeleriUygula() · durdurHepsi() */
(function () {
  const SV = (window.SV = window.SV || {});
  const DOSYALAR = ["tabanca", "tufek", "pompali", "pompa", "doldurTabanca", "doldurTufek", "inilti1", "inilti2", "inilti3", "ciglik", "kukreme",
    "isabet", "isabet2", "kafa", "hasar", "gumburtu", "patlama", "adim", "adim2", "kovan", "bos", "tiklama", "onay", "topla", "telsiz", "yildiz", "kapi",
    "muzikOyun", "muzikMenu", "yagmur"];
  /* oyun içi ad -> [dosya(lar), ses düzeyi, hız aralığı, en çok eşzamanlı] */
  const HARITA = {
    tabanca: [["tabanca"], 0.9, [0.96, 1.04], 5], tufek: [["tufek"], 0.75, [0.97, 1.05], 6], pompali: [["pompali"], 1.0, [0.97, 1.02], 3],
    pompa: [["pompa"], 0.7, [1, 1], 2], doldur_tabanca: [["doldurTabanca"], 0.8, [1, 1], 1], doldur_tufek: [["doldurTufek"], 0.85, [1, 1], 1], doldur_pompali: [["pompa"], 0.75, [0.95, 1.05], 2],
    inilti: [["inilti1", "inilti2", "inilti3"], 0.45, [0.85, 1.08], 3], ciglik: [["ciglik"], 0.5, [0.92, 1.1], 2], zombiOlum: [["inilti1", "inilti3"], 0.5, [0.72, 0.82], 3],
    kukreme: [["kukreme"], 1.0, [0.95, 1.0], 1], isabet: [["isabet", "isabet2"], 0.55, [0.9, 1.15], 4], kafa: [["kafa"], 0.8, [0.95, 1.05], 2],
    hasar: [["hasar"], 0.9, [0.95, 1.05], 2], gumburtu: [["gumburtu"], 1.0, [0.95, 1.05], 2], yerVurus: [["gumburtu"], 0.55, [1.1, 1.3], 2], patlama: [["patlama"], 1.0, [0.95, 1.05], 2],
    adim: [["adim", "adim2"], 0.22, [0.9, 1.1], 2], kovan: [["kovan"], 0.25, [0.85, 1.25], 4], bos: [["bos"], 0.7, [1, 1], 1], tik: [["tiklama"], 0.5, [1.1, 1.3], 2],
    tiklama: [["tiklama"], 0.6, [1, 1], 2], onay: [["onay"], 0.6, [1, 1], 1], topla: [["topla"], 0.7, [1, 1], 2], silahAl: [["pompa", "topla"], 0.75, [1, 1], 1],
    telsiz: [["telsiz"], 0.45, [1, 1], 1], yildiz: [["yildiz"], 0.7, [1, 1], 3], kapiAcilis: [["kapi"], 0.8, [0.9, 1], 1], gokGurultu: [["patlama"], 0.28, [0.42, 0.5], 1],
    sarjorCikar: null, sarjorTak: null, isabetYumusak: [["isabet"], 0.35, [1.1, 1.3], 3], marti: null
  };
  const MUZIK = { menu: "muzikMenu", zafer: "muzikMenu", gece: "muzikOyun", safak: "muzikOyun", boss: "muzikOyun" };

  let C = null, ana, efektK, muzikK, ortamK, tampon = {}, calan = {}, muzikKaynak = null, muzikAd = null, ortamKaynak = null;
  const R = (a, b) => a + Math.random() * (b - a);

  function bicim() { const a = document.createElement("audio"); return a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"') ? "ogg" : "mp3"; }
  function baglamKur() {
    if (C) return;
    try { C = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { C = null; return; }
    ana = C.createDynamicsCompressor(); // yalnız tepe koruması (birçok ses üst üste binerse kırpmasın)
    ana.threshold.value = -4; ana.knee.value = 4; ana.ratio.value = 12; ana.attack.value = 0.002; ana.release.value = 0.15;
    ana.connect(C.destination);
    efektK = C.createGain(); muzikK = C.createGain(); ortamK = C.createGain();
    efektK.connect(ana); muzikK.connect(ana); ortamK.connect(ana);
    muzikK.gain.value = 0; // açılışta sessiz, baslat()'ta yumuşak giriş
  }

  SV.Ses = {
    hazir: false, yuklu: false,
    async yukle(ilerleme) {
      baglamKur(); if (!C) return;
      const uz = bicim(); let n = 0;
      await Promise.all(DOSYALAR.map(async (ad) => {
        try {
          const r = await fetch("assets/ses/" + ad + "." + uz + "?v=" + SV.CONFIG.surum);
          const b = await r.arrayBuffer();
          tampon[ad] = await new Promise((ok, red) => C.decodeAudioData(b, ok, red));
        } catch (e) { console.warn("ses yüklenemedi:", ad); }
        ilerleme && ilerleme(++n / DOSYALAR.length);
      }));
      this.yuklu = true;
      if (this._bekleyenMuzik) { const m = this._bekleyenMuzik; this._bekleyenMuzik = null; this.muzik(m); }
      if (this._bekleyenOrtam !== undefined) { const m = this._bekleyenOrtam; this._bekleyenOrtam = undefined; this.ortam(m); }
    },
    baslat() {
      baglamKur(); if (!C) return;
      if (C.state === "suspended") C.resume();
      if (!this.hazir) { this.hazir = true; this.seviyeleriUygula(true); }
    },
    seviyeleriUygula(yumusak) {
      if (!C) return; const a = SV.Kayit.ayar, acik = a.sesAcik ? 1 : 0, t = C.currentTime;
      const hedefM = a.muzik * 0.8 * acik;
      muzikK.gain.cancelScheduledValues(t); muzikK.gain.setValueAtTime(muzikK.gain.value, t); muzikK.gain.linearRampToValueAtTime(hedefM, t + (yumusak ? 2.5 : 0.15));
      efektK.gain.setTargetAtTime(a.efekt * acik, t, 0.03); ortamK.gain.setTargetAtTime(a.efekt * 0.8 * acik, t, 0.05);
    },
    cal(ad, o = {}) {
      if (!C || !this.hazir || !SV.Kayit.ayar.sesAcik) return;
      const h = HARITA[ad]; if (!h) return;
      const [liste, dz, hz, enCok] = h;
      const parcalar = ad === "silahAl" ? liste : [liste[(Math.random() * liste.length) | 0]];
      parcalar.forEach((dosya, i) => {
        const b = tampon[dosya]; if (!b) return;
        calan[ad] = (calan[ad] || []).filter((s) => s.bitis > C.currentTime);
        if (calan[ad].length >= enCok) { const eski = calan[ad].shift(); try { eski.g.gain.setTargetAtTime(0, C.currentTime, 0.01); eski.s.stop(C.currentTime + 0.05); } catch (e) {} }
        const s = C.createBufferSource(), g = C.createGain();
        s.buffer = b;
        let hiz = R(hz[0], hz[1]) * (o.perde || 1); if (ad === "yildiz") hiz = 1 + (o.i || 0) * 0.12;
        s.playbackRate.value = hiz;
        g.gain.value = dz * (o.v === undefined ? 1 : o.v);
        s.connect(g); g.connect(efektK);
        const bas = C.currentTime + (o.gecikme || 0) + i * 0.22;
        s.start(bas);
        calan[ad].push({ s, g, bitis: bas + b.duration / hiz });
        if (SV.Ses.kaydedici) SV.Ses.kaydedici({ k: "efekt", dosya, hiz, kazanc: g.gain.value, gecikme: (o.gecikme || 0) + i * 0.22 });
      });
      if (ad === "pompali") this.cal("pompa", { gecikme: 0.36, v: 0.8 });
    },
    muzik(tema) {
      const ad = MUZIK[tema] || null;
      if (!C || !this.yuklu) { this._bekleyenMuzik = tema; return; }
      if (ad === muzikAd) return;
      const t = C.currentTime;
      if (muzikKaynak) { const eski = muzikKaynak; eski.g.gain.setTargetAtTime(0, t, 0.4); try { eski.s.stop(t + 2); } catch (e) {} }
      muzikKaynak = null; muzikAd = ad;
      if (!ad || !tampon[ad]) return;
      const s = C.createBufferSource(), g = C.createGain();
      s.buffer = tampon[ad]; s.loop = true; s.loopStart = 0; s.loopEnd = tampon[ad].duration;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(tema === "boss" ? 1.15 : 1, t + 1.6);
      s.connect(g); g.connect(muzikK); s.start(t + 0.05);
      muzikKaynak = { s, g };
      if (SV.Ses.kaydedici) SV.Ses.kaydedici({ k: "muzik", dosya: ad, kazanc: tema === "boss" ? 1.15 : 1 });
    },
    muzikDurdur() { if (SV.Ses.kaydedici) SV.Ses.kaydedici({ k: "muzik", dosya: null }); if (!C || !muzikKaynak) { muzikAd = null; return; } const t = C.currentTime, m = muzikKaynak; m.g.gain.setTargetAtTime(0, t, 0.3); try { m.s.stop(t + 1.5); } catch (e) {} muzikKaynak = null; muzikAd = null; },
    ortam(tur) {
      if (!C || !this.yuklu) { this._bekleyenOrtam = tur; return; }
      const t = C.currentTime;
      if (ortamKaynak) { const o = ortamKaynak; o.g.gain.setTargetAtTime(0, t, 0.5); try { o.s.stop(t + 2); } catch (e) {} ortamKaynak = null; }
      clearInterval(this._gok);
      if (tur !== "yagmur" || !tampon.yagmur) { if (SV.Ses.kaydedici) SV.Ses.kaydedici({ k: "ortam", dosya: null }); return; }
      const s = C.createBufferSource(), g = C.createGain();
      s.buffer = tampon.yagmur; s.loop = true;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.35, t + 3);
      s.connect(g); g.connect(ortamK); s.start(t);
      ortamKaynak = { s, g };
      if (SV.Ses.kaydedici) SV.Ses.kaydedici({ k: "ortam", dosya: "yagmur", kazanc: 0.35 });
      this._gok = setInterval(() => { if (Math.random() < 0.04) { this.cal("gokGurultu"); this.onGokGurultu && this.onGokGurultu(); } }, 1000);
    },
    durdurHepsi() { this.muzikDurdur(); this.ortam(null); },
    /* test: ana çıkıştan sn saniyelik kayıt (ses kalite ölçümü için) */
    kayitAl(sn) {
      return new Promise((ok) => {
        if (!C || !window.MediaRecorder) return ok(null);
        const d = C.createMediaStreamDestination(); ana.connect(d);
        const r = new MediaRecorder(d.stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 256000 }), p = [];
        r.ondataavailable = (e) => p.push(e.data); r.onstop = () => { ana.disconnect(d); ok(new Blob(p, { type: "audio/webm" })); };
        r.start(); setTimeout(() => r.stop(), sn * 1000);
      });
    }
  };
})();
