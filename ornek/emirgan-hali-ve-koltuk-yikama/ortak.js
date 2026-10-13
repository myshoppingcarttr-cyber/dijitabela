/* Emirgan Halı ve Koltuk Yıkama · halı yıkama sayfası · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: RAPORLAR/KEREM-ADAY-1013.md (local.gen.tr; Yeni Doğan, Dumlupınar Blv. No:16, Kepez / Antalya; 0532 472 73 40).
   Fiyatlar, süreler, listeler ve kayıtlar ÖRNEKTİR. Hiçbir form gönderim yapmaz. Dijitabela taslağı. */
window.ISL={"ad":"Emirgan Halı ve Koltuk Yıkama","slug":"emirgan-hali-ve-koltuk-yikama","adres":"Yeni Doğan, Dumlupınar Blv. No:16, Kepez / Antalya","tel":"0532 472 73 40","telH":"+905324727340","wa":"905324727340","kaynak":"https://local.gen.tr/antalya/emirgan-hali-ve-koltuk-yikama/","haritaSorgu":"Emirgan Halı ve Koltuk Yıkama Yeni Doğan, Dumlupınar Blv. No:16, Kepez / Antalya","carpan":1,"kodOn":"EMR","kisa":"Emirgan","fiyatli":false,"fotolar":[{"dosya":"f1.webp","yazar":"Carpetbeggers - Discount Persian Rugs","lisans":"CC BY 2.0"},{"dosya":"f2.webp","yazar":"krebsmaus07","lisans":"CC BY 2.0"},{"dosya":"f3.webp","yazar":"Cllane4","lisans":"CC BY-SA 3.0"},{"dosya":"f4.webp","yazar":"Kinna2","lisans":"CC BY-SA 4.0"}]};
(function () {
  "use strict";
  var B = window.ISL;
  B.waLink = function (m) { return B.wa ? "https://wa.me/" + B.wa + "?text=" + encodeURIComponent(m) : null; };
  B.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(B.haritaSorgu);
  B.tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  B.yuv = function (n) { return Math.round(n / 10) * 10; };
  B.aralik = function (a, b) { return B.tl(B.yuv(a)) + " – " + B.tl(B.yuv(b)); };
  B.fiyatli = !!B.fiyatli; if (!B.fiyatli) { try { document.documentElement.classList.add("fiyatsiz"); } catch (e) {} }
  B.kac = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  B.gunler = function (n, bas) {
    var ad = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], ay = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], r = [], d = new Date();
    for (var i = (bas || 1); r.length < n; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); r.push({ g: ad[x.getDay()], n: x.getDate(), a: ay[x.getMonth()], idx: i, yaz: ad[x.getDay()] + " " + x.getDate() + " " + ay[x.getMonth()] }); }
    return r;
  };
  B.dilimler = ["Sabah", "Öğle", "Akşam"];
  B.oku = function (k, v) { try { var x = localStorage.getItem("dj-" + B.slug + "-" + k); return x ? JSON.parse(x) : v; } catch (e) { return (B._m || {})[k] || v; } };
  B.yaz = function (k, v) { B._m = B._m || {}; B._m[k] = v; try { localStorage.setItem("dj-" + B.slug + "-" + k, JSON.stringify(v)); } catch (e) {} };
  B.ozet = function (s) { var h = 0; s = String(s).toUpperCase(); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  B.toast = function (m) { var t = document.getElementById("ts"); if (!t) return; t.textContent = m; t.classList.add("a"); clearTimeout(B._tt); B._tt = setTimeout(function () { t.classList.remove("a"); }, 2400); };
  B.iz = function (x) { try { window.djIzle && window.djIzle(x); } catch (e) {} };
  B.kopyala = function (t) {
    function eski() { var a = document.createElement("textarea"); a.value = t; a.style.cssText = "position:fixed;left:-9999px"; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); } catch (e) {} a.remove(); B.toast("Mesaj kopyalandı"); }
    try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(t).then(function () { B.toast("Mesaj kopyalandı"); }, eski); return; } } catch (e) {}
    eski();
  };
  /* Hazır mesaj kutusu: önizleme + WhatsApp (cep hattıysa) ya da kopyala + ara (sabit hatsa). Hiçbir şey otomatik gönderilmez. */
  B.kutu = function (el, mesaj, gen) {
    if (!el) return; el.innerHTML = ""; el.hidden = false;
    var d = document.createElement("div"); d.className = "mk-on"; d.textContent = mesaj; el.appendChild(d);
    var r = document.createElement("div"); r.className = "mk-dg";
    if (B.wa) { var a = document.createElement("a"); a.className = "btn wa"; a.target = "_blank"; a.rel = "noopener"; a.href = B.waLink(mesaj); a.textContent = "WhatsApp’ta aç (gönderilmedi)"; if (gen) a.style.width = "100%"; r.appendChild(a); }
    else {
      var k = document.createElement("button"); k.type = "button"; k.className = "btn p"; k.textContent = "Mesajı kopyala"; k.onclick = function () { B.kopyala(mesaj); B.iz("mesaj:kopya"); }; r.appendChild(k);
      var t = document.createElement("a"); t.className = "btn"; t.href = "tel:" + B.telH; t.textContent = "Ara: " + B.tel; r.appendChild(t);
      var n = document.createElement("small"); n.className = "mk-not"; n.textContent = "Bu numara sabit hat; WhatsApp hattı teyit edilince buraya WhatsApp düğmesi gelir."; r.appendChild(n);
    }
    el.appendChild(r);
  };
  B.waVeyaAra = function (a, m) { if (!a) return; if (B.wa) { a.href = B.waLink(m); a.textContent = a.dataset.wa || "WhatsApp’tan yaz"; a.target = "_blank"; a.rel = "noopener"; } else { a.href = "tel:" + B.telH; a.textContent = "Ara: " + B.tel; a.removeAttribute("target"); a.classList.remove("wa"); } };
  B.gozle = function () {
    var l = [].slice.call(document.querySelectorAll("[data-rv]"));
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion:reduce)").matches) { l.forEach(function (e) { e.classList.add("g"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("g"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    l.forEach(function (e) { io.observe(e); });
  };
})();

