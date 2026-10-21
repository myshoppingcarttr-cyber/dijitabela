/* Dijitabela · Maliyet hesaplayıcı (BNL / Erkam Benli) — bağımsız bileşen
   Kullanım: <div id="maliyet-hesap" data-stil="minimal|modern|klasik|sicak" data-wa="905542540253"></div>
   API: window.DJMaliyet = { stilSec(stil), malzemeEkle(id), ... }
   Olay: document üzerinde "djmaliyet:sonuc" {toplam, alt, ust}
   Ortak veri: localStorage "djm_erkam_v1" (panel/index.html ile paylaşılır) */
(function () {
  'use strict';
  var KEY = 'djm_erkam_v1', MOODKEY = 'djm_erkam_mood', VARSAYILAN_WA = '905542540253';

  var ODALAR = [
    { id: 'oturma', ad: 'Oturma odası', m2: 24 }, { id: 'yatak', ad: 'Yatak odası', m2: 16 },
    { id: 'mutfak', ad: 'Mutfak', m2: 12 }, { id: 'banyo', ad: 'Banyo', m2: 6 },
    { id: 'cocuk', ad: 'Çocuk odası', m2: 12 }, { id: 'ofis', ad: 'Ofis', m2: 20 },
    { id: 'komple', ad: 'Komple daire', m2: 100 }
  ];
  var KALITE = [{ id: 'eko', ad: 'Ekonomik' }, { id: 'orta', ad: 'Orta' }, { id: 'luks', ad: 'Lüks' }];
  var TUM = ['oturma', 'yatak', 'mutfak', 'banyo', 'cocuk', 'ofis', 'komple'];

  /* ---------- varsayılan ÖRNEK veri ---------- */
  function k(id, ad, birim, e, o, l, odalar) { return { id: id, ad: ad, birim: birim, fiyat: { eko: e, orta: o, luks: l }, gorsel: '', odalar: odalar, ornek: true }; }
  function varsayilan() {
    return {
      katalog: [
        k('boya', 'İç cephe boya', 'm²', 180, 260, 420, TUM),
        k('parke', 'Laminat parke / zemin', 'm²', 650, 1100, 2400, ['oturma', 'yatak', 'cocuk', 'ofis', 'komple']),
        k('tavan', 'Alçı / asma tavan', 'm²', 550, 800, 1300, TUM),
        k('spot', 'Spot aydınlatma', 'adet', 450, 900, 2000, TUM),
        k('dolap', 'Mutfak dolabı', 'mtül', 9000, 15000, 28000, ['mutfak', 'komple']),
        k('tezgah', 'Tezgâh', 'mtül', 4000, 8000, 18000, ['mutfak', 'komple']),
        k('seramik', 'Seramik / fayans', 'm²', 700, 1200, 2800, ['mutfak', 'banyo', 'komple']),
        k('vitrifiye', 'Vitrifiye takımı', 'adet', 12000, 25000, 60000, ['banyo', 'komple']),
        k('kapi', 'İç kapı', 'adet', 7000, 12000, 25000, TUM),
        k('perde', 'Perde', 'm²', 600, 1100, 2500, ['oturma', 'yatak', 'cocuk', 'ofis', 'komple']),
        k('oturma', 'Oturma grubu', 'adet', 35000, 70000, 160000, ['oturma', 'komple']),
        k('tv', 'TV ünitesi', 'adet', 12000, 25000, 60000, ['oturma', 'komple']),
        k('gardirop', 'Gardırop', 'mtül', 8000, 14000, 30000, ['yatak', 'cocuk', 'komple']),
        k('calisma', 'Çalışma masası', 'adet', 6000, 12000, 30000, ['cocuk', 'ofis']),
        k('panel', 'Dekoratif duvar paneli', 'm²', 1400, 2600, 5200, ['oturma', 'yatak', 'ofis']),
        k('ankastre', 'Ankastre set', 'adet', 18000, 35000, 80000, ['mutfak', 'komple']),
        k('iscilik', 'Usta işçilik', 'gün', 3500, 4000, 5000, TUM)
      ],
      sablonlar: {
        oturma: { kalemler: [{ id: 'boya', formul: 'm2*2.7' }, { id: 'parke', formul: 'm2' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/4' }, { id: 'kapi', formul: '1' }, { id: 'perde', formul: 'm2*0.6' }, { id: 'oturma', formul: '1' }, { id: 'tv', formul: '1' }, { id: 'iscilik', formul: 'm2/6' }] },
        yatak: { kalemler: [{ id: 'boya', formul: 'm2*2.7' }, { id: 'parke', formul: 'm2' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/5' }, { id: 'kapi', formul: '1' }, { id: 'perde', formul: 'm2*0.6' }, { id: 'gardirop', formul: '3' }, { id: 'iscilik', formul: 'm2/6' }] },
        mutfak: { kalemler: [{ id: 'boya', formul: 'm2*1.5' }, { id: 'seramik', formul: 'm2*2.2' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/3' }, { id: 'dolap', formul: 'm2*0.5' }, { id: 'tezgah', formul: 'm2*0.4' }, { id: 'kapi', formul: '1' }, { id: 'iscilik', formul: 'm2/2.5' }] },
        banyo: { kalemler: [{ id: 'seramik', formul: 'm2*3.5' }, { id: 'vitrifiye', formul: '1' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/2' }, { id: 'kapi', formul: '1' }, { id: 'iscilik', formul: 'm2/1.5' }] },
        cocuk: { kalemler: [{ id: 'boya', formul: 'm2*2.7' }, { id: 'parke', formul: 'm2' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/5' }, { id: 'kapi', formul: '1' }, { id: 'perde', formul: 'm2*0.6' }, { id: 'gardirop', formul: '2.5' }, { id: 'calisma', formul: '1' }, { id: 'iscilik', formul: 'm2/6' }] },
        ofis: { kalemler: [{ id: 'boya', formul: 'm2*2.7' }, { id: 'parke', formul: 'm2' }, { id: 'tavan', formul: 'm2' }, { id: 'spot', formul: 'm2/4' }, { id: 'kapi', formul: '1' }, { id: 'calisma', formul: '1' }, { id: 'iscilik', formul: 'm2/6' }] },
        komple: { kalemler: [{ id: 'boya', formul: 'm2*2.7' }, { id: 'parke', formul: 'm2*0.55' }, { id: 'seramik', formul: 'm2*0.4' }, { id: 'tavan', formul: 'm2*0.8' }, { id: 'spot', formul: 'm2/4' }, { id: 'dolap', formul: 'm2*0.05' }, { id: 'tezgah', formul: 'm2*0.04' }, { id: 'vitrifiye', formul: 'm2/50' }, { id: 'kapi', formul: 'm2/15' }, { id: 'perde', formul: 'm2*0.25' }, { id: 'iscilik', formul: 'm2/1.5' }] }
      },
      ayar: { iscilikYuzde: 15, karYuzde: 12, kdv: 20, gecerlilik: '2026-10-31', pesinIndirim: 5 },
      kampanyalar: [{ kod: 'ACILIS10', yuzde: 10, bitis: '2026-12-31' }],
      talepler: [],
      meta: { guncelleme: null }
    };
  }

  function yukle() {
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { v = null; }
    var d = varsayilan();
    if (!v || typeof v !== 'object' || !Array.isArray(v.katalog)) return d;
    v.sablonlar = v.sablonlar || d.sablonlar;
    v.ayar = Object.assign({}, d.ayar, v.ayar || {});
    v.kampanyalar = Array.isArray(v.kampanyalar) ? v.kampanyalar : d.kampanyalar;
    v.talepler = Array.isArray(v.talepler) ? v.talepler : [];
    v.meta = v.meta || { guncelleme: null };
    return v;
  }
  function kaydet(v) {
    v.meta = v.meta || {};
    v.meta.guncelleme = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  /* ---------- güvenli formül (eval YOK): yalnız m2, sayı, + - * / ( ) ---------- */
  function formulHesapla(f, m2) {
    f = String(f == null ? '' : f).replace(/,/g, '.').toLowerCase();
    if (!f.trim() || f.length > 80 || !/^[0-9m2+\-*/().\s]+$/.test(f)) return NaN;
    var tok = [], re = /\s*(\d+\.?\d*|\.\d+|m2|[()+\-*\/])/y, m, pos = 0;
    while (pos < f.length) {
      re.lastIndex = pos; m = re.exec(f);
      if (!m) { if (/^\s*$/.test(f.slice(pos))) break; return NaN; }
      tok.push(m[1]); pos = re.lastIndex;
    }
    var i = 0, hata = false;
    function ifade() { var a = terim(); while (tok[i] === '+' || tok[i] === '-') { var o = tok[i++], b = terim(); a = o === '+' ? a + b : a - b; } return a; }
    function terim() { var a = carp(); while (tok[i] === '*' || tok[i] === '/') { var o = tok[i++], b = carp(); a = o === '*' ? a * b : a / b; } return a; }
    function carp() {
      var t = tok[i++];
      if (t === '-') return -carp();
      if (t === '+') return carp();
      if (t === '(') { var a = ifade(); if (tok[i++] !== ')') hata = true; return a; }
      if (t === 'm2') return Number(m2) || 0;
      if (t !== undefined && /^[0-9.]+$/.test(t)) return parseFloat(t);
      hata = true; return NaN;
    }
    var r = ifade();
    if (hata || i !== tok.length || !isFinite(r)) return NaN;
    return r;
  }
  function formulGecerli(f) { return !isNaN(formulHesapla(f, 10)); }

  /* ---------- hesap çekirdeği ---------- */
  function bul(veri, id) { for (var i = 0; i < veri.katalog.length; i++) if (veri.katalog[i].id === id) return veri.katalog[i]; return null; }
  function miktarYuvarla(birim, q) { q = Math.max(0, q); return (birim === 'adet' || birim === 'gün') ? Math.ceil(q - 1e-9) : Math.round(q * 10) / 10; }
  function odaAd(id) { for (var i = 0; i < ODALAR.length; i++) if (ODALAR[i].id === id) return ODALAR[i].ad; return id; }
  function kaliteAd(id) { for (var i = 0; i < KALITE.length; i++) if (KALITE[i].id === id) return KALITE[i].ad; return id; }
  function sablonIdleri(veri, oda) { var s = veri.sablonlar[oda]; return s && s.kalemler ? s.kalemler.map(function (x) { return x.id; }) : []; }
  function varsayilanMiktar(veri, oda, id, m2) {
    var s = veri.sablonlar[oda], it = bul(veri, id);
    if (s) for (var i = 0; i < s.kalemler.length; i++) if (s.kalemler[i].id === id) { var r = formulHesapla(s.kalemler[i].formul, m2); if (!isNaN(r)) return r; }
    if (!it) return 0;
    return it.birim === 'm²' ? m2 * 0.5 : it.birim === 'mtül' ? 3 : 1;
  }

  /* bir oda kalemi: {oda, m2, kalite, secili:{id:true}, ekstra:{id:miktar}} */
  function odaHesapla(veri, o, kalite) {
    var kal = kalite || o.kalite, m2 = Number(o.m2) || 0, satirlar = [], ara = 0, gun = 0, iscilikVar = false, imalat = false;
    if (m2 <= 0) return { ad: odaAd(o.oda), m2: 0, kalite: kal, satirlar: [], ara: 0, isciPay: 0, toplam: 0, sure: 0 };
    var sablon = sablonIdleri(veri, o.oda), ids = [];
    sablon.forEach(function (id) { if (o.secili[id]) ids.push([id, null]); });
    Object.keys(o.ekstra || {}).forEach(function (id) { if (o.secili[id] && sablon.indexOf(id) < 0) ids.push([id, o.ekstra[id]]); });
    ids.forEach(function (p) {
      var it = bul(veri, p[0]); if (!it) return;
      var q = miktarYuvarla(it.birim, p[1] != null ? Number(p[1]) : varsayilanMiktar(veri, o.oda, p[0], m2));
      if (q <= 0) return;
      var bf = Number(it.fiyat[kal]) || 0, t = q * bf;
      satirlar.push({ id: it.id, ad: it.ad, miktar: q, birim: it.birim, bf: bf, tutar: t, gun: it.birim === 'gün' });
      ara += t;
      if (it.birim === 'gün') { iscilikVar = true; gun += q; }
      if (/dolap|gardirop|kapi|oturma|tv|calisma|panel|ankastre/.test(it.id)) imalat = true;
    });
    var malz = satirlar.filter(function (s) { return !s.gun; }).reduce(function (a, s) { return a + s.tutar; }, 0);
    var isciPay = iscilikVar ? malz * (veri.ayar.iscilikYuzde / 100) : 0;
    var sure = satirlar.length ? Math.max(Math.ceil(gun / 2) + 5, imalat ? 14 : 0) : 0;
    return { ad: odaAd(o.oda), m2: m2, kalite: kal, satirlar: satirlar, ara: ara, isciPay: isciPay, toplam: ara + isciPay, sure: sure };
  }
  function sepetHesapla(veri, odalar, kod, kaliteGecersiz) {
    var rows = odalar.map(function (o) { return odaHesapla(veri, o, kaliteGecersiz); });
    var ara = rows.reduce(function (a, r) { return a + r.toplam; }, 0);
    var kar = ara * (veri.ayar.karYuzde / 100), brut = ara + kar;
    var kam = kampanyaBul(veri, kod), ind = kam && kam.gecerli ? brut * kam.yuzde / 100 : 0;
    var toplam = brut - ind, sure = rows.reduce(function (a, r) { return a + r.sure; }, 0);
    if (rows.filter(function (r) { return r.sure; }).length > 1) sure = Math.round(sure * 0.75);
    return { odalar: rows, ara: ara, kar: kar, brut: brut, indirim: ind, kampanya: kam, toplam: toplam, alt: toplam * 0.9, ust: toplam * 1.1, kdvDahil: toplam * (1 + veri.ayar.kdv / 100), sure: sure,
      m2: rows.reduce(function (a, r) { return a + r.m2; }, 0) };
  }
  function kampanyaBul(veri, kod) {
    kod = String(kod || '').trim().toUpperCase(); if (!kod) return null;
    for (var i = 0; i < veri.kampanyalar.length; i++) {
      var c = veri.kampanyalar[i];
      if (String(c.kod).trim().toUpperCase() === kod) {
        var ok = true; if (c.bitis) { var b = new Date(c.bitis + 'T23:59:59'); if (!isNaN(b) && b < new Date()) ok = false; }
        return { kod: kod, yuzde: Number(c.yuzde) || 0, gecerli: ok };
      }
    }
    return { kod: kod, yuzde: 0, gecerli: false, yok: true };
  }

  /* ---------- yardımcılar ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tl(n) { return Math.round(n).toLocaleString('tr-TR') + ' ₺'; }
  function sayi(n) { return Math.round(n).toLocaleString('tr-TR'); }
  function saat(iso) { if (!iso) return null; var d = new Date(iso); if (isNaN(d)) return null; return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function tarihTR(s) { var d = new Date(s + 'T00:00:00'); return isNaN(d) ? s : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }

  var PAL = [['#e3dfd6', '#cfc8ba'], ['#b8aa92', '#9d8e74'], ['#4b4037', '#2c2520']];
  var SW = {
    boya: ['#ece9e2', '#cdbfa6', '#4f5a52'],
    parke: ['repeating-linear-gradient(90deg,#d7bd95 0 46px,#cdb086 46px 48px)', 'repeating-linear-gradient(90deg,#b98d5c 0 34px,#a97f50 34px 36px)', 'repeating-linear-gradient(45deg,#4a3223 0 18px,#3d281c 18px 36px)'],
    tavan: ['#f2f1ee', 'linear-gradient(#f4f3f0 78%,#ffe9bd 78% 84%,#f4f3f0 84%)', 'linear-gradient(#e9e5dc 70%,#f3cf8b 70% 78%,#2b2824 78%)'],
    spot: ['radial-gradient(circle,#fff 0 4px,transparent 5px) 0 0/34px 34px,#2b2b2b', 'radial-gradient(circle,#fff3c4 0 6px,#e9c06a55 7px,transparent 14px) 0 0/40px 40px,#222', 'radial-gradient(circle,#fff6d6 0 7px,#f0c46c88 8px,transparent 20px) 0 0/48px 48px,#16130f'],
    dolap: ['#d8d2c6', 'linear-gradient(90deg,#e6e2da 0 49%,#d5d0c6 49% 51%,#e6e2da 51%)', 'repeating-linear-gradient(90deg,#5b3d28 0 6px,#4d3322 6px 9px)'],
    tezgah: ['#bdb7ac', 'radial-gradient(circle at 20% 30%,#fff8 0 2px,transparent 3px) 0 0/16px 16px,#8b8a86', 'linear-gradient(115deg,#f3f1ee 0 40%,#d8d5d0 41% 42%,#f3f1ee 43% 70%,#c9c5be 71% 72%,#f3f1ee 73%)'],
    seramik: ['linear-gradient(#0003 1px,transparent 1px) 0 0/30px 30px,linear-gradient(90deg,#0003 1px,transparent 1px) 0 0/30px 30px,#d7d3cb', 'linear-gradient(#0003 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,#0003 1px,transparent 1px) 0 0/44px 44px,#c3b9a6', 'linear-gradient(#0002 1px,transparent 1px) 0 0/64px 64px,linear-gradient(90deg,#0002 1px,transparent 1px) 0 0/64px 64px,linear-gradient(120deg,#ece9e3,#d3cec4 45%,#efece6)'],
    perde: ['repeating-linear-gradient(90deg,#e7e2d7 0 10px,#ddd6c8 10px 20px)', 'repeating-linear-gradient(90deg,#c9bfa9 0 12px,#b9ad94 12px 24px)', 'repeating-linear-gradient(90deg,#5a4a52 0 14px,#4a3c43 14px 28px)']
  };
  function swatch(it, ki) {
    if (it && it.gorsel) return 'background:url(' + String(it.gorsel).replace(/[()'"\\\s]/g, encodeURIComponent) + ') center/cover,#ddd';
    var s = SW[it && it.id];
    if (s) return 'background:' + s[ki];
    var p = PAL[ki]; return 'background:linear-gradient(135deg,' + p[0] + ',' + p[1] + ')';
  }

  /* ---------- GSAP (isteğe bağlı) ---------- */
  var gsapBekle = false;
  function gsapYukle() {
    if (typeof gsap !== 'undefined' || gsapBekle) return;
    if (document.querySelector('script[src*="gsap"]')) return;
    gsapBekle = true;
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.async = true; s.onerror = function () { gsapBekle = false; };
    document.head.appendChild(s);
  }
  var azHareket = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || /hareketsiz/.test(location.search);
  function gOk() { return typeof gsap !== 'undefined' && !azHareket; }

  /* ---------- bileşen ---------- */
  var kok = null, veri = null, durum = null, gosterilen = 0, sayacTween = null, panelUrl = '#', mood = [];

  function yeniTaslak(oda, m2) {
    oda = oda || 'oturma';
    var t = { oda: oda, m2: m2 == null ? (ODALAR.filter(function (x) { return x.id === oda; })[0] || {}).m2 : m2, kalite: durum ? durum.kalite : 'orta', secili: {}, ekstra: {} };
    sablonIdleri(veri, oda).forEach(function (id) { t.secili[id] = true; });
    return t;
  }
  function moodYukle() { try { var m = JSON.parse(localStorage.getItem(MOODKEY)); if (Array.isArray(m)) return m; } catch (e) {} return []; }
  function moodKaydet() { try { localStorage.setItem(MOODKEY, JSON.stringify(mood)); } catch (e) {} }

  var ADIMLAR = ['Oda', 'Metrekare', 'İşler', 'Kalite', 'Ekstralar'];

  function iskelet() {
    kok.classList.add('djm');
    kok.innerHTML =
      '<div class="djm-baslik"><div><span class="djm-etiket">Maliyet hesaplayıcı</span><h2 class="djm-h">Projenizin yaklaşık maliyetini 2 dakikada görün</h2>' +
      '<p class="djm-alt">Odayı seçin, metrekareyi yazın, işleri ve kaliteyi belirleyin. Sonuç anında hesaplanır.</p></div>' +
      '<a class="djm-rozet" data-r href="' + esc(panelUrl) + '" target="_blank" rel="noopener"><i></i><span data-rozet></span></a></div>' +
      '<div class="djm-izgara"><div class="djm-sol">' +
      '<div class="djm-kart djm-sihirbaz"><ol class="djm-adimlar" data-adimlar></ol><div class="djm-adim-govde" data-govde></div>' +
      '<div class="djm-nav"><button type="button" class="djm-dg djm-ikinci" data-act="geri">← Geri</button><button type="button" class="djm-dg" data-act="ileri">İleri →</button></div></div>' +
      '<div class="djm-kart" data-sepet></div>' +
      '</div><div class="djm-sag"><div class="djm-kart djm-sonuc">' +
      '<div data-sonuc></div>' +
      '<div class="djm-kod"><label>İndirim kodu<span class="djm-ipucu">örn. ACILIS10</span></label><div class="djm-satir"><input type="text" data-kod autocomplete="off" placeholder="Kodunuz" maxlength="24"><button type="button" class="djm-dg djm-ikinci" data-act="kod">Uygula</button></div><div class="djm-kodmsg" data-kodmsg aria-live="polite"></div></div>' +
      '<div data-odeme></div>' +
      '<div class="djm-teklif"><label>Detaylı teklif için bilgileriniz</label><div class="djm-satir djm-iki"><input type="text" data-ad placeholder="Adınız" autocomplete="name" maxlength="60"><input type="tel" data-tel placeholder="Telefon (05xx…)" autocomplete="tel" maxlength="20"></div>' +
      '<button type="button" class="djm-dg djm-blok" data-act="teklif">Detaylı teklif iste · WhatsApp</button>' +
      '<button type="button" class="djm-dg djm-ikinci djm-blok" data-act="yazdir">PDF olarak indir / yazdır</button>' +
      '<div class="djm-teklifmsg" data-teklifmsg aria-live="polite"></div></div>' +
      '<p class="djm-uyari"><b>Ortalama fiyattır, keşif sonrası kesinleşir.</b> Tüm fiyatlar <u>örnek fiyat</u> olup KDV hariçtir; ölçüler ve seçimler keşifte netleşir.</p>' +
      '</div></div></div>' +
      '<div class="djm-alt-bolum"><div class="djm-kart" data-karsilastir></div><div class="djm-kart" data-mood></div></div>' +
      '<div class="djm-dokum" data-dokum></div>';
  }

  function rozetCiz() {
    var s = saat(veri.meta && veri.meta.guncelleme), el = kok.querySelector('[data-rozet]');
    el.innerHTML = 'Fiyatlar yönetici panelinden geliyor · ' + (s ? 'son güncelleme <b>' + s + '</b>' : '<b>örnek veri</b>') + ' · <u>Panel</u>';
  }

  function adimCiz(anim) {
    var o = durum.taslak, g = kok.querySelector('[data-govde]'), h = '';
    kok.querySelector('[data-adimlar]').innerHTML = ADIMLAR.map(function (a, i) {
      return '<li class="' + (i === durum.adim ? 'on' : i < durum.adim ? 'bit' : '') + '"><button type="button" data-act="adim" data-i="' + i + '"><b>' + (i + 1) + '</b><span>' + a + '</span></button></li>';
    }).join('');
    if (durum.adim === 0) {
      h = '<h3>Hangi mekân?</h3><div class="djm-odalar">' + ODALAR.map(function (r) {
        return '<button type="button" class="djm-oda' + (o.oda === r.id ? ' on' : '') + '" data-act="oda" data-id="' + r.id + '"><span>' + esc(r.ad) + '</span></button>';
      }).join('') + '</div>';
    } else if (durum.adim === 1) {
      h = '<h3>Kaç metrekare?</h3><div class="djm-m2"><input type="number" inputmode="decimal" min="1" max="2000" step="1" data-m2 value="' + (o.m2 == null ? '' : o.m2) + '" aria-label="Metrekare"><span>m²</span></div>' +
        '<input type="range" min="3" max="' + (o.oda === 'komple' ? 300 : 80) + '" step="1" data-m2r value="' + Math.min(Number(o.m2) || 0, o.oda === 'komple' ? 300 : 80) + '" aria-label="Metrekare çubuğu">' +
        '<p class="djm-ipucu">' + esc(odaAd(o.oda)) + ' için genelde ' + (o.oda === 'komple' ? '70–180' : o.oda === 'banyo' ? '4–9' : o.oda === 'mutfak' ? '8–18' : '12–30') + ' m² arası.</p>';
    } else if (durum.adim === 2) {
      var ids = sablonIdleri(veri, o.oda);
      h = '<h3>Hangi işler yapılacak?</h3><div class="djm-isler">' + ids.map(function (id) {
        var it = bul(veri, id); if (!it) return '';
        return '<label class="djm-is"><input type="checkbox" data-sec="' + esc(id) + '"' + (o.secili[id] ? ' checked' : '') + '><span class="djm-kutu"></span><span class="djm-isad">' + esc(it.ad) + '<small>' + esc(it.birim) + ' · ' + tl(it.fiyat[o.kalite]) + ' <em>örnek</em></small></span>' +
          '<button type="button" class="djm-pano" title="Malzeme panosuna ekle" data-act="mood" data-id="' + esc(id) + '">+ pano</button></label>';
      }).join('') + '</div>';
    } else if (durum.adim === 3) {
      h = '<h3>Malzeme kalitesi</h3><div class="djm-kaliteler">' + KALITE.map(function (q, i) {
        return '<button type="button" class="djm-kalite' + (o.kalite === q.id ? ' on' : '') + '" data-act="kalite" data-id="' + q.id + '"><span class="djm-nokta" style="' + swatch(bul(veri, 'boya'), i) + '"></span><b>' + q.ad + '</b><small>' + ['Sade, uygun bütçe', 'Dengeli, dayanıklı', 'Seçkin, uzun ömürlü'][i] + '</small></button>';
      }).join('') + '</div>';
    } else {
      var ekler = veri.katalog.filter(function (it) { return it.odalar && it.odalar.indexOf(o.oda) > -1 && sablonIdleri(veri, o.oda).indexOf(it.id) < 0; });
      h = '<h3>İsteğe bağlı ekstralar</h3>' + (ekler.length ? '<div class="djm-isler">' + ekler.map(function (it) {
        var q = o.ekstra[it.id] != null ? o.ekstra[it.id] : varsayilanMiktar(veri, o.oda, it.id, Number(o.m2) || 0);
        return '<div class="djm-is djm-ek"><label class="djm-ekl"><input type="checkbox" data-sec="' + esc(it.id) + '"' + (o.secili[it.id] ? ' checked' : '') + '><span class="djm-kutu"></span><span class="djm-isad">' + esc(it.ad) + '<small>' + tl(it.fiyat[o.kalite]) + ' / ' + esc(it.birim) + ' <em>örnek</em></small></span></label>' +
          '<input type="number" min="0" step="' + (it.birim === 'adet' || it.birim === 'gün' ? 1 : 0.5) + '" data-ekm="' + esc(it.id) + '" value="' + (Math.round(q * 10) / 10) + '" aria-label="' + esc(it.ad) + ' miktar"><span class="djm-birim">' + esc(it.birim) + '</span></div>';
      }).join('') + '</div>' : '<p class="djm-ipucu">Bu mekân için ekstra kalem tanımlı değil.</p>') +
        '<button type="button" class="djm-dg djm-blok" data-act="ekle">Bu odayı sepete ekle ve yeni oda seç</button>';
    }
    g.innerHTML = h;
    var geri = kok.querySelector('[data-act="geri"]'), ileri = kok.querySelector('[data-act="ileri"]');
    geri.disabled = durum.adim === 0; ileri.style.visibility = durum.adim === ADIMLAR.length - 1 ? 'hidden' : 'visible';
    if (anim && gOk()) gsap.fromTo(g, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out', clearProps: 'opacity,transform' });
  }

  function sepetCiz() {
    var el = kok.querySelector('[data-sepet]');
    if (!durum.sepet.length) { el.innerHTML = '<h3 class="djm-h3">Sepet</h3><p class="djm-ipucu">Birden fazla oda ekleyip toplamı görebilirsiniz (komple ev için ideal). Sihirbazın son adımında “sepete ekle” deyin.</p>'; return; }
    el.innerHTML = '<h3 class="djm-h3">Sepet · ' + durum.sepet.length + ' oda</h3><ul class="djm-sepet">' + durum.sepet.map(function (o, i) {
      return '<li><span><b>' + esc(odaAd(o.oda)) + '</b> · ' + sayi(o.m2) + ' m² · ' + kaliteAd(o.kalite) + '</span><button type="button" data-act="sil" data-i="' + i + '" aria-label="Çıkar">×</button></li>';
    }).join('') + '</ul>';
  }

  function tumOdalar() { var l = durum.sepet.slice(); if ((Number(durum.taslak.m2) || 0) > 0) l.push(durum.taslak); return l; }

  function sonucCiz() {
    var r = hesapla(), el = kok.querySelector('[data-sonuc]');
    durum.son = r;
    if (!r.m2) { el.innerHTML = '<div class="djm-bos">Metrekare girin; maliyet burada görünecek.</div>'; odemeCiz(r); dokumCiz(r); sayacTween && sayacTween.kill(); gosterilen = 0; olayYay(r); return; }
    var h = '<div class="djm-toplam-etiket">Tahmini toplam <span class="djm-ornek">örnek fiyat</span></div><div class="djm-toplam"><b data-top>' + tl(gosterilen) + '</b></div>' +
      '<div class="djm-aralik">Beklenen aralık: <b>' + tl(r.alt) + '</b> – <b>' + tl(r.ust) + '</b> <small>(±%10)</small></div>' +
      '<div class="djm-meta"><span>KDV hariç</span><span>≈ ' + tl(r.kdvDahil) + ' KDV dahil (%' + veri.ayar.kdv + ')</span><span>Tahmini süre: <b>' + r.sure + ' gün</b></span></div>';
    h += '<div class="djm-dokumtablo">';
    r.odalar.forEach(function (od) {
      if (!od.satirlar.length) return;
      h += '<div class="djm-odabas"><b>' + esc(od.ad) + '</b> · ' + sayi(od.m2) + ' m² · ' + kaliteAd(od.kalite) + '</div><div class="djm-tbl"><table><tbody>';
      od.satirlar.forEach(function (s) { h += '<tr><td>' + esc(s.ad) + '</td><td class="s">' + sayi(s.miktar) + ' ' + esc(s.birim) + '</td><td class="s">' + tl(s.tutar) + '</td></tr>'; });
      if (od.isciPay) h += '<tr><td>Montaj ve uygulama payı (%' + veri.ayar.iscilikYuzde + ')</td><td class="s"></td><td class="s">' + tl(od.isciPay) + '</td></tr>';
      h += '</tbody></table></div>';
    });
    h += '<table class="djm-ozet"><tbody><tr><td>Ara toplam</td><td class="s">' + tl(r.ara) + '</td></tr><tr><td>Genel gider ve kâr (%' + veri.ayar.karYuzde + ')</td><td class="s">' + tl(r.kar) + '</td></tr>';
    if (r.indirim) h += '<tr class="ind"><td>İndirim (' + esc(r.kampanya.kod) + ' · %' + r.kampanya.yuzde + ')</td><td class="s">− ' + tl(r.indirim) + '</td></tr>';
    h += '<tr class="top"><td>Toplam (KDV hariç)</td><td class="s">' + tl(r.toplam) + '</td></tr></tbody></table></div>';
    h += '<p class="djm-gecer">Fiyatlar ' + esc(tarihTR(veri.ayar.gecerlilik)) + ' tarihine kadar geçerlidir.</p>';
    el.innerHTML = h;
    sayacAnim(r.toplam);
    odemeCiz(r); dokumCiz(r); olayYay(r);
  }

  function sayacAnim(hedef) {
    var b = kok.querySelector('[data-top]'); if (!b) return;
    sayacTween && sayacTween.kill();
    if (!gOk()) { gosterilen = hedef; b.textContent = tl(hedef); return; }
    var nesne = { v: gosterilen };
    sayacTween = gsap.to(nesne, { v: hedef, duration: .7, ease: 'power2.out', onUpdate: function () { gosterilen = nesne.v; var x = kok.querySelector('[data-top]'); if (x) x.textContent = tl(nesne.v); }, onComplete: function () { gosterilen = hedef; } });
  }

  function odemeCiz(r) {
    var el = kok.querySelector('[data-odeme]');
    if (!r.m2) { el.innerHTML = ''; return; }
    var pi = veri.ayar.pesinIndirim == null ? 5 : veri.ayar.pesinIndirim, pesin = r.toplam * (1 - pi / 100);
    el.innerHTML = '<div class="djm-odeme"><label>Ödeme planı simülasyonu</label><div class="djm-odemeler">' +
      '<button type="button" class="' + (durum.odeme === 'pesin' ? 'on' : '') + '" data-act="odeme" data-id="pesin"><b>Peşin</b><small>%' + pi + ' indirim</small><strong>' + tl(pesin) + '</strong></button>' +
      '<button type="button" class="' + (durum.odeme === '3' ? 'on' : '') + '" data-act="odeme" data-id="3"><b>3 aşamalı</b><small>%40 · %40 · %20</small><strong>' + tl(r.toplam) + '</strong></button></div>' +
      (durum.odeme === '3' ? '<ul class="djm-asama"><li><span>Sözleşme (%40)</span><b>' + tl(r.toplam * .4) + '</b></li><li><span>Kaba iş sonrası (%40)</span><b>' + tl(r.toplam * .4) + '</b></li><li><span>Teslim (%20)</span><b>' + tl(r.toplam * .2) + '</b></li></ul>' : '<p class="djm-ipucu">Peşin ödemede tahmini ' + tl(r.toplam - pesin) + ' avantaj.</p>') +
      '<p class="djm-ipucu">Simülasyondur; bağlayıcı sözleşme keşifte yapılır.</p></div>';
  }

  function hesapla() { return sepetHesapla(veri, tumOdalar(), durum.kod); }

  function olayYay(r) {
    var d = { toplam: Math.round(r.toplam), alt: Math.round(r.alt), ust: Math.round(r.ust) };
    try { var e = new CustomEvent('djmaliyet:sonuc', { detail: d, bubbles: true }); kok.dispatchEvent(e); } catch (x) {}
  }

  function karsilastirCiz() {
    var el = kok.querySelector('[data-karsilastir]'), o = durum.taslak, anahtar = ['boya', 'parke', 'seramik', 'tezgah', 'spot', 'dolap', 'kapi', 'perde'];
    var ids = sablonIdleri(veri, o.oda).filter(function (id) { return anahtar.indexOf(id) > -1; }).slice(0, 4);
    if (ids.length < 2) ids = sablonIdleri(veri, o.oda).slice(0, 4);
    var odalar = tumOdalar();
    el.innerHTML = '<h3 class="djm-h3">Kalite karşılaştırma</h3><p class="djm-ipucu">Aynı iş için üç kalite seviyesi · ' + esc(odaAd(o.oda)) + ' malzeme örnekleri. Karta tıklayınca kalite seçilir.</p><div class="djm-kmp">' + KALITE.map(function (q, i) {
      var tp = odalar.length ? sepetHesapla(veri, odalar, durum.kod, q.id).toplam : 0;
      return '<button type="button" class="djm-kk' + (o.kalite === q.id ? ' on' : '') + '" data-act="kalite" data-id="' + q.id + '"><div class="djm-kkb"><b>' + q.ad + '</b>' + (tp ? '<span>' + tl(tp) + '</span>' : '') + '</div><div class="djm-sw">' + ids.map(function (id) {
        var it = bul(veri, id); if (!it) return '';
        return '<span class="djm-swi"><i style="' + swatch(it, i) + '"></i><small>' + esc(it.ad) + '<br>' + tl(it.fiyat[q.id]) + '/' + esc(it.birim) + '</small></span>';
      }).join('') + '</div></button>';
    }).join('') + '</div><p class="djm-ipucu">Görseller temsili doku/renk örnekleridir; gerçek ürünler keşifte gösterilir. <span class="djm-ornek">örnek fiyat</span> · KDV hariç</p>';
  }

  function moodCiz() {
    var el = kok.querySelector('[data-mood]'), ki = Math.max(0, KALITE.map(function (q) { return q.id; }).indexOf(durum.taslak.kalite));
    var items = mood.map(function (id) { return bul(veri, id); }).filter(Boolean);
    el.innerHTML = '<h3 class="djm-h3">Malzeme panosu (moodboard)</h3>' + (items.length ?
      '<div class="djm-pano-izgara">' + items.map(function (it) {
        return '<figure><i style="' + swatch(it, ki) + '"></i><figcaption><b>' + esc(it.ad) + '</b><small>' + kaliteAd(durum.taslak.kalite) + ' · ' + tl(it.fiyat[durum.taslak.kalite]) + '/' + esc(it.birim) + '</small></figcaption><button type="button" data-act="moodsil" data-id="' + esc(it.id) + '" aria-label="Panodan çıkar">×</button></figure>';
      }).join('') + '</div>' : '<p class="djm-ipucu">Henüz malzeme yok. “İşler” adımında <b>+ pano</b> düğmesiyle seçtiğiniz malzemeler burada tek panoda toplanır.</p>');
  }

  function dokumCiz(r) {
    var el = kok.querySelector('[data-dokum]');
    if (!r.m2) { el.innerHTML = ''; return; }
    var h = '<h1>Erkam Benli · Mimarlık &amp; İç Mimarlık · Ön maliyet dökümü</h1><p>Tarih: ' + new Date().toLocaleDateString('tr-TR') + ' · Fiyatlar ' + esc(tarihTR(veri.ayar.gecerlilik)) + ' tarihine kadar geçerli · <b>KDV hariç · örnek fiyat</b></p>';
    r.odalar.forEach(function (od) {
      if (!od.satirlar.length) return;
      h += '<h2>' + esc(od.ad) + ' · ' + sayi(od.m2) + ' m² · ' + kaliteAd(od.kalite) + '</h2><table><thead><tr><th>Kalem</th><th>Miktar</th><th>Birim fiyat</th><th>Tutar</th></tr></thead><tbody>';
      od.satirlar.forEach(function (s) { h += '<tr><td>' + esc(s.ad) + '</td><td>' + sayi(s.miktar) + ' ' + esc(s.birim) + '</td><td>' + tl(s.bf) + '</td><td>' + tl(s.tutar) + '</td></tr>'; });
      if (od.isciPay) h += '<tr><td>Montaj ve uygulama payı (%' + veri.ayar.iscilikYuzde + ')</td><td></td><td></td><td>' + tl(od.isciPay) + '</td></tr>';
      h += '</tbody></table>';
    });
    h += '<table><tbody><tr><td>Ara toplam</td><td>' + tl(r.ara) + '</td></tr><tr><td>Genel gider ve kâr (%' + veri.ayar.karYuzde + ')</td><td>' + tl(r.kar) + '</td></tr>' + (r.indirim ? '<tr><td>İndirim (' + esc(r.kampanya.kod) + ')</td><td>− ' + tl(r.indirim) + '</td></tr>' : '') +
      '<tr><td><b>Toplam (KDV hariç)</b></td><td><b>' + tl(r.toplam) + '</b></td></tr><tr><td>Beklenen aralık (±%10)</td><td>' + tl(r.alt) + ' – ' + tl(r.ust) + '</td></tr><tr><td>Tahmini süre</td><td>' + r.sure + ' gün</td></tr></tbody></table>' +
      '<p><b>Ortalama fiyattır, keşif sonrası kesinleşir.</b> Bu döküm bağlayıcı bir teklif değildir.</p>';
    el.innerHTML = h;
  }

  /* ---------- olaylar ---------- */
  function odaDegistir(id) {
    var eski = durum.taslak;
    var m2 = eski.m2 && (eski.oda === id) ? eski.m2 : (ODALAR.filter(function (x) { return x.id === id; })[0] || {}).m2;
    durum.taslak = yeniTaslak(id, m2);
    durum.taslak.kalite = eski.kalite;
  }
  function git(i, anim) { durum.adim = Math.max(0, Math.min(ADIMLAR.length - 1, i)); adimCiz(anim !== false); }
  function hepsi() { sepetCiz(); sonucCiz(); karsilastirCiz(); moodCiz(); }

  function tikla(e) {
    var b = e.target.closest('[data-act]'); if (!b || !kok.contains(b)) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (a === 'ileri') git(durum.adim + 1);
    else if (a === 'geri') git(durum.adim - 1);
    else if (a === 'adim') git(+b.getAttribute('data-i'));
    else if (a === 'oda') { odaDegistir(id); git(1); hepsi(); }
    else if (a === 'kalite') { durum.taslak.kalite = id; durum.kalite = id; durum.sepet.forEach(function () {}); adimCiz(false); hepsi(); }
    else if (a === 'mood') { e.preventDefault(); malzemeEkle(id); }
    else if (a === 'moodsil') { mood = mood.filter(function (x) { return x !== id; }); moodKaydet(); moodCiz(); }
    else if (a === 'ekle') {
      if (!(Number(durum.taslak.m2) > 0)) { git(1); return; }
      durum.sepet.push(durum.taslak); durum.taslak = yeniTaslak(durum.taslak.oda === 'komple' ? 'oturma' : durum.taslak.oda, 0); durum.taslak.m2 = '';
      git(0); hepsi();
    }
    else if (a === 'sil') { durum.sepet.splice(+b.getAttribute('data-i'), 1); hepsi(); }
    else if (a === 'kod') kodUygula();
    else if (a === 'odeme') { durum.odeme = id; odemeCiz(durum.son); }
    else if (a === 'teklif') teklifGonder();
    else if (a === 'yazdir') yazdir();
  }
  function degis(e) {
    var t = e.target;
    if (t.hasAttribute('data-m2') || t.hasAttribute('data-m2r')) {
      var v = parseFloat(String(t.value).replace(',', '.'));
      durum.taslak.m2 = isNaN(v) ? '' : Math.max(0, Math.min(2000, v));
      var other = kok.querySelector(t.hasAttribute('data-m2') ? '[data-m2r]' : '[data-m2]'); if (other && document.activeElement !== other) other.value = durum.taslak.m2;
      sonucCiz(); karsilastirCiz();
    } else if (t.hasAttribute('data-sec')) {
      durum.taslak.secili[t.getAttribute('data-sec')] = t.checked; sonucCiz(); karsilastirCiz();
    } else if (t.hasAttribute('data-ekm')) {
      var q = parseFloat(String(t.value).replace(',', '.')); durum.taslak.ekstra[t.getAttribute('data-ekm')] = isNaN(q) ? 0 : q;
      var id = t.getAttribute('data-ekm'); if (q > 0 && !durum.taslak.secili[id]) { durum.taslak.secili[id] = true; var cb = kok.querySelector('[data-sec="' + id + '"]'); if (cb) cb.checked = true; }
      sonucCiz(); karsilastirCiz();
    }
  }
  function kodUygula() {
    var inp = kok.querySelector('[data-kod]'), msg = kok.querySelector('[data-kodmsg]'), kam = kampanyaBul(veri, inp.value);
    durum.kod = inp.value.trim();
    if (!kam) { msg.textContent = ''; msg.className = 'djm-kodmsg'; }
    else if (kam.yok) { msg.textContent = 'Bu kod tanınmadı.'; msg.className = 'djm-kodmsg hata'; }
    else if (!kam.gecerli) { msg.textContent = 'Bu kodun süresi dolmuş.'; msg.className = 'djm-kodmsg hata'; }
    else { msg.textContent = '%' + kam.yuzde + ' indirim uygulandı.'; msg.className = 'djm-kodmsg ok'; }
    sonucCiz(); karsilastirCiz();
  }
  function ozetMetni(r, ad, tel) {
    var satir = r.odalar.filter(function (o) { return o.m2; }).map(function (o) { return '• ' + o.ad + ' ' + sayi(o.m2) + ' m² (' + kaliteAd(o.kalite) + ')'; });
    var items = mood.map(function (id) { var it = bul(veri, id); return it ? it.ad : null; }).filter(Boolean);
    return 'Merhaba, maliyet hesaplayıcısından detaylı teklif istiyorum.\n\nAd: ' + ad + '\nTelefon: ' + tel + '\n\n' + satir.join('\n') +
      '\n\nTahmini toplam: ' + tl(r.toplam) + ' (aralık ' + tl(r.alt) + ' – ' + tl(r.ust) + ', KDV hariç, örnek fiyat)' +
      (r.indirim ? '\nİndirim kodu: ' + r.kampanya.kod : '') + '\nÖdeme tercihi: ' + (durum.odeme === 'pesin' ? 'Peşin' : '3 aşamalı') + '\nTahmini süre: ' + r.sure + ' gün' +
      (items.length ? '\nMalzeme panosu: ' + items.join(', ') : '');
  }
  function teklifGonder() {
    var ad = kok.querySelector('[data-ad]').value.trim(), tel = kok.querySelector('[data-tel]').value.trim(), msg = kok.querySelector('[data-teklifmsg]'), r = durum.son || hesapla();
    msg.className = 'djm-teklifmsg hata';
    if (!r.m2) { msg.textContent = 'Önce metrekare girin.'; return; }
    if (ad.length < 2) { msg.textContent = 'Lütfen adınızı yazın.'; return; }
    if (tel.replace(/\D/g, '').length < 10) { msg.textContent = 'Lütfen geçerli bir telefon yazın.'; return; }
    var v = yukle();
    v.talepler.unshift({ ad: ad, tel: tel, odalar: r.odalar.filter(function (o) { return o.m2; }).map(function (o) { return o.ad + ' ' + sayi(o.m2) + ' m²'; }).join('; '), m2: r.m2, toplam: Math.round(r.toplam), tarih: new Date().toISOString() });
    kaydet(v); veri = v; rozetCiz();
    var wa = (kok.getAttribute('data-wa') || VARSAYILAN_WA).replace(/\D/g, '') || VARSAYILAN_WA;
    var url = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(ozetMetni(r, ad, tel));
    msg.className = 'djm-teklifmsg ok'; msg.innerHTML = 'Talebiniz kaydedildi. WhatsApp açılmazsa <a href="' + esc(url) + '" target="_blank" rel="noopener">buraya tıklayın</a>.';
    var w = null; try { w = window.open(url, '_blank', 'noopener'); } catch (x) {}
    if (!w) { /* açılır pencere engelli: bağlantı yukarıda */ }
  }
  function yazdir() {
    if (!(durum.son && durum.son.m2)) return;
    document.documentElement.classList.add('djm-yazdiriyor');
    var bitir = function () { document.documentElement.classList.remove('djm-yazdiriyor'); window.removeEventListener('afterprint', bitir); };
    window.addEventListener('afterprint', bitir);
    setTimeout(function () { window.print(); setTimeout(bitir, 1500); }, 60);
  }

  function malzemeEkle(id) {
    if (!bul(veri || yukle(), id)) return false;
    if (mood.indexOf(id) < 0) mood.push(id);
    moodKaydet(); if (kok) { moodCiz(); var m = kok.querySelector('[data-mood]'); if (gOk() && m) gsap.fromTo(m, { boxShadow: '0 0 0 3px var(--c-vurgu)' }, { boxShadow: '0 0 0 0px transparent', duration: .8 }); }
    return true;
  }
  function stilSec(s) {
    if (['minimal', 'modern', 'klasik', 'sicak'].indexOf(s) < 0) return false;
    if (kok) { kok.setAttribute('data-stil', s); }
    return true;
  }

  function baslat() {
    kok = document.getElementById('maliyet-hesap'); if (!kok) return;
    if (kok.getAttribute('data-djm-hazir')) return; kok.setAttribute('data-djm-hazir', '1');
    var sc = document.currentScript || document.querySelector('script[src*="maliyet.js"]');
    try { panelUrl = new URL('../panel/index.html', sc ? sc.src : location.href).href; } catch (e) { panelUrl = '../panel/index.html'; }
    veri = yukle(); mood = moodYukle(); gsapYukle();
    if (!kok.getAttribute('data-stil')) kok.setAttribute('data-stil', 'minimal');
    durum = { adim: 0, kalite: 'orta', kod: '', odeme: 'pesin', sepet: [], son: null };
    durum.taslak = yeniTaslak('oturma');
    iskelet(); rozetCiz(); adimCiz(false); hepsi();
    kok.addEventListener('click', tikla);
    kok.addEventListener('input', degis); kok.addEventListener('change', degis);
    kok.querySelector('[data-kod]').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); kodUygula(); } });
    window.addEventListener('storage', function (e) {
      if (e.key && e.key !== KEY && e.key !== null) return;
      veri = yukle();
      /* yeni fiyat/şablon: taslağın seçimlerini koru, yeni kalemleri ekle */
      sablonIdleri(veri, durum.taslak.oda).forEach(function (id) { if (durum.taslak.secili[id] === undefined) durum.taslak.secili[id] = true; });
      rozetCiz(); adimCiz(false); hepsi();
      var r = kok.querySelector('[data-r]'); if (r) { r.classList.add('flas'); setTimeout(function () { r.classList.remove('flas'); }, 1800); }
    });
    gsapIlkAnim();
  }
  function gsapIlkAnim() {
    var t = 0, iv = setInterval(function () {
      t++; if (typeof gsap !== 'undefined' || t > 30) { clearInterval(iv); if (gOk()) { var son = kok.querySelector('[data-top]'); if (son && durum.son) { gosterilen = 0; sayacAnim(durum.son.toplam); } } }
    }, 100);
  }

  window.DJMaliyet = {
    stilSec: stilSec, malzemeEkle: malzemeEkle,
    /* panel ve ortak kullanım */
    ANAHTAR: KEY, ODALAR: ODALAR, KALITE: KALITE, varsayilan: varsayilan, yukle: yukle, kaydet: kaydet,
    formulHesapla: formulHesapla, formulGecerli: formulGecerli, hesapla: sepetHesapla, swatch: swatch
  };

  if (document.getElementById('maliyet-hesap') || document.readyState === 'loading') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat); else baslat();
  }
})();
