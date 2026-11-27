/* Ümit Kavi · Mutfaktan Masaya — sinematik 3B kaydırma hikâyesi (Three.js r170)
   Varlıklar: Poly Haven CC0 (modeller, dokular, HDRI) + Blender'da kesilmiş soğan parçaları. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const Q = new URLSearchParams(location.search);
const MOB = matchMedia('(max-width:820px)').matches || (matchMedia('(pointer:coarse)').matches && innerWidth < 1100);
const LOW = MOB || Q.has('low');
const NOFX = Q.has('nofx');
const canvas = document.getElementById('gl');
const prog = (n) => window.UK3D_progress && window.UK3D_progress(n);

/* ---------- yardımcılar ---------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const eio = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- renderer / sahne ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, powerPreference: 'high-performance' });
const DPR = Math.min(window.devicePixelRatio || 1, LOW ? 1.25 : 1.6);
renderer.setPixelRatio(DPR);
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0807);
scene.fog = new THREE.FogExp2(0x0d0907, 0.03);
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.04, 40);
camera.position.set(-0.6, 1.1, 0.8);

const mgr = new THREE.LoadingManager();
mgr.onProgress = (u, i, t) => prog(Math.round(i / t * 94));
const gltfL = new GLTFLoader(mgr).setMeshoptDecoder(MeshoptDecoder);
const texL = new THREE.TextureLoader(mgr);
const loadGLB = (n) => new Promise((res, rej) => gltfL.load('m/' + n + '.glb', g => res(g), undefined, rej));
const tcache = {};
function tex(file, srgb) {
  if (tcache[file]) return tcache[file];
  const t = texL.load('t/' + file + '.webp');
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = LOW ? 4 : 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return (tcache[file] = t);
}
function pbr(name, rx, ry, o = {}) {
  const m = new THREE.MeshStandardMaterial(Object.assign({ roughness: 1, metalness: 0 }, o));
  m.map = tex(name + '_Diffuse', true).clone(); m.normalMap = tex(name + '_nor_gl').clone(); m.roughnessMap = tex(name + '_Rough').clone();
  [m.map, m.normalMap, m.roughnessMap].forEach(t => { t.repeat.set(rx, ry); t.wrapS = t.wrapT = THREE.RepeatWrapping; });
  return m;
}
function shadowAll(o, cast = true, recv = true) { o.traverse(c => { if (c.isMesh) { c.castShadow = cast; c.receiveShadow = recv; } }); return o; }
function bbox(o) { return new THREE.Box3().setFromObject(o); }
function sit(o, x, y, z, ry = 0, s = 1) { // alt yüzeyi y'ye otur, x/z merkezle
  o.scale.setScalar(s); o.rotation.set(0, ry, 0); o.position.set(0, 0, 0); o.updateMatrixWorld(true);
  const b = bbox(o); const c = b.getCenter(V(0, 0, 0));
  o.position.set(x - c.x, y - b.min.y, z - c.z); return o;
}
const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(0,0,0,.9)'); r.addColorStop(.55, 'rgba(0,0,0,.35)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
function blob(x, y, z, w, d, op = .55) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: op, depthWrite: false, toneMapped: false, color: 0x000000 }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y + 0.0008, z); m.renderOrder = 2; scene.add(m); return m;
}
const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();

/* ---------- ortam (Poly Haven HDRI) ---------- */
const HDR = Q.get('hdri') || 'warm_restaurant_night';
const pmrem = new THREE.PMREMGenerator(renderer);
function loadEnv() {
  return new Promise(res => new RGBELoader(mgr).load('h/' + HDR + '_1k.hdr', t => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(t).texture; t.dispose();
    scene.environmentIntensity = 0.28; res();
  }, undefined, () => res()));
}

const STUDIO = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
/* ---------- ışıklar ---------- */
const SH = LOW ? 1024 : 2048;
function spot(x, y, z, tx, ty, tz, I, ang, col = 0xfff0e2) {
  const l = new THREE.SpotLight(col, I, 9, ang, .8, 2);
  l.position.set(x, y, z); l.target.position.set(tx, ty, tz); scene.add(l, l.target);
  l.castShadow = true; l.shadow.mapSize.set(SH, SH); l.shadow.bias = -0.0004; l.shadow.normalBias = 0.012; l.shadow.radius = 5; l.shadow.camera.near = .4; l.shadow.camera.far = 6;
  return l;
}
const L = {
  board: spot(0.35, 1.9, 1.0, 0.0, 0.94, 0.05, 40, .36),
  stove: spot(1.0, 1.9, 1.0, 0.62, 0.95, 0.05, 40, .36),
  plate: spot(1.65, 1.9, 1.0, 1.25, 0.95, 0.05, 40, .36),
  table: spot(2.4, 2.6, 1.0, 3.4, 0.75, 0.15, 30, .55, 0xffd7a8),
};
scene.add(new THREE.HemisphereLight(0xffe2c0, 0x1a0f08, 0.18));
const rim = new THREE.DirectionalLight(0x9db8ff, 0.30); rim.position.set(-1.5, 2.2, -2); scene.add(rim);
const flameLight = new THREE.PointLight(0xff9a40, 0, 2.2, 2); flameLight.position.set(0.62, 0.98, 0.05); scene.add(flameLight);
const plateFill = new THREE.PointLight(0xffe0bb, 0, 2.2, 2); scene.add(plateFill);
const candleLight = new THREE.PointLight(0xffa850, 0, 3.2, 2); scene.add(candleLight);

/* ---------- soğan malzemesi (katı doku: kesilen her yüzde halkalar) ---------- */
const uCook = { value: 0 };
const NOISE = `
float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
function onionMaterial(kind) {
  const flesh = kind === 'flesh';
  const m = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: flesh ? .34 : .3, clearcoat: flesh ? .2 : .3, clearcoatRoughness: .25 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uCook = uCook;
    sh.vertexShader = 'attribute vec3 aOP; varying vec3 vOP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vOP=aOP;');
    sh.fragmentShader = 'uniform float uCook; varying vec3 vOP;\n' + NOISE + '\n' + sh.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 q=vOP; float rr=length(q.xz);
      float yy=(q.y-0.036)/0.047; float s=sqrt((rr*rr)/(0.0388*0.0388)+yy*yy);
      float N=15.; float wob=vn(vec3(q.x*90.,q.y*60.,q.z*90.))*.06;
      float lay=floor(s*N+wob); float fr=fract(s*N+wob);
      float line=smoothstep(.0,.26,fr)*smoothstep(1.,.70,fr);
      float lv=h31(vec3(lay,3.1,7.7));
      vec3 baseA=vec3(.62,.60,.40), baseB=vec3(.56,.60,.37), lineC=vec3(.30,.42,.12);
      ${flesh ? `vec3 fl=mix(baseA,baseB,lv); fl=mix(lineC,fl,mix(.35,1.,line)); fl*=0.9+0.18*vn(q*260.);
      fl=mix(fl,vec3(.78,.86,.62),smoothstep(.22,.0,s)*.8);
      diffuseColor.rgb=fl;` : `
      float ang=atan(q.z,q.x); float vein=vn(vec3(ang*9.,q.y*4.,0.))*.5+vn(vec3(ang*22.,q.y*7.,3.))*.5;
      vec3 sk=mix(vec3(.62,.36,.10),vec3(.78,.55,.22),vein); sk*=.92+.16*vn(q*180.);
      diffuseColor.rgb=sk;`}
      float pat=smoothstep(.25,.75,vn(q*140.+7.)*.6+vn(q*400.)*.4);
      float edge=${flesh ? '(1.-line)*.35' : '.3'}; float ck=clamp(uCook*1.25-0.15*pat+edge*uCook+${flesh ? '0.0' : '0.18'},0.,1.);
      vec3 car=mix(vec3(.62,.32,.08),vec3(.30,.12,.02),pat*pat+edge*.5);
      diffuseColor.rgb=mix(diffuseColor.rgb,car,ck);
      `).replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor=mix(roughnessFactor,.14,uCook);').replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += diffuseColor.rgb*(.09*(1.-uCook*.6));');
  };
  m.customProgramCacheKey = () => 'onion' + kind;
  return m;
}
const MAT_SKIN = onionMaterial('skin'), MAT_FLESH = onionMaterial('flesh');
const uTime = { value: 0 };

