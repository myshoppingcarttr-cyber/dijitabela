/* Medigün · online sonuç bildirimi akışı demosu (maket; gerçek veri yok, hiçbir şey gönderilmez) */
(function () {
  "use strict";
  var ekran = document.getElementById("sonuc-ekran");
  var adimlar = document.querySelectorAll("#sonuc-adimlar li");
  if (!ekran) return;
  var kanal = "sms";

  function adimIsaretle(i) {
    Array.prototype.forEach.call(adimlar, function (li, j) {
      li.classList.toggle("bitti", j < i);
      if (j === i) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
  }
  function odak() { ekran.focus({ preventScroll: true }); }

  function adim1(odakla) {
    adimIsaretle(0);
    var sms = kanal === "sms";
    ekran.innerHTML =
      '<span class="ornek">Örnek veri</span>' +
      '<h3 style="margin-top:10px">1 · Bildirim</h3>' +
      '<div class="sekmeli" role="group" aria-label="Bildirim kanalı">' +
        '<button type="button" data-kanal="sms" aria-pressed="' + sms + '">SMS</button>' +
        '<button type="button" data-kanal="eposta" aria-pressed="' + !sms + '">E-posta</button>' +
      "</div>" +
      (sms
        ? '<div class="sms"><small>Medigün · şimdi</small>Sayın A*** Y***, Medigün Akhisar\'daki tetkik sonuçlarınız hazır. Görüntülemek için güvenli bağlantı: medigun.example/s/7Kq2 · Bu mesaj sağlık bilgisi içermez.</div>'
        : '<div class="sms"><small>Konu: Tetkik sonuçlarınız hazır · gönderen: sonuc@medigun.example</small>Sayın A*** Y***,<br>Medigün Akhisar\'da yaptırdığınız tetkiklerin sonuçları hazırdır. Sonuçlarınızı güvenli giriş sayfasından görüntüleyebilirsiniz. Bu e-posta sağlık bilgisi içermez.</div>') +
      '<p class="not">Bildirim yalnız kayıt sırasında bu kanala izin veren hastaya gider; tanıtım içermez.</p>' +
      '<button type="button" class="dugme" data-git="2">Bağlantıyı aç</button>';
    if (odakla) odak();
  }

  function adim2(odakla) {
    adimIsaretle(1);
    ekran.innerHTML =
      '<span class="ornek">Maket · gerçek veri girmeyin</span>' +
      '<h3 style="margin-top:10px">2 · Güvenli giriş</h3>' +
      '<div class="kilit"><svg class="ikon" aria-hidden="true"><use href="#i-kilit"/></svg>Şifreli bağlantı · tek kullanımlık kod</div>' +
      '<form id="giris-form" novalidate>' +
        '<div class="form-satir"><label for="g-tc">T.C. kimlik no</label><input type="text" id="g-tc" inputmode="numeric" maxlength="11" autocomplete="off" placeholder="11 haneli" aria-describedby="g-tc-i"><div class="ipucu" id="g-tc-i">Demo: 11 hane yazın, örn. 00000000000. Bilgi saklanmaz.</div></div>' +
        '<div class="form-satir"><label for="g-dt">Doğum tarihi</label><input type="date" id="g-dt" autocomplete="off"></div>' +
        '<div class="form-satir"><label for="g-kod">Telefonunuza gelen 6 haneli kod</label><input type="text" id="g-kod" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="000000" aria-describedby="g-kod-i"><div class="ipucu" id="g-kod-i">Demo kodu: 000000</div></div>' +
        '<p class="not" role="alert" id="g-hata" style="color:#A91917"></p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="dugme sade" data-git="1">Geri</button><button type="submit" class="dugme">Giriş yap</button></div>' +
      "</form>";
    document.getElementById("giris-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var tc = document.getElementById("g-tc"), dt = document.getElementById("g-dt"), kod = document.getElementById("g-kod"), h = document.getElementById("g-hata");
      if (!/^\d{11}$/.test(tc.value)) { h.textContent = "T.C. kimlik numarası 11 haneli olmalı."; tc.focus(); return; }
      if (!dt.value) { h.textContent = "Doğum tarihini seçin."; dt.focus(); return; }
      if (kod.value !== "000000") { h.textContent = "Kod hatalı. Demo kodu: 000000"; kod.focus(); return; }
      tc.value = ""; kod.value = ""; dt.value = "";
      adim3(true);
    });
    if (odakla) odak();
  }

  function adim3(odakla) {
    adimIsaretle(2);
    ekran.innerHTML =
      '<span class="ornek">Örnek veri</span>' +
      '<h3 style="margin-top:10px">3 · Sonuçlarım</h3>' +
      '<p class="not">Protokol: 0000-ÖRNEK · Medigün Akhisar · 14.10.2026</p>' +
      '<ul class="sonuclar">' +
        '<li><span>Tam kan sayımı (hemogram)</span><span class="durum hazir">Hazır · PDF</span></li>' +
        '<li><span>Biyokimya paneli</span><span class="durum hazir">Hazır · PDF</span></li>' +
        '<li><span>Tiroid fonksiyon testi</span><span class="durum bekliyor">Hekim değerlendirmesi bekleniyor</span></li>' +
        '<li><span>Akciğer grafisi raporu</span><span class="durum bekliyor">Raporlanıyor</span></li>' +
      "</ul>" +
      '<p>Sonuçlarınızı yorumlamak için lütfen hekiminize danışın. Kontrol randevusu için <a href="#asistan">randevu asistanını</a> kullanabilirsiniz.</p>' +
      '<p class="not">Yayında sonuçlar e-Nabız ile de görüntülenebilir; PDF bağlantıları kısa süreli ve tek kullanımlıktır.</p>' +
      '<button type="button" class="dugme sade" data-git="1">Demoyu baştan izle</button>';
    if (odakla) odak();
  }

  ekran.addEventListener("click", function (e) {
    var k = e.target.closest("[data-kanal]");
    if (k) { kanal = k.getAttribute("data-kanal"); adim1(false); var b = ekran.querySelector('[data-kanal="' + kanal + '"]'); if (b) b.focus(); return; }
    var g = e.target.closest("[data-git]");
    if (!g) return;
    var n = g.getAttribute("data-git");
    if (n === "1") adim1(true); else if (n === "2") adim2(true); else adim3(true);
  });

  adim1(false);
})();
