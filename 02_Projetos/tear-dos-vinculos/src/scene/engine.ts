// Renderizador, pipeline de pós (Cinema/Equilibrada/Leve/Automática) e escala adaptativa.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { QualityId } from '../game/state.ts';

export type Tier = 'cinema' | 'equilibrada' | 'leve';

/** Orçamento de pixels por tier (megapixels). */
export const PIXEL_BUDGET: Record<Tier, number> = { cinema: 3.6, equilibrada: 1.15, leve: 0.55 };

export interface FrameStats {
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  frameMs: number;
  p50: number;
  p95: number;
  scale: number;
  tier: Tier;
  width: number;
  height: number;
}

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  tier: Tier = 'equilibrada';
  quality: QualityId = 'auto';
  private composer: EffectComposer | null = null;
  gtao: GTAOPass | null = null;
  private bloom: UnrealBloomPass | null = null;
  /** fator multiplicativo aplicado ao orçamento de pixels (adaptativo) */
  scale = 1;
  private frameTimes: number[] = [];
  private slowAccum = 0;
  private fastAccum = 0;
  private lastStats: FrameStats | null = null;
  contextLost = false;
  onContextLost: (() => void) | null = null;
  onContextRestored: (() => void) | null = null;

  constructor(host: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'scene-canvas';
    this.canvas.setAttribute('aria-label', 'Cena 3D do tear');
    this.canvas.tabIndex = -1;
    host.appendChild(this.canvas);
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      stencil: false,
    });
    if (!renderer.capabilities.isWebGL2) throw new Error('WebGL 2 indisponível.');
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.localClippingEnabled = true;
    renderer.info.autoReset = false;
    this.renderer = renderer;
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.contextLost = true;
      this.onContextLost?.();
    });
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.onContextRestored?.();
    });
  }

  attach(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    this.scene = scene;
    this.camera = camera;
    this.applyTier(this.detectTier());
  }

  /** Detecta capacidade medindo limites do contexto e tamanho de tela, não só o nome da GPU. */
  detectTier(): Tier {
    if (this.quality !== 'auto') return this.quality;
    const gl = this.renderer.getContext();
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '') : '';
    const isSoftware = /(SwiftShader|llvmpipe|Software Rasterizer)/i.test(gpuStr);
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const small = Math.min(innerWidth, innerHeight) < 500;
    if (isSoftware || maxTex < 8192 || mem <= 2 || cores <= 2) return 'leve';
    if (coarse || small || mem <= 4) return 'equilibrada';
    return cores >= 8 ? 'cinema' : 'equilibrada';
  }

  setQuality(q: QualityId): void {
    this.quality = q;
    this.scale = 1;
    this.frameTimes = [];
    this.applyTier(this.detectTier());
  }

  private applyTier(tier: Tier): void {
    this.tier = tier;
    this.disposeComposer();
    const r = this.renderer;
    const shadowSize = tier === 'cinema' ? 2048 : tier === 'equilibrada' ? 1536 : 1024;
    this.scene.traverse((o) => {
      const l = o as THREE.DirectionalLight;
      if (l.isDirectionalLight && l.castShadow) {
        l.shadow.mapSize.set(shadowSize, shadowSize);
        l.shadow.map?.dispose();
        (l.shadow as { map: THREE.WebGLRenderTarget | null }).map = null;
      }
    });
    r.shadowMap.type = tier === 'leve' ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    if (tier !== 'leve') {
      const size = this.drawSize();
      const target = new THREE.WebGLRenderTarget(size.w, size.h, {
        type: THREE.HalfFloatType,
        samples: tier === 'cinema' ? 4 : 2,
      });
      const composer = new EffectComposer(r, target);
      composer.addPass(new RenderPass(this.scene, this.camera));
      if (tier === 'cinema') {
        const gtao = new GTAOPass(this.scene, this.camera, size.w, size.h);
        gtao.output = GTAOPass.OUTPUT.Default;
        gtao.blendIntensity = 0.85;
        gtao.updateGtaoMaterial({ radius: 0.18, distanceExponent: 1.4, thickness: 1.2, scale: 1, samples: 12 });
        gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
        composer.addPass(gtao);
        this.gtao = gtao;
      }
      const bloom = new UnrealBloomPass(new THREE.Vector2(size.w, size.h), 0.16, 0.5, 0.92);
      composer.addPass(bloom);
      this.bloom = bloom;
      composer.addPass(new OutputPass());
      this.composer = composer;
    }
    this.resize();
    r.shadowMap.needsUpdate = true;
  }

  private disposeComposer(): void {
    if (!this.composer) return;
    this.composer.renderTarget1.dispose();
    this.composer.renderTarget2.dispose();
    for (const p of this.composer.passes) (p as { dispose?: () => void }).dispose?.();
    this.composer = null;
    this.gtao = null;
    this.bloom = null;
  }

  /** Tamanho de desenho respeitando orçamento de pixels e DPR. */
  drawSize(): { w: number; h: number; dpr: number } {
    const cw = Math.max(1, this.canvas.clientWidth || innerWidth);
    const ch = Math.max(1, this.canvas.clientHeight || innerHeight);
    const coarse = matchMedia('(pointer: coarse)').matches;
    const dprCap = coarse ? 1.5 : 2;
    let dpr = Math.min(devicePixelRatio || 1, dprCap);
    const budget = PIXEL_BUDGET[this.tier] * 1e6 * this.scale;
    const px = cw * ch * dpr * dpr;
    if (px > budget) dpr *= Math.sqrt(budget / px);
    dpr = Math.max(0.35, dpr);
    return { w: Math.round(cw * dpr), h: Math.round(ch * dpr), dpr };
  }

  resize(): void {
    if (!this.camera) return;
    const cw = Math.max(1, this.canvas.clientWidth || innerWidth);
    const ch = Math.max(1, this.canvas.clientHeight || innerHeight);
    const { dpr, w, h } = this.drawSize();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(cw, ch, false);
    this.camera.aspect = cw / ch;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(1);
      this.composer.setSize(w, h);
    }
  }

  setBloom(on: boolean): void {
    if (this.bloom) this.bloom.enabled = on;
  }

  invalidateShadows(): void {
    this.renderer.shadowMap.needsUpdate = true;
  }

  render(frameMs: number): void {
    if (this.contextLost) return;
    const r = this.renderer;
    r.info.reset();
    if (this.composer) this.composer.render();
    else r.render(this.scene, this.camera);
    this.track(frameMs);
  }

  /** Escala adaptativa: reduz após custo sustentado > 24 ms; sobe devagar abaixo de 17 ms (histerese). */
  private track(frameMs: number): void {
    if (!(frameMs > 0) || frameMs > 250) return;
    this.frameTimes.push(frameMs);
    if (this.frameTimes.length > 120) this.frameTimes.shift();
    if (this.quality !== 'auto') return;
    if (frameMs > 24) { this.slowAccum += frameMs; this.fastAccum = 0; }
    else if (frameMs < 17) { this.fastAccum += frameMs; this.slowAccum = Math.max(0, this.slowAccum - frameMs * 0.5); }
    if (this.slowAccum > 1500) {
      this.slowAccum = 0;
      if (this.scale > 0.55) { this.scale = Math.max(0.5, this.scale * 0.85); this.resize(); }
      else if (this.tier !== 'leve') { this.scale = 1; this.applyTier(this.tier === 'cinema' ? 'equilibrada' : 'leve'); }
    } else if (this.fastAccum > 6000) {
      this.fastAccum = 0;
      if (this.scale < 1) { this.scale = Math.min(1, this.scale * 1.08); this.resize(); }
    }
  }

  stats(): FrameStats {
    const info = this.renderer.info;
    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const pick = (q: number) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] : 0;
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.lastStats = {
      calls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      frameMs: this.frameTimes[this.frameTimes.length - 1] ?? 0,
      p50: pick(0.5),
      p95: pick(0.95),
      scale: this.scale,
      tier: this.tier,
      width: size.x,
      height: size.y,
    };
    return this.lastStats;
  }

  /** Captura PNG da composição atual. */
  capture(): string {
    if (this.composer) this.composer.render(); else this.renderer.render(this.scene, this.camera);
    return this.canvas.toDataURL('image/png');
  }

  dispose(): void {
    this.disposeComposer();
    this.renderer.dispose();
    this.canvas.remove();
  }
}
