import * as THREE from 'three';
import { makeTexSet, pbrMaterial, physicalMaterial, woodSampler, type TexSet } from '../core/pbr';
import { rbox, rockGeometry, taperedTube } from '../core/model';
import { fbmT, rng, smoothstep, valueT, worleyT, type CellSample } from '../core/noise';
import type { SampleId } from '../game/content';
import {
  corkSampler,
  glazeSampler,
  leafSampler,
  leafVeins,
  linenSampler,
  sandstoneSampler,
  slateSampler,
  terracottaSampler,
  woolSampler,
} from './surfaces';

/**
 * Modelagem procedural das oito amostras. Cada uma tem macrogeometria própria
 * (blocos, cachos, lâminas, trama, nervuras, bloco lixado, caco curvo, seixo),
 * não apenas outra cor: a luz rasante revela formas diferentes.
 * Origem no centro da base (pousa em y = 0), unidades em metros.
 */

export interface SampleModel {
  id: SampleId;
  object: THREE.Group;
  /** Altura máxima (m): usada para focar a lupa e a câmera. */
  height: number;
  /** Maior extensão horizontal (m): usada para escalar a comparação. */
  size: number;
  textures: TexSet[];
  /** Atualização por quadro (ex.: translucidez da folha conforme a luz). */
  update?: (ctx: SampleUpdate) => void;
}

export interface SampleUpdate {
  time: number;
  /** Direção (mundo) da amostra para a luz principal. */
  toLight: THREE.Vector3;
  /** Direção (mundo) da amostra para a câmera. */
  toCamera: THREE.Vector3;
  lampLevel: number;
}

export interface BuildCtx {
  size: number;
  heroSize: number;
  aniso: number;
}

type HeightFn = (x: number, z: number, t: number, a: number) => number;

/**
 * Laje polar: anéis concêntricos até um contorno irregular R(a). A altura cai a zero no contorno,
 * o que dá bordas limpas sobre o feltro sem serrilhado de grade.
 */
