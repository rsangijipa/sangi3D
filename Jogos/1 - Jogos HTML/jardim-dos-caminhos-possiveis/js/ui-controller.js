/**
 * js/ui-controller.js
 * HUD para # 073 — Jardim dos Caminhos Possíveis.
 * Ferramentas: Criar caminho, Escolha, Voltar, Anotar (+ Elevada / Caminhada).
 * Nenhuma alternativa recebe avaliação automática (T02) e notas são apagáveis (T03).
 */
export function createUIController({ state, callbacks }) {
  const $ = (id) => document.getElementById(id);

  const createPop = $('create-popover');
  const choicePop = $('choice-popover');
  const notesModal = $('notes-modal');
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
    [createPop, choicePop].forEach((p) => { if (p) p.hidden = true; });
    ['btn-create-path', 'btn-choice'].forEach((id) => {
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
    const cur = state.nodes.find((n) => n.id === state.currentNodeId) || state.nodes[0];
    const children = state.nodes.filter((n) => n.parentId === cur.id);

    $('lbl-cur-node').textContent = cur.title;
    $('lbl-choices-count').textContent = String(children.length);
    $('btn-back').disabled = cur.parentId === null;

    const list = $('choice-list');
    list.innerHTML = '';
    if (!children.length) {
      list.innerHTML = '<div class="empty-note">Nenhum caminho adiante ainda. Use <strong>Criar caminho</strong> ou <strong>Voltar</strong> para explorar outra rota.</div>';
    } else {
      children.forEach((ch) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pop-btn';
        b.dataset.choiceNodeId = String(ch.id);
        const visited = state.visitedIds.includes(ch.id);
        b.innerHTML = `<span>${ch.title}</span><small>${visited ? 'Visitado' : 'Explorar'}</small>`;
        b.addEventListener('click', () => {
          closePopovers();
          callbacks.onChooseNode(ch.id);
        });
        list.appendChild(b);
      });
    }

    document.querySelectorAll('[data-cam-btn]').forEach((b) => {
      const act = b.dataset.camBtn === state.cameraMode;
      b.classList.toggle('active', act);
      b.setAttribute('aria-pressed', String(act));
    });

    const noteCount = state.nodes.filter((n) => (n.note || '').trim().length > 0).length;
    $('lbl-notes-count').textContent = String(noteCount);

    $('status-line').textContent = `${cur.title} · ${children.length} bifurcação(ões)`;
  }

  function renderNotesModal() {
    const cur = state.nodes.find((n) => n.id === state.currentNodeId) || state.nodes[0];
    $('input-sign-title').value = cur.title;
    $('input-node-note').value = cur.note || '';

    const container = $('saved-notes-list');
    const notedNodes = state.nodes.filter((n) => (n.note || '').trim().length > 0);
    if (!notedNodes.length) {
      container.innerHTML = '<p class="empty-note">Nenhuma anotação guardada neste jardim.</p>';
      return;
    }
    container.innerHTML = '';
    notedNodes.forEach((n) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      const head = document.createElement('div');
      head.className = 'note-head';
      const st = document.createElement('strong');
      st.textContent = n.title;
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'chip-del';
      del.textContent = 'Apagar';
      del.addEventListener('click', () => callbacks.onDeleteNodeNote(n.id));
      head.append(st, del);

      const p = document.createElement('p');
      p.textContent = n.note;
      card.append(head, p);
      container.appendChild(card);
    });
  }

  $('btn-create-path').addEventListener('click', () => togglePopover('btn-create-path', createPop));
  $('btn-choice').addEventListener('click', () => togglePopover('btn-choice', choicePop));

  $('btn-confirm-create').addEventListener('click', () => {
    const title = $('input-new-branch').value.trim() || 'Nova Trilha';
    $('input-new-branch').value = '';
    closePopovers();
    callbacks.onCreateBranch(title);
  });

  $('btn-back').addEventListener('click', () => {
    closePopovers();
    callbacks.onGoBack();
  });

  function setNotesOpen(open) {
    state.notesOpen = Boolean(open);
    notesModal.hidden = !state.notesOpen;
    if (state.notesOpen) {
      closePopovers();
      setDrawerOpen(false);
      renderNotesModal();
    }
    callbacks.onMenuStateChange();
  }

  $('btn-note').addEventListener('click', () => setNotesOpen(!state.notesOpen));
  $('btn-close-notes').addEventListener('click', () => setNotesOpen(false));
  $('btn-save-note').addEventListener('click', () => {
    callbacks.onUpdateCurrentNodeInfo(
      $('input-sign-title').value.trim(),
      $('input-node-note').value.trim()
    );
    renderNotesModal();
    syncToolbar();
  });
  $('btn-delete-cur-note').addEventListener('click', () => {
    callbacks.onDeleteNodeNote(state.currentNodeId);
    $('input-node-note').value = '';
    renderNotesModal();
    syncToolbar();
  });

  document.querySelectorAll('[data-cam-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closePopovers();
      callbacks.onCameraModeChange(btn.dataset.camBtn);
    });
  });

  function setContemplative(on) {
    state.contemplative = Boolean(on);
    document.body.classList.toggle('contemplative', state.contemplative);
    if (state.contemplative) { closePopovers(); setDrawerOpen(false); setNotesOpen(false); }
    callbacks.onMenuStateChange();
  }
  $('btn-contemplate').addEventListener('click', () => setContemplative(true));
  $('btn-restore-ui').addEventListener('click', () => setContemplative(false));

  function setDrawerOpen(open) {
    state.settingsOpen = Boolean(open);
    drawer.hidden = !state.settingsOpen;
    $('btn-settings').setAttribute('aria-expanded', String(state.settingsOpen));
    if (state.settingsOpen) { closePopovers(); notesModal.hidden = true; state.notesOpen = false; }
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
    $('mediated-card').hidden = state.sessionMode !== 'mediated';
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
    notesModal,
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
    $('mediated-card').hidden = state.sessionMode !== 'mediated';
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
    renderNotesModal,
    setNotesOpen,
    setDrawerOpen,
    setPaused,
    setContemplative,
    updateDiagnostics,
    syncAll,
  };
}
