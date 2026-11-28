// src/scene/gameScene.ts
// Gerenciamento completo da cena 3D isométrica ortográfica, iluminação e modelos GLB
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GameState } from '../game/state';
import { Vec3, calculateDistanceXZ } from '../game/rules';

export interface SceneCallbacks {
  onSelectSource: (sourceId: string) => void;
  onMoveBus: (pos: Vec3) => void;
  onMoveListener: (pos: Vec3) => void;
}

export class GameScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private gltfLoader: GLTFLoader;

  // Interações e Raycasting
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private planeIntersect = new THREE.Vector3();
  private isDraggingBus = false;
  private isDraggingListener = false;
  private callbacks: SceneCallbacks;

  // Nós tridimensionais principais
  private tokensMap = new Map<string, THREE.Group>();
  private listenerMarkerGroup: THREE.Group | null = null;
  private busGroup: THREE.Group | null = null;
  private soundRingsMap = new Map<string, THREE.Group>();
  private soundRingsTemplate: THREE.Group | null = null;
  private fountainWater: THREE.Mesh | null = null;
  private comparisonVisualGroup: THREE.Group;

  private isDisposed = false;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();
  private isMobileView = false;
  private currentStep = 3;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6e4324); // Mesa de carvalho mel ao redor do diorama

    // 2. Grupo para comparação visual de alcance (Etapa 4)
    this.comparisonVisualGroup = new THREE.Group();
    this.comparisonVisualGroup.name = 'comparison_visuals';
    this.scene.add(this.comparisonVisualGroup);

    // 3. Câmera Ortográfica Isométrica (~45° azimute, ~35° elevação)
    const aspect = (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight);
    const frustumSize = 9.8;
    this.camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    this.setupCamera();

    // 4. Renderizador WebGL de Alta Fidelidade
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    container.appendChild(this.renderer.domElement);

    this.gltfLoader = new GLTFLoader();

    // 5. Iluminação quente e difusa de janela
    this.setupLights();

    // 6. Carregar modelos GLB
    this.loadModels();

    // 7. Eventos de entrada
    this.setupInputEvents();

    // 8. Loop de animação
    this.animate = this.animate.bind(this);
    this.animFrameId = requestAnimationFrame(this.animate);

    // 9. Resize listener
    window.addEventListener('resize', this.onWindowResize);
  }

  private setupCamera() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.isMobileView = width < 768;

    const distance = 25;
    const phi = THREE.MathUtils.degToRad(35); // elevação ~35°
    const theta = THREE.MathUtils.degToRad(45); // azimute ~45°

    const x = distance * Math.cos(phi) * Math.sin(theta);
    const y = distance * Math.sin(phi);
    const z = distance * Math.cos(phi) * Math.cos(theta);

    this.camera.position.set(x, y, z);

    const aspect = width / height;

    if (this.isMobileView) {
      // No mobile: reenquadra em close-up na praça, fonte, padaria e ônibus
      const mobileFrustum = 5.8;
      this.camera.left = (-mobileFrustum * aspect) / 2;
      this.camera.right = (mobileFrustum * aspect) / 2;
      this.camera.top = mobileFrustum / 2;
      this.camera.bottom = -mobileFrustum / 2;
      this.camera.zoom = 1.0;
      this.camera.lookAt(0.2, 0.35, 0.85);
    } else {
      // No desktop: diorama preenche com perfeição a esquerda (~75%), reservando a lateral direita para o HUD
      const desktopFrustum = 8.6;
      this.camera.left = (-desktopFrustum * aspect) / 2;
      this.camera.right = (desktopFrustum * aspect) / 2;
      this.camera.top = desktopFrustum / 2;
      this.camera.bottom = -desktopFrustum / 2;
      this.camera.zoom = 1.0;
      this.camera.lookAt(-0.75, 0.25, 0.35);
    }
    this.camera.updateProjectionMatrix();
  }

  private setupLights() {
    // Luz ambiente suave e quente (claridade diurna de sala acolhedora com janela aberta)
    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0xc4b7a6, 1.05);
    hemiLight.position.set(0, 30, 0);
    this.scene.add(hemiLight);

    // Luz Direcional Principal (Janela Quente vindo do canto superior esquerdo)
    const sunLight = new THREE.DirectionalLight(0xfff3e2, 1.9);
    sunLight.position.set(-16, 24, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.bias = -0.0004;

    const d = 10;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    this.scene.add(sunLight);

    // Luz de preenchimento azulada suave no lado oposto para sombras abrandadas
    const fillLight = new THREE.DirectionalLight(0xdde8f5, 0.45);
    fillLight.position.set(16, 12, -12);
    this.scene.add(fillLight);
  }

  private async loadModels() {
    const basePath = './assets/models/';

    const loadGLB = (name: string): Promise<THREE.Group> => {
      return new Promise((resolve) => {
        this.gltfLoader.load(
          `${basePath}${name}.glb`,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve(model);
          },
          undefined,
          (err) => {
            console.warn(`Could not load ${name}.glb, fallback active:`, err);
            resolve(new THREE.Group());
          }
        );
      });
    };

    const [
      mapBoard,
      roadTiles,
      school,
      bakery,
      houseSet,
      fountain,
      treeSet,
      bench,
      lamppost,
      busToken,
      birdToken,
      bellToken,
      waterToken,
      footstepToken,
      listenerMarker,
      soundRings
    ] = await Promise.all([
      loadGLB('map_board'),
      loadGLB('road_tiles'),
      loadGLB('school'),
      loadGLB('bakery'),
      loadGLB('house_set'),
      loadGLB('fountain'),
      loadGLB('tree_set'),
      loadGLB('bench'),
      loadGLB('lamppost'),
      loadGLB('bus_token'),
      loadGLB('bird_token'),
      loadGLB('bell_token'),
      loadGLB('water_token'),
      loadGLB('footstep_token'),
      loadGLB('listener_marker'),
      loadGLB('sound_rings')
    ]);

    if (this.isDisposed) return;

    this.soundRingsTemplate = soundRings;

    // 1. Tabuleiro e ruas
    this.scene.add(mapBoard);
    this.scene.add(roadTiles);

    // 2. Padaria terracota (frente esquerda)
    bakery.position.set(-3.2, 0, 1.4);
    bakery.rotation.y = 0.05;
    this.scene.add(bakery);

    // 3. Escola de tijolo com relógio e bandeira (fundo esquerda)
    school.position.set(-1.4, 0, -3.0);
    this.scene.add(school);

    // 4. Casas amarelas (direita)
    houseSet.position.set(4.0, 0, -0.4);
    this.scene.add(houseSet);

    // 5. Fonte circular na praça
    fountain.position.set(1.5, 0, 0.6);
    this.scene.add(fountain);
    fountain.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes('water')) {
        this.fountainWater = child as THREE.Mesh;
      }
    });

    // 6. Árvores felpudas
    treeSet.position.set(0.6, 0, -1.2);
    this.scene.add(treeSet);

    const treeClone = treeSet.clone();
    treeClone.position.set(-3.0, 0, -0.8);
    treeClone.scale.set(0.85, 0.85, 0.85);
    this.scene.add(treeClone);

    // 7. Bancos de praça
    bench.position.set(2.8, 0, 0.5);
    bench.rotation.y = -Math.PI / 2;
    this.scene.add(bench);

    const bench2 = bench.clone();
    bench2.position.set(1.5, 0, 2.0);
    this.scene.add(bench2);

    const bench3 = bench.clone();
    bench3.position.set(0.2, 0, -0.8);
    bench3.rotation.y = Math.PI / 3;
    this.scene.add(bench3);

    // 8. Lampiões
    lamppost.position.set(-0.2, 0, 0.1);
    this.scene.add(lamppost);

    const lamppost2 = lamppost.clone();
    lamppost2.position.set(2.6, 0, -0.8);
    this.scene.add(lamppost2);

    // 9. Tokens de som interativos (com IDs coerentes: 'bus', 'fountain', 'birds', 'bell', 'footsteps')
    this.setupToken('bus', busToken, [-0.6, 0.2, 1.2]);
    this.busGroup = busToken;

    this.setupToken('fountain', waterToken, [1.5, 0.2, 0.6]);
    this.setupToken('birds', birdToken, [0.6, 0.2, -1.2]);
    this.setupToken('bell', bellToken, [-2.6, 0.2, -2.2]);
    this.setupToken('footsteps', footstepToken, [-2.8, 0.2, 1.8]);

    // 10. Marcador de escuta (Pino dourado)
    this.listenerMarkerGroup = listenerMarker;
    listenerMarker.position.set(-0.8, 0.1, 0.2);
    listenerMarker.userData = { isListenerMarker: true };
    this.scene.add(listenerMarker);
  }

  private setupToken(id: string, group: THREE.Group, pos: [number, number, number]) {
    group.position.set(...pos);
    group.userData = { soundSourceId: id, isSoundToken: true };

    // Adicionar anéis de som concêntricos translúcidos ao redor do token
    const ringsGroup = this.soundRingsTemplate ? this.soundRingsTemplate.clone() : this.createFallbackSoundRings();
    ringsGroup.position.set(0, 0.05, 0);
    ringsGroup.visible = false;
    group.add(ringsGroup);

    this.soundRingsMap.set(id, ringsGroup);
    this.tokensMap.set(id, group);
    this.scene.add(group);
  }

  private createFallbackSoundRings(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'sound_rings';

    for (let i = 0; i < 3; i++) {
      const radius = 0.65 + i * 0.42;
      const geom = new THREE.TorusGeometry(radius, 0.028, 12, 48, Math.PI * 0.65);
      geom.rotateX(Math.PI / 2);
      geom.rotateZ(-Math.PI * 0.325);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x00e5ff,
        emissiveIntensity: 0.8 - i * 0.18,
        transparent: true,
        opacity: 0.75 - i * 0.18,
        roughness: 0.2
      });
      const ring = new THREE.Mesh(geom, mat);
      ring.name = `ring_${i}`;
      group.add(ring);
    }

    return group;
  }

  private setupInputEvents() {
    const canvas = this.renderer.domElement;

    const getPointerCoords = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      const coords = getPointerCoords(e);
      this.pointer.x = coords.x;
      this.pointer.y = coords.y;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent && parent !== this.scene) {
          if (parent.userData?.isListenerMarker) {
            this.isDraggingListener = true;
            canvas.setPointerCapture(e.pointerId);
            return;
          }
          if (parent.userData?.isSoundToken) {
            const sid = parent.userData.soundSourceId;
            if (sid === 'bus') {
              this.isDraggingBus = true;
              canvas.setPointerCapture(e.pointerId);
            }
            this.callbacks.onSelectSource(sid);
            return;
          }
          parent = parent.parent;
        }
      }

      // Se clicar no chão plano em modo mover ou escuta, mover ouvinte para a coordenada clicada
      if (this.raycaster.ray.intersectPlane(this.dragPlane, this.planeIntersect)) {
        if (this.currentStep === 2) {
          this.callbacks.onMoveListener([this.planeIntersect.x, 0.1, this.planeIntersect.z]);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDraggingBus && !this.isDraggingListener) return;

      const coords = getPointerCoords(e);
      this.pointer.x = coords.x;
      this.pointer.y = coords.y;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      if (this.raycaster.ray.intersectPlane(this.dragPlane, this.planeIntersect)) {
        const targetPos: Vec3 = [this.planeIntersect.x, 0.2, this.planeIntersect.z];

        if (this.isDraggingBus) {
          this.callbacks.onMoveBus(targetPos);
        } else if (this.isDraggingListener) {
          this.callbacks.onMoveListener(targetPos);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (this.isDraggingBus || this.isDraggingListener) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          // noop
        }
        this.isDraggingBus = false;
        this.isDraggingListener = false;
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  public updateFromState(state: GameState) {
    this.currentStep = state.step;

    // 1. Atualizar posição do ônibus
    if (this.busGroup) {
      this.busGroup.position.set(state.busPos[0], state.busPos[1], state.busPos[2]);
    }

    // 2. Atualizar posição e visibilidade do marcador de escuta
    if (this.listenerMarkerGroup) {
      this.listenerMarkerGroup.position.set(state.listenerPos[0], state.listenerPos[1], state.listenerPos[2]);
      // Na etapa 1 o foco é puramente sensorial nas fontes; etapas 2-5 exibem o marcador
      this.listenerMarkerGroup.visible = state.step >= 2;
    }

    // 3. Atualizar destaque e ondas de cada token
    for (const source of state.sources) {
      const token = this.tokensMap.get(source.id);
      const rings = this.soundRingsMap.get(source.id);

      if (token) {
        // Contorno / anel de seleção ciano
        const glowRing = token.getObjectByName('selection_glow') as THREE.Mesh | undefined;
        if (glowRing && glowRing.material) {
          const isSelected = state.selectedSourceId === source.id;
          (glowRing.material as THREE.MeshStandardMaterial).emissiveIntensity = isSelected ? 2.0 : 0.4;
        }

        // Anéis concêntricos translúcidos sem piscar (visíveis apenas enquanto a fonte toca)
        if (rings) {
          rings.visible = source.isPlaying && !state.globalMuted;
        }
      }
    }

    // 4. Comparação visual de alcance (Etapa 4)
    this.updateComparisonVisuals(state);
  }

  private updateComparisonVisuals(state: GameState) {
    // Limpar visualizações anteriores
    while (this.comparisonVisualGroup.children.length > 0) {
      const obj = this.comparisonVisualGroup.children[0];
      this.comparisonVisualGroup.remove(obj);
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).geometry.dispose();
      }
    }

    if (state.step !== 4) return;

    const sourceA = state.sources.find((s) => s.id === state.comparison.sourceAId);
    const sourceB = state.sources.find((s) => s.id === state.comparison.sourceBId);
    const listener = state.listenerPos;

    if (!sourceA || !sourceB) return;

    const distA = calculateDistanceXZ(sourceA.position, listener);
    const distB = calculateDistanceXZ(sourceB.position, listener);

    // Círculos de alcance em torno do ouvinte
    const createRangeArc = (dist: number, colorHex: number) => {
      const geom = new THREE.TorusGeometry(dist, 0.02, 12, 64);
      geom.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.55
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(listener[0], 0.08, listener[2]);
      return mesh;
    };

    this.comparisonVisualGroup.add(createRangeArc(distA, 0x0284c7)); // Círculo A azul
    this.comparisonVisualGroup.add(createRangeArc(distB, 0xd97706)); // Círculo B âmbar
  }

  private animate() {
    if (this.isDisposed) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Animação suave e contínua dos anéis sonoros ativos
    this.soundRingsMap.forEach((rings) => {
      if (rings.visible) {
        const scale = 1.0 + Math.sin(elapsedTime * 3.5) * 0.06;
        rings.scale.set(scale, 1, scale);
      }
    });

    // Ondulação suave na água da fonte
    if (this.fountainWater) {
      this.fountainWater.rotation.y += delta * 0.25;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (this.isDisposed || !this.container) return;

    this.setupCamera();
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
  };

  public dispose() {
    this.isDisposed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    window.removeEventListener('resize', this.onWindowResize);

    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
