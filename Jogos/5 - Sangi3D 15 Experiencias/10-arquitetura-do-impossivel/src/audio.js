import { ROOMS, rng } from './config.js';

/**
 * Síntese Web Audio procedural com reverberação por sala, passos em pedra,
 * engrenagens de mecanismo, sinos de alinhamento, dobra de portal e gravidade.
 */
export function createMuseumAudio() {
  let ctx = null;
  let master = null;
  let compressor = null;
  let ambientBus = null;
  let sfxBus = null;
  let convolver = null;
  let dryGain = null;
  let wetGain = null;
  let droneSource = null;
  let droneFilter = null;
  let droneGain = null;
  let muted = true;
  let paused = false;
  let disposed = false;
  let activeRoom = 'hub';
  let volumes = { master: 0.8, ambient: 0.7, sfx: 0.9 };
  const activeNodes = new Set();

  function buildImpulse(audioCtx, decaySeconds = 2.0) {
    const rate = audioCtx.sampleRate;
    const len = Math.max(1024, Math.floor(rate * decaySeconds));
    const buf = audioCtx.createBuffer(2, len, rate);
    const rand = rng(9071);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const env = Math.pow(1 - i / len, 2.6);
        data[i] = (rand() * 2 - 1) * env * 0.48;
      }
    }
    return buf;
  }

  function ensure() {
    if (disposed) return null;
    if (!ctx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) throw new Error('Web Audio indisponível neste navegador.');
      ctx = new AudioCtor();

      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 4;

      master = ctx.createGain();
      master.gain.value = muted ? 0 : volumes.master * 0.45;

      ambientBus = ctx.createGain();
      ambientBus.gain.value = volumes.ambient;

      sfxBus = ctx.createGain();
      sfxBus.gain.value = volumes.sfx;

      dryGain = ctx.createGain();
      dryGain.gain.value = 0.78;
      wetGain = ctx.createGain();
      wetGain.gain.value = 0.28;

      convolver = ctx.createConvolver();
      convolver.buffer = buildImpulse(ctx, 2.1);

      ambientBus.connect(master);
      sfxBus.connect(dryGain);
      sfxBus.connect(convolver);
      convolver.connect(wetGain);
      dryGain.connect(master);
      wetGain.connect(master);
      master.connect(compressor).connect(ctx.destination);

      // Subtle stone-atrium air resonance
      const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      const rand = rng(7601);
      let s = 0;
      for (let i = 0; i < ch.length; i++) {
        s = s * 0.82 + (rand() * 2 - 1) * 0.18;
        ch[i] = s * (0.65 + 0.35 * Math.sin(i / 4800));
      }
      droneSource = ctx.createBufferSource();
      droneSource.buffer = buf;
      droneSource.loop = true;

      droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 460;

      droneGain = ctx.createGain();
      droneGain.gain.value = 0.14;

      droneSource.connect(droneFilter).connect(droneGain).connect(ambientBus);
      droneSource.start();
    }
    if (!paused && !muted) ctx.resume().catch(() => {});
    return ctx;
  }

  function applyGains() {
    if (!ctx || disposed) return;
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(muted ? 0 : volumes.master * 0.45, t, 0.04);
    ambientBus.gain.setTargetAtTime(volumes.ambient, t, 0.05);
    sfxBus.gain.setTargetAtTime(volumes.sfx, t, 0.05);
  }

  function track(node, durationMs) {
    activeNodes.add(node);
    node.onended = () => {
      activeNodes.delete(node);
      try { node.disconnect(); } catch {}
    };
    setTimeout(() => activeNodes.delete(node), durationMs + 100);
  }

  function setRoom(roomId) {
    if (activeRoom === roomId) return;
    activeRoom = roomId;
    if (!ctx || disposed) return;
    const info = ROOMS.find(r => r.id === roomId) || ROOMS[0];
    const t = ctx.currentTime;
    wetGain.gain.setTargetAtTime(info.reverb.wetness, t, 0.25);
    droneFilter.frequency.setTargetAtTime(info.reverb.cutoff * 0.42, t, 0.35);
    // Avoid rebuilding convolver rapidly on fast room switches unless paused is false
    convolver.buffer = buildImpulse(ctx, info.reverb.decay);
  }

  function playStep(isStair = false) {
    if (muted || paused || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    const base = isStair ? 148 + Math.random() * 24 : 112 + Math.random() * 18;
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.075);

    filter.type = 'bandpass';
    filter.frequency.value = isStair ? 680 : 480;
    filter.Q.value = 1.4;

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.09);

    osc.connect(filter).connect(g).connect(sfxBus);
    osc.start(t);
    osc.stop(t + 0.1);
    track(osc, 120);
  }

  function playStoneMechanism() {
    if (muted || paused || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(68, t);
    osc.frequency.linearRampToValueAtTime(52, t + 0.42);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);
    filter.frequency.exponentialRampToValueAtTime(110, t + 0.42);

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

    osc.connect(filter).connect(g).connect(sfxBus);
    osc.start(t);
    osc.stop(t + 0.48);
    track(osc, 500);
  }

  function playChime(notes = [523.25, 659.25, 783.99]) {
    if (muted || paused || !ctx) return;
    const t = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      const start = t + idx * 0.075;
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.001, start);
      g.gain.linearRampToValueAtTime(0.085, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, start + 0.95);
      osc.connect(g).connect(sfxBus);
      osc.start(start);
      osc.stop(start + 1.0);
      track(osc, 1050);
    });
  }

  function playPortal() {
    if (muted || paused || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(493.88, t + 0.34);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0006, t + 0.55);
    osc.connect(g).connect(sfxBus);
    osc.start(t);
    osc.stop(t + 0.58);
    track(osc, 620);
  }

  function playGravityShift() {
    if (muted || paused || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(72, t + 0.5);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.13, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.62);
    osc.connect(g).connect(sfxBus);
    osc.start(t);
    osc.stop(t + 0.65);
    track(osc, 680);
  }

  return {
    enable() {
      ensure();
      muted = false;
      applyGains();
      return !muted;
    },
    setMuted(next) {
      muted = Boolean(next);
      if (!muted) ensure();
      applyGains();
    },
    isMuted: () => muted,
    setPause(next) {
      paused = Boolean(next);
      if (!ctx || disposed) return;
      if (paused) ctx.suspend().catch(() => {});
      else if (!muted) ctx.resume().catch(() => {});
    },
    setVolumes(next) {
      volumes = { ...volumes, ...next };
      applyGains();
    },
    setRoom,
    playStep,
    playStoneMechanism,
    playChime,
    playPortal,
    playGravityShift,
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const n of activeNodes) {
        try { n.stop(); n.disconnect(); } catch {}
      }
      activeNodes.clear();
      try { droneSource?.stop(); } catch {}
      try { droneSource?.disconnect(); } catch {}
      try { ctx?.close(); } catch {}
      ctx = null;
    },
  };
}
