/* Ümit Kavi · 3D sahne (Dijitabela örnek tasarım). Three.js r160, tüm geometri prosedürel — harici model yok. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const Q = new URLSearchParams(location.search);
const MOBILE = Q.get('q') === 'high' ? false : (Q.get('q') === 'low' || matchMedia('(max-width:820px)').matches || (navigator.maxTouchPoints > 0 && innerWidth < 1100));
const REDUCE = matchMedia('(prefers-reduced-motion:reduce)').matches;
const prog = (n, m) => window.UK3D_progress && window.UK3D_progress(n, m);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sm = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- renderer ---------- */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, powerPreference: 'high-performance', alpha: false });
let DPR = Math.min(devicePixelRatio || 1, MOBILE ? 1.25 : 1.75);
renderer.setPixelRatio(DPR);
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0807);
scene.fog = new THREE.FogExp2(0x0a0807, 0.05);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
const EI = 0.5;

const camera = new THREE.PerspectiveCamera(MOBILE ? 52 : 40, innerWidth / innerHeight, 0.1, 80);
camera.position.set(0, 0.8, 10);

/* ---------- doku yardımcıları ---------- */
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h || w; return c; };
const mkTex = (c, srgb = true, rep) => { const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
function noiseCanvas(size, cells, lo = 90, hi = 200) {
  const s = cv(cells), g = s.getContext('2d'), id = g.createImageData(cells, cells);
  for (let i = 0; i < id.data.length; i += 4) { const v = lo + Math.random() * (hi - lo); id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  g.putImageData(id, 0, 0);
  const c = cv(size), x = c.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(s, 0, 0, size, size); return c;
}
const NOISE = mkTex(noiseCanvas(256, 24), false, [3, 3]);
function marbleTex() {
  const c = cv(512), g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 512, 512); gr.addColorStop(0, '#ece7df'); gr.addColorStop(1, '#d9d2c7'); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  g.globalAlpha = .5; g.drawImage(noiseCanvas(512, 10, 200, 245), 0, 0); g.globalAlpha = 1;
  g.filter = 'blur(.8px)';
  for (let i = 0; i < 16; i++) {
    g.strokeStyle = `rgba(90,84,76,${.05 + Math.random() * .12})`; g.lineWidth = .6 + Math.random() * 2.2; g.beginPath();
    let x = Math.random() * 512, y = Math.random() * 512; g.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (Math.random() - .3) * 130; y += (Math.random() - .5) * 130; g.quadraticCurveTo(x - 40 + Math.random() * 80, y - 40 + Math.random() * 80, x, y); }
    g.stroke();
  }
  g.filter = 'none'; return mkTex(c, true);
}
function woodTex() {
  const c = cv(512), g = c.getContext('2d'); g.fillStyle = '#3b2415'; g.fillRect(0, 0, 512, 512);
  g.globalAlpha = .55; g.drawImage(noiseCanvas(512, 8, 40, 120), 0, 0); g.globalAlpha = 1; g.filter = 'blur(.6px)';
  for (let i = 0; i < 160; i++) {
    const y = Math.random() * 512, a = Math.random() * 10 + 3; g.strokeStyle = Math.random() < .5 ? `rgba(20,10,4,${.15 + Math.random() * .3})` : `rgba(120,76,42,${.08 + Math.random() * .16})`;
    g.lineWidth = .5 + Math.random() * 2; g.beginPath(); for (let x = 0; x <= 512; x += 16) { const yy = y + Math.sin(x * .02 + i) * a * .3 + Math.sin(x * .007 + i * 3) * a; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke();
  }
  g.filter = 'none'; return mkTex(c, true);
}
function spriteTex(soft = .5) { const c = cv(64), g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(soft, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return mkTex(c, false); }
function latteTex() {
  const c = cv(512), g = c.getContext('2d'), rg = g.createRadialGradient(256, 256, 10, 256, 256, 256);
  rg.addColorStop(0, '#85532b'); rg.addColorStop(.7, '#5e3519'); rg.addColorStop(1, '#2b150a'); g.fillStyle = rg; g.fillRect(0, 0, 512, 512);
  g.filter = 'blur(2.5px)'; g.fillStyle = '#f1ddc2';
  for (let i = 0; i < 6; i++) { const y = 392 - i * 54, w = 156 - i * 15 - (i === 5 ? 20 : 0), h = 30 + (i === 0 ? 12 : 0); g.beginPath(); g.ellipse(256, y, w, h, 0, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = '#6a3d1e'; g.lineWidth = 6; g.beginPath(); g.moveTo(256, 440); g.lineTo(256, 70); g.stroke(); g.filter = 'none';
  return mkTex(c, true);
}
const SPRITE = spriteTex();
const std = (color, rough = .5, metal = 0, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal, envMapIntensity: EI }, o));
const phys = (color, rough = .3, metal = 0, o = {}) => new THREE.MeshPhysicalMaterial(Object.assign({ color, roughness: rough, metalness: metal, envMapIntensity: EI }, o));
const lathe = (pts, seg = 64) => new THREE.LatheGeometry(pts.map(a => new THREE.Vector2(a[0], a[1])), seg);

/* ---------- ışıklar ---------- */
scene.add(new THREE.HemisphereLight(0xffe9cf, 0x1a120b, 0.45));
const key = new THREE.DirectionalLight(0xfff0dc, 2.6);
key.castShadow = true; key.shadow.mapSize.set(MOBILE ? 1024 : 2048, MOBILE ? 1024 : 2048);
Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .5, far: 28 }); key.shadow.bias = -0.0005; key.shadow.normalBias = .035; key.shadow.radius = 5;
scene.add(key, key.target);
const rim = new THREE.PointLight(0xffa24f, 90, 18, 2); scene.add(rim);
const cool = new THREE.PointLight(0x4fb8c8, 50, 16, 2); scene.add(cool);
const fill = new THREE.PointLight(0xfff1e0, 55, 26, 2); scene.add(fill);

