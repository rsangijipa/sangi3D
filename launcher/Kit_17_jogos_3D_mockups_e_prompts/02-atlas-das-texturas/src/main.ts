import './ui/imersivo.css';
import './ui/app.css';
import { detectQuality, Engine, type Quality } from './core/engine';
import { Workshop, type SceneInput, type ViewName } from './scene/workshop';
import { attachKeys, attachPointer, type Gesture } from './input/controls';
import { Sound, SAMPLE_MATERIAL } from './audio/sound';
import { AppUI, type UiExtras, type UiPrefs } from './ui/app';
import { launcherHref } from './ui/imersivo';
import { compareOrder, initialState, reducer, stepId, summarize, type Action, type SessionState } from './game/state';
import { isSampleId, makeChallenge } from './game/rules';
import { DESCRIPTORS, LIGHT_PRESETS, MODES, PREFERENCES, SAMPLES, STEPS, type Descriptor, type LightPreset, type Preference, type SampleId } from './game/content';

/* ------------------------------------------------------------------ */
/* Preferências locais (versionadas) e sessão                           */
/* ------------------------------------------------------------------ */

const PREF_KEY = 'atlas-das-texturas:v1:prefs';
const SESSION_KEY = 'atlas-das-texturas:v1:sessao';
const RELOAD_KEY = 'atlas-das-texturas:v1:recarga';

interface Prefs {
  v: 1;
  quality: UiPrefs['quality'];
  sound: boolean;
  volume: number;
  reduced: boolean;
  preset: LightPreset;
}

function loadPrefs(): Prefs {
  const def: Prefs = {
    v: 1,
    quality: 'auto',
    sound: false,
    volume: 0.6,
    reduced: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    preset: 'tarde',
  };
  try {
    const raw = JSON.parse(localStorage.getItem(PREF_KEY) ?? 'null');
    if (raw && raw.v === 1) {
      return {
        ...def,
        quality: ['auto', 'alta', 'media', 'baixa'].includes(raw.quality) ? raw.quality : def.quality,
        sound: !!raw.sound,
        volume: typeof raw.volume === 'number' ? Math.min(1, Math.max(0, raw.volume)) : def.volume,
        reduced: typeof raw.reduced === 'boolean' ? raw.reduced : def.reduced,
        preset: (LIGHT_PRESETS as readonly string[]).includes(raw.preset) ? raw.preset : def.preset,
      };
    }
  } catch {
    /* sem armazenamento: padrões */
  }
  return def;
}
const prefs = loadPrefs();
function savePrefs() {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    /* armazenamento indisponível */
  }
}
function hasSaved() {
  try {
    return !!localStorage.getItem(SESSION_KEY);
  } catch {
    return false;
  }
}

