// src/ui/hud.ts
// Gerenciador da interface DOM responsiva, acessível e idêntica ao mockup.png
import { GameState, GameTool, GameStep, ComparisonChoice, GameMode } from '../game/state';
import { GAME_STEPS } from '../game/content';

export interface HudCallbacks {
  onSelectTool: (tool: GameTool) => void;
  onSetStep: (step: GameStep) => void;
  onSelectSource: (sourceId: string) => void;
  onTogglePlay: (sourceId: string) => void;
  onToggleGlobalMute: () => void;
  onSetSourceVolume: (sourceId: string, gain: number) => void;
  onCompareSelectA: (sourceId: string) => void;
  onCompareSelectB: (sourceId: string) => void;
  onComparePlaySide: (side: 'A' | 'B' | null) => void;
  onCompareSubmitChoice: (choice: ComparisonChoice) => void;
  onToggleComposition: (sourceId: string) => void;
  onRequestHint: () => void;
  onSelectMode: (mode: GameMode) => void;
  onNudgeActive: (dx: number, dz: number) => void;
  onOpenReview: () => void;
  onReset: () => void;
  onExportJson: () => void;
}

export class Hud {
  private root: HTMLElement;
  private callbacks: HudCallbacks;
  private activeModal: string | null = null;
  private confirmResetPending = false;

  constructor(container: HTMLElement, callbacks: HudCallbacks) {
    this.root = container;
    this.callbacks = callbacks;
  }