/* Ek özellik altyapısı + hareket katmanı (GSAP varsa onunla, yoksa CSS/IO ile). prefers-reduced-motion açıksa hareket yok. */
(function () {
  "use strict";
  var B = window.ISL;
  B.azHareket = function () { try { return matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) { return false; } };
  /* Ek notlar: özelliklerin mesaja eklediği satırlar */
  B.ekNot = function (k, v) { var n = B.oku("eknot", {}); if (v) n[k] = v; else delete n[k]; B.yaz("eknot", n); };
  B.ekNotlar = function () { var n = B.oku("eknot", {}); return Object.keys(n).map(function (k) { return n[k]; }); };
  B.mesajSar = function () { if (B._sarili || !B.mesaj) return; B._sarili = 1; var m0 = B.mesaj; B.mesaj = function (o) { var s = m0(o), n = B.ekNotlar(); return n.length ? s + "\nEk bilgi:\n- " + n.join("\n- ") : s; }; };
  B.ek = B.ek || [];
  B.ekCiz = function (el, secim) {
    if (!el) return; B.mesajSar();
    var l = B.ek.filter(function (f) { return !secim || secim.indexOf(f.id) > -1; });
    el.innerHTML = l.map(function (f) { return '<article class="ek-k" data-ek="' + f.id + '"' + (el.hasAttribute("data-rvk") ? " data-rv" : "") + '><span class="ek-et">' + f.et + '</span><h3>' + f.ad + '</h3><p class="ek-ac">' + f.ac + '</p><div class="ek-ic">' + f.html() + '</div></article>'; }).join("");
    l.forEach(function (f) { var a = el.querySelector('[data-ek="' + f.id + '"]'); try { f.bagla(a); } catch (e) { console.error(e); } ["click", "input", "change", "keydown"].forEach(function (t) { a.addEventListener(t, function (e) { e.stopPropagation(); }); }); });
  };
  B.damgaCiz = function (a, anahtar, toplam, etiket) {
    var n = B.oku(anahtar, 3), k = a.querySelector(".damga");
    function ciz() { k.innerHTML = Array.apply(null, Array(toplam)).map(function (_, i) { return '<i class="' + (i < n ? "on" : "") + (i === toplam - 1 ? " son" : "") + '">' + (i === toplam - 1 ? "★" : i + 1) + '</i>'; }).join(""); a.querySelector(".dsay").textContent = n + " / " + toplam; }
    a.querySelector("[data-dg=ekle]").onclick = function () { n = Math.min(toplam, n + 1); B.yaz(anahtar, n); ciz(); B.toast(n === toplam ? etiket : "Damga eklendi (örnek)"); B.iz("ek:damga"); };
    a.querySelector("[data-dg=sifir]").onclick = function () { n = 0; B.yaz(anahtar, 0); ciz(); };
    ciz();
  };
  /* Hareket */
  B.hareket = function () {
    var az = B.azHareket(), g = window.gsap;
    var l = [].slice.call(document.querySelectorAll("[data-rv]"));
    if (az) { l.forEach(function (e) { e.classList.add("g"); }); return; }
    if (g && window.ScrollTrigger) {
      g.registerPlugin(window.ScrollTrigger);
      document.documentElement.classList.add("gsapli");
      var hs = document.querySelectorAll("[data-h]"); if (hs.length) g.from(hs, { y: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: .12, delay: .1 });
      document.querySelectorAll("[data-foto]").forEach(function (f) { g.fromTo(f, { scale: 1.12, clipPath: "inset(12% 8% 12% 8% round 24px)" }, { scale: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.4, ease: "expo.out", delay: .2 }); });
      document.querySelectorAll("[data-px]").forEach(function (f) { g.to(f, { yPercent: -10, ease: "none", scrollTrigger: { trigger: f.parentNode, start: "top bottom", end: "bottom top", scrub: true } }); });
      B.gozle();
      setTimeout(function () { window.ScrollTrigger.refresh(); }, 400);
    } else B.gozle();
  };
})();

