/**
 * Laboratório de Camadas Sonoras — Orquestrador de Cena 3D Three.js
 * Câmera 40° centralizada, iluminação motivada (sol + abajur), sombras PCF, picking e arrasto de faders 3D
 */

import * as THREE from 'three';
import { WorkbenchEnvironment } from './workbench';
import { ClochesManager } from './cloches';
import { MiniaturesManager } from './miniatures';
import { MixingDesk } from './mixer';
import { StudioProps } from './props';
import { ChannelId, GameState } from '../game/state';
import { calculateAllEffectiveGains } from '../game/rules';

export interface SceneCallbacks {
  onFaderDrag: (channelId: ChannelId, level: number) => void;
  onSoloClick: (channelId: ChannelId) => void;
  onClocheClick: (channelId: ChannelId) => void;
}

export class GameScene {
  private container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public clock: THREE.Clock;

  // Módulos da cena
  public workbench: WorkbenchEnvironment;
  public cloches: ClochesManager;
  public miniatures: MiniaturesManager;
  public mixer: MixingDesk;
  public props: StudioProps;

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private callbacks: SceneCallbacks;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;

  // Estado de arrasto de fader 3D
  private draggingChannelId: ChannelId | null = null;
  private dragPlane: THREE.Plane;
  private dragPlaneIntersect: THREE.Vector3;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Cena Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#D8B17A');

    // 2. Câmera (40° de elevação, enquadramento perfeito para faders e redomas)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.setupCamera();

    // 3. Renderer com sombras PCF e tomemapping ACES
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // 4. Luzes motivadas
    this.setupLights();

    // 5. Componentes 3D da bancada
    this.workbench = new WorkbenchEnvironment();
    this.scene.add(this.workbench.group);

    this.cloches = new ClochesManager();
    this.scene.add(this.cloches.group);

    this.miniatures = new MiniaturesManager();
    this.scene.add(this.miniatures.group);

    this.mixer = new MixingDesk();
    this.scene.add(this.mixer.group);

    this.props = new StudioProps();
    this.scene.add(this.props.group);

    // 6. Raycasting e plano de arrasto
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane();
    this.dragPlaneIntersect = new THREE.Vector3();

    this.bindEvents();
    this.handleResize();
    this.animate();
  }

  private setupCamera(): void {
    // Posição centralizada para leitura simultânea de faders (embaixo) e redomas (em cima)
    const isMobile = this.container.clientWidth < 768;
    if (isMobile) {
      this.camera.position.set(0, 2.7, 4.4);
      this.camera.lookAt(0, 0.45, 0.1);
    } else {
      this.camera.position.set(0, 2.45, 3.8);
      this.camera.lookAt(0, 0.5, 0.1);
    }
  }

  private setupLights(): void {
    // Luz ambiente suave de preenchimento da oficina
    const hemiLight = new THREE.HemisphereLight('#FAF5EE', '#8D6E63', 0.65);
    hemiLight.position.set(0, 10, 0);
    this.scene.add(hemiLight);

    // Luz solar motivada entrando pela janela arqueada com sombras suaves
    const sunLight = new THREE.DirectionalLight('#FFF5E6', 1.2);
    sunLight.position.set(2, 6, -2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 15;
    const d = 4.5;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    this.scene.add(sunLight);

    // Luz suave frontal de preenchimento
    const frontFill = new THREE.DirectionalLight('#F0E6D2', 0.35);
    frontFill.position.set(0, 3, 5);
    this.scene.add(frontFill);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerDown = (e: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Checar clique nos botões de fone (solo)
    const buttonHits = this.raycaster.intersectObjects(this.mixer.clickColliders, true);
    if (buttonHits.length > 0) {
      const hit = buttonHits[0].object;
      const chId = hit.userData.channelId as ChannelId;
      if (chId) {
        this.callbacks.onSoloClick(chId);
        return;
      }
    }

    // 2. Checar clique ou início de arrasto no knob de fader
    const knobHits = this.raycaster.intersectObjects(this.mixer.dragColliders, true);
    if (knobHits.length > 0) {
      const hit = knobHits[0].object;
      const chId = hit.userData.channelId as ChannelId;
      if (chId) {
        this.draggingChannelId = chId;
        // Definir plano inclinado para projetar o arrasto no espaço 3D
        const normal = new THREE.Vector3(0, Math.cos(this.mixer.slopeAngle), -Math.sin(this.mixer.slopeAngle)).normalize();
        this.dragPlane.setFromNormalAndCoplanarPoint(normal, hit.position);
        return;
      }
    }

    // 3. Checar clique nas redomas de vidro
    const clocheHits = this.raycaster.intersectObjects(this.cloches.clickColliders, true);
    if (clocheHits.length > 0) {
      const hit = clocheHits[0].object;
      const chId = hit.userData.channelId as ChannelId;
      if (chId) {
        this.callbacks.onClocheClick(chId);
      }
    }
  };

  private onPointerMove = (e: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.draggingChannelId) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPlaneIntersect)) {
        // Mapear posição Y/Z do cursor para o valor do fader (0.0 a 1.0)
        // Cursor mais alto (menor Z no plano) = volume maior (1.0)
        // Cursor mais baixo (maior Z no plano) = volume menor (0.0)
        const minY = 0.2;
        const maxY = 0.55;
        const normalizedY = (this.dragPlaneIntersect.y - minY) / (maxY - minY);
        const clampedLevel = Math.max(0.0, Math.min(1.0, normalizedY));
        this.callbacks.onFaderDrag(this.draggingChannelId, clampedLevel);
      }
      return;
    }

    // Cursor hover feedback
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const allColliders = [
      ...this.mixer.clickColliders,
      ...this.mixer.dragColliders,
      ...this.cloches.clickColliders
    ];
    const hits = this.raycaster.intersectObjects(allColliders, true);
    this.container.style.cursor = hits.length > 0 ? 'pointer' : 'default';
  };

  private onPointerUp = (): void => {
    this.draggingChannelId = null;
  };

  public handleResize = (): void => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.setupCamera();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  /**
   * Sincroniza a cena 3D com o estado da aplicação
   */
  public syncWithState(state: GameState): void {
    const gains = calculateAllEffectiveGains(state);

    // 1. Atualizar posições dos knobs de fader e botões de fone solo
    this.mixer.updateFaderPositions(state.channels, state.soloId, state.focusedChannelId);

    // 2. Atualizar intensidade dos anéis de feedback das redomas
    this.cloches.updateGlowLevels(gains, state.focusedChannelId);
  }

  private animate = (): void => {
    if (this.isDestroyed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();

    // Atualizar miniaturas dinâmicas (ventilador girando se canal ativo, tênis flutuando)
    this.miniatures.update(time, 0.8, false);

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);

    this.workbench.dispose();
    this.cloches.dispose();
    this.miniatures.dispose();
    this.mixer.dispose();
    this.props.dispose();
    this.renderer.dispose();
  }
}
