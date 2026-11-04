/* Site çalışma zamanı: panel durumunu uygular, araçları çalıştırır, olay kaydı tutar. Tüm veri bu tarayıcıda kalır. */
(function () {
  var R = window.DWR, html = document.documentElement, store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }
  };
  var DW = window.DW = {};
  DW.state = function () { var s = store.get('dw_state'); if (s) { try { return JSON.parse(s); } catch (e) { } } return JSON.parse(JSON.stringify(window.DW_SEED)); };
  var hasState = !!store.get('dw_state'), S = DW.state();
  var qs = new URLSearchParams(location.search);

  var ctx = { page: html.dataset.page, lang: html.dataset.lang, id: html.dataset.id || undefined, depth: +html.dataset.depth || 0 };
  var isShell = html.dataset.page === 'shell';
  if (isShell) { ctx.page = qs.get('p') || 'home'; ctx.lang = qs.get('l') || 'en'; ctx.id = qs.get('id') || undefined; ctx.depth = 1; }
  R.setLang(ctx.lang);

  /* Eski adres yönlendirmesi: slug değişince panel 301 kaydı ekler */
  (function () {
    var here = location.pathname.replace(/index\.html$/, '');
    (S.redirects || []).some(function (r) {
      if (here.slice(-r.from.length) === r.from) {
        var ups = ''; for (var i = 0; i < ctx.depth; i++) ups += '../';
        location.replace(ups + r.to + (location.protocol === 'file:' && /\/$/.test(r.to) ? 'index.html' : ''));
        return true;
      }
    });
  })();

  var lay = +qs.get('d') || +store.get('dw_layout') || 1;
  if (qs.get('d')) store.set('dw_layout', String(lay));
  if ([1, 2, 3].indexOf(lay) < 0) lay = 1;
  html.dataset.layout = lay;

  var scheduledLive = S.posts.some(function (p) { return p.status === 'scheduled' && new Date(p.date) <= new Date(); });
  var app = document.getElementById('app');
  if (isShell || hasState || lay !== 1 || scheduledLive) { app.innerHTML = R.body(S, ctx, lay); applyHead(); }

  function setMeta(sel, attr, name, val) { var m = document.head.querySelector(sel); if (!val) { if (m) m.remove(); return; } if (!m) { m = document.createElement('meta'); m.setAttribute(attr, name); document.head.appendChild(m); } m.setAttribute('content', val); }
  function applyHead() {
    var h = R.head(S, ctx);
    document.title = h.title;
    html.lang = ctx.lang; html.dir = h.dir;
    setMeta('meta[name=description]', 'name', 'description', h.desc);
    setMeta('meta[name=keywords]', 'name', 'keywords', h.kw);
    setMeta('meta[name=robots]', 'name', 'robots', isShell && false ? 'noindex' : h.robots);
    setMeta('meta[property="og:title"]', 'property', 'og:title', h.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', h.desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', h.canonical);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', ctx.lang);
    setMeta('meta[name=google-site-verification]', 'name', 'google-site-verification', h.gsc);
    Array.prototype.forEach.call(document.head.querySelectorAll('link[rel=canonical],link[rel=alternate],script[type="application/ld+json"]'), function (n) { n.remove(); });
    var add = function (rel, href, hl) { var a = document.createElement('link'); a.rel = rel; a.href = href; if (hl) a.hreflang = hl; document.head.appendChild(a); };
    add('canonical', h.canonical);
    h.alternates.forEach(function (a) { add('alternate', a.abs, a.hreflang); });
    if (h.xdefault) add('alternate', h.xdefault, 'x-default');
    h.jsonld.forEach(function (j) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(j); document.head.appendChild(s); });
  }

  /* file:// ile açıldığında klasör bağlantılarını index.html'e bağla */
  function fixLinks() {
    if (location.protocol !== 'file:') return;
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|#|data:)/.test(h)) return;
      a.setAttribute('href', h.replace(/\/(\?|#|$)/, '/index.html$1'));
    });
  }
  fixLinks();

  /* ---------- Olay kaydı ---------- */
  var pageKey = ctx.page === 'post' ? 'blog:' + ctx.id : ctx.page === 'country' ? 'country:' + ctx.id : ctx.page;
  DW.track = function (type, d) {
    var a = []; try { a = JSON.parse(store.get('dw_events') || '[]'); } catch (e) { }
    a.push(Object.assign({ t: Date.now(), type: type, page: pageKey, lang: ctx.lang }, d || {}));
    store.set('dw_events', JSON.stringify(a.slice(-800)));
  };
  DW.track('view');
  if (ctx.page === 'post' && !store.sget('dw_first_blog')) store.sset('dw_first_blog', pageKey);

  /* Gerçek ölçüm: bu ziyaretin LCP ve CLS değeri */
  try {
    var vit = { lcp: 0, cls: 0 };
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { vit.lcp = e.startTime; }); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (!e.hadRecentInput) vit.cls += e.value; }); }).observe({ type: 'layout-shift', buffered: true });
    window.addEventListener('pagehide', function () { var a = []; try { a = JSON.parse(store.get('dw_vitals') || '[]'); } catch (e) { } a.push({ p: pageKey, lcp: Math.round(vit.lcp), cls: +vit.cls.toFixed(3), t: Date.now() }); store.set('dw_vitals', JSON.stringify(a.slice(-60))); });
  } catch (e) { }

  /* ---------- Teklif aracı ---------- */
  function qState(w) { if (!w._s) w._s = { cfg: JSON.parse(w.dataset.cfg), p: JSON.parse(w.dataset.prices) }; return w._s; }
  function drawQuote(w) {
    var s = qState(w), cfg = s.cfg, p = s.p, full = w.dataset.full;
    var dr = w.querySelector('[data-q-draw]'); if (dr) dr.innerHTML = R.win(cfg, { small: !full });
    if (full) w.querySelector('[data-q-table]').innerHTML = R.qtable(S, cfg, p);
    else { var r = R.calc(cfg, p); w.querySelector('[data-q-net]').textContent = R.money(r.net, p.cur); w.querySelector('[data-q-sale]').textContent = R.money(r.sale, p.cur); w.querySelector('[data-q-gross]').textContent = R.money(r.gross, p.cur); }
  }
  function onQuote(e, w) {
    var t = e.target, s = qState(w);
    if (t.dataset.q) { s.cfg[t.dataset.q] = t.type === 'number' ? (+t.value || 0) : t.value; }
    else if (t.dataset.p) { s.p[t.dataset.p] = t.dataset.p === 'cur' ? t.value.toUpperCase() : (+t.value || 0); }
    else return;
    drawQuote(w);
    if (!store.sget('dw_q')) { store.sset('dw_q', '1'); store.set('dw_used_quote', '1'); DW.track('quote_use', { src: w.dataset.src }); }
  }

  /* ---------- Kayıp hesabı ---------- */
  function rState(w) { if (!w._r) w._r = Object.assign({}, R.roiDefaults); return w._r; }
  function onRoi(e, w) {
    var t = e.target; if (!t.dataset.r) return;
    var v = rState(w); v[t.dataset.r] = t.dataset.r === 'plan' || t.dataset.r === 'cur' ? t.value : (+t.value || 0);
    if (t.dataset.r === 'plan') { var feeI = w.querySelector('[data-r=fee]'); if (feeI) { var f = parseFloat((t.value === 'annual' ? S.pricing.proAnnual : S.pricing.proMonthly).replace(/[^\d.]/g, '')); feeI.value = f; v.fee = f; } }
    w.querySelector('[data-roi-out]').innerHTML = R.roiResults(S, v);
    if (!store.sget('dw_r')) { store.sset('dw_r', '1'); store.set('dw_used_roi', '1'); DW.track('roi_use'); }
  }

  /* ---------- Talep formu: bal tuzağı, süre, toplama, sıklık, bağlantı süzgeci ---------- */
  var formStart = Date.now();
  function fieldErr(inp, msg) { var e = inp.parentNode.querySelector('.err'); if (!e) return; e.textContent = msg || ''; e.hidden = !msg; if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
  function onLead(f) {
    var u = S.ui, msg = f.querySelector('.form-msg'), v = function (n) { return f.elements[n].value.trim(); }, bad = false;
    msg.textContent = ''; msg.className = 'form-msg';
    ['company', 'country'].forEach(function (n) { var m = v(n) ? '' : R.l(u.fRequired); fieldErr(f.elements[n], m); if (m) bad = true; });
    var em = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')) ? '' : R.l(u.fEmailBad); fieldErr(f.elements.email, em); if (em) bad = true;
    var cap = f.elements.cap, capOk = +cap.value === (+cap.dataset.a) + (+cap.dataset.b); fieldErr(cap, capOk ? '' : R.l(u.fCaptchaBad)); if (!capOk) bad = true;
    var okE = f.querySelector('[data-err-ok]'); okE.hidden = f.elements.ok.checked; okE.textContent = f.elements.ok.checked ? '' : R.l(u.fRequired); if (!f.elements.ok.checked) bad = true;
    if (bad) { var first = f.querySelector('[aria-invalid=true]'); if (first) first.focus(); return; }
    var recent = []; try { recent = JSON.parse(store.get('dw_lead_times') || '[]').filter(function (t) { return Date.now() - t < 6e5; }); } catch (e) { }
    var reason = v('website') ? 'honeypot' : Date.now() - formStart < 3000 ? 'too_fast' : recent.length >= 3 ? 'rate_limit' : (v('msg').match(/https?:\/\//g) || []).length > 1 ? 'links' : null;
    if (reason) { DW.track('spam_block', { reason: reason }); msg.textContent = R.l(u.fSpam); msg.classList.add('bad'); return; }
    recent.push(Date.now()); store.set('dw_lead_times', JSON.stringify(recent));
    var leads = []; try { leads = JSON.parse(store.get('dw_leads') || '[]'); } catch (e) { }
    var roi = store.sget('dw_roi_result');
    leads.push({ id: 'L' + Date.now(), t: new Date().toISOString(), company: v('company'), type: v('type'), country: v('country'), email: v('email'), team: +v('team') || 1, quotes: +v('quotes') || 0, msg: v('msg'), src: f.dataset.country ? 'country:' + f.dataset.country : (store.sget('dw_first_blog') || pageKey), roi: !!store.get('dw_used_roi'), quote: !!store.get('dw_used_quote'), roiResult: roi || '', status: 'yeni' });
    store.set('dw_leads', JSON.stringify(leads));
    DW.track('lead', { type: v('type') });
    f.reset(); formStart = Date.now();
    msg.textContent = R.l(u.fOk); msg.classList.add('ok');
  }

  /* ---------- Olaylar ---------- */
  document.addEventListener('input', function (e) { var w = e.target.closest('[data-w]'); if (!w) return; if (w.dataset.w === 'quote') onQuote(e, w); if (w.dataset.w === 'roi') onRoi(e, w); });
  document.addEventListener('change', function (e) {
    var w = e.target.closest('[data-w]'); if (!w) return;
    if (w.dataset.w === 'quote') onQuote(e, w);
    if (w.dataset.w === 'roi') onRoi(e, w);
    if (w.dataset.w === 'wizard') { var a = {}; ['q1', 'q2', 'q3', 'q4'].forEach(function (q) { var c = w.querySelector('input[name=' + q + ']:checked'); if (c) a[q] = c.value; }); w.querySelector('[data-wiz-out]').innerHTML = R.wizardResult(S, ctx, a); DW.track('wizard_use'); }
  });
  document.addEventListener('submit', function (e) { if (e.target.dataset.w === 'lead') { e.preventDefault(); onLead(e.target); } });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-store]');
    if (a) DW.track('store_click', { app: a.dataset.app, kind: a.dataset.store, src: a.dataset.src });
    var f = e.target.closest('[data-funnel]'); if (f) DW.track('funnel', { step: f.dataset.funnel, src: f.dataset.src });
    if (e.target.closest('[data-q-print]')) { DW.track('quote_pdf'); document.body.classList.add('printing'); window.print(); setTimeout(function () { document.body.classList.remove('printing'); }, 500); }
    var send = e.target.closest('[data-roi-send]'); if (send) { var w = send.closest('[data-w=roi]'), r = R.roi(rState(w)); store.sset('dw_roi_result', R.money(r.leak, rState(w).cur)); store.set('dw_used_roi', '1'); }
    var fc = e.target.closest('[data-fcat]');
    if (fc) { Array.prototype.forEach.call(document.querySelectorAll('[data-fcat]'), function (b) { b.classList.toggle('on', b === fc); b.setAttribute('aria-pressed', b === fc); }); Array.prototype.forEach.call(document.querySelectorAll('.fgroup'), function (g) { g.hidden = !!fc.dataset.fcat && g.dataset.cat !== fc.dataset.fcat; }); }
    var tg = e.target.closest('button[data-tag]'); if (tg) filterTag(tg.classList.contains('on') ? '' : tg.dataset.tag);
    var vf = e.target.closest('[data-video-src]'); if (vf) { var fr = document.createElement('iframe'); fr.src = vf.dataset.videoSrc; fr.title = 'Video'; fr.width = 1280; fr.height = 720; fr.setAttribute('allowfullscreen', ''); vf.replaceWith(fr); DW.track('video_play'); }
    if (e.target.closest('details.mnav a')) { var d = e.target.closest('details.mnav'); if (d) d.open = false; }
  });
  document.addEventListener('play', function (e) { if (e.target.matches && e.target.matches('[data-track-video]')) DW.track('video_play'); }, true);
  function filterTag(tag) {
    Array.prototype.forEach.call(document.querySelectorAll('button[data-tag]'), function (b) { var on = b.dataset.tag === tag; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    Array.prototype.forEach.call(document.querySelectorAll('.pcs .pc'), function (c) { c.hidden = !!tag && (c.dataset.tags || '').split('|').indexOf(tag) < 0; });
  }
  var hm = location.hash.match(/^#tag=(.+)/); if (hm) filterTag(decodeURIComponent(hm[1]));
  var fromRoi = document.querySelector('[data-from-roi]'), rv = store.sget('dw_roi_result');
  if (fromRoi && rv) { fromRoi.hidden = false; fromRoi.textContent += ': ' + rv; }
})();
