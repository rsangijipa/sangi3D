// Controlador: une estado (Store), cena 3D (lazy), áudio, HUD, entrada, persistência e eventos.
import './ui/style.css';
import { AudioEngine } from './audio/audio.ts';
import { INITIAL_CONFIGS, TOOL_LABELS, yarnById, type Crossing, type ToolId } from './game/content.ts';
import { firstEnd, suggestedCrossing, type Command, type CommandResult } from './game/rules.ts';
import { createAppState, createScene, rowCount, serializeScene, type RowEntity, type SceneState } from './game/state.ts';
import { Store } from './game/store.ts';
import { emit, listen, type SummaryPayload } from './integration/events.ts';
import { clearPrefs, deleteAllCreations, deleteCreation, listCreations, loadCreation, loadPrefs, saveCreation, savePrefs } from './persist/storage.ts';
import type { PickResult, ViewId, World } from './scene/world.ts';
import { warpX } from './sim/weavePath.ts';
import { DraftView } from './ui/fallback.ts';
import { UI, tensionWord, type UiActions } from './ui/ui.ts';

const host = document.getElementById('app')!;
const store = new Store(createAppState(Math.floor(Math.random() * 1e9)));
const audio = new AudioEngine();
const prefs = loadPrefs();
store.patch({
  settings: {
    quality: prefs.quality ?? 'auto',
    volume: prefs.volume ?? 0.6,
    reducedMotion: prefs.reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches,
    hintLevel: prefs.hintLevel ?? 1,
  },
});
audio.volume = store.app.settings.volume;
// ?qualidade=cinema|equilibrada|leve|auto força um nível nesta sessão (testes, projeção), sem salvar.
const qParam = new URLSearchParams(location.search).get('qualidade');
if (qParam && ['auto', 'cinema', 'equilibrada', 'leve'].includes(qParam)) store.patch({ settings: { quality: qParam as 'auto' } });

let world: World | null = null;
let draft: DraftView | null = null;
let lastFrame = performance.now();
let running = true;
let hiddenPause = false;
let offscreen = false;
let demoTimer = 0;
let demoSnapshot: SceneState | null = null;
let replayTimer = 0;
let completeSent = false;
const counters = { cuts: 0, reconnects: 0 };
const sessionStart = Date.now();

// ---------- comandos ----------

function run(cmd: Command, opts: { quiet?: boolean } = {}): CommandResult {
  const res = store.dispatch(cmd);
  if (!res.ok) {
    if (!opts.quiet) { ui.say(res.reason, true); audio.play('error'); }
    return res;
  }
  if (!res.changed) return res;
  const ev = res.event;
  const s = store.scene;
  switch (ev.kind) {
    case 'yarnChosen':
      audio.play('select');
      ui.say(`Fio ${yarnById(ev.yarnId).nome}${s.names[ev.yarnId] ? ` (“${s.names[ev.yarnId]}”)` : ''} escolhido.`);
      break;
    case 'thicknessChosen':
      audio.play('select');
      ui.say(`Espessura ${s.thickness === 'media' ? 'média' : s.thickness}.`);
      break;
    case 'crossed':
      audio.play('cross', 0.8);
      if (!opts.quiet) ui.say(`${ev.crossing === 'over' ? 'Por cima' : 'Por baixo'} do fio ${ev.warp + 1}.`);
      break;
    case 'rowCompleted': {
      audio.play('cross');
      world?.beat(() => audio.play('clack'));
      const n = rowCount(s);
      ui.say(`Passada ${n} completa. O pente apertou a fileira.${s.shared ? ` Agora é a vez de ${s.turn}.` : ''}`);
      ui.nextInvite();
      checkComplete();
      break;
    }
    case 'unwoven':
      audio.play('tuck', 0.6);
      ui.say(ev.reopened ? 'Fileira reaberta: último cruzamento desfeito.' : 'Cruzamento desfeito.');
      break;
    case 'tension':
      world?.setTensionVisual(ev.value);
      break;
    case 'endSecured':
      world?.tuck(ev.endId, () => audio.play('tuck'));
      ui.say('Ponta presa com a agulha.');
      break;
    case 'knotTied':
      audio.play('knot');
      world?.knotPulse();
      ui.say('Nó feito.');
      break;
    case 'cut': {
      counters.cuts++;
      const y = world?.fabric.info.gapY.get(ev.gapId);
      world?.snip(((y ? (y[0] + y[1]) / 2 : 1)), () => audio.play('snip'));
      ui.say(`Trecho cortado: ${ev.removed.length} ${ev.removed.length === 1 ? 'fileira removida' : 'fileiras removidas'}. O restante foi preservado.`);
      break;
    }
    case 'reconnected':
      counters.reconnects++;
      world?.beat(() => audio.play('clack'));
      audio.play('knot', 0.6);
      ui.say('Trecho reconectado. O desenho restante foi preservado.');
      break;
    case 'reset':
      ui.say('Novo tecido pronto para começar.');
      completeSent = false;
      break;
    default:
      break;
  }
  return res;
}

