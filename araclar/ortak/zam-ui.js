/* Pişmanlık / Gecikme Zammı arayüzü: kapsayıcıya kendini çizer (site ve uygulama aynı kod). */
(function () {
  "use strict";
  var H = window.DTH, DT = window.DT, el = DT.el, ANAHTAR = "dt-zam-girdi";
  function alan(etiket, input, ipucu) {
    return el("label", { sinif: "alan", ic: [el("span", { sinif: "et", metin: etiket }), input, ipucu ? el("small", { metin: ipucu }) : null] });
  }
  function satir(ad, deger, ana) {
    return el("div", { sinif: "dokum" + (ana ? " ana" : ""), ic: [el("span", { metin: ad }), el("b", { metin: deger })] });
  }
  function blok(et, baslik, gosterge, govde, not) {
    return el("section", { sinif: "sonuc-blok", ic: [el("span", { sinif: "et", metin: et }), el("h3", { metin: baslik }), el("div", { sinif: "dev", metin: gosterge })].concat(govde).concat(not ? [el("p", { sinif: "kucuk", metin: not })] : []) });
  }
  window.DT_ZAM = function (kap) {
    var d = DT.depo.oku(ANAHTAR, {}) || {};
    var iAsil = el("input", { id: "z-asil", type: "text", inputmode: "decimal", autocomplete: "off", placeholder: "100.000,00", deger: d.asil || "" });
    var iVade = el("input", { id: "z-vade", type: "date", min: "2005-01-01", max: "2100-12-31", deger: d.vade || "" });
    var iOde = el("input", { id: "z-odeme", type: "date", min: "2005-01-01", max: "2100-12-31", deger: d.odeme || "" });
    var iBey = el("input", { id: "z-beyan", type: "date", min: "2005-01-01", max: "2100-12-31", deger: d.beyan || "" });
    var iGrup = el("select", { id: "z-grup" });
    DT.oranlar.ceza2026.gruplar.forEach(function (g) { iGrup.appendChild(el("option", { value: g.id, metin: g.ad })); });
    iGrup.value = d.grup || "birinci";
    var iSekil = el("select", { id: "z-sekil", ic: [el("option", { value: "e", metin: "Elektronik" }), el("option", { value: "kagit", metin: "Kâğıt" })] });
    iSekil.value = d.sekil || "e";
    var sonuc = el("div", { id: "z-sonuc", sinif: "z-sonuc", "aria-live": "polite" });

    function hesapla(oDug) {
      var g = { asil: iAsil.value, vade: iVade.value, odeme: iOde.value, oranlar: DT.oranlar };
      DT.depo.yaz(ANAHTAR, { asil: iAsil.value, vade: iVade.value, odeme: iOde.value, beyan: iBey.value, grup: iGrup.value, sekil: iSekil.value });
      sonuc.textContent = "";
      var r = H.zamHesap(g);
      if (r.hata) { if (oDug === true) sonuc.appendChild(el("p", { sinif: "sonuc-hata", metin: r.hata })); return; }
      if (r.gecikmeYok) { sonuc.appendChild(el("p", { sinif: "uyari", metin: r.gun < 0 ? "Ödeme tarihi vadeden önce. Gecikme yok, zam hesaplanmaz." : "Ödeme vade gününde. Gecikme yok, zam hesaplanmaz." })); return; }
      var c = H.cezaHesap({ vade: iVade.value, beyan: iBey.value || iOde.value, grup: iGrup.value, sekil: iSekil.value, oranlar: DT.oranlar });

      var zamaninda = c && c.gecikmeYok, ceza = c && !c.gecikmeYok ? c : null, n = H.senaryo(r, c);
      sonuc.appendChild(el("p", { sinif: "uyari koyu", metin: zamaninda ? "Beyan süresinde verilmiş görünüyor. Bu durumda yalnız gecikme zammı geçerlidir." : "Bu rakamlar birbirinin seçeneği değildir. Hangisinin geçerli olduğu beyannamenin süresinde verilip verilmediğine ve pişmanlık şartlarına bağlıdır." }));
      sonuc.appendChild(el("p", { sinif: "ozet", metin: H.tarihYaz(H.tarihOku(iVade.value)) + " → " + H.tarihYaz(H.tarihOku(iOde.value)) + " · " + r.gun + " gün (" + r.tamAy + " ay " + r.kalanGun + " gün)" }));
      if (iBey.value && H.tarihOku(iBey.value) && H.gunFark(H.tarihOku(iBey.value), H.tarihOku(iOde.value)) > 15 && !zamaninda) sonuc.appendChild(el("p", { sinif: "uyari", metin: "Ödeme, beyandan 15 günden sonra görünüyor. Pişmanlık için ödeme haber verme tarihinden itibaren 15 gün içinde yapılmalı." }));
      if (H.tarihOku(iOde.value).getTime() > Date.now()) sonuc.appendChild(el("p", { sinif: "kucuk", metin: "Ödeme tarihi ileride: bugünkü oranın süreceği varsayıldı." }));

      var gb = el("tbody");
      r.satirlar.forEach(function (s) {
        gb.appendChild(el("tr", { ic: [
          el("td", { metin: H.tarihYaz(H.tarihOku(s.bas)) + " – " + H.tarihYaz(H.tarihOku(s.bit)) }),
          el("td", { metin: s.tur === "ay" ? "1 ay" : s.gun + " gün" }),
          el("td", { sinif: "sag", metin: H.oranYaz(s.oran) }),
          el("td", { sinif: "sag", metin: H.tl(s.tutar) })
        ] }));
      });
      var dokum = el("details", { sinif: "acilir", ic: [el("summary", { metin: "Dönem dökümü" }), el("div", { sinif: "tablo-kay", tabindex: "0", ic: [el("table", { ic: [
        el("thead", { ic: [el("tr", { ic: [el("th", { metin: "Dönem" }), el("th", { metin: "Süre" }), el("th", { sinif: "sag", metin: "Aylık" }), el("th", { sinif: "sag", metin: "Tutar" })] })] }), gb] })] })] });

      sonuc.appendChild(blok("Beyan süresinde verildi, ödeme gecikti", "Gecikme zammı", H.tl(r.gecikmeZammi),
        [satir("Vergi + zam", H.tl(r.gecikmeToplam), true), dokum],
        "6183 m.51. Tam ay aylık oranla, ay kesri gün gün hesaplanır (aylık oran / 30)."));
      if (!zamaninda) {
        var yil = ceza && !ceza.yil2026 ? "Dikkat: usulsüzlük tutarı 2026 cetvelidir; fiil başka yıldaysa o yılın tutarı geçerlidir. " : "";
        var pGovde = [satir("Süre", r.pismanlikAy + " ay (kesir tam ay)")];
        if (ceza) pGovde.push(satir("Usulsüzlük · " + (ceza.kagit ? "1 kat" : ceza.kademe), H.tl(n.pismanlikUsulsuzluk)));
        pGovde.push(satir("Vergi + zam" + (ceza ? " + usulsüzlük" : ""), H.tl(n.pismanlikGenel), true));
        sonuc.appendChild(blok("Beyan süresinde verilmedi, pişmanlıkla", "Pişmanlık zammı", H.tl(r.pismanlikZammi), pGovde,
          yil + "VUK 371. Vergi ziyaı cezası kesilmez, usulsüzlük kesilir. Şartlar: inceleme veya ihbardan önce dilekçe, beyan ve vergi ile zammın tamamının haber verme tarihinden itibaren 15 gün içinde ödenmesi; kısmi ödeme kabul edilmez. Tahakkuk fişi 15. güne göre düzenlenir, daha erken ödeme son ay kesrini ortadan kaldırıyorsa fazlası düzeltme ile geri alınır. Emlak vergisinde uygulanmaz."));
        var yGovde = [satir("Gecikme faizi (" + r.tamAy + " tam ay)", H.tl(r.gecikmeFaizi)), satir("Vergi ziyaı %50", r.vzKesilmez ? "Kesilmez (300 TL altı)" : H.tl(r.vergiZiyai50))];
        if (ceza && ceza.kagit) yGovde.push(satir("I. derece usulsüzlük × 2", H.tl(ceza.ikiKat)), satir("Kesilen ceza (ağır olan)", H.tl(n.pismanliksizCeza)));
        else if (ceza) yGovde.push(satir("Özel usulsüzlük · " + ceza.kademe, H.tl(ceza.tutar)));
        yGovde.push(satir("Vergi + faiz + ceza", H.tl(n.pismanliksizGenel), true));
        sonuc.appendChild(blok("Beyan süresinde verilmedi, pişmanlık yok", "Vergi cezası + gecikme faizi", H.tl(H.yuvarla(n.pismanliksizCeza + r.gecikmeFaizi)), yGovde,
          yil + "VUK 344 ve 112/3. Faizin bitişi tahakkuk tarihidir; burada ödeme tarihi kabul edildi. " +
          (ceza && ceza.kagit ? "Kâğıtta %50 vergi ziyaı ile 2 kat usulsüzlükten ağır olan kesilir (VUK 336). " : "Elektronikte özel usulsüzlük ayrıca kesilir; 352/I-1 kesilmez. ") +
          "İnceleme başladıktan sonra verilen beyanda ceza %50 değil tam uygulanır. Mükellefiyet kaydı yoksa ceza %50 artar. Uzlaşma, 376 indirimi ve tekerrür dahil değildir."));
        sonuc.appendChild(el("p", { sinif: "kucuk", metin: "Geç beyan süresi vade tarihinden sayıldı; beyannamenin son günü vadeden farklıysa kademe değişebilir. Muhtasar ve prim hizmet beyannamesinde 5510 idari para cezası gerekiyorsa usulsüzlük ayrıca kesilmez." }));
      } else {
        sonuc.appendChild(el("p", { sinif: "kucuk", metin: "Beyan vade günü veya öncesinde verildiği için pişmanlık ve geç beyan cezası hesaplanmadı." }));
      }
      var metin = H.zamMetni(g, r, c);
      sonuc.appendChild(el("div", { sinif: "arac-eylem", ic: [
        el("button", { type: "button", sinif: "btn iki", metin: "Sonucu kopyala", tik: function () { DT.kopyala(metin); } }),
        el("button", { type: "button", sinif: "btn iki", metin: "Paylaş", tik: function () { DT.paylas("Zam hesabı", metin); } }),
        el("button", { type: "button", sinif: "btn iki", metin: "CSV indir", tik: function () { DT.indir("gecikme-pismanlik.csv", H.zamCsv(g, r, c), "text/csv"); } })
      ] }));
    }

    kap.textContent = "";
    if (DT.oranBayat()) kap.appendChild(el("p", { sinif: "uyari", metin: "Oran tablosu " + H.tarihYaz(H.tarihOku(DT.oranlar.kontrol)) + " tarihinde kontrol edildi. Oran veya ceza tutarı değişmiş olabilir; GİB'den doğrulayın." }));
    kap.appendChild(el("form", { sinif: "z-form", novalidate: "novalidate", ic: [
      el("div", { sinif: "z-alanlar", ic: [
        alan("Vergi aslı (TL)", iAsil),
        alan("Vade tarihi", iVade, "Son gün tatilse bir sonraki iş günü"),
        alan("Ödeme tarihi", iOde),
        alan("Beyanname verilme tarihi", iBey, "Boşsa ödeme tarihi kabul edilir"),
        alan("Mükellef grubu", iGrup, "Yalnız ceza satırını etkiler"),
        alan("Beyan şekli", iSekil)
      ] }),
      el("button", { type: "submit", sinif: "btn", metin: "Hesapla" })
    ] }));
    kap.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); hesapla(true); });
    [iAsil, iVade, iOde, iBey, iGrup, iSekil].forEach(function (i) { i.addEventListener(i.tagName === "SELECT" ? "change" : "input", function () { hesapla(false); }); });
    kap.appendChild(sonuc);
    kap.appendChild(el("details", { sinif: "acilir", ic: [
      el("summary", { metin: "Gecikme zammı oran tablosu (son kontrol " + H.tarihYaz(H.tarihOku(DT.oranlar.kontrol)) + ")" }),
      (function () {
        var t = el("tbody");
        DT.oranlar.zam.forEach(function (z) { t.appendChild(el("tr", { ic: [el("td", { metin: H.tarihYaz(H.tarihOku(z.t)) + " →" }), el("td", { metin: z.k }), el("td", { sinif: "sag", metin: H.oranYaz(z.o) })] })); });
        return el("div", { sinif: "tablo-kay", tabindex: "0", ic: [el("table", { ic: [el("thead", { ic: [el("tr", { ic: [el("th", { metin: "Yürürlük" }), el("th", { metin: "Dayanak" }), el("th", { sinif: "sag", metin: "Aylık" })] })] }), t] })] });
      })(),
      el("p", { sinif: "kucuk", metin: "Oran, dönem başladığı günkü orandır. Ay içinde değişirse o tam ay eski oranla hesaplanır; ay kesrinde değişim gününden itibaren yeni oran uygulanır." })
    ] }));
    hesapla(false);
  };
})();
