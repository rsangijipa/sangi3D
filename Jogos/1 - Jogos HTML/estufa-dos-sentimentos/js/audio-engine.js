/**
 * js/audio-engine.js
 * Áudio ambiental procedural para Estufa dos Sentimentos:
 * chuva suave no vidro, folhas ao vento e som curto de rega (inicia apenas após gesto).
 */
export function createGreenhouseAudioEngine() {
  let ctx = null;
  let masterGain = null;
  let rainGain = null;
  let breezeGain = null;
  let enabled = false;
  let muted = false;
  let volume = 0.45;

  function ensureInit() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.82 + w * 0.18;
      data[i] = lp * 1.4;
    }

    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = buf;
    rainSrc.loop = true;
    const rainBP = ctx.createBiquadFilter();
    rainBP.type = 'bandpass';
    rainBP.frequency.value = 1400;
    rainBP.Q.value = 0.7;
    rainGain = ctx.createGain();
    rainGain.gain.value = 0.0001;
    rainSrc.connect(rainBP).connect(rainGain).connect(masterGain);
    rainSrc.start();

    const breezeSrc = ctx.createBufferSource();
    breezeSrc.buffer = buf;
    breezeSrc.loop = true;
    const breezeLP = ctx.createBiquadFilter();
    breezeLP.type = 'lowpass';
    breezeLP.frequency.value = 320;
    breezeGain = ctx.createGain();
    breezeGain.gain.value = 0.18;
    breezeSrc.connect(breezeLP).connect(breezeGain).connect(masterGain);
    breezeSrc.start();

    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    const target = enabled && !muted ? volume * 0.55 : 0.0001;
    masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.1);
  }

  async function setEnabled(next) {
    if (next && !ensureInit()) return false;
    enabled = Boolean(next);
    if (ctx && enabled && ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    applyMaster();
    return enabled;
  }

  function setMuted(next) {
    muted = Boolean(next);
    applyMaster();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    applyMaster();
  }

  function updateClimate(rainFactor, paused) {
    if (!ctx || !rainGain || !breezeGain) return;
    const active = enabled && !muted && !paused && ctx.state === 'running';
    if (!active) {
      rainGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      breezeGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
      return;
    }
    rainGain.gain.setTargetAtTime(0.02 + rainFactor * 0.24, ctx.currentTime, 0.2);
    breezeGain.gain.setTargetAtTime(0.14 + (1 - rainFactor) * 0.06, ctx.currentTime, 0.2);
  }

  function playWaterDrop() {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(860, now + 0.08);
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  function suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
  function resume() { if (ctx && enabled && !muted && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function dispose() { if (ctx) { try { ctx.close(); } catch (_) {} ctx = null; } }

  return { setEnabled, setMuted, setVolume, updateClimate, playWaterDrop, suspend, resume, dispose };
}
