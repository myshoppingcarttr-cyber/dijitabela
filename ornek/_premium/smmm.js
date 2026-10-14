// Mali müşavir (SMMM) premium modülü (ARGE-007, 14 Eki 2026): vergi takvimi (60 gün, .ics) · belge listesi (işaretle, eksikleri gönder) · ön görüşme randevusu
(function () {
  var E = window.ESNAF;
  // Yükümlülük kuralları (GİB genel takvimi): aylık [gün], dönemsel [[ay, gün], ...]; ay 1-12
  var Y = {
    kdv: ["KDV beyannamesi ve ödemesi (önceki ay)", { aylik: 28 }],
    muh: ["Muhtasar ve prim hizmet (MUHSGK) beyannamesi", { aylik: 26 }],
    gecici: ["Geçici vergi beyannamesi ve ödemesi", { donem: [[5, 17], [8, 17], [11, 17]] }],
    babs: ["Form Ba-Bs bildirimi (önceki ay, sınırı aşanlar)", { aysonu: true }],
    yillik: ["Yıllık gelir vergisi beyannamesi", { donem: [[3, 31]] }],
    yillikT: ["Gelir vergisi 2. taksit ödemesi", { donem: [[7, 31]] }],
    kurumlar: ["Kurumlar vergisi beyannamesi ve ödemesi", { donem: [[4, 30]] }],
    kira: ["Kira geliri beyanı (yıllık beyanname)", { donem: [[3, 31]] }],
    mtv: ["Motorlu taşıtlar vergisi taksiti (aracınız varsa)", { donem: [[1, 31], [7, 31]] }]
  };
  var TUR = [["Şahıs (bilanço / işletme)", ["kdv", "muh", "gecici", "babs", "yillik", "yillikT", "mtv"]], ["Limited / anonim şirket", ["kdv", "muh", "gecici", "babs", "kurumlar", "mtv"]],
    ["Serbest meslek", ["kdv", "muh", "gecici", "yillik", "yillikT", "mtv"]], ["Basit usul esnaf", ["muh", "mtv"]], ["Yalnız kira geliri", ["kira", "yillikT"]]];
  var NOT = { 3: "Basit usul kazanç istisnası nedeniyle çoğu esnafın yıllık beyanı yoktur; muhtasar yalnız personel ya da stopaj varsa verilir.", 4: "Konut kira geliri istisna sınırının altındaysa beyan gerekmeyebilir; müşavirimiz teyit eder." };
  function isGunu(d) { while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); return d; }
  function olaylar(kodlar) {
    var bugun = new Date(); bugun.setHours(0, 0, 0, 0); var son = new Date(bugun), L = []; son.setDate(son.getDate() + 60);
    kodlar.forEach(function (k) {
      var r = Y[k][1];
      for (var a = -1; a <= 3; a++) {
        var y = bugun.getFullYear(), ay = bugun.getMonth() + a, adaylar = [];
        if (r.aylik) adaylar.push(new Date(y, ay, r.aylik));
        if (r.aysonu) adaylar.push(new Date(y, ay + 1, 0));
        if (r.donem && a >= 0) r.donem.forEach(function (p) { if ((bugun.getMonth() + a) % 12 === p[0] - 1) adaylar.push(new Date(y + Math.floor((bugun.getMonth() + a) / 12), p[0] - 1, p[1])); });
        adaylar.forEach(function (d) { d = isGunu(d); if (d >= bugun && d <= son && !L.some(function (x) { return x[1] === k && +x[0] === +d; })) L.push([d, k]); });
      }
    });
    return L.sort(function (a, b) { return a[0] - b[0]; });
  }
  function takvim(k) {
    var q = function (s) { return E.q(k, s); }, tur = 0, liste = [];
    q(".v-tur").innerHTML = TUR.map(function (t, i) { return '<button type="button" class="cip' + (i ? "" : " on") + '" data-i="' + i + '">' + t[0] + "</button>"; }).join("");
    function ciz() {
      liste = olaylar(TUR[tur][1]); var bugun = new Date();
      q(".v-liste").innerHTML = (liste.length ? liste.map(function (x) { var kalan = Math.ceil((x[0] - bugun) / 864e5); return "<li><b>" + x[0].toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + "</b><span>" + Y[x[1]][0] + (kalan <= 7 ? ' <span class="seviye ' + (kalan <= 3 ? "acil" : "bugun") + '">' + (kalan <= 0 ? "bugün" : kalan + " gün") + "</span>" : "") + "</span></li>"; }).join("") : '<li><span>Önümüzdeki 60 günde bu türde genel bir son gün yok.</span></li>') + (NOT[tur] ? '<li><span class="not" style="margin:0">' + NOT[tur] + "</span></li>" : "");
    }
    k.querySelectorAll(".v-tur .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".v-tur .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); tur = +c.dataset.i; ciz(); }; });
    ciz();
    q(".v-ics").onclick = function () { E.ics("vergi-takvimi", liste.map(function (x) { var d = new Date(x[0]); d.setDate(d.getDate() - 2); d.setHours(10, 0); return { tarih: d, dk: 15, baslik: "2 gün kaldı: " + Y[x[1]][0], aciklama: "Son gün " + E.tarih(x[0]) + " · " + (window.ISL.ad || "") }; })); };
    q(".v-gonder").onclick = function () { waAc("Merhaba, " + TUR[tur][0].toLocaleLowerCase("tr") + " mükellefiyim. Beyanname ve defter işlerim için görüşmek istiyorum."); };
  }
  var IS = [
    ["Şahıs işletmesi açılışı", ["Kimlik fotokopisi", "İkametgâh belgesi (e-Devlet)", "İş yeri kira sözleşmesi ya da tapu", "Kiraya verenin kimlik fotokopisi", "Faaliyet konusu (ne satacak / ne hizmet vereceksiniz)", "Noter imza beyannamesi", "Banka hesap bilgisi", "e-İmza (e-Defter / e-Fatura gerekirse)"]],
    ["Limited şirket kuruluşu", ["Ortakların kimlik fotokopileri", "Ortakların ikametgâh belgeleri", "Şirket unvanı için 3 seçenek", "Faaliyet konusu", "Sermaye tutarı ve ortaklık payları", "Müdür olacak kişi", "İş yeri kira sözleşmesi ya da tapu", "Rekabet Kurumu payı dekontu", "Ortakların vergi numaraları"]],
    ["Yıllık gelir beyanı", ["Geçen yılın alış ve satış faturaları", "Banka hesap dökümleri", "Stopaj kesinti belgeleri", "Kira geliri dekontları (varsa)", "Eğitim ve sağlık harcama belgeleri", "Bireysel emeklilik / hayat sigortası primleri", "Bağış makbuzları"]],
    ["Kira geliri beyanı", ["Kira sözleşmeleri", "Yıl içinde alınan kira dekontları", "Tapu bilgisi (ada / parsel)", "Emlak vergisi makbuzu", "Gerçek gider seçilecekse gider belgeleri (aidat, onarım, faiz)"]],
    ["e-Fatura / e-Arşiv geçişi", ["e-İmza ya da mali mühür", "Vergi levhası", "Ticaret sicil gazetesi (şirketse)", "Logo ve fatura bilgileri", "Ürün / hizmet listesi", "Kullanılacak entegratör ya da GİB portalı tercihi"]]];
  function belge(k) {
    var q = function (s) { return E.q(k, s); }, is = 0, tik = {};
    q(".b-is").innerHTML = IS.map(function (x, i) { return '<button type="button" class="cip' + (i ? "" : " on") + '" data-i="' + i + '">' + x[0] + "</button>"; }).join("");
    function durum() {
      var B = IS[is][1], n = B.filter(function (_, i) { return tik[is + "-" + i]; }).length;
      q(".b-cubuk").style.width = Math.round(n / B.length * 100) + "%";
      q(".b-sonuc").innerHTML = n === B.length ? "<b>Tamam, tüm belgeler hazır.</b> Ön görüşmede işlemleri ve takvimi birlikte planlarız." : "<b>" + n + " / " + B.length + " hazır.</b> Eksik: " + B.filter(function (_, i) { return !tik[is + "-" + i]; }).length + " belge.";
    }
    function ciz() {
      q(".b-liste").innerHTML = IS[is][1].map(function (b, i) { var on = !!tik[is + "-" + i]; return '<li class="' + (on ? "ok" : "") + '"><input type="checkbox" id="b' + i + '"' + (on ? " checked" : "") + ' data-i="' + i + '"><span><label for="b' + i + '">' + b + "</label></span></li>"; }).join("");
      k.querySelectorAll(".b-liste input").forEach(function (c) { c.onchange = function () { tik[is + "-" + c.dataset.i] = c.checked; c.closest("li").classList.toggle("ok", c.checked); durum(); }; });
      durum();
    }
    k.querySelectorAll(".b-is .cip").forEach(function (c) { c.onclick = function () { k.querySelectorAll(".b-is .cip").forEach(function (x) { x.classList.remove("on"); }); c.classList.add("on"); is = +c.dataset.i; ciz(); }; });
    ciz();
    q(".b-gonder").onclick = function () { var B = IS[is][1]; waAc("Merhaba, " + IS[is][0].toLocaleLowerCase("tr") + " için hazırlanıyorum.\nHazır: " + (B.filter(function (_, i) { return tik[is + "-" + i]; }).join(", ") || "-") + "\nEksik: " + (B.filter(function (_, i) { return !tik[is + "-" + i]; }).join(", ") || "-")); };
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".takvim").forEach(takvim); document.querySelectorAll(".belge").forEach(belge);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Şirket kuruluşu", "Muhasebeci değişikliği", "Yıllık / kira beyanı", "e-Fatura geçişi", "Bordro ve SGK", "Diğer"], [["Şekil", ".rv-sekil"], ["Firma", ".rv-firma"]]); });
  });
})();
