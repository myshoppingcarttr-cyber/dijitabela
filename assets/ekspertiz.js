// ===== Ücretsiz dijital ekspertiz v2: SORU YOK. Sunucu web sitesini, Google İşletme Profilini ve bölgedeki rakipleri inceler →
// alan puanları, her eksik için somut tespit + nokta atışı çözüm, rakip karşılaştırması ve öncelik sırası.
(function () {
  "use strict";
  var A = window.AJANS || {}, F = window.FIYAT, $ = function (id) { return document.getElementById(id); }, e = window.esc, TL = F.TL;
  var f = $("eks-form"); if (!f) return;
  var URL_FN = (A.supabaseUrl || "") + "/functions/v1/ekspertiz-v2";
  function yaz(el, m, s) { el.textContent = m; el.className = "durum " + (s || ""); }
  var HARITA = /(^|\/\/|\.)(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.)/i;

  // Ana sayfadaki şeritten gelen bağlantı (?url=) doğru kutuya yazılır
  var gelen = (new URLSearchParams(location.search).get("url") || "").trim();
  if (gelen) { if (HARITA.test(gelen)) $("e-maps").value = gelen; else $("e-web").value = gelen; $("eks-baslat").scrollIntoView({ block: "start" }); }

  var veri = null, girdi = {};
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var harita = f.maps.value.trim(), web = f.web.value.trim();
    // Harita kutusuna işletme adı da yazılabilir: bağlantı değilse ad olarak gönderilir
    girdi = { url: web, maps: HARITA.test(harita) ? harita : "", isletme: HARITA.test(harita) ? "" : harita, sehir: f.sehir.value.trim() };
    if (HARITA.test(web) && !girdi.maps) { girdi.maps = web; girdi.url = ""; }
    if (!girdi.url && !girdi.maps && !girdi.isletme) return yaz($("e-durum"), "Google Haritalar bağlantınızı ya da işletmenizin adını yazın.", "kotu");
    f.hidden = true; var ilr = $("eks-ilerleme"); ilr.hidden = false; ilr.scrollIntoView({ behavior: "smooth", block: "center" });
    var adimlar = ["İşletmeniz Google Haritalar'da aranıyor…", "Google profiliniz okunuyor: durum, saatler, fotoğraflar…", "Yorumlarınız ve puanınız inceleniyor…", "Çevrenizdeki rakipler bulunuyor…", "Rakiplerle karşılaştırılıyor…", "Web siteniz açılıyor…", "Mobil uyum ve hız ölçülüyor…", "Telefon, WhatsApp ve randevu düğmeleri aranıyor…", "Çözüm planı hazırlanıyor…"], i = 0;
    $("eks-ilerleme-yazi").textContent = adimlar[0];
    var zam = setInterval(function () { i = Math.min(i + 1, adimlar.length - 1); $("eks-ilerleme-yazi").textContent = adimlar[i]; }, 2600);
    fetch(URL_FN, { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey || "" }, body: JSON.stringify(girdi) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.hata) throw new Error(d.hata); veri = d; goster(d); })
      .catch(function (x) { ilr.hidden = true; f.hidden = false; yaz($("e-durum"), "Analiz tamamlanamadı: " + (x && x.message || "bağlantı hatası") + ". Bilgileri kontrol edip tekrar deneyin.", "kotu"); })
      .then(function () { clearInterval(zam); });
  });

  var renk = function (p) { return p >= 75 ? "iyi" : p >= 50 ? "orta" : "kotu"; };
  function goster(d) {
    $("eks-ilerleme").hidden = true;
    var B = d.bulgular || [], eksik = B.filter(function (b) { return b.durum !== "ok"; }), iyi = B.filter(function (b) { return b.durum === "ok"; });
    var ciddi = eksik.filter(function (b) { return b.durum === "eksik"; });
    var ist = d.isletme, rk = d.rakip, skor = d.skor;
    var yorum = skor >= 75 ? "İyi durumdasınız, ama aşağıdaki eksikler hâlâ müşteri kaybettiriyor." : skor >= 50 ? "Müşterilerin bir kısmı sizi bulamıyor, size ulaşamıyor ya da rakibi seçiyor." : "İnternette ciddi müşteri kaybediyorsunuz. Eksiklerin çoğu birkaç haftada giderilebilir.";
    // Çözüm kalemleri → fiyat motoru
    var kalemler = [];
    ciddi.concat(eksik.filter(function (x) { return x.agirlik >= 6; })).forEach(function (x) { if (x.kalem && x.kalem !== "bakim" && F.KALEMLER[x.kalem] && kalemler.indexOf(x.kalem) < 0) kalemler.push(x.kalem); });
    var sira = Object.keys(F.KALEMLER); kalemler.sort(function (a, b) { return sira.indexOf(a) - sira.indexOf(b); });
    var h = F.hesapla(kalemler);
    var ALAN = Object.keys(d.alanlar || {});
    var ilk3 = ciddi.slice(0, 3);
    var googleNot = d.google === "kapali" || d.google === "hata" ? '<p class="eks-not">Google profil karşılaştırması bu analizde yapılamadı; arayıp profilinizi birlikte kontrol edelim.</p>'
      : d.google === "bulunamadi" ? '<p class="eks-not kotu"><b>İşletmeniz Google Haritalar\'da bulunamadı.</b> Ya profiliniz yok ya da adınız farklı kayıtlı. Haritada görünmeyen işletmeyi “yakınımdaki …” diye arayan müşteri hiç görmez.</p>' : "";

    var s = $("eks-sonuc");
    s.innerHTML = '<p class="v-etiket">Ekspertiz sonucu' + (ist ? " · " + e(ist.ad) : girdi.url ? " · " + e(girdi.url.replace(/^https?:\/\//, "")) : "") + "</p>" +
      (ist ? '<p class="eks-kimlik">' + e([ist.tur, ist.adres].filter(Boolean).join(" · ")) + (ist.puan != null ? " · ★ " + String(ist.puan).replace(".", ",") + " (" + ist.yorum + " yorum)" : "") + (ist.eminDegil ? ' <em>· Doğru işletme değilse Google Haritalar bağlantınızla tekrar deneyin.</em>' : "") + "</p>" : "") +
      '<div class="eks-skor ' + renk(skor) + '"><b>' + skor + '</b><span>/100</span></div><div class="eks-bar"><i style="width:' + skor + '%"></i></div>' +
      '<p class="v-alt" style="margin:18px 0 26px">' + e(yorum) + " <b>" + ciddi.length + " önemli eksik</b> bulundu.</p>" + googleNot +
      '<dl class="eks-alanlar">' + ALAN.map(function (a) { var p = d.alanlar[a]; return '<div class="' + renk(p) + '"><dt>' + e(d.alanAd[a]) + "</dt><dd><b>" + p + '</b>/100</dd><span class="eks-mini"><i style="width:' + p + '%"></i></span></div>'; }).join("") + "</dl>" +
      (rk ? '<h3 class="eks-h">Çevrenizdeki rakipler · ' + rk.sayi + " işletme (" + (rk.yaricap >= 1000 ? String(rk.yaricap / 1000).replace(".", ",") + " km" : rk.yaricap + " m") + ")</h3>" +
        '<table class="eks-rakip"><thead><tr><th>İşletme</th><th>Puan</th><th>Yorum</th></tr></thead><tbody>' +
        (ist ? '<tr class="biz"><td>' + e(ist.ad) + " (siz)</td><td>" + (ist.puan != null ? String(ist.puan).replace(".", ",") : "—") + "</td><td>" + ist.yorum + "</td></tr>" : "") +
        rk.ilk.map(function (r) { return "<tr><td>" + e(r.ad) + ' <small>' + (r.m >= 1000 ? (r.m / 1000).toFixed(1).replace(".", ",") + " km" : r.m + " m") + "</small></td><td>" + (r.puan != null ? String(r.puan).replace(".", ",") : "—") + "</td><td>" + r.yorum + "</td></tr>"; }).join("") + "</tbody></table>" : "") +
      (ilk3.length ? '<div class="eks-oncelik"><p class="v-etiket">Önce bunları yapın</p><ol>' + ilk3.map(function (x) { return "<li><b>" + e(x.ad) + "</b> " + e(x.cozum) + "</li>"; }).join("") + "</ol></div>" : "") +
      ALAN.map(function (a) {
        var liste = eksik.filter(function (x) { return x.alan === a; });
        if (!liste.length) return "";
        return '<h3 class="eks-h">' + e(d.alanAd[a]) + " · " + liste.length + ' eksik</h3><ol class="eks-liste">' + liste.map(function (x) {
          return '<li class="' + (x.durum === "uyari" ? "uyari" : "eksik") + '"><span>' + (x.durum === "uyari" ? "!" : "✗") + "</span><div><b>" + e(x.ad) + "</b><p>" + e(x.tespit) + "</p>" + (x.cozum ? '<p class="eks-cozum"><b>Ne yapılmalı:</b> ' + e(x.cozum) + "</p>" : "") + "</div></li>";
        }).join("") + "</ol>";
      }).join("") +
      (iyi.length ? '<details class="eks-iyi"><summary>İyi olanlar (' + iyi.length + ')</summary><ol class="eks-liste">' + iyi.map(function (x) { return '<li class="ok"><span>✓</span><div><b>' + e(x.ad) + "</b><p>" + e(x.tespit) + "</p></div></li>"; }).join("") + "</ol></details>" : "") +
      '<div class="eks-cta"><p class="v-etiket">Çözüm</p><h2>Bu eksiklerin <span>hepsi çözülebilir.</span></h2>' +
      '<p class="v-alt">Her eksiğin ne olduğunu ve nasıl düzeleceğini yukarıda yazdık. Önceliklendirilmiş planı ve süreyi telefonda 10 dakikada anlatalım; karar vermeden önce ücretsiz taslak da hazırlayabiliriz.</p>' +
      '<div class="v-dugmeler"><a class="v-btn ana" href="#eks-rapor">Beni arayın →</a><a class="v-btn" href="index.html#taslak">Önce ücretsiz taslak</a></div></div>';
    s.appendChild(document.getElementById("eks-cta").content.cloneNode(true));
    s.hidden = false; s.scrollIntoView({ behavior: "smooth", block: "start" });

    var rf = $("eks-rapor"), rd = rf.querySelector(".durum");
    if (ist && ist.ad) rf.isletme.value = ist.ad; else if (girdi.isletme) rf.isletme.value = girdi.isletme;
    rf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!rf.isletme.value.trim()) return yaz(rd, "İşletmenizin adını yazın.", "kotu");
      if (rf.tel.value.replace(/\D/g, "").length < 10) return yaz(rd, "Telefon numaranızı yazın.", "kotu");
      if (!rf.kvkk.checked) return yaz(rd, "KVKK onay kutusunu işaretleyin.", "kotu");
      var not = "Ekspertiz v2 puanı " + skor + "/100 (" + ALAN.map(function (a) { return d.alanAd[a] + " " + d.alanlar[a]; }).join(", ") + ")" +
        (ist ? ". Google: " + ist.ad + ", ★" + (ist.puan ?? "—") + " / " + ist.yorum + " yorum, durum " + ist.durum : "") +
        (rk ? ". Rakip ortancası: " + rk.ilk.map(function (r) { return r.yorum; }).join("/") + " yorum" : "") +
        ". Öneri: " + h.satirlar.map(function (r) { return r.ad; }).join(" + ") + " = " + TL(h.tek) + (h.ay ? " + " + TL(h.ay) + "/ay" : "") +
        ". Eksikler: " + ciddi.map(function (x) { return x.ad; }).join(" | ");
      var b = rf.querySelector("button"); b.disabled = true; yaz(rd, "Gönderiliyor…");
      API.taslakIste({ isletme: rf.isletme.value.trim(), sektor: (ist && ist.tur) || "", tel: rf.tel.value.trim(), eposta: rf.eposta.value.trim(), maps: girdi.maps || (ist && ist.harita) || "", web: girdi.url || (ist && ist.site) || "", kvkk: new Date().toISOString(), kaynak: "Ekspertiz", not: not.slice(0, 1900) })
        .then(function () { yaz(rd, "Talebiniz alındı. Bugün içinde sizi arayıp eksikleri ve çözüm planını anlatacağız.", "iyi"); rf.reset(); })
        .catch(function (x) { yaz(rd, "Gönderilemedi: " + (x && x.message || "bağlantı hatası"), "kotu"); })
        .then(function () { b.disabled = false; });
    });
  }
})();
