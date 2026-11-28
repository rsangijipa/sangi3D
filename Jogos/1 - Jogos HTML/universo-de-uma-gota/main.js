import {workbench} from '../../../Sistema/shared/sangi-workbench.js';
import {microscope, OBJECTIVES} from './microscope.js';
import {createEcosystemSimulation, SLIDE_RADIUS, FIXED_STEP} from './js/ecosystem.js';
import {ORGANISMS, ORGANISM_LIST, ORGANELLE_CATALOG, UM_PER_UNIT} from './js/organisms/organism-registry.js';
import {SAMPLES, SAMPLE_LIST} from './js/sample-registry.js';
import {OPTIC_MODES} from './js/optics/optical-shaders.js';
import {createJournalSystem} from './js/journal-system.js';
import {createAudioEngine} from './js/audio-engine.js';
import {createQualityManager} from './js/quality-manager.js';
import {createLaboratoryStation} from './js/laboratory-world.js';

const ui = workbench({
  title: 'Universo de uma Gota',
  subtitle: 'Laboratório de Vida Microscópica 2.0',
  hint: 'Arraste a lâmina, use a roda ou pinça para ampliar e toque em um organismo para identificá-lo. Use os modos no painel para explorar anatomia, ecossistema, ferramentas e diário.',
  toolsLabel: 'Instrumentação',
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
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const format = new Intl.NumberFormat('pt-BR');

  const journal = createJournalSystem();
  const audio = createAudioEngine(ui.sound);
  const qualityMgr = createQualityManager('high', (nextProfile) => {
    optics.quality(nextProfile);
    simulation.setMaxAgents(qualityMgr.getBudget().maxAgents);
  });

  let currentSampleId = 'lago';
  let simulation = createEcosystemSimulation({sampleId: currentSampleId, maxAgents: qualityMgr.getBudget().maxAgents});

  const defaultView = () => ({
    x: 0,
    y: 0,
    tiltX: 0.018,
    tiltY: -0.024,
    zoom: 1.0,
    light: 1.1,
    focus: 0.2,
    reduced: motion.matches,
  });

  let view = defaultView();
  let objectiveIndex = 1; // 10x (100x total)
  let opticMode = 'darkfield';
  let fluorescenceChannel = 0;
  let experienceMode = 'observacao';
  let timeScale = 1.0;
  let accumulator = 0;
  let previous = 0;
  let frame = 0;
  let paused = false;
  let selectedId = null;
  let tracking = false;
  let feeding = false;
  let foodType = 'organic';
  let shotCount = 0;
  let scaleUnits = 0;

  // Ferramentas científicas
  let activeTool = 'none'; // 'none' | 'ruler' | 'marker'
  let rulerPoints = [];
  let markers = [];
  let showTrails = false;
  let showGrid = false;
  let showMinimap = true;

  // Anatomia
  let anatomyIsolate = false;
  let membraneAlpha = 1.0;
  let highlightOrganelle = null;
  let anatomyPitch = 0;
  let anatomyYaw = 0;

  // Laboratório 3D opcional
  let labStation = null;
  let guideStep = null;
  let guideHasObservation = false;
  let savingObservation = false;

  // Gravação de vídeo
  let mediaRecorder = null;
  let recordedChunks = [];

  // Descobertas (10 atividades opcionais)
  const discoveredSpecies = new Set();
  const activities = {
    ciliate: {label: '1. Identificar um organismo ciliado', done: false},
    pseudopods: {label: '2. Acompanhar pseudópodes de uma ameba', done: false},
    feeding: {label: '3. Observar a captura de alimento', done: false},
    diatom: {label: '4. Encontrar uma diatomácea', done: false},
    colony: {label: '5. Identificar uma colônia de Vólvox', done: false},
    measure: {label: '6. Medir um organismo com a régua (µm)', done: false},
    focus: {label: '7. Ajustar o foco em profundidade (Z)', done: false},
    light: {label: '8. Investigar resposta à luz (fototaxia)', done: false},
    division: {label: '9. Observar reprodução / divisão didática', done: false},
    photo: {label: '10. Registrar uma fotografia científica', done: false},
  };

  const pointers = new Map();
  let gesture = null;

  // Overlays no palco
  ui.stage.classList.add('gota-stage');
  ui.stage.insertAdjacentHTML('beforeend', `
    <div class="gota-mode"><span></span> <strong id="gota-mode-text">CAMPO ESCURO</strong> · <em id="gota-sample-pill">Água de lago</em></div>
    <div class="gota-scale"><i></i><span>25 µm</span></div>
    <div class="gota-stage-label" hidden></div>
    <svg class="gota-overlay-svg" aria-hidden="true"></svg>
    <div class="gota-minimap" aria-hidden="true"><svg viewBox="0 0 88 88" width="88" height="88"></svg></div>
    <div class="gota-flash" aria-hidden="true"></div>
    <div class="gota-lab-overlay" hidden>
      <div class="gota-lab-hud">
        <p id="gota-lab-step-text" role="status"></p>
        <div class="gota-lab-actions">
          <button type="button" id="gota-lab-next" data-primary>Pipetar gota</button>
          <button type="button" id="gota-lab-skip">Ir direto ao microscópio</button>
        </div>
      </div>
    </div>
  `);

  // Painel lateral organizado por divulgação progressiva
  ui.tools.insertAdjacentHTML('beforeend', `
    <section class="gota-guide" id="gota-guide" aria-label="Percurso guiado">
      <p id="gota-guide-step" class="gota-guide-step" role="status">Percurso guiado</p>
      <p id="gota-guide-hint" class="gota-pane-intro">Da bancada à primeira anotação no diário.</p>
      <div class="gota-guide-actions">
        <button type="button" id="gota-guide-next" data-primary>Iniciar percurso</button>
        <button type="button" id="gota-guide-exit" hidden>Sair do percurso</button>
      </div>
    </section>
    <nav class="gota-tabs" aria-label="Modos de experiência">
      <button type="button" data-mode="observacao" aria-pressed="true">Observação</button>
      <button type="button" data-mode="anatomia" aria-pressed="false">Anatomia</button>
      <button type="button" data-mode="ecossistema" aria-pressed="false">Ecossistema</button>
      <button type="button" data-mode="pesquisador" aria-pressed="false">Ferramentas</button>
      <button type="button" data-mode="laboratorio" aria-pressed="false">Bancada 3D</button>
      <button type="button" data-mode="diario" aria-pressed="false">Diário</button>
      <button type="button" data-mode="descoberta" aria-pressed="false">Descoberta</button>
    </nav>

    <section class="gota-pane" data-pane="observacao">
      <div class="gota-field">
        <label for="gota-amostra-select">Amostra da lâmina</label>
        <select id="gota-amostra-select"></select>
      </div>
      <div class="gota-field">
        <label for="gota-modalidade">Modalidade óptica</label>
        <select id="gota-modalidade">
          <option value="darkfield">Campo escuro</option>
          <option value="brightfield">Campo claro</option>
          <option value="phase">Contraste de fase</option>
          <option value="dic">DIC (Interferência)</option>
          <option value="fluorescence">Fluorescência simulada</option>
        </select>
      </div>
      <div class="gota-field" id="gota-fluor-wrap" hidden>
        <label for="gota-fluor-canal">Canal de fluorescência (simulado)</label>
        <select id="gota-fluor-canal">
          <option value="0">Todos os canais</option>
          <option value="1">Clorofila (vermelho)</option>
          <option value="2">Núcleo / DNA DAPI (azul)</option>
          <option value="3">Membranas (verde)</option>
        </select>
      </div>
      <div class="gota-field">
        <label for="gota-objetiva">Objetiva <output id="gota-obj-val">10× (100× total)</output></label>
        <div class="gota-objectives" id="gota-objetivas"></div>
      </div>
      <div class="gota-optics">
        <div class="gota-field gota-zoom-field">
          <label for="gota-zoom">Zoom fino <output id="gota-zoom-val" for="gota-zoom">100×</output></label>
          <div class="gota-zoom-buttons">
            <button type="button" id="gota-diminuir" aria-label="Diminuir ampliação">−</button>
            <input id="gota-zoom" type="range" min="0.65" max="4.6" step="0.01" value="1">
            <button type="button" id="gota-ampliar" aria-label="Aumentar ampliação">+</button>
          </div>
        </div>
        <div class="gota-field"><label for="gota-foco">Foco (Z) <output id="gota-foco-val" for="gota-foco">+8 µm</output></label><input id="gota-foco" type="range" min="-3.2" max="3.2" step="0.02" value="0.2"></div>
        <div class="gota-field"><label for="gota-luz">Luz <output id="gota-luz-val" for="gota-luz">110%</output></label><input id="gota-luz" type="range" min="0.26" max="1.65" step="0.01" value="1.1"></div>
      </div>
      <div class="gota-actions">
        <button type="button" id="gota-foto" data-primary>Fotografar</button>
        <button type="button" id="gota-alimento" aria-pressed="false">Alimento</button>
      </div>
      <div class="gota-field" id="gota-food-type-wrap">
        <label for="gota-food-type">Tipo de recurso</label>
        <select id="gota-food-type">
          <option value="organic">Partículas orgânicas</option>
          <option value="bacteria">Bactérias simuladas</option>
          <option value="microalgae">Microalgas</option>
          <option value="detritus">Detritos</option>
          <option value="nutrients">Nutrientes dissolvidos</option>
        </select>
      </div>
      <details class="gota-catalog">
        <summary id="gota-catalogo">Organismos na amostra <output id="gota-descobertos">0 / 20</output></summary>
        <p>Toque em um item para centralizar e identificar na lâmina.</p>
        <div id="gota-amostras"></div>
      </details>
      <article class="gota-reading" hidden>
        <p id="gota-forma"></p>
        <h3 id="gota-organismo"></h3>
        <p class="gota-sci" id="gota-sci"></p>
        <p id="gota-nota"></p>
        <p class="gota-metrics" id="gota-metrics"></p>
        <div class="gota-reading-actions">
          <button type="button" id="gota-seguir" aria-pressed="false">Acompanhar</button>
          <button type="button" id="gota-abrir-anatomia">Ver anatomia</button>
        </div>
      </article>
      <details class="gota-extra">
        <summary>Posição da lâmina e áudio</summary>
        <div class="gota-move">
          <button type="button" data-move="-1,0" aria-label="Deslocar à esquerda">←</button>
          <button type="button" data-move="1,0" aria-label="Deslocar à direita">→</button>
          <button type="button" data-move="0,1" aria-label="Deslocar para cima">↑</button>
          <button type="button" data-move="0,-1" aria-label="Deslocar para baixo">↓</button>
          <button type="button" id="gota-centro">Centralizar campo</button>
        </div>
        <div class="gota-field gota-angle"><label for="gota-inclinacao">Inclinação <output id="gota-inclinacao-val" for="gota-inclinacao">0°</output></label><input id="gota-inclinacao" type="range" min="-0.31" max="0.31" step="0.01" value="0.018"></div>
        <label class="gota-check"><input type="checkbox" id="gota-audio-inst" checked> Sons de instrumentos (quando som ativo)</label>
        <label class="gota-check"><input type="checkbox" id="gota-audio-sonif"> Sonificação de movimento (sensorial)</label>
        <label class="gota-check"><input type="checkbox" id="gota-qualidade-auto"> Qualidade adaptativa automática</label>
      </details>
    </section>

    <section class="gota-pane" data-pane="anatomia" hidden>
      <p class="gota-pane-intro" id="gota-anat-intro">Selecione um organismo no campo para inspecionar sua anatomia celular.</p>
      <div id="gota-anat-controls" hidden>
        <div class="gota-actions">
          <button type="button" id="gota-anat-isolar" aria-pressed="false">Isolar organismo</button>
          <button type="button" id="gota-anat-reset">Resetar ângulo</button>
        </div>
        <div class="gota-field"><label for="gota-anat-transp">Transparência da membrana <output id="gota-anat-transp-val">100%</output></label><input id="gota-anat-transp" type="range" min="0.15" max="1.0" step="0.05" value="1.0"></div>
        <div class="gota-field"><label for="gota-anat-pitch">Rotação X <output id="gota-anat-pitch-val">0°</output></label><input id="gota-anat-pitch" type="range" min="-1.5" max="1.5" step="0.05" value="0"></div>
        <div class="gota-field"><label for="gota-anat-yaw">Rotação Y <output id="gota-anat-yaw-val">0°</output></label><input id="gota-anat-yaw" type="range" min="-3.14" max="3.14" step="0.05" value="0"></div>
        <div class="gota-organelles" id="gota-organelles"></div>
        <p class="gota-organelle-detail" id="gota-organelle-detail"></p>
      </div>
    </section>

    <section class="gota-pane" data-pane="ecossistema" hidden>
      <div class="gota-field">
        <label for="gota-tempo-vel">Velocidade temporal (didática)</label>
        <select id="gota-tempo-vel">
          <option value="0">Pausado (0×)</option>
          <option value="0.25">0,25×</option>
          <option value="0.5">0,5×</option>
          <option value="1" selected>1× (normal)</option>
          <option value="2">2×</option>
          <option value="5">5×</option>
          <option value="10">10×</option>
        </select>
      </div>
      <label class="gota-check"><input type="checkbox" id="gota-repro-toggle" checked> Reprodução e ciclos de vida didáticos</label>
      <div class="gota-env-grid">
        <div class="gota-field"><label for="env-temp">Temperatura <output id="env-temp-val">22 °C</output></label><input id="env-temp" type="range" min="8" max="36" step="1" value="22"></div>
        <div class="gota-field"><label for="env-light">Luminosidade <output id="env-light-val">72%</output></label><input id="env-light" type="range" min="0" max="1" step="0.05" value="0.72"></div>
        <div class="gota-field"><label for="env-curr">Corrente <output id="env-curr-val">22%</output></label><input id="env-curr" type="range" min="0" max="1" step="0.05" value="0.22"></div>
        <div class="gota-field"><label for="env-o2">Oxigênio <output id="env-o2-val">78%</output></label><input id="env-o2" type="range" min="0.1" max="1" step="0.05" value="0.78"></div>
        <div class="gota-field"><label for="env-sal">Salinidade <output id="env-sal-val">0‰</output></label><input id="env-sal" type="range" min="0" max="40" step="1" value="0"></div>
        <div class="gota-field"><label for="env-ph">pH <output id="env-ph-val">7,1</output></label><input id="env-ph" type="range" min="4.5" max="9.5" step="0.1" value="7.1"></div>
      </div>
      <button type="button" id="gota-env-reset">Restaurar condições iniciais</button>
      <div class="gota-chart-box">
        <p class="gota-chart-title">População e energia média (simulado)</p>
        <svg id="gota-eco-chart" viewBox="0 0 240 80" width="100%" height="80"></svg>
        <p class="gota-chart-legend" id="gota-eco-summary"></p>
      </div>
    </section>

    <section class="gota-pane" data-pane="pesquisador" hidden>
      <div class="gota-actions">
        <button type="button" id="tool-ruler" aria-pressed="false">Régua (µm)</button>
        <button type="button" id="tool-marker" aria-pressed="false">Marcador</button>
      </div>
      <div class="gota-actions">
        <button type="button" id="tool-trails" aria-pressed="false">Trajetórias</button>
        <button type="button" id="tool-grid" aria-pressed="false">Grade 40 µm</button>
      </div>
      <div class="gota-actions">
        <button type="button" id="tool-count">Contar no campo</button>
        <button type="button" id="tool-stack" data-primary>Empilhar foco</button>
      </div>
      <button type="button" id="tool-clear">Limpar medições e marcadores</button>
      <p class="gota-tool-output" id="gota-tool-output">Selecione uma ferramenta científica para medir distâncias, contar indivíduos ou compor planos focais.</p>
    </section>

    <section class="gota-pane" data-pane="laboratorio" hidden>
      <p class="gota-pane-intro">Prepare uma lâmina virtual na bancada científica 3D antes de observar no microscópio.</p>
      <div class="gota-field">
        <label for="gota-lab-sample">Escolher amostra do frasco</label>
        <select id="gota-lab-sample"></select>
      </div>
      <button type="button" id="gota-lab-start" data-primary>Abrir estação de bancada 3D</button>
    </section>

    <section class="gota-pane" data-pane="diario" hidden>
      <div class="gota-actions">
        <button type="button" id="gota-foto-annotated" data-primary>Foto com escala</button>
        <button type="button" id="gota-video-rec">Gravar vídeo</button>
      </div>
      <div class="gota-field">
        <label for="gota-journal-note">Anotação científica</label>
        <input id="gota-journal-note" type="text" placeholder="Observação sobre a amostra ou comportamento...">
      </div>
      <div class="gota-actions">
        <button type="button" id="gota-journal-save">Salvar registro</button>
        <button type="button" id="gota-journal-export">Exportar JSON</button>
      </div>
      <div id="gota-journal-list" class="gota-journal-list"></div>
    </section>

    <section class="gota-pane" data-pane="descoberta" hidden>
      <p class="gota-pane-intro">Exploração guiada opcional (sem cronômetros ou punições).</p>
      <ul id="gota-discovery-list" class="gota-discovery-list"></ul>
    </section>
  `);

  const q = (sel) => ui.tools.querySelector(sel);
  const zoomInput = q('#gota-zoom');
  const focusInput = q('#gota-foco');
  const lightInput = q('#gota-luz');
  const sampleSelect = q('#gota-amostra-select');
  const labSampleSelect = q('#gota-lab-sample');
  const modeSelect = q('#gota-modalidade');
  const fluorSelect = q('#gota-fluor-canal');
  const fluorWrap = q('#gota-fluor-wrap');
  const objContainer = q('#gota-objetivas');
  const scaleRule = ui.stage.querySelector('.gota-scale i');
  const scaleLabel = ui.stage.querySelector('.gota-scale span');
  const stageLabel = ui.stage.querySelector('.gota-stage-label');
  const modeText = ui.stage.querySelector('#gota-mode-text');
  const samplePill = ui.stage.querySelector('#gota-sample-pill');
  const overlaySvg = ui.stage.querySelector('.gota-overlay-svg');
  const minimapSvg = ui.stage.querySelector('.gota-minimap svg');
  const flash = ui.stage.querySelector('.gota-flash');
  const labOverlay = ui.stage.querySelector('.gota-lab-overlay');
  const catalog = q('.gota-catalog');
  const samplesDiv = q('#gota-amostras');
  const feedingButton = q('#gota-alimento');
  const followButton = q('#gota-seguir');
  const guideNext = q('#gota-guide-next');
  const guideExit = q('#gota-guide-exit');
  const labNext = ui.stage.querySelector('#gota-lab-next');
  const labStepText = ui.stage.querySelector('#gota-lab-step-text');
  const noteInput = q('#gota-journal-note');
  const saveButton = q('#gota-journal-save');

  // Popula seletores de amostra
  for (const s of SAMPLE_LIST) {
    const opt1 = new Option(`${s.name} — ${s.subtitle}`, s.id);
    const opt2 = new Option(s.name, s.id);
    sampleSelect.add(opt1);
    labSampleSelect.add(opt2);
  }
  sampleSelect.value = currentSampleId;
  labSampleSelect.value = currentSampleId;

  // Botões de objetiva
  const objButtons = OBJECTIVES.map((obj, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${obj.power}×`;
    btn.setAttribute('aria-pressed', String(idx === objectiveIndex));
    btn.dataset.objIdx = idx;
    objContainer.append(btn);
    return btn;
  });

  function on(target, event, handler, options = {}) {
    target.addEventListener(event, handler, {signal, ...options});
  }

  function markActivity(key) {
    if (activities[key] && !activities[key].done) {
      activities[key].done = true;
      renderDiscoveryList();
    }
  }

  function renderDiscoveryList() {
    const ul = q('#gota-discovery-list');
    ul.innerHTML = '';
    for (const item of Object.values(activities)) {
      const li = document.createElement('li');
      li.className = item.done ? 'is-done' : '';
      li.textContent = `${item.done ? '✓ ' : '○ '}${item.label}`;
      ul.append(li);
    }
  }
  renderDiscoveryList();

  function rebuildAgentCatalog() {
    samplesDiv.innerHTML = '';
    for (const agent of simulation.agents) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.agentId = agent.id;
      const spec = ORGANISMS[agent.speciesId];
      const known = discoveredSpecies.has(agent.speciesId);
      btn.textContent = `${known ? '✓ ' : ''}${agent.name} (${Math.round(agent.size * UM_PER_UNIT)} µm)`;
      btn.setAttribute('aria-pressed', String(agent.id === selectedId));
      on(btn, 'click', () => {
        identifyAgent(agent, true);
        canvas.focus({preventScroll: true});
      });
      samplesDiv.append(btn);
    }
  }

  function renderAnatomyPanel() {
    const agent = selectedId ? simulation.getAgentById(selectedId) : null;
    const intro = q('#gota-anat-intro');
    const controls = q('#gota-anat-controls');
    const list = q('#gota-organelles');
    const detail = q('#gota-organelle-detail');
    if (!agent) {
      intro.hidden = false;
      controls.hidden = true;
      return;
    }
    intro.hidden = true;
    controls.hidden = false;
    const spec = ORGANISMS[agent.speciesId];
    list.innerHTML = '';
    for (const orgId of spec.anatomy) {
      const org = ORGANELLE_CATALOG[orgId];
      if (!org) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(highlightOrganelle === orgId));
      btn.innerHTML = `<span>${org.name}</span><small>${org.observableInOptical ? 'Óptica' : 'Didático'}</small>`;
      on(btn, 'click', () => {
        highlightOrganelle = highlightOrganelle === orgId ? null : orgId;
        optics.setAnatomyState({highlightOrganelle});
        detail.textContent = highlightOrganelle ? `${org.name}: ${org.note}` : '';
        renderAnatomyPanel();
        render();
      });
      list.append(btn);
    }
  }

  function renderEcoChart() {
    const svg = q('#gota-eco-chart');
    const summary = q('#gota-eco-summary');
    const hist = simulation.history;
    if (hist.length < 2) {
      summary.textContent = `População ativa: ${simulation.agents.length} organismos · Alimento: ${simulation.food.length}`;
      return;
    }
    const maxPop = Math.max(10, ...hist.map((h) => h.population));
    const popPts = hist.map((h, i) => `${(i / (hist.length - 1)) * 240},${76 - (h.population / maxPop) * 68}`).join(' ');
    const engPts = hist.map((h, i) => `${(i / (hist.length - 1)) * 240},${76 - h.avgEnergy * 68}`).join(' ');
    svg.innerHTML = `
      <polyline fill="none" stroke="#69B88B" stroke-width="2" points="${popPts}"/>
      <polyline fill="none" stroke="#D2B375" stroke-width="1.6" points="${engPts}"/>
    `;
    const last = hist[hist.length - 1];
    summary.textContent = `População: ${last.population} · Energia média: ${Math.round(last.avgEnergy * 100)}% · Recursos: ${last.foodCount}`;
  }

  async function renderJournalList() {
    const list = q('#gota-journal-list');
    const entries = await journal.listEntries();
    list.innerHTML = '';
    if (entries.length === 0) {
      list.innerHTML = '<p class="gota-pane-intro">Nenhuma fotografia ou anotação salva ainda.</p>';
      return;
    }
    for (const entry of entries) {
      const card = document.createElement('article');
      card.className = 'gota-journal-card';
      card.innerHTML = `
        <div class="gota-journal-meta">
          <strong></strong>
          <span></span>
        </div>
        <button type="button" class="gota-journal-del" aria-label="Excluir registro">×</button>
      `;
      if (typeof entry.image === 'string' && entry.image.startsWith('data:image/jpeg;base64,')) {
        const image = document.createElement('img');
        image.src = entry.image;
        image.alt = entry.organism || 'Amostra';
        image.loading = 'lazy';
        card.prepend(image);
      }
      const meta = card.querySelector('.gota-journal-meta');
      meta.querySelector('strong').textContent = entry.organism || 'Campo geral';
      meta.querySelector('span').textContent = `${entry.sampleName} · ${entry.opticLabel} · ${entry.magnification}`;
      if (entry.note) {
        const note = document.createElement('p');
        note.textContent = entry.note;
        meta.append(note);
      }
      on(card.querySelector('.gota-journal-del'), 'click', async () => {
        await journal.deleteEntry(entry.id);
        renderJournalList();
      });
      list.append(card);
    }
  }

  function refresh() {
    zoomInput.value = view.zoom;
    focusInput.value = view.focus;
    lightInput.value = view.light;
    const obj = OBJECTIVES[objectiveIndex];
    q('#gota-obj-val').textContent = `${obj.power}× (${obj.total}× total)`;
    q('#gota-zoom-val').textContent = `${format.format(Math.round(view.zoom * obj.total))}×`;
    const depth = Math.round(view.focus * UM_PER_UNIT);
    q('#gota-foco-val').textContent = `${depth > 0 ? '+' : ''}${format.format(depth)} µm`;
    q('#gota-luz-val').textContent = `${Math.round(view.light * 100)}%`;
    q('#gota-inclinacao').value = view.tiltX;
    q('#gota-inclinacao-val').textContent = `${Math.round((Math.atan((view.tiltX * 22) / 24) * 180) / Math.PI)}°`;
    q('#gota-diminuir').disabled = view.zoom <= Number(zoomInput.min);
    q('#gota-ampliar').disabled = view.zoom >= Number(zoomInput.max);
    q('#gota-descobertos').textContent = `${discoveredSpecies.size} / ${ORGANISM_LIST.length}`;
    feedingButton.setAttribute('aria-pressed', String(feeding));
    followButton.setAttribute('aria-pressed', String(tracking));
    followButton.textContent = tracking ? 'Parar de acompanhar' : 'Acompanhar';
    canvas.classList.toggle('gota-feeding', feeding);
    ui.stage.classList.toggle('gota-is-tracking', tracking);
    modeText.textContent = OPTIC_MODES[opticMode].label;
    samplePill.textContent = simulation.sample.name;
    fluorWrap.hidden = opticMode !== 'fluorescence';

    objButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === objectiveIndex)));

    const agent = selectedId ? simulation.getAgentById(selectedId) : null;
    stageLabel.hidden = !agent;
    const speedUm = agent ? Math.round(Math.hypot(agent.vx, agent.vy) * UM_PER_UNIT) : 0;
    stageLabel.textContent = agent ? `${agent.name} · ${Math.round(agent.size * UM_PER_UNIT)} µm · ${speedUm} µm/s` : '';

    const reading = q('.gota-reading');
    reading.hidden = !agent;
    if (agent) {
      const spec = ORGANISMS[agent.speciesId];
      q('#gota-forma').textContent = spec.form;
      q('#gota-organismo').textContent = spec.name;
      q('#gota-sci').textContent = spec.scientificName;
      q('#gota-nota').textContent = spec.detail;
      q('#gota-metrics').textContent = `Tamanho: ~${Math.round(agent.size * UM_PER_UNIT)} µm · Velocidade: ${speedUm} µm/s · Estado: ${agent.state} · Energia: ${Math.round(agent.energy * 100)}%`;
    }
    rebuildAgentCatalog();
  }

  function keepInSlide() {
    const distance = Math.hypot(view.x, view.y);
    if (distance <= SLIDE_RADIUS - 0.55) return;
    view.x *= (SLIDE_RADIUS - 0.55) / distance;
    view.y *= (SLIDE_RADIUS - 0.55) / distance;
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

  let lastOverlayDraw = 0;
  function drawOverlays(force = false) {
    const now = performance.now();
    if (!force && now - lastOverlayDraw < 110) return;
    lastOverlayDraw = now;
    // Minimap
    if (showMinimap) {
      let mHtml = `<circle cx="44" cy="44" r="38" fill="none" stroke="rgba(132,206,214,0.45)" stroke-width="1.5"/>`;
      for (const a of simulation.agents) {
        const mx = (44 + (a.x / SLIDE_RADIUS) * 36).toFixed(1);
        const my = (44 - (a.y / SLIDE_RADIUS) * 36).toFixed(1);
        const isSel = a.id === selectedId;
        mHtml += `<circle cx="${mx}" cy="${my}" r="${isSel ? 2.8 : 1.6}" fill="${isSel ? '#D2B375' : 'rgba(105,184,139,0.8)'}"/>`;
      }
      const vx = 44 + (view.x / SLIDE_RADIUS) * 36;
      const vy = 44 - (view.y / SLIDE_RADIUS) * 36;
      const box = Math.max(4, 24 / view.zoom);
      mHtml += `<rect x="${(vx - box * 0.5).toFixed(1)}" y="${(vy - box * 0.5).toFixed(1)}" width="${box.toFixed(1)}" height="${box.toFixed(1)}" fill="none" stroke="#A5EDDA" stroke-width="1"/>`;
      minimapSvg.innerHTML = mHtml;
    }

    if (rulerPoints.length === 0 && markers.length === 0) {
      if (overlaySvg.firstChild) overlaySvg.innerHTML = '';
      return;
    }

    // SVG overlays (régua + marcadores)
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    overlaySvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const upp = optics.unitsPerPixel();
    let html = '';

    const toScreen = (wx, wy) => {
      const halfH = (upp * h) * 0.5;
      const halfW = (upp * w) * 0.5;
      return {
        x: ((wx - view.x) / Math.max(0.001, halfW) * 0.5 + 0.5) * w,
        y: (-(wy - view.y) / Math.max(0.001, halfH) * 0.5 + 0.5) * h,
      };
    };

    if (rulerPoints.length === 1) {
      const p = toScreen(rulerPoints[0].x, rulerPoints[0].y);
      html += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#D2B375"/>`;
    } else if (rulerPoints.length === 2) {
      const p1 = toScreen(rulerPoints[0].x, rulerPoints[0].y);
      const p2 = toScreen(rulerPoints[1].x, rulerPoints[1].y);
      const distUm = Math.hypot(rulerPoints[1].x - rulerPoints[0].x, rulerPoints[1].y - rulerPoints[0].y) * UM_PER_UNIT;
      html += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#D2B375" stroke-width="2" stroke-dasharray="4 3"/>`;
      html += `<circle cx="${p1.x}" cy="${p1.y}" r="4" fill="#D2B375"/><circle cx="${p2.x}" cy="${p2.y}" r="4" fill="#D2B375"/>`;
      html += `<text x="${(p1.x + p2.x) * 0.5}" y="${(p1.y + p2.y) * 0.5 - 8}" fill="#EDF5F3" font-size="12" text-anchor="middle">${distUm.toFixed(1)} µm</text>`;
    }

    for (const m of markers) {
      const p = toScreen(m.x, m.y);
      html += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#84CED6" stroke="#04090D" stroke-width="1.5"/>`;
      html += `<text x="${p.x + 8}" y="${p.y + 4}" fill="#EDF5F3" font-size="11">${m.label}</text>`;
    }
    overlaySvg.innerHTML = html;
  }

  function render() {
    optics.render(simulation, view, clamp(accumulator / FIXED_STEP, 0, 1));
    const units = optics.unitsPerPixel();
    if (units !== scaleUnits) {
      scaleUnits = units;
      const length = [200, 100, 50, 25, 10, 5, 2].find((size) => size / UM_PER_UNIT / units <= 94) ?? 2;
      scaleRule.style.width = `${length / UM_PER_UNIT / units}px`;
      scaleLabel.textContent = `${length} µm`;
    }
    drawOverlays();
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

  function identifyAgent(agent, recenter) {
    if (!agent) {
      ui.setStatus('Selecione um organismo no campo ou localize pelo catálogo.');
      return;
    }
    selectedId = agent.id;
    const wasKnown = discoveredSpecies.has(agent.speciesId);
    discoveredSpecies.add(agent.speciesId);
    view.focus = clamp(agent.z, -3.2, 3.2);
    if (recenter || tracking) {
      view.x = agent.x;
      view.y = agent.y;
    }
    optics.setAnatomyState({selectedId});
    catalog.open = false;

    if (agent.speciesId === 'paramecium' || agent.speciesId === 'stentor' || agent.speciesId === 'vorticella') markActivity('ciliate');
    if (agent.speciesId === 'amoeba') markActivity('pseudopods');
    if (agent.speciesId === 'diatom') markActivity('diatom');
    if (agent.speciesId === 'volvox') markActivity('colony');

    ui.setStatus(wasKnown ? `${agent.name} em observação.` : `${agent.name} identificado. ${discoveredSpecies.size} de ${ORGANISM_LIST.length} espécies catalogadas.`);
    if (guideStep === 'observacao') {
      guideHasObservation = true;
      refreshGuide();
    }
    audio.playInstrument('identify');
    refresh();
    if (experienceMode === 'anatomia') renderAnatomyPanel();
    render();
  }

  function photoCanvas(annotated) {
    render();
    let sourceCanvas = canvas;
    if (annotated) {
      const off = document.createElement('canvas');
      off.width = canvas.width;
      off.height = canvas.height;
      const ctx = off.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      ctx.fillStyle = 'rgba(4, 9, 13, 0.78)';
      ctx.fillRect(16, off.height - 54, 340, 38);
      ctx.fillStyle = '#EDF5F3';
      ctx.font = '600 14px system-ui, sans-serif';
      const sel = selectedId ? simulation.getAgentById(selectedId) : null;
      const obj = OBJECTIVES[objectiveIndex];
      ctx.fillText(`${simulation.sample.name} · ${sel ? sel.name : 'Campo geral'} · ${Math.round(view.zoom * obj.total)}× · ${scaleLabel.textContent}`, 26, off.height - 30);
      sourceCanvas = off;
    }
    return sourceCanvas;
  }

  function capturePhoto(annotated = false) {
    const sourceCanvas = photoCanvas(annotated);
    shotCount++;
    const fname = `universo-de-uma-gota-${String(shotCount).padStart(2, '0')}.png`;
    ui.capture(sourceCanvas, fname);
    markActivity('photo');
    audio.playInstrument('shutter');
    if (!motion.matches) flash.animate([{opacity: 0.35}, {opacity: 0}], {duration: 240});
    ui.setStatus(`Foto ${String(shotCount).padStart(2, '0')} registrada em PNG.`);
  }

  function loadSample(sampleId) {
    currentSampleId = sampleId;
    sampleSelect.value = sampleId;
    labSampleSelect.value = sampleId;
    guideHasObservation = false;
    if (guideStep === 'diario') guideStep = 'observacao';
    refreshGuide();
    simulation = createEcosystemSimulation({
      sampleId,
      maxAgents: qualityMgr.getBudget().maxAgents,
      reproductionEnabled: q('#gota-repro-toggle').checked,
    });
    selectedId = null;
    tracking = false;
    optics.setAnatomyState({selectedId: null, active: false});
    view = defaultView();
    // Sincroniza sliders ambientais
    q('#env-temp').value = simulation.env.temperature;
    q('#env-light').value = simulation.env.light;
    q('#env-curr').value = simulation.env.current;
    q('#env-o2').value = simulation.env.oxygen;
    q('#env-sal').value = simulation.env.salinity;
    q('#env-ph').value = simulation.env.ph;
    updateEnvLabels();
    refresh();
    render();
    ui.setStatus(`Lâmina "${simulation.sample.name}" pronta para observação.`);
  }

  function updateEnvLabels() {
    q('#env-temp-val').textContent = `${simulation.env.temperature} °C`;
    q('#env-light-val').textContent = `${Math.round(simulation.env.light * 100)}%`;
    q('#env-curr-val').textContent = `${Math.round(simulation.env.current * 100)}%`;
    q('#env-o2-val').textContent = `${Math.round(simulation.env.oxygen * 100)}%`;
    q('#env-sal-val').textContent = `${simulation.env.salinity}‰`;
    q('#env-ph-val').textContent = `${simulation.env.ph.toFixed(1).replace('.', ',')}`;
  }

  const modeTabs = ui.tools.querySelectorAll('.gota-tabs button');
  const modePanes = ui.tools.querySelectorAll('.gota-pane');
  function setExperienceMode(mode) {
    if (mode !== 'laboratorio') closeLabStation();
    experienceMode = mode;
    for (const tab of modeTabs) tab.setAttribute('aria-pressed', String(tab.dataset.mode === mode));
    for (const pane of modePanes) pane.hidden = pane.dataset.pane !== mode;
    if (mode === 'anatomia') renderAnatomyPanel();
    if (mode === 'diario') renderJournalList();
    if (mode === 'ecossistema') renderEcoChart();
    if (mode !== 'anatomia' && anatomyIsolate) {
      anatomyIsolate = false;
      optics.setAnatomyState({active: false});
      render();
    }
    refreshGuide();
  }
  for (const tab of modeTabs) on(tab, 'click', () => setExperienceMode(tab.dataset.mode));

  // Eventos de ótica e controles principais
  on(sampleSelect, 'change', () => loadSample(sampleSelect.value));
  on(modeSelect, 'change', () => {
    opticMode = modeSelect.value;
    optics.setOpticMode(opticMode);
    refresh();
    render();
  });
  on(fluorSelect, 'change', () => {
    fluorescenceChannel = Number(fluorSelect.value);
    optics.setFluorescenceChannel(fluorescenceChannel);
    render();
  });
  for (const btn of objButtons) {
    on(btn, 'click', () => {
      objectiveIndex = Number(btn.dataset.objIdx);
      const obj = optics.setObjective(objectiveIndex);
      view.zoom = clamp(obj.zoom, Number(zoomInput.min), Number(zoomInput.max));
      audio.playInstrument('turret');
      refresh();
      render();
    });
  }

  on(q('#gota-diminuir'), 'click', () => setZoom(view.zoom / 1.3));
  on(q('#gota-ampliar'), 'click', () => setZoom(view.zoom * 1.3));
  on(zoomInput, 'input', () => setZoom(Number(zoomInput.value)));
  on(focusInput, 'input', () => {
    view.focus = Number(focusInput.value);
    markActivity('focus');
    audio.playInstrument('focus');
    refresh();
    render();
  });
  on(lightInput, 'input', () => {
    view.light = Number(lightInput.value);
    markActivity('light');
    refresh();
    render();
  });
  on(q('#gota-inclinacao'), 'input', (e) => {
    view.tiltX = Number(e.target.value);
    refresh();
    render();
  });
  on(q('#gota-foto'), 'click', () => capturePhoto(false));
  on(q('#gota-foto-annotated'), 'click', () => capturePhoto(true));

  function switchFood() {
    feeding = !feeding;
    if (feeding) {
      tracking = false;
      activeTool = 'none';
    }
    ui.setHint(feeding ? 'Toque na lâmina para depositar o recurso selecionado.' : 'Arraste a lâmina · Toque em um organismo');
    refresh();
  }
  on(feedingButton, 'click', switchFood);
  on(q('#gota-food-type'), 'change', (e) => { foodType = e.target.value; });

  function addFood(world) {
    if (!world || !simulation.dropFood(world.x, world.y, foodType, view.focus * 0.4)) {
      ui.setStatus('Deposite dentro da gota ou aguarde dispersão.');
      return;
    }
    audio.playInstrument('pipette');
    ui.setStatus('Recurso suspenso na gota. Observe a resposta dos organismos.');
    switchFood();
    render();
  }

  on(q('#gota-centro'), 'click', () => {
    tracking = false;
    view.x = 0;
    view.y = 0;
    view.tiltX = 0.018;
    view.tiltY = -0.024;
    refresh();
    render();
  });
  for (const btn of q('.gota-move').querySelectorAll('[data-move]')) {
    const [x, y] = btn.dataset.move.split(',').map(Number);
    on(btn, 'click', () => { pan(x / view.zoom, y / view.zoom); render(); });
  }
  on(followButton, 'click', () => {
    if (!selectedId) return;
    tracking = !tracking;
    if (tracking && feeding) switchFood();
    refresh();
  });
  on(q('#gota-abrir-anatomia'), 'click', () => {
    ui.tools.querySelector('[data-mode="anatomia"]').click();
  });

  // Anatomia
  on(q('#gota-anat-isolar'), 'click', (e) => {
    anatomyIsolate = !anatomyIsolate;
    e.target.setAttribute('aria-pressed', String(anatomyIsolate));
    optics.setAnatomyState({active: anatomyIsolate, selectedId});
    render();
  });
  on(q('#gota-anat-reset'), 'click', () => {
    anatomyPitch = 0;
    anatomyYaw = 0;
    membraneAlpha = 1.0;
    q('#gota-anat-pitch').value = 0;
    q('#gota-anat-yaw').value = 0;
    q('#gota-anat-transp').value = 1.0;
    q('#gota-anat-pitch-val').textContent = '0°';
    q('#gota-anat-yaw-val').textContent = '0°';
    q('#gota-anat-transp-val').textContent = '100%';
    optics.setAnatomyState({pitch: 0, yaw: 0, membraneAlpha: 1.0});
    render();
  });
  on(q('#gota-anat-transp'), 'input', (e) => {
    membraneAlpha = Number(e.target.value);
    q('#gota-anat-transp-val').textContent = `${Math.round(membraneAlpha * 100)}%`;
    optics.setAnatomyState({membraneAlpha});
    render();
  });
  on(q('#gota-anat-pitch'), 'input', (e) => {
    anatomyPitch = Number(e.target.value);
    q('#gota-anat-pitch-val').textContent = `${Math.round((anatomyPitch * 180) / Math.PI)}°`;
    optics.setAnatomyState({pitch: anatomyPitch});
    render();
  });
  on(q('#gota-anat-yaw'), 'input', (e) => {
    anatomyYaw = Number(e.target.value);
    q('#gota-anat-yaw-val').textContent = `${Math.round((anatomyYaw * 180) / Math.PI)}°`;
    optics.setAnatomyState({yaw: anatomyYaw});
    render();
  });

  // Ecossistema
  on(q('#gota-tempo-vel'), 'change', (e) => { timeScale = Number(e.target.value); });
  on(q('#gota-repro-toggle'), 'change', (e) => { simulation.setReproductionEnabled(e.target.checked); });
  for (const [id, key] of [['#env-temp', 'temperature'], ['#env-light', 'light'], ['#env-curr', 'current'], ['#env-o2', 'oxygen'], ['#env-sal', 'salinity'], ['#env-ph', 'ph']]) {
    on(q(id), 'input', (e) => {
      simulation.env[key] = Number(e.target.value);
      if (key === 'light') markActivity('light');
      updateEnvLabels();
    });
  }
  on(q('#gota-env-reset'), 'click', () => {
    Object.assign(simulation.env, simulation.initialEnv);
    q('#env-temp').value = simulation.env.temperature;
    q('#env-light').value = simulation.env.light;
    q('#env-curr').value = simulation.env.current;
    q('#env-o2').value = simulation.env.oxygen;
    q('#env-sal').value = simulation.env.salinity;
    q('#env-ph').value = simulation.env.ph;
    updateEnvLabels();
  });

  // Ferramentas científicas
  on(q('#tool-ruler'), 'click', (e) => {
    activeTool = activeTool === 'ruler' ? 'none' : 'ruler';
    rulerPoints = [];
    e.target.setAttribute('aria-pressed', String(activeTool === 'ruler'));
    q('#tool-marker').setAttribute('aria-pressed', 'false');
    q('#gota-tool-output').textContent = activeTool === 'ruler' ? 'Clique em dois pontos no campo para medir em µm.' : 'Régua desativada.';
    render();
  });
  on(q('#tool-marker'), 'click', (e) => {
    activeTool = activeTool === 'marker' ? 'none' : 'marker';
    e.target.setAttribute('aria-pressed', String(activeTool === 'marker'));
    q('#tool-ruler').setAttribute('aria-pressed', 'false');
    q('#gota-tool-output').textContent = activeTool === 'marker' ? 'Clique no campo para inserir um marcador científico.' : 'Marcador desativado.';
  });
  on(q('#tool-trails'), 'click', (e) => {
    showTrails = !showTrails;
    e.target.setAttribute('aria-pressed', String(showTrails));
    optics.setTrailsVisible(showTrails);
    render();
  });
  on(q('#tool-grid'), 'click', (e) => {
    showGrid = !showGrid;
    e.target.setAttribute('aria-pressed', String(showGrid));
    optics.setGridVisible(showGrid);
    render();
  });
  on(q('#tool-count'), 'click', () => {
    const halfH = (optics.unitsPerPixel() * (canvas.clientHeight || 1)) * 0.5;
    const halfW = (optics.unitsPerPixel() * (canvas.clientWidth || 1)) * 0.5;
    const inFov = simulation.agents.filter((a) => Math.abs(a.x - view.x) <= halfW && Math.abs(a.y - view.y) <= halfH);
    q('#gota-tool-output').textContent = `Contagem no campo visível: ${inFov.length} indivíduos (total na gota: ${simulation.agents.length}).`;
  });
  on(q('#tool-stack'), 'click', () => {
    const stacked = optics.focusStack(simulation, view);
    shotCount++;
    ui.capture(stacked, `universo-gota-empilhamento-${String(shotCount).padStart(2, '0')}.png`);
    q('#gota-tool-output').textContent = 'Empilhamento de 5 planos focais concluído e exportado em PNG.';
  });
  on(q('#tool-clear'), 'click', () => {
    rulerPoints = [];
    markers = [];
    render();
  });

  function refreshGuide() {
    let title = 'Percurso guiado';
    let hint = 'Da bancada à primeira anotação no diário.';
    let action = 'Iniciar percurso';
    if (guideStep === 'bancada') {
      title = '1 de 3 · Bancada';
      hint = 'Escolha uma amostra virtual e siga os controles da bancada.';
      action = 'Abrir bancada';
    } else if (guideStep === 'observacao') {
      title = '2 de 3 · Observação';
      if (guideHasObservation) {
        hint = 'A identificação ajustou o foco. Refine o plano se quiser e siga para o diário.';
        action = 'Abrir diário';
      } else {
        hint = 'Toque em um organismo ou use o catálogo para localizá-lo e ajustar o foco.';
        action = 'Escolher no catálogo';
      }
    } else if (guideStep === 'diario') {
      title = '3 de 3 · Diário';
      hint = 'Revise o campo e salve o registro local. A anotação é opcional.';
      action = experienceMode === 'diario' ? 'Salvar registro no diário' : 'Voltar ao diário';
    } else if (guideStep === 'concluido') {
      title = 'Percurso concluído';
      hint = 'O registro está no diário. Você pode continuar explorando a lâmina.';
      action = 'Voltar à observação';
    }
    const stepLabel = q('#gota-guide-step');
    if (stepLabel.textContent !== title) stepLabel.textContent = title;
    q('#gota-guide-hint').textContent = hint;
    guideNext.textContent = action;
    guideNext.disabled = guideStep === 'diario' && savingObservation;
    guideExit.hidden = guideStep === null || guideStep === 'concluido';
  }

  function endGuide() {
    guideStep = null;
    guideHasObservation = false;
    setExperienceMode('observacao');
    guideNext.focus({preventScroll: true});
  }

  on(guideNext, 'click', () => {
    if (guideStep === null) {
      guideStep = 'bancada';
      setExperienceMode('laboratorio');
      labSampleSelect.focus();
    } else if (guideStep === 'bancada') {
      setExperienceMode('laboratorio');
      openLabStation();
    } else if (guideStep === 'observacao') {
      if (guideHasObservation) {
        guideStep = 'diario';
        setExperienceMode('diario');
        noteInput.focus();
      } else {
        setExperienceMode('observacao');
        catalog.open = true;
        samplesDiv.querySelector('button:not(:disabled)')?.focus();
      }
    } else if (guideStep === 'diario') {
      if (experienceMode === 'diario') saveObservation();
      else {
        setExperienceMode('diario');
        noteInput.focus();
      }
    } else {
      endGuide();
    }
  });
  on(guideExit, 'click', endGuide);

  // Bancada 3D opcional
  function closeLabStation() {
    labOverlay.hidden = true;
    if (labStation) {
      labStation.dispose();
      labStation = null;
    }
  }

  function openLabStation() {
    if (labStation) {
      labNext.focus();
      return;
    }
    const sampleId = labSampleSelect.value;
    labOverlay.hidden = false;
    labStepText.textContent = `1 de 3 · ${SAMPLES[sampleId].name}. Deposite a gota virtual.`;
    labNext.textContent = 'Pipetar gota';
    labNext.disabled = false;
    const observeSample = () => {
      closeLabStation();
      loadSample(sampleId);
      if (guideStep === 'bancada') guideStep = 'observacao';
      setExperienceMode('observacao');
      if (guideStep === 'observacao') guideNext.focus({preventScroll: true});
      else sampleSelect.focus({preventScroll: true});
    };
    try {
      labStation = createLaboratoryStation(labOverlay, observeSample);
    } catch {
      // O microscópio segue utilizável se o navegador recusar outro contexto gráfico.
      observeSample();
      ui.setStatus('Bancada 3D indisponível. A lâmina virtual está pronta no microscópio.');
      return;
    }
    labNext.focus({preventScroll: true});
  }
  on(q('#gota-lab-start'), 'click', openLabStation);
  on(labNext, 'click', () => {
    if (!labStation) return;
    const s = labStation.advanceStep();
    audio.playInstrument('pipette');
    if (s === 1) {
      labStepText.textContent = '2 de 3 · Posicione a lamínula virtual.';
      labNext.textContent = 'Colocar lamínula';
    } else if (s === 2) {
      labStepText.textContent = '3 de 3 · Leve a lâmina virtual ao microscópio.';
      labNext.textContent = 'Iniciar observação';
    } else {
      labNext.disabled = true;
    }
  });
  on(ui.stage.querySelector('#gota-lab-skip'), 'click', () => {
    if (!labStation) return;
    labStation.observeSample();
  });
  on(labOverlay, 'keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeLabStation();
    if (guideStep === 'bancada') guideNext.focus();
    else q('#gota-lab-start').focus();
  });

  // Diário científico e gravação de vídeo
  async function saveObservation() {
    if (savingObservation) return;
    savingObservation = true;
    saveButton.disabled = true;
    refreshGuide();
    const note = noteInput.value;
    try {
      const sel = selectedId ? simulation.getAgentById(selectedId) : null;
      const obj = OBJECTIVES[objectiveIndex];
      await journal.saveEntry({
        sampleName: simulation.sample.name,
        organism: sel ? sel.name : 'Campo geral',
        opticLabel: OPTIC_MODES[opticMode].label,
        magnification: `${Math.round(view.zoom * obj.total)}×`,
        focusUm: Math.round(view.focus * UM_PER_UNIT),
        note: note.trim(),
        image: photoCanvas(true).toDataURL('image/jpeg', 0.82),
      });
      if (signal.aborted) return;
      if (noteInput.value === note) noteInput.value = '';
      if (guideStep === 'diario') guideStep = 'concluido';
      markActivity('photo');
      renderJournalList();
      ui.setStatus('Registro salvo no diário científico.');
    } catch {
      ui.setStatus('Não foi possível salvar o registro. Tente novamente.');
    } finally {
      savingObservation = false;
      saveButton.disabled = false;
      refreshGuide();
    }
  }
  on(saveButton, 'click', saveObservation);
  on(q('#gota-journal-export'), 'click', async () => {
    const entries = await journal.listEntries();
    ui.download('diario-universo-gota.json', entries.map(({image, ...rest}) => rest));
  });
  on(q('#gota-video-rec'), 'click', (e) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      e.target.textContent = 'Gravar vídeo';
      return;
    }
    if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
      ui.setStatus('Gravação de vídeo não suportada neste navegador.');
      return;
    }
    recordedChunks = [];
    const stream = canvas.captureStream(30);
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (ev) => { if (ev.data.size > 0) recordedChunks.push(ev.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {type: 'video/webm'});
      ui.download('universo-de-uma-gota.webm', blob, 'video/webm');
      ui.setStatus('Vídeo WebM exportado.');
    };
    mediaRecorder.start();
    e.target.textContent = 'Parar gravação';
    ui.setStatus('Gravando sequência em vídeo...');
  });

  // Áudio e qualidade adaptativa
  on(q('#gota-audio-inst'), 'change', (e) => audio.setInstruments(e.target.checked));
  on(q('#gota-audio-sonif'), 'change', (e) => audio.setSonification(e.target.checked));
  on(q('#gota-qualidade-auto'), 'change', (e) => qualityMgr.setAuto(e.target.checked));
  on(motion, 'change', () => { view.reduced = motion.matches; });

  // Interação no canvas (pan, pinça, seleção, ferramentas)
  function pointerData(event) { return {x: event.clientX, y: event.clientY}; }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function midpoint(a, b) { return {x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5}; }

  on(canvas, 'pointerdown', (event) => {
    if (paused || catalog.open || event.button !== 0 || pointers.size === 2) return;
    const point = pointerData(event);
    pointers.set(event.pointerId, point);
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 1) gesture = {from: point, moved: false, tilt: event.altKey};
    else gesture.moved = true;
    canvas.classList.add('gota-dragging');
  });

  on(canvas, 'pointermove', (event) => {
    if (!pointers.has(event.pointerId) || paused || catalog.open) return;
    const point = pointerData(event);
    const prev = pointers.get(event.pointerId);
    if (pointers.size === 2) {
      const other = [...pointers].find(([id]) => id !== event.pointerId)[1];
      const oldCenter = midpoint(prev, other);
      const nextCenter = midpoint(point, other);
      const scale = optics.unitsPerPixel();
      pan((oldCenter.x - nextCenter.x) * scale, (nextCenter.y - oldCenter.y) * scale);
      const world = optics.worldAt(nextCenter.x, nextCenter.y);
      setZoom((view.zoom * distance(other, point)) / Math.max(distance(other, prev), 1), world);
    } else if (gesture.moved || distance(gesture.from, point) > 6) {
      const last = gesture.moved ? prev : gesture.from;
      gesture.moved = true;
      if (gesture.tilt) {
        view.tiltX = clamp(view.tiltX - (point.x - last.x) * 0.002, -0.31, 0.31);
        view.tiltY = clamp(view.tiltY + (point.y - last.y) * 0.002, -0.31, 0.31);
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
    const world = optics.worldAt(event.clientX, event.clientY);
    if (feeding) {
      addFood(world);
      return;
    }
    if (activeTool === 'ruler' && world) {
      if (rulerPoints.length >= 2) rulerPoints = [];
      rulerPoints.push({x: world.x, y: world.y});
      if (rulerPoints.length === 2) {
        const distUm = Math.hypot(rulerPoints[1].x - rulerPoints[0].x, rulerPoints[1].y - rulerPoints[0].y) * UM_PER_UNIT;
        q('#gota-tool-output').textContent = `Distância medida: ${distUm.toFixed(1)} µm.`;
        markActivity('measure');
      }
      render();
      return;
    }
    if (activeTool === 'marker' && world) {
      markers.push({x: world.x, y: world.y, label: `M${markers.length + 1}`});
      q('#gota-tool-output').textContent = `Marcador M${markers.length} inserido em (${Math.round(world.x * UM_PER_UNIT)}, ${Math.round(world.y * UM_PER_UNIT)}) µm.`;
      render();
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const candidates = optics.targetCandidatesAt(event.clientX - bounds.left, event.clientY - bounds.top, simulation);
    if (candidates.length > 1 && candidates[0].id === selectedId) {
      // Alterna entre indivíduos sobrepostos
      const idx = candidates.findIndex((c) => c.id === selectedId);
      identifyAgent(candidates[(idx + 1) % candidates.length], false);
    } else {
      identifyAgent(candidates[0] || null, false);
    }
  }
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) on(canvas, type, finishGesture);

  on(canvas, 'wheel', (event) => {
    if (paused || catalog.open) return;
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode ? 15 : 1);
    setZoom(view.zoom * Math.exp(-clamp(delta, -170, 170) * 0.0028), optics.worldAt(event.clientX, event.clientY));
  }, {passive: false});

  const keys = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1]};
  on(canvas, 'keydown', (event) => {
    if (paused || catalog.open || event.metaKey || event.ctrlKey) return;
    if (event.key in keys) {
      event.preventDefault();
      const [x, y] = keys[event.key];
      if (event.altKey) {
        view.tiltX = clamp(view.tiltX + x * 0.06, -0.31, 0.31);
        view.tiltY = clamp(view.tiltY + y * 0.06, -0.31, 0.31);
        refresh();
      } else {
        pan((x * 0.58) / view.zoom, (y * 0.58) / view.zoom);
      }
      render();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom(view.zoom * 1.3);
    } else if (event.key === '-') {
      event.preventDefault();
      setZoom(view.zoom / 1.3);
    } else if (event.key === 'Enter' && !event.repeat) {
      const bounds = canvas.getBoundingClientRect();
      if (feeding) addFood({x: view.x, y: view.y});
      else identifyAgent(optics.targetAt(bounds.width * 0.5, bounds.height * 0.5, simulation), false);
    }
  });

  let ecoUiTimer = 0;
  function tick(now) {
    if (paused || signal.aborted) return;
    const deltaMs = previous ? Math.min(100, now - previous) : 16.6;
    const delta = previous ? deltaMs / 1000 : 0;
    previous = now;
    qualityMgr.recordFrame(deltaMs);

    const effectiveScale = view.reduced ? Math.min(0.42, timeScale) : timeScale;
    accumulator += delta * effectiveScale;
    let iterations = 0;
    const prevCount = simulation.agents.length;
    while (accumulator >= FIXED_STEP && iterations++ < 10) {
      const eaten = simulation.update(FIXED_STEP);
      if (eaten) {
        markActivity('feeding');
        ui.setStatus(`${eaten.name} ingeriu recurso e formou vacúolo alimentar.`);
      }
      accumulator -= FIXED_STEP;
    }
    if (simulation.agents.length > prevCount) markActivity('division');

    if (tracking && selectedId) {
      const agent = simulation.getAgentById(selectedId);
      if (agent) {
        const follow = view.reduced ? 1 : 1 - Math.exp(-delta * 5);
        view.x += (agent.x - view.x) * follow;
        view.y += (agent.y - view.y) * follow;
        view.focus += (clamp(agent.z, -3.2, 3.2) - view.focus) * follow * 0.6;
        audio.playSonification(Math.hypot(agent.vx, agent.vy) * UM_PER_UNIT);
      } else {
        tracking = false;
      }
    }

    ecoUiTimer += delta;
    if (experienceMode === 'ecossistema' && ecoUiTimer > 0.8) {
      ecoUiTimer = 0;
      renderEcoChart();
    }

    render();
    frame = requestAnimationFrame(tick);
  }

  const resize = new ResizeObserver(() => render());
  resize.observe(ui.stage);
  updateEnvLabels();
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
    mute(muted) {
      audio.setEnabled(!muted);
    },
    reset() {
      guideStep = null;
      setExperienceMode('observacao');
      previous = 0;
      accumulator = 0;
      loadSample(currentSampleId);
      shotCount = 0;
      discoveredSpecies.clear();
      rulerPoints = [];
      markers = [];
      catalog.open = false;
      ui.setHint('Arraste a lâmina · Toque em um organismo');
    },
    quality(value) {
      qualityMgr.setProfile(value);
      optics.quality(value);
      simulation.setMaxAgents(qualityMgr.getBudget().maxAgents);
      render();
    },
    dispose() {
      lifecycle.abort();
      cancelAnimationFrame(frame);
      resize.disconnect();
      closeLabStation();
      optics.dispose();
    },
  });
}