function checkComplete(): void {
  const a = store.app;
  if (completeSent || a.mode === 'livre' || a.mode === 'mapa') return;
  const cfg = INITIAL_CONFIGS.find((c) => c.id === a.settings.configId);
  if (cfg && rowCount(a.sceneState) >= cfg.rowsGoal) {
    completeSent = true;
    emit('complete');
    ui.say(`Atividade com ${cfg.rowsGoal} passadas concluída. Você pode continuar, revisar ou sair.`);
    audio.play('ok');
  }
}

function summary(): SummaryPayload {
  const s = store.scene;
  const rows = s.fabric.filter((e): e is RowEntity => e.kind === 'row');
  return {
    fileiras: rows.length,
    cruzamentos: rows.reduce((a, r) => a + r.crossings.length, 0) + (s.active?.crossings.length ?? 0),
    trechosCortados: counters.cuts,
    reconexoes: counters.reconnects,
    pontasPresas: s.ends.filter((e) => e.state !== 'solta').length,
    nos: s.ends.filter((e) => e.state === 'atada').length,
    modo: store.app.mode,
    duracaoSegundos: Math.round((Date.now() - sessionStart) / 1000),
  };
}

function crossNext(c: Crossing, quiet = false): void {
  const s = store.scene;
  const idx = s.active ? s.active.crossings.length : 0;
  if (store.app.tool !== 'entrelacar') store.patch({ tool: 'entrelacar' });
  run({ type: 'cross', index: idx, crossing: c }, { quiet });
}

function unweaveLast(): void {
  const s = store.scene;
  const idx = s.active ? s.active.crossings.length - 1 : s.warpCount - 1;
  run({ type: 'unweave', index: idx });
}

function setTension(v: number): void {
  const s = store.scene;
  const target = s.focusRowId ?? 'active';
  const before = target === 'active' ? s.tension : (s.fabric.find((e) => e.id === target) as RowEntity | undefined)?.tension ?? 0.5;
  const r = run({ type: 'setTension', target, value: v }, { quiet: true });
  if (r.ok && r.changed && Math.abs(before - v) > 0.04) audio.play('creak', v);
  ui.say(`Tensão: ${tensionWord(v)}.`);
}

// ---------- ações do HUD ----------

