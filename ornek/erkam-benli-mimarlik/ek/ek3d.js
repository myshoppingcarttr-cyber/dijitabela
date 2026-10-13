// 3D / 360° proje sunumu: döndürülebilir oda modeli (zemin, duvarlar, pencere boşluğu, mobilya kutuları). three@0.160.0 (importmap).
// Ekran dışındayken render durur; WebGL yoksa sayfadaki yedek görsel kalır.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const sahne = document.getElementById("d3-sahne");
const renk = (ad, yedek) => { const v = getComputedStyle(document.body).getPropertyValue(ad).trim(); return v || yedek; };
if (sahne) {
  let webgl = false;
  try { const c = document.createElement("canvas"); webgl = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { webgl = false; }
  if (webgl) {
    try { baslat(); } catch (e) { console.warn("3D başlatılamadı", e); sahne.classList.remove("hazir"); }
  }
}

function baslat() {
  const vurgu = new THREE.Color(renk("--vurgu2", "#B08A4E"));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-label", "Döndürülebilir 3D oda modeli");
  sahne.insertBefore(renderer.domElement, sahne.firstChild);

  const scene = new THREE.Scene();
  const gunRenk = new THREE.Color("#dfe6ee"), geceRenk = new THREE.Color("#0f1218");
  scene.background = gunRenk.clone();
  scene.fog = new THREE.Fog(gunRenk.clone(), 14, 30);
  const kamera = new THREE.PerspectiveCamera(42, 1, .1, 60);
  kamera.position.set(7.2, 5.6, 8.4);

  const kontrol = new OrbitControls(kamera, renderer.domElement);
  kontrol.enableDamping = true; kontrol.dampingFactor = .08;
  kontrol.target.set(0, 1.1, 0);
  kontrol.minDistance = 5; kontrol.maxDistance = 17; kontrol.maxPolarAngle = Math.PI * .49;
  kontrol.enablePan = false; kontrol.autoRotate = true; kontrol.autoRotateSpeed = 1.1;
  kontrol.addEventListener("start", () => { kontrol.autoRotate = false; dugme("dondur", false); });

  const mat = (c, r = .85, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const kutu = (w, h, d, m, x, y, z, golge = true) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = golge; o.receiveShadow = true; scene.add(o); return o; };

  // zemin + zemin tahtası
  const W = 8, D = 6, H = 3, T = .18;
  kutu(W + .6, .2, D + .6, mat("#6d5a48", .7), 0, -.1, 0);
  kutu(W, .04, D, mat("#c4a77d", .55), 0, .02, 0);
  const duvar = mat("#f1eee8", .95);
  // arka duvar: pencere boşluğu bırakacak şekilde dört parça (pencere genişliği 2.6, yükseklik 1.4, denizlik 1)
  const pw = 2.6, ph = 1.5, pb = 1, zA = -D / 2;
  kutu((W - pw) / 2, H, T, duvar, -(pw / 2 + (W - pw) / 4), H / 2, zA);
  kutu((W - pw) / 2, H, T, duvar, (pw / 2 + (W - pw) / 4), H / 2, zA);
  kutu(pw, pb, T, duvar, 0, pb / 2, zA);
  kutu(pw, H - pb - ph, T, duvar, 0, pb + ph + (H - pb - ph) / 2, zA);
  // sol ve sağ duvar; sağ duvarda alçak (çizim ön yüzü açık, kesit görünüm)
  kutu(T, H, D, duvar, -W / 2, H / 2, 0);
  kutu(T, H, D, duvar, W / 2, H / 2, 0);
  // pencere camı + doğrama
  const cam = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshPhysicalMaterial({ color: "#bfe0f5", transparent: true, opacity: .28, roughness: .05, transmission: 0 }));
  cam.position.set(0, pb + ph / 2, zA); scene.add(cam);
  const dm = mat("#2b2b2b", .5, .3);
  kutu(pw + .12, .06, .12, dm, 0, pb + ph, zA, false); kutu(pw + .12, .06, .12, dm, 0, pb, zA, false);
  kutu(.06, ph, .12, dm, -pw / 2, pb + ph / 2, zA, false); kutu(.06, ph, .12, dm, pw / 2, pb + ph / 2, zA, false); kutu(.04, ph, .1, dm, 0, pb + ph / 2, zA, false);
  // mobilya: koltuk (oturak + sırt + kolçaklar), sehpa, kitaplık, halı, lamba
  const hali = kutu(4.4, .02, 3, mat("#B08A4E", 1), 0, .05, 1.1, false); hali.material.color.copy(vurgu).multiplyScalar(.75);
  const kum = mat("#8d8f94", .95);
  kutu(2.6, .45, 1.0, kum, -.4, .3, 1.7); kutu(2.6, .75, .28, kum, -.4, .62, 2.12); kutu(.28, .6, 1.0, kum, -1.84, .45, 1.7); kutu(.28, .6, 1.0, kum, 1.04, .45, 1.7);
  kutu(1.3, .34, .8, mat("#3a2d22", .5), -.4, .22, .35);
  kutu(2.2, 2.2, .45, mat("#7a5a3a", .7), -2.7, 1.1, zA + .35);
  kutu(.12, 1.5, .12, mat("#222", .4, .6), 3.2, .75, -1.9); kutu(.5, .38, .5, mat("#f6e3b4", .6), 3.2, 1.62, -1.9, false);
  // ışıklar
  const hemi = new THREE.HemisphereLight("#ffffff", "#8b7b66", .85); scene.add(hemi);
  const gun = new THREE.DirectionalLight("#fff4de", 1.8); gun.position.set(4, 8, 7); gun.castShadow = true; gun.shadow.mapSize.set(1024, 1024);
  gun.shadow.camera.left = -8; gun.shadow.camera.right = 8; gun.shadow.camera.top = 8; gun.shadow.camera.bottom = -8; scene.add(gun);
  const nokta = new THREE.PointLight("#ffcf8a", 0, 12, 1.6); nokta.position.set(3.2, 1.9, -1.9); scene.add(nokta);

  // gündüz / gece
  let gece = false;
  function ayarla(g) {
    gece = g;
    const h = g ? geceRenk : gunRenk; scene.background.copy(h); scene.fog.color.copy(h);
    hemi.intensity = g ? .22 : .85; gun.intensity = g ? .15 : 1.8; nokta.intensity = g ? 28 : 0;
    cam.material.opacity = g ? .12 : .28;
    dugme("gece", g); dugme("gunduz", !g);
  }
  function dugme(ad, acik) { const b = sahne.parentElement.querySelector('[data-d3="' + ad + '"]'); if (b) b.classList.toggle("on", acik); }
  sahne.parentElement.addEventListener("click", (e) => {
    const b = e.target.closest("[data-d3]"); if (!b) return; const a = b.dataset.d3;
    if (a === "gece") ayarla(true); else if (a === "gunduz") ayarla(false);
    else if (a === "dondur") { kontrol.autoRotate = !kontrol.autoRotate; dugme("dondur", kontrol.autoRotate); }
    else if (a === "sifirla") { kamera.position.set(7.2, 5.6, 8.4); kontrol.target.set(0, 1.1, 0); kontrol.update(); }
  });
  ayarla(false); dugme("dondur", true);

  // boyut
  function boyut() { const w = sahne.clientWidth, h = sahne.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); kamera.aspect = w / h; kamera.updateProjectionMatrix(); }
  new ResizeObserver(boyut).observe(sahne); boyut();

  // görünürlük: ekran dışında / sekme gizliyken render döngüsü durur
  let gorunur = false, sekme = !document.hidden;
  const kos = () => { if (gorunur && sekme && sahne.clientWidth) renderer.setAnimationLoop(() => { kontrol.update(); renderer.render(scene, kamera); }); else renderer.setAnimationLoop(null); };
  new IntersectionObserver((k) => { gorunur = k[0].isIntersecting; kos(); }, { rootMargin: "80px" }).observe(sahne);
  document.addEventListener("visibilitychange", () => { sekme = !document.hidden; kos(); });
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { kontrol.autoRotate = false; dugme("dondur", false); }
  renderer.render(scene, kamera);
  sahne.classList.add("hazir");
}
