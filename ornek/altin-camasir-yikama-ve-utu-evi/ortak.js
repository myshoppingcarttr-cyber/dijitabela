/* Altın Çamaşır Yıkama ve Ütü Evi · kuru temizleme sayfası · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: RAPORLAR/KEREM-ADAY-1013.md (local.gen.tr; Altındağ Mah. 151. Sk. Şanlılar Apt. D:26/B, Muratpaşa / Antalya; 0541 575 90 96).
   Fiyatlar, süreler, listeler ve kayıtlar ÖRNEKTİR. Hiçbir form gönderim yapmaz. Dijitabela taslağı. */
window.ISL={"ad":"Altın Çamaşır Yıkama ve Ütü Evi","slug":"altin-camasir-yikama-ve-utu-evi","adres":"Altındağ Mah. 151. Sk. Şanlılar Apt. D:26/B, Muratpaşa / Antalya","tel":"0541 575 90 96","telH":"+905415759096","wa":"905415759096","kaynak":"https://local.gen.tr/antalya/altin-camasir-yikama-ve-utu-evi/","haritaSorgu":"Altın Çamaşır Yıkama ve Ütü Evi Altındağ Mah. 151. Sk. Şanlılar Apt. D:26/B, Muratpaşa / Antalya","carpan":0.92,"kodOn":"ALT","tur":"camasir","kisa":"Altın","fiyatli":false,"fotolar":[{"dosya":"f1.webp","yazar":"Baron Maddock","lisans":"CC BY 4.0"},{"dosya":"f2.webp","yazar":"Kotivalo","lisans":"CC BY-SA 4.0"},{"dosya":"f3.webp","yazar":"Andrew Roberts","lisans":"CC BY 3.0"}]};
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

