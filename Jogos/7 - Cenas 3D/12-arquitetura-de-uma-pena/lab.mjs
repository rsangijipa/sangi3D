import { FeatherState, clamp, ROOT } from './feather-state.mjs';
import { LabView } from './lab-view.mjs';

const $ = (id) => document.getElementById(id);
const defaults = () => ({
  zoom: 1, light: 38, tilt: 0.19, orbit: 0, exposure: 1, focus: 1,
  lens: true, dof: false, probe: null, quality: matchMedia('(pointer: coarse)').matches ? 'medium' : 'high'
});
const guidance = {
  flex: 'Arraste a pena para flexionar. Solte para observar o retorno.',
  split: 'Passe a ponta da ferramenta na lateral da pena para abrir as fibras.',
  recover: 'Passe a ferramenta pela abertura ou use Recompor para alinhar tudo.'
};
const percent = value => Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 });

class BenchAudio {
  constructor() {
    this.volume = 0.35;
    this.muted = true;
  }

  async enable() {
    if (!this.context) this.initialize();
    if (this.context?.state === 'suspended') await this.context.resume();
  }

  initialize() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    const context = this.context = new Audio();
    this.master = context.createGain();
    this.master.gain.value = 0;
    this.master.connect(context.destination);
    this.noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const wave = this.noise.getChannelData(0);
    let smooth = 0;
    for (let i = 0; i < wave.length; i++) {
      smooth = smooth * 0.79 + (Math.random() * 2 - 1) * 0.21;
      wave[i] = smooth;
    }
    this.room = context.createBufferSource();
    this.room.buffer = this.noise;
    this.room.loop = true;
    const roomFilter = context.createBiquadFilter();
    roomFilter.frequency.value = 175;
    const roomLevel = context.createGain();
    roomLevel.gain.value = 0.17;
    this.room.connect(roomFilter).connect(roomLevel).connect(this.master);
    this.room.start();
  }

  sync(paused) {
    if (!this.context || this.context.state === 'closed') return;
    const level = this.muted || paused || window.__SANGI_MUTED__ ? 0 : this.volume;
    this.master.gain.setTargetAtTime(level, this.context.currentTime, 0.034);
  }

  rub(strength, pan) {
    if (!this.context || this.muted || window.__SANGI_MUTED__) return;
    const context = this.context;
    const time = context.currentTime;
    const source = context.createBufferSource();
    source.buffer = this.noise;
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 950 + strength * 1850;
    filter.Q.value = 0.7;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.04 + strength * 0.13, time + 0.020);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    const position = context.createStereoPanner();
    position.pan.value = clamp(pan, -1, 1);
    source.connect(filter).connect(gain).connect(position).connect(this.master);
    source.start(time, Math.random(), 0.20);
  }

  dispose() { this.context?.close().catch(() => {}); }
}

class FeatherLab {
  constructor() {
    this.root = $('lab');
    this.canvas = $('workbench');
    this.events = new AbortController();
    this.state = new FeatherState();
    this.controls = defaults();
    this.audio = new BenchAudio();
    this.view = new LabView(this.canvas);
    this.tool = 'flex';
    this.mode = 'explore';
    this.panel = '';
    this.paused = false;
    this.contextLost = false;
    this.disposed = false;
    this.pointers = new Map();
    this.frame = 0;
    this.accumulator = 0;
    this.previousTime = 0;
    this.measureAt = 0;
    this.frameTimes = [];
    this.frameTimeIndex = 0;
    this.lessMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.gesture = null;
    this.released = false;
    this.listenUI();
    this.listenInput();
    this.listenLifecycle();
    this.resize();
    this.syncControls();
    this.feedback('Pena alinhada');
    this.draw();
    this.schedule();
  }

  on(target, event, callback, options) {
    target.addEventListener(event, callback, { ...options, signal: this.events.signal });
  }

  click(id, action) { this.on($(id), 'click', action); }

  value(id, action) {
    this.on($(id), 'input', event => action(Number(event.target.value)));
  }

