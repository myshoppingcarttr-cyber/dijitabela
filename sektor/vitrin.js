/* Dijitabela sektör vitrini demoları (29 Eki 2026). Hepsi tarayıcıda çalışır; hiçbir yere mesaj, arama ya da veri GÖNDERMEZ.
   İçerik HTML'de önceden yazılıdır (JS kapalıysa da görünür); JS yalnız canlandırır. */
(function () {
  "use strict";
  var V = {};
  try { V = JSON.parse(document.getElementById("v-veri").textContent); } catch (e) {}
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var AZ = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saat = function () { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };
  var tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  var el = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---- 1. WhatsApp asistanı ---- */
  var wa = $("#wa-demo");
  if (wa && V.wa) {
    var ic = $(".wa-ic", wa), form = $(".wa-form", wa), inp = $("input", form), mesgul = false;
    var balon = function (metin, biz, etk) {
      var b = el("div", "bl" + (biz ? " biz" : ""));
      if (etk) b.appendChild(el("span", "etk", etk));
      b.appendChild(document.createTextNode(metin));
      b.appendChild(el("small", "", saat() + (biz ? " ✓✓" : "")));
      ic.appendChild(b); ic.scrollTop = ic.scrollHeight; return b;
    };
    var cevapBul = function (t) {
      var k = (V.wa.kurallar || []);
      for (var i = 0; i < k.length; i++) { if (new RegExp(k[i][0], "i").test(t)) return k[i][1]; }
      return V.wa.varsayilan;
    };
    var sor = function (t) {
      t = String(t || "").trim(); if (!t || mesgul) return; mesgul = true;
      // müşteri yazar (soldaki gri balon), asistan cevaplar (sağdaki yeşil): işletme gözünden bakıyoruz
      balon(t, false);
      var y = el("div", "bl yaziyor", "asistan yazıyor…"); ic.appendChild(y); ic.scrollTop = ic.scrollHeight;
      setTimeout(function () { y.remove(); balon(cevapBul(t), true, "ASİSTAN · OTOMATİK"); mesgul = false; }, AZ ? 50 : 900 + Math.min(1400, t.length * 18));
    };
    $$(".wa-cip button", wa).forEach(function (b) { b.addEventListener("click", function () { sor(b.textContent); }); });
    form.addEventListener("submit", function (e) { e.preventDefault(); sor(inp.value); inp.value = ""; });
  }

  /* ---- 2. Ayşe telefon asistanı ---- */
  var ay = $("#ayse-demo");
  if (ay) {
    var sekmeler = $$(".ayse-sekme button", ay), paneller = $$(".ayse-panel", ay), zam = null;
    var durdur = function () { if (zam) { clearTimeout(zam); zam = null; } $$(".arama-ust", ay).forEach(function (u) { u.classList.remove("cal"); }); };
    sekmeler.forEach(function (s, i) {
      s.addEventListener("click", function () {
        durdur(); sekmeler.forEach(function (x) { x.classList.toggle("on", x === s); x.setAttribute("aria-selected", x === s); });
        paneller.forEach(function (p, j) { p.hidden = j !== i; });
      });
    });
    $$(".ayse-oynat", ay).forEach(function (btn) {
      btn.addEventListener("click", function () {
        durdur();
        var p = btn.closest(".ayse-panel"), ol = $(".dokum", p), satir = $$("li", ol), ust = $(".arama-ust", p), sure = $(".sure", p), s0 = Date.now(), i = 0;
        ol.classList.add("gizli"); satir.forEach(function (li) { li.classList.remove("gor"); });
        ust.classList.add("cal"); btn.textContent = "Baştan oynat";
        var adim = function () {
          var gecen = Math.floor((Date.now() - s0) / 1000); sure.textContent = "0" + Math.floor(gecen / 60) + ":" + ("0" + gecen % 60).slice(-2);
          if (i >= satir.length) { ust.classList.remove("cal"); return; }
          var li = satir[i++]; li.classList.add("gor"); ol.scrollTop = ol.scrollHeight;
          var uz = li.textContent.length; zam = setTimeout(adim, AZ ? 30 : Math.max(1100, Math.min(3600, uz * 42)));
        };
        adim();
      });
    });
  }

  /* ---- 3. Google yorum: puan → bağlantı HERKESE ---- */
  var gp = $("#puan-demo");
  if (gp) {
    var sonuc = $(".sonuc", gp);
    $$(".puan button", gp).forEach(function (b, i) {
      b.addEventListener("click", function () {
        $$(".puan button", gp).forEach(function (x, j) { x.classList.toggle("on", j <= i); });
        var p = i + 1; sonuc.innerHTML = "";
        sonuc.appendChild(el("p", "", "✓ " + p + " yıldız: Google yorum sayfası açılır. Bağlantı puan ne olursa olsun HERKESE gider."));
        if (p <= 3) sonuc.appendChild(el("p", "", "⚑ Ayrıca işletme sahibine anında bildirim: \"" + p + " yıldızlı geri bildirim geldi, müşteriyi arayın.\" Yorum engellenmez."));
        else sonuc.appendChild(el("p", "", "Teşekkür mesajı otomatik gider; yoruma 10 dakika içinde cevap taslağı hazırlanır."));
      });
    });
  }

  /* ---- 4. IG yorum → DM ---- */
  var ig = $("#ig-demo");
  if (ig && V.ig) {
    var yl = $(".ig-yorum", ig), dm = $(".ig-dm", ig), btn = $(".ig-yaz");
    btn.addEventListener("click", function () {
      btn.disabled = true;
      var li = el("li", "yeni"); li.appendChild(el("b", "", "ayse.k")); li.appendChild(document.createTextNode(V.ig.kelime)); yl.appendChild(li);
      setTimeout(function () {
        dm.classList.add("on"); var i = 0;
        var akis = function () {
          if (i >= V.ig.dm.length) {
            var c = el("li", "cvp yeni"); c.appendChild(el("b", "", V.ig.hesap)); c.appendChild(document.createTextNode("Detayları özelden ilettik 🙌")); yl.appendChild(c);
            btn.textContent = "Akış tamam ✓"; return;
          }
          var m = V.ig.dm[i++], b = el("div", "bl" + (m[0] ? " biz" : ""), m[1]); dm.appendChild(b);
          setTimeout(akis, AZ ? 30 : 1100);
        };
        akis();
      }, AZ ? 30 : 900);
    });
  }

  /* ---- 5. Teklif / talep hattı ---- */
  var tk = $("#teklif-demo");
  if (tk && V.teklif) {
    var T = V.teklif, cikti = $(".teklif-cikti", tk);
    $(".teklif-hesap", tk).addEventListener("click", function () {
      var top = T.taban || 0, sec = [], d = $$("select", tk).map(function (s) { sec.push(s.options[s.selectedIndex].text); return +s.value || 0; });
      if (T.gece) top = d[0] * d[1] * (d[1] >= 3 ? 0.9 : 1) + (d[2] || 0);   // otel: oda × gece (3+ gece %10) + transfer
      else if (T.carp) top = d[0] * d[1];   // kafe: kişi başı × kişi
      else if (T.rent) top = (d[0] * d[1] * (d[1] >= 7 ? 0.85 : 1)) + d[2] * d[1];   // rent a car: günlük × gün (7+ gün %15) + günlük ek
      else d.forEach(function (x) { top += x; });
      var ad = ($("input", tk) || {}).value || "Ayşe Hanım";
      $(".tutar", cikti).innerHTML = "";
      if (T.tip === "randevu") {
        $(".tutar", cikti).textContent = T.sonuc_baslik;
      } else {
        $(".tutar", cikti).appendChild(document.createTextNode(tl(top)));
        $(".tutar", cikti).appendChild(el("small", "", T.birim || "+KDV"));
      }
      $(".eposta", cikti).innerHTML = "";
      $(".eposta", cikti).appendChild(el("b", "", "Konu: " + T.konu));
      $(".eposta", cikti).appendChild(el("span", "", T.eposta.replace("{ad}", ad).replace("{secim}", sec.join(", ")).replace("{tutar}", tl(top))));
      cikti.classList.add("on");
    });
  }

  /* ---- 6. Rapor grafiği: görünce dolar ---- */
  var gr = $$(".grafik");
  if (gr.length) {
    var ac = function (g) { g.classList.add("on"); };
    if ("IntersectionObserver" in window && !AZ) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { ac(e.target); io.unobserve(e.target); } }); }, { threshold: .3 });
      gr.forEach(function (g) { io.observe(g); });
    } else gr.forEach(ac);
  }

  /* ---- 7. Beyanno (mali müşavir): hatırlatma hazırla ---- */
  var by = $("#beyanno-demo");
  if (by) {
    $(".by-hazirla", by).addEventListener("click", function (e) {
      var k = $(".by-mesajlar", by); k.innerHTML = ""; e.target.disabled = true;
      var satirlar = $$("tbody tr", by), i = 0;
      var it = function () {
        if (i >= satirlar.length) { e.target.textContent = "Hepsi hazır · onay sizde"; return; }
        var tr = satirlar[i++], d = tr.dataset;
        tr.classList.add("tamam");
        var b = el("div", "bl biz"); b.appendChild(el("span", "etk", d.kisi.toUpperCase() + " · ÖNİZLEME"));
        b.appendChild(document.createTextNode(d.mesaj)); b.appendChild(el("small", "", "onay bekliyor"));
        k.appendChild(b); setTimeout(it, AZ ? 20 : 650);
      };
      it();
    });
  }

  /* ---- 8. FSK (fatura seti kontrol) ---- */
  var fs = $("#fsk-demo");
  if (fs) {
    $(".fsk-kontrol", fs).addEventListener("click", function (e) {
      e.target.disabled = true; var satirlar = $$("tbody tr", fs), i = 0, hata = 0;
      var it = function () {
        if (i >= satirlar.length) { $(".fsk-ozet", fs).textContent = satirlar.length + " set kontrol edildi · " + hata + " sette sorun var · rapor Excel'e hazır."; e.target.textContent = "Kontrol bitti"; return; }
        var tr = satirlar[i++], s = tr.dataset.sonuc, td = tr.lastElementChild;
        td.innerHTML = "";
        if (s === "ok") { tr.classList.add("tamam"); td.appendChild(el("span", "etiket y", "Uyumlu")); }
        else { hata++; tr.classList.add("uyar"); td.appendChild(el("span", "etiket k", "Sorun")); td.appendChild(el("div", "", s)); }
        setTimeout(it, AZ ? 20 : 500);
      };
      it();
    });
  }
})();
