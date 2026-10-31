/* BUGÜNÜN HEDEFLERİ bandı (31 Eki 2026) — ofis.html + ofis-canli.html. Veri: gorev_gunluk (RLS: yalnız yönetici oturumu okur).
   Yazan: DIJITABELA/OTOMASYON/gunluk-kontrol/gunluk-kontrol.js (30 dk'da bir). window.__sb = oturumlu supabase istemcisi. */
(function () {
  var RENK = { TAMAM: "#1E9E5A", YOLDA: "#E0A100", "GECİKTİ": "#D64545", ATLANDI: "#9AA0A8", "BİLGİ": "#6B7280" };
  var AD = { kerem: "Kerem", selin: "Selin", murat: "Murat", zeynep: "Zeynep", arda: "Arda", can: "Can" };
  var css = '.gb{font-family:inherit;margin:0 0 16px;color:#16181D}.gb *{box-sizing:border-box}.gb h2{font-size:.78rem;letter-spacing:.12em;font-weight:800;margin:0 0 8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.gb h2 small{font-weight:600;letter-spacing:0;color:#646A75}' +
    '.gb-sayac span{display:inline-block;padding:2px 9px;border-radius:999px;color:#fff;font-size:.72rem;font-weight:800;letter-spacing:0}' +
    '.gb-izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}@media(max-width:560px){.gb-izgara{grid-template-columns:1fr 1fr}}@media(max-width:380px){.gb-izgara{grid-template-columns:1fr}}' +
    '.gb-k{background:#fff;border:1px solid #DDD9CF;border-left:6px solid var(--c);border-radius:12px;padding:9px 10px;cursor:pointer;min-width:0}.gb-k.gb-kir{background:#FDEDED;animation:gbn 1.6s infinite}@keyframes gbn{50%{box-shadow:0 0 0 3px rgba(214,69,69,.35)}}' +
    '.gb-k b{display:block;font-size:.8rem;line-height:1.25}.gb-k .gb-s{font:700 1.15rem "Space Mono",monospace;color:var(--c)}.gb-k .gb-n{font-size:.7rem;color:#646A75;line-height:1.35;margin-top:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gb-k.ac .gb-n{display:block}.gb-k .gb-z{font-size:.65rem;color:#9AA0A8;margin-top:3px}.gb-k .gb-o{font-size:.68rem;color:#14703F;margin-top:3px}' +
    '.gb-gec{overflow-x:auto;background:#fff;border:1px solid #DDD9CF;border-radius:12px;padding:8px}.gb-gec table{border-collapse:collapse;font-size:.68rem;min-width:100%}.gb-gec td,.gb-gec th{padding:3px 4px;text-align:center;white-space:nowrap}.gb-gec td:first-child,.gb-gec th:first-child{text-align:left;position:sticky;left:0;background:#fff;max-width:150px;overflow:hidden;text-overflow:ellipsis}.gb-gec i{display:inline-block;width:18px;height:18px;border-radius:5px;background:var(--c)}' +
    '.gb-alarm{outline:3px solid #D64545!important;outline-offset:-1px;animation:gbn 1.4s infinite;position:relative}.gb-rozet{position:absolute;left:6px;right:6px;top:-9px;z-index:30;background:#D64545;color:#fff;font:800 .66rem/1.25 system-ui,sans-serif;padding:3px 7px;border-radius:8px;animation:gbr 1s infinite;pointer-events:none;text-align:left}@keyframes gbr{50%{opacity:.55}}' +
    '@media(prefers-color-scheme:dark){.gb{color:#eee}.gb-k,.gb-gec,.gb-gec td:first-child,.gb-gec th:first-child{background:#1c1f26;border-color:#333}.gb-k.gb-kir{background:#3a1c1c}}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  var ust = document.createElement("section"); ust.className = "gb"; ust.id = "gb-ust"; ust.hidden = true;
  var alt = document.createElement("section"); alt.className = "gb"; alt.id = "gb-alt"; alt.hidden = true; alt.style.marginTop = "18px";
  function yerlestir() {
    var uyg = document.getElementById("uyg"), duzen = document.getElementById("duzen");
    if (uyg) { var ref = uyg.querySelector(".sayac"); uyg.insertBefore(ust, ref || uyg.firstChild); uyg.appendChild(alt); }
    else if (duzen) { duzen.parentNode.insertBefore(ust, duzen); duzen.parentNode.insertBefore(alt, duzen.nextSibling); ust.style.cssText = "max-width:1400px;margin:8px auto;padding:0 12px"; alt.style.cssText = "max-width:1400px;margin:14px auto;padding:0 12px"; }
    else document.body.insertBefore(ust, document.body.firstChild);
  }
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var saat = function (d) { return new Date(d).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }); };
  var VERI = [], BUGUN = "";
  function alarmUygula() {
    var kirmizi = {}; VERI.filter(function (r) { return r.gun === BUGUN && r.durum === "GECİKTİ" && r.personel; }).forEach(function (r) { (kirmizi[r.personel] = kirmizi[r.personel] || []).push(r); });
    document.querySelectorAll("[data-kod].gb-alarm").forEach(function (el) { if (!kirmizi[el.getAttribute("data-kod")]) { el.classList.remove("gb-alarm"); var b = el.querySelector(".gb-rozet"); if (b) b.remove(); } });
    Object.keys(kirmizi).forEach(function (k) {
      document.querySelectorAll('[data-kod="' + k + '"]').forEach(function (el) {
        var m = "GECİKTİ: " + kirmizi[k].map(function (r) { return r.ad + " — " + r.neden; }).join(" · ").slice(0, 170);
        el.classList.add("gb-alarm"); var b = el.querySelector(".gb-rozet"); if (!b) { b = document.createElement("div"); b.className = "gb-rozet"; el.insertBefore(b, el.firstChild); } if (b.textContent !== m) b.textContent = m;
      });
    });
  }
  function ciz() {
    BUGUN = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
    var O = { "GECİKTİ": 0, YOLDA: 1, TAMAM: 2, "BİLGİ": 3, ATLANDI: 4 };
    var bg = VERI.filter(function (r) { return r.gun === BUGUN; }).sort(function (a, b) { return (O[a.durum] - O[b.durum]) || ((a.sira || 0) - (b.sira || 0)); });
    if (!bg.length) { ust.hidden = true; alt.hidden = true; return; }
    var say = { TAMAM: 0, YOLDA: 0, "GECİKTİ": 0 }; bg.forEach(function (r) { if (say[r.durum] != null) say[r.durum]++; });
    var son = bg.reduce(function (m, r) { return Math.max(m, new Date(r.guncelleme).getTime()); }, 0), eski = (Date.now() - son) / 60000;
    ust.hidden = false;
    ust.innerHTML = '<h2>BUGÜNÜN HEDEFLERİ <span class="gb-sayac"><span style="background:#D64545">' + say["GECİKTİ"] + ' kırmızı</span> <span style="background:#E0A100">' + say.YOLDA + ' yolda</span> <span style="background:#1E9E5A">' + say.TAMAM + ' tamam</span></span><small>son ölçüm ' + saat(son) + (eski > 75 ? ' · ⚠ ' + Math.round(eski) + ' dk önce, ölçüm durmuş olabilir' : '') + '</small></h2><div class="gb-izgara">' +
      bg.map(function (r) {
        var sy = r.durum === "ATLANDI" ? "atlandı" : r.durum === "BİLGİ" ? esc(r.sayi) : esc(r.sayi) + "/" + esc(r.hedef);
        return '<div class="gb-k ' + (r.durum === "GECİKTİ" ? "gb-kir" : "") + '" style="--c:' + (RENK[r.durum] || "#999") + '" onclick="this.classList.toggle(\'ac\')"><b>' + esc(r.ad) + (r.personel ? " · " + esc(AD[r.personel] || r.personel) : "") + '</b><div class="gb-s">' + sy + '</div>' +
          (r.neden && r.durum !== "TAMAM" ? '<div class="gb-n">' + (r.durum === "GECİKTİ" ? "GECİKTİ: " : "") + esc(r.neden) + '</div>' : '') + (r.onarim ? '<div class="gb-o">🔧 ' + esc(r.onarim) + '</div>' : '') + '<div class="gb-z">' + saat(r.guncelleme) + '</div></div>';
      }).join("") + '</div>';
    var gunler = []; for (var i = 6; i >= 0; i--) gunler.push(new Date(Date.now() - i * 864e5).toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" }));
    var kodlar = {}; VERI.forEach(function (r) { if (r.durum !== "BİLGİ" && r.grup !== "Görevler") kodlar[r.hedef_kodu] = r; });
    var kl = Object.keys(kodlar).sort(function (a, b) { return (kodlar[a].sira || 0) - (kodlar[b].sira || 0); });
    alt.hidden = false;
    alt.innerHTML = '<h2>SON 7 GÜN <small>yeşil tamam · sarı yolda · kırmızı gecikti · gri atlandı/veri yok</small></h2><div class="gb-gec"><table><tr><th></th>' + gunler.map(function (g) { return "<th>" + g.slice(8) + "." + g.slice(5, 7) + "</th>"; }).join("") + "</tr>" +
      kl.map(function (k) { return "<tr><td>" + esc(kodlar[k].ad) + "</td>" + gunler.map(function (g) { var r = VERI.filter(function (x) { return x.gun === g && x.hedef_kodu === k; })[0]; return '<td title="' + esc(r ? r.ad + ": " + r.sayi + "/" + r.hedef + " " + r.durum : "veri yok") + '"><i style="--c:' + (r ? RENK[r.durum] : "#E5E2DA") + '"></i></td>'; }).join("") + "</tr>"; }).join("") + "</table></div>";
    alarmUygula();
  }
  function cek() {
    var sb = window.__sb; if (!sb) return;
    var d = new Date(Date.now() - 8 * 864e5).toISOString().slice(0, 10);
    sb.from("gorev_gunluk").select("*").gte("gun", d).order("sira").then(function (q) { if (q && q.data) { VERI = q.data; ciz(); } }, function () {});
  }
  function baslat() {
    yerlestir(); var n = 0, t = setInterval(function () { if (window.__sb) { clearInterval(t); cek(); setInterval(function () { if (!document.hidden) cek(); }, 30000); } else if (++n > 60) clearInterval(t); }, 500);
    setInterval(function () { if (VERI.length) alarmUygula(); }, 3000); document.addEventListener("visibilitychange", function () { if (!document.hidden) cek(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
