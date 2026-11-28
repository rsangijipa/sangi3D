import { SCENARIOS, LOCATIONS } from '../game/content.ts'
import type { GameState, LocationId, ObservationType, Choice } from '../game/state.ts'

export interface UIEvents {
  onSelectChoice: (choiceId: string) => void
  onContinue: () => void
  onRedo: () => void
  onToggleSound: () => void
  onToggleLowStim: () => void
  onToggleFallback: () => void
  onOpenScenarios: () => void
  onOpenSettings: () => void
  onSelectScenario: (scenarioId: string) => void
  onSelectLocation: (locationId: LocationId) => void
  onSubmitCustomText: (text: string) => void
  onSaveObservation: (obs: ObservationType, notes: string) => void
  onToggleControlsHide: () => void
}

export class UIManager {
  private container: HTMLElement
  private events: UIEvents

  // DOM Elements
  public liveStatusEl!: HTMLElement
  public speechBubbleEl!: HTMLElement
  public stageChipEl!: HTMLElement
  public choicesContainer!: HTMLElement
  public btnContinue!: HTMLButtonElement
  public btnRedo!: HTMLButtonElement
  public soundBtn!: HTMLButtonElement
  public lowStimBtn!: HTMLButtonElement
  public fallback2DEl!: HTMLElement
  public dialogueHud!: HTMLElement

  // Modals
  public scenariosModal!: HTMLElement
  public summaryModal!: HTMLElement
  public settingsModal!: HTMLElement

  private selectedChoiceId: string | null = null
  private controlsHidden = false

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

      <!-- 2D Fallback Map (when WebGL is disabled or unavailable) -->
      <div id="fallback-2d" hidden>
        <div class="fallback-content">
          <h2 style="color: var(--color-primary); font-family: var(--font-serif); margin-bottom: 6px;">🗺️ Cidade das Conversas · Mapa 2D</h2>
          <p style="font-size: 13px; color: var(--color-text-muted);">
            Plano esquemático interativo com navegação e seleção direta de locais e diálogos.
          </p>
          <svg class="fallback-svg-map" viewBox="0 0 600 300">
            <!-- Ground -->
            <rect x="10" y="10" width="580" height="280" rx="14" fill="#FAF5E9" stroke="#C89D66" stroke-width="2"/>
            <!-- Cobblestone street path -->
            <path d="M 40 240 Q 200 230 320 180 T 560 120" fill="none" stroke="#CDC4B5" stroke-width="50" stroke-linecap="round"/>
            <!-- Bakery Stall (Center-Right) -->
            <rect x="340" y="100" width="140" height="90" rx="8" fill="#DECEB5" stroke="#825434" stroke-width="2"/>
            <text x="410" y="145" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🥖 Padaria</text>
            <!-- Bus Stop (Far-Left) -->
            <rect x="50" y="180" width="100" height="70" rx="6" fill="#C4BCAD" stroke="#2766AA" stroke-width="2"/>
            <text x="100" y="220" font-size="11" font-weight="bold" fill="#2766AA" text-anchor="middle">🚏 Ponto de Ônibus</text>
            <!-- Playground (Mid-Left) -->
            <rect x="150" y="70" width="110" height="80" rx="8" fill="#E8DEC9" stroke="#79835A" stroke-width="1.5"/>
            <text x="205" y="115" font-size="11" font-weight="bold" fill="#254533" text-anchor="middle">🌳 Praça & Balanço</text>
            <!-- Schoolhouse (Top-Center) -->
            <rect x="230" y="20" width="130" height="70" rx="6" fill="#F4EEE2" stroke="#BA5F3E" stroke-width="2"/>
            <text x="295" y="55" font-size="11" font-weight="bold" fill="#BA5F3E" text-anchor="middle">🏫 Escola do Bairro</text>
            <!-- Library (Top-Right) -->
            <rect x="440" y="30" width="120" height="70" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="500" y="65" font-size="11" font-weight="bold" fill="#254533" text-anchor="middle">📚 Biblioteca</text>
          </svg>
          <div id="fallback-scenario-chips" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:10px;"></div>
        </div>
      </div>

