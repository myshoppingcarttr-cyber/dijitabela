/* Medigün · 7/24 randevu asistanı demosu (betikli akış, ağ isteği yok, veri saklanmaz) */
(function () {
  "use strict";
  var akis = document.getElementById("sohbet-akis");
  var secenek = document.getElementById("sohbet-secenek");
  var form = document.getElementById("sohbet-form");
  var yazi = document.getElementById("sohbet-yazi");
  if (!akis) return;
  var esc = MG.esc;
  var azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var durum = {};
  var kullaniciEtkilesti = false;
  var kuyruk = Promise.resolve();

  function saat() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function asagi() { akis.scrollTop = akis.scrollHeight; }
  function bekle(ms) { return new Promise(function (r) { setTimeout(r, azHareket ? 0 : ms); }); }

  function balonEkle(kim, html, ek) {
    var d = document.createElement("div");
    d.className = "balon " + kim + (ek ? " " + ek : "");
    d.innerHTML = html + '<span class="saat">' + saat() + (kim === "ben" ? " ✓✓" : "") + "</span>";
    akis.appendChild(d); asagi();
    return d;
  }
  /* Bot mesajları sırayla, "yazıyor" göstergesiyle */
  function bot(html, ek) {
    kuyruk = kuyruk.then(function () {
      var y = document.createElement("div");
      y.className = "yaziyor"; y.setAttribute("aria-hidden", "true");
      y.innerHTML = "<i></i><i></i><i></i>";
      akis.appendChild(y); asagi();
      return bekle(Math.min(1100, 350 + html.length * 4)).then(function () {
        y.remove(); balonEkle("bot", html, ek);
      });
    });
    return kuyruk;
  }
  function ben(metin) { balonEkle("ben", esc(metin)); }

  function secenekler(liste) {
    kuyruk = kuyruk.then(function () {
      secenek.innerHTML = "";
      liste.forEach(function (o) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = o.t;
        if (o.acil) b.className = "acil";
        b.addEventListener("click", function () { kullaniciEtkilesti = true; secenek.innerHTML = ""; ben(o.t); o.f(); });
        secenek.appendChild(b);
      });
      if (kullaniciEtkilesti && secenek.firstChild) secenek.firstChild.focus({ preventScroll: true });
    });
  }

  /* ---------- Acil algılama ---------- */
  var acilKaliplar = [
    "gogus agri", "gogsum agri", "gogsumde agri", "kalp krizi", "nefes alam", "nefes darl", "nefesim daral", "bogul",
    "bilinc", "bayil", "baygin", "felc", "konusamiyor", "agzi kay", "yuzu kay", "kolum uyus", "kolu uyus",
    "kanama", "kan kaybi", "zehir", "intihar", "kendime zarar", "olmek istiyorum", "nobet geciri", "havale",
    "kaza", "yanik", "dustu", "kafasini carpt", "alerjik sok", "112", "acil"
  ];
  function acilMi(t) { var s = " " + MG.sade(t) + " "; return acilKaliplar.some(function (k) { return s.indexOf(k) > -1; }); }
  var sikayetKaliplar = ["agri", "agriyor", "ates", "oksur", "bulanti", "kusma", "ishal", "bas don", "basim don", "donuyor", "halsiz", "sanci", "kasinti", "sislik", "yorgun", "uyku", "sizlama"];
  function sikayetMi(t) { var s = MG.sade(t); return sikayetKaliplar.some(function (k) { return s.indexOf(k) > -1; }); }

  function acilUyari() {
    durum.adim = "acil";
    var acilSubeler = MG.subeler.filter(function (s) { return s.acil; }).map(function (s) {
      return esc(s.ad) + ': <a href="tel:' + s.tel + '">' + esc(s.telGoster) + "</a>";
    }).join("<br>");
    bot("<b>Hayati tehlike olabilecek bir durumdaysanız lütfen hemen 112'yi arayın.</b> Bu asistan acil durumlarda yardımcı olamaz ve tıbbi değerlendirme yapmaz." +
      '<br><a class="dugme kucuk" href="tel:112">112\'yi ara</a>', "uyari");
    bot("24 saat açık acil servislerimiz:<br>" + acilSubeler);
    secenekler([
      { t: "Acil değil, randevu istiyorum", f: subeSor },
      { t: "Başa dön", f: basla }
    ]);
  }

  /* ---------- Akış ---------- */
  function basla() {
    durum = { adim: "basla" };
    bot("Merhaba, ben Medigün randevu asistanıyım. <b>Bu bir demodur;</b> yazdıklarınız hiçbir yere gönderilmez.");
    bot("Size nasıl yardımcı olabilirim? Hayati tehlike varsa lütfen <a href=\"tel:112\">112</a>'yi arayın.");
    anaMenu();
  }
  function anaMenu() {
    durum.adim = "menu";
    secenekler([
      { t: "Randevu almak istiyorum", f: subeSor },
      { t: "Acil bir durum var", f: acilUyari, acil: true },
      { t: "Tahlil sonucum", f: tahlil },
      { t: "Check-up bilgisi", f: checkup },
      { t: "Şube adres ve telefon", f: subeBilgi }
    ]);
  }
  function subeSor() {
    durum.adim = "sube";
    bot("Hangi Medigün kurumundan randevu almak istersiniz?");
    secenekler(MG.subeler.map(function (s) {
      return { t: s.kisa + (s.tur === "Hastane" ? " (hastane)" : " (tıp merkezi)"), f: function () { durum.sube = s.kod; bransSor(); } };
    }));
  }
  function bransSor() {
    var s = MG.subeBul(durum.sube);
    durum.adim = "brans";
    var liste = (MG.subeBrans[s.kod] || []).filter(function (b) { return b !== "acil" && b !== "biyokimya" && b !== "radyoloji" && b !== "anestezi"; });
    if (!liste.length) {
      bot(esc(s.ad) + " için bölüm ve hekim bilgisini çağrı merkezimiz verir: " +
        '<a href="tel:' + s.tel + '">' + esc(s.telGoster) + "</a>");
      secenekler([
        { t: "Başka şube seç", f: subeSor },
        { t: "Başa dön", f: basla }
      ]);
      return;
    }
    bot("Hangi bölüm için randevu istiyorsunuz? Listeden seçebilir ya da bölüm adını yazabilirsiniz. <i>Hangi bölüme gitmeniz gerektiğinden emin değilseniz çağrı merkezimiz yardımcı olur.</i>");
    liste.sort(function (a, b) { return MG.branslar[a].localeCompare(MG.branslar[b], "tr"); });
    secenekler(liste.map(function (b) { return { t: MG.branslar[b], f: function () { durum.brans = b; tipSor(); } }; })
      .concat([{ t: "Şubeyi değiştir", f: subeSor }]));
  }
  function tipSor() {
    var s = MG.subeBul(durum.sube);
    durum.adim = "tip";
    bot("<b>" + esc(s.kisa) + " · " + esc(MG.branslar[durum.brans]) + "</b><br>Muayeneyi SGK ile mi yaptırmak istiyorsunuz, yoksa özel randevu talebi mi bırakmak istersiniz?");
    secenekler([
      { t: "SGK ile (MHRS)", f: mhrs },
      { t: "Özel randevu talebi", f: kvkk },
      { t: "Bölümü değiştir", f: bransSor }
    ]);
  }
  function mhrs() {
    var s = MG.subeBul(durum.sube);
    durum.adim = "mhrs";
    bot("SGK kapsamındaki muayene randevuları Sağlık Bakanlığı'nın <b>MHRS</b> sistemi üzerinden alınır. Alo 182'yi arayabilir ya da MHRS / e-Nabız uygulamasını kullanabilirsiniz. Kurum olarak <b>" + esc(s.ad) + "</b> seçmeniz yeterli." +
      '<br><a class="dugme kucuk" href="tel:182">Alo 182\'yi ara</a> <a class="dugme kucuk sade" href="https://www.mhrs.gov.tr/" rel="noopener">mhrs.gov.tr</a>');
    secenekler([
      { t: "Özel randevu talebi bırak", f: kvkk },
      { t: "Başa dön", f: basla }
    ]);
  }
  function kvkk() {
    durum.adim = "kvkk";
    bot("Randevu talebiniz için adınızı ve telefonunuzu soracağım. Önce kısa bir onay gerekiyor.");
    kuyruk = kuyruk.then(function () {
      var d = balonEkle("bot", '<div class="kvkk-kutu"><label><input type="checkbox" id="kvkk-onay"> <span>Kişisel verilerimin randevu talebimin karşılanması amacıyla işlenmesine ilişkin <a href="https://www.medigunhastanesi.com.tr/kisisel-verilerin-korunmasi-kanunu-kvkk/" rel="noopener">aydınlatma metnini</a> okudum.</span></label>' +
        '<button type="button" class="dugme kucuk" id="kvkk-devam" style="margin-top:8px" disabled>Devam</button></div>');
      var c = d.querySelector("#kvkk-onay"), b = d.querySelector("#kvkk-devam");
      c.addEventListener("change", function () { b.disabled = !c.checked; });
      b.addEventListener("click", function () {
        c.disabled = true; b.disabled = true; c.removeAttribute("id"); b.removeAttribute("id");
        kullaniciEtkilesti = true; ben("Onaylıyorum"); talepFormu();
      });
      secenek.innerHTML = "";
      var geri = document.createElement("button"); geri.type = "button"; geri.textContent = "Vazgeç, başa dön";
      geri.addEventListener("click", function () { secenek.innerHTML = ""; ben("Vazgeç"); basla(); });
      secenek.appendChild(geri);
      if (kullaniciEtkilesti) c.focus({ preventScroll: true });
    });
  }
  function talepFormu() {
    durum.adim = "form";
    secenek.innerHTML = "";
    bot("Lütfen bilgilerinizi yazın. Çağrı merkezimiz sizi arayıp saati kesinleştirecek.");
    kuyruk = kuyruk.then(function () {
      var n = Date.now();
      var d = balonEkle("bot", '<form class="mini-form" novalidate>' +
        '<label for="f-ad' + n + '">Ad soyad</label><input type="text" id="f-ad' + n + '" autocomplete="name" required>' +
        '<label for="f-tel' + n + '">Telefon</label><input type="tel" id="f-tel' + n + '" autocomplete="tel" inputmode="tel" placeholder="05xx xxx xx xx" required>' +
        '<label for="f-gun' + n + '">Tercih ettiğiniz gün</label><select id="f-gun' + n + '"><option>Fark etmez</option><option>Bugün</option><option>Yarın</option><option>Bu hafta içinde</option></select>' +
        '<label for="f-saat' + n + '">Saat aralığı</label><select id="f-saat' + n + '"><option>Fark etmez</option><option>Sabah</option><option>Öğleden sonra</option></select>' +
        '<p class="hata not" role="alert" style="color:#A91917;margin:0"></p>' +
        '<button type="submit" class="dugme kucuk">Talebi oluştur</button></form>');
      var f = d.querySelector("form");
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var ad = f.querySelector('input[type="text"]').value.trim();
        var tel = f.querySelector('input[type="tel"]').value.replace(/\D/g, "");
        var hata = f.querySelector(".hata");
        if (ad.length < 3) { hata.textContent = "Lütfen adınızı ve soyadınızı yazın."; f.querySelector('input[type="text"]').focus(); return; }
        if (tel.length < 10 || tel.length > 12) { hata.textContent = "Lütfen geçerli bir telefon numarası yazın."; f.querySelector('input[type="tel"]').focus(); return; }
        var gun = f.querySelectorAll("select")[0].value, sa = f.querySelectorAll("select")[1].value;
        Array.prototype.forEach.call(f.elements, function (el) { el.disabled = true; });
        kullaniciEtkilesti = true;
        var maske = tel.slice(0, 4) + " *** ** " + tel.slice(-2);
        ben(ad.split(" ")[0] + " · " + maske + " · " + gun + ", " + sa.toLocaleLowerCase("tr-TR"));
        ozet(gun, sa);
      });
      if (kullaniciEtkilesti) f.querySelector("input").focus({ preventScroll: true });
    });
  }
  function ozet(gun, sa) {
    var s = MG.subeBul(durum.sube);
    var no = "MG-" + String(Math.floor(1000 + Math.random() * 9000));
    bot("Talebiniz oluşturuldu. <span class=\"ornek\">Örnek veri</span><br><b>Talep no:</b> " + no + "<br><b>Kurum:</b> " + esc(s.ad) +
      "<br><b>Bölüm:</b> " + esc(MG.branslar[durum.brans]) + "<br><b>Tercih:</b> " + esc(gun) + ", " + esc(sa.toLocaleLowerCase("tr-TR")) +
      "<br><br>Çağrı merkezimiz çalışma saatlerinde sizi arayarak randevu saatini kesinleştirecek. <i>Demo: hiçbir bilgi gönderilmedi.</i>");
    secenekler([
      { t: "Yeni talep", f: subeSor },
      { t: "Başa dön", f: basla }
    ]);
  }
  function tahlil() {
    durum.adim = "tahlil";
    bot("Sonucunuz onaylandığında, kayıtta izin verdiğiniz kanaldan (SMS ya da e-posta) bildirim alırsınız. Sonucu güvenli girişten görebilirsiniz; sonucunuzu yorumlamak için hekiminize danışın." +
      '<br><a class="dugme kucuk" href="#sonuc">Sonuç ekranına git</a>');
    secenekler([{ t: "Başa dön", f: basla }]);
  }
  function checkup() {
    durum.adim = "checkup";
    bot("Check-up paketlerinin içerikleri sayfanın Check-up bölümünde yer alıyor. Hangi tetkiklerin size uygun olduğunu muayeneden sonra hekim belirler.");
    bot("Bilgi almak için çağrı merkezimiz sizi arayabilir. Talep bırakmak ister misiniz?");
    secenekler([
      { t: "Evet, talep bırakayım", f: function () { durum.brans = "dahiliye"; if (!durum.sube) durum.sube = MG.secili; if (MG.subeBrans[durum.sube].indexOf("dahiliye") < 0) { subeSor(); } else { kvkk(); } } },
      { t: "Başa dön", f: basla }
    ]);
  }
  function subeBilgi() {
    durum.adim = "bilgi";
    bot(MG.subeler.map(function (s) {
      return "<b>" + esc(s.ad) + "</b><br>" + esc(s.adres) + '<br><a href="tel:' + s.tel + '">' + esc(s.telGoster) + '</a> · <a href="' + s.harita + '" rel="noopener">Yol tarifi</a>';
    }).join("<br><br>"));
    secenekler([{ t: "Randevu almak istiyorum", f: subeSor }, { t: "Başa dön", f: basla }]);
  }

  /* ---------- Serbest yazı ---------- */
  function bransBul(t) {
    var s = MG.sade(t), bulunan = null;
    var es = { goz: ["goz"], kadin: ["kadin", "dogum", "jinekolog", "gebelik", "hamile"], cocuk: ["cocuk", "pediatri", "bebek"], kbb: ["kulak", "burun", "bogaz", "kbb"],
      dahiliye: ["dahiliye", "ic hastalik"], ortopedi: ["ortopedi", "kemik", "kirik"], uroloji: ["uroloji", "bobrek tasi", "prostat"], kardiyoloji: ["kardiyoloji", "kalp"],
      noroloji: ["noroloji"], beyin: ["beyin cerrah", "omurga", "bel fitigi", "boyun fitigi"], gogus: ["gogus hastalik", "akciger"], ftr: ["fizik tedavi", "ftr"],
      genelcerrahi: ["genel cerrahi", "safra", "fitik"], psikiyatri: ["psikiyatri"], psikoterapi: ["psikolog", "psikoterapi"], beslenme: ["diyet", "beslenme"],
      dermatoloji: ["dermatoloji", "cildiye"], enfeksiyon: ["enfeksiyon"], algoloji: ["algoloji"] };
    Object.keys(es).some(function (k) { if (es[k].some(function (w) { return s.indexOf(w) > -1; })) { bulunan = k; return true; } return false; });
    return bulunan;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = yazi.value.trim();
    if (!t) return;
    kullaniciEtkilesti = true;
    yazi.value = ""; secenek.innerHTML = "";
    ben(t);
    if (acilMi(t)) { acilUyari(); return; }
    var s = MG.sade(t);
    var b = bransBul(t);
    if (b) {
      durum.brans = b;
      if (durum.sube && (MG.subeBrans[durum.sube] || []).indexOf(b) > -1) { tipSor(); return; }
      var olan = MG.subeler.filter(function (x) { return (MG.subeBrans[x.kod] || []).indexOf(b) > -1; });
      if (!olan.length) { bot(esc(MG.branslar[b]) + " için bu demoda kayıtlı şube yok. Çağrı merkezimiz: <a href=\"tel:" + MG.cagri.tel + "\">" + MG.cagri.goster + "</a>"); anaMenu(); return; }
      bot(esc(MG.branslar[b]) + " bölümü şu kurumlarımızda var. Hangisini tercih edersiniz?");
      secenekler(olan.map(function (x) { return { t: x.kisa, f: function () { durum.sube = x.kod; tipSor(); } }; }).concat([{ t: "Başa dön", f: basla }]));
      return;
    }
    if (sikayetMi(t)) {
      bot("Geçmiş olsun. Şikâyetinize göre bölüm önermem doğru olmaz; bunu ancak bir sağlık profesyoneli değerlendirebilir. Bölümü kendiniz seçebilir ya da çağrı merkezimize danışabilirsiniz: <a href=\"tel:" + MG.cagri.tel + "\">" + MG.cagri.goster + "</a>. Durumunuz ağırlaşırsa <a href=\"tel:112\">112</a>'yi arayın.");
      secenekler([{ t: "Bölüm seçerek randevu", f: subeSor }, { t: "Başa dön", f: basla }]);
      return;
    }
    if (/randevu/.test(s)) { subeSor(); return; }
    if (/sonuc|tahlil|test|rapor/.test(s)) { tahlil(); return; }
    if (/check ?up|checkup|tarama/.test(s)) { checkup(); return; }
    if (/adres|telefon|nerede|yol|konum|numara/.test(s)) { subeBilgi(); return; }
    if (/ucret|fiyat|kac para|indirim|kampanya/.test(s)) {
      bot("Ödeme ve anlaşmalı kurum bilgisi için lütfen çağrı merkezimizi arayın: <a href=\"tel:" + MG.cagri.tel + "\">" + MG.cagri.goster + "</a>.");
      anaMenu(); return;
    }
    bot("Bunu tam anlayamadım. Aşağıdaki seçeneklerden birini seçebilir ya da bölüm adını yazabilirsiniz.");
    anaMenu();
  });

  document.getElementById("sohbet-yenile").addEventListener("click", function () {
    kuyruk = Promise.resolve(); akis.innerHTML = ""; secenek.innerHTML = ""; kullaniciEtkilesti = true; basla();
  });

  /* Hekim kartından gelen randevu: şube + branş hazır */
  document.addEventListener("mg:randevu", function (e) {
    kullaniciEtkilesti = true; secenek.innerHTML = "";
    durum = { sube: e.detail.sube, brans: e.detail.brans };
    ben(MG.subeBul(e.detail.sube).kisa + " · " + MG.branslar[e.detail.brans] + " için randevu istiyorum");
    tipSor();
  });
  document.addEventListener("mg:checkup", function () {
    kullaniciEtkilesti = true; secenek.innerHTML = ""; durum.sube = MG.secili;
    ben("Check-up hakkında bilgi almak istiyorum"); checkup();
  });

  basla();
})();
