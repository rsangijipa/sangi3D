/**
 * Pure mathematical representation of the Amazonian Igarapé channel,
 * centerline spline, bank elevation, vector current field, docking banks,
 * stretches, and native fauna placements.
 *
 * Coordinate convention:
 * - Water surface is at y = 0.
 * - Longitudinal parameter `s` goes from 0 (upstream start) to RIVER_LENGTH (downstream cove).
 * - Forward direction along the river is roughly -Z so the canoe opens facing -Z.
 */

export const RIVER_LENGTH = 240;

export interface Vec2 {
  x: number;
  z: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface RiverSample {
  s: number;
  center: Vec2;
  tangent: Vec2; // unit vector pointing downstream (+s)
  right: Vec2;   // unit vector pointing to right bank (+lateral)
  halfWidth: number;
  currentSpeed: number; // m/s at center of channel
}

export interface StretchInfo {
  id: number;
  name: string;
  shortName: string;
  sStart: number;
  sEnd: number;
  spawnS: number;
  description: string;
}

export interface DockZone {
  id: string;
  name: string;
  stretchId: number;
  s: number;
  side: -1 | 1; // -1 = left bank, +1 = right bank
  position: Vec2;
  postPosition: Vec2;
  radius: number;
  description: string;
}

export type FaunaSpeciesId =
  | 'arara_caninde'
  | 'capivara'
  | 'garca_branca'
  | 'tucano_toco'
  | 'boto_rosa'
  | 'preguica'
  | 'borboleta_morpho';

export interface FaunaSpec {
  id: FaunaSpeciesId;
  name: string;
  scientificName: string;
  stretchId: number;
  s: number;
  lateral: number; // meters from centerline (+ right, - left)
  yOffset: number; // meters above water/ground reference
  groundAnchored: boolean;
  behavior: 'perched' | 'grazing' | 'wading' | 'swimming' | 'hanging' | 'fluttering';
  habitatNote: string;
  scale: number;
  facingYawOffset: number;
}

export const STRETCHES: readonly StretchInfo[] = [
  {
    id: 1,
    name: 'Trecho 1 · Remanso das Samaúmas',
    shortName: 'Remanso das Samaúmas',
    sStart: 0,
    sEnd: 82,
    spawnS: 12,
    description:
      'Águas calmas sombreadas por raízes tabulares centenárias, araras nas copas e capivaras na margem ensolarada.',
  },
  {
    id: 2,
    name: 'Trecho 2 · Curva das Helicônias',
    shortName: 'Curva das Helicônias',
    sStart: 82,
    sEnd: 162,
    spawnS: 92,
    description:
      'Canal sinuoso de correnteza moderada cercado por helicônias vermelhas, tucanos e garças à espreita.',
  },
  {
    id: 3,
    name: 'Trecho 3 · Lagoa das Vitórias-Régias',
    shortName: 'Lagoa das Vitórias-Régias',
    sStart: 162,
    sEnd: RIVER_LENGTH,
    spawnS: 170,
    description:
      'Alargamento silencioso do igarapé onde botos emergem entre vitórias-régias gigantes e o dossel se abre ao céu.',
  },
] as const;

/**
 * Centerline X as a smooth analytic function of longitudinal coordinate s.
 * Designed so that at s=12..32 the channel bends gently right ahead (matching the mockup vista),
 * then winds left in Stretch 2 and widens into a serene cove in Stretch 3.
 */
export function centerlineX(s: number): number {
  const t = Math.max(-20, Math.min(RIVER_LENGTH + 20, s));
  return (
    Math.sin((t - 12) * 0.036) * 14.5 +
    Math.sin((t - 12) * 0.017 + 0.6) * 10.5 -
    Math.sin(0.6) * 10.5
  );
}

/**
 * Derivative dX/ds for exact centerline tangent without finite-difference jitter.
 */
function centerlineDX(s: number): number {
  const t = Math.max(-20, Math.min(RIVER_LENGTH + 20, s));
  return (
    Math.cos((t - 12) * 0.036) * 14.5 * 0.036 +
    Math.cos((t - 12) * 0.017 + 0.6) * 10.5 * 0.017
  );
}

/**
 * Navigable channel half-width in meters at longitudinal distance s.
 * Cozy ~5.4m half-width (10.8m channel) near Samaúmas, tightening slightly at curves,
 * widening to ~9.5m half-width in Stretch 3 (Lagoa das Vitórias-Régias).
 */
export function channelHalfWidth(s: number): number {
  const base = 5.4 + Math.sin(s * 0.055) * 0.75;
  const coveFactor = smoothstep(158, 212, s);
  const endTaper = 1 - 0.18 * smoothstep(224, 240, s);
  return (base + coveFactor * 4.4) * endTaper;
}

/**
 * Smoothstep helper in [0, 1].
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Sample the river frame at longitudinal coordinate s.
 * Remember z = -s so downstream points toward -Z.
 */
export function sampleRiver(s: number): RiverSample {
  const clampedS = Math.max(-16, Math.min(RIVER_LENGTH + 16, s));
  const cx = centerlineX(clampedS);
  const cz = -clampedS;
  const dx = centerlineDX(clampedS);
  const dz = -1;
  const len = Math.hypot(dx, dz) || 1;
  const tx = dx / len;
  const tz = dz / len;
  // Right-hand bank normal when looking downstream (tangent = (tx, tz), Y-up):
  // right = tangent x up = (-tz, tx)
  const rx = -tz;
  const rz = tx;
  const halfWidth = channelHalfWidth(clampedS);
  // Narrower sections flow slightly faster (continuity approximation), cove slows down
  const baseCurrent = 0.42 * (5.6 / Math.max(4.5, halfWidth));
  return {
    s: clampedS,
    center: { x: cx, z: cz },
    tangent: { x: tx, z: tz },
    right: { x: rx, z: rz },
    halfWidth,
    currentSpeed: Math.max(0.16, Math.min(0.62, baseCurrent)),
  };
}

/**
 * Convert river-local coordinates (s, lateral) into world (x, z).
 */
export function riverToWorld(s: number, lateral: number): Vec2 {
  const sample = sampleRiver(s);
  return {
    x: sample.center.x + sample.right.x * lateral,
    z: sample.center.z + sample.right.z * lateral,
  };
}

/**
 * Project a world position (x, z) onto the nearest river longitudinal coordinate s
 * and signed lateral offset (+ = right bank, - = left bank).
 * Uses 3 Newton-like refinement iterations around s ≈ -z for fast, accurate projection.
 */
export function projectToRiver(x: number, z: number): {
  s: number;
  lateral: number;
  sample: RiverSample;
} {
  let s = Math.max(0, Math.min(RIVER_LENGTH, -z));
  for (let i = 0; i < 4; i++) {
    const sample = sampleRiver(s);
    const vx = x - sample.center.x;
    const vz = z - sample.center.z;
    const along = vx * sample.tangent.x + vz * sample.tangent.z;
    s = Math.max(0, Math.min(RIVER_LENGTH, s + along * 0.85));
  }
  const sample = sampleRiver(s);
  const vx = x - sample.center.x;
  const vz = z - sample.center.z;
  const lateral = vx * sample.right.x + vz * sample.right.z;
  return { s, lateral, sample };
}

/**
 * Continuous riverbank & riverbed height field (y = 0 is water level).
 * - Inside channel: negative depth (-1.6m at center, shallowing near banks).
 * - Outside channel: gently rises into mossy undulating rainforest banks (0.25m to 3.4m).
 */
export function terrainHeightAt(x: number, z: number): number {
  const { s, lateral, sample } = projectToRiver(x, z);
  const absLat = Math.abs(lateral);
  const hw = sample.halfWidth;
  // Subtle organic undulation along banks
  const microNoise =
    Math.sin(x * 0.27 + z * 0.19) * 0.18 +
    Math.cos(x * 0.13 - z * 0.23) * 0.24 +
    Math.sin(s * 0.11 + lateral * 0.31) * 0.12;

  if (absLat < hw - 0.6) {
    const edge = absLat / Math.max(1, hw - 0.6);
    const bedDepth = -1.65 * (1 - edge * edge * 0.72);
    return bedDepth + microNoise * 0.18;
  }

  const bankDist = absLat - (hw - 0.6);
  // Smooth shoreline ramp rising out of dark water
  const shoreRise = smoothstep(0, 2.2, bankDist) * 0.62;
  const forestRise = smoothstep(2.0, 14.0, bankDist) * 2.45;
  return -0.22 + shoreRise + forestRise + microNoise * smoothstep(0.4, 3.5, bankDist);
}

/**
 * Vector current field at world (x, z) in m/s.
 * Parabolic Poiseuille-like profile across the channel: strongest in center,
 * slower near shallow banks and near the downstream turnaround cove.
 */
export function currentAt(x: number, z: number): Vec2 {
  const { s, lateral, sample } = projectToRiver(x, z);
  const ratio = Math.min(1, Math.abs(lateral) / Math.max(1, sample.halfWidth));
  const profile = Math.max(0.22, 1 - 0.72 * ratio * ratio);
  // Ease current gently near both ends so canoe never gets pushed into end-caps hard
  const endEase = 1 - 0.75 * smoothstep(RIVER_LENGTH - 18, RIVER_LENGTH - 2, s);
  const speed = sample.currentSpeed * profile * endEase;
  return {
    x: sample.tangent.x * speed,
    z: sample.tangent.z * speed,
  };
}

export function getStretchForS(s: number): StretchInfo {
  for (const st of STRETCHES) {
    if (s >= st.sStart && s <= st.sEnd) return st;
  }
  return STRETCHES[STRETCHES.length - 1];
}

function makeDockZone(
  id: string,
  name: string,
  stretchId: number,
  s: number,
  side: -1 | 1,
  description: string
): DockZone {
  const sample = sampleRiver(s);
  const moorLat = side * (sample.halfWidth - 1.55);
  const postLat = side * (sample.halfWidth + 0.45);
  return {
    id,
    name,
    stretchId,
    s,
    side,
    position: {
      x: sample.center.x + sample.right.x * moorLat,
      z: sample.center.z + sample.right.z * moorLat,
    },
    postPosition: {
      x: sample.center.x + sample.right.x * postLat,
      z: sample.center.z + sample.right.z * postLat,
    },
    radius: 3.4,
    description,
  };
}

export const DOCK_ZONES: readonly DockZone[] = [
  makeDockZone(
    'dock-samauma',
    'Margem das Samaúmas',
    1,
    46,
    1,
    'Barranco firme com amarração em tronco caído e vista privilegiada para o dossel.'
  ),
  makeDockZone(
    'dock-heliconia',
    'Recanto das Helicônias',
    2,
    122,
    -1,
    'Enseada calma de água escura rodeada por flores tropicais e canto de aves.'
  ),
  makeDockZone(
    'dock-vitoria',
    'Mirante das Vitórias-Régias',
    3,
    205,
    1,
    'Margem autorizada na lagoa final para observação silenciosa de botos.'
  ),
];

export const FAUNA_CATALOG: readonly FaunaSpec[] = [
  {
    id: 'arara_caninde',
    name: 'Arara-canindé',
    scientificName: 'Ara ararauna',
    stretchId: 1,
    s: 21.5,
    lateral: -2.15,
    yOffset: 3.55,
    groundAnchored: false,
    behavior: 'perched',
    habitatNote:
      'Pousada em galho pendente sobre o igarapé; vive em casais e se alimenta de frutos de palmeiras.',
    scale: 1.05,
    facingYawOffset: 0.45,
  },
  {
    id: 'capivara',
    name: 'Capivara',
    scientificName: 'Hydrochoerus hydrochaeris',
    stretchId: 1,
    s: 26.5,
    lateral: 6.25,
    yOffset: 0.0,
    groundAnchored: true,
    behavior: 'grazing',
    habitatNote:
      'Maior roedor do mundo; descansa em clareiras úmidas à beira-d’água e mergulha ao menor sinal de perigo.',
    scale: 1.08,
    facingYawOffset: -1.65,
  },
  {
    id: 'borboleta_morpho',
    name: 'Borboleta Morpho-azul',
    scientificName: 'Morpho menelaus',
    stretchId: 1,
    s: 56,
    lateral: -1.2,
    yOffset: 1.85,
    groundAnchored: false,
    behavior: 'fluttering',
    habitatNote:
      'Asas azul-metálicas iridescentes que cintilam ao cruzar os fachos de sol que atravessam a copa.',
    scale: 1.1,
    facingYawOffset: 0.3,
  },
  {
    id: 'garca_branca',
    name: 'Garça-branca-grande',
    scientificName: 'Ardea alba',
    stretchId: 2,
    s: 102,
    lateral: 5.15,
    yOffset: 0.0,
    groundAnchored: true,
    behavior: 'wading',
    habitatNote:
      'Permanece imóvel nas margens rasas aguardando pequenos peixes sob os reflexos da água escura.',
    scale: 1.05,
    facingYawOffset: -1.8,
  },
  {
    id: 'tucano_toco',
    name: 'Tucano-toco',
    scientificName: 'Ramphastos toco',
    stretchId: 2,
    s: 138,
    lateral: -3.2,
    yOffset: 4.1,
    groundAnchored: false,
    behavior: 'perched',
    habitatNote:
      'Bico leve e alaranjado essencial na dispersão de sementes pela floresta alagada.',
    scale: 1.08,
    facingYawOffset: 0.75,
  },
  {
    id: 'preguica',
    name: 'Preguiça-de-três-dedos',
    scientificName: 'Bradypus tridactylus',
    stretchId: 3,
    s: 178,
    lateral: -4.2,
    yOffset: 4.35,
    groundAnchored: false,
    behavior: 'hanging',
    habitatNote:
      'Move-se em câmera lenta nos galhos das embaúbas, camuflada por microalgas esverdeadas na pelagem.',
    scale: 1.0,
    facingYawOffset: 1.1,
  },
  {
    id: 'boto_rosa',
    name: 'Boto-cor-de-rosa',
    scientificName: 'Inia geoffrensis',
    stretchId: 3,
    s: 202,
    lateral: -1.6,
    yOffset: -0.05,
    groundAnchored: false,
    behavior: 'swimming',
    habitatNote:
      'Golfinho de água doce adaptado às curvas de igarapés e florestas inundadas da bacia amazônica.',
    scale: 1.15,
    facingYawOffset: 0.2,
  },
];

export function getFaunaWorldPosition(spec: FaunaSpec, elapsed: number): Vec3 {
  const base = riverToWorld(spec.s, spec.lateral);
  if (spec.behavior === 'fluttering') {
    const rx = Math.cos(elapsed * 0.9 + spec.s) * 1.9;
    const rz = Math.sin(elapsed * 1.35 + spec.s) * 1.6;
    const ry = Math.sin(elapsed * 2.4) * 0.35;
    return { x: base.x + rx, y: spec.yOffset + ry, z: base.z + rz };
  }
  if (spec.behavior === 'swimming') {
    // Gentle elliptical cruise in the Stretch 3 cove + periodic surfacing arc
    const angle = elapsed * 0.24;
    const cx = base.x + Math.cos(angle) * 3.6;
    const cz = base.z + Math.sin(angle) * 4.8;
    const surfacePhase = Math.sin(elapsed * 0.85);
    const cy = -0.32 + Math.max(-0.25, surfacePhase * 0.42);
    return { x: cx, y: cy, z: cz };
  }
  if (spec.groundAnchored) {
    const groundY = Math.max(0.06, terrainHeightAt(base.x, base.z));
    return { x: base.x, y: groundY + spec.yOffset, z: base.z };
  }
  return { x: base.x, y: spec.yOffset, z: base.z };
}
