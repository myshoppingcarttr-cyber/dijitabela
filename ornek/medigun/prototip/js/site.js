/* Medigün prototip · şube seçici, şube listesi, hekim bulucu, check-up */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = MG.esc;

  /* ---------- Menü (mobil) ---------- */
  var menuAc = document.querySelector(".menu-ac"), menu = $("ana-menu");
  if (menuAc && menu) {
    menuAc.addEventListener("click", function () {
      var acik = menu.classList.toggle("acik");
      menuAc.setAttribute("aria-expanded", acik ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("acik"); menuAc.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("acik")) { menu.classList.remove("acik"); menuAc.setAttribute("aria-expanded", "false"); menuAc.focus(); }
    });
  }

  /* ---------- Şube seçici ---------- */
  var secici = $("sube-secici");
  function seciciDoldur() {
    secici.innerHTML = MG.subeler.map(function (s) {
      return '<option value="' + s.kod + '"' + (s.kod === MG.secili ? " selected" : "") + ">" + esc(s.kisa) + "</option>";
    }).join("");
  }
  function subeUygula(kod, kaydir) {
    MG.subeKaydet(kod);
    var s = MG.subeBul(kod);
    secici.value = kod;
    $("k-sube-etiket").textContent = "Medigün · " + s.kisa;
    var foto = $("k-foto");
    foto.src = s.foto; foto.alt = s.fotoAlt;
    $("k-foto-alt").innerHTML = "<b>" + esc(s.ad) + "</b>" + esc(s.adres);
    subeListesi();
    hekimSube.value = kod;
    bransDoldur();
    hekimListele();
    document.dispatchEvent(new CustomEvent("mg:sube", { detail: kod }));
    if (kaydir) { $("subeler").scrollIntoView(); }
  }
  secici.addEventListener("change", function () { subeUygula(secici.value); });

  /* ---------- Şube listesi ---------- */
  function subeListesi() {
    $("sube-listesi").innerHTML = MG.subeler.map(function (s) {
      var sec = s.kod === MG.secili;
      return '<li class="sube' + (sec ? " secili" : "") + '">' +
        '<img src="' + s.foto + '" alt="' + esc(s.fotoAlt) + '" width="703" height="420" loading="lazy">' +
        "<div>" +
          '<span class="tur">' + esc(s.tur) + (s.acil ? ' · <b>Acil servis 24 saat</b>' : "") + "</span>" +
          "<h3>" + esc(s.ad) + (sec ? '<span class="rozet">Seçili</span>' : "") + "</h3>" +
          "<address>" + esc(s.adres) + "" + "</address>" +
          '<a href="tel:' + s.tel + '">' + esc(s.telGoster) + "</a>" +
          (s.eposta ? ' · <a href="mailto:' + s.eposta + '">' + esc(s.eposta) + "</a>" : "") +
          (s.verili ? "" : '<br><span class="not">Hekim kadrosu için çağrı merkezi: <a href="tel:' + MG.cagri.tel + '">' + MG.cagri.goster + '</a></span>') +
        "</div>" +
        '<div class="eylem">' +
          '<a class="dugme kucuk ikincil" href="' + s.harita + '" rel="noopener"><svg class="ikon" aria-hidden="true"><use href="#i-konum"/></svg>Yol tarifi</a>' +
          (sec ? "" : '<button type="button" class="dugme kucuk sade" data-sube="' + s.kod + '">Bu şubeyi seç</button>') +
        "</div></li>";
    }).join("");
  }
  $("sube-listesi").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-sube]");
    if (b) { subeUygula(b.getAttribute("data-sube")); var ilk = document.querySelector(".sube.secili a"); if (ilk) ilk.focus(); }
  });

  /* Altbilgi kurum listesi */
  var alt = $("alt-subeler");
  if (alt) alt.innerHTML = MG.subeler.map(function (s) {
    return "<li>" + esc(s.ad) + ' · <a href="tel:' + s.tel + '">' + esc(s.telGoster) + "</a></li>";
  }).join("");

  /* ---------- Hekim bulucu ---------- */
  var hekimAra = $("h-ara"), hekimSube = $("h-sube"), hekimBrans = $("h-brans");
  hekimSube.innerHTML = '<option value="">Tüm şubeler</option>' + MG.subeler.map(function (s) {
    return '<option value="' + s.kod + '">' + esc(s.kisa) + "</option>";
  }).join("");
  hekimSube.value = MG.secili;

  function subeBranslari(kod) {
    var set = {};
    var kodlar = kod ? [kod] : MG.subeler.map(function (s) { return s.kod; });
    kodlar.forEach(function (k) {
      (MG.subeBrans[k] || []).forEach(function (b) { set[b] = 1; });
      MG.hekimler.forEach(function (h) { if (h.sube === k) set[h.brans] = 1; });
    });
    return Object.keys(set).sort(function (a, b) { return MG.branslar[a].localeCompare(MG.branslar[b], "tr"); });
  }
  function bransDoldur() {
    var once = hekimBrans.value;
    var liste = subeBranslari(hekimSube.value);
    hekimBrans.innerHTML = '<option value="">Tüm branşlar</option>' + liste.map(function (b) {
      return '<option value="' + b + '">' + esc(MG.branslar[b]) + "</option>";
    }).join("");
    hekimBrans.value = liste.indexOf(once) > -1 ? once : "";
    $("brans-cipleri").innerHTML = liste.length ? liste.map(function (b) {
      return '<li><button type="button" class="cip" data-brans="' + b + '" aria-pressed="' + (hekimBrans.value === b) + '">' + esc(MG.branslar[b]) + "</button></li>";
    }).join("") : '<li class="not">Bölüm ve hekim bilgisi için çağrı merkezi: <a href="tel:' + MG.cagri.tel + '">' + MG.cagri.goster + '</a></li>';
  }
  function basHarf(ad) {
    var p = ad.replace(/^(Doç\.|Prof\.|Op\.|Uzm\.|Dr\.|Dyt\.|\s)+/g, "").replace(/(Uzm\.|Dr\.|Dyt\.|Op\.)\s*/g, "").trim().split(/\s+/);
    return (p[0] ? p[0][0] : "") + (p.length > 1 ? p[p.length - 1][0] : "");
  }
  function hekimListele() {
    var q = MG.sade(hekimAra.value), sk = hekimSube.value, bk = hekimBrans.value;
    var liste = MG.hekimler.filter(function (h) {
      if (sk && h.sube !== sk) return false;
      if (bk && h.brans !== bk) return false;
      if (q) {
        var metin = MG.sade(h.ad + " " + MG.branslar[h.brans] + " " + MG.subeBul(h.sube).kisa);
        return q.split(" ").every(function (k) { return metin.indexOf(k) > -1; });
      }
      return true;
    }).sort(function (a, b) {
      var ad = function (x) { return x.ad.replace(/^(Doç\.\s*|Op\.\s*|Uzm\.\s*|Dr\.\s*|Dyt\.\s*)+/g, ""); };
      return ad(a).localeCompare(ad(b), "tr");
    });
    var sube = sk ? MG.subeBul(sk) : null;
    $("h-sayi").textContent = liste.length + " hekim listeleniyor" + (sube ? " · " + sube.kisa : " · tüm şubeler") + (bk ? " · " + MG.branslar[bk] : "");
    if (!liste.length) {
      $("hekim-listesi").innerHTML = '<li class="bos">Bu ölçütlere uygun hekim kaydı yok. ' +
        (sube && !sube.verili ? "Bu kurumun hekim kadrosu için çağrı merkezini arayabilirsiniz. " : "") +
        'Çağrı merkezi: <a href="tel:' + MG.cagri.tel + '">' + MG.cagri.goster + "</a> ya da randevu asistanına yazın.</li>";
      return;
    }
    $("hekim-listesi").innerHTML = liste.map(function (h) {
      var s = MG.subeBul(h.sube);
      return '<li class="hekim">' +
        '<span class="bas" aria-hidden="true">' + esc(basHarf(h.ad)) + "</span>" +
        "<div><h3>" + esc(h.ad) + "</h3><p>" + esc(MG.branslar[h.brans]) + "</p><p>" + esc(s.ad) + "</p></div>" +
        '<div class="eylem">' +
          '<a class="dugme kucuk" href="#asistan" data-randevu="' + h.sube + "|" + h.brans + '">Randevu talebi</a>' +
          '<a class="dugme kucuk sade" href="' + h.kaynak + '" rel="noopener">Özgeçmiş<span class="gizli"> (' + esc(h.ad) + ", resmî site)</span></a>" +
        "</div></li>";
    }).join("");
  }
  var zaman;
  hekimAra.addEventListener("input", function () { clearTimeout(zaman); zaman = setTimeout(hekimListele, 120); });
  hekimSube.addEventListener("change", function () { bransDoldur(); hekimListele(); });
  hekimBrans.addEventListener("change", function () { bransDoldur(); hekimListele(); });
  $("brans-cipleri").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-brans]");
    if (!b) return;
    var k = b.getAttribute("data-brans");
    hekimBrans.value = hekimBrans.value === k ? "" : k;
    bransDoldur(); hekimListele();
    var yeni = document.querySelector('#brans-cipleri button[data-brans="' + k + '"]');
    if (yeni) yeni.focus();
  });
  $("hekim-listesi").addEventListener("click", function (e) {
    var a = e.target.closest("a[data-randevu]");
    if (!a) return;
    var p = a.getAttribute("data-randevu").split("|");
    document.dispatchEvent(new CustomEvent("mg:randevu", { detail: { sube: p[0], brans: p[1] } }));
  });

  /* ---------- Check-up (fiyatsız, örnek içerik) ---------- */
  var paketler = [
    { ad: "Genel check-up", kim: "Belirgin şikâyeti olmayan yetişkinler için temel değerlendirme.",
      tetkik: ["Tam kan sayımı (hemogram)", "Açlık kan şekeri ve HbA1c", "Böbrek ve karaciğer fonksiyon testleri", "Kolesterol paneli", "Tam idrar tahlili", "Tiroid fonksiyon testi (TSH)", "Akciğer grafisi", "EKG"],
      muayene: ["Dahiliye (iç hastalıkları) muayenesi", "Tansiyon, boy, kilo ve bel çevresi ölçümü"] },
    { ad: "Kadın sağlığı", kim: "Yaşa ve öyküye göre kadın sağlığı taramaları.",
      tetkik: ["Genel check-up tetkikleri", "Smear testi (hekim uygun görürse)", "Meme ultrasonografisi ya da mamografi (yaşa göre)", "Pelvik ultrasonografi", "Demir, B12 ve D vitamini düzeyi"],
      muayene: ["Kadın hastalıkları ve doğum muayenesi", "Dahiliye muayenesi"] },
    { ad: "Erkek sağlığı", kim: "Yaşa ve öyküye göre erkek sağlığı taramaları.",
      tetkik: ["Genel check-up tetkikleri", "PSA (yaşa göre, hekim uygun görürse)", "Üriner sistem ultrasonografisi", "Ürik asit"],
      muayene: ["Üroloji muayenesi", "Dahiliye muayenesi"] },
    { ad: "Kalp ve damar", kim: "Tansiyon, kolesterol, şeker ya da aile öyküsü olanlar için.",
      tetkik: ["Kolesterol paneli", "Açlık kan şekeri", "EKG", "Ekokardiyografi (hekim uygun görürse)", "Efor testi (hekim uygun görürse)"],
      muayene: ["Kardiyoloji muayenesi"] }
  ];
  var sekme = $("paket-sekme"), alan = $("paket-alan");
  function paketGoster(i, odak) {
    Array.prototype.forEach.call(sekme.children, function (b, j) {
      b.setAttribute("aria-selected", j === i ? "true" : "false");
      b.tabIndex = j === i ? 0 : -1;
    });
    var p = paketler[i];
    alan.setAttribute("aria-labelledby", "paket-" + i);
    alan.innerHTML = '<div class="paket"><div><h3>' + esc(p.ad) + ' <span class="ornek">Örnek içerik</span></h3><p>' + esc(p.kim) + "</p><h4>Muayeneler</h4><ul>" +
      p.muayene.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") +
      "</ul></div><div><h4>Tetkikler</h4><ul>" + p.tetkik.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") +
      '</ul><p class="not" style="margin-top:12px">Her tetkik herkes için gerekli değildir; hekiminiz değerlendirmesine göre ekleme ya da çıkarma yapabilir.</p>' +
      '<a class="dugme kucuk ikincil" href="#asistan" data-checkup="1">Bilgi almak istiyorum</a></div></div>';
    if (odak) sekme.children[i].focus();
  }
  sekme.innerHTML = paketler.map(function (p, i) {
    return '<button type="button" role="tab" id="paket-' + i + '" aria-controls="paket-alan">' + esc(p.ad) + "</button>";
  }).join("");
  sekme.addEventListener("click", function (e) {
    var b = e.target.closest("button[role=tab]"); if (!b) return;
    paketGoster(Array.prototype.indexOf.call(sekme.children, b));
  });
  sekme.addEventListener("keydown", function (e) {
    var i = Array.prototype.indexOf.call(sekme.children, document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowRight") { e.preventDefault(); paketGoster((i + 1) % paketler.length, true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); paketGoster((i - 1 + paketler.length) % paketler.length, true); }
  });
  alan.addEventListener("click", function (e) {
    if (e.target.closest("[data-checkup]")) document.dispatchEvent(new CustomEvent("mg:checkup"));
  });

  /* ---------- Başlat ---------- */
  seciciDoldur();
  paketGoster(0);
  subeUygula(MG.secili);
})();
