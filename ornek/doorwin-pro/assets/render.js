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
    return '<img src="' + asset(ctx, 'img/' + m.base + '-420.webp') + '" srcset="' + asset(ctx, 'img/' + m.base + '-420.webp') + ' 420w, ' + asset(ctx, 'img/' + m.base + '-' + (m.big || 760) + '.webp') + ' ' + (m.big || 760) + 'w" sizes="' + (opt.sizes || '(max-width:640px) 60vw, 300px') + '"' + a + '>';
  }

  /* ---------- Teknik çizim (SVG): uygulamanın çizim kurallarıyla. Üçgenin tepesi menteşe tarafı, kol karşı tarafta. ---------- */
  var FILL = { white: '#ffffff', anth: '#3b4045', wood: '#96683c' }, GLASS = '#bfe2f5', INK = 'var(--dw-ink,#20182f)', OPEN = 'var(--dw-open,#5a2a9c)', DIMF = ' font-family="Barlow Condensed,Arial Narrow,sans-serif"';
  function line(a, b, c, d, st) { return '<line x1="' + a.toFixed(1) + '" y1="' + b.toFixed(1) + '" x2="' + c.toFixed(1) + '" y2="' + d.toFixed(1) + '"' + (st || ' stroke="' + INK + '"') + '/>'; }
  function bar(x, y, w, h, t, fill) {
    var r = '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="1.3"/>';
    r += '<rect x="' + (x + t).toFixed(1) + '" y="' + (y + t).toFixed(1) + '" width="' + Math.max(0, w - 2 * t).toFixed(1) + '" height="' + Math.max(0, h - 2 * t).toFixed(1) + '" fill="none" stroke="' + INK + '" stroke-width=".9"/>';
    var s = ' stroke="' + INK + '" stroke-width=".7"';
    return r + line(x, y, x + t, y + t, s) + line(x + w, y, x + w - t, y + t, s) + line(x, y + h, x + t, y + h - t, s) + line(x + w, y + h, x + w - t, y + h - t, s);
  }
  function glass(x, y, w, h) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + Math.max(0, w).toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '" fill="' + GLASS + '" stroke="' + INK + '" stroke-width=".8"/>'; }
  function sash(x, y, w, h, t, col, hinge, withHandle, door) {
    var o = bar(x, y, w, h, t, col), ix = x + t, iy = y + t, iw = w - 2 * t, ih = h - 2 * t;
    if (door) { var gh = ih * .54; o += glass(ix, iy, iw, gh) + '<rect x="' + ix.toFixed(1) + '" y="' + (iy + gh).toFixed(1) + '" width="' + Math.max(0, iw).toFixed(1) + '" height="' + Math.max(0, ih - gh).toFixed(1) + '" fill="' + (col === FILL.white ? '#f1f2f3' : col) + '" stroke="' + INK + '" stroke-width=".8"/>'; for (var k = 1; k < 5; k++) o += line(ix + k * iw / 5, iy + gh, ix + k * iw / 5, iy + ih, ' stroke="' + INK + '" stroke-width=".4"'); }
    else o += glass(ix, iy, iw, ih);
    if (hinge) {
      var apex = hinge === 'l' ? ix : ix + iw, far = hinge === 'l' ? ix + iw : ix, st = ' fill="none" stroke="' + OPEN + '" stroke-width="1" stroke-dasharray="5 3"';
      o += '<path d="M' + far.toFixed(1) + ' ' + iy.toFixed(1) + ' L' + apex.toFixed(1) + ' ' + (iy + ih / 2).toFixed(1) + ' L' + far.toFixed(1) + ' ' + (iy + ih).toFixed(1) + '"' + st + '/>';
      var hx = hinge === 'l' ? x + w - t * .72 : x + t * .28;
      if (withHandle !== false) o += '<rect x="' + hx.toFixed(1) + '" y="' + (y + h / 2 - 15).toFixed(1) + '" width="' + (t * .44).toFixed(1) + '" height="30" rx="1.5" fill="#8d9499" stroke="' + INK + '" stroke-width=".6"/>';
      var bx = hinge === 'l' ? x - 1.5 : x + w - 1.5; [.14, .86].forEach(function (f) { o += '<rect x="' + bx.toFixed(1) + '" y="' + (y + h * f - 7).toFixed(1) + '" width="3" height="14" fill="' + INK + '"/>'; });
    }
    return o;
  }
  function dimH(x1, x2, y, val, fs) {
    var m = (x1 + x2) / 2, tw = String(val).length * fs * .52 + 8, st = ' stroke="' + INK + '" stroke-width=".9"';
    return line(x1, y, m - tw / 2, y, st) + line(m + tw / 2, y, x2, y, st) + line(x1, y - 6, x1, y + 6, st) + line(x2, y - 6, x2, y + 6, st) + '<text x="' + m.toFixed(1) + '" y="' + (y + fs * .36).toFixed(1) + '" text-anchor="middle" font-size="' + fs + '" font-weight="600" fill="' + INK + '"' + DIMF + '>' + val + '</text>';
  }
  function dimV(y1, y2, x, val, fs) {
    var m = (y1 + y2) / 2, tw = String(val).length * fs * .52 + 8, st = ' stroke="' + INK + '" stroke-width=".9"';
    return line(x, y1, x, m - tw / 2, st) + line(x, m + tw / 2, x, y2, st) + line(x - 6, y1, x + 6, y1, st) + line(x - 6, y2, x + 6, y2, st) + '<text transform="translate(' + (x + fs * .36).toFixed(1) + ' ' + m.toFixed(1) + ') rotate(-90)" text-anchor="middle" font-size="' + fs + '" font-weight="600" fill="' + INK + '"' + DIMF + '>' + val + '</text>';
  }
  R.win = function (c, opt) {
    opt = opt || {};
    var t = c.type || 'cift', W = Math.max(+c.w || 1500, 300), H = Math.max(+c.h || 1500, 300), col = FILL[c.color] || FILL.white, boxW = opt.small ? 260 : 340, boxH = opt.small ? 200 : 290, s = Math.min(boxW / W, boxH / H), w = W * s, h = H * s, fs = opt.small ? 15 : 16, multi = t === 'cift' || t === 'surme', top = multi ? 56 : 32, x = 16 + (boxW - w) / 2, y = top + 2, ft = Math.max(5, 62 * s), st = Math.max(4, 74 * s), o = '';
    if (t === 'kemer') {
      var rad = w / 2;
      o += '<path d="M' + x + ' ' + (y + h) + ' V' + (y + rad) + ' A' + rad + ' ' + rad + ' 0 0 1 ' + (x + w) + ' ' + (y + rad) + ' V' + (y + h) + ' Z" fill="' + col + '" stroke="' + INK + '" stroke-width="1.4"/>';
      o += '<path d="M' + (x + ft) + ' ' + (y + h - ft) + ' V' + (y + rad) + ' A' + (rad - ft) + ' ' + (rad - ft) + ' 0 0 1 ' + (x + w - ft) + ' ' + (y + rad) + ' V' + (y + h - ft) + ' Z" fill="' + GLASS + '" stroke="' + INK + '"/>' + line(x, y + rad, x + w, y + rad, ' stroke="' + INK + '" stroke-width="2.4"');
    } else {
      o += bar(x, y, w, h, ft, col);
      var ix = x + ft, iy = y + ft, iw = w - 2 * ft, ih = h - 2 * ft;
      if (t === 'sabit') o += glass(ix, iy, iw, ih);
      if (t === 'tek') o += sash(ix, iy, iw, ih, st, col, 'l');
      if (t === 'kapi') o += sash(ix, iy, iw, ih, st, col, 'l', true, true);
      if (t === 'cift') {
        var mt = Math.max(4, 60 * s), sw = (iw - mt) / 2;
        o += sash(ix, iy, sw, ih, st, col, 'l', false) + sash(ix + sw + mt, iy, sw, ih, st, col, 'r') + '<rect x="' + (ix + sw).toFixed(1) + '" y="' + iy.toFixed(1) + '" width="' + mt.toFixed(1) + '" height="' + ih.toFixed(1) + '" fill="' + col + '" stroke="' + INK + '" stroke-width=".9"/>';
      }
      if (t === 'surme') {
        var ov = Math.max(4, 40 * s), sl = (iw + ov) / 2;
        o += sash(ix, iy, sl, ih, st, col) + sash(ix + sl - ov, iy, sl, ih, st, col);
        var ay = iy + ih / 2, as = ' fill="none" stroke="' + OPEN + '" stroke-width="1.4"';
        o += '<path d="M' + (ix + iw * .14) + ' ' + ay + ' h' + (iw * .2) + ' m-8 -5 l8 5 l-8 5"' + as + '/><path d="M' + (ix + iw * .86) + ' ' + ay + ' h-' + (iw * .2) + ' m8 -5 l-8 5 l8 5"' + as + '/>';
      }
    }
    if (multi) o += dimH(x, x + w / 2, top - 16, Math.round(W / 2), fs - 1) + dimH(x + w / 2, x + w, top - 16, W - Math.round(W / 2), fs - 1) + dimH(x, x + w, top - 38, W, fs);
    else o += dimH(x, x + w, top - 16, W, fs);
    o += dimV(y, y + h, x + w + 18, H, fs);
    return '<svg viewBox="0 0 ' + (boxW + 52) + ' ' + (y + h + 8).toFixed(1) + '" class="draw" role="img" aria-label="' + esc(opt.label || (W + ' x ' + H + ' mm')) + '">' + o + '</svg>';
  };
  /* Blog görselleri: her yazıya kendi konusunda ayrı teknik çizim */
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 16) + '" font-weight="' + (o.w || 500) + '" text-anchor="' + (o.a || 'middle') + '" fill="' + (o.c || INK) + '"' + DIMF + '>' + esc(s) + '</text>'; }
  function svg640(inner, label, h) { return '<svg viewBox="0 0 640 ' + (h || 340) + '" class="draw fig" role="img" aria-label="' + esc(label || '') + '">' + inner + '</svg>'; }
  function inner(s) { return s.replace(/^<svg[^>]*>|<\/svg>$/g, ''); }
  R.fig = function (kind, label) {
    var o = '', T = function (t, e, d) { return l({ tr: t, en: e, de: d }); }, i;
    if (kind === 'kesit') {
      [[60, 3, 40], [70, 5, 225], [80, 6, 430]].forEach(function (a) {
        var d = a[0], ch = a[1], x = a[2], w = d * 2, y = 70, hh = 190, cw = w / ch;
        o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>';
        for (var n = 1; n < ch; n++) o += line(x + cw * n, y + (n % 2 ? 0 : 26), x + cw * n, y + hh, ' stroke="' + INK + '" stroke-width="1.5"');
        o += line(x, y + 26, x + w, y + 26, ' stroke="' + INK + '" stroke-width="1.5"') + '<rect x="' + (x + w * .28) + '" y="' + (y - 34) + '" width="' + (w * .44) + '" height="34" fill="' + GLASS + '" stroke="' + INK + '"/>';
        o += dimH(x, x + w, y + hh + 26, d + ' mm', 16) + txt(x + w / 2, y + hh + 58, T('Örnek ', 'e.g. ', 'z. B. ') + ch + ' ' + T('odacık', 'chambers', 'Kammern'), { fs: 15 });
      });
      return svg640(o, label);
    }
    if (kind === 'alu') {
      var prof = function (x, br) {
        var y = 70, h = 190, w = 210, a = '';
        if (br) { a += '<rect x="' + x + '" y="' + y + '" width="86" height="' + h + '" fill="#d7dbde" stroke="' + INK + '" stroke-width="2"/><rect x="' + (x + 124) + '" y="' + y + '" width="86" height="' + h + '" fill="#d7dbde" stroke="' + INK + '" stroke-width="2"/>'; [40, 130].forEach(function (d) { a += '<rect x="' + (x + 86) + '" y="' + (y + d) + '" width="38" height="20" fill="#5a2a9c" stroke="' + INK + '"/>'; }); a += line(x + 105, y - 22, x + 105, y + 40, ' stroke="#5a2a9c" stroke-dasharray="4 3"') + txt(x + 105, y - 30, T('Poliamid', 'Polyamide', 'Polyamid'), { c: '#5a2a9c', w: 600 }); }
        else { a += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#d7dbde" stroke="' + INK + '" stroke-width="2"/>' + line(x + 70, y, x + 70, y + h) + line(x + 140, y, x + 140, y + h); }
        return a + txt(x + 105, y + h + 34, br ? T('Isı yalıtımlı', 'Thermally broken', 'Thermisch getrennt') : T('Yalıtımsız', 'Non-insulated', 'Ungedämmt'), { fs: 19, w: 600 });
      };
      return svg640(prof(60, false) + prof(370, true), label);
    }
    if (kind === 'acilim') {
      [['sabit', T('Sabit', 'Fixed', 'Fest')], ['ac', T('Açılır', 'Turn', 'Dreh')], ['vas', T('Vasistas', 'Tilt', 'Kipp')], ['sur', T('Sürme', 'Sliding', 'Schiebe')]].forEach(function (a, n) {
        var x = 22 + n * 152, y = 50, w = 130, h = 200, st = ' fill="none" stroke="' + OPEN + '" stroke-width="1.6" stroke-dasharray="6 4"';
        o += bar(x, y, w, h, 9, '#fff') + glass(x + 9, y + 9, w - 18, h - 18);
        if (a[0] === 'ac') o += '<path d="M' + (x + w - 9) + ' ' + (y + 9) + ' L' + (x + 9) + ' ' + (y + h / 2) + ' L' + (x + w - 9) + ' ' + (y + h - 9) + '"' + st + '/>';
        if (a[0] === 'vas') o += '<path d="M' + (x + 9) + ' ' + (y + 9) + ' L' + (x + w / 2) + ' ' + (y + h - 9) + ' L' + (x + w - 9) + ' ' + (y + 9) + '"' + st + '/>';
        if (a[0] === 'sur') o += '<path d="M' + (x + 30) + ' ' + (y + h / 2) + ' h70 m-10 -7 l10 7 l-10 7" fill="none" stroke="' + OPEN + '" stroke-width="2"/>';
        o += txt(x + w / 2, y + h + 34, a[1], { fs: 19, w: 600 });
      });
      return svg640(o, label);
    }
    if (kind === 'metraj') {
      var rows = [[T('Kasa', 'Frame', 'Rahmen'), '2 × (1,5 + 1,5)', '6,00 m'], [T('Kanat', 'Sash', 'Flügel'), '2 × 2 × (0,75 + 1,5)', '9,00 m'], [T('Orta kayıt', 'Mullion', 'Pfosten'), '1,5 − 0,12', '1,38 m'], [T('Çift cam', 'Double glass', 'Doppelglas'), '2 × 0,60 × 1,35', '1,62 m²'], [T('Çift açılım', 'Double opening', 'Doppelöffnung'), '', '1']];
      o += '<g transform="translate(0 16) scale(.82)">' + inner(R.win({ type: 'cift', w: 1500, h: 1500 }, {})) + '</g>';
      rows.forEach(function (r, n) { var y = 70 + n * 46; o += line(345, y + 14, 630, y + 14, ' stroke="' + INK + '" stroke-width=".6"') + txt(345, y, r[0], { a: 'start', fs: 18, w: 600 }) + txt(630, y, r[2], { a: 'end', fs: 18, w: 600 }) + (r[1] ? txt(510, y, r[1], { fs: 14 }) : ''); });
      return svg640(o, label);
    }
    if (kind === 'marj') {
      var X = 40, sc = .42, Y = 50;
      o += '<rect x="' + X + '" y="' + Y + '" width="' + 1000 * sc + '" height="48" fill="#d9d4e6" stroke="' + INK + '"/><rect x="' + (X + 1000 * sc) + '" y="' + Y + '" width="' + 200 * sc + '" height="48" fill="#5a2a9c" stroke="' + INK + '"/>';
      o += txt(X + 500 * sc, Y + 31, T('Maliyet 1.000', 'Cost 1,000', 'Kosten 1.000'), { fs: 20, w: 600 }) + txt(X + 1100 * sc, Y + 31, '200', { fs: 20, w: 600, c: '#fff' });
      o += dimH(X, X + 1200 * sc, Y + 74, T('Satış 1.200', 'Sale 1,200', 'Verkauf 1.200'), 17);
      o += txt(X, Y + 130, T('Kâr oranı', 'Markup', 'Aufschlag') + ': 200 / 1.000 = %20', { a: 'start', fs: 20, w: 600 }) + txt(X, Y + 164, T('Kâr marjı', 'Margin', 'Marge') + ': 200 / 1.200 = %16,7', { a: 'start', fs: 20, w: 600 }) + txt(X, Y + 198, T('%10 indirim = 120. Kalan kâr 80.', '10% discount = 120. Profit left: 80.', '10 % Rabatt = 120. Es bleiben 80 Gewinn.'), { a: 'start', fs: 20, w: 600, c: '#a32121' });
      return svg640(o, label, 270);
    }
    if (kind === 'yazilim') {
      o += '<rect x="70" y="30" width="130" height="250" rx="16" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/><rect x="82" y="46" width="106" height="22" fill="#5a2a9c"/><g transform="translate(82 76) scale(.27)">' + inner(R.win({ type: 'cift', w: 1500, h: 1500 }, {})) + '</g>';
      for (i = 0; i < 4; i++) o += line(84, 208 + i * 14, 186, 208 + i * 14, ' stroke="' + INK + '" stroke-width=".8"');
      o += txt(135, 312, T('Sahada çizim ve teklif', 'Drawing and quote on site', 'Zeichnung und Angebot vor Ort'), { fs: 17, w: 600 });
      o += '<rect x="300" y="42" width="300" height="186" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>' + line(450, 228, 450, 262, ' stroke="' + INK + '" stroke-width="3"') + line(400, 262, 500, 262, ' stroke="' + INK + '" stroke-width="3"');
      [[.72, .22], [.5, .44], [.86, .1], [.62, .3]].forEach(function (b, n) { var y = 62 + n * 38; o += '<rect x="318" y="' + y + '" width="' + 264 * b[0] + '" height="24" fill="#d7dbde" stroke="' + INK + '"/><rect x="' + (318 + 264 * b[0]) + '" y="' + y + '" width="' + 264 * b[1] + '" height="24" fill="#bfa8e2" stroke="' + INK + '"/>'; });
      o += txt(450, 312, T('Atölyede kesim ve üretim planı', 'Cutting and production planning', 'Zuschnitt und Produktionsplanung'), { fs: 17, w: 600 });
      return svg640(o, label);
    }
    if (kind === 'olcu') {
      var dx = 170, dy = 60, dw = 300, dh = 230, g = ' stroke="#5a2a9c" stroke-width="1.6"';
      o += '<path d="M' + (dx - 70) + ' ' + (dy - 40) + ' h' + (dw + 140) + ' v' + (dh + 74) + ' h-' + (dw + 140) + ' Z" fill="#e6e6e3"/><rect x="' + dx + '" y="' + dy + '" width="' + dw + '" height="' + dh + '" fill="#fff" stroke="' + INK + '" stroke-width="2.4"/>';
      [.12, .5, .88].forEach(function (f, n) { var y = dy + dh * f; o += line(dx, y, dx + dw, y, g) + txt(dx + 20, y - 5, T('G', 'W', 'B') + (n + 1), { fs: 16, w: 600, c: '#5a2a9c' }); });
      [.12, .5, .88].forEach(function (f, n) { var x = dx + dw * f; o += line(x, dy, x, dy + dh, ' stroke="#17603a" stroke-width="1.6"') + txt(x + 14, dy + 18, T('Y', 'H', 'H') + (n + 1), { fs: 16, w: 600, c: '#17603a' }); });
      o += line(dx, dy, dx + dw, dy + dh, ' stroke="' + INK + '" stroke-dasharray="7 5"') + line(dx + dw, dy, dx, dy + dh, ' stroke="' + INK + '" stroke-dasharray="7 5"');
      o += txt(630, 120, T('En küçük', 'Smallest', 'Kleinster'), { a: 'end', fs: 16, w: 600 }) + txt(630, 142, T('ölçü esas', 'value counts', 'Wert zählt'), { a: 'end', fs: 16, w: 600 }) + txt(10, 200, T('Köşegen', 'Diagonal', 'Diagonal-'), { a: 'start', fs: 16, w: 600 }) + txt(10, 222, T('farkı', 'difference', 'differenz'), { a: 'start', fs: 16, w: 600 });
      return svg640(o, label);
    }
    return '';
  };
  var TOOLI = {
    sabit: '<rect x="4" y="3" width="24" height="26" fill="none" stroke="currentColor" stroke-width="2"/>',
    tek: '<rect x="4" y="3" width="24" height="26" fill="none" stroke="currentColor" stroke-width="2"/><path d="M28 3 L4 16 L28 29" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    cift: '<rect x="2" y="3" width="28" height="26" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 3v26" stroke="currentColor" stroke-width="2"/><path d="M16 3 L2 16 L16 29M16 3 L30 16 L16 29" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    surme: '<rect x="2" y="6" width="28" height="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 16h9m-3-3l3 3-3 3M26 16h-9m3-3l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    kapi: '<rect x="8" y="2" width="16" height="28" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 17h16" stroke="currentColor" stroke-width="1.4"/><path d="M20 12v4" stroke="currentColor" stroke-width="2.4"/>'
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
    it.forEach(function (x) { if (x.unit !== '%') x.qty *= q; x.price *= q; });
    var net = it.reduce(function (a, x) { return a + x.price; }, 0);
    var profit = net * (+p.profit || 0) / 100, sale = net + profit, tax = sale * (+p.vat || 0) / 100;
    return { items: it, net: net, profit: profit, sale: sale, tax: tax, gross: sale + tax, margin: sale ? profit / sale : 0, qty: q };
  };
  /* Birden çok poz: aynı kalemler toplanır */
  R.calcAll = function (list, p) {
    var map = {}, order = [];
    list.forEach(function (c) { R.calc(c, p).items.forEach(function (i) { if (i.unit === '%') { if (!map.lColour) { map.lColour = { k: 'lColour', qty: 0, unit: 'tut', price: 0 }; order.push('lColour'); } map.lColour.price += i.price; return; } if (!map[i.k]) { map[i.k] = { k: i.k, qty: 0, unit: i.unit, price: 0 }; order.push(i.k); } map[i.k].qty += i.qty; map[i.k].price += i.price; }); });
    var it = order.map(function (k) { return map[k]; }), net = it.reduce(function (a, x) { return a + x.price; }, 0), profit = net * (+p.profit || 0) / 100, sale = net + profit, tax = sale * (+p.vat || 0) / 100;
    return { items: it, net: net, profit: profit, sale: sale, tax: tax, gross: sale + tax, qty: 1 };
  };
  R.dateL = function (d) { try { return new Date(d + 'T12:00:00').toLocaleDateString(cur.lang === 'de' ? 'de-DE' : cur.lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d; } };
  var num = R.num = function (n, d) { try { return Number(n).toLocaleString(cur.lang === 'de' ? 'de-DE' : cur.lang === 'tr' ? 'tr-TR' : 'en-GB', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); } catch (e) { return Number(n).toFixed(d == null ? 2 : d); } };
  R.money = function (n, c) { return num(n) + ' ' + c; };
  R.setLang = function (c) { cur.lang = c; };
  R.qtable = function (S, list, p, hide) {
    list = Array.isArray(list) ? list : [list];
    var r = R.calcAll(list, p), u = S.ui, h = '<table class="tbl qt"><thead><tr><th>' + l(u.lItem) + '</th><th class="r">' + l(u.lQty) + '</th><th class="r">' + l(u.lUnit) + '</th>' + (hide ? '' : '<th class="r">' + l(u.lPrice) + '</th>') + '</tr></thead><tbody>';
    r.items.forEach(function (i) { h += '<tr><td>' + l(u[i.k]) + '</td><td class="r m">' + (i.unit === 'tut' ? '' : num(i.qty, i.unit === 'pcs' ? 0 : 2)) + '</td><td class="r m">' + (i.unit === 'pcs' ? l(u.pcs) : i.unit === 'tut' ? '' : i.unit) + '</td>' + (hide ? '' : '<td class="r m">' + num(i.price) + '</td>') + '</tr>'; });
    h += '</tbody>';
    if (!hide) h += '<tfoot><tr><th colspan="3">' + l(u.net) + '</th><td class="r m">' + R.money(r.net, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.profit) + ' (%' + num(p.profit, 0) + ')</th><td class="r m">' + R.money(r.profit, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.salePrice) + '</th><td class="r m">' + R.money(r.sale, p.cur) + '</td></tr><tr><th colspan="3">' + l(u.tax) + ' (%' + num(p.vat, 0) + ')</th><td class="r m">' + R.money(r.tax, p.cur) + '</td></tr><tr class="grand"><th colspan="3">' + l(u.gross) + '</th><td class="r m" data-gross>' + R.money(r.gross, p.cur) + '</td></tr></tfoot>';
    return h + '</table>';
  };
  var TYPES = [['sabit', 'tSabit'], ['tek', 'tTek'], ['cift', 'tCift'], ['surme', 'tSurme'], ['kapi', 'tKapi']], COLORS = [['white', 'cWhite'], ['anth', 'cAnth'], ['wood', 'cWood']];
  function field(lbl, inner, cls) { return '<label class="fld ' + (cls || '') + '"><span>' + esc(lbl) + '</span>' + inner + '</label>'; }
  var rid = 0;
  function quoteControls(S, cfg) {
    var u = S.ui, nm = 'q-type-' + (++rid);
    var seg = '<fieldset class="tools-b"><legend class="sr">' + l(u.opening) + '</legend>' + TYPES.map(function (t) { return '<label><input type="radio" name="' + nm + '" value="' + t[0] + '"' + (cfg.type === t[0] ? ' checked' : '') + ' data-q="type"><span><svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">' + TOOLI[t[0]] + '</svg><em>' + l(u[t[1]]) + '</em></span></label>'; }).join('') + '</fieldset>';
    return seg + '<div class="grid3">' + field(l(u.width), '<input type="number" inputmode="numeric" min="300" max="6000" step="10" value="' + cfg.w + '" data-q="w">') + field(l(u.height), '<input type="number" inputmode="numeric" min="300" max="4000" step="10" value="' + cfg.h + '" data-q="h">') +
      field(l(u.colour), '<select data-q="color">' + COLORS.map(function (t) { return '<option value="' + t[0] + '"' + (cfg.color === t[0] ? ' selected' : '') + '>' + l(u[t[1]]) + '</option>'; }).join('') + '</select>') + '</div>';
  }
  var APPBAR = '<div class="ab" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2"/></svg><b>1</b><i></i><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="2"/></svg><svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 7L4 12l5 5M4 12h11a5 5 0 015 5" fill="none" stroke="currentColor" stroke-width="2"/></svg><svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 7l5 5-5 5M20 12H9a5 5 0 00-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>';
  function qdata(cfg, p, src, extra) { return ' data-w="quote" data-src="' + esc(src) + '" data-cfg=\'' + esc(JSON.stringify(cfg)) + '\' data-prices=\'' + esc(JSON.stringify(p)) + '\'' + (extra || ''); }
  function sumRow(S, r, p) { var u = S.ui; return '<div class="qc-sum"><div><span>' + l(u.net) + '</span><b class="m" data-q-net>' + R.money(r.net, p.cur) + '</b></div><div><span>' + l(u.salePrice) + '</span><b class="m" data-q-sale>' + R.money(r.sale, p.cur) + '</b></div><div class="qc-g"><span>' + l(u.gross) + '</span><b class="m" data-q-gross>' + R.money(r.gross, p.cur) + '</b></div></div>'; }
  function compactQuote(S, ctx, src, pv) {
    var cfg = { type: 'cift', w: 1500, h: 1500, color: 'white', qty: 1 }, p = Object.assign({}, S.prices, pv || {}), r = R.calc(cfg, p), u = S.ui;
    return '<div class="qc"' + qdata(cfg, p, src) + '>' + APPBAR + '<div class="qc-in"><div class="qc-draw" data-q-draw>' + R.win(cfg, { small: true }) + '</div>' + quoteControls(S, cfg) + sumRow(S, r, p) + '<p class="tiny">' + l(u.sampleQuote) + ' <a href="' + href(S, ctx, 'quote') + '" class="link" data-funnel="tool" data-src="' + esc(src) + '">' + l(u.openQuote) + '</a></p></div></div>';
  }
  /* Tasarım 3 girişi: müşteriye giden teklif kâğıdı */
  function paperQuote(S, ctx, src) {
    var cfg = { type: 'surme', w: 2400, h: 2200, color: 'anth', qty: 1 }, p = Object.assign({}, S.prices), u = S.ui;
    return '<div class="paper"' + qdata(cfg, p, src) + '><header class="paper-h"><b>' + l(u.quoteDoc) + ' 108</b><span>' + l(S.home.v3.client) + '</span></header><div class="paper-g"><div class="qc-draw" data-q-draw>' + R.win(cfg, { small: true }) + '</div><div data-q-table class="paper-t">' + R.qtable(S, cfg, p) + '</div></div><div class="paper-c">' + quoteControls(S, cfg) + '<label class="chk sw"><input type="checkbox" data-q="hide"><span>' + l(u.hidePrice) + '</span></label><p class="tiny">' + l(u.sampleQuote) + '</p></div></div>';
  }
  function fullQuote(S, ctx, src, pv) {
    var cfg = { type: 'cift', w: 1500, h: 1500, color: 'white', qty: 1 }, p = Object.assign({}, S.prices, pv || {}), u = S.ui;
    var pf = [['frame', 'pFrame'], ['mullion', 'pMullion'], ['sash', 'pSash'], ['open1', 'pOpen1'], ['open2', 'pOpen2'], ['glass', 'pGlass'], ['slide', 'pSlide'], ['door', 'pDoor'], ['anth', 'cAnth', ' %'], ['wood', 'cWood', ' %'], ['profit', 'pProfit'], ['vat', 'pVat']];
    return '<div class="qf"' + qdata(cfg, p, src, ' data-full="1"') + '><form class="qf-in" onsubmit="return false"><div class="grid2">' + field(l(u.customer), '<input type="text" maxlength="60" data-m="cust" autocomplete="off">') + field(l(u.project), '<input type="text" maxlength="60" data-m="proj" autocomplete="off">') + '</div><div class="poz" data-q-poz></div>' + quoteControls(S, cfg) + field(l(u.qty), '<input type="number" min="1" max="500" value="1" data-q="qty">', 'short') +
      '<details class="pl"><summary>' + l(u.priceList) + '</summary><div class="grid3">' + field(l(u.currency), '<input type="text" maxlength="4" value="' + esc(p.cur) + '" data-p="cur">') + pf.map(function (x) { return field(l(u[x[1]]) + (x[2] || ''), '<input type="number" min="0" step="0.5" value="' + p[x[0]] + '" data-p="' + x[0] + '">'); }).join('') + '</div></details><label class="chk sw"><input type="checkbox" data-q="hide"><span>' + l(u.hidePrice) + '</span></label></form>' +
      '<div class="sheet" id="quote-sheet"><header class="sheet-h"><div><b>' + l(u.quoteDoc) + '</b><span data-q-meta></span></div><time class="m" data-q-date></time></header><div class="sheet-d" data-q-draw>' + R.win(cfg) + '</div><div data-q-table>' + R.qtable(S, cfg, p) + '</div><p class="tiny">' + l(u.sampleQuote) + ' ' + l(u.scale) + '.</p></div>' +
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
  R.slug = function (t) { return String(t).toLocaleLowerCase('tr').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ä/g, 'ae').replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70); };
  function qa(item) { var id = R.slug(l(item.q)); return '<details class="qa" id="' + id + '"><summary><h3>' + esc(l(item.q)) + '</h3></summary><div class="qa-a"><p>' + esc(l(item.a)) + '</p><a class="qa-l" href="#' + id + '">#' + id + '</a></div></details>'; }

  /* ---------- Blog ---------- */
  function postCard(S, ctx, p, big) {
    var i = p.i18n[ctx.lang], c = S.blogCats.filter(function (x) { return x.id === p.cat; })[0];
    return '<article class="pc' + (big ? ' big' : '') + '" data-tags="' + esc((p.tags || []).join('|')) + '"><a class="pc-fig" href="' + href(S, ctx, 'post', ctx.lang, p.id) + '" tabindex="-1" aria-hidden="true">' + postFig(S, ctx, p) + '</a><div class="pc-b"><a class="mono kicker" href="' + href(S, ctx, 'blogcat', ctx.lang, p.cat) + '">' + esc(l(c ? c.n : '')) + '</a><h3><a href="' + href(S, ctx, 'post', ctx.lang, p.id) + '">' + esc(i.title) + '</a></h3><p>' + esc(i.excerpt) + '</p><time class="tiny m" datetime="' + esc(p.date) + '">' + esc(R.dateL(p.date)) + '</time></div></article>';
  }
  function postFig(S, ctx, p) {
    if (p.image && mediaById(S, p.image)) return img(S, ctx, p.image, { sizes: '(max-width:640px) 90vw, 360px' });
    if (p.fig) return R.fig(p.fig, p.i18n[ctx.lang] ? p.i18n[ctx.lang].title : '');
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
    var lg = '<details class="lang"><summary aria-label="' + l(u.lang) + '"><span>' + ctx.lang.toUpperCase() + '</span></summary><ul>' + alts.map(function (a) { return '<li><a hreflang="' + a.hreflang + '" lang="' + a.code + '" data-lang-link="' + a.code + '" href="' + up(ctx) + a.path + '"' + (a.code === ctx.lang ? ' aria-current="true"' : '') + '>' + esc(a.name) + '</a></li>'; }).join('') + '</ul></details>';
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
  var LABEL = { features: 'navFeatures', adv: 'advShort', tools: 'toolsShort', uses: 'uses', shots: 'scr', video: 'video', compare: 'navCompare', reviews: 'lblReviews', faq: 'navFaq', blog: 'navBlog', cta: 'getPro' };
  function sh(n, title, sub, id) { return '<div class="sh"><h2' + (id ? ' id="' + id + '"' : '') + '>' + esc(title) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>'; }
  function phone(S, ctx, id, opt) { return '<figure class="ph">' + img(S, ctx, id, opt) + '</figure>'; }
  function vv(S, lay, k) { var v = lay > 1 && S.home['v' + lay]; return v && v[k] ? v[k] : S.home[k]; }
  function specs(S) { return '<ul class="specs">' + S.home.facts.map(function (f) { return '<li><span>' + esc(l(f.k)) + '</span> ' + esc(l(f.v)) + '</li>'; }).join('') + '</ul>'; }
  var SEC = {
    hero: function (S, ctx, lay) {
      var eb = l(vv(S, lay, 'eyebrow')), h1 = l(vv(S, lay, 'h1')), lead = l(vv(S, lay, 'lead'));
      var cta = '<div class="stores">' + storeBtn(S, 'pro', 'ios', 'hero', 'btn-pri') + (S.links.proPlay ? storeBtn(S, 'pro', 'play', 'hero', 'btn-pri') : storeBtn(S, 'lite', 'play', 'hero', 'btn-line')) + '</div><p class="hero-2"><a class="link" href="' + href(S, ctx, 'quote') + '" data-funnel="tool" data-src="hero">' + esc(l(S.home.cta2)) + '</a></p>';
      if (lay === 2) {
        var ids = ['pro-drawing', 'pro-estimate', 'pro-projects', 'pro-sensor'];
        return '<section class="hero h2"><div class="wrap"><div class="h2-t"><div><p class="eb">' + esc(eb) + '</p><h1>' + esc(h1) + '</h1></div><div><p class="lead">' + esc(lead) + '</p>' + cta + '</div></div></div><div class="wrap door-w"><div class="door" data-door style="--o:1"><div class="door-dim d-w" aria-hidden="true"><span class="big">3600</span><span class="sm">1800</span></div><div class="door-dim d-h" aria-hidden="true"><span>2000</span></div><div class="door-f"><div class="door-room">' + ids.map(function (id, n) { return phone(S, ctx, id, { eager: n < 2, sizes: '(max-width:640px) 40vw, 240px' }); }).join('') + '</div><div class="sash s1"></div><div class="sash s2"><i></i></div></div></div><label class="door-r"><span>' + l(S.ui.slideDoor) + '</span><input type="range" min="0" max="100" value="100" data-door-r></label></div><div class="wrap">' + specs(S) + '</div></section>';
      }
      if (lay === 3) return '<section class="hero h3"><div class="wrap h3-g"><div class="h3-t"><p class="eb">' + esc(eb) + '</p><h1>' + esc(h1) + '</h1><p class="lead">' + esc(lead) + '</p>' + cta + specs(S) + '</div>' + paperQuote(S, ctx, 'hero') + '</div></section>';
      return '<section class="hero h1"><div class="wrap h1-g"><div class="h1-t"><p class="eb">' + esc(eb) + '</p><h1>' + esc(h1) + '</h1><p class="lead">' + esc(lead) + '</p>' + cta + specs(S) + '</div>' + compactQuote(S, ctx, 'hero') + '</div></section>';
    },
    features: function (S, ctx, lay) {
      var h = S.home, x = h.features;
      if (lay === 2) return sect('features', sh(0, l(h.featuresTitle)) + '<div class="f2">' + x.map(function (f, i) { return '<article class="f2-r' + (i % 2 ? ' rv' : '') + '"><div class="f2-p">' + phone(S, ctx, f.img, { sizes: '(max-width:640px) 56vw, 280px' }) + '</div><div class="f2-c"><h3>' + esc(l(f.t)) + '</h3><p>' + esc(l(f.d)) + '</p></div></article>'; }).join('') + '</div>');
      if (lay === 3) return sect('features', sh(0, l(h.featuresTitle)) + '<div class="f3" data-f3><div class="f3-l" role="tablist">' + x.map(function (f, i) { return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-f3-i="' + i + '"' + (i ? '' : ' class="on"') + '><b>' + esc(l(f.t)) + '</b><span>' + esc(l(f.d)) + '</span></button>'; }).join('') + '</div><div class="f3-p">' + x.map(function (f, i) { return '<div data-f3-p="' + i + '"' + (i ? ' hidden' : '') + '>' + phone(S, ctx, f.img, { sizes: '(max-width:640px) 62vw, 320px' }) + '</div>'; }).join('') + '</div></div>');
      return sect('features', sh(0, l(h.featuresTitle), l(h.featuresSub)) + '<ol class="f1">' + x.map(function (f) { return '<li><i class="tick" aria-hidden="true"></i>' + phone(S, ctx, f.img, { sizes: '(max-width:640px) 40vw, 230px' }) + '<div><h3>' + esc(l(f.t)) + '</h3><p>' + esc(l(f.d)) + '</p></div></li>'; }).join('') + '</ol>');
    },
    adv: function (S, ctx, lay) {
      var h = S.home;
      return sect('adv', sh(0, l(h.advTitle)) + '<dl class="adv">' + h.adv.map(function (a) { return '<div><dt>' + esc(l(a.t)) + '</dt><dd>' + esc(l(a.d)) + '</dd></div>'; }).join('') + '</dl><div class="stores adv-s">' + storeBtn(S, 'pro', 'ios', 'advantages', 'btn-pri') + '</div>');
    },
    tools: function (S, ctx, lay) {
      var h = S.home;
      return sect('tools', sh(0, l(h.toolsTitle)) + '<ul class="tl">' + h.tools.map(function (t) { return '<li><a href="' + href(S, ctx, t.page) + '" data-funnel="tool" data-src="home-tools"><b>' + esc(l(t.t)) + '</b><span>' + esc(l(t.d)) + '</span></a></li>'; }).join('') + '</ul>');
    },
    uses: function (S, ctx, lay) {
      var h = S.home;
      return sect('uses', sh(0, l(h.usesTitle)) + '<div class="uses">' + h.uses.map(function (u) { return '<article class="use"><div class="use-d">' + R.win(u.draw, { small: true, label: l(u.t) }) + '</div><div><h3>' + esc(l(u.t)) + '</h3><p>' + esc(l(u.d)) + '</p></div></article>'; }).join('') + '</div>');
    },
    shots: function (S, ctx, lay) {
      var h = S.home, all = S.screens.concat(S.liteScreens || []);
      return sect('shots', sh(0, l(h.shotsTitle), l(h.shotsNote)) + '<ul class="shots" tabindex="0" aria-label="' + l(S.ui.scrollHint) + '">' + all.map(function (id) { var m = mediaById(S, id); return m ? '<li' + (m.lite ? ' class="lt"' : '') + '><figure class="ph">' + img(S, ctx, id, { sizes: '(max-width:640px) 52vw, 240px' }) + '<figcaption>' + esc(l(m.cap)) + '</figcaption></figure></li>' : ''; }).join('') + '</ul>');
    },
    video: function (S, ctx, lay) {
      var h = S.home, src = S.links.video, isFile = /\.(webm|mp4)(\?|$)/i.test(src), u = isFile && !/^https?:/.test(src) ? up(ctx) + src : src, media = '';
      if (src) media = isFile ? '<video controls preload="none" playsinline width="1280" height="720" poster="' + asset(ctx, 'img/demo-poster.webp') + '" aria-label="' + esc(l(h.videoTitle)) + '" data-track-video><source src="' + esc(u) + '"><track kind="captions"><a href="' + esc(u) + '">' + l(S.ui.videoFallback) + '</a></video>' : '<button class="vfacade" type="button" data-video-src="' + esc(src) + '" aria-label="' + l(S.ui.playVideo) + '"><img src="' + asset(ctx, 'img/demo-poster.webp') + '" width="1280" height="720" alt="" loading="lazy"><span class="play" aria-hidden="true"></span></button>';
      return sect('video', '<div class="v-g"><div>' + sh(0, l(h.videoTitle), l(h.videoText)) + '</div><div class="vbox">' + media + '</div></div>');
    },
    compare: function (S, ctx, lay) {
      var h = S.home;
      return sect('compare', sh(0, l(h.compareTitle), l(h.compareText)) + cmpDuo(S, ctx) + cmpTable(S) + '<p class="cmp-more"><a class="btn btn-line" href="' + href(S, ctx, 'compare') + '" data-funnel="tool" data-src="home-compare">' + l(S.ui.seeCompare) + '</a></p>');
    },
    reviews: function (S, ctx, lay) {
      var h = S.home, rs = h.reviews || [];
      return sect('reviews', sh(0, l(h.reviewsTitle)) + (rs.length ? '<div class="revs">' + rs.map(function (r) { return '<figure class="rev"><blockquote>' + esc(l(r.q)) + '</blockquote><figcaption><b>' + esc(l(r.n)) + '</b><span>' + esc(l(r.r)) + '</span></figcaption></figure>'; }).join('') + '</div>' : '') + '<div class="rev-g"><div><p>' + esc(l(rs.length ? h.reviewsNoteFull : h.reviewsNote)) + '</p><p class="tiny">' + esc(l(h.storeRating)) + '</p></div>' + reviewForm(S) + '</div>');
    },
    faq: function (S, ctx, lay) {
      return sect('faq', sh(0, l(S.pages.faq.h1)) + '<div class="qas">' + S.faq.filter(function (f) { return f.home; }).map(qa).join('') + '</div><p class="more"><a class="link" href="' + href(S, ctx, 'faq') + '">' + l(S.ui.seeAll) + '</a></p>');
    },
    blog: function (S, ctx, lay) {
      return sect('blog', sh(0, l(S.pages.blog.h1)) + '<div class="pcs">' + livePosts(S, ctx.lang).slice(0, 3).map(function (p) { return postCard(S, ctx, p); }).join('') + '</div><p class="more"><a class="link" href="' + href(S, ctx, 'blog') + '">' + l(S.ui.seeAll) + '</a></p>');
    },
    cta: function (S, ctx) {
      var h = S.home;
      return '<section class="cta" id="cta"><div class="wrap cta-g"><div><h2>' + esc(l(h.ctaTitle)) + '</h2><p>' + esc(l(h.ctaText)) + '</p>' + storeRow(S, 'cta') + '<p class="tiny">' + esc(l(h.note)) + '</p></div><div class="cta-d" aria-hidden="true">' + R.win({ type: 'surme', w: 2400, h: 2200, color: 'white' }, { label: ' ' }) + '</div></div></section>';
    }
  };
  function reviewForm(S) {
    var u = S.ui;
    return '<form class="rev-f" data-w="review" novalidate><h3>' + l(u.revTitle) + '</h3><div class="grid2">' + field(l(u.revName), '<input name="name" required maxlength="50" autocomplete="name"><small class="err" hidden></small>') + field(l(u.revCompany), '<input name="company" maxlength="60" autocomplete="organization">') + '</div>' + field(l(u.revText), '<textarea name="text" rows="3" required maxlength="400"></textarea><small class="err" hidden></small>') + '<label class="hp" aria-hidden="true">' + l(u.fExtra) + '<input name="website" tabindex="-1" autocomplete="off"></label><button class="btn btn-line" type="submit">' + l(u.revSend) + '</button><p class="form-msg" role="status" aria-live="polite"></p></form>';
  }
  function sect(id, inner, cls) { return '<section class="sec s-' + id + ' ' + (cls || '') + '" id="' + id + '"><div class="wrap">' + inner + '</div></section>'; }
  function homeOrder(S, lay) { return (S.layouts[lay] || S.layouts[1]).filter(function (k) { return !S.hidden[k]; }); }
  function pageHome(S, ctx, lay) { return homeOrder(S, lay).map(function (k) { return SEC[k] ? SEC[k](S, ctx, lay) : ''; }).join(''); }
  function cmpDuo(S, ctx) {
    var c = S.compare;
    return '<div class="duo"><figure>' + phone(S, ctx, 'lite-estimate', { sizes: '200px' }) + '<figcaption><b>' + esc(l(c.nameLite)) + '</b><span>' + esc(l(S.pricing.liteModel)) + '</span></figcaption></figure><figure>' + phone(S, ctx, 'pro-estimate', { sizes: '200px' }) + '<figcaption><b>' + esc(l(c.namePro)) + '</b><span>' + esc(l(S.pricing.proFree)) + '</span></figcaption></figure></div>';
  }

  /* ---------- Alt sayfalar ---------- */
  function pageHead(S, ctx, key, trail, vars) {
    var p = S.pages[key], t = l(p.h1), d = l(p.lead);
    if (vars) Object.keys(vars).forEach(function (k) { t = t.replace('{' + k + '}', vars[k]); d = d.replace('{' + k + '}', vars[k]); });
    return '<div class="ph-h"><div class="wrap">' + crumbs(S, ctx, [{ n: l(S.ui.home), href: href(S, ctx, 'home') }].concat(trail)) + '<h1>' + esc(t) + '</h1><p class="lead">' + esc(d) + '</p></div></div>';
  }
  var PAGES = {
    compare: function (S, ctx) { return pageHead(S, ctx, 'compare', [{ n: l(S.ui.navCompare) }]) + '<section class="sec"><div class="wrap">' + cmpDuo(S, ctx) + cmpTable(S) + '<div class="stores cmp-b">' + storeBtn(S, 'pro', 'ios', 'compare', 'btn-pri') + storeBtn(S, 'lite', 'ios', 'compare', 'btn-line') + storeBtn(S, 'lite', 'play', 'compare', 'btn-line') + '</div></div></section><section class="sec lilac"><div class="wrap">' + wizard(S, ctx) + '</div></section>'; },
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
      return '<article class="post" data-post="' + p.id + '"><div class="ph-h"><div class="wrap narrow">' + crumbs(S, ctx, [{ n: l(S.ui.home), href: href(S, ctx, 'home') }, { n: l(S.ui.navBlog), href: href(S, ctx, 'blog') }, { n: l(c.n), href: href(S, ctx, 'blogcat', ctx.lang, p.cat) }, { n: i.title }]) + '<p class="eb">' + esc(l(c.n)) + ' · ' + l(S.ui.sampleContent) + '</p><h1>' + esc(i.title) + '</h1><p class="lead">' + esc(i.excerpt) + '</p><p class="tiny"><span>' + l(S.ui.author) + ': ' + esc(a ? l(a.n) : '') + '</span> · <time datetime="' + esc(p.date) + '" class="m">' + l(S.ui.published) + ': ' + esc(R.dateL(p.date)) + '</time></p></div></div><div class="wrap narrow post-b"><figure class="post-f">' + postFig(S, ctx, p) + '</figure>' + video + '<div class="prose">' + bodyHtml(S, ctx, i.html) + '</div>' + (i.qa && i.qa.length ? '<section class="post-q"><h2>' + l(S.ui.questions) + '</h2><div class="qas">' + i.qa.map(function (q) { return '<details class="qa" open><summary><h3>' + esc(q.q) + '</h3></summary><div class="qa-a"><p>' + esc(q.a) + '</p></div></details>'; }).join('') + '</div></section>' : '') + '<aside class="post-cta"><h2>' + l(S.ui.ctaInPost) + '</h2>' + '<a class="btn btn-line" href="' + href(S, ctx, 'quote') + '" data-funnel="blog-to-quote" data-src="' + src + '">' + l(S.ui.openQuote) + '</a>' + storeRow(S, src) + '</aside>' + ((p.tags || []).length ? '<p class="tags">' + p.tags.map(function (t) { return '<a class="tag" href="' + href(S, ctx, 'blog') + '#tag=' + encodeURIComponent(t) + '">#' + esc(t) + '</a>'; }).join('') + '</p>' : '') + '</div><section class="sec"><div class="wrap"><h2>' + l(S.ui.related) + '</h2><div class="pcs">' + related(S, p, ctx.lang).map(function (x) { return postCard(S, ctx, x); }).join('') + '</div></div></section></article>';
    },
    country: function (S, ctx) {
      var k = S.countries.filter(function (x) { return x.id === ctx.id; })[0], v = { loc: l(k.loc), cur: k.cur, vat: k.vat, lang: l(k.lang) }, src = 'country:' + k.id;
      return pageHead(S, ctx, 'country', [{ n: l(S.ui.countries) }, { n: l(k.n) }], v) + '<section class="sec"><div class="wrap h1-g">' + '<div>' + storeRow(S, src) + (k.local ? '<p class="c-local">' + esc(l(k.local)) + '</p>' : '') + '<dl class="adv one">' + S.home.features.slice(0, 3).map(function (f) { return '<div><dt>' + esc(l(f.t)) + '</dt><dd>' + esc(l(f.d)) + '</dd></div>'; }).join('') + '</dl></div>' + compactQuote(S, ctx, src, { cur: k.cur, vat: k.vat }) + '</div></section>' + '<section class="sec band"><div class="wrap narrow">' + leadForm(S, ctx, k) + '</div></section>';
    }
  };
  PAGES.blogcat = PAGES.blog;
  function leadForm(S, ctx, country) {
    var u = S.ui, a = 3, b = 4;
    var tp = [['general', 'tGeneral'], ['quote', 'tQuoteReq'], ['dealer', 'tDealer']], ft = [['dealer', 'fDealer'], ['manufacturer', 'fMan'], ['installer', 'fIns'], ['other', 'fOther']];
    return '<form class="lead" data-w="lead" novalidate data-country="' + (country ? country.id : '') + '"><h2>' + l(u.formTitle) + '</h2><div class="grid2">' + field(l(u.fTopic), '<select name="topic">' + tp.map(function (x) { return '<option value="' + x[0] + '">' + l(u[x[1]]) + '</option>'; }).join('') + '</select>') + field(l(u.fCompany), '<input name="company" required autocomplete="organization"><small class="err" hidden></small>') + field(l(u.fType), '<select name="type">' + ft.map(function (x) { return '<option value="' + x[0] + '">' + l(u[x[1]]) + '</option>'; }).join('') + '</select>') + field(l(u.fCountry), '<input name="country" required autocomplete="country-name" value="' + (country ? esc(l(country.n)) : '') + '"><small class="err" hidden></small>') + field(l(u.fEmail), '<input type="email" name="email" required autocomplete="email"><small class="err" hidden></small>') + field(l(u.fTeam), '<input type="number" min="1" name="team" value="3">') + field(l(u.fQuotes), '<input type="number" min="0" name="quotes" value="30">') + '</div>' + field(l(u.fMsg), '<textarea name="msg" rows="4" maxlength="800"></textarea>') + '<label class="hp" aria-hidden="true">' + l(u.fExtra) + '<input name="website" tabindex="-1" autocomplete="off"></label><p class="note" data-from-roi hidden>' + l(u.fromRoi) + '</p>' + field(l(u.fCaptcha).replace('{a}', a).replace('{b}', b), '<input name="cap" inputmode="numeric" required data-a="' + a + '" data-b="' + b + '"><small class="err" hidden></small>', 'short') + '<label class="chk"><input type="checkbox" name="ok" required><span>' + l(u.fConsent) + '</span></label><small class="err" data-err-ok hidden></small><button class="btn btn-pri" type="submit">' + l(u.fSend) + '</button><p class="form-msg" role="status" aria-live="polite"></p></form>';
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
