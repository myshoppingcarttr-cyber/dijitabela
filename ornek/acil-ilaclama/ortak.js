/* Acil İlaçlama · ilaçlama sayfası · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: RAPORLAR/KEREM-ADAY-1013.md (local.gen.tr; Atatürk Mah. 2643. Sk. No:20, Kepez / Antalya; 0542 376 30 20).
   Fiyatlar, süreler, listeler ve kayıtlar ÖRNEKTİR. Hiçbir form gönderim yapmaz. Dijitabela taslağı. */
window.ISL={"ad":"Acil İlaçlama","slug":"acil-ilaclama","adres":"Atatürk Mah. 2643. Sk. No:20, Kepez / Antalya","tel":"0542 376 30 20","telH":"+905423763020","wa":"905423763020","kaynak":"https://local.gen.tr/antalya/acil-ilaclama/","haritaSorgu":"Acil İlaçlama Atatürk Mah. 2643. Sk. No:20, Kepez / Antalya","carpan":1,"acil":true,"kisa":"Acil","fiyatli":false,"fotolar":[{"dosya":"f1.webp","yazar":"Senior Airman Austin Harvill","lisans":"Public domain"},{"dosya":"f2.webp","yazar":"U.S. Air Force photo by Senior Airman Elizabeth Baker","lisans":"Public domain"},{"dosya":"f3.webp","yazar":"Shixart1985","lisans":"CC BY 2.0"}]};
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