/* ---------- malzemeler ---------- */
const TOP = 0.9;
const BOARD = { x: 0.0, z: 0.06 };
const matMarble = pbr('marble_01', 3, 1, { color: 0xa9a299 });
const matCab = pbr('dark_wood', 2, 1, { color: 0x8a6a52 });
const matTile = pbr('long_white_tiles', 4, 2.4, { color: 0x8c8274 });
const matFloor = pbr('dark_wooden_planks', 5, 4, { color: 0xb59a86 });
const matWall = pbr('beige_wall_001', 3, 1.6, { color: 0x8a7761 });
const matLinen = pbr('rough_linen', 1.6, 1.6, { color: 0xb9ae9a });
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, metalness: .85, roughness: .38 });
const blackGlass = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, metalness: .2, roughness: .22, clearcoat: 1, clearcoatRoughness: .05 });
const steel = new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: .2, envMap: STUDIO, envMapIntensity: 1.1 });
const brass = new THREE.MeshStandardMaterial({ color: 0xc89b4e, metalness: 1, roughness: .28 });
const W = { pieces: [], panG: new THREE.Group(), plateG: new THREE.Group() };

function box(w, h, d, mat, x, y, z, cast = true, recv = true) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = recv; scene.add(m); return m; }
function buildShell() {
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), matFloor); fl.rotation.x = -Math.PI / 2; fl.position.set(2.2, 0, 0.6); fl.receiveShadow = true; scene.add(fl);
  const X0 = -1.45, X1 = 1.95, cw = X1 - X0, cx = (X0 + X1) / 2;
  box(cw, 0.04, 0.72, matMarble, cx, TOP - 0.02, 0.0);
  box(cw - 0.02, 0.84, 0.62, matCab, cx, 0.43, -0.02);
  for (let i = 0; i < 6; i++) { const x = X0 + 0.28 + i * (cw - 0.4) / 5; box(0.012, 0.5, 0.012, brass, x, 0.55, 0.296); box(0.003, 0.7, 0.002, darkMetal, x + 0.28, 0.43, 0.292); }
  box(cw, 0.1, 0.6, darkMetal, cx, 0.05, -0.04);
  const sp = new THREE.Mesh(new THREE.PlaneGeometry(cw, 0.95), matTile); sp.position.set(cx, TOP + 0.475, -0.349); sp.receiveShadow = true; scene.add(sp);
  const wl = new THREE.Mesh(new THREE.PlaneGeometry(cw, 1.4), matWall); wl.position.set(cx, TOP + 0.95 + 0.7, -0.35); wl.receiveShadow = true; scene.add(wl);
  const dw = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.2), matWall); dw.position.set(4.7, 1.6, -1.45); dw.receiveShadow = true; scene.add(dw);
  const side = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 3.2), matWall); side.rotation.y = Math.PI / 2; side.position.set(1.95, 1.6, -0.92); scene.add(side);
  const side2 = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), matWall); side2.rotation.y = -Math.PI / 2; side2.position.set(5.9, 1.6, 0.1); scene.add(side2);
  // pencere: gece mavisi
  const wc = document.createElement('canvas'); wc.width = 64; wc.height = 256; const g = wc.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#6f8fc4'); gr.addColorStop(.55, '#33496f'); gr.addColorStop(1, '#1a2339'); g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
  const wt = new THREE.CanvasTexture(wc); wt.colorSpace = THREE.SRGBColorSpace;
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.5), new THREE.MeshBasicMaterial({ map: wt })); win.material.color.setScalar(.6); win.position.set(3.55, 1.45, -1.44); scene.add(win);
  const fm = darkMetal; box(1.68, .05, .06, fm, 3.55, 2.22, -1.42, false); box(1.68, .05, .06, fm, 3.55, .7, -1.42, false); box(.05, 1.52, .06, fm, 2.72, 1.46, -1.42, false); box(.05, 1.52, .06, fm, 4.38, 1.46, -1.42, false); box(.03, 1.5, .05, fm, 3.55, 1.46, -1.42, false); box(1.6, .03, .05, fm, 3.55, 1.46, -1.42, false);
  // raf + ray
  box(1.7, 0.035, 0.22, matCab, -0.1, 1.62, -0.24);
  box(2.0, 0.018, 0.018, brass, 0.55, 1.75, -0.28, false, false);
  // sarkıt lambalar
  [[-0.35, 1.55], [0.7, 1.55], [1.6, 1.55]].forEach(([x, y]) => {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x1b1714, metalness: .8, roughness: .35, side: THREE.DoubleSide }));
    dome.position.set(x, y + 0.2, 0.15); scene.add(dome);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(5.5, 3.6, 1.6), toneMapped: false })); bulb.position.set(x, y + 0.2 - 0.02, 0.15); scene.add(bulb);
    box(0.004, 0.9, 0.004, darkMetal, x, y + 0.68, 0.15, false, false);
  });
}
function buildHob() {
  const x = 0.62, z = 0.04;
  box(0.62, 0.012, 0.52, blackGlass, x, TOP + 0.006, z);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.0075, 10, 40), darkMetal); ring.rotation.x = Math.PI / 2; ring.position.set(x, TOP + 0.018, z); scene.add(ring);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.012, 32), new THREE.MeshStandardMaterial({ color: 0x232323, metalness: .7, roughness: .5 })); cap.position.set(x, TOP + 0.02, z); scene.add(cap);
  const iron = new THREE.MeshStandardMaterial({ color: 0x121214, metalness: .5, roughness: .55 });
  for (const dz of [-0.095, 0, 0.095]) box(0.46, 0.012, 0.012, iron, x, TOP + 0.045, z + dz);
  for (const dx of [-0.2, -0.07, 0.07, 0.2]) box(0.012, 0.012, 0.21, iron, x + dx, TOP + 0.045, z);
  for (const [dx, dz] of [[-0.21, -0.1], [0.21, -0.1], [-0.21, 0.1], [0.21, 0.1]]) box(0.014, 0.03, 0.014, iron, x + dx, TOP + 0.03, z + dz);
  for (let i = 0; i < 4; i++) { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.022, 20), darkMetal); k.rotation.x = Math.PI / 2; k.position.set(x - 0.2 + i * 0.13, 0.78, 0.31); scene.add(k); }
  // alev: kameraya dönük yumuşak mavi dilimler
  const N = 40; const geo = new THREE.PlaneGeometry(1, 1); const ph = new Float32Array(N);
  const inst = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { t: uTime, k: { value: 0 } },
    vertexShader: `uniform float t; uniform float k; attribute float ph; varying vec2 vUv2; varying float vA;
      void main(){ vec3 c=(instanceMatrix*vec4(0.,0.,0.,1.)).xyz; vec4 mv=modelViewMatrix*vec4(c,1.);
        float h=0.034*k*(.72+.28*sin(t*17.+ph*6.28)+.1*sin(t*33.+ph*9.));
        mv.xy+=vec2(position.x*0.011*(.5+.5*k), (position.y+.5)*h); mv.x+=sin(t*9.+ph*30.)*.0013*(position.y+.5);
        vUv2=position.xy+.5; vA=k; gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec2 vUv2; varying float vA;
      void main(){ float w=1.-abs(vUv2.x-.5)*2.; float sh=smoothstep(0.,.55,max(w,0.)*(1.1-vUv2.y*.85)); float a=sh*pow(clamp(1.-vUv2.y,0.,1.),.8);
        vec3 c=mix(vec3(.15,.38,1.7),vec3(.45,.85,1.2),smoothstep(0.,.55,vUv2.y)); c=mix(c,vec3(1.1,.6,.2),smoothstep(.8,1.,vUv2.y)*.5);
        gl_FragColor=vec4(c*vA*1.5,a*vA*.85);} `
  }), N);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < N; i++) { ph[i] = rnd(); const a = i / N * Math.PI * 2, r = 0.052; m4.makeTranslation(x + Math.cos(a) * r, TOP + 0.025, z + Math.sin(a) * r); inst.setMatrixAt(i, m4); }
  geo.setAttribute('ph', new THREE.InstancedBufferAttribute(ph, 1));
  inst.frustumCulled = false; inst.renderOrder = 5; scene.add(inst); W.flames = inst;
}
/* ---- tabak, bardak, çatal-bıçak, bıçak ---- */
function lathe(pts, mat, seg = 72) { return new THREE.Mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg), mat); }
const matPorcelain = new THREE.MeshPhysicalMaterial({ color: 0xdcd6ca, roughness: .26, clearcoat: 1, clearcoatRoughness: .08, sheen: .3, sheenColor: new THREE.Color(0xffffff) });
function makePlate() {
  const pts = [[0, 0.0085], [0.07, 0.0085], [0.098, 0.0105], [0.118, 0.0165], [0.1335, 0.0205], [0.1355, 0.0195], [0.1325, 0.0165], [0.115, 0.0115], [0.095, 0.0045], [0.07, 0.0015], [0.055, 0.0], [0.045, 0.0], [0, 0.0]];
  const m = lathe(pts, matPorcelain, 96); m.castShadow = m.receiveShadow = true; return m;
}
function makeGlass(wine) {
  const g = new THREE.Group();
  const gm = LOW ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: .2, side: THREE.DoubleSide, envMapIntensity: 1.6 })
    : new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.006, roughness: 0.02, ior: 1.5, side: THREE.DoubleSide, envMapIntensity: 1.6 });
  const pts = [[0.034, 0], [0.034, 0.002], [0.012, 0.0045], [0.0032, 0.009], [0.0028, 0.07], [0.006, 0.088], [0.020, 0.100], [0.034, 0.122], [0.0405, 0.150], [0.039, 0.178], [0.033, 0.198], [0.0315, 0.200]];
  g.add(lathe(pts, gm, 56));
  if (wine) {
    const wm = new THREE.MeshPhysicalMaterial({ color: 0x4a0a14, roughness: .05, transmission: LOW ? 0 : .5, thickness: .05, ior: 1.36, transparent: LOW, opacity: LOW ? .85 : 1, attenuationColor: new THREE.Color(0x6b0f1f), attenuationDistance: .03, side: THREE.DoubleSide });
    g.add(lathe([[0, 0.108], [0.0235, 0.109], [0.034, 0.125], [0.0385, 0.145], [0.0378, 0.158], [0, 0.158]], wm, 48));
  }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function cutlerySilhouette(kind) {
  const s = new THREE.Shape();
  if (kind === 'fork') {
    s.moveTo(-0.0035, 0); s.lineTo(0.0035, 0); s.lineTo(0.0085, 0.105); s.quadraticCurveTo(0.0125, 0.125, 0.0125, 0.140);
    s.lineTo(0.0125, 0.178); s.lineTo(0.0097, 0.178); s.lineTo(0.0097, 0.150); s.lineTo(0.0044, 0.150); s.lineTo(0.0044, 0.182); s.lineTo(0.0008, 0.182); s.lineTo(0.0008, 0.152);
    s.lineTo(-0.0008, 0.152); s.lineTo(-0.0008, 0.182); s.lineTo(-0.0044, 0.182); s.lineTo(-0.0044, 0.150); s.lineTo(-0.0097, 0.150); s.lineTo(-0.0097, 0.178); s.lineTo(-0.0125, 0.178);
    s.lineTo(-0.0125, 0.140); s.quadraticCurveTo(-0.0125, 0.125, -0.0085, 0.105); s.lineTo(-0.0035, 0);
  } else {
    s.moveTo(-0.0035, 0); s.lineTo(0.0035, 0); s.lineTo(0.0075, 0.105); s.bezierCurveTo(0.0195, 0.125, 0.0215, 0.165, 0.0, 0.185); s.bezierCurveTo(-0.0215, 0.165, -0.0195, 0.125, -0.0075, 0.105); s.lineTo(-0.0035, 0);
  }
  return s;
}
function makeCutlery(kind) { // sap ucu z=0, baş -z yönünde
  const geo = new THREE.ExtrudeGeometry(cutlerySilhouette(kind), { depth: 0.0016, bevelEnabled: true, bevelThickness: 0.0009, bevelSize: 0.0007, bevelSegments: 2, curveSegments: 14 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, 0.0009, 0);
  const m = new THREE.Mesh(geo, steel); m.castShadow = true; m.receiveShadow = true; return m;
}
function makeChefKnife() {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(0.100, 0.0); s.lineTo(0.100, 0.046); s.lineTo(0.0, 0.0445); s.bezierCurveTo(-0.07, 0.04, -0.11, 0.016, -0.118, 0.002); s.bezierCurveTo(-0.105, -0.003, -0.07, -0.0105, -0.03, -0.0105);
  s.lineTo(0.0, -0.0105); s.lineTo(0.100, -0.0105); s.lineTo(0.100, 0.0);
  const bg = new THREE.ExtrudeGeometry(s, { depth: 0.0012, bevelEnabled: true, bevelThickness: 0.0008, bevelSize: 0.0008, bevelSegments: 2, curveSegments: 24 });
  bg.translate(0, 0, -0.0006);
  const blade = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: .16, envMap: STUDIO, envMapIntensity: .6 })); g.add(blade);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.003, 0.0028), new THREE.MeshStandardMaterial({ color: 0xcfd3d9, metalness: 1, roughness: .28, envMap: STUDIO })); spine.position.set(0.045, 0.0452, 0); g.add(spine);
  const hm = new THREE.MeshStandardMaterial({ color: 0x3a2a22, roughness: .38, metalness: 0, map: tex('dark_wood_Diffuse', true), normalMap: tex('dark_wood_nor_gl') });
  const hg = new THREE.CapsuleGeometry(0.0125, 0.105, 6, 16); hg.rotateZ(Math.PI / 2); hg.scale(1, 1, 0.72);
  const handle = new THREE.Mesh(hg, hm); handle.position.set(0.17, 0.0215, 0); g.add(handle);
  const bol = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.0105, 0.014, 16), steel); bol.rotation.z = Math.PI / 2; bol.position.set(0.105, 0.0215, 0); bol.scale.set(1, 1, .75); g.add(bol);
  for (const x of [0.14, 0.17, 0.2]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.0021, 0.0021, 0.0185, 10), brass); r.rotation.x = Math.PI / 2; r.position.set(x, 0.0215, 0); g.add(r); }
  g.position.y = 0.0105; // kesici kenar y=0
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const wrap = new THREE.Group(); wrap.add(g); return wrap;
}
const leafTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.translate(64, 120); const gr = g.createLinearGradient(0, 0, 0, -118); gr.addColorStop(0, '#1f5a22'); gr.addColorStop(1, '#5fa83a'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0);
  for (let i = 0; i < 3; i++) { const o = (i - 1) * 40; g.bezierCurveTo(o - 22, -30, o - 30, -70, o, -110 + Math.abs(o) * .3); g.bezierCurveTo(o + 30, -70, o + 22, -30, 0, 0); } g.fill();
  g.strokeStyle = 'rgba(15,60,15,.55)'; g.lineWidth = 1.6; for (let i = 0; i < 3; i++) { const o = (i - 1) * 40; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(o * .5, -50, o, -100 + Math.abs(o) * .3); g.stroke(); for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(o * k * .2, -k * 18); g.lineTo(o * k * .2 + 14, -k * 18 - 10); g.moveTo(o * k * .2, -k * 18); g.lineTo(o * k * .2 - 14, -k * 18 - 10); g.stroke(); } } g.globalCompositeOperation = 'source-atop'; g.fillStyle = 'rgba(255,255,200,.10)'; g.fillRect(-64, -120, 128, 60); const t = new THREE.CanvasTexture(g.canvas); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const leafMat = new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: .5, side: THREE.DoubleSide, roughness: .55 });
