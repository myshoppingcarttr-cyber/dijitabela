// ===== Ücretsiz dijital ekspertiz: site analizi (sunucu) + Google profili soruları → puan, eksikler, paket =====
(function () {
  "use strict";
  var A = window.AJANS || {}, $ = function (id) { return document.getElementById(id); }, e = window.esc;
  var f = $("eks-form"); if (!f) return;
  var SORULAR = [
    ["kapali", "Google'da işletmenizi aratınca “Kalıcı olarak kapandı” ya da “Geçici olarak kapalı” yazıyor mu?", "evet", "Google'da “kapandı” görünüyorsunuz; müşteri sizi kapanmış sanıp başka yere gidiyor.", 14],
    ["sahip", "Google profilinizi siz (ya da çalışanınız) yönetiyor musunuz?", "hayir", "Google profiliniz sahipsiz; bilgileri başkası değiştirebilir, siz düzeltemezsiniz.", 10],
    ["webbag", "Google profilinizde web sitenizin bağlantısı var mı?", "hayir", "Google profilinizde web sitesi bağlantısı yok; profilden sitenize kimse geçemiyor.", 6],
    ["saat", "Çalışma saatleriniz Google'da doğru ve güncel mi?", "hayir", "Çalışma saatleri yanlış ya da eksik; müşteri kapalı sanıp gelmiyor.", 5],
    ["foto", "Son 3 ayda Google profilinize fotoğraf eklendi mi?", "hayir", "Profil fotoğrafları eski; yeni ve gerçek fotoğraflar tıklanmayı artırır.", 5],
    ["yorum", "Google'da 30'dan fazla yorumunuz var mı?", "hayir", "Yorum sayınız az; Google ve müşteriler yorumu çok olan işletmeyi seçiyor.", 6]
  ];
  var cevap = {}, site = null, harita = null, siteYok = false, bitti = false, adres = "", mapsLink = "";

  function yaz(el, m, s) { el.textContent = m; el.className = "durum " + (s || ""); }
  var URL_FN = (A.supabaseUrl || "") + "/functions/v1/ekspertiz";
  function analizEt(url) {
    return fetch(URL_FN, { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey || "" }, body: JSON.stringify({ url: url }) })
      .then(function (r) { return r.json(); });
  }

  // Ana sayfadaki şeritten gelen bağlantı (?url=) doğru kutuya yazılır
  var gelen = (new URLSearchParams(location.search).get("url") || "").trim();
  if (gelen) {
    if (/(^|\/\/|\.)(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.)/i.test(gelen)) $("e-maps").value = gelen; else $("e-web").value = gelen;
    $("eks-baslat").scrollIntoView({ block: "start" });
  }

  $("e-siteyok").addEventListener("change", function () { $("e-web").disabled = this.checked; });

  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    siteYok = $("e-siteyok").checked; adres = f.web.value.trim(); mapsLink = f.maps.value.trim();
    if (!siteYok && !adres && !mapsLink) return yaz($("e-durum"), "Web sitenizin adresini ya da Google Haritalar bağlantınızı yazın (sitemiz yoksa kutuyu işaretleyin).", "kotu");
    f.hidden = true; $("eks-sorular").hidden = false; $("eks-sorular").scrollIntoView({ behavior: "smooth", block: "start" });
    var isler = [];
    if (!siteYok && adres) isler.push(analizEt(adres).then(function (d) { site = d; }).catch(function () { site = { hata: true }; }));
    if (mapsLink) isler.push(analizEt(mapsLink).then(function (d) { harita = d.harita || null; }).catch(function () {}));
    var adimlar = ["Güvenli bağlantı kontrol ediliyor…", "Mobil uyum kontrol ediliyor…", "Hız ölçülüyor…", "Google başlıkları okunuyor…", "Telefon ve WhatsApp düğmeleri aranıyor…", "Harita ve işletme bilgisi aranıyor…"], i = 0;
    var zam = setInterval(function () { if (!bitti) $("eks-ilerleme-yazi").textContent = adimlar[i++ % adimlar.length]; }, 900);
    Promise.all(isler).then(function () { bitti = true; clearInterval(zam); $("eks-ilerleme").classList.add("tamam"); $("eks-ilerleme-yazi").textContent = siteYok || !adres ? "Hazır. Soruları cevaplayın." : "Siteniz incelendi."; hazirMi(); });
  });

  // Sorular
  $("eks-soru-liste").innerHTML = SORULAR.map(function (s, i) {
    return '<li><p>' + e(s[1]) + '</p><div class="eks-secim" role="radiogroup">' + [["evet", "Evet"], ["hayir", "Hayır"], ["bilmiyorum", "Bilmiyorum"]].map(function (c) {
      return '<label><input type="radio" name="s-' + s[0] + '" value="' + c[0] + '"><span>' + c[1] + "</span></label>";
    }).join("") + "</div></li>";
  }).join("");
  $("eks-soru-liste").addEventListener("change", function (ev) { var n = ev.target.name.slice(2); cevap[n] = ev.target.value; hazirMi(); });
  function hazirMi() { $("eks-sonuc-dugme").disabled = !(bitti && Object.keys(cevap).length === SORULAR.length); }
  $("eks-sonuc-dugme").addEventListener("click", sonuc);

  function sonuc() {
    var eksik = [], iyi = [], puanSite = 0, puanProfil = 0, profilToplam = 0;
    // Site (60 puan)
    if (siteYok || !adres) eksik.push({ ad: "Web sitesi", not: "Web siteniz yok. Google'da “web sitesi” düğmesine basan müşteri hiçbir şey bulamıyor; rakibinizin sitesine gidiyor.", paket: "Kurumsal web sitesi" });
    else if (!site || site.hata) eksik.push({ ad: "Site analizi", not: "Siteniz analiz sırasında yanıt vermedi. Açılmıyor ya da çok yavaş olabilir.", paket: "Kurumsal web sitesi" });
    else {
      puanSite = site.skor || 0;
      (site.kontroller || []).forEach(function (k) { (k.durum === "ok" ? iyi : eksik).push({ ad: k.ad, not: k.not, paket: k.paket, uyari: k.durum === "uyari" }); });
    }
    // Profil (40 puan)
    SORULAR.forEach(function (s) {
      profilToplam += s[4];
      var c = cevap[s[0]];
      if (c === s[2]) eksik.push({ ad: "Google profili", not: s[3], paket: "Google İşletme Profili" });
      else if (c === "bilmiyorum") eksik.push({ ad: "Google profili", not: "Bilmediğiniz bir konu var: " + s[3].charAt(0).toLowerCase() + s[3].slice(1), paket: "Google İşletme Profili", uyari: true }), puanProfil += s[4] / 2;
      else puanProfil += s[4];
    });
    if (harita && harita.kapali) eksik.unshift({ ad: "Google profili", not: "Harita kaydınızda “Kalıcı olarak kapandı” ifadesi görünüyor. Bu en acil sorun.", paket: "Google İşletme Profili" });
    var skor = Math.round(puanSite * .6 + puanProfil / profilToplam * 40);
    var ciddi = eksik.filter(function (x) { return !x.uyari; }).length;
    var renk = skor >= 75 ? "iyi" : skor >= 50 ? "orta" : "kotu";
    var yorum = skor >= 75 ? "İyi durumdasınız, ama birkaç eksik müşteri kaybettiriyor." : skor >= 50 ? "Müşterilerin bir kısmı sizi bulamıyor ya da güvenmeden gidiyor." : "İnternette müşteri kaybediyorsunuz. Eksiklerin çoğu hızlıca giderilebilir.";

    var s = $("eks-sonuc");
    s.innerHTML = '<p class="v-etiket">Ekspertiz sonucu' + (harita && harita.ad ? " · " + e(harita.ad) : adres ? " · " + e(adres.replace(/^https?:\/\//, "")) : "") + "</p>" +
      '<div class="eks-skor ' + renk + '"><b>' + skor + '</b><span>/100</span></div><div class="eks-bar"><i style="width:' + skor + '%"></i></div>' +
      '<p class="v-alt" style="margin:18px 0 34px">' + e(yorum) + " <b>" + ciddi + " önemli eksik</b> bulundu.</p>" +
      (eksik.length ? '<h3 class="eks-h">Eksikler</h3><ol class="eks-liste">' + eksik.map(function (x) { return '<li class="' + (x.uyari ? "uyari" : "eksik") + '"><span>' + (x.uyari ? "!" : "✗") + "</span><div><b>" + e(x.ad) + "</b><p>" + e(x.not) + "</p></div></li>"; }).join("") + "</ol>" : "") +
      (iyi.length ? '<details class="eks-iyi"><summary>İyi olanlar (' + iyi.length + ")</summary><ol class=\"eks-liste\">" + iyi.map(function (x) { return '<li class="ok"><span>✓</span><div><b>' + e(x.ad) + "</b><p>" + e(x.not) + "</p></div></li>"; }).join("") + "</ol></details>" : "");
    s.appendChild(document.getElementById("eks-cta").content.cloneNode(true));
    $("eks-sorular").hidden = true; s.hidden = false; s.scrollIntoView({ behavior: "smooth", block: "start" });

    var rf = $("eks-rapor"), rd = rf.querySelector(".durum");
    if (harita && harita.ad) rf.isletme.value = harita.ad;
    rf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!rf.isletme.value.trim()) return yaz(rd, "İşletmenizin adını yazın.", "kotu");
      if (rf.tel.value.replace(/\D/g, "").length < 10) return yaz(rd, "Telefon numaranızı yazın.", "kotu");
      if (!rf.kvkk.checked) return yaz(rd, "KVKK onay kutusunu işaretleyin.", "kotu");
      var not = "Ekspertiz puanı " + skor + "/100. Eksikler: " + eksik.filter(function (x) { return !x.uyari; }).map(function (x) { return x.not.split(";")[0].split(".")[0]; }).join(" | ");
      var b = rf.querySelector("button"); b.disabled = true; yaz(rd, "Gönderiliyor…");
      API.taslakIste({ isletme: rf.isletme.value.trim(), sektor: f.sektor.value, tel: rf.tel.value.trim(), eposta: rf.eposta.value.trim(), maps: mapsLink, web: siteYok ? "" : adres, kvkk: new Date().toISOString(), kaynak: "Ekspertiz", not: not })
        .then(function () { yaz(rd, "Rapor talebiniz alındı. Bugün içinde sizi arayıp eksikleri ve çözümleri anlatacağız.", "iyi"); rf.reset(); })
        .catch(function (x) { yaz(rd, "Gönderilemedi: " + (x && x.message || "bağlantı hatası"), "kotu"); })
        .then(function () { b.disabled = false; });
    });
  }
})();
