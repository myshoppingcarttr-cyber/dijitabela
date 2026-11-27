/* Dijitabela · "Bu yalnızca bir demodur" bandı — 4 tasarımda ortak, kapatılabilir, TR/EN. */
(function () {
  'use strict';
  var T = {
    tr: ['Yalnızca demo.', 'Gerçek sitenizde sizin kendi fotoğraf, logo ve tasarımlarınız kullanılır.'],
    en: ['Demo only.', 'Your real site will use your own photos, logo and designs.']
  };
  var KEY = 'uk_demo_x';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var css = document.createElement('style');
  css.textContent = '#uk-demo{position:fixed;left:50%;bottom:16px;transform:translate(-50%,14px);z-index:7600;max-width:min(94vw,640px);display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:99px;background:rgba(14,12,10,.82);color:#f4ede0;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:500 12.5px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 14px 40px -12px rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .6s,transform .6s}' +
    '#uk-demo.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}@media(max-width:640px){#uk-demo.on{transform:none}}' +
    '#uk-demo b{color:#ffd58a;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:11px;white-space:nowrap}' +
    '#uk-demo button{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:inherit;cursor:pointer;font-size:16px;line-height:1;display:grid;place-items:center}' +
    '#uk-demo button:hover{background:rgba(255,255,255,.12)}' +
    '@media(max-width:640px){#uk-demo{left:12px;right:96px;bottom:50px;transform:translateY(14px);max-width:none;font-size:11.5px;padding:7px 7px 7px 13px;gap:9px;border-radius:18px}#uk-demo b{display:block;margin-bottom:1px}}';
  document.head.appendChild(css);
  var el = document.createElement('div'); el.id = 'uk-demo'; el.setAttribute('role', 'note');
  el.innerHTML = '<span><b></b> <span class="m"></span></span><button type="button" aria-label="Kapat / Close">×</button>';
  document.body.appendChild(el);
  function lang() { var l = document.documentElement.lang; if (l === 'en' || l === 'tr') return l; try { return localStorage.getItem('uk_lang') || 'tr'; } catch (e) { return 'tr'; } }
  function paint() { var t = T[lang()] || T.tr; el.querySelector('b').textContent = t[0]; el.querySelector('.m').textContent = t[1]; }
  paint(); new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  el.querySelector('button').onclick = function () { el.classList.remove('on'); try { sessionStorage.setItem(KEY, '1'); } catch (e) {} setTimeout(function () { el.remove(); }, 700); };
  setTimeout(function () { el.classList.add('on'); }, 3200);
})();
