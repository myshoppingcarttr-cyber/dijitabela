// Kombi servisi premium modülü: Arıza çözücü (fotoğraflı, güvenli adımlar) + Bakım/tasarruf hesabı (.ics) + Servis randevusu + Usta takibi
(function () {
  var E = window.ESNAF;
  var ARIZA = [
    ["basinc", "Basınç düşük / kombi su istiyor", "Tesisatta su eksilmiş ya da küçük bir kaçak var.", ["Kombinin altındaki doldurma musluğunu yavaşça açın.", "Manometre 1,2-1,5 bar'a gelince kapatın.", "Kombiyi kapatıp açın (reset)."], "Haftada birden fazla su istiyorsa kaçak vardır; usta çağırın."],
    ["petek", "Petekler ısınmıyor / yarısı soğuk", "Peteklerde hava ya da tortu birikmiş olabilir.", ["Kombi çalışırken peteğin üstündeki hava alma vanasını bezle tutup açın.", "Su gelince kapatın; basıncı tekrar 1,5 bar'a getirin."], "Hava alınca düzelmiyorsa petek temizliği (ilaçlı yıkama) gerekir."],
    ["ates", "Kombi yanmıyor / ateşleme hatası", "Gaz vanası kapalı, ateşleme elektrodu ya da gaz valfi arızası.", ["Sayaçtaki ve kombi altındaki gaz vanasının açık olduğunu kontrol edin.", "Ön paneldeki reset düğmesine bir kez basın."], "İki denemede yanmıyorsa tekrar tekrar resetlemeyin; usta çağırın. Gaz kokusu varsa 187'yi arayın."],
    ["kacak", "Kombiden su damlıyor", "Emniyet ventili, conta ya da bağlantı kaçağı.", ["Damlayan yerin altına kap koyun.", "Basınç 3 bar'ın üstündeyse kombiyi kapatın."], "Elektrik aksamına su gelmemesi için aynı gün usta çağırın."],
    ["basinc", "Sıcak su gelmiyor / ılık geliyor", "Üç yollu vana, plaka eşanjör tıkanıklığı ya da akış sensörü.", ["Musluğu tam açın; kombi ekranında musluk simgesi çıkıyor mu bakın.", "Kış modunda olduğunu kontrol edin."], "Kireçli suda plaka eşanjör tıkanır; temizlik ya da değişimle çözülür."]
  ];
  function kod(k) {
    var q = function (s) { return E.q(k, s); }, sec = ARIZA[0];
    q(".k-sec").innerHTML = ARIZA.map(function (a, i) { return '<button type="button" class="cip" data-i="' + i + '">' + a[1] + "</button>"; }).join("");
    function goster() {
      q(".k-sonuc").innerHTML = '<div class="buyuk" style="font-size:1.25rem">' + sec[1] + '</div><p style="margin-top:6px"><b>Olası neden:</b> ' + sec[2] + '</p><p style="margin-top:8px"><b>Evde güvenle deneyebilecekleriniz:</b></p><ul class="plan">' + sec[3].map(function (x, i) { return "<li><b>" + (i + 1) + "</b>" + x + "</li>"; }).join("") + '</ul><p style="margin-top:8px"><span class="seviye bugun">Usta ne zaman?</span> ' + sec[4] + "</p>";
      var foto = sec === ARIZA[4] ? "ates" : sec[0];
      E.fotoDegis(q(".k-foto"), "../img/t_" + foto + ".jpg", sec[1]); q(".k-alt").textContent = sec[1];
    }
    k.querySelectorAll(".k-sec .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".k-sec .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); sec = ARIZA[+c.dataset.i]; goster(); }; });
    k.querySelector(".k-sec .cip").classList.add("on"); goster();
    q(".k-gonder").onclick = function () { waAc("Merhaba, kombim için servis istiyorum.\nMarka: " + q(".k-marka").value + "\nSorun: " + sec[1] + (q(".k-kod").value ? "\nHata kodu: " + q(".k-kod").value : "")); };
  }
  function tasarruf(k) {
    var q = function (s) { return E.q(k, s); }, sonraki = null, t = new Date(); t.setMonth(t.getMonth() - 14); q(".t-son").value = t.toISOString().slice(0, 7);
    function hesap() {
      var son = new Date(q(".t-son").value + "-01T10:00"), ay = Math.max(0, (Date.now() - son) / (30.4 * 864e5)), fatura = +q(".t-fatura").value || 0, kayip = Math.min(20, Math.max(0, +q(".t-kayip").value || 0)), yas = +q(".t-yas").value;
      var oran = ay > 12 ? kayip / 100 : kayip / 100 * ay / 12, kis = fatura * 6, fazla = Math.round(kis * oran / (1 + oran));
      sonraki = new Date(son); sonraki.setFullYear(sonraki.getFullYear() + 1); if (sonraki < new Date()) { sonraki = new Date(); sonraki.setDate(sonraki.getDate() + 3); } sonraki.setHours(10, 0);
      q(".t-sonuc").innerHTML = '<div class="izgara i3"><div><div class="not" style="margin:0">Son bakımdan beri</div><div class="buyuk">' + Math.round(ay) + ' ay</div></div><div><div class="not" style="margin:0">Bu kış tahmini fazla harcama</div><div class="buyuk">~' + fazla.toLocaleString("tr-TR") + ' ₺</div></div><div><div class="not" style="margin:0">Bakım zamanı</div><div class="buyuk" style="font-size:1.2rem">' + (ay >= 12 ? "Geçti, hemen" : E.tarih(sonraki)) + "</div></div></div>" + (yas >= 12 ? '<p class="not">10 yaşın üstündeki kombilerde bakımda baca gazı ölçümü ve eşanjör kontrolü özellikle önemlidir.</p>' : "");
      k.dataset.ozet = Math.round(ay) + " aydır bakım yapılmadı, kış faturası ~" + fatura + " ₺";
    }
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hesap; }); hesap();
    q(".t-ics").onclick = function () { E.ics("kombi-bakim", [{ tarih: sonraki, baslik: "Kombi bakımı · " + (window.ISL.ad || ""), aciklama: "Telefon: " + (window.ISL.tel || "") }]); };
    q(".t-gonder").onclick = function () { waAc("Merhaba, kombi bakımı için randevu istiyorum. " + k.dataset.ozet + "."); };
  }
  function usta(k) {
    var q = function (s) { return E.q(k, s); }, adim = 1;
    var A = [["Talep alındı", "09:20 · Kepez / Varsak · Petekler ısınmıyor"], ["Usta atandı", "09:45 · Ziyaret aralığı 13:00-15:00"], ["Usta yolda", "13:10 · Tahmini varış 20 dk"], ["İşlem yapılıyor", "Petek hava alma + basınç ayarı"], ["Tamamlandı", "Fatura ve garanti belgesi WhatsApp'ta"]];
    function ciz() { q(".u-liste").innerHTML = A.map(function (a, i) { return '<li class="' + (i < adim ? "tamam" : i === adim ? "simdi" : "bekler") + '"><i>' + (i < adim ? "✓" : i + 1) + "</i><div><b>" + a[0] + '</b><div class="not" style="margin:2px 0 0">' + a[1] + "</div></div></li>"; }).join(""); }
    q(".u-ilerle").onclick = function () { adim = adim >= A.length - 1 ? 1 : adim + 1; ciz(); }; ciz();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".kod").forEach(kod); document.querySelectorAll(".tasarruf").forEach(tasarruf); document.querySelectorAll(".usta").forEach(usta);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Kombi yıllık bakımı", "Arıza onarımı", "Petek temizliği", "Klima bakımı / montajı", "Kombi montajı / değişimi"], [["Adres", ".rv-ilce"]]); });
  });
})();
