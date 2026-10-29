// Dijitabela konuşan tabela — otomatik sürüm (9 Eki 2026, Alim Bey: "tabelamızı tüm prototiplere koy").
// Kendi rehber.json/ses kaydı olmayan prototip sayfalarına _build/tabela-ekle.js ekler. Bölümleri sayfadan okur
// (başlık + ilk cümle) ve yazıyla anlatır; görünüm rehber.js ile aynı. Ses YALNIZ Ayşe klonu kaydıyla (DJ_OTO_SES mp3) çalar (29 Eki, Patron):
// kaydı olmayan sayfada "Sesli dinle" düğmesi hiç görünmez, tarayıcı/cihaz sesi kullanılmaz.
(function () {
  "use strict";
  if (window.DJ_REHBER) return;
  var temiz = function (t) { return String(t || "").replace(/\s+/g, " ").trim(); };
  var cumle = function (t, n) { t = temiz(t); var m = t.match(/^(.{20,}?[.!?])(\s|$)/); t = m ? m[1] : t; return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };
  // 11 Eki: logo yalnız kısaltmaysa ("KE") sayfa başlığındaki ad kullanılır (artık Cartesia ile seslendiriliyor)
  var logoAd = temiz((document.querySelector(".ust-cubuk .logo, header .logo") || {}).firstChild && (document.querySelector(".ust-cubuk .logo, header .logo").firstChild.textContent));
  var basliktanAd = document.title.split(/\s[·|–-]\s/).map(temiz).filter(function (x) { return x && !/taslak|dijitabela|prototip|tasarım|örnek/i.test(x); })[0] || "";
  var isletme = logoAd.length >= 4 ? logoAd : basliktanAd;
  var satirlar = { giris: { metin: "Merhaba! Ben Dijitabela tabelasıyım. Bu sayfa " + (isletme ? isletme + " için" : "sizin için") + " hazırladığımız çalışır tasarım. Aşağı indikçe her bölümü size anlatacağım." } };
  var n = 0;
  [].slice.call(document.querySelectorAll("main section, body > section, section[id]")).forEach(function (s) {
    if (n >= 12 || s.hasAttribute("data-anlat") || s.closest("[data-anlat]")) return;
    var h = s.querySelector("h2, h3"); if (!h) return;
    // boş durum / yükleniyor yazıları anlatılmaz; ilk anlamlı paragraf seçilir
    var p = [].slice.call(s.querySelectorAll("p:not(.etiket):not(.ust)")).filter(function (x) { var t = temiz(x.textContent); return t.length >= 25 && !/bulunamad|yükleniyor|sonuç yok/i.test(t); })[0];
    var baslik = temiz(h.textContent).replace(/[.:]$/, ""); if (!baslik) return;
    var anahtar = "b" + (++n);
    s.setAttribute("data-anlat", anahtar);
    satirlar[anahtar] = { metin: baslik + (/[?!]$/.test(baslik) ? " " : ". ") + (p ? cumle(p.textContent, 170) : "") };
  });
  var hero = document.querySelector(".hero, .kah, header + section, main > section");
  if (hero && !hero.hasAttribute("data-anlat")) hero.setAttribute("data-anlat", "giris");
  // 11 Eki: _build/tabela-ses.js Cartesia kaydını ornek/_ses-oto/<imza>.mp3 merkezine üretir; tabela-ekle.js DJ_OTO_SES = {kok, dosya:{anahtar: imza}} ekler.
  // Kaydı olan satır mp3 çalar; kaydı olmayan (sayfa sonradan değişmiş) satır yalnız yazıyla gösterilir (sessiz).
  var K = window.DJ_OTO_SES, kayitli = K && K.kok && K.dosya ? K : null;
  if (kayitli) Object.keys(satirlar).forEach(function (k) { if (kayitli.dosya[k]) satirlar[k].dosya = kayitli.dosya[k]; else satirlar[k].tts = true; });
  window.DJ_REHBER = { ses: kayitli ? kayitli.kok : false, satirlar: satirlar };
  var s = document.createElement("script"); s.src = "/ornek/_dijitabela/rehber.js"; s.defer = true; document.body.appendChild(s);
})();
