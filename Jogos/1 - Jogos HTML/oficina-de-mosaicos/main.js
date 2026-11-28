import { workbench } from '../../../Sistema/shared/sangi-workbench.js';
import { SIDE, STORAGE_KEY, colors, shapes, grouts, presets, normalizeAngle, makeBoard, readBoard, editBoard } from './model.js';
import { createScene } from './scene.js';

const hints = {
  place: 'Toque num espaço livre ou arraste para assentar várias peças.',
  paint: 'Toque numa peça para esmaltá-la com a cor escolhida.',
  rotate: 'Toque numa peça para girá-la 45°.',
  cut: 'Toque numa peça para dividi-la em dois fragmentos.',
  grout: 'Toque ou arraste para preencher espaços e juntas.',
  erase: 'Toque numa peça para removê-la da argamassa.',
};

const guideSteps = [
  { title: 'Assentar', tool: 'place', action: 'Assentar peça', hint: 'Escolha uma cor e assente uma peça no espaço destacado.' },
  { title: 'Girar', tool: 'rotate', action: 'Girar peça 45°', hint: 'Gire a mesma peça e observe como ela ocupa o espaço.' },
  { title: 'Rejuntar', tool: 'grout', action: 'Aplicar rejunte', hint: 'Escolha a cor do rejunte e preencha a junta da peça.' },
  { title: 'Revisar', action: 'Concluir guia', hint: 'Observe o acabamento de lado. Arraste para mudar o ângulo.' },
];

const ui = workbench({
  title: 'Oficina de Mosaicos',
  subtitle: 'Ateliês artísticos',
  hint: 'Escolha um padrão ou componha livremente. Na vista superior, toque ou arraste para editar. Na órbita, arraste e belisque para aproximar. Pelo teclado, use as setas e Enter no painel. Q e E giram a próxima peça, e Ctrl+Z desfaz.',
  toolsLabel: 'Bancada',
});

try {
  initialize(createScene(ui.stage));
} catch (error) {
  console.error(error);
  const message = document.createElement('p');
  message.className = 'mosaic-fallback';
  message.textContent = 'Não foi possível iniciar a bancada 3D. Recarregue a página ou volte ao catálogo.';
  ui.stage.replaceChildren(message);
  ui.setStatus('Visualização 3D indisponível.');
}

