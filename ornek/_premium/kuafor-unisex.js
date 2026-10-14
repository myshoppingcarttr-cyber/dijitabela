// Kadın-erkek (unisex) kuaför premium modülü (14 Eki 2026): Kadın / Erkek sekmesi ·
// Kadın: saç tipi + boy → öneri, işlem seçici (kesim, boya/balyaj, keratin, fön, bakım, topuz) → süre, sıra, ayrı gün uyarıları, tazeleme takvimi (.ics) ·
// Erkek: yüz şekline göre model (berber.js mantığı) · Online randevu · Dijital sadakat kartı. Fiyat tutarı yok.
(function () {
  var E = window.ESNAF;
  // ---------- KADIN ----------
  var TIP = {
    ince: ["İnce / düz", "Küt ya da hafif katlı kesim hacim verir. Ağır keratin saçı yassılaştırabilir; hafif formül seçilir. Açıcı işlemlerde bağ güçlendirici bakım önerilir.", ["bob", "bakim", "balyaj"]],
    kalin: ["Kalın / dalgalı", "Katlı kesim ağırlığı alır; keratin kabarmayı kontrol eder. Uzun saçta fön süresi uzar.", ["katli", "keratin", "fon"]],
    kivircik: ["Kıvırcık", "Katlı kesim bukleyi korur. Keratin bukleyi açar; bukle kalsın istiyorsanız nem bakımı ve maşa ile şekillendirme seçin.", ["katli", "bakim", "fon"]],
    yipranmis: ["Boyalı / yıpranmış", "Önce bakım ve uç kesimi. Açıcı işlem (balyaj) öncesi test tutamı yapılır; uzman uygun görmezse renk 2-4 hafta ertelenir.", ["bakim", "katli"]]
  };
  var BOY = { kisa: ["Kısa", 0.8], orta: ["Omuz hizası", 1], uzun: ["Uzun", 1.3] };
  // [id, ad, kısa açıklama, dk, sıra, grup, foto, tazeleme gün, tazeleme adı]
  var IS = [
    ["bob", "Küt / bob kesim", "Net hat, hacim", 45, 3, "kesim", "t_bob", 56, "Kesim / uç alma"],
    ["katli", "Katlı kesim", "Hafiflik, hareket", 60, 3, "kesim", "t_katli", 70, "Kesim / uç alma"],
    ["boya", "Dip boya", "Kök rengi eşitleme", 75, 1, "renk", "t_boya", 35, "Dip boya tazeleme"],
    ["balyaj", "Balyaj / ombre", "Açıcı ile geçişli renk", 180, 1, "acici", "t_balyaj", 84, "Balyaj tonlama"],
    ["keratin", "Keratin bakım", "Düzlük, kabarma kontrolü", 150, 4, "keratin", "t_keratin", 105, "Keratin yenileme"],
    ["bakim", "Saç bakımı / maske", "Nem ve onarım", 40, 2, "bakim", "t_bakim", 28, "Bakım"],
    ["fon", "Fön / maşa", "Düz fön ya da dalga", 35, 5, "fon", "t_fon"],
    ["topuz", "Topuz / özel gün", "Gelin, nişan, davet", 60, 6, "topuz", "t_topuz"]
  ];
  var BOYLA = { renk: 1, acici: 1, keratin: 1, fon: 1, bakim: 1, topuz: 1 }; // süresi saç boyuna göre değişen gruplar
  var bul = function (id) { return IS.filter(function (x) { return x[0] === id; })[0]; };
  function sureYaz(dk) { dk = Math.round(dk / 5) * 5; var s = Math.floor(dk / 60), d = dk % 60; return (s ? s + " sa " : "") + (d ? d + " dk" : "").trim(); }
  function kadin(k) {
    var q = function (s) { return E.q(k, s); }, sec = { boya: 1, katli: 1, keratin: 1 }, tip = "kalin", boy = "orta";
    q(".k-tip").innerHTML = Object.keys(TIP).map(function (t) { return '<button type="button" class="cip" data-t="' + t + '">' + TIP[t][0] + "</button>"; }).join("");
    q(".k-boy").innerHTML = Object.keys(BOY).map(function (b) { return '<button type="button" class="cip" data-b="' + b + '">' + BOY[b][0] + "</button>"; }).join("");
    q(".k-is").innerHTML = IS.map(function (x) { return '<button type="button" data-i="' + x[0] + '" aria-pressed="false"><img src="../img/' + x[6] + '.jpg" alt="' + x[1] + '" loading="lazy"><span>' + x[1] + "<small>" + x[2] + "</small></span></button>"; }).join("");
    function foto(x) { E.fotoDegis(q(".k-foto"), "../img/" + x[6] + ".jpg", x[1]); q(".k-alt").innerHTML = "<b>" + x[1] + "</b> · " + x[2]; }
    function hes() {
      k.querySelectorAll(".k-tip .cip").forEach(function (c) { c.classList.toggle("on", c.dataset.t === tip); });
      k.querySelectorAll(".k-boy .cip").forEach(function (c) { c.classList.toggle("on", c.dataset.b === boy); });
      k.querySelectorAll(".k-is button").forEach(function (b) { var on = !!sec[b.dataset.i]; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.classList.toggle("oneri", TIP[tip][2].indexOf(b.dataset.i) >= 0); });
      q(".k-oneri").innerHTML = "<b>" + TIP[tip][0] + " saç için öneri:</b> " + TIP[tip][1];
      var L = IS.filter(function (x) { return sec[x[0]]; }).sort(function (a, b) { return a[4] - b[4]; });
      if (!L.length) { q(".k-sonuc").innerHTML = '<span class="not" style="margin:0">Bir ya da birkaç işlem seçin.</span>'; k._plan = null; return; }
      var g = {}; L.forEach(function (x) { g[x[5]] = x; });
      var uyari = [], ayri = {}, dus = {};
      var renkVar = g.renk || g.acici;
      if (renkVar && g.keratin) { uyari.push(["acil", "Renk ve keratin aynı gün yapılmaz: önce renk, keratin en az 1-2 hafta sonra. Keratinden sonra boyatmak için de en az 2 hafta beklenir."]); ayri.keratin = 14; }
      if (g.keratin && g.topuz) { uyari.push(["acil", "Keratin sonrası 72 saat toka ve topuz yapılmaz. Topuzu keratinden önceki bir güne ya da en erken 3 gün sonraya alın."]); ayri.topuz = ayri.keratin ? ayri.keratin + 3 : 3; }
      if (g.keratin && g.fon && !ayri.keratin) { uyari.push(["plan", "Keratin düzleştirmeyle biter; ayrıca fön gerekmez."]); dus.fon = 1; }
      if (g.topuz && g.fon && !ayri.topuz) { uyari.push(["plan", "Topuz hazırlığında fön zaten yapılır; süre birleşti."]); dus.fon = 1; }
      if (g.renk && g.acici) uyari.push(["plan", "Dip boya ve balyaj aynı seansta yapılır; bekleme süreleri birleşir (yaklaşık 30 dk kazanç)."]);
      if (tip === "yipranmis" && g.acici) uyari.push(["bugun", "Yıpranmış saçta açıcı öncesi test tutamı yapılır; uzman uygun görmezse balyaj bakım sonrasına kalır."]);
      if (tip === "kivircik" && g.keratin) uyari.push(["bugun", "Keratin bukleleri açar. Bukleyi korumak istiyorsanız keratin yerine nem bakımı seçin."]);
      var f = BOY[boy][1];
      var dk = function (x) { return x[3] * (BOYLA[x[5]] ? f : 1); };
      var bugun = L.filter(function (x) { return !ayri[x[5]] && !dus[x[5]]; }), sonra = L.filter(function (x) { return ayri[x[5]]; });
      var top = bugun.reduce(function (s, x) { return s + dk(x); }, 0) - (g.renk && g.acici ? 30 : 0);
      var takvim = [], t0 = new Date(); t0.setHours(11, 0, 0, 0);
      sonra.forEach(function (x) { var d = new Date(t0); d.setDate(d.getDate() + ayri[x[5]]); takvim.push([d, x[1] + " (ayrı gün)", dk(x)]); });
      L.forEach(function (x) { if (x[7]) { var d = new Date(t0); d.setDate(d.getDate() + x[7] + (ayri[x[5]] || 0)); takvim.push([d, x[8], dk(x)]); } });
      takvim.sort(function (a, b) { return a[0] - b[0]; });
      var sira = bugun.map(function (x) { return x[1]; });
      q(".k-sonuc").innerHTML = '<div class="buyuk">' + sureYaz(top) + '</div><p style="margin-top:4px">Bugün, bu sırayla: <b>' + (sira.join(" → ") || "—") + "</b>" +
        (sonra.length ? "<br>Ayrı güne: <b>" + sonra.map(function (x) { return x[1] + " (" + sureYaz(dk(x)) + ")"; }).join(", ") + "</b>" : "") + "</p>" +
        uyari.map(function (u) { return '<p style="margin-top:8px"><span class="seviye ' + u[0] + '">' + ({ acil: "Aynı gün olmaz", plan: "Birleşir", bugun: "Dikkat" })[u[0]] + "</span> " + u[1] + "</p>"; }).join("") +
        (takvim.length ? '<label class="e">Sonraki adımlar</label><ul class="k-plan">' + takvim.slice(0, 5).map(function (t) { return "<li><b>" + E.tarih(t[0]) + "</b><span>" + t[1] + "</span></li>"; }).join("") + "</ul>" : "") +
        '<p class="not">Süreler ' + BOY[boy][0].toLocaleLowerCase("tr") + " saç için ortalamadır; saçınızı gören uzmanımız netleştirir. Ücret saçınız görüldükten sonra salonda belirlenir.</p>";
      k._plan = { L: L, takvim: takvim, sure: sureYaz(top), sira: sira, sonra: sonra };
    }
    k.querySelectorAll(".k-tip .cip").forEach(function (c) { c.onclick = function () { tip = c.dataset.t; hes(); }; });
    k.querySelectorAll(".k-boy .cip").forEach(function (c) { c.onclick = function () { boy = c.dataset.b; hes(); }; });
    k.querySelectorAll(".k-is button").forEach(function (b) {
      b.onclick = function () {
        var x = bul(b.dataset.i);
        if (sec[x[0]]) delete sec[x[0]]; else { if (x[5] === "kesim") IS.forEach(function (y) { if (y[5] === "kesim") delete sec[y[0]]; }); sec[x[0]] = 1; foto(x); }
        hes();
      };
    });
    foto(bul("katli")); hes();
    q(".k-rv").onclick = function () {
      var p = k._plan, alan = document.querySelector(".rv-plan"), hz = document.querySelector(".rv-hiz");
      if (p && alan) alan.value = p.L.map(function (x) { return x[1]; }).join(" + ") + " · " + TIP[tip][0] + ", " + BOY[boy][0].toLocaleLowerCase("tr");
      if (p && hz) { var ilk = p.L[0][5], ad = { renk: "Kadın · Dip boya", acici: "Kadın · Balyaj / ombre", keratin: "Kadın · Keratin bakım", kesim: "Kadın · Kesim + fön", bakim: "Kadın · Saç bakımı", fon: "Kadın · Fön / maşa", topuz: "Kadın · Topuz / özel gün" }[ilk]; if (ad) hz.value = ad; }
      var r = document.getElementById("randevu"); if (r) r.scrollIntoView({ behavior: "smooth" });
    };
    q(".k-ics").onclick = function () {
      var p = k._plan; if (!p || !p.takvim.length) { q(".k-sonuc").insertAdjacentHTML("beforeend", '<p class="not" style="color:#e03131">Seçtiğiniz işlemlerde tazeleme yok; kesim, boya, balyaj ya da keratin seçin.</p>'); return; }
      E.ics("sac-bakim-takvimi", p.takvim.slice(0, 8).map(function (t) { return { tarih: t[0], dk: Math.round(t[2]), baslik: t[1], aciklama: (window.ISL.ad || "") + " · randevu için siteyi açın" }; }));
    };
    q(".k-gonder").onclick = function () {
      var p = k._plan; if (!p) return;
      waAc("Merhaba, sitenizdeki saç planlayıcıdan:\nSaç tipi: " + TIP[tip][0] + " · " + BOY[boy][0] + "\nİşlemler: " + p.L.map(function (x) { return x[1]; }).join(", ") + "\nBugün: " + p.sira.join(" → ") + " (" + p.sure + ")" + (p.sonra.length ? "\nAyrı gün: " + p.sonra.map(function (x) { return x[1]; }).join(", ") : "") + "\nUygun gün ve ücret bilgisi alabilir miyim?");
    };
  }
  // ---------- ERKEK (berber.js model seçicisi) ----------
  var YUZ = { oval: ["Oval", "Dengeli oran; çoğu model yakışır."], yuvarlak: ["Yuvarlak", "Üstte yükseklik, yanlar kısa: yüz daha uzun görünür."], kare: ["Kare", "Güçlü çene hattı; kısa ve net kesimler öne çıkarır."], uzun: ["Uzun", "Kakül ve yan hacim yüzü dengeler."] };
  var ONERI = { oval: [["Textured crop", "Üstte doku, yanlar kısa.", "textured-crop"], ["Pompadour", "Hacimli üst, temiz yanlar.", "pompadour"], ["Klasik yan ayrım", "İş ve günlük için zamansız.", "yan-ayrim"]], yuvarlak: [["High fade + quiff", "Yüzü daha uzun gösterir.", "quiff"], ["Faux hawk", "Ortada yükseklik, yanlar sıfıra yakın.", "faux-hawk"], ["Kısa sakal + keskin hat", "Çene hattını belirginleştirir.", "kisa-sakal"]], kare: [["Buzz cut", "Güçlü çene hattını öne çıkarır.", "buzz"], ["Crew cut", "Sade, bakımı kolay.", "crew"], ["Undercut", "Üst uzun, yanlar kısa.", "undercut"]], uzun: [["Fringe / kakül", "Alnı kısaltır, yüzü dengeler.", "fringe"], ["Yanlar orta uzun", "Yüzü genişletir.", "orta-yan"], ["Doğal dalgalı üst", "Yükseklik vermeden hacim.", "dalgali"]] };
  function erkek(k) {
    var q = function (s) { return E.q(k, s); }, secModel = ONERI.oval[0];
    q(".m-yuz").innerHTML = Object.keys(YUZ).map(function (y) { return '<button type="button" class="cip" data-y="' + y + '">' + YUZ[y][0] + "</button>"; }).join("");
    function goster(m) { secModel = m; E.fotoDegis(q(".m-foto"), "../img/s_" + m[2] + ".jpg", m[0]); q(".m-alt").innerHTML = "<b>" + m[0] + "</b> · " + m[1]; k.querySelectorAll(".m-model button").forEach(function (b) { var on = b.dataset.m === m[2]; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); }); }
    function yuz(y) {
      k.querySelectorAll(".m-yuz .cip").forEach(function (c) { c.classList.toggle("on", c.dataset.y === y); });
      q(".m-ipucu").textContent = YUZ[y][1];
      q(".m-model").innerHTML = ONERI[y].map(function (m) { return '<button type="button" data-m="' + m[2] + '"><img src="../img/s_' + m[2] + '.jpg" alt="' + m[0] + '" loading="lazy"><span>' + m[0] + "</span></button>"; }).join("");
      k.querySelectorAll(".m-model button").forEach(function (b, i) { b.onclick = function () { goster(ONERI[y][i]); }; });
      goster(ONERI[y][0]);
    }
    k.querySelectorAll(".m-yuz .cip").forEach(function (c) { c.onclick = function () { yuz(c.dataset.y); }; }); yuz("oval");
    q(".m-sec").onclick = function () {
      var i = document.querySelector(".rv-plan"), hz = document.querySelector(".rv-hiz");
      if (i) i.value = secModel[0]; if (hz) hz.value = /sakal/i.test(secModel[0]) ? "Erkek · Saç + sakal" : "Erkek · Saç kesimi";
      var r = document.getElementById("randevu"); if (r) r.scrollIntoView({ behavior: "smooth" });
    };
  }
  // ---------- Sekme ----------
  function sekme(k) {
    var bt = k.querySelectorAll(".ku-sekme button");
    function ac(s) {
      bt.forEach(function (b) { var on = b.dataset.s === s; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
      k.querySelectorAll(".ku-panel").forEach(function (p) { p.hidden = p.dataset.p !== s; });
    }
    bt.forEach(function (b, i) {
      b.onclick = function () { ac(b.dataset.s); };
      b.onkeydown = function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var n = bt[(i + 1) % bt.length]; n.focus(); ac(n.dataset.s); e.preventDefault(); } };
    });
    ac(/erkek/i.test(location.hash) ? "erkek" : "kadin");
    window.addEventListener("hashchange", function () { if (/erkek|kadin/i.test(location.hash)) ac(/erkek/i.test(location.hash) ? "erkek" : "kadin"); });
  }
  // ---------- Sadakat kartı ----------
  function kart(k) {
    var q = function (s) { return E.q(k, s); }, n = 3;
    function ciz() {
      q(".sk-damga").innerHTML = [0, 1, 2, 3, 4, 5].map(function (i) { return '<span class="' + (i < n ? "ok" : "") + '">' + (i === 5 ? "🎁" : i < n ? "✂" : "") + "</span>"; }).join("");
      q(".sk-sonuc").innerHTML = '<div class="buyuk" style="font-size:1.3rem">' + (n >= 5 ? "Kart doldu · kampanyayı salona sorun" : (5 - n) + " ziyaret sonra kart dolar") + "</div>";
    }
    q(".sk-ekle").onclick = function () { n = n >= 5 ? 0 : n + 1; ciz(); }; ciz();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".kuafor").forEach(function (k) { sekme(k); k.querySelectorAll(".ku-kadin").forEach(kadin); k.querySelectorAll(".ku-erkek").forEach(erkek); });
    document.querySelectorAll(".kartim").forEach(kart);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Kadın · Kesim + fön", "Kadın · Dip boya", "Kadın · Balyaj / ombre", "Kadın · Keratin bakım", "Kadın · Fön / maşa", "Kadın · Topuz / özel gün", "Kadın · Saç bakımı", "Erkek · Saç kesimi", "Erkek · Saç + sakal", "Erkek · Sakal şekillendirme", "Erkek · Skin fade", "Çocuk kesimi"], [["Plan / model", ".rv-plan"]]); });
  });
})();