let state: SessionState = initialState((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0, prefs.preset);
// recarga para trocar a qualidade: a sessão em memória atravessa o reload uma única vez
try {
  const stash = sessionStorage.getItem(RELOAD_KEY);
  if (stash) {
    sessionStorage.removeItem(RELOAD_KEY);
    const parsed = JSON.parse(stash) as SessionState;
    if (parsed && parsed.version === state.version) state = { ...parsed, paused: false };
  }
} catch {
  /* ignora */
}

/* ------------------------------------------------------------------ */
/* Integração com o host (iframe/rota): eventos versionados, mesma origem */
/* ------------------------------------------------------------------ */

function post(type: 'ready' | 'pause' | 'resume' | 'complete' | 'exit' | 'summary', data?: unknown) {
  if (window.parent === window) return;
  try {
    if (window.parent.location.origin !== location.origin) return;
  } catch {
    return; // origem diferente: nada é enviado
  }
  window.parent.postMessage({ source: 'atlas-das-texturas', v: 1, type, data }, location.origin);
}

/* ------------------------------------------------------------------ */
/* Tempo ativo (relógio monotônico, sem contar aba oculta nem pausa)    */
/* ------------------------------------------------------------------ */

let activeMs = 0;
let lastTick = performance.now();
function tickTime() {
  const now = performance.now();
  const dt = Math.min(now - lastTick, 2000);
  lastTick = now;
  if (state.phase === 'jogo' && !state.paused && !document.hidden) activeMs += dt;
}

/* ------------------------------------------------------------------ */
/* Montagem                                                             */
/* ------------------------------------------------------------------ */

const sound = new Sound();
const ui = new AppUI((name, arg) => void command(name, arg));
const container = document.getElementById('cena') as HTMLElement;
const loading = document.getElementById('carregando') as HTMLElement;
let engine: Engine | null = null;
let ws: Workshop | null = null;
let webgl = true;
let busy = false;
let savedLocal = hasSaved();
let challenge: UiExtras['challenge'] = null;
let challengeRound = 0;
let closeups: Partial<Record<SampleId, string>> = {};
let demo: { i: number; timer: number; input: Partial<SceneInput> } | null = null;
let detected: Quality = 'media';

function extras(): UiExtras {
  return { activeMs, savedLocal, view: ws?.currentView ?? 'bancada', challenge, webgl, busy };
}
function uiPrefs(): UiPrefs {
  return { quality: prefs.quality, detected, sound: prefs.sound, volume: prefs.volume, reduced: prefs.reduced };
}

function sceneInput(s: SessionState): SceneInput {
  const base: SceneInput = {
    stepId: stepId(s),
    sampleId: s.phase === 'entrada' ? 'cork' : s.sampleId,
    chosen: s.chosen,
    allowed: s.allowed,
    compare: stepId(s) === 'comparar' && s.phase === 'jogo' ? compareOrder(s) : null,
    rotation: s.rotation,
    lampOn: s.phase === 'entrada' ? true : s.lampOn,
    lampAngle: s.lampAngle,
    lampElevation: s.lampElevation,
    lampSweep: s.lampSweep && !s.paused,
    magnifierOn: s.magnifierOn,
    magnifierPos: s.magnifierPos,
    zoom: s.zoom,
    preset: s.lightPreset,
  };
  return demo ? { ...base, ...demo.input } : base;
}

function render() {
  ui.render(state, uiPrefs(), extras());
  ws?.apply(sceneInput(state));
}

/* ------------------------------------------------------------------ */
/* Despacho único: um comando por interação                             */
/* ------------------------------------------------------------------ */

let lastStatus = 0;
function dispatch(a: Action) {
  const prev = state;
  state = reducer(state, a);
  if (state === prev) return;
  react(prev, state, a);
  render();
}

function react(prev: SessionState, s: SessionState, a: Action) {
  // mudança de etapa: ponto de vista e convite
  if (prev.step !== s.step || prev.phase !== s.phase) {
    if (s.phase === 'jogo') {
      const id = stepId(s);
      const view: ViewName = id === 'escolher' ? 'geral' : id === 'revisar' ? 'geral' : 'bancada';
      ws?.setView(view);
      ui.openPanel('etapa', true);
      ui.say(STEPS[s.step].invite);
      challenge = null;
    }
    if (s.phase === 'resumo') {
      post('complete');
      post('summary', summarize(s, activeMs));
    }
  }
  if (prev.phase === 'entrada' && s.phase === 'jogo') ws?.setView('geral');
  if (prev.paused !== s.paused) {
    post(s.paused ? 'pause' : 'resume');
    sound.suspend(s.paused);
    if (engine) engine.paused = s.paused;
  }
  switch (a.type) {
    case 'choose': {
      const on = s.chosen.includes(a.id);
      sound.tap(SAMPLE_MATERIAL[a.id]);
      ui.say(on ? `${SAMPLES[a.id].name} escolhida (${s.chosen.indexOf(a.id) === 0 ? 'A' : 'B'}).` : `${SAMPLES[a.id].name} voltou para a bandeja.`);
      break;
    }
    case 'setActive':
      sound.tap(SAMPLE_MATERIAL[a.id]);
      ui.say(`${SAMPLES[a.id].name} na bandeja principal.`);
      break;
    case 'setLampOn':
      sound.click();
      ui.say(a.on ? 'Luminária acesa.' : 'Luminária apagada: luz difusa da sala.');
      break;
    case 'setSweep':
      sound.click();
      ui.say(a.on ? 'A luz gira devagar. O que aparece e some?' : `Luz parada em ${Math.round(s.lampAngle)}°.`);
      break;
    case 'toggleMagnifier':
      sound.tap('metal');
      ui.say(s.magnifierOn ? 'Lupa sobre a amostra. Arraste para passear pela superfície.' : 'Lupa de volta ao suporte.');
      break;
    case 'nudgeLamp':
      sound.creak();
      ui.say(`Luz a ${Math.round(s.lampAngle)}°, altura ${Math.round(s.lampElevation)}°.`);
      break;
    case 'toggleDescriptor':
    case 'setPreference':
      sound.paper();
      break;
    case 'remove':
      sound.paper();
      ui.say(`${SAMPLES[a.id].name} saiu do atlas.`);
      break;
    case 'swapCompare':
      sound.tap('wood');
      break;
    case 'hint':
      sound.paper();
      break;
    case 'setPreset':
      ui.say('A luz da sala muda devagar.');
      break;
  }
  const now = performance.now();
  if ((a.type === 'setLamp' || a.type === 'setRotation') && now - lastStatus > 600) {
    lastStatus = now;
    if (a.type === 'setLamp') ui.say(`Luz a ${Math.round(s.lampAngle)}°, altura ${Math.round(s.lampElevation)}°.`, );
  }
}

/* ------------------------------------------------------------------ */
/* Comandos da interface                                                */
/* ------------------------------------------------------------------ */

async function command(name: string, arg?: string) {
  // primeiro gesto libera o áudio, se o som estiver ligado nas preferências
  if (prefs.sound && !sound.enabled) sound.setEnabled(true);
  if (demo && name !== 'demo-stop') return;
  const id = arg && isSampleId(arg) ? arg : null;
  switch (name) {
    case 'mode':
      if ((MODES as readonly string[]).includes(arg ?? '')) ui.setDraftMode(arg as (typeof MODES)[number]);
      render();
      break;
    case 'companion':
      if (id) ui.toggleCompanion(id);
      render();
      break;
    case 'start': {
      const d = ui.draft;
      activeMs = 0;
      dispatch({ type: 'start', mode: d.mode, companion: d.companion });
      break;
    }
    case 'restore-local':
      restoreLocal();
      break;
    case 'demo':
      startDemo();
      break;
    case 'demo-stop':
      stopDemo();
      break;
    case 'choose':
      if (id) dispatch({ type: 'choose', id });
      break;
    case 'active':
      if (id) dispatch({ type: 'setActive', id });
      break;
    case 'rot':
      dispatch({ type: 'rotate', delta: Number(arg) || 0 });
      sound.tap('wood');
      break;
    case 'lamp-az':
      dispatch({ type: 'nudgeLamp', dAngle: Number(arg) || 0 });
      break;
    case 'lamp-el':
      dispatch({ type: 'nudgeLamp', dElevation: Number(arg) || 0 });
      break;
    case 'sweep':
      dispatch({ type: 'setSweep', on: !state.lampSweep });
      break;
    case 'lamp-toggle':
      dispatch({ type: 'setLampOn', on: !state.lampOn });
      break;
    case 'lens':
      dispatch({ type: 'toggleMagnifier' });
      break;
    case 'zoom':
      dispatch({ type: 'setZoom', zoom: state.zoom + (Number(arg) || 0) });
      break;
    case 'tool':
      if (arg === 'mao' || arg === 'luz' || arg === 'lupa') {
        dispatch({ type: 'setTool', tool: arg });
        ui.say(arg === 'mao' ? 'Mão: arraste sobre a amostra para girá-la.' : arg === 'luz' ? 'Luz: arraste na cena para mover a luminária.' : 'Lupa: arraste para mover a área ampliada.');
      }
      break;
    case 'desc': {
      const [sid, d] = (arg ?? '').split('|');
      if (isSampleId(sid) && (DESCRIPTORS as readonly string[]).includes(d)) dispatch({ type: 'toggleDescriptor', id: sid, descriptor: d as Descriptor });
      break;
    }
    case 'pref': {
      const [sid, p] = (arg ?? '').split('|');
      if (isSampleId(sid)) dispatch({ type: 'setPreference', id: sid, preference: (PREFERENCES as readonly string[]).includes(p) ? (p as Preference) : null });
      break;
    }
    case 'save':
      if (id) await saveSample(id);
      break;
    case 'remove':
      if (id) dispatch({ type: 'remove', id });
      break;
    case 'swap':
      dispatch({ type: 'swapCompare' });
      break;
    case 'next':
      if (!busy) dispatch({ type: 'next' });
      break;
    case 'back':
      if (!busy) dispatch({ type: 'back' });
      break;
    case 'skip':
      if (!busy) dispatch({ type: 'skip' });
      break;
    case 'hint':
      dispatch({ type: 'hint' });
      break;
    case 'pause':
      dispatch({ type: state.paused ? 'resume' : 'pause' });
      break;
    case 'resume':
      dispatch({ type: 'resume' });
      break;
    case 'finish':
      dispatch({ type: 'finish' });
      break;
    case 'another':
      dispatch({ type: 'tryAnother' });
      break;
    case 'restart':
      if (await ui.confirm('Recomeçar apaga as escolhas e o atlas desta sessão. Continuar?', 'Recomeçar')) {
        activeMs = 0;
        challenge = null;
        dispatch({ type: 'reset' });
        ws?.setView('bancada');
      }
      break;
    case 'new':
      activeMs = 0;
      challenge = null;
      dispatch({ type: 'reset' });
      ws?.setView('bancada');
      break;
    case 'view':
      if (arg && ['bancada', 'geral', 'perto', 'rente', 'luz'].includes(arg) && ws) {
        ws.setView(arg as ViewName);
        if (arg === 'luz') ui.say('Do lugar da luz: o que a luminária “vê”? Use Voltar para sair.');
        render();
      }
      break;
    case 'panel':
      if (arg) ui.openPanel(arg, true);
      break;
    case 'preset':
      if (arg && (LIGHT_PRESETS as readonly string[]).includes(arg)) {
        prefs.preset = arg as LightPreset;
        savePrefs();
        dispatch({ type: 'setPreset', preset: arg as LightPreset });
      }
      break;
    case 'sound':
      prefs.sound = !prefs.sound;
      sound.setEnabled(prefs.sound);
      savePrefs();
      ui.say(prefs.sound ? 'Som ligado: madeira, gaveta e papel.' : 'Som desligado. Tudo segue igual sem áudio.');
      render();
      if (prefs.sound) sound.tap('wood');
      break;
    case 'volume':
      prefs.volume = Number(arg);
      sound.setVolume(prefs.volume);
      savePrefs();
      break;
    case 'reduced':
      prefs.reduced = !prefs.reduced;
      if (ws) ws.reducedMotion = prefs.reduced;
      if (engine) engine.tweenDuration = prefs.reduced ? 0.001 : 0.6;
      savePrefs();
      render();
      break;
    case 'quality':
      if (arg && ['auto', 'alta', 'media', 'baixa'].includes(arg) && arg !== prefs.quality) {
        if (await ui.confirm('A cena será recarregada com a nova qualidade. Esta sessão continua de onde está.', 'Recarregar')) {
          prefs.quality = arg as Prefs['quality'];
          savePrefs();
          try {
            sessionStorage.setItem(RELOAD_KEY, JSON.stringify(state));
          } catch {
            /* sem sessionStorage: recarrega do início */
          }
          location.reload();
        }
      }
      break;
    case 'export':
      exportJson();
      break;
    case 'save-local':
      if (await ui.confirm('Salvar guarda o resumo e o atlas só neste navegador. Em aparelho compartilhado, apague ao terminar.', 'Salvar')) {
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify({ v: 1, state, activeMs }));
          savedLocal = true;
          ui.say('Sessão salva neste aparelho.');
        } catch {
          ui.say('Não foi possível salvar neste navegador.');
        }
        render();
      }
      break;
    case 'clear-local':
      if (await ui.confirm('Apagar a sessão salva neste aparelho? Isso não pode ser desfeito.', 'Apagar')) {
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          /* ignora */
        }
        savedLocal = false;
        ui.say('Dados salvos apagados.');
        render();
      }
      break;
    case 'challenge':
      newChallenge();
      break;
    case 'challenge-answer':
      if (id && challenge && !challenge.answer) {
        challenge = { ...challenge, answer: id };
        dispatch({ type: 'challenge', match: id === challenge.target });
        render();
      }
      break;
    case 'exit':
      post('exit');
      if (arg !== 'link') window.open(launcherHref(), '_top');
      break;
  }
}

