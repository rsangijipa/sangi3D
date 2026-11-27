import './style.css'
import { GalleryAudio } from './audio.ts'
import { WEIGHTS, MODES, PRESETS } from './game/content.ts'
import { calculatePhysics, dispatch } from './game/rules.ts'
import { initial, type Mode, type Quality, type Tool, type View, type WeightType, type Observation } from './game/state.ts'
import type { init } from './scene/index.ts'
import { collection } from './storage.ts'
import { layout, renderPanel } from './ui/layout.ts'

const app = document.querySelector<HTMLElement>('#app')!
layout(app)

const el = <E extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as E
const dialog = el<HTMLDialogElement>('dialog')
const world = el('world')
const panel = el('panel')
const fallbackEl = el('fallback')
const audio = new GalleryAudio()

let state = initial(matchMedia('(prefers-reduced-motion: reduce)').matches)
let scene: ReturnType<typeof init> | undefined
let tool: Tool = 'add-weight'
let view: View = 'panoramic'
let selectedWeightType: WeightType = 'terracotta'
let selectedSlot = -35
let selectedSubBeamId: string | undefined = undefined
let selectedWeightId: string | null = null
let panelOpen = true
let hidden = false
let fallbackActive = false
let ready = false

const embed = new URLSearchParams(location.search).get('embed') === '1'
document.body.classList.toggle('embedded', embed)

function status(msg: string) {
  el('status').textContent = msg
}

function tell(event: string, detail: object = {}) {
  const data = { source: 'galeria-equilibrios', version: 1, type: event, ...detail }
  window.dispatchEvent(new CustomEvent('galeria:session', { detail: data }))
  if (!embed || window.parent === window || !document.referrer) return
  const parentOrigin = new URL(document.referrer).origin
  if (parentOrigin === location.origin) window.parent.postMessage(data, parentOrigin)
}

function readyEvent() {
  if (ready) return
  ready = true
  tell('ready', { renderer: fallbackActive ? 'fallback' : 'webgl2' })
}

function setFallback(active: boolean) {
  fallbackActive = active
  fallbackEl.hidden = !active
  world.classList.toggle('unavailable', active)
  if (active) drawFallbackDiagram()
}

function drawFallbackDiagram() {
  if (!fallbackActive) return
  const diag = el('diagram')
  const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
  const angle = state.sceneState.mainAngle
  const fx = state.sceneState.fulcrumPosition

  // SVG representation of the balance beam
  diag.innerHTML = `
    <svg viewBox="-250 -100 500 200" width="100%" height="100%">
      <!-- Fulcrum Triangle Support -->
      <polygon points="${fx * 4},-5 ${fx * 4 - 20},40 ${fx * 4 + 20},40" fill="#9D814A" />
      <circle cx="${fx * 4}" cy="-5" r="4" fill="#231F1D" />

      <!-- Horizontal Level Line (dashed) -->
      <line x1="-200" y1="-5" x2="200" y2="-5" stroke="#BBB" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Tilted Balance Beam -->
      <g transform="rotate(${angle}, ${fx * 4}, -5)">
        <rect x="-200" y="-12" width="400" height="14" rx="4" fill="#B59550" stroke="#7E632D" stroke-width="2" />
        <!-- Holes and graduations -->
        ${[-40, -30, -20, -10, 10, 20, 30, 40]
          .map(
            s => `
          <circle cx="${s * 4.5}" cy="-5" r="3" fill="#231F1D" />
          <text x="${s * 4.5}" y="-16" font-size="9" text-anchor="middle" fill="#665">${Math.abs(s)}</text>
        `
          )
          .join('')}

        <!-- Hanging Weights on Main Beam -->
        ${state.sceneState.weights
          .filter(w => !w.subBeamId)
          .map(
            w => `
          <line x1="${w.slot * 4.5}" y1="-5" x2="${w.slot * 4.5}" y2="35" stroke="#444" stroke-width="1.5" />
          <circle cx="${w.slot * 4.5}" cy="45" r="${WEIGHTS[w.type].mass * 2.5}" fill="${WEIGHTS[w.type].color}" stroke="#333" stroke-width="1.5" />
          <text x="${w.slot * 4.5}" y="70" font-size="8" text-anchor="middle" fill="#333">${WEIGHTS[w.type].name}</text>
        `
          )
          .join('')}
      </g>
    </svg>
  `
  el('fallback-status').textContent = `Inclinação: ${angle.toFixed(1)}° · Carga total: ${metrics.totalMass} kg (${metrics.dynamometerTension} N)`
}

