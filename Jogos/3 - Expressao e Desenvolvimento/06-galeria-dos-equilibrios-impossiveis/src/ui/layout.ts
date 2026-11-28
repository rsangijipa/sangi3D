import type { GameState, Tool, View, WeightType } from '../game/state.ts'
import { WEIGHTS, SUB_BEAMS, MODES, PRESETS } from '../game/content.ts'
import { calculatePhysics, HOLE_SLOTS } from '../game/rules.ts'

export function layout(root: HTMLElement) {
  root.innerHTML = `
    <div id="experience" class="entrance">
      <!-- 3D Canvas Container -->
      <div id="world" role="region" aria-label="Galeria 3D dos Equilíbrios Impossíveis"></div>

      <!-- Accessible 2D Fallback Diagram -->
      <div id="fallback" hidden aria-label="Diagrama 2D de Equilíbrio">
        <div class="fallback-card">
          <h2>Modo Simplificado (Diagrama 2D)</h2>
          <p>O acelerador gráfico WebGL2 não está ativo. Você pode interagir pelo diagrama abaixo e pelos controles da interface.</p>
          <div id="diagram" class="diagram-canvas"></div>
          <p id="fallback-status" class="fallback-note"></p>
        </div>
      </div>

      <!-- Screen reader status live region -->
      <div id="status" class="sr-only" role="status" aria-live="polite"></div>

      <!-- Top Immersive Bar -->
      <header id="top-bar" class="top-bar">
        <div class="top-left">
          <button class="icon-btn" data-action="exit" aria-label="Voltar para a entrada">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div class="top-center">
          <h1 class="gallery-title">Galeria dos Equilíbrios Impossíveis</h1>
        </div>
        <div class="top-right">
          <button class="icon-btn" data-action="sound" aria-label="Ativar som" aria-pressed="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
          <button class="icon-btn" data-action="capture" aria-label="Capturar fotografia">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <button class="icon-btn" data-action="pause" aria-label="Pausar galeria">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
          <button class="icon-btn" data-action="fullscreen" aria-label="Alternar tela cheia">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
      </header>

      <!-- Welcome Entrance Screen -->
      <div id="entry" class="entry-screen">
        <div class="entry-card">
          <p class="collection-tag">Coleção Gestalt & Expressiva · Verbo Equilibrar</p>
          <h2 class="entry-title">Galeria dos Equilíbrios Impossíveis</h2>
          <p class="entry-text">
            Um espaço sereno para explorar pesos, pontos de suspensão e níveis encadeados de móbiles cinéticos.
            Experimente a física intuitiva das alavancas e componha harmonias em latão, cerâmica, pedra e vidro.
          </p>
          <div class="entry-actions">
            <button class="btn primary" data-action="start">Explorar Galeria</button>
            <button class="btn secondary" data-action="activity">Escolher Atividade</button>
          </div>
          <p class="entry-disclaimer">
            Recurso expressivo e complementar. As escolhas artísticas não recebem escore.
          </p>
        </div>
      </div>

      <!-- Right Side Contextual Tool Panel -->
      <aside id="panel" class="contextual-panel" role="complementary" aria-label="Painel de Ferramentas"></aside>

      <!-- Bottom Dock / HUD -->
      <nav id="dock" class="bottom-dock" role="toolbar" aria-label="Ferramentas principais">
        <button class="dock-pill active" data-action="tool-add-weight" aria-pressed="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>
          <span>Adicionar peso</span>
        </button>
        <button class="dock-pill" data-action="tool-move-fulcrum" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 11 21 7 17 3"/><polyline points="7 21 3 17 7 13"/><line x1="21" y1="7" x2="9" y2="7"/><line x1="3" y1="17" x2="15" y2="17"/></svg>
          <span>Mover fulcro</span>
        </button>
        <button class="dock-pill" data-action="tool-observe" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Observar movimento</span>
        </button>
        <button class="dock-pill" data-action="tool-free-balance" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>
          <span>Equilíbrio livre</span>
        </button>
      </nav>

      <!-- Floating Reopen Controls Button (when H pressed) -->
      <button class="floating-btn" data-action="show" hidden aria-label="Mostrar controles da galeria">
        Mostrar controles (H)
      </button>

      <!-- Modal Dialog -->
      <dialog id="dialog" class="gallery-dialog" aria-modal="true">
        <div id="dialog-content" class="dialog-body"></div>
      </dialog>
    </div>
  `
}

