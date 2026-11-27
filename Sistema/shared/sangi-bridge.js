/**
 * Sangi3D — Ponte Universal de Ciclo de Vida e Telemetria (sangi-bridge.js)
 * Script leve, sem dependências externas, para padronizar o ciclo de vida
 * dos ambientes 3D executados dentro do Launcher ou em aba avulsa.
 */
(function (root) {
  'use strict';
  if (root.__SANGI_BRIDGE_INITIALIZED__) return;
  root.__SANGI_BRIDGE_INITIALIZED__ = true;
  root.__SANGI_PAUSED__ = Boolean(root.__SANGI_PAUSED__);
  root.__SANGI_MUTED__ = Boolean(root.__SANGI_MUTED__);
  root.__SANGI_DISPOSED__ = Boolean(root.__SANGI_DISPOSED__);
  if (typeof root.__SANGI_QUALITY__ === 'undefined') {
    root.__SANGI_QUALITY__ = null;
  }

  var isIframe = Boolean(root.parent && root.parent !== root);

  function dispatchBridgeEvent(name, detail) {
    if (typeof root.dispatchEvent !== 'function' || typeof root.CustomEvent !== 'function') return;
    root.dispatchEvent(new root.CustomEvent(name, detail !== undefined ? { detail: detail } : undefined));
  }

  function notifyReady(extra) {
    if (!isIframe) return;
    try {
      var doc = root.document || {};
      var loc = root.location || {};
      var payload = {
        type: 'SANGI_APP_READY',
        title: (extra && extra.title) || doc.title || '',
        href: (extra && extra.href) || loc.pathname || '',
        capabilities: {
          webgl2: Boolean(root.WebGL2RenderingContext),
          touch: 'ontouchstart' in root,
          audio: Boolean(root.AudioContext || root.webkitAudioContext),
        },
      };
      if (extra && extra.appId) payload.appId = extra.appId;
      if (extra && extra.capabilities && typeof extra.capabilities === 'object') {
        for (var k in extra.capabilities) {
          if (Object.prototype.hasOwnProperty.call(extra.capabilities, k)) {
            payload.capabilities[k] = extra.capabilities[k];
          }
        }
      }
      root.parent.postMessage(payload, '*');
    } catch (e) {}
  }

  function parseCommand(data) {
    if (!data || typeof data !== 'object') return null;
    if (data.type === 'SANGI_COMMAND' && data.command) {
      return {
        command: String(data.command).toUpperCase(),
        payload: data.payload && typeof data.payload === 'object' ? data.payload : {},
      };
    }
    if (typeof data.type === 'string' && data.type.indexOf('SANGI_APP_') === 0) {
      return {
        command: data.type.slice('SANGI_APP_'.length).toUpperCase(),
        payload: data,
      };
    }
    return null;
  }

  function releaseWebGLContexts() {
    try {
      var doc = root.document;
      if (!doc || typeof doc.querySelectorAll !== 'function') return;
      var canvases = doc.querySelectorAll('canvas');
      for (var i = 0; i < canvases.length; i++) {
        var gl = canvases[i].getContext('webgl2') || canvases[i].getContext('webgl');
        if (gl) {
          var ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        }
      }
    } catch (err) {}
  }

  function dispose() {
    if (root.__SANGI_DISPOSED__) return;
    root.__SANGI_DISPOSED__ = true;
    root.removeEventListener('load', onLoad);
    root.removeEventListener('pagehide', onPageHide);
    root.removeEventListener('message', onMessage);
    dispatchBridgeEvent('sangi:dispose');
    releaseWebGLContexts();
  }

  function handleMessage(data) {
    var parsed = parseCommand(data);
    if (!parsed) return false;
    var cmd = parsed.command;
    var payload = parsed.payload;

    switch (cmd) {
      case 'READY':
        notifyReady(payload);
        return true;
      case 'PAUSE':
        root.__SANGI_PAUSED__ = true;
        dispatchBridgeEvent('sangi:pause');
        return true;
      case 'RESUME':
        root.__SANGI_PAUSED__ = false;
        dispatchBridgeEvent('sangi:resume');
        return true;
      case 'MUTE': {
        var muted = typeof payload.muted === 'boolean' ? payload.muted : true;
        root.__SANGI_MUTED__ = muted;
        dispatchBridgeEvent('sangi:mute', { muted: muted });
        return true;
      }
      case 'UNMUTE':
        root.__SANGI_MUTED__ = false;
        dispatchBridgeEvent('sangi:mute', { muted: false });
        return true;
      case 'RESET':
        root.__SANGI_PAUSED__ = false;
        dispatchBridgeEvent('sangi:reset', payload);
        return true;
      case 'SET_QUALITY': {
        var quality = payload.quality || null;
        root.__SANGI_QUALITY__ = quality;
        dispatchBridgeEvent('sangi:quality', { quality: quality });
        return true;
      }
      case 'DISPOSE':
        dispose();
        return true;
      default:
        return false;
    }
  }

  function onLoad() {
    notifyReady();
  }

  function onPageHide(event) {
    if (!event || !event.persisted) dispose();
  }

  function onMessage(e) {
    handleMessage(e && e.data);
  }

  function getState() {
    return {
      initialized: Boolean(root.__SANGI_BRIDGE_INITIALIZED__),
      paused: Boolean(root.__SANGI_PAUSED__),
      muted: Boolean(root.__SANGI_MUTED__),
      disposed: Boolean(root.__SANGI_DISPOSED__),
      quality: root.__SANGI_QUALITY__ || null,
    };
  }

  if (root.document && root.document.readyState === 'complete') {
    notifyReady();
  } else {
    root.addEventListener('load', onLoad);
  }
  root.addEventListener('pagehide', onPageHide);
  root.addEventListener('message', onMessage);

  root.SangiBridge = {
    notifyReady: notifyReady,
    handleMessage: handleMessage,
    dispose: dispose,
    getState: getState,
  };
})(typeof window !== 'undefined' ? window : globalThis);
