// Klima servisi premium modülü (GELİŞİM, 14 Eki 2026): BTU hesaplayıcı · arıza rehberi (fotoğraflı) · bakım takvimi (.ics) · montaj/bakım randevusu + montaj kontrol listesi
// Fiyat tutarı ve garanti dili yok. BTU kaynağı: ENERGY STAR oda kliması boyutlandırma tablosu + düzeltmeleri (sayfada yazılı).
(function () {
  var E = window.ESNAF;
  var FT = 10.764; // 1 m² = 10,764 ft²
  // ENERGY STAR tablosu: [alan üst sınırı ft², BTU/saat]
  var TABLO = [[150, 5000], [250, 6000], [300, 7000], [350, 8000], [400, 9000], [450, 10000], [550, 12000], [700, 14000], [1000, 18000], [1200, 21000], [1400, 23000], [1500, 24000], [2000, 30000], [2500, 34000]];
  var SINIF = [9000, 12000, 18000, 24000]; // piyasadaki yaygın split sınıfları
  var CEPHE = { kuzey: [-0.1, "gölgeli oda −%10"], dogu: [0, "doğu cephesi düzeltmesiz"], guney: [0.1, "güneşli oda +%10"], bati: [0.1, "güneşli oda +%10"] };
  var KAT = { ara: [0, ""], zemin: [0, ""], ust: [0.1, "en üst kat +%10 (varsayım)"] };
  var nokta = function (n) { return n.toLocaleString("tr-TR"); };
  var btuSon = "";
  function btu(k) {
    var q = function (s) { return E.q(k, s); }, kisi = 2;
    q(".b-kisi").innerHTML = [1, 2, 3, 4, 5, 6].map(function (n) { return '<button type="button" class="cip" data-n="' + n + '">' + (n === 6 ? "6+" : n) + "</button>"; }).join("");
    function hes() {
      var m2 = Math.min(200, Math.max(5, +q(".b-m2").value || 0)), ft = m2 * FT, oda = q(".b-oda").value, c = CEPHE[q(".b-cephe").value], kt = KAT[q(".b-kat").value];
      var taban = TABLO[TABLO.length - 1][1], i;
      for (i = 0; i < TABLO.length; i++) if (ft <= TABLO[i][0]) { taban = TABLO[i][1]; break; }
      var adim = ["Tablo değeri (" + m2 + " m² ≈ " + Math.round(ft) + " ft²): " + nokta(taban) + " BTU"];
      var top = taban * (1 + c[0] + kt[0]);
      if (c[0]) adim.push(c[1]); if (kt[0]) adim.push(kt[1]);
      if (kisi > 2) { top += (kisi - 2) * 600; adim.push("2 kişiden sonra " + (kisi - 2) + " kişi × 600 BTU"); }
      if (oda === "mutfak") { top += 4000; adim.push("mutfak +4.000 BTU"); }
      top = Math.round(top / 100) * 100;
      var sinif = null; for (i = 0; i < SINIF.length; i++) if (top <= SINIF[i]) { sinif = SINIF[i]; break; }
      var oneri = sinif ? nokta(sinif) + " BTU" : "Tek cihaz yetmez";
      var aciklama = sinif ? (top > sinif * 0.92 ? "Hesap sınıfın üst sınırına yakın; keşifte bir üst sınıf da değerlendirilir." : "Bu sınıf odayı rahat karşılar.") : "24.000 BTU'nun üstünde: iki ayrı cihaz, salon tipi ya da multi sistem önerilir; keşif gerekir.";
      if (oda === "yatak" && sinif) aciklama += " Yatak odasında sessiz çalışma (düşük dB) ve iç ünitenin yatağa doğrudan üflememesi önemlidir.";
      q(".b-sonuc").innerHTML = '<div class="izgara i2"><div><div class="not" style="margin:0">Hesaplanan ihtiyaç (yaklaşık)</div><div class="buyuk">~' + nokta(top) + ' BTU</div></div><div><div class="not" style="margin:0">Önerilen cihaz sınıfı</div><div class="buyuk">' + oneri + "</div></div></div><p style=\"margin-top:8px\">" + aciklama + '</p><ul class="plan" style="margin-top:6px">' + adim.map(function (a, j) { return "<li><b>" + (j + 1) + "</b><span>" + a + "</span></li>"; }).join("") + "</ul>";
      var odaAd = q(".b-oda").selectedOptions[0].textContent;
      btuSon = (sinif ? nokta(sinif) + " BTU" : "~" + nokta(top) + " BTU (çoklu cihaz)") + " · " + odaAd.toLocaleLowerCase("tr") + " " + m2 + " m² · " + q(".b-cephe").selectedOptions[0].textContent.split(" ·")[0].toLocaleLowerCase("tr") + " cephe";
      E.fotoDegis(q(".b-foto"), sinif ? "../img/t_ic.jpg" : "../img/t_montaj.jpg", sinif ? "Duvar tipi split iç ünite" : "Birden fazla dış ünite");
      q(".b-alt").textContent = sinif ? "Duvar tipi split iç ünite · " + oneri : "Büyük alanlarda birden fazla cihaz ya da multi sistem";
    }
    k.querySelectorAll(".b-kisi .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".b-kisi .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); kisi = +c.dataset.n; hes(); }; });
    k.querySelector('.b-kisi .cip[data-n="2"]').classList.add("on");
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hes; }); hes();
    q(".b-gonder").onclick = function () { waAc("Merhaba, klima için keşif istiyorum.\nOda: " + btuSon + "\nKişi: " + kisi + "\nKat: " + q(".b-kat").selectedOptions[0].textContent + "\nAdres / ilçe: "); };
    q(".b-rv").onclick = function () {
      var c = document.querySelector(".rv-cihaz"), h = document.querySelector(".rv-hiz"), r = document.getElementById("randevu");
      if (c) c.value = btuSon; if (h) { for (var i = 0; i < h.options.length; i++) if (/^Montaj/.test(h.options[i].text)) h.selectedIndex = i; }
      if (r) r.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }
  // [anahtar, belirti, olası neden, evde güvenle, ne zaman usta, seviye, seviye metni, foto, foto açıklaması]
  var ARIZA = [
    ["damlama", "İç üniteden su damlıyor", "Yoğuşma suyunu dışarı atan tahliye (drenaj) hortumu tıkanmış ya da ezilmiş olabilir; kirli filtrede iç ünite peteği buzlanıp eriyince de su taşar. Montaj eğimi bozulmuşsa su ters akar.", ["Klimayı kapatın, altına kap ya da havlu koyun.", "Ön kapağı açıp filtreyi çıkarın, ılık suyla yıkayın, gölgede kurutup takın.", "Dışarıdaki tahliye hortumunun ucunun ezik, tıkalı ya da suyun içinde olmadığına bakın."], "Su prize ya da elektrik aksamına yakınsa sigortayı indirin ve kullanmayın; aynı gün servis çağırın. Filtre temizliğinden sonra da damlıyorsa drenaj hattı temizlenmelidir.", "bugun", "Aynı gün", "t_damlama", "Yoğuşma suyu: tahliye hattı tıkanınca iç üniteden taşar"],
    ["sogutmuyor", "Soğutmuyor / az soğutuyor", "En sık neden kirli filtre ve iç ünite peteğidir. Mod ya da derece ayarı, hava alamayan ya da kirli dış ünite ve gaz eksikliği (kaçak) de soğutmayı düşürür.", ["Kumandada modun soğutma (❄ / COOL) olduğunu ve derecenin oda sıcaklığından düşük ayarlı olduğunu kontrol edin.", "Filtreyi temizleyin; kapı ve pencereleri kapatın.", "Dış ünitenin önünde hava akışını kesen eşya, çamaşır ya da örtü olmadığına bakın."], "Bu adımlardan sonra düzelmiyorsa, dış ünite hiç çalışmıyorsa ya da borularda buzlanma görüyorsanız servis çağırın. Gaz yalnız kaçak bulunup giderildikten sonra tamamlanır.", "bugun", "Birkaç gün içinde", "t_sogutmuyor", "Antalya yazında az soğutan klima: önce filtre, sonra ölçüm"],
    ["koku", "Kötü koku geliyor", "Rutubet ya da küf kokusu genelde filtrede, iç ünite peteğinde ve drenaj tavasında biriken nem ve kirden gelir. Yanık ya da plastik kokusu ise elektriksel bir sorun belirtisi olabilir.", ["Filtreyi yıkayın ve tamamen kurutup takın.", "Kapatmadan önce 10–15 dakika yalnız fan modunda çalıştırıp içini kurutun.", "Yanık / plastik kokusu varsa hemen kapatın ve sigortayı indirin."], "Küf kokusu filtre temizliğiyle geçmiyorsa iç ünitenin ilaçlı temizliği gerekir. Yanık kokusunda cihazı açmayın, aynı gün servis çağırın.", "plan", "Planlı bakım", "t_koku", "Nemli iç ünitede küf: koku buradan gelir"],
    ["ses", "Ses / titreşim yapıyor", "Gevşemiş kapak ya da vida, fan pervanesine değen yabancı cisim, dış ünitenin eskimiş titreşim takozları ya da zorlanan kompresör.", ["Dış ünitenin üstünde ya da çevresinde ona değen bir eşya olup olmadığına bakın.", "İç ünite ön kapağının yerine tam oturduğunu kontrol edin.", "Sesin iç üniteden mi dış üniteden mi geldiğini not edin."], "Metal sürtme, tıkırtı ya da yeni başlayan yüksek uğultu varsa cihazı kullanmayı azaltın ve servis çağırın; ses büyürse parça zarar görebilir.", "bugun", "Birkaç gün içinde", "t_ses", "Dış ünite: fan ve takozlar ses kaynağı olabilir"],
    ["kod", "Hata kodu / ışık yanıp sönüyor", "Cihaz kendini korumaya almıştır: sensör, fan motoru, iç-dış ünite iletişimi ya da basınç uyarısı olabilir. Kodun anlamı markaya ve modele göre değişir.", ["Ekrandaki kodu ya da ışığın kaç kez yanıp söndüğünü not edin.", "Klimayı kapatın, sigortadan 5 dakika enerjisini kesin, sonra yeniden açın."], "Kod geri geliyorsa tekrar tekrar resetlemeyin. Kodu ve markayı aşağıya yazıp gönderin; usta parçayı ona göre getirir.", "bugun", "Birkaç gün içinde", "t_kod", "Kumanda ve ekran: kodu not edin"],
    ["calismiyor", "Hiç açılmıyor / kumandaya tepki yok", "Kumanda pili bitmiş, sigorta atmış, priz ya da hat sorunu veya elektronik kart arızası olabilir.", ["Kumanda pillerini değiştirin.", "Klimanın sigortasının açık olduğunu kontrol edin.", "İç ünitede manuel/acil çalıştırma düğmesi varsa onunla açmayı deneyin."], "Sigorta tekrar atıyorsa yeniden kaldırmayın; servis çağırın. Sık atan sigorta kablo ya da kompresör sorununa işaret edebilir.", "acil", "Sigorta atıyorsa hemen", "t_ic", "İç ünite: ışık ve ekran tepki vermiyor"]
  ];
  var arizaSec = ARIZA[0];
  function ariza(k) {
    var q = function (s) { return E.q(k, s); };
    q(".a-sec").innerHTML = ARIZA.map(function (a, i) { return '<button type="button" class="cip" data-i="' + i + '">' + a[1] + "</button>"; }).join("");
    function goster() {
      var a = arizaSec;
      q(".a-sonuc").innerHTML = '<span class="seviye ' + a[5] + '">' + a[6] + '</span><div class="buyuk" style="font-size:1.25rem;margin-top:10px">' + a[1] + '</div><p style="margin-top:6px"><b>Olası neden:</b> ' + a[2] + '</p><p style="margin-top:8px"><b>Evde güvenle deneyebilecekleriniz:</b></p><ul class="plan">' + a[3].map(function (x, i) { return "<li><b>" + (i + 1) + "</b><span>" + x + "</span></li>"; }).join("") + '</ul><p style="margin-top:8px"><b>Usta ne zaman?</b> ' + a[4] + "</p>";
      E.fotoDegis(q(".a-foto"), "../img/" + a[7] + ".jpg", a[8]); q(".a-alt").textContent = a[8];
    }
    k.querySelectorAll(".a-sec .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".a-sec .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); arizaSec = ARIZA[+c.dataset.i]; goster(); }; });
    k.querySelector(".a-sec .cip").classList.add("on"); goster();
    q(".a-gonder").onclick = function () { waAc("Merhaba, klimam için servis istiyorum.\nMarka: " + q(".a-marka").value + "\nSorun: " + arizaSec[1] + (q(".a-kod").value ? "\nHata kodu: " + q(".a-kod").value : "") + "\nAdres / ilçe: "); };
  }
  // Bakım: servis aralığı (ay) ve filtre aralığı (gün)
  var KUL = { yaz: [12, "Yılda 1 kez, yaz sezonundan önce (Nisan–Mayıs)"], iki: [6, "Yılda 2 kez: yaz öncesi ve kış öncesi (Nisan + Ekim)"], yil: [4, "Yılda 3 kez, 4 ayda bir"] };
  var ORTAM = { normal: [14, "İki haftada bir"], evcil: [7, "Haftada bir (tüy ve duman filtreyi çabuk tıkar)"], toz: [7, "Haftada bir (toz filtreyi çabuk tıkar)"], mutfak: [7, "Haftada bir (yağ buharı filtreye yapışır)"] };
  var YAPILAN = ["Filtrelerin sökülüp yıkanması", "İç ünite peteğinin (evaporatör) ve fanının ilaçlı temizliği", "Drenaj tavası ve tahliye hattının açılması", "Dış ünite peteğinin (kondenser) temizliği", "Basınç / gaz ölçümü, kaçak kontrolü", "Elektrik bağlantıları ve çekilen akımın kontrolü"];
  function bakim(k) {
    var q = function (s) { return E.q(k, s); }, olay = [];
    var t = new Date(); t.setMonth(t.getMonth() - 10); q(".k-son").value = t.toISOString().slice(0, 7);
    q(".k-liste").innerHTML = YAPILAN.map(function (x, i) { return "<li><b>" + (i + 1) + "</b><span>" + x + "</span></li>"; }).join("");
    function hes() {
      var son = new Date((q(".k-son").value || new Date().toISOString().slice(0, 7)) + "-01T10:00"), ku = KUL[q(".k-kul").value], or = ORTAM[q(".k-ortam").value], adet = Math.max(1, +q(".k-adet").value || 1);
      var bugun = new Date(); bugun.setHours(10, 0, 0, 0);
      var sonraki = new Date(son); sonraki.setMonth(sonraki.getMonth() + ku[0]);
      var gecti = sonraki < bugun; if (gecti) { sonraki = new Date(bugun); sonraki.setDate(sonraki.getDate() + 3); }
      if (sonraki.getDay() === 0) sonraki.setDate(sonraki.getDate() + 1);
      var ay = Math.max(0, Math.round((bugun - son) / (30.4 * 864e5)));
      olay = [{ tarih: sonraki, dk: 60, baslik: "Klima servis bakımı" + (adet > 1 ? " (" + adet + " cihaz)" : "") + " · " + (window.ISL.ad || ""), aciklama: "Telefon: " + (window.ISL.tel || "") }];
      var f = new Date(bugun); f.setHours(19, 0);
      for (var i = 0; i < 4; i++) { f = new Date(f); f.setDate(f.getDate() + or[0]); olay.push({ tarih: f, dk: 15, baslik: "Klima filtresini temizle", aciklama: "Ön kapağı aç, filtreyi ılık suyla yıka, gölgede kurut, tak." }); }
      q(".k-sonuc").innerHTML = '<div class="izgara i3"><div><div class="not" style="margin:0">Son bakımdan beri</div><div class="buyuk">' + ay + ' ay</div></div><div><div class="not" style="margin:0">Sonraki servis bakımı</div><div class="buyuk" style="font-size:1.2rem">' + (gecti ? "Gecikti · " : "") + E.tarih(sonraki) + '</div></div><div><div class="not" style="margin:0">Filtre temizliği</div><div class="buyuk" style="font-size:1.2rem">' + or[1].split(" (")[0] + "</div></div></div><p style=\"margin-top:8px\"><b>Servis bakımı sıklığı:</b> " + ku[1] + ". <b>Filtre:</b> " + or[1] + ".</p>" + (gecti ? '<p><span class="seviye bugun">Bakım zamanı geçti</span> Kirli petek soğutmayı düşürür ve koku yapar; ilk uygun güne randevu önerilir.</p>' : "");
      k.dataset.ozet = ay + " aydır servis bakımı yapılmadı · " + q(".k-kul").selectedOptions[0].textContent + " · " + q(".k-ortam").selectedOptions[0].textContent + (adet > 1 ? " · " + adet + " cihaz" : "");
    }
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hes; }); hes();
    q(".k-ics").onclick = function () { E.ics("klima-bakim", olay); };
    q(".k-gonder").onclick = function () { waAc("Merhaba, klima bakımı için randevu istiyorum.\n" + k.dataset.ozet + "\nAdres / ilçe: "); };
  }
  var MONTAJ = ["Dış ünitenin konacağı yer belli (balkon, cephe ya da çatı); gerekiyorsa site yönetiminin izni alındı", "İç ünite yeri: tavandan en az 15 cm boşluk, yatağa ya da koltuğa doğrudan üflemiyor", "Klima için ayrı sigortalı elektrik hattı var ya da çekilmesi konuşuldu", "Yoğuşma suyunun akacağı yer belli (gider ya da dış cephe)", "İç ve dış ünite arası mesafe yaklaşık ölçüldü (uzun mesafede ek boru gerekir)", "Cihazın marka, model ve BTU bilgisi elinizde"];
  function montaj(k) {
    var q = function (s) { return E.q(k, s); };
    q(".m-liste").innerHTML = MONTAJ.map(function (m, i) { return '<li><input type="checkbox" id="km' + i + '"><span><label for="km' + i + '">' + m + "</label></span></li>"; }).join("");
    function say() {
      var c = k.querySelectorAll(".m-liste input"), n = 0; c.forEach(function (x) { if (x.checked) n++; x.closest("li").classList.toggle("ok", x.checked); });
      q(".m-cubuk").style.width = Math.round(n / c.length * 100) + "%";
      q(".m-sonuc").innerHTML = n === c.length ? "<b>Hazırsınız.</b> Montaj için gereken bilgiler tamam; randevuda usta ile netleşir." : "<b>" + n + " / " + c.length + "</b> hazır. Eksikleri usta keşifte sizinle birlikte netleştirir.";
    }
    k.querySelectorAll(".m-liste input").forEach(function (x) { x.onchange = say; }); say();
    q(".m-gonder").onclick = function () {
      var eksik = []; k.querySelectorAll(".m-liste input").forEach(function (x, i) { if (!x.checked) eksik.push("• " + MONTAJ[i]); });
      var cihaz = document.querySelector(".rv-cihaz");
      waAc("Merhaba, klima montajı için bilgi almak istiyorum." + (cihaz && cihaz.value ? "\nCihaz: " + cihaz.value : "") + (eksik.length ? "\nHenüz netleşmeyenler:\n" + eksik.join("\n") : "\nMontaj öncesi kontrol listesinin hepsi hazır.") + "\nAdres / ilçe: ");
    };
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".btu").forEach(btu); document.querySelectorAll(".ariza").forEach(ariza); document.querySelectorAll(".bakim").forEach(bakim); document.querySelectorAll(".montaj").forEach(montaj);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Klima bakımı / temizliği", "Arıza tespiti", "Montaj (yeni klima)", "Söküm / yer değiştirme", "Gaz kaçağı kontrolü", "Keşif (BTU ve yer seçimi)"], [["Adres", ".rv-ilce"], ["Cihaz", ".rv-cihaz"]]); });
  });
})();
