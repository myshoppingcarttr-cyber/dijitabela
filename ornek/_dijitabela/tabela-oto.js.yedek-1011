// Dijitabela konuşan tabela — otomatik sürüm (9 Eki 2026, Alim Bey: "tabelamızı tüm prototiplere koy").
// Kendi rehber.json/ses kaydı olmayan prototip sayfalarına _build/tabela-ekle.js ekler. Bölümleri sayfadan okur
// (başlık + ilk cümle), "Sesli dinle"de cihazın Türkçe sesiyle anlatır (speechSynthesis); görünüm rehber.js ile aynı.
(function () {
  "use strict";
  if (window.DJ_REHBER) return;
  var temiz = function (t) { return String(t || "").replace(/\s+/g, " ").trim(); };
  var cumle = function (t, n) { t = temiz(t); var m = t.match(/^(.{20,}?[.!?])(\s|$)/); t = m ? m[1] : t; return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; };
  var isletme = temiz((document.querySelector(".ust-cubuk .logo, header .logo") || {}).firstChild && (document.querySelector(".ust-cubuk .logo, header .logo").firstChild.textContent)) ||
    temiz(document.title.split(/\s[·|–-]\s/).pop());
  var satirlar = { giris: { metin: "Merhaba! Ben Dijitabela tabelasıyım. Bu sayfa " + (isletme ? isletme + " için" : "sizin için") + " hazırladığımız çalışır tasarım. Aşağı indikçe her bölümü size anlatacağım." } };
  var n = 0;
  [].slice.call(document.querySelectorAll("main section, body > section, section[id]")).forEach(function (s) {
    if (n >= 12 || s.hasAttribute("data-anlat") || s.closest("[data-anlat]")) return;
    var h = s.querySelector("h2, h3"); if (!h) return;
    var p = s.querySelector("p:not(.etiket):not(.ust)");
    var baslik = temiz(h.textContent).replace(/[.:]$/, ""); if (!baslik) return;
    var anahtar = "b" + (++n);
    s.setAttribute("data-anlat", anahtar);
    satirlar[anahtar] = { metin: baslik + ". " + (p ? cumle(p.textContent, 170) : "") };
  });
  var hero = document.querySelector(".hero, .kah, header + section, main > section");
  if (hero && !hero.hasAttribute("data-anlat")) hero.setAttribute("data-anlat", "giris");
  window.DJ_REHBER = { tts: true, ses: false, satirlar: satirlar };
  var s = document.createElement("script"); s.src = "/ornek/_dijitabela/rehber.js"; s.defer = true; document.body.appendChild(s);
})();
