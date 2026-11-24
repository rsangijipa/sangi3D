import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { rng } from './noise';

/**
 * Ferramentas de modelagem procedural: tubos afunilados (troncos, galhos, raízes),
 * tornos (vasos, tigelas, velas), caixas com quinas arredondadas (bordas que pegam luz)
 * e fusão de malhas por material para reduzir chamadas de desenho.
 */

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function rbox(w: number, h: number, d: number, r = 0.01, seg = 3) {
  return new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
}

/** Caixa com UV em metros (textura com densidade constante, sem esticar). */
export function boxUV(w: number, h: number, d: number, tile = 1) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const dims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / tile, (uv.getY(i) * dims[f][1]) / tile);
    }
  }
  return g;
}

/** Plano com UV em metros. */
export function planeUV(w: number, h: number, tile = 1, segX = 1, segY = 1) {
  const g = new THREE.PlaneGeometry(w, h, segX, segY);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * h) / tile);
  return g;
}

/** Torno a partir de um perfil [raio, altura]. */
export function lathe(profile: [number, number][], segments = 48) {
  const g = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(Math.max(0.00001, r), y)),
    segments,
  );
  g.computeVertexNormals();
  return g;
}

/** Desloca radialmente os vértices de uma geometria de torno em função do ângulo e da altura. */
export function displaceRadial(g: THREE.BufferGeometry, fn: (angle: number, y: number, r: number) => number) {
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const y = p.getY(i);
    const r = Math.hypot(x, z);
    if (r < 1e-5) continue;
    const a = Math.atan2(z, x);
    const k = fn(a, y, r);
    p.setXYZ(i, (x / r) * (r + k), y, (z / r) * (r + k));
  }
  g.computeVertexNormals();
  return g;
}

/** Tubo afunilado ao longo de uma curva — ideal para troncos, galhos, raízes e cordas. */
export function taperedTube(
  points: THREE.Vector3[],
  radius: (t: number) => number,
  o: { radial?: number; segments?: number; uvScale?: number; noise?: number; seed?: number; capEnd?: boolean } = {},
) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const segs = o.segments ?? Math.max(8, points.length * 8);
  const radial = o.radial ?? 12;
  const frames = curve.computeFrenetFrames(segs, false);
  const length = curve.getLength();
  const r = rng(o.seed ?? 1);
  const bumps = Array.from({ length: 6 }, () => [r() * 6.28, 1 + Math.floor(r() * 4), r()]);
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const P = new THREE.Vector3();
  const N = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    curve.getPointAt(t, P);
    const rad = radius(t);
    const n = frames.normals[i];
    const b = frames.binormals[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      let k = 1;
      if (o.noise) {
        for (const [ph, f, amp] of bumps) k += Math.sin(a * f + ph + t * 9 * amp) * o.noise * 0.25 * amp;
      }
      const sin = Math.sin(a);
      const cos = -Math.cos(a);
      N.set(cos * n.x + sin * b.x, cos * n.y + sin * b.y, cos * n.z + sin * b.z).normalize();
      pos.push(P.x + N.x * rad * k, P.y + N.y * rad * k, P.z + N.z * rad * k);
      nor.push(N.x, N.y, N.z);
      const circ = Math.max(0.05, 2 * Math.PI * radius(0));
      uv.push(j / radial, (t * length) / circ * (o.uvScale ?? 1));
    }
  }
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b2 = (i + 1) * (radial + 1) + j;
      idx.push(a, b2, a + 1, b2, b2 + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  if (o.noise) g.computeVertexNormals();
  return g;
}

/** Orienta e posiciona um objeto entre dois pontos (eixo Y local = segmento). */
export function between(o: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  o.position.copy(a).add(b).multiplyScalar(0.5);
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return len;
}

/** Cápsula entre dois pontos. */
export function capsuleBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.0001, a.distanceTo(b)), 6, 16), mat);
  between(m, a, b);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/** Cilindro entre dois pontos. */
export function cylinderBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material, seg = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), seg), mat);
  between(m, a, b);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/** Esfera achatada / elipsoide. */
