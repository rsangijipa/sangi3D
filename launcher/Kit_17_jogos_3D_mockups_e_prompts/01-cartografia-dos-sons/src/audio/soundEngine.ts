// src/audio/soundEngine.ts
// Motor de áudio espacial autossuficiente via Web Audio API e síntese determinística
import { calculateDistanceGain, calculateStereoPan, Vec3 } from '../game/rules';

export interface SourceAudioChannel {
  id: string;
  gainNode: GainNode;
  pannerNode: PannerNode | null;
  stereoPannerNode: StereoPannerNode | null;
  analyserNode: AnalyserNode;
  activeNodes: AudioNode[];
  synthTimerId: number | null;
  fadeTimeoutId: number | null;
  targetGain: number;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private channels = new Map<string, SourceAudioChannel>();
  private isUnlocked = false;
  private isMuted = false;
  private listenerPos: Vec3 = [0, 0, 0];
  private ambientNodes: AudioNode[] = [];
  private hasPannerSupport = false;

  constructor() {
    // Inicialização sob demanda com gesto do usuário
  }

  public async unlock(): Promise<boolean> {
    if (this.ctx && this.ctx.state === 'running') {
      this.isUnlocked = true;
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.setupMasterNodes();
      this.isUnlocked = true;
      this.startAmbient();
      return true;
    } catch (e) {
      console.warn('Web Audio Context unlock error:', e);
      return false;
    }
  }