/* Halı / koltuk yıkama motoru: m² hesaplayıcı, alım günü, hazır mesaj, teslim takibi. Fiyat aralıkları ve takip kayıtları ÖRNEKTİR. */
(function () {
  "use strict";
  var B = window.ISL, c = B.carpan || 1;
  /* ÖRNEK m² (veya adet) fiyat aralıkları; işletmenin gerçek fiyatı değildir */
  var T = [
    { id: "makine", ad: "Makine halısı", b: "m2", min: 60, max: 90, r: ["#9B2F2F", "#EAD7B5", "#24305E"], ac: "Günlük kullanılan, makine dokuması halılar." },
    { id: "yun", ad: "Yün / el dokuma", b: "m2", min: 140, max: 220, r: ["#7B3A1E", "#F0E2C4", "#2F4A3A"], ac: "Doğal lif; daha özenli ve yavaş yıkama ister." },
    { id: "shaggy", ad: "Shaggy (uzun tüylü)", b: "m2", min: 90, max: 130, r: ["#B8B0A3", "#E9E4DB", "#6E665B"], ac: "Uzun tüylü; kuruması daha uzun sürer." },
    { id: "bambu", ad: "Bambu / viskon", b: "m2", min: 120, max: 180, r: ["#3E6E73", "#DCEAE6", "#C9A55A"], ac: "Parlak ipeksi lif; suya hassas." },
    { id: "yolluk", ad: "Yolluk / paspas", b: "m2", min: 60, max: 90, r: ["#5A3E7A", "#EDE3F2", "#D18F2E"], ac: "Koridor ve kapı önü parçaları." },
    { id: "koltuk", ad: "Koltuk (oturak başı)", b: "oturak", min: 250, max: 400, r: ["#4F5D75", "#DDE3EC", "#BF8B5E"], ac: "Yerinde yıkama; oturak sayısıyla hesaplanır." },
    { id: "perde", ad: "Perde (kanat)", b: "adet", min: 150, max: 250, r: ["#7D8C6A", "#F1F0E6", "#C9A96E"], ac: "Tül ve fon perde, kanat başına." },
    { id: "yorgan", ad: "Yorgan / battaniye", b: "adet", min: 300, max: 450, r: ["#6C8EAD", "#EEF3F8", "#E2B07A"], ac: "Tek ya da çift kişilik, adet başına." }
  ];
  B.tipler = T.filter(function (t) { return !B.tipIds || B.tipIds.indexOf(t.id) > -1; }).map(function (t) { var x = {}; for (var k in t) x[k] = t[k]; x.min = Math.round(t.min * c / 5) * 5; x.max = Math.round(t.max * c / 5) * 5; return x; });
  B.tip = function (id) { return B.tipler.filter(function (t) { return t.id === id; })[0] || B.tipler[0]; };
  B.olculer = [[80, 150], [120, 180], [160, 230], [200, 290], [250, 350], [80, 300]];
  B.kalemler = function () { return B.oku("kalem", []); };
  B.kalemYaz = function (l) { B.yaz("kalem", l); };
  B.ekle = function (k) { var l = B.kalemler(); l.push(k); B.kalemYaz(l); };
  B.sil = function (i) { var l = B.kalemler(); l.splice(i, 1); B.kalemYaz(l); };
  B.m2 = function (k) { return Math.round(k.en * k.boy / 100) / 100 * k.n; };
  B.hesap = function (k) { var t = B.tip(k.t); if (t.b === "m2") { var m = B.m2(k); return { m2: m, min: m * t.min, max: m * t.max }; } return { m2: 0, min: k.n * t.min, max: k.n * t.max }; };
  B.toplam = function (l) { l = l || B.kalemler(); var r = { m2: 0, min: 0, max: 0, n: 0, adet: 0 }; l.forEach(function (k) { var h = B.hesap(k); r.m2 += h.m2; r.min += h.min; r.max += h.max; r.n += k.n; if (B.tip(k.t).b !== "m2") r.adet += k.n; }); r.m2 = Math.round(r.m2 * 100) / 100; return r; };
  B.m2Yaz = function (m) { return m.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " m²"; };
  B.kalemYazi = function (k) { var t = B.tip(k.t); return k.n + " × " + t.ad + (t.b === "m2" ? " " + k.en + "×" + k.boy + " cm" : (t.b === "oturak" ? " (oturak)" : "")); };
  /* Halı çizimi: ölçüye oranlı SVG (örnek çizim) */
  var sy = 0;
  B.haliSvg = function (en, boy, tid, o) {
    o = o || {}; var t = B.tip(tid), r = t.r, id = "h" + (++sy) + Math.floor(Math.random() * 1e4);
    if (t.b !== "m2") return B.esyaSvg(t, o);
    var W = Math.max(40, en), H = Math.max(40, boy), m = Math.min(W, H), b1 = m * .07, b2 = m * .13, fr = 10;
    var s = '<svg class="' + (o.cls || "halisvg") + '" viewBox="-2 ' + (-fr) + ' ' + (W + 4) + ' ' + (H + fr * 2) + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + t.ad + ' ' + en + '×' + boy + ' cm örnek çizim"><defs>' +
      '<pattern id="' + id + 'p" width="' + (m * .12) + '" height="' + (m * .12) + '" patternUnits="userSpaceOnUse"><path d="M' + (m * .06) + ' 0L' + (m * .12) + ' ' + (m * .06) + 'L' + (m * .06) + ' ' + (m * .12) + 'L0 ' + (m * .06) + 'z" fill="' + r[2] + '" opacity=".28"/></pattern>' +
      '<pattern id="' + id + 'k" width="' + (b1 * 1.1) + '" height="' + (b1 * 1.1) + '" patternUnits="userSpaceOnUse"><circle cx="' + (b1 * .55) + '" cy="' + (b1 * .55) + '" r="' + (b1 * .22) + '" fill="' + r[1] + '"/></pattern>' +
      (o.kir ? '<filter id="' + id + 'f"><feTurbulence type="fractalNoise" baseFrequency="' + (3 / m) + '" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .32  0 0 0 0 .25  0 0 0 0 .16  0 0 0 1.4 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>' : "") +
      '</defs><g stroke="' + r[1] + '" stroke-width="1.2" opacity=".85">';
    for (var x = 4; x < W; x += 6) s += '<path d="M' + x + ' 0V' + (-fr + 2) + 'M' + x + ' ' + H + 'V' + (H + fr - 2) + '"/>';
    s += '</g><rect width="' + W + '" height="' + H + '" fill="' + r[0] + '"/>' +
      '<rect x="' + b1 * .4 + '" y="' + b1 * .4 + '" width="' + (W - b1 * .8) + '" height="' + (H - b1 * .8) + '" fill="url(#' + id + 'k)"/>' +
      '<rect x="' + b2 + '" y="' + b2 + '" width="' + (W - b2 * 2) + '" height="' + (H - b2 * 2) + '" fill="' + r[0] + '" stroke="' + r[1] + '" stroke-width="' + (m * .012) + '"/>' +
      '<rect x="' + b2 + '" y="' + b2 + '" width="' + (W - b2 * 2) + '" height="' + (H - b2 * 2) + '" fill="url(#' + id + 'p)"/>' +
      '<path d="M' + W / 2 + ' ' + (H / 2 - m * .28) + 'L' + (W / 2 + m * .2) + ' ' + H / 2 + 'L' + W / 2 + ' ' + (H / 2 + m * .28) + 'L' + (W / 2 - m * .2) + ' ' + H / 2 + 'z" fill="' + r[2] + '" stroke="' + r[1] + '" stroke-width="' + (m * .01) + '"/>' +
      '<circle cx="' + W / 2 + '" cy="' + H / 2 + '" r="' + m * .07 + '" fill="' + r[1] + '"/>';
    [[b2, b2], [W - b2, b2], [b2, H - b2], [W - b2, H - b2]].forEach(function (p) { s += '<path d="M' + p[0] + ' ' + p[1] + 'm-' + m * .09 + ' 0l' + m * .09 + '-' + m * .09 + 'l' + m * .09 + ' ' + m * .09 + 'l-' + m * .09 + ' ' + m * .09 + 'z" fill="' + r[2] + '" opacity=".9"/>'; });
    if (tid === "shaggy") for (var i = 0; i < 160; i++) { var px = (i * 37.3) % W, py = (i * 71.7) % H; s += '<path d="M' + px + ' ' + py + 'l' + (m * .015) + ' ' + (m * .03) + '" stroke="' + r[2] + '" stroke-width="' + m * .006 + '" opacity=".4"/>'; }
    if (o.kir) s += '<rect width="' + W + '" height="' + H + '" fill="#6b5233" filter="url(#' + id + 'f)" opacity=".9"/><g fill="#4a3620" opacity=".5"><ellipse cx="' + W * .3 + '" cy="' + H * .35 + '" rx="' + m * .12 + '" ry="' + m * .07 + '"/><ellipse cx="' + W * .68 + '" cy="' + H * .7 + '" rx="' + m * .09 + '" ry="' + m * .06 + '"/><ellipse cx="' + W * .62 + '" cy="' + H * .22 + '" rx="' + m * .05 + '" ry="' + m * .04 + '"/></g>';
    if (o.olcu) s += '<g font-family="system-ui,sans-serif" font-size="' + m * .075 + '" font-weight="700" fill="#fff" text-anchor="middle" paint-order="stroke" stroke="rgba(0,0,0,.45)" stroke-width="' + m * .02 + '"><text x="' + W / 2 + '" y="' + (H - b2 * .25) + '">' + en + ' cm</text><text transform="translate(' + (b2 * .62) + ' ' + H / 2 + ') rotate(-90)">' + boy + ' cm</text></g>';
    return s + '</svg>';
  };
  B.esyaSvg = function (t, o) {
    var r = t.r, cl = (o && o.cls) || "halisvg";
    if (t.id === "koltuk") return '<svg class="' + cl + '" viewBox="0 0 200 120" role="img" aria-label="Koltuk örnek çizim"><rect x="20" y="20" width="160" height="56" rx="14" fill="' + r[0] + '"/><rect x="6" y="48" width="34" height="56" rx="12" fill="' + r[0] + '" stroke="' + r[1] + '" stroke-width="2"/><rect x="160" y="48" width="34" height="56" rx="12" fill="' + r[0] + '" stroke="' + r[1] + '" stroke-width="2"/><rect x="38" y="62" width="62" height="34" rx="8" fill="' + r[2] + '"/><rect x="100" y="62" width="62" height="34" rx="8" fill="' + r[2] + '"/><path d="M30 104v10M170 104v10" stroke="' + r[0] + '" stroke-width="6" stroke-linecap="round"/></svg>';
    return '<svg class="' + cl + '" viewBox="0 0 200 150" role="img" aria-label="Yorgan örnek çizim"><rect x="14" y="10" width="172" height="130" rx="16" fill="' + r[1] + '" stroke="' + r[0] + '" stroke-width="4"/><path d="M14 53h172M14 97h172M71 10v130M129 10v130" stroke="' + r[0] + '" stroke-width="2" stroke-dasharray="5 6"/><circle cx="71" cy="53" r="4" fill="' + r[2] + '"/><circle cx="129" cy="53" r="4" fill="' + r[2] + '"/><circle cx="71" cy="97" r="4" fill="' + r[2] + '"/><circle cx="129" cy="97" r="4" fill="' + r[2] + '"/></svg>';
  };
  /* Teslim takibi: ÖRNEK kayıt; gerçek sipariş sistemi bağlanınca fiş koduyla çalışır */
  B.adimlar = [
    { ad: "Alındı", ac: "Halınız adresinizden alındı ve fişe işlendi.", ik: "M3 7h13l5 5v5h-3M3 7v10h2M8 17h7M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" },
    { ad: "Yıkanıyor", ac: "Halı tipine uygun yıkama ve durulama aşamasında.", ik: "M12 3c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10zM9 14a3 3 0 0 0 3 3" },
    { ad: "Kuruyor", ac: "Kurutma aşamasında; süre halının tipine ve havaya göre değişir.", ik: "M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
    { ad: "Teslim", ac: "Halınız paketlendi; teslim için sizinle iletişime geçilir.", ik: "M4 12l5 5L20 6" }
  ];
  B.kodOn = B.kodOn || "HL";
  B.ornekKodlar = [B.kodOn + "-2417", B.kodOn + "-2433", B.kodOn + "-2458", B.kodOn + "-2471"];
  B.takip = function (kod) { kod = String(kod || "").trim().toUpperCase(); if (!kod) return null; var i = B.ornekKodlar.indexOf(kod); return { kod: kod, adim: i > -1 ? i : B.ozet(kod) % 4, ornek: true }; };
  B.mesaj = function (o) {
    var l = B.kalemler(), t = B.toplam(l), s = "Merhaba, " + (o.ad ? o.ad + " adına " : "") + "halı yıkama için alım talebi göndermek istiyorum.";
    s += "\n" + (l.length ? l.map(B.kalemYazi).join("\n") : "(Ölçü girmedim, bilgi alabilir miyim?)");
    if (t.m2) s += "\nToplam yaklaşık " + B.m2Yaz(t.m2);
    if (l.length) s += B.fiyatli ? "\nSitedeki örnek hesap: " + B.aralik(t.min, t.max) + " (kesin fiyatı sizden öğrenmek istiyorum)" : "\nFiyat bilgisi alabilir miyim?";
    if (o.gun) s += "\nAlım için uygun gün: " + o.gun + (o.dilim ? ", " + o.dilim.toLowerCase() : "");
    if (o.adres) s += "\nAdres: " + o.adres;
    if (o.not) s += "\nNot: " + o.not;
    return s;
  };
})();

/* Halı ek özellikleri: leke rehberi, ek hizmet sepeti, yıkama sonrası bakım, sadakat kartı, mahalle servis günü. Tümü ÖRNEK / genel bilgi. */
(function () {
  "use strict";
  var B = window.ISL;
  var LEKE = [
    { id: "kahve", ad: "Kahve / çay", yap: ["Fazla sıvıyı beyaz bir bezle bastırarak alın, ovmayın", "Lekenin yerini ve ne zaman olduğunu not edin"], yapma: ["Sıcak su dökmeyin", "Çamaşır suyu kullanmayın"] },
    { id: "sarap", ad: "Şarap / meyve suyu", yap: ["Kenardan ortaya doğru bastırarak kurulayın", "Halıyı yıkamaya verirken leke türünü söyleyin"], yapma: ["Tuz ya da toz dökmeyin", "Fırçayla ovalamayın"] },
    { id: "yag", ad: "Yağ / yemek", yap: ["Katı kısmı kaşıkla toplayın", "Kâğıt havluyla fazlasını alın"], yapma: ["Deterjanı doğrudan dökmeyin", "Ütü ya da fön kullanmayın"] },
    { id: "evcil", ad: "Evcil hayvan", yap: ["Islaklığı hemen kurulayın", "Koku kalırsa yıkamada belirtin"], yapma: ["Amonyaklı ürün kullanmayın", "Islak hâlde rulo yapmayın"] },
    { id: "murekkep", ad: "Mürekkep / boya", yap: ["Bulaşmasın diye çevresini kuru tutun", "Ürünün adını not edin"], yapma: ["Islak bezle silmeyin", "Aseton denemeyin"] },
    { id: "camur", ad: "Çamur", yap: ["Tamamen kurumasını bekleyin", "Kuruyunca süpürün"], yapma: ["Islakken silmeyin", "Sıcak suyla ovmayın"] },
    { id: "mum", ad: "Mum / sakız", yap: ["Buz koyup sertleşmesini bekleyin", "Sertleşince kazıyarak kaldırın"], yapma: ["Çekiştirmeyin", "Kesici aletle kesmeyin"] }
  ];
  var BAKIM = [["İlk gün", "Halı tamamen kuru teslim edilse de ilk gün üzerine ağır mobilya koymamak iyi olur."], ["Güneş", "Doğrudan ve uzun süre güneş alan yerde renk açılabilir; ara ara yönünü çevirin."], ["Süpürme", "Haftada bir, tüy yönünde süpürün; saçaklara süpürge ucuyla dokunmayın."], ["Nem", "Islak zeminde ya da nemli odada uzun süre bırakmayın; altını havalandırın."], ["Dökülmeler", "Dökülen sıvıyı ovmadan, bastırarak alın; leke rehberine bakın."], ["Saklama", "Kaldıracaksanız temiz ve kuru olarak, rulo hâlinde, nefes alan bir örtüyle saklayın."]];
  var MAH = { "Kepez": ["Yeni Doğan", "Özgürlük", "Ulus", "Kültür", "Atatürk", "Varsak", "Göksu", "Teomanpaşa", "Fabrikalar", "Duraliler"], "Muratpaşa": ["Sinan", "Şirinyalı", "Altındağ", "Elmalı", "Fener", "Güzeloba", "Lara", "Kızıltoprak", "Meltem", "Yeşilbahçe"] };
  var GUN = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var ky0 = B.kalemYaz; B.kalemYaz = function (l) { ky0(l); };
  function ev() { try { window.dispatchEvent(new Event("dj-kalem")); } catch (e) {} }
  B.ek = [
    { id: "leke", et: "Leke rehberi · genel bilgi", ad: "Leke mi var? İlk 10 dakika", ac: "Leke türünü seçin; ne yapıp ne yapmayacağınızı görün. İsterseniz leke bilgisi mesajınıza eklenir.",
      html: function () { return '<div class="ek-ch">' + LEKE.map(function (l) { return '<button data-l="' + l.id + '">' + l.ad + '</button>'; }).join("") + '</div><div class="ek-kutu" data-o>Bir leke türü seçin.</div><button class="ek-b i" data-ekle hidden>Leke bilgisini mesaja ekle</button>'; },
      bagla: function (a) { var s = null; a.querySelector(".ek-ch").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; s = LEKE.filter(function (l) { return l.id === b.dataset.l; })[0]; a.querySelectorAll(".ek-ch button").forEach(function (x) { x.classList.toggle("a", x === b); });
        a.querySelector("[data-o]").innerHTML = "<b>Yapın:</b><ul>" + s.yap.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul><b>Yapmayın:</b><ul>" + s.yapma.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; a.querySelector("[data-ekle]").hidden = false; B.iz("ek:leke"); };
        a.querySelector("[data-ekle]").onclick = function () { B.ekNot("leke", "Halıda leke var: " + s.ad.toLowerCase()); B.toast("Leke bilgisi mesaja eklendi"); }; } },
    { id: "ekhiz", et: "Ek hizmet sepeti", ad: "Koltuk, yorgan, perde de gelsin", ac: "Tek dokunuşla yıkama listenize ekleyin; liste hesap bölümünde ve mesajda görünür.",
      html: function () { var t = B.tipler.map(function (x) { return x.id; }); var l = [["koltuk", 7, "Koltuk takımı (3+3+1, 7 oturak)"], ["koltuk", 1, "Tekli koltuk / berjer"], ["yorgan", 1, "Yorgan / battaniye"], ["perde", 1, "Perde (kanat)"]].filter(function (x) { return t.indexOf(x[0]) > -1; });
        return (B.fotolar && B.fotolar[3] ? '<div class="ek-foto" style="min-height:0;aspect-ratio:16/8"><img src="../img/' + B.fotolar[3].dosya + '" alt="Koltuk ve halı, örnek görsel" loading="lazy" style="height:100%;object-fit:cover"></div>' : "") + l.map(function (x) { return '<div class="ek-sat"><span>' + x[2] + '</span><button class="ek-b i" style="flex:0 0 auto" data-t="' + x[0] + '" data-n="' + x[1] + '">+ Ekle</button></div>'; }).join(""); },
      bagla: function (a) { a.onclick = function (e) { var b = e.target.closest("[data-t]"); if (!b) return; B.ekle({ t: b.dataset.t, en: 0, boy: 0, n: +b.dataset.n }); ev(); B.toast("Listeye eklendi"); B.iz("ek:ekhiz"); }; } },
    { id: "bakim", et: "Yıkama sonrası", ad: "Halınız uzun yaşasın", ac: "Teslimden sonra işe yarayan kısa ipuçları. Genel bilgidir.",
      html: function () { return BAKIM.map(function (x, i) { return '<details' + (i ? "" : " open") + ' class="ek-kutu"><summary style="cursor:pointer;font-weight:600">' + x[0] + '</summary><p style="margin-top:6px">' + x[1] + '</p></details>'; }).join(""); }, bagla: function () {} },
    { id: "sadakat", et: "Sadakat kartı · örnek kurgu", ad: "10. yıkamada sürpriz", ac: "Her yıkamada bir damga. Kampanyanın içeriğini işletme belirler; bu kart örnektir.",
      html: function () { return '<div class="damga"></div><div class="ek-sat"><b class="dsay" style="flex:0"></b><button class="ek-b" data-dg="ekle">Damga ekle (demo)</button><button class="ek-b i" data-dg="sifir">Sıfırla</button></div>'; },
      bagla: function (a) { B.damgaCiz(a, "damga", 10, "Kart doldu! 10. yıkama sürprizi işletmeden (örnek)"); } },
    { id: "servis", et: "Servis günü · örnek takvim", ad: "Mahallenize hangi gün?", ac: "Mahallenizi seçin; örnek servis gününü görün. Gerçek güzergâh işletmeyle netleşir.",
      html: function () { return '<select data-m aria-label="Mahalle"><option value="">Mahalle seçin</option>' + Object.keys(MAH).map(function (i) { return '<optgroup label="' + i + '">' + MAH[i].map(function (m) { return '<option>' + m + ' (' + i + ')</option>'; }).join("") + '</optgroup>'; }).join("") + '</select><div class="ek-tak">' + GUN.concat(["Pazar"]).map(function (g) { return '<div><b>' + g.slice(0, 3) + '</b>—</div>'; }).join("") + '</div><button class="ek-b i" data-ekle hidden>Bu günü mesaja ekle</button>'; },
      bagla: function (a) { var s = a.querySelector("[data-m]"), gun = null; s.onchange = function () { var v = s.value, k = a.querySelectorAll(".ek-tak div"); if (!v) return; var i = B.ozet(v) % 6, j = (i + 3) % 6; gun = [GUN[i], GUN[j]];
        k.forEach(function (d, x) { var on = x === i || x === j; d.classList.toggle("on", on); d.innerHTML = "<b>" + (GUN.concat(["Pazar"]))[x].slice(0, 3) + "</b>" + (on ? "servis" : "—"); }); a.querySelector("[data-ekle]").hidden = false; B.iz("ek:servis"); };
        a.querySelector("[data-ekle]").onclick = function () { B.ekNot("servis", "Mahallem: " + s.value + "; sitede örnek servis günü " + gun.join(" / ") + " görünüyor, uygun mu?"); B.toast("Servis günü mesaja eklendi"); }; } }
  ];
})();