async function saveSample(id: SampleId) {
  if (busy || state.paused || state.phase !== 'jogo') return;
  if (!state.chosen.includes(id) && !state.collection.some((e) => e.sampleId === id)) return;
  busy = true;
  render();
  const existed = state.collection.some((e) => e.sampleId === id);
  sound.drawer(true);
  try {
    if (ws) await ws.playSave(id);
  } finally {
    busy = false;
  }
  dispatch({ type: 'save', id });
  sound.paper();
  ui.say(existed ? `Entrada da ${SAMPLES[id].name} atualizada no atlas.` : `${SAMPLES[id].name} guardada no atlas.`);
  render();
}

function newChallenge() {
  const pool = state.allowed;
  const c = makeChallenge(pool, state.seed, challengeRound++);
  const image = closeups[c.target];
  if (!image) {
    ui.say('O desafio precisa da cena 3D para gerar a imagem ampliada.');
    return;
  }
  challenge = { target: c.target, options: c.options, answer: null, image };
  sound.paper();
  render();
}

function exportJson() {
  const data = JSON.stringify(summarize(state, activeMs), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'atlas-das-texturas-resumo.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  ui.say('Resumo exportado como arquivo JSON.');
}

function restoreLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    if (raw && raw.v === 1 && raw.state?.version === state.version) {
      const prev = state;
      state = { ...raw.state, paused: false };
      activeMs = raw.activeMs ?? 0;
      react(prev, state, { type: 'resume' });
      render();
      ui.say('Sessão salva retomada.');
    }
  } catch {
    ui.say('Não foi possível ler a sessão salva.');
  }
}

