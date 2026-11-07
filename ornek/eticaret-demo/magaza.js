(function () {
  var K = window.KILER, $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return [].slice.call((k || document).querySelectorAll(s)); };
  var E = K.esc, TL = K.tl;
  var durum = { kat: [], min: "", max: "", sira: "onerilen", ara: "", stokta: false, kupon: "" };
  var odeme = { adim: 1, bilgi: null };

  function enUcuz(u) { return Math.min.apply(null, u.secenek.map(function (s) { return s[1]; })); }
  function toplamStok(u) { return u.secenek.reduce(function (a, s) { return a + s[2]; }, 0); }
  function sepetSay() { var n = 0; K.sepet().forEach(function (k) { n += k[2]; }); $("#sepetSay").textContent = n; }
  function bildir(html) {
    var b = $(".bildirim"); if (b) b.remove();
    b = document.createElement("div"); b.className = "bildirim"; b.innerHTML = html; document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.remove(); }, 3800);
  }
  function menu(aktif) {
    var h = '<a href="#/" class="' + (aktif === "hepsi" ? "aktif" : "") + '">Tüm ürünler</a>';
    Object.keys(K.KATEGORI).forEach(function (k) { h += '<a href="#/kategori/' + encodeURIComponent(k) + '" class="' + (aktif === k ? "aktif" : "") + '">' + K.KATEGORI[k].split(" ve ")[0] + "</a>"; });
    h += '<a href="#/takip" class="' + (aktif === "takip" ? "aktif" : "") + '">Sipariş takibi</a>';
    $("#menu").innerHTML = h;
  }

  /* ---------- liste ---------- */
  function liste(katParam) {
    if (katParam) durum.kat = [katParam];
    menu(katParam || (durum.kat.length === 1 ? durum.kat[0] : "hepsi"));
    var giris = !katParam && !durum.ara ? (
      '<section class="giris"><div class="foto" style="background-image:url(' + K.gorsel("hero") + ')" role="img" aria-label="Kiler Toros ürünleri masada"></div>' +
      '<div class="yazi"><span class="etiket">Bu hafta · yeni hasat zeytinyağı geldi</span><h1 class="baslik">Toroslar\'dan<br>kilerinize.</h1>' +
      '<p>Bal, zeytinyağı, pekmez ve kuru gıdayı üreticiden alıp kendi depomuzdan gönderiyoruz. Her ürünün nereden geldiği sayfasında yazıyor.</p>' +
      '<div><a class="btn" href="#/kategori/bal">Ballara bak</a> <a class="btn ikincil" href="#/urun/zeytinyagi">Yeni hasat yağ</a></div></div></section>' +
      '<div class="bilgi-bant"><div><b>Kargo</b>1.000 TL üzeri ücretsiz</div><div><b>Gönderim</b>14:00\'e kadar aynı gün</div><div><b>Ödeme</b>Kart, havale, kapıda</div><div><b>İade</b>14 gün, kapalı ürünlerde</div></div>') : "";
    $("#sayfa").innerHTML = giris +
      '<div class="kap"><div class="liste-ust"><div><span class="etiket" id="sonucSay"></span><h2 class="baslik" id="listeBaslik"></h2></div>' +
      '<div style="display:flex;gap:8px"><button class="btn ikincil mobil-filtre" id="filtreAc" type="button">Filtrele</button>' +
      '<select class="sirala" id="sira" aria-label="Sırala"><option value="onerilen">Önerilen</option><option value="artan">Fiyat: artan</option><option value="azalan">Fiyat: azalan</option><option value="ad">Ada göre</option></select></div></div>' +
      '<div class="duzen"><aside class="filtre" id="filtre"></aside><div><div class="izgara" id="izgara"></div></div></div></div>';
    filtreCiz(); izgaraCiz();
    $("#sira").value = durum.sira;
    $("#sira").onchange = function () { durum.sira = this.value; izgaraCiz(); };
    $("#filtreAc").onclick = function () { $("#filtre").classList.toggle("acik"); };
  }
  function filtreCiz() {
    var h = '<div class="grup"><h4>Kategori</h4>';
    Object.keys(K.KATEGORI).forEach(function (k) { h += '<label><input type="checkbox" value="' + k + '"' + (durum.kat.indexOf(k) > -1 ? " checked" : "") + "> " + K.KATEGORI[k] + "</label>"; });
    h += '</div><div class="grup"><h4>Fiyat (TL)</h4><div class="fiyat-ara"><input id="fMin" inputmode="numeric" placeholder="En az" value="' + E(durum.min) + '"><input id="fMax" inputmode="numeric" placeholder="En çok" value="' + E(durum.max) + '"></div></div>' +
      '<div class="grup"><h4>Durum</h4><label><input type="checkbox" id="fStok"' + (durum.stokta ? " checked" : "") + "> Yalnız stokta olanlar</label></div>" +
      '<div class="grup"><button class="btn ikincil tam" id="fTemizle" type="button">Filtreleri temizle</button></div>';
    $("#filtre").innerHTML = h;
    $$("#filtre input[type=checkbox][value]").forEach(function (c) { c.onchange = function () { durum.kat = $$("#filtre input[type=checkbox][value]:checked").map(function (x) { return x.value; }); izgaraCiz(); }; });
    $("#fMin").oninput = function () { durum.min = this.value.replace(/\D/g, ""); izgaraCiz(); };
    $("#fMax").oninput = function () { durum.max = this.value.replace(/\D/g, ""); izgaraCiz(); };
    $("#fStok").onchange = function () { durum.stokta = this.checked; izgaraCiz(); };
    $("#fTemizle").onclick = function () { durum.kat = []; durum.min = durum.max = ""; durum.stokta = false; durum.ara = ""; $("#ara").value = ""; location.hash = "#/"; filtreCiz(); izgaraCiz(); };
  }
  function izgaraCiz() {
    var q = durum.ara.toLocaleLowerCase("tr");
    var x = K.urunler().filter(function (u) {
      if (!u.aktif) return false;
      if (durum.kat.length && durum.kat.indexOf(u.kat) < 0) return false;
      var f = enUcuz(u);
      if (durum.min && f < +durum.min) return false;
      if (durum.max && f > +durum.max) return false;
      if (durum.stokta && !toplamStok(u)) return false;
      if (q && (u.ad + " " + u.aciklama + " " + u.koken).toLocaleLowerCase("tr").indexOf(q) < 0) return false;
      return true;
    });
    if (durum.sira === "artan") x.sort(function (a, b) { return enUcuz(a) - enUcuz(b); });
    if (durum.sira === "azalan") x.sort(function (a, b) { return enUcuz(b) - enUcuz(a); });
    if (durum.sira === "ad") x.sort(function (a, b) { return a.ad.localeCompare(b.ad, "tr"); });
    $("#listeBaslik").textContent = q ? '"' + durum.ara + '" için sonuçlar' : durum.kat.length === 1 ? K.KATEGORI[durum.kat[0]] : "Tüm ürünler";
    $("#sonucSay").textContent = x.length + " ürün";
    $("#izgara").innerHTML = x.length ? x.map(function (u) {
      var st = toplamStok(u), rz = !st ? '<span class="rz az">Tükendi</span>' : st <= 5 ? '<span class="rz az">Son ' + st + " adet</span>" : u.rozet ? '<span class="rz">' + E(u.rozet) + "</span>" : "";
      return '<a class="kart" href="#/urun/' + u.id + '"><div class="g"><img src="' + K.gorsel(u.id) + '" alt="' + E(u.ad) + '" loading="lazy">' + rz + "</div>" +
        '<div class="ad">' + E(u.ad) + '</div><div class="alt"><span>' + u.secenek.map(function (s) { return s[0]; }).join(" · ") + '</span><span class="fiyat">' + (u.secenek.length > 1 ? "" : "") + TL(enUcuz(u)) + (u.secenek.length > 1 ? "'den" : "") + "</span></div></a>";
    }).join("") : '<p class="bos">Bu filtrelerle ürün bulunamadı. <a href="#/" onclick="return false" id="bosTemizle">Filtreleri temizleyin.</a></p>';
    var bt = $("#bosTemizle"); if (bt) bt.onclick = function () { $("#fTemizle").click(); return false; };
  }

  /* ---------- ürün ---------- */
  function urunSayfa(id) {
    var u = K.urun(id); menu(u ? u.kat : "");
    if (!u || !u.aktif) { $("#sayfa").innerHTML = '<div class="kap bos">Ürün bulunamadı. <a href="#/">Mağazaya dön</a></div>'; return; }
    var sec = u.secenek.findIndex(function (s) { return s[2] > 0; }); if (sec < 0) sec = 0;
    var adet = 1;
    $("#sayfa").innerHTML = '<div class="kap"><div class="yol"><a href="#/">Mağaza</a> / <a href="#/kategori/' + u.kat + '">' + K.KATEGORI[u.kat] + "</a> / " + E(u.ad) + "</div>" +
      '<div class="urun"><div class="g"><img src="' + K.gorsel(u.id) + '" alt="' + E(u.ad) + '"></div><div>' +
      '<span class="etiket">' + K.KATEGORI[u.kat] + '</span><h1 class="baslik">' + E(u.ad) + '</h1><p class="koken">' + E(u.koken) + "</p>" +
      '<div class="fiyat-b" id="uFiyat"></div><div class="stok" id="uStok"></div>' +
      '<div class="secenekler" id="uSec">' + u.secenek.map(function (s, i) { return '<button type="button" data-i="' + i + '"' + (s[2] ? "" : " disabled") + ">" + E(s[0]) + "</button>"; }).join("") + "</div>" +
      '<div class="al-satir"><div class="adet"><button type="button" id="aEksi" aria-label="Azalt">−</button><span id="aSay">1</span><button type="button" id="aArti" aria-label="Arttır">+</button></div>' +
      '<button class="btn" id="sepeteEkle" type="button" style="flex:1">Sepete ekle</button></div>' +
      '<p style="margin:0 0 8px">' + E(u.aciklama) + "</p>" +
      '<div class="ozellik"><div><b>Köken</b><span>' + E(u.koken) + '</span></div><div><b>Kargo</b><span>14:00\'e kadar verilen siparişler aynı gün kargoda. 1.000 TL üzeri ücretsiz.</span></div><div><b>Saklama</b><span>Serin ve kuru yerde, güneş görmeden.</span></div><div><b>İade</b><span>Ambalajı açılmamış ürünlerde 14 gün.</span></div></div>' +
      "</div></div>" + benzer(u) + "</div>";
    function guncelle() {
      var s = u.secenek[sec];
      $("#uFiyat").textContent = TL(s[1]);
      var st = $("#uStok"); st.className = "stok" + (s[2] <= 5 ? " az" : "");
      st.textContent = !s[2] ? "Bu seçenek tükendi" : s[2] <= 5 ? "Stokta son " + s[2] + " adet" : "Stokta · aynı gün kargo";
      $$("#uSec button").forEach(function (b) { b.classList.toggle("sec", +b.dataset.i === sec); });
      if (adet > s[2]) adet = Math.max(1, s[2]);
      $("#aSay").textContent = adet;
      $("#sepeteEkle").disabled = !s[2];
    }
    $$("#uSec button").forEach(function (b) { b.onclick = function () { sec = +b.dataset.i; guncelle(); }; });
    $("#aEksi").onclick = function () { if (adet > 1) { adet--; guncelle(); } };
    $("#aArti").onclick = function () { if (adet < u.secenek[sec][2]) { adet++; guncelle(); } else bildir("Stokta bu kadar var."); };
    $("#sepeteEkle").onclick = function () {
      var sp = K.sepet(), v = sp.filter(function (k) { return k[0] === u.id && k[1] === sec; })[0];
      var mevcut = v ? v[2] : 0;
      if (mevcut + adet > u.secenek[sec][2]) { bildir("Sepetinizde zaten " + mevcut + " adet var; stok " + u.secenek[sec][2] + "."); return; }
      if (v) v[2] += adet; else sp.push([u.id, sec, adet]);
      K.sepetKaydet(sp); sepetSay();
      bildir(E(u.ad) + " (" + E(u.secenek[sec][0]) + ") sepete eklendi. <a href=\"#/sepet\">Sepete git →</a>");
    };
    guncelle(); window.scrollTo(0, 0);
  }
  function benzer(u) {
    var x = K.urunler().filter(function (b) { return b.aktif && b.kat === u.kat && b.id !== u.id; }).slice(0, 3);
    if (!x.length) return "";
    return '<h2 class="baslik" style="font-size:34px;margin:10px 0 18px">Yanına iyi gider</h2><div class="izgara" style="padding-bottom:60px">' + x.map(function (b) {
      return '<a class="kart" href="#/urun/' + b.id + '"><div class="g"><img src="' + K.gorsel(b.id) + '" alt="' + E(b.ad) + '" loading="lazy"></div><div class="ad">' + E(b.ad) + '</div><div class="alt"><span>' + b.secenek[0][0] + '</span><span class="fiyat">' + TL(enUcuz(b)) + "</span></div></a>";
    }).join("") + "</div>";
  }

  /* ---------- sepet ---------- */
  function ozetHtml(kalem, buton) {
    var t = K.toplam(kalem, durum.kupon), kalan = Math.max(0, 1000 - (t.ara - t.ind));
    return '<aside class="ozet"><b style="font-size:18px">Sipariş özeti</b>' +
      '<div class="s"><span>Ürünler</span><span>' + TL(t.ara) + "</span></div>" +
      (t.ind ? '<div class="s" style="color:var(--yesil)"><span>İndirim (DEMO10)</span><span>−' + TL(t.ind) + "</span></div>" : "") +
      '<div class="s"><span>Kargo</span><span>' + (t.kargo ? TL(t.kargo) : "Ücretsiz") + "</span></div>" +
      (kalan > 0 && t.ara ? '<div class="kargo-bar"><i style="width:' + Math.min(100, (t.ara - t.ind) / 10) + '%"></i></div><p class="not" style="margin:0">Ücretsiz kargoya ' + TL(kalan) + " kaldı.</p>" : "") +
      '<div class="s genel"><span>Toplam</span><span>' + TL(t.genel) + "</span></div>" +
      (buton || "") + '<p class="not">Fiyatlara KDV dahildir (demo).</p></aside>';
  }
  function sepetSayfa() {
    menu("");
    var sp = K.sepet().filter(function (k) { return K.urun(k[0]); });
    if (!sp.length) { $("#sayfa").innerHTML = '<div class="kap tamam"><span class="etiket">Sepet</span><h1 class="baslik">Sepetiniz boş.</h1><p>Ballardan başlamak isterseniz çam balı en çok satanımız.</p><a class="btn" href="#/urun/cam-bali">Çam balına bak</a> <a class="btn ikincil" href="#/">Tüm ürünler</a></div>'; return; }
    $("#sayfa").innerHTML = '<div class="kap"><div class="yol"><a href="#/">Mağaza</a> / Sepet</div><h1 class="baslik" style="font-size:52px;margin:0 0 10px">Sepetiniz</h1><div class="iki"><div>' +
      sp.map(function (k, i) {
        var u = K.urun(k[0]), s = u.secenek[k[1]];
        return '<div class="satir"><img src="' + K.gorsel(u.id) + '" alt=""><div><a href="#/urun/' + u.id + '" style="font-weight:600;text-decoration:none">' + E(u.ad) + '</a><div class="k">' + E(s[0]) + " · " + TL(s[1]) + '</div><div style="margin-top:8px;display:flex;gap:14px;align-items:center"><div class="adet" style="height:38px"><button type="button" data-e="' + i + '">−</button><span>' + k[2] + '</span><button type="button" data-a="' + i + '">+</button></div><button class="sil" type="button" data-s="' + i + '">Kaldır</button></div></div><b>' + TL(s[1] * k[2]) + "</b></div>";
      }).join("") +
      '<div class="kupon"><input id="kupon" placeholder="Kupon kodu (deneyin: DEMO10)" value="' + E(durum.kupon) + '"><button class="btn ikincil" id="kuponUygula" type="button">Uygula</button></div></div>' +
      ozetHtml(sp, '<a class="btn tam" href="#/odeme" style="margin-top:14px">Ödemeye geç</a>') + "</div></div>";
    function degis(i, d) {
      var x = K.sepet(), u = K.urun(x[i][0]), st = u.secenek[x[i][1]][2];
      x[i][2] += d; if (x[i][2] > st) { x[i][2] = st; bildir("Stokta " + st + " adet var."); }
      if (x[i][2] <= 0) x.splice(i, 1);
      K.sepetKaydet(x); sepetSay(); sepetSayfa();
    }
    $$("[data-e]").forEach(function (b) { b.onclick = function () { degis(+b.dataset.e, -1); }; });
    $$("[data-a]").forEach(function (b) { b.onclick = function () { degis(+b.dataset.a, 1); }; });
    $$("[data-s]").forEach(function (b) { b.onclick = function () { var x = K.sepet(); x.splice(+b.dataset.s, 1); K.sepetKaydet(x); sepetSay(); sepetSayfa(); }; });
    $("#kuponUygula").onclick = function () {
      var v = $("#kupon").value.trim().toUpperCase();
      if (v === "DEMO10") { durum.kupon = v; bildir("DEMO10 uygulandı: %10 indirim."); } else { durum.kupon = ""; bildir("Bu kupon geçerli değil. Demoda DEMO10 çalışır."); }
      sepetSayfa();
    };
  }

  /* ---------- ödeme ---------- */
  function odemeSayfa() {
    menu("");
    var sp = K.sepet().filter(function (k) { return K.urun(k[0]); });
    if (!sp.length) { location.hash = "#/sepet"; return; }
    var b = odeme.bilgi || { ad: "Ayşe Demir", tel: "0555 000 12 34", eposta: "ayse@ornek.com", il: "Antalya", ilce: "Konyaaltı", adres: "Örnek Mah. Deneme Sk. No: 1 D: 2", kargo: "Yurtiçi", odeme: "Kart" };
    var adim = odeme.adim;
    var ad = '<div class="adimlar"><span class="' + (adim === 1 ? "ak" : "bit") + '">1 · Teslimat</span><span class="' + (adim === 2 ? "ak" : adim > 2 ? "bit" : "") + '">2 · Ödeme</span><span>3 · Onay</span></div>';
    var sol;
    if (adim === 1) {
      sol = '<form id="tForm">' + ad +
        '<fieldset><legend>İletişim</legend><div class="alanlar"><div class="alan"><label for="fAd">Ad soyad</label><input id="fAd" required value="' + E(b.ad) + '"></div><div class="alan"><label for="fTel">Telefon</label><input id="fTel" required inputmode="tel" value="' + E(b.tel) + '"></div><div class="alan tam"><label for="fEp">E-posta</label><input id="fEp" type="email" value="' + E(b.eposta) + '"></div></div></fieldset>' +
        '<fieldset><legend>Teslimat adresi</legend><div class="alanlar"><div class="alan"><label for="fIl">İl</label><select id="fIl">' + ["Antalya", "İstanbul", "Ankara", "İzmir", "Bursa", "Konya", "Diğer"].map(function (i) { return "<option" + (i === b.il ? " selected" : "") + ">" + i + "</option>"; }).join("") + '</select></div><div class="alan"><label for="fIlce">İlçe</label><input id="fIlce" required value="' + E(b.ilce) + '"></div><div class="alan tam"><label for="fAdr">Açık adres</label><input id="fAdr" required value="' + E(b.adres) + '"></div></div><p class="not" style="font-size:13px;color:var(--soluk);margin:10px 0 0">Demo: alanlar örnek bilgilerle dolu. Gerçek adres yazmanıza gerek yok; bilgiler yalnız bu tarayıcıda kalır.</p></fieldset>' +
        '<fieldset><legend>Kargo</legend><div class="secim"><label><input type="radio" name="kargo" value="Yurtiçi"' + (b.kargo === "Yurtiçi" ? " checked" : "") + '> Yurtiçi Kargo · 1-2 iş günü<span class="sag">Sepette</span></label><label><input type="radio" name="kargo" value="Aras"' + (b.kargo === "Aras" ? " checked" : "") + '> Aras Kargo · 1-3 iş günü<span class="sag">Sepette</span></label></div></fieldset>' +
        '<button class="btn" type="submit">Ödeme adımına geç</button></form>';
    } else {
      sol = '<form id="oForm">' + ad +
        '<fieldset><legend>Teslimat</legend><p style="margin:0">' + E(b.ad) + " · " + E(b.tel) + "<br>" + E(b.adres) + ", " + E(b.ilce) + " / " + E(b.il) + "<br>" + E(b.kargo) + ' Kargo · <a href="#" id="geri">Değiştir</a></p></fieldset>' +
        '<fieldset><legend>Ödeme yöntemi</legend><div class="secim">' +
        '<label><input type="radio" name="odeme" value="Kart"' + (b.odeme === "Kart" ? " checked" : "") + '> Kredi / banka kartı (3D Secure)<span class="sag">Tek çekim</span></label>' +
        '<label><input type="radio" name="odeme" value="Havale"' + (b.odeme === "Havale" ? " checked" : "") + '> Havale / EFT<span class="sag">%2 indirim yok, demo</span></label>' +
        '<label><input type="radio" name="odeme" value="Kapıda"' + (b.odeme === "Kapıda" ? " checked" : "") + '> Kapıda ödeme<span class="sag">+0 TL (demo)</span></label></div>' +
        '<div class="demo-kart" id="kartAlan"><b>Demo ödeme · gerçek kart bilgisi girmeyin.</b> Gerçek mağazada bu alan PayTR ya da iyzico güvenli ödeme sayfasıdır. Burada hiçbir ödeme alınmaz.<span class="mono">DEMO KART · **** **** **** 0000 · 12/30</span></div></fieldset>' +
        '<label style="display:flex;gap:10px;align-items:flex-start;font-size:14px;margin:6px 0 16px"><input type="checkbox" id="sozlesme" required style="margin-top:4px;accent-color:var(--murekkep)"> Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum (demo metin).</label>' +
        '<button class="btn vurgu" type="submit">Siparişi onayla (demo)</button></form>';
    }
    $("#sayfa").innerHTML = '<div class="kap"><div class="yol"><a href="#/sepet">Sepet</a> / Ödeme</div><div class="iki"><div>' + sol + "</div>" + ozetHtml(sp, '<div style="margin-top:12px;font-size:14px">' + sp.map(function (k) { var u = K.urun(k[0]); return k[2] + " × " + E(u.ad) + " (" + E(u.secenek[k[1]][0]) + ")"; }).join("<br>") + "</div>") + "</div></div>";
    if (adim === 1) {
      $("#tForm").onsubmit = function (e) {
        e.preventDefault();
        odeme.bilgi = { ad: $("#fAd").value.trim(), tel: $("#fTel").value.trim(), eposta: $("#fEp").value.trim(), il: $("#fIl").value, ilce: $("#fIlce").value.trim(), adres: $("#fAdr").value.trim(), kargo: $("input[name=kargo]:checked").value, odeme: b.odeme };
        odeme.adim = 2; odemeSayfa(); window.scrollTo(0, 0);
      };
    } else {
      $("#geri").onclick = function (e) { e.preventDefault(); odeme.adim = 1; odemeSayfa(); };
      $$("input[name=odeme]").forEach(function (r) { r.onchange = function () { b.odeme = this.value; $("#kartAlan").style.display = this.value === "Kart" ? "" : "none"; }; });
      $("#kartAlan").style.display = b.odeme === "Kart" ? "" : "none";
      $("#oForm").onsubmit = function (e) {
        e.preventDefault(); b.odeme = $("input[name=odeme]:checked").value;
        if (b.odeme === "Kart") dogrulama(function () { siparisOlustur(b, sp); }); else siparisOlustur(b, sp);
      };
    }
  }
  function dogrulama(bitti) {
    var p = document.createElement("div"); p.className = "perde";
    p.innerHTML = '<div class="kutu" role="dialog" aria-label="Banka doğrulaması (demo)"><span class="etiket">3D Secure · demo</span><h3>Banka doğrulaması</h3><p style="margin:0;font-size:14.5px">Gerçek mağazada bankanız telefonunuza SMS kodu gönderir. Demoda kod hazır yazıldı.</p><div class="kod">482913</div><button class="btn tam" type="button" id="dOk">Onayla</button><button class="btn ikincil tam" type="button" id="dIptal" style="margin-top:8px">Vazgeç</button></div>';
    document.body.appendChild(p);
    $("#dOk", p).onclick = function () { this.disabled = true; this.textContent = "Doğrulanıyor…"; setTimeout(function () { p.remove(); bitti(); }, 900); };
    $("#dIptal", p).onclick = function () { p.remove(); };
  }
  function siparisOlustur(b, sp) {
    var urunler = K.urunler(), yetersiz = null;
    sp.forEach(function (k) { var u = urunler.filter(function (x) { return x.id === k[0]; })[0]; if (u.secenek[k[1]][2] < k[2]) yetersiz = u.ad; });
    if (yetersiz) { bildir(E(yetersiz) + " için stok değişti, sepeti kontrol edin."); location.hash = "#/sepet"; return; }
    sp.forEach(function (k) { var u = urunler.filter(function (x) { return x.id === k[0]; })[0]; u.secenek[k[1]][2] -= k[2]; });
    K.urunKaydet(urunler);
    var sip = K.siparisler(), no = "KT-" + (48245 + sip.length + Math.floor(Math.random() * 40));
    sip.push({ no: no, tarih: Date.now(), ad: b.ad, tel: b.tel, il: b.il, adres: b.adres + ", " + b.ilce, kargo: b.kargo, odeme: b.odeme, durum: "Yeni", takip: "", kalem: sp, kupon: durum.kupon });
    K.siparisKaydet(sip); K.sepetKaydet([]); sepetSay(); durum.kupon = ""; odeme.adim = 1;
    location.hash = "#/tamam/" + no;
  }
  function tamamSayfa(no) {
    menu("");
    var s = K.siparisler().filter(function (x) { return x.no === no; })[0];
    if (!s) { location.hash = "#/takip"; return; }
    var t = K.toplam(s.kalem, s.kupon);
    $("#sayfa").innerHTML = '<div class="kap tamam"><span class="etiket">Sipariş alındı · demo</span><h1 class="baslik">Teşekkürler, ' + E(s.ad.split(" ")[0]) + ".</h1>" +
      '<p>Sipariş numaranız <b class="mono">' + no + "</b>. Toplam " + TL(t.genel) + " · " + E(s.odeme) + ". Gerçek mağazada bu anda size e-posta ve SMS gider, mağaza sahibinin telefonuna bildirim düşer.</p>" +
      '<div class="zaman"><div class="su"><b>Sipariş alındı</b><span>Şimdi</span></div><div><b>Hazırlanıyor</b><span>Mağaza onayladığında</span></div><div><b>Kargoya verildi</b><span>Takip numarası burada görünür</span></div><div><b>Teslim edildi</b></div></div>' +
      '<a class="btn" href="panel/#siparisler">Bu siparişi yönetim panelinde gör</a> <a class="btn ikincil" href="#/takip/' + no + '">Sipariş takibi</a></div>';
  }

  /* ---------- takip ---------- */
  function takipSayfa(no) {
    menu("takip");
    $("#sayfa").innerHTML = '<div class="kap tamam"><span class="etiket">Sipariş takibi</span><h1 class="baslik">Siparişim nerede?</h1>' +
      '<form id="tkForm" class="alanlar" style="max-width:560px"><div class="alan"><label for="tkNo">Sipariş numarası</label><input id="tkNo" required placeholder="KT-48236" value="' + E(no || "") + '"></div><div class="alan"><label for="tkTel">Telefonun son 4 hanesi</label><input id="tkTel" required inputmode="numeric" maxlength="4" placeholder="1890"></div><div class="tam"><button class="btn" type="submit">Sorgula</button></div></form>' +
      '<p style="font-size:14px;color:var(--soluk)">Denemek için: <b class="mono">KT-48236</b> ve <b class="mono">1890</b> (kargodaki örnek sipariş).</p><div id="tkSonuc"></div></div>';
    if (no) { var s0 = K.siparisler().filter(function (x) { return x.no === no; })[0]; if (s0) $("#tkTel").value = s0.tel.replace(/\D/g, "").slice(-4); }
    $("#tkForm").onsubmit = function (e) {
      e.preventDefault();
      var n = $("#tkNo").value.trim().toUpperCase(), tel = $("#tkTel").value.trim();
      var s = K.siparisler().filter(function (x) { return x.no === n && x.tel.replace(/\D/g, "").slice(-4) === tel; })[0];
      if (!s) { $("#tkSonuc").innerHTML = '<p style="color:var(--uyari)">Bu numara ve telefonla sipariş bulunamadı.</p>'; return; }
      var sira = ["Yeni", "Hazırlanıyor", "Kargoda", "Teslim edildi"], i = sira.indexOf(s.durum);
      var ad = ["Sipariş alındı", "Hazırlanıyor", "Kargoya verildi", "Teslim edildi"];
      $("#tkSonuc").innerHTML = '<div class="zaman">' + ad.map(function (a, k) { return '<div class="' + (k < i ? "ok" : k === i ? "su" : "") + '"><b>' + a + "</b><span>" + (k === 2 && s.takip ? E(s.kargo) + " Kargo · takip no " + E(s.takip) : k === 0 ? new Date(s.tarih).toLocaleString("tr-TR") : "") + "</span></div>"; }).join("") + "</div>" +
        '<p style="font-size:14px">' + s.kalem.map(function (k) { var u = K.urun(k[0]); return u ? k[2] + " × " + E(u.ad) : ""; }).join(" · ") + " · Toplam " + TL(K.toplam(s.kalem, s.kupon).genel) + "</p>";
    };
    if (no && $("#tkTel").value) $("#tkForm").requestSubmit();
  }

  /* ---------- yönlendirme ---------- */
  function yol() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
    sepetSay();
    if (h[0] === "urun") urunSayfa(h[1]);
    else if (h[0] === "kategori") { durum.ara = ""; liste(h[1]); }
    else if (h[0] === "sepet") sepetSayfa();
    else if (h[0] === "odeme") odemeSayfa();
    else if (h[0] === "tamam") tamamSayfa(h[1]);
    else if (h[0] === "takip") takipSayfa(h[1]);
    else { if (!durum.ara) durum.kat = durum.kat.length === 1 ? [] : durum.kat; liste(""); }
    if (h[0] !== "") window.scrollTo(0, 0);
  }
  $("#araForm").onsubmit = function (e) { e.preventDefault(); durum.ara = $("#ara").value.trim(); durum.kat = []; if (location.hash === "#/" || location.hash === "") liste(""); else location.hash = "#/"; };
  $("#ara").oninput = function () { durum.ara = this.value.trim(); if ($("#izgara")) izgaraCiz(); };
  window.addEventListener("hashchange", yol);
  window.addEventListener("storage", sepetSay);
  yol();
})();
