// Dijitabela konuşan LED tabela — sunum ve prototip sayfaları için (9 Eki 2026, Alim Bey).
// Kullanım: sayfada bölümlere data-anlat="anahtar" verin, sonra:
//   <script>window.DJ_REHBER = { ses: "ses/", satirlar: { giris: { metin: "...", dugme: ["Prototipi aç", "1-beton/"] }, ... } };</script>
//   <script src="../_dijitabela/rehber.js" defer></script>
// Sayfa açılınca "giris" yazıyla söylenir; "Sesli dinle"ye dokununca (tarayıcı kuralı) sesli anlatır.
// Ziyaretçi aşağı indikçe görünen bölümün satırını anlatır; konuşurken araya giren bölümü bekletir (cümle yarıda kesilmez).
(function () {
  "use strict";
  var C = window.DJ_REHBER; if (!C || !C.satirlar) return;
  var css = document.createElement("style");
  css.textContent = ".djr{position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;align-items:flex-end;gap:10px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:min(440px,calc(100vw - 32px))}" +
    ".djr-tab{flex:none;width:96px;background:#16181D;border-radius:12px;padding:7px;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer;position:relative}" +
    ".djr-tab:before,.djr-tab:after{content:'';position:absolute;top:-10px;width:2px;height:10px;background:#16181D}.djr-tab:before{left:22px}.djr-tab:after{right:22px}" +
    ".djr-tab canvas{display:block;width:82px;height:48px}" +
    ".djr-bal{max-width:min(330px,calc(100vw - 130px));background:#fff;color:#16181D;border:1px solid #E3E0D8;border-radius:14px 14px 14px 4px;padding:12px 14px;font-size:.92rem;line-height:1.45;box-shadow:0 10px 30px rgba(0,0,0,.18)}" +
    ".djr-bal[hidden]{display:none}.djr-bal b{display:block;font-family:'Space Mono',monospace;font-size:.68rem;letter-spacing:.1em;color:#8A5A00;margin-bottom:4px}" +
    ".djr-alt{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.djr-alt a,.djr-alt button{font:inherit;font-size:.8rem;font-weight:800;padding:7px 11px;border-radius:8px;border:0;cursor:pointer;text-decoration:none}" +
    ".djr-ses{background:#FFB000;color:#16181D}.djr-git{background:#16181D;color:#fff}.djr-kapa{background:#F4F3EF;color:#646A75}" +
    "@media(max-width:600px){.djr-tab{width:78px}.djr-tab canvas{width:64px;height:38px}.djr-bal{font-size:.86rem}}" +
    "@media print{.djr{display:none}}";
  document.head.appendChild(css);
  var kok = document.createElement("div"); kok.className = "djr";
  kok.innerHTML = '<div class="djr-tab" title="Dijitabela tabela"><canvas width="164" height="96"></canvas></div><div class="djr-bal"><b>DİJİTABELA TABELA</b><span class="djr-yazi"></span><div class="djr-alt"></div></div>';
  document.body.appendChild(kok);
  var cv = kok.querySelector("canvas"), bal = kok.querySelector(".djr-bal"), yazi = kok.querySelector(".djr-yazi"), alt = kok.querySelector(".djr-alt");
  var AZ = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ses = new Audio(); ses.preload = "auto";
  var sesAcik = false, konusuyor = false, yaziyor = false, kirp = 0, aktif = null, sonAnlatilan = null, bekleyen = null, zaman;

  // 22x13 nokta yüz (ana sayfadaki tabelayla aynı): ^ ^ gözler, konuşurken ağız açılıp kapanır
  function ciz(t) {
    var x = cv.getContext("2d"), Cc = 22, R = 13, a = cv.width / Cc, b = cv.height / R, on = {};
    function ac(c, s) { on[s * Cc + c] = 1; }
    function goz(c) { if (kirp > 0) { for (var i = -2; i <= 2; i++) ac(c + i, 4); } else { ac(c - 2, 5); ac(c - 1, 4); ac(c, 3); ac(c + 1, 4); ac(c + 2, 5); } }
    goz(6); goz(15);
    var agiz = (konusuyor || yaziyor) && Math.floor(t / 110) % 2 === 0, c;
    if (agiz) { for (c = 8; c <= 13; c++) { ac(c, 8); ac(c, 11); } ac(7, 9); ac(7, 10); ac(14, 9); ac(14, 10); }
    else { ac(6, 8); ac(7, 9); ac(15, 8); ac(14, 9); for (c = 8; c <= 13; c++) ac(c, 10); }
    x.fillStyle = "#16181D"; x.fillRect(0, 0, cv.width, cv.height);
    for (var s = 0; s < R; s++) for (c = 0; c < Cc; c++) {
      var y = on[s * Cc + c], px = (c + .5) * a, py = (s + .5) * b, rr = Math.min(a, b) * .36;
      if (y) { x.fillStyle = "rgba(255,176,0,.22)"; x.beginPath(); x.arc(px, py, rr * 2.2, 0, 6.3); x.fill(); }
      x.fillStyle = y ? "#FFB000" : "#2C3038"; x.beginPath(); x.arc(px, py, rr, 0, 6.3); x.fill();
    }
  }
  function dongu(t) { if (kirp > 0) kirp--; else if (Math.random() < .006) kirp = 8; ciz(t); if (!AZ) requestAnimationFrame(dongu); }
  requestAnimationFrame(dongu); if (AZ) ciz(0);

  function dugmeler(s) {
    alt.innerHTML = "";
    if (!sesAcik) { var d = document.createElement("button"); d.className = "djr-ses"; d.textContent = "🔊 Sesli dinle"; d.onclick = function () { sesAcik = true; anlat(aktif || "giris", true); }; alt.appendChild(d); }
    if (s && s.dugme) { var g = document.createElement("a"); g.className = "djr-git"; g.textContent = s.dugme[0]; g.href = s.dugme[1]; alt.appendChild(g); }
    var k = document.createElement("button"); k.className = "djr-kapa"; k.textContent = sesAcik ? "Sustur" : "Kapat";
    k.onclick = function () { if (sesAcik) { sesAcik = false; ses.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); konusuyor = false; dugmeler(s); } else bal.hidden = true; };
    alt.appendChild(k);
  }
  // Anlatım bitince balon kendiliğinden kapanır (telefonda içeriği kapatmasın); tabelaya dokununca yeniden açılır
  var gizleZ; function gizleKur() { clearTimeout(gizleZ); gizleZ = setTimeout(function g() { if (konusuyor || yaziyor) gizleZ = setTimeout(g, 1500); else bal.hidden = true; }, innerWidth < 600 ? 6000 : 10000); }
  function soyle(metin) {
    clearInterval(zaman); bal.hidden = false;
    if (AZ) { yazi.textContent = metin; return; }
    var i = 0; yaziyor = true; yazi.textContent = "";
    zaman = setInterval(function () { i += 2; yazi.textContent = metin.slice(0, i); if (i >= metin.length) { clearInterval(zaman); yaziyor = false; gizleKur(); } }, 26);
  }
  ses.addEventListener("ended", function () { konusuyor = false; sonraki(); });
  ses.addEventListener("error", function () { konusuyor = false; });
  function anlat(id, zorla) {
    var s = C.satirlar[id]; if (!s) return;
    if (konusuyor && !zorla) { bekleyen = id; return; }
    sonAnlatilan = id; soyle(s.metin); dugmeler(s);
    if (sesAcik && C.tts && window.speechSynthesis) {
      // Otomatik tabela (tabela-oto.js): kayıtlı ses yok, cihazın Türkçe sesi
      var u = new SpeechSynthesisUtterance(s.metin); u.lang = "tr-TR"; u.rate = 1.02;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^tr/i.test(x.lang); })[0]; if (v) u.voice = v;
      u.onend = u.onerror = function () { konusuyor = false; sonraki(); };
      speechSynthesis.cancel(); konusuyor = true; speechSynthesis.speak(u);
    } else if (sesAcik && C.ses !== false) {
      ses.pause(); ses.src = (C.ses || "ses/") + (s.dosya || id) + ".mp3"; konusuyor = true;
      var p = ses.play(); if (p && p.catch) p.catch(function () { konusuyor = false; sesAcik = false; dugmeler(s); });
    }
  }
  function sonraki() { if (bekleyen && bekleyen !== sonAnlatilan) { var b = bekleyen; bekleyen = null; anlat(b); } else if (aktif && aktif !== sonAnlatilan) anlat(aktif); }
  kok.querySelector(".djr-tab").onclick = function () { bal.hidden = false; if (!sesAcik) { sesAcik = true; } anlat(aktif || "giris", true); };

  // Görünen bölüm: ekranın ortasına en yakın data-anlat
  var bolumler = [].slice.call(document.querySelectorAll("[data-anlat]"));
  function bul() {
    var orta = innerHeight * .45, en = null, mes = 1e9;
    bolumler.forEach(function (e) { var r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var d = Math.abs((r.top + r.bottom) / 2 - orta); if (d < mes) { mes = d; en = e; } });
    return en && en.getAttribute("data-anlat");
  }
  var bekle;
  addEventListener("scroll", function () { clearTimeout(bekle); bekle = setTimeout(function () { var id = bul(); if (!id || id === aktif) return; aktif = id; if (!konusuyor) anlat(id); else bekleyen = id; }, 350); }, { passive: true });
  aktif = "giris"; anlat("giris");
})();
