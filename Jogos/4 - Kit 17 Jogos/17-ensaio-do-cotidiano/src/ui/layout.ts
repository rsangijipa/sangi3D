import { WAYPOINTS, MISSIONS, PRODUCTS } from '../game/content.ts'
import type { GameState, WaypointId, Observation } from '../game/state.ts'
import { validateCheckout } from '../game/rules.ts'

export interface UIEvents {
  onSelectWaypoint: (wp: WaypointId) => void
  onToggleSound: () => void
  onToggleLowStim: () => void
  onToggleCarrier: () => void
  onAskHelp: () => void
  onOpenCheckout: () => void
  onOpenMissions: () => void
  onOpenSettings: () => void
  onToggleFallback: () => void
  onRingBell: () => void
  onConfirmCheckout: () => void
  onSaveObservation: (obs: Observation, notes: string) => void
  onRestartMission: () => void
  onSelectMission: (missionId: string) => void
  onPick2DItem: (itemId: string) => void
  onToggleControlsHide: () => void
}

export class UIManager {
  private container: HTMLElement
  private events: UIEvents

  // DOM Elements
  public liveStatusEl!: HTMLElement
  public appTitleEl!: HTMLElement
  public soundBtn!: HTMLButtonElement
  public lowStimBtn!: HTMLButtonElement
  public missionHud!: HTMLElement
  public waypointBar!: HTMLElement
  public npcBubble!: HTMLElement
  public fallback2DEl!: HTMLElement

  // Modals
  public missionsModal!: HTMLElement
  public checkoutModal!: HTMLElement
  public summaryModal!: HTMLElement
  public settingsModal!: HTMLElement

  private controlsHidden: boolean = false

  constructor(container: HTMLElement, events: UIEvents) {
    this.container = container
    this.events = events
    this.buildDOM()
  }

