import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

/**
 * Motor de renderização compartilhado pelas cenas realistas.
 * Pipeline: cena HDR (MSAA, half-float) → oclusão de ambiente (GTAO, só no modo Cinema) → bloom →
 * pass final único (tone mapping ACES + sRGB + gradação de cor + vinheta + aberração + grão de filme).
 * Resolução dinâmica (como nos consoles): o motor ajusta a resolução interna para manter a fluidez.
 */

export type Quality = 'alta' | 'media' | 'baixa';

export function detectQuality(): Quality {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'baixa';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu)) return 'baixa';
    const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || Math.min(screen.width, screen.height) < 700;
    if (mobile) return 'media';
    if (/Intel|UHD|Iris|Mali|Adreno|PowerVR|Apple GPU/i.test(gpu) && !/Arc/i.test(gpu)) return 'media';
    return 'alta';
  } catch {
    return 'media';
  }
}

/** GTAO que ignora também malhas marcadas com userData.noAO (luz volumétrica, chamas, fumaça). */
class SelectiveGTAOPass extends GTAOPass {
  /** AO calculada em meia resolução (4x mais barata) e combinada em resolução cheia. */
  setSize(width: number, height: number) {
    super.setSize(Math.max(1, Math.round(width / 2)), Math.max(1, Math.round(height / 2)));
  }

  _overrideVisibility() {
    const self = this as unknown as { scene: THREE.Scene; _visibilityCache: THREE.Object3D[] };
    const cache = self._visibilityCache;
    self.scene.traverse((o) => {
      const anyO = o as THREE.Object3D & { isPoints?: boolean; isLine?: boolean };
      if (o.visible && (anyO.isPoints || anyO.isLine || o.userData.noAO)) {
        o.visible = false;
        cache.push(o);
      }
    });
  }
}

/** Pass final único: tone mapping + sRGB + "look" cinematográfico. */
class FinalPass extends Pass {
  readonly uniforms = {
    tDiffuse: { value: null as THREE.Texture | null },
    toneMappingExposure: { value: 1 },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uVignette: { value: 0.38 },
    uGrain: { value: 0.03 },
    uCA: { value: 0.0022 },
    uSat: { value: 1.05 },
    uContrast: { value: 1.04 },
    uLift: { value: new THREE.Vector3(0, 0, 0) },
    uGain: { value: new THREE.Vector3(1, 1, 1) },
  };
  private material: THREE.RawShaderMaterial;
  private quad: FullScreenQuad;

  constructor(chromatic: boolean) {
    super();
    this.material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      defines: chromatic ? { USE_CA: '' } : {},
      vertexShader: /* glsl */ `
        precision highp float;
        uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
        attribute vec3 position; attribute vec2 uv; varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform float uTime, uVignette, uGrain, uCA, uSat, uContrast;
        uniform vec2 uRes;
        uniform vec3 uLift, uGain;
        varying vec2 vUv;
        #include <tonemapping_pars_fragment>
        #include <colorspace_pars_fragment>
        float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){
          vec2 d = vUv - 0.5;
          #ifdef USE_CA
            vec2 off = d * uCA * (0.4 + dot(d, d) * 3.0);
            vec3 hdr = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
          #else
            vec3 hdr = texture2D(tDiffuse, vUv).rgb;
          #endif
          vec3 col = ACESFilmicToneMapping(hdr);
          col = sRGBTransferOETF(vec4(col, 1.0)).rgb;
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          col = mix(vec3(l), col, uSat);
          col = (col - 0.5) * uContrast + 0.5;
          col = col * uGain + uLift * (1.0 - col);
          float vig = smoothstep(0.95, 0.25, length(d * vec2(1.0, 0.85)) * 1.25);
          col *= mix(1.0, vig, uVignette);
          float g = rand(vUv * uRes + fract(uTime * 7.31) * 91.7) - 0.5;
          col += g * uGrain * (1.0 - l * 0.6);
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
      `,
    });
    this.quad = new FullScreenQuad(this.material);
  }

  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.toneMappingExposure.value = renderer.toneMappingExposure;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.quad.dispose();
  }
}

export interface View {
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface EngineOptions {
  quality: Quality;
  fov?: number;
  near?: number;
  far?: number;
  exposure?: number;
  bloom?: { strength: number; radius: number; threshold: number };
  ao?: { radius: number; intensity?: number };
}

export type UpdateFn = (dt: number, time: number) => void;

const PIXEL_BUDGET: Record<Quality, number> = { alta: 3.6e6, media: 1.15e6, baixa: 0.55e6 };

export class Engine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  readonly composer: EffectComposer;
  readonly bloom: UnrealBloomPass;
  readonly grade: FinalPass;
  readonly gtao: SelectiveGTAOPass | null = null;
  readonly quality: Quality;
  readonly aniso: number;
  readonly texSize: number;
  /** Sombras recalculadas a cada quadro (apenas no modo Cinema); nos demais, sob demanda. */
  readonly dynamicShadows: boolean;
  private container: HTMLElement;
  private updates: UpdateFn[] = [];
  private frame = 0;
  private lastFrameTime = 0;
  private paused = false;
  sceneRenderInfo = { calls: 0, triangles: 0 };
  private elapsed = 0;
  private running = false;
  private visible = true;
  private io: IntersectionObserver;
  private ro: ResizeObserver;
  private pixelRatio = 1;
  private resScale = 1;
  private frameAvg = 1 / 60;
  private settle = 0;
  private tween: { fromP: THREE.Vector3; toP: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3; t: number; dur: number } | null = null;
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private onVis = () => {
    this.lastFrameTime = performance.now();
  };

