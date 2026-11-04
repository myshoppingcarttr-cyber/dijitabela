/* Aynı işleyici hem derlemede (Node) hem tarayıcıda çalışır; panel değişikliği böylece birebir siteye yansır. */
(function (root) {
  var R = {};
  var esc = R.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var cur = { lang: 'tr' };
  var l = R.l = function (o, lang) {
    lang = lang || cur.lang;
    if (o == null) return '';
    if (typeof o !== 'object') return o;
    return o[lang] != null && o[lang] !== '' ? o[lang] : (o.en != null ? o.en : (o.tr != null ? o.tr : ''));
  };
  var seedOf = function () { return root.DW_SEED; };

  /* ---------- Bağlantı ---------- */
  R.isLive = function (p, lang, now) {
    if (!p.i18n[lang] || !p.i18n[lang].title) return false;
    if (p.status === 'published') return true;
    return p.status === 'scheduled' && new Date(p.date) <= (now || new Date());
  };
  R.cleanPath = function (S, page, lang, id) {
    var pre = lang + '/';
    if (page === 'home') return pre;
    if (page === 'post') { var p = S.posts.filter(function (x) { return x.id === id; })[0]; return pre + 'blog/' + (p && p.i18n[lang] ? p.i18n[lang].slug : id) + '/'; }
    if (page === 'blogcat') { var c = S.blogCats.filter(function (x) { return x.id === id; })[0]; return pre + 'blog/' + (lang === 'tr' ? 'kategori' : lang === 'de' ? 'kategorie' : 'category') + '/' + l(c.slug, lang) + '/'; }
    if (page === 'country') { var k = S.countries.filter(function (x) { return x.id === id; })[0]; return pre + (S.countryBase[lang] || 'country') + '/' + l(k.slug, lang) + '/'; }
    return pre + (S.routes[page][lang] != null ? S.routes[page][lang] : page) + '/';
  };
  function isStatic(S, page, lang, id) {
    var D = seedOf();
    if (!D.langs.some(function (x) { return x.code === lang; })) return false;
    if (page !== 'post') return true;
    var a = D.posts.filter(function (x) { return x.id === id; })[0], b = S.posts.filter(function (x) { return x.id === id; })[0];
    return !!(a && b && a.status === 'published' && a.i18n[lang] && b.i18n[lang] && a.i18n[lang].slug === b.i18n[lang].slug);
  }
  R.path = function (S, page, lang, id) {
    if (isStatic(S, page, lang, id)) return R.cleanPath(S, page, lang, id);
    return 'app/?l=' + lang + '&p=' + page + (id ? '&id=' + encodeURIComponent(id) : '');
  };
  function up(ctx) { var s = ''; for (var i = 0; i < ctx.depth; i++) s += '../'; return s; }
  function href(S, ctx, page, lang, id) { return up(ctx) + R.path(S, page, lang || ctx.lang, id); }
  function asset(ctx, p) { return up(ctx) + 'assets/' + p; }
  R.absUrl = function (S, page, lang, id) { return S.site.base + '/' + R.cleanPath(S, page, lang, id); };
  R.enabled = function (S) { return S.langs.filter(function (x) { return x.enabled; }); };

  /* ---------- Mağaza düğmeleri ---------- */
  var ICON = {
    apple: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8s-1.8-.8-2.9-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.6-1-2.6-3.7zM14.1 6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.8-1.3z"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4.5 2.8v18.4c0 .6.7 1 1.2.7L21 12.7c.5-.3.5-1.1 0-1.4L5.7 2.1c-.5-.3-1.2.1-1.2.7z"/></svg>'
  };
  R.storeUrl = function (S, url, src) {
    if (!url || !S.links.campaign || !src) return url;
    var tag = String(src).replace(/[^a-z0-9-]+/gi, '-').slice(0, 40);
    if (url.indexOf('apps.apple.com') > -1) return url + (url.indexOf('?') > -1 ? '&' : '?') + 'ct=' + tag;
    if (url.indexOf('play.google.com') > -1) return url + '&referrer=' + encodeURIComponent('utm_source=website&utm_medium=cta&utm_campaign=' + tag);
    return url;
  };
  function storeBtn(S, app, kind, src, cls) {
    var u = S.links[app + (kind === 'ios' ? 'Ios' : 'Play')];
    var label = kind === 'ios' ? (app === 'pro' ? S.ui.appStore : S.ui.buyLite) : (app === 'pro' ? S.ui.play : S.ui.playLite);
    return '<a class="btn ' + (cls || '') + '" data-store="' + kind + '" data-app="' + app + '" data-src="' + esc(src) + '" href="' + esc(R.storeUrl(S, u, src)) + '" target="_blank" rel="noopener">' + ICON[kind === 'ios' ? 'apple' : 'play'] + '<span>' + esc(l(label)) + '</span></a>';
  }
  function storeRow(S, src, cls) {
    return '<div class="stores">' + storeBtn(S, 'pro', 'ios', src, 'btn-pri ' + (cls || '')) + (S.links.proPlay ? storeBtn(S, 'pro', 'play', src, 'btn-pri ' + (cls || '')) : storeBtn(S, 'lite', 'play', src, 'btn-line ' + (cls || ''))) + '</div>' +
      (S.links.proPlay ? '' : '<p class="tiny">' + esc(l(S.ui.playSoon)) + '</p>');
  }

  /* ---------- Görsel ---------- */
  function mediaById(S, id) { return S.media.filter(function (m) { return m.id === id; })[0]; }
  function img(S, ctx, id, opt) {
    opt = opt || {};
    var m = mediaById(S, id); if (!m) return '';
    var a = ' alt="' + esc(l(m.alt)) + '" width="' + m.w + '" height="' + m.h + '"' + (opt.eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"') + (opt.cls ? ' class="' + opt.cls + '"' : '');
    if (m.data) return '<img src="' + m.data + '"' + a + '>';
    if (m.one) return '<img src="' + asset(ctx, 'img/' + m.base + '-420.webp') + '"' + a + '>';
    return '<img src="' + asset(ctx, 'img/' + m.base + '-420.webp') + '" srcset="' + asset(ctx, 'img/' + m.base + '-420.webp') + ' 420w, ' + asset(ctx, 'img/' + m.base + '-760.webp') + ' 760w" sizes="' + (opt.sizes || '(max-width:640px) 60vw, 300px') + '"' + a + '>';
  }

  /* ---------- Teknik çizim (SVG) ---------- */
  var FILL = { white: '#ffffff', anth: '#3a3d44', wood: '#8d5a2b' }, GLASS = '#c5e3f3', INK = '#1d1430';
  R.win = function (c, opt) {
    opt = opt || {};
    var t = c.type || 'cift', W = +c.w || 1500, H = +c.h || 1500, col = FILL[c.color] || FILL.white, m = opt.mono === false ? '' : ' font-family="JetBrains Mono,monospace"';
    if (t === 'kesit') return '<svg viewBox="0 0 460 300" role="img" aria-hidden="true" class="draw"><rect x="60" y="30" width="46" height="240" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="2"/><rect x="106" y="30" width="118" height="240" fill="#f6f4ef" stroke="' + INK + '" stroke-dasharray="4 5"/><rect x="224" y="30" width="46" height="240" fill="' + GLASS + '" stroke="' + INK + '" stroke-width="2"/><rect x="106" y="30" width="118" height="12" fill="' + INK + '"/><rect x="106" y="258" width="118" height="12" fill="' + INK + '"/><g fill="' + INK + '" font-size="13"' + m + '><text x="83" y="20" text-anchor="middle">4</text><text x="165" y="20" text-anchor="middle">16</text><text x="247" y="20" text-anchor="middle">4</text><text x="300" y="155">mm</text></g></svg>';
    if (t === 'tablo') { var rows = '', i; for (i = 0; i < 6; i++) rows += '<line x1="40" x2="420" y1="' + (60 + i * 36) + '" y2="' + (60 + i * 36) + '" stroke="#b9b3a6"/><rect x="48" y="' + (70 + i * 36) + '" width="' + (150 - i * 12) + '" height="10" fill="' + INK + '"/><rect x="340" y="' + (70 + i * 36) + '" width="66" height="10" fill="#5a2a9c"/>'; return '<svg viewBox="0 0 460 300" role="img" aria-hidden="true" class="draw">' + rows + '<line x1="40" x2="420" y1="276" y2="276" stroke="' + INK + '" stroke-width="3"/></svg>'; }
    var boxW = opt.small ? 300 : 340, boxH = opt.small ? 250 : 300, s = Math.min(boxW / W, boxH / H), w = W * s, h = H * s, x = 40 + (boxW - w) / 2, y = 56, f = Math.max(7, 11 * (opt.small ? .8 : 1)), o = '';
    var vw = 40 + boxW + 76, vh = y + h + 20;
    function sash(sx, sy, sw, sh, dir, door) {
      var r = '<rect x="' + sx + '" y="' + sy + '" width="' + sw + '" height="' + sh + '" fill="' + col + '" stroke="' + INK + '" stroke-width="1.4"/>';
      var i = f * .75, gh = door ? (sh - 2 * i) * .52 : sh - 2 * i;
      r += '<rect x="' + (sx + i) + '" y="' + (sy + i) + '" width="' + (sw - 2 * i) + '" height="' + gh + '" fill="' + GLASS + '" stroke="' + INK + '"/>';
      if (door) { var py = sy + i + gh + 5, ph = sh - 2 * i - gh - 5; r += '<rect x="' + (sx + i) + '" y="' + py + '" width="' + (sw - 2 * i) + '" height="' + ph + '" fill="#efece4" stroke="' + INK + '"/>'; for (var k = 1; k < 5; k++) r += '<line x1="' + (sx + i + k * (sw - 2 * i) / 5) + '" x2="' + (sx + i + k * (sw - 2 * i) / 5) + '" y1="' + py + '" y2="' + (py + ph) + '" stroke="#b9b3a6"/>'; }
      if (dir) { var ax = dir === 'l' ? sx + sw - i : sx + i, bx = dir === 'l' ? sx + i : sx + sw - i; r += '<path d="M' + bx + ' ' + (sy + i) + ' L' + ax + ' ' + (sy + (door ? i + gh / 2 + (sh - gh) / 2 - i : sh / 2)) + ' L' + bx + ' ' + (sy + sh - i) + '" fill="none" stroke="#5a2a9c" stroke-width="1.2"/>'; var hx = dir === 'l' ? sx + sw - i - 2 : sx + i - 2; r += '<rect x="' + (hx - 1) + '" y="' + (sy + sh / 2 - 14) + '" width="5" height="28" fill="' + INK + '"/>'; }
      return r;
    }
    if (t === 'kemer') {
      var rad = w / 2; o += '<path d="M' + x + ' ' + (y + h) + ' V' + (y + rad) + ' A' + rad + ' ' + rad + ' 0 0 1 ' + (x + w) + ' ' + (y + rad) + ' V' + (y + h) + ' Z" fill="' + col + '" stroke="' + INK + '" stroke-width="2"/>';
      o += '<path d="M' + (x + f) + ' ' + (y + h - f) + ' V' + (y + rad) + ' A' + (rad - f) + ' ' + (rad - f) + ' 0 0 1 ' + (x + w - f) + ' ' + (y + rad) + ' V' + (y + h - f) + ' Z" fill="' + GLASS + '" stroke="' + INK + '"/>';
      o += '<line x1="' + x + '" x2="' + (x + w) + '" y1="' + (y + rad) + '" y2="' + (y + rad) + '" stroke="' + INK + '" stroke-width="3"/>';
    } else {
      o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + col + '" stroke="' + INK + '" stroke-width="2"/>';
      var ix = x + f, iy = y + f, iw = w - 2 * f, ih = h - 2 * f;
      if (t === 'sabit') o += '<rect x="' + ix + '" y="' + iy + '" width="' + iw + '" height="' + ih + '" fill="' + GLASS + '" stroke="' + INK + '"/>';
      if (t === 'tek') o += sash(ix, iy, iw, ih, 'l');
      if (t === 'kapi') o += sash(ix, iy, iw, ih, 'l', true);
      if (t === 'cift') { o += sash(ix, iy, iw / 2 - 2, ih, 'r') + sash(ix + iw / 2 + 2, iy, iw / 2 - 2, ih, 'l'); }
      if (t === 'surme') {
        o += sash(ix, iy, iw / 2 + 5, ih) + sash(ix + iw / 2 - 5, iy, iw / 2 + 5, ih);
        var ay = iy + ih / 2; o += '<path d="M' + (ix + iw * .15) + ' ' + ay + ' h' + (iw * .2) + ' m-9 -6 l9 6 l-9 6" fill="none" stroke="#5a2a9c" stroke-width="1.6"/><path d="M' + (ix + iw * .85) + ' ' + ay + ' h-' + (iw * .2) + ' m9 -6 l-9 6 l9 6" fill="none" stroke="#5a2a9c" stroke-width="1.6"/>';
      }
    }
    var dx = x + w + 18, tk = 'stroke="' + INK + '" stroke-width="1"';
    o += '<g ' + tk + '><line x1="' + x + '" x2="' + (x + w) + '" y1="24" y2="24"/><line x1="' + x + '" x2="' + x + '" y1="18" y2="30"/><line x1="' + (x + w) + '" x2="' + (x + w) + '" y1="18" y2="30"/><line x1="' + dx + '" x2="' + dx + '" y1="' + y + '" y2="' + (y + h) + '"/><line x1="' + (dx - 6) + '" x2="' + (dx + 6) + '" y1="' + y + '" y2="' + y + '"/><line x1="' + (dx - 6) + '" x2="' + (dx + 6) + '" y1="' + (y + h) + '" y2="' + (y + h) + '"/></g>';
    o += '<g fill="' + INK + '" font-size="13"' + m + '><rect x="' + (x + w / 2 - 24) + '" y="14" width="48" height="20" fill="var(--dw-bg,#fff)" stroke="none"/><text x="' + (x + w / 2) + '" y="29" text-anchor="middle">' + W + '</text><text x="' + (dx + 11) + '" y="' + (y + h / 2 + 4) + '">' + H + '</text></g>';
    return '<svg viewBox="0 0 ' + vw + ' ' + vh + '" class="draw" role="img" aria-label="' + esc(opt.label || (W + ' x ' + H + ' mm')) + '">' + o + '</svg>';
  };

  /* ---------- Hesap ---------- */
  R.calc = function (c, p) {
    var W = Math.max(300, +c.w || 0), H = Math.max(300, +c.h || 0), q = Math.max(1, +c.qty || 1), t = c.type, n = (t === 'cift' || t === 'surme') ? 2 : 1, it = [];
    var add = function (k, qty, unit, price) { it.push({ k: k, qty: qty, unit: unit, price: qty * price }); };
    var perim = 2 * (W + H) / 1000; add('lFrame', perim, 'm', +p.frame);
    if (t === 'cift') add('lMullion', (H - 120) / 1000, 'm', +p.mullion);
    if (t !== 'sabit') add('lSash', n * 2 * (W / n + H) / 1000, 'm', +p.sash);
    if (t === 'tek') add('lOpen1', 1, 'pcs', +p.open1);
    if (t === 'cift') add('lOpen2', 1, 'pcs', +p.open2);
    if (t === 'surme') add('lSlide', 1, 'pcs', +p.slide);
    if (t === 'kapi') add('lDoor', 1, 'pcs', +p.door);
    var gl = t === 'sabit' ? (W - 100) * (H - 100) : t === 'kapi' ? (W - 150) * (H * .52 - 150) : n * (W / n - 150) * (H - 150);
    add('lGlass', Math.max(0, gl) / 1e6, 'm²', +p.glass);
    var pct = c.color === 'anth' ? +p.anth : c.color === 'wood' ? +p.wood : 0;
    if (pct) { var prof = it.filter(function (x) { return x.unit === 'm'; }).reduce(function (a, x) { return a + x.price; }, 0); it.push({ k: 'lColour', qty: pct, unit: '%', price: prof * pct / 100 }); }
    var net = it.reduce(function (a, x) { return a + x.price; }, 0) * q;
    var profit = net * (+p.profit || 0) / 100, sale = net + profit, tax = sale * (+p.vat || 0) / 100;
    return { items: it, net: net, profit: profit, sale: sale, tax: tax, gross: sale + tax, margin: sale ? profit / sale : 0, qty: q };
  };
  var num = R.num = function (n, d) { try { return Number(n).toLocaleString(cur.lang === 'de' ? 'de-DE' : cur.lang === 'tr' ? 'tr-TR' : 'en-GB', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); } catch (e) { return Number(n).toFixed(d == null ? 2 : d); } };
  R.money = function (n, c) { return num(n) + ' ' + c; };
  R.setLang = function (c) { cur.lang = c; };
  R.qtable = function (S, c, p) {
    var r = R.calc(c, p), u = S.ui, h = '<table class="tbl qt"><thead><tr><th>' + l(u.lItem) + '</th><th class="r">' + l(u.lQty) + '</th><th class="r">' + l(u.lUnit) + '</th><th class="r">' + l(u.lPrice) + '</th></tr></thead><tbody>';
    r.items.forEach(function (i) { h += '<tr><td>' + l(u[i.k]) + '</td><td class="r m">' + num(i.qty, i.unit === 'pcs' || i.unit === '%' ? 0 : 2) + '</td><td class="r m">' + (i.unit === 'pcs' ? l(u.pcs) : i.unit) + '</td><td class="r m">' + num(i.price) + '</td></tr>'; });
    h += '</tbody><tfoot><tr><th colspan="3">' + l(u.net) + (r.qty > 1 ? ' × ' + r.qty : '') + '</th><td class="r m">' + R.money(r.net, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.profit) + ' (%' + num(p.profit, 0) + ')</th><td class="r m">' + R.money(r.profit, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.salePrice) + '</th><td class="r m">' + R.money(r.sale, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.tax) + ' (%' + num(p.vat, 0) + ')</th><td class="r m">' + R.money(r.tax, p.cur) + '</td></tr><tr class="grand"><th colspan="3">' + l(u.gross) + '</th><td class="r m" data-gross>' + R.money(r.gross, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.margin) + '</th><td class="r m">%' + num(r.margin * 100, 1) + '</td></tr></tfoot></table>';
    return h;
  };
  var TYPES = [['sabit', 'tSabit'], ['tek', 'tTek'], ['cift', 'tCift'], ['surme', 'tSurme'], ['kapi', 'tKapi']], COLORS = [['white', 'cWhite'], ['anth', 'cAnth'], ['wood', 'cWood']];
  function field(lbl, inner, cls) { return '<label class="fld ' + (cls || '') + '"><span>' + esc(lbl) + '</span>' + inner + '</label>'; }
  function quoteControls(S, cfg) {
    var u = S.ui, seg = '<fieldset class="seg"><legend>' + l(u.opening) + '</legend>' + TYPES.map(function (t) { return '<label><input type="radio" name="q-type" value="' + t[0] + '"' + (cfg.type === t[0] ? ' checked' : '') + ' data-q="type"><span>' + l(u[t[1]]) + '</span></label>'; }).join('') + '</fieldset>';
    return seg + '<div class="grid3">' + field(l(u.width), '<input type="number" inputmode="numeric" min="300" max="6000" step="10" value="' + cfg.w + '" data-q="w">') + field(l(u.height), '<input type="number" inputmode="numeric" min="300" max="4000" step="10" value="' + cfg.h + '" data-q="h">') +
      field(l(u.colour), '<select data-q="color">' + COLORS.map(function (t) { return '<option value="' + t[0] + '"' + (cfg.color === t[0] ? ' selected' : '') + '>' + l(u[t[1]]) + '</option>'; }).join('') + '</select>') + '</div>';
  }
  function compactQuote(S, ctx, src, pv) {
    var cfg = { type: 'cift', w: 1500, h: 1500, color: 'white', qty: 1 }, p = Object.assign({}, S.prices, pv || {}), r = R.calc(cfg, p), u = S.ui;
    return '<div class="qc" data-w="quote" data-src="' + esc(src) + '" data-cfg=\'' + esc(JSON.stringify(cfg)) + '\' data-prices=\'' + esc(JSON.stringify(p)) + '\'><div class="qc-head"><span class="mono">' + l(u.liveTool) + '</span><a href="' + href(S, ctx, 'quote') + '" class="link">' + l(u.openQuote) + '</a></div>' +
      '<div class="qc-draw" data-q-draw>' + R.win(cfg, { small: true }) + '</div>' + quoteControls(S, cfg) +
      '<div class="qc-sum"><div><span>' + l(u.net) + '</span><b class="m" data-q-net>' + R.money(r.net, p.cur) + '</b></div><div><span>' + l(u.salePrice) + '</span><b class="m" data-q-sale>' + R.money(r.sale, p.cur) + '</b></div><div class="qc-g"><span>' + l(u.gross) + '</span><b class="m" data-q-gross>' + R.money(r.gross, p.cur) + '</b></div></div><p class="tiny">' + l(u.sampleQuote) + '</p></div>';
  }
  function fullQuote(S, ctx, src, pv) {
    var cfg = { type: 'cift', w: 1500, h: 1500, color: 'white', qty: 1 }, p = Object.assign({}, S.prices, pv || {}), u = S.ui;
    var pf = [['frame', 'pFrame'], ['mullion', 'pMullion'], ['sash', 'pSash'], ['open1', 'pOpen1'], ['open2', 'pOpen2'], ['glass', 'pGlass'], ['slide', 'pSlide'], ['door', 'pDoor'], ['anth', 'cAnth', ' %'], ['wood', 'cWood', ' %'], ['profit', 'pProfit'], ['vat', 'pVat']];
    return '<div class="qf" data-w="quote" data-full="1" data-src="' + esc(src) + '" data-cfg=\'' + esc(JSON.stringify(cfg)) + '\' data-prices=\'' + esc(JSON.stringify(p)) + '\'><form class="qf-in" onsubmit="return false">' + quoteControls(S, cfg) + field(l(u.qty), '<input type="number" min="1" max="500" value="1" data-q="qty">', 'short') +
      '<details class="pl" open><summary>' + l(u.priceList) + '</summary><div class="grid3">' + field(l(u.currency), '<input type="text" maxlength="4" value="' + esc(p.cur) + '" data-p="cur">') + pf.map(function (x) { return field(l(u[x[1]]) + (x[2] || ''), '<input type="number" min="0" step="0.5" value="' + p[x[0]] + '" data-p="' + x[0] + '">'); }).join('') + '</div></details></form>' +
      '<div class="sheet" id="quote-sheet"><header class="sheet-h"><b>' + l(u.quoteDoc) + '</b><span class="mono">DoorWin Pro · ' + l(u.sampleContent) + '</span></header><div data-q-draw>' + R.win(cfg) + '</div><div data-q-table>' + R.qtable(S, cfg, p) + '</div><p class="tiny">' + l(u.sampleQuote) + ' ' + l(u.scale) + '.</p></div>' +
      '<div class="qf-act"><button type="button" class="btn btn-pri" data-q-print>' + l(u.savePdf) + '</button>' + storeBtn(S, 'pro', 'ios', src, 'btn-line') + '</div></div>';
  }

  /* ---------- Kayıp hesaplayıcı ---------- */
  R.roi = function (v) {
    var saved = Math.max(0, (+v.manual - +v.app)) * +v.quotes / 60, labor = saved * +v.hour, err = +v.quotes * (+v.err / 100) * +v.errCost, leak = labor + err;
    var fee = +v.fee || 0, annual = v.plan === 'annual', mo = annual ? fee / 12 : fee;
    return { saved: saved, labor: labor, err: err, leak: leak, payback: leak > 0 ? (annual ? fee : mo) / (leak / 30) : 0 };
  };
  R.roiDefaults = { quotes: 60, manual: 45, app: 15, hour: 8, err: 3, errCost: 150, plan: 'annual', fee: 79.99, cur: 'USD' };
  function roiResults(S, v) {
    var r = R.roi(v), u = S.ui, c = v.cur;
    var mx = Math.max(r.labor, r.err, 1);
    return '<dl class="roi-big"><dt>' + l(u.rLeak) + '</dt><dd class="m" data-roi-leak>' + R.money(r.leak, c) + '</dd></dl><table class="tbl roi-t"><tbody><tr><th>' + l(u.rHours) + '</th><td class="r m">' + num(r.saved, 1) + '</td></tr><tr><th>' + l(u.rLaborMo) + '<i class="bar" style="width:' + (r.labor / mx * 100).toFixed(0) + '%"></i></th><td class="r m">' + R.money(r.labor, c) + '</td></tr><tr><th>' + l(u.rErrMo) + '<i class="bar b2" style="width:' + (r.err / mx * 100).toFixed(0) + '%"></i></th><td class="r m">' + R.money(r.err, c) + '</td></tr><tr class="grand"><th>' + l(u.rPayback) + '</th><td class="r m">' + num(r.payback, 1) + ' ' + l(u.days) + '</td></tr></tbody></table>';
  }
  R.roiResults = roiResults;
  function roiWidget(S, ctx, compact) {
    var v = R.roiDefaults, u = S.ui;
    var f = function (k, lb, st) { return field(l(lb), '<input type="number" min="0" step="' + (st || 1) + '" value="' + v[k] + '" data-r="' + k + '">'); };
    return '<div class="roi" data-w="roi"><form class="roi-in" onsubmit="return false"><div class="grid2">' + f('quotes', u.rQuotes) + f('manual', u.rManual) + f('app', u.rApp) + f('hour', u.rHour, .5) + f('err', u.rErr, .5) + f('errCost', u.rErrCost, 5) + (compact ? '' : field(l(u.rPlan), '<select data-r="plan"><option value="annual">' + l(u.rAnnual) + '</option><option value="monthly">' + l(u.rMonthly) + '</option></select>') + f('fee', u.rFee, .01) + field(l(u.currency), '<input type="text" maxlength="4" value="' + v.cur + '" data-r="cur">')) + '</div></form><div class="roi-out" data-roi-out>' + roiResults(S, v) + '</div>' + (compact ? '<p class="tiny">' + l(u.rNote) + '</p><a class="link" href="' + href(S, ctx, 'roi') + '">' + l(u.openRoi) + '</a>' : '<p class="tiny">' + l(u.rNote) + ' ' + l(u.rNoErr) + '</p><a class="btn btn-line" data-roi-send href="' + href(S, ctx, 'dealer') + '">' + l(u.rToDealer) + '</a>') + '</div>';
  }

  /* ---------- Karşılaştırma ---------- */
  function cmpCell(S, v) {
    if (v === true) return '<td class="c yes"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4"/></svg><span class="sr">' + l(S.ui.yes) + '</span></td>';
    if (v === null) return '<td class="c unk">' + l(S.compare.unknown) + '</td>';
    if (v && v.ref === 'liteModel') return '<td class="c">' + esc(l(S.pricing.liteModel)) + '</td>';
    if (v && v.ref === 'proPrice') return '<td class="c">' + esc(l(S.pricing.proFree)) + '<br><span class="m">' + esc(S.pricing.proMonthly) + ' / ' + l({ tr: 'ay', en: 'mo', de: 'Mon.' }) + ' · ' + esc(S.pricing.proAnnual) + ' / ' + l({ tr: 'yıl', en: 'yr', de: 'Jahr' }) + '</span></td>';
    return '<td class="c">' + esc(l(v)) + '</td>';
  }
  function cmpTable(S) {
    var c = S.compare;
    return '<div class="tscroll"><table class="tbl cmp"><thead><tr><th scope="col"></th><th scope="col" class="c">' + esc(l(c.nameLite)) + '</th><th scope="col" class="c hot">' + esc(l(c.namePro)) + '</th></tr></thead><tbody>' + c.rows.map(function (r) { return '<tr><th scope="row">' + esc(l(r.k)) + '</th>' + cmpCell(S, r.lite) + cmpCell(S, r.pro) + '</tr>'; }).join('') + '</tbody></table></div><p class="tiny">' + esc(l(c.source)) + '</p><p class="note">' + esc(l(c.assumption)) + '</p>';
  }
  function wizard(S, ctx) {
    var u = S.ui, qs = ['q1', 'q2', 'q3', 'q4'];
    return '<div class="wiz" data-w="wizard"><h2>' + l(u.wizTitle) + '</h2><ol>' + qs.map(function (q) { return '<li><fieldset><legend>' + l(u[q]) + '</legend><label><input type="radio" name="' + q + '" value="1"><span>' + l(u.yes) + '</span></label><label><input type="radio" name="' + q + '" value="0"><span>' + l(u.no) + '</span></label></fieldset></li>'; }).join('') + '</ol><div class="wiz-r" data-wiz-out aria-live="polite"><span class="mono">' + l(u.wizResult) + '</span><p>' + l(u.wizHint) + '</p></div></div>';
  }
  R.wizardResult = function (S, ctx, ans) {
    var u = S.ui, n = Object.keys(ans).length, lite = 0, pro = 0;
    if (ans.q1 === '1') pro += 1; if (ans.q1 === '0') lite += 2;
    if (ans.q2 === '1') lite += 2;
    if (ans.q3 === '1') pro += 2;
    if (ans.q4 === '1') lite += 1;
    var isPro = pro >= lite, name = isPro ? l(S.compare.namePro) : l(S.compare.nameLite);
    return '<span class="mono">' + l(u.wizResult) + ' (' + n + '/4)</span><strong>' + esc(name) + '</strong><p>' + l(isPro ? u.wizWhyPro : u.wizWhyLite) + '</p>' + (isPro ? storeBtn(S, 'pro', 'ios', 'wizard', 'btn-pri') : '<div class="stores">' + storeBtn(S, 'lite', 'ios', 'wizard', 'btn-pri') + storeBtn(S, 'lite', 'play', 'wizard', 'btn-line') + '</div>');
  };

  /* ---------- SSS ---------- */
  function qa(item) { return '<details class="qa" name="sss"><summary><h3>' + esc(l(item.q)) + '</h3></summary><div class="qa-a"><p>' + esc(l(item.a)) + '</p></div></details>'; }

  /* ---------- Blog ---------- */
  function postCard(S, ctx, p, big) {
    var i = p.i18n[ctx.lang], c = S.blogCats.filter(function (x) { return x.id === p.cat; })[0];
    return '<article class="pc' + (big ? ' big' : '') + '" data-tags="' + esc((p.tags || []).join('|')) + '"><a class="pc-fig" href="' + href(S, ctx, 'post', ctx.lang, p.id) + '" tabindex="-1" aria-hidden="true">' + postFig(S, ctx, p) + '</a><div class="pc-b"><a class="mono kicker" href="' + href(S, ctx, 'blogcat', ctx.lang, p.cat) + '">' + esc(l(c ? c.n : '')) + '</a><h3><a href="' + href(S, ctx, 'post', ctx.lang, p.id) + '">' + esc(i.title) + '</a></h3><p>' + esc(i.excerpt) + '</p><time class="tiny m" datetime="' + esc(p.date) + '">' + esc(p.date) + '</time></div></article>';
  }
  function postFig(S, ctx, p) {
    if (p.image && mediaById(S, p.image)) return img(S, ctx, p.image, { sizes: '(max-width:640px) 90vw, 360px' });
    return R.win(p.draw || { type: 'cift', w: 1500, h: 1500 }, { small: true, label: p.i18n[ctx.lang] ? p.i18n[ctx.lang].title : '' });
  }
  function livePosts(S, lang) { return S.posts.filter(function (p) { return R.isLive(p, lang); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  R.livePosts = livePosts;
  function bodyHtml(S, ctx, html) {
    return String(html || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '').replace(/<a data-link="([a-z]+):([\w-]+)"/g, function (m, t, id) {
      return t === 'post' ? '<a data-int="post" data-target="' + id + '" href="' + href(S, ctx, 'post', ctx.lang, id) + '"' : '<a data-int="page" data-target="' + id + '" href="' + (S.routes[id] ? href(S, ctx, id) : '#') + '"';
    });
  }
  function related(S, p, lang) {
    var manual = (p.related || []).map(function (id) { return S.posts.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
    var rest = livePosts(S, lang).filter(function (x) { return x.id !== p.id && manual.indexOf(x) < 0; }).map(function (x) { var s = (x.cat === p.cat ? 3 : 0) + (x.tags || []).filter(function (t) { return (p.tags || []).indexOf(t) > -1; }).length; return { x: x, s: s }; }).sort(function (a, b) { return b.s - a.s; }).map(function (a) { return a.x; });
    return manual.concat(rest).filter(function (x) { return R.isLive(x, lang); }).slice(0, 3);
  }

  /* ---------- Kabuk ---------- */
  function crumbs(S, ctx, list) {
    return '<nav class="crumb" aria-label="breadcrumb"><ol>' + list.map(function (c, i) { return '<li>' + (i < list.length - 1 && c.href ? '<a href="' + c.href + '">' + esc(c.n) + '</a>' : '<span' + (i === list.length - 1 ? ' aria-current="page"' : '') + '>' + esc(c.n) + '</span>') + '</li>'; }).join('') + '</ol></nav>';
  }
  function logo(ctx) { return '<img src="' + asset(ctx, 'img/pro-icon-160.webp') + '" width="40" height="40" alt="DoorWin Pro">'; }
  function header(S, ctx, alts) {
    var u = S.ui, n = [['compare', u.navCompare], ['quote', u.navQuote], ['roi', u.navRoi], ['blog', u.navBlog], ['faq', u.navFaq], ['dealer', u.navDealer]];
    var links = n.map(function (x) { return '<a href="' + href(S, ctx, x[0]) + '"' + (ctx.page === x[0] ? ' aria-current="page"' : '') + '>' + l(x[1]) + '</a>'; }).join('');
    var lg = '<details class="lang"><summary aria-label="' + l(u.lang) + '"><span class="m">' + ctx.lang.toUpperCase() + '</span></summary><ul>' + alts.map(function (a) { return '<li><a hreflang="' + a.hreflang + '" lang="' + a.code + '" data-lang-link="' + a.code + '" href="' + up(ctx) + a.path + '"' + (a.code === ctx.lang ? ' aria-current="true"' : '') + '>' + esc(a.name) + '</a></li>'; }).join('') + '</ul></details>';
    return '<a class="skip" href="#main">' + l(u.skip) + '</a><p class="ribbon">' + l(u.preview) + '</p><header class="top"><div class="wrap top-i"><a class="brand" href="' + href(S, ctx, 'home') + '">' + logo(ctx) + '<span>DoorWin <b>Pro</b></span></a><nav class="nav" aria-label="' + l(u.menu) + '">' + links + '</nav>' + lg + '<a class="btn btn-pri btn-s hide-s" data-store="ios" data-app="pro" data-src="header" href="' + esc(R.storeUrl(S, S.links.proIos, 'header')) + '" target="_blank" rel="noopener">' + l(u.getPro) + '</a><details class="mnav"><summary aria-label="' + l(u.menu) + '"><span class="burger"></span></summary><div class="mnav-p">' + links + storeBtn(S, 'pro', 'ios', 'menu', 'btn-pri') + '</div></details></div></header>';
  }
  function footer(S, ctx) {
    var u = S.ui;
    return '<footer class="foot"><div class="wrap foot-g"><div><a class="brand" href="' + href(S, ctx, 'home') + '">' + logo(ctx) + '<span>DoorWin <b>Pro</b></span></a><p class="tiny">' + l(u.footNote) + '</p></div><div><h2 class="mono">' + l(u.product) + '</h2><a href="' + href(S, ctx, 'compare') + '">' + l(u.navCompare) + '</a><a href="' + href(S, ctx, 'quote') + '">' + l(u.navQuote) + '</a><a href="' + href(S, ctx, 'roi') + '">' + l(u.navRoi) + '</a><a href="' + href(S, ctx, 'faq') + '">' + l(u.navFaq) + '</a></div><div><h2 class="mono">' + l(u.navBlog) + '</h2>' + S.blogCats.slice(0, 4).map(function (c) { return '<a href="' + href(S, ctx, 'blogcat', ctx.lang, c.id) + '">' + esc(l(c.n)) + '</a>'; }).join('') + '<a href="' + href(S, ctx, 'blog') + '">' + l(u.seeAll) + '</a></div><div><h2 class="mono">' + l(u.countries) + '</h2>' + S.countries.map(function (c) { return '<a href="' + href(S, ctx, 'country', ctx.lang, c.id) + '">' + esc(l(c.n)) + '</a>'; }).join('') + '<a href="' + href(S, ctx, 'dealer') + '">' + l(u.navDealer) + '</a></div></div><div class="wrap foot-b"><span>© ' + esc(S.site.org) + '</span><a class="panel-link" href="' + up(ctx) + 'panel/">Panel</a></div></footer>';
  }
  R.alternates = function (S, ctx) {
    return R.enabled(S).filter(function (x) {
      if (ctx.page === 'post') { var p = S.posts.filter(function (a) { return a.id === ctx.id; })[0]; return p && R.isLive(p, x.code); }
      return true;
    }).map(function (x) { return { code: x.code, name: x.name, hreflang: x.hreflang, path: R.path(S, ctx.page, x.code, ctx.id), abs: R.absUrl(S, ctx.page, x.code, ctx.id), dir: x.dir }; });
  };

  /* ---------- Ana sayfa bölümleri ---------- */
  var LABEL = { features: 'navFeatures', quote: 'navQuote', uses: 'uses', shots: 'scr', video: 'video', compare: 'navCompare', roi: 'navRoi', reviews: 'lblReviews', faq: 'navFaq', blog: 'navBlog', cta: 'getPro' };
  function sh(n, title, sub, id) { return '<div class="sh"><span class="sh-n m">' + (n < 10 ? '0' : '') + n + '</span><h2' + (id ? ' id="' + id + '"' : '') + '>' + esc(title) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>'; }
  function phone(S, ctx, id, opt) { return '<figure class="ph">' + img(S, ctx, id, opt) + '</figure>'; }
  var SEC = {
    hero: function (S, ctx, lay) {
      var h = S.home, facts = '<dl class="facts">' + h.facts.map(function (f) { return '<div><dt>' + esc(l(f.k)) + '</dt><dd class="m">' + esc(f.v) + '</dd></div>'; }).join('') + '</dl>';
      var cta = storeRow(S, 'hero') + '<p class="hero-2"><a class="link" href="' + href(S, ctx, 'quote') + '">' + esc(l(h.cta2)) + '</a></p>';
      if (lay === 2) {
        var ids = S.screens.slice(0, 3);
        return '<section class="hero h2-poster"><div class="wrap"><p class="mono eb">' + esc(l(h.eyebrow)) + '</p><h1>' + esc(l(h.h1)) + '</h1><div class="h2-g"><div><p class="lead">' + esc(l(h.lead)) + '</p>' + cta + facts + '</div><div class="h2-ph">' + phone(S, ctx, ids[1], { sizes: '220px' }) + phone(S, ctx, S.heroImage, { eager: true, sizes: '(max-width:640px) 56vw, 280px' }) + phone(S, ctx, ids[2], { sizes: '220px' }) + '</div></div></div></section>';
      }
      if (lay === 3) {
        return '<section class="hero h3-ledger"><div class="h3-g"><div><p class="mono eb">' + esc(l(h.eyebrow)) + '</p><h1>' + esc(l(h.h1)) + '</h1><p class="lead">' + esc(l(h.lead)) + '</p>' + cta + facts + '</div><div class="h3-c"><p class="mono">' + l(S.ui.leakShort) + '</p>' + roiWidget(S, ctx, true) + '</div></div></section>';
      }
      return '<section class="hero h1-sheet"><div class="wrap h1-g"><div class="h1-t"><p class="mono eb">' + esc(l(h.eyebrow)) + '</p><h1>' + esc(l(h.h1)) + '</h1><p class="lead">' + esc(l(h.lead)) + '</p>' + cta + facts + '</div>' + compactQuote(S, ctx, 'hero') + '</div></section>';
    },
    features: function (S, ctx, lay, n) {
      var h = S.home, x = h.features;
      if (lay === 2) return sect('features', sh(n, l(h.featuresTitle)) + '<div class="f2">' + x.map(function (f, i) { return '<article class="f2-r' + (i % 2 ? ' f2-rv' : '') + '"><div class="f2-p">' + phone(S, ctx, f.img, { sizes: '(max-width:640px) 56vw, 260px' }) + '</div><div><span class="m f2-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span><h3>' + esc(l(f.t)) + '</h3><p>' + esc(l(f.d)) + '</p></div></article>'; }).join('') + '</div>', 'lilac');
      if (lay === 3) return sect('features', sh(n, l(h.featuresTitle)) + '<div class="tscroll"><table class="tbl ft"><thead><tr><th>' + l(S.ui.tableFeature) + '</th><th>' + l(S.ui.tableWhat) + '</th></tr></thead><tbody>' + x.map(function (f) { return '<tr><th scope="row"><h3>' + esc(l(f.t)) + '</h3></th><td>' + esc(l(f.d)) + '</td></tr>'; }).join('') + '</tbody></table></div>');
      return sect('features', sh(n, l(h.featuresTitle)) + '<ol class="f1 thumb">' + x.map(function (f, i) { return '<li><span class="m f1-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span><div class="f1-t"><h3>' + esc(l(f.t)) + '</h3><p>' + esc(l(f.d)) + '</p></div><div class="f1-i">' + img(S, ctx, f.img, { sizes: '150px' }) + '</div></li>'; }).join('') + '</ol>');
    },
    quote: function (S, ctx, lay, n) {
      var h = S.home, st = '<ol class="steps">' + h.steps.map(function (s, i) { return '<li><span class="m">' + (i + 1) + '</span><div><h3>' + esc(l(s.t)) + '</h3><p>' + esc(l(s.d)) + '</p></div></li>'; }).join('') + '</ol>';
      if (lay === 1) return sect('quote', sh(n, l(h.stepsTitle)) + st + '<p><a class="btn btn-line" href="' + href(S, ctx, 'quote') + '">' + l(S.ui.openQuote) + '</a></p>');
      return sect('quote', sh(n, l(h.stepsTitle)) + '<div class="q-split">' + st + compactQuote(S, ctx, 'home-quote') + '</div>');
    },
    uses: function (S, ctx, lay, n) {
      var h = S.home;
      return sect('uses', sh(n, l(h.usesTitle)) + '<div class="uses">' + h.uses.map(function (u) { return '<article class="use"><div class="use-d">' + R.win(u.draw, { small: true, label: l(u.t) }) + '</div><h3>' + esc(l(u.t)) + '</h3><p>' + esc(l(u.d)) + '</p></article>'; }).join('') + '</div>');
    },
    shots: function (S, ctx, lay, n) {
      var h = S.home;
      return sect('shots', sh(n, l(h.shotsTitle), l(h.shotsNote)) + '<ul class="shots" tabindex="0" aria-label="' + l(S.ui.scrollHint) + '">' + S.screens.map(function (id) { var m = mediaById(S, id); return m ? '<li><figure class="ph">' + img(S, ctx, id, { sizes: '(max-width:640px) 58vw, 250px' }) + '<figcaption class="m">' + esc(l(m.cap)) + '</figcaption></figure></li>' : ''; }).join('') + '</ul>', lay === 2 ? 'dark' : '');
    },
    video: function (S, ctx, lay, n) {
      var h = S.home, src = S.links.video, isFile = /\.(webm|mp4)(\?|$)/i.test(src), u = isFile && !/^https?:/.test(src) ? up(ctx) + src : src, media = '';
      if (src) media = isFile ? '<video controls preload="none" playsinline width="1280" height="720" poster="' + asset(ctx, 'img/demo-poster.webp') + '" aria-label="' + esc(l(h.videoTitle)) + '" data-track-video><source src="' + esc(u) + '"><track kind="captions"><a href="' + esc(u) + '">' + l(S.ui.videoFallback) + '</a></video>' : '<button class="vfacade" type="button" data-video-src="' + esc(src) + '" aria-label="' + l(S.ui.playVideo) + '"><img src="' + asset(ctx, 'img/demo-poster.webp') + '" width="1280" height="720" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></button>';
      return sect('video', '<div class="v-g"><div>' + sh(n, l(h.videoTitle), l(h.videoText)) + '</div><div class="vbox">' + media + '</div></div>');
    },
    compare: function (S, ctx, lay, n) {
      var h = S.home;
      return sect('compare', sh(n, l(h.compareTitle), l(h.compareText)) + cmpTable(S) + '<p><a class="btn btn-line" href="' + href(S, ctx, 'compare') + '">' + l(S.ui.seeCompare) + '</a></p>');
    },
    roi: function (S, ctx, lay, n) { return sect('roi', sh(n, l(S.pages.roi.h1), l(S.pages.roi.lead)) + roiWidget(S, ctx, true)); },
    reviews: function (S, ctx, lay, n) {
      var h = S.home;
      return sect('reviews', sh(n, l(h.reviewsTitle), l(h.reviewsNote)) + '<div class="revs">' + h.reviews.map(function (r) { return '<figure class="rev"><span class="stub m">' + l(S.ui.reviewStub) + '</span><blockquote>' + esc(l(r.q)) + '</blockquote><figcaption><b>' + esc(l(r.n)) + '</b><span>' + esc(l(r.r)) + '</span></figcaption></figure>'; }).join('') + '</div><p class="tiny">' + esc(l(h.storeRating)) + '</p>');
    },
    faq: function (S, ctx, lay, n) {
      return sect('faq', sh(n, l(S.pages.faq.h1)) + '<div class="qas">' + S.faq.filter(function (f) { return f.home; }).map(qa).join('') + '</div><p><a class="link" href="' + href(S, ctx, 'faq') + '">' + l(S.ui.seeAll) + '</a></p>');
    },
    blog: function (S, ctx, lay, n) {
      return sect('blog', sh(n, l(S.pages.blog.h1)) + '<div class="pcs">' + livePosts(S, ctx.lang).slice(0, 3).map(function (p) { return postCard(S, ctx, p); }).join('') + '</div><p><a class="link" href="' + href(S, ctx, 'blog') + '">' + l(S.ui.seeAll) + '</a></p>');
    },
    cta: function (S, ctx) {
      var h = S.home;
      return '<section class="cta" id="cta"><div class="wrap"><h2>' + esc(l(h.ctaTitle)) + '</h2><p>' + esc(l(h.ctaText)) + '</p>' + storeRow(S, 'cta') + '<p class="tiny">' + esc(l(h.note)) + '</p></div></section>';
    }
  };
  function sect(id, inner, cls) { return '<section class="sec ' + (cls || '') + '" id="' + id + '"><div class="wrap">' + inner + '</div></section>'; }
  function homeOrder(S, lay) { return (S.layouts[lay] || S.layouts[1]).filter(function (k) { return !S.hidden[k]; }); }
  function pageHome(S, ctx, lay) {
    var n = 0, order = homeOrder(S, lay), html = order.map(function (k) { if (k !== 'hero' && k !== 'cta') n++; return SEC[k] ? SEC[k](S, ctx, lay, n) : ''; }).join('');
    if (lay === 3) {
      var hero = order[0] === 'hero' ? SEC.hero(S, ctx, 3) : '', idx = order.filter(function (k) { return k !== 'hero'; }), rest = 0, body = idx.map(function (k) { if (k !== 'cta') rest++; return SEC[k] ? SEC[k](S, ctx, 3, rest) : ''; }).join('');
      return '<div class="wrap">' + hero + '</div><div class="wrap l3"><aside class="l3-i" aria-label="' + l(S.ui.index) + '"><p class="mono">' + l(S.ui.index) + '</p><ol>' + idx.map(function (k) { return '<li><a href="#' + k + '">' + l(S.ui[LABEL[k]]) + '</a></li>'; }).join('') + '</ol></aside><div class="l3-b">' + body + '</div></div>';
    }
    return html;
  }

  /* ---------- Alt sayfalar ---------- */
  function pageHead(S, ctx, key, trail, vars) {
    var p = S.pages[key], t = l(p.h1), d = l(p.lead);
    if (vars) Object.keys(vars).forEach(function (k) { t = t.replace('{' + k + '}', vars[k]); d = d.replace('{' + k + '}', vars[k]); });
    return '<div class="ph-h"><div class="wrap">' + crumbs(S, ctx, [{ n: l(S.ui.home), href: href(S, ctx, 'home') }].concat(trail)) + '<h1>' + esc(t) + '</h1><p class="lead">' + esc(d) + '</p></div></div>';
  }
  var PAGES = {
    compare: function (S, ctx) { return pageHead(S, ctx, 'compare', [{ n: l(S.ui.navCompare) }]) + '<section class="sec"><div class="wrap">' + cmpTable(S) + '<div class="stores cmp-b">' + storeBtn(S, 'pro', 'ios', 'compare', 'btn-pri') + storeBtn(S, 'lite', 'ios', 'compare', 'btn-line') + storeBtn(S, 'lite', 'play', 'compare', 'btn-line') + '</div></div></section><section class="sec lilac"><div class="wrap">' + wizard(S, ctx) + '</div></section>'; },
    quote: function (S, ctx) { return pageHead(S, ctx, 'quote', [{ n: l(S.ui.navQuote) }]) + '<section class="sec"><div class="wrap">' + fullQuote(S, ctx, 'quote-page') + '</div></section>'; },
    roi: function (S, ctx) { return pageHead(S, ctx, 'roi', [{ n: l(S.ui.navRoi) }]) + '<section class="sec"><div class="wrap">' + roiWidget(S, ctx, false) + '</div></section>'; },
    dealer: function (S, ctx) { return pageHead(S, ctx, 'dealer', [{ n: l(S.ui.navDealer) }]) + '<section class="sec"><div class="wrap narrow">' + leadForm(S, ctx) + '</div></section>'; },
    faq: function (S, ctx) {
      return pageHead(S, ctx, 'faq', [{ n: l(S.ui.navFaq) }]) + '<section class="sec"><div class="wrap narrow"><div class="fcats" role="group" aria-label="' + l(S.pages.faq.h1) + '"><button type="button" class="chip on" data-fcat="">' + l(S.ui.catAll) + '</button>' + S.faqCats.map(function (c) { return '<button type="button" class="chip" data-fcat="' + c.id + '">' + esc(l(c.n)) + '</button>'; }).join('') + '</div>' + S.faqCats.map(function (c) { var it = S.faq.filter(function (f) { return f.cat === c.id; }); return it.length ? '<div class="fgroup" data-cat="' + c.id + '"><h2>' + esc(l(c.n)) + '</h2><div class="qas">' + it.map(qa).join('') + '</div></div>' : ''; }).join('') + '</div></section>';
    },
    blog: function (S, ctx) {
      var posts = ctx.page === 'blogcat' ? livePosts(S, ctx.lang).filter(function (p) { return p.cat === ctx.id; }) : livePosts(S, ctx.lang);
      var cat = ctx.page === 'blogcat' ? S.blogCats.filter(function (c) { return c.id === ctx.id; })[0] : null;
      var tags = {}; posts.forEach(function (p) { (p.tags || []).forEach(function (t) { tags[t] = 1; }); });
      var head = cat ? '<div class="ph-h"><div class="wrap">' + crumbs(S, ctx, [{ n: l(S.ui.home), href: href(S, ctx, 'home') }, { n: l(S.ui.navBlog), href: href(S, ctx, 'blog') }, { n: l(cat.n) }]) + '<h1>' + esc(l(cat.n)) + '</h1><p class="lead">' + esc(l(S.pages.blog.lead)) + '</p></div></div>' : pageHead(S, ctx, 'blog', [{ n: l(S.ui.navBlog) }]);
      return head + '<section class="sec"><div class="wrap"><nav class="fcats" aria-label="' + l(S.ui.navBlog) + '"><a class="chip' + (!cat ? ' on' : '') + '" href="' + href(S, ctx, 'blog') + '">' + l(S.ui.catAll) + '</a>' + S.blogCats.map(function (c) { return '<a class="chip' + (cat && cat.id === c.id ? ' on' : '') + '" href="' + href(S, ctx, 'blogcat', ctx.lang, c.id) + '">' + esc(l(c.n)) + '</a>'; }).join('') + '</nav><div class="tags" role="group" aria-label="' + l(S.ui.tags) + '">' + Object.keys(tags).map(function (t) { return '<button type="button" class="tag" data-tag="' + esc(t) + '">#' + esc(t) + '</button>'; }).join('') + '</div><div class="pcs">' + (posts.length ? posts.map(function (p) { return postCard(S, ctx, p); }).join('') : '<p>' + l(S.ui.noResults) + '</p>') + '</div></div></section>';
    },
    post: function (S, ctx) {
      var p = S.posts.filter(function (x) { return x.id === ctx.id; })[0];
      if (!p || !R.isLive(p, ctx.lang)) return '<div class="ph-h"><div class="wrap"><h1>404</h1><p class="lead">' + l(S.ui.noPost) + '</p><a class="btn btn-line" href="' + href(S, ctx, 'blog') + '">' + l(S.ui.navBlog) + '</a></div></div>';
      var i = p.i18n[ctx.lang], c = S.blogCats.filter(function (x) { return x.id === p.cat; })[0], a = S.authors.filter(function (x) { return x.id === p.author; })[0], src = 'blog:' + p.id;
      var video = p.video ? '<div class="vbox"><video controls preload="none" src="' + esc(p.video) + '"></video></div>' : '';
      return '<article class="post" data-post="' + p.id + '"><div class="ph-h"><div class="wrap narrow">' + crumbs(S, ctx, [{ n: l(S.ui.home), href: href(S, ctx, 'home') }, { n: l(S.ui.navBlog), href: href(S, ctx, 'blog') }, { n: l(c.n), href: href(S, ctx, 'blogcat', ctx.lang, p.cat) }, { n: i.title }]) + '<p class="mono eb">' + esc(l(c.n)) + ' · ' + l(S.ui.sampleContent) + '</p><h1>' + esc(i.title) + '</h1><p class="lead">' + esc(i.excerpt) + '</p><p class="tiny"><span>' + l(S.ui.author) + ': ' + esc(a ? l(a.n) : '') + '</span> · <time datetime="' + esc(p.date) + '" class="m">' + l(S.ui.published) + ': ' + esc(p.date) + '</time></p></div></div><div class="wrap narrow post-b"><figure class="post-f">' + postFig(S, ctx, p) + '</figure>' + video + '<div class="prose">' + bodyHtml(S, ctx, i.html) + '</div>' + (i.qa && i.qa.length ? '<section class="post-q"><h2>' + l(S.ui.questions) + '</h2><div class="qas">' + i.qa.map(function (q) { return '<details class="qa" open><summary><h3>' + esc(q.q) + '</h3></summary><div class="qa-a"><p>' + esc(q.a) + '</p></div></details>'; }).join('') + '</div></section>' : '') + '<aside class="post-cta"><h2>' + l(S.ui.ctaInPost) + '</h2>' + '<a class="btn btn-line" href="' + href(S, ctx, 'quote') + '" data-funnel="blog-to-quote" data-src="' + src + '">' + l(S.ui.openQuote) + '</a>' + storeRow(S, src) + '</aside>' + ((p.tags || []).length ? '<p class="tags">' + p.tags.map(function (t) { return '<a class="tag" href="' + href(S, ctx, 'blog') + '#tag=' + encodeURIComponent(t) + '">#' + esc(t) + '</a>'; }).join('') + '</p>' : '') + '</div><section class="sec"><div class="wrap"><h2>' + l(S.ui.related) + '</h2><div class="pcs">' + related(S, p, ctx.lang).map(function (x) { return postCard(S, ctx, x); }).join('') + '</div></div></section></article>';
    },
    country: function (S, ctx) {
      var k = S.countries.filter(function (x) { return x.id === ctx.id; })[0], v = { loc: l(k.loc), cur: k.cur, vat: k.vat, lang: l(k.lang) }, src = 'country:' + k.id;
      return pageHead(S, ctx, 'country', [{ n: l(S.ui.countries) }, { n: l(k.n) }], v) + '<section class="sec"><div class="wrap h1-g">' + '<div>' + storeRow(S, src) + '<ol class="f1">' + S.home.features.slice(0, 3).map(function (f, i) { return '<li><span class="m f1-n">0' + (i + 1) + '</span><div class="f1-t"><h3>' + esc(l(f.t)) + '</h3><p>' + esc(l(f.d)) + '</p></div></li>'; }).join('') + '</ol></div>' + compactQuote(S, ctx, src, { cur: k.cur, vat: k.vat }) + '</div></section>' + '<section class="sec lilac"><div class="wrap narrow">' + leadForm(S, ctx, k) + '</div></section>';
    }
  };
  PAGES.blogcat = PAGES.blog;
  function leadForm(S, ctx, country) {
    var u = S.ui, a = 3, b = 4;
    var ft = [['dealer', 'fDealer'], ['manufacturer', 'fMan'], ['installer', 'fIns'], ['other', 'fOther']];
    return '<form class="lead" data-w="lead" novalidate data-country="' + (country ? country.id : '') + '"><h2>' + l(u.navDealer) + '</h2><div class="grid2">' + field(l(u.fCompany), '<input name="company" required autocomplete="organization"><small class="err" hidden></small>') + field(l(u.fType), '<select name="type">' + ft.map(function (x) { return '<option value="' + x[0] + '">' + l(u[x[1]]) + '</option>'; }).join('') + '</select>') + field(l(u.fCountry), '<input name="country" required autocomplete="country-name" value="' + (country ? esc(l(country.n)) : '') + '"><small class="err" hidden></small>') + field(l(u.fEmail), '<input type="email" name="email" required autocomplete="email"><small class="err" hidden></small>') + field(l(u.fTeam), '<input type="number" min="1" name="team" value="3">') + field(l(u.fQuotes), '<input type="number" min="0" name="quotes" value="30">') + '</div>' + field(l(u.fMsg), '<textarea name="msg" rows="4" maxlength="800"></textarea>') + '<label class="hp" aria-hidden="true">' + l(u.fExtra) + '<input name="website" tabindex="-1" autocomplete="off"></label><p class="note" data-from-roi hidden>' + l(u.fromRoi) + '</p>' + field(l(u.fCaptcha).replace('{a}', a).replace('{b}', b), '<input name="cap" inputmode="numeric" required data-a="' + a + '" data-b="' + b + '"><small class="err" hidden></small>', 'short') + '<label class="chk"><input type="checkbox" name="ok" required><span>' + l(u.fConsent) + '</span></label><small class="err" data-err-ok hidden></small><button class="btn btn-pri" type="submit">' + l(u.fSend) + '</button><p class="form-msg" role="status" aria-live="polite"></p></form>';
  }

  /* ---------- Ana işleyici ---------- */
  R.body = function (S, ctx, lay) {
    R.setLang(ctx.lang); lay = +lay || 1;
    var main = ctx.page === 'home' ? pageHome(S, ctx, lay) : (PAGES[ctx.page] ? PAGES[ctx.page](S, ctx) : '');
    return header(S, ctx, R.alternates(S, ctx)) + '<main id="main" tabindex="-1">' + main + '</main>' + footer(S, ctx);
  };

  /* ---------- Head + şema ---------- */
  R.head = function (S, ctx) {
    R.setLang(ctx.lang);
    var lang = ctx.lang, title, desc, kw, noindex = S.seoGlobal.noindex[ctx.page + (ctx.id ? ':' + ctx.id : '')], crumb = [{ n: l(S.ui.home), u: R.absUrl(S, 'home', lang) }], type = 'website', ld = [], img = S.site.base + '/assets/img/pro-icon-160.webp';
    var sg = S.seoGlobal.schema, can = R.absUrl(S, ctx.page, lang, ctx.id);
    var org = { '@type': 'Organization', name: 'DoorWin', legalName: S.site.org, url: S.site.base, logo: img };
    if (ctx.page === 'post') {
      var p = S.posts.filter(function (x) { return x.id === ctx.id; })[0], i = p && p.i18n[lang] ? p.i18n[lang] : {}, c = p ? S.blogCats.filter(function (x) { return x.id === p.cat; })[0] : null;
      title = i.seoTitle || (i.title ? (i.title.length <= 50 ? i.title + ' | DoorWin' : i.title) : '404'); desc = i.seoDesc || i.excerpt || ''; kw = i.kw || (p && p.tags ? p.tags.join(', ') : ''); type = 'article';
      crumb.push({ n: l(S.ui.navBlog), u: R.absUrl(S, 'blog', lang) });
      if (c) crumb.push({ n: l(c.n), u: R.absUrl(S, 'blogcat', lang, p.cat) });
      crumb.push({ n: i.title || '', u: can });
      if (p && !R.isLive(p, lang)) noindex = true;
      if (sg.Article && p && i.title) { var au = S.authors.filter(function (x) { return x.id === p.author; })[0]; ld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: i.title, description: desc, datePublished: p.date, dateModified: p.modified || p.date, inLanguage: lang, author: { '@type': 'Organization', name: au ? l(au.n) : 'DoorWin' }, publisher: org, image: img, mainEntityOfPage: can, articleSection: c ? l(c.n) : '', keywords: (p.tags || []).join(', ') }); }
      if (sg.FAQPage && i.qa && i.qa.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: i.qa.map(function (q) { return { '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }; }) });
    } else if (ctx.page === 'blogcat') {
      var ct = S.blogCats.filter(function (x) { return x.id === ctx.id; })[0];
      title = l(ct.n) + ' | DoorWin Blog'; desc = l(ct.seoDesc) || l(S.seo.blog.desc); kw = l(ct.n);
      crumb.push({ n: l(S.ui.navBlog), u: R.absUrl(S, 'blog', lang) }); crumb.push({ n: l(ct.n), u: can });
    } else if (ctx.page === 'country') {
      var k = S.countries.filter(function (x) { return x.id === ctx.id; })[0], rep = function (s) { return s.replace('{loc}', l(k.loc)).replace('{cur}', k.cur).replace('{vat}', k.vat).replace('{lang}', l(k.lang)); };
      title = l(S.seo.country.title).replace('{n}', l(k.n)); desc = rep(l(S.pages.country.lead)); kw = 'DoorWin Pro, ' + l(k.n);
      crumb.push({ n: l(k.n), u: can });
    } else {
      var s = S.seo[ctx.page]; title = l(s.title); desc = l(s.desc); kw = l(s.kw);
      if (ctx.page !== 'home') crumb.push({ n: l(S.pages[ctx.page].h1), u: can });
    }
    if (ctx.page === 'home' && sg.SoftwareApplication) ld.push({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'DoorWin Pro', applicationCategory: 'BusinessApplication', operatingSystem: 'iOS 15.6+, iPadOS 15.6+, macOS 12.5+, visionOS 1.0+', softwareVersion: '1.1.0', url: can, downloadUrl: S.links.proIos, description: desc, inLanguage: lang, publisher: org, offers: [{ '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free download' }, { '@type': 'Offer', price: '7.99', priceCurrency: 'USD', description: 'Monthly Premium (US App Store)' }, { '@type': 'Offer', price: '79.99', priceCurrency: 'USD', description: 'Annual Premium (US App Store)' }] });
    if (ctx.page === 'faq' && sg.FAQPage) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: S.faq.map(function (f) { return { '@type': 'Question', name: l(f.q), acceptedAnswer: { '@type': 'Answer', text: l(f.a) } }; }) });
    if (ctx.page === 'home' && sg.FAQPage && !S.hidden.faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: S.faq.filter(function (f) { return f.home; }).map(function (f) { return { '@type': 'Question', name: l(f.q), acceptedAnswer: { '@type': 'Answer', text: l(f.a) } }; }) });
    if (sg.Organization && ctx.page === 'home') ld.push(Object.assign({ '@context': 'https://schema.org' }, org));
    if (sg.BreadcrumbList && crumb.length > 1) ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumb.map(function (c, n) { return { '@type': 'ListItem', position: n + 1, name: c.n, item: c.u }; }) });
    var alt = R.alternates(S, ctx), def = alt.filter(function (a) { return a.code === S.defaultLang; })[0];
    return { title: title, desc: desc, kw: kw, canonical: can, robots: 'noindex,nofollow', ogType: type, ogImage: img, alternates: alt, xdefault: def ? def.abs : null, jsonld: ld, gsc: S.seoGlobal.gsc, dir: (S.langs.filter(function (x) { return x.code === lang; })[0] || {}).dir || 'ltr' };
  };

  /* ---------- Site haritası, robots, llms ---------- */
  R.allPages = function (S, lang) {
    var o = [['home'], ['compare'], ['quote'], ['roi'], ['dealer'], ['faq'], ['blog']];
    S.blogCats.forEach(function (c) { o.push(['blogcat', c.id]); });
    S.countries.forEach(function (c) { o.push(['country', c.id]); });
    livePosts(S, lang).forEach(function (p) { o.push(['post', p.id]); });
    return o;
  };
  R.sitemap = function (S, lang) {
    var x = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    R.allPages(S, lang).forEach(function (a) {
      var ctx = { page: a[0], id: a[1], lang: lang, depth: 0 };
      if (S.seoGlobal.noindex[a[0] + (a[1] ? ':' + a[1] : '')]) return;
      var alts = R.alternates(S, ctx), p = a[0] === 'post' ? S.posts.filter(function (z) { return z.id === a[1]; })[0] : null;
      x += '  <url>\n    <loc>' + esc(R.absUrl(S, a[0], lang, a[1])) + '</loc>\n' + (p ? '    <lastmod>' + esc(p.modified || p.date) + '</lastmod>\n' : '') + alts.map(function (t) { return '    <xhtml:link rel="alternate" hreflang="' + t.hreflang + '" href="' + esc(t.abs) + '"/>\n'; }).join('') + '  </url>\n';
    });
    return x + '</urlset>\n';
  };
  R.sitemapIndex = function (S) { return '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + R.enabled(S).map(function (a) { return '  <sitemap><loc>' + S.site.base + '/sitemap-' + a.code + '.xml</loc></sitemap>\n'; }).join('') + '</sitemapindex>\n'; };
  R.robots = function (S) { return 'User-agent: *\nAllow: /\n' + S.seoGlobal.robotsExtra + '\n\nSitemap: ' + S.site.base + '/sitemap.xml\n'; };
  R.llms = function (S) {
    var o = '# DoorWin Pro\n\n> ' + (S.llmsIntro.en) + '\n\nLanguages: ' + R.enabled(S).map(function (x) { return x.name + ' (/' + x.code + '/)'; }).join(', ') + '\nPrices and availability vary by store and country; check the store listing.\n';
    R.enabled(S).forEach(function (x) {
      R.setLang(x.code);
      o += '\n## ' + x.name + '\n\n' + l(S.llmsIntro) + '\n\n### Pages\n';
      ['home', 'compare', 'quote', 'roi', 'faq', 'blog'].forEach(function (k) { o += '- [' + (k === 'home' ? l(S.ui.home) : l(S.pages[k].h1)) + '](' + R.absUrl(S, k, x.code) + '): ' + l(S.seo[k].desc) + '\n'; });
      o += '\n### Questions\n'; S.faq.forEach(function (f) { o += '- ' + l(f.q) + ' ' + l(f.a) + '\n'; });
      var ps = livePosts(S, x.code); if (ps.length) { o += '\n### Articles\n'; ps.forEach(function (p) { o += '- [' + p.i18n[x.code].title + '](' + R.absUrl(S, 'post', x.code, p.id) + '): ' + p.i18n[x.code].excerpt + '\n'; }); }
    });
    return o;
  };
  root.DWR = R;
  if (typeof module !== 'undefined') module.exports = R;
})(typeof window !== 'undefined' ? window : globalThis);
