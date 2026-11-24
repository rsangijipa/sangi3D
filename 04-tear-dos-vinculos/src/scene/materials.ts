// Biblioteca de materiais por papel. Compartilhados entre todas as malhas que fazem o mesmo papel.
import * as THREE from 'three';
import { YARNS } from '../game/content.ts';
import {
  ceramicTextures,
  clothTextures,
  plasterTextures,
  tileTextures,
  wickerTextures,
  woodTextures,
  yarnFiberTextures,
  type PbrSet,
} from './textures.ts';

export interface MaterialKit {
  loomWood: THREE.MeshStandardMaterial;
  tableWood: THREE.MeshStandardMaterial;
  darkWood: THREE.MeshStandardMaterial;
  plaster: THREE.MeshStandardMaterial;
  plasterShade: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  wicker: THREE.MeshStandardMaterial;
  ceramicBlue: THREE.MeshStandardMaterial;
  ceramicCream: THREE.MeshStandardMaterial;
  terracotta: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  ironDark: THREE.MeshStandardMaterial;
  rope: THREE.MeshStandardMaterial;
  warp: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  clothA: THREE.MeshStandardMaterial;
  clothB: THREE.MeshStandardMaterial;
  paper: THREE.MeshStandardMaterial;
  contact: THREE.MeshBasicMaterial;
  /** material de fio por cor (trama) */
  yarn: Map<string, THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>;
  /** material de novelo (bola de lã) por cor */
  ball: Map<string, THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>;
  fiber: { normalMap: THREE.Texture; roughnessMap: THREE.Texture; aoMap: THREE.Texture };
  textures: THREE.Texture[];
}

function rep(set: PbrSet, sx: number, sy: number): PbrSet {
  for (const t of [set.map, set.normalMap, set.roughnessMap]) if (t) t.repeat.set(sx, sy);
  return set;
}

