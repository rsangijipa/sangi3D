/**
 * Porto das Decisões — HUD e Interface DOM de Alta Fidelidade
 * Reconstrução pixel-perfect do mockup: Placa de Título, Painel de Rota, Bottom Sheet Mobile e Modais Acessíveis
 */

import { GameState, GameAction } from '../game/state';
import { MISSIONS, BOATS_CATALOG, getMissionById, getNodeById } from '../game/content';
import { getAdjacentNodes } from '../game/rules';

export interface UIEventHandlers {
  onDispatch: (action: GameAction) => void;
  onSimulateClicked: () => void;
  onConfirmVoyageClicked: () => void;
  onSkipSimulation?: () => void;
  onEditCargoClicked: () => void;
  onUndoClicked: () => void;
  onClearRouteClicked: () => void;
  onToggleAudio: () => void;
  onAddNode?: (nodeId: string) => void;
  onApplyAlternativeRoute?: (route: string[]) => void;
}

export class GameHUD {
  private container: HTMLElement;
  private handlers: UIEventHandlers;
  private rootElement: HTMLElement;

  constructor(container: HTMLElement, handlers: UIEventHandlers) {
    this.container = container;
    this.handlers = handlers;

    this.rootElement = document.createElement('div');
    this.rootElement.className = 'game-hud-root';
    this.container.appendChild(this.rootElement);
  }

