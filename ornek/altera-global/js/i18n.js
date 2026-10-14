/* Altera Global prototipi · i18n.js (İşçi A) — AI18N çekirdeği. index.html <head> içinde İLK script, defer DEĞİL.
   API:
     AI18N.dil                      → etkin dil ("tr" | "en")
     AI18N.diller                   → [{kod, ad, etkin}]  (ar, ru: yakında / devre dışı)
     AI18N.ekle({tr:{...}, en:{...}})→ sözlükleri birleştirir (önek: A "k.", B "t.", C "p.")
     AI18N.t(anahtar, {deg})        → çeviri; "{ad}" yer tutucuları doldurulur; yoksa tr, o da yoksa anahtar
     AI18N.uygula(kok)              → kök altındaki [data-i18n] (textContent), [data-i18n-html] (innerHTML, yalnız kendi sözlüğümüz),
                                      [data-i18n-attr="placeholder:anahtar;aria-label:anahtar2"] öğelerini çevirir
     AI18N.ayarla(dil)              → dili değiştirir, <html lang> günceller, sayfayı çevirir, window "altera:dil" {detail:{dil}} yayar
     AI18N.sayi(n, ops) / AI18N.tarih(d, ops) / AI18N.goreli(dakika) → Intl ile dile göre biçim
   Dil seçimi: ?dil=en  >  localStorage("altera-dil")  >  "tr". */
(function (w, d) {
  "use strict";
  var ETKIN = ["tr", "en"];
  var DILLER = [
    { kod: "tr", ad: "Türkçe", etkin: true },
    { kod: "en", ad: "English", etkin: true },
    { kod: "ar", ad: "العربية", etkin: false },
    { kod: "ru", ad: "Русский", etkin: false }
  ];
  var sozluk = { tr: {}, en: {} };
  var YEREL = { tr: "tr-TR", en: "en-GB" };

  function bul() {
    var q = null;
    try { q = new URLSearchParams(w.location.search).get("dil"); } catch (e) {}
    if (q && ETKIN.indexOf(q) > -1) return q;
    try { var s = w.localStorage.getItem("altera-dil"); if (s && ETKIN.indexOf(s) > -1) return s; } catch (e) {}
    return "tr";
  }

  var A = {
    dil: bul(),
    diller: DILLER,
    ekle: function (yeni) {
      if (!yeni) return A;
      Object.keys(yeni).forEach(function (dl) {
        sozluk[dl] = sozluk[dl] || {};
        var kaynak = yeni[dl];
        for (var k in kaynak) if (Object.prototype.hasOwnProperty.call(kaynak, k)) sozluk[dl][k] = kaynak[k];
      });
      // DOM hazırsa yeni anahtarları hemen uygula (geç yüklenen modüller için)
      if (hazir) A.uygula(d);
      return A;
    },
    t: function (anahtar, deg) {
      var s = (sozluk[A.dil] && sozluk[A.dil][anahtar]);
      if (s == null) s = sozluk.tr[anahtar];
      if (s == null) return anahtar;
      if (typeof s === "function") return s(deg || {}, A.dil);
      if (deg) s = String(s).replace(/\{(\w+)\}/g, function (m, ad) { return deg[ad] != null ? deg[ad] : m; });
      return s;
    },
    var: function (anahtar) { return (sozluk[A.dil] && sozluk[A.dil][anahtar] != null) || sozluk.tr[anahtar] != null; },
    uygula: function (kok) {
      kok = kok || d;
      if (!kok.querySelectorAll) return;
      var liste = [];
      if (kok.nodeType === 1 && (kok.hasAttribute("data-i18n") || kok.hasAttribute("data-i18n-html") || kok.hasAttribute("data-i18n-attr"))) liste.push(kok);
      liste = liste.concat(Array.prototype.slice.call(kok.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-attr]")));
      liste.forEach(function (n) {
        var k = n.getAttribute("data-i18n");
        if (k && A.var(k)) n.textContent = A.t(k);
        var h = n.getAttribute("data-i18n-html");
        if (h && A.var(h)) n.innerHTML = A.t(h);
        var at = n.getAttribute("data-i18n-attr");
        if (at) at.split(";").forEach(function (cift) {
          var p = cift.split(":"); if (p.length < 2) return;
          var ad = p[0].trim(), an = p.slice(1).join(":").trim();
          if (ad && an && A.var(an)) n.setAttribute(ad, A.t(an));
        });
      });
    },
    ayarla: function (dl) {
      if (ETKIN.indexOf(dl) < 0) return false;
      var degisti = dl !== A.dil;
      A.dil = dl;
      try { w.localStorage.setItem("altera-dil", dl); } catch (e) {}
      d.documentElement.lang = dl;
      d.documentElement.setAttribute("data-dil", dl);
      try {
        var u = new URL(w.location.href);
        if (dl === "tr") u.searchParams.delete("dil"); else u.searchParams.set("dil", dl);
        w.history.replaceState(w.history.state, "", u.toString());
      } catch (e) {}
      A.uygula(d);
      if (degisti) {
        var ev; try { ev = new CustomEvent("altera:dil", { detail: { dil: dl } }); } catch (e) { ev = d.createEvent("CustomEvent"); ev.initCustomEvent("altera:dil", false, false, { dil: dl }); }
        w.dispatchEvent(ev);
      }
      return true;
    },
    yerel: function () { return YEREL[A.dil] || "tr-TR"; },
    sayi: function (n, ops) { try { return new Intl.NumberFormat(A.yerel(), ops).format(n); } catch (e) { return String(n); } },
    tarih: function (t, ops) { try { return new Intl.DateTimeFormat(A.yerel(), ops || { day: "numeric", month: "long", year: "numeric" }).format(t instanceof Date ? t : new Date(t)); } catch (e) { return String(t); } },
    goreli: function (dakika) {
      try {
        var rtf = new Intl.RelativeTimeFormat(A.yerel(), { numeric: "auto" });
        var m = Math.round(-Math.abs(dakika));
        if (Math.abs(m) < 60) return rtf.format(m, "minute");
        if (Math.abs(m) < 1440) return rtf.format(Math.round(m / 60), "hour");
        return rtf.format(Math.round(m / 1440), "day");
      } catch (e) { return dakika + " dk"; }
    }
  };

  var hazir = false;
  d.documentElement.lang = A.dil;
  d.documentElement.setAttribute("data-dil", A.dil);
  w.AI18N = A;
  // Deferred modüller (karsilama/test/panel) ekle() çağrılarını DOMContentLoaded'dan önce yapar; burada topluca uygulanır.
  d.addEventListener("DOMContentLoaded", function () { hazir = true; A.uygula(d); });
})(window, document);
