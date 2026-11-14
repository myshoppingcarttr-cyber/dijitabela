/* Ortalama Vade arayüzü: kapsayıcıya kendini çizer. Veri yalnız bu cihazın localStorage'ında kalır. */
(function () {
  "use strict";
  var V = window.DTV, DT = window.DT, el = DT.el, ANAHTAR = "dt-ortalama-vade";
  function bugunIso() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  window.DT_VADE = function (kap) {
    var kayit = DT.depo.oku(ANAHTAR, null);
    var durum = kayit && Array.isArray(kayit.satirlar) ? kayit : { baz: bugunIso(), satirlar: [{ tutar: "", vade: "" }, { tutar: "", vade: "" }] };
    if (!durum.baz) durum.baz = bugunIso();
    kap.textContent = "";
    var form = el("div", { sinif: "z-form" }), liste = el("div", { sinif: "kira-liste" }), sonuc = el("div", { sinif: "z-sonuc", "aria-live": "polite" });
    function kaydet() { DT.depo.yaz(ANAHTAR, durum); }
    var baz = el("input", { type: "date", id: "v-baz", deger: durum.baz });
    baz.addEventListener("input", function () { durum.baz = baz.value; kaydet(); ciz(); });
    form.appendChild(el("label", { sinif: "alan", ic: [el("span", { sinif: "et", metin: "Başlangıç tarihi (bordro / bugün)" }), baz, el("small", { metin: "Günler bu tarihten sayılır. Ortalama vade tarihi de bu tarihe eklenir." })] }));
    function satirCiz() {
      liste.textContent = "";
      durum.satirlar.forEach(function (r, i) {
        var t = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": (i + 1) + ". tutar", placeholder: "Tutar, örnek 15.000,50", deger: r.tutar || "" });
        var v = el("input", { type: "date", "aria-label": (i + 1) + ". vade tarihi", deger: r.vade || "" });
        t.addEventListener("input", function () { r.tutar = t.value; kaydet(); ciz(); });
        v.addEventListener("input", function () { r.vade = v.value; kaydet(); ciz(); });
        var sil = el("button", { type: "button", sinif: "btn iki sil", metin: "Sil", "aria-label": (i + 1) + ". satırı sil", tik: function () { durum.satirlar.splice(i, 1); if (!durum.satirlar.length) durum.satirlar.push({ tutar: "", vade: "" }); kaydet(); satirCiz(); ciz(); } });
        liste.appendChild(el("div", { sinif: "kart", ic: [el("div", { sinif: "kart-alanlar", ic: [el("label", { sinif: "alan", ic: [el("span", { sinif: "et", metin: (i + 1) + ". tutar (TL)" }), t] }), el("label", { sinif: "alan", ic: [el("span", { sinif: "et", metin: (i + 1) + ". vade tarihi" }), v] })] }), el("div", { sinif: "kart-eylem", ic: [sil] })] }));
      });
    }
    var eylem = el("div", { sinif: "arac-eylem", ic: [
      el("button", { type: "button", sinif: "btn", metin: "Satır ekle", tik: function () { if (durum.satirlar.length >= V.MAKS_SATIR) { DT.bildir("En fazla " + V.MAKS_SATIR + " satır.", "kotu"); return; } durum.satirlar.push({ tutar: "", vade: "" }); kaydet(); satirCiz(); } }),
      DT.onayliDugme("Hepsini temizle", "Onayla: tüm satırlar silinsin", "btn iki sil", function () { durum.satirlar = [{ tutar: "", vade: "" }, { tutar: "", vade: "" }]; kaydet(); satirCiz(); ciz(); })
    ] });
    var depoUyari = el("p", { sinif: "uyari", metin: "Bu tarayıcı kaydı tutamıyor; sayfa kapanınca girdiler silinir.", hidden: "" });
    function ciz() {
      var c = V.hesapla(durum), bazTr = durum.baz ? V.gunTr(V.tarihGun(durum.baz) || 0) : "";
      sonuc.textContent = "";
      depoUyari.hidden = !DT.depo.sorunlu();
      if (c.durum === "bos") { sonuc.appendChild(el("p", { sinif: "sonuc-alt", metin: "En az bir satıra tutar ve vade tarihi yazın." })); return; }
      if (c.durum === "hata") { c.hatalar.slice(0, 6).forEach(function (h) { sonuc.appendChild(el("p", { sinif: "sonuc-hata", metin: h })); }); return; }
      sonuc.appendChild(el("div", { sinif: "sonuc-ana", ic: [el("span", { sinif: "et", metin: "Ortalama vade tarihi" }), el("b", { metin: c.ortalamaVadeTr })] }));
      sonuc.appendChild(el("p", { sinif: "sonuc-alt", metin: "Tutar ağırlıklı ortalama " + V.gunYaz10(c.agirlikliGun10) + " gün · " + c.adet + " evrak · toplam " + V.tl(c.toplamKurus) }));
      sonuc.appendChild(el("p", { sinif: "sonuc-alt", metin: "Karşılaştırma: tutarı hesaba katmayan basit ortalama " + V.gunYaz10(c.basitGun10) + " gün. Tutarlar birbirinden çok farklıysa doğru olan ağırlıklı ortalamadır." }));
      c.uyarilar.forEach(function (u) { sonuc.appendChild(el("p", { sinif: "uyari", metin: u })); });
      var tablo = el("table"), th = el("tr", { ic: ["#", "Tutar", "Vade", "Gün"].map(function (x) { return el("th", { metin: x }); }) });
      tablo.appendChild(el("thead", { ic: [th] }));
      var tb = el("tbody");
      c.satirlar.forEach(function (r) { tb.appendChild(el("tr", { ic: [String(r.no), V.tl(r.kurus), V.gunTr(r.vade), String(r.gun)].map(function (x) { return el("td", { metin: x }); }) })); });
      tablo.appendChild(tb);
      sonuc.appendChild(el("div", { sinif: "tablo-kay", tabindex: "0", role: "region", "aria-label": "Evrak listesi", ic: [tablo] }));
      var ozet = V.ozetMetin(c, bazTr);
      sonuc.appendChild(el("div", { sinif: "kart-eylem", ic: [
        el("button", { type: "button", sinif: "btn iki", metin: "Özeti kopyala", tik: function () { DT.kopyala(ozet); } }),
        el("button", { type: "button", sinif: "btn iki", metin: "Paylaş", tik: function () { DT.paylas("Ortalama vade", ozet); } })
      ] }));
    }
    satirCiz();
    kap.appendChild(form); kap.appendChild(liste); kap.appendChild(eylem); kap.appendChild(depoUyari); kap.appendChild(sonuc);
    ciz();
  };
})();
