/**
 * js/audio-engine.js
 * Paisagem sonora procedural 100% Web Audio (sem arquivos protegidos):
 * - Riacho (ruído rosa filtrado modulado pela distância ao leito d'água)
 * - Grilos noturnos (pulsos FM agudos em coro estocástico)
 * - Brisa nas copas + toque sutil ao registrar padrão luminoso
 */
import { clamp, streamCenterX } from './math-terrain.js';

export function createAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let streamGain = null;
  let windGain = null;
  let cricketBus = null;
  let chirpTimer = null;
  let started = false;
  let isMuted = false;
  let volume = 0.62;
  let enabled = false;

  function ensureContext() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;

    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    // Ruído rosa longo para riacho e brisa
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.029;
      b1 = 0.985 * b1 + w * 0.032;
      b2 = 0.950 * b2 + w * 0.048;
      b3 = 0.780 * b3 + w * 0.120;
      ch[i] = (b0 + b1 + b2 + b3) * 0.35;
    }

    // Barramento do riacho (passa-faixa dupla para água correndo sobre seixos)
    const streamSrc = ctx.createBufferSource();
    streamSrc.buffer = buf;
    streamSrc.loop = true;
    const streamLP = ctx.createBiquadFilter();
    streamLP.type = 'lowpass';
    streamLP.frequency.value = 1350;
    const streamHP = ctx.createBiquadFilter();
    streamHP.type = 'highpass';
    streamHP.frequency.value = 340;
    streamGain = ctx.createGain();
    streamGain.gain.value = 0.28;
    streamSrc.connect(streamHP).connect(streamLP).connect(streamGain).connect(masterGain);
    streamSrc.start();

    // Barramento da brisa noturna nas copas
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buf;
    windSrc.loop = true;
    const windLP = ctx.createBiquadFilter();
    windLP.type = 'lowpass';
    windLP.frequency.value = 320;
    windGain = ctx.createGain();
    windGain.gain.value = 0.16;
    windSrc.connect(windLP).connect(windGain).connect(masterGain);
    windSrc.start();

    // Barramento de grilos
    cricketBus = ctx.createGain();
    cricketBus.gain.value = 0.18;
    cricketBus.connect(masterGain);

    scheduleCricketChirp();
    started = true;
    return true;
  }

  function scheduleCricketChirp() {
    if (!ctx) return;
    const delayMs = 680 + Math.random() * 1450;
    chirpTimer = setTimeout(() => {
      if (ctx && enabled && !isMuted && ctx.state === 'running') {
        playCricketPulse();
      }
      if (ctx) scheduleCricketChirp();
    }, delayMs);
  }

  function playCricketPulse() {
    if (!ctx || !cricketBus) return;
    const now = ctx.currentTime;
    const baseFreq = 4150 + Math.random() * 480;
    const pulses = 3 + Math.floor(Math.random() * 2);

    for (let p = 0; p < pulses; p++) {
      const t0 = now + p * 0.055;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t0);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.96, t0 + 0.036);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.11, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.038);
      osc.connect(g).connect(cricketBus);
      osc.start(t0);
      osc.stop(t0 + 0.042);
    }
  }

  function applyGain() {
    if (!ctx || !masterGain) return;
    const target = enabled && !isMuted ? volume * 0.45 : 0.0001;
    masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.12);
  }

  async function setEnabled(next) {
    if (next && !ensureContext()) return false;
    enabled = Boolean(next);
    if (ctx && enabled && ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    applyGain();
    return enabled;
  }

  function setMuted(muted) {
    isMuted = Boolean(muted);
    applyGain();
  }

  function setVolume(v) {
    volume = clamp(v, 0, 1);
    applyGain();
  }

  function updateSpatial(cameraPos, state) {
    if (!ctx || !enabled || isMuted || !streamGain) return;
    const dStream = Math.abs(cameraPos.x - streamCenterX(cameraPos.z));
    const streamProx = clamp(1.15 - dStream * 0.09, 0.25, 1.0);
    streamGain.gain.setTargetAtTime(0.14 + streamProx * 0.34, ctx.currentTime, 0.15);

    // Grilos ficam levemente mais intensos após o crepúsculo
    const nightBoost = state.hour >= 20 && state.hour <= 26.5 ? 1.0 : 0.6;
    if (cricketBus) cricketBus.gain.setTargetAtTime(0.16 * nightBoost, ctx.currentTime, 0.2);
  }

  function playRecordChime() {
    if (!ctx || !enabled || isMuted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    [523.25, 659.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now + idx * 0.09);
      g.gain.linearRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.38);
      osc.connect(g).connect(masterGain);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.42);
    });
  }

  function suspend() {
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  }

  function resume() {
    if (ctx && enabled && !isMuted && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function dispose() {
    clearTimeout(chirpTimer);
    chirpTimer = null;
    if (ctx) {
      try { ctx.close(); } catch (_) {}
      ctx = null;
    }
    started = false;
  }

  return {
    get isStarted() { return started; },
    setEnabled,
    setMuted,
    setVolume,
    updateSpatial,
    playRecordChime,
    suspend,
    resume,
    dispose,
  };
}
