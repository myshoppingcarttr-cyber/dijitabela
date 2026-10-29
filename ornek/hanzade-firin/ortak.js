/* Hanzade Fırın & Cafe — 3 prototip için ortak veri ve çalışan özellikler (Dijitabela, 29 Eki 2026).
   - Ürün ve fiyatlar dükkânın 29 Eki 2026 listesinden (liste fiyatı; kasada %10 indirim ayrıca). Listede olmayan ürün/ek için fiyat yazılmaz.
   - Sipariş formu hiçbir yere mesaj GÖNDERMEZ: son adımda WhatsApp'a düşecek mesajın ve ustanın fişinin önizlemesini gösterir.
   - Görseller: işletmenin kendi Instagram'ından (@hanzadefirin, işletme izniyle) img/ig/*.webp; gerçek görseli olmayan birkaç ürün için Pixabay temsilî fotoğraf kaldı (img/LISANS.txt). */
(function () {
  "use strict";
  var H = window.HZ = {};
  H.ig = { vitrin: 1, vitrin2: 1, usta: 1, simit: 1, ekmek: 1, borek: 1, kahvalti: 1, cay: 1, baklava: 1, kurabiye: 1, dilim: 1, "p-dogumgunu": 1, "p-cikolata": 1, "p-cilek": 1, "p-gul": 1, "p-beyaz": 1, "p-drip": 1, "p-cocuk": 1, "p-charlotte": 1, "p-dugun": 1 };
  H.img = function (k) { return (window.HZ_KOK || "../") + "img/" + (H.ig[k] ? "ig/" + k + ".webp" : k + ".jpg"); };
  H.tl = function (n) { return Math.round(n).toLocaleString("tr-TR") + " TL"; };
  H.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  H.isletme = { ad: "Hanzade Fırın & Cafe", adres: "Molla Yusuf Mh. Uncalı Cad. Sidney Apt. No:2/A, Konyaaltı / Antalya", tel: "(0242) 227 35 25", acilis: "06:00", kapanis: "21:30", lat: 36.8921, lng: 30.6264,
    harita: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Hanzade Fırın Uncalı Konyaaltı Antalya"),
    haritaGom: "https://maps.google.com/maps?q=" + encodeURIComponent("Uncalı Caddesi, Molla Yusuf, Konyaaltı, Antalya") + "&z=16&output=embed" };

  // Yaş pasta çeşitleri — dükkânın gerçek 9 çeşidi (Hüseyin Bey'in listesi, 29 Eki 2026). Fiyat çeşide göre değil boya göre: 0/1/2 No = 750/1.000/1.250 TL (liste fiyatı, kasada %10 indirim öncesi).
  // Fotoğraflar işletmenin kendi Instagram'ından; süsleme örnektir, her çeşit istenen süslemeyle yapılır.
  H.pastalar = [
    { id: "cikolatali", ad: "Çikolatalı", kat: "cikolata", img: "p-drip", taban: 750, not: "Kakaolu kek, çikolatalı krema · fotoğraf: ayıcıklı süsleme" },
    { id: "fistikli", ad: "Çikolata-fıstıklı", kat: "ozel", img: "p-cilek", taban: 750, not: "Çikolata ve Antep fıstığı · fotoğraf: fıstık katlı model" },
    { id: "muzlu", ad: "Çikolata-muzlu", kat: "meyveli", img: "p-beyaz", taban: 750, not: "Çikolata ve muz · fotoğraf: beyaz fiyonklu süsleme" },
    { id: "cilekli", ad: "Çikolata-çilekli", kat: "meyveli", img: "p-cocuk", taban: 750, not: "Çikolata ve çilek · fotoğraf: gökkuşağı süsleme" },
    { id: "lotuslu", ad: "Çikolata-lotuslu", kat: "ozel", img: "p-dogumgunu", taban: 750, not: "Çikolata ve karamelize lotus bisküvi" },
    { id: "kestaneli", ad: "Çikolata-kestaneli", kat: "ozel", img: "p-charlotte", taban: 750, not: "Çikolata kaplama, kestane" },
    { id: "frambuazli", ad: "Çikolata-frambuazlı", kat: "meyveli", img: "p-cikolata", taban: 750, not: "Çikolatalı krema, kakaolu kek, frambuaz" },
    { id: "meyveli", ad: "Karışık meyveli", kat: "meyveli", img: "dilim", taban: 750, not: "Mevsim meyveleri, krema" },
    { id: "krokantli", ad: "Çikolata-krokantlı", kat: "cikolata", img: "p-gul", taban: 750, not: "Çikolata ve krokan · fotoğraf: gül şelaleli süsleme" }
  ];
  H.kategoriler = [["hepsi", "Hepsi"], ["cikolata", "Çikolatalı"], ["meyveli", "Meyveli"], ["ozel", "Fıstık · lotus · kestane"]];
  H.boylar = [
    { id: 0, ad: "4 kişilik", cap: "0 No", f: 750 },
    { id: 1, ad: "6–8 kişilik", cap: "1 No", f: 1000 },
    { id: 2, ad: "8–10 kişilik", cap: "2 No", f: 1250 }
  ];
  // Ekler: dükkân listesinde fiyatı yok → fiyat uydurulmadı (f: null), tutara eklenmez; "Kasada sorun" yazar.
  H.ekler = [
    { id: "yazi", ad: "İsim / mesaj yazısı", f: 0 },
    { id: "foto", ad: "Yenilebilir fotoğraf baskı", f: null },
    { id: "mum", ad: "Rakam mum + maytap", f: null },
    { id: "kutu", ad: "Hediye kutusu + kurdele", f: null }
  ];
  // Fırın menüsü — gerçek fiyatlar (Hüseyin Bey'in el yazısı listesi, 29 Eki 2026). Listede olmayanlar (kruvasan, kahvaltı tabağı, çay, profiterol, ekler, cheesecake, dilim pasta, kurabiye) çıkarıldı.
  // Eski veri yedeği: DIJITABELA/MUSTERILER/hanzade-firin/_yedek-site-2910/ortak.js
  H.firin = [
    { id: "ekmek", ad: "Normal taş ekmek", img: "ekmek", f: 20, b: "adet", grup: "Fırından" },
    { id: "cicek", ad: "Çiçek ekmek", img: "ekmek", f: 50, b: "adet", grup: "Fırından" },
    { id: "tava", ad: "Tava ekmek", img: "ekmek", f: 50, b: "adet", grup: "Fırından" },
    { id: "tandir", ad: "Tandır ekmek", img: "ekmek", f: 20, b: "adet", grup: "Fırından" },
    { id: "ramazan", ad: "Ramazan pidesi", img: "ekmek", f: 30, b: "adet", grup: "Fırından" },
    { id: "eksimaya", ad: "Ekşi maya köy ekmeği (1 kg)", img: "eksimaya", f: 200, b: "adet", grup: "Fırından" },
    { id: "muhacir", ad: "Ekşi maya muhacir (1 kg)", img: "eksimaya", f: 200, b: "adet", grup: "Fırından" },
    { id: "saribugday", ad: "Ekşi maya sarı buğday", img: "eksimaya", f: 80, b: "adet", grup: "Fırından" },
    { id: "karakilcik", ad: "Ekşi maya karakılçık", img: "eksimaya", f: 125, b: "adet", grup: "Fırından" },
    { id: "simit", ad: "Ankara simidi", img: "simit", f: 20, b: "adet", grup: "Fırından" },
    { id: "tereyagsimit", ad: "Tereyağlı simit", img: "simit", f: 30, b: "adet", grup: "Fırından" },
    { id: "acma", ad: "Açma (kaşarlı, peynirli, zeytinli, patatesli)", img: "acma", f: 35, b: "adet", grup: "Fırından" },
    { id: "pogaca", ad: "Poğaça (kaşarlı, peynirli, zeytinli, patatesli)", img: "acma", f: 30, b: "adet", grup: "Fırından" },
    { id: "borek", ad: "Kol böreği", img: "borek", f: 700, b: "kg", grup: "Börek & kahvaltı" },
    { id: "suboregi", ad: "Su böreği", img: "borek", f: 700, b: "kg", grup: "Börek & kahvaltı" },
    { id: "gozleme", ad: "Gözleme çeşitleri", img: "borek", f: 150, b: "adet", grup: "Börek & kahvaltı" },
    { id: "kesme", ad: "Kesme börekler", img: "borek", f: 75, b: "adet", grup: "Börek & kahvaltı" },
    { id: "fbaklava", ad: "Fıstıklı baklava", img: "baklava", f: 1450, b: "kg", grup: "Tatlı & pastane" },
    { id: "cbaklava", ad: "Cevizli baklava", img: "baklava", f: 900, b: "kg", grup: "Tatlı & pastane" },
    { id: "kurupasta", ad: "Tatlı kuru pasta", img: "kurabiye", f: 750, b: "kg", grup: "Tatlı & pastane" },
    { id: "tuzlukuru", ad: "Tuzlu kuru pasta", img: "kurabiye", f: 750, b: "kg", grup: "Tatlı & pastane" }
  ];
  // Fırından çıkış saatleri (örnek düzen) — tazelik panosu bunlardan hesaplanır
  H.cikislar = [
    { k: "Ekmek", ad: "Normal taş ekmek", img: "ekmek", s: ["05:40", "08:30", "11:30", "15:00", "18:00"] },
    { k: "Simit", ad: "Ankara simidi", img: "simit", s: ["06:00", "09:00", "13:00", "16:30"] },
    { k: "Açma", ad: "Açma & poğaça", img: "acma", s: ["06:15", "09:30", "14:00"] },
    { k: "Börek", ad: "Kol böreği", img: "borek", s: ["06:30", "10:00", "15:30"] },
    { k: "Çiçek", ad: "Çiçek ekmek", img: "ekmek", s: ["07:00", "12:00"] },
    { k: "Ekşi maya", ad: "Ekşi maya köy ekmeği (1 kg)", img: "eksimaya", s: ["07:30", "16:00"] }
  ];
  function dk(s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; }
  function simdiDk() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  H.durum = function () {
    var n = simdiDk(), a = dk(H.isletme.acilis), k = dk(H.isletme.kapanis);
    if (n >= a && n < k) { var kal = k - n; return { acik: true, metin: "Şu an açık", alt: kal <= 60 ? "Kapanışa " + kal + " dk" : "21:30'a kadar" }; }
    return { acik: false, metin: "Şu an kapalı", alt: "Yarın 06:00'da açılıyor" };
  };
  H.tazelik = function () {
    var n = simdiDk();
    return H.cikislar.map(function (u) {
      var son = null, sonraki = null;
      u.s.forEach(function (t) { var m = dk(t); if (m <= n) son = t; else if (!sonraki) sonraki = t; });
      var fark = son ? n - dk(son) : null;
      return { k: u.k, ad: u.ad, img: u.img, son: son, sonraki: sonraki, fark: fark, sicak: fark != null && fark <= 45 };
    });
  };
  H.farkYazi = function (f) { if (f == null) return "Bugün henüz çıkmadı"; if (f < 1) return "Az önce çıktı"; if (f < 60) return f + " dk önce çıktı"; return Math.floor(f / 60) + " sa " + (f % 60) + " dk önce"; };
  H.bugun = function () { return new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }); };

  H.fiyat = function (o) {
    var p = H.pastalar.filter(function (x) { return x.id === o.model; })[0]; if (!p) return null;
    var b = H.boylar[o.boy || 0] || H.boylar[0], ara = b.f, ek = 0;
    (o.ekler || []).forEach(function (id) { H.ekler.forEach(function (e) { if (e.id === id && e.f) ek += e.f; }); });
    var top = ara + ek, ind = o.teslim === "gelal" ? Math.round(top * 0.15) : 0;
    return { pasta: p, boy: b, ara: ara, ek: ek, indirim: ind, toplam: top - ind };
  };
  H.fisNo = function () { return "HZ-" + String(Date.now()).slice(-5); };
  H.mesaj = function (o, f) {
    return "Merhaba Hanzade, pasta siparişi vermek istiyorum.\n" +
      "• Model: " + f.pasta.ad + "\n• Boy: " + f.boy.ad + " (" + f.boy.cap + ")\n" +
      "• Tarih: " + (o.tarihYazi || o.tarih) + (o.saat ? " · " + o.saat : "") + "\n" +
      (o.yazi ? "• Pasta üstü yazı: \"" + o.yazi + "\"\n" : "") +
      "• Teslim: " + (o.teslim === "gelal" ? "Gel-al (%15 indirim)" : "Adrese: " + (o.adres || "-")) + "\n" +
      "• Ad: " + (o.ad || "-") + "\n• Tutar: " + H.tl(f.toplam);
  };

  /* ---------- Sipariş penceresi (formu adım adım doldurur, mesaj göndermez) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".hz-ornek{position:fixed;inset:0;pointer-events:none;z-index:2147482000;display:flex;align-items:center;justify-content:center;overflow:hidden}" +
    ".hz-ornek span{font:900 clamp(90px,20vw,260px)/1 system-ui,sans-serif;letter-spacing:.08em;color:rgba(120,60,30,.07);transform:rotate(-24deg);white-space:nowrap}" +
    ".hz-serit{background:#1d1410;color:#f3e6d3;font:600 12px/1.4 system-ui,sans-serif;text-align:center;padding:7px 12px;position:relative;z-index:50}.hz-serit a{color:#ffcf6b}" +
    ".hz-pen{position:fixed;inset:0;z-index:2147483100;background:rgba(20,12,8,.62);display:flex;align-items:flex-end;justify-content:center}" +
    "@media(min-width:720px){.hz-pen{align-items:center}}" +
    ".hz-kut{background:#fffaf2;color:#22170f;width:min(560px,100%);max-height:92vh;overflow:auto;font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;border-top:4px solid var(--vurgu,#8c2f1b)}" +
    "@media(min-width:720px){.hz-kut{border-radius:4px}}" +
    ".hz-bas{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #eadfcd;position:sticky;top:0;background:#fffaf2;z-index:2}" +
    ".hz-bas b{font-size:1.05rem}.hz-bas small{display:block;color:#7a6a58;font-size:.78rem}" +
    ".hz-x{border:0;background:none;font-size:28px;line-height:1;cursor:pointer;color:#22170f;padding:4px 8px}" +
    ".hz-ad{display:flex;gap:4px;padding:0 18px;margin-top:12px}.hz-ad i{flex:1;height:4px;background:#eadfcd}.hz-ad i.ok{background:var(--vurgu,#8c2f1b)}" +
    ".hz-ic{padding:16px 18px 20px}.hz-ic h4{margin:0 0 4px;font-size:1.15rem}.hz-ic p.al{margin:0 0 14px;color:#7a6a58;font-size:.9rem}" +
    ".hz-mod{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    ".hz-mod button{border:2px solid transparent;padding:0;background:#fff;cursor:pointer;text-align:left;font:inherit;font-size:.78rem;line-height:1.25;color:inherit}" +
    ".hz-mod button img{width:100%;aspect-ratio:1;object-fit:cover}.hz-mod button span{display:block;padding:6px}" +
    ".hz-mod button.s{border-color:var(--vurgu,#8c2f1b)}" +
    ".hz-sec{display:grid;gap:8px}.hz-sec button,.hz-sec label{display:flex;justify-content:space-between;align-items:center;gap:10px;border:1px solid #d9cbb5;background:#fff;padding:12px 14px;cursor:pointer;font:inherit;color:inherit;text-align:left}" +
    ".hz-sec button.s,.hz-sec label.s{border-color:var(--vurgu,#8c2f1b);box-shadow:inset 0 0 0 1px var(--vurgu,#8c2f1b)}.hz-sec em{font-style:normal;color:#7a6a58;font-size:.85rem}" +
    ".hz-gir{width:100%;border:1px solid #d9cbb5;background:#fff;padding:12px;font:inherit;margin:4px 0 10px}" +
    ".hz-gun{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:10px}.hz-gun button{flex:none;width:64px;border:1px solid #d9cbb5;background:#fff;padding:8px 4px;cursor:pointer;font:inherit;text-align:center;line-height:1.2;color:inherit}" +
    ".hz-gun button b{display:block;font-size:1.2rem}.hz-gun button small{font-size:.7rem;color:#7a6a58}.hz-gun button.s{background:var(--vurgu,#8c2f1b);color:#fff;border-color:var(--vurgu,#8c2f1b)}.hz-gun button.s small{color:#fff}.hz-gun button[disabled]{opacity:.35;cursor:not-allowed}" +
    ".hz-onz{margin:12px 0;display:grid;place-items:center;background:#f3e6d3;padding:18px}.hz-onz div{width:150px;height:150px;border-radius:50%;background:center/cover;display:grid;place-items:center;box-shadow:0 8px 20px rgba(0,0,0,.2)}" +
    ".hz-onz div span{font:italic 700 15px/1.2 Georgia,serif;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.8);text-align:center;padding:0 14px;max-width:140px;word-break:break-word}" +
    ".hz-alt{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 18px;border-top:1px solid #eadfcd;position:sticky;bottom:0;background:#fffaf2}" +
    ".hz-alt strong{font-size:1.25rem}.hz-alt small{display:block;color:#7a6a58;font-size:.75rem}" +
    ".hz-btn{border:0;background:var(--vurgu,#8c2f1b);color:#fff;font:700 15px system-ui,sans-serif;padding:13px 20px;cursor:pointer;min-height:46px}.hz-btn.g{background:none;color:inherit;border:1px solid #d9cbb5}.hz-btn[disabled]{opacity:.4;cursor:not-allowed}" +
    ".hz-wa{background:#e5ddd5 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1.4' fill='%23d4cbc1'/%3E%3C/svg%3E\");padding:14px;margin:10px 0}" +
    ".hz-wa div{background:#dcf8c6;padding:10px 12px;border-radius:8px 0 8px 8px;margin-left:auto;max-width:92%;white-space:pre-wrap;font-size:.88rem;box-shadow:0 1px 1px rgba(0,0,0,.1)}" +
    ".hz-wa small{display:block;text-align:right;color:#6b7c72;font-size:.7rem;margin-top:4px}" +
    ".hz-fis{border:1px dashed #9b8b75;background:#fff;padding:14px;font:13px/1.55 'Courier New',monospace;margin:10px 0}.hz-fis b{font-size:14px}" +
    ".hz-not{background:#fff3d6;border-left:3px solid #e0a100;padding:10px 12px;font-size:.85rem;margin:10px 0}" +
    ".hz-tablo{width:100%;border-collapse:collapse;font-size:.92rem}.hz-tablo td{padding:6px 0;border-bottom:1px solid #eadfcd}.hz-tablo td:last-child{text-align:right}";
  document.head.appendChild(css);

  function ornekKatman() {
    if (document.querySelector(".hz-ornek")) return;
    var o = document.createElement("div"); o.className = "hz-ornek"; o.setAttribute("aria-hidden", "true"); o.innerHTML = "<span>ÖRNEK</span>"; document.body.appendChild(o);
    var s = document.createElement("div"); s.className = "hz-serit";
    s.innerHTML = "ÖRNEK TASARIM · Dijitabela tarafından Hanzade Fırın & Cafe için hazırlandı · Fiyatlar dükkân listesinden, değişebilir · <a href=\"../\">Tüm taslaklar</a>";
    document.body.insertBefore(s, document.body.firstChild);
  }

  var A = {};
  var ADIMLAR = ["Model", "Boy", "Tarih", "Yazı & ek", "Teslim", "Özet"];
  function gunler() {
    var g = [], d = new Date(); d.setHours(0, 0, 0, 0);
    for (var i = 0; i < 14; i++) { var x = new Date(d); x.setDate(d.getDate() + i); g.push(x); }
    return g;
  }
  H.siparisAc = function (on) {
    A = { adim: 0, model: (on && on.model) || null, boy: 0, tarih: null, saat: "14:00", yazi: "", ekler: ["yazi"], teslim: "adres", adres: "", ad: "", tel: "" };
    if (A.model) A.adim = 1;
    var p = document.createElement("div"); p.className = "hz-pen"; p.setAttribute("role", "dialog"); p.setAttribute("aria-modal", "true");
    p.innerHTML = '<div class="hz-kut"><div class="hz-bas"><div><b>Pasta siparişi</b><small>Demo · hiçbir yere mesaj gönderilmez</small></div><button class="hz-x" aria-label="Kapat">×</button></div><div class="hz-ad"></div><div class="hz-ic"></div><div class="hz-alt"></div></div>';
    document.body.appendChild(p); document.documentElement.style.overflow = "hidden";
    function kapat() { p.remove(); document.documentElement.style.overflow = ""; }
    p.querySelector(".hz-x").onclick = kapat; p.addEventListener("click", function (e) { if (e.target === p) kapat(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { kapat(); document.removeEventListener("keydown", k); } });
    ciz(p);
  };
  function ciz(p) {
    var ic = p.querySelector(".hz-ic"), alt = p.querySelector(".hz-alt"), f = A.model ? H.fiyat(A) : null, h = "";
    p.querySelector(".hz-ad").innerHTML = ADIMLAR.map(function (_, i) { return "<i class='" + (i <= A.adim ? "ok" : "") + "'></i>"; }).join("");
    if (A.adim === 0) {
      h = "<h4>Hangi çeşit?</h4><p class='al'>Fiyat boya göre: 0 No 750 · 1 No 1.000 · 2 No 1.250 TL. Fotoğraftaki süsleme örnektir.</p><div class='hz-mod'>" +
        H.pastalar.map(function (x) { return "<button data-m='" + x.id + "' class='" + (A.model === x.id ? "s" : "") + "'><img src='" + H.img(x.img) + "' alt='' loading='lazy'><span>" + H.esc(x.ad) + "<br><em style='font-style:normal;color:#7a6a58'>" + H.tl(x.taban) + "'den</em></span></button>"; }).join("") + "</div>";
    } else if (A.adim === 1) {
      h = "<h4>Kaç kişilik?</h4><p class='al'>" + H.esc(f.pasta.ad) + " · " + H.esc(f.pasta.not) + "</p><div class='hz-sec'>" +
        H.boylar.map(function (b) { var ff = H.fiyat({ model: A.model, boy: b.id }); return "<button data-b='" + b.id + "' class='" + (A.boy === b.id ? "s" : "") + "'><span><b>" + b.ad + "</b><br><em>" + b.cap + "</em></span><b>" + H.tl(ff.ara) + "</b></button>"; }).join("") + "</div>";
    } else if (A.adim === 2) {
      var tr = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], ay = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      h = "<h4>Ne zaman lazım?</h4><p class='al'>Pastalar en az 1 gün önceden hazırlanır; bugün için ustaya sorulur.</p><div class='hz-gun'>" +
        gunler().map(function (g, i) { var k = g.toISOString().slice(0, 10); return "<button data-t='" + k + "' data-y='" + g.getDate() + " " + ay[g.getMonth()] + " " + tr[g.getDay()] + "' class='" + (A.tarih === k ? "s" : "") + "'" + (i === 0 ? " disabled title='Aynı gün için arayın'" : "") + "><small>" + (i === 1 ? "Yarın" : tr[g.getDay()]) + "</small><b>" + g.getDate() + "</b><small>" + ay[g.getMonth()] + "</small></button>"; }).join("") +
        "</div><label>Teslim saati</label><div class='hz-sec' style='grid-template-columns:repeat(4,1fr)'>" + ["10:00", "12:00", "14:00", "16:00", "18:00", "19:00", "20:00", "21:00"].map(function (s) { return "<button data-s='" + s + "' class='" + (A.saat === s ? "s" : "") + "' style='justify-content:center'>" + s + "</button>"; }).join("") + "</div>";
    } else if (A.adim === 3) {
      h = "<h4>Pastanın üstüne ne yazalım?</h4><p class='al'>Yazdıkça önizlemede görünür (en fazla 28 harf).</p><input class='hz-gir' id='hzYazi' maxlength='28' placeholder='Örn. İyi ki doğdun Elif' value='" + H.esc(A.yazi) + "'>" +
        "<div class='hz-onz'><div style=\"background-image:url('" + H.img(f.pasta.img) + "')\"><span id='hzOnz'>" + H.esc(A.yazi || "İyi ki doğdun") + "</span></div></div><div class='hz-sec'>" +
        H.ekler.map(function (e) { var s = A.ekler.indexOf(e.id) > -1; return "<label class='" + (s ? "s" : "") + "'><span><input type='checkbox' data-e='" + e.id + "'" + (s ? " checked" : "") + "> " + e.ad + "</span><em>" + (e.f == null ? "Kasada sorun" : e.f ? "+" + H.tl(e.f) : "Ücretsiz") + "</em></label>"; }).join("") + "</div>";
    } else if (A.adim === 4) {
      h = "<h4>Nasıl alacaksınız?</h4><p class='al'>Gel-al siparişlerde %15 indirim uygulanır.</p><div class='hz-sec'>" +
        "<button data-tes='gelal' class='" + (A.teslim === "gelal" ? "s" : "") + "'><span><b>Gel-al</b><br><em>Uncalı Cad. No:2/A · %15 indirim</em></span><b>−" + H.tl(Math.round((f.ara + f.ek) * .15)) + "</b></button>" +
        "<button data-tes='adres' class='" + (A.teslim === "adres" ? "s" : "") + "'><span><b>Adrese teslim</b><br><em>Konyaaltı içi evlere servis</em></span><b>Ücretsiz</b></button></div>" +
        (A.teslim === "adres" ? "<label style='display:block;margin-top:12px'>Teslim adresi</label><input class='hz-gir' id='hzAdres' placeholder='Mahalle, cadde, apartman, daire' value='" + H.esc(A.adres) + "'>" : "") +
        "<label style='display:block;margin-top:8px'>Adınız</label><input class='hz-gir' id='hzAd' placeholder='Ad Soyad' value='" + H.esc(A.ad) + "'>";
    } else {
      var no = A.no || (A.no = H.fisNo());
      h = "<h4>Sipariş özeti</h4><table class='hz-tablo'><tr><td>" + H.esc(f.pasta.ad) + " · " + f.boy.ad + "</td><td>" + H.tl(f.ara) + "</td></tr>" +
        (f.ek ? "<tr><td>Ekler</td><td>+" + H.tl(f.ek) + "</td></tr>" : "") + (f.indirim ? "<tr><td>Gel-al indirimi (%15)</td><td>−" + H.tl(f.indirim) + "</td></tr>" : "") +
        "<tr><td><b>Toplam</b></td><td><b>" + H.tl(f.toplam) + "</b></td></tr></table>" +
        "<p style='margin:14px 0 0;font-weight:700'>1 · WhatsApp'a düşecek mesaj</p><div class='hz-wa'><div>" + H.esc(H.mesaj(A, f)) + "<small>" + new Date().toTimeString().slice(0, 5) + " ✓✓</small></div></div>" +
        "<p style='margin:14px 0 0;font-weight:700'>2 · Ustanın ekranına düşen fiş</p><div class='hz-fis'><b>PASTA FİŞİ " + no + "</b><br>" + H.esc(f.pasta.ad).toUpperCase() + "<br>" + f.boy.ad + " · " + f.boy.cap + "<br>Teslim: " + H.esc(A.tarihYazi) + " " + A.saat + "<br>Yazı: " + H.esc(A.yazi || "—") + "<br>Ekler: " + (A.ekler.filter(function (x) { return x !== "yazi"; }).join(", ") || "—") + "<br>" + (A.teslim === "gelal" ? "GEL-AL" : "ADRES: " + H.esc(A.adres || "—")) + "<br>Müşteri: " + H.esc(A.ad || "—") + "<br>Kapora: " + H.tl(Math.round(f.toplam * .3)) + " (%30, örnek)</div>" +
        "<div class='hz-not'><b>Demo:</b> Mesaj gönderilmedi. Kurulumda bu sipariş Hanzade'nin WhatsApp hattına ve ustanın ekranına aynı anda düşer; müşteriye onay mesajı gider.</div>" +
        "<a href='" + (window.HZ_KOK || "../") + "asistan/' style='font-weight:700;color:var(--vurgu,#8c2f1b)'>WhatsApp sipariş asistanını sohbet olarak deneyin →</a>";
    }
    ic.innerHTML = h;
    var hazir = [A.model, true, A.tarih, true, A.teslim === "gelal" || (A.adres || "").trim().length > 4, true][A.adim];
    alt.innerHTML = "<div><small>" + (f ? "Tutar (liste fiyatı, değişebilir)" : "Adım " + (A.adim + 1) + "/6") + "</small><strong>" + (f ? H.tl(f.toplam) : "—") + "</strong></div><div style='display:flex;gap:8px'>" +
      (A.adim > 0 ? "<button class='hz-btn g' data-geri>Geri</button>" : "") +
      (A.adim < 5 ? "<button class='hz-btn' data-ileri" + (hazir ? "" : " disabled") + ">" + (A.adim === 4 ? "Özeti gör" : "Devam") + "</button>" : "<button class='hz-btn' data-bitti>Tamam</button>") + "</div>";
    // olaylar
    ic.querySelectorAll("[data-m]").forEach(function (b) { b.onclick = function () { A.model = b.dataset.m; A.adim = 1; ciz(p); }; });
    ic.querySelectorAll("[data-b]").forEach(function (b) { b.onclick = function () { A.boy = +b.dataset.b; ciz(p); }; });
    ic.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { A.tarih = b.dataset.t; A.tarihYazi = b.dataset.y; ciz(p); }; });
    ic.querySelectorAll("[data-s]").forEach(function (b) { b.onclick = function () { A.saat = b.dataset.s; ciz(p); }; });
    ic.querySelectorAll("[data-tes]").forEach(function (b) { b.onclick = function () { A.teslim = b.dataset.tes; ciz(p); }; });
    ic.querySelectorAll("[data-e]").forEach(function (c) { c.onchange = function () { var i = A.ekler.indexOf(c.dataset.e); if (c.checked && i < 0) A.ekler.push(c.dataset.e); if (!c.checked && i > -1) A.ekler.splice(i, 1); ciz(p); }; });
    var y = ic.querySelector("#hzYazi"); if (y) y.oninput = function () { A.yazi = y.value; ic.querySelector("#hzOnz").textContent = y.value || "İyi ki doğdun"; };
    var ad = ic.querySelector("#hzAdres"); if (ad) ad.oninput = function () { A.adres = ad.value; alt.querySelector("[data-ileri]").disabled = A.adres.trim().length <= 4; };
    var n = ic.querySelector("#hzAd"); if (n) n.oninput = function () { A.ad = n.value; };
    var g = alt.querySelector("[data-geri]"); if (g) g.onclick = function () { A.adim--; ciz(p); };
    var i = alt.querySelector("[data-ileri]"); if (i) i.onclick = function () { A.adim++; ciz(p); p.querySelector(".hz-kut").scrollTop = 0; };
    var t = alt.querySelector("[data-bitti]"); if (t) t.onclick = function () { p.querySelector(".hz-x").click(); };
  }

  /* ---------- Google yorum karekodu (herkese aynı bağlantı; filtre yok) ---------- */
  H.qr = function (el, boyut) {
    var url = H.isletme.harita;
    function yap() {
      if (!window.qrcode) { el.innerHTML = "<a href='" + url + "' target='_blank' rel='noopener'>Google'da yorum yaz</a>"; return; }
      var q = qrcode(0, "M"); q.addData(url); q.make();
      el.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      var s = el.querySelector("svg"); if (s) { s.style.width = s.style.height = (boyut || 180) + "px"; s.style.display = "block"; s.style.background = "#fff"; }
    }
    if (window.qrcode) yap(); else { var sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"; sc.onload = yap; sc.onerror = yap; document.head.appendChild(sc); }
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-siparis]");
    if (b) { e.preventDefault(); H.siparisAc({ model: b.getAttribute("data-siparis") || null }); }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ornekKatman); else ornekKatman();
})();
