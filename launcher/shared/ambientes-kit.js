/**
 * Ambientes 3D — Kit Comum de Recursos Transversais (ambientes-kit.js)
 * Utilitário leve (zero dependências) para padronizar navegação, áudio zen,
 * modo foto, atalhos de teclado, acessibilidade e ciclo de vida WebGL.
 */

export const AMBIENTES_VERSION = '1.0.0';

/**
 * Cria ou injeta o botão padronizado de retorno ao Launcher.
 * @param {Object} options
 * @param {string} [options.label='← Launcher']
 * @param {string} [options.href='/']
 */
export function injectLauncherButton({ label = '← Launcher', href = '/' } = {}) {
  if (document.querySelector('.ambientes-launcher-btn, a[title="Voltar ao Launcher Principal"]')) return;
  const a = document.createElement('a');
  a.href = href;
  a.className = 'ambientes-launcher-btn';
  a.title = 'Voltar ao Launcher Principal';
  a.innerHTML = `&larr; ${label.replace(/^←\s*/, '')}`;
  Object.assign(a.style, {
    position: 'fixed',
    top: '14px',
    left: '14px',
    zIndex: '9999',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 15px',
    borderRadius: '999px',
    background: 'rgba(20, 16, 13, 0.82)',
    border: '1px solid rgba(220, 190, 150, 0.28)',
    color: '#f5ede0',
    textDecoration: 'none',
    fontSize: '12px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    webkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    userSelect: 'none',
  });

  a.addEventListener('mouseenter', () => {
    a.style.background = 'rgba(40, 30, 24, 0.94)';
    a.style.borderColor = '#dfba7c';
    a.style.transform = 'translateY(-1px)';
  });
  a.addEventListener('mouseleave', () => {
    a.style.background = 'rgba(20, 16, 13, 0.82)';
    a.style.borderColor = 'rgba(220, 190, 150, 0.28)';
    a.style.transform = 'none';
  });

  document.body.appendChild(a);
  return a;
}

/**
 * Motor de áudio procedural zen (Web Audio API)
 * Gera ventos suaves, estalos de corte vegetal, torção metálica e sinos harmônicos.
 */
export class ZenAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = true;
    this.volume = 0.7;
    this.windNode = null;
    this.windGain = null;
    this._disposed = false;
  }

  ensureContext() {
    if (this._disposed) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.volume, now + 0.08);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // Tesoura japonesa afiada cortando galho
  playShears() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Ruído metálico rápido com banda passa-alta
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // Pequeno estalo do estalo da madeira
    const click = ctx.createOscillator();
    click.type = 'triangle';
    click.frequency.setValueAtTime(420, now);
    click.frequency.exponentialRampToValueAtTime(110, now + 0.04);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.35, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    click.connect(clickGain);
    clickGain.connect(this.masterGain);

    noise.start(now);
    click.start(now);
    click.stop(now + 0.05);
  }

  // Dobra e atrito de arame metálico
  playWireTension() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(410, now + 0.16);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Sino zen / tigela cantora (Mudança de estação ou sucesso)
  playChime(baseFreq = 528) {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const harmonics = [1, 2.02, 3.01, 4.15];
    const decays = [2.2, 1.4, 0.9, 0.5];
    const amps = [0.25, 0.12, 0.06, 0.03];

    harmonics.forEach((h, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amps[idx], now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + decays[idx] + 0.05);
    });
  }

  // Toque suave em cerâmica ou pedra
  playStoneTap() {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Brisa suave de vento (ruído rosa filtrado contínuo)
  startWind() {
    if (this.windNode) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.06;
    }

    this.windNode = ctx.createBufferSource();
    this.windNode.buffer = buffer;
    this.windNode.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.06, ctx.currentTime);

    this.windNode.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.windNode.start();
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.isMuted = true;
    if (this.windNode) {
      try { this.windNode.stop(); } catch {}
      try { this.windNode.disconnect(); } catch {}
      this.windNode = null;
    }
    if (this.windGain) {
      try { this.windGain.disconnect(); } catch {}
      this.windGain = null;
    }
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

/**
 * Utilitário de captura fotográfica contemplativa
 * Oculta a UI, aguarda renderização nítida, desenha carimbo opcional e exporta PNG.
 */
