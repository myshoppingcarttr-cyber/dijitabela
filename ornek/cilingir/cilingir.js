/* G-36 · Çilingir: "en yakın usta ~X dk" + kapı tipi → fiyat aralığı. Kurgusal örnek veri. */
(function () {
  'use strict';
  var USTALAR = [
    { ad: 'Usta Kerem', semt: 'Konyaaltı', lat: 36.8860, lon: 30.6370, arac: 'Motosiklet' },
    { ad: 'Usta Selim', semt: 'Lara', lat: 36.8580, lon: 30.7900, arac: 'Araç' },
    { ad: 'Usta Orhan', semt: 'Kepez', lat: 36.9420, lon: 30.7050, arac: 'Araç' },
    { ad: 'Usta Barış', semt: 'Muratpaşa', lat: 36.8890, lon: 30.7040, arac: 'Motosiklet' },
    { ad: 'Usta Tuncay', semt: 'Meltem', lat: 36.8780, lon: 30.6720, arac: 'Araç' },
    { ad: 'Usta Emre', semt: 'Döşemealtı', lat: 37.0070, lon: 30.6200, arac: 'Araç' }
  ];
  var SEMTLER = {
    'Konyaaltı': [36.8800, 30.6400], 'Lara': [36.8600, 30.7800], 'Kepez': [36.9300, 30.7100],
    'Muratpaşa': [36.8900, 30.7000], 'Meltem': [36.8770, 30.6800], 'Döşemealtı': [36.9900, 30.6300],
    'Güzeloba': [36.8720, 30.7500], 'Çallı': [36.8950, 30.6800]
  };
  var KAPILAR = {
    celik: { ad: 'Çelik kapı açma', min: 650, max: 1100, sure: 15 },
    oto: { ad: 'Oto kapısı açma', min: 750, max: 1400, sure: 20 },
    kasa: { ad: 'Kasa açma', min: 1200, max: 2500, sure: 45 },
    degisim: { ad: 'Kilit değişimi', min: 900, max: 1800, sure: 30 }
  };
  function mesafe(a, b) { // km, haversine
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * rad, dLon = (b[1] - a[1]) * rad;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function dakika(km, arac) { // yol katsayısı 1,35; şehir içi ort. hız araç 32, motosiklet 40 km/sa; +3 dk hazırlanma
    var hiz = arac === 'Motosiklet' ? 40 : 32;
    return Math.max(4, Math.round((km * 1.35 / hiz) * 60 + 3));
  }
  function enYakin(nokta) {
    return USTALAR.map(function (u) {
      var km = mesafe(nokta, [u.lat, u.lon]);
      return { u: u, km: km, dk: dakika(km, u.arac) };
    }).sort(function (a, b) { return a.dk - b.dk; });
  }
  function tl(n) { return n.toLocaleString('tr-TR') + ' TL'; }
  function $(id) { return document.getElementById(id); }

  function goster(nokta, kaynak) {
    var s = enYakin(nokta), cikti = $('sonuc');
    if (!cikti) return;
    var ilk = s[0];
    var html = '<div class="sn-ana"><span class="sn-dk">~' + ilk.dk + ' dk</span><span class="sn-ad">' + ilk.u.ad + ' · ' + ilk.u.semt + '</span><span class="sn-alt">' + ilk.km.toFixed(1) + ' km · ' + ilk.u.arac + ' · ' + kaynak + '</span></div><ul class="sn-liste">';
    s.slice(1, 4).forEach(function (x) { html += '<li><b>' + x.u.ad + '</b> ' + x.u.semt + ' <span>~' + x.dk + ' dk</span></li>'; });
    html += '</ul><p class="sn-not">Kurgusal örnek veri: gerçek ustalar değil. Süre kuş uçuşu mesafeden tahmindir.</p>';
    cikti.innerHTML = html;
    cikti.className = 'sonuc var';
    cikti.dispatchEvent(new CustomEvent('sonuc', { detail: ilk }));
  }
  function konumIste() {
    var d = $('durum');
    if (!navigator.geolocation) { if (d) d.textContent = 'Tarayıcı konum vermiyor; semt seçin.'; return; }
    if (d) d.textContent = 'Konum alınıyor…';
    navigator.geolocation.getCurrentPosition(function (p) {
      if (d) d.textContent = 'Konumunuz alındı (cihazda kalır, kaydedilmez).';
      goster([p.coords.latitude, p.coords.longitude], 'konumunuza göre');
    }, function () {
      if (d) d.textContent = 'Konum izni verilmedi; aşağıdan semt seçin.';
      var s = $('semt'); if (s) s.focus();
    }, { timeout: 8000, maximumAge: 60000 });
  }
  function fiyat(kod) {
    var k = KAPILAR[kod], c = $('fiyat');
    if (!k || !c) return;
    c.innerHTML = '<span class="fy-ad">' + k.ad + '</span><span class="fy-aralik">' + tl(k.min) + ' – ' + tl(k.max) + '</span><span class="fy-alt">Tahmini işlem süresi ~' + k.sure + ' dk · gece 23:00–06:00 arası ek ücret ayrıca bildirilir · kesin tutar usta gelince, işlemden önce söylenir.</span>';
    c.className = 'fiyat var';
    document.querySelectorAll('[data-kapi]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-kapi') === kod ? 'true' : 'false'); });
  }
  function baslat() {
    var b = $('btn-konum'); if (b) b.addEventListener('click', konumIste);
    var s = $('semt');
    if (s) {
      Object.keys(SEMTLER).forEach(function (a) { var o = document.createElement('option'); o.value = a; o.textContent = a; s.appendChild(o); });
      s.addEventListener('change', function () { if (s.value && SEMTLER[s.value]) goster(SEMTLER[s.value], s.value + ' semtine göre'); });
    }
    document.querySelectorAll('[data-kapi]').forEach(function (el) { el.addEventListener('click', function () { fiyat(el.getAttribute('data-kapi')); }); });
    var a = $('arama-form');
    if (a) a.addEventListener('submit', function (e) { e.preventDefault(); });
    window.__cilingir = { goster: goster, fiyat: fiyat, enYakin: enYakin, KAPILAR: KAPILAR };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();
})();
