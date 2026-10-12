/* İşletme paneli · Antalya BB Bilgisayar prototipi (Dijitabela). Tüm kayıtlar örnektir. */
(function () {
  var $ = U.$, $$ = U.$$, NS = "http://www.w3.org/2000/svg";
  var ISLER = ABS.isler.map(function (x) { return Object.assign({}, x); });
  var STOK = ABS.stok.map(function (x) { return Object.assign({}, x); });
  var SAB = ABS.sablonlar.map(function (x) { return Object.assign({}, x); });
  var EKIP = {}; ABS.ekip.forEach(function (e) { EKIP[e.id] = e; });
  var KOLR = { yeni: "#9AA3C7", alim: "#F08A24", teshis: "#8B5CF6", onay: "#E2483D", onarim: "#246AF4", hazir: "#0EA5A4", teslim: "#14A86B" };
  var SABK = { alim: "yolda", onay: "teshis", hazir: "hazir", teslim: "yorum" };
  var GA = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var d0 = new Date(); $("#tarih").textContent = d0.getDate() + " " + AY[d0.getMonth()] + " " + GA[d0.getDay()];
  var GON = [
    { s: "09:12", no: "ABS-24129", sab: "Kurye yolda", dur: "Okundu" }, { s: "09:40", no: "ABS-24117", sab: "Teşhis + fiyat onayı", dur: "Okundu" },
    { s: "10:05", no: "ABS-24104", sab: "Onarım bitti", dur: "İletildi" }, { s: "10:31", no: "ABS-24096", sab: "Teslim sonrası yorum", dur: "Okundu" }
  ];

  /* ---------- görünüm geçişi ---------- */
  function gorunum() {
    var v = (location.hash || "#pano").slice(1); if (!$("#v-" + v)) v = "pano";
    $$(".gor").forEach(function (g) { g.classList.toggle("ak", g.id === "v-" + v); });
    $$(".yan a[data-v]").forEach(function (a) { a.classList.toggle("ak", a.dataset.v === v); });
    if (v === "rota") rotaCiz(); if (v === "rapor") raporCiz();
    scrollTo(0, 0); setTimeout(function () { dispatchEvent(new Event("scroll")); }, 60);
  }
  addEventListener("hashchange", gorunum);

  function rozetler() {
    $("#say-onay").textContent = ISLER.filter(function (i) { return i.kol === "onay"; }).length;
    $("#say-stok").textContent = STOK.filter(function (s) { return s.adet < s.min; }).length;
  }
  function sla(s) { return s < 1 ? Math.round(s * 60) + " dk" : s < 24 ? Math.floor(s) + " sa" : Math.floor(s / 24) + " g " + Math.floor(s % 24) + " sa"; }
  function av(id, k) { var e = EKIP[id]; return e ? '<span class="av" style="background:' + e.renk + (k ? ";width:" + k + "px;height:" + k + "px" : "") + '" title="' + e.ad + " · " + e.rol + '">' + e.ad[0] + "</span>" : '<span class="av" style="background:#C5CBDD" title="Atanmadı">?</span>'; }

  /* ---------- 1. Kanban ---------- */
  var FIL = { kim: "hepsi", q: "" };
  $("#filtre").innerHTML = [["hepsi", "Tümü"], ["hakan", "Hakan"], ["burak", "Burak"], ["emre", "Emre (kurye)"], ["okan", "Okan (kurye)"], ["kurumsal", "Kurumsal"], ["acil", "Acil"]].map(function (f) { return '<button type="button" class="yonga" data-f="' + f[0] + '">' + f[1] + "</button>"; }).join("");
  $("#filtre").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; FIL.kim = b.dataset.f; panoCiz(); });
  $("#ara").addEventListener("input", function () { FIL.q = this.value.toLowerCase(); if ((location.hash || "#pano") !== "#pano") location.hash = "#pano"; panoCiz(); });
  function uygun(i) {
    if (FIL.q && (i.no + i.ad + i.cihaz + i.belirti + i.mah).toLowerCase().indexOf(FIL.q) < 0) return false;
    if (FIL.kim === "kurumsal") return !!i.kurumsal; if (FIL.kim === "acil") return !!i.acil;
    return FIL.kim === "hepsi" || i.tek === FIL.kim;
  }
  function kpi() {
    var acik = ISLER.filter(function (i) { return i.kol !== "teslim"; }).length, onay = ISLER.filter(function (i) { return i.kol === "onay"; }).length,
      durak = ISLER.filter(function (i) { return i.kol === "alim" || i.kol === "hazir"; }).length, kritik = STOK.filter(function (s) { return s.adet < s.min; }).length;
    $("#kpi").innerHTML = [["Açık iş emri", acik, "panodaki kartlar", "rgba(36,106,244,.1)"], ["Onay bekleyen", onay, "müşteri yanıtı bekleniyor", "rgba(226,72,61,.1)"], ["Bugünkü kurye durağı", durak, "alım + teslim", "rgba(240,138,36,.12)"], ["Kritik stok", kritik, "minimumun altında", "rgba(20,168,107,.1)"]]
      .map(function (k) { return '<div class="yuz" style="--r:' + k[3] + '"><small>' + k[0] + "</small><b>" + k[1] + "</b><span>" + k[2] + "</span></div>"; }).join("");
  }
  function panoCiz() {
    $$("#filtre .yonga").forEach(function (b) { b.classList.toggle("sec", b.dataset.f === FIL.kim); });
    $("#pano").innerHTML = ABS.kolonlar.map(function (k) {
      var l = ISLER.filter(function (i) { return i.kol === k.id && uygun(i); });
      return '<div class="kol" data-k="' + k.id + '"><div class="kol-bas"><i style="background:' + KOLR[k.id] + '"></i>' + k.ad + '<span class="n">' + l.length + "</span></div>" + l.map(function (i) {
        var gec = i.kol !== "teslim" && i.saat > 48;
        return '<div class="ik-kart" draggable="true" data-no="' + i.no + '"><div class="no"><span>' + i.no + '</span><span class="sla' + (gec ? " gec" : "") + '">⏱ ' + sla(i.saat) + "</span></div><h4>" + U.esc(i.cihaz) + "</h4><p>" + U.esc(i.belirti) + " · " + i.mah + '</p><div class="alt-s"><div style="display:flex;gap:6px;align-items:center">' + av(i.tek) +
          (i.kurumsal ? '<span class="roz mavi">Kurumsal</span>' : "") + (i.acil ? '<span class="roz kotu">Acil</span>' : "") + (i.fiyat ? '<span class="roz">' + U.tl(i.fiyat) + "</span>" : "") + "</div>" +
          (k.id !== "teslim" ? '<button type="button" class="ilerlet" title="Sonraki aşama" data-ilerlet="' + i.no + '">→</button>' : '<span class="roz iyi">✓</span>') + "</div></div>";
      }).join("") + "</div>";
    }).join("");
    kpi(); rozetler();
  }
  var surNo = null;
  $("#pano").addEventListener("dragstart", function (e) { var c = e.target.closest(".ik-kart"); if (!c) return; surNo = c.dataset.no; c.classList.add("surukle"); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", surNo); } catch (x) {} });
  $("#pano").addEventListener("dragend", function () { $$(".ik-kart.surukle").forEach(function (c) { c.classList.remove("surukle"); }); $$(".kol.ust").forEach(function (k) { k.classList.remove("ust"); }); });
  $("#pano").addEventListener("dragover", function (e) { var k = e.target.closest(".kol"); if (!k) return; e.preventDefault(); $$(".kol.ust").forEach(function (x) { if (x !== k) x.classList.remove("ust"); }); k.classList.add("ust"); });
  $("#pano").addEventListener("drop", function (e) { var k = e.target.closest(".kol"); if (!k || !surNo) return; e.preventDefault(); tasi(surNo, k.dataset.k); surNo = null; });
  $("#pano").addEventListener("click", function (e) {
    var b = e.target.closest("[data-ilerlet]");
    if (b) { e.stopPropagation(); var i = bul(b.dataset.ilerlet), s = ABS.kolonlar.map(function (k) { return k.id; }); tasi(i.no, s[s.indexOf(i.kol) + 1]); return; }
    var c = e.target.closest(".ik-kart"); if (c) cekmeceAc(c.dataset.no);
  });
  function bul(no) { return ISLER.find(function (i) { return i.no === no; }); }
  function doldur(t, i) {
    return t.replace(/\{ad\}/g, i.ad.split(" ")[0]).replace(/\{no\}/g, i.no).replace(/\{cihaz\}/g, i.cihaz).replace(/\{saat\}/g, "yarın 09:00–12:00")
      .replace(/\{tutar\}/g, U.tl(i.fiyat || 1600)).replace(/\{link\}/g, /yorum/.test(t) ? "g.page/bb-bilgisayar/yorum" : "antalyabilgisayarservisi.com/takip/" + i.no.slice(4));
  }
  function tasi(no, kol) {
    var i = bul(no); if (!i || !kol || i.kol === kol) return;
    var eski = i.kol; i.kol = kol;
    if (kol === "onay" && !i.fiyat) i.fiyat = U.yuvarla(900 + Math.random() * 3000, 50);
    if ((kol === "teshis" || kol === "onarim") && !i.tek) i.tek = i.tur === "oyun" ? "hakan" : "burak";
    if (kol === "alim" && !i.tek) i.tek = (ABS.mahalleler.find(function (m) { return m.ad === i.mah; }) || { x: 0 }).x < 470 ? "emre" : "okan";
    var sk = SABK[kol], sb = sk && SAB.find(function (s) { return s.id === sk; }), ad = ABS.kolonlar.find(function (k) { return k.id === kol; }).ad;
    if (sb && sb.acik) { GON.unshift({ s: U.saat(), no: no, sab: sb.ad, dur: "Gönderildi", yeni: true }); U.tost("<b>" + no + "</b> → " + ad + " · WhatsApp gönderildi: " + sb.ad); }
    else U.tost("<b>" + no + "</b> → " + ad);
    panoCiz(); gonderimCiz();
    if ($("#cekmece").dataset.no === no) cekmeceAc(no);
  }
  $("#yeni-is").onclick = function () {
    var n = "ABS-" + (24133 + ISLER.filter(function (i) { return i.yeniKayit; }).length);
    ISLER.unshift({ no: n, ad: "Web kaydı · Ayşe T.", cihaz: "HP Victus 16", tur: "oyun", belirti: "Ekran kırık / çizgili", mah: "Konyaaltı · Hurma", kol: "yeni", tek: "", saat: 0, yeniKayit: true });
    FIL.kim = "hepsi"; panoCiz(); U.tost("Yeni kayıt <b>" + n + "</b> siteden düştü (demo)");
    var c = $('.ik-kart[data-no="' + n + '"]'); if (c) { c.style.borderColor = "var(--kor)"; c.style.boxShadow = "0 0 0 4px rgba(255,122,46,.2)"; }
  };

  /* çekmece */
  function cekmeceAc(no) {
    var i = bul(no), s = ABS.kolonlar.map(function (k) { return k.id; }), ix = s.indexOf(i.kol), ck = $("#cekmece");
    var sk = SABK[i.kol] || (i.kol === "yeni" ? "kayit" : null), sb = sk && SAB.find(function (x) { return x.id === sk; });
    ck.dataset.no = no;
    ck.innerHTML = '<button class="kapat" type="button" aria-label="Kapat">×</button><div class="mono soluk">' + i.no + " · " + ABS.kolonlar[ix].ad + "</div><h3>" + U.esc(i.cihaz) + '</h3><div class="asama">' + s.map(function (x, j) { return '<i class="' + (j <= ix ? "ok" : "") + '"></i>'; }).join("") + "</div>" +
      '<dl class="cek-grid"><dt>Müşteri</dt><dd>' + U.esc(i.ad) + "</dd><dt>Belirti</dt><dd>" + U.esc(i.belirti) + "</dd><dt>Mahalle</dt><dd>" + i.mah + "</dd><dt>Süre</dt><dd>" + sla(i.saat) + "</dd><dt>Tutar</dt><dd>" + (i.fiyat ? U.tl(i.fiyat) + " (örnek)" : "teşhis sonrası") + "</dd></dl>" +
      '<div class="cek-blok"><h5>Atanan kişi</h5><div class="alan"><select id="c-tek"><option value="">Atanmadı</option>' + ABS.ekip.map(function (e) { return '<option value="' + e.id + '"' + (i.tek === e.id ? " selected" : "") + ">" + e.ad + " · " + e.rol + "</option>"; }).join("") + "</select></div></div>" +
      '<div class="cek-blok"><h5>Parça kullan (stoktan düşer)</h5><div style="display:flex;gap:8px"><div class="alan" style="flex:1"><select id="c-parca">' + STOK.map(function (p) { return '<option value="' + p.kod + '"' + (p.adet ? "" : " disabled") + ">" + p.ad + " · " + p.adet + " adet</option>"; }).join("") + '</select></div><button class="dg cizgi kucuk" id="c-kullan" type="button">Kullan</button></div><div id="c-kullanilan" class="soluk" style="font-size:13px;margin-top:8px">' + (i.parcalar ? "Kullanılan: " + i.parcalar.join(", ") : "") + "</div></div>" +
      (sb ? '<div class="cek-blok"><h5>Bu aşamanın WhatsApp mesajı · ' + sb.ad + '</h5><div class="wa-onizle">' + U.esc(doldur(sb.metin, i)) + "</div></div>" : "") +
      '<div class="cek-blok" style="display:flex;gap:10px;flex-wrap:wrap">' + (ix < s.length - 1 ? '<button class="dg" id="c-ileri" type="button">' + ABS.kolonlar[ix + 1].ad + " aşamasına al →</button>" : '<span class="roz iyi">Teslim edildi</span>') + "</div>";
    document.body.classList.add("cek-ac");
    $(".kapat", ck).onclick = kapat;
    $("#c-tek").onchange = function () { i.tek = this.value; panoCiz(); U.tost(i.no + " · atama güncellendi"); };
    $("#c-kullan").onclick = function () { var p = STOK.find(function (x) { return x.kod === $("#c-parca").value; }); if (!p || !p.adet) return; p.adet--; (i.parcalar = i.parcalar || []).push(p.kod); stokCiz(); rozetler(); kpi(); cekmeceAc(no); U.tost(p.ad + " stoktan düştü · kalan <b>" + p.adet + "</b>"); };
    var il = $("#c-ileri"); if (il) il.onclick = function () { tasi(no, s[ix + 1]); };
  }
  function kapat() { document.body.classList.remove("cek-ac"); $("#cekmece").dataset.no = ""; }
  $("#cek-ort").onclick = kapat; addEventListener("keydown", function (e) { if (e.key === "Escape") kapat(); });

  /* ---------- 2. Kurye rotası ---------- */
  var OLC = 0.058, ROTA = { kim: "hepsi", opt: false, ilk: null };
  function duraklar() {
    return ISLER.filter(function (i) { return i.kol === "alim" || i.kol === "hazir" || i.kol === "yeni"; }).map(function (i) {
      var m = ABS.mahalleler.find(function (x) { return i.mah.indexOf(x.ad) >= 0; }) || ABS.mahalleler[1];
      return { no: i.no, ad: i.ad, mah: m.ad, x: m.x, y: m.y, tip: i.kol === "hazir" ? "Teslim" : "Alım", k: m.x < 470 ? "emre" : "okan" };
    });
  }
  function uz(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function tur(l) { var a = ABS.atolye, t = 0, p = a; l.forEach(function (d) { t += uz(p, d); p = d; }); return t + uz(p, a); }
  function enYakin(l) {
    var kalan = l.slice(), p = ABS.atolye, out = [];
    while (kalan.length) { kalan.sort(function (a, b) { return uz(p, a) - uz(p, b); }); p = kalan.shift(); out.push(p); }
    for (var it = 0, iy = true; iy && it < 30; it++) { iy = false; // 2-opt
      for (var i = 0; i < out.length - 1; i++) for (var j = i + 1; j < out.length; j++) { var c = out.slice(0, i).concat(out.slice(i, j + 1).reverse(), out.slice(j + 1)); if (tur(c) + .01 < tur(out)) { out = c; iy = true; } } }
    return out;
  }
  var RH = null;
  function rotaCiz() {
    if (!RH) RH = ABSHarita($("#rota-harita"), { id: "rota" });
    var D = duraklar(), hatlar = { emre: D.filter(function (d) { return d.k === "emre"; }), okan: D.filter(function (d) { return d.k === "okan"; }) };
    if (!ROTA.ilk) ROTA.ilk = { emre: tur(hatlar.emre), okan: tur(hatlar.okan) };
    if (ROTA.opt) { hatlar.emre = enYakin(hatlar.emre); hatlar.okan = enYakin(hatlar.okan); }
    $$("#kurye-sec button").forEach(function (b) { b.classList.toggle("sec", b.dataset.k === ROTA.kim); });
    var u = RH.ust; u.innerHTML = ""; RH.soluk(null);
    var html = "", topIlk = 0, topSimdi = 0;
    ["emre", "okan"].forEach(function (k) {
      var e = EKIP[k], l = hatlar[k], goster = ROTA.kim === "hepsi" || ROTA.kim === k; topIlk += ROTA.ilk[k]; topSimdi += tur(l);
      if (goster && l.length) {
        var a = ABS.atolye, d = "M" + a.x + "," + a.y + l.map(function (p) { return " L" + p.x + "," + p.y; }).join("") + " L" + a.x + "," + a.y;
        var p = RH.el("path", { d: d, fill: "none", stroke: e.renk, "stroke-width": 3.5, "stroke-linejoin": "round", "stroke-linecap": "round", opacity: .95 }, u);
        var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect(); p.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)"; p.style.strokeDashoffset = 0;
        l.forEach(function (s, j) { var g = RH.el("g", { transform: "translate(" + s.x + "," + s.y + ")" }, u); RH.el("circle", { r: 12, fill: e.renk, stroke: "#fff", "stroke-width": 2.5 }, g); var t = RH.el("text", { y: 4.5, "text-anchor": "middle", fill: "#fff", "font-family": "Geist Mono", "font-size": 12, "font-weight": 700 }, g); t.textContent = j + 1; });
        var v = RH.el("g", {}, u); RH.el("circle", { r: 8, fill: "#fff" }, v); RH.el("circle", { r: 4.5, fill: e.renk }, v); RH.el("animateMotion", { dur: (l.length * 2.4) + "s", repeatCount: "indefinite", path: d }, v);
      }
      var dk = 9 * 60 + 30;
      html += '<div class="kurye-bas" style="' + (goster ? "" : "opacity:.35") + '">' + av(k) + "<div><b>" + e.ad + "</b><small>" + e.rol + " · " + l.length + " durak · ≈" + Math.round(tur(l) * OLC) + " km</small></div></div>" +
        (goster ? l.map(function (s, j) { var once = j ? l[j - 1] : ABS.atolye; dk += Math.round(uz(once, s) * OLC * 2) + 8; var sa = Math.floor(dk / 60), dd = dk % 60;
          return '<div class="durak" style="animation-delay:' + j * .05 + 's"><span class="sira" style="background:' + e.renk + '">' + (j + 1) + "</span><div><b>" + s.mah + "</b> · " + s.tip + "<small>" + s.no + " · " + U.esc(s.ad) + "</small></div><time>~" + ("0" + sa).slice(-2) + ":" + ("0" + dd).slice(-2) + "</time></div>"; }).join("") : "");
    });
    $("#durak-l").innerHTML = '<div class="mono soluk" style="margin-bottom:6px">Bugünkü duraklar · tahmini saatler</div>' + html + '<p class="soluk" style="font-size:12px;margin-top:12px">Mesafeler şematik haritadan yaklaşık hesaplanır; gerçek kurulumda harita servisiyle ölçülür.</p>';
    $("#olcum").innerHTML = ROTA.opt ? '<small class="mono" style="color:var(--mavi3)">Optimize edildi</small><b>≈' + Math.round(topSimdi * OLC) + " km</b>önceki ≈" + Math.round(topIlk * OLC) + " km · " + Math.round((1 - topSimdi / topIlk) * 100) + "% daha kısa" : '<small class="mono" style="color:var(--mavi3)">Kayıt sırasıyla</small><b>≈' + Math.round(topIlk * OLC) + " km</b>toplam şematik mesafe";
  }
  $("#kurye-sec").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; ROTA.kim = b.dataset.k; rotaCiz(); });
  $("#optimize").onclick = function () { ROTA.opt = !ROTA.opt; this.textContent = ROTA.opt ? "Kayıt sırasına dön" : "Rotayı optimize et"; rotaCiz(); };

  /* ---------- 3. Stok ---------- */
  var SF = "Tümü", SIP = { "FAN-HP250": 3 };
  var kats = ["Tümü"].concat(STOK.map(function (s) { return s.kat; }).filter(function (k, i, a) { return a.indexOf(k) === i; }));
  $("#stok-filtre").innerHTML = kats.map(function (k) { return '<button type="button" class="yonga" data-k="' + k + '">' + k + "</button>"; }).join("");
  $("#stok-filtre").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; SF = b.dataset.k; stokCiz(); });
  function durumS(s) { return s.adet === 0 ? ["kotu", "Tükendi"] : s.adet < s.min ? ["kotu", "Kritik"] : s.adet === s.min ? ["uyar", "Sınırda"] : ["iyi", "Yeterli"]; }
  function stokCiz() {
    $$("#stok-filtre .yonga").forEach(function (b) { b.classList.toggle("sec", b.dataset.k === SF); });
    $("#stok-t").innerHTML = STOK.filter(function (s) { return SF === "Tümü" || s.kat === SF; }).map(function (s) {
      var olc = Math.max(s.min * 2.5, s.adet, 1), d = durumS(s);
      return '<tr><td><b style="font-weight:600">' + U.esc(s.ad) + '</b><div class="kod">' + s.kod + " · " + s.kat + '</div></td><td class="soluk" style="font-size:13px">' + U.esc(s.uyum) + '</td><td><div class="seviye"><div class="c"><i style="width:' + (s.adet / olc * 100) + "%;background:" + (d[0] === "kotu" ? "var(--kotu)" : d[0] === "uyar" ? "var(--uyar)" : "var(--mavi)") + '"></i><em style="left:' + (s.min / olc * 100) + '%" title="Minimum ' + s.min + '"></em></div><b>' + s.adet + '</b></div></td><td><span class="roz ' + d[0] + '"><span class="n"></span>' + d[1] + '</span></td><td><span class="adet-dg"><button type="button" data-a="-" data-k="' + s.kod + '" aria-label="Azalt">−</button><button type="button" data-a="+" data-k="' + s.kod + '" aria-label="Artır">+</button></span></td><td><button type="button" class="dg cizgi kucuk" data-sip="' + s.kod + '">Siparişe ekle</button></td></tr>';
    }).join("");
    var l = Object.keys(SIP);
    $("#siparis-l").innerHTML = l.length ? l.map(function (k) { var s = STOK.find(function (x) { return x.kod === k; }); return "<li><span>" + SIP[k] + "× " + U.esc(s.ad) + '</span><button type="button" data-sil="' + k + '" style="border:0;background:none;color:var(--kotu);font-weight:700">×</button></li>'; }).join("") : '<li class="soluk">Henüz parça eklenmedi.</li>';
    $("#siparis-wa").innerHTML = l.length ? '<div class="wa-onizle">Merhaba, BB Bilgisayar sipariş listesi:<br>' + l.map(function (k) { var s = STOK.find(function (x) { return x.kod === k; }); return "• " + SIP[k] + "× " + U.esc(s.ad) + " (" + k + ")"; }).join("<br>") + '<br>Teslim: atölye. Teşekkürler.</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="dg kucuk" type="button" id="sip-kopya">Taslağı kopyala</button><button class="dg cizgi kucuk" type="button" id="sip-krit">Kritikleri ekle</button></div>' : '<button class="dg cizgi kucuk" type="button" id="sip-krit">Kritikleri ekle</button>';
    var kp = $("#sip-kopya"); if (kp) kp.onclick = function () { var t = $("#siparis-wa .wa-onizle").innerText; try { navigator.clipboard.writeText(t); } catch (x) {} U.tost("Sipariş taslağı kopyalandı · tedarikçiye gönderim onayınızla"); };
    $("#sip-krit").onclick = function () { STOK.forEach(function (s) { if (s.adet < s.min) SIP[s.kod] = Math.max(1, s.min * 2 - s.adet); }); stokCiz(); };
  }
  $("#v-stok").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.a) { var s = STOK.find(function (x) { return x.kod === b.dataset.k; }); s.adet = Math.max(0, s.adet + (b.dataset.a === "+" ? 1 : -1)); stokCiz(); rozetler(); kpi(); }
    if (b.dataset.sip) { var p = STOK.find(function (x) { return x.kod === b.dataset.sip; }); SIP[p.kod] = (SIP[p.kod] || 0) + Math.max(1, p.min * 2 - p.adet); stokCiz(); U.tost(p.ad + " sipariş taslağına eklendi"); }
    if (b.dataset.sil) { delete SIP[b.dataset.sil]; stokCiz(); }
  });

  /* ---------- 4. Bildirimler ---------- */
  var SEC = "teshis", btel = U.waTelefon($("#bil-tel"), { alt: "Müşterinin gördüğü sıra" }), ORN = { ad: "Selin K.", no: "ABS-24117", cihaz: "Lenovo IdeaPad 3", fiyat: 1600 };
  function sablonCiz() {
    $("#sablon-l").innerHTML = SAB.map(function (s) { return '<div class="sablon' + (s.id === SEC ? " sec" : "") + '" data-s="' + s.id + '"><div><b>' + s.ad + "</b><small>" + U.esc(s.metin) + '</small></div><button type="button" class="anah' + (s.acik ? " acik" : "") + '" data-anah="' + s.id + '" aria-label="' + s.ad + ' aç/kapa"></button></div>'; }).join("");
    var s = SAB.find(function (x) { return x.id === SEC; }); if (document.activeElement !== $("#sablon-metin")) $("#sablon-metin").value = s.metin;
    btel.temizle(); SAB.forEach(function (x) { if (!x.acik) return; var m = btel.ekle(U.esc(doldur(x.metin, ORN))); if (x.id === SEC) m.style.boxShadow = "0 0 0 2px #246AF4"; });
  }
  $("#degisken").innerHTML = ["{ad}", "{no}", "{cihaz}", "{saat}", "{tutar}", "{link}"].map(function (v) { return '<button type="button">' + v + "</button>"; }).join("");
  $("#degisken").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var t = $("#sablon-metin"), p = t.selectionStart || t.value.length; t.value = t.value.slice(0, p) + b.textContent + t.value.slice(p); t.dispatchEvent(new Event("input")); t.focus(); });
  $("#sablon-l").addEventListener("click", function (e) {
    var a = e.target.closest("[data-anah]"); if (a) { var s = SAB.find(function (x) { return x.id === a.dataset.anah; }); s.acik = !s.acik; U.tost(s.ad + (s.acik ? " açıldı" : " kapatıldı")); sablonCiz(); return; }
    var r = e.target.closest(".sablon"); if (r) { SEC = r.dataset.s; sablonCiz(); }
  });
  $("#sablon-metin").addEventListener("input", function () { SAB.find(function (x) { return x.id === SEC; }).metin = this.value; sablonCiz(); });
  function gonderimCiz() {
    $("#gonderim").innerHTML = GON.slice(0, 8).map(function (g) { return "<tr" + (g.yeni ? ' style="background:#F0F5FF"' : "") + '><td class="kod">' + g.s + '</td><td class="kod">' + g.no + "</td><td>" + g.sab + '</td><td><span class="roz ' + (g.dur === "Okundu" ? "iyi" : "mavi") + '">' + g.dur + "</span></td></tr>"; }).join("");
  }

  /* ---------- 5. Rapor (ÖRNEK SENARYO) ---------- */
  var ip = $("#ipucu");
  function ipGoster(e, h) { ip.innerHTML = h; ip.style.opacity = 1; var x = Math.min(innerWidth - ip.offsetWidth - 10, e.clientX + 14); ip.style.left = x + "px"; ip.style.top = (e.clientY - ip.offsetHeight - 12) + "px"; }
  function ipGizle() { ip.style.opacity = 0; }
  var raporBitti = false, TABLO = {};
  $("#v-rapor").addEventListener("pointermove", function (e) { var t = e.target.closest("[data-ip]"); if (t) ipGoster(e, t.dataset.ip); else if (!e.target.closest("#g2 rect")) ipGizle(); });
  $("#v-rapor").addEventListener("pointerleave", ipGizle);
  function raporCiz() {
    var R = ABS.rapor, top = R.haftalik.reduce(function (a, x) { return a + x[1]; }, 0), son = R.sure[R.sure.length - 1][1];
    $("#rapor-kpi").innerHTML = [["Toplam iş emri", top, "Eylül · 4 hafta", "rgba(36,106,244,.1)"], ["Ort. onarım süresi", String(son).replace(".", ",") + " g", "Mart'ta " + String(R.sure[0][1]).replace(".", ",") + " g", "rgba(14,165,164,.12)"],
      ["Fiyat onay oranı", "%" + Math.round(R.onay.onaylanan / R.onay.gonderilen * 100), R.onay.onaylanan + " / " + R.onay.gonderilen + " teklif", "rgba(20,168,107,.1)"], ["En çok talep", R.bolge[0][0].split(" ·")[0], R.bolge[0][1] + " kayıt", "rgba(240,138,36,.12)"]]
      .map(function (k) { return '<div class="yuz" style="--r:' + k[3] + '"><small>' + k[0] + '</small><b style="' + (String(k[1]).length > 7 ? "font-size:30px" : "") + '">' + k[1] + "</b><span>" + k[2] + "</span></div>"; }).join("");
    if (raporBitti) return; raporBitti = true; TABLO = {}; $$("[data-tablo]").forEach(function (b) { b.textContent = "Tablo"; });
    // g1: dikey çubuk
    var W = 520, H = 230, P = { l: 34, r: 8, t: 22, b: 30 }, mx = 60, bw = 56, n = R.haftalik.length, adim = (W - P.l - P.r) / n;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Haftalık iş emri çubuk grafiği"><g class="izgara">';
    [0, 20, 40, 60].forEach(function (v) { var y = P.t + (H - P.t - P.b) * (1 - v / mx); s += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + y + '" y2="' + y + '"/><g class="eks"><text x="' + (P.l - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + v + "</text></g>"; });
    s += "</g>";
    R.haftalik.forEach(function (h, i) { var x = P.l + adim * i + (adim - bw) / 2, hh = (H - P.t - P.b) * h[1] / mx, y = H - P.b - hh;
      s += '<path class="cub" data-ip="<b>' + h[1] + ' iş emri</b>' + h[0] + '" d="M' + x + "," + (H - P.b) + " V" + (y + 4) + " Q" + x + "," + y + " " + (x + 4) + "," + y + " H" + (x + bw - 4) + " Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + 4) + " V" + (H - P.b) + 'Z"/>' +
        '<text class="deger" x="' + (x + bw / 2) + '" y="' + (y - 7) + '" text-anchor="middle">' + h[1] + '</text><g class="eks"><text x="' + (x + bw / 2) + '" y="' + (H - 10) + '" text-anchor="middle">' + h[0] + "</text></g>"; });
    $("#g1").innerHTML = s + "</svg>";
    // g2: çizgi + alan + artı imleç
    var W2 = 520, H2 = 230, Q = { l: 34, r: 14, t: 20, b: 30 }, ymx = 5, m = R.sure.length, ax = (W2 - Q.l - Q.r) / (m - 1);
    function X(i) { return Q.l + ax * i; } function Y(v) { return Q.t + (H2 - Q.t - Q.b) * (1 - v / ymx); }
    var s2 = '<svg viewBox="0 0 ' + W2 + " " + H2 + '" role="img" aria-label="Ortalama onarım süresi çizgi grafiği"><defs><linearGradient id="ralan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#246AF4" stop-opacity=".22"/><stop offset="1" stop-color="#246AF4" stop-opacity="0"/></linearGradient></defs><g class="izgara">';
    [0, 1, 2, 3, 4, 5].forEach(function (v) { s2 += '<line x1="' + Q.l + '" x2="' + (W2 - Q.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/><g class="eks"><text x="' + (Q.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + v + "</text></g>"; });
    s2 += "</g>"; var dl = R.sure.map(function (p, i) { return (i ? "L" : "M") + X(i) + "," + Y(p[1]); }).join(" ");
    s2 += '<path class="alan" d="' + dl + " L" + X(m - 1) + "," + Y(0) + " L" + X(0) + "," + Y(0) + 'Z"/><path class="cizgi" d="' + dl + '"/><line id="g2-cizgi" y1="' + Q.t + '" y2="' + Y(0) + '" stroke="#0E1230" stroke-opacity=".25" stroke-dasharray="3 3" style="display:none"/>';
    R.sure.forEach(function (p, i) { s2 += '<circle class="nokta" cx="' + X(i) + '" cy="' + Y(p[1]) + '" r="4.5"/><g class="eks"><text x="' + X(i) + '" y="' + (H2 - 10) + '" text-anchor="middle">' + p[0] + "</text></g>"; });
    s2 += '<text class="deger" x="' + X(m - 1) + '" y="' + (Y(son) - 12) + '" text-anchor="end">' + String(son).replace(".", ",") + " gün</text>";
    R.sure.forEach(function (p, i) { s2 += '<rect data-i="' + i + '" x="' + (X(i) - ax / 2) + '" y="' + Q.t + '" width="' + ax + '" height="' + (H2 - Q.t - Q.b) + '" fill="transparent"/>'; });
    $("#g2").innerHTML = s2 + "</svg>";
    $$("#g2 rect[data-i]").forEach(function (r) {
      r.addEventListener("pointermove", function (e) { var i = +r.dataset.i, c = $("#g2-cizgi"); c.style.display = ""; c.setAttribute("x1", X(i)); c.setAttribute("x2", X(i)); ipGoster(e, "<b>" + String(R.sure[i][1]).replace(".", ",") + " gün</b>" + R.sure[i][0] + " 2026 · örnek"); });
      r.addEventListener("pointerleave", function () { $("#g2-cizgi").style.display = "none"; ipGizle(); });
    });
    // g3 / g4: yatay çubuk
    function yatay(id, veri, birim) {
      var mx = Math.max.apply(null, veri.map(function (v) { return v[1]; }));
      $(id).innerHTML = '<div class="hrz">' + veri.map(function (v) { return '<div class="s" data-ip="<b>' + v[1] + " " + birim + "</b>" + v[0] + '"><span>' + v[0] + '</span><div class="c"><i style="width:0" data-w="' + (v[1] / mx * 100) + '%"></i></div><b>' + v[1] + "</b></div>"; }).join("") + "</div>";
      setTimeout(function () { $$(id + " .c i").forEach(function (i) { i.style.width = i.dataset.w; }); }, 80);
    }
    yatay("#g3", R.tur, "iş emri"); yatay("#g4", R.bolge, "kayıt");
    var VERI = { g1: [["Hafta", "İş emri"]].concat(R.haftalik), g2: [["Ay", "Gün"]].concat(R.sure), g3: [["Cihaz", "İş emri"]].concat(R.tur), g4: [["Bölge", "Kayıt"]].concat(R.bolge) };
    $$("[data-tablo]").forEach(function (b) { b.onclick = function () { var id = b.dataset.tablo, k = $("#" + id);
      if (!TABLO[id]) { TABLO[id] = k.innerHTML; k.innerHTML = "<table><tr><th>" + VERI[id][0][0] + "</th><th>" + VERI[id][0][1] + "</th></tr>" + VERI[id].slice(1).map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + String(r[1]).replace(".", ",") + "</td></tr>"; }).join("") + "</table>"; b.textContent = "Grafik"; }
      else { raporBitti = false; raporCiz(); } }; });
  }

  panoCiz(); stokCiz(); sablonCiz(); gonderimCiz(); gorunum(); U.gorunme();
})();
