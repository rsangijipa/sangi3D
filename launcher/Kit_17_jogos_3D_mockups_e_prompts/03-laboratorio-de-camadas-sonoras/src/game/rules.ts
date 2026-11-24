/**
 * Laboratório de Camadas Sonoras — Regras de Áudio e Validação de Mixagem
 * Cálculo matemático de ganhos efetivos, solos, mute global e rampas sem cliques
 */

import { ChannelId, GameState, SoundChannelState } from './state';

/**
 * Calcula o ganho efetivo (0.0 a 1.0) para cada canal físico da bancada
 * Regra:
 * 1. Se masterMute ativo -> todos 0
 * 2. Se solo ativo -> apenas o canal solo tem ganho nominal (se não estiver com mute individual), os demais têm ganho 0
 * 3. Se sem solo -> ganho nominal do canal (ou 0 se o canal individual estiver em mute)
 */
export function calculateEffectiveGain(
  channel: SoundChannelState,
  soloId: ChannelId | null,
  masterMute: boolean,
  volumeCeiling: number = 1.0
): number {
  if (masterMute) return 0.0;

  if (soloId !== null) {
    if (channel.id === soloId) {
      if (channel.mute) return 0.0;
      return Math.min(channel.level, volumeCeiling);
    } else {
      return 0.0;
    }
  }

  if (channel.mute) return 0.0;
  return Math.min(channel.level, volumeCeiling);
}

/**
 * Calcula os ganhos de todos os 5 canais simultaneamente
 */
export function calculateAllEffectiveGains(
  state: GameState
): Record<ChannelId, number> {
  const gains: Record<ChannelId, number> = {} as Record<ChannelId, number>;
  for (const channel of state.channels) {
    gains[channel.id] = calculateEffectiveGain(
      channel,
      state.soloId,
      state.masterMute,
      state.maxVolumeCeiling
    );
  }
  return gains;
}

/**
 * Compara dois perfis de mixagem (A e B) e retorna as diferenças absolutas por canal
 */
export function compareMixProfiles(
  mixA: Record<ChannelId, number>,
  mixB: Record<ChannelId, number>
): {
  channelDeltas: Record<ChannelId, number>;
  totalDelta: number;
  mostChangedChannel: ChannelId;
} {
  const channelDeltas: Record<ChannelId, number> = {} as Record<ChannelId, number>;
  let totalDelta = 0;
  let maxDelta = -1;
  let mostChanged: ChannelId = 'speech';

  const channels: ChannelId[] = ['speech', 'footsteps', 'fan', 'city', 'music'];

  for (const ch of channels) {
    const a = mixA[ch] ?? 0;
    const b = mixB[ch] ?? 0;
    const diff = Math.abs(a - b);
    channelDeltas[ch] = Number(diff.toFixed(2));
    totalDelta += diff;

    if (diff > maxDelta) {
      maxDelta = diff;
      mostChanged = ch;
    }
  }

  return {
    channelDeltas,
    totalDelta: Number(totalDelta.toFixed(2)),
    mostChangedChannel: mostChanged
  };
}

/**
 * Validação de integridade dos 5 canais obrigatórios
 */
export function validateChannelsIntegrity(channels: SoundChannelState[]): boolean {
  if (channels.length !== 5) return false;
  const expected: ChannelId[] = ['speech', 'footsteps', 'fan', 'city', 'music'];
  for (const id of expected) {
    if (!channels.some(c => c.id === id)) return false;
  }
  return true;
}