  syncControls() {
    const { controls, state } = this;
    this.root.dataset.tool = this.tool;
    this.root.dataset.mode = this.mode;
    for (const id of ['flex', 'split']) $(id).setAttribute('aria-pressed', String(id === this.tool));
    for (const id of ['explore', 'recover']) $(id).setAttribute('aria-pressed', String(id === this.mode));
    $('macro').setAttribute('aria-pressed', String(controls.zoom < 2.55));
    $('micro').setAttribute('aria-pressed', String(controls.zoom >= 2.55));
    $('guidance').textContent = guidance[this.tool];
    $('light-angle').value = controls.light;
    $('light-value').value = controls.light + '°';
    $('zoom-factor').value = controls.zoom;
    $('zoom-value').value = percent(controls.zoom) + '×';
    $('frame').value = Math.round(state.focus * 100);
    $('focus').value = controls.focus;
    $('focus-value').value = controls.focus < 0.98 ? 'Próximo' : controls.focus > 1.02 ? 'Distante' : 'Centro';
    $('exposure').value = controls.exposure;
    $('exposure-value').value = percent(controls.exposure) + '×';
    $('quality').value = controls.quality;
    $('dof').checked = $('photo-dof').checked = controls.lens;
    $('less-motion').checked = this.lessMotion;
    controls.dof = controls.lens && (this.panel === 'photo' || controls.zoom >= 2.55);
  }

  feedback(message) {
    if ($('live').textContent !== message) $('live').textContent = message;
  }

  setTool(tool, focusCanvas = false) {
    this.endGesture();
    this.tool = tool;
    this.mode = tool === 'recover' ? 'recover' : 'explore';
    this.setPanel('');
    this.syncControls();
    if (focusCanvas) this.canvas.focus({ preventScroll: true });
  }

  setPanel(panel, returnFocus = false) {
    const previous = this.panel;
    this.panel = previous === panel ? '' : panel;
    this.endGesture();
    $('panel').hidden = !this.panel;
    const groups = { settings: 'Ajustes', light: 'Luz rasante', zoom: 'Enquadramento', photo: 'Modo fotografia' };
    for (const group of Object.keys(groups)) {
      $(group + '-controls').hidden = group !== this.panel && !(group === 'zoom' && this.panel === 'photo');
      $(group).setAttribute(group === 'photo' ? 'aria-pressed' : 'aria-expanded', String(group === this.panel));
    }
    if (this.panel !== 'photo') this.showReference(false);
    if (this.panel) {
      $('panel-title').textContent = groups[this.panel];
      const focus = { settings: 'quality', light: 'light-angle', zoom: 'zoom-factor', photo: 'focus' };
      $(focus[this.panel]).focus({ preventScroll: true });
    } else if (returnFocus && previous) {
      $(previous).focus({ preventScroll: true });
    }
    this.syncControls();
  }

  setZoom(z, announce = false) {
    const wasMicro = this.controls.zoom >= 2.55;
    this.controls.zoom = clamp(z, 1, 4.8);
    const isMicro = this.controls.zoom >= 2.55;
    this.syncControls();
    if (wasMicro !== isMicro || announce) {
      this.feedback(isMicro ? 'Bárbulas visíveis ao redor do ponto de foco' : 'Vista da pena inteira');
    }
  }

  recompose() {
    this.setTool('recover');
    if (!this.state.openCount) {
      this.feedback('As fibras já estão alinhadas');
      return;
    }
    this.state.recompose();
    if (this.lessMotion) for (let i = 0; i < 120; i++) this.state.step(1 / 120);
    this.audio.rub(0.31, 0);
    this.feedback(this.state.repairing ? 'Alinhando as fibras…' : 'Pena alinhada');
  }

