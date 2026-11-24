// Objetos de bancada: novelos, cesta, tesoura, agulha, pente, fita métrica, potes, carretéis,
// mantas dobradas, vasos de lavanda, etiquetas. Geometria procedural com UV em metros.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry } from '../sim/weavePath.ts';
import { boxUV, scaleUV, type MaterialKit } from './materials.ts';
import { lathe } from './loom.ts';
import { lavenderCardTexture, tagTexture } from './textures.ts';

export function mesh(g: THREE.BufferGeometry, m: THREE.Material, name: string, cast = true): THREE.Mesh {
  const me = new THREE.Mesh(g, m);
  me.name = name;
  me.castShadow = cast;
  me.receiveShadow = true;
  return me;
}

/** Perfil com espessura (vaso, tigela, cesta): sobe por fora, contorna a borda e desce por dentro. */
export function shellLathe(outer: [number, number][], thickness: number, seg = 32): THREE.BufferGeometry {
  const inner = outer.slice().reverse().map(([r, y]) => [Math.max(0.001, r - thickness), Math.max(thickness, y)] as [number, number]);
  const top = outer[outer.length - 1];
  const rim: [number, number][] = [[top[0] - thickness * 0.15, top[1] + thickness * 0.4], [top[0] - thickness * 0.85, top[1] + thickness * 0.4]];
  return lathe([[0, 0], ...outer, ...rim, ...inner, [0, thickness]], seg);
}

// ---------- Novelo ----------

const ballGeoCache = new Map<number, THREE.BufferGeometry>();

/** Bola de lã: núcleo esférico + voltas de fio em círculos máximos com eixos aleatórios. */
export function yarnBallGeometry(seed: number, R = 0.055, lite = false): THREE.BufferGeometry {
  const key = seed * 10 + (lite ? 1 : 0);
  const hit = ballGeoCache.get(key);
  if (hit) return hit;
  const rnd = mulberry(seed);
  const core = new THREE.SphereGeometry(R * 0.965, 28, 20);
  scaleUV(core, (Math.PI * 2 * R) / 0.012, (Math.PI * R) / 0.012);
  const parts: THREE.BufferGeometry[] = [core];
  const wraps = lite ? 12 : 22;
  const r = R * 0.065;
  for (let i = 0; i < wraps; i++) {
    const axis = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis);
    const rr = R * (0.99 + rnd() * 0.035);
    const pts: THREE.Vector3[] = [];
    const segs = 40;
    const wob = rnd() * 6;
    for (let s = 0; s <= segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const lift = 1 + Math.sin(a * 3 + wob) * 0.012;
      pts.push(new THREE.Vector3(Math.cos(a) * rr * lift, Math.sin(a) * rr * lift, 0).applyQuaternion(q));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const tube = new THREE.TubeGeometry(curve, lite ? 40 : 64, r, lite ? 4 : 5, true);
    scaleUV(tube, (Math.PI * 2 * rr) / 0.011, 1);
    parts.push(tube);
  }
  const merged = mergeGeometries(parts.map((p) => p.index ? p.toNonIndexed() : p), false)!;
  merged.computeBoundingSphere();
  ballGeoCache.set(key, merged);
  return merged;
}

export function buildYarnBall(mat: MaterialKit, yarnId: string, seed: number, R = 0.055, lite = false): THREE.Mesh {
  const m = mesh(yarnBallGeometry(seed % 3, R, lite), mat.ball.get(yarnId)!, `novelo_${yarnId}`);
  m.rotation.set(seed * 1.3, seed * 2.1, seed * 0.7);
  return m;
}

// ---------- Cesta de vime ----------

