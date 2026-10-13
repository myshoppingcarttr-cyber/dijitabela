/* SANAL OFİS · BİREBİR SOHBET (Patron 13 Eki 2026: "Personellerle birebir konuşabildiğim bir alan; başının üstünde küçük bir kutu koy, oraya yazayım, konuşayım.")
   Her figürün başında 💬 düğmesi (okunmamış cevapta kırmızı nokta), çalışırken üstünde tek satır iş, cevap gelince 5 sn önizleme.
   Veri: ofis_sohbet (ozel = true). Yalnız Patron (RLS) ve ilgili personel (OTOMASYON\ofis-sohbet.js oku --personel <ad> --ozel) görür; genel ekip sohbetinde görünmez.
   Kullanım: Birebir.kur({ sb, kisiler: function () { return [{ kod, ad, el, durum, faaliyet }] } })  ·  Birebir.ac(kod) */
(function () {
  var CSS = ".bb-ikon{position:absolute;left:50%;top:-50px;transform:translateX(-50%);width:36px;height:36px;border-radius:50%;border:2px solid #fff;background:#262b36;color:#fff;font-size:18px;line-height:1;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.35);z-index:6;padding:0}" +
    ".bb-ikon:hover,.bb-ikon:focus-visible{background:#2f6feb;outline:none}" +
    ".bb-ikon i{position:absolute;right:-3px;top:-3px;width:13px;height:13px;border-radius:50%;background:#e5322d;border:2px solid #fff;display:none}" +
    ".bb-ikon.yeni i{display:block;animation:bbnab 1.6s ease-in-out infinite}@keyframes bbnab{50%{transform:scale(1.3)}}" +
    ".bb-is{position:absolute;left:50%;top:-80px;transform:translateX(-50%);max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:700 11px/1.3 system-ui,sans-serif;color:#1b1f27;background:rgba(255,248,225,.95);border:1px solid #f0d58a;border-radius:8px;padding:3px 7px;pointer-events:none;z-index:6;display:none}" +
    ".bb-is.var{display:block}body.gece .bb-is{background:rgba(255,226,140,.96);box-shadow:0 0 14px rgba(255,210,110,.6)}" +
    ".bb-oniz{position:absolute;left:50%;bottom:calc(100% + 86px);transform:translateX(-50%);width:210px;font:600 12.5px/1.35 system-ui,sans-serif;color:#1b1f27;background:#fff;border-radius:12px;padding:8px 10px;box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:7;pointer-events:none;opacity:0;transition:opacity .3s;overflow-wrap:anywhere}" +
    ".bb-oniz.ac{opacity:1}.bb-oniz b{display:block;font-size:11px;color:#2f6feb}" +
    "#bb-panel{position:fixed;right:16px;bottom:16px;width:360px;max-width:calc(100vw - 32px);max-height:min(72vh,560px);display:none;flex-direction:column;background:#1f242e;color:#e5e7eb;border:1px solid #333a48;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.55);z-index:120;overflow:hidden;font-family:inherit}" +
    "#bb-panel.ac{display:flex}" +
    "#bb-panel header{display:flex;gap:10px;align-items:flex-start;padding:12px 12px 10px;border-bottom:1px solid #333a48}" +
    "#bb-panel header .ad{flex:1;min-width:0}#bb-panel header b{display:block;font-size:15px;color:#fff}" +
    "#bb-panel header small{display:block;font-size:12px;color:#9aa1ae;overflow-wrap:anywhere;margin-top:2px}" +
    "#bb-panel header button{flex:none;width:40px;height:40px;border-radius:10px;border:0;background:#2a303c;color:#fff;font-size:18px;cursor:pointer}" +
    ".bb-liste{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:10px 12px;display:flex;flex-direction:column;gap:6px}" +
    ".bb-m{max-width:86%;border-radius:12px;padding:7px 10px;font-size:13.5px;line-height:1.4;background:#2a303c;overflow-wrap:anywhere;align-self:flex-start}" +
    ".bb-m.p{align-self:flex-end;background:#f5b301;color:#1b1f27}.bb-m small{display:block;font-size:10.5px;opacity:.7;font-weight:700;margin-bottom:1px}" +
    ".bb-bos,.bb-bekle{font-size:12.5px;color:#9aa1ae;text-align:center;padding:8px}" +
    ".bb-yaz{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #333a48;background:#1f242e}" +
    ".bb-yaz textarea{flex:1;min-width:0;font:inherit;font-size:16px;border-radius:12px;border:1px solid #3a4152;background:#fff;color:#1b1f27;padding:9px 10px;min-height:46px;max-height:120px;resize:none}" +
    ".bb-yaz button{flex:none;font:inherit;font-weight:800;border:0;border-radius:12px;padding:0 16px;min-height:46px;background:#17b26a;color:#fff;cursor:pointer}.bb-yaz button:disabled{opacity:.5}" +
    "@media(max-width:700px){#bb-panel{left:0;right:0;bottom:0;width:auto;max-width:none;border-radius:18px 18px 0 0;max-height:80vh}}" +
    "@media(prefers-reduced-motion:reduce){.bb-ikon.yeni i{animation:none}.bb-oniz{transition:none}}";
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var kucuk = function (s) { return String(s || "").toLocaleLowerCase("tr").replace(/\s+/g, ""); };
  var saat = function (d) { var x = new Date(d), b = new Date(); return x.toDateString() === b.toDateString() ? x.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : x.toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); };
  var oku = function (k) { try { return +localStorage.getItem("bb-gorulen-" + k) || 0; } catch (e) { return 0; } };
  var yaz = function (k, v) { try { localStorage.setItem("bb-gorulen-" + k, v); } catch (e) {} };

  function kur(o) {
    if (!document.getElementById("bb-css")) { var st = document.createElement("style"); st.id = "bb-css"; st.textContent = CSS; document.head.appendChild(st); }
    var P = document.createElement("section"); P.id = "bb-panel"; P.setAttribute("role", "dialog"); P.setAttribute("aria-label", "Birebir sohbet");
    P.innerHTML = '<header><div class="ad"><b></b><small></small></div><button type="button" aria-label="Kapat">✕</button></header><div class="bb-liste" aria-live="polite"></div><div class="bb-yaz"><textarea rows="1" maxlength="2000" placeholder="Yalnız bu kişiye yazın…"></textarea><button type="button">Gönder</button></div>';
    document.body.appendChild(P);
    var liste = P.querySelector(".bb-liste"), ta = P.querySelector("textarea"), gd = P.querySelector(".bb-yaz button");
    var M = [], acik = null, ilk = true, enSon = 0, mesgul = false;
    var kisiler = function () { return (o.kisiler() || []).filter(function (k) { return k && k.el && k.kod && String(k.kod).charAt(0) !== "_"; }); };
    var kisiBul = function (kod) { return kisiler().filter(function (k) { return k.kod === kod; })[0]; };
    function kime(m) { // mesaj hangi personelin birebiri
      var ks = kisiler(), a = m.yazan === "Patron" ? m.hedef : m.yazan, k = kucuk(a);
      var x = ks.filter(function (p) { return kucuk(p.ad) === k || p.kod === k; })[0]; return x ? x.kod : null;
    }
    function konu(kod) { return M.filter(function (m) { return kime(m) === kod; }); }

    function suslu() { // figür süsleri: 💬, iş satırı, önizleme kabı
      kisiler().forEach(function (k) {
        var b = k.el.querySelector(":scope > .bb-ikon");
        if (!b) {
          b = document.createElement("button"); b.type = "button"; b.className = "bb-ikon"; b.innerHTML = "💬<i></i>"; b.setAttribute("aria-label", (k.ad || k.kod) + " ile birebir konuş");
          ["pointerdown", "mousedown", "touchstart"].forEach(function (ev) { b.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
          b.addEventListener("click", function (e) { e.stopPropagation(); e.preventDefault(); ac(k.kod); });
          k.el.appendChild(b);
          var is = document.createElement("div"); is.className = "bb-is"; k.el.appendChild(is);
          var on = document.createElement("div"); on.className = "bb-oniz"; k.el.appendChild(on);
        }
        var yeni = konu(k.kod).some(function (m) { return m.yazan !== "Patron" && m.id > oku(k.kod); });
        b.classList.toggle("yeni", yeni && acik !== k.kod);
        var is2 = k.el.querySelector(":scope > .bb-is"), f = String(k.faaliyet || "").replace(/^Şu an çalışıyor…\s*·\s*önceki tur:\s*/, "").trim();
        var goster = k.durum === "calisiyor" && f;
        is2.classList.toggle("var", !!goster); if (goster && is2.textContent !== "⚙ " + f.slice(0, 60)) is2.textContent = "⚙ " + f.slice(0, 60);
      });
    }
    function onizle(kod, m) {
      var k = kisiBul(kod); if (!k) return; var on = k.el.querySelector(":scope > .bb-oniz"); if (!on) return;
      on.innerHTML = "<b>" + esc(m.yazan) + " cevap verdi</b>" + esc(String(m.mesaj).slice(0, 140)) + (m.mesaj.length > 140 ? "…" : "");
      on.classList.add("ac"); clearTimeout(on._z); on._z = setTimeout(function () { on.classList.remove("ac"); }, 5000);
    }
    function ciz() {
      if (!acik) return; var k = kisiBul(acik) || { ad: acik }, L = konu(acik).slice(-10);
      P.querySelector("header b").textContent = (k.ad || acik) + " · birebir";
      P.querySelector("header small").textContent = (k.durum === "calisiyor" ? "🟢 Çalışıyor" : k.durum === "hata" ? "🔴 Hata" : "⚪ Boşta") + (k.faaliyet ? " · " + String(k.faaliyet).slice(0, 120) : "");
      var son = L[L.length - 1];
      liste.innerHTML = (L.length ? L.map(function (m) { return '<div class="bb-m' + (m.yazan === "Patron" ? " p" : "") + '"><small>' + esc(m.yazan === "Patron" ? "Siz" : m.yazan) + " · " + saat(m.zaman) + "</small>" + esc(m.mesaj) + "</div>"; }).join("") : '<div class="bb-bos">Henüz birebir mesaj yok. Yazdığınızı yalnız ' + esc(k.ad || acik) + " görür.</div>") +
        (son && son.yazan === "Patron" ? '<div class="bb-bekle">⏳ Cevap bekleniyor (genelde 5 dakika içinde)</div>' : "");
      liste.scrollTop = liste.scrollHeight;
      var mx = L.reduce(function (a, m) { return Math.max(a, +m.id); }, 0); if (mx > oku(acik)) yaz(acik, mx);
    }
    function ac(kod) { acik = kod; P.classList.add("ac"); ciz(); suslu(); setTimeout(function () { if (!matchMedia("(pointer:coarse)").matches) ta.focus(); }, 50); yukle(); }
    function kapat() { acik = null; P.classList.remove("ac"); suslu(); }
    P.querySelector("header button").addEventListener("click", kapat);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && acik) kapat(); });

    async function gonder() {
      var v = ta.value.trim(); if (!v || !acik) return; var k = kisiBul(acik); if (!k) return;
      gd.disabled = true;
      var r = await o.sb.from("ofis_sohbet").insert({ yazan: "Patron", hedef: k.ad, mesaj: v.slice(0, 2000), ozel: true }).select("id");
      gd.disabled = false;
      if (r.error) { alert("Gönderilemedi: " + r.error.message); return; }
      ta.value = ""; await yukle();
    }
    gd.addEventListener("click", gonder);
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !matchMedia("(pointer:coarse)").matches) { e.preventDefault(); gonder(); } });

    async function yukle() {
      if (mesgul) return; mesgul = true;
      try {
        var q = await o.sb.from("ofis_sohbet").select("id,zaman,yazan,hedef,mesaj,yanit_id").eq("ozel", true).order("id", { ascending: false }).limit(300);
        if (q.error) return;
        M = (q.data || []).map(function (m) { m.id = +m.id; return m; }).reverse();
        var mx = M.reduce(function (a, m) { return Math.max(a, m.id); }, 0);
        if (!ilk) M.forEach(function (m) { if (m.id > enSon && m.yazan !== "Patron") { var kod = kime(m); if (kod) onizle(kod, m); } });
        enSon = Math.max(enSon, mx); ilk = false;
        suslu(); ciz();
      } catch (e) { /* sonraki yoklamada */ } finally { mesgul = false; }
    }
    yukle(); setInterval(function () { if (!document.hidden) yukle(); else suslu(); }, 10000);
    setInterval(suslu, 3000); // figürler yeniden çizilirse süsleri geri koy, iş satırlarını tazele
    return { ac: ac, yukle: yukle };
  }
  window.Birebir = { kur: kur, ac: function (kod) { if (window.__bb) window.__bb.ac(kod); } };
})();