  public render(state: GameState): void {
    const mission = getMissionById(state.missionId);
    const boat = BOATS_CATALOG[state.selectedBoatId];
    const onboardCount = state.cargoOnboard.length;
    const targetCount = mission.targetBoxes;

    // Determinar se o botão principal é "Simular", "Confirmar Viagem" ou "Nova Missão"
    let ctaLabel = 'Simular';
    let ctaAction = 'simulate';
    let ctaClass = 'btn-primary-green';

    if (state.step === 'sim_ready' && state.simResult?.canExecute) {
      ctaLabel = 'Confirmar viagem';
      ctaAction = 'confirm';
      ctaClass = 'btn-confirm-voyage';
    } else if (state.step === 'simulating' || state.isSimulating) {
      ctaLabel = 'Simulando... (Pular)';
      ctaAction = 'skip';
      ctaClass = 'btn-simulating';
    } else if (state.isVoyaging) {
      ctaLabel = 'Navegando pelos cais...';
      ctaAction = 'none';
      ctaClass = 'btn-disabled';
    } else if (state.step === 'review') {
      ctaLabel = 'Próxima missão';
      ctaAction = 'next_mission';
      ctaClass = 'btn-primary-green';
    }

    // Progresso por pontos (5 pontos estilizados como no mockup)
    const totalDots = 5;
    // Quantidade de pontos preenchidos: no mockup são 3 cheios e 2 vazios
    const filledDots = Math.min(totalDots, Math.max(1, state.cargoOnboard.length > 0 ? state.cargoOnboard.length : state.route.length));
    let dotsHtml = '';
    for (let i = 0; i < totalDots; i++) {
      dotsHtml += `<span class="progress-dot ${i < filledDots ? 'dot-filled' : 'dot-outline'}" aria-hidden="true"></span>`;
    }

    // Mensagem de feedback contextual se houver
    let feedbackBanner = '';
    if (state.feedbackMessage) {
      feedbackBanner = `
        <div class="feedback-banner banner-${state.feedbackMessage.type}" role="status" aria-live="polite">
          <span class="banner-icon">${state.feedbackMessage.type === 'success' ? '✓' : state.feedbackMessage.type === 'warning' ? '⚠' : 'ℹ'}</span>
          <span class="banner-text">${state.feedbackMessage.text}</span>
        </div>
      `;
    }

    // Explicação detalhada da simulação
    let simDetailsHtml = '';
    if (state.simResult && state.step !== 'routing') {
      const altRoute = state.simResult.alternativeRoutePath;
      const altRouteNames = altRoute ? altRoute.map(id => getNodeById(id)?.shortLabel || id).join(' → ') : '';

      simDetailsHtml = `
        <div class="sim-details-box">
          <div class="sim-metric-row">
            <span>Distância: <strong>${state.simResult.totalDistance} m</strong></span>
            <span>Tempo est.: <strong>${state.simResult.estimatedTimeSec} s</strong></span>
          </div>
          ${state.simResult.deliveries.length > 0 ? `
            <div class="sim-deliveries-list">
              <span class="label-mini">Entregas previstas:</span>
              <ul>
                ${state.simResult.deliveries.map(d => `<li>📍 ${d.nodeName}: ${d.unloadedCargo.length} caixa(s)</li>`).join('')}
              </ul>
            </div>
          ` : '<p class="sim-no-deliveries">Nenhum cais com entrega nesta rota.</p>'}
          ${state.simResult.alternativeRoutePossible && altRoute && altRoute.length > 0 ? `
            <div class="alt-route-suggestion">
              <span class="label-mini">💡 Rota alternativa descoberta:</span>
              <p class="alt-path-text">${altRouteNames}</p>
              <button class="btn-alt-route" id="btn-use-alt-route" title="Carregar rota alternativa">Comparar e testar esta rota</button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Atalhos acessíveis de nós adjacentes para navegação sem depender exclusivamente de clique no 3D
    const lastNodeId = state.route[state.route.length - 1];
    const adjacentIds = getAdjacentNodes(lastNodeId);
    let adjacentNodesHtml = '';
    if (!state.isSimulating && !state.isVoyaging && adjacentIds.length > 0) {
      adjacentNodesHtml = `
        <div class="adjacent-nodes-section" aria-label="Nós adjacentes navegáveis">
          <span class="crumb-label">Conectar próximo nó:</span>
          <div class="adjacent-btns-grid">
            ${adjacentIds.map(nid => {
              const n = getNodeById(nid);
              return `<button class="adjacent-node-btn" data-node-id="${nid}" title="Conectar ${n?.name || nid}">+ ${n?.shortLabel || nid}</button>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    this.rootElement.innerHTML = `
      <!-- 1. Placa de Título Superior Esquerda (Fiel ao mockup) -->
      <header class="title-plaque-container">
        <div class="title-plaque" role="banner">
          <h1>Porto das Decisões</h1>
        </div>
        <div class="mission-tag-pill">
          <span>${mission.title}</span>
        </div>
      </header>

      <!-- Feedback / Notificações centrais -->
      ${feedbackBanner}

      <!-- 2. Painel Lateral Direito (Desktop) / Bottom Sheet (Mobile) -->
      <aside class="route-panel-card" aria-label="Painel de controle náutico">
        <div class="sheet-handle" aria-hidden="true"></div>

        <div class="panel-header">
          <h2 class="panel-title">Traçar a rota</h2>
        </div>

        <!-- Pílula de status de caixas (Fiel ao mockup) -->
        <button class="cargo-indicator-pill" id="btn-open-cargo" aria-label="Gerenciar caixas. Atual: ${onboardCount} de ${targetCount} caixas carregadas">
          <svg class="box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
          <span class="cargo-text"><strong>${onboardCount} de ${targetCount}</strong> caixas</span>
        </button>
        <div class="boat-capacity-hint">
          <span>${boat.name} (capacidade máx ${boat.capacity})</span>
        </div>

        <!-- Indicador de progresso por pontos -->
        <div class="progress-dots-row" aria-label="Progresso da rota: ${filledDots} de ${totalDots}">
          ${dotsHtml}
        </div>

        ${simDetailsHtml}

        <!-- Botões de Ação Principais -->
        <div class="panel-actions">
          <button class="hud-btn ${ctaClass}" id="btn-primary-action" ${ctaAction === 'none' ? 'disabled' : ''}>
            ${ctaLabel}
          </button>
          
          <button class="hud-btn btn-secondary-paper" id="btn-edit-cargo">
            Editar carga
          </button>
        </div>

        <!-- Controles Secundários de Rota -->
        <div class="route-subcontrols">
          <button class="sub-btn" id="btn-undo-node" title="Desfazer última parada (Atalho: U)" ${state.route.length <= 1 || state.isSimulating || state.isVoyaging ? 'disabled' : ''}>
            ↩ Desfazer nó
          </button>
          <button class="sub-btn" id="btn-clear-route" title="Limpar rota" ${state.route.length <= 1 || state.isSimulating || state.isVoyaging ? 'disabled' : ''}>
            ✕ Limpar
          </button>
        </div>

        <!-- Rota ativa em texto acessível -->
        <div class="active-route-crumbs" aria-label="Nós do percurso atual">
          <span class="crumb-label">Caminho:</span>
          ${state.route.map(id => `<span class="route-crumb">${getNodeById(id)?.shortLabel || id}</span>`).join(' → ')}
        </div>

        <!-- Atalhos acessíveis para conectar próximos cais/boias -->
        ${adjacentNodesHtml}
      </aside>

      <!-- 3. Barra de Utilidades Inferior -->
      <nav class="bottom-utility-bar" aria-label="Ajustes e navegação de modos">
        <button class="utility-btn" id="btn-select-mission" title="Escolher missão">
          🧭 Missões
        </button>

        <button class="utility-btn" id="btn-mode-toggle" title="Alternar modo: Livre / Guiado / Acompanhado">
          Modo: <strong>${state.mode.toUpperCase()}</strong>
        </button>

        <button class="utility-btn" id="btn-reflection" title="Reflexão e Observações">
          📖 Reflexão
        </button>

        <button class="utility-btn" id="btn-toggle-audio" title="Alternar som">
          ${state.audioMuted ? '🔇 Mudo' : '🔊 Som'}
        </button>
      </nav>

      <!-- 4. Modais Injetáveis -->
      ${this.renderModals(state)}
    `;

    this.bindHUDListeners(state);
  }

  private renderModals(state: GameState): string {
    if (!state.activeModal) return '';

    if (state.activeModal === 'cargo') {
      const boat = BOATS_CATALOG[state.selectedBoatId];
      const mission = getMissionById(state.missionId);

      return `
        <div class="modal-backdrop" id="modal-backdrop">
          <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-cargo-title">
            <header class="modal-header">
              <div>
                <h3 id="modal-cargo-title">Gerenciar Carga & Barco</h3>
                <small>Meta da missão: ${mission.targetBoxes} caixas</small>
              </div>
              <button class="modal-close-btn" id="btn-close-modal" aria-label="Fechar">✕</button>
            </header>

            <div class="modal-body">
              <!-- Seletor de Barco -->
              <section class="modal-section">
                <h4>1. Escolha a Embarcação:</h4>
                <div class="boat-selector-grid">
                  ${(['blue', 'green', 'red'] as const).map(bId => {
                    const b = BOATS_CATALOG[bId];
                    const isSelected = state.selectedBoatId === bId;
                    return `
                      <button class="boat-card-btn ${isSelected ? 'selected' : ''}" data-boat-id="${bId}">
                        <div class="boat-card-color" style="background-color: ${b.colorHex};"></div>
                        <div class="boat-card-info">
                          <strong>${b.name}</strong>
                          <span>Capacidade: ${b.capacity} caixas</span>
                          <small>${b.specialty}</small>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </section>

              <!-- Caixas a Bordo vs Disponíveis no Porto -->
              <section class="modal-section">
                <h4>2. Caixas a Bordo (${state.cargoOnboard.length} de ${boat.capacity} suportadas):</h4>
                ${state.cargoOnboard.length === 0 ? '<p class="empty-hint">Nenhuma caixa a bordo no momento.</p>' : ''}
                <div class="cargo-items-list">
                  ${state.cargoOnboard.map(c => `
                    <div class="cargo-item-row onboard">
                      <span>📦 <strong>${c.name}</strong> → Destino: ${getNodeById(c.destinationNodeId)?.name || c.destinationNodeId}</span>
                      <button class="btn-unload" data-cargo-id="${c.id}">Descarregar</button>
                    </div>
                  `).join('')}
                </div>

                <h4>Caixas no Porto (Disponíveis):</h4>
                ${state.availableCargo.length === 0 ? '<p class="empty-hint">Todas as caixas estão a bordo ou já foram entregues.</p>' : ''}
                <div class="cargo-items-list">
                  ${state.availableCargo.map(c => `
                    <div class="cargo-item-row available">
                      <span>📦 <strong>${c.name}</strong> → Destino: ${getNodeById(c.destinationNodeId)?.name || c.destinationNodeId}</span>
                      <button class="btn-load" data-cargo-id="${c.id}" ${state.cargoOnboard.length >= boat.capacity ? 'disabled title="Barco cheio"' : ''}>Carregar</button>
                    </div>
                  `).join('')}
                </div>
              </section>
            </div>

            <footer class="modal-footer">
              <button class="hud-btn btn-primary-green" id="btn-close-modal-confirm">Confirmar Carga</button>
            </footer>
          </div>
        </div>
      `;
    }

    if (state.activeModal === 'mission') {
      return `
        <div class="modal-backdrop" id="modal-backdrop">
          <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-mission-title">
            <header class="modal-header">
              <h3 id="modal-mission-title">Selecionar Missão Náutica</h3>
              <button class="modal-close-btn" id="btn-close-modal" aria-label="Fechar">✕</button>
            </header>

            <div class="modal-body">
              <div class="missions-list">
                ${MISSIONS.map(m => {
                  const isCurrent = state.missionId === m.id;
                  return `
                    <div class="mission-card ${isCurrent ? 'current' : ''}">
                      <div class="mission-card-header">
                        <strong>${m.title}</strong>
                        <span class="difficulty-badge">${m.difficulty}</span>
                      </div>
                      <p>${m.description}</p>
                      <div class="mission-card-footer">
                        <span>🎯 ${m.targetBoxes} caixas</span>
                        <button class="btn-start-mission" data-mission-id="${m.id}">
                          ${isCurrent ? 'Reiniciar Missão' : 'Iniciar Missão'}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <footer class="modal-footer">
              <button class="hud-btn btn-secondary-paper" id="btn-close-modal-action">Voltar ao Jogo</button>
            </footer>
          </div>
        </div>
      `;
    }

    if (state.activeModal === 'reflection') {
      const mission = getMissionById(state.missionId);
      return `
        <div class="modal-backdrop" id="modal-backdrop">
          <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-refl-title">
            <header class="modal-header">
              <h3 id="modal-refl-title">Reflexão & Registro Observável</h3>
              <button class="modal-close-btn" id="btn-close-modal" aria-label="Fechar">✕</button>
            </header>

            <div class="modal-body">
              <section class="modal-section">
                <h4>Observações Objetivas da Sessão:</h4>
                <ul class="metrics-list">
                  <li>Rotas testadas: <strong>${state.metrics.routesTested}</strong></li>
                  <li>Viagens concluídas: <strong>${state.metrics.voyagesCompleted}</strong></li>
                  <li>Total de caixas entregues: <strong>${state.metrics.totalCratesDelivered}</strong></li>
                  <li>Duração ativa: <strong>${Math.floor(state.metrics.activeDurationSec)} s</strong></li>
                </ul>
                <p class="ethics-disclaimer"><em>*Apenas descrição. O significado é de quem cria.*</em></p>
              </section>

              <section class="modal-section">
                <h4>Perguntas Contextuais de Exploração:</h4>
                ${mission.reflectionQuestions.map(q => `
                  <blockquote class="refl-question">
                    “${q}”
                  </blockquote>
                `).join('')}
              </section>
            </div>

            <footer class="modal-footer">
              <button class="hud-btn btn-primary-green" id="btn-close-modal-action">Continuar Navegação</button>
            </footer>
          </div>
        </div>
      `;
    }

    return '';
  }

  private bindHUDListeners(state: GameState): void {
    // 1. Botão Principal (Simular / Pular / Confirmar / Próxima Missão)
    const primaryBtn = document.getElementById('btn-primary-action');
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        if ((state.step === 'sim_ready' || state.step === 'simulating') && state.simResult?.canExecute && !state.isSimulating) {
          this.handlers.onConfirmVoyageClicked();
        } else if (state.isSimulating) {
          if (this.handlers.onSkipSimulation) {
            this.handlers.onSkipSimulation();
          }
        } else if (state.step === 'review') {
          // Avançar para a próxima missão
          const currIdx = MISSIONS.findIndex(m => m.id === state.missionId);
          const nextIdx = (currIdx + 1) % MISSIONS.length;
          this.handlers.onDispatch({ type: 'SET_MISSION', payload: MISSIONS[nextIdx].id });
        } else {
          this.handlers.onSimulateClicked();
        }
      });
    }

    // Botão de Rota Alternativa
    const altRouteBtn = document.getElementById('btn-use-alt-route');
    if (altRouteBtn && state.simResult?.alternativeRoutePath) {
      altRouteBtn.addEventListener('click', () => {
        if (this.handlers.onApplyAlternativeRoute && state.simResult?.alternativeRoutePath) {
          this.handlers.onApplyAlternativeRoute(state.simResult.alternativeRoutePath);
        } else if (state.simResult?.alternativeRoutePath) {
          this.handlers.onDispatch({
            type: 'APPLY_ALTERNATIVE_ROUTE',
            payload: state.simResult.alternativeRoutePath
          });
        }
      });
    }

    // Atalhos acessíveis de nós adjacentes
    document.querySelectorAll<HTMLButtonElement>('.adjacent-node-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nodeId;
        if (nid) {
          if (this.handlers.onAddNode) {
            this.handlers.onAddNode(nid);
          } else {
            this.handlers.onDispatch({ type: 'ADD_NODE_TO_ROUTE', payload: nid });
          }
        }
      });
    });

