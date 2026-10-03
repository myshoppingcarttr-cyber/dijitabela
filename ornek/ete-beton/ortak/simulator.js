// Ete Beton · 3D Prekast Yapı Simülatörü (three.js r128)
// Ziyaretçi bina ölçülerini girer; prekast çift duvar panelleri ve filigran döşemeler kat kat yerine oturur.
// Geometri hesapları gerçektir (çevre, duvar ve döşeme alanı); panel ölçüsü ve sevkiyat katsayıları varsayımdır, Ete Beton tarafından güncellenir.
(function () {
  "use strict";
  var KATSAYI = { panelEn: 3.0, katYuk: 3.0, tirM2: 45, montajM2Gun: 120 }; // varsayım: panel 3 m genişlik, 1 tırda ~45 m² duvar, ekip başına günde ~120 m² montaj
  window.ETE_SIM_KATSAYI = KATSAYI;
  function kur(k) {
    var tuval = k.querySelector(".sim-tuval"), THREE = window.THREE;
    if (!THREE) { tuval.innerHTML = "<p style='padding:30px'>3D görünüm yüklenemedi.</p>"; return; }
    var W = tuval.clientWidth, H = tuval.clientHeight;
    var r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(2, window.devicePixelRatio)); r.setSize(W, H); r.shadowMap.enabled = true; tuval.appendChild(r.domElement);
    var sahne = new THREE.Scene(), kam = new THREE.PerspectiveCamera(40, W / H, .1, 2000);
    sahne.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, .75));
    var gun = new THREE.DirectionalLight(0xffffff, .85); gun.position.set(60, 90, 40); gun.castShadow = true; gun.shadow.mapSize.set(2048, 2048); gun.shadow.camera.left = -80; gun.shadow.camera.right = 80; gun.shadow.camera.top = 80; gun.shadow.camera.bottom = -80; sahne.add(gun);
    var zemin = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0xd9d4cc, roughness: 1 })); zemin.rotation.x = -Math.PI / 2; zemin.receiveShadow = true; sahne.add(zemin);
    var izgara = new THREE.GridHelper(400, 80, 0xbcb5aa, 0xcfc9bf); izgara.position.y = .01; sahne.add(izgara);
    var matDuvar = new THREE.MeshStandardMaterial({ color: 0xbfbcb6, roughness: .85 }), matDoseme = new THREE.MeshStandardMaterial({ color: 0xa9a59e, roughness: .9 }), matCam = new THREE.MeshStandardMaterial({ color: 0x5b7da0, roughness: .2, metalness: .3 }), matVurgu = new THREE.MeshStandardMaterial({ color: 0x8f1d22, roughness: .6 });
    var grup = new THREE.Group(); sahne.add(grup);
    var parcalar = [], aci = .8, egim = .55, uzak = 70, surukle = null;
    function kamera() { kam.position.set(Math.cos(aci) * uzak * Math.cos(egim), uzak * Math.sin(egim), Math.sin(aci) * uzak * Math.cos(egim)); kam.lookAt(0, 6, 0); }
    tuval.addEventListener("pointerdown", function (e) { surukle = [e.clientX, e.clientY, aci, egim]; tuval.setPointerCapture(e.pointerId); });
    tuval.addEventListener("pointermove", function (e) { if (!surukle) return; aci = surukle[2] + (e.clientX - surukle[0]) * .008; egim = Math.max(.15, Math.min(1.3, surukle[3] + (e.clientY - surukle[1]) * .006)); kamera(); });
    tuval.addEventListener("pointerup", function () { surukle = null; });
    tuval.addEventListener("wheel", function (e) { e.preventDefault(); uzak = Math.max(25, Math.min(220, uzak + e.deltaY * .05)); kamera(); }, { passive: false });

    function oku() { var v = function (s) { return +k.querySelector(s).value; }; return { L: v(".sim-l"), G: v(".sim-g"), kat: v(".sim-kat"), ic: v(".sim-ic"), pen: v(".sim-pen") }; }
    function insaEt() {
      var o = oku(); parcalar.forEach(function (p) { grup.remove(p.m); }); parcalar = [];
      var h = KATSAYI.katYuk, t = .3, pe = KATSAYI.panelEn, sira = 0;
      function panel(x, z, uzun, yon, kat, cam) {
        var g = new THREE.BoxGeometry(yon ? t : uzun - .06, h - .05, yon ? uzun - .06 : t), m = new THREE.Mesh(g, matDuvar); m.castShadow = true; m.receiveShadow = true;
        var hedefY = kat * h + h / 2; m.position.set(x, hedefY + 40, z); grup.add(m); parcalar.push({ m: m, y: hedefY, gecikme: sira++ * 40 });
        if (cam) { var c = new THREE.Mesh(new THREE.BoxGeometry(yon ? t + .02 : uzun * .45, h * .42, yon ? uzun * .45 : t + .02), matCam); m.add(c); c.position.y = .2; }
      }
      for (var kat = 0; kat < o.kat; kat++) {
        // dış duvarlar
        [[o.L, 0, -o.G / 2, false], [o.L, 0, o.G / 2, false], [o.G, -o.L / 2, 0, true], [o.G, o.L / 2, 0, true]].forEach(function (d) {
          var n = Math.max(1, Math.round(d[0] / pe)), u = d[0] / n;
          for (var i = 0; i < n; i++) { var off = -d[0] / 2 + u * (i + .5); panel(d[3] ? d[1] : off, d[3] ? off : d[2], u, d[3], kat, ((i * 7 + kat * 3) % 10) < o.pen / 10); }
        });
        // iç duvarlar (uzun kenara dik)
        var icSay = Math.round(o.L / 6 * o.ic / 50);
        for (var j = 1; j <= icSay; j++) { var x = -o.L / 2 + o.L * j / (icSay + 1), n2 = Math.max(1, Math.round(o.G / pe)), u2 = o.G / n2; for (var q = 0; q < n2; q++) panel(x, -o.G / 2 + u2 * (q + .5), u2, true, kat, false); }
        // filigran döşeme
        var nd = Math.max(1, Math.round(o.L / 2.5)), ud = o.L / nd;
        for (var s = 0; s < nd; s++) { var d2 = new THREE.Mesh(new THREE.BoxGeometry(ud - .05, .22, o.G + t), matDoseme); d2.castShadow = true; d2.receiveShadow = true; var yy = (kat + 1) * h; d2.position.set(-o.L / 2 + ud * (s + .5), yy + 40, 0); grup.add(d2); parcalar.push({ m: d2, y: yy, gecikme: sira++ * 40 }); }
      }
      // vinç simgesi (bordo kule)
      var vinc = new THREE.Mesh(new THREE.BoxGeometry(1, o.kat * h + 10, 1), matVurgu); vinc.position.set(o.L / 2 + 6, (o.kat * h + 10) / 2, -o.G / 2 - 4); vinc.castShadow = true; grup.add(vinc); parcalar.push({ m: vinc, y: vinc.position.y, gecikme: 0, sabit: true });
      var kol = new THREE.Mesh(new THREE.BoxGeometry(o.L + 14, .6, .6), matVurgu); kol.position.set(6, o.kat * h + 9.5, -o.G / 2 - 4); grup.add(kol); parcalar.push({ m: kol, y: kol.position.y, gecikme: 0, sabit: true });
      uzak = Math.max(40, Math.max(o.L, o.G, o.kat * h) * 1.9); kamera(); bas = performance.now();
      hesap(o);
    }
    function hesap(o) {
      var h = KATSAYI.katYuk, cevre = 2 * (o.L + o.G), disDuvar = cevre * h * o.kat * (1 - o.pen / 100 * .35), icSay = Math.round(o.L / 6 * o.ic / 50), icDuvar = icSay * o.G * h * o.kat, duvar = disDuvar + icDuvar, doseme = o.L * o.G * o.kat;
      var panelSay = Math.round(duvar / (KATSAYI.panelEn * h)), tir = Math.ceil((duvar + doseme * .6) / KATSAYI.tirM2), gun = Math.ceil((duvar + doseme) / KATSAYI.montajM2Gun);
      var f = function (n) { return Math.round(n).toLocaleString("tr-TR"); };
      k.querySelector(".sim-sonuc").innerHTML =
        "<div><b>" + f(o.L * o.G * o.kat) + " m²</b><span>toplam inşaat alanı</span></div>" +
        "<div><b>" + f(duvar) + " m²</b><span>prekast çift duvar</span></div>" +
        "<div><b>" + f(doseme) + " m²</b><span>filigran döşeme</span></div>" +
        "<div><b>~" + f(panelSay) + "</b><span>duvar paneli</span></div>" +
        "<div><b>~" + f(tir) + "</b><span>tır sevkiyat</span></div>" +
        "<div><b>~" + f(gun) + " iş günü</b><span>montaj (tek ekip)</span></div>";
      k.dataset.ozet = "Bina " + o.L + "×" + o.G + " m, " + o.kat + " kat · toplam " + f(o.L * o.G * o.kat) + " m² · çift duvar ~" + f(duvar) + " m² · filigran döşeme ~" + f(doseme) + " m²";
    }
    var bas = performance.now();
    (function dongu(t) {
      parcalar.forEach(function (p) { if (p.sabit) return; var gec = t - bas - p.gecikme, y = p.m.position.y; if (gec > 0 && y > p.y) { p.m.position.y = Math.max(p.y, y - Math.max(.4, (y - p.y) * .18)); } });
      if (!surukle && k.dataset.don !== "0") { aci += .0016; kamera(); }
      r.render(sahne, kam); requestAnimationFrame(dongu);
    })(0);
    k.querySelectorAll("input[type=range]").forEach(function (i) { i.addEventListener("input", function () { var y = k.querySelector("[data-yaz='" + i.className + "']"); if (y) y.textContent = i.value + (i.dataset.ek || ""); }); i.addEventListener("change", insaEt); });
    k.querySelector(".sim-tekrar").onclick = insaEt;
    k.querySelector(".sim-don").onclick = function () { k.dataset.don = k.dataset.don === "0" ? "1" : "0"; this.textContent = k.dataset.don === "0" ? "▶ Döndür" : "⏸ Durdur"; };
    k.querySelector(".sim-teklif").onclick = function () { var s = document.querySelector("#sihirbaz"); if (s) { s.scrollIntoView({ behavior: "smooth" }); var il = document.querySelector(".sh-il"); } var w = window.FIRMA; if (w) window.open("https://wa.me/" + w.wa + "?text=" + encodeURIComponent("Merhaba, sitenizdeki 3D simülatörde projemi hesapladım: " + k.dataset.ozet + ". Ön teklif almak istiyorum."), "_blank"); };
    addEventListener("resize", function () { W = tuval.clientWidth; H = tuval.clientHeight; r.setSize(W, H); kam.aspect = W / H; kam.updateProjectionMatrix(); });
    insaEt();
  }
  document.addEventListener("DOMContentLoaded", function () { [].forEach.call(document.querySelectorAll(".sim"), kur); });
})();
