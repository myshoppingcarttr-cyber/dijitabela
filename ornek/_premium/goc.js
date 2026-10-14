// Göç / yurt dışı danışmanlığı premium modülü (GELİŞİM G-06, 14 Eki 2026): uygunluk testi (6 soru, fotoğraflı sonuç) · belge kontrol listesi · başvuru takvimi (.ics) · ön görüşme randevusu + KVKK onay kutusu
// Kurgusal şablon. Fiyat / tutar yok, sonuç ve süre vaadi yok. Schengen tarih kuralı: AB Vize Kodu (810/2009) md. 9/1 (2019/1155 ile): en erken 6 ay, kural olarak en geç 15 gün önce.
(function () {
  var E = window.ESNAF;
  var GUN = 864e5;
  // ---------- 1) Uygunluk testi ----------
  var SORU = [
    ["amac", "Yurt dışındaki öncelikli hedefiniz ne?", "Size en yakın olanı seçin; diğer seçenekleri görüşmede birlikte ele alırız.", [["calisma", "Çalışmak", "İş teklifiyle ya da mesleğinizle"], ["ogrenci", "Eğitim almak", "Lisans, yüksek lisans, dil okulu"], ["aile", "Ailemin yanına gitmek", "Eş, çocuk, aile birleşimi"], ["yatirim", "Yatırım ya da girişimle oturum", "Şirket kurma, yatırım programları"], ["ziyaret", "Turistik / ticari ziyaret", "Kısa süreli seyahat, fuar, iş görüşmesi"]]],
    ["bolge", "Hangi bölgeyi hedefliyorsunuz?", "Kararsızsanız son seçeneği işaretleyin; seçenekleri birlikte daraltırız.", [["ab", "Avrupa Birliği", "Almanya, Hollanda, İtalya ve diğer Schengen ülkeleri"], ["uk", "Birleşik Krallık", "İngiltere, İskoçya, Galler"], ["abd", "ABD", "Ziyaret, öğrenci ve çalışma vizeleri"], ["kanada", "Kanada", "Öğrenci ve nitelikli göç yolları"], ["kararsiz", "Kararsızım", "Önce seçenekleri görmek istiyorum"]]],
    ["egitim", "Tamamladığınız en yüksek eğitim?", "Nitelikli çalışma yollarının çoğu tanınan bir diploma ya da belgeli meslek eğitimi ister.", [["lise", "Lise", "Ya da devam eden üniversite"], ["meslek", "Meslek eğitimi", "Ön lisans, ustalık, sertifika"], ["lisans", "Üniversite (lisans)", "Dört yıllık diploma"], ["yl", "Yüksek lisans / doktora", "Lisansüstü diploma"]]],
    ["dil", "Yabancı dil seviyeniz?", "İngilizce ya da hedef ülkenin dili; kabaca bir seviye yeterli.", [["bas", "Başlangıç", "Temel kelimeler, kısa cümleler"], ["orta", "Orta", "Günlük konuşma ve yazışma"], ["ileri", "İleri", "İş ve okul düzeyinde akıcı"], ["cift", "İleri + hedef ülkenin dili", "İkinci bir dili de biliyorum"]]],
    ["bag", "Hedef ülkeyle bağlantınız var mı?", "İş teklifi, okul kabulü ya da orada yaşayan aileniz yolu doğrudan belirler.", [["yok", "Henüz yok", "Sıfırdan planlıyorum"], ["gorusme", "Başvurularım sürüyor", "İş ya da okul başvurusu yaptım"], ["is", "İş teklifim var", "İşverenden yazılı teklif"], ["okul", "Okul kabulüm var", "Kabul mektubu ya da şartlı kabul"], ["aile", "Orada yasal yaşayan eşim / ailem var", "Oturum ya da vatandaşlığı olan"]]],
    ["gecmis", "Vize geçmişiniz?", "Ret bir son değildir; doğru okunan ret gerekçesi yeni dosyanın haritasıdır.", [["ilk", "İlk başvurum olacak", "Daha önce vize almadım"], ["var", "Vize aldım, kurallara uydum", "Süresinde döndüm"], ["ret", "Son yıllarda ret aldım", "Yeniden başvurmak istiyorum"]]]
  ];
  var YOL = {
    calisma: ["Çalışma izni / nitelikli çalışan vizesi", "t_calisma", "İş teklifi, diploma ve mesleki belgeler çalışma dosyasının temelidir"],
    ogrenci: ["Öğrenci vizesi", "t_ogrenci", "Kabul mektubu ve geçim kaynağının belgelenmesi öğrenci dosyasının temelidir"],
    aile: ["Aile birleşimi", "t_aile", "Yanına gidilen kişinin oturum statüsü dosyayı belirler"],
    yatirim: ["Yatırım / girişimci yoluyla oturum", "t_yatirim", "Yatırımın yasal kaynağının belgelenmesi temel şarttır"],
    ziyaret: ["Turistik / ticari ziyaret vizesi", "t_ziyaret", "Seyahat amacı, maddi durum ve Türkiye'ye dönüş bağları belgelenir"],
    ret: ["Ret sonrası yeniden başvuru", "t_ret", "Önce ret gerekçesi okunur, eksik giderilir, sonra yeni dosya"]
  };
  var BOLGE_NOT = {
    calisma: { ab: "Avrupa Birliği'nde nitelikli çalışanlar için Mavi Kart yolu vardır: tanınan bir yükseköğrenim diploması ve ülkenin belirlediği eşiği karşılayan iş sözleşmesi aranır. Bazı ülkelerde diplomanın tanınması (denklik) ayrıca istenir.", uk: "Birleşik Krallık'ta çalışma vizesi genelde lisanslı bir işverenin sponsorluğuyla ve İngilizce şartıyla alınır.", abd: "ABD çalışma vizelerinin çoğu işverenin başvurusuyla başlar; bazı türlerde yıllık kota ve kura uygulanır.", kanada: "Kanada'nın puanlı sistemleri yaş, eğitim, dil sınavı sonucu ve iş deneyimini birlikte değerlendirir.", kararsiz: "Ülke seçimi, mesleğinizin hangi ülkelerde arandığına bakılarak birlikte yapılır." },
    ogrenci: "Okul kabul mektubu, eğitim süresince geçiminizi karşılayacak kaynağın belgelenmesi ve sağlık sigortası temel şartlardır; dil yeterliliği okulun ve ülkenin şartına göre istenir.",
    aile: "Yanına gidilecek kişinin oturum statüsü belirleyicidir. Bazı ülkelerde (ör. Almanya) eşten başlangıç düzeyinde dil belgesi istenebilir; evlilik ve doğum belgelerinin tercümesi ve apostili gerekir.",
    yatirim: "Yatırım ya da girişimle oturum programlarının koşulları sık değişir; bazı ülkeler bu programları kapattı ya da daralttı. Oturum izni ile vatandaşlık ayrı süreçlerdir.",
    ziyaret: { ab: "Schengen başvurusu yolculuktan en erken 6 ay, kural olarak en geç 15 gün önce yapılır. Pasaportun son 10 yıl içinde alınmış ve dönüşten sonra en az 3 ay geçerli olması gerekir.", uk: "Birleşik Krallık ziyaret vizesinde seyahat amacı ve maddi durumun belgeleri belirleyicidir.", abd: "ABD ziyaret vizesinde konsoloslukta yüz yüze mülakat yapılır; randevu bekleme süreleri dönemsel olarak değişir.", kanada: "Kanada ziyaret vizesi çevrim içi başvuru ve biyometrik kayıtla yapılır.", kararsiz: "Kısa süreli ziyaret vizesinde seyahat amacı, maddi durum ve Türkiye'ye dönüş bağları (iş, okul, aile, mülk) belgelenir." },
    ret: "Ret yazısındaki gerekçe yeni dosyanın haritasıdır. Gerekçe giderilmeden aynı dosyayla yeniden başvurmak çoğu zaman aynı sonucu doğurur. İtiraz yolu ve süresi ret yazısında belirtilir."
  };
  var cev = {}, adim = 0, sonucYollar = [];
  function puanla() {
    var a = cev, yuksekE = a.egitim === "lisans" || a.egitim === "yl", iyiDil = a.dil === "ileri" || a.dil === "cift", L = [];
    function yol(k, p, art, eks) { L.push({ k: k, p: Math.max(0, Math.min(5, p)), art: art.filter(Boolean), eks: eks.filter(Boolean) }); }
    yol("calisma", (a.amac === "calisma" ? 2 : 0) + (yuksekE ? 1 : a.egitim === "meslek" ? 0.5 : 0) + (iyiDil ? 1 : a.dil === "orta" ? 0.5 : 0) + (a.bag === "is" ? 2 : a.bag === "gorusme" ? 1 : 0),
      [a.amac === "calisma" && "Hedefiniz çalışmak", yuksekE && "Üniversite diplomanız nitelikli çalışma yollarının temel şartını karşılıyor", a.egitim === "meslek" && "Meslek eğitiminiz, ara eleman açığı olan ülkelerde değerlendirilebilir", a.bag === "is" && "İş teklifiniz var: çoğu çalışma vizesinin başlangıç noktası", iyiDil && "Dil seviyeniz iş görüşmeleri için yeterli görünüyor"],
      [a.bag !== "is" && "Henüz iş teklifi yok: önce iş arama ve başvuru planı gerekir", !yuksekE && a.egitim !== "meslek" && "Nitelikli çalışma yolları çoğunlukla diploma ya da belgeli meslek eğitimi ister", a.dil === "bas" && "Dil seviyenizi yükseltmek iş bulmayı kolaylaştırır"]);
    yol("ogrenci", (a.amac === "ogrenci" ? 2 : 0) + (a.bag === "okul" ? 2 : a.bag === "gorusme" ? 1 : 0) + (iyiDil ? 1 : a.dil === "orta" ? 0.5 : 0),
      [a.amac === "ogrenci" && "Hedefiniz eğitim", a.bag === "okul" && "Okul kabulünüz var: öğrenci vizesinin ilk şartı", iyiDil && "Dil seviyeniz okul şartlarının çoğunu karşılayabilir"],
      [a.bag !== "okul" && "Önce bir okuldan kabul alınması gerekir", a.dil === "bas" && "Çoğu okul belgelenmiş dil seviyesi ister; dil okulu ile başlamak bir seçenektir"]);
    yol("aile", (a.amac === "aile" ? 2 : 0) + (a.bag === "aile" ? 3 : 0),
      [a.amac === "aile" && "Hedefiniz ailenizin yanına gitmek", a.bag === "aile" && "Orada yasal yaşayan bir aile üyeniz var: aile birleşiminin temel şartı"],
      [a.bag !== "aile" && "Aile birleşimi için hedef ülkede yasal yaşayan bir eş ya da aile üyesi gerekir", a.dil === "bas" && a.bag === "aile" && "Bazı ülkeler eşten başlangıç düzeyinde dil belgesi ister"]);
    yol("yatirim", (a.amac === "yatirim" ? 3 : 0) + (a.gecmis === "var" ? 1 : 0) + (yuksekE ? 0.5 : 0),
      [a.amac === "yatirim" && "Hedefiniz yatırım ya da girişimle oturum", a.gecmis === "var" && "Sorunsuz vize geçmişiniz dosyanızı güçlendirir"],
      ["Yatırımın yasal kaynağının belgelenmesi gerekir; programlar ülkeye göre çok farklıdır"]);
    yol("ziyaret", (a.amac === "ziyaret" ? 3 : 0) + (a.gecmis === "var" ? 1 : 0) + (a.gecmis === "ret" ? -1 : 0) + 0.5,
      [a.amac === "ziyaret" && "Hedefiniz kısa süreli ziyaret", a.gecmis === "var" && "Kurallara uyduğunuz önceki vizeler dosyanızı güçlendirir"],
      [a.gecmis === "ret" && "Önceki ret gerekçesi yeni dosyada mutlaka giderilmeli", a.gecmis === "ilk" && "İlk başvuruda Türkiye'ye dönüş bağlarınızı (iş, okul, aile, mülk) iyi belgelemek önemlidir"]);
    L.sort(function (x, y) { return y.p - x.p; });
    var ust = L.filter(function (y, i) { return i === 0 || y.p >= 2; }).slice(0, 3);   // zayıf yollar listelenmez (en az 1 yol)
    if (a.gecmis === "ret") ust.unshift({ k: "ret", p: -1, art: ["Ret gerekçesini birlikte okuyup hangi belgenin ya da açıklamanın eksik kaldığını buluruz"], eks: ["Aynı dosyayla hemen yeniden başvurmayın"] });
    return ust;
  }
  function etiket(p) { if (p < 0) return ['seviye bugun', "Önce bu adım"]; if (p >= 4) return ["seviye plan", "Güçlü uyum"]; if (p >= 2) return ["seviye bugun", "Değerlendirilebilir"]; return ["seviye", "Şu an zayıf"]; }
  function bolgeNot(k) { var n = BOLGE_NOT[k]; return typeof n === "string" ? n : n[cev.bolge] || n.kararsiz; }
  function secAd(i, v) { var o = SORU[i][3].filter(function (x) { return x[0] === v; })[0]; return o ? o[1] : ""; }
  function uygunluk(k) {
    var q = function (s) { return E.q(k, s); };
    function ciz() {
      var s = SORU[adim];
      q(".gt-no").textContent = "Soru " + (adim + 1) + " / " + SORU.length;
      q(".gt-geri").style.visibility = adim ? "visible" : "hidden";
      q(".gt-cubuk").style.width = Math.round(adim / SORU.length * 100) + "%";
      q(".gt-soru").hidden = false; q(".gt-sonuc").hidden = true; q(".gt-dg").hidden = true;
      q(".gt-soru").innerHTML = "<h3>" + s[1] + '</h3><p class="alt">' + s[2] + '</p><div class="gt-sec">' + s[3].map(function (o) { return '<button type="button" data-v="' + o[0] + '"' + (cev[s[0]] === o[0] ? ' class="on"' : "") + ">" + o[1] + "<small>" + o[2] + "</small></button>"; }).join("") + "</div>";
      k.querySelectorAll(".gt-sec button").forEach(function (b) { b.onclick = function () {
        k.querySelectorAll(".gt-sec button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); cev[s[0]] = b.dataset.v;
        setTimeout(function () { if (adim < SORU.length - 1) { adim++; ciz(); } else sonuc(); }, 220);
      }; });
    }
    function sonuc() {
      sonucYollar = puanla(); adim = SORU.length;
      q(".gt-no").textContent = "Sonuç · ön değerlendirme"; q(".gt-cubuk").style.width = "100%";
      q(".gt-soru").hidden = true; q(".gt-sonuc").hidden = false; q(".gt-dg").hidden = false;
      q(".gt-sonuc").innerHTML = '<div class="sonuc" style="margin-top:12px"><b>Size en uygun görünen yollar</b><br><span class="not" style="margin:0">' + secAd(1, cev.bolge) + " · " + secAd(0, cev.amac) + "</span></div>" + sonucYollar.map(function (y, i) {
        var e = etiket(y.p), nokta = y.p < 0 ? "" : '<span class="gt-nokta" aria-label="Uyum ' + Math.round(y.p) + ' / 5">' + [1, 2, 3, 4, 5].map(function (n) { return "<i" + (n <= Math.round(y.p) ? ' class="d"' : "") + "></i>"; }).join("") + "</span>";
        return '<div class="gt-yol"><span class="' + e[0] + '"' + (e[1] === "Şu an zayıf" ? ' style="background:var(--cizgi);color:var(--yazi)"' : "") + ">" + e[1] + "</span>" + nokta + "<h4>" + (i + 1) + ". " + YOL[y.k][0] + "</h4>" +
          (y.art.length ? "<p><b>Lehinize:</b> " + y.art.join(" · ") + "</p>" : "") + (y.eks.length ? "<p><b>Dikkat:</b> " + y.eks.join(" · ") + "</p>" : "") + '<p class="not" style="margin-top:6px">' + bolgeNot(y.k) + "</p></div>";
      }).join("") + (sonucYollar.filter(function (y) { return y.k !== "ret"; }).length < 2 ? '<p class="not">Diğer yollar cevaplarınıza göre şu an zayıf görünüyor; ön görüşmede seçenekleri birlikte gözden geçiririz.</p>' : "");
      var ilk = sonucYollar[0]; E.fotoDegis(q(".gt-foto"), "../img/" + YOL[ilk.k][1] + ".jpg", YOL[ilk.k][0]); q(".gt-alt").textContent = YOL[ilk.k][0] + ": " + YOL[ilk.k][2] + ".";
      var hedef = YOL[sonucYollar.filter(function (y) { return y.k !== "ret"; })[0].k][0] + " · " + secAd(1, cev.bolge);
      var h = document.querySelector(".rv-hedef"); if (h) h.value = (cev.gecmis === "ret" ? "Ret sonrası · " : "") + hedef;
      var rh = document.querySelector(".rv-hiz"), ad = { calisma: "Çalışma izni", ogrenci: "Öğrenci vizesi", aile: "Aile birleşimi", yatirim: "Yatırım / girişimci yolları", ziyaret: "Turistik / ticari vize", ret: "Ret sonrası yeniden başvuru" }[ilk.k];
      if (rh) for (var i = 0; i < rh.options.length; i++) if (rh.options[i].text === ad) rh.selectedIndex = i;
    }
    q(".gt-geri").onclick = function () { if (adim > 0) { adim = Math.min(adim, SORU.length) - 1; ciz(); } };
    q(".gt-bastan").onclick = function () { cev = {}; adim = 0; ciz(); E.fotoDegis(q(".gt-foto"), "../img/t_gorusme.jpg", ""); q(".gt-alt").textContent = "Ön değerlendirme 1 dakika sürer; kişisel bilgi istemez."; };
    q(".gt-belge").onclick = function () {
      var harita = { calisma: "calisma", ogrenci: "ogrenci", aile: "aile", ziyaret: "ziyaret" }, t = "ziyaret";
      for (var i = 0; i < sonucYollar.length; i++) if (harita[sonucYollar[i].k]) { t = harita[sonucYollar[i].k]; break; }
      var s = document.querySelector(".bl-tur"); if (s) { s.value = t; s.onchange(); }
      var b = document.getElementById("belge"); if (b) b.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    q(".gt-gonder").onclick = function () {
      waAc("Merhaba, sitenizdeki uygunluk testini yaptım.\n" + SORU.map(function (s, i) { return "• " + s[1].replace("?", "") + ": " + secAd(i, cev[s[0]]); }).join("\n") + "\n\nÇıkan yollar:\n" + sonucYollar.map(function (y, i) { return (i + 1) + ". " + YOL[y.k][0] + " (" + etiket(y.p)[1] + ")"; }).join("\n") + "\n\nÖn görüşme istiyorum.");
    };
    ciz();
  }
  // ---------- 2) Belge kontrol listesi ----------
  var BELGE = {
    ortak: [["Biyometrik fotoğraf", "Son 6 ay içinde çekilmiş, açık renk fonlu; ölçü ülkeye göre değişir (Schengen'de çoğunlukla 35×45 mm)"], ["Başvuru formu", "Eksiksiz doldurulmuş ve imzalanmış"], ["Nüfus kayıt örneği", "e-Devlet'ten barkodlu, aile bireylerini gösteren"], ["Eski pasaportlar ve vizeler", "Varsa önceki vizelerin fotokopisi; seyahat geçmişinizi gösterir"]],
    pasaport: { ziyaret: ["Pasaport", "Son 10 yıl içinde alınmış, dönüşten sonra en az 3 ay geçerli, en az 2 boş sayfalı"], diger: ["Pasaport", "Kalış süresini kapsayacak geçerlilikte, en az 2 boş sayfalı"] },
    ziyaret: [["Seyahat sağlık sigortası", "Tüm Schengen bölgesinde geçerli, seyahat süresini kapsayan, asgari teminat şartını karşılayan poliçe"], ["Uçak ve konaklama rezervasyonu", "Tarihlerle uyumlu; bilet almadan önce rezervasyon çoğu zaman yeterlidir"], ["Davet yazısı / seyahat planı", "Ticari ziyarette karşı firmanın davet yazısı; turistik ziyarette gün gün plan"], ["Banka hesap dökümü", "Son 3 ay, banka onaylı; seyahat masraflarını karşılayabildiğinizi gösterir"]],
    ogrenci: [["Kabul mektubu", "Okul ya da üniversiteden, program ve tarihleri yazılı"], ["Geçim kaynağı belgesi", "Bloke hesap, burs belgesi ya da sponsor taahhüdü (ülkeye göre)"], ["Dil yeterlilik belgesi", "Okulun ve ülkenin istediği sınav ve seviye"], ["Diploma ve transkript", "Tercümeli; gerekiyorsa denklik ya da apostil"], ["Sağlık sigortası", "Eğitim süresini kapsayan"], ["Konaklama belgesi", "Yurt kaydı ya da kira sözleşmesi"]],
    calisma: [["İş sözleşmesi ya da iş teklifi", "İşverenden; pozisyon ve çalışma koşulları yazılı"], ["Diploma ve denklik", "Diplomanın hedef ülkede tanındığını gösteren belge (ülkeye göre)"], ["Mesleki belgeler", "Sertifika, ustalık belgesi, referans yazıları"], ["Özgeçmiş (CV)", "Hedef ülkenin alıştığı biçimde"], ["Dil belgesi", "Pozisyon ya da vize türü istiyorsa"], ["Sağlık sigortası", "İşe başlayana kadar geçen süreyi kapsayan"]],
    aile: [["Evlilik / doğum belgesi", "Çok dilli (uluslararası) örnek ya da apostilli belge + tercüme"], ["Yanına gidilen kişinin oturum belgesi", "Oturum kartı ya da vatandaşlık belgesinin kopyası"], ["Konut belgesi", "Aileye yetecek konutu gösteren kira sözleşmesi ya da tapu"], ["Geçim belgesi", "Yanına gidilen kişinin gelir belgeleri"], ["Dil belgesi", "Bazı ülkelerde eşten başlangıç düzeyi istenebilir"]],
    durum: {
      maasli: [["İşveren yazısı", "Antetli, imzalı; görevinizi, işe giriş tarihinizi ve izin onayını gösterir"], ["Maaş bordrosu", "Son 3 ay"], ["SGK hizmet dökümü", "e-Devlet'ten barkodlu"]],
      isveren: [["Vergi levhası", "Güncel yıla ait"], ["Faaliyet belgesi", "Oda kaydı; yakın tarihli"], ["Ticaret sicil gazetesi ve imza sirküleri", "Şirket sahibi ya da ortaklar için"]],
      ogrenci: [["Öğrenci belgesi", "e-Devlet'ten barkodlu, güncel"], ["Sponsor yazısı", "Masrafları karşılayan yakınınızın imzalı yazısı ve gelir belgeleri"]],
      emekli: [["Emeklilik belgesi", "e-Devlet'ten barkodlu"], ["Emekli maaş dökümü", "Son 3 ay"]],
      sponsor: [["Sponsor yazısı", "Masrafları karşılayan kişinin imzalı yazısı"], ["Sponsorun gelir belgeleri", "Bordro ya da vergi levhası ve banka dökümü"], ["Yakınlık belgesi", "Nüfus kayıt örneğinde görünmüyorsa"]]
    }
  };
  var DURUMLU = { ziyaret: 1, ogrenci: 1 };
  function belgeListe(k) {
    var q = function (s) { return E.q(k, s); }, liste = [];
    function kur() {
      var t = q(".bl-tur").value, d = q(".bl-durum").value;
      q(".bl-durum").disabled = !DURUMLU[t];
      liste = [BELGE.pasaport[t === "ziyaret" ? "ziyaret" : "diger"]].concat(BELGE.ortak, BELGE[t], DURUMLU[t] ? BELGE.durum[d] : []);
      q(".bl-liste").innerHTML = liste.map(function (b, i) { return '<li><input type="checkbox" id="gb' + i + '"><span><label for="gb' + i + '"><b>' + b[0] + "</b></label><br><small style=\"color:var(--soluk)\">" + b[1] + "</small></span></li>"; }).join("");
      k.querySelectorAll(".bl-liste input").forEach(function (x) { x.onchange = say; }); say();
    }
    function say() {
      var c = k.querySelectorAll(".bl-liste input"), n = 0; c.forEach(function (x) { if (x.checked) n++; x.closest("li").classList.toggle("ok", x.checked); });
      q(".bl-cubuk").style.width = Math.round(n / c.length * 100) + "%";
      q(".bl-sonuc").innerHTML = n === c.length ? "<b>Listedeki belgelerin hepsi hazır.</b> Danışmanınız dosyayı başvurudan önce bir kez daha kontrol eder." : "<b>" + n + " / " + c.length + "</b> belge hazır. " + (c.length - n) + " belge eksik; eksikleri danışmanınıza gönderip hangi sırayla tamamlayacağınızı birlikte planlayın." + (q(".bl-durum").disabled ? '<br><span class="not" style="margin:0">Bu başvuru türünde liste çalışma durumuna göre değişmez.</span>' : "");
    }
    q(".bl-tur").onchange = kur; q(".bl-durum").onchange = kur;
    q(".bl-sifirla").onclick = function () { k.querySelectorAll(".bl-liste input").forEach(function (x) { x.checked = false; }); say(); };
    q(".bl-gonder").onclick = function () {
      var eksik = []; k.querySelectorAll(".bl-liste input").forEach(function (x, i) { if (!x.checked) eksik.push("• " + liste[i][0]); });
      waAc("Merhaba, belge listemi kontrol ettim.\nBaşvuru: " + q(".bl-tur").selectedOptions[0].textContent + (q(".bl-durum").disabled ? "" : "\nDurumum: " + q(".bl-durum").selectedOptions[0].textContent) + (eksik.length ? "\nEksik belgeler:\n" + eksik.join("\n") : "\nListedeki belgelerin hepsi hazır.") + "\nGörüşmek istiyorum.");
    };
    kur();
  }
  // ---------- 3) Başvuru takvimi ----------
  // [gün önce, başlık, açıklama, kaynak mı (true = kural, false = önerimiz)]
  var TAKVIM = {
    ziyaret: [[182, "En erken başvuru tarihi", "Schengen başvurusu yolculuktan en fazla 6 ay önce yapılabilir", true, "pencere"], [75, "Belgeleri toplamaya başlayın", "Bordro, banka dökümü, işveren yazısı gibi belgeler için", false], [60, "Randevu alın", "Yaz ve bayram dönemlerinde randevular erken dolar", false], [15, "En geç başvuru tarihi", "Kural olarak yolculuktan en geç 15 gün önce", true], [0, "Yolculuk", "", false]],
    ogrenci: [[150, "Geçim kaynağı ve belge hazırlığı", "Bloke hesap ya da burs belgesi, diploma tercümeleri", false], [110, "Vize randevusu", "Öğrenci vizesinde işlem süresi ülkeye göre çok değişir", false], [45, "Konaklama ve sigorta son kontrol", "Yurt ya da kira belgesi, sağlık sigortası", false], [0, "Okul başlangıcı", "", false]],
    calisma: [[150, "Diploma denkliği başvurusu", "Gerekiyorsa genelde en uzun süren adımdır", false], [100, "Belge dosyası", "İş sözleşmesi, CV, mesleki belgeler, tercümeler", false], [75, "Vize randevusu", "Bazı ülkelerde işveren tarafındaki onay önce gelir", false], [0, "İşe başlama", "", false]],
    aile: [[150, "Apostil ve tercümeler", "Evlilik ve doğum belgeleri", false], [120, "Dil belgesi (gerekiyorsa)", "Kursa ve sınav tarihine göre planlayın", false], [80, "Vize randevusu", "Konut ve geçim belgeleri hazır olmalı", false], [0, "Hedef tarih", "", false]]
  };
  var TFOTO = { ziyaret: ["t_ziyaret", "Kısa süreli ziyaret: tarihler rezervasyonla uyumlu olmalı"], ogrenci: ["t_ogrenci", "Öğrenci vizesi: kabul mektubu ilk adımdır"], calisma: ["t_calisma", "Çalışma vizesi: iş teklifi ve diploma dosyanın temeli"], aile: ["t_aile", "Aile birleşimi: belgelerin tercüme ve apostili zaman alır"] };
  function takvim(k) {
    var q = function (s) { return E.q(k, s); }, olay = [];
    var v = new Date(); v.setDate(v.getDate() + 90); q(".tk-tarih").value = v.toISOString().slice(0, 10);
    function hes() {
      var t = q(".tk-tur").value, hedef = new Date((q(".tk-tarih").value || v.toISOString().slice(0, 10)) + "T10:00"), bugun = new Date(); bugun.setHours(0, 0, 0, 0);
      olay = []; var gecen = 0, sonGecti = false;
      q(".tk-liste").innerHTML = TAKVIM[t].map(function (a) {
        var g = new Date(hedef.getTime() - a[0] * GUN), gecti = g < bugun && a[0] > 0;
        if (a[4] === "pencere" && gecti) return '<li><b>' + g.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) + '</b><span><b style="color:var(--yazi);min-width:0">Başvuru penceresi açık</b><br><small>' + a[2] + " (kural). Bu tarihten itibaren başvurabilirsiniz.</small></span></li>";
        if (gecti) gecen++; if (gecti && t === "ziyaret" && a[0] === 15) sonGecti = true;
        if (!gecti && a[0] > 0) olay.push({ tarih: g, dk: 30, baslik: a[1] + " · " + (window.ISL.ad || ""), aciklama: a[2] });
        return '<li class="' + (gecti ? "gecti" : "") + '"><b>' + g.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) + "</b><span><b style=\"color:var(--yazi);min-width:0\">" + a[1] + "</b>" + (a[2] ? "<br><small>" + a[2] + (a[3] ? " (kural)" : a[0] ? " (önerimiz)" : "") + "</small>" : "") + (gecti ? '<br><small>Bu tarih geçti</small>' : "") + "</span></li>";
      }).join("");
      var kalan = Math.round((hedef - bugun) / GUN);
      q(".tk-sonuc").innerHTML = kalan < 0 ? "<b>Seçtiğiniz tarih geçmişte.</b> Lütfen ileri bir tarih seçin." : sonGecti ? '<span class="seviye acil">Son başvuru tarihi geçti</span><p style="margin-top:8px">Schengen\'de kural olarak en geç 15 gün önce başvurulur. Tarihi danışmanınızla yeniden planlayın.</p>' : "<b>Hedef tarihe " + kalan + " gün var.</b> " + (gecen ? gecen + " adımın önerilen tarihi geçti; bu adımlara hemen başlamanız iyi olur." : "Takvim rahat; ilk adımı takviminize ekleyin.") + (t === "ziyaret" && kalan > 182 ? "<br>En erken başvuru tarihi henüz gelmedi." : "");
      var f = TFOTO[t]; E.fotoDegis(q(".tk-foto"), "../img/" + f[0] + ".jpg", f[1]); q(".tk-alt").textContent = f[1];
      q(".tk-not").textContent = t === "ziyaret" ? "Schengen tarihleri AB Vize Kodu'na (810/2009 sayılı Tüzük, md. 9) dayanır. Karar süresi konsolosluğa ve döneme göre değişir; burada tarih vaat edilmez." : "Önerilen tarihler planlama içindir; işlem süreleri ülkeye, konsolosluğa ve döneme göre değişir. Süre vaadi değildir.";
    }
    q(".tk-tur").onchange = hes; q(".tk-tarih").oninput = q(".tk-tarih").onchange = hes; hes();
    q(".tk-ics").onclick = function () { if (olay.length) E.ics("basvuru-takvimi", olay); else q(".tk-sonuc").innerHTML = "<b>Eklenecek ileri tarihli adım yok.</b>"; };
    q(".tk-gonder").onclick = function () { waAc("Merhaba, başvuru takvimimi planlamak istiyorum.\nBaşvuru: " + q(".tk-tur").selectedOptions[0].textContent + "\nHedef tarih: " + E.tarih(new Date(q(".tk-tarih").value + "T10:00")) + "\nGörüşme istiyorum."); };
  }
  // ---------- 4) Ön görüşme + KVKK, süreç adımları ----------
  function randevu(k) {
    var gizli = document.createElement("input"); gizli.type = "hidden"; gizli.className = "rv-kvkk"; k.appendChild(gizli);
    var onay = k.querySelector(".kv-onay"), ileti = k.querySelector(".kv-ileti"), dg = k.querySelector(".rv-gonder");
    function guncel() { gizli.value = onay.checked ? "Aydınlatma metni okundu, onay verildi · Duyuru izni: " + (ileti.checked ? "evet" : "hayır") : ""; dg.setAttribute("aria-disabled", onay.checked ? "false" : "true"); }
    onay.onchange = ileti.onchange = guncel;
    E.randevu(k, ["Ön görüşme · uygunluk değerlendirmesi", "Turistik / ticari vize", "Öğrenci vizesi", "Çalışma izni", "Aile birleşimi", "Ret sonrası yeniden başvuru", "Yatırım / girişimci yolları"], [["Ad", ".rv-ad"], ["Görüşme", ".rv-sekil"], ["Hedef", ".rv-hedef"], ["KVKK", ".rv-kvkk"]]);
    var asil = dg.onclick;
    dg.onclick = function () {
      if (!onay.checked) { k.querySelector(".rv-ozet").innerHTML = '<b style="color:#e03131">Göndermek için aydınlatma metni onay kutusunu işaretleyin.</b>'; onay.focus(); return; }
      asil.call(dg);
    };
    guncel();
  }
  var SUREC = [["Ön görüşme", "Hedefiniz, geçmişiniz ve zamanlamanız konuşulur"], ["Yol seçimi ve belge listesi", "Size uygun başvuru yolu ve kişiye özel liste"], ["Dosya hazırlığı", "Tercüme, apostil, form ve son kontrol"], ["Randevu ve başvuru", "Randevu takibi, başvuru günü hatırlatması"], ["Karar", "İlgili ülkenin makamları karar verir; sonucu birlikte değerlendiririz"]];
  function surec(k) {
    var n = 2;
    function ciz() { k.querySelector(".sr-liste").innerHTML = SUREC.map(function (s, i) { return '<li class="' + (i < n ? "tamam" : i === n ? "simdi" : "bekler") + '"><i>' + (i < n ? "✓" : i + 1) + "</i><div><b>" + s[0] + "</b><br><small>" + s[1] + "</small></div></li>"; }).join(""); }
    k.querySelector(".sr-ilerle").onclick = function () { n = (n + 1) % (SUREC.length + 1); ciz(); };
    ciz();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".uygunluk").forEach(uygunluk); document.querySelectorAll(".belgel").forEach(belgeListe); document.querySelectorAll(".takvim").forEach(takvim);
    document.querySelectorAll(".rv").forEach(randevu); document.querySelectorAll(".surec").forEach(surec);
  });
})();