  public render(state: GameState) {
    const currentStepDef = GAME_STEPS.find((s) => s.step === state.step) || GAME_STEPS[2];
    const selectedSource = state.sources.find((s) => s.id === state.selectedSourceId) || state.sources[0];
    const isCurrentPlaying = selectedSource.isPlaying && !state.globalMuted;

    // SVG icons fiéis à referência visual
    const icons = {
      ear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 4-2.5 6-4 7.5-.7.7-1 1.7-1 2.5a2.5 2.5 0 0 1-5 0c0-1.2.7-2.3 1.5-3.1 1.1-1.1 2.5-2.4 2.5-4.4a3.5 3.5 0 1 0-7 0"/></svg>`,
      move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><path d="M12 2v20M2 12h20M12 2l-3.5 3.5M12 2l3.5 3.5M12 22l-3.5-3.5M12 22l3.5-3.5M2 12l3.5-3.5M2 12l3.5 3.5M22 12l-3.5-3.5M22 12l3.5 3.5"/></svg>`,
      compare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><rect x="8" y="8" width="13" height="13" rx="3"/><path d="M4 16H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/></svg>`,
      playTriangle: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="6,4 20,12 6,20"/></svg>`,
      pauseBars: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
      speakerMute: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`,
      speakerSound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19 5a10 10 0 0 1 0 14M15.5 8.5a5 5 0 0 1 0 7"/></svg>`,
      help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
    };

    // Linha de progresso com 5 pontos e linhas conectoras idênticas ao mockup
    const buildProgressRow = () => {
      let dots = '';
      for (let i = 1; i <= 5; i++) {
        let cls = 'dot';
        if (i < state.step) cls += ' completed';
        if (i === state.step) cls += ' active';
        dots += `<div class="${cls}" data-step="${i}" title="Ir para etapa ${i}" role="button" tabindex="0"></div>`;
        if (i < 5) {
          const lineCls = i < state.step ? 'line-connector completed' : 'line-connector';
          dots += `<div class="${lineCls}"></div>`;
        }
      }
      return `
        <div class="hud-progress-row">
          <div class="dots-chain" aria-label="Progresso da experiência">
            ${dots}
          </div>
          <span class="step-label">${state.step} de 5</span>
        </div>
      `;
    };

    // Conteúdo auxiliar contextual exibido apenas quando estritamente necessário (etapas 1, 4, 5)
    let auxiliaryContent = '';
    if (state.step === 1) {
      auxiliaryContent = `
        <div class="step-extra-box">
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Fontes sonoras no mapa:</div>
          <div class="source-chips-grid">
            ${state.sources
              .map(
                (s) => `
              <button class="source-chip ${s.id === state.selectedSourceId ? 'active' : ''}" data-source-id="${s.id}">
                <span class="chip-color-dot" style="background: ${s.colorHex};"></span>
                ${s.shortName}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    } else if (state.step === 2) {
      auxiliaryContent = `
        <div class="step-extra-box">
          <div style="font-size: 12px; color: var(--color-text-muted);">
            📍 Ponto de escuta: [${state.listenerPos[0].toFixed(1)}, ${state.listenerPos[2].toFixed(1)}]<br/>
            Arraste o pino dourado pelo mapa para explorar diferentes distâncias.
          </div>
        </div>
      `;
    } else if (state.step === 4) {
      auxiliaryContent = `
        <div class="step-extra-box">
          <div class="compare-ab-row">
            <button class="btn-compare-side ${state.comparison.activePlaying === 'A' ? 'active' : ''}" data-side="A">
              Ouvir A (${state.sources.find((s) => s.id === state.comparison.sourceAId)?.shortName || 'Ônibus'})
            </button>
            <button class="btn-compare-side ${state.comparison.activePlaying === 'B' ? 'active' : ''}" data-side="B">
              Ouvir B (${state.sources.find((s) => s.id === state.comparison.sourceBId)?.shortName || 'Fonte'})
            </button>
          </div>
          <div style="font-size: 12px; font-weight: 600; margin: 6px 0 4px;">Qual fonte parece mais próxima do ouvinte?</div>
          <div class="compare-choices-grid">
            <button class="btn-choice ${state.comparison.userChoice === 'closer' ? 'active' : ''}" data-choice="closer">Mais perto (A)</button>
            <button class="btn-choice ${state.comparison.userChoice === 'further' ? 'active' : ''}" data-choice="further">Mais longe (A)</button>
            <button class="btn-choice ${state.comparison.userChoice === 'similar' ? 'active' : ''}" data-choice="similar">Parecidas</button>
            <button class="btn-choice ${state.comparison.userChoice === 'dont_know' ? 'active' : ''}" data-choice="dont_know">Não sei / dúvida</button>
          </div>
        </div>
      `;
    } else if (state.step === 5) {
      auxiliaryContent = `
        <div class="step-extra-box">
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Harmonize até 3 fontes sonoras:</div>
          <div class="composition-chips-grid">
            ${state.sources
              .map((s) => {
                const isSelected = state.compositionSourceIds.includes(s.id);
                return `
                <button class="btn-comp-chip ${isSelected ? 'active' : ''}" data-comp-id="${s.id}">
                  ${isSelected ? '✓' : '+'} ${s.shortName}
                </button>
              `;
              })
              .join('')}
          </div>
          <button class="btn-review-open" style="margin-top: 8px;">
            📜 Rever e Concluir Cartografia
          </button>
        </div>
      `;
    }

    this.root.innerHTML = `
      <!-- Card Superior Esquerdo: Cartografia dos Sons (Sem tags espúrias, fiel ao mockup) -->
      <header class="brand-badge interactive" role="banner">
        <h1>Cartografia dos Sons</h1>
      </header>

      <!-- Ações rápidas discretas de acessibilidade e ajuda -->
      <nav class="header-actions interactive" aria-label="Opções e Acessibilidade">
        <button class="icon-circle-btn btn-hint" title="Pedir Dica" aria-label="Pedir Dica">${icons.help}</button>
        <button class="icon-circle-btn btn-settings" title="Configurações e Controles" aria-label="Configurações">${icons.settings}</button>
      </nav>

      <!-- Painel Flutuante (Desktop) e Bottom Sheet (Mobile) -->
      <aside class="hud-panel interactive" aria-label="Painel de controle sonoro">
        <div class="hud-drag-handle"></div>

        <div class="hud-header">
          <h2 class="hud-title">${currentStepDef.title}</h2>
          <div class="desktop-progress-wrapper">
            ${buildProgressRow()}
          </div>
        </div>

        <!-- Barra com as 3 ferramentas (Ouvir, Mover, Comparar) sem rótulos de texto dentro do botão como no mockup -->
        <div class="tools-bar" role="tablist" aria-label="Ferramentas">
          <button class="tool-btn ${state.activeTool === 'listen' ? 'active' : ''}" data-tool="listen" role="tab" aria-selected="${state.activeTool === 'listen'}" title="Ferramenta Ouvir" aria-label="Ouvir">
            ${icons.ear}
          </button>
          <button class="tool-btn ${state.activeTool === 'move' ? 'active' : ''}" data-tool="move" role="tab" aria-selected="${state.activeTool === 'move'}" title="Ferramenta Mover" aria-label="Mover">
            ${icons.move}
          </button>
          <button class="tool-btn ${state.activeTool === 'compare' ? 'active' : ''}" data-tool="compare" role="tab" aria-selected="${state.activeTool === 'compare'}" title="Ferramenta Comparar" aria-label="Comparar">
            ${icons.compare}
          </button>
        </div>

        ${auxiliaryContent}

        <!-- Botão Primário: Ouvir / Pausar -->
        <button class="btn-primary ${isCurrentPlaying ? 'is-playing' : ''}" id="btn-cta-play">
          ${isCurrentPlaying ? icons.pauseBars : icons.playTriangle}
          <span>${isCurrentPlaying ? 'Pausar' : 'Ouvir'}</span>
        </button>

        <!-- Botão Secundário: Silenciar tudo / Ativar som -->
        <button class="btn-secondary ${state.globalMuted ? 'is-muted' : ''}" id="btn-cta-mute">
          ${state.globalMuted ? icons.speakerSound : icons.speakerMute}
          <span>${state.globalMuted ? 'Ativar som' : 'Silenciar tudo'}</span>
        </button>

        <!-- No mobile: Linha de progresso posicionada na base conforme mockup -->
        <div class="mobile-progress-wrapper">
          ${buildProgressRow()}
        </div>
      </aside>

      <!-- Barra de Legendas Sonoras Visuais na Base -->
      <footer class="sound-captions-bar interactive" role="status" aria-live="polite">
        <div class="sound-wave-visualizer">
          <div class="wave-bar ${isCurrentPlaying ? 'animating' : ''}" style="height: ${isCurrentPlaying ? '14px' : '4px'}"></div>
          <div class="wave-bar ${isCurrentPlaying ? 'animating' : ''}" style="height: ${isCurrentPlaying ? '18px' : '4px'}"></div>
          <div class="wave-bar ${isCurrentPlaying ? 'animating' : ''}" style="height: ${isCurrentPlaying ? '10px' : '4px'}"></div>
        </div>
        <div class="sound-caption-text">
          <strong>${selectedSource.name}:</strong> ${selectedSource.captionText}
          ${state.globalMuted ? ' <span style="color: var(--color-terracotta); font-weight: 600;">(Silenciado)</span>' : ''}
        </div>
      </footer>

      <!-- Modais Renderizados Dinamicamente -->
      ${this.renderActiveModal(state)}
    `;

    this.attachEventListeners(state);
  }