/* ---------- zemin + derinlik ---------- */
const FLOOR_Y = -2.4, TOP_Y = -0.9, SX = [0, 16, 32, 48, 64];
{
  const fm = std(0x17120e, .36, .25, { roughnessMap: NOISE, bumpMap: NOISE, bumpScale: .4 });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(240, 70), fm); f.rotation.x = -Math.PI / 2; f.position.set(32, FLOOR_Y, -8); f.receiveShadow = true; scene.add(f);
  const n = MOBILE ? 8 : 14, pos = [], col = [];
  SX.forEach(x => { for (let i = 0; i < n; i++) { pos.push(x + (Math.random() - .5) * 26, -1 + Math.random() * 8, -13 - Math.random() * 8); const c = new THREE.Color(Math.random() < .3 ? 0x6fc9d6 : 0xffb25e); col.push(c.r, c.g, c.b); } });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 3.2, map: SPRITE, vertexColors: true, transparent: true, opacity: .32, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })));
}
prog(18, 'Işık ve zemin');

/* ---------- 0 · HERO: logo + süzülen malzemeler ---------- */
const hero = new THREE.Group(); scene.add(hero);
const logo = new THREE.Group(); hero.add(logo);
function bar(x1, y1, x2, y2, w) { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2, s = new THREE.Shape(); s.moveTo(x1 + nx, y1 + ny); s.lineTo(x2 + nx, y2 + ny); s.lineTo(x2 - nx, y2 - ny); s.lineTo(x1 - nx, y1 - ny); s.closePath(); return s; }
{
  const metal = phys(0xe0a566, .24, 1, { clearcoat: .5, clearcoatRoughness: .15, envMapIntensity: 3.2 });
  const ex = { depth: .42, bevelEnabled: true, bevelThickness: .045, bevelSize: .04, bevelSegments: 4, curveSegments: 14 };
  const U = new THREE.Shape(); U.moveTo(0, 1.4); U.lineTo(0, .5); U.absarc(.5, .5, .5, Math.PI, 2 * Math.PI, false); U.lineTo(1, 1.4); U.lineTo(.72, 1.4); U.lineTo(.72, .5); U.absarc(.5, .5, .22, 2 * Math.PI, Math.PI, true); U.lineTo(.28, 1.4); U.closePath();
  const um = new THREE.Mesh(new THREE.ExtrudeGeometry(U, ex), metal); um.position.x = -1.65;
  const dots = [-1.5, -.8].map(x => { const d = new THREE.Mesh(new THREE.SphereGeometry(.15, 24, 16), metal); d.position.set(x + .52, 1.86, .21); return d; });
  const km = [bar(.14, 0, .14, 1.4, .28), bar(.28, .62, 1.0, 1.4, .27), bar(.5, .8, 1.02, 0, .27)].map(s => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, ex), metal); m.position.x = .35; return m; });
  const inner = new THREE.Group(); [um, ...dots, ...km].forEach(m => { m.castShadow = true; inner.add(m); });
  inner.position.set(-.24, -.7, -.21); logo.add(inner); logo.scale.setScalar(1.3);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.3, .012, 8, 160), phys(0xf2c48d, .3, 1, { emissive: 0xb86b20, emissiveIntensity: .7 })); ring.rotation.x = 1.25; ring.rotation.y = .3; hero.add(ring); hero.userData.ring = ring;
}
const floaters = [];
function mkInst(geo, mat, n) { const m = new THREE.InstancedMesh(geo, mat, n); m.castShadow = true; m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); hero.add(m); return m; }
function addFloaters(mesh, n, scale, extra) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, r = 3.0 + Math.random() * 4.4, y = -1.1 + Math.random() * 4.6;
    const p = new THREE.Vector3(Math.cos(a) * r * 1.15, y, Math.sin(a) * r * .55 - .6); if (p.z > 2.5 && Math.abs(p.x) < 2.6) p.z -= 4;
    floaters.push({ mesh, i, p, s: scale * (.75 + Math.random() * .6), ph: Math.random() * 6.28, amp: .12 + Math.random() * .25, ax: new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize(), rs: (Math.random() - .5) * 1.1, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)), off: new THREE.Vector3(), vel: new THREE.Vector3(), extra });
  }
}
function beanGeo(sx, sy, sz, seg = 18) {
  const g = new THREE.SphereGeometry(1, seg, 12), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); let z = p.getZ(i); if (Math.abs(y) < .16 && z > 0) z *= 1 - .45 * (1 - Math.abs(y) / .16); p.setXYZ(i, x * sx, y * sy, z * sz); }
  g.computeVertexNormals(); return g;
}
{
  const nT = MOBILE ? 8 : 13, nL = MOBILE ? 6 : 10, nB = MOBILE ? 20 : 34, nC = MOBILE ? 34 : 70;
  const tg = new THREE.SphereGeometry(.3, 28, 20); const tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) { let y = tp.getY(i); const x = tp.getX(i), z = tp.getZ(i), r = Math.hypot(x, z); if (y > .18) y -= .08 * Math.exp(-r * r * 40) * ((y - .18) / .12); tp.setY(i, y * .86); } tg.computeVertexNormals();
  const tom = mkInst(tg, phys(0xc3241a, .32, 0, { clearcoat: .7, clearcoatRoughness: .18, bumpMap: NOISE, bumpScale: .2 }), nT);
  const cal = mkInst(new THREE.ConeGeometry(.13, .07, 5), std(0x2f7a2b, .6), nT);
  addFloaters(tom, nT, 1, cal);
  const lp = []; for (let i = 0; i <= 18; i++) { const t = i / 18 * Math.PI; lp.push([i === 0 || i === 18 ? 0 : .3 * Math.pow(Math.sin(t), .8), -Math.cos(t) * .42]); }
  const lg = lathe(lp, 26); lg.rotateZ(Math.PI / 2);
  addFloaters(mkInst(lg, phys(0xffd321, .4, 0, { clearcoat: .3, bumpMap: NOISE, bumpScale: .6, emissive: 0x3a2a00, emissiveIntensity: .5 }), nL), nL, .72);
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(.26, .12, .3, .55, 0, 1); sh.bezierCurveTo(-.3, .55, -.26, .12, 0, 0);
  const bg = new THREE.ShapeGeometry(sh, 8); bg.translate(0, -.5, 0); { const p = bg.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -x * x * 1.6 + y * y * .25); } } bg.computeVertexNormals();
  addFloaters(mkInst(bg, std(0x2c7a30, .55, 0, { side: THREE.DoubleSide, roughnessMap: NOISE }), nB), nB, .75);
  addFloaters(mkInst(beanGeo(.14, .085, .1), phys(0x3a1f12, .38, 0, { clearcoat: .4 }), nC), nC, 1);
  const nF = MOBILE ? 160 : 420, fp = new Float32Array(nF * 3);
  for (let i = 0; i < nF; i++) fp.set([(Math.random() - .5) * 15, -2 + Math.random() * 7, -4 + Math.random() * 7], i * 3);
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(fp, 3));
  const flour = new THREE.Points(fg, new THREE.PointsMaterial({ color: 0xf3ead6, size: .09, map: SPRITE, transparent: true, opacity: .55, depthWrite: false, sizeAttenuation: true })); hero.add(flour); hero.userData.flour = flour;
}
prog(38, 'Malzemeler');