function polarSlab(o: { R: (a: number) => number; sx?: number; sz?: number; rings: number; segs: number; height: HeightFn; uvTile: number }) {
  const sx = o.sx ?? 1;
  const sz = o.sz ?? 1;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  // centro
  pos.push(0, o.height(0, 0, 0, 0), 0);
  uv.push(0, 0);
  for (let i = 1; i <= o.rings; i++) {
    // anéis mais densos perto da borda, onde a parede é íngreme
    const lin = i / o.rings;
    const t = 1 - Math.pow(1 - lin, 1.55);
    for (let j = 0; j < o.segs; j++) {
      const a = (j / o.segs) * Math.PI * 2;
      const r = t * o.R(a);
      const x = Math.cos(a) * r * sx;
      const z = Math.sin(a) * r * sz;
      const y = i === o.rings ? 0 : o.height(x, z, t, a);
      pos.push(x, y, z);
      uv.push(x / o.uvTile, z / o.uvTile);
    }
  }
  for (let j = 0; j < o.segs; j++) idx.push(0, 1 + ((j + 1) % o.segs), 1 + j);
  for (let i = 1; i < o.rings; i++) {
    const a0 = 1 + (i - 1) * o.segs;
    const b0 = 1 + i * o.segs;
    for (let j = 0; j < o.segs; j++) {
      const j1 = (j + 1) % o.segs;
      idx.push(a0 + j, a0 + j1, b0 + j, a0 + j1, b0 + j1, b0 + j);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function finishModel(id: SampleId, group: THREE.Group, textures: TexSet[], update?: SampleModel['update']): SampleModel {
  group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  const box = new THREE.Box3().setFromObject(group);
  const size = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
  group.name = `sample_${id}`;
  return { id, object: group, height: box.max.y, size, textures, update };
}

const cellA: CellSample = { f1: 0, f2: 0, id: 0 };

/* ------------------------------------------------------------------ */
/* Cortiça (hero): blocos com fendas, poros e lenticelas                 */
/* ------------------------------------------------------------------ */
function buildCork(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.heroSize, aniso: c.aniso, normalStrength: 3.2, sample: corkSampler() });
  const R = (a: number) =>
    0.118 * (1 + 0.14 * Math.sin(2 * a + 0.6) + 0.07 * Math.sin(3 * a + 2.1) + (fbmT(a * 1.6, 0.5, 10, 4, 7) - 0.5) * 0.34);
  const H = 0.05;
  const height: HeightFn = (x, z, t, a) => {
    const crumble = (valueT(a * 9, 0.3, 57, 11) - 0.5) * 0.06;
    const prof = smoothstep(1.0, 0.86, t + crumble);
    worleyT(x * 30 + 50, z * 30 + 50, 1000, 13, cellA);
    const plateau = 0.66 + cellA.id * 0.42;
    const tilt = (Math.cos(cellA.id * 40) * x + Math.sin(cellA.id * 40) * z) * 1.2;
    const round = smoothstep(0.42, 0.85, cellA.f1) * 0.14;
    const crack = smoothstep(0.075, 0.0, cellA.f2 - cellA.f1);
    const dome = 1 - t * t * 0.3;
    const fine = (fbmT(x * 90 + 9, z * 90 + 9, 1000, 3, 19) - 0.5) * 0.08;
    const y = H * prof * dome * (plateau + tilt - round + fine) - H * crack * 0.42 * prof;
    return Math.max(0.0015 * prof, y);
  };
  const geo = polarSlab({ R, sx: 1.28, sz: 0.94, rings: 110, segs: 280, height, uvTile: 0.07 });
  const mat = pbrMaterial(tex, { roughness: 1, color: 0xffffff }, 1.4);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  return finishModel('cork', g, [tex]);
}

/* ------------------------------------------------------------------ */
/* Lã: monte macio + cachos helicoidais e fibras soltas                  */
/* ------------------------------------------------------------------ */
function buildWool(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 2.4, sample: woolSampler() });
  const mat = physicalMaterial(tex, { sheen: 1, sheenRoughness: 0.55, sheenColor: new THREE.Color('#fff4de'), roughness: 1 }, 1.2);
  const g = new THREE.Group();
  // monte base, achatado e irregular
  const base = new THREE.SphereGeometry(1, 48, 24);
  const p = base.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const k = 1 + (fbmT(x * 2 + 3, z * 2 + y + 3, 1000, 4, 5) - 0.5) * 0.35;
    p.setXYZ(i, x * 0.095 * k, Math.max(-0.05, y) * 0.032 * k + 0.018, z * 0.07 * k);
  }
  base.computeVertexNormals();
  g.add(new THREE.Mesh(base, mat));
  // cachos
  const r = rng(77);
  const geos: THREE.BufferGeometry[] = [];
  for (let n = 0; n < 64; n++) {
    const ang = r() * Math.PI * 2;
    const rad = Math.sqrt(r());
    const start = new THREE.Vector3(Math.cos(ang) * rad * 0.085, 0.03 + (1 - rad) * 0.02, Math.sin(ang) * rad * 0.062);
    const dir = new THREE.Vector3(Math.cos(ang + (r() - 0.5) * 1.2), 0.25 + r() * 0.5, Math.sin(ang + (r() - 0.5) * 1.2)).normalize();
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(side, dir).normalize();
    const len = 0.03 + r() * 0.035;
    const turns = 2 + r() * 2.2;
    const hr = 0.004 + r() * 0.004;
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 22; k++) {
      const t = k / 22;
      const a = t * turns * Math.PI * 2 + r() * 0.2;
      pts.push(
        start
          .clone()
          .addScaledVector(dir, t * len)
          .addScaledVector(side, Math.cos(a) * hr * (1 - t * 0.4))
          .addScaledVector(up, Math.sin(a) * hr * (1 - t * 0.4) - t * t * 0.01),
      );
    }
    const thick = 0.0028 + r() * 0.0016;
    geos.push(taperedTube(pts, (t) => thick * (1 - t * 0.75), { radial: 7, segments: 44, uvScale: 0.25, noise: 0.15, seed: n }));
  }
  // fibras soltas, finas
  for (let n = 0; n < 26; n++) {
    const ang = r() * Math.PI * 2;
    const a0 = new THREE.Vector3(Math.cos(ang) * 0.07, 0.025 + r() * 0.02, Math.sin(ang) * 0.05);
    const pts = [0, 1, 2, 3].map((k) =>
      a0.clone().add(new THREE.Vector3(Math.cos(ang) * k * 0.012 + (r() - 0.5) * 0.006, (r() - 0.6) * 0.006 * k, Math.sin(ang) * k * 0.012 + (r() - 0.5) * 0.006)),
    );
    pts.forEach((pt) => (pt.y = Math.max(0.001, pt.y)));
    geos.push(taperedTube(pts, (t) => 0.0006 * (1 - t * 0.6), { radial: 4, segments: 14, uvScale: 0.25 }));
  }
  for (const geo of geos) g.add(new THREE.Mesh(geo, mat));
  return finishModel('wool', g, [tex]);
}

