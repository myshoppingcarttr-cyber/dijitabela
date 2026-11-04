/* Klinik prototip modülleri. Önizleme: ağ isteği yok, hiçbir şey gönderilmez; kayıtlar yalnız bu tarayıcıda durur. */
(function () {
  "use strict";
  var K = window.KL, D = window.KLD, L = ["tr", "en", "de", "ru", "ar"];
  var lang = K.dil0 || "tr", bellek = {};
  function t(k) { var v = D[k]; return v ? (v[L.indexOf(lang)] || v[0]) : k; }
  function tr(k) { var v = D[k]; return v ? v[0] : k; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function al(a) { try { var v = localStorage.getItem(a); return v == null ? bellek[a] : v; } catch (e) { return bellek[a]; } }
  function yaz(a, v) { bellek[a] = v; try { localStorage.setItem(a, v); } catch (e) { /* depolama kapalı: bellekte kalır */ } }
  var ANAH = "kl-" + K.slug + "-kayit";
  function ornekler() {
    var h = K.hizmet, g = function (i) { return h[i % h.length]; };
    var o = [
      ["Örnek Hasta A", "+44 7700 900 101", "Yurt dışı talep", g(0), "en", "Yeni", "Birleşik Krallık. 1-3 ay içinde gelmek istiyor, fotoğrafı hazır."],
      ["Örnek Hasta B", "+49 151 000 0102", "Kaçan çağrı", g(1), "de", "Aranacak", "Hat meşgulken aradı, mesajla ön kayıt verdi. Öğleden sonra aranacak."],
      ["Örnek Hasta C", "+90 532 000 0103", "Randevu formu", g(2), "tr", "Onaylandı", "Hafta içi öğleden sonra uygun. Ekip saati teyit etti."],
      ["Örnek Hasta D", "+7 900 000 0104", "Yurt dışı talep", g(0), "ru", "Yeni", "Henüz araştırıyor. Rusça bilgi istiyor."],
      ["Örnek Hasta E", "+966 50 000 0105", "Mesaj", g(3), "ar", "Aranacak", "Arapça dönüş istiyor. Refakatçiyle gelecek."],
      ["Örnek Hasta F", "+90 533 000 0106", "Kaçan çağrı", g(4), "tr", "Tamamlandı", "Geri arandı, randevuya yönlendirildi."],
      ["Örnek Hasta G", "+31 6 0000 0107", "Yurt dışı talep", g(1), "en", "Aranacak", "Hollanda. Önceki tedavi bilgisini gönderecek."],
      ["Örnek Hasta H", "+90 541 000 0108", "Randevu formu", g(2), "tr", "Yeni", "Akşam saatini soruyor."]
    ];
    if (K.yerel) o = o.filter(function (x) { return x[4] === "tr" || x[4] === "en"; });
    return o.map(function (x, i) { return { id: "o" + i, zaman: "Örnek", ad: x[0], tel: x[1], kaynak: x[2], konu: x[3], dil: x[4], durum: x[5], not: x[6], ornek: true }; });
  }
  function kayitlar() { var v = al(ANAH); if (v) { try { return JSON.parse(v); } catch (e) { /* bozuksa sıfırla */ } } return ornekler(); }
  function ekle(r) {
    var l = kayitlar(); r.id = "k" + Date.now() + Math.floor(Math.random() * 1000);
    var d = new Date(); r.zaman = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); r.dil = lang; r.durum = "Yeni";
    l.unshift(r); yaz(ANAH, JSON.stringify(l)); cizAd("panel");
  }
  function konuSec(id, secili) {
    return '<select id="' + id + '" class="g">' + K.hizmet.map(function (s) { return '<option value="' + s + '"' + (s === secili ? " selected" : "") + ">" + esc(t(s)) + "</option>"; }).join("") + "</select>";
  }
  function telGecerli(v) { return String(v).replace(/\D/g, "").length >= 10; }
  var seciliKonu = K.hizmet[0];

  /* ---------- Modüller ---------- */
  var M = {};

  M.hizmet = function (el) {
    el.innerHTML = '<div class="hg">' + K.hizmet.map(function (s) {
      return '<button type="button" class="hb' + (s === seciliKonu ? " on" : "") + '" data-s="' + s + '">' + esc(t(s)) + "</button>";
    }).join("") + "</div>";
    el.onclick = function (e) { var b = e.target.closest("[data-s]"); if (!b) return; seciliKonu = b.getAttribute("data-s"); cizHepsi(); };
  };

  var H = { a: 0, v: {} };
  M.huni = function (el) {
    var a = H.a, v = H.v, kutu = "", son = 4;
    var bas = '<div class="ad"><div class="ad-c"><i style="width:' + ((Math.min(a, 5) + 1) * 100 / 6) + '%"></i></div>' + (a <= son ? "<small>" + esc(t("u_step")) + " " + (a + 1) + "/5</small>" : "") + "</div>";
    function sec(k, liste) { return '<div class="sc">' + liste.map(function (x) { return '<button type="button" class="sb' + (v[k] === x ? " on" : "") + '" data-k="' + k + '" data-v="' + x + '">' + esc(t(x)) + "</button>"; }).join("") + "</div>"; }
    if (a === 0) kutu = "<h4>" + esc(t("u_country")) + "</h4>" + sec("ulke", K.ulkeler);
    if (a === 1) kutu = "<h4>" + esc(t("u_topic")) + "</h4>" + sec("konu", K.hizmet);
    if (a === 2) kutu = "<h4>" + esc(t("u_when")) + "</h4>" + sec("zaman", ["u_w1", "u_w2", "u_w3", "u_w4"]);
    if (a === 3) kutu = "<h4>" + esc(t("u_docs")) + "</h4><div class='sc'>" + ["u_d1", "u_d2", "u_d3", "u_d4"].map(function (x) { var on = (v.belge || []).indexOf(x) >= 0; return '<button type="button" class="sb' + (on ? " on" : "") + '" data-c="' + x + '">' + (on ? "✓ " : "") + esc(t(x)) + "</button>"; }).join("") + "</div>";
    if (a === 4) kutu = "<h4>" + esc(t("u_contact")) + '</h4><label class="e">' + esc(t("f_name")) + '<input class="g" id="hn" value="' + esc(v.ad || "") + '"></label><label class="e">' + esc(t("f_phone")) + '<input class="g" id="ht" inputmode="tel" value="' + esc(v.tel || "") + '"></label><label class="on-k"><input type="checkbox" id="hk"' + (v.onay ? " checked" : "") + "><span>" + esc(t("f_consent")) + "</span></label>";
    if (a === 5) {
      kutu = '<div class="ozet"><h4>✓ ' + esc(t("u_done")) + "</h4><dl><dt>" + esc(t("u_country").replace(/\?|؟/g, "")) + "</dt><dd>" + esc(t(v.ulke)) + "</dd><dt>" + esc(t("f_topic")) + "</dt><dd>" + esc(t(v.konu)) + "</dd><dt>" + esc(t("f_date")) + "</dt><dd>" + esc(t(v.zaman)) + "</dd><dt>" + esc(t("f_name")) + "</dt><dd>" + esc(v.ad) + "</dd></dl><p>" + esc(t("f_ok")) + '</p><button type="button" class="dg ikincil" data-y="1">' + esc(t("u_again")) + "</button></div>";
    }
    var alt = a < 5 ? '<p class="hata" id="hh" role="alert"></p><div class="ik">' + (a > 0 ? '<button type="button" class="dg ikincil" data-g="1">' + esc(t("u_back")) + "</button>" : "<span></span>") + '<button type="button" class="dg" data-i="1">' + esc(t(a === 4 ? "u_finish" : "u_next")) + "</button></div>" : "";
    el.innerHTML = bas + kutu + alt + '<p class="dm">' + esc(t("f_demo")) + "</p>";
    el.onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (a === 4) { var n = el.querySelector("#hn"), r = el.querySelector("#ht"), c = el.querySelector("#hk"); v.ad = n.value; v.tel = r.value; v.onay = c.checked; }
      if (b.dataset.k) { v[b.dataset.k] = b.dataset.v; M.huni(el); return; }
      if (b.dataset.c) { var l = v.belge || (v.belge = []), i = l.indexOf(b.dataset.c); if (i >= 0) l.splice(i, 1); else l.push(b.dataset.c); M.huni(el); return; }
      if (b.dataset.g) { H.a--; M.huni(el); return; }
      if (b.dataset.y) { H.a = 0; H.v = {}; M.huni(el); return; }
      if (b.dataset.i) {
        var hh = el.querySelector("#hh");
        if ((a === 0 && !v.ulke) || (a === 1 && !v.konu) || (a === 2 && !v.zaman) || (a === 3 && !(v.belge && v.belge.length))) { hh.textContent = t("u_pick"); return; }
        if (a === 4) {
          if (!v.ad || !v.ad.trim()) { hh.textContent = t("f_err_name"); return; }
          if (!telGecerli(v.tel)) { hh.textContent = t("f_err_phone"); return; }
          if (!v.onay) { hh.textContent = t("f_err_consent"); return; }
          ekle({ ad: v.ad, tel: v.tel, kaynak: "Yurt dışı talep", konu: v.konu, not: tr(v.ulke) + ". " + tr(v.zaman) + ". Elinde: " + v.belge.map(tr).join(", ") + "." });
        }
        H.a++; M.huni(el);
      }
    };
  };

  function gunler() { var o = [], d = new Date(); for (var i = 1; o.length < 7 && i < 15; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); if (x.getDay() !== 0) o.push(x); } return o; }
  var R = { g: null, s: null };
  M.randevu = function (el) {
    var loc = { tr: "tr-TR", en: "en-GB", de: "de-DE", ru: "ru-RU", ar: "ar" }[lang];
    var gl = gunler(), saat = ["09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30", "17:30"];
    var doluMu = function (i, j) { return (i * 3 + j * 5 + K.slug.length) % 4 === 0; };
    if (R.g === null) R.g = 0;
    el.innerHTML = '<form class="rf" novalidate><div class="ik2"><label class="e">' + esc(t("f_name")) + '<input class="g" id="rn" autocomplete="off"></label><label class="e">' + esc(t("f_phone")) + '<input class="g" id="rt" inputmode="tel" autocomplete="off"></label></div><label class="e">' + esc(t("f_topic")) + konuSec("rk", seciliKonu) + '</label><div class="e">' + esc(t("f_date")) + '<div class="gs">' + gl.map(function (x, i) {
      return '<button type="button" class="gb' + (i === R.g ? " on" : "") + '" data-gun="' + i + '"><b>' + x.getDate() + "</b><small>" + esc(x.toLocaleDateString(loc, { weekday: "short" })) + "</small></button>";
    }).join("") + '</div></div><div class="e">' + esc(t("f_time")) + '<div class="ss">' + saat.map(function (s, j) {
      var d = doluMu(R.g, j); return '<button type="button" class="sa' + (d ? " dolu" : "") + (R.s === s ? " on" : "") + '"' + (d ? " disabled" : "") + ' data-saat="' + s + '">' + s + (d ? " · " + esc(t("f_busy")) : "") + "</button>";
    }).join("") + '</div></div><label class="on-k"><input type="checkbox" id="rc"><span>' + esc(t("f_consent")) + '</span></label><p class="hata" id="rh" role="alert"></p><button class="dg" type="submit">' + esc(t("f_send")) + '</button><p class="tm" id="rok" role="status"></p><p class="dm">' + esc(t("f_demo")) + "</p></form>";
    var koru = function () { return { n: el.querySelector("#rn").value, t: el.querySelector("#rt").value, k: el.querySelector("#rk").value, c: el.querySelector("#rc").checked }; };
    var yukle = function (o) { el.querySelector("#rn").value = o.n; el.querySelector("#rt").value = o.t; el.querySelector("#rk").value = o.k; el.querySelector("#rc").checked = o.c; };
    el.querySelector(".gs").onclick = function (e) { var b = e.target.closest("[data-gun]"); if (!b) return; var o = koru(); R.g = +b.dataset.gun; R.s = null; M.randevu(el); yukle(o); };
    el.querySelector(".ss").onclick = function (e) { var b = e.target.closest("[data-saat]"); if (!b || b.disabled) return; var o = koru(); R.s = b.dataset.saat; M.randevu(el); yukle(o); };
    el.querySelector("form").onsubmit = function (e) {
      e.preventDefault(); var o = koru(), h = el.querySelector("#rh"); h.textContent = "";
      if (!o.n.trim()) { h.textContent = t("f_err_name"); return; }
      if (!telGecerli(o.t)) { h.textContent = t("f_err_phone"); return; }
      if (!R.s) { h.textContent = t("f_err_slot"); return; }
      if (!o.c) { h.textContent = t("f_err_consent"); return; }
      ekle({ ad: o.n, tel: o.t, kaynak: "Randevu formu", konu: o.k, not: "Ön talep: " + gunler()[R.g].toLocaleDateString("tr-TR") + " " + R.s + ". Ekip onayı bekliyor." });
      R.s = null; M.randevu(el); el.querySelector("#rok").textContent = "✓ " + t("f_ok");
    };
  };

  var C = { a: 0, k: null, ad: "", z: null };
  M.cagri = function (el) {
    var b = "";
    if (C.a === 0) b = '<div class="tel-bos"><p>☎</p><button type="button" class="dg" data-b="1">' + esc(t("m_btn")) + "</button></div>";
    else {
      b = '<div class="bl o">' + esc(t("m_hi")) + "</div>";
      if (C.a === 1) b += '<div class="hz">' + K.hizmet.slice(0, 5).map(function (s) { return '<button type="button" data-k="' + s + '">' + esc(t(s)) + "</button>"; }).join("") + "</div>";
      if (C.a >= 2) b += '<div class="bl h">' + esc(t(C.k)) + '</div><div class="bl o">' + esc(t("m_name")) + "</div>";
      if (C.a === 2) b += '<div class="gr"><input class="g" id="cn" placeholder="' + esc(t("f_name")) + '"><button type="button" class="dg" data-a="1">' + esc(t("m_send")) + '</button></div><p class="hata" id="ch" role="alert"></p>';
      if (C.a >= 3) b += '<div class="bl h">' + esc(C.ad) + '</div><div class="bl o">' + esc(t("m_when")) + "</div>";
      if (C.a === 3) b += '<div class="hz">' + ["m_am", "m_pm", "m_eve"].map(function (s) { return '<button type="button" data-z="' + s + '">' + esc(t(s)) + "</button>"; }).join("") + "</div>";
      if (C.a >= 4) b += '<div class="bl h">' + esc(t(C.z)) + '</div><div class="bl o">' + esc(t("m_end")) + '</div><button type="button" class="dg ikincil" data-r="1">' + esc(t("m_reset")) + "</button>";
    }
    el.innerHTML = '<div class="tel"><div class="tel-u"><b>' + esc(K.ad) + '</b><small>' + esc(t("n_msg")) + '</small></div><div class="tel-g">' + b + '</div></div><p class="dm">' + esc(t("f_demo")) + "</p>";
    el.onclick = function (e) {
      var x = e.target.closest("button"); if (!x) return;
      if (x.dataset.b) { C.a = 1; }
      else if (x.dataset.k) { C.k = x.dataset.k; C.a = 2; }
      else if (x.dataset.a) { var v = el.querySelector("#cn").value.trim(); if (!v) { el.querySelector("#ch").textContent = t("f_err_name"); return; } C.ad = v; C.a = 3; }
      else if (x.dataset.z) { C.z = x.dataset.z; C.a = 4; ekle({ ad: C.ad, tel: "Arayan numara", kaynak: "Kaçan çağrı", konu: C.k, not: "Hat meşgulken aradı, mesajla ön kayıt verdi. Tercih: " + tr(C.z) + "." }); }
      else if (x.dataset.r) { C = { a: 0, k: null, ad: "", z: null }; }
      else return;
      M.cagri(el);
    };
  };

  var P = { f: "Tümü" };
  M.panel = function (el) {
    var l = kayitlar(), f = P.f;
    var say = function (d) { return l.filter(function (x) { return x.durum === d; }).length; };
    var kaynak = ["Tümü", "Yurt dışı talep", "Kaçan çağrı", "Randevu formu", "Mesaj"];
    if (K.modul.indexOf("bulusma") >= 0) kaynak.push("Görüşme günü");
    var gor = l.filter(function (x) { return f === "Tümü" || x.kaynak === f; });
    var dd = ["Yeni", "Aranacak", "Onaylandı", "Tamamlandı"];
    el.innerHTML = '<div class="p-ust"><strong>Klinik ekranı</strong><span class="et">Örnek veri</span><span class="yer"></span><button type="button" class="kc" data-csv="1">CSV indir</button><button type="button" class="kc" data-sifir="1">Sıfırla</button></div>'
      + '<div class="sy"><div><b>' + l.length + "</b><small>Toplam talep</small></div><div><b>" + say("Yeni") + "</b><small>Yeni</small></div><div><b>" + say("Aranacak") + "</b><small>Aranacak</small></div><div><b>" + say("Onaylandı") + "</b><small>Onaylandı</small></div></div>"
      + '<div class="fl">' + kaynak.map(function (k) { return '<button type="button" class="' + (k === f ? "on" : "") + '" data-f="' + k + '">' + k + "</button>"; }).join("") + "</div>"
      + '<div class="ls">' + (gor.length ? gor.map(function (r) {
        return '<article class="kr"><div class="kr-u"><b>' + esc(r.ad) + '</b><span class="dl">' + r.dil.toUpperCase() + '</span><span class="zm">' + esc(r.zaman) + '</span></div><p class="kn">' + esc(tr(r.konu)) + " · " + esc(r.kaynak) + "</p><p>" + esc(r.not) + '</p><div class="kr-a"><span>' + esc(r.tel) + '</span><select aria-label="Durum" data-d="' + r.id + '">' + dd.map(function (x) { return "<option" + (x === r.durum ? " selected" : "") + ">" + x + "</option>"; }).join("") + "</select></div></article>";
      }).join("") : '<p class="dm">Bu kaynakta talep yok.</p>') + "</div>";
    el.onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.f) { P.f = b.dataset.f; M.panel(el); }
      if (b.dataset.sifir) { bellek = {}; try { localStorage.removeItem(ANAH); } catch (x) { /* yok say */ } P.f = "Tümü"; M.panel(el); }
      if (b.dataset.csv) {
        var satir = [["Ad", "Telefon", "Kaynak", "Konu", "Dil", "Durum", "Not"]].concat(kayitlar().map(function (r) { return [r.ad, r.tel, r.kaynak, tr(r.konu), r.dil, r.durum, r.not]; }));
        var csv = "﻿" + satir.map(function (s) { return s.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
        var u = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), a = document.createElement("a");
        a.href = u; a.download = K.slug + "-talepler.csv"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
      }
    };
    el.onchange = function (e) {
      var s = e.target.closest("[data-d]"); if (!s) return;
      var li = kayitlar(); li.forEach(function (x) { if (x.id === s.dataset.d) x.durum = s.value; }); yaz(ANAH, JSON.stringify(li)); M.panel(el);
    };
  };

  var YM = { tr: "Merhaba {ad}, {k} olarak bizi tercih ettiğiniz için teşekkür ederiz. Deneyiminizi Google'da paylaşmak isterseniz bağlantı burada: {l}", en: "Hello {ad}, thank you for choosing {k}. If you'd like to share your experience on Google, here is the link: {l}", de: "Hallo {ad}, danke, dass Sie {k} gewählt haben. Wenn Sie Ihre Erfahrung auf Google teilen möchten, hier der Link: {l}", ru: "Здравствуйте, {ad}! Спасибо, что выбрали {k}. Если хотите поделиться впечатлениями в Google, вот ссылка: {l}", ar: "مرحبًا {ad}، شكرًا لاختيارك {k}. إذا رغبت بمشاركة تجربتك على Google فهذا هو الرابط: {l}" };
  M.yorum = function (el) {
    el.innerHTML = '<div class="ik2"><label class="e">Hasta adı<input class="g" id="yn" value="Örnek Hasta"></label><label class="e">Mesaj dili<select class="g" id="yd">' + K.diller.map(function (d) { return "<option>" + d.toUpperCase() + "</option>"; }).join("") + '</select></label></div><div class="bl o yb" id="yb"></div><button type="button" class="dg" id="yk">Metni kopyala</button><p class="tm" id="yo" role="status"></p><p class="ku"><b>Kural:</b> Davet işlem sonrası herkese aynı gider. Önce puan sorup yalnız memnun olanı Google\'a yönlendirme (ayıklama) yapılmaz. Bu önizleme mesaj göndermez.</p>';
    function ciz() { el.querySelector("#yb").textContent = YM[el.querySelector("#yd").value.toLowerCase()].replace("{ad}", el.querySelector("#yn").value || "").replace("{k}", K.ad).replace("{l}", "[Google yorum bağlantınız]"); }
    el.querySelector("#yn").oninput = ciz; el.querySelector("#yd").onchange = ciz; ciz();
    el.querySelector("#yk").onclick = function () {
      var m = el.querySelector("#yb").textContent, o = el.querySelector("#yo"), bit = function (ok) { o.textContent = ok ? "✓ Kopyalandı." : "Tarayıcı kopyalamaya izin vermedi, metni elle seçin."; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).then(function () { bit(true); }, function () { bit(false); }); else bit(false);
    };
  };

  var HT = { s: "hat", l: [] };
  M.hatirlat = function (el) {
    var kamp = HT.s === "kamp";
    el.innerHTML = '<div class="fl"><button type="button" class="' + (kamp ? "" : "on") + '" data-s="hat">Randevu hatırlatma</button><button type="button" class="' + (kamp ? "on" : "") + '" data-s="kamp">Kampanya</button></div>'
      + (kamp ? '<label class="on-k"><input type="checkbox" id="hi"><span>Bu kişinin ticari ileti izni var (İYS ve açık rıza kliniğin sorumluluğunda).</span></label><label class="e">Kampanya metni<input class="g" id="hm" value="' + esc(K.ad) + ' kontrol dönemi duyurusu. Bilgi için yazın."></label>'
        : '<div class="ik2"><label class="e">Hasta adı<input class="g" id="hn2" value="Örnek Hasta"></label><label class="e">Randevu<input class="g" id="hd" type="datetime-local"></label></div>')
      + '<p class="hata" id="hhh" role="alert"></p><button type="button" class="dg" id="he">Kuyruğa ekle</button><ul class="ku-l">' + HT.l.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><p class="ku">Önizleme mesaj göndermez. Hatırlatma mesajla çalışır; telefonla hatırlatma araması gerçek hatta denenmedi, teklif kapsamında değildir.</p>';
    el.querySelector(".fl").onclick = function (e) { var b = e.target.closest("[data-s]"); if (b) { HT.s = b.dataset.s; M.hatirlat(el); } };
    el.querySelector("#he").onclick = function () {
      var h = el.querySelector("#hhh"); h.textContent = "";
      if (kamp) {
        if (!el.querySelector("#hi").checked) { h.textContent = "İzin işaretli değil: kampanya mesajı kuyruğa alınmaz."; return; }
        HT.l.unshift("Kampanya, izinli kişi: " + el.querySelector("#hm").value);
      } else {
        var v = el.querySelector("#hd").value; if (!v) { h.textContent = "Randevu tarih ve saatini seçin."; return; }
        var d = new Date(v), o = new Date(d.getTime() - 864e5);
        HT.l.unshift(el.querySelector("#hn2").value + ": " + o.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" }) + " tarihinde hatırlatma mesajı");
      }
      M.hatirlat(el);
    };
  };

  var AY = {
    tr: ["Merhaba, {k}, ben yapay zekâ asistanı Ayşe. Size nasıl yardımcı olabilirim?", "Randevu almak istiyorum.", "Elbette. Hangi konuda ve hangi gün uygun olur?", "Kanama var, ne yapayım?", "Bu tıbbi bir soru, hekimimiz yanıtlasın. Kesin acil durumda 112'yi arayın. Notunuzu ekibe bırakıyorum."],
    en: ["Hello, this is {k}, I'm the AI assistant Ayşe. How can I help?", "I'd like an appointment.", "Of course. Which topic and which day suits you?", "I'm bleeding, what should I do?", "That's a medical question for our doctor. In an emergency call your local emergency number. I'm leaving a note for the team."],
    de: ["Guten Tag, hier ist {k}, ich bin die KI-Assistentin Ayşe. Wie kann ich helfen?", "Ich möchte einen Termin.", "Gerne. Welches Thema und welcher Tag passt Ihnen?", "Ich habe eine Blutung, was soll ich tun?", "Das ist eine medizinische Frage für unseren Arzt. Im Notfall rufen Sie den Notruf an. Ich hinterlasse dem Team eine Notiz."],
    ru: ["Здравствуйте, это {k}, я ИИ-ассистент Айше. Чем могу помочь?", "Хочу записаться.", "Конечно. По какому вопросу и в какой день вам удобно?", "У меня кровотечение, что делать?", "Это медицинский вопрос для врача. В экстренном случае звоните в службу экстренной помощи. Я оставлю записку команде."],
    ar: ["مرحبًا، هذه {k}، أنا المساعدة الذكية عائشة. كيف أساعدك؟", "أريد موعدًا.", "بالتأكيد. ما الموضوع وأي يوم يناسبك؟", "لدي نزيف، ماذا أفعل؟", "هذا سؤال طبي للطبيب. في الطوارئ اتصل برقم الطوارئ. سأترك ملاحظة للفريق."]
  };
  var AS = { d: "tr" };
  M.ayse = function (el) {
    var s = AY[AS.d];
    el.innerHTML = '<p class="ku"><b>Ayşe, sınırlı pilot.</b> Gelen çağrıyı karşılar, dil değiştirir, ekibe not bırakır. Gerçek hasta çağrısında denenmedi; canlıya çıkmadan klinik kendi bilgileriyle dener. Aşağıdaki konuşma örnek akıştır.</p><div class="fl">' + L.map(function (d) { return '<button type="button" class="' + (d === AS.d ? "on" : "") + '" data-d="' + d + '">' + d.toUpperCase() + "</button>"; }).join("") + '</div><div class="ay" dir="' + (AS.d === "ar" ? "rtl" : "ltr") + '">' + s.map(function (m, i) { return '<div class="bl ' + (i % 2 ? "h" : "o") + '">' + esc(m.replace("{k}", K.ad)) + "</div>"; }).join("") + "</div>";
    el.querySelector(".fl").onclick = function (e) { var b = e.target.closest("[data-d]"); if (b) { AS.d = b.dataset.d; M.ayse(el); } };
  };

  /* ---------- Kliniğe özel ---------- */
  var ZON = [["c_uk", 0], ["c_de", 1], ["c_nl", 1], ["c_ru", 3], ["c_sa", 3]]; // kış saati farkı, Antalya UTC+3
  var Z = { u: 0, s: "18:00" };
  M.saat = function (el) {
    var sa = []; for (var i = 7; i <= 22; i++) sa.push(("0" + i).slice(-2) + ":00");
    var h = parseInt(Z.s, 10) + (3 - ZON[Z.u][1]), a = ((h % 24) + 24) % 24, uygun = a >= 9 && a < 19;
    el.innerHTML = '<div class="ik2"><label class="e">' + esc(t("u_country").replace(/\?|؟/g, "")) + '<select class="g" id="zu">' + ZON.map(function (x, i) { return '<option value="' + i + '"' + (i === Z.u ? " selected" : "") + ">" + esc(t(x[0])) + "</option>"; }).join("") + '</select></label><label class="e">' + esc(t("z_you")) + '<select class="g" id="zs">' + sa.map(function (s) { return "<option" + (s === Z.s ? " selected" : "") + ">" + s + "</option>"; }).join("") + '</select></label></div><div class="sb-o"><div><small>' + esc(t("z_you")) + "</small><b>" + Z.s + "</b></div><span>→</span><div><small>" + esc(t("z_clinic")) + "</small><b>" + ("0" + a).slice(-2) + ":00</b></div></div><p class=\"" + (uygun ? "tm" : "hata") + '">' + esc(t(uygun ? "z_in" : "z_out")) + '</p><p class="dm">' + esc(t("z_ok")) + "</p>";
    el.querySelector("#zu").onchange = function (e) { Z.u = +e.target.value; M.saat(el); };
    el.querySelector("#zs").onchange = function (e) { Z.s = e.target.value; M.saat(el); };
  };

  var FO = {};
  M.foto = function (el) {
    var a = ["p_1", "p_2", "p_3", "p_4"], n = a.filter(function (x) { return FO[x]; }).length;
    el.innerHTML = '<div class="ad"><div class="ad-c"><i style="width:' + n * 25 + '%"></i></div><small>' + n + "/4 " + esc(t("p_of")) + '</small></div><div class="fg">' + a.map(function (x) {
      return '<label class="fk' + (FO[x] ? " on" : "") + '">' + (FO[x] ? '<img alt="" src="' + FO[x] + '">' : '<span class="fi">+</span>') + "<b>" + esc(t(x)) + '</b><input type="file" accept="image/*" data-p="' + x + '"></label>';
    }).join("") + '</div><p class="dm">' + esc(t("f_demo")) + "</p>";
    el.onchange = function (e) { var i = e.target; if (!i.dataset || !i.dataset.p || !i.files || !i.files[0]) return; if (FO[i.dataset.p]) URL.revokeObjectURL(FO[i.dataset.p]); FO[i.dataset.p] = URL.createObjectURL(i.files[0]); M.foto(el); };
  };

  var SY = { tar: "", gun: 5, hot: false, tra: false, com: false };
  M.seyahat = function (el) {
    var not = []; if (SY.tar) not.push(t("t_arr") + ": " + SY.tar); not.push(t("t_days") + ": " + SY.gun + " " + t("t_day")); if (SY.hot) not.push(t("t_hot")); if (SY.tra) not.push(t("t_tra")); if (SY.com) not.push(t("t_com"));
    el.innerHTML = '<div class="ik2"><label class="e">' + esc(t("t_arr")) + '<input class="g" type="date" id="st" value="' + SY.tar + '"></label><label class="e">' + esc(t("t_days")) + ": <b id=\"sg\">" + SY.gun + '</b><input type="range" id="sr" min="2" max="21" value="' + SY.gun + '"></label></div><div class="kk">' + [["hot", "t_hot"], ["tra", "t_tra"], ["com", "t_com"]].map(function (x) { return '<label class="on-k"><input type="checkbox" data-c="' + x[0] + '"' + (SY[x[0]] ? " checked" : "") + "><span>" + esc(t(x[1])) + "</span></label>"; }).join("") + '</div><div class="bl o"><b>' + esc(t("t_sum")) + "</b><br>" + not.map(esc).join("<br>") + '</div><p class="dm">' + esc(t("f_demo")) + "</p>";
    el.querySelector("#st").onchange = function (e) { SY.tar = e.target.value; M.seyahat(el); };
    el.querySelector("#sr").onchange = function (e) { SY.gun = +e.target.value; M.seyahat(el); };
    el.querySelector("#sr").oninput = function (e) { el.querySelector("#sg").textContent = e.target.value; };
    el.querySelector(".kk").onchange = function (e) { if (e.target.dataset.c) { SY[e.target.dataset.c] = e.target.checked; M.seyahat(el); } };
  };

  var KT = { l: [] };
  M.kontrol = function (el) {
    el.innerHTML = '<div class="ik2"><label class="e">' + esc(t("k_who")) + '<input class="g" id="kw" placeholder="' + esc(t("k_who")) + '"></label><label class="e">' + esc(t("k_last")) + '<input class="g" id="kd" type="date"></label></div><p class="hata" id="ke" role="alert"></p><button type="button" class="dg" id="ka">' + esc(t("k_add")) + '</button><ul class="ku-l">' + KT.l.map(function (x) { return "<li><b>" + esc(x.a) + "</b> · " + esc(t("k_rem")) + ": " + esc(new Date(x.t).toLocaleDateString(lang === "ar" ? "ar" : lang)) + "</li>"; }).join("") + '</ul><p class="dm">' + esc(t("k_p")) + "</p>";
    el.querySelector("#ka").onclick = function () {
      var a = el.querySelector("#kw").value.trim(), d = el.querySelector("#kd").value, e = el.querySelector("#ke");
      if (!a) { e.textContent = t("f_err_name"); return; } if (!d) { e.textContent = t("f_err_slot"); return; }
      var x = new Date(d); x.setMonth(x.getMonth() + 6); KT.l.push({ a: a, t: x.getTime() }); M.kontrol(el);
    };
  };

  var BU = { s: null };
  M.bulusma = function (el) {
    el.innerHTML = '<form class="rf" novalidate><label class="e">' + esc(t("b_city")) + '<select class="g" id="bc">' + K.sehirler.map(function (x) { return "<option>" + esc(x) + "</option>"; }).join("") + '</select></label><div class="ik2"><label class="e">' + esc(t("f_name")) + '<input class="g" id="bn"></label><label class="e">' + esc(t("f_phone")) + '<input class="g" id="bt" inputmode="tel"></label></div><label class="e">' + esc(t("f_topic")) + konuSec("bk", seciliKonu) + '</label><p class="hata" id="bh" role="alert"></p><button class="dg" type="submit">' + esc(t("f_send")) + '</button><p class="tm" id="bo" role="status"></p><p class="dm">' + esc(t("f_demo")) + "</p></form>";
    el.querySelector("form").onsubmit = function (e) {
      e.preventDefault(); var h = el.querySelector("#bh"), n = el.querySelector("#bn").value, r = el.querySelector("#bt").value; h.textContent = "";
      if (!n.trim()) { h.textContent = t("f_err_name"); return; } if (!telGecerli(r)) { h.textContent = t("f_err_phone"); return; }
      ekle({ ad: n, tel: r, kaynak: "Görüşme günü", konu: el.querySelector("#bk").value, not: "Görüşme günü kaydı: " + el.querySelector("#bc").value + "." });
      el.querySelector("#bo").textContent = "✓ " + t("b_ok"); el.querySelector("#bn").value = ""; el.querySelector("#bt").value = "";
    };
  };

  var YN = { s: 0 };
  M.yontem = function (el) {
    var y = K.yontem || [];
    el.innerHTML = '<div class="fl">' + y.map(function (x, i) { return '<button type="button" class="' + (i === YN.s ? "on" : "") + '" data-y="' + i + '">' + esc(x.ad) + "</button>"; }).join("") + '</div><div class="bl o">' + esc(((y[YN.s] || {}).m || {})[lang] || ((y[YN.s] || {}).m || {}).en || "") + '</div><p class="dm">' + esc(t("y_p")) + "</p>";
    el.querySelector(".fl").onclick = function (e) { var b = e.target.closest("[data-y]"); if (b) { YN.s = +b.dataset.y; M.yontem(el); } };
  };

  /* ---------- Çizim, dil, sekme ---------- */
  function cizAd(ad) { [].forEach.call(document.querySelectorAll('[data-m="' + ad + '"]'), function (el) { M[ad](el); }); }
  function cizHepsi() { Object.keys(M).forEach(cizAd); }
  function dilUygula(d) {
    lang = d; document.documentElement.lang = d; document.documentElement.dir = d === "ar" ? "rtl" : "ltr";
    [].forEach.call(document.querySelectorAll("[data-t]"), function (e) { e.textContent = t(e.getAttribute("data-t")); });
    [].forEach.call(document.querySelectorAll("[data-dil]"), function (b) { var on = b.getAttribute("data-dil") === d; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    yaz("kl-" + K.slug + "-dil", d); cizHepsi();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-dil]"); if (b) { dilUygula(b.getAttribute("data-dil")); return; }
    var s = e.target.closest("[data-sekme]"); if (s) { sekme(s.getAttribute("data-sekme")); e.preventDefault(); }
  });
  function sekme(id) {
    [].forEach.call(document.querySelectorAll(".sekme"), function (x) { x.classList.toggle("ak", x.id === id); });
    [].forEach.call(document.querySelectorAll("[data-sekme]"), function (x) { var on = x.getAttribute("data-sekme") === id; x.classList.toggle("on", on); });
    var g = document.querySelector(".uy-g"); if (g) g.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  function sv() {
    var l = [].slice.call(document.querySelectorAll("iframe[data-src]"));
    if (!("IntersectionObserver" in window)) { l.forEach(function (f) { f.src = f.getAttribute("data-src"); }); return; }
    var io = new IntersectionObserver(function (g) { g.forEach(function (x) { if (x.isIntersecting && !x.target.src) { x.target.src = x.target.getAttribute("data-src"); io.unobserve(x.target); } }); }, { rootMargin: "300px" });
    l.forEach(function (f) { io.observe(f); });
  }
  document.documentElement.classList.add("js");
  var kayitli = al("kl-" + K.slug + "-dil");
  dilUygula(kayitli && K.diller.indexOf(kayitli) >= 0 ? kayitli : lang);
  if (document.querySelector(".sekme")) sekme(document.querySelector(".sekme").id);
  sv();
})();