  private buildDOM() {
    this.container.innerHTML = `
      <div id="viewport-container">
        <canvas id="webgl-canvas"></canvas>
      </div>

      <!-- 2D Fallback Planogram (shown when WebGL fails or disabled) -->
      <div id="fallback-2d" hidden>
        <div class="fallback-content">
          <h2 style="color: var(--color-primary); margin-bottom: 8px;">🗺️ Mercadinho Acolhedor · Vista 2D</h2>
          <p style="font-size: 13px; color: var(--color-text-muted);">
            Plano esquemático interativo com navegação e seleção direta de itens.
          </p>
          <svg class="fallback-svg-map" viewBox="0 0 600 320">
            <!-- Floor -->
            <rect x="10" y="10" width="580" height="300" rx="14" fill="#FAF5E9" stroke="#A76C3D" stroke-width="2"/>
            <!-- Moss rug aisle -->
            <rect x="230" y="20" width="140" height="280" rx="8" fill="#48634B" opacity="0.35"/>
            <!-- Shelves Left (Produce) -->
            <rect x="30" y="30" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="115" y="50" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🍎 Banca de Frutas</text>
            <!-- Shelves Right (Pantry) -->
            <rect x="400" y="30" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="485" y="50" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🌾 Mantimentos</text>
            <!-- Shelves Right-Back (Bakery) -->
            <rect x="400" y="160" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="485" y="180" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🍞 Padaria & Leite</text>
            <!-- Checkout Counter (Back-Left) -->
            <rect x="30" y="160" width="170" height="110" rx="6" fill="#C89D66" stroke="#254533" stroke-width="2"/>
            <text x="115" y="180" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🔔 Balcão do Caixa</text>
            <!-- Waypoint circles -->
            <circle cx="300" cy="270" r="16" fill="#254533" class="svg-wp" data-wp="entrance" style="cursor:pointer"/>
            <text x="300" y="275" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">1</text>
            <circle cx="115" cy="85" r="16" fill="#254533" class="svg-wp" data-wp="produce" style="cursor:pointer"/>
            <text x="115" y="90" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">2</text>
            <circle cx="485" cy="85" r="16" fill="#254533" class="svg-wp" data-wp="pantry" style="cursor:pointer"/>
            <text x="485" y="90" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">3</text>
            <circle cx="485" cy="215" r="16" fill="#254533" class="svg-wp" data-wp="bakery" style="cursor:pointer"/>
            <text x="485" y="220" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">4</text>
            <circle cx="115" cy="215" r="16" fill="#254533" class="svg-wp" data-wp="checkout" style="cursor:pointer"/>
            <text x="115" y="220" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">5</text>
          </svg>
          <div id="fallback-item-chips" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 12px;"></div>
        </div>
      </div>

      <!-- Top Immersive Bar -->
      <header id="immersive-bar">
        <div class="bar-cluster-left">
          <button id="btn-missions" class="icon-button" title="Mudar Missão" aria-label="Mudar Missão">
            📋 <span style="font-size: 12px;">Missões</span>
          </button>
          <button id="btn-carrier-toggle" class="icon-button" title="Alternar Carrinho/Cesta" aria-label="Alternar Carrinho ou Cesta">
            🛒 <span id="carrier-label" style="font-size: 12px;">Carrinho</span>
          </button>
        </div>

        <div class="bar-center">
          <span class="app-title">Ensaio do Cotidiano</span>
          <span class="context-badge" id="context-badge">Mercadinho</span>
        </div>

        <div class="bar-cluster-right">
          <button id="btn-sound" class="icon-button active" title="Som" aria-label="Alternar Som">🔊</button>
          <button id="btn-low-stim" class="icon-button" title="Baixo Estímulo" aria-label="Modo Baixo Estímulo">🌿</button>
          <button id="btn-settings" class="icon-button" title="Ajustes" aria-label="Ajustes">⚙️</button>
          <button id="btn-hide-ui" class="icon-button" title="Ocultar Interface (H)" aria-label="Ocultar Controles">👁️</button>
        </div>
      </header>

      <!-- Mission HUD -->
      <aside id="mission-hud">
        <div class="hud-header">
          <div class="hud-title-wrap">
            <span class="hud-mission-title" id="hud-mission-title">Lanche da Tarde</span>
            <span class="hud-carrier-tag" id="hud-carrier-tag">Uso: Carrinho</span>
          </div>
          <button id="btn-ask-help" class="btn-hud" title="Pedir Ajuda">
            🙋 Ajuda
          </button>
        </div>
        <div class="hud-checklist" id="hud-checklist"></div>
        <div class="hud-actions">
          <button id="btn-open-checkout" class="btn-hud btn-checkout">
            🔔 Finalizar no Caixa
          </button>
        </div>
      </aside>

      <!-- Bottom Waypoint Bar -->
      <nav id="waypoint-bar" aria-label="Navegação de Setores"></nav>

      <!-- Cashier / NPC Bubble -->
      <div id="npc-speech-bubble" hidden>
        <div class="speech-avatar">🧑‍🌾</div>
        <div class="speech-text-wrap">
          <div class="speech-title">Atendente do Mercadinho</div>
          <div class="speech-message" id="npc-speech-text">Olá! Em que posso te ajudar hoje?</div>
        </div>
        <button id="btn-close-speech" class="speech-close" aria-label="Fechar">✕</button>
      </div>

      <!-- Live Status Badge (for tests & accessibility) -->
      <div id="live-status" role="status" aria-live="polite">Status: Pronto</div>

      <!-- Modals Container -->
      <div id="modals-root"></div>
    `

    this.initElements()
    this.renderWaypoints()
    this.renderModals()
    this.bindDOMEvents()
  }

  private initElements() {
    this.liveStatusEl = document.getElementById('live-status')!
    this.appTitleEl = document.querySelector('.app-title')!
    this.soundBtn = document.getElementById('btn-sound') as HTMLButtonElement
    this.lowStimBtn = document.getElementById('btn-low-stim') as HTMLButtonElement
    this.missionHud = document.getElementById('mission-hud')!
    this.waypointBar = document.getElementById('waypoint-bar')!
    this.npcBubble = document.getElementById('npc-speech-bubble')!
    this.fallback2DEl = document.getElementById('fallback-2d')!
  }

  private renderWaypoints() {
    this.waypointBar.innerHTML = Object.values(WAYPOINTS)
      .map(
        wp => `
        <button class="waypoint-btn ${wp.id === 'entrance' ? 'active' : ''}" data-wp="${wp.id}">
          ${wp.label}
        </button>
      `
      )
      .join('')
  }

