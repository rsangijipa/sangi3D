/**
 * js/ui-controller.js
 * Controlador de HUD enxuta (<20% desktop, painel secundário recolhido por padrão),
 * ferramentas contextuais ("Aurora, hora, intensidade, fotografia"),
 * troca Varanda / Interior / Celeste e Álbum de Céus sem pontuação.
 */
import { AURORA_PATTERNS, VIEW_MODES } from './state.js';

function formatHourLabel(hourNorm) {
  // Mapeia [0..1] -> 20:00 .. 04:00 (noite ártica)
  const totalMin = Math.round((20 * 60 + hourNorm * 8 * 60) % (24 * 60));
  const hh = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const mm = String(totalMin % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const auroraPop = $('aurora-popover');
  const hourPop = $('hour-popover');
  const intensityPop = $('intensity-popover');
  const viewButtons = Array.from(document.querySelectorAll('[data-view-btn]'));
  const auroraButtons = Array.from(document.querySelectorAll('[data-aurora-btn]'));
  const drawer = $('settings-drawer');
  const albumModal = $('album-modal');
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
    [auroraPop, hourPop, intensityPop].forEach((p) => {
      if (p) p.hidden = true;
    });
    ['btn-aurora', 'btn-hour', 'btn-intensity'].forEach((id) => {
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

  function syncToolbar() {
    const aSpec = AURORA_PATTERNS[state.auroraPattern] || AURORA_PATTERNS.crown;
    $('lbl-aurora-val').textContent = aSpec.short;
    auroraButtons.forEach((b) => {
      const act = b.dataset.auroraBtn === state.auroraPattern;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });

    const hourStr = formatHourLabel(state.hourNorm);
    $('lbl-hour-val').textContent = hourStr;
    $('pop-hour-readout').textContent = hourStr;
    $('pop-hour-range').value = Math.round(state.hourNorm * 100);

    const pct = Math.round(state.intensity * 100);
    $('lbl-intensity-val').textContent = `${pct}%`;
    $('pop-intensity-readout').textContent = `${pct}%`;
    $('pop-intensity-range').value = pct;

    viewButtons.forEach((b) => {
      const act = b.dataset.viewBtn === state.viewMode;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });

    const vLabel = (VIEW_MODES[state.viewMode] || VIEW_MODES.veranda).label;
    $('status-line').textContent = `${vLabel} · ${aSpec.short} · ${hourStr}`;

    $('lbl-album-count').textContent = String(state.photos.length);
  }

  function renderAlbum() {
    const grid = $('album-grid');
    if (!grid) return;
    if (!state.photos.length) {
      grid.innerHTML = '<p class="album-empty">Nenhuma fotografia registrada ainda. Use <strong>Fotografia</strong> no painel inferior para guardar um céu.</p>';
      return;
    }
    grid.innerHTML = '';
    state.photos.slice().reverse().forEach((ph) => {
      const card = document.createElement('figure');
      card.className = 'album-card';
      const img = document.createElement('img');
      img.src = ph.url;
      img.alt = ph.label;
      const cap = document.createElement('figcaption');
      cap.textContent = ph.label;
      card.append(img, cap);
      grid.appendChild(card);
    });
  }

  $('btn-aurora').addEventListener('click', () => togglePopover('btn-aurora', auroraPop));
  $('btn-hour').addEventListener('click', () => togglePopover('btn-hour', hourPop));
  $('btn-intensity').addEventListener('click', () => togglePopover('btn-intensity', intensityPop));

  auroraButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.auroraPattern = btn.dataset.auroraBtn;
      closePopovers();
      syncToolbar();
      callbacks.onAtmosphereChange();
    });
  });

  $('pop-hour-range').addEventListener('input', (e) => {
    state.hourNorm = Number(e.target.value) / 100;
    syncToolbar();
    callbacks.onAtmosphereChange();
  });

  $('pop-intensity-range').addEventListener('input', (e) => {
    state.intensity = Number(e.target.value) / 100;
    syncToolbar();
    callbacks.onAtmosphereChange();
  });

  $('btn-photo').addEventListener('click', () => {
    closePopovers();
    callbacks.onTakePhoto();
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onViewModeChange(btn.dataset.viewBtn);
      syncToolbar();
    });
  });

  function setAlbumOpen(open) {
    state.albumOpen = Boolean(open);
    albumModal.hidden = !state.albumOpen;
    if (state.albumOpen) {
      closePopovers();
      setDrawerOpen(false);
      renderAlbum();
    }
    callbacks.onMenuStateChange();
  }

  $('btn-album').addEventListener('click', () => setAlbumOpen(!state.albumOpen));
  $('btn-close-album').addEventListener('click', () => setAlbumOpen(false));

  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) {
      closePopovers();
      setDrawerOpen(false);
      setAlbumOpen(false);
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
      albumModal.hidden = true;
      state.albumOpen = false;
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
  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  // Bloqueia propagação de ponteiro/roda dos controles para o canvas 3D
  [
    $('top-header'),
    $('bottom-dock'),
    drawer,
    albumModal,
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
    triggerShutterFlash,
    closePopovers,
    syncToolbar,
    renderAlbum,
    setAlbumOpen,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
