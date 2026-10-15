/* Medigün · hasta deneyimi paneli demosu. Tüm sayılar ÖRNEK veridir (sabit tohumla üretilir). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = MG.esc;
  var sube = $("p-sube"), donem = $("p-donem");

  sube.innerHTML = '<option value="">Tüm kurumlar</option>' + MG.subeler.map(function (s) {
    return '<option value="' + s.kod + '">' + esc(s.kisa) + "</option>";
  }).join("");

  /* Basit, tekrarlanabilir sözde rastgele sayı: aynı seçim aynı örnek veriyi verir */
  function tohum(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; }; }
  function virgul(x) { return x.toFixed(1).replace(".", ","); }

  var yorumlar = [
    { kisi: "Örnek Kullanıcı A", puan: 5, metin: "Kayıt işlemleri hızlıydı, danışmadaki personel ilgiliydi." },
    { kisi: "Örnek Kullanıcı B", puan: 2, metin: "Otoparkta yer bulmak zordu, bekleme salonu çok kalabalıktı." },
    { kisi: "Örnek Kullanıcı C", puan: 3, metin: "Telefonla ulaşmak uzun sürdü, hat sürekli meşguldü." }
  ];
  var bildirimler = [
    ["Bekleme süresi", "Poliklinik", "Arandı"],
    ["Telefon hattına ulaşım", "Çağrı merkezi", "Açık"],
    ["Otopark yönlendirmesi", "İdari işler", "Açık"],
    ["Fatura açıklaması", "Hasta kabul", "Çözüldü"]
  ];

  function yanitTaslagi(y) {
    if (y.puan >= 4) {
      return "Değerli ziyaretçimiz, geri bildiriminiz için teşekkür ederiz. Görüşünüz ilgili ekibimize iletilmiştir.";
    }
    return "Değerli ziyaretçimiz, yaşadığınız durumu öğrenmek ve iyileştirmek isteriz. Lütfen Hasta Hakları Birimimize " + MG.cagri.goster +
      " numarasından ulaşın. Kişisel ve sağlık bilgilerinizi bu platformda paylaşmamanızı rica ederiz.";
  }

  function ciz() {
    var anahtar = (sube.value || "tum") + "-" + donem.value;
    var r = tohum(anahtar);
    var carpan = donem.value === "7" ? 0.25 : donem.value === "90" ? 3 : 1;
    var kurumSay = sube.value ? 1 : MG.subeler.length;
    var anket = Math.round((60 + r() * 90) * carpan * kurumSay);
    var ort = 3.9 + r() * 0.8;
    var acik = Math.max(1, Math.round((2 + r() * 6) * Math.sqrt(carpan) * (sube.value ? 1 : 2)));
    var gy = Math.max(3, Math.round((6 + r() * 18) * carpan * (sube.value ? 1 : 2.5)));
    var yanit = Math.max(1, gy - Math.round(r() * 4));
    $("kpi").innerHTML = [
      ["Anket yanıtı", anket, "seçili dönem"],
      ["Ortalama puan", virgul(ort) + " / 5", "hizmet deneyimi anketi"],
      ["Açık geri bildirim", acik, "Hasta Hakları Birimi"],
      ["Yanıtlanan Google yorumu", yanit + " / " + gy, "onaylı yanıtlar"]
    ].map(function (k) {
      return '<li><span>' + k[0] + ' <span class="ornek">Örnek</span></span><b>' + k[1] + "</b><span>" + k[2] + "</span></li>";
    }).join("");

    var gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
    var degerler = gunler.map(function () { return 3.6 + r() * 1.3; });
    $("cubuklar").innerHTML = degerler.map(function (v) {
      return '<div style="height:' + Math.round(((v - 1) / 4) * 100) + '%"><span>' + virgul(v) + "</span></div>";
    }).join("");
    $("cubuklar").setAttribute("aria-label", "Örnek veri, günlük anket ortalamaları: " + degerler.map(function (v, i) { return gunler[i] + " " + virgul(v); }).join(", "));

    $("bildirimler").innerHTML = bildirimler.slice(0, Math.min(bildirimler.length, acik + 1)).map(function (b) {
      var cls = b[2] === "Çözüldü" ? "hazir" : "bekliyor";
      return "<tr><td>" + esc(b[0]) + "</td><td>" + esc(b[1]) + '</td><td><span class="durum ' + cls + '">' + esc(b[2]) + "</span></td></tr>";
    }).join("");
  }

  function yorumCiz() {
    $("yorumlar").innerHTML = yorumlar.map(function (y, i) {
      var yildiz = "★★★★★".slice(0, y.puan) + "☆☆☆☆☆".slice(0, 5 - y.puan);
      return '<div class="yorum"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>' + esc(y.kisi) + '</b><span class="yildiz" aria-label="5 üzerinden ' + y.puan + ' yıldız">' + yildiz + "</span></div>" +
        "<p style=\"margin:4px 0 8px\">" + esc(y.metin) + "</p>" +
        '<button type="button" class="dugme kucuk ikincil" data-yorum="' + i + '" aria-expanded="false" aria-controls="taslak-' + i + '">Yanıt taslağı hazırla</button>' +
        '<div id="taslak-' + i + '" hidden></div></div>';
    }).join("");
  }
  $("yorumlar").addEventListener("click", function (e) {
    var b = e.target.closest("[data-yorum]");
    if (b) {
      var i = +b.getAttribute("data-yorum"), alan = $("taslak-" + i), y = yorumlar[i];
      alan.hidden = false; b.setAttribute("aria-expanded", "true");
      alan.innerHTML = '<div class="taslak" role="status"><b>YZ yanıt taslağı</b><br>' + esc(yanitTaslagi(y)) +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button type="button" class="dugme kucuk" data-onay="' + i + '">Onayla (demo)</button><button type="button" class="dugme kucuk sade" data-duzen="' + i + '">Düzenle</button></div>' +
        '<p class="not" style="margin:8px 0 0">Kontrol: hasta olduğunu doğrulamıyor · sağlık bilgisi yok · karşılık teklifi yok</p></div>';
      return;
    }
    var o = e.target.closest("[data-onay]");
    if (o) { o.textContent = "Onaylandı · demo, gönderilmedi"; o.disabled = true; return; }
    var d = e.target.closest("[data-duzen]");
    if (d) {
      var k = +d.getAttribute("data-duzen");
      var kutu = d.closest(".taslak");
      kutu.innerHTML = '<label for="duzen-' + k + '"><b>Yanıtı düzenle</b></label><textarea id="duzen-' + k + '" rows="4" style="margin-top:6px">' + esc(yanitTaslagi(yorumlar[k])) + "</textarea>" +
        '<button type="button" class="dugme kucuk" style="margin-top:8px" data-onay="' + k + '">Onayla (demo)</button>';
      $("duzen-" + k).focus();
    }
  });

  sube.addEventListener("change", ciz);
  donem.addEventListener("change", ciz);
  ciz(); yorumCiz();
})();
