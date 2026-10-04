// Diş kliniği premium modülü: Gülüş Simülatörü + Tedavi & Tatil Planlayıcı + 4 dil sözlüğü
window.SOZLUK = {
  en: { m1: "Treatments", m2: "Smile Simulator", m3: "Plan & Price", m4: "Contact", hb: "Book a free consultation", sim: "See your new smile in 10 seconds", simp: "Upload a selfie, mark your teeth, slide. Your photo never leaves your phone.", plan: "Treatment + holiday planner", planp: "Pick your treatments, get an estimated range, the number of days you need and a day-by-day plan.", gonder: "Send my plan on WhatsApp", hiz: "Our treatments", ilet: "Visit us", yk: "Upload photo", ac: "Open now", kap: "Closed now" },
  de: { m1: "Behandlungen", m2: "Lächeln-Simulator", m3: "Plan & Preis", m4: "Kontakt", hb: "Kostenlose Beratung buchen", sim: "Sehen Sie Ihr neues Lächeln in 10 Sekunden", simp: "Selfie hochladen, Zähne markieren, Regler schieben. Ihr Foto verlässt Ihr Handy nicht.", plan: "Behandlung + Urlaub planen", planp: "Behandlungen wählen: Preisspanne, benötigte Tage und Tagesplan.", gonder: "Plan per WhatsApp senden", hiz: "Unsere Behandlungen", ilet: "Besuchen Sie uns", yk: "Foto hochladen", ac: "Jetzt geöffnet", kap: "Jetzt geschlossen" },
  ru: { m1: "Лечение", m2: "Симулятор улыбки", m3: "План и цена", m4: "Контакты", hb: "Бесплатная консультация", sim: "Увидьте новую улыбку за 10 секунд", simp: "Загрузите селфи, отметьте зубы, двигайте ползунок. Фото не покидает телефон.", plan: "Планировщик лечения и отдыха", planp: "Выберите процедуры: диапазон цены, нужные дни и план по дням.", gonder: "Отправить план в WhatsApp", hiz: "Наши процедуры", ilet: "Как нас найти", yk: "Загрузить фото", ac: "Сейчас открыто", kap: "Сейчас закрыто" }
};
(function () {
  // ---------- Gülüş Simülatörü (tamamen tarayıcıda; fotoğraf sunucuya gitmez) ----------
  function simulator(k) {
    var cv = k.querySelector("canvas"), cx = cv.getContext("2d"), giris = k.querySelector("input[type=file]"), bey = k.querySelector(".s-bey"), duz = k.querySelector(".s-duz"), bol = k.querySelector(".s-bol");
    var img = null, kutu = null, cek = null, orj = null;
    function ornek() {
      cv.width = 900; cv.height = 560; var g = cx.createLinearGradient(0, 0, 900, 560); g.addColorStop(0, "#f1e4dc"); g.addColorStop(1, "#d9c3b6"); cx.fillStyle = g; cx.fillRect(0, 0, 900, 560);
      cx.fillStyle = "#7a5a50"; cx.font = "600 26px system-ui"; cx.textAlign = "center"; cx.fillText("📷  Selfie yükleyin · dişlerinizi çerçeveleyin · kaydırın", 450, 280);
    }
    function ciz() {
      if (!img) return ornek();
      cx.putImageData(orj, 0, 0);
      if (!kutu) return;
      var x = Math.min(kutu[0], kutu[2]) | 0, y = Math.min(kutu[1], kutu[3]) | 0, w = Math.abs(kutu[2] - kutu[0]) | 0, h = Math.abs(kutu[3] - kutu[1]) | 0;
      if (w < 8 || h < 8) return;
      var sinir = (bol.value / 100) * cv.width;
      var d = cx.getImageData(x, y, w, h), p = d.data, b = bey.value / 100, s = duz.value / 100;
      for (var i = 0; i < p.length; i += 4) {
        var px = x + (i / 4) % w; if (px < sinir) continue;
        var r = p[i], gg = p[i + 1], bb = p[i + 2], l = .299 * r + .587 * gg + .114 * bb;
        var dis = l > 85 && r > bb && (r - bb) < 110 && r - gg < 60; // açık ve sarımsı = diş minesi
        if (!dis) continue;
        var t = Math.min(1, (l - 85) / 90) * b;
        p[i] = r + (250 - r) * t * .55; p[i + 1] = gg + (250 - gg) * t * .65; p[i + 2] = bb + (252 - bb) * t * .95;
      }
      cx.putImageData(d, x, y);
      if (s > 0) { cx.save(); cx.beginPath(); cx.rect(Math.max(x, sinir), y, Math.max(0, x + w - Math.max(x, sinir)), h); cx.clip(); cx.filter = "blur(" + (s * 2.2) + "px) brightness(" + (1 + s * .06) + ")"; cx.globalAlpha = .55; cx.drawImage(cv, x, y, w, h, x, y, w, h); cx.restore(); cx.filter = "none"; }
      cx.strokeStyle = "rgba(255,255,255,.9)"; cx.setLineDash([6, 6]); cx.lineWidth = 2; cx.strokeRect(x, y, w, h); cx.setLineDash([]);
      cx.fillStyle = "rgba(255,255,255,.95)"; cx.fillRect(sinir - 1, 0, 3, cv.height);
      cx.font = "800 15px system-ui"; cx.fillStyle = "#fff"; cx.textAlign = "left"; cx.fillText("ÖNCE", 12, 26); cx.textAlign = "right"; cx.fillText("SONRA", cv.width - 12, 26);
    }
    giris.onchange = function () {
      var f = giris.files[0]; if (!f) return; var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () { var o = Math.min(1, 1100 / im.width); cv.width = im.width * o; cv.height = im.height * o; cx.drawImage(im, 0, 0, cv.width, cv.height); orj = cx.getImageData(0, 0, cv.width, cv.height); img = im; kutu = [cv.width * .3, cv.height * .55, cv.width * .7, cv.height * .72]; ciz(); k.querySelector(".s-ipucu").textContent = "Dişlerinizi parmağınızla/fareyle çerçeveleyin, sonra kaydırıcılarla oynayın."; };
      im.src = u;
    };
    function nokta(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; }
    cv.addEventListener("pointerdown", function (e) { if (!img) return giris.click(); cek = nokta(e); kutu = cek.concat(cek); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", function (e) { if (!cek) return; var n = nokta(e); kutu = [cek[0], cek[1], n[0], n[1]]; ciz(); });
    cv.addEventListener("pointerup", function () { cek = null; });
    [bey, duz, bol].forEach(function (i) { i.oninput = ciz; });
    k.querySelector(".s-indir").onclick = function () { if (!img) return giris.click(); var a = document.createElement("a"); a.download = "yeni-gulusum.jpg"; a.href = cv.toDataURL("image/jpeg", .9); a.click(); };
    ornek();
  }
  // ---------- Tedavi + Tatil Planlayıcı ----------
  var TED = [ // [kod, ad, birim(EUR alt), birim(EUR üst), gün, ikinci ziyaret?]
    ["imp", "İmplant (adet)", 450, 750, 5, true], ["zir", "Zirkonyum kaplama (adet)", 160, 260, 5, false], ["lam", "E-max / Lamina (adet)", 220, 360, 6, false],
    ["hol", "Hollywood Smile (20 diş)", 3600, 6200, 7, false], ["bey", "Diş beyazlatma", 150, 280, 1, false], ["kan", "Kanal tedavisi (adet)", 90, 160, 2, false], ["tem", "Detertraj + kontrol", 40, 80, 1, false]
  ];
  var KUR = { EUR: 1, GBP: .85, USD: 1.08, TRY: 37.5 }, SEM = { EUR: "€", GBP: "£", USD: "$", TRY: "₺" };
  function planlayici(k) {
    var sec = {}, lis = k.querySelector(".p-liste"), out = k.querySelector(".sonuc"), para = k.querySelector(".p-para"), otel = k.querySelector(".p-otel"), tr = k.querySelector(".p-transfer"), tarih = k.querySelector(".p-tarih");
    lis.innerHTML = TED.map(function (t) { return '<div class="kart" style="display:flex;align-items:center;gap:12px;padding:14px"><div style="flex:1"><b>' + t[1] + '</b><div class="not" style="margin:2px 0 0">' + t[4] + " gün" + (t[5] ? " · 2. ziyaret 3–6 ay sonra" : "") + '</div></div><div class="sayac" data-k="' + t[0] + '"><button>−</button><span>0</span><button>+</button></div></div>'; }).join("");
    lis.querySelectorAll(".sayac").forEach(function (s) { var b = s.querySelectorAll("button"); b[0].onclick = function () { sec[s.dataset.k] = Math.max(0, (sec[s.dataset.k] || 0) - 1); s.querySelector("span").textContent = sec[s.dataset.k]; hesap(); }; b[1].onclick = function () { sec[s.dataset.k] = Math.min(32, (sec[s.dataset.k] || 0) + 1); s.querySelector("span").textContent = sec[s.dataset.k]; hesap(); }; });
    [para, otel, tr, tarih].forEach(function (e) { e.onchange = hesap; });
    var t0 = new Date(); t0.setDate(t0.getDate() + 21); tarih.value = t0.toISOString().slice(0, 10);
    function hesap() {
      var alt = 0, ust = 0, gun = 0, iki = false, kal = [];
      TED.forEach(function (t) { var n = sec[t[0]] || 0; if (!n) return; var adet = /adet/.test(t[1]) ? n : (n > 0 ? 1 : 0); alt += t[2] * adet; ust += t[3] * adet; gun = Math.max(gun, t[4] + (adet > 6 && /adet/.test(t[1]) ? 1 : 0)); if (t[5]) iki = true; kal.push((/adet/.test(t[1]) ? adet + " × " : "") + t[1].replace(" (adet)", "")); });
      if (!kal.length) { out.innerHTML = '<span class="not">Tedavi seçin; tahmini aralık, gereken gün ve gün gün planınız burada oluşur.</span>'; return; }
      var c = para.value, f = function (v) { return SEM[c] + (Math.round(v * KUR[c] / 10) * 10).toLocaleString("tr-TR"); };
      var ek = (otel.checked ? 55 * gun : 0) + (tr.checked ? 60 : 0);
      var bas = new Date(tarih.value), g = function (i) { var d = new Date(bas); d.setDate(d.getDate() + i); return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short", weekday: "short" }); };
      var plan = ["Varış" + (tr.checked ? " · havalimanı VIP karşılama" : "") + (otel.checked ? " · otele yerleşme" : ""), "Muayene, 3D tomografi, kesin plan ve fiyat"];
      for (var i = 2; i < gun; i++) plan.push(i === gun - 1 ? "Son prova ve uygulama" : "Tedavi seansı " + (i - 1) + " · öğleden sonra serbest (Kaleiçi, plaj)");
      plan.push("Kontrol, garanti belgesi ve dönüş" + (tr.checked ? " · havalimanı transferi" : ""));
      out.innerHTML = '<div class="not" style="margin:0">Tahmini aralık (' + kal.join(", ") + ')</div><div class="buyuk">' + f(alt) + " – " + f(ust) + '</div>' + (ek ? '<div class="not">+ konaklama/transfer yaklaşık ' + f(ek) + "</div>" : "") +
        '<div style="margin-top:12px;font-weight:700">Antalya\'da kalmanız gereken: ' + gun + " gün" + (iki ? " (implant için 3–6 ay sonra ikinci kısa ziyaret)" : "") + '</div><ul class="plan" style="margin-top:10px">' + plan.map(function (p, i) { return "<li><b>" + g(i) + "</b><span>" + p + "</span></li>"; }).join("") + '</ul><p class="not">Fiyatlar örnek aralıktır; kesin fiyat ücretsiz muayene ve tomografi sonrası yazılı verilir. Kurlar yaklaşıktır.</p>';
      k.dataset.ozet = "Merhaba, web sitenizdeki planlayıcıdan yazıyorum.\nTedaviler: " + kal.join(", ") + "\nTahmini: " + f(alt) + " – " + f(ust) + "\nGeliş tarihi: " + bas.toLocaleDateString("tr-TR") + " · " + gun + " gün" + (otel.checked ? " · otel istiyorum" : "") + (tr.checked ? " · transfer istiyorum" : "") + "\nÜcretsiz ön değerlendirme rica ederim.";
    }
    k.querySelector(".p-gonder").onclick = function () { waAc(k.dataset.ozet || "Merhaba, ücretsiz ön değerlendirme almak istiyorum."); };
    hesap();
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".simulator").forEach(simulator); document.querySelectorAll(".planlayici").forEach(planlayici); });
})();
