/**
 * js/math-terrain.js
 * Funções analíticas compartilhadas entre terreno, leito do riacho, trilha,
 * colisores de caminhada e limites dos vaga-lumes.
 * Unidades em metros (m). Eixo +Y = altura; -Z = profundidade do vale.
 */

export const WATER_LEVEL = -0.34;
export const VALLEY_Z_MIN = -64;
export const VALLEY_Z_MAX = 18;
export const VALLEY_X_MIN = -26;
export const VALLEY_X_MAX = 26;

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Centro longitudinal X do riacho em função da coordenada Z (m). */
export function streamCenterX(z) {
  return 2.25 + Math.sin(z * 0.082 + 0.35) * 1.45 + Math.cos(z * 0.036) * 0.75;
}

/** Meia-largura do espelho d'água do riacho em Z (m). */
export function streamHalfWidth(z) {
  return 2.65 + 0.45 * Math.sin(z * 0.11 + 1.2) + smoothstep(-10, -45, z) * 0.65;
}

/** Centro longitudinal X da trilha de terra na margem esquerda (m). */
export function trailCenterX(z) {
  return -2.15 + Math.sin(z * 0.082 + 0.55) * 1.15 - smoothstep(-6, -34, z) * 0.35;
}

/** Largura média da trilha pisoteada (m). */
export function trailHalfWidth() {
  return 0.92;
}

/** Fator 0..1 indicando o quão próximo o ponto está do eixo da trilha. */
export function trailMask(x, z) {
  const d = Math.abs(x - trailCenterX(z));
  return 1.0 - smoothstep(trailHalfWidth() * 0.55, trailHalfWidth() * 1.38, d);
}

/**
 * Profundidade do canal do riacho (>0 indica leito submerso abaixo de WATER_LEVEL).
 */
export function streamChannelFactor(x, z) {
  const dx = Math.abs(x - streamCenterX(z));
  const hw = streamHalfWidth(z);
  return 1.0 - smoothstep(hw * 0.15, hw * 1.25, dx);
}

/**
 * Altura analítica do terreno H(x, z) em metros.
 * Combina calha fluvial, leito da trilha batida, várzea gramada e encostas do vale.
 */
export function terrainHeight(x, z) {
  // Micro-ondulações orgânicas determinísticas sem custo de textura
  const undul =
    Math.sin(x * 0.24 + z * 0.18) * 0.14 +
    Math.cos(x * 0.52 - z * 0.41) * 0.055 +
    Math.sin(x * 1.15 + z * 0.95) * 0.022;

  // Encostas laterais que sobem suavemente formando o vale
  const valleySide = Math.max(0, Math.abs(x - streamCenterX(z) * 0.35) - 3.9);
  const hills =
    Math.pow(valleySide * 0.135, 1.55) * 2.25 +
    smoothstep(-22, -64, z) * 1.85 * Math.pow(clamp(Math.abs(x) * 0.09, 0, 2.2), 1.3);

  // Calha suave do riacho abaixo de WATER_LEVEL
  const sc = streamChannelFactor(x, z);
  const bedDip = sc * (0.62 + 0.18 * Math.sin(z * 0.42 + x * 0.6));

  // Leve achatamento na faixa da trilha para caminhada natural
  const tm = trailMask(x, z);
  const trailLevel = -0.06 + Math.sin(z * 0.15) * 0.04;

  let h = 0.14 + undul * (1.0 - tm * 0.72) + hills - bedDip;
  h = lerp(h, trailLevel, tm * 0.76);
  return h;
}

/** Gradiente/normal aproximada da superfície do terreno em (x, z). */
export function terrainNormal(x, z, targetVec) {
  const e = 0.25;
  const hL = terrainHeight(x - e, z);
  const hR = terrainHeight(x + e, z);
  const hD = terrainHeight(x, z - e);
  const hU = terrainHeight(x, z + e);
  targetVec.set(hL - hR, 2 * e, hD - hU).normalize();
  return targetVec;
}

/** Lista de colisores sólidos (postes, árvores grandes e pedras principais). */
export function createStaticColliders() {
  const colliders = [];
  // Postes de lampião na borda esquerda da trilha
  const lanternZ = [3.6, -5.8, -17.5];
  for (const lz of lanternZ) {
    colliders.push({ kind: 'post', x: trailCenterX(lz) - 1.05, z: lz, r: 0.42 });
  }
  // Grande árvore torta frontal esquerda (enquadramento do mockup)
  colliders.push({ kind: 'tree', x: trailCenterX(3.0) - 2.35, z: 2.1, r: 0.95 });
  return colliders;
}

/**
 * Restrição analítica de movimento do jogador:
 * mantém dentro dos limites seguros do vale, impede entrar fundo no leito e empurra para fora de obstáculos.
 */
export function resolvePlayerConstraints(pos, colliders, playerRadius = 0.48) {
  pos.x = clamp(pos.x, -12.5, 9.5);
  pos.z = clamp(pos.z, -38.0, 13.5);

  // Evita afundar no canal central do riacho (permite pisar até a margem rasa)
  const sx = streamCenterX(pos.z);
  const hw = streamHalfWidth(pos.z);
  const dxStream = pos.x - sx;
  if (Math.abs(dxStream) < hw * 0.78) {
    const sign = dxStream <= 0 ? -1 : 1;
    pos.x = sx + sign * hw * 0.78;
  }

  for (let i = 0; i < colliders.length; i++) {
    const c = colliders[i];
    const dx = pos.x - c.x;
    const dz = pos.z - c.z;
    const minDist = c.r + playerRadius;
    const dSq = dx * dx + dz * dz;
    if (dSq < minDist * minDist && dSq > 1e-6) {
      const d = Math.sqrt(dSq);
      const push = (minDist - d) / d;
      pos.x += dx * push;
      pos.z += dz * push;
    }
  }
  return pos;
}
