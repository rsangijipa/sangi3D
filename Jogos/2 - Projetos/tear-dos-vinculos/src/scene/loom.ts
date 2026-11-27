// Tear vertical de madeira clara: estrutura, travessas, roldanas, urdidura com cala animada,
// lançadeira e pente. Unidades em metros, Y para cima. Pivôs por função.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { WARP_RADIUS } from '../game/content.ts';
import { makeLayout, threadsPerWarp, warpX } from '../sim/weavePath.ts';
import { boxUV, scaleUV, type MaterialKit } from './materials.ts';

export const LOOM = {
  postX: 0.64,
  topY: 1.93,
  beamR: 0.045,
  clothY: 0.84,
  clothR: 0.052,
  /** onde o tecido começa (tangente do rolo) */
  fabricBase: 0.865,
  /** altura máxima visível da linha de batida antes de enrolar o tecido */
  maxFell: 1.3,
  heddleY: 1.47,
  shedRodY: 1.64,
  shedOpen: 0.02,
  warpWidth: 0.88,
} as const;

export interface LoomParts {
  root: THREE.Group;
  warps: THREE.Mesh;
  warpUniforms: { uFell: { value: number }; uOpen: { value: number }; uHeddle: { value: number }; uTop: { value: number }; uShedRod: { value: number } };
  setWarpPattern: (signs: number[]) => void;
  rebuildWarps: (count: number) => void;
  heddleBar: THREE.Group;
  pulleys: THREE.Object3D[];
  counterweight: THREE.Object3D;
  tensionRope: THREE.Mesh;
  clothRoll: THREE.Mesh;
  hitPulley: THREE.Mesh;
  hitWarpPlane: THREE.Mesh;
  topTies: THREE.InstancedMesh;
}

function rbox(w: number, h: number, d: number, r: number, grain: 'x' | 'y' | 'z'): THREE.BufferGeometry {
  return boxUV(new RoundedBoxGeometry(w, h, d, 3, r), grain);
}

function cyl(r: number, len: number, seg = 24): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(r, r, len, seg, 1);
  return scaleUV(g, (Math.PI * 2 * r) / 1, len);
}

/** Perfil torneado (lathe) a partir de pares [raio, y]. */
export function lathe(profile: [number, number][], seg = 28): THREE.BufferGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, seg);
  const len = profile.reduce((acc, p, i) => i ? acc + Math.hypot(p[0] - profile[i - 1][0], p[1] - profile[i - 1][1]) : 0, 0);
  return scaleUV(g, 0.2, len);
}

function mesh(g: THREE.BufferGeometry, m: THREE.Material, name: string, shadow = true): THREE.Mesh {
  const me = new THREE.Mesh(g, m);
  me.name = name;
  me.castShadow = shadow;
  me.receiveShadow = true;
  return me;
}

/** Roldana torneada com canal para a corda e eixo de latão. */
function pulley(mat: MaterialKit, name: string, r = 0.075): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const w = 0.036;
  const prof: [number, number][] = [
    [0.012, -w / 2], [r * 0.55, -w / 2], [r * 0.95, -w / 2 + 0.002], [r, -w / 2 + 0.006], [r * 0.86, -0.004],
    [r * 0.86, 0.004], [r, w / 2 - 0.006], [r * 0.95, w / 2 - 0.002], [r * 0.55, w / 2], [0.012, w / 2],
  ];
  const wheel = mesh(lathe(prof, 40), mat.loomWood, `${name}_disco`);
  wheel.rotation.x = Math.PI / 2;
  g.add(wheel);
  // raios entalhados (furos decorativos)
  const hub = mesh(cyl(0.02, w + 0.012, 18), mat.darkWood, `${name}_cubo`);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  const axle = mesh(cyl(0.007, w + 0.05, 12), mat.brass, `${name}_eixo`);
  axle.rotation.x = Math.PI / 2;
  g.add(axle);
  for (let i = 0; i < 4; i++) {
    const hole = mesh(cyl(0.011, w + 0.002, 12), mat.darkWood, `${name}_furo${i}`, false);
    hole.rotation.x = Math.PI / 2;
    const a = (i / 4) * Math.PI * 2 + 0.4;
    hole.position.set(Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52, 0);
    hole.scale.set(1, 1.001, 1);
    g.add(hole);
  }
  return g;
}