  listenUI() {
    for (const tool of ['flex', 'split']) this.click(tool, () => {
      this.setTool(tool, true);
      this.feedback(tool === 'flex' ? 'Flexão ativa' : 'Ferramenta de separação ativa');
    });
    this.click('explore', () => this.setTool('flex', true));
    this.click('recover', () => this.setTool('recover', true));
    this.click('repair', () => this.recompose());
    this.click('macro', () => { this.controls.tilt = 0.19; this.setZoom(1, true); });
    this.click('micro', () => { this.controls.tilt = 0.14; this.setZoom(3.15, true); });
    for (const panel of ['settings', 'light', 'zoom', 'photo']) this.click(panel, () => this.setPanel(panel));
    this.click('panel-close', () => this.setPanel('', true));
    this.click('pause', () => this.openDialog('pause-dialog'));
    this.click('resume', () => $('pause-dialog').close());
    this.click('restart', () => { this.reset(); $('pause-dialog').close(); });
    this.click('open-help', () => this.openDialog('help-dialog'));
    this.click('help-close', () => $('help-dialog').close());
    for (const id of ['pause-dialog', 'help-dialog']) {
      this.on($(id), 'close', () => this.setPaused(false));
    }

    this.value('light-angle', value => { this.controls.light = value; this.syncControls(); });
    this.value('zoom-factor', value => this.setZoom(value));
    this.value('frame', value => { this.state.focus = value / 100; });
    this.value('focus', value => { this.controls.focus = value; this.syncControls(); });
    this.value('exposure', value => { this.controls.exposure = value; this.syncControls(); });
    this.value('volume', value => {
      this.audio.volume = value / 100;
      $('volume-value').value = value + '%';
      this.audio.sync(this.inactive());
    });
    this.on($('quality'), 'change', event => this.quality(event.target.value));
    this.on($('less-motion'), 'change', event => { this.lessMotion = event.target.checked; });
    for (const id of ['dof', 'photo-dof']) this.on($(id), 'change', event => {
      this.controls.lens = event.target.checked;
      this.syncControls();
    });
    this.on($('mute'), 'change', async event => {
      this.audio.muted = event.target.checked;
      if (!this.audio.muted) await this.audio.enable().catch(() => this.feedback('Áudio indisponível neste navegador'));
      this.audio.sync(this.inactive());
    });
    this.click('pin-reference', () => {
      this.draw();
      $('photo-reference').src = this.canvas.toDataURL('image/png');
      $('compare').disabled = false;
      this.showReference(true);
      this.feedback('Referência fixada nesta sessão');
    });
    this.click('compare', () => this.showReference($('photo-reference').hidden));
    this.value('compare-split', value => {
      $('photo-reference').style.setProperty('--comparison-split', value + '%');
    });
    this.click('capture', () => {
      if (this.inactive()) return;
      this.draw();
      const link = document.createElement('a');
      link.href = this.canvas.toDataURL('image/png');
      link.download = 'arquitetura-de-uma-pena.png';
      link.click();
      this.feedback('Captura PNG pronta');
    });
  }

  showReference(visible) {
    $('photo-reference').hidden = !visible;
    $('compare-controls').hidden = !visible;
    $('compare').setAttribute('aria-pressed', String(visible));
  }

  openDialog(id) {
    this.setPaused(true);
    $(id).showModal();
  }

  inactive() {
    return this.paused || this.contextLost || this.disposed || document.hidden || window.__SANGI_PAUSED__;
  }

  setPaused(paused) {
    this.paused = paused;
    this.audio.sync(this.inactive());
    if (paused) this.stop();
    else this.schedule();
  }

  stop() {
    this.endGesture();
    cancelAnimationFrame(this.frame);
    this.frame = this.previousTime = this.accumulator = 0;
  }

  reset() {
    this.state.reset();
    $('photo-reference').removeAttribute('src');
    $('compare').disabled = true;
    const quality = this.controls.quality;
    const lens = this.controls.lens;
    this.controls = { ...defaults(), quality, lens };
    this.setTool('flex');
    this.released = false;
    this.feedback('Pena restaurada à forma inicial');
    if (!this.contextLost) this.draw();
  }

  quality(level) {
    if (!['low', 'medium', 'high'].includes(level)) return;
    this.controls.quality = level;
    this.resize();
    this.syncControls();
  }

  resize() {
    if (this.disposed || this.contextLost) return;
    this.view.resize(this.root.clientWidth, this.root.clientHeight, this.controls.quality);
    this.draw();
  }

  hit(event) { return this.view.pick(event.clientX, event.clientY); }

  edit(hit, silentInvalid = false) {
    if (!hit?.onVane) {
      if (!silentInvalid) this.feedback('Aproxime a ferramenta da lateral da pena');
      return;
    }
    const changed = this.state.edit(hit.station, hit.side, this.tool === 'split');
    this.controls.probe = hit;
    this.syncControls();
    if (changed) this.audio.rub(this.tool === 'split' ? 0.88 : 0.39, hit.station * 2 - 1);
    if (this.tool === 'split') this.feedback(changed ? 'Abertura nas fibras' : 'Fibras já separadas neste ponto');
    else this.feedback(changed ? (this.state.openCount ? 'Trecho alinhado' : 'Pena alinhada') : 'Trecho já alinhado');
  }

  endGesture() {
    this.released ||= Math.abs(this.state.target) > 0.02;
    this.state.release();
    this.controls.probe = null;
    this.pointers.clear();
    this.gesture = null;
  }