/* ---------- masa ---------- */
const MARBLE = marbleTex(), WOOD = woodTex();
function table(x, tex, r = 3.0) {
  const g = new THREE.Group(); g.position.x = x; const marble = tex === MARBLE;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .22, 72), phys(marble ? 0xc9c2b6 : 0xffffff, marble ? .22 : .42, 0, { map: tex, clearcoat: marble ? .6 : .15, clearcoatRoughness: .25 }));
  top.position.y = TOP_Y - .11; top.receiveShadow = true; top.castShadow = true;
  const ph = TOP_Y - .22 - FLOOR_Y, ped = new THREE.Mesh(new THREE.CylinderGeometry(.42, .8, ph, 32), std(0x1d1612, .4, .5)); ped.position.y = FLOOR_Y + ph / 2; ped.castShadow = true;
  g.add(top, ped); scene.add(g); return g;
}

/* ---------- 1 · TABAK ---------- */
const plateSt = new THREE.Group(); plateSt.position.x = SX[1]; scene.add(plateSt); table(SX[1], MARBLE);
const plate = new THREE.Group(); plate.position.y = TOP_Y; plateSt.add(plate);
const plateYaw = new THREE.Group(); plate.add(plateYaw);
{
  const cer = phys(0xf5f1e8, .16, 0, { clearcoat: 1, clearcoatRoughness: .06, side: THREE.DoubleSide });
  const pl = new THREE.Mesh(lathe([[0, 0], [.8, 0], [.86, .035], [1.5, .1], [1.74, .17], [1.78, .21], [1.74, .215], [1.58, .165], [1.0, .105], [0, .095]], 72), cer); pl.castShadow = pl.receiveShadow = true; plateYaw.add(pl);
  const Y0 = .1;
  const add = (g, m, x, y, z, sx = 1, sy = 1, sz = 1) => { const o = new THREE.Mesh(g, m); o.position.set(x, Y0 + y, z); o.scale.set(sx, sy, sz); o.castShadow = o.receiveShadow = true; plateYaw.add(o); return o; };
  const pts = []; for (let i = 0; i <= 70; i++) { const a = i / 70 * Math.PI * 3.3 + .4, r = .12 + i / 70 * .95; pts.push(new THREE.Vector3(Math.cos(a) * r - .15, 0, Math.sin(a) * r + .1)); }
  const sauce = phys(0x6aa83a, .22, 0, { clearcoat: .8, clearcoatRoughness: .1 });
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .075, 10), sauce, 0, .03, 0, 1, .5, 1);
  for (let i = 0; i < 6; i++) { const a = 3.45 + i * .38, r = 1.28; add(new THREE.SphereGeometry(1, 20, 12), sauce, Math.cos(a) * r, .03, Math.sin(a) * r, .1 - i * .008, .045, .1 - i * .008); }
  const sg = new THREE.CylinderGeometry(.27, .29, .2, 32, 1), side = phys(0xf0e1c4, .5), top = phys(0xb97a33, .42, 0, { bumpMap: NOISE, bumpScale: 1.5 });
  [[-.55, -.35], [.05, .62], [.62, -.12]].forEach((p, i) => { const s = new THREE.Mesh(sg, [side, top, side]); s.position.set(p[0] * .95, Y0 + .1, p[1] * .95); s.rotation.set((Math.random() - .5) * .12, i, 0); s.castShadow = s.receiveShadow = true; plateYaw.add(s); });
  const mg = new THREE.ConeGeometry(.025, .12, 5), mh = std(0x3d8d2f, .55);
  for (let i = 0; i < 16; i++) { const a = Math.random() * 6.28, r = .2 + Math.random() * .75, o = add(mg, mh, -.1 + Math.cos(a) * r * .8, .31 + Math.random() * .08, Math.sin(a) * r * .6); o.rotation.set((Math.random() - .5) * 1.4, 0, (Math.random() - .5) * 1.4); }
  const fl = new THREE.Group(); fl.position.set(.06, Y0 + .4, .66);
  const pg = new THREE.SphereGeometry(.1, 14, 10), pm1 = phys(0xf08a1c, .35, 0, { clearcoat: .3 });
  for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28, p = new THREE.Mesh(pg, pm1); p.scale.set(1, .22, 1.8); p.position.set(Math.cos(a) * .11, 0, Math.sin(a) * .11); p.rotation.y = -a; p.castShadow = true; fl.add(p); }
  const cc = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), std(0xf6d13a, .5)); cc.position.y = .03; fl.add(cc); plateYaw.add(fl);
  const dm = phys(0x2a140a, .15, 0, { clearcoat: 1 });
  [[1.0, .9, .07], [1.2, .55, .05], [-1.05, 1.0, .06], [-1.3, .1, .045]].forEach(d => add(new THREE.SphereGeometry(1, 14, 10), dm, d[0], .02, d[1], d[2], d[2] * .32, d[2]));
  const cut = phys(0xd7d7da, .22, 1, { envMapIntensity: 1.3 });
  const kn = new THREE.Mesh(new RoundedBoxGeometry(.1, .03, 2.2, 3, .012), cut); kn.position.set(3.0, .02, .2); kn.castShadow = true; plate.add(kn);
  const fk = new THREE.Mesh(new RoundedBoxGeometry(.12, .03, 2.0, 3, .012), cut); fk.position.set(-3.0, .02, .2); fk.castShadow = true; plate.add(fk);
}
prog(56, 'Tabak');