function leaf(s, ry, tilt) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.016 * s, 0.016 * s), leafMat);
  m.rotation.set(-Math.PI / 2 + tilt, ry, 0, 'YXZ'); m.castShadow = true; m.userData.s = s; return m;
}


/* ---------- logo: tahtaya dağlama + masa kartı ---------- */
function drawMark(g, x, y, S, ink, acc) {
  g.save(); g.translate(x, y); g.scale(S / 120, S / 120); g.lineCap = 'round'; g.strokeStyle = ink; g.fillStyle = acc;
  g.lineWidth = 2.4; g.beginPath(); g.arc(60, 60, 55, 0, 7); g.stroke();
  g.lineWidth = 1.3; g.beginPath(); g.arc(60, 60, 47, -70 * Math.PI / 180, (-70 + 228 / 295.3 * 360) * Math.PI / 180); g.stroke();
  g.lineWidth = 1; g.beginPath(); g.arc(60, 60, 40, 40 * Math.PI / 180, (40 + 120 / 251.3 * 360) * Math.PI / 180); g.stroke();
  g.lineWidth = 5.8; g.beginPath(); g.moveTo(40.5, 34); g.lineTo(40.5, 86); g.moveTo(43, 62); g.lineTo(76, 36); g.stroke();
  g.beginPath(); g.moveTo(44.2, 62); g.lineTo(85, 91); g.lineTo(71, 91); g.closePath(); g.fill();
  g.translate(82, 32); g.rotate(28 * Math.PI / 180); g.beginPath(); g.ellipse(0, 0, 5.2, 8, 0, 0, 7); g.fill(); g.restore();
}
function logoDecals() {
  // 1) kesme tahtasına dağlama (alfa maskesi)
  { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 1024, 512);
    drawMark(g, 20, 36, 440, '#fff', '#fff'); g.fillStyle = '#fff'; g.font = '700 150px Georgia, serif'; g.textBaseline = 'alphabetic'; g.fillText('Ümit Kavi', 470, 290);
    g.font = '600 38px Helvetica, Arial, sans-serif'; g.fillText('MUTFAK · KAHVE · REDNA HUB', 474, 370);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.085), new THREE.MeshStandardMaterial({ color: 0x24120a, roughness: .9, alphaMap: t, transparent: true, opacity: .78, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.rotation.set(-Math.PI / 2, 0, 0.03); m.position.set(0.1, W.boardTop + 0.0009, BOARD.z + 0.07); m.receiveShadow = true; scene.add(m); W.boardLogo = m; }
  // 2) masa kartı (baskı)
  { const c = document.createElement('canvas'); c.width = 1024; c.height = 600; const g = c.getContext('2d'); g.fillStyle = '#efe6d3'; g.fillRect(0, 0, 1024, 600);
    const n = g.getImageData(0, 0, 1024, 600); for (let i = 0; i < n.data.length; i += 4) { const v = (Math.random() - .5) * 10; n.data[i] += v; n.data[i + 1] += v; n.data[i + 2] += v; } g.putImageData(n, 0, 0);
    g.strokeStyle = '#b8732c'; g.lineWidth = 3; g.strokeRect(26, 26, 972, 548);
    drawMark(g, 70, 150, 300, '#1d1510', '#b8732c'); g.fillStyle = '#1d1510'; g.font = '700 118px Georgia, serif'; g.fillText('Ümit Kavi', 400, 300);
    g.fillStyle = '#6a4a2a'; g.font = '600 32px Helvetica, Arial, sans-serif'; g.fillText('MUTFAK · KAHVE · REDNA HUB', 404, 370);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.0016, 0.0586), [0, 1, 2, 3, 4, 5].map(i => new THREE.MeshStandardMaterial(i === 2 ? { map: t, roughness: .8 } : { color: 0xe6dcc6, roughness: .8 })));
    card.position.set(3.16, W.tableTop + 0.0009, -0.1); card.rotation.y = 0.35; card.castShadow = card.receiveShadow = true; scene.add(card); W.card = card; }
}
/* ---------- ana yükleme ---------- */
async function build() {
  buildShell(); buildHob();
  const names = ['onion_cells', 'wooden_cutting_board', 'brass_pan_01', 'fish_knife', 'wooden_bowl_01', 'yellow_onion', 'food_lime_01', 'lemon', 'metal_jug', 'brass_pot_01', 'pot_enamel_01', 'wooden_spoon', 'round_wooden_table_02', 'dining_chair_02', 'wooden_candlestick'];
  const [onionG, boardG, panG, fishG, bowlG, wonG, limeG, lemonG, jugG, potG, potEG, spoonG, tableG, chairG, candleG] = await Promise.all(names.map(loadGLB));
  /* tahta */
  const board = boardG.scene; shadowAll(board); sit(board, BOARD.x, TOP, BOARD.z); scene.add(board); W.board = board;
  const boardTop = bbox(board).max.y; W.boardTop = boardTop;
  blob(BOARD.x, TOP, BOARD.z, 0.56, 0.34, .5);
  /* soğan parçaları: Blender'da kesilmiş hücreler */
  const GP = V(0.045, boardTop, BOARD.z); W.GP = GP;
  const rot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)); W.rot = rot;
  const defs = [];
  onionG.scene.traverse(node => {
    const mm = /^c_(\d+)_(\d+)$/.exec(node.name); if (!mm || (node.parent && /^c_\d+_\d+$/.test(node.parent.name))) return;
    const meshes = []; node.traverse(o => { if (o.isMesh) meshes.push(o); }); if (!meshes.length) return;
    const gs = meshes.map(m => {
      m.updateWorldMatrix(true, false); const g0 = m.geometry, p0 = g0.attributes.position, n = p0.count, P = new Float32Array(n * 3), NN = new Float32Array(n * 3);
      const nm = new THREE.Matrix3().getNormalMatrix(m.matrixWorld);
      for (let i = 0; i < n; i++) { const v = V(p0.getX(i), p0.getY(i), p0.getZ(i)).applyMatrix4(m.matrixWorld); P[i * 3] = v.x; P[i * 3 + 1] = v.y; P[i * 3 + 2] = v.z; const nv = V(g0.attributes.normal.getX(i), g0.attributes.normal.getY(i), g0.attributes.normal.getZ(i)).applyMatrix3(nm).normalize(); NN[i * 3] = nv.x; NN[i * 3 + 1] = nv.y; NN[i * 3 + 2] = nv.z; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.BufferAttribute(NN, 3)); g.setAttribute('aOP', new THREE.BufferAttribute(P.slice(), 3)); g.setIndex(g0.index.clone());
      return { g, flesh: /flesh/.test(m.material.name) };
    });
    gs.sort((a, b) => (a.flesh ? 1 : 0) - (b.flesh ? 1 : 0)); // 0 = deri, 1 = et
    const merged = gs.length > 1 ? mergeGeometries(gs.map(x => x.g), true) : gs[0].g;
    const mats = gs.length > 1 ? [MAT_SKIN, MAT_FLESH] : (gs[0].flesh ? MAT_FLESH : MAT_SKIN);
    merged.computeBoundingBox(); const c = merged.boundingBox.getCenter(V(0, 0, 0)); merged.translate(-c.x, -c.y, -c.z); merged.computeBoundingSphere();
    defs.push({ i: +mm[1], j: +mm[2], geo: merged, mats, c });
  });
  const pieceRoot = new THREE.Group(); scene.add(pieceRoot);
  const mkPiece = (d, clone) => {
    const mesh = new THREE.Mesh(d.geo, d.mats); mesh.castShadow = mesh.receiveShadow = true; pieceRoot.add(mesh);
    return { mesh, i: d.i, j: d.j, clone, c: d.c.clone(), rnd: [rnd(), rnd(), rnd(), rnd(), rnd(), rnd()], sz: 0.85 + rnd() * 0.25, sv: V(0.85 + rnd() * 0.3, 0.8 + rnd() * 0.35, 0.85 + rnd() * 0.3) };
  };
  defs.forEach(d => W.pieces.push(mkPiece(d, 0)));
  const CL = LOW ? 1 : 2;
  defs.forEach(d => { for (let k = 0; k < CL; k++) W.pieces.push(mkPiece(d, k + 1)); });
  const golden = Math.PI * (3 - Math.sqrt(5)); const NP = W.pieces.length;
  W.pieces.forEach((P, k) => {
    P.base = P.c.clone().applyQuaternion(rot).add(GP); P.q0 = rot.clone();
    const rr = Math.sqrt((k + 0.5) / NP) * 0.064, a = k * golden;
    P.panLocal = V(Math.cos(a) * rr, 0.0072 + P.rnd[0] * 0.003 + (k % 3) * 0.0016, Math.sin(a) * rr);
    P.panQ = new THREE.Quaternion().setFromEuler(new THREE.Euler((P.rnd[1] - .5) * 1.4, P.rnd[2] * 6.28, (P.rnd[3] - .5) * 1.4));
    const u = (k + .5) / NP, ph = Math.acos(1 - u * 0.9), th = k * golden, R = 0.040 * (0.5 + 0.5 * u);
    P.plateLocal = V(Math.sin(ph) * Math.cos(th) * R * 1.1, 0.0215 + Math.cos(ph) * 0.034, Math.sin(ph) * Math.sin(th) * R * 1.1);
    P.plateQ = new THREE.Quaternion().setFromEuler(new THREE.Euler((P.rnd[4] - .5) * 1.7, P.rnd[5] * 6.28, (P.rnd[0] - .5) * 1.7));
    P.cutSlide = (P.rnd[1] - .5) * 0.004;
    P.xCross = P.base.x + 0.016 + 0.004 * P.j + P.rnd[2] * 0.006;
  });
  /* bıçak */
  W.knife = makeChefKnife(); scene.add(W.knife);
  /* tava */
  const pan = panG.scene; shadowAll(pan); pan.rotation.y = -Math.PI / 2; pan.updateMatrixWorld(true);
  const pb = bbox(pan); pan.position.set(0, -pb.min.y, 0); W.pan = pan; W.panG.add(pan); scene.add(W.panG);
  W.panG.position.set(0.62, TOP + 0.052, 0.04); W.panRest = W.panG.position.clone();
  const oil = new THREE.Mesh(new THREE.CircleGeometry(0.066, 40), new THREE.MeshPhysicalMaterial({ color: 0xc78a2a, roughness: .02, clearcoat: 1, clearcoatRoughness: .02, transparent: true, opacity: 0, envMapIntensity: 2.2, depthWrite: false }));
  oil.rotation.x = -Math.PI / 2; oil.position.y = 0.0062; W.panG.add(oil); W.oil = oil;
  /* kaşık */
  const spoon = spoonG.scene; shadowAll(spoon); spoon.scale.setScalar(0.8); const sg = new THREE.Group(); sg.add(spoon); scene.add(sg); W.spoon = sg; spoon.updateMatrixWorld(true);
  { const b = bbox(spoon); const c = b.getCenter(V(0, 0, 0)); spoon.position.set(-c.x, -b.min.y, -c.z); }
  sg.position.set(1.05, TOP, 0.2); sg.rotation.y = 0.4; W.spoonRest = sg.position.clone();
  /* tezgâh üstü: kase+soğanlar, limon, lime, sürahi */
  const bowl = bowlG.scene; shadowAll(bowl); sit(bowl, -0.62, TOP, -0.08, 0.3); scene.add(bowl); blob(-0.62, TOP, -0.08, 0.42, 0.42, .45);
  const bb = bbox(bowl);
  [[-0.645, 0.0], [-0.585, -0.04], [-0.615, -0.105]].forEach(([x, z], i) => { const o = wonG.scene.clone(true); shadowAll(o); sit(o, x, bb.min.y + 0.03, z, i * 1.7, 1.1); scene.add(o); });
  [[lemonG, -0.60, bb.min.y + 0.04, -0.12, 0.8], [limeG, 0.2, TOP, -0.22, 0.6], [limeG, 0.27, TOP, -0.25, 2.1], [lemonG, 0.14, TOP, -0.26, 1.2], [jugG, -0.98, TOP, -0.18, 0]].forEach(([g, x, y, z, r]) => { const o = g.scene.clone(true); shadowAll(o); sit(o, x, y, z, r, 1); scene.add(o); if (y === TOP) blob(x, TOP, z, g === jugG ? .26 : .1, g === jugG ? .26 : .1, .5); });
  /* asma tencereler */
  [[-0.55, potG], [-0.18, potEG], [0.25, potG], [0.7, potEG]].forEach(([x, g], i) => { const o = g.scene.clone(true); shadowAll(o); o.scale.setScalar(0.9); o.updateMatrixWorld(true); const b = bbox(o); o.position.set(x - (b.min.x + b.max.x) / 2, 1.73 - b.max.y, -0.30 - (b.min.z + b.max.z) / 2); scene.add(o); });
  /* ot yaprakları (tahtada) */
  W.herbBoard = []; for (let i = 0; i < 9; i++) { const l = leaf(1.4, rnd() * 6.28, 0); l.position.set(0.16 + rnd() * 0.06, boardTop + 0.0012 + i * 0.0006, BOARD.z - 0.07 + rnd() * 0.07); scene.add(l); W.herbBoard.push(l); }
  /* tabak istasyonu */
  const plate = makePlate(); W.plateG.add(plate); W.plateG.position.set(1.25, TOP, 0.06); scene.add(W.plateG); W.plateRest = W.plateG.position.clone();
  W.plateBlob = blob(1.25, TOP, 0.06, 0.34, 0.34, .5);
  for (let k = 0; k < 3; k++) { const p2 = makePlate(); p2.position.set(1.62, TOP + k * 0.0125, -0.18); scene.add(p2); }
  blob(1.62, TOP, -0.18, .34, .34, .45);
  /* sos: boncuk zinciri + damlalar */
  const sauceMat = new THREE.MeshPhysicalMaterial({ color: 0x2a0b06, roughness: .06, clearcoat: 1, clearcoatRoughness: .02, ior: 1.45, envMapIntensity: 1.6 });
  W.sauce = [];
  const curve = new THREE.CatmullRomCurve3([V(-0.098, 0, 0.045), V(-0.07, 0, 0.085), V(-0.02, 0, 0.102), V(0.04, 0, 0.09), V(0.09, 0, 0.05), V(0.108, 0, -0.005)]);
  for (let i = 0; i < 36; i++) { const t = i / 35; const p = curve.getPoint(t); const r = 0.0052 * (0.35 + 0.65 * Math.sin(Math.PI * Math.pow(t, .8))) + 0.0012; const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 8), sauceMat); m.position.set(p.x, 0.0095 + r * 0.32, p.z); m.userData = { t, r }; W.plateG.add(m); W.sauce.push(m); }
  W.drops = []; [[-0.07, -0.03, .0068], [-0.095, -0.065, .0044], [0.0, -0.092, .0055], [0.06, -0.075, .0038], [0.098, -0.052, .0046], [-0.045, -0.095, .0032]].forEach(([x, z, r]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 10), sauceMat); m.position.set(x, 0.0095 + r * .42, z); m.userData = { r }; W.plateG.add(m); W.drops.push(m); });
  W.herbPlate = []; for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, r = 0.012 + rnd() * 0.03; const l = leaf(1.1 + rnd() * .6, rnd() * 6.28, (rnd() - .5) * .9); l.position.set(Math.cos(a) * r, 0.0215 + 0.024 + rnd() * 0.012, Math.sin(a) * r); W.plateG.add(l); W.herbPlate.push(l); }
  /* yemek odası */
  const table = tableG.scene; shadowAll(table); sit(table, 3.4, 0, 0.12); scene.add(table); const tb = bbox(table); const tTop = tb.max.y;
  blob(3.4, 0, 0.12, 1.4, 1.4, .5);
  const cloth = new THREE.Mesh(new THREE.CircleGeometry(0.43, 56), matLinen); cloth.rotation.x = -Math.PI / 2; cloth.position.set(3.4, tTop + 0.0015, 0.12); cloth.receiveShadow = true; scene.add(cloth);
  W.tableTop = tTop + 0.0015; W.servePos = V(3.34, W.tableTop, 0.22);
  const p2 = makePlate(); p2.position.set(3.46, W.tableTop, -0.14); p2.rotation.y = 0.5; scene.add(p2);
  const gl1 = makeGlass(true); gl1.position.set(3.55, W.tableTop, -0.02); scene.add(gl1);
  const gl2 = makeGlass(false); gl2.position.set(3.28, W.tableTop, -0.2); scene.add(gl2);
  const candle = candleG.scene; shadowAll(candle); sit(candle, 3.68, W.tableTop, 0.0, 0.4, 0.95); scene.add(candle);
  const cb = bbox(candle);
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.0125, 0.0125, 0.16, 20), new THREE.MeshPhysicalMaterial({ color: 0xf1e7cf, roughness: .5, sheen: 1, sheenColor: new THREE.Color(0xffe0a0) })); wax.position.set(3.68, cb.max.y + 0.045, 0.0); wax.castShadow = true; scene.add(wax);
  const cTop = wax.position.y + 0.08;
  W.candleFlame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(5, 2.6, 0.7), blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); W.candleFlame.scale.set(0.028, 0.05, 1); W.candleFlame.position.set(3.68, cTop + 0.022, 0.0); scene.add(W.candleFlame);
  W.candleHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(1.3, .6, .18), blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: .8 })); W.candleHalo.scale.set(0.3, 0.3, 1); W.candleHalo.position.copy(W.candleFlame.position); scene.add(W.candleHalo);
  candleLight.position.set(3.68, cTop + 0.04, 0.0);
  const np = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.012, 0.19, 8, 1, 12), matLinen.clone()); np.position.set(3.02, W.tableTop + 0.006, 0.22); np.rotation.y = 0.12; np.castShadow = np.receiveShadow = true; scene.add(np);
  { const g = np.geometry, p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + (Math.sin(p.getX(i) * 60) * .0012 + Math.sin(p.getZ(i) * 40) * .0010)); g.computeVertexNormals(); }
  const fk = makeCutlery('fork'); fk.position.set(3.17, W.tableTop, 0.31); scene.add(fk);
  const kn = fishG.scene; shadowAll(kn); { const kg = new THREE.Group(); scene.add(kg); kg.add(kn); kn.rotation.x = Math.PI / 2; kn.updateMatrixWorld(true); const b0 = bbox(kn), c0 = b0.getCenter(V(0, 0, 0)); kn.position.set(-c0.x, -b0.min.y, -c0.z); kg.position.set(3.51, W.tableTop, 0.22); kg.rotation.y = 0; kg.scale.setScalar(1.0); }
  const sp2 = makeCutlery('spoon'); sp2.position.set(3.555, W.tableTop, 0.31); scene.add(sp2);
  [[3.4, -0.72, 0], [3.4, 0.95, Math.PI]].forEach(([x, z, r]) => { const c = chairG.scene.clone(true); shadowAll(c); sit(c, x, 0, z, r, 1.0); scene.add(c); blob(x, 0, z, .6, .6, .5); });
  // toz zerreleri
  const dn = 160, dp = new Float32Array(dn * 3), dsd = []; for (let i = 0; i < dn; i++) { dp[i * 3] = -0.8 + rnd() * 4.5; dp[i * 3 + 1] = 0.9 + rnd() * 1.1; dp[i * 3 + 2] = -0.6 + rnd() * 2.0; dsd.push([rnd(), rnd(), rnd()]); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dp.slice(), 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: glowTex, size: 0.012, color: new THREE.Color(1.6, 1.2, .8), transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); scene.add(dust); W.dust = { pts: dust, base: dp, sd: dsd };
  const SN = 90, sp = new Float32Array(SN * 3), sd = []; for (let i = 0; i < SN; i++) sd.push({ ph: rnd(), x: (rnd() - .5) * .1, z: (rnd() - .5) * .1, sp: .6 + rnd() * .6 });
  const sgm = new THREE.BufferGeometry(); sgm.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const st = new THREE.Points(sgm, new THREE.PointsMaterial({ map: glowTex, size: 0.085, color: 0xeeeeee, transparent: true, opacity: 0, depthWrite: false })); st.frustumCulled = false; scene.add(st); W.steam = { pts: st, sd, N: SN };
  logoDecals();
  if (Q.has('noflame')) W.flames.visible = false; if (Q.has('nosteam')) W.steam.pts.visible = false;
  buildKeyframes(); prog(97);
}

