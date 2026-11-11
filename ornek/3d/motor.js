/* Dijitabela · Kodla 3D sahne motoru (11 Kas 2026)
   Kütüphane yok: ham WebGL1 + GLSL. Görsel, video, 3D model dosyası yok; sahnenin tamamı matematikle çizilir.
   Performans: DPR ve piksel bütçesi sınırı, kare süresine göre otomatik çözünürlük, görünmezken durur,
   prefers-reduced-motion'da tek statik kare, WebGL yoksa CSS degrade (host'a .gl-yok sınıfı).
   Kullanım: Sahne3D.kur({canvas, frag, on:{frag,w,h,mip}|{frag,statik:true,serit}, saat:0.3, ...}) */
(function () {
  "use strict";
  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

  function kur(o) {
    var cv = o.canvas, host = o.host || cv.parentNode;
    var q = new URLSearchParams(location.search);
    var sabitKalite = q.get("kalite") === "1";
    var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (q.get("statik") === "1") azHareket = true;
    var mobil = Math.min(screen.width, screen.height) < 700 || (window.matchMedia && matchMedia("(pointer:coarse)").matches);
    var gl = null, P = null, Pon = null, buf = null;
    var onA = null, onB = null, onW = 0, onH = 0, onHazir = false, onSerit = 0, onKirli = true, onSaat = -1;
    var olcek = 1, ema = 16, kareSay = 0, yukari = 0;
    var gorunur = true, sekmeAcik = !document.hidden, calisiyor = false, rafId = 0, kirli = true;
    var fare = [0, 0], fareH = [0, 0], saat = o.saat == null ? 0.3 : o.saat, saatH = saat, kay = 0;
    var t0 = performance.now(), tSon = t0, T = o.sabitT || 0, ilkKare = false;
    var sabitT = q.get("t") ? parseFloat(q.get("t")) : null;

    function yok(neden) {
      host.classList.add("gl-yok");
      if (neden && window.console) console.warn("3D sahne kapalı, degrade yedeği gösteriliyor: " + neden);
    }
    function derle(tur, kaynak) {
      var s = gl.createShader(tur); gl.shaderSource(s, kaynak); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { var m = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(m); }
      return s;
    }
    function program(frag) {
      var hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      var bas = "precision " + (hp && hp.precision > 0 ? "highp" : "mediump") + " float;\n" +
        "uniform vec2 uRes;uniform float uT;uniform vec2 uFare;uniform float uSaat;uniform float uKay;uniform sampler2D uOn;uniform vec2 uOnRes;uniform float uMobil;\n";
      var p = gl.createProgram();
      gl.attachShader(p, derle(gl.VERTEX_SHADER, VS)); gl.attachShader(p, derle(gl.FRAGMENT_SHADER, bas + frag));
      gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      var u = {}; ["uRes", "uT", "uFare", "uSaat", "uKay", "uOn", "uOnRes", "uMobil"].forEach(function (n) { u[n] = gl.getUniformLocation(p, n); });
      return { p: p, u: u };
    }
    function hedef(w, h, mip) {
      var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mip ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (mip) gl.generateMipmap(gl.TEXTURE_2D);
      var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tx: tx, fb: fb, w: w, h: h };
    }
    function hedefSil(h) { if (h) { gl.deleteTexture(h.tx); gl.deleteFramebuffer(h.fb); } }

    function baslat() {
      try {
        var ayar = { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: false };
        gl = cv.getContext("webgl", ayar) || cv.getContext("experimental-webgl", ayar);
      } catch (e) { gl = null; }
      if (!gl) { yok("WebGL desteklenmiyor"); return false; }
      try {
        P = program(o.frag);
        if (o.on) Pon = program(o.on.frag);
      } catch (e) { yok(String(e.message || e).slice(0, 300)); gl = null; return false; }
      buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      onA = onB = null; onHazir = false; onKirli = true; onSerit = 0;
      boyut();
      return true;
    }

    function boyut() {
      if (!gl) return;
      var r = cv.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, o.maxDpr || (mobil ? 1.5 : 1.75));
      var w = Math.max(2, r.width * dpr), h = Math.max(2, r.height * dpr);
      var butce = o.maxPiksel || (mobil ? 0.85e6 : 1.9e6);
      var k = Math.min(1, Math.sqrt(butce / (w * h))) * olcek;
      w = Math.round(w * k); h = Math.round(h * k);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w; cv.height = h; kirli = true;
        if (o.on && o.on.statik) onKirli = true;
      }
    }

    function tek(prog, w, h, tex) {
      gl.useProgram(prog.p);
      gl.uniform2f(prog.u.uRes, w, h); gl.uniform1f(prog.u.uT, T);
      gl.uniform2f(prog.u.uFare, fareH[0], fareH[1]); gl.uniform1f(prog.u.uSaat, saatH); gl.uniform1f(prog.u.uKay, kay);
      gl.uniform1f(prog.u.uMobil, mobil ? 1 : 0);
      if (tex) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex.tx); gl.uniform1i(prog.u.uOn, 0); gl.uniform2f(prog.u.uOnRes, tex.w, tex.h); }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Ön geçiş. Dinamik (her kare, sabit boyut, mipmap) ya da statik (tuval boyutunda, şeritler hâlinde, bitince takas).
    function onGecis() {
      var c = o.on;
      if (!c.statik) {
        if (!onA) onA = hedef(c.w, c.h, !!c.mip);
        gl.bindFramebuffer(gl.FRAMEBUFFER, onA.fb); gl.viewport(0, 0, c.w, c.h);
        tek(Pon, c.w, c.h, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (c.mip) { gl.bindTexture(gl.TEXTURE_2D, onA.tx); gl.generateMipmap(gl.TEXTURE_2D); }
        onHazir = true; return;
      }
      if (onKirli && onSerit === 0) {
        if (!onB || onB.w !== cv.width || onB.h !== cv.height) { hedefSil(onB); onB = hedef(cv.width, cv.height, false); }
        onKirli = false; onSerit = 1; onSaat = saat;
      }
      if (onSerit > 0) {
        var n = c.serit || 16, sh = Math.ceil(onB.h / n), sv = saatH;
        saatH = onSaat;
        gl.bindFramebuffer(gl.FRAMEBUFFER, onB.fb); gl.viewport(0, 0, onB.w, onB.h);
        gl.enable(gl.SCISSOR_TEST); gl.scissor(0, (onSerit - 1) * sh, onB.w, sh);
        tek(Pon, onB.w, onB.h, null);
        gl.disable(gl.SCISSOR_TEST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        saatH = sv;
        if (++onSerit > n) {
          onSerit = 0; var e = onA; onA = onB; onB = e; onHazir = true; kirli = true;
          if (Math.abs(onSaat - saat) > 0.004) onKirli = true;
        }
      }
    }

    function kare(simdi) {
      rafId = 0; calisiyor = false;
      if (!gl) return;
      var dt = simdi - tSon; tSon = simdi;
      if (sabitT != null) T = sabitT; else if (!azHareket) T += Math.min(dt, 100) / 1000; else T = o.sabitT || 18;
      var a = azHareket ? 1 : 1 - Math.pow(0.001, Math.min(dt, 100) / 1000);
      fareH[0] += (fare[0] - fareH[0]) * a; fareH[1] += (fare[1] - fareH[1]) * a;
      if (!(o.on && o.on.statik)) saatH += (saat - saatH) * (azHareket ? 1 : Math.min(1, a * 1.6));
      if (o.on) onGecis();
      if (!o.on || onHazir) {
        gl.viewport(0, 0, cv.width, cv.height);
        tek(P, cv.width, cv.height, o.on ? onA : null);
        if (!ilkKare) { ilkKare = true; host.classList.add("gl-hazir"); if (o.hazir) o.hazir(); }
      }
      kirli = false;
      // otomatik çözünürlük
      if (!azHareket && !sabitKalite && dt < 100 && ilkKare) {
        ema += (dt - ema) * 0.08; kareSay++;
        if (kareSay > 45) {
          if (ema > 24 && olcek > 0.5) { olcek = Math.max(0.5, olcek * 0.84); kareSay = 0; ema = 16; boyut(); }
          else if (ema < 11 && olcek < 1 && yukari < 2 && kareSay > 240) { olcek = Math.min(1, olcek * 1.12); yukari++; kareSay = 0; boyut(); }
        }
      }
      planla();
    }
    function bekleyen() {
      return kirli || (o.on && o.on.statik && (onKirli || onSerit > 0)) || Math.abs(saat - saatH) > 0.002 ||
        Math.abs(fare[0] - fareH[0]) + Math.abs(fare[1] - fareH[1]) > 0.002;
    }
    function planla() {
      if (calisiyor || !gl) return;
      if (!sekmeAcik || !gorunur) return;
      if (azHareket && !bekleyen()) return;
      calisiyor = true; rafId = requestAnimationFrame(kare);
    }

    if (!baslat()) return null;

    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); if (rafId) cancelAnimationFrame(rafId); calisiyor = false; gl = null; }, false);
    cv.addEventListener("webglcontextrestored", function () { if (baslat()) { kirli = true; planla(); } }, false);
    var bz = 0;
    window.addEventListener("resize", function () { clearTimeout(bz); bz = setTimeout(function () { boyut(); planla(); }, 120); });
    document.addEventListener("visibilitychange", function () { sekmeAcik = !document.hidden; tSon = performance.now(); planla(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (g) { gorunur = g[0].isIntersecting; tSon = performance.now(); planla(); }, { threshold: 0.01 }).observe(cv);
    }
    if (!azHareket) {
      window.addEventListener("pointermove", function (e) {
        var r = cv.getBoundingClientRect();
        fare[0] = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        fare[1] = Math.max(-1, Math.min(1, 1 - ((e.clientY - r.top) / r.height) * 2));
      }, { passive: true });
      window.addEventListener("scroll", function () {
        var r = cv.getBoundingClientRect(); kay = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      }, { passive: true });
    }
    planla();

    return {
      saatAyarla: function (v) { saat = Math.max(0, Math.min(1, v)); if (o.on && o.on.statik) { saatH = saat; if (Math.abs(saat - onSaat) > 0.004) onKirli = true; } planla(); },
      durum: function () { return { w: cv.width, h: cv.height, olcek: olcek, ms: ema, hazir: ilkKare }; },
      // kıyas: n kareyi art arda çizer, kare başına GPU süresini (ms) döndürür (yalnız ölçüm için)
      kiyas: function (n) {
        if (!gl) return -1;
        var px = new Uint8Array(4), t = performance.now();
        for (var i = 0; i < n; i++) {
          T += 0.016;
          if (o.on && !o.on.statik) onGecis();
          gl.viewport(0, 0, cv.width, cv.height); tek(P, cv.width, cv.height, o.on ? onA : null);
        }
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        var kare = (performance.now() - t) / n, on = 0;
        if (o.on && o.on.statik && onB) {
          t = performance.now();
          gl.bindFramebuffer(gl.FRAMEBUFFER, onB.fb); gl.viewport(0, 0, onB.w, onB.h); tek(Pon, onB.w, onB.h, null);
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          on = performance.now() - t;
        }
        return { kare: kare, onGecis: on };
      }
    };
  }
  window.Sahne3D = { kur: kur };
})();
