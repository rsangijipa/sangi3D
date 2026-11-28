/**
 * js/ui-controller.js
 * HUD serena e enxuta (<20% da vista desktop) com as ferramentas obrigatórias:
 * Rastelo, largura, pedra, limpar (+ Desfazer, Contemplação, Ajustes e Pausa).
 */
import { RAKE_WIDTHS } from './state.js';

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const toolButtons = Array.from(document.querySelectorAll('[data-tool-btn]'));
  const widthButtons = Array.from(document.querySelectorAll('[data-width-btn]'));
  const widthPop = $('width-popover');
  const clearPop = $('clear-popover');
  const drawer = $('settings-drawer');
  const pauseModal = $('pause-modal');
  const feedbackEl = $('feedback-pill');
  let feedbackTimer = null;

  function showFeedback(text, tone = 'info') {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.dataset.tone = tone;
    feedbackEl.classList.add('visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('visible'), 2200);
  }

  function syncToolbar() {
    toolButtons.forEach((btn) => {
      const isActive = btn.dataset.toolBtn === state.tool;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    const wSpec = RAKE_WIDTHS[state.rakeWidth] || RAKE_WIDTHS.medio;
    $('lbl-width-val').textContent = wSpec.label;
    widthButtons.forEach((btn) => {
      const active = btn.dataset.widthBtn === state.rakeWidth;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    const undoBtn = $('btn-undo');
    if (undoBtn) {
      undoBtn.disabled = state.undoDepth <= 0;
      undoBtn.title = state.undoDepth > 0 ? `Desfazer última ação (${state.undoDepth})` : 'Nada a desfazer';
    }

    const modeHint = state.tool === 'rastelo'
      ? `Rastelo ${wSpec.label.toLowerCase()} · ${state.strokeCount} traço(s)`
      : state.tool === 'pedra'
        ? 'Arraste uma pedra · Roda gira'
        : 'Arraste para orbitar o jardim';
    $('status-line').textContent = modeHint;
  }

  function closePopovers() {
    widthPop.hidden = true;
    clearPop.hidden = true;
    $('btn-width').setAttribute('aria-expanded', 'false');
    $('btn-clear').setAttribute('aria-expanded', 'false');
  }

  toolButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      state.tool = btn.dataset.toolBtn;
      syncToolbar();
      callbacks.onToolChange(state.tool);
    });
  });

  $('btn-width').addEventListener('click', () => {
    const nextOpen = widthPop.hidden;
    closePopovers();
    widthPop.hidden = !nextOpen;
    $('btn-width').setAttribute('aria-expanded', String(nextOpen));
  });

  widthButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.rakeWidth = btn.dataset.widthBtn;
      state.tool = 'rastelo';
      closePopovers();
      syncToolbar();
      callbacks.onWidthChange(state.rakeWidth);
    });
  });

  $('btn-clear').addEventListener('click', () => {
    const nextOpen = clearPop.hidden;
    closePopovers();
    clearPop.hidden = !nextOpen;
    $('btn-clear').setAttribute('aria-expanded', String(nextOpen));
  });

  document.querySelectorAll('[data-pattern]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onApplyPattern(btn.dataset.pattern);
    });
  });

  $('btn-undo').addEventListener('click', () => {
    closePopovers();
    callbacks.onUndo();
  });

  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) {
      closePopovers();
      setDrawerOpen(false);
    }
    callbacks.onMenuStateChange();
  }

  $('btn-contemplate').addEventListener('click', () => setContemplative(true));
  $('btn-restore-ui').addEventListener('click', () => setContemplative(false));

  function setDrawerOpen(open) {
    state.settingsOpen = Boolean(open);
    drawer.hidden = !state.settingsOpen;
    $('btn-settings').setAttribute('aria-expanded', String(state.settingsOpen));
    if (state.settingsOpen) closePopovers();
    callbacks.onMenuStateChange();
  }

  $('btn-settings').addEventListener('click', () => setDrawerOpen(!state.settingsOpen));
  $('btn-close-drawer').addEventListener('click', () => setDrawerOpen(false));

  function setPaused(paused) {
    state.paused = Boolean(paused);
    pauseModal.hidden = !state.paused;
    $('btn-pause').textContent = state.paused ? '▶' : '⏸';
    $('btn-pause').setAttribute('aria-label', state.paused ? 'Retomar' : 'Pausar');
    if (state.paused) closePopovers();
    callbacks.onMenuStateChange();
  }

  $('btn-pause').addEventListener('click', () => callbacks.onTogglePause());
  $('btn-resume-modal').addEventListener('click', () => callbacks.onTogglePause(false));
  $('btn-reset-modal').addEventListener('click', () => callbacks.onReset());
  $('btn-reset-drawer').addEventListener('click', () => callbacks.onReset());
  $('btn-exit').addEventListener('click', () => callbacks.onExit());

  // Controles do painel recolhível
  $('ctrl-sun').addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    state.sunAngle = v;
    $('ctrl-sun-val').textContent = v < 0.35 ? 'Manhã Rasante' : v < 0.7 ? 'Meio-dia Suave' : 'Fim de Tarde';
    callbacks.onSunChange(v);
  });

  $('ctrl-sound').addEventListener('change', (e) => {
    callbacks.onToggleSound(e.target.checked);
  });

  $('ctrl-volume').addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    state.volume = v;
    $('ctrl-volume-val').textContent = `${Math.round(v * 100)}%`;
    callbacks.onVolumeChange(v);
  });

  $('ctrl-reduced').addEventListener('change', (e) => {
    state.reducedMotion = e.target.checked;
    callbacks.onReducedMotionChange(state.reducedMotion);
  });

  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  document.querySelectorAll('[data-cam-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onCameraPreset(btn.dataset.camPreset);
      setDrawerOpen(false);
    });
  });

  // Bloqueia vazamento de eventos da HUD para o canvas 3D
  [
    $('top-header'),
    $('bottom-dock'),
    drawer,
    pauseModal,
    $('btn-restore-ui'),
    $('mobile-cam-pad'),
  ]
    .filter(Boolean)
    .forEach((el) => {
      ['pointerdown', 'wheel', 'touchstart'].forEach((evt) => {
        el.addEventListener(evt, (e) => e.stopPropagation(), { passive: evt !== 'wheel' });
      });
    });

  function updateDiagnostics(fps, calls, tris) {
    const el = $('diag-line');
    if (el) el.textContent = `${Math.round(fps)} FPS · ${calls} draws · ${tris} tris`;
  }

  function syncAll() {
    $('ctrl-sun').value = Math.round(state.sunAngle * 100);
    $('ctrl-sound').checked = state.soundEnabled && !state.muted;
    $('ctrl-volume').value = Math.round(state.volume * 100);
    $('ctrl-volume-val').textContent = `${Math.round(state.volume * 100)}%`;
    $('ctrl-reduced').checked = state.reducedMotion;
    $('ctrl-quality').value = state.qualityMode;
    syncToolbar();
    setPaused(state.paused);
    setContemplative(state.contemplative);
  }

  syncAll();

  return {
    showFeedback,
    syncToolbar,
    closePopovers,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