  constructor(container: HTMLElement, o: EngineOptions) {
    this.container = container;
    this.quality = o.quality;
    // sombras sob demanda em todas as qualidades: as cenas pedem atualização quando algo se move
    this.dynamicShadows = false;
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', stencil: false });
    this.pixelRatio = this.targetPixelRatio(w, h);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = o.exposure ?? 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = this.dynamicShadows;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    container.appendChild(this.renderer.domElement);

    this.aniso = Math.min(this.renderer.capabilities.getMaxAnisotropy(), o.quality === 'baixa' ? 2 : o.quality === 'media' ? 4 : 8);
    this.texSize = o.quality === 'alta' ? 1024 : 512;

    this.camera = new THREE.PerspectiveCamera(o.fov ?? 45, w / h, o.near ?? 0.05, o.far ?? 200);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.rotateSpeed = 0.55;
    this.controls.zoomSpeed = 0.7;
    this.controls.addEventListener('start', () => {
      this.tween = null;
    });

    const rt = new THREE.WebGLRenderTarget(w * this.pixelRatio, h * this.pixelRatio, {
      type: THREE.HalfFloatType,
      samples: o.quality === 'alta' ? 4 : o.quality === 'media' ? 2 : 0,
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.setPixelRatio(this.pixelRatio);
    this.composer.setSize(w, h);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const scenePass = this.composer.passes[0];
    const renderScene = scenePass.render.bind(scenePass);
    scenePass.render = (...args: Parameters<typeof renderScene>) => {
      renderScene(...args);
      this.sceneRenderInfo = { calls: this.renderer.info.render.calls, triangles: this.renderer.info.render.triangles };
    };

    if (o.quality === 'alta' && o.ao) {
      const pass = new SelectiveGTAOPass(this.scene, this.camera, w, h);
      pass.updateGtaoMaterial({
        radius: o.ao.radius,
        distanceExponent: 1.4,
        thickness: 1,
        scale: 1,
        samples: 16,
        distanceFallOff: 1,
        screenSpaceRadius: false,
      });
      pass.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
      pass.blendIntensity = o.ao.intensity ?? 1;
      this.composer.addPass(pass);
      (this as { gtao: SelectiveGTAOPass | null }).gtao = pass;
    }

    const b = o.bloom ?? { strength: 0.6, radius: 0.6, threshold: 0.85 };
    this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), b.strength, b.radius, b.threshold);
    this.composer.addPass(this.bloom);
    this.grade = new FinalPass(o.quality === 'alta');
    this.composer.addPass(this.grade);
    if (o.quality === 'baixa') this.grade.uniforms.uGrain.value = 0.02;

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.io = new IntersectionObserver((entries) => {
      this.visible = entries.some((e) => e.isIntersecting);
    });
    this.io.observe(container);
    document.addEventListener('visibilitychange', this.onVis);
    this.resize();
  }

  private targetPixelRatio(w: number, h: number) {
    const maxPR = Math.min(window.devicePixelRatio || 1, this.quality === 'alta' ? 2 : 1.25);
    const budget = Math.sqrt(PIXEL_BUDGET[this.quality] / Math.max(1, w * h));
    return THREE.MathUtils.clamp(Math.min(maxPR, budget) * this.resScale, 0.5, maxPR);
  }

  /** Sombras direcionais suaves, com mapa ajustado à qualidade. */
  configureShadow(light: THREE.DirectionalLight | THREE.SpotLight | THREE.PointLight, size: number, radius = 3) {
    light.castShadow = true;
    const s = this.quality === 'alta' ? size : this.quality === 'media' ? Math.min(size, 2048) : Math.min(size, 1024);
    light.shadow.mapSize.set(s, s);
    light.shadow.radius = radius;
  }

  /** Pede o recálculo das sombras no próximo quadro (modo sob demanda). */
  refreshShadows() {
    this.renderer.shadowMap.needsUpdate = true;
  }

  /** Gera um mapa de ambiente (reflexos) a partir de uma cena auxiliar. */
  envFrom(envScene: THREE.Scene, sigma = 0.04): THREE.Texture {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const tex = pmrem.fromScene(envScene, sigma).texture;
    pmrem.dispose();
    return tex;
  }

