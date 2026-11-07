(function () {
  var K = window.KILER, E = K.esc, TL = K.tl, $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var SIRA = ["Yeni", "Hazırlanıyor", "Kargoda", "Teslim edildi"];
  var filtre = "Hepsi";
  function girisli() { try { return sessionStorage.getItem("kiler_panel") === "1"; } catch (e) { return true; } }
  function giris() {
    $("#kok").innerHTML = '<div class="giris-kutu"><span class="etiket">Kiler Toros · yönetim</span><h1 class="baslik" style="font-size:40px;margin:6px 0 14px">Panele giriş</h1>' +
      '<div class="alan" style="margin-bottom:10px"><label>Kullanıcı</label><input value="demo" readonly></div><div class="alan" style="margin-bottom:16px"><label>Şifre</label><input type="password" value="demo1234" readonly></div>' +
      '<button class="btn tam" id="gir" type="button">Demo olarak gir</button><p style="font-size:13px;color:var(--soluk);margin:12px 0 0">Gerçek panelde her personelin kendi kullanıcısı ve yetkisi olur (ör. depo yalnız siparişleri görür).</p></div>';
    $("#gir").onclick = function () { try { sessionStorage.setItem("kiler_panel", "1"); } catch (e) {} ciz(); };
  }
  function stokToplam(u) { return u.secenek.reduce(function (a, s) { return a + s[2]; }, 0); }
  function dusukStok() { var x = []; K.urunler().forEach(function (u) { u.secenek.forEach(function (s, i) { if (s[2] <= 5) x.push([u, i]); }); }); return x; }
  function iskelet(aktif, icerik) {
    var sp = K.siparisler(), yeni = sp.filter(function (s) { return s.durum === "Yeni"; }).length, ds = dusukStok().length;
    $("#kok").innerHTML = '<div class="pn"><nav class="yan"><a class="logo" href="../" style="text-decoration:none"><b>Kiler Toros</b><span>Yönetim paneli</span></a>' +
      '<a class="m ' + (aktif === "ozet" ? "ak" : "") + '" href="#ozet">Özet</a>' +
      '<a class="m ' + (aktif === "siparisler" ? "ak" : "") + '" href="#siparisler">Siparişler ' + (yeni ? "<i>" + yeni + "</i>" : "") + "</a>" +
      '<a class="m ' + (aktif === "urunler" ? "ak" : "") + '" href="#urunler">Ürünler ve stok ' + (ds ? "<i>" + ds + "</i>" : "") + "</a>" +
      '<a class="m ' + (aktif === "yeni" ? "ak" : "") + '" href="#yeni">Ürün ekle</a>' +
      '<div class="alt">Demo verisi.<br><a href="#" id="sifirla">Verileri sıfırla</a> · <a href="#" id="cik">Çıkış</a></div></nav><section class="ic">' + icerik + "</section></div>";
    $("#sifirla").onclick = function (e) { e.preventDefault(); if (confirm("Demo ürün, stok ve siparişleri başa alınsın mı?")) { K.sifirla(); ciz(); } };
    $("#cik").onclick = function (e) { e.preventDefault(); try { sessionStorage.removeItem("kiler_panel"); } catch (x) {} ciz(); };
  }
  function tarih(t) { return new Date(t).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
  function ozet() {
    var sp = K.siparisler(), bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    var bg = sp.filter(function (s) { return s.tarih >= bugun.getTime(); });
    var ciro = bg.reduce(function (a, s) { return a + K.toplam(s.kalem, s.kupon).genel; }, 0);
    var tumCiro = sp.reduce(function (a, s) { return a + K.toplam(s.kalem, s.kupon).genel; }, 0);
    var bekleyen = sp.filter(function (s) { return s.durum === "Yeni" || s.durum === "Hazırlanıyor"; });
    var ds = dusukStok();
    var son = sp.slice().sort(function (a, b) { return b.tarih - a.tarih; }).slice(0, 6);
    iskelet("ozet", '<h1>Bugün</h1><p class="alt-b">' + new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) + "</p>" +
      '<div class="sayilar"><div><span>Bugünkü sipariş</span><b>' + bg.length + "</b></div><div><span>Bugünkü ciro</span><b>" + TL(ciro) + "</b></div><div><span>Hazırlanacak</span><b>" + bekleyen.length + "</b></div><div><span>Toplam ciro (demo)</span><b>" + TL(tumCiro) + "</b></div></div>" +
      '<div class="iki-kolon"><div><h2 class="baslik" style="font-size:24px;margin:0 0 10px">Son siparişler</h2><table class="tablo"><thead><tr><th>No</th><th>Müşteri</th><th class="gizle-m">Tarih</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>' +
      son.map(function (s) { return '<tr class="tik" data-no="' + s.no + '"><td class="mono">' + s.no + "</td><td>" + E(s.ad) + '</td><td class="gizle-m">' + tarih(s.tarih) + "</td><td>" + TL(K.toplam(s.kalem, s.kupon).genel) + '</td><td><span class="dz ' + s.durum + '">' + s.durum + "</span></td></tr>"; }).join("") +
      '</tbody></table></div><div><h2 class="baslik" style="font-size:24px;margin:0 0 10px">Stok uyarısı</h2><table class="tablo"><thead><tr><th>Ürün</th><th>Kalan</th></tr></thead><tbody>' +
      (ds.length ? ds.map(function (x) { return '<tr class="uyari-satir"><td>' + E(x[0].ad) + " · " + E(x[0].secenek[x[1]][0]) + "</td><td><b>" + x[0].secenek[x[1]][2] + "</b></td></tr>"; }).join("") : '<tr><td colspan="2">Düşük stok yok.</td></tr>') +
      '</tbody></table><p style="font-size:13.5px;color:var(--soluk)">5 adet ve altı uyarı verir. Gerçek panelde bu uyarı her sabah WhatsApp ya da e-postayla da gelir.</p></div></div>');
    $$("tr[data-no]").forEach(function (r) { r.onclick = function () { location.hash = "#siparisler"; setTimeout(function () { detay(r.dataset.no); }, 30); }; });
  }
  function siparisler() {
    var sp = K.siparisler().slice().sort(function (a, b) { return b.tarih - a.tarih; });
    var gor = filtre === "Hepsi" ? sp : sp.filter(function (s) { return s.durum === filtre; });
    iskelet("siparisler", "<h1>Siparişler</h1><p class=\"alt-b\">Satıra tıklayın: detay, durum değiştirme, kargo takip numarası.</p>" +
      '<div class="sekmeler">' + ["Hepsi"].concat(SIRA).map(function (d) { var n = d === "Hepsi" ? sp.length : sp.filter(function (s) { return s.durum === d; }).length; return '<button type="button" class="' + (filtre === d ? "ak" : "") + '" data-f="' + d + '">' + d + " (" + n + ")</button>"; }).join("") + "</div>" +
      '<table class="tablo"><thead><tr><th>No</th><th>Müşteri</th><th class="gizle-m">İl</th><th class="gizle-m">Ödeme</th><th class="gizle-m">Tarih</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>' +
      (gor.length ? gor.map(function (s) { return '<tr class="tik" data-no="' + s.no + '"><td class="mono">' + s.no + "</td><td>" + E(s.ad) + '</td><td class="gizle-m">' + E(s.il) + '</td><td class="gizle-m">' + E(s.odeme) + '</td><td class="gizle-m">' + tarih(s.tarih) + "</td><td>" + TL(K.toplam(s.kalem, s.kupon).genel) + '</td><td><span class="dz ' + s.durum + '">' + s.durum + "</span></td></tr>"; }).join("") : '<tr><td colspan="7">Bu durumda sipariş yok.</td></tr>') + "</tbody></table>");
    $$("[data-f]").forEach(function (b) { b.onclick = function () { filtre = b.dataset.f; siparisler(); }; });
    $$("tr[data-no]").forEach(function (r) { r.onclick = function () { detay(r.dataset.no); }; });
  }
  function detay(no) {
    var sp = K.siparisler(), s = sp.filter(function (x) { return x.no === no; })[0]; if (!s) return;
    var t = K.toplam(s.kalem, s.kupon);
    var c = document.createElement("div"); c.className = "cekmece";
    c.innerHTML = '<button class="btn ikincil" type="button" id="kapat" style="float:right;min-height:36px;padding:6px 12px">Kapat</button><span class="etiket">' + tarih(s.tarih) + '</span><h2 class="mono">' + s.no + "</h2>" +
      '<p style="margin:6px 0 14px"><b>' + E(s.ad) + "</b> · " + E(s.tel) + "<br>" + E(s.adres) + " / " + E(s.il) + "<br>" + E(s.kargo) + " Kargo · " + E(s.odeme) + "</p>" +
      '<table class="tablo" style="margin-bottom:12px"><tbody>' + s.kalem.map(function (k) { var u = K.urun(k[0]); return u ? "<tr><td>" + k[2] + " × " + E(u.ad) + " (" + E(u.secenek[k[1]][0]) + ')</td><td style="text-align:right">' + TL(u.secenek[k[1]][1] * k[2]) + "</td></tr>" : ""; }).join("") +
      (t.ind ? '<tr><td>İndirim</td><td style="text-align:right">−' + TL(t.ind) + "</td></tr>" : "") + '<tr><td>Kargo</td><td style="text-align:right">' + (t.kargo ? TL(t.kargo) : "Ücretsiz") + '</td></tr><tr><td><b>Toplam</b></td><td style="text-align:right"><b>' + TL(t.genel) + "</b></td></tr></tbody></table>" +
      '<div class="alan" style="margin-bottom:10px"><label for="dDurum">Durum</label><select id="dDurum">' + SIRA.map(function (d) { return "<option" + (d === s.durum ? " selected" : "") + ">" + d + "</option>"; }).join("") + "</select></div>" +
      '<div class="alan" style="margin-bottom:14px"><label for="dTakip">Kargo takip numarası</label><input id="dTakip" value="' + E(s.takip) + '" placeholder="Kargoya verince yazın"></div>' +
      '<button class="btn tam" type="button" id="dKaydet">Kaydet</button><p style="font-size:13px;color:var(--soluk)">Gerçek mağazada "Kargoda" seçilince müşteriye takip numarasıyla SMS / e-posta gider ve kargo firmasının sistemine gönderi kaydı açılır.</p>' +
      '<button class="btn ikincil tam" type="button" id="dYazdir" style="margin-top:6px">Kargo etiketi / irsaliye yazdır</button>';
    document.body.appendChild(c);
    $("#kapat", c).onclick = function () { c.remove(); };
    $("#dYazdir", c).onclick = function () { alert("Demo: gerçek panelde A6 kargo etiketi ve sipariş fişi PDF olarak açılır."); };
    $("#dKaydet", c).onclick = function () {
      var d = $("#dDurum", c).value, tk = $("#dTakip", c).value.trim();
      if (d === "Kargoda" && !tk) { alert("Kargoda seçmek için takip numarası yazın."); return; }
      var x = K.siparisler(); x.forEach(function (y) { if (y.no === no) { y.durum = d; y.takip = tk; } }); K.siparisKaydet(x);
      c.remove(); siparisler();
    };
  }
  function urunler() {
    var x = K.urunler();
    iskelet("urunler", '<h1>Ürünler ve stok</h1><p class="alt-b">Stok ve fiyatı satırda değiştirip "Kaydet"e basın. Mağazada anında görünür. Pasif ürün mağazada gizlenir.</p>' +
      '<table class="tablo"><thead><tr><th></th><th>Ürün</th><th>Seçenek</th><th>Fiyat (TL)</th><th>Stok</th><th class="gizle-m">Mağazada</th></tr></thead><tbody>' +
      x.map(function (u, ui) {
        return u.secenek.map(function (s, si) {
          return "<tr" + (s[2] <= 5 ? ' class="uyari-satir"' : "") + ">" + (si === 0 ? '<td rowspan="' + u.secenek.length + '" style="width:58px"><img src="' + K.gorsel(u.id) + '" alt="" style="width:46px;height:46px;object-fit:cover"></td><td rowspan="' + u.secenek.length + '"><b>' + E(u.ad) + '</b><br><span style="font-size:13px;color:var(--soluk)">' + E(K.KATEGORI[u.kat] || u.kat) + "</span></td>" : "") +
            "<td>" + E(s[0]) + '</td><td><input class="kucuk" data-u="' + ui + '" data-s="' + si + '" data-k="1" inputmode="numeric" value="' + s[1] + '"></td><td><input class="kucuk" data-u="' + ui + '" data-s="' + si + '" data-k="2" inputmode="numeric" value="' + s[2] + '"></td>' +
            (si === 0 ? '<td class="gizle-m" rowspan="' + u.secenek.length + '"><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-aktif="' + ui + '"' + (u.aktif ? " checked" : "") + ' style="accent-color:var(--murekkep)"> ' + (u.aktif ? "Açık" : "Pasif") + "</label></td>" : "") + "</tr>";
        }).join("");
      }).join("") + '</tbody></table><div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="uKaydet" type="button">Kaydet</button><a class="btn ikincil" href="#yeni">Yeni ürün ekle</a><button class="btn ikincil" id="csv" type="button">Excel (CSV) indir</button></div>');
    $("#uKaydet").onclick = function () {
      var y = K.urunler();
      $$("input[data-k]").forEach(function (i) { var v = parseInt(i.value.replace(/\D/g, ""), 10); if (!isNaN(v)) y[+i.dataset.u].secenek[+i.dataset.s][+i.dataset.k] = v; });
      $$("input[data-aktif]").forEach(function (c) { y[+c.dataset.aktif].aktif = c.checked; });
      K.urunKaydet(y); urunler(); bildir("Kaydedildi. Mağaza sayfasında hemen güncel.");
    };
    $("#csv").onclick = function () {
      var r = [["urun", "secenek", "fiyat", "stok"]]; K.urunler().forEach(function (u) { u.secenek.forEach(function (s) { r.push([u.ad, s[0], s[1], s[2]]); }); });
      var b = new Blob(["﻿" + r.map(function (a) { return a.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "kiler-toros-stok.csv"; a.click();
    };
  }
  function yeni() {
    var gorseller = K.urunler().map(function (u) { return u.id; });
    iskelet("yeni", '<h1>Ürün ekle</h1><p class="alt-b">Demo: fotoğraf yüklemek yerine mevcut fotoğraflardan birini seçin. Gerçek panelde telefondan çekip yüklersiniz.</p>' +
      '<form id="yForm" style="max-width:640px;background:var(--beyaz);border:1px solid var(--cizgi);padding:22px"><div class="alanlar">' +
      '<div class="alan tam"><label for="yAd">Ürün adı</label><input id="yAd" required placeholder="Örn. Kestane Balı"></div>' +
      '<div class="alan"><label for="yKat">Kategori</label><select id="yKat">' + Object.keys(K.KATEGORI).map(function (k) { return '<option value="' + k + '">' + K.KATEGORI[k] + "</option>"; }).join("") + "</select></div>" +
      '<div class="alan"><label for="yGorsel">Fotoğraf</label><select id="yGorsel">' + gorseller.map(function (g) { return "<option>" + g + "</option>"; }).join("") + "</select></div>" +
      '<div class="alan"><label for="ySec">Seçenek (gramaj)</label><input id="ySec" required placeholder="460 g"></div><div class="alan"><label for="yFiyat">Fiyat (TL)</label><input id="yFiyat" required inputmode="numeric" placeholder="650"></div>' +
      '<div class="alan"><label for="yStok">Stok</label><input id="yStok" required inputmode="numeric" placeholder="20"></div><div class="alan"><label for="yKoken">Köken</label><input id="yKoken" placeholder="Örn. Karadeniz yaylaları"></div>' +
      '<div class="alan tam"><label for="yAcik">Açıklama</label><textarea id="yAcik" rows="3" placeholder="Tadı, kullanımı, saklama"></textarea></div></div>' +
      '<button class="btn" type="submit" style="margin-top:14px">Ürünü yayına al</button></form>');
    $("#yForm").onsubmit = function (e) {
      e.preventDefault();
      var y = K.urunler(), id = $("#yGorsel").value;
      var yeniId = "u" + Date.now().toString(36);
      y.unshift({ id: yeniId, gorselId: id, ad: $("#yAd").value.trim(), kat: $("#yKat").value, koken: $("#yKoken").value.trim() || "—", aciklama: $("#yAcik").value.trim() || "", secenek: [[$("#ySec").value.trim(), parseInt($("#yFiyat").value, 10) || 0, parseInt($("#yStok").value, 10) || 0]], aktif: true, rozet: "Yeni" });
      K.urunKaydet(y); bildir('Ürün eklendi. <a href="../#/urun/' + yeniId + '">Mağazada gör →</a>'); location.hash = "#urunler";
    };
  }
  function bildir(h) { var b = document.createElement("div"); b.className = "bildirim"; b.innerHTML = h; document.body.appendChild(b); setTimeout(function () { b.remove(); }, 3500); }
  function ciz() {
    if (!girisli()) { giris(); return; }
    var h = location.hash.replace("#", "") || "ozet";
    if (h === "siparisler") siparisler(); else if (h === "urunler") urunler(); else if (h === "yeni") yeni(); else ozet();
  }
  window.addEventListener("hashchange", ciz);
  ciz();
})();