function sync() {
  if (scene) {
    scene.sync({
      state,
      tool,
      view,
      selectedWeightId
    })
  }
  if (fallbackActive) {
    drawFallbackDiagram()
  }
}

function render() {
  const working = state.phase === 'work'
  const entry = state.phase === 'entry'

  el('entry').hidden = !entry
  el('dock').hidden = !working || hidden
  el('top-bar').hidden = entry || hidden
  app.querySelector<HTMLButtonElement>('[data-action="show"]')!.hidden = !hidden
  document.body.classList.toggle('controls-hidden', hidden)

  // Update Dock active pill state
  const pills = app.querySelectorAll<HTMLButtonElement>('.dock-pill')
  pills.forEach(pill => {
    const act = pill.dataset.action
    const isActive =
      (act === 'tool-add-weight' && tool === 'add-weight') ||
      (act === 'tool-move-fulcrum' && tool === 'move-fulcrum') ||
      (act === 'tool-observe' && tool === 'observe') ||
      (act === 'tool-free-balance' && tool === 'free-balance')
    pill.classList.toggle('active', isActive)
    pill.setAttribute('aria-pressed', String(isActive))
  })

  // Update Contextual Panel
  panel.hidden = !working || !panelOpen || hidden
  if (!panel.hidden) {
    panel.innerHTML = renderPanel(tool, state, selectedWeightType, selectedSlot, selectedSubBeamId, view)
  }

  sync()
}

function command(action: Parameters<typeof dispatch>[1], quiet = false) {
  const before = state.sceneState
  const result = dispatch(state, action)
  if (!quiet || state.sceneState !== before) {
    status(result)
  }
  if (before !== state.sceneState) {
    if (action.type === 'add-weight') audio.play('hang')
    if (action.type === 'remove-weight') audio.play('unhang')
    if (action.type === 'move-fulcrum') audio.play('slide')
    const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
    if (metrics.isEquilibrated) audio.play('equilibrium')
  }
  render()
}

function showDialog(titleText: string, bodyText: string, kind: string) {
  dialog.dataset.kind = kind
  el('dialog-content').innerHTML = `
    <div class="dialog-head">
      <h2>${titleText}</h2>
      <button class="icon-btn-sm" data-action="close-dialog" aria-label="Fechar">✕</button>
    </div>
    ${bodyText}
  `
  if (!dialog.open) dialog.showModal()
}

function closeDialog() {
  if (dialog.open) dialog.close()
}

function start(mode: Mode = 'free', presetKey?: string) {
  closeDialog()
  tool = 'add-weight'
  view = 'panoramic'
  panelOpen = true
  hidden = false
  command({ type: 'start', mode, preset: presetKey })
  if (presetKey && PRESETS[presetKey]) {
    PRESETS[presetKey].setup(state)
    const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
    state.sceneState.targetAngle = metrics.targetAngle
    state.sceneState.mainAngle = metrics.targetAngle
  }
  render()
}

function activityDialog() {
  showDialog(
    'Escolher Atividade',
    `
    <div class="control-row">
      <label for="mode-select">Modalidade de interação:</label>
      <select id="mode-select" class="select-field">
        ${Object.entries(MODES)
          .map(([key, m]) => `<option value="${key}" ${key === state.mode ? 'selected' : ''}>${m.title} — ${m.subtitle}</option>`)
          .join('')}
      </select>
    </div>
    <div class="control-row">
      <label for="preset-select">Configuração inicial:</label>
      <select id="preset-select" class="select-field">
        ${Object.entries(PRESETS)
          .map(([key, p]) => `<option value="${key}">${p.label}</option>`)
          .join('')}
      </select>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary" data-action="close-dialog">Cancelar</button>
      <button class="btn primary" data-action="start-custom">Iniciar Atividade →</button>
    </div>
  `,
    'activity'
  )
}

