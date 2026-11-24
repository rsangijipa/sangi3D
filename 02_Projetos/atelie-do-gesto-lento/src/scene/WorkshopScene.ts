import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WorkshopProps } from './WorkshopProps';
import { ClayGeometry } from '../clay/ClayGeometry';
import { CameraPreset } from '../types';

export class WorkshopScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;
  public props: WorkshopProps;
  public clayMesh: THREE.Mesh;
  public clayMaterial: THREE.MeshStandardMaterial;

  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private fillLight: THREE.DirectionalLight;

  // Camera presets
  public readonly presets: Record<string, CameraPreset> = {
    trabalho: {
      name: 'Trabalho',
      position: [0.65, 1.30, 1.25],
      target: [0, 0.99, 0]
    },
    detalhe: {
      name: 'Detalhe',
      position: [0.42, 1.05, 0.75],
      target: [0, 0.98, 0]
    },
    ambiente: {
      name: 'Ambiente',
      position: [1.55, 1.65, 2.65],
      target: [0, 1.05, -0.3]
    }
  };

  private currentView: string = 'trabalho';
  private isTransitioning: boolean = false;
  private transitionStart: number = 0;
  private transitionDuration: number = 750; // ms
  private camStartPos = new THREE.Vector3();
  private camEndPos = new THREE.Vector3();
  private camStartTarget = new THREE.Vector3();
  private camEndTarget = new THREE.Vector3();

  constructor(container: HTMLElement, clayGeo: ClayGeometry) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#d3c7b3');
    this.scene.fog = new THREE.Fog('#d3c7b3', 7.0, 16.0);

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 30.0);
    const initialPreset = this.presets.trabalho;
    this.camera.position.set(...initialPreset.position);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    container.appendChild(this.renderer.domElement);

    // OrbitControls bounded
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.set(...initialPreset.target);
    this.controls.minDistance = 0.55;
    this.controls.maxDistance = 4.2;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't dip below workbench
    this.controls.minPolarAngle = 0.2;

    // Lighting
    this.sunLight = new THREE.DirectionalLight('#ffe2b4', 3.5);
    this.sunLight.position.set(-3.0, 4.0, 2.0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.left = -2.8;
    this.sunLight.shadow.camera.right = 2.8;
    this.sunLight.shadow.camera.top = 2.8;
    this.sunLight.shadow.camera.bottom = -2.8;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 12.0;
    this.sunLight.shadow.normalBias = 0.015;
    this.sunLight.shadow.bias = -0.0001;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight('#ede5d0', '#88715c', 1.8);
    this.scene.add(this.hemiLight);

    this.fillLight = new THREE.DirectionalLight('#dbe5eb', 0.5);
    this.fillLight.position.set(2.0, 3.0, 3.0);
    this.scene.add(this.fillLight);

    // Studio Environment Props
    this.props = new WorkshopProps();
    this.scene.add(this.props.group);

    // Clay Material
    this.clayMaterial = this.createClayMaterial();
    this.clayMesh = new THREE.Mesh(clayGeo.geometry, this.clayMaterial);
    this.clayMesh.position.set(0, 0.865, 0); // Resting on turning wheel
    this.clayMesh.castShadow = true;
    this.clayMesh.receiveShadow = true;
    this.props.wheelGroup.add(this.clayMesh);

    window.addEventListener('resize', this.onResize);
  }

  private createClayMaterial(): THREE.MeshStandardMaterial {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xa95f43,
      roughness: 0.78,
      metalness: 0.0,
      bumpScale: 0.0008
    });

    // Load albedo texture from assets/04_argila_albedo.png
    const loader = new THREE.TextureLoader();
    loader.load(
      'assets/04_argila_albedo.png',
      tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 3);
        mat.map = tex;
        mat.bumpMap = tex;
        mat.color.set('#f2e8de'); // Tint texture naturally
        mat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback procedural canvas texture if png isn't loaded
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#a95f43';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 800; i++) {
          ctx.fillStyle = `rgba(80, 35, 20, ${Math.random() * 0.15})`;
          ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 3);
        mat.map = tex;
        mat.bumpMap = tex;
        mat.needsUpdate = true;
      }
    );

    // Shader hook for wetness darkening on touched regions
    mat.onBeforeCompile = shader => {
      shader.vertexShader = `
        attribute float aWetness;
        varying float vWetness;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        vWetness = aWetness;
        `
      );

      shader.fragmentShader = `
        varying float vWetness;
        ${shader.fragmentShader}
      `.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        // Wet clay is darker and richer in tone
        vec3 wetColor = vec3(0.55, 0.28, 0.18);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.72 + wetColor * 0.15, clamp(vWetness, 0.0, 1.0));
        `
      ).replace(
        '#include <roughnessmap_fragment>',
        `
        #include <roughnessmap_fragment>
        // Wet clay has lower roughness (glistening sheen)
        roughnessFactor = mix(roughnessFactor, 0.46, clamp(vWetness, 0.0, 1.0));
        `
      );
    };

    return mat;
  }

  public setCameraView(presetKey: string, instant: boolean = false): void {
    const targetPreset = this.presets[presetKey];
    if (!targetPreset) return;

    this.currentView = presetKey;
    if (instant) {
      this.camera.position.set(...targetPreset.position);
      this.controls.target.set(...targetPreset.target);
      this.controls.update();
      this.isTransitioning = false;
      return;
    }

    this.camStartPos.copy(this.camera.position);
    this.camEndPos.set(...targetPreset.position);
    this.camStartTarget.copy(this.controls.target);
    this.camEndTarget.set(...targetPreset.target);
    this.transitionStart = performance.now();
    this.isTransitioning = true;
  }

  public update(): void {
    if (this.isTransitioning) {
      const elapsed = performance.now() - this.transitionStart;
      const t = Math.min(1.0, elapsed / this.transitionDuration);

      // Smoothstep easing
      const ease = t * t * (3.0 - 2.0 * t);
      this.camera.position.lerpVectors(this.camStartPos, this.camEndPos, ease);
      this.controls.target.lerpVectors(this.camStartTarget, this.camEndTarget, ease);

      if (t >= 1.0) {
        this.isTransitioning = false;
      }
    }

    this.controls.update();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private onResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  /**
   * High-resolution PNG image export of the studio scene.
   */
  public exportImage(transparent: boolean = false): string {
    const width = 2048;
    const height = 2048;

    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      format: THREE.RGBAFormat,
      colorSpace: THREE.SRGBColorSpace,
      samples: 4
    });

    const prevAspect = this.camera.aspect;
    const prevBg = this.scene.background;

    this.camera.aspect = 1.0;
    this.camera.updateProjectionMatrix();

    if (transparent) {
      this.scene.background = null;
    }

    this.renderer.setRenderTarget(renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);

    // Read pixels to canvas
    const buffer = new Uint8Array(width * height * 4);
    this.renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(width, height);

    // Flip Y
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = ((height - 1 - y) * width + x) * 4;
        const dstIdx = (y * width + x) * 4;
        imgData.data[dstIdx] = buffer[srcIdx];
        imgData.data[dstIdx + 1] = buffer[srcIdx + 1];
        imgData.data[dstIdx + 2] = buffer[srcIdx + 2];
        imgData.data[dstIdx + 3] = buffer[srcIdx + 3];
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Restore original state
    this.camera.aspect = prevAspect;
    this.camera.updateProjectionMatrix();
    this.scene.background = prevBg;
    renderTarget.dispose();

    return canvas.toDataURL('image/png');
  }

  public dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.controls.dispose();
  }
}
