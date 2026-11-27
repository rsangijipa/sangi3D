/**
 * Porto das Decisões — Orquestrador Principal de Cena Three.js
 * Câmera ortográfica isométrica 38°, iluminação PBR com sombras PCF suaves,
 * navegação cinemática tangencial em curva Catmull-Rom para qualquer barco selecionado.
 */

import * as THREE from 'three';
import { HarborWater } from './water';
import { HarborEnvironment } from './environment';
import { HarborCrane } from './crane';
import { HarborBoatsManager } from './boats';
import { RouteView } from './routeView';
import { BOATS_CATALOG, getNodeById } from '../game/content';
import { GameState } from '../game/state';

export interface SceneCallbacks {
  onNodeClicked: (nodeId: string) => void;
  onWaypointReached?: (nodeId: string, index: number) => void;
  onVoyageFinished?: () => void;
}

export class GameScene {
  private container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.OrthographicCamera;
  public renderer: THREE.WebGLRenderer;
  public water: HarborWater;
  public environment: HarborEnvironment;
  public crane: HarborCrane;
  public boats: HarborBoatsManager;
  public routeView: RouteView;

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private callbacks: SceneCallbacks;
  private animationFrameId: number = 0;
  private clock: THREE.Clock;
  private isDestroyed: boolean = false;

  // Curva de navegação cinemática ativa
  private activeCurve: THREE.CatmullRomCurve3 | null = null;
  private activeRouteNodes: string[] = [];
  private activeTravelBoatId: 'blue' | 'green' | 'red' = 'blue';
  private boatTravelProgress: number = 0;
  private isTraveling: boolean = false;
  private travelSpeed: number = 0.22;
  private lastReachedWaypoint: number = -1;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Cena Three.js com atmosfera náutica
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#78B6C0');
    this.scene.fog = new THREE.FogExp2('#78B6C0', 0.012);

    // 2. Câmera Ortográfica Isométrica calibrada com o mockup
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 10.8;
    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    this.setupCameraAngle();

    // 3. Renderer com sombras suaves e ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.container.appendChild(this.renderer.domElement);

    // 4. Luzes PBR
    this.setupLights();

    // 5. Entidades 3D
    this.water = new HarborWater();
    this.scene.add(this.water.mesh);

    this.environment = new HarborEnvironment();
    this.scene.add(this.environment.group);

    this.crane = new HarborCrane(-2.2, 1.05, -0.4);
    this.scene.add(this.crane.group);

    this.boats = new HarborBoatsManager(BOATS_CATALOG);
    this.scene.add(this.boats.group);

    this.routeView = new RouteView();
    this.scene.add(this.routeView.group);