const actions: UiActions = {
  start(mode, configId, demo) {
    const cfg = INITIAL_CONFIGS.find((c) => c.id === configId) ?? null;
    store.patch({ mode, phase: 'tecendo', tool: 'fio', settings: { configId: cfg?.id ?? store.app.settings.configId, hintLevel: mode === 'demonstrado' ? Math.max(1, store.app.settings.hintLevel) : store.app.settings.hintLevel } });
    const base = createScene(cfg?.warpCount ?? 18, {
      selectedYarn: cfg?.yarns[0] ?? 'salvia',
      thickness: cfg?.thickness ?? 'media',
      assist: cfg?.pattern ?? 'livre',
      shared: mode === 'compartilhado',
    });
    store.replaceScene(base);
    completeSent = false;
    ui.opportunity = 1;
    ui.showEntry(false);
    if (mode === 'mapa') { store.patch({ tool: 'fio' }); ui.say('Dê nomes aos fios se quiser. Os nomes ficam só nesta sessão.'); }
    if (mode === 'tensao') store.patch({ tool: 'tensionar' });
    if (demo || mode === 'demonstrado') startDemo();
    emit('ready');
  },
  tool(t) { selectTool(t); },
  yarn(id) { run({ type: 'chooseYarn', yarnId: id }); world?.setSelectedYarn(id); },
  thickness(t) { run({ type: 'chooseThickness', thickness: t }); },
  cross(c) { crossNext(c); },
  unweave() { unweaveLast(); },
  fillRow() {
    const r = run({ type: 'fillRow' });
    if (r.ok && store.app.mode === 'acompanhado') ui.say('Passada completada com apoio do padrão.');
  },
  assist(p) { run({ type: 'setAssist', pattern: p }); },
  tension(v) { setTension(v); },
  focusActive() { run({ type: 'focusRow', rowId: null }); },
  secure(endId) { run({ type: 'secureEnd', endId }); },
  knot(endId) { run({ type: 'tieKnot', endId }); },
  async cut() {
    const sel = store.scene.selection;
    if (!sel || !sel.toId) { ui.say('Marque o início e o fim do trecho no tecido.', true); return; }
    const ok = await ui.confirm('Cortar este trecho?', 'Só as fileiras marcadas serão removidas. O restante do tecido fica como está e você poderá reconectar depois. Também é possível desfazer.', 'Cortar trecho');
    if (ok) run({ type: 'cutSelection', fromId: sel.fromId, toId: sel.toId, confirmed: true });
  },
  reconnect(gapId) { run({ type: 'reconnect', gapId }); },
  clearSelection() { run({ type: 'clearSelection' }); },
  view(v: ViewId) { world?.setView(v); },
  undo() { if (store.undo()) { ui.say('Desfeito.'); audio.play('tuck', 0.5); } },
  redo() { if (store.redo()) { ui.say('Refeito.'); audio.play('tuck', 0.5); } },
  async sound() {
    if (audio.enabled) { audio.disable(); ui.soundOn = false; ui.ambienceOn = false; ui.say('Som desligado.'); }
    else {
      const ok = await audio.enable();
      ui.soundOn = ok;
      ui.say(ok ? 'Som ligado. O ambiente pode ser ligado em Ajustes.' : 'Não foi possível ligar o som neste navegador.', !ok);
      if (ok) audio.play('select');
    }
    ui.forceRender();
  },
  ambience(on) { audio.setAmbience(on); ui.ambienceOn = on; ui.forceRender(); },
  volume(v) { audio.setVolume(v); store.patch({ settings: { volume: v } }); savePrefs({ volume: v }); },
  quality(q) {
    store.patch({ settings: { quality: q } });
    savePrefs({ quality: q });
    world?.engine.setQuality(q);
    ui.say(`Qualidade: ${({ auto: 'automática', cinema: 'Cinema', equilibrada: 'Equilibrada', leve: 'Leve' })[q]}${world ? ` (em uso: ${world.engine.tier})` : ''}.`);
  },
  reducedMotion(on) {
    store.patch({ settings: { reducedMotion: on } });
    savePrefs({ reducedMotion: on });
    if (world) world.reducedMotion = on;
  },
  hint(level) { store.patch({ settings: { hintLevel: level } }); savePrefs({ hintLevel: level }); syncWorld(); },
  fullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void host.requestFullscreen?.().catch(() => ui.say('Tela cheia indisponível aqui.', true));
  },
  pause() { setPaused(true); },
  resume() { setPaused(false); },
  async exit() {
    const ok = await ui.confirm('Sair do Tear dos Vínculos?', 'O tecido desta sessão não é salvo automaticamente. Se quiser guardar, use “Ver tecido” → “Salvar criação”.', 'Sair', false);
    if (!ok) return;
    emit('summary', summary());
    emit('exit');
    if (window.parent !== window) return;
    setPaused(false);
    store.patch({ phase: 'entrada' });
    ui.showEntry(true);
  },
  exportPng() {
    if (!world) { ui.say('Exportar imagem requer a cena 3D.', true); return; }
    const url = world.captureFabric();
    download(url, `tear-dos-vinculos-${stamp()}.png`);
    ui.say('Imagem do tecido exportada.');
  },
  exportSummary() {
    const a = store.app;
    const data = {
      app: 'Tear dos Vínculos',
      versao: a.version,
      geradoEm: new Date().toISOString(),
      aviso: 'Resumo apenas de ações observáveis. Não contém interpretação, diagnóstico ou escore.',
      resumo: summary(),
      padraoDeApoio: a.sceneState.assist,
      fiosDeUrdidura: a.sceneState.warpCount,
      fileiras: a.sceneState.fabric.filter((e): e is RowEntity => e.kind === 'row').map((r, i) => ({ n: i + 1, fio: yarnById(r.yarnId).nome, espessura: r.thickness, tensao: Number(r.tension.toFixed(2)), cruzamentos: r.crossings.map((c) => (c === 'over' ? 'C' : 'B')).join(''), participante: r.participant })),
      registrosDoProfissional: a.mode === 'acompanhado' ? a.observations : undefined,
    };
    download(URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })), `tear-dos-vinculos-resumo-${stamp()}.json`);
    ui.say('Resumo observável exportado (sem nomes de fios).');
  },
  async save(title, includeNames) {
    try {
      const c = serializeScene(store.app, title.trim() || `Tecido de ${new Date().toLocaleDateString('pt-BR')}`, includeNames);
      let thumb: string | undefined;
      if (world) thumb = await shrink(world.captureFabric(), 160);
      await saveCreation({ ...c, id: `c${Date.now()}`, thumb });
      ui.gallery = await listCreations();
      ui.say('Criação salva neste navegador.');
      audio.play('ok');
      ui.forceRender();
    } catch (e) {
      ui.say(`Não foi possível salvar: ${(e as Error).message}`, true);
    }
  },
  async refreshGallery() { ui.gallery = await listCreations().catch(() => []); ui.forceRender(); },
  async loadCreation(id) {
    try {
      const c = await loadCreation(id);
      if (!c) return;
      store.replaceScene(c.sceneState, true);
      world?.sync(store.scene, true);
      ui.say(`“${c.title}” aberto. Você pode desfazer para voltar.`);
    } catch (e) { ui.say(`Criação inválida: ${(e as Error).message}`, true); }
  },
  async deleteCreation(id) {
    const ok = await ui.confirm('Apagar esta criação?', 'Ela será removida deste navegador e não poderá ser recuperada.', 'Apagar');
    if (!ok) return;
    await deleteCreation(id);
    ui.gallery = await listCreations();
    ui.forceRender();
    ui.say('Criação apagada.');
  },
  async deleteAllData() {
    const ok = await ui.confirm('Apagar dados deste navegador?', 'Todas as criações salvas e as preferências serão removidas deste dispositivo. Isso não pode ser desfeito.', 'Apagar tudo');
    if (!ok) return;
    await deleteAllCreations().catch(() => undefined);
    clearPrefs();
    ui.gallery = [];
    ui.forceRender();
    ui.say('Acervo e preferências apagados.');
  },
  async reset() {
    const ok = await ui.confirm('Recomeçar o tecido?', 'O tecido atual será substituído por uma urdidura nova. Você pode desfazer logo em seguida.', 'Recomeçar');
    if (!ok) return;
    run({ type: 'reset', warpCount: store.scene.warpCount, confirmed: true });
  },
  replay() { startReplay(); },
  stopReplay() { stopReplay(); },
  setName(yarnId, name) { run({ type: 'setName', yarnId, name }, { quiet: true }); },
  observe(result) {
    const step = TOOL_LABELS[store.app.tool];
    store.observe(step, result, ui.opportunity);
    ui.opportunity++;
    const max = store.app.settings.opportunities;
    ui.say(ui.opportunity > max ? 'Todas as oportunidades configuradas foram registradas.' : `Registrado: ${result.replace('_', ' ')}.`);
  },
  removeObservation(id) { store.removeObservation(id); },
  skipDemo() { stopDemo(true); },
  backToEntry() { setPaused(false); stopDemo(true); store.patch({ phase: 'entrada' }); ui.showEntry(true); },
  togglePerf() { perfOn = !perfOn; ui.setPerf(perfOn ? '…' : null); },
};

