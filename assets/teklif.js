// ===== Kişiye özel teklif sayfası: görüntüle, onayla, öde (kart / havale) =====
(function () {
  "use strict";
  var O = document.getElementById("offer");
  if (!O) return;
  var A = window.AJANS, TL = FIYAT.TL, e = window.esc;
  var q = new URLSearchParams(location.search), tk = q.get("t");
  var DURUM = { gonderildi: "Onay bekliyor", onaylandi: "Onaylandı · ödeme bekleniyor", odendi: "Ödendi", iptal: "İptal" };
  var tarih = function (s) { return new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }); };

  function ciz(t) {
    var h = t.hesap, b = t.basvuru.bilgi, link = location.origin + location.pathname + "?t=" + t.token;
    var waMsg = encodeURIComponent("Merhaba, " + t.no + " numaralı teklifim hakkında görüşmek istiyorum: " + link);
    var odenen = (t.odemeler || []).reduce(function (s, o) { return s + (o.yontem === "kart" ? o.tutar : 0); }, 0);
    var havaleBildirildi = (t.odemeler || []).some(function (o) { return o.yontem === "havale"; });

    O.innerHTML = (API.mode === "demo" ? '<div class="demo no-print"><b>Demo modu:</b> Veriler bu tarayıcıda saklanır; ödeme adımı simülasyondur.</div>' : "") +
      (q.get("yeni") ? '<div class="note no-print" style="margin-bottom:20px"><b>Teklifiniz hazır!</b> Bu sayfanın bağlantısı ' + e(b.eposta) + " adresinize ve WhatsApp'ınıza iletilecek. Bağlantıyı kaydederek daha sonra da açabilirsiniz.</div>" : "") +
      '<div class="of-h"><div><span class="kicker" style="margin:0">Teklif ' + e(t.no) + "</span><h1>" + e(b.isletme) + '</h1><p class="mute">' + e(b.ad) + " · " + e(t.basvuru.sektor) + (b.sehir ? " · " + e(b.sehir) : "") + '</p></div>' +
      '<div style="text-align:right"><span class="status st-' + t.durum + '">' + DURUM[t.durum] + '</span><p class="small" style="margin-top:8px">Tarih: ' + tarih(t.olusturma) + "<br>Geçerlilik: " + tarih(t.gecerlilik) + "<br>Hazırlayan: " + e(A.marka) + "</p></div></div>" +
      '<table class="lines"><thead><tr><th>Hizmet</th><th>Tutar</th></tr></thead><tbody>' +
      h.satirlar.map(function (r) { return "<tr><td><b>" + e(r.ad) + "</b><br><small>" + e(r.acik) + "</small>" + (r.liste && r.liste > r.tek ? '<br><small style="color:var(--ok)">Ayrı ayrı: ' + TL(r.liste) + "</small>" : "") + "</td><td>" + (r.tek ? TL(Math.round(r.tek * h.carpan)) : "—") + (r.ay ? "<br><small>+ " + TL(r.ay) + "/ay</small>" : "") + "</td></tr>"; }).join("") +
      "</tbody></table>" +
      '<div class="totals">' +
      (h.carpan !== 1 ? "<div><span>Ölçek: " + FIYAT.OLCEK[h.olcek].ad + " · " + FIYAT.ACIL[h.acil].ad + "</span><span>×" + h.carpan.toFixed(2).replace(".", ",") + "</span></div>" : "") +
      "<div><span>Ara toplam (KDV hariç)</span><span>" + TL(h.tek) + "</span></div>" +
      "<div><span>KDV (%" + Math.round(A.kdv * 100) + ")</span><span>" + TL(h.kdv) + "</span></div>" +
      '<div class="g"><span>Genel toplam</span><span>' + TL(h.tek + h.kdv) + "</span></div>" +
      (h.ay ? '<div class="small"><span>Aylık hizmetler (isteğe bağlı)</span><span>' + TL(h.ay) + " + KDV / ay</span></div>" : "") +
      "</div>" +
      '<div class="note" style="margin-top:20px"><b>Ödeme planı:</b> Onayda %50 (' + TL(Math.round((h.tek + h.kdv) / 2)) + " KDV dahil), kalan %50 teslimde. Teslim sonrası mülkiyet işletmenize geçer. Koşullar: <a href=\"mesafeli-satis.html\">mesafeli satış sözleşmesi</a>, <a href=\"iptal-iade.html\">iptal ve iade</a>.</div>" +
      '<div class="paybox" id="pay"></div>' +
      '<div class="cta no-print" style="margin-top:18px"><button class="btn btn-o" onclick="window.print()">PDF / Yazdır</button>' +
      (A.whatsapp ? '<a class="btn btn-w" href="https://wa.me/' + A.whatsapp + "?text=" + waMsg + '" rel="nofollow">WhatsApp\'tan soru sor</a>' : "") + "</div>";

    var P = document.getElementById("pay"), kaporaKdvli = Math.round((h.tek + h.kdv) / 2);
    if (t.durum === "gonderildi") {
      P.innerHTML = "<h3>Teklifi onaylayın</h3><p class=\"mute\" style=\"margin:6px 0 16px\">Onayladığınızda ödeme adımına geçersiniz. Çalışmaya ilk ödemeden sonra başlanır.</p>" +
        '<label class="chk" style="display:flex;gap:10px;align-items:flex-start;margin-bottom:14px"><input type="checkbox" id="sozl" style="width:18px;height:18px;margin-top:3px"> <span><a href="mesafeli-satis.html" target="_blank">Mesafeli satış sözleşmesini</a> ve <a href="iptal-iade.html" target="_blank">iptal/iade koşullarını</a> okudum, kabul ediyorum.</span></label>' +
        '<button class="btn btn-p btn-lg" id="onay">Teklifi onayla</button><p class="err" id="er" hidden></p>';
      document.getElementById("onay").onclick = function () {
        if (!document.getElementById("sozl").checked) { var x = document.getElementById("er"); x.hidden = false; x.textContent = "Devam etmek için sözleşmeyi onaylayın."; return; }
        this.disabled = true; API.teklifOnayla(tk).then(ciz);
      };
    } else if (t.durum === "onaylandi") {
      P.innerHTML = "<h3>Ödeme</h3><p class=\"mute\" style=\"margin-top:6px\">İlk ödeme (%50, KDV dahil): <b>" + TL(kaporaKdvli) + "</b></p>" +
        '<div class="pay-opts">' +
        '<div class="box"><b>Kredi / banka kartı</b><p class="small" style="margin:6px 0 12px">Güvenli ödeme sayfası (iyzico). Taksit seçenekleri kartınıza göre gösterilir. Kart bilgileriniz bizde saklanmaz.</p><button class="btn btn-p" id="kart">Kartla öde</button></div>' +
        '<div class="box"><b>Havale / EFT</b><p class="small" style="margin:6px 0 12px">Alıcı: ' + e(A.unvan) + "<br>IBAN: " + e(A.iban || "[IBAN eklenecek]") + (A.banka ? "<br>" + e(A.banka) : "") + "<br>Açıklama: <b>" + e(t.no) + '</b></p><button class="btn btn-o" id="havale"' + (havaleBildirildi ? " disabled" : "") + ">" + (havaleBildirildi ? "Bildirildi, kontrol ediliyor" : "Ödemeyi yaptım") + "</button></div>" +
        "</div>";
      document.getElementById("kart").onclick = function () {
        if (API.mode === "demo") { if (confirm("DEMO: " + TL(kaporaKdvli) + " kartla ödenmiş sayılsın mı?")) API.odemeBildir(tk, { yontem: "kart", tutar: kaporaKdvli }).then(ciz); return; }
        // Canlı: iyzico ödeme formu Supabase Edge Function üzerinden başlatılır (supabase/functions/odeme-baslat)
        this.disabled = true; this.textContent = "Ödeme sayfası açılıyor…";
        fetch(A.supabaseUrl + "/functions/v1/odeme-baslat", { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey }, body: JSON.stringify({ token: tk }) })
          .then(function (r) { return r.json(); }).then(function (d) { if (d.paymentPageUrl) location.href = d.paymentPageUrl; else throw new Error(d.error || "Ödeme başlatılamadı"); })
          .catch(function (x) { alert(x.message); ciz(t); });
      };
      var hv = document.getElementById("havale"); if (hv) hv.onclick = function () { this.disabled = true; API.odemeBildir(tk, { yontem: "havale", tutar: kaporaKdvli }).then(ciz); };
    } else if (t.durum === "odendi") {
      P.innerHTML = '<h3 style="color:var(--ok)">Ödemeniz alındı, teşekkürler!</h3><p class="mute" style="margin-top:6px">Alınan: ' + TL(odenen) + ". Çalışmaya başlıyoruz; ilk adım için sizinle iletişime geçeceğiz. Kalan ödeme teslimde.</p>";
    } else P.innerHTML = "<p>Bu teklif iptal edilmiştir.</p>";
  }

  if (!tk) { O.innerHTML = '<p>Teklif bağlantısı eksik. <a href="teklif-al.html">Yeni teklif alın</a>.</p>'; return; }
  API.teklifGetir(tk).then(ciz).catch(function (x) { O.innerHTML = '<p class="err">' + e(x.message) + '</p><p><a href="teklif-al.html">Yeni teklif alın</a></p>'; });
})();
