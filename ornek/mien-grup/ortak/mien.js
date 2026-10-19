/* Mien Grup reklam açılış sayfaları — ortak bileşenler (demo verili, internetsiz çalışır; yalnız Instagram ve harita gömmeleri çevrimiçi ister). Dijitabela prototip. */
(function () {
  'use strict';
  var JS = document.currentScript && document.currentScript.src || '';
  var BASE = JS.replace(/ortak\/mien\.js.*$/, '');
  var IMG = BASE + 'img/';
  window.dataLayer = window.dataLayer || [];

  var M = window.MIEN = {
    ad: 'Mien Grup', slogan: 'Hayatı dört mevsim yaşa',
    wa: '905077069474', tel: '05077069474', tel2: '02162322922',
    adres: 'Mevlana Mah. Mine Sk. No:11/A Ataşehir / İstanbul',
    sv: { lat: 40.98637, lon: 29.15499 },
    img: function (k) { return IMG + k + '.jpg'; }
  };

  /* ---------- yardımcılar ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n, d) { return n.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: d == null ? 1 : d }); }
  function el(h) { var t = document.createElement('div'); t.innerHTML = h.trim(); return t.firstChild; }
  function track(ad, ek) {
    var o = { event: ad }; for (var k in (ek || {})) o[k] = ek[k];
    window.dataLayer.push(o);
    toast('Dönüşüm olayı yakalandı (demo): ' + ad);
  }
  var tt;
  function toast(m) {
    var t = document.getElementById('mw-toast');
    if (!t) { t = el('<div id="mw-toast" class="mw-toast" role="status"></div>'); document.body.appendChild(t); }
    t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }
  M.track = track;
  function waLink(text) { return 'https://wa.me/' + M.wa + '?text=' + encodeURIComponent(text); }
  M.waLink = waLink;

  /* ---------- kampanya (anahtar kelime) verisi ---------- */
  var KW = {
    'kis-bahcesi': { urun: 'kis', b: 'Kış bahçesi için 24 saatte keşif', a: 'Isı yalıtımlı kış bahçesi: kendi atölyemizde üretim, İstanbul genelinde montaj.', ad: 'Kış bahçesi' },
    'kenet-cati': { urun: 'kenet', b: 'Kenet çatı için 24 saatte keşif', a: 'Mimariye uyumlu, ısı yalıtımlı kenet çatı: projeye özel ölçü ve detay.', ad: 'Kenet çatı' },
    'pergola': { urun: 'pergola', b: 'Pergola için 24 saatte keşif', a: 'Bioklimatik pergola ve zip perde: terasınıza dört mevsim kullanım.', ad: 'Pergola' },
    'rehau-dograma': { urun: 'dograma', b: 'Rehau doğrama için 24 saatte keşif', a: 'PVC ve alüminyum doğrama: ısı yalıtımlı sürme ve pencere sistemleri.', ad: 'Rehau doğrama' },
    'munih': { urun: 'kis', b: 'Münih ve Almanya için Wintergärten-Beratung', a: 'Almanya\'da da hizmet veriyoruz: keşif ve proje planlaması için yazın.', ad: 'Almanya / Münih' }
  };
  M.KW = KW;
  function qkw() { var m = /[?&]kw=([^&#]+)/.exec(location.search); return m ? decodeURIComponent(m[1]) : ''; }

  M.bant = function (host) {
    var cur = qkw(); if (!KW[cur]) cur = '';
    host.classList.add('mw-bant');
    host.innerHTML = '<div class="mw-bant-in"><span class="mw-g">G</span><div class="mw-bant-t"><b></b><span></span></div>' +
      '<div class="mw-bant-demo"><label>Demo: reklam anahtar kelimesi</label><div class="mw-chips"></div></div></div>';
    var chips = host.querySelector('.mw-chips');
    Object.keys(KW).forEach(function (k) {
      var b = el('<button type="button" data-k="' + k + '">' + esc(KW[k].ad) + '</button>'); chips.appendChild(b);
      b.onclick = function () { set(k, true); };
    });
    var gen = el('<button type="button" data-k="">Reklamsız ziyaret</button>'); chips.appendChild(gen); gen.onclick = function () { set('', true); };
    function set(k, push) {
      cur = k; var d = KW[k];
      host.querySelector('b').textContent = d ? 'Google\'dan geldiniz — ' + d.b : 'Mien Grup: kış bahçesi, kenet çatı, pergola ve doğrama';
      host.querySelector('.mw-bant-t span').textContent = d ? d.a : 'Anahtar kelimeye göre değişen başlık: yukarıdaki adresi ?kw=kis-bahcesi gibi açın ya da aşağıdan deneyin.';
      [].forEach.call(chips.children, function (c) { c.classList.toggle('on', c.getAttribute('data-k') === k); });
      host.classList.toggle('mw-ads', !!d);
      if (push) { try { var u = new URL(location.href); if (k) u.searchParams.set('kw', k); else u.searchParams.delete('kw'); history.replaceState(null, '', u); } catch (e) {} }
      if (d && M._wiz) M._wiz.set({ urun: d.urun });
      document.dispatchEvent(new CustomEvent('mien-kw', { detail: { kw: k, d: d } }));
    }
    set(cur, false);
    M._bant = { set: set };
  };

  /* ---------- keşif sihirbazı ---------- */
  var URUN = {
    kis: { ad: 'Kış bahçesi', a: { t: 'Çatı', o: ['Cam çatı', 'Kenet çatı'] }, c: { t: 'Cam', o: ['Şeffaf ısıcam', 'Güneş kontrollü ısıcam', 'Lamine güvenlik camı'] } },
    kenet: { ad: 'Kenet çatı', a: { t: 'Çatı formu', o: ['Tek eğimli', 'Çift eğimli', 'Mevcut çatıya uyumlu'] }, c: { t: 'Yalıtım', o: ['Isı yalıtımlı standart', 'Ek yalıtım katmanı'] } },
    pergola: { ad: 'Pergola', a: { t: 'Tip', o: ['Bioklimatik (kanatlı)', 'Sabit çatılı'] }, c: { t: 'Yan kapama', o: ['Zip perde', 'Sürme cam', 'Açık'] } },
    dograma: { ad: 'Rehau / alüminyum doğrama', a: { t: 'Malzeme', o: ['Rehau PVC', 'Alüminyum'] }, c: { t: 'Açılım', o: ['Sürme', 'Kaldır-sür', 'Pencere'] } }
  };
  var RENK = [{ k: 'antrasit', ad: 'Antrasit', h: '#3b3f44' }, { k: 'beyaz', ad: 'Beyaz', h: '#f1f1ee' }, { k: 'ahsap', ad: 'Ahşap görünümlü', h: '#8a5a36' }];
  var FOTO = {
    kis: [{ antrasit: 'proje-kisbahcesi-kup2', beyaz: 'proje-beyaz-teras', ahsap: 'proje-ahsap-cephe' }, { antrasit: 'proje-kenet-dis', beyaz: 'proje-beyaz-teras', ahsap: 'proje-ahsap-cephe' }],
    kenet: [{ antrasit: 'proje-kenet-dis', beyaz: 'proje-beyaz-teras', ahsap: 'proje-ahsap-cephe' }, { antrasit: 'proje-kisbahcesi-kup', beyaz: 'proje-beyaz-teras', ahsap: 'proje-ic-salon' }, { antrasit: 'proje-kenet-dis', beyaz: 'proje-beyaz-teras', ahsap: 'proje-ahsap-cephe' }],
    pergola: [{ antrasit: 'pergola-2', beyaz: 'pergola-beyaz', ahsap: 'pergola-1' }, { antrasit: 'pergola-1', beyaz: 'pergola-beyaz', ahsap: 'pergola-2' }],
    dograma: [{ antrasit: 'dograma-surme', beyaz: 'dograma-balkon', ahsap: 'dograma-pencere' }, { antrasit: 'dograma-surme', beyaz: 'cam-balkon', ahsap: 'dograma-pencere' }]
  };
  var ILCE = ['Ataşehir', 'Kadıköy', 'Üsküdar', 'Maltepe', 'Kartal', 'Pendik', 'Ümraniye', 'Çekmeköy', 'Sancaktepe', 'Beykoz (Riva dahil)', 'Sarıyer (İstinye, Zekeriyaköy dahil)', 'Beşiktaş', 'Kâğıthane', 'Başakşehir', 'Beylikdüzü', 'Büyükçekmece', 'Bodrum', 'Almanya / Münih', 'Diğer'];
  M.ILCE = ILCE;
  var ADIM = ['Ürün', 'Ölçü', 'Seçim', 'İlçe', 'Özet'];

  M.wizard = function (host, opt) {
    opt = opt || {};
    var S = { adim: 0, urun: opt.urun || 'kis', en: 4.5, boy: 3, a: 0, c: 0, renk: 'antrasit', ilce: ILCE[0], not: '' };
    host.classList.add('mw-wiz');
    host.innerHTML = '<div class="mw-stage"><img class="mw-foto" alt="Seçiminize yakın Mien Grup uygulaması"><div class="mw-cap"></div><div class="mw-m2"><span>Alan</span><b>0</b></div></div>' +
      '<div class="mw-panel"><ol class="mw-steps"></ol><div class="mw-body"></div><div class="mw-nav"><button type="button" class="mw-b mw-geri">Geri</button><button type="button" class="mw-b mw-ileri">Devam</button></div></div>';
    var img = host.querySelector('.mw-foto'), cap = host.querySelector('.mw-cap'), m2 = host.querySelector('.mw-m2 b'),
      steps = host.querySelector('.mw-steps'), body = host.querySelector('.mw-body'), geri = host.querySelector('.mw-geri'), ileri = host.querySelector('.mw-ileri');
    function alan() { return Math.round(S.en * S.boy * 10) / 10; }
    function foto() {
      var lst = FOTO[S.urun], k = lst[Math.min(S.a, lst.length - 1)][S.renk];
      if (img.getAttribute('data-k') !== k) { img.classList.add('geciyor'); img.setAttribute('data-k', k); var n = new Image(); n.onload = function () { img.src = n.src; img.classList.remove('geciyor'); }; n.src = M.img(k); }
      var u = URUN[S.urun];
      cap.innerHTML = '<b>' + esc(u.ad) + '</b> · ' + esc(u.a.o[S.a]) + ' · ' + esc(RENK.filter(function (r) { return r.k === S.renk; })[0].ad) + '<small>Benzer Mien Grup uygulaması; renk ve ölçü keşifte netleşir.</small>';
      m2.textContent = fmt(alan(), 1) + ' m²';
    }
    function ozet() {
      var u = URUN[S.urun], kw = qkw();
      var t = 'Merhaba, Mien Grup\'tan ' + u.ad.toLowerCase().replace('rehau / alüminyum doğrama', 'doğrama') + ' için keşif talep ediyorum.\n' +
        'Alan: ' + fmt(S.en, 1) + ' m × ' + fmt(S.boy, 1) + ' m (' + fmt(alan(), 1) + ' m²)\n' +
        u.a.t + ': ' + u.a.o[S.a] + '\n' + u.c.t + ': ' + u.c.o[S.c] + '\n' +
        'Renk: ' + RENK.filter(function (r) { return r.k === S.renk; })[0].ad + '\n' +
        'Konum: ' + S.ilce + '\n' + (S.not ? 'Not: ' + S.not + '\n' : '') +
        'Net fiyat için keşif bekliyorum.' + (kw ? '\n(Kaynak: Google reklamı, ' + kw + ')' : '');
      return t;
    }
    function chips(lst, sel, att) {
      return '<div class="mw-opts">' + lst.map(function (x, i) { return '<button type="button" class="mw-opt' + (i === sel ? ' on' : '') + '" data-' + att + '="' + i + '">' + esc(x) + '</button>'; }).join('') + '</div>';
    }
    function render() {
      steps.innerHTML = ADIM.map(function (a, i) { return '<li class="' + (i === S.adim ? 'on' : i < S.adim ? 'ok' : '') + '"><button type="button" data-g="' + i + '"><i>' + (i + 1) + '</i><span>' + a + '</span></button></li>'; }).join('');
      var u = URUN[S.urun], h = '';
      if (S.adim === 0) {
        h = '<h3>Ne yaptırmak istiyorsunuz?</h3><div class="mw-urunler">' + Object.keys(URUN).map(function (k) {
          return '<button type="button" class="mw-urun' + (k === S.urun ? ' on' : '') + '" data-u="' + k + '"><img alt="" src="' + M.img(FOTO[k][0].antrasit) + '"><span>' + esc(URUN[k].ad) + '</span></button>';
        }).join('') + '</div>';
      } else if (S.adim === 1) {
        h = '<h3>Alanın ölçüsü</h3><p class="mw-ipucu">Yaklaşık ölçü yeterli; kesin ölçüyü keşifte alırız.</p>' +
          '<label class="mw-sl">En <b>' + fmt(S.en, 1) + ' m</b><input type="range" min="1" max="14" step="0.1" value="' + S.en + '" data-d="en"></label>' +
          '<label class="mw-sl">Boy <b>' + fmt(S.boy, 1) + ' m</b><input type="range" min="1" max="10" step="0.1" value="' + S.boy + '" data-d="boy"></label>' +
          '<div class="mw-m2big"><span>Toplam alan</span><b id="mw-m2b">' + fmt(alan(), 1) + ' m²</b></div>' +
          '<svg class="mw-plan" viewBox="0 0 280 160" aria-hidden="true"><rect x="10" y="10" width="260" height="140" fill="none" stroke="currentColor" stroke-opacity=".18"/><rect id="mw-r" x="' + (140 - rw() / 2) + '" y="' + (80 - rh() / 2) + '" width="' + rw() + '" height="' + rh() + '" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2"/></svg>';
      } else if (S.adim === 2) {
        h = '<h3>Seçimleriniz</h3><div class="mw-grp"><b>' + u.a.t + '</b>' + chips(u.a.o, S.a, 'a') + '</div><div class="mw-grp"><b>' + u.c.t + '</b>' + chips(u.c.o, S.c, 'c') + '</div>' +
          '<div class="mw-grp"><b>Renk</b><div class="mw-opts">' + RENK.map(function (r) { return '<button type="button" class="mw-opt mw-renk' + (r.k === S.renk ? ' on' : '') + '" data-r="' + r.k + '"><i style="background:' + r.h + '"></i>' + r.ad + '</button>'; }).join('') + '</div></div>' +
          '<p class="mw-ipucu">Soldaki fotoğraf seçiminize göre değişir.</p>';
      } else if (S.adim === 3) {
        h = '<h3>Nerede?</h3><label class="mw-sel">İlçe / bölge<select data-i>' + ILCE.map(function (x) { return '<option' + (x === S.ilce ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></label>' +
          '<label class="mw-sel">Eklemek istediğiniz not (isteğe bağlı)<input type="text" maxlength="90" data-n value="' + esc(S.not) + '" placeholder="Örnek: villa, bahçe katı, kış öncesi"></label>';
      } else {
        h = '<h3>WhatsApp\'a hazır özet</h3><pre class="mw-ozet">' + esc(ozet()) + '</pre>' +
          '<div class="mw-son"><a class="mw-b mw-wa" target="_blank" rel="noopener" href="' + waLink(ozet()) + '">WhatsApp\'ta gönder</a><button type="button" class="mw-b mw-kop">Metni kopyala</button><a class="mw-b mw-ara" href="tel:' + M.tel + '">Ara</a></div>' +
          '<p class="mw-fiyat"><b>Fiyat:</b> keşif sonrası net fiyat verilir; bu ekranda fiyat gösterilmez.</p>';
      }
      body.innerHTML = h;
      geri.style.visibility = S.adim ? 'visible' : 'hidden';
      ileri.style.display = S.adim === 4 ? 'none' : '';
      foto(); bind();
    }
    function rw() { return Math.round(40 + S.en / 14 * 200); }
    function rh() { return Math.round(24 + S.boy / 10 * 110); }
    function bind() {
      [].forEach.call(steps.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { S.adim = +b.getAttribute('data-g'); render(); }; });
      [].forEach.call(body.querySelectorAll('[data-u]'), function (b) { b.onclick = function () { S.urun = b.getAttribute('data-u'); S.a = 0; S.c = 0; render(); }; });
      [].forEach.call(body.querySelectorAll('[data-a]'), function (b) { b.onclick = function () { S.a = +b.getAttribute('data-a'); render(); }; });
      [].forEach.call(body.querySelectorAll('[data-c]'), function (b) { b.onclick = function () { S.c = +b.getAttribute('data-c'); render(); }; });
      [].forEach.call(body.querySelectorAll('[data-r]'), function (b) { b.onclick = function () { S.renk = b.getAttribute('data-r'); render(); }; });
      [].forEach.call(body.querySelectorAll('[data-d]'), function (inp) {
        inp.oninput = function () {
          S[inp.getAttribute('data-d')] = +inp.value; inp.parentNode.querySelector('b').textContent = fmt(+inp.value, 1) + ' m';
          var big = body.querySelector('#mw-m2b'); if (big) big.textContent = fmt(alan(), 1) + ' m²';
          m2.textContent = fmt(alan(), 1) + ' m²';
          var r = body.querySelector('#mw-r'); if (r) { r.setAttribute('x', 140 - rw() / 2); r.setAttribute('y', 80 - rh() / 2); r.setAttribute('width', rw()); r.setAttribute('height', rh()); }
        };
      });
      var si = body.querySelector('[data-i]'); if (si) si.onchange = function () { S.ilce = si.value; };
      var sn = body.querySelector('[data-n]'); if (sn) sn.oninput = function () { S.not = sn.value; };
      var wa = body.querySelector('.mw-wa'); if (wa) wa.onclick = function () { track('whatsapp_tikla', { kaynak: 'kesif_sihirbazi', urun: S.urun, m2: alan() }); };
      var ar = body.querySelector('.mw-ara'); if (ar) ar.onclick = function () { track('arama_tikla', { kaynak: 'kesif_sihirbazi' }); };
      var kp = body.querySelector('.mw-kop'); if (kp) kp.onclick = function () {
        var t = ozet(); try { navigator.clipboard.writeText(t).then(function () { toast('Mesaj kopyalandı'); }, function () { toast('Kopyalanamadı; metni seçip kopyalayın'); }); } catch (e) { toast('Kopyalanamadı; metni seçip kopyalayın'); }
        track('kesif_formu', { urun: S.urun, m2: alan() });
      };
    }
    geri.onclick = function () { if (S.adim > 0) { S.adim--; render(); } };
    ileri.onclick = function () { if (S.adim < 4) { S.adim++; render(); } };
    var api = { S: S, set: function (o) { for (var k in o) { S[k] = o[k]; } if (o.urun) { S.a = 0; S.c = 0; } render(); }, render: render };
    M._wiz = api; render(); return api;
  };

  /* ---------- önce / sonra kaydırıcı ---------- */
  var OS = [
    { ad: 'Cam çatılı kış bahçesi', once: 'proje-kisbahcesi-kup-taslak', sonra: 'proje-kisbahcesi-kup' },
    { ad: 'Kenet çatılı kış bahçesi', once: 'proje-kenet-dis-taslak', sonra: 'proje-kenet-dis' },
    { ad: 'İç mekân: cam tavanlı oturma alanı', once: 'proje-ic-masa-taslak', sonra: 'proje-ic-masa' },
    { ad: 'Ahşap cepheli geniş cam uygulama', once: 'proje-ahsap-cephe-taslak', sonra: 'proje-ahsap-cephe' }
  ];
  M.slider = function (host) {
    host.classList.add('mw-os'); var i = 0;
    host.innerHTML = '<div class="mw-os-tabs"></div><div class="mw-os-box"><img class="s" alt="Tamamlanan uygulama"><div class="mw-os-top"><img class="o" alt="Proje taslağı"></div><div class="mw-os-line"><span></span></div>' +
      '<em class="mw-l1">Taslak</em><em class="mw-l2">Tamamlanan uygulama</em></div><input class="mw-os-r" type="range" min="0" max="100" value="50" aria-label="Önce ve sonra kaydırıcısı"><p class="mw-not">Taslak görünüm, aynı kareden üretilmiş çizim gösterimidir; gerçek proje fotoğrafı sağdadır.</p>';
    var tabs = host.querySelector('.mw-os-tabs'), box = host.querySelector('.mw-os-box'), top = host.querySelector('.mw-os-top'), line = host.querySelector('.mw-os-line'), r = host.querySelector('.mw-os-r');
    OS.forEach(function (x, k) { var b = el('<button type="button">' + esc(x.ad) + '</button>'); tabs.appendChild(b); b.onclick = function () { i = k; load(); }; });
    function pos(v) { top.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)'; line.style.left = v + '%'; r.value = v; }
    function load() { host.querySelector('.s').src = M.img(OS[i].sonra); host.querySelector('.o').src = M.img(OS[i].once); [].forEach.call(tabs.children, function (b, k) { b.classList.toggle('on', k === i); }); pos(50); }
    r.oninput = function () { pos(+r.value); };
    var drag = false;
    function mv(e) { var b = box.getBoundingClientRect(), x = (e.touches ? e.touches[0].clientX : e.clientX); pos(Math.max(0, Math.min(100, (x - b.left) / b.width * 100))); }
    box.addEventListener('pointerdown', function (e) { drag = true; try { box.setPointerCapture(e.pointerId); } catch (x) {} mv(e); });
    box.addEventListener('pointermove', function (e) { if (drag) mv(e); });
    box.addEventListener('pointerup', function () { drag = false; });
    load();
  };

  /* ---------- dört mevsim ---------- */
  var MEV = [
    { k: 'yaz', ad: 'Yaz', t: 'Gün ışığı içeri girer, sürme cam açılınca bahçe ile oda tek alan olur.', f: 'mevsim-yaz' },
    { k: 'kis', ad: 'Kış', t: 'Isı yalıtımlı cam ve profil sayesinde dışarıdaki kar, içeride oturma alanını bölmez.', f: 'mevsim-kis' },
    { k: 'yagmur', ad: 'Yağmur', t: 'Kapalı çatı altında yağmuru izleyerek oturmak: alan hava durumundan bağımsız kullanılır.', f: 'mevsim-yagmur' },
    { k: 'gece', ad: 'Gece', t: 'Cam çatıdan gökyüzü, içeride aydınlatma: akşam saatlerinde ikinci salon gibi kullanılır.', f: 'mevsim-gece' }
  ];
  M.mevsim = function (host) {
    host.classList.add('mw-mev');
    host.innerHTML = '<div class="mw-mev-img">' + MEV.map(function (m) { return '<img data-k="' + m.k + '" alt="' + m.ad + ' görünümü" src="' + M.img(m.f) + '">'; }).join('') + '<span class="mw-mev-et"></span></div>' +
      '<div class="mw-mev-b"><div class="mw-mev-tabs"></div><p class="mw-mev-t"></p><p class="mw-not">Görseller yapay zekâ ile oluşturulmuş, aynı kış bahçesini dört mevsimde gösteren örnek görselleştirmedir; gerçek proje fotoğrafı değildir.</p></div>';
    var tabs = host.querySelector('.mw-mev-tabs'), imgs = host.querySelectorAll('.mw-mev-img img'), t = host.querySelector('.mw-mev-t'), et = host.querySelector('.mw-mev-et');
    MEV.forEach(function (m, i) { var b = el('<button type="button" data-k="' + m.k + '">' + m.ad + '</button>'); tabs.appendChild(b); b.onclick = function () { go(i); }; });
    function go(i) { [].forEach.call(imgs, function (im, k) { im.classList.toggle('on', k === i); }); [].forEach.call(tabs.children, function (b, k) { b.classList.toggle('on', k === i); }); t.textContent = MEV[i].t; et.textContent = MEV[i].ad + ' · örnek görselleştirme'; }
    go(0);
  };

  /* ---------- Rehau karşılaştırıcı ---------- */
  var RH = [
    { k: 'ed70', ad: 'Euro Design 70', ozet: 'Konutlar için dengeli, yaygın kullanılan seri', ne: 'Bütçe ve performans dengesi aranan standart yenileme ve yeni yapı', cam: 'Çift cam ısıcam', gor: 'Klasik, sade çizgi', sec: 'Denge' },
    { k: 'syn', ad: 'Synego', ozet: 'Yalıtım ve konforu öne çıkaran seri', ne: 'Isı ve ses konforunu önemseyen konutlar', cam: 'Çift cam ve üç cam seçenekleri', gor: 'Modern, dengeli çizgi', sec: 'Yalıtım' },
    { k: 'gen', ad: 'Geneo', ozet: 'Üst seviye yalıtım hedefleyen premium seri', ne: 'Enerji verimliliğini ön plana alan, yüksek beklentili projeler', cam: 'Üç cam dahil ileri seçenekler', gor: 'Modern, ince çizgi', sec: 'Yalıtım' },
    { k: 'art', ad: 'Artevo', ozet: 'Estetik ve sade görünümü öne çıkaran seri', ne: 'Görünümün öncelikli olduğu mimari projeler', cam: 'Çift cam ısıcam, projeye göre seçenek', gor: 'Sade, mimari çizgi', sec: 'Görünüm' }
  ];
  var ONC = ['Yalıtım', 'Görünüm', 'Bütçe', 'Denge'];
  M.rehau = function (host) {
    host.classList.add('mw-rh'); var onc = 'Yalıtım', A = 'syn', B = 'gen';
    function sel(id, v) { return '<select data-w="' + id + '">' + RH.map(function (r) { return '<option value="' + r.k + '"' + (r.k === v ? ' selected' : '') + '>' + r.ad + '</option>'; }).join('') + '</select>'; }
    function oneri() { var m = { 'Yalıtım': ['gen', 'syn'], 'Görünüm': ['art'], 'Bütçe': ['ed70'], 'Denge': ['syn', 'ed70'] }[onc]; return m.map(function (k) { return RH.filter(function (r) { return r.k === k; })[0].ad; }).join(' / '); }
    function draw() {
      var a = RH.filter(function (r) { return r.k === A; })[0], b = RH.filter(function (r) { return r.k === B; })[0];
      host.innerHTML = '<div class="mw-rh-on"><b>Önceliğiniz</b>' + ONC.map(function (o) { return '<button type="button" class="' + (o === onc ? 'on' : '') + '" data-o="' + o + '">' + o + '</button>'; }).join('') + '</div>' +
        '<p class="mw-rh-oneri">Ön eşleştirme: <b>' + oneri() + '</b> <small>(keşifte örnek profil üzerinde teyit edilir)</small></p>' +
        '<div class="mw-rh-t" role="table"><div class="mw-r h"><span></span><span>' + sel('a', A) + '</span><span>' + sel('b', B) + '</span></div>' +
        row('Genel yaklaşım', a.ozet, b.ozet) + row('Nerelerde uygun', a.ne, b.ne) + row('Cam seçenekleri', a.cam, b.cam) + row('Görünüm', a.gor, b.gor) +
        row('Profil malzemesi', 'PVC (Rehau)', 'PVC (Rehau); alüminyum doğrama ayrı seçenek') + row('Net teknik değerler', 'Üretici belgesiyle keşif sonrası teklifte yazılır', 'Üretici belgesiyle keşif sonrası teklifte yazılır') + '</div>' +
        '<p class="mw-not">Bu tablo genel nitelikleri anlatır; teknik değerler (yalıtım katsayısı, profil ölçüsü vb.) bu sayfada verilmez.</p>';
      [].forEach.call(host.querySelectorAll('[data-o]'), function (x) { x.onclick = function () { onc = x.getAttribute('data-o'); var f = { 'Yalıtım': ['syn', 'gen'], 'Görünüm': ['art', 'syn'], 'Bütçe': ['ed70', 'syn'], 'Denge': ['ed70', 'syn'] }[onc]; A = f[0]; B = f[1]; draw(); }; });
      [].forEach.call(host.querySelectorAll('[data-w]'), function (x) { x.onchange = function () { if (x.getAttribute('data-w') === 'a') A = x.value; else B = x.value; draw(); }; });
    }
    function row(t, a, b) { return '<div class="mw-r"><span class="k">' + t + '</span><span>' + esc(a) + '</span><span>' + esc(b) + '</span></div>'; }
    draw();
  };

  /* ---------- proje haritası ---------- */
  var PR = [
    { id: 'riva', ad: 'Düşler Vadisi, Riva', yer: 'Beykoz / İstanbul', lat: 41.1900, lon: 29.2200, tur: 'Kış bahçesi, kenet çatı, pergola ve zip perde, cam korkuluk, otomatik açılır kuranglez', not: 'Düşler Vadisi\'nde yıllardır birçok proje gerçekleştirdik; uygulamaların çoğu Instagram\'da paylaşıldı.', reel: 'DeI9fEsiYY-', foto: 'proje-kenet-dis' },
    { id: 'istinye', ad: 'Nidapark İstinye', yer: 'Sarıyer / İstanbul', lat: 41.1130, lon: 29.0530, tur: 'Proje', not: 'Proje ayrıntısı müşteri onayıyla eklenir.', foto: 'proje-ic-masa' },
    { id: 'oliva', ad: 'Oliva, Sarıyer', yer: 'Sarıyer / İstanbul', lat: 41.1500, lon: 29.0550, tur: 'Proje', not: 'Konum yaklaşıktır; kesin adres müşteri onayıyla eklenir.', foto: 'proje-ic-salon' },
    { id: 'nef', ad: 'Nef Çekmeköy', yer: 'Çekmeköy / İstanbul', lat: 41.0330, lon: 29.2000, tur: 'Proje', not: 'Proje ayrıntısı müşteri onayıyla eklenir.', foto: 'proje-ahsap-cephe' },
    { id: 'ofis', ad: 'Mien Grup, ofis', yer: 'Mevlana Mah., Ataşehir / İstanbul', lat: 40.9864, lon: 29.1550, tur: 'Keşif ekibinin çıkış noktası', not: 'Mine Sk. No:11/A', foto: 'proje-kisbahcesi-kup', ofis: true }
  ];
  var DIS = [
    { id: 'bodrum', ad: 'Bodrum', yer: 'Muğla', lat: 37.0344, lon: 27.4305, tur: 'Proje', not: 'Proje ayrıntısı müşteri onayıyla eklenir.', foto: 'pergola-2' },
    { id: 'munih', ad: 'Münih', yer: 'Almanya', lat: 48.1351, lon: 11.5820, tur: 'Yurt dışı proje', not: 'Almanya\'da da kurulum yapılıyor; Almanca karşılama sayfası teklifin ekstrasıdır.', foto: 'proje-beyaz-teras' }
  ];
  var KONUMSUZ = ['Ardıçlı Göl', 'Kerpe (kenet çatı)'];
  function proj(lon, lat, b) { return [(lon - b.x0) / (b.x1 - b.x0) * b.w, (1 - (lat - b.y0) / (b.y1 - b.y0)) * b.h]; }
  M.harita = function (host) {
    host.classList.add('mw-map');
    var bi = { x0: 28.55, x1: 29.5, y0: 40.85, y1: 41.32, w: 640, h: 420 };
    var bd = { x0: 8, x1: 31, y0: 36, y1: 50, w: 640, h: 420 };
    var tab = 'ist', sec = PR[0];
    function pts(arr, b) { return arr.map(function (p) { var q = proj(p.lon, p.lat, b); return '<g class="mw-pin' + (p.ofis ? ' ofis' : '') + (sec.id === p.id ? ' on' : '') + '" data-p="' + p.id + '" transform="translate(' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + ')" tabindex="0" role="button" aria-label="' + esc(p.ad) + '"><circle r="16" class="h"/><circle r="7" class="d"/><text y="-14">' + esc(p.ad.split(',')[0]) + '</text></g>'; }).join(''); }
    function svgIst() {
      /* Boğaz, Karadeniz ve Marmara kıyısının sadeleştirilmiş çizimi (yaklaşık) */
      var L = function (lon, lat) { var q = proj(lon, lat, bi); return q[0].toFixed(1) + ',' + q[1].toFixed(1); };
      var karadeniz = 'M0,0 L640,0 L640,' + proj(0, 41.17, bi)[1].toFixed(1) + ' L' + L(29.35, 41.17) + ' L' + L(29.2, 41.2) + ' L' + L(29.12, 41.21) + ' L' + L(29.05, 41.20) + ' L' + L(28.95, 41.19) + ' L' + L(28.8, 41.1) + ' L' + L(28.7, 41.05) + ' L' + L(28.55, 41.03) + ' L0,' + proj(0, 41.0, bi)[1].toFixed(1) + ' Z';
      var bogaz = 'M' + L(29.115, 41.21) + ' L' + L(29.06, 41.12) + ' L' + L(29.03, 41.06) + ' L' + L(29.0, 41.02) + ' L' + L(28.985, 41.01) + ' L' + L(29.0, 41.0) + ' L' + L(29.02, 41.02) + ' L' + L(29.045, 41.06) + ' L' + L(29.08, 41.12) + ' L' + L(29.13, 41.205) + ' Z';
      var marmara = 'M0,' + proj(0, 40.96, bi)[1].toFixed(1) + ' L' + L(28.7, 40.98) + ' L' + L(28.85, 40.97) + ' L' + L(28.98, 41.0) + ' L' + L(29.0, 41.0) + ' L' + L(29.05, 40.985) + ' L' + L(29.1, 40.96) + ' L' + L(29.2, 40.9) + ' L' + L(29.3, 40.88) + ' L' + L(29.4, 40.85) + ' L640,' + proj(0, 40.85, bi)[1] + ' L640,640 L0,640 Z';
      return '<svg viewBox="0 0 640 420" class="mw-svg" role="img" aria-label="İstanbul proje haritası (sadeleştirilmiş)"><rect width="640" height="420" class="kara"/><path d="' + karadeniz + '" class="su"/><path d="' + bogaz + '" class="su"/><path d="' + marmara + '" class="su"/>' +
        '<text x="320" y="26" class="su-t">KARADENİZ</text><text x="300" y="404" class="su-t">MARMARA</text><text x="120" y="250" class="il-t">AVRUPA YAKASI</text><text x="500" y="330" class="il-t">ANADOLU YAKASI</text>' + pts(PR, bi) + '</svg>';
    }
    function svgDis() {
      var a = proj(29.155, 40.9864, bd), m = proj(11.582, 48.1351, bd), b = proj(27.4305, 37.0344, bd);
      return '<svg viewBox="0 0 640 420" class="mw-svg" role="img" aria-label="Türkiye ve Almanya proje konumları (şematik)"><rect width="640" height="420" class="su"/>' +
        '<g class="izgara">' + [10, 15, 20, 25, 30].map(function (x) { var p = proj(x, 36, bd); return '<line x1="' + p[0] + '" y1="0" x2="' + p[0] + '" y2="420"/>'; }).join('') + [38, 42, 46, 50].map(function (y) { var p = proj(8, y, bd); return '<line x1="0" y1="' + p[1] + '" x2="640" y2="' + p[1] + '"/>'; }).join('') + '</g>' +
        '<path d="M' + a[0] + ',' + a[1] + ' Q' + (a[0] + m[0]) / 2 + ',' + (m[1] - 20) + ' ' + m[0] + ',' + m[1] + '" class="rota"/>' +
        '<text x="22" y="404" class="il-t">Şematik gösterim, harita ölçekli değildir</text>' +
        '<g class="mw-pin ofis' + (sec.id === 'ofis' ? ' on' : '') + '" data-p="ofis" transform="translate(' + a[0] + ' ' + a[1] + ')" tabindex="0" role="button" aria-label="İstanbul"><circle r="16" class="h"/><circle r="7" class="d"/><text y="-14">İstanbul</text></g>' + pts(DIS, bd) + '</svg>';
    }
    function card() {
      var p = sec;
      return '<div class="mw-pc"><img alt="' + esc(p.ad) + '" src="' + M.img(p.foto) + '"><div><small>' + esc(p.yer) + '</small><h4>' + esc(p.ad) + '</h4><p><b>Uygulama:</b> ' + esc(p.tur) + '</p><p>' + esc(p.not) + '</p>' +
        (p.reel ? '<a class="mw-lnk" target="_blank" rel="noopener" href="https://www.instagram.com/reel/' + p.reel + '/">Instagram\'da gör</a>' : '') + '<small class="mw-not">Fotoğraf: Mien Grup uygulaması (örnek).</small></div></div>';
    }
    function draw() {
      host.innerHTML = '<div class="mw-map-tabs"><button type="button" class="' + (tab === 'ist' ? 'on' : '') + '" data-t="ist">İstanbul</button><button type="button" class="' + (tab === 'dis' ? 'on' : '') + '" data-t="dis">Bodrum ve Münih</button></div>' +
        '<div class="mw-map-in"><div class="mw-map-svg">' + (tab === 'ist' ? svgIst() : svgDis()) + '</div>' + '<div class="mw-map-card">' + card() + '</div></div>' +
        '<p class="mw-not">Konumlar ilçe düzeyinde yaklaşıktır, müşteri adresi paylaşılmaz. Konumu henüz işlenmeyen projeler: ' + KONUMSUZ.join(', ') + '.</p>';
      [].forEach.call(host.querySelectorAll('[data-t]'), function (b) { b.onclick = function () { tab = b.getAttribute('data-t'); sec = tab === 'ist' ? PR[0] : DIS[1]; draw(); }; });
      [].forEach.call(host.querySelectorAll('[data-p]'), function (g) {
        var f = function () { var id = g.getAttribute('data-p'); sec = PR.concat(DIS).filter(function (x) { return x.id === id; })[0]; draw(); };
        g.onclick = f; g.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } };
      });
    }
    draw();
  };

  /* ---------- Instagram gömme ---------- */
  M.REELS = ['DRTlIT_ggZ-', 'DeI9fEsiYY-', 'DdMVfN8icFq', 'Dd9f35GxpRM', 'Dc9Z9W-RH7n', 'DZYAmejxx5F', 'Ddb6mrRqkQS', 'DQLlboOgs9P', 'Dc2l0XaCbf7', 'DbyszSWxZwY'];
  M.ig = function (host, codes) {
    host.classList.add('mw-ig'); codes = codes || (host.getAttribute('data-ig') || '').split(',').filter(Boolean);
    host.innerHTML = codes.map(function (c) {
      return '<figure class="mw-igc"><iframe loading="lazy" title="Instagram gönderisi" src="https://www.instagram.com/reel/' + c + '/embed/" allowtransparency="true" scrolling="no"></iframe>' +
        '<noscript></noscript><a class="mw-lnk" target="_blank" rel="noopener" href="https://www.instagram.com/reel/' + c + '/">Instagram\'da aç</a></figure>';
    }).join('');
  };

  /* ---------- 360° sokak görünümü ---------- */
  M.sokak = function (host) {
    host.classList.add('mw-sv'); var s = M.sv;
    host.innerHTML = '<div class="mw-sv-f"><iframe loading="lazy" title="Mevlana Mah. Mine Sk. Ataşehir 360 derece sokak görünümü" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?layer=c&cbll=' + s.lat + ',' + s.lon + '&cbp=12,0,0,0,0&output=svembed"></iframe></div>' +
      '<p class="mw-sv-a"><b>Mien Grup</b> · ' + esc(M.adres) + '</p><p class="mw-not">Sokak görünümü bölgenin yaklaşık konumundan açılır; tam adres işareti hesaba erişimle doğrulanır. İnternet bağlantısı gerekir.</p>' +
      '<div class="mw-sv-b"><a class="mw-lnk" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Mine Sk. No:11/A Ataşehir İstanbul') + '">Google Haritalar\'da aç</a>' +
      '<a class="mw-lnk" target="_blank" rel="noopener" href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + s.lat + ',' + s.lon + '">360° tam ekran</a></div>';
  };

  /* ---------- WhatsApp / ara bağlantıları ---------- */
  function links() {
    [].forEach.call(document.querySelectorAll('[data-mw-wa]'), function (a) {
      var t = a.getAttribute('data-mw-wa') || 'Merhaba, Mien Grup\'tan keşif talep ediyorum.'; var kw = qkw(); if (kw) t += '\n(Kaynak: Google reklamı, ' + kw + ')';
      a.href = waLink(t); a.target = '_blank'; a.rel = 'noopener'; a.addEventListener('click', function () { track('whatsapp_tikla', { kaynak: a.getAttribute('data-src') || 'sayfa' }); });
    });
    [].forEach.call(document.querySelectorAll('[data-mw-tel]'), function (a) { a.href = 'tel:' + M.tel; a.addEventListener('click', function () { track('arama_tikla', { kaynak: a.getAttribute('data-src') || 'sayfa' }); }); });
  }

  M.init = function () {
    [].forEach.call(document.querySelectorAll('[data-mw]'), function (h) {
      var n = h.getAttribute('data-mw');
      if (n === 'wizard') M.wizard(h, { urun: h.getAttribute('data-urun') || 'kis' });
      else if (M[n]) M[n](h);
    });
    links();
    /* demo bandı sihirbazdan sonra oluşsa da kampanya ürününü uygula */
    var k = qkw(); if (KW[k] && M._wiz) M._wiz.set({ urun: KW[k].urun });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', M.init); else M.init();
})();
