/* Cari ekstre mutabakatı — arayüz. Dosyalar cihazdan çıkmaz; tüm içerik textContent ile yazılır. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var TARAF = { a: null, b: null }, SON = null, SINIR = 500;
  var TURLER = { ESLESTI: "Eşleşti", TARIH_FARKLI: "Tarih farklı", BELGE_FARKLI: "Belge no farklı", TUTAR_FARKI: "Tutar farkı", COKLU: "Bire çok", SADECE_A: "Yalnız bizde", SADECE_B: "Yalnız karşıda" };
  var FILTRELER = [["fark", "Farklar"], ["SADECE_A", "Yalnız bizde"], ["SADECE_B", "Yalnız karşıda"], ["TUTAR_FARKI", "Tutar farkı"], ["TARIH_FARKLI", "Tarih/belge farklı"], ["COKLU", "Bire çok"], ["ESLESTI", "Eşleşenler"], ["hepsi", "Hepsi"]];
  function el(t, o, ic) { var e = document.createElement(t); o = o || {}; Object.keys(o).forEach(function (k) { if (k === "m") e.textContent = o[k]; else if (k === "c") e.className = o[k]; else e.setAttribute(k, o[k]); }); (ic || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function tl(x) { return (x === null || x === undefined || isNaN(x)) ? "" : x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function bk(x) { return tl(Math.abs(x)) + (x > 0 ? " B" : x < 0 ? " A" : ""); }
  function trTarih(iso) { return iso ? iso.split("-").reverse().join(".") : ""; }
  function durum(m) { $("durum").textContent = m; }
  function hata(m) { var h = $("hata"); h.hidden = !m; h.textContent = m || ""; }
  function harf(i) { var s = "", n = i + 1; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }

  async function dosyaYukle(taraf, ad, bayt) {
    hata("");
    try {
      if (bayt.length > 60 * 1024 * 1024) throw new Error("Dosya çok büyük (en fazla 60 MB)");
      var sayfalar = await CMO.oku(bayt, ad), secili = 0, tani = null;
      for (var i = 0; i < sayfalar.length; i++) { var t = CM.baslikTani(sayfalar[i].rows); if (t) { secili = i; tani = t; break; } }
      var s = { ad: ad, sayfalar: sayfalar, sayfa: secili, tani: tani, kolon: tani ? Object.assign({}, tani.kolonlar) : {}, bas: tani ? tani.basSatir : 0 };
      TARAF[taraf] = s; kartCiz(taraf); sonucDene();
    } catch (e) { TARAF[taraf] = null; kartCiz(taraf); hata((taraf === "a" ? "Bizim ekstre: " : "Karşı taraf ekstresi: ") + e.message); }
  }
  async function dosyaSec(taraf, f) { if (!f) return; var u8 = new Uint8Array(await f.arrayBuffer()); await dosyaYukle(taraf, f.name, u8); }

  function kartCiz(taraf) {
    var k = $("kart-" + taraf); k.textContent = ""; var s = TARAF[taraf];
    if (!s) { k.appendChild(el("p", { c: "kucuk", m: "Henüz dosya seçilmedi." })); return; }
    k.appendChild(el("p", { c: "cm-dosya", m: s.ad }));
    var sy = s.sayfalar[s.sayfa], rows = sy.rows;
    if (s.sayfalar.length > 1) {
      var sel = el("select", { "aria-label": "Sayfa seçin" });
      s.sayfalar.forEach(function (x, i) { var o = el("option", { value: String(i), m: x.ad }); if (i === s.sayfa) o.selected = true; sel.appendChild(o); });
      sel.addEventListener("change", function () { s.sayfa = +sel.value; s.tani = CM.baslikTani(s.sayfalar[s.sayfa].rows); s.kolon = s.tani ? Object.assign({}, s.tani.kolonlar) : {}; s.bas = s.tani ? s.tani.basSatir : 0; kartCiz(taraf); sonucDene(); });
      k.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: "Sayfa" }), sel]));
    }
    if (!s.tani) { k.appendChild(el("p", { c: "uyari sonuc-hata", m: "Başlık satırı bulunamadı. Ekstrede en az 'Tarih' ile 'Borç/Alacak' (ya da 'Tutar') sütunları olmalı." })); return; }
    var bas = s.tani.basliklar, ozet = el("div", { c: "cm-kolonlar" });
    ["tarih", "belge", "aciklama", "borc", "alacak", "tutar", "ba"].forEach(function (anahtar) {
      if ((anahtar === "tutar" || anahtar === "ba") && (s.kolon.borc !== undefined && s.kolon.alacak !== undefined)) return;
      var sel2 = el("select", { "aria-label": CM.KOLON_ADI[anahtar] + " sütunu" });
      sel2.appendChild(el("option", { value: "", m: "(yok)" }));
      var maks = 0; rows.slice(s.bas, s.bas + 1).forEach(function (r) { maks = Math.max(maks, r.length); });
      for (var c = 0; c < Math.max(maks, bas.length); c++) { var o = el("option", { value: String(c), m: harf(c) + " — " + (bas[c] || "(başlıksız)") }); if (s.kolon[anahtar] === c) o.selected = true; sel2.appendChild(o); }
      sel2.addEventListener("change", function () { if (sel2.value === "") delete s.kolon[anahtar]; else s.kolon[anahtar] = +sel2.value; sonucDene(); });
      ozet.appendChild(el("label", { c: "alan" }, [el("span", { c: "et", m: CM.KOLON_ADI[anahtar] }), sel2]));
    });
    k.appendChild(el("details", { c: "acilir", open: "" }, [el("summary", { m: "Sütun eşlemesi (yanlışsa düzeltin)" }), ozet]));
  }

  function hazirla(taraf) {
    var s = TARAF[taraf]; if (!s || !s.tani) return null;
    var k = s.kolon; if (k.tarih === undefined || !((k.borc !== undefined && k.alacak !== undefined) || k.tutar !== undefined)) return { eksik: true };
    var r = CM.kayitlar(s.sayfalar[s.sayfa].rows, k, s.bas, taraf);
    return r;
  }
  var bekle = null;
  function sonucDene() { clearTimeout(bekle); bekle = setTimeout(hesapla, 50); }
  function hesapla() {
    $("sonuc").hidden = true; durum("");
    if (!TARAF.a || !TARAF.b) return;
    var A = hazirla("a"), B = hazirla("b");
    if (!A || !B) return;
    if (A.eksik || B.eksik) { hata("Tarih ve borç/alacak (ya da tutar) sütunlarını eşleyin."); return; }
    hata("");
    if (!A.kayit.length || !B.kayit.length) { hata("Ekstrelerden birinde okunabilir satır yok (" + (A.kayit.length ? "karşı taraf" : "bizim") + "). Sütun eşlemesini kontrol edin."); return; }
    if (A.kayit.length > 20000 || B.kayit.length > 20000) { hata("Bir ekstrede 20.000'den fazla satır var; dönemi daraltın."); return; }
    durum("Karşılaştırılıyor…");
    setTimeout(function () {
      try {
        var r = CM.eslestir(A.kayit, B.kayit, { yon: $("yon").value, pencere: +$("pencere").value });
        r.girdi = { a: A, b: B, adA: TARAF.a.ad, adB: TARAF.b.ad }; SON = r; goster(r); durum("");
      } catch (e) { hata("Beklenmeyen hata: " + e.message); durum(""); }
    }, 20);
  }

  function kutu(deger, etiket, sinif) { return el("div", { c: "cm-kutu " + (sinif || "") }, [el("b", { m: String(deger) }), el("span", { m: etiket })]); }
  function tablo(basliklar, satirlar, sag) {
    var t = el("table"), th = el("tr");
    basliklar.forEach(function (b, i) { th.appendChild(el("th", { m: b, c: sag && sag.indexOf(i) >= 0 ? "sag" : "" })); });
    t.appendChild(el("thead", {}, [th])); var tb = el("tbody");
    satirlar.forEach(function (s) { var tr = el("tr", s.c ? { c: s.c } : {}); s.h.forEach(function (h, i) { tr.appendChild(el("td", { m: h === null || h === undefined ? "" : String(h), c: sag && sag.indexOf(i) >= 0 ? "sag" : "" })); }); tb.appendChild(tr); });
    t.appendChild(tb); return el("div", { c: "tablo-kay", tabindex: "0" }, [t]);
  }
  function ozetMetin(c, yon) { return c; }
  function satirAyrinti(x, yonIs) { // [tarih, belge, aciklama, tutar]
    if (!x.length) return ["", "", "", ""];
    if (x.length === 1) { var q = x[0]; return [trTarih(q.tarih), q.belge || "", q.aciklama, tl(yonIs * q.v)]; }
    return [x.map(function (q) { return trTarih(q.tarih); }).join(" + "), x.map(function (q) { return q.belge; }).join(" + "), x.length + " kayıt", tl(x.reduce(function (t, q) { return t + yonIs * q.v; }, 0))];
  }
  function ciftSatir(c, r) {
    var is = r.yon === "ters" ? -1 : 1;
    var a = satirAyrinti(c.a, 1), b = satirAyrinti(c.b, is);
    return [TURLER[c.tur], a[0], a[1], a[2], a[3], b[0], b[1], b[2], b[3], c.fark ? tl(c.fark / 100) : "", c.sebep];
  }
  var BASLIK = ["Durum", "Bizde tarih", "Bizde belge", "Bizde açıklama", "Bizde tutar", "Karşıda tarih", "Karşıda belge", "Karşıda açıklama", "Karşıda tutar", "Fark", "Açıklama"];

  function goster(r) {
    var k = $("sonuc"); k.hidden = false; k.textContent = "";
    var esl = (r.say.ESLESTI || 0) + (r.say.TARIH_FARKLI || 0) + (r.say.BELGE_FARKLI || 0), fark = (r.say.TUTAR_FARKI || 0) + (r.say.COKLU || 0);
    k.appendChild(el("h2", { m: r.fark === 0 ? "Bakiyeler tutuyor" : "Bakiye farkı: " + bk(r.fark) }));
    if (r.yonBilgi) k.appendChild(el("p", { c: "kucuk", m: "Yön otomatik seçildi: " + (r.yon === "ters" ? "karşı tarafın ekstresi ters (ayna) yönde — sizin borcunuz onların alacağı" : "iki ekstre aynı yönde") + " (tutar çakışması: ters " + r.yonBilgi.ters + ", aynı " + r.yonBilgi.ayni + "). Yanlışsa yukarıdaki 'Yön' ayarını değiştirin." }));
    var kt = el("div", { c: "cm-kutular" });
    kt.appendChild(kutu(bk(r.bakA), "Bizim bakiye (" + r.A.length + " satır)"));
    kt.appendChild(kutu(bk(r.yon === "ters" ? -r.bakB : r.bakB), "Karşı bakiye, bizim yönümüzde (" + r.B.length + " satır)"));
    kt.appendChild(kutu(bk(r.fark), "Fark", r.fark === 0 ? "iyi" : "kotu"));
    kt.appendChild(kutu(esl, "Eşleşen kayıt", "iyi"));
    kt.appendChild(kutu((r.say.SADECE_A || 0) + (r.say.SADECE_B || 0), "Eşleşmeyen", (r.say.SADECE_A || r.say.SADECE_B) ? "uy" : "iyi"));
    k.appendChild(kt);
    k.appendChild(el("p", { c: r.korpuTutuyor ? "uyari" : "uyari sonuc-hata", m: r.korpuTutuyor ? "Kontrol: bakiye farkı (" + bk(r.fark) + ") aşağıdaki kalemlerin toplamıyla kuruşu kuruşuna açıklanıyor: yalnız bizde " + tl(r.sadeceAToplam) + " − yalnız karşıda " + tl(r.sadeceBToplam) + " + tutar/kuruş farkları " + tl(r.korpuToplam - r.sadeceAToplam + r.sadeceBToplam) + "." : "Dikkat: fark kalemlerle tam örtüşmedi; sütun eşlemesini kontrol edin." }));
    var uy = r.girdi.a.uyari.map(function (u) { return "Bizim ekstre: " + u; }).concat(r.girdi.b.uyari.map(function (u) { return "Karşı ekstre: " + u; }));
    var at = r.girdi.a.atlanan.length + r.girdi.b.atlanan.length;
    if (at) uy.push(at + " satır okunamadığı için atlandı (toplam/başlık/boş tutar satırları olabilir). Ayrıntı Excel çıktısındaki 'Atlanan satırlar' sayfasında.");
    uy.forEach(function (u) { k.appendChild(el("p", { c: "uyari", m: u })); });

    var filt = el("div", { c: "cm-filtre", role: "group", "aria-label": "Sonuç filtresi" }), tk = el("div"), aktif = "fark";
    function ciz() {
      Array.prototype.forEach.call(filt.children, function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === aktif)); });
      tk.textContent = "";
      var l = r.cift.filter(function (c) { return aktif === "hepsi" ? true : aktif === "fark" ? c.tur !== "ESLESTI" : aktif === "TARIH_FARKLI" ? (c.tur === "TARIH_FARKLI" || c.tur === "BELGE_FARKLI") : c.tur === aktif; });
      if (!l.length) { tk.appendChild(el("p", { c: "kucuk", m: "Bu filtrede kayıt yok." })); return; }
      tk.appendChild(tablo(BASLIK, l.slice(0, SINIR).map(function (c) { return { h: ciftSatir(c, r), c: c.tur === "SADECE_A" || c.tur === "SADECE_B" ? "cm-yalniz" : c.tur === "ESLESTI" ? "" : "cm-fark" }; }), [4, 8, 9]));
      if (l.length > SINIR) tk.appendChild(el("p", { c: "kucuk", m: "İlk " + SINIR + " kayıt gösteriliyor; tamamı Excel dosyasında (" + l.length + " satır)." }));
    }
    FILTRELER.forEach(function (f) {
      var n = f[0] === "hepsi" ? r.cift.length : f[0] === "fark" ? r.cift.filter(function (c) { return c.tur !== "ESLESTI"; }).length : f[0] === "TARIH_FARKLI" ? (r.say.TARIH_FARKLI || 0) + (r.say.BELGE_FARKLI || 0) : (r.say[f[0]] || 0);
      var b = el("button", { c: "btn iki cm-f", type: "button", "data-f": f[0], "aria-pressed": "false", m: f[1] + " (" + n + ")" });
      b.addEventListener("click", function () { aktif = f[0]; ciz(); }); filt.appendChild(b);
    });
    k.appendChild(el("h3", { m: "Kalemler" })); k.appendChild(filt); k.appendChild(tk); ciz();

    var mesaj = el("textarea", { id: "mesaj", rows: "9", "aria-label": "Karşı tarafa gönderilebilecek açıklama metni", readonly: "" }); mesaj.value = mesajMetni(r);
    k.appendChild(el("h3", { m: "Karşı tarafa iletilecek özet", style: "margin-top:22px" }));
    k.appendChild(mesaj);
    var ev = el("div", { c: "arac-eylem" }, [el("button", { c: "btn", type: "button", id: "b-xlsx", m: "Excel indir (.xlsx)" }), el("button", { c: "btn iki", type: "button", id: "b-kopya", m: "Metni kopyala" })]);
    k.appendChild(ev);
    $("b-xlsx").addEventListener("click", function () { indirBayt("cari-mutabakat-" + new Date().toISOString().slice(0, 10) + ".xlsx", EFXL.yaz(sayfalar(r)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); });
    $("b-kopya").addEventListener("click", function () { mesaj.select(); try { navigator.clipboard.writeText(mesaj.value).then(function () { $("b-kopya").textContent = "Kopyalandı"; }, function () { document.execCommand("copy"); }); } catch (e) { document.execCommand("copy"); } });
    k.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function mesajMetni(r) {
    var is = r.yon === "ters" ? -1 : 1, s = [];
    s.push("Merhaba, cari hesap ekstrelerimizi satır satır karşılaştırdık.");
    s.push("Bizim kayıtlarımıza göre bakiye: " + bk(r.bakA) + " TL; sizin ekstrenize göre (bizim yönümüzde): " + bk(is * r.bakB) + " TL. Fark: " + bk(r.fark) + " TL.");
    var ls = r.cift.filter(function (c) { return c.tur !== "ESLESTI" && c.tur !== "TARIH_FARKLI"; });
    if (ls.length) s.push("Farkı oluşturan kalemler:");
    ls.slice(0, 15).forEach(function (c, i) {
      var a = c.a[0], b = c.b[0], n = (i + 1) + ") ";
      if (c.tur === "SADECE_A") s.push(n + trTarih(a.tarih) + " " + (a.belge || "belgesiz") + " " + tl(a.v) + " TL — sizin ekstrenizde yok.");
      else if (c.tur === "SADECE_B") s.push(n + trTarih(b.tarih) + " " + (b.belge || "belgesiz") + " " + tl(is * b.v) + " TL — bizim ekstremizde yok.");
      else if (c.tur === "TUTAR_FARKI") s.push(n + (a.belge || b.belge || trTarih(a.tarih)) + ": bizde " + tl(a.v) + ", sizde " + tl(is * b.v) + " TL (fark " + tl(c.fark / 100) + ").");
      else if (c.tur === "BELGE_FARKLI") s.push(n + trTarih(a.tarih) + " " + tl(a.v) + " TL: belge no bizde " + (a.belge || "-") + ", sizde " + (b.belge || "-") + ".");
      else s.push(n + "Bir kayıt, karşı tarafta birden fazla kayda bölünmüş: " + tl(a ? a.v : is * b.v) + " TL.");
    });
    if (ls.length > 15) s.push("… ve " + (ls.length - 15) + " kalem daha (Excel dökümünde).");
    s.push("Kontrol edip dönüşünüzü rica ederiz.");
    return s.join("\n");
  }

  function sayfalar(r) {
    var is = r.yon === "ters" ? -1 : 1, t = new Date().toISOString().slice(0, 10);
    function sat(c) { var a = c.a, b = c.b; return [TURLER[c.tur], c.guven, a.map(function (q) { return trTarih(q.tarih); }).join(" + "), a.map(function (q) { return q.belge; }).join(" + "), a.map(function (q) { return q.aciklama; }).join(" + "), a.length ? a.reduce(function (z, q) { return z + q.v; }, 0) : null, b.map(function (q) { return trTarih(q.tarih); }).join(" + "), b.map(function (q) { return q.belge; }).join(" + "), b.map(function (q) { return q.aciklama; }).join(" + "), b.length ? b.reduce(function (z, q) { return z + is * q.v; }, 0) : null, c.fark / 100, c.sebep]; }
    var bas = ["Durum", "Güven", "Bizde tarih", "Bizde belge", "Bizde açıklama", "Bizde tutar (+borç/−alacak)", "Karşıda tarih", "Karşıda belge", "Karşıda açıklama", "Karşıda tutar (bizim yönümüzde)", "Fark", "Açıklama"];
    function liste(f) { return [bas].concat(r.cift.filter(f).map(sat)); }
    var atl = [["Taraf", "Satır no", "Neden", "İçerik"]];
    r.girdi.a.atlanan.forEach(function (x) { atl.push(["Bizim", x.satir, x.neden, x.icerik]); }); r.girdi.b.atlanan.forEach(function (x) { atl.push(["Karşı", x.satir, x.neden, x.icerik]); });
    return [
      { ad: "Özet", satirlar: [["Ölçüt", "Değer"], ["Tarih", t], ["Bizim dosya", r.girdi.adA], ["Karşı dosya", r.girdi.adB], ["Yön", r.yon === "ters" ? "Karşı ekstre ters (ayna) yönde" : "Aynı yönde"], ["Tarih penceresi (gün)", r.pencere], ["Bizim bakiye (+borç/−alacak)", r.bakA], ["Karşı bakiye (bizim yönümüzde)", is * r.bakB], ["Fark", r.fark], ["Yalnız bizde toplam", r.sadeceAToplam], ["Yalnız karşıda toplam (bizim yönümüzde)", r.sadeceBToplam], ["Kalemlerle açıklanan", r.korpuToplam], ["Kontrol", r.korpuTutuyor ? "Fark kalemlerle birebir açıklandı" : "Açıklanamadı, sütun eşlemesini kontrol edin"], ["Not", "Bilgi amaçlıdır; resmi mutabakat ya da muhasebe danışmanlığı yerine geçmez. dijitabela.com/araclar/cari-mutabakat/"]] },
      { ad: "Farklar", satirlar: liste(function (c) { return c.tur !== "ESLESTI" && c.tur !== "SADECE_A" && c.tur !== "SADECE_B"; }) },
      { ad: "Yalnız bizde", satirlar: liste(function (c) { return c.tur === "SADECE_A"; }) },
      { ad: "Yalnız karşıda", satirlar: liste(function (c) { return c.tur === "SADECE_B"; }) },
      { ad: "Eşleşenler", satirlar: liste(function (c) { return c.tur === "ESLESTI"; }) },
      { ad: "Atlanan satırlar", satirlar: atl }
    ];
  }
  function indirBayt(ad, bayt, tur) { var u = URL.createObjectURL(new Blob([bayt], { type: tur })), a = el("a", { href: u, download: ad }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); }

  function baslat() {
    ["a", "b"].forEach(function (t) {
      var kap = $("yukle-" + t), inp = $("dosya-" + t);
      inp.addEventListener("change", function () { if (inp.files.length) dosyaSec(t, inp.files[0]); });
      ["dragover", "dragenter"].forEach(function (e) { kap.addEventListener(e, function (ev) { ev.preventDefault(); kap.classList.add("ustte"); }); });
      ["dragleave", "drop"].forEach(function (e) { kap.addEventListener(e, function (ev) { ev.preventDefault(); kap.classList.remove("ustte"); }); });
      kap.addEventListener("drop", function (ev) { if (ev.dataTransfer.files.length) dosyaSec(t, ev.dataTransfer.files[0]); });
      kartCiz(t);
    });
    $("yon").addEventListener("change", hesapla); $("pencere").addEventListener("change", hesapla);
    $("b-ornek").addEventListener("click", async function () { var d = CMOR.demo(); await dosyaYukle("a", d[0].ad, d[0].bayt); await dosyaYukle("b", d[1].ad, d[1].bayt); });
    function indir(i, ad) { var d = CMOR.demo()[i]; indirBayt(ad, d.bayt, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); }
    $("b-ornek-a").addEventListener("click", function () { indir(0, "ORNEK-bizim-ekstre.xlsx"); });
    $("b-ornek-b").addEventListener("click", function () { indir(1, "ORNEK-karsi-taraf-ekstre.xlsx"); });
    window.__CM = { yukle: dosyaYukle, son: function () { return SON; }, hesapla: hesapla };
  }
  document.addEventListener("DOMContentLoaded", baslat);
})();
