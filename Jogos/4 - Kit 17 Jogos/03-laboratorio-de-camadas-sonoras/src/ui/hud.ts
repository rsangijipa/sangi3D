/**
 * Laboratório de Camadas Sonoras — HUD e Interface DOM de Alta Fidelidade
 * Painel "Escolher o foco", 5 sliders horizontais com botões de solo (fone), botões Isolar / Silenciar tudo
 */

import { ChannelId, GameState, GameAction } from '../game/state';
import { CHANNELS_CATALOG, AUDIO_CHALLENGES } from '../game/content';

export interface UIEventHandlers {
  onDispatch: (action: GameAction) => void;
  onSliderChange: (channelId: ChannelId, level: number) => void;
  onSoloToggle: (channelId: ChannelId) => void;
  onMuteAllToggle: () => void;
  onIsolateToggle: () => void;
  onStartAudio: () => void;
}

export class GameHUD {
  private container: HTMLElement;
  private handlers: UIEventHandlers;
  private rootElement: HTMLElement;

  constructor(container: HTMLElement, handlers: UIEventHandlers) {
    this.container = container;
    this.handlers = handlers;

    this.rootElement = document.createElement('div');
    this.rootElement.className = 'hud-root-layer';
    this.container.appendChild(this.rootElement);
  }