export function renderPanel(
  tool: Tool,
  state: GameState,
  selectedWeightType: WeightType,
  selectedSlot: number,
  selectedSubBeamId: string | undefined,
  currentView: View
): string {
  const { sceneState } = state
  const metrics = calculatePhysics(sceneState, state.settings.tolerance)

  if (tool === 'add-weight') {
    const weightList = Object.values(WEIGHTS)
    return `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6-6 6 6v12H6z"/></svg>
            <h2 class="panel-title">Adicionar peso</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Escolha um peso e pendure na barra ou em um gancho.</p>

        <!-- Weights Grid (2x3) -->
        <div class="weights-grid" role="radiogroup" aria-label="Tipos de peso">
          ${weightList
            .map(
              w => `
            <button class="weight-card ${w.type === selectedWeightType ? 'selected' : ''}" data-action="select-weight-type" data-type="${w.type}" aria-label="${w.name} (${w.mass} kg)">
              <div class="weight-thumb" style="background-color: ${w.color}22; border-color: ${w.color}">
                <span class="weight-dot" style="background-color: ${w.color}"></span>
              </div>
              <span class="weight-name">${w.name}</span>
              <span class="weight-mass">${w.mass.toFixed(1)} kg</span>
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Slot Selector -->
        <div class="control-row">
          <label for="slot-select">Furo na barra:</label>
          <select id="slot-select" class="select-field">
            ${HOLE_SLOTS.map(
              s => `<option value="${s}" ${s === selectedSlot ? 'selected' : ''}>${s > 0 ? '+' : ''}${s} cm ${s < 0 ? '(Esq)' : s > 0 ? '(Dir)' : ''}</option>`
            ).join('')}
          </select>
        </div>

        <!-- Sub-Beam Attachment Option -->
        ${
          sceneState.subBeams.length > 0
            ? `
          <div class="control-row">
            <label for="subbeam-select">Ou pendurar no braço:</label>
            <select id="subbeam-select" class="select-field">
              <option value="" ${!selectedSubBeamId ? 'selected' : ''}>Barra Principal</option>
              ${sceneState.subBeams.map(sb => `<option value="${sb.id}" ${selectedSubBeamId === sb.id ? 'selected' : ''}>${SUB_BEAMS[sb.type].name} (${sb.slot} cm)</option>`).join('')}
            </select>
          </div>
        `
            : ''
        }

        <div class="panel-actions">
          <button class="btn primary wide" data-action="hang-weight">Pendurar peso <span aria-hidden="true">→</span></button>
        </div>

        <!-- Secondary Sub-Beam Addition -->
        <div class="subbeam-section">
          <p class="subbeam-title">Criar nível encadeado (Móbile):</p>
          <div class="btn-group">
            <button class="btn secondary sm" data-action="add-subbeam-brass">+ Braço de latão</button>
            <button class="btn secondary sm" data-action="add-subbeam-wood">+ Braço de madeira</button>
          </div>
        </div>

        <!-- Switches -->
        <div class="switches-section">
          <label class="switch-row">
            <span class="switch-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="17" y1="8" x2="17" y2="16"/></svg>
              Régua
            </span>
            <input type="checkbox" id="toggle-ruler" ${sceneState.rulerVisible ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
          <label class="switch-row">
            <span class="switch-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
              Dinamômetro
            </span>
            <input type="checkbox" id="toggle-dynamometer" ${sceneState.dynamometerVisible ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>
    `
  }

  if (tool === 'move-fulcrum') {
    return `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 11 21 7 17 3"/><polyline points="7 21 3 17 7 13"/></svg>
            <h2 class="panel-title">Mover fulcro</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Ajuste o ponto de apoio ao longo da barra perfurada para alterar os braços de alavanca.</p>

        <div class="fulcrum-slider-wrap">
          <div class="slider-header">
            <span>Posição do fulcro:</span>
            <strong id="fulcrum-val">${sceneState.fulcrumPosition > 0 ? '+' : ''}${sceneState.fulcrumPosition} cm</strong>
          </div>
          <input type="range" id="fulcrum-range" min="-30" max="30" step="5" value="${sceneState.fulcrumPosition}" class="range-slider">
          <div class="slider-ticks">
            <span>-30 cm (Esq)</span>
            <span>0 (Centro)</span>
            <span>+30 cm (Dir)</span>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn secondary sm" data-action="fulcrum-left">← Deslocar -5 cm</button>
          <button class="btn secondary sm" data-action="fulcrum-center">Centro (0)</button>
          <button class="btn secondary sm" data-action="fulcrum-right">+5 cm →</button>
        </div>

        <div class="metrics-preview">
          <div class="metric-item">
            <span class="metric-label">Torque resultante:</span>
            <span class="metric-val">${metrics.netTorque > 0 ? '+' : ''}${metrics.netTorque} N·m</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Inclinação estática:</span>
            <span class="metric-val ${metrics.isEquilibrated ? 'equilibrated' : ''}">${metrics.targetAngle > 0 ? '+' : ''}${metrics.targetAngle}°</span>
          </div>
        </div>
      </div>
    `
  }

  if (tool === 'observe') {
    return `
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <h2 class="panel-title">Observar movimento</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Acompanhe as oscilações harmônicas e os dados físicos da escultura.</p>

        <div class="readout-card">
          <div class="readout-angle">
            <span class="readout-label">Inclinação atual</span>
            <span class="readout-number ${metrics.isEquilibrated ? 'green' : ''}">${sceneState.mainAngle.toFixed(1)}°</span>
            <span class="readout-badge ${metrics.isEquilibrated ? 'badge-equilibrated' : 'badge-tilted'}">
              ${metrics.isEquilibrated ? '✓ Equilíbrio Perfeito' : 'Desbalanceado'}
            </span>
          </div>
          <div class="readout-grid">
            <div class="readout-col">
              <span class="lbl">Carga Total</span>
              <span class="val">${metrics.totalMass} kg</span>
            </div>
            <div class="readout-col">
              <span class="lbl">Dinamômetro</span>
              <span class="val">${metrics.dynamometerTension} N</span>
            </div>
            <div class="readout-col">
              <span class="lbl">Torque Líquido</span>
              <span class="val">${metrics.netTorque} N·m</span>
            </div>
          </div>
        </div>

        <div class="view-selector">
          <span class="view-title">Enquadramentos da câmera:</span>
          <div class="view-buttons">
            <button class="btn secondary sm ${currentView === 'panoramic' ? 'active' : ''}" data-action="view-panoramic">Panorâmica</button>
            <button class="btn secondary sm ${currentView === 'fulcrum' ? 'active' : ''}" data-action="view-fulcrum">Fulcro</button>
            <button class="btn secondary sm ${currentView === 'top' ? 'active' : ''}" data-action="view-top">Superior</button>
            <button class="btn secondary sm ${currentView === 'weights' ? 'active' : ''}" data-action="view-weights">Pesos</button>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn secondary" data-action="undo" ${!state.history.length ? 'disabled' : ''}>↶ Desfazer</button>
          <button class="btn secondary" data-action="redo" ${!state.future.length ? 'disabled' : ''}>↷ Refazer</button>
          <button class="btn secondary" data-action="review">Revisar Peça</button>
        </div>
      </div>
    `
  }

  // Free balance / Modes
  return `
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-wrap">
          <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>
          <h2 class="panel-title">${MODES[state.mode].title}</h2>
        </div>
        <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
      </div>
      <p class="panel-instruction">${MODES[state.mode].description}</p>

      <div class="presets-section">
        <p class="presets-title">Composições sugeridas:</p>
        <div class="presets-list">
          ${Object.entries(PRESETS)
            .map(
              ([key, p]) => `
            <button class="preset-item" data-action="load-preset" data-preset="${key}">
              <strong>${p.label}</strong>
              <small>${p.description}</small>
            </button>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="btn-group">
        <button class="btn secondary" data-action="settings">Configurações</button>
        <button class="btn secondary" data-action="reset">Limpar Móbile</button>
      </div>
    </div>
  `
}
