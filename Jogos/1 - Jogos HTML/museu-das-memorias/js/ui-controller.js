/**
 * js/ui-controller.js
 * HUD museológica para # 072 — Museu das Memórias.
 * Ferramentas: Adicionar objeto, Legenda, Sala, Privacidade (+ Caminhada / Isométrica).
 */
import { GALLERY_SLOTS, OBJECT_CATALOG } from './state.js';

export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const addPop = $('add-popover');
  const captionPop = $('caption-popover');
  const roomPop = $('room-popover');
  const privacyModal = $('privacy-modal');
  const drawer = $('settings-drawer');
  const pauseModal = $('pause-modal');
  const feedbackEl = $('feedback-pill');
  let feedbackTimer = null;

  function showFeedback(text) {
    if (!feedbackEl) return;
    feedbackEl.textContent = text;
    feedbackEl.classList.add('visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedbackEl.classList.remove('visible'), 2300);
  }

  function closePopovers() {
    [addPop, captionPop, roomPop].forEach((p) => { if (p) p.hidden = true; });
    ['btn-add', 'btn-caption', 'btn-room'].forEach((id) => {
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
    const slot = GALLERY_SLOTS[state.selectedSlotId] || GALLERY_SLOTS[0];
    const item = state.items[slot.id];

    $('lbl-slot-chip').textContent = slot.label;
    $('lbl-room-val').textContent = state.roomMode === 'fictional' ? 'Fictício' : 'Pessoal';
    $('input-caption').value = item ? item.caption : '';

    $('btn-import-photo').hidden = slot.kind !== 'frame';
    $('btn-delete-item').disabled = !item;
    $('btn-move-item').disabled = !item;

    document.querySelectorAll('[data-room-btn]').forEach((b) => {
      const act = b.dataset.roomBtn === state.roomMode;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });
    document.querySelectorAll('[data-cam-btn]').forEach((b) => {
      const act = b.dataset.camBtn === state.cameraMode;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });
    document.querySelectorAll('[data-slot-pick]').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.slotPick) === state.selectedSlotId);
    });

    const moveBanner = $('move-banner');
    moveBanner.hidden = state.moveSourceSlotId === null;
    if (state.moveSourceSlotId !== null) {
      const src = GALLERY_SLOTS[state.moveSourceSlotId];
      moveBanner.textContent = `Selecione outro ${src.kind === 'pedestal' ? 'pedestal' : 'moldura'} na sala para mover "${state.items[src.id]?.caption || 'item'}"`;
    }

    const objCount = Object.keys(state.items).length;
    $('status-line').textContent = `${slot.label} · ${objCount} exposto(s) · ${state.roomMode === 'fictional' ? 'Acervo Fictício' : 'Exposição Pessoal'}`;
  }

  // Botões de objeto simbólico para o pedestal selecionado
  const objList = $('object-catalog-list');
  OBJECT_CATALOG.forEach((obj) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pop-btn';
    b.dataset.objectKind = obj.id;
    b.textContent = obj.label;
    b.addEventListener('click', () => {
      closePopovers();
      callbacks.onPlaceObject(obj.id);
    });
    objList.appendChild(b);
  });

  // Seletor acessível de suportes da sala
  const slotBar = $('slot-selector-grid');
  GALLERY_SLOTS.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-btn';
    b.dataset.slotPick = String(s.id);
    b.textContent = s.kind === 'pedestal' ? `P${s.id + 1}` : `M${s.id - 3}`;
    b.title = s.label;
    b.addEventListener('click', () => callbacks.onSelectSlot(s.id));
    slotBar.appendChild(b);
  });

  $('btn-add').addEventListener('click', () => togglePopover('btn-add', addPop));
  $('btn-caption').addEventListener('click', () => togglePopover('btn-caption', captionPop));
  $('btn-room').addEventListener('click', () => togglePopover('btn-room', roomPop));

  $('btn-import-photo').addEventListener('click', () => {
    $('input-local-photo').click();
  });
  $('input-local-photo').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) callbacks.onImportLocalPhoto(file);
    e.target.value = '';
    closePopovers();
  });

  $('btn-save-caption').addEventListener('click', () => {
    callbacks.onUpdateCaption($('input-caption').value.trim());
    closePopovers();
  });

  $('btn-move-item').addEventListener('click', () => {
    closePopovers();
    callbacks.onStartMove();
  });

  $('btn-delete-item').addEventListener('click', () => {
    closePopovers();
    callbacks.onDeleteSelectedItem();
  });

  document.querySelectorAll('[data-room-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onRoomModeChange(btn.dataset.roomBtn);
    });
  });

  document.querySelectorAll('[data-cam-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onCameraModeChange(btn.dataset.camBtn);
    });
  });

  function setPrivacyOpen(open) {
    state.privacyOpen = Boolean(open);
    privacyModal.hidden = !state.privacyOpen;
    if (state.privacyOpen) { closePopovers(); setDrawerOpen(false); }
    callbacks.onMenuStateChange();
  }
  $('btn-privacy').addEventListener('click', () => setPrivacyOpen(true));
  $('btn-close-privacy').addEventListener('click', () => setPrivacyOpen(false));
  $('btn-wipe-all').addEventListener('click', () => {
    callbacks.onWipeAll();
    setPrivacyOpen(false);
  });

  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) { closePopovers(); setDrawerOpen(false); setPrivacyOpen(false); }
    callbacks.onMenuStateChange();
  }
  $('btn-contemplate').addEventListener('click', () => setContemplative(true));
  $('btn-restore-ui').addEventListener('click', () => setContemplative(false));

  function setDrawerOpen(open) {
    state.settingsOpen = Boolean(open);
    drawer.hidden = !state.settingsOpen;
    $('btn-settings').setAttribute('aria-expanded', String(state.settingsOpen));
    if (state.settingsOpen) { closePopovers(); privacyModal.hidden = true; state.privacyOpen = false; }
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
  $('ctrl-reduced').addEventListener('change', (e) => { state.reducedMotion = e.target.checked; });
  $('ctrl-quality').addEventListener('change', (e) => {
    state.qualityMode = e.target.value;
    callbacks.onQualityChange(state.qualityMode);
  });

  [
    $('top-header'),
    $('bottom-dock'),
    drawer,
    privacyModal,
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

  return {
    showFeedback,
    closePopovers,
    syncToolbar,
    setPrivacyOpen,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
