/* 3 Uygulama: sekmeli görünüm değiştirme (alt menü) + geçiş animasyonu. FAL.git() olaylarını da karşılar. */
(function () {
  "use strict";
  var MOD_GORUNUM = { "fal-gonder": "fal", "falcilar": "falcilar", "paketler": "jeton", "gecmis": "fallarim", "davet": "jeton", "burc-gunluk": "ana" };
  var AZ = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function goster(ad, kaydir) {
    var v = document.querySelector('.u-view[data-view="' + ad + '"]'); if (!v) return;
    document.querySelectorAll(".u-view").forEach(function (x) { x.hidden = x !== v; });
    document.querySelectorAll(".u-alt button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-git") === ad); });
    if (kaydir !== false) window.scrollTo(0, 0);
    try { history.replaceState(null, "", "#" + ad); } catch (e) {}
    if (window.gsap && !AZ) gsap.fromTo(v.children, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .5, stagger: .06, ease: "power2.out", clearProps: "transform,opacity,visibility" });
  }
  function basla() {
    document.querySelectorAll("[data-git]").forEach(function (b) { b.addEventListener("click", function () { goster(b.getAttribute("data-git")); }); });
    document.addEventListener("fal:git", function (e) { var g = MOD_GORUNUM[e.detail]; if (g) { e.preventDefault(); goster(g); } });
    var h = (location.hash || "").replace("#", ""); goster(document.querySelector('.u-view[data-view="' + h + '"]') ? h : "ana", false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