/* ---------- kamera anahtarları ---------- */
let KF = [], curvePos, curveTgt;
function buildKeyframes() {
  // p, pos, hedef, fov, bulanıklık
  KF = [
    [0.00, [-0.62, 1.10, 0.86], [0.02, 0.95, 0.03], 31, 0.8],
    [0.05, [-0.30, 1.12, 0.70], [0.02, 0.96, 0.04], 29, 1.0],
    [0.12, [0.05, 1.20, 0.62], [0.0, 0.955, 0.05], 28, 1.1],
    [0.22, [0.22, 1.18, 0.58], [0.0, 0.955, 0.05], 28, 1.2],
    [0.30, [0.10, 1.26, 0.52], [0.0, 0.95, 0.05], 28, 1.2],
    [0.40, [-0.06, 1.22, 0.56], [0.0, 0.95, 0.04], 28, 1.2],
    [0.47, [0.26, 1.22, 0.64], [0.2, 0.97, 0.04], 30, 1.0],
    [0.54, [0.70, 1.22, 0.62], [0.60, 0.96, 0.04], 30, 1.0],
    [0.64, [0.50, 1.20, 0.55], [0.62, 0.97, 0.04], 28, 1.2],
    [0.70, [0.82, 1.18, 0.52], [0.78, 0.97, 0.05], 28, 1.0],
    [0.76, [1.28, 1.14, 0.50], [1.25, 0.95, 0.06], 27, 1.3],
    [0.82, [1.28, 1.02, 0.34], [1.25, 0.94, 0.06], 28, 1.0],
    [0.87, [1.90, 1.20, 0.60], [2.15, 1.00, 0.12], 32, 0.8],
    [0.93, [2.62, 1.20, 0.98], [3.34, 0.80, 0.18], 30, 0.9],
    [1.00, [2.78, 1.05, 0.78], [3.38, 0.80, 0.12], 28, 1.1],
  ];

  curvePos = new THREE.CatmullRomCurve3(KF.map(k => V(...k[1])), false, 'centripetal');
  curveTgt = new THREE.CatmullRomCurve3(KF.map(k => V(...k[2])), false, 'centripetal');
}
const camPos = V(0, 0, 0), camTgt = V(0, 0, 0);
function camAt(p, out = {}) {
  p = clamp(p, 0, 1); let k = 0; while (k < KF.length - 2 && p > KF[k + 1][0]) k++;
  const s0 = (p - KF[k][0]) / (KF[k + 1][0] - KF[k][0]); const s = lerp(s0, eio(s0), .65);
  const u = (k + s) / (KF.length - 1);
  curvePos.getPoint(u, camPos); curveTgt.getPoint(u, camTgt);
  const fol = sstep(0.795, 0.83, p) * (1 - sstep(0.9, 0.935, p));
  if (fol > 0 && W.plateG) { const pg = W.plateG.position; camTgt.lerp(tmpV2.set(pg.x, pg.y + 0.03, pg.z), fol); camPos.lerp(tmpV.set(pg.x - 0.32 + 0.1 * sstep(0.84, 0.9, p), pg.y + 0.25, pg.z + 0.44), fol); }
  out.fov = lerp(KF[k][3], KF[k + 1][3], s); out.ap = lerp(KF[k][4], KF[k + 1][4], s); return out;
}
if (Q.has('cam')) { window.UK3D_cam = (a) => { }; }

