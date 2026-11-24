import { initial, type GameState, type WaypointId, type Observation } from './game/state.ts'
import { dispatch } from './game/rules.ts'
import { NPC_DIALOGS, MISSIONS } from './game/content.ts'
import { MarketAudio } from './audio.ts'
import { collection } from './storage.ts'
import { UIManager } from './ui/layout.ts'
import type { MarketScene } from './scene/index.ts'

class GameApp {
  private state: GameState
  private ui!: UIManager
  private audio: MarketAudio
  private scene: MarketScene | null = null
  private appEl: HTMLElement

  constructor() {
    this.appEl = document.getElementById('app')!
    this.audio = new MarketAudio()
    this.state = initial(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    this.init()
  }

  private async init() {
    // 1. Initialize UI
    this.ui = new UIManager(this.appEl, {
      onSelectWaypoint: (wp: WaypointId) => this.handleWaypointSelect(wp),
      onToggleSound: () => this.handleToggleSound(),
      onToggleLowStim: () => this.handleToggleLowStim(),
      onToggleCarrier: () => this.handleToggleCarrier(),
      onAskHelp: () => this.handleAskHelp(),
      onOpenCheckout: () => this.handleOpenCheckout(),
      onOpenMissions: () => this.handleOpenMissions(),
      onOpenSettings: () => this.handleOpenSettings(),
      onToggleFallback: () => this.handleToggleFallback(),
      onRingBell: () => this.handleRingBell(),
      onConfirmCheckout: () => this.handleConfirmCheckout(),
      onSaveObservation: (obs: Observation, notes: string) => this.handleSaveObservation(obs, notes),
      onRestartMission: () => this.handleRestartMission(),
      onSelectMission: (id: string) => this.handleSelectMission(id),
      onPick2DItem: (id: string) => this.handlePickItem(id),
      onToggleControlsHide: () => this.ui.toggleControlsHide()
    })

    // 2. Load stored session state from IndexedDB
    try {
      const saved = await collection('read')
      if (saved) {
        this.state.currentWaypoint = saved.currentWaypoint
        this.state.carrier = saved.carrier
        this.state.inventory = [...saved.inventory]
        this.state.helpCount = saved.helpCount
        this.state.lowStimulation = saved.lowStimulation
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

    // 6. Sync UI
    this.syncAll()

    // Signal ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'ready', app: '17-ensaio-do-cotidiano' }, '*')
    }
  }

  private async setupScene() {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
    const container = document.getElementById('viewport-container')!

    try {
      const { MarketScene } = await import('./scene/index.ts')
      this.scene = new MarketScene(container, canvas, {
        onPickItem: (productId: string) => this.handlePickItem(productId),
        onRingBell: () => this.handleRingBell(),
        onWaypointReached: (waypoint: WaypointId) => {
          dispatch(this.state, { type: 'move-waypoint', waypoint })
          this.syncUI()
        }
      })

      // Sync scene with loaded state
      this.scene.setWaypoint(this.state.currentWaypoint, true)
      this.scene.updateCartCarrier(this.state.carrier)
      this.scene.updateCartContents(this.state.inventory)
      this.scene.setLowStimulation(this.state.lowStimulation)
    } catch (e) {
      console.warn('WebGL2 not available or scene error, enabling 2D fallback mode:', e)
      this.enableFallback2D()
    }
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
      // Ignore when typing inside input / textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.key === 'h' || e.key === 'H') {
        this.ui.toggleControlsHide()
      } else if (e.key === 'Escape') {
        this.ui.missionsModal.hidden = true
        this.ui.checkoutModal.hidden = true
        this.ui.summaryModal.hidden = true
        this.ui.settingsModal.hidden = true
        this.ui.hideSpeech()
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault()
        dispatch(this.state, { type: 'undo' })
        this.audio.play('drop')
        this.syncAll()
      } else if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault()
        dispatch(this.state, { type: 'redo' })
        this.audio.play('drop')
        this.syncAll()
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const waypoints: WaypointId[] = ['entrance', 'produce', 'pantry', 'bakery', 'checkout']
        const target = waypoints[parseInt(e.key, 10) - 1]
        if (target) this.handleWaypointSelect(target)
      }
    })
  }

  private setupIframeProtocol() {
    window.addEventListener('message', e => {
      const data = e.data
      if (!data || typeof data !== 'object') return

      switch (data.type) {
        case 'ping':
          window.parent.postMessage({ type: 'ready', app: '17-ensaio-do-cotidiano' }, '*')
          break
        case 'pause':
          dispatch(this.state, { type: 'pause' })
          this.syncUI()
          break
        case 'resume':
          dispatch(this.state, { type: 'resume' })
          this.syncUI()
          break
        case 'restart':
          this.handleRestartMission()
          break
        case 'get-state':
          window.parent.postMessage(
            {
              type: 'state-reply',
              state: {
                phase: this.state.phase,
                waypoint: this.state.currentWaypoint,
                inventory: this.state.inventory,
                helpCount: this.state.helpCount
              }
            },
            '*'
          )
          break
      }
    })
  }

  // --- Game Event Handlers ---

  private handleWaypointSelect(wp: WaypointId) {
    if (this.state.currentWaypoint === wp) return
    this.audio.play('step')
    dispatch(this.state, { type: 'move-waypoint', waypoint: wp })
    this.scene?.setWaypoint(wp)
    this.syncUI()
    this.persist()
  }

  private handlePickItem(productId: string) {
    const alreadyInCart = this.state.inventory.includes(productId)
    if (alreadyInCart) {
      // Remove from cart
      dispatch(this.state, { type: 'remove-from-cart', itemId: productId })
      this.audio.play('drop')
    } else {
      // Add to cart with flight animation
      dispatch(this.state, { type: 'add-to-cart', itemId: productId })
      this.audio.play('pick')
      if (this.scene) {
        this.scene.playFlyItemAnimation(productId, () => {
          this.audio.play('drop')
        })
      }
    }

    this.scene?.updateCartContents(this.state.inventory)
    this.syncUI()
    this.persist()
  }

  private handleRingBell() {
    this.audio.play('bell')
    this.scene?.ringBellAnimation()
    this.ui.showSpeech('🔔 Plim! O atendente vem até o balcão: "Olá! Como posso ajudar você a conferir suas compras?"')
  }

  private handleAskHelp() {
    const mission = MISSIONS[this.state.currentMissionId] || MISSIONS.market_snack
    // Find first missing item
    const missing = mission.requiredItemIds.find(id => !this.state.inventory.includes(id))
    const dialog = missing && NPC_DIALOGS[missing] ? NPC_DIALOGS[missing] : NPC_DIALOGS.time

    dispatch(this.state, { type: 'ask-help', topic: missing || 'geral' })
    this.audio.play('success')
    this.ui.showSpeech(dialog)
    this.syncUI()
    this.persist()
  }

  private handleToggleCarrier() {
    const nextCarrier = this.state.carrier === 'cart' ? 'basket' : 'cart'
    dispatch(this.state, { type: 'set-carrier', carrier: nextCarrier })
    this.audio.play('pick')
    this.scene?.updateCartCarrier(nextCarrier)
    this.syncUI()
    this.persist()
  }

  private async handleToggleSound() {
    const enabled = await this.audio.toggle()
    this.state.settings.sound = enabled
    this.syncUI()
  }

  private handleToggleLowStim() {
    const nextVal = !this.state.lowStimulation
    dispatch(this.state, { type: 'toggle-low-stim' })
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

  private handleOpenCheckout() {
    dispatch(this.state, { type: 'checkout' })
    this.handleWaypointSelect('checkout')
    this.ui.openCheckoutModal(this.state)
    this.syncUI()
  }

  private handleConfirmCheckout() {
    this.audio.play('success')
    this.ui.openSummaryModal(this.state)
    dispatch(this.state, { type: 'confirm-purchase' })
    this.syncUI()
    this.persist()
  }

  private handleSaveObservation(obs: Observation, notes: string) {
    dispatch(this.state, {
      type: 'observe',
      opportunity: this.state.observations.length + 1,
      actionName: 'checkout_completion',
      result: obs
    })

    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'session-complete',
          app: '17-ensaio-do-cotidiano',
          observation: obs,
          notes,
          inventory: this.state.inventory,
          helpCount: this.state.helpCount
        },
        '*'
      )
    }

    this.persist()
    this.ui.showSpeech('Registro salvo com sucesso! Você pode explorar o mercadinho ou selecionar outra missão.')
  }

  private handleOpenMissions() {
    this.ui.missionsModal.hidden = false
  }

  private handleOpenSettings() {
    this.ui.settingsModal.hidden = false
  }

  private handleSelectMission(missionId: string) {
    dispatch(this.state, { type: 'start', missionId })
    this.scene?.updateCartContents(this.state.inventory)
    this.syncAll()
    this.persist()
  }

  private handleRestartMission() {
    dispatch(this.state, { type: 'reset' })
    this.scene?.setWaypoint('entrance')
    this.scene?.updateCartContents(this.state.inventory)
    this.syncAll()
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

  private syncAll() {
    this.syncUI()
    this.scene?.updateCartContents(this.state.inventory)
    this.scene?.updateCartCarrier(this.state.carrier)
  }
}

// Bootstrap application on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new GameApp()

  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  }
})

