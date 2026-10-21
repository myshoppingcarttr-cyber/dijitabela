/* Erkam Benli · Mimarlık & İç Mimarlık — ek bölümlerin davranışı (YZ önizleme, WhatsApp sohbet, kentsel dönüşüm, takvim, takip paneli, giriş animasyonları). GSAP 3.12.5 + ScrollTrigger. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);
  var AZ = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var anim = !!G && !AZ;
  var kokWa = $("#maliyet-hesap");
  var WA = (kokWa && kokWa.getAttribute("data-wa")) || "905542540253";
  var wa = function (m, no) { return "https://wa.me/" + (no || WA) + "?text=" + encodeURIComponent(m); };
  var fmt = function (n, d) { return Number(n).toLocaleString("tr-TR", { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 }); };
  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var KISA = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  function tween(el, hedef, d) {
    if (!el) return;
    if (!anim) { el.textContent = fmt(hedef, d); return; }
    var o = { v: parseFloat(el.getAttribute("data-v")) || 0 };
    el.setAttribute("data-v", hedef);
    G.to(o, { v: hedef, duration: .6, ease: "power2.out", overwrite: true, onUpdate: function () { el.textContent = fmt(o.v, d); } });
  }

  /* ---------- 1) Yapay zekâ iç mimari önizleme ---------- */
  function yz() {
    var kok = $("#yz"); if (!kok) return;
    var ONCE = "../img/once.jpg";
    var STG = ["../img/stil0.jpg", "../img/stil1.jpg", "../img/stil2.jpg", "../img/stil3.jpg"];
    var AD = ["Minimal", "Modern", "Sıcak Doğal", "Klasik"];
    var kars = $(".yz-kars", kok), onc = $(".yz-once", kok), son = $(".yz-sonra", kok), cz = $(".yz-cizgi", kok), isle = $(".yz-isle", kok),
      yazi = $(".yz-isle b", kok), pb = $(".yz-pb i", kok), tara = $(".tara", kok), ar = $(".yz-aralik", kok), girdi = $("#yz-dosya"), yukle = $(".yz-yukle", kok),
      etA = $(".yz-e.a", kok), chips = $$(".yz-chips button", kok), durum = $("#yz-durum");
    var stil = 1, meşgul = false, url = null, poz = 50, tl = null;
    STG.forEach(function (u) { var i = new Image(); i.src = u; });
    function koy(p) { poz = Math.max(0, Math.min(100, p)); son.style.clipPath = "inset(0 0 0 " + poz + "%)"; cz.style.left = poz + "%"; ar.value = poz; }
    var surukle = false;
    function x(e) { var r = kars.getBoundingClientRect(); koy((e.clientX - r.left) / r.width * 100); }
    kars.addEventListener("pointerdown", function (e) { if (meşgul) return; surukle = true; x(e); try { kars.setPointerCapture(e.pointerId); } catch (_) {} });
    kars.addEventListener("pointermove", function (e) { if (surukle) x(e); });
    kars.addEventListener("pointerup", function () { surukle = false; });
    kars.addEventListener("pointercancel", function () { surukle = false; });
    ar.addEventListener("input", function () { koy(+ar.value); });
    function bitir() {
      son.src = STG[stil]; son.alt = AD[stil] + " örnek render";
      isle.classList.remove("on"); meşgul = false;
      if (tl) { tl.kill(); tl = null; }
      durum.textContent = AD[stil] + " stilinde örnek render hazır. Çizgiyi sürükleyip önce/sonra karşılaştırın.";
      if (anim) { var o = { p: 100 }; G.to(o, { p: 50, duration: 1.1, ease: "power3.out", onUpdate: function () { koy(o.p); } }); } else koy(50);
    }
    function calis() {
      if (meşgul) return; meşgul = true;
      isle.classList.add("on"); durum.textContent = "Yapay zekâ çalışıyor…";
      var adim = ["Oda ölçüleri ve perspektif okunuyor…", AD[stil] + " stili için malzeme ve renk seçiliyor…", "Işık ve gölge hesaplanıyor…", "Render hazırlanıyor…"];
      if (!anim) { yazi.textContent = adim[3]; pb.style.width = "100%"; setTimeout(bitir, 2400); return; }
      yazi.textContent = adim[0]; pb.style.width = "0%";
      tl = G.timeline({ onComplete: bitir });
      tl.fromTo(tara, { top: "0%" }, { top: "100%", duration: .9, repeat: 2, yoyo: true, ease: "sine.inOut" }, 0)
        .to(pb, { width: "100%", duration: 2.6, ease: "power1.inOut" }, 0);
      adim.forEach(function (t, i) { tl.call(function () { yazi.textContent = t; }, null, i * .65); });
    }
    function sec(i) { stil = i; chips.forEach(function (c, k) { c.classList.toggle("on", k === i); c.setAttribute("aria-pressed", k === i); }); }
    chips.forEach(function (c, i) { c.addEventListener("click", function () { if (meşgul) return; sec(i); calis(); }); });
    function dosya(f) {
      if (!f || !/^image\//.test(f.type)) { durum.textContent = "Lütfen bir fotoğraf (JPG, PNG, WebP) seçin."; return; }
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(f); onc.src = url; onc.alt = "Yüklediğiniz fotoğraf"; etA.textContent = "SİZİN FOTOĞRAFINIZ";
      yukle.querySelector("b").textContent = f.name.length > 28 ? f.name.slice(0, 25) + "…" : f.name;
      if (!meşgul) calis();
    }
    girdi.addEventListener("change", function () { dosya(girdi.files && girdi.files[0]); });
    ["dragover", "dragenter"].forEach(function (ev) { yukle.addEventListener(ev, function (e) { e.preventDefault(); yukle.classList.add("s"); }); });
    ["dragleave", "drop"].forEach(function (ev) { yukle.addEventListener(ev, function (e) { e.preventDefault(); yukle.classList.remove("s"); }); });
    yukle.addEventListener("drop", function (e) { dosya(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]); });
    onc.src = ONCE; son.src = STG[stil]; koy(50);
  }

  /* ---------- 2) WhatsApp asistanı sohbet simülasyonu ---------- */
  function sohbet() {
    var akis = $("#wa-akis"); if (!akis) return;
    var M = [
      ["g", "Merhaba, Gölbaşı'ndaki arsama villa yaptırmak istiyorum. Keşif randevusu alabilir miyim?", "10:41"],
      ["a", "Merhaba, hoş geldiniz! Ben mimarlık ofisinin dijital asistanıyım. Villanın yaklaşık kaç m² olmasını düşünüyorsunuz?", "10:41"],
      ["g", "Yaklaşık 320 m², iki katlı.", "10:42"],
      ["a", "Teşekkürler. 320 m² iki katlı bir konut için konsept ve uygulama projesi tahmini aralığı: örnek 290.000–350.000 TL (+KDV). Kesin teklif keşiften sonra yazılı verilir.", "10:42"],
      ["a", "Keşif için Perşembe 14:00 ya da Cuma 11:00 uygun. Hangisi olsun?", "10:42"],
      ["g", "Perşembe 14:00 olsun.", "10:43"],
      ["a", "Randevunuz oluşturuldu ✓ Perşembe 14:00. Hatırlatmayı bir gün önce WhatsApp'tan göndereceğim.", "10:43"]
    ];
    var calisiyor = false, tl = null;
    function balon(m) { var d = document.createElement("div"); d.className = "wa-m " + m[0]; d.innerHTML = ""; d.appendChild(document.createTextNode(m[1])); var s = document.createElement("small"); s.textContent = m[2] + (m[0] === "g" ? " ✓✓" : ""); d.appendChild(s); akis.appendChild(d); return d; }
    function yaz() { var d = document.createElement("div"); d.className = "wa-yaz"; d.innerHTML = "<i></i><i></i><i></i>"; akis.appendChild(d); if (anim) G.to(d.children, { y: -4, repeat: -1, yoyo: true, duration: .32, stagger: .12 }); return d; }
    function hepsi() { akis.innerHTML = ""; M.forEach(balon); }
    function oynat() {
      if (calisiyor) return; akis.innerHTML = "";
      if (!anim) { hepsi(); return; }
      calisiyor = true; tl = G.timeline({ onComplete: function () { calisiyor = false; } });
      M.forEach(function (m) {
        if (m[0] === "a") {
          var y; tl.call(function () { y = yaz(); G.from(y, { opacity: 0, y: 8, duration: .25 }); }, null, "+=.5");
          tl.call(function () { if (y) { G.killTweensOf(y.children); y.remove(); } var b = balon(m); G.from(b, { opacity: 0, y: 14, scale: .95, transformOrigin: "0 0", duration: .35, ease: "back.out(1.6)" }); }, null, "+=" + Math.min(1.6, .6 + m[1].length / 120));
        } else {
          tl.call(function () { var b = balon(m); G.from(b, { opacity: 0, y: 14, scale: .95, transformOrigin: "100% 0", duration: .35, ease: "back.out(1.6)" }); }, null, "+=.8");
        }
      });
    }
    var d = $("#wa-tekrar"); if (d) d.addEventListener("click", function () { if (tl) tl.kill(); calisiyor = false; oynat(); });
    if (ST && anim) ST.create({ trigger: $(".wa-tel"), start: "top 80%", once: true, onEnter: oynat }); else hepsi();
  }

  /* ---------- 3) Kentsel dönüşüm hesaplayıcı ---------- */
  function kentsel() {
    var k = $("#ks"); if (!k) return;
    var a = $("#ks-arsa"), d = $("#ks-daire"), e = $("#ks-kaks"), m = $("#ks-m2");
    var hedefler = { top: $("#ks-top"), hak: $("#ks-hak"), oran: $("#ks-oran"), sure: $("#ks-sure"), art: $("#ks-art") }, cb = $("#ks-cubuk"), gon = $("#ks-gonder");
    function hesap() {
      var arsa = Math.max(100, +a.value || 0), daire = Math.max(2, +d.value || 0), kaks = Math.max(.5, +e.value || 0), m2 = Math.max(30, +m.value || 0);
      var emsal = arsa * kaks;
      var top = emsal * 1.3; // emsal harici alanlar (ortak alan, çıkma, sığınak, otopark) için yaklaşık %30
      var hedefHak = daire * m2 * 1.6; // varsayım: hak sahibi eski dairesinin yaklaşık 1,6 katını bekler
      var oran = Math.min(.7, Math.max(.35, hedefHak / top));
      var hakTop = top * oran, daireBasi = hakTop / daire, art = (daireBasi / m2 - 1) * 100;
      var sure = 8 + top / 500, s1 = Math.round(sure * .9), s2 = Math.round(sure * 1.2);
      tween(hedefler.top, top); tween(hedefler.hak, daireBasi); tween(hedefler.oran, oran * 100); tween(hedefler.art, art);
      hedefler.sure.textContent = s1 + "–" + s2 + " ay";
      var h = cb.querySelector(".h"), y = cb.querySelector(".y");
      h.textContent = "Hak sahipleri %" + Math.round(oran * 100); y.textContent = "Yüklenici %" + Math.round((1 - oran) * 100);
      if (anim) { G.to(h, { flexGrow: oran * 100, duration: .5, overwrite: true }); G.to(y, { flexGrow: (1 - oran) * 100, duration: .5, overwrite: true }); } else { h.style.flexGrow = oran * 100; y.style.flexGrow = (1 - oran) * 100; }
      gon.href = wa("Merhaba, kentsel dönüşüm hesaplayıcıdan yazıyorum.\nArsa: " + fmt(arsa) + " m², mevcut daire: " + daire + ", emsal (KAKS): " + kaks + ", mevcut daire: " + m2 + " m²\nYeni toplam inşaat: ≈ " + fmt(top) + " m²\nDaire başına tahmini yeni alan: ≈ " + fmt(daireBasi) + " m²\nKat karşılığı: hak sahipleri %" + Math.round(oran * 100) + "\nTahmini süre: " + s1 + "–" + s2 + " ay (tahminidir).\nDeğerlendirebilir misiniz?");
    }
    $$("input", k).forEach(function (i) { i.addEventListener("input", hesap); });
    hesap();
  }

  /* ---------- 4) Keşif randevu takvimi ---------- */
  function takvim() {
    var kok = $("#tk"); if (!kok) return;
    var gk = $(".tk-gunler", kok), sk = $(".tk-saat", kok), oz = $("#tk-ozet"), dg = $("#tk-gonder");
    var SAATLER = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
    var bugun = new Date(); bugun.setHours(12, 0, 0, 0);
    var gunler = [], i;
    for (i = 1; i <= 14; i++) { var t = new Date(bugun); t.setDate(bugun.getDate() + i); gunler.push(t); }
    var secG = -1, secS = -1;
    function dolu(g, s) { return (g * 7 + s * 3 + 2) % 5 === 0; }
    gk.innerHTML = "";
    gunler.forEach(function (t, gi) {
      var b = document.createElement("button"); b.type = "button"; b.className = "tk-gun"; b.disabled = t.getDay() === 0;
      b.innerHTML = "<small>" + KISA[t.getDay()] + "</small><b>" + t.getDate() + "</b><small>" + AYLAR[t.getMonth()].slice(0, 3) + "</small>";
      b.setAttribute("aria-label", t.getDate() + " " + AYLAR[t.getMonth()] + " " + GUNLER[t.getDay()] + (b.disabled ? " (kapalı)" : ""));
      b.addEventListener("click", function () { secG = gi; secS = -1; ciz(); }); gk.appendChild(b);
    });
    function ciz() {
      $$(".tk-gun", gk).forEach(function (b, gi) { b.classList.toggle("on", gi === secG); });
      sk.innerHTML = "";
      SAATLER.forEach(function (s, si) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = s; b.disabled = secG < 0 || dolu(secG, si);
        b.classList.toggle("on", si === secS);
        b.addEventListener("click", function () { secS = si; ciz(); }); sk.appendChild(b);
      });
      if (secG >= 0 && secS >= 0) {
        var t = gunler[secG], metin = t.getDate() + " " + AYLAR[t.getMonth()] + " " + GUNLER[t.getDay()] + ", saat " + SAATLER[secS];
        oz.textContent = "Seçiminiz: " + metin; dg.hidden = false;
        dg.href = wa("Merhaba, web sitenizden keşif randevusu istiyorum: " + metin + ". Uygun mudur?");
      } else { oz.textContent = secG < 0 ? "Önce bir gün seçin." : "Şimdi bir saat seçin."; dg.hidden = true; }
    }
    for (i = 0; i < gunler.length; i++) if (gunler[i].getDay() !== 0) { secG = i; break; }
    for (i = 0; i < SAATLER.length; i++) if (!dolu(secG, i)) { secS = i; break; }
    ciz();
  }

  /* ---------- 5) Proje takip paneli (zengin) ---------- */
  var tost;
  function tostGoster(m) {
    if (!tost) { tost = document.createElement("div"); tost.className = "tp-toast"; tost.setAttribute("role", "status"); document.body.appendChild(tost); }
    tost.textContent = m; tost.style.display = "block"; clearTimeout(tost._z); tost._z = setTimeout(function () { tost.style.display = "none"; }, 2600);
  }
  window.EKTakip = {
    goster: function (kod) {
      var P = $("#portal"); if (!P) return;
      var k = (kod || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "") || "ERK2481";
      if (k !== "ERK2481" && k !== "BNL2481") { P.innerHTML = '<p class="acik">Bu kodla proje bulunamadı. Deneme kodu: ERK-2481</p>'; return; }
      var A = [["Keşif ve rölöve", "ok", "12 Eyl"], ["Konsept ve 3B görseller", "ok", "26 Eyl"], ["Avan proje onayı", "ok", "4 Eki"], ["Uygulama projesi", "su", "%60 · statik koordinasyon sürüyor"], ["Ruhsat başvurusu", "", "Tahmini 3 Kas"], ["Şantiye başlangıcı", "", "Tahmini Aralık"]];
      var PF = [["A-101 Zemin kat planı", "rev.3", "12 Eki"], ["A-102 Normal kat planı", "rev.2", "10 Eki"], ["A-201 Kesitler", "rev.1", "8 Eki"], ["A-301 Cepheler", "rev.2", "9 Eki"]];
      var IC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"/></svg>';
      P.innerHTML =
        '<div class="tp-ust"><div><div class="etiket">Villa · Gölbaşı · ERK-2481</div></div><div class="tp-yuzde">%58 <small class="not" style="display:inline">tamamlandı</small></div></div><div class="tp-bar"><i></i></div>' +
        '<div class="tp-bol"><h4>Aşama zaman çizelgesi</h4><div class="tp-zc">' + A.map(function (r, i) { return '<div class="adim ' + r[1] + '"><b>' + (r[1] === "ok" ? "✓" : i + 1) + '</b><div><strong>' + r[0] + '</strong><br><span class="not">' + r[2] + '</span></div></div>'; }).join("") + '</div></div>' +
        '<div class="tp-bol"><h4>Paftalar</h4><ul class="tp-paf">' + PF.map(function (r) { return '<li><span>' + r[0] + '<br><small>' + r[1] + ' · ' + r[2] + '</small></span><button type="button" class="tp-ind" aria-label="' + r[0] + ' indir" data-pf="' + r[0] + '">' + IC + '</button></li>'; }).join("") + '</ul></div>' +
        '<div class="tp-bol"><h4>Sıradaki toplantı</h4><div class="tp-top"><b>Perşembe 15 Ekim · 14:00</b><br>Ofis, Çankaya · Konu: statik koordinasyon ve ruhsat dosyası</div></div>' +
        '<div class="tp-bol"><h4>Ödeme durumu <small class="not">(örnek plan)</small></h4><div class="tp-od"><div class="ok"><em>ÖDENDİ</em><b>Sözleşme avansı</b>%30</div><div class="ok"><em>ÖDENDİ</em><b>Avan proje onayı</b>%30</div><div><em>BEKLİYOR</em><b>Uygulama projesi teslimi</b>%40 · vade 30 Eki</div></div></div>' +
        '<div class="tp-bol"><h4>Şantiye foto güncellemesi <small class="not">(örnek görseller)</small></h4><div class="tp-foto"><figure><img src="../img/p1.jpg" alt="Şantiye güncellemesi 1" loading="lazy"><figcaption>9 Eki · Cephe</figcaption></figure><figure><img src="../img/p6.jpg" alt="Şantiye güncellemesi 2" loading="lazy"><figcaption>6 Eki · Kaba yapı</figcaption></figure><figure><img src="../img/p4.jpg" alt="Şantiye güncellemesi 3" loading="lazy"><figcaption>2 Eki · Temel</figcaption></figure></div></div>';
      $$(".tp-ind", P).forEach(function (b) { b.addEventListener("click", function () { tostGoster("Demo: gerçek panelde \"" + b.getAttribute("data-pf") + "\" PDF olarak iner."); }); });
      var bar = $(".tp-bar i", P);
      if (anim) { G.from(P.children, { y: 16, opacity: 0, duration: .45, stagger: .07, ease: "power2.out", clearProps: "all" }); G.fromTo(bar, { width: "0%" }, { width: "58%", duration: 1, ease: "power2.out" }); } else bar.style.width = "58%";
    }
  };

  /* ---------- 6) Bölüm girişleri (ScrollTrigger) ---------- */
  function girisler() {
    if (!anim || !ST) return;
    $$(".ek").forEach(function (s) {
      var oge = $$(".ek-bas > *, .ek-ger", s);
      if (!oge.length) return;
      G.from(oge, { y: 38, opacity: 0, duration: .8, ease: "power3.out", stagger: .09, clearProps: "transform,opacity",
        scrollTrigger: { trigger: s, start: "top 82%", once: true } });
    });
    $$(".ek-kartlar .ek-k, .by-m, .by-reel").forEach(function (c) {
      G.from(c, { y: 30, opacity: 0, duration: .7, ease: "power2.out", clearProps: "transform,opacity", scrollTrigger: { trigger: c, start: "top 90%", once: true } });
    });
    $$(".pr").forEach(function (c) { G.from(c, { opacity: 0, y: 24, duration: .6, clearProps: "transform,opacity", scrollTrigger: { trigger: c, start: "top 92%", once: true } }); });
    // açılır panelli yerleşimde (uygulama) panel açılınca konumlar değişir
    document.addEventListener("click", function () { setTimeout(function () { ST.refresh(); }, 450); }, true);
    addEventListener("load", function () { ST.refresh(); });
  }

  function basla() { yz(); sohbet(); kentsel(); takvim(); girisler(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