/* ---------- 2 · KAHVE ---------- */
const coffeeSt = new THREE.Group(); coffeeSt.position.x = SX[2]; scene.add(coffeeSt); table(SX[2], WOOD);
const steamU = { uTime: { value: 0 }, uScale: { value: 1 } };
{
  const cup = new THREE.Group(); cup.position.set(.2, TOP_Y, .3); coffeeSt.add(cup);
  const cer = phys(0xf7f4ee, .14, 0, { clearcoat: 1, clearcoatRoughness: .05, side: THREE.DoubleSide });
  const body = new THREE.Mesh(lathe([[0, 0], [.3, 0], [.36, .05], [.56, .3], [.7, .62], [.77, .88], [.74, .89], [.68, .64], [.52, .32], [.3, .14], [0, .12]]), cer); body.position.y = .12; body.castShadow = body.receiveShadow = true; cup.add(body);
  const sa = new THREE.Mesh(lathe([[0, 0], [.7, 0], [.78, .03], [1.3, .13], [1.38, .16], [1.35, .175], [1.26, .1], [.8, .06], [0, .06]], 72), cer); sa.castShadow = sa.receiveShadow = true; cup.add(sa);
  const h = new THREE.Mesh(new THREE.TorusGeometry(.29, .065, 14, 28, Math.PI * 1.25), cer); h.position.set(.76, .6, 0); h.rotation.z = -Math.PI * .63; h.castShadow = true; cup.add(h);
  const liq = new THREE.Mesh(new THREE.CircleGeometry(.69, 48), phys(0xffffff, .12, 0, { map: latteTex(), clearcoat: 1, clearcoatRoughness: .05 })); liq.rotation.x = -Math.PI / 2; liq.position.y = .82; cup.add(liq);
  const n = MOBILE ? 26 : 56, pos = new Float32Array(n * 3), seed = new Float32Array(n);
  for (let i = 0; i < n; i++) { seed[i] = Math.random(); pos.set([(Math.random() - .5) * .3, 0, (Math.random() - .5) * .3], i * 3); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const smat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: steamU, vertexShader: `uniform float uTime,uScale;attribute float aSeed;varying float vA;
    void main(){float t=fract(uTime*(.09+aSeed*.05)+aSeed*7.3);vec3 p=position;p.y+=t*2.3;p.x+=sin(t*5.+aSeed*30.)*.17*t+t*.15;p.z+=cos(t*4.+aSeed*20.)*.12*t;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=uScale*(150.+t*420.)/-mv.z;vA=sin(t*3.14159)*.3*(1.-t*.3);}`,
    fragmentShader: `varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a=smoothstep(.5,.0,d);a*=a;gl_FragColor=vec4(vec3(1.,.97,.93),a*vA);}` });
  const steam = new THREE.Points(sg, smat); steam.position.set(0, .86, 0); steam.frustumCulled = false; cup.add(steam);
  const bg = beanGeo(.17, .1, .12, 16), bm = phys(0x3a1f12, .38, 0, { clearcoat: .4 });
  for (let i = 0; i < 16; i++) { const b = new THREE.Mesh(bg, bm), a = Math.random() * 6.28, r = 1.9 + Math.random() * 1.1; b.position.set(Math.cos(a) * r - .6, TOP_Y + .1, Math.sin(a) * r * .8 + .2); b.rotation.set(Math.random() * 3, Math.random() * 6, Math.random() * 3); b.castShadow = true; coffeeSt.add(b); }
  const jm = phys(0xe4e6ea, .16, 1, { envMapIntensity: 2.4, side: THREE.DoubleSide });
  const jug = new THREE.Mesh(lathe([[0, 0], [.42, 0], [.5, .05], [.46, .5], [.38, .78], [.5, .98], [.46, 1.0], [.32, .84], [.36, .5], [.4, .12], [0, .08]], 48), jm); jug.position.set(2.2, TOP_Y, -.9); jug.scale.setScalar(.8); jug.castShadow = true; coffeeSt.add(jug);
  const jh = new THREE.Mesh(new THREE.TorusGeometry(.26, .045, 10, 20, Math.PI), jm); jh.position.set(2.2 - .4 * .8 - .02, TOP_Y + .42, -.9); jh.scale.setScalar(.8); jh.rotation.z = Math.PI / 2; coffeeSt.add(jh);
}
prog(70, 'Kahve');

