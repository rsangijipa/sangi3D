/**
 * Interface do Usuário e HUD do Mestre Mandou
 * Projeto: 02. Trilha do Mestre Mandou
 * HUD exato: Toque no sino azul / Etapa 2 de 4 / Repetir · Ajuda · Pausa / Minha vez de propor
 */

import { GameStateManager, type GameState } from '../game/state.ts';
import { TARGETS_CATALOG } from '../game/content.ts';

export function createHUD(
  container: HTMLElement,
  gameState: GameStateManager,
  onAudioToggle: () => boolean,
  onCameraToggle: () => void,
  onReturnCheckpoint: () => void,
  onDirectInteract: () => void
) {
  const root = document.createElement('div');
  root.id = 'hud-overlay';
  root.innerHTML = `
    <style>
      #hud-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        z-index: 10;
        font-family: 'Nunito', -apple-system, sans-serif;
      }
      .ui-interactive {
        pointer-events: auto;
      }
      /* 1. Barra Superior Principal do HUD */
      .hud-topbar {
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(38, 60, 46, 0.88);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 999px;
        padding: 10px 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        gap: 16px;
      }
      .hud-command-box {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .hud-step-badge {
        background: #e5bc58;
        color: #263c2e;
        font-weight: 800;
        font-size: 13px;
        padding: 4px 12px;
        border-radius: 999px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }
      .hud-command-text {
        font-family: 'Fredoka', 'Nunito', sans-serif;
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 0.2px;
      }
      .hud-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .hud-btn {
        background: rgba(255, 255, 255, 0.12);
        color: #fbf8f2;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 999px;
        padding: 8px 16px;
        font-size: 13.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
      }
      .hud-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
      }
      .hud-btn.primary {
        background: #5599a5;
        border-color: #5599a5;
        color: #ffffff;
      }
      .hud-btn.primary:hover {
        background: #41828e;
      }
      .hud-icon-btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .hud-icon-btn svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
      }

      /* 2. Feedback Flutuante */
      .hud-feedback {
        align-self: center;
        background: rgba(30, 48, 38, 0.85);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #fbf8f2;
        padding: 8px 20px;
        border-radius: 999px;
        font-size: 14.5px;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        margin-top: 12px;
        transition: all 0.3s ease;
      }

      /* 3. Rodapé e Dica de Navegação */
      .hud-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .hud-nav-hint {
        background: rgba(30, 48, 38, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: rgba(251, 248, 242, 0.9);
        padding: 8px 18px;
        border-radius: 16px;
        font-size: 13px;
        max-width: 380px;
      }
      .hud-quick-actions {
        display: flex;
        gap: 8px;
      }

      /* Modais Acessíveis */
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .modal-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }
      .modal-card {
        background: #2b4334;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fbf8f2;
        border-radius: 24px;
        padding: 28px;
        width: calc(100% - 36px);
        max-width: 480px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      }
      .modal-title {
        font-family: 'Fredoka', 'Nunito', sans-serif;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #e5bc58;
      }
      .modal-body {
        font-size: 14.5px;
        line-height: 1.6;
        color: rgba(251, 248, 242, 0.9);
        margin-bottom: 24px;
      }
      .propose-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 20px;
      }
      .propose-item {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 10px;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
      }
      .propose-item.selected {
        background: #5599a5;
        border-color: #5599a5;
      }

      /* Responsividade Mobile (390x844 — 9:19.5) */
      @media (max-width: 768px) {
        #hud-overlay {
          padding: 12px;
        }
        .hud-topbar {
          flex-direction: column;
          align-items: stretch;
          border-radius: 20px;
          padding: 12px 16px;
          gap: 10px;
        }
        .hud-command-box {
          justify-content: space-between;
        }
        .hud-command-text {
          font-size: 17px;
        }
        .hud-actions {
          justify-content: space-between;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .hud-btn {
          font-size: 12px;
          padding: 6px 12px;
        }
        .hud-bottom {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }
        .hud-nav-hint {
          max-width: 100%;
          font-size: 12px;
        }
      }
    </style>

    <div role="region" aria-label="Controles Principais da Trilha">
      <header class="hud-topbar ui-interactive">
        <div class="hud-command-box">
          <span class="hud-command-text" id="hud-command-label">Toque no sino azul</span>
          <span class="hud-step-badge" id="hud-step-badge">Etapa 2 de 4</span>
        </div>

        <nav class="hud-actions" aria-label="Ações do Mestre">
          <button class="hud-btn" id="btn-repeat" title="Repetir instrução em voz alta">Repetir</button>
          <button class="hud-btn" id="btn-help" title="Ajuda sobre o caminho">Ajuda</button>
          <button class="hud-btn" id="btn-pause" title="Pausar o jogo">Pausa</button>
          <button class="hud-btn primary" id="btn-propose" title="Criar o seu próprio desafio">Minha vez de propor</button>
          
          <button class="hud-btn hud-icon-btn" id="btn-audio" title="Alternar Som (M)" aria-label="Som">
            <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          </button>
          <button class="hud-btn hud-icon-btn" id="btn-cam" title="Alternar Câmera (C)" aria-label="Câmera">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M3 7V5a2 2 0 0 1 2-2h2m12 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>
          </button>
        </nav>
      </header>

      <div class="hud-feedback" id="hud-feedback-banner" aria-live="polite">
        O Mestre Mandou: Toque no sino azul!
      </div>
    </div>

    <footer class="hud-bottom">
      <div class="hud-nav-hint ui-interactive">
        <strong>Como jogar:</strong> Use <strong>WASD / Setas</strong> para andar, <strong>Espaço</strong> para saltar, ou clique onde quer ir no chão.
      </div>
      <div class="hud-quick-actions ui-interactive">
        <button class="hud-btn" id="btn-interact-action" title="Interagir com o elemento mais próximo (E)">Tocar / Interagir (E)</button>
        <button class="hud-btn" id="btn-respawn" title="Retornar a ponto seguro">Ponto Seguro</button>
      </div>
    </footer>

    <!-- Modal de Ajuda -->
    <div class="modal-backdrop" id="modal-help" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div class="modal-card ui-interactive">
        <h2 class="modal-title" id="help-title">Dica do Caminho</h2>
        <div class="modal-body" id="help-body-content">
          Siga pela ponte suspensa até o rochedo elevado onde o sino azul de bronze está pendurado.
        </div>
        <button class="hud-btn primary" id="btn-close-help">Entendido</button>
      </div>
    </div>

    <!-- Modal Minha Vez de Propor -->
    <div class="modal-backdrop" id="modal-propose" role="dialog" aria-modal="true" aria-labelledby="propose-title">
      <div class="modal-card ui-interactive">
        <h2 class="modal-title" id="propose-title">Minha vez de propor!</h2>
        <p class="modal-body">Escolha a ordem dos alvos para criar a sua própria trilha do Mestre Mandou:</p>
        <div class="propose-list" id="propose-targets-grid"></div>
        <div style="display:flex; justify-content:space-between; gap:12px;">
          <button class="hud-btn" id="btn-cancel-propose">Cancelar</button>
          <button class="hud-btn primary" id="btn-start-custom-trail">Iniciar Trilha Criada</button>
        </div>
      </div>
    </div>

    <!-- Modal de Pausa -->
    <div class="modal-backdrop" id="modal-pause" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div class="modal-card ui-interactive">
        <h2 class="modal-title" id="pause-title">Jogo Pausado</h2>
        <div class="modal-body">
          Respire fundo. Não há cronômetro coercitivo nem penalidade. Você pode retomar a trilha ou explorar o parque livremente.
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="hud-btn primary" id="btn-resume">Continuar Trilha</button>
          <button class="hud-btn" id="btn-free-mode">Exploração Livre</button>
          <button class="hud-btn" id="btn-restart-master">Reiniciar Mestre Mandou</button>
        </div>
      </div>
    </div>
  `;

  container.appendChild(root);

  // Elementos do DOM
  const commandLabel = root.querySelector('#hud-command-label') as HTMLElement;
  const stepBadge = root.querySelector('#hud-step-badge') as HTMLElement;
  const feedbackBanner = root.querySelector('#hud-feedback-banner') as HTMLElement;
  const modalHelp = root.querySelector('#modal-help') as HTMLElement;
  const helpContent = root.querySelector('#help-body-content') as HTMLElement;
  const modalPropose = root.querySelector('#modal-propose') as HTMLElement;
  const modalPause = root.querySelector('#modal-pause') as HTMLElement;
  const proposeGrid = root.querySelector('#propose-targets-grid') as HTMLElement;

  // Renderizar opções do criador de trilha
  const selectedTargets: string[] = [];
  Object.values(TARGETS_CATALOG).forEach(target => {
    const item = document.createElement('div');
    item.className = 'propose-item';
    item.textContent = target.name;
    item.dataset.id = target.id;
    item.addEventListener('click', () => {
      const idx = selectedTargets.indexOf(target.id);
      if (idx >= 0) {
        selectedTargets.splice(idx, 1);
        item.classList.remove('selected');
      } else {
        selectedTargets.push(target.id);
        item.classList.add('selected');
      }
    });
    proposeGrid.appendChild(item);
  });

  // Atualizar visualização a partir do estado do jogo
  gameState.subscribe((s: GameState) => {
    const target = gameState.getCurrentTarget();
    if (s.mode === 'livre') {
      commandLabel.textContent = 'Modo Livre: Explore o parque';
      stepBadge.textContent = 'Exploração';
    } else if (target) {
      commandLabel.textContent = target.command;
      stepBadge.textContent = `Etapa ${s.currentStepIndex + 1} de ${s.sequence.length}`;
      helpContent.textContent = target.hint;
    }

    feedbackBanner.textContent = s.feedbackText;

    modalHelp.classList.toggle('open', s.isHelpOpen);
    modalPropose.classList.toggle('open', s.isProposeOpen);
    modalPause.classList.toggle('open', s.isPaused);
  });

  // Event Listeners
  root.querySelector('#btn-repeat')?.addEventListener('click', () => gameState.repeatInstruction());
  root.querySelector('#btn-help')?.addEventListener('click', () => gameState.toggleHelp(true));
  root.querySelector('#btn-close-help')?.addEventListener('click', () => gameState.toggleHelp(false));
  root.querySelector('#btn-pause')?.addEventListener('click', () => gameState.togglePause(true));
  root.querySelector('#btn-resume')?.addEventListener('click', () => gameState.togglePause(false));
  root.querySelector('#btn-propose')?.addEventListener('click', () => gameState.toggleProposeMode(true));
  root.querySelector('#btn-cancel-propose')?.addEventListener('click', () => gameState.toggleProposeMode(false));
  root.querySelector('#btn-free-mode')?.addEventListener('click', () => {
    gameState.setFreeMode();
    gameState.togglePause(false);
  });
  root.querySelector('#btn-restart-master')?.addEventListener('click', () => {
    gameState.setMasterMode();
    gameState.togglePause(false);
  });
  root.querySelector('#btn-start-custom-trail')?.addEventListener('click', () => {
    if (selectedTargets.length > 0) {
      gameState.setCustomSequence(selectedTargets);
    }
  });

  root.querySelector('#btn-audio')?.addEventListener('click', () => {
    const isMuted = onAudioToggle();
    (root.querySelector('#btn-audio') as HTMLElement).style.opacity = isMuted ? '0.5' : '1.0';
  });

  root.querySelector('#btn-cam')?.addEventListener('click', () => onCameraToggle());
  root.querySelector('#btn-respawn')?.addEventListener('click', () => onReturnCheckpoint());
  root.querySelector('#btn-interact-action')?.addEventListener('click', () => onDirectInteract());

  return root;
}
