// ===== Ücretsiz dijital ekspertiz: site analizi (sunucu) + 4 alanda sorular → alan puanları, eksikler, çözüm ve paket =====
(function () {
  "use strict";
  var A = window.AJANS || {}, F = window.FIYAT, $ = function (id) { return document.getElementById(id); }, e = window.esc, TL = F.TL;
  var f = $("eks-form"); if (!f) return;

  // Alanlar: toplam puandaki ağırlıkları
  var ALAN = [
    { id: "gorunurluk", ad: "Google'da bulunma", agirlik: 35 },
    { id: "iletisim", ad: "İletişim ve satış", agirlik: 25 },
    { id: "sadakat", ad: "Müşteri takibi ve sadakat", agirlik: 25 },
    { id: "yz", ad: "Yapay zekâ ve otomasyon", agirlik: 15 }
  ];
  // [id, alan, soru, eksik sayılan cevap, eksik açıklaması, ağırlık, çözüm kalemi]
  var SORULAR = [
    ["kapali", "gorunurluk", "Google'da işletmenizi aratınca “Kalıcı olarak kapandı” ya da “Geçici olarak kapalı” yazıyor mu?", "evet", "Google'da “kapandı” görünüyorsunuz; müşteri sizi kapanmış sanıp başka yere gidiyor.", 14, "seo"],
    ["sahip", "gorunurluk", "Google profilinizi siz (ya da çalışanınız) yönetiyor musunuz?", "hayir", "Google profiliniz sahipsiz; bilgileri başkası değiştirebilir, siz düzeltemezsiniz.", 10, "seo"],
    ["webbag", "gorunurluk", "Google profilinizde web sitenizin bağlantısı var mı?", "hayir", "Google profilinizde web sitesi bağlantısı yok; profilden sitenize kimse geçemiyor.", 6, "seo"],
    ["saat", "gorunurluk", "Çalışma saatleriniz Google'da doğru ve güncel mi?", "hayir", "Çalışma saatleri yanlış ya da eksik; müşteri kapalı sanıp gelmiyor.", 5, "seo"],
    ["foto", "gorunurluk", "Son 3 ayda Google profilinize fotoğraf eklendi mi?", "hayir", "Profil fotoğrafları eski; yeni ve gerçek fotoğraflar tıklanmayı artırır.", 5, "seo"],
    ["wa", "iletisim", "WhatsApp'tan gelen mesajlara gece, hafta sonu ve yoğun saatlerde de birkaç dakika içinde cevap veriliyor mu?", "hayir", "Cevapsız kalan her WhatsApp mesajı kaçan bir müşteri. Yapay zekâ asistanı 7/24 anında cevap verir, sipariş ve randevu alır, gerekirse size devreder.", 10, "wa"],
    ["siparis", "iletisim", "Müşteri sizi aramadan online sipariş verebiliyor ya da randevu alabiliyor mu?", "hayir", "Sipariş ve randevu telefona bağlı; meşgulken ya da kapalıyken gelen iş kaçıyor. Sipariş ve randevular otomatik karşılanabilir.", 8, "randevu"],
    ["kacan", "iletisim", "Cevaplanamayan aramalar ve mesajlar bir listede toplanıp geri dönülüyor mu?", "hayir", "Kaçan aramaların kaydı yok; geri dönülmeyen her arama rakibinize gidiyor.", 7, "crm"],
    ["crm", "sadakat", "Müşterilerinizin adı, telefonu ve geçmiş alışverişleri dijital bir sistemde kayıtlı mı?", "hayir", "Müşteri bilgisi defterde ya da akılda; kim ne aldı, ne zaman tekrar gelmeli, takip edilemiyor.", 9, "crm"],
    ["hatirlat", "sadakat", "Bakımı, randevusu ya da yeni alışveriş zamanı gelen müşteriye otomatik hatırlatma gidiyor mu?", "hayir", "Müşteri hatırlatılmadığı için geri gelmiyor; ilk alışveriş son alışveriş oluyor. Otomatik hatırlatma müşteriyi size bağlar.", 8, "crm"],
    ["memnun", "sadakat", "Her alışverişten sonra müşteriye memnuniyeti soruluyor ve memnun müşteri Google yorumuna yönlendiriliyor mu?", "hayir", "Memnun müşteri yorum yazmıyor, memnun olmayan yazıyor. Her alışverişten sonra otomatik memnuniyet sorusu olumlu yorumları çoğaltır, şikâyeti önce size getirir.", 8, "yorum"],
    ["yorum", "sadakat", "Google'da 30'dan fazla yorumunuz var mı?", "hayir", "Yorum sayınız az; Google da müşteriler de yorumu çok olan işletmeyi seçiyor.", 6, "yorum"],
    ["yz", "yz", "İşinizde yapay zekâ kullanıyor musunuz (mesajlara cevap, teklif hazırlama, içerik yazma)?", "hayir", "Yapay zekâ entegrasyonu yok. Rakipleriniz mesaj, teklif ve içerik işini otomatiğe bağlarken bu işler sizde elle yapılıyor.", 10, "wa"],
    ["sosyal", "yz", "Sosyal medyada haftada en az 2 düzenli paylaşım yapılıyor mu?", "hayir", "Sosyal medya durgun. Çektiğiniz fotoğraftan paylaşım metni yapay zekâ ile otomatik hazırlanabilir.", 6, "icerik"]
  ];
  // Sunucudaki site kontrollerinin alanı ve çözüm kalemi
  var KONTROL_ALAN = { tel: "iletisim", whatsapp: "iletisim", form: "iletisim", siparis: "iletisim", yorumlink: "sadakat", sohbet: "yz", sosyal: "yz" };
  var KONTROL_KALEM = { baslik: "seo", aciklama: "seo", h1: "seo", yapisal: "seo", sitemap: "seo", robots: "seo", gorsel: "seo", olcum: "seo", harita: "seo", guncel: "bakim", sohbet: "wa", siparis: "randevu", yorumlink: "yorum", sosyal: "icerik" };

  var cevap = {}, site = null, harita = null, siteYok = false, bitti = false, adres = "", mapsLink = "";
  function yaz(el, m, s) { el.textContent = m; el.className = "durum " + (s || ""); }
  var URL_FN = (A.supabaseUrl || "") + "/functions/v1/ekspertiz";
  function analizEt(url) {
    return fetch(URL_FN, { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey || "" }, body: JSON.stringify({ url: url }) }).then(function (r) { return r.json(); });
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
    if (!siteYok && !adres && !mapsLink) return yaz($("e-durum"), "Web sitenizin adresini ya da Google Haritalar bağlantınızı yazın (siteniz yoksa kutuyu işaretleyin).", "kotu");
    f.hidden = true; $("eks-sorular").hidden = false; $("eks-sorular").scrollIntoView({ behavior: "smooth", block: "start" });
    var isler = [];
    if (!siteYok && adres) isler.push(analizEt(adres).then(function (d) { site = d; }).catch(function () { site = { hata: true }; }));
    if (mapsLink) isler.push(analizEt(mapsLink).then(function (d) { harita = d.harita || null; }).catch(function () {}));
    var adimlar = ["Güvenli bağlantı kontrol ediliyor…", "Mobil uyum kontrol ediliyor…", "Hız ölçülüyor…", "Google başlıkları okunuyor…", "Telefon ve WhatsApp düğmeleri aranıyor…", "Online sipariş ve randevu aranıyor…", "Sohbet ve yapay zekâ asistanı aranıyor…"], i = 0;
    var zam = setInterval(function () { if (!bitti) $("eks-ilerleme-yazi").textContent = adimlar[i++ % adimlar.length]; }, 900);
    Promise.all(isler).then(function () { bitti = true; clearInterval(zam); $("eks-ilerleme").classList.add("tamam"); $("eks-ilerleme-yazi").textContent = siteYok || !adres ? "Hazır. Soruları cevaplayın." : "Siteniz incelendi. Soruları bitirince sonucu görün."; hazirMi(); });
  });

  // Sorular, alan başlıklarıyla
  var no = 0;
  $("eks-soru-liste").innerHTML = ALAN.map(function (a) {
    return '<li class="eks-alan-bas">' + e(a.ad) + "</li>" + SORULAR.filter(function (s) { return s[1] === a.id; }).map(function (s) {
      no++;
      return '<li><span class="eks-no">' + (no < 10 ? "0" : "") + no + "</span><div><p>" + e(s[2]) + '</p><div class="eks-secim" role="radiogroup">' + [["evet", "Evet"], ["hayir", "Hayır"], ["bilmiyorum", "Bilmiyorum"]].map(function (c) {
        return '<label><input type="radio" name="s-' + s[0] + '" value="' + c[0] + '"><span>' + c[1] + "</span></label>";
      }).join("") + "</div></div></li>";
    }).join("");
  }).join("");
  $("eks-soru-sayi").textContent = SORULAR.length;
  $("eks-soru-liste").addEventListener("change", function (ev) { cevap[ev.target.name.slice(2)] = ev.target.value; hazirMi(); });
  function hazirMi() {
    var kalan = SORULAR.length - Object.keys(cevap).length;
    $("eks-sonuc-dugme").disabled = !(bitti && kalan === 0);
    $("eks-sonuc-dugme").textContent = kalan ? "Sonucu gör (" + kalan + " soru kaldı)" : bitti ? "Sonucu gör →" : "Site inceleniyor…";
  }
  $("eks-sonuc-dugme").addEventListener("click", sonuc);

  function sonuc() {
    // Her alanda kazanılan / toplam
    var P = {}; ALAN.forEach(function (a) { P[a.id] = { kaz: 0, top: 0 }; });
    var eksik = [], iyi = [];
    var ekle = function (alan, ad, not, agirlik, kalem, durum) {
      P[alan].top += agirlik; P[alan].kaz += durum === "ok" ? agirlik : durum === "uyari" ? agirlik / 2 : 0;
      (durum === "ok" ? iyi : eksik).push({ alan: alan, ad: ad, not: not, kalem: kalem, uyari: durum === "uyari", agirlik: agirlik });
    };
    // Site
    if (siteYok || !adres) ekle("gorunurluk", "Web sitesi", "Web siteniz yok. Google'da “web sitesi” düğmesine basan müşteri hiçbir şey bulamıyor; rakibinizin sitesine gidiyor.", 40, "site", "eksik");
    else if (!site || site.hata || site.acilmadi) ekle("gorunurluk", "Web sitesi açılmıyor", "Siteniz analiz sırasında açılmadı ya da çok geç yanıt verdi. Müşteri sitenize ulaşamıyor olabilir.", 40, "site", "eksik");
    else (site.kontroller || []).forEach(function (k) { ekle(KONTROL_ALAN[k.id] || "gorunurluk", k.ad, k.not, k.agirlik, KONTROL_KALEM[k.id] || "site", k.durum); });
    // Sorular
    SORULAR.forEach(function (s) {
      var c = cevap[s[0]];
      ekle(s[1], s[0] === "kapali" || s[0] === "sahip" ? "Google profili" : ALAN.filter(function (a) { return a.id === s[1]; })[0].ad, c === "bilmiyorum" ? "Emin değilsiniz; kontrol edilmeli. " + s[4] : s[4], s[5], s[6], c === s[3] ? "eksik" : c === "bilmiyorum" ? "uyari" : "ok");
    });
    if (harita && harita.kapali) eksik.unshift({ alan: "gorunurluk", ad: "Google profili", not: "Harita kaydınızda “Kalıcı olarak kapandı” ifadesi görünüyor. Bu en acil sorun.", kalem: "seo", agirlik: 99 });

    var alanPuan = {}, skor = 0;
    ALAN.forEach(function (a) { alanPuan[a.id] = P[a.id].top ? Math.round(P[a.id].kaz / P[a.id].top * 100) : 100; skor += alanPuan[a.id] * a.agirlik / 100; });
    skor = Math.round(skor);
    var ciddi = eksik.filter(function (x) { return !x.uyari; });
    var renk = function (p) { return p >= 75 ? "iyi" : p >= 50 ? "orta" : "kotu"; };
    var yorum = skor >= 75 ? "İyi durumdasınız, ama birkaç eksik hâlâ müşteri kaybettiriyor." : skor >= 50 ? "Müşterilerin bir kısmı sizi bulamıyor, ulaşamıyor ya da bir daha gelmiyor." : "İnternette ve satış sonrasında müşteri kaybediyorsunuz. Eksiklerin çoğu birkaç haftada giderilebilir.";

    // Çözüm: eksiklerden kalemler → fiyat motoru (CRM varsa uygulama da eklenir, böylece Dijital İşletme paketi uygulanır)
    var kalemler = [];
    ciddi.concat(eksik.filter(function (x) { return x.uyari && x.agirlik >= 6; })).forEach(function (x) { if (x.kalem && x.kalem !== "bakim" && kalemler.indexOf(x.kalem) < 0) kalemler.push(x.kalem); });
    if (kalemler.some(function (k) { return k === "site" || k === "seo"; })) ["site", "seo"].forEach(function (k) { if (kalemler.indexOf(k) < 0) kalemler.push(k); });
    if (kalemler.indexOf("crm") > -1 && kalemler.indexOf("uygulama") < 0) kalemler.push("uygulama");
    var sira = Object.keys(F.KALEMLER); kalemler.sort(function (a, b) { return sira.indexOf(a) - sira.indexOf(b); });
    var h = F.hesapla(kalemler), vitrin = F.PAKETLER[0];
    var gorunurlukEksik = ciddi.some(function (x) { return x.alan === "gorunurluk"; });

    var s = $("eks-sonuc");
    s.innerHTML = '<p class="v-etiket">Ekspertiz sonucu' + (harita && harita.ad ? " · " + e(harita.ad) : adres ? " · " + e(adres.replace(/^https?:\/\//, "")) : "") + "</p>" +
      '<div class="eks-skor ' + renk(skor) + '"><b>' + skor + '</b><span>/100</span></div><div class="eks-bar"><i style="width:' + skor + '%"></i></div>' +
      '<p class="v-alt" style="margin:18px 0 26px">' + e(yorum) + " <b>" + ciddi.length + " önemli eksik</b> bulundu.</p>" +
      '<dl class="eks-alanlar">' + ALAN.map(function (a) { return '<div class="' + renk(alanPuan[a.id]) + '"><dt>' + e(a.ad) + "</dt><dd><b>" + alanPuan[a.id] + '</b>/100</dd><span class="eks-mini"><i style="width:' + alanPuan[a.id] + '%"></i></span></div>'; }).join("") + "</dl>" +
      ALAN.map(function (a) {
        var liste = eksik.filter(function (x) { return x.alan === a.id; }).sort(function (x, y) { return (x.uyari ? 1 : 0) - (y.uyari ? 1 : 0); });
        if (!liste.length) return "";
        return '<h3 class="eks-h">' + e(a.ad) + " · " + liste.length + " eksik</h3><ol class=\"eks-liste\">" + liste.map(function (x) {
          return '<li class="' + (x.uyari ? "uyari" : "eksik") + '"><span>' + (x.uyari ? "!" : "✗") + "</span><div><b>" + e(x.ad) + "</b><p>" + e(x.not) + "</p>" + (x.kalem && F.KALEMLER[x.kalem] ? '<p class="eks-cozum">Çözüm: ' + e(F.KALEMLER[x.kalem].ad) + "</p>" : "") + "</div></li>";
        }).join("") + "</ol>";
      }).join("") +
      (iyi.length ? '<details class="eks-iyi"><summary>İyi olanlar (' + iyi.length + ")</summary><ol class=\"eks-liste\">" + iyi.map(function (x) { return '<li class="ok"><span>✓</span><div><b>' + e(x.ad) + "</b><p>" + e(x.not) + "</p></div></li>"; }).join("") + "</ol></details>" : "") +
      '<div class="eks-cta"><p class="v-etiket">Çözüm</p>' +
      (gorunurlukEksik ? '<h2>Google\'daki eksiklerin hepsi <span>tek pakette.</span></h2><div class="eks-fiyat"><b>' + TL(vitrin.fiyat).replace(" TL", "") + "</b><span>TL<br>+ KDV · tek seferlik</span></div>" +
        '<p class="v-alt">' + e(vitrin.ad) + " paketi: " + vitrin.kalemler.map(function (k) { return e(F.KALEMLER[k].ad); }).join(" + ") + ". " + e(vitrin.sure) + " içinde teslim.</p>" : '<h2>Eksiklerinizi <span>birlikte kapatalım.</span></h2>') +
      (h.satirlar.length > (gorunurlukEksik ? 1 : 0) ? '<div class="eks-oneri"><p class="eks-oneri-bas">Bulunan tüm eksikler için önerimiz</p>' + h.satirlar.map(function (r) { return '<div class="row"><span>' + e(r.ad) + '</span><span>' + (r.tek ? TL(r.tek) : "") + (r.ay ? (r.tek ? " + " : "") + TL(r.ay) + "/ay" : "") + "</span></div>"; }).join("") +
        '<div class="row top"><span>Toplam, tek seferlik</span><b>' + TL(h.tek) + "</b></div>" + (h.ay ? '<div class="row"><span>Aylık işletim (isteğe bağlı)</span><span>' + TL(h.ay) + "/ay</span></div>" : "") + (h.indirim ? '<p class="eks-kazanc">Paket avantajı: ' + TL(h.indirim) + " tasarruf</p>" : "") + "</div>" : "") +
      '<div class="v-dugmeler"><a class="v-btn ana" href="teklif-al.html?secim=' + encodeURIComponent((gorunurlukEksik && h.satirlar.length <= 1 ? vitrin.kalemler : kalemler).join(",")) + '">Eksikleri giderelim →</a><a class="v-btn" href="index.html#taslak">Önce ücretsiz taslak</a></div></div>';
    s.appendChild(document.getElementById("eks-cta").content.cloneNode(true));
    $("eks-sorular").hidden = true; s.hidden = false; s.scrollIntoView({ behavior: "smooth", block: "start" });

    var rf = $("eks-rapor"), rd = rf.querySelector(".durum");
    if (harita && harita.ad) rf.isletme.value = harita.ad;
    rf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!rf.isletme.value.trim()) return yaz(rd, "İşletmenizin adını yazın.", "kotu");
      if (rf.tel.value.replace(/\D/g, "").length < 10) return yaz(rd, "Telefon numaranızı yazın.", "kotu");
      if (!rf.kvkk.checked) return yaz(rd, "KVKK onay kutusunu işaretleyin.", "kotu");
      var not = "Ekspertiz puanı " + skor + "/100 (" + ALAN.map(function (a) { return a.ad + " " + alanPuan[a.id]; }).join(", ") + "). Öneri: " + h.satirlar.map(function (r) { return r.ad; }).join(" + ") + " = " + TL(h.tek) + (h.ay ? " + " + TL(h.ay) + "/ay" : "") + ". Eksikler: " + ciddi.map(function (x) { return x.not.split(/[;.]/)[0]; }).join(" | ");
      var b = rf.querySelector("button"); b.disabled = true; yaz(rd, "Gönderiliyor…");
      API.taslakIste({ isletme: rf.isletme.value.trim(), sektor: f.sektor.value, tel: rf.tel.value.trim(), eposta: rf.eposta.value.trim(), maps: mapsLink, web: siteYok ? "" : adres, kvkk: new Date().toISOString(), kaynak: "Ekspertiz", not: not })
        .then(function () { yaz(rd, "Rapor talebiniz alındı. Bugün içinde sizi arayıp eksikleri ve çözümleri anlatacağız.", "iyi"); rf.reset(); })
        .catch(function (x) { yaz(rd, "Gönderilemedi: " + (x && x.message || "bağlantı hatası"), "kotu"); })
        .then(function () { b.disabled = false; });
    });
  }
})();