  listenInput() {
    const canvas = this.canvas;
    this.on(canvas, 'contextmenu', event => event.preventDefault());
    this.on(canvas, 'wheel', event => {
      if (this.inactive() || this.panel) return;
      event.preventDefault();
      this.setZoom(this.controls.zoom * Math.exp(-event.deltaY * 0.0014));
    }, { passive: false });

    this.on(canvas, 'pointerdown', event => {
      if (this.inactive() || this.panel || event.button > 2) return;
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (this.pointers.size >= 2) {
        this.state.release();
        this.controls.probe = null;
        this.gesture = { type: 'pinch', distance: this.distance(), zoom: this.controls.zoom };
        return;
      }
      const hit = this.hit(event);
      const orbit = event.button !== 0 || event.altKey || (this.tool === 'flex' && !hit?.onFeather);
      const type = orbit ? 'orbit' : this.tool === 'flex' ? 'flex' : 'edit';
      this.gesture = { type, id: event.pointerId, x: event.clientX, y: event.clientY, hit, last: null, moved: false };
      if (type === 'edit' && hit?.onVane) this.controls.probe = hit;
    });

    this.on(canvas, 'pointermove', event => {
      if (this.inactive() || this.panel) return;
      if (!this.pointers.has(event.pointerId)) return;
      const point = this.pointers.get(event.pointerId);
      const gesture = this.gesture;
      const dx = event.clientX - point.x;
      const dy = event.clientY - point.y;
      point.x = event.clientX;
      point.y = event.clientY;
      if (!gesture) return;
      if (gesture.type === 'pinch') {
        if (this.pointers.size >= 2) this.setZoom(gesture.zoom * this.distance() / Math.max(20, gesture.distance));
      } else if (gesture.type === 'orbit') {
        this.controls.orbit = clamp(this.controls.orbit - dx * 0.005, -0.68, 0.68);
        this.controls.tilt = clamp(this.controls.tilt + dy * 0.004, -0.42, 0.60);
      } else if (gesture.type === 'flex') {
        const deltaY = event.clientY - gesture.y;
        const deltaX = event.clientX - gesture.x;
        const lift = clamp((-deltaY + deltaX * 0.42) / 170, -0.48, 0.85);
        this.state.flex(lift, gesture.hit?.station);
        if (!gesture.moved && Math.abs(lift) > 0.025) {
          gesture.moved = true;
          this.audio.rub(Math.abs(lift), this.state.focus * 2 - 1);
          this.feedback('Pena flexionada');
        }
      } else if (Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) {
        const hit = this.hit(event);
        this.controls.probe = hit?.onVane ? hit : null;
        const interval = this.tool === 'split' ? 0.091 : 0.037;
        if (hit?.onVane && (gesture.last === null || Math.abs(hit.station - gesture.last) > interval)) {
          this.edit(hit, true);
          gesture.last = hit.station;
          gesture.moved = true;
        }
      }
    });

    const finish = (event, cancel) => {
      this.pointers.delete(event.pointerId);
      const gesture = this.gesture;
      if (!gesture) return;
      if (gesture.type === 'edit' && !cancel && !gesture.moved) this.edit(this.hit(event));
      if (gesture.type === 'flex' && gesture.moved) {
        this.released = true;
        this.feedback('Retorno elástico');
      }
      this.state.release();
      if (gesture.type !== 'edit') this.controls.probe = null;
      this.gesture = null;
    };
    this.on(canvas, 'pointerup', event => finish(event, false));
    this.on(canvas, 'pointercancel', event => finish(event, true));
    this.on(canvas, 'lostpointercapture', event => {
      if (this.pointers.has(event.pointerId)) finish(event, true);
    });
    this.on(canvas, 'blur', () => this.endGesture());
    this.on(canvas, 'keydown', event => this.keydown(event));
    this.on(canvas, 'keyup', event => {
      if (event.code === 'Space' && this.tool === 'flex') {
        this.state.release();
        this.released = true;
        this.feedback('Retorno elástico');
      }
    });
  }