/* ---------- 3 · REDNA: küpler birleşip R oluyor ---------- */
const redna = new THREE.Group(); redna.position.set(SX[3], .35, 0); scene.add(redna);
const R_MAP = ['1111.', '1...1', '1...1', '1111.', '1.1..', '1..1.', '1...1'];
const cubeCells = []; R_MAP.forEach((row, ry) => [...row].forEach((c, rx) => { if (c === '1') cubeCells.push({ rx, ry }); }));
const CS = .66, IQ = new THREE.Quaternion();
const rGeo = new RoundedBoxGeometry(CS * .92, CS * .92, CS * .92, 3, .08);
const rCols = [0xc4ec3c, 0xe2a25b, 0xf0e8d6];
const rMain = new THREE.InstancedMesh(rGeo, phys(0xffffff, .3, 0, { clearcoat: .6, clearcoatRoughness: .2, emissive: 0x1d2a05, emissiveIntensity: .8 }), cubeCells.length); rMain.castShadow = rMain.receiveShadow = true; rMain.frustumCulled = false; rMain.instanceMatrix.setUsage(THREE.DynamicDrawUsage); redna.add(rMain);
const rData = cubeCells.map((c, i) => {
  const grp = c.ry < 3 ? 0 : (c.ry < 5 ? 1 : 2); rMain.setColorAt(i, new THREE.Color(rCols[grp]));
  const a = Math.random() * 6.28, r = 5 + Math.random() * 5;
  return { t: new THREE.Vector3((c.rx - 2) * CS, (3 - c.ry) * CS, 0), s: new THREE.Vector3(Math.cos(a) * r, (Math.random() - .5) * 9, Math.sin(a) * r * .6 - 2), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)), d: Math.random() * .35 };
});
const sat = [];
{
  const n = MOBILE ? 22 : 46, sm3 = new THREE.InstancedMesh(rGeo, phys(0xffffff, .38, 0, { clearcoat: .3 }), n); sm3.castShadow = true; sm3.frustumCulled = false; sm3.instanceMatrix.setUsage(THREE.DynamicDrawUsage); redna.add(sm3);
  const cs = [0x1e1a17, 0x2b2622, 0xf0e8d6, 0xe2a25b, 0xc4ec3c, 0x1e1a17];
  for (let i = 0; i < n; i++) { sm3.setColorAt(i, new THREE.Color(cs[i % cs.length])); sat.push({ a: Math.random() * 6.28, r: 4.2 + Math.random() * 4, y: (Math.random() - .5) * 7, sp: (.04 + Math.random() * .08) * (Math.random() < .5 ? -1 : 1), s: .22 + Math.random() * .5, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, 0)), ph: Math.random() * 6 }); }
  redna.userData.sat = sm3;
  const glow = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.66, 120), new THREE.MeshBasicMaterial({ color: 0xc4ec3c, transparent: true, opacity: .55, side: THREE.DoubleSide })); glow.rotation.x = -Math.PI / 2; glow.position.y = -2.7; redna.add(glow); redna.userData.glow = glow;
  const pt = new THREE.PointLight(0xc4ec3c, 22, 9, 2); pt.position.set(0, -1.6, 1.5); redna.add(pt); redna.userData.pt = pt;
}
prog(82, 'Redna Hub');

