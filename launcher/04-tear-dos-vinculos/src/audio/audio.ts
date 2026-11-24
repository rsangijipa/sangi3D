// Áudio sintetizado localmente (Web Audio), original deste projeto. Começa em silêncio e só
// inicia após gesto explícito de som. Mixer com master, compressor, limitador e polifonia limitada.

export type Sfx = 'clack' | 'cross' | 'snip' | 'knot' | 'tuck' | 'select' | 'creak' | 'error' | 'ok';

const MAX_VOICES = 8;
/** teto digital conservador do master (não é garantia de segurança auditiva) */
const MASTER_CEIL = 0.42;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private ambBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private voices = 0;
  private ambienceOn = false;
  private birdTimer = 0;
  enabled = false;
  volume = 0.6;

  /** Deve ser chamado dentro de um gesto do usuário. */
  async enable(): Promise<boolean> {
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx({ latencyHint: 'interactive' });
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -3; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.08;
        const master = ctx.createGain();
        master.gain.value = 0;
        const sfx = ctx.createGain(); sfx.gain.value = 0.9;
        const amb = ctx.createGain(); amb.gain.value = 0;
        sfx.connect(comp); amb.connect(comp); comp.connect(limiter); limiter.connect(master); master.connect(ctx.destination);
        const len = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
        }
        this.ctx = ctx; this.master = master; this.sfxBus = sfx; this.ambBus = amb; this.noise = buf;
      }
      await this.ctx.resume();
      this.enabled = true;
      this.fadeMaster(this.volume * MASTER_CEIL, 0.4);
      return true;
    } catch {
      this.enabled = false;
      return false;
    }
  }

  disable(): void {
    this.enabled = false;
    this.fadeMaster(0, 0.25);
    this.setAmbience(false);
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.enabled) this.fadeMaster(this.volume * MASTER_CEIL, 0.15);
  }

  private fadeMaster(to: number, time: number): void {
    if (!this.ctx || !this.master) return;
    const g = this.master.gain;
    const now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(to, now + time);
  }

  suspend(): void { void this.ctx?.suspend(); }
  resume(): void { if (this.enabled) void this.ctx?.resume(); }

  setAmbience(on: boolean): void {
    if (!this.ctx || !this.ambBus || !this.noise) return;
    const now = this.ctx.currentTime;
    if (on && !this.ambienceOn) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.noise; src.loop = true;
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
      const g = this.ctx.createGain(); g.gain.value = 0.18;
      src.connect(lp); lp.connect(g); g.connect(this.ambBus);
      src.start();
      (this as unknown as { ambSrc: AudioBufferSourceNode }).ambSrc = src;
    }
    this.ambienceOn = on;
    this.ambBus.gain.cancelScheduledValues(now);
    this.ambBus.gain.setValueAtTime(this.ambBus.gain.value, now);
    this.ambBus.gain.linearRampToValueAtTime(on ? 0.35 : 0, now + 1.2);
  }

  /** Pássaros distantes ocasionais (somente com ambiente ligado). */
  tick(dt: number): void {
    if (!this.enabled || !this.ambienceOn || !this.ctx) return;
    this.birdTimer -= dt;
    if (this.birdTimer > 0) return;
    this.birdTimer = 4 + Math.random() * 9;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) this.chirp(this.ctx.currentTime + i * 0.13, 2600 + Math.random() * 1200);
  }

  private chirp(at: number, f: number): void {
    if (!this.ctx || !this.ambBus) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, at);
    o.frequency.exponentialRampToValueAtTime(f * 1.35, at + 0.07);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(0.03, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);
    o.connect(g); g.connect(this.ambBus);
    o.start(at); o.stop(at + 0.1);
  }

  play(kind: Sfx, intensity = 1): void {
    if (!this.enabled || !this.ctx || !this.sfxBus || this.voices >= MAX_VOICES) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.005;
    const out = ctx.createGain();
    out.gain.value = Math.max(0.05, Math.min(1, intensity));
    out.connect(this.sfxBus);
    this.voices++;
    let end = t + 0.3;
    const noise = (start: number, dur: number, type: BiquadFilterType, freq: number, q: number, gain: number) => {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      src.playbackRate.value = 0.8 + Math.random() * 0.4;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gain, start + Math.min(0.006, dur * 0.2));
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      src.connect(f); f.connect(g); g.connect(out);
      src.start(start, Math.random() * 1.5); src.stop(start + dur + 0.02);
      end = Math.max(end, start + dur + 0.05);
    };
    const tone = (start: number, dur: number, freq: number, type: OscillatorType, gain: number, slide = 1) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(freq, start);
      if (slide !== 1) o.frequency.exponentialRampToValueAtTime(freq * slide, start + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gain, start + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g); g.connect(out);
      o.start(start); o.stop(start + dur + 0.02);
      end = Math.max(end, start + dur + 0.05);
    };
    switch (kind) {
      case 'clack': // madeira do pente batendo a trama
        tone(t, 0.12, 170, 'sine', 0.5, 0.6);
        noise(t, 0.05, 'bandpass', 1100, 1.4, 0.55);
        noise(t + 0.004, 0.09, 'bandpass', 2400, 3, 0.18);
        break;
      case 'cross': // fio deslizando pela urdidura
        noise(t, 0.08, 'bandpass', 3200 + Math.random() * 600, 0.9, 0.16);
        tone(t, 0.03, 900 + Math.random() * 200, 'triangle', 0.04);
        break;
      case 'snip':
        noise(t, 0.035, 'highpass', 4200, 0.7, 0.4);
        tone(t, 0.06, 3100, 'triangle', 0.05, 0.8);
        break;
      case 'knot':
        noise(t, 0.18, 'bandpass', 1500, 6, 0.22);
        tone(t + 0.02, 0.14, 420, 'triangle', 0.06, 1.5);
        break;
      case 'tuck':
        noise(t, 0.2, 'bandpass', 2600, 2, 0.14);
        break;
      case 'select':
        tone(t, 0.09, 520, 'sine', 0.12, 1.02);
        noise(t, 0.03, 'bandpass', 1800, 2, 0.08);
        break;
      case 'creak':
        tone(t, 0.16, 90 + intensity * 60, 'sawtooth', 0.025, 1.05);
        noise(t, 0.12, 'bandpass', 700, 5, 0.08);
        break;
      case 'ok':
        tone(t, 0.25, 660, 'sine', 0.08);
        tone(t + 0.08, 0.3, 880, 'sine', 0.06);
        break;
      case 'error':
        tone(t, 0.14, 240, 'sine', 0.08, 0.85);
        break;
    }
    window.setTimeout(() => { this.voices = Math.max(0, this.voices - 1); out.disconnect(); }, (end - ctx.currentTime) * 1000 + 50);
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
  }
}
