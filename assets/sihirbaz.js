// ===== Teklif sihirbazı: 4 adım, canlı fiyat, gönderince otomatik teklif =====
(function () {
  "use strict";
  var W = document.getElementById("wiz"), SUM = document.getElementById("sum");
  if (!W) return;
  var K = FIYAT.KALEMLER, TL = FIYAT.TL, e = window.esc;
  var SEKTOR = ["Oto servis / galeri", "Klinik / sağlık", "Güzellik / kuaför", "Restoran / kafe", "Emlak", "Eğitim / kurs", "Spor salonu", "Diğer"];
  var HEDEF = [
    ["bulunma", "Google'da bulunmak", "Aramalarda ve haritada görünmek", ["site", "seo"]],
    ["musteri", "Müşteri takibi", "Kayıt, geçmiş, geri çağırma", ["crm", "uygulama"]],
    ["mesaj", "Mesajlara otomatik cevap", "WhatsApp'ta 7/24 asistan", ["wa"]],
    ["sosyal", "Sosyal medya", "Paylaşımlar kendiliğinden hazırlansın", ["icerik"]],
    ["odeme", "Online ödeme", "Kartla, taksitle tahsilat", ["odeme"]],
    ["randevu", "Online randevu", "Takvimli randevu sistemi", ["randevu"]]
  ];
  var q = new URLSearchParams(location.search);
  var S = { adim: 0, sektor: "", hedef: [], secim: [], olcek: "tek", acil: "normal", bilgi: {} };
  var pk = FIYAT.PAKETLER.find(function (p) { return p.id === q.get("paket"); });
  if (pk) { S.secim = pk.kalemler.slice(); S.adim = 0; }

  function ozet() {
    var h = FIYAT.hesapla(S.secim, S.olcek, S.acil);
    SUM.innerHTML = "<h3>Anlık fiyat</h3>" + (h.satirlar.length
      ? h.satirlar.map(function (r) { return '<div class="row"><span>' + e(r.ad) + '</span><span>' + (r.tek ? TL(r.tek) : "") + (r.ay ? (r.tek ? " + " : "") + TL(r.ay) + "/ay" : "") + "</span></div>"; }).join("") +
        (h.carpan !== 1 ? '<div class="row"><span>Ölçek / aciliyet katsayısı</span><span>×' + h.carpan.toFixed(2).replace(".", ",") + "</span></div>" : "") +
        '<div class="tot"><span>Tek seferlik</span><b>' + TL(h.tek) + "</b></div>" +
        (h.ay ? '<div class="row" style="border:0"><span>Aylık (isteğe bağlı)</span><span>' + TL(h.ay) + " / ay</span></div>" : "") +
        '<p class="small">KDV hariç · %50 başlangıçta: <b>' + TL(h.kapora) + "</b></p>" +
        (h.indirim ? '<div class="save">Paket avantajı: ' + TL(h.indirim) + " tasarruf</div>" : "")
      : '<p class="empty">Hizmet seçtikçe fiyat burada oluşur.</p>');
  }

  var BAR = function () { return '<div class="stepbar">' + [0, 1, 2, 3].map(function (i) { return "<i" + (i <= S.adim ? ' class="on"' : "") + "></i>"; }).join("") + "</div>"; };
  var NAVB = function (ileri, geri) { return '<div class="nav-b">' + (S.adim ? '<button class="btn btn-o" id="geri">← Geri</button>' : "<span></span>") + '<button class="btn btn-p" id="ileri">' + (ileri || "Devam →") + "</button></div>"; };

  function ciz() {
    var h = "";
    if (S.adim === 0) {
      h = BAR() + '<div class="q"><h2>İşletmeniz hangi sektörde?</h2><p>Size uygun örnekleri ve önerileri hazırlayalım.</p><div class="opts">' +
        SEKTOR.map(function (s, i) { return '<div class="opt"><input type="radio" name="sk" id="sk' + i + '" value="' + e(s) + '"' + (S.sektor === s ? " checked" : "") + '><label for="sk' + i + '"><b>' + e(s) + "</b></label></div>"; }).join("") +
        '</div><p class="err" id="er" hidden></p>' + NAVB() + "</div>";
    } else if (S.adim === 1) {
      h = BAR() + '<div class="q"><h2>Neye ihtiyacınız var?</h2><p>Birden fazla seçebilirsiniz; bir sonraki adımda ayrıntılı düzenleyebilirsiniz.</p><div class="opts">' +
        HEDEF.map(function (x) { return '<div class="opt"><input type="checkbox" id="h_' + x[0] + '" value="' + x[0] + '"' + (S.hedef.indexOf(x[0]) > -1 ? " checked" : "") + '><label for="h_' + x[0] + '"><b>' + x[1] + "</b><span>" + x[2] + "</span></label></div>"; }).join("") +
        '</div><p class="err" id="er" hidden></p>' + NAVB() + "</div>";
    } else if (S.adim === 2) {
      var grup = {};
      Object.keys(K).forEach(function (k) { (grup[K[k].grup] = grup[K[k].grup] || []).push(k); });
      h = BAR() + '<div class="q"><h2>Hizmetleri netleştirin</h2><p>İhtiyacınıza göre ekleyip çıkarın; fiyat sağda anında güncellenir.</p>' +
        Object.keys(grup).map(function (g) {
          return '<div class="grp-t">' + g + '</div><div class="opts">' + grup[g].map(function (k) {
            var it = K[k];
            return '<div class="opt"><input type="checkbox" id="k_' + k + '" value="' + k + '"' + (S.secim.indexOf(k) > -1 ? " checked" : "") + '><label for="k_' + k + '"><b>' + it.ad + "</b><span>" + it.acik + "</span><em>" + [it.tek ? TL(it.tek) : "", it.ay ? TL(it.ay) + "/ay" : ""].filter(Boolean).join(" + ") + "</em></label></div>";
          }).join("") + "</div>";
        }).join("") +
        '<div class="grp-t">İşletme ölçeği</div><div class="opts">' + Object.keys(FIYAT.OLCEK).map(function (k) { return '<div class="opt"><input type="radio" name="ol" id="ol_' + k + '" value="' + k + '"' + (S.olcek === k ? " checked" : "") + '><label for="ol_' + k + '"><b>' + FIYAT.OLCEK[k].ad + "</b></label></div>"; }).join("") + "</div>" +
        '<div class="grp-t">Teslim hızı</div><div class="opts">' + Object.keys(FIYAT.ACIL).map(function (k) { return '<div class="opt"><input type="radio" name="ac" id="ac_' + k + '" value="' + k + '"' + (S.acil === k ? " checked" : "") + '><label for="ac_' + k + '"><b>' + FIYAT.ACIL[k].ad + "</b></label></div>"; }).join("") + "</div>" +
        '<p class="err" id="er" hidden></p>' + NAVB() + "</div>";
    } else {
      var b = S.bilgi;
      h = BAR() + '<div class="q"><h2>Teklifiniz nereye gönderilsin?</h2><p>Gönderdiğiniz anda kişiye özel teklif sayfanız oluşur.</p><form id="fb" class="frm">' +
        '<label>Ad soyad<input name="ad" required autocomplete="name" value="' + e(b.ad) + '"></label>' +
        '<label>İşletme adı<input name="isletme" required value="' + e(b.isletme) + '"></label>' +
        '<label>Telefon (WhatsApp)<input name="tel" type="tel" required autocomplete="tel" placeholder="05xx xxx xx xx" value="' + e(b.tel) + '"></label>' +
        '<label>E-posta<input name="eposta" type="email" required autocomplete="email" value="' + e(b.eposta) + '"></label>' +
        '<label>Şehir<input name="sehir" value="' + e(b.sehir) + '"></label>' +
        '<label>Mevcut web sitesi / Instagram<input name="link" placeholder="varsa" value="' + e(b.link) + '"></label>' +
        '<label class="full">Eklemek istedikleriniz<textarea name="not" rows="3" placeholder="Örn. 2 şubemiz var, randevular telefonla alınıyor…">' + e(b.not) + "</textarea></label>" +
        '<label class="full chk"><input type="checkbox" name="kvkk" required><span><a href="kvkk.html" target="_blank">KVKK aydınlatma metnini</a> okudum; teklif hazırlanması ve benimle iletişim kurulması için bilgilerimin işlenmesine açık rıza veriyorum.</span></label>' +
        '</form><p class="err" id="er" hidden></p>' + NAVB("Teklifimi oluştur") + "</div>";
    }
    W.innerHTML = h; ozet(); bagla();
  }

  function hata(m) { var x = document.getElementById("er"); x.textContent = m; x.hidden = !m; }

  function bagla() {
    W.querySelectorAll("input").forEach(function (i) {
      i.addEventListener("change", function () {
        if (S.adim === 0) S.sektor = i.value;
        if (S.adim === 1) S.hedef = [].slice.call(W.querySelectorAll("input:checked")).map(function (x) { return x.value; });
        if (S.adim === 2) {
          S.secim = [].slice.call(W.querySelectorAll('input[id^="k_"]:checked')).map(function (x) { return x.value; });
          var o = W.querySelector('input[name="ol"]:checked'), a = W.querySelector('input[name="ac"]:checked');
          if (o) S.olcek = o.value; if (a) S.acil = a.value;
        }
        ozet();
      });
    });
    var g = document.getElementById("geri"); if (g) g.onclick = function () { kaydetForm(); S.adim--; ciz(); };
    document.getElementById("ileri").onclick = function () {
      if (S.adim === 0 && !S.sektor) return hata("Lütfen bir sektör seçin.");
      if (S.adim === 1) {
        if (!S.hedef.length) return hata("En az bir ihtiyaç seçin.");
        // hedeflerden öneri: seçim boşsa doldur
        if (!S.secim.length) HEDEF.forEach(function (x) { if (S.hedef.indexOf(x[0]) > -1) x[3].forEach(function (k) { if (S.secim.indexOf(k) < 0) S.secim.push(k); }); });
      }
      if (S.adim === 2 && !S.secim.length) return hata("En az bir hizmet seçin.");
      if (S.adim < 3) { S.adim++; ciz(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      gonder();
    };
  }
  function kaydetForm() { var f = document.getElementById("fb"); if (!f) return; ["ad", "isletme", "tel", "eposta", "sehir", "link", "not"].forEach(function (k) { S.bilgi[k] = f[k].value.trim(); }); }

  function gonder() {
    var f = document.getElementById("fb"); kaydetForm();
    if (!f.reportValidity()) return;
    if (!f.kvkk.checked) return hata("KVKK onayı gerekli.");
    var btn = document.getElementById("ileri"); btn.disabled = true; btn.textContent = "Teklif oluşturuluyor…";
    API.basvuruGonder({ sektor: S.sektor, hedef: S.hedef, secim: S.secim, olcek: S.olcek, acil: S.acil, bilgi: S.bilgi, kvkk: new Date().toISOString() })
      .then(function (t) { location.href = "teklif.html?t=" + encodeURIComponent(t.token) + "&yeni=1"; })
      .catch(function (x) { btn.disabled = false; btn.textContent = "Teklifimi oluştur"; hata(x.message); });
  }

  if (pk) S.adim = 0;
  ciz();
})();