  private renderModals() {
    const modalsRoot = document.getElementById('modals-root')!

    // 1. Mission Selector Modal
    this.missionsModal = document.createElement('div')
    this.missionsModal.id = 'modal-missions'
    this.missionsModal.className = 'modal-overlay'
    this.missionsModal.hidden = true
    this.missionsModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">📋 Escolha uma Atividade do Cotidiano</h2>
          <button class="modal-close-btn" data-close="missions">✕</button>
        </div>
        <div class="modal-body">
          <div class="mission-grid" id="modal-mission-list">
            ${Object.values(MISSIONS)
              .map(
                m => `
              <div class="mission-card-option" data-mission="${m.id}">
                <div style="font-weight: 700; color: var(--color-primary); font-size: 14px;">${m.title}</div>
                <div style="font-size: 12px; color: var(--color-accent);">${m.subtitle}</div>
                <div style="font-size: 12px; color: var(--color-text-muted);">${m.description}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.missionsModal)

    // 2. Checkout Modal
    this.checkoutModal = document.createElement('div')
    this.checkoutModal.id = 'modal-checkout'
    this.checkoutModal.className = 'modal-overlay'
    this.checkoutModal.hidden = true
    this.checkoutModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">🔔 Caixa do Mercadinho</h2>
          <button class="modal-close-btn" data-close="checkout">✕</button>
        </div>
        <div class="modal-body">
          <div class="service-bell-cta" id="btn-modal-bell">
            🛎️ Toque a campainha para chamar o atendente
          </div>
          <div style="font-weight: 600; font-size: 14px;">Itens colocados no cesto:</div>
          <div id="checkout-items-list" style="display:flex; flex-direction:column; gap:6px;"></div>
          <div id="checkout-validation-status" style="padding:10px; border-radius:8px; font-size:13px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" data-close="checkout">Voltar às compras</button>
          <button class="btn-primary" id="btn-finish-payment">Concluir no Caixa</button>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.checkoutModal)

    // 3. Session Summary Modal
    this.summaryModal = document.createElement('div')
    this.summaryModal.id = 'modal-summary'
    this.summaryModal.className = 'modal-overlay'
    this.summaryModal.hidden = true
    this.summaryModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">🎉 Atividade Concluída!</h2>
          <button class="modal-close-btn" data-close="summary">✕</button>
        </div>
        <div class="modal-body">
          <p id="summary-feedback" style="font-size: 14px; color: var(--color-text);">Parabéns! Você passou pelo caixa com sucesso.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #FAF5E9; padding: 12px; border-radius: 10px;">
            <div><strong>Itens comprados:</strong> <span id="summary-items-count">0</span></div>
            <div><strong>Pedidos de ajuda:</strong> <span id="summary-help-count">0</span></div>
          </div>
          <div style="border-top: 1px solid #EAE3D5; padding-top: 10px;">
            <label style="font-weight: 600; font-size: 13px;">Registro do Acompanhante / Avaliação:</label>
            <div style="display:flex; gap:8px; margin: 8px 0; flex-wrap: wrap;">
              <button class="btn-secondary btn-obs" data-obs="Independente">Independente</button>
              <button class="btn-secondary btn-obs" data-obs="Com ajuda">Com ajuda</button>
              <button class="btn-secondary btn-obs" data-obs="Não realizada">Não realizada</button>
              <button class="btn-secondary btn-obs" data-obs="Recusada">Recusada</button>
            </div>
            <textarea id="summary-obs-notes" rows="2" placeholder="Observações clínicas ou pedagógicas..." style="width: 100%; border: 1px solid var(--color-border); border-radius: 8px; padding: 8px; font-family: inherit; font-size: 12px;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" id="btn-save-summary">Salvar e Continuar</button>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.summaryModal)

    // 4. Settings Modal
    this.settingsModal = document.createElement('div')
    this.settingsModal.id = 'modal-settings'
    this.settingsModal.className = 'modal-overlay'
    this.settingsModal.hidden = true
    this.settingsModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Ajustes e Acessibilidade</h2>
          <button class="modal-close-btn" data-close="settings">✕</button>
        </div>
        <div class="modal-body">
          <div class="setting-row">
            <div>
              <div class="setting-label">🌿 Modo Baixo Estímulo</div>
              <div class="setting-desc">Luz suave, cores atenuadas e sem brilhos intensos</div>
            </div>
            <input type="checkbox" id="chk-low-stim" style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">🔊 Efeitos Sonoros</div>
              <div class="setting-desc">Campainha de serviço, passos e colocação no carrinho</div>
            </div>
            <input type="checkbox" id="chk-sound" checked style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">🗺️ Modo Planta 2D</div>
              <div class="setting-desc">Visualizar mapa simplificado sem renderização 3D</div>
            </div>
            <input type="checkbox" id="chk-fallback-2d" style="width:20px; height:20px; cursor:pointer"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" data-close="settings">Concluído</button>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.settingsModal)
  }

  private bindDOMEvents() {
    // Waypoints Bar clicks
    this.waypointBar.addEventListener('click', e => {
      const btn = (e.target as HTMLElement).closest('.waypoint-btn') as HTMLElement
      if (btn && btn.dataset.wp) {
        this.events.onSelectWaypoint(btn.dataset.wp as WaypointId)
      }
    })

    // SVG 2D Waypoints clicks
    this.fallback2DEl.addEventListener('click', e => {
      const wpCircle = (e.target as HTMLElement).closest('.svg-wp') as HTMLElement
      if (wpCircle && wpCircle.dataset.wp) {
        this.events.onSelectWaypoint(wpCircle.dataset.wp as WaypointId)
      }
      const chip = (e.target as HTMLElement).closest('.fallback-item-btn') as HTMLElement
      if (chip && chip.dataset.item) {
        this.events.onPick2DItem(chip.dataset.item)
      }
    })

    // Immersive Bar actions
    document.getElementById('btn-sound')!.addEventListener('click', () => this.events.onToggleSound())
    document.getElementById('btn-low-stim')!.addEventListener('click', () => this.events.onToggleLowStim())
    document.getElementById('btn-carrier-toggle')!.addEventListener('click', () => this.events.onToggleCarrier())
    document.getElementById('btn-missions')!.addEventListener('click', () => this.events.onOpenMissions())
    document.getElementById('btn-settings')!.addEventListener('click', () => this.events.onOpenSettings())
    document.getElementById('btn-hide-ui')!.addEventListener('click', () => this.events.onToggleControlsHide())

    // HUD buttons
    document.getElementById('btn-ask-help')!.addEventListener('click', () => this.events.onAskHelp())
    document.getElementById('btn-open-checkout')!.addEventListener('click', () => this.events.onOpenCheckout())

    // NPC Speech Bubble close
    document.getElementById('btn-close-speech')!.addEventListener('click', () => {
      this.npcBubble.hidden = true
    })

    // Modals close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', e => {
        const modalType = (e.currentTarget as HTMLElement).dataset.close
        if (modalType === 'missions') this.missionsModal.hidden = true
        if (modalType === 'checkout') this.checkoutModal.hidden = true
        if (modalType === 'summary') this.summaryModal.hidden = true
        if (modalType === 'settings') this.settingsModal.hidden = true
      })
    })

    // Mission selection clicks inside modal
    document.getElementById('modal-mission-list')!.addEventListener('click', e => {
      const card = (e.target as HTMLElement).closest('.mission-card-option') as HTMLElement
      if (card && card.dataset.mission) {
        this.events.onSelectMission(card.dataset.mission)
        this.missionsModal.hidden = true
      }
    })

    // Checkout modal actions
    document.getElementById('btn-modal-bell')!.addEventListener('click', () => this.events.onRingBell())
    document.getElementById('btn-finish-payment')!.addEventListener('click', () => this.events.onConfirmCheckout())

    // Summary modal observation clicks
    let selectedObs: Observation = 'Independente'
    this.summaryModal.querySelectorAll('.btn-obs').forEach(btn => {
      btn.addEventListener('click', e => {
        this.summaryModal.querySelectorAll('.btn-obs').forEach(b => b.classList.remove('btn-primary'))
        const target = e.currentTarget as HTMLElement
        target.classList.add('btn-primary')
        selectedObs = target.dataset.obs as Observation
      })
    })

    document.getElementById('btn-save-summary')!.addEventListener('click', () => {
      const notes = (document.getElementById('summary-obs-notes') as HTMLTextAreaElement).value
      this.events.onSaveObservation(selectedObs, notes)
      this.summaryModal.hidden = true
    })

    // Settings modal switches
    document.getElementById('chk-low-stim')!.addEventListener('change', () => this.events.onToggleLowStim())
    document.getElementById('chk-sound')!.addEventListener('change', () => this.events.onToggleSound())
    document.getElementById('chk-fallback-2d')!.addEventListener('change', () => this.events.onToggleFallback())
  }

  public updateState(state: GameState) {
    // 1. Waypoint button active class
    this.waypointBar.querySelectorAll('.waypoint-btn').forEach(b => {
      const btn = b as HTMLElement
      if (btn.dataset.wp === state.currentWaypoint) {
        btn.classList.add('active')
      } else {
        btn.classList.remove('active')
      }
    })

    // 2. Carrier toggle button label
    const carrierLabel = document.getElementById('carrier-label')!
    carrierLabel.textContent = state.carrier === 'cart' ? 'Carrinho' : 'Cesta'
    const hudCarrier = document.getElementById('hud-carrier-tag')!
    hudCarrier.textContent = `Uso: ${state.carrier === 'cart' ? 'Carrinho de Metal' : 'Cesta de Vime'}`

    // 3. Sound and Low Stim buttons
    this.soundBtn.classList.toggle('active', state.settings.sound)
    this.soundBtn.textContent = state.settings.sound ? '🔊' : '🔇'
    this.lowStimBtn.classList.toggle('active', state.lowStimulation)

    const chkLow = document.getElementById('chk-low-stim') as HTMLInputElement
    if (chkLow) chkLow.checked = state.lowStimulation
    const chkSound = document.getElementById('chk-sound') as HTMLInputElement
    if (chkSound) chkSound.checked = state.settings.sound

    // 4. Mission HUD checklist
    const mission = MISSIONS[state.currentMissionId] || MISSIONS.market_snack
    document.getElementById('hud-mission-title')!.textContent = mission.title
    const checklistEl = document.getElementById('hud-checklist')!

    checklistEl.innerHTML = mission.requiredItemIds
      .map(id => {
        const prod = PRODUCTS[id]
        const isCollected = state.inventory.includes(id) || (mission.alternatives?.[id] && state.inventory.includes(mission.alternatives[id]))
        return `
        <div class="hud-item ${isCollected ? 'collected' : ''}">
          <span class="hud-item-icon">${prod?.icon || '📦'}</span>
          <span style="flex:1;">${prod?.name || id}</span>
          <span class="hud-item-check">${isCollected ? '✓' : '○'}</span>
        </div>
      `
      })
      .join('')

    // 5. Context badge
    const badge = document.getElementById('context-badge')!
    badge.textContent = mission.context === 'market' ? 'Mercadinho' : mission.context === 'library' ? 'Biblioteca' : 'Mochila'

    // 6. 2D fallback items
    this.updateFallbackItems(state)

    // 7. Live Status text
    this.liveStatusEl.textContent = `Status: ${state.phase} | Setor: ${state.currentWaypoint} | Itens: ${state.inventory.length}`
  }

  private updateFallbackItems(state: GameState) {
    const chipsContainer = document.getElementById('fallback-item-chips')
    if (!chipsContainer) return

    chipsContainer.innerHTML = Object.values(PRODUCTS)
      .map(p => {
        const inCart = state.inventory.includes(p.id)
        return `
        <button class="btn-secondary fallback-item-btn" data-item="${p.id}" style="${inCart ? 'background:#E8F0EA; border-color:#2E7D32;' : ''}">
          ${p.icon} ${p.name} ${inCart ? '✓' : '+'}
        </button>
      `
      })
      .join('')
  }

  public showSpeech(text: string) {
    const speechEl = document.getElementById('npc-speech-text')!
    speechEl.textContent = text
    this.npcBubble.hidden = false
  }

  public hideSpeech() {
    this.npcBubble.hidden = true
  }

  public openCheckoutModal(state: GameState) {
    const listEl = document.getElementById('checkout-items-list')!
    const statusEl = document.getElementById('checkout-validation-status')!

    if (state.inventory.length === 0) {
      listEl.innerHTML = `<div style="font-size:13px; color:var(--color-text-muted); font-style:italic;">Seu cesto está vazio no momento.</div>`
    } else {
      listEl.innerHTML = state.inventory
        .map(id => {
          const prod = PRODUCTS[id]
          return `
          <div style="display:flex; align-items:center; justify-content:space-between; background:#FAF5E9; padding:6px 10px; border-radius:6px; font-size:13px;">
            <span>${prod?.icon || '📦'} ${prod?.name || id}</span>
            <span style="color:var(--color-success); font-weight:bold;">No carrinho</span>
          </div>
        `
        })
        .join('')
    }

    const val = validateCheckout(state)
    if (val.isComplete) {
      statusEl.style.background = '#E8F5E9'
      statusEl.style.color = '#2E7D32'
      statusEl.textContent = '✓ Todos os itens da missão foram conferidos e validados!'
    } else {
      statusEl.style.background = '#FFF3E0'
      statusEl.style.color = '#B96A46'
      statusEl.textContent = `Atenção: faltam itens (${val.missingItems.map((m: string) => PRODUCTS[m]?.name || m).join(', ')}). Você pode concluir assim mesmo ou continuar procurando.`
    }

    this.checkoutModal.hidden = false
  }

  public openSummaryModal(state: GameState) {
    this.checkoutModal.hidden = true
    document.getElementById('summary-items-count')!.textContent = `${state.inventory.length}`
    document.getElementById('summary-help-count')!.textContent = `${state.helpCount}`
    this.summaryModal.hidden = false
  }

  public toggleControlsHide() {
    this.controlsHidden = !this.controlsHidden
    this.missionHud.hidden = this.controlsHidden
    this.waypointBar.hidden = this.controlsHidden
  }
}