export function buildBasket(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'cesta';
  const outer: [number, number][] = [[0.17, 0.0], [0.2, 0.02], [0.235, 0.07], [0.26, 0.12], [0.27, 0.14]];
  const body = shellLathe(outer, 0.012, 48);
  scaleUV(body, Math.PI * 2 * 0.25, 1);
  g.add(mesh(body, mat.wicker, 'cesta_corpo'));
  const rim = new THREE.TorusGeometry(0.268, 0.013, 10, 64);
  scaleUV(rim, Math.PI * 2 * 0.27, 0.08);
  const rimM = mesh(rim, mat.wicker, 'cesta_borda');
  rimM.rotation.x = Math.PI / 2;
  rimM.position.y = 0.145;
  g.add(rimM);
  // aro trançado (corda torcida sobre a borda)
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 160; i++) {
    const a = (i / 160) * Math.PI * 2;
    const tw = a * 24;
    pts.push(new THREE.Vector3(Math.cos(a) * (0.268 + Math.cos(tw) * 0.009), 0.145 + Math.sin(tw) * 0.009, Math.sin(a) * (0.268 + Math.cos(tw) * 0.009)));
  }
  const braid = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 320, 0.0045, 5, true);
  scaleUV(braid, 40, 1);
  g.add(mesh(braid, mat.wicker, 'cesta_trancado'));
  return g;
}

// ---------- Tesoura ----------

export interface Scissors { root: THREE.Group; setOpen: (a: number) => void }

export function buildScissors(mat: MaterialKit): Scissors {
  const root = new THREE.Group();
  root.name = 'tesoura_virtual';
  const half = (sign: 1 | -1) => {
    const h = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.15, sign * 0.004);
    s.quadraticCurveTo(0.16, sign * 0.0, 0.15, -sign * 0.004);
    s.quadraticCurveTo(0.06, -sign * 0.012, 0.0, -sign * 0.01);
    s.lineTo(-0.02, -sign * 0.006);
    const blade = new THREE.ExtrudeGeometry(s, { depth: 0.0025, bevelEnabled: true, bevelSize: 0.0008, bevelThickness: 0.0006, bevelSegments: 1, curveSegments: 10 });
    boxUV(blade, 'x');
    const bm = mesh(blade, mat.steel, 'lamina');
    bm.rotation.x = -Math.PI / 2;
    bm.position.y = sign > 0 ? 0.003 : 0;
    h.add(bm);
    const ring = new THREE.TorusGeometry(0.024, 0.0045, 10, 28);
    const rm = mesh(ring, mat.brass, 'aro');
    rm.rotation.x = Math.PI / 2;
    rm.scale.set(1, 1.25, 1);
    rm.position.set(-0.062, sign > 0 ? 0.004 : 0.0, sign * 0.022);
    h.add(rm);
    const shank = mesh(new THREE.CylinderGeometry(0.004, 0.005, 0.045, 10), mat.brass, 'haste');
    shank.rotation.z = Math.PI / 2;
    shank.rotation.y = sign * 0.45;
    shank.position.set(-0.025, sign > 0 ? 0.004 : 0, sign * 0.01);
    h.add(shank);
    return h;
  };
  const a = half(1), b = half(-1);
  a.name = 'tesoura_metade_a';
  b.name = 'tesoura_metade_b';
  root.add(a, b);
  const screw = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.009, 12), mat.brass, 'parafuso');
  screw.position.y = 0.003;
  root.add(screw);
  const setOpen = (ang: number) => { a.rotation.y = ang / 2; b.rotation.y = -ang / 2; };
  setOpen(0.12);
  return { root, setOpen };
}

// ---------- Agulha de tapeçaria ----------

export function buildNeedle(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'agulha';
  const body = mesh(lathe([[0, 0], [0.0012, 0.004], [0.0026, 0.03], [0.003, 0.13], [0.0032, 0.155], [0.0026, 0.168], [0.0, 0.172]], 12), mat.steel, 'agulha_corpo');
  g.add(body);
  const eye = mesh(new THREE.TorusGeometry(0.0028, 0.0011, 6, 14), mat.darkWood, 'agulha_olho', false);
  eye.scale.set(0.7, 2.2, 1);
  eye.position.y = 0.158;
  g.add(eye);
  // passa a agulha deitada: eixo ao longo de x
  g.rotation.z = -Math.PI / 2;
  return g;
}

// ---------- Fita métrica de costura ----------

