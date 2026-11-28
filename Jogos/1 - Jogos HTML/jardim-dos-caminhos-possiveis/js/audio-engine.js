/**
 * js/audio-engine.js
 * Pássaros serenos e passos leves sobre cascalho/madeira para # 073.
 * Inicia somente após interação explícita do usuário.
 */
export function createGardenPathsAudio() {
  let ctx = null;
  let masterGain = null;
  let brookGain = null;
  let enabled = false;
  let muted = false;
  let volume = 0.45;
  let nextBirdAt = 0;

  function ensureInit() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(ctx.destination);

    // Murmúrio calmo do riacho no jardim
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      lp = lp * 0.86 + w * 0.14;
      data[i] = lp * 1.1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 620;
    bp.Q.value = 0.9;
    brookGain = ctx.createGain();
    brookGain.gain.value = 0.14;
    src.connect(bp).connect(brookGain).connect(masterGain);
    src.start();
    return true;
  }

  function applyMaster() {
    if (!ctx || !masterGain) return;
    masterGain.gain.setTargetAtTime(enabled && !muted ? volume * 0.55 : 0.0001, ctx.currentTime, 0.1);
  }

  async function setEnabled(next) {
    if (next && !ensureInit()) return false;
    enabled = Boolean(next);
    if (ctx && enabled && ctx.state === 'suspended') await ctx.resume().catch(() => {});
    applyMaster();
    return enabled;
  }

  function setMuted(m) { muted = Boolean(m); applyMaster(); }
  function setVolume(v) { volume = Math.max(0, Math.min(1, v)); applyMaster(); }

  function tickBirds(paused, reduced) {
    if (!ctx || !enabled || muted || paused || reduced || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (now < nextBirdAt) return;
    nextBirdAt = now + 3.2 + Math.random() * 3.5;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const f0 = 1650 + Math.random() * 550;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f0 * 1.18, now + 0.08);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.045, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  function playStep(onBridge = false) {
    if (!ctx || !enabled || muted || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = onBridge ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(onBridge ? 170 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.07);
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  function suspend() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
  function resume() { if (ctx && enabled && !muted && ctx.state === 'suspended') ctx.resume().catch(() => {}); }
  function dispose() { if (ctx) { try { ctx.close(); } catch (_) {} ctx = null; } }

  return { setEnabled, setMuted, setVolume, tickBirds, playStep, suspend, resume, dispose };
}