const ui = new UI(host, actions);
let perfOn = new URLSearchParams(location.search).has('perf');

function selectTool(t: ToolId): void {
  store.patch({ tool: t });
  ui.openPanel(t);
  if (t !== 'separar' && store.scene.selection) run({ type: 'clearSelection' });
  if (t === 'tecido') world?.setView('tecido');
  else if (t === 'entrelacar' && world?.currentView === 'tecido') world.setView('geral');
  else if (t === 'fio' && world?.currentView === 'tecido') world.setView('geral');
  if (t === 'tecido') void actions.refreshGallery();
}

function setPaused(p: boolean): void {
  store.patch({ paused: p });
  ui.showPause(p);
  if (world) world.paused = p;
  if (p) { audio.suspend(); emit('pause'); } else { audio.resume(); emit('resume'); lastFrame = performance.now(); }
}

// ---------- demonstração pulável ----------

function startDemo(): void {
  stopDemo(false);
  demoSnapshot = structuredClone(store.scene);
  store.patch({ phase: 'demonstracao', tool: 'entrelacar' });
  ui.openPanel('entrelacar');
  ui.showDemo(true);
  world?.setView('cruzamento');
  if (store.scene.assist === 'livre') store.dispatch({ type: 'setAssist', pattern: 'tafeta' });
  let steps = 0;
  const tick = () => {
    if (store.app.paused) { demoTimer = window.setTimeout(tick, 300); return; }
    const c = suggestedCrossing(store.scene);
    if (!c || steps > store.scene.warpCount * 2 + 2) { stopDemo(true); return; }
    crossNext(c, true);
    steps++;
    demoTimer = window.setTimeout(tick, store.app.settings.reducedMotion ? 220 : 420);
  };
  demoTimer = window.setTimeout(tick, 900);
}

