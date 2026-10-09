// Nakliyat premium modülü: Taşıma planlayıcı (araç fotoğraflı) + Eşya listesi (m³/koli) + Taşınma günü planı (.ics)
(function () {
  var E = window.ESNAF;
  // ev tipi → yaklaşık hacim (m³)
  var HACIM = { 0: 22, 1: 14, 2: 24, 3: 34, 4: 44, 5: 60 };
  function arac(m3) { return m3 <= 12 ? ["kamyonet", "Kamyonet (12 m³'e kadar)"] : m3 <= 32 ? ["kamyon", "Orta boy kapalı kasa kamyon"] : ["tir", "Büyük kasa kamyon"]; }
  function hesap(k) {
    var q = function (s) { return E.q(k, s); };
    function calis() {
      var ev = +q(".h-ev").value, m = +q(".h-mesafe").value, k1 = +q(".h-k1").value || 0, k2 = +q(".h-k2").value || 0, asn = q(".h-asn").checked;
      var m3 = HACIM[ev], a = arac(m3), ekip = Math.max(2, Math.ceil(m3 / 12) + 1), yuksek = Math.max(k1, k2);
      var asansor = !asn && yuksek >= 4, saat = m3 / 8 + (asansor ? -0.5 : Math.max(0, yuksek - 1) * 0.35) + (q(".h-pak").checked ? m3 / 12 : 0) + (q(".h-mon").checked ? 1 : 0) + [0.5, 2, 6][m];
      saat = Math.max(2, Math.round(saat * 2) / 2);
      var gosterAd = asansor ? ["asansor", "Dış cephe eşya asansörü"] : a;
      q(".h-sonuc").innerHTML = '<div class="not" style="margin:0">Önerilen</div><div class="buyuk">' + a[1] + "</div><ul class=\"plan\" style=\"margin-top:10px\"><li><b>Hacim</b>~" + m3 + " m³</li><li><b>Ekip</b>" + ekip + " kişi</li><li><b>Asansör</b>" + (asansor ? "Gerekli (" + yuksek + ". kat, bina asansörü yok)" : asn ? "Bina asansörü yeterli" : "Gerekmez") + "</li><li><b>Süre</b>~" + saat.toString().replace(".", ",") + " saat" + (m === 2 ? " + yol" : "") + "</li>" + (q(".h-dep").checked ? "<li><b>Depo</b>Kapalı, sigortalı depolama</li>" : "") + '</ul><p class="not">Kesin fiyat için ücretsiz ekspertiz: görüntülü görüşme ya da yerinde.</p>';
      E.fotoDegis(q(".h-foto"), "../img/t_" + gosterAd[0] + ".jpg", gosterAd[1]); q(".h-alt").textContent = gosterAd[1];
      k.dataset.ozet = q(".h-ev").selectedOptions[0].text + " · " + q(".h-mesafe").selectedOptions[0].text + " · kat " + k1 + " → " + k2 + (asn ? " (asansörlü bina)" : "") + " · " + a[1] + ", " + ekip + " kişi" + (asansor ? " + eşya asansörü" : "") + (q(".h-pak").checked ? " · paketleme" : "") + (q(".h-mon").checked ? " · montaj" : "") + (q(".h-dep").checked ? " · depolama" : "");
    }
    k.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = calis; }); calis();
    q(".h-gonder").onclick = function () { waAc("Merhaba, taşınma için ücretsiz ekspertiz istiyorum.\n" + k.dataset.ozet); };
  }
  var ESYA = [["Koltuk takımı (3+3+1)", 3.5], ["Yatak (çift kişilik)", 1.2], ["Yatak (tek kişilik)", 0.7], ["Gardırop", 1.8], ["Yemek masası + sandalyeler", 1.2], ["Buzdolabı", 0.9], ["Çamaşır makinesi", 0.5], ["Bulaşık makinesi", 0.4], ["Televizyon + ünite", 0.8], ["Kitaplık / vitrin", 1], ["Çalışma masası", 0.6], ["Halı", 0.2], ["Bisiklet", 0.4], ["Saksı / bitki", 0.15], ["Koli (hazır)", 0.08]];
  function esya(k) {
    var q = function (s) { return E.q(k, s); }, bas = { 0: 1, 1: 1, 3: 2, 5: 1, 6: 1, 8: 1 };
    q(".e-liste").innerHTML = ESYA.map(function (e, i) { return "<label>" + e[0] + '<span class="sayac" data-i="' + i + '"><button type="button" aria-label="azalt">−</button><span>' + (bas[i] || 0) + '</span><button type="button" aria-label="artır">+</button></span></label>'; }).join("");
    function calis() {
      var m3 = 0, liste = [];
      k.querySelectorAll(".sayac").forEach(function (s) { var n = +s.querySelector("span").textContent, e = ESYA[+s.dataset.i]; if (n) { m3 += n * e[1]; liste.push(n + " × " + e[0]); } });
      var koli = Math.round(m3 * 3.2 + 8), a = arac(m3 * 1.15);
      k.dataset.liste = liste.join("\n");
      q(".e-sonuc").innerHTML = '<div class="izgara i3"><div><div class="not" style="margin:0">Eşya hacmi</div><div class="buyuk">' + m3.toFixed(1).replace(".", ",") + ' m³</div></div><div><div class="not" style="margin:0">Önerilen koli</div><div class="buyuk">~' + koli + '</div></div><div><div class="not" style="margin:0">Araç</div><div class="buyuk" style="font-size:1.15rem">' + a[1] + "</div></div></div>";
    }
    E.sayaclar(k, calis); calis();
    q(".e-gonder").onclick = function () { waAc("Merhaba, taşınacak eşya listem:\n" + k.dataset.liste + "\nFiyat alabilir miyim?"); };
  }
  var PLAN = [[-21, "Taşınma tarihini kesinleştirin, ekspertiz yaptırın"], [-14, "Elektrik, su, doğalgaz ve internet nakil başvuruları"], [-10, "Kullanmadığınız eşyaları ayırın: bağış / satış"], [-7, "Kolileri teslim alın, az kullanılan odadan başlayın"], [-3, "e-Devlet'ten adres değişikliği randevusu, banka ve kargo adresleri"], [-1, "Buzdolabını boşaltıp kapağını açık bırakın, değerli eşyaları ayırın"], [0, "Taşınma günü: sayaçların fotoğrafını çekin, son tur kontrolü"], [2, "Yeni adreste sayaç okuma ve abonelik açılışlarını kontrol edin"]];
  function planla(k) {
    var q = function (s) { return E.q(k, s); }, t = new Date(); t.setDate(t.getDate() + 30); q(".p-tarih").value = t.toISOString().slice(0, 10);
    function liste() {
      var g = new Date(q(".p-tarih").value + "T09:00");
      q(".p-liste").innerHTML = PLAN.map(function (p) { var d = new Date(g); d.setDate(d.getDate() + p[0]); return "<li><b>" + d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + "</b>" + p[1] + "</li>"; }).join("");
    }
    q(".p-tarih").onchange = liste; liste();
    q(".p-ics").onclick = function () { var g = new Date(q(".p-tarih").value + "T09:00"); E.ics("tasinma-plani", PLAN.map(function (p) { var d = new Date(g); d.setDate(d.getDate() + p[0]); return { tarih: d, baslik: "Taşınma: " + p[1], aciklama: (window.ISL.ad || "") + " · " + (window.ISL.tel || "") }; })); };
  }
  document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll(".hesap").forEach(hesap); document.querySelectorAll(".esyal").forEach(esya); document.querySelectorAll(".planla").forEach(planla); });
})();