  private setupMasterNodes() {
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Testar suporte a PannerNode com modelo HRTF
    try {
      const testPanner = this.ctx.createPanner();
      testPanner.panningModel = 'HRTF';
      testPanner.distanceModel = 'inverse';
      this.hasPannerSupport = true;
    } catch {
      this.hasPannerSupport = false;
    }

    // Canal de ambiência suave da cidade
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);
  }

  public initSource(sourceId: string, initialPos: Vec3) {
    if (!this.ctx || !this.masterGain || this.channels.has(sourceId)) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    const analyserNode = this.ctx.createAnalyser();
    analyserNode.fftSize = 64;

    let pannerNode: PannerNode | null = null;
    let stereoPannerNode: StereoPannerNode | null = null;

    if (this.hasPannerSupport) {
      try {
        pannerNode = this.ctx.createPanner();
        pannerNode.panningModel = 'HRTF';
        pannerNode.distanceModel = 'inverse';
        pannerNode.refDistance = 1.5;
        pannerNode.maxDistance = 20;
        pannerNode.rolloffFactor = 1.2;
        pannerNode.positionX.setValueAtTime(initialPos[0], this.ctx.currentTime);
        pannerNode.positionY.setValueAtTime(initialPos[1], this.ctx.currentTime);
        pannerNode.positionZ.setValueAtTime(initialPos[2], this.ctx.currentTime);

        gainNode.connect(pannerNode);
        pannerNode.connect(analyserNode);
        analyserNode.connect(this.masterGain);
      } catch {
        pannerNode = null;
      }
    }

    if (!pannerNode) {
      if (this.ctx.createStereoPanner) {
        stereoPannerNode = this.ctx.createStereoPanner();
        stereoPannerNode.pan.setValueAtTime(calculateStereoPan(initialPos, this.listenerPos), this.ctx.currentTime);
        gainNode.connect(stereoPannerNode);
        stereoPannerNode.connect(analyserNode);
        analyserNode.connect(this.masterGain);
      } else {
        gainNode.connect(analyserNode);
        analyserNode.connect(this.masterGain);
      }
    }

    this.channels.set(sourceId, {
      id: sourceId,
      gainNode,
      pannerNode,
      stereoPannerNode,
      analyserNode,
      activeNodes: [],
      synthTimerId: null,
      fadeTimeoutId: null,
      targetGain: 0.8
    });
  }

  public updateListenerPosition(pos: Vec3) {
    this.listenerPos = [...pos];
    if (!this.ctx) return;

    if (this.ctx.listener) {
      const t = this.ctx.currentTime;
      if (this.ctx.listener.positionX) {
        this.ctx.listener.positionX.setTargetAtTime(pos[0], t, 0.05);
        this.ctx.listener.positionY.setTargetAtTime(pos[1] + 0.5, t, 0.05);
        this.ctx.listener.positionZ.setTargetAtTime(pos[2], t, 0.05);
      } else {
        this.ctx.listener.setPosition(pos[0], pos[1] + 0.5, pos[2]);
      }
    }

    // Atualiza ganho e pan de todas as fontes ativas em relação ao novo ponto de escuta
    for (const ch of this.channels.values()) {
      if (ch.activeNodes.length > 0) {
        const distGain = calculateDistanceGain(pos, this.listenerPos, ch.targetGain);
        ch.gainNode.gain.setTargetAtTime(distGain, this.ctx.currentTime, 0.1);
      }
    }
  }

  public updateSourcePosition(sourceId: string, pos: Vec3) {
    const ch = this.channels.get(sourceId);
    if (!ch || !this.ctx) return;

    const t = this.ctx.currentTime;
    if (ch.pannerNode) {
      ch.pannerNode.positionX.setTargetAtTime(pos[0], t, 0.05);
      ch.pannerNode.positionY.setTargetAtTime(pos[1], t, 0.05);
      ch.pannerNode.positionZ.setTargetAtTime(pos[2], t, 0.05);
    } else if (ch.stereoPannerNode) {
      const pan = calculateStereoPan(pos, this.listenerPos);
      ch.stereoPannerNode.pan.setTargetAtTime(pan, t, 0.05);
    }

    // Atualiza ganho proporcional à distância com crossfade suave (150-300ms)
    if (ch.activeNodes.length > 0) {
      const distGain = calculateDistanceGain(pos, this.listenerPos, ch.targetGain);
      ch.gainNode.gain.setTargetAtTime(distGain, t, 0.15);
    }
  }

  public setSourcePlaying(sourceId: string, isPlaying: boolean, pos: Vec3, baseGain = 0.8) {
    if (!this.isUnlocked || !this.ctx) return;

    if (!this.channels.has(sourceId)) {
      this.initSource(sourceId, pos);
    }

    const ch = this.channels.get(sourceId);
    if (!ch) return;

    ch.targetGain = baseGain;
    const t = this.ctx.currentTime;

    // Se havia um temporizador de fade-out pendente, cancela imediatamente
    if (ch.fadeTimeoutId !== null) {
      window.clearTimeout(ch.fadeTimeoutId);
      ch.fadeTimeoutId = null;
    }

    if (isPlaying) {
      // Inicia síntese se ainda não estiver ativa
      if (ch.activeNodes.length === 0) {
        this.startSourceSynth(sourceId, ch);
      }

      const distGain = calculateDistanceGain(pos, this.listenerPos, baseGain);
      // Fade in suave de 200 ms (especificação 150-300 ms)
      ch.gainNode.gain.cancelScheduledValues(t);
      ch.gainNode.gain.setValueAtTime(Math.max(0.0001, ch.gainNode.gain.value), t);
      ch.gainNode.gain.linearRampToValueAtTime(distGain, t + 0.2);
    } else {
      // Fade out suave de 200 ms
      ch.gainNode.gain.cancelScheduledValues(t);
      ch.gainNode.gain.setValueAtTime(Math.max(0.0001, ch.gainNode.gain.value), t);
      ch.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.2);

      // Desliga os nós após a conclusão do fade out sem corrida de concorrência
      ch.fadeTimeoutId = window.setTimeout(() => {
        ch.fadeTimeoutId = null;
        this.stopSourceSynth(ch);
      }, 220);
    }
  }

  private startSourceSynth(sourceId: string, ch: SourceAudioChannel) {
    if (!this.ctx) return;

    switch (sourceId) {
      case 'bus':
        this.startBusSynth(ch);
        break;
      case 'fountain':
        this.startFountainSynth(ch);
        break;
      case 'birds':
        this.startBirdsSynth(ch);
        break;
      case 'bell':
        this.startBellSynth(ch);
        break;
      case 'footsteps':
        this.startFootstepsSynth(ch);
        break;
    }
  }

  private stopSourceSynth(ch: SourceAudioChannel) {
    if (ch.synthTimerId !== null) {
      window.clearInterval(ch.synthTimerId);
      ch.synthTimerId = null;
    }
    for (const node of ch.activeNodes) {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // noop
      }
    }
    ch.activeNodes = [];
  }

  // --- SÍNTESE DO ÔNIBUS (Motor grave constante, suave e sem aspereza) ---
  private startBusSynth(ch: SourceAudioChannel) {
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(130, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(8, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(190, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const busGain = this.ctx.createGain();
    busGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(busGain);
    busGain.connect(ch.gainNode);

    osc1.start();
    osc2.start();
    lfo.start();

    ch.activeNodes.push(osc1, osc2, lfo, lfoGain, filter, busGain);
  }

  // --- SÍNTESE DA FONTE (Ruído orgânico filtrado com borbulhar dinâmico) ---
  private startFountainSynth(ch: SourceAudioChannel) {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.1) * 0.3;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bpFilter = this.ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(950, this.ctx.currentTime);
    bpFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.4, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bpFilter.frequency);

    const waterGain = this.ctx.createGain();
    waterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noiseSource.connect(bpFilter);
    bpFilter.connect(waterGain);
    waterGain.connect(ch.gainNode);

    noiseSource.start();
    lfo.start();

    ch.activeNodes.push(noiseSource, bpFilter, lfo, lfoGain, waterGain);
  }

  // --- SÍNTESE DE PÁSSAROS (Chilreios melódicos suaves e espaçados) ---
  private startBirdsSynth(ch: SourceAudioChannel) {
    if (!this.ctx) return;

    const playChirp = () => {
      if (!this.ctx || ch.gainNode.gain.value <= 0.001) return;

      const t = this.ctx.currentTime;
      const count = Math.floor(Math.random() * 3) + 2;
      const baseFreq = 2200 + Math.random() * 600;

      for (let i = 0; i < count; i++) {
        const chirpStart = t + i * 0.09;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        const startFreq = baseFreq + (i % 2 === 0 ? 300 : -200);
        osc.frequency.setValueAtTime(startFreq, chirpStart);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 600, chirpStart + 0.04);
        osc.frequency.exponentialRampToValueAtTime(startFreq - 300, chirpStart + 0.07);

        g.gain.setValueAtTime(0.0001, chirpStart);
        g.gain.linearRampToValueAtTime(0.22, chirpStart + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.075);

        osc.connect(g);
        g.connect(ch.gainNode);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.08);
      }
    };

    playChirp();
    ch.synthTimerId = window.setInterval(playChirp, 3200);
  }

  // --- SÍNTESE DO SINO DA ESCOLA (Harmônicos metálicos e decaimento quente) ---
  private startBellSynth(ch: SourceAudioChannel) {
    if (!this.ctx) return;

    const ringBell = () => {
      if (!this.ctx || ch.gainNode.gain.value <= 0.001) return;

      const t = this.ctx.currentTime;
      const partials = [
        { ratio: 1.0, gain: 0.35, decay: 2.2 },
        { ratio: 1.2, gain: 0.22, decay: 1.8 },
        { ratio: 1.5, gain: 0.18, decay: 1.4 },
        { ratio: 2.0, gain: 0.12, decay: 1.0 },
        { ratio: 2.7, gain: 0.08, decay: 0.7 }
      ];

      const fundamental = 440;

      for (const p of partials) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.ratio, t);

        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(p.gain, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

        osc.connect(g);
        g.connect(ch.gainNode);

        osc.start(t);
        osc.stop(t + p.decay + 0.05);
      }
    };

    ringBell();
    ch.synthTimerId = window.setInterval(ringBell, 4500);
  }

  // --- SÍNTESE DE PASSOS (Impactos rítmicos secos sobre pavimento) ---
  private startFootstepsSynth(ch: SourceAudioChannel) {
    if (!this.ctx) return;

    let stepFoot = 0;
    const takeStep = () => {
      if (!this.ctx || ch.gainNode.gain.value <= 0.001) return;

      const t = this.ctx.currentTime;
      stepFoot = 1 - stepFoot;

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650 + stepFoot * 80, t);
      filter.Q.setValueAtTime(2.0, t);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.28, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      noise.connect(filter);
      filter.connect(g);
      g.connect(ch.gainNode);

      noise.start(t);
      noise.stop(t + 0.05);
    };

    takeStep();
    ch.synthTimerId = window.setInterval(takeStep, 680);
  }

  // --- AMBIENTE DA CIDADE (Brisa suave) ---
  private startAmbient() {
    if (!this.ctx || !this.ambientGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);
    noiseSource.start();

    this.ambientNodes.push(noiseSource, filter);
  }

  public setGlobalMute(isMuted: boolean) {
    this.isMuted = isMuted;
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(isMuted ? 0.0001 : 0.85, t + 0.08);
  }

  public setMasterVolume(volume: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), t, 0.05);
  }

  public getEnergy(sourceId: string): number {
    const ch = this.channels.get(sourceId);
    if (!ch) return 0;

    const data = new Uint8Array(ch.analyserNode.frequencyBinCount);
    ch.analyserNode.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / (data.length * 255);
  }

  public dispose() {
    for (const ch of this.channels.values()) {
      if (ch.fadeTimeoutId !== null) clearTimeout(ch.fadeTimeoutId);
      this.stopSourceSynth(ch);
    }
    this.channels.clear();

    for (const node of this.ambientNodes) {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // noop
      }
    }
    this.ambientNodes = [];

    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
