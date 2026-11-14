/* e-Fatura Denetim — arayüz. Dosyalar cihazdan çıkmaz; tüm içerik textContent ile yazılır (XML içeriği güvenilmez veridir). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var SON = null, GOSTER_SINIR = 500;
  function el(t, o, ic) { var e = document.createElement(t); o = o || {}; Object.keys(o).forEach(function (k) { if (k === "m") e.textContent = o[k]; else if (k === "c") e.className = o[k]; else e.setAttribute(k, o[k]); }); (ic || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function tl(x) { return (x === null || x === undefined || isNaN(x)) ? "" : x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function durum(m) { $("durum").textContent = m; }

  function metinCoz(u8) {
    var bas = new TextDecoder("utf-8").decode(u8.subarray(0, 200)), m = /encoding\s*=\s*["']([^"']+)["']/i.exec(bas), enc = m ? m[1].toLowerCase() : "utf-8";
    if (/^(iso-8859-9|windows-1254|latin5|iso8859-9)$/.test(enc)) enc = "windows-1254";
    try { return new TextDecoder(enc).decode(u8); } catch (e) { return new TextDecoder("utf-8").decode(u8); }
  }
  async function dosyalariOku(liste) {
    var out = [], atlanan = [], toplam = 0;
    for (var i = 0; i < liste.length; i++) {
      var f = liste[i], ad = f.name;
      durum("Okunuyor: " + (i + 1) + "/" + liste.length + " — " + ad);
      if (f.size > EFZ.SINIR.girdi) { atlanan.push(ad + ": çok büyük (" + Math.round(f.size / 1048576) + " MB)"); continue; }
      var u8 = new Uint8Array(await f.arrayBuffer());
      if (u8.length > 3 && u8[0] === 0x50 && u8[1] === 0x4B) {
        try {
          var ent = await EFZ.oku(u8);
          for (var k = 0; k < ent.length; k++) {
            var e = ent[k], yol = ad + "/" + e.ad;
            if (!/\.xml$/i.test(e.ad)) { if (!/\/$/.test(e.ad)) atlanan.push(yol + ": XML değil, atlandı"); continue; }
            if (e.hata) { atlanan.push(yol + ": " + e.hata); out.push({ ad: yol, metin: "" }); continue; }
            out.push({ ad: yol, metin: metinCoz(e.veri) });
          }
        } catch (err) { atlanan.push(ad + ": " + err.message); }
      } else if (/\.xml$/i.test(ad)) {
        if (u8.length > EFZ.SINIR.dosya) { atlanan.push(ad + ": çok büyük (" + Math.round(u8.length / 1048576) + " MB)"); continue; }
        out.push({ ad: ad, metin: metinCoz(u8) });
      } else atlanan.push(ad + ": XML ya da ZIP değil, atlandı");
      toplam += u8.length; if (toplam > EFZ.SINIR.toplam) { atlanan.push("Toplam boyut sınırı (600 MB) aşıldı, kalan dosyalar alınmadı."); break; }
      if (i % 20 === 19) await new Promise(function (r) { setTimeout(r, 0); });
    }
    return { dosyalar: out, atlanan: atlanan };
  }

  async function calistir(liste, etiket) {
    $("sonuc").hidden = true; $("hata").hidden = true;
    try {
      var o = liste.__ornek ? { dosyalar: liste, atlanan: [] } : await dosyalariOku(liste);
      if (!o.dosyalar.length) { $("hata").hidden = false; $("hata").textContent = "İşlenecek XML dosyası bulunamadı." + (o.atlanan.length ? " " + o.atlanan.slice(0, 3).join(" · ") : ""); durum(""); return; }
      durum("Denetleniyor: " + o.dosyalar.length + " dosya…");
      await new Promise(function (r) { setTimeout(r, 15); });
      var vk = $("kendi-vkn").value.replace(/\D/g, ""), donem = $("donem").value;
      var s = EFD.denetle(o.dosyalar, { kendiVkn: vk, donem: donem, bugun: new Date().toISOString().slice(0, 10) });
      o.atlanan.forEach(function (a) { s.bulgular.push({ dosya: a.split(":")[0], no: "", ciddiyet: "UYARI", kod: "K00", baslik: "Dosya atlandı", ayrinti: a }); s.ozet.uyari++; });
      s.ornek = !!liste.__ornek; SON = s; goster(s); durum("");
    } catch (err) { $("hata").hidden = false; $("hata").textContent = "Beklenmeyen hata: " + err.message; durum(""); }
  }

  function kutu(deger, etiket, sinif) { return el("div", { c: "ef-kutu " + (sinif || "") }, [el("b", { m: String(deger) }), el("span", { m: etiket })]); }
  function tablo(basliklar, satirlar, sagKolonlar) {
    var t = el("table"), th = el("tr");
    basliklar.forEach(function (b, i) { th.appendChild(el("th", { m: b, c: sagKolonlar && sagKolonlar.indexOf(i) >= 0 ? "sag" : "" })); });
    t.appendChild(el("thead", {}, [th]));
    var tb = el("tbody"); satirlar.forEach(function (s) { var tr = el("tr", s.sinif ? { c: s.sinif } : {}); s.h.forEach(function (h, i) { tr.appendChild(el("td", { m: h === null || h === undefined ? "" : String(h), c: sagKolonlar && sagKolonlar.indexOf(i) >= 0 ? "sag" : "" })); }); tb.appendChild(tr); });
    t.appendChild(tb); return el("div", { c: "tablo-kay", tabindex: "0" }, [t]);
  }

  function goster(s) {
    var o = s.ozet, k = $("sonuc"); k.hidden = false; k.innerHTML = "";
    if (s.ornek) k.appendChild(el("p", { c: "uyari", m: "ÖRNEK: Bu sonuçlar kurgusal örnek dosyalardan üretildi; gerçek firma, kişi veya fatura yoktur. Kendi dosyalarınızı yüklemek için yukarıdan seçin." }));
    k.appendChild(el("h2", { m: "Sonuç" }));
    k.appendChild(el("p", { c: "ozet", m: o.fatura + " fatura okundu" + (o.okunamayan ? ", " + o.okunamayan + " dosya okunamadı" : "") + ". " + (o.hata + o.uyari === 0 ? "Hata ya da uyarı bulunmadı." : o.hata + " hata, " + o.uyari + " uyarı bulundu.") }));
    k.appendChild(el("div", { c: "ef-kutular" }, [kutu(o.fatura, "fatura"), kutu(o.temiz, "temiz fatura", "iyi"), kutu(o.hata, "hata", o.hata ? "kotu" : ""), kutu(o.uyari, "uyarı", o.uyari ? "uy" : ""), kutu(o.okunamayan, "okunamayan", o.okunamayan ? "kotu" : "")]));
    if (s.ayar.kendiVkn) k.appendChild(el("p", { c: "kucuk", m: "Yön (VKN " + s.ayar.kendiVkn + "): " + o.yonSayi.giden + " giden · " + o.yonSayi.gelen + " gelen · " + o.yonSayi["dışı"] + " size ait değil." }));
    if (o.doviz) k.appendChild(el("p", { c: "kucuk", m: o.doviz + " döviz faturası KDV özetine katılmadı (tutarlar fatura para biriminde)." }));

    var ac = el("div", { c: "arac-eylem" }, [
      el("button", { c: "btn", type: "button", id: "b-xlsx", m: "Excel indir (.xlsx)" }),
      el("button", { c: "btn iki", type: "button", id: "b-csv", m: "Bulgular CSV" })]);
    k.appendChild(ac);
    $("b-xlsx").addEventListener("click", function () { indirXlsx(s); });
    $("b-csv").addEventListener("click", function () { indirCsv(s); });

    k.appendChild(el("h3", { m: "KDV özeti (oran bazında)", style: "margin-top:24px" }));
    if (o.kdvListe.length) k.appendChild(tablo(["Yön", "KDV oranı", "Fatura", "Matrah (TL)", "KDV (TL)"], o.kdvListe.map(function (x) { return { h: [x.yon, "%" + x.oran, x.adet, tl(x.matrah), tl(x.vergi)] }; }), [2, 3, 4]));
    else k.appendChild(el("p", { c: "kucuk", m: "KDV özeti için okunabilir TL fatura yok." }));
    k.appendChild(el("p", { c: "kucuk", m: "İade faturaları eksi olarak toplanır. Bu bir KDV beyannamesi değildir; yalnız yüklediğiniz dosyaların toplamıdır." }));

    k.appendChild(el("h3", { m: "Bulgular", style: "margin-top:24px" }));
    var filt = el("div", { c: "ef-filtre", role: "group", "aria-label": "Bulguları süz" }); var secili = "hepsi";
    var tabloKap = el("div", { id: "bulgu-kap" });
    function ciz() {
      tabloKap.innerHTML = "";
      var b = s.bulgular.filter(function (x) { return secili === "hepsi" || (secili === "hata" && x.ciddiyet === "HATA") || (secili === "uyari" && x.ciddiyet === "UYARI") || (secili === "bilgi" && x.ciddiyet === "BİLGİ"); });
      if (!b.length) { tabloKap.appendChild(el("p", { c: "kucuk", m: "Bu süzgeçte bulgu yok." })); return; }
      var tb = tablo(["Önem", "Kod", "Dosya", "Fatura no", "Bulgu", "Ayrıntı"], b.slice(0, GOSTER_SINIR).map(function (x) { return { sinif: x.ciddiyet === "HATA" ? "h-hata" : x.ciddiyet === "UYARI" ? "h-uyari" : "", h: [x.ciddiyet, x.kod, x.dosya, x.no, x.baslik, x.ayrinti] }; })); tb.querySelector("table").classList.add("ef-bulgu"); tabloKap.appendChild(tb);
      if (b.length > GOSTER_SINIR) tabloKap.appendChild(el("p", { c: "kucuk", m: "İlk " + GOSTER_SINIR + " bulgu gösteriliyor; tamamı Excel dosyasında (" + b.length + " satır)." }));
    }
    [["hepsi", "Hepsi (" + s.bulgular.length + ")"], ["hata", "Hata (" + o.hata + ")"], ["uyari", "Uyarı (" + o.uyari + ")"], ["bilgi", "Bilgi (" + o.bilgi + ")"]].forEach(function (p) {
      var b = el("button", { type: "button", c: "btn iki ef-f", m: p[1], "aria-pressed": p[0] === secili ? "true" : "false" });
      b.addEventListener("click", function () { secili = p[0]; Array.prototype.forEach.call(filt.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); }); ciz(); });
      filt.appendChild(b);
    });
    k.appendChild(filt); k.appendChild(tabloKap); ciz();

    k.appendChild(el("h3", { m: "Faturalar", style: "margin-top:24px" }));
    var hata = {}; s.bulgular.forEach(function (b) { if (b.ciddiyet !== "BİLGİ") hata[b.dosya] = (hata[b.dosya] || 0) + 1; });
    k.appendChild(tablo(["Dosya", "No", "Tarih", "Yön", "Satıcı", "Alıcı", "Matrah", "KDV", "Ödenecek", "Para", "Bulgu"], s.faturalar.slice(0, GOSTER_SINIR).map(function (f) { return { h: [f.dosya, f.no, f.tarih, f.yon, f.satici.ad || f.satici.id, f.alici.ad || f.alici.id, f.toplam ? tl(f.toplam.haric) : "", tl(f.vergiToplamHdr), f.toplam ? tl(f.toplam.odenecek) : "", f.para, hata[f.dosya] || 0] }; }), [6, 7, 8, 10]));
    if (s.faturalar.length > GOSTER_SINIR) k.appendChild(el("p", { c: "kucuk", m: "İlk " + GOSTER_SINIR + " fatura gösteriliyor; tamamı Excel dosyasında (" + s.faturalar.length + " satır)." }));
    k.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function sayfalar(s) {
    var o = s.ozet, hata = {}; s.bulgular.forEach(function (b) { if (b.ciddiyet !== "BİLGİ") hata[b.dosya] = (hata[b.dosya] || 0) + 1; });
    return [
      { ad: "Özet", satirlar: [["Ölçüt", "Değer"], ["Denetim tarihi", s.ayar.bugun], ["Dosya sayısı", o.dosya], ["Okunan fatura", o.fatura], ["Okunamayan dosya", o.okunamayan], ["Temiz fatura", o.temiz], ["Hata", o.hata], ["Uyarı", o.uyari], ["Bilgi", o.bilgi], ["Kendi VKN", s.ayar.kendiVkn || "(girilmedi)"], ["Dönem", s.ayar.donem || "(seçilmedi)"], ["Not", "Bilgi amaçlıdır; GİB şema/imza doğrulaması ya da resmi işlem yerine geçmez. dijitabela.com/araclar/e-fatura-denetim/"]] },
      { ad: "Bulgular", satirlar: [["Önem", "Kod", "Dosya", "Fatura no", "Bulgu", "Ayrıntı"]].concat(s.bulgular.map(function (b) { return [b.ciddiyet, b.kod, b.dosya, b.no, b.baslik, b.ayrinti]; })) },
      { ad: "Faturalar", satirlar: [["Dosya", "Fatura no", "ETTN", "Tarih", "Tip", "Senaryo", "Yön", "Satıcı VKN/TCKN", "Satıcı", "Alıcı VKN/TCKN", "Alıcı", "Para", "Satır toplamı", "Vergi hariç", "Vergi toplamı", "Vergi dahil", "Ödenecek", "Bulgu sayısı"]].concat(s.faturalar.map(function (f) { var t = f.toplam || {}; return [f.dosya, f.no, f.ettn, f.tarih, f.tip, f.senaryo, f.yon, f.satici.id, f.satici.ad, f.alici.id, f.alici.ad, f.para, t.satir, t.haric, f.vergiToplamHdr, t.dahil, t.odenecek, hata[f.dosya] || 0]; })) },
      { ad: "KDV özeti", satirlar: [["Yön", "KDV oranı (%)", "Fatura", "Matrah", "KDV"]].concat(o.kdvListe.map(function (x) { return [x.yon, x.oran, x.adet, x.matrah, x.vergi]; })) }
    ];
  }
  function indirBayt(ad, bayt, tur) { var u = URL.createObjectURL(new Blob([bayt], { type: tur })), a = el("a", { href: u, download: ad }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000); }
  function indirXlsx(s) { indirBayt("e-fatura-denetim-" + s.ayar.bugun + ".xlsx", EFXL.yaz(sayfalar(s)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); }
  function csvHucre(h) { h = h === null || h === undefined ? "" : String(h); if (/^[=+\-@\t\r]/.test(h)) h = "'" + h; return /[";\n\r]/.test(h) ? '"' + h.replace(/"/g, '""') + '"' : h; }
  function indirCsv(s) { var sat = sayfalar(s)[1].satirlar.map(function (r) { return r.map(csvHucre).join(";"); }).join("\r\n"); indirBayt("e-fatura-bulgular-" + s.ayar.bugun + ".csv", "﻿" + sat, "text/csv;charset=utf-8"); }

  function baslat() {
    var kap = $("yukle"), inp = $("dosya");
    inp.addEventListener("change", function () { if (inp.files.length) calistir(Array.prototype.slice.call(inp.files)); });
    ["dragover", "dragenter"].forEach(function (e) { kap.addEventListener(e, function (ev) { ev.preventDefault(); kap.classList.add("ustte"); }); });
    ["dragleave", "drop"].forEach(function (e) { kap.addEventListener(e, function (ev) { ev.preventDefault(); kap.classList.remove("ustte"); }); });
    kap.addEventListener("drop", function (ev) { var l = Array.prototype.slice.call(ev.dataTransfer.files); if (l.length) calistir(l); });
    $("b-ornek").addEventListener("click", function () { var d = EFO.demo(); d.__ornek = true; calistir(d); });
    window.__EF = { calistir: calistir, son: function () { return SON; } };
  }
  document.addEventListener("DOMContentLoaded", baslat);
})();
