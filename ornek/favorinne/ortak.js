/* FavorinNe örnek çalışma · ortak veri ve araçlar (Dijitabela, 11 Kasım 2026)
   Ürün adları, fiyatlar ve görseller favorinne.com'dan alındı (6 Kasım 2026). Sağlık iddiası yazılmaz. */
(function () {
  var KOK = window.FN_KOK || "../";
  var WA = "905369113935", ESIK = 750;
  // id, marka, ad, fiyat, kategori, adım, cilt etiketleri (yalnız ürün adında yazan bilgi)
  var U = [
    [1, "Nutraxin", "Nutraxin Efervesan - Vitamin C-D-Zinc 15 Tablet", 199, "takviye", "", [], "nutraxin-efervesan-vitamin-c-d-zinc-15-tablet-2361"],
    [2, "Nutraxin", "Nutraxin D3K2 120 Tablet - 1000 IU D3 vitamini, 25 mcg K2 vitamini", 249, "takviye", "", [], "nutraxin-d3k2-120-tablet-1000-iu-d3-vitamini-25-mcg-k2-vitamini-2057"],
    [3, "Nutraxin", "Nutraxin Vitals Omega-3 + Co-Q10 60 Softgel", 649, "takviye", "", [], "nutraxin-vitals-omega-3-co-q10-60-softgel-1055"],
    [5, "Nutraxin", "Nutraxin Biotin Forte Tablet 60'lı", 499, "takviye", "", [], "nutraxin-biotin-forte-tablet-60-li-4059"],
    [6, "Nuxe", "Nuxe Huile Prodigieuse OR Altın Parıltılı Yüz Vücut Saçlar İçin Çok Amaçlı Kuru Yağ 50 ml", 999.95, "cilt", "vucut", [], "nuxe-huile-prodigieuse-or-altin-pariltili-yuz-vucut-saclar-icin-cok-amacli-kuru-yag-50-ml-3393"],
    [7, "Nuxe", "Nuxe Reve De Miel Lip Care 10 ml", 645, "cilt", "dudak", [], "nuxe-reve-de-miel-lip-care-10-ml-4114"],
    [8, "Nuxe", "Nuxe Huile Prodigieuse Çok Amaçlı Kuru Yağ 100 ml", 1299, "cilt", "vucut", [], "nuxe-huile-prodigieuse-cok-amacli-kuru-yag-100-ml-3144"],
    [9, "Nuxe", "Nuxe Super Serum 30 ml", 2624.99, "cilt", "serum", [], "nuxe-super-serum-30-ml-4077"],
    [10, "The Purest Solutions", "The Purest Solutions Hassas ve Kuru Ciltler İçin Nem ve Antioksidan İçerikli Temizleyici Balm 85 gr", 399, "cilt", "temizle", ["kuru"], ""],
    [11, "The Purest Solutions", "The Purest Solutions Oil Control Toner 2% BHA Salicylic Acid 200 ml", 399, "cilt", "tonik", ["yagli"], ""],
    [12, "The Purest Solutions", "The Purest Solutions Blemish Defense Antioksidan Destekli Lekeli Ciltler İçin Güneş Kremi SPF50+ 50 ml", 379, "gunes", "gunes", ["lekeli"], ""],
    [13, "The Purest Solutions", "The Purest Solutions Göz Altı Torbalanma ve Morluk Karşıtı Bakım Serumu 30 ml", 399, "cilt", "goz", [], ""],
    [14, "The Purest Solutions", "The Purest Solutions C Vit Aydınlatıcı ve Ton Eşitleyici Bakım Serumu 30 ml", 450, "cilt", "serum", ["lekeli"], ""],
    [15, "Bioxcin", "Bioxcin Acnium Sebum Dengeleyici Yüz Yıkama Jeli 200 ml", 495, "cilt", "temizle", ["yagli"], ""],
    [16, "Bioxcin", "Bioxcin Biotin 5000 mcg 30 Tablet", 398, "takviye", "", [], ""],
    [17, "Bioxcin", "Bioxcin Sun Care Melatone Krem SPF50 50 ml", 599, "gunes", "gunes", [], ""],
    [18, "Bioxcin", "Bioxcin Beauty Booster 60 Tablet", 899, "takviye", "", [], ""]
  ].map(function (a) {
    return { id: a[0], m: a[1], ad: a[2], f: a[3], k: a[4], adim: a[5], cilt: a[6], url: "https://www.favorinne.com/" + a[7], img: KOK + "img/u" + (a[0] < 10 ? "0" : "") + a[0] + ".webp" };
  });
  var KAT = { cilt: "Cilt bakımı", gunes: "Güneş koruma", takviye: "Vitamin ve takviye" };
  var ADIM = { temizle: "Temizleme", tonik: "Tonik", serum: "Serum", goz: "Göz çevresi", gunes: "Güneş koruma", dudak: "Dudak bakımı", vucut: "Vücut ve saç yağı" };
  var CILT = { kuru: "Kuru ve hassas", yagli: "Yağlı", lekeli: "Leke eğilimli" };
  var TAKVIYE_NOT = "Takviye edici gıdalar ilaç değildir; hastalıkların önlenmesi veya tedavi edilmesi amacıyla kullanılmaz.";

  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var tl = function (n) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL"; };
  var bul = function (id) { return U.filter(function (u) { return u.id === +id; })[0]; };
  var wa = function (t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); };
  var kisa = function (u) { return u.ad.length > 62 ? u.ad.slice(0, 60).replace(/\s+\S*$/, "") + "…" : u.ad; };
  var IK = {
    sepet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
    kapat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    wa: '<svg viewBox="0 0 24 24" class="dolu" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.9 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.300-3.800-4.400-3.900-.1-.2-1.100-1.400-1.100-2.700s.7-1.900.9-2.200c.2-.300.5-.300.700-.300h.5c.200 0 .400 0 .600.500l.800 2c.100.100.100.300 0 .400-.300.700-.700.900-.500 1.200.900 1.500 1.800 2.100 3.200 2.800.200.100.400.100.500-.100l.800-1c.200-.200.400-.200.600-.100l1.800.900c.200.100.400.200.400.300.100.100.100.600-.100 1.200z"/></svg>',
    tik: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    gonder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    sohbet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  };

  /* ---------- Sepet ---------- */
  var sepet = {};
  try { sepet = JSON.parse(localStorage.getItem("fn-sepet") || "{}") || {}; } catch (e) { sepet = {}; }
  function kaydet() { try { localStorage.setItem("fn-sepet", JSON.stringify(sepet)); } catch (e) {} }
  function adet() { return Object.keys(sepet).reduce(function (t, k) { return t + sepet[k]; }, 0); }
  function toplam() { return Object.keys(sepet).reduce(function (t, k) { var u = bul(k); return t + (u ? u.f * sepet[k] : 0); }, 0); }
  function ekle(id, n) { sepet[id] = (sepet[id] || 0) + (n || 1); if (sepet[id] <= 0) delete sepet[id]; kaydet(); sepetCiz(); }
  function bildir(m) { var t = $("#fn-bildir"); if (!t) return; t.textContent = m; t.classList.add("acik"); clearTimeout(bildir.z); bildir.z = setTimeout(function () { t.classList.remove("acik"); }, 2600); }
  function kargoSatiri(t) {
    var kalan = ESIK - t, yuzde = Math.min(100, Math.round(t / ESIK * 100));
    return '<div class="kargo-bar"><div class="kb-yazi">' + (t <= 0 ? "750 TL ve üzeri siparişte kargo bedava" : kalan > 0 ? "Kargo bedavaya <b>" + tl(kalan) + "</b> kaldı" : '<b class="yesil">Kargonuz bedava</b>') + '</div><div class="kb-cizgi"><i style="width:' + yuzde + '%"></i></div></div>';
  }
  function sepetCiz() {
    var n = adet(), t = toplam();
    $$("[data-sepet-adet]").forEach(function (e) { e.textContent = n; e.classList.toggle("bos", !n); });
    $$("[data-kargo-bar]").forEach(function (e) { e.innerHTML = kargoSatiri(t); });
    var g = $("#fn-sepet-govde"); if (!g) return;
    var ids = Object.keys(sepet);
    if (!ids.length) { g.innerHTML = '<p class="bos-not">Sepetiniz boş. Bir ürünün "Sepete ekle" düğmesine dokunun.</p>'; $("#fn-sepet-alt").innerHTML = ""; return; }
    g.innerHTML = kargoSatiri(t) + ids.map(function (k) {
      var u = bul(k); if (!u) return "";
      return '<div class="ss"><img src="' + u.img + '" alt="" width="56" height="84" loading="lazy"><div><b>' + esc(kisa(u)) + '</b><span>' + tl(u.f) + '</span><div class="adet"><button type="button" data-azalt="' + u.id + '" aria-label="Azalt">−</button><em>' + sepet[k] + '</em><button type="button" data-ekle="' + u.id + '" aria-label="Artır">+</button></div></div><strong>' + tl(u.f * sepet[k]) + '</strong></div>';
    }).join("");
    var mesaj = "Merhaba FavorinNe, sipariş vermek istiyorum:\n" + ids.map(function (k) { var u = bul(k); return "• " + sepet[k] + " x " + u.ad + " (" + tl(u.f) + ")"; }).join("\n") + "\nToplam: " + tl(t);
    $("#fn-sepet-alt").innerHTML = '<div class="st"><span>Ara toplam</span><b>' + tl(t) + '</b></div><div class="st kucuk"><span>Kargo</span><b>' + (t >= ESIK ? "Bedava" : "Ödeme adımında hesaplanır") + '</b></div><button type="button" class="dg dg-ana tam" data-odeme>Ödemeye geç</button><a class="dg dg-wa tam" target="_blank" rel="noopener" href="' + wa(mesaj) + '">' + IK.wa + ' WhatsApp\'tan sipariş ver</a>';
  }

  /* ---------- Ürün kartı ve ızgara ---------- */
  function kart(u, tip) {
    var et = u.k === "takviye" ? "Takviye edici gıda" : (ADIM[u.adim] || KAT[u.k]);
    if (tip === "satir") return '<article class="us" data-urun="' + u.id + '"><img src="' + u.img + '" alt="' + esc(u.ad) + '" width="72" height="108" loading="lazy"><div><small>' + esc(u.m) + ' · ' + et + '</small><b>' + esc(kisa(u)) + '</b><span class="fiyat">' + tl(u.f) + '</span></div><button type="button" class="arti" data-ekle="' + u.id + '" aria-label="Sepete ekle: ' + esc(u.ad) + '">+</button></article>';
    return '<article class="uk" data-urun="' + u.id + '"><div class="uk-g"><img src="' + u.img + '" alt="' + esc(u.ad) + '" width="347" height="520" loading="lazy"><span class="rozet">' + et + '</span></div><div class="uk-i"><small>' + esc(u.m) + '</small><h3>' + esc(kisa(u)) + '</h3><div class="uk-a"><span class="fiyat">' + tl(u.f) + '</span><button type="button" class="dg dg-ana kucuk" data-ekle="' + u.id + '">Sepete ekle</button></div></div></article>';
  }
  function izgara(sel, ayar) {
    var el = $(sel); if (!el) return; ayar = ayar || {};
    var d = { marka: "", kat: ayar.kat || "", ara: "", sira: "" };
    function ciz() {
      var L = U.filter(function (u) { return (!d.marka || u.m === d.marka) && (!d.kat || u.k === d.kat) && (!d.ara || (u.ad + " " + u.m).toLocaleLowerCase("tr").indexOf(d.ara) > -1) && (!ayar.sec || ayar.sec(u)); });
      if (d.sira === "artan") L.sort(function (a, b) { return a.f - b.f; }); if (d.sira === "azalan") L.sort(function (a, b) { return b.f - a.f; });
      if (ayar.limit) L = L.slice(0, ayar.limit);
      el.innerHTML = L.length ? L.map(function (u) { return kart(u, ayar.tip); }).join("") : '<p class="bos-not">Bu aramaya uyan ürün bulunamadı. Filtreyi temizleyip yeniden deneyin.</p>';
      var s = ayar.sayac && $(ayar.sayac); if (s) s.textContent = L.length + " ürün";
    }
    if (ayar.cubuk) {
      var c = $(ayar.cubuk), markalar = U.map(function (u) { return u.m; }).filter(function (m, i, a) { return a.indexOf(m) === i; });
      c.innerHTML = '<div class="cipler" role="group" aria-label="Kategori"><button type="button" class="cip secili" data-kat="">Tümü</button>' + Object.keys(KAT).map(function (k) { return '<button type="button" class="cip" data-kat="' + k + '">' + KAT[k] + '</button>'; }).join("") + '</div><div class="fs"><label class="gizli" for="fn-marka' + sel.length + '">Marka</label><select id="fn-marka' + sel.length + '" data-marka><option value="">Tüm markalar</option>' + markalar.map(function (m) { return "<option>" + m + "</option>"; }).join("") + '</select><label class="gizli" for="fn-sira' + sel.length + '">Sıralama</label><select id="fn-sira' + sel.length + '" data-sira><option value="">Önerilen sıra</option><option value="artan">Fiyat: düşükten yükseğe</option><option value="azalan">Fiyat: yüksekten düşüğe</option></select></div>';
      c.addEventListener("click", function (e) { var b = e.target.closest("[data-kat]"); if (!b) return; d.kat = b.dataset.kat; $$("[data-kat]", c).forEach(function (x) { x.classList.toggle("secili", x === b); }); ciz(); });
      c.addEventListener("change", function (e) { if (e.target.matches("[data-marka]")) d.marka = e.target.value; if (e.target.matches("[data-sira]")) d.sira = e.target.value; ciz(); });
    }
    if (ayar.arama) $$(ayar.arama).forEach(function (i) { i.addEventListener("input", function () { d.ara = i.value.trim().toLocaleLowerCase("tr"); ciz(); if (d.ara && ayar.kaydir) el.scrollIntoView({ behavior: "smooth", block: "start" }); }); });
    ciz(); return { kat: function (k) { d.kat = k; if (ayar.cubuk) $$("[data-kat]", $(ayar.cubuk)).forEach(function (x) { x.classList.toggle("secili", x.dataset.kat === k); }); ciz(); } };
  }

  /* ---------- Ürün penceresi (ayrıntı + üyeliksiz yorum) ---------- */
  var yorumlar = {};
  function urunAc(id) {
    var u = bul(id), p = $("#fn-urun"); if (!u || !p) return;
    var y = yorumlar[id] || [];
    $("#fn-urun-govde").innerHTML = '<div class="ud"><div class="ud-g"><img src="' + u.img + '" alt="' + esc(u.ad) + '" width="347" height="520"></div><div class="ud-i"><small>' + esc(u.m) + ' · ' + (u.k === "takviye" ? "Takviye edici gıda" : KAT[u.k]) + '</small><h2>' + esc(u.ad) + '</h2><div class="ud-f">' + tl(u.f) + '</div><ul class="tikli"><li>' + IK.tik + 'Orijinal ve faturalı ürün</li><li>' + IK.tik + '750 TL ve üzeri siparişte kargo bedava</li><li>' + IK.tik + '14 gün içinde cayma hakkı</li></ul>' + (u.k === "takviye" ? '<p class="uyari">' + TAKVIYE_NOT + '</p>' : "") + '<div class="ud-d"><button type="button" class="dg dg-ana" data-ekle="' + u.id + '">Sepete ekle</button><a class="dg dg-wa" target="_blank" rel="noopener" href="' + wa("Merhaba FavorinNe, şu ürün hakkında bilgi almak istiyorum: " + u.ad) + '">' + IK.wa + ' Stok ve fiyat sor</a></div></div></div><div class="yr"><h3>Müşteri yorumları</h3><div id="fn-yl">' + (y.length ? y.map(function (x) { return '<div class="yk"><b>' + esc(x.ad) + '</b> <span class="yz">' + "★★★★★".slice(0, x.p) + '</span><em>Onay bekliyor</em><p>' + esc(x.m) + '</p></div>'; }).join("") : '<p class="bos-not">Bu ürüne henüz yorum yazılmadı. İlk yorumu siz yazın.</p>') + '</div><form id="fn-yf" class="yf"><b>Üye olmadan yorum yazın</b><div class="yp" role="radiogroup" aria-label="Puan">' + [1, 2, 3, 4, 5].map(function (n) { return '<label><input type="radio" name="p" value="' + n + '"' + (n === 5 ? " checked" : "") + '><span>★</span><i class="gizli">' + n + ' yıldız</i></label>'; }).join("") + '</div><label class="gizli" for="fn-yad">Adınız</label><input id="fn-yad" name="ad" placeholder="Adınız" required maxlength="40"><label class="gizli" for="fn-ym">Yorumunuz</label><textarea id="fn-ym" name="m" placeholder="Ürünü nasıl buldunuz?" required maxlength="400" rows="3"></textarea><button class="dg dg-cizgi" type="submit">Yorumu gönder</button><small>Yorumlar onaydan sonra yayınlanır. Sipariş numarasıyla doğrulanan yorumlar "Satın aldı" etiketi alır.</small></form></div>';
    $("#fn-yf").addEventListener("submit", function (e) { e.preventDefault(); var f = e.target; (yorumlar[id] = yorumlar[id] || []).push({ ad: f.ad.value, p: +f.p.value, m: f.m.value }); urunAc(id); bildir("Yorumunuz alındı, onaydan sonra yayınlanır (örnek)"); });
    ac(p);
  }
  function ac(p) { p.classList.add("acik"); p.setAttribute("aria-hidden", "false"); document.documentElement.classList.add("kilit"); }
  function kapat() { $$(".fn-pencere.acik").forEach(function (p) { p.classList.remove("acik"); p.setAttribute("aria-hidden", "true"); }); document.documentElement.classList.remove("kilit"); }

  /* ---------- İhtiyaca göre ürün bulucu (yalnız kozmetik; ürün adındaki bilgiye göre) ---------- */
  function bulucu(sel) {
    var el = $(sel); if (!el) return; var d = { cilt: "", adim: "" };
    el.innerHTML = '<div class="bl-adim"><b><i>1</i> Cildiniz nasıl?</b><div class="cipler" data-grup="cilt"><button type="button" class="cip secili" data-d="">Fark etmez</button>' + Object.keys(CILT).map(function (k) { return '<button type="button" class="cip" data-d="' + k + '">' + CILT[k] + '</button>'; }).join("") + '</div></div><div class="bl-adim"><b><i>2</i> Hangi adımı arıyorsunuz?</b><div class="cipler" data-grup="adim"><button type="button" class="cip secili" data-d="">Hepsi</button>' + Object.keys(ADIM).map(function (k) { return '<button type="button" class="cip" data-d="' + k + '">' + ADIM[k] + '</button>'; }).join("") + '</div></div><div class="bl-sonuc"><div class="bl-bas"><b id="fn-bl-say"></b><span>Eşleşme ürün adında yazan bilgiye göre yapılır; tıbbi tavsiye değildir.</span></div><div class="bl-liste" id="fn-bl-liste"></div></div>';
    function ciz() {
      var L = U.filter(function (u) { return u.k !== "takviye" && (!d.adim || u.adim === d.adim) && (!d.cilt || !u.cilt.length || u.cilt.indexOf(d.cilt) > -1); });
      L.sort(function (a, b) { return (b.cilt.indexOf(d.cilt) > -1) - (a.cilt.indexOf(d.cilt) > -1); });
      $("#fn-bl-say").textContent = L.length ? L.length + " ürün uyuyor" : "Uyan ürün yok";
      var hepsi = el.dataset.hepsi === "1" || L.length <= 4;
      $("#fn-bl-liste").innerHTML = L.length ? L.slice(0, hepsi ? 99 : 4).map(function (u) { return kart(u, "satir"); }).join("") + (hepsi ? "" : '<button type="button" class="dg dg-cizgi kucuk bl-tum" data-bl-tum>Tümünü göster (' + L.length + ')</button>') : '<p class="bos-not">Bu seçime uyan ürün örnek listede yok. Seçimi genişletin ya da WhatsApp\'tan sorun.</p>';
    }
    el.addEventListener("click", function (e) { if (e.target.closest("[data-bl-tum]")) { el.dataset.hepsi = "1"; return ciz(); } var b = e.target.closest("[data-d]"); if (!b) return; el.dataset.hepsi = ""; var g = b.parentNode; d[g.dataset.grup] = b.dataset.d; $$(".cip", g).forEach(function (x) { x.classList.toggle("secili", x === b); }); ciz(); });
    ciz();
  }

  /* ---------- Bakım rutini kurucu ---------- */
  function rutin(sel) {
    var el = $(sel); if (!el) return; var zaman = "sabah", sec = {};
    var AD = [["temizle", "Temizle"], ["tonik", "Tonikle"], ["serum", "Serum sür"], ["goz", "Göz çevresi"], ["gunes", "Güneşten korun"]];
    function ciz() {
      var adimlar = AD.filter(function (a) { return zaman === "sabah" || a[0] !== "gunes"; }), t = 0, n = 0;
      el.innerHTML = '<div class="rt-sek" role="tablist"><button type="button" role="tab" class="' + (zaman === "sabah" ? "secili" : "") + '" data-z="sabah">Sabah rutini</button><button type="button" role="tab" class="' + (zaman === "aksam" ? "secili" : "") + '" data-z="aksam">Akşam rutini</button></div><ol class="rt-liste">' + adimlar.map(function (a, i) {
        var L = U.filter(function (u) { return u.adim === a[0]; }), s = sec[a[0]];
        if (s) { t += bul(s).f; n++; }
        return '<li><div class="rt-no">' + (i + 1) + '</div><div class="rt-ic"><b>' + a[1] + '</b><div class="rt-sec">' + L.map(function (u) { return '<button type="button" class="rt-u' + (s === u.id ? " secili" : "") + '" data-a="' + a[0] + '" data-u="' + u.id + '"><img src="' + u.img + '" alt="" width="44" height="66" loading="lazy"><span>' + esc(u.m) + '<em>' + tl(u.f) + '</em></span></button>'; }).join("") + '</div></div></li>';
      }).join("") + '</ol><div class="rt-alt"><div><small>' + n + ' adım seçildi</small><b>' + tl(t) + '</b></div><button type="button" class="dg dg-ana" data-rutin-ekle' + (n ? "" : " disabled") + '>Rutini sepete ekle</button></div>';
    }
    el.addEventListener("click", function (e) {
      var z = e.target.closest("[data-z]"), u = e.target.closest("[data-u]");
      if (z) { zaman = z.dataset.z; if (zaman === "aksam") delete sec.gunes; ciz(); }
      else if (u) { var a = u.dataset.a, id = +u.dataset.u; if (sec[a] === id) delete sec[a]; else sec[a] = id; ciz(); }
      else if (e.target.closest("[data-rutin-ekle]")) { Object.keys(sec).forEach(function (a) { ekle(sec[a], 1); }); bildir("Rutin sepete eklendi"); sepetAc(); }
    });
    ciz();
  }

  /* ---------- Sipariş asistanı (kural tabanlı; sağlık sorusunda öneri vermez) ---------- */
  var SORU = [
    ["kargo", "Kargom ne zaman gelir?", "Siparişiniz ödeme onayından sonra genellikle aynı gün kargoya verilir, teslimat çoğunlukla 1-3 iş günü sürer. 750 TL ve üzeri siparişlerde kargo bedavadır. Takip numarası size iletilir."],
    ["takip", "Siparişimi nasıl takip ederim?", "Kargoya verildiğinde takip numaranız size iletilir. Sipariş numaranızı buraya yazarsanız ekibimiz mesai saatinde (hafta içi 08:00-17:30) durumunu bildirir."],
    ["iade", "İade ve değişim nasıl?", "Teslimattan sonra 14 gün içinde cayma hakkınız var. Ambalajı açılmamış ürünü faturasıyla geri gönderebilirsiniz. Ayrıntı İptal ve İade sayfasında."],
    ["orijinal", "Ürünler orijinal mi?", "Tüm ürünler orijinal ve faturalıdır. Son kullanma tarihi ve barkod, ürün sayfasında yazar."],
    ["odeme", "Hangi ödeme seçenekleri var?", "Ödeme seçenekleri sepetten sonraki ödeme adımında görünür. Üye olmadan da alışveriş yapabilirsiniz."],
    ["saglik", "Bu ürünü kullanabilir miyim?", null]
  ];
  function asistan(sel) {
    var el = $(sel); if (!el) return;
    el.innerHTML = '<div class="as-akis" id="fn-as-akis" aria-live="polite"></div><div class="as-hazir" id="fn-as-hazir">' + SORU.map(function (s) { return '<button type="button" class="cip" data-s="' + s[0] + '">' + s[1] + '</button>'; }).join("") + '</div><form class="as-form" id="fn-as-form"><label class="gizli" for="fn-as-g">Sorunuz</label><input id="fn-as-g" placeholder="Sorunuzu yazın" autocomplete="off" maxlength="200"><button type="submit" aria-label="Gönder">' + IK.gonder + '</button></form>';
    var akis = $("#fn-as-akis");
    function yaz(kim, h) { var d = document.createElement("div"); d.className = "as-m " + kim; d.innerHTML = h; akis.appendChild(d); akis.scrollTop = akis.scrollHeight; }
    function saglik() { yaz("bot", 'Kullanım, doz ve sağlıkla ilgili sorularda öneri veremem. İsterseniz ekibimiz sizi arasın; sağlık sorularınız için hekiminize ya da eczacınıza danışın.<form class="as-ara"><label class="gizli" for="fn-as-t">Telefon</label><input id="fn-as-t" type="tel" inputmode="tel" placeholder="Telefon numaranız" required pattern="[0-9 ()+]{10,17}"><button class="dg dg-ana kucuk" type="submit">Beni arayın</button></form>'); }
    function cevapla(k) { var s = SORU.filter(function (x) { return x[0] === k; })[0]; setTimeout(function () { if (k === "saglik") saglik(); else if (s) yaz("bot", s[2]); }, 350); }
    yaz("bot", "Merhaba, FavorinNe sipariş asistanıyım. Kargo, iade, ödeme ve sipariş takibi sorularınızı günün her saatinde cevaplarım.");
    el.addEventListener("click", function (e) { var b = e.target.closest("[data-s]"); if (!b) return; yaz("ben", esc(b.textContent)); cevapla(b.dataset.s); });
    el.addEventListener("submit", function (e) {
      e.preventDefault();
      if (e.target.classList.contains("as-ara")) { e.target.outerHTML = '<p class="as-ok">' + IK.tik + ' Kaydınız alındı. Ekibimiz mesai saatinde sizi arayacak (örnek çalışma: kayıt gönderilmedi).</p>'; return; }
      var g = $("#fn-as-g"), t = g.value.trim(); if (!t) return; yaz("ben", esc(t)); g.value = "";
      var k = t.toLocaleLowerCase("tr");
      if (/ilaç|ilac|reçete|recete|antibiyotik/.test(k)) return setTimeout(function () { yaz("bot", "Sitemizde ilaç satışı yapılmaz ve ilaç hakkında bilgi veremem. Bu konuda hekiminize ya da eczacınıza danışın."); }, 350);
      if (/kullan|doz|hamile|gebe|emzir|bebe|çocu|alerj|yan etki|hastal|tedavi|iyi gelir|içebilir|sürebilir|zarar/.test(k)) return cevapla("saglik");
      if (/takip|nerede|sipariş no|numara/.test(k)) return cevapla("takip");
      if (/kargo|teslim|ne zaman|kaç gün/.test(k)) return cevapla("kargo");
      if (/iade|değişim|cayma|geri/.test(k)) return cevapla("iade");
      if (/orijinal|sahte|fatura|miad|son kullanma/.test(k)) return cevapla("orijinal");
      if (/ödeme|taksit|kart|kapıda|havale/.test(k)) return cevapla("odeme");
      setTimeout(function () { yaz("bot", 'Bu soruyu ekibimize aktarayım. Mesai saatinde (hafta içi 08:00-17:30) dönüş yapılır. Beklemeden yazmak isterseniz: <a target="_blank" rel="noopener" href="' + wa("Merhaba FavorinNe, bir sorum var: " + t) + '">WhatsApp\'tan yazın</a>.'); }, 350);
    });
  }

  /* ---------- Aynı gün kargo sayacı (örnek kesim saati) ---------- */
  function sayac(sel) {
    $$(sel).forEach(function (el) {
      function ciz() {
        var s = new Date(), g = s.getDay(), k = new Date(s); k.setHours(15, 0, 0, 0);
        if (g === 0 || g === 6 || s >= k) { el.innerHTML = "Bugün verilen siparişler <b>ilk iş günü</b> kargoya verilir"; return; }
        var dk = Math.floor((k - s) / 60000);
        el.innerHTML = "<b>" + Math.floor(dk / 60) + " sa " + (dk % 60) + " dk</b> içinde sipariş verin, bugün kargoda";
      }
      ciz(); setInterval(ciz, 30000);
    });
  }

  /* ---------- Ortak pencereler ---------- */
  function sepetAc() { var p = $("#fn-sepet"); if (p) ac(p); }
  function asistanAc() { var p = $("#fn-asistan"); if (p) ac(p); }
  function kur(ayar) {
    ayar = ayar || {};
    var d = document.createElement("div");
    d.innerHTML = '<div class="fn-pencere yan" id="fn-sepet" role="dialog" aria-modal="true" aria-label="Sepet" aria-hidden="true"><div class="fp-perde" data-kapat></div><div class="fp-kutu"><header><b>Sepetim</b><button type="button" data-kapat aria-label="Kapat">' + IK.kapat + '</button></header><div class="fp-govde" id="fn-sepet-govde"></div><footer id="fn-sepet-alt"></footer></div></div>' +
      '<div class="fn-pencere orta" id="fn-urun" role="dialog" aria-modal="true" aria-label="Ürün ayrıntısı" aria-hidden="true"><div class="fp-perde" data-kapat></div><div class="fp-kutu"><header><b>Ürün ayrıntısı</b><button type="button" data-kapat aria-label="Kapat">' + IK.kapat + '</button></header><div class="fp-govde" id="fn-urun-govde"></div></div></div>' +
      '<div class="fn-pencere yan" id="fn-asistan" role="dialog" aria-modal="true" aria-label="Sipariş asistanı" aria-hidden="true"><div class="fp-perde" data-kapat></div><div class="fp-kutu"><header><b>Sipariş asistanı</b><button type="button" data-kapat aria-label="Kapat">' + IK.kapat + '</button></header><div class="fp-govde as" id="fn-asistan-govde"></div></div></div>' +
      '<div id="fn-bildir" role="status"></div>' + (ayar.dugme === false ? "" : '<button type="button" class="as-dugme" data-asistan aria-label="Sipariş asistanını aç">' + IK.sohbet + '<span>Sorunuz mu var?</span></button>');
    document.body.appendChild(d);
    asistan("#fn-asistan-govde");
    document.addEventListener("click", function (e) {
      var t = e.target, b;
      if ((b = t.closest("[data-ekle]"))) { ekle(b.dataset.ekle, 1); if (!b.closest("#fn-sepet")) bildir("Sepete eklendi"); return; }
      if ((b = t.closest("[data-azalt]"))) { ekle(b.dataset.azalt, -1); return; }
      if (t.closest("[data-kapat]")) return kapat();
      if (t.closest("[data-sepet-ac]")) { kapat(); return sepetAc(); }
      if (t.closest("[data-asistan]")) { kapat(); return asistanAc(); }
      if (t.closest("[data-odeme]")) return bildir("Örnek çalışma: gerçek sitede ödeme adımına geçilir");
      if ((b = t.closest("[data-urun]")) && !t.closest("button,a")) return urunAc(b.dataset.urun);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") kapat(); });
    sepetCiz();
  }

  window.FN = { U: U, KAT: KAT, kur: kur, izgara: izgara, bulucu: bulucu, rutin: rutin, asistan: asistan, sayac: sayac, kart: kart, tl: tl, wa: wa, sepetAc: sepetAc, asistanAc: asistanAc, urunAc: urunAc, IK: IK, TAKVIYE_NOT: TAKVIYE_NOT };
})();
