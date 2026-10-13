/* 2 Mistik: burç çarkı SVG çizimi + ScrollTrigger scrub ile dönüş. */
(function () {
  "use strict";
  function cark() {
    var svg = document.getElementById("m-cark"); if (!svg) return;
    var g = "", burclar = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"], i;
    g += '<circle cx="200" cy="200" r="196" fill="none" style="stroke:var(--altin)" stroke-width="1.5"/><circle cx="200" cy="200" r="150" fill="none" style="stroke:var(--altin)" stroke-width="1" stroke-dasharray="3 6"/><circle cx="200" cy="200" r="128" fill="none" style="stroke:var(--mor2)" stroke-width="1"/>';
    for (i = 0; i < 12; i++) {
      var a = (i * 30 - 90) * Math.PI / 180, x1 = 200 + 150 * Math.cos(a), y1 = 200 + 150 * Math.sin(a), x2 = 200 + 196 * Math.cos(a), y2 = 200 + 196 * Math.sin(a);
      g += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" style="stroke:var(--altin)" stroke-width="1"/>';
      var b = (i * 30 - 75) * Math.PI / 180, tx = 200 + 173 * Math.cos(b), ty = 200 + 173 * Math.sin(b);
      g += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" font-size="24" style="fill:var(--altin2)" transform="rotate(' + (i * 30 + 15) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')">' + burclar[i] + "︎</text>";
    }
    for (i = 0; i < 16; i++) { var c = i * 22.5 * Math.PI / 180; g += '<circle cx="' + (200 + 128 * Math.cos(c)).toFixed(1) + '" cy="' + (200 + 128 * Math.sin(c)).toFixed(1) + '" r="2.4" style="fill:var(--mor2)"/>'; }
    svg.innerHTML = '<g id="m-cark-g">' + g + "</g>";
  }
  function basla() {
    cark();
    if (!window.gsap || !window.ScrollTrigger || /statik=1/.test(location.search)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set("#m-cark-g", { svgOrigin: "200 200" });
    gsap.to("#m-cark-g", { rotation: 360, ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 } });
    gsap.to("#m-cark", { rotation: -360, transformOrigin: "50% 50%", duration: 120, ease: "none", repeat: -1 });
    gsap.from(".m-bas h1", { y: 40, autoAlpha: 0, duration: 1.1, ease: "power3.out" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
