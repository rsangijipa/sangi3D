import { initial, type GameState, type LocationId, type ObservationType } from './game/state.ts'
import { dispatch } from './game/rules.ts'
import { SCENARIOS } from './game/content.ts'
import { CityAudio } from './audio.ts'
import { collection } from './storage.ts'
import { UIManager } from './ui/layout.ts'
import type { CityScene } from './scene/index.ts'

class CityApp {
  private state: GameState
  private ui!: UIManager
  private audio: CityAudio
  private scene: CityScene | null = null
  private appEl: HTMLElement
  private animId: number | null = null

  constructor() {
    this.appEl = document.getElementById('app')!
    this.audio = new CityAudio()
    this.state = initial(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    this.init()
  }

  private async init() {
    // 1. Initialize UI
    this.ui = new UIManager(this.appEl, {
      onSelectChoice: (choiceId: string) => this.handleSelectChoice(choiceId),
      onContinue: () => this.handleContinue(),
      onRedo: () => this.handleRedo(),
      onToggleSound: () => this.handleToggleSound(),
      onToggleLowStim: () => this.handleToggleLowStim(),
      onToggleFallback: () => this.handleToggleFallback(),
      onOpenScenarios: () => this.handleOpenScenarios(),
      onOpenSettings: () => this.handleOpenSettings(),
      onSelectScenario: (scenarioId: string) => this.handleSelectScenario(scenarioId),
      onSelectLocation: (locationId: LocationId) => this.handleSelectLocation(locationId),
      onSubmitCustomText: (text: string) => this.handleSubmitCustomText(text),
      onSaveObservation: (obs: ObservationType, notes: string) => this.handleSaveObservation(obs, notes),
      onToggleControlsHide: () => this.ui.toggleControlsHide()
    })

    // 2. Load stored session snapshot from IndexedDB
    try {
      const saved = await collection('read')
      if (saved) {
        this.state.currentScenarioId = saved.currentScenarioId
        this.state.currentLocationId = saved.currentLocationId
        this.state.currentNodeId = saved.currentNodeId
        this.state.stage = saved.stage
        this.state.totalStages = saved.totalStages
        this.state.settings = { ...saved.settings }
      }
    } catch (e) {
      console.warn('Could not load IndexedDB snapshot:', e)
    }

    // 3. Mount 3D Scene safely with 2D fallback on context failure
    await this.setupScene()

    // 4. Keyboard Shortcuts
    this.setupKeyboard()

    // 5. Iframe v1 Session Protocol
    this.setupIframeProtocol()

    // 6. Sync UI and begin tracker loop for 3D anchored speech bubble
    this.syncUI()
    this.startAnchorTracking()

    // Signal ready to parent iframe
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ready', app: '12-cidade-das-conversas' }, '*')
    }
  }

  private async setupScene() {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
    const container = document.getElementById('viewport-container')!

    try {
      const { CityScene } = await import('./scene/index.ts')
      this.scene = new CityScene(container, canvas)
      this.scene.setLowStimulation(this.state.settings.lowStimulation)
    } catch (e) {
      console.warn('WebGL2 not available or scene error, enabling 2D fallback mode:', e)
      this.enableFallback2D()
    }
  }

  private startAnchorTracking() {
    const loop = () => {
      if (this.isDisposed) return
      if (this.scene) {
        const coords = this.scene.getSpeechScreenCoords()
        this.ui.updateSpeechBubblePosition(coords)
      }
      this.animId = requestAnimationFrame(loop)
    }
    this.animId = requestAnimationFrame(loop)
  }

  private enableFallback2D() {
    this.ui.fallback2DEl.hidden = false
    const viewport = document.getElementById('viewport-container')
    if (viewport) viewport.hidden = true
  }

  private disableFallback2D() {
    this.ui.fallback2DEl.hidden = true
    const viewport = document.getElementById('viewport-container')
    if (viewport) viewport.hidden = false
  }

