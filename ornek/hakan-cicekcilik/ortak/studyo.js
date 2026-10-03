// Hakan Çiçekçilik · Duygu Stüdyosu (üç tasarım seçeneğinin ortak motoru)
// Kutlama metni üretir, kartı tuval üzerinde çizer (PNG indirilebilir), alıcıya özel animasyonlu "sürpriz sayfası" linki + QR üretir,
// gelin arabası isim tabelası tasarlar, bütçeye göre buket gösterir, özel gün hatırlatıcısı (.ics) oluşturur. Sunucu gerekmez.
(function () {
  "use strict";
  var IS = window.ISLETME = {
    ad: "Hakan Çiçekçilik", kisa: "Hakan Çiçekçilik", ilce: "Korkuteli", tel: "0542 763 45 78", telHam: "905427634578", sabit: "0242 653 52 29",
    adres: "Kiremitli Mah. Burdur Cad. No:1/D, Korkuteli / Antalya",
    harita: "https://www.google.com/maps/search/?api=1&query=Hakan+%C3%87i%C3%A7ek%C3%A7ilik+Korkuteli",
    yorum: "https://www.google.com/maps/search/?api=1&query=Hakan+%C3%87i%C3%A7ek%C3%A7ilik+Korkuteli"
  };
  var KOK = (function () { var s = document.currentScript && document.currentScript.src || ""; return s.replace(/ortak\/studyo\.js.*$/, ""); })();
  var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var wa = function (metin) { return "https://wa.me/" + IS.telHam + "?text=" + encodeURIComponent(metin); };
  IS.wa = wa;

  // ---------- Vesileler ve metinler ----------
  var V = {
    dogum: { ad: "Doğum günü", em: "🎂", baslik: "İyi ki doğdun", renk: ["#ffe1ec", "#ffc2d6", "#d6336c"], efekt: "konfeti", metin: [
      "Sevgili {A}, yeni yaşın sana en güzel çiçekler kadar renkli, en güzel sabahlar kadar umutlu gelsin. İyi ki varsın, iyi ki doğdun! 🎂",
      "{A}, bu çiçekler senin için açtı; çünkü bugün dünyaya bir güzellik daha gelmişti. Nice mutlu, sağlıklı, kahkahalı yaşlara!",
      "Bir yaş daha büyüdün ama gülüşün hep aynı: kocaman ve içten. Doğum günün kutlu olsun sevgili {A}!",
      "Hayatımda olduğun her gün bir hediye {A}. Bugün de sana küçük bir teşekkür gönderiyorum: İyi ki doğdun!",
      "Yeni yaşında dileklerin bir bir gerçek olsun, yüzünden gülümsemen hiç eksik olmasın. Nice yıllara {A}! 🌸"] },
    sevgili: { ad: "Sevgiliye · yıl dönümü", em: "❤️", baslik: "Seni seviyorum", renk: ["#ffe3e3", "#ffb3b3", "#c92a2a"], efekt: "kalp", metin: [
      "{A}, seninle geçen her gün bir buket gibi: her biri ayrı güzel, hepsi birlikte muhteşem. Seni seviyorum. ❤️",
      "Bu güller kırmızı ama yanında olmanın verdiği mutluluğu anlatmaya hiçbir renk yetmez. İyi ki benimsin {A}.",
      "Nice yıllara sevgilim… Seninle başlayan her sabah, hayatımın en güzel çiçeği. ❤️",
      "{A}, kalbimin en güzel köşesi hep senin. Bu çiçekler, sana söyleyemediğim her şeyin küçük bir özeti.",
      "Birlikte geçen her yıl için teşekkür ederim {A}. En güzel yıllarımız daha önümüzde. Seni çok seviyorum."] },
    dugun: { ad: "Düğün · nişan · söz", em: "💍", baslik: "Mutluluğunuz daim olsun", renk: ["#fff6e6", "#f3dfb8", "#a67c2e"], efekt: "yaprak", metin: [
      "Sevgili {A}, bir ömür boyu mutluluk, huzur ve sevgi dileriz. Yuvanız hep çiçek açsın! 💍",
      "Hayatınızın en güzel gününde biz de yanınızdayız. {A}, bir yastıkta kocayın; sevginiz her yıl biraz daha büyüsün.",
      "Bugün iki kalp bir oldu. Yeni yolunuz aydınlık, yuvanız sıcacık olsun sevgili {A}.",
      "{A}, mutluluğunuz bu çiçekler kadar taze, sevginiz bu günkü kadar heyecanlı kalsın. Ömür boyu mutluluklar!"] },
    anne: { ad: "Anneye", em: "🌷", baslik: "İyi ki annemsin", renk: ["#f3f0ff", "#d0bfff", "#7048e8"], efekt: "yaprak", metin: [
      "Canım annem, bana verdiğin sevginin binde birini bu çiçeklerle anlatabilsem ne mutlu. İyi ki varsın! 🌷",
      "{A}, dünyadaki en güzel çiçek her zaman sendin. Ellerinden öperim, iyi ki annemsin.",
      "Bütün güzel günlerimin arkasında sen varsın anneciğim. Seni çok seviyorum.",
      "Annem, sabrın, şefkatin ve duaların için teşekkür ederim. Bu çiçekler senin bahçenden bir parça."] },
    gecmis: { ad: "Geçmiş olsun", em: "🌼", baslik: "Geçmiş olsun", renk: ["#fff9db", "#ffe066", "#e67700"], efekt: "yaprak", metin: [
      "Sevgili {A}, çok geçmiş olsun. Bu çiçekler sana iyi gelsin, en kısa zamanda sapasağlam aramıza dön! 🌼",
      "{A}, şifa dolu günler diliyorum. Güneşli günler çok yakın, sen yeter ki kendine iyi bak.",
      "Hızlıca iyileş {A}! Seni özledik, gülüşün olmadan hiçbir şey aynı değil.",
      "Acil şifalar {A}. Bu sarı çiçekler, odana biraz güneş götürsün diye."] },
    bebek: { ad: "Hoş geldin bebek", em: "👶", baslik: "Hoş geldin bebek", renk: ["#e7f5ff", "#a5d8ff", "#1971c2"], efekt: "yaprak", metin: [
      "Hoş geldin minik {A}! Ailene, sevdiklerine ve dünyaya getirdiğin mutluluk için şimdiden teşekkürler. 👶",
      "Anne ve babaya tebrikler! {A} sağlıkla, mutlulukla, kocaman sevgilerle büyüsün.",
      "Minik ayaklar, kocaman mutluluk… Aramıza hoş geldin {A}! Allah analı babalı büyütsün.",
      "Evinize yeni bir çiçek açtı. {A}, iyi ki geldin!"] },
    tebrik: { ad: "Tebrik · mezuniyet · yeni iş", em: "🎓", baslik: "Tebrikler", renk: ["#e6fcf5", "#96f2d7", "#087f5b"], efekt: "konfeti", metin: [
      "Tebrikler {A}! Emeğinin karşılığını aldın, bu daha başlangıç. Yolun hep açık olsun! 🎓",
      "{A}, bu başarı tamamen senin. Gurur duyuyoruz; nice yeni başarılara!",
      "Yeni işin hayırlı uğurlu olsun {A}! Bereketli, keyifli ve başarılı günler dileriz.",
      "Hayallerinin peşinden gittiğin için tebrikler {A}. Bugün kutlama günü!"] },
    ozur: { ad: "Özür dilerim", em: "🤍", baslik: "Özür dilerim", renk: ["#f8f9fa", "#dee2e6", "#495057"], efekt: "yaprak", metin: [
      "{A}, kalbini kırdıysam özür dilerim. Bu çiçekler, söyleyemediklerimin yerine konuşsun. 🤍",
      "Bazen kelimeler yetmiyor {A}. Seni üzdüğüm için gerçekten üzgünüm; barışalım mı?",
      "{A}, hata bendeydi. Aramızdaki güzellik küçük bir kırgınlıktan çok daha büyük."] },
    tesekkur: { ad: "Teşekkürler", em: "🙏", baslik: "Teşekkür ederim", renk: ["#fff4e6", "#ffd8a8", "#d9480f"], efekt: "yaprak", metin: [
      "Sevgili {A}, her şey için çok teşekkür ederim. İyiliğin hiç unutulmayacak. 🙏",
      "{A}, yanımda olduğun için teşekkürler. Bu çiçekler kalbimden sana küçük bir not.",
      "Emeğine, sabrına, desteğine teşekkürler {A}. İyi ki tanımışım!"] },
    ogretmen: { ad: "Öğretmene", em: "📚", baslik: "Öğretmenler günün kutlu olsun", renk: ["#ebfbee", "#b2f2bb", "#2b8a3e"], efekt: "yaprak", metin: [
      "Sevgili {A}, bize öğrettiğiniz her şey için teşekkürler. Öğretmenler gününüz kutlu olsun! 📚",
      "Işığınızla yolumuzu aydınlattığınız için teşekkür ederiz {A}. İyi ki öğretmenimizsiniz.",
      "{A}, sabrınız ve emeğiniz için minnettarız. Nice mutlu yıllara öğretmenim!"] },
    taziye: { ad: "Başsağlığı", em: "🕊️", baslik: "Başınız sağ olsun", renk: ["#f1f3f5", "#ced4da", "#343a40"], efekt: "yok", metin: [
      "Başınız sağ olsun. Acınızı paylaşıyor, merhuma Allah'tan rahmet, ailesine sabır diliyoruz. 🕊️",
      "Mekânı cennet olsun. {A}, bu zor günde yanınızdayız.",
      "Derin üzüntümüzü paylaşırız. Allah rahmet eylesin, kalanlara sağlık ve sabır versin."] }
  };
  IS.vesileler = V;
  var sira = {};
  function metinUret(v, A, G) {
    var l = V[v].metin; sira[v] = ((sira[v] == null ? Math.floor(Math.random() * l.length) - 1 : sira[v]) + 1) % l.length;
    return l[sira[v]].replace(/\{A\}/g, A || "sevgili dostum").replace(/\{G\}/g, G || "");
  }

  // ---------- Sürpriz sayfası linki ----------
  function b64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function surprizLink(o) { return KOK + "kutla.html#" + b64(JSON.stringify(o)); }
  IS.surprizLink = surprizLink;

  // ---------- Kart çizimi ----------
  function cicek(c, x, y, r, renk, yaprak, aci) {
    c.save(); c.translate(x, y); c.rotate(aci || 0);
    for (var i = 0; i < yaprak; i++) { c.rotate(Math.PI * 2 / yaprak); c.beginPath(); c.ellipse(0, -r * .55, r * .32, r * .55, 0, 0, Math.PI * 2); c.fillStyle = renk; c.globalAlpha = .9; c.fill(); }
    c.globalAlpha = 1; c.beginPath(); c.arc(0, 0, r * .22, 0, Math.PI * 2); c.fillStyle = "#ffd43b"; c.fill(); c.restore();
  }
  function sar(c, metin, x, y, gen, satir) {
    var kel = metin.split(" "), s = "", sat = [];
    kel.forEach(function (k) { var d = s ? s + " " + k : k; if (c.measureText(d).width > gen && s) { sat.push(s); s = k; } else s = d; });
    if (s) sat.push(s); sat.forEach(function (t, i) { c.fillText(t, x, y + i * satir); }); return sat.length;
  }
  function kartCiz(tuval, o, qrTuval) {
    var c = tuval.getContext("2d"), W = tuval.width = 1080, H = tuval.height = 1350, t = V[o.v] || V.dogum, R = t.renk;
    var g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, R[0]); g.addColorStop(1, R[1]); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // çiçek çelengi (tohumlu rastgele: aynı kart hep aynı görünür)
    var tohum = (o.A || "x").length * 97 + (o.v || "").length * 31; var rnd = function () { tohum = (tohum * 9301 + 49297) % 233280; return tohum / 233280; };
    var pal = [R[2], "#ffffff", R[1], "#f783ac", "#ffa8a8"];
    for (var i = 0; i < 26; i++) { var kenar = i % 2 ? rnd() * 120 : H - rnd() * 120, xx = rnd() * W; cicek(c, xx, kenar, 40 + rnd() * 50, pal[i % pal.length], 5 + (i % 3), rnd() * 3); }
    c.fillStyle = "rgba(255,255,255,.9)"; var p = 80; c.beginPath(); c.roundRect ? c.roundRect(p, 170, W - p * 2, H - 340, 40) : c.rect(p, 170, W - p * 2, H - 340); c.fill();
    c.textAlign = "center"; c.fillStyle = R[2];
    c.font = "600 34px Manrope, sans-serif"; c.fillText((t.em + "  " + t.baslik.toLocaleUpperCase("tr")).trim(), W / 2, 260);
    c.font = "96px 'Great Vibes', cursive"; c.fillStyle = "#212529"; c.fillText(o.A || "", W / 2, 380);
    c.font = "italic 42px 'Cormorant Garamond', serif"; c.fillStyle = "#343a40";
    var n = sar(c, o.m || "", W / 2, 470, W - p * 2 - 120, 56);
    c.font = "600 36px 'Cormorant Garamond', serif"; c.fillStyle = R[2]; if (o.G) c.fillText("— " + o.G, W / 2, 490 + n * 56 + 30);
    if (qrTuval) { c.drawImage(qrTuval, W / 2 - 110, H - 560, 220, 220); c.font = "600 24px Manrope, sans-serif"; c.fillStyle = "#495057"; c.fillText("📱 Okut, sürprizini aç ✨", W / 2, H - 305); }
    c.font = "700 28px Manrope, sans-serif"; c.fillStyle = "#212529"; c.fillText(IS.ad + " · " + IS.ilce, W / 2, H - 250);
    c.font = "500 22px Manrope, sans-serif"; c.fillStyle = "#495057"; c.fillText("7/24 açık · " + IS.tel, W / 2, H - 212);
  }
  IS.kartCiz = kartCiz;
  function qrYap(metin, cb) {
    if (!window.QRCode) { cb(null); return; }
    var d = document.createElement("div"); new window.QRCode(d, { text: metin, width: 320, height: 320, correctLevel: window.QRCode.CorrectLevel.M });
    setTimeout(function () { cb(d.querySelector("canvas")); }, 60);
  }
  function indir(tuval, ad) { var a = document.createElement("a"); a.download = ad; a.href = tuval.toDataURL("image/png"); a.click(); }

  // ---------- Duygu Stüdyosu bölümü ----------
  function studyoKur(k) {
    var sec = $(".dst-vesile", k), A = $(".dst-alici", k), G = $(".dst-gonderen", k), M = $(".dst-mesaj", k), tv = $(".dst-tuval", k), v = "dogum", qr = null;
    sec.innerHTML = Object.keys(V).map(function (x) { return '<button type="button" data-v="' + x + '"' + (x === v ? ' class="on"' : "") + ">" + V[x].em + " " + V[x].ad + "</button>"; }).join("");
    function ciz() {
      var o = { v: v, A: A.value.trim() || "Ayşe", G: G.value.trim(), m: M.value.trim() };
      var link = surprizLink(o); $(".dst-link", k).href = link; k.dataset.link = link;
      qrYap(link, function (q) { qr = q; kartCiz(tv, o, q); });
    }
    function yeniMetin() { M.value = metinUret(v, A.value.trim() || "Ayşe", G.value.trim()); ciz(); }
    sec.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; v = b.dataset.v; $$("button", sec).forEach(function (x) { x.classList.toggle("on", x === b); }); yeniMetin(); });
    $(".dst-yeni", k).onclick = yeniMetin;
    [A, G].forEach(function (i) { i.addEventListener("input", function () { M.value = metinUret(v, A.value.trim() || "Ayşe", G.value.trim()); sira[v] = (sira[v] + V[v].metin.length - 1) % V[v].metin.length; ciz(); }); });
    M.addEventListener("input", ciz);
    $(".dst-indir", k).onclick = function () { indir(tv, "kart-" + (A.value.trim() || "kutlama") + ".png"); };
    $(".dst-siparis", k).onclick = function () {
      location.href = wa("Merhaba, Duygu Stüdyosu'ndan sipariş vermek istiyorum.\nVesile: " + V[v].ad + "\nAlıcı: " + (A.value.trim() || "-") + "\nKart mesajı: " + M.value.trim() + "\nSürpriz sayfası: " + k.dataset.link + "\nBütçem: ");
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(yeniMetin);
  }

  // ---------- Bütçene göre buket ----------
  var BUTCE = [
    { tl: 750, ad: "Mini Mevsim Buketi", ic: "5–7 dal mevsim çiçeği (papatya, kasımpatı), kraft kâğıt, kurdele", foto: "f4.jpg" },
    { tl: 1250, ad: "Orta Boy Renkli Buket", ic: "Karışık mevsim çiçekleri, yeşillik, şık ambalaj ve kart", foto: "f2.jpg" },
    { tl: 2000, ad: "Gül Buketi", ic: "Kırmızı ya da pembe güller, okaliptüs, özel ambalaj ve kart", foto: "f10.jpg" },
    { tl: 3000, ad: "Büyük Karışık Buket", ic: "Gül, lilyum ve mevsim çiçekleri; gösterişli büyük boy", foto: "f7.jpg" },
    { tl: 5000, ad: "Gösterişli Özel Tasarım", ic: "Bol güllü ya da orkideli özel tasarım, isimli kurdele, Duygu Stüdyosu kartı", foto: "f5.jpg" }
  ];
  function butceKur(k) {
    var r = $(".bt-aralik", k), fmt = function (n) { return n.toLocaleString("tr-TR") + " TL"; };
    function goster() {
      var b = +r.value, s = BUTCE.filter(function (x) { return x.tl <= b; }).pop() || BUTCE[0];
      $(".bt-tutar", k).textContent = fmt(b); $(".bt-ad", k).textContent = s.ad; $(".bt-ic", k).textContent = s.ic;
      $(".bt-foto", k).src = KOK + "img/" + s.foto; $(".bt-fiyat", k).textContent = fmt(s.tl) + " ve üzeri";
      $(".bt-siparis", k).href = wa("Merhaba, " + fmt(b) + " bütçeyle \"" + s.ad + "\" istiyorum. Fiyat net mi, ne zaman teslim edilir?");
    }
    r.addEventListener("input", goster); goster();
  }

  // ---------- Gelin arabası tabelası ----------
  var STIL = {
    klasik: { bg: ["#ffffff", "#fff8eb"], cerceve: "#b08d3c", yazi: "#3b2f1a", alt: "#8a6d2b", cicek: ["#ffffff", "#f8e7c4"] },
    romantik: { bg: ["#fff0f6", "#ffd6e7"], cerceve: "#e64980", yazi: "#5c1a33", alt: "#c2255c", cicek: ["#ff8fab", "#ffffff"] },
    modern: { bg: ["#151515", "#2b2b2b"], cerceve: "#d4af37", yazi: "#f8f1df", alt: "#d4af37", cicek: ["#d4af37", "#f8f1df"] }
  };
  function tabelaCiz(tv, o) {
    var c = tv.getContext("2d"), W = tv.width = 1500, H = tv.height = 420, s = STIL[o.stil] || STIL.klasik;
    var g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, s.bg[0]); g.addColorStop(1, s.bg[1]); c.fillStyle = g;
    c.beginPath(); c.roundRect ? c.roundRect(10, 10, W - 20, H - 20, 60) : c.rect(10, 10, W - 20, H - 20); c.fill();
    c.lineWidth = 8; c.strokeStyle = s.cerceve; c.stroke(); c.lineWidth = 2; c.beginPath(); c.roundRect ? c.roundRect(34, 34, W - 68, H - 68, 44) : c.rect(34, 34, W - 68, H - 68); c.stroke();
    [[120, 210], [W - 120, 210]].forEach(function (p, j) { for (var i = 0; i < 4; i++) cicek(c, p[0] + (i % 2 ? 30 : -20) * (j ? -1 : 1), p[1] - 90 + i * 60, 34, s.cicek[i % 2], 6, i); });
    c.textAlign = "center"; c.fillStyle = s.yazi; c.font = "150px 'Great Vibes', cursive";
    var ad = (o.a1 || "Ayşe") + " & " + (o.a2 || "Mehmet"); var fs = 150; while (c.measureText(ad).width > W - 380 && fs > 70) { fs -= 6; c.font = fs + "px 'Great Vibes', cursive"; }
    c.fillText(ad, W / 2, 245); c.fillStyle = s.alt; c.font = "600 40px 'Cormorant Garamond', serif";
    c.fillText((o.alt || "Mutluluğa giden yolda") + (o.tarih ? "  ·  " + o.tarih : ""), W / 2, 330);
  }
  function tabelaKur(k) {
    var tv = $(".gt-tuval", k), stil = "klasik";
    var oku = function () { return { a1: $(".gt-a1", k).value.trim(), a2: $(".gt-a2", k).value.trim(), tarih: $(".gt-tarih", k).value.trim(), alt: $(".gt-alt", k).value.trim(), stil: stil }; };
    var ciz = function () { tabelaCiz(tv, oku()); };
    $$("input", k).forEach(function (i) { i.addEventListener("input", ciz); });
    $(".gt-stil", k).addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; stil = b.dataset.s; $$("button", this).forEach(function (x) { x.classList.toggle("on", x === b); }); ciz(); });
    $(".gt-indir", k).onclick = function () { indir(tv, "gelin-arabasi-tabela.png"); };
    $(".gt-siparis", k).onclick = function () { var o = oku(); location.href = wa("Merhaba, gelin arabası süslemesi istiyorum.\nİsimler: " + (o.a1 || "-") + " & " + (o.a2 || "-") + "\nTarih: " + (o.tarih || "-") + "\nTabela stili: " + stil + "\nAlt yazı: " + (o.alt || "Mutluluğa giden yolda")); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ciz);
  }

  // ---------- Özel gün hatırlatıcı (.ics + dükkâna bildirim) ----------
  function hatirlatKur(k) {
    $(".oh-form", k).addEventListener("submit", function (e) {
      e.preventDefault();
      var kim = $(".oh-kim", k).value.trim(), ne = $(".oh-ne", k).value, t = $(".oh-tarih", k).value; if (!kim || !t) return;
      var d = t.replace(/-/g, ""), son = new Date(t); son.setDate(son.getDate() + 1); var d2 = son.toISOString().slice(0, 10).replace(/-/g, "");
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hakan Cicekcilik//TR", "BEGIN:VEVENT", "UID:" + Date.now() + "@hakancicekcilik", "DTSTART;VALUE=DATE:" + d, "DTEND;VALUE=DATE:" + d2, "RRULE:FREQ=YEARLY",
        "SUMMARY:" + kim + " · " + ne + " 🌸", "DESCRIPTION:Çiçek siparişi için: " + IS.ad + " " + IS.tel + " (WhatsApp)", "BEGIN:VALARM", "TRIGGER:-P2D", "ACTION:DISPLAY", "DESCRIPTION:2 gün sonra " + kim + " için " + ne + "! Çiçeğini şimdiden ayırt.", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "hatirlatma-" + kim.replace(/\s+/g, "-") + ".ics"; a.click();
      $(".oh-sonuc", k).innerHTML = "✓ Takviminize eklendi; her yıl 2 gün önce hatırlatılacak. <a href='" + wa("Merhaba, özel gün listenize ekler misiniz?\nKim: " + kim + "\nVesile: " + ne + "\nTarih: " + t + "\n2 gün önce bana hatırlatın lütfen.") + "'>Dükkâna da bildir, o gün bizden mesaj gelsin →</a>";
    });
  }

  // ---------- Fırsat Köşesi: tazeliği geçmek üzere olan çiçekler indirimli ----------
  // Panelden (panel/ · Fırsat Köşesi) eklenen ürünler localStorage "hc-firsat" anahtarında; canlı sistemde veritabanından gelir.
  var FIRSAT_ORNEK = [
    { id: "o1", ad: "Kırmızı gül demeti (10 dal)", eski: 1200, yeni: 650, foto: "f10.jpg", son: "Bugün 21:00'e kadar", adet: 3 },
    { id: "o2", ad: "Karışık mevsim buketi", eski: 900, yeni: 450, foto: "f4.jpg", son: "Yarın öğlene kadar", adet: 2 },
    { id: "o3", ad: "Saksı sukulent seti", eski: 600, yeni: 350, foto: "f6.jpg", son: "Stoklar bitene kadar", adet: 5 }
  ];
  function firsatlar() { try { var l = JSON.parse(localStorage.getItem("hc-firsat") || "null"); if (Array.isArray(l) && l.length) return l; } catch (e) {} return FIRSAT_ORNEK; }
  IS.firsatlar = firsatlar; IS.FIRSAT_ORNEK = FIRSAT_ORNEK;
  function firsatKur(k) {
    var l = firsatlar(), fmt = function (n) { return (+n).toLocaleString("tr-TR") + " TL"; };
    $(".fk-liste", k).innerHTML = l.map(function (f) {
      var ind = f.eski ? Math.round((1 - f.yeni / f.eski) * 100) : 0, src = /^data:|^https?:/.test(f.foto) ? f.foto : KOK + "img/" + (f.foto || "f2.jpg");
      return '<div class="fk-kart"><div class="fk-gorsel"><img src="' + src + '" alt="" loading="lazy">' + (ind ? '<span class="fk-ind">-%' + ind + "</span>" : "") + '</div><div class="fk-ic"><b>' + f.ad + '</b><div class="fk-fiyat">' + (f.eski ? "<s>" + fmt(f.eski) + "</s> " : "") + "<strong>" + fmt(f.yeni) + "</strong></div><small>⏳ " + (f.son || "Stoklar bitene kadar") + (f.adet ? " · " + f.adet + " adet" : "") + '</small><a class="fk-al" href="' + wa("Merhaba, Fırsat Köşesi'ndeki \"" + f.ad + "\" (" + fmt(f.yeni) + ") ürününü ayırır mısınız?") + '">Hemen ayırt →</a></div></div>';
    }).join("");
    var kat = $(".fk-katil", k); if (kat) kat.href = wa("Merhaba, Fırsat Köşesi'ne yeni ürün gelince bana WhatsApp'tan haber verir misiniz?");
  }

  // ---------- Ortak küçük parçalar ----------
  document.addEventListener("DOMContentLoaded", function () {
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.dataset.wa || "Merhaba, çiçek siparişi vermek istiyorum."); });
    $$("[data-tel]").forEach(function (a) { a.href = "tel:+" + IS.telHam; });
    $$("[data-harita]").forEach(function (a) { a.href = IS.harita; });
    $$(".dst").forEach(studyoKur); $$(".bt").forEach(butceKur); $$(".gt").forEach(tabelaKur); $$(".oh").forEach(hatirlatKur); $$(".fk").forEach(firsatKur);
    // Görününce yumuşak giriş
    if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("gor"); io.unobserve(x.target); } }); }, { threshold: .12 }); $$(".bel").forEach(function (x) { io.observe(x); }); }
    else $$(".bel").forEach(function (x) { x.classList.add("gor"); });
  });
})();
