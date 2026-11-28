export type MaterialSoundType =
  | 'paint'
  | 'clay'
  | 'sand'
  | 'ribbon'
  | 'xylophone'
  | 'chime'
  | 'drum'
  | 'djembe'
  | 'wood_tap';

export class AtelierAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = false;
  private volume = 0.7;
  private lastFrictionTime = 0;

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
      this.noiseBuffer = this.createNoiseBuffer(this.ctx);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.03);
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.03);
    }
  }

  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const length = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
    }
    return buffer;
  }

  public playFriction(type: 'paint' | 'clay' | 'sand' | 'ribbon', speed = 0.5): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = this.ctx.currentTime;
    if (now - this.lastFrictionTime < 0.055) return;
    this.lastFrictionTime = now;

    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    const clampedSpeed = Math.max(0.15, Math.min(1.5, speed));
    let dur = 0.09;

    if (type === 'paint') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650 + clampedSpeed * 420, now);
      filter.Q.value = 1.4;
      gain.gain.setValueAtTime(0.05 * clampedSpeed, now);
      dur = 0.08;
    } else if (type === 'clay') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280 + clampedSpeed * 180, now);
      filter.Q.value = 3.2;
      gain.gain.setValueAtTime(0.09 * clampedSpeed, now);
      dur = 0.11;
    } else if (type === 'sand') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1900 + clampedSpeed * 1200, now);
      filter.Q.value = 0.9;
      gain.gain.setValueAtTime(0.06 * clampedSpeed, now);
      dur = 0.09;
    } else {
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(900 + clampedSpeed * 500, now);
      gain.gain.setValueAtTime(0.035 * clampedSpeed, now);
      dur = 0.14;
    }

    gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now, Math.random() * 0.6, dur + 0.02);
  }

  public playInstrument(
    type: 'xylophone' | 'chime' | 'drum' | 'djembe' | 'wood_tap',
    noteIndex = 0,
    velocity = 0.85
  ): void {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const vel = Math.max(0.2, Math.min(1, velocity));

    if (type === 'xylophone') {
      const pentatonic = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
      const freq = pentatonic[noteIndex % pentatonic.length];
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 3.0, now);

      const overGain = this.ctx.createGain();
      overGain.gain.setValueAtTime(0.18 * vel, now);
      overGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      gain.gain.setValueAtTime(0.32 * vel, now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.55);

      osc.connect(gain);
      overtone.connect(overGain);
      overGain.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.58);
      overtone.stop(now + 0.14);
    } else if (type === 'chime') {
      const freqs = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
      const base = freqs[noteIndex % freqs.length];
      const ratios = [1, 2.76, 5.4];
      ratios.forEach((ratio, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base * ratio, now);
        g.gain.setValueAtTime((0.22 / (idx + 1)) * vel, now);
        g.gain.exponentialRampToValueAtTime(0.0005, now + (1.7 - idx * 0.4));
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.8);
      });
    } else if (type === 'drum' || type === 'djembe') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startFreq = type === 'drum' ? 145 : 210 + (noteIndex % 3) * 45;
      const endFreq = type === 'drum' ? 52 : 76;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14);

      gain.gain.setValueAtTime(0.45 * vel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } else {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
      gain.gain.setValueAtTime(0.16 * vel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  }

  private ambience: { nodes: AudioNode[]; gain: GainNode } | null = null;

  /** Ambiente do ateliê: vento suave filtrado + pad quente em quinta, muito baixo. */
  public startAmbience(): void {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer || this.ambience) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.16, ctx.currentTime, 2.5);
    gain.connect(this.masterGain);

    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer;
    wind.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.35;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(lp.frequency);
    wind.connect(lp).connect(windGain).connect(gain);

    const nodes: AudioNode[] = [wind, lfo];
    [110, 164.81, 220.0, 277.18].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = 0.05 / (i + 1);
      o.connect(g).connect(gain);
      o.start();
      nodes.push(o);
    });
    wind.start();
    lfo.start();
    this.ambience = { nodes, gain };
  }

  public setAmbience(on: boolean): void {
    if (on) {
      if (!this.ambience) this.startAmbience();
      else if (this.ctx) this.ambience.gain.gain.setTargetAtTime(0.16, this.ctx.currentTime, 0.6);
    } else if (this.ambience && this.ctx) {
      this.ambience.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    }
  }

  /** Arpejo curto de celebração para selos conquistados. */
  public playReward(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      const t0 = now + i * 0.09;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      o.connect(g).connect(this.masterGain!);
      o.start(t0);
      o.stop(t0 + 1.0);
    });
  }

  public dispose(): void {
    this.ambience?.nodes.forEach((n) => {
      try { (n as OscillatorNode).stop(); } catch { /* já parado */ }
    });
    this.ambience = null;
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
