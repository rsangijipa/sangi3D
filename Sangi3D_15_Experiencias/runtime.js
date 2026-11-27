import * as THREE from '../shared/vendor/three.module.js';
import { EngineRenderer } from '../shared/engine/renderer.js';
import { definitions } from './catalog.js';

export { THREE };
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function rng(seed = 107) {
  let state = seed >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

export function download(content, name, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = node('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

export async function mount(id) {
  const definition = definitions[id];
  const field = document.querySelector('#controls');
  const hint = document.querySelector('#hint');
  const status = document.querySelector('#status');
  const canvas = document.querySelector('#view');
  const view = canvas.parentElement;
  const message = document.querySelector('#scene-message');
  let engine;
  try {
    engine = new EngineRenderer(canvas, { maxPixelRatio: 1, initialQuality: 'BALANCED', shadowMap: false, environmentIntensity: .62 });
  } catch {
    message.hidden = false;
    message.textContent = 'WebGL 2 indisponível neste navegador. Ative a aceleração gráfica e recarregue para jogar.';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, .045, 180);
  const signals = new AbortController();
  const cleanup = [];
  const tracks = new Set();
  const storeKey = 'sangi3d:15:' + id + ':v1';
  const timers = { time: 0, paused: false };
  const keys = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let game, raf, disposed = false, last, stepCarry = 0, lost = false, fpsTime = 0, frames = 0;
  let redraw = true;
  let audio, master, muted = true;
  let moveHandler = null;
  let paintHandler = null;
  const pointers = new Map();
  const ndc = new THREE.Vector2();
  const ray = new THREE.Raycaster();

  const on = (target, event, callback, options = {}) =>
    target.addEventListener(event, callback, { ...options, signal: signals.signal });
  const ctx = {
    scene, camera, canvas, keys, on, cleanup, timers, controls: field, low: false, reduced: reduced.matches,
    button(label, callback, parent = field, primary = false) {
      const button = node('button', label, primary ? 'primary' : '');
      button.type = 'button';
      on(button, 'click', () => {
        try {
          Promise.resolve(callback()).then(() => { redraw = true; }).catch(error => ctx.say(error.message || 'A operação falhou.'));
        } catch (error) { ctx.say(error.message || 'A operação falhou.'); }
      });
      parent.append(button);
      return button;
    },
    group(className = 'group') {
      const group = node('div', '', className);
      field.append(group);
      return group;
    },
    reading(text = '') {
      const out = node('output', text, 'readout');
      field.append(out);
      return out;
    },
    meter(title) {
      const item = node('label', title, 'meter');
      const meter = node('meter');
      meter.min = 0; meter.max = 1;
      item.append(meter);
      field.append(item);
      return meter;
    },
    range(label, min, max, step, value, change) {
      const wrap = node('label', '', 'field');
      const row = node('span', '', 'field-label');
      const out = node('span', String(value));
      out.setAttribute('aria-hidden', 'true');
      row.append(node('span', label), out);
      const input = node('input');
      Object.assign(input, { type: 'range', min, max, step, value });
      input.setAttribute('aria-label', label);
      on(input, 'input', () => { out.textContent = input.value; change(input.valueAsNumber); redraw = true; });
      wrap.append(row, input);
      field.append(wrap);
      return input;
    },
    select(label, options, change) {
      const wrap = node('label', label, 'field');
      const select = node('select');
      options.forEach((name, index) => {
        const option = node('option', name);
        option.value = String(index);
        select.append(option);
      });
      on(select, 'change', () => { change(Number(select.value)); redraw = true; });
      wrap.append(select); field.append(wrap);
      return select;
    },
    input(label, type, options = {}) {
      const wrap = node('label', label, 'field');
      const input = node('input');
      Object.assign(input, { type, ...options });
      wrap.append(input); field.append(wrap);
      return input;
    },
    file(label, accept, callback) {
      const input = ctx.input(label, 'file', { accept });
      on(input, 'change', async () => {
        const [file] = input.files;
        input.value = '';
        if (file) {
          try { await callback(file); }
          catch (error) { ctx.say(error.message || 'Não foi possível ler o arquivo.'); }
        }
      });
      return input;
    },
    say(text) { status.textContent = text; },
    hint(text, reticle = false) {
      hint.textContent = text;
      document.querySelector('.crosshair').hidden = !reticle;
    },
    save(value) {
      try { localStorage.setItem(storeKey, JSON.stringify(value)); return true; }
      catch { ctx.say('Armazenamento indisponível. Use a exportação quando disponível.'); return false; }
    },
    load(fallback) {
      try { return JSON.parse(localStorage.getItem(storeKey)) ?? fallback; }
      catch { return fallback; }
    },
    photo() {
      engine.render(scene, camera);
      canvas.toBlob(blob => {
        if (blob) download(blob, definition.slug + '.png', 'image/png');
      }, 'image/png');
    },
    move(fn) { moveHandler = fn; },
    paint(fn) { paintHandler = fn; },
    project(p, plane, result = new THREE.Vector3()) {
      ndc.set(p.x * 2 - 1, 1 - p.y * 2);
      ray.setFromCamera(ndc, camera);
      return ray.ray.intersectPlane(plane, result);
    },
    audio() {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('Web Audio indisponível neste navegador.');
      if (!audio) {
        audio = new Audio();
        master = audio.createGain();
        master.gain.value = muted ? 0 : .32;
        const compressor = audio.createDynamicsCompressor();
        master.connect(compressor).connect(audio.destination);
      }
      if (!timers.paused) audio.resume().catch(() => {});
      return { audio, master };
    },
    unmute() { setMuted(false); },
    track(stream) {
      if (disposed) stream.getTracks().forEach(track => track.stop());
      else tracks.add(stream);
      return !disposed;
    },
    stop(stream) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        tracks.delete(stream);
      }
    },
  };

  const sound = document.querySelector('#sound');
  function setMuted(value) {
    muted = value;
    sound.textContent = muted ? 'Ativar som' : 'Silenciar';
    sound.setAttribute('aria-pressed', String(!muted));
    if (master) master.gain.setTargetAtTime(muted ? 0 : .32, audio.currentTime, .035);
    game?.mute?.(muted);
  }
  const pause = document.querySelector('#pause');
  function setPaused(value) {
    if (timers.paused === value) return;
    timers.paused = value;
    redraw = true;
    pause.textContent = value ? 'Continuar' : 'Pausar';
    pause.setAttribute('aria-pressed', String(value));
    pointers.clear(); keys.clear(); stepCarry = 0;
    if (value) audio?.suspend().catch(() => {});
    else audio?.resume().catch(() => {});
    game?.pause?.(value);
  }
  function reset() {
    pointers.clear(); keys.clear(); timers.time = 0; stepCarry = 0;
    game?.reset?.();
    redraw = true;
  }
  function setQuality(value) {
    const tier = String(value || '').toUpperCase();
    ctx.low = ['LOW', 'ECONOMY'].includes(tier);
    engine.setQuality(ctx.low ? 'LOW' : tier === 'HIGH' ? 'HIGH' : 'BALANCED');
    game?.quality?.(ctx.low);
    redraw = true;
  }
  on(pause, 'click', () => setPaused(!timers.paused));
  on(sound, 'click', () => {
    try { ctx.audio(); setMuted(!muted); }
    catch (error) { ctx.say(error.message); }
  });
  on(document.querySelector('#reset'), 'click', reset);
  on(document.querySelector('#photo'), 'click', () => ctx.photo());
  on(document.querySelector('#quality'), 'change', event => setQuality(event.target.value));
  on(document.querySelector('#motion'), 'click', event => {
    ctx.reduced = !ctx.reduced;
    event.target.setAttribute('aria-pressed', String(ctx.reduced));
  });
  document.querySelector('#motion').setAttribute('aria-pressed', String(ctx.reduced));
  on(reduced, 'change', event => {
    ctx.reduced = event.matches;
    document.querySelector('#motion').setAttribute('aria-pressed', String(ctx.reduced));
  });

  function pointer(event, phase) {
    const previous = pointers.get(event.pointerId);
    if (phase !== 'start' && !previous) return;
    const box = canvas.getBoundingClientRect();
    const p = {
      id: event.pointerId,
      x: clamp((event.clientX - box.left) / box.width, 0, 1),
      y: clamp((event.clientY - box.top) / box.height, 0, 1),
      dx: previous ? event.clientX - previous.cx : 0,
      dy: previous ? event.clientY - previous.cy : 0,
      cx: event.clientX, cy: event.clientY,
      alternate: previous?.alternate ?? (event.button === 2 || event.shiftKey),
    };
    if (phase === 'end' || phase === 'cancel') pointers.delete(p.id);
    else pointers.set(p.id, p);
    if (timers.paused) return;
    paintHandler?.(p, phase);
    if (phase === 'move') moveHandler?.(p);
  }
  on(canvas, 'contextmenu', event => event.preventDefault());
  on(canvas, 'pointerdown', event => {
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    pointer(event, 'start');
  });
  on(canvas, 'pointermove', event => pointer(event, 'move'));
  on(canvas, 'pointerup', event => pointer(event, 'end'));
  on(canvas, 'pointercancel', event => pointer(event, 'cancel'));
  on(canvas, 'lostpointercapture', event => pointer(event, 'cancel'));
  on(window, 'keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target?.closest('input,textarea,select,button,[contenteditable],a') || timers.paused) return;
    const key = event.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key)) event.preventDefault();
    keys.add(key);
    if (!event.repeat) game?.key?.(key);
  });
  on(window, 'keyup', event => keys.delete(event.key.toLowerCase()));
  on(window, 'blur', () => { keys.clear(); pointers.clear(); game?.cancel?.(); });
  on(canvas, 'webglcontextlost', event => {
    event.preventDefault(); lost = true;
    setPaused(true);
    message.hidden = false;
    message.textContent = 'Contexto gráfico interrompido. Aguarde a restauração ou recarregue.';
  });
  on(canvas, 'webglcontextrestored', () => {
    lost = false;
    message.hidden = true;
    setPaused(false);
  });
  function resize() {
    const w = view.clientWidth, h = view.clientHeight;
    if (!w || !h || disposed) return;
    camera.aspect = w / h;
    const fov = game?.fov || 55;
    camera.fov = camera.aspect < 1 ? Math.min(77, fov / Math.sqrt(camera.aspect)) : fov;
    camera.updateProjectionMatrix();
    engine.renderer.setSize(w, h, false);
    redraw = true;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(view);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    signals.abort();
    game?.dispose?.();
    cleanup.forEach(fn => fn());
    tracks.forEach(stream => ctx.stop(stream));
    audio?.close().catch(() => {});
    const resources = new Set();
    scene.traverse(object => {
      if (object.geometry) resources.add(object.geometry);
      for (const material of [object.material].flat().filter(Boolean)) {
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
        resources.add(material);
      }
    });
    resources.forEach(resource => resource.dispose());
    engine.dispose();
  }
  on(window, 'pagehide', event => {
    if (event.persisted) {
      setPaused(true);
      game?.releaseMedia?.();
      tracks.forEach(stream => ctx.stop(stream));
    }
    else dispose();
  });
  on(window, 'pageshow', event => { if (event.persisted) setPaused(false); });
  on(window, 'sangi:pause', () => setPaused(true));
  on(window, 'sangi:resume', () => setPaused(false));
  on(window, 'sangi:mute', event => setMuted(event.detail.muted));
  on(window, 'sangi:reset', reset);
  on(window, 'sangi:dispose', dispose);
  on(window, 'sangi:quality', event => setQuality(event.detail.quality));
  try {
    const module = await definition.load();
    if (disposed) return;
    game = module[definition.factory](ctx);
    sound.hidden = !game.mute && !game.audio;
    setQuality(innerWidth <= 760 ? 'LOW' : 'BALANCED');
    document.querySelector('#quality').value = ctx.low ? 'LOW' : 'BALANCED';
    resize();
    message.hidden = true;
    window.SangiBridge?.notifyReady({ title: definition.title });
    const backend = document.querySelector('#backend');
    backend.textContent = 'Three.js r' + THREE.REVISION + ' · WebGL 2';
    document.documentElement.dataset.ready = 'true';
    const frame = now => {
      if (disposed) return;
      const elapsed = last === undefined ? 0 : (now - last) / 1000;
      const dt = Math.min(.05, elapsed);
      last = now;
      if (!timers.paused && !lost) {
        timers.time += dt;
        stepCarry += dt;
        while (stepCarry >= 1 / 60) {
          game.step?.(1 / 60);
          stepCarry -= 1 / 60;
        }
        game.update?.(dt, timers.time);
      }
      if (!lost && (!timers.paused || redraw)) {
        engine.render(scene, camera);
        redraw = false;
      }
      if (!timers.paused && !lost && !ctx.low) {
        fpsTime += elapsed; frames += 1;
        if (fpsTime >= 4) {
          if (frames / fpsTime < 24 && document.querySelector('#quality').value === 'BALANCED') {
            setQuality('LOW');
            document.querySelector('#quality').value = 'LOW';
          }
          fpsTime = 0; frames = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  } catch (error) {
    console.error(error);
    dispose();
    message.hidden = false;
    message.textContent = 'Falha na inicialização. Recarregue a página para tentar novamente.';
  }
}

export async function readJSON(file, limit = 3_000_000) {
  if (file.size > limit) throw new Error('Arquivo acima do limite de tamanho.');
  try { return JSON.parse(await file.text()); }
  catch { throw new Error('O arquivo não contém JSON válido.'); }
}
