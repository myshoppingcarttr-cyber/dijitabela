// ===== Satış takibi (CRM): müşteri adayları, e-posta / arama durumu, aşama, takip tarihi =====
(function () {
  "use strict";
  var e = window.esc, A = window.AJANS, TL = FIYAT.TL;
  var SEKTOR = { emlak: "Emlak", galeri: "Oto galeri", dis: "Diş kliniği", sac: "Saç ekimi", guzellik: "Güzellik merkezi", saglik: "Sağlık turizmi", oto: "Oto servis", diger: "Diğer" };
  var ASAMA = [["yeni", "Yeni"], ["prototip", "Prototip hazır"], ["iletisim", "İletişim kuruldu"], ["gorusme", "Görüşme"], ["teklif", "Teklif verildi"], ["kazanildi", "Kazanıldı"], ["kaybedildi", "Kaybedildi"]];
  var ASAMA_AD = {}; ASAMA.forEach(function (x, i) { ASAMA_AD[x[0]] = x[1]; });
  var SIRA = ASAMA.map(function (x) { return x[0]; });
  var MAIL = { gonderilmedi: "Gönderilmedi", gonderildi: "Gönderildi · cevap bekleniyor", cevap_geldi: "Cevap geldi", cevap_yok: "Cevap yok", ret: "İstemiyor (ret)" };
  var ARAMA = { aranmadi: "Aranmadı", ulasilamadi: "Ulaşılamadı", gorusuldu: "Görüşüldü", geri_ara: "Geri aranacak", ilgilenmiyor: "İlgilenmiyor" };
  var TON = { gonderilmedi: "", aranmadi: "", gonderildi: "bek", ulasilamadi: "bek", geri_ara: "bek", cevap_geldi: "iyi", gorusuldu: "iyi", cevap_yok: "kotu", ret: "kotu", ilgilenmiyor: "kotu" };
  var FILTRE = [["bugun", "Bugün yapılacak"], ["acik", "Açık adaylar"], ["mail_yok", "Mail gönderilmedi"], ["mail_bek", "Cevap bekleyen"], ["aranmadi", "Aranmadı"], ["geri_ara", "Geri aranacak"], ["kazanildi", "Kazanıldı"], ["kaybedildi", "Kaybedildi"], ["tumu", "Tümü"]];
  var C = { filtre: "bugun", sektor: "", ara: "", acik: null, list: [], yeni: false };

  var bugun = function () { return new Date().toISOString().slice(0, 10); };
  var gunSonra = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  var tarihK = function (s) { return s ? new Date(s).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) : ""; };
  var acik = function (a) { return a.asama !== "kazanildi" && a.asama !== "kaybedildi"; };
  var gecikti = function (a) { return acik(a) && a.sonraki_tarih && a.sonraki_tarih < bugun(); };
  var waNo = function (tel) { var n = String(tel || "").replace(/\D/g, "").slice(-10); return n.length === 10 ? "90" + n : ""; };
  var enAz = function (a, s) { return SIRA.indexOf(a.asama) < SIRA.indexOf(s) && acik(a) ? s : a.asama; };  // aşamayı geri almaz
  var pill = function (k, ad) { return '<span class="crm-pill ' + (TON[k] || "") + '">' + e(ad) + "</span>"; };

  function filtrele(L) {
    var q = C.ara.toLocaleLowerCase("tr");
    return L.filter(function (a) {
      if (C.sektor && a.sektor !== C.sektor) return false;
      if (q && (a.isletme + " " + (a.ilce || "") + " " + (a.tel || "") + " " + (a.eposta || "")).toLocaleLowerCase("tr").indexOf(q) < 0) return false;
      switch (C.filtre) {
        case "bugun": return acik(a) && a.sonraki_tarih && a.sonraki_tarih <= bugun();
        case "acik": return acik(a);
        case "mail_yok": return acik(a) && a.mail_durum === "gonderilmedi";
        case "mail_bek": return a.mail_durum === "gonderildi";
        case "aranmadi": return acik(a) && a.arama_durum === "aranmadi";
        case "geri_ara": return a.arama_durum === "geri_ara" || a.arama_durum === "ulasilamadi";
        case "kazanildi": case "kaybedildi": return a.asama === C.filtre;
        default: return true;
      }
    }).sort(function (x, y) {   // önce gecikenler, sonra takip tarihi yakın olanlar
      var dx = x.sonraki_tarih || "9999", dy = y.sonraki_tarih || "9999";
      return dx < dy ? -1 : dx > dy ? 1 : String(y.guncelleme).localeCompare(String(x.guncelleme));
    });
  }

  function mailMetni(a) {
    var konu = a.isletme + " için hazırladığımız web sitesi taslağı";
    var govde = "Merhaba,\n\n" + a.isletme + " için Google'daki bilgilerinizden yola çıkarak size özel bir web sitesi taslağı hazırladık" +
      (a.prototip ? ":\n" + a.prototip + "\n" : ".\n") +
      "\nTaslak ücretsizdir, bakmanız yeterli. Beğenirseniz 1 hafta içinde kendi alan adınızda yayına alabiliriz; Google'da görünürlük, randevu ve müşteri takibi de eklenebilir.\n" +
      "\n2 dakikalık bir telefon görüşmesi için uygun olduğunuz bir zamanı yazarsanız arayalım.\n\nİyi çalışmalar,\n" + A.sahip + "\n" + A.marka + (A.telefon ? " · " + A.telefon : "") + "\n" + A.site.replace(/^https?:\/\/(www\.)?/, "") +
      "\n\n—\nBu tür e-postaları almak istemiyorsanız \"İstemiyorum\" yazarak yanıtlamanız yeterli; bir daha gönderilmez.";
    return "mailto:" + encodeURIComponent(a.eposta || "") + "?subject=" + encodeURIComponent(konu) + "&body=" + encodeURIComponent(govde);
  }
  function waMetni(a) {
    return "https://wa.me/" + waNo(a.tel) + "?text=" + encodeURIComponent("Merhaba, " + A.marka + " olarak yazıyoruz. " + a.isletme + " için size özel bir web sitesi taslağı hazırladık" + (a.prototip ? ": " + a.prototip : ".") + " Bakıp fikrinizi yazarsanız sevinirim.");
  }

  function kpi(L) {
    var gon = L.filter(function (a) { return a.mail_durum !== "gonderilmedi"; }).length;
    var cev = L.filter(function (a) { return a.mail_durum === "cevap_geldi"; }).length;
    var ara = L.filter(function (a) { return a.arama_durum !== "aranmadi"; }).length;
    var gor = L.filter(function (a) { return a.arama_durum === "gorusuldu" || a.asama === "gorusme" || a.asama === "teklif"; }).length;
    var kaz = L.filter(function (a) { return a.asama === "kazanildi"; });
    var bug = L.filter(function (a) { return acik(a) && a.sonraki_tarih && a.sonraki_tarih <= bugun(); }).length;
    var t = function (b, s, x) { return "<div" + (x ? ' class="' + x + '"' : "") + "><b>" + b + "</b><span>" + s + "</span></div>"; };
    return '<div class="crm-kpi">' + t(L.length, "Toplam aday") + t(bug, "Bugün yapılacak", bug ? "uyari" : "") + t(gon, "Mail gönderilen") +
      t(gon ? "%" + Math.round(cev / gon * 100) : "–", "Cevap oranı (" + cev + ")") + t(ara, "Aranan") + t(gor, "Görüşme / teklif") +
      t(kaz.length, "Kazanılan · " + TL(kaz.reduce(function (s, a) { return s + (Number(a.tahmini_tutar) || 0); }, 0))) + "</div>" +
      '<div class="crm-huni">' + ASAMA.map(function (x) {
        var n = L.filter(function (a) { return a.asama === x[0]; }).length;
        return '<div class="h-' + x[0] + '"><b>' + n + "</b><span>" + x[1] + "</span></div>";
      }).join("") + "</div>";
  }

  function satir(a) {
    var yeni = a.id === C.acik;
    var gec = gecikti(a);
    return '<tr class="' + (yeni ? "on" : "") + '"><td><b>' + e(a.isletme) + "</b>" + (!a.web ? ' <span class="crm-tag">sitesi yok</span>' : "") +
      '<br><small class="mute">' + e(SEKTOR[a.sektor] || a.sektor || "") + (a.ilce ? " · " + e(a.ilce) : "") + (a.puan ? " · ★ " + String(a.puan).replace(".", ",") + (a.yorum ? " (" + a.yorum + ")" : "") : "") + "</small>" +
      '<div class="crm-link">' + (a.maps ? '<a href="' + e(a.maps) + '" target="_blank" rel="noopener">Harita</a>' : "") + (a.prototip ? '<a href="' + e(a.prototip) + '" target="_blank" rel="noopener">Prototip</a>' : "") + (a.web ? '<a href="' + e(a.web) + '" target="_blank" rel="noopener">Site</a>' : "") + "</div></td>" +
      "<td><small>" + (a.tel ? '<a href="tel:' + e(a.tel) + '">' + e(a.tel) + "</a><br>" : "") + e(a.eposta || "") + "</small></td>" +
      "<td>" + pill(a.mail_durum, MAIL[a.mail_durum]) + (a.mail_tarih ? ' <small class="mute">' + tarihK(a.mail_tarih) + "</small>" : "") +
      '<div class="crm-hiz">' + (a.eposta && a.mail_durum !== "ret" ? '<a class="btn btn-o sm" href="' + mailMetni(a) + '" data-mailto="' + a.id + '">Yaz</a>' : "") +
      '<button class="btn btn-o sm" data-m="gonderildi" data-id="' + a.id + '">Gönderildi</button><button class="btn btn-o sm" data-m="cevap_geldi" data-id="' + a.id + '">Cevap geldi</button><button class="btn btn-o sm" data-m="cevap_yok" data-id="' + a.id + '">Cevap yok</button></div></td>' +
      "<td>" + pill(a.arama_durum, ARAMA[a.arama_durum]) + (a.arama_tarih ? ' <small class="mute">' + tarihK(a.arama_tarih) + "</small>" : "") +
      '<div class="crm-hiz">' + (waNo(a.tel) ? '<a class="btn btn-w sm" target="_blank" rel="noopener" href="' + waMetni(a) + '">WA</a>' : "") +
      '<button class="btn btn-o sm" data-a="ulasilamadi" data-id="' + a.id + '">Ulaşılamadı</button><button class="btn btn-o sm" data-a="gorusuldu" data-id="' + a.id + '">Görüşüldü</button><button class="btn btn-o sm" data-a="geri_ara" data-id="' + a.id + '">Geri ara</button></div></td>' +
      '<td><select data-asama="' + a.id + '">' + ASAMA.map(function (x) { return '<option value="' + x[0] + '"' + (a.asama === x[0] ? " selected" : "") + ">" + x[1] + "</option>"; }).join("") + "</select></td>" +
      '<td class="' + (gec ? "gec" : "") + '"><small>' + e(a.sonraki_adim || "—") + "</small><br><b>" + (a.sonraki_tarih ? (a.sonraki_tarih === bugun() ? "Bugün" : tarihK(a.sonraki_tarih)) + (gec ? " · gecikti" : "") : "") + "</b></td>" +
      '<td><button class="btn btn-o sm" data-ac="' + a.id + '">' + (yeni ? "Kapat" : "Detay") + "</button></td></tr>" +
      (yeni ? '<tr class="crm-detay"><td colspan="7">' + detay(a) + "</td></tr>" : "");
  }

  function alan(ad, k, a, tip) {
    var v = a[k] == null ? "" : a[k];
    if (tip === "sektor") return "<label>" + ad + '<select name="' + k + '">' + Object.keys(SEKTOR).map(function (s) { return '<option value="' + s + '"' + (v === s ? " selected" : "") + ">" + SEKTOR[s] + "</option>"; }).join("") + "</select></label>";
    return "<label>" + ad + '<input name="' + k + '" type="' + (tip || "text") + '" value="' + e(v) + '"' + (tip === "number" ? ' step="any"' : "") + "></label>";
  }
  function formAlanlari(a) {
    return alan("İşletme *", "isletme", a) + alan("Sektör", "sektor", a, "sektor") + alan("İlçe", "ilce", a) + alan("Yetkili", "yetkili", a) +
      alan("Telefon", "tel", a, "tel") + alan("E-posta", "eposta", a, "email") + alan("Mevcut sitesi", "web", a, "url") + alan("Instagram", "instagram", a) +
      alan("Google Haritalar linki", "maps", a, "url") + alan("Prototip linki", "prototip", a, "url") + alan("Puan", "puan", a, "number") + alan("Yorum sayısı", "yorum", a, "number") +
      alan("Sonraki adım", "sonraki_adim", a) + alan("Takip tarihi", "sonraki_tarih", a, "date") + alan("Tahmini tutar (TL)", "tahmini_tutar", a, "number") + alan("Teklif no", "teklif_no", a);
  }
  function detay(a) {
    var notlar = (a.notlar || []).slice().reverse();
    return '<div class="crm-d"><div><h4>Notlar ve geçmiş</h4><form class="crm-not" data-not="' + a.id + '"><select name="tur"><option value="not">Not</option><option value="arama">Arama</option><option value="mail">E-posta</option><option value="ziyaret">Ziyaret</option><option value="wa">WhatsApp</option></select>' +
      '<textarea name="metin" rows="2" placeholder="Ne konuşuldu, ne söz verildi?" required></textarea><button class="btn btn-d sm">Not ekle</button></form>' +
      '<ol class="crm-zaman">' + (notlar.length ? notlar.map(function (n) { return "<li><small>" + new Date(n.tarih).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) + " · " + e(n.tur) + "</small>" + e(n.metin) + "</li>"; }).join("") : '<li class="mute">Henüz not yok.</li>') + "</ol></div>" +
      '<div><h4>Bilgiler</h4><form class="frm crm-f" data-duzen="' + a.id + '">' + formAlanlari(a) + '</form><div class="crm-hiz"><button class="btn btn-p sm" data-kaydet="' + a.id + '">Kaydet</button><button class="btn btn-o sm" data-sil="' + a.id + '">Adayı sil</button></div></div></div>';
  }

  function ciz(R, ust) {
    var L = C.list, f = filtrele(L);
    R.innerHTML = ust + kpi(L) +
      '<div class="crm-arac"><div class="pn-tabs">' + FILTRE.map(function (x) {
        var n = C.filtre === x[0] ? " (" + f.length + ")" : "";
        return '<button data-cf="' + x[0] + '"' + (C.filtre === x[0] ? ' class="on"' : "") + ">" + x[1] + n + "</button>";
      }).join("") + "</div>" +
      '<div class="crm-ust"><input id="cq" type="search" placeholder="İşletme, ilçe, telefon ara" value="' + e(C.ara) + '"><select id="cs"><option value="">Tüm sektörler</option>' + Object.keys(SEKTOR).map(function (s) { return '<option value="' + s + '"' + (C.sektor === s ? " selected" : "") + ">" + SEKTOR[s] + "</option>"; }).join("") + "</select>" +
      '<button class="btn btn-p sm" id="cy">+ Yeni aday</button><label class="btn btn-o sm" style="cursor:pointer">İçe aktar<input id="ci" type="file" accept=".json,.csv" hidden></label><button class="btn btn-o sm" id="cx">Dışa aktar (CSV)</button></div></div>' +
      (C.yeni ? '<div class="box crm-yeni"><h3>Yeni aday</h3><form class="frm crm-f" id="cyf">' + formAlanlari({ sektor: "emlak" }) + '</form><div class="crm-hiz"><button class="btn btn-p sm" id="cyk">Ekle</button><button class="btn btn-o sm" id="cyv">Vazgeç</button></div></div>' : "") +
      '<div class="tbl"><table class="crm-t"><thead><tr><th>Aday</th><th>İletişim</th><th>E-posta</th><th>Arama</th><th>Aşama</th><th>Sonraki adım</th><th></th></tr></thead><tbody>' +
      (f.length ? f.map(satir).join("") : '<tr><td colspan="7" class="mute">' + (C.filtre === "bugun" ? "Bugün için bekleyen iş yok." : "Bu filtrede aday yok.") + "</td></tr>") + "</tbody></table></div>";
    bagla(R, ust);
    if (C.baglaUst) C.baglaUst();
  }

  function kaydet(a, R, ust) { return API.adayKaydet(a).then(function (x) { var i = C.list.findIndex(function (y) { return y.id === x.id; }); if (i > -1) C.list[i] = x; else C.list.unshift(x); ciz(R, ust); }).catch(function (x) { alert("Kaydedilemedi: " + x.message); }); }
  function bul(id) { return C.list.find(function (a) { return a.id === id; }); }
  function notEkle(a, tur, metin) { return (a.notlar || []).concat([{ tarih: new Date().toISOString(), tur: tur, metin: metin }]); }
  function formOku(f) {
    var o = {}; [].forEach.call(f.elements, function (el) { if (!el.name) return; var v = el.value.trim(); o[el.name] = v === "" ? null : (el.type === "number" ? Number(v.replace(",", ".")) : v); });
    return o;
  }

  function bagla(R, ust) {
    var re = function () { ciz(R, ust); };
    R.querySelectorAll("[data-cf]").forEach(function (b) { b.onclick = function () { C.filtre = b.dataset.cf; re(); }; });
    var cq = R.querySelector("#cq"); cq.oninput = function () { C.ara = cq.value; clearTimeout(C.t); C.t = setTimeout(function () { re(); var q = R.querySelector("#cq"); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }, 250); };
    R.querySelector("#cs").onchange = function (ev) { C.sektor = ev.target.value; re(); };
    R.querySelector("#cy").onclick = function () { C.yeni = !C.yeni; re(); };
    var cyk = R.querySelector("#cyk"); if (cyk) cyk.onclick = function () {
      var o = formOku(R.querySelector("#cyf")); if (!o.isletme) return alert("İşletme adı gerekli.");
      o.notlar = [{ tarih: new Date().toISOString(), tur: "not", metin: "Aday eklendi." }];
      if (!o.sonraki_tarih) { o.sonraki_tarih = bugun(); o.sonraki_adim = o.sonraki_adim || (o.eposta ? "Tanıtım e-postası gönder" : "Telefonla ara"); }
      C.yeni = false; kaydet(o, R, ust);
    };
    var cyv = R.querySelector("#cyv"); if (cyv) cyv.onclick = function () { C.yeni = false; re(); };
    R.querySelector("#cx").onclick = function () {
      var k = ["isletme", "sektor", "ilce", "tel", "eposta", "web", "puan", "yorum", "asama", "mail_durum", "arama_durum", "sonraki_adim", "sonraki_tarih", "tahmini_tutar", "prototip", "maps"];
      var csv = "﻿" + k.join(";") + "\n" + C.list.map(function (a) { return k.map(function (x) { return '"' + String(a[x] == null ? "" : a[x]).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
      var u = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), l = document.createElement("a");
      l.href = u; l.download = "adaylar-" + bugun() + ".csv"; l.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    };
    R.querySelector("#ci").onchange = function (ev) {
      var fl = ev.target.files[0]; if (!fl) return;
      fl.text().then(function (t) {
        var list;
        if (/\.json$/i.test(fl.name)) list = JSON.parse(t);
        else { var rows = t.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean).map(function (r) { return r.split(";").map(function (c) { return c.replace(/^"|"$/g, "").replace(/""/g, '"'); }); }); var h = rows.shift(); list = rows.map(function (r) { var o = {}; h.forEach(function (k, i) { if (r[i] !== "") o[k] = r[i]; }); return o; }); }
        return API.adaylarIceAktar(list.filter(function (a) { return a.isletme; }));
      }).then(function (n) { return API.adaylar().then(function (l) { C.list = l || []; re(); alert(n + " aday içe aktarıldı."); }); }).catch(function (x) { alert("İçe aktarılamadı: " + x.message); });
    };
    R.querySelectorAll("[data-ac]").forEach(function (b) { b.onclick = function () { C.acik = C.acik === b.dataset.ac ? null : b.dataset.ac; re(); }; });
    // e-posta durumları
    R.querySelectorAll("[data-m]").forEach(function (b) { b.onclick = function () {
      var a = bul(b.dataset.id), m = b.dataset.m, x = { id: a.id, mail_durum: m, notlar: notEkle(a, "mail", MAIL[m]) };
      if (m === "gonderildi") { x.mail_tarih = new Date().toISOString(); x.asama = enAz(a, "iletisim"); x.sonraki_adim = "Cevap gelmezse telefonla ara"; x.sonraki_tarih = gunSonra(3); }
      if (m === "cevap_geldi") { x.asama = enAz(a, "gorusme"); x.sonraki_adim = "Cevaba dön, görüşme ayarla"; x.sonraki_tarih = bugun(); }
      if (m === "cevap_yok") { x.sonraki_adim = "Telefonla ara"; x.sonraki_tarih = bugun(); }
      kaydet(x, R, ust);
    }; });
    R.querySelectorAll("[data-mailto]").forEach(function (l) { l.addEventListener("click", function () {
      var a = bul(l.dataset.mailto); if (a.mail_durum === "gonderilmedi") setTimeout(function () { if (confirm("E-posta gönderildi olarak işaretlensin mi?")) R.querySelector('[data-m="gonderildi"][data-id="' + a.id + '"]').click(); }, 800);
    }); });
    // arama durumları
    R.querySelectorAll("[data-a]").forEach(function (b) { b.onclick = function () {
      var a = bul(b.dataset.id), s = b.dataset.a, x = { id: a.id, arama_durum: s, arama_tarih: new Date().toISOString() };
      var metin = s === "gorusuldu" ? prompt("Görüşme notu (ne konuşuldu?)", "") : ARAMA[s];
      if (metin === null) return;
      x.notlar = notEkle(a, "arama", metin || ARAMA[s]);
      if (s === "ulasilamadi") { x.sonraki_adim = "Tekrar ara"; x.sonraki_tarih = gunSonra(1); }
      if (s === "geri_ara") { var g = prompt("Ne zaman geri aranacak? (gün sonra)", "2"); if (g === null) return; x.sonraki_adim = "Geri ara"; x.sonraki_tarih = gunSonra(parseInt(g, 10) || 1); }
      if (s === "gorusuldu") { x.asama = enAz(a, "gorusme"); x.sonraki_adim = "Teklif gönder / uğra"; x.sonraki_tarih = gunSonra(2); }
      kaydet(x, R, ust);
    }; });
    R.querySelectorAll("[data-asama]").forEach(function (s) { s.onchange = function () {
      var a = bul(s.dataset.asama), x = { id: a.id, asama: s.value, notlar: notEkle(a, "asama", "Aşama: " + ASAMA_AD[s.value]) };
      if (!acik({ asama: s.value })) { x.sonraki_tarih = null; x.sonraki_adim = s.value === "kazanildi" ? "Projeyi başlat" : null; }
      kaydet(x, R, ust);
    }; });
    R.querySelectorAll("[data-not]").forEach(function (f) { f.onsubmit = function (ev) {
      ev.preventDefault(); var a = bul(f.dataset.not); kaydet({ id: a.id, notlar: notEkle(a, f.tur.value, f.metin.value.trim()) }, R, ust);
    }; });
    R.querySelectorAll("[data-kaydet]").forEach(function (b) { b.onclick = function () {
      var o = formOku(R.querySelector('[data-duzen="' + b.dataset.kaydet + '"]')); if (!o.isletme) return alert("İşletme adı gerekli.");
      o.id = b.dataset.kaydet; kaydet(o, R, ust);
    }; });
    R.querySelectorAll("[data-sil]").forEach(function (b) { b.onclick = function () {
      if (!confirm("Aday kalıcı olarak silinsin mi?")) return;
      API.adaySil(b.dataset.sil).then(function () { C.list = C.list.filter(function (a) { return a.id !== b.dataset.sil; }); C.acik = null; re(); });
    }; });
  }

  window.CRM = {
    // ust: panelin başlık HTML'i; baglaUst: başlıktaki düğmeleri (görünüm değiştir, çıkış) her çizimden sonra bağlar
    goster: function (R, ust, baglaUst) { C.baglaUst = baglaUst; return API.adaylar().then(function (l) { C.list = l || []; ciz(R, ust); }); }
  };
})();