      <!-- Hanging Wooden Board: Cidade das Conversas -->
      <div id="hanging-sign-wrap">
        <div class="sign-ropes">
          <div class="rope"></div>
          <div class="rope"></div>
        </div>
        <div class="wooden-board">
          <span class="board-leaf">🌿</span>
          <h1 class="board-title">Cidade das Conversas</h1>
          <span class="board-leaf">🌿</span>
        </div>
      </div>

      <!-- 3D Anchored HTML Speech Bubble above Baker -->
      <div id="anchored-speech-bubble" style="left: 60%; top: 38%;">
        Posso te ajudar?
      </div>

      <!-- Top Immersive Controls -->
      <nav id="immersive-controls" aria-label="Controles principais">
        <button id="btn-locations" class="icon-btn" title="Cenários e Locais" aria-label="Mudar Cenário">
          📍 <span style="font-size:12px;">Locais</span>
        </button>
        <button id="btn-sound" class="icon-btn active" title="Som" aria-label="Alternar Som">🔊</button>
        <button id="btn-low-stim" class="icon-btn" title="Baixo Estímulo" aria-label="Modo Baixo Estímulo">🌿</button>
        <button id="btn-settings" class="icon-btn" title="Ajustes" aria-label="Ajustes">⚙️</button>
        <button id="btn-hide-ui" class="icon-btn" title="Ocultar Interface (H)" aria-label="Ocultar Interface">👁️</button>
      </nav>

      <!-- Right HUD Dialogue Card: "O que dizer?" -->
      <aside id="dialogue-hud">
        <div class="hud-title-row">
          <div class="hud-main-title">O que dizer?</div>
          <div class="stage-chip" id="stage-chip">Estágio 1 de 4</div>
        </div>

        <!-- Dynamic Choices List -->
        <div class="choices-container" id="choices-container" role="radiogroup"></div>

        <!-- Custom phrase input field (shown when custom option selected) -->
        <div id="custom-input-box" hidden>
          <textarea id="custom-input-field" rows="2" placeholder="Digite sua fala..."></textarea>
        </div>

        <div class="hud-action-row">
          <button id="btn-continue" class="btn-continue" aria-label="Continuar conversa">
            Continuar
          </button>
          <button id="btn-redo" class="btn-redo" aria-label="Refazer conversa">
            ⟳ Refazer
          </button>
        </div>
      </aside>

      <!-- Live status for accessibility and automated assertions -->
      <div id="live-status" role="status" aria-live="polite">Status: Pronto</div>

