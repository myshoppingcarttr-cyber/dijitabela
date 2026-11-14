/* Dijitabela · önizleme 1411 · Kahraman tabelası: binlerce LED noktası (ham WebGL, kütüphane yok).
   Yazılan ad parçacıklarla kurulur ve çözülür; imleç/dokunma noktaları iter; kaydırdıkça tabela ufka yatar ve dağılır.
   Hareket azaltmada tek durağan kare. WebGL yoksa 2B tuvalde durağan tabela. */
(function () {
  "use strict";
  var W = window, D = document, cv = D.getElementById("led"); if (!cv) return;
  var kap = cv.closest(".kah2"), giris = D.getElementById("ad");
  var AZ = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = {
    A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.", C: ".###.#...##....#....#....#...#.###.", D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####",
    F: "######....#....####.#....#....#....", G: ".###.#...##....#.####...##...#.####", H: "#...##...##...#######...##...##...#", I: ".###...#....#....#....#....#...###.", J: "..###...#....#....#....#.#..#..##..",
    K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####", M: "#...###.###.#.##.#.##...##...##...#", N: "#...##...###..##.#.##..###...##...#", O: ".###.#...##...##...##...##...#.###.",
    P: "####.#...##...#####.#....#....#....", Q: ".###.#...##...##...##.#.##..#..##.#", R: "####.#...##...#####.#.#..#..#.#...#", S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..",
    U: "#...##...##...##...##...##...#.###.", V: "#...##...##...##...##...#.#.#...#..", W: "#...##...##...##.#.##.#.###.###...#", X: "#...##...#.#.#...#...#.#.#...##...#", Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
    "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####", "3": "####.....#....#.###.....#....#####.", "4": "...#...##..#.#.#..#.#####...#....#.",
    "5": "######....####.....#....##...#.###.", "6": ".###.#....#....####.#...##...#.###.", "7": "#####....#...#...#...#....#....#...", "8": ".###.#...##...#.###.#...##...#.###.", "9": ".###.#...##...#.####....#....#.###.",
    "/": "....#....#...#...#...#...#....#....", "·": ".................#.................", "-": "...............#####...............", ".": "..............................##...", "&": ".#...#.#..#.#...#...#.#.##..#..##.#", "'": "..#....#...........................", "+": ".......#....#..#####..#....#......."
  };
  var EK = { "İ": ["I", 0, [2]], "Ö": ["O", 0, [1, 3]], "Ü": ["U", 0, [1, 3]], "Ğ": ["G", 0, [1, 2, 3]], "Â": ["A", 0, [2]], "Î": ["I", 0, [2]], "Û": ["U", 0, [2]], "Ç": ["C", 1, [2]], "Ş": ["S", 1, [2]] };

  var VARS = ["DİJİTABELA", "ADINIZ BURADA", "AÇIK · 7/24"], vi = 0, ad = "";
  var cols = 0, rows = 0, u = 8, N = 0, w = 0, h = 0, dpr = 1, cy = 0;
  var hx, hy, P, V, B, TB, SEED, veri, toz = 0;
  var gl = null, prog = null, buf = null, U = {}, cx2 = null;
  var fare = { x: 0, y: 0, var: false, t: 0 }, egim = [0, 0], egimH = [0, 0], kay = 0, T0 = performance.now(), canli = 0, gor = true, raf = 0;
  var fps = { n: 0, t: 0, v: 0 };

  /* Metni ızgaraya yerleştir: en büyük sığan ölçek, kelime kaydırma, ortala. */
  function yerlestir(metin) {
    var lit = new Uint8Array(cols * rows);
    var kel = Array.from(metin.toLocaleUpperCase("tr").replace(/\s+/g, " ").trim()).join("").split(" ").filter(Boolean).map(function (k) { return Array.from(k); });
    if (!kel.length) return lit;
    var kmax = cols < 70 ? 2 : 3, sat = null, k = 1;
    for (k = kmax; k >= 1; k--) {
      var mw = Math.floor((cols - 4) / k), L = [[]], gen = 0, sig = true;
      kel.forEach(function (c) {
        var g = c.length * 6 - 1;
        if (g > mw) { if (k > 1) sig = false; c = c.slice(0, Math.max(1, Math.floor((mw + 1) / 6))); g = c.length * 6 - 1; }
        if (gen && gen + 6 + g > mw) { L.push([]); gen = 0; }
        if (gen) { L[L.length - 1].push(" "); gen += 6; }
        Array.prototype.push.apply(L[L.length - 1], c); gen += g;
      });
      var yuk = L.length * 9 * k + (L.length - 1) * k;
      if (sig && yuk <= rows) { sat = L; break; }
      if (k === 1) sat = L.slice(0, Math.max(1, Math.floor((rows - 2) / 11)));
    }
    k = Math.max(1, k);
    var top = Math.max(0, Math.floor((rows - (sat.length * 9 * k + (sat.length - 1) * k)) / 2));
    sat.forEach(function (c, si) {
      var gen = (c.length * 6 - 1) * k, x0 = Math.max(0, Math.floor((cols - gen) / 2)), y0 = top + si * 10 * k;
      c.forEach(function (ch, ci) {
        var ek = EK[ch], tab = G[ek ? ek[0] : ch]; if (!tab) return;
        for (var gx = 0; gx < 5; gx++) for (var gy = 0; gy < 9; gy++) {
          var on = gy === 0 ? (ek && ek[1] === 0 && ek[2].indexOf(gx) > -1) : gy === 8 ? (ek && ek[1] === 1 && ek[2].indexOf(gx) > -1) : tab.charAt((gy - 1) * 5 + gx) === "#";
          if (!on) continue;
          for (var a = 0; a < k; a++) for (var b = 0; b < k; b++) { var X = x0 + (ci * 6 + gx) * k + a, Y = y0 + gy * k + b; if (X >= 0 && X < cols && Y >= 0 && Y < rows) lit[Y * cols + X] = 1; }
        }
      });
    });
    return lit;
  }

  function metinKur(metin, ani) {
    var lit = yerlestir(metin);
    for (var i = 0; i < N; i++) {
      var y = lit[i] ? 1 : 0;
      if (y === TB[i]) continue;
      TB[i] = y;
      if (ani) { B[i] = y; continue; }
      var a = Math.random() * 6.2832, r = 80 + Math.random() * (y ? 520 : 60);
      if (y) { P[i * 3] = hx[i] + Math.cos(a) * r; P[i * 3 + 1] = hy[i] + Math.sin(a) * r * 0.7; P[i * 3 + 2] = -260 + Math.random() * 900; B[i] = 0; V[i * 3] = V[i * 3 + 1] = V[i * 3 + 2] = 0; }
      else { V[i * 3] += Math.cos(a) * (3 + Math.random() * 9); V[i * 3 + 1] += Math.sin(a) * (3 + Math.random() * 9); V[i * 3 + 2] -= 4 + Math.random() * 14; }
    }
    canli = 240;
  }
  function simdikiMetin() { return ad || VARS[vi % VARS.length]; }

  var gos = D.getElementById("kah-olc");
  function olc() {
    var r = cv.getBoundingClientRect(); w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    dpr = Math.min(W.devicePixelRatio || 1, w < 700 ? 2 : 1.5);
    var zayif = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    cols = w < 600 ? 58 : w < 1100 ? 100 : 170; if (zayif) cols = Math.round(cols * 0.82);
    u = (w * 1.02) / cols;
    var ic = kap ? kap.querySelector(".kah-ic") : null, ust0 = w < 600 ? 14 : 22, altSinir = ic && ic.offsetTop > ust0 + 120 ? ic.offsetTop + 16 : h * 0.52;
    rows = Math.max(12, Math.min(60, Math.floor((altSinir - ust0) / u)));
    cy = h * 0.5 - ust0 - rows * u * 0.5;      // tabela: üst çubuğun altından yazı bloğunun üstüne kadar
    N = cols * rows; toz = AZ ? 0 : (w < 600 ? 90 : 220);
    hx = new Float32Array(N); hy = new Float32Array(N); P = new Float32Array(N * 3); V = new Float32Array(N * 3); B = new Float32Array(N); TB = new Uint8Array(N); SEED = new Float32Array(N + toz);
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { var i = y * cols + x; hx[i] = (x - (cols - 1) / 2) * u; hy[i] = ((rows - 1) / 2 - y) * u; P[i * 3] = hx[i]; P[i * 3 + 1] = hy[i]; SEED[i] = Math.random(); }
    veri = new Float32Array((N + toz) * 5);
    for (var t = 0; t < toz; t++) { var o = (N + t) * 5; SEED[N + t] = Math.random(); veri[o] = (Math.random() - 0.5) * w * 1.6; veri[o + 1] = (Math.random() - 0.5) * h * 1.3; veri[o + 2] = -250 + Math.random() * 1500; veri[o + 3] = -1; veri[o + 4] = SEED[N + t]; }
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    metinKur(simdikiMetin(), true);
    if (gos) gos.textContent = N.toLocaleString("tr-TR") + " LED · " + (gl ? "canlı çizim" : "durağan kare");
  }

  var VS = "attribute vec3 aP;attribute vec2 aB;uniform vec2 uR;uniform float uT,uS,uU,uD,uCy,uYn,uH;uniform vec2 uE;varying float vB,vR,vK,vF;" +
    "void main(){vec3 p=aP;float b=aB.x,s=aB.y;float F=900.;" +
    "if(b<0.){p.x+=sin(uT*.07+s*40.)*60.;p.y=mod(p.y+uT*(4.+s*9.)+uR.y*2.,uR.y*1.3)-uR.y*.65;p.y+=uS*uR.y*.5;float f=F/max(F+p.z,120.);gl_Position=vec4(p.xy*f/(uR*.5),0.,1.);gl_PointSize=uU*f*uD*(2.5+s*7.);vB=.05+.05*s;vR=0.;vK=1.;vF=1.;return;}" +
    "float yn=1.;if(uYn>.5){float t=clamp((p.y+uH*.5)/uH,0.,1.);p.y=-uH*.5-(p.y+uH*.5)*.42-uU*2.;yn=.26*(1.-t*.9)*step(.05,b);}float q=uS*uS;vec3 r=vec3(fract(s*7.13)-.5,fract(s*3.71)-.2,fract(s*5.37)-.5);" +
    "p.xy+=r.xy*q*vec2(1100.,900.)*(.25+b);p.z+=r.z*q*1400.*(.25+b);" +
    "float ax=uS*1.18+uE.y*.06-.05,ay=uE.x*.09+sin(uT*.23)*.03;float c=cos(ay),n=sin(ay);p=vec3(p.x*c+p.z*n,p.y,-p.x*n+p.z*c);c=cos(ax);n=sin(ax);p=vec3(p.x,p.y*c-p.z*n,p.y*n+p.z*c);" +
    "p.y+=uCy*(1.-uS)-uS*uR.y*.16;float f=F/max(F+p.z,120.);gl_Position=vec4(p.xy*f/(uR*.5),0.,1.);" +
    "float buy=mix(.64,2.3,smoothstep(0.,1.,b));gl_PointSize=max(1.5,uU*f*uD*buy);vR=.62/buy;vK=0.;" +
    "vB=b*(.82+.18*sin(uT*2.6+s*60.))*(1.-q*.55);vF=clamp(1.5-(F+p.z)/F*.62,0.,1.)*(1.-smoothstep(.75,1.,uS))*yn;}";
  var FS = "precision mediump float;varying float vB,vR,vK,vF;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;" +
    "if(vK>.5){float a=(1.-d)*(1.-d)*vB;gl_FragColor=vec4(vec3(1.,.72,.25)*a,a);return;}" +
    "float cek=smoothstep(vR,vR*.72,d);float hale=exp(-d*d*4.2)*.42*vB;" +
    "vec3 kor=mix(vec3(.098,.108,.132),vec3(1.,.69,0.),smoothstep(0.,.3,vB));kor+=vec3(.9,.8,.55)*vB*vB*.4;" +
    "vec3 c=(kor*cek+vec3(1.,.62,.05)*hale)*vF;gl_FragColor=vec4(c,max(c.r,c.g));}";

  function glKur() {
    try { gl = cv.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "high-performance" }); } catch (e) { gl = null; }
    if (!gl) return false;
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    try {
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch (e) { gl = null; return false; }
    gl.useProgram(prog); buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    var a = gl.getAttribLocation(prog, "aP"), b = gl.getAttribLocation(prog, "aB");
    gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 20, 0); gl.enableVertexAttribArray(b); gl.vertexAttribPointer(b, 2, gl.FLOAT, false, 20, 12);
    ["uR", "uT", "uS", "uU", "uD", "uCy", "uE", "uYn", "uH"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.clearColor(0, 0, 0, 0);
    return true;
  }

  function adim() {
    var mx = fare.x, my = fare.y, R = Math.max(70, u * 9), R2 = R * R, etkin = fare.var && kay < 0.2, hiz = 0;
    for (var i = 0; i < N; i++) {
      var j = i * 3, x = P[j], y = P[j + 1], z = P[j + 2], vx = V[j], vy = V[j + 1], vz = V[j + 2];
      vx += (hx[i] - x) * 0.055; vy += (hy[i] - y) * 0.055; vz += (0 - z) * 0.055;
      var hedef = TB[i];
      if (etkin) {
        var dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
        if (d2 < R2) { var d = Math.sqrt(d2) || 1, g = 1 - d / R; vx += dx / d * g * 5.5; vy += dy / d * g * 5.5; vz -= g * 9; if (!hedef) hedef = g * 0.55; }
      }
      vx *= 0.84; vy *= 0.84; vz *= 0.84; x += vx; y += vy; z += vz;
      P[j] = x; P[j + 1] = y; P[j + 2] = z; V[j] = vx; V[j + 1] = vy; V[j + 2] = vz;
      B[i] += (hedef - B[i]) * (hedef > B[i] ? 0.09 : 0.14);
      hiz += vx * vx + vy * vy;
    }
    if (hiz > N * 0.002 || etkin) canli = Math.max(canli, 30);
  }

  function ciz(t) {
    for (var i = 0; i < N; i++) { var o = i * 5, j = i * 3; veri[o] = P[j]; veri[o + 1] = P[j + 1]; veri[o + 2] = P[j + 2]; veri[o + 3] = B[i]; veri[o + 4] = SEED[i]; }
    gl.viewport(0, 0, cv.width, cv.height); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, veri, gl.DYNAMIC_DRAW);
    gl.uniform2f(U.uR, w, h); gl.uniform1f(U.uT, AZ ? 0 : (t - T0) / 1000); gl.uniform1f(U.uS, kay); gl.uniform1f(U.uU, u); gl.uniform1f(U.uD, dpr); gl.uniform1f(U.uCy, cy); gl.uniform2f(U.uE, egimH[0], egimH[1]);
    gl.uniform1f(U.uH, rows * u); gl.uniform1f(U.uYn, 1); gl.drawArrays(gl.POINTS, 0, N);      // zemindeki yansıma
    gl.uniform1f(U.uYn, 0); gl.drawArrays(gl.POINTS, 0, N + toz);
  }

  function ciz2B() {      // WebGL yoksa: durağan tabela
    cx2.setTransform(dpr, 0, 0, dpr, 0, 0); cx2.clearRect(0, 0, w, h);
    for (var i = 0; i < N; i++) { var x = w / 2 + hx[i], y = h / 2 - hy[i] - cy; cx2.fillStyle = TB[i] ? "#FFB000" : "#1B1E24"; cx2.beginPath(); cx2.arc(x, y, u * (TB[i] ? 0.36 : 0.28), 0, 6.2832); cx2.fill(); }
  }

  function kare(t) {
    raf = 0; if (!gor) return;
    if (canli > 0) { adim(); canli--; }
    egimH[0] += (egim[0] - egimH[0]) * 0.06; egimH[1] += (egim[1] - egimH[1]) * 0.06;
    ciz(t);
    fps.n++; if (t - fps.t > 1000) { fps.v = Math.round(fps.n * 1000 / (t - fps.t)); fps.n = 0; fps.t = t; if (gos) gos.textContent = N.toLocaleString("tr-TR") + " LED · " + fps.v + " kare/sn · canlı çizim"; }
    raf = requestAnimationFrame(kare);
  }
  function baslat() { if (gl && !AZ && !raf && gor) { fps.t = performance.now(); fps.n = 0; raf = requestAnimationFrame(kare); } }
  function tekKare() { if (gl) { for (var i = 0; i < N; i++) { P[i * 3] = hx[i]; P[i * 3 + 1] = hy[i]; P[i * 3 + 2] = 0; B[i] = TB[i]; } ciz(T0); } else if (cx2) ciz2B(); }

  function kaydir() {
    if (AZ || !kap) return;
    var r = kap.getBoundingClientRect(), yol = Math.max(1, r.height - W.innerHeight);
    kay = Math.max(0, Math.min(1, -r.top / yol));
    kap.style.setProperty("--kay", kay.toFixed(3));
  }

  function yenidenKur() { olc(); kaydir(); if (AZ || !gl) tekKare(); }

  if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { yenidenKur(); });
  if (!glKur()) { cx2 = cv.getContext("2d"); if (kap) kap.classList.add("gl-yok"); }
  olc();
  if (AZ || !gl) tekKare();

  var zt; W.addEventListener("resize", function () { clearTimeout(zt); zt = setTimeout(yenidenKur, 160); });
  W.addEventListener("scroll", kaydir, { passive: true }); kaydir();
  if ("IntersectionObserver" in W) new IntersectionObserver(function (g) { gor = g[0].isIntersecting && !D.hidden; baslat(); }).observe(cv);
  D.addEventListener("visibilitychange", function () { gor = !D.hidden; baslat(); });
  cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; });
  cv.addEventListener("webglcontextrestored", function () { if (glKur()) { yenidenKur(); baslat(); } });

  function isaret(e) {
    var r = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e; if (!p) return;
    fare.x = p.clientX - r.left - w / 2; fare.y = -(p.clientY - r.top - h / 2) - cy; fare.var = true; canli = Math.max(canli, 90);
    egim[0] = (p.clientX - r.left) / w * 2 - 1; egim[1] = (p.clientY - r.top) / h * 2 - 1;
  }
  if (kap && !AZ) {
    kap.addEventListener("pointermove", isaret, { passive: true });
    kap.addEventListener("pointerleave", function () { fare.var = false; egim[0] = egim[1] = 0; canli = Math.max(canli, 90); });
    kap.addEventListener("touchmove", isaret, { passive: true });
    kap.addEventListener("touchend", function () { fare.var = false; canli = Math.max(canli, 90); }, { passive: true });
  }

  /* Ad girilmemişken tabela kendi kendine üç ibare arasında dolaşır (kur/çöz gösterimi). */
  if (!AZ) setInterval(function () { if (ad || !gor || kay > 0.3 || (giris && D.activeElement === giris)) return; vi++; metinKur(simdikiMetin(), false); }, 4600);

  function yaz(t, ani) { ad = String(t || "").replace(/\s+/g, " ").trim().slice(0, 34); metinKur(simdikiMetin(), !!ani || AZ || !gl); if (AZ || !gl) tekKare(); }
  if (giris) giris.addEventListener("input", function () { yaz(giris.value); });
  W.F14LED = { yaz: yaz, durum: function () { return { nokta: N, toz: toz, sutun: cols, satir: rows, fps: fps.v, webgl: !!gl, kay: kay, yanan: Array.prototype.reduce.call(TB, function (a, b) { return a + b; }, 0) }; } };
  baslat();
})();
