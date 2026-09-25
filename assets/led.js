// ===== LED tabela: canvas üzerinde nokta vuruşlu kayan yazı (Dijitabela imzası) =====
// <canvas class="led" data-mesaj="DİJİTABELA|GOOGLE'DA BULUNUN"></canvas>
(function () {
  "use strict";
  // 5×7 harfler (# = yanan nokta). Türkçe işaretler üst/alt ek satırla çizilir.
  var G = {
    A: ".###.#...##...#######...##...##...#", B: "####.#...##...#####.#...##...#####.", C: ".###.#...##....#....#....#...#.###.",
    D: "####.#...##...##...##...##...#####.", E: "######....#....####.#....#....#####", F: "######....#....####.#....#....#....",
    G: ".###.#...##....#.####...##...#.####", H: "#...##...##...#######...##...##...#", I: ".###...#....#....#....#....#...###.",
    J: "..###...#....#....#....##..#..##...", K: "#...##..#.#.#..##...#.#..#..#.#...#", L: "#....#....#....#....#....#....#####",
    M: "#...###.###.#.##.#.##...##...##...#", N: "#...##...###..##.#.##..###...##...#", O: ".###.#...##...##...##...##...#.###.",
    P: "####.#...##...#####.#....#....#....", Q: ".###.#...##...##...##.#.##..#..##.#", R: "####.#...##...#####.#.#..#..#.#...#",
    S: ".#####....#.....###.....#....#####.", T: "#####..#....#....#....#....#....#..", U: "#...##...##...##...##...##...#.###.",
    V: "#...##...##...##...##...#.#.#...#..", W: "#...##...##...##.#.##.#.##.#.#.#.#.", X: "#...##...#.#.#...#...#.#.#...##...#",
    Y: "#...##...#.#.#...#....#....#....#..", Z: "#####....#...#...#...#...#....#####",
    "0": ".###.#...##..###.#.###..##...#.###.", "1": "..#...##....#....#....#....#...###.", "2": ".###.#...#....#...#...#...#...#####",
    "3": "####.....#....#.###.....#....#####.", "4": "...#...##..#.#.#..#.#####...#....#.", "5": "######....####.....#....##...#.###.",
    "6": ".###.#....#....####.#...##...#.###.", "7": "#####....#...#...#...#....#....#...", "8": ".###.#...##...#.###.#...##...#.###.",
    "9": ".###.#...##...#.####....#....#.###.", " ": ".".repeat(35), ".": ".".repeat(30) + "..#..", ",": ".".repeat(25) + "..#...#...",
    "'": "..#....#..." + ".".repeat(24), "!": "..#....#....#....#....#.........#..", "?": ".###.#...#....#...#...#.........#..",
    "-": ".".repeat(15) + ".###." + ".".repeat(15), ":": ".......#...............#...........", "·": ".".repeat(17) + "#" + ".".repeat(17),
    "+": ".......#....#..#####..#....#.......", "%": "##..###.#....#...#...#...#.##..##..", "/": "....#....#...#...#...#...#....#...."
  };
  var EK = { "İ": ["I", "ust", [2]], "Ö": ["O", "ust", [1, 3]], "Ü": ["U", "ust", [1, 3]], "Ğ": ["G", "ust", [1, 2, 3]], "Ç": ["C", "alt", [2]], "Ş": ["S", "alt", [2]] };

  // Bir metni 9 satırlık (1 üst + 7 gövde + 1 alt) sütun dizisine çevirir
  function sutunlar(metin) {
    var s = [];
    Array.from(metin.toLocaleUpperCase("tr")).forEach(function (ch) {
      var ek = EK[ch], tab = G[ek ? ek[0] : ch] || G["?"];
      for (var x = 0; x < 5; x++) {
        var col = [ek && ek[1] === "ust" && ek[2].indexOf(x) > -1];
        for (var y = 0; y < 7; y++) col.push(tab[y * 5 + x] === "#");
        col.push(ek && ek[1] === "alt" && ek[2].indexOf(x) > -1);
        s.push(col);
      }
      s.push([false, false, false, false, false, false, false, false, false]);  // harf arası
    });
    return s;
  }

  function kur(cv) {
    var mesajlar = (cv.dataset.mesaj || "DİJİTABELA").split("|");
    var bant = sutunlar("   " + mesajlar.join("   ·   ") + "   ·   ");
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ON = cv.dataset.on || "#FFB000", OFF = cv.dataset.off || "#262A31";
    var adim, r, genis, kay = 0, son = 0, gorunur = true;
    var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    function boyut() {
      var w = cv.clientWidth, h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      adim = (h * dpr) / 9; r = adim * 0.34; genis = Math.ceil((w * dpr) / adim);
      ciz();
    }
    function ciz() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      var bas = azHareket ? 0 : Math.floor(kay);
      var sabit = azHareket ? sutunlar(" " + mesajlar[0]) : null;
      for (var x = 0; x < genis; x++) {
        var col = sabit ? (sabit[x] || []) : bant[(bas + x) % bant.length];
        for (var y = 0; y < 9; y++) {
          ctx.fillStyle = col[y] ? ON : OFF;
          ctx.beginPath(); ctx.arc(x * adim + adim / 2, y * adim + adim / 2, r, 0, 6.2832); ctx.fill();
        }
      }
    }
    function dongu(t) {
      if (gorunur && !azHareket && t - son > 70) { kay += 1; son = t; ciz(); }
      requestAnimationFrame(dongu);
    }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { gorunur = e[0].isIntersecting; }).observe(cv);
    window.addEventListener("resize", boyut);
    boyut(); requestAnimationFrame(dongu);
  }
  // Tanıtım videosu gibi dışarıdan kullanım için: harf sütunları
  window.LED = { sutunlar: sutunlar };
  document.querySelectorAll("canvas.led").forEach(kur);
})();