    // 6. Raycasting e Eventos
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.bindEvents();
    this.handleResize();
    this.animate();
  }

  private setupCameraAngle(): void {
    const camDist = 20;
    const elev = Math.sin((38 * Math.PI) / 180); // 38° de elevação
    const planar = Math.cos((38 * Math.PI) / 180);
    const yaw = Math.PI / 4; // 45° azimute

    this.camera.position.set(
      camDist * planar * Math.sin(yaw),
      camDist * elev,
      camDist * planar * Math.cos(yaw)
    );
    this.camera.lookAt(-0.3, 0.4, 0.9);
  }

  private setupLights(): void {
    // Luz de abóbada celeste e reflexo do mar
    const hemiLight = new THREE.HemisphereLight('#F0F9FB', '#1D4537', 0.7);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    // Luz solar direta com sombras
    const sunLight = new THREE.DirectionalLight('#FFF5E6', 1.4);
    sunLight.position.set(-8, 17, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;

    const d = 11;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;

    this.scene.add(sunLight);

    // Luz difusa de preenchimento do mar
    const fillLight = new THREE.DirectionalLight('#82D9E6', 0.4);
    fillLight.position.set(12, 8, -6);
    this.scene.add(fillLight);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
  }

  private onPointerDown = (e: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.routeView.clickColliders, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const nodeId = hit.userData.nodeId;
      if (nodeId) {
        this.callbacks.onNodeClicked(nodeId);
      }
    }
  };

  private onPointerMove = (e: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.routeView.clickColliders, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const nodeId = hit.userData.nodeId;
      this.routeView.setHoveredNode(nodeId);
      this.container.style.cursor = 'pointer';
    } else {
      this.routeView.setHoveredNode(null);
      this.container.style.cursor = 'default';
    }
  };

  public handleResize = (): void => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;

    const isMobile = width < 768;
    const frustumSize = isMobile ? 11.2 : 9.8;

    this.camera.left = (-frustumSize * aspect) / 2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();

    if (isMobile) {
      this.camera.lookAt(-0.1, 0.4, 1.2);
    } else {
      this.camera.lookAt(-0.3, 0.4, 0.9);
    }

    this.renderer.setSize(width, height);
  };

  /**
   * Sincroniza a cena 3D com o estado determinístico da FSM
   */
  public syncWithState(state: GameState): void {
    // 1. Manter barcos inativos em suas vagas reservadas sem sobreposição
    this.boats.positionIdleBoats(state.selectedBoatId);
    (['blue', 'green', 'red'] as const).forEach(bId => {
      this.boats.getBoat(bId).setVisible(true);
    });

    // 2. Atualizar caixas no convés do barco selecionado
    this.boats.updateActiveBoatCargo(state.selectedBoatId, state.cargoOnboard);

    // 3. Atualizar linha e boias da rota ativa
    this.routeView.updateRoutePath(state.route);

    // 4. Iniciar ou interromper viagem/simulação cinemática
    if ((state.isSimulating || state.isVoyaging) && !this.isTraveling) {
      this.startBoatTravel(state.route, state.selectedBoatId);
    } else if (!state.isSimulating && !state.isVoyaging) {
      if (this.isTraveling) {
        this.stopBoatTravel();
      }
      // Reposicionar barco ativo no nó inicial
      const startNode = getNodeById(state.route[0]);
      if (startNode) {
        const activeBoat = this.boats.getBoat(state.selectedBoatId);
        // Se a rota tem mais nós, aponta para o próximo
        if (state.route.length >= 2) {
          const nextNode = getNodeById(state.route[1]);
          if (nextNode) {
            const dx = nextNode.pos[0] - startNode.pos[0];
            const dz = nextNode.pos[2] - startNode.pos[2];
            const yaw = Math.atan2(-dz, dx);
            activeBoat.setBasePosition(startNode.pos[0], startNode.pos[2], yaw);
          } else {
            activeBoat.setBasePosition(startNode.pos[0], startNode.pos[2], activeBoat.initialYaw);
          }
        } else {
          activeBoat.setBasePosition(startNode.pos[0], startNode.pos[2], activeBoat.initialYaw);
        }
      }
    }
  }

  public startBoatTravel(route: string[], boatId: 'blue' | 'green' | 'red'): void {
    if (route.length < 2) return;

    const points: THREE.Vector3[] = [];
    route.forEach(id => {
      const n = getNodeById(id);
      if (n) points.push(new THREE.Vector3(n.pos[0], 0.14, n.pos[2]));
    });

    this.activeCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);
    this.activeRouteNodes = [...route];
    this.activeTravelBoatId = boatId;
    this.boatTravelProgress = 0;
    this.isTraveling = true;
    this.lastReachedWaypoint = 0;

    // Velocidade proporcional à característica de cada embarcação
    const boatConfig = BOATS_CATALOG[boatId];
    this.travelSpeed = 0.08 * (boatConfig.speed || 1.8);
  }

  public stopBoatTravel(): void {
    this.isTraveling = false;
    this.activeCurve = null;
    this.boatTravelProgress = 0;
  }

  private animate = (): void => {
    if (this.isDestroyed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // 1. Atualizar água
    this.water.update(time);

    // 2. Atualizar guindaste
    this.crane.update(time);

    // 3. Atualizar rota e halo
    this.routeView.update(time);

    // 4. Cinemática de navegação do barco ativo
    if (this.isTraveling && this.activeCurve) {
      this.boatTravelProgress += delta * this.travelSpeed;
      if (this.boatTravelProgress >= 1.0) {
        this.boatTravelProgress = 1.0;
        this.isTraveling = false;
        if (this.callbacks.onVoyageFinished) {
          this.callbacks.onVoyageFinished();
        }
      }

      // Smoothstep easing para aceleração e desaceleração suaves
      const t = this.boatTravelProgress;
      const smoothT = t * t * (3 - 2 * t);

      const pos = this.activeCurve.getPointAt(smoothT);
      const tangent = this.activeCurve.getTangentAt(smoothT).normalize();
      const yaw = Math.atan2(-tangent.z, tangent.x);

      // Atualiza o barco que está efetivamente navegando
      const currentActiveBoat = this.boats.getBoat(this.activeTravelBoatId);
      currentActiveBoat.setBasePosition(pos.x, pos.z, yaw);

      // Detecta passagem pelos nós intermediários
      const segmentCount = this.activeRouteNodes.length - 1;
      const currentSegment = Math.floor(smoothT * segmentCount);
      if (currentSegment > this.lastReachedWaypoint) {
        this.lastReachedWaypoint = currentSegment;
        const reachedNodeId = this.activeRouteNodes[currentSegment];
        if (this.callbacks.onWaypointReached) {
          this.callbacks.onWaypointReached(reachedNodeId, currentSegment);
        }
      }
    }

    // Balanço suave nas ondas para os barcos ancorados
    this.boats.updateBobbing(
      time,
      (x, z, t) => this.water.getWaterHeight(x, z, t),
      this.isTraveling ? this.activeTravelBoatId : undefined
    );

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);

    this.water.dispose();
    this.environment.dispose();
    this.crane.dispose();
    this.boats.dispose();
    this.routeView.dispose();
    this.renderer.dispose();
  }
}
