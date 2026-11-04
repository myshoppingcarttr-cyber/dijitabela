/* Attelia klinik paneli. Örnek veri + bu tarayıcıda oluşturulan talepler. Dışarı bir şey göndermez. */
(function () {
  "use strict";
  var K = window.KLM, D = window.KLD, DUR = ["Yeni", "Aranacak", "Onaylandı", "Tamamlandı"], DAD = { tr: "Türkçe", en: "İngilizce", de: "Almanca", ru: "Rusça", ar: "Arapça" };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var konu = function (k) { return D[k] ? D[k][0] : k; };
  var S = { f: "Tümü", ara: "", sec: null };
  var $ = function (s) { return document.querySelector(s); };
  function ciz() {
    var l = K.kayitlar();
    // Özet
    var say = function (fn) { return l.filter(fn).length; }, yeni = say(function (x) { return x.durum === "Yeni"; }), ara = say(function (x) { return x.durum === "Aranacak"; }), dis = say(function (x) { return x.dil !== "tr"; });
    $("#oz").innerHTML = [["Toplam talep", l.length], ["Yanıt bekleyen", yeni], ["Bugün aranacak", ara], ["Yurt dışı", dis]].map(function (x) { return "<div><span>" + x[0] + "</span><b>" + x[1] + "</b></div>"; }).join("");
    // Dağılım
    var dag = function (al, sira, ad) { var t = {}; l.forEach(function (x) { t[x[al]] = (t[x[al]] || 0) + 1; }); var m = Math.max.apply(null, sira.map(function (k) { return t[k] || 0; }).concat(1)); return sira.map(function (k) { var n = t[k] || 0; return '<div class="bar"><span>' + esc(ad ? ad[k] : k) + '</span><i><u style="width:' + (n * 100 / m) + '%"></u></i><b>' + n + "</b></div>"; }).join(""); };
    $("#dl").innerHTML = dag("dil", ["tr", "en", "de", "ru", "ar"], DAD);
    $("#kn").innerHTML = dag("kaynak", ["Yurt dışı talep", "Kaçan çağrı", "Randevu formu", "Mesaj"]);
    // Geri arama sırası
    var q = l.filter(function (x) { return x.durum === "Aranacak" || x.durum === "Yeni"; }).slice(0, 5);
    $("#sira").innerHTML = q.map(function (r) { return '<button type="button" data-ac="' + r.id + '"><b>' + esc(r.ad) + "</b><span>" + esc(konu(r.konu)) + " · " + r.dil.toUpperCase() + "</span><em>" + esc(r.durum) + "</em></button>"; }).join("") || "<p>Bekleyen yok.</p>";
    $("#son").innerHTML = l.slice(0, 7).map(function (r) { return '<button type="button" data-ac="' + r.id + '"><span>' + esc(r.zaman) + "</span><b>" + esc(r.ad) + "</b><span>" + esc(konu(r.konu)) + "</span><span>" + esc(r.kaynak) + "</span><span>" + (DAD[r.dil] || r.dil) + "</span><em>" + esc(r.durum) + "</em></button>"; }).join("");
    // Pano
    var gor = l.filter(function (x) { return (S.f === "Tümü" || x.kaynak === S.f) && (!S.ara || (x.ad + konu(x.konu) + x.not).toLowerCase().indexOf(S.ara) >= 0); });
    $("#fl").innerHTML = ["Tümü", "Yurt dışı talep", "Kaçan çağrı", "Randevu formu", "Mesaj"].map(function (k) { return '<button type="button" class="' + (k === S.f ? "on" : "") + '" data-f="' + k + '">' + k + "</button>"; }).join("");
    $("#pano").innerHTML = DUR.map(function (d) { var kk = gor.filter(function (x) { return x.durum === d; }); return '<section data-kolon="' + d + '"><h3>' + d + " <span>" + kk.length + "</span></h3>" + kk.map(function (r) { return '<article draggable="true" data-id="' + r.id + '"><div><b>' + esc(r.ad) + '</b><i>' + r.dil.toUpperCase() + "</i></div><p>" + esc(konu(r.konu)) + "</p><small>" + esc(r.kaynak) + " · " + esc(r.zaman) + "</small></article>"; }).join("") + "</section>"; }).join("");
    if (S.sec) dosya(S.sec);
  }
  function dosya(id) {
    var r = K.kayitlar().filter(function (x) { return x.id === id; })[0]; if (!r) { $("#dosya").classList.remove("ak"); return; }
    S.sec = id;
    $("#dosya").innerHTML = '<button type="button" class="kp-x" data-kapat aria-label="Kapat">×</button><p class="ey">HASTA DOSYASI · ÖRNEK</p><h2>' + esc(r.ad) + "</h2><p>" + esc(konu(r.konu)) + " · " + (DAD[r.dil] || r.dil) + '</p><dl><dt>Telefon</dt><dd>' + esc(r.tel) + "</dd><dt>Kaynak</dt><dd>" + esc(r.kaynak) + "</dd><dt>Zaman</dt><dd>" + esc(r.zaman) + "</dd></dl><h4>Not</h4><p>" + esc(r.not) + '</p><h4>Durum</h4><div class="dr-b">' + DUR.map(function (d) { return '<button type="button" class="' + (d === r.durum ? "on" : "") + '" data-d="' + d + '">' + d + "</button>"; }).join("") + '</div><h4>Hazır mesaj</h4><div class="mj">Merhaba, Attelia ekibinden yazıyorum. Talebinizi aldık, uygun saatinizi paylaşır mısınız?</div><p class="ku">Önizleme: mesaj gönderilmez. Tıbbi soruyu hekim yanıtlar.</p>';
    $("#dosya").classList.add("ak");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button,[data-id]"); if (!b) return;
    if (b.dataset.f) { S.f = b.dataset.f; ciz(); }
    if (b.dataset.ac) { dosya(b.dataset.ac); }
    if (b.dataset.id) { dosya(b.dataset.id); }
    if (b.dataset.kapat !== undefined) { S.sec = null; $("#dosya").classList.remove("ak"); }
    if (b.dataset.d && S.sec) { K.durum(S.sec, b.dataset.d); ciz(); }
    if (b.dataset.syf) {
      [].forEach.call(document.querySelectorAll("[data-syf]"), function (x) { x.classList.toggle("on", x === b); });
      [].forEach.call(document.querySelectorAll(".syf"), function (x) { x.classList.toggle("ak", x.id === b.dataset.syf); });
    }
  });
  document.addEventListener("input", function (e) { if (e.target.id === "ara") { S.ara = e.target.value.toLowerCase(); ciz(); } });
  document.addEventListener("dragstart", function (e) { var a = e.target.closest("[data-id]"); if (a) e.dataTransfer.setData("text/plain", a.dataset.id); });
  document.addEventListener("dragover", function (e) { if (e.target.closest("[data-kolon]")) e.preventDefault(); });
  document.addEventListener("drop", function (e) { var k = e.target.closest("[data-kolon]"); if (!k) return; e.preventDefault(); K.durum(e.dataTransfer.getData("text/plain"), k.dataset.kolon); ciz(); });
  document.addEventListener("DOMContentLoaded", ciz);
})();