/** Catraca dentada na ponta do rolo superior (ajuste de tensão). */
function ratchet(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'catraca';
  const teeth = 14, ro = 0.07, ri = 0.056;
  const s = new THREE.Shape();
  for (let i = 0; i <= teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2) / teeth * 0.75;
    if (i === 0) s.moveTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
    else s.lineTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
    if (i < teeth) s.lineTo(Math.cos(a1) * ro, Math.sin(a1) * ro);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.012, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 2, curveSegments: 8 });
  geo.translate(0, 0, -0.011);
  scaleUV(geo, 1, 1);
  g.add(mesh(geo, mat.darkWood, 'catraca_disco'));
  const pawl = mesh(rbox(0.016, 0.07, 0.016, 0.004, 'y'), mat.darkWood, 'lingueta');
  pawl.position.set(0.05, 0.08, 0);
  pawl.rotation.z = 0.5;
  g.add(pawl);
  return g;
}

export function buildLoom(mat: MaterialKit, warpCount: number): LoomParts {
  const root = new THREE.Group();
  root.name = 'tear';
  const { postX, topY, beamR, clothY, clothR } = LOOM;
  const frameParts: THREE.BufferGeometry[] = [];
  const add = (g: THREE.BufferGeometry, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1));
    frameParts.push(g.clone().applyMatrix4(m));
  };
  // Montantes (com rebaixo para os rolos) e pés em sapata.
  for (const sx of [-1, 1]) {
    add(rbox(0.105, 2.1, 0.115, 0.012, 'y'), sx * postX, 1.05, -0.05);
    add(rbox(0.12, 0.1, 0.9, 0.014, 'z'), sx * postX, 0.05, -0.2);
    // mão-francesa traseira
    const brace = rbox(0.07, 1.3, 0.07, 0.01, 'y');
    add(brace, sx * postX, 0.62, -0.36, 0.52, 0, 0);
    // calços nos pés
    add(rbox(0.12, 0.03, 0.12, 0.008, 'x'), sx * postX, 0.015, 0.2);
    add(rbox(0.12, 0.03, 0.12, 0.008, 'x'), sx * postX, 0.015, -0.56);
    // mancais do rolo superior e do rolo de tecido
    add(rbox(0.11, 0.12, 0.13, 0.012, 'y'), sx * (postX + 0.005), topY, -0.05);
    add(rbox(0.11, 0.12, 0.13, 0.012, 'y'), sx * (postX + 0.005), clothY, -0.05);
  }
  // Travessas: superior, intermediária (atrás da urdidura) e inferior.
  add(rbox(1.52, 0.11, 0.11, 0.012, 'x'), 0, 2.1, -0.05);
  add(rbox(1.36, 0.07, 0.07, 0.01, 'x'), 0, LOOM.shedRodY, -0.1);
  add(rbox(1.36, 0.09, 0.09, 0.01, 'x'), 0, 0.34, -0.06);
  add(rbox(1.36, 0.06, 0.06, 0.008, 'x'), 0, 0.14, -0.5);
  let frameGeo = mergeGeometries(frameParts, false);
  frameGeo = frameGeo ?? new THREE.BoxGeometry(1, 1, 1);
  const frame = mesh(frameGeo, mat.loomWood, 'tear_estrutura');
  root.add(frame);

  // Cavilhas de junção (madeira escura) — detalhe de marcenaria visível.
  const pegGeo = cyl(0.009, 0.1, 10);
  pegGeo.rotateZ(Math.PI / 2);
  const pegs = new THREE.InstancedMesh(pegGeo, mat.darkWood, 12);
  pegs.name = 'cavilhas';
  const pm = new THREE.Matrix4();
  let pi = 0;
  for (const sx of [-1, 1]) for (const y of [2.1, 0.34, LOOM.shedRodY, 1.36, 0.6, 0.14]) {
    pm.makeTranslation(sx * postX, y, 0.012);
    pegs.setMatrixAt(pi++, pm);
  }
  pegs.castShadow = true;
  root.add(pegs);

  // Rolo superior (urdidura) com pomos torneados.
  const beam = mesh(cyl(beamR, 1.4, 28), mat.loomWood, 'travessa_rolo_superior');
  beam.rotation.z = Math.PI / 2;
  beam.position.set(0, topY, -beamR);
  root.add(beam);
  const knobProf: [number, number][] = [[0.0, 0], [0.03, 0], [0.034, 0.012], [0.024, 0.03], [0.03, 0.05], [0.022, 0.07], [0.0, 0.074]];
  for (const sx of [-1, 1]) {
    const k = mesh(lathe(knobProf, 20), mat.loomWood, sx < 0 ? 'pomo_esq' : 'pomo_dir');
    k.rotation.z = -sx * Math.PI / 2;
    k.position.set(sx * 0.7, topY, -beamR);
    root.add(k);
  }
  const rat = ratchet(mat);
  rat.rotation.y = Math.PI / 2;
  rat.position.set(-0.72, topY, -beamR);
  root.add(rat);

  // Rolo do tecido.
  const clothBeam = mesh(cyl(clothR - 0.006, 1.4, 28), mat.loomWood, 'travessa_rolo_tecido');
  clothBeam.rotation.z = Math.PI / 2;
  clothBeam.position.set(0, clothY, -clothR);
  root.add(clothBeam);
  const clothRoll = mesh(cyl(clothR, LOOM.warpWidth + 0.04, 32), mat.clothB, 'tecido_enrolado');
  clothRoll.rotation.z = Math.PI / 2;
  clothRoll.position.set(0, clothY, -clothR);
  clothRoll.visible = false;
  root.add(clothRoll);
  for (const sx of [-1, 1]) {
    const k = mesh(lathe(knobProf, 20), mat.loomWood, 'pomo_rolo');
    k.rotation.z = -sx * Math.PI / 2;
    k.position.set(sx * 0.7, clothY, -clothR);
    root.add(k);
  }

  // Roldanas: duas no topo e uma no montante direito, com corda e contrapeso.
  const pulleys: THREE.Object3D[] = [];
  const pTopL = pulley(mat, 'roldana_superior_esq');
  pTopL.position.set(-postX - 0.09, 1.99, -0.05);
  pTopL.rotation.y = Math.PI / 2;
  const pTopR = pulley(mat, 'roldana_superior_dir');
  pTopR.position.set(postX + 0.09, 1.99, -0.05);
  pTopR.rotation.y = Math.PI / 2;
  const pMid = pulley(mat, 'roldana_tensao', 0.065);
  pMid.position.set(postX + 0.09, LOOM.shedRodY, -0.05);
  pMid.rotation.y = Math.PI / 2;
  pulleys.push(pTopL, pTopR, pMid);
  root.add(pTopL, pTopR, pMid);
  // suportes de ferro para as roldanas
  for (const p of pulleys) {
    const br = mesh(rbox(0.04, 0.024, 0.07, 0.004, 'x'), mat.ironDark, 'suporte_roldana');
    br.position.copy(p.position).add(new THREE.Vector3(p.position.x > 0 ? -0.04 : 0.04, 0, 0));
    root.add(br);
  }
  // Corda de tensão: do rolo superior pela roldana até o contrapeso.
  const weight = new THREE.Group();
  weight.name = 'contrapeso';
  const stone = mesh(lathe([[0, 0], [0.04, 0.0], [0.05, 0.03], [0.048, 0.08], [0.03, 0.105], [0.006, 0.11], [0, 0.11]], 20), mat.ceramicCream, 'contrapeso_pedra');
  stone.position.y = -0.11;
  weight.add(stone);
  const hook = mesh(new THREE.TorusGeometry(0.012, 0.0025, 8, 16), mat.ironDark, 'gancho');
  hook.position.y = 0.006;
  weight.add(hook);
  weight.position.set(postX + 0.09 + 0.065, 1.08, -0.05);
  root.add(weight);
  const ropeGeo = cyl(0.0045, 1, 8);
  ropeGeo.translate(0, -0.5, 0);
  const tensionRope = mesh(ropeGeo, mat.rope, 'corda_tensao');
  tensionRope.position.set(postX + 0.09 + 0.065, LOOM.shedRodY, -0.05);
  root.add(tensionRope);
  const topRope = mesh(cyl(0.0045, 0.36, 8), mat.rope, 'corda_superior');
  topRope.position.set(postX + 0.09 + 0.07, 1.82, -0.05);
  root.add(topRope);

  // Barra de liços (travessa de cala) à frente da urdidura.
  const heddleBar = new THREE.Group();
  heddleBar.name = 'travessa_licos';
  const hb = mesh(cyl(0.013, 1.36, 16), mat.loomWood, 'barra_licos');
  hb.rotation.z = Math.PI / 2;
  heddleBar.add(hb);
  for (const sx of [-1, 1]) {
    const bracket = mesh(rbox(0.05, 0.05, 0.11, 0.01, 'z'), mat.loomWood, 'apoio_licos');
    bracket.position.set(sx * (postX - 0.005), 0, -0.04);
    heddleBar.add(bracket);
  }
  heddleBar.position.set(0, LOOM.heddleY, 0.05);
  root.add(heddleBar);

  // Urdidura: um único BufferGeometry com atributo de sinal da cala por fio.
  const warpUniforms = {
    uFell: { value: LOOM.fabricBase },
    uOpen: { value: 0 },
    uHeddle: { value: LOOM.heddleY },
    uTop: { value: LOOM.topY },
    uShedRod: { value: LOOM.shedRodY },
  };
  const warpMat = mat.warp.clone();
  warpMat.name = 'urdidura_cala';
  warpMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, warpUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
