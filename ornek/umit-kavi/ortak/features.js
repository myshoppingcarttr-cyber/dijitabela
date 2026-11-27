/* Dijitabela iş geliştirme modülleri — Ümit Kavi örnek siteleri (demo). Bağımlılık yok (QR için qrcode-generator). */
(function () {
  'use strict';
  var WA = '905000000000'; // YER TUTUCU numara
  var CFG = window.UK_CFG || {};
  var lang = 'tr';
  try { var sv = localStorage.getItem('uk_lang'); if (sv) lang = sv; } catch (e) {}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = {
    get: function (k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  var D = {
    tr: {
      calcT: 'Etkinlik teklif hesaplayıcı', calcS: 'Kişi sayısı, menü ve tarihi seçin; tahmini bütçe aralığını anında görün.',
      guests: 'Kişi sayısı', menu: 'Menü tipi', svc: 'Hizmet kapsamı', date: 'Etkinlik tarihi',
      m1: 'Set menü (3 servis)', m2: 'Açık büfe', m3: 'Kokteyl & kanepe', m4: 'Brunch & kahve',
      s1: 'Yalnız mutfak (teslim)', s2: 'Servis dahil', s3: 'Servis + dekor',
      est: 'Tahmini bütçe', perP: 'kişi başı', total: 'Toplam aralık', demoNote: 'Örnek hesaplama; kesin teklif değildir. Fiyatlar görüşmede netleşir.',
      pdf: 'Özeti yazdır / PDF', send: 'WhatsApp\'ta gönder', weekend: 'Hafta sonu etkinliği: +%10', disc: 'Kalabalık grup indirimi uygulandı',
      bookT: 'Online randevu', bookS: 'Müsait gün ve saati seçin; onay kodunuzu hemen alın.',
      bt1: 'Tadım & şef masası', bt2: 'Etkinlik keşif görüşmesi', bt3: 'Online tanışma (15 dk)',
      name: 'Ad Soyad', phone: 'Telefon', topic: 'Konu', note: 'Notunuz', confirm: 'Randevuyu onayla', pickDay: 'Önce bir gün seçin',
      full: 'Dolu', booked: 'Randevunuz alındı', code: 'Onay kodu', ics: 'Takvime ekle (.ics)', closed: 'Pazartesi kapalı',
      leadT: 'Talep bırakın', leadS: 'Formunuz doğrudan CRM kuyruğuna düşer ve takip numarası verilir.',
      topicOpts: ['Etkinlik / catering', 'Özel yemek / şef masası', 'Danışmanlık / menü geliştirme', 'İş birliği / Redna Hub', 'Diğer'],
      msg: 'Mesajınız', submit: 'Talebi gönder', got: 'Talebiniz alındı', track: 'Takip numaranız', crmT: 'CRM kuyruğu (demo)', newS: 'Yeni', needN: 'Ad ve telefon gerekli.', needFix: 'Lütfen alanları kontrol edin.',
      crmNote: 'Bu bir demodur; talepler yalnız bu tarayıcıda saklanır. Gerçek sitede CRM / e-posta / WhatsApp\'a düşer.',
      revT: 'Google yorumları', revS: 'Gerçek yorumlarınız burada görünecek.', revGhost: 'Henüz yorum yok. Müşterileriniz Google işletme profilinizde yorum bıraktığında, puan ortalaması ve son yorumlar bu alanda otomatik listelenecek.', revBtn: 'Google\'da yorum bırak', revSample: 'Örnek alan — gerçek yorum yok',
      qrT: 'QR kartvizit & dijital menü', qrS: 'Telefonla okutun; kartvizit veya menü sayfası açılsın.', qr1: 'Kartvizit (vCard)', qr2: 'Bu sayfa / menü', dl: 'QR\'ı indir (SVG)',
      chatName: 'Ümit\'in asistanı', chatSub: 'Yapay zekâ asistan · demo', chatNote: 'Demo asistan — hazır akışlarla yanıt verir. Gerçek sitede Ümit adına eğitilir.',
      hi: 'Merhaba! Ben Ümit\'in dijital asistanıyım. Size nasıl yardımcı olabilirim?',
      o_menu: 'Menü & hizmetler', o_event: 'Etkinlik teklifi', o_book: 'Randevu / rezervasyon', o_collab: 'İş birliği', o_contact: 'İletişim',
      a_menu: 'Ümit; modern mutfak, pastacılık ve uluslararası mutfaklar üzerine Mutfak Sanatları eğitimi aldı. Etkinlik menüleri, tadım sofraları, kahve/barista servisi ve menü danışmanlığı hazırlar. Ayrıntılar için sitedeki Menü bölümüne bakabilirsiniz.',
      q_ppl: 'Kaç kişilik bir etkinlik planlıyorsunuz?', p1: '10–30 kişi', p2: '30–80 kişi', p3: '80+ kişi',
      q_type: 'Nasıl bir sofra düşünüyorsunuz?', q_when: 'Ne zaman?', w1: 'Bu ay', w2: 'Gelecek ay', w3: 'Henüz belli değil',
      sum: 'Talebinizi özetleyeyim:', wa: 'WhatsApp\'ta gönder', toForm: 'Forma aktar', again: 'Baştan başla',
      a_book: 'Müsait gün ve saatleri sitedeki "Randevu" bölümünden seçebilirsiniz; onay kodunuz anında oluşur.',
      a_collab: 'Ümit; girişimci tarafıyla Redna Hub çatısı altında iş birliklerine açık. Kısa bir not bırakırsanız size dönüş yapılır.',
      a_contact: 'En hızlı yol WhatsApp. Formdan talep de bırakabilirsiniz; takip numarası verilir.', goBook: 'Randevuya git', goForm: 'Forma git', goCalc: 'Hesaplayıcıya git',
      sent: 'Özet forma aktarıldı. Aşağıdaki formdan göndererek takip numarası alabilirsiniz.', waMsg: 'Merhaba, siteden yazıyorum.',
      waT: 'WhatsApp asistanı', waS: 'Mesajınız hazır yazılı olarak açılır.', waB: 'WhatsApp\'ta yaz', waPre: 'Merhaba Ümit, sitenizden ulaşıyorum. Bir etkinlik/menü konusunda bilgi almak istiyorum.',
      days: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'], months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      printT: 'Etkinlik özeti — örnek hesaplama'
    },
    en: {
      calcT: 'Event quote calculator', calcS: 'Pick guests, menu and date; see an estimated budget range instantly.',
      guests: 'Guests', menu: 'Menu type', svc: 'Service level', date: 'Event date',
      m1: 'Set menu (3 courses)', m2: 'Buffet', m3: 'Cocktail & canapés', m4: 'Brunch & coffee',
      s1: 'Kitchen only (delivered)', s2: 'Service included', s3: 'Service + styling',
      est: 'Estimated budget', perP: 'per person', total: 'Total range', demoNote: 'Sample calculation, not a binding quote. Final prices are agreed in a call.',
      pdf: 'Print summary / PDF', send: 'Send on WhatsApp', weekend: 'Weekend event: +10%', disc: 'Large-group discount applied',
      bookT: 'Online booking', bookS: 'Pick an available day and time; get your confirmation code instantly.',
      bt1: 'Tasting & chef\'s table', bt2: 'Event discovery call', bt3: 'Online intro (15 min)',
      name: 'Full name', phone: 'Phone', topic: 'Topic', note: 'Your note', confirm: 'Confirm booking', pickDay: 'Pick a day first',
      full: 'Full', booked: 'Your booking is confirmed', code: 'Confirmation code', ics: 'Add to calendar (.ics)', closed: 'Closed on Mondays',
      leadT: 'Leave a request', leadS: 'Your form drops straight into the CRM queue and gets a tracking number.',
      topicOpts: ['Event / catering', 'Private dining / chef\'s table', 'Consulting / menu development', 'Partnership / Redna Hub', 'Other'],
      msg: 'Your message', submit: 'Send request', got: 'Request received', track: 'Your tracking number', crmT: 'CRM queue (demo)', newS: 'New', needN: 'Name and phone are required.', needFix: 'Please check the fields.',
      crmNote: 'This is a demo; requests are stored in this browser only. On the live site they go to CRM / email / WhatsApp.',
      revT: 'Google reviews', revS: 'Your real reviews will appear here.', revGhost: 'No reviews yet. Once customers leave reviews on your Google Business Profile, the average rating and latest reviews will list here automatically.', revBtn: 'Leave a Google review', revSample: 'Sample slot — no real reviews',
      qrT: 'QR business card & digital menu', qrS: 'Scan with a phone to open the card or menu page.', qr1: 'Business card (vCard)', qr2: 'This page / menu', dl: 'Download QR (SVG)',
      chatName: 'Ümit\'s assistant', chatSub: 'AI assistant · demo', chatNote: 'Demo assistant — answers with scripted flows. On the live site it is trained for Ümit.',
      hi: 'Hello! I\'m Ümit\'s digital assistant. How can I help?',
      o_menu: 'Menu & services', o_event: 'Event quote', o_book: 'Booking', o_collab: 'Collaboration', o_contact: 'Contact',
      a_menu: 'Ümit studied Culinary Arts (modern cuisine, pastry and international cuisines). He prepares event menus, tasting tables, coffee/barista service and menu consulting. See the Menu section for details.',
      q_ppl: 'How many guests are you planning for?', p1: '10–30 guests', p2: '30–80 guests', p3: '80+ guests',
      q_type: 'What kind of table do you have in mind?', q_when: 'When?', w1: 'This month', w2: 'Next month', w3: 'Not decided yet',
      sum: 'Here is your request summary:', wa: 'Send on WhatsApp', toForm: 'Move to form', again: 'Start over',
      a_book: 'Pick an available day and time in the Booking section; your confirmation code is instant.',
      a_collab: 'Through his entrepreneurial side, Ümit is open to collaborations under Redna Hub. Leave a short note and he will get back to you.',
      a_contact: 'WhatsApp is the fastest way. You can also leave a request in the form and get a tracking number.', goBook: 'Go to booking', goForm: 'Go to form', goCalc: 'Go to calculator',
      sent: 'Summary moved to the form. Send it below to get a tracking number.', waMsg: 'Hello, I am writing from the website.',
      waT: 'WhatsApp assistant', waS: 'Your message opens pre-written.', waB: 'Chat on WhatsApp', waPre: 'Hello Ümit, I found your website. I would like info about an event / menu.',
      days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      printT: 'Event summary — sample calculation'
    }
  };
  var t = function (k) { return D[lang][k]; };
  var fmt = function (n) { return Math.round(n / 50) * 50; };
  var tl = function (n) { return n.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') + ' ₺'; };
  var waLink = function (txt) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt); };

  /* ---------- hesaplayıcı ---------- */
  var calc = { g: 40, m: 0, s: 1, d: '' };
  var MP = [[650, 900], [450, 650], [350, 520], [300, 450]], SM = [0.8, 1, 1.25];
  function calcOut() {
    var m = MP[calc.m], f = SM[calc.s], g = calc.g, dc = 1, notes = [];
    if (g > 100) { dc = .85; notes.push(t('disc')); } else if (g > 50) { dc = .92; notes.push(t('disc')); }
    var wk = 1;
    if (calc.d) { var dd = new Date(calc.d).getDay(); if (dd === 0 || dd === 6) { wk = 1.1; notes.push(t('weekend')); } }
    var lo = fmt(m[0] * f * dc * wk), hi = fmt(m[1] * f * dc * wk);
    return { lo: lo, hi: hi, tlo: lo * g, thi: hi * g, notes: notes };
  }
  function calcText() {
    var o = calcOut();
    return t('calcT') + ': ' + calc.g + ' ' + t('guests').toLowerCase() + ', ' + t('m' + (calc.m + 1)) + ', ' + t('s' + (calc.s + 1)) + (calc.d ? ', ' + calc.d : '') + ' → ' + tl(o.tlo) + ' – ' + tl(o.thi) + ' (' + t('est').toLowerCase() + ')';
  }
  function renderCalc(el) {
    var o = calcOut();
    var today = new Date().toISOString().slice(0, 10);
    el.innerHTML = '<div class="card"><h3>' + t('calcT') + '</h3><p class="sub">' + t('calcS') + '</p>' +
      '<div class="fld"><label for="uc-g">' + t('guests') + ': <b id="uc-gv">' + calc.g + '</b></label><input id="uc-g" type="range" min="4" max="250" value="' + calc.g + '"><div class="rng"><span>4</span><span>250</span></div></div>' +
      '<div class="fld"><label>' + t('menu') + '</label><div class="seg" data-k="m">' + [1, 2, 3, 4].map(function (i) { return '<button type="button" aria-pressed="' + (calc.m === i - 1) + '" data-v="' + (i - 1) + '">' + t('m' + i) + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld"><label>' + t('svc') + '</label><div class="seg" data-k="s">' + [1, 2, 3].map(function (i) { return '<button type="button" aria-pressed="' + (calc.s === i - 1) + '" data-v="' + (i - 1) + '">' + t('s' + i) + '</button>'; }).join('') + '</div></div>' +
      '<div class="fld"><label for="uc-d">' + t('date') + '</label><input id="uc-d" type="date" min="' + today + '" value="' + calc.d + '"></div>' +
      '<div class="res" aria-live="polite"><div style="font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mu)">' + t('est') + ' · ' + t('perP') + '</div><div class="big">' + tl(o.lo) + ' – ' + tl(o.hi) + '</div>' +
      '<div class="kv" style="margin-top:.8rem"><span>' + t('total') + '</span><b>' + tl(o.tlo) + ' – ' + tl(o.thi) + '</b></div>' +
      (o.notes.length ? '<small>' + o.notes.join(' · ') + '</small>' : '') + '<small>' + t('demoNote') + '</small></div>' +
      '<div class="btns"><button class="btn" type="button" id="uc-pdf">' + t('pdf') + '</button><a class="btn ghost" target="_blank" rel="noopener" href="' + waLink(calcText()) + '">' + t('send') + '</a></div></div>';
    $('#uc-g', el).oninput = function (e) { calc.g = +e.target.value; $('#uc-gv', el).textContent = calc.g; rerenderRes(el); };
    $('#uc-d', el).onchange = function (e) { calc.d = e.target.value; renderCalc(el); };
    $$('.seg', el).forEach(function (sg) { $$('button', sg).forEach(function (b) { b.onclick = function () { calc[sg.dataset.k] = +b.dataset.v; renderCalc(el); }; }); });
    $('#uc-pdf', el).onclick = function () {
      var w = window.open('', '_blank'); if (!w) return;
      w.document.write('<html><head><title>' + t('printT') + '</title><style>body{font:16px system-ui;padding:40px;max-width:640px;margin:auto}h1{font-size:24px}td{padding:8px 0;border-bottom:1px solid #ddd}small{color:#777}</style></head><body><h1>Ümit Kavi — ' + t('printT') + '</h1><table width="100%"><tr><td>' + t('guests') + '</td><td>' + calc.g + '</td></tr><tr><td>' + t('menu') + '</td><td>' + t('m' + (calc.m + 1)) + '</td></tr><tr><td>' + t('svc') + '</td><td>' + t('s' + (calc.s + 1)) + '</td></tr><tr><td>' + t('date') + '</td><td>' + (calc.d || '—') + '</td></tr><tr><td>' + t('perP') + '</td><td>' + tl(o.lo) + ' – ' + tl(o.hi) + '</td></tr><tr><td><b>' + t('total') + '</b></td><td><b>' + tl(o.tlo) + ' – ' + tl(o.thi) + '</b></td></tr></table><p><small>' + t('demoNote') + '</small></p><script>setTimeout(function(){print()},300)<\/script></body></html>');
      w.document.close();
    };
  }
  function rerenderRes(el) { var o = calcOut(); var r = $('.res', el); r.querySelector('.big').textContent = tl(o.lo) + ' – ' + tl(o.hi); r.querySelector('.kv b').textContent = tl(o.tlo) + ' – ' + tl(o.thi); }

  /* ---------- randevu ---------- */
  var _n = new Date(); if (_n.getDate() > 22) _n = new Date(_n.getFullYear(), _n.getMonth() + 1, 1);
  var book = { ty: 0, y: _n.getFullYear(), mo: _n.getMonth(), day: '', slot: '', done: null };
  var SLOTS = ['10:00', '11:30', '13:00', '14:30', '16:00', '18:30'];
  var hash = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
  var dayState = function (dt) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    if (dt < now) return 0; if (dt.getDay() === 1) return 0;
    var k = dt.toISOString().slice(0, 10); if (hash(k) % 6 === 0) return 0; return 1;
  };
  var slotFull = function (k, s) { return hash(k + s) % 4 === 0; };
  function renderBook(el) {
    var b = book;
    if (b.done) {
      el.innerHTML = '<div class="card"><div class="ok-box" role="status"><h3>' + t('booked') + '</h3><p>' + esc(b.done.type) + ' · ' + b.done.day + ' · ' + b.done.slot + '</p><p>' + t('code') + ': <span class="code">' + b.done.code + '</span></p><div class="btns"><button class="btn" id="ub-ics" type="button">' + t('ics') + '</button><button class="btn ghost" id="ub-new" type="button">OK</button></div></div></div>';
      $('#ub-new', el).onclick = function () { book.done = null; book.day = ''; book.slot = ''; renderBook(el); };
      $('#ub-ics', el).onclick = function () {
        var d = b.done.day.replace(/-/g, ''), tm = b.done.slot.replace(':', '') + '00';
        var ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:' + d + 'T' + tm + '\r\nSUMMARY:Ümit Kavi — ' + b.done.type + '\r\nDESCRIPTION:' + b.done.code + '\r\nEND:VEVENT\r\nEND:VCALENDAR';
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'randevu.ics'; a.click();
      };
      return;
    }
    var first = new Date(b.y, b.mo, 1), lead = (first.getDay() + 6) % 7, n = new Date(b.y, b.mo + 1, 0).getDate();
    var cells = t('days').map(function (d) { return '<div class="h">' + d + '</div>'; }).join('');
    for (var i = 0; i < lead; i++) cells += '<span></span>';
    for (var d = 1; d <= n; d++) {
      var dt = new Date(b.y, b.mo, d), k = b.y + '-' + String(b.mo + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'), ok = dayState(dt);
      cells += '<button type="button" ' + (ok ? 'class="ok" data-d="' + k + '"' : 'disabled') + ' aria-pressed="' + (b.day === k) + '" aria-label="' + d + ' ' + t('months')[b.mo] + '">' + d + '</button>';
    }
    var slots = b.day ? '<div class="slots">' + SLOTS.map(function (s) { var f = slotFull(b.day, s); return '<button type="button" ' + (f ? 'disabled title="' + t('full') + '"' : 'data-s="' + s + '"') + ' aria-pressed="' + (b.slot === s) + '">' + s + '</button>'; }).join('') + '</div>' : '<p class="sub" style="margin-top:1rem">' + t('pickDay') + ' · ' + t('closed') + '</p>';
    el.innerHTML = '<div class="card"><h3>' + t('bookT') + '</h3><p class="sub">' + t('bookS') + '</p>' +
      '<div class="seg" style="margin-bottom:1rem">' + [1, 2, 3].map(function (i) { return '<button type="button" data-t="' + (i - 1) + '" aria-pressed="' + (b.ty === i - 1) + '">' + t('bt' + i) + '</button>'; }).join('') + '</div>' +
      '<div class="calhd"><button type="button" id="ub-p" aria-label="prev">‹</button><b>' + t('months')[b.mo] + ' ' + b.y + '</b><button type="button" id="ub-n" aria-label="next">›</button></div><div class="cal">' + cells + '</div>' + slots +
      (b.slot ? '<div class="row" style="margin-top:1rem"><div class="fld"><label for="ub-nm">' + t('name') + '</label><input id="ub-nm" autocomplete="name"></div><div class="fld"><label for="ub-ph">' + t('phone') + '</label><input id="ub-ph" type="tel" autocomplete="tel"></div></div><button class="btn" id="ub-ok" type="button">' + t('confirm') + '</button><p class="sub" id="ub-er" style="color:#e5484d;margin-top:.5rem"></p>' : '') + '</div>';
    $$('[data-t]', el).forEach(function (x) { x.onclick = function () { b.ty = +x.dataset.t; renderBook(el); }; });
    $('#ub-p', el).onclick = function () { b.mo--; if (b.mo < 0) { b.mo = 11; b.y--; } renderBook(el); };
    $('#ub-n', el).onclick = function () { b.mo++; if (b.mo > 11) { b.mo = 0; b.y++; } renderBook(el); };
    $$('[data-d]', el).forEach(function (x) { x.onclick = function () { b.day = x.dataset.d; b.slot = ''; renderBook(el); }; });
    $$('[data-s]', el).forEach(function (x) { x.onclick = function () { b.slot = x.dataset.s; renderBook(el); var f = $('#ub-nm', el); if (f) f.focus(); }; });
    var ok = $('#ub-ok', el);
    if (ok) ok.onclick = function () {
      var nm = $('#ub-nm', el).value.trim(), ph = $('#ub-ph', el).value.trim();
      if (nm.length < 2 || ph.replace(/\D/g, '').length < 7) { $('#ub-er', el).textContent = t('needN'); return; }
      var code = 'RZ-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      b.done = { type: t('bt' + (b.ty + 1)), day: b.day, slot: b.slot, code: code, name: nm };
      var all = store.get('uk_book', []); all.push(b.done); store.set('uk_book', all); renderBook(el);
    };
  }

  /* ---------- lead / CRM ---------- */
  var lead = { done: null };
  function renderLead(el, pre) {
    var q = store.get('uk_leads', []);
    var crm = '<div class="crm" aria-label="CRM"><div class="t"><span>' + t('crmT') + '</span><span>' + q.length + '</span></div>' + (q.slice(-3).reverse().map(function (l) { return '<div class="r"><b>' + esc(l.name) + '</b><span>' + esc(l.topic) + '</span><span class="pill">' + t('newS') + ' · ' + l.id + '</span></div>'; }).join('') || '<div class="r"><span style="grid-column:1/-1;color:var(--mu)">—</span></div>') + '</div><p class="sub" style="margin-top:.6rem;font-size:.8rem">' + t('crmNote') + '</p>';
    if (lead.done) {
      el.innerHTML = '<div class="card"><div class="ok-box" role="status"><h3>' + t('got') + '</h3><p>' + t('track') + ': <span class="code">' + lead.done + '</span></p><button class="btn ghost" id="ul-new" type="button">OK</button></div>' + crm + '</div>';
      $('#ul-new', el).onclick = function () { lead.done = null; renderLead(el); }; return;
    }
    var prev = (pre !== undefined ? pre : (lead.pre || ''));
    el.innerHTML = '<div class="card"><h3>' + t('leadT') + '</h3><p class="sub">' + t('leadS') + '</p><form novalidate id="ul-f"><div class="row"><div class="fld"><label for="ul-n">' + t('name') + '</label><input id="ul-n" autocomplete="name" required></div><div class="fld"><label for="ul-p">' + t('phone') + '</label><input id="ul-p" type="tel" autocomplete="tel" required></div></div>' +
      '<div class="fld"><label for="ul-t">' + t('topic') + '</label><select id="ul-t">' + t('topicOpts').map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select></div>' +
      '<div class="fld"><label for="ul-m">' + t('msg') + '</label><textarea id="ul-m">' + esc(prev) + '</textarea></div><button class="btn" type="submit">' + t('submit') + '</button><p class="sub" id="ul-e" style="color:#e5484d;margin:.6rem 0 0"></p></form>' + crm + '</div>';
    $('#ul-f', el).onsubmit = function (e) {
      e.preventDefault();
      var nm = $('#ul-n', el).value.trim(), ph = $('#ul-p', el).value.trim();
      if (nm.length < 2 || ph.replace(/\D/g, '').length < 7) { $('#ul-e', el).textContent = t('needN'); return; }
      var id = 'UK-' + new Date().toISOString().slice(2, 7).replace('-', '') + '-' + String(Math.floor(1000 + Math.random() * 9000));
      var arr = store.get('uk_leads', []); arr.push({ id: id, name: nm, topic: $('#ul-t', el).value, msg: $('#ul-m', el).value }); store.set('uk_leads', arr);
      lead.done = id; lead.pre = ''; renderLead(el);
    };
  }

  /* ---------- yorum widget ---------- */
  function renderRev(el) {
    el.innerHTML = '<div class="card"><span class="badge">' + t('revSample') + '</span><h3 style="margin-top:.8rem">' + t('revT') + '</h3><div class="stars" aria-label="5">' + '☆☆☆☆☆'.split('').map(function () { return '<span aria-hidden="true">☆</span>'; }).join('') + '</div><p class="sub">' + t('revS') + '</p><div class="ghostrev">' + t('revGhost') + '</div><div class="btns"><a class="btn ghost" href="#" onclick="return false" aria-disabled="true">' + t('revBtn') + ' ↗</a></div></div>';
  }

  /* ---------- QR ---------- */
  var qrMode = 0;
  function vcard() { return 'BEGIN:VCARD\nVERSION:3.0\nFN:Ümit Kavi\nTITLE:Aşçı Yardımcısı · Founder Redna Hub\nTEL:+90 5XX XXX XX XX\nEMAIL:ornek@example.com\nADR:;;;Maltepe;İstanbul;;TR\nURL:' + location.href.split('#')[0] + '\nEND:VCARD'; }
  function renderQR(el) {
    el.innerHTML = '<div class="card"><h3>' + t('qrT') + '</h3><p class="sub">' + t('qrS') + '</p><div class="seg"><button type="button" aria-pressed="' + (qrMode === 0) + '" data-q="0">' + t('qr1') + '</button><button type="button" aria-pressed="' + (qrMode === 1) + '" data-q="1">' + t('qr2') + '</button></div><div class="qrbox" id="uq-box" role="img" aria-label="QR"></div><div class="btns" style="justify-content:center"><button class="btn ghost" id="uq-dl" type="button">' + t('dl') + '</button></div></div>';
    var draw = function () {
      var box = $('#uq-box', el);
      if (!window.qrcode) { box.textContent = 'QR…'; return setTimeout(draw, 400); }
      var q = window.qrcode(0, 'M'); q.addData(qrMode === 0 ? vcard() : location.href.split('#')[0]); q.make(); box.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    };
    draw();
    $$('[data-q]', el).forEach(function (b) { b.onclick = function () { qrMode = +b.dataset.q; renderQR(el); }; });
    $('#uq-dl', el).onclick = function () { var s = $('#uq-box svg', el); if (!s) return; var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([s.outerHTML], { type: 'image/svg+xml' })); a.download = 'umit-kavi-qr.svg'; a.click(); };
  }

  /* ---------- WhatsApp ---------- */
  function renderWA(el) {
    el.innerHTML = '<div class="card"><h3>' + t('waT') + '</h3><p class="sub">' + t('waS') + '</p><div class="ghostrev" style="margin-top:0">“' + t('waPre') + '”</div><div class="btns"><a class="btn" target="_blank" rel="noopener" href="' + waLink(t('waPre')) + '">' + t('waB') + ' ↗</a></div><p class="sub" style="font-size:.78rem;margin:.8rem 0 0">' + (lang === 'tr' ? 'Numara yer tutucudur; yayında Ümit\'in numarası tanımlanır.' : 'Number is a placeholder; Ümit\'s real number is set at launch.') + '</p></div>';
  }

  /* ---------- sohbet ---------- */
  var chat = { open: false, st: {}, started: false };
  function mountChat() {
    var fab = document.createElement('button'); fab.id = 'uk-chat-fab'; fab.setAttribute('aria-label', 'AI'); fab.innerHTML = '<span class="dot"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/></svg>';
    var box = document.createElement('div'); box.id = 'uk-chat'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'AI');
    document.body.appendChild(box); document.body.appendChild(fab);
    function frame() { box.innerHTML = '<header><div class="av">Ü</div><div><b>' + t('chatName') + '</b><span>' + t('chatSub') + '</span></div><button type="button" aria-label="close">×</button></header><div class="msgs" aria-live="polite"></div><div class="qr"></div><div class="note">' + t('chatNote') + '</div>'; $('header button', box).onclick = toggle; }
    var msgs = function () { return $('.msgs', box); }, qr = function () { return $('.qr', box); };
    function say(txt, who) { var m = document.createElement('div'); m.className = 'm ' + (who || 'b'); m.textContent = txt; msgs().appendChild(m); msgs().scrollTop = 1e6; }
    function bot(txt, cb, ms) {
      qr().innerHTML = ''; var ty = document.createElement('div'); ty.className = 'm b typing'; ty.innerHTML = '<i></i><i></i><i></i>'; msgs().appendChild(ty); msgs().scrollTop = 1e6;
      setTimeout(function () { ty.remove(); say(txt); cb && cb(); }, ms || 650);
    }
    function opts(list) { var q = qr(); q.innerHTML = ''; list.forEach(function (o) { var b; if (o.href) { b = document.createElement('a'); b.href = o.href; b.target = '_blank'; b.rel = 'noopener'; } else { b = document.createElement('button'); b.type = 'button'; b.onclick = function () { say(o.l, 'u'); o.f(); }; } b.textContent = o.l; q.appendChild(b); }); }
    function go(sel) { var e = $(sel); if (e && window.UK && window.UK.scrollTo) window.UK.scrollTo(e); else if (e) e.scrollIntoView({ behavior: 'smooth' }); }
    function menu() {
      opts([{ l: t('o_menu'), f: function () { bot(t('a_menu'), menu); go('#menu'); } }, { l: t('o_event'), f: ev1 }, { l: t('o_book'), f: function () { bot(t('a_book'), function () { opts([{ l: t('goBook'), f: function () { go('#mod-book'); toggle(); } }, { l: '←', f: menu }]); }); } },
        { l: t('o_collab'), f: function () { bot(t('a_collab'), function () { opts([{ l: t('goForm'), f: function () { go('#mod-lead'); toggle(); } }, { l: '←', f: menu }]); }); } },
        { l: t('o_contact'), f: function () { bot(t('a_contact'), function () { opts([{ l: t('wa'), href: waLink(t('waPre')) }, { l: t('goForm'), f: function () { go('#mod-lead'); toggle(); } }]); }); } }]);
    }
    function ev1() { bot(t('q_ppl'), function () { opts([1, 2, 3].map(function (i) { return { l: t('p' + i), f: function () { chat.st.p = t('p' + i); ev2(); } }; })); }); }
    function ev2() { bot(t('q_type'), function () { opts([1, 2, 3, 4].map(function (i) { return { l: t('m' + i), f: function () { chat.st.m = t('m' + i); ev3(); } }; })); }); }
    function ev3() { bot(t('q_when'), function () { opts([1, 2, 3].map(function (i) { return { l: t('w' + i), f: function () { chat.st.w = t('w' + i); ev4(); } }; })); }); }
    function ev4() {
      var s = chat.st, txt = (lang === 'tr' ? 'Etkinlik talebi: ' : 'Event request: ') + s.p + ' · ' + s.m + ' · ' + s.w;
      bot(t('sum') + '\n• ' + s.p + '\n• ' + s.m + '\n• ' + s.w, function () {
        opts([{ l: t('wa'), href: waLink(txt) }, { l: t('toForm'), f: function () { lead.pre = txt; var el = $('#mod-lead'); if (el) renderLead(el, txt); bot(t('sent'), function () { go('#mod-lead'); }); opts([{ l: t('again'), f: menu }]); } }, { l: t('goCalc'), f: function () { go('#mod-calc'); toggle(); } }, { l: t('again'), f: menu }]);
      }, 900);
    }
    function start() { if (chat.started) return; chat.started = true; frame(); bot(t('hi'), menu, 500); }
    function toggle() { chat.open = !chat.open; box.classList.toggle('open', chat.open); if (chat.open) start(); fab.querySelector('.dot').style.display = chat.open ? 'none' : ''; }
    fab.onclick = toggle;
    window.UK_chatReset = function () { chat.started = false; if (chat.open) start(); };
    window.UK_chatOpen = function () { if (!chat.open) toggle(); };
  }

  /* ---------- dil + mount ---------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-tr]').forEach(function (e) { e.innerHTML = lang === 'en' && e.hasAttribute('data-en') ? e.getAttribute('data-en') : e.getAttribute('data-tr'); });
    $$('[data-ph-en]').forEach(function (e) { e.placeholder = lang === 'en' ? e.dataset.phEn : e.dataset.phTr; });
    $$('.uk-lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === lang); });
    $$('[data-wa]').forEach(function (a) { a.href = waLink(lang === 'en' ? a.dataset.wa : (a.dataset.waTr || a.dataset.wa)); });
    mountAll();
    if (document.title && CFG.title) document.title = lang === 'en' && CFG.titleEn ? CFG.titleEn : CFG.title;
  }
  function mountAll() {
    [['#mod-calc', renderCalc], ['#mod-book', renderBook], ['#mod-lead', renderLead], ['#mod-rev', renderRev], ['#mod-qr', renderQR], ['#mod-wa', renderWA]].forEach(function (p) { var el = $(p[0]); if (el) { el.classList.add('uk'); p[1](el); } });
  }
  function init() {
    $$('[data-tr]').length || $$('[data-en]').forEach(function (e) { e.setAttribute('data-tr', e.innerHTML); });
    $$('[data-en]').forEach(function (e) { if (!e.hasAttribute('data-tr')) e.setAttribute('data-tr', e.innerHTML); });
    $$('.uk-lang').forEach(function (g) { g.innerHTML = '<button type="button" data-l="tr" aria-pressed="false">TR</button><button type="button" data-l="en" aria-pressed="false">EN</button>'; $$('button', g).forEach(function (b) { b.onclick = function () { lang = b.dataset.l; try { localStorage.setItem('uk_lang', lang); } catch (e) {} applyLang(); window.UK_chatReset && window.UK_chatReset(); if (window.UK.onLang) window.UK.onLang(lang); }; }); });
    var wm = document.createElement('div'); wm.id = 'uk-wm-badge'; wm.textContent = 'Dijitabela · Örnek tasarım'; document.body.appendChild(wm);
    var wd = document.createElement('div'); wd.id = 'uk-wm-diag'; wd.textContent = 'DIJITABELA ÖRNEK'; wd.setAttribute('aria-hidden', 'true'); document.body.appendChild(wd);
    mountChat(); applyLang();
  }
  window.UK = { init: init, lang: function () { return lang; }, scrollTo: null, onLang: null, waLink: waLink };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); }); else setTimeout(init, 0);
})();