function initialize(view) {
  const tools = {
    place: 'Peça',
    paint: 'Pintar',
    rotate: 'Girar',
    cut: 'Cortar',
    grout: 'Rejunte',
    erase: 'Retirar',
  };
  const options = (entries) => Object.entries(entries).map(([key, value]) =>
    `<option value="${key}">${typeof value === 'string' ? value : value.name}</option>`).join('');
  ui.tools.innerHTML = `
    <div class="mosaic-tools">
      <section class="mosaic-guide" aria-label="Guia da primeira peça">
        <button type="button" id="mosaic-guide-start">Começar guia</button>
        <div id="mosaic-guide-panel" hidden>
          <p id="mosaic-guide-instruction" aria-live="polite"></p>
          <div class="mosaic-group">
            <button type="button" id="mosaic-guide-action" aria-describedby="mosaic-guide-instruction"></button>
            <button type="button" id="mosaic-guide-exit">Sair do guia</button>
          </div>
        </div>
      </section>
      <div class="mosaic-group mosaic-pattern">
        <label for="mosaic-preset">Padrão</label>
        <select id="mosaic-preset">${options(presets)}</select>
      </div>
      <div class="mosaic-group mosaic-modes" role="group" aria-label="Ferramentas do mosaico">
        ${Object.entries(tools).map(([key, label]) => `<button type="button" data-mosaic-tool="${key}" aria-pressed="false">${label}</button>`).join('')}
      </div>
      <div class="mosaic-group mosaic-palette" role="group" aria-label="Cores de cerâmica">
        ${Object.entries(colors).map(([key, {name, hex}]) =>
          `<button type="button" class="mosaic-swatch" data-mosaic-color="${key}" aria-label="${name}" aria-pressed="false" title="${name}"><span aria-hidden="true" style="background:${hex}"></span></button>`).join('')}
      </div>
      <div class="mosaic-group mosaic-shape">
        <label for="mosaic-shape">Forma</label>
        <select id="mosaic-shape">${options(shapes)}</select>
      </div>
      <div class="mosaic-group mosaic-joints" hidden>
        <label for="mosaic-grout">Cor do rejunte</label>
        <select id="mosaic-grout">${options(grouts)}</select>
        <button type="button" id="mosaic-grout-all">Preencher tudo</button>
      </div>
      <div class="mosaic-group mosaic-history" role="group" aria-label="Histórico">
        <button type="button" id="mosaic-undo">↶ Desfazer</button>
        <button type="button" id="mosaic-redo">↷ Refazer</button>
      </div>
      <div class="mosaic-group mosaic-camera" role="group" aria-label="Vista da obra">
        <button type="button" id="mosaic-orbit" aria-pressed="false">Órbita</button>
        <button type="button" id="mosaic-out" aria-label="Afastar">−</button>
        <button type="button" id="mosaic-in" aria-label="Aproximar">+</button>
      </div>
      <details class="mosaic-more" id="mosaic-more">
        <summary>Opções da peça e arquivos</summary>
        <div>
          <button type="button" id="mosaic-brush-turn">Giro da peça 0°</button>
          <button type="button" id="mosaic-brush-cut" aria-pressed="false">Pré-corte</button>
        </div>
        <div>
          <button type="button" id="mosaic-export">Exportar JSON</button>
          <button type="button" id="mosaic-import">Importar JSON</button>
          <button type="button" id="mosaic-png">Salvar PNG</button>
          <input type="file" id="mosaic-file" accept=".json,application/json" hidden>
        </div>
      </details>
    </div>
  `;
  const get = (id) => ui.tools.querySelector(id);
  const guideStart = get('#mosaic-guide-start');
  const guidePanel = get('#mosaic-guide-panel');
  const guideInstruction = get('#mosaic-guide-instruction');
  const guideAction = get('#mosaic-guide-action');
  const toolButtons = [...ui.tools.querySelectorAll('[data-mosaic-tool]')];
  const swatches = [...ui.tools.querySelectorAll('[data-mosaic-color]')];
  const pattern = get('#mosaic-preset');
  const undoButton = get('#mosaic-undo');
  const redoButton = get('#mosaic-redo');
  const orbitButton = get('#mosaic-orbit');
  const groutSelect = get('#mosaic-grout');
  const groutGroup = get('.mosaic-joints');
  const groutAll = get('#mosaic-grout-all');
  const colorsGroup = get('.mosaic-palette');
  const shapeGroup = get('.mosaic-shape');
  const shapeSelect = get('#mosaic-shape');
  const turnButton = get('#mosaic-brush-turn');
  const cutButton = get('#mosaic-brush-cut');
  const file = get('#mosaic-file');
  const brush = { color: 'cobalto', shape: 'quadrado', angle: 0, cut: false, grout: 'areia' };
  const undo = [];
  const redo = [];
  const controller = new AbortController();
  const ongoing = new Map();
  const cleared = new Set();
  let board = makeBoard();
  let tool = 'place';
  let hover = null;
  let focusedCell = Math.floor(SIDE * SIDE / 2);
  let orbiting = false;
  let paused = false;
  let beforeGesture = null;
  let lastSound = -1000;
  let storageBlocked = false;
  let restored = false;
  let guide = null;
  try {
    const previous = localStorage.getItem(STORAGE_KEY);
    if (previous) {
      board = readBoard(previous);
      restored = true;
    }
  } catch {
    // A missing or invalid saved board leaves the starting pattern available.
  }
  brush.grout = board.grout;

  function listen(element, event, fn, options = {}) {
    element.addEventListener(event, fn, { ...options, signal: controller.signal });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    } catch {
      if (!storageBlocked) ui.setStatus('Salvamento local indisponível. Use Exportar JSON para guardar a obra.');
      storageBlocked = true;
    }
  }

  function refreshPreview() {
    view.preview(hover, brush, tool, hover !== null && Boolean(board.tiles[hover]));
  }

  function refreshControls() {
    pattern.value = board.preset;
    undoButton.disabled = !undo.length;
    redoButton.disabled = !redo.length;
    orbitButton.setAttribute('aria-pressed', String(orbiting));
    orbitButton.textContent = orbiting ? 'Vista superior' : 'Órbita';
    for (const button of toolButtons) button.setAttribute('aria-pressed', String(button.dataset.mosaicTool === tool));
    for (const button of swatches) button.setAttribute('aria-pressed', String(button.dataset.mosaicColor === brush.color));
    turnButton.textContent = `Giro da peça ${brush.angle}°`;
    cutButton.setAttribute('aria-pressed', String(brush.cut));
    shapeSelect.value = brush.shape;
    groutSelect.value = brush.grout;
    colorsGroup.hidden = tool === 'grout';
    shapeGroup.hidden = tool === 'grout';
    groutGroup.hidden = tool !== 'grout';
    groutAll.disabled = guide !== null;
  }

  function refresh() {
    view.update(board);
    refreshControls();
    refreshPreview();
  }

  function noteEdit(old) {
    undo.push(old);
    if (undo.length > 45) undo.shift();
    redo.length = 0;
    refreshControls();
    save();
  }

  function endGesture() {
    if (beforeGesture) noteEdit(beforeGesture);
    beforeGesture = null;
    cleared.clear();
    if (guide?.advanceOnRelease) advanceGuide();
  }

  function apply(index, continuous = false) {
    if (index === null || orbiting || paused || (continuous && cleared.has(index))) return;
    if (guide && (index !== guide.cell || tool !== guideSteps[guide.step].tool)) {
      ui.setStatus('Use a ferramenta do guia no espaço destacado ou saia para editar livremente.');
      return;
    }
    const before = beforeGesture || structuredClone(board);
    const result = editBoard(board, index, tool, brush);
    const notes = {
      overlap: 'Espaço ocupado. Retire ou pinte a peça existente.',
      empty: 'Sem peça nesse espaço.',
      same: { grout: 'Espaço já rejuntado.', cut: 'Esta peça já está cortada.', paint: 'Este esmalte já foi aplicado.' }[tool],
      changed: {
        place: `Peça assentada · ${colors[brush.color].name}`,
        paint: `Esmalte aplicado · ${colors[brush.color].name}`,
        rotate: `Peça girada · ${board.tiles[index]?.angle}°`,
        cut: 'Peça dividida em dois fragmentos.',
        grout: `Rejunte aplicado · ${grouts[brush.grout].name}`,
        erase: 'Peça retirada.',
      }[tool],
    };
    if (continuous) cleared.add(index);
    ui.setStatus(notes[result] || 'A obra já está assim.');
    if (result !== 'changed') {
      if (result === 'overlap' && performance.now() - lastSound > 90) {
        ui.sound({ frequency: 184, end: 121, duration: .09, volume: .08, type: 'triangle' });
        lastSound = performance.now();
      }
      return;
    }
    if (continuous) beforeGesture = before;
    else noteEdit(before);
    view.update(board);
    refreshPreview();
    if (performance.now() - lastSound > 62) {
      const frequency = { grout: 173, cut: 1210, rotate: 507, erase: 603, place: 831, paint: 426 }[tool];
      ui.sound({ frequency, end: frequency * .67, duration: tool === 'grout' ? .19 : .075, volume: .09, type: 'triangle' });
      lastSound = performance.now();
    }
    if (guide) {
      if (continuous) guide.advanceOnRelease = true;
      else advanceGuide();
    }
  }

  function load(newBoard, message) {
    endGesture();
    closeGuide();
    const previous = board;
    board = newBoard;
    brush.grout = board.grout;
    noteEdit(previous);
    refresh();
    ui.setStatus(message);
  }

  function traverseHistory(backward) {
    endGesture();
    const source = backward ? undo : redo;
    const destination = backward ? redo : undo;
    if (!source.length) return;
    closeGuide();
    destination.push(board);
    board = source.pop();
    brush.grout = board.grout;
    refresh();
    save();
    ui.setStatus(backward ? 'Alteração desfeita.' : 'Alteração refeita.');
  }

  function setOrbit(on) {
    orbiting = on;
    view.setOrbit(on);
    ui.setHint(on ? 'Arraste para orbitar. Use a pinça ou os botões para aproximar.' : hints[tool]);
    refreshControls();
    refreshPreview();
  }

  function setTool(next) {
    tool = next;
    if (orbiting) setOrbit(false);
    ui.setHint(hints[tool]);
    ui.setStatus(`${tools[tool]} selecionado.`);
    refreshControls();
    refreshPreview();
  }

  function turn(amount) {
    brush.angle = normalizeAngle(brush.angle + amount);
    refreshControls();
    refreshPreview();
    ui.setStatus(`Giro da próxima peça · ${brush.angle}°`);
  }

  function showGuideStep() {
    const step = guideSteps[guide.step];
    const row = Math.floor(guide.cell / SIDE) + 1;
    const column = guide.cell % SIDE + 1;
    guideInstruction.textContent = `${guide.step + 1} de ${guideSteps.length} · ${step.title}. ${step.hint}${step.tool ? ` Linha ${row}, coluna ${column}.` : ''}`;
    guideAction.textContent = step.action;
    if (step.tool) {
      setTool(step.tool);
      view.guideTarget(guide.cell);
      focusedCell = guide.cell;
    } else {
      view.guideTarget(null);
      setOrbit(true);
    }
    ui.setStatus(step.title);
  }

  function advanceGuide() {
    guide.advanceOnRelease = false;
    guide.step++;
    showGuideStep();
  }

  function closeGuide(restoreFocus = false) {
    if (!guide) return;
    const { previousTool, previousOrbit } = guide;
    guide = null;
    guidePanel.hidden = true;
    guideStart.hidden = false;
    view.guideTarget(null);
    setOrbit(false);
    setTool(previousTool);
    if (previousOrbit) setOrbit(true);
    if (restoreFocus) guideStart.focus({ preventScroll: true });
  }

  listen(guideStart, 'click', () => {
    if (paused || ongoing.size) return;
    const center = (SIDE - 1) / 2;
    let distance = Infinity;
    let cell = null;
    for (const [index, tile] of board.tiles.entries()) {
      if (tile || board.filled[index]) continue;
      const offset = Math.abs(index % SIDE - center) + Math.abs(Math.floor(index / SIDE) - center);
      if (offset >= distance) continue;
      distance = offset;
      cell = index;
    }
    if (cell === null) {
      ui.setStatus('O guia precisa de um espaço vazio sem rejunte. Escolha um novo padrão ou continue na bancada livre.');
      return;
    }
    guide = { cell, step: 0, previousTool: tool, previousOrbit: orbiting, advanceOnRelease: false };
    guideStart.hidden = true;
    guidePanel.hidden = false;
    setOrbit(false);
    showGuideStep();
    guideAction.focus({ preventScroll: true });
  });
  listen(guideAction, 'click', () => {
    if (!guide || paused || ongoing.size) return;
    const step = guideSteps[guide.step];
    if (step.tool) {
      if (tool !== step.tool || orbiting) setTool(step.tool);
      apply(guide.cell);
    } else {
      closeGuide(true);
      ui.setStatus('Primeira peça concluída. Continue na bancada livre.');
    }
  });
  listen(get('#mosaic-guide-exit'), 'click', () => {
    closeGuide(true);
    ui.setStatus('Guia encerrado. Suas alterações continuam na bancada.');
  });

  for (const button of toolButtons) listen(button, 'click', () => setTool(button.dataset.mosaicTool));
  for (const button of swatches) listen(button, 'click', () => {
    brush.color = button.dataset.mosaicColor;
    if (tool !== 'place' && tool !== 'paint') setTool('place');
    refreshControls();
    refreshPreview();
    ui.setStatus(`Esmalte ${colors[brush.color].name} selecionado.`);
  });
  listen(shapeSelect, 'change', () => {
    brush.shape = shapeSelect.value;
    setTool('place');
    ui.setStatus(`${shapes[brush.shape].name} selecionado.`);
  });
  listen(groutSelect, 'change', () => {
    brush.grout = groutSelect.value;
    ui.setStatus(`Rejunte ${grouts[brush.grout].name} selecionado.`);
  });
  listen(pattern, 'change', () => {
    load(makeBoard(pattern.value), `${presets[pattern.value]} na bancada.`);
    setTool('place');
  });
  listen(turnButton, 'click', () => turn(45));
  listen(cutButton, 'click', () => {
    brush.cut = !brush.cut;
    setTool('place');
    ui.setStatus(brush.cut ? 'A próxima peça chegará cortada.' : 'A próxima peça chegará inteira.');
  });
  listen(undoButton, 'click', () => traverseHistory(true));
  listen(redoButton, 'click', () => traverseHistory(false));
  listen(orbitButton, 'click', () => setOrbit(!orbiting));
  listen(get('#mosaic-out'), 'click', () => view.zoomBy(1 / 1.2));
  listen(get('#mosaic-in'), 'click', () => view.zoomBy(1.2));
  listen(groutAll, 'click', () => {
    if (board.grout === brush.grout && board.filled.every(Boolean)) {
      ui.setStatus('Toda a base já está rejuntada.');
      return;
    }
    load({ ...structuredClone(board), grout: brush.grout, filled: Array(board.tiles.length).fill(true) }, 'Juntas e espaços vazios preenchidos.');
    ui.sound({ frequency: 231, end: 135, duration: .23, volume: .12, type: 'triangle' });
  });
  listen(get('#mosaic-export'), 'click', () => {
    ui.download('oficina-de-mosaicos.json', board);
    ui.setStatus('Arquivo da obra preparado para exportação.');
  });
  listen(get('#mosaic-import'), 'click', () => file.click());
  listen(file, 'change', async () => {
    const selected = file.files[0];
    file.value = '';
    if (!selected) return;
    try {
      if (selected.size > 1_000_000) throw new Error('Arquivo excede o tamanho esperado.');
      const data = readBoard(await selected.text());
      if (!controller.signal.aborted) load(data, 'Obra importada.');
    } catch {
      if (!controller.signal.aborted) ui.setStatus('Arquivo inválido. Escolha um JSON exportado pela oficina.');
    }
  });
  listen(get('#mosaic-png'), 'click', () => {
    view.preview(null, brush, tool, false);
    view.guideTarget(null);
    view.renderNow();
    if (ui.capture(view.canvas, 'oficina-de-mosaicos.png')) ui.setStatus('Imagem da bancada preparada para exportação.');
    if (guide && guideSteps[guide.step].tool) view.guideTarget(guide.cell);
    refreshPreview();
  });

  const { canvas } = view;
  const pointer = (event) => ({ x: event.clientX, y: event.clientY, index: view.cellAt(event.clientX, event.clientY) });
  const distance = ([a, b]) => Math.hypot(a.x - b.x, a.y - b.y);
  const surfaceTools = new Set(['place', 'paint', 'grout', 'erase']);

  listen(canvas, 'pointerdown', (event) => {
    if (paused || event.button !== 0 || (!orbiting && ongoing.size) || ongoing.size >= 2) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    const point = pointer(event);
    ongoing.set(event.pointerId, point);
    if (orbiting) return;
    hover = point.index;
    if (hover !== null) focusedCell = hover;
    refreshPreview();
    apply(hover, true);
  });

  listen(canvas, 'pointermove', (event) => {
    if (paused) return;
    const point = pointer(event);
    const prior = ongoing.get(event.pointerId);
    if (orbiting) {
      if (!prior) return;
      const previousDistance = ongoing.size === 2 ? distance([...ongoing.values()]) : 0;
      ongoing.set(event.pointerId, point);
      if (ongoing.size === 2) {
        if (previousDistance > 3) view.zoomBy(Math.max(.8, Math.min(1.25, distance([...ongoing.values()]) / previousDistance)));
      } else view.moveOrbit(point.x - prior.x, point.y - prior.y);
      return;
    }
    hover = point.index;
    refreshPreview();
    if (!prior || !surfaceTools.has(tool) || point.index === prior.index) return;
    if (point.index !== null) focusedCell = point.index;
    ongoing.set(event.pointerId, point);
    if (prior.index === null || point.index === null) {
      apply(point.index, true);
      return;
    }
    const fromX = prior.index % SIDE;
    const fromY = Math.floor(prior.index / SIDE);
    const dx = point.index % SIDE - fromX;
    const dy = Math.floor(point.index / SIDE) - fromY;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    for (let step = 1; step <= steps; step++) {
      const index = (fromY + Math.round(dy * step / steps)) * SIDE + fromX + Math.round(dx * step / steps);
      apply(index, true);
    }
  });

  function release(event) {
    if (!ongoing.delete(event.pointerId)) return;
    if (!ongoing.size) endGesture();
    if (event.pointerType !== 'mouse') {
      hover = null;
      refreshPreview();
    }
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(canvas, type, release);
  listen(canvas, 'pointerleave', () => {
    if (ongoing.size) return;
    hover = null;
    refreshPreview();
  });
  listen(canvas, 'wheel', (event) => {
    if (!orbiting || paused) return;
    event.preventDefault();
    view.zoomBy(Math.exp(-event.deltaY * .001));
  }, { passive: false });
  listen(canvas, 'focus', () => {
    hover = focusedCell;
    refreshPreview();
  });
  listen(canvas, 'blur', () => {
    hover = null;
    refreshPreview();
  });
  listen(canvas, 'keydown', (event) => {
    if (paused) return;
    const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      if (orbiting) view.moveOrbit(move[0] * 15, move[1] * 15);
      else {
        const x = Math.max(0, Math.min(SIDE - 1, focusedCell % SIDE + move[0]));
        const y = Math.max(0, Math.min(SIDE - 1, Math.floor(focusedCell / SIDE) + move[1]));
        focusedCell = y * SIDE + x;
        hover = focusedCell;
        refreshPreview();
        const tile = board.tiles[focusedCell];
        const material = tile ? `${colors[tile.color].name}, ${tile.angle}°` : board.filled[focusedCell] ? 'rejuntado' : 'vazio';
        ui.setStatus(`Linha ${y + 1}, coluna ${x + 1} · ${material}`);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      hover = focusedCell;
      apply(focusedCell);
      refreshPreview();
    } else if (['q', 'e'].includes(event.key.toLowerCase()) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      turn(event.key.toLowerCase() === 'q' ? -45 : 45);
    }
  });
  listen(document, 'keydown', (event) => {
    if (paused || !(event.ctrlKey || event.metaKey) || !['z', 'y'].includes(event.key.toLowerCase())) return;
    if (event.target instanceof HTMLInputElement) return;
    event.preventDefault();
    traverseHistory(event.key.toLowerCase() === 'z' && !event.shiftKey);
  });
  listen(window, 'pagehide', endGesture);
  listen(canvas, 'mosaico-contexto-perdido', () => ui.setStatus('Renderização interrompida.'));
  listen(canvas, 'mosaico-contexto-restaurado', () => ui.setStatus('Renderização retomada.'));

  refresh();
  ui.setHint(hints[tool]);
  ui.setStatus(restored ? 'Sua peça foi restaurada.' : 'Complete o padrão ou escolha uma composição livre.');
  ui.bind({
    pause(pausing) {
      paused = pausing;
      if (paused) {
        endGesture();
        for (const id of ongoing.keys()) if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
        ongoing.clear();
      }
      view.suspend(pausing);
    },
    reset() {
      load(makeBoard(board.preset), 'Bancada reiniciada.');
      setOrbit(false);
    },
    quality: view.quality,
    dispose() {
      endGesture();
      controller.abort();
      view.dispose();
    },
  });
}