  public render(state: GameState): void {
    // 1. Linhas dos 5 canais do mixer
    const channelsRowsHtml = CHANNELS_CATALOG.map(ch => {
      const channelState = state.channels.find(c => c.id === ch.id);
      const level = channelState ? channelState.level : 0;
      const isSolo = state.soloId === ch.id;
      const isFocused = state.focusedChannelId === ch.id;
      const percent = Math.round(level * 100);

      return `
        <div class="channel-slider-row ${isFocused ? 'row-focused' : ''} ${isSolo ? 'row-solo' : ''}" data-channel-id="${ch.id}">
          <!-- Ícone do canal -->
          <div class="channel-icon-col" title="${ch.name}">
            ${this.getChannelSvgIcon(ch.id)}
          </div>

          <!-- Slider horizontal -->
          <div class="channel-slider-col">
            <div class="slider-track-wrap">
              <input
                type="range"
                min="0"
                max="100"
                value="${percent}"
                class="horizontal-slider ${isSolo ? 'slider-solo' : ''}"
                data-channel-id="${ch.id}"
                aria-label="Volume de ${ch.name}"
              />
              <div class="slider-fill-bar ${isSolo ? 'fill-solo' : ''}" style="width: ${percent}%;"></div>
            </div>
          </div>

          <!-- Botão Fone (Solo) -->
          <div class="channel-button-col">
            <button
              class="headphone-solo-btn ${isSolo ? 'btn-solo-active' : ''}"
              data-channel-id="${ch.id}"
              title="Isolar ${ch.name} em solo (Atalho: clique na redoma ou tecla)"
              aria-label="Isolar ${ch.name}"
            >
              <svg class="hp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Mensagem contextual se houver
    let feedbackHtml = '';
    if (state.feedbackMessage) {
      feedbackHtml = `
        <div class="hud-feedback-banner banner-${state.feedbackMessage.type}" role="status">
          <span>${state.feedbackMessage.text}</span>
        </div>
      `;
    }

    this.rootElement.innerHTML = `
      <!-- Banner de ativação de áudio se ainda não iniciado (Começar sempre silencioso) -->
      ${!state.audioStarted ? `
        <div class="audio-start-prompt" role="alert">
          <button class="btn-start-audio" id="btn-activate-audio">
            <span class="icon-pulse">🔊</span>
            <strong>Ativar Som do Laboratório</strong>
          </button>
        </div>
      ` : ''}

      ${feedbackHtml}

      <!-- Painel Lateral Direito (Desktop) / Bottom Sheet (Mobile) — Fiel ao Mockup -->
      <aside class="focus-control-card" aria-label="Painel de Foco e Mixagem">
        <div class="sheet-drag-handle" aria-hidden="true"></div>

        <div class="card-header">
          <h2 class="card-title">Escolher o foco</h2>
        </div>

        <!-- 5 Sliders de Canais -->
        <div class="channels-stack">
          ${channelsRowsHtml}
        </div>

        <!-- Botões de Ação Principais (Isolar e Silenciar tudo) -->
        <div class="card-action-buttons">
          <button class="hud-action-btn btn-isolate" id="btn-isolate-action">
            ${state.soloId ? 'Desfazer isolar' : 'Isolar'}
          </button>

          <button class="hud-action-btn btn-mute-all ${state.masterMute ? 'muted-active' : ''}" id="btn-mute-all-action">
            ${state.masterMute ? 'Reativar som' : 'Silenciar tudo'}
          </button>
        </div>
      </aside>

      <!-- Barra de Ferramentas Complementares (Inferior Esquerda) -->
      <nav class="bottom-tools-bar" aria-label="Ajustes e Desafios">
        <button class="tool-pill-btn" id="btn-toggle-ab" title="Alternar entre Mixagem A e B">
          Mix: <strong>${state.activeMixPreset}</strong> (A/B)
        </button>

        <button class="tool-pill-btn" id="btn-challenges-open" title="Desafios de seleção auditiva">
          🎯 Desafios
        </button>

        <button class="tool-pill-btn" id="btn-reflection-open" title="Reflexão e Observações">
          📖 Reflexão
        </button>

        <button class="tool-pill-btn" id="btn-reset-mix" title="Zerar todos os faders">
          ↺ Zerar
        </button>
      </nav>

      <!-- Modais Injetáveis -->
      ${this.renderModals(state)}
    `;

    this.bindListeners(state);
  }

  private getChannelSvgIcon(id: ChannelId): string {
    switch (id) {
      case 'speech':
        // Balão de diálogo com 3 pontos
        return `
          <svg class="chan-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="8" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="10" r="1" fill="currentColor"/>
            <circle cx="16" cy="10" r="1" fill="currentColor"/>
          </svg>
        `;
      case 'footsteps':
        // Tênis esportivo
        return `
          <svg class="chan-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 17h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1z"/>
            <path d="M4 17l4-10h4l2 4 6 2v4H4z"/>
            <line x1="8" y1="11" x2="11" y2="11"/>
            <line x1="9" y1="14" x2="13" y2="14"/>
          </svg>
        `;
      case 'fan':
        // Ventilador de pás
        return `
          <svg class="chan-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 9V3c2.5 0 3 2 3 3"/>
            <path d="M15 12h6c0 2.5-2 3-3 3"/>
            <path d="M12 15v6c-2.5 0-3-2-3-3"/>
            <path d="M9 12H3c0-2.5 2-3 3-3"/>
          </svg>
        `;
      case 'city':
        // Prédios urbanos
        return `
          <svg class="chan-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="8" width="8" height="13" rx="1"/>
            <rect x="12" y="4" width="8" height="17" rx="1"/>
            <line x1="7" y1="12" x2="9" y2="12"/>
            <line x1="7" y1="16" x2="9" y2="16"/>
            <line x1="15" y1="8" x2="17" y2="8"/>
            <line x1="15" y1="12" x2="17" y2="12"/>
          </svg>
        `;
      case 'music':
        // Nota musical
        return `
          <svg class="chan-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        `;
    }
  }

  private renderModals(state: GameState): string {
    if (!state.activeModal) return '';

    if (state.activeModal === 'challenge') {
      return `
        <div class="modal-backdrop">
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-ch-title">
            <header class="modal-header">
              <h3 id="modal-ch-title">Desafios de Seleção Auditiva</h3>
              <button class="btn-close-modal" id="btn-close-modal">✕</button>
            </header>
            <div class="modal-body">
              <p class="modal-intro">Ouça atentamente os sons sobrepostos e identifique a camada destacada na bancada:</p>
              <div class="challenges-grid">
                ${AUDIO_CHALLENGES.map(ch => {
                  return `
                    <div class="challenge-item-card">
                      <div class="ch-head">
                        <strong>${ch.title}</strong>
                        <span class="ch-badge">${ch.difficulty}</span>
                      </div>
                      <p>${ch.description}</p>
                      <button class="btn-start-ch" data-challenge-id="${ch.id}">
                        Iniciar este desafio
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <footer class="modal-footer">
              <button class="hud-action-btn btn-isolate" id="btn-close-modal-footer">Fechar</button>
            </footer>
          </div>
        </div>
      `;
    }

    if (state.activeModal === 'reflection') {
      return `
        <div class="modal-backdrop">
          <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-refl-title">
            <header class="modal-header">
              <h3 id="modal-refl-title">Reflexão Sensorial & Observações</h3>
              <button class="btn-close-modal" id="btn-close-modal">✕</button>
            </header>
            <div class="modal-body">
              <div class="metrics-summary-box">
                <h4>Observações Objetivas da Sessão:</h4>
                <ul>
                  <li>Ajustes de fader realizados: <strong>${state.metrics.adjustmentsCount}</strong></li>
                  <li>Isolamentos solo testados: <strong>${state.metrics.solosTested}</strong></li>
                  <li>Desafios completados: <strong>${state.metrics.challengesCompleted}</strong></li>
                  <li>Tempo ativo na bancada: <strong>${Math.floor(state.metrics.activeDurationSec)} s</strong></li>
                </ul>
                <small class="ethics-disclaimer">*Apenas descrição. O significado é de quem cria.*</small>
              </div>

              <div class="reflection-prompts">
                <h4>Perguntas Fenomenológicas de Exploração:</h4>
                <blockquote class="refl-quote">
                  “O que muda na sua sensação corporal quando uma camada contínua (como o ventilador) é silenciada?”
                </blockquote>
                <blockquote class="refl-quote">
                  “Entre os passos cadenciados e a melodia acústica, qual fonte ofereceu uma âncora de atenção mais tranquila?”
                </blockquote>
              </div>
            </div>
            <footer class="modal-footer">
              <button class="hud-action-btn btn-isolate" id="btn-close-modal-footer">Continuar Explorando</button>
            </footer>
          </div>
        </div>
      `;
    }

    return '';
  }

  private bindListeners(state: GameState): void {
    // 1. Ativar som
    const activateBtn = document.getElementById('btn-activate-audio');
    if (activateBtn) {
      activateBtn.addEventListener('click', () => this.handlers.onStartAudio());
    }

    // 2. Sliders horizontais
    document.querySelectorAll<HTMLInputElement>('.horizontal-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const chId = target.dataset.channelId as ChannelId;
        const val = parseInt(target.value, 10) / 100;
        if (chId) {
          this.handlers.onSliderChange(chId, val);
        }
      });
    });

    // 3. Botões Fone Solo
    document.querySelectorAll<HTMLButtonElement>('.headphone-solo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chId = btn.dataset.channelId as ChannelId;
        if (chId) {
          this.handlers.onSoloToggle(chId);
        }
      });
    });

    // 4. Botão Isolar principal
    const isolateBtn = document.getElementById('btn-isolate-action');
    if (isolateBtn) {
      isolateBtn.addEventListener('click', () => this.handlers.onIsolateToggle());
    }

    // 5. Botão Silenciar tudo principal
    const muteAllBtn = document.getElementById('btn-mute-all-action');
    if (muteAllBtn) {
      muteAllBtn.addEventListener('click', () => this.handlers.onMuteAllToggle());
    }

    // 6. Barra de ferramentas inferior
    const abBtn = document.getElementById('btn-toggle-ab');
    if (abBtn) {
      abBtn.addEventListener('click', () => {
        const next = state.activeMixPreset === 'A' ? 'B' : 'A';
        this.handlers.onDispatch({ type: 'LOAD_MIX_SNAPSHOT', payload: next });
      });
    }

    const chBtn = document.getElementById('btn-challenges-open');
    if (chBtn) {
      chBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: 'challenge' });
      });
    }

    const reflBtn = document.getElementById('btn-reflection-open');
    if (reflBtn) {
      reflBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: 'reflection' });
      });
    }

    const resetBtn = document.getElementById('btn-reset-mix');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'RESET_MIX' });
      });
    }

    // 7. Modais
    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
      });
    }

    const closeFooterBtn = document.getElementById('btn-close-modal-footer');
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => {
        this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
      });
    }

    // Iniciar desafios
    document.querySelectorAll<HTMLButtonElement>('.btn-start-ch').forEach(btn => {
      btn.addEventListener('click', () => {
        const chId = btn.dataset.challengeId;
        const challenge = AUDIO_CHALLENGES.find(c => c.id === chId);
        if (challenge) {
          // Configura background
          challenge.backgroundChannels.forEach(bg => {
            this.handlers.onSliderChange(bg.id, bg.level);
          });
          this.handlers.onDispatch({
            type: 'START_CHALLENGE',
            payload: { targetId: challenge.targetId }
          });
          this.handlers.onDispatch({ type: 'SET_MODAL', payload: null });
        }
      });
    });
  }
}