/* ---------- animasyon ---------- */
const tmpV = V(0, 0, 0), tmpV2 = V(0, 0, 0), tmpQ = new THREE.Quaternion(), tmpQ2 = new THREE.Quaternion(), _pw = V(0, 0, 0), _pq = new THREE.Quaternion();
const YAX = V(0, 1, 0);
const ST = { cut: 0, gather: 0, cross: 0, scoop: 0, stir: 0, cook: 0, pour: 0, deco: 0, serve: 0 };
const ys = [-0.040, -0.0322, -0.0251, -0.0183, -0.0104, -0.0031, 0.0048, 0.0127, 0.0208, 0.0291, 0.040];
const zs = [-0.01, 0.0108, 0.0226, 0.0361, 0.0468, 0.0602, 0.0723, 0.09];
function stagesFromP(p) {
  ST.cut = 9 * clamp((p - 0.012) / (0.262 - 0.012));
  ST.gather = sstep(0.268, 0.305, p);
  ST.cross = 7 * clamp((p - 0.318) / (0.438 - 0.318));
  ST.scoop = clamp((p - 0.445) / (0.515 - 0.445));
  ST.stir = clamp((p - 0.52) / (0.69 - 0.52));
  ST.cook = clamp((p - 0.52) / (0.68 - 0.52));
  ST.pour = clamp((p - 0.695) / (0.755 - 0.695));
  ST.deco = clamp((p - 0.755) / (0.815 - 0.755));
  ST.serve = clamp((p - 0.835) / (0.925 - 0.835));
}
function panWorld(P) { // tavadaki dünya konumu (karıştırma + zıplama)
  const r0 = Math.hypot(P.panLocal.x, P.panLocal.z), a0 = Math.atan2(P.panLocal.z, P.panLocal.x);
  const a = a0 + ST.stir * (4.2 + 3 * (1 - r0 / 0.07));
  const hop = Math.max(0, Math.sin(ST.stir * 60 + P.rnd[0] * 9)) * 0.0045 * clamp(ST.stir * 3) * (1 - sstep(.9, 1, ST.stir));
  _pw.set(Math.cos(a) * r0, P.panLocal.y + hop, Math.sin(a) * r0); W.panG.localToWorld(_pw); return _pw;
}
function panWorldQ(P) { tmpQ2.setFromAxisAngle(YAX, ST.stir * 4 + P.rnd[1] * 6); _pq.copy(W.panG.quaternion).multiply(tmpQ2).multiply(P.panQ); return _pq; }
function pieceUpdate(P) {
  const i = P.i, j = P.j, clone = P.clone, m = P.mesh, GP = W.GP;
  const cutFrac = clamp(ST.cut - i, 0, 1), slide = sstep(0.5, 0.95, cutFrac);
  const apart = slide * (1 - ST.gather);
  const cs = sstep(0.5, 0.95, clamp(ST.cross - j, 0, 1));
  // 1) boyuna kesim: şeritler +z'ye kayar
  tmpV.copy(P.base).sub(GP);
  tmpV.z += apart * (0.012 + P.rnd[0] * 0.005 + i * 0.0018); tmpV.x += apart * P.cutSlide;
  // 2) toparlanma + 90° döndürme (şef bütün şeritleri toplayıp döndürür)
  const G = eio(ST.gather), th = -Math.PI / 2 * G;
  tmpV.applyAxisAngle(YAX, th); tmpV.z += 0.04 * G;
  // 3) enine kesim: kesilen sütun +z'ye (öne) kayar
  tmpV.z += cs * (0.014 + 0.0035 * j + P.rnd[2] * 0.006); tmpV.x += cs * (P.rnd[4] - .5) * 0.012;
  m.position.copy(tmpV).add(GP);
  tmpQ.setFromAxisAngle(YAX, th + apart * (P.rnd[1] - .5) * 0.07 + cs * (P.rnd[3] - .5) * 0.22); m.quaternion.copy(tmpQ).multiply(P.q0);
  let sc = 1, vis = true;
  if (clone) vis = false;
  const s = ST.scoop;
  if (s > 0) {
    const nx = clamp((-(P.base.z - GP.z) + 0.045) / 0.09);
    const t0 = 0.12 + 0.42 * nx + 0.06 * P.rnd[0] + (clone ? 0.05 * clone : 0);
    const f = eio(clamp((s - t0) / 0.38));
    if (clone) { vis = s > t0 + 0.02; sc = clamp((s - t0) / 0.1); }
    if (f > 0) {
      tmpV.copy(m.position); tmpV2.copy(panWorld(P));
      m.position.lerpVectors(tmpV, tmpV2, f); m.position.y += Math.sin(Math.PI * f) * (0.07 + 0.04 * P.rnd[1]);
      m.quaternion.slerp(panWorldQ(P), f);
    }
  }
  if (ST.stir > 0 && ST.pour <= 0) { m.position.copy(panWorld(P)); m.quaternion.copy(panWorldQ(P)); if (clone) { vis = true; sc = 1; } }
  if (ST.pour > 0) {
    const d2 = P.rnd[2] * 0.5 + (clone ? .25 : 0), a = eio(clamp((ST.pour - d2 * 0.55) / 0.45));
    tmpV.copy(panWorld(P)); const q0 = panWorldQ(P).clone();
    tmpV2.copy(P.plateLocal).add(W.plateRest);
    m.position.lerpVectors(tmpV, tmpV2, a); m.position.y += Math.sin(Math.PI * a) * 0.09; m.quaternion.slerpQuaternions(q0, P.plateQ, a);
    if (clone) { vis = true; sc = 1; }
    if (ST.deco > 0 || ST.pour >= 1) {
      m.position.copy(P.plateLocal).applyAxisAngle(YAX, W.plateG.rotation.y).add(W.plateG.position); m.quaternion.setFromAxisAngle(YAX, W.plateG.rotation.y).multiply(P.plateQ);
    }
  }
  m.visible = vis; { const shr = 1 - 0.14 * ST.cook; m.scale.copy(P.sv).multiplyScalar(Math.max(.001, sc) * P.sz * shr); }
}
function knifeUpdate() {
  const kn = W.knife, GP = W.GP, H = 0.085, BT = W.boardTop;
  const planeZ = (k) => GP.z - ys[Math.min(10, k + 1)] + 0.0016;
  const crossZ = (k) => GP.z + 0.04 - zs[Math.min(7, k + 1)] + 0.0016;
  const cyc = (f) => H * (0.5 + 0.5 * Math.cos(2 * Math.PI * clamp(f)));
  const REST = { x: GP.x - 0.02, y: 0.009, z: BOARD.z - 0.105, yaw: 0.12, roll: Math.PI / 2 };
  let x, y, z, yaw = 0, pitch = 0, roll = 0;
  const A = ST.cut, G = ST.gather, C = ST.cross, S = ST.scoop;
  if (G <= 0 && C <= 0 && S <= 0) {
    const kk = Math.min(8, Math.floor(A)), f = A >= 9 ? 1 : A - kk;
    z = A >= 9 ? planeZ(8) : lerp(planeZ(kk), planeZ(kk + 1), sstep(.55, .95, f)); y = cyc(f); x = 0.0; pitch = -0.14 * (y / H); if (A >= 9) y = H;
  } else if (C <= 0 && S <= 0) {
    const t = eio(G); x = lerp(0.0, GP.x - 0.01, t); z = lerp(planeZ(8), crossZ(-1 + 0) + 0.0, t); y = H; pitch = 0;
  } else if (S <= 0) {
    const kk = Math.min(6, Math.floor(C)), f = C >= 7 ? 1 : C - kk;
    z = C >= 7 ? crossZ(6) : lerp(crossZ(kk - 1 < -1 ? -1 : kk - 1), crossZ(kk), 1) * 0 + (kk === 0 ? lerp(crossZ(-1), crossZ(0), sstep(.55, .95, f) * 0 + 1) : crossZ(kk));
    z = C >= 7 ? crossZ(6) : lerp(crossZ(kk), crossZ(kk + 1), sstep(.55, .95, f));
    y = C >= 7 ? H : cyc(f); x = GP.x - 0.01; pitch = -0.14 * (y / H);
  } else {
    const turn = sstep(0.0, 0.14, S), sw = sstep(0.14, 0.62, S), ret = sstep(0.68, 1, S);
    const x0 = GP.x - 0.07, x1 = GP.x + 0.2;
    x = lerp(x0, x1, sw); z = GP.z + 0.04 - 0.0; y = lerp(H, 0.0, sstep(0, 0.1, S)) + Math.sin(Math.PI * ret) * 0.07; yaw = Math.PI / 2 * turn;
    x = lerp(x, REST.x, ret); z = lerp(z, REST.z, ret); y = lerp(y, REST.y, ret); yaw = lerp(yaw, REST.yaw, ret); roll = REST.roll * ret;
  }
  kn.position.set(x, BT + y, z);
  kn.rotation.order = 'YXZ'; kn.rotation.set(roll, yaw, pitch);
}