      <!-- Modals Root -->
      <div id="modals-root"></div>
    `

    this.initElements()
    this.renderModals()
    this.bindEvents()
  }

  private initElements() {
    this.liveStatusEl = document.getElementById('live-status')!
    this.speechBubbleEl = document.getElementById('anchored-speech-bubble')!
    this.stageChipEl = document.getElementById('stage-chip')!
    this.choicesContainer = document.getElementById('choices-container')!
    this.btnContinue = document.getElementById('btn-continue') as HTMLButtonElement
    this.btnRedo = document.getElementById('btn-redo') as HTMLButtonElement
    this.soundBtn = document.getElementById('btn-sound') as HTMLButtonElement
    this.lowStimBtn = document.getElementById('btn-low-stim') as HTMLButtonElement
    this.fallback2DEl = document.getElementById('fallback-2d')!
    this.dialogueHud = document.getElementById('dialogue-hud')!
  }

  private renderModals() {
    const modalsRoot = document.getElementById('modals-root')!

    // 1. Scenarios Selector Modal (15 Scenarios across 5 Locations)
    this.scenariosModal = document.createElement('div')
    this.scenariosModal.id = 'modal-scenarios'
    this.scenariosModal.className = 'modal-overlay'
    this.scenariosModal.hidden = true
    this.scenariosModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">📍 Escolha uma Situação na Cidade</h2>
          <button class="modal-close-btn" data-close="scenarios">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            ${Object.values(LOCATIONS)
              .map(
                loc => `
              <button class="icon-btn loc-filter-btn" data-loc="${loc.id}">
                ${loc.icon} ${loc.name}
              </button>
            `
              )
              .join('')}
          </div>
          <div class="scenario-grid" id="modal-scenario-list">
            ${Object.values(SCENARIOS)
              .map(
                sc => `
              <div class="scenario-card-item" data-scenario="${sc.id}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:var(--color-primary); font-size:14px;">${sc.title}</strong>
                  <span style="font-size:11px; color:var(--color-accent-dark); font-weight:600;">${LOCATIONS[sc.locationId]?.name}</span>
                </div>
                <div style="font-size:12px; color:var(--color-text-muted); margin-top:2px;">${sc.subtitle}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.scenariosModal)

    // 2. Summary & Observation Modal
    this.summaryModal = document.createElement('div')
    this.summaryModal.id = 'modal-summary'
    this.summaryModal.className = 'modal-overlay'
    this.summaryModal.hidden = true
    this.summaryModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">🌿 Diálogo Concluído com Respeito</h2>
          <button class="modal-close-btn" data-close="summary">✕</button>
        </div>
        <div class="modal-body">
          <p id="summary-feedback" style="font-size:14px; color:var(--color-text);">
            Você expressou suas intenções e escolhas de forma segura, respeitando o seu ritmo.
          </p>
          <div style="background:#FAF5E9; border-radius:12px; padding:12px; font-size:13px; display:flex; flex-direction:column; gap:6px;">
            <div><strong>Cenário:</strong> <span id="summary-scenario-title">Comprar Pão</span></div>
            <div><strong>Interações realizadas:</strong> <span id="summary-steps-count">0</span></div>
          </div>
          <div style="border-top:1px solid #EAE3D5; padding-top:12px;">
            <label style="font-weight:600; font-size:13px;">Registro Acompanhado / Observação:</label>
            <div style="display:flex; gap:6px; margin:8px 0; flex-wrap:wrap;">
              <button class="icon-btn btn-obs" data-obs="Independente">Independente</button>
              <button class="icon-btn btn-obs" data-obs="Com apoio">Com apoio</button>
              <button class="icon-btn btn-obs" data-obs="Tempo solicitado">Tempo solicitado</button>
              <button class="icon-btn btn-obs" data-obs="Saída respeitada">Saída respeitada</button>
            </div>
            <textarea id="summary-obs-notes" rows="2" placeholder="Observações descritivas (sem diagnóstico)..." style="width:100%; border:1px solid var(--color-border); border-radius:8px; padding:8px; font-family:inherit; font-size:12px;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-continue" id="btn-save-summary" style="padding:10px 22px;">Salvar e Continuar</button>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.summaryModal)

    // 3. Settings Modal
    this.settingsModal = document.createElement('div')
    this.settingsModal.id = 'modal-settings'
    this.settingsModal.className = 'modal-overlay'
    this.settingsModal.hidden = true
    this.settingsModal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Ajustes e Conforto</h2>
          <button class="modal-close-btn" data-close="settings">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #EAE3D5;">
            <div>
              <div style="font-weight:600; font-size:14px;">🌿 Modo Baixo Estímulo</div>
              <div style="font-size:12px; color:var(--color-text-muted);">Luz suave, menor contraste e cores atenuadas</div>
            </div>
            <input type="checkbox" id="chk-low-stim" style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #EAE3D5;">
            <div>
              <div style="font-weight:600; font-size:14px;">🔊 Sons da Cidade</div>
              <div style="font-size:12px; color:var(--color-text-muted);">Sinos, cliques de madeira e brisa suave</div>
            </div>
            <input type="checkbox" id="chk-sound" checked style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
            <div>
              <div style="font-weight:600; font-size:14px;">🗺️ Modo Mapa 2D</div>
              <div style="font-size:12px; color:var(--color-text-muted);">Visualizar planta esquemática sem 3D</div>
            </div>
            <input type="checkbox" id="chk-fallback-2d" style="width:20px; height:20px; cursor:pointer"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-continue" data-close="settings" style="padding:8px 20px;">Concluído</button>
        </div>
      </div>
    `
    modalsRoot.appendChild(this.settingsModal)
  }

  private bindEvents() {
    // Top buttons
    document.getElementById('btn-locations')!.addEventListener('click', () => this.events.onOpenScenarios())
    document.getElementById('btn-sound')!.addEventListener('click', () => this.events.onToggleSound())
    document.getElementById('btn-low-stim')!.addEventListener('click', () => this.events.onToggleLowStim())
    document.getElementById('btn-settings')!.addEventListener('click', () => this.events.onOpenSettings())
    document.getElementById('btn-hide-ui')!.addEventListener('click', () => this.events.onToggleControlsHide())

    // HUD buttons
    this.btnContinue.addEventListener('click', () => {
      if (this.selectedChoiceId) {
        this.events.onSelectChoice(this.selectedChoiceId)
      } else {
        this.events.onContinue()
      }
    })

    this.btnRedo.addEventListener('click', () => this.events.onRedo())

    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', e => {
        const type = (e.currentTarget as HTMLElement).dataset.close
        if (type === 'scenarios') this.scenariosModal.hidden = true
        if (type === 'summary') this.summaryModal.hidden = true
        if (type === 'settings') this.settingsModal.hidden = true
      })
    })

    // Scenario filter by location buttons
    document.querySelectorAll('.loc-filter-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const loc = (e.currentTarget as HTMLElement).dataset.loc as LocationId
        this.events.onSelectLocation(loc)
      })
    })

    // Scenario card clicks inside modal
    document.getElementById('modal-scenario-list')!.addEventListener('click', e => {
      const card = (e.target as HTMLElement).closest('.scenario-card-item') as HTMLElement
      if (card && card.dataset.scenario) {
        this.events.onSelectScenario(card.dataset.scenario)
        this.scenariosModal.hidden = true
      }
    })

    // Summary modal observation
    let selectedObs: ObservationType = 'Independente'
    this.summaryModal.querySelectorAll('.btn-obs').forEach(btn => {
      btn.addEventListener('click', e => {
        this.summaryModal.querySelectorAll('.btn-obs').forEach(b => b.classList.remove('active'))
        const target = e.currentTarget as HTMLElement
        target.classList.add('active')
        selectedObs = target.dataset.obs as ObservationType
      })
    })

    document.getElementById('btn-save-summary')!.addEventListener('click', () => {
      const notes = (document.getElementById('summary-obs-notes') as HTMLTextAreaElement).value
      this.events.onSaveObservation(selectedObs, notes)
      this.summaryModal.hidden = true
    })

    // Settings checkboxes
    document.getElementById('chk-low-stim')!.addEventListener('change', () => this.events.onToggleLowStim())
    document.getElementById('chk-sound')!.addEventListener('change', () => this.events.onToggleSound())
    document.getElementById('chk-fallback-2d')!.addEventListener('change', () => this.events.onToggleFallback())
  }

  public updateState(state: GameState) {
    const scenario = SCENARIOS[state.currentScenarioId] || SCENARIOS.padaria_pao
    const node = scenario.nodes[state.currentNodeId]

    // 1. Update 3D Anchored Speech Bubble
    if (node) {
      this.speechBubbleEl.textContent = node.text
    }

    // 2. Update Stage Chip (e.g. "Estágio 3 de 5")
    this.stageChipEl.textContent = `Estágio ${state.stage} de ${state.totalStages}`

    // 3. Render Choice Cards
    if (node && node.choices) {
      this.choicesContainer.innerHTML = node.choices
        .map((c: Choice) => {
          const icon =
            c.icon === 'hourglass' || c.effect === 'wait'
              ? '⌛'
              : c.icon === 'exit' || c.effect === 'exit'
              ? '🚪'
              : c.icon === 'speech' || c.effect === 'ask'
              ? '💬'
              : '🗨️'
          return `
          <div class="choice-card" data-choice="${c.id}" tabindex="0" role="radio" aria-checked="false">
            <span class="choice-icon">${icon}</span>
            <span class="choice-label">${c.label}</span>
          </div>
        `
        })
        .join('')

      // Bind choice card click
      this.choicesContainer.querySelectorAll('.choice-card').forEach(card => {
        card.addEventListener('click', e => {
          const target = e.currentTarget as HTMLElement
          this.choicesContainer.querySelectorAll('.choice-card').forEach(c => {
            c.classList.remove('selected')
            c.setAttribute('aria-checked', 'false')
          })
          target.classList.add('selected')
          target.setAttribute('aria-checked', 'true')
          this.selectedChoiceId = target.dataset.choice || null
        })
      })

      // Default select first choice for immediate accessibility
      const firstCard = this.choicesContainer.querySelector('.choice-card') as HTMLElement
      if (firstCard) {
        firstCard.classList.add('selected')
        firstCard.setAttribute('aria-checked', 'true')
        this.selectedChoiceId = firstCard.dataset.choice || null
      }
    }

    // 4. Update Sound and Low Stim controls
    this.soundBtn.classList.toggle('active', state.settings.sound)
    this.soundBtn.textContent = state.settings.sound ? '🔊' : '🔇'
    this.lowStimBtn.classList.toggle('active', state.settings.lowStimulation)

    const chkLow = document.getElementById('chk-low-stim') as HTMLInputElement
    if (chkLow) chkLow.checked = state.settings.lowStimulation
    const chkSound = document.getElementById('chk-sound') as HTMLInputElement
    if (chkSound) chkSound.checked = state.settings.sound

    // 5. Update Fallback 2D chips
    this.updateFallbackChips(state)

    // 6. Live Status
    this.liveStatusEl.textContent = `Status: ${state.phase} | Local: ${state.currentLocationId} | Estágio: ${state.stage}/${state.totalStages} | Passos: ${state.history.length}`
  }

  private updateFallbackChips(state: GameState) {
    const container = document.getElementById('fallback-scenario-chips')
    if (!container) return

    container.innerHTML = Object.values(SCENARIOS)
      .map(
        sc => `
        <button class="icon-btn fallback-sc-btn ${sc.id === state.currentScenarioId ? 'active' : ''}" data-sc="${sc.id}">
          ${LOCATIONS[sc.locationId]?.icon || '📍'} ${sc.title}
        </button>
      `
      )
      .join('')

    container.querySelectorAll('.fallback-sc-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const scId = (e.currentTarget as HTMLElement).dataset.sc
        if (scId) this.events.onSelectScenario(scId)
      })
    })
  }

  public updateSpeechBubblePosition(coords: { x: number; y: number; visible: boolean }) {
    if (!coords.visible) {
      this.speechBubbleEl.style.opacity = '0'
      return
    }
    this.speechBubbleEl.style.opacity = '1'
    this.speechBubbleEl.style.left = `${coords.x}px`
    this.speechBubbleEl.style.top = `${coords.y}px`
  }

  public openSummaryModal(state: GameState) {
    const scenario = SCENARIOS[state.currentScenarioId] || SCENARIOS.padaria_pao
    document.getElementById('summary-scenario-title')!.textContent = scenario.title
    document.getElementById('summary-steps-count')!.textContent = `${state.history.length} escolhas`
    this.summaryModal.hidden = false
  }

  public toggleControlsHide() {
    this.controlsHidden = !this.controlsHidden
    this.dialogueHud.hidden = this.controlsHidden
    document.getElementById('hanging-sign-wrap')!.hidden = this.controlsHidden
  }
}
