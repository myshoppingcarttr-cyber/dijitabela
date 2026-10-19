/* Doruk Kuyumculuk · Dijitabela prototip — ortak özellik modülleri (3 yerleşim de bunları kullanır)
   Hepsi statik ve internetsiz açılır; yalnızca altın kuru, Instagram gömme ve harita çevrimiçi iken canlıdır. */
(function () {
  'use strict';
  var V = window.DK_VERI;
  var DK = window.DK = { veri: V, urunler: V.urunler, state: { kur: null, secili: null } };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  DK.$ = $; DK.$$ = $$;
  var uid = 0;
  function nid(p) { return (p || 'dk') + (++uid); }
  function tl(n, d) { return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 0 : d }) + ' TL'; }
  function num(n, d) { return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 0 : d }); }
  DK.tl = tl; DK.num = num;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem('dk_' + k); localStorage.setItem('dk_' + k, v); } catch (e) { return null; } }
  DK.store = store;
  DK.byId = function (id) { return DK.urunler.filter(function (p) { return p.id === id; })[0]; };
  DK.KAT = { yuzuk: 'Yüzük', kolye: 'Kolye', bileklik: 'Bileklik', kelepce: 'Kelepçe', kupe: 'Küpe', charm: 'Charm' };
  DK.HAT = '+90 212 433 11 64';
  DK.WA = function (msg) { return 'https://wa.me/?text=' + encodeURIComponent(msg); };

  /* ---------- Altın kuru ---------- */
  var KUR_ETIKET = 'örnek kur · ' + V.kurTarih;
  function kurOrnek() {
    return { k24: V.kur0['24'], k18: V.kur0['18'], k14: V.kur0['14'], canli: false, kaynak: 'örnek kur · ' + V.kurTarih };
  }
  DK.state.kur = kurOrnek();
  DK.kurAyar = function (ayar) {
    var k = DK.state.kur;
    if (ayar === 14) return k.k14; if (ayar === 18) return k.k18; if (ayar === 24) return k.k24;
    return k.k24 * ayar / 24;
  };
  DK.fiyat = function (p) { return p.gr * DK.kurAyar(p.ayar) + p.isc; };
  DK.kurYukle = function () {
    if (DK._kp) return DK._kp;
    DK._kp = new Promise(function (res) {
      if (!window.fetch || location.protocol === 'about:') return res();
      var deneme = 0;
      (function al() {
      var ac = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ac) ac.abort(); }, 4500);
      fetch('https://finans.truncgil.com/today.json', ac ? { signal: ac.signal } : {}).then(function (r) { return r.json(); }).then(function (d) {
        clearTimeout(t);
        function g(k) { return parseFloat(String(d[k]['Satış']).replace(/\./g, '').replace(',', '.')); }
        var k24 = g('gram-altin'), k14 = g('14-ayar-altin'), k18 = g('18-ayar-altin');
        if (k24 > 100 && k14 > 100) {
          DK.state.kur = { k24: k24, k14: k14, k18: k18, canli: true, kaynak: 'canlı kur · ' + (d.Update_Date || '') };
        }
        res();
      }).catch(function () { clearTimeout(t); if (++deneme < 3) setTimeout(al, 700); else res(); });
      })();
    }).then(function () { document.dispatchEvent(new CustomEvent('dk-kur')); });
    return DK._kp;
  };
  DK.kurRozet = function (el) {
    function yaz() {
      var k = DK.state.kur;
      el.innerHTML = '<span class="dk-dot ' + (k.canli ? 'on' : '') + '"></span> 14 ayar gram altın <b>' + num(k.k14, 2) + ' TL</b> <i>' + esc(k.kaynak) + '</i>';
      el.title = k.canli ? 'Herkese açık ücretsiz bir kaynaktan çekildi.' : 'Kaynağa ulaşılamadı ya da internet yok: sabit örnek kur gösteriliyor.';
    }
    yaz(); document.addEventListener('dk-kur', yaz);
  };

  /* ---------- Ürün kartı / modal ---------- */
  DK.urunKart = function (p, extra) {
    return '<button class="dk-kart" data-id="' + p.id + '" aria-label="' + esc(p.ad) + '"><span class="dk-kimg"><img loading="lazy" src="' + p.cut + '" alt="' + esc(p.ad) + '"></span>' +
      '<span class="dk-kad">' + esc(p.ad) + '</span><span class="dk-kalt">' + (p.kod ? 'Model ' + esc(p.kod) + ' · ' : '') + DK.KAT[p.kat] + '</span>' +
      '<span class="dk-kfy">' + tl(p.fiyat) + '</span>' + (extra || '') + '</button>';
  };
  DK.modal = function (id) {
    var p = DK.byId(id); if (!p) return;
    DK.state.secili = p.id;
    var m = document.createElement('div'); m.className = 'dk-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    var kf = DK.fiyat(p);
    m.innerHTML = '<div class="dk-mback"></div><div class="dk-mbox"><button class="dk-mkapat" aria-label="Kapat">×</button>' +
      '<div class="dk-mimg"><img src="' + p.cut + '" alt="' + esc(p.ad) + '"></div><div class="dk-minfo">' +
      '<small>' + esc(p.marka) + ' · ' + esc(p.kol) + '</small><h3>' + esc(p.ad) + '</h3>' +
      (p.kod ? '<p class="dk-mkod">Model kodu ' + esc(p.kod) + ' · 14 ayar · ' + num(p.gr, 2) + ' gr</p>' : '<p class="dk-mkod">14 ayar · ' + num(p.gr, 2) + ' gr</p>') +
      '<div class="dk-mfy">' + tl(p.fiyat) + ' <em>sitedeki fiyat · örnek</em></div>' +
      '<div class="dk-mkur">Bugünkü kurla hesap: <b>' + tl(kf) + '</b> <i>(' + num(p.gr, 2) + ' gr × ' + num(DK.kurAyar(p.ayar), 2) + ' + işçilik/taş ' + tl(p.isc) + ')</i><br><small>' + esc(DK.state.kur.kaynak) + '</small></div>' +
      '<div class="dk-mbtn"><button data-a="gor" class="dk-b">Üzerinde gör</button><button data-a="taksit" class="dk-b">Taksit</button><button data-a="rez" class="dk-b dk-b1">Mağazada gör / ayırt</button></div>' +
      '<p class="dk-not">Fiyat ve fotoğraf, mevcut sitenin 19 Ekim 2026 görünümünden alınmış örnektir.</p></div></div>';
    document.body.appendChild(m); document.body.classList.add('dk-kilit');
    function kapat() { m.remove(); document.body.classList.remove('dk-kilit'); document.removeEventListener('keydown', kl); }
    function kl(e) { if (e.key === 'Escape') kapat(); }
    document.addEventListener('keydown', kl);
    $('.dk-mback', m).onclick = kapat; $('.dk-mkapat', m).onclick = kapat;
    $$('[data-a]', m).forEach(function (b) { b.onclick = function () { kapat(); document.dispatchEvent(new CustomEvent('dk-git', { detail: { arac: b.getAttribute('data-a'), id: p.id } })); }; });
  };
  document.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('.dk-kart'); if (k) { e.preventDefault(); DK.modal(k.getAttribute('data-id')); }
  });

  function urunSecenek(sel) {
    return DK.urunler.map(function (p, i) { return '<option value="' + p.id + '"' + (p.id === sel ? ' selected' : '') + '>' + esc(p.ad) + (p.kod ? ' · ' + p.kod : '') + ' — ' + tl(p.fiyat) + '</option>'; }).join('');
  }

  /* ---------- 1. Fiyat hesaplayıcı: gram × ayar × işçilik ---------- */
  DK.fiyatHesap = function (el) {
    var p0 = DK.byId(DK.state.secili) || DK.byId('cetas-olivia-bileklik');
    el.classList.add('dk-w');
    el.innerHTML = '<div class="dk-row"><label>Ürün<select class="f-urun">' + urunSecenek(p0.id) + '</select></label></div>' +
      '<div class="dk-grid4"><label>Gram<input class="f-gr" type="number" step="0.01" min="0.1"></label>' +
      '<label>Ayar<select class="f-ayar"><option>8</option><option selected>14</option><option>18</option><option>22</option><option>24</option></select></label>' +
      '<label>İşçilik + taş (TL)<input class="f-isc" type="number" step="50" min="0"></label>' +
      '<label>Kur senaryosu <b class="f-sv">0%</b><input class="f-sen" type="range" min="-10" max="10" step="1" value="0"></label></div>' +
      '<div class="dk-kurline"></div>' +
      '<div class="dk-result"><div class="dk-big f-top">—</div><div class="dk-break f-brk"></div></div>' +
      '<div class="dk-two"><div><small>Sitedeki fiyat (örnek)</small><b class="f-site">—</b></div><div><small>Senaryo farkı</small><b class="f-fark">—</b></div></div>' +
      '<p class="dk-not">Fiyat = gram × güncel gram altın (ayara göre) + işçilik/taş. Gram ve ayar, ürünün sitedeki bilgisidir; işçilik + taş payı, sitedeki fiyattan geriye doğru hesaplanan örnek değerdir. Panelde kur değişince bütün katalog tek tuşla yeniden hesaplanır.</p>';
    var R = function (s) { return $(s, el); };
    function yukle() {
      var p = DK.byId(R('.f-urun').value); DK.state.secili = p.id;
      R('.f-gr').value = p.gr; R('.f-ayar').value = p.ayar; R('.f-isc').value = Math.round(p.isc); hesap();
    }
    function hesap() {
      var p = DK.byId(R('.f-urun').value), gr = parseFloat(R('.f-gr').value) || 0, ay = parseInt(R('.f-ayar').value, 10), isc = parseFloat(R('.f-isc').value) || 0;
      var sen = parseInt(R('.f-sen').value, 10); R('.f-sv').textContent = (sen > 0 ? '+' : '') + sen + '%';
      var kur = DK.kurAyar(ay) * (1 + sen / 100), altin = gr * kur, top = altin + isc;
      R('.f-top').textContent = tl(top);
      R('.f-brk').innerHTML = '<span>Altın bedeli <b>' + tl(altin) + '</b><i>' + num(gr, 2) + ' gr × ' + num(kur, 2) + ' TL</i></span><span>İşçilik + taş <b>' + tl(isc) + '</b></span>' +
        '<div class="dk-bar"><u style="width:' + Math.min(100, altin / top * 100) + '%"></u></div>';
      R('.f-site').textContent = tl(p.fiyat);
      var f = top - p.fiyat; R('.f-fark').textContent = (f >= 0 ? '+' : '−') + tl(Math.abs(f));
    }
    R('.f-urun').onchange = yukle;
    $$('input,select', el).forEach(function (i) { if (!i.classList.contains('f-urun')) i.oninput = hesap; });
    DK.kurRozet(R('.dk-kurline'));
    document.addEventListener('dk-kur', hesap);
    el.dkSet = function (id) { R('.f-urun').value = id; yukle(); };
    yukle();
  };

  /* ---------- 2. Yüzük ölçüsü bulucu ---------- */
  DK.yuzukOlcu = function (el) {
    el.classList.add('dk-w');
    var kayitli = parseFloat(store('pxmm')) || 0;
    el.innerHTML = '<ol class="dk-steps"><li class="on">1 · Ekranı kalibre et</li><li>2 · Yüzüğü ölç</li><li>3 · Ölçü tablosu</li></ol>' +
      '<div class="dk-pane p1"><p>Bir <b>kredi kartını</b> (85,6 × 54 mm) ekrana yapıştırın ve kaydırıcıyı kart kenarlarına tam oturana dek ayarlayın.</p>' +
      '<div class="dk-cardwrap"><div class="dk-card"><i></i><span>85,6 mm</span></div></div>' +
      '<input class="o-kart" type="range" min="160" max="520" value="324" aria-label="Kart genişliği"><div class="dk-row2"><b class="o-pxmm"></b><button class="dk-b dk-b1 o-ileri">Kartı oturttum →</button></div></div>' +
      '<div class="dk-pane p2" hidden><p>Mevcut yüzüğünüzü <b>iç boşluğu daireye oturacak şekilde</b> ekrana koyun; kaydırıcıyla daireyi iç çapa eşitleyin.</p>' +
      '<div class="dk-circwrap"><div class="dk-circ"><span class="o-d">17,0 mm</span></div></div>' +
      '<input class="o-cap" type="range" min="140" max="260" value="170" aria-label="İç çap (0,1 mm)">' +
      '<div class="dk-ozet"><div><small>İç çap</small><b class="o-cap-t"></b></div><div><small>İç çevre</small><b class="o-cev-t"></b></div><div><small>TR ölçü</small><b class="o-tr-t"></b></div></div>' +
      '<div class="dk-row2"><button class="dk-b o-geri">← Kalibrasyon</button><button class="dk-b dk-b1 o-ileri2">Tabloya bak →</button></div></div>' +
      '<div class="dk-pane p3" hidden><div class="dk-tablo"></div><p class="dk-not">Ölçüler yaklaşıktır (TR ölçü = iç çevre mm − 40). Parmak şişkinliği sabah/akşam değişir; alyans için mağazada kesin ölçü alınır.</p><div class="dk-row2"><button class="dk-b o-geri2">← Ölç</button><button class="dk-b dk-b1 o-rez">Bu ölçüyle mağazada dene</button></div></div>';
    var R = function (s) { return $(s, el); };
    var pxmm = kayitli || 324 / 85.6;
    R('.o-kart').value = Math.round(pxmm * 85.6);
    function kart() { var w = parseInt(R('.o-kart').value, 10); pxmm = w / 85.6; var c = R('.dk-card'); c.style.width = w + 'px'; c.style.height = (w * 53.98 / 85.6) + 'px'; R('.o-pxmm').textContent = num(pxmm, 2) + ' px = 1 mm'; store('pxmm', String(pxmm)); cap(); }
    function cap() {
      var d = parseInt(R('.o-cap').value, 10) / 10, c = Math.PI * d, tr = Math.round(c - 40);
      var e = R('.dk-circ'); e.style.width = e.style.height = (d * pxmm) + 'px';
      R('.o-d').textContent = num(d, 1) + ' mm'; R('.o-cap-t').textContent = num(d, 1) + ' mm'; R('.o-cev-t').textContent = num(c, 1) + ' mm'; R('.o-tr-t').textContent = tr;
      var rows = '<table><thead><tr><th>TR ölçü</th><th>İç çap</th><th>İç çevre</th></tr></thead><tbody>';
      for (var s = 8; s <= 26; s++) { var cc = s + 40, dd = cc / Math.PI; rows += '<tr class="' + (s === tr ? 'on' : '') + '"><td>' + s + '</td><td>' + num(dd, 1) + ' mm</td><td>' + num(cc, 0) + ' mm</td></tr>'; }
      R('.dk-tablo').innerHTML = rows + '</tbody></table>'; el._tr = tr;
    }
    function adim(n) { $$('.dk-pane', el).forEach(function (x, i) { x.hidden = i !== n; }); $$('.dk-steps li', el).forEach(function (x, i) { x.classList.toggle('on', i === n); }); if (n === 2) { var on = R('.dk-tablo .on'); if (on && on.scrollIntoView) on.parentNode.parentNode.parentNode.scrollTop = Math.max(0, on.offsetTop - 80); } }
    R('.o-kart').oninput = kart; R('.o-cap').oninput = cap;
    R('.o-ileri').onclick = function () { adim(1); }; R('.o-geri').onclick = function () { adim(0); };
    R('.o-ileri2').onclick = function () { adim(2); }; R('.o-geri2').onclick = function () { adim(1); };
    R('.o-rez').onclick = function () { document.dispatchEvent(new CustomEvent('dk-git', { detail: { arac: 'rez', tr: el._tr } })); };
    kart();
  };

  /* ---------- 3. Üzerinde gör ---------- */
  var ANKRAJ = {
    kolye: { base: 'img/ai/m_boyun.jpg', x: .50, y: .43, w: .46, mod: 'top', rot: 0 },
    charm: { base: 'img/ai/m_boyun.jpg', x: .495, y: .485, w: .115, mod: 'top', rot: 0, zincir: true },
    kupe: { base: 'img/ai/m_kulak.jpg', x: .445, y: .445, w: .105, mod: 'top', rot: 0 },
    yuzuk: { base: 'img/ai/m_el.jpg', x: .385, y: .40, w: .19, mod: 'center', rot: 8 },
    bileklik: { base: 'img/ai/m_bilek.jpg', x: .515, y: .60, w: .34, mod: 'center', rot: -6 },
    kelepce: { base: 'img/ai/m_bilek.jpg', x: .515, y: .60, w: .30, mod: 'center', rot: -6 }
  };
  var YER = { kolye: 'boyunda', charm: 'zincirde', kupe: 'kulakta', yuzuk: 'elde', bileklik: 'bilekte', kelepce: 'bilekte' };
  DK.uzerindeGor = function (el, ilk) {
    el.classList.add('dk-w');
    var L = DK.urunler.filter(function (p) { return p.cut; });
    el.innerHTML = '<div class="dk-gor"><div class="dk-stage"><img class="g-base" alt="Model" src="img/ai/m_el.jpg"><svg class="g-zinc" viewBox="0 0 100 100" preserveAspectRatio="none"><path d=""/></svg><img class="g-ov" alt="" draggable="false"><div class="dk-chip g-chip"></div></div>' +
      '<div class="dk-gctl"><p class="dk-kuc">Ürünü seçin: aynı model; boyunda, elde, kulakta ve bilekte denenir. Ürünü sürükleyerek oturtun.</p>' +
      '<div class="dk-chips g-kat"></div><div class="dk-strip g-strip"></div>' +
      '<label>Boyut<input class="g-s" type="range" min="40" max="200" value="100"></label><label>Açı<input class="g-r" type="range" min="-45" max="45" value="0"></label>' +
      '<div class="dk-gbilgi g-bilgi"></div><p class="dk-not">Önizleme: mağaza ürün fotoğrafı model fotoğrafına yerleştirilir. Model görselleri yapay zekâ ile üretilmiştir (örnek).</p></div></div>';
    var R = function (s) { return $(s, el); };
    var cur = null, state = { dx: 0, dy: 0, s: 1, r: 0 }, filt = 'hepsi';
    var chips = ['hepsi', 'yuzuk', 'kolye', 'charm', 'kupe', 'bileklik', 'kelepce'];
    R('.g-kat').innerHTML = chips.map(function (c) { return '<button class="dk-chip2' + (c === filt ? ' on' : '') + '" data-c="' + c + '">' + (c === 'hepsi' ? 'Tümü' : DK.KAT[c]) + '</button>'; }).join('');
    function strip() {
      var l = L.filter(function (p) { return filt === 'hepsi' || p.kat === filt; });
      R('.g-strip').innerHTML = l.map(function (p) { return '<button class="dk-th' + (cur && cur.id === p.id ? ' on' : '') + '" data-id="' + p.id + '" title="' + esc(p.ad) + '"><img src="' + p.cut + '" alt="' + esc(p.ad) + '"></button>'; }).join('');
    }
    function yerles() {
      if (!cur) return; var a = ANKRAJ[cur.kat], st = R('.dk-stage'), ov = R('.g-ov'), W = st.clientWidth, H = st.clientHeight;
      var natW = ov.naturalWidth || 1, natH = ov.naturalHeight || 1, w = a.w * W * state.s, h = w * natH / natW;
      var cx = a.x * W + state.dx, cy = a.y * H + state.dy;
      ov.style.width = w + 'px'; ov.style.left = (cx - w / 2) + 'px'; ov.style.top = (a.mod === 'top' ? cy : cy - h / 2) + 'px';
      ov.style.transform = 'rotate(' + (a.rot + state.r) + 'deg)'; ov.style.transformOrigin = '50% ' + (a.mod === 'top' ? '0%' : '50%');
      var z = R('.g-zinc'); if (a.zincir) {
        z.style.display = 'block';
        var x0 = 31, x1 = 69, cxp = (cx / W * 100), cyp = (cy / H * 100);
        z.querySelector('path').setAttribute('d', 'M' + x0 + ' 36 Q' + (x0 + 6) + ' ' + (cyp + 2) + ' ' + cxp + ' ' + (cyp + 0.3) + ' Q' + (x1 - 6) + ' ' + (cyp + 2) + ' ' + x1 + ' 36');
      } else z.style.display = 'none';
    }
    function sec(id) {
      var p = DK.byId(id); if (!p) return; cur = p; DK.state.secili = id; var a = ANKRAJ[p.kat];
      state = { dx: 0, dy: 0, s: 1, r: 0 }; R('.g-s').value = 100; R('.g-r').value = 0;
      var base = R('.g-base'); if (base.getAttribute('src') !== a.base) base.src = a.base;
      var ov = R('.g-ov'); ov.onload = yerles; ov.src = (p.kat === 'kupe' && p.tek) ? p.cut.replace('.png', '-tek.png') : p.cut;
      R('.g-chip').textContent = DK.KAT[p.kat] + ' · ' + YER[p.kat];
      R('.g-bilgi').innerHTML = '<b>' + esc(p.ad) + '</b> <span>' + tl(p.fiyat) + '</span> <button class="dk-b dk-b1" data-x="rez">Mağazada gör</button>';
      strip(); if (ov.complete) yerles();
    }
    el.addEventListener('click', function (e) {
      var t = e.target.closest('.dk-th'); if (t) { sec(t.getAttribute('data-id')); return; }
      var c = e.target.closest('.dk-chip2'); if (c) { filt = c.getAttribute('data-c'); $$('.dk-chip2', el).forEach(function (x) { x.classList.toggle('on', x === c); }); strip(); var f = L.filter(function (p) { return filt === 'hepsi' || p.kat === filt; })[0]; if (f && (!cur || (filt !== 'hepsi' && cur.kat !== filt))) sec(f.id); return; }
      if (e.target.getAttribute && e.target.getAttribute('data-x') === 'rez') document.dispatchEvent(new CustomEvent('dk-git', { detail: { arac: 'rez', id: cur && cur.id } }));
    });
    R('.g-s').oninput = function () { state.s = this.value / 100; yerles(); };
    R('.g-r').oninput = function () { state.r = parseInt(this.value, 10); yerles(); };
    var drag = null, ov0 = R('.g-ov');
    R('.dk-stage').addEventListener('pointerdown', function (e) { if (e.target.closest('.g-chip')) return; drag = { x: e.clientX, y: e.clientY, dx: state.dx, dy: state.dy }; try { this.setPointerCapture(e.pointerId); } catch (x) {} });
    R('.dk-stage').addEventListener('pointermove', function (e) { if (!drag) return; state.dx = drag.dx + e.clientX - drag.x; state.dy = drag.dy + e.clientY - drag.y; yerles(); });
    R('.dk-stage').addEventListener('pointerup', function () { drag = null; });
    window.addEventListener('resize', yerles);
    el.dkSet = function (id) { var p = DK.byId(id); if (p) { filt = 'hepsi'; sec(id); } };
    el.dkYenile = yerles;
    sec(ilk || DK.state.secili && DK.byId(DK.state.secili) && DK.byId(DK.state.secili).cut && DK.state.secili || 'cetas-olivia-kupe');
  };

  /* ---------- 4. Baş Harfi Sen&Ben kişiselleştirici ---------- */
  DK.harf = function (el) {
    el.classList.add('dk-w');
    var HARF = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
    el.innerHTML = '<div class="dk-hrf"><div class="dk-stage h-stage"><canvas class="h-cv"></canvas><div class="dk-chip h-chip">Önizleme</div></div>' +
      '<div class="dk-gctl"><p class="dk-kuc">Baş harflerinizi seçin: Sen &amp; Ben koleksiyonu canlı önizlenir (en çok 4 harf).</p>' +
      '<div class="h-sel"></div><div class="dk-chips h-tur"><button class="dk-chip2 on" data-t="kolye">Kolye</button><button class="dk-chip2" data-t="bileklik">Bileklik</button></div>' +
      '<div class="dk-chips h-ren"><button class="dk-chip2 on" data-r="#e9c46a">Sarı altın</button><button class="dk-chip2" data-r="#e8b4a0">Rose</button><button class="dk-chip2" data-r="#dfe3e8">Beyaz altın</button></div>' +
      '<label class="h-chk"><input type="checkbox" class="h-pave" checked> Pırlanta pavé (ışıltılı)</label>' +
      '<div class="dk-hfy"><span>Toplam (örnek)</span><b class="h-top"></b><i class="h-ayr"></i></div>' +
      '<div class="h-klav"></div><div class="dk-row2"><button class="dk-b h-sil">Sil</button><button class="dk-b dk-b1 h-rez">Mağazada ayırt</button></div>' +
      '<p class="dk-not">Harf fiyatı sitedeki "Harf 9mm Bileklik Charm" fiyatından (15.050 TL) alınmıştır; zincir bedeli örnektir. Model görseli yapay zekâ ile üretilmiştir.</p></div></div>';
    var R = function (s) { return $(s, el); };
    var S = { h: ['D', 'K'], t: 'kolye', ren: '#e9c46a', pave: true }, imgs = {};
    var cv = R('.h-cv'), cx = cv.getContext('2d');
    R('.h-klav').innerHTML = HARF.map(function (h) { return '<button data-h="' + h + '">' + h + '</button>'; }).join('');
    R('.h-sel').innerHTML = '';
    function getImg(src, cb) { if (imgs[src] && imgs[src].complete) return cb(imgs[src]); var i = imgs[src] || (imgs[src] = new Image()); i.onload = function () { cb(i); }; if (!i.src) i.src = src; if (i.complete && i.naturalWidth) cb(i); }
    function shade(hex, k) { var c = parseInt(hex.slice(1), 16), r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255; r = Math.max(0, Math.min(255, r + k)); g = Math.max(0, Math.min(255, g + k)); b = Math.max(0, Math.min(255, b + k)); return 'rgb(' + r + ',' + g + ',' + b + ')'; }
    function tile(ctx, ch, x, y, s) {
      var o = document.createElement('canvas'); o.width = o.height = Math.ceil(s * 1.6); var c = o.getContext('2d'); var m = o.width / 2;
      c.font = '800 ' + (s * 1.25) + 'px "Plus Jakarta Sans","Segoe UI",Arial,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = shade(S.ren, -70); c.fillText(ch, m + s * .035, m + s * .055);
      var g = c.createLinearGradient(0, m - s * .6, 0, m + s * .6); g.addColorStop(0, shade(S.ren, 40)); g.addColorStop(.45, S.ren); g.addColorStop(1, shade(S.ren, -45));
      c.fillStyle = g; c.fillText(ch, m, m);
      if (S.pave) {
        var p = document.createElement('canvas'); p.width = p.height = o.width; var pc = p.getContext('2d'); var st = Math.max(3, s * .075);
        for (var yy = 0; yy < p.height; yy += st) for (var xx = 0; xx < p.width; xx += st) { pc.fillStyle = ((xx + yy) / st % 2) ? 'rgba(255,255,255,.95)' : 'rgba(210,225,255,.85)'; pc.beginPath(); pc.arc(xx + (yy / st % 2 ? st / 2 : 0), yy, st * .32, 0, 6.3); pc.fill(); }
        pc.globalCompositeOperation = 'destination-in'; pc.font = c.font; pc.textAlign = 'center'; pc.textBaseline = 'middle'; pc.fillText(ch, m, m);
        c.drawImage(p, 0, 0);
      }
      c.globalCompositeOperation = 'source-atop'; c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1, s * .02); c.strokeText(ch, m - s * .01, m - s * .01);
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = s * .12; ctx.shadowOffsetY = s * .06; ctx.drawImage(o, x - m, y - m); ctx.restore();
    }
    function ciz() {
      var src = S.t === 'kolye' ? 'img/ai/m_boyun.jpg' : 'img/ai/m_bilek.jpg';
      getImg(src, function (im) {
        cv.width = im.naturalWidth; cv.height = im.naturalHeight; cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0);
        var W = cv.width, H = cv.height, n = S.h.length, gold = S.ren;
        function zincir(path, lw) { cx.save(); cx.lineCap = 'round'; cx.shadowColor = 'rgba(0,0,0,.35)'; cx.shadowBlur = 5; cx.shadowOffsetY = 3; cx.strokeStyle = shade(gold, -20); cx.lineWidth = lw; path(); cx.stroke(); cx.setLineDash([lw * .9, lw * .5]); cx.strokeStyle = shade(gold, 55); cx.lineWidth = lw * .6; path(); cx.stroke(); cx.restore(); }
        if (S.t === 'kolye') {
          var y0 = H * .405, ym = H * .50, size = Math.min(W * .1, W * .36 / Math.max(n, 2.4));
          zincir(function () { cx.beginPath(); cx.moveTo(W * .245, y0 - H * .015); cx.quadraticCurveTo(W * .5, H * .54, W * .755, y0 - H * .015); }, W * .006);
          var tot = n * size * .98, sx = W * .5 - tot / 2 + size * .49;
          for (var i = 0; i < n; i++) tile(cx, S.h[i], sx + i * size * .98, H * .5 + Math.abs(i - (n - 1) / 2) * 0, size);
        } else {
          var cy = H * .60, sz = Math.min(W * .075, W * .32 / Math.max(n, 3));
          zincir(function () { cx.beginPath(); cx.ellipse(W * .515, cy, W * .165, H * .026, -.1, Math.PI, 6.4); }, W * .0055);
          zincir(function () { cx.beginPath(); cx.ellipse(W * .515, cy, W * .165, H * .026, -.1, 0, Math.PI); }, W * .0055);
          var tt = n * sz * .98, sx2 = W * .515 - tt / 2 + sz * .49;
          for (var j = 0; j < n; j++) tile(cx, S.h[j], sx2 + j * sz * .98, cy + H * .022, sz);
        }
      });
      var fy = (S.t === 'kolye' ? 9800 : 7600), per = 15050, top = fy + per * S.h.length;
      R('.h-top').textContent = tl(top); R('.h-ayr').textContent = (S.t === 'kolye' ? 'zincir 9.800' : 'zincir 7.600') + ' + ' + S.h.length + ' harf × 15.050 TL';
      R('.h-sel').innerHTML = S.h.map(function (h, i) { return '<span class="dk-hbox' + (i === S.h.length - 1 ? ' last' : '') + '">' + h + '</span>'; }).join('') + (S.h.length < 4 ? '<span class="dk-hbox boş">+</span>' : '');
      R('.h-chip').textContent = (S.t === 'kolye' ? 'Kolye' : 'Bileklik') + ' · ' + S.h.join(' & ');
    }
    R('.h-klav').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (S.h.length < 4) { S.h.push(b.getAttribute('data-h')); ciz(); } };
    R('.h-sil').onclick = function () { S.h.pop(); ciz(); };
    R('.h-tur').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.t = b.getAttribute('data-t'); $$('button', R('.h-tur')).forEach(function (x) { x.classList.toggle('on', x === b); }); ciz(); };
    R('.h-ren').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.ren = b.getAttribute('data-r'); $$('button', R('.h-ren')).forEach(function (x) { x.classList.toggle('on', x === b); }); ciz(); };
    R('.h-pave').onchange = function () { S.pave = this.checked; ciz(); };
    R('.h-rez').onclick = function () { document.dispatchEvent(new CustomEvent('dk-git', { detail: { arac: 'rez', not: 'Baş Harfi Sen&Ben ' + S.t + ' (' + S.h.join('-') + ')' } })); };
    ciz();
  };

  /* ---------- 5. Alyans çifti eşleştirici ---------- */
  DK.alyans = function (el) {
    el.classList.add('dk-w');
    var M = [{ id: 'klasik', ad: 'Klasik bombe', img: 'img/ai/a_klasik.jpg', isc: 2400 }, { id: 'tas', ad: 'Taşlı kenar', img: 'img/ai/a_tas.jpg', isc: 5200 }, { id: 'mat', ad: 'Mat fırça', img: 'img/ai/a_mat.jpg', isc: 3100 }];
    var DEN = { 14: 13.1, 18: 15.6, 22: 17.7 };
    el.innerHTML = '<div class="dk-aly"><div class="dk-stage a-stage"><img class="a-img" alt="Alyans çifti" src="' + M[0].img + '"><div class="a-oyma"></div><div class="dk-chip a-chip"></div></div>' +
      '<div class="dk-gctl"><div class="dk-chips a-model">' + M.map(function (m, i) { return '<button class="dk-chip2' + (i ? '' : ' on') + '" data-m="' + i + '">' + m.ad + '</button>'; }).join('') + '</div>' +
      '<div class="dk-grid2"><fieldset><legend>Birinci parmak</legend><label>TR ölçü<input class="a-o1" type="number" min="8" max="26" value="15"></label><label>Genişlik<select class="a-w1"><option>3</option><option>4</option><option selected>5</option><option>6</option></select> mm</label></fieldset>' +
      '<fieldset><legend>İkinci parmak</legend><label>TR ölçü<input class="a-o2" type="number" min="8" max="26" value="11"></label><label>Genişlik<select class="a-w2"><option>3</option><option selected>4</option><option>5</option><option>6</option></select> mm</label></fieldset></div>' +
      '<div class="dk-grid2"><label>Ayar<select class="a-ay"><option selected>14</option><option>18</option><option>22</option></select></label><label>İç yazı<input class="a-yz" maxlength="22" value="Ayşe & Ali · 14.06.2026"></label></div>' +
      '<div class="dk-two a-sonuc"></div><div class="dk-result"><div class="dk-big a-top"></div><small class="a-brk"></small></div>' +
      '<p class="dk-not">Gram, ölçüye ve genişliğe göre yaklaşık hesaplanır; işçilik ve taş bedelleri örnektir. Kur: <b class="a-kur"></b></p><button class="dk-b dk-b1 a-rez">Çifti mağazada dene</button></div></div>';
    var R = function (s) { return $(s, el); }, cur = 0;
    function hes() {
      var m = M[cur], ay = parseInt(R('.a-ay').value, 10), kur = DK.kurAyar(ay), tot = 0, h = [];
      [1, 2].forEach(function (k) {
        var o = parseInt(R('.a-o' + k).value, 10) || 15, w = parseFloat(R('.a-w' + k).value), cev = o + 40, g = cev * w * 1.5 / 1000 * DEN[ay], fy = g * kur + m.isc / 2;
        tot += fy; h.push('<div><small>' + k + '. alyans · TR ' + o + ' · ' + w + ' mm</small><b>' + num(g, 2) + ' gr</b><i>' + tl(fy) + '</i></div>');
      });
      R('.a-sonuc').innerHTML = h.join(''); R('.a-top').textContent = tl(tot) + ' / çift'; R('.a-brk').textContent = m.ad + ' · ' + ay + ' ayar · altın + işçilik/taş (örnek)';
      R('.a-kur').textContent = num(kur, 2) + ' TL/gr (' + DK.state.kur.kaynak + ')';
      R('.a-chip').textContent = m.ad; R('.a-oyma').textContent = R('.a-yz').value;
    }
    R('.a-model').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; cur = +b.getAttribute('data-m'); $$('button', R('.a-model')).forEach(function (x) { x.classList.toggle('on', x === b); }); R('.a-img').src = M[cur].img; hes(); };
    $$('input,select', el).forEach(function (i) { i.oninput = hes; });
    R('.a-rez').onclick = function () { document.dispatchEvent(new CustomEvent('dk-git', { detail: { arac: 'rez', not: 'Alyans çifti: ' + M[cur].ad } })); };
    document.addEventListener('dk-kur', hes); hes();
  };

  /* ---------- 6. Hediye sihirbazı ---------- */
  var TAG = { Minima: ['minimal'], Fortuna: ['klasik', 'minimal'], Olivia: ['renkli'], Eterna: ['renkli', 'gosterisli'], 'Bir Dilek Tut': ['anlamli', 'renkli'], 'Kilitli Dilek': ['anlamli'], Harf: ['anlamli'], Charm: ['anlamli'], Dorika: ['klasik', 'gosterisli'], 'Seçki': ['gosterisli', 'klasik'] };
  var KIME = {
    anne: { ad: 'Anneme', kisa: 'Anne', kat: ['kolye', 'bileklik', 'kupe', 'kelepce'] }, es: { ad: 'Eşime / sevgilime', kisa: 'Eş / sevgili', kat: ['yuzuk', 'kolye', 'kupe', 'bileklik'] },
    cocuk: { ad: 'Kızıma / bebeğe', kisa: 'Kız çocuğu / bebek', kat: ['charm', 'bileklik', 'kupe'] }, arkadas: { ad: 'Arkadaşıma', kisa: 'Arkadaş', kat: ['kupe', 'charm', 'yuzuk', 'bileklik'] }, ben: { ad: 'Kendime', kisa: 'Kendiniz', kat: ['yuzuk', 'kupe', 'kolye', 'bileklik', 'kelepce', 'charm'] }
  };
  DK.hediye = function (el) {
    el.classList.add('dk-w');
    var S = { kime: 'es', butce: 50000, tarz: 'minimal' };
    var B = [[20000, '20 bin TL\'ye kadar'], [40000, '40 bin TL\'ye kadar'], [70000, '70 bin TL\'ye kadar'], [150000, '150 bin TL\'ye kadar'], [1e9, 'Sınırsız']];
    el.innerHTML = '<div class="dk-hed"><div class="dk-hq"><h4>Kime alıyorsunuz?</h4><div class="dk-chips h-kime">' + Object.keys(KIME).map(function (k) { return '<button class="dk-chip2' + (k === 'es' ? ' on' : '') + '" data-v="' + k + '">' + KIME[k].ad + '</button>'; }).join('') + '</div>' +
      '<h4>Bütçeniz?</h4><div class="dk-chips h-but">' + B.map(function (b, i) { return '<button class="dk-chip2' + (i === 2 ? ' on' : '') + '" data-v="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</div>' +
      '<h4>Tarzı nasıl?</h4><div class="dk-chips h-tarz">' + [['minimal', 'Sade, minimal'], ['renkli', 'Mineli, renkli'], ['gosterisli', 'Taşlı, gösterişli'], ['anlamli', 'Anlamlı: harf, nazar, dilek'], ['klasik', 'Klasik']].map(function (t, i) { return '<button class="dk-chip2' + (i ? '' : ' on') + '" data-v="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="dk-hres"></div></div>';
    S.butce = 70000;
    var R = function (s) { return $(s, el); };
    function oner() {
      var kk = KIME[S.kime].kat;
      var sk = DK.urunler.filter(function (p) { return p.fiyat <= S.butce; }).map(function (p) {
        var s = 0, ki = kk.indexOf(p.kat); s += ki < 0 ? 0 : (8 - ki); (TAG[p.kol] || []).forEach(function (t) { if (t === S.tarz) s += 6; });
        s += (p.fiyat / S.butce) * 2; return { p: p, s: s };
      }).sort(function (a, b) { return b.s - a.s; });
      var top = [], seen = {}; sk.forEach(function (x) { var key = x.p.kat; if (top.length < 3 && !seen[key]) { seen[key] = 1; top.push(x.p); } });
      sk.forEach(function (x) { if (top.length < 3 && top.indexOf(x.p) < 0) top.push(x.p); });
      R('.dk-hres').innerHTML = top.length ? '<h4>Önerimiz</h4><div class="dk-hlist">' + top.map(function (p, i) {
        return '<article class="dk-hk"><button class="dk-kart" data-id="' + p.id + '"><span class="dk-kimg"><img src="' + p.cut + '" alt="' + esc(p.ad) + '"></span><span class="dk-kad">' + esc(p.ad) + '</span><span class="dk-kfy">' + tl(p.fiyat) + '</span></button>' +
          '<p>' + (i === 0 ? '<b>İlk tercih.</b> ' : '') + KIME[S.kime].kisa + ' için ' + esc(p.kol.toLowerCase()) + ' çizgisi' + ((TAG[p.kol] || []).indexOf(S.tarz) >= 0 ? ', seçtiğiniz tarza uyuyor.' : '; bütçenize uygun bir seçenek.') + '</p></article>';
      }).join('') + '</div>' : '<p>Bu bütçede ürün bulunamadı; bütçeyi yükseltin.</p>';
    }
    [['.h-kime', 'kime'], ['.h-but', 'butce'], ['.h-tarz', 'tarz']].forEach(function (a) {
      R(a[0]).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; $$('button', this).forEach(function (x) { x.classList.toggle('on', x === b); }); var v = b.getAttribute('data-v'); S[a[1]] = a[1] === 'butce' ? parseFloat(v) : v; oner(); };
    });
    oner();
  };

  /* ---------- 7. Taksit hesaplayıcı ---------- */
  DK.taksit = function (el) {
    el.classList.add('dk-w');
    var KART = { 'Bonus': [0, 1.8, 3.6, 7.4, 11.0, 14.5], 'World': [0, 2.0, 3.9, 7.9, 11.6, 15.2], 'Maximum': [0, 1.9, 3.8, 7.6, 11.3, 14.9], 'Axess': [0, 2.1, 4.1, 8.2, 12.0, 15.8], 'Paraf': [0, 1.7, 3.5, 7.2, 10.7, 14.1] };
    var TK = [1, 3, 6, 9, 12, 18].slice(0, 6); TK = [1, 2, 3, 6, 9, 12];
    var p0 = DK.byId(DK.state.secili) || DK.byId('cetas-minima-bileklik');
    el.innerHTML = '<div class="dk-grid2"><label>Tutar (TL)<input class="t-tut" type="number" step="100" min="500" value="' + Math.round(p0.fiyat) + '"></label>' +
      '<label>Kart ailesi<select class="t-kart">' + Object.keys(KART).map(function (k) { return '<option>' + k + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="dk-chips t-ur"><button class="dk-chip2" data-id="' + p0.id + '">' + esc(p0.ad) + '</button><button class="dk-chip2" data-id="cetas-fortuna-kolye-12">Fortuna kolye</button><button class="dk-chip2" data-id="cetas-eterna-yuzuk-3">Eterna yüzük</button><button class="dk-chip2" data-id="cetas-fortuna-kelepce-3">Fortuna kelepçe</button></div>' +
      '<div class="dk-taks t-liste"></div><p class="dk-not">ÖRNEK ORANLAR: gerçek vade farkları PayTR / iyzico / banka POS sözleşmesinden otomatik gelir ve kart ailesine göre değişir.</p>';
    var R = function (s) { return $(s, el); }, sel = 5;
    function ciz() {
      var t = parseFloat(R('.t-tut').value) || 0, o = KART[R('.t-kart').value];
      R('.t-liste').innerHTML = TK.map(function (n, i) { var top = t * (1 + o[i] / 100), ay = top / n;
        return '<button class="dk-tk' + (i === sel ? ' on' : '') + '" data-i="' + i + '"><b>' + (n === 1 ? 'Tek çekim' : n + ' taksit') + '</b><span>' + tl(ay) + (n > 1 ? ' / ay' : '') + '</span><i>' + (o[i] ? 'vade +%' + num(o[i], 1) + ' · toplam ' + tl(top) : 'vade farkı yok · ' + tl(top)) + '</i></button>'; }).join('');
    }
    R('.t-liste').onclick = function (e) { var b = e.target.closest('.dk-tk'); if (!b) return; sel = +b.getAttribute('data-i'); ciz(); };
    R('.t-ur').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; R('.t-tut').value = Math.round(DK.byId(b.getAttribute('data-id')).fiyat); ciz(); };
    $$('input,select', el).forEach(function (i) { i.oninput = ciz; });
    ciz();
    el.dkSet = function (id) { var p = DK.byId(id); if (p) { R('.t-tut').value = Math.round(p.fiyat); ciz(); } };
  };

  /* ---------- 8. Mağazada gör / rezervasyon ---------- */
  DK.rezervasyon = function (el) {
    el.classList.add('dk-w');
    var p0 = DK.byId(DK.state.secili) || DK.byId('cetas-olivia-bileklik');
    var gun = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], ay = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    var days = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (days.length < 6) { d = new Date(d.getTime() + 864e5); if (d.getDay() !== 0) days.push(new Date(d)); }
    var slots = []; for (var h = 10; h <= 18; h++) { slots.push(h + ':00'); if (h < 18) slots.push(h + ':30'); }
    var S = { gun: 0, saat: '15:00' };
    el.innerHTML = '<div class="dk-rez"><div><label>Ürün<select class="r-urun">' + urunSecenek(p0.id) + '</select></label>' +
      '<h4>Gün</h4><div class="dk-chips r-gun">' + days.map(function (x, i) { return '<button class="dk-chip2' + (i ? '' : ' on') + '" data-i="' + i + '">' + gun[x.getDay()].slice(0, 3) + ' ' + x.getDate() + ' ' + ay[x.getMonth()] + '</button>'; }).join('') + '</div>' +
      '<h4>Saat</h4><div class="dk-slots r-saat">' + slots.map(function (s, i) { var dolu = (i * 7 + 3) % 5 === 0; return '<button class="dk-slot' + (s === S.saat ? ' on' : '') + '"' + (dolu ? ' disabled' : '') + ' data-s="' + s + '">' + s + '</button>'; }).join('') + '</div>' +
      '<label>Adınız<input class="r-ad" placeholder="Ad Soyad"></label><label>Not (ölçü, taş, hediye…)<input class="r-not" placeholder="örn. TR 15 ölçü, hediye paketi"></label></div>' +
      '<div class="dk-rsum"><div class="dk-rkart"><img class="r-img" alt=""><div><b class="r-ad2"></b><span class="r-fy"></span></div></div>' +
      '<div class="dk-msg r-msg"></div><a class="dk-b dk-b1 dk-wa r-wa" target="_blank" rel="noopener">WhatsApp\'a hazır mesaj</a>' +
      '<p class="dk-not">Mağaza hattı yer tutucudur (WhatsApp numarası kesinleşince bağlanır). Sabit hat: <a href="tel:+902124331164">' + DK.HAT + '</a>. Çalışma saatleri: Pzt–Cmt 09:00–19:00 (siteden).<br>Dolu görünen saatler örnektir; canlı sürümde mağaza takviminden gelir.</p></div></div>';
    var R = function (s) { return $(s, el); };
    function msg() {
      var p = DK.byId(R('.r-urun').value), dd = days[S.gun], tr = el._tr, nt = R('.r-not').value || el._not || '';
      var t = 'Merhaba, Doruk Kuyumculuk web sitesinden yazıyorum.\n' + p.ad + (p.kod ? ' (' + p.kod + ')' : '') + ' ürününü ' + gun[dd.getDay()] + ' ' + dd.getDate() + ' ' + ay[dd.getMonth()] + ' saat ' + S.saat + ' için Bağcılar mağazasında ayırtmak istiyorum.' +
        (R('.r-ad').value ? '\nAdım: ' + R('.r-ad').value : '') + (tr ? '\nYüzük ölçüm: TR ' + tr : '') + (nt ? '\nNot: ' + nt : '');
      R('.r-msg').textContent = t; R('.r-wa').href = DK.WA(t);
      R('.r-img').src = p.cut; R('.r-ad2').textContent = p.ad; R('.r-fy').textContent = tl(p.fiyat) + ' · sitedeki fiyat (örnek)';
    }
    R('.r-gun').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; S.gun = +b.getAttribute('data-i'); $$('button', this).forEach(function (x) { x.classList.toggle('on', x === b); }); msg(); };
    R('.r-saat').onclick = function (e) { var b = e.target.closest('button:not([disabled])'); if (!b) return; S.saat = b.getAttribute('data-s'); $$('button', this).forEach(function (x) { x.classList.toggle('on', x === b); }); msg(); };
    $$('input,select', el).forEach(function (i) { i.oninput = msg; });
    el.dkSet = function (id, o) { if (id) R('.r-urun').value = id; if (o && o.tr) el._tr = o.tr; if (o && o.not) el._not = o.not; msg(); };
    msg();
  };

  /* ---------- 9. Instagram gönderileri ---------- */
  DK.instagram = function (el, kodlar) {
    el.classList.add('dk-w');
    if (kodlar && kodlar.length) {
      el.innerHTML = '<div class="dk-ig">' + kodlar.map(function (k) { return '<iframe src="https://www.instagram.com/p/' + k + '/embed" loading="lazy" allowtransparency="true" scrolling="no" frameborder="0"></iframe>'; }).join('') + '</div>';
      return;
    }
    var L = ['cetas-fortuna-kolye-15', 'cetas-eterna-yuzuk-2', 'harf-9mm-bileklik-charm', 'cetas-olivia-kupe', 'ayicik-charm', 'cetas-minima-bileklik'].map(DK.byId);
    el.innerHTML = '<div class="dk-ig dk-ig-ornek">' + L.map(function (p, i) { return '<figure><div class="dk-igh"><span class="dk-av"></span><b>dorukkuyumculuk</b></div><img src="' + p.cut + '" alt="' + esc(p.ad) + '"><figcaption>' + esc(p.ad) + ' ♡ ' + (i % 2 ? 'Yeni geldi' : 'Mağazamızda') + '</figcaption></figure>'; }).join('') + '</div>' +
      '<p class="dk-not">Örnek kartlar. Canlı sürümde @dorukkuyumculuk hesabının son gönderileri Instagram\'ın resmî gömme kodu (<code>instagram.com/p/&lt;kod&gt;/embed</code>) ile otomatik görünür.</p>';
  };

  /* ---------- 10. 360° Street View ---------- */
  DK.sokak = function (el) {
    el.classList.add('dk-w');
    var q = encodeURIComponent('Sancaktepe Mah. Çarşı Cad. 84/A Bağcılar İstanbul');
    var sv = 'https://maps.google.com/maps?q=&layer=c&cbll=41.0393,28.8567&cbp=12,0,0,0,0&output=svembed';
    var mp = 'https://maps.google.com/maps?q=' + q + '&z=17&output=embed';
    el.innerHTML = '<div class="dk-sv"><div class="dk-chips s-tab"><button class="dk-chip2 on" data-t="sv">360° Sokak görünümü</button><button class="dk-chip2" data-t="mp">Harita</button></div>' +
      '<div class="dk-svbox"><iframe class="s-fr" title="Doruk Kuyumculuk · Bağcılar" loading="lazy" allow="accelerometer *; gyroscope *; fullscreen *" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="dk-svyok">Bu bölüm internet bağlantısı ile Google Haritalar\'dan yüklenir.</div></div>' +
      '<p class="dk-not">Sancaktepe Mah. Çarşı Cad. 84/A, Bağcılar / İstanbul · <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + q + '">Google Haritalar\'da aç</a> · Sokak görünümü konumu yaklaşıktır; canlı sürümde mağaza kapısına sabitlenir.</p></div>';
    var fr = $('.s-fr', el), cur = 'sv';
    function yukle() { fr.src = cur === 'sv' ? sv : mp; }
    $('.s-tab', el).onclick = function (e) { var b = e.target.closest('button'); if (!b) return; cur = b.getAttribute('data-t'); $$('button', this).forEach(function (x) { x.classList.toggle('on', x === b); }); yukle(); };
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { yukle(); io.disconnect(); } }, { rootMargin: '300px' }); io.observe(el); } else yukle();
  };

  /* ---------- Yönlendirme: modaldan araçlara ---------- */
  DK.onGit = function (fn) { document.addEventListener('dk-git', function (e) { fn(e.detail); }); };
  /* ---------- Başlangıç ---------- */
  DK.baslat = function () { DK.kurYukle(); };
  if (document.readyState !== 'loading') DK.baslat(); else document.addEventListener('DOMContentLoaded', DK.baslat);
})();