  private renderActiveModal(state: GameState): string {
    if (!this.activeModal) return '';

    if (this.activeModal === 'settings') {
      return `
        <div class="modal-backdrop interactive">
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <h2 id="settings-title">Configurações & Acessibilidade</h2>
            <div style="display: flex; flex-direction: column; gap: 14px; font-size: 14px;">
              <div>
                <strong>Modo de Experiência:</strong>
                <div class="mode-buttons-row">
                  <button class="btn-mode ${state.mode === 'free' ? 'active' : ''}" data-mode="free">Livre</button>
                  <button class="btn-mode ${state.mode === 'guided' ? 'active' : ''}" data-mode="guided">Guiado</button>
                  <button class="btn-mode ${state.mode === 'assisted' ? 'active' : ''}" data-mode="assisted">Acompanhado</button>
                </div>
              </div>

              <!-- Controles Direcionais em Tela para Acessibilidade Motora -->
              <div>
                <strong>Controle Direcional em Tela (D-Pad):</strong>
                <div class="dpad-container">
                  <button class="btn-dpad" data-nudge-x="0" data-nudge-z="-0.25" title="Mover para Norte">▲</button>
                  <div class="dpad-middle">
                    <button class="btn-dpad" data-nudge-x="-0.25" data-nudge-z="0" title="Mover para Oeste">◀</button>
                    <button class="btn-dpad" data-nudge-x="0.25" data-nudge-z="0" title="Mover para Leste">▶</button>
                  </div>
                  <button class="btn-dpad" data-nudge-x="0" data-nudge-z="0.25" title="Mover para Sul">▼</button>
                </div>
              </div>

              <div style="background: rgba(0,0,0,0.04); padding: 12px; border-radius: 12px;">
                <strong>Atalhos de Teclado (WCAG 2.1 AA):</strong>
                <ul style="margin-left: 18px; margin-top: 4px; line-height: 1.6; font-size: 13px;">
                  <li><strong>Setas / WASD:</strong> Mover token ou pino em snap de 0.25 m</li>
                  <li><strong>Espaço:</strong> Tocar / Pausar som ativo</li>
                  <li><strong>M:</strong> Silenciar tudo / Restaurar som</li>
                  <li><strong>1 / 2 / 3:</strong> Alternar ferramentas Ouvir, Mover e Comparar</li>
                  <li><strong>PageDown / PageUp:</strong> Avançar / Voltar etapa</li>
                  <li><strong>Esc:</strong> Pausar / Retomar</li>
                </ul>
              </div>
            </div>
            <button class="btn-primary btn-close-modal" style="height: 44px; margin-top: 8px;">Concluir</button>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'hint') {
      const stepDef = GAME_STEPS.find((s) => s.step === state.step) || GAME_STEPS[2];
      return `
        <div class="modal-backdrop interactive">
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="hint-title">
            <h2 id="hint-title">💡 Dica da Etapa ${state.step}</h2>
            <p style="font-size: 15px; line-height: 1.6; color: var(--color-text-dark);">
              ${stepDef.hint}
            </p>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.5; background: rgba(0,0,0,0.04); padding: 10px; border-radius: 10px;">
              <strong>Instrução:</strong> ${stepDef.instruction}
            </p>
            <button class="btn-primary btn-close-modal" style="height: 44px; margin-top: 6px;">Entendi</button>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'review') {
      return `
        <div class="modal-backdrop interactive">
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <h2 id="review-title">Resumo da Cartografia Sonora</h2>
            <p style="font-size: 14px; color: var(--color-text-dark); line-height: 1.5;">
              Parabéns por explorar a cidade em miniatura! Aqui está o registro objetivo da sua sessão cartográfica:
            </p>
            <div style="background: rgba(0,0,0,0.04); padding: 14px; border-radius: 14px; font-size: 13px; line-height: 1.8;">
              <div>🗺️ <strong>Fontes exploradas:</strong> ${state.observations.exploredSourcesCount} de 5</div>
              <div>⚖️ <strong>Comparações registradas:</strong> ${state.observations.comparisonsCount}</div>
              <div>💡 <strong>Dicas solicitadas:</strong> ${state.observations.hintsCount}</div>
              <div>⏱️ <strong>Duração ativa:</strong> ${Math.round(state.observations.durationSeconds)} segundos</div>
              <div>🎶 <strong>Composição favorita:</strong> ${state.compositionSourceIds.join(', ')}</div>
            </div>
            ${
              this.confirmResetPending
                ? `
              <div class="confirm-reset-box" style="background: #fde8e4; padding: 12px; border-radius: 12px; border: 1px solid #f87171;">
                <p style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 8px;">Deseja realmente recomeçar a experiência do início?</p>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-primary btn-confirm-reset" style="height: 38px; background: #dc2626; flex: 1;">Sim, recomeçar</button>
                  <button class="btn-secondary btn-cancel-reset" style="height: 38px; flex: 1;">Cancelar</button>
                </div>
              </div>
            `
                : `
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn-primary btn-export-json" style="height: 46px; flex: 1;">💾 Exportar JSON</button>
                <button class="btn-secondary btn-trigger-reset" style="height: 46px; flex: 1;">🔄 Recomeçar</button>
              </div>
            `
            }
            <button class="btn-secondary btn-close-modal" style="height: 40px; margin-top: 4px;">Voltar ao Mapa</button>
          </div>
        </div>
      `;
    }

    return '';
  }