export function ellipsoid(rx: number, ry: number, rz: number, mat: THREE.Material, detail = 32) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75)), mat);
  m.scale.set(rx, ry, rz);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/** Rocha: icosaedro deslocado por ruído. */
export function rockGeometry(radius: number, seed = 1, detail = 4, flat = 0.7) {
  const g = new THREE.IcosahedronGeometry(radius, detail);
  const p = g.attributes.position as THREE.BufferAttribute;
  const r = rng(seed);
  const waves = Array.from({ length: 7 }, () => [new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), 1 + r() * 4, r() * 6]);
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = v.clone().normalize();
    let k = 1;
    for (const [d, f, ph] of waves as [THREE.Vector3, number, number][]) k += Math.sin(n.dot(d) * f * 3 + ph) * 0.06;
    v.multiplyScalar(k);
    v.y *= v.y < 0 ? flat * 0.6 : flat;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/**
 * Funde todas as malhas de um grupo por material (geometrias já em coordenadas do grupo).
 * Reduz centenas de objetos estáticos a poucas chamadas de desenho.
 */
export function mergeStatic(group: THREE.Object3D, cast = true, receive = true) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const keep: THREE.Object3D[] = [];
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || (m as unknown as THREE.InstancedMesh).isInstancedMesh || o.userData.keep) {
      if (m.isMesh) keep.push(o);
      return;
    }
    if (Array.isArray(m.material)) {
      keep.push(o);
      return;
    }
    let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    if (!g.attributes.uv) {
      g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((g.attributes.position.count) * 2), 2));
    }
    if (!g.attributes.normal) g.computeVertexNormals();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
    const list = buckets.get(m.material) ?? [];
    list.push(g);
    buckets.set(m.material, list);
  });
  const out = new THREE.Group();
  buckets.forEach((geos, mat) => {
    const merged = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    if (!merged) return;
    const mm = new THREE.Mesh(merged, mat);
    mm.castShadow = cast;
    mm.receiveShadow = receive;
    out.add(mm);
  });
  keep.forEach((k) => {
    k.updateMatrixWorld(true);
    const clone = k as THREE.Mesh;
    const m = new THREE.Matrix4().multiplyMatrices(inv, clone.matrixWorld);
    clone.removeFromParent();
    m.decompose(clone.position, clone.quaternion, clone.scale);
    out.add(clone);
  });
  return out;
}

/** Distribui pontos sobre uma esfera (sequência de Fibonacci). */
export function fibonacciSphere(n: number) {
  const pts: THREE.Vector3[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts.push(new THREE.Vector3(Math.cos(g * i) * r, y, Math.sin(g * i) * r));
  }
  return pts;
}

/** Canvas → textura sRGB. */
export function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Gradiente vertical usado como mapa emissivo (ex.: cera iluminada pela chama). */
export function verticalGradient(stops: [number, string][]) {
  return canvasTexture(4, 128, (ctx) => {
    const g = ctx.createLinearGradient(0, 128, 0, 0);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 128);
  });
}

/** Pena desenhada (apanhador de sonhos). */
export function featherTexture(base: string, tip: string) {
  return canvasTexture(128, 512, (ctx) => {
    ctx.clearRect(0, 0, 128, 512);
    ctx.strokeStyle = '#d8cbb5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 510);
    ctx.lineTo(64, 20);
    ctx.stroke();
    for (let y = 40; y < 470; y += 3) {
      const t = y / 512;
      const w = Math.sin(t * Math.PI) * 52 + 6;
      const g = ctx.createLinearGradient(64, 0, 64 + w, 0);
      g.addColorStop(0, base);
      g.addColorStop(1, tip);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      const gap = Math.random() > 0.94 ? 6 : 0;
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.quadraticCurveTo(64 + w * 0.5, y - 10, 64 + w - gap, y - 26);
      ctx.moveTo(64, y);
      ctx.quadraticCurveTo(64 - w * 0.5, y - 10, 64 - w + gap, y - 26);
      ctx.stroke();
    }
  });
}