export function buildTape(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'fita_metrica';
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#E9D9A8'; ctx.fillRect(0, 0, 1024, 64);
  ctx.fillStyle = '#3A3226'; ctx.font = '600 20px Georgia, serif'; ctx.textAlign = 'center';
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * 1024;
    const h = i % 10 === 0 ? 26 : i % 5 === 0 ? 18 : 10;
    ctx.fillRect(x, 0, 1.6, h);
    if (i % 10 === 0 && i > 0) ctx.fillText(String(i / 10 + 10), x, 52);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, name: 'fita' });
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    pts.push(new THREE.Vector3(u * 0.42, 0.0012 + Math.sin(u * 7) * 0.0006, Math.sin(u * 3.2) * 0.04));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = ribbon(curve, 0.017, 80);
  g.add(mesh(geo, m, 'fita_trecho', false));
  const roll = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.017, 32), m, 'fita_rolo');
  roll.position.set(-0.03, 0.0085, 0);
  g.add(roll);
  return g;
}

function ribbon(curve: THREE.Curve<THREE.Vector3>, width: number, seg: number): THREE.BufferGeometry {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const p = curve.getPointAt(u);
    const tan = curve.getTangentAt(u);
    const side = new THREE.Vector3().crossVectors(up, tan).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z);
    uv.push(u, 0, u, 1);
    if (i < seg) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// ---------- Pote com ferramentas ----------

export function buildToolJar(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'pote_ferramentas';
  const jar = shellLathe([[0.055, 0], [0.065, 0.02], [0.068, 0.08], [0.064, 0.14], [0.066, 0.15]], 0.007, 36);
  scaleUV(jar, 1.3, 1.5);
  g.add(mesh(jar, mat.ceramicCream, 'pote'));
  const rnd = mulberry(77);
  const sticks: THREE.BufferGeometry[] = [];
  const tips: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 9; i++) {
    const len = 0.2 + rnd() * 0.1;
    const st = new THREE.CylinderGeometry(0.0035, 0.0045, len, 8);
    scaleUV(st, 0.03, len);
    const ang = new THREE.Euler((rnd() - 0.5) * 0.35, rnd() * Math.PI, (rnd() - 0.5) * 0.35);
    const m = new THREE.Matrix4().compose(new THREE.Vector3((rnd() - 0.5) * 0.06, 0.06 + len / 2, (rnd() - 0.5) * 0.06), new THREE.Quaternion().setFromEuler(ang), new THREE.Vector3(1, 1, 1));
    sticks.push(st.applyMatrix4(m));
    if (i % 3 === 0) {
      const tip = new THREE.ConeGeometry(0.006, 0.02, 8);
      tip.translate(0, len / 2 + 0.01, 0);
      tips.push(tip.applyMatrix4(m));
    }
  }
  g.add(mesh(mergeGeometries(sticks)!, mat.loomWood, 'agulhas_madeira'));
  g.add(mesh(mergeGeometries(tips)!, mat.brass, 'ponteiras'));
  return g;
}

// ---------- Tigela torneada ----------

export function buildBowl(mat: MaterialKit, r = 0.12, h = 0.06): THREE.Mesh {
  const geo = shellLathe([[r * 0.5, 0], [r * 0.8, h * 0.2], [r * 0.97, h * 0.6], [r, h]], 0.008, 40);
  scaleUV(geo, Math.PI * 2 * r, 0.3);
  return mesh(geo, mat.tableWood, 'tigela');
}

// ---------- Carretel ----------

export function buildSpool(mat: MaterialKit, yarnId: string, h = 0.09): THREE.Group {
  const g = new THREE.Group();
  g.name = `carretel_${yarnId}`;
  const fl = lathe([[0.006, 0], [0.034, 0], [0.036, 0.004], [0.034, 0.012], [0.006, 0.012]], 24);
  const f1 = mesh(fl, mat.loomWood, 'carretel_flange');
  const f2 = mesh(fl, mat.loomWood, 'carretel_flange');
  f2.position.y = h - 0.012;
  g.add(f1, f2);
  const wound = new THREE.CylinderGeometry(0.028, 0.028, h - 0.024, 28, 1, true);
  scaleUV(wound, (Math.PI * 2 * 0.028) / 0.004, (h - 0.024) / 0.02);
  const w = mesh(wound, mat.yarn.get(yarnId)!, 'carretel_fio');
  w.position.y = h / 2;
  g.add(w);
  return g;
}

