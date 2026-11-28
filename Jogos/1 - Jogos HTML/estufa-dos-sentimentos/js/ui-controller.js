/**
 * js/ui-controller.js
 * HUD serena e não-diagnóstica para # 071 — Estufa dos Sentimentos.
 * Ferramentas: Planta, Cor, Clima, Registrar (+ Cuidar/Regar e Etiqueta).
 * Registros locais opcionais e explicitamente apagáveis/exportáveis (T02/T03).
 */
import { PALETTE_SWATCHES, PLANT_SPECIES, WEATHER_MODES } from './state.js';

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const plantPop = $('plant-popover');
  const colorPop = $('color-popover');
  const climatePop = $('climate-popover');
  const journalModal = $('journal-modal');
  const drawer = $('settings-drawer');
  const pauseModal = $('pause-modal');
  const feedbackEl = $('feedback-pill');
  let feedbackTimer = null;

  function showFeedback(text) {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.classList.add('visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('visible'), 2200);
  }

  function closePopovers() {
    [plantPop, colorPop, climatePop].forEach((p) => { if (p) p.hidden = true; });
    ['btn-plant', 'btn-color', 'btn-climate'].forEach((id) => {
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
    const pSpec = PLANT_SPECIES[state.species] || PLANT_SPECIES.samambaia;
    const wSpec = WEATHER_MODES[state.weather] || WEATHER_MODES.sun;

    $('lbl-plant-val').textContent = pSpec.label;
    $('color-chip').style.background = state.colorHex;
    $('lbl-climate-val').textContent = wSpec.label;
    $('lbl-entries-count').textContent = String(state.entries.length);

    document.querySelectorAll('[data-species-btn]').forEach((b) => {
      const act = b.dataset.speciesBtn === state.species;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });
    document.querySelectorAll('[data-weather-btn]').forEach((b) => {
      const act = b.dataset.weatherBtn === state.weather;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });
    document.querySelectorAll('[data-swatch-hex]').forEach((b) => {
      const act = b.dataset.swatchHex.toLowerCase() === state.colorHex.toLowerCase();
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });
    $('color-picker').value = state.colorHex;
    $('input-tag').value = state.tagText;

    document.querySelectorAll('[data-cam-btn]').forEach((b) => {
      const act = b.dataset.camBtn === state.cameraMode;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });

    const modeHint = state.sessionMode === 'guided' ? 'Sessão mediada livre' : 'Exploração livre';
    $('status-line').textContent = `${pSpec.label} · ${wSpec.label} · ${modeHint}`;
  }

  function renderJournal() {
    const list = $('journal-list');
    if (!list) return;
    if (!state.entries.length) {
      list.innerHTML =
        '<p class="empty-note">Nenhum registro salvo. Tudo aqui é opcional, privado no navegador e sem avaliação.</p>';
      return;
    }
    list.innerHTML = '';
    state.entries.slice().reverse().forEach((entry) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      const head = document.createElement('div');
      head.className = 'entry-head';
      const dot = document.createElement('span');
      dot.className = 'entry-dot';
      dot.style.background = entry.colorHex;
      const meta = document.createElement('strong');
      meta.textContent = `${(PLANT_SPECIES[entry.species] || PLANT_SPECIES.samambaia).label}${entry.tag ? ` · "${entry.tag}"` : ''}`;
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'chip-del';
      del.textContent = 'Apagar';
      del.setAttribute('aria-label', 'Apagar reflexão');
      del.addEventListener('click', () => callbacks.onDeleteEntry(entry.id));
      head.append(dot, meta, del);

      const body = document.createElement('p');
      body.textContent = entry.text;
      card.append(head, body);
      list.appendChild(card);
    });
  }

  // Swatches neutros de cor (T01: nenhuma cor é rotulada com emoção pré-definida)
  const swatchGrid = $('swatch-grid');
  PALETTE_SWATCHES.forEach((hex) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch-btn';
    b.dataset.swatchHex = hex;
    b.style.background = hex;
    b.setAttribute('aria-label', `Escolher cor ${hex}`);
    b.addEventListener('click', () => {
      state.colorHex = hex;
      syncToolbar();
      callbacks.onColorChange(hex);
    });
    swatchGrid.appendChild(b);
  });

  $('btn-plant').addEventListener('click', () => togglePopover('btn-plant', plantPop));
  $('btn-color').addEventListener('click', () => togglePopover('btn-color', colorPop));
  $('btn-climate').addEventListener('click', () => togglePopover('btn-climate', climatePop));

  document.querySelectorAll('[data-species-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.species = btn.dataset.speciesBtn;
      closePopovers();
      syncToolbar();
      callbacks.onSpeciesChange(state.species);
    });
  });

  $('color-picker').addEventListener('input', (e) => {
    state.colorHex = e.target.value;
    syncToolbar();
    callbacks.onColorChange(state.colorHex);
  });

  $('input-tag').addEventListener('input', (e) => {
    state.tagText = e.target.value;
    callbacks.onTagChange(state.tagText);
  });

  document.querySelectorAll('[data-weather-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.weather = btn.dataset.weatherBtn;
      closePopovers();
      syncToolbar();
      callbacks.onWeatherChange(state.weather);
    });
  });

  $('btn-water').addEventListener('click', () => {
    closePopovers();
    callbacks.onWaterPlant();
  });

  document.querySelectorAll('[data-cam-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onCameraModeChange(btn.dataset.camBtn);
      syncToolbar();
    });
  });

  function setJournalOpen(open) {
    state.journalOpen = Boolean(open);
    journalModal.hidden = !state.journalOpen;
    if (state.journalOpen) {
      closePopovers();
      setDrawerOpen(false);
      renderJournal();
    }
    callbacks.onMenuStateChange();
  }

  $('btn-register').addEventListener('click', () => setJournalOpen(!state.journalOpen));
  $('btn-close-journal').addEventListener('click', () => setJournalOpen(false));
  $('btn-save-entry').addEventListener('click', () => {
    const txt = $('input-reflection').value.trim();
    if (!txt) {
      showFeedback('Escreva algo apenas se desejar registrar');
      return;
    }
    callbacks.onSaveEntry(txt);
    $('input-reflection').value = '';
    renderJournal();
    syncToolbar();
  });
  $('btn-export-entries').addEventListener('click', () => callbacks.onExportEntries());

  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) {
      closePopovers();
      setDrawerOpen(false);
      setJournalOpen(false);
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
      journalModal.hidden = true;
      state.journalOpen = false;
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

  $('ctrl-session').addEventListener('change', (e) => {
    state.sessionMode = e.target.value;
    $('guided-card').hidden = state.sessionMode !== 'guided';
    syncToolbar();
  });
  $('ctrl-sound').addEventListener('change', (e) => callbacks.onToggleSound(e.target.checked));
  $('ctrl-volume').addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    state.volume = v;
    $('ctrl-volume-val').textContent = `${Math.round(v * 100)}%`;
    callbacks.onVolumeChange(v);
  });
  $('ctrl-reduced').addEventListener('change', (e) => { state.reducedMotion = e.target.checked; });
  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  [
    $('top-header'),
    $('bottom-dock'),
    drawer,
    journalModal,
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
    $('ctrl-session').value = state.sessionMode;
    $('guided-card').hidden = state.sessionMode !== 'guided';
    $('ctrl-sound').checked = state.soundEnabled && !state.muted;
    $('ctrl-volume').value = Math.round(state.volume * 100);
    $('ctrl-volume-val').textContent = `${Math.round(state.volume * 100)}%`;
    $('ctrl-reduced').checked = state.reducedMotion;
    $('ctrl-quality').value = state.qualityMode;
    syncToolbar();
    setPaused(state.paused);
    setContemplative(state.contemplative);
  }

  return {
    showFeedback,
    closePopovers,
    syncToolbar,
    renderJournal,
    setJournalOpen,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
