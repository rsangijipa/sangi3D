/**
 * Procedural Web Audio synthesizer for Expedição pelo Igarapé.
 * Strictly initializes only after the first user interaction, with a master gain
 * ceiling, DynamicsCompressorNode, mute/volume controls, ambient water/forest/rain
 * layers, and physical interaction timbres (paddle dip, hull bump, shutter, mooring).
 */

import { TimePresetId } from './lighting';

export class IgarapeAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private insectGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private muted = false;
  private volume = 0.65;
  private paused = false;
  private birdTimer = 1.8;
  private timePreset: TimePresetId = 'manha';

  isUnlocked(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  unlock() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      try {
        this.ctx = new AudioCtx();
      } catch {
        return;
      }

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -14;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.01;
      compressor.release.value = 0.2;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted || this.paused ? 0 : this.volume * 0.72;
      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);

      // Shared 2-second white noise buffer
      const length = this.ctx.sampleRate * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Layer 1: Soft flowing dark water murmur
      const waterSrc = this.ctx.createBufferSource();
      waterSrc.buffer = this.noiseBuffer;
      waterSrc.loop = true;
      const waterFilter = this.ctx.createBiquadFilter();
      waterFilter.type = 'bandpass';
      waterFilter.frequency.value = 320;
      waterFilter.Q.value = 0.7;
      this.waterGain = this.ctx.createGain();
      this.waterGain.gain.value = 0.14;
      waterSrc.connect(waterFilter).connect(this.waterGain).connect(this.masterGain);
      waterSrc.start();

      // Layer 2: Tropical rain hiss (faded in during Chuva)
      const rainSrc = this.ctx.createBufferSource();
      rainSrc.buffer = this.noiseBuffer;
      rainSrc.loop = true;
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'highpass';
      rainFilter.frequency.value = 1150;
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.value = 0.0;
      rainSrc.connect(rainFilter).connect(this.rainGain).connect(this.masterGain);
      rainSrc.start();

      // Layer 3: Subtle cicadas / forest insects shimmer
      const insectOsc = this.ctx.createOscillator();
      insectOsc.type = 'triangle';
      insectOsc.frequency.value = 4250;
      const insectLfo = this.ctx.createOscillator();
      insectLfo.frequency.value = 6.5;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 180;
      insectLfo.connect(lfoGain).connect(insectOsc.frequency);

      const insectFilter = this.ctx.createBiquadFilter();
      insectFilter.type = 'bandpass';
      insectFilter.frequency.value = 4300;
      insectFilter.Q.value = 4.0;
      this.insectGain = this.ctx.createGain();
      this.insectGain.gain.value = 0.014;

      insectOsc.connect(insectFilter).connect(this.insectGain).connect(this.masterGain);
      insectOsc.start();
      insectLfo.start();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.applyMasterGain();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.applyMasterGain();
  }

  setPaused(paused: boolean) {
    this.paused = paused;
    this.applyMasterGain();
  }

  private applyMasterGain() {
    if (!this.ctx || !this.masterGain) return;
    const target = this.muted || this.paused ? 0 : this.volume * 0.72;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  update(dt: number, canoeSpeed: number, rainIntensity: number, preset: TimePresetId) {
    this.timePreset = preset;
    if (!this.ctx || !this.masterGain || this.muted || this.paused) return;
    const now = this.ctx.currentTime;

    if (this.waterGain) {
      const targetWater = 0.1 + Math.min(0.22, canoeSpeed * 0.055);
      this.waterGain.gain.setTargetAtTime(targetWater, now, 0.25);
    }
    if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(rainIntensity * 0.22, now, 0.4);
    }
    if (this.insectGain) {
      const duskBoost = preset === 'crepusculo' ? 0.024 : preset === 'chuva' ? 0.005 : 0.013;
      this.insectGain.gain.setTargetAtTime(duskBoost, now, 0.5);
    }

    // Periodic rainforest bird calls
    this.birdTimer -= dt;
    if (this.birdTimer <= 0) {
      this.birdTimer = preset === 'chuva' ? 7 + Math.random() * 6 : 3.6 + Math.random() * 5.2;
      this.playBirdChirp(preset === 'crepusculo');
    }
  }

  private playBirdChirp(nocturnal: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = nocturnal ? 580 + Math.random() * 240 : 1450 + Math.random() * 1150;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (nocturnal ? 0.84 : 1.32), now + 0.11);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + 0.26);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.032, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);

    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  /** Tactile paddle dip splash + water displacement thump */
  playPaddleStroke(strength = 1.0) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer || this.muted || this.paused) return;
    const now = this.ctx.currentTime;
    const s = Math.max(0.35, Math.min(1.2, strength));
    const pitchVar = 0.92 + Math.random() * 0.16;

    // 1. Water splash spray
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(680 * pitchVar, now);
    filter.frequency.exponentialRampToValueAtTime(260 * pitchVar, now + 0.32);
    filter.Q.value = 1.1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24 * s, now + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    src.connect(filter).connect(gain).connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.38);

    // 2. Low wooden blade plunge thump
    const thump = this.ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(145 * pitchVar, now);
    thump.frequency.exponentialRampToValueAtTime(58, now + 0.15);
    const tGain = this.ctx.createGain();
    tGain.gain.setValueAtTime(0.001, now);
    tGain.gain.linearRampToValueAtTime(0.14 * s, now + 0.018);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    thump.connect(tGain).connect(this.masterGain);
    thump.start(now);
    thump.stop(now + 0.2);
  }

  /** Mechanical naturalist camera shutter click */
  playPhotoShutter(success: boolean) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer || this.muted || this.paused) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    src.connect(filter).connect(gain).connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.06);

    if (success) {
      // Soft confirming wooden marimba chime
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.3, now + 0.06);
      osc.frequency.setValueAtTime(880.0, now + 0.14);
      const cGain = this.ctx.createGain();
      cGain.gain.setValueAtTime(0.0001, now + 0.05);
      cGain.gain.linearRampToValueAtTime(0.09, now + 0.075);
      cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc.connect(cGain).connect(this.masterGain);
      osc.start(now + 0.05);
      osc.stop(now + 0.4);
    }
  }

  /** Soft muffled bump when canoe brushes a riverbank */
  playBankBrush() {
    if (!this.ctx || !this.masterGain || this.muted || this.paused) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(102, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.16);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Wooden mooring post knock on dock / undock */
  playMooringSound(docked: boolean) {
    if (!this.ctx || !this.masterGain || this.muted || this.paused) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(docked ? 220 : 290, now);
    osc.frequency.exponentialRampToValueAtTime(docked ? 160 : 340, now + 0.14);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  dispose() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.masterGain = null;
    this.waterGain = null;
    this.rainGain = null;
    this.insectGain = null;
  }
}