attribute float aShed;
uniform float uFell; uniform float uOpen; uniform float uHeddle; uniform float uTop; uniform float uShedRod;
float shedProfile(float y){
  if (y < uFell) return 0.0;
  if (y < uHeddle) return smoothstep(0.0, 1.0, (y - uFell) / max(0.001, uHeddle - uFell));
  return 1.0 - smoothstep(0.0, 1.0, (y - uHeddle) / max(0.001, uShedRod - uHeddle));
}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
transformed.z += aShed * uOpen * shedProfile(transformed.y);`);
  };
  warpMat.customProgramCacheKey = () => 'urdidura_cala_v1';
  const warps = mesh(new THREE.BufferGeometry(), warpMat, 'urdidura', true);
  warps.frustumCulled = false;
  root.add(warps);

  const tieGeo = new THREE.TorusGeometry(0.006, 0.0022, 6, 12);
  const topTies = new THREE.InstancedMesh(tieGeo, mat.warp, 64);
  topTies.name = 'amarras_urdidura';
  topTies.castShadow = true;
  root.add(topTies);

  // Liços (cordões) ligando a barra a fios alternados.
  const heddleCords = new THREE.InstancedMesh(cyl(0.0009, 1, 4), mat.warp, 64);
  heddleCords.name = 'licos';
  root.add(heddleCords);

  const rebuildWarps = (count: number) => {
    const layout = makeLayout(count, LOOM.warpWidth);
    const k = threadsPerWarp(count);
    const pitch = LOOM.warpWidth / (count * k);
    const parts: THREE.BufferGeometry[] = [];
    const len = topY - clothY + 0.02;
    for (let w = 0; w < count; w++) {
      for (let j = 0; j < k; j++) {
        const x = warpX(layout, w) + (j - (k - 1) / 2) * pitch;
        const g = new THREE.CylinderGeometry(WARP_RADIUS, WARP_RADIUS, len, 6, 72, true);
        scaleUV(g, 1, len / 0.012);
        g.translate(x, clothY + len / 2 - 0.01, 0);
        const n = g.getAttribute('position').count;
        g.setAttribute('aShed', new THREE.BufferAttribute(new Float32Array(n), 1));
        g.setAttribute('aWarp', new THREE.BufferAttribute(new Float32Array(n).fill(w), 1));
        parts.push(g);
      }
    }
    warps.geometry.dispose();
    warps.geometry = mergeGeometries(parts, false) ?? new THREE.BufferGeometry();
    // amarras no rolo superior (uma por grupo)
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    topTies.count = count;
    for (let w = 0; w < count; w++) {
      m.compose(new THREE.Vector3(warpX(layout, w), topY + beamR * 0.25, 0.006), q, new THREE.Vector3(1.4, 1.5, 1.2 + k * 0.35));
      topTies.setMatrixAt(w, m);
    }
    topTies.instanceMatrix.needsUpdate = true;
    let c = 0;
    for (let w = 1; w < count; w += 2) {
      for (let j = 0; j < k; j++) {
        const x = warpX(layout, w) + (j - (k - 1) / 2) * pitch;
        const from = new THREE.Vector3(x, LOOM.heddleY, 0.05);
        const to = new THREE.Vector3(x, LOOM.heddleY - 0.012, 0.0);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const dir = to.clone().sub(from);
        const qq = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        m.compose(mid, qq, new THREE.Vector3(1, dir.length(), 1));
        if (c < 64) heddleCords.setMatrixAt(c++, m);
      }
    }
    heddleCords.count = c;
    heddleCords.instanceMatrix.needsUpdate = true;
  };
  rebuildWarps(warpCount);

  const setWarpPattern = (signs: number[]) => {
    const g = warps.geometry;
    const shed = g.getAttribute('aShed') as THREE.BufferAttribute | undefined;
    const wi = g.getAttribute('aWarp') as THREE.BufferAttribute | undefined;
    if (!shed || !wi) return;
    for (let i = 0; i < shed.count; i++) shed.setX(i, signs[wi.getX(i)] ?? 0);
    shed.needsUpdate = true;
  };

  // Alvos de toque (invisíveis) separados dos visuais.
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitPulley = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.2), hitMat);
  hitPulley.name = 'hit_roldana';
  hitPulley.position.set(postX + 0.13, 1.6, -0.05);
  root.add(hitPulley);
  const hitWarpPlane = new THREE.Mesh(new THREE.PlaneGeometry(LOOM.warpWidth + 0.1, 1.2), hitMat);
  hitWarpPlane.name = 'hit_urdidura';
  hitWarpPlane.position.set(0, clothY + 0.6, 0.0);
  root.add(hitWarpPlane);

  return {
    root,
    warps,
    warpUniforms,
    setWarpPattern,
    rebuildWarps,
    heddleBar,
    pulleys,
    counterweight: weight,
    tensionRope,
    clothRoll,
    hitPulley,
    hitWarpPlane,
    topTies,
  };
}

// ---------- Lançadeira ----------

export function buildShuttle(mat: MaterialKit): { root: THREE.Group; bobbin: THREE.Mesh } {
  const root = new THREE.Group();
  root.name = 'lancadeira';
  const L = 0.27, W = 0.046;
  const s = new THREE.Shape();
  s.moveTo(-L / 2, 0);
  s.bezierCurveTo(-L * 0.3, W * 0.62, L * 0.3, W * 0.62, L / 2, 0);
  s.bezierCurveTo(L * 0.3, -W * 0.62, -L * 0.3, -W * 0.62, -L / 2, 0);
  const hole = new THREE.Path();
  hole.moveTo(-L * 0.22, 0);
  hole.bezierCurveTo(-L * 0.18, W * 0.3, L * 0.18, W * 0.3, L * 0.22, 0);
  hole.bezierCurveTo(L * 0.18, -W * 0.3, -L * 0.18, -W * 0.3, -L * 0.22, 0);
  s.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.006, bevelSegments: 4, curveSegments: 20 });
  geo.translate(0, 0, -0.011);
  boxUV(geo, 'x');
  const body = mesh(geo, mat.loomWood, 'lancadeira_corpo');
  body.rotation.x = -Math.PI / 2;
  root.add(body);
  const pin = mesh(cyl(0.0025, L * 0.46, 8), mat.steel, 'lancadeira_eixo');
  pin.rotation.z = Math.PI / 2;
  root.add(pin);
  const bobbinGeo = lathe([[0.004, -0.05], [0.011, -0.048], [0.014, -0.03], [0.015, 0], [0.014, 0.03], [0.011, 0.048], [0.004, 0.05]], 24);
  scaleUV(bobbinGeo, 8, 6);
  const bobbin = mesh(bobbinGeo, mat.yarn.get('salvia')!, 'lancadeira_bobina');
  bobbin.rotation.z = Math.PI / 2;
  root.add(bobbin);
  return { root, bobbin };
}

// ---------- Pente de bater ----------

export function buildComb(mat: MaterialKit): THREE.Group {
  const g = new THREE.Group();
  g.name = 'pente';
  const back = mesh(rbox(0.16, 0.05, 0.022, 0.008, 'x'), mat.loomWood, 'pente_costas');
  back.position.y = 0.06;
  g.add(back);
  const toothGeo = rbox(0.0042, 0.07, 0.012, 0.0018, 'y');
  const teeth = new THREE.InstancedMesh(toothGeo, mat.loomWood, 22);
  teeth.name = 'pente_dentes';
  const m = new THREE.Matrix4();
  for (let i = 0; i < 22; i++) {
    m.makeTranslation(-0.073 + i * 0.00695, 0.0, 0);
    teeth.setMatrixAt(i, m);
  }
  teeth.castShadow = true;
  g.add(teeth);
  const handle = mesh(lathe([[0, 0], [0.012, 0], [0.016, 0.03], [0.014, 0.09], [0.017, 0.11], [0.0, 0.115]], 16), mat.loomWood, 'pente_cabo');
  handle.position.set(0, 0.08, 0);
  g.add(handle);
  return g;
}
