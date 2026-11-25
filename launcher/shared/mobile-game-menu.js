(function () {
  const mobile = matchMedia('(max-width: 640px), (pointer: coarse) and (max-width: 1024px)');
  const gameStyle = new URL('mobile-game-menu.css', document.currentScript.src);
  const controlsSelector = [
    'button', 'summary', '[role="button"]',
    'input:not([type="hidden"]):not([type="file"])', 'select', 'textarea',
  ].join(',');

  function controlLabel(control) {
    const visibleText = control.innerText?.trim();
    const text = control.getAttribute('aria-label')
      || (control.getAttribute('aria-labelledby') || '').split(/\s+/)
        .map(id => control.ownerDocument.getElementById(id)?.textContent).join(' ').trim()
      || [...(control.labels || [])].map(label => label.textContent).join(' ').trim()
      || (visibleText && /[\p{L}\p{N}]/u.test(visibleText) && visibleText)
      || control.getAttribute('title')
      || control.getAttribute('placeholder')
      || (control.matches('input[type="button"], input[type="submit"], input[type="reset"]') && control.value)
      || visibleText;
    return typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '';
  }

  function gameControls(doc) {
    if (!doc?.body) return [];
    const { innerWidth, innerHeight, getComputedStyle } = doc.defaultView;
    const transparency = new WeakMap();
    function isTransparent(element) {
      if (!element) return false;
      if (!transparency.has(element)) {
        transparency.set(element, getComputedStyle(element).opacity === '0' || isTransparent(element.parentElement));
      }
      return transparency.get(element);
    }
    const topLayer = [...doc.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"]')]
      .reverse().find(dialog => dialog.getClientRects().length
        && getComputedStyle(dialog).visibility === 'visible'
        && !isTransparent(dialog) && !dialog.closest('[inert], [aria-hidden="true"]'));
    return [...(topLayer || doc).querySelectorAll(controlsSelector)].flatMap(control => {
      if (control.matches(':disabled, [aria-disabled="true"]') || control.closest('[inert], [aria-hidden="true"]')) return [];
      // Estes controles dependem de segurar ou arrastar na própria cena.
      if (control.matches('[data-walk], #pinball [data-action="flip"], #pinball [data-action="launch"]')) return [];
      if (getComputedStyle(control).visibility !== 'visible' || isTransparent(control)) return [];
      const box = control.getBoundingClientRect();
      if (!box.width || !box.height) return [];
      // O retângulo de um controle fora da área visível de um dock pode ser
      // alcançado por rolagem. Já um painel deslocado para fora fica de fora.
      const scroller = control.closest('[data-sangi-scroll-dock]');
      const region = scroller?.getBoundingClientRect() || box;
      if (region.right <= 0 || region.bottom <= 0 || region.left >= innerWidth || region.top >= innerHeight) return [];
      const label = controlLabel(control);
      return label ? [{ control, label }] : [];
    });
  }

  function fitDocks(doc) {
    if (!doc?.body || doc.getElementById('sangi-mobile-game-style')) return;
    const link = doc.createElement('link');
    link.id = 'sangi-mobile-game-style';
    link.rel = 'stylesheet';
    link.href = gameStyle;
    doc.head.append(link);

    // Ajusta barras horizontais do jogo preservando os elementos e seus eventos.
    const dockSelector = [
      '#ui-bottom-dock', '#bottomDock', '#dock', '.dock', '.dock-bar', '.dock-inner',
      '.toolbar', '.top-toolbar', '.top-controls', '.controls-bar', '.dock-controls',
      '.bottom-dock', '.station-dock', '.puzzle-toolbar', '.channel-tabs',
    ].join(',');
    const update = () => {
      for (const dock of doc.querySelectorAll(dockSelector)) {
        if (dock.matches('[data-sangi-scroll-dock]') || dock.querySelector('canvas, dialog')) continue;
        const css = doc.defaultView.getComputedStyle(dock);
        if (!css.display.includes('flex') || css.flexDirection !== 'row' || css.flexWrap !== 'nowrap') continue;
        if (dock.children.length < 2 || !dock.querySelector(controlsSelector)) continue;
        const box = dock.getBoundingClientRect();
        if (!box.width) continue;
        const spills = dock.scrollWidth > dock.clientWidth + 2;
        const offscreen = box.left < -2 || box.right > doc.defaultView.innerWidth + 2;
        if (spills || offscreen) dock.setAttribute('data-sangi-scroll-dock', '');
      }
    };
    const refresh = () => { if (mobile.matches && doc.defaultView) update(); };
    link.addEventListener('load', refresh);
    doc.defaultView.addEventListener('resize', refresh);
    // Projetos compilados também podem montar a interface após o load inicial.
    return refresh;
  }

  function mount({ player, toggle, sheet, list, notice, closeButton, getFrame }) {
    let refreshDocks;

    function close(restoreFocus = true) {
      if (sheet.hidden) return;
      sheet.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) toggle.focus();
    }

    function attach(frame) {
      const doc = frame.contentDocument;
      refreshDocks = doc ? fitDocks(doc) : undefined;
      doc?.addEventListener('pointerdown', () => close(false), { capture: true });
      if (!sheet.hidden) {
        if (list.contains(document.activeElement)) closeButton.focus();
        renderControls();
      }
    }

    function renderControls() {
      const doc = getFrame()?.contentDocument;
      refreshDocks?.();
      const items = gameControls(doc);
      list.replaceChildren();
      notice.hidden = items.length > 0;
      for (const { control, label } of items) {
        const button = document.createElement('button');
        button.type = 'button';
        const needsFocus = control.matches('select, textarea, input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])');
        button.textContent = needsFocus ? 'Ajustar ' + label : label;
        const pressed = control.getAttribute('aria-pressed');
        if (pressed !== null) button.setAttribute('aria-pressed', pressed);
        button.addEventListener('click', () => {
          if (!control.isConnected) return close();
          close(!needsFocus);
          if (needsFocus) {
            control.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            control.focus({ preventScroll: true });
          } else {
            control.click();
          }
        });
        list.append(button);
      }
    }

    function open() {
      if (!mobile.matches) return;
      renderControls();
      sheet.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      sheet.scrollTop = 0;
      closeButton.focus();
    }

    toggle.addEventListener('click', () => sheet.hidden ? open() : close());
    closeButton.addEventListener('click', () => close());
    player.addEventListener('pointerdown', event => {
      if (!sheet.contains(event.target) && !toggle.contains(event.target)) close(false);
    });
    mobile.addEventListener('change', () => {
      if (mobile.matches) refreshDocks?.();
      else close(false);
    });
    return { attach, close };
  }

  window.SangiMobileGameMenu = { mount };
})();
