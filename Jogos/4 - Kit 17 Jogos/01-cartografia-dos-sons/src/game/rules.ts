// src/game/rules.ts
// Regras determinísticas de física, distância, atenuação acústica e caminhos válidos
import { STREET_WAYPOINTS } from './content';

export const GRID_SNAP_SIZE = 0.25;

export const BOARD_BOUNDS = {
  minX: -6.5,
  maxX: 6.5,
  minZ: -4.5,
  maxZ: 4.5
};

export type Vec3 = [number, number, number];

/**
 * Encaixa uma coordenada no grid de 0.25m conforme requisito do contrato
 */
export function snapToGrid(coord: number, step = GRID_SNAP_SIZE): number {
  return Math.round(coord / step) * step;
}

export function snapPointToGrid(point: Vec3, step = GRID_SNAP_SIZE): Vec3 {
  return [snapToGrid(point[0], step), point[1], snapToGrid(point[2], step)];
}

/**
 * Garante que a posição permaneça dentro dos limites úteis da bandeja do diorama
 */
export function clampToBoardBounds(point: Vec3): Vec3 {
  const x = Math.max(BOARD_BOUNDS.minX, Math.min(BOARD_BOUNDS.maxX, point[0]));
  const z = Math.max(BOARD_BOUNDS.minZ, Math.min(BOARD_BOUNDS.maxZ, point[2]));
  return [x, point[1], z];
}

/**
 * Distância euclidiana bidimensional no plano XZ
 */
export function calculateDistanceXZ(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Calcula atenuação de ganho contínua e suave baseada na distância relativa.
 * Não simula dB brutos ou perda total instantânea, mas garante contraste acústico nítido.
 */
export function calculateDistanceGain(
  sourcePos: Vec3,
  listenerPos: Vec3,
  baseGain = 1.0,
  referenceDistance = 1.5,
  rolloff = 1.15
): number {
  const dist = calculateDistanceXZ(sourcePos, listenerPos);
  if (dist <= referenceDistance) {
    return baseGain;
  }
  // Formula suave: baseGain / (1 + rolloff * (dist - refDist) / refDist)
  const factor = 1 / (1 + (rolloff * (dist - referenceDistance)) / referenceDistance);
  // Limite inferior perceptível para evitar silêncio abrupto
  return Math.max(0.08, Math.min(1.0, baseGain * factor));
}

/**
 * Calcula pan estéreo [-1, 1] entre a fonte e o ouvinte no plano XZ
 */
export function calculateStereoPan(
  sourcePos: Vec3,
  listenerPos: Vec3,
  stereoSpreadDistance = 5.0
): number {
  const dx = sourcePos[0] - listenerPos[0];
  const pan = dx / stereoSpreadDistance;
  return Math.max(-1.0, Math.min(1.0, pan));
}

/**
 * Projeta um ponto (x, z) no segmento de reta [A, B] mais próximo
 */
function projectPointOnSegment(p: Vec3, a: Vec3, b: Vec3): Vec3 {
  const abX = b[0] - a[0];
  const abZ = b[2] - a[2];
  const lenSq = abX * abX + abZ * abZ;
  if (lenSq === 0) return [a[0], a[1], a[2]];

  const apX = p[0] - a[0];
  const apZ = p[2] - a[2];
  const t = Math.max(0, Math.min(1, (apX * abX + apZ * abZ) / lenSq));

  return [a[0] + t * abX, a[1], a[2] + t * abZ];
}

/**
 * Encontra a projeção no caminho da rua mais próxima para o ônibus,
 * garantindo que ele nunca atravesse edifícios ou saia da via de asfalto.
 */
export function snapToStreetNetwork(point: Vec3, waypoints = STREET_WAYPOINTS): Vec3 {
  let closestPoint: Vec3 = waypoints[0];
  let minDistance = Infinity;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const proj = projectPointOnSegment(point, waypoints[i], waypoints[i + 1]);
    const d = calculateDistanceXZ(point, proj);
    if (d < minDistance) {
      minDistance = d;
      closestPoint = proj;
    }
  }

  // Snap suave ao grid ao longo do segmento
  return [snapToGrid(closestPoint[0]), closestPoint[1], snapToGrid(closestPoint[2])];
}

/**
 * Avalia a comparação de distância perceptual entre fonte A e fonte B relativas ao ouvinte.
 */
export function evaluateDistanceComparison(
  sourceAPos: Vec3,
  sourceBPos: Vec3,
  listenerPos: Vec3,
  tolerance = 0.4
): {
  distA: number;
  distB: number;
  relationship: 'A_closer' | 'B_closer' | 'similar';
} {
  const distA = calculateDistanceXZ(sourceAPos, listenerPos);
  const distB = calculateDistanceXZ(sourceBPos, listenerPos);

  let relationship: 'A_closer' | 'B_closer' | 'similar' = 'similar';
  if (distA + tolerance < distB) {
    relationship = 'A_closer';
  } else if (distB + tolerance < distA) {
    relationship = 'B_closer';
  }

  return { distA, distB, relationship };
}
