/**
 * Quality detection (Cinema / Equilibrada / Leve), dynamic resolution scaling,
 * software-WebGL pacing (afterDraw fence), and unified post-processing composer.
 *
 * Render pipeline on GPU (Cinema / Equilibrada):
 *   1. WebGLRenderer (native antialias off when composer handles MSAA)
 *   2. EffectComposer with HalfFloat WebGLRenderTarget + MSAA (4x Cinema, 2x Equilibrada)
 *   3. RenderPass
 *   4. UnrealBloomPass (restrained threshold 0.90)
 *   5. Single unified FinalGradePass: ACES Filmic + sRGB + lift/gain/sat/contrast + vignette + film grain (+ subtle CA in Cinema)
 *
 * Render pipeline on Leve / software WebGL:
 *   Direct renderer.render(scene, camera) with ACESFilmicToneMapping + SRGBColorSpace,
 *   pixelRatio capped at 1, shadows disabled, and afterDraw() GPU fence sync pacing.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export type QualityLevel = 'cinema' | 'equilibrada' | 'leve';
export type QualitySetting = 'auto' | QualityLevel;

export interface QualityProbeResult {
  detected: QualityLevel;
  isSoftwareGl: boolean;
  gpuString: string;
}

export interface QualityProfile {
  level: QualityLevel;
  msaaSamples: number;
  useComposer: boolean;
  useShadows: boolean;
  shadowMapSize: number;
  pixelBudget: number;
  maxPixelRatio: number;
  chromaticAberration: number;
  bloomStrength: number;
}

export const QUALITY_PROFILES: Record<QualityLevel, QualityProfile> = {
  cinema: {
    level: 'cinema',
    msaaSamples: 4,
    useComposer: true,
    useShadows: true,
    shadowMapSize: 2048,
    pixelBudget: 3_600_000,
    maxPixelRatio: 2.0,
    chromaticAberration: 0.0014,
    bloomStrength: 0.28,
  },
  equilibrada: {
    level: 'equilibrada',
    msaaSamples: 2,
    useComposer: true,
    useShadows: true,
    shadowMapSize: 1024,
    pixelBudget: 1_150_000,
    maxPixelRatio: 1.5,
    chromaticAberration: 0.0,
    bloomStrength: 0.22,
  },
  leve: {
    level: 'leve',
    msaaSamples: 0,
    useComposer: false,
    useShadows: false,
    shadowMapSize: 512,
    pixelBudget: 550_000,
    maxPixelRatio: 1.0,
    chromaticAberration: 0.0,
    bloomStrength: 0.0,
  },
};

export function detectQuality(): QualityProbeResult {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) {
      return { detected: 'leve', isSoftwareGl: true, gpuString: 'Unavailable' };
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || 'Unknown');
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftware = /SwiftShader|llvmpipe|softpipe|Software|Basic Render|Microsoft Basic/i.test(
      gpu
    );
    if (isSoftware) {
      return { detected: 'leve', isSoftwareGl: true, gpuString: gpu };
    }
    const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
    const isIntegrated = /Intel|Mali|Adreno|Apple GPU|PowerVR/i.test(gpu);
    if (isMobile || isIntegrated) {
      return { detected: 'equilibrada', isSoftwareGl: false, gpuString: gpu };
    }
    return { detected: 'cinema', isSoftwareGl: false, gpuString: gpu };
  } catch {
    return { detected: 'leve', isSoftwareGl: true, gpuString: 'Fallback' };
  }
}

export interface GradeUniformValues {
  exposure: number;
  saturation: number;
  contrast: number;
  vignette: number;
  lift: [number, number, number];
  gain: [number, number, number];
}

const FinalGradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uExposure: { value: 1.08 },
    uSaturation: { value: 1.08 },
    uContrast: { value: 1.04 },
    uVignette: { value: 0.28 },
    uGrain: { value: 0.016 },
    uCA: { value: 0.0 },
    uTime: { value: 0.0 },
    uLift: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
    uGain: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uExposure;
    uniform float uSaturation;
    uniform float uContrast;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uCA;
    uniform float uTime;
    uniform vec3 uLift;
    uniform vec3 uGain;
    varying vec2 vUv;

    vec3 acesFilm(vec3 x) {
      const float a = 2.51;
      const float b = 0.03;
      const float c = 2.43;
      const float d = 0.59;
      const float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec2 centered = vUv - 0.5;
      float dist = length(centered);

      vec3 col;
      if (uCA > 0.0001) {
        vec2 offset = centered * uCA * dist;
        col.r = texture2D(tDiffuse, vUv - offset).r;
        col.g = texture2D(tDiffuse, vUv).g;
        col.b = texture2D(tDiffuse, vUv + offset).b;
      } else {
        col = texture2D(tDiffuse, vUv).rgb;
      }

      col = max(col, vec3(0.0)) * uExposure;
      col = acesFilm(col);

      // Lift & gain grading
      col = col * uGain + uLift;

      // Contrast around mid-grey
      col = (col - 0.5) * uContrast + 0.5;

      // Saturation
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, uSaturation);

      // Subtle vignette
      float vig = smoothstep(0.96, 0.28, dist);
      col *= mix(1.0 - uVignette, 1.0, vig);

      // Linear -> sRGB
      col = clamp(col, 0.0, 1.0);
      col = pow(col, vec3(1.0 / 2.2));

      // Subtle film grain
      float n = (hash12(vUv * 512.0 + fract(uTime * 17.13)) - 0.5) * uGrain;
      col = clamp(col + n, 0.0, 1.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class RenderPipeline {
  readonly renderer: THREE.WebGLRenderer;
  readonly isSoftwareGl: boolean;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private gradePass: ShaderPass | null = null;
  private renderTarget: THREE.WebGLRenderTarget | null = null;
  private profile: QualityProfile;
  private adaptiveScale = 1.0;
  private width = 1280;
  private height = 720;
  private smoothedFrameMs = 16.6;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    initialLevel: QualityLevel,
    isSoftwareGl: boolean
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.isSoftwareGl = isSoftwareGl;
    this.profile = QUALITY_PROFILES[isSoftwareGl ? 'leve' : initialLevel];
    this.rebuild(this.width, this.height);
  }

  getProfile(): QualityProfile {
    return this.profile;
  }

  getAdaptiveScale(): number {
    return this.adaptiveScale;
  }

  setQuality(level: QualityLevel) {
    // On software WebGL, always stay on lightweight direct path so screenshots/UI stay fast
    const effective: QualityLevel = this.isSoftwareGl ? 'leve' : level;
    if (this.profile.level === effective && (this.composer !== null) === this.profile.useComposer) {
      return;
    }
    this.profile = QUALITY_PROFILES[effective];
    this.adaptiveScale = 1.0;
    this.rebuild(this.width, this.height);
  }

  private computePixelRatio(width: number, height: number): number {
    if (this.isSoftwareGl) return 1.0;
    const dpr = Math.min(window.devicePixelRatio || 1, this.profile.maxPixelRatio);
    const area = Math.max(1, width * height);
    const budgetRatio = Math.sqrt(this.profile.pixelBudget / area);
    return Math.max(0.65, Math.min(dpr, budgetRatio) * this.adaptiveScale);
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    const pr = this.computePixelRatio(this.width, this.height);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    if (this.composer) {
      this.composer.setPixelRatio(pr);
      this.composer.setSize(this.width, this.height);
    }
    if (this.bloomPass) {
      this.bloomPass.resolution.set(
        Math.max(1, Math.floor(this.width * pr * 0.5)),
        Math.max(1, Math.floor(this.height * pr * 0.5))
      );
    }
  }

  private disposeComposer() {
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }
    if (this.renderTarget) {
      this.renderTarget.dispose();
      this.renderTarget = null;
    }
    this.bloomPass = null;
    this.gradePass = null;
  }

  private rebuild(width: number, height: number) {
    this.disposeComposer();
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));

    this.renderer.shadowMap.enabled = this.profile.useShadows && !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;

    const pr = this.computePixelRatio(this.width, this.height);
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(this.width, this.height, false);

    if (this.profile.useComposer && !this.isSoftwareGl) {
      // Tone mapping happens inside FinalGradeShader (single pass, no double tonemap)
      this.renderer.toneMapping = THREE.NoToneMapping;
      const rtW = Math.max(1, Math.floor(this.width * pr));
      const rtH = Math.max(1, Math.floor(this.height * pr));
      this.renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
        type: THREE.HalfFloatType,
        samples: this.profile.msaaSamples,
      });
      this.composer = new EffectComposer(this.renderer, this.renderTarget);
      this.composer.setPixelRatio(pr);
      this.composer.setSize(this.width, this.height);

      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);

      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(Math.max(1, Math.floor(rtW * 0.5)), Math.max(1, Math.floor(rtH * 0.5))),
        this.profile.bloomStrength,
        0.42,
        0.9
      );
      this.composer.addPass(this.bloomPass);

      this.gradePass = new ShaderPass(FinalGradeShader);
      this.gradePass.uniforms.uCA.value = this.profile.chromaticAberration;
      this.composer.addPass(this.gradePass);
    } else {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.08;
    }
  }

  updateGrading(values: GradeUniformValues, elapsed: number) {
    if (this.gradePass) {
      const u = this.gradePass.uniforms;
      u.uExposure.value = values.exposure;
      u.uSaturation.value = values.saturation;
      u.uContrast.value = values.contrast;
      u.uVignette.value = values.vignette;
      u.uTime.value = elapsed;
      u.uLift.value.set(values.lift[0], values.lift[1], values.lift[2]);
      u.uGain.value.set(values.gain[0], values.gain[1], values.gain[2]);
    } else {
      this.renderer.toneMappingExposure = values.exposure;
    }
  }

  /** Dynamic resolution adjustment: drops 10% above 24ms, slowly recovers below 17ms */
  recordFrameMs(ms: number) {
    if (this.isSoftwareGl) return;
    this.smoothedFrameMs = this.smoothedFrameMs * 0.92 + ms * 0.08;
    if (this.smoothedFrameMs > 24 && this.adaptiveScale > 0.72) {
      this.adaptiveScale = Math.max(0.7, this.adaptiveScale * 0.9);
      this.resize(this.width, this.height);
    } else if (this.smoothedFrameMs < 17 && this.adaptiveScale < 1.0) {
      this.adaptiveScale = Math.min(1.0, this.adaptiveScale + 0.015);
      this.resize(this.width, this.height);
    }
  }

  render() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    this.disposeComposer();
  }
}

/**
 * Software-WebGL fence pacing from threejs skill §2.3:
 * Waits for CPU rasterization to finish, then pauses 80ms so the main thread
 * and headless browser snapshots never starve.
 */
export function scheduleAfterSoftwareDraw(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  onTimerId: (id: number) => void
) {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  if (typeof gl.fenceSync === 'function') {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
      if (state === gl.UNSIGNALED) {
        onTimerId(window.setTimeout(poll, 6));
      } else {
        if (sync) gl.deleteSync(sync);
        onTimerId(window.setTimeout(cb, 80));
      }
    };
    onTimerId(window.setTimeout(poll, 6));
  } else {
    onTimerId(window.setTimeout(cb, 90));
  }
}