/* ------------------------------------------------------------------ */
/* Ardósia: placa em lâminas sobrepostas com bordas lascadas              */
/* ------------------------------------------------------------------ */
function buildSlate(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 2.6, sample: slateSampler() });
  const n = 5;
  const superR = (a: number) => 1 / Math.pow(Math.pow(Math.abs(Math.cos(a)), n) + Math.pow(Math.abs(Math.sin(a)), n), 1 / n);
  const chip = (a: number, seed: number) => Math.pow(valueT(a * 7, 0.5, 44, seed), 2.2);
  const R = (a: number) => 0.1 * superR(a) * (1 - chip(a, 3) * 0.12);
  const layers = [
    { h: 0.009, edge: (a: number) => 0.97 - chip(a, 5) * 0.06 },
    { h: 0.006, edge: (a: number) => 0.9 - chip(a, 8) * 0.22 },
    { h: 0.0045, edge: (a: number) => 0.74 - chip(a, 12) * 0.32 },
  ];
  const height: HeightFn = (x, z, t, a) => {
    let y = 0;
    for (const L of layers) y += L.h * smoothstep(L.edge(a) + 0.012, L.edge(a) - 0.012, t);
    const cleave = (fbmT(x * 20 + 2, z * 5 + 2, 1000, 4, 31) - 0.5) * 0.0016;
    return Math.max(0, y + cleave * smoothstep(1, 0.9, t));
  };
  const geo = polarSlab({ R, sx: 1.5, sz: 1.08, rings: 90, segs: 240, height, uvTile: 0.16 });
  const mat = pbrMaterial(tex, { roughness: 1 }, 1.1);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  return finishModel('slate', g, [tex]);
}

/* ------------------------------------------------------------------ */
/* Linho cru: pano com ondas suaves e franja desfiada                     */
/* ------------------------------------------------------------------ */
function buildLinen(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 3.4, sample: linenSampler() });
  const W = 0.19;
  const seg = 64;
  const geo = new THREE.PlaneGeometry(W, W, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const fold = Math.max(0, Math.sin((x * 0.6 + z) * 30 + 1)) * 0.0022 * smoothstep(0.1, 0.0, Math.abs(z - 0.02));
    const ripple = (fbmT(x * 14 + 4, z * 14 + 4, 1000, 3, 9) - 0.5) * 0.004;
    const corner = smoothstep(0.03, -0.01, -x - z * 0.2 + 0.07) * 0.012; // canto levantado
    p.setY(i, 0.0018 + Math.max(0, ripple + 0.0012) + fold + corner);
    uv.setXY(i, uv.getX(i) * (W / 0.05), uv.getY(i) * (W / 0.05));
  }
  geo.computeVertexNormals();
  const mat = pbrMaterial(tex, { roughness: 1, side: THREE.DoubleSide }, 1.6);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  // franja: fios instanciados nas quatro bordas
  const thread = new THREE.CylinderGeometry(0.00055, 0.0004, 1, 5, 1);
  thread.translate(0, 0.5, 0);
  thread.rotateX(Math.PI / 2); // eixo +Z
  const perSide = 60;
  const fringe = new THREE.InstancedMesh(thread, mat, perSide * 4);
  const r = rng(5);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  let k = 0;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < perSide; i++) {
      const t = (i + 0.5) / perSide - 0.5;
      const len = 0.008 + r() * 0.011;
      const yaw = side * (Math.PI / 2) + (r() - 0.5) * 0.35;
      const local = new THREE.Vector3(t * W, 0.0016, W / 2 - 0.001).applyAxisAngle(new THREE.Vector3(0, 1, 0), side * (Math.PI / 2));
      e.set(-0.05 + (r() - 0.5) * 0.12, yaw, 0);
      q.setFromEuler(e);
      m.compose(local, q, new THREE.Vector3(1, 1, len));
      fringe.setMatrixAt(k++, m);
    }
  }
  fringe.instanceMatrix.needsUpdate = true;
  g.add(fringe);
  return finishModel('linen', g, [tex]);
}

