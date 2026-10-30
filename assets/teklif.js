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
    var odenen = (t.odemeler || []).reduce(function (s, o) { return s + (o.yontem === "kart" && o.onayli !== false ? o.tutar : 0); }, 0);
    var havaleBildirildi = (t.odemeler || []).some(function (o) { return o.yontem === "havale"; });
    // 31 Eki: ödeme oranı kayıttan (hesap.odeme_orani; yoksa eski davranış %50). Site siparişi (hesap.paket "siparis") kendi IBAN'ını taşır.
    var oran = Number(h.odeme_orani) > 0 && Number(h.odeme_orani) <= 1 ? Number(h.odeme_orani) : 0.5, yuzde = Math.round(oran * 100);
    var sip = h.paket === "siparis", iban = h.iban || A.iban, banka = h.banka || A.banka;

    O.innerHTML = (API.mode === "demo" ? '<div class="demo no-print"><b>Demo modu:</b> Veriler bu tarayıcıda saklanır; ödeme adımı simülasyondur.</div>' : "") +
      (q.get("siparis") ? '<div class="note no-print" style="margin-bottom:20px"><b>Siparişiniz alındı.</b> Sipariş kodunuz <b>' + e(t.no) + "</b>. Aşağıdan ödemeyi tamamlayın; bu sayfanın bağlantısını kaydederek daha sonra da açabilirsiniz.</div>" : "") +
      (q.get("yeni") ? '<div class="note no-print" style="margin-bottom:20px"><b>Teklifiniz hazır!</b> Bu sayfanın bağlantısı ' + e(b.eposta) + " adresinize ve WhatsApp'ınıza iletilecek. Bağlantıyı kaydederek daha sonra da açabilirsiniz.</div>" : "") +
      '<div class="of-h"><div><span class="kicker" style="margin:0">' + (sip ? "Sipariş " : "Teklif ") + e(t.no) + "</span><h1>" + e(b.isletme) + '</h1><p class="mute">' + e(b.ad) + " · " + e(t.basvuru.sektor) + (b.sehir ? " · " + e(b.sehir) : "") + '</p></div>' +
      '<div style="text-align:right"><span class="status st-' + t.durum + '">' + (sip && t.durum === "onaylandi" ? "Sipariş alındı · ödeme bekleniyor" : DURUM[t.durum]) + '</span><p class="small" style="margin-top:8px">Tarih: ' + tarih(t.olusturma) + "<br>Geçerlilik: " + tarih(t.gecerlilik) + "<br>Hazırlayan: " + e(A.marka) + "</p></div></div>" +
      '<table class="lines"><thead><tr><th>Hizmet</th><th>Tutar</th></tr></thead><tbody>' +
      h.satirlar.map(function (r) { return "<tr><td><b>" + e(r.ad) + "</b><br><small>" + e(r.acik) + "</small>" + (r.liste && r.liste > r.tek ? '<br><small style="color:var(--ok)">Ayrı ayrı: ' + TL(r.liste) + "</small>" : "") + "</td><td>" + (r.tek ? TL(Math.round(r.tek * h.carpan)) : "—") + (r.ay ? "<br><small>+ " + TL(r.ay) + "/ay</small>" : "") + "</td></tr>"; }).join("") +
      "</tbody></table>" +
      '<div class="totals">' +
      (h.carpan !== 1 ? "<div><span>Ölçek: " + FIYAT.OLCEK[h.olcek].ad + " · " + FIYAT.ACIL[h.acil].ad + "</span><span>×" + h.carpan.toFixed(2).replace(".", ",") + "</span></div>" : "") +
      (h.kdv ? "<div><span>Ara toplam (KDV hariç)</span><span>" + TL(h.tek) + "</span></div>" +
      "<div><span>KDV (%" + Math.round(A.kdv * 100) + ")</span><span>" + TL(h.kdv) + "</span></div>" : "") +
      '<div class="g"><span>Genel toplam</span><span>' + TL(h.tek + h.kdv) + "</span></div>" +
      (h.ay ? '<div class="small"><span>' + e(h.ay_etiket || "Aylık hizmetler (isteğe bağlı)") + '</span><span>' + TL(h.ay) + " + KDV / ay</span></div>" : "") +
      "</div>" +
      '<div class="note" style="margin-top:20px"><b>Ödeme planı:</b> ' + (oran === 1 ? "Tamamı peşin (" + TL(Math.round(h.tek + h.kdv)) + (h.kdv ? " KDV dahil" : "") + ")." : (sip ? "Siparişte" : "Onayda") + " %" + yuzde + " (" + TL(Math.round((h.tek + h.kdv) * oran)) + (h.kdv ? " KDV dahil" : "") + "), kalan %" + (100 - yuzde) + " teslimde.") + " Teslim sonrası mülkiyet işletmenize geçer. Koşullar: <a href=\"mesafeli-satis.html\">mesafeli satış sözleşmesi</a>, <a href=\"iptal-iade.html\">iptal ve iade</a>.</div>" +
      '<div class="paybox" id="pay"></div>' +
      '<div class="cta no-print" style="margin-top:18px"><button class="btn btn-o" onclick="window.print()">PDF / Yazdır</button>' +
      (A.whatsapp ? '<a class="btn btn-w" href="https://wa.me/' + A.whatsapp + "?text=" + waMsg + '" rel="nofollow">WhatsApp\'tan soru sor</a>' : "") + "</div>";

    var P = document.getElementById("pay"), kaporaKdvli = Math.round((h.tek + h.kdv) * oran);
    if (t.durum === "gonderildi") {
      P.innerHTML = "<h3>Teklifi onaylayın</h3><p class=\"mute\" style=\"margin:6px 0 16px\">Onayladığınızda ödeme adımına geçersiniz. Çalışmaya ilk ödemeden sonra başlanır.</p>" +
        '<label class="chk" style="display:flex;gap:10px;align-items:flex-start;margin-bottom:14px"><input type="checkbox" id="sozl" style="width:18px;height:18px;margin-top:3px"> <span><a href="mesafeli-satis.html" target="_blank">Mesafeli satış sözleşmesini</a> ve <a href="iptal-iade.html" target="_blank">iptal/iade koşullarını</a> okudum, kabul ediyorum.</span></label>' +
        '<button class="btn btn-p btn-lg" id="onay">Teklifi onayla</button><p class="err" id="er" hidden></p>';
      document.getElementById("onay").onclick = function () {
        if (!document.getElementById("sozl").checked) { var x = document.getElementById("er"); x.hidden = false; x.textContent = "Devam etmek için sözleşmeyi onaylayın."; return; }
        this.disabled = true; API.teklifOnayla(tk).then(ciz);
      };
    } else if (t.durum === "onaylandi") {
      var kartKutu = A.kartOdeme ? '<div class="box"><b>Kredi / banka kartı</b><p class="small" style="margin:6px 0 12px">Güvenli ödeme ekranı (PayTR). 12 aya varan taksit seçenekleri kartınıza göre gösterilir. Kart bilgileriniz bizde saklanmaz.</p><button class="btn ' + (sip ? "btn-o" : "btn-p") + '" id="kart">Kartla öde</button></div>' : "";
      var havaleKutu = '<div class="box"><b>Havale / EFT' + (sip ? ' <small style="font-weight:600;color:var(--ok)">· önerilen</small>' : "") + '</b><p class="small" style="margin:6px 0 12px">' + (sip ? "Tutar: <b>" + TL(kaporaKdvli) + "</b><br>" : "") + 'Alıcı: ' + e(A.yasalAd || A.unvan) + (A.yasalAd ? " (" + e(A.unvan) + ")" : "") + (iban ? '<br>IBAN: <b id="ibanY" style="white-space:nowrap">' + e(iban) + '</b> <button type="button" class="btn btn-o" id="ibanK" style="min-height:0;padding:4px 10px;font-size:12px;margin-left:4px">Kopyala</button>' : "<br>IBAN bilgisi size WhatsApp’tan iletilecek: <a href=\"https://wa.me/" + e(A.whatsapp || "") + "\">bize yazın</a>") + (banka ? "<br>" + e(banka) : "") + "<br>Açıklama: <b>" + e(t.no) + '</b>' + (sip ? '<br><span class="mute">Açıklamaya sipariş kodunu yazın; ödeme kontrol edilince çalışmaya başlarız.</span>' : "") + '</p><button class="btn ' + (sip ? "btn-p" : "btn-o") + '" id="havale"' + (havaleBildirildi ? " disabled" : "") + ">" + (havaleBildirildi ? "Bildirildi, kontrol ediliyor" : "Ödemeyi yaptım") + "</button></div>";
      P.innerHTML = "<h3>Ödeme</h3><p class=\"mute\" style=\"margin-top:6px\">" + (oran === 1 ? "Ödenecek tutar" : "İlk ödeme (%" + yuzde) + (h.kdv ? (oran === 1 ? " (KDV dahil)" : ", KDV dahil)") : (oran === 1 ? "" : ")")) + ": <b>" + TL(kaporaKdvli) + "</b></p>" +
        '<div class="pay-opts">' + (sip ? havaleKutu + kartKutu : kartKutu + havaleKutu) + "</div>";
      var ik = document.getElementById("ibanK"); if (ik) ik.onclick = function () {
        var b = this, v = iban.replace(/\s/g, ""), bitti = function () { b.textContent = "Kopyalandı"; setTimeout(function () { b.textContent = "Kopyala"; }, 2000); };
        if (navigator.clipboard) navigator.clipboard.writeText(v).then(bitti, function () { prompt("IBAN", v); }); else prompt("IBAN", v);
      };
      var kb = document.getElementById("kart"); if (kb) kb.onclick = function () {
        if (API.mode === "demo") { if (confirm("DEMO: " + TL(kaporaKdvli) + " kartla ödenmiş sayılsın mı?")) API.odemeBildir(tk, { yontem: "kart", tutar: kaporaKdvli }).then(ciz); return; }
        // Canlı: PayTR iFrame ödemesi Supabase Edge Function üzerinden başlatılır (supabase/functions/odeme-baslat); sonuç paytr-bildirim ile doğrulanır
        var btn = this; btn.disabled = true; btn.textContent = "Ödeme ekranı açılıyor…";
        fetch(A.supabaseUrl + "/functions/v1/odeme-baslat", { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey, Authorization: "Bearer " + A.supabaseAnonKey }, body: JSON.stringify({ token: tk }) })
          .then(function (r) { return r.json(); }).then(function (d) {
            if (!d.iframeToken) throw new Error(d.error || "Ödeme başlatılamadı");
            P.innerHTML = "<h3>Kartla ödeme · " + TL(kaporaKdvli) + '</h3><p class="small mute" style="margin:6px 0 12px">Kart bilgileriniz doğrudan PayTR’ye iletilir. Ödeme bitince bu sayfa kendiliğinden güncellenir.</p>' +
              '<iframe src="https://www.paytr.com/odeme/guvenli/' + encodeURIComponent(d.iframeToken) + '" id="paytriframe" frameborder="0" scrolling="no" style="width:100%;min-height:620px;border:0"></iframe>';
            var s = document.createElement("script"); s.src = "https://www.paytr.com/js/iframeResizer.min.js";
            s.onload = function () { if (window.iFrameResize) window.iFrameResize({}, "#paytriframe"); }; document.body.appendChild(s);
          })
          .catch(function (x) { btn.disabled = false; btn.textContent = "Kartla öde"; P.insertAdjacentHTML("beforeend", '<p class="err">' + e(x.message) + "</p>"); });
      };
      var hv = document.getElementById("havale"); if (hv) hv.onclick = function () { this.disabled = true; API.odemeBildir(tk, { yontem: "havale", tutar: kaporaKdvli }).then(ciz); };
    } else if (t.durum === "odendi") {
      P.innerHTML = '<h3 style="color:var(--ok)">Ödemeniz alındı, teşekkürler!</h3><p class="mute" style="margin-top:6px">Alınan: ' + TL(odenen) + ". Çalışmaya başlıyoruz; ilk adım için sizinle iletişime geçeceğiz." + (oran < 1 ? " Kalan ödeme teslimde." : "") + "</p>";
    } else P.innerHTML = "<p>Bu teklif iptal edilmiştir.</p>";
  }

  if (!tk) { O.innerHTML = '<p>Teklif bağlantısı eksik. <a href="teklif-al.html">Yeni teklif alın</a>.</p>'; return; }
  // PayTR dönüşü ödeme çerçevesinin içinde açılırsa sayfanın tamamına taşı
  if (q.get("odeme") && window.top !== window.self) { try { window.top.location.href = location.href; return; } catch (x) {} }
  if (q.get("odeme") === "tamam") {
    // Onay PayTR'den sunucuya birkaç saniye içinde gelir (paytr-bildirim); gelene kadar bekle
    var deneme = 0, bekle = function () {
      API.teklifGetir(tk).then(function (t) {
        if (t.durum === "odendi" || ++deneme > 20) return ciz(t);
        O.innerHTML = '<div class="note"><b>Ödemeniz işleniyor…</b> Bankadan onay bekleniyor, bu sayfa birkaç saniye içinde güncellenecek.</div>';
        setTimeout(bekle, 3000);
      }).catch(function (x) { O.innerHTML = '<p class="err">' + e(x.message) + "</p>"; });
    };
    bekle(); return;
  }
  if (q.get("odeme") === "hata") O.insertAdjacentHTML("beforebegin", '<div class="note no-print" style="margin-bottom:16px;border-color:#b3261e"><b>Ödeme tamamlanamadı.</b> Kartınızdan para çekilmedi. Tekrar deneyebilir veya havale ile ödeyebilirsiniz.</div>');
  API.teklifGetir(tk).then(ciz).catch(function (x) { O.innerHTML = '<p class="err">' + e(x.message) + '</p><p><a href="teklif-al.html">Yeni teklif alın</a></p>'; });
})();