  private setupKeyboard() {
    window.addEventListener('keydown', e => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === 'h' || e.key === 'H') {
        this.ui.toggleControlsHide()
      } else if (e.key === 'Escape') {
        this.ui.scenariosModal.hidden = true
        this.ui.summaryModal.hidden = true
        this.ui.settingsModal.hidden = true
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        this.handleUndo()
      } else if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        this.handleRedo()
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const locations: LocationId[] = ['padaria', 'escola', 'biblioteca', 'praca', 'ponto_onibus']
        const loc = locations[parseInt(e.key, 10) - 1]
        if (loc) this.handleSelectLocation(loc)
      }
    })
  }

  private setupIframeProtocol() {
    window.addEventListener('message', e => {
      const data = e.data
      if (!data || typeof data !== 'object') return

      switch (data.type) {
        case 'ping':
          window.parent.postMessage({ type: 'ready', app: '12-cidade-das-conversas' }, '*')
          break
        case 'pause':
          this.state.phase = 'waiting'
          this.syncUI()
          break
        case 'resume':
          this.state.phase = 'dialogue'
          this.syncUI()
          break
        case 'restart':
          this.handleRedo()
          break
        case 'get-state':
          window.parent.postMessage(
            {
              type: 'state-reply',
              state: {
                phase: this.state.phase,
                scenario: this.state.currentScenarioId,
                stage: this.state.stage,
                historyLength: this.state.history.length
              }
            },
            '*'
          )
          break
      }
    })
  }

  // --- Handlers ---

  private handleSelectChoice(choiceId: string) {
    this.audio.play('click')
    const res = dispatch(this.state, { type: 'choose-option', choiceId })
    if (res.effect === 'ask' || res.effect === 'normal') {
      this.audio.play('chime')
    } else if (res.effect === 'wait') {
      this.audio.play('tick')
    } else if (res.effect === 'exit') {
      this.audio.play('exit')
    }

    if (this.state.isFinished) {
      this.audio.play('success')
      this.ui.openSummaryModal(this.state)
    }

    this.syncUI()
    this.persist()
  }

  private handleContinue() {
    // If on terminal node or finished, open summary
    if (this.state.isFinished) {
      this.ui.openSummaryModal(this.state)
    } else {
      this.audio.play('page')
      // Advance with first choice
      const scenario = SCENARIOS[this.state.currentScenarioId] || SCENARIOS.padaria_pao
      const node = scenario.nodes[this.state.currentNodeId]
      if (node && node.choices.length > 0) {
        this.handleSelectChoice(node.choices[0].id)
      }
    }
  }

  private handleRedo() {
    this.audio.play('click')
    dispatch(this.state, { type: 'reset' })
    this.syncUI()
    this.persist()
  }

  private handleUndo() {
    this.audio.play('click')
    dispatch(this.state, { type: 'undo' })
    this.syncUI()
    this.persist()
  }

  private async handleToggleSound() {
    const enabled = await this.audio.toggle()
    this.state.settings.sound = enabled
    this.syncUI()
  }

  private handleToggleLowStim() {
    const nextVal = !this.state.settings.lowStimulation
    this.state.settings.lowStimulation = nextVal
    this.scene?.setLowStimulation(nextVal)
    this.syncUI()
    this.persist()
  }

  private handleToggleFallback() {
    const isHidden = this.ui.fallback2DEl.hidden
    if (isHidden) {
      this.enableFallback2D()
    } else {
      this.disableFallback2D()
    }
  }

  private handleOpenScenarios() {
    this.ui.scenariosModal.hidden = false
  }

  private handleOpenSettings() {
    this.ui.settingsModal.hidden = false
  }

  private handleSelectScenario(scenarioId: string) {
    this.audio.play('chime')
    dispatch(this.state, { type: 'start-scenario', scenarioId })
    this.syncUI()
    this.persist()
  }

  private handleSelectLocation(locationId: LocationId) {
    this.audio.play('page')
    // Find first scenario in that location
    const sc = Object.values(SCENARIOS).find(s => s.locationId === locationId)
    if (sc) {
      dispatch(this.state, { type: 'start-scenario', scenarioId: sc.id })
      this.syncUI()
      this.persist()
    }
  }

  private handleSubmitCustomText(text: string) {
    this.audio.play('click')
    dispatch(this.state, { type: 'custom-text', text })
    this.syncUI()
    this.persist()
  }

  private handleSaveObservation(obs: ObservationType, notes: string) {
    this.audio.play('success')
    dispatch(this.state, {
      type: 'observe',
      opportunity: this.state.observations.length + 1,
      result: obs,
      notes
    })

    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'session-complete',
          app: '12-cidade-das-conversas',
          observation: obs,
          notes,
          history: this.state.history
        },
        '*'
      )
    }

    this.persist()
  }

  private persist() {
    collection('write', this.state).catch((err: unknown) => {
      console.warn('IDB write failure:', err)
    })
  }

  private syncUI() {
    this.ui.updateState(this.state)
  }

  private isDisposed = false

  public dispose() {
    if (this.isDisposed) return
    this.isDisposed = true
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
    this.scene?.dispose()
    this.audio?.dispose?.()
  }
}

// Bootstrap application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new CityApp()
  const handleDispose = () => app.dispose()
  window.addEventListener('sangi:dispose', handleDispose)
  window.addEventListener('beforeunload', handleDispose)
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
      handleDispose()
    }
  })

  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch(() => { })
  }
})
