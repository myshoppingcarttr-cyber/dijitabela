// Hakan Çiçekçilik · müşteri takip paneli (taslak). Veriler bu cihazda (localStorage "hc-panel"); canlı sürümde Dijitabela veritabanına bağlanır.
// Fırsat Köşesi ürünleri "hc-firsat" anahtarına yazılır; aynı adresteki site (../1-zarif/ vb.) bunları anında gösterir.
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  var BUGUN = new Date(); BUGUN.setHours(0, 0, 0, 0);
  var gunEkle = function (n) { var d = new Date(BUGUN); d.setDate(d.getDate() + n); return d; };
  var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  var tl = function (n) { return (+n || 0).toLocaleString("tr-TR") + " TL"; };
  var waNo = function (t) { var d = String(t).replace(/\D/g, ""); return d.startsWith("90") ? d : "90" + d.replace(/^0/, ""); };
  var SITE = location.href.replace(/panel\/.*$/, "1-zarif/");

  // ---------- Örnek veri ----------
  function ornek() {
    var yil = BUGUN.getFullYear();
    var gun = function (n) { var d = gunEkle(n); return (yil - 30) + iso(d).slice(4); };
    return {
      musteriler: [
        { id: 1, ad: "Ayşe Yılmaz (örnek)", tel: "05320000001", izin: true, gunler: [{ tur: "Eşinin doğum günü", gun: gun(2) }], not: "Pembe gül sever", son: iso(gunEkle(-20)), toplam: 4250 },
        { id: 2, ad: "Mehmet Kaya (örnek)", tel: "05320000002", izin: true, gunler: [{ tur: "Evlilik yıl dönümü", gun: gun(6) }], not: "Her yıl 21 kırmızı gül", son: iso(gunEkle(-340)), toplam: 6100 },
        { id: 3, ad: "Elif Demir (örnek)", tel: "05320000003", izin: true, gunler: [{ tur: "Annesinin doğum günü", gun: gun(11) }], not: "", son: iso(gunEkle(-45)), toplam: 1800 },
        { id: 4, ad: "Murat Çelik (örnek)", tel: "05320000004", izin: true, gunler: [{ tur: "Doğum günü", gun: gun(40) }], not: "Açılış çelenkleri – kurumsal", son: iso(gunEkle(-120)), toplam: 9800 },
        { id: 5, ad: "Zeynep Aydın (örnek)", tel: "05320000005", izin: false, gunler: [], not: "Gelin arabası 2025", son: iso(gunEkle(-200)), toplam: 7500 },
        { id: 6, ad: "Hüseyin Arslan (örnek)", tel: "05320000006", izin: true, gunler: [{ tur: "Eşinin doğum günü", gun: gun(0) }], not: "Sürpriz teslim, kapıya", son: iso(gunEkle(-95)), toplam: 2300 },
        { id: 7, ad: "Fatma Şahin (örnek)", tel: "05320000007", izin: true, gunler: [{ tur: "Çocuğunun doğum günü", gun: gun(13) }], not: "", son: iso(gunEkle(-8)), toplam: 950 }
      ],
      siparisler: [
        { id: 1, m: 6, urun: "Kırmızı gül buketi + Duygu Stüdyosu kartı", tutar: 2000, teslim: iso(BUGUN) + "T18:00", adres: "Kiremitli Mah.", kart: "İyi ki doğdun sevgilim", durum: "yeni" },
        { id: 2, m: 1, urun: "Orta boy renkli buket", tutar: 1250, teslim: iso(BUGUN) + "T14:30", adres: "Dükkândan teslim", kart: "", durum: "hazir" },
        { id: 3, m: 4, urun: "Açılış çelengi", tutar: 3500, teslim: iso(gunEkle(1)) + "T09:00", adres: "Sanayi sitesi", kart: "Hayırlı olsun", durum: "yeni" },
        { id: 4, m: 7, urun: "Saksı orkide", tutar: 950, teslim: iso(gunEkle(-1)) + "T12:00", adres: "", kart: "", durum: "teslim" }
      ],
      otom: { ozel: true, hafta: true, kayip: true, yorum: true, takvim: true, teslim: true },
      sablon: {
        ozel: "Merhaba {ad} 🌸 {tur} {kac} gün sonra! Sevdiğinizi çiçeksiz bırakmayalım: bütçenize göre buket ve isme özel kartla hazırlıyoruz. Sipariş için bu mesajı yanıtlamanız yeterli. — Hakan Çiçekçilik",
        hafta: "Hafta sonu sevdiklerinize bir sürpriz yapın 🌷 Cumartesi-Pazar tüm buketlerde isme özel kart hediye. Fırsat Köşesi'ne de göz atın: {site} — Hakan Çiçekçilik, Korkuteli",
        kayip: "Merhaba {ad}, sizi özledik 🌸 Bir sonraki siparişinizde Duygu Stüdyosu kartı ve süsleme bizden. — Hakan Çiçekçilik",
        yorum: "Merhaba {ad}, çiçekleriniz ulaştı mı, beğenildi mi? 🌸 1 dakikanızı ayırıp Google'da yorum yazarsanız çok seviniriz: {yorum}",
        takvim: "{gun} yaklaşıyor 💐 Siparişinizi şimdiden ayırtın, son güne kalmasın. Bütçenize göre seçenekler: {site} — Hakan Çiçekçilik",
        teslim: "Merhaba {ad}, siparişiniz yola çıktı 🚗 Tahmini teslim: {saat}. Hakan Çiçekçilik"
      },
      kanal: { ozel: "wa", hafta: "sms", kayip: "wa", yorum: "wa", takvim: "sms", teslim: "wa" }
    };
  }
  var D; try { D = JSON.parse(localStorage.getItem("hc-panel")); } catch (e) {}
  if (!D || !D.musteriler) D = ornek();
  var kaydet = function () { try { localStorage.setItem("hc-panel", JSON.stringify(D)); } catch (e) {} ciz(); };
  var mus = function (id) { return D.musteriler.find(function (m) { return m.id == id; }) || {}; };

  // ---------- Yardımcılar ----------
  function sonrakiGun(t) { if (!t) return null; var d = new Date(BUGUN.getFullYear() + t.slice(4)); d.setHours(0, 0, 0, 0); if (d < BUGUN) d.setFullYear(d.getFullYear() + 1); return d; }
  var kacGun = function (d) { return Math.round((d - BUGUN) / 864e5); };
  var gunSonra = function (s) { return Math.round((BUGUN - new Date(s)) / 864e5); };
  function doldur(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : (k === "site" ? SITE : k === "yorum" ? "https://www.google.com/maps/search/?api=1&query=Hakan+%C3%87i%C3%A7ek%C3%A7ilik+Korkuteli" : ""); }); }
  function yaklasanlar(gun) {
    var l = [];
    D.musteriler.forEach(function (m) { (m.gunler || []).forEach(function (g) { var d = sonrakiGun(g.gun); if (d && kacGun(d) <= gun) l.push({ m: m, tur: g.tur, d: d, kac: kacGun(d) }); }); });
    return l.sort(function (a, b) { return a.d - b.d; });
  }
  var TAKVIM = [["02-14", "Sevgililer Günü"], ["03-08", "Dünya Kadınlar Günü"], ["11-24", "Öğretmenler Günü"], ["12-31", "Yılbaşı"]];
  function takvimYakin() { // anneler/babalar günü dahil, 7 gün içindeki özel günler
    var y = BUGUN.getFullYear(), l = TAKVIM.map(function (x) { return [new Date(y + "-" + x[0]), x[1]]; });
    var pazar = function (ay, n) { var d = new Date(y, ay, 1); while (d.getDay()) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7 * (n - 1)); return d; };
    l.push([pazar(4, 2), "Anneler Günü"], [pazar(5, 3), "Babalar Günü"]);
    return l.map(function (x) { return { d: x[0], ad: x[1], kac: kacGun(x[0]) }; }).filter(function (x) { return x.kac >= 0 && x.kac <= 7; });
  }

  // ---------- Çizim ----------
  function ciz() {
    $("#tarih").textContent = BUGUN.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
    var bugunSip = D.siparisler.filter(function (s) { return s.teslim.slice(0, 10) === iso(BUGUN); });
    var yak = yaklasanlar(14), kayip = D.musteriler.filter(function (m) { return gunSonra(m.son) > 90; });
    $("#o-sip").textContent = bugunSip.length; $("#o-gun").textContent = yak.length; $("#o-mus").textContent = D.musteriler.length; $("#o-kayip").textContent = kayip.length;

    $("#yaklasan").innerHTML = yak.length ? yak.map(function (x) {
      var msg = doldur(D.sablon.ozel, { ad: x.m.ad.split(" ")[0], tur: x.tur.toLocaleLowerCase("tr"), kac: x.kac });
      return '<div class="satir"><div class="ic"><b>' + x.m.ad + '</b><small>' + x.tur + " · " + x.d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" }) + (x.m.not ? " · " + x.m.not : "") + '</small></div><span class="rozet ' + (x.kac <= 3 ? "k" : "v") + '">' + (x.kac ? x.kac + " gün" : "BUGÜN") + '</span><a class="dg w s" target="_blank" href="https://wa.me/' + waNo(x.m.tel) + "?text=" + encodeURIComponent(msg) + '">💬</a></div>';
    }).join("") : '<p class="bos">Önümüzdeki 14 günde kayıtlı özel gün yok.</p>';

    var kuyruk = [];
    if (D.otom.ozel) yak.filter(function (x) { return x.kac === 3 || x.kac === 0; }).forEach(function (x) { if (x.m.izin) kuyruk.push(["🎂", x.m.ad, "Özel gün hatırlatması (" + x.tur + ")", D.kanal.ozel]); });
    if (D.otom.kayip) kayip.slice(0, 3).forEach(function (m) { if (m.izin) kuyruk.push(["💌", m.ad, "Sizi özledik (" + gunSonra(m.son) + " gündür yok)", D.kanal.kayip]); });
    if (D.otom.hafta && BUGUN.getDay() === 5) kuyruk.push(["🌷", D.musteriler.filter(function (m) { return m.izin; }).length + " müşteri", "Hafta sonu kampanyası", D.kanal.hafta]);
    if (D.otom.takvim) takvimYakin().forEach(function (t) { kuyruk.push(["📅", "Tüm izinli müşteriler", t.ad + " duyurusu (" + t.kac + " gün kaldı)", D.kanal.takvim]); });
    if (D.otom.yorum) D.siparisler.filter(function (s) { return s.durum === "teslim"; }).forEach(function (s) { kuyruk.push(["⭐", mus(s.m).ad, "Google yorum isteği", D.kanal.yorum]); });
    $("#otomatik-kuyruk").innerHTML = kuyruk.length ? kuyruk.map(function (k) { return '<div class="satir"><span style="font-size:1.3rem">' + k[0] + '</span><div class="ic"><b>' + k[1] + "</b><small>" + k[2] + '</small></div><span class="rozet y">' + (k[3] === "sms" ? "SMS" : "WhatsApp") + " · 10:00</span></div>"; }).join("") : '<p class="bos">Bugün otomatik gidecek mesaj yok.</p>';

    $("#bugun-sip").innerHTML = bugunSip.length ? bugunSip.map(sipSatir).join("") : '<p class="bos">Bugün teslim edilecek sipariş yok.</p>';

    var q = ($("#ara").value || "").toLocaleLowerCase("tr");
    $("#musteri-liste").innerHTML = D.musteriler.filter(function (m) { return !q || (m.ad + m.tel).toLocaleLowerCase("tr").indexOf(q) >= 0; }).map(function (m) {
      var g = gunSonra(m.son), r = g > 90 ? '<span class="rozet k">Geri kazan · ' + g + " gün</span>" : '<span class="rozet y">Aktif</span>';
      return '<div class="satir"><div class="ic"><b>' + m.ad + "</b><small>" + m.tel + " · toplam " + tl(m.toplam) + ((m.gunler || []).length ? " · " + m.gunler.map(function (x) { return x.tur + " " + new Date(x.gun).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }); }).join(", ") : "") + (m.izin ? "" : " · izin yok") + "</small></div>" + r + '<a class="dg w s" target="_blank" href="https://wa.me/' + waNo(m.tel) + '">💬</a></div>';
    }).join("") || '<p class="bos">Sonuç yok.</p>';

    $("#sip-musteri").innerHTML = D.musteriler.map(function (m) { return '<option value="' + m.id + '">' + m.ad + "</option>"; }).join("");
    var SUT = [["yeni", "🆕 Yeni"], ["hazir", "🌸 Hazırlanıyor"], ["yolda", "🚗 Yolda"], ["teslim", "✅ Teslim"]];
    $("#kanban").innerHTML = SUT.map(function (s) { return "<div><h3>" + s[1] + "</h3>" + D.siparisler.filter(function (x) { return x.durum === s[0]; }).map(function (x) { return '<div class="sip"><b>' + mus(x.m).ad + "</b><br>" + x.urun + "<br><small>" + tl(x.tutar) + " · " + new Date(x.teslim).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "</small><br>" + (s[0] !== "teslim" ? '<button class="dg s" data-ilerlet="' + x.id + '" style="margin-top:6px">İlerlet →</button>' : '<a class="dg w s" style="margin-top:6px" target="_blank" href="https://wa.me/' + waNo(mus(x.m).tel) + "?text=" + encodeURIComponent(doldur(D.sablon.yorum, { ad: mus(x.m).ad.split(" ")[0] })) + '">⭐ Yorum iste</a>') + "</div>"; }).join("") + "</div>"; }).join("");

    var OT = [["ozel", "🎂 Özel gün hatırlatması", "Kayıtlı doğum günü/yıl dönümünden 3 gün önce ve o sabah müşteriye mesaj"], ["hafta", "🌷 Hafta sonu kampanyası", "Her cuma 17:00'de izinli tüm müşterilere"], ["kayip", "💌 Geri kazanma", "90 gündür sipariş vermeyen müşterilere 'sizi özledik'"], ["yorum", "⭐ Google yorum isteği", "Teslimattan 2 saat sonra; puanınızı yükseltmenin en hızlı yolu"], ["takvim", "📅 Özel günler takvimi", "Sevgililer, Kadınlar, Anneler, Babalar, Öğretmenler günü ve yılbaşından 7 gün önce"], ["teslim", "🚗 Sipariş yola çıktı", "Sipariş 'Yolda'ya geçince alıcıya/gönderene bilgi"]];
    $("#otom-liste").innerHTML = OT.map(function (o) {
      return '<div class="kart otom"><label class="anahtar"><input type="checkbox" data-otom="' + o[0] + '"' + (D.otom[o[0]] ? " checked" : "") + '><span></span></label><div class="ic"><b>' + o[1] + "</b><br><small style=\"color:var(--s)\">" + o[2] + '</small><div class="iki" style="margin-top:8px"><select data-kanal="' + o[0] + '"><option value="wa"' + (D.kanal[o[0]] === "wa" ? " selected" : "") + '>WhatsApp</option><option value="sms"' + (D.kanal[o[0]] === "sms" ? " selected" : "") + '>SMS</option></select></div><textarea data-sablon="' + o[0] + '" rows="3" style="margin-top:8px">' + D.sablon[o[0]] + "</textarea></div></div>";
    }).join("");

    var fl = firsatOku();
    $("#firsat-liste").innerHTML = fl.length ? fl.map(function (f, i) { var src = /^data:/.test(f.foto) ? f.foto : "../img/" + (f.foto || "f2.jpg"); return '<div class="kart"><img src="' + src + '" alt=""><div class="p"><b>' + f.ad + "</b><br><small>" + (f.eski ? "<s>" + tl(f.eski) + "</s> " : "") + "<b style='color:var(--k)'>" + tl(f.yeni) + "</b> · " + (f.son || "") + '</small><br><button class="dg b s" data-firsat-sil="' + i + '" style="margin-top:6px">Kaldır</button></div></div>'; }).join("") : '<p class="bos">Köşe boş. Ürün eklediğinizde sitede görünür.</p>';
    kampanyaOnizle();
  }
  function sipSatir(x) { return '<div class="satir"><div class="ic"><b>' + mus(x.m).ad + "</b><small>" + x.urun + " · " + x.teslim.slice(11, 16) + (x.adres ? " · " + x.adres : "") + '</small></div><span class="rozet v">' + tl(x.tutar) + "</span></div>"; }

  // ---------- Fırsat Köşesi ----------
  function firsatOku() { try { var l = JSON.parse(localStorage.getItem("hc-firsat") || "null"); if (Array.isArray(l)) return l; } catch (e) {} return []; }
  function firsatYaz(l) { try { localStorage.setItem("hc-firsat", JSON.stringify(l)); } catch (e) { alert("Fotoğraf çok büyük; daha küçük bir fotoğraf deneyin."); } ciz(); }
  function fotoKucult(dosya, cb) {
    if (!dosya) return cb(null);
    var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var k = 700 / Math.max(im.width, im.height), c = document.createElement("canvas"); c.width = im.width * Math.min(1, k); c.height = im.height * Math.min(1, k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL("image/jpeg", .78)); }; im.src = r.result; }; r.readAsDataURL(dosya);
  }

  // ---------- Kampanya ----------
  var HAZIR = {
    hafta: function () { return D.sablon.hafta.replace("{site}", SITE); },
    firsat: function () { var l = firsatOku(); return "🔥 Fırsat Köşesi'nde bugün: " + (l.length ? l.slice(0, 2).map(function (f) { return f.ad + " " + tl(f.yeni); }).join(", ") : "taze çiçekler yarı fiyatına") + ". Stoklar sınırlı! " + SITE + "#firsat — Hakan Çiçekçilik"; },
    ozel: function () { return doldur(D.sablon.takvim, { gun: "Sevgililer Günü" }); },
    ozledik: function () { return doldur(D.sablon.kayip, { ad: "değerli müşterimiz" }); }
  };
  function hedefSay() {
    var h = $("#k-hedef").value, l = D.musteriler.filter(function (m) { return m.izin; });
    if (h === "aktif") l = l.filter(function (m) { return gunSonra(m.son) <= 90; });
    if (h === "kayip") l = l.filter(function (m) { return gunSonra(m.son) > 90; });
    if (h === "buay") l = l.filter(function (m) { return (m.gunler || []).some(function (g) { return +g.gun.slice(5, 7) === BUGUN.getMonth() + 1; }); });
    return l;
  }
  function kampanyaOnizle() {
    var m = $("#k-metin").value, sms = $("#k-kanal").value === "sms", ek = sms ? "\nRET yazıp 3xxx'e gönderin" : "";
    $("#k-onizle").textContent = (m || "Mesajınız burada görünecek…") + ek; $("#k-onizle").className = "balon" + (sms ? " sms" : "");
    var n = (m + ek).length; $("#k-say").textContent = n + " karakter" + (sms ? " · " + Math.max(1, Math.ceil(n / 153)) + " SMS" : "");
    $("#k-kac").textContent = hedefSay().length + " kişi";
  }

  // ---------- Olaylar ----------
  $$("nav.alt button").forEach(function (b) { b.onclick = function () { $$("nav.alt button").forEach(function (x) { x.classList.toggle("on", x === b); }); $$(".sekme").forEach(function (s) { s.classList.toggle("on", s.id === "s-" + b.dataset.s); }); scrollTo(0, 0); }; });
  $("#ara").oninput = ciz;
  $("#musteri-form").onsubmit = function (e) { e.preventDefault(); var f = e.target; D.musteriler.unshift({ id: Date.now(), ad: f.ad.value.trim(), tel: f.tel.value.trim(), izin: f.izin.checked, gunler: f.gun.value ? [{ tur: f.tur.value, gun: f.gun.value }] : [], not: f.not.value.trim(), son: iso(BUGUN), toplam: 0 }); f.reset(); kaydet(); };
  $("#siparis-form").onsubmit = function (e) { e.preventDefault(); var f = e.target; D.siparisler.push({ id: Date.now(), m: +f.m.value, urun: f.urun.value, tutar: +f.tutar.value, teslim: f.teslim.value, adres: f.adres.value, kart: f.kart.value, durum: "yeni" }); var m = mus(f.m.value); m.son = iso(BUGUN); m.toplam = (m.toplam || 0) + (+f.tutar.value); f.reset(); kaydet(); };
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-ilerlet]"); if (t) { var s = D.siparisler.find(function (x) { return x.id == t.dataset.ilerlet; }); s.durum = { yeni: "hazir", hazir: "yolda", yolda: "teslim" }[s.durum] || "teslim"; kaydet(); }
    var sil = e.target.closest("[data-firsat-sil]"); if (sil) { var l = firsatOku(); l.splice(+sil.dataset.firsatSil, 1); firsatYaz(l); }
    var hz = e.target.closest("[data-hazir]"); if (hz) { $("#k-metin").value = HAZIR[hz.dataset.hazir](); kampanyaOnizle(); }
  });
  document.addEventListener("change", function (e) {
    var o = e.target.dataset; if (o.otom) { D.otom[o.otom] = e.target.checked; kaydet(); } if (o.kanal) { D.kanal[o.kanal] = e.target.value; kaydet(); }
    if (e.target.id === "k-hedef" || e.target.id === "k-kanal") kampanyaOnizle();
  });
  document.addEventListener("input", function (e) { if (e.target.dataset.sablon) { D.sablon[e.target.dataset.sablon] = e.target.value; try { localStorage.setItem("hc-panel", JSON.stringify(D)); } catch (x) {} } if (e.target.id === "k-metin") kampanyaOnizle(); });
  $("#k-gonder").onclick = function () { var n = hedefSay().length; if (!$("#k-metin").value.trim()) return; $("#k-gonder").textContent = "✓ " + n + " kişiye sıraya alındı (taslak)"; setTimeout(function () { $("#k-gonder").textContent = "Gönder"; }, 3500); };
  $("#firsat-form").onsubmit = function (e) {
    e.preventDefault(); var f = e.target;
    fotoKucult(f.foto.files[0], function (src) { var l = firsatOku(); l.unshift({ id: "f" + Date.now(), ad: f.ad.value.trim(), eski: +f.eski.value || 0, yeni: +f.yeni.value, son: f.son.value.trim() || "Stoklar bitene kadar", adet: +f.adet.value || 1, foto: src || "f2.jpg" }); firsatYaz(l); f.reset(); });
  };
  $("#firsat-duyur").onclick = function () { $("#k-metin").value = HAZIR.firsat(); $("#k-hedef").value = "hepsi"; $$("nav.alt button")[4].click(); kampanyaOnizle(); };

  // ---------- Uygulama olarak yükleme ----------
  var ist; addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); ist = e; $("#yukle").hidden = false; });
  $("#yukle").onclick = function () { if (ist) { ist.prompt(); ist = null; $("#yukle").hidden = true; } };
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
  ciz();
})();