/* ------------------------------------------------------------------ */
/* Folha: lâmina com nervuras em relevo, curvatura e pecíolo              */
/* ------------------------------------------------------------------ */
function buildLeaf(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 2.8, sample: leafSampler() });
  const nu = 36;
  const nv = 120;
  const L = 0.2;
  const Wmax = 0.062;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    let w = Wmax * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.82)), 0.85);
    const serr = 1 + 0.035 * (1 - Math.abs(((v * 34) % 1) * 2 - 1)) * smoothstep(0.05, 0.2, v);
    w *= serr;
    for (let i = 0; i <= nu; i++) {
      const u = i / nu;
      const xn = u * 2 - 1;
      const x = xn * w;
      const zc = v * L - L * 0.48;
      const { mid, sec } = leafVeins(u, v);
      const y = 0.004 + Math.pow(Math.abs(xn), 1.6) * 0.012 + Math.sin(Math.PI * v) * 0.008 - v * v * 0.006 + mid * 0.0016 + sec * 0.0007;
      pos.push(x, y, -zc);
      uv.push(u, v);
    }
  }
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i;
      const b = a + nu + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  tex.map.wrapS = tex.map.wrapT = THREE.ClampToEdgeWrapping;
  const mat = pbrMaterial(tex, { side: THREE.DoubleSide, roughness: 1, emissive: new THREE.Color('#9fca5a'), emissiveMap: tex.map, emissiveIntensity: 0 }, 1.2);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, mat));
  const stemMat = new THREE.MeshStandardMaterial({ color: '#6d8a3e', roughness: 0.6 });
  const stem = taperedTube(
    [new THREE.Vector3(0, 0.005, L * 0.48), new THREE.Vector3(0.003, 0.004, L * 0.48 + 0.02), new THREE.Vector3(0.01, 0.002, L * 0.48 + 0.045)],
    (t) => 0.0024 * (1 - t * 0.45),
    { radial: 8, segments: 16 },
  );
  g.add(new THREE.Mesh(stem, stemMat));
  // translucidez aproximada: brilha quando a luz vem por trás da folha (em relação a quem olha)
  const update = (u: SampleUpdate) => {
    const back = Math.max(0, -u.toLight.dot(u.toCamera) + 0.15);
    const graze = 1 - Math.abs(u.toLight.y);
    mat.emissiveIntensity = (back * 0.55 + graze * 0.12) * u.lampLevel;
  };
  return finishModel('leaf', g, [tex], update);
}

/* ------------------------------------------------------------------ */
/* Madeira lisa: bloco lixado e encerado                                  */
/* ------------------------------------------------------------------ */
function buildSmoothWood(c: BuildCtx): SampleModel {
  const tex = makeTexSet({
    size: c.size,
    aniso: c.aniso,
    normalStrength: 1.2,
    sample: woodSampler({ light: '#d9a46b', dark: '#8c5732', grainScale: 1.4, gloss: 0.8, seed: 71 }),
  });
  const mat = physicalMaterial(tex, { roughness: 1, clearcoat: 0.55, clearcoatRoughness: 0.28 }, 0.35);
  const g = new THREE.Group();
  const block = new THREE.Mesh(rbox(0.17, 0.042, 0.105, 0.013, 5), mat);
  block.position.y = 0.021;
  g.add(block);
  return finishModel('smooth_wood', g, [tex]);
}