  distance() {
    const [a, b] = this.pointers.values();
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  keydown(event) {
    if (this.inactive() || this.panel) return;
    const { key, code } = event;
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', '+', '=', '-'].includes(key) && code !== 'Space') return;
    event.preventDefault();
    if (key === '+' || key === '=' || key === '-') {
      this.setZoom(this.controls.zoom + (key === '-' ? -0.24 : 0.24));
    } else if (key.startsWith('Arrow')) {
      if (key === 'ArrowUp' || key === 'ArrowDown') this.state.side = key === 'ArrowUp' ? 1 : -1;
      else this.state.focus = clamp(this.state.focus + (key === 'ArrowRight' ? 0.035 : -0.035), ROOT, 0.98);
      this.controls.probe = { station: this.state.focus, side: this.state.side, along: 0.74, onVane: true };
      this.feedback('Ponto selecionado na ' + (this.state.side > 0 ? 'lateral superior' : 'lateral inferior'));
      this.syncControls();
    } else if (!event.repeat) {
      if (this.tool === 'flex') {
        this.state.flex(0.66);
        this.audio.rub(0.5, this.state.focus * 2 - 1);
        this.feedback('Pena flexionada');
      } else this.edit({ station: this.state.focus, side: this.state.side, along: 0.74, onVane: true });
    }
  }

  listenLifecycle() {
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(this.root);
    this.on(document, 'visibilitychange', () => this.activityChanged());
    for (const event of ['pause', 'resume', 'mute']) this.on(window, 'sangi:' + event, () => this.activityChanged());
    this.on(window, 'sangi:reset', () => this.reset());
    this.on(window, 'sangi:quality', event => this.quality(event.detail?.quality));
    this.on(this.canvas, 'webglcontextlost', event => {
      event.preventDefault();
      this.contextLost = true;
      this.stop();
      this.audio.sync(true);
      $('failure-title').textContent = 'A renderização foi interrompida';
      $('failure-detail').textContent = 'A bancada será retomada se o contexto gráfico voltar.';
      $('failure').hidden = false;
    });
    this.on(this.canvas, 'webglcontextrestored', () => {
      this.contextLost = false;
      this.view.lastRevision = -1;
      $('failure').hidden = true;
      this.resize();
      this.activityChanged();
    });
    this.on(window, 'sangi:dispose', () => this.dispose());
  }

  activityChanged() {
    const inactive = this.inactive();
    this.audio.sync(inactive);
    if (inactive) this.stop();
    else this.schedule();
  }

  schedule() {
    if (!this.frame && !this.inactive()) this.frame = requestAnimationFrame(time => this.tick(time));
  }

  draw() {
    const detail = this.view.render(this.state, this.controls);
    this.root.dataset.detail = detail ? 'bárbulas' : 'barbas';
    this.root.dataset.openFibers = String(this.state.openCount);
    this.root.dataset.bend = this.state.bend.toFixed(4);
  }

  tick(time) {
    this.frame = 0;
    if (this.inactive()) return;
    const elapsed = this.previousTime ? time - this.previousTime : 0;
    this.previousTime = time;
    this.accumulator += Math.min(elapsed / 1000, 0.067);
    const wasRepairing = this.state.repairing;
    for (let steps = 0; this.accumulator >= 1 / 120 && steps < 8; steps++) {
      this.state.step(1 / 120);
      this.accumulator -= 1 / 120;
    }
    if (wasRepairing && !this.state.repairing) this.feedback('Pena alinhada');
    if (this.released && Math.abs(this.state.bend) < 0.002 && !this.state.target && !this.state.repairing) {
      this.feedback(this.state.openCount ? 'Curvatura restaurada. Há fibras separadas.' : 'Curvatura restaurada');
      this.released = false;
    }
    this.draw();
    if (elapsed > 0) {
      if (this.frameTimes.length < 90) this.frameTimes.push(elapsed);
      else this.frameTimes[this.frameTimeIndex++ % this.frameTimes.length] = elapsed;
    }
    if (time - this.measureAt > 1000 && this.frameTimes.length) {
      const mean = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      const info = this.view.renderer.info;
      this.root.dataset.frameMs = mean.toFixed(2);
      this.root.dataset.drawCalls = info.render.calls;
      this.root.dataset.geometries = info.memory.geometries;
      this.root.dataset.textures = info.memory.textures;
      $('metrics').textContent = Math.round(1000 / mean) + ' FPS · ' + info.render.calls + ' chamadas de desenho';
      this.measureAt = time;
    }
    this.schedule();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.events.abort();
    this.observer.disconnect();
    this.audio.dispose();
    this.view.dispose();
  }
}

try {
  new FeatherLab();
} catch (error) {
  $('failure').hidden = false;
  $('live').textContent = 'Falha ao iniciar';
  console.error(error);
}
