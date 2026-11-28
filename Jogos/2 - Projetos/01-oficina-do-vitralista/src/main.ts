import './style.css';
import type { Quality } from './core/engine';
import { colors, createWorkshop, fullSolder, molds, type Color, type Mold } from './panel';
import { createScene, type Light } from './scene';
import { createSound } from './sound';

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const storageKey = 'oficina-do-vitralista-v1';
const moldSelect = byId<HTMLSelectElement>('mold');
const lightSelect = byId<HTMLSelectElement>('light');
const qualitySelect = byId<HTMLSelectElement>('quality');
const soundToggle = byId<HTMLInputElement>('sound');
const volumeInput = byId<HTMLInputElement>('volume');
const inspectButton = byId<HTMLButtonElement>('inspect');
const instruction = byId('instruction');
const accessButton = byId<HTMLButtonElement>('access');
const targetSelect = byId<HTMLSelectElement>('target');
const apply = byId<HTMLButtonElement>('apply');
const sceneContainer = byId('scene');
const loading = byId('loading');
type Tool = 'place' | 'solder' | 'color';
type SeamHit = { id: string; t: number };
const tips: Record<Tool, string> = {
  place: 'Escolha um vidro e toque em um vão do molde.',
  solder: 'Deslize o ferro sobre uma junta entre dois vidros.',
  color: 'Escolha uma cor e toque em uma peça encaixada.',
};

function restore(): Record<string, unknown> {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    return value && typeof value === 'object' ? value : {};
  } catch { return {}; }
}

const stored = restore();
const startingMold = molds.includes(stored.mold as Mold) ? stored.mold as Mold : 'roseta';
const workshop = createWorkshop(stored.jobs, startingMold);
const sound = createSound();
const colorKeys = Object.keys(colors) as Color[];
let color: Color = 'ambar';
let tool: Tool = 'place';
let inspected = false;
let hidden = false;
const lightOptions = ['morning', 'noon', 'dusk'];
const qualityOptions = ['alta', 'media', 'baixa'];
moldSelect.value = startingMold;
lightSelect.value = lightOptions.includes(stored.light as string) ? String(stored.light) : 'morning';
const selectedQuality = qualityOptions.includes(stored.quality as string) ? stored.quality as Quality : undefined;
qualitySelect.value = selectedQuality ?? 'media';
soundToggle.checked = stored.sound !== false;
volumeInput.value = typeof stored.volume === 'number' ? String(stored.volume) : '0.55';
sound.configure(Number(volumeInput.value), !soundToggle.checked);

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      mold: workshop.mold, jobs: workshop.snapshot(), light: lightSelect.value, quality: qualitySelect.value,
      sound: soundToggle.checked, volume: Number(volumeInput.value),
    }));
  } catch { /* A sessão continua quando o navegador bloqueia armazenamento. */ }
}

