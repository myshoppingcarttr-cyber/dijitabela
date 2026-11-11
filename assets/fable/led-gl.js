/* Dijitabela · kahraman sahnesi: perspektifte LED nokta duvarı (WebGL, tek çizim çağrısı, kütüphane yok).
   Duvardaki yazı gerçek LED tabela gibi nokta nokta kayar. Telefonda üst bantta "tabela", masaüstünde sağdan sola derinleşen duvar.
   prefers-reduced-motion: tek sabit kare. WebGL yoksa CSS nokta zemini (.gl-yok). */
(function () {
  "use strict";
  // Telefonda sahne ilk dokunuş/kaydırmada ya da 3,5 sn sonra kurulur; o ana dek CSS nokta zemini görünür (ilk yükleme hafif kalır)
  var dar = window.innerWidth < 1000, kuruldu = false;
  function kur() {
  if (kuruldu) return; kuruldu = true;
  var kh = document.querySelector(".kahraman"), cv = kh && kh.querySelector("canvas.led");
  if (!cv) return;
  var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gl = null;
  try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) || cv.getContext("experimental-webgl"); } catch (e) {}
  if (!gl) { kh.classList.add("gl-yok"); cv.remove(); return; }

  /* ---- 5×7 nokta harfler (Türkçe işaretler üst/alt ek satırla) ---- */
  var G = {
    A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.", C: ".###.#...##....#....#....#...#.###.", D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####",
    F: "######....#....####.#....#....#....", G: ".###.#...##....#.####...##...#.####", H: "#...##...##...#######...##...##...#", I: ".###...#....#....#....#....#...###.", J: "..###...#....#....#....##..#..##...",
    K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####", M: "#...###.###.#.##.#.##...##...##...#", N: "#...##...###..##.#.##..###...##...#", O: ".###.#...##...##...##...##...#.###.",
    P: "####.#...##...#####.#....#....#....", R: "####.#...##...#####.#.#..#..#.#...#", S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..", U: "#...##...##...##...##...##...#.###.",
    V: "#...##...##...##...##...#.#.#...#..", Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
    "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####", "4": "...#...##..#.#.#..#.#####...#....#.", "7": "#####....#...#...#...#....#....#...",
    " ": "...................................", "/": "....#....#...#...#...#...#....#....", "·": ".................#................."
  };
  var EK = { "İ": ["I", 0, [2]], "Ö": ["O", 0, [1, 3]], "Ü": ["U", 0, [1, 3]], "Ğ": ["G", 0, [1, 2, 3]], "Â": ["A", 0, [2]], "Ç": ["C", 1, [2]], "Ş": ["S", 1, [2]] };
  function sutunlar(metin) { // her sütun 9 satır: 1 üst ek + 7 gövde + 1 alt ek
    var s = [];
    Array.from(metin.toLocaleUpperCase("tr")).forEach(function (ch) {
      var ek = EK[ch], tab = G[ek ? ek[0] : ch] || G[" "];
      for (var x = 0; x < 5; x++) { var c = [ek && ek[1] === 0 && ek[2].indexOf(x) > -1 ? 1 : 0]; for (var y = 0; y < 7; y++) c.push(tab.charAt(y * 5 + x) === "#" ? 1 : 0); c.push(ek && ek[1] === 1 && ek[2].indexOf(x) > -1 ? 1 : 0); s.push(c); }
      s.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
    return s;
  }
  var SATIR = ["WEB SİTESİ · GOOGLE · SOSYAL MEDYA · YAPAY ZEKÂ ASİSTANI · OTOMASYON · ", "AÇIK · 7/24 CEVAP · RANDEVU YAZILDI · YORUM CEVAPLANDI · ", "ANGARYAYI BİZ ALALIM · SİZ İŞİNİZE BAKIN · ", "ANTALYA · TÜRKİYE GENELİNE UZAKTAN · ", "DÜKKÂNI SİZ AÇIN · DİJİTALDE AÇIK TUTMAK BİZDEN · "].map(sutunlar);
  var HIZ = [1, -1, 1, -1, 1], kay = [0, 40, 12, 70, 25];
  var TW = 256, TH = 64, veri = new Uint8Array(TW * TH);

  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision highp float;",
    "uniform vec2 uR;uniform float uT,uS,uYaw,uPitch,uYc,uMod;uniform vec2 uBant,uPtr;uniform sampler2D uN,uL;",
    "const float F=1.9,D=2.4;const vec2 TS=vec2(256.,64.);",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "vec3 duvar(vec2 uv,out float t,vec3 n,vec3 r,vec3 u,vec3 P0){vec3 d=normalize(vec3(uv,-F));t=dot(P0,n)/dot(d,n);vec3 q=d*t-P0;return vec3(dot(q,r),dot(q,u),t);}",
    "void main(){",
    " float asp=uR.x/uR.y;vec2 uv=(gl_FragCoord.xy/uR*2.-1.)*vec2(asp,1.);",
    " vec3 bg=vec3(.055,.059,.071);",
    " vec3 n=normalize(vec3(sin(uYaw)*cos(uPitch),sin(uPitch),cos(uYaw)*cos(uPitch)));vec3 r=normalize(cross(vec3(0.,1.,0.),n));vec3 u=cross(n,r);",
    " vec3 P0=vec3(mix(.42*asp,0.,uMod),uYc*D/F,-D);",
    " float t;vec3 h=duvar(uv,t,n,r,u,P0);",
    " if(t<=0.){gl_FragColor=vec4(bg,1.);return;}",
    " vec2 g=h.xy/uS;vec2 id=floor(g);vec2 f=fract(g)-.5;float len=length(f);",
    " float aa=1.5*t/(F*uR.y*.5*uS);float dotM=1.-smoothstep(.34-aa,.34+aa,len);float net=clamp(1.-aa*1.1,0.,1.);",
    " vec2 tc=vec2(mod(id.x+128.,256.),id.y+32.);",
    " float ic=step(0.,tc.y)*step(tc.y,63.);",
    " float v=texture2D(uN,(tc+.5)/TS).r*ic;",
    " float hal=texture2D(uL,(vec2(mod(g.x+128.,256.),g.y+32.))/TS).r*ic;",
    " float tw=step(.9965,hash(id+floor(uT*1.4)))*.75;",
    " float tt;vec3 ph=duvar(uPtr*vec2(asp,1.),tt,n,r,u,P0);vec2 pd=(h.xy-ph.xy)/uS;float pg=step(-1.5,uPtr.x)*.6*exp(-dot(pd,pd)/14.);",
    " v=max(v,max(tw,pg));",
    " float sis=exp(-max(t-2.2,0.)*.42);",
    " float mm=mix(mix(.07,1.,smoothstep(-.10*asp,.34*asp,uv.x)),smoothstep(uBant.x,uBant.y,uv.y),uMod)*sis;",
    " vec3 off=vec3(.118,.128,.150);vec3 on=mix(vec3(1.,.69,0.),vec3(1.,.87,.5),1.-smoothstep(0.,.24,len));",
    " float iz=mix(.22,dotM,net);",
    " vec3 c=mix(bg,off,iz*.85*max(mm,mix(.42,0.,uMod)));",
    " c+=on*iz*v*mm+vec3(1.,.62,0.)*hal*.10*mm;",
    " gl_FragColor=vec4(c,1.);",
    "}"].join("\n");

  function derle(tur, k) { var s = gl.createShader(tur); gl.shaderSource(s, k); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  var pr, U = {};
  try {
    pr = gl.createProgram(); gl.attachShader(pr, derle(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, derle(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error("link");
  } catch (e) { kh.classList.add("gl-yok"); cv.remove(); return; }
  gl.useProgram(pr);
  ["uR", "uT", "uS", "uYaw", "uPitch", "uYc", "uMod", "uBant", "uPtr", "uN", "uL"].forEach(function (a) { U[a] = gl.getUniformLocation(pr, a); });
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  function doku(birim, suz) { var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + birim); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, suz); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, suz); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, TW, TH, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, veri); return t; }
  doku(0, gl.NEAREST); doku(1, gl.LINEAR); gl.uniform1i(U.uN, 0); gl.uniform1i(U.uL, 1);

  var mobil = false, W = 0, H = 0, ptr = [-9, -9], hedef = [0, 0], egim = [0, 0];
  function olc() {
    var r = kh.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, r.width < 1000 ? 1.25 : 1.5);
    W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); }
    mobil = r.width < 1000;
    var hedefPx = (mobil ? 8.5 : 15) * dpr;                       // bir LED hücresinin ekrandaki boyu
    gl.uniform2f(U.uR, W, H); gl.uniform1f(U.uS, hedefPx * 2.4 / (1.9 * H * 0.5)); gl.uniform1f(U.uMod, mobil ? 1 : 0);
    if (mobil) {
      var ic = kh.querySelector(".kahraman-ic"), bant = Math.max(120, parseFloat(getComputedStyle(ic).paddingTop) - 18), alt = 1 - 2 * bant / r.height;
      gl.uniform2f(U.uBant, alt - 0.02, alt + 0.05); gl.uniform1f(U.uYc, (1 + alt) / 2 + 0.01);
    } else { gl.uniform2f(U.uBant, -2, -1.5); gl.uniform1f(U.uYc, 0.04); }
  }
  function yaz() { // kayan yazıyı dokuya işle
    veri.fill(0);
    var bantlar = mobil ? [0, 1] : [0, 1, 2, 3, 4], taban = mobil ? 21 : 5, nb = bantlar.length;
    for (var i = 0; i < nb; i++) {
      var s = SATIR[bantlar[i]], L = s.length, o = ((kay[bantlar[i]] % L) + L) % L, y0 = taban + (nb - 1 - i) * 11;
      for (var x = 0; x < TW; x++) { var c = s[(x + o) % L]; for (var gy = 0; gy < 9; gy++) if (c[gy]) veri[(y0 + 8 - gy) * TW + x] = 255; }
    }
    for (var b = 0; b < 2; b++) { gl.activeTexture(gl.TEXTURE0 + b); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TW, TH, gl.LUMINANCE, gl.UNSIGNED_BYTE, veri); }
  }
  function ciz(zaman) {
    egim[0] += (hedef[0] - egim[0]) * 0.12; egim[1] += (hedef[1] - egim[1]) * 0.12;
    gl.uniform1f(U.uT, zaman / 1000); gl.uniform1f(U.uYaw, (mobil ? -0.30 : -0.38) + egim[0] * 0.07); gl.uniform1f(U.uPitch, (mobil ? 0.16 : 0.03) + egim[1] * 0.05);
    gl.uniform2f(U.uPtr, ptr[0], ptr[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  olc(); yaz(); ciz(0);
  if (azHareket) { window.addEventListener("resize", function () { olc(); yaz(); ciz(0); }); return; }

  var gorunur = true, son = 0, kare = 0;
  function dongu(z) {
    kare = 0;
    if (!gorunur || document.hidden) return;
    if (z - son > 85) { son = z; for (var i = 0; i < kay.length; i++) kay[i] += HIZ[i]; yaz(); }
    ciz(z); kare = requestAnimationFrame(dongu);
  }
  function baslat() { if (!kare) kare = requestAnimationFrame(dongu); }
  var hazir = !mobil; setTimeout(function () { hazir = true; }, 5200);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (g) { gorunur = g[0].isIntersecting; if (gorunur && hazir) baslat(); }).observe(kh);
  document.addEventListener("visibilitychange", baslat);
  var rt = 0; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { olc(); yaz(); }, 120); });
  if (!(window.matchMedia && matchMedia("(hover: none)").matches)) {
    kh.addEventListener("pointermove", function (e) { var r = kh.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2 - 1, y = 1 - (e.clientY - r.top) / r.height * 2; ptr = [x, y]; hedef = [x, y]; });
    kh.addEventListener("pointerleave", function () { ptr = [-9, -9]; hedef = [0, 0]; });
  }
  cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); kh.classList.add("gl-yok"); gorunur = false; });
  // Telefonda ilk kare sabit çizilir; kayan yazı ilk dokunuş/kaydırmada ya da 5 sn sonra başlar (ilk yükleme hafif kalsın)
  if (mobil) { var bir = false, ac = function () { if (bir) return; bir = true; baslat(); }; ["touchstart", "scroll", "pointerdown"].forEach(function (o) { window.addEventListener(o, ac, { passive: true, once: true }); }); setTimeout(ac, 5000); }
  else baslat();
  kh.classList.remove("gl-bekle");
  }
  if (!dar) return kur();
  var k0 = document.querySelector(".kahraman"); if (k0) k0.classList.add("gl-bekle");
  ["touchstart", "scroll", "pointerdown"].forEach(function (o) { window.addEventListener(o, kur, { passive: true, once: true }); }); setTimeout(kur, 3500);
})();