const plateTmp = V(0, 0, 0);
function updateWorld(p, t) {
  stagesFromP(p); uCook.value = ST.cook; uTime.value = t; MAT_SKIN.clearcoat = MAT_FLESH.clearcoat = 0.25 + 0.75 * ST.cook; MAT_SKIN.clearcoatRoughness = MAT_FLESH.clearcoatRoughness = 0.25 - 0.18 * ST.cook;
  knifeUpdate();
  /* tava: sallanma + boşaltma eğimi */
  const shake = ST.stir > 0 ? sstep(0, .12, ST.stir) * (1 - sstep(.92, 1, ST.stir)) : 0;
  W.panG.position.copy(W.panRest);
  W.panG.position.x += Math.sin(ST.stir * 70) * 0.012 * shake; W.panG.position.z += Math.sin(ST.stir * 43 + 1) * 0.008 * shake;
  const mv = ST.pour > 0 ? Math.sin(Math.PI * clamp(ST.pour * 1.2)) : 0;
  W.panG.rotation.set(0, 0, -mv * 0.42);
  W.panG.position.x += mv * 0.32; W.panG.position.y += mv * 0.07;
  W.panG.updateMatrixWorld(true);
  /* ocak/alev/yağ/buhar */
  const fk = sstep(0.49, 0.53, p) * (1 - sstep(0.69, 0.73, p));
  W.flames.material.uniforms.k.value = fk;
  flameLight.intensity = fk * (1.1 + Math.sin(t * 17) * .12 + Math.sin(t * 29) * .08);
  W.oil.material.opacity = sstep(0.49, 0.52, p) * (1 - sstep(0.69, 0.72, p)) * 0.55;
  /* kaşık */
  const sg = W.spoon, sx = sstep(0.53, 0.57, p) * (1 - sstep(0.67, 0.70, p));
  if (sx > 0) { const a = ST.stir * 14; sg.position.set(W.panRest.x + Math.cos(a) * 0.035 + (1 - sx) * 0.08, W.panRest.y + 0.032 + (0.05 + 0.1) * (1 - sx), W.panRest.z + Math.sin(a) * 0.035 + 0.02 * (1 - sx)); sg.rotation.set(0, -a + Math.PI / 2, 0.5); }
  else { sg.position.copy(W.spoonRest); sg.rotation.set(0, 0.4, 0); }
  /* tabak servisi */
  const e = eio(ST.serve), a = W.plateRest, b = W.servePos, mid = V((a.x + b.x) / 2 - 0.2, TOP + 0.16, (a.z + b.z) / 2 + 0.14);
  const u = 1 - e;
  W.plateG.position.set(u * u * a.x + 2 * u * e * mid.x + e * e * b.x, u * u * a.y + 2 * u * e * mid.y + e * e * b.y, u * u * a.z + 2 * u * e * mid.z + e * e * b.z);
  W.plateG.rotation.set(0, e * 0.5, Math.sin(Math.PI * e) * 0.03); W.plateG.updateMatrixWorld(true);
  W.plateBlob.visible = ST.serve < 0.03;
  /* sos / damla / ot */
  const sd = ST.deco;
  W.sauce.forEach(m => { const k = sstep(m.userData.t * .55, m.userData.t * .55 + .4, sd * 1.2); m.visible = k > 0.001; m.scale.set(k, .32 * k, k); });
  W.drops.forEach((m, i) => { const k = Math.max(0, easeOutBack(clamp((sd - 0.45 - i * 0.06) / 0.18))); m.visible = k > 0.001; m.scale.set(k, k * .42, k); });
  W.herbPlate.forEach((m, i) => { const k = Math.max(0.0001, easeOutBack(clamp((sd - 0.6 - i * 0.02) / 0.2))); m.visible = k > 0.001; m.scale.setScalar(k); });
  W.herbBoard.forEach((m, i) => { const k = 1 - sstep(.3, .9, ST.scoop) * (i % 2 ? 1 : .6); m.scale.setScalar(Math.max(.001, k)); m.visible = k > .01; });
  W.pieces.forEach(pieceUpdate);
  /* buhar */
  const sw = W.steam, ss = sstep(0.53, 0.58, p) * (1 - sstep(0.70, 0.74, p));
  sw.pts.material.opacity = ss * 0.26; const pa = sw.pts.geometry.attributes.position;
  for (let i = 0; i < sw.N; i++) { const d = sw.sd[i], uu = (t * 0.35 * d.sp + d.ph) % 1; pa.setXYZ(i, W.panRest.x + d.x * (1 + uu * 1.5) + Math.sin(t + i) * 0.01 * uu, W.panRest.y + 0.05 + uu * 0.55, W.panRest.z + d.z * (1 + uu * 1.5)); }
  pa.needsUpdate = true; sw.pts.material.size = 0.07 + 0.05 * Math.sin(t * .7);
  { const f = 1 + Math.sin(t * 11) * .06 + Math.sin(t * 23.7) * .05; W.candleFlame.scale.set(0.026 * f, 0.05 * (1 + Math.sin(t * 9) * .08), 1); candleLight.intensity = sstep(0.8, 0.9, p) * (2.4 + Math.sin(t * 13) * .25 + Math.sin(t * 7.7) * .2); W.candleHalo.material.opacity = .55 + Math.sin(t * 6) * .05; }
  const da = W.dust.pts.geometry.attributes.position; for (let i = 0; i < da.count; i++) { const sd2 = W.dust.sd[i]; da.setXYZ(i, W.dust.base[i * 3] + Math.sin(t * .13 + sd2[0] * 20) * 0.12, W.dust.base[i * 3 + 1] + Math.sin(t * .09 + sd2[1] * 20) * 0.1, W.dust.base[i * 3 + 2] + Math.cos(t * .11 + sd2[2] * 20) * 0.1); } da.needsUpdate = true;
  plateFill.position.set(W.plateG.position.x - 0.1, W.plateG.position.y + 0.4, W.plateG.position.z + 0.35); plateFill.intensity = 1.6 * sstep(0.8, 0.84, p) * (1 - sstep(0.92, 0.95, p));
  L.board.intensity = 40 * (1 - 0.5 * sstep(0.42, 0.5, p)); L.stove.intensity = 8 + 20 * sstep(0.42, 0.5, p) * (1 - sstep(0.7, 0.76, p));
  L.plate.intensity = 12 + 30 * sstep(0.66, 0.74, p) * (1 - sstep(0.86, 0.92, p)); L.table.intensity = 10 + 24 * sstep(0.78, 0.92, p);
  scene.environmentIntensity = 0.28 + 0.1 * sstep(0.84, 0.95, p);
}