    // 2. Botão Editar Carga
    const editCargoBtn = document.getElementById('btn-edit-cargo');
    if (editCargoBtn) {
      editCargoBtn.addEventListener('click', () => this.handlers.onEditCargoClicked());
    }
    const openCargoBtn = document.getElementById('btn-open-cargo');
    if (openCargoBtn) {
      openCargoBtn.addEventListener('click', () => this.handlers.onEditCargoClicked());
    }

    // 3. Desfazer / Limpar rota
    const undoBtn = document.getElementById('btn-undo-node');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => this.handlers.onUndoClicked());
    }
    const clearBtn = document.getElementById('btn-clear-route');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.handlers.onClearRouteClicked());
    }

    // 4. Barra de utilidades
    const missionBtn = document.getElementById('btn-select-mission');
    if (missionBtn) {
      missionBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: 'mission' });
      });
    }

    const modeBtn = document.getElementById('btn-mode-toggle');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        const nextMode = state.mode === 'guiado' ? 'livre' : state.mode === 'livre' ? 'acompanhado' : 'guiado';
        this.handlers.onDispatch({ type: 'SET_MODE', payload: nextMode });
      });
    }

    const reflBtn = document.getElementById('btn-reflection');
    if (reflBtn) {
      reflBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: 'reflection' });
      });
    }

    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => this.handlers.onToggleAudio());
    }

    // 5. Modais listeners
    const closeModalBtn = document.getElementById('btn-close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
      });
    }

    const closeModalAction = document.getElementById('btn-close-modal-action');
    if (closeModalAction) {
      closeModalAction.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
      });
    }

    const closeModalConfirm = document.getElementById('btn-close-modal-confirm');
    if (closeModalConfirm) {
      closeModalConfirm.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
      });
    }

    // Seleção de barco no modal
    document.querySelectorAll<HTMLButtonElement>('.boat-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.dataset.boatId as 'blue' | 'green' | 'red';
        if (bId) {
          this.handlers.onDispatch({ type: 'SELECT_BOAT', payload: bId });
        }
      });
    });

    // Carregar caixa
    document.querySelectorAll<HTMLButtonElement>('.btn-load').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.dataset.cargoId;
        const item = state.availableCargo.find(c => c.id === cId);
        if (item) {
          this.handlers.onDispatch({ type: 'LOAD_CARGO', payload: item });
        }
      });
    });

    // Descarregar caixa
    document.querySelectorAll<HTMLButtonElement>('.btn-unload').forEach(btn => {
      btn.addEventListener('click', () => {
        const cId = btn.dataset.cargoId;
        if (cId) {
          this.handlers.onDispatch({ type: 'UNLOAD_CARGO', payload: cId });
        }
      });
    });

    // Iniciar missão
    document.querySelectorAll<HTMLButtonElement>('.btn-start-mission').forEach(btn => {
      btn.addEventListener('click', () => {
        const mId = btn.dataset.missionId;
        if (mId) {
          this.handlers.onDispatch({ type: 'SET_MISSION', payload: mId });
        }
      });
    });
  }
}
