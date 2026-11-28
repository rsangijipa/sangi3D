/**
 * Meteorologia das Emocoes — validacao de regras e transicoes de FSM.
 * Funcoes puras; nao diagnostica nada.
 */

import type { GameState, Step, Weather } from './state.js';

export const ALLOWED_TRANSITIONS: Record<Step, Step[]> = {
  start: ['choose-mode'],
  'choose-mode': ['demo', 'compose'],
  demo: ['compose'],
  compose: ['review', 'compose'],
  review: ['summary', 'compose'],
  summary: ['exit', 'compose'],
  exit: [],
};

export function canTransition(state: GameState, to: Step): boolean {
  return ALLOWED_TRANSITIONS[state.step].includes(to);
}

export function validWeather(w: Partial<Weather>): boolean {
  for (const k of ['sun', 'cloud', 'rain', 'wind'] as const) {
    const v = w[k];
    if (v === undefined) continue;
    if (!Number.isFinite(v)) return false;
    if (v < 0 || v > 4) return false;
  }
  return true;
}

export function clampWeather(w: Weather): Weather {
  return {
    sun: clamp(w.sun),
    cloud: clamp(w.cloud),
    rain: clamp(w.rain),
    wind: clamp(w.wind),
  };
}

function clamp(v: number): number {
  return Math.min(4, Math.max(0, Math.round(v)));
}

export function maxSnapshotsReached(state: GameState, limit = 12): boolean {
  return state.snapshots.length >= limit;
}

export function bulletinLengthOk(text: string, max = 500): boolean {
  return text.length <= max;
}

export function isDestructiveAction(actionType: string): boolean {
  return ['RESET_SESSION', 'DELETE_SNAPSHOT', 'CLEAR_BULLETIN'].includes(actionType);
}

export function requireConfirmation(actionType: string): boolean {
  return actionType === 'RESET_SESSION';
}

export function readableSummary(state: GameState): string {
  const parts: string[] = [];
  parts.push(`Modo: ${state.mode}`);
  parts.push(`Etapa: ${state.step}`);
  parts.push(
    `Clima: sol ${state.weather.sun}/4, nuvens ${state.weather.cloud}/4, chuva ${state.weather.rain}/4, vento ${state.weather.wind}/4`
  );
  if (state.emotionTags.length) parts.push(`Tags: ${state.emotionTags.join(', ')}`);
  if (state.bulletin) parts.push(`Boletim: ${state.bulletin}`);
  parts.push(`Snapshots guardados: ${state.snapshots.length}`);
  parts.push(`Duracao ativa: ${state.counters.activeSeconds}s`);
  return parts.join(' | ');
}
