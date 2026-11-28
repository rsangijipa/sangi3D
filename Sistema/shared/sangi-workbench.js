import './sangi-bridge.js';

export function workbench({ title, subtitle = '', hint = '', toolsLabel = 'Ferramentas' }) {
  const root = document.createElement('main');
  root.className = 'sangi-workbench';
  root.innerHTML = `
    <header class="wb-header">
      <a class="wb-back" href="/" aria-label="Voltar ao catálogo">← <span>Catálogo</span></a>
      <div class="wb-title"><p></p><h1></h1></div>
      <div class="wb-header-actions">
        <button type="button" class="wb-pause" aria-pressed="false">Pausar</button>
        <button type="button" class="wb-help-open" aria-haspopup="dialog">Menu</button>
      </div>
    </header>
    <div class="wb-workspace">
      <section class="wb-view" aria-label="Cena interativa">
        <div class="wb-stage"></div>
        <div class="wb-overlay" hidden><p></p><button type="button"></button></div>
        <div class="wb-stage-footer"><p class="wb-hint"></p><div class="wb-actions"></div></div>
      </section>
      <aside class="wb-panel">
        <h2></h2>
        <p class="wb-status" role="status" aria-atomic="true"></p>
        <div class="wb-tools"></div>
      </aside>
    </div>
    <dialog class="wb-help" aria-label="Menu da experiência">
      <div class="wb-dialog-title"><h2>Menu</h2><button type="button" class="wb-help-close" aria-label="Fechar menu">Fechar</button></div>
      <p class="wb-help-text"></p>
      <button type="button" class="wb-audio" aria-pressed="false">Ativar som</button>
      <label>Volume <input class="wb-volume" type="range" min="0" max="100" value="65" /></label>
      <label>Qualidade gráfica <select class="wb-quality"><option value="low">Baixa</option><option value="medium">Equilibrada</option><option value="high">Alta</option></select></label>
      <button type="button" class="wb-reset">Reiniciar experiência</button>
    </dialog>
    <dialog class="wb-confirm" aria-label="Confirmar reinício">
      <form method="dialog"><h2>Reiniciar experiência?</h2><p>O estado atual da cena será reiniciado.</p>
        <div class="wb-dialog-title"><button value="cancel" autofocus>Cancelar</button><button value="reset">Reiniciar</button></div>
      </form>
    </dialog>`;
  document.body.append(root);
  const find = (selector) => root.querySelector(selector);
  const stage = find('.wb-stage');
  const tools = find('.wb-tools');
  const status = find('.wb-status');
  const actions = find('.wb-actions');
  const help = find('.wb-help');
  const confirmReset = find('.wb-confirm');
  const pauseButton = find('.wb-pause');
  const soundButton = find('.wb-audio');
  const qualitySelect = find('.wb-quality');
  const overlay = find('.wb-overlay');
  const overlayMessage = overlay.querySelector('p');
  const overlayButton = overlay.querySelector('button');
  const signal = new AbortController();
  let callbacks = {};
  let personalPause = false;
  let bridgePause = Boolean(window.__SANGI_PAUSED__);
  let bridgeMute = Boolean(window.__SANGI_MUTED__);
  let soundEnabled = false;
  let contextLost = false;
  let audio;
  let output;
  let paused = false;

  root.querySelector('h1').textContent = title;
  root.querySelector('.wb-title p').textContent = subtitle;
  root.querySelector('.wb-panel h2').textContent = toolsLabel;
  find('.wb-help-text').textContent = hint;
  setHint(hint);
  qualitySelect.value = matchMedia('(pointer: coarse)').matches ? 'medium' : 'high';

  function listen(target, event, handler, options = {}) {
    target.addEventListener(event, handler, { ...options, signal: signal.signal });
  }

  function syncPause() {
    const next = personalPause || bridgePause || document.hidden || help.open || confirmReset.open || contextLost;
    const showOverlay = contextLost || personalPause || bridgePause;
    overlay.hidden = !showOverlay;
    overlayMessage.textContent = contextLost ? 'A conexão com o renderizador 3D foi interrompida.' : 'Experiência pausada';
    overlayButton.textContent = contextLost ? 'Recarregar cena' : 'Continuar';
    overlayButton.disabled = bridgePause && !contextLost;
    pauseButton.textContent = personalPause ? 'Continuar' : 'Pausar';
    pauseButton.setAttribute('aria-pressed', String(personalPause));
    stage.inert = showOverlay;
    tools.inert = showOverlay;
    actions.inert = showOverlay;
    if (next !== paused) {
      paused = next;
      callbacks.pause?.(paused);
    }
    syncAudio();
  }

  function syncAudio() {
    const muted = !soundEnabled || bridgeMute;
    if (output) output.gain.setTargetAtTime(muted || paused ? 0 : Number(find('.wb-volume').value) / 100, audio.currentTime, .02);
    callbacks.mute?.(muted);
  }

  function sound({ frequency = 440, end = frequency, duration = .15, volume = .12, type = 'sine' } = {}) {
    if (audio?.state !== 'running' || !soundEnabled || bridgeMute || paused) return;
    const at = audio.currentTime;
    const tone = audio.createOscillator();
    const envelope = audio.createGain();
    tone.type = type;
    tone.frequency.setValueAtTime(Math.max(20, frequency), at);
    tone.frequency.exponentialRampToValueAtTime(Math.max(20, end), at + duration);
    envelope.gain.setValueAtTime(.0001, at);
    envelope.gain.exponentialRampToValueAtTime(Math.max(.001, volume), at + Math.min(.025, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    tone.connect(envelope).connect(output);
    tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
    tone.start(at);
    tone.stop(at + duration);
  }

  function setStatus(text) { status.textContent = text; }
  function setHint(text) { find('.wb-hint').textContent = text; }

  function save(filename, blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  function download(filename, contents, mime = 'application/json') {
    const data = typeof contents === 'object' && !(contents instanceof Blob) ? JSON.stringify(contents, null, 2) : contents;
    save(filename, contents instanceof Blob ? contents : new Blob([data], { type: mime }));
  }

  function capture(canvas, filename) {
    try {
      if (!canvas.width || !canvas.height) return false;
      canvas.toBlob((blob) => {
        if (blob) save(filename, blob);
        else setStatus('A imagem não pôde ser salva.');
      }, 'image/png');
      return true;
    } catch {
      setStatus('A imagem não pôde ser salva.');
      return false;
    }
  }

  listen(find('.wb-back'), 'click', (event) => {
    if (window.parent === window) return;
    event.preventDefault();
    window.parent.postMessage({ type: 'SANGI_APP_EXIT' }, location.origin);
  });
  listen(pauseButton, 'click', () => { personalPause = !personalPause; syncPause(); });
  listen(overlayButton, 'click', () => {
    if (contextLost) location.reload();
    else { personalPause = false; syncPause(); }
  });
  listen(find('.wb-help-open'), 'click', () => { help.showModal(); syncPause(); });
  listen(find('.wb-help-close'), 'click', () => help.close());
  listen(help, 'close', syncPause);
  listen(find('.wb-reset'), 'click', () => { confirmReset.returnValue = ''; confirmReset.showModal(); syncPause(); });
  listen(confirmReset, 'close', () => {
    if (confirmReset.returnValue === 'reset') {
      personalPause = false;
      callbacks.reset?.();
      help.close();
    }
    syncPause();
  });
  listen(soundButton, 'click', async () => {
    try {
      if (!audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        audio = new Audio();
        output = audio.createGain();
        output.gain.value = 0;
        output.connect(audio.destination);
      }
      if (!soundEnabled) await audio.resume();
      if (signal.signal.aborted) return;
      soundEnabled = !soundEnabled;
      soundButton.textContent = soundEnabled ? 'Desativar som' : 'Ativar som';
      soundButton.setAttribute('aria-pressed', String(soundEnabled));
      syncAudio();
    } catch {
      soundButton.textContent = 'Som indisponível';
    }
  });
  listen(find('.wb-volume'), 'input', syncAudio);
  listen(qualitySelect, 'change', () => callbacks.quality?.(qualitySelect.value));
  listen(document, 'visibilitychange', syncPause);
  listen(window, 'keydown', (event) => {
    if (event.key === 'Escape' && !help.open && !confirmReset.open && !event.defaultPrevented) {
      personalPause = !personalPause;
      syncPause();
    }
  });
  listen(window, 'sangi:pause', () => { bridgePause = true; syncPause(); });
  listen(window, 'sangi:resume', () => { bridgePause = false; syncPause(); });
  listen(window, 'sangi:mute', ({ detail }) => { bridgeMute = detail.muted; syncAudio(); });
  listen(window, 'sangi:reset', () => {
    personalPause = false;
    bridgePause = false;
    callbacks.reset?.();
    syncPause();
  });
  listen(window, 'sangi:quality', ({ detail }) => {
    const quality = { performance: 'low', balanced: 'medium', ultra: 'high' }[detail.quality] || detail.quality;
    if (!['low', 'medium', 'high'].includes(quality)) return;
    qualitySelect.value = quality;
    callbacks.quality?.(quality);
  });
  listen(stage, 'webglcontextlost', (event) => {
    event.preventDefault();
    contextLost = true;
    syncPause();
  }, { capture: true });
  listen(stage, 'webglcontextrestored', () => { contextLost = false; syncPause(); }, { capture: true });
  listen(window, 'sangi:dispose', () => {
    signal.abort();
    callbacks.dispose?.();
    audio?.close().catch(() => {});
  });

  function bind(handlers) {
    callbacks = handlers;
    callbacks.quality?.(qualitySelect.value);
    callbacks.pause?.(paused);
    syncAudio();
    window.SangiBridge.notifyReady({ title });
  }

  syncPause();
  return { stage, tools, status, help, actions, bind, setStatus, setHint, sound, download, capture };
}
