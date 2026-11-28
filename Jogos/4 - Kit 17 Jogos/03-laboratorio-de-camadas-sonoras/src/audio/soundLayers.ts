/**
 * Laboratório de Camadas Sonoras — Motor de Síntese de 5 Stems de Áudio
 * Arquitetura Web Audio API pura sem arquivos externos:
 * AudioContext → 5 fontes isoladas → GainNodes dedicados → Master Gain → DynamicsCompressor → Destination
 */

import { ChannelId } from '../game/state';

export class SoundLayersEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private channelGains: Map<ChannelId, GainNode> = new Map();
  private isMuted: boolean = false;

  // Geradores e timers de síntese
  private musicIntervalId: number = 0;
  private footstepIntervalId: number = 0;
  private cityIntervalId: number = 0;
  private speechIntervalId: number = 0;

  constructor() {
    // Inicialização sob demanda após primeiro clique para cumprir o requisito de começar sempre silencioso
  }

  public init(): void {
    if (this.ctx && this.ctx.state !== 'closed') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Compressor de saída para headroom seguro
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Criar os 5 canais com GainNodes independentes
      const channelIds: ChannelId[] = ['speech', 'footsteps', 'fan', 'city', 'music'];
      channelIds.forEach(id => {
        if (!this.ctx || !this.compressor) return;
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);
        gainNode.connect(this.compressor);
        this.channelGains.set(id, gainNode);
      });

      // Inicializar geradores contínuos dos 5 stems
      this.startFanStem();
      this.startFootstepsStem();
      this.startMusicStem();
      this.startCityStem();
      this.startSpeechStem();
    } catch (e) {
      console.warn('Web Audio API não disponível:', e);
    }
  }

  public ensureRunning(): void {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * 1. Canal Fala / Vozes (speech): Formantes vocálicos e modulação rítmica sem palavras discerníveis
   */
  private startSpeechStem(): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get('speech');
    if (!gainNode) return;

    // Gerador de ruído filtrado em formantes de vogais
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filtros formantes F1 e F2
    const filterF1 = this.ctx.createBiquadFilter();
    filterF1.type = 'bandpass';
    filterF1.frequency.setValueAtTime(550, this.ctx.currentTime);
    filterF1.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const filterF2 = this.ctx.createBiquadFilter();
    filterF2.type = 'bandpass';
    filterF2.frequency.setValueAtTime(1450, this.ctx.currentTime);
    filterF2.Q.setValueAtTime(3.5, this.ctx.currentTime);

    const speechGain = this.ctx.createGain();
    speechGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noiseSource.connect(filterF1);
    noiseSource.connect(filterF2);
    filterF1.connect(speechGain);
    filterF2.connect(speechGain);
    speechGain.connect(gainNode);
    noiseSource.start();

    // Modulação de ritmo de conversa a cada 280-450ms
    this.speechIntervalId = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      // Variação de formante simulando vogais alternadas
      const targetF1 = 400 + Math.random() * 350;
      filterF1.frequency.linearRampToValueAtTime(targetF1, now + 0.2);
      // Envelope de sílaba
      speechGain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.22, now + 0.15);
    }, 320);
  }

  /**
   * 2. Canal Passos / Tênis (footsteps): Impactos cadenciados de tênis macio no chão
   */
  private startFootstepsStem(): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get('footsteps');
    if (!gainNode) return;

    // Passos a 1.6 Hz (a cada ~620ms)
    this.footstepIntervalId = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;

      // 1. Batida grave da sola de borracha no piso de madeira
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110 + (Math.random() * 15), now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);

      oscGain.gain.setValueAtTime(0.42, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.12);

      // 2. Fricção de sola (tênis esportivo)
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const bData = buffer.getChannelData(0);
      for (let i = 0; i < bData.length; i++) {
        bData[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(600, now);

      const fGain = this.ctx.createGain();
      fGain.gain.setValueAtTime(0.18, now);
      fGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(filter);
      filter.connect(fGain);
      fGain.connect(gainNode);
      noise.start(now);
    }, 620);
  }

  /**
   * 3. Canal Ventilador (fan): Zumbido contínuo de motor 120Hz + sopro aerodinâmico
   */
  private startFanStem(): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get('fan');
    if (!gainNode) return;

    // Tom do motor elétrico (120 Hz)
    const motorOsc = this.ctx.createOscillator();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(118, this.ctx.currentTime);

    const motorFilter = this.ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.setValueAtTime(260, this.ctx.currentTime);

    const motorGain = this.ctx.createGain();
    motorGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    motorOsc.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(gainNode);
    motorOsc.start();

    // Sopro de ar (ruído com modulação de rotação das 4 pás)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const airSource = this.ctx.createBufferSource();
    airSource.buffer = noiseBuffer;
    airSource.loop = true;

    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.setValueAtTime(420, this.ctx.currentTime);
    airFilter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const airGain = this.ctx.createGain();
    airGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    // LFO de modulação das pás (~16 Hz)
    const bladeLFO = this.ctx.createOscillator();
    bladeLFO.frequency.setValueAtTime(16, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    bladeLFO.connect(lfoGain);
    lfoGain.connect(airGain.gain);

    airSource.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(gainNode);
    airSource.start();
    bladeLFO.start();
  }

  /**
   * 4. Canal Cidade (city): Paisagem urbana difusa com graves distantes e buzina suave
   */
  private startCityStem(): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get('city');
    if (!gainNode) return;

    // Ruído browniano grave de trânsito distante
    const bufferSize = this.ctx.sampleRate * 3;
    const brownBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = brownBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8;
    }

    const cityNoise = this.ctx.createBufferSource();
    cityNoise.buffer = brownBuffer;
    cityNoise.loop = true;

    const lowFilter = this.ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    const cityGain = this.ctx.createGain();
    cityGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

    cityNoise.connect(lowFilter);
    lowFilter.connect(cityGain);
    cityGain.connect(gainNode);
    cityNoise.start();

    // Buzina ou eco esporádico da cidade a cada 10-18 segundos
    this.cityIntervalId = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const hornOsc = this.ctx.createOscillator();
      const hornGain = this.ctx.createGain();
      hornOsc.type = 'sine';
      hornOsc.frequency.setValueAtTime(329.63, now); // Mi4 suave distante

      hornGain.gain.setValueAtTime(0.001, now);
      hornGain.gain.linearRampToValueAtTime(0.04, now + 0.2);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      hornOsc.connect(hornGain);
      hornGain.connect(gainNode);
      hornOsc.start(now);
      hornOsc.stop(now + 1.0);
    }, 12000);
  }

  /**
   * 5. Canal Melodia Suave (music): Acordes de Rhodes e vibrafone relaxante (C - Em - F - G)
   */
  private startMusicStem(): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get('music');
    if (!gainNode) return;

    // Progressão harmônica relaxante (frequências em Hz)
    const chordProgression: number[][] = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [329.63, 392.00, 493.88, 587.33], // Em7 (E4, G4, B4, D5)
      [349.23, 440.00, 523.25, 659.25], // Fmaj7 (F4, A4, C5, E5)
      [392.00, 493.88, 587.33, 698.46]  // G7 (G4, B4, D5, F5)
    ];

    let chordIndex = 0;
    let noteInChord = 0;

    this.musicIntervalId = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const currentChord = chordProgression[chordIndex];
      const freq = currentChord[noteInChord];

      // Oscilador de tecla de Rhodes (senóide harmônica suave)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Ataque suave e caimento aveludado
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.95);

      noteInChord = (noteInChord + 1) % currentChord.length;
      if (noteInChord === 0) {
        chordIndex = (chordIndex + 1) % chordProgression.length;
      }
    }, 750);
  }

  /**
   * Atualiza o ganho efetivo de um canal com rampa anti-clique
   */
  public setChannelGain(id: ChannelId, targetGain: number, rampTimeSec: number = 0.05): void {
    if (!this.ctx) return;
    const gainNode = this.channelGains.get(id);
    if (!gainNode) return;

    const now = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1.0, targetGain));
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(clamped, now + rampTimeSec);
  }

  /**
   * Atualiza todos os canais de uma vez
   */
  public syncGains(gains: Record<ChannelId, number>, rampTimeSec: number = 0.06): void {
    if (!this.ctx) return;
    (Object.keys(gains) as ChannelId[]).forEach(id => {
      this.setChannelGain(id, gains[id], rampTimeSec);
    });
  }

  /**
   * Silenciar tudo com fade curto (50ms)
   */
  public setMasterMute(mute: boolean): void {
    this.isMuted = mute;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const target = mute ? 0.0 : 0.75;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + 0.05);
  }

  public playClick(): void {
    this.ensureRunning();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public dispose(): void {
    clearInterval(this.musicIntervalId);
    clearInterval(this.footstepIntervalId);
    clearInterval(this.cityIntervalId);
    clearInterval(this.speechIntervalId);
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.channelGains.clear();
  }
}