/* Kuru temizleme / çamaşır motoru: parça sepeti, teslim alma-bırakma planı, hazır mesaj, "siparişim hazır mı" sorgusu. Fiyatlar, süreler ve fiş kayıtları ÖRNEKTİR. */
(function () {
  "use strict";
  var B = window.ISL, c = B.carpan || 1, tur = B.tur || "kuru";
  var IK = {
    gomlek: "M8 3l4 2 4-2 4 3-2 4-2-1v12H8V9L6 10 4 6zM12 5v16M10.5 8h.01M10.5 12h.01",
    tisort: "M8 3c1 1.5 2.4 2 4 2s3-.5 4-2l5 3-2 4-3-1v12H8V9l-3 1-2-4z",
    kazak: "M8 3h8l5 4-2 5-3-2v11H8V10l-3 2-2-5zM9 3c0 2 1.3 3 3 3s3-1 3-3M8 18h8",
    pantolon: "M7 3h10l1 18h-4l-2-11-2 11H6zM7 6h10",
    etek: "M8 4h8l3 16H5zM8 7h8",
    takim: "M7 3l5 6 5-6 3 2-1 16H5L4 5zM12 9v12M9.5 13h.01M9.5 16h.01M7 3l2 6M17 3l-2 6",
    ceket: "M8 3l4 3 4-3 4 3-1 15h-6V9M8 3L4 6l1 15h6V9M12 6v3",
    elbise: "M9 3h6l-1 5 5 13H5l5-13zM10 3l2 3 2-3",
    abiye: "M10 2h4l-.5 6 3.5 14H7l3.5-14zM9 12c2 1 4 1 6 0",
    mont: "M8 3h8l4 4v14h-5v-3H9v3H4V7zM4 10h16M4 14h16M12 3v15",
    kaban: "M8 3l4 3 4-3 4 4v14H4V7zM12 6v15M9.5 11h.01M9.5 15h.01M14.5 11h.01M14.5 15h.01",
    trenc: "M8 3l4 3 4-3 4 4-1 14H5L4 7zM12 6v15M5 13h14",
    yorgan: "M3 5h18v14H3zM3 10h18M3 15h18M9 5v14M15 5v14",
    battaniye: "M4 6c3-2 13-2 16 0v12c-3 2-13 2-16 0zM4 10c3 2 13 2 16 0",
    perde: "M3 3h18M5 3v16c2 1 3 1 4 0V3M15 3v16c1 1 2 1 4 0V3M9 12h1M14 12h1",
    nevresim: "M3 18V8h18v10M3 13h18M6 8V6h5v2M13 8V6h5v2M3 18v2M21 18v2",
    sepetkg: "M4 9h16l-2 11H6zM8 9l3-5M16 9l-3-5M9 13v4M12 13v4M15 13v4"
  };
  B.ikon = function (k, b) { return '<svg viewBox="0 0 24 24" width="' + (b || 24) + '" height="' + (b || 24) + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (IK[k] || IK.gomlek) + '"/></svg>'; };
  B.kat = [{ id: "ust", ad: "Gömlek ve üst" }, { id: "takim", ad: "Takım ve alt" }, { id: "elbise", ad: "Elbise" }, { id: "dis", ad: "Dış giyim" }, { id: "ev", ad: "Ev tekstili" }];
  if (tur === "camasir") B.kat.unshift({ id: "kg", ad: "Kilo ile çamaşır" }); else if (tur === "karma") B.kat.push({ id: "kg", ad: "Kilo ile çamaşır" });
  /* ÖRNEK fiyat (kuru temizleme bazında) ve örnek işlem günü */
  var P = [
    { id: "gomlek", kat: "ust", ad: "Gömlek", f: 120, g: 1, is: ["kuru", "yik", "utu"] },
    { id: "tisort", kat: "ust", ad: "Bluz / tişört", f: 100, g: 1, is: ["kuru", "yik", "utu"] },
    { id: "kazak", kat: "ust", ad: "Kazak / hırka", f: 180, g: 2, is: ["kuru", "yik"] },
    { id: "pantolon", kat: "takim", ad: "Pantolon", f: 150, g: 1, is: ["kuru", "yik", "utu"] },
    { id: "etek", kat: "takim", ad: "Etek", f: 140, g: 1, is: ["kuru", "yik", "utu"] },
    { id: "takim", kat: "takim", ad: "Takım elbise", f: 380, g: 2, is: ["kuru", "utu"] },
    { id: "ceket", kat: "takim", ad: "Ceket / blazer", f: 230, g: 2, is: ["kuru", "utu"] },
    { id: "elbise", kat: "elbise", ad: "Günlük elbise", f: 250, g: 2, is: ["kuru", "yik", "utu"] },
    { id: "abiye", kat: "elbise", ad: "Abiye / gece elbisesi", f: 480, g: 3, is: ["kuru", "utu"] },
    { id: "mont", kat: "dis", ad: "Mont / şişme mont", f: 360, g: 3, is: ["kuru", "yik"] },
    { id: "kaban", kat: "dis", ad: "Kaban / palto", f: 420, g: 3, is: ["kuru"] },
    { id: "trenc", kat: "dis", ad: "Trençkot", f: 380, g: 3, is: ["kuru", "utu"] },
    { id: "yorgan", kat: "ev", ad: "Yorgan", f: 450, g: 3, is: ["kuru", "yik"] },
    { id: "battaniye", kat: "ev", ad: "Battaniye", f: 320, g: 2, is: ["kuru", "yik"] },
    { id: "perde", kat: "ev", ad: "Perde (kanat)", f: 190, g: 2, is: ["kuru", "yik", "utu"] },
    { id: "nevresim", kat: "ev", ad: "Nevresim takımı", f: 200, g: 1, is: ["yik", "utu"] }
  ];
  if (tur !== "kuru") P.unshift({ id: "sepetkg", kat: "kg", ad: "Karışık çamaşır (kg)", f: 110, g: 1, is: ["yik"], kg: true }, { id: "beyaz", ik: "sepetkg", kat: "kg", ad: "Beyaz çamaşır (kg)", f: 120, g: 1, is: ["yik"], kg: true });
  B.parcalar = P.map(function (p) { var x = {}; for (var k in p) x[k] = p[k]; x.f = Math.round(p.f * c / 5) * 5; return x; });
  B.islemler = { kuru: { ad: "Kuru temizleme", k: 1 }, yik: { ad: "Yıkama + ütü", k: .8 }, utu: { ad: "Yalnız ütü", k: .5 } };
  B.vars = tur === "camasir" ? "yik" : "kuru";
  B.bul = function (id) { return B.parcalar.filter(function (p) { return p.id === id; })[0]; };
  B.fiyat = function (id, is) { var p = B.bul(id); return Math.round(p.f * (B.islemler[is] || B.islemler.kuru).k / 5) * 5; };
  B.isFor = function (kat, is) { var l = B.parcalar.filter(function (p) { return kat === "hepsi" || p.kat === kat; }); return l.some(function (p) { return p.is.indexOf(is) > -1; }) ? is : l[0].is[0]; };
  B.uygun = function (id, is) { var p = B.bul(id); return p.is.indexOf(is) > -1 ? is : p.is[0]; };
  B.sepet = function () { return B.oku("sepet", {}); };
  B.adet = function (id, is) { return B.sepet()[id + "|" + is] || 0; };
  B.degis = function (id, is, d) { var s = B.sepet(), k = id + "|" + is, n = Math.max(0, Math.min(99, (s[k] || 0) + d)); if (n) s[k] = n; else delete s[k]; B.yaz("sepet", s); return n; };
  B.temizle = function () { B.yaz("sepet", {}); };
  B.liste = function () { var s = B.sepet(); return Object.keys(s).map(function (k) { var a = k.split("|"), p = B.bul(a[0]); return p ? { id: a[0], is: a[1], n: s[k], p: p, tl: B.fiyat(a[0], a[1]) * s[k] } : null; }).filter(Boolean); };
  B.toplam = function () { var l = B.liste(), r = { n: 0, tl: 0, gun: 0 }; l.forEach(function (x) { r.n += x.n; r.tl += x.tl; r.gun = Math.max(r.gun, x.is === "utu" ? 1 : x.p.g); }); return r; };
  B.satir = function (x) { return x.n + (x.p.kg ? " kg " : " × ") + x.p.ad + " (" + B.islemler[x.is].ad.toLowerCase() + ")"; };
  B.modlar = [{ id: "dukkan", ad: "Dükkâna bırakacağım" }, { id: "adres", ad: "Adresten alınsın (işletme teyit eder)" }];
  /* Siparişim hazır mı: ÖRNEK fişler */
  B.durumlar = ["Alındı", "İşlemde", "Ütü / paket", "Hazır"];
  B.kodOn = B.kodOn || "KT";
  B.ornekFisler = [B.kodOn + "-1042", B.kodOn + "-1057", B.kodOn + "-1063"];
  var ORN = [[["gomlek", 3], ["takim", 1]], [["mont", 1], ["kazak", 2], ["pantolon", 2]], [["yorgan", 1], ["perde", 4]]];
  B.sorgu = function (kod) {
    kod = String(kod || "").trim().toUpperCase(); if (!kod) return null;
    var i = B.ornekFisler.indexOf(kod), h = B.ozet(kod), set = ORN[i > -1 ? i : h % 3], bas = i > -1 ? [3, 1, 2][i] : h % 4;
    var l = set.map(function (s, j) { var p = B.bul(s[0]) || B.parcalar[0]; return { ad: p.ad, ik: p.ik || p.id, n: s[1], d: Math.max(0, Math.min(3, bas - (j ? (h + j) % 2 : 0))) }; });
    return { kod: kod, l: l, hazir: l.every(function (x) { return x.d === 3; }), ornek: true };
  };
  B.mesaj = function (o) {
    var l = B.liste(), t = B.toplam(), s = "Merhaba, " + (o.ad ? o.ad + " adına " : "") + (tur === "camasir" ? "çamaşır / ütü" : "kuru temizleme") + " siparişi vermek istiyorum.";
    s += "\n" + (l.length ? l.map(B.satir).join("\n") : "(Parça seçmedim, fiyat bilgisi alabilir miyim?)");
    if (l.length && !B.fiyatli) s += "\nFiyat bilgisi alabilir miyim?";
    if (l.length && B.fiyatli) s += "\nSitedeki örnek toplam: " + B.tl(t.tl) + " (kesin fiyatı sizden öğrenmek istiyorum)";
    if (o.mod) s += "\nTeslim şekli: " + o.mod;
    if (o.birak) s += "\nBırakma: " + o.birak + (o.dilim ? ", " + o.dilim.toLowerCase() : "");
    if (o.al) s += "\nAlmak istediğim gün: " + o.al;
    if (o.adres) s += "\nAdres: " + o.adres;
    if (o.not) s += "\nNot: " + o.not;
    return s;
  };
})();

