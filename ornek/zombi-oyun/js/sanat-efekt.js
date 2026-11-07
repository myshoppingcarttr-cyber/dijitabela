/* SANAT 3/3 — EFEKTLER, EŞYALAR, ARAYÜZ İKONLARI, LOGO ve üretim sırası */
(function () {
  const SV = (window.SV = window.SV || {});
  const A = (SV.Sanat = SV.Sanat || {});
  const TAU = Math.PI * 2, ekle = (...a) => A.ekle(...a);
  const FONT = (w, px) => w + " " + px + "px Oswald, 'Arial Narrow', Arial, sans-serif";
  const radyal = (x, cx, cy, r, duraklar) => { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); duraklar.forEach(([o, c]) => g.addColorStop(o, c)); return g; };

  function efektler(sc) {
    ekle(sc, "isik", 256, 256, (x) => { x.fillStyle = radyal(x, 128, 128, 128, [[0, "rgba(255,255,255,1)"], [0.25, "rgba(255,255,255,.45)"], [0.6, "rgba(255,255,255,.1)"], [1, "rgba(255,255,255,0)"]]); x.fillRect(0, 0, 256, 256); });
    ekle(sc, "koni", 512, 256, (x) => { const g = x.createLinearGradient(0, 0, 512, 0); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.beginPath(); x.moveTo(0, 120); x.lineTo(512, 0); x.lineTo(512, 256); x.lineTo(0, 136); x.closePath(); x.fill(); x.globalCompositeOperation = "destination-in"; const v = x.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(0.5, "rgba(0,0,0,1)"); v.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = v; x.fillRect(0, 0, 512, 256); });
    ekle(sc, "lambaKoni", 260, 460, (x) => { const g = x.createLinearGradient(0, 0, 0, 460); g.addColorStop(0, "rgba(255,255,255,.75)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.beginPath(); x.moveTo(110, 0); x.lineTo(150, 0); x.lineTo(260, 460); x.lineTo(0, 460); x.closePath(); x.fill(); });
    ekle(sc, "namlu", 96, 48, (x) => {
      x.fillStyle = radyal(x, 16, 24, 40, [[0, "rgba(255,255,240,1)"], [0.3, "rgba(255,220,120,.9)"], [1, "rgba(255,140,40,0)"]]); x.fillRect(0, 0, 96, 48);
      x.fillStyle = "rgba(255,240,200,.95)"; x.beginPath(); x.moveTo(4, 24); x.lineTo(40, 16); x.lineTo(92, 24); x.lineTo(40, 32); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(14, 24); x.lineTo(34, 4); x.lineTo(30, 24); x.lineTo(34, 44); x.closePath(); x.fill();
    });
    ekle(sc, "kovan", 10, 4, (x) => { x.fillStyle = "#d9a83a"; x.fillRect(0, 0, 10, 4); x.fillStyle = "#fff0b0"; x.fillRect(0, 0, 10, 1); x.fillStyle = "#8a6416"; x.fillRect(8, 0, 2, 4); });
    ekle(sc, "kovanK", 12, 5, (x) => { x.fillStyle = "#b52626"; x.fillRect(0, 0, 9, 5); x.fillStyle = "#d9a83a"; x.fillRect(9, 0, 3, 5); x.fillStyle = "rgba(255,255,255,.4)"; x.fillRect(0, 0, 9, 1); });
    ekle(sc, "kan", 16, 16, (x) => { x.fillStyle = radyal(x, 8, 8, 8, [[0, "rgba(170,10,18,1)"], [0.6, "rgba(120,6,12,.95)"], [1, "rgba(90,0,8,0)"]]); x.beginPath(); x.arc(8, 8, 8, 0, TAU); x.fill(); });
    ekle(sc, "kanLeke", 120, 30, (x) => { const r = A.rng(4); for (let i = 0; i < 14; i++) { x.fillStyle = "rgba(" + (80 + r() * 40) + ",4,10," + (0.5 + r() * 0.4) + ")"; x.beginPath(); x.ellipse(60 + (r() - 0.5) * 80, 15 + (r() - 0.5) * 10, 6 + r() * 22, 2 + r() * 6, 0, 0, TAU); x.fill(); } });
    ekle(sc, "parca", 14, 10, (x) => { x.fillStyle = "#6a1016"; x.beginPath(); x.ellipse(7, 5, 7, 5, 0.3, 0, TAU); x.fill(); x.fillStyle = "#a33a3a"; x.beginPath(); x.ellipse(5, 4, 3, 2, 0, 0, TAU); x.fill(); });
    ekle(sc, "golge", 128, 32, (x) => { x.fillStyle = radyal(x, 64, 16, 64, [[0, "rgba(0,0,0,.6)"], [1, "rgba(0,0,0,0)"]]); x.save(); x.scale(1, 0.25); x.beginPath(); x.arc(64, 64, 64, 0, TAU); x.restore(); x.fill(); });
    ekle(sc, "duman", 64, 64, (x) => { x.fillStyle = radyal(x, 32, 32, 32, [[0, "rgba(200,200,200,.55)"], [1, "rgba(200,200,200,0)"]]); x.fillRect(0, 0, 64, 64); });
    ekle(sc, "kivilcim", 12, 4, (x) => { x.fillStyle = "#fff2b0"; x.fillRect(0, 1, 12, 2); x.fillStyle = "#ffb040"; x.fillRect(0, 0, 4, 4); });
    ekle(sc, "yagmur", 3, 28, (x) => { const g = x.createLinearGradient(0, 0, 0, 28); g.addColorStop(0, "rgba(180,200,240,0)"); g.addColorStop(1, "rgba(200,215,250,.55)"); x.fillStyle = g; x.fillRect(1, 0, 1.4, 28); });
    ekle(sc, "damla", 8, 4, (x) => { x.fillStyle = "rgba(200,215,250,.5)"; x.beginPath(); x.ellipse(4, 2, 4, 1.6, 0, 0, TAU); x.fill(); });
    ekle(sc, "vinyet", 512, 512, (x) => { x.fillStyle = radyal(x, 256, 256, 362, [[0, "rgba(0,0,0,0)"], [0.6, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,.85)"]]); x.fillRect(0, 0, 512, 512); });
    ekle(sc, "sok", 160, 80, (x) => { x.fillStyle = radyal(x, 80, 80, 80, [[0, "rgba(255,230,180,.9)"], [0.5, "rgba(200,150,90,.6)"], [1, "rgba(120,90,60,0)"]]); x.beginPath(); x.ellipse(80, 80, 80, 80, 0, Math.PI, TAU); x.fill(); x.fillStyle = "rgba(90,70,50,.9)"; for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(20 + i * 15, 76 - (i % 3) * 6, 5, 0, TAU); x.fill(); } });
    ekle(sc, "patlama", 128, 128, (x) => { x.fillStyle = radyal(x, 64, 64, 64, [[0, "rgba(255,255,220,1)"], [0.25, "rgba(255,200,80,.95)"], [0.6, "rgba(230,90,20,.7)"], [1, "rgba(80,20,10,0)"]]); x.fillRect(0, 0, 128, 128); });
    ekle(sc, "toz", 32, 32, (x) => { x.fillStyle = radyal(x, 16, 16, 16, [[0, "rgba(170,160,150,.6)"], [1, "rgba(170,160,150,0)"]]); x.fillRect(0, 0, 32, 32); });
    ekle(sc, "varil", 40, 50, (x) => { x.translate(20, 25); A.varilCiz(x, 15); });
    ekle(sc, "piksel", 4, 4, (x) => { x.fillStyle = "#fff"; x.fillRect(0, 0, 4, 4); });
    ekle(sc, "hedefHalka", 160, 40, (x) => { x.strokeStyle = "rgba(255,255,255,.9)"; x.lineWidth = 3; x.setLineDash([10, 8]); x.beginPath(); x.ellipse(80, 20, 76, 16, 0, 0, TAU); x.stroke(); });
  }

  function esyalar(sc) {
    ekle(sc, "esya_can", 64, 52, (x) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = "#2f8f4e"; x.beginPath(); x.roundRect ? x.roundRect(4, 12, 56, 38, 6) : x.rect(4, 12, 56, 38); x.stroke(); x.fill(); x.fillStyle = "#246f3c"; x.fillRect(4, 40, 56, 10); x.fillStyle = "#f4f4ee"; x.fillRect(26, 18, 12, 28); x.fillRect(18, 26, 28, 12); x.strokeStyle = "#1a1d22"; x.lineWidth = 4; x.beginPath(); x.moveTo(22, 12); x.lineTo(22, 5); x.lineTo(42, 5); x.lineTo(42, 12); x.stroke(); });
    ekle(sc, "esya_mermi", 64, 48, (x) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = "#56603a"; x.fillRect(4, 12, 56, 34); x.strokeRect(4, 12, 56, 34); x.fillStyle = "#454d2e"; x.fillRect(4, 8, 56, 8); x.strokeRect(4, 8, 56, 8); x.fillStyle = "#e3c25a"; x.font = FONT(700, 13); x.fillText("MERMİ", 12, 36); x.fillStyle = "#c9a227"; for (let i = 0; i < 4; i++) x.fillRect(10 + i * 12, 0, 6, 9); });
    ["pompali", "tufek"].forEach((s) => ekle(sc, "esya_" + s, 150, 50, (x) => { x.translate(70, 32); x.scale(1.5, 1.5); A.silahCiz(x, s); }));
    ekle(sc, "parilti", 64, 64, (x) => { x.fillStyle = radyal(x, 32, 32, 32, [[0, "rgba(255,240,180,.9)"], [1, "rgba(255,200,80,0)"]]); x.fillRect(0, 0, 64, 64); x.fillStyle = "#fff"; x.beginPath(); x.moveTo(32, 6); x.lineTo(35, 29); x.lineTo(58, 32); x.lineTo(35, 35); x.lineTo(32, 58); x.lineTo(29, 35); x.lineTo(6, 32); x.lineTo(29, 29); x.closePath(); x.fill(); });
  }

  function ikonlar(sc) {
    const AC = "#efe9dc";
    ["tabanca", "pompali", "tufek"].forEach((s) => ekle(sc, "ikon_" + s, 120, 40, (x) => { x.translate(s === "tabanca" ? 50 : 70, 26); x.scale(s === "tabanca" ? 1.8 : 1.15, s === "tabanca" ? 1.8 : 1.15); A.silahCiz(x, s, AC); }));
    const I = (ad, fn, w = 64, h = 64) => ekle(sc, ad, w, h, (x) => { x.strokeStyle = AC; x.fillStyle = AC; x.lineWidth = 6; x.lineCap = "round"; x.lineJoin = "round"; fn(x); });
    I("ikon_ates", (x) => { x.beginPath(); x.arc(32, 32, 18, 0, TAU); x.stroke(); x.beginPath(); x.moveTo(32, 4); x.lineTo(32, 18); x.moveTo(32, 46); x.lineTo(32, 60); x.moveTo(4, 32); x.lineTo(18, 32); x.moveTo(46, 32); x.lineTo(60, 32); x.stroke(); x.beginPath(); x.arc(32, 32, 4, 0, TAU); x.fill(); });
    I("ikon_zipla", (x) => { x.beginPath(); x.moveTo(14, 40); x.lineTo(32, 20); x.lineTo(50, 40); x.stroke(); x.beginPath(); x.moveTo(18, 54); x.lineTo(46, 54); x.stroke(); });
    I("ikon_doldur", (x) => { x.beginPath(); x.arc(32, 32, 18, -0.4, Math.PI * 1.5); x.stroke(); x.beginPath(); x.moveTo(34, 4); x.lineTo(46, 14); x.lineTo(32, 22); x.closePath(); x.fill(); });
    I("ikon_degis", (x) => { x.beginPath(); x.moveTo(12, 24); x.lineTo(50, 24); x.moveTo(40, 14); x.lineTo(50, 24); x.lineTo(40, 34); x.moveTo(52, 42); x.lineTo(14, 42); x.moveTo(24, 32); x.lineTo(14, 42); x.lineTo(24, 52); x.stroke(); });
    I("ikon_duraklat", (x) => { x.fillRect(18, 14, 10, 36); x.fillRect(36, 14, 10, 36); });
    I("ikon_ses", (x) => { x.beginPath(); x.moveTo(10, 24); x.lineTo(22, 24); x.lineTo(34, 12); x.lineTo(34, 52); x.lineTo(22, 40); x.lineTo(10, 40); x.closePath(); x.fill(); x.lineWidth = 4; x.beginPath(); x.arc(36, 32, 10, -0.9, 0.9); x.stroke(); x.beginPath(); x.arc(36, 32, 19, -0.9, 0.9); x.stroke(); });
    I("ikon_sessiz", (x) => { x.beginPath(); x.moveTo(10, 24); x.lineTo(22, 24); x.lineTo(34, 12); x.lineTo(34, 52); x.lineTo(22, 40); x.lineTo(10, 40); x.closePath(); x.fill(); x.lineWidth = 5; x.beginPath(); x.moveTo(42, 24); x.lineTo(56, 40); x.moveTo(56, 24); x.lineTo(42, 40); x.stroke(); });
    I("ikon_kalp", (x) => { x.beginPath(); x.moveTo(32, 54); x.bezierCurveTo(4, 34, 8, 8, 32, 20); x.bezierCurveTo(56, 8, 60, 34, 32, 54); x.fill(); });
    I("ikon_kilit", (x) => { x.lineWidth = 6; x.beginPath(); x.arc(32, 26, 12, Math.PI, 0); x.stroke(); x.fillRect(14, 28, 36, 28); x.fillStyle = "#151515"; x.fillRect(29, 36, 6, 12); });
    I("ikon_ok", (x) => { x.beginPath(); x.moveTo(14, 32); x.lineTo(48, 32); x.moveTo(34, 16); x.lineTo(50, 32); x.lineTo(34, 48); x.stroke(); });
    I("ikon_geri", (x) => { x.beginPath(); x.moveTo(50, 32); x.lineTo(16, 32); x.moveTo(30, 16); x.lineTo(14, 32); x.lineTo(30, 48); x.stroke(); });
    I("ikon_tekrar", (x) => { x.beginPath(); x.arc(32, 34, 17, -2.6, 2.2); x.stroke(); x.beginPath(); x.moveTo(8, 10); x.lineTo(10, 26); x.lineTo(24, 20); x.closePath(); x.fill(); });
    I("ikon_ev", (x) => { x.beginPath(); x.moveTo(10, 32); x.lineTo(32, 12); x.lineTo(54, 32); x.stroke(); x.fillRect(18, 32, 28, 22); });
    const yildiz = (x, dolu) => { x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 13 : 30, a = -Math.PI / 2 + (i * Math.PI) / 5; x[i ? "lineTo" : "moveTo"](32 + Math.cos(a) * r, 34 + Math.sin(a) * r); } x.closePath(); if (dolu) { const g = x.createLinearGradient(0, 4, 0, 64); g.addColorStop(0, "#ffe8a0"); g.addColorStop(1, "#d99a1e"); x.fillStyle = g; x.fill(); x.strokeStyle = "#5a3a08"; x.lineWidth = 3; x.stroke(); } else { x.fillStyle = "rgba(255,255,255,.08)"; x.fill(); x.strokeStyle = "rgba(239,233,220,.45)"; x.lineWidth = 3; x.stroke(); } };
    ekle(sc, "yildiz_dolu", 64, 68, (x) => yildiz(x, true)); ekle(sc, "yildiz_bos", 64, 68, (x) => yildiz(x, false));
    ekle(sc, "dugme_daire", 160, 160, (x) => { x.fillStyle = radyal(x, 80, 70, 80, [[0, "rgba(255,255,255,.22)"], [0.8, "rgba(255,255,255,.08)"], [1, "rgba(255,255,255,0)"]]); x.beginPath(); x.arc(80, 80, 76, 0, TAU); x.fill(); x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 4; x.beginPath(); x.arc(80, 80, 72, 0, TAU); x.stroke(); });
    ekle(sc, "joy_taban", 200, 200, (x) => { x.fillStyle = radyal(x, 100, 100, 100, [[0, "rgba(0,0,0,.25)"], [1, "rgba(0,0,0,.05)"]]); x.beginPath(); x.arc(100, 100, 96, 0, TAU); x.fill(); x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 4; x.beginPath(); x.arc(100, 100, 92, 0, TAU); x.stroke(); x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 3; [0, 1, 2, 3].forEach((i) => { const a = (i * Math.PI) / 2; x.beginPath(); x.moveTo(100 + Math.cos(a) * 70, 100 + Math.sin(a) * 70); x.lineTo(100 + Math.cos(a) * 84, 100 + Math.sin(a) * 84); x.stroke(); }); });
    ekle(sc, "joy_top", 96, 96, (x) => { x.fillStyle = radyal(x, 40, 36, 50, [[0, "rgba(255,255,255,.75)"], [1, "rgba(200,200,200,.35)"]]); x.beginPath(); x.arc(48, 48, 44, 0, TAU); x.fill(); x.strokeStyle = "rgba(255,255,255,.8)"; x.lineWidth = 3; x.stroke(); });
  }

  function logo(sc) {
    ekle(sc, "logo", 1100, 300, (x, w, h) => {
      const r = A.rng(21);
      for (let i = 0; i < 26; i++) { x.fillStyle = "rgba(" + (110 + r() * 50) + ",8,14," + (0.35 + r() * 0.5) + ")"; x.beginPath(); x.ellipse(260 + r() * 600, 120 + (r() - 0.5) * 120, 6 + r() * 70, 4 + r() * 30, r() * 3, 0, TAU); x.fill(); }
      x.font = FONT(700, 176); x.textAlign = "center"; x.textBaseline = "alphabetic";
      x.lineJoin = "round"; x.strokeStyle = "#07080a"; x.lineWidth = 18; x.strokeText("SON VARDİYA", w / 2, 200);
      const g = x.createLinearGradient(0, 40, 0, 210); g.addColorStop(0, "#fff6dc"); g.addColorStop(0.55, "#e8d9b0"); g.addColorStop(0.56, "#cdb47a"); g.addColorStop(1, "#8a6a2c"); x.fillStyle = g; x.fillText("SON VARDİYA", w / 2, 200);
      x.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 40; i++) { x.strokeStyle = "rgba(0,0,0," + (0.3 + r() * 0.6) + ")"; x.lineWidth = 1 + r() * 3; x.beginPath(); const sx = 120 + r() * 860, sy = 50 + r() * 150; x.moveTo(sx, sy); x.lineTo(sx + 20 + r() * 60, sy + (r() - 0.5) * 20); x.stroke(); }
      x.globalCompositeOperation = "source-over";
      for (let i = 0; i < 7; i++) { const dx = 200 + r() * 700, dl = 20 + r() * 60; x.fillStyle = "#8f0d16"; x.fillRect(dx, 186, 5, dl); x.beginPath(); x.arc(dx + 2.5, 186 + dl, 5, 0, TAU); x.fill(); }
      x.fillStyle = "#f2c14e"; x.fillRect(w / 2 - 300, 236, 600, 4);
      x.font = FONT(500, 34); x.fillStyle = "#d9d0bb"; x.fillText("S A L G I N I N   İ L K   G E C E S İ", w / 2, 286);
    });
  }

  /* Tüm üretimi adım adım yapar (yükleme çubuğu için ilerleme bildirir) */
  A.uret = async function (scene, ilerleme) {
    const H = SV.CONFIG.hariciGorseller || {};
    const adimlar = [
      ["Efektler", () => efektler(scene)], ["Eşyalar", () => esyalar(scene)], ["Arayüz", () => ikonlar(scene)], ["Logo", () => logo(scene)],
      ["Kahraman", () => karakter("kahraman")], ["Aylak", () => karakter("aylak")], ["Aylak 2", () => karakter("aylak2")], ["Koşucu", () => karakter("kosucu")],
      ["Hantal", () => karakter("hantal")], ["Kasap", () => karakter("kasap")], ["Liman Devi", () => karakter("dev")],
      ["Portreler", () => A.portreUret(scene)], ["Gece mahallesi", () => A.dunyaUret(scene, "gece")], ["Şafak limanı", () => A.dunyaUret(scene, "safak")],
      ["Dekorlar", () => A.dekorUret(scene)], ["Atmosfer", () => A.ortakUret(scene)]
    ];
    function karakter(k) { if (H[k] && scene.textures.exists(k)) A.hariciAnimKur(k, H[k]); else A.karakterUret(scene, k); }
    for (let i = 0; i < adimlar.length; i++) {
      ilerleme(i / adimlar.length, adimlar[i][0]);
      await new Promise((r) => setTimeout(r, 0));
      try { adimlar[i][1](); } catch (e) { console.error("Sanat üretim hatası:", adimlar[i][0], e); }
    }
    // animasyonlar
    SV.ANIMLER.forEach((a) => { const ad = a.anahtar + "_" + a.ad; if (!scene.anims.exists(ad)) scene.anims.create({ key: ad, frames: a.kareler.map((f) => ({ key: a.anahtar, frame: f })), frameRate: a.fps, repeat: a.tekrar }); });
    ilerleme(1, "Hazır");
  };
})();
