/* Dijitabela prototip motoru — ortak çalışan araçlar (11 Kas 2026). Ayarlar sayfadaki window.PV'den gelir.
   Sihirbaz · Talep formu → WhatsApp · Araç (randevu/bakım/kredi/hacim/kaçak) · Vitrin süzgeci · Bölge kontrolü/harita · Açık/kapalı */
(function () {
  "use strict";
  var PV = window.PV || {};
  var WA = PV.wa, AD = PV.ad || "", IMG = document.body.getAttribute("data-img") || "../img/";
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function wa(m) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(m); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function waDugme(m, yazi) { return '<a class="dg wa" href="' + wa(m) + '" target="_blank" rel="noopener">' + yazi + "</a>"; }
  function bicim(s, o) { return String(s).replace(/\{(\w+)\}/g, function (a, k) { return o[k] != null ? o[k] : a; }); }

  /* ---------- Çalışma saatleri ---------- */
  var SAAT = PV.saat; // {0:[9,17] | null, ...}
  function acikMi() {
    var n = new Date(), s = SAAT && SAAT[n.getDay()], h = n.getHours() + n.getMinutes() / 60;
    return { acik: !!s && h >= s[0] && h < s[1], s: s };
  }
  function ss(h) { var d = Math.floor(h), m = Math.round((h - d) * 60); return (d % 24 < 10 ? "0" : "") + (d % 24) + ":" + (m < 10 ? "0" : "") + m; }
  $$("[data-acik]").forEach(function (el) {
    if (!SAAT) { el.classList.add("is-acik"); el.innerHTML = "<i></i>WhatsApp'tan her zaman yazabilirsiniz"; return; }
    var d = acikMi();
    el.classList.add(d.acik ? "is-acik" : "is-kapali");
    el.innerHTML = "<i></i>" + (d.acik ? (d.s[1] >= 24 ? "Şu an açık · 24 saat" : "Şu an açık · " + ss(d.s[1]) + "'a kadar") : "Şu an kapalı · WhatsApp'tan yazın");
  });
  var gun = new Date().getDay();
  $$("[data-gun]").forEach(function (el) { if (+el.getAttribute("data-gun") === gun) el.classList.add("bugun"); });

  /* ---------- Sihirbaz (kategori → seçenek → sonuç) ---------- */
  var SIH = PV.sih || {}, VERI = SIH.veri || {};
  var sih = $("[data-sihirbaz]");
  if (sih) {
    var secC = null, secB = null;
    var cKutu = $(".s-cihaz", sih), bKutu = $(".s-belirti", sih), sonuc = $(".s-sonuc", sih);
    cKutu.innerHTML = Object.keys(VERI).map(function (k) { return '<button type="button" class="cip" data-c="' + k + '">' + esc(VERI[k].ad) + "</button>"; }).join("");
    var ciz = function () {
      $$(".cip", cKutu).forEach(function (b) { b.classList.toggle("sec", b.getAttribute("data-c") === secC); });
      if (!secC) { bKutu.innerHTML = '<p class="ipucu">Önce ' + esc((SIH.adim1 || "kategori").toLocaleLowerCase("tr")) + " seçin.</p>"; sonuc.innerHTML = ""; return; }
      bKutu.innerHTML = VERI[secC].secenek.map(function (b, i) { return '<button type="button" class="cip' + (i === secB ? " sec" : "") + '" data-b="' + i + '">' + esc(b[0]) + "</button>"; }).join("");
      if (secB == null) { sonuc.innerHTML = '<p class="ipucu">Şimdi seçin.</p>'; return; }
      var b = VERI[secC].secenek[secB], et = SIH.etiketler || ["", "", ""];
      var m = bicim(SIH.wa || "Merhaba {ad}, {kategori} için yazıyorum.\n{secenek}", { ad: AD, kategori: VERI[secC].ad.toLocaleLowerCase("tr"), secenek: b[0] });
      sonuc.innerHTML = '<div class="s-kart"><img src="' + IMG + b[4] + '" alt="' + esc(b[0]) + '" loading="lazy"><div class="s-yazi">' +
        '<p class="s-et">' + et[0] + "</p><p>" + esc(b[1]) + "</p>" + '<p class="s-et">' + et[1] + "</p><p>" + esc(b[2]) + "</p>" +
        '<p class="s-et">' + et[2] + "</p><p>" + esc(b[3]) + "</p>" + waDugme(m, esc(SIH.dugme || "WhatsApp'tan gönder")) +
        '<p class="not">' + esc(SIH.not || "") + "</p></div></div>";
      var f = $("#talep"); if (f) { var a = $("[name=not]", f); if (a && !a.value) a.value = VERI[secC].ad + ": " + b[0]; }
    };
    sih.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-c")) { secC = t.getAttribute("data-c"); secB = null; ciz(); }
      if (t.hasAttribute("data-b")) { secB = +t.getAttribute("data-b"); ciz(); }
    });
    ciz();
    $$("[data-hizli]").forEach(function (a) { a.addEventListener("click", function () { var b = $('[data-c="' + a.getAttribute("data-hizli") + '"]'); if (b) b.click(); }); });
  }

  /* ---------- Talep formu → WhatsApp ---------- */
  var form = $("#talep");
  if (form) {
    var tarih = $("[name=gun]", form);
    if (tarih) { var d0 = new Date(); tarih.min = d0.toISOString().slice(0, 10); tarih.value = d0.toISOString().slice(0, 10); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { var x = form.elements[n]; return x ? String(x.value || "").trim() : ""; };
      if (!v("ad") || !v("tel")) { var u = $(".f-uyari", form); if (u) u.textContent = "Adınızı ve telefonunuzu yazın, size dönelim."; return; }
      var satir = ["Merhaba " + AD + ", web sitenizden " + (v("tur") || PV.formBas || "talep") + ":", "Ad: " + v("ad"), "Telefon: " + v("tel")];
      (PV.formAlan || []).forEach(function (a) { if (v(a[0])) satir.push(a[1] + ": " + v(a[0])); });
      if (v("gun")) satir.push("Tarih: " + new Date(v("gun") + "T12:00").toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) + (v("dilim") ? " · " + v("dilim") : ""));
      var m = satir.join("\n"), ok = $(".f-ok", form);
      if (ok) ok.innerHTML = 'Mesajınız hazır, WhatsApp açılıyor… Açılmazsa <a href="' + wa(m) + '" target="_blank" rel="noopener">buraya dokunun</a>.';
      window.open(wa(m), "_blank");
    });
  }

  /* ---------- Araçlar ---------- */
  var A = PV.arac || {}, kutu = $("[data-arac]");
  var TL = function (x) { return Math.round(x).toLocaleString("tr-TR") + " TL"; };
  if (kutu && A.tur === "bakim") {
    var hb = function () {
      var adet = +$("[name=adet]", kutu).value, son = $("[name=son]", kutu).value, kul = $("[name=kul]", kutu).value, cihaz = $("[name=cihaz]", kutu).value;
      var simdi = new Date(), gecik = son === "hic" || son === "2" ? "kirmizi" : son === "1" ? "sari" : "yesil";
      var hedef = cihaz === "kombi" ? [8] : (kul === "yaz" ? [3] : kul === "pansiyon" ? [2, 5, 9] : [3, 9]), sonraki = null;
      for (var y = 0; y < 2 && !sonraki; y++) hedef.forEach(function (h) { var t = new Date(simdi.getFullYear() + y, h, 15); if (!sonraki && t > simdi) sonraki = t; });
      if (gecik === "kirmizi") sonraki = new Date(simdi.getTime() + 7 * 864e5);
      if (gecik === "sari") sonraki = new Date(simdi.getTime() + 21 * 864e5);
      var ad = { yesil: "Bakımınız güncel", sari: "Bakım zamanı yaklaştı", kirmizi: "Bakım gecikmiş" }[gecik];
      var txt = cihaz === "kombi" ? "Kombide yılda bir bakım önerilir; en uygun zaman ısıtma sezonundan önce, yaz sonu ve sonbahar başıdır." :
        { yaz: "Yalnız yazın kullanılan klimada yılda 1 bakım (soğutma sezonundan önce) yeterli.", ikisi: "Yaz-kış kullanılan klimada yılda 2 bakım: bahar ve sonbahar.", pansiyon: "Kiraya verilen daire ve apartlarda sezon öncesi, ortası ve sonu olmak üzere yılda 3 bakım önerilir." }[kul];
      var m = "Merhaba " + AD + ", " + adet + " adet " + (cihaz === "kombi" ? "kombi" : "klima") + " için bakım randevusu almak istiyorum.\nSon bakım: " + $("[name=son] option:checked", kutu).textContent + "\nAdres (mahalle): ";
      $(".b-sonuc", kutu).innerHTML = '<div class="b-durum ' + gecik + '"><b>' + ad + "</b><span>Önerilen bakım: " + sonraki.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) + "</span></div><p>" + txt + "</p>" + waDugme(m, "Bu tarihe bakım randevusu iste");
    };
    kutu.addEventListener("change", hb); hb();
  }
  if (kutu && A.tur === "kredi") {
    var hk = function () {
      var P = +$("[name=tutar]", kutu).value || 0, pes = +$("[name=pesin]", kutu).value || 0, n = +$("[name=vade]", kutu).value || 1, r = (+$("[name=faiz]", kutu).value || 0) / 100;
      var K = Math.max(P - pes, 0), t = r ? K * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : K / n;
      var m = "Merhaba " + AD + ", " + TL(P) + " civarı bir " + (A.nesne || "konut") + " için kredi ve uygun seçenekler hakkında bilgi almak istiyorum.\nPeşinat: " + TL(pes) + "\nVade: " + n + " ay";
      $(".b-sonuc", kutu).innerHTML = '<div class="b-durum yesil"><b>Aylık taksit ≈ ' + TL(t) + "</b><span>Kredi tutarı " + TL(K) + "</span></div><p>Toplam geri ödeme ≈ " + TL(t * n) + ". " + esc(A.faiz_not || "") + "</p>" + waDugme(m, "Bu bütçeye uygun seçenekleri sor");
    };
    kutu.addEventListener("input", hk); hk();
  }
  if (kutu && A.tur === "hacim") {
    var hh = function () {
      var o = $("[name=oda]", kutu).value, y = $("[name=yog]", kutu).value, kat = $("[name=kat]", kutu).value;
      var m3 = Math.round((A.oda[o] || 20) * (A.yogunluk[y] || 1)), arac = (A.araclar || []).filter(function (a) { return m3 <= a[0]; })[0] || ["", "Büyük araç"];
      var ekip = m3 <= 15 ? 2 : m3 <= 30 ? 3 : m3 <= 45 ? 4 : 5;
      var m = "Merhaba " + AD + ", taşınma için fiyat almak istiyorum.\nEv: " + o + " (" + y.toLocaleLowerCase("tr") + ")\nTahmini hacim: ~" + m3 + " m³\nBina: " + kat + "\nNereden: \nNereye: \nTarih: ";
      $(".b-sonuc", kutu).innerHTML = '<div class="b-durum sari"><b>~' + m3 + " m³ eşya</b><span>" + arac[1] + " · " + ekip + " kişilik ekip</span></div><p>Kaba tahmindir; kesin hacim ve fiyat ücretsiz keşifte ya da eşya fotoğraflarından çıkarılır." + (/yok/.test(kat) ? " Asansörsüz binada " + (/4\+/.test(kat) ? "dış cephe asansörü gerekebilir." : "merdiven taşıması plana eklenir.") : "") + "</p>" + waDugme(m, "Bu bilgilerle fiyat iste");
    };
    kutu.addEventListener("change", hh); hh();
  }
  if (kutu && A.tur === "kacak") {
    var adim = 0, ad = A.adimlar || [];
    var ck = function () {
      var o = $(".k-adim", kutu);
      if (adim < ad.length) {
        o.innerHTML = '<div class="b-durum sari"><b>Adım ' + (adim + 1) + " / " + ad.length + "</b><span>" + esc(ad[adim][0]) + "</span></div><p>" + esc(ad[adim][1]) + '</p><button type="button" class="dg koyu" data-ileri>Yaptım, devam</button>';
      } else {
        o.innerHTML = '<p class="s-et">SONUÇ: SAYAÇ NE DURUMDA?</p><div class="cipler-s"><button type="button" class="cip" data-son="donuyor">Çark döndü / rakam arttı</button><button type="button" class="cip" data-son="durgun">Hiç değişmedi</button></div><div class="k-son"></div>';
      }
    };
    kutu.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-ileri")) { adim++; ck(); }
      if (t.hasAttribute("data-son")) {
        var s = t.getAttribute("data-son"), don = s === "donuyor";
        $$(".cip", kutu).forEach(function (x) { x.classList.toggle("sec", x === t); });
        $(".k-son", kutu).innerHTML = '<div class="b-durum ' + (don ? "kirmizi" : "yesil") + '"><b>' + (don ? "Gizli kaçak olası" : "Görünür kaçak yok") + "</b></div><p>" + esc((A.sonuclar || {})[s] || "") + "</p>" +
          waDugme("Merhaba " + AD + ", sayaç testini yaptım: " + (don ? "musluklar kapalıyken sayaç dönüyor." : "sayaç durgun ama rutubet/leke var.") + "\nAdres (mahalle): ", don ? "Kaçak tespiti için ustaya yaz" : "Yine de ustaya danış");
      }
      if (t.hasAttribute("data-bastan")) { adim = 0; ck(); }
    });
    ck();
  }
  if (kutu && A.tur === "randevu") {
    var secG = null, secS = null, sure = (A.sure_dk || 30) / 60;
    var gunler = []; for (var i = 0; i < 10 && gunler.length < 6; i++) { var g = new Date(); g.setDate(g.getDate() + i); var s0 = SAAT && SAAT[g.getDay()]; if (!SAAT || s0) gunler.push(g); }
    var rc = function () {
      var gk = $(".r-gun", kutu), sk = $(".r-saat", kutu), so = $(".b-sonuc", kutu);
      gk.innerHTML = gunler.map(function (g, i) { return '<button type="button" class="cip' + (i === secG ? " sec" : "") + '" data-rg="' + i + '">' + g.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric", month: "short" }) + "</button>"; }).join("");
      if (secG == null) { sk.innerHTML = '<p class="ipucu">Önce gün seçin.</p>'; so.innerHTML = ""; return; }
      var g = gunler[secG], ar = SAAT ? SAAT[g.getDay()] : [9, 18], L = [], simdi = new Date();
      for (var h = ar[0]; h + sure <= Math.min(ar[1], 24); h += 0.5) {
        if (h >= 12.5 && h < 13.5) continue;
        if (g.toDateString() === simdi.toDateString() && h <= simdi.getHours() + simdi.getMinutes() / 60 + 1) continue;
        L.push(h);
      }
      sk.innerHTML = L.length ? L.map(function (h) { var dolu = ((h * 7 + g.getDate()) % 5) === 0; return '<button type="button" class="cip' + (h === secS ? " sec" : "") + '" ' + (dolu ? "disabled title=\"Dolu (örnek)\"" : 'data-rs="' + h + '"') + ">" + ss(h) + "</button>"; }).join("") : '<p class="ipucu">Bu gün için boş saat kalmadı, başka gün seçin.</p>';
      if (secS == null) { so.innerHTML = '<p class="ipucu">Şimdi saat seçin. Soluk saatler dolu (örnek).</p>'; return; }
      var t = g.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) + " · " + ss(secS);
      so.innerHTML = '<div class="b-durum yesil"><b>' + t + "</b><span>Talebiniz kliniğe gider, onay mesajı gelir</span></div>" + waDugme("Merhaba " + AD + ", " + t + " için randevu almak istiyorum.\nAdım soyadım: \nŞikâyet / tedavi: ", "Bu saate randevu iste");
    };
    kutu.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t || t.disabled) return;
      if (t.hasAttribute("data-rg")) { secG = +t.getAttribute("data-rg"); secS = null; rc(); }
      if (t.hasAttribute("data-rs")) { secS = +t.getAttribute("data-rs"); rc(); }
    });
    rc();
  }

  /* ---------- Vitrin süzgeci (emlak/galeri) ---------- */
  $$("[data-vitrin]").forEach(function (v) {
    v.addEventListener("click", function (e) {
      var t = e.target.closest("[data-suz]"); if (!t) return;
      var s = t.getAttribute("data-suz");
      $$("[data-suz]", v).forEach(function (x) { x.classList.toggle("sec", x === t); });
      $$("[data-tip]", v).forEach(function (k) { k.hidden = s !== "hepsi" && k.getAttribute("data-tip") !== s; });
    });
  });

  /* ---------- Bölge kontrolü ---------- */
  var BOLGE = (PV.bolgeler || []).map(function (b) { return String(b[0]).toLocaleLowerCase("tr"); }).concat([String(PV.ilce || "").toLocaleLowerCase("tr")]);
  var bk = $("[data-bolge]");
  if (bk) {
    var inp = $("input", bk), out = $(".bk-sonuc", bk);
    inp.addEventListener("input", function () {
      var q = inp.value.trim().toLocaleLowerCase("tr");
      if (q.length < 3) { out.textContent = ""; out.className = "bk-sonuc"; return; }
      var var_ = BOLGE.some(function (b) { return b && (b.indexOf(q) === 0 || q.indexOf(b) === 0); });
      out.className = "bk-sonuc " + (var_ ? "evet" : "sor");
      out.innerHTML = var_ ? "Evet, " + esc(inp.value.trim()) + " hizmet bölgemizde. <a href='" + wa("Merhaba, " + inp.value.trim() + " bölgesinden yazıyorum.") + "' target='_blank' rel='noopener'>Yazın →</a>"
        : "Listede yok ama yine de sorun; uygunsa geliyoruz. <a href='" + wa("Merhaba, " + inp.value.trim() + " bölgesine geliyor musunuz?") + "' target='_blank' rel='noopener'>Sor →</a>";
    });
  }

  /* ---------- Görününce belir / sayaç / ışık kutusu ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("gorundu"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(".gor").forEach(function (el) { io.observe(el); });
  } else { $$(".gor").forEach(function (el) { el.classList.add("gorundu"); }); }
  $$("[data-say]").forEach(function (el) {
    var hedef = parseFloat(el.getAttribute("data-say")), ondalik = el.getAttribute("data-say").indexOf(".") > -1, bas = null;
    var f = function (t) { if (!bas) bas = t; var k = Math.min(1, (t - bas) / 1400); k = 1 - Math.pow(1 - k, 3); var v = hedef * k; el.textContent = ondalik ? v.toFixed(1).replace(".", ",") : Math.round(v); if (k < 1) requestAnimationFrame(f); };
    if ("IntersectionObserver" in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { requestAnimationFrame(f); o.disconnect(); } }); o.observe(el); }
  });
  var lb = document.createElement("div"); lb.className = "lb"; lb.innerHTML = '<button type="button" aria-label="Kapat">×</button><img alt=""><p></p>'; document.body.appendChild(lb);
  lb.addEventListener("click", function (e) { if (e.target.tagName !== "IMG") lb.classList.remove("ac"); });
  $$("[data-lb]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); $("img", lb).src = a.getAttribute("href"); $("p", lb).textContent = a.getAttribute("data-lb"); lb.classList.add("ac"); }); });

  /* ---------- Hizmet bölgesi haritası ---------- */
  var hz = $("#bolge-harita");
  if (hz && window.L && PV.konum) {
    var mp = L.map(hz, { scrollWheelZoom: false }).setView(PV.konum, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(mp);
    L.circle(PV.konum, { radius: PV.yaricap || 9000, color: PV.renk || "#d7141a", weight: 1.5, fillOpacity: .06 }).addTo(mp);
    (PV.bolgeler || []).slice(0, 12).forEach(function (b) { L.circleMarker([b[1], b[2]], { radius: 5, color: "#141414", weight: 2, fillColor: "#fff", fillOpacity: 1 }).addTo(mp).bindTooltip(b[0], { direction: "right", offset: [6, 0] }); });
    L.circleMarker(PV.konum, { radius: 10, color: "#fff", weight: 3, fillColor: PV.renk || "#d7141a", fillOpacity: 1 }).addTo(mp).bindTooltip(AD, { permanent: true, direction: "top", offset: [0, -10] });
  }

  /* ---------- Sekmeler (uygulama tasarımı) ---------- */
  $$("[data-sekme]").forEach(function (grup) {
    grup.addEventListener("click", function (e) {
      var t = e.target.closest("[data-hedef]"); if (!t) return;
      var h = t.getAttribute("data-hedef");
      $$("[data-hedef]", grup).forEach(function (x) { x.classList.toggle("sec", x === t); });
      $$("[data-panel]").forEach(function (p) { if (p.getAttribute("data-grup") === grup.getAttribute("data-sekme")) p.hidden = p.getAttribute("data-panel") !== h; });
    });
  });
})();
