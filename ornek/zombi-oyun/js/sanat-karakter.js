/* SANAT 1/3 — KARAKTERLER
   Tüm karakterler bir "iskelet" (kalça, gövde, baş, IK ile kol/bacak) üzerinden kare kare çizilip sprite sheet'e dökülür.
   Böylece tek bir stil tanımıyla yürüme/koşma/ateş/şarjör/hasar/ölüm kareleri tutarlı üretilir.
   Müşteri kendi sprite sheet'ini verirse (config.js > hariciGorseller) bu üretim o karakter için atlanır. */
(function () {
  const SV = (window.SV = window.SV || {});
  const A = (SV.Sanat = SV.Sanat || {});
  const TAU = Math.PI * 2, PI = Math.PI;
  const CIZGI = "#0a0b0e";

  /* ---------- yardımcılar ---------- */
  A.rng = function (seed) {
    return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  A.tuval = function (w, h) { const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
  A.renk = function (hex, k) {
    const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (k < 1) { r *= k; g *= k; b *= k; } else { const f = k - 1; r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  };
  A.karistir = function (h1, h2, t) {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const r = ((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t, g = ((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t, bl = (a & 255) * (1 - t) + (b & 255) * t;
    return "#" + ((1 << 24) | ((r | 0) << 16) | ((g | 0) << 8) | (bl | 0)).toString(16).slice(1);
  };
  const renk = A.renk;
  const lerp = (a, b, t) => a + (b - a) * t;
  const kolay = (t) => t * t * (3 - 2 * t);

  function uzuvYol(x1, y1, x2, y2, w1, w2) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 0.001, nx = -dy / L, ny = dx / L, a = Math.atan2(dy, dx);
    const p = new Path2D();
    p.moveTo(x1 + (nx * w1) / 2, y1 + (ny * w1) / 2);
    p.lineTo(x2 + (nx * w2) / 2, y2 + (ny * w2) / 2);
    p.arc(x2, y2, w2 / 2, a + PI / 2, a - PI / 2, true);
    p.lineTo(x1 - (nx * w1) / 2, y1 - (ny * w1) / 2);
    p.arc(x1, y1, w1 / 2, a - PI / 2, a + PI / 2, true);
    p.closePath();
    return p;
  }
  function elipsYol(x, y, rx, ry, rot = 0) { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, TAU); return p; }
  /* silindir gölgesi: ışık sol üstten */
  function silindirBoya(ctx, yol, x1, y1, x2, y2, w, hex, parlak = 1.22, koyu = 0.5) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 0.001; let nx = -dy / L, ny = dx / L;
    if (nx * -0.45 + ny * -0.89 < 0) { nx = -nx; ny = -ny; }
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    const g = ctx.createLinearGradient(cx + (nx * w) / 2, cy + (ny * w) / 2, cx - (nx * w) / 2, cy - (ny * w) / 2);
    g.addColorStop(0, renk(hex, parlak)); g.addColorStop(0.42, hex); g.addColorStop(1, renk(hex, koyu));
    ctx.fillStyle = g; ctx.fill(yol);
  }
  function ik(sx, sy, tx, ty, L1, L2, yon) {
    const dx = tx - sx, dy = ty - sy; let d = Math.hypot(dx, dy); d = Math.max(0.001, Math.min(d, L1 + L2 - 0.01));
    const a = Math.atan2(dy, dx), c = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))), b = Math.acos(c);
    const ex = sx + Math.cos(a + yon * b) * L1, ey = sy + Math.sin(a + yon * b) * L1;
    const ux = tx - ex, uy = ty - ey, ul = Math.hypot(ux, uy) || 0.001;
    return { ex, ey, hx: ex + (ux / ul) * L2, hy: ey + (uy / ul) * L2 };
  }
  A.uzuvYol = uzuvYol; A.elipsYol = elipsYol; A.silindirBoya = silindirBoya;

  /* ---------- SİLAHLAR (tutamak = (0,0), namlu +x) ---------- */
  const SILAH_GEO = {
    tabanca: { tutamak2: { x: -1, y: 2 }, namlu: { x: 18, y: -6.5 } },
    pompali: { tutamak2: { x: 23, y: -0.5 }, namlu: { x: 54, y: -6.8 } },
    tufek: { tutamak2: { x: 20, y: -1.5 }, namlu: { x: 53, y: -5.6 } }
  };
  A.SILAH_GEO = SILAH_GEO;
  function sekil(ctx, nokta, dolgu, cizgi = CIZGI, lw = 1.6) {
    const p = new Path2D(); p.moveTo(nokta[0], nokta[1]); for (let i = 2; i < nokta.length; i += 2) p.lineTo(nokta[i], nokta[i + 1]); p.closePath();
    if (cizgi) { ctx.lineWidth = lw * 2; ctx.strokeStyle = cizgi; ctx.lineJoin = "round"; ctx.stroke(p); }
    ctx.fillStyle = dolgu; ctx.fill(p); return p;
  }
  function kutu(ctx, x1, y1, x2, y2, dolgu, cz) { return sekil(ctx, [x1, y1, x2, y1, x2, y2, x1, y2], dolgu, cz); }
  function metalG(ctx, y1, y2, hex) { const g = ctx.createLinearGradient(0, y1, 0, y2); g.addColorStop(0, renk(hex, 1.6)); g.addColorStop(0.35, hex); g.addColorStop(1, renk(hex, 0.55)); return g; }

  A.silahCiz = function (ctx, tur, duz) {
    const M = duz || null, met = (y1, y2, h) => M || metalG(ctx, y1, y2, h), cz = M ? null : CIZGI;
    if (tur === "tabanca") {
      sekil(ctx, [-3, -4, 2, -4, 0.8, 6.5, -4.8, 5.8], M || "#1b1d21", cz);
      kutu(ctx, -3, -4.5, 14.5, -1.4, met(-4.5, -1.4, "#2a2e33"), cz);
      kutu(ctx, -4.5, -9.5, 18, -4.5, met(-9.5, -4.5, "#33383f"), cz);
      if (!M) { ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(-3, -9, 19, 1.1); ctx.fillStyle = "#0e0f12"; for (let i = 0; i < 4; i++) ctx.fillRect(-3 + i * 1.6, -8.6, 0.7, 3.2); }
      ctx.lineWidth = 1.4; ctx.strokeStyle = M || "#15171a"; ctx.beginPath(); ctx.arc(4.5, -1.5, 2.6, 0, PI); ctx.stroke();
    } else if (tur === "pompali") {
      sekil(ctx, [-31, -3.5, -6, -6.5, -4, -0.8, -27, 4.8, -31.5, 4], M || "#5b3a22", cz);
      if (!M) { ctx.fillStyle = "rgba(255,220,180,.15)"; ctx.fillRect(-28, -3.6, 20, 1.2); }
      kutu(ctx, 9, -8.4, 53, -5.6, met(-8.4, -5.6, "#2b2f35"), cz);
      kutu(ctx, 8, -5.6, 45, -2.6, met(-5.6, -2.6, "#24272c"), cz);
      kutu(ctx, -6.5, -9, 11, -0.8, met(-9, -0.8, "#30353b"), cz);
      sekil(ctx, [21, -6.4, 36, -6.4, 37, -1, 21, -0.4], M || "#3a2718", cz);
      if (!M) { ctx.fillStyle = "#24170e"; for (let i = 0; i < 5; i++) ctx.fillRect(23 + i * 2.6, -5.8, 1, 4.6); ctx.fillStyle = "#c9a227"; ctx.fillRect(2, -7.5, 4, 2.4); }
      sekil(ctx, [-4.5, -1, 1.5, -1, 0, 5.5, -5.5, 5], M || "#4a2f1c", cz);
    } else if (tur === "tufek") {
      sekil(ctx, [-31, -6.5, -8, -7.5, -8, -1, -28, 3.5, -31.5, 2.5], M || "#202327", cz);
      sekil(ctx, [2, -1.5, 9.5, -1.5, 13, 9, 5.5, 10.5], M || "#2c3036", cz);
      sekil(ctx, [-5.5, -1.2, 0, -1.2, -2, 7.5, -6.5, 6.5], M || "#1a1c1f", cz);
      kutu(ctx, -8.5, -9.5, 15, -1.2, met(-9.5, -1.2, "#31363c"), cz);
      kutu(ctx, -4, -12, 9, -9.5, M || "#1d1f23", cz);
      kutu(ctx, 15, -9, 33, -2, met(-9, -2, "#2a2d32"), cz);
      kutu(ctx, 33, -6.8, 49, -4.6, met(-6.8, -4.6, "#25282c"), cz);
      kutu(ctx, 48, -8, 54, -3.6, M || "#1c1e21", cz);
      kutu(ctx, 20, -2, 28, 1.6, M || "#1e2024", cz);
      if (!M) {
        ctx.fillStyle = "#0e0f11"; for (let i = 0; i < 4; i++) ctx.fillRect(17 + i * 4, -7, 2, 3);
        const g = ctx.createRadialGradient(28.5, -0.2, 0, 28.5, -0.2, 3); g.addColorStop(0, "#fffbe0"); g.addColorStop(1, "#c8b46a"); ctx.fillStyle = g; ctx.fillRect(27.6, -1.8, 1.4, 3.2);
        ctx.fillStyle = "rgba(255,255,255,.16)"; ctx.fillRect(-8, -9.2, 22, 1.1);
      }
    }
  };

  function satirCiz(ctx) { // kasap satırı, tutamak (0,0), bıçak +x yönünde
    sekil(ctx, [-2, -2.2, 12, -2.6, 12, 2.6, -2, 2.2], "#3b2416");
    const p = sekil(ctx, [11, -9, 44, -11, 46, 8, 11, 6], "#8b9097");
    ctx.save(); ctx.clip(p);
    const g = ctx.createLinearGradient(0, -11, 0, 8); g.addColorStop(0, "#d6dade"); g.addColorStop(0.5, "#7d838a"); g.addColorStop(1, "#4b5056"); ctx.fillStyle = g; ctx.fillRect(10, -12, 40, 22);
    ctx.fillStyle = "rgba(110,10,14,.85)"; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(20 + i * 4.5, 3 + (i % 2) * 2, 4, 3, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#121314"; ctx.beginPath(); ctx.arc(39, -5, 2.2, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function varilCiz(ctx, r = 14) {
    const p = sekil(ctx, [-r, -r * 1.25, r, -r * 1.25, r, r * 1.25, -r, r * 1.25], "#7a2b1c");
    ctx.save(); ctx.clip(p); const g = ctx.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, "#3c140c"); g.addColorStop(0.35, "#b9482c"); g.addColorStop(1, "#40150c");
    ctx.fillStyle = g; ctx.fillRect(-r, -r * 1.3, r * 2, r * 2.6); ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(-r, -r * 0.45, r * 2, 2.2); ctx.fillRect(-r, r * 0.45, r * 2, 2.2);
    ctx.fillStyle = "#e8c23a"; ctx.fillRect(-r * 0.6, -r * 0.2, r * 1.2, r * 0.45); ctx.restore();
  }
  A.varilCiz = varilCiz;

  /* ---------- İSKELET ---------- */
  const K = { uyluk: 31, baldir: 30, govde: 44, boyun: 4, basR: 11.5, kolUst: 23, kolAlt: 22 };

  /* Kişiye özel ama karelerde sabit kalan detaylar (leke, yırtık) bir kez üretilir */
  function detayUret(S) {
    const r = A.rng(S.tohum || 7), d = { lekeler: [], yirtik: [], ten: [] };
    for (let i = 0; i < (S.leke || 0); i++) d.lekeler.push({ f: r() * 0.9 + 0.05, o: r() * 2 - 1, b: 3 + r() * 6 });
    for (let i = 0; i < (S.yirtikSay || 0); i++) d.yirtik.push({ f: r() * 0.8 + 0.1, o: r() * 1.6 - 0.8, b: 2.5 + r() * 4, n: 5 + ((r() * 3) | 0), t: r() * 10 });
    for (let i = 0; i < 6; i++) d.ten.push({ x: r() * 16 - 8, y: r() * 16 - 9, b: 1.5 + r() * 3 });
    return d;
  }

  function basCiz(ctx, S, P, mod) { // baş yerel koordinatı: merkez (0,0), yüz +x yönünde
    const ten = S.ten, koyuTen = renk(ten, 0.72);
    if (mod === "arka") { // uzun saç (başın arkasına sarkan)
      if (S.sacTip === "uzun") {
        const p = new Path2D(); p.moveTo(-4, -12); p.quadraticCurveTo(-16, -6, -15, 10); p.quadraticCurveTo(-14, 22, -6, 26); p.lineTo(-2, 14); p.quadraticCurveTo(-4, 2, 2, -6); p.closePath();
        return [{ yol: p, boya: (c) => { const g = c.createLinearGradient(-15, -10, 0, 26); g.addColorStop(0, renk(S.sac, 1.3)); g.addColorStop(1, renk(S.sac, 0.6)); c.fillStyle = g; c.fill(p); } }];
      }
      return [];
    }
    const kafa = new Path2D(); kafa.ellipse(0, 0, 10.6, 12, 0, 0, TAU); kafa.ellipse(3.6, 5.8, 7.8, 6.2, 0.2, 0, TAU);
    const parcalar = [{ yol: kafa, boya: (c) => {
      const g = c.createRadialGradient(-3, -5, 1, 1, 1, 16); g.addColorStop(0, renk(ten, 1.18)); g.addColorStop(0.55, ten); g.addColorStop(1, renk(ten, 0.55)); c.fillStyle = g; c.fill(kafa);
      c.save(); c.clip(kafa);
      if (S.zombi) { S._d.ten.forEach((t) => { c.fillStyle = "rgba(40,48,30,.28)"; c.beginPath(); c.arc(t.x, t.y, t.b, 0, TAU); c.fill(); }); c.strokeStyle = "rgba(70,30,60,.35)"; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-6, -8); c.quadraticCurveTo(-1, -4, -3, 2); c.stroke(); }
      // kulak
      c.fillStyle = koyuTen; c.beginPath(); c.ellipse(-1.5, 0.5, 2.6, 3.6, 0, 0, TAU); c.fill();
      c.strokeStyle = renk(ten, 0.5); c.lineWidth = 0.8; c.beginPath(); c.arc(-1.4, 0.6, 1.5, -1.2, 1.4); c.stroke();
      // saç
      if (S.sacTip === "kisa" || S.sacTip === "uzun" || S.sacTip === "seyrek") {
        const h = new Path2D(); h.moveTo(-14, 7); h.lineTo(-14, -16); h.lineTo(14, -16); h.lineTo(11.5, -6.5); h.quadraticCurveTo(4, -9.5, -1.5, -6.5); h.quadraticCurveTo(-4, -1, -5.5, 5); h.closePath();
        const g2 = c.createLinearGradient(0, -13, 0, 4); g2.addColorStop(0, renk(S.sac, 1.35)); g2.addColorStop(1, renk(S.sac, 0.7)); c.fillStyle = g2;
        if (S.sacTip === "seyrek") c.globalAlpha = 0.75; c.fill(h); c.globalAlpha = 1;
        if (S.sacTip === "seyrek") { c.fillStyle = renk(ten, 0.85); c.beginPath(); c.ellipse(2, -10, 5, 3, 0, 0, TAU); c.fill(); }
      }
      if (S.sakal) { c.fillStyle = "rgba(25,18,14,.45)"; c.beginPath(); c.ellipse(5, 7.5, 7.5, 4.6, 0.25, 0, TAU); c.fill(); }
      if (S.dikis) { c.strokeStyle = "#2a1414"; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-8, -6); c.quadraticCurveTo(0, -13, 8, -8); c.stroke(); for (let i = 0; i < 6; i++) { const x = -7 + i * 3, y = -8.5 - Math.sin((i / 5) * PI) * 2.5; c.beginPath(); c.moveTo(x - 1, y - 1.5); c.lineTo(x + 1, y + 1.5); c.stroke(); } }
      // burun
      c.fillStyle = renk(ten, 0.8); c.beginPath(); c.moveTo(10, -2); c.lineTo(13.4, 2.6); c.lineTo(9.8, 3.4); c.closePath(); c.fill();
      // göz
      if (S.zombi) {
        c.fillStyle = "#1e120c"; c.beginPath(); c.ellipse(6.4, -2, 3.1, 2.4, 0.1, 0, TAU); c.fill();
        const gp = P.gozParla || 0; c.save(); c.shadowColor = S.gozRenk; c.shadowBlur = 5 + gp * 6; c.fillStyle = S.gozRenk; c.beginPath(); c.arc(7.2, -2, 1.35 + gp * 0.5, 0, TAU); c.fill(); c.restore();
        c.strokeStyle = "rgba(0,0,0,.6)"; c.lineWidth = 1.1; c.beginPath(); c.moveTo(3.5, -5.4); c.lineTo(9.5, -4.2); c.stroke();
      } else {
        c.fillStyle = "#f3eee6"; c.beginPath(); c.ellipse(6.6, -2.2, 2.3, 1.6, 0, 0, TAU); c.fill();
        c.fillStyle = "#2a1c12"; c.beginPath(); c.arc(7.6, -2.1, 1.1, 0, TAU); c.fill();
        c.strokeStyle = renk(S.sac, 0.8); c.lineWidth = 1.5; c.beginPath(); c.moveTo(3.6, -5.6); c.lineTo(9.6, -4.6); c.stroke();
      }
      // ağız
      const ag = P.agiz || 0;
      if (S.zombi && ag > 0.05) {
        c.fillStyle = "#2a0606"; c.beginPath(); c.moveTo(5, 6.5); c.quadraticCurveTo(9, 6 + ag * 5, 12.5, 6.5 + ag); c.quadraticCurveTo(9, 5, 5, 6.5); c.fill();
        c.fillStyle = "#d8cfb0"; for (let i = 0; i < 3; i++) c.fillRect(7 + i * 1.8, 6, 1, 1.4);
      } else { c.strokeStyle = renk(ten, 0.45); c.lineWidth = 1; c.beginPath(); c.moveTo(7, 7); c.lineTo(11.5, 6.6); c.stroke(); }
      if (S.agizKan) { c.fillStyle = "rgba(120,8,12,.85)"; c.beginPath(); c.moveTo(7, 7); c.quadraticCurveTo(10, 10, 9, 14); c.quadraticCurveTo(7.5, 10, 6, 8); c.fill(); }
      c.restore();
    } }];
    if (S.bere) parcalar.push({ yol: (() => { const p = new Path2D(); p.moveTo(-11, -2); p.quadraticCurveTo(-11, -15, 1, -14); p.quadraticCurveTo(11, -13, 10.5, -5); p.lineTo(-11, -2); p.closePath(); return p; })(), boya: (c, y) => { c.fillStyle = S.bere; c.fill(y); c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(-12, -5, 24, 3); } });
    return parcalar;
  }

  /* Ana çizim: hx = kalça x, zy = zemin y (tuval pikseli). P = poz, S = stil */
  A.insanCiz = function (ctx, hx, zy, P, S) {
    if (!S._d) S._d = detayUret(S);
    const s = S.s, gen = S.gen || 1, kk = S.kolKalin || 1, cz = S.cizgi || 2.1;
    ctx.save();
    ctx.translate(hx + (P.dx || 0) * s, zy - P.kalca * s);
    if (P.donus) ctx.rotate(P.donus);
    ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    const g = P.govde || 0, sg = Math.sin(g), cg = Math.cos(g);
    const omuz = { x: sg * K.govde, y: -cg * K.govde };
    const omO = { x: omuz.x + 2 * cg + 3 * sg, y: omuz.y + 2 * sg + 3 * cg - 1 }, omA = { x: omuz.x - 4 * cg + 2 * sg, y: omuz.y - 4 * sg + 2 * cg };
    const basA = g + (P.bas || 0);
    const basM = { x: omuz.x + Math.sin(basA) * (K.boyun + K.basR * 0.92), y: omuz.y - Math.cos(basA) * (K.boyun + K.basR * 0.92) };
    const ayak = (q) => (q.lx !== undefined ? { x: q.lx, y: q.ly } : { x: q.x, y: P.kalca - (q.h || 0) - 5 });
    const aO = ayak(P.ayakO), aA = ayak(P.ayakA);
    const kalO = { x: 2, y: 1 }, kalA = { x: -2.5, y: 0 };
    const bO = ik(kalO.x, kalO.y, aO.x, aO.y, K.uyluk, K.baldir, -1), bA = ik(kalA.x, kalA.y, aA.x, aA.y, K.uyluk, K.baldir, -1);
    // eller
    let elO, elA, silahT = null;
    if (P.silah) {
      const gy = { x: omO.x + P.silahYer.x, y: omO.y + P.silahYer.y }, ca = Math.cos(P.silahAci || 0), sa = Math.sin(P.silahAci || 0);
      const t2 = P.elA2 || SILAH_GEO[P.silah].tutamak2;
      elO = gy; elA = { x: gy.x + t2.x * ca - t2.y * sa, y: gy.y + t2.x * sa + t2.y * ca };
      silahT = { x: gy.x, y: gy.y, a: P.silahAci || 0 };
    } else {
      elO = { x: omO.x + P.elO.x, y: omO.y + P.elO.y }; elA = { x: omA.x + P.elA.x, y: omA.y + P.elA.y };
    }
    const kO = ik(omO.x, omO.y, elO.x, elO.y, K.kolUst, K.kolAlt, P.dirsekO || 1), kA = ik(omA.x, omA.y, elA.x, elA.y, K.kolUst, K.kolAlt, P.dirsekA || 1);

    const grupCiz = (parcalar, kalin) => {
      ctx.strokeStyle = CIZGI; ctx.lineWidth = kalin * 2;
      parcalar.forEach((p) => { if (p.donus) { ctx.save(); ctx.translate(p.donus.x, p.donus.y); ctx.rotate(p.donus.a); ctx.stroke(p.yol); ctx.restore(); } else ctx.stroke(p.yol); });
      parcalar.forEach((p) => { if (p.donus) { ctx.save(); ctx.translate(p.donus.x, p.donus.y); ctx.rotate(p.donus.a); p.boya(ctx, p.yol); ctx.restore(); } else p.boya(ctx, p.yol); });
    };
    const uzuv = (x1, y1, x2, y2, w1, w2, hex, karart, ekstra) => {
      const yol = uzuvYol(x1, y1, x2, y2, w1, w2), c = karart ? A.karistir(hex, "#05070c", karart) : hex;
      return { yol, boya: (cx) => { silindirBoya(cx, yol, x1, y1, x2, y2, Math.max(w1, w2), c); if (ekstra) { cx.save(); cx.clip(yol); ekstra(cx); cx.restore(); } } };
    };
    const ayakkabi = (x, y, hex, karart) => {
      const p = new Path2D(); p.moveTo(x - 4.5, y - 4); p.lineTo(x + 6, y - 3.4); p.quadraticCurveTo(x + 14.5, y - 1.5, x + 14.5, y + 3); p.lineTo(x + 14.5, y + 5); p.lineTo(x - 5, y + 5); p.closePath();
      const c = karart ? A.karistir(hex, "#05070c", karart) : hex;
      return { yol: p, boya: (cx) => { const g2 = cx.createLinearGradient(0, y - 4, 0, y + 5); g2.addColorStop(0, renk(c.startsWith("#") ? c : hex, 1.4)); g2.addColorStop(1, c); cx.fillStyle = g2; cx.fill(p); cx.fillStyle = "rgba(0,0,0,.5)"; cx.fillRect(x - 5, y + 3.2, 19.5, 1.8); } };
    };
    const serit = (x1, y1, x2, y2, f, genis) => (cx) => { // uzuv üzerinde yansıtıcı şerit
      const x = lerp(x1, x2, f), y = lerp(y1, y2, f), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      cx.strokeStyle = S.seritRenk; cx.lineWidth = genis; cx.lineCap = "butt"; cx.beginPath(); cx.moveTo(x + nx * 20, y + ny * 20); cx.lineTo(x - nx * 20, y - ny * 20); cx.stroke();
      cx.strokeStyle = "rgba(255,255,240,.55)"; cx.lineWidth = genis * 0.35; cx.stroke(); cx.lineCap = "round";
    };
    const kol = (om, k, el, karart, on) => {
      const w = (on ? S.onKolKalin || 1 : 1) * kk;
      const ust = uzuv(om.x, om.y, k.ex, k.ey, 9.5 * w, 8 * w, S.kolUstRenk || S.ust, karart, S.serit ? serit(om.x, om.y, k.ex, k.ey, 0.72, 2.6) : null);
      const alt = uzuv(k.ex, k.ey, k.hx, k.hy, 8 * w, 6.8 * w, S.kolAltRenk || (S.kisaKol ? S.ten : S.ust), karart, S.serit ? serit(k.ex, k.ey, k.hx, k.hy, 0.45, 2.4) : null);
      const elY = elipsYol(k.hx, k.hy, 4.4 * w, 4.4 * w);
      const elC = karart ? A.karistir(S.ten, "#05070c", karart) : S.ten;
      const el2 = { yol: elY, boya: (cx) => { cx.fillStyle = elC; cx.fill(elY); } };
      return [ust, alt, el2];
    };
    const bacak = (kal, b, karart) => {
      const ust = uzuv(kal.x, kal.y, b.ex, b.ey, 13.5 * gen, 10.5 * gen, S.alt, karart, S.serit ? null : null);
      const alt = uzuv(b.ex, b.ey, b.hx, b.hy, 10.5 * Math.min(gen, 1.25), 8 * Math.min(gen, 1.2), S.baldirRenk || S.alt, karart, S.serit ? serit(b.ex, b.ey, b.hx, b.hy, 0.55, 2.6) : null);
      const ay = ayakkabi(b.hx, b.hy, S.ayakkabi, karart);
      return [ust, alt, ay];
    };

    // --- ARKA GRUP ---
    const ARKA_K = 0.38;
    const basTr = { x: basM.x, y: basM.y, a: basA };
    const arka = [];
    basCiz(ctx, S, P, "arka").forEach((p) => arka.push(Object.assign(p, { donus: basTr })));
    if (S.canta) {
      const cx0 = omuz.x * 0.55 - 11 * cg, cy0 = omuz.y * 0.55 - 11 * sg;
      const p = new Path2D(); p.roundRect ? p.roundRect(-9, -15, 18, 30, 4) : p.rect(-9, -15, 18, 30);
      arka.push({ yol: p, donus: { x: cx0, y: cy0, a: g }, boya: (c, y) => { const gr = c.createLinearGradient(-9, 0, 9, 0); gr.addColorStop(0, renk(S.canta, 1.25)); gr.addColorStop(1, renk(S.canta, 0.55)); c.fillStyle = gr; c.fill(y); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(-9, -3, 18, 2); c.fillStyle = S.seritRenk || "#ccc"; c.fillRect(-2, -12, 4, 9); c.fillRect(-4.5, -9.5, 9, 4); } });
    }
    if (!P.kolArkaOnde) kol(omA, kA, elA, ARKA_K, false).forEach((p) => arka.push(p));
    bacak(kalA, bA, ARKA_K).forEach((p) => arka.push(p));
    grupCiz(arka, cz);

    // --- GÖVDE GRUBU ---
    const gov = [];
    bacak(kalO, bO, 0).forEach((p) => gov.push(p));
    const kalW = 22 * gen, omW = 25 * gen;
    const govYol = uzuvYol(0, 2, omuz.x * 0.97, omuz.y * 0.97, kalW, omW);
    if (S.gobek) { govYol.addPath(elipsYol(omuz.x * 0.38 + 7 * gen * cg, omuz.y * 0.38 + 7 * gen * sg, 12 * gen, 15 * gen, g)); }
    gov.push({ yol: govYol, boya: (c) => {
      silindirBoya(c, govYol, 0, 2, omuz.x, omuz.y, omW * 1.25, S.ust, 1.2, 0.5);
      c.save(); c.clip(govYol);
      const ek = (f, o) => ({ x: omuz.x * f + o * cg * 14 * gen, y: omuz.y * f + o * sg * 14 * gen });
      if (S.yelek) { c.fillStyle = S.yelek; c.globalAlpha = 0.95; const a1 = ek(0.15, -1.2), a2 = ek(0.95, -1.2), a3 = ek(0.95, 0.2), a4 = ek(0.15, 0.4); c.beginPath(); c.moveTo(a1.x, a1.y); c.lineTo(a2.x, a2.y); c.lineTo(a3.x, a3.y); c.lineTo(a4.x, a4.y); c.fill(); c.globalAlpha = 1; serit(0, 2, omuz.x, omuz.y, 0.42, 3)(c); }
      if (S.onluk) { c.fillStyle = S.onluk; const a1 = ek(-0.05, 0.1), a2 = ek(0.85, 0.15), a3 = ek(0.85, 1.6), a4 = ek(-0.05, 1.6); c.beginPath(); c.moveTo(a1.x, a1.y); c.lineTo(a2.x, a2.y); c.lineTo(a3.x, a3.y); c.lineTo(a4.x, a4.y); c.fill(); }
      if (S.tulum) { c.fillStyle = S.tulum; const a1 = ek(-0.1, -2), a2 = ek(0.6, -2), a3 = ek(0.6, 2), a4 = ek(-0.1, 2); c.beginPath(); c.moveTo(a1.x, a1.y); c.lineTo(a2.x, a2.y); c.lineTo(a3.x, a3.y); c.lineTo(a4.x, a4.y); c.fill(); c.strokeStyle = S.tulum; c.lineWidth = 3.4; const b1 = ek(0.58, 0.55), b2 = ek(1.0, 0.25); c.beginPath(); c.moveTo(b1.x, b1.y); c.lineTo(b2.x, b2.y); c.stroke(); }
      if (S.serit) { serit(0, 2, omuz.x, omuz.y, 0.36, 3.2)(c); serit(0, 2, omuz.x, omuz.y, 0.6, 3.2)(c); c.fillStyle = "#15171b"; const z1 = ek(0.65, 0.55); c.fillRect(z1.x - 3, z1.y - 4, 6, 8); c.fillStyle = "#2b2f36"; c.fillRect(z1.x - 0.6, z1.y - 11, 1.4, 7); }
      if (S.kaburga) { c.strokeStyle = "rgba(220,200,170,.75)"; c.lineWidth = 1.8; for (let i = 0; i < 4; i++) { const a = ek(0.45 + i * 0.1, 0.1), b = ek(0.47 + i * 0.1, 1.2); c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo((a.x + b.x) / 2 + 2, (a.y + b.y) / 2 + 3, b.x, b.y); c.stroke(); } c.fillStyle = "rgba(60,8,8,.6)"; const kb = ek(0.55, 0.7); c.beginPath(); c.ellipse(kb.x, kb.y, 6, 9, g, 0, TAU); c.globalCompositeOperation = "multiply"; c.fill(); c.globalCompositeOperation = "source-over"; }
      if (S.kabarcik) { S._d.lekeler.slice(0, 6).forEach((l) => { const p = ek(l.f, l.o * 0.9); c.save(); c.shadowColor = "#ff8a2a"; c.shadowBlur = 6; c.fillStyle = "#ffae4a"; c.beginPath(); c.arc(p.x, p.y, l.b * 0.45, 0, TAU); c.fill(); c.restore(); }); }
      S._d.yirtik.forEach((y) => { const p = ek(y.f, y.o); c.fillStyle = renk(S.ten, 0.85); c.beginPath(); for (let i = 0; i < y.n; i++) { const a = (i / y.n) * TAU, rr = y.b * (0.6 + 0.4 * Math.sin(i * 2.3 + y.t)); c[i ? "lineTo" : "moveTo"](p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.strokeStyle = "rgba(0,0,0,.45)"; c.lineWidth = 0.8; c.stroke(); });
      S._d.lekeler.forEach((l) => { const p = ek(l.f, l.o); const gr = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, l.b); gr.addColorStop(0, "rgba(95,6,10,.9)"); gr.addColorStop(1, "rgba(95,6,10,0)"); c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, l.b, 0, TAU); c.fill(); });
      // kemer / pantolon üstü
      const k1 = ek(0.06, -2), k2 = ek(0.06, 2); c.strokeStyle = S.kemer || A.karistir(S.alt, "#000000", 0.35); c.lineWidth = 5; c.lineCap = "butt"; c.beginPath(); c.moveTo(k1.x, k1.y); c.lineTo(k2.x, k2.y); c.stroke();
      const k3 = ek(-0.06, -2), k4 = ek(-0.06, 2); c.strokeStyle = S.alt; c.lineWidth = 6; c.beginPath(); c.moveTo(k3.x, k3.y); c.lineTo(k4.x, k4.y); c.stroke(); c.lineCap = "round";
      // yaka
      const y1 = ek(0.97, -0.3), y2 = ek(0.97, 0.6); c.strokeStyle = renk(S.ust, 0.55); c.lineWidth = 4; c.beginPath(); c.moveTo(y1.x, y1.y); c.lineTo(y2.x, y2.y); c.stroke();
      c.restore();
    } });
    const boyunYol = uzuvYol(omuz.x * 0.92, omuz.y * 0.92, basM.x * 0.95 + omuz.x * 0.05, basM.y * 0.8 + omuz.y * 0.2, 9 * Math.min(gen, 1.4), 8 * Math.min(gen, 1.3));
    gov.push({ yol: boyunYol, boya: (c) => { c.fillStyle = renk(S.ten, 0.82); c.fill(boyunYol); } });
    basCiz(ctx, S, P, "on").forEach((p) => gov.push(Object.assign(p, { donus: basTr })));
    grupCiz(gov, cz);

    // --- SİLAH ---
    if (silahT) { ctx.save(); ctx.translate(silahT.x, silahT.y); ctx.rotate(silahT.a); ctx.lineJoin = "round"; A.silahCiz(ctx, P.silah); ctx.restore(); }

    // --- ÖN KOL ---
    const on = kol(omO, kO, elO, 0, true);
    if (P.kolArkaOnde) kol(omA, kA, elA, 0.2, false).forEach((p) => on.unshift(p));
    grupCiz(on, cz * 0.85);
    if (P.tasi === "satir") { const a = Math.atan2(kO.hy - kO.ey, kO.hx - kO.ex) + (P.tasiAci || 0); ctx.save(); ctx.translate(kO.hx, kO.hy); ctx.rotate(a); satirCiz(ctx); ctx.restore(); }
    if (P.tasi === "varil") { ctx.save(); ctx.translate(kO.hx, kO.hy - 10); ctx.rotate(0.3); varilCiz(ctx, 12); ctx.restore(); }
    // tutan el silahın önünde
    if (silahT) { ctx.fillStyle = S.ten; ctx.strokeStyle = CIZGI; ctx.lineWidth = cz * 1.4; const e = elipsYol(kO.hx, kO.hy, 4.4, 4.4); ctx.stroke(e); ctx.fill(e); }
    ctx.restore();
    return { omO, silahT, basM };
  };

  /* ---------- POZ ÜRETİCİLER ---------- */
  function bacakFaz(p, adim, kaldir, durus = 0.5) {
    p = ((p % 1) + 1) % 1;
    if (p < durus) return { x: adim / 2 - (adim * p) / durus, h: 0 };
    const q = (p - durus) / (1 - durus);
    return { x: -adim / 2 + adim * kolay(q), h: kaldir * Math.sin(PI * q) };
  }
  function olumPozlari(n, ek) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), e = Math.pow(t, 1.5), bk = Math.sin(PI * Math.min(1, t * 1.2));
      const P = {
        kalca: lerp(64, 8.5, e), dx: -12 * e, donus: -(PI / 2) * 0.97 * e, govde: 0.05 - 0.1 * e, bas: lerp(0.15, -0.35, t),
        ayakO: { lx: 6 + 14 * bk, ly: 58 - 22 * bk }, ayakA: { lx: -4 + 6 * bk, ly: 59 - 10 * bk },
        elO: { x: lerp(14, -6, t), y: lerp(18, -30, t) }, elA: { x: lerp(8, 14, t), y: lerp(22, -26, t) }, agiz: 0.6 * (1 - t)
      };
      if (i === n - 1) { P.kalca = 8; P.ayakO = { lx: 4, ly: 58 }; P.ayakA = { lx: -2, ly: 59 }; }
      Object.assign(P, ek ? ek(t, i) : {});
      out.push(P);
    }
    return out;
  }

  function kahramanPozlari(sil) {
    const uzun = sil !== "tabanca";
    const yer = (bob) => (uzun ? { x: 15, y: 7 + bob } : { x: 33, y: 3 + bob });
    const res = {};
    res.dur = [0, 1, 2, 3, 4, 5].map((i) => { const w = Math.sin((i / 6) * TAU); return { kalca: 63.5 - 0.7 * w, govde: 0.05 + 0.012 * w, bas: -0.03, ayakO: { x: 10, h: 0 }, ayakA: { x: -11, h: 0 }, silah: sil, silahAci: 0, silahYer: yer(0.4 * w) }; });
    res.kos = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, b = Math.abs(Math.cos(p * TAU)); return { kalca: 59.5 + 3.5 * b, govde: 0.17, bas: -0.12, ayakO: bacakFaz(p, 46, 19, 0.42), ayakA: bacakFaz(p + 0.5, 46, 19, 0.42), silah: sil, silahAci: -0.02, silahYer: yer(1.2 * Math.sin(p * TAU * 2)) }; });
    res.zipla = [
      { kalca: 66, govde: 0.1, bas: -0.08, ayakO: { x: 13, h: 18 }, ayakA: { x: -15, h: 7 }, silah: sil, silahAci: -0.04, silahYer: yer(-1) },
      { kalca: 64, govde: 0.06, bas: -0.02, ayakO: { x: 9, h: 6 }, ayakA: { x: -7, h: 12 }, silah: sil, silahAci: 0.02, silahYer: yer(1) }
    ];
    res.hasar = [
      { kalca: 61, govde: -0.2, bas: -0.32, ayakO: { x: 14, h: 0 }, ayakA: { x: -10, h: 0 }, silah: sil, silahAci: -0.4, silahYer: yer(-3) },
      { kalca: 62, govde: -0.1, bas: -0.15, ayakO: { x: 12, h: 0 }, ayakA: { x: -11, h: 0 }, silah: sil, silahAci: -0.2, silahYer: yer(-1) }
    ];
    const geo = SILAH_GEO[sil].tutamak2;
    const hedefler = uzun
      ? [geo, { x: 7, y: 7 }, { x: 4, y: 19 }, { x: 7, y: 9 }, geo, geo]
      : [geo, { x: -1, y: 10 }, { x: -2, y: 20 }, { x: -1, y: 9 }, geo, geo];
    const acilar = [-0.28, -0.45, -0.5, -0.45, -0.22, -0.06];
    res.doldur = hedefler.map((h, i) => ({ kalca: 63, govde: 0.06, bas: 0.12, ayakO: { x: 10, h: 0 }, ayakA: { x: -11, h: 0 }, silah: sil, silahAci: acilar[i], silahYer: uzun ? { x: 12, y: 10 } : { x: 22, y: 8 }, elA2: h }));
    return res;
  }

  function aylakPozlari() {
    const r = {};
    r.yuru = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, w = Math.sin(p * TAU); return { kalca: 61.5 - 1.6 * Math.abs(w), govde: 0.3 + 0.04 * w, bas: 0.24 + 0.08 * Math.sin(p * TAU + 1), ayakO: bacakFaz(p, 22, 8), ayakA: bacakFaz(p + 0.5, 20, 2.5), elO: { x: 30 + 3 * w, y: 9 + 3 * Math.cos(p * TAU) }, elA: { x: 27 - 3 * w, y: 15 }, agiz: 0.35 + 0.3 * Math.max(0, w) }; });
    const sal = [[14, -16, 0.25, 0.6], [22, -22, 0.2, 1], [36, 0, 0.45, 1], [38, 14, 0.5, 0.8], [30, 12, 0.38, 0.5]];
    r.saldiri = sal.map(([x, y, g, a]) => ({ kalca: 61, govde: g, bas: 0.15, ayakO: { x: 14, h: 0 }, ayakA: { x: -12, h: 0 }, elO: { x, y }, elA: { x: x - 6, y: y + 4 }, agiz: a, gozParla: a }));
    r.hasar = [{ kalca: 61, govde: 0.05, bas: -0.3, ayakO: { x: 10, h: 0 }, ayakA: { x: -12, h: 0 }, elO: { x: 12, y: 26 }, elA: { x: 2, y: 28 }, agiz: 0.9 }, { kalca: 61.5, govde: 0.18, bas: -0.05, ayakO: { x: 10, h: 0 }, ayakA: { x: -12, h: 0 }, elO: { x: 22, y: 18 }, elA: { x: 14, y: 22 }, agiz: 0.6 }];
    r.olum = olumPozlari(8);
    return r;
  }
  function kosucuPozlari() {
    const r = {};
    r.yuru = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, w = Math.sin(p * TAU), c = Math.cos(p * TAU); return { kalca: 57 + 4 * Math.abs(c), govde: 0.55, bas: -0.38, ayakO: bacakFaz(p, 54, 22, 0.38), ayakA: bacakFaz(p + 0.5, 54, 22, 0.38), elO: { x: 20 * c + 6, y: 16 - 8 * w }, elA: { x: -20 * c + 6, y: 16 + 8 * w }, agiz: 1, gozParla: 0.6 }; });
    const sal = [[28, -8, 0.6], [40, -4, 0.72], [42, 2, 0.75], [36, 8, 0.66], [28, 12, 0.58]];
    r.saldiri = sal.map(([x, y, g], i) => ({ kalca: 56, govde: g, bas: -0.45, ayakO: { x: 24, h: 0 }, ayakA: { x: -28, h: 3 }, elO: { x, y }, elA: { x: x - 4, y: y - 6 }, agiz: 1, gozParla: 1 }));
    r.hasar = [{ kalca: 60, govde: 0.1, bas: -0.4, ayakO: { x: 12, h: 0 }, ayakA: { x: -12, h: 0 }, elO: { x: 0, y: 24 }, elA: { x: -8, y: 24 }, agiz: 1 }, { kalca: 59, govde: 0.35, bas: -0.3, ayakO: { x: 12, h: 0 }, ayakA: { x: -14, h: 0 }, elO: { x: 16, y: 18 }, elA: { x: 6, y: 20 }, agiz: 1 }];
    r.olum = olumPozlari(8, (t) => ({ govde: 0.3 - 0.4 * t }));
    return r;
  }
  function hantalPozlari() {
    const r = {};
    r.yuru = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, w = Math.sin(p * TAU); return { kalca: 61 - 2.2 * Math.abs(w), govde: 0.17 + 0.03 * w, bas: 0.12, ayakO: bacakFaz(p, 26, 7), ayakA: bacakFaz(p + 0.5, 26, 7), elO: { x: 10 + 7 * w, y: 37 }, elA: { x: -2 - 7 * w, y: 37 }, agiz: 0.3 + 0.2 * Math.abs(w) }; });
    const sal = [[10, -30, 0.05, 0.6], [6, -38, -0.05, 1], [30, 10, 0.35, 1], [40, 38, 0.5, 0.8], [30, 32, 0.32, 0.4]];
    r.saldiri = sal.map(([x, y, g, a]) => ({ kalca: 60, govde: g, bas: 0.1, ayakO: { x: 16, h: 0 }, ayakA: { x: -14, h: 0 }, elO: { x, y }, elA: { x: x - 10, y }, agiz: a, gozParla: a }));
    r.hasar = [{ kalca: 61, govde: 0.02, bas: -0.25, ayakO: { x: 12, h: 0 }, ayakA: { x: -14, h: 0 }, elO: { x: 4, y: 36 }, elA: { x: -8, y: 36 }, agiz: 1 }, { kalca: 61, govde: 0.12, bas: 0, ayakO: { x: 12, h: 0 }, ayakA: { x: -14, h: 0 }, elO: { x: 10, y: 36 }, elA: { x: -2, y: 36 }, agiz: 0.5 }];
    r.olum = olumPozlari(8, (t) => ({ govde: 0.1 - 0.15 * t }));
    return r;
  }
  function kasapPozlari() {
    const r = {}, sat = { tasi: "satir" };
    r.yuru = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, w = Math.sin(p * TAU); return Object.assign({ kalca: 61 - 2.4 * Math.abs(w), govde: 0.2 + 0.03 * w, bas: 0.1, ayakO: bacakFaz(p, 28, 8), ayakA: bacakFaz(p + 0.5, 28, 8), elO: { x: 20 + 4 * w, y: 24 }, elA: { x: 2 - 6 * w, y: 34 }, agiz: 0.4, tasiAci: -0.9 }, sat); });
    const v = [[4, -36, 0, -1.6, 0.6], [-2, -42, -0.1, -2.2, 1], [20, -20, 0.2, -0.8, 1], [42, 22, 0.55, 0.3, 1], [40, 30, 0.55, 0.5, 0.8], [26, 26, 0.35, -0.2, 0.5]];
    r.vurus = v.map(([x, y, g, ta, a]) => Object.assign({ kalca: 60, govde: g, bas: 0.08, ayakO: { x: 18, h: 0 }, ayakA: { x: -16, h: 0 }, elO: { x, y }, elA: { x: 0, y: 32 }, agiz: a, gozParla: a, tasiAci: ta }, sat));
    r.hucum = [0, 1, 2, 3, 4].map((i) => { const p = i / 5; return Object.assign({ kalca: 50, govde: 0.95, bas: -0.75, ayakO: bacakFaz(p, 62, 20, 0.4), ayakA: bacakFaz(p + 0.5, 62, 20, 0.4), elO: { x: -14, y: 24 }, elA: { x: -22, y: 18 }, agiz: 1, gozParla: 1, tasiAci: 1.6 }, sat); });
    r.kukre = [0, 1, 2].map((i) => Object.assign({ kalca: 62, govde: -0.14 - i * 0.03, bas: -0.35, ayakO: { x: 18, h: 0 }, ayakA: { x: -18, h: 0 }, elO: { x: 30, y: -16 - i * 3 }, elA: { x: -24, y: -14 - i * 3 }, agiz: 1, gozParla: 1, kolArkaOnde: false, tasiAci: -1.2 }, sat));
    r.hasar = [Object.assign({ kalca: 61, govde: 0.0, bas: -0.3, ayakO: { x: 12, h: 0 }, ayakA: { x: -16, h: 0 }, elO: { x: 8, y: 30 }, elA: { x: -4, y: 34 }, agiz: 1, tasiAci: -0.6 }, sat)];
    r.olum = olumPozlari(7);
    return r;
  }
  function devPozlari() {
    const r = {};
    r.yuru = Array.from({ length: 12 }, (_, i) => i).map((i) => { const p = i / 12, w = Math.sin(p * TAU); return { kalca: 60 - 2.5 * Math.abs(w), govde: 0.28 + 0.04 * w, bas: 0.25, ayakO: bacakFaz(p, 26, 7), ayakA: bacakFaz(p + 0.5, 26, 7), elO: { x: 24 + 6 * w, y: 46 }, elA: { x: 4 - 6 * w, y: 36 }, agiz: 0.5, gozParla: 0.4 }; });
    const v = [[12, -34, 0.05, 0.7], [8, -44, -0.08, 1], [26, -10, 0.25, 1], [40, 50, 0.6, 1], [38, 54, 0.62, 0.9], [28, 40, 0.42, 0.6]];
    r.vurus = v.map(([x, y, g, a]) => ({ kalca: 58, govde: g, bas: 0.1, ayakO: { x: 20, h: 0 }, ayakA: { x: -18, h: 0 }, elO: { x, y }, elA: { x: x - 14, y: y + 2 }, agiz: a, gozParla: a }));
    const f = [[-18, -32, -0.12, true], [-24, -38, -0.18, true], [-16, -40, -0.1, true], [40, -24, 0.3, false], [40, 10, 0.4, false]];
    r.firlat = f.map(([x, y, g, t]) => ({ kalca: 60, govde: g, bas: 0.05, ayakO: { x: 18, h: 0 }, ayakA: { x: -18, h: 0 }, elO: { x, y }, elA: { x: 14, y: 30 }, agiz: 0.8, gozParla: 0.6, tasi: t ? "varil" : null }));
    r.kukre = [0, 1, 2].map((i) => ({ kalca: 62, govde: -0.16 - i * 0.03, bas: -0.4, ayakO: { x: 18, h: 0 }, ayakA: { x: -18, h: 0 }, elO: { x: 32, y: -20 - i * 3 }, elA: { x: -26, y: -18 - i * 3 }, agiz: 1, gozParla: 1 }));
    r.hasar = [{ kalca: 60, govde: 0.05, bas: -0.3, ayakO: { x: 12, h: 0 }, ayakA: { x: -16, h: 0 }, elO: { x: 10, y: 44 }, elA: { x: -6, y: 36 }, agiz: 1 }];
    r.olum = olumPozlari(7);
    return r;
  }

  /* ---------- STİLLER ---------- */
  A.STILLER = {
    kahraman: { s: 1, gen: 1, ten: "#c48b66", sac: "#1c1410", sacTip: "kisa", sakal: true, ust: "#22324a", alt: "#2e333b", ayakkabi: "#16171a", canta: "#9b2226", serit: true, seritRenk: "#cdd69c", kemer: "#121316", tohum: 3 },
    aylak: { s: 1, gen: 1, zombi: true, ten: "#8f9b7c", sac: "#2a2420", sacTip: "seyrek", ust: "#6c7d8c", alt: "#3b3631", ayakkabi: "#221d19", gozRenk: "#ffd54a", leke: 7, yirtikSay: 4, tohum: 11, kisaKol: false, agizKan: true },
    aylak2: { s: 1, gen: 0.95, zombi: true, ten: "#a1a891", sac: "#3c2a1f", sacTip: "uzun", ust: "#6b2a3a", alt: "#2c2b33", ayakkabi: "#1b1718", gozRenk: "#ffe082", leke: 6, yirtikSay: 3, tohum: 23, kisaKol: true },
    aylak3: { s: 1, gen: 1.05, zombi: true, ten: "#8a9783", sac: "#191919", sacTip: "kisa", ust: "#2d3646", alt: "#262b35", ayakkabi: "#121212", gozRenk: "#ffd54a", leke: 8, yirtikSay: 3, tohum: 131, agizKan: true, yelek: "#1b2230", seritRenk: "#8a93a6" },
    aylak4: { s: 1, gen: 0.92, zombi: true, ten: "#a7ae98", sac: "#6b5a48", sacTip: "seyrek", ust: "#a9c4bd", alt: "#a9c4bd", ayakkabi: "#c9c4b8", gozRenk: "#ffe7a0", leke: 10, yirtikSay: 5, tohum: 157, kisaKol: true },
    kosucu: { s: 1, gen: 0.86, kolKalin: 0.9, zombi: true, ten: "#a3ad93", sac: "#151313", sacTip: "kisa", ust: "#5b1c1f", alt: "#2f3b52", ayakkabi: "#d7d2c7", gozRenk: "#ff5a3c", leke: 5, yirtikSay: 4, tohum: 37, agizKan: true },
    hantal: { s: 1.35, gen: 1.5, kolKalin: 1.45, gobek: true, zombi: true, ten: "#7f8b6b", sacTip: "kel", ust: "#d9d2c3", yelek: "#c9561c", seritRenk: "#d9dd9e", alt: "#3e3b33", ayakkabi: "#2a2219", gozRenk: "#ffcc33", leke: 9, yirtikSay: 5, tohum: 51, kisaKol: true, cizgi: 2.0 },
    kasap: { s: 1.75, gen: 1.45, kolKalin: 1.4, gobek: true, zombi: true, ten: "#8a8f74", sacTip: "kel", dikis: true, ust: "#4f463f", onluk: "#d4cdbd", alt: "#2f2c29", ayakkabi: "#1d1a17", gozRenk: "#ff3b2f", leke: 12, yirtikSay: 3, tohum: 71, kisaKol: true, agizKan: true, cizgi: 1.8 },
    dev: { s: 1.75, gen: 1.6, kolKalin: 1.25, onKolKalin: 1.75, zombi: true, ten: "#6f7a66", sacTip: "kel", bere: "#2b3a52", ust: "#5d6858", tulum: "#2c3a4f", alt: "#2c3a4f", ayakkabi: "#1c1d20", gozRenk: "#ff9a3a", leke: 10, yirtikSay: 4, kaburga: true, kabarcik: true, tohum: 91, kisaKol: true, cizgi: 1.8 }
  };

  /* Sprite sheet tanımları: kare boyu, ayak noktası, animasyonlar (sıra = kare sırası) */
  A.KARAKTERLER = {
    kahraman: { w: 240, h: 170, ox: 108, oy: 164, kolon: 8, anim: () => {
      const L = []; ["tabanca", "pompali", "tufek"].forEach((sil) => { const p = kahramanPozlari(sil); [["dur", 7, -1], ["kos", 20, -1], ["zipla", 1, 0], ["hasar", 10, 0], ["doldur", 6, 0]].forEach(([ad, fps, tk]) => L.push({ ad: sil + "_" + ad, pozlar: p[ad], fps, tekrar: tk })); });
      L.push({ ad: "olum", pozlar: olumPozlari(8, (t) => ({ elO: { x: lerp(20, -4, t), y: lerp(10, -30, t) } })), fps: 12, tekrar: 0 }); return L; } },
    aylak: { w: 200, h: 182, ox: 100, oy: 176, kolon: 8, anim: () => { const p = aylakPozlari(); return [{ ad: "yuru", pozlar: p.yuru, fps: 12, tekrar: -1 }, { ad: "saldiri", pozlar: p.saldiri, fps: 10, tekrar: 0 }, { ad: "hasar", pozlar: p.hasar, fps: 10, tekrar: 0 }, { ad: "olum", pozlar: p.olum, fps: 14, tekrar: 0 }]; } },
    aylak2: { w: 200, h: 182, ox: 100, oy: 176, kolon: 8, stil: "aylak2", anim: () => A.KARAKTERLER.aylak.anim() },
    aylak3: { w: 200, h: 182, ox: 100, oy: 176, kolon: 8, stil: "aylak3", anim: () => A.KARAKTERLER.aylak.anim() },
    aylak4: { w: 200, h: 182, ox: 100, oy: 176, kolon: 8, stil: "aylak4", anim: () => A.KARAKTERLER.aylak.anim() },
    kosucu: { w: 200, h: 182, ox: 100, oy: 176, kolon: 8, anim: () => { const p = kosucuPozlari(); return [{ ad: "yuru", pozlar: p.yuru, fps: 24, tekrar: -1 }, { ad: "saldiri", pozlar: p.saldiri, fps: 14, tekrar: 0 }, { ad: "hasar", pozlar: p.hasar, fps: 10, tekrar: 0 }, { ad: "olum", pozlar: p.olum, fps: 14, tekrar: 0 }]; } },
    hantal: { w: 270, h: 244, ox: 135, oy: 236, kolon: 7, anim: () => { const p = hantalPozlari(); return [{ ad: "yuru", pozlar: p.yuru, fps: 7, tekrar: -1 }, { ad: "saldiri", pozlar: p.saldiri, fps: 8, tekrar: 0 }, { ad: "hasar", pozlar: p.hasar, fps: 8, tekrar: 0 }, { ad: "olum", pozlar: p.olum, fps: 11, tekrar: 0 }]; } },
    kasap: { w: 340, h: 330, ox: 170, oy: 322, kolon: 6, anim: () => { const p = kasapPozlari(); return [{ ad: "yuru", pozlar: p.yuru, fps: 12, tekrar: -1 }, { ad: "vurus", pozlar: p.vurus, fps: 9, tekrar: 0 }, { ad: "hucum", pozlar: p.hucum, fps: 14, tekrar: -1 }, { ad: "kukre", pozlar: p.kukre, fps: 6, tekrar: 0 }, { ad: "hasar", pozlar: p.hasar, fps: 8, tekrar: 0 }, { ad: "olum", pozlar: p.olum, fps: 9, tekrar: 0 }]; } },
    dev: { w: 340, h: 330, ox: 170, oy: 322, kolon: 6, anim: () => { const p = devPozlari(); return [{ ad: "yuru", pozlar: p.yuru, fps: 10, tekrar: -1 }, { ad: "vurus", pozlar: p.vurus, fps: 9, tekrar: 0 }, { ad: "firlat", pozlar: p.firlat, fps: 9, tekrar: 0 }, { ad: "kukre", pozlar: p.kukre, fps: 6, tekrar: 0 }, { ad: "hasar", pozlar: p.hasar, fps: 8, tekrar: 0 }, { ad: "olum", pozlar: p.olum, fps: 9, tekrar: 0 }]; } }
  };

  SV.KARE = {};   // anahtar -> {w,h,ox,oy}
  SV.NAMLU = {};  // silah -> {x,y} ayak noktasına göre namlu ucu (sağa bakarken)
  SV.ANIMLER = []; // {anahtar, ad, kareler:[..], fps, tekrar}

  /* Bir karakterin sprite sheet'ini üretir ve Phaser'a ekler */
  A.karakterUret = function (scene, anahtar) {
    const T = A.KARAKTERLER[anahtar], S = Object.assign({}, A.STILLER[T.stil || anahtar]);
    const animler = T.anim(), toplam = animler.reduce((a, b) => a + b.pozlar.length, 0);
    const kol = T.kolon, satir = Math.ceil(toplam / kol), tv = A.tuval(kol * T.w, satir * T.h), ctx = tv.getContext("2d");
    let k = 0;
    const kareListe = [];
    animler.forEach((an) => {
      const kareler = [];
      an.pozlar.forEach((P) => {
        const cx = (k % kol) * T.w, cy = Math.floor(k / kol) * T.h;
        ctx.save(); ctx.beginPath(); ctx.rect(cx, cy, T.w, T.h); ctx.clip();
        const sonuc = A.insanCiz(ctx, cx + T.ox, cy + T.oy, P, S);
        ctx.restore();
        if (anahtar === "kahraman" && an.ad.endsWith("_dur") && !SV.NAMLU[an.ad.split("_")[0]] && sonuc.silahT) {
          const sil = an.ad.split("_")[0], n = SILAH_GEO[sil].namlu, a = sonuc.silahT.a;
          const nx = sonuc.silahT.x + n.x * Math.cos(a) - n.y * Math.sin(a), ny = sonuc.silahT.y + n.x * Math.sin(a) + n.y * Math.cos(a);
          SV.NAMLU[sil] = { x: nx * S.s, y: P.kalca * S.s - ny * S.s };
        }
        kareListe.push([cx, cy]); kareler.push(k); k++;
      });
      SV.ANIMLER.push({ anahtar, ad: an.ad, kareler, fps: an.fps, tekrar: an.tekrar });
    });
    const tex = scene.textures.addCanvas(anahtar, tv);
    kareListe.forEach(([x, y], i) => tex.add(i, 0, x, y, T.w, T.h));
    SV.KARE[anahtar] = { w: T.w, h: T.h, ox: T.ox, oy: T.oy };
  };

  /* Harici (müşteri) sprite sheet kullanılıyorsa animasyon tablosu aynı kare sırasıyla kurulur */
  A.hariciAnimKur = function (anahtar, ayar) {
    const T = A.KARAKTERLER[anahtar], animler = T.anim(); let k = 0;
    animler.forEach((an) => {
      const ozel = ayar.animasyonlar && ayar.animasyonlar[an.ad];
      const kareler = ozel ? ozel.kareler : an.pozlar.map(() => k++);
      if (ozel) k += 0;
      SV.ANIMLER.push({ anahtar, ad: an.ad, kareler, fps: (ozel && ozel.fps) || an.fps, tekrar: ozel && ozel.tekrar !== undefined ? ozel.tekrar : an.tekrar });
    });
    SV.KARE[anahtar] = { w: ayar.kareG, h: ayar.kareY, ox: ayar.ayakX, oy: ayar.ayakY };
    if (anahtar === "kahraman") ["tabanca", "pompali", "tufek"].forEach((s, i) => { SV.NAMLU[s] = (ayar.namlu && ayar.namlu[s]) || { x: [60, 70, 70][i], y: 106 }; });
  };

  /* Hikâye kartları için büyük portreler */
  A.portreUret = function (scene) {
    const P = (ad, fn) => { const c = A.tuval(256, 256), x = c.getContext("2d"); fn(x); scene.textures.addCanvas(ad, c); };
    const arka = (x, r1, r2) => { const g = x.createRadialGradient(110, 90, 10, 128, 128, 190); g.addColorStop(0, r1); g.addColorStop(1, r2); x.fillStyle = g; x.fillRect(0, 0, 256, 256); };
    const yuz = (x, ten, opts) => {
      x.save(); x.translate(128, 120);
      // omuz/gövde
      x.fillStyle = opts.ust; x.strokeStyle = CIZGI; x.lineWidth = 5;
      x.beginPath(); x.moveTo(-120, 140); x.quadraticCurveTo(-110, 58, -40, 52); x.lineTo(40, 52); x.quadraticCurveTo(110, 58, 120, 140); x.closePath(); x.stroke(); x.fill();
      if (opts.detayGovde) opts.detayGovde(x);
      // boyun
      x.fillStyle = renk(ten, 0.8); x.beginPath(); x.moveTo(-20, 20); x.lineTo(20, 20); x.lineTo(24, 58); x.lineTo(-24, 58); x.closePath(); x.fill(); x.stroke();
      if (opts.arkaSac) opts.arkaSac(x);
      // baş
      const kafa = new Path2D(); kafa.ellipse(0, -18, 50, 60, 0, 0, TAU);
      x.lineWidth = 6; x.stroke(kafa);
      const g = x.createRadialGradient(-18, -40, 5, 0, -10, 80); g.addColorStop(0, renk(ten, 1.2)); g.addColorStop(0.6, ten); g.addColorStop(1, renk(ten, 0.55)); x.fillStyle = g; x.fill(kafa);
      x.save(); x.clip(kafa);
      // yanak gölgesi ve çene
      x.fillStyle = "rgba(60,20,10,.12)"; x.beginPath(); x.ellipse(0, 30, 52, 22, 0, 0, TAU); x.fill();
      if (opts.sakal) { x.fillStyle = "rgba(30,20,14,.5)"; x.beginPath(); x.ellipse(0, 22, 46, 30, 0, 0, PI); x.fill(); }
      // gözler
      [-1, 1].forEach((s) => {
        x.fillStyle = "#f4efe6"; x.beginPath(); x.ellipse(s * 19, -18, 10, 6, 0, 0, TAU); x.fill();
        x.fillStyle = opts.goz || "#3b2414"; x.beginPath(); x.arc(s * 19 + 1, -18, 4.6, 0, TAU); x.fill(); x.fillStyle = "#0c0806"; x.beginPath(); x.arc(s * 19 + 1, -18, 2.2, 0, TAU); x.fill();
        x.fillStyle = "rgba(255,255,255,.8)"; x.beginPath(); x.arc(s * 19 - 1, -20, 1.4, 0, TAU); x.fill();
        x.strokeStyle = opts.kas || "#2a1a10"; x.lineWidth = 4.2; x.beginPath(); x.moveTo(s * 8, -31 + (opts.kasEgim || 2)); x.quadraticCurveTo(s * 19, -36, s * 31, -31); x.stroke();
      });
      x.strokeStyle = renk(ten, 0.55); x.lineWidth = 3; x.beginPath(); x.moveTo(-2, -12); x.lineTo(-6, 10); x.lineTo(3, 12); x.stroke();
      x.strokeStyle = opts.dudak || renk(ten, 0.5); x.lineWidth = 3.4; x.beginPath(); x.moveTo(-14, 26); x.quadraticCurveTo(0, opts.gulus ? 32 : 28, 14, 26); x.stroke();
      if (opts.yara) { x.strokeStyle = "rgba(140,30,30,.8)"; x.lineWidth = 2.4; x.beginPath(); x.moveTo(26, -44); x.lineTo(36, -30); x.stroke(); }
      if (opts.kir) { x.fillStyle = "rgba(40,30,25,.18)"; [[-30, 4, 10], [28, 10, 8], [10, -48, 7]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, TAU); x.fill(); }); }
      if (opts.kirisik) { x.strokeStyle = "rgba(60,30,20,.35)"; x.lineWidth = 2; x.beginPath(); x.moveTo(-34, -46); x.lineTo(-10, -48); x.moveTo(34, -46); x.lineTo(10, -48); x.moveTo(-36, -8); x.lineTo(-40, 4); x.moveTo(36, -8); x.lineTo(40, 4); x.stroke(); }
      x.restore();
      // kulak
      x.fillStyle = renk(ten, 0.82); x.lineWidth = 4; [-1, 1].forEach((s) => { x.beginPath(); x.ellipse(s * 50, -12, 9, 14, 0, 0, TAU); x.stroke(); x.fill(); });
      if (opts.sac) opts.sac(x);
      if (opts.gozluk) { x.strokeStyle = "#1a1a1a"; x.lineWidth = 3.4; [-1, 1].forEach((s) => { x.beginPath(); x.roundRect ? x.roundRect(s * 19 - 15, -28, 30, 20, 6) : x.rect(s * 19 - 15, -28, 30, 20); x.stroke(); }); x.beginPath(); x.moveTo(-4, -20); x.lineTo(4, -20); x.stroke(); }
      if (opts.sapka) opts.sapka(x);
      x.restore();
    };
    P("portre_aras", (x) => {
      arka(x, "#2a3b55", "#0b1020");
      yuz(x, "#c48b66", {
        ust: "#22324a", sakal: true, yara: true, kir: true, kasEgim: 5,
        detayGovde: (c) => { c.fillStyle = "#cdd69c"; c.fillRect(-120, 96, 240, 12); c.fillStyle = "#9b2226"; c.fillRect(70, 60, 30, 80); c.fillStyle = "#15171b"; c.fillRect(-70, 70, 22, 30); c.fillRect(-62, 40, 4, 30); },
        sac: (c) => { c.fillStyle = "#1c1410"; c.strokeStyle = CIZGI; c.lineWidth = 5; c.beginPath(); c.moveTo(-52, -20); c.quadraticCurveTo(-58, -86, 0, -84); c.quadraticCurveTo(56, -86, 52, -24); c.quadraticCurveTo(40, -58, 10, -56); c.quadraticCurveTo(-26, -66, -40, -40); c.closePath(); c.stroke(); c.fill(); }
      });
    });
    P("portre_selin", (x) => {
      arka(x, "#1f4a49", "#071415");
      yuz(x, "#d9a982", {
        ust: "#e9e6df", goz: "#4a3a22", kas: "#3b2416", dudak: "#a2564d", gozluk: true,
        arkaSac: (c) => { c.fillStyle = "#2b1b14"; c.strokeStyle = CIZGI; c.lineWidth = 5; c.beginPath(); c.arc(0, -86, 26, 0, TAU); c.stroke(); c.fill(); },
        detayGovde: (c) => { c.fillStyle = "#7fb5ad"; c.beginPath(); c.moveTo(-40, 52); c.lineTo(0, 110); c.lineTo(40, 52); c.closePath(); c.fill(); c.strokeStyle = "#2d2f33"; c.lineWidth = 6; c.beginPath(); c.moveTo(-30, 54); c.quadraticCurveTo(-46, 120, -10, 130); c.stroke(); c.fillStyle = "#9aa0a6"; c.beginPath(); c.arc(-8, 132, 9, 0, TAU); c.fill(); },
        sac: (c) => { c.fillStyle = "#2b1b14"; c.strokeStyle = CIZGI; c.lineWidth = 5; c.beginPath(); c.moveTo(-54, 0); c.quadraticCurveTo(-60, -84, 0, -80); c.quadraticCurveTo(60, -84, 54, 0); c.quadraticCurveTo(48, -50, 0, -58); c.quadraticCurveTo(-30, -56, -44, -30); c.closePath(); c.stroke(); c.fill(); }
      });
    });
    P("portre_yusuf", (x) => {
      arka(x, "#33465f", "#0c121d");
      yuz(x, "#b98064", {
        ust: "#e0b52a", sakal: false, kirisik: true, kas: "#d9d6cf",
        detayGovde: (c) => { c.fillStyle = "#1e2a3a"; c.beginPath(); c.moveTo(-34, 52); c.lineTo(0, 100); c.lineTo(34, 52); c.closePath(); c.fill(); c.strokeStyle = "rgba(0,0,0,.35)"; c.lineWidth = 4; c.beginPath(); c.moveTo(-90, 80); c.lineTo(-80, 140); c.moveTo(90, 80); c.lineTo(80, 140); c.stroke(); },
        sac: (c) => { c.fillStyle = "#cfcac0"; c.beginPath(); c.ellipse(0, 30, 44, 36, 0, 0, PI); c.fill(); c.beginPath(); c.ellipse(0, 26, 26, 8, 0, PI, TAU); c.fill(); c.fillStyle = "#9b958a"; c.beginPath(); c.ellipse(-48, -26, 8, 16, 0, 0, TAU); c.ellipse(48, -26, 8, 16, 0, 0, TAU); c.fill(); },
        sapka: (c) => { c.strokeStyle = CIZGI; c.lineWidth = 5; c.fillStyle = "#1e2a3a"; c.beginPath(); c.moveTo(-60, -50); c.quadraticCurveTo(-50, -104, 0, -104); c.quadraticCurveTo(50, -104, 60, -50); c.closePath(); c.stroke(); c.fill(); c.fillStyle = "#11161f"; c.beginPath(); c.ellipse(0, -48, 66, 12, 0, 0, TAU); c.stroke(); c.fill(); c.fillStyle = "#e0b52a"; c.beginPath(); c.moveTo(-14, -84); c.lineTo(0, -92); c.lineTo(14, -84); c.lineTo(0, -70); c.closePath(); c.fill(); }
      });
    });
  };
})();
