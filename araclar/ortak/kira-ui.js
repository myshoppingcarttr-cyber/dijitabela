/* Kira Zam Defteri arayüzü: kapsayıcıya kendini çizer (site ve uygulama aynı kod). */
(function () {
  "use strict";
  var H = window.DTH, DT = window.DT, el = DT.el, ANAHTAR = "dt-kira-defter";
  var HATA = {
    "tarih-bos": "Yenileme tarihini seçin; o ayın oranı kendiliğinden gelir.",
    "tarih-gecersiz": "Tarih geçersiz.",
    "oran-yok": "Bu ayın oranı tabloda yok. TÜİK açıkladığında oranı aşağıya elle yazın.",
    "oran-gecersiz": "Elle oran anlaşılmadı. Örnek: 31,23",
    "oran": "Oran 0 ile 200 arasında olmalı.",
    "kira-bos": "Mevcut kirayı yazın. Örnek: 15.000,50",
    "kira": "Kira anlaşılmadı. Örnek: 15.000,50",
    "kira-buyuk": "Kira 10 milyar TL'yi aşamaz."
  };
  var satirlar, kap, sonNo = 0;
  function yeniNo() { sonNo = Math.max(sonNo, Date.now()) + 1; return String(sonNo); }
  function uyariGoster(ok) {
    var u = kap.querySelector(".depo-uyari");
    if (u) u.hidden = ok !== false && !DT.depo.sorunlu();
  }
  function kaydet() { uyariGoster(DT.depo.yaz(ANAHTAR, satirlar)); }
  function alan(etiket, input, ipucu) {
    return el("label", { sinif: "alan", ic: [el("span", { sinif: "et", metin: etiket }), input, ipucu ? el("small", { metin: ipucu }) : null] });
  }
  function kart(r) {
    var sonucK = el("div", { sinif: "kart-sonuc", "aria-live": "polite" });
    var eylem = el("div", { sinif: "kart-eylem" });
    var girdi = function (ad, oz) {
      oz = oz || {}; oz.deger = r[ad] || "";
      var i = el("input", oz);
      i.addEventListener("input", function () { r[ad] = i.value; kaydet(); ciz(); });
      return i;
    };
    function ciz() {
      var c = H.kiraSatirCoz(r, DT.oranlar);
      sonucK.textContent = ""; eylem.textContent = "";
      if (c.durum === "tamam") {
        var s = c.sonuc;
        sonucK.appendChild(el("div", { sinif: "sonuc-ana", ic: [el("span", { sinif: "et", metin: "En fazla yeni kira" }), el("b", { metin: H.tl(s.yeni) })] }));
        sonucK.appendChild(el("p", { sinif: "sonuc-alt", metin: "Zam " + H.tl(s.zam) + " · " + H.oranYaz(s.oran) + " · " + (c.elle ? "elle girilen oran" : c.bulunan.ay + " yenilemesi, " + c.kaynak + " verisi") }));
        var mesaj = H.kiraMesaj(r, s, c.elle ? null : c.kaynak);
        eylem.appendChild(el("button", { type: "button", sinif: "btn iki", metin: "Mesajı kopyala", tik: function () { DT.kopyala(mesaj); } }));
        eylem.appendChild(el("button", { type: "button", sinif: "btn iki", metin: "Paylaş", tik: function () { DT.paylas("Kira yenileme", mesaj); } }));
        if (r.tarih) eylem.appendChild(el("button", { type: "button", sinif: "btn iki", metin: DT.yerel() ? "Hatırlat" : "Takvime ekle", tik: function () {
          DT.hatirlat(r.id, "Kira yenileme" + (r.kiraci ? ": " + r.kiraci : ""), (r.adres ? r.adres + " · " : "") + "en fazla " + H.tl(s.yeni), r.tarih);
        } }));
        if (r.tarih) eylem.appendChild(DT.onayliDugme("Yenilendi", "Onayla: yeni kira, +1 yıl", "btn iki", function () {
          var y = H.yenilendi(r, DT.oranlar); if (!y) return;
          satirlar[satirlar.indexOf(r)] = y; kaydet(); listele(); DT.bildir("Yeni kira işlendi, tarih bir yıl ilerledi");
        }));
      } else {
        sonucK.appendChild(el("p", { sinif: "sonuc-hata", metin: HATA[c.durum] || "" }));
      }
      eylem.appendChild(DT.onayliDugme("Sil", "Silmek için dokunun", "btn iki sil", function () {
        satirlar.splice(satirlar.indexOf(r), 1); if (!satirlar.length) satirlar.push({ id: yeniNo() }); kaydet(); listele();
      }));
    }
    var k = el("article", { sinif: "kart", ic: [
      el("div", { sinif: "kart-alanlar", ic: [
        alan("Kiracı", girdi("kiraci", { type: "text", autocomplete: "off", maxlength: "80" })),
        alan("Adres / daire", girdi("adres", { type: "text", autocomplete: "off", maxlength: "120" })),
        alan("Yenileme tarihi", girdi("tarih", { type: "date", min: "2000-01-01", max: "2100-12-31" })),
        alan("Mevcut aylık kira (TL)", girdi("kira", { type: "text", inputmode: "decimal", autocomplete: "off", placeholder: "15.000,50" })),
        alan("Elle oran %", girdi("oranElle", { type: "text", inputmode: "decimal", autocomplete: "off", placeholder: "Tablodaki oran" }), "İsteğe bağlı: sözleşmede daha düşük oran varsa veya ay tabloda yoksa")
      ] }), sonucK, eylem
    ] });
    ciz();
    return k;
  }
  function listele() {
    var l = kap.querySelector(".kira-liste"); l.textContent = "";
    satirlar.forEach(function (r) { l.appendChild(kart(r)); });
  }
  function oranTablosu() {
    var o = DT.oranlar, g = el("tbody"), kk = Object.keys(o.kira).sort().reverse();
    kk.forEach(function (k) {
      var p = k.split("-");
      g.appendChild(el("tr", { ic: [el("td", { metin: H.AYLAR[+p[1] - 1] + " " + p[0] }), el("td", { metin: o.kira[k].veri }), el("td", { sinif: "sag", metin: H.oranYaz(o.kira[k].o) })] }));
    });
    return el("div", { sinif: "tablo-kay", tabindex: "0", ic: [el("table", { ic: [el("thead", { ic: [el("tr", { ic: [el("th", { metin: "Yenileme ayı" }), el("th", { metin: "TÜİK verisi" }), el("th", { sinif: "sag", metin: "Üst sınır" })] })] }), g] })] });
  }
  window.DT_KIRA = function (kapsayici) {
    kap = kapsayici;
    var d = DT.depo.oku(ANAHTAR, null);
    satirlar = Array.isArray(d) ? d.filter(function (x) { return x && typeof x === "object"; }).map(function (r) { if (!r.id) r.id = yeniNo(); return r; }) : [];
    if (!satirlar.length) satirlar.push({ id: yeniNo() });
    kap.textContent = "";
    kap.appendChild(el("p", { sinif: "uyari depo-uyari", hidden: "hidden", metin: "Kayıt izni yok. Girdiğiniz bilgiler bu sayfa kapanınca kaybolur. Çıkmadan CSV indirin." }));
    if (DT.oranBayat()) kap.appendChild(el("p", { sinif: "uyari", metin: "Oran tablosu " + H.tarihYaz(H.tarihOku(DT.oranlar.kontrol)) + " tarihinde kontrol edildi. Yeni ay açıklanmış olabilir; TÜİK'ten doğrulayın." }));
    kap.appendChild(el("div", { sinif: "kira-liste" }));
    kap.appendChild(el("div", { sinif: "arac-eylem", ic: [
      el("button", { type: "button", sinif: "btn", metin: "+ Kiracı ekle", tik: function () {
        satirlar.push({ id: yeniNo() }); kaydet(); listele();
        var ks = kap.querySelectorAll(".kart"), inp = ks[ks.length - 1].querySelector("input"); if (inp) inp.focus();
      } }),
      el("button", { type: "button", sinif: "btn iki", metin: "CSV indir", tik: function () { DT.indir("kira-zam-defteri.csv", H.kiraCsv(satirlar, DT.oranlar), "text/csv"); } }),
      el("button", { type: "button", sinif: "btn iki", metin: "Tüm mesajları kopyala", tik: function () {
        var m = satirlar.map(function (r) { var c = H.kiraSatirCoz(r, DT.oranlar); return c.durum === "tamam" ? H.kiraMesaj(r, c.sonuc, c.elle ? null : c.kaynak) : ""; }).filter(Boolean);
        if (!m.length) { DT.bildir("Önce tarih ve kira girin.", "kotu"); return; }
        DT.kopyala(m.join("\n\n"));
      } })
    ] }));
    kap.appendChild(el("details", { sinif: "acilir", ic: [
      el("summary", { metin: "Oran tablosu (son kontrol " + H.tarihYaz(H.tarihOku(DT.oranlar.kontrol)) + ")" }), oranTablosu(),
      el("p", { sinif: "kucuk", metin: "Uygulamada yenileme ayından önceki ayın TÜİK 12 aylık ortalaması kullanılır. Sözleşmeniz başka bir dönem söylüyorsa elle oran alanını kullanın." })
    ] }));
    listele();
    kaydet();
  };
})();
