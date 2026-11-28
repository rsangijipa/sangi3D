import { ToolType } from '../types';

export class MaterialAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private contactGain: GainNode | null = null;
  private contactFilter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private contactSource: AudioBufferSourceNode | null = null;

  public isEnabled: boolean = false;
  public volume: number = 0.55;

  public init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();

    // Master Dynamics Compressor / Limiter
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
    compressor.knee.setValueAtTime(8, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
    compressor.connect(this.ctx.destination);

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(compressor);

    // Generate Pink Noise Buffer (4 seconds loop)
    const bufferSize = this.ctx.sampleRate * 4;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    // 1. Ambient Layer (Gentle window air / studio silence)
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

    const ambientSource = this.ctx.createBufferSource();
    ambientSource.buffer = this.noiseBuffer;
    ambientSource.loop = true;

    const ambientFilter = this.ctx.createBiquadFilter();
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.setValueAtTime(380, this.ctx.currentTime);

    ambientSource.connect(ambientFilter).connect(this.ambientGain).connect(this.masterGain);
    ambientSource.start();

    // 2. Material Contact Layer (Tactile clay friction)
    this.contactGain = this.ctx.createGain();
    this.contactGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.contactFilter = this.ctx.createBiquadFilter();
    this.contactFilter.type = 'bandpass';
    this.contactFilter.frequency.setValueAtTime(1100, this.ctx.currentTime);
    this.contactFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.contactSource = this.ctx.createBufferSource();
    this.contactSource.buffer = this.noiseBuffer;
    this.contactSource.loop = true;

    this.contactSource.connect(this.contactFilter).connect(this.contactGain).connect(this.masterGain);
    this.contactSource.start();

    this.isEnabled = true;
  }

  public unlock(): void {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggle(): boolean {
    if (!this.ctx) {
      this.init();
      return true;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
      this.isEnabled = true;
      return true;
    }

    this.isEnabled = !this.isEnabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isEnabled ? this.volume : 0.0001,
        this.ctx.currentTime,
        0.08
      );
    }
    return this.isEnabled;
  }

  /**
   * Modulates tactile contact friction during gestures.
   */
  public updateContact(speed: number, pressure: number, tool: ToolType): void {
    if (!this.ctx || !this.isEnabled || !this.contactGain || !this.contactFilter) return;

    const now = this.ctx.currentTime;

    // Filter frequency based on tool identity
    let targetFreq = 1100; // Modelar (wet plastic friction)
    let targetQ = 1.1;

    if (tool === 'alisar') {
      targetFreq = 720; // Muffled smooth stroking
      targetQ = 0.8;
    } else if (tool === 'marcar') {
      targetFreq = 1850; // Crisper wooden edge groove
      targetQ = 1.8;
    }

    this.contactFilter.frequency.setTargetAtTime(targetFreq, now, 0.06);
    this.contactFilter.Q.setTargetAtTime(targetQ, now, 0.06);

    // Calculate gain from speed and pressure
    const clampedSpeed = Math.min(1.0, speed * 2.8);
    const targetGain = Math.max(0.0001, clampedSpeed * pressure * 0.28);

    this.contactGain.gain.setTargetAtTime(targetGain, now, 0.04);
  }

  public stopContact(): void {
    if (this.contactGain && this.ctx) {
      this.contactGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
    }
  }

  public dispose(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
