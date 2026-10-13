/* 1 Gece: ScrollTrigger - adım çizgisi kaydırmayla dolar, hero fincanı hafif parallax. */
(function () {
  "use strict";
  function basla() {
    if (!window.gsap || !window.ScrollTrigger || /statik=1/.test(location.search)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", function () {
      gsap.to(".g-cizgi i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".g-adimlar", start: "top 80%", end: "bottom 55%", scrub: 0.6 } });
    });
    mm.add("(min-width: 861px)", function () {
      gsap.to(".g-fincan", { y: 70, ease: "none", scrollTrigger: { trigger: ".g-hero", start: "top top", end: "bottom top", scrub: true } });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
