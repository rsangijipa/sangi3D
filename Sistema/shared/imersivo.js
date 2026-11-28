/*
 * Barra Imersiva — padrão de controles dos ambientes 3D (vanilla JS, sem dependências).
 *
 * Uso (no fim do <body>, depois dos scripts do ambiente):
 *   Imersivo.init({
 *     title: 'Lago 3D', subtitle: 'Reflexos e peixes', theme: 'light',
 *     hide: ['body > header'],                 // interface antiga substituída
 *     actions: ['#btn-som'],                   // botões existentes levados para a barra superior
 *     bottom: ['body > nav'],                  // controles existentes levados para a barra inferior
 *     panels: [{ label: 'Ajustes', icon: 'sliders', selector: '#painel', side: 'right' }],
 *     collapseHide: ['#rotulos-3d'],           // também somem quando os controles são recolhidos
 *   });
 * Tecla H ou o botão de olho recolhe/mostra tudo. Esc fecha o painel aberto.
 */
(function () {
  'use strict';
  var STORE_KEY = 'ambientes:controles-recolhidos';

  var ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    hide: '<path d="M18 15l-6-6-6 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L3.4 16.8a2 2 0 0 1 2.8-2.8L8 15.8"/>',
    sound: '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.sliders) + '</svg>';
  }
  function make(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function all(sel) {
    if (!sel) return [];
    if (sel instanceof Element) return [sel];
    try {
      return Array.prototype.slice.call(document.querySelectorAll(sel));
    } catch (e) {
      return [];
    }
  }
  function readCollapsed() {
    try {
      return localStorage.getItem(STORE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }
  function writeCollapsed(v) {
    try {
      localStorage.setItem(STORE_KEY, v ? '1' : '0');
    } catch (e) {
      /* armazenamento indisponível */
    }
  }
  function launcherHref() {
    // dentro do Alternador (/ver) ou servido pelo Launcher, a raiz é o Launcher
    return location.protocol === 'file:' ? '../index.html' : '/';
  }

  var api = null;

  function init(cfg) {
    if (api) return api;
    cfg = cfg || {};
    var root = document.documentElement;
    root.classList.add('imv-root');
    if (cfg.theme === 'light') root.classList.add('imv-light');
    if (cfg.accent) root.style.setProperty('--imv-accent', cfg.accent);
    var styleEl = null;
    if (cfg.css) {
      styleEl = make('style');
      styleEl.textContent = cfg.css;
      document.head.appendChild(styleEl);
    }

    // barra superior
    var top = make('div', 'imv-top imv-glass');
    top.setAttribute('role', 'toolbar');
    top.setAttribute('aria-label', 'Controles do ambiente');
    var back = make('a', 'imv-back', svg('back') + '<span class="imv-label">' + (cfg.backLabel || 'Ambientes') + '</span>');
    back.href = cfg.backHref || launcherHref();
    back.target = '_top';
    back.title = 'Voltar ao Launcher de ambientes';
    var title = make('div', 'imv-title');
    title.appendChild(make('strong', '', cfg.title || document.title));
    var liveSub = cfg.subtitleSelector ? all(cfg.subtitleSelector)[0] : null;
    if (liveSub) {
      // subtítulo dinâmico do próprio ambiente (ex.: cômodo atual)
      liveSub.className = '';
      title.appendChild(make('span', '')).appendChild(liveSub);
    } else if (cfg.subtitle) {
      title.appendChild(make('span', '', cfg.subtitle));
    }
    var actions = make('div', 'imv-actions');
    var tools = make('div', 'imv-actions');
    tools.style.overflow = 'visible';
    top.appendChild(back);
    top.appendChild(title);
    top.appendChild(make('div', 'imv-spacer'));
    top.appendChild(actions);
    top.appendChild(tools);

    var bottom = make('div', 'imv-bottom imv-glass');
    bottom.setAttribute('role', 'toolbar');
    bottom.setAttribute('aria-label', 'Gestos e pontos de vista');

    var reveal = make('button', 'imv-reveal', svg('eye') + '<span class="imv-label">Mostrar controles</span>');
    reveal.type = 'button';
    reveal.title = 'Mostrar controles (H)';

    document.body.appendChild(top);
    document.body.appendChild(bottom);
    document.body.appendChild(reveal);

    // esconde a interface antiga que foi substituída
    (cfg.hide || []).forEach(function (s) {
      all(s).forEach(function (n) {
        n.classList.add('imv-hidden');
      });
    });

    function flat(n) {
      n.classList.add('imv-flat');
      return n;
    }
    function addAction(node) {
      all(node).forEach(function (n) {
        actions.appendChild(n);
        n.classList.add('imv-moved');
      });
    }
    function addBottom(node) {
      all(node).forEach(function (n) {
        bottom.appendChild(flat(n));
      });
    }

    var panels = [];
    function closePanels(except) {
      panels.forEach(function (p) {
        if (p !== except) {
          p.el.hidden = true;
          p.btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
    function addPanel(p) {
      var nodes = all(p.selector || p.node);
      if (!nodes.length) return null;
      var el = make('section', 'imv-panel imv-glass ' + (p.side === 'left' ? 'is-left' : 'is-right'));
      el.hidden = true;
      if (p.width) el.style.width = 'min(' + p.width + 'px, calc(100% - 20px))';
      el.setAttribute('aria-label', p.label);
      var head = make('div', 'imv-panel-head', '<span>' + p.label + '</span>');
      var close = make('button', 'imv-btn imv-icon', svg('close'));
      close.type = 'button';
      close.title = 'Fechar painel';
      head.appendChild(close);
      var body = make('div', 'imv-panel-body');
      nodes.forEach(function (n) {
        body.appendChild(flat(n));
      });
      el.appendChild(head);
      el.appendChild(body);
      document.body.appendChild(el);
      var btn = make('button', 'imv-btn', svg(p.icon) + '<span class="imv-label">' + p.label + '</span>');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.title = p.title || p.label;
      tools.appendChild(btn);
      var entry = { el: el, btn: btn };
      panels.push(entry);
      function toggle(force) {
        var open = typeof force === 'boolean' ? force : el.hidden;
        closePanels(entry);
        el.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      btn.addEventListener('click', function () {
        toggle();
      });
      close.addEventListener('click', function () {
        toggle(false);
      });
      if (p.open) toggle(true);
      return { toggle: toggle, body: body, el: el };
    }

    (cfg.actions || []).forEach(addAction);
    (cfg.bottom || []).forEach(addBottom);
    var panelApis = (cfg.panels || []).map(addPanel);

    // tela cheia + recolher
    tools.appendChild(make('span', 'imv-sep'));
    var fs = make('button', 'imv-btn imv-icon', svg('full'));
    fs.type = 'button';
    fs.title = 'Tela cheia';
    fs.addEventListener('click', function () {
      var d = document;
      if (d.fullscreenElement) d.exitFullscreen();
      else if (d.documentElement.requestFullscreen) d.documentElement.requestFullscreen().catch(function () { });
    });
    tools.appendChild(fs);
    var hideBtn = make('button', 'imv-btn', svg('hide') + '<span class="imv-label">Recolher</span>');
    hideBtn.type = 'button';
    hideBtn.title = 'Recolher controles (H)';
    tools.appendChild(hideBtn);

    (cfg.collapseHide || []).forEach(function (s) {
      all(s).forEach(function (n) {
        n.classList.add('imv-hide-collapsed');
      });
    });

    function setCollapsed(v) {
      root.classList.toggle('imv-collapsed', v);
      writeCollapsed(v);
      if (typeof cfg.onCollapse === 'function') cfg.onCollapse(v);
      window.dispatchEvent(new CustomEvent('imersivo:recolhido', { detail: v }));
    }
    hideBtn.addEventListener('click', function () {
      setCollapsed(true);
    });
    reveal.addEventListener('click', function () {
      setCollapsed(false);
    });
    var onKeydown = function (e) {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'h' || e.key === 'H') {
        setCollapsed(!root.classList.contains('imv-collapsed'));
      } else if (e.key === 'Escape') {
        closePanels(null);
      }
    };
    window.addEventListener('keydown', onKeydown, true);
    if (readCollapsed()) setCollapsed(true);

    // Sangi3D Universal Bridge
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          title: cfg.title || document.title,
          capabilities: {
            webgl2: Boolean(window.WebGL2RenderingContext),
            touch: 'ontouchstart' in window,
            imersivo: true
          }
        }, '*');
      } catch (e) { }
    }

    var destroyed = false;
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('message', onBridgeMessage);
      window.removeEventListener('keydown', onKeydown, true);
      if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
      if (top.parentNode) top.parentNode.removeChild(top);
      if (bottom.parentNode) bottom.parentNode.removeChild(bottom);
      if (reveal.parentNode) reveal.parentNode.removeChild(reveal);
      panels.forEach(function (p) {
        if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
      });
      root.classList.remove('imv-root', 'imv-light', 'imv-collapsed');
      api = null;
      if (typeof cfg.onDispose === 'function') cfg.onDispose();
    }

    function onBridgeMessage(e) {
      if (!e.data || typeof e.data !== 'object') return;
      var cmd = e.data.type === 'SANGI_COMMAND'
        ? String(e.data.command || '').toUpperCase()
        : (e.data.type && String(e.data.type).indexOf('SANGI_APP_') === 0
          ? String(e.data.type).slice('SANGI_APP_'.length).toUpperCase()
          : '');
      if (!cmd) return;
      if (cmd === 'PAUSE') {
        if (typeof cfg.onPause === 'function') cfg.onPause();
      } else if (cmd === 'RESUME') {
        if (typeof cfg.onResume === 'function') cfg.onResume();
      } else if (cmd === 'MUTE') {
        var muted = e.data.payload && typeof e.data.payload.muted === 'boolean'
          ? e.data.payload.muted
          : (typeof e.data.muted === 'boolean' ? e.data.muted : true);
        if (typeof cfg.onMute === 'function') cfg.onMute(muted);
      } else if (cmd === 'UNMUTE') {
        if (typeof cfg.onMute === 'function') cfg.onMute(false);
      } else if (cmd === 'RESET') {
        if (typeof cfg.onReset === 'function') cfg.onReset();
      } else if (cmd === 'SET_QUALITY') {
        var q = (e.data.payload && e.data.payload.quality) || e.data.quality;
        if (typeof cfg.onQualityChange === 'function' && q) cfg.onQualityChange(q);
      } else if (cmd === 'DISPOSE') {
        destroy();
      }
    }
    window.addEventListener('message', onBridgeMessage);

    api = {
      addAction: addAction,
      addBottom: addBottom,
      addPanel: addPanel,
      panels: panelApis,
      setCollapsed: setCollapsed,
      destroy: destroy,
      dispose: destroy,
      top: top,
      bottom: bottom,
    };
    return api;
  }

  window.Imersivo = { init: init };
})();
