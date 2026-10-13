/* Marina Tırnak ve Güzellik Merkezi · güzellik salonu sayfası · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: RAPORLAR/KEREM-ADAY-1013.md (local.gen.tr; Şirinyalı, İsmet Gökşen Cd. No:90-1, Muratpaşa / Antalya; 0530 747 37 59).
   Fiyatlar, süreler, listeler ve kayıtlar ÖRNEKTİR. Hiçbir form gönderim yapmaz. Dijitabela taslağı. */
window.ISL={"ad":"Marina Tırnak ve Güzellik Merkezi","slug":"marina-tirnak-ve-guzellik-merkezi","adres":"Şirinyalı, İsmet Gökşen Cd. No:90-1, Muratpaşa / Antalya","tel":"0530 747 37 59","telH":"+905307473759","wa":"905307473759","kaynak":"https://local.gen.tr/antalya/marina-tirnak-ve-guzellik-merkezi/","haritaSorgu":"Marina Tırnak ve Güzellik Merkezi Şirinyalı, İsmet Gökşen Cd. No:90-1, Muratpaşa / Antalya","carpan":1,"tur":"tirnak","kisa":"Marina","fiyatli":false};
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

/* Güzellik / tırnak motoru (Beauty Art motorundan türetildi): hizmet sepeti, süre planı, haftalık defter, randevu talebi mesajı. Hizmetler, süreler ve boş saatler ÖRNEKTİR; bu turda fiyat yazılmaz. */
(function () {
  "use strict";
  var B = window.ISL, tir = B.tur === "tirnak";
  var IK = { cilt: "M12 3c3 4 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 3-6 6-10zM9.5 14a2.5 2.5 0 0 0 2.5 2.5", kirpik: "M2 13c3-5 7-7.5 10-7.5S19 8 22 13M5 17l1.6-2.4M9 18.5l.8-2.8M13.5 18.5l-.4-2.8M17.6 17l-1.5-2.4", tirnak: "M8 21V10a4 4 0 0 1 8 0v11M8 15h8M10.5 6.5V4M13.5 6.5V4", epil: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z", makyaj: "M5 20l9-9M12 4l8 8-3 3-8-8zM4 21l2-5 3 3z", protez: "M7 21V9c0-3 2-6 5-6s5 3 5 6v12M7 13h10M10 3.5L12 6l2-2.5", art: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5S14 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7h.01M15 7.5h.01" };
  B.kat = tir ? [{ id: "kalici", ad: "Kalıcı oje", ik: "tirnak" }, { id: "protez", ad: "Protez tırnak", ik: "protez" }, { id: "art", ad: "Nail art", ik: "art" }, { id: "bakim", ad: "El ve ayak bakımı", ik: "cilt" }, { id: "kas", ad: "Kaş ve kirpik", ik: "kirpik" }]
    : [{ id: "cilt", ad: "Cilt bakımı", ik: "cilt" }, { id: "kirpik", ad: "Kaş ve kirpik", ik: "kirpik" }, { id: "tirnak", ad: "El ve ayak", ik: "tirnak" }, { id: "epil", ad: "Ağda ve epilasyon", ik: "epil" }, { id: "makyaj", ad: "Makyaj ve saç", ik: "makyaj" }];
  /* ÖRNEK hizmet listesi: dk = süre (örnek) */
  B.hizmet = tir ? [
    { id: 1, kat: "kalici", ad: "Elde kalıcı oje", dk: 60, ac: "Tek renk, tırnak hazırlığıyla (örnek içerik)." },
    { id: 2, kat: "kalici", ad: "Ayakta kalıcı oje", dk: 60, ac: "Pedikür sonrası kalıcı oje (örnek içerik)." },
    { id: 3, kat: "kalici", ad: "Kalıcı oje çıkarma", dk: 20, ac: "Tırnağı yormadan çıkarma (örnek içerik)." },
    { id: 4, kat: "protez", ad: "Jel protez tırnak", dk: 120, ac: "Uzatma ve şekillendirme (örnek içerik)." },
    { id: 5, kat: "protez", ad: "Protez tırnak bakımı", dk: 90, ac: "Dolgu ve düzeltme (örnek içerik)." },
    { id: 6, kat: "art", ad: "French", dk: 30, ac: "Klasik ya da renkli uç (örnek içerik)." },
    { id: 7, kat: "art", ad: "Desen / taş uygulaması", dk: 45, ac: "Parmak başı desen seçimi (örnek içerik)." },
    { id: 8, kat: "bakim", ad: "Manikür", dk: 45, ac: "Bakım ve şekil (örnek içerik)." },
    { id: 9, kat: "bakim", ad: "Pedikür", dk: 60, ac: "Ayak bakımı (örnek içerik)." },
    { id: 10, kat: "kas", ad: "Kaş tasarımı", dk: 30, ac: "Yüz hatlarına göre şekil (örnek içerik)." },
    { id: 11, kat: "kas", ad: "Kirpik lifting", dk: 60, ac: "Doğal kıvrım (örnek içerik)." }
  ] : [
    { id: 1, kat: "cilt", ad: "Klasik cilt bakımı", dk: 60, ac: "Temizleme, maske ve nemlendirme (örnek içerik)." },
    { id: 2, kat: "cilt", ad: "Derin temizlik bakımı", dk: 75, ac: "Derin temizlik ve nem desteği (örnek içerik)." },
    { id: 3, kat: "kirpik", ad: "Kaş tasarımı", dk: 30, ac: "Yüz hatlarına göre şekil (örnek içerik)." },
    { id: 4, kat: "kirpik", ad: "Kirpik lifting", dk: 60, ac: "Doğal kıvrım ve boya (örnek içerik)." },
    { id: 5, kat: "kirpik", ad: "İpek kirpik", dk: 120, ac: "Kirpik tek tek uygulanır (örnek içerik)." },
    { id: 6, kat: "tirnak", ad: "Manikür", dk: 45, ac: "Bakım ve oje (örnek içerik)." },
    { id: 7, kat: "tirnak", ad: "Kalıcı oje", dk: 60, ac: "Dayanıklı oje uygulaması (örnek içerik)." },
    { id: 8, kat: "tirnak", ad: "Pedikür", dk: 60, ac: "Ayak bakımı ve oje (örnek içerik)." },
    { id: 9, kat: "epil", ad: "Bölgesel ağda", dk: 30, ac: "Bölge seçimiyle (örnek içerik)." },
    { id: 10, kat: "epil", ad: "Tüm vücut ağda", dk: 90, ac: "Bölgeler birlikte (örnek içerik)." },
    { id: 11, kat: "makyaj", ad: "Gün makyajı", dk: 45, ac: "Doğal görünümlü makyaj (örnek içerik)." },
    { id: 12, kat: "makyaj", ad: "Özel gün makyajı ve saç", dk: 120, ac: "Makyaj + fön / toplama (örnek içerik)." }
  ];
  B.paketler = tir ? [{ ad: "Bakımlı eller", ids: [8, 1], not: "Manikür + elde kalıcı oje" }, { ad: "El ve ayak", ids: [1, 2], not: "Elde ve ayakta kalıcı oje" }, { ad: "Özel gün", ids: [4, 7, 10], not: "Protez + desen + kaş" }]
    : [{ ad: "Hafta sonu bakım", ids: [1, 3, 7], not: "Cilt bakımı + kaş + kalıcı oje" }, { ad: "Gelin öncesi", ids: [2, 4, 6, 8], not: "Derin temizlik + lifting + manikür + pedikür" }, { ad: "Işıltı günü", ids: [2, 11], not: "Derin temizlik + gün makyajı" }];
  B.bul = function (id) { return B.hizmet.filter(function (h) { return h.id === Number(id); })[0]; };
  B.sureYaz = function (dk) { var s = Math.floor(dk / 60), m = dk % 60; return (s ? s + " sa " : "") + (m ? m + " dk" : (s ? "" : "0 dk")); };
  B.sepet = function () { return B.oku("sepet", []); };
  B.sepetYaz = function (l) { B.yaz("sepet", l); };
  B.var = function (id) { return B.sepet().indexOf(Number(id)) > -1; };
  B.deg = function (id) { id = Number(id); var l = B.sepet(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); B.sepetYaz(l); return i < 0; };
  B.temizle = function () { B.sepetYaz([]); };
  B.toplam = function (l) { l = l || B.sepet(); var dk = 0; l.forEach(function (id) { var h = B.bul(id); if (h) dk += h.dk; }); return { dk: dk, n: l.length }; };
  B.saatler = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  B.dolu = function (gunIdx, saatIdx) { return ((gunIdx * 5 + saatIdx * 3 + saatIdx * saatIdx) % 7) < 2; };
  B.mesaj = function (o) {
    var l = (o.ids || B.sepet()).map(B.bul).filter(Boolean), t = B.toplam(l.map(function (h) { return h.id; }));
    return "Merhaba, " + (o.ad ? o.ad + " adına " : "") + "randevu talebinde bulunmak istiyorum" + (o.gun ? ": " + o.gun : "") + (o.saat ? " " + o.saat + " civarı" : "") + ".\nİstediğim hizmetler: " + (l.length ? l.map(function (h) { return h.ad; }).join(", ") : "(henüz seçmedim, bilgi alabilir miyim?)") + (l.length ? "\nTahmini süre: " + B.sureYaz(t.dk) : "") + (o.tel ? "\nTelefonum: " + o.tel : "") + (o.not ? "\nNot: " + o.not : "") + "\nUygunsa onaylar mısınız? Uygun değilse başka bir saat önerebilirsiniz.";
  };
  B.ikon = function (kat, boy) {
    var k = B.kat.filter(function (x) { return x.id === kat; })[0] || B.kat[0];
    return '<svg viewBox="0 0 24 24" width="' + (boy || 22) + '" height="' + (boy || 22) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + IK[k.ik] + '"/></svg>';
  };
  window.SALON = B;
})();
