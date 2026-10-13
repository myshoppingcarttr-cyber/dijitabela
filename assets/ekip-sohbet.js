/* SANAL OFİS · EKİP SOHBETİ (Patron 13 Eki 2026: "Personellere genel mesaj atabileceğim bir alan; 'Nehir neden çalışmıyorsun' yazayım, hepsi görsün, Nehir cevap verebilsin.")
   Tablo ofis_sohbet (RLS: yalnız Patron okur/yazar; personel OTOMASYON\ofis-sohbet.js ile cevaplar). 10 sn'de bir yoklar.
   Kullanım: EkipSohbet.kur({ sb: supabaseİstemcisi, kap: element, kadro: function () { return [{kod, ad}] }, rozet: "css seçici ([data-kod] öğeleri)" }) */
(function () {
  var CSS = ".ys{display:flex;flex-direction:column;gap:8px;color:inherit}" +
    ".ys-akis{display:flex;flex-direction:column;gap:6px;max-height:min(52vh,420px);overflow-y:auto;overscroll-behavior:contain;padding:2px}" +
    ".ys-m{border-radius:12px;padding:8px 10px;font-size:13.5px;line-height:1.4;overflow-wrap:anywhere;background:rgba(127,127,127,.12);max-width:92%}" +
    ".ys-m.p{align-self:flex-end;background:#FFB000;color:#16181D}" +
    ".ys-m.c{margin-left:14px;border-left:3px solid #1E9E5A}" +
    ".ys-m small{display:block;font-size:11px;opacity:.72;font-weight:700;margin-bottom:2px}" +
    ".ys-m .ys-h{font-weight:800}" +
    ".ys-bos{font-size:13px;opacity:.7;text-align:center;padding:12px}" +
    ".ys-yaz{position:relative;display:flex;gap:6px;align-items:flex-end}" +
    ".ys-yaz textarea{flex:1;min-width:0;font:inherit;font-size:16px;padding:10px;border-radius:12px;border:1px solid rgba(127,127,127,.4);background:#fff;color:#16181D;min-height:46px;max-height:140px;resize:vertical}" +
    ".ys-yaz button{font:inherit;font-weight:800;border:0;border-radius:12px;padding:0 16px;min-height:46px;background:#1E9E5A;color:#fff;cursor:pointer}" +
    ".ys-yaz button:disabled{opacity:.5}" +
    ".ys-oneri{position:absolute;left:0;right:60px;bottom:100%;margin-bottom:4px;background:#fff;color:#16181D;border:1px solid #DDD9CF;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);max-height:220px;overflow-y:auto;z-index:40}" +
    ".ys-oneri button{display:block;width:100%;text-align:left;font:inherit;font-size:14px;font-weight:700;border:0;background:none;padding:10px 12px;min-height:42px;cursor:pointer;color:#16181D}" +
    ".ys-oneri button.ac,.ys-oneri button:hover{background:#F4F2EA}" +
    ".ys-ipucu{font-size:11.5px;opacity:.7}" +
    ".ys-rozet{display:inline-flex;align-items:center;gap:2px;background:#D64545;color:#fff;border-radius:999px;font-size:11px;font-weight:800;padding:1px 7px;margin-left:6px;line-height:1.5;white-space:nowrap;vertical-align:1px}";
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var kucuk = function (s) { return String(s || "").toLocaleLowerCase("tr").replace(/\s+/g, ""); };
  var saat = function (d) { var x = new Date(d), b = new Date(); return x.toDateString() === b.toDateString() ? x.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : x.toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); };

  function kur(o) {
    if (!document.getElementById("ys-css")) { var st = document.createElement("style"); st.id = "ys-css"; st.textContent = CSS; document.head.appendChild(st); }
    var kap = o.kap, M = [], ROZET = {}, mesgul = false, sonId = 0, cizildi = false;
    kap.innerHTML = '<div class="ys"><div class="ys-akis" aria-live="polite"><div class="ys-bos">Yükleniyor…</div></div>' +
      '<div class="ys-yaz"><div class="ys-oneri" hidden></div><textarea rows="1" maxlength="2000" placeholder="Herkese yazın ya da @ ile kişi seçin (ör. @Nehir neden çalışmıyorsun?)"></textarea><button type="button">Gönder</button></div>' +
      '<div class="ys-ipucu">Mesajlar tüm ekibe görünür. @etiketlenen kişi en geç 5 dakikada cevap verir; etiketsiz mesajı Yönetici Asistan özetleyip dağıtır.</div></div>';
    var akis = kap.querySelector(".ys-akis"), ta = kap.querySelector("textarea"), dug = kap.querySelector(".ys-yaz > button"), oneri = kap.querySelector(".ys-oneri");
    var kadro = function () { return (o.kadro() || []).filter(function (p) { return p && p.ad && String(p.kod).charAt(0) !== "_"; }); };
    var bulAd = function (h) { var k = kucuk(h); return kadro().filter(function (p) { return kucuk(p.ad) === k || p.kod === k; })[0]; };

    function ciz() {
      var asagida = akis.scrollHeight - akis.scrollTop - akis.clientHeight < 40;
      var cevaplar = {}; M.forEach(function (m) { if (m.yanit_id) (cevaplar[m.yanit_id] = cevaplar[m.yanit_id] || []).push(m); });
      var kok = M.filter(function (m) { return !m.yanit_id || !M.some(function (x) { return x.id === m.yanit_id; }); });
      var html = "";
      kok.forEach(function (m) {
        html += kart(m, false);
        (cevaplar[m.id] || []).forEach(function (c) { html += kart(c, true); });
      });
      akis.innerHTML = html || '<div class="ys-bos">Henüz mesaj yok. İlk mesajı siz yazın.</div>';
      if (asagida || M.length && M[M.length - 1].id !== sonId) akis.scrollTop = akis.scrollHeight;
      sonId = M.length ? M[M.length - 1].id : 0;
    }
    function kart(m, cevap) {
      var p = m.yazan === "Patron";
      var bekliyor = p && m.hedef && !M.some(function (x) { return x.yanit_id === m.id && x.yazan !== "Patron"; });
      return '<div class="ys-m' + (p ? " p" : "") + (cevap ? " c" : "") + '"><small>' + esc(m.yazan) + (m.hedef ? " → " + esc(m.hedef) : cevap ? "" : " → herkes") + " · " + saat(m.zaman) + (bekliyor ? " · cevap bekleniyor" : "") + "</small>" +
        esc(m.mesaj).replace(/(^|\s)@([\wçğıöşüÇĞİÖŞÜ]+)/g, '$1<span class="ys-h">@$2</span>') + "</div>";
    }
    function rozetHesapla() {
      ROZET = {};
      M.forEach(function (m) {
        if (m.yazan !== "Patron" || !m.hedef) return;
        var p = bulAd(m.hedef); if (!p) return;
        var cevap = M.some(function (x) { return x.yanit_id === m.id && (kucuk(x.yazan) === kucuk(p.ad) || x.yazan === p.kod); });
        if (!cevap) ROZET[p.kod] = (ROZET[p.kod] || 0) + 1;
      });
      rozetle();
      if (o.degisti) o.degisti(ROZET);
    }
    var rozetliyor = false;
    function rozetle() {
      if (!o.rozet || rozetliyor) return; rozetliyor = true;
      try {
        Array.prototype.forEach.call(document.querySelectorAll(o.rozet), function (el) {
          var n = ROZET[el.getAttribute("data-kod")] || 0, r = el.querySelector(".ys-rozet");
          if (!n) { if (r) r.remove(); return; }
          var yazi = "✉ " + n + " yeni mesaj";
          if (r) { if (r.textContent !== yazi) r.textContent = yazi; return; }
          r = document.createElement("span"); r.className = "ys-rozet"; r.textContent = yazi; r.title = "Patron'dan cevaplanmamış mesaj";
          var b = el.querySelector(".ne > b") || el.querySelector(".ba") || el.querySelector("b") || el; b.appendChild(r);
        });
      } finally { rozetliyor = false; }
    }
    if (o.rozet && window.MutationObserver) { var zz; new MutationObserver(function () { if (rozetliyor) return; clearTimeout(zz); zz = setTimeout(rozetle, 60); }).observe(document.body, { childList: true, subtree: true }); }

    async function yukle() {
      if (mesgul) return; mesgul = true;
      try {
        var q = await o.sb.from("ofis_sohbet").select("id,zaman,yazan,hedef,mesaj,yanit_id").eq("ozel", false).order("id", { ascending: false }).limit(80);
        if (q.error) { akis.innerHTML = '<div class="ys-bos">Sohbet okunamadı: ' + esc(q.error.message) + "</div>"; return; }
        var yeni = (q.data || []).reverse();
        if (!cizildi || JSON.stringify(yeni) !== JSON.stringify(M)) { M = yeni; ciz(); cizildi = true; }
        rozetHesapla();
      } catch (e) { /* ağ hatası: sonraki yoklamada tekrar */ } finally { mesgul = false; }
    }

    /* @ otomatik tamamlama */
    var secim = 0, liste = [];
    function parca() { var v = ta.value.slice(0, ta.selectionStart), m = /(^|\s)@([\wçğıöşüÇĞİÖŞÜ]*)$/.exec(v); return m ? m[2] : null; }
    function oneriGoster() {
      var p = parca(); if (p == null) { oneri.hidden = true; return; }
      var k = kucuk(p); liste = kadro().filter(function (x) { return !k || kucuk(x.ad).indexOf(k) === 0 || x.kod.indexOf(k) === 0; }).slice(0, 8);
      if (!liste.length) { oneri.hidden = true; return; }
      secim = Math.min(secim, liste.length - 1);
      oneri.innerHTML = liste.map(function (x, i) { return '<button type="button" data-i="' + i + '"' + (i === secim ? ' class="ac"' : "") + ">@" + esc(x.ad.replace(/\s+/g, "")) + "</button>"; }).join("");
      oneri.hidden = false;
    }
    function oneriSec(i) {
      var x = liste[i]; if (!x) return;
      var once = ta.value.slice(0, ta.selectionStart), sonra = ta.value.slice(ta.selectionStart);
      once = once.replace(/@([\wçğıöşüÇĞİÖŞÜ]*)$/, "@" + x.ad.replace(/\s+/g, "") + " ");
      ta.value = once + sonra; ta.focus(); ta.selectionStart = ta.selectionEnd = once.length; oneri.hidden = true;
    }
    ta.addEventListener("input", function () { secim = 0; oneriGoster(); });
    ta.addEventListener("keydown", function (e) {
      if (!oneri.hidden && liste.length) {
        if (e.key === "ArrowDown") { secim = (secim + 1) % liste.length; oneriGoster(); e.preventDefault(); return; }
        if (e.key === "ArrowUp") { secim = (secim - 1 + liste.length) % liste.length; oneriGoster(); e.preventDefault(); return; }
        if (e.key === "Enter" || e.key === "Tab") { oneriSec(secim); e.preventDefault(); return; }
        if (e.key === "Escape") { oneri.hidden = true; return; }
      }
      if (e.key === "Enter" && !e.shiftKey && !matchMedia("(pointer:coarse)").matches) { e.preventDefault(); gonder(); }
    });
    oneri.addEventListener("mousedown", function (e) { e.preventDefault(); });
    oneri.addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b) oneriSec(+b.getAttribute("data-i")); });

    async function gonder() {
      var v = ta.value.trim(); if (!v) return;
      var m = /(^|\s)@([\wçğıöşüÇĞİÖŞÜ]+)/.exec(v), hedef = null;
      if (m) { var p = bulAd(m[2]) || bulAd(m[2].replace(/asistan$/i, " asistan")); if (!p && /^ya$/i.test(m[2])) p = kadro().filter(function (x) { return x.kod === "yonetici"; })[0]; if (!p) { alert("@" + m[2] + " ekipte bulunamadı. Listeden seçin."); return; } hedef = p.ad; }
      dug.disabled = true;
      var r = await o.sb.from("ofis_sohbet").insert({ yazan: "Patron", hedef: hedef, mesaj: v.slice(0, 2000) }).select("id");
      dug.disabled = false;
      if (r.error) { alert("Gönderilemedi: " + r.error.message); return; }
      ta.value = ""; oneri.hidden = true; await yukle(); akis.scrollTop = akis.scrollHeight;
    }
    dug.addEventListener("click", gonder);

    yukle(); setInterval(function () { if (!document.hidden) yukle(); }, 10000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) yukle(); });
    return { yukle: yukle, rozet: function () { return ROZET; } };
  }
  window.EkipSohbet = { kur: kur };
})();
