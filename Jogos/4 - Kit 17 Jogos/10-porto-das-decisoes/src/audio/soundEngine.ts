/**
 * Porto das Decisões — Motor de Áudio Sintetizado (Web Audio API)
 * Efeitos náuticos, ondas, gaivotas, motor a diesel e sons de madeira sem dependências externas
 */

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private wavesGain: GainNode | null = null;

  constructor() {
    // Inicialização sob demanda após primeiro clique para respeitar autoplay policy
  }

  private initContext() {
    if (this.ctx && this.ctx.state !== 'closed') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.startAmbiance();
    } catch (e) {
      console.warn('Web Audio API não suportada ou bloqueada:', e);
    }
  }

  public ensureContext(): void {
    if (!this.ctx) {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.6;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Ambiência contínua de ondas marítimas e vento suave no porto
   */
  private startAmbiance(): void {
    if (!this.ctx || !this.masterGain) return;

    try {
      // 1. Ruído rosa para o mar
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoiseSource = this.ctx.createBufferSource();
      whiteNoiseSource.buffer = noiseBuffer;
      whiteNoiseSource.loop = true;

      const seaFilter = this.ctx.createBiquadFilter();
      seaFilter.type = 'lowpass';
      seaFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.wavesGain = this.ctx.createGain();
      this.wavesGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      // LFO para simular vai-e-vem das marolas (período ~4s)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(this.wavesGain.gain);

      whiteNoiseSource.connect(seaFilter);
      seaFilter.connect(this.wavesGain);
      this.wavesGain.connect(this.masterGain);

      whiteNoiseSource.start();
      lfo.start();

      // Programar gaivotas esporádicas a cada 15 a 30s
      this.scheduleNextSeabird();
    } catch {
      // Degradação elegante sem som
    }
  }

  private scheduleNextSeabird(): void {
    if (this.isMuted) return;
    const delay = 14000 + Math.random() * 20000;
    setTimeout(() => {
      this.playSeabirdCall();
      this.scheduleNextSeabird();
    }, delay);
  }

  public playSeabirdCall(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch bend característico de gaivota
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  /**
   * Clique suave na interface estilo papel/madeira
   */
  public playClick(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  /**
   * Seleção ou adição de nó no trajeto (som límpido)
   */
  public playNodeSelect(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  /**
   * Desfazer nó
   */
  public playUndo(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  /**
   * Guincho / engrenagem do guindaste ao erguer ou mover caixas
   */
  public playCraneWinch(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  /**
   * Pouso de caixa de madeira no convés ou no cais
   */
  public playCrateThud(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  /**
   * Sino de porto / boia ao atingir um destino ou parada
   */
  public playHarborBell(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Harmônicos de campainha de latão/bronze
      [880, 1760, 2640].forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.18 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 - idx * 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {}
  }

  /**
   * Apito / buzina vintage de barco a vapor/diesel ao partir ou finalizar com sucesso
   */
  public playBoatHorn(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // Dois tons graves combinados (acorde caloroso de buzina marítima)
      const freqs = [196, 246.94]; // Sol3 + Si3
      freqs.forEach(freq => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
        gain.gain.setValueAtTime(0.18, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    } catch {}
  }

  public dispose(): void {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.masterGain = null;
  }
}