function settingsDialog() {
  showDialog(
    'Configurações da Galeria',
    `
    <div class="control-row">
      <label for="quality-select">Qualidade gráfica:</label>
      <select id="quality-select" class="select-field">
        <option value="auto" ${state.settings.quality === 'auto' ? 'selected' : ''}>Automática</option>
        <option value="light" ${state.settings.quality === 'light' ? 'selected' : ''}>Leve</option>
        <option value="balanced" ${state.settings.quality === 'balanced' ? 'selected' : ''}>Equilibrada</option>
        <option value="cinema" ${state.settings.quality === 'cinema' ? 'selected' : ''}>Cinema (GTAO + HalfFloat)</option>
      </select>
    </div>
    <div class="control-row">
      <label for="tolerance-range">Tolerância de equilíbrio: <strong id="tol-val">${state.settings.tolerance}°</strong></label>
      <input type="range" id="tolerance-range" min="0.2" max="2.0" step="0.1" value="${state.settings.tolerance}" class="range-slider">
    </div>
    <div class="control-row">
      <label class="switch-row">
        <span>Reduzir movimentos e oscilações</span>
        <input type="checkbox" id="toggle-reduced" ${state.settings.reduced ? 'checked' : ''}>
        <span class="switch-slider"></span>
      </label>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary sm" data-action="load-save">Abrir Peça Salva</button>
      <button class="btn secondary sm" data-action="delete-save">Excluir Peça Salva</button>
      <button class="btn primary sm" data-action="close-dialog">Concluir</button>
    </div>
  `,
    'settings'
  )
}

function reviewDialog() {
  const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
  showDialog(
    'Revisar Escultura',
    `
    <div class="readout-card">
      <dl class="metrics-preview">
        <div class="metric-item"><dt>Total de pesos:</dt><dd>${state.sceneState.weights.length}</dd></div>
        <div class="metric-item"><dt>Níveis de braços (móbiles):</dt><dd>${state.sceneState.subBeams.length + 1}</dd></div>
        <div class="metric-item"><dt>Carga total suspensa:</dt><dd>${metrics.totalMass} kg</dd></div>
        <div class="metric-item"><dt>Força no dinamômetro:</dt><dd>${metrics.dynamometerTension} N</dd></div>
        <div class="metric-item"><dt>Inclinação final:</dt><dd>${state.sceneState.mainAngle.toFixed(1)}° (${metrics.isEquilibrated ? 'Equilibrado' : 'Desbalanceado'})</dd></div>
      </dl>
    </div>
    <p class="panel-instruction" style="text-align: center; font-style: italic;">
      "O que você percebe quando experimenta outra forma de equilibrar?"
    </p>
    <div class="dialog-actions">
      <button class="btn secondary sm" data-action="save-local">Salvar neste dispositivo</button>
      <button class="btn secondary sm" data-action="export-summary">Exportar Resumo (JSON)</button>
      <button class="btn primary sm" data-action="finish-session">Concluir Sessão →</button>
    </div>
  `,
    'review'
  )
}

function observeDialog() {
  showDialog(
    'Registro de Observação (Modo Acompanhado)',
    `
    <p class="panel-instruction">Registre as ações observadas do cliente/participante sem inferir valor subjetivo.</p>
    <div class="control-row">
      <label for="obs-opp">Oportunidade:</label>
      <select id="obs-opp" class="select-field">
        ${[1, 2, 3, 4, 5].map(n => `<option value="${n}">Oportunidade ${n}</option>`).join('')}
      </select>
    </div>
    <div class="control-row">
      <label for="obs-result">Ação observada:</label>
      <select id="obs-result" class="select-field">
        <option value="Independente">Independente</option>
        <option value="Com ajuda">Com ajuda</option>
        <option value="Não realizada">Não realizada</option>
        <option value="Recusada">Recusada</option>
      </select>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary" data-action="close-dialog">Cancelar</button>
      <button class="btn primary" data-action="record-obs">Registrar Observação</button>
    </div>
  `,
    'observe'
  )
}

function download(name: string, url: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
}

