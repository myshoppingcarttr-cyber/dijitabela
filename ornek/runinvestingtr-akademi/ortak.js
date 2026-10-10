// RunInvestingTR Akademi · 3 prototip için ortak modüller (10 Eki 2026, Dijitabela)
// Kaynak: müşterinin akademi.zip'i (4 konu / 36 ders, SPL robotu, canlı eğitim, forum rütbeleri, piyasa & takvim, 250+250 USD üyelik).
// Ders başlıkları konu açıklamalarından türetilmiş ÖNERİ müfredattır (gerçek ders listesi veritabanında, zip'te yok).
(function () {
  var R = (window.RIT = {});

  R.konular = [
    { k: "A", ad: "Finansal Yatırım", ozet: "Finansal yatırımın temel kavramları, piyasaların işleyişi ve yatırım araçları.", renk: "#2b7fff",
      dersler: ["Tasarruftan yatırıma: temel kavramlar", "Finansal piyasaların yapısı", "Para ve sermaye piyasaları", "Hisse senetleri ve halka arzlar", "Tahvil, bono ve kira sertifikaları", "Yatırım fonları ve borsa yatırım fonları", "Türev araçlar: vadeli işlem ve opsiyon", "Emtia: altın, gümüş, petrol", "Döviz ve parite piyasaları"] },
    { k: "B", ad: "Finansal Piyasalarda Yatırımcı Olmak", ozet: "Yatırımcı psikolojisi, davranışları, risk yönetimi ve yatırımcı disiplini.", renk: "#d32f2f",
      dersler: ["Yatırımcı psikolojisi", "Davranışsal tuzaklar: FOMO, kayıptan kaçınma", "Risk ve getiri ilişkisi", "Risk yönetimi ve pozisyon büyüklüğü", "Zarar kes ve kâr al disiplini", "Portföy çeşitlendirme", "İşlem günlüğü tutmak", "Kişisel yatırım planı", "Kriz dönemlerinde yatırımcı davranışı"] },
    { k: "C", ad: "Finansal Okuryazarlık", ozet: "Enflasyon, faiz, para politikaları, arz-talep ve ekonomik gelişmeler.", renk: "#f59e0b",
      dersler: ["Enflasyon ve reel getiri", "Faiz ve para politikası", "Merkez bankaları nasıl çalışır", "Arz-talep ve fiyat oluşumu", "Makro göstergeler: GSYH, işsizlik, cari denge", "Ekonomik takvim nasıl okunur", "Bileşik getirinin gücü", "Kur, dış ticaret ve sermaye akımları", "Haber akışını doğru yorumlamak"] },
    { k: "D", ad: "Teknik Analiz", ozet: "Grafik okuma, trendler, indikatörler ve formasyonlar.", renk: "#10b981",
      dersler: ["Grafik türleri ve mum çubukları", "Trend ve trend çizgileri", "Destek ve direnç", "Hareketli ortalamalar", "RSI, MACD ve momentum", "Hacim analizi", "Formasyonlar: OBO, üçgen, bayrak", "Fibonacci düzeltmeleri", "Strateji kurmak ve geriye dönük test"] }
  ];

  // Forum rütbeleri (zip: forum-gonderi.php rutbeHesapla) ve kategoriler (forum-kategori-yorum.sql)
  R.rutbeler = [
    { e: "🌱", ad: "Acemi Yatırımcı", min: 0 }, { e: "📈", ad: "Yatırımcı", min: 20 }, { e: "💼", ad: "Deneyimli Yatırımcı", min: 50 },
    { e: "🏆", ad: "Uzman Yatırımcı", min: 100 }, { e: "👑", ad: "Usta Yatırımcı", min: 200 }
  ];
  R.forumKategoriler = ["Altın", "Gümüş", "Petrol", "FX", "Pariteler", "DAX", "Nasdaq", "Eğitim & Sorular", "Genel Sohbet"];

  // SPL 1. Düzey tarzı soru havuzu (her sınavda soru + şık sırası karışır, zip'teki "robot sınav" mantığı)
  R.sorular = [
    { s: "Türkiye'de sermaye piyasasını düzenleyen temel kanun hangisidir?", c: ["6362 sayılı Sermaye Piyasası Kanunu", "5411 sayılı Bankacılık Kanunu", "6102 sayılı Türk Ticaret Kanunu", "4734 sayılı Kamu İhale Kanunu"], a: "2012'de yürürlüğe giren 6362 sayılı SPKn, sermaye piyasasının temel kanunudur.", d: "Mevzuat" },
    { s: "Sermaye piyasasını düzenleyen ve denetleyen kurum hangisidir?", c: ["Sermaye Piyasası Kurulu (SPK)", "BDDK", "Hazine ve Maliye Bakanlığı", "Rekabet Kurumu"], a: "SPK, sermaye piyasasının düzenleyici ve denetleyici otoritesidir.", d: "Mevzuat" },
    { s: "Kaydi sermaye piyasası araçlarının kayıtlarını tutan kuruluş hangisidir?", c: ["Merkezi Kayıt Kuruluşu (MKK)", "Takasbank", "Borsa İstanbul", "TCMB"], a: "Kaydi araçların hak sahipliği kayıtları MKK'da tutulur.", d: "Mevzuat" },
    { s: "Borsa İstanbul pay piyasasında işlemlerin takas süresi nedir?", c: ["T+2", "T+0", "T+1", "T+5"], a: "Pay piyasasında takas, işlem gününden 2 iş günü sonra (T+2) gerçekleşir.", d: "Piyasalar" },
    { s: "Piyasa faiz oranları yükselirse sabit kuponlu bir tahvilin fiyatı ne olur?", c: ["Düşer", "Yükselir", "Değişmez", "Kupon oranı kadar artar"], a: "Tahvil fiyatı ile faiz arasında ters ilişki vardır.", d: "Finans" },
    { s: "1.000 TL, yıllık %10 bileşik faizle 2 yıl değerlenirse vade sonu tutar nedir?", c: ["1.210 TL", "1.200 TL", "1.100 TL", "1.221 TL"], a: "1.000 × 1,10² = 1.210 TL.", d: "Finans Matematiği" },
    { s: "Portföy çeşitlendirmesiyle azaltılabilen risk hangisidir?", c: ["Sistematik olmayan (şirkete özgü) risk", "Sistematik (piyasa) risk", "Enflasyon riski", "Faiz riski"], a: "Çeşitlendirme şirkete özgü riski azaltır; piyasa riski çeşitlendirmeyle yok edilemez.", d: "Portföy" },
    { s: "Fiyat/Kazanç (F/K) oranı nasıl hesaplanır?", c: ["Pay fiyatı ÷ hisse başına net kâr", "Net kâr ÷ özsermaye", "Piyasa değeri ÷ satışlar", "Temettü ÷ pay fiyatı"], a: "F/K = Pay fiyatı / Hisse başına kâr.", d: "Finansal Analiz" },
    { s: "Nominal getiri %40, enflasyon %30 ise reel getiri yaklaşık kaçtır?", c: ["%7,7", "%10", "%70", "%1,3"], a: "Reel getiri = (1,40 / 1,30) − 1 ≈ %7,7 (Fisher denklemi).", d: "Finans Matematiği" },
    { s: "Türkiye'de para politikasının uygulanmasından sorumlu kurum hangisidir?", c: ["TCMB", "SPK", "BDDK", "TÜİK"], a: "Fiyat istikrarı ve para politikası TCMB'nin görevidir.", d: "Ekonomi" },
    { s: "Halka arz edilen payların ilk kez satışa sunulduğu piyasaya ne denir?", c: ["Birincil piyasa", "İkincil piyasa", "Tezgâh üstü piyasa", "Türev piyasa"], a: "İlk satış birincil piyasada, sonraki alım-satımlar ikincil piyasada olur.", d: "Piyasalar" },
    { s: "Betası 1,5 olan bir pay için hangisi doğrudur?", c: ["Piyasadan daha oynaktır", "Piyasadan daha az oynaktır", "Piyasayla ters yönde hareket eder", "Risksizdir"], a: "Beta > 1 ise pay, piyasa hareketlerine daha güçlü tepki verir.", d: "Portföy" },
    { s: "Repo işlemi nedir?", c: ["Menkul kıymetin geri alım vaadiyle satılması", "Hissenin açığa satılması", "Döviz cinsinden mevduat", "Kredi kartı borcunun yapılandırılması"], a: "Repo: geri alım vaadiyle satım; ters repo: geri satım vaadiyle alım.", d: "Piyasalar" },
    { s: "Getirilerin standart sapması neyi ölçer?", c: ["Oynaklığı (toplam riski)", "Ortalama getiriyi", "Likiditeyi", "Temettü verimini"], a: "Standart sapma, getirilerin ortalamadan sapmasını yani oynaklığı ölçer.", d: "İstatistik" },
    { s: "Likidite kavramı neyi ifade eder?", c: ["Bir varlığın değer kaybetmeden hızla nakde çevrilebilmesi", "Bir şirketin kârlılığı", "Faiz oranlarının düşüklüğü", "Bir hissenin temettü dağıtması"], a: "Likit varlık, büyük değer kaybı olmadan çabuk nakde dönebilen varlıktır.", d: "Finans" },
    { s: "Bir yatırım fonunun birim pay fiyatı nasıl bulunur?", c: ["Fon toplam değeri ÷ dolaşımdaki pay sayısı", "Fon getirisi ÷ 365", "Yönetim ücreti ÷ pay sayısı", "Portföydeki hisse sayısı ÷ pay sayısı"], a: "Birim pay değeri = Fon toplam değeri / Pay sayısı.", d: "Fonlar" },
    { s: "VİOP neyin kısaltmasıdır?", c: ["Vadeli İşlem ve Opsiyon Piyasası", "Varlık İhraç Ortaklık Piyasası", "Vergi İade Onay Platformu", "Yatırım Ortaklığı Paydaşları"], a: "VİOP, Borsa İstanbul bünyesindeki Vadeli İşlem ve Opsiyon Piyasası'dır.", d: "Piyasalar" },
    { s: "Enflasyon en doğru şekilde nasıl tanımlanır?", c: ["Genel fiyat düzeyinin sürekli artması", "Tek bir malın fiyatının artması", "Döviz kurunun düşmesi", "Faiz oranlarının sabit kalması"], a: "Enflasyon, genel fiyat düzeyindeki sürekli artıştır.", d: "Ekonomi" }
  ];

  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  R.karistir = karistir;

  // SPL robot sınavı: el içine çizer. CSS sınıfları: .sv-ust .sv-ilerleme .sv-soru .sv-sik(.dogru/.yanlis) .sv-aciklama .sv-btn .sv-sonuc
  R.sinav = function (el, o) {
    o = o || {}; var adet = o.adet || 8, sure = o.sure || 0, set, i, puan, cevaplar, kalan, zam;
    var anahtar = "rit-en-iyi-" + (o.ad || "spl");
    function enIyi() { try { return +localStorage.getItem(anahtar) || 0; } catch (e) { return 0; } }
    function kaydet(p) { try { if (p > enIyi()) localStorage.setItem(anahtar, p); } catch (e) {} }
    function basla() {
      set = karistir(R.sorular).slice(0, adet).map(function (q) { var d = q.c[0]; return { s: q.s, c: karistir(q.c), d: d, a: q.a, k: q.d }; });
      i = 0; puan = 0; cevaplar = []; kalan = sure; clearInterval(zam);
      if (sure) zam = setInterval(function () { kalan--; var t = el.querySelector(".sv-sure"); if (t) t.textContent = mmss(kalan); if (kalan <= 0) { clearInterval(zam); bitir(); } }, 1000);
      ciz();
    }
    function mmss(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
    function ciz() {
      var q = set[i];
      el.innerHTML = '<div class="sv-ust"><span>Soru ' + (i + 1) + " / " + adet + ' · <em>' + q.k + "</em></span>" + (sure ? '<span class="sv-sure">' + mmss(kalan) + "</span>" : "<span>Doğru: " + puan + "</span>") + "</div>" +
        '<div class="sv-ilerleme"><i style="width:' + (i / adet * 100) + '%"></i></div><h4 class="sv-soru">' + q.s + "</h4>" +
        q.c.map(function (c, n) { return '<button class="sv-sik" data-c="' + n + '"><b>' + "ABCD"[n] + "</b>" + c + "</button>"; }).join("") +
        '<div class="sv-aciklama" hidden></div><button class="sv-btn" hidden>' + (i + 1 < adet ? "Sonraki soru →" : "Sonucu gör") + "</button>";
      el.querySelectorAll(".sv-sik").forEach(function (b) { b.onclick = function () { sec(+b.dataset.c); }; });
      el.querySelector(".sv-btn").onclick = function () { i++; i < adet ? ciz() : bitir(); };
    }
    function sec(n) {
      var q = set[i], dogru = q.c[n] === q.d; if (dogru) puan++; cevaplar.push(dogru);
      el.querySelectorAll(".sv-sik").forEach(function (b, m) { b.disabled = true; if (q.c[m] === q.d) b.classList.add("dogru"); else if (m === n) b.classList.add("yanlis"); });
      var a = el.querySelector(".sv-aciklama"); a.hidden = false; a.innerHTML = (dogru ? "✓ Doğru. " : "✗ Yanlış. ") + q.a;
      el.querySelector(".sv-btn").hidden = false;
    }
    function bitir() {
      clearInterval(zam); var yuzde = Math.round(puan / adet * 100); kaydet(yuzde);
      if (o.bitince) { var konu = {}; set.forEach(function (q, n) { konu[q.k] = konu[q.k] || [0, 0]; konu[q.k][1]++; if (cevaplar[n]) konu[q.k][0]++; }); try { o.bitince({ yuzde: yuzde, puan: puan, adet: adet, konu: konu }); } catch (e) {} }
      var not = yuzde >= 70 ? "Sınav eşiğinin üzerindesiniz. Deneme sınavıyla kendinizi zorlayın." : yuzde >= 50 ? "Yaklaştınız. Yanlış yaptığınız konuların derslerine dönün." : "Temelden başlayalım: A ve C programları sizin için ideal başlangıç.";
      el.innerHTML = '<div class="sv-sonuc"><div class="sv-yuzde" style="--p:' + yuzde + '"><span>%' + yuzde + "</span></div><h4>" + puan + " / " + adet + " doğru</h4><p>" + not + "</p><p class=\"sv-eniyi\">En iyi skorunuz: %" + enIyi() + "</p>" +
        '<div class="sv-cubuk">' + cevaplar.map(function (d) { return '<i class="' + (d ? "d" : "y") + '"></i>'; }).join("") + '</div><button class="sv-btn">🔁 Yeni soru seti üret</button></div>';
      el.querySelector(".sv-btn").onclick = basla;
    }
    basla();
  };

  // Hesaplayıcılar
  R.hesap = {
    pozisyon: function (sermaye, riskYuzde, giris, stop) { var risk = sermaye * riskYuzde / 100, birim = Math.abs(giris - stop); if (!birim) return null; var adet = Math.floor(risk / birim); return { risk: risk, adet: adet, tutar: adet * giris, oran: adet * giris / sermaye * 100 }; },
    bilesik: function (ana, aylik, yillikYuzde, yil) { var r = yillikYuzde / 100 / 12, n = yil * 12, t = ana * Math.pow(1 + r, n) + (r ? aylik * (Math.pow(1 + r, n) - 1) / r : aylik * n); return { toplam: t, yatirilan: ana + aylik * n }; },
    reel: function (nominal, enflasyon) { return ((1 + nominal / 100) / (1 + enflasyon / 100) - 1) * 100; }
  };
  R.tl = function (x, ek) { return (isFinite(x) ? x : 0).toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + (ek === undefined ? " ₺" : ek); };

  // Haftalık canlı eğitim geri sayımı (örnek takvim: Çarşamba 21:00 · Pazar 20:00, İstanbul)
  R.siradakiCanli = function () {
    var simdi = new Date(), adaylar = [];
    [[3, 21, "Haftalık Piyasa Analizi"], [0, 20, "Teknik Analiz Atölyesi"]].forEach(function (p) {
      for (var g = 0; g < 8; g++) { var d = new Date(simdi); d.setDate(d.getDate() + g); d.setHours(p[1], 0, 0, 0); if (d.getDay() === p[0] && d > simdi) { adaylar.push({ t: d, ad: p[2] }); break; } }
    });
    return adaylar.sort(function (a, b) { return a.t - b.t; })[0];
  };
  R.geriSayim = function (el, bicim) {
    var c = R.siradakiCanli();
    function yaz() { var k = Math.max(0, c.t - new Date()), p = [Math.floor(k / 864e5), Math.floor(k % 864e5 / 36e5), Math.floor(k % 36e5 / 6e4), Math.floor(k % 6e4 / 1e3)];
      el.innerHTML = (bicim || function (p, c) { return p.join(":"); })(p.map(function (x) { return String(x).padStart(2, "0"); }), c); }
    yaz(); setInterval(yaz, 1000); return c;
  };

  // TradingView ücretsiz gömülü bileşenleri (canlı fiyat bandı, piyasa görünümü, ekonomik takvim — zip'teki piyasa.php ile aynı kaynak)
  R.sembolBant = [
    { proName: "BIST:XU100", title: "BIST 100" }, { proName: "FX_IDC:USDTRY", title: "USD/TRY" }, { proName: "FX:EURUSD", title: "EUR/USD" },
    { proName: "OANDA:XAUUSD", title: "Altın" }, { proName: "OANDA:XAGUSD", title: "Gümüş" }, { proName: "TVC:UKOIL", title: "Brent" },
    { proName: "XETR:DAX", title: "DAX" }, { proName: "NASDAQ:NDX", title: "Nasdaq 100" }, { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" }
  ];
  R.tv = function (el, tur, ayar) {
    var k = document.createElement("div"); k.className = "tradingview-widget-container";
    k.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
    var s = document.createElement("script"); s.async = true; s.src = "https://s3.tradingview.com/external-embedding/embed-widget-" + tur + ".js";
    s.innerHTML = JSON.stringify(Object.assign({ locale: "tr", isTransparent: true }, ayar)); k.appendChild(s); el.appendChild(k);
  };

  // Görünür olunca beliren öğeler (.gor) + sayaçlar ([data-say])
  R.canlandir = function () {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; e.target.classList.add("gorundu"); io.unobserve(e.target);
      var n = e.target.querySelectorAll("[data-say]"); n.forEach(function (x) { var hedef = +x.dataset.say, t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1200); x.textContent = Math.round(hedef * (1 - Math.pow(1 - p, 3))) + (x.dataset.ek || ""); if (p < 1) requestAnimationFrame(f); })(t0); }); }); }, { threshold: .15 });
    document.querySelectorAll(".gor").forEach(function (x) { io.observe(x); });
  };

  // Canlı dersi takvime ekle (.ics indirir — telefon/Outlook/Google Takvim açar)
  R.takvimeEkle = function (c) {
    var z = function (d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }, bit = new Date(c.t.getTime() + 90 * 6e4);
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RunInvestingTR//Akademi//TR", "BEGIN:VEVENT", "UID:" + c.t.getTime() + "@runinvestingtr", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(c.t), "DTEND:" + z(bit),
      "SUMMARY:RunInvestingTR Canlı Eğitim · " + c.ad, "DESCRIPTION:Katılım bağlantısı üye panelinde yayın başlamadan açılır.", "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Canlı eğitim 15 dk sonra", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "runinvestingtr-canli-egitim.ics"; document.body.appendChild(a); a.click(); a.remove();
  };

  // Hareket azaltma tercihi
  R.azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Demo bildirimi (form gönderimleri prototipte gerçek gönderim yapmaz)
  R.bildir = function (m) { var t = document.createElement("div"); t.textContent = m; t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111827;color:#fff;padding:12px 18px;border-radius:12px;font:600 14px system-ui;z-index:99999;box-shadow:0 10px 30px rgba(0,0,0,.3);max-width:90vw;text-align:center"; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); };
})();
