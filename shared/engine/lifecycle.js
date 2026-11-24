/**
 * shared/engine/lifecycle.js
 * Gerenciador de ciclo de vida integrado ao Sangi Bridge
 * Eventos: READY, PAUSE, RESUME, MUTE, DISPOSE
 */

export class LifecycleManager {
  constructor(app, options = {}) {
    this.app = app;
    this.options = Object.assign({
      autoReady: true,
      bridgeReadyTimeout: 100
    }, options);

    this.isPaused = false;
    this.isMuted = false;
    this.isDisposed = false;

    this.setupListeners();

    if (this.options.autoReady) {
      setTimeout(() => this.notifyReady(), this.options.bridgeReadyTimeout);
    }
  }

  setupListeners() {
    this._onPause = () => {
      this.isPaused = true;
      if (this.app.onPause) this.app.onPause();
    };

    this._onResume = () => {
      this.isPaused = false;
      if (this.app.onResume) this.app.onResume();
    };

    this._onMute = (e) => {
      this.isMuted = e.detail ? Boolean(e.detail.muted) : true;
      if (this.app.onMute) this.app.onMute(this.isMuted);
    };

    this._onDispose = () => {
      this.dispose();
    };

    window.addEventListener('sangi:pause', this._onPause);
    window.addEventListener('sangi:resume', this._onResume);
    window.addEventListener('sangi:mute', this._onMute);
    window.addEventListener('sangi:dispose', this._onDispose);

    // Pausar ao trocar de aba do navegador
    this._onVisibility = () => {
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

    window.removeEventListener('sangi:pause', this._onPause);
    window.removeEventListener('sangi:resume', this._onResume);
    window.removeEventListener('sangi:mute', this._onMute);
    window.removeEventListener('sangi:dispose', this._onDispose);
    document.removeEventListener('visibilitychange', this._onVisibility);

    if (this.app.dispose) {
      this.app.dispose();
    }
  }
}