/* ---------- post-işleme ---------- */
let composer = null, grain = null;
const GRAIN = {
  uniforms: { tDiffuse: { value: null }, t: { value: 0 }, amt: { value: 0.045 }, vig: { value: 0.55 }, asp: { value: innerWidth / innerHeight } },
  vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float t,amt,vig,asp; varying vec2 vUv;
  float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+t*3.)*43758.5453);}
  void main(){ vec2 uv=vUv; vec2 d=uv-.5; float r=dot(d*vec2(asp*.8,1.),d*vec2(asp*.8,1.));
   vec2 off=d*r*0.0035; vec3 c=vec3(texture2D(tDiffuse,uv+off).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-off).b);
   float l=dot(c,vec3(.299,.587,.114)); c=mix(vec3(l),c,1.06); c*=vec3(1.02,1.0,0.975);
   c=mix(c,smoothstep(0.,1.,c),.18);
   c*=1.-vig*smoothstep(.12,.62,r*1.6);
   float g=(h(uv*vec2(1920.,1080.))-.5)*amt*(1.-l*.6); c+=g; gl_FragColor=vec4(c,1.);}`
};
const DOF = {
  uniforms: { tDiffuse: { value: null }, tDepth: { value: null }, near: { value: 0.04 }, far: { value: 40 }, focus: { value: 0.6 }, aperture: { value: 0.1 }, maxblur: { value: 0.016 }, asp: { value: 1.6 } },
  vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform sampler2D tDiffuse,tDepth; uniform float near,far,focus,aperture,maxblur,asp; varying vec2 vUv;
  float lin(float d){float z=d*2.-1.;return (2.*near*far)/(far+near-z*(far-near));}
  vec3 san(vec2 uv){ vec3 c=texture2D(tDiffuse,uv).rgb; if(any(isnan(c))||any(isinf(c))){ c=texture2D(tDiffuse,uv+vec2(0.004,0.)).rgb; if(any(isnan(c))||any(isinf(c))) c=vec3(0.02);} return min(c,vec3(40.)); }
  float coc(float d){return clamp(aperture*abs(d-focus)/max(d,.05),0.,maxblur);}
  void main(){
    float d=lin(texture2D(tDepth,vUv).x); float b=coc(d);
    vec4 acc=vec4(san(vUv),1.); float wsum=1.;
    if(b>0.0006){ acc=vec4(0.); wsum=0.;
      for(int i=0;i<28;i++){ float fi=float(i); float r=sqrt((fi+.5)/28.); float a=fi*2.39996;
        vec2 o=vec2(cos(a),sin(a))*r*b*vec2(1./asp,1.); vec2 uv=vUv+o;
        float dd=lin(texture2D(tDepth,uv).x); float cb=coc(dd);
        float w=(dd>=d*0.97||cb>=r*b*0.7)?1.:0.08;
        vec3 c=san(uv); float l=dot(c,vec3(.3,.59,.11)); w*=1.+l*.6;
        acc.rgb+=c*w; wsum+=w; }
      acc.rgb/=wsum; acc.a=1.; }
    gl_FragColor=vec4(acc.rgb,1.); }`
};
let dof = null;
function setupComposer() {
  if (LOW || NOFX) { composer = null; return; }
  const rt = new THREE.WebGLRenderTarget(innerWidth * DPR, innerHeight * DPR, { type: THREE.HalfFloatType, samples: 4 });
  composer = new EffectComposer(renderer, rt); composer.setPixelRatio(DPR); composer.setSize(innerWidth, innerHeight);
  [composer.renderTarget1, composer.renderTarget2].forEach(t => { t.depthTexture = new THREE.DepthTexture(innerWidth * DPR, innerHeight * DPR); t.depthTexture.type = THREE.UnsignedIntType; });
  composer.addPass(new RenderPass(scene, camera));
  if (!Q.has('nodof')) { dof = new ShaderPass(DOF); composer.addPass(dof);
  const prevRender = dof.render.bind(dof);
  dof.render = function (r, wb, rb, d, m) { this.uniforms.tDepth.value = rb.depthTexture; prevRender(r, wb, rb, d, m); };
  }
  if (!Q.has('nobloom')) composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.07, 0.5, 2.2));
  composer.addPass(new OutputPass());
  grain = new ShaderPass(GRAIN); composer.addPass(grain);
}

