/**
 * js/ui-controller.js
 * HUD museológica enxuta (<= 20% vista desktop, painel secundário fechado por padrão):
 * ferramentas "Espiral, abertura, escala, textura", alternância Inteira/Corte,
 * catálogo/comparação de 3 formas e Modo Fotografia (foco, enquadramento, exposição e PNG).
 */
import { PHOTO_FRAMINGS, TEXTURE_STYLES } from './state.js';

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const spiralPop = $('spiral-popover');
  const aperturePop = $('aperture-popover');
  const scalePop = $('scale-popover');
  const texturePop = $('texture-popover');
  const photoBar = $('photo-bar');
  const drawer = $('settings-drawer');
  const compareModal = $('compare-modal');
  const pauseModal = $('pause-modal');
  const feedbackEl = $('feedback-pill');
  const shutterFlash = $('shutter-flash');
  let feedbackTimer = null;

  function showFeedback(text, tone = 'info') {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.dataset.tone = tone;
    feedbackEl.classList.add('visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('visible'), 2200);
  }

  function triggerShutterFlash() {
    if (!shutterFlash || state.reducedMotion) return;
    shutterFlash.classList.remove('active');
    void shutterFlash.offsetWidth;
    shutterFlash.classList.add('active');
  }

  function closePopovers() {
    [spiralPop, aperturePop, scalePop, texturePop].forEach((p) => {
      if (p) p.hidden = true;
    });
    ['btn-spiral', 'btn-aperture', 'btn-scale', 'btn-texture'].forEach((id) => {
      const b = $(id);
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  function togglePopover(btnId, popEl) {
    const wasHidden = popEl.hidden;
    closePopovers();
    popEl.hidden = !wasHidden;
    $(btnId).setAttribute('aria-expanded', String(wasHidden));
  }

  function syncToolbar(metrics) {
    const tSpec = TEXTURE_STYLES[state.textureStyle] || TEXTURE_STYLES.banded;
    $('lbl-spiral-val').textContent = `${state.spiralTurns.toFixed(1)}v`;
    $('lbl-aperture-val').textContent = `${Math.round(state.aperture * 100)}%`;
    $('lbl-scale-val').textContent = `${state.scaleRatio.toFixed(2)}x`;
    $('lbl-texture-val').textContent = tSpec.short;

    $('pop-spiral-readout').textContent = `${state.spiralTurns.toFixed(2)} voltas`;
    $('pop-spiral-range').value = Math.round(state.spiralTurns * 100);
    $('pop-pitch-range').value = Math.round(state.spirePitch * 100);
    $('pop-pitch-readout').textContent = state.spirePitch < 0.08 ? 'Náutilo planar' : `Espira ${state.spirePitch.toFixed(2)}`;

    $('pop-aperture-readout').textContent = `${Math.round(state.aperture * 100)}%`;
    $('pop-aperture-range').value = Math.round(state.aperture * 100);

    $('pop-scale-readout').textContent = `${state.scaleRatio.toFixed(2)}x`;
    $('pop-scale-range').value = Math.round(state.scaleRatio * 100);

    document.querySelectorAll('[data-texture-btn]').forEach((b) => {
      const act = b.dataset.textureBtn === state.textureStyle;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });

    const cutBtn = $('btn-cutaway');
    cutBtn.classList.toggle('active', state.cutaway);
    cutBtn.setAttribute('aria-pressed', String(state.cutaway));
    cutBtn.textContent = state.cutaway ? 'Corte' : 'Inteira';

    $('lbl-catalog-count').textContent = `${state.catalog.length}/3`;

    const chTxt = metrics && state.cutaway ? ` · ${metrics.chamberCount} câmaras` : '';
    const ratioTxt = metrics ? ` · L/P ${metrics.ratioWH}` : '';
    $('status-line').textContent = `${tSpec.short} · ${state.cutaway ? 'Corte' : 'Inteira'}${chTxt}${ratioTxt}`;
  }

  function syncPhotoUI() {
    photoBar.hidden = !state.photoMode;
    $('btn-photo-mode').classList.toggle('active', state.photoMode);
    $('btn-photo-mode').setAttribute('aria-pressed', String(state.photoMode));
    $('photo-focus-range').value = Math.round(state.focusDist * 100);
    $('photo-exp-range').value = Math.round(state.exposure * 100);
    $('photo-dof-check').checked = state.dofEnabled;
    document.querySelectorAll('[data-framing-btn]').forEach((b) => {
      b.classList.toggle('active', b.dataset.framingBtn === state.framing);
    });
  }

  function renderCompareModal() {
    const grid = $('compare-grid');
    if (!grid) return;
    if (!state.catalog.length) {
      grid.innerHTML =
        '<p class="compare-empty">Nenhuma forma catalogada ainda. Ajuste a espiral e use <strong>+ Catalogar</strong> (até 3 espécimes) para comparar proporções lado a lado.</p>';
      return;
    }
    grid.innerHTML = '';
    state.catalog.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'compare-card';
      const img = document.createElement('img');
      img.src = item.thumbUrl;
      img.alt = item.name;
      const meta = document.createElement('div');
      meta.className = 'compare-meta';
      const tLabel = (TEXTURE_STYLES[item.textureStyle] || TEXTURE_STYLES.banded).short;
      meta.innerHTML = `
        <strong>Forma ${idx + 1} · ${tLabel}</strong>
        <span>Espiral: ${item.spiralTurns.toFixed(2)}v · Abertura: ${Math.round(item.aperture * 100)}%</span>
        <span>Escala: ${item.scaleRatio.toFixed(2)}x · Proporção L/P: ${item.ratioWH}</span>
        <span>Modo: ${item.cutaway ? `Corte (${item.chamberCount} câmaras)` : 'Inteira'}</span>
      `;
      const loadBtn = document.createElement('button');
      loadBtn.type = 'button';
      loadBtn.className = 'secondary-btn';
      loadBtn.textContent = 'Carregar na bancada';
      loadBtn.addEventListener('click', () => {
        callbacks.onLoadSpecimen(item);
        setCompareOpen(false);
      });
      card.append(img, meta, loadBtn);
      grid.appendChild(card);
    });
  }

  $('btn-spiral').addEventListener('click', () => togglePopover('btn-spiral', spiralPop));
  $('btn-aperture').addEventListener('click', () => togglePopover('btn-aperture', aperturePop));
  $('btn-scale').addEventListener('click', () => togglePopover('btn-scale', scalePop));
  $('btn-texture').addEventListener('click', () => togglePopover('btn-texture', texturePop));

  $('pop-spiral-range').addEventListener('input', (e) => {
    state.spiralTurns = Number(e.target.value) / 100;
    callbacks.onGeometryChange();
  });
  $('pop-pitch-range').addEventListener('input', (e) => {
    state.spirePitch = Number(e.target.value) / 100;
    callbacks.onGeometryChange();
  });
  $('pop-aperture-range').addEventListener('input', (e) => {
    state.aperture = Number(e.target.value) / 100;
    callbacks.onGeometryChange();
  });
  $('pop-scale-range').addEventListener('input', (e) => {
    state.scaleRatio = Number(e.target.value) / 100;
    callbacks.onGeometryChange();
  });

  document.querySelectorAll('[data-texture-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.textureStyle = btn.dataset.textureBtn;
      closePopovers();
      callbacks.onGeometryChange(true);
    });
  });

  $('btn-cutaway').addEventListener('click', () => {
    closePopovers();
    state.cutaway = !state.cutaway;
    callbacks.onGeometryChange(true);
    showFeedback(state.cutaway ? 'Corte anatômico revelando câmaras' : 'Concha inteira contínua', 'info');
  });

  $('btn-catalog').addEventListener('click', () => {
    closePopovers();
    callbacks.onCatalogSpecimen();
  });

  function setCompareOpen(open) {
    state.compareOpen = Boolean(open);
    compareModal.hidden = !state.compareOpen;
    if (state.compareOpen) {
      closePopovers();
      setDrawerOpen(false);
      renderCompareModal();
    }
    callbacks.onMenuStateChange();
  }

  $('btn-compare').addEventListener('click', () => setCompareOpen(!state.compareOpen));
  $('btn-close-compare').addEventListener('click', () => setCompareOpen(false));
  $('btn-clear-catalog').addEventListener('click', () => callbacks.onClearCatalog());

  // Modo Fotografia
  $('btn-photo-mode').addEventListener('click', () => {
    closePopovers();
    state.photoMode = !state.photoMode;
    syncPhotoUI();
    callbacks.onPhotoConfigChange();
  });
  $('btn-close-photo').addEventListener('click', () => {
    state.photoMode = false;
    syncPhotoUI();
    callbacks.onPhotoConfigChange();
  });
  $('photo-focus-range').addEventListener('input', (e) => {
    state.focusDist = Number(e.target.value) / 100;
    callbacks.onPhotoConfigChange();
  });
  $('photo-exp-range').addEventListener('input', (e) => {
    state.exposure = Number(e.target.value) / 100;
    callbacks.onPhotoConfigChange();
  });
  $('photo-dof-check').addEventListener('change', (e) => {
    state.dofEnabled = e.target.checked;
    callbacks.onPhotoConfigChange();
  });
  document.querySelectorAll('[data-framing-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onFramingChange(btn.dataset.framingBtn);
      syncPhotoUI();
    });
  });
  $('btn-capture-png').addEventListener('click', () => callbacks.onCapturePNG());

  // Contemplação, Ajustes, Pausa
  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) {
      closePopovers();
      setDrawerOpen(false);
      setCompareOpen(false);
    }
    callbacks.onMenuStateChange();
  }
  $('btn-contemplate').addEventListener('click', () => setContemplative(true));
  $('btn-restore-ui').addEventListener('click', () => setContemplative(false));

  function setDrawerOpen(open) {
    state.settingsOpen = Boolean(open);
    drawer.hidden = !state.settingsOpen;
    $('btn-settings').setAttribute('aria-expanded', String(state.settingsOpen));
    if (state.settingsOpen) {
      closePopovers();
      compareModal.hidden = true;
      state.compareOpen = false;
    }
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

  $('ctrl-sound').addEventListener('change', (e) => callbacks.onToggleSound(e.target.checked));
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
  $('ctrl-dof-acc').addEventListener('change', (e) => {
    state.dofEnabled = e.target.checked;
    syncPhotoUI();
    callbacks.onPhotoConfigChange();
  });
  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  [
    $('top-header'),
    $('bottom-dock'),
    photoBar,
    drawer,
    compareModal,
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

  function syncAll(metrics) {
    $('ctrl-sound').checked = state.soundEnabled && !state.muted;
    $('ctrl-volume').value = Math.round(state.volume * 100);
    $('ctrl-volume-val').textContent = `${Math.round(state.volume * 100)}%`;
    $('ctrl-reduced').checked = state.reducedMotion;
    $('ctrl-dof-acc').checked = state.dofEnabled;
    $('ctrl-quality').value = state.qualityMode;
    syncToolbar(metrics);
    syncPhotoUI();
    setPaused(state.paused);
    setContemplative(state.contemplative);
  }

  return {
    showFeedback,
    triggerShutterFlash,
    closePopovers,
    syncToolbar,
    syncPhotoUI,
    renderCompareModal,
    setCompareOpen,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
