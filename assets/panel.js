// ===== Yönetim paneli: başvurular, teklif gönderimi, ödemeler =====
(function () {
  "use strict";
  var R = document.getElementById("panel"); if (!R) return;
  var A = window.AJANS, TL = FIYAT.TL, e = window.esc;
  var S = { tab: "tumu", list: [], gorunum: (function () { try { return sessionStorage.getItem("panel_gorunum") || "satis"; } catch (x) { return "satis"; } })() };
  var DURUM = { gonderildi: "Onay bekliyor", onaylandi: "Ödeme bekliyor", odendi: "Ödendi", iptal: "İptal" };
  var tarih = function (s) { return new Date(s).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }); };
  var link = function (t) { return location.href.replace(/panel\.html.*$/, "teklif.html?t=" + t.token); };
  var wa = function (tel) { var n = String(tel || "").replace(/\D/g, "").slice(-10); return n.length === 10 ? "90" + n : ""; };

  function giris(adim, msg) {
    R.innerHTML = (API.mode === "demo" ? '<div class="demo">Demo modu: herhangi bir e-posta, kod <b>123456</b>.</div>' : "") +
      '<div class="box" style="max-width:440px;margin:30px auto"><h2 style="margin-bottom:12px">Yönetim paneli</h2>' + (msg ? '<p class="err">' + e(msg) + "</p>" : "") +
      '<form id="g" class="frm" style="grid-template-columns:1fr"><label>E-posta<input name="e" type="email" required value="' + e(S.eposta || "") + '"></label>' +
      (adim === "kod" && API.mode !== "demo" ? '<p class="small" style="margin-bottom:10px">E-postanıza bir <b>giriş bağlantısı</b> gönderdik. Bağlantıya tıklayın, panel açılır (bu sekme de kendiliğinden yenilenir). E-postada 6 haneli kod varsa aşağıya da yazabilirsiniz.</p>' : "") +
      (adim === "kod" ? '<label>Giriş kodu<input name="k" inputmode="numeric" maxlength="6" required></label>' : "") +
      '</form><button class="btn btn-p" id="gb">' + (adim === "kod" ? "Giriş" : "Giriş bağlantısı gönder") + "</button></div>";
    document.getElementById("gb").onclick = function () {
      var f = document.getElementById("g"); if (!f.reportValidity()) return; S.eposta = f.e.value.trim();
      if (API.mode === "demo" && adim !== "kod") return giris("kod");
      var p = adim === "kod" ? API.girisYap(S.eposta, f.k.value) : API.girisYap(S.eposta);
      p.then(function () { return adim === "kod" ? yukle() : giris("kod"); }).catch(function (x) { giris(adim, x.message); });
    };
  }

  function yukle() {
    if (S.gorunum === "satis") return CRM.goster(R, ust(), baglaUst).catch(hataGoster);
    return API.tumTeklifler().then(function (l) { S.list = l || []; ciz(); }).catch(hataGoster);
  }
  function hataGoster(x) { R.innerHTML = ust() + '<p class="err">Veriler yüklenemedi: ' + e(x.message) + "</p>"; baglaUst(); }

  // Başlık: görünüm değiştirici (Satış takibi / Teklifler) + çıkış
  function ust() {
    return (API.mode === "demo" ? '<div class="demo">Demo modu · <button class="btn btn-o sm" id="rs">Demo verilerini sıfırla</button></div>' : "") +
      '<div class="pn-ust"><h1>Yönetim paneli</h1><div class="pn-gor">' +
      [["satis", "Satış takibi"], ["teklif", "Teklifler"]].map(function (x) { return '<button data-g="' + x[0] + '"' + (S.gorunum === x[0] ? ' class="on"' : "") + ">" + x[1] + "</button>"; }).join("") +
      '</div><button class="btn btn-o sm" id="out">Çıkış</button></div>';
  }
  function baglaUst() {
    R.querySelectorAll("[data-g]").forEach(function (b) { b.onclick = function () { S.gorunum = b.dataset.g; try { sessionStorage.setItem("panel_gorunum", S.gorunum); } catch (x) {} yukle(); }; });
    document.getElementById("out").onclick = function () { API.cikis().then(function () { giris(); }); };
    var rs = document.getElementById("rs"); if (rs) rs.onclick = function () { if (confirm("Tüm demo verileri silinip örnekler yeniden yüklensin mi?")) API.sifirla().then(yukle); };
  }

  function ciz() {
    var L = S.list, f = S.tab === "tumu" ? L : L.filter(function (t) { return t.durum === S.tab; });
    var toplamOdeme = L.reduce(function (s, t) { return s + (t.odemeler || []).filter(function (o) { return o.yontem === "kart" || o.onayli; }).reduce(function (a, o) { return a + o.tutar; }, 0); }, 0);
    var bekleyen = L.filter(function (t) { return t.durum !== "iptal" && t.durum !== "odendi"; }).reduce(function (s, t) { return s + t.hesap.tek; }, 0);
    R.innerHTML = ust() +
      '<div class="kpi4"><div><b>' + L.length + "</b><span>Toplam başvuru</span></div><div><b>" + L.filter(function (t) { return t.durum === "gonderildi"; }).length + "</b><span>Onay bekleyen</span></div><div><b>" + TL(bekleyen) + "</b><span>Açık teklif tutarı</span></div><div><b>" + TL(toplamOdeme) + "</b><span>Tahsil edilen</span></div></div>" +
      '<div class="pn-tabs">' + [["tumu", "Tümü"], ["gonderildi", "Onay bekleyen"], ["onaylandi", "Ödeme bekleyen"], ["odendi", "Ödenen"], ["iptal", "İptal"]].map(function (x) { return '<button data-t="' + x[0] + '"' + (S.tab === x[0] ? ' class="on"' : "") + ">" + x[1] + "</button>"; }).join("") + "</div>" +
      '<div class="tbl"><table><thead><tr><th>No / tarih</th><th>İşletme</th><th>Hizmetler</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>' +
      (f.length ? f.map(function (t) {
        var b = t.basvuru.bilgi, tel = wa(b.tel);
        var msg = "Merhaba " + b.ad + ", " + A.marka + " olarak " + b.isletme + " için hazırladığımız " + t.no + " numaralı teklifiniz hazır: " + link(t);
        var havale = (t.odemeler || []).find(function (o) { return o.yontem === "havale" && !o.onayli; });
        return "<tr><td><b>" + e(t.no) + "</b><br><small class=\"mute\">" + tarih(t.olusturma) + "</small></td><td><b>" + e(b.isletme) + "</b><br><small>" + e(b.ad) + " · " + e(b.tel) + "<br>" + e(b.eposta) + "</small></td><td><small>" + t.hesap.satirlar.map(function (r) { return e(r.ad); }).join("<br>") + "</small>" + (b.not ? '<br><small class="mute">Not: ' + e(b.not) + "</small>" : "") + "</td><td><b>" + TL(t.hesap.tek) + "</b>" + (t.hesap.ay ? "<br><small>+" + TL(t.hesap.ay) + "/ay</small>" : "") + "</td><td>" + DURUM[t.durum] + (havale ? '<br><small style="color:var(--warn)">Havale bildirildi</small>' : "") + "</td><td style=\"white-space:nowrap\">" +
          '<a class="btn btn-o sm" href="' + link(t) + '" target="_blank">Aç</a> ' +
          (tel ? '<a class="btn btn-w sm" target="_blank" rel="noopener" href="https://wa.me/' + tel + "?text=" + encodeURIComponent(msg) + '">WhatsApp</a> ' : "") +
          '<a class="btn btn-o sm" href="mailto:' + e(b.eposta) + "?subject=" + encodeURIComponent(A.marka + " teklifiniz " + t.no) + "&body=" + encodeURIComponent(msg) + '">E-posta</a> ' +
          (havale ? '<button class="btn btn-p sm" data-hv="' + t.token + '">Havaleyi onayla</button> ' : "") +
          (t.durum !== "iptal" && t.durum !== "odendi" ? '<button class="btn btn-o sm" data-ip="' + t.token + '">İptal</button>' : "") + "</td></tr>";
      }).join("") : '<tr><td colspan="6" class="mute">Kayıt yok. Siteden bir teklif oluşturun.</td></tr>') + "</tbody></table></div>";
    R.querySelectorAll("[data-t]").forEach(function (b) { b.onclick = function () { S.tab = b.dataset.t; ciz(); }; });
    baglaUst();
    R.querySelectorAll("[data-ip]").forEach(function (b) { b.onclick = function () { if (confirm("Teklif iptal edilsin mi?")) API.teklifGuncelle(b.dataset.ip, { durum: "iptal" }).then(yukle); }; });
    R.querySelectorAll("[data-hv]").forEach(function (b) { b.onclick = function () {
      var t = S.list.find(function (x) { return x.token === b.dataset.hv; });
      var od = (t.odemeler || []).map(function (o) { return o.yontem === "havale" ? Object.assign({}, o, { onayli: true }) : o; });
      API.teklifGuncelle(t.token, { odemeler: od, durum: "odendi" }).then(yukle);
    }; });
  }

  API.girisVar().then(function (v) { v ? yukle() : giris(); });
})();