/* ---------- 4 · REZERVASYON MASASI ---------- */
const resSt = new THREE.Group(); resSt.position.x = SX[4]; scene.add(resSt); table(SX[4], WOOD, 3.8);
let cardCtx, cardTex;
const candleLight = new THREE.PointLight(0xffa04a, 14, 11, 2);
function drawCard(lang) {
  const g = cardCtx, W = 1024, H = 640, en = lang === 'en';
  g.fillStyle = '#f3ead8'; g.fillRect(0, 0, W, H);
  g.globalAlpha = .12; g.drawImage(noiseCanvas(512, 40, 120, 255), 0, 0, W, H); g.globalAlpha = 1;
  g.strokeStyle = '#b08d57'; g.lineWidth = 3; g.strokeRect(34, 34, W - 68, H - 68); g.lineWidth = 1; g.strokeRect(48, 48, W - 96, H - 96);
  g.fillStyle = '#6d5a3e'; g.textAlign = 'center'; g.font = '600 26px Manrope,system-ui,sans-serif'; try { g.letterSpacing = '10px'; } catch (e) {}
  g.fillText(en ? 'RESERVATION' : 'REZERVASYON', W / 2, 120); try { g.letterSpacing = '0px'; } catch (e) {}
  g.fillStyle = '#1d1712'; g.font = 'italic 500 92px "Cormorant Garamond",Georgia,serif'; g.fillText(en ? "Chef's Table" : 'Şefin Masası', W / 2, 250);
  g.fillStyle = '#7a2e22'; g.font = '500 40px "Cormorant Garamond",Georgia,serif'; g.fillText('Ümit Kavi', W / 2, 322);
  g.strokeStyle = '#b08d57'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(380, 360); g.lineTo(644, 360); g.stroke();
  g.fillStyle = '#3a3026'; g.font = '500 34px Manrope,system-ui,sans-serif'; g.fillText(en ? 'Table 01 · 2 guests · 20:00' : 'Masa 01 · 2 kişi · 20:00', W / 2, 428);
  g.fillStyle = '#8a7b63'; g.font = '500 24px Manrope,system-ui,sans-serif'; g.fillText(en ? 'Sample card — Dijitabela design demo' : 'Örnek kart — Dijitabela tasarım demosu', W / 2, 520);
  if (cardTex) cardTex.needsUpdate = true;
}
{
  const c = cv(1024, 640); cardCtx = c.getContext('2d'); cardTex = mkTex(c, true); drawCard('tr');
  const edge = std(0xe8dcc2, .7), face = phys(0xffffff, .55, 0, { map: cardTex });
  const card = new THREE.Mesh(new RoundedBoxGeometry(3.0, .035, 1.9, 2, .012), [edge, edge, face, edge, edge, edge]); card.castShadow = card.receiveShadow = true;
  const holder = new THREE.Group(); holder.position.set(-.1, TOP_Y + .75, .3); holder.rotation.x = .78; holder.add(card); resSt.add(holder); resSt.userData.card = holder;
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(.16, .17, 1.3, 28), phys(0xf2e6cc, .5, 0, { clearcoat: .2 })); candle.position.set(2.0, TOP_Y + .65, -.9); candle.castShadow = true; resSt.add(candle);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(.09, 14, 12), new THREE.MeshBasicMaterial({ color: 0xffd490 })); flame.scale.set(.8, 1.9, .8); flame.position.set(2.0, TOP_Y + 1.42, -.9); resSt.add(flame); resSt.userData.flame = flame;
  candleLight.position.set(2.0, TOP_Y + 1.5, -.9); resSt.add(candleLight);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: SPRITE, color: 0xffb060, transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.set(1.6, 1.6, 1); halo.position.copy(flame.position); resSt.add(halo);
  const cer = phys(0xf5f1e8, .16, 0, { clearcoat: 1, clearcoatRoughness: .06, side: THREE.DoubleSide });
  const pg = lathe([[0, 0], [.7, 0], [.74, .03], [1.15, .08], [1.3, .13], [1.32, .16], [1.28, .165], [1.12, .12], [.7, .08], [0, .075]], 56);
  [[-2.7, .9], [-2.3, -1.4]].forEach(p => { const pl = new THREE.Mesh(pg, cer); pl.position.set(p[0], TOP_Y, p[1]); pl.castShadow = pl.receiveShadow = true; resSt.add(pl); });
  const cut = phys(0xd7d7da, .22, 1, { envMapIntensity: 1.3 });
  [[-1.5, 1.0, .1], [-3.9, .9, -.1]].forEach(p => { const k = new THREE.Mesh(new RoundedBoxGeometry(.1, .03, 1.9, 3, .012), cut); k.position.set(p[0], TOP_Y + .02, p[1]); k.rotation.y = p[2]; k.castShadow = true; resSt.add(k); });
  const gm = MOBILE ? phys(0xbfe0f0, .05, 0, { transparent: true, opacity: .22, side: THREE.DoubleSide }) : phys(0xffffff, 0, 0, { transmission: 1, thickness: .25, ior: 1.45, roughness: 0, side: THREE.DoubleSide });
  const glass = new THREE.Mesh(lathe([[0, 0], [.3, 0], [.34, .03], [.46, .9], [.44, .92], [.31, .08], [0, .06]], 40), gm); glass.position.set(1.0, TOP_Y, 1.5); resSt.add(glass);
  const nap = new THREE.Mesh(new RoundedBoxGeometry(.9, .12, .9, 3, .03), std(0xece4d2, .9)); nap.position.set(-2.7, TOP_Y + .2, .9); nap.rotation.y = .3; nap.castShadow = true; resSt.add(nap);
}
prog(92, 'Masa kuruluyor');

/* ---------- kamera rayları + ışık ---------- */
const CAM = [
  { p: [0, .9, 10.2], t: [0, .15, 0] },
  { p: [SX[1] + 1.0, 3.3, 6.0], t: [SX[1], -.7, 0] },
  { p: [SX[2] + 1.0, 1.5, 6.0], t: [SX[2], -.1, .1] },
  { p: [SX[3], .5, 11.5], t: [SX[3], .4, 0] },
  { p: [SX[4], 3.4, 8.6], t: [SX[4], -.7, .2] }
];
const LOOK = [
  { k: 0xfff0dc, ki: 2.4, ri: 90, ex: 1.05 }, { k: 0xfff3e4, ki: 3.0, ri: 55, ex: 1.1 }, { k: 0xffe6c4, ki: 2.4, ri: 70, ex: 1.15 }, { k: 0xf0f6e0, ki: 1.7, ri: 40, ex: 1.12 }, { k: 0xffe0b8, ki: 1.2, ri: 30, ex: 1.2 }];
const PRESET = [
  { k: 0xe8f1ff, ki: 3.8, pos: [-5, 8, 4], rim: 0xa8d4ff, ri: 35, ex: 1.12 },
  { k: 0xff9d4a, ki: 1.6, pos: [3, 3.5, 4], rim: 0xff7a2a, ri: 110, ex: 1.2 },
  { k: 0xffffff, ki: 4.4, pos: [0, 10, 2], rim: 0xffffff, ri: 20, ex: 1.05 }];
let preset = 0, presetW = 0;
window.UK3D = { setLight(i) { preset = clamp(i | 0, 0, 2); }, lang(l) { drawCard(l); } };

/* ---------- bölümler / kaydırma ---------- */
let secs = [], VH = innerHeight;
function measure() {
  VH = innerHeight; const sy = scrollY;
  secs = [...document.querySelectorAll('[data-st]')].map(el => { const r = el.getBoundingClientRect(); return { el, top: r.top + sy, h: r.height, st: +el.dataset.st, sx: +(el.dataset.sx || 0), sy: +(MOBILE ? (el.dataset.msy || 0) : (el.dataset.dsy || 0)) }; });
}
const ease = x => x * x * (3 - 2 * x);
let S = 0, SXo = 0, SYo = 0, redP = 0;
function scrollState(y) {
  if (!secs.length) return;
  let i = 0; for (let k = 0; k < secs.length; k++) if (y >= secs[k].top - VH) i = k;
  const c = secs[i], p = i ? secs[i - 1] : c, f = i ? ease(clamp((y - (c.top - VH)) / VH, 0, 1)) : 1;
  S = lerp(p.st, c.st, f); SXo = MOBILE ? 0 : lerp(p.sx, c.sx, f); SYo = lerp(p.sy, c.sy, f);
  const rs = secs.find(s => s.el.id === 'redna'); if (rs) redP = sm((y - (rs.top - VH * .6)) / (rs.h * .5));
}

