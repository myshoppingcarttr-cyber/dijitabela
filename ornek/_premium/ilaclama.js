// İlaçlama premium modülü (ARGE-007, 14 Eki 2026): haşere tanıma (fotoğraftan) · güvenlik süresi hesaplayıcı · keşif/uygulama randevusu
(function () {
  var E = window.ESNAF;
  // [ad, foto, nasıl anlaşılır, risk (seviye, metin), yöntem, seans]
  var H = {
    hamam: ["Hamamböceği", "t_hamam", "Gece mutfak ve banyoda, lavabo altında; ışık yanınca kaçar. Dışkı izleri siyah nokta gibidir.", ["bugun", "Hızlı çoğalır"], "Jel yem uygulaması (ev boşaltılmaz) + gerekirse giriş noktalarına sıvı uygulama.", "1 uygulama + 15 gün sonra kontrol"],
    karinca: ["Karınca", "t_karinca", "Tezgâh, pencere kenarı ve şekerli yiyecek çevresinde iz hâlinde yürür.", ["plan", "Rahatsız edici, genelde zararsız"], "Yuva hedefli jel yem; dış cephe ve giriş noktası uygulaması.", "1 uygulama"],
    tahtakurusu: ["Tahtakurusu", "t_tahtakurusu", "Yatak dikişlerinde, baza ve başlıkta küçük kahverengi böcekler; çarşafta kan lekeleri, sabah sıralı ısırıklar.", ["acil", "Kendiliğinden geçmez, yayılır"], "Yatak, baza ve odalara sıvı uygulama; tekstiller 60 °C'de yıkanır.", "2–3 uygulama, 10–14 gün arayla"],
    pire: ["Pire", "t_pire", "Halı ve evcil hayvan yatağı çevresinde zıplayan küçük böcekler; ayak bileğinde ısırık.", ["bugun", "Evcil hayvanla birlikte tedavi gerekir"], "Zemin ve tekstile sıvı uygulama + veteriner önerisiyle hayvanın tedavisi.", "2 uygulama, 14 gün arayla"],
    sivrisinek: ["Sivrisinek", "t_sivrisinek", "Akşam ve gece vızıltı; bahçede su biriken saksı, gider ve rögar çevresi.", ["plan", "Mevsimsel"], "Larva kaynağına uygulama + bahçe ve ortak alanda sisleme.", "Mevsim boyunca periyodik"],
    fare: ["Fare / sıçan", "t_fare", "Kemirilmiş ambalaj, dışkı, gece tavanda ya da duvarda tıkırtı.", ["acil", "Hastalık taşır, kablo kemirir"], "Kilitli yem istasyonları + giriş noktalarının tespiti ve kapatılması önerisi.", "İstasyonlar 3–4 hafta izlenir"],
    akrep: ["Akrep", "t_akrep", "Bahçeli evde taş, odun yığını ve duvar diplerinde; gece çıkar.", ["acil", "Sokması tehlikeli olabilir"], "Dış çevre ve duvar diplerine sıvı uygulama, saklanma yerlerinin temizliği.", "Mevsimde 2–3 uygulama"],
    orumcek: ["Örümcek", "t_orumcek", "Köşelerde, tavan birleşimlerinde ağ; depo ve bodrumda.", ["plan", "Çoğu zararsız"], "Ağ temizliği + köşe ve dış cepheye sıvı uygulama.", "1 uygulama"]
  };
  // Fotoğrafı canlının kendisi değil, belirtisi olan kartlar (stokta gerçek tahtakurusu/pire fotoğrafı yok)
  var KART = { tahtakurusu: "Tahtakurusu · yatakta iz", pire: "Pire · dostunuz kaşınıyor" };
  function tani(k) {
    var q = function (s) { return E.q(k, s); }, sec = "hamam";
    q(".t-tur").innerHTML = Object.keys(H).map(function (t) { return '<button type="button" data-t="' + t + '"><img src="../img/' + H[t][1] + '.jpg" alt="' + (KART[t] || H[t][0]) + '" loading="lazy"><span>' + (KART[t] || H[t][0]) + "</span></button>"; }).join("");
    function ciz() {
      var h = H[sec];
      q(".t-sonuc").innerHTML = '<span class="seviye ' + h[3][0] + '">' + h[3][1] + '</span><h3 style="margin-top:10px">' + h[0] + '</h3><ul class="plan" style="margin-top:6px"><li><b>Belirti</b><span>' + h[2] + "</span></li><li><b>Yöntem</b><span>" + h[4] + "</span></li><li><b>Seans</b><span>" + h[5] + '</span></li></ul><p class="not">Kesin tür ve yöntem keşifte belirlenir. Uygulamada Sağlık Bakanlığı ruhsatlı biyosidal ürün kullanılması zorunludur; uygulama sonrası ürün ve ruhsat bilgisini yazan belgeyi isteilir.</p>';
    }
    k.querySelectorAll(".t-tur button").forEach(function (b) { b.onclick = function () { k.querySelectorAll(".t-tur button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); sec = b.dataset.t; ciz(); }; });
    k.querySelector(".t-tur button").classList.add("on"); ciz();
    q(".t-gonder").onclick = function () { waAc("Merhaba, evimde/iş yerimde " + H[sec][0].toLocaleLowerCase("tr") + " sorunu var. Keşif ve uygulama için bilgi almak istiyorum.\nAdres / ilçe: "); };
  }
  // [dışarıda kalma saat, havalandırma dk, ek adımlar]
  var YONTEM = { jel: [0, 0, ["Jel noktalarını silmeyin, üzerine deterjan sürmeyin", "Çocukların ve evcil hayvanların erişemeyeceği yerlere uygulanır"]], pulv: [4, 30, ["Tezgâh ve yemek masasını dönüşte silin", "Uygulama yapılan zemini 3 gün ıslak paspaslamayın"]], ulv: [6, 60, ["Gıdaları kapalı dolaba kaldırın", "Dönüşte tüm pencereleri açın, yüzeyleri silin"]], kemirgen: [0, 0, ["Yem istasyonlarını açmayın, yerini değiştirmeyin", "Ölü hayvan görürseniz eldivenle alın, bize haber verin"]] };
  var EV = [["cocuk", "Bebek / çocuk", 2], ["evcil", "Kedi / köpek", 2], ["kus", "Kuş", 4], ["akvaryum", "Akvaryum", 0], ["hamile", "Hamile", 2], ["astim", "Astım / alerji", 2]];
  function guvenlik(k) {
    var q = function (s) { return E.q(k, s); }, ev = {};
    q(".g-ev").innerHTML = EV.map(function (e, i) { return '<button type="button" class="cip" data-i="' + i + '">' + e[1] + "</button>"; }).join("");
    function hes() {
      var y = YONTEM[q(".g-yontem").value], ekSaat = 0, adim = ["Uygulamadan önce gıdaları ve diş fırçalarını kapalı dolaba kaldırın"].concat(y[2]);
      Object.keys(ev).forEach(function (i) { var e = EV[i]; if (y[0]) ekSaat = Math.max(ekSaat, e[2]);
        if (e[0] === "akvaryum") adim.push("Akvaryumun üstünü streç filmle kapatın, hava motorunu uygulama süresince kapatın");
        if (e[0] === "kus") adim.push("Kuş kafesini uygulama boyunca evden çıkarın");
        if (e[0] === "evcil") adim.push("Evcil dostunuzun mama ve su kaplarını kaldırın; dönüşte yıkayın");
        if (e[0] === "cocuk") adim.push("Çocuk oyuncaklarını kapalı kutuya kaldırın; zemin kuruyana kadar çocuk yere oturmasın"); });
      var top = y[0] + ekSaat, sa = (q(".g-saat").value || "10:00").split(":"), don = new Date(); don.setHours(+sa[0] + top, +sa[1] + y[1], 0, 0);
      q(".g-sonuc").innerHTML = top || y[1] ? '<div class="buyuk">' + top + " saat dışarıda</div><p>" + (y[1] ? "Dönüşte " + y[1] + " dk havalandırma. " : "") + "Eve dönüş: <b>" + don.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) + "</b> sonrası" + (ekSaat ? " (evdekilere göre +" + ekSaat + " saat)" : "") + "</p>" : '<div class="buyuk">Evi boşaltmanız gerekmez</div><p>Bu yöntem kapalı yem/istasyonla yapılır.</p>';
      q(".g-liste").innerHTML = adim.map(function (a, i) { return '<li><input type="checkbox" id="ga' + i + '"><span><label for="ga' + i + '">' + a + "</label></span></li>"; }).join("");
      k.querySelectorAll(".g-liste input").forEach(function (c) { c.onchange = function () { c.closest("li").classList.toggle("ok", c.checked); }; });
    }
    k.querySelectorAll(".g-ev .cip").forEach(function (c) { c.onclick = function () { var i = c.dataset.i; if (ev[i]) delete ev[i]; else ev[i] = 1; c.classList.toggle("on", !!ev[i]); hes(); }; });
    q(".g-yontem").onchange = q(".g-saat").oninput = hes; hes();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tani").forEach(tani); document.querySelectorAll(".guvenlik").forEach(guvenlik);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Keşif", "Hamamböceği / karınca", "Tahtakurusu", "Pire", "Kemirgen", "Bahçe / sivrisinek", "İşletme periyodik sözleşme"], [["Mekân", ".rv-mekan"], ["m²", ".rv-m2"]]); });
  });
})();
