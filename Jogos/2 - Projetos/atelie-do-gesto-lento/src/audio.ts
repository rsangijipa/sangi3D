// Paisagem sonora procedural (Web Audio) — sem arquivos externos.
export class AtelierAudio {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private wheelGain!: GainNode;
  private wheelOsc!: OscillatorNode;
  private clayGain!: GainNode;
  private clayFilter!: BiquadFilterNode;
  private waterGain!: GainNode;
  private noise!: AudioBuffer;
  enabled = true;
  volume = 0.8;

  start() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(ctx.destination);

    // Ruído rosa reutilizável.
    const len = ctx.sampleRate * 3;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
      d[i] = (b0 + b1 + b2 + w * 0.02) * 0.9;
    }

    // Tom de ambiente: ar da sala + vento distante pela janela.
    const room = this.loopNoise(400, 0.5, 0.05);
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.025;
    lfo.connect(lfoG).connect(room.gain); lfo.start();

    // Zumbido do torno.
    this.wheelOsc = ctx.createOscillator();
    this.wheelOsc.type = 'triangle';
    this.wheelOsc.frequency.value = 48;
    const wf = ctx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 220;
    this.wheelGain = ctx.createGain(); this.wheelGain.gain.value = 0;
    this.wheelOsc.connect(wf).connect(this.wheelGain).connect(this.master);
    this.wheelOsc.start();
    const rumble = this.loopNoise(140, 1.2, 0);
    rumble.gain.connect(this.wheelGain);

    // Atrito úmido da argila (ruído filtrado modulado pelo gesto).
    const clay = this.loopNoise(900, 0.8, 0, true);
    this.clayFilter = clay.filter;
    this.clayGain = clay.gain;

    // Água (esponja).
    const water = this.loopNoise(2400, 2.5, 0, true);
    this.waterGain = water.gain;

    this.birds();
  }

  private loopNoise(freq: number, q: number, gain: number, bandpass = false) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise; src.loop = true;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const filter = ctx.createBiquadFilter();
    filter.type = bandpass ? 'bandpass' : 'lowpass';
    filter.frequency.value = freq; filter.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(filter).connect(g).connect(this.master);
    src.start();
    return { filter, gain: g };
  }

  private birds() {
    const ctx = this.ctx!;
    const chirp = () => {
      if (!this.ctx) return;
      const t = ctx.currentTime;
      const n = 2 + Math.floor(Math.random() * 3);
      const base = 2600 + Math.random() * 1400;
      for (let i = 0; i < n; i++) {
        const o = ctx.createOscillator(); o.type = 'sine';
        const g = ctx.createGain();
        const t0 = t + i * 0.13;
        o.frequency.setValueAtTime(base, t0);
        o.frequency.exponentialRampToValueAtTime(base * 1.35, t0 + 0.06);
        o.frequency.exponentialRampToValueAtTime(base * 0.9, t0 + 0.1);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.012, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
        const p = ctx.createStereoPanner(); p.pan.value = 0.6;
        o.connect(g).connect(p).connect(this.master);
        o.start(t0); o.stop(t0 + 0.13);
      }
      setTimeout(chirp, 6000 + Math.random() * 12000);
    };
    setTimeout(chirp, 3000);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.ctx) this.master.gain.setTargetAtTime(on ? this.volume : 0, this.ctx.currentTime, 0.2);
  }

  /** speed 0..1 (giro do torno). */
  wheel(speed: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.wheelGain.gain.setTargetAtTime(speed * 0.09, t, 0.3);
    this.wheelOsc.frequency.setTargetAtTime(38 + speed * 26, t, 0.3);
  }

  /** intensidade do contato com a argila (0..1) e umidade. */
  clay(intensity: number, wet: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.clayGain.gain.setTargetAtTime(Math.min(1, intensity) * 0.22, t, 0.05);
    this.clayFilter.frequency.setTargetAtTime(500 + (1 - wet) * 1600 + intensity * 400, t, 0.08);
  }

  water(intensity: number) {
    if (!this.ctx) return;
    this.waterGain.gain.setTargetAtTime(Math.min(1, intensity) * 0.08, this.ctx.currentTime, 0.08);
  }

  drip() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(1800, t + 0.08);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.2);
  }

  tap() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 4;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    src.connect(f).connect(g).connect(this.master); src.start(t, Math.random()); src.stop(t + 0.1);
  }

  /** Sino suave (guardar peça, concluir convite). */
  chime(up = true) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const notes = up ? [523.25, 659.25, 783.99] : [440, 523.25];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine';
      const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2.76;
      const g = ctx.createGain(); const g2 = ctx.createGain(); g2.gain.value = 0.25;
      o.frequency.value = f;
      const t0 = t + i * 0.12;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.2);
      o.connect(g); o2.connect(g2).connect(g); g.connect(this.master);
      o.start(t0); o2.start(t0); o.stop(t0 + 2.3); o2.stop(t0 + 2.3);
    });
  }

  suspend() { void this.ctx?.suspend(); }
  resume() { void this.ctx?.resume(); }
}
