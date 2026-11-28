import {workbench} from '../../../Sistema/shared/sangi-workbench.js';
import {microscope} from './microscope.js';
import {createSimulation, radius, specimens, step} from './simulation.js';

const ui = workbench({
  title: 'Universo de uma Gota',
  subtitle: 'Microscopia de água doce',
  hint: 'Arraste a lâmina e selecione uma forma viva. Use a roda ou a pinça para ampliar. No teclado, use as setas, +, − e Enter. Arraste com Alt para inclinar. Para alimentar um ciliado ou uma ameba, ative Alimento e toque perto dele.',
  toolsLabel: 'Microscópio',
});
ui.setHint('Arraste a lâmina · Toque em um organismo');

try {
  start(microscope(ui.stage));
} catch (error) {
  console.error('Falha ao abrir o campo microscópico.', error);
  const message = document.createElement('p');
  message.className = 'gota-unavailable';
  message.setAttribute('role', 'alert');
  message.textContent = 'O campo microscópico precisa de WebGL 2. Verifique a aceleração gráfica do navegador e recarregue a página.';
  ui.stage.replaceChildren(message);
  ui.setStatus('Renderizador indisponível.');
  ui.bind({});
}

function start(optics) {
  const {canvas} = optics;
  const lifecycle = new AbortController();
  const signal = lifecycle.signal;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const defaultView = () => ({x: 0, y: 0, tiltX: 0.018, tiltY: -0.024, zoom: 1, light: 1.10, focus: 0.20, reduced: motion.matches});
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const format = new Intl.NumberFormat('pt-BR');
  let simulation = createSimulation();
  let view = defaultView();
  let accumulator = 0;
  let previous = 0;
  let frame = 0;
  let paused = false;
  let current = null;
  let tracking = false;
  let feeding = false;
  let shotCount = 0;
  let scaleUnits = 0;
  const discovered = new Set();
  const pointers = new Map();
  let gesture = null;

  ui.stage.classList.add('gota-stage');
  ui.stage.insertAdjacentHTML('beforeend', `
    <div class="gota-mode"><span></span> CAMPO ESCURO</div>
    <div class="gota-scale"><i></i><span>25 µm</span></div>
    <div class="gota-stage-label" hidden></div>
    <div class="gota-flash" aria-hidden="true"></div>
  `);
  ui.tools.insertAdjacentHTML('beforeend', `
    <div class="gota-optics">
      <div class="gota-field gota-zoom-field">
        <label for="gota-zoom">Ampliação <output id="gota-zoom-val" for="gota-zoom">40×</output></label>
        <div class="gota-zoom-buttons">
          <button type="button" id="gota-diminuir" aria-label="Diminuir ampliação">−</button>
          <input id="gota-zoom" type="range" min="0.72" max="3.6" step="0.01" value="1">
          <button type="button" id="gota-ampliar" aria-label="Aumentar ampliação">+</button>
        </div>
      </div>
      <div class="gota-field"><label for="gota-foco">Foco <output id="gota-foco-val" for="gota-foco">+8 µm</output></label><input id="gota-foco" type="range" min="-3.4" max="3.4" step="0.05" value="0.2"></div>
      <div class="gota-field"><label for="gota-luz">Luz <output id="gota-luz-val" for="gota-luz">110%</output></label><input id="gota-luz" type="range" min="0.26" max="1.65" step="0.01" value="1.1"></div>
    </div>
    <div class="gota-actions">
      <button type="button" id="gota-foto" data-primary><span aria-hidden="true">${cameraIcon()}</span> Fotografar</button>
      <button type="button" id="gota-alimento" aria-pressed="false"><span aria-hidden="true">${foodIcon()}</span> Alimento</button>
    </div>
    <details class="gota-catalog">
      <summary id="gota-catalogo">Organismos <output id="gota-descobertos">0 / 5</output></summary>
      <p>Localize as amostras para identificar as cinco formas.</p>
      <div id="gota-amostras"></div>
    </details>
    <article class="gota-reading" hidden>
      <p id="gota-forma"></p><h3 id="gota-organismo"></h3><p id="gota-nota"></p>
      <button type="button" id="gota-seguir" aria-pressed="false">Acompanhar</button>
    </article>
    <details class="gota-extra">
      <summary>Posição da lâmina</summary>
      <div class="gota-move">
        <button type="button" data-move="-1,0" aria-label="Deslocar à esquerda">←</button>
        <button type="button" data-move="1,0" aria-label="Deslocar à direita">→</button>
        <button type="button" data-move="0,1" aria-label="Deslocar para cima">↑</button>
        <button type="button" data-move="0,-1" aria-label="Deslocar para baixo">↓</button>
        <button type="button" id="gota-centro">Centralizar campo</button>
      </div>
      <div class="gota-field gota-angle"><label for="gota-inclinacao">Inclinação <output id="gota-inclinacao-val" for="gota-inclinacao">0°</output></label><input id="gota-inclinacao" type="range" min="-0.31" max="0.31" step="0.01" value="0.018"></div>
      <p>Escala ilustrativa. O movimento e a alimentação são modelos simplificados.</p>
    </details>
  `);

  const query = (selector) => ui.tools.querySelector(selector);
  const zoomInput = query('#gota-zoom');
  const focusInput = query('#gota-foco');
  const lightInput = query('#gota-luz');
  const scaleRule = ui.stage.querySelector('.gota-scale i');
  const scaleLabel = ui.stage.querySelector('.gota-scale span');
  const stageLabel = ui.stage.querySelector('.gota-stage-label');
  const flash = ui.stage.querySelector('.gota-flash');
  const catalog = query('.gota-catalog');
  const feedingButton = query('#gota-alimento');
  const followButton = query('#gota-seguir');
  const samples = query('#gota-amostras');
  const sampleButtons = specimens.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.specimen = index;
    button.textContent = `Localizar amostra ${index + 1}`;
    samples.append(button);
    return button;
  });

  function on(target, event, handler, options = {}) {
    target.addEventListener(event, handler, {signal, ...options});
  }

  function refresh() {
    zoomInput.value = view.zoom;
    focusInput.value = view.focus;
    lightInput.value = view.light;
    query('#gota-zoom-val').textContent = `${format.format(Math.round(view.zoom * 40))}×`;
    const depth = Math.round(view.focus * 40);
    query('#gota-foco-val').textContent = `${depth > 0 ? '+' : ''}${format.format(depth)} µm`;
    query('#gota-luz-val').textContent = `${Math.round(view.light * 100)}%`;
    query('#gota-inclinacao').value = view.tiltX;
    query('#gota-inclinacao-val').textContent = `${Math.round(Math.atan(view.tiltX * 22 / 24) * 180 / Math.PI)}°`;
    query('#gota-diminuir').disabled = view.zoom <= Number(zoomInput.min);
    query('#gota-ampliar').disabled = view.zoom >= Number(zoomInput.max);
    query('#gota-descobertos').textContent = `${discovered.size} / ${specimens.length}`;
    feedingButton.setAttribute('aria-pressed', String(feeding));
    followButton.setAttribute('aria-pressed', String(tracking));
    followButton.textContent = tracking ? 'Parar de acompanhar' : 'Acompanhar';
    canvas.classList.toggle('gota-feeding', feeding);
    ui.stage.classList.toggle('gota-is-tracking', tracking);
    stageLabel.hidden = current === null;
    stageLabel.textContent = current === null ? '' : specimens[current].name;
    const reading = query('.gota-reading');
    reading.hidden = current === null;
    if (current !== null) {
      const specimen = specimens[current];
      query('#gota-forma').textContent = specimen.form;
      query('#gota-organismo').textContent = specimen.name;
      query('#gota-nota').textContent = specimen.detail;
    }
    sampleButtons.forEach((button, index) => {
      button.textContent = discovered.has(index) ? `✓ ${specimens[index].name}` : `Localizar amostra ${index + 1}`;
      button.setAttribute('aria-pressed', String(index === current));
    });
  }

  function keepInSlide() {
    const distance = Math.hypot(view.x, view.y);
    if (distance <= radius - .55) return;
    view.x *= (radius - .55) / distance;
    view.y *= (radius - .55) / distance;
  }

  function pan(x, y) {
    if (tracking) {
      tracking = false;
      refresh();
    }
    view.x += x;
    view.y += y;
    keepInSlide();
  }

  function render() {
    optics.render(simulation, view, clamp(accumulator / step, 0, 1));
    const units = optics.unitsPerPixel();
    if (units !== scaleUnits) {
      scaleUnits = units;
      const length = [100, 50, 25, 10, 5, 2].find((size) => size / 40 / units <= 94) ?? 2;
      scaleRule.style.width = `${length / 40 / units}px`;
      scaleLabel.textContent = `${length} µm`;
    }
  }

  function setZoom(value, around) {
    const next = clamp(value, Number(zoomInput.min), Number(zoomInput.max));
    const ratio = next / view.zoom;
    if (around && !tracking) {
      view.x += (around.x - view.x) * (1 - 1 / ratio);
      view.y += (around.y - view.y) * (1 - 1 / ratio);
      keepInSlide();
    }
    view.zoom = next;
    refresh();
    render();
  }

  function identify(index, recenter) {
    if (index === null) {
      ui.setStatus('Selecione um organismo ou localize uma amostra pelo catálogo.');
      return;
    }
    const agent = simulation.agents[index];
    const wasKnown = discovered.has(index);
    discovered.add(index);
    current = index;
    view.focus = clamp(agent.z, -3.4, 3.4);
    if (recenter || tracking) {
      view.x = agent.x;
      view.y = agent.y;
    }
    catalog.open = false;
    ui.setStatus(discovered.size === specimens.length ? 'Catálogo completo. Cinco formas identificadas.' : wasKnown ? `${agent.name} em observação.` : `${agent.name} identificado. ${discovered.size} de ${specimens.length} no catálogo.`);
    ui.sound({frequency: 350 + index * 44, end: 545 + index * 44, duration: .25, volume: .095});
    refresh();
    render();
  }

  function photo() {
    render();
    if (!ui.capture(canvas, `universo-de-uma-gota-${String(shotCount + 1).padStart(2, '0')}.png`)) return;
    shotCount++;
    ui.setStatus(`Foto ${String(shotCount).padStart(2, '0')} registrada em PNG.`);
    if (!motion.matches) flash.animate([{opacity: .38}, {opacity: 0}], {duration: 250});
    ui.sound({frequency: 584, end: 390, duration: .10, volume: .10, type: 'triangle'});
  }

  function switchFood() {
    feeding = !feeding;
    if (feeding) tracking = false;
    ui.setHint(feeding ? 'Toque perto de um ciliado ou de uma ameba para soltar o alimento.' : 'Arraste a lâmina · Toque em um organismo');
    refresh();
  }

  function addFood(world) {
    if (!world || !simulation.dropFood(world.x, world.y)) {
      ui.setStatus('Deposite o alimento dentro da gota ou espere uma porção se dispersar.');
      return;
    }
    ui.setStatus('Alimento suspenso. Observe a reação do ciliado ou da ameba.');
    ui.sound({frequency: 225, end: 355, duration: .19, volume: .10});
    switchFood();
    render();
  }

  function center() {
    tracking = false;
    view.x = 0;
    view.y = 0;
    view.tiltX = 0.018;
    view.tiltY = -0.024;
    refresh();
    render();
  }

  function reset() {
    previous = 0;
    accumulator = 0;
    simulation = createSimulation();
    view = defaultView();
    current = null;
    feeding = false;
    tracking = false;
    shotCount = 0;
    catalog.open = false;
    discovered.clear();
    ui.setHint('Arraste a lâmina · Toque em um organismo');
    ui.setStatus('Lâmina pronta para observar.');
    refresh();
    render();
  }

  on(query('#gota-diminuir'), 'click', () => setZoom(view.zoom / 1.30));
  on(query('#gota-ampliar'), 'click', () => setZoom(view.zoom * 1.30));
  on(zoomInput, 'input', () => setZoom(Number(zoomInput.value)));
  on(focusInput, 'input', () => { view.focus = Number(focusInput.value); refresh(); render(); });
  on(lightInput, 'input', () => { view.light = Number(lightInput.value); refresh(); render(); });
  on(query('#gota-inclinacao'), 'input', (event) => { view.tiltX = Number(event.target.value); refresh(); render(); });
  on(query('#gota-foto'), 'click', photo);
  on(feedingButton, 'click', switchFood);
  on(query('#gota-centro'), 'click', center);
  for (const button of query('.gota-move').querySelectorAll('[data-move]')) {
    const [x, y] = button.dataset.move.split(',').map(Number);
    on(button, 'click', () => { pan(x / view.zoom, y / view.zoom); render(); });
  }
  for (const [index, button] of sampleButtons.entries()) {
    on(button, 'click', () => { identify(index, true); canvas.focus({preventScroll: true}); });
  }
  on(followButton, 'click', () => {
    if (current === null) return;
    tracking = !tracking;
    if (tracking && feeding) switchFood();
    refresh();
  });
  on(motion, 'change', () => { view.reduced = motion.matches; });

  function pointerData(event) { return {x: event.clientX, y: event.clientY}; }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function midpoint(a, b) { return {x: (a.x + b.x) * .5, y: (a.y + b.y) * .5}; }

  on(canvas, 'pointerdown', (event) => {
    if (paused || catalog.open || event.button !== 0 || pointers.size === 2) return;
    const point = pointerData(event);
    pointers.set(event.pointerId, point);
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 1) {
      gesture = {from: point, moved: false, tilt: event.altKey};
    } else {
      gesture.moved = true;
    }
    canvas.classList.add('gota-dragging');
  });

  on(canvas, 'pointermove', (event) => {
    if (!pointers.has(event.pointerId) || paused || catalog.open) return;
    const point = pointerData(event);
    const start = pointers.get(event.pointerId);
    if (pointers.size === 2) {
      const other = [...pointers].find(([id]) => id !== event.pointerId)[1];
      const oldCenter = midpoint(start, other);
      const nextCenter = midpoint(point, other);
      const scale = optics.unitsPerPixel();
      pan((oldCenter.x - nextCenter.x) * scale, (nextCenter.y - oldCenter.y) * scale);
      const world = optics.worldAt(nextCenter.x, nextCenter.y);
      setZoom(view.zoom * distance(other, point) / Math.max(distance(other, start), 1), world);
    } else if (gesture.moved || distance(gesture.from, point) > 6) {
      const last = gesture.moved ? start : gesture.from;
      gesture.moved = true;
      if (gesture.tilt) {
        view.tiltX = clamp(view.tiltX - (point.x - last.x) * .002, -.31, .31);
        view.tiltY = clamp(view.tiltY + (point.y - last.y) * .002, -.31, .31);
        refresh();
      } else {
        const scale = optics.unitsPerPixel();
        pan((last.x - point.x) * scale, (point.y - last.y) * scale);
      }
      render();
    }
    pointers.set(event.pointerId, point);
  });

  function finishGesture(event) {
    if (!pointers.delete(event.pointerId) || pointers.size > 0) return;
    canvas.classList.remove('gota-dragging');
    const shouldSelect = event.type === 'pointerup' && gesture && !gesture.moved && !paused && !catalog.open;
    gesture = null;
    if (!shouldSelect) return;
    if (feeding) {
      addFood(optics.worldAt(event.clientX, event.clientY));
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    identify(optics.targetAt(event.clientX - bounds.left, event.clientY - bounds.top), false);
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) on(canvas, type, finishGesture);
  on(canvas, 'wheel', (event) => {
    if (paused || catalog.open) return;
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode ? 15 : 1);
    setZoom(view.zoom * Math.exp(-clamp(delta, -170, 170) * .0028), optics.worldAt(event.clientX, event.clientY));
  }, {passive: false});

  const keys = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1]};
  on(canvas, 'keydown', (event) => {
    if (paused || catalog.open || event.metaKey || event.ctrlKey) return;
    if (event.key in keys) {
      event.preventDefault();
      const [x, y] = keys[event.key];
      if (event.altKey) {
        view.tiltX = clamp(view.tiltX + x * .06, -.31, .31);
        view.tiltY = clamp(view.tiltY + y * .06, -.31, .31);
        refresh();
      } else {
        pan(x * .58 / view.zoom, y * .58 / view.zoom);
      }
      render();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom(view.zoom * 1.30);
    } else if (event.key === '-') {
      event.preventDefault();
      setZoom(view.zoom / 1.30);
    } else if (event.key === 'Enter' && !event.repeat) {
      const bounds = canvas.getBoundingClientRect();
      if (feeding) addFood({x: view.x, y: view.y});
      else identify(optics.targetAt(bounds.width * .5, bounds.height * .5), false);
    }
  });

  function tick(now) {
    if (paused || signal.aborted) return;
    const delta = previous ? Math.min(.1, (now - previous) / 1000) : 0;
    previous = now;
    accumulator += delta * (view.reduced ? .42 : 1);
    let iterations = 0;
    while (accumulator >= step && iterations++ < 6) {
      const eaten = simulation.update();
      if (eaten) {
        ui.setStatus(`${eaten.name} encontrou o alimento. Observe a mudança de trajetória.`);
        ui.sound({frequency: 285, end: 392, duration: .28, volume: .085});
      }
      accumulator -= step;
    }
    if (tracking && current !== null) {
      const agent = simulation.agents[current];
      const follow = view.reduced ? 1 : 1 - Math.exp(-delta * 5);
      view.x += (agent.x - view.x) * follow;
      view.y += (agent.y - view.y) * follow;
    }
    render();
    frame = requestAnimationFrame(tick);
  }

  const resize = new ResizeObserver(() => render());
  resize.observe(ui.stage);
  ui.setStatus('Lâmina pronta para observar.');
  refresh();
  ui.bind({
    pause(value) {
      paused = value;
      previous = 0;
      cancelAnimationFrame(frame);
      if (paused) {
        pointers.clear();
        gesture = null;
        canvas.classList.remove('gota-dragging');
      } else {
        frame = requestAnimationFrame(tick);
      }
    },
    reset,
    quality(value) { optics.quality(value); render(); },
    dispose() {
      lifecycle.abort();
      cancelAnimationFrame(frame);
      resize.disconnect();
      optics.dispose();
    },
  });
}

function cameraIcon() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 7h5l2-3h4l2 3h5v13H3Z" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4"/></svg>';
}

function foodIcon() {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3c2.5 4.4 6 7.9 6 12a6 6 0 1 1-12 0c0-4.1 3.5-7.6 6-12Z"/><path d="M12 11v7m-3.5-3.5h7"/></svg>';
}
