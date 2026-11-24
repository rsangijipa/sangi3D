/**
 * Som do ateliê, sintetizado com Web Audio (nenhum arquivo baixado, nada de microfone).
 * Só começa depois de um gesto, tem botão visível, volume, teto de ganho e compressor.
 * Timbres por material: toque de madeira, deslizar de gaveta, papel, clique da luminária e
 * um rumor de sala bem baixo. Nada surge de surpresa: sons apenas como resposta a ações.
 */

export type Material = 'wood' | 'stone' | 'soft' | 'ceramic' | 'metal';

const MAX_GAIN = 0.55;

export class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private room: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private _enabled = false;
  private volume = 0.6;
  private lastTick = 0;

  get enabled() {
    return this._enabled;
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 4;
    this.master.connect(comp).connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b = 0.96 * b + 0.04 * w;
      d[i] = w * 0.45 + b * 2;
    }
    this.noise = buf;
    return ctx;
  }

  /** Liga/desliga (sempre a partir de um gesto do usuário). */
  setEnabled(on: boolean) {
    this._enabled = on;
    if (on) {
      const ctx = this.ensure();
      void ctx.resume();
      this.master!.gain.setTargetAtTime(this.volume * MAX_GAIN, ctx.currentTime, 0.15);
      this.startRoom();
    } else if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    }
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.ctx && this.master && this._enabled) this.master.gain.setTargetAtTime(this.volume * MAX_GAIN, this.ctx.currentTime, 0.1);
  }

  /** Suspende tudo quando a aba fica oculta ou o jogo pausa. */
  suspend(on: boolean) {
    if (!this.ctx) return;
    if (on) void this.ctx.suspend();
    else if (this._enabled) void this.ctx.resume();
  }

  private startRoom() {
    if (this.room || !this.ctx) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 220;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.05, ctx.currentTime, 1.5);
    src.connect(lp).connect(gain).connect(this.master!);
    src.start();
    this.room = { src, gain };
  }

  private burst(o: { freq: number; q: number; dur: number; level: number; type?: BiquadFilterType; sweepTo?: number; delay?: number }) {
    if (!this._enabled) return;
    const ctx = this.ensure();
    const t = ctx.currentTime + 0.005 + (o.delay ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = o.type ?? 'bandpass';
    f.frequency.setValueAtTime(o.freq, t);
    if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.dur);
    f.Q.value = o.q;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(o.level, t + Math.min(0.01, o.dur * 0.2));
    e.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f).connect(e).connect(this.master!);
    src.start(t, Math.random() * 1.5);
    src.stop(t + o.dur + 0.02);
  }

  private tone(freq: number, dur: number, level: number, type: OscillatorType = 'sine', delay = 0) {
    if (!this._enabled) return;
    const ctx = this.ensure();
    const t = ctx.currentTime + 0.005 + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t);
    e.gain.exponentialRampToValueAtTime(level, t + 0.004);
    e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(e).connect(this.master!);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  /** Toque ao pousar/escolher, com timbre do material. */
  tap(m: Material = 'wood') {
    switch (m) {
      case 'stone':
        this.burst({ freq: 2400, q: 4, dur: 0.06, level: 0.35 });
        this.tone(1900, 0.05, 0.05, 'triangle');
        break;
      case 'ceramic':
        this.tone(2600, 0.35, 0.06);
        this.tone(4130, 0.22, 0.03);
        this.burst({ freq: 3200, q: 3, dur: 0.04, level: 0.2 });
        break;
      case 'soft':
        this.burst({ freq: 600, q: 0.8, dur: 0.12, level: 0.18, type: 'lowpass' });
        break;
      case 'metal':
        this.tone(1320, 0.18, 0.04, 'triangle');
        this.burst({ freq: 4200, q: 6, dur: 0.03, level: 0.15 });
        break;
      default:
        this.burst({ freq: 900, q: 3.5, dur: 0.09, level: 0.4 });
        this.tone(420, 0.07, 0.05, 'triangle');
    }
  }

  /** Deslizar de gaveta: atrito filtrado e um batente macio no fim. */
  drawer(open: boolean) {
    this.burst({ freq: open ? 380 : 520, q: 1.2, dur: 0.38, level: 0.16, sweepTo: open ? 620 : 300 });
    this.burst({ freq: 180, q: 2, dur: 0.12, level: 0.35, type: 'lowpass', delay: 0.36 });
  }

  /** Papel: folhear o atlas, cartão de preferência. */
  paper() {
    this.burst({ freq: 3800, q: 0.7, dur: 0.16, level: 0.1, type: 'highpass' });
    this.burst({ freq: 5200, q: 0.9, dur: 0.1, level: 0.07, type: 'highpass', delay: 0.07 });
  }

  /** Clique do interruptor da luminária. */
  click() {
    this.burst({ freq: 3000, q: 8, dur: 0.025, level: 0.3 });
    this.tone(2200, 0.03, 0.03, 'square');
  }

  /** Atrito discreto da articulação ao ajustar a luz (limitado a ~8 por segundo). */
  creak() {
    const now = performance.now();
    if (now - this.lastTick < 120) return;
    this.lastTick = now;
    this.burst({ freq: 1500 + Math.random() * 500, q: 9, dur: 0.035, level: 0.05 });
  }

  dispose() {
    try {
      this.room?.src.stop();
    } catch {
      /* já parado */
    }
    this.room = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}

export const SAMPLE_MATERIAL: Record<string, Material> = {
  cork: 'soft',
  wool: 'soft',
  slate: 'stone',
  linen: 'soft',
  leaf: 'soft',
  smooth_wood: 'wood',
  ceramic: 'ceramic',
  sandstone: 'stone',
};
