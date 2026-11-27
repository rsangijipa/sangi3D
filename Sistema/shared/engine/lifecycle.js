/**
 * shared/engine/lifecycle.js
 * Gerenciador de ciclo de vida integrado ao Sangi Bridge
 * Eventos: READY, PAUSE, RESUME, MUTE, UNMUTE, RESET, SET_QUALITY, DISPOSE
 */

export class LifecycleManager {
  constructor(app, options = {}) {
    this.app = app || {};
    this.options = Object.assign({
      autoReady: true,
      bridgeReadyTimeout: 100
    }, options);

    this.isPaused = false;
    this.isMuted = false;
    this.isDisposed = false;
    this.quality = null;
    this._readyTimer = null;

    this.setupListeners();

    if (this.options.autoReady) {
      this._readyTimer = setTimeout(() => {
        this._readyTimer = null;
        this.notifyReady();
      }, this.options.bridgeReadyTimeout);
    }
  }

  setupListeners() {
    this._onPause = () => {
      if (this.isDisposed) return;
      this.isPaused = true;
      if (this.app.onPause) this.app.onPause();
    };

    this._onResume = () => {
      if (this.isDisposed) return;
      this.isPaused = false;
      if (this.app.onResume) this.app.onResume();
    };

    this._onMute = (e) => {
      if (this.isDisposed) return;
      this.isMuted = e.detail ? Boolean(e.detail.muted) : true;
      if (this.app.onMute) this.app.onMute(this.isMuted);
    };

    this._onReset = (e) => {
      if (this.isDisposed) return;
      this.isPaused = false;
      if (this.app.onReset) this.app.onReset(e?.detail);
    };

    this._onQuality = (e) => {
      if (this.isDisposed) return;
      const quality = e?.detail?.quality || null;
      if (!quality) return;
      this.quality = quality;
      if (this.app.onQualityChange) this.app.onQualityChange(quality);
    };

    this._onDispose = () => {
      this.dispose();
    };

    // Fallback para ambientes sem shared/sangi-bridge.js carregado
    this._onMessage = (e) => {
      if (this.isDisposed || window.__SANGI_BRIDGE_INITIALIZED__) return;
      const data = e?.data;
      if (!data || typeof data !== 'object') return;
      let cmd = '';
      let payload = data;
      if (data.type === 'SANGI_COMMAND' && data.command) {
        cmd = String(data.command).toUpperCase();
        payload = data.payload && typeof data.payload === 'object' ? data.payload : {};
      } else if (typeof data.type === 'string' && data.type.startsWith('SANGI_APP_')) {
        cmd = data.type.slice('SANGI_APP_'.length).toUpperCase();
      }
      if (!cmd) return;
      if (cmd === 'PAUSE') this._onPause();
      else if (cmd === 'RESUME') this._onResume();
      else if (cmd === 'MUTE') this._onMute({ detail: { muted: typeof payload.muted === 'boolean' ? payload.muted : true } });
      else if (cmd === 'UNMUTE') this._onMute({ detail: { muted: false } });
      else if (cmd === 'RESET') this._onReset({ detail: payload });
      else if (cmd === 'SET_QUALITY') this._onQuality({ detail: { quality: payload.quality } });
      else if (cmd === 'DISPOSE') this.dispose();
    };

    window.addEventListener('sangi:pause', this._onPause);
    window.addEventListener('sangi:resume', this._onResume);
    window.addEventListener('sangi:mute', this._onMute);
    window.addEventListener('sangi:reset', this._onReset);
    window.addEventListener('sangi:quality', this._onQuality);
    window.addEventListener('sangi:dispose', this._onDispose);
    window.addEventListener('message', this._onMessage);

    // Pausar ao trocar de aba do navegador
    this._onVisibility = () => {
      if (this.isDisposed) return;
      if (document.hidden) {
        this.isPaused = true;
        if (this.app.onPause) this.app.onPause();
      } else {
        this.isPaused = false;
        if (this.app.onResume) this.app.onResume();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  notifyReady() {
    if (this.isDisposed) return;
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'SANGI_APP_READY',
          title: document.title,
          href: location.pathname
        }, '*');
      }
    } catch (e) {}
  }

  dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;

    if (this._readyTimer !== null) {
      clearTimeout(this._readyTimer);
      this._readyTimer = null;
    }

    window.removeEventListener('sangi:pause', this._onPause);
    window.removeEventListener('sangi:resume', this._onResume);
    window.removeEventListener('sangi:mute', this._onMute);
    window.removeEventListener('sangi:reset', this._onReset);
    window.removeEventListener('sangi:quality', this._onQuality);
    window.removeEventListener('sangi:dispose', this._onDispose);
    window.removeEventListener('message', this._onMessage);
    document.removeEventListener('visibilitychange', this._onVisibility);

    if (this.app.dispose) {
      this.app.dispose();
    }
  }
}
