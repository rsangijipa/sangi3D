import * as THREE from '../vendor/three.module.js';
import { createStudioEnvironment } from './studio-environment.js';
import { QUALITY_PROFILES } from './performance.js';

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
      shadowMapType: THREE.PCFShadowMap,
      initialQuality: 'HIGH'
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
    if ('SRGBColorSpace' in THREE && THREE.SRGBColorSpace) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ('sRGBEncoding' in THREE && THREE.sRGBEncoding) {
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

    this.currentProfile = this.options.initialQuality;
    this.qualityProfile = QUALITY_PROFILES[this.currentProfile] || QUALITY_PROFILES.HIGH;
    this.particleSystem = options.particleSystem || null;
    this.isPaused = false;
    this.disposed = false;
    this.setupResizeListener();
  }

  setupResizeListener() {
    this._onResize = () => {
      if (this.disposed || !this.renderer) return;
      const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
      const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
      this.renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', this._onResize);
  }

  setQuality(profileName) {
    if (this.disposed || !this.renderer) return;
    const key = QUALITY_PROFILES[profileName] ? profileName : 'HIGH';
    const profile = QUALITY_PROFILES[key];
    this.currentProfile = key;
    this.qualityProfile = profile;

    const dpr = Math.min(window.devicePixelRatio || 1, profile.maxDpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.shadowMap.enabled = Boolean(this.options.shadowMap && profile.shadowEnabled);
    this.renderer.shadowMap.needsUpdate = true;

    if (this.particleSystem && typeof this.particleSystem.setQualityScale === 'function') {
      this.particleSystem.setQualityScale(profile.particleScale);
    }
  }

  getStats() {
    if (!this.renderer) {
      return { drawCalls: 0, triangles: 0, geometries: 0, textures: 0, quality: this.currentProfile };
    }
    const info = this.renderer.info;
    return {
      drawCalls: info?.render?.calls ?? 0,
      triangles: info?.render?.triangles ?? 0,
      geometries: info?.memory?.geometries ?? 0,
      textures: info?.memory?.textures ?? 0,
      quality: this.currentProfile
    };
  }

  render(scene, camera) {
    if (this.isPaused || this.disposed || !this.renderer) return;
    if (!scene.environment && this.options.environmentIntensity > 0) {
      this.environment ??= createStudioEnvironment(this.renderer);
      scene.environment = this.environment.texture;
      scene.environmentIntensity = this.options.environmentIntensity;
    }
    this.renderer.render(scene, camera);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener('resize', this._onResize);
    this.environment?.dispose();
    this.environment = null;
    if (this.renderer) {
      try {
        this.renderer.dispose();
        if (typeof this.renderer.forceContextLoss === 'function') {
          this.renderer.forceContextLoss();
        }
      } catch (e) {}
      this.renderer = null;
    }
  }
}
