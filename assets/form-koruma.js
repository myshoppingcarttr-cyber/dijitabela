/* Form koruması (ARGE-017): görünmez tuzak alan + gönderim süresi. Bot gönderimi sessizce yutulur. */
(function () {
  var SEC = "form#form, form#eks-form, form#eks-rapor";
  var gorulen = new WeakMap(), MIN_MS = 3000;
  function isle(f) {
    if (gorulen.has(f)) return;
    gorulen.set(f, Date.now());
    var d = document.createElement("div");
    d.setAttribute("aria-hidden", "true");
    d.style.cssText = "position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden";
    d.innerHTML = '<label>Bu alanı boş bırakın<input type="text" name="web_sitesi_2" value="" tabindex="-1" autocomplete="off"></label>';
    f.appendChild(d);
  }
  function tara(k) {
    if (k.matches && k.matches(SEC)) isle(k);
    if (k.querySelectorAll) k.querySelectorAll(SEC).forEach(isle);
  }
  function basla() {
    tara(document);
    new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) tara(n); }); }); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
  // yakalama aşamasında, sayfanın kendi gönderim işleyicisinden önce çalışır
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || !f.matches || !f.matches(SEC)) return;
    var tuzak = f.querySelector('input[name="web_sitesi_2"]'), t0 = gorulen.get(f);
    var bot = (tuzak && tuzak.value !== "") || (t0 && Date.now() - t0 < MIN_MS);
    if (bot) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
})();