/* ---------- etkileşim ---------- */
const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', e => { ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });
const drag = { on: false, x: 0 }; let yawT = 0, yaw = 0, idleT = 0;
document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('.drag3d')) { drag.on = true; drag.x = e.clientX; idleT = 0; } });
addEventListener('pointermove', e => { if (drag.on) { yawT += (e.clientX - drag.x) * .012; drag.x = e.clientX; idleT = 0; } }, { passive: true });
addEventListener('pointerup', () => { drag.on = false; }); addEventListener('pointercancel', () => { drag.on = false; });
let lastY = scrollY, sv = 0;

/* ---------- postprocessing ---------- */
let composer = null;
if (!MOBILE && Q.get('bloom') !== '0') {
  const rt = new THREE.WebGLRenderTarget(innerWidth * DPR, innerHeight * DPR, { type: THREE.HalfFloatType, samples: 4 });
  composer = new EffectComposer(renderer, rt); composer.setPixelRatio(DPR); composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera)); composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .32, .7, .9)); composer.addPass(new OutputPass());
}
let W0 = innerWidth, H0 = innerHeight;
function resize() {
  const w = innerWidth, h = innerHeight; if (MOBILE && w === W0 && Math.abs(h - H0) < 160) return;
  W0 = w; H0 = h; renderer.setPixelRatio(DPR); renderer.setSize(w, h, false); camera.aspect = w / h; if (composer) { composer.setPixelRatio(DPR); composer.setSize(w, h); }
  measure();
}
addEventListener('resize', resize); new ResizeObserver(() => measure()).observe(document.body);
addEventListener('load', () => setTimeout(measure, 400));