/* ------------------------------------------------------------------ */
/* Demonstração opcional (pulável)                                      */
/* ------------------------------------------------------------------ */

const DEMO: { say: string; view: ViewName; input: Partial<SceneInput> }[] = [
  { say: 'Oito amostras esperam nas bandejas da bancada.', view: 'geral', input: { lampOn: false } },
  { say: 'Luz difusa: a sala ilumina tudo por igual.', view: 'bancada', input: { lampOn: false } },
  { say: 'Luz rasante: a luminária desce e gira devagar.', view: 'bancada', input: { lampOn: true, lampElevation: 18, lampSweep: true } },
  { say: 'A lupa amplia o detalhe real da superfície.', view: 'bancada', input: { lampOn: true, lampElevation: 22, magnifierOn: true, zoom: 2.5, magnifierPos: [0.03, 0.0] } },
];

function startDemo() {
  if (!ws) return;
  document.documentElement.classList.add('is-demo');
  const pill = document.getElementById('demo-pill')!;
  pill.hidden = false;
  (pill.querySelector('button') as HTMLButtonElement).focus();
  demo = { i: -1, timer: 0, input: {} };
  const stepDemo = () => {
    if (!demo) return;
    demo.i++;
    if (demo.i >= DEMO.length) {
      stopDemo();
      return;
    }
    const d = DEMO[demo.i];
    demo.input = d.input;
    ws!.setView(d.view);
    ui.say(d.say, 3600);
    render();
    demo.timer = window.setTimeout(stepDemo, prefs.reduced ? 2600 : 3800);
  };
  stepDemo();
}

