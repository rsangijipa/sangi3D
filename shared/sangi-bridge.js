/**
 * Sangi3D — Ponte Universal de Ciclo de Vida e Telemetria (sangi-bridge.js)
 * Script leve, sem dependências externas, para padronizar o ciclo de vida
 * dos ambientes 3D executados dentro do Launcher ou em aba avulsa.
 */
(function () {
  'use strict';
  if (window.__SANGI_BRIDGE_INITIALIZED__) return;
  window.__SANGI_BRIDGE_INITIALIZED__ = true;

  var isIframe = window.parent && window.parent !== window;

  function notifyReady() {
    if (isIframe) {
      try {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          title: document.title,
          href: location.pathname,
          capabilities: {
            webgl2: !!window.WebGL2RenderingContext,
            touch: 'ontouchstart' in window,
            audio: !!(window.AudioContext || window.webkitAudioContext),
          },
        }, '*');
      } catch (e) {}
    }
  }

  if (document.readyState === 'complete') {
    notifyReady();
  } else {
    window.addEventListener('load', notifyReady);
  }

  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data !== 'object') return;
    switch (e.data.type) {
      case 'SANGI_APP_PAUSE':
        window.__SANGI_PAUSED__ = true;
        window.dispatchEvent(new CustomEvent('sangi:pause'));
        break;
      case 'SANGI_APP_RESUME':
        window.__SANGI_PAUSED__ = false;
        window.dispatchEvent(new CustomEvent('sangi:resume'));
        break;
      case 'SANGI_APP_MUTE':
        window.__SANGI_MUTED__ = Boolean(e.data.muted);
        window.dispatchEvent(new CustomEvent('sangi:mute', { detail: { muted: window.__SANGI_MUTED__ } }));
        break;
      case 'SANGI_APP_DISPOSE':
        window.__SANGI_DISPOSED__ = true;
        window.dispatchEvent(new CustomEvent('sangi:dispose'));
        // Liberação forçada de contextos WebGL em caso de descarte
        try {
          var canvases = document.querySelectorAll('canvas');
          for (var i = 0; i < canvases.length; i++) {
            var gl = canvases[i].getContext('webgl2') || canvases[i].getContext('webgl');
            if (gl) {
              var ext = gl.getExtension('WEBGL_lose_context');
              if (ext) ext.loseContext();
            }
          }
        } catch (err) {}
        break;
    }
  });
})();
