import { createStudioEnvironment } from './studio-environment.js';

/**
 * shared/engine/renderer.js
 * Configuração e ciclo de renderização adaptativo para Sangi3D
 */

export class EngineRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas || document.createElement('canvas');
    this.options = Object.assign({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      maxPixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.0,
      environmentIntensity: 0.65,
      shadowMap: true,
      shadowMapType: THREE.PCFShadowMap
    }, options);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.options.antialias,
      alpha: this.options.alpha,
      powerPreference: this.options.powerPreference
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setPixelRatio(this.options.maxPixelRatio);
    
    // Suporte sRGB / Color Management
    if (THREE.SRGBColorSpace) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    if (this.options.toneMapping) {
      this.renderer.toneMapping = this.options.toneMapping;
      this.renderer.toneMappingExposure = this.options.toneMappingExposure;
    }

    if (this.options.shadowMap) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = this.options.shadowMapType;
    }

    this.isPaused = false;
    this.disposed = false;
    this.setupResizeListener();
  }

  setupResizeListener() {
    this._onResize = () => {
      if (this.disposed) return;
      const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
      const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
      this.renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', this._onResize);
  }

  setQuality(profile) {
    switch (profile) {
      case 'LOW':
        this.renderer.setPixelRatio(1.0);
        this.renderer.shadowMap.enabled = false;
        break;
      case 'BALANCED':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        this.renderer.shadowMap.enabled = true;
        break;
      case 'HIGH':
      case 'ULTRA':
      default:
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
        this.renderer.shadowMap.enabled = true;
        break;
    }
  }

  render(scene, camera) {
    if (this.isPaused || this.disposed) return;
    if (!scene.environment && this.options.environmentIntensity > 0) {
      this.environment ??= createStudioEnvironment(this.renderer);
      scene.environment = this.environment.texture;
      scene.environmentIntensity = this.options.environmentIntensity;
    }
    this.renderer.render(scene, camera);
  }

  dispose() {
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    this.environment?.dispose();
    try {
      this.renderer.dispose();
    } catch (e) {}
  }
}