function stopDemo() {
  if (!demo) return;
  window.clearTimeout(demo.timer);
  demo = null;
  document.documentElement.classList.remove('is-demo');
  (document.getElementById('demo-pill') as HTMLElement).hidden = true;
  ws?.setView('bancada');
  render();
}

/* ------------------------------------------------------------------ */
/* Ponteiro e teclado                                                   */
/* ------------------------------------------------------------------ */

let dragStartRot = 0;
function wireInput(w: Workshop) {
  attachPointer(container, w, {
    tool: () => state.tool,
    lensOn: () => state.magnifierOn,
    blocked: () => state.phase !== 'jogo' || state.paused || !!demo,
    onHover: (hit, x, y) => {
      w.highlight(hit);
      if (!hit) return ui.showHover(null);
      const label =
        hit.kind === 'tray' && hit.id
          ? `${SAMPLES[hit.id].name}${stepId(state) === 'escolher' ? (state.chosen.includes(hit.id) ? ' · tocar para devolver' : ' · tocar para escolher') : ''}`
          : hit.kind === 'hero' && hit.id
            ? `${SAMPLES[hit.id].name} · arraste para girar`
            : hit.kind === 'lamp'
              ? 'Luminária · arraste para mover a luz'
              : hit.kind === 'magnifier'
                ? 'Lupa · tocar para usar'
                : 'Gaveteiro de amostras · abrir o atlas';
      ui.showHover(label, x, y);
    },
    onTap: (hit) => {
      if (!hit) return;
      if (hit.kind === 'tray' && hit.id) {
        if (!state.allowed.includes(hit.id)) {
          ui.say('Esta amostra não faz parte do conjunto desta sessão.');
          return;
        }
        if (stepId(state) === 'escolher') dispatch({ type: 'choose', id: hit.id });
        else if (state.chosen.includes(hit.id) || state.mode === 'livre') dispatch({ type: 'setActive', id: hit.id });
        else ui.say('Para trocar as amostras, volte à etapa de escolha.');
      } else if (hit.kind === 'magnifier') dispatch({ type: 'toggleMagnifier' });
      else if (hit.kind === 'lamp') {
        if (!state.lampOn) dispatch({ type: 'setLampOn', on: true });
        else dispatch({ type: 'setTool', tool: 'luz' });
        ui.say('Arraste na cena para mover a luminária.');
      } else if (hit.kind === 'drawer') {
        sound.drawer(true);
        ui.openPanel('atlas', true);
      }
    },
    onDragStart: (g: Gesture) => {
      dragStartRot = state.rotation;
      if (g === 'light' && !state.lampOn) dispatch({ type: 'setLampOn', on: true });
      if (g === 'light' && state.lampSweep) dispatch({ type: 'setSweep', on: false });
      w.highlight(null);
      ui.showHover(null);
    },
    onDrag: (g, dx, dy, cx, cy) => {
      if (g === 'rotate') dispatch({ type: 'setRotation', deg: state.rotation + dx * 0.6 });
      else if (g === 'light') {
        dispatch({ type: 'setLamp', angle: state.lampAngle + dx * 0.3, elevation: state.lampElevation - dy * 0.22 });
        sound.creak();
      } else if (g === 'lens') {
        const p = w.trayPoint(cx, cy);
        if (p) dispatch({ type: 'moveMagnifier', x: p[0], z: p[1] });
      }
    },
    onDragEnd: (g) => {
      if (g === 'rotate' && Math.abs(state.rotation - dragStartRot) > 0.5) dispatch({ type: 'setRotation', deg: state.rotation, count: true });
      if (g === 'light') dispatch({ type: 'setLamp', count: true });
    },
  });
}

