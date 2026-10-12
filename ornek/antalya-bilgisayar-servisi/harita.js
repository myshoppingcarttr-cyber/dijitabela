/* Antalya şematik hizmet haritası (SVG, 1000×600). İlçe sınırları ve mahalle konumları YAKLAŞIKTIR (şematik). */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var ILCE = {
    konyaalti: "M0,318 L300,292 L342,350 L328,362 L320,448 C210,478 90,492 0,505 Z",
    dosemealti: "M236,36 L520,26 L548,150 L334,192 L250,140 Z",
    kepez: "M334,192 L548,150 L626,192 L604,290 L522,352 L342,350 L300,292 Z",
    muratpasa: "M342,350 L522,352 L604,290 L700,362 L760,462 C700,488 640,486 560,474 C470,462 400,428 320,448 L328,362 Z",
    aksu: "M604,290 L626,192 L764,190 L822,300 L832,440 C805,448 782,455 760,462 L700,362 Z",
    serik: "M764,190 L1000,158 L1000,478 C930,462 870,438 832,440 L822,300 Z"
  };
  var ETK = { konyaalti: [150, 360, "KONYAALTI"], dosemealti: [390, 110, "DÖŞEMEALTI"], kepez: [470, 222, "KEPEZ"], muratpasa: [612, 372, "MURATPAŞA"], aksu: [730, 260, "AKSU"], serik: [900, 250, "SERİK"] };
  var KIYI = "M0,505 C90,492 210,478 320,448 C400,428 470,462 560,474 C640,486 700,488 760,462 C805,448 870,438 932,462 C960,470 985,476 1000,478";
  function el(t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }

  window.ABSHarita = function (svg, o) {
    o = o || {};
    svg.setAttribute("viewBox", o.viewBox || "0 0 1000 600"); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Antalya hizmet bölgeleri şematik haritası");
    svg.classList.add("harita"); svg.innerHTML = "";
    var defs = el("defs", {}, svg);
    var g1 = el("linearGradient", { id: "hdeniz" + (o.id || ""), x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: 0, "stop-color": "var(--h-deniz1)" }, g1); el("stop", { offset: 1, "stop-color": "var(--h-deniz2)" }, g1);
    var pat = el("pattern", { id: "hnok" + (o.id || ""), width: 14, height: 14, patternUnits: "userSpaceOnUse" }, defs);
    el("circle", { cx: 2, cy: 2, r: 1, fill: "var(--h-nokta)" }, pat);
    el("rect", { x: 0, y: 0, width: 1000, height: 600, fill: "var(--h-kara)" }, svg);
    el("rect", { x: 0, y: 0, width: 1000, height: 600, fill: "url(#hnok" + (o.id || "") + ")" }, svg);
    // izohips süsü (Beydağları yönü)
    var iz = el("g", { class: "h-iz" }, svg);
    for (var i = 0; i < 6; i++) el("path", { d: "M-20," + (120 + i * 34) + " C80," + (60 + i * 30) + " 160," + (180 + i * 26) + " 260," + (40 + i * 40), fill: "none" }, iz);
    var ilce = el("g", { class: "h-ilce" }, svg), nesne = {};
    Object.keys(ILCE).forEach(function (k) {
      var p = el("path", { d: ILCE[k], "data-b": k }, ilce); nesne[k] = p;
      if (o.bolgeTik) { p.style.cursor = "pointer"; p.addEventListener("click", function () { o.bolgeTik(k); }); }
    });
    el("path", { d: KIYI + " L1000,600 L0,600 Z", fill: "url(#hdeniz" + (o.id || "") + ")" }, svg);
    el("path", { d: KIYI, class: "h-kiyi", fill: "none" }, svg);
    // ana yollar (şematik)
    var yol = el("g", { class: "h-yol" }, svg);
    ["M20,470 C200,440 320,410 452,362 C560,330 700,340 980,300", "M452,362 C440,280 420,200 400,60", "M452,362 C520,300 580,240 640,180"].forEach(function (d) { el("path", { d: d, fill: "none" }, yol); });
    var etk = el("g", { class: "h-etk" }, svg);
    Object.keys(ETK).forEach(function (k) { var t = el("text", { x: ETK[k][0], y: ETK[k][1], "text-anchor": "middle" }, etk); t.textContent = ETK[k][2]; });
    var dz = el("text", { x: 600, y: 560, class: "h-deniz-yazi", "text-anchor": "middle" }, svg); dz.textContent = "AKDENİZ";
    var mah = el("g", { class: "h-mah" }, svg), mahN = {};
    if (o.mahalle !== false) ABS.mahalleler.forEach(function (m) {
      var g = el("g", { class: "h-m", "data-ad": m.ad, transform: "translate(" + m.x + "," + m.y + ")" }, mah);
      el("circle", { r: 13, class: "h-hit" }, g); el("circle", { r: 4.5 }, g);
      var t = el("text", { x: 8, y: -8 }, g); t.textContent = m.ad; mahN[m.ad] = g;
      if (o.mahalleTik) { g.style.cursor = "pointer"; g.addEventListener("click", function () { o.mahalleTik(m); }); }
    });
    var at = el("g", { class: "h-atolye", transform: "translate(" + ABS.atolye.x + "," + ABS.atolye.y + ")" }, svg);
    el("rect", { x: -11, y: -11, width: 22, height: 22, rx: 5 }, at);
    el("path", { d: "M-5,4 L-5,-2 L0,-6 L5,-2 L5,4 Z" }, at);
    var ust = el("g", { class: "h-ust" }, svg);
    return {
      svg: svg, ust: ust, el: el,
      bolge: function (k) { Object.keys(nesne).forEach(function (n) { nesne[n].classList.toggle("sec", n === k); }); },
      mahalle: function (ad) { Object.keys(mahN).forEach(function (n) { mahN[n].classList.toggle("sec", n === ad); }); },
      soluk: function (b) { Object.keys(mahN).forEach(function (n) { var m = ABS.mahalleler.find(function (x) { return x.ad === n; }); mahN[n].classList.toggle("soluk", !!b && m.b !== b); }); }
    };
  };
})();