function exportSummary() {
  const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
  const payload = {
    version: 1,
    collection: 'Gestalt e expressiva',
    experience: 'Galeria dos Equilíbrios Impossíveis',
    timestamp: new Date().toISOString(),
    mode: state.mode,
    weightsCount: state.sceneState.weights.length,
    subBeamsCount: state.sceneState.subBeams.length,
    totalMassKg: metrics.totalMass,
    dynamometerTensionN: metrics.dynamometerTension,
    finalAngleDeg: state.sceneState.mainAngle,
    isEquilibrated: metrics.isEquilibrated,
    observations: state.sceneState.observations
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  download('galeria-resumo.json', url)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  tell('summary', { totalMass: metrics.totalMass, angle: state.sceneState.mainAngle })
}

// Global action runner
async function run(action: string, element?: HTMLElement) {
  if (action.startsWith('tool-')) {
    tool = action.slice(5) as Tool
    panelOpen = true
    render()
    return
  }
  if (action.startsWith('view-')) {
    view = action.slice(5) as View
    render()
    return
  }

  switch (action) {
    case 'start':
      start('free')
      break
    case 'activity':
      activityDialog()
      break
    case 'start-custom': {
      const mode = el<HTMLSelectElement>('mode-select').value as Mode
      const preset = el<HTMLSelectElement>('preset-select').value
      start(mode, preset)
      break
    }
    case 'settings':
      settingsDialog()
      break
    case 'pause':
      command({ type: 'pause' })
      tell('pause')
      showDialog(
        'Galeria em Pausa',
        `
        <p class="panel-instruction">A simulação cinética está pausada.</p>
        <div class="dialog-actions">
          <button class="btn secondary" data-action="exit">Sair para o Menu</button>
          <button class="btn primary" data-action="resume">Retomar Galeria →</button>
        </div>
      `,
        'pause'
      )
      break
    case 'resume':
      closeDialog()
      command({ type: 'resume' })
      tell('resume')
      break
    case 'exit':
      closeDialog()
      command({ type: 'exit' })
      tell('exit')
      break
    case 'sound': {
      const active = await audio.toggle()
      const btn = app.querySelector<HTMLButtonElement>('[data-action="sound"]')!
      btn.setAttribute('aria-pressed', String(active))
      btn.setAttribute('aria-label', active ? 'Silenciar som' : 'Ativar som')
      status(active ? 'Som ativado.' : 'Som silenciado.')
      break
    }
    case 'capture': {
      if (scene && !fallbackActive) {
        const shot = scene.snapshot()
        if (shot) download('galeria-equilibrio.png', shot)
      }
      break
    }
    case 'fullscreen':
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
      break
    case 'close-dialog':
      closeDialog()
      break
    case 'close-panel':
      panelOpen = !panelOpen
      render()
      break
    case 'show':
      hidden = false
      render()
      break
    case 'select-weight-type':
      if (element?.dataset.type) {
        selectedWeightType = element.dataset.type as WeightType
        render()
      }
      break
    case 'hang-weight': {
      const slotVal = Number(el<HTMLSelectElement>('slot-select').value)
      const subBeamVal = el<HTMLSelectElement>('subbeam-select')?.value || undefined
      command({
        type: 'add-weight',
        weightType: selectedWeightType,
        slot: slotVal,
        subBeamId: subBeamVal,
        subSlot: 'left'
      })
      break
    }
    case 'add-subbeam-brass':
      command({ type: 'add-subbeam', beamType: 'brass', slot: selectedSlot })
      break
    case 'add-subbeam-wood':
      command({ type: 'add-subbeam', beamType: 'wood', slot: selectedSlot })
      break
    case 'fulcrum-left':
      command({ type: 'move-fulcrum', position: state.sceneState.fulcrumPosition - 5 })
      break
    case 'fulcrum-center':
      command({ type: 'move-fulcrum', position: 0 })
      break
    case 'fulcrum-right':
      command({ type: 'move-fulcrum', position: state.sceneState.fulcrumPosition + 5 })
      break
    case 'undo':
      command({ type: 'undo' })
      break
    case 'redo':
      command({ type: 'redo' })
      break
    case 'reset':
      showDialog(
        'Limpar Móbile?',
        `
        <p class="panel-instruction">Todos os pesos e sub-braços serão removidos da barra principal.</p>
        <div class="dialog-actions">
          <button class="btn secondary" data-action="close-dialog">Cancelar</button>
          <button class="btn primary" data-action="confirm-reset">Limpar</button>
        </div>
      `,
        'confirm'
      )
      break
    case 'confirm-reset':
      closeDialog()
      command({ type: 'reset' })
      break
    case 'review':
      command({ type: 'review' })
      reviewDialog()
      break
    case 'open-observe':
      observeDialog()
      break
    case 'save-local':
      await collection('write', state)
      status('Escultura salva neste navegador.')
      reviewDialog()
      break
    case 'load-save': {
      const saved = await collection('read')
      if (saved?.version === 1) {
        state = saved
        state.phase = 'work'
        closeDialog()
        render()
        status('Peça carregada do armazenamento local.')
      } else {
        showDialog('Sem Peça Salva', '<p class="panel-instruction">Nenhuma escultura salva encontrada neste navegador.</p><div class="dialog-actions"><button class="btn primary sm" data-action="close-dialog">Ok</button></div>', 'notice')
      }
      break
    }
    case 'delete-save':
      await collection('delete')
      status('Cópia local excluída.')
      closeDialog()
      break
    case 'export-summary':
      exportSummary()
      break
    case 'finish-session':
      tell('complete', { weights: state.sceneState.weights.length })
      closeDialog()
      command({ type: 'exit' })
      tell('exit')
      break
    case 'load-preset': {
      const pKey = element?.dataset.preset
      if (pKey && PRESETS[pKey]) {
        PRESETS[pKey].setup(state)
        const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
        state.sceneState.targetAngle = metrics.targetAngle
        state.sceneState.mainAngle = metrics.targetAngle
        render()
        status(`Composição "${PRESETS[pKey].label}" carregada.`)
      }
      break
    }
    case 'record-obs': {
      const opp = Number(el<HTMLSelectElement>('obs-opp').value)
      const res = el<HTMLSelectElement>('obs-result').value as Observation
      command({ type: 'observe', opportunity: opp, result: res })
      closeDialog()
      break
    }
  }
}

// Event Delegation for Clicks
document.addEventListener('click', event => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')
  if (target && !('disabled' in target && (target as HTMLButtonElement).disabled)) {
    void run(target.dataset.action!, target).catch(err => {
      console.warn('Action failed:', err)
    })
  }
})