attachKeys({
  enabled: () => state.phase === 'jogo' && !state.paused && !demo,
  escape: () => {
    if (demo) return stopDemo();
    if (document.querySelector('.ov.confirm')) return;
    if (ui.isPanelOpen()) {
      ui.bar.closePanels();
      return;
    }
    if (ws?.currentView === 'luz') {
      ws.setView('bancada');
      render();
      return;
    }
    if (state.phase === 'jogo') dispatch({ type: state.paused ? 'resume' : 'pause' });
  },
  enter: () => {
    if (stepId(state) === 'revisar') dispatch({ type: 'finish' });
    else dispatch({ type: 'next' });
  },
  arrow: (dx, dy) => {
    if (state.tool === 'luz' || stepId(state) === 'rasante') {
      if (dx) dispatch({ type: 'nudgeLamp', dAngle: dx * 5 });
      if (dy && !state.magnifierOn) dispatch({ type: 'nudgeLamp', dElevation: dy * 5 });
      else if (dy) dispatch({ type: 'setZoom', zoom: state.zoom + dy * 0.5 });
    } else {
      if (dx) dispatch({ type: 'rotate', delta: dx * 15 });
      if (dy && state.magnifierOn) dispatch({ type: 'setZoom', zoom: state.zoom + dy * 0.5 });
    }
  },
  lens: () => dispatch({ type: 'toggleMagnifier' }),
  zoom: (d) => dispatch({ type: 'setZoom', zoom: state.zoom + d }),
});

/* ------------------------------------------------------------------ */
/* Ciclo de vida                                                        */
/* ------------------------------------------------------------------ */

