/* Dijitabela arac kutusu: yumusak kaydirma (Lenis) + giris animasyonu (GSAP ScrollTrigger).
   Kullanim: sayfa sonuna <script src="/ornek/_dijitabela/arac/hizli.js" defer></script>
   Animasyon istenen ogelere data-giris ekle (ya da sayfadaki section/h2/.kart ogeleri otomatik). Hareket azaltma tercihine saygi duyar. */
(function () {
  var d = document, base = (d.currentScript && d.currentScript.src || '').replace(/hizli\.js.*$/, '');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function y(src) { return new Promise(function (ok) { var s = d.createElement('script'); s.src = base + src; s.onload = ok; s.onerror = ok; d.head.appendChild(s); }); }
  function basla() {
    Promise.all([y('gsap.min.js'), y('lenis.min.js')]).then(function () { return y('ScrollTrigger.min.js'); }).then(function () {
      if (!window.gsap || !window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);
      if (window.Lenis) {
        var l = new Lenis({ lerp: 0.1 });
        l.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { l.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
      }
      var hedef = d.querySelectorAll('[data-giris], main section h2, main section h3, .kart, .card');
      hedef.forEach(function (e) {
        gsap.from(e, { y: 28, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: e, start: 'top 88%', once: true } });
      });
    });
  }
  /* ilk boyamayi engellememek icin bos zamanda yukle */
  (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(basla);
})();
