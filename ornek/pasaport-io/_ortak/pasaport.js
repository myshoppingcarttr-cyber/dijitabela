/* Pasaport.io prototip motoru — Dijitabela, 20 Ekim 2026
   Bileşenler sayfada data-pp="ad" ile yerleşir; her prototip kendi yerleşim/CSS'ini kullanır.
   Sepet, dil (TR/EN/DE), para birimi (TRY/EUR), terk edilmiş sepet, referans kodu, ödeme→QR teslim demosu burada. */
(function () {
  "use strict";
  var V = window.PPV, IMG = (window.PP_IMG || "../img/");
  var LS = { get: function (k, d) { try { var v = localStorage.getItem("pp." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("pp." + k, JSON.stringify(v)); } catch (e) {} } };
  var S = { dil: LS.get("dil", "tr"), kur: LS.get("kur", "TRY"), sepet: LS.get("sepet", []), ref: LS.get("ref", null), ulke: "TR" };
  window.dataLayer = window.dataLayer || [];
  function olc(ad, o) { window.dataLayer.push(Object.assign({ event: ad }, o || {})); }

  /* ---------- Sözlük ---------- */
  var D = {
    tr: { sepet: "Sepet", sepetBos: "Sepetin boş. Ülke seç, paketini ekle.", toplam: "Toplam", odeme: "Ödemeye geç", ekle: "Sepete ekle", eklendi: "Sepete eklendi", kaldir: "Kaldır",
      gun: "gün", kisi: "kişi", baslayan: "başlayan", ornekFiyat: "örnek fiyat", ulkeAra: "Ülke ara, örn. İtalya", bul: "Bul",
      marka: "Marka seç", model: "Modelini seç", uyumEvet: "Bu telefon eSIM destekliyor. Kilidi açık olduğundan emin ol.", uyumHayir: "Bu model eSIM desteklemiyor. Fiziksel SIM gerekir.", uyumBelki: "Bölgeye/modele göre değişir. *#06# tuşla: EID numarası görünüyorsa eSIM var.",
      hesapBaslik: "Ne kadar internet lazım?", hesapGun: "Kaç gün?", hesapKul: "Kullanımın", hafif: "Hafif · harita, mesaj", orta: "Orta · + sosyal medya", yogun: "Yoğun · video, hotspot", hesapSonuc: "Tahmini ihtiyaç", oneri: "Önerilen paket", hotspot: "Ailemle paylaşacağım (hotspot)",
      rotaBaslik: "Sıla Yolu otoyol planlayıcı", rotaSec: "Rota", plaka: "Plaka", plakaPh: "örn. M AB 1234", tekYon: "Tek yön", gidisDonus: "Gidiş-dönüş", kalis: "Türkiye'de kaç gün?", vinyetGerek: "Vignette gerekir", gise: "Gişe ücreti", ucretsiz: "Ücretsiz", hgs: "HGS etiketi", feribot: "Bu rotada İtalya–Yunanistan feribotu var; feribot bileti ayrıca alınır.", resmi: "Resmî ücret 2026 (bilgi amaçlı)", hizmet: "hizmet bedeli (örnek)", vinyetEkle: "Seçili vignette'leri sepete ekle", plakaUyari: "Dijital vignette plakaya bağlıdır; plakanı yaz.", adet: "adet",
      loungeBaslik: "Havalimanı lounge bul", loungePh: "Havalimanı ya da kod: FRA, IST, AYT…", saat: "saat", sonucYok: "Sonuç yok. Başka havalimanı dene.", tarih: "Uçuş tarihi",
      paketBaslik: "Seyahat paketini oluştur", nereden: "Nereden?", nereye: "Nereye?", nasil: "Nasıl gidiyorsun?", ucak: "Uçakla", araba: "Arabayla", olustur: "Paketimi oluştur", hepsiniEkle: "Hepsini sepete ekle", paketIndirim: "Seyahat paketi indirimi (örnek %10)", gunSayisi: "Kaç gün?", kisiSayisi: "Kaç kişi?",
      odemeBaslik: "Güvenli ödeme", adSoyad: "Ad Soyad", eposta: "E-posta", telefon: "WhatsApp numarası (isteğe bağlı)", odemeYontem: "Ödeme yöntemi", kart: "Kart", tamamla: "Ödemeyi tamamla (demo)", demoNot: "Prototip: gerçek ödeme alınmaz.",
      teslimBaslik: "Siparişin hazır", teslimAlt: "eSIM'ini şimdi kur: QR kodu başka bir ekrandan okut ya da iPhone'da tek dokunuşla kur.", tekDokun: "iPhone'da tek dokunuşla kur", siparisNo: "Sipariş no", whatsappGonder: "QR'ı WhatsApp'ıma da gönder", kapat: "Kapat",
      terkBaslik: "Sepetinde ürün kaldı", terkAlt: "Fiyatı 24 saat sabitleyelim mi? Hatırlatmayı WhatsApp ya da e-postayla gönderelim.", hatirlat: "Hatırlat", devam: "Sepete dön", kaydedildi: "Tamam, hatırlatma kaydedildi (demo).",
      refAktif: "Referans kodu aktif: ilk siparişte %5 indirim", bultenBaslik: "Fırsat ve Sıla Yolu duyuruları", bultenAlt: "Bayram ve yaz dönemi kampanyaları, sınır kapısı yoğunluk uyarıları. İstediğin an çık.", kanal: "Kanal", onay: "Kampanya mesajı almayı kabul ediyorum (DSGVO/KVKK).", kaydol: "Kaydol", bultenTamam: "Kaydın alındı. İlk mesaj: hoş geldin kodu (demo).",
      ortakBaslik: "Paylaş, kazan", ortakAlt: "Kendi kodunu oluştur; arkadaşın %5 indirim alır, sen her satıştan komisyon kazanırsın.", kodOlustur: "Kodumu oluştur", kopyala: "Bağlantıyı kopyala", kopyalandi: "Kopyalandı",
      b2bBaslik: "Seyahat acentesi paneli", b2bAlt: "Acenteler müşterileri için toplu eSIM, lounge ve vignette alır; komisyon ve faturalar tek ekranda.",
      yorumNot: "Örnek yorumlar (mevcut siteden). Yayında Trustpilot/Google yorumları bağlanır.", whatsapp: "WhatsApp destek", indirim: "İndirim", sepetGit: "Sepete git" },
    en: { sepet: "Cart", sepetBos: "Your cart is empty. Pick a country and add a plan.", toplam: "Total", odeme: "Checkout", ekle: "Add to cart", eklendi: "Added to cart", kaldir: "Remove",
      gun: "days", kisi: "people", baslayan: "from", ornekFiyat: "sample price", ulkeAra: "Search country, e.g. Italy", bul: "Find",
      marka: "Select brand", model: "Select model", uyumEvet: "This phone supports eSIM. Make sure it is unlocked.", uyumHayir: "This model does not support eSIM. A physical SIM is needed.", uyumBelki: "Depends on region/model. Dial *#06#: if an EID shows, you have eSIM.",
      hesapBaslik: "How much data do you need?", hesapGun: "How many days?", hesapKul: "Your usage", hafif: "Light · maps, messages", orta: "Medium · + social media", yogun: "Heavy · video, hotspot", hesapSonuc: "Estimated need", oneri: "Recommended plan", hotspot: "I'll share with family (hotspot)",
      rotaBaslik: "Road-trip toll planner", rotaSec: "Route", plaka: "Licence plate", plakaPh: "e.g. M AB 1234", tekYon: "One way", gidisDonus: "Round trip", kalis: "Days in Türkiye?", vinyetGerek: "Vignette required", gise: "Toll booths", ucretsiz: "Free", hgs: "HGS tag", feribot: "This route includes an Italy–Greece ferry; ferry ticket is separate.", resmi: "Official fee 2026 (for information)", hizmet: "service fee (sample)", vinyetEkle: "Add selected vignettes to cart", plakaUyari: "Digital vignettes are linked to your plate; enter it.", adet: "pcs",
      loungeBaslik: "Find an airport lounge", loungePh: "Airport or code: FRA, IST, AYT…", saat: "hours", sonucYok: "No results. Try another airport.", tarih: "Flight date",
      paketBaslik: "Build your travel bundle", nereden: "From?", nereye: "To?", nasil: "How are you travelling?", ucak: "By plane", araba: "By car", olustur: "Build my bundle", hepsiniEkle: "Add all to cart", paketIndirim: "Travel bundle discount (sample 10%)", gunSayisi: "How many days?", kisiSayisi: "How many people?",
      odemeBaslik: "Secure checkout", adSoyad: "Full name", eposta: "Email", telefon: "WhatsApp number (optional)", odemeYontem: "Payment method", kart: "Card", tamamla: "Complete payment (demo)", demoNot: "Prototype: no real payment is taken.",
      teslimBaslik: "Your order is ready", teslimAlt: "Install your eSIM now: scan the QR from another screen or install with one tap on iPhone.", tekDokun: "One-tap install on iPhone", siparisNo: "Order no", whatsappGonder: "Also send QR to my WhatsApp", kapat: "Close",
      terkBaslik: "Items left in your cart", terkAlt: "Shall we hold the price for 24 hours? We can remind you via WhatsApp or email.", hatirlat: "Remind me", devam: "Back to cart", kaydedildi: "Done, reminder saved (demo).",
      refAktif: "Referral code active: 5% off your first order", bultenBaslik: "Deals & road-trip alerts", bultenAlt: "Holiday and summer deals, border queue alerts. Unsubscribe anytime.", kanal: "Channel", onay: "I agree to receive marketing messages (GDPR).", kaydol: "Sign up", bultenTamam: "You're in. First message: welcome code (demo).",
      ortakBaslik: "Share & earn", ortakAlt: "Create your code; your friend gets 5% off, you earn commission on every sale.", kodOlustur: "Create my code", kopyala: "Copy link", kopyalandi: "Copied",
      b2bBaslik: "Travel agency panel", b2bAlt: "Agencies buy eSIM, lounge and vignettes in bulk for clients; commission and invoices on one screen.",
      yorumNot: "Sample reviews (from current site). Live Trustpilot/Google reviews when published.", whatsapp: "WhatsApp support", indirim: "Discount", sepetGit: "Go to cart" },
    de: { sepet: "Warenkorb", sepetBos: "Dein Warenkorb ist leer. Land wählen, Tarif hinzufügen.", toplam: "Gesamt", odeme: "Zur Kasse", ekle: "In den Warenkorb", eklendi: "Hinzugefügt", kaldir: "Entfernen",
      gun: "Tage", kisi: "Personen", baslayan: "ab", ornekFiyat: "Beispielpreis", ulkeAra: "Land suchen, z. B. Italien", bul: "Suchen",
      marka: "Marke wählen", model: "Modell wählen", uyumEvet: "Dieses Handy unterstützt eSIM. Achte auf SIM-Lock-Freiheit.", uyumHayir: "Dieses Modell unterstützt keine eSIM. Physische SIM nötig.", uyumBelki: "Je nach Region/Modell. Wähle *#06#: Wird eine EID angezeigt, hast du eSIM.",
      hesapBaslik: "Wie viel Datenvolumen brauchst du?", hesapGun: "Wie viele Tage?", hesapKul: "Deine Nutzung", hafif: "Leicht · Karten, Chats", orta: "Mittel · + Social Media", yogun: "Intensiv · Video, Hotspot", hesapSonuc: "Geschätzter Bedarf", oneri: "Empfohlener Tarif", hotspot: "Ich teile mit der Familie (Hotspot)",
      rotaBaslik: "Maut-Planer für die Heimreise", rotaSec: "Route", plaka: "Kennzeichen", plakaPh: "z. B. M AB 1234", tekYon: "Einfach", gidisDonus: "Hin und zurück", kalis: "Tage in der Türkei?", vinyetGerek: "Vignette nötig", gise: "Mautstellen", ucretsiz: "Frei", hgs: "HGS-Plakette", feribot: "Diese Route enthält eine Fähre Italien–Griechenland; Ticket separat.", resmi: "Offizielle Gebühr 2026 (Info)", hizmet: "Servicegebühr (Beispiel)", vinyetEkle: "Gewählte Vignetten in den Warenkorb", plakaUyari: "Digitale Vignetten sind kennzeichengebunden; bitte eingeben.", adet: "Stk.",
      loungeBaslik: "Flughafen-Lounge finden", loungePh: "Flughafen oder Code: FRA, IST, AYT…", saat: "Std.", sonucYok: "Keine Treffer. Anderen Flughafen versuchen.", tarih: "Flugdatum",
      paketBaslik: "Reisepaket zusammenstellen", nereden: "Von?", nereye: "Nach?", nasil: "Wie reist du?", ucak: "Flugzeug", araba: "Auto", olustur: "Paket erstellen", hepsiniEkle: "Alles in den Warenkorb", paketIndirim: "Reisepaket-Rabatt (Beispiel 10 %)", gunSayisi: "Wie viele Tage?", kisiSayisi: "Wie viele Personen?",
      odemeBaslik: "Sichere Zahlung", adSoyad: "Vor- und Nachname", eposta: "E-Mail", telefon: "WhatsApp-Nummer (optional)", odemeYontem: "Zahlungsart", kart: "Karte", tamamla: "Zahlung abschließen (Demo)", demoNot: "Prototyp: keine echte Zahlung.",
      teslimBaslik: "Deine Bestellung ist bereit", teslimAlt: "Installiere deine eSIM jetzt: QR von einem anderen Bildschirm scannen oder am iPhone mit einem Tipp.", tekDokun: "Am iPhone mit einem Tipp installieren", siparisNo: "Bestellnr.", whatsappGonder: "QR auch per WhatsApp senden", kapat: "Schließen",
      terkBaslik: "Noch Artikel im Warenkorb", terkAlt: "Sollen wir den Preis 24 Stunden halten? Erinnerung per WhatsApp oder E-Mail.", hatirlat: "Erinnern", devam: "Zum Warenkorb", kaydedildi: "Erinnerung gespeichert (Demo).",
      refAktif: "Empfehlungscode aktiv: 5 % auf die erste Bestellung", bultenBaslik: "Angebote & Heimreise-Hinweise", bultenAlt: "Feiertags- und Sommerangebote, Grenzwartezeiten. Jederzeit abmeldbar.", kanal: "Kanal", onay: "Ich willige in Werbenachrichten ein (DSGVO).", kaydol: "Anmelden", bultenTamam: "Angemeldet. Erste Nachricht: Willkommenscode (Demo).",
      ortakBaslik: "Teilen & verdienen", ortakAlt: "Erstelle deinen Code; Freunde erhalten 5 %, du Provision pro Verkauf.", kodOlustur: "Code erstellen", kopyala: "Link kopieren", kopyalandi: "Kopiert",
      b2bBaslik: "Reisebüro-Portal", b2bAlt: "Reisebüros kaufen eSIM, Lounge und Vignetten gesammelt; Provision und Rechnungen an einem Ort.",
      yorumNot: "Beispielbewertungen (aktuelle Seite). Live: Trustpilot/Google.", whatsapp: "WhatsApp-Support", indirim: "Rabatt", sepetGit: "Zum Warenkorb" }
  };
  var EK = { tr: {}, en: {}, de: {} };
  function T(k) { return (EK[S.dil] && EK[S.dil][k]) || D[S.dil][k] || EK.tr[k] || D.tr[k] || k; }
  function ad(o) { return o[S.dil] || o.tr; }
  function para(tl) {
    if (S.kur === "EUR") return new Intl.NumberFormat(S.dil === "en" ? "en-IE" : "de-DE", { style: "currency", currency: "EUR" }).format(tl / V.KUR);
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(tl);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function nz(x) { return String(x).toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(h) { var d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstChild; }

  /* ---------- Bildirim ---------- */
  function bildir(m) {
    var t = $(".pp-tost") || document.body.appendChild(el('<div class="pp-tost" role="status"></div>'));
    t.textContent = m; t.classList.add("acik"); clearTimeout(bildir.z); bildir.z = setTimeout(function () { t.classList.remove("acik"); }, 2200);
  }

  /* ---------- Sepet ---------- */
  function kaydet() { LS.set("sepet", S.sepet); LS.set("sepetZaman", Date.now()); sayac(); }
  function ekle(o) { o.id = o.id || (o.tur + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6)); S.sepet.push(o); kaydet(); bildir(T("eklendi") + ": " + o.ad); olc("add_to_cart", { item: o.ad, value: o.fiyat }); }
  function sayac() { $$("[data-pp-sepet-sayi]").forEach(function (e) { e.textContent = S.sepet.length; e.hidden = !S.sepet.length; }); }
  function hesapla() {
    var ara = S.sepet.reduce(function (t, x) { return t + x.fiyat * (x.adet || 1); }, 0);
    var turler = {}; S.sepet.forEach(function (x) { turler[x.tur] = 1; });
    var ind = Object.keys(turler).length >= 2 ? Math.round(ara * V.PAKET_INDIRIM) : 0;
    var ref = S.ref ? Math.round((ara - ind) * 0.05) : 0;
    return { ara: ara, ind: ind, ref: ref, top: ara - ind - ref };
  }
  function cekmece() {
    var c = $(".pp-cekmece");
    if (!c) {
      c = document.body.appendChild(el('<aside class="pp-cekmece" aria-hidden="true"><div class="pp-ck-ic" role="dialog" aria-modal="true" aria-label="Sepet"><div class="pp-ck-bas"><b></b><button class="pp-x" type="button" aria-label="Kapat">×</button></div><div class="pp-ck-govde"></div></div></aside>'));
      c.addEventListener("click", function (e) { if (e.target === c || e.target.closest(".pp-x")) kapatCekmece(); });
    }
    $(".pp-ck-bas b", c).textContent = T("sepet");
    var g = $(".pp-ck-govde", c);
    if (!S.sepet.length) { g.innerHTML = '<p class="pp-bos">' + esc(T("sepetBos")) + "</p>"; }
    else {
      var h = hesapla();
      g.innerHTML = '<ul class="pp-ck-liste">' + S.sepet.map(function (x) {
        return '<li><span class="pp-tur pp-tur-' + x.tur + '">' + esc(x.tur === "esim" ? "eSIM" : x.tur === "lounge" ? "Lounge" : "Vignette") + '</span><div><b>' + esc(x.ad) + "</b><small>" + esc(x.alt || "") + (x.adet > 1 ? " · " + x.adet + " " + T("adet") : "") + '</small></div><span class="pp-f">' + para(x.fiyat * (x.adet || 1)) + '</span><button type="button" class="pp-sil" data-id="' + x.id + '" aria-label="' + esc(T("kaldir")) + '">×</button></li>';
      }).join("") + "</ul>" +
        '<div class="pp-ck-top">' + (h.ind ? "<div><span>" + esc(T("paketIndirim")) + "</span><span>−" + para(h.ind) + "</span></div>" : "") +
        (h.ref ? "<div><span>" + esc(T("refAktif")) + "</span><span>−" + para(h.ref) + "</span></div>" : "") +
        '<div class="pp-ck-t"><span>' + esc(T("toplam")) + "</span><b>" + para(h.top) + "</b></div></div>" +
        '<button type="button" class="pp-btn pp-btn-ana pp-tam" data-pp-odeme>' + esc(T("odeme")) + "</button>" +
        '<p class="pp-mini">Klarna · PayPal · ' + esc(T("kart")) + " · Apple Pay — Stripe</p>";
    }
    return c;
  }
  function acCekmece() { var c = cekmece(); void c.offsetWidth; c.classList.add("acik"); c.setAttribute("aria-hidden", "false"); olc("view_cart"); }
  function kapatCekmece() { var c = $(".pp-cekmece"); if (c) { c.classList.remove("acik"); c.setAttribute("aria-hidden", "true"); } }

  /* ---------- Modal ---------- */
  function modal(html, sinif) {
    kapatModal();
    var m = document.body.appendChild(el('<div class="pp-modal ' + (sinif || "") + '"><div class="pp-md-ic" role="dialog" aria-modal="true"><button class="pp-x" type="button" aria-label="Kapat">×</button>' + html + "</div></div>"));
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest(".pp-x")) kapatModal(); });
    void m.offsetWidth; m.classList.add("acik");
    document.documentElement.classList.add("pp-kilit");
    return m;
  }
  function kapatModal() { $$(".pp-modal").forEach(function (m) { m.remove(); }); document.documentElement.classList.remove("pp-kilit"); }

  /* ---------- Paket kartları ---------- */
  function bul(k) { return V.ulkeler.filter(function (u) { return u.k === k; })[0] || V.bolgeler.filter(function (b) { return b.k === k; })[0]; }
  function paketHtml(u) {
    return '<div class="pp-paketler">' + u.paket.map(function (p, i) {
      return '<button type="button" class="pp-paket" data-pp-paket="' + u.k + '" data-i="' + i + '"><b>' + p[0] + ' GB</b><span>' + p[1] + " " + T("gun") + "</span><em>" + para(p[2]) + "</em></button>";
    }).join("") + "</div>" + (u.ornek ? '<p class="pp-mini">* ' + esc(T("ornekFiyat")) + " — " + esc(T("baslayan")) + " " + para(u.bas) + " (pasaport2.lovable.app)</p>" : "");
  }
  function ulkeModal(k) {
    var u = bul(k); if (!u) return; S.ulke = k; olc("view_item_list", { country: k });
    modal('<div class="pp-md-foto"><img src="' + IMG + u.img + '" alt=""><h3>' + esc(ad(u.ad)) + ' <small>eSIM</small></h3></div><div class="pp-md-govde">' + paketHtml(u) + "</div>", "pp-md-ulke");
  }
  function paketEkle(k, i, adet) {
    var u = bul(k), p = u.paket[i];
    ekle({ tur: "esim", ad: ad(u.ad) + " · " + p[0] + " GB", alt: p[1] + " " + T("gun"), fiyat: p[2], adet: adet || 1 });
  }

  /* ---------- Bileşenler ---------- */
  var B = {};
  B.arama = function (r) {
    var liste = V.ulkeler.concat(V.bolgeler);
    r.innerHTML = '<form class="pp-arama" role="search"><input list="pp-ulke-liste" aria-label="' + esc(T("ulkeAra")) + '" placeholder="' + esc(T("ulkeAra")) + '"><datalist id="pp-ulke-liste">' + liste.map(function (u) { return '<option value="' + esc(ad(u.ad)) + '">'; }).join("") + '</datalist><button class="pp-btn pp-btn-ana" type="submit" aria-label="' + esc(T("bul")) + '">→</button></form>';
    $("form", r).addEventListener("submit", function (e) {
      e.preventDefault(); var q = nz($("input", r).value.trim());
      var u = liste.filter(function (x) { return [x.ad.tr, x.ad.en, x.ad.de].some(function (n) { return nz(n).indexOf(q) === 0; }); })[0];
      if (u) ulkeModal(u.k); else bildir(T("sonucYok"));
      olc("search", { q: q });
    });
  };
  B.ulkeler = function (r) {
    r.innerHTML = '<div class="pp-ulkeler">' + V.ulkeler.map(function (u) {
      return '<button type="button" class="pp-ulke" data-pp-ulke="' + u.k + '"><img src="' + IMG + u.img + '" alt="" loading="lazy"><span class="pp-u-ad">' + esc(ad(u.ad)) + '</span><span class="pp-u-f">' + esc(T("baslayan")) + " " + para(u.bas) + "</span></button>";
    }).join("") + "</div>";
  };
  B.bolgeler = function (r) {
    r.innerHTML = '<div class="pp-bolgeler">' + V.bolgeler.map(function (u) {
      return '<button type="button" class="pp-bolge" data-pp-ulke="' + u.k + '"><img src="' + IMG + u.img + '" alt="" loading="lazy"><span class="pp-u-ad">' + esc(ad(u.ad)) + '</span><span class="pp-u-k">' + u.kap + " " + (S.dil === "tr" ? "ülke" : S.dil === "de" ? "Länder" : "countries") + '</span><span class="pp-u-f">' + esc(T("baslayan")) + " " + para(u.bas) + "</span></button>";
    }).join("") + "</div>";
  };
  B.paketler = function (r) {
    var k = r.getAttribute("data-ulke") || S.ulke, u = bul(k);
    r.innerHTML = '<div class="pp-sekme">' + ["TR", "DE", "europe"].map(function (x) { return '<button type="button" data-k="' + x + '"' + (x === k ? ' class="on"' : "") + ">" + esc(ad(bul(x).ad)) + "</button>"; }).join("") + "</div>" + paketHtml(u);
    $$(".pp-sekme button", r).forEach(function (b) { b.onclick = function () { r.setAttribute("data-ulke", b.dataset.k); B.paketler(r); }; });
  };
  B.cihaz = function (r) {
    r.innerHTML = '<div class="pp-cihaz"><select aria-label="' + esc(T("marka")) + '" data-m><option value="">' + esc(T("marka")) + "</option>" + Object.keys(V.cihaz).map(function (m) { return "<option>" + m + "</option>"; }).join("") +
      '</select><select aria-label="' + esc(T("model")) + '" data-o disabled><option value="">' + esc(T("model")) + '</option></select></div><p class="pp-cihaz-s" aria-live="polite"></p>';
    var m = $("[data-m]", r), o = $("[data-o]", r), s = $(".pp-cihaz-s", r);
    m.onchange = function () { o.disabled = !m.value; o.innerHTML = '<option value="">' + esc(T("model")) + "</option>" + (V.cihaz[m.value] || []).map(function (x) { return "<option>" + x + "</option>"; }).join(""); s.textContent = ""; s.className = "pp-cihaz-s"; };
    o.onchange = function () {
      if (!o.value) return; var u = V.uyum[o.value]; if (u == null) u = 1;
      s.className = "pp-cihaz-s " + ["hayir", "evet", "belki"][u]; s.textContent = (u === 1 ? "✓ " : u === 0 ? "✕ " : "? ") + T(["uyumHayir", "uyumEvet", "uyumBelki"][u]);
      olc("device_check", { model: o.value, ok: u });
    };
  };
  function ihtiyac(gun, kul, hs) { var g = [0.3, 0.8, 2][kul] * gun * (hs ? 1.6 : 1); return Math.max(0.5, Math.round(g * 10) / 10); }
  function onerPaket(u, gb, gun) {
    var uygun = u.paket.filter(function (p) { return p[0] >= gb && p[1] >= Math.min(gun, 30); });
    var p = uygun[0] || u.paket[u.paket.length - 1];
    var adet = gun > 30 ? Math.ceil(gun / 30) : 1;
    if (adet > 1) { var aylik = gb / adet; p = u.paket.filter(function (x) { return x[0] >= aylik && x[1] >= 30; })[0] || u.paket[u.paket.length - 1]; }
    return { p: p, i: u.paket.indexOf(p), adet: adet };
  }
  B.hesap = function (r) {
    var k = r.getAttribute("data-ulke") || "TR";
    r.innerHTML = '<div class="pp-hesap"><label>' + esc(T("nereye")) + '<select data-u>' + V.ulkeler.concat(V.bolgeler.slice(0, 1)).map(function (u) { return '<option value="' + u.k + '"' + (u.k === k ? " selected" : "") + ">" + esc(ad(u.ad)) + "</option>"; }).join("") + '</select></label>' +
      '<label>' + esc(T("hesapGun")) + ' <output data-go>14</output><input type="range" min="1" max="60" value="14" data-g></label>' +
      '<fieldset><legend>' + esc(T("hesapKul")) + '</legend><label class="pp-r"><input type="radio" name="kul' + r.dataset.n + '" value="0">' + esc(T("hafif")) + '</label><label class="pp-r"><input type="radio" name="kul' + r.dataset.n + '" value="1" checked>' + esc(T("orta")) + '</label><label class="pp-r"><input type="radio" name="kul' + r.dataset.n + '" value="2">' + esc(T("yogun")) + "</label></fieldset>" +
      '<label class="pp-c"><input type="checkbox" data-h> ' + esc(T("hotspot")) + "</label>" +
      '<div class="pp-hesap-s" aria-live="polite"></div></div>';
    function guncel() {
      var u = bul($("[data-u]", r).value), g = +$("[data-g]", r).value, kul = +$("input[type=radio]:checked", r).value, hs = $("[data-h]", r).checked;
      $("[data-go]", r).textContent = g + " " + T("gun");
      var gb = ihtiyac(g, kul, hs), o = onerPaket(u, gb, g);
      $(".pp-hesap-s", r).innerHTML = '<div class="pp-olcu"><span>' + esc(T("hesapSonuc")) + '</span><b>≈ ' + gb.toLocaleString(S.dil) + ' GB</b><i style="width:' + Math.min(100, gb / o.p[0] * 100 / o.adet) + '%"></i></div>' +
        '<div class="pp-oneri"><span>' + esc(T("oneri")) + "</span><b>" + esc(ad(u.ad)) + " · " + o.p[0] + " GB / " + o.p[1] + " " + esc(T("gun")) + (o.adet > 1 ? " × " + o.adet : "") + "</b><em>" + para(o.p[2] * o.adet) + '</em><button type="button" class="pp-btn pp-btn-ana" data-ekle>' + esc(T("ekle")) + "</button></div>";
      $("[data-ekle]", r).onclick = function () { paketEkle(u.k, o.i, o.adet); };
    }
    r.oninput = guncel; guncel();
  };
  function vinyetSec(k, tip, kalis) {
    var y = V.yol[k]; if (y.tur !== "vinyet") return null;
    var aday = [];
    if (tip === "tek") y.sec.forEach(function (s) { aday.push({ g: s[0], f: s[1], n: 1 }); });
    else {
      y.sec.forEach(function (s) { if (s[0] >= kalis + 3) aday.push({ g: s[0], f: s[1], n: 1 }); aday.push({ g: s[0], f: s[1] * 2, n: 2 }); });
    }
    aday.sort(function (a, b) { return a.f - b.f; });
    return aday[0];
  }
  function sureAd(g) { if (g === 365) return S.dil === "tr" ? "1 yıl" : S.dil === "de" ? "1 Jahr" : "1 year"; if (g === 60) return S.dil === "tr" ? "2 ay" : S.dil === "de" ? "2 Monate" : "2 months"; if (g === 30) return S.dil === "tr" ? "30 gün" : S.dil === "de" ? "30 Tage" : "30 days"; return g + " " + T("gun"); }
  B.rota = function (r) {
    r.innerHTML = '<div class="pp-rota"><div class="pp-rota-f"><label>' + esc(T("rotaSec")) + '<select data-r>' + V.rotalar.map(function (x) { return '<option value="' + x.k + '">' + esc(ad(x.ad)) + "</option>"; }).join("") + '</select></label>' +
      '<div class="pp-seg" role="group"><button type="button" data-t="tek">' + esc(T("tekYon")) + '</button><button type="button" data-t="gd" class="on">' + esc(T("gidisDonus")) + "</button></div>" +
      '<label data-kl>' + esc(T("kalis")) + ' <output data-ko>21</output><input type="range" min="3" max="90" value="21" data-k></label>' +
      '<label>' + esc(T("plaka")) + '<input data-p placeholder="' + esc(T("plakaPh")) + '" autocomplete="off" maxlength="14"></label></div>' +
      '<ol class="pp-rota-l"></ol><div class="pp-rota-t"></div></div>';
    var tip = "gd";
    $$("[data-t]", r).forEach(function (b) { b.onclick = function () { tip = b.dataset.t; $$("[data-t]", r).forEach(function (x) { x.classList.toggle("on", x === b); }); $("[data-kl]", r).hidden = tip === "tek"; ciz(); }; });
    function ciz() {
      var ro = V.rotalar.filter(function (x) { return x.k === $("[data-r]", r).value; })[0], kalis = +$("[data-k]", r).value;
      $("[data-ko]", r).textContent = kalis + " " + T("gun");
      var top = 0, secili = [];
      $(".pp-rota-l", r).innerHTML = ro.u.map(function (k) {
        var y = V.yol[k], v = vinyetSec(k, tip, kalis), etk, ek = "";
        if (v) { top += v.f; secili.push({ k: k, v: v }); etk = '<span class="pp-et v">' + esc(T("vinyetGerek")) + "</span>"; ek = '<span class="pp-rf"><b>' + (v.n > 1 ? "2 × " : "") + sureAd(v.g) + "</b> €" + (v.f).toFixed(2).replace(".", ",") + "</span>"; }
        else if (y.tur === "gise") etk = '<span class="pp-et g">' + esc(T("gise")) + "</span>";
        else if (y.tur === "hgs") etk = '<span class="pp-et h">' + esc(T("hgs")) + "</span>";
        else etk = '<span class="pp-et o">' + esc(T("ucretsiz")) + "</span>";
        return '<li><span class="pp-bayrak">' + k + '</span><div><b>' + esc(ad(y.ad)) + "</b> " + etk + "<small>" + esc(ad(y.not)) + "</small></div>" + ek + "</li>";
      }).join("") + (ro.feribot ? '<li class="pp-fer"><span class="pp-bayrak">⛴</span><div><small>' + esc(T("feribot")) + "</small></div></li>" : "");
      var hz = secili.length * V.HIZMET_EUR;
      $(".pp-rota-t", r).innerHTML = '<div><span>' + esc(T("resmi")) + "</span><b>€" + top.toFixed(2).replace(".", ",") + "</b></div><div><span>+ " + esc(T("hizmet")) + "</span><b>€" + hz.toFixed(2).replace(".", ",") + '</b></div><div class="pp-km">≈ ' + ro.km.toLocaleString("de-DE") + ' km</div><button type="button" class="pp-btn pp-btn-ana" data-vekle' + (secili.length ? "" : " disabled") + ">" + esc(T("vinyetEkle")) + "</button>";
      $("[data-vekle]", r).onclick = function () {
        var p = $("[data-p]", r).value.trim().toUpperCase();
        if (p.length < 4) { bildir(T("plakaUyari")); $("[data-p]", r).focus(); return; }
        secili.forEach(function (s) { ekle({ tur: "vignette", ad: ad(V.yol[s.k].ad) + " · " + (s.v.n > 1 ? "2 × " : "") + sureAd(s.v.g), alt: p, fiyat: Math.round((s.v.f + V.HIZMET_EUR) * V.KUR), plaka: p }); });
        olc("vignette_bundle", { route: ro.k, n: secili.length });
      };
      r._secili = secili; r._rota = ro;
    }
    r.oninput = r.onchange = function (e) { if (!e.target.matches("[data-p]")) ciz(); }; ciz();
  };
  B.lounge = function (r) {
    r.innerHTML = '<div class="pp-lounge"><input type="search" aria-label="' + esc(T("loungePh")) + '" placeholder="' + esc(T("loungePh")) + '" data-q><div class="pp-hizli">' + ["FRA", "DUS", "MUC", "IST", "AYT"].map(function (k) { return '<button type="button" data-k="' + k + '">' + k + "</button>"; }).join("") + '</div><ul class="pp-l-liste" aria-live="polite"></ul><p class="pp-mini">* ' + esc(T("ornekFiyat")) + "</p></div>";
    var q = $("[data-q]", r);
    function ciz() {
      var s = nz(q.value.trim());
      var l = V.lounge.filter(function (x) { return !s || nz(x.kod).indexOf(s) === 0 || nz(x.sehir).indexOf(s) >= 0; }).slice(0, s ? 6 : 4);
      $(".pp-l-liste", r).innerHTML = l.length ? l.map(function (x, i) {
        return '<li><span class="pp-kod">' + x.kod + '</span><div><b>' + esc(x.ad) + "</b><small>" + esc(x.sehir) + " · " + x.term + " · " + x.saat + " " + esc(T("saat")) + " · " + x.ozel.join(" · ") + '</small></div><em>' + para(x.fiyat) + '</em><button type="button" class="pp-btn pp-btn-kucuk" data-li="' + V.lounge.indexOf(x) + '">+</button></li>';
      }).join("") : "<li>" + esc(T("sonucYok")) + "</li>";
      $$("[data-li]", r).forEach(function (b) { b.onclick = function () { var x = V.lounge[+b.dataset.li]; ekle({ tur: "lounge", ad: x.kod + " · " + x.ad, alt: x.sehir + " · " + x.saat + " " + T("saat"), fiyat: x.fiyat }); }; });
    }
    q.addEventListener("input", ciz);
    $$(".pp-hizli button", r).forEach(function (b) { b.onclick = function () { q.value = b.dataset.k; ciz(); }; });
    ciz();
  };
  B["paket-olustur"] = function (r) {
    r.innerHTML = '<form class="pp-po"><div class="pp-seg" role="group" aria-label="' + esc(T("nasil")) + '"><button type="button" data-y="ucak" class="on">✈ ' + esc(T("ucak")) + '</button><button type="button" data-y="araba">🚗 ' + esc(T("araba")) + "</button></div>" +
      '<label data-ucak>' + esc(T("nereden")) + '<select data-n>' + V.havalimanlari.slice(0, 9).map(function (h) { return '<option value="' + h[0] + '">' + h[1] + " (" + h[0] + ")</option>"; }).join("") + "</select></label>" +
      '<label data-araba hidden>' + esc(T("rotaSec")) + '<select data-r>' + V.rotalar.map(function (x) { return '<option value="' + x.k + '">' + esc(ad(x.ad)) + "</option>"; }).join("") + "</select></label>" +
      '<label>' + esc(T("nereye")) + '<select data-u>' + V.ulkeler.map(function (u) { return '<option value="' + u.k + '">' + esc(ad(u.ad)) + "</option>"; }).join("") + "</select></label>" +
      '<label>' + esc(T("gunSayisi")) + '<input type="number" min="1" max="90" value="14" data-g></label><label>' + esc(T("kisiSayisi")) + '<input type="number" min="1" max="9" value="2" data-k></label>' +
      '<button class="pp-btn pp-btn-ana" type="submit">' + esc(T("olustur")) + '</button></form><div class="pp-po-s" aria-live="polite"></div>';
    var yol = "ucak";
    $$("[data-y]", r).forEach(function (b) { b.onclick = function () { yol = b.dataset.y; $$("[data-y]", r).forEach(function (x) { x.classList.toggle("on", x === b); }); $("[data-ucak]", r).hidden = yol !== "ucak"; $("[data-araba]", r).hidden = yol !== "araba"; if (yol === "araba") $("[data-u]", r).value = "TR"; }; });
    $("form", r).addEventListener("submit", function (e) {
      e.preventDefault();
      var u = bul($("[data-u]", r).value), g = Math.max(1, Math.min(90, +$("[data-g]", r).value || 14)), k = Math.max(1, Math.min(9, +$("[data-k]", r).value || 1));
      var kalemler = [], o = onerPaket(u, ihtiyac(g, 1, false), g);
      kalemler.push({ tur: "esim", ad: ad(u.ad) + " · " + o.p[0] + " GB", alt: o.p[1] + " " + T("gun") + (o.adet > 1 ? " × " + o.adet : ""), fiyat: o.p[2] * o.adet, adet: k });
      if (yol === "ucak") {
        var lk = $("[data-n]", r).value, l = V.lounge.filter(function (x) { return x.kod === lk; })[0];
        if (l) kalemler.push({ tur: "lounge", ad: l.kod + " · " + l.ad, alt: l.sehir + " · " + l.saat + " " + T("saat"), fiyat: l.fiyat, adet: k });
      } else {
        var ro = V.rotalar.filter(function (x) { return x.k === $("[data-r]", r).value; })[0];
        var eu = bul("europe"); kalemler.push({ tur: "esim", ad: ad(eu.ad) + " · 3 GB", alt: "30 " + T("gun") + " · " + ad(ro.ad), fiyat: eu.paket[2][2], adet: 1 });
        ro.u.forEach(function (c) { var v = vinyetSec(c, "gd", g); if (v) kalemler.push({ tur: "vignette", ad: ad(V.yol[c].ad) + " · " + (v.n > 1 ? "2 × " : "") + sureAd(v.g), alt: T("plaka") + ": —", fiyat: Math.round((v.f + V.HIZMET_EUR) * V.KUR), adet: 1 }); });
      }
      var ara = kalemler.reduce(function (t, x) { return t + x.fiyat * x.adet; }, 0), ind = Math.round(ara * V.PAKET_INDIRIM);
      var s = $(".pp-po-s", r);
      s.innerHTML = '<ul class="pp-po-l">' + kalemler.map(function (x) { return '<li><span class="pp-tur pp-tur-' + x.tur + '">' + (x.tur === "esim" ? "eSIM" : x.tur === "lounge" ? "Lounge" : "Vignette") + "</span><div><b>" + esc(x.ad) + "</b><small>" + esc(x.alt) + (x.adet > 1 ? " · " + x.adet + " " + esc(T("kisi")) : "") + "</small></div><em>" + para(x.fiyat * x.adet) + "</em></li>"; }).join("") +
        '</ul><div class="pp-po-t"><span>' + esc(T("paketIndirim")) + "</span><s>" + para(ara) + "</s><b>" + para(ara - ind) + '</b></div><button type="button" class="pp-btn pp-btn-ana" data-hepsi>' + esc(T("hepsiniEkle")) + "</button>";
      $("[data-hepsi]", s).onclick = function () { kalemler.forEach(ekle); acCekmece(); };
      olc("bundle_built", { mode: yol, country: u.k, items: kalemler.length });
    });
  };
  B.yorumlar = function (r) {
    r.innerHTML = '<div class="pp-yorumlar">' + V.yorumlar.map(function (y) {
      return '<figure class="pp-yorum"><div class="pp-yildiz" aria-label="5/5">★★★★★</div><blockquote>“' + esc(y.m) + '”</blockquote><figcaption><b>' + esc(y.ad) + "</b> · " + y.t + (y.dil ? " · " + esc(y.dil) : "") + "</figcaption></figure>";
    }).join("") + '</div><p class="pp-mini">' + esc(T("yorumNot")) + "</p>";
  };
  B.bulten = function (r) {
    r.innerHTML = '<form class="pp-bulten"><div class="pp-seg" role="group" aria-label="' + esc(T("kanal")) + '"><button type="button" class="on" data-c="wa">WhatsApp</button><button type="button" data-c="mail">E-mail</button></div><input required data-i type="tel" placeholder="+49 …" aria-label="WhatsApp"><label class="pp-c"><input type="checkbox" required> ' + esc(T("onay")) + '</label><button class="pp-btn pp-btn-ana" type="submit">' + esc(T("kaydol")) + "</button></form>";
    $$("[data-c]", r).forEach(function (b) { b.onclick = function () { $$("[data-c]", r).forEach(function (x) { x.classList.toggle("on", x === b); }); var i = $("[data-i]", r); i.type = b.dataset.c === "wa" ? "tel" : "email"; i.placeholder = b.dataset.c === "wa" ? "+49 …" : "ad@ornek.de"; }; });
    $("form", r).addEventListener("submit", function (e) { e.preventDefault(); r.innerHTML = '<p class="pp-tamam">✓ ' + esc(T("bultenTamam")) + "</p>"; olc("sign_up", { method: "newsletter" }); });
  };
  B.ortaklik = function (r) {
    r.innerHTML = '<div class="pp-ortak"><div class="pp-ortak-f"><input data-a placeholder="' + esc(T("adSoyad")) + '" aria-label="' + esc(T("adSoyad")) + '"><button type="button" class="pp-btn pp-btn-ana" data-o>' + esc(T("kodOlustur")) + '</button></div><div class="pp-ortak-s"></div></div>';
    $("[data-o]", r).onclick = function () {
      var a = ($("[data-a]", r).value || "GEZGIN").toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g, "").replace(/[ÇĞİÖŞÜ]/g, function (c) { return { "Ç": "C", "Ğ": "G", "İ": "I", "Ö": "O", "Ş": "S", "Ü": "U" }[c]; }).slice(0, 8) || "GEZGIN";
      var kod = a + (10 + Math.floor(Math.random() * 89)), link = "https://pasaport.io/?ref=" + kod;
      $(".pp-ortak-s", r).innerHTML = '<div class="pp-kod-kutu"><b>' + kod + '</b><code>' + link + '</code><button type="button" class="pp-btn" data-k>' + esc(T("kopyala")) + '</button></div><div class="pp-istat"><div><b>0</b><span>Klik</span></div><div><b>0</b><span>' + (S.dil === "de" ? "Verkäufe" : S.dil === "en" ? "Sales" : "Satış") + '</span></div><div><b>%8</b><span>' + (S.dil === "de" ? "Provision" : S.dil === "en" ? "Commission" : "Komisyon") + "</span></div></div>";
      $("[data-k]", r).onclick = function () { try { navigator.clipboard.writeText(link); } catch (e) {} bildir(T("kopyalandi")); };
      olc("affiliate_code", { code: kod });
    };
  };
  B.b2b = function (r) {
    var m = [["Yılmaz Reisen", "Köln", 14, 6, 2], ["Anadolu Tours", "Duisburg", 9, 9, 0], ["Ege Reisebüro", "Stuttgart", 22, 4, 11]];
    var ciro = m.reduce(function (t, x) { return t + x[2] * 501 + x[3] * 1290 + x[4] * 1400; }, 0);
    r.innerHTML = '<div class="pp-b2b"><div class="pp-b2b-ust"><b>Demo GmbH · ' + (S.dil === "tr" ? "Acente paneli" : S.dil === "de" ? "Agentur-Portal" : "Agency portal") + '</b><span>' + (S.dil === "tr" ? "Komisyon" : S.dil === "de" ? "Provision" : "Commission") + ' %12 · Net 30</span></div>' +
      '<div class="pp-istat"><div><b>' + m.reduce(function (t, x) { return t + x[2]; }, 0) + '</b><span>eSIM</span></div><div><b>' + m.reduce(function (t, x) { return t + x[3]; }, 0) + '</b><span>Lounge</span></div><div><b>' + m.reduce(function (t, x) { return t + x[4]; }, 0) + '</b><span>Vignette</span></div><div><b>' + para(Math.round(ciro * 0.12)) + '</b><span>' + (S.dil === "tr" ? "Kazanç" : S.dil === "de" ? "Ertrag" : "Earnings") + "</span></div></div>" +
      '<div class="pp-tablo-k"><table><thead><tr><th>' + (S.dil === "tr" ? "Şube" : "Filiale") + "</th><th>eSIM</th><th>Lounge</th><th>Vign.</th></tr></thead><tbody>" + m.map(function (x) { return "<tr><td>" + x[0] + "<small>" + x[1] + "</small></td><td>" + x[2] + "</td><td>" + x[3] + "</td><td>" + x[4] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<div class="pp-b2b-a"><button type="button" class="pp-btn pp-btn-ana" data-toplu>' + (S.dil === "tr" ? "Toplu eSIM kodu üret (10)" : S.dil === "de" ? "10 eSIM-Codes erzeugen" : "Generate 10 eSIM codes") + '</button><button type="button" class="pp-btn" data-csv>CSV</button></div><div class="pp-kodlar"></div><p class="pp-mini">Demo</p></div>';
    var kodlar = [];
    $("[data-toplu]", r).onclick = function () {
      kodlar = []; for (var i = 0; i < 10; i++) kodlar.push("PSP-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase());
      $(".pp-kodlar", r).innerHTML = kodlar.map(function (k) { return "<code>" + k + "</code>"; }).join("");
    };
    $("[data-csv]", r).onclick = function () {
      var csv = "sube,sehir,esim,lounge,vignette\n" + m.map(function (x) { return x.join(","); }).join("\n") + (kodlar.length ? "\n\nkod\n" + kodlar.join("\n") : "");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "pasaport-acente-demo.csv"; document.body.appendChild(a); a.click(); a.remove();
    };
  };

  /* ---------- Ödeme → QR teslim ---------- */
  function odeme() {
    kapatCekmece(); var h = hesapla(), vin = S.sepet.some(function (x) { return x.tur === "vignette"; });
    var m = modal('<div class="pp-md-govde"><h3>' + esc(T("odemeBaslik")) + '</h3><form class="pp-odeme"><label>' + esc(T("adSoyad")) + '<input required autocomplete="name"></label><label>' + esc(T("eposta")) + '<input required type="email" autocomplete="email"></label><label>' + esc(T("telefon")) + '<input type="tel" autocomplete="tel"></label>' +
      (vin ? '<label>' + esc(T("plaka")) + '<input required data-plaka placeholder="' + esc(T("plakaPh")) + '"></label>' : "") +
      '<fieldset><legend>' + esc(T("odemeYontem")) + '</legend><div class="pp-yontem"><label><input type="radio" name="y" checked> ' + esc(T("kart")) + '</label><label><input type="radio" name="y"> Klarna</label><label><input type="radio" name="y"> PayPal</label><label><input type="radio" name="y"> Apple Pay</label></div></fieldset>' +
      '<div class="pp-ck-t"><span>' + esc(T("toplam")) + "</span><b>" + para(h.top) + '</b></div><button class="pp-btn pp-btn-ana pp-tam" type="submit">🔒 ' + esc(T("tamamla")) + '</button><p class="pp-mini">' + esc(T("demoNot")) + "</p></form></div>", "pp-md-odeme");
    olc("begin_checkout", { value: h.top });
    $("form", m).addEventListener("submit", function (e) { e.preventDefault(); var pl = $("[data-plaka]", m); teslim(pl ? pl.value.toUpperCase() : ""); });
  }
  function teslim(plaka) {
    var no = "PSP-" + Date.now().toString(36).toUpperCase().slice(-6), sepet = S.sepet.slice(), h = hesapla();
    olc("purchase", { transaction_id: no, value: h.top });
    var esim = sepet.filter(function (x) { return x.tur === "esim"; }), lo = sepet.filter(function (x) { return x.tur === "lounge"; }), vi = sepet.filter(function (x) { return x.tur === "vignette"; });
    var m = modal('<div class="pp-md-govde pp-teslim"><p class="pp-et o">✓ ' + esc(T("siparisNo")) + " " + no + '</p><h3>' + esc(T("teslimBaslik")) + "</h3><p>" + esc(T("teslimAlt")) + '</p>' +
      (esim.length ? '<div class="pp-qr-k"><div class="pp-qr" data-qr="LPA:1$smdp.pasaport.io$' + no + '-DEMO"></div><div><b>' + esc(esim[0].ad) + '</b><small>' + esc(esim[0].alt) + '</small><a class="pp-btn pp-btn-ana" href="#" data-tek>' + esc(T("tekDokun")) + "</a></div></div>" : "") +
      (lo.length ? '<div class="pp-qr-k"><div class="pp-qr" data-qr="LOUNGE-' + no + '"></div><div><b>' + esc(lo[0].ad) + "</b><small>" + esc(lo[0].alt) + "</small><small>Voucher · " + no + "-L</small></div></div>" : "") +
      (vi.length ? '<div class="pp-vin-ok"><b>Vignette ✓ ' + esc(plaka) + "</b><ul>" + vi.map(function (x) { return "<li>" + esc(x.ad) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<div class="pp-teslim-a"><a class="pp-btn pp-wa" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent("Pasaport.io " + T("siparisNo") + " " + no) + '">' + esc(T("whatsappGonder")) + '</a><button type="button" class="pp-btn" data-kapat>' + esc(T("kapat")) + "</button></div></div>", "pp-md-teslim");
    $$(".pp-qr", m).forEach(function (q) { if (window.QRCode) { try { new window.QRCode(q, { text: q.dataset.qr, width: 132, height: 132, colorDark: "#173d3a", colorLight: "#ffffff" }); } catch (e) { q.textContent = q.dataset.qr; } } else q.textContent = q.dataset.qr; });
    var t = $("[data-tek]", m); if (t) t.onclick = function (e) { e.preventDefault(); bildir("iOS 17.4+: Ayarlar › Hücresel › eSIM ekle (demo)"); };
    $("[data-kapat]", m).onclick = kapatModal;
    S.sepet = []; kaydet();
  }

  /* ---------- Terk edilmiş sepet ---------- */
  function terk() {
    if (!S.sepet.length || $(".pp-modal") || ($(".pp-cekmece") && $(".pp-cekmece").classList.contains("acik")) || terk.gosterildi) return;
    terk.gosterildi = true;
    var b = document.body.appendChild(el('<div class="pp-terk" role="dialog" aria-label="' + esc(T("terkBaslik")) + '"><button class="pp-x" type="button" aria-label="Kapat">×</button><b>' + esc(T("terkBaslik")) + " (" + S.sepet.length + ")</b><p>" + esc(T("terkAlt")) + '</p><form><input type="text" required placeholder="WhatsApp / e-mail" aria-label="WhatsApp / e-mail"><button class="pp-btn pp-btn-ana" type="submit">' + esc(T("hatirlat")) + '</button></form><button type="button" class="pp-link" data-d>' + esc(T("devam")) + " →</button></div>"));
    requestAnimationFrame(function () { b.classList.add("acik"); });
    $(".pp-x", b).onclick = function () { b.remove(); };
    $("[data-d]", b).onclick = function () { b.remove(); acCekmece(); };
    $("form", b).onsubmit = function (e) { e.preventDefault(); b.innerHTML = '<p class="pp-tamam">✓ ' + esc(T("kaydedildi")) + "</p>"; setTimeout(function () { b.remove(); }, 2600); olc("cart_reminder_optin"); };
  }
  var bosZ; function hareket() { clearTimeout(bosZ); bosZ = setTimeout(terk, 25000); }

  /* ---------- Dil / para ---------- */
  function cevir() {
    document.documentElement.lang = S.dil;
    $$("[data-i18n]").forEach(function (e) { e.textContent = T(e.dataset.i18n); });
    $$("[data-i18n-html]").forEach(function (e) { e.innerHTML = T(e.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach(function (e) { e.placeholder = T(e.dataset.i18nPh); });
    $$("[data-pp-dil]").forEach(function (b) { b.classList.toggle("on", b.dataset.ppDil === S.dil); b.setAttribute("aria-pressed", b.dataset.ppDil === S.dil); });
    $$("[data-pp-kur]").forEach(function (b) { b.classList.toggle("on", b.dataset.ppKur === S.kur); });
    $$("[data-pp-para]").forEach(function (e) { e.textContent = para(+e.dataset.ppPara); });
    $$("[data-pp]").forEach(function (r, i) { r.dataset.n = i; var f = B[r.dataset.pp]; if (f) f(r); });
    var c = $(".pp-cekmece"); if (c && c.classList.contains("acik")) cekmece();
    var rb = $(".pp-ref"); if (rb) rb.textContent = T("refAktif") + " · " + S.ref;
  }

  /* ---------- Başlat ---------- */
  function baslat() {
    var q = new URLSearchParams(location.search);
    if (q.get("lang") && D[q.get("lang")]) S.dil = q.get("lang");
    if (q.get("ref")) { S.ref = q.get("ref").toUpperCase().slice(0, 16); LS.set("ref", S.ref); }
    if (S.ref) document.body.insertBefore(el('<div class="pp-ref" role="note"></div>'), document.body.firstChild);
    document.addEventListener("click", function (e) {
      var t;
      if ((t = e.target.closest("[data-pp-ulke]"))) { e.preventDefault(); ulkeModal(t.dataset.ppUlke); }
      else if ((t = e.target.closest("[data-pp-paket]"))) { paketEkle(t.dataset.ppPaket, +t.dataset.i); }
      else if ((t = e.target.closest("[data-pp-sepet-ac]"))) { e.preventDefault(); kapatModal(); acCekmece(); }
      else if ((t = e.target.closest(".pp-sil"))) { S.sepet = S.sepet.filter(function (x) { return x.id !== t.dataset.id; }); kaydet(); cekmece(); }
      else if ((t = e.target.closest("[data-pp-odeme]"))) { odeme(); }
      else if ((t = e.target.closest("[data-pp-dil]"))) { S.dil = t.dataset.ppDil; LS.set("dil", S.dil); cevir(); olc("language", { lang: S.dil }); }
      else if ((t = e.target.closest("[data-pp-kur]"))) { S.kur = t.dataset.ppKur; LS.set("kur", S.kur); cevir(); }
      else if ((t = e.target.closest("[data-pp-modal]"))) { e.preventDefault(); var m = modal('<div class="pp-md-govde"><div data-pp-w="' + t.dataset.ppModal + '"></div></div>'); var w = $("[data-pp-w]", m); if (B[t.dataset.ppModal]) B[t.dataset.ppModal](w); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { kapatModal(); kapatCekmece(); } });
    ["scroll", "click", "keydown", "touchstart"].forEach(function (ev) { window.addEventListener(ev, hareket, { passive: true }); });
    if (!$(".pp-wa-yuzen") && !document.body.hasAttribute("data-pp-wa-yok")) document.body.appendChild(el('<a class="pp-wa-yuzen" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent("Merhaba Pasaport.io") + '" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg></a>'));
    cevir(); sayac();
    var z = LS.get("sepetZaman", 0); if (S.sepet.length && Date.now() - z > 60000) setTimeout(terk, 3500);
    hareket();
  }
  window.PP = { sozluk: function (o) { ["tr", "en", "de"].forEach(function (d) { Object.assign(EK[d], o[d] || {}); }); }, ekle: ekle, acCekmece: acCekmece, ulkeModal: ulkeModal, T: T, para: para, durum: S, yenile: function () { cevir(); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
