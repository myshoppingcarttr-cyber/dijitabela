/* Muhasebeleşmemiş fatura kontrolü — arayüz. Dosyalar cihazdan çıkmaz; tüm içerik textContent ile yazılır (XML/Excel içeriği güvenilmez veridir). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var X = null /* {liste, okunamayan, yanit, atlanan, dosyaAd} */, DEF = null /* defter durumu */, SON = null, SINIR = 500;
  function el(t, o, ic) { var e = document.createElement(t); o = o || {}; Object.keys(o).forEach(function (k) { if (k === "m") e.textContent = o[k]; else if (k === "c") e.className = o[k]; else e.setAttribute(k, o[k]); }); (ic || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function tl(x) { return (x === null || x === undefined || isNaN(x)) ? "" : x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function trTarih(iso) { return iso ? iso.split("-").reverse().join(".") : ""; }
  function durum(m) { $("durum").textContent = m; }
  function hata(m) { var h = $("hata"); h.hidden = !m; h.textContent = m || ""; }
  function harf(i) { var s = "", n = i + 1; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  var YON_ADI = { gelen: "Alış (gelen)", giden: "Satış (giden)", "?": "?", "dışı": "Sizin dışınızda" };

  // ---------------------------------------------------------------- XML tarafı
  function metinCoz(u8) {
    var bas = new TextDecoder("utf-8").decode(u8.subarray(0, 200)), m = /encoding\s*=\s*["']([^"']+)["']/i.exec(bas), enc = m ? m[1].toLowerCase() : "utf-8";
    if (/^(iso-8859-9|windows-1254|latin5|iso8859-9)$/.test(enc)) enc = "windows-1254";
    try { return new TextDecoder(enc).decode(u8); } catch (e) { return new TextDecoder("utf-8").decode(u8); }
  }
  async function xmlYukle(kaynak) { // kaynak: [{ad, u8}]
    hata(""); var liste = [], okunamayan = [], yanit = [], atlanan = [], toplam = 0, n = 0;
    try {
      for (var i = 0; i < kaynak.length; i++) {
        var ad = kaynak[i].ad, u8 = kaynak[i].u8; durum("Okunuyor: " + (i + 1) + "/" + kaynak.length + " — " + ad);
        var parcalar = [];
        if (u8.length > 3 && u8[0] === 0x50 && u8[1] === 0x4B) {
          if (u8.length > EFZ.SINIR.girdi) { atlanan.push(ad + ": çok büyük"); continue; }
          try { var ent = await EFZ.oku(u8); ent.forEach(function (e) { if (!/\.xml$/i.test(e.ad)) { if (!/\/$/.test(e.ad)) atlanan.push(ad + "/" + e.ad + ": XML değil, atlandı"); return; } if (e.hata) { okunamayan.push({ dosya: ad + "/" + e.ad, neden: e.hata }); return; } parcalar.push({ ad: ad + "/" + e.ad, u8: e.veri }); }); }
          catch (err) { atlanan.push(ad + ": " + err.message); continue; }
        } else if (/\.xml$/i.test(ad)) { if (u8.length > EFZ.SINIR.dosya) { atlanan.push(ad + ": çok büyük"); continue; } parcalar.push({ ad: ad, u8: u8 }); }
        else { atlanan.push(ad + ": XML ya da ZIP değil, atlandı"); continue; }
        parcalar.forEach(function (p) {
          toplam += p.u8.length;
          try { liste.push({ dosya: p.ad, f: EFD.cikar(metinCoz(p.u8)) }); }
          catch (e) { (e.fatura === false ? yanit : okunamayan).push({ dosya: p.ad, neden: e.message }); }
        });
        if (toplam > EFZ.SINIR.toplam) { atlanan.push("Toplam boyut sınırı (600 MB) aşıldı; kalan dosyalar alınmadı."); break; }
        if (++n % 10 === 0) await new Promise(function (r) { setTimeout(r, 0); });
      }
      if (!liste.length) throw new Error("Okunabilir fatura (XML) bulunamadı." + (okunamayan.length ? " İlk hata: " + okunamayan[0].dosya + " — " + okunamayan[0].neden : "") + (atlanan.length ? " " + atlanan.slice(0, 2).join(" · ") : ""));
      X = { liste: liste, okunamayan: okunamayan, yanit: yanit, atlanan: atlanan };
    } catch (e) { X = null; hata("e-Fatura dosyaları: " + e.message); }
    durum(""); xmlKart(); hesaplaBekle();
  }
  function xmlHazir() { var v = $("vkn").value.replace(/\D/g, ""); return FDK.faturalariHazirla(X.liste, { kendiVkn: v }); }
  function xmlKart() {
    var k = $("kart-x"); k.textContent = "";
    if (!X) { k.appendChild(el("p", { c: "kucuk", m: "Henüz dosya seçilmedi." })); return; }
    var H = xmlHazir(), g = H.faturalar.filter(function (f) { return f.yon === "gelen"; }).length, s = H.faturalar.filter(function (f) { return f.yon === "giden"; }).length;
    k.appendChild(el("p", { c: "fd-dosya", m: H.faturalar.length + " fatura okundu" + (H.kendiVkn ? " · sizin VKN: " + H.kendiVkn + " · alış " + g + ", satış " + s : " · kendi VKN belirlenemedi") }));
    var ek = [];
    if (X.okunamayan.length) ek.push(X.okunamayan.length + " dosya okunamadı (" + X.okunamayan.slice(0, 2).map(function (o) { return o.dosya.split("/").pop() + ": " + o.neden; }).join("; ") + ")");
    if (X.yanit.length) ek.push(X.yanit.length + " uygulama yanıtı (fatura değil) atlandı");
    if (H.mukerrerXml.length) ek.push(H.mukerrerXml.length + " mükerrer XML (aynı ETTN) tek sayıldı");
    if (X.atlanan.length) ek.push(X.atlanan.length + " dosya atlandı");
    ek.forEach(function (m) { k.appendChild(el("p", { c: "kucuk", m: m })); });
  }

  // ---------------------------------------------------------------- Defter tarafı
  async function defterYukle(ad, u8) {
    hata("");
    try {
      if (u8.length > 60 * 1024 * 1024) throw new Error("Dosya çok büyük (en fazla 60 MB)");
      var sayfalar = await CMO.oku(u8, ad), secili = 0, tani = null;
      for (var i = 0; i < sayfalar.length; i++) { var t = FDK.baslikTani(sayfalar[i].rows); if (t) { secili = i; tani = t; break; } }
      DEF = { ad: ad, sayfalar: sayfalar, sayfa: secili, tani: tani, kolon: tani ? Object.assign({}, tani.kolonlar) : {}, bas: tani ? tani.basSatir : 0 };
    } catch (e) { DEF = null; hata("Muhasebe kayıt dökümü: " + e.message); }
    defterKart(); hesaplaBekle();
  }
  function defterKart() {
    var k = $("kart-d"); k.textContent = ""; var s = DEF;
    if (!s) { k.appendChild(el("p", { c: "kucuk", m: "Henüz dosya seçilmedi." })); return; }
    k.appendChild(el("p", { c: "fd-dosya", m: s.ad }));
    if (s.sayfalar.length > 1) {
      var sel = el("select", { "aria-label": "Sayfa seçin" });
      s.sayfalar.forEach(function (x, i) { var o = el("option", { value: String(i), m: x.ad }); if (i === s.sayfa) o.selected = true; sel.appendChild(o); });
      sel.addEventListener("change", function () { s.sayfa = +sel.value; s.tani = FDK.baslikTani(s.sayfalar[s.sayfa].rows); s.kolon = s.tani ? Object.assign({}, s.tani.kolonlar) : {}; s.bas = s.tani ? s.tani.basSatir : 0; defterKart(); hesaplaBekle(); });
      k.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: "Sayfa" }), sel]));
    }
    if (!s.tani) { k.appendChild(el("p", { c: "uyari sonuc-hata", m: "Başlık satırı bulunamadı. Dökümde fatura/belge numarası (ya da açıklama) ile en az bir tutar sütunu (Toplam, Matrah, KDV, Borç ya da Alacak) olmalı." })); return; }
    var bas = s.tani.basliklar, rows = s.sayfalar[s.sayfa].rows, ozet = el("div", { c: "fd-kolonlar" });
    FDK.SIRA.forEach(function (anahtar) {
      var sel2 = el("select", { "aria-label": FDK.KOLON_ADI[anahtar] + " sütunu" });
      sel2.appendChild(el("option", { value: "", m: "(yok)" }));
      var maks = 0; rows.slice(s.bas, s.bas + 1).forEach(function (r) { maks = Math.max(maks, r.length); });
      for (var c = 0; c < Math.max(maks, bas.length); c++) { var o = el("option", { value: String(c), m: harf(c) + " — " + (bas[c] || "(başlıksız)") }); if (s.kolon[anahtar] === c) o.selected = true; sel2.appendChild(o); }
      sel2.addEventListener("change", function () { if (sel2.value === "") delete s.kolon[anahtar]; else s.kolon[anahtar] = +sel2.value; hesaplaBekle(); });
      ozet.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: FDK.KOLON_ADI[anahtar] }), sel2]));
    });
    k.appendChild(el("details", { c: "acilir" }, [el("summary", { m: "Sütun eşlemesi (yanlışsa düzeltin)" }), ozet]));
  }

  // ---------------------------------------------------------------- hesap
  var bekle = null;
  function hesaplaBekle() { clearTimeout(bekle); bekle = setTimeout(hesapla, 60); }
  function hesapla() {
    $("sonuc").hidden = true; durum("");
    if (!X || !DEF) return;
    if (!DEF.tani) return;
    var k = DEF.kolon;
    if ((k.belge === undefined && k.ettn === undefined && k.aciklama === undefined) || (k.toplam === undefined && k.matrah === undefined && k.kdv === undefined && k.borc === undefined && k.alacak === undefined)) { hata("Fatura/belge numarası (ya da ETTN, açıklama) ve en az bir tutar sütununu eşleyin."); return; }
    hata("");
    var D = FDK.kayitlar(DEF.sayfalar[DEF.sayfa].rows, k, DEF.bas);
    if (!D.kayit.length) { hata("Dökümde okunabilir satır yok. Sütun eşlemesini kontrol edin." + (D.atlanan.length ? " (" + D.atlanan.length + " satır atlandı: " + D.atlanan[0].neden + ")" : "")); return; }
    if (D.kayit.length > 50000) { hata("Dökümde 50.000'den fazla satır var; dönemi daraltın."); return; }
    durum("Karşılaştırılıyor…");
    setTimeout(function () {
      try {
        var H = xmlHazir();
        var r = FDK.karsilastir(H.faturalar, D.kayit, { tol: +$("tol").value, pencere: +$("pencere").value, kapsam: $("kapsam").value, donem: $("donem").value });
        r.girdi = { defterAd: DEF.ad, atlanan: D.atlanan, uyari: D.uyari, xmlOkunamayan: X.okunamayan, xmlYanit: X.yanit.length, xmlMukerrer: H.mukerrerXml, xmlAtlanan: X.atlanan, kendiVkn: H.kendiVkn, defterSatir: D.kayit.length };
        SON = r; goster(r); durum("");
      } catch (e) { hata("Beklenmeyen hata: " + e.message); durum(""); }
    }, 20);
  }

  // ---------------------------------------------------------------- sonuç
  function kutu(deger, etiket, sinif) { return el("div", { c: "fd-kutu " + (sinif || "") }, [el("b", { m: String(deger) }), el("span", { m: etiket })]); }
  function tablo(basliklar, satirlar, sag, ipKol) {
    var t = el("table"), th = el("tr");
    basliklar.forEach(function (b, i) { th.appendChild(el("th", { m: b, c: sag && sag.indexOf(i) >= 0 ? "sag" : "" })); });
    t.appendChild(el("thead", {}, [th])); var tb = el("tbody");
    satirlar.forEach(function (s) { var tr = el("tr", s.c ? { c: s.c } : {}); s.h.forEach(function (h, i) { var cl = (sag && sag.indexOf(i) >= 0 ? "sag " : "") + (ipKol === i ? "ip" : ""); tr.appendChild(el("td", { m: h === null || h === undefined ? "" : String(h), c: cl.trim() })); }); tb.appendChild(tr); });
    t.appendChild(tb); return el("div", { c: "tablo-kay fd-tablo", tabindex: "0" }, [t]);
  }
  function fark(x) { return (x > 0 ? "+" : "") + tl(x); }
  var FILTRE = [["sorun", "Tüm sorunlar"], ["defterdeYok", "Defterde yok"], ["faturadaYok", "Faturada yok"], ["tutar", "Tutar farkı"], ["diger", "VKN / dönem"], ["mukerrer", "Mükerrer"], ["olasi", "Olası eşleşme"], ["eslesen", "Eşleşenler"]];
  function sayilar(r) { return { defterdeYok: r.say.defterdeYok, faturadaYok: r.say.faturadaYok, tutar: r.say.tutarFarki, diger: r.eslesen.filter(function (x) { return x.vknFarkli || x.ayFarki; }).length, mukerrer: r.mukerrer.length + r.girdi.xmlMukerrer.length, olasi: r.say.olasi, eslesen: r.say.temiz, sorun: r.say.defterdeYok + r.say.faturadaYok + r.say.tutarFarki + r.eslesen.filter(function (x) { return x.vknFarkli || x.ayFarki; }).length + r.mukerrer.length + r.girdi.xmlMukerrer.length + r.say.olasi }; }
  var BAS = {
    defterdeYok: ["Fatura no", "Tarih", "Yön", "Karşı taraf", "VKN", "Matrah", "KDV", "Toplam", "Not"],
    faturadaYok: ["Satır", "Tarih", "Belge no", "Unvan", "VKN", "Tutar", "Not"],
    tutar: ["Fatura no", "Tarih", "Karşı taraf", "Alan", "Defterde", "Faturada", "Fark", "Eşleşme"],
    diger: ["Fatura no", "Fatura tarihi", "Defter tarihi", "Karşı taraf", "Durum", "Eşleşme"],
    mukerrer: ["Tür", "Fatura no", "Açıklama"],
    olasi: ["Fatura no (XML)", "Defterdeki no", "Fatura tarihi", "Defter tarihi", "Tutar", "Gün farkı", "Karşı taraf"],
    eslesen: ["Fatura no", "Tarih", "Yön", "Karşı taraf", "Toplam (fatura)", "Eşleşme", "Not"]
  };
  function satirlarFiltre(r, f) {
    var s = [], c = {};
    var tipYaz = function (fa) { return fa.tip === "IADE" ? " (iade)" : ""; };
    if (f === "defterdeYok" || f === "sorun") r.defterdeYok.forEach(function (x) { var fa = x.f; s.push({ tur: "defterdeYok", c: "fd-yalniz", h: [fa.no + tipYaz(fa), trTarih(fa.tarih), YON_ADI[fa.yon], fa.cp.ad || fa.satici.ad, fa.cp.id, tl(fa.sg * (fa.haric || 0)), tl(fa.sg * (fa.kdvT || 0)), tl(fa.sg * (fa.dahil || 0)), x.ipucu] }); });
    if (f === "faturadaYok" || f === "sorun") r.faturadaYok.forEach(function (x) { var e = x.e; s.push({ tur: "faturadaYok", c: "fd-yalniz", h: [e.satir, trTarih(e.tarih), e.belge, e.unvan, e.vkn, tl(e.toplam !== null ? e.toplam : (e.matrah || 0) + (e.kdv || 0)), x.ipucu] }); });
    if (f === "tutar" || f === "sorun") r.eslesen.forEach(function (x) { x.tutar.farklar.forEach(function (d) { s.push({ tur: "tutar", c: "fd-fark", h: [x.f.no, trTarih(x.f.tarih), x.f.cp.ad || x.f.satici.ad, d.alan, tl(d.defter), tl(d.fatura), fark(d.fark), x.temel] }); }); });
    if (f === "diger" || f === "sorun") r.eslesen.forEach(function (x) { var durumlar = []; if (x.vknFarkli) durumlar.push("VKN farklı (defter " + x.e.vkn + ", fatura " + (x.f.cp.id || x.f.satici.id) + ")"); if (x.ayFarki) durumlar.push("Dönem kayması (fatura " + x.f.tarih.slice(0, 7) + ", defter " + x.e.tarih.slice(0, 7) + ")"); if (durumlar.length) s.push({ tur: "diger", c: "fd-fark", h: [x.f.no, trTarih(x.f.tarih), trTarih(x.e.tarih), x.f.cp.ad || x.f.satici.ad, durumlar.join("; "), x.temel] }); });
    if (f === "mukerrer" || f === "sorun") { r.mukerrer.forEach(function (x) { s.push({ tur: "mukerrer", c: "fd-fark", h: [x.tur === "xml" ? "XML" : "Defter", x.no || (x.f && x.f.no), x.aciklama] }); }); r.girdi.xmlMukerrer.forEach(function (x) { s.push({ tur: "mukerrer", c: "fd-fark", h: ["XML", x.no, x.aciklama] }); }); }
    if (f === "olasi" || f === "sorun") r.olasi.forEach(function (x) { s.push({ tur: "olasi", c: "fd-fark", h: [x.f.no, x.e.belge, trTarih(x.f.tarih), trTarih(x.e.tarih), tl(x.e.toplam !== null ? x.e.toplam : x.e.matrah), x.gf === 99 ? "?" : x.gf, x.f.cp.ad || x.f.satici.ad] }); });
    if (f === "eslesen") r.eslesen.forEach(function (x) { if (x.flags.length) return; s.push({ tur: "eslesen", c: "", h: [x.f.no, trTarih(x.f.tarih), YON_ADI[x.f.yon], x.f.cp.ad || x.f.satici.ad, tl(x.f.sg * (x.f.dahil || 0)), x.temel, x.tutar.taban.join("; ")] }); });
    return s;
  }
  function goster(r) {
    var k = $("sonuc"); k.hidden = false; k.textContent = ""; var n = sayilar(r), say = r.say;
    k.appendChild(el("h2", { m: n.sorun === 0 ? "Fark bulunmadı" : n.sorun + " madde incelemenizi bekliyor" }));
    k.appendChild(el("p", { c: "kucuk", m: "Defter kapsamı: " + (r.kapsam === "gelen" ? "alış (gelen faturalar)" : r.kapsam === "giden" ? "satış (giden faturalar)" : "alış ve satış birlikte") + (r.kapsamNedeni ? ". " + r.kapsamNedeni : "") + (r.kapsamDisi.length ? " Kapsam dışı kalan " + r.kapsamDisi.length + " fatura bu karşılaştırmaya alınmadı." : "") + " Yanlışsa yukarıdaki 'Defter neyi kapsıyor?' ayarını değiştirin." }));
    var kt = el("div", { c: "fd-kutular" });
    kt.appendChild(kutu(say.fatura, "Kontrol edilen fatura"));
    kt.appendChild(kutu(say.temiz, "Sorunsuz eşleşen", "iyi"));
    kt.appendChild(kutu(say.defterdeYok, "Deftere işlenmemiş", say.defterdeYok ? "kotu" : "iyi"));
    kt.appendChild(kutu(say.faturadaYok, "Faturası yüklenmemiş kayıt", say.faturadaYok ? "uy" : "iyi"));
    kt.appendChild(kutu(say.tutarFarki, "Tutar/KDV farkı", say.tutarFarki ? "uy" : "iyi"));
    kt.appendChild(kutu(n.mukerrer, "Mükerrer (defter + XML)", n.mukerrer ? "uy" : "iyi"));
    kt.appendChild(kutu(say.olasi, "Olası eşleşme (doğrulayın)", say.olasi ? "uy" : "iyi"));
    kt.appendChild(kutu(say.donemKaymasi + say.vknFarki, "Dönem / VKN farkı", (say.donemKaymasi + say.vknFarki) ? "uy" : "iyi"));
    k.appendChild(kt);
    var rk = r.risk, ri = el("div", { c: "fd-risk" });
    if (rk.gelen.adet) ri.appendChild(el("span", { m: "Deftere işlenmemiş ALIŞ faturaları: " + rk.gelen.adet + " adet, matrah " + tl(rk.gelen.matrah) + " TL, KDV " + tl(rk.gelen.kdv) + " TL, toplam " + tl(rk.gelen.toplam) + " TL. Kayda alınmazsa gider ve indirilecek KDV eksik kalır." }));
    if (rk.giden.adet) ri.appendChild(el("span", { m: "Deftere işlenmemiş SATIŞ faturaları: " + rk.giden.adet + " adet, matrah " + tl(rk.giden.matrah) + " TL, KDV " + tl(rk.giden.kdv) + " TL, toplam " + tl(rk.giden.toplam) + " TL. Kayda alınmazsa hasılat ve hesaplanan KDV eksik kalır." }));
    if (rk.belirsiz.adet) ri.appendChild(el("span", { m: "Yönü belirlenemeyen deftere işlenmemiş fatura: " + rk.belirsiz.adet + " adet, toplam " + tl(rk.belirsiz.toplam) + " TL." }));
    if (ri.children.length) { ri.insertBefore(el("b", { m: "Parasal etki (iade faturaları eksi sayılır)" }), ri.firstChild); k.appendChild(ri); }
    k.appendChild(el("p", { c: r.kontrol.sayiDengesi && r.kontrol.tutarDengesi ? "uyari" : "uyari sonuc-hata", m: r.kontrol.sayiDengesi && r.kontrol.tutarDengesi ? "Kontrol: " + say.fatura + " faturanın KDV dahil toplamı (" + tl(r.kontrol.faturaToplami) + " TL) sonuç kategorilerinin toplamıyla kuruşu kuruşuna örtüşüyor; her fatura tek kategoride." : "Dikkat: fatura sayısı ya da toplamı kategorilerle örtüşmedi (" + tl(r.kontrol.faturaToplami) + " ≠ " + tl(r.kontrol.aciklanan) + "). Sütun eşlemesini kontrol edin." }));
    var uy = (r.girdi.uyari || []).slice();
    if (r.girdi.atlanan.length) uy.push(r.girdi.atlanan.length + " defter satırı atlandı (ödeme/mahsup, toplam ya da belge numarasız satırlar). Ayrıntı Excel çıktısındaki 'Atlanan satırlar' sayfasında.");
    if (r.girdi.xmlOkunamayan.length) uy.push(r.girdi.xmlOkunamayan.length + " XML dosyası okunamadı; bu faturalar karşılaştırmada yok (Excel'de 'Okunamayan XML' sayfası).");
    if (say.donemDisiFatura || say.donemDisiGirdi) uy.push("Seçtiğiniz dönem dışında kalan " + say.donemDisiFatura + " fatura ve " + say.donemDisiGirdi + " defter kaydı eksik sayılmadı.");
    r.uyari.forEach(function (u) { uy.push(u); });
    var doviz = r.eslesen.filter(function (x) { return x.tutar.kontrolEdilemedi; }).length; if (doviz) uy.push(doviz + " dövizli faturada kur bilgisi olmadığı için tutar karşılaştırılamadı; yalnız numara eşleşti.");
    uy.forEach(function (u) { k.appendChild(el("p", { c: "uyari", m: u })); });

    var filt = el("div", { c: "fd-filtre", role: "group", "aria-label": "Sonuç filtresi" }), tk = el("div"), aktif = "sorun";
    function ciz() {
      Array.prototype.forEach.call(filt.children, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === aktif)); });
      tk.textContent = "";
      var l = satirlarFiltre(r, aktif);
      if (!l.length) { tk.appendChild(el("p", { c: "kucuk", m: "Bu filtrede kayıt yok." })); return; }
      var tur = aktif === "sorun" ? null : aktif;
      if (tur) { tk.appendChild(tablo(BAS[tur], l.slice(0, SINIR), tur === "defterdeYok" ? [5, 6, 7] : tur === "faturadaYok" ? [5] : tur === "tutar" ? [4, 5, 6] : tur === "olasi" ? [4] : tur === "eslesen" ? [4] : [], tur === "defterdeYok" ? 8 : tur === "faturadaYok" ? 6 : tur === "mukerrer" ? 2 : -1)); }
      else {
        var gruplar = {}, sira = ["defterdeYok", "faturadaYok", "tutar", "diger", "mukerrer", "olasi"];
        l.forEach(function (x) { (gruplar[x.tur] = gruplar[x.tur] || []).push(x); });
        var gosterilen = 0;
        sira.forEach(function (t) { if (!gruplar[t]) return; var ad = FILTRE.filter(function (q) { return q[0] === t; })[0][1]; tk.appendChild(el("h4", { m: ad + " (" + gruplar[t].length + ")", style: "margin:16px 0 6px" })); tk.appendChild(tablo(BAS[t], gruplar[t].slice(0, Math.max(0, SINIR - gosterilen)), t === "defterdeYok" ? [5, 6, 7] : t === "faturadaYok" ? [5] : t === "tutar" ? [4, 5, 6] : t === "olasi" ? [4] : [], t === "defterdeYok" ? 8 : t === "faturadaYok" ? 6 : t === "mukerrer" ? 2 : -1)); gosterilen += gruplar[t].length; });
      }
      if (l.length > SINIR && tur) tk.appendChild(el("p", { c: "kucuk", m: "İlk " + SINIR + " kayıt gösteriliyor; tamamı Excel dosyasında (" + l.length + " satır)." }));
    }
    FILTRE.forEach(function (f) { var b = el("button", { c: "btn iki fd-f", type: "button", "data-f": f[0], "aria-pressed": "false", m: f[1] + " (" + n[f[0]] + ")" }); b.addEventListener("click", function () { aktif = f[0]; ciz(); }); filt.appendChild(b); });
    k.appendChild(el("h3", { m: "Ayrıntılar" })); k.appendChild(filt); k.appendChild(tk); ciz();

    var mesaj = el("textarea", { id: "mesaj", rows: "10", "aria-label": "Eksik fatura listesi metni", readonly: "" }); mesaj.value = mesajMetni(r);
    k.appendChild(el("h3", { m: "Eksik fatura listesi (kopyalayıp iletebilirsiniz)", style: "margin-top:22px" }));
    k.appendChild(mesaj);
    k.appendChild(el("div", { c: "arac-eylem" }, [el("button", { c: "btn", type: "button", id: "b-xlsx", m: "Excel indir (.xlsx)" }), el("button", { c: "btn iki", type: "button", id: "b-kopya", m: "Metni kopyala" })]));
    $("b-xlsx").addEventListener("click", function () { indirBayt("fatura-defter-kontrol-" + new Date().toISOString().slice(0, 10) + ".xlsx", EFXL.yaz(sayfalar(r)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); });
    $("b-kopya").addEventListener("click", function () { mesaj.select(); try { navigator.clipboard.writeText(mesaj.value).then(function () { $("b-kopya").textContent = "Kopyalandı"; }, function () { document.execCommand("copy"); }); } catch (e) { document.execCommand("copy"); } });
    k.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function mesajMetni(r) {
    var s = ["Merhaba, e-Fatura XML'leri ile muhasebe kayıtlarını karşılaştırdık."];
    var ly = r.defterdeYok.slice(0, 25);
    if (ly.length) { s.push(""); s.push("Deftere işlenmemiş görünen faturalar (" + r.defterdeYok.length + " adet):"); ly.forEach(function (x, i) { var f = x.f; s.push((i + 1) + ") " + trTarih(f.tarih) + " · " + f.no + " · " + (f.cp.ad || f.satici.ad) + " · " + tl(f.sg * (f.dahil || 0)) + " TL" + (f.tip === "IADE" ? " (iade)" : "")); }); if (r.defterdeYok.length > 25) s.push("… ve " + (r.defterdeYok.length - 25) + " fatura daha (Excel dökümünde)."); }
    var tf = r.eslesen.filter(function (x) { return x.tutar.farklar.length; }).slice(0, 10);
    if (tf.length) { s.push(""); s.push("Tutar farkı olan kayıtlar (" + r.say.tutarFarki + " adet):"); tf.forEach(function (x, i) { var d = x.tutar.farklar[0]; s.push((i + 1) + ") " + x.f.no + ": defterde " + tl(d.defter) + ", faturada " + tl(d.fatura) + " (" + d.alan + ", fark " + fark(d.fark) + " TL)"); }); }
    var fy = r.faturadaYok.slice(0, 10);
    if (fy.length) { s.push(""); s.push("Defterde olup faturası yüklenmeyen kayıtlar (" + r.faturadaYok.length + " adet):"); fy.forEach(function (x, i) { s.push((i + 1) + ") " + x.e.belge + " · " + (x.e.unvan || "") + " · " + tl(x.e.toplam !== null ? x.e.toplam : 0) + " TL"); }); }
    if (r.mukerrer.length) { s.push(""); s.push(r.mukerrer.length + " faturada defterde mükerrer kayıt görünüyor."); }
    if (!ly.length && !tf.length && !fy.length && !r.mukerrer.length) s.push("Fark bulunmadı.");
    s.push(""); s.push("Kontrol edip dönüşünüzü rica ederiz.");
    return s.join("\n");
  }
  function sayfalar(r) {
    var t = new Date().toISOString().slice(0, 10), S = r.say;
    var yok = [["Fatura no", "ETTN", "Tarih", "Yön", "Tip", "Karşı taraf", "VKN/TCKN", "Para", "Matrah", "KDV", "KDV dahil toplam", "Not"]].concat(r.defterdeYok.map(function (x) { var f = x.f; return [f.no, f.ettn, trTarih(f.tarih), YON_ADI[f.yon], f.tip, f.cp.ad || f.satici.ad, f.cp.id, f.para, f.sg * (f.haric || 0), f.sg * (f.kdvT || 0), f.sg * (f.dahil || 0), x.ipucu]; }));
    var fy = [["Defter satırı", "Tarih", "Belge no", "ETTN", "Unvan", "VKN/TCKN", "Matrah", "KDV", "Toplam", "Not"]].concat(r.faturadaYok.map(function (x) { var e = x.e; return [e.satir, trTarih(e.tarih), e.belge, e.ettn, e.unvan, e.vkn, e.matrah, e.kdv, e.toplam, x.ipucu]; }));
    var fr = [["Fatura no", "Fatura tarihi", "Karşı taraf", "Defter satırı", "Defter tarihi", "Fark türü", "Alan", "Defterde", "Faturada", "Fark", "Eşleşme"]];
    r.eslesen.forEach(function (x) { x.tutar.farklar.forEach(function (d) { fr.push([x.f.no, trTarih(x.f.tarih), x.f.cp.ad || x.f.satici.ad, x.e.satir, trTarih(x.e.tarih), "Tutar farkı", d.alan, d.defter, d.fatura, d.fark, x.temel]); }); if (x.vknFarkli) fr.push([x.f.no, trTarih(x.f.tarih), x.f.cp.ad || x.f.satici.ad, x.e.satir, trTarih(x.e.tarih), "VKN farklı", "VKN", x.e.vkn, x.f.cp.id || x.f.satici.id, null, x.temel]); if (x.ayFarki) fr.push([x.f.no, trTarih(x.f.tarih), x.f.cp.ad || x.f.satici.ad, x.e.satir, trTarih(x.e.tarih), "Dönem kayması", "Ay", x.e.tarih.slice(0, 7), x.f.tarih.slice(0, 7), null, x.temel]); });
    var mk = [["Tür", "Fatura no", "Açıklama"]].concat(r.mukerrer.map(function (x) { return [x.tur === "xml" ? "XML" : "Defter", x.no || (x.f && x.f.no), x.aciklama]; })).concat(r.girdi.xmlMukerrer.map(function (x) { return ["XML", x.no, x.aciklama]; }));
    var ol = [["Fatura no (XML)", "Defterdeki no", "Fatura tarihi", "Defter tarihi", "Defter satırı", "Tutar", "Gün farkı", "Karşı taraf", "Tutar eşleşmesi"]].concat(r.olasi.map(function (x) { return [x.f.no, x.e.belge, trTarih(x.f.tarih), trTarih(x.e.tarih), x.e.satir, x.e.toplam, x.gf === 99 ? "" : x.gf, x.f.cp.ad || x.f.satici.ad, x.taban]; }));
    var es = [["Fatura no", "Tarih", "Yön", "Karşı taraf", "KDV dahil toplam", "Defter satırı", "Eşleşme", "Tutar karşılaştırma", "Uyarılar"]].concat(r.eslesen.map(function (x) { return [x.f.no, trTarih(x.f.tarih), YON_ADI[x.f.yon], x.f.cp.ad || x.f.satici.ad, x.f.sg * (x.f.dahil || 0), x.e.satir, x.temel, x.tutar.taban.join("; "), x.flags.join("; ")]; }));
    var at = [["Satır no", "Neden", "İçerik"]].concat(r.girdi.atlanan.map(function (x) { return [x.satir, x.neden, x.icerik]; }));
    var ok = [["Dosya", "Neden"]].concat(r.girdi.xmlOkunamayan.map(function (x) { return [x.dosya, x.neden]; })).concat(r.girdi.xmlAtlanan.map(function (x) { return [x, "atlandı"]; }));
    var ozet = [["Ölçüt", "Değer"], ["Tarih", t], ["Defter dosyası", r.girdi.defterAd], ["Kendi VKN", r.girdi.kendiVkn || "(belirlenemedi)"], ["Defter kapsamı", r.kapsam], ["Dönem", r.ayar.donem || "(tümü)"], ["Tutar toleransı (TL)", r.ayar.tol], ["Kontrol edilen fatura", S.fatura], ["Kapsam dışı fatura", S.kapsamDisi], ["Sorunsuz eşleşen", S.temiz], ["Deftere işlenmemiş", S.defterdeYok], ["Faturası yüklenmemiş kayıt", S.faturadaYok], ["Tutar/KDV farkı", S.tutarFarki], ["VKN farkı", S.vknFarki], ["Dönem kayması", S.donemKaymasi], ["Mükerrer (defter)", r.mukerrer.length], ["Mükerrer (XML)", r.girdi.xmlMukerrer.length], ["Olası eşleşme", S.olasi],
      ["Defterde olmayan alış: KDV", r.risk.gelen.kdv], ["Defterde olmayan satış: KDV", r.risk.giden.kdv], ["Kontrol (sayı + KDV dahil toplam)", r.kontrol.sayiDengesi && r.kontrol.tutarDengesi ? "Tutuyor (" + r.kontrol.faturaToplami + ")" : "TUTMUYOR"], ["Not", "Bilgi amaçlıdır; resmi işlem, muhasebe ya da mali müşavirlik yerine geçmez; mevzuat kuralı uygulamaz. dijitabela.com/araclar/fatura-defter-kontrol/"]];
    return [{ ad: "Özet", satirlar: ozet }, { ad: "Defterde yok", satirlar: yok }, { ad: "Faturada yok", satirlar: fy }, { ad: "Farklar", satirlar: fr }, { ad: "Mükerrer", satirlar: mk }, { ad: "Olası eşleşme", satirlar: ol }, { ad: "Eşleşenler", satirlar: es }, { ad: "Atlanan satırlar", satirlar: at }, { ad: "Okunamayan XML", satirlar: ok }];
  }
  function indirBayt(ad, bayt, tur) { var u = URL.createObjectURL(new Blob([bayt], { type: tur })), a = el("a", { href: u, download: ad }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); }

  async function dosyalar(liste) { var k = []; for (var i = 0; i < liste.length; i++) k.push({ ad: liste[i].name, u8: new Uint8Array(await liste[i].arrayBuffer()) }); return k; }
  function baslat() {
    var kx = $("yukle-x"), ix = $("dosya-x"), kd = $("yukle-d"), id = $("dosya-d");
    ix.addEventListener("change", async function () { if (ix.files.length) xmlYukle(await dosyalar(ix.files)); });
    id.addEventListener("change", async function () { if (id.files.length) { var f = id.files[0]; defterYukle(f.name, new Uint8Array(await f.arrayBuffer())); } });
    [[kx, async function (fl) { xmlYukle(await dosyalar(fl)); }], [kd, async function (fl) { var f = fl[0]; defterYukle(f.name, new Uint8Array(await f.arrayBuffer())); }]].forEach(function (p) {
      ["dragover", "dragenter"].forEach(function (e) { p[0].addEventListener(e, function (ev) { ev.preventDefault(); p[0].classList.add("ustte"); }); });
      ["dragleave", "drop"].forEach(function (e) { p[0].addEventListener(e, function (ev) { ev.preventDefault(); p[0].classList.remove("ustte"); }); });
      p[0].addEventListener("drop", function (ev) { if (ev.dataTransfer.files.length) p[1](ev.dataTransfer.files); });
    });
    ["kapsam", "tol", "pencere", "donem"].forEach(function (i) { $(i).addEventListener("change", hesaplaBekle); });
    $("vkn").addEventListener("change", function () { if (X) { xmlKart(); hesaplaBekle(); } });
    xmlKart(); defterKart();
    $("b-ornek").addEventListener("click", async function () {
      var o = FDKOR.demo(), enc = new TextEncoder();
      await xmlYukle(o.faturalar.map(function (f) { return { ad: f.ad, u8: enc.encode(f.metin) }; }));
      await defterYukle(o.defterAdi, FDKOR.xlsxBayt());
    });
    $("b-ornek-x").addEventListener("click", function () { indirBayt("ORNEK-e-fatura-xml.zip", FDKOR.zipBayt(), "application/zip"); });
    $("b-ornek-d").addEventListener("click", function () { indirBayt("ORNEK-defter-alis-kdv-listesi.xlsx", FDKOR.xlsxBayt(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); });
    window.__FDK = { son: function () { return SON; }, hesapla: hesapla };
  }
  document.addEventListener("DOMContentLoaded", baslat);
})();
