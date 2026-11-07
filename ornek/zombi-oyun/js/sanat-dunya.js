/* SANAT 2/3 — DÜNYA: paralaks katmanlar (gece mahalle, şafak liman), dekorlar ve hikâye sahnesi. */
(function () {
  const SV = (window.SV = window.SV || {});
  const A = (SV.Sanat = SV.Sanat || {});
  const TAU = Math.PI * 2;
  const renk = (h, k) => A.renk(h, k);
  const FONT = (w, px) => w + " " + px + "px Oswald, 'Arial Narrow', Arial, sans-serif";

  function ekle(scene, ad, w, h, fn) { const c = A.tuval(w, h), x = c.getContext("2d"); fn(x, w, h); if (scene.textures.exists(ad)) scene.textures.remove(ad); scene.textures.addCanvas(ad, c); return c; }
  A.ekle = ekle;
  function dik(x, x1, y1, x2, y2, renkler) { const g = x.createLinearGradient(x1, y1, x2, y2); renkler.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
  function rr(x, a, b, w, h, r) { x.beginPath(); if (x.roundRect) x.roundRect(a, b, w, h, r); else x.rect(a, b, w, h); }
  /* yatayda döşenebilir çizim: aynı öğeyi x ve x±W konumlarına da çizer */
  function dose(W, x0, fn) { fn(x0); if (x0 < 400) fn(x0 + W); if (x0 > W - 400) fn(x0 - W); }

  /* ================= GECE (Karanlık Mahalle) ================= */
  function geceGok(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#04070e"], [0.35, "#0b1429"], [0.62, "#1d2340"], [0.8, "#3a2c45"], [1, "#4d3441"]]); x.fillRect(0, 0, w, h);
    const r = A.rng(5);
    for (let i = 0; i < 170; i++) { const a = r(); x.fillStyle = "rgba(220,230,255," + (0.15 + r() * 0.6) * (1 - a) + ")"; const s = r() < 0.08 ? 2 : 1; x.fillRect(r() * w, a * h * 0.55, s, s); }
    const mx = w * 0.74, my = h * 0.2;
    let g = x.createRadialGradient(mx, my, 20, mx, my, 220); g.addColorStop(0, "rgba(200,215,255,.35)"); g.addColorStop(1, "rgba(200,215,255,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    g = x.createRadialGradient(mx - 10, my - 10, 4, mx, my, 40); g.addColorStop(0, "#fbf8ee"); g.addColorStop(1, "#cfd5e3"); x.fillStyle = g; x.beginPath(); x.arc(mx, my, 38, 0, TAU); x.fill();
    x.fillStyle = "rgba(150,160,185,.35)"; [[-12, -8, 8], [10, 6, 6], [4, -16, 4], [-6, 14, 5]].forEach(([a, b, c]) => { x.beginPath(); x.arc(mx + a, my + b, c, 0, TAU); x.fill(); });
    // bulut şeritleri
    for (let i = 0; i < 9; i++) { const cy = h * (0.12 + r() * 0.4), cx = r() * w, L = 200 + r() * 380; const gg = x.createLinearGradient(cx - L, 0, cx + L, 0); gg.addColorStop(0, "rgba(60,70,100,0)"); gg.addColorStop(0.5, "rgba(70,78,110," + (0.18 + r() * 0.2) + ")"); gg.addColorStop(1, "rgba(60,70,100,0)"); x.fillStyle = gg; x.beginPath(); x.ellipse(cx, cy, L, 8 + r() * 14, 0, 0, TAU); x.fill(); }
    // şehir ışığı
    g = x.createLinearGradient(0, h * 0.62, 0, h); g.addColorStop(0, "rgba(255,140,60,0)"); g.addColorStop(1, "rgba(255,120,60,.28)"); x.fillStyle = g; x.fillRect(0, h * 0.6, w, h * 0.4);
  }
  function binaPencere(x, bx, by, bw, bh, r, ops) {
    const pw = ops.pw || 10, ph = ops.ph || 14, ax = ops.ax || 8, ay = ops.ay || 12;
    for (let yy = by + ay; yy < by + bh - ph - (ops.alt || 10); yy += ph + ay) for (let xx = bx + ax; xx < bx + bw - pw - 2; xx += pw + ax) {
      const q = r();
      if (q < ops.yanik) { const sic = r() < 0.75; x.fillStyle = sic ? "rgba(255,196,110," + (0.55 + r() * 0.4) + ")" : "rgba(140,190,255," + (0.4 + r() * 0.35) + ")"; x.fillRect(xx, yy, pw, ph); x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(xx + pw / 2 - 0.5, yy, 1, ph); if (ops.parlama) { x.fillStyle = sic ? "rgba(255,180,90,.08)" : "rgba(120,170,255,.06)"; x.fillRect(xx - 6, yy - 6, pw + 12, ph + 12); } }
      else { x.fillStyle = ops.koyu || "rgba(0,0,0,.35)"; x.fillRect(xx, yy, pw, ph); }
    }
  }
  function geceUzak(x, w, h) {
    const r = A.rng(17); let bx = 0;
    while (bx < w) {
      const bw = 50 + r() * 110, bh = 90 + r() * 230, renkB = "#111829";
      dose(w, bx, (X) => { x.fillStyle = renkB; x.fillRect(X, h - bh, bw, bh); x.fillStyle = "rgba(90,110,160,.12)"; x.fillRect(X, h - bh, bw, 2); binaPencere(x, X, h - bh, bw, bh, A.rng((bx * 13) | 0), { pw: 4, ph: 6, ax: 7, ay: 9, yanik: 0.06, koyu: "rgba(0,0,0,0)" }); if (r() < 0.3) { x.fillStyle = renkB; x.fillRect(X + bw * 0.6, h - bh - 30, 2, 30); x.fillRect(X + bw * 0.6 - 8, h - bh - 22, 16, 2); } });
      bx += bw + r() * 6;
    }
    // cami silueti
    dose(w, 1250, (X) => {
      x.fillStyle = "#0e1424"; x.beginPath(); x.arc(X + 80, h - 150, 70, Math.PI, 0); x.fill(); x.fillRect(X + 10, h - 150, 140, 150);
      [X - 10, X + 160].forEach((m) => { x.fillRect(m, h - 330, 14, 330); x.beginPath(); x.moveTo(m - 2, h - 330); x.lineTo(m + 7, h - 380); x.lineTo(m + 16, h - 330); x.fill(); x.fillRect(m - 4, h - 270, 22, 6); });
      x.fillRect(X + 78, h - 240, 4, 22);
    });
  }
  function geceOrta(x, w, h) {
    const r = A.rng(29); let bx = 0;
    while (bx < w) {
      const kat = 3 + ((r() * 4) | 0), bw = 150 + r() * 120, bh = 40 + kat * 52, renkB = A.karistir("#18203a", "#2a2236", r() * 0.5);
      dose(w, bx, (X) => {
        x.fillStyle = dik(x, 0, h - bh, 0, h, [[0, renk(renkB, 1.18)], [1, renkB]]); x.fillRect(X, h - bh, bw, bh);
        x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(X + bw - 6, h - bh, 6, bh);
        x.fillStyle = "#121827"; x.fillRect(X - 4, h - bh - 6, bw + 8, 7);
        if (r() < 0.6) { x.fillStyle = "#151b2b"; x.fillRect(X + bw * 0.2, h - bh - 24, 30, 18); x.fillRect(X + bw * 0.2 + 13, h - bh - 30, 4, 8); }
        if (r() < 0.5) { x.strokeStyle = "#151b2b"; x.lineWidth = 2; x.beginPath(); x.moveTo(X + bw * 0.7, h - bh - 6); x.lineTo(X + bw * 0.7, h - bh - 40); x.moveTo(X + bw * 0.7 - 10, h - bh - 32); x.lineTo(X + bw * 0.7 + 10, h - bh - 32); x.stroke(); }
        binaPencere(x, X, h - bh, bw, bh, A.rng((bx * 7) | 0), { pw: 14, ph: 20, ax: 14, ay: 18, yanik: 0.13, alt: 20, parlama: true });
        for (let k = 1; k < kat; k++) { x.fillStyle = "rgba(0,0,0,.28)"; x.fillRect(X + 6, h - bh + k * 52 - 6, bw - 12, 4); }
      });
      bx += bw + 10 + r() * 30;
    }
  }
  const DUKKANLAR = ["BAKKAL", "FIRIN", "BERBER", "TERZİ", "ÇAY OCAĞI", "KUAFÖR", "LOKANTA", "KIRTASİYE", "MANAV", "TAMİRCİ", "KASAP", "BÜFE"];
  function geceYakin(x, w, h) {
    const r = A.rng(41); let bx = 0, i = 0;
    while (bx < w - 40) {
      const bw = Math.min(w - bx, 230 + r() * 140), dukkan = DUKKANLAR[i++ % DUKKANLAR.length], cephe = A.karistir("#262d43", "#3a2f3a", r() * 0.6), kepenk = r() < 0.55;
      const X = bx;
      x.fillStyle = dik(x, 0, 40, 0, h, [[0, renk(cephe, 1.12)], [1, renk(cephe, 0.8)]]); x.fillRect(X, 40, bw, h - 40);
      // üst kat pencereler + balkon
      for (let k = 0; k < 1; k++) { const py = 62 + k * 120; for (let p = 0; p < Math.floor(bw / 90); p++) { const px = X + 24 + p * 90; const yan = r() < 0.18; x.fillStyle = yan ? "rgba(255,190,100,.75)" : "#0c0f18"; x.fillRect(px, py, 44, 64); x.strokeStyle = "#1a1f2b"; x.lineWidth = 4; x.strokeRect(px, py, 44, 64); x.fillStyle = "rgba(0,0,0,.4)"; x.fillRect(px + 21, py, 2, 64); if (yan) { x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(px + 4, py + 30, 14, 34); } } x.fillStyle = "#151a26"; x.fillRect(X + 10, py + 66, bw - 20, 6); x.strokeStyle = "#151a26"; x.lineWidth = 2; for (let t = X + 14; t < X + bw - 14; t += 9) { x.beginPath(); x.moveTo(t, py + 66); x.lineTo(t, py + 46); x.stroke(); } x.fillRect(X + 10, py + 44, bw - 20, 3); }
      // dükkân
      const dy = h - 150;
      x.fillStyle = "#0e1119"; x.fillRect(X + 12, dy, bw - 24, 150);
      if (kepenk) { x.fillStyle = dik(x, 0, dy + 34, 0, h, [[0, "#4a505e"], [1, "#2b2f39"]]); x.fillRect(X + 16, dy + 34, bw - 32, 116); x.fillStyle = "rgba(0,0,0,.35)"; for (let t = dy + 38; t < h; t += 7) x.fillRect(X + 16, t, bw - 32, 2); x.fillStyle = "rgba(220,60,60,.6)"; x.font = FONT(700, 15); x.fillText(["KAÇIN", "YARDIM", "ÇIKIŞ YOK", "112?"][(r() * 4) | 0], X + 30 + r() * 40, dy + 80 + r() * 40); }
      else { x.fillStyle = "rgba(255,170,90," + (r() < 0.4 ? 0.22 : 0.05) + ")"; x.fillRect(X + 16, dy + 34, bw - 32, 116); x.strokeStyle = "#1a1d25"; x.lineWidth = 5; x.strokeRect(X + 16, dy + 34, bw - 32, 116); x.strokeStyle = "rgba(255,255,255,.25)"; x.lineWidth = 1.2; x.beginPath(); const cx = X + 40 + r() * (bw - 80), cy = dy + 60 + r() * 50; for (let k = 0; k < 6; k++) { x.moveTo(cx, cy); const a = r() * TAU; x.lineTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 40); } x.stroke(); }
      // tabela
      x.fillStyle = A.karistir("#3c2a1c", "#1d2a3c", r()); x.fillRect(X + 18, dy + 2, bw - 36, 28); x.strokeStyle = "rgba(0,0,0,.6)"; x.lineWidth = 2; x.strokeRect(X + 18, dy + 2, bw - 36, 28);
      x.fillStyle = "rgba(240,225,190,.82)"; x.font = FONT(700, 19); x.textAlign = "center"; x.fillText(dukkan, X + bw / 2, dy + 23); x.textAlign = "left";
      // klima, kablo
      if (r() < 0.6) { x.fillStyle = "#3a404c"; x.fillRect(X + bw - 60, 200, 38, 26); x.fillStyle = "rgba(0,0,0,.4)"; for (let t = 0; t < 5; t++) x.fillRect(X + bw - 56, 204 + t * 4, 30, 1.5); }
      x.fillStyle = "rgba(0,0,0,.45)"; x.fillRect(X + bw - 4, 40, 4, h - 40);
      bx += bw;
    }
    x.strokeStyle = "rgba(10,10,14,.8)"; x.lineWidth = 1.5; for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(0, 30 + k * 8); for (let t = 0; t <= w; t += 128) x.quadraticCurveTo(t + 64, 46 + k * 8, t + 128, 30 + k * 8); x.stroke(); }
  }
  function geceZemin(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, 36, [[0, "#3b4150"], [1, "#2c313d"]]); x.fillRect(0, 0, w, 36);
    x.fillStyle = "rgba(0,0,0,.28)"; for (let t = 0; t < w; t += 64) x.fillRect(t, 0, 2, 36); x.fillRect(0, 17, w, 1.5);
    x.fillStyle = dik(x, 0, 36, 0, 48, [[0, "#6a6f80"], [1, "#3a3e4a"]]); x.fillRect(0, 36, w, 12);
    x.fillStyle = dik(x, 0, 48, 0, h, [[0, "#1d2029"], [1, "#101218"]]); x.fillRect(0, 48, w, h - 48);
    const r = A.rng(3); for (let i = 0; i < 700; i++) { x.fillStyle = "rgba(255,255,255," + r() * 0.06 + ")"; x.fillRect(r() * w, 48 + r() * (h - 48), 2, 2); }
    x.fillStyle = "rgba(220,215,190,.35)"; for (let t = 30; t < w; t += 256) x.fillRect(t, 112, 120, 6);
    for (let i = 0; i < 5; i++) { const px = r() * w, g = x.createLinearGradient(px - 40, 0, px + 40, 0); g.addColorStop(0, "rgba(140,160,210,0)"); g.addColorStop(0.5, "rgba(140,160,210,.07)"); g.addColorStop(1, "rgba(140,160,210,0)"); x.fillStyle = g; x.fillRect(px - 40, 50, 80, h - 50); }
    x.fillStyle = "rgba(10,12,18,.6)"; for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(r() * w, 70 + r() * 80, 30 + r() * 40, 4 + r() * 4, 0, 0, TAU); x.fill(); }
  }
  function geceOn(x, w, h) {
    const r = A.rng(77), c = "#05070b";
    for (let bx = 0; bx < w; bx += 300 + r() * 500) {
      const t = r();
      if (t < 0.35) { x.fillStyle = c; x.fillRect(bx, h - 46, 150, 46); for (let k = 0; k < 10; k++) x.fillRect(bx + k * 15, h - 70, 4, 26); x.fillRect(bx, h - 64, 150, 4); }
      else if (t < 0.6) { x.fillStyle = c; x.beginPath(); x.moveTo(bx, h); for (let k = 0; k < 9; k++) x.lineTo(bx + k * 20, h - 10 - r() * 30); x.lineTo(bx + 180, h); x.fill(); }
      else if (t < 0.8) { x.fillStyle = c; x.fillRect(bx + 10, h - 220, 10, 220); x.fillRect(bx, h - 200, 30, 8); }
      else { x.fillStyle = c; rr(x, bx, h - 40, 34, 40, 6); x.fill(); x.fillRect(bx - 4, h - 30, 42, 6); }
    }
  }

  /* ================= ŞAFAK (Eski Liman) ================= */
  function safakGok(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#1a1d40"], [0.28, "#47376a"], [0.5, "#a9566e"], [0.66, "#ee8d62"], [0.75, "#ffc48c"], [0.79, "#ffe1ad"], [0.8, "#c98279"], [1, "#4b3a5c"]]); x.fillRect(0, 0, w, h);
    const sx = w * 0.3, sy = h * 0.765;
    let g = x.createRadialGradient(sx, sy, 10, sx, sy, 420); g.addColorStop(0, "rgba(255,236,190,.85)"); g.addColorStop(0.25, "rgba(255,190,130,.35)"); g.addColorStop(1, "rgba(255,170,120,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = "#fff4d6"; x.beginPath(); x.arc(sx, sy, 34, Math.PI, 0); x.fill();
    const r = A.rng(9);
    for (let i = 0; i < 14; i++) { const cy = h * (0.1 + r() * 0.5), cx = r() * w, L = 120 + r() * 300, ka = 6 + r() * 16; const gg = x.createLinearGradient(0, cy - ka, 0, cy + ka); gg.addColorStop(0, "rgba(120,80,130,.0)"); gg.addColorStop(0.5, "rgba(140,85,130,.45)"); gg.addColorStop(1, "rgba(255,170,140,.55)"); x.fillStyle = gg; x.beginPath(); x.ellipse(cx, cy, L, ka, 0, 0, TAU); x.fill(); }
    // deniz
    const dy = h * 0.8; x.fillStyle = dik(x, 0, dy, 0, h, [[0, "#b77a86"], [0.4, "#6f5277"], [1, "#2e2a4c"]]); x.fillRect(0, dy, w, h - dy);
    for (let i = 0; i < 90; i++) { const yy = dy + Math.pow(r(), 1.6) * (h - dy), sp = 1 - (yy - dy) / (h - dy); const xx = sx + (r() - 0.5) * (60 + (yy - dy) * 1.2); x.fillStyle = "rgba(255,225,170," + (0.25 + r() * 0.5) * (0.5 + sp) + ")"; x.fillRect(xx, yy, 6 + r() * 26, 1.5); }
  }
  function safakUzak(x, w, h) {
    const r = A.rng(13);
    x.fillStyle = "rgba(122,86,124,.75)"; x.beginPath(); x.moveTo(0, h); for (let t = 0; t <= w; t += 32) x.lineTo(t, h - 40 - 30 * Math.sin(t / 260) - 16 * Math.sin(t / 77 + 1)); x.lineTo(w, h); x.fill();
    // fener
    dose(w, 1500, (X) => { x.fillStyle = "#5d4466"; x.fillRect(X, h - 150, 16, 110); x.fillRect(X - 4, h - 156, 24, 8); x.fillStyle = "#ffe5a8"; x.fillRect(X + 3, h - 172, 10, 14); x.fillStyle = "#5d4466"; x.beginPath(); x.moveTo(X - 2, h - 172); x.lineTo(X + 8, h - 184); x.lineTo(X + 18, h - 172); x.fill(); });
    // gemiler
    [[400, 1], [1100, 0.7], [1800, 0.85]].forEach(([gx, s]) => dose(w, gx, (X) => { x.fillStyle = "#5e4567"; x.beginPath(); x.moveTo(X, h - 30); x.lineTo(X + 160 * s, h - 30); x.lineTo(X + 145 * s, h - 12); x.lineTo(X + 12 * s, h - 12); x.fill(); x.fillRect(X + 90 * s, h - 54 * s - 20, 36 * s, 26 * s); x.fillRect(X + 30 * s, h - 46, 50 * s, 16); }));
  }
  function vincCiz(x, X, taban, yuk, renkV, s = 1) {
    x.strokeStyle = renkV; x.fillStyle = renkV; x.lineWidth = 6 * s;
    const ay = taban - yuk;
    x.beginPath(); x.moveTo(X, taban); x.lineTo(X + 20 * s, ay); x.moveTo(X + 110 * s, taban); x.lineTo(X + 90 * s, ay); x.stroke();
    x.lineWidth = 2.5 * s; for (let t = 0; t < 6; t++) { const y1 = taban - (yuk / 6) * t, y2 = taban - (yuk / 6) * (t + 1); x.beginPath(); x.moveTo(X + 3 * s + t * 3 * s, y1); x.lineTo(X + 107 * s - (t + 1) * 3 * s, y2); x.stroke(); }
    x.fillRect(X - 60 * s, ay - 22 * s, 300 * s, 22 * s);
    x.lineWidth = 2 * s; for (let t = -60; t < 240; t += 20) { x.beginPath(); x.moveTo(X + t * s, ay - 22 * s); x.lineTo(X + (t + 10) * s, ay); x.stroke(); }
    x.fillRect(X + 30 * s, ay - 60 * s, 50 * s, 38 * s);
    x.lineWidth = 1.5 * s; x.beginPath(); x.moveTo(X + 200 * s, ay); x.lineTo(X + 200 * s, ay + 120 * s); x.stroke(); x.fillRect(X + 192 * s, ay + 120 * s, 16 * s, 10 * s);
  }
  function safakOrta(x, w, h) {
    const r = A.rng(19), c = "#5a4469";
    [100, 700, 1350, 1800].forEach((vx) => dose(w, vx, (X) => vincCiz(x, X, h, 300 + r() * 80, c, 0.9)));
    for (let bx = 0; bx < w; bx += 70 + r() * 90) { const yig = 1 + ((r() * 3) | 0); for (let k = 0; k < yig; k++) { const cw = 90 + r() * 30; x.fillStyle = A.karistir(["#7a4a5e", "#4f5a7a", "#7a6a4a", "#4e6a66"][(r() * 4) | 0], "#6a5272", 0.55); x.fillRect(bx, h - 36 - k * 34, cw, 34); x.fillStyle = "rgba(0,0,0,.15)"; for (let t = bx + 4; t < bx + cw; t += 6) x.fillRect(t, h - 34 - k * 34, 2, 30); } }
  }
  function safakYakin(x, w, h) {
    const r = A.rng(23); let bx = 0, n = 1;
    while (bx < w - 40) {
      const bw = Math.min(w - bx, 420 + r() * 200), X = bx, ust = 90 + r() * 60, duvar = A.karistir("#56475d", "#3f4660", r());
      x.fillStyle = dik(x, 0, ust, 0, h, [[0, renk(duvar, 1.1)], [1, renk(duvar, 0.78)]]); x.fillRect(X, ust, bw, h - ust);
      x.fillStyle = "rgba(0,0,0,.18)"; for (let t = X; t < X + bw; t += 10) x.fillRect(t, ust, 3, h - ust);
      x.fillStyle = renk(duvar, 0.6); x.beginPath(); x.moveTo(X - 10, ust + 4); x.lineTo(X + bw / 2, ust - 40); x.lineTo(X + bw + 10, ust + 4); x.fill();
      const kx = X + bw * 0.25, kw = bw * 0.5; x.fillStyle = "#2a2433"; x.fillRect(kx, h - 210, kw, 210); x.fillStyle = "rgba(0,0,0,.3)"; for (let t = h - 206; t < h; t += 9) x.fillRect(kx, t, kw, 2);
      x.fillStyle = "#e3c873"; x.fillRect(X + 20, ust + 20, 110, 34); x.fillStyle = "#2a2230"; x.font = FONT(700, 24); x.fillText("DEPO " + n++, X + 30, ust + 46);
      for (let p = 0; p < 3; p++) { x.fillStyle = "rgba(255,200,150,.25)"; x.fillRect(X + bw - 70 - p * 50, ust + 30, 34, 20); }
      bx += bw + 6;
    }
  }
  function safakZemin(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, 44, [[0, "#7b7180"], [1, "#5a5262"]]); x.fillRect(0, 0, w, 44);
    x.fillStyle = "rgba(0,0,0,.18)"; for (let t = 0; t < w; t += 128) x.fillRect(t, 0, 2, 44);
    x.fillStyle = "#d9b23a"; x.fillRect(0, 36, w, 4); x.fillStyle = "rgba(0,0,0,.3)"; for (let t = 0; t < w; t += 40) x.fillRect(t, 36, 18, 4);
    x.fillStyle = dik(x, 0, 44, 0, 74, [[0, "#4a4251"], [1, "#2c2734"]]); x.fillRect(0, 44, w, 30);
    for (let t = 40; t < w; t += 170) { x.fillStyle = "#151318"; x.beginPath(); x.ellipse(t, 60, 14, 12, 0, 0, TAU); x.fill(); x.strokeStyle = "#2b2830"; x.lineWidth = 3; x.stroke(); }
    x.fillStyle = dik(x, 0, 74, 0, h, [[0, "#3a3456"], [1, "#1c1c33"]]); x.fillRect(0, 74, w, h - 74);
    const r = A.rng(31); for (let i = 0; i < 60; i++) { x.fillStyle = "rgba(255,190,160," + (0.08 + r() * 0.2) + ")"; x.fillRect(r() * w, 80 + r() * (h - 84), 10 + r() * 30, 1.5); }
    const r2 = A.rng(4); for (let i = 0; i < 260; i++) { x.fillStyle = "rgba(0,0,0," + r2() * 0.12 + ")"; x.fillRect(r2() * w, r2() * 34, 3, 2); }
  }
  function safakOn(x, w, h) {
    const r = A.rng(55), c = "#140f19";
    for (let bx = 0; bx < w; bx += 380 + r() * 500) {
      if (r() < 0.5) { x.fillStyle = c; rr(x, bx, h - 34, 40, 34, 8); x.fill(); x.fillRect(bx - 6, h - 40, 52, 8); x.strokeStyle = c; x.lineWidth = 5; x.beginPath(); x.moveTo(bx + 20, h - 36); x.quadraticCurveTo(bx + 120, h - 2, bx + 240, h - 26); x.stroke(); }
      else { x.fillStyle = c; x.fillRect(bx, h - 60, 80, 60); x.fillRect(bx + 20, h - 90, 60, 30); }
    }
  }
  function su(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#3a3458"], [1, "#16172b"]]); x.fillRect(0, 0, w, h);
    const r = A.rng(8); for (let i = 0; i < 70; i++) { const yy = r() * h; x.fillStyle = "rgba(255,185,160," + (0.06 + r() * 0.22) * (1 - yy / h) + ")"; const xx = r() * w, L = 8 + r() * 40; x.fillRect(xx, yy, L, 1.6); if (xx + L > w) x.fillRect(xx - w, yy, L, 1.6); }
  }

  /* ================= ORTAK ================= */
  function sis(x, w, h) {
    const r = A.rng(61);
    for (let i = 0; i < 46; i++) {
      const cx = r() * w, cy = h * (0.35 + r() * 0.5), rx = 80 + r() * 160, ry = 30 + r() * 50;
      [cx, cx - w, cx + w].forEach((X) => { const g = x.createRadialGradient(X, cy, 0, X, cy, rx); g.addColorStop(0, "rgba(255,255,255," + (0.18 + r() * 0.12) + ")"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.save(); x.translate(X, cy); x.scale(1, ry / rx); x.translate(-X, -cy); x.beginPath(); x.arc(X, cy, rx, 0, TAU); x.fill(); x.restore(); });
    }
  }

  /* ================= DEKORLAR ================= */
  const D = {};
  D.lamba = (x, w, h) => {
    x.fillStyle = dik(x, 0, 0, 12, 0, [[0, "#2b3240"], [1, "#11141b"]]); x.fillRect(16, 40, 10, h - 40);
    x.fillStyle = "#151920"; x.fillRect(10, h - 30, 22, 30); x.fillRect(12, h - 120, 18, 6);
    x.strokeStyle = "#1c222c"; x.lineWidth = 7; x.beginPath(); x.moveTo(21, 46); x.quadraticCurveTo(24, 14, 70, 16); x.stroke();
    x.fillStyle = "#1a1f28"; x.beginPath(); x.moveTo(58, 10); x.lineTo(104, 12); x.lineTo(96, 24); x.lineTo(64, 24); x.closePath(); x.fill();
    x.fillStyle = "#fff0c8"; x.fillRect(66, 24, 28, 4);
  };
  D.limanLamba = (x, w, h) => {
    x.fillStyle = "#3a3340"; x.fillRect(w / 2 - 6, 30, 12, h - 30); x.fillStyle = "#2a2430"; x.fillRect(w / 2 - 22, 20, 44, 12); x.fillStyle = "#ffe0b0"; x.fillRect(w / 2 - 18, 32, 14, 6); x.fillRect(w / 2 + 4, 32, 14, 6); x.fillStyle = "#2a2430"; x.fillRect(w / 2 - 14, h - 24, 28, 24);
  };
  function araba(x, w, h, govde, polis) {
    const y0 = h - 22;
    x.fillStyle = "rgba(0,0,0,.35)"; x.beginPath(); x.ellipse(w / 2, h - 4, w * 0.48, 8, 0, 0, TAU); x.fill();
    x.fillStyle = dik(x, 0, 30, 0, y0, [[0, renk(govde, 1.3)], [0.5, govde], [1, renk(govde, 0.55)]]);
    x.strokeStyle = "#0a0b0e"; x.lineWidth = 4;
    x.beginPath(); x.moveTo(14, y0); x.lineTo(10, y0 - 34); x.quadraticCurveTo(12, y0 - 48, 40, y0 - 50); x.lineTo(w * 0.3, y0 - 54); x.lineTo(w * 0.42, y0 - 92); x.lineTo(w * 0.72, y0 - 92); x.lineTo(w * 0.84, y0 - 54); x.lineTo(w - 22, y0 - 48); x.quadraticCurveTo(w - 8, y0 - 40, w - 10, y0 - 14); x.lineTo(w - 14, y0); x.closePath(); x.stroke(); x.fill();
    x.fillStyle = polis ? "#1c2a44" : "#10141c"; x.beginPath(); x.moveTo(w * 0.33, y0 - 56); x.lineTo(w * 0.44, y0 - 86); x.lineTo(w * 0.56, y0 - 86); x.lineTo(w * 0.56, y0 - 56); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(w * 0.59, y0 - 56); x.lineTo(w * 0.59, y0 - 86); x.lineTo(w * 0.7, y0 - 86); x.lineTo(w * 0.8, y0 - 56); x.closePath(); x.fill();
    x.strokeStyle = "rgba(200,220,255,.35)"; x.lineWidth = 1.2; x.beginPath(); x.moveTo(w * 0.46, y0 - 80); x.lineTo(w * 0.52, y0 - 64); x.lineTo(w * 0.5, y0 - 58); x.moveTo(w * 0.52, y0 - 64); x.lineTo(w * 0.55, y0 - 70); x.stroke();
    x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(w * 0.57, y0 - 54, 3, 44); x.fillRect(12, y0 - 28, w - 26, 3);
    if (polis) { x.fillStyle = "#e8ecf2"; x.fillRect(16, y0 - 26, w - 34, 14); x.fillStyle = "#1d3a8a"; x.fillRect(16, y0 - 26, w - 34, 4); x.fillStyle = "#1d3a8a"; x.font = FONT(700, 22); x.fillText("POLİS", w * 0.34, y0 - 30); x.fillStyle = "#0b0c10"; x.fillRect(w * 0.47, y0 - 100, 60, 8); x.fillStyle = "#c81e2a"; x.fillRect(w * 0.47, y0 - 100, 26, 7); x.fillStyle = "#2a56d8"; x.fillRect(w * 0.47 + 32, y0 - 100, 28, 7); }
    else { x.fillStyle = "rgba(0,0,0,.4)"; x.beginPath(); x.ellipse(w * 0.25, y0 - 30, 22, 9, 0.2, 0, TAU); x.fill(); x.strokeStyle = "rgba(0,0,0,.5)"; x.lineWidth = 2; x.beginPath(); x.moveTo(w * 0.18, y0 - 40); x.lineTo(w * 0.3, y0 - 22); x.stroke(); }
    x.fillStyle = "#ffd98a"; x.fillRect(w - 18, y0 - 40, 8, 8); x.fillStyle = "#7a1010"; x.fillRect(12, y0 - 40, 6, 9);
    [w * 0.2, w * 0.8].forEach((tx, i) => { x.fillStyle = "#0b0c0f"; x.beginPath(); x.arc(tx, y0 + (i ? 0 : 3), 21, 0, TAU); x.fill(); x.fillStyle = "#3b3f48"; x.beginPath(); x.arc(tx, y0 + (i ? 0 : 3), 10, 0, TAU); x.fill(); });
  }
  D.araba1 = (x, w, h) => araba(x, w, h, "#6a2f2f");
  D.araba2 = (x, w, h) => araba(x, w, h, "#2f4f63");
  D.polis = (x, w, h) => araba(x, w, h, "#d8dde6", true);
  D.ambulans = (x, w, h) => {
    const y0 = h - 24; x.fillStyle = "rgba(0,0,0,.4)"; x.beginPath(); x.ellipse(w / 2, h - 5, w * 0.48, 9, 0, 0, TAU); x.fill();
    x.save(); x.translate(w / 2, y0); x.rotate(-0.06); x.translate(-w / 2, -y0);
    x.strokeStyle = "#0a0b0e"; x.lineWidth = 4; x.fillStyle = dik(x, 0, 30, 0, y0, [[0, "#f3f2ee"], [1, "#9ea2a8"]]);
    x.beginPath(); x.moveTo(14, y0); x.lineTo(14, 36); x.lineTo(w * 0.7, 36); x.lineTo(w * 0.72, 60); x.lineTo(w - 46, 66); x.lineTo(w - 18, 108); x.lineTo(w - 14, y0); x.closePath(); x.stroke(); x.fill();
    x.fillStyle = "#c8432b"; x.fillRect(14, 96, w - 30, 14); x.fillStyle = "#f2c14e"; x.fillRect(14, 110, w - 30, 5);
    x.fillStyle = "#13161c"; x.beginPath(); x.moveTo(w * 0.73, 66); x.lineTo(w - 50, 70); x.lineTo(w - 26, 102); x.lineTo(w * 0.73, 102); x.closePath(); x.fill();
    x.fillStyle = "#c8432b"; x.font = FONT(700, 30); x.fillText("112 ACİL", 40, 82);
    x.fillStyle = "#0b0c10"; x.fillRect(30, 26, 70, 10); x.fillStyle = "#c8432b"; x.fillRect(30, 26, 32, 9); x.fillStyle = "#2a56d8"; x.fillRect(68, 26, 32, 9);
    x.strokeStyle = "rgba(0,0,0,.6)"; x.lineWidth = 3; x.beginPath(); x.moveTo(w - 40, 70); x.lineTo(w - 70, 120); x.lineTo(w - 40, 140); x.stroke();
    [w * 0.18, w * 0.8].forEach((tx) => { x.fillStyle = "#0b0c0f"; x.beginPath(); x.arc(tx, y0, 24, 0, TAU); x.fill(); x.fillStyle = "#3b3f48"; x.beginPath(); x.arc(tx, y0, 11, 0, TAU); x.fill(); });
    x.restore();
  };
  D.otobus = (x, w, h) => {
    const y0 = h - 24; x.fillStyle = "rgba(0,0,0,.45)"; x.beginPath(); x.ellipse(w / 2, h - 5, w * 0.49, 9, 0, 0, TAU); x.fill();
    x.strokeStyle = "#08090b"; x.lineWidth = 4; x.fillStyle = dik(x, 0, 20, 0, y0, [[0, "#3a3532"], [0.6, "#24201e"], [1, "#151312"]]); rr(x, 10, 24, w - 20, y0 - 24, 14); x.stroke(); x.fill();
    for (let i = 0; i < 7; i++) { const px = 30 + i * ((w - 60) / 7); const g = x.createLinearGradient(0, 40, 0, 110); g.addColorStop(0, "#1a0d08"); g.addColorStop(1, i % 3 === 1 ? "#a8431c" : "#2a120a"); x.fillStyle = g; x.fillRect(px, 44, (w - 60) / 7 - 10, 64); }
    x.fillStyle = "rgba(255,120,40,.18)"; x.fillRect(30, 44, w - 60, 64);
    x.fillStyle = "rgba(90,70,40,.55)"; x.fillRect(10, 122, w - 20, 8); x.fillStyle = "rgba(0,0,0,.45)"; for (let i = 0; i < 18; i++) { x.beginPath(); x.ellipse(20 + Math.random() * (w - 40), 30 + Math.random() * (y0 - 40), 10 + Math.random() * 30, 6 + Math.random() * 14, 0, 0, TAU); x.fill(); }
    [w * 0.15, w * 0.82].forEach((tx) => { x.fillStyle = "#08090b"; x.beginPath(); x.arc(tx, y0, 26, 0, TAU); x.fill(); x.fillStyle = "#2a2b2f"; x.beginPath(); x.arc(tx, y0, 10, 0, TAU); x.fill(); });
  };
  D.eczane = (x, w, h) => {
    x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#2c3248"], [1, "#1f2335"]]); x.fillRect(0, 0, w, h);
    for (let k = 0; k < 2; k++) for (let p = 0; p < 4; p++) { const px = 40 + p * 125, py = 30 + k * 105; x.fillStyle = p === 2 && k === 0 ? "rgba(255,190,110,.7)" : "#0b0e16"; x.fillRect(px, py, 60, 76); x.strokeStyle = "#171b27"; x.lineWidth = 5; x.strokeRect(px, py, 60, 76); }
    x.fillStyle = "#11141c"; x.fillRect(0, h - 210, w, 16);
    x.fillStyle = dik(x, 0, h - 195, 0, h - 135, [[0, "#f4f6f8"], [1, "#cfd4da"]]); x.fillRect(16, h - 196, w - 32, 58);
    x.fillStyle = "#d1202b"; x.fillRect(36, h - 190, 46, 46); x.fillStyle = "#fff"; x.font = FONT(700, 40); x.fillText("E", 46, h - 151);
    x.fillStyle = "#c01b26"; x.font = FONT(700, 38); x.fillText("ŞİFA ECZANESİ", 102, h - 151);
    x.fillStyle = "#0d1017"; x.fillRect(16, h - 134, w - 32, 134);
    x.fillStyle = "rgba(140,255,210,.12)"; x.fillRect(30, h - 124, w * 0.55, 108);
    x.strokeStyle = "#1a1f2b"; x.lineWidth = 6; x.strokeRect(30, h - 124, w * 0.55, 108);
    x.strokeStyle = "rgba(255,255,255,.35)"; x.lineWidth = 1.4; x.beginPath(); x.moveTo(80, h - 110); x.lineTo(130, h - 60); x.lineTo(100, h - 30); x.moveTo(130, h - 60); x.lineTo(190, h - 80); x.stroke();
    x.fillStyle = "rgba(30,40,40,.9)"; for (let i = 0; i < 4; i++) x.fillRect(44, h - 110 + i * 26, w * 0.5, 4);
    x.fillStyle = "#1e2531"; x.fillRect(w * 0.66, h - 128, 110, 128); x.fillStyle = "rgba(255,230,160,.2)"; x.fillRect(w * 0.66 + 8, h - 120, 94, 120);
    x.fillStyle = "#3a4152"; x.fillRect(w * 0.66 + 6, h - 70, 98, 4);
    x.fillStyle = "#e8e2d2"; x.font = FONT(500, 14); x.fillText("NÖBETÇİ", w * 0.66 + 22, h - 96);
  };
  D.metro = (x, w, h) => {
    x.fillStyle = "#151925"; x.fillRect(20, 60, w - 40, h - 60);
    x.fillStyle = dik(x, 0, h - 170, 0, h, [[0, "#ffb866"], [1, "#6a3814"]]); x.fillRect(80, h - 170, w - 160, 170);
    x.fillStyle = "rgba(0,0,0,.5)"; for (let i = 0; i < 9; i++) x.fillRect(80, h - 160 + i * 18, w - 160, 6);
    x.fillStyle = dik(x, 0, h - 230, 0, h - 170, [[0, "#565d6e"], [1, "#2e3340"]]); x.fillRect(80, h - 230, w - 160, 64);
    x.fillStyle = "rgba(0,0,0,.35)"; for (let t = h - 226; t < h - 168; t += 6) x.fillRect(80, t, w - 160, 2);
    x.fillStyle = "#222838"; x.fillRect(0, 40, w, 30); x.fillRect(20, 40, 24, h - 40); x.fillRect(w - 44, 40, 24, h - 40);
    x.fillStyle = "#c62828"; rr(x, w / 2 - 34, 0, 68, 50, 8); x.fill(); x.fillStyle = "#fff"; x.font = FONT(700, 40); x.textAlign = "center"; x.fillText("M", w / 2, 40);
    x.fillStyle = "#e8e2d2"; x.font = FONT(700, 22); x.fillText("YELKOVAN", w / 2, 64); x.textAlign = "left";
    x.strokeStyle = "#8a909c"; x.lineWidth = 4; x.beginPath(); x.moveTo(50, h - 120); x.lineTo(70, h); x.moveTo(w - 50, h - 120); x.lineTo(w - 70, h); x.stroke();
  };
  D.cop = (x, w, h) => { x.fillStyle = dik(x, 0, 10, 0, h, [[0, "#3e5a46"], [1, "#1d2a22"]]); x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; rr(x, 6, 18, w - 12, h - 26, 6); x.stroke(); x.fill(); x.fillStyle = "#26382c"; x.fillRect(2, 10, w - 4, 12); x.fillStyle = "rgba(0,0,0,.25)"; for (let i = 16; i < w - 12; i += 12) x.fillRect(i, 26, 3, h - 40); x.fillStyle = "#0b0c0f"; [20, w - 20].forEach((t) => { x.beginPath(); x.arc(t, h - 6, 6, 0, TAU); x.fill(); }); x.fillStyle = "#1a1a1a"; x.beginPath(); x.ellipse(w * 0.75, 12, 16, 10, 0, 0, TAU); x.fill(); };
  D.bariyer = (x, w, h) => { x.fillStyle = "#14161b"; x.fillRect(12, 20, 8, h - 20); x.fillRect(w - 20, 20, 8, h - 20); x.save(); rr(x, 4, 14, w - 8, 26, 4); x.clip(); x.fillStyle = "#e9e6df"; x.fillRect(0, 0, w, h); x.fillStyle = "#c8262e"; for (let i = -40; i < w; i += 36) { x.beginPath(); x.moveTo(i, 40); x.lineTo(i + 18, 40); x.lineTo(i + 44, 14); x.lineTo(i + 26, 14); x.fill(); } x.restore(); x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; rr(x, 4, 14, w - 8, 26, 4); x.stroke(); x.fillStyle = "#ffb000"; x.beginPath(); x.arc(w / 2, 9, 6, 0, TAU); x.fill(); };
  D.kopruKolon = (x, w, h) => { x.fillStyle = dik(x, 0, 0, w, 0, [[0, "#2d3242"], [0.4, "#3d4354"], [1, "#171a23"]]); x.fillRect(20, 0, w - 40, h); x.fillStyle = "#1c202b"; x.fillRect(6, 0, w - 12, 30); x.fillRect(10, h - 20, w - 20, 20); x.fillStyle = "rgba(0,0,0,.25)"; for (let i = 60; i < h; i += 70) x.fillRect(20, i, w - 40, 3); x.fillStyle = "rgba(200,60,60,.6)"; x.font = FONT(700, 20); x.save(); x.translate(w / 2 + 6, h * 0.6); x.rotate(-Math.PI / 2); x.fillText("KARANTİNA", -50, 0); x.restore(); };
  D.kopruTabla = (x, w, h) => { x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#2e3444"], [1, "#151821"]]); x.fillRect(0, 30, w, h - 30); x.fillStyle = "#1b1f29"; x.fillRect(0, 0, w, 8); x.fillRect(0, 22, w, 10); for (let i = 0; i < w; i += 32) x.fillRect(i, 0, 5, 30); x.fillStyle = "rgba(0,0,0,.4)"; x.fillRect(0, h - 14, w, 14); x.fillStyle = "rgba(255,170,90,.5)"; x.fillRect(w * 0.3, 44, 10, 6); };
  D.konteyner = (x, w, h, c) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = dik(x, 0, 0, 0, h, [[0, renk(c, 1.15)], [1, renk(c, 0.62)]]); x.fillRect(2, 2, w - 4, h - 4); x.strokeRect(2, 2, w - 4, h - 4); x.fillStyle = "rgba(0,0,0,.22)"; for (let i = 10; i < w - 6; i += 10) x.fillRect(i, 8, 4, h - 16); x.fillStyle = "rgba(0,0,0,.4)"; x.fillRect(2, 2, w - 4, 6); x.fillRect(2, h - 8, w - 4, 6); x.fillStyle = "rgba(255,255,255,.55)"; x.font = FONT(700, 18); x.fillText(["DJTU 410", "ESKİ LİMAN", "KRGN 7721", "MRSN 330"][(c.length * 7 + w) % 4], 20, 32); };
  D.kulube = (x, w, h) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = dik(x, 0, 30, 0, h, [[0, "#d8d4c8"], [1, "#8d8a84"]]); x.fillRect(10, 40, w - 20, h - 40); x.strokeRect(10, 40, w - 20, h - 40); x.fillStyle = "#2b3a52"; x.fillRect(0, 22, w, 22); x.fillStyle = "#ffe9b0"; x.fillRect(30, 70, w - 90, 60); x.fillStyle = "rgba(0,0,0,.4)"; x.fillRect(30 + (w - 90) / 2, 70, 3, 60); x.fillStyle = "#3a3d44"; x.fillRect(w - 52, 80, 34, h - 80); x.fillStyle = "#f2f2f2"; x.font = FONT(700, 14); x.fillText("LİMAN GÜVENLİK", 18, 38); x.fillStyle = "#c8262e"; x.fillRect(10, h - 30, w - 20, 8); };
  D.forklift = (x, w, h) => { const y0 = h - 20; x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = dik(x, 0, 40, 0, y0, [[0, "#f0b429"], [1, "#a8700c"]]); x.beginPath(); x.moveTo(30, y0); x.lineTo(30, 70); x.lineTo(110, 70); x.lineTo(150, 110); x.lineTo(150, y0); x.closePath(); x.stroke(); x.fill(); x.strokeStyle = "#1a1a1a"; x.lineWidth = 5; x.strokeRect(50, 20, 70, 52); x.fillStyle = "#222"; x.fillRect(160, 10, 8, y0 - 10); x.fillRect(160, y0 - 8, 54, 6); [60, 130].forEach((t) => { x.fillStyle = "#0b0c0f"; x.beginPath(); x.arc(t, y0, 18, 0, TAU); x.fill(); x.fillStyle = "#444"; x.beginPath(); x.arc(t, y0, 7, 0, TAU); x.fill(); }); };
  D.jenerator = (x, w, h) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = dik(x, 0, 20, 0, h, [[0, "#5d7a3a"], [1, "#2f3f1d"]]); x.fillRect(8, 24, w - 16, h - 30); x.strokeRect(8, 24, w - 16, h - 30); x.fillStyle = "rgba(0,0,0,.35)"; for (let i = 0; i < 6; i++) x.fillRect(20, 40 + i * 9, 60, 4); x.fillStyle = "#1a1a1a"; x.fillRect(w - 40, 0, 12, 26); x.fillStyle = "#e9d14a"; x.fillRect(w - 60, 44, 30, 18); x.fillStyle = "#111"; x.font = FONT(700, 12); x.fillText("⚡", w - 52, 58); };
  D.kapi = (x, w, h, acik) => {
    x.fillStyle = "#2a2632"; x.fillRect(0, 30, 26, h - 30); x.fillRect(w - 26, 30, 26, h - 30); x.fillStyle = "#3a3542"; x.fillRect(0, 20, w, 18);
    x.fillStyle = "#e0b52a"; x.fillRect(w / 2 - 70, 0, 140, 30); x.fillStyle = "#1a1620"; x.font = FONT(700, 22); x.textAlign = "center"; x.fillText("İSKELE", w / 2, 23); x.textAlign = "left";
    if (!acik) { x.strokeStyle = "#5e5866"; x.lineWidth = 2; x.save(); x.beginPath(); x.rect(26, 38, w - 52, h - 38); x.clip(); for (let i = -h; i < w + h; i += 14) { x.beginPath(); x.moveTo(i, 38); x.lineTo(i + h, h + 38); x.moveTo(i + h, 38); x.lineTo(i, h + 38); x.stroke(); } x.restore(); x.fillStyle = "#4b4553"; x.fillRect(26, 38, w - 52, 8); x.fillRect(26, h - 10, w - 52, 10); x.fillRect(w / 2 - 4, 38, 8, h - 38); x.fillStyle = "#c9a227"; x.fillRect(w / 2 - 12, h * 0.55, 24, 20); }
    else { x.strokeStyle = "#5e5866"; x.lineWidth = 2; x.save(); x.beginPath(); x.rect(w - 60, 38, 34, h - 38); x.clip(); for (let i = -h; i < w + h; i += 14) { x.beginPath(); x.moveTo(i, 38); x.lineTo(i + h, h + 38); x.moveTo(i + h, 38); x.lineTo(i, h + 38); x.stroke(); } x.restore(); }
  };
  D.depo = (x, w, h) => { x.fillStyle = dik(x, 0, 40, 0, h, [[0, "#5a4e62"], [1, "#352e3d"]]); x.fillRect(0, 40, w, h - 40); x.fillStyle = "rgba(0,0,0,.2)"; for (let i = 0; i < w; i += 12) x.fillRect(i, 40, 4, h - 40); x.fillStyle = "#2a2430"; x.beginPath(); x.moveTo(-10, 44); x.lineTo(w / 2, 0); x.lineTo(w + 10, 44); x.fill(); x.fillStyle = "#1a1620"; x.fillRect(w * 0.3, h - 220, w * 0.4, 220); x.fillStyle = "rgba(255,170,90,.2)"; x.fillRect(w * 0.3, h - 40, w * 0.4, 40); x.fillStyle = "#e3c873"; x.fillRect(30, 70, 150, 44); x.fillStyle = "#2a2230"; x.font = FONT(700, 32); x.fillText("DEPO 7", 44, 104); };
  D.tekne = (x, w, h) => {
    x.strokeStyle = "#0a0b0e"; x.lineWidth = 4;
    x.fillStyle = "#26303c"; x.fillRect(w * 0.55, 20, 6, 120); x.beginPath(); x.moveTo(w * 0.55 + 3, 20); x.lineTo(w * 0.85, 120); x.strokeStyle = "rgba(20,20,30,.6)"; x.lineWidth = 1.5; x.stroke(); x.strokeStyle = "#0a0b0e"; x.lineWidth = 4;
    x.fillStyle = dik(x, 0, 100, 0, 170, [[0, "#f2efe8"], [1, "#b8b6b0"]]); x.beginPath(); x.moveTo(w * 0.3, 170); x.lineTo(w * 0.32, 100); x.lineTo(w * 0.62, 100); x.lineTo(w * 0.66, 170); x.closePath(); x.stroke(); x.fill();
    x.fillStyle = "#1b2a38"; for (let i = 0; i < 4; i++) x.fillRect(w * 0.34 + i * 50, 114, 36, 24); x.fillStyle = "rgba(255,220,150,.6)"; x.fillRect(w * 0.34 + 50, 114, 36, 24);
    x.fillStyle = dik(x, 0, 160, 0, h, [[0, "#f0eee8"], [0.55, "#c9c6be"], [0.56, "#1f6f78"], [1, "#0f3a40"]]);
    x.beginPath(); x.moveTo(10, 160); x.lineTo(w - 6, 150); x.quadraticCurveTo(w - 30, h - 20, w - 90, h - 6); x.lineTo(70, h - 6); x.quadraticCurveTo(30, h - 40, 10, 160); x.closePath(); x.stroke(); x.fill();
    x.fillStyle = "#c8262e"; x.fillRect(16, 196, w - 60, 8);
    x.fillStyle = "#16303a"; x.font = FONT(700, 54); x.fillText("UMUT", w * 0.6, 248);
    x.fillStyle = "#0a0b0e"; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(110 + i * 48, 222, 7, 0, TAU); x.fill(); }
    x.fillStyle = "#e33"; x.beginPath(); x.arc(w * 0.55 + 3, 20, 5, 0, TAU); x.fill();
  };
  D.denizPerde = (x, w, h) => { x.fillStyle = dik(x, 0, 0, 0, h, [[0, "rgba(201,130,121,0)"], [0.25, "#a6707f"], [1, "#3c3558"]]); x.fillRect(0, 0, w, h); const r = A.rng(12); for (let i = 0; i < 120; i++) { const y = h * 0.3 + r() * h * 0.7; x.fillStyle = "rgba(255,210,170," + (0.1 + r() * 0.25) + ")"; x.fillRect(r() * w, y, 10 + r() * 40, 1.5); } const g = x.createLinearGradient(0, 0, 120, 0); g.addColorStop(0, "rgba(60,50,80,1)"); g.addColorStop(1, "rgba(60,50,80,0)"); x.fillStyle = g; x.fillRect(0, h * 0.2, 120, h); };
  D.vinc = (x, w, h) => { vincCiz(x, 120, h, h - 60, "#c9861c", 1.4); x.globalCompositeOperation = "source-atop"; x.fillStyle = "rgba(60,30,40,.35)"; x.fillRect(0, 0, w, h); x.globalCompositeOperation = "source-over"; };
  D.varil = (x, w, h) => { [[w * 0.3, 0], [w * 0.7, 0]].forEach(([vx]) => { x.save(); x.translate(vx, h - 30); A.varilCiz(x, 15); x.restore(); }); };
  D.kasa = (x, w, h) => { x.strokeStyle = "#0a0b0e"; x.lineWidth = 3; x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#9c7646"], [1, "#5b4126"]]); x.fillRect(3, 3, w - 6, h - 6); x.strokeRect(3, 3, w - 6, h - 6); x.strokeStyle = "rgba(40,25,10,.8)"; x.lineWidth = 4; x.beginPath(); x.moveTo(6, 6); x.lineTo(w - 6, h - 6); x.moveTo(w - 6, 6); x.lineTo(6, h - 6); x.stroke(); x.strokeRect(10, 10, w - 20, h - 20); };
  D.babalik = (x, w, h) => { x.fillStyle = "#1e1a24"; x.fillRect(w / 2 - 14, 14, 28, h - 14); x.fillRect(w / 2 - 20, 6, 40, 12); x.fillStyle = "rgba(255,255,255,.08)"; x.fillRect(w / 2 - 12, 18, 6, h - 20); };
  D.cop2 = (x, w, h) => { x.fillStyle = "#0e1014"; for (let i = 0; i < 4; i++) { x.beginPath(); x.ellipse(20 + i * 22, h - 16, 18, 16, 0, 0, TAU); x.fill(); } x.fillStyle = "rgba(255,255,255,.06)"; x.fillRect(16, h - 26, 10, 4); };
  D.yangin = (x, w, h) => { x.fillStyle = "#8a1f1f"; rr(x, w / 2 - 9, 14, 18, h - 14, 5); x.fill(); x.fillRect(w / 2 - 14, 22, 28, 7); x.fillStyle = "rgba(255,255,255,.2)"; x.fillRect(w / 2 - 6, 16, 4, h - 18); };

  A.DEKOR_BOYUT = {
    lamba: [110, 430, D.lamba], limanLamba: [60, 380, D.limanLamba], araba1: [300, 140, D.araba1], araba2: [300, 140, D.araba2], polis: [320, 150, D.polis], ambulans: [400, 190, D.ambulans],
    otobus: [580, 220, D.otobus], eczane: [560, 440, D.eczane], metro: [470, 400, D.metro], cop: [130, 100, D.cop], bariyer: [180, 70, D.bariyer], kopruKolon: [140, 600, D.kopruKolon],
    kopruTabla: [512, 130, D.kopruTabla], kulube: [220, 230, D.kulube], forklift: [220, 170, D.forklift], jenerator: [150, 120, D.jenerator], kapi: [260, 380, (x, w, h) => D.kapi(x, w, h, false)], kapiAcik: [260, 380, (x, w, h) => D.kapi(x, w, h, true)],
    depo: [720, 380, D.depo], tekne: [780, 330, D.tekne], denizPerde: [1600, 300, D.denizPerde], vinc: [540, 640, D.vinc], varil: [80, 66, D.varil], kasa: [80, 80, D.kasa], babalik: [50, 50, D.babalik], copTorba: [110, 50, D.cop2], yangin: [40, 60, D.yangin],
    konteyner1: [300, 130, (x, w, h) => D.konteyner(x, w, h, "#a8382e")], konteyner2: [300, 130, (x, w, h) => D.konteyner(x, w, h, "#2f5f8f")], konteyner3: [300, 130, (x, w, h) => D.konteyner(x, w, h, "#3d7a5a")], konteyner4: [300, 130, (x, w, h) => D.konteyner(x, w, h, "#c98a28")]
  };

  /* ================= HİKÂYE SAHNESİ: sığınak ================= */
  function siginak(x, w, h) {
    x.fillStyle = dik(x, 0, 0, 0, h, [[0, "#120e0c"], [0.5, "#2a1c14"], [1, "#0d0a08"]]); x.fillRect(0, 0, w, h);
    x.fillStyle = "#3a2c22"; for (let yy = 80; yy < h * 0.7; yy += 36) for (let xx = (yy / 36) % 2 ? 0 : 30; xx < w; xx += 60) { x.fillStyle = "rgba(210,190,160," + (0.06 + Math.random() * 0.05) + ")"; x.fillRect(xx, yy, 56, 32); }
    x.fillStyle = "#c62828"; rr(x, w * 0.42, 110, 220, 54, 8); x.fill(); x.fillStyle = "#f4efe6"; x.font = FONT(700, 36); x.fillText("YELKOVAN", w * 0.42 + 26, 150);
    x.fillStyle = "#0b0908"; x.fillRect(0, h * 0.7, w, h * 0.3); x.fillStyle = "#1a1410"; x.fillRect(0, h * 0.7, w, 14);
    [[w * 0.18, 0.9], [w * 0.5, 1.2], [w * 0.8, 1]].forEach(([lx, s]) => { const g = x.createRadialGradient(lx, h * 0.62, 4, lx, h * 0.62, 300 * s); g.addColorStop(0, "rgba(255,180,90,.55)"); g.addColorStop(1, "rgba(255,150,70,0)"); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = "#ffd28a"; x.fillRect(lx - 6, h * 0.62 - 12, 12, 16); x.fillStyle = "#2a1c12"; x.fillRect(lx - 8, h * 0.62 + 4, 16, 6); });
    const r = A.rng(99);
    for (let i = 0; i < 26; i++) { const px = r() * w, s = 0.7 + r() * 0.6, oturan = r() < 0.6, y0 = h * 0.72 + r() * 40; x.fillStyle = "#070505"; if (oturan) { x.beginPath(); x.ellipse(px, y0 - 20 * s, 22 * s, 26 * s, 0, 0, TAU); x.fill(); x.beginPath(); x.arc(px + 4 * s, y0 - 54 * s, 11 * s, 0, TAU); x.fill(); } else { x.fillRect(px - 10 * s, y0 - 90 * s, 20 * s, 90 * s); x.beginPath(); x.arc(px, y0 - 102 * s, 12 * s, 0, TAU); x.fill(); } }
    const v = x.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.7); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.8)"); x.fillStyle = v; x.fillRect(0, 0, w, h);
  }

  /* ================= ÜRETİM ================= */
  A.dunyaUret = function (scene, tema) {
    if (tema === "gece") {
      ekle(scene, "gece_gok", 1024, 720, geceGok); ekle(scene, "gece_uzak", 2048, 420, geceUzak); ekle(scene, "gece_orta", 2048, 470, geceOrta);
      ekle(scene, "gece_yakin", 2048, 330, geceYakin); ekle(scene, "gece_zemin", 512, 150, geceZemin); ekle(scene, "gece_on", 2048, 240, geceOn);
    } else {
      ekle(scene, "safak_gok", 1024, 720, safakGok); ekle(scene, "safak_uzak", 2048, 220, safakUzak); ekle(scene, "safak_orta", 2048, 430, safakOrta);
      ekle(scene, "safak_yakin", 2048, 360, safakYakin); ekle(scene, "safak_zemin", 512, 150, safakZemin); ekle(scene, "safak_on", 2048, 200, safakOn); ekle(scene, "safak_su", 512, 80, su);
    }
  };
  A.ortakUret = function (scene) { ekle(scene, "sis", 1024, 300, sis); ekle(scene, "sahne_siginak", 1280, 720, siginak); };
  A.dekorUret = function (scene) { Object.keys(A.DEKOR_BOYUT).forEach((k) => { const [w, h, fn] = A.DEKOR_BOYUT[k]; ekle(scene, "d_" + k, w, h, fn); }); };
})();
