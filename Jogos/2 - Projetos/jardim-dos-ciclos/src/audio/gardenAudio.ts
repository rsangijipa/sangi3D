type AudioCaptionCallback = (caption: string) => void;

class GardenAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private breezeGain: GainNode | null = null;
  private breezeSource: AudioBufferSourceNode | null = null;
  private birdTimer: number | null = null;
  private enabled = false;
  private dayPhase = 0.5;
  private onCaption: AudioCaptionCallback | null = null;

  public setCaptionHandler(cb: AudioCaptionCallback | null) {
    this.onCaption = cb;
  }

  private emitCaption(text: string) {
    if (this.onCaption) {
      this.onCaption(text);
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Soft pink-ish filter
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.012) * 0.6;
    }
    return buffer;
  }

  public setEnabled(next: boolean) {
    this.enabled = next;
    if (next) {
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(0.45, now, 0.8);
      this.startAmbientBreeze(ctx);
      this.scheduleNextBird();
      this.emitCaption('Brisa leve e pássaros distantes na estufa');
    } else {
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setTargetAtTime(0.0001, now, 0.35);
      }
      this.stopAmbient();
    }
  }

  private startAmbientBreeze(ctx: AudioContext) {
    if (this.breezeSource || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(ctx, 4);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 340;
    filter.Q.value = 0.65;

    // Gentle LFO breathing the wind frequency
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.09;
    lfoGain.gain.value = 110;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0.14;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start();

    this.breezeSource = src;
    this.breezeGain = gain;
  }

  private scheduleNextBird() {
    if (!this.enabled) return;
    if (this.birdTimer !== null) window.clearTimeout(this.birdTimer);
    const delay = 5200 + Math.random() * 8800;
    this.birdTimer = window.setTimeout(() => {
      if (!this.enabled) return;
      // Pássaros durante o dia; grilos quando a luz cai no crepúsculo
      if (this.dayPhase > 0.84 || this.dayPhase < 0.06) this.playCrickets();
      else this.playDistantBird();
      this.scheduleNextBird();
    }, delay);
  }

  public setDayPhase(lightCycle: number) {
    this.dayPhase = Math.min(1, Math.max(0, lightCycle));
  }

  private playCrickets() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = 4200 + Math.random() * 600;
    const pulses = 6 + Math.floor(Math.random() * 6);
    for (let i = 0; i < pulses; i++) {
      const start = now + i * 0.075;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.012, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(start);
      osc.stop(start + 0.06);
    }
  }

  /** Carrilhão suave tocado quando a planta atinge um novo estágio do ciclo. */
  public playStageChime() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    this.emitCaption('Carrilhão suave: a planta mudou de estágio');
    const ctx = this.ctx;
    const now = ctx.currentTime;
    [659.25, 830.61, 987.77, 1318.5].forEach((f, i) => {
      const start = now + i * 0.16;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 1.7);
    });
  }

  private playDistantBird() {
    if (!this.enabled || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const baseFreq = 2400 + Math.random() * 1100;
    const notes = Math.random() > 0.4 ? 2 : 3;

    for (let i = 0; i < notes; i++) {
      const start = now + i * (0.14 + Math.random() * 0.08);
      const dur = 0.11 + Math.random() * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 3400;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * (0.95 + i * 0.08), start);
      osc.frequency.exponentialRampToValueAtTime(
        baseFreq * (1.16 + Math.random() * 0.12),
        start + dur * 0.55
      );
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, start + dur);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.022, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + dur + 0.02);
    }
  }

  public playWatering(intensity = 0.6) {
    this.emitCaption(
      intensity < 0.35
        ? 'Borrifo suave de névoa sobre as folhas'
        : 'Água delicada escorrendo e umedecendo a terra'
    );
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;
    const duration = 1.6 + intensity * 1.3;

    // Soft water stream / mist
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 2);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = intensity < 0.35 ? 2400 : 1050;
    filter.Q.value = intensity < 0.35 ? 1.1 : 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11 + intensity * 0.09, now + 0.25);
    gain.gain.setValueAtTime(0.09 + intensity * 0.08, now + duration - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + duration + 0.05);

    // Delicate droplets hitting moist earth
    const drops = Math.floor(6 + intensity * 9);
    for (let i = 0; i < drops; i++) {
      const t = now + 0.2 + Math.random() * (duration - 0.4);
      const osc = ctx.createOscillator();
      const dGain = ctx.createGain();
      const f = 520 + Math.random() * 680;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.65, t + 0.065);

      dGain.gain.setValueAtTime(0.0001, t);
      dGain.gain.linearRampToValueAtTime(0.025, t + 0.01);
      dGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

      osc.connect(dGain);
      dGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    }
  }

  public playPlantSeed() {
    this.emitCaption('Semente pousando na terra macia com toque sutil de cerâmica');
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    // Soft terracotta tap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);

    // Soft earth rustle
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 1);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 820;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.0001, now + 0.22);
    nGain.gain.linearRampToValueAtTime(0.08, now + 0.34);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.masterGain);
    noise.start(now + 0.2);
    noise.stop(now + 0.78);
  }

  public playCopperTouch() {
    this.emitCaption('Toque suave de cobre e cerâmica na bancada');
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    [580, 1140, 1790].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.032 / (idx + 1), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38 - idx * 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.42);
    });
  }

  public playLeafRustle() {
    this.emitCaption('Farfalhar suave de folhas ao toque');
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(ctx, 1);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1400;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.45);
  }

  private stopAmbient() {
    if (this.birdTimer !== null) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.breezeSource) {
      try {
        this.breezeSource.stop();
        this.breezeSource.disconnect();
      } catch {
        // ignore already stopped
      }
      this.breezeSource = null;
      this.breezeGain = null;
    }
  }
}

export const gardenAudio = new GardenAudioEngine();