/* ---------- döngü ---------- */
let dbgFrames = 0, shiftCur = 0, P_cur = 0, P_dbg = null, tPrev = performance.now(), T = 0, first = true;
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; }, { passive: true });
function frame() {
  if (P_dbg !== null && dbgFrames <= 0) { tPrev = performance.now(); return; }
  dbgFrames--;
  const now = performance.now(), dt = Math.min(0.1, (now - tPrev) / 1000); tPrev = now; T += dt;
  const target = P_dbg !== null ? P_dbg : clamp(window.UK_P || 0, 0, 1.2);
  P_cur = P_dbg !== null ? P_dbg : lerp(P_cur, target, 1 - Math.exp(-dt * 7));
  const p = Math.min(P_cur, 1);
  updateWorld(p, T);
  const cp = camAt(p); mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
  const sh = 0.0016;
  camera.position.copy(camPos).add(tmpV.set(Math.sin(T * .7) * sh + mouse.x * 0.035, Math.sin(T * .53 + 1) * sh - mouse.y * 0.02, Math.cos(T * .6) * sh));
  camera.lookAt(camTgt);
  shiftCur += ((window.UK_SHIFT_T || 0) - shiftCur) * (1 - Math.exp(-dt * 4));
  if (Math.abs(shiftCur) > 0.002) camera.setViewOffset(innerWidth, innerHeight, shiftCur * innerWidth, 0, innerWidth, innerHeight); else camera.clearViewOffset();
  const fov = cp.fov * (camera.aspect < 1 ? 1.55 : 1); if (Math.abs(camera.fov - fov) > .01) { camera.fov = fov; camera.updateProjectionMatrix(); }
  if (dof) { dof.uniforms.focus.value = camera.position.distanceTo(camTgt); dof.uniforms.aperture.value = 0.032 * cp.ap; dof.uniforms.asp.value = camera.aspect; dof.uniforms.near.value = camera.near; dof.uniforms.far.value = camera.far; }
  if (grain) { grain.uniforms.t.value = T % 10; grain.uniforms.asp.value = camera.aspect; }
  if (composer) composer.render(dt); else renderer.render(scene, camera);
  window.UK3D_frames = (window.UK3D_frames || 0) + 1; console.log('frame', window.UK3D_frames);
  if (first) { first = false; window.__3d = true; window.UK3D_ready && window.UK3D_ready(); }
}
function resize() {
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  if (composer) composer.setSize(w, h);
}
addEventListener('resize', resize);
window.UK3D = { W, renderer, scene, setP(p) { P_dbg = p; dbgFrames = 4; window.UK3D_frames = 0; }, lang() { }, setLight() { }, state: ST, cam: { pos: camPos, tgt: camTgt } };

(async function () {
  try {
    console.log('step env'); await loadEnv(); console.log('step build'); await build(); console.log('step composer'); setupComposer(); resize(); stagesFromP(0); console.log('step go');
    renderer.setAnimationLoop(frame);
  } catch (e) { console.error('UK3D hata', e); window.UK3D_error = String(e && e.stack || e); document.documentElement.classList.add('nogl'); window.UK3D_ready && window.UK3D_ready(); }
})();