/* ------------------------------------------------------------------ */
/* Cerâmica: caco curvo de tigela, esmalte craquelado e borda de barro    */
/* ------------------------------------------------------------------ */
function buildCeramic(c: BuildCtx): SampleModel {
  const glaze = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 1.6, repeat: [3, 2], sample: glazeSampler() });
  const clay = makeTexSet({ size: Math.min(256, c.size), aniso: c.aniso, normalStrength: 2, sample: terracottaSampler() });
  const glazeMat = physicalMaterial(glaze, { roughness: 1, clearcoat: 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide }, 0.6);
  const clayMat = pbrMaterial(clay, { roughness: 1, side: THREE.DoubleSide }, 1);
  const profile: [number, number][] = [
    [0.05, 0.0],
    [0.068, 0.008],
    [0.082, 0.022],
    [0.091, 0.04],
    [0.095, 0.058],
    [0.094, 0.064],
    [0.089, 0.065],
    [0.087, 0.058],
    [0.084, 0.041],
    [0.076, 0.024],
    [0.063, 0.012],
    [0.047, 0.006],
    [0.05, 0.0],
  ];
  const phiLen = 1.35;
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const shell = new THREE.LatheGeometry(pts, 36, 0, phiLen);
  // borda irregular: desloca levemente a altura dos vértices próximos ao corte
  const sp = shell.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < sp.count; i++) {
    const x = sp.getX(i);
    const z = sp.getZ(i);
    const a = Math.atan2(x, z);
    const edge = Math.min(a, phiLen - a);
    const nudge = smoothstep(0.12, 0.0, edge) * (valueT(sp.getY(i) * 220, a * 10, 1000, 4) - 0.5) * 0.008;
    const r = Math.hypot(x, z);
    sp.setXYZ(i, (x / r) * (r + nudge * 0.2), sp.getY(i), (z / r) * (r + nudge * 0.2));
  }
  shell.computeVertexNormals();
  const g = new THREE.Group();
  const inner = new THREE.Group();
  inner.add(new THREE.Mesh(shell, glazeMat));
  const shape = new THREE.Shape(profile.slice(0, -1).map(([r, y]) => new THREE.Vector2(r, y)));
  for (const phi of [0, phiLen]) {
    const cap = new THREE.Mesh(new THREE.ShapeGeometry(shape), clayMat);
    cap.rotation.y = phi - Math.PI / 2;
    inner.add(cap);
  }
  // deita o caco sobre o lado convexo, com a borda voltada para a frente
  inner.rotation.y = -phiLen / 2;
  const tilt = new THREE.Group();
  tilt.add(inner);
  tilt.rotation.x = -1.05;
  g.add(tilt);
  const box = new THREE.Box3().setFromObject(g);
  const center = box.getCenter(new THREE.Vector3());
  tilt.position.set(-center.x, -box.min.y, -center.z);
  return finishModel('ceramic', g, [glaze, clay]);
}

/* ------------------------------------------------------------------ */
/* Arenito: seixo arredondado com grãos e faixas de sedimento             */
/* ------------------------------------------------------------------ */
function buildSandstone(c: BuildCtx): SampleModel {
  const tex = makeTexSet({ size: c.size, aniso: c.aniso, normalStrength: 2.8, sample: sandstoneSampler() });
  const geo = rockGeometry(0.075, 9, 5, 0.62);
  geo.scale(1.35, 0.72, 1.0);
  const p = geo.attributes.position as THREE.BufferAttribute;
  // estratos: leves degraus horizontais que a luz rasante revela
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const x = p.getX(i);
    const z = p.getZ(i);
    const r = Math.hypot(x, z);
    const band = Math.sin(y * 260 + fbmT(x * 20 + 1, z * 20 + 1, 1000, 3, 3) * 2) * 0.0012;
    if (r > 1e-5) p.setXYZ(i, x * (1 + band / r), y, z * (1 + band / r));
  }
  geo.computeBoundingBox();
  const minY = geo.boundingBox!.min.y;
  geo.translate(0, -minY - 0.004, 0);
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = p.getX(i) / 0.09;
    uv[i * 2 + 1] = (p.getZ(i) + p.getY(i) * 0.6) / 0.09;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  const mat = pbrMaterial(tex, { roughness: 1 }, 1.4);
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, mat);
  g.add(m);
  return finishModel('sandstone', g, [tex]);
}

const BUILDERS: Record<SampleId, (c: BuildCtx) => SampleModel> = {
  cork: buildCork,
  wool: buildWool,
  slate: buildSlate,
  linen: buildLinen,
  leaf: buildLeaf,
  smooth_wood: buildSmoothWood,
  ceramic: buildCeramic,
  sandstone: buildSandstone,
};

export function buildSample(id: SampleId, c: BuildCtx): SampleModel {
  return BUILDERS[id](c);
}