/* İlaçlama motoru: zararlı seçimi, mekân/m², randevu, önce/sonra hazırlık listesi, hazır mesaj. Fiyatlar ÖRNEK; belirtiler ve listeler genel bilgidir, firmanın talimatı esastır. */
(function () {
  "use strict";
  var B = window.ISL, c = B.carpan || 1;
  B.zararlilar = [
    { id: "hamam", ad: "Hamam böceği", b: 1200, m: 8, ik: "M12 6c3 0 5 3 5 7s-2 7-5 7-5-3-5-7 2-7 5-7zM12 6V4M10.5 4.5L7.5 1.5M13.5 4.5l3-3M7.3 10L3 8M7 14H3M7.6 18L4 20.5M16.7 10L21 8M17 14h4M16.4 18l3.6 2.5M12 9v10", be: ["Gece mutfakta ya da banyoda hızla kaçan böcek", "Dolap köşelerinde küçük siyah lekeler", "Lavabo ve gider çevresinde görülme"], on: ["Mutfak ve banyo dolaplarını boşaltın; lavabo altlarını açık bırakın"] },
    { id: "karinca", ad: "Karınca", b: 1000, m: 6, ik: "M12 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 9a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 12 9zM12 14c-1.8 0-3 1.6-3 3.5S10.2 21 12 21s3-1.6 3-3.5-1.2-3.5-3-3.5zM10.8 4L8.5 1M13.2 4l2.3-3M10.4 10.4L6 8.5M13.6 10.4L18 8.5M10.4 12L6 14.5M13.6 12L18 14.5M9.8 16L6 20M14.2 16L18 20", be: ["Tezgâh ya da zeminde sıra hâlinde yürüyen karıncalar", "Şeker, ekmek gibi gıdaların çevresinde toplanma", "Duvar diplerinde ince toprak birikintisi"], on: ["Karıncaların izlediği yolu ekibe göstermek için not alın"] },
    { id: "fare", ad: "Fare / sıçan", b: 1500, m: 6, ik: "M3 15c0-4 4-7 9-7 4 0 7 2 8 5l2 1-2 1c-1 2-4 3-8 3H6M7.5 9.2a2.2 2.2 0 1 1 3.2-1.4M17 12.5h.01M6 18c-3 0-4 2-3 4", be: ["Kemirilmiş ambalaj, kablo ya da ahşap", "Köşelerde küçük dışkı taneleri", "Gece tavan ya da duvar içinden tıkırtı"], on: ["Görülen dışkı ve kemirme izlerinin yerini not edin"], so: ["Tuzak ve yem istasyonlarının yerini değiştirmeyin"] },
    { id: "tahta", ad: "Tahta kurusu", b: 1800, m: 14, ik: "M12 7.5c4 0 7 3 7 6.5s-3 6-7 6-7-2.5-7-6 3-6.5 7-6.5zM10 4.5h4v3h-4zM5.3 11.5L2 10M18.7 11.5L22 10M5 15H2M19 15h3M6.3 18.6L3 21M17.7 18.6L21 21M7.5 12.5h9M7 15.5h10", be: ["Sabah uyanınca sıra hâlinde kaşıntılı izler", "Çarşaf ya da yatak dikişlerinde küçük kan lekeleri", "Yatak kenarı ve baza aralığında küçük kahverengi böcek"], on: ["Çarşaf, nevresim ve perdeleri ekibin önerisine göre yıkayın; yatak çevresini boşaltın"], so: ["Ekibin tekrar kontrol önerisine uyun"] },
    { id: "pire", ad: "Pire", b: 1300, m: 9, ik: "M6 14c0-5 4-8 9-7 3 1 4 4 3 7-1 4-5 5-9 4M15 7l2-3M18 10l3-1M9 18l-2 4M12 18.5l1 3.5M16 16l3 4", be: ["Bilek ve bacakta küçük kaşıntılı noktalar", "Evcil hayvanda sık kaşınma", "Halı ya da koltukta sıçrayan çok küçük böcek"], on: ["Halı ve koltukları süpürün; evcil hayvan yataklarını ayırın"] },
    { id: "sivri", ad: "Sivrisinek / sinek", b: 1100, m: 6, ik: "M12 8v12M12 8a1.5 1.5 0 1 0 0-3M12 5l-1-3M12 10C9 6 5 5 3 7c2 2 6 3 9 3zM12 10c3-4 7-5 9-3-2 2-6 3-9 3zM12 14l-5 4M12 14l5 4M12 17l-4 5M12 17l4 5", be: ["Akşam ve gece vızıltı, ısırık", "Bahçe, balkon ya da bodrumda su birikintisi", "Çöp ve gider çevresinde yoğun sinek"], on: ["Su biriken kap, saksı altlığı gibi yerleri boşaltın"] },
    { id: "akrep", ad: "Akrep / örümcek", b: 1400, m: 7, ik: "M9 13c0-2.8 1.3-5 3-5s3 2.2 3 5-1.3 5-3 5-3-2.2-3-5zM12 8c0-3 2-5 5-5s4 3 2 5M19 8l1-2M9.4 11L5 8 3 9M14.6 11L19 8l2 1M9 14l-4 1M9.3 16l-4 3M15 14l4 1M14.7 16l4 3M12 18v3", be: ["Bahçe, taş duvar ya da bodrumda görülme", "Kapı altı ve pencere kenarlarından giriş", "Köşelerde ağ ya da kabuk"], on: ["Bahçe ve balkondaki taş, odun yığınlarını ekibe gösterin"] },
    { id: "guve", ad: "Güve", b: 1100, m: 7, ik: "M12 6v13M12 8C8 3 3 4 3 9c0 3 4 5 9 4M12 8c4-5 9-4 9 1 0 3-4 5-9 4M12 13c-3 1-6 3-5 6 2 1 4-1 5-3M12 13c3 1 6 3 5 6-2 1-4-1-5-3M12 6l-2-3M12 6l2-3", be: ["Yün giysi ve halıda küçük delikler", "Dolapta uçuşan küçük kelebek", "Kiler ürünlerinde ağ ya da kurtçuk"], on: ["Dolaplardaki yün ve kışlık giysileri ayırın"] }
  ];
  B.mekanlar = [{ id: "daire", ad: "Daire", k: 1, m2: 100 }, { id: "mustakil", ad: "Müstakil ev", k: 1.15, m2: 160 }, { id: "isyeri", ad: "İş yeri / ofis", k: 1.2, m2: 120 }, { id: "restoran", ad: "Restoran / kafe", k: 1.5, m2: 150 }, { id: "depo", ad: "Depo / bina ortak alanı", k: .85, m2: 300 }];
  B.z = function (id) { return B.zararlilar.filter(function (x) { return x.id === id; })[0]; };
  B.mk = function (id) { return B.mekanlar.filter(function (x) { return x.id === id; })[0] || B.mekanlar[0]; };
  B.ikon = function (id, s) { var z = B.z(id); return '<svg viewBox="0 0 24 24" width="' + (s || 24) + '" height="' + (s || 24) + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (z ? z.ik : "") + '"/></svg>'; };
  /* ÖRNEK fiyat aralığı */
  B.fiyat = function (ids, mek, m2) {
    if (!ids.length) return null; var l = ids.map(B.z).sort(function (a, b) { return b.b - a.b; }), f = 0, br = 0;
    l.forEach(function (z, i) { f += z.b * (i ? .4 : 1); br = Math.max(br, z.m); });
    f = (f + m2 * br) * B.mk(mek).k * c; return { min: f * .85, max: f * 1.2 };
  };
  B.odalar = [
    { id: "salon", ad: "Salon", x: 0, y: 0, w: 280, h: 230 }, { id: "mutfak", ad: "Mutfak", x: 280, y: 0, w: 180, h: 150 }, { id: "balkon", ad: "Balkon", x: 460, y: 0, w: 140, h: 150 },
    { id: "koridor", ad: "Koridor", x: 280, y: 150, w: 320, h: 80 }, { id: "yatak", ad: "Yatak odası", x: 0, y: 230, w: 220, h: 170 }, { id: "cocuk", ad: "Çocuk odası", x: 220, y: 230, w: 180, h: 170 }, { id: "banyo", ad: "Banyo / WC", x: 400, y: 230, w: 200, h: 170 }
  ];
  B.oda = function (id) { return B.odalar.filter(function (o) { return o.id === id; })[0]; };
  B.onceGenel = ["Gıdaları ve açık mutfak eşyalarını kapalı dolaplara ya da buzdolabına kaldırın", "Tezgâh, masa ve zemindeki eşyaları toplayın; ekibin ulaşacağı köşeleri açın", "Evcil hayvan, akvaryum ya da bebek varsa ekibe önceden söyleyin", "Çocuk oyuncaklarını ve diş fırçası gibi kişisel eşyaları kapalı yere koyun", "Uygulama sırasında mekânda kimin kalabileceğini ekibe sorun"];
  B.sonraGenel = ["Ekibin söylediği süre dolmadan mekâna girmeyin; sonra iyice havalandırın", "Uygulama yapılan köşe ve süpürgelikleri ekibin söylediği süre boyunca silmeyin", "Gıdayla temas eden yüzeyleri kullanmadan önce silin", "Zararlı görülmeye devam ederse tarih ve yeri not edip firmaya bildirin"];
  B.liste = function (ids, tur) { var l = (tur === "once" ? B.onceGenel : B.sonraGenel).slice(); ids.forEach(function (id) { var z = B.z(id); (tur === "once" ? z.on : z.so || []).forEach(function (x) { if (l.indexOf(x) < 0) l.push(x); }); }); return l; };
  B.isaret = function () { return B.oku("isaret", {}); };
  B.isaretle = function (k) { var s = B.isaret(); s[k] = !s[k]; B.yaz("isaret", s); };
  B.mesaj = function (o) {
    var s = "Merhaba, " + (o.ad ? o.ad + " adına " : "") + "ilaçlama için " + (o.acil ? "EN KISA SÜREDE " : "") + "randevu almak istiyorum.";
    s += "\nZararlı: " + (o.ids.length ? o.ids.map(function (i) { return B.z(i).ad.toLowerCase(); }).join(", ") : "(emin değilim, bilgi almak istiyorum)");
    if (o.odalar && o.odalar.length) s += "\nGörüldüğü yerler: " + o.odalar.join("; ");
    s += "\nMekân: " + B.mk(o.mek).ad + ", yaklaşık " + o.m2 + " m²";
    var f = B.fiyatli && B.fiyat(o.ids, o.mek, o.m2); if (f) s += "\nSitedeki örnek hesap: " + B.aralik(f.min, f.max) + " (kesin fiyatı sizden öğrenmek istiyorum)";
    if (!B.fiyatli) s += "\nFiyat bilgisi alabilir miyim?";
    if (o.acil) s += "\nDurum acil: mümkünse en kısa sürede.";
    else if (o.gun) s += "\nUygun gün: " + o.gun + (o.dilim ? ", " + o.dilim.toLowerCase() : "");
    if (o.adres) s += "\nAdres: " + o.adres;
    if (o.not) s += "\nNot: " + o.not;
    return s;
  };
})();

