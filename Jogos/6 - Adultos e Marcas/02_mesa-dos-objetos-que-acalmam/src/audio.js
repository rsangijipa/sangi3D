/**
 * Motor de Áudio Seguro Procedural (Safe Audio via Web Audio API)
 * Projeto: 02. Mesa dos Objetos que Acalmam
 * 
 * Diretrizes estritas:
 * - Teto estrito com compressor/limitador em -24 dBFS
 * - Inicialização estrita sob gesto do usuário (pointerdown/keydown)
 * - Mute/Unmute com fade cruzado suave (sem estalos ou descontinuidades)
 */

export class CalmingAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;

    // Nós de saída mestre
    this.masterGain = null;
    this.limiter = null;

    // Geradores contínuos
    this.sandNoiseGain = null;
    this.sandNoiseFilter = null;
    this.sandNoiseSource = null;

    // Drone da tigela tibetana
    this.bowlDroneGains = [];
    this.bowlDroneOscs = [];
  }

  init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Limitador mestre estrito (-24 dBFS)
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-24, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(3, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(18, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);

      this.setupSandNoise();
      this.setupBowlDrone();

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API não pôde ser inicializado:', e);
    }
  }

  ensureRunning() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.75, t + 0.08);
    }
    return this.isMuted;
  }

  /**
   * Síntese de ruído marrom contínuo para o atrito do estilete do pêndulo na areia
   */
  setupSandNoise() {
    if (!this.ctx) return;

    // Buffer de 2 segundos de ruído marrom suave
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8; // normalização suave
    }

    this.sandNoiseSource = this.ctx.createBufferSource();
    this.sandNoiseSource.buffer = buffer;
    this.sandNoiseSource.loop = true;

    this.sandNoiseFilter = this.ctx.createBiquadFilter();
    this.sandNoiseFilter.type = 'bandpass';
    this.sandNoiseFilter.frequency.setValueAtTime(520, this.ctx.currentTime);
    this.sandNoiseFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.sandNoiseGain = this.ctx.createGain();
    this.sandNoiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.sandNoiseSource.connect(this.sandNoiseFilter);
    this.sandNoiseFilter.connect(this.sandNoiseGain);
    this.sandNoiseGain.connect(this.masterGain);

    this.sandNoiseSource.start();
  }

  /**
   * Atualiza intensidade do som de atrito na areia com base na velocidade do pêndulo
   */
  updateSandFriction(speed) {
    if (!this.ctx || !this.sandNoiseGain) return;
    const t = this.ctx.currentTime;
    const targetGain = Math.min(0.22, Math.max(0, (speed - 0.01) * 0.45));
    this.sandNoiseGain.gain.cancelScheduledValues(t);
    this.sandNoiseGain.gain.linearRampToValueAtTime(targetGain, t + 0.05);

    // Varia sutilmente a frequência de corte com a velocidade
    const freq = 420 + Math.min(400, speed * 800);
    this.sandNoiseFilter.frequency.linearRampToValueAtTime(freq, t + 0.05);
  }

  /**
   * Clique metálico nítido e satisfatório do Berço de Newton
   */
  playNewtonClick(intensity = 0.8) {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const freqs = [2180, 3920, 5150, 7200];
    const gains = [0.18, 0.12, 0.08, 0.04];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Ligeira desafinação orgânica
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.03), t);

      const amp = gains[idx] * intensity * 0.7;
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  /**
   * Síntese modal completa da Tigela Tibetana (Batimentos acústicos inarmônicos)
   */
  playBowlStrike(intensity = 0.8) {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    // Frequências modais clássicas de uma tigela tibetana de 7 metais:
    // Fundamental ~216 Hz, parciais inarmônicos com batimento (detune ±1.5Hz)
    const partials = [
      { f: 216.0, dur: 7.5, gain: 0.32 },
      { f: 217.4, dur: 7.0, gain: 0.28 }, // batimento no fundamental
      { f: 598.0, dur: 5.5, gain: 0.18 },
      { f: 600.2, dur: 5.2, gain: 0.16 }, // batimento no segundo parcial
      { f: 1142.0, dur: 3.8, gain: 0.09 },
      { f: 1860.0, dur: 2.2, gain: 0.05 }
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, t);

      const peak = p.gain * intensity * 0.5;
      gain.gain.setValueAtTime(0.001, t);
      // Ataque suave com bastão forrado de camurça (12ms)
      gain.gain.linearRampToValueAtTime(peak, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + p.dur + 0.1);
    });
  }

  /**
   * Prepara osciladores sustentados para o canto contínuo da tigela
   */
  setupBowlDrone() {
    if (!this.ctx) return;

    const dronePartials = [216.0, 217.5, 598.0, 600.0];
    const baseAmps = [0.15, 0.14, 0.08, 0.07];

    dronePartials.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      this.bowlDroneOscs.push(osc);
      this.bowlDroneGains.push({ node: gain, baseAmp: baseAmps[idx] });
    });
  }

  /**
   * Modula o canto contínuo da tigela por fricção circular
   */
  updateBowlFriction(sustain, angularSpeed) {
    if (!this.ctx || !this.bowlDroneGains.length) return;
    const t = this.ctx.currentTime;
    const targetAmp = Math.min(1.0, sustain) * 0.6;

    this.bowlDroneGains.forEach(item => {
      const val = item.baseAmp * targetAmp;
      item.node.gain.cancelScheduledValues(t);
      item.node.gain.linearRampToValueAtTime(val, t + 0.08);
    });
  }

  /**
   * Gotas de óleo / água da ampulheta líquida
   */
  playBubbleDrop(colorType = 'amber') {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const isAmber = colorType === 'amber';
    const startFreq = isAmber ? 480 : 620;
    const endFreq = isAmber ? 740 : 420;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.075);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Passada do rastelo alisando a areia
   */
  playRakeSweep() {
    if (!this.ctx || this.isMuted) return;
    this.ensureRunning();

    const t = this.ctx.currentTime;
    // Disparo suave de ruído filtrado em sweep
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.linearRampToValueAtTime(680, t + 0.7);
    filter.frequency.linearRampToValueAtTime(300, t + 1.4);
    filter.Q.setValueAtTime(2.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    src.start(t);
    src.stop(t + 1.6);
  }

  dispose() {
    this.isMuted = true;
    if (this.ctx) {
      const c = this.ctx;
      this.ctx = null;
      this.masterGain = null;
      this.sandNoiseGain = null;
      this.sandNoiseFilter = null;
      c.close().catch(() => {});
    }
  }
}