// ---------- Mantas dobradas com franja ----------

export function buildFoldedCloths(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'mantas_dobradas';
  const layers: [THREE.Material, number, number][] = [[mat.clothA, 0.05, 0], [mat.clothB, 0.045, 0.06], [mat.clothA, 0.04, -0.03]];
  let y = 0;
  const fringeGeo = new THREE.CylinderGeometry(0.0018, 0.0012, 0.05, 4);
  fringeGeo.translate(0, -0.025, 0);
  for (const [m, h, rot] of layers) {
    const box = new RoundedBoxGeometry(0.42, h, 0.3, 4, h * 0.45);
    boxUV(box, 'x');
    const b = mesh(box, m, 'manta');
    b.position.y = y + h / 2;
    b.rotation.y = rot;
    g.add(b);
    const fr = new THREE.InstancedMesh(fringeGeo, m, 40);
    fr.name = 'franja';
    const mm = new THREE.Matrix4();
    for (let i = 0; i < 40; i++) {
      const z = -0.14 + (i % 20) * 0.0145;
      const x = i < 20 ? 0.212 : -0.212;
      mm.makeRotationZ((i < 20 ? 1 : -1) * 1.2).setPosition(x, y + h * 0.5, z);
      fr.setMatrixAt(i, mm);
    }
    fr.rotation.y = rot;
    fr.castShadow = true;
    g.add(fr);
    y += h * 0.92;
  }
  return g;
}

// ---------- Lavanda em vaso ----------

export function lavenderSprigGeometry(): { stem: THREE.BufferGeometry; buds: THREE.BufferGeometry } {
  const stem = new THREE.CylinderGeometry(0.0012, 0.0018, 0.36, 4);
  stem.translate(0, 0.18, 0);
  const buds: THREE.BufferGeometry[] = [];
  const rnd = mulberry(5);
  for (let i = 0; i < 14; i++) {
    const t = i / 14;
    const b = new THREE.SphereGeometry(0.0042 * (1 - t * 0.45), 5, 4);
    b.scale(1, 1.6, 1);
    const a = i * 2.4;
    b.translate(Math.cos(a) * 0.003, 0.3 + t * 0.075, Math.sin(a) * 0.003 + (rnd() - 0.5) * 0.001);
    buds.push(b);
  }
  return { stem, buds: mergeGeometries(buds)! };
}

export function buildLavenderVase(mat: MaterialKit, seed: number, scale = 1): THREE.Group {
  const g = new THREE.Group();
  g.name = 'vaso_lavanda';
  const vase = shellLathe([[0.05, 0], [0.075, 0.03], [0.085, 0.1], [0.07, 0.17], [0.045, 0.21], [0.05, 0.235]], 0.006, 36);
  scaleUV(vase, 1.2, 1.4);
  g.add(mesh(vase, seed % 2 ? mat.ceramicBlue : mat.ceramicCream, 'vaso'));
  const { stem, buds } = lavenderSprigGeometry();
  const stemMat = new THREE.MeshStandardMaterial({ color: '#6E7F4E', roughness: 0.8, name: 'caule_lavanda' });
  const budMat = new THREE.MeshStandardMaterial({ color: '#8467A8', roughness: 0.75, name: 'flor_lavanda' });
  const n = 26;
  const st = new THREE.InstancedMesh(stem, stemMat, n);
  const bd = new THREE.InstancedMesh(buds, budMat, n);
  st.name = 'lavanda_caules';
  bd.name = 'lavanda_flores';
  const rnd = mulberry(seed);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const lean = 0.08 + rnd() * 0.28;
    const yaw = rnd() * Math.PI * 2;
    const s = 0.85 + rnd() * 0.35;
    m.compose(new THREE.Vector3((rnd() - 0.5) * 0.04, 0.18, (rnd() - 0.5) * 0.04),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.cos(yaw) * lean, 0, Math.sin(yaw) * lean)),
      new THREE.Vector3(s, s, s));
    st.setMatrixAt(i, m);
    bd.setMatrixAt(i, m);
  }
  st.castShadow = bd.castShadow = true;
  g.add(st, bd);
  g.scale.setScalar(scale);
  return g;
}