/* İlaçlama ek özellikleri: periyodik bakım takvimi (.ics), işletme denetim/rapor görünümü, bebek/evcil hayvan güvenlik soruları, "tekrar görülürse" bildirimi. Tümü ÖRNEK / genel bilgi. */
(function () {
  "use strict";
  var B = window.ISL, AY = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  function tarih(d) { return d.getDate() + " " + AY[d.getMonth()] + " " + d.getFullYear(); }
  function ics(l) { var p = function (n) { return String(n).padStart(2, "0"); }, s = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Dijitabela//Ornek//TR\r\n";
    l.forEach(function (d, i) { var g = d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()); s += "BEGIN:VEVENT\r\nUID:" + B.slug + "-" + g + "-" + i + "@dijitabela\r\nDTSTAMP:" + g + "T090000\r\nDTSTART;VALUE=DATE:" + g + "\r\nSUMMARY:İlaçlama bakım hatırlatması (" + B.ad + ")\r\nDESCRIPTION:Örnek hatırlatma. Randevu için: " + B.tel + "\r\nEND:VEVENT\r\n"; });
    return s + "END:VCALENDAR\r\n"; }
  var GUV = [["bebek", "Evde bebek ya da küçük çocuk var"], ["hamile", "Evde hamile biri var"], ["kedi", "Kedi ya da köpek var"], ["kus", "Kuş, balık (akvaryum) ya da sürüngen var"], ["astim", "Astım ya da alerjisi olan biri var"], ["bahce", "Bahçede sebze/meyve yetiştiriyorum"]];
  var SOR = { bebek: "Uygulamadan sonra bebek ve çocuk ne zaman eve dönebilir?", hamile: "Hamile biri için uygulama sırasında ve sonrasında nelere dikkat edilmeli?", kedi: "Kedi/köpek uygulama sırasında nerede durmalı, mamaları ve kapları ne yapılmalı?", kus: "Akvaryum ve kuş kafesi kapatılmalı mı, oda dışına mı alınmalı?", astim: "Astım ya da alerjisi olan biri için hangi önlemler alınmalı?", bahce: "Bahçedeki sebze/meyveye uygulama yapılacak mı, hasat için ne kadar beklenmeli?" };
  B.ek = [
    { id: "periyot", et: "Periyodik bakım · hatırlatma", ad: "Bir kere değil, düzenli koruma", ac: "Bakım aralığını seçin; sonraki tarihleri görün ve telefonunuzun takvimine ekleyin. Aralığı firmanın önerisine göre belirleyin.",
      html: function () { var b = new Date(); b.setDate(b.getDate() + 7); var v = b.getFullYear() + "-" + String(b.getMonth() + 1).padStart(2, "0") + "-" + String(b.getDate()).padStart(2, "0");
        return '<div class="ek-ch" data-p>' + [[1, "Ayda bir"], [2, "2 ayda bir"], [3, "3 ayda bir"], [6, "6 ayda bir"]].map(function (x) { return '<button data-v="' + x[0] + '"' + (x[0] === 3 ? ' class="a"' : "") + '>' + x[1] + '</button>'; }).join("") + '</div><label style="flex-direction:column;gap:4px"><span class="ek-et">İlk uygulama</span><input type="date" value="' + v + '"></label><div class="ek-zc" data-l></div><button class="ek-b" data-ics>Takvimime ekle (.ics)</button>'; },
      bagla: function (a) { var ay = 3, L = []; function ciz() { var d0 = new Date(a.querySelector("input").value || Date.now()); L = [0, 1, 2, 3].map(function (i) { var d = new Date(d0); d.setMonth(d.getMonth() + ay * i); return d; });
        a.querySelector("[data-l]").innerHTML = L.map(function (d, i) { return "<div><b>" + tarih(d) + "</b><br><small>" + (i ? i + ". bakım (hatırlatma)" : "İlk uygulama") + "</small></div>"; }).join(""); a.querySelectorAll("[data-p] button").forEach(function (b) { b.classList.toggle("a", +b.dataset.v === ay); }); B.ekNot("periyot", "Periyodik bakım istiyorum: " + (ay === 1 ? "ayda bir" : ay + " ayda bir") + ", ilk uygulama " + tarih(L[0]) + " civarı"); }
        a.querySelector("[data-p]").onclick = function (e) { var b = e.target.closest("button"); if (b) { ay = +b.dataset.v; ciz(); B.iz("ek:periyot"); } }; a.querySelector("input").onchange = ciz;
        a.querySelector("[data-ics]").onclick = function () { var u = URL.createObjectURL(new Blob([ics(L)], { type: "text/calendar" })), x = document.createElement("a"); x.href = u; x.download = "ilaclama-hatirlatma.ics"; document.body.appendChild(x); x.click(); x.remove(); B.toast("Takvim dosyası indirildi"); B.iz("ek:ics"); }; ciz(); } },
    { id: "rapor", et: "İşletmeler için · örnek şablon", ad: "Restoran ve kafe denetim görünümü", ac: "Denetimde sorulan uygulama kaydının nasıl görünebileceğine dair örnek şablon. Gerçek rapor ve belge işletmeden alınır.",
      html: function () { var b = new Date(); return '<div class="ek-rapor"><b>' + B.ad + '</b> · uygulama kaydı <span class="ek-rz">ÖRNEK ŞABLON</span><table><tr><td>Tarih</td><td>' + tarih(b) + '</td></tr><tr><td>Mekân</td><td data-mk>Restoran / kafe</td></tr><tr><td>Hedef zararlı</td><td data-z>—</td></tr><tr><td>Uygulama alanları</td><td>Mutfak, depo, çöp alanı</td></tr><tr><td>Kontrol noktaları</td><td>Giriş, gider, dolap altı</td></tr><tr><td>Sonraki kontrol</td><td data-s>—</td></tr><tr><td>Uygulayan / imza</td><td>……………</td></tr></table></div><div class="ek-sat"><button class="ek-b i" data-yaz>Şablonu yazdır</button><button class="ek-b" data-ekle>Rapor iste</button></div>'; },
      bagla: function (a) { function g() { var s = B.oku("secim", []); a.querySelector("[data-z]").textContent = s.length ? s.map(function (i) { return B.z(i).ad; }).join(", ") : "Seçilmedi"; var d = new Date(); d.setMonth(d.getMonth() + 1); a.querySelector("[data-s]").textContent = tarih(d) + " (örnek)"; } g(); a.addEventListener("mouseenter", g); a.addEventListener("touchstart", g, { passive: true });
        a.querySelector("[data-yaz]").onclick = function () { g(); window.print(); }; a.querySelector("[data-ekle]").onclick = function () { B.ekNot("rapor", "İşletmemiz için uygulama sonrası yazılı kayıt/rapor istiyoruz"); B.toast("Rapor talebi mesaja eklendi"); B.iz("ek:rapor"); }; } },
    { id: "guven", et: "Güvenlik soruları", ad: "Bebek, evcil hayvan, alerji?", ac: "Evinizdeki durumu işaretleyin; ekibe sormanız gereken sorular listelenir ve mesajınıza eklenir. Tıbbi tavsiye değildir.",
      html: function () { return GUV.map(function (x) { return '<label><input type="checkbox" value="' + x[0] + '"> ' + x[1] + '</label>'; }).join("") + '<div class="ek-kutu" data-o>Seçim yaptıkça ekibe sorulacaklar burada çıkar.</div>'; },
      bagla: function (a) { a.onchange = function () { var l = [].slice.call(a.querySelectorAll("input:checked")).map(function (i) { return i.value; });
        a.querySelector("[data-o]").innerHTML = l.length ? "<b>Ekibe sorun:</b><ul>" + l.map(function (k) { return "<li>" + SOR[k] + "</li>"; }).join("") + "</ul>" : "Seçim yaptıkça ekibe sorulacaklar burada çıkar.";
        B.ekNot("guven", l.length ? "Evde: " + l.map(function (k) { return GUV.filter(function (x) { return x[0] === k; })[0][1].toLowerCase(); }).join("; ") : null); B.iz("ek:guven"); }; } },
    { id: "tekrar", et: "Uygulamadan sonra", ad: "Tekrar görürseniz haber verin", ac: "Ne zaman, nerede ve ne gördüğünüzü seçin; firmaya gidecek bildirim mesajı hazırlanır.",
      html: function () { return '<input type="date" aria-label="Görüldüğü tarih"><select data-y aria-label="Yer">' + ["Mutfak", "Banyo", "Salon", "Yatak odası", "Balkon / bahçe", "Depo"].map(function (x) { return "<option>" + x + "</option>"; }).join("") + '</select><select data-z aria-label="Zararlı">' + B.zararlilar.map(function (z) { return '<option value="' + z.id + '">' + z.ad + '</option>'; }).join("") + '</select><button class="ek-b" data-h>Bildirimi hazırla</button><div data-mk></div>'; },
      bagla: function (a) { a.querySelector("[data-h]").onclick = function () { var t = a.querySelector("input").value, m = "Merhaba, sizden ilaçlama hizmeti almıştım. Uygulamadan sonra tekrar " + B.z(a.querySelector("[data-z]").value).ad.toLowerCase() + " gördüm.\nYer: " + a.querySelector("[data-y]").value + (t ? "\nTarih: " + t.split("-").reverse().join(".") : "") + "\nKontrol için ne zaman gelebilirsiniz?"; B.kutu(a.querySelector("[data-mk]"), m, 1); B.iz("ek:tekrar"); }; } }
  ];
})();