  private attachEventListeners(state: GameState) {
    // 1. Ferramentas (Ouvir, Mover, Comparar)
    this.root.querySelectorAll<HTMLElement>('.tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool') as GameTool;
        if (tool) this.callbacks.onSelectTool(tool);
      });
    });

    // 2. Pontos de Etapa (1 a 5)
    this.root.querySelectorAll<HTMLElement>('.dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const step = Number(dot.getAttribute('data-step')) as GameStep;
        if (step) this.callbacks.onSetStep(step);
      });
    });

    // 3. Botão CTA Ouvir
    const ctaPlay = this.root.querySelector('#btn-cta-play');
    if (ctaPlay) {
      ctaPlay.addEventListener('click', () => {
        this.callbacks.onTogglePlay(state.selectedSourceId);
      });
    }

    // 4. Botão CTA Silenciar tudo
    const ctaMute = this.root.querySelector('#btn-cta-mute');
    if (ctaMute) {
      ctaMute.addEventListener('click', () => {
        this.callbacks.onToggleGlobalMute();
      });
    }

    // 5. Botões de Fonte
    this.root.querySelectorAll<HTMLElement>('.source-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const sid = chip.getAttribute('data-source-id');
        if (sid) this.callbacks.onSelectSource(sid);
      });
    });

    // 6. Botões de Comparação
    this.root.querySelectorAll<HTMLElement>('.btn-compare-side').forEach((btn) => {
      btn.addEventListener('click', () => {
        const side = btn.getAttribute('data-side') as 'A' | 'B';
        const currentActive = state.comparison.activePlaying;
        this.callbacks.onComparePlaySide(currentActive === side ? null : side);
      });
    });

    this.root.querySelectorAll<HTMLElement>('.btn-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-choice') as ComparisonChoice;
        if (choice) this.callbacks.onCompareSubmitChoice(choice);
      });
    });

    // 7. Botões de Composição
    this.root.querySelectorAll<HTMLElement>('.btn-comp-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cid = chip.getAttribute('data-comp-id');
        if (cid) this.callbacks.onToggleComposition(cid);
      });
    });

    // 8. Botão Abrir Revisão
    const btnReviewOpen = this.root.querySelector('.btn-review-open');
    if (btnReviewOpen) {
      btnReviewOpen.addEventListener('click', () => {
        this.activeModal = 'review';
        this.callbacks.onOpenReview();
        this.render(state);
      });
    }

    // 9. Dica e Configurações
    const btnHint = this.root.querySelector('.btn-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        this.activeModal = 'hint';
        this.callbacks.onRequestHint();
        this.render(state);
      });
    }

    const btnSettings = this.root.querySelector('.btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        this.activeModal = 'settings';
        this.render(state);
      });
    }

    // 10. Seleção de Modo (Livre, Guiado, Acompanhado)
    this.root.querySelectorAll<HTMLElement>('.btn-mode').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as GameMode;
        if (mode) this.callbacks.onSelectMode(mode);
      });
    });

    // 11. D-Pad Direcional
    this.root.querySelectorAll<HTMLElement>('.btn-dpad').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dx = parseFloat(btn.getAttribute('data-nudge-x') || '0');
        const dz = parseFloat(btn.getAttribute('data-nudge-z') || '0');
        this.callbacks.onNudgeActive(dx, dz);
      });
    });

    // 12. Fechar modais
    this.root.querySelectorAll<HTMLElement>('.btn-close-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeModal = null;
        this.confirmResetPending = false;
        this.render(state);
      });
    });

    // 13. Exportar JSON
    const btnExport = this.root.querySelector('.btn-export-json');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        this.callbacks.onExportJson();
      });
    }

    // 14. Reset com confirmação obrigatória
    const btnTriggerReset = this.root.querySelector('.btn-trigger-reset');
    if (btnTriggerReset) {
      btnTriggerReset.addEventListener('click', () => {
        this.confirmResetPending = true;
        this.render(state);
      });
    }

    const btnConfirmReset = this.root.querySelector('.btn-confirm-reset');
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener('click', () => {
        this.confirmResetPending = false;
        this.activeModal = null;
        this.callbacks.onReset();
      });
    }

    const btnCancelReset = this.root.querySelector('.btn-cancel-reset');
    if (btnCancelReset) {
      btnCancelReset.addEventListener('click', () => {
        this.confirmResetPending = false;
        this.render(state);
      });
    }
  }
}
