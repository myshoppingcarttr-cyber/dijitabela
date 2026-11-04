/* Yönetim paneli (prototip): tüm değişiklikler bu tarayıcıda dw_state anahtarına yazılır, site aynı veriyi okur. */
(function () {
  var R = window.DWR, esc = R.esc, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ls = { g: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, s: function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }, r: function (k) { try { localStorage.removeItem(k); } catch (e) { } } };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); }, jget = function (k, d) { try { return JSON.parse(ls.g(k)) || d; } catch (e) { return d; } };
  var S = jget('dw_state', null); if (!S || S.version !== window.DW_SEED.version) S = clone(window.DW_SEED);
  var el = $('#panel'), edLang = ls.g('dw_edlang') || 'tr', ui = { view: 'overview', range: 30, post: null, faqCat: '', seoPage: 'home', blogStatus: '', smLang: 'tr', table: false, crawl: null };
  var ACT = {}, saveT;
  var PASS = 'demo-2026', USERS = { yonetici: { role: 'admin', n: 'Yönetici' }, editor: { role: 'editor', n: 'Editör' } };
  function session() { var s = jget('dw_session', null); if (s && s.until > Date.now()) return s; return null; }
  function log(msg) { var a = jget('dw_log', []); var s = session(); a.push({ t: new Date().toISOString(), u: s ? s.u : '-', m: msg }); ls.s('dw_log', JSON.stringify(a.slice(-200))); }
  var isAdmin = function () { var s = session(); return s && s.role === 'admin'; };

  /* ---------- Yol okuma ve yazma ---------- */
  function get(p) { return p.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, S); }
  function set(p, v) { var a = p.split('.'), k = a.pop(), o = a.reduce(function (x, y) { if (x[y] == null) x[y] = {}; return x[y]; }, S); o[k] = v; }
  function save(msg) {
    var ok = ls.s('dw_state', JSON.stringify(S));
    var e = $('.saved'); if (e) e.textContent = ok ? 'Kaydedildi' : 'Depo dolu';
    if (msg) log(msg);
    clearTimeout(saveT); saveT = setTimeout(function () { var e = $('.saved'); if (e) e.textContent = ''; }, 1800);
  }
  function lenBadge(n, min, max) { return '<span class="len ' + (n === 0 ? 'bad' : n > max ? 'bad' : n < min ? 'warn' : 'ok') + '" data-len>' + n + '/' + max + '</span>'; }
  function F(path, label, o) {
    o = o || {}; var loc = o.loc !== false && o.loc, p = loc ? path + '.' + edLang : path, val = get(p);
    if (val == null) val = '';
    var ph = loc && !val ? R.l(get(path), 'en') : '', c = '', lenv = o.max ? ' data-max="' + o.max + '" data-min="' + (o.min || 0) + '"' : '';
    var attr = ' data-b="' + esc(p) + '"' + lenv + (o.rr ? ' data-rr="1"' : '') + (ph ? ' placeholder="' + esc(ph) + '"' : '');
    if (o.type === 'area') c = '<textarea' + attr + (o.code ? ' class="code"' : '') + (o.rows ? ' rows="' + o.rows + '"' : '') + '>' + esc(val) + '</textarea>';
    else if (o.type === 'select') c = '<select' + attr + '>' + o.opts.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(val) === String(x[0]) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>';
    else c = '<input type="' + (o.type || 'text') + '"' + attr + ' value="' + esc(val) + '">';
    return '<label class="f"><span>' + esc(label) + (loc ? ' <small>' + edLang.toUpperCase() + '</small>' : '') + (o.max ? lenBadge(String(val).length, o.min || 0, o.max) : '') + '</span>' + c + (o.help ? '<small>' + esc(o.help) + '</small>' : '') + '</label>';
  }
  function CK(path, label, rr) { return '<label class="chk2"><input type="checkbox" data-b="' + esc(path) + '" data-bool="1"' + (rr ? ' data-rr="1"' : '') + (get(path) ? ' checked' : '') + '><span>' + esc(label) + '</span></label>'; }
  function B(act, label, o) { o = o || {}; var d = Object.keys(o.data || {}).map(function (k) { return ' data-' + k + '="' + esc(o.data[k]) + '"'; }).join(''); return '<button type="button" class="b ' + (o.cls || '') + '" data-a="' + act + '"' + d + (o.dis ? ' disabled' : '') + (o.aria ? ' aria-label="' + esc(o.aria) + '"' : '') + '>' + esc(label) + '</button>'; }
  var ORNEK = '<span class="ornek">Örnek veri</span>', GERCEK = '<span class="gercek">Gerçek: bu tarayıcı</span>';

  /* ---------- Örnek veri üretici ---------- */
  function rnd(i, m) { var x = Math.sin(i * 12.9898 + m * 78.233) * 43758.5453; return x - Math.floor(x); }
  function series(days, base, m) { var o = []; for (var i = 0; i < days; i++) { var d = new Date(Date.now() - (days - 1 - i) * 864e5), wk = d.getDay() % 6 === 0 ? .62 : 1; o.push({ d: d.toISOString().slice(5, 10), v: Math.round((base + i * base / 160) * wk * (.82 + rnd(i, m) * .36)) }); } return o; }
  function chart(id, sets) {
    var W = 720, H = 240, L = 42, B = 22, T = 10, days = sets[0].data.length, mx = 0;
    sets.forEach(function (s) { s.data.forEach(function (p) { if (p.v > mx) mx = p.v; }); });
    mx = Math.ceil(mx / 40) * 40 || 40;
    var X = function (i) { return L + i * (W - L - 8) / Math.max(1, days - 1); }, Y = function (v) { return T + (H - T - B) * (1 - v / mx); }, g = '';
    for (var j = 0; j <= 4; j++) { var v = mx * j / 4, y = Y(v); g += '<line x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#e4dfd4"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#574f68">' + Math.round(v) + '</text>'; }
    var step = Math.ceil(days / 6); for (var k = 0; k < days; k += step) g += '<text x="' + X(k) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="11" fill="#574f68">' + sets[0].data[k].d + '</text>';
    var lines = sets.map(function (s) { var d = s.data.map(function (p, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' '); var last = s.data[days - 1]; return '<path d="' + d + '" fill="none" stroke="' + s.c + '" stroke-width="2" stroke-linejoin="round"/><circle cx="' + X(days - 1) + '" cy="' + Y(last.v) + '" r="4" fill="' + s.c + '" stroke="#fffefb" stroke-width="2"/>'; }).join('');
    return '<div class="lgd">' + sets.map(function (s) { return '<span><i style="background:' + s.c + '"></i>' + esc(s.n) + '</span>'; }).join('') + '</div><div class="chart" data-chart="' + id + '"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(sets.map(function (s) { return s.n; }).join(', ')) + '"><g font-family="JetBrains Mono,monospace">' + g + '</g>' + lines + '<line class="cross" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" stroke="#1d1430" stroke-dasharray="3 3" visibility="hidden"/></svg><div class="tip" hidden></div></div>';
  }
  function bindCharts(data) {
    $$('[data-chart]').forEach(function (c) {
      var sets = data[c.dataset.chart], svg = $('svg', c), tip = $('.tip', c), cross = $('.cross', c); if (!sets) return;
      var days = sets[0].data.length;
      c.onpointermove = function (e) {
        var r = svg.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 720, i = Math.round((px - 42) / ((720 - 50) / Math.max(1, days - 1))); i = Math.max(0, Math.min(days - 1, i));
        var x = 42 + i * (720 - 50) / Math.max(1, days - 1); cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.setAttribute('visibility', 'visible');
        tip.hidden = false; tip.textContent = sets[0].data[i].d + ' · ' + sets.map(function (s) { return s.n + ': ' + s.data[i].v; }).join(' · ');
        tip.style.left = Math.max(70, Math.min(r.width - 70, (x / 720) * r.width)) + 'px'; tip.style.top = '30px';
      };
      c.onpointerleave = function () { tip.hidden = true; cross.setAttribute('visibility', 'hidden'); };
    });
  }
  function hbar(rows, unit) { var m = Math.max.apply(null, rows.map(function (r) { return r[1]; })); return rows.map(function (r) { return '<div class="hb"><span>' + esc(r[0]) + '</span><i style="width:' + Math.max(2, r[1] / m * 100) + '%"></i><span class="mm">' + r[1] + (unit || '') + '</span></div>'; }).join(''); }
  function evts() { return jget('dw_events', []); }
  function leads() { return S.leads.concat(jget('dw_leads', []).map(function (l) { var o = (S.leadStatus || {})[l.id]; if (o) l.status = o; return l; })); }
  function score(l) {
    var w = S.scoring, s = w[l.type] || 0;
    s += l.team >= 20 ? w.team20 : l.team >= 5 ? w.team5 : 0;
    s += l.quotes >= 200 ? w.quotes200 : l.quotes >= 50 ? w.quotes50 : 0;
    if (l.roi) s += w.roiUsed; if (l.quote) s += w.quoteUsed; if (/^country:/.test(l.src || '')) s += w.targetCountry;
    return Math.min(100, s);
  }
  function temp(s) { return s >= 70 ? ['bad', 'Sıcak'] : s >= 40 ? ['warn', 'Ilık'] : ['draft', 'Soğuk']; }

  /* ---------- Görünümler ---------- */
  var VIEWS = {};
  var NAV = [['Genel', [['overview', 'Genel bakış'], ['funnel', 'İndirme hunisi'], ['leads', 'Talepler']]], ['İçerik', [['content', 'Sayfa içerikleri'], ['reviews', 'Yorumlar'], ['blog', 'Blog'], ['faq', 'SSS'], ['media', 'Görseller'], ['links', 'Bağlantılar']]], ['Görünürlük', [['seo', 'SEO'], ['geo', 'GEO ve llms.txt'], ['langs', 'Diller'], ['tech', 'Teknik SEO']]], ['Sistem', [['users', 'Kullanıcılar ve güvenlik'], ['settings', 'Yedek ve ayarlar']]]];
  var TITLE = {}; NAV.forEach(function (g) { g[1].forEach(function (x) { TITLE[x[0]] = x[1]; }); });
  var EDITOR_OK = { reviews: 1, overview: 1, funnel: 1, leads: 1, content: 1, blog: 1, faq: 1, media: 1, links: 0 };

  VIEWS.overview = function () {
    var d = ui.range, vis = series(d, 180, 1), org = series(d, 96, 2), sum = function (a) { return a.reduce(function (x, y) { return x + y.v; }, 0); }, tv = sum(vis), to = sum(org);
    var sc = Math.round(tv * .048), real = evts(), rv = real.filter(function (e) { return e.type === 'view'; }).length, rs = real.filter(function (e) { return e.type === 'store_click'; }).length, rq = real.filter(function (e) { return e.type === 'quote_use'; }).length, rl = jget('dw_leads', []).length;
    ui._charts = { traffic: [{ n: 'Ziyaretçi', c: '#7443b8', data: vis }, { n: 'Organik', c: '#c26a00', data: org }] };
    var byPage = {}; real.filter(function (e) { return e.type === 'view'; }).forEach(function (e) { byPage[e.page] = (byPage[e.page] || 0) + 1; });
    var pages = [['/tr/', 1], ['/tr/hizli-teklif/', .52], ['/en/', .46], ['/tr/blog/pvc-pencere-fiyati-nasil-hesaplanir/', .38], ['/en/quick-quote/', .24], ['/tr/lite-pro-karsilastirma/', .21], ['/de/', .12], ['/tr/kayip-hesaplayici/', .11], ['/de/land/deutschland/', .08], ['/en/country/united-kingdom/', .07]];
    var kw = [['pvc pencere hesaplama', 8.4, 412, 38], ['pencere çizim programı', 11.2, 288, 21], ['window price calculator', 14.7, 240, 16], ['pvc pencere fiyatı nasıl hesaplanır', 6.1, 198, 29], ['aluminium window software', 18.3, 151, 8], ['doğrama teklif programı', 9.5, 126, 14], ['fenster kalkulation app', 16.2, 118, 7], ['upvc window quotation app', 12.4, 104, 9], ['alüminyum doğrama hesaplama', 10.1, 96, 11], ['kâr marjı nasıl hesaplanır', 7.3, 88, 12]];
    var blogT = R.livePosts(S, 'tr').slice(0, 6).map(function (p, i) { var v = Math.round(420 - i * 54 + rnd(i, 4) * 40); return [p.i18n.tr.title, v, Math.round(v * (.05 + rnd(i, 5) * .06))]; });
    return '<div class="row">' + [7, 30, 90].map(function (n) { return B('range', 'Son ' + n + ' gün', { data: { n: n }, cls: d === n ? 'pri' : '' }); }).join('') + ORNEK + '<small>Google Analytics ve Search Console bağlanınca bu alanlar gerçek veriyle dolar.</small></div>' +
      '<div class="kpis">' + [['Bugün', vis[vis.length - 1].v.toLocaleString('tr-TR')], ['Son 7 gün', sum(series(30, 180, 1).slice(-7)).toLocaleString('tr-TR')], ['Son 30 gün', sum(series(30, 180, 1)).toLocaleString('tr-TR')]].map(function (k) { return '<div class="kpi"><span>Ziyaretçi · ' + k[0] + '</span><b>' + k[1] + '</b><small>Örnek veri</small></div>'; }).join('') + '</div><div class="kpis">' + [['Ziyaretçi', tv.toLocaleString('tr-TR')], ['Organik trafik', to.toLocaleString('tr-TR')], ['Mağaza düğmesi tıklaması', sc.toLocaleString('tr-TR')], ['Ortalama sıra', '9,8'], ['Yayındaki yazı', R.livePosts(S, 'tr').length, 1], ['Bayi talebi', leads().length, 1]].map(function (k) { return '<div class="kpi"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + (k[2] ? 'Panel verisi' : 'Örnek veri') + '</small></div>'; }).join('') + '</div>' +
      '<div class="box"><div class="box-h"><h2>Ziyaretçi ve organik trafik</h2>' + ORNEK + B('tbl', ui.table ? 'Grafiği göster' : 'Tablo görünümü', { cls: 's' }) + '</div>' + (ui.table ? '<div class="t-w" style="max-height:320px;overflow:auto"><table class="t"><thead><tr><th>Tarih</th><th class="r">Ziyaretçi</th><th class="r">Organik</th></tr></thead><tbody>' + vis.map(function (x, i) { return '<tr><td class="mm">' + x.d + '</td><td class="r mm">' + x.v + '</td><td class="r mm">' + org[i].v + '</td></tr>'; }).join('') + '</tbody></table></div>' : chart('traffic', ui._charts.traffic)) + '</div>' +
      '<div class="box"><div class="box-h"><h2>Bu prototipte gerçekleşen hareket</h2>' + GERCEK + '</div><div class="kpis">' + [['Sayfa görüntüleme', rv], ['Mağaza tıklaması', rs], ['Teklif aracı kullanımı', rq], ['Gönderilen talep', rl]].map(function (k) { return '<div class="kpi"><span>' + k[0] + '</span><b>' + k[1] + '</b></div>'; }).join('') + '</div>' + (Object.keys(byPage).length ? '<h3 style="margin-top:12px">En çok görüntülenen</h3>' + hbar(Object.keys(byPage).sort(function (a, b) { return byPage[b] - byPage[a]; }).slice(0, 6).map(function (k) { return [k, byPage[k]]; })) : '<p class="empty">Siteyi gezdikçe burası gerçek olaylarla dolar.</p>') + '</div>' +
      '<div class="g2"><div class="box"><div class="box-h"><h2>Sayfalar</h2>' + ORNEK + '</div><div class="t-w"><table class="t"><thead><tr><th>Sayfa</th><th class="r">Görüntüleme</th><th class="r">Mağazaya giden</th></tr></thead><tbody>' + pages.map(function (p, i) { var v = Math.round(tv * .42 * p[1]); return '<tr><td class="mm">' + p[0] + '</td><td class="r mm">' + v + '</td><td class="r mm">' + Math.round(v * (.03 + rnd(i, 6) * .07)) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><div class="box-h"><h2>Ülkeler</h2>' + ORNEK + '</div>' + hbar([['Türkiye', Math.round(tv * .46)], ['Almanya', Math.round(tv * .13)], ['Birleşik Krallık', Math.round(tv * .1)], ['BAE', Math.round(tv * .08)], ['Suudi Arabistan', Math.round(tv * .07)], ['Diğer', Math.round(tv * .16)]]) + '</div>' +
      '<div class="box"><div class="box-h"><h2>Anahtar kelimeler</h2>' + ORNEK + '</div><div class="t-w"><table class="t"><thead><tr><th>Kelime</th><th class="r">Sıra</th><th class="r">Gösterim</th><th class="r">Tıklama</th></tr></thead><tbody>' + kw.map(function (k) { return '<tr><td>' + k[0] + '</td><td class="r mm">' + k[1] + '</td><td class="r mm">' + k[2] + '</td><td class="r mm">' + k[3] + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><div class="box-h"><h2>Blog performansı</h2>' + ORNEK + '</div><div class="t-w"><table class="t"><thead><tr><th>Yazı</th><th class="r">Okuma</th><th class="r">Mağaza</th></tr></thead><tbody>' + blogT.map(function (b) { return '<tr><td>' + esc(b[0]) + '</td><td class="r mm">' + b[1] + '</td><td class="r mm">' + b[2] + '</td></tr>'; }).join('') + '</tbody></table></div></div></div>';
  };

  VIEWS.funnel = function () {
    var ev = evts(), cnt = function (t) { return ev.filter(function (e) { return e.type === t; }).length; };
    var rs = [['Sayfa görüntüleme', cnt('view')], ['Teklif veya kayıp aracı', cnt('quote_use') + cnt('roi_use') + cnt('wizard_use')], ['Mağaza düğmesi', cnt('store_click')], ['Talep formu', cnt('lead')]];
    var sm = [['Ziyaret', 5400], ['Araç kullanımı', 1240], ['Mağaza düğmesi', 410], ['Mağaza sayfası görüntüleme', 340], ['İndirme', 96]];
    var funnel = function (r) { var m = Math.max(1, r[0][1]); return '<div class="fn">' + r.map(function (x, i) { var prev = i ? r[i - 1][1] : 0; return '<div class="fn-r"><span>' + x[0] + '</span><i style="width:' + Math.max(1, x[1] / m * 100) + '%"></i><b>' + x[1] + (prev ? ' <small style="font-weight:400">%' + Math.round(x[1] / prev * 100) + '</small>' : '') + '</b></div>'; }).join('') + '</div>'; };
    var src = {}; ev.filter(function (e) { return e.type === 'store_click'; }).forEach(function (e) { var k = e.src || e.page; src[k] = src[k] || { n: 0, ios: 0, play: 0 }; src[k].n++; src[k][e.kind] = (src[k][e.kind] || 0) + 1; });
    var blogRows = Object.keys(src).filter(function (k) { return /^blog:/.test(k); }), other = Object.keys(src).filter(function (k) { return !/^blog:/.test(k); });
    var name = function (k) { if (/^blog:/.test(k)) { var p = S.posts.filter(function (x) { return x.id === k.slice(5); })[0]; return p ? (p.i18n.tr || p.i18n.en).title : k; } return k; };
    var tbl = function (ks) { return ks.length ? '<div class="t-w"><table class="t"><thead><tr><th>Kaynak</th><th class="r">Toplam</th><th class="r">App Store</th><th class="r">Google Play</th></tr></thead><tbody>' + ks.sort(function (a, b) { return src[b].n - src[a].n; }).map(function (k) { return '<tr><td>' + esc(name(k)) + '</td><td class="r mm">' + src[k].n + '</td><td class="r mm">' + (src[k].ios || 0) + '</td><td class="r mm">' + (src[k].play || 0) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="empty">Henüz tıklama yok. Sitedeki bir mağaza düğmesine basın, burada görünür.</p>'; };
    var post = R.livePosts(S, 'tr')[0];
    return '<div class="g2"><div class="box"><div class="box-h"><h2>Örnek huni</h2>' + ORNEK + '</div>' + funnel(sm) + '<p class="tiny">İndirme adedi siteden ölçülemez. Canlıda App Store Connect ve Google Play Console verisiyle birleştirilir.</p></div><div class="box"><div class="box-h"><h2>Bu tarayıcıdaki huni</h2>' + GERCEK + '</div>' + funnel(rs) + '</div></div>' +
      '<div class="box"><div class="box-h"><h2>Blogdan mağazaya yönlendirme</h2>' + GERCEK + '</div>' + tbl(blogRows) + '</div><div class="box"><div class="box-h"><h2>İndirmeye yönlendiren diğer sayfalar</h2>' + GERCEK + '</div>' + tbl(other) + '</div>' +
      '<div class="box"><h2>Kampanya etiketi</h2>' + CK('links.campaign', 'Mağaza bağlantılarına kaynak etiketi ekle') + (post ? '<p class="tiny">Örnek: bir blog yazısından çıkan App Store bağlantısı</p><pre class="code">' + esc(R.storeUrl(S, S.links.proIos, 'blog:' + post.id)) + '\n' + esc(R.storeUrl(S, S.links.litePlay, 'blog:' + post.id)) + '</pre><p class="tiny">Etiket, mağaza panellerinde hangi sayfanın indirme getirdiğini görmek içindir.</p>' : '') + '</div>';
  };

  VIEWS.leads = function () {
    var all = leads().map(function (l) { l._s = score(l); return l; }).sort(function (a, b) { return b._s - a._s; }), w = S.scoring, spam = evts().filter(function (e) { return e.type === 'spam_block'; }).length;
    var topicL = { general: 'Genel soru', quote: 'Toplu teklif', dealer: 'Bayilik' }, lab = { dealer: 'Bayi', manufacturer: 'Üretici', installer: 'Montaj', other: 'Diğer' };
    return '<div class="box"><div class="box-h"><h2>Form talepleri (' + all.length + ')</h2><div class="row">' + B('csv', 'CSV indir') + '<span class="tiny">Engellenen spam: <b>' + spam + '</b></span></div></div><div class="t-w"><table class="t" id="lead-table"><thead><tr><th>Puan</th><th>Firma</th><th>Tür</th><th>Ülke</th><th class="r">Kişi</th><th class="r">Teklif/ay</th><th>Kaynak</th><th>Araçlar</th><th>Durum</th></tr></thead><tbody>' + all.map(function (l) { var t = temp(l._s); return '<tr><td class="mm"><span class="st ' + t[0] + '">' + t[1] + '</span> ' + l._s + '<span class="scorebar"><i style="width:' + l._s + '%"></i></span></td><td><b>' + esc(l.company) + '</b>' + (l.sample ? ' <span class="ornek">Örnek</span>' : '') + '<br><small>' + esc(l.msg || '') + (l.roiResult ? ' · Kayıp hesabı: ' + esc(l.roiResult) : '') + '</small></td><td>' + ((topicL[l.topic] ? topicL[l.topic] + ' · ' : '') + lab[l.type] || l.type) + '</td><td>' + esc(l.country) + '</td><td class="r mm">' + l.team + '</td><td class="r mm">' + l.quotes + '</td><td class="mm">' + esc(l.src || '') + '</td><td class="mm">' + (l.roi ? 'Kayıp ' : '') + (l.quote ? 'Teklif' : '') + '</td><td><select data-lead="' + l.id + '" aria-label="Durum">' + ['yeni', 'görüşülüyor', 'kazanıldı', 'kaybedildi'].map(function (s) { return '<option' + (l.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><h2>Müşteri adayı puanlama kuralları</h2><p class="tiny">Puan değiştirince tablo yeniden sıralanır. 70 ve üzeri sıcak, 40 ve üzeri ılık.</p><div class="grid3">' + [['dealer', 'Bayi'], ['manufacturer', 'Üretici'], ['installer', 'Montaj'], ['other', 'Diğer'], ['team5', '5+ kullanıcı'], ['team20', '20+ kullanıcı'], ['quotes50', '50+ teklif/ay'], ['quotes200', '200+ teklif/ay'], ['roiUsed', 'Kayıp hesabını kullandı'], ['quoteUsed', 'Teklif aracını kullandı'], ['targetCountry', 'Ülke sayfasından geldi']].map(function (x) { return F('scoring.' + x[0], x[1], { type: 'number', rr: 1 }); }).join('') + '</div></div>';
  };

  VIEWS.content = function () {
    var active = +ls.g('dw_layout') || 1, h = 'home', hb = active === 1 ? 'home' : 'home.v' + active, order = S.layouts[active], names = { hero: 'Giriş', features: 'Özellikler', adv: 'Avantajlar', tools: 'Deneme araçları', uses: 'Kullanım alanları', shots: 'Ekran görüntüleri', video: 'Video', compare: 'Lite ve Pro', roi: 'Kayıp hesabı', reviews: 'Yorumlar', faq: 'SSS', blog: 'Blog', cta: 'Son çağrı' };
    var listEdit = function (key, title, fields, addLabel) {
      return '<div class="box"><div class="box-h"><h2>' + title + '</h2>' + B('addItem', addLabel, { data: { k: key }, cls: 's' }) + '</div>' + S.home[key].map(function (it, i) { return '<div class="item"><div class="item-h"><b class="mm">#' + (i + 1) + '</b><span class="row">' + B('mvItem', 'Yukarı', { data: { k: key, i: i, d: -1 }, cls: 's', dis: i === 0 }) + B('mvItem', 'Aşağı', { data: { k: key, i: i, d: 1 }, cls: 's', dis: i === S.home[key].length - 1 }) + B('delItem', 'Sil', { data: { k: key, i: i }, cls: 's dng' }) + '</span></div>' + fields.map(function (f) { return F('home.' + key + '.' + i + '.' + f[0], f[1], f[2]); }).join('') + '</div>'; }).join('') + '</div>';
    };
    return '<div class="box"><div class="box-h"><h2>Ana sayfa bölümleri</h2><div class="row"><label class="row"><span class="tiny">Tasarım</span><select data-layout-sel aria-label="Tasarım">' + [[1, '1 Çizim ekranı'], [2, '2 Antrasit'], [3, '3 Teklif dosyası']].map(function (x) { return '<option value="' + x[0] + '"' + (active === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>' + B('preview', 'Önizle', { data: { url: 'home' }, cls: 'pri' }) + '</div></div><p class="tiny">Sırayı değiştirin veya bölümü gizleyin. Değişiklik siteye anında yansır.</p>' + order.map(function (k, i) { return '<div class="sv" style="align-items:center"><span class="mm" style="width:26px">' + (i + 1) + '</span><div style="flex:1"><b>' + names[k] + '</b></div>' + (k === 'hero' ? '' : CK('hidden.' + k, 'Gizle', 1)) + B('mvSec', 'Yukarı', { data: { i: i, d: -1 }, cls: 's', dis: i < 2 }) + B('mvSec', 'Aşağı', { data: { i: i, d: 1 }, cls: 's', dis: i === 0 || i === order.length - 1 }) + '</div>'; }).join('') + '</div>' +
      '<div class="box"><h2>Giriş bölümü</h2>' + F(hb + '.eyebrow', 'Üst etiket (seçili tasarım)', { loc: 1 }) + F(hb + '.h1', 'Ana başlık H1 (seçili tasarım)', { loc: 1, max: 70, min: 20 }) + F(hb + '.lead', 'Açıklama (seçili tasarım)', { loc: 1, type: 'area' }) + F('home.cta2', 'İkinci çağrı', { loc: 1 }) + F('home.note', 'Dipnot', { loc: 1 }) + '</div>' +
      listEdit('features', 'Özellikler ve avantajlar', [['t', 'Başlık', { loc: 1 }], ['d', 'Metin', { loc: 1, type: 'area', rows: 2 }], ['img', 'Görsel', { type: 'select', opts: S.media.map(function (m) { return [m.id, R.l(m.cap, 'tr')]; }) }]], 'Özellik ekle') +
      listEdit('adv', 'Avantajlar', [['t', 'Başlık', { loc: 1 }], ['d', 'Metin', { loc: 1, type: 'area', rows: 2 }]], 'Avantaj ekle') + listEdit('uses', 'Kullanım alanları', [['t', 'Başlık', { loc: 1 }], ['d', 'Metin', { loc: 1, type: 'area', rows: 2 }], ['draw.type', 'Çizim', { type: 'select', opts: [['tek', 'Tek açılır'], ['cift', 'Çift açılır'], ['surme', 'Sürme'], ['kapi', 'Kapı'], ['sabit', 'Sabit'], ['kemer', 'Kemerli']] }]], 'Alan ekle') +
      listEdit('reviews', 'Yorum ve referans alanı', [['n', 'Ad', { loc: 1 }], ['r', 'Firma', { loc: 1 }], ['q', 'Yorum', { loc: 1, type: 'area', rows: 2 }]], 'Kart ekle') +
      '<div class="box"><h2>Diğer başlıklar</h2>' + [['featuresTitle', 'Özellik başlığı'], ['featuresSub', 'Özellik alt metni'], ['advTitle', 'Avantaj başlığı'], ['toolsTitle', 'Araç başlığı'], ['usesTitle', 'Kullanım başlığı'], ['shotsTitle', 'Ekran başlığı'], ['videoTitle', 'Video başlığı'], ['videoText', 'Video metni'], ['compareTitle', 'Karşılaştırma başlığı'], ['compareText', 'Karşılaştırma metni'], ['reviewsTitle', 'Yorum başlığı'], ['reviewsNote', 'Yorum notu'], ['storeRating', 'Mağaza puanı notu'], ['ctaTitle', 'Son çağrı başlığı'], ['ctaText', 'Son çağrı metni']].map(function (x) { return F('home.' + x[0], x[1], { loc: 1 }); }).join('') + '</div>' +
      '<div class="box"><h2>Fiyat ve karşılaştırma</h2>' + F('pricing.proFree', 'Pro ödeme modeli', { loc: 1 }) + '<div class="grid3">' + F('pricing.proMonthly', 'Pro aylık') + F('pricing.proAnnual', 'Pro yıllık') + '</div>' + F('pricing.liteModel', 'Lite ödeme modeli', { loc: 1 }) + F('compare.nameLite', 'Lite adı', { loc: 1 }) + F('compare.namePro', 'Pro adı', { loc: 1 }) + F('compare.assumption', 'Prototip notu', { loc: 1, type: 'area', rows: 2 }) + '<h3>Satırlar</h3>' + S.compare.rows.map(function (r, i) { return F('compare.rows.' + i + '.k', 'Satır ' + (i + 1), { loc: 1 }); }).join('') + '</div>' +
      '<div class="box"><h2>İç sayfa başlıkları</h2>' + ['compare', 'quote', 'roi', 'dealer', 'faq', 'blog', 'country'].map(function (k) { return '<h3>' + k + '</h3>' + F('pages.' + k + '.h1', 'H1', { loc: 1 }) + F('pages.' + k + '.lead', 'Açıklama', { loc: 1, type: 'area', rows: 2 }); }).join('') + '</div>' +
      '<div class="box"><div class="box-h"><h2>Ülke açılış sayfaları</h2>' + B('addCountry', 'Ülke ekle', { cls: 's' }) + '</div>' + S.countries.map(function (c, i) { return '<div class="item">' + '<div class="grid3">' + F('countries.' + i + '.n', 'Ülke', { loc: 1 }) + F('countries.' + i + '.slug', 'Adres', { loc: 1, help: 'Yalnız küçük harf ve tire' }) + F('countries.' + i + '.cur', 'Para birimi') + F('countries.' + i + '.vat', 'Vergi %', { type: 'number' }) + F('countries.' + i + '.loc', 'Başlıktaki konum', { loc: 1 }) + F('countries.' + i + '.lang', 'Dil adı', { loc: 1 }) + '</div></div>'; }).join('') + '</div>';
  };

  VIEWS.reviews = function () {
    var pend = jget('dw_reviews', []), live = S.home.reviews || [];
    return '<div class="box"><div class="box-h"><h2>Onay bekleyen yorumlar (' + pend.length + ')</h2>' + GERCEK + '</div>' + (pend.length ? '<div class="t-w"><table class="t"><thead><tr><th>Tarih</th><th>Ad</th><th>Firma</th><th>Yorum</th><th>Dil</th><th></th></tr></thead><tbody>' + pend.map(function (r, i) { return '<tr><td class="mm">' + esc(r.t.slice(0, 10)) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.company) + '</td><td>' + esc(r.text) + '</td><td class="mm">' + esc(r.lang) + '</td><td><div class="row">' + B('revOk', 'Onayla', { data: { i: i }, cls: 's pri' }) + B('revNo', 'Reddet', { data: { i: i }, cls: 's dng' }) + '</div></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="empty">Bekleyen yorum yok. Ana sayfadaki formdan gönderilen yorum buraya düşer.</p>') + '</div>' +
      '<div class="box"><div class="box-h"><h2>Yayındaki yorumlar (' + live.length + ')</h2></div>' + (live.length ? live.map(function (r, i) { return '<div class="sv"><div style="flex:1"><b>' + esc(R.l(r.n, 'tr')) + '</b> <small>' + esc(R.l(r.r, 'tr')) + '</small><small>' + esc(R.l(r.q, 'tr')) + '</small></div>' + B('revDel', 'Yayından kaldır', { data: { i: i }, cls: 's dng' }) + '</div>'; }).join('') : '<p class="empty">Henüz yok. Yorum uydurulmaz; gerçek yorum onaylanınca sitede görünür.</p>') + '</div>';
  };
  VIEWS.links = function () {
    var chk = function (k, l, req) { var v = S.links[k]; var ok = /^https:\/\/(apps\.apple\.com|play\.google\.com)\//.test(v || ''); return '<div class="sv"><span class="st ' + (ok ? 'ok' : (req ? 'bad' : 'warn')) + '">' + (ok ? 'Geçerli' : 'Eksik') + '</span><div style="flex:1">' + F('links.' + k, l, { rr: 1 }) + '</div></div>'; };
    return '<div class="box"><h2>Mağaza bağlantıları</h2>' + chk('proIos', 'DoorWin Pro App Store', 1) + chk('proPlay', 'DoorWin Pro Google Play') + chk('liteIos', 'DoorWin (Lite) App Store', 1) + chk('litePlay', 'DoorWin (Lite) Google Play', 1) + '<p class="note">Pro için Google Play bağlantısı doğrulanamadı. Alan boşken sitede Google Play düğmesi tek seferlik DoorWin uygulamasına gider. Bağlantıyı girince düğme kendiliğinden Pro’ya döner.</p></div><div class="box"><h2>Video</h2>' + F('links.video', 'Video adresi', { help: 'Dosya (.mp4, .webm) veya gömme bağlantısı. Gömme bağlantısı yalnız tıklanınca yüklenir, açılış hızını bozmaz.' }) + '</div>';
  };

  VIEWS.media = function () {
    return '<div class="box"><div class="box-h"><h2>Görsel kitaplığı</h2><label class="b pri" style="cursor:pointer">Görsel yükle<input type="file" accept="image/*" data-upload hidden></label></div><p class="tiny">Yüklenen görsel en çok 900 piksele küçültülüp WebP olarak saklanır. Her dil için ayrı ALT metni yazılır.</p><div class="med">' + S.media.map(function (m, i) { var src = m.data || ('../assets/img/' + m.base + '-420.webp'); return '<div class="med-c"><img src="' + src + '" alt="' + esc(R.l(m.alt, edLang)) + '" loading="lazy" width="210" height="170">' + F('media.' + i + '.alt', 'ALT', { loc: 1, type: 'area', rows: 2, max: 125, min: 10 }) + F('media.' + i + '.cap', 'Alt yazı', { loc: 1 }) + '<div class="row">' + CK2(m.id) + (m.data ? B('delMedia', 'Sil', { data: { i: i }, cls: 's dng' }) : '') + '</div></div>'; }).join('') + '</div></div>' +
      '<div class="g2"><div class="box"><h2>Ekran görüntüsü sırası</h2>' + S.screens.map(function (id, i) { var m = S.media.filter(function (x) { return x.id === id; })[0]; return '<div class="sv" style="align-items:center"><span class="mm">' + (i + 1) + '</span><div style="flex:1">' + esc(m ? R.l(m.cap, 'tr') : id) + '</div>' + B('mvScreen', 'Yukarı', { data: { i: i, d: -1 }, cls: 's', dis: !i }) + B('mvScreen', 'Aşağı', { data: { i: i, d: 1 }, cls: 's', dis: i === S.screens.length - 1 }) + '</div>'; }).join('') + '</div><div class="box"><h2>Giriş görseli</h2>' + F('heroImage', 'Afiş düzeninde ortadaki ekran', { type: 'select', opts: S.media.map(function (m) { return [m.id, R.l(m.cap, 'tr')]; }) }) + '</div></div>';
  };
  function CK2(id) { var on = S.screens.indexOf(id) > -1; return '<label class="chk2"><input type="checkbox" data-screen="' + esc(id) + '"' + (on ? ' checked' : '') + '><span>Ekranlar bölümünde</span></label>'; }

  function pageOptions() {
    var o = [['home', 'Ana sayfa'], ['compare', 'Lite ve Pro'], ['quote', 'Hızlı teklif'], ['roi', 'Kayıp hesabı'], ['dealer', 'Bayi'], ['faq', 'SSS'], ['blog', 'Blog']];
    return o;
  }
  function ctxFromKey(k) { var a = k.split(':'); return { page: a[0], id: a[1], lang: edLang, depth: 1 }; }
  function outline(ctx) {
    var d = document.createElement('div'); d.innerHTML = R.body(S, ctx, 1); R.setLang(edLang);
    var main = d.querySelector('main'), hs = $$('h1,h2,h3', main), n1 = hs.filter(function (h) { return h.tagName === 'H1'; }).length;
    return { n1: n1, html: '<ul class="outline">' + hs.slice(0, 40).map(function (h) { return '<li class="' + h.tagName.toLowerCase() + '"><b>' + h.tagName + '</b>' + esc(h.textContent.trim()) + '</li>'; }).join('') + '</ul>' };
  }
  VIEWS.seo = function () {
    var k = ui.seoPage, ctx = ctxFromKey(k), s = S.seo[k], h, o;
    var allKeys = pageOptions().concat(S.countries.map(function (c) { return ['country:' + c.id, 'Ülke: ' + R.l(c.n, 'tr')]; })).concat(S.blogCats.map(function (c) { return ['blogcat:' + c.id, 'Kategori: ' + R.l(c.n, 'tr')]; }));
    h = R.head(S, ctx); o = outline(ctx); R.setLang(edLang);
    var editor = s ? F('seo.' + k + '.title', 'Başlık (title)', { loc: 1, max: 60, min: 25, rr: 0 }) + F('seo.' + k + '.desc', 'Açıklama (description)', { loc: 1, type: 'area', rows: 3, max: 160, min: 80 }) + F('seo.' + k + '.kw', 'Anahtar kelime', { loc: 1 }) : '<p class="note">Bu sayfanın başlığı ve açıklaması içerikten üretilir; içerik sekmesinden değişir.</p>' + (ctx.page === 'blogcat' ? F('blogCats.' + S.blogCats.map(function (c) { return c.id; }).indexOf(ctx.id) + '.seoDesc', 'Kategori açıklaması', { loc: 1, type: 'area', rows: 3, max: 160, min: 80 }) : '');
    return '<div class="box"><div class="box-h"><h2>Sayfa bazlı SEO</h2><label class="row"><span class="tiny">Sayfa</span><select data-seo-page aria-label="Sayfa">' + allKeys.map(function (x) { return '<option value="' + x[0] + '"' + (k === x[0] ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select></label></div><div class="g2"><div>' + editor + CK('seoGlobal.noindex.' + k, 'Bu sayfayı arama motorlarından gizle (noindex)', 1) + '<h3 style="margin-top:12px">Temiz adres</h3><pre class="code">' + esc(h.canonical) + '</pre></div><div><h3>Google önizlemesi</h3><div class="serp" data-serp><cite>' + esc(h.canonical) + '</cite><b data-serp-t>' + esc(h.title) + '</b><p data-serp-d>' + esc(h.desc) + '</p></div><h3>Başlık yapısı <span class="st ' + (o.n1 === 1 ? 'ok' : 'bad') + '">H1: ' + o.n1 + '</span></h3><div style="max-height:220px;overflow:auto">' + o.html + '</div></div></div></div>' +
      '<div class="g2"><div class="box"><h2>hreflang ve canonical</h2><div class="t-w"><table class="t"><tbody><tr><th>canonical</th><td class="mm">' + esc(h.canonical) + '</td></tr>' + h.alternates.map(function (a) { return '<tr><th>' + a.hreflang + '</th><td class="mm">' + esc(a.abs) + '</td></tr>'; }).join('') + (h.xdefault ? '<tr><th>x-default</th><td class="mm">' + esc(h.xdefault) + '</td></tr>' : '') + '<tr><th>robots</th><td class="mm">' + h.robots + '</td></tr></tbody></table></div></div>' +
      '<div class="box"><h2>Schema.org</h2><div class="chks">' + ['SoftwareApplication', 'Organization', 'Article', 'BreadcrumbList', 'FAQPage'].map(function (t) { return CK('seoGlobal.schema.' + t, t, 1); }).join('') + '</div><p class="tiny">Puan bilgisi (AggregateRating) bilinçli olarak yok; mağazada gerçek değer oluşunca eklenir.</p><h3>Bu sayfanın JSON-LD çıktısı (' + h.jsonld.length + ')</h3><pre class="code" data-jsonld>' + esc(JSON.stringify(h.jsonld, null, 1)) + '</pre></div></div>' +
      '<div class="g2"><div class="box"><h2>Google hesapları</h2>' + F('seoGlobal.ga4', 'GA4 ölçüm kimliği', { help: 'G- ile başlar. Canlıda çerez onayı sonrası yüklenir; prototip hiçbir yere veri göndermez.' }) + F('seoGlobal.gsc', 'Search Console doğrulama kodu', { rr: 0, help: 'Sitenin head bölümüne doğrulama etiketi olarak eklenir.' }) + '<h3>GA4 olay eşlemesi</h3><div class="t-w"><table class="t"><tbody>' + [['store_click', 'Mağaza düğmesi (uygulama, mağaza, kaynak)'], ['quote_use', 'Teklif aracı ilk kullanım'], ['quote_pdf', 'PDF kaydetme'], ['roi_use', 'Kayıp hesabı'], ['lead', 'Talep formu'], ['video_play', 'Video oynatma']].map(function (x) { return '<tr><td class="mm">' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><h2>robots.txt</h2>' + F('seoGlobal.robotsExtra', 'Ek kurallar', { type: 'area', rows: 3 }) + '<pre class="code" data-robots>' + esc(R.robots(S)) + '</pre><div class="row" style="margin-top:8px">' + B('dl', 'robots.txt indir', { data: { f: 'robots' }, cls: 's' }) + '</div><h3 style="margin-top:12px">301 yönlendirmeler</h3>' + (S.redirects.length ? '<div class="t-w"><table class="t"><tbody>' + S.redirects.map(function (r, i) { return '<tr><td class="mm">' + esc(r.from) + '</td><td class="mm">' + esc(r.to) + '</td><td>' + B('delRedir', 'Sil', { data: { i: i }, cls: 's dng' }) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="empty">Blog adresi değişince otomatik eklenir.</p>') + '</div></div>' +
      '<div class="box"><div class="box-h"><h2>Dil bazlı site haritası</h2><div class="tabs" style="margin:0;border:0">' + ['index'].concat(R.enabled(S).map(function (l) { return l.code; })).map(function (c) { return '<button type="button" data-a="smLang" data-c="' + c + '" class="' + (ui.smLang === c ? 'on' : '') + '">' + (c === 'index' ? 'İndeks' : c.toUpperCase()) + '</button>'; }).join('') + '</div></div><pre class="code">' + esc(ui.smLang === 'index' ? R.sitemapIndex(S) : R.sitemap(S, ui.smLang)) + '</pre><div class="row" style="margin-top:8px">' + B('dl', 'Bu haritayı indir', { data: { f: 'sitemap' }, cls: 's' }) + '</div></div>';
  };

  VIEWS.geo = function () {
    var ps = S.posts.filter(function (p) { return R.isLive(p, edLang); });
    var rows = ps.map(function (p) { var i = p.i18n[edLang], first = /<p><strong>[^<]+:<\/strong>/.test(i.html), qa = (i.qa || []).length, h2 = (i.html.match(/<h2/g) || []).length, ok = first && qa >= 2 && h2 >= 1; return '<tr><td>' + esc(i.title) + '</td><td><span class="st ' + (first ? 'ok' : 'bad') + '">' + (first ? 'Var' : 'Yok') + '</span></td><td class="r mm">' + qa + '</td><td class="r mm">' + h2 + '</td><td><span class="st ' + (ok ? 'ok' : 'warn') + '">' + (ok ? 'Hazır' : 'Eksik') + '</span></td></tr>'; }).join('');
    return '<div class="box"><div class="box-h"><h2>llms.txt</h2>' + B('dl', 'llms.txt indir', { data: { f: 'llms' }, cls: 's' }) + '</div>' + F('llmsIntro', 'Ürün tanımı', { loc: 1, type: 'area', rows: 2 }) + '<pre class="code" data-llms>' + esc(R.llms(S)) + '</pre></div>' +
      '<div class="box"><h2>Soru ve cevap yapısı (' + edLang.toUpperCase() + ')</h2><p class="tiny">Yapay zekâ yanıtları, ilk paragrafta kısa cevap veren ve soruları açıkça işaretlenmiş içerikten daha kolay alıntı yapar. Tablo gerçek içeriğinizi tarar.</p><div class="t-w"><table class="t"><thead><tr><th>Yazı</th><th>Kısa cevap</th><th class="r">Soru</th><th class="r">H2</th><th>Durum</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<div class="box"><div class="box-h"><h2>Konu kümeleri</h2>' + B('addCluster', 'Küme ekle', { cls: 's' }) + '</div>' + S.clusters.map(function (c, i) { return '<div class="item"><div class="item-h"><b>Küme ' + (i + 1) + '</b>' + B('delCluster', 'Sil', { data: { i: i }, cls: 's dng' }) + '</div>' + F('clusters.' + i + '.pillar', 'Ana konu', { loc: 1 }) + F('clusters.' + i + '.page', 'Ana sayfa', { type: 'select', opts: pageOptions() }) + '<div class="chks">' + S.posts.filter(function (p) { return p.i18n.tr || p.i18n.en; }).map(function (p) { return '<label class="chk2"><input type="checkbox" data-cluster="' + i + '" data-pid="' + p.id + '"' + (c.posts.indexOf(p.id) > -1 ? ' checked' : '') + '><span>' + esc((p.i18n[edLang] || p.i18n.tr || p.i18n.en).title) + '</span></label>'; }).join('') + '</div></div>'; }).join('') + '</div>';
  };

  function missing(code) {
    var tot = 0, miss = 0, walk = function (o) { if (!o || typeof o !== 'object') return; if (typeof o.en === 'string' && typeof o.tr === 'string') { tot++; if (!o[code]) miss++; return; } Object.keys(o).forEach(function (k) { if (k !== 'i18n') walk(o[k]); }); };
    walk({ ui: S.ui, home: S.home, pages: S.pages, seo: S.seo, faq: S.faq, compare: S.compare, cats: S.blogCats, c: S.countries, m: S.media, p: S.pricing });
    return { tot: tot, miss: miss };
  }
  VIEWS.langs = function () {
    var uk = Object.keys(S.ui), mine = S.langs.filter(function (l) { return !window.DW_SEED.langs.some(function (s) { return s.code === l.code; }); });
    return '<div class="box"><h2>Diller</h2><div class="t-w"><table class="t"><thead><tr><th>Kod</th><th>Ad</th><th>hreflang</th><th>Yön</th><th>Çeviri</th><th>Temel adres</th><th>Yazı</th><th>Etkin</th><th></th></tr></thead><tbody>' + S.langs.map(function (l, i) { var m = missing(l.code), pc = Math.round((m.tot - m.miss) / m.tot * 100); return '<tr><td class="mm">' + l.code + '</td><td>' + esc(l.name) + '</td><td>' + F('langs.' + i + '.hreflang', 'hreflang', {}).replace(/<span>[\s\S]*?<\/span>/, '') + '</td><td class="mm">' + l.dir + '</td><td><span class="st ' + (pc === 100 ? 'ok' : pc > 50 ? 'warn' : 'bad') + '">%' + pc + '</span></td><td class="mm">/' + l.code + '/</td><td class="r mm">' + R.livePosts(S, l.code).length + '</td><td>' + CK('langs.' + i + '.enabled', 'Etkin', 1) + '</td><td>' + (mine.indexOf(l) > -1 ? B('delLang', 'Sil', { data: { c: l.code }, cls: 's dng' }) : '') + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><h2>Yeni dil ekle</h2><div class="grid3"><label class="f"><span>Kod</span><input data-nl="code" placeholder="es" maxlength="5"></label><label class="f"><span>Ad</span><input data-nl="name" placeholder="Español"></label><label class="f"><span>Yazı yönü</span><select data-nl="dir"><option value="ltr">Soldan sağa</option><option value="rtl">Sağdan sola</option></select></label></div>' + B('addLang', 'Dili ekle', { cls: 'pri' }) + '<p class="tiny">Dil anında dil seçicide, hreflang etiketlerinde ve site haritasında görünür. Çevrilmemiş metin İngilizce kalır; aşağıdan ve her sekmedeki dil düğmesiyle çevrilir. Canlıda her yeni dil için sayfalar sunucuda üretilir.</p><p id="nl-msg" class="form-msg" role="status"></p></div>' +
      '<div class="box"><h2>Arayüz metinleri (' + edLang.toUpperCase() + ')</h2><p class="tiny">Üstteki dil düğmesiyle dili seçin. Çevrilmemiş olanlar önce listelenir.</p><div class="t-w" style="max-height:440px;overflow:auto"><table class="t"><thead><tr><th>Anahtar</th><th>İngilizce</th><th>' + edLang.toUpperCase() + '</th></tr></thead><tbody>' + uk.sort(function (a, b) { return (S.ui[a][edLang] ? 1 : 0) - (S.ui[b][edLang] ? 1 : 0); }).slice(0, 60).map(function (k) { return '<tr><td class="mm">' + k + '</td><td>' + esc(S.ui[k].en) + '</td><td><input data-b="ui.' + k + '.' + edLang + '" value="' + esc(S.ui[k][edLang] || '') + '" aria-label="' + k + '"></td></tr>'; }).join('') + '</tbody></table></div></div>';
  };

  VIEWS.faq = function () {
    var items = S.faq.map(function (f, i) { return { f: f, i: i }; }).filter(function (x) { return !ui.faqCat || x.f.cat === ui.faqCat; });
    return '<div class="box"><div class="box-h"><h2>Kategoriler</h2>' + B('addFcat', 'Kategori ekle', { cls: 's' }) + '</div><div class="grid3">' + S.faqCats.map(function (c, i) { return '<div>' + F('faqCats.' + i + '.n', 'Kategori ' + (i + 1), { loc: 1 }) + B('delFcat', 'Sil', { data: { i: i }, cls: 's dng', dis: S.faq.some(function (f) { return f.cat === c.id; }) }) + '</div>'; }).join('') + '</div></div>' +
      '<div class="box"><div class="box-h"><h2>Sorular (' + items.length + ')</h2><div class="row"><select data-faq-filter aria-label="Kategori"><option value="">Tümü</option>' + S.faqCats.map(function (c) { return '<option value="' + c.id + '"' + (ui.faqCat === c.id ? ' selected' : '') + '>' + esc(R.l(c.n, 'tr')) + '</option>'; }).join('') + '</select>' + B('addFaq', 'Soru ekle', { cls: 'pri' }) + B('preview', 'Önizle', { data: { url: 'faq' } }) + '</div></div><p class="tiny">Satırı tutup sürükleyebilir veya düğmelerle sıralayabilirsiniz.</p>' + items.map(function (x) { var i = x.i; return '<div class="item" draggable="true" data-drag="' + i + '"><div class="item-h"><span class="grip" aria-hidden="true">::</span><b style="flex:1">' + esc(R.l(x.f.q, edLang)) + '</b><span class="row">' + B('mvFaq', 'Yukarı', { data: { i: i, d: -1 }, cls: 's', dis: i === 0 }) + B('mvFaq', 'Aşağı', { data: { i: i, d: 1 }, cls: 's', dis: i === S.faq.length - 1 }) + B('delFaq', 'Sil', { data: { i: i }, cls: 's dng' }) + '</span></div><div class="grid2">' + F('faq.' + i + '.q', 'Soru', { loc: 1 }) + F('faq.' + i + '.cat', 'Kategori', { type: 'select', opts: S.faqCats.map(function (c) { return [c.id, R.l(c.n, 'tr')]; }) }) + '</div>' + F('faq.' + i + '.a', 'Cevap', { loc: 1, type: 'area', rows: 3 }) + CK('faq.' + i + '.home', 'Ana sayfada göster') + '</div>'; }).join('') + '</div>';
  };

  var STAT = { published: 'Yayında', draft: 'Taslak', scheduled: 'İleri tarihli' };
  function slugify(t) { return String(t).toLocaleLowerCase('tr').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ä/g, 'ae').replace(/ß/g, 'ss').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70); }
  VIEWS.blog = function () {
    if (ui.post) return blogEditor();
    var list = S.posts.filter(function (p) { return !ui.blogStatus || p.status === ui.blogStatus; });
    var cnt = function (s) { return S.posts.filter(function (p) { return p.status === s; }).length; };
    return '<div class="box"><div class="box-h"><h2>Yazılar</h2><div class="row">' + [['', 'Tümü (' + S.posts.length + ')'], ['published', 'Yayında (' + cnt('published') + ')'], ['draft', 'Taslak (' + cnt('draft') + ')'], ['scheduled', 'İleri tarihli (' + cnt('scheduled') + ')']].map(function (x) { return B('blogSt', x[1], { data: { s: x[0] }, cls: 's ' + (ui.blogStatus === x[0] ? 'pri' : '') }); }).join('') + B('newPost', 'Yeni yazı', { cls: 'pri' }) + '</div></div><div class="t-w"><table class="t"><thead><tr><th>Başlık</th><th>Kategori</th><th>Dil</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody>' + list.map(function (p) { var i = p.i18n[edLang] || p.i18n.tr || p.i18n.en || {}, c = S.blogCats.filter(function (x) { return x.id === p.cat; })[0]; return '<tr><td><b>' + esc(i.title || '(başlıksız)') + '</b></td><td>' + esc(c ? R.l(c.n, 'tr') : '') + '</td><td class="mm">' + Object.keys(p.i18n).filter(function (k) { return p.i18n[k].title; }).join(' ').toUpperCase() + '</td><td><span class="st ' + p.status + '">' + STAT[p.status] + '</span></td><td class="mm">' + esc(p.date) + '</td><td class="row">' + B('editPost', 'Düzenle', { data: { id: p.id }, cls: 's' }) + (p.status !== 'published' ? B('pubPost', 'Yayınla', { data: { id: p.id }, cls: 's pri' }) : B('unpubPost', 'Taslağa al', { data: { id: p.id }, cls: 's' })) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="box"><div class="box-h"><h2>Etiketler</h2></div>' + (function () { var c = {}; S.posts.forEach(function (p) { (p.tags || []).forEach(function (t) { c[t] = (c[t] || 0) + 1; }); }); return Object.keys(c).map(function (t) { return '<div class="sv" style="align-items:center"><input aria-label="Etiket adı" value="' + esc(t) + '" style="max-width:260px"><small>' + c[t] + ' yazı</small>' + B('tagRen', 'Adını değiştir', { data: { t: t }, cls: 's' }) + B('tagDel', 'Sil', { data: { t: t }, cls: 's dng' }) + '</div>'; }).join(''); })() + '</div>' + '<div class="box"><div class="box-h"><h2>Blog kategorileri</h2></div><div class="grid2">' + S.blogCats.map(function (c, i) { return '<div class="item">' + F('blogCats.' + i + '.n', 'Ad', { loc: 1 }) + F('blogCats.' + i + '.slug', 'Adres', { loc: 1 }) + '<small class="tiny">' + R.livePosts(S, edLang).filter(function (p) { return p.cat === c.id; }).length + ' yazı</small></div>'; }).join('') + '</div></div>';
  };
  function blogEditor() {
    var pi = S.posts.map(function (p) { return p.id; }).indexOf(ui.post), p = S.posts[pi]; if (!p) { ui.post = null; return VIEWS.blog(); }
    if (!p.i18n[edLang]) p.i18n[edLang] = { title: '', slug: '', excerpt: '', html: '', qa: [] };
    var i = p.i18n[edLang], base = 'posts.' + pi, loc = base + '.i18n.' + edLang, dup = S.posts.some(function (x) { return x.id !== p.id && x.i18n[edLang] && x.i18n[edLang].slug && x.i18n[edLang].slug === i.slug; });
    var others = S.posts.filter(function (x) { return x.id !== p.id && R.isLive(x, edLang); });
    return '<div class="row">' + B('backBlog', 'Listeye dön') + '<span class="st ' + p.status + '" data-post-st>' + STAT[p.status] + '</span><span class="tiny mm" id="post-url">' + esc(R.cleanPath(S, 'post', edLang, p.id)) + '</span>' + (R.isLive(p, edLang) ? B('preview', 'Önizle', { data: { url: 'post:' + p.id }, cls: 's' }) : '') + B('delPost', 'Sil', { data: { id: p.id }, cls: 's dng' }) + '</div>' +
      '<div class="g2" style="grid-template-columns:minmax(0,2fr) minmax(280px,1fr)"><div class="box"><div class="box-h"><h2>İçerik (' + edLang.toUpperCase() + ')</h2><span class="tiny">Çeviriler: ' + Object.keys(p.i18n).filter(function (k) { return p.i18n[k].title; }).join(', ').toUpperCase() + '</span></div>' +
      '<label class="f"><span>Başlık</span><input id="pt" data-b="' + loc + '.title" data-slug-from="' + loc + '.slug" value="' + esc(i.title) + '"></label><label class="f"><span>Adres (slug)' + (dup ? ' <span class="st bad">Bu adres başka yazıda var</span>' : '') + '</span><input id="ps" data-b="' + loc + '.slug" data-slug="1" data-oldslug="' + esc(i.slug) + '" value="' + esc(i.slug) + '"></label>' + F(loc + '.excerpt', 'Özet', { type: 'area', rows: 2, max: 200, min: 40 }) +
      '<div class="tb" role="toolbar" aria-label="Biçim">' + [['h2', 'H2'], ['strong', 'Kalın'], ['ol', 'Liste'], ['p', 'Paragraf']].map(function (x) { return B('wrap', x[1], { data: { tag: x[0] }, cls: 's' }); }).join('') + '<select data-inslink aria-label="İç bağlantı ekle"><option value="">İç bağlantı ekle</option><option value="page:quote">Hızlı teklif</option><option value="page:compare">Lite ve Pro</option><option value="page:roi">Kayıp hesabı</option>' + others.map(function (x) { return '<option value="post:' + x.id + '">' + esc(x.i18n[edLang].title) + '</option>'; }).join('') + '</select></div><label class="f"><span>Metin (HTML)</span><textarea id="pb" class="code" data-b="' + loc + '.html" style="min-height:280px;background:#fff;color:var(--ink)">' + esc(i.html) + '</textarea></label>' +
      '<div class="box-h"><h3>Sorular ve cevaplar</h3>' + B('addQa', 'Soru ekle', { cls: 's' }) + '</div>' + (i.qa || []).map(function (q, n) { return '<div class="item"><div class="item-h"><b class="mm">S' + (n + 1) + '</b>' + B('delQa', 'Sil', { data: { n: n }, cls: 's dng' }) + '</div>' + F(loc + '.qa.' + n + '.q', 'Soru') + F(loc + '.qa.' + n + '.a', 'Cevap', { type: 'area', rows: 2 }) + '</div>'; }).join('') + '</div>' +
      '<div style="display:grid;gap:18px;align-content:start"><div class="box"><h2>Yayın</h2><label class="f"><span>Durum</span><select data-post-status>' + Object.keys(STAT).map(function (s) { return '<option value="' + s + '"' + (p.status === s ? ' selected' : '') + '>' + STAT[s] + '</option>'; }).join('') + '</select></label>' + F(base + '.date', 'Tarih', { type: 'date', rr: 1, help: 'İleri tarihli yazı bu gün gelince kendiliğinden yayına girer.' }) + '<div class="row">' + B('pubPost', 'Yayınla', { data: { id: p.id }, cls: 'pri' }) + B('unpubPost', 'Taslağa al', { data: { id: p.id } }) + '</div></div>' +
      '<div class="box"><h2>Düzen</h2>' + F(base + '.cat', 'Kategori', { type: 'select', opts: S.blogCats.map(function (c) { return [c.id, R.l(c.n, 'tr')]; }) }) + '<label class="f"><span>Etiketler</span><input data-tags="' + pi + '" value="' + esc((p.tags || []).join(', ')) + '"><small>Virgülle ayırın</small></label>' + F(base + '.author', 'Yazar', { type: 'select', opts: S.authors.map(function (a) { return [a.id, R.l(a.n, 'tr')]; }) }) + F(base + '.image', 'Kapak görseli', { type: 'select', opts: [['', 'Teknik çizim']].concat(S.media.map(function (m) { return [m.id, R.l(m.cap, 'tr')]; })) }) + F(base + '.draw.type', 'Teknik çizim tipi', { type: 'select', opts: [['cift', 'Çift açılır'], ['tek', 'Tek açılır'], ['surme', 'Sürme'], ['kapi', 'Kapı'], ['kemer', 'Kemerli'], ['kesit', 'Cam kesiti'], ['tablo', 'Fiyat tablosu']] }) + F(base + '.video', 'Video adresi', { help: 'Dosya bağlantısı (.mp4 veya .webm)' }) + '</div>' +
      '<div class="box"><h2>SEO (' + edLang.toUpperCase() + ')</h2>' + F(loc + '.seoTitle', 'SEO başlığı', { max: 60, min: 25, help: 'Boşsa yazı başlığı kullanılır.' }) + F(loc + '.seoDesc', 'SEO açıklaması', { type: 'area', rows: 3, max: 160, min: 80 }) + F(loc + '.kw', 'Anahtar kelime') + '</div>' +
      '<div class="box"><h2>İlgili yazılar</h2><p class="tiny">Seçilmezse kategori ve etikete göre otomatik gelir.</p>' + others.map(function (x) { return '<label class="chk2"><input type="checkbox" data-related="' + x.id + '"' + ((p.related || []).indexOf(x.id) > -1 ? ' checked' : '') + '><span>' + esc(x.i18n[edLang].title) + '</span></label>'; }).join('') + '</div></div></div>';
  }

  /* ---------- Teknik SEO taraması: içerik üzerinde gerçek kontroller ---------- */
  function crawl() {
    var issues = [], titles = {}, n = 0;
    R.enabled(S).forEach(function (L) {
      R.allPages(S, L.code).forEach(function (a) {
        var ctx = { page: a[0], id: a[1], lang: L.code, depth: 1 }, h = R.head(S, ctx), d = document.createElement('div'); d.innerHTML = R.body(S, ctx, 1); n++;
        var label = h.canonical.replace(S.site.base, '');
        var add = function (lv, m, fix) { issues.push({ lv: lv, m: m, u: label, fix: fix }); };
        if (!h.title) add('bad', 'Başlık boş', 'seo'); else if (h.title.length > 60) add('warn', 'Başlık uzun: ' + h.title.length + ' karakter', 'seo');
        if (!h.desc) add('bad', 'Açıklama boş', 'seo'); else if (h.desc.length > 165) add('warn', 'Açıklama uzun: ' + h.desc.length + ' karakter', 'seo'); else if (h.desc.length < 50) add('warn', 'Açıklama kısa: ' + h.desc.length + ' karakter', 'seo');
        var k = L.code + '|' + h.title; if (titles[k]) add('warn', 'Yinelenen başlık: ' + titles[k], 'seo'); titles[k] = label;
        var m = d.querySelector('main'), h1 = m.querySelectorAll('h1').length; if (h1 !== 1) add('bad', 'H1 sayısı ' + h1, 'content');
        $$('img', d).forEach(function (im) { if (!im.getAttribute('alt') && im.getAttribute('alt') !== '') add('bad', 'ALT eksik: ' + (im.getAttribute('src') || '').slice(-40), 'media'); });
        $$('img', m).forEach(function (im) { if (im.getAttribute('alt') === '' && !im.closest('.vfacade')) add('warn', 'ALT boş: ' + (im.getAttribute('src') || '').slice(-40), 'media'); });
        $$('a[data-int=post]', m).forEach(function (x) { var p = S.posts.filter(function (z) { return z.id === x.dataset.target; })[0]; if (!p || !R.isLive(p, L.code)) add('bad', 'Kırık iç bağlantı: ' + x.dataset.target, 'blog'); });
        if (h.alternates.length < 2) add('warn', 'hreflang karşılığı yok', 'langs');
        if (!h.alternates.some(function (z) { return z.code === L.code; })) add('bad', 'Sayfa kendi hreflang etiketini içermiyor', 'langs');
      });
      var mm = missing(L.code); if (mm.miss) issues.push({ lv: 'warn', m: mm.miss + ' metin çevrilmemiş, İngilizce görünüyor', u: '/' + L.code + '/', fix: 'langs' });
    });
    S.langs.forEach(function (L) { var seen = {}; S.posts.forEach(function (p) { var i = p.i18n[L.code]; if (!i || !i.slug) return; if (seen[i.slug]) issues.push({ lv: 'bad', m: 'Aynı adres iki yazıda: ' + i.slug, u: '/' + L.code + '/blog/', fix: 'blog' }); seen[i.slug] = 1; }); });
    if (S.seoGlobal.ga4 && !/^G-[A-Z0-9]{4,}$/.test(S.seoGlobal.ga4)) issues.push({ lv: 'bad', m: 'GA4 kimliği biçimi hatalı', u: 'Ayarlar', fix: 'seo' });
    if (!S.seoGlobal.ga4) issues.push({ lv: 'warn', m: 'GA4 kimliği girilmedi', u: 'Ayarlar', fix: 'seo' });
    if (!S.seoGlobal.gsc) issues.push({ lv: 'warn', m: 'Search Console doğrulaması girilmedi', u: 'Ayarlar', fix: 'seo' });
    R.setLang(edLang);
    return { n: n, issues: issues, t: new Date().toLocaleTimeString('tr-TR') };
  }
  VIEWS.tech = function () {
    var v = jget('dw_vitals', []), c = ui.crawl, avg = function (k) { return v.length ? v.reduce(function (a, x) { return a + x[k]; }, 0) / v.length : 0; };
    var bad = c ? c.issues.filter(function (i) { return i.lv === 'bad'; }).length : 0, warn = c ? c.issues.length - bad : 0;
    var real = [['Hata: Canlı yapısal veride puan var, mağazada yok', 'Şemada AggregateRating 4.5 (11 oy) yazıyor; App Store ve Google Play listelerinde özet gösterecek değerlendirme yok. Google yapısal veri ihlali sayabilir.', 'Prototipte puan alanı yok.'], ['Hata: Şema “ücretsiz”, sayfa “tek seferlik ödeme” diyor', 'Ana sayfa şemasında fiyat 0 USD, metinde tek seferlik ödeme; Suudi Arabistan sayfası açıklamasında “Free app” geçiyor.', 'Her uygulamanın ödeme modeli ayrı yazıldı.'], ['Hata: llms.txt içinde boşluklu 2 adres', '/blog/ logiciel-fenetres-pvc-aluminium ve /blog/ pvc-aluminium-window-software adreslerinde “blog/” sonrası boşluk var.', 'Adresler veriden üretilir, boşluk oluşamaz.'], ['Uyarı: DoorWin Pro sitede geçmiyor', 'Ana sayfada DoorWin Pro’dan söz edilmiyor, Lite ve Pro ayrımı yok. Pro App Store’da ayrı uygulama olarak listeleniyor.', 'Karşılaştırma ve seçici eklendi.'], ['Uyarı: İngilizce blog adresinde başka dilde yazılar', 'Hintçe, Arapça, Almanca ve benzeri yazılar /blog/ altında duruyor, hreflang yalnız en ve tr. Dil sinyali karışıyor.', 'Her dil kendi klasöründe, hreflang karşılıklı.'], ['Uyarı: İngilizce sayfada Türkçe kategori etiketi', 'İngilizce ana sayfadaki yazı kartlarında “Rehber”, “İpucu”, “Sektör” etiketleri görünüyor.', 'Kategori adları her dilde ayrı alan.']];
    return '<div class="box"><div class="box-h"><h2>Site taraması</h2><div class="row">' + B('crawl', 'Taramayı çalıştır', { cls: 'pri' }) + GERCEK + '</div></div><p class="tiny">Tüm dillerdeki sayfaları güncel içerikle işler. Başlık, açıklama, H1, ALT, iç bağlantı, hreflang ve çeviri eksiklerini arar.</p>' + (c ? '<div class="kpis"><div class="kpi"><span>Taranan sayfa</span><b>' + c.n + '</b><small>' + c.t + '</small></div><div class="kpi"><span>Hata</span><b>' + bad + '</b></div><div class="kpi"><span>Uyarı</span><b>' + warn + '</b></div></div><div id="issues" style="margin-top:10px;max-height:360px;overflow:auto">' + (c.issues.length ? c.issues.slice(0, 120).map(function (i) { return '<div class="sv"><span class="st ' + i.lv + '">' + (i.lv === 'bad' ? 'Hata' : 'Uyarı') + '</span><div style="flex:1">' + esc(i.m) + '<small class="mm">' + esc(i.u) + '</small></div><a class="b s" href="#' + i.fix + '">Düzelt</a></div>'; }).join('') : '<p class="empty">Sorun bulunmadı.</p>') + '</div>' : '') + '</div>' +
      '<div class="box"><div class="box-h"><h2>Mevcut sitede tespit edilenler</h2><span class="gercek">Gerçek: 4 Kasım 2026 incelemesi</span></div>' + real.map(function (r) { return '<div class="sv"><span class="st ' + (r[0][0] === 'H' ? 'bad' : 'warn') + '">' + r[0].split(':')[0] + '</span><div><b>' + esc(r[0].split(': ')[1]) + '</b><small>' + esc(r[1]) + '</small><small><b>Bu prototipte:</b> ' + esc(r[2]) + '</small></div></div>'; }).join('') + '</div>' +
      '<div class="g2"><div class="box"><div class="box-h"><h2>Core Web Vitals</h2>' + ORNEK + '</div><div class="kpis">' + [['LCP', '1,6 sn', 'İyi: 2,5 sn altı'], ['INP', '120 ms', 'İyi: 200 ms altı'], ['CLS', '0,02', 'İyi: 0,1 altı']].map(function (k) { return '<div class="kpi"><span>' + k[0] + '</span><b>' + k[1] + '</b><small>' + k[2] + '</small></div>'; }).join('') + '</div><p class="tiny">Canlıda Search Console ve gerçek kullanıcı ölçümüyle dolar.</p></div><div class="box"><div class="box-h"><h2>Bu tarayıcıdaki ölçüm</h2>' + GERCEK + '</div><div class="kpis"><div class="kpi"><span>Ölçülen sayfa</span><b>' + v.length + '</b></div><div class="kpi"><span>Ortalama LCP</span><b>' + Math.round(avg('lcp')) + ' ms</b></div><div class="kpi"><span>Ortalama CLS</span><b>' + avg('cls').toFixed(3) + '</b></div></div></div></div>';
  };

  VIEWS.users = function () {
    var lg = jget('dw_log', []).slice().reverse().slice(0, 40), s = session();
    return '<div class="g2"><div class="box"><h2>Roller</h2><div class="t-w"><table class="t"><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Yetki</th></tr></thead><tbody><tr><td class="mm">yonetici</td><td>Yönetici</td><td>Tümü</td></tr><tr><td class="mm">editor</td><td>Editör</td><td>İçerik, blog, SSS, görsel, talep ve rapor. SEO, dil ve ayar yok.</td></tr></tbody></table></div><p class="tiny">Oturumunuz: ' + esc(s ? s.u : '') + '. Süresi 8 saat. Prototip girişi yalnız görünümü gösterir; canlıda doğrulama sunucuda yapılır.</p></div>' +
      '<div class="box"><h2>Canlı güvenlik kapsamı</h2><div>' + ['Sunucu tarafı oturum, parola özeti ve iki adımlı doğrulama', 'Giriş denemesi sınırı ve IP kaydı', 'HTTPS, güvenlik başlıkları ve içerik güvenliği politikası', 'Form için sunucu tarafı doğrulama ve görünmez spam denetimi', 'Günlük yedek ve geri dönüş'].map(function (x) { return '<div class="sv"><span class="st warn">Canlıda</span><div>' + x + '</div></div>'; }).join('') + '<div class="sv"><span class="st ok">Prototipte</span><div>Bal tuzağı, süre, toplama sorusu, sıklık ve bağlantı süzgeci çalışıyor. Giriş 5 hatada 60 saniye kilitlenir.</div></div></div></div></div>' +
      '<div class="box"><div class="box-h"><h2>İşlem kaydı</h2>' + GERCEK + '</div>' + (lg.length ? '<div class="t-w" style="max-height:340px;overflow:auto"><table class="t"><tbody>' + lg.map(function (l) { return '<tr><td class="mm">' + esc(l.t.slice(0, 19).replace('T', ' ')) + '</td><td class="mm">' + esc(l.u) + '</td><td>' + esc(l.m) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="empty">Kayıt yok.</p>') + '</div>';
  };

  VIEWS.settings = function () {
    return '<div class="box"><h2>Yedek</h2><p class="tiny">Bu tarayıcıdaki tüm içerik ve ayarları dosyaya alın veya dosyadan yükleyin.</p><div class="row">' + B('exportAll', 'Yedeği indir', { cls: 'pri' }) + '<label class="b" style="cursor:pointer">Yedekten yükle<input type="file" accept="application/json" data-import hidden></label></div></div>' +
      '<div class="box"><h2>Örnek veriye dön</h2><p class="tiny">Panelde yapılan tüm değişiklikleri, talepleri ve olay kayıtlarını bu tarayıcıdan siler.</p>' + B('resetAll', 'Her şeyi sıfırla', { cls: 'dng' }) + '</div>';
  };

  /* ---------- Eylemler ---------- */
  function move(a, i, d) { var j = i + d; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; }
  function download(name, text, type) { var b = new Blob([text], { type: type || 'text/plain;charset=utf-8' }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000); }
  var blankL = function () { var o = {}; S.langs.forEach(function (l) { o[l.code] = ''; }); return o; };
  Object.assign(ACT, {
    revOk: function (e) { var a = jget('dw_reviews', []), r = a.splice(+e.dataset.i, 1)[0]; if (!r) return; var m = function (v) { var o = blankL(); o.en = v; o[r.lang] = v; S.langs.forEach(function (l) { o[l.code] = v; }); return o; }; S.home.reviews = S.home.reviews || []; S.home.reviews.push({ n: m(r.name), r: m(r.company), q: m(r.text) }); ls.s('dw_reviews', JSON.stringify(a)); save('Yorum onaylandı: ' + r.name); draw(); },
    revNo: function (e) { var a = jget('dw_reviews', []); a.splice(+e.dataset.i, 1); ls.s('dw_reviews', JSON.stringify(a)); log('Yorum reddedildi'); draw(); },
    revDel: function (e) { S.home.reviews.splice(+e.dataset.i, 1); save('Yorum kaldırıldı'); draw(); },
    tagRen: function (e) { var box = e.closest('.sv'), old = e.dataset.t, nw = $('input', box).value.trim(); if (!nw) return; S.posts.forEach(function (p) { p.tags = (p.tags || []).map(function (t) { return t === old ? nw : t; }).filter(function (t, i, a) { return a.indexOf(t) === i; }); }); save('Etiket değişti: ' + old); draw(); },
    tagDel: function (e) { S.posts.forEach(function (p) { p.tags = (p.tags || []).filter(function (t) { return t !== e.dataset.t; }); }); save('Etiket silindi: ' + e.dataset.t); draw(); },
    range: function (e) { ui.range = +e.dataset.n; draw(); },
    tbl: function () { ui.table = !ui.table; draw(); },
    smLang: function (e) { ui.smLang = e.dataset.c; draw(); },
    addItem: function (e) { var k = e.dataset.k, n = k === 'features' ? { img: S.screens[0], t: blankL(), d: blankL() } : k === 'adv' ? { t: blankL(), d: blankL() } : k === 'uses' ? { draw: { type: 'tek', w: 900, h: 1400 }, t: blankL(), d: blankL() } : { n: blankL(), r: blankL(), q: blankL() }; n[k === 'reviews' ? 'n' : 't'][edLang] = 'Yeni'; S.home[k].push(n); save('Öğe eklendi: ' + k); draw(); },
    delItem: function (e) { S.home[e.dataset.k].splice(+e.dataset.i, 1); save('Öğe silindi: ' + e.dataset.k); draw(); },
    mvItem: function (e) { move(S.home[e.dataset.k], +e.dataset.i, +e.dataset.d); save(); draw(); },
    mvSec: function (e) { var a = S.layouts[+ls.g('dw_layout') || 1], i = +e.dataset.i, d = +e.dataset.d; if (a[i + d] === 'hero') return; move(a, i, d); save('Bölüm sırası değişti'); draw(); },
    mvScreen: function (e) { move(S.screens, +e.dataset.i, +e.dataset.d); save(); draw(); },
    delMedia: function (e) { var m = S.media.splice(+e.dataset.i, 1)[0]; S.screens = S.screens.filter(function (x) { return x !== m.id; }); save('Görsel silindi'); draw(); },
    preview: function (e) {
      var u = e.dataset.url, a = u.split(':'), path = R.path(S, a[0], edLang, a[1]), full = '../' + path + (location.protocol === 'file:' ? '' : '');
      if (location.protocol === 'file:') full = full.replace(/\/(\?|$)/, '/index.html$1');
      var m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="modal-h"><b>Önizleme</b><span class="row"><a class="b s" target="_blank" rel="noopener" href="' + esc(full) + '">Yeni sekmede aç</a><button class="b s" type="button" data-close>Kapat</button></span></div><iframe title="Site önizlemesi" src="' + esc(full) + '"></iframe>'; document.body.appendChild(m); $('[data-close]', m).onclick = function () { m.remove(); }; $('[data-close]', m).focus();
    },
    addFaq: function () { var q = { id: 'f' + Date.now(), cat: ui.faqCat || S.faqCats[0].id, q: blankL(), a: blankL(), home: false }; q.q[edLang] = 'Yeni soru'; q.a[edLang] = 'Cevabı buraya yazın.'; S.faq.unshift(q); save('SSS eklendi'); draw(); },
    delFaq: function (e) { S.faq.splice(+e.dataset.i, 1); save('SSS silindi'); draw(); },
    mvFaq: function (e) { move(S.faq, +e.dataset.i, +e.dataset.d); save('SSS sırası değişti'); draw(); },
    addFcat: function () { var c = { id: 'k' + Date.now(), n: blankL() }; c.n[edLang] = 'Yeni kategori'; S.faqCats.push(c); save('SSS kategorisi eklendi'); draw(); },
    delFcat: function (e) { S.faqCats.splice(+e.dataset.i, 1); save('SSS kategorisi silindi'); draw(); },
    blogSt: function (e) { ui.blogStatus = e.dataset.s; draw(); },
    newPost: function () { var id = 'p' + Date.now(), i18n = {}; i18n[edLang] = { title: '', slug: '', excerpt: '', html: '<p><strong>Kısa cevap:</strong> </p>', qa: [] }; S.posts.unshift({ id: id, cat: S.blogCats[0].id, tags: [], draw: { type: 'cift', w: 1500, h: 1500 }, author: S.authors[0].id, status: 'draft', date: new Date().toISOString().slice(0, 10), i18n: i18n }); ui.post = id; save('Yeni yazı oluşturuldu'); draw(); },
    editPost: function (e) { ui.post = e.dataset.id; draw(); },
    backBlog: function () { ui.post = null; draw(); },
    pubPost: function (e) { var p = S.posts.filter(function (x) { return x.id === e.dataset.id; })[0], i = p.i18n[edLang] || p.i18n.tr || p.i18n.en; if (!i.title || !i.slug) { alert('Yayınlamak için başlık ve adres gerekli.'); return; } p.status = 'published'; if (new Date(p.date) > new Date()) p.date = new Date().toISOString().slice(0, 10); save('Yayınlandı: ' + i.title); draw(); },
    unpubPost: function (e) { var p = S.posts.filter(function (x) { return x.id === e.dataset.id; })[0]; p.status = 'draft'; save('Taslağa alındı'); draw(); },
    delPost: function (e) { if (!confirm('Yazı silinsin mi?')) return; S.posts = S.posts.filter(function (x) { return x.id !== e.dataset.id; }); ui.post = null; save('Yazı silindi'); draw(); },
    addQa: function () { var p = S.posts.filter(function (x) { return x.id === ui.post; })[0], i = p.i18n[edLang]; (i.qa = i.qa || []).push({ q: '', a: '' }); save(); draw(); },
    delQa: function (e) { var p = S.posts.filter(function (x) { return x.id === ui.post; })[0]; p.i18n[edLang].qa.splice(+e.dataset.n, 1); save(); draw(); },
    wrap: function (e) { var t = $('#pb'), tag = e.dataset.tag, a = t.selectionStart, b = t.selectionEnd, sel = t.value.slice(a, b) || 'metin', ins = tag === 'ol' ? '<ol>\n<li>' + sel + '</li>\n</ol>' : '<' + tag + '>' + sel + '</' + tag + '>'; t.setRangeText(ins, a, b, 'end'); t.dispatchEvent(new Event('input', { bubbles: true })); t.focus(); },
    addCountry: function () { var c = { id: 'c' + Date.now(), slug: blankL(), n: blankL(), loc: blankL(), lang: blankL(), cur: 'USD', vat: 0 }; c.n[edLang] = 'Yeni ülke'; c.slug[edLang] = 'yeni-ulke-' + (S.countries.length + 1); S.countries.push(c); save('Ülke sayfası eklendi'); draw(); },
    addCluster: function () { var c = { id: 'c' + Date.now(), pillar: blankL(), page: 'home', posts: [] }; c.pillar[edLang] = 'Yeni konu'; S.clusters.push(c); save(); draw(); },
    delCluster: function (e) { S.clusters.splice(+e.dataset.i, 1); save(); draw(); },
    addLang: function () {
      var code = $('[data-nl=code]').value.trim().toLowerCase(), name = $('[data-nl=name]').value.trim(), dir = $('[data-nl=dir]').value, msg = $('#nl-msg');
      if (!/^[a-z]{2,3}(-[a-z]{2})?$/.test(code) || !name) { msg.textContent = 'Geçerli bir dil kodu ve ad yazın.'; msg.className = 'form-msg bad'; return; }
      if (S.langs.some(function (l) { return l.code === code; })) { msg.textContent = 'Bu dil zaten var.'; msg.className = 'form-msg bad'; return; }
      S.langs.push({ code: code, name: name, hreflang: code, dir: dir, enabled: true });
      Object.keys(S.routes).forEach(function (k) { S.routes[k][code] = S.routes[k].en; }); S.countryBase[code] = 'country';
      edLang = code; ls.s('dw_edlang', code); save('Dil eklendi: ' + name); draw();
    },
    delLang: function (e) { S.langs = S.langs.filter(function (l) { return l.code !== e.dataset.c; }); if (edLang === e.dataset.c) edLang = 'tr'; save('Dil silindi'); draw(); },
    crawl: function () { ui.crawl = crawl(); log('Teknik tarama: ' + ui.crawl.n + ' sayfa, ' + ui.crawl.issues.length + ' bulgu'); draw(); },
    delRedir: function (e) { S.redirects.splice(+e.dataset.i, 1); save(); draw(); },
    dl: function (e) { var f = e.dataset.f; if (f === 'llms') download('llms.txt', R.llms(S)); if (f === 'robots') download('robots.txt', R.robots(S)); if (f === 'sitemap') download(ui.smLang === 'index' ? 'sitemap.xml' : 'sitemap-' + ui.smLang + '.xml', ui.smLang === 'index' ? R.sitemapIndex(S) : R.sitemap(S, ui.smLang), 'application/xml'); },
    csv: function () { var c = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }, rows = [['Puan', 'Firma', 'Tür', 'Ülke', 'E-posta', 'Kişi', 'Teklif', 'Kaynak', 'Durum', 'Tarih'].map(c).join(';')].concat(leads().map(function (l) { return [score(l), l.company, l.type, l.country, l.email, l.team, l.quotes, l.src, l.status, l.t].map(c).join(';'); })); download('talepler.csv', '﻿' + rows.join('\n'), 'text/csv;charset=utf-8'); log('Talepler indirildi'); },
    exportAll: function () { download('doorwin-yedek.json', JSON.stringify({ state: S, leads: jget('dw_leads', []) }, null, 1), 'application/json'); log('Yedek indirildi'); },
    resetAll: function () { if (!confirm('Tüm değişiklikler silinsin mi?')) return; ['dw_state', 'dw_leads', 'dw_events', 'dw_vitals', 'dw_log', 'dw_lead_times', 'dw_used_quote', 'dw_used_roi'].forEach(ls.r); location.reload(); },
    logout: function () { log('Çıkış'); ls.r('dw_session'); render(); },
    menu: function () { $('.side').classList.toggle('open'); }
  });

  /* ---------- Çizim ---------- */
  function renderLogin(msg) {
    el.innerHTML = '<main class="lg"><form class="lg-c" id="lg"><div class="lg-b"><img src="../assets/img/pro-icon-160.webp" alt="" width="44" height="44">DoorWin Pro</div><h1 style="font-size:1.7rem">Yönetim girişi</h1><label class="f"><span>Kullanıcı</span><input name="u" autocomplete="username" required value="yonetici"></label><label class="f"><span>Parola</span><input name="p" type="password" autocomplete="current-password" required></label><button class="btn btn-pri" type="submit">Giriş yap</button><p class="form-msg bad" role="alert">' + esc(msg || '') + '</p><p class="note" style="margin:0">Önizleme girişi: parola <b>demo-2026</b>. Roller: yonetici ve editor. Gerçek hesap değildir, canlıda doğrulama sunucuda yapılır.</p><a class="link" href="../' + (location.protocol === 'file:' ? 'index.html' : '') + '">Sunuma dön</a></form></main>';
    $('#lg').onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, lock = jget('dw_lock', { n: 0, until: 0 });
      if (lock.until > Date.now()) { renderLogin('Çok fazla hatalı deneme. ' + Math.ceil((lock.until - Date.now()) / 1000) + ' saniye bekleyin.'); return; }
      var u = USERS[f.u.value.trim()];
      if (!u || f.p.value !== PASS) { lock.n++; if (lock.n >= 5) { lock.until = Date.now() + 6e4; lock.n = 0; } ls.s('dw_lock', JSON.stringify(lock)); renderLogin(lock.until > Date.now() ? 'Hesap 60 saniye kilitlendi.' : 'Kullanıcı veya parola hatalı.'); return; }
      ls.r('dw_lock'); ls.s('dw_session', JSON.stringify({ u: f.u.value.trim(), role: u.role, until: Date.now() + 8 * 36e5 })); log('Giriş yapıldı'); render();
    };
  }
  function allowed(v) { return isAdmin() || EDITOR_OK[v]; }
  function shell() {
    var s = session(), newL = jget('dw_leads', []).filter(function (l) { return l.status === 'yeni'; }).length;
    el.innerHTML = '<div class="app"><aside class="side"><a class="side-b" href="#overview"><img src="../assets/img/pro-icon-160.webp" alt="" width="32" height="32">DoorWin Pro</a><nav aria-label="Panel">' + NAV.map(function (g) { var items = g[1].filter(function (x) { return allowed(x[0]); }); if (!items.length) return ''; return '<h2>' + g[0] + '</h2>' + items.map(function (x) { return '<a class="it" data-v="' + x[0] + '" href="#' + x[0] + '"><span>' + x[1] + '</span>' + (x[0] === 'leads' && newL ? '<span class="cnt">' + newL + '</span>' : '') + '</a>'; }).join(''); }).join('') + '</nav><div class="side-f"><span>' + esc(USERS[s.u].n) + '</span><a href="../' + (location.protocol === 'file:' ? 'tr/index.html' : 'tr/') + '" target="_blank" rel="noopener">Siteyi aç</a><button class="b s" type="button" data-a="logout">Çıkış</button></div></aside><div style="min-width:0"><header class="topb"><button class="menu-t" type="button" data-a="menu" aria-label="Menü">≡</button><h1 id="vt"></h1><span class="saved" aria-live="polite"></span><div class="langs" id="langs"></div></header><main class="view" id="view" tabindex="-1"></main></div></div>';
  }
  function drawLangs() { $('#langs').innerHTML = '<span>İçerik dili</span>' + S.langs.map(function (l) { return '<button type="button" data-ed="' + l.code + '" class="' + (edLang === l.code ? 'on' : '') + '" aria-pressed="' + (edLang === l.code) + '">' + l.code.toUpperCase() + '</button>'; }).join(''); }
  function draw() {
    R.setLang(edLang);
    var v = ui.view; if (!allowed(v)) { ui.view = v = 'overview'; }
    if (!S.langs.some(function (l) { return l.code === edLang; })) edLang = 'tr';
    drawLangs();
    $$('.side a.it').forEach(function (a) { a.classList.toggle('on', a.dataset.v === v); if (a.dataset.v === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('#vt').textContent = TITLE[v];
    var scroll = window.scrollY;
    $('#view').innerHTML = VIEWS[v]();
    window.scrollTo(0, scroll);
    if (v === 'overview' && !ui.table) bindCharts(ui._charts);
    $('.side').classList.remove('open');
  }
  function render() { if (!session()) { renderLogin(); return; } shell(); route(); }
  function route() { var v = location.hash.slice(1); if (VIEWS[v]) { ui.view = v; if (v !== 'blog') ui.post = null; } draw(); }
  window.addEventListener('hashchange', function () { if (session()) { route(); window.scrollTo(0, 0); } });

  /* ---------- Olay aktarımı ---------- */
  function refreshPreviews(p) {
    var ctx, h;
    if (ui.view === 'seo') { ctx = ctxFromKey(ui.seoPage); h = R.head(S, ctx); R.setLang(edLang); var t = $('[data-serp-t]'), d = $('[data-serp-d]'), j = $('[data-jsonld]'), rb = $('[data-robots]'); if (t) t.textContent = h.title; if (d) d.textContent = h.desc; if (j) j.textContent = JSON.stringify(h.jsonld, null, 1); if (rb) rb.textContent = R.robots(S); }
    if (ui.view === 'geo') { var ll = $('[data-llms]'); if (ll) ll.textContent = R.llms(S); R.setLang(edLang); }
  }
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset.b && !t.dataset.bool && t.tagName !== 'SELECT') {
      var v = t.type === 'number' ? (t.value === '' ? 0 : +t.value) : t.value;
      if (t.dataset.slug) { v = slugify(v); }
      set(t.dataset.b, v);
      if (t.dataset.slugFrom) { var si = $('#ps'), cur = get(t.dataset.slugFrom); if (si && !si.dataset.touched && (!cur || t.dataset.autoslug || !si.dataset.oldslug)) { t.dataset.autoslug = '1'; var sg = slugify(v); set(t.dataset.slugFrom, sg); si.value = sg; } }
      if (t.dataset.slug) { t.dataset.touched = '1'; }
      if (t.dataset.max) { var lb = t.closest('label').querySelector('[data-len]'); if (lb) { lb.outerHTML = lenBadge(t.value.length, +t.dataset.min, +t.dataset.max); } }
      save(); refreshPreviews();
      var u = $('#post-url'); if (u && ui.post) u.textContent = R.cleanPath(S, 'post', edLang, ui.post);
    }
    if (t.dataset.tags != null && t.dataset.tags !== '') { S.posts[+t.dataset.tags].tags = t.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean); save(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.b && t.dataset.bool) { set(t.dataset.b, t.checked); save('Ayar değişti: ' + t.dataset.b); if (t.dataset.rr) draw(); return; }
    if (t.dataset.b && t.tagName === 'SELECT') { set(t.dataset.b, t.value); save('Seçim değişti: ' + t.dataset.b); return; }
    if (t.dataset.b && t.dataset.rr) { draw(); return; }
    if (t.dataset.slug && t.dataset.oldslug && t.dataset.oldslug !== t.value) {
      var p = S.posts.filter(function (x) { return x.id === ui.post; })[0];
      if (p && p.status === 'published') { var pre = edLang + '/blog/'; S.redirects = S.redirects.filter(function (r) { return r.from !== pre + t.dataset.oldslug + '/'; }); if (t.value) { S.redirects.push({ from: pre + t.dataset.oldslug + '/', to: R.path(S, 'post', edLang, p.id) }); save('301 eklendi: ' + t.dataset.oldslug); } }
      t.dataset.oldslug = t.value;
    }
    if (t.dataset.seoPage != null) { ui.seoPage = t.value; draw(); }
    if (t.dataset.faqFilter != null) { ui.faqCat = t.value; draw(); }
    if (t.dataset.layoutSel != null) { ls.s('dw_layout', t.value); draw(); }
    if (t.dataset.lead) { var ll = jget('dw_leads', []), hit = ll.filter(function (l) { return l.id === t.dataset.lead; })[0]; if (hit) { hit.status = t.value; ls.s('dw_leads', JSON.stringify(ll)); } else { var s = S.leads.filter(function (l) { return l.id === t.dataset.lead; })[0]; if (s) { s.status = t.value; save(); } } log('Talep durumu: ' + t.value); }
    if (t.dataset.screen) { if (t.checked) S.screens.push(t.dataset.screen); else S.screens = S.screens.filter(function (x) { return x !== t.dataset.screen; }); save('Ekran listesi değişti'); draw(); }
    if (t.dataset.related) { var pr = S.posts.filter(function (x) { return x.id === ui.post; })[0]; pr.related = pr.related || []; if (t.checked) pr.related.push(t.dataset.related); else pr.related = pr.related.filter(function (x) { return x !== t.dataset.related; }); save(); }
    if (t.dataset.cluster) { var c = S.clusters[+t.dataset.cluster]; if (t.checked) c.posts.push(t.dataset.pid); else c.posts = c.posts.filter(function (x) { return x !== t.dataset.pid; }); save(); }
    if (t.dataset.postStatus != null) { var ps = S.posts.filter(function (x) { return x.id === ui.post; })[0]; ps.status = t.value; if (t.value === 'scheduled' && new Date(ps.date) <= new Date()) { var d = new Date(Date.now() + 7 * 864e5); ps.date = d.toISOString().slice(0, 10); } save('Durum: ' + STAT[t.value]); draw(); }
    if (t.dataset.inslink != null && t.value) { var tx = $('#pb'), a = t.value.split(':'), lab = tx.value.slice(tx.selectionStart, tx.selectionEnd) || t.options[t.selectedIndex].text; tx.setRangeText('<a data-link="' + a[0] + ':' + a[1] + '">' + lab + '</a>', tx.selectionStart, tx.selectionEnd, 'end'); tx.dispatchEvent(new Event('input', { bubbles: true })); t.value = ''; }
    if (t.dataset.upload != null && t.files[0]) upload(t.files[0]);
    if (t.dataset.import != null && t.files[0]) { var fr = new FileReader(); fr.onload = function () { try { var o = JSON.parse(fr.result); if (!o.state || !o.state.posts) throw 0; S = o.state; if (o.leads) ls.s('dw_leads', JSON.stringify(o.leads)); save('Yedekten yüklendi'); draw(); } catch (x) { alert('Dosya geçerli bir yedek değil.'); } }; fr.readAsText(t.files[0]); }
    if (t.dataset.b && t.type === 'number' && ui.view === 'leads') draw();
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-a]'); if (a && !a.disabled && ACT[a.dataset.a]) { ACT[a.dataset.a](a); return; }
    var ed = e.target.closest('[data-ed]'); if (ed) { edLang = ed.dataset.ed; ls.s('dw_edlang', edLang); if (S.langs.some(function (l) { return l.code === edLang; }) && R.enabled(S).some(function (l) { return l.code === edLang; })) ui.smLang = edLang; draw(); }
  });
  var dragI = null;
  document.addEventListener('dragstart', function (e) { var d = e.target.closest && e.target.closest('[data-drag]'); if (d) { dragI = +d.dataset.drag; d.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; } });
  document.addEventListener('dragover', function (e) { if (dragI !== null && e.target.closest('[data-drag]')) e.preventDefault(); });
  document.addEventListener('drop', function (e) { var d = e.target.closest('[data-drag]'); if (dragI === null || !d) return; e.preventDefault(); var to = +d.dataset.drag, x = S.faq.splice(dragI, 1)[0]; S.faq.splice(to, 0, x); dragI = null; save('SSS sırası değişti'); draw(); });
  document.addEventListener('dragend', function () { dragI = null; $$('.drag').forEach(function (n) { n.classList.remove('drag'); }); });

  function upload(file) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var s = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      var data = c.toDataURL('image/webp', .78); URL.revokeObjectURL(url);
      if (data.length > 600000) { alert('Görsel küçültüldükten sonra da çok büyük.'); return; }
      var alt = {}, cap = {}, nm = file.name.replace(/\.[^.]+$/, ''); S.langs.forEach(function (l) { alt[l.code] = ''; cap[l.code] = ''; }); alt[edLang] = nm; cap[edLang] = nm;
      S.media.push({ id: 'up' + Date.now(), data: data, w: c.width, h: c.height, one: 1, alt: alt, cap: cap }); save('Görsel yüklendi: ' + nm); draw();
    };
    img.onerror = function () { alert('Bu dosya görsel olarak açılamadı.'); };
    img.src = url;
  }
  render();
})();