/* ---------- döngü ---------- */
const tmpM = new THREE.Matrix4(), tmpM2 = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpS = new THREE.Vector3(), tmpAx = new THREE.Vector3(0, 1, .3).normalize();
const camP = new THREE.Vector3(), camT = new THREE.Vector3(), camPs = new THREE.Vector3(0, .9, 10.2), camTs = new THREE.Vector3(0, .15, 0);
const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3(), ndc = new THREE.Vector3();
const colA = new THREE.Color(), colB = new THREE.Color(), kp = new THREE.Vector3(), pp = new THREE.Vector3();
let t = 0, last = performance.now(), frames = 0, fpsAcc = 0, lowered = 0, warm = 0;

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
  const y = scrollY; sv = lerp(sv, (y - lastY) / Math.max(dt, .001), .25); lastY = y;
  scrollState(y); ptr.sx = lerp(ptr.sx, ptr.x, .06); ptr.sy = lerp(ptr.sy, ptr.y, .06);

  const i0 = Math.min(3, Math.floor(S)), lf = S - i0, a = CAM[i0], b = CAM[i0 + 1];
  camP.set(lerp(a.p[0], b.p[0], lf), lerp(a.p[1], b.p[1], lf), lerp(a.p[2], b.p[2], lf)); camT.set(lerp(a.t[0], b.t[0], lf), lerp(a.t[1], b.t[1], lf), lerp(a.t[2], b.t[2], lf));
  const arc = Math.sin(lf * Math.PI); camP.y += arc * 1.6; camP.x -= arc * 1.6;
  if (MOBILE) camP.sub(camT).multiplyScalar(1.4).add(camT);
  camP.x += ptr.sx * .55; camP.y += ptr.sy * .3 + Math.sin(t * .4) * .06;
  const k = 1 - Math.pow(.0009, dt); camPs.lerp(camP, k); camTs.lerp(camT, k);
  camera.position.copy(camPs); camera.lookAt(camTs);
  camera.setViewOffset(innerWidth, innerHeight, -SXo * innerWidth, -SYo * innerHeight, innerWidth, innerHeight);

  const A = LOOK[i0], B = LOOK[i0 + 1], w1 = clamp(1 - Math.abs(S - 1), 0, 1); presetW = lerp(presetW, w1, .08);
  const P = PRESET[preset];
  colA.setHex(A.k).lerp(colB.setHex(B.k), lf); key.color.copy(colA).lerp(colB.setHex(P.k), presetW);
  key.intensity = lerp(key.intensity, lerp(lerp(A.ki, B.ki, lf), P.ki, presetW), .12);
  rim.intensity = lerp(rim.intensity, lerp(lerp(A.ri, B.ri, lf), P.ri, presetW), .12); rim.color.setHex(0xffa24f).lerp(colB.setHex(P.rim), presetW);
  renderer.toneMappingExposure = lerp(renderer.toneMappingExposure, lerp(lerp(A.ex, B.ex, lf), P.ex, presetW), .1);
  const cx = camTs.x; kp.set(4, 8, 5).lerp(pp.set(P.pos[0], P.pos[1], P.pos[2]), presetW); key.position.set(cx + kp.x, kp.y, kp.z); key.target.position.set(cx, -1, 0);
  rim.position.set(cx - 3.5, 3, -4.5); fill.position.set(camPs.x + 1, camPs.y + 2.5, camPs.z + 1); fill.intensity = lerp(fill.intensity, S > 3.2 ? 22 : 55, .05); cool.position.set(cx + 4.5, 1.5, -3.5); cool.intensity = lerp(cool.intensity, S < 3.5 ? 50 : 22, .05);

  hero.visible = S < 1.8; plateSt.visible = S > .3 && S < 1.9; coffeeSt.visible = S > 1.1 && S < 2.9; redna.visible = S > 2.1 && S < 3.9; resSt.visible = S > 3.1;

  if (hero.visible) {
    logo.rotation.y = Math.sin(t * .5) * .38 + ptr.sx * .5; logo.rotation.x = -ptr.sy * .18 + Math.sin(t * .7) * .04; logo.position.y = -.4 + Math.sin(t * .9) * .12;
    hero.userData.ring.rotation.z += dt * .12;
    ray.setFromCamera(ndc.set(ptr.x, ptr.y, 0), camera); const hasHit = !MOBILE && ray.ray.intersectPlane(plane, hit);
    const kick = clamp(sv * .0006, -3, 3), T = REDUCE ? 0 : t;
    for (const f of floaters) {
      if (Math.abs(kick) > .15) { f.vel.y += kick * .22 * (.4 + Math.random()); f.vel.x += (Math.random() - .5) * Math.abs(kick) * .14; }
      f.vel.addScaledVector(f.off, -5.5 * dt); f.vel.multiplyScalar(1 - 1.8 * dt); f.off.addScaledVector(f.vel, dt);
      tmpV.set(f.p.x + Math.sin(T * .55 + f.ph) * f.amp + f.off.x, f.p.y + Math.sin(T * .8 + f.ph * 1.7) * f.amp * 1.4 + f.off.y, f.p.z + Math.cos(T * .6 + f.ph) * f.amp + f.off.z);
      if (hasHit) { const dx = tmpV.x - hit.x, dy = tmpV.y - hit.y, d2 = dx * dx + dy * dy; if (d2 < 3.2 && d2 > .001) { const kk = (1 - d2 / 3.2) * 14 * dt / Math.sqrt(d2); f.vel.x += dx * kk; f.vel.y += dy * kk; } }
      tmpQ.setFromAxisAngle(f.ax, (f.rs + f.vel.length() * .5) * dt); f.q.premultiply(tmpQ);
      tmpS.setScalar(f.s); tmpM.compose(tmpV, f.q, tmpS); f.mesh.setMatrixAt(f.i, tmpM);
      if (f.extra) { tmpM2.makeTranslation(0, .25, 0); f.extra.setMatrixAt(f.i, tmpM.clone().multiply(tmpM2)); }
    }
    hero.children.forEach(m => { if (m.isInstancedMesh) m.instanceMatrix.needsUpdate = true; });
    hero.userData.flour.rotation.y = t * .01; hero.userData.flour.position.y = Math.sin(t * .2) * .2;
  }
  if (plateSt.visible) {
    idleT += dt; if (!drag.on && idleT > 2.2) yawT += dt * .25;
    yaw = lerp(yaw, yawT + ptr.sx * .35, .08); plateYaw.rotation.y = yaw; plate.rotation.x = -ptr.sy * .05 + Math.sin(t * .6) * .01;
  }
  steamU.uTime.value = t; steamU.uScale.value = renderer.domElement.height / 900;
  if (redna.visible) {
    for (let i = 0; i < rData.length; i++) {
      const d = rData[i], kk = sm((redP - d.d) / .65); tmpV.copy(d.s).lerp(d.t, kk); tmpV.y += (1 - kk) * Math.sin(t * .8 + i) * .3;
      tmpQ.copy(d.q).slerp(IQ, kk); tmpS.setScalar(1); tmpM.compose(tmpV, tmpQ, tmpS); rMain.setMatrixAt(i, tmpM);
    }
    rMain.instanceMatrix.needsUpdate = true; redna.rotation.y = Math.sin(t * .35) * .12 * (.4 + redP) + ptr.sx * .12; redna.userData.glow.material.opacity = .15 + redP * .5; redna.userData.pt.intensity = 6 + redP * 26;
    const s3 = redna.userData.sat;
    for (let i = 0; i < sat.length; i++) { const s = sat[i], an = s.a + t * s.sp; tmpV.set(Math.cos(an) * s.r, s.y + Math.sin(t * .6 + s.ph) * .3, Math.sin(an) * s.r * .55 - 1.5); tmpQ.setFromAxisAngle(tmpAx, dt * .4); s.q.premultiply(tmpQ); tmpS.setScalar(s.s); tmpM.compose(tmpV, s.q, tmpS); s3.setMatrixAt(i, tmpM); }
    s3.instanceMatrix.needsUpdate = true;
  }
  if (resSt.visible) {
    const c = resSt.userData.card; c.rotation.x = lerp(c.rotation.x, .78 - ptr.sy * .08, .06); c.rotation.y = lerp(c.rotation.y, ptr.sx * .12, .06); c.position.y = TOP_Y + .75 + Math.sin(t * .8) * .04;
    const fl = 1 + Math.sin(t * 9) * .06 + Math.sin(t * 13.7) * .05; candleLight.intensity = 14 * fl; resSt.userData.flame.scale.set(.8 * (2 - fl), 1.9 * fl, .8 * (2 - fl));
  }

  if (composer) composer.render(); else renderer.render(scene, camera);

  if (++warm > 8) { frames++; fpsAcc += dt; }
  if (fpsAcc > 2.5) {
    const fps = frames / fpsAcc;
    if (fps < 30 && lowered < 3) { lowered++; if (composer) composer = null; else { DPR = Math.max(.9, DPR * .8); renderer.setPixelRatio(DPR); renderer.setSize(innerWidth, innerHeight, false); } }
    frames = 0; fpsAcc = 0;
  }
}

/* ---------- başlat ---------- */
measure(); scrollState(scrollY);
renderer.compile(scene, camera);
prog(100, 'Hazır');
requestAnimationFrame(frame);
window.__3d = true;
if (window.UK3D_ready) window.UK3D_ready();
if (window.UK && UK.lang) window.UK3D.lang(UK.lang());
