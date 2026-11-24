/**
 * Sistema de Áudio Procedural Seguro (Web Audio API)
 * Teto de -24 dBFS, limitador dinâmico, polifonia controlada e síntese 100% matemática (sem arquivos externos).
 */
export class SafeAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.limiter = null;
    this.streamNode = null;
    this.streamGain = null;
    this.streamFilter = null;
    this.isMuted = false;
    this.volume = 0.063; // ~ -24 dBFS
    this.birdTimer = null;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;

    const ctx = (this.ctx = new AC());

    // Limitador e compressor dinâmico
    const lim = (this.limiter = ctx.createDynamicsCompressor());
    lim.threshold.value = -24;
    lim.knee.value = 6;
    lim.ratio.value = 16;
    lim.attack.value = 0.003;
    lim.release.value = 0.15;

    const master = (this.master = ctx.createGain());
    master.gain.value = this.isMuted ? 0 : this.volume;

    master.connect(lim);
    lim.connect(ctx.destination);

    this.startRiverStream();
    this.scheduleDistantBirds();
    return true;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.04);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(0.12, val));
    if (this.master && this.ctx && !this.isMuted) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Correnteza contínua do rio (ruído filtrado modulado no ritmo da respiração).
   */
  startRiverStream() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Gerar 2 segundos de ruído rosa/browniano em loop
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.14;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filtro passa-faixa para o sussurro da água rasa
    const filter = (this.streamFilter = ctx.createBiquadFilter());
    filter.type = 'bandpass';
    filter.frequency.value = 520;
    filter.Q.value = 0.85;

    const gain = (this.streamGain = ctx.createGain());
    gain.gain.value = 0.35;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(0);
  }

  /**
   * Modula a correnteza acompanhando o ciclo respiratório (expansão na inspiração, calma na expiração).
   */
  modulateStreamWithBreath(breathIntensity) {
    if (!this.ctx || !this.streamFilter || !this.streamGain) return;
    const now = this.ctx.currentTime;
    const targetFreq = 420 + breathIntensity * 280; // 420Hz -> 700Hz
    const targetGain = 0.28 + breathIntensity * 0.18;
    this.streamFilter.frequency.setTargetAtTime(targetFreq, now, 0.25);
    this.streamGain.gain.setTargetAtTime(targetGain, now, 0.25);
  }

  /**
   * Toque de pedra com pedra (síntese modal de impacto mineral).
   * Pedras mais pesadas soam mais graves; pedras leves produzem estalo cristalino mineral.
   */
  playRockClack(mass = 1.5, velocity = 1.0) {
    if (!this.ensure()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const v = Math.min(1.5, Math.max(0.3, velocity));
    const m = Math.min(3.0, Math.max(0.4, mass));

    // Frequência fundamental inversamente proporcional à massa
    const baseFreq = 160 + (3.0 - m) * 95;

    // Modos ressonantes minerais de quartzo / ardósia: 1 : 2.15 : 4.6 : 8.2
    const modes = [
      { f: baseFreq, g: 0.85, decay: 0.14 },
      { f: baseFreq * 2.15, g: 0.42, decay: 0.08 },
      { f: baseFreq * 4.6, g: 0.22, decay: 0.04 },
      { f: baseFreq * 8.2, g: 0.12, decay: 0.02 },
    ];

    modes.forEach(({ f, g, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      // Leve queda de afinação no impacto instantâneo
      osc.frequency.exponentialRampToValueAtTime(f * 0.94, now + decay);

      const amp = g * v * 0.45;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(amp, now + 0.003); // ataque ultra rápido de 3ms
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(this.master);

      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    // Transitório de atrito superficial mineral (ruído filtrado ultra curto)
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    const nd = noiseBuffer.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (nd.length * 0.25));

    const nSrc = ctx.createBufferSource();
    nSrc.buffer = noiseBuffer;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.value = 1800;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.18 * v, now);
    nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    nSrc.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.master);

    nSrc.start(now);
    nSrc.stop(now + 0.035);
  }

  /**
   * Queda suave da pedra na água rasa ("tchup" delicado com bolha d'água).
   */
  playWaterSplash() {
    if (!this.ensure()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Tom descendente aquático
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.3);

    // Borbulha e splash
    const dur = 0.18;
    const bLen = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bLen; i++) d[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(950, now);
    bp.frequency.exponentialRampToValueAtTime(450, now + dur);
    bp.Q.value = 2.4;

    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.24, now);
    bg.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(bp);
    bp.connect(bg);
    bg.connect(this.master);
    src.start(now);
    src.stop(now + dur + 0.02);
  }

  /**
   * Pássaros distantes raros no bambuzal matinal.
   */
  scheduleDistantBirds() {
    const playBird = () => {
      if (this.ctx && !this.isMuted) {
        const now = this.ctx.currentTime;
        const notes = [2200, 2480, 2900];
        notes.forEach((freq, idx) => {
          const t = now + idx * 0.14;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.linearRampToValueAtTime(freq * 1.08, t + 0.08);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.028, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

          osc.connect(gain);
          gain.connect(this.master);
          osc.start(t);
          osc.stop(t + 0.13);
        });
      }

      // Intervalo aleatório de 14s a 26s
      const nextTime = (14 + Math.random() * 12) * 1000;
      this.birdTimer = setTimeout(playBird, nextTime);
    };

    this.birdTimer = setTimeout(playBird, 8000);
  }

  dispose() {
    clearTimeout(this.birdTimer);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
