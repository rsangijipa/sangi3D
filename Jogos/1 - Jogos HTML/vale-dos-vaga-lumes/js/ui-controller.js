/**
 * js/ui-controller.js
 * Interface fiel ao mockup: cápsula superior esquerda, botões superiores direitos
 * (Ajustes, Pausar, Sair), dock inferior com Brilho, Hora, Som e Fotografia,
 * além de painel recolhível com trilha, densidade, Kuramoto, diário e acessibilidade.
 */
import {
  WAYPOINTS,
  formatNightHour,
  getNightPhaseInfo,
} from './state.js';

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const dockButtons = Array.from(document.querySelectorAll('[data-tool]'));
  const subPanel = $('dock-subpanel');
  const drawer = $('settings-drawer');
  const pauseOverlay = $('pause-overlay');
  const journalDrawer = $('journal-drawer');
  const mobileWalkPad = $('mobile-walk-pad');
  const toastEl = $('toast-banner');

  let toastTimer = null;
  function showToast(msg, tone = 'info') {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.dataset.tone = tone;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 2600);
  }

  function renderDockSubpanel() {
    const tool = state.activeTool;
    dockButtons.forEach((btn) => {
      const active = btn.dataset.tool === tool;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (tool === 'brilho') {
      subPanel.innerHTML = `
        <div class="sub-row">
          <span class="sub-ico" aria-hidden="true">☀</span>
          <input id="dock-brightness" type="range" min="0" max="100" step="1"
            value="${Math.round(state.brightness * 100)}"
            aria-label="Brilho dos vaga-lumes e lampiões (%)" />
          <span class="sub-val" id="dock-brightness-val">${Math.round(state.brightness * 100)}%</span>
        </div>`;
      const slider = $('dock-brightness');
      slider.addEventListener('input', (e) => {
        const v = Number(e.target.value) / 100;
        state.brightness = v;
        $('dock-brightness-val').textContent = `${Math.round(v * 100)}%`;
        const sec = $('ctrl-brightness');
        if (sec) sec.value = Math.round(v * 100);
        callbacks.onBrightnessChange(v);
      });
    } else if (tool === 'hora') {
      const phase = getNightPhaseInfo(state.hour);
      subPanel.innerHTML = `
        <div class="sub-row">
          <span class="sub-ico" aria-hidden="true">◔</span>
          <input id="dock-hour" type="range" min="18.5" max="28.5" step="0.1"
            value="${state.hour.toFixed(1)}"
            aria-label="Horário noturno" />
          <span class="sub-val" id="dock-hour-val">${formatNightHour(state.hour)} · ${phase.label}</span>
        </div>`;
      const slider = $('dock-hour');
      slider.addEventListener('input', (e) => {
        const h = Number(e.target.value);
        state.hour = h;
        const p = getNightPhaseInfo(h);
        $('dock-hour-val').textContent = `${formatNightHour(h)} · ${p.label}`;
        callbacks.onHourChange(h);
      });
    } else if (tool === 'som') {
      const pct = Math.round(state.volume * 100);
      subPanel.innerHTML = `
        <div class="sub-row">
          <button id="dock-sound-toggle" class="mini-pill ${state.soundEnabled && !state.muted ? 'on' : ''}" type="button">
            ${state.soundEnabled && !state.muted ? 'Áudio: Ativo' : 'Ativar Som'}
          </button>
          <input id="dock-volume" type="range" min="0" max="100" step="1"
            value="${pct}" aria-label="Volume ambiente (%)" />
          <span class="sub-val" id="dock-volume-val">${pct}%</span>
        </div>`;
      $('dock-sound-toggle').addEventListener('click', () => callbacks.onToggleSound());
      $('dock-volume').addEventListener('input', (e) => {
        const v = Number(e.target.value) / 100;
        state.volume = v;
        $('dock-volume-val').textContent = `${Math.round(v * 100)}%`;
        callbacks.onVolumeChange(v);
      });
    } else if (tool === 'fotografia') {
      subPanel.innerHTML = `
        <div class="sub-row">
          <button id="dock-snap-btn" class="mini-pill on" type="button">📸 Capturar Foto PNG</button>
          <button id="dock-record-btn" class="mini-pill" type="button">✦ Registrar Padrão</button>
          <span class="sub-val" id="dock-photo-count">${state.photosTaken} foto(s)</span>
        </div>`;
      $('dock-snap-btn').addEventListener('click', () => callbacks.onCapturePhoto());
      $('dock-record-btn').addEventListener('click', () => callbacks.onRecordPattern());
    }
  }

  dockButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTool = btn.dataset.tool;
      state.activeTool = nextTool;
      renderDockSubpanel();
      if (nextTool === 'som' && !state.soundEnabled) {
        callbacks.onToggleSound(true);
      } else if (nextTool === 'fotografia') {
        callbacks.onCapturePhoto();
      }
    });
  });

  function syncDrawerInputs() {
    $('ctrl-density').value = state.density;
    $('ctrl-density-val').textContent = `${state.density} vaga-lumes`;
    $('ctrl-sync').value = Math.round((state.syncCoupling / 3.5) * 100);
    $('ctrl-sync-val').textContent = `${Math.round((state.syncCoupling / 3.5) * 100)}%`;
    $('ctrl-brightness').value = Math.round(state.brightness * 100);
    $('ctrl-brightness-val').textContent = `${Math.round(state.brightness * 100)}%`;
    $('ctrl-reduced').checked = state.reducedMotion;
    $('ctrl-quality').value = state.qualityMode;

    document.querySelectorAll('[data-cam-mode]').forEach((b) => {
      b.classList.toggle('active', b.dataset.camMode === state.cameraMode);
    });
    document.querySelectorAll('[data-waypoint]').forEach((b) => {
      b.classList.toggle('active', b.dataset.waypoint === state.waypointId);
    });

    const isTouchViewport = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 920;
    if (mobileWalkPad) {
      mobileWalkPad.hidden = !(state.cameraMode === 'walk' && isTouchViewport && !state.paused);
    }
  }

  function setDrawerOpen(open) {
    state.settingsOpen = Boolean(open);
    drawer.hidden = !state.settingsOpen;
    $('btn-settings').setAttribute('aria-expanded', String(state.settingsOpen));
    if (state.settingsOpen) setJournalOpen(false);
    callbacks.onMenuStateChange();
  }

  function setJournalOpen(open) {
    state.journalOpen = Boolean(open);
    journalDrawer.hidden = !state.journalOpen;
    $('btn-brand-journal').setAttribute('aria-expanded', String(state.journalOpen));
    if (state.journalOpen) {
      setDrawerOpen(false);
      renderJournalEntries();
    }
    callbacks.onMenuStateChange();
  }

  function setPauseOverlay(paused) {
    state.paused = Boolean(paused);
    pauseOverlay.hidden = !state.paused;
    $('btn-pause').textContent = state.paused ? '▶' : '⏸';
    $('btn-pause').setAttribute('aria-label', state.paused ? 'Retomar simulação' : 'Pausar simulação');
    syncDrawerInputs();
    callbacks.onMenuStateChange();
  }

  function renderJournalEntries() {
    const list = $('journal-list');
    if (!list) return;
    if (!state.observedRecords.length) {
      list.innerHTML = '<p class="journal-empty">Nenhum registro salvo ainda. Ajuste a densidade e a sincronia e toque em <strong>Registrar Padrão</strong> ou capture uma fotografia.</p>';
      return;
    }
    list.innerHTML = state.observedRecords
      .slice()
      .reverse()
      .map((rec) => `
        <div class="journal-item">
          <div class="journal-meta">
            <strong>${rec.waypoint} · ${rec.hourStr}</strong>
            <span>${rec.count} agentes · Sincronia R=${rec.orderR}</span>
          </div>
          ${rec.thumb ? `<img class="journal-thumb" src="${rec.thumb}" alt="Captura em ${rec.waypoint}" />` : ''}
        </div>
      `)
      .join('');
  }

  // Ligações dos controles do cabeçalho e painel recolhível
  $('btn-settings').addEventListener('click', () => setDrawerOpen(!state.settingsOpen));
  $('btn-close-drawer').addEventListener('click', () => setDrawerOpen(false));
  $('btn-brand-journal').addEventListener('click', () => setJournalOpen(!state.journalOpen));
  $('btn-close-journal').addEventListener('click', () => setJournalOpen(false));
  $('btn-pause').addEventListener('click', () => callbacks.onTogglePause());
  $('btn-resume-modal').addEventListener('click', () => callbacks.onTogglePause(false));
  $('btn-reset-modal').addEventListener('click', () => callbacks.onReset());
  $('btn-reset-drawer').addEventListener('click', () => callbacks.onReset());
  $('btn-exit').addEventListener('click', () => callbacks.onExit());
  $('btn-record-journal').addEventListener('click', () => callbacks.onRecordPattern());

  $('ctrl-density').addEventListener('input', (e) => {
    const n = Number(e.target.value);
    state.density = n;
    $('ctrl-density-val').textContent = `${n} vaga-lumes`;
    callbacks.onDensityChange(n);
  });

  $('ctrl-sync').addEventListener('input', (e) => {
    const pct = Number(e.target.value);
    state.syncCoupling = (pct / 100) * 3.5;
    $('ctrl-sync-val').textContent = `${pct}%`;
  });

  $('ctrl-brightness').addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    state.brightness = v;
    $('ctrl-brightness-val').textContent = `${Math.round(v * 100)}%`;
    renderDockSubpanel();
    callbacks.onBrightnessChange(v);
  });

  $('ctrl-reduced').addEventListener('change', (e) => {
    state.reducedMotion = e.target.checked;
    callbacks.onReducedMotionChange(state.reducedMotion);
  });

  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  document.querySelectorAll('[data-cam-mode]').forEach((b) => {
    b.addEventListener('click', () => {
      state.cameraMode = b.dataset.camMode;
      syncDrawerInputs();
      callbacks.onCameraModeChange(state.cameraMode);
    });
  });

  // Popula botões de pontos de retorno da trilha
  const wpContainer = $('waypoint-buttons');
  wpContainer.innerHTML = WAYPOINTS.map(
    (wp) => `<button type="button" class="wp-btn" data-waypoint="${wp.id}">${wp.name}</button>`
  ).join('');
  wpContainer.querySelectorAll('[data-waypoint]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.waypoint;
      state.waypointId = id;
      syncDrawerInputs();
      callbacks.onWaypointSelect(id);
    });
  });

  // Impede que eventos de ponteiro na HUD vazem para a câmera 3D
  [drawer, journalDrawer, $('bottom-dock'), $('top-bar-right'), $('top-bar-left'), pauseOverlay, mobileWalkPad]
    .filter(Boolean)
    .forEach((el) => {
      ['pointerdown', 'wheel', 'touchstart'].forEach((evt) => {
        el.addEventListener(evt, (e) => e.stopPropagation(), { passive: evt !== 'wheel' });
      });
    });

  function updateTelemetry(fps, calls, stateSnapshot) {
    const badge = $('telemetry-readout');
    if (badge) {
      badge.textContent = `${Math.round(fps)} FPS · ${calls} draws · ${stateSnapshot.density} agentes · R=${stateSnapshot.measuredOrderR.toFixed(2)}`;
    }
    const rFill = $('kuramoto-bar-fill');
    if (rFill) {
      rFill.style.width = `${Math.round(stateSnapshot.measuredOrderR * 100)}%`;
    }
  }

  function flashShutter() {
    const shutter = $('photo-flash');
    if (!shutter) return;
    shutter.classList.remove('active');
    void shutter.offsetWidth;
    shutter.classList.add('active');
  }

  function syncAll() {
    renderDockSubpanel();
    syncDrawerInputs();
    setPauseOverlay(state.paused);
  }

  syncAll();

  return {
    showToast,
    renderDockSubpanel,
    syncDrawerInputs,
    setDrawerOpen,
    setJournalOpen,
    setPauseOverlay,
    renderJournalEntries,
    updateTelemetry,
    flashShutter,
    syncAll,
  };
}
