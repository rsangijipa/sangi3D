/**
 * Meteorologia das Emocoes — audio com Web Audio API (sintetizado localmente).
 * Nenhum arquivo externo. Reproducao so apos gesto do usuario.
 * Chuva e vento so ativam manualmente, com mute independente.
 */

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private rainNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;

  private rainPlaying = false;
  private windPlaying = false;
  private masterMuted = false;

  // Limite de ganho para nao surpreender o usuario
  private readonly MAX_GAIN = 0.35;

  initialized = false;

  init(): boolean {
    if (this.initialized) return true;
    const w = window as unknown as {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const ACtor = w.AudioContext ?? w.webkitAudioContext;
    if (!ACtor) return false;
    this.ctx = new ACtor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.MAX_GAIN;
    this.masterGain.connect(this.ctx.destination);
    this.initialized = true;
    return true;
  }

  ensureStarted(): boolean {
    if (!this.init()) return false;
    const ctx = this.ctx;
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      return false;
    }
    return true;
  }

  private getCtx(): AudioContext {
    const ctx = this.ctx;
    if (!ctx) throw new Error('AudioContext nao inicializado');
    return ctx;
  }

  setMasterMuted(muted: boolean): void {
    this.masterMuted = muted;
    const gain = this.masterGain;
    if (!gain) return;
    gain.gain.setTargetAtTime(muted ? 0 : this.MAX_GAIN, this.getCtx().currentTime, 0.05);
  }

  isMasterMuted(): boolean {
    return this.masterMuted;
  }

  private filteredNoise(kind: 'rain' | 'wind'): AudioBuffer {
    const ctx = this.getCtx();
    const buffer = ctx.createBuffer(1, 4 * 44100, 44100);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      // filtro passa-baixa simples para suavizar (vento mais abafado que chuva)
      const cutoff = kind === 'wind' ? 0.015 : 0.04;
      b0 += cutoff * (white - b0);
      b1 += cutoff * (b0 - b1);
      b2 += cutoff * (b1 - b2);
      b3 += cutoff * (b2 - b3);
      data[i] = b3 * (kind === 'wind' ? 0.6 : 1.0);
    }
    return buffer;
  }

  private loopBuffer(kind: 'rain' | 'wind'): { node: AudioBufferSourceNode; gain: GainNode } {
    const ctx = this.getCtx();
    const buffer = this.filteredNoise(kind);
    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.0;
    node.connect(gain).connect(ctx.destination);
    node.start(ctx.currentTime);
    return { node, gain };
  }

  setRain(on: boolean): void {
    if (!this.ensureStarted()) return;
    if (this.masterMuted) return;
    if (on && !this.rainPlaying) {
      const src = this.loopBuffer('rain');
      this.rainNode = src.node;
      this.rainGain = src.gain;
      this.rainGain!.gain.setTargetAtTime(0.18, this.getCtx().currentTime, 0.3);
      this.rainPlaying = true;
    } else if (!on && this.rainNode) {
      this.rainGain!.gain.setTargetAtTime(0, this.getCtx().currentTime, 0.5);
      const node = this.rainNode;
      setTimeout(() => {
        node.stop();
        this.rainNode = null;
        this.rainGain = null;
        this.rainPlaying = false;
      }, 600);
    }
  }

  setWind(on: boolean): void {
    if (!this.ensureStarted()) return;
    if (this.masterMuted) return;
    if (on && !this.windPlaying) {
      const src = this.loopBuffer('wind');
      this.windNode = src.node;
      this.windGain = src.gain;
      this.windGain!.gain.setTargetAtTime(0.12, this.getCtx().currentTime, 0.4);
      this.windPlaying = true;
    } else if (!on && this.windNode) {
      this.windGain!.gain.setTargetAtTime(0, this.getCtx().currentTime, 0.5);
      const node = this.windNode;
      setTimeout(() => {
        node.stop();
        this.windNode = null;
        this.windGain = null;
        this.windPlaying = false;
      }, 600);
    }
  }

  playUiClick(type: 'click' | 'tick' | 'confirm' = 'click'): void {
    if (!this.ensureStarted() || this.masterMuted) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    if (type === 'click') {
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.06);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    } else if (type === 'tick') {
      osc.frequency.setValueAtTime(600, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    } else {
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(660, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.2);
    }
    const master = this.masterGain;
    if (!master) return;
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  dispose(): void {
    this.rainNode?.stop();
    this.windNode?.stop();
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
    this.rainNode = null;
    this.windNode = null;
    this.rainGain = null;
    this.windGain = null;
    this.rainPlaying = false;
    this.windPlaying = false;
    this.initialized = false;
  }
}

export const audioManager = new AudioManager();