// Event Delegation for Inputs
document.addEventListener('input', event => {
  const target = event.target as HTMLInputElement
  if (target.id === 'fulcrum-range') {
    const val = Number(target.value)
    command({ type: 'move-fulcrum', position: val })
  }
  if (target.id === 'tolerance-range') {
    state.settings.tolerance = Number(target.value)
    const lbl = el('tol-val')
    if (lbl) lbl.textContent = target.value + '°'
  }
})

// Event Delegation for Change
document.addEventListener('change', event => {
  const target = event.target as HTMLInputElement
  if (target.id === 'slot-select') {
    selectedSlot = Number(target.value)
  }
  if (target.id === 'subbeam-select') {
    selectedSubBeamId = target.value || undefined
  }
  if (target.id === 'toggle-ruler') {
    command({ type: 'toggle-ruler' })
  }
  if (target.id === 'toggle-dynamometer') {
    command({ type: 'toggle-dynamometer' })
  }
  if (target.id === 'toggle-reduced') {
    state.settings.reduced = target.checked
    sync()
  }
  if (target.id === 'quality-select') {
    state.settings.quality = target.value as Quality
    sync()
  }
})

// Keyboard shortcuts
document.addEventListener('keydown', event => {
  if (dialog.open || /INPUT|SELECT|TEXTAREA/.test((event.target as HTMLElement).tagName)) return
  if (event.key.toLowerCase() === 'h') {
    hidden = !hidden
    render()
  }
  if (event.key === 'Escape' && state.phase === 'work' && panelOpen) {
    panelOpen = false
    render()
  }
  if (state.phase === 'work') {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      command({ type: event.shiftKey ? 'redo' : 'undo' })
    }
  }
})

window.addEventListener('resize', () => {
  if (scene) {
    scene.resize(world.clientWidth || window.innerWidth, world.clientHeight || window.innerHeight)
  }
})

// Initial Render
render()

// Lazy Load Scene
import('./scene')
  .then(({ init }) => {
    scene = init(world, {
      selectWeight(id) {
        selectedWeightId = id
        if (id) {
          tool = 'observe'
          panelOpen = true
        }
        render()
      },
      selectHole(slot) {
        selectedSlot = slot
        tool = 'add-weight'
        panelOpen = true
        render()
      },
      moveFulcrum(pos) {
        command({ type: 'move-fulcrum', position: pos })
      },
      status,
      fallback(active) {
        setFallback(active)
      }
    })
    sync()
    readyEvent()
  })
  .catch(() => {
    setFallback(true)
    readyEvent()
  })

const disposeGaleria = () => {
  scene?.dispose()
}
addEventListener('pagehide', event => {
  if (!event.persisted) disposeGaleria()
})
addEventListener('sangi:dispose', disposeGaleria)
addEventListener('beforeunload', disposeGaleria)
addEventListener('message', (e) => {
  if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
    disposeGaleria()
  }
})

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const scope = new URL('.', location.href)
  void navigator.serviceWorker.register(new URL('sw.js', scope), { scope: scope.pathname }).catch(() => {})
}
