/* Altera Global prototipi · karsilama.js (İşçi A)
   - Sekme geçişi (Uygunluk Testi / Firma Paneli) → window "altera:sekme" {sekme}
   - #basla ve [data-basla] → window "altera:test-basla"
   - Nokta haritası + İstanbul çıkışlı animasyonlu rotalar (saf SVG)
   - Sayaçlar, paralaks, bölüm giriş animasyonları, kaydırma çubuğu
   prefers-reduced-motion açıksa: rotalar çizili, uçuş noktası yok, paralaks yok, her şey görünür. */
(function () {
  "use strict";
  var d = document, w = window;
  var azHareket = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function yay(ad, detay) {
    var e; try { e = new CustomEvent(ad, { detail: detay }); } catch (x) { e = d.createEvent("CustomEvent"); e.initCustomEvent(ad, false, false, detay); }
    w.dispatchEvent(e);
  }
  var I = w.AI18N || { t: function (k) { return k; }, ekle: function () {}, uygula: function () {}, dil: "tr", diller: [], ayarla: function () {} };

  /* ---------------- Sözlük (önek k.) ---------------- */
  I.ekle({
    tr: {
      "k.title": "Altera Global · Yurt Dışı Uygunluk Testi (ÖRNEK · Dijitabela)",
      "k.meta": "7 kısa soruyla yurt dışı yol haritanızı görün: EB-5, Blue Card, çalışma ve öğrenci vizesi, ret sonrası yeniden başvuru. Ön değerlendirme; kesin bilgi danışmanla.",
      "k.atla": "İçeriğe geç", "k.basaDon": "Altera Global · başa dön", "k.markaAlt": "Global · Yurt dışı danışmanlık",
      "k.gorunumSec": "Görünüm seç", "k.sekmeTest": "Uygunluk Testi", "k.sekmeTestK": "Test", "k.sekmePanel": "Firma Paneli", "k.sekmePanelK": "Panel",
      "k.dilSec": "Dil seç", "k.yakinda": "yakında",
      "k.rozet": "ÖRNEK · Dijitabela", "k.rozetBaslik": "Bu sayfa Dijitabela tarafından hazırlanmış örnek tasarımdır",
      "k.heroAlt": "Gökdelen ofisinden New York silueti ve masada dizüstü bilgisayar",
      "k.heroEtiket": "Ücretsiz ön değerlendirme · ABD & AB",
      "k.h1a": "2 dakikada", "k.h1b": "yurt dışı <em>yol</em>", "k.h1c": "<em>haritanızı</em> görün",
      "k.heroMetin": "7 kısa soruyu yanıtlayın; profilinize uyan programları, <b>tahmini süreç adımlarını</b> ve <b>hazırlamanız gereken belgeleri</b> tek ekranda görün. Ekibimiz eski konsolosluk ve elçilik çalışanlarından oluşur.",
      "k.basla": "Teste başla", "k.nasilDugme": "Nasıl çalışır?",
      "k.heroNot": "Sonuç bir ön değerlendirmedir; kesin bilgi danışmanla netleşir.",
      "k.binisAria": "Örnek yol haritası kartı", "k.binisBas": "Yol haritası",
      "k.c.ist": "İstanbul", "k.c.nyc": "New York", "k.c.yyz": "Toronto", "k.c.mia": "Miami", "k.c.lis": "Lizbon", "k.c.ams": "Amsterdam", "k.c.fra": "Frankfurt", "k.c.ber": "Berlin",
      "k.u.abd": "ABD", "k.u.de": "Almanya", "k.u.nl": "Hollanda", "k.u.ab": "AB",
      "k.bSoru": "Soru", "k.bSure": "Süre", "k.bSureD": "~2 dk", "k.bProg": "Program", "k.bProgD": "5 alan",
      "k.haritaBas": "İstanbul'dan <span>ABD ve Avrupa'ya</span> rotanız", "k.lejAbd": "ABD hatları", "k.lejAb": "AB hatları",
      "k.haritaTitle": "Rota haritası",
      "k.haritaDesc": "İstanbul'dan New York, Miami, Toronto, Amsterdam, Berlin, Frankfurt ve Lizbon'a uzanan uçuş hatları.",
      "k.s1a": "kısa soru", "k.s1b": "büyük düğmeler", "k.s2a": "dakika", "k.s2b": "yaklaşık süre", "k.s3a": "program alanı", "k.s3b": "size göre sıralı",
      "k.s4": "Sonuçta gerekçeli program önerileri ve belge listesi.", "k.s4d": "Alanları gör",
      "k.serit1": "<b>IST → JFK</b> EB-5 · Green Card yolu", "k.serit2": "<b>IST → BER</b> Blue Card", "k.serit3": "<b>IST → AMS</b> Çalışma vizesi",
      "k.serit4": "<b>IST → FRA</b> Öğrenci vizesi", "k.serit5": "<b>IST → MIA</b> Ret sonrası yeniden başvuru", "k.serit6": "<b>IST → YYZ</b> Ön değerlendirme",
      "k.nasilEtiket": "Nasıl çalışır", "k.nasilBas": "Kimseyi aramadan önce <em>nerede durduğunuzu</em> görün",
      "k.nasilMetin": "Üç adım. Telefonda da rahat; yazı yazmanız gerekmez, büyük düğmelerle seçersiniz.",
      "k.a1h": "Profilinizi anlatın", "k.a1p": "Amacınız, hedef bölge, yaş, eğitim, dil seviyesi ve bütçe aralığınız. Tutar sorulmaz; yalnız aralık seçersiniz.", "k.a1s": "7 soru · ~2 dakika",
      "k.a2h": "Yol haritanızı görün", "k.a2p": "Size uyan programlar puanlı ve gerekçeli sıralanır; her biri için tahmini süreç adımları ve belge listesi açılır.", "k.a2s": "Gerekçeli öneri",
      "k.a3h": "Danışmanla netleştirin", "k.a3p": "Adınızı ve telefonunuzu bırakın; danışmanınız sonuçlarınızı sizinle birlikte değerlendirsin.", "k.a3s": "Ön değerlendirme → görüşme",
      "k.bantEtiket": "Ekibimiz", "k.bantSoz": "Dosyanız, konsolosluğun <em>öbür tarafını</em> bilen bir ekipten geçer.",
      "k.bantKaynak": "Altera Global · eski konsolosluk ve elçilik çalışanlarından oluşan ekip",
      "k.alanEtiket": "Hizmet alanları", "k.alanBas": "Beş yol, <em>tek</em> ön değerlendirme",
      "k.alanMetin": "Test, cevaplarınıza göre bu alanlardan size en yakın olanları öne çıkarır. Hangi yolun uygun olduğuna danışmanla birlikte karar verirsiniz.",
      "k.eb5.h": "EB-5 Yatırımcı", "k.eb5.s": "ABD · Green Card yolu", "k.eb5.p": "Yatırım yoluyla ABD'de daimi oturum (Green Card) yolu. Aile başvuruya dahil edilebilir; vatandaşlık ileride ayrı bir süreçtir.",
      "k.bluecard.h": "Blue Card", "k.bluecard.s": "AB · nitelikli çalışan", "k.bluecard.p": "Üniversite mezunu ve iş teklifi olan nitelikli çalışanlar için Avrupa Birliği'nde çalışma ve oturum izni.",
      "k.calisma.h": "Çalışma vizesi", "k.calisma.s": "ABD & AB · iş teklifiyle", "k.calisma.p": "İşveren teklifine dayanan çalışma izni; meslek, ülke ve kota uygunluğu dosya öncesinde kontrol edilir.",
      "k.ogrenci.h": "Öğrenci vizesi", "k.ogrenci.s": "Lisans · yüksek lisans · dil", "k.ogrenci.p": "Okul ve bölüm seçiminden kabul mektubuna, mali yeterlilik belgelerinden vize görüşmesi hazırlığına kadar.",
      "k.ret.h": "Ret sonrası yeniden başvuru", "k.ret.s": "Gerekçe incelemesi", "k.ret.p": "Ret mektubundaki gerekçe incelenir, eksik ve riskli noktalar belirlenir, dosya yeniden kurgulanır.",
      "k.alanDipnot": "Hiçbir program için onay ya da sonuç vaadi verilmez; karar ilgili makamlara aittir. Test sonucu bir ön değerlendirmedir.",
      "k.sonEtiket": "Hazır olduğunuzda", "k.sonBas": "Rotanızı <em>bugün</em> çizin",
      "k.sonMetin": "Yedi soru, yaklaşık iki dakika. Sonunda size uyan programları, adımları ve belge listesini görürsünüz.",
      "k.altMetin": "Yurt dışına yerleşmek, çalışmak ve eğitim almak isteyen bireylere ve ailelere danışmanlık.",
      "k.altNot": "<b>Ön değerlendirme notu.</b> Bu test genel bir yön gösterir; kesin sonuç, onay ya da garanti değildir. Kesin bilgi için danışmanla görüşün. Bu örnek sayfada form ve mesajlar gerçek olarak gönderilmez.",
      "k.altOrnek": "Bu sayfa Altera Global için hazırlanmış örnek tasarımdır · Tasarım: Dijitabela",
      "k.altKredi": "Tasarım: Dijitabela · dijitabela.com"
    },
    en: {
      "k.title": "Altera Global · Immigration Eligibility Check (SAMPLE · Dijitabela)",
      "k.meta": "Answer 7 short questions and see your route abroad: EB-5, EU Blue Card, work and student visas, reapplying after a refusal. A preliminary assessment; your consultant confirms the details.",
      "k.atla": "Skip to content", "k.basaDon": "Altera Global · back to top", "k.markaAlt": "Global · Immigration advisory",
      "k.gorunumSec": "Choose a view", "k.sekmeTest": "Eligibility Check", "k.sekmeTestK": "Check", "k.sekmePanel": "Firm Dashboard", "k.sekmePanelK": "Dashboard",
      "k.dilSec": "Choose language", "k.yakinda": "soon",
      "k.rozet": "SAMPLE · Dijitabela", "k.rozetBaslik": "This page is a sample design prepared by Dijitabela",
      "k.heroAlt": "New York skyline seen from a high-rise office, with a laptop on the desk",
      "k.heroEtiket": "Free preliminary assessment · USA & EU",
      "k.h1a": "Your path abroad,", "k.h1b": "<em>mapped</em> in", "k.h1c": "two minutes",
      "k.heroMetin": "Answer 7 short questions to see the programmes that fit your profile, <b>an estimated step-by-step process</b> and <b>the documents you will need</b>, all on one screen. Our team is made up of former consulate and embassy staff.",
      "k.basla": "Start the check", "k.nasilDugme": "How it works",
      "k.heroNot": "Results are a preliminary assessment; your consultant confirms the details.",
      "k.binisAria": "Sample route card", "k.binisBas": "Route map",
      "k.c.ist": "Istanbul", "k.c.nyc": "New York", "k.c.yyz": "Toronto", "k.c.mia": "Miami", "k.c.lis": "Lisbon", "k.c.ams": "Amsterdam", "k.c.fra": "Frankfurt", "k.c.ber": "Berlin",
      "k.u.abd": "USA", "k.u.de": "Germany", "k.u.nl": "Netherlands", "k.u.ab": "EU",
      "k.bSoru": "Questions", "k.bSure": "Time", "k.bSureD": "~2 min", "k.bProg": "Programmes", "k.bProgD": "5 areas",
      "k.haritaBas": "From Istanbul to <span>the USA and Europe</span>", "k.lejAbd": "US routes", "k.lejAb": "EU routes",
      "k.haritaTitle": "Route map",
      "k.haritaDesc": "Flight routes from Istanbul to New York, Miami, Toronto, Amsterdam, Berlin, Frankfurt and Lisbon.",
      "k.s1a": "short questions", "k.s1b": "tap to answer", "k.s2a": "minutes", "k.s2b": "approximate time", "k.s3a": "programme areas", "k.s3b": "ranked for you",
      "k.s4": "Results include reasoned programme suggestions and a document checklist.", "k.s4d": "See the areas",
      "k.serit1": "<b>IST → JFK</b> EB-5 · Green Card route", "k.serit2": "<b>IST → BER</b> EU Blue Card", "k.serit3": "<b>IST → AMS</b> Work visa",
      "k.serit4": "<b>IST → FRA</b> Student visa", "k.serit5": "<b>IST → MIA</b> Reapplying after refusal", "k.serit6": "<b>IST → YYZ</b> Preliminary assessment",
      "k.nasilEtiket": "How it works", "k.nasilBas": "See <em>where you stand</em> before you call anyone",
      "k.nasilMetin": "Three steps. Easy on a phone, with no typing: you choose with large buttons.",
      "k.a1h": "Tell us about yourself", "k.a1p": "Your goal, target region, age, education, language level and budget range. No amounts are asked, only a range.", "k.a1s": "7 questions · ~2 minutes",
      "k.a2h": "See your route", "k.a2p": "Programmes that fit you are ranked with a score and the reasoning behind it; each opens an estimated process and a document list.", "k.a2s": "Reasoned suggestions",
      "k.a3h": "Confirm with a consultant", "k.a3p": "Leave your name and phone number and your consultant will go through the results with you.", "k.a3s": "Assessment → consultation",
      "k.bantEtiket": "Our team", "k.bantSoz": "Your file is handled by people who know <em>the other side</em> of the consulate desk.",
      "k.bantKaynak": "Altera Global · a team of former consulate and embassy staff",
      "k.alanEtiket": "Areas of practice", "k.alanBas": "Five routes, <em>one</em> assessment",
      "k.alanMetin": "The check brings forward the areas closest to your answers. You decide which route is right together with your consultant.",
      "k.eb5.h": "EB-5 Investor", "k.eb5.s": "USA · Green Card route", "k.eb5.p": "A route to permanent residence (Green Card) in the US through investment. Family members can be included; citizenship is a separate process later on.",
      "k.bluecard.h": "EU Blue Card", "k.bluecard.s": "EU · skilled professionals", "k.bluecard.p": "A work and residence permit in the European Union for university graduates with a qualifying job offer.",
      "k.calisma.h": "Work visa", "k.calisma.s": "USA & EU · with a job offer", "k.calisma.p": "Work authorisation based on an employer's offer; occupation, country and quota eligibility are checked before the file is built.",
      "k.ogrenci.h": "Student visa", "k.ogrenci.s": "Bachelor's · Master's · language", "k.ogrenci.p": "From choosing a school and course to the acceptance letter, proof of funds and visa interview preparation.",
      "k.ret.h": "Reapplying after a refusal", "k.ret.s": "Refusal review", "k.ret.p": "The grounds in your refusal letter are reviewed, gaps and risks identified, and the file rebuilt.",
      "k.alanDipnot": "No approval or outcome is promised for any programme; decisions rest with the relevant authorities. The check result is a preliminary assessment.",
      "k.sonEtiket": "When you're ready", "k.sonBas": "Map your route <em>today</em>",
      "k.sonMetin": "Seven questions, about two minutes. At the end you will see the programmes, steps and documents that fit you.",
      "k.altMetin": "Advisory for individuals and families who want to live, work or study abroad.",
      "k.altNot": "<b>About this assessment.</b> The check gives general direction; it is not a final result, approval or guarantee. Speak to a consultant for definitive advice. On this sample page, forms and messages are not actually sent.",
      "k.altOrnek": "This page is a sample design prepared for Altera Global · Design: Dijitabela",
      "k.altKredi": "Design: Dijitabela · dijitabela.com"
    }
  });

  /* ---------------- Dil seçici ---------------- */
  var dilDugme = $("#dil-dugme"), dilMenu = $("#dil-menu"), dilEtiket = $("#dil-etiket");
  function dilMenuCiz() {
    if (!dilMenu) return;
    dilMenu.innerHTML = "";
    (I.diller || []).forEach(function (x) {
      var li = d.createElement("li"); li.setAttribute("role", "none");
      var b = d.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitemradio");
      b.setAttribute("data-dil", x.kod); b.setAttribute("lang", x.kod);
      b.setAttribute("aria-checked", x.kod === I.dil ? "true" : "false");
      var kod = d.createElement("b"); kod.textContent = x.kod.toUpperCase();
      var ad = d.createElement("span"); ad.textContent = x.ad; if (x.kod === "ar") ad.dir = "rtl";
      b.appendChild(kod); b.appendChild(ad);
      if (!x.etkin) {
        b.setAttribute("aria-disabled", "true"); b.classList.add("pasif");
        var y = d.createElement("small"); y.setAttribute("data-i18n", "k.yakinda"); y.textContent = I.t("k.yakinda"); b.appendChild(y);
      }
      li.appendChild(b); dilMenu.appendChild(li);
    });
    if (dilEtiket) dilEtiket.textContent = (I.dil || "tr").toUpperCase();
  }
  function dilMenuAc(ac) {
    if (!dilMenu) return;
    dilMenu.hidden = !ac; dilDugme.setAttribute("aria-expanded", ac ? "true" : "false");
    if (ac) { var s = $('[aria-checked="true"]', dilMenu) || $("button", dilMenu); if (s) s.focus(); }
  }
  if (dilDugme && dilMenu) {
    dilMenuCiz();
    dilDugme.addEventListener("click", function (e) { e.stopPropagation(); dilMenuAc(dilMenu.hidden); });
    dilMenu.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-dil]"); if (!b) return;
      if (b.getAttribute("aria-disabled") === "true") { b.classList.remove("titre"); void b.offsetWidth; b.classList.add("titre"); return; }
      I.ayarla(b.getAttribute("data-dil")); dilMenuAc(false); dilDugme.focus();
    });
    dilMenu.addEventListener("keydown", function (e) {
      var l = $$("button", dilMenu), i = l.indexOf(d.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); l[(i + 1) % l.length].focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); l[(i - 1 + l.length) % l.length].focus(); }
      else if (e.key === "Escape" || e.key === "Tab") { dilMenuAc(false); if (e.key === "Escape") dilDugme.focus(); }
    });
    d.addEventListener("click", function (e) { if (!dilMenu.hidden && !e.target.closest("#dil-secici")) dilMenuAc(false); });
  }
  w.addEventListener("altera:dil", function () {
    dilMenuCiz();
    requestAnimationFrame(function () { isikKonum(); });
  });

  /* ---------------- Sekmeler ---------------- */
  var sekmeler = $$('#ust [data-sekme]');
  var isik = $(".sekme-isik");
  var aktifSekme = "musteri";
  function isikKonum() {
    var b = $('#ust [data-sekme][aria-selected="true"]'); if (!b || !isik) return;
    isik.style.transform = "translateX(" + (b.offsetLeft - 4) + "px) scaleX(" + (b.offsetWidth / 100).toFixed(4) + ")";
  }
  function sekmeAc(ad, odak) {
    if (ad !== "musteri" && ad !== "panel") return;
    var degisti = ad !== aktifSekme;
    aktifSekme = ad;
    sekmeler.forEach(function (b) {
      var on = b.getAttribute("data-sekme") === ad;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      if (on && odak) b.focus();
    });
    var gm = $("#gorunum-musteri"), gp = $("#gorunum-panel");
    gm.hidden = ad !== "musteri"; gp.hidden = ad !== "panel";
    var acik = ad === "musteri" ? gm : gp;
    acik.classList.remove("gorunum-gir"); void acik.offsetWidth; acik.classList.add("gorunum-gir");
    isikKonum();
    try { history.replaceState(null, "", ad === "panel" ? "#panel" : location.pathname + location.search); } catch (x) {}
    if (degisti) w.scrollTo(0, 0);
    yay("altera:sekme", { sekme: ad });
    kaydirmaGuncelle();
  }
  w.alteraSekme = function (ad) { sekmeAc(ad, false); };
  sekmeler.forEach(function (b, i) {
    b.addEventListener("click", function () { sekmeAc(b.getAttribute("data-sekme"), false); });
    b.addEventListener("keydown", function (e) {
      var k = e.key, j = -1;
      if (k === "ArrowRight") j = (i + 1) % sekmeler.length;
      else if (k === "ArrowLeft") j = (i - 1 + sekmeler.length) % sekmeler.length;
      else if (k === "Home") j = 0; else if (k === "End") j = sekmeler.length - 1;
      if (j > -1) { e.preventDefault(); sekmeAc(sekmeler[j].getAttribute("data-sekme"), true); }
    });
  });
  w.addEventListener("resize", isikKonum);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(isikKonum);

  /* ---------------- Teste başla ---------------- */
  function basla(e) {
    if (e) e.preventDefault();
    if (aktifSekme !== "musteri") sekmeAc("musteri", false);
    yay("altera:test-basla", {});
  }
  var bd = $("#basla"); if (bd) bd.addEventListener("click", basla);
  $$("[data-basla]").forEach(function (b) { b.addEventListener("click", basla); });

  /* ---------------- Nokta haritası ----------------
     Eşdikdörtgen izdüşüm: boylam -110…45, enlem 65…20, 2,5° adım → 62 × 19 nokta (viewBox 620×190). */
  var NS = "http://www.w3.org/2000/svg";
  function el(ad, at, ebeveyn) { var n = d.createElementNS(NS, ad); for (var k in at) n.setAttribute(k, at[k]); if (ebeveyn) ebeveyn.appendChild(n); return n; }
  function xy(lon, lat) { return [(lon + 110) / 2.5 * 10 + 5, (65 - lat) / 2.5 * 10 + 5]; }
  // Her satır: [başlangıç sütunu, bitiş sütunu] kara aralıkları
  var KARA = [
    [[0, 9], [14, 19], [23, 28], [35, 38], [49, 61]],          // 65
    [[0, 6], [13, 17], [24, 27], [46, 51], [53, 61]],          // 62.5
    [[0, 6], [13, 18], [26, 26], [46, 51], [53, 61]],          // 60
    [[0, 6], [13, 19], [41, 42], [46, 47], [49, 51], [53, 61]], // 57.5
    [[0, 10], [12, 19], [40, 41], [42, 44], [47, 48], [52, 61]], // 55
    [[0, 11], [13, 20], [40, 41], [42, 44], [45, 61]],         // 52.5
    [[0, 18], [20, 22], [42, 42], [45, 61]],                   // 50
    [[0, 17], [18, 19], [21, 22], [43, 61]],                   // 47.5
    [[0, 17], [18, 19], [44, 49], [50, 55], [57, 58], [60, 61]], // 45
    [[0, 15], [41, 45], [47, 47], [48, 50], [51, 55], [61, 61]], // 42.5
    [[0, 14], [41, 44], [47, 47], [50, 51], [52, 53], [55, 61]], // 40
    [[0, 13], [41, 43], [49, 50], [53, 53], [55, 61]],         // 37.5
    [[0, 13], [42, 49], [54, 54], [57, 57], [58, 61]],         // 35
    [[0, 11], [41, 50], [52, 52], [58, 61]],                   // 32.5
    [[0, 11], [41, 56], [57, 61]],                             // 30
    [[0, 5], [11, 12], [39, 56], [58, 61]],                    // 27.5
    [[0, 5], [11, 11], [38, 57], [59, 61]],                    // 25
    [[2, 5], [10, 13], [38, 58], [60, 61]],                    // 22.5
    [[2, 5], [8, 9], [13, 16], [38, 59], [60, 61]]             // 20
  ];
  var MERKEZ = { ad: "İstanbul", lon: 28.98, lat: 41.01 };
  var HEDEFLER = [
    { ad: "New York", an: "k.c.nyc", kod: "JFK", lon: -74.0, lat: 40.7, tur: "abd", yuk: 46, etk: [-6, -8] },
    { ad: "Toronto", an: "k.c.yyz", kod: "YYZ", lon: -79.4, lat: 43.7, tur: "abd", yuk: 52, etk: [-36, -8] },
    { ad: "Miami", an: "k.c.mia", kod: "MIA", lon: -80.2, lat: 25.8, tur: "abd", yuk: 36, etk: [-6, 14] },
    { ad: "Lizbon", an: "k.c.lis", kod: "LIS", lon: -9.14, lat: 38.7, tur: "ab", yuk: 22, etk: [-10, 15] },
    { ad: "Amsterdam", an: "k.c.ams", kod: "AMS", lon: 4.9, lat: 52.4, tur: "ab", yuk: 20, etk: [-52, -6] },
    { ad: "Frankfurt", an: "k.c.fra", kod: "FRA", lon: 8.7, lat: 50.1, tur: "ab", yuk: 14, etk: [-50, 12] },
    { ad: "Berlin", an: "k.c.ber", kod: "BER", lon: 13.4, lat: 52.5, tur: "ab", yuk: 16, etk: [4, -8] }
  ];
  var harita = $("#rota-harita");
  var rotalar = [];
  function haritaKur() {
    if (!harita) return;
    var gE = $("#harita-enlem"), gK = $("#harita-kara"), gR = $("#harita-rotalar"), gS = $("#harita-sehirler"), gU = $("#harita-ucuslar");
    // enlem / boylam çizgileri
    [40, 60].forEach(function (lat) { var y = xy(0, lat)[1]; el("line", { "class": "enlem", x1: 0, x2: 620, y1: y, y2: y }, gE); });
    [-90, -60, -30, 0, 30].forEach(function (lon) { var x = xy(lon, 0)[0]; el("line", { "class": "enlem", y1: 0, y2: 190, x1: x, x2: x }, gE); });
    var m = xy(MERKEZ.lon, MERKEZ.lat);
    var parca = d.createDocumentFragment();
    KARA.forEach(function (satir, r) {
      satir.forEach(function (ar) {
        for (var c = ar[0]; c <= ar[1]; c++) {
          var x = c * 10 + 5, y = r * 10 + 5, uz = Math.hypot(x - m[0], y - m[1]);
          el("circle", { cx: x, cy: y, r: 2.1, "class": "kara" + (uz < 34 ? " yakin" : "") }, parca);
        }
      });
    });
    gK.appendChild(parca);
    var defs = harita.querySelector("defs");
    HEDEFLER.forEach(function (h, i) {
      var p = xy(h.lon, h.lat);
      var mx = (m[0] + p[0]) / 2, my = Math.min(m[1], p[1]) - h.yuk;
      var dYol = "M" + m[0].toFixed(1) + " " + m[1].toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + p[0].toFixed(1) + " " + p[1].toFixed(1);
      // Rota çizimi yalnız transform ile: İstanbul'a sabitlenmiş maske dikdörtgeni scaleX 0 → 1
      var mk = el("mask", { id: "rm" + i, maskUnits: "userSpaceOnUse", x: -200, y: -200, width: 1100, height: 600 }, defs);
      var solX = Math.min(m[0], p[0]) - 10, gen = Math.abs(m[0] - p[0]) + 20;
      var perde = el("rect", { x: solX, y: -120, width: gen, height: 420, fill: "#fff", "class": "rota-perde" }, mk);
      perde.style.transformBox = "view-box"; perde.style.transformOrigin = m[0] + "px 0px";
      var iz = el("path", { d: dYol, "class": "rota-iz " + h.tur }, gR);
      var yol = el("path", { d: dYol, "class": "rota " + h.tur }, gR);
      var g = el("g", { "class": "sehir " + h.tur }, gS);
      el("circle", { "class": "halka", cx: p[0], cy: p[1], r: 4, style: "animation-delay:" + (i * 0.4) + "s" }, g);
      el("circle", { "class": "nokta", cx: p[0], cy: p[1], r: 2.6 }, g);
      var t = el("text", { x: p[0] + h.etk[0], y: p[1] + h.etk[1], "data-i18n": h.an, "class": "etk-" + h.kod.toLowerCase() }, g); t.textContent = I.t(h.an);
      // yol boyunca noktaları önceden örnekle (karede getPointAtLength yok)
      var uz = yol.getTotalLength(), ornek = [];
      for (var k = 0; k <= 160; k++) { var q = yol.getPointAtLength(uz * k / 160); ornek.push([q.x, q.y]); }
      var noktalar = [[2.4, 1], [1.7, .5], [1.2, .25]].map(function (o) {
        var c = el("circle", { "class": "ucus", r: o[0], cx: 0, cy: 0 }, gU); c.style.opacity = 0; c.setAttribute("data-g", o[1]); return c;
      });
      rotalar.push({ perde: perde, ornek: ornek, noktalar: noktalar, sure: 4200 + i * 380, gec: i * 650 });
      if (azHareket) noktalar.forEach(function (c) { c.style.display = "none"; });
      else { yol.setAttribute("mask", "url(#rm" + i + ")"); iz.setAttribute("mask", "url(#rm" + i + ")"); perde.style.transform = "scaleX(0)"; }
    });
    var gm = el("g", { "class": "sehir merkez" }, gS);
    el("circle", { "class": "halka", cx: m[0], cy: m[1], r: 5 }, gm);
    el("circle", { "class": "halka", cx: m[0], cy: m[1], r: 5, style: "animation-delay:1.4s" }, gm);
    el("circle", { "class": "nokta", cx: m[0], cy: m[1], r: 3.6 }, gm);
    var tm = el("text", { x: m[0] - 18, y: m[1] + 16, "data-i18n": "k.c.ist" }, gm); tm.textContent = I.t("k.c.ist");
  }
  haritaKur();
  // Telefonda harita daha yüksek görünsün: Amerika'nın batısı kırpılır, rotalar için üstte boşluk açılır (≥170 px)
  var dar = w.matchMedia("(max-width: 640px)");
  function haritaKadraj() { if (harita) harita.setAttribute("viewBox", dar.matches ? "100 -56 512 256" : "0 0 620 190"); }
  haritaKadraj();
  if (dar.addEventListener) dar.addEventListener("change", haritaKadraj); else if (dar.addListener) dar.addListener(haritaKadraj);

  var haritaBasladi = false, haritaGorunur = false, t0 = 0;
  function cizimBaslat() {
    if (haritaBasladi || azHareket) return; haritaBasladi = true;
    rotalar.forEach(function (r) {
      r.perde.style.transition = "transform 1.9s cubic-bezier(.2,.7,.1,1) " + (r.gec / 2) + "ms";
      requestAnimationFrame(function () { requestAnimationFrame(function () { r.perde.style.transform = "scaleX(1)"; }); });
    });
    t0 = performance.now() + 1400;
    requestAnimationFrame(ucusKare);
  }
  function kolay(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function konum(r, f) {
    var x = Math.max(0, Math.min(1, f)) * (r.ornek.length - 1), i = Math.floor(x), k = x - i, a = r.ornek[i], b = r.ornek[Math.min(i + 1, r.ornek.length - 1)];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  }
  function ucusKare(simdi) {
    if (haritaGorunur && aktifSekme === "musteri") {
      rotalar.forEach(function (r) {
        var t = simdi - t0 - r.gec; if (t < 0) return;
        var dongu = r.sure + 900, f = (t % dongu) / r.sure;
        var gor = f > 1 ? 0 : f < .06 ? f / .06 : f > .94 ? (1 - f) / .06 : 1;
        r.noktalar.forEach(function (c, j) {
          var e = kolay(Math.max(0, f - j * .025)), p = konum(r, e);
          c.style.transform = "translate(" + p[0].toFixed(2) + "px," + p[1].toFixed(2) + "px)";
          c.style.opacity = (gor * parseFloat(c.getAttribute("data-g"))).toFixed(3);
        });
      });
    }
    requestAnimationFrame(ucusKare);
  }

  /* Biniş kartı: hedef değiştirici */
  var binisSirasi = $$(".binis-hedefler span"), bi = 0;
  if (binisSirasi.length && !azHareket) {
    setInterval(function () {
      if (aktifSekme !== "musteri" || d.hidden) return;
      bi = (bi + 1) % binisSirasi.length;
      binisSirasi.forEach(function (s, i) { s.classList.toggle("aktif", i === bi); });
      $("#binis-kod").textContent = binisSirasi[bi].getAttribute("data-kod");
      var bs = $("#binis-sehir"), an = binisSirasi[bi].getAttribute("data-sehir");
      bs.setAttribute("data-i18n", an); bs.textContent = I.t(an);
    }, 4500);
  }

  /* ---------------- Sayaçlar ---------------- */
  function sayacCalistir(b) {
    var hedef = parseInt(b.getAttribute("data-sayac"), 10) || 0;
    if (azHareket) { b.textContent = hedef; return; }
    var bas = performance.now(), sure = 1400;
    b.textContent = "0";
    (function kare(t) {
      var f = Math.min(1, (t - bas) / sure), e = 1 - Math.pow(1 - f, 4);
      b.textContent = Math.round(hedef * e);
      if (f < 1) requestAnimationFrame(kare);
    })(bas);
  }

  /* ---------------- Giriş animasyonları ---------------- */
  var gozcu = null;
  if ("IntersectionObserver" in w && !azHareket) {
    gozcu = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (!g.isIntersecting) return;
        var h = g.target;
        h.classList.add("gorundu");
        if (h.classList.contains("harita-kart")) { cizimBaslat(); $$("[data-sayac]", h).forEach(sayacCalistir); }
        if (h.id === "adimlar") h.style.setProperty("--hat", 1);
        gozcu.unobserve(h);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    $$("[data-giris]").forEach(function (n) { gozcu.observe(n); });
    var ad = $("#adimlar"); if (ad) gozcu.observe(ad);
    // harita görünürlüğü (uçuş döngüsünü ekran dışında durdurur)
    var hk = $(".harita-kart");
    if (hk) new IntersectionObserver(function (g) { haritaGorunur = g[0].isIntersecting; }, { threshold: 0 }).observe(hk);
  } else {
    $$("[data-giris]").forEach(function (n) { n.classList.add("gorundu"); });
    $$(".adim").forEach(function (n) { n.classList.add("gorundu"); });
    var ad2 = $("#adimlar"); if (ad2) ad2.style.setProperty("--hat", 1);
    haritaGorunur = true;
  }

  /* ---------------- Paralaks + üst menü + ilerleme ---------------- */
  var paralaks = $$("[data-paralaks]"), ust = $("#ust"), cubuk = $(".ilerleme-cubugu"), pusula = $(".pusula");
  var bekliyor = false;
  function kaydirmaGuncelle() {
    bekliyor = false;
    var y = w.pageYOffset || d.documentElement.scrollTop, vh = w.innerHeight;
    if (ust) ust.classList.toggle("kaydi", y > 8);
    var top = d.documentElement.scrollHeight - vh;
    if (cubuk) cubuk.style.setProperty("--ilerleme", top > 0 ? Math.min(1, y / top).toFixed(4) : 0);
    if (azHareket) return;
    paralaks.forEach(function (n) {
      var kutu = n.parentNode.getBoundingClientRect();
      if (kutu.bottom < -100 || kutu.top > vh + 100) return;
      var hiz = parseFloat(n.getAttribute("data-paralaks")) || 0.2;
      var merkez = kutu.top + kutu.height / 2 - vh / 2;
      n.style.setProperty("--py", (-merkez * hiz).toFixed(1) + "px");
      if (n.hasAttribute("data-olcek")) {
        var f = Math.max(0, Math.min(1, 1 - (kutu.top + kutu.height) / (vh + kutu.height)));
        n.style.setProperty("--olcek", (1.22 - f * 0.12).toFixed(3));
      }
    });
    if (pusula) pusula.style.setProperty("--don", (y * 0.06).toFixed(1) + "deg");
  }
  function kaydirma() { if (!bekliyor) { bekliyor = true; requestAnimationFrame(kaydirmaGuncelle); } }
  w.addEventListener("scroll", kaydirma, { passive: true });
  w.addEventListener("resize", kaydirma);

  /* Biniş kartı: imlece göre hafif eğim */
  var binis = $(".binis");
  if (binis && !azHareket && w.matchMedia("(hover:hover)").matches) {
    var kh = $(".kahraman");
    kh.addEventListener("mousemove", function (e) {
      var r = kh.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      binis.style.setProperty("--ry", (-8 + nx * 10).toFixed(2) + "deg");
      binis.style.setProperty("--rx", (4 - ny * 8).toFixed(2) + "deg");
    });
    kh.addEventListener("mouseleave", function () { binis.style.removeProperty("--ry"); binis.style.removeProperty("--rx"); });
  }

  /* ---------------- Açılış ---------------- */
  function ac() {
    var k = $(".kahraman"); if (k) k.classList.add("hazir");
    isikKonum(); kaydirmaGuncelle();
    if (azHareket || !gozcu) { $$("[data-sayac]").forEach(sayacCalistir); }
  }
  d.addEventListener("DOMContentLoaded", function () { if (/^#panel$/.test(location.hash)) sekmeAc("panel", false); });
  requestAnimationFrame(function () { requestAnimationFrame(ac); });
})();