async function openWorkshop() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const view = await createScene(sceneContainer, selectedQuality, reduced);
  qualitySelect.value = view.quality;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    view.dispose();
    sound.dispose();
  };
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
  window.addEventListener('message', event => {
    if (event.source === window.parent && event.origin === location.origin && event.data?.type === 'SANGI_APP_DISPOSE') dispose();
  });
  view.setPanel(workshop.panel, workshop.work);
  view.setLight(lightSelect.value as Light, 0, false);
  const palette = byId('palette');
  const buttons: HTMLButtonElement[] = [];
  for (const key of colorKeys) {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.setProperty('--swatch', colors[key].glass);
    button.title = colors[key].name;
    button.setAttribute('aria-label', colors[key].name);
    const swatch = document.createElement('i');
    swatch.setAttribute('aria-hidden', 'true');
    button.append(swatch);
    button.addEventListener('click', () => selectColor(key));
    palette.append(button);
    buttons.push(button);
  }

  function selectColor(next: Color, audible = true) {
    color = next;
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(colorKeys[index] === color)));
    if (audible) sound.glass(false);
  }
  selectColor(color, false);

  function updateTargets() {
    const selected = targetSelect.value;
    const ids: string[] = [];
    if (tool === 'solder') {
      byId('target-label').textContent = 'Junta';
      workshop.panel.seams.forEach(seam => {
        if (workshop.canSolder(seam) && workshop.work.solder[seam.id] !== fullSolder) ids.push(seam.id);
      });
    } else {
      byId('target-label').textContent = tool === 'place' ? 'Vão' : 'Peça';
      workshop.panel.panes.forEach(pane => {
        if (Boolean(workshop.work.panes[pane.id]) === (tool === 'color')) ids.push(pane.id);
      });
    }
    targetSelect.replaceChildren(...ids.map(id => {
      const panes = workshop.panel.panes;
      const seams = workshop.panel.seams;
      const label = tool === 'solder' ? `Junta ${seams.findIndex(seam => seam.id === id) + 1}`
        : id === 'centro' ? 'Centro' : `Peça ${panes.findIndex(pane => pane.id === id) + 1}`;
      return new Option(label, id);
    }));
    if (ids.includes(selected)) targetSelect.value = selected;
    if (!ids.length) targetSelect.append(new Option('Nenhuma disponível', ''));
    targetSelect.disabled = !ids.length;
    apply.disabled = !ids.length;
    apply.textContent = { place: 'Encaixar vidro', color: 'Aplicar cor', solder: 'Soldar junta' }[tool];
  }

  const toolButtons = document.querySelectorAll<HTMLButtonElement>('[data-tool]');
  function selectTool(next: Tool) {
    tool = next;
    sceneContainer.dataset.action = next;
    toolButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tool === next)));
    view.setHighlight('');
    view.aimIron();
    instruction.textContent = tips[tool];
    updateTargets();
  }
  for (const button of toolButtons) button.addEventListener('click', () => selectTool(button.dataset.tool as Tool));
  selectTool(tool);

  function place(id: string) {
    const occupied = Boolean(workshop.work.panes[id]);
    if (occupied !== (tool === 'color')) return;
    if (!workshop.place(id, color)) return;
    view.updateWork(workshop.work, occupied ? undefined : id);
    sound.glass(true);
    save();
    updateTargets();
    const remaining = workshop.panel.panes.length - Object.keys(workshop.work.panes).length;
    instruction.textContent = occupied ? `Vidro trocado para ${colors[color].name.toLowerCase()}.`
      : remaining ? `Vidro encaixado · ${remaining} ${remaining === 1 ? 'vão livre' : 'vãos livres'}.`
        : 'Molde preenchido. Use o ferro nas juntas ou erga o vitral contra a luz.';
  }

  function solder(hit: SeamHit, from: number) {
    const changed = workshop.solder(hit.id, from, hit.t);
    view.aimIron(hit, true);
    sound.solder();
    if (!changed) return;
    view.updateWork(workshop.work, undefined, hit.id);
    save();
    if (workshop.work.solder[hit.id] !== fullSolder) return;
    updateTargets();
    const done = workshop.panel.seams.every(seam => workshop.work.solder[seam.id] === fullSolder);
    instruction.textContent = done ? 'Vitral soldado. Erga-o contra a luz para ver a projeção.' : 'Junta soldada. O estanho ainda está esfriando.';
  }

  let settleIron = 0;
  apply.addEventListener('click', () => {
    if (!targetSelect.value) return;
    if (tool === 'solder') {
      solder({ id: targetSelect.value, t: 1 }, 0);
      window.clearTimeout(settleIron);
      settleIron = window.setTimeout(() => view.aimIron(), 750);
    } else place(targetSelect.value);
  });
  accessButton.addEventListener('click', () => {
    const targets = byId('targets');
    targets.hidden = !targets.hidden;
    accessButton.setAttribute('aria-expanded', String(!targets.hidden));
    if (!targets.hidden) targetSelect.focus();
    else view.setHighlight('');
  });
  targetSelect.addEventListener('change', () => {
    if (tool === 'solder' && targetSelect.value) view.aimIron({ id: targetSelect.value, t: 0.5 });
    else view.setHighlight(targetSelect.value);
  });
  targetSelect.addEventListener('blur', () => { view.setHighlight(''); if (tool === 'solder') view.aimIron(); });

  let gesture: { pointer: number; mode: 'pane' | 'glass' | 'solder'; x: number; y: number; last?: SeamHit; start?: string } | undefined;
  const { canvas } = view;
  canvas.addEventListener('webglcontextlost', () => {
    loading.textContent = 'Reconectando a cena 3D…';
    loading.hidden = false;
  });
  canvas.addEventListener('webglcontextrestored', () => { loading.hidden = true; });
  const paneAt = (event: PointerEvent) => view.pickPane(event.clientX, event.clientY);
  const seamAt = (event: PointerEvent) => view.pickSeam(event.clientX, event.clientY, workshop.canSolder, event.pointerType === 'touch' ? 0.048 : 0.036);
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || gesture) return;
    window.clearTimeout(settleIron);
    const tray = view.pickTray(event.clientX, event.clientY);
    const pane = paneAt(event);
    const hit = tool === 'solder' ? seamAt(event) : undefined;
    const mode = hit ? 'solder' : tray && tool !== 'solder' ? 'glass'
      : pane && tool !== 'solder' && Boolean(workshop.work.panes[pane]) === (tool === 'color') ? 'pane' : undefined;
    if (!mode) return;
    view.orbit(false);
    canvas.setPointerCapture(event.pointerId);
    gesture = { pointer: event.pointerId, mode, x: event.clientX, y: event.clientY, last: hit, start: pane };
    if (mode === 'glass' && tray) {
      selectColor(tray);
      view.dragGlass(event.clientX, event.clientY, color);
    }
    if (hit) solder(hit, hit.t);
  }, { capture: true });

  canvas.addEventListener('pointermove', event => {
    if (gesture && gesture.pointer !== event.pointerId) return;
    if (tool === 'solder') {
      const hit = seamAt(event);
      if (gesture?.mode === 'solder' && hit) {
        const last = gesture.last;
        solder(hit, last?.id === hit.id ? last.t : hit.t);
        gesture.last = hit;
      } else {
        view.aimIron(hit);
        if (gesture) gesture.last = undefined;
      }
      return;
    }
    const pane = paneAt(event);
    const compatible = pane && Boolean(workshop.work.panes[pane]) === (tool === 'color') ? pane : undefined;
    view.setHighlight(compatible ?? '');
    if (gesture?.mode === 'glass') view.dragGlass(event.clientX, event.clientY, color, compatible);
  });
  function finishPointer(event: PointerEvent, commit: boolean) {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const active = gesture;
    gesture = undefined;
    const pane = commit ? paneAt(event) : undefined;
    if (pane && (active.mode === 'glass' || (active.mode === 'pane' && pane === active.start &&
      Math.hypot(event.clientX - active.x, event.clientY - active.y) < 12))) place(pane);
    view.stopDrag();
    view.aimIron();
    view.orbit(true);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }
  canvas.addEventListener('pointerup', event => finishPointer(event, true));
  canvas.addEventListener('pointercancel', event => finishPointer(event, false));
  canvas.addEventListener('lostpointercapture', event => finishPointer(event, false));
  canvas.addEventListener('pointerleave', () => { if (!gesture) { view.setHighlight(''); view.aimIron(); } });

  const sunSlider = document.createElement('input');
  sunSlider.setAttribute('aria-label', 'Posição do sol');
  Object.assign(sunSlider, { type: 'range', min: '-1.05', max: '1.05', step: '0.05', value: '0' });
  const sunLabel = document.createElement('label');
  sunLabel.append('Posição do sol ', sunSlider);
  sunLabel.hidden = true;
  byId('targets').after(sunLabel);
  sunLabel.className = 'sun-angle';
  sunSlider.addEventListener('input', () => view.setLight(lightSelect.value as Light, Number(sunSlider.value), false));
  function inspect() {
    inspected = !inspected;
    inspectButton.setAttribute('aria-pressed', String(inspected));
    inspectButton.textContent = inspected ? 'Voltar à bancada' : 'Contra a luz';
    sunLabel.hidden = !inspected;
    view.setView(inspected);
  }
  inspectButton.addEventListener('click', inspect);
  byId('export').addEventListener('click', () => view.exportImage());
  moldSelect.addEventListener('change', () => {
    workshop.useMold(moldSelect.value as Mold);
    view.setPanel(workshop.panel, workshop.work);
    view.aimIron();
    save();
    updateTargets();
    instruction.textContent = tips[tool];
  });
  lightSelect.addEventListener('change', () => { view.setLight(lightSelect.value as Light); save(); });
  qualitySelect.addEventListener('change', () => { save(); location.reload(); });
  soundToggle.addEventListener('change', () => { sound.configure(Number(volumeInput.value), !soundToggle.checked); save(); });
  volumeInput.addEventListener('input', () => { sound.configure(Number(volumeInput.value), !soundToggle.checked); save(); });
  const settings = byId('settings');
  const settingsButton = byId('settings-button');
  settingsButton.addEventListener('click', () => {
    settings.hidden = !settings.hidden;
    settingsButton.setAttribute('aria-expanded', String(!settings.hidden));
    if (!settings.hidden) qualitySelect.focus();
  });
  byId('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await byId('workshop').requestFullscreen();
    } catch { instruction.textContent = 'Tela cheia indisponível neste navegador.'; }
  });
  if (!document.fullscreenEnabled) byId('fullscreen').hidden = true;
  const show = byId('show');
  function toggleChrome() {
    hidden = !hidden;
    document.querySelectorAll<HTMLElement>('.chrome').forEach(element => { element.hidden = hidden; });
    show.hidden = !hidden;
    settings.hidden = true;
    settingsButton.setAttribute('aria-expanded', 'false');
    (hidden ? show : byId('hide')).focus();
  }
  byId('hide').addEventListener('click', toggleChrome);
  show.addEventListener('click', toggleChrome);
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.key === 'Escape') {
      if (!settings.hidden) {
        settings.hidden = true;
        settingsButton.setAttribute('aria-expanded', 'false');
        settingsButton.focus();
      } else if (!byId('targets').hidden) accessButton.click();
      return;
    }
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    const key = event.key.toLowerCase();
    const index = '12345'.indexOf(key);
    if (key.length === 1 && index >= 0) selectColor(colorKeys[index]);
    else if (key === 'e') selectTool('place');
    else if (key === 's') selectTool('solder');
    else if (key === 'c') selectTool('color');
    else if (key === 'v') inspect();
    else if (key === 'h') toggleChrome();
  });
  (window as Window & { medirVitral?: typeof view.measure }).medirVitral = view.measure;
  if (new URLSearchParams(location.search).has('verificar')) {
    Object.assign(window, { verificarVitral: { ...view.diagnostics, state: () => workshop.work } });
  }
  view.start();
  if (!canvas.getContext('webgl2')?.isContextLost()) loading.hidden = true;
}

void openWorkshop().catch(error => {
  console.error(error);
  loading.textContent = 'Não foi possível abrir a bancada 3D. Verifique se o WebGL está ativo e recarregue a página.';
});
