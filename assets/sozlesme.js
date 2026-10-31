// ===== Hizmet sözleşmesi: gösterim + online kabul (31 Eki 2026, "işe sözleşmesiz başlanmaz") =====
// Metinler: assets/sozlesme-metin.js (OTOMATİK: _build/sozlesme-derle.js). Kayıt: supabase/functions/sozlesme-kabul (IP, zaman, SHA-256).
// Kullanan: satin-al.html (sipariş formu), teklif.html (onay/ödeme öncesi), sozlesme.html (WhatsApp/telefon linki).
(function () {
  "use strict";
  var S = window.SOZLESME, A = window.AJANS || {};
  if (!S) return;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ic = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); };
  // Ek-0 (sunucunun ürettiği markdown) için yalın çevirici; belgelerin HTML'i derleyiciden hazır gelir
  function md(m) {
    var L = String(m || "").split("\n"), o = [], i = 0, x, it;
    while (i < L.length) {
      var s = L[i];
      if (!s.trim()) { i++; continue; }
      if ((x = s.match(/^(#{1,3})\s+(.*)$/))) { o.push("<h" + (x[1].length + 1) + ">" + ic(x[2]) + "</h" + (x[1].length + 1) + ">"); i++; continue; }
      if (/^- /.test(s)) { it = []; while (i < L.length && /^- /.test(L[i])) it.push("<li>" + ic(L[i++].slice(2)) + "</li>"); o.push("<ul>" + it.join("") + "</ul>"); continue; }
      if (/^\d+\. /.test(s)) { it = []; while (i < L.length && /^\d+\. /.test(L[i])) it.push("<li>" + ic(L[i++].replace(/^\d+\. /, "")) + "</li>"); o.push("<ol>" + it.join("") + "</ol>"); continue; }
      it = []; while (i < L.length && L[i].trim() && !/^(#|- |\d+\. )/.test(L[i])) it.push(L[i++]); o.push("<p>" + ic(it.join(" ")) + "</p>");
    }
    return o.join("");
  }
  // Sunucudaki belgeKodlari ile aynı kural (supabase/functions/_shared/sozlesme.ts)
  function kodlar(hesap, alici) {
    var ek = [];
    if (hesap && Array.isArray(hesap.sozlesme_ekleri)) ek = hesap.sozlesme_ekleri;
    else if (hesap && typeof hesap.urun === "string" && S.urun[hesap.urun]) ek = S.urun[hesap.urun];
    else if (hesap && Array.isArray(hesap.secim)) hesap.secim.forEach(function (k) { ek = ek.concat(S.kalem[k] || []); });
    var r = ["genel"]; ek.forEach(function (k) { if (k !== "genel" && k !== "tuketici" && S.belgeler[k] && r.indexOf(k) < 0) r.push(k); });
    if (alici === "tuketici") r.push("tuketici");
    return r;
  }
  var belgeHtml = function (ks) { return ks.map(function (k) { var b = S.belgeler[k]; return '<section class="soz-belge" id="soz-' + k + '">' + b.html + '<p class="soz-oz">Sürüm ' + esc(S.surum) + " · SHA-256 " + b.sha256 + "</p></section>"; }).join(""); };
  var ozetler = function (ks) { return ks.map(function (k) { return { kod: k, sha256: S.belgeler[k].sha256 }; }); };

  // Stil (sayfalara tek yerden)
  var css = ".soz-kutu{border:2px solid var(--fg,#16181D);background:#fff;max-height:380px;overflow:auto;padding:14px 16px;font-size:.88rem;line-height:1.55;margin:10px 0}" +
    ".soz-kutu h2{font-size:1.05rem;margin:14px 0 6px}.soz-kutu h3{font-size:.95rem;margin:12px 0 4px}.soz-kutu table{border-collapse:collapse;width:100%;margin:6px 0}.soz-kutu td,.soz-kutu th{border:1px solid #ccc;padding:4px 6px;text-align:left;vertical-align:top}" +
    ".soz-kutu ul,.soz-kutu ol{padding-left:20px}.soz-belge+.soz-belge{border-top:2px dashed #ccc;margin-top:14px}.soz-oz{font:11px monospace;color:#777;word-break:break-all}.soz-ek0{background:#FFF7E0;padding:2px 12px 8px;margin-bottom:8px}" +
    ".soz-onay{display:flex;gap:10px;align-items:flex-start;font-size:.9rem;margin:10px 0}.soz-onay input{width:18px;height:18px;margin-top:3px;flex:0 0 auto}.soz-alan{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px 12px}" +
    ".soz-alan label{font-size:.82rem;font-weight:600}.soz-alan input{width:100%;font:inherit;font-size:16px;padding:9px 10px;border:2px solid var(--fg,#16181D);border-radius:0}.soz-tur{display:flex;gap:16px;flex-wrap:wrap;font-size:.9rem;margin:8px 0}" +
    "dialog.soz-dlg{border:2px solid #16181D;border-radius:0;padding:0;width:min(820px,calc(100vw - 16px));max-width:none;height:min(90dvh,900px);max-height:none}dialog.soz-dlg::backdrop{background:rgba(14,15,18,.6)}" +
    ".soz-dlg .ust{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:2px solid #16181D}.soz-dlg .ust b{flex:1}.soz-dlg .ust button{background:none;border:0;font-size:1.8rem;cursor:pointer;min-width:44px;min-height:44px}.soz-dlg .soz-kutu{border:0;max-height:none;height:calc(100% - 66px);margin:0}" +
    "@media print{.soz-kutu{max-height:none;overflow:visible;border:0}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // Tam ekran okuma penceresi
  function oku(baslik, html) {
    var d = document.getElementById("sozDlg");
    if (!d) { d = document.createElement("dialog"); d.id = "sozDlg"; d.className = "soz-dlg"; d.innerHTML = '<div class="ust"><b></b><button type="button" aria-label="Kapat">×</button></div><div class="soz-kutu"></div>'; document.body.appendChild(d);
      d.querySelector("button").onclick = function () { d.close ? d.close() : d.removeAttribute("open"); }; d.addEventListener("click", function (e) { if (e.target === d) d.close(); }); }
    d.querySelector("b").textContent = baslik; d.querySelector(".soz-kutu").innerHTML = html; d.querySelector(".soz-kutu").scrollTop = 0;
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }

  var fnUrl = function () { return A.supabaseUrl + "/functions/v1/sozlesme-kabul"; };
  var hdr = function () { return { "Content-Type": "application/json", apikey: A.supabaseAnonKey, Authorization: "Bearer " + A.supabaseAnonKey }; };
  var trZaman = function (iso) { return new Date(iso).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); };

  // Kabul paneli: teklif.html ve sozlesme.html. el = kap; tk = teklif token; o = { kaynak, bitti(kabul), hesap }
  function panel(el, tk, o) {
    o = o || {};
    el.innerHTML = '<p class="mute">Sözleşme yükleniyor…</p>';
    if (!A.supabaseUrl) { el.innerHTML = '<p class="err">Sözleşme şu an yüklenemedi. Lütfen 0501 945 21 84\'e yazın.</p>'; return; }
    fetch(fnUrl() + "?t=" + encodeURIComponent(tk), { headers: hdr() }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.error) throw new Error(d.error);
      if (d.kabul) return kabulGoster(el, tk, d.kabul, o);
      var b = d.bilgi || {}, alici = "isletme";
      var ciz = function () {
        var ks = d.belgeler.map(function (x) { return x.kod; }); if (alici === "tuketici") ks.push("tuketici");
        el.querySelector(".soz-kutu").innerHTML = '<div class="soz-ek0">' + md(d.ozel) + "</div>" + belgeHtml(ks);
        el.querySelector(".soz-ifa").hidden = alici !== "tuketici";
        return ks;
      };
      el.innerHTML = "<h3>Hizmet sözleşmesi</h3><p class=\"mute\" style=\"margin:6px 0\">Ödemeye geçmeden önce sözleşmeyi okuyup onaylayın. Onayınız tarih, saat ve cihaz bilgisiyle kaydedilir; kabul ettiğiniz metnin kopyası e-postanıza gönderilir.</p>" +
        '<div class="soz-tur" role="radiogroup" aria-label="Alıcı türü"><label><input type="radio" name="sozTur" value="isletme" checked> İşletme adına (fatura işletmeye)</label><label><input type="radio" name="sozTur" value="tuketici"> Kişisel kullanım (tüketici)</label></div>' +
        '<div class="soz-kutu" tabindex="0" aria-label="Sözleşme metni"></div>' +
        '<p class="small"><a href="sozlesme.html?t=' + encodeURIComponent(tk) + '" target="_blank" rel="noopener">Tam sayfada aç / yazdır</a> · <button type="button" class="soz-buyut" style="background:none;border:0;padding:0;text-decoration:underline;cursor:pointer;font:inherit">Büyük pencerede oku</button></p>' +
        '<div class="soz-alan"><div><label for="szAd">Ad soyad (onaylayan yetkili)</label><input id="szAd" autocomplete="name" maxlength="80" value="' + esc(b.ad || "") + '"></div>' +
        '<div><label for="szUnvan">Fatura unvanı <span class="mute">(isteğe bağlı)</span></label><input id="szUnvan" autocomplete="organization" maxlength="160" value="' + esc(b.isletme || "") + '"></div>' +
        '<div><label for="szVkn">Vergi no <span class="mute">(işletmeyse)</span></label><input id="szVkn" inputmode="numeric" maxlength="11"></div>' +
        '<div><label for="szTel">Telefon</label><input id="szTel" type="tel" autocomplete="tel" maxlength="20" value="' + esc(b.tel || "") + '"></div>' +
        '<div><label for="szEp">E-posta (sözleşme kopyası buraya gelir)</label><input id="szEp" type="email" autocomplete="email" maxlength="120" value="' + esc(b.eposta || "") + '"></div></div>' +
        '<label class="soz-onay"><input type="checkbox" id="szKabul"><span><b>Sözleşmeyi okudum, kabul ediyorum.</b> (Genel Hükümler, hizmete özel ekler ve Sipariş Özeti) Ödemenin Google, Meta gibi üçüncü tarafların onayına bağlı olmadığını ve istenen bilgi/belgeleri süresinde vermem gerektiğini biliyorum.</span></label>' +
        '<label class="soz-onay soz-ifa" hidden><input type="checkbox" id="szIfa"><span>Cayma süresi (14 gün) dolmadan işe <b>hemen başlanmasını</b> istiyorum; iş başlayınca cayma hakkımı kaybedeceğimi biliyorum.</span></label>' +
        '<button type="button" class="btn btn-p btn-lg" id="szGonder">Sözleşmeyi onayla ve ödemeye geç</button><p class="err" id="szHata" hidden></p>';
      var ks = ciz();
      el.querySelectorAll('input[name="sozTur"]').forEach(function (r) { r.onchange = function () { alici = this.value; ks = ciz(); }; });
      el.querySelector(".soz-buyut").onclick = function () { oku("Hizmet sözleşmesi · " + d.no, el.querySelector(".soz-kutu").innerHTML); };
      var H = el.querySelector("#szHata"), hata = function (m) { H.hidden = !m; H.textContent = m || ""; };
      el.querySelector("#szGonder").onclick = function () {
        var v = function (id) { return el.querySelector(id).value.trim(); }, btn = this; hata("");
        if (v("#szAd").length < 2) return hata("Adınızı soyadınızı yazın.");
        if (v("#szTel").replace(/\D/g, "").length < 10) return hata("Telefon numaranızı yazın.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("#szEp"))) return hata("Geçerli bir e-posta adresi yazın.");
        if (!el.querySelector("#szKabul").checked) return hata("Devam etmek için sözleşmeyi onaylayın.");
        if (alici === "tuketici" && !el.querySelector("#szIfa").checked) return hata("Hizmetin hemen başlaması için cayma onayını işaretleyin ya da işletme olarak devam edin.");
        btn.disabled = true; btn.textContent = "Kaydediliyor…";
        fetch(fnUrl(), { method: "POST", headers: hdr(), body: JSON.stringify({ token: tk, kaynak: o.kaynak || "teklif", ad: v("#szAd"), unvan: v("#szUnvan"), vergi_no: v("#szVkn"), tel: v("#szTel"), eposta: v("#szEp"),
          alici_turu: alici, ifa_onayi: alici === "tuketici" && el.querySelector("#szIfa").checked, kabul: true, belgeler: ozetler(ks), ozel_sha256: d.ozel_sha256 }) })
          .then(function (r) { return r.json(); }).then(function (r) {
            if (!r.ok) throw new Error(r.error || "Kaydedilemedi");
            if (window.dtOlay) try { window.dtOlay("CompleteRegistration", { content_name: "sozlesme-" + d.no }); } catch (x) {}
            if (o.bitti) o.bitti(r.kabul); else kabulGoster(el, tk, r.kabul, o);
          }).catch(function (x) { btn.disabled = false; btn.textContent = "Sözleşmeyi onayla ve ödemeye geç"; hata(x.message + " · Sorun sürerse 0501 945 21 84'e yazın."); });
      };
    }).catch(function (x) { el.innerHTML = '<p class="err">' + esc(x.message) + ' · Yardım: <a href="https://wa.me/' + esc(A.whatsapp || "905019452184") + '">WhatsApp</a></p>'; });
  }
  function kabulGoster(el, tk, k, o) {
    el.innerHTML = '<div class="note"><b>Hizmet sözleşmesi kabul edildi.</b> ' + esc(k.ad || "") + " · " + esc(k.zaman_tr || trZaman(k.kabul_zamani || k.zaman)) +
      '<br><span class="small">Özet (SHA-256): <code style="word-break:break-all">' + esc(k.toplam_sha256 || "") + '</code></span><br><a href="sozlesme.html?t=' + encodeURIComponent(tk) + '" target="_blank" rel="noopener">Kabul edilen sözleşmeyi görüntüle / yazdır</a></div>';
    if (o && o.kabulVar) o.kabulVar(k);
  }

  window.Sozlesme = { kodlar: kodlar, belgeHtml: belgeHtml, ozetler: ozetler, md: md, oku: oku, panel: panel, surum: S.surum };
})();
