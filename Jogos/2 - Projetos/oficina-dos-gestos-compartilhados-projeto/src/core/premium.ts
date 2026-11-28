import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { QualityPreset } from '../types';

/**
 * Pipeline de render premium: reflexos de ambiente (PMREM), bloom suave
 * e gradação de cor quente com vinheta. Todo valor do shader final é
 * fixado com clamp para evitar NaN em amostras MSAA de borda.
 */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uVignette: { value: 0.32 },
    uGrain: { value: 0.022 },
    uAspect: { value: 1 }
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
    uniform float uTime;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uAspect;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 col = clamp(texture2D(tDiffuse, vUv).rgb, 0.0, 1.0);
      float luma = clamp(dot(col, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
      // Split-tone: sombras levemente frias, luzes cor de mel.
      vec3 shadowTint = vec3(0.93, 0.97, 1.04);
      vec3 lightTint = vec3(1.05, 1.0, 0.92);
      col *= mix(shadowTint, lightTint, smoothstep(0.15, 0.85, luma));
      // Contraste suave em curva S (sem pow em valores negativos).
      col = clamp(col, 0.0, 1.0);
      col = mix(col, col * col * (3.0 - 2.0 * col), 0.28);
      // Vinheta.
      vec2 d = (vUv - 0.5) * vec2(uAspect, 1.0);
      float vig = 1.0 - uVignette * smoothstep(0.35, 1.05, length(d));
      col *= clamp(vig, 0.0, 1.0);
      // Grão de papel muito leve.
      float g = hash(vUv * 917.0 + fract(uTime) * 31.0) - 0.5;
      col += g * uGrain;
      col = clamp(col, 0.0, 1.0);
      gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
    }
  `
};

export interface PremiumPipeline {
  render: (t: number) => void;
  setSize: (w: number, h: number, dpr: number) => void;
  setQuality: (q: QualityPreset) => void;
  dispose: () => void;
}

export function createPremiumPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): PremiumPipeline {
  // Reflexos de estúdio para os materiais PBR (verniz, cerâmica, metal dos sinos).
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();
  // O ateliê já tem luz hemisférica; o ambiente serve só para reflexos sutis.
  scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[] | undefined;
    (Array.isArray(m) ? m : m ? [m] : []).forEach((mat) => {
      if ('envMapIntensity' in mat) {
        mat.envMapIntensity = mat.metalness > 0.5 ? 0.9 : mat.roughness < 0.45 ? 0.45 : 0.22;
        mat.needsUpdate = true;
      }
    });
  });

  const isWebGL2 = renderer.capabilities.isWebGL2;
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const rtParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
  const target = isWebGL2
    ? new THREE.WebGLMultisampleRenderTarget(size.x, size.y, rtParams)
    : new THREE.WebGLRenderTarget(size.x, size.y, rtParams);

  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.22, 0.55, 0.86);
  composer.addPass(bloom);
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  let enabled = true;

  return {
    render(t) {
      if (!enabled) {
        renderer.render(scene, camera);
        return;
      }
      grade.uniforms.uTime.value = t;
      composer.render();
    },
    setSize(w, h, dpr) {
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      grade.uniforms.uAspect.value = w / Math.max(1, h);
    },
    setQuality(q) {
      enabled = q !== 'leve';
      bloom.enabled = q === 'cinema' || q === 'equilibrada';
      bloom.strength = q === 'cinema' ? 0.3 : 0.2;
    },
    dispose() {
      envRT.dispose();
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
    }
  };
}

/** Partículas de gesto: respingos de pigmento, poeira de argila, grãos de areia, notas. */
export class GestureVfx {
  private readonly points: THREE.Points;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly col: Float32Array;
  private readonly life: Float32Array;
  private cursor = 0;
  private readonly max = 420;
  private readonly rings: Array<{ mesh: THREE.Mesh; age: number }> = [];

  constructor(private readonly scene: THREE.Scene) {
    this.pos = new Float32Array(this.max * 3).fill(-999);
    this.vel = new Float32Array(this.max * 3);
    this.col = new Float32Array(this.max * 3);
    this.life = new Float32Array(this.max);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const sprite = makeSoftDot();
    const mat = new THREE.PointsMaterial({
      size: 0.035,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    scene.add(this.points);
  }

  burst(at: THREE.Vector3, color: string | number, count = 8, spread = 0.6, lift = 0.9): void {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const k = this.cursor;
      this.cursor = (this.cursor + 1) % this.max;
      this.pos[k * 3] = at.x + (Math.random() - 0.5) * 0.03;
      this.pos[k * 3 + 1] = at.y + 0.01;
      this.pos[k * 3 + 2] = at.z + (Math.random() - 0.5) * 0.03;
      const a = Math.random() * Math.PI * 2;
      const s = (0.3 + Math.random() * 0.7) * spread;
      this.vel[k * 3] = Math.cos(a) * s;
      this.vel[k * 3 + 1] = (0.4 + Math.random()) * lift;
      this.vel[k * 3 + 2] = Math.sin(a) * s;
      const v = 0.85 + Math.random() * 0.3;
      this.col[k * 3] = c.r * v;
      this.col[k * 3 + 1] = c.g * v;
      this.col[k * 3 + 2] = c.b * v;
      this.life[k] = 0.7 + Math.random() * 0.5;
    }
  }

  ring(at: THREE.Vector3, normal: THREE.Vector3, color: string | number, radius = 0.12): void {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.82, radius, 40),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })
    );
    mesh.position.copy(at).addScaledVector(normal, 0.01);
    mesh.lookAt(at.clone().add(normal));
    this.scene.add(mesh);
    this.rings.push({ mesh, age: 0 });
  }

  update(dt: number): void {
    const step = Math.min(0.05, Math.max(0, dt));
    for (let k = 0; k < this.max; k++) {
      if (this.life[k] <= 0) continue;
      this.life[k] -= step;
      if (this.life[k] <= 0) {
        this.pos[k * 3 + 1] = -999;
        continue;
      }
      this.vel[k * 3 + 1] -= 2.4 * step;
      this.pos[k * 3] += this.vel[k * 3] * step;
      this.pos[k * 3 + 1] += this.vel[k * 3 + 1] * step;
      this.pos[k * 3 + 2] += this.vel[k * 3 + 2] * step;
    }
    const geo = this.points.geometry;
    (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.age += step;
      const s = 1 + r.age * 4.5;
      r.mesh.scale.setScalar(s);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - r.age * 1.4);
      if (r.age > 0.6) {
        this.scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
        this.rings.splice(i, 1);
      }
    }
  }

  dispose(): void {
    this.scene.remove(this.points);
    this.points.geometry.dispose();
    (this.points.material as THREE.PointsMaterial).map?.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}

function makeSoftDot(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.75)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}
