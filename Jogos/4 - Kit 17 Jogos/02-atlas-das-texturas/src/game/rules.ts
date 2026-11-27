import { SAMPLE_IDS, type SampleId, type Mode } from './content';

/** Limites físicos e de interação (espelham o briefing). */
export const LIMITS = {
  lampAngle: { min: -75, max: 75 },
  lampElevation: { min: 15, max: 65 },
  zoom: { min: 1, max: 3 },
  /** Área da bandeja (m) onde a lupa pode passear. */
  magnifier: { x: 0.17, z: 0.12 },
  companionMin: 2,
  companionMax: 4,
  chooseCount: 2,
} as const;

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export const clampLampAngle = (v: number) => clamp(v, LIMITS.lampAngle.min, LIMITS.lampAngle.max);
export const clampLampElevation = (v: number) => clamp(v, LIMITS.lampElevation.min, LIMITS.lampElevation.max);
export const clampZoom = (v: number) => clamp(v, LIMITS.zoom.min, LIMITS.zoom.max);
export function clampMagnifier(x: number, z: number): [number, number] {
  return [clamp(x, -LIMITS.magnifier.x, LIMITS.magnifier.x), clamp(z, -LIMITS.magnifier.z, LIMITS.magnifier.z)];
}

/** Rotação sempre normalizada em [0, 360). */
export const normRotation = (deg: number) => ((deg % 360) + 360) % 360;

export const isSampleId = (v: unknown): v is SampleId => typeof v === 'string' && (SAMPLE_IDS as readonly string[]).includes(v);

/** Conjunto válido para o modo acompanhado: 2 a 4 amostras distintas e conhecidas. */
export function validCompanionSet(ids: readonly string[]): boolean {
  const uniq = new Set(ids.filter(isSampleId));
  return uniq.size === ids.length && uniq.size >= LIMITS.companionMin && uniq.size <= LIMITS.companionMax;
}

export function allowedFor(mode: Mode, companion: readonly SampleId[]): SampleId[] {
  return mode === 'acompanhado' && validCompanionSet(companion) ? [...companion] : [...SAMPLE_IDS];
}

/**
 * Alterna uma amostra na escolha. No modo livre a troca é instantânea: escolher uma terceira
 * substitui a mais antiga. Nos demais, a terceira só entra depois de liberar uma vaga.
 */
export function toggleChoice(chosen: readonly SampleId[], id: SampleId, allowed: readonly SampleId[], mode: Mode): SampleId[] {
  if (!allowed.includes(id)) return [...chosen];
  if (chosen.includes(id)) return chosen.filter((c) => c !== id);
  if (chosen.length < LIMITS.chooseCount) return [...chosen, id];
  if (mode === 'livre') return [...chosen.slice(1), id];
  return [...chosen];
}

/** PRNG determinístico (mulberry32): mesma semente, mesma sequência. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Completa a escolha (ao pular a etapa) de forma reprodutível pela semente. */
export function fillChoice(chosen: readonly SampleId[], allowed: readonly SampleId[], seed: number): SampleId[] {
  const out = [...chosen];
  const pool = allowed.filter((a) => !out.includes(a));
  const r = seeded(seed);
  while (out.length < LIMITS.chooseCount && pool.length) {
    out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  }
  return out;
}

/** Sorteia um desafio de correspondência: alvo + 3 opções, reprodutível. */
export function makeChallenge(allowed: readonly SampleId[], seed: number, round: number) {
  const r = seeded(seed * 31 + round * 977);
  const pool = [...allowed];
  const target = pool[Math.floor(r() * pool.length)];
  const others = pool.filter((p) => p !== target);
  const options: SampleId[] = [target];
  while (options.length < Math.min(3, allowed.length) && others.length) options.push(others.splice(Math.floor(r() * others.length), 1)[0]);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, options };
}