// ---------- Etiqueta de papel ----------

export interface Tag { root: THREE.Group; setText: (title: string, sub: string) => void }

export function buildTag(mat: MaterialKit, title: string, sub: string): Tag {
  const root = new THREE.Group();
  root.name = 'etiqueta';
  const s = new THREE.Shape();
  const w = 0.07, h = 0.036, c = 0.009;
  s.moveTo(-w / 2 + c, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2 + c, h / 2); s.lineTo(-w / 2, 0); s.closePath();
  const hole = new THREE.Path(); hole.absarc(-w / 2 + 0.008, 0, 0.0028, 0, Math.PI * 2, true); s.holes.push(hole);
  const geo = new THREE.ShapeGeometry(s, 6);
  // UV 0..1 sobre o retângulo
  const p = geo.getAttribute('position');
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) + w / 2) / w; uv[i * 2 + 1] = (p.getY(i) + h / 2) / h; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  let texture = tagTexture(title, sub);
  const m = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, side: THREE.DoubleSide, name: 'etiqueta_papel' });
  const card = mesh(geo, m, 'etiqueta_cartao', true);
  root.add(card);
  const string = mesh(new THREE.CylinderGeometry(0.0008, 0.0008, 0.05, 4), mat.rope, 'etiqueta_cordao', false);
  string.rotation.z = Math.PI / 2.4;
  string.position.set(-w / 2 - 0.016, 0.012, 0);
  root.add(string);
  const setText = (t: string, sb: string) => {
    texture.dispose();
    texture = tagTexture(t, sb);
    m.map = texture;
    m.needsUpdate = true;
  };
  return { root, setText };
}

// ---------- Bancada ----------

export function buildTable(mat: MaterialKit, w: number, d: number, hgt: number, name: string): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const top = mesh(boxUV(new RoundedBoxGeometry(w, 0.05, d, 3, 0.012), 'x'), mat.tableWood, `${name}_tampo`);
  top.position.y = hgt - 0.025;
  g.add(top);
  // tábuas: sulcos finos no tampo (tiras escuras)
  const grooveGeo = new THREE.BoxGeometry(w - 0.02, 0.002, 0.004);
  const grooves = new THREE.InstancedMesh(grooveGeo, mat.darkWood, 4);
  const m = new THREE.Matrix4();
  for (let i = 0; i < 4; i++) { m.makeTranslation(0, hgt + 0.0005, -d / 2 + (d / 5) * (i + 1)); grooves.setMatrixAt(i, m); }
  grooves.receiveShadow = true;
  g.add(grooves);
  const apron = boxUV(new RoundedBoxGeometry(w - 0.12, 0.09, 0.03, 2, 0.008), 'x');
  for (const z of [-d / 2 + 0.06, d / 2 - 0.06]) {
    const a = mesh(apron, mat.tableWood, `${name}_saia`);
    a.position.set(0, hgt - 0.095, z);
    g.add(a);
  }
  const legGeo = boxUV(new RoundedBoxGeometry(0.07, hgt - 0.05, 0.07, 2, 0.01), 'y');
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const l = mesh(legGeo, mat.tableWood, `${name}_perna`);
    l.position.set(sx * (w / 2 - 0.07), (hgt - 0.05) / 2, sz * (d / 2 - 0.07));
    g.add(l);
  }
  return g;
}

/** Sombra de contato barata (disco com gradiente radial) sob objetos pequenos. */
export function contactShadow(radius: number, opacity = 0.45): THREE.Mesh {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const gr = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.5, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity, color: 0x1a0f08 });
  const me = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), m);
  me.rotation.x = -Math.PI / 2;
  me.name = 'sombra_contato';
  me.renderOrder = 1;
  return me;
}

export function lavenderCard(seed: number): THREE.Texture { return lavenderCardTexture(seed); }