export async function capturePhoto({
  canvas,
  renderer,
  scene,
  camera,
  title = 'Oficina de Bonsais',
  hankoText = '盆栽',
  filename = 'bonsai-contemplacao.png',
  hideElementsSelector = '.top, .dock, .panel, .guide, .info, .hint, .ambientes-launcher-btn, header',
}) {
  const elements = document.querySelectorAll(hideElementsSelector);
  elements.forEach((el) => { el.style.visibility = 'hidden'; });

  // Forçar render com a UI invisível
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }

  await new Promise((r) => requestAnimationFrame(r));

  // Criar canvas de exportação com carimbo estético
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const ctx = exportCanvas.getContext('2d');

  // Desenha o frame 3D limpo
  ctx.drawImage(canvas, 0, 0);

  // Carimbo tradicional Hanko no canto inferior direito
  const size = Math.max(48, Math.floor(exportCanvas.width * 0.04));
  const margin = Math.max(24, Math.floor(exportCanvas.width * 0.02));
  const x = exportCanvas.width - margin - size;
  const y = exportCanvas.height - margin - size;

  ctx.fillStyle = 'rgba(165, 75, 54, 0.88)';
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, Math.floor(size * 0.15));
  ctx.fill();

  ctx.fillStyle = '#fff5e0';
  ctx.font = `bold ${Math.floor(size * 0.5)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(hankoText, x + size / 2, y + size / 2);

  // Download do arquivo
  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');

  // Restaura a visibilidade da UI
  elements.forEach((el) => { el.style.visibility = ''; });
}

/**
 * Adiciona listeners universais de ciclo de vida e acessibilidade:
 * - Pausa render e som quando a aba fica em segundo plano.
 * - Detecta prefers-reduced-motion.
 */
export function setupEnvironmentLifecycle({ onPause, onResume, onReducedMotionChange } = {}) {
  const onVisibility = () => {
    if (document.hidden) {
      onPause?.();
    } else {
      onResume?.();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  const motionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const onMotionChange = (e) => {
    onReducedMotionChange?.(e.matches);
  };
  motionQuery?.addEventListener?.('change', onMotionChange);

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery?.removeEventListener?.('change', onMotionChange);
  };
}

/**
 * Protocolo e ponte de comunicação universal com o Launcher Sangi3D.
 * Conecta eventos postMessage (READY, PAUSE, RESUME, MUTE, UNMUTE, RESET, SET_QUALITY, DISPOSE) e gerencia ciclo de vida.
 */
export function setupSangiBridge({
  id = '',
  capabilities = {},
  onPause = null,
  onResume = null,
  onMute = null,
  onUnmute = null,
  onReset = null,
  onQualityChange = null,
  onDispose = null,
} = {}) {
  const isIframe = window.parent && window.parent !== window;

  // Notifica o Launcher que o ambiente está pronto
  if (isIframe) {
    try {
      window.parent.postMessage({
        type: 'SANGI_APP_READY',
        id,
        capabilities: {
          webgl2: Boolean(window.WebGL2RenderingContext),
          touch: 'ontouchstart' in window,
          ...capabilities,
        },
      }, '*');
    } catch {}
  }

  let disposed = false;

  const onMessage = (e) => {
    if (disposed || !e.data || typeof e.data !== 'object') return;
    let cmd = '';
    let payload = e.data;
    if (e.data.type === 'SANGI_COMMAND' && e.data.command) {
      cmd = String(e.data.command).toUpperCase();
      payload = e.data.payload && typeof e.data.payload === 'object' ? e.data.payload : {};
    } else if (typeof e.data.type === 'string' && e.data.type.startsWith('SANGI_APP_')) {
      cmd = e.data.type.slice('SANGI_APP_'.length).toUpperCase();
    }
    if (!cmd) return;
    switch (cmd) {
      case 'PAUSE':
        onPause?.();
        break;
      case 'RESUME':
        onResume?.();
        break;
      case 'MUTE':
        onMute?.(typeof payload.muted === 'boolean' ? payload.muted : true);
        break;
      case 'UNMUTE':
        if (typeof onUnmute === 'function') onUnmute();
        else onMute?.(false);
        break;
      case 'RESET':
        onReset?.(payload);
        break;
      case 'SET_QUALITY':
        if (payload.quality) onQualityChange?.(payload.quality);
        break;
      case 'DISPOSE':
        dispose();
        onDispose?.();
        break;
    }
  };

  const onVisibility = () => {
    if (disposed) return;
    if (document.hidden) onPause?.();
    else onResume?.();
  };

  window.addEventListener('message', onMessage);
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    if (disposed) return;
    disposed = true;
    window.removeEventListener('message', onMessage);
    document.removeEventListener('visibilitychange', onVisibility);
  }

  return dispose;
}

/**
 * Utilitário de descarte profundo e liberação de recursos Three.js / WebGL
 */
export function disposeScene(renderer, scene, { loseContext = true } = {}) {
  if (scene) {
    scene.traverse((obj) => {
      if (obj.geometry) {
        try { obj.geometry.dispose(); } catch {}
      }
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => disposeMaterial(m));
        } else {
          disposeMaterial(obj.material);
        }
      }
    });
    if (scene.environment && typeof scene.environment.dispose === 'function') {
      try { scene.environment.dispose(); } catch {}
    }
    scene.environment = null;
    if (scene.background && typeof scene.background.dispose === 'function') {
      try { scene.background.dispose(); } catch {}
    }
    scene.background = null;
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }

  if (renderer) {
    try {
      renderer.dispose();
      if (loseContext && typeof renderer.forceContextLoss === 'function') {
        renderer.forceContextLoss();
      }
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    } catch {}
  }
}

function disposeMaterial(mat) {
  if (!mat) return;
  const textureKeys = [
    'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap',
    'alphaMap', 'roughnessMap', 'metalnessMap', 'aoMap',
    'emissiveMap', 'displacementMap', 'sheenColorMap', 'specularColorMap',
    'transmissionMap', 'thicknessMap'
  ];
  for (const key of textureKeys) {
    if (mat[key] && typeof mat[key].dispose === 'function') {
      try { mat[key].dispose(); } catch {}
    }
  }
  try { mat.dispose(); } catch {}
}