  onUpdate(fn: UpdateFn) {
    this.updates.push(fn);
    return () => {
      this.updates = this.updates.filter((f) => f !== fn);
    };
  }

  setView(v: View, animate = true) {
    const toP = new THREE.Vector3(...v.position);
    const toT = new THREE.Vector3(...v.target);
    if (!animate) {
      this.camera.position.copy(toP);
      this.controls.target.copy(toT);
      this.controls.update();
      this.tween = null;
      return;
    }
    this.tween = { fromP: this.camera.position.clone(), toP, fromT: this.controls.target.clone(), toT, t: 0, dur: 2.2 };
  }

  /** Raycast a partir de coordenadas de tela. */
  pick(clientX: number, clientY: number, objects: THREE.Object3D[], recursive = true) {
    this.ray(clientX, clientY);
    return this.raycaster.intersectObjects(objects, recursive);
  }

  ray(clientX: number, clientY: number) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    return this.raycaster.ray;
  }

  async start() {
    try {
      await this.renderer.compileAsync(this.scene, this.camera);
    } catch {
      /* compilação assíncrona é apenas uma otimização */
    }
    this.running = true;
    this.lastFrameTime = performance.now();
    this.settle = 45;
    const loop = () => {
      if (!this.running) return;
      this.frame = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;
      if (!this.visible || document.hidden || this.paused) return;
      this.elapsed += dt;
      this.adapt(dt);
      if (this.tween) {
        const tw = this.tween;
        tw.t = Math.min(1, tw.t + dt / tw.dur);
        const k = tw.t < 0.5 ? 4 * tw.t * tw.t * tw.t : 1 - Math.pow(-2 * tw.t + 2, 3) / 2;
        this.camera.position.lerpVectors(tw.fromP, tw.toP, k);
        this.controls.target.lerpVectors(tw.fromT, tw.toT, k);
        if (tw.t >= 1) this.tween = null;
      }
      this.controls.update();
      for (const fn of this.updates) fn(dt, this.elapsed);
      this.grade.uniforms.uTime.value = this.elapsed;
      this.composer.render(dt);
    };
    loop();
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  /** Resolução dinâmica: reduz/eleva a resolução interna para manter ~50–60 fps. */
  private adapt(dt: number) {
    if (this.settle > 0) {
      this.settle--;
      return;
    }
    this.frameAvg += (dt - this.frameAvg) * 0.05;
    let next = this.resScale;
    if (this.frameAvg > 1 / 42) next = Math.max(0.55, this.resScale * 0.9);
    else if (this.frameAvg < 1 / 57 && this.resScale < 1) next = Math.min(1, this.resScale * 1.06);
    if (Math.abs(next - this.resScale) > 0.001) {
      this.resScale = next;
      this.settle = 40;
      this.frameAvg = 1 / 50;
      this.resize();
    }
  }

  resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    const pr = this.targetPixelRatio(w, h);
    if (Math.abs(pr - this.pixelRatio) > 0.01) {
      this.pixelRatio = pr;
      this.renderer.setPixelRatio(pr);
      this.composer.setPixelRatio(pr);
    }
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.grade.uniforms.uRes.value.set(w * this.pixelRatio, h * this.pixelRatio);
  }

  exportImage(name: string) {
    this.composer.render(0);
    const a = document.createElement('a');
    a.download = `${name}.png`;
    a.href = this.renderer.domElement.toDataURL('image/png');
    a.click();
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener('visibilitychange', this.onVis);
    this.controls.dispose();
    const textures = new Set<THREE.Texture>();
    const materials = new Set<THREE.Material>();
    const geometries = new Set<THREE.BufferGeometry>();
    const collect = (v: unknown) => {
      if (v instanceof THREE.Texture) textures.add(v);
    };
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) geometries.add(m.geometry);
      const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
      for (const mat of mats) {
        if (materials.has(mat)) continue;
        materials.add(mat);
        Object.values(mat).forEach(collect);
        const u = (mat as THREE.ShaderMaterial).uniforms;
        if (u) Object.values(u).forEach((x) => collect(x?.value));
      }
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    textures.forEach((t) => t.dispose());
    if (this.scene.environment) this.scene.environment.dispose();
    this.composer.passes.forEach(pass => pass.dispose());
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

/** Utilitário: aguarda um quadro (mantém a interface responsiva durante a geração de texturas). */
export const nextFrame = () =>
  new Promise<void>((resolve) => {
    // com a aba em segundo plano o navegador pausa requestAnimationFrame: o temporizador garante que o carregamento siga
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      resolve();
    };
    requestAnimationFrame(go);
    setTimeout(go, 60);
  });

/** Marca sombras projetadas/recebidas em toda uma hierarquia. */
export function shadows(o: THREE.Object3D, cast = true, receive = true) {
  o.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) {
      c.castShadow = cast;
      c.receiveShadow = receive;
    }
  });
  return o;
}
