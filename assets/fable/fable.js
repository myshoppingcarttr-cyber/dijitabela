/* Dijitabela · yeni tasarım ortak betiği (12 Kas 2026). Kütüphane yok; hareket prefers-reduced-motion'a uyar. */
(function () {
  "use strict";
  var d = document, kok = d.body.getAttribute("data-kok") || "";
  var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, k) { return (k || d).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || d).querySelectorAll(s)); };
  d.documentElement.classList.add("js");

  /* ---- Menü (telefon) ---- */
  var md = $("#menu-dugme"), menu = $("#menu");
  if (md && menu) {
    var kapat = function () { menu.classList.remove("acik"); md.setAttribute("aria-expanded", "false"); md.setAttribute("aria-label", "Menüyü aç"); d.body.style.overflow = ""; };
    md.addEventListener("click", function () {
      var acik = !menu.classList.contains("acik");
      if (!acik) return kapat();
      menu.style.top = $("#ust").getBoundingClientRect().bottom + "px";
      menu.classList.add("acik"); md.setAttribute("aria-expanded", "true"); md.setAttribute("aria-label", "Menüyü kapat"); d.body.style.overflow = "hidden";
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) kapat(); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("acik")) { kapat(); md.focus(); } });
  }

  /* ---- Sabit çubuk: ilk ekran geçilince görünür, kapanış bölümünde çekilir ---- */
  var cubuk = $("#sabit-cubuk");
  if (cubuk) {
    cubuk.hidden = false;
    var son = $(".kapanis"), sonGor = false, yenile = function () { cubuk.classList.toggle("gor", window.scrollY > window.innerHeight * 0.7 && !sonGor); };
    if (son && "IntersectionObserver" in window) new IntersectionObserver(function (g) { sonGor = g[0].isIntersecting; yenile(); }, { threshold: 0.15 }).observe(son);
    window.addEventListener("scroll", yenile, { passive: true }); yenile();
  }

  /* ---- Küçük giriş kayması (içerik her durumda görünür) ---- */
  if (!azHareket && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (g) { g.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("gor"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(".kay-gir").forEach(function (e) { io.observe(e); });
  } else $$(".kay-gir").forEach(function (e) { e.classList.add("gor"); });

  /* ---- Kahraman sahnesi: telefon sohbeti + Google kartı + eğim ---- */
  var sahne = $(".sahne-ic");
  if (sahne) {
    var sohbet = $(".sohbet", sahne), durum = $(".gkart .durum", sahne), rk = $(".rkart", sahne);
    var AKIS = [["ben", "Merhaba, yarın 10'a yer var mı?"], ["o", "Merhaba! Yarın 10:00 ve 11:30 boş. Hangisini yazayım?"], ["ben", "10:00 olsun"], ["o", "Yazdım. Yarın 09:00'da hatırlatma gönderirim."], ["not", "02:14 · asistan cevapladı"]];
    var ekle = function (t, m) { var p = d.createElement("p"); p.className = t === "o" ? "" : t; p.textContent = m; sohbet.appendChild(p); while (sohbet.children.length > 6) sohbet.removeChild(sohbet.firstChild); return p; };
    var acikYap = function () { if (!durum) return; durum.className = "durum acik"; durum.textContent = "Açık · Kapanış 19:00"; };
    if (azHareket) { AKIS.forEach(function (a) { ekle(a[0], a[1]); }); acikYap(); }
    else {
      if (rk) rk.style.opacity = "0";
      var i = 0, adim = function () {
        if (d.hidden) return setTimeout(adim, 1500);
        if (i >= AKIS.length) { if (rk) { rk.style.transition = "opacity .5s"; rk.style.opacity = "1"; } return setTimeout(function () { sohbet.innerHTML = ""; i = 0; if (rk) rk.style.opacity = "0"; adim(); }, 7000); }
        var a = AKIS[i++];
        if (a[0] === "o") { var y = ekle("yaziyor", "•••"); setTimeout(function () { y.remove(); ekle("o", a[1]); setTimeout(adim, 1500); }, 1100); }
        else { ekle(a[0], a[1]); setTimeout(adim, a[0] === "not" ? 600 : 1200); }
      };
      setTimeout(adim, 900); setTimeout(acikYap, 2600);
      // Eğim: fare ile (masaüstü); dokunmatikte hafif yüzme animasyonu
      var kaba = window.matchMedia && matchMedia("(hover: none)").matches;
      if (kaba) sahne.classList.add("yuzer");
      else {
        var kh = $(".kahraman"), bek = 0;
        kh.addEventListener("pointermove", function (e) {
          if (bek) return; bek = requestAnimationFrame(function () {
            bek = 0; var r = kh.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            sahne.style.setProperty("--ry", (-17 + x * 22).toFixed(1) + "deg"); sahne.style.setProperty("--rx", (7 - y * 14).toFixed(1) + "deg");
          });
        });
        kh.addEventListener("pointerleave", function () { sahne.style.removeProperty("--ry"); sahne.style.removeProperty("--rx"); });
      }
    }
  }

  /* ---- Önce / sonra anahtarı ---- */
  $$(".oncesonra").forEach(function (k) {
    var b = $$(".anahtar button", k);
    b.forEach(function (x) { x.addEventListener("click", function () { var once = x.getAttribute("data-d") === "once"; k.classList.toggle("once", once); b.forEach(function (y) { y.setAttribute("aria-pressed", y === x ? "true" : "false"); }); }); });
  });

  /* ---- Vitrin rayı okları ---- */
  $$("[data-ray]").forEach(function (b) {
    b.addEventListener("click", function () { var r = $("#" + b.getAttribute("data-ray")), k = r.firstElementChild; if (!k) return; r.scrollBy({ left: (k.getBoundingClientRect().width + 22) * (b.getAttribute("data-yon") === "geri" ? -1 : 1), behavior: azHareket ? "auto" : "smooth" }); });
  });

  /* ---- "Sitenizi görün": mevcut taslak aracını işletme adıyla açar ---- */
  var dene = $("#dene-form");
  if (dene) dene.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = new URLSearchParams({ sek: $("#dene-sek").value, tarz: "A" }), ad = $("#dene-ad").value.trim(); if (ad) q.set("ad", ad);
    window.open(kok + "assets/yeni/taslak/index.html?" + q, "_blank", "noopener");
  });

  /* ---- Çalışmalar: süzgeç + video ---- */
  var suz = $$(".suzgec button");
  suz.forEach(function (b) { b.addEventListener("click", function () { var t = b.getAttribute("data-tur"); suz.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); $$(".is").forEach(function (k) { k.hidden = t !== "tumu" && (" " + k.getAttribute("data-tur") + " ").indexOf(" " + t + " ") < 0; }); }); });
  $$(".oynat").forEach(function (b) { b.addEventListener("click", function () { var m = b.parentNode, v = d.createElement("video"); v.src = b.getAttribute("data-video"); v.controls = true; v.playsInline = true; v.autoplay = true; v.poster = ($("img", m) || {}).src || ""; m.innerHTML = ""; m.appendChild(v); }); });

  /* ---- Form: CRM kaydı (assets/data.js taslakIste). Veri katmanı yalnız forma dokunulunca yüklenir. ---- */
  var form = $("#form");
  if (form) {
    var yuk = null, betik = function (s) { return new Promise(function (ok, hata) { var e = d.createElement("script"); e.src = kok + s; e.onload = ok; e.onerror = hata; d.head.appendChild(e); }); };
    var hazirla = function () { return yuk || (yuk = betik("assets/config.js").then(function () { return betik("assets/data.js"); })); };
    form.addEventListener("focusin", hazirla, { once: true });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ad = $("#f-ad"), tel = $("#f-tel"), kv = $("#f-kvkk"), o = $("#form-sonuc"), a = ad.value.trim(), t = tel.value.trim(), ilk = null;
      [[ad, !a, "İşletmenizin adını yazın."], [tel, t.replace(/\D/g, "").length < 10, "Telefon numaranızı 10 ya da 11 haneli yazın (örn. 0532 123 45 67)."], [kv, !kv.checked, "Devam etmek için KVKK metnini onaylayın."]].forEach(function (h) {
        var el = h[0], id = el.id + "-hata", not = d.getElementById(id);
        el.setAttribute("aria-invalid", h[1] ? "true" : "false");
        if (h[1]) { if (!not) { not = d.createElement("small"); not.id = id; not.className = "alan-hata"; el.closest("label").after(not); } not.textContent = h[2]; el.setAttribute("aria-describedby", id); ilk = ilk || el; }
        else if (not) not.remove();
      });
      if (ilk) { o.hidden = true; ilk.focus(); return; }
      var sek = $("#f-sek").value, kaynak = form.getAttribute("data-kaynak") || "Ana sayfa";
      var metin = "Merhaba, " + a + " (" + sek + ") için " + (kaynak === "Ana sayfa" ? "ücretsiz 3 ön tasarım istiyorum" : "bilgi almak istiyorum") + ". Telefon: " + t;
      var waA = '<a href="https://wa.me/905019452184?text=' + encodeURIComponent(metin) + '" target="_blank" rel="noopener">WhatsApp\'tan yazın</a>';
      var btn = $("button[type=submit]", form); btn.disabled = true; o.hidden = false; o.textContent = "Gönderiliyor…";
      hazirla().then(function () { if (!(window.API && API.taslakIste)) throw new Error("API yok"); return API.taslakIste({ isletme: a, sektor: sek, tel: t, kvkk: new Date().toISOString(), kaynak: kaynak }); })
        .then(function () { o.innerHTML = (kaynak === "Ana sayfa" ? "Talebiniz alındı. 3 ön tasarımınız 2 iş günü içinde telefonunuza gelecek." : "Talebiniz alındı; aynı gün sizi arayacağız.") + " Beklemek istemezseniz " + waA + "."; form.reset(); })
        .catch(function () { o.innerHTML = "Bağlantı hatası oldu. Talebinizi " + waA + " ya da 0501 945 21 84 numarasını arayın."; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
