/* Dijitabela sektör demo sayfaları ortak betiği (12 Eki 2026, Elif).
   DEMO.kur({ onek, adimlar:[metin,...], slug }) -> adım şeridi + sesli anlat (Cartesia mp3: assets/yeni/demo-ses/<onek>-N.mp3)
   DEMO.izle(ad) -> izle.js'e olay yazar. DEMO.saat(dk) -> sahte saat. DEMO.esc(t) */
(function () {
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var D = window.DEMO = { adim: 0, ses: false, au: null, onek: "", metinler: [], dk: 9 * 60 + 40 };
  D.esc = function (t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>"); };
  D.saat = function (a) { D.dk += a || 1; return String(Math.floor(D.dk / 60)).padStart(2, "0") + ":" + String(D.dk % 60).padStart(2, "0"); };
  D.izle = function (ad) { try { if (window.djIzle) window.djIzle(ad); } catch (e) {} };
  D.cal = function () { try { if (D.au) D.au.pause(); D.au = new Audio("assets/yeni/demo-ses/" + D.onek + "-" + (D.adim + 1) + ".mp3"); D.au.play().catch(function () {}); } catch (e) {} };
  D.git = function (n) { D.adim = n; var no = $("#d-no"), y = $("#d-yazi"); if (no) no.textContent = "Adım " + (n + 1) + " / " + D.metinler.length; if (y) y.textContent = D.metinler[n]; if (D.ses) D.cal(); };
  D.kur = function (o) {
    D.onek = o.onek; D.metinler = o.adimlar;
    var b = $("#d-ses");
    if (b) b.addEventListener("click", function () {
      D.ses = !D.ses; b.setAttribute("aria-pressed", D.ses); b.textContent = D.ses ? "🔇 Sesi kapat" : "🔊 Sesli anlat";
      if (D.ses) D.cal(); else if (D.au) D.au.pause(); D.izle(o.onek + ":ses " + (D.ses ? "açık" : "kapalı"));
    });
    D.git(0);
  };
  D.balon = function (sohbet, html, ben, zaman, taslak) {
    var d = document.createElement("div"); d.className = "msj " + (ben ? "ben" : "o") + (taslak ? " taslak" : "");
    d.innerHTML = html + "<time>" + (zaman || "") + (ben && !taslak ? " ✓✓" : "") + "</time>"; sohbet.appendChild(d); sohbet.scrollTop = 1e5; return d;
  };
})();