export function createMaterials(lite: boolean): MaterialKit {
  const textures: THREE.Texture[] = [];
  const keep = (s: PbrSet) => { textures.push(s.map, s.normalMap); if (s.roughnessMap) textures.push(s.roughnessMap); return s; };
  // As UVs dos modelos estão em metros: repeat = 1 / tamanho físico coberto pela textura.
  const loomW = keep(rep(woodTextures(11, '#DDA868', '#94592C', lite ? 256 : 512), 1 / 0.5, 1 / 0.9));
  const tableW = keep(rep(woodTextures(23, '#C08A55', '#6B4325', lite ? 256 : 512), 1 / 0.7, 1 / 1.2));
  const darkW = keep(rep(woodTextures(37, '#8A5B35', '#4A2C17', 256), 1 / 0.5, 1 / 0.9));
  const plaster = keep(rep(plasterTextures(5, '#E7D3B6', lite ? 256 : 512), 1 / 1.6, 1 / 1.6));
  const floor = keep(rep(tileTextures(9, lite ? 512 : 1024), 1 / 1.6, 1 / 1.6));
  const wick = keep(rep(wickerTextures(3, lite ? 256 : 512), 1 / 0.35, 1 / 0.35));
  const ceramB = keep(ceramicTextures(41, '#4F7F86', '#2B3A3A', 256));
  const ceramC = keep(ceramicTextures(43, '#D9CDB7', '#6B5B48', 256));
  const clothA = keep(rep(clothTextures(51, '#EDE3CF', '#D9CBB0', ['#AA584D', '#536E68'], 256), 1 / 0.4, 1 / 0.4));
  const clothB = keep(rep(clothTextures(53, '#AA584D', '#8E4439', ['#D7B86D', '#EEE5D4'], 256), 1 / 0.4, 1 / 0.4));
  const fiber = yarnFiberTextures(17, lite ? 128 : 256);
  textures.push(fiber.normalMap, fiber.roughnessMap, fiber.aoMap);

  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
  const fromSet = (s: PbrSet, extra: THREE.MeshStandardMaterialParameters = {}) =>
    std({ map: s.map, normalMap: s.normalMap, roughnessMap: s.roughnessMap ?? null, roughness: 1, metalness: 0, ...extra });

  const yarn = new Map<string, THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>();
  const ball = new Map<string, THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>();
  for (const y of YARNS) {
    const mk = () => lite
      ? std({ color: y.cor, roughness: 0.95, normalMap: fiber.normalMap, normalScale: new THREE.Vector2(0.9, 0.9), aoMap: fiber.aoMap, aoMapIntensity: 0.6 })
      : new THREE.MeshPhysicalMaterial({
        color: y.cor,
        roughness: 0.92,
        normalMap: fiber.normalMap,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: fiber.roughnessMap,
        aoMap: fiber.aoMap,
        aoMapIntensity: 0.65,
        sheen: 1,
        sheenColor: new THREE.Color(y.brilho),
        sheenRoughness: 0.55,
      });
    const m = mk();
    m.name = `fio_${y.id}`;
    yarn.set(y.id, m);
    const b = mk();
    b.name = `novelo_${y.id}`;
    ball.set(y.id, b);
  }

  const warp = std({ color: '#EDE2CB', roughness: 0.85, normalMap: fiber.normalMap, normalScale: new THREE.Vector2(0.6, 0.6) });
  warp.name = 'urdidura_linho';

  const kit: MaterialKit = {
    loomWood: fromSet(loomW, { name: 'madeira_clara_tear' }),
    tableWood: fromSet(tableW, { name: 'madeira_bancada' }),
    darkWood: fromSet(darkW, { name: 'madeira_escura' }),
    plaster: fromSet(plaster, { name: 'reboco', roughness: 0.95 }),
    plasterShade: fromSet(plaster, { name: 'reboco_sombra', roughness: 0.95, color: '#D2B996' }),
    floor: fromSet(floor, { name: 'piso_terracota' }),
    wicker: fromSet(wick, { name: 'vime', roughness: 0.85 }),
    ceramicBlue: fromSet(ceramB, { name: 'ceramica_azul', roughness: 0.32 }),
    ceramicCream: fromSet(ceramC, { name: 'ceramica_creme', roughness: 0.4 }),
    terracotta: std({ name: 'terracota', color: '#A8603F', roughness: 0.85 }),
    brass: std({ name: 'latao', color: '#B58A4C', metalness: 1, roughness: 0.32 }),
    steel: std({ name: 'aco', color: '#C9C6C0', metalness: 1, roughness: 0.22 }),
    ironDark: std({ name: 'ferro', color: '#2E2A27', metalness: 0.8, roughness: 0.5 }),
    rope: std({ name: 'corda', color: '#CDB892', roughness: 0.9, normalMap: fiber.normalMap }),
    warp,
    glass: new THREE.MeshPhysicalMaterial({ name: 'vidro', color: '#DDEBE6', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.12, depthWrite: false }),
    clothA: fromSet(clothA, { name: 'manta_linho', roughness: 0.95 }),
    clothB: fromSet(clothB, { name: 'manta_telha', roughness: 0.95 }),
    paper: std({ name: 'papel_kraft', color: '#E6D6B8', roughness: 0.9 }),
    contact: new THREE.MeshBasicMaterial({ name: 'sombra_contato', color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }),
    yarn,
    ball,
    fiber,
    textures,
  };
  return kit;
}

// ---------- utilidades de UV em metros ----------

/** Mapeamento em caixa no espaço do objeto: UV em metros, veio ao longo do eixo `grain`. */
export function boxUV(geo: THREE.BufferGeometry, grain: 'x' | 'y' | 'z' = 'y'): THREE.BufferGeometry {
  const pos = geo.getAttribute('position');
  const nor = geo.getAttribute('normal');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const c = { x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) };
    const ax = Math.abs(nor.getX(i)), ay = Math.abs(nor.getY(i)), az = Math.abs(nor.getZ(i));
    const d: 'x' | 'y' | 'z' = ax >= ay && ax >= az ? 'x' : ay >= az ? 'y' : 'z';
    const t = (['x', 'y', 'z'] as const).filter((a) => a !== d);
    let u: number, v: number;
    if (t.includes(grain)) { v = c[grain]; u = c[t[0] === grain ? t[1] : t[0]]; }
    else { u = c[t[0]]; v = c[t[1]]; }
    uv[i * 2] = u; uv[i * 2 + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

/** Escala UV (0..1) de cilindros/tubos para metros. */
export function scaleUV(geo: THREE.BufferGeometry, su: number, sv: number): THREE.BufferGeometry {
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  uv.needsUpdate = true;
  return geo;
}