/* Kuru temizleme ek özellikleri: gömlek paketi kurgusu, düğme notu, kapıdan alım rotası, leke fotoğrafı önizlemesi, hazır bildirimi tercihi. Tümü ÖRNEK. */
(function () {
  "use strict";
  var B = window.ISL;
  var ILCE = /Muratpaşa/.test(B.adres) ? "Muratpaşa" : "Kepez";
  var MAH = ILCE === "Kepez" ? ["Kültür", "Ulus", "Yeni Doğan", "Özgürlük", "Atatürk", "Varsak"] : ["Sinan", "Altındağ", "Elmalı", "Şirinyalı", "Fener", "Meltem"];
  var GUN = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  B.ek = [
    { id: "paket", et: "Abonelik · örnek kurgu", ad: "Haftalık gömlek paketi", ac: "Her hafta aynı gün gömlekleriniz alınsın, ütülü dönsün. Kapsamı ve ücreti işletme belirler; burada yalnız talebinizi hazırlarsınız.",
      html: function () { return '<span class="ek-et">Haftada kaç gömlek?</span><div class="ek-ch" data-n>' + [5, 10, 15].map(function (n) { return '<button data-v="' + n + '">' + n + ' gömlek</button>'; }).join("") + '</div><span class="ek-et">Hangi gün?</span><div class="ek-ch" data-g>' + GUN.map(function (g) { return '<button data-v="' + g + '">' + g + '</button>'; }).join("") + '</div><div class="ek-kart-hd"><small>' + B.kisa + ' · gömlek paketi (örnek)</small><b data-oz>Seçim bekleniyor</b><small>Ütülü, askıda teslim talebi</small></div><button class="ek-b" data-ekle>Paketi mesaja ekle</button>'; },
      bagla: function (a) { var n = null, g = null; function oz() { a.querySelector("[data-oz]").textContent = (n ? n + " gömlek / hafta" : "Adet seçin") + (g ? " · her " + g : ""); a.querySelectorAll("[data-n] button").forEach(function (b) { b.classList.toggle("a", +b.dataset.v === n); }); a.querySelectorAll("[data-g] button").forEach(function (b) { b.classList.toggle("a", b.dataset.v === g); }); }
        a.querySelector("[data-n]").onclick = function (e) { var b = e.target.closest("button"); if (b) { n = +b.dataset.v; oz(); } }; a.querySelector("[data-g]").onclick = function (e) { var b = e.target.closest("button"); if (b) { g = b.dataset.v; oz(); } };
        a.querySelector("[data-ekle]").onclick = function () { if (!n) { B.toast("Önce adet seçin"); return; } B.ekNot("paket", "Haftalık gömlek paketi talebi: " + n + " gömlek" + (g ? ", her " + g : "") + " (koşulları öğrenmek istiyorum)"); B.toast("Paket talebi mesaja eklendi"); B.iz("ek:paket"); }; } },
    { id: "dugme", et: "Kaybolmayan düğme", ad: "Teslim etmeden önce not düşün", ac: "Eksik düğme, sökük ya da leke yerini işaretleyin; not mesajınıza eklenir, tezgâhta unutulmaz.",
      html: function () { return ["Eksik ya da gevşek düğme var", "Yedek düğmeyi poşete koydum", "Sökük / dikiş açığı var", "Lekenin yerini iğneyle işaretledim", "Cepleri boşalttım"].map(function (x) { return '<label><input type="checkbox" value="' + x + '"> ' + x + '</label>'; }).join(""); },
      bagla: function (a) { a.onchange = function () { var l = [].slice.call(a.querySelectorAll("input:checked")).map(function (i) { return i.value.toLowerCase(); }); B.ekNot("dugme", l.length ? "Parça notu: " + l.join(", ") : null); B.iz("ek:dugme"); }; } },
    { id: "rota", et: "Kapıdan alım · örnek rota", ad: "Adresten alımda sıranız", ac: "Adresten alım olursa rota nasıl görünür? Mahallenizi seçin, örnek rotada yerinizi görün. Adresten alım yapılıp yapılmadığını işletme teyit eder.",
      html: function () { var P = [[40, 120], [120, 60], [210, 110], [300, 50], [390, 105], [470, 60]]; return '<div class="ek-rota"><svg viewBox="0 0 510 170" role="img" aria-label="Örnek alım rotası"><path class="yol" d="M' + P.map(function (p) { return p.join(" "); }).join(" L") + '" fill="none" stroke="var(--e-ac)" stroke-width="3"/>' + P.map(function (p, i) { return '<g data-d="' + i + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="var(--e-kart)" stroke="var(--e-ac)" stroke-width="3"/><text x="' + p[0] + '" y="' + (p[1] + 30) + '" text-anchor="middle" font-size="12" fill="var(--e-mu)">' + MAH[i] + '</text></g>'; }).join("") + '<text x="500" y="160" text-anchor="end" font-size="10" fill="var(--e-mu)">örnek rota</text></svg></div><div class="ek-ch">' + MAH.map(function (m, i) { return '<button data-i="' + i + '">' + m + '</button>'; }).join("") + '</div><div class="ek-kutu" data-o>Mahallenizi seçin.</div>'; },
      bagla: function (a) { a.querySelector(".ek-ch").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; var i = +b.dataset.i; a.querySelectorAll(".ek-ch button").forEach(function (x) { x.classList.toggle("a", x === b); }); a.querySelectorAll("[data-d] circle").forEach(function (c, j) { c.setAttribute("fill", j === i ? "var(--e-ac)" : "var(--e-kart)"); c.setAttribute("r", j === i ? 15 : 11); });
        a.querySelector("[data-o]").innerHTML = "<b>" + MAH[i] + "</b>: örnek rotada " + (i + 1) + ". durak. Gerçek sıra ve saat işletmeyle netleşir."; B.ekNot("rota", "Adresten alım için mahallem: " + MAH[i] + " (" + ILCE + ")"); B.iz("ek:rota"); }; } },
    { id: "foto", et: "Leke fotoğrafı · yalnız bu cihazda", ad: "Lekeyi gösterin, tarif etmeyin", ac: "Fotoğraf seçin ve lekenin üstüne dokunun. Fotoğraf hiçbir yere yüklenmez; mesajı gönderirken WhatsApp'tan siz eklersiniz.",
      html: function () { return '<input type="file" accept="image/*" aria-label="Leke fotoğrafı seç"><div class="ek-foto" data-f>Önizleme burada görünür</div>'; },
      bagla: function (a) { var f = a.querySelector("[data-f]"); a.querySelector("input").onchange = function (e) { var d = e.target.files && e.target.files[0]; if (!d) return; var u = URL.createObjectURL(d); f.innerHTML = '<img src="' + u + '" alt="Seçtiğiniz leke fotoğrafı (yalnız bu cihazda)">'; B.ekNot("foto", "Leke fotoğrafını WhatsApp'tan ayrıca gönderiyorum"); B.iz("ek:foto"); };
        f.onclick = function (e) { var im = f.querySelector("img"); if (!im) return; var r = f.getBoundingClientRect(), m = f.querySelector(".im") || f.appendChild(Object.assign(document.createElement("span"), { className: "im" })); m.style.left = (e.clientX - r.left) + "px"; m.style.top = (e.clientY - r.top) + "px"; B.toast("Leke işaretlendi"); }; } },
    { id: "bildirim", et: "Hazır olunca", ad: "Size nasıl haber verelim?", ac: "Siparişiniz hazır olunca hangi yolla haber almak istediğinizi seçin; tercih mesajınıza yazılır.",
      html: function () { return ["WhatsApp mesajı", "SMS", "Telefonla arama", "Haber vermeyin, ben uğrarım"].map(function (x, i) { return '<label><input type="radio" name="bld-' + B.slug + '" value="' + x + '"' + (i ? "" : "") + '> ' + x + '</label>'; }).join("") + '<select data-z aria-label="Uygun zaman"><option value="">Uygun zaman (isteğe bağlı)</option><option>Sabah</option><option>Öğle</option><option>Akşam</option></select>'; },
      bagla: function (a) { a.onchange = function () { var r = a.querySelector("input:checked"), z = a.querySelector("[data-z]").value; if (r) B.ekNot("bildirim", "Hazır olunca: " + r.value.toLowerCase() + (z ? " (" + z.toLowerCase() + ")" : "")); B.iz("ek:bildirim"); }; } }
  ];
})();