document.addEventListener('visibilitychange', () => {
  tickTime();
  sound.suspend(document.hidden || state.paused);
});
window.setInterval(() => {
  tickTime();
  // giro automático: registra o ângulo atual no estado (poucas vezes por segundo)
  if (ws && state.lampSweep && !state.paused) {
    const a = Math.round(ws.sweepAngle);
    if (a !== Math.round(state.lampAngle)) {
      state = reducer(state, { type: 'setLamp', angle: a });
      ui.render(state, uiPrefs(), extras());
    }
  }
}, 200);
window.setInterval(() => {
  if (document.getElementById('painel-registro')?.hidden === false) ui.render(state, uiPrefs(), extras());
}, 1000);

function setProgress(f: number, line: string) {
  const bar = loading.querySelector('.bar > i') as HTMLElement;
  bar.style.width = `${Math.round(f * 100)}%`;
  (loading.querySelector('.line') as HTMLElement).textContent = line;
  loading.querySelector('.bar')!.setAttribute('aria-valuenow', String(Math.round(f * 100)));
}

function showContextLost(on: boolean) {
  const el = document.getElementById('contexto') as HTMLElement;
  el.hidden = !on;
  if (on) (el.querySelector('button') as HTMLElement).focus();
}

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

async function boot() {
  ui.onInsets = (r, b) => ws?.setInsets(r, b);
  render();
  if (!webglAvailable()) {
    webgl = false;
    loading.hidden = true;
    document.getElementById('sem-webgl')!.hidden = false;
    document.documentElement.classList.add('no-webgl');
    render();
    post('ready');
    return;
  }
  detected = detectQuality();
  const quality = prefs.quality === 'auto' ? detected : prefs.quality;
  try {
    engine = new Engine(container, {
      quality,
      fov: 40,
      near: 0.05,
      far: 12,
      exposure: 1,
      bloom: { strength: 0.3, radius: 0.5, threshold: 0.9 },
      ao: { radius: 0.05, intensity: 0.9 },
    });
    engine.tweenDuration = prefs.reduced ? 0.001 : 0.6;
    engine.onContextLost = () => showContextLost(true);
    engine.onContextRestored = () => showContextLost(false);
    ws = new Workshop(engine);
    ws.reducedMotion = prefs.reduced;
    await ws.build(setProgress);
    ws.apply(sceneInput(state));
    ui.setThumbs(ws.renderThumbs(160, false));
    closeups = ws.renderThumbs(200, true);
    wireInput(ws);
    await engine.start();
    loading.classList.add('done');
    window.setTimeout(() => (loading.hidden = true), 500);
    if (state.phase === 'jogo') ui.openPanel('etapa', true);
    render();
    ui.reportInsets();
    post('ready');
  } catch (err) {
    console.warn('Falha ao montar a cena 3D.');
    loading.classList.add('error');
    (loading.querySelector('.line') as HTMLElement).textContent = 'A cena não carregou. Você pode tentar de novo ou seguir no modo descritivo.';
    void err;
  }
}

document.getElementById('tentar')?.addEventListener('click', () => location.reload());
document.getElementById('descritivo')?.addEventListener('click', () => {
  loading.hidden = true;
  webgl = false;
  document.documentElement.classList.add('no-webgl');
  render();
});
document.getElementById('ctx-leve')?.addEventListener('click', () => {
  prefs.quality = 'baixa';
  savePrefs();
  try {
    sessionStorage.setItem(RELOAD_KEY, JSON.stringify(state));
  } catch {
    /* ignora */
  }
  location.reload();
});
document.getElementById('ctx-seguir')?.addEventListener('click', () => showContextLost(false));
document.getElementById('demo-stop')?.addEventListener('click', () => stopDemo());

window.addEventListener('pagehide', () => {
  ws?.dispose();
  engine?.dispose();
  sound.dispose();
});

// ganchos de verificação (QA no navegador): leitura de estado, despacho e medição
(window as unknown as { __atlas: unknown }).__atlas = {
  get state() {
    return state;
  },
  dispatch,
  command,
  scene: () => ws?.debug(),
  bench: (n = 60) => engine?.bench(n),
  info: () => engine && { calls: engine.renderer.info.render.calls, triangles: engine.renderer.info.render.triangles, programs: engine.renderer.info.programs?.length, textures: engine.renderer.info.memory.textures, geometries: engine.renderer.info.memory.geometries },
  engine: () => engine,
};

void boot();