function stopDemo(restore: boolean): void {
  clearTimeout(demoTimer);
  if (!demoSnapshot) return;
  ui.showDemo(false);
  if (restore) {
    store.replaceScene(demoSnapshot);
    world?.sync(store.scene, true);
    world?.setView('geral');
    ui.say('Agora é com você. Escolha um fio e entrelace.');
  }
  demoSnapshot = null;
  store.patch({ phase: 'tecendo', tool: 'fio' });
  ui.openPanel('fio');
}

// ---------- revisão (replay do estado físico) ----------

function startReplay(): void {
  const tl = store.timeline();
  if (tl.length < 2) { ui.say('Ainda não há passos para revisar.'); return; }
  ui.replaying = true;
  ui.forceRender();
  let i = 0;
  const step = () => {
    if (!ui.replaying) return;
    if (store.app.paused) { replayTimer = window.setTimeout(step, 300); return; }
    world?.sync(tl[i], false);
    draft?.sync(tl[i]);
    i++;
    if (i >= tl.length) { stopReplay(); return; }
    replayTimer = window.setTimeout(step, Math.max(60, 3000 / tl.length));
  };
  step();
}

function stopReplay(): void {
  clearTimeout(replayTimer);
  ui.replaying = false;
  syncWorld(true);
  ui.forceRender();
}

// ---------- sincronização ----------

function syncWorld(instant = false): void {
  const s = store.scene;
  if (world && !ui.replaying) {
    world.fabric.hint = store.app.settings.hintLevel >= 2 ? suggestedCrossing(s) : null;
    world.fabric.hintLevel = store.app.tool === 'entrelacar' ? store.app.settings.hintLevel : -1;
    world.sync(s, instant);
    world.setSelectedYarn(s.selectedYarn);
    const focus = s.focusRowId ? (s.fabric.find((e) => e.id === s.focusRowId) as RowEntity | undefined)?.tension : undefined;
    world.setTensionVisual(focus ?? s.active?.tension ?? s.tension);
  }
  if (draft && !ui.replaying) draft.sync(s);
}

store.subscribe((app, ev) => {
  ui.canUndo = store.canUndo();
  ui.canRedo = store.canRedo();
  syncWorld(ev.kind === 'history' || ev.kind === 'reset');
  ui.render(app);
});

// ---------- entrada por ponteiro (picking, arrastes, toque) ----------

const ndc = { x: 0, y: 0 };
type Drag = { kind: 'shuttle' | 'pulley'; startY: number; startT: number; id: number } | null;
let drag: Drag = null;
let downAt: { x: number; y: number; t: number; pick: PickResult | null } | null = null;

function toNdc(e: PointerEvent): { x: number; y: number } {
  const r = (e.target as HTMLElement).getBoundingClientRect();
  ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  return ndc;
}

