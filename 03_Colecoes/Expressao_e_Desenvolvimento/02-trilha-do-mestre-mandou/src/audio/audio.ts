/**
 * Motor de Áudio Seguro Procedural (Web Audio API)
 * Projeto: 02. Trilha do Mestre Mandou
 * Teto de ganho estrito em -24 dBFS via DynamicsCompressor
 */

export class ForestAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private masterGain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;

  // Geradores de ambiente
  private streamGain: GainNode | null = null;
  private birdTimer: any = null;

  init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Limitador mestre estrito em -24 dBFS
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-24, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(4, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(16, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.18, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);

      this.setupStreamAmbiance();
      this.startBirdsLoop();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API não inicializado:', e);
    }
  }

  ensureRunning() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.7, t + 0.08);
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Som contínuo e suave do riacho na floresta
   */
  private setupStreamAmbiance() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + (0.025 * white)) / 1.025;
      last = data[i];
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(220, this.ctx.currentTime);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(820, this.ctx.currentTime);

    this.streamGain = this.ctx.createGain();
    this.streamGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    src.connect(hp);
    hp.connect(lp);
    lp.connect(this.streamGain);
    this.streamGain.connect(this.masterGain);

    src.start();
  }

  private startBirdsLoop() {
    const playRandomBird = () => {
      if (this.ctx && !this.isMuted && Math.random() < 0.6) {
        this.playBirdChirp();
      }
      this.birdTimer = setTimeout(playRandomBird, 4000 + Math.random() * 7000);
    };
    this.birdTimer = setTimeout(playRandomBird, 3000);
  }

  private playBirdChirp() {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2400 + Math.random() * 600;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq + 400, t + 0.06);
    osc.frequency.linearRampToValueAtTime(baseFreq - 200, t + 0.12);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.035, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Sino Azul de Bronze — ressonância cristalina e profunda
   */
  playBlueBell() {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const partials = [
      { f: 587.3, dur: 4.5, gain: 0.28 }, // D5 fundamental
      { f: 1174.6, dur: 3.5, gain: 0.18 }, // D6
      { f: 1762.0, dur: 2.4, gain: 0.10 },
      { f: 2350.0, dur: 1.8, gain: 0.06 }
    ];

    partials.forEach(p => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(p.gain * 0.7, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + p.dur + 0.05);
    });
  }

  /**
   * Tambor de Madeira e Couro
   */
  playDrum() {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(52, t + 0.14);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  /**
   * Respingos e Giro da Roda d'Água
   */
  playWaterWheel() {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.15);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  /**
   * Passadas do Avatar (madeira das passarelas ou solo)
   */
  playFootstep(isWood: boolean = true) {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isWood ? 240 : 120, t);
    osc.frequency.exponentialRampToValueAtTime(isWood ? 140 : 60, t + 0.04);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(isWood ? 0.08 : 0.04, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Sinal suave de conquista / Etapa concluída
   */
  playSuccessArpeggio() {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.5);
    });
  }

  dispose() {
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
