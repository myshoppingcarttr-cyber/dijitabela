/* Banka hareketi ↔ fatura eşleştirme — arayüz. Dosyalar cihazdan çıkmaz; tüm içerik textContent ile yazılır (XML/Excel içeriği güvenilmez veridir). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var X = null /* e-Fatura XML durumu */, FL = null /* Excel fatura listesi */, BK = null /* banka ekstresi */, SON = null;
  function el(t, o, ic) { var e = document.createElement(t); o = o || {}; Object.keys(o).forEach(function (k) { if (k === "m") e.textContent = o[k]; else if (k === "c") e.className = o[k]; else e.setAttribute(k, o[k]); }); (ic || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function tl(x) { return (x === null || x === undefined || isNaN(x)) ? "" : x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function trTarih(iso) { return iso ? iso.split("-").reverse().join(".") : ""; }
  function durum(m) { $("durum").textContent = m; }
  function hata(m) { var h = $("hata"); h.hidden = !m; h.textContent = m || ""; }
  function harf(i) { var s = "", n = i + 1; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }

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
    var k = $("kart-f"); k.textContent = "";
    if (FL && FL.tur === "excel") return excelKart();
    if (!X) { k.appendChild(el("p", { c: "kucuk", m: "Henüz dosya seçilmedi." })); return; }
    var H = xmlHazir(), g = H.faturalar.filter(function (f) { return f.yon === "gelen"; }).length, s = H.faturalar.filter(function (f) { return f.yon === "giden"; }).length;
    k.appendChild(el("p", { c: "fd-dosya", m: H.faturalar.length + " e-Fatura okundu" + (H.kendiVkn ? " · sizin VKN: " + H.kendiVkn + " · satış " + s + ", alış " + g : " · kendi VKN belirlenemedi (Ayarlar'dan seçin)") }));
    var ek = [];
    if (X.okunamayan.length) ek.push(X.okunamayan.length + " dosya okunamadı (" + X.okunamayan.slice(0, 2).map(function (o) { return o.dosya.split("/").pop() + ": " + o.neden; }).join("; ") + ")");
    if (X.yanit.length) ek.push(X.yanit.length + " uygulama yanıtı (fatura değil) atlandı");
    if (H.mukerrerXml.length) ek.push(H.mukerrerXml.length + " mükerrer XML (aynı ETTN) tek sayıldı");
    if (X.atlanan.length) ek.push(X.atlanan.length + " dosya atlandı");
    ek.forEach(function (m) { k.appendChild(el("p", { c: "kucuk", m: m })); });
  }

  // ---------------------------------------------------------------- tablo dosyaları (ekstre ve Excel fatura listesi)
  var FKOL = ["belge", "tarih", "vkn", "unvan", "toplam", "matrah", "kdv"];
  async function tabloOku(ad, u8) {
    if (u8.length > 60 * 1024 * 1024) throw new Error("Dosya çok büyük (en fazla 60 MB)");
    return CMO.oku(u8, ad);
  }
  async function bankaYukle(ad, u8) {
    hata("");
    try {
      var sayfalar = await tabloOku(ad, u8), secili = 0, tani = null;
      for (var i = 0; i < sayfalar.length; i++) { var t = BET.baslikTani(sayfalar[i].rows); if (t) { secili = i; tani = t; break; } }
      BK = { ad: ad, sayfalar: sayfalar, sayfa: secili, tani: tani, kolon: tani ? Object.assign({}, tani.kolonlar) : {}, bas: tani ? tani.basSatir : 0 };
    } catch (e) { BK = null; hata("Banka ekstresi: " + e.message); }
    bankaKart(); hesaplaBekle();
  }
  async function excelFaturaYukle(ad, u8) {
    hata("");
    try {
      var sayfalar = await tabloOku(ad, u8), secili = 0, tani = null;
      for (var i = 0; i < sayfalar.length; i++) { var t = FDK.baslikTani(sayfalar[i].rows); if (t) { secili = i; tani = t; break; } }
      FL = { tur: "excel", ad: ad, sayfalar: sayfalar, sayfa: secili, tani: tani, kolon: tani ? Object.assign({}, tani.kolonlar) : {}, bas: tani ? tani.basSatir : 0 };
    } catch (e) { FL = null; hata("Fatura listesi: " + e.message); }
    xmlKart(); hesaplaBekle();
  }
  function kolonSecici(kart, S, anahtarlar, adlar, yenile) {
    var bas = S.tani.basliklar, rows = S.sayfalar[S.sayfa].rows, ozet = el("div", { c: "fd-kolonlar" });
    anahtarlar.forEach(function (anahtar) {
      var sel = el("select", { "aria-label": adlar[anahtar] + " sütunu" });
      sel.appendChild(el("option", { value: "", m: "(yok)" }));
      var maks = 0; rows.slice(S.bas, S.bas + 1).forEach(function (r) { maks = Math.max(maks, r.length); });
      for (var c = 0; c < Math.max(maks, bas.length); c++) { var o = el("option", { value: String(c), m: harf(c) + " — " + (bas[c] || "(başlıksız)") }); if (S.kolon[anahtar] === c) o.selected = true; sel.appendChild(o); }
      sel.addEventListener("change", function () { if (sel.value === "") delete S.kolon[anahtar]; else S.kolon[anahtar] = +sel.value; hesaplaBekle(); });
      ozet.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: adlar[anahtar] }), sel]));
    });
    kart.appendChild(el("details", { c: "acilir" }, [el("summary", { m: "Sütun eşlemesi (yanlışsa düzeltin)" }), ozet]));
  }
  function sayfaSecici(kart, S, yeniTani, yenile) {
    if (S.sayfalar.length < 2) return;
    var sel = el("select", { "aria-label": "Sayfa seçin" });
    S.sayfalar.forEach(function (x, i) { var o = el("option", { value: String(i), m: x.ad }); if (i === S.sayfa) o.selected = true; sel.appendChild(o); });
    sel.addEventListener("change", function () { S.sayfa = +sel.value; S.tani = yeniTani(S.sayfalar[S.sayfa].rows); S.kolon = S.tani ? Object.assign({}, S.tani.kolonlar) : {}; S.bas = S.tani ? S.tani.basSatir : 0; yenile(); hesaplaBekle(); });
    kart.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: "Sayfa" }), sel]));
  }
  function bankaKart() {
    var k = $("kart-b"); k.textContent = ""; var s = BK;
    if (!s) { k.appendChild(el("p", { c: "kucuk", m: "Henüz dosya seçilmedi." })); return; }
    k.appendChild(el("p", { c: "fd-dosya", m: s.ad }));
    sayfaSecici(k, s, BET.baslikTani, bankaKart);
    if (!s.tani) { k.appendChild(el("p", { c: "uyari sonuc-hata", m: "Başlık satırı bulunamadı. Ekstrede Tarih, Açıklama ve Tutar (ya da Giriş/Çıkış, Borç/Alacak) başlıkları olmalı. PDF desteklenmez; internet şubesinden Excel ya da CSV indirin." })); return; }
    kolonSecici(k, s, BET.SIRA, BET.KOLON_ADI, bankaKart);
  }
  function excelKart() {
    var k = $("kart-f"); k.textContent = ""; var s = FL;
    k.appendChild(el("p", { c: "fd-dosya", m: s.ad + " (Excel/CSV fatura listesi)" }));
    sayfaSecici(k, s, FDK.baslikTani, excelKart);
    if (!s.tani) { k.appendChild(el("p", { c: "uyari sonuc-hata", m: "Başlık satırı bulunamadı. Listede fatura numarası ile bir tutar sütunu (Toplam, Kalan ya da Borç) olmalı." })); return; }
    kolonSecici(k, s, FKOL, FDK.KOLON_ADI, excelKart);
  }

  // ---------------------------------------------------------------- hesap
  var bekle = null;
  function hesaplaBekle() { clearTimeout(bekle); bekle = setTimeout(hesapla, 60); }
  function faturalariKur() {
    var yon = $("yon").value, uyar = [];
    if (FL && FL.tur === "excel") {
      var k = FL.kolon;
      if (!FL.tani || k.belge === undefined || (k.toplam === undefined && k.borc === undefined && k.alacak === undefined && k.matrah === undefined)) throw new Error("Fatura listesinde fatura numarası ve bir tutar sütunu eşlenmeli.");
      var D = FDK.kayitlar(FL.sayfalar[FL.sayfa].rows, k, FL.bas);
      if (!D.kayit.length) throw new Error("Fatura listesinde okunabilir satır yok.");
      if (D.atlanan.length) uyar.push("Fatura listesinde " + D.atlanan.length + " satır atlandı (belge no/tutar yok, toplam satırı).");
      var ynn = yon === "alis" ? "gelen" : "giden";
      return { fat: D.kayit.map(function (e) { return BET.faturaExcel(e, ynn); }), uyari: uyar, kendiVkn: "", kaynak: "Excel/CSV fatura listesi (" + (ynn === "giden" ? "satış" : "alış") + ")", atlanan: D.atlanan, xml: null };
    }
    if (!X) return null;
    var H = xmlHazir(), seccim = yon === "otomatik" ? "satis" : yon;
    var fat = H.faturalar.map(function (f) { return BET.faturaXml(f, seccim); });
    if (!H.kendiVkn && yon === "otomatik") uyar.push("Kendi VKN'niz belirlenemedi; tüm faturalar satış sayıldı. Gerekirse Ayarlar'dan 'alış' seçin ya da VKN yazın.");
    var disi = H.faturalar.filter(function (f) { return f.yon === "dışı"; }).length;
    if (disi) uyar.push(disi + " fatura sizin VKN'nizi içermiyor; seçime göre işlendi.");
    return { fat: fat, uyari: uyar, kendiVkn: H.kendiVkn, kaynak: "e-Fatura XML (" + H.faturalar.length + " adet)", atlanan: [], xml: H };
  }
  function hesapla() {
    $("sonuc").hidden = true; durum("");
    if (!BK || !BK.tani) return;
    if (!FL && !X) return;
    var k = BK.kolon;
    if (k.tarih === undefined || (k.tutar === undefined && k.giris === undefined && k.cikis === undefined && k.alacak === undefined && k.borc === undefined)) { hata("Ekstrede tarih ve tutar (ya da giriş/çıkış, borç/alacak) sütunlarını eşleyin."); return; }
    hata("");
    var HR = BET.hareketler(BK.sayfalar[BK.sayfa].rows, k, BK.bas, { ters: $("ters").checked });
    if (!HR.hareket.length) { hata("Ekstrede okunabilir hareket yok. Sütun eşlemesini kontrol edin." + (HR.atlanan.length ? " (" + HR.atlanan.length + " satır atlandı: " + HR.atlanan[0].neden + ")" : "")); return; }
    if (HR.hareket.length > 50000) { hata("Ekstrede 50.000'den fazla hareket var; dönemi daraltın."); return; }
    durum("Eşleştiriliyor…");
    setTimeout(function () {
      try {
        var FT = faturalariKur(); if (!FT) { durum(""); return; }
        if (!FT.fat.length) { hata("Okunabilir fatura yok."); durum(""); return; }
        var den = BET.ekstreDenetle(HR.hareket);
        var r = BET.eslestir(HR.hareket, FT.fat, { tol: +$("tol").value, avansGun: +$("avans").value });
        r.girdi = { bankaAd: BK.ad, hareketSatir: HR.hareket.length, atlanan: HR.atlanan, uyari: HR.uyari.concat(FT.uyari), fatKaynak: FT.kaynak, faturaAtlanan: FT.atlanan, xmlOkunamayan: FT.xml ? X.okunamayan : [], xmlAtlanan: FT.xml ? X.atlanan : [], xmlMukerrer: FT.xml ? FT.xml.mukerrerXml : [], kendiVkn: FT.kendiVkn };
        r.den = den; r.yas = { giden: BET.yaslandir(r.acik, r.refGun, "giden"), gelen: BET.yaslandir(r.acik, r.refGun, "gelen") };
        SON = r; goster(r); durum("");
      } catch (e) { hata("Beklenmeyen hata: " + e.message); durum(""); }
    }, 20);
  }

  // ---------------------------------------------------------------- sonuç
  var DURUM_AD = { eslesti: "Eşleşti", toplu: "Toplu ödeme", kismi: "Kısmi ödeme", farkli: "Tutar farkıyla eşleşti", fazla: "Fazla ödeme", cariBelli: "Cari belli, fatura belirsiz", aday: "Birden çok aday", eslesmedi: "Eşleşmedi" };
  var GUVEN_AD = { yuksek: "Yüksek", orta: "Orta", dusuk: "Düşük", "": "" };
  function grup(x) {
    if ((x.durum === "eslesti" || x.durum === "toplu") && x.guven !== "dusuk") return "eslesen";
    if (x.durum === "aday") return "aday";
    if (x.durum === "eslesmedi") return "eslesmedi";
    return "dogrula";
  }
  function fatNo(x) { return x.parcalar.map(function (p) { return p.f.no; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", "); }
  function fatTutar(x) { return (x.oneri ? "ÖNERİ (düşülmedi): " : "") + x.parcalar.map(function (p) { return p.f.no + ": " + tl(p.tutar / 100); }).join("; "); }
  function kutu(deger, etiket, sinif) { return el("div", { c: "fd-kutu " + (sinif || "") }, [el("b", { m: String(deger) }), el("span", { m: etiket })]); }
  function tablo(basliklar, satirlar, sag) {
    var t = el("table"), th = el("tr");
    basliklar.forEach(function (b, i) { th.appendChild(el("th", { m: b, c: sag && sag.indexOf(i) >= 0 ? "sag" : "" })); });
    t.appendChild(el("thead", {}, [th])); var tb = el("tbody");
    satirlar.forEach(function (s) { var tr = el("tr", s.c ? { c: s.c } : {}); s.h.forEach(function (h, i) { tr.appendChild(el("td", { m: h === null || h === undefined ? "" : String(h), c: (sag && sag.indexOf(i) >= 0 ? "sag " : "") + (i === s.h.length - 1 ? "ip" : "") })); }); tb.appendChild(tr); });
    t.appendChild(tb); return el("div", { c: "tablo-kay fd-tablo", tabindex: "0" }, [t]);
  }
  var SEKME = [["eslesen", "Eşleşenler"], ["dogrula", "Doğrulanacaklar"], ["aday", "Birden çok aday"], ["eslesmedi", "Eşleşmeyen hareketler"], ["acik", "Açık faturalar"], ["ekstre", "Ekstre uyarıları"]];
  function sekmeSatirlari(r, s) {
    var h = [];
    if (s === "acik") {
      var ref = r.refGun;
      r.acik.slice().sort(function (a, b) { return a.gun - b.gun; }).forEach(function (f) { h.push({ c: "", h: [f.no, trTarih(f.tarih), f.yon === "giden" ? "Satış" : "Alış", f.cpAd || f.cpId, tl(f.ana / 100), tl(f.kalan / 100), ref === null ? "" : ref - f.gun, f.odemeler.length ? "Kısmen ödenmiş: " + f.odemeler.map(function (o) { return trTarih(o.hareket.tarih) + " " + tl(o.tutar / 100); }).join("; ") : ""] }); });
      return h;
    }
    if (s === "ekstre") {
      if (r.den.kirik) r.den.kirik.forEach(function (x) { h.push({ c: "fd-fark", h: ["Bakiye zinciri kırık", x.hareket.satir, trTarih(x.hareket.tarih), tl(x.hareket.tutar), "Önceki bakiye " + tl(x.onceki.bakiye) + " + tutar = " + tl(x.beklenen) + " olmalı; ekstrede " + tl(x.hareket.bakiye) + " (fark " + tl(x.fark) + "). Arada eksik satır, sıra bozukluğu ya da ayrı hesap olabilir."] }); });
      r.den.mukerrer.forEach(function (x) { h.push({ c: "fd-fark", h: [x.kesin ? "Aynı satır iki kez (sayılmadı)" : "Benzer satır tekrarı (sayıldı)", x.hareket.satir, trTarih(x.hareket.tarih), tl(x.hareket.tutar), "İlk satır " + x.ilk.satir + ". " + (x.kesin ? "Aynı bakiye/dekont no olduğundan ekstre iki kez yüklenmiş sayıldı ve eşleştirmeden çıkarıldı." : "Bakiye/dekont yok; aynı tutar ve açıklama iki ayrı işlem olabilir, sayıldı.")] }); });
      return h;
    }
    r.sonuc.forEach(function (x) {
      if (grup(x) !== s) return;
      var cl = x.guven === "dusuk" || s === "dogrula" ? "fd-fark" : "";
      if (s === "eslesmedi") h.push({ c: "fd-yalniz", h: [x.h.satir, trTarih(x.h.tarih), x.h.aciklama + (x.h.taraf ? " · " + x.h.taraf : ""), tl(x.h.tutar), x.kategori] });
      else if (s === "aday") h.push({ c: "fd-fark", h: [x.h.satir, trTarih(x.h.tarih), x.h.aciklama, tl(x.h.tutar), x.adaylar.join("; "), x.neden.join(" · ")] });
      else h.push({ c: cl, h: [x.h.satir, trTarih(x.h.tarih), x.h.aciklama, tl(x.h.tutar), DURUM_AD[x.durum] + (x.guven ? " (" + GUVEN_AD[x.guven] + ")" : ""), fatTutar(x), x.fark ? tl(x.fark / 100) : "", x.neden.join(" · ")] });
    });
    return h;
  }
  var BAS = {
    eslesen: ["Satır", "Tarih", "Açıklama", "Tutar", "Durum", "Faturalar (düşülen tutar)", "Fark: hareket − fatura kalanı", "Neden"],
    dogrula: ["Satır", "Tarih", "Açıklama", "Tutar", "Durum", "Faturalar (düşülen tutar)", "Fark: hareket − fatura kalanı", "Neden"],
    aday: ["Satır", "Tarih", "Açıklama", "Tutar", "Aday faturalar", "Neden"],
    eslesmedi: ["Satır", "Tarih", "Açıklama / gönderen", "Tutar", "Kategori önerisi"],
    acik: ["Fatura no", "Tarih", "Yön", "Cari", "Fatura tutarı", "Kalan", "Gün", "Not"],
    ekstre: ["Uyarı", "Satır", "Tarih", "Tutar", "Açıklama"]
  };
  var SAG = { eslesen: [3, 6], dogrula: [3, 6], aday: [3], eslesmedi: [3], acik: [4, 5, 6], ekstre: [3] };
  var SINIR = 500;
  function sayilar(r) {
    var n = { eslesen: 0, dogrula: 0, aday: 0, eslesmedi: 0 };
    r.sonuc.forEach(function (x) { n[grup(x)]++; });
    n.acik = r.acik.length; n.ekstre = (r.den.kirik ? r.den.kirik.length : 0) + r.den.mukerrer.length;
    return n;
  }
  function goster(r) {
    var k = $("sonuc"); k.hidden = false; k.textContent = ""; var n = sayilar(r), S = r.ozet;
    var eslC = 0, acikSatisC = 0, acikAlisC = 0;
    r.sonuc.forEach(function (x) { if (grup(x) === "eslesen") eslC += Math.abs(x.h.c); });
    r.acik.forEach(function (f) { if (f.yon === "giden") acikSatisC += f.kalan; else acikAlisC += f.kalan; });
    k.appendChild(el("h2", { m: n.eslesen + " / " + r.sonuc.length + " hareket güvenle eşleşti · " + (n.dogrula + n.aday) + " doğrulanacak · " + n.eslesmedi + " eşleşmeyen" }));
    k.appendChild(el("p", { c: "kucuk", m: "Fatura kaynağı: " + r.girdi.fatKaynak + ". Eşleşen faturalar: " + r.fatura.length + " fatura içinden " + (r.fatura.length - r.acik.length) + " tanesi tamamen kapandı, " + r.acik.length + " tanesi açık (ya da kısmen ödenmiş)." }));
    var kt = el("div", { c: "fd-kutular" });
    kt.appendChild(kutu(r.sonuc.length, "Banka hareketi"));
    kt.appendChild(kutu(n.eslesen, "Güvenle eşleşen", "iyi"));
    kt.appendChild(kutu(n.dogrula + n.aday, "Doğrulanacak", (n.dogrula + n.aday) ? "uy" : "iyi"));
    kt.appendChild(kutu(n.eslesmedi, "Eşleşmeyen hareket", n.eslesmedi ? "uy" : "iyi"));
    kt.appendChild(kutu(r.acik.length, "Açık fatura", r.acik.length ? "uy" : "iyi"));
    kt.appendChild(kutu(tl(acikSatisC / 100), "Açık satış alacağı (TL)", acikSatisC ? "kotu" : "iyi"));
    kt.appendChild(kutu(tl(acikAlisC / 100), "Açık alış borcu (TL)", ""));
    kt.appendChild(kutu(tl(eslC / 100), "Güvenle eşleşen tutar (TL)", "iyi"));
    k.appendChild(kt);
    var ok = S.dengeHareket && S.dengeFatura;
    k.appendChild(el("p", { c: ok ? "uyari" : "uyari sonuc-hata", m: ok ? "Kontrol: " + r.sonuc.length + " hareketin net toplamı (" + tl((S.girisC + S.cikisC) / 100) + " TL: giriş " + tl(S.girisC / 100) + ", çıkış " + tl(S.cikisC / 100) + ") sonuç gruplarının toplamıyla; " + r.fatura.length + " faturanın toplamı (" + tl(S.faturaC / 100) + " TL) ödenen (" + tl(S.odenenC / 100) + " TL) + kalan toplamıyla kuruşu kuruşuna örtüşüyor." : "Kontrol TUTMUYOR: toplamlar örtüşmedi. Sonuçlara güvenmeyin ve bize bildirin." }));
    var uy = r.girdi.uyari.slice();
    if (r.girdi.atlanan.length) uy.push(r.girdi.atlanan.length + " ekstre satırı atlandı (toplam/devir satırı, tutar ya da tarih okunamadı). Ayrıntı Excel çıktısındaki 'Atlanan satırlar' sayfasında.");
    if (r.den.mukerrer.some(function (x) { return x.kesin; })) uy.push(r.den.mukerrer.filter(function (x) { return x.kesin; }).length + " ekstre satırı aynı bakiye/dekont numarasıyla iki kez geçiyor; ekstre iki kez yüklenmiş olabilir, tekrarlar eşleştirmeden çıkarıldı.");
    if (r.den.kirik && r.den.kirik.length) uy.push("Bakiye zinciri " + r.den.kirik.length + " yerde kırık: ekstrede eksik ya da yer değiştirmiş satır olabilir. 'Ekstre uyarıları' sekmesine bakın.");
    if (r.den.kirik === null) uy.push("Bakiye sütunu var ama satırlar bakiye zincirine uymuyor; bakiye denetimi yapılamadı (tarih sırası ya da bakiye anlamı farklı olabilir).");
    if (r.iadeler.length) uy.push(r.iadeler.length + " iade faturası eşleştirmeye alınmadı; ilgili carinin ödemesinde mahsup olabilir.");
    if (r.dovizDisi.length) uy.push(r.dovizDisi.length + " dövizli faturada kur bilgisi olmadığı için TL tutar karşılaştırması yapılamadı; eşleştirme dışı.");
    if (r.girdi.xmlOkunamayan.length) uy.push(r.girdi.xmlOkunamayan.length + " XML dosyası okunamadı; bu faturalar yok sayıldı.");
    uy.forEach(function (u) { k.appendChild(el("p", { c: "uyari", m: u })); });

    var filt = el("div", { c: "fd-filtre", role: "group", "aria-label": "Sonuç sekmeleri" }), tk = el("div"), aktif = n.dogrula + n.aday ? "dogrula" : "eslesen";
    function ciz() {
      Array.prototype.forEach.call(filt.children, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === aktif)); });
      tk.textContent = "";
      var l = sekmeSatirlari(r, aktif);
      if (!l.length) { tk.appendChild(el("p", { c: "kucuk", m: "Bu sekmede kayıt yok." })); return; }
      tk.appendChild(tablo(BAS[aktif], l.slice(0, SINIR), SAG[aktif]));
      if (l.length > SINIR) tk.appendChild(el("p", { c: "kucuk", m: "İlk " + SINIR + " kayıt gösteriliyor; tamamı Excel dosyasında (" + l.length + " satır)." }));
    }
    SEKME.forEach(function (f) { var b = el("button", { c: "btn iki fd-f", type: "button", "data-f": f[0], "aria-pressed": "false", m: f[1] + " (" + n[f[0]] + ")" }); b.addEventListener("click", function () { aktif = f[0]; ciz(); }); filt.appendChild(b); });
    k.appendChild(el("h3", { m: "Ayrıntılar" })); k.appendChild(filt); k.appendChild(tk); ciz();

    var yg = r.yas.giden;
    if (yg.cariler.length) {
      k.appendChild(el("h3", { m: "Açık satış alacakları: cari bazlı yaşlandırma (referans tarih " + (r.refGun === null ? "-" : trTarih(isoGun(r.refGun))) + " = ekstredeki son hareket)", style: "margin-top:22px" }));
      k.appendChild(tablo(["Cari", "Açık fatura", "Toplam (TL)"].concat(yg.kovalar.map(function (v) { return v + " gün"; })).concat(["En eski (gün)"]), yg.cariler.slice(0, 40).map(function (c) { return { c: "", h: [c.ad, c.adet, tl(c.toplam / 100)].concat(c.kova.map(function (v) { return v ? tl(v / 100) : ""; })).concat([c.enEski]) }; }), [1, 2, 3, 4, 5, 6, 7]));
    }
    var mesaj = el("textarea", { id: "mesaj", rows: "10", "aria-label": "Ödeme hatırlatma metni", readonly: "" }); mesaj.value = mesajMetni(r);
    k.appendChild(el("h3", { m: "Ödeme hatırlatma metni (kopyalayıp kendiniz iletebilirsiniz)", style: "margin-top:22px" }));
    k.appendChild(mesaj);
    k.appendChild(el("div", { c: "arac-eylem" }, [el("button", { c: "btn", type: "button", id: "b-xlsx", m: "Excel indir (.xlsx)" }), el("button", { c: "btn iki", type: "button", id: "b-kopya", m: "Metni kopyala" })]));
    $("b-xlsx").addEventListener("click", function () { indirBayt("banka-fatura-eslestirme-" + new Date().toISOString().slice(0, 10) + ".xlsx", EFXL.yaz(BETX.sayfalar(r, { trTarih: trTarih, DURUM_AD: DURUM_AD, GUVEN_AD: GUVEN_AD, grup: grup })), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); });
    $("b-kopya").addEventListener("click", function () { mesaj.select(); try { navigator.clipboard.writeText(mesaj.value).then(function () { $("b-kopya").textContent = "Kopyalandı"; }, function () { document.execCommand("copy"); }); } catch (e) { document.execCommand("copy"); } });
    k.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function isoGun(g) { return new Date(g * 86400000).toISOString().slice(0, 10); }
  function mesajMetni(r) {
    var yg = r.yas.giden, s = ["Merhaba, e-Fatura kayıtlarımızla banka hareketlerimizi karşılaştırdık; aşağıdaki faturalar için ödeme kaydı görünmüyor."];
    if (!yg.cariler.length) { s.push(""); s.push("Açık satış faturası görünmüyor."); return s.join("\n"); }
    yg.cariler.slice(0, 15).forEach(function (c, i) {
      s.push(""); s.push((i + 1) + ") " + c.ad + " · toplam " + tl(c.toplam / 100) + " TL");
      c.faturalar.sort(function (a, b) { return b.gun - a.gun; }).slice(0, 6).forEach(function (x) { s.push("   - " + x.f.no + " · " + trTarih(x.f.tarih) + " · " + tl(x.f.kalan / 100) + " TL" + (x.f.odemeler.length ? " (kalan)" : "")); });
    });
    if (yg.cariler.length > 15) s.push("... ve " + (yg.cariler.length - 15) + " cari daha (Excel dosyasında).");
    s.push(""); s.push("Ödemeniz yapıldıysa dekontu paylaşırsanız kaydı düzeltiriz. Teşekkürler.");
    return s.join("\n");
  }
  function indirBayt(ad, bayt, tur) { var u = URL.createObjectURL(new Blob([bayt], { type: tur })), a = el("a", { href: u, download: ad }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); }

  async function dosyalar(liste) { var k = []; for (var i = 0; i < liste.length; i++) k.push({ ad: liste[i].name, u8: new Uint8Array(await liste[i].arrayBuffer()) }); return k; }
  async function faturaDosyalari(liste) {
    var k = await dosyalar(liste), tablo1 = k.filter(function (d) { return /\.(xlsx|xlsm|csv|txt)$/i.test(d.ad); });
    if (tablo1.length && tablo1.length === k.length) { X = null; return excelFaturaYukle(tablo1[0].ad, tablo1[0].u8); }
    FL = null; return xmlYukle(k);
  }
  function baslat() {
    var kb = $("yukle-b"), ib = $("dosya-b"), kf = $("yukle-f"), iff = $("dosya-f");
    ib.addEventListener("change", async function () { if (ib.files.length) { var f = ib.files[0]; bankaYukle(f.name, new Uint8Array(await f.arrayBuffer())); } });
    iff.addEventListener("change", async function () { if (iff.files.length) faturaDosyalari(iff.files); });
    [[kb, async function (fl) { var f = fl[0]; bankaYukle(f.name, new Uint8Array(await f.arrayBuffer())); }], [kf, async function (fl) { faturaDosyalari(fl); }]].forEach(function (p) {
      ["dragover", "dragenter"].forEach(function (e) { p[0].addEventListener(e, function (ev) { ev.preventDefault(); p[0].classList.add("ustte"); }); });
      ["dragleave", "drop"].forEach(function (e) { p[0].addEventListener(e, function (ev) { ev.preventDefault(); p[0].classList.remove("ustte"); }); });
      p[0].addEventListener("drop", function (ev) { if (ev.dataTransfer.files.length) p[1](ev.dataTransfer.files); });
    });
    ["yon", "tol", "avans", "ters"].forEach(function (i) { $(i).addEventListener("change", hesaplaBekle); });
    $("vkn").addEventListener("change", function () { if (X) { xmlKart(); hesaplaBekle(); } });
    xmlKart(); bankaKart();
    $("b-ornek").addEventListener("click", async function () {
      var o = BETOR.demo(), enc = new TextEncoder(); FL = null;
      await xmlYukle(o.faturalar.map(function (f) { return { ad: f.ad, u8: enc.encode(f.metin) }; }));
      await bankaYukle(o.ekstreAdi, BETOR.xlsxBayt());
    });
    $("b-ornek-x").addEventListener("click", function () { indirBayt("ORNEK-satis-faturalari-xml.zip", BETOR.zipBayt(), "application/zip"); });
    $("b-ornek-b").addEventListener("click", function () { indirBayt("ORNEK-banka-ekstresi.xlsx", BETOR.xlsxBayt(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); });
    window.__BET = { son: function () { return SON; }, hesapla: hesapla };
  }
  document.addEventListener("DOMContentLoaded", baslat);
})();