function attachPointer(w: World): void {
  const canvas = w.engine.canvas;
  canvas.addEventListener('pointerdown', (e) => {
    if (store.app.paused || store.app.phase === 'entrada') return;
    const p = w.pick(toNdc(e) as never);
    downAt = { x: e.clientX, y: e.clientY, t: performance.now(), pick: p };
    if (!p) return;
    // Interação com objeto: câmera não gira junto.
    w.controls.enabled = false;
    e.stopImmediatePropagation();
    canvas.setPointerCapture(e.pointerId);
    if (p.kind === 'shuttle') {
      drag = { kind: 'shuttle', startY: e.clientY, startT: 0, id: e.pointerId };
      if (store.app.tool !== 'entrelacar') selectTool('entrelacar');
    } else if (p.kind === 'pulley') {
      const s = store.scene;
      drag = { kind: 'pulley', startY: e.clientY, startT: s.focusRowId ? ((s.fabric.find((x) => x.id === s.focusRowId) as RowEntity)?.tension ?? s.tension) : s.tension, id: e.pointerId };
      if (store.app.tool !== 'tensionar') selectTool('tensionar');
    }
  }, { capture: true });

  canvas.addEventListener('pointermove', (e) => {
    if (drag && e.pointerId === drag.id) {
      if (drag.kind === 'shuttle') shuttleDrag(w, toNdc(e) as never);
      else {
        const dy = (drag.startY - e.clientY) / Math.max(240, canvas.clientHeight * 0.45);
        const v = Math.max(0, Math.min(1, drag.startT + dy));
        setTension(Math.round(v * 100) / 100);
      }
      return;
    }
    if (e.pointerType === 'mouse' && !e.buttons) {
      const h = w.hover(toNdc(e) as never);
      canvas.style.cursor = h ? (h.kind === 'shuttle' || h.kind === 'pulley' ? 'grab' : 'pointer') : 'default';
    }
  });

  const end = (e: PointerEvent) => {
    const wasDrag = drag;
    drag = null;
    w.controls.enabled = true;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const p = downAt.pick;
    downAt = null;
    if (wasDrag) { syncWorld(); return; }
    if (!p || moved > 10) return;
    handleTap(p);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', (e) => { drag = null; downAt = null; w.controls.enabled = true; if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); });
  canvas.addEventListener('pointerleave', () => { if (!drag) w.hover(null); });
}

function shuttleDrag(w: World, p: { x: number; y: number }): void {
  const x = w.pointerToLoomX(p as never);
  if (x === null) return;
  w.dragShuttleTo(x);
  // Cada fio de urdidura que a lançadeira ultrapassa gera um cruzamento (padrão de apoio ou alternância).
  for (let guard = 0; guard < 40; guard++) {
    const s = store.scene;
    const wi = w.fabric.nextCrossingWarp(s);
    if (wi === null) break;
    const dir = s.active?.direction ?? (s.fabric.length ? (((s.fabric.filter((e) => e.kind === 'row').at(-1) as RowEntity | undefined)?.direction ?? -1) === 1 ? -1 : 1) : 1);
    const wx = warpX(w.fabric.layout, wi);
    const passed = dir === 1 ? x >= wx : x <= wx;
    if (!passed) break;
    const c = suggestedCrossing(s) ?? 'over';
    const r = run({ type: 'cross', index: s.active?.crossings.length ?? 0, crossing: c }, { quiet: true });
    if (!r.ok || (r.ok && r.event.kind === 'rowCompleted')) { drag = null; break; }
  }
  w.dragShuttleTo(x);
}

function handleTap(p: PickResult): void {
  const tool = store.app.tool;
  switch (p.kind) {
    case 'yarn':
      actions.yarn(p.yarnId);
      if (tool !== 'fio' && tool !== 'entrelacar') selectTool('fio');
      break;
    case 'chip':
      crossNext(p.crossing);
      break;
    case 'row':
      if (tool === 'separar') run({ type: 'selectRow', rowId: p.rowId });
      else if (tool === 'tensionar') { run({ type: 'focusRow', rowId: p.rowId }); ui.forceRender(); ui.say('Fileira escolhida para ajustar a tensão.'); }
      else ui.say('Para marcar fileiras, use Separar. Para ajustar a tensão de uma fileira, use Tensionar.');
      break;
    case 'end': {
      const end = store.scene.ends.find((e) => e.id === p.endId);
      if (!end) break;
      if (tool !== 'separar') selectTool('separar');
      if (end.state === 'solta') run({ type: 'secureEnd', endId: end.id });
      else if (end.state === 'presa') run({ type: 'tieKnot', endId: end.id });
      break;
    }
    case 'tool':
      if (p.tool === 'pente') { selectTool('entrelacar'); ui.say('O pente aperta cada passada ao completar.'); }
      else if (p.tool === 'tesoura') { selectTool('separar'); ui.say('Marque um trecho no tecido para cortar.'); }
      else {
        selectTool('separar');
        const e = firstEnd(store.scene, 'solta');
        if (e) run({ type: 'secureEnd', endId: e.id }); else ui.say('Não há pontas soltas para prender agora.');
      }
      break;
    case 'shuttle':
      if (tool !== 'entrelacar') selectTool('entrelacar');
      ui.say('Arraste a lançadeira pela urdidura ou use Por cima e Por baixo.');
      break;
    case 'pulley':
      if (tool !== 'tensionar') selectTool('tensionar');
      break;
  }
}

// ---------- teclado ----------

window.addEventListener('keydown', (e) => {
  const tgt = e.target as HTMLElement;
  // Campos de texto recebem as teclas; controles deslizantes e caixas não bloqueiam os atalhos.
  const typing = tgt && (tgt.tagName === 'TEXTAREA' || tgt.tagName === 'SELECT' || (tgt.tagName === 'INPUT' && ['text', 'search', 'number'].includes((tgt as HTMLInputElement).type)));
  if (typing) return;
  if (tgt && tgt.tagName === 'INPUT' && (tgt as HTMLInputElement).type === 'range' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  if (ui.dialogOpen) return;
  if (e.key === 'Escape') {
    if (store.app.paused) { setPaused(false); return; }
    ui.closePanel();
    return;
  }
  if (store.app.phase === 'entrada') return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) actions.redo(); else actions.undo(); return; }
  if (ctrl && e.key.toLowerCase() === 'y') { e.preventDefault(); actions.redo(); return; }
  if (ctrl) return;
  if (e.key === 'p' || e.key === 'P') { setPaused(!store.app.paused); return; }
  if (store.app.paused) return;
  const tools: ToolId[] = ['fio', 'entrelacar', 'tensionar', 'separar', 'tecido'];
  if (/^[1-5]$/.test(e.key)) { selectTool(tools[Number(e.key) - 1]); return; }
  switch (e.key) {
    case 'ArrowUp': e.preventDefault(); crossNext('over'); break;
    case 'ArrowDown': e.preventDefault(); crossNext('under'); break;
    case 'Backspace': e.preventDefault(); unweaveLast(); break;
    case '+': case '=': setTension(Math.min(1, currentTension() + 0.05)); break;
    case '-': case '_': setTension(Math.max(0, currentTension() - 0.05)); break;
    case 'h': case 'H': ui.toggleHudKey(); break;
    case 'f': case 'F': actions.fullscreen(); break;
    case 'v': case 'V': {
      const order: ViewId[] = ['geral', 'cruzamento', 'tecido', 'novelos'];
      if (world) world.setView(order[(order.indexOf(world.currentView) + 1) % order.length]);
      break;
    }
    case 'ArrowLeft': case 'ArrowRight': {
      const ids = ['linho', 'telha', 'mostarda', 'salvia', 'lavanda', 'areia'];
      if (store.app.tool === 'fio') { e.preventDefault(); const i = ids.indexOf(store.scene.selectedYarn); actions.yarn(ids[(i + (e.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length]); }
      break;
    }
  }
});

/** Tecido de exemplo para testes automatizados e capturas (não usado pela interface). */
function seedDemoFabric(rowsSpec = 'ttlmmsltmmlsstlmmt', partial = 7): void {
  const map: Record<string, string> = { t: 'telha', l: 'linho', m: 'mostarda', s: 'salvia', v: 'lavanda', a: 'areia' };
  store.dispatch({ type: 'setAssist', pattern: 'losango' });
  for (const ch of rowsSpec) {
    store.dispatch({ type: 'chooseYarn', yarnId: map[ch] ?? 'linho' });
    store.dispatch({ type: 'fillRow' });
  }
  store.dispatch({ type: 'chooseYarn', yarnId: 'salvia' });
  for (let i = 0; i < partial; i++) {
    const s = store.scene;
    store.dispatch({ type: 'cross', index: s.active ? s.active.crossings.length : 0, crossing: i % 2 ? 'under' : 'over' });
  }
}

function currentTension(): number {
  const s = store.scene;
  if (s.focusRowId) return (s.fabric.find((e) => e.id === s.focusRowId) as RowEntity | undefined)?.tension ?? s.tension;
  return s.tension;
}

// ---------- utilidades ----------

function download(url: string, name: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (url.startsWith('blob:')) setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function stamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
}

function shrink(dataUrl: string, w: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = Math.round((img.height / img.width) * w);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}

// ---------- ciclo ----------

let perfAcc = 0;
let rafId = 0;
let disposed = false;
function frame(now: number): void {
  if (!running || disposed) { rafId = 0; return; }
  rafId = requestAnimationFrame(frame);
  if (hiddenPause || offscreen) { lastFrame = now; return; }
  const raw = now - lastFrame;
  lastFrame = now;
  const dt = Math.min(raw / 1000, 0.1);
  if (world) {
    const t0 = performance.now();
    world.update(dt);
    world.render(raw);
    audio.tick(dt);
    if (perfOn) {
      perfAcc += raw;
      if (perfAcc > 500) {
        perfAcc = 0;
        const st = world.engine.stats();
        ui.setPerf(`${st.tier} · escala ${st.scale.toFixed(2)} · ${st.width}×${st.height}\nquadro ${raw.toFixed(1)} ms (cpu ${(performance.now() - t0).toFixed(1)}) · p50 ${st.p50.toFixed(1)} · p95 ${st.p95.toFixed(1)}\nchamadas ${st.calls} · triângulos ${(st.triangles / 1000).toFixed(0)}k · geo ${st.geometries} · tex ${st.textures}`);
      }
    }
  }
}

function disposeAll(): void {
  if (disposed) return;
  disposed = true;
  running = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  world?.dispose();
  world = null;
  audio.dispose();
}

window.addEventListener('sangi:pause', () => { hiddenPause = true; audio.suspend(); });
window.addEventListener('sangi:resume', () => { if (!disposed) { hiddenPause = false; lastFrame = performance.now(); if (!store.app.paused) audio.resume(); } });
window.addEventListener('sangi:mute', (e) => {
  const muted = Boolean((e as CustomEvent<{ muted?: boolean }>)?.detail?.muted);
  if (muted) audio.disable(); else void audio.enable();
});
window.addEventListener('sangi:quality', (e) => {
  const q = String((e as CustomEvent<{ quality?: string }>)?.detail?.quality || '').toUpperCase();
  const map: Record<string, 'leve' | 'equilibrada' | 'cinema'> = { LOW: 'leve', BALANCED: 'equilibrada', HIGH: 'cinema', ULTRA: 'cinema' };
  if (map[q]) world?.engine.setQuality(map[q]);
});
window.addEventListener('sangi:reset', () => { world?.setView('geral'); });
window.addEventListener('sangi:dispose', disposeAll);
window.addEventListener('beforeunload', disposeAll);

(window as unknown as { __SANGI_QA__?: unknown }).__SANGI_QA__ = {
  get info() {
    const st = world?.engine.stats();
    return { calls: st?.calls ?? 0, triangles: st?.triangles ?? 0, paused: hiddenPause, disposed };
  }
};

document.addEventListener('visibilitychange', () => {
  hiddenPause = document.hidden;
  if (document.hidden) audio.suspend(); else if (!store.app.paused) audio.resume();
});
window.addEventListener('resize', () => { world?.resize(); });
listen((cmd) => {
  if (cmd === 'pause') setPaused(true);
  else if (cmd === 'resume') setPaused(false);
  else disposeAll();
});

async function boot(): Promise<void> {
  ui.render(store.app);
  ui.showEntry(true);
  const loading = document.getElementById('carregando');
  try {
    const mod = await import('./scene/world.ts');
    const lite = store.app.settings.quality === 'leve' || (store.app.settings.quality === 'auto' && (matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 4) <= 4));
    world = new mod.World(host, lite);
    host.insertBefore(world.engine.canvas, host.firstChild);
    world.engine.setQuality(store.app.settings.quality);
    world.reducedMotion = store.app.settings.reducedMotion;
    world.engine.onContextLost = () => {
      ui.say('Os gráficos foram interrompidos. Tentando recuperar…', true);
      if (!draft) { draft = new DraftView(host, 'Os gráficos 3D foram interrompidos.'); draft.sync(store.scene); }
    };
    world.engine.onContextRestored = () => { draft?.dispose(); draft = null; syncWorld(true); ui.say('Gráficos recuperados.'); };
    attachPointer(world);
    syncWorld(true);
    new IntersectionObserver((entries) => { offscreen = !entries[0].isIntersecting; }).observe(world.engine.canvas);
    (window as unknown as { __tear: unknown }).__tear = { store, world, actions, ui, summary, seed: seedDemoFabric };
  } catch (err) {
    console.warn('WebGL indisponível, usando rascunho 2D.', err);
    draft = new DraftView(host, 'Este navegador não oferece WebGL 2.');
    draft.sync(store.scene);
    (window as unknown as { __tear: unknown }).__tear = { store, world: null, actions, ui, summary };
  } finally {
    loading?.remove();
  }
  rafId = requestAnimationFrame(frame);
  void actions.refreshGallery();
}

void boot();

if ('serviceWorker' in navigator && import.meta.env.PROD && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
}
