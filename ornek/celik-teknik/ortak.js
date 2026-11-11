/* Çelik Teknik prototip — ortak çalışan araçlar (Dijitabela taslak, 11 Kas 2026)
   Arıza sihirbazı · Talep formu → WhatsApp · Bakım planlayıcı · Bölge kontrolü · Açık/kapalı */
(function () {
  "use strict";
  var WA = "905425784782";
  var IMG = (document.body.getAttribute("data-img") || "../img/");
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function wa(metin) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(metin); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Çalışma saatleri (Google Haritalar'daki saatler) ---------- */
  var SAAT = { 0: [9, 17], 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 19], 5: [9, 19], 6: [9, 19] };
  function acikMi() {
    var n = new Date(), s = SAAT[n.getDay()], h = n.getHours() + n.getMinutes() / 60;
    return { acik: h >= s[0] && h < s[1], s: s };
  }
  $$("[data-acik]").forEach(function (el) {
    var d = acikMi();
    el.classList.add(d.acik ? "is-acik" : "is-kapali");
    el.innerHTML = '<i></i>' + (d.acik ? "Şu an açık · " + d.s[1] + ":00'a kadar" : "Şu an kapalı · WhatsApp'tan kayıt bırakın");
  });
  var gun = new Date().getDay();
  $$("[data-gun]").forEach(function (el) { if (+el.getAttribute("data-gun") === gun) el.classList.add("bugun"); });

  /* ---------- Arıza sihirbazı ---------- */
  var CIHAZ = {
    klima: { ad: "Klima", belirti: [
      ["Soğutmuyor / ısıtmıyor", "Filtre tıkanıklığı, gaz eksikliği (kaçak) ya da dış ünite fanı/kompresör.", "Kumandada modu ve sıcaklığı kontrol edin; iç ünitenin kapağını açıp filtreye bakın, tozluysa çıkarıp suyla yıkayın.", "Ustamız gaz basıncını manometreyle ölçer; eksikse önce kaçağın yerini bulur, sonra dolum yapar.", "st-gaz.jpg"],
      ["Su damlatıyor", "Drenaj hortumu tıkanmış, eğimi bozulmuş ya da iç ünite eşanjörü kirlenmiş.", "Dış taraftaki drenaj hortumunun ucunun ezilmediğine, toprağa gömülmediğine bakın.", "Drenaj hattı açılır, eşanjör ilaçlı yıkanır; montaj eğimi gerekiyorsa düzeltilir.", "st-klima.jpg"],
      ["Kötü koku geliyor", "Filtre ve eşanjörde biriken nem; küf ve bakteri.", "Filtreyi yıkayın, klimayı 10 dakika fan modunda çalıştırıp içini kurutun.", "İç ünite koruma örtüsüyle sarılıp ilaçlı yıkama yapılır; drenaj tavası temizlenir.", "st-yatak.jpg"],
      ["Ses / titreşim yapıyor", "Gevşemiş vida ya da braket, dengesi bozulmuş fan, kompresör takozları.", "Dış ünitenin üstünde ya da yanında temas eden bir cisim var mı, bakın.", "Braket ve takozlar kontrol edilir, fan dengesi ayarlanır; gerekirse parça değişir.", "st-ariza.jpg"],
      ["Hiç çalışmıyor", "Sigorta, kumanda pili ya da elektronik kart arızası.", "Sigortayı ve kumanda pillerini kontrol edin; iç ünitede ışık yanıyor mu, bakın.", "Kart arızası çoğu zaman tamir edilerek çözülür; değişim gerekmeyebilir.", "st-kart.jpg"],
      ["Ekranda hata kodu var", "Kod markaya göre değişir: sensör, iletişim hattı, basınç ya da kart uyarısı olabilir.", "Ekrandaki kodu ve klimanın markasını not alın.", "Kodu WhatsApp'tan yazmanız yeterli; ustamız gelmeden önce olası parçayı hazırlar.", "st-kart.jpg"]] },
    camasir: { ad: "Çamaşır makinesi", belirti: [
      ["Suyu boşaltmıyor", "Pompa filtresi tıkalı ya da tahliye pompası arızalı.", "Ön alt kapaktaki pompa filtresini (altına havlu koyarak) açıp temizleyin.", "Pompa ve tahliye hattı test edilir, gerekiyorsa pompa değişir.", "st-camasir.jpg"],
      ["Sıkmıyor / tambur dönmüyor", "Motor kömürü, kayış, motor ya da kart.", "Çamaşır yükü çok mu az ya da çok mu, bakın; tek parça ağır yük sıkmayı engeller.", "Motor ve kart ölçülür, aşınan parça değişir.", "st-kurutma.jpg"],
      ["Elektrik gidip gelince açılmıyor", "Elektronik kart arızası (sık görülür).", "Prizi ve sigortayı kontrol edin.", "Kart yerinde ya da atölyede tamir edilir.", "st-kart.jpg"],
      ["Sıkmada çok gürültülü", "Rulman, amortisör ya da dengesiz yük.", "Makinenin ayaklarının yere tam bastığına bakın.", "Rulman/amortisör kontrol edilir; gerekirse değişir.", "st-camasir.jpg"]] },
    bulasik: { ad: "Bulaşık makinesi", belirti: [
      ["Yıkamıyor, motor sesi yok", "Yıkama motoru ya da kart arızası.", "Musluk açık mı, filtre temiz mi, bakın.", "Motor ve kart test edilir; yıkama motoru gerekiyorsa değiştirilir.", "st-bulasik.jpg"],
      ["Suyu boşaltmıyor", "Alt filtre tıkalı ya da tahliye pompası.", "Alt sepetin altındaki filtreyi çıkarıp yıkayın.", "Pompa ve hortum kontrol edilir.", "st-bulasik.jpg"],
      ["Isıtmıyor", "Rezistans ya da ısı sensörü.", "Programın sıcak program olduğuna emin olun.", "Rezistans ve sensör ölçülüp değiştirilir.", "st-bulasik.jpg"],
      ["Işıklar yanıp sönüyor", "Makine bir hata bildiriyor.", "Hangi ışıkların yanıp söndüğünü not alın ya da fotoğrafını çekin.", "Hata, markaya göre okunup arıza yerinde giderilir.", "st-kart.jpg"]] },
    buzdolabi: { ad: "Buzdolabı / derin dondurucu", belirti: [
      ["Soğutmuyor", "Gaz kaçağı, kompresör, termostat ya da fan.", "Arkadaki ızgaranın duvara yapışık olmadığına, havalandığına bakın.", "Kompresör ve gaz devresi kontrol edilir; gerekiyorsa motor yenilenir.", "st-buzdolabi.jpg"],
      ["Karlanma / buzlanma yapıyor", "Defrost rezistansı, sensör ya da kapı fitili.", "Kapı tam kapanıyor mu, bir kâğıt sıkıştırıp çekerek deneyin.", "Defrost devresi test edilir.", "st-dolapic.jpg"],
      ["Kapı fitili kapatmıyor", "Fitil sertleşmiş ya da kapı ayarı bozulmuş.", "Çoğu zaman fitili değiştirmeye gerek yoktur: ılık suyla silip kapı ayarına bakın.", "Telefonda bile yol gösterebiliriz; gerekmiyorsa parça değiştirmeyiz.", "st-dolapic.jpg"],
      ["Sürekli çalışıyor, sesli", "Kondenser kirli, fan ya da termostat.", "Arka ızgarayı yumuşak fırçayla tozdan arındırın.", "Fan ve termostat kontrol edilir.", "st-buzdolabi.jpg"]] },
    firin: { ad: "Fırın / ocak / şofben", belirti: [
      ["Fırın ısıtmıyor", "Rezistans, termostat ya da fan motoru.", "Saat/zamanlayıcı ayarlı mı, bakın; bazı fırınlar saat ayarlanmadan çalışmaz.", "Rezistans ve termostat ölçülür, değişir.", "st-firin.jpg"],
      ["Ocak gözü yanmıyor", "Ateşleme bujisi, termokupl ya da kart.", "Ocak başlıklarının yerine tam oturduğuna bakın.", "Ateşleme ve emniyet parçaları kontrol edilir.", "st-firin.jpg"],
      ["Şofbenden sıcak su gelmiyor", "Ateşleme, pil ya da membran.", "Şofbenin pillerini değiştirip deneyin.", "Ateşleme ve su devresi kontrol edilir.", "st-alet.jpg"]] }
  };
  var sih = $("[data-sihirbaz]");
  if (sih) {
    var secC = null, secB = null;
    var cKutu = $(".s-cihaz", sih), bKutu = $(".s-belirti", sih), sonuc = $(".s-sonuc", sih);
    cKutu.innerHTML = Object.keys(CIHAZ).map(function (k) { return '<button type="button" class="cip" data-c="' + k + '">' + CIHAZ[k].ad + "</button>"; }).join("");
    function ciz() {
      $$(".cip", cKutu).forEach(function (b) { b.classList.toggle("sec", b.getAttribute("data-c") === secC); });
      if (!secC) { bKutu.innerHTML = '<p class="ipucu">Önce cihazı seçin.</p>'; sonuc.innerHTML = ""; return; }
      bKutu.innerHTML = CIHAZ[secC].belirti.map(function (b, i) { return '<button type="button" class="cip' + (i === secB ? " sec" : "") + '" data-b="' + i + '">' + b[0] + "</button>"; }).join("");
      if (secB == null) { sonuc.innerHTML = '<p class="ipucu">Şimdi belirtiyi seçin.</p>'; return; }
      var b = CIHAZ[secC].belirti[secB];
      var mesaj = "Merhaba Çelik Teknik, " + CIHAZ[secC].ad.toLocaleLowerCase("tr") + " arızası için yazıyorum.\nBelirti: " + b[0] + "\nMarka/model: \nAdres (mahalle): \nUygun saat: ";
      sonuc.innerHTML = '<div class="s-kart"><img src="' + IMG + b[4] + '" alt="' + esc(b[0]) + '" loading="lazy"><div class="s-yazi">' +
        '<p class="s-et">OLASI SEBEP</p><p>' + b[1] + '</p>' +
        '<p class="s-et">ÖNCE SİZ BAKIN</p><p>' + b[2] + '</p>' +
        '<p class="s-et">USTAMIZ NE YAPAR</p><p>' + b[3] + '</p>' +
        '<a class="dg wa" href="' + wa(mesaj) + '" target="_blank" rel="noopener">Bu arızayı WhatsApp\'tan ustaya gönder</a>' +
        '<p class="not">Tahmini yön gösterir; kesin tespit yerinde yapılır.</p></div></div>';
      var f = $("#talep"); if (f) { var c = $("[name=cihaz]", f), a = $("[name=ariza]", f); if (c) c.value = CIHAZ[secC].ad; if (a && !a.value) a.value = b[0]; }
    }
    sih.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-c")) { secC = t.getAttribute("data-c"); secB = null; ciz(); }
      if (t.hasAttribute("data-b")) { secB = +t.getAttribute("data-b"); ciz(); }
    });
    ciz();
  }

  /* ---------- Talep formu → WhatsApp ön dolu mesaj ---------- */
  var form = $("#talep");
  if (form) {
    var tarih = $("[name=gun]", form);
    if (tarih) { var d = new Date(); tarih.min = d.toISOString().slice(0, 10); tarih.value = d.toISOString().slice(0, 10); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { var x = form.elements[n]; return x ? String(x.value || "").trim() : ""; };
      if (!v("ad") || !v("tel")) { var u = $(".f-uyari", form); if (u) u.textContent = "Adınızı ve telefonunuzu yazın, ustamız size dönsün."; return; }
      var tur = v("tur"), gunS = v("gun") ? new Date(v("gun") + "T12:00").toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) : "";
      var m = "Merhaba Çelik Teknik, web sitenizden " + (tur || "servis") + " kaydı:\n" +
        "Ad: " + v("ad") + "\nTelefon: " + v("tel") + "\nCihaz: " + v("cihaz") + (v("marka") ? " (" + v("marka") + ")" : "") +
        "\nKonu: " + (v("ariza") || "-") + "\nBölge: " + v("bolge") + (v("adres") ? " — " + v("adres") : "") +
        "\nUygun gün: " + gunS + " · " + v("dilim");
      var ok = $(".f-ok", form);
      if (ok) ok.innerHTML = 'Kaydınız hazır. WhatsApp açılıyor… Açılmazsa <a href="' + wa(m) + '" target="_blank" rel="noopener">buraya dokunun</a>.';
      window.open(wa(m), "_blank");
    });
  }

  /* ---------- Bakım planlayıcı ---------- */
  var bp = $("[data-bakim]");
  if (bp) {
    var hesap = function () {
      var adet = +$("[name=adet]", bp).value, son = $("[name=son]", bp).value, kul = $("[name=kul]", bp).value;
      var yilda = kul === "yaz" ? 1 : 2, simdi = new Date(), ay = simdi.getMonth();
      var gecikme = son === "hic" || son === "2" ? "kirmizi" : son === "1" ? "sari" : "yesil";
      // Sezon başı: soğutma öncesi Nisan-Mayıs, ısıtma öncesi Ekim
      var hedefler = yilda === 2 ? [3, 9] : [3];
      if (kul === "pansiyon") hedefler = [2, 5, 9];
      var sonraki = null;
      for (var y = 0; y < 2 && !sonraki; y++) hedefler.forEach(function (h) { var t = new Date(simdi.getFullYear() + y, h, 15); if (!sonraki && t > simdi) sonraki = t; });
      if (gecikme === "kirmizi") sonraki = new Date(simdi.getTime() + 7 * 864e5);
      if (gecikme === "sari") sonraki = new Date(simdi.getTime() + 21 * 864e5);
      var ad = { yesil: "Bakımınız güncel", sari: "Bakım zamanı yaklaştı", kirmizi: "Bakım gecikmiş" }[gecikme];
      var ayAd = sonraki.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      var txt = { yaz: "Yalnız yazın kullanılan klimada yılda 1 bakım (soğutma sezonundan önce) yeterli.", ikisi: "Yaz-kış kullanılan klimada yılda 2 bakım: soğutmadan önce bahar, ısıtmadan önce sonbahar.", pansiyon: "Kiraya verilen daire, apart ve pansiyonlarda sezon öncesi, sezon ortası ve sezon sonu olmak üzere yılda 3 bakım önerilir; misafir şikâyetinin önüne geçer." }[kul];
      var m = "Merhaba Çelik Teknik, " + adet + " adet klima için bakım randevusu almak istiyorum.\nKullanım: " + $("[name=kul] option:checked", bp).textContent + "\nSon bakım: " + $("[name=son] option:checked", bp).textContent + "\nAdres (mahalle): ";
      $(".b-sonuc", bp).innerHTML = '<div class="b-durum ' + gecikme + '"><b>' + ad + '</b><span>Önerilen bakım: ' + ayAd + '</span></div><p>' + txt + (adet > 2 ? " " + adet + " ünite aynı gün sırayla yapılır, tek seferde biter." : "") + '</p><a class="dg wa" href="' + wa(m) + '" target="_blank" rel="noopener">Bu tarihe bakım randevusu iste</a>';
    };
    bp.addEventListener("change", hesap); hesap();
  }

  /* ---------- Bölge kontrolü ---------- */
  var BOLGE = ["manavgat", "merkez", "bahçelievler", "aşağı pazarcı", "aşağıpazarcı", "yukarı pazarcı", "yukarıpazarcı", "aşağı hisar", "aşağıhisar", "yukarı hisar", "yukarıhisar", "sarılar", "çağlayan", "emek", "milli egemenlik", "örnek", "kavaklı", "ilıca", "side", "sorgun", "titreyengöl", "kumköy", "çolaklı", "evrenseki", "kızılağaç", "kızılot", "gündoğdu", "ilıca", "salkımevler", "şelale", "değirmenözü", "hacıobası", "ılıca", "kemerağzı"];
  var bk = $("[data-bolge]");
  if (bk) {
    var inp = $("input", bk), out = $(".bk-sonuc", bk);
    var bak = function () {
      var q = inp.value.trim().toLocaleLowerCase("tr");
      if (q.length < 3) { out.textContent = ""; out.className = "bk-sonuc"; return; }
      var var_ = BOLGE.some(function (b) { return b.indexOf(q) === 0 || q.indexOf(b) === 0; });
      out.className = "bk-sonuc " + (var_ ? "evet" : "sor");
      out.innerHTML = var_ ? "Evet, " + esc(inp.value.trim()) + " hizmet bölgemizde. <a href='" + wa("Merhaba, " + inp.value.trim() + " bölgesinden servis kaydı açmak istiyorum.") + "' target='_blank' rel='noopener'>Kayıt aç →</a>"
        : "Listede yok ama yine de sorun; uygunsa geliyoruz. <a href='" + wa("Merhaba, " + inp.value.trim() + " bölgesine servis geliyor mu?") + "' target='_blank' rel='noopener'>Sor →</a>";
    };
    inp.addEventListener("input", bak);
  }

  /* ---------- Görününce belir (hafif) ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("gorundu"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(".gor").forEach(function (el) { io.observe(el); });
  } else { $$(".gor").forEach(function (el) { el.classList.add("gorundu"); }); }

  /* ---------- Sayaç (5,0 · 255) ---------- */
  $$("[data-say]").forEach(function (el) {
    var hedef = parseFloat(el.getAttribute("data-say")), ondalik = el.getAttribute("data-say").indexOf(".") > -1, bas = null;
    var f = function (t) { if (!bas) bas = t; var k = Math.min(1, (t - bas) / 1400); k = 1 - Math.pow(1 - k, 3); var v = hedef * k; el.textContent = ondalik ? v.toFixed(1).replace(".", ",") : Math.round(v); if (k < 1) requestAnimationFrame(f); };
    if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { requestAnimationFrame(f); o.disconnect(); } }); o.observe(el); }
  });

  /* ---------- Işık kutusu (galeri) ---------- */
  var lb = document.createElement("div"); lb.className = "lb"; lb.innerHTML = '<button type="button" aria-label="Kapat">×</button><img alt=""><p></p>'; document.body.appendChild(lb);
  lb.addEventListener("click", function (e) { if (e.target.tagName !== "IMG") lb.classList.remove("ac"); });
  $$("[data-lb]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); $("img", lb).src = a.getAttribute("href"); $("p", lb).textContent = a.getAttribute("data-lb"); lb.classList.add("ac"); }); });

  /* ---------- Hizmet bölgesi haritası (Leaflet + OpenStreetMap) ---------- */
  var hz = $("#bolge-harita");
  if (hz && window.L) {
    var dukkan = [36.781854, 31.4368508];
    var mp = L.map(hz, { scrollWheelZoom: false }).setView([36.78, 31.41], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(mp);
    L.circle(dukkan, { radius: 17000, color: "#d7141a", weight: 1.5, fillOpacity: .06 }).addTo(mp);
    [["Side", 36.7675, 31.389], ["Sorgun", 36.776, 31.417], ["Titreyengöl", 36.759, 31.405], ["Ilıca", 36.774, 31.47], ["Kızılağaç", 36.737, 31.54], ["Kızılot", 36.72, 31.58], ["Evrenseki", 36.797, 31.335], ["Çolaklı", 36.81, 31.29], ["Gündoğdu", 36.823, 31.24]].forEach(function (b) {
      L.circleMarker([b[1], b[2]], { radius: 6, color: "#141414", weight: 2, fillColor: "#fff", fillOpacity: 1 }).addTo(mp).bindTooltip(b[0], { direction: "right", offset: [6, 0] });
    });
    L.circleMarker(dukkan, { radius: 10, color: "#fff", weight: 3, fillColor: "#d7141a", fillOpacity: 1 }).addTo(mp).bindTooltip("Çelik Teknik", { permanent: true, direction: "top", offset: [0, -10] });
  }

  /* ---------- SSS akordiyon (details kullanılır; JS gerekmez) / Uygulama sekmeleri ---------- */
  $$("[data-sekme]").forEach(function (grup) {
    grup.addEventListener("click", function (e) {
      var t = e.target.closest("[data-hedef]"); if (!t) return;
      var h = t.getAttribute("data-hedef");
      $$("[data-hedef]", grup).forEach(function (x) { x.classList.toggle("sec", x === t); });
      $$("[data-panel]").forEach(function (p) { if (p.getAttribute("data-grup") === grup.getAttribute("data-sekme")) p.hidden = p.getAttribute("data-panel") !== h; });
    });
  });
})();
