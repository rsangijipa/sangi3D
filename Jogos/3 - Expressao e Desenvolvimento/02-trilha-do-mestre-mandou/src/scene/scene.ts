/**
 * Montagem da Cena 3D, Iluminação Matinal e Câmera de Terceira Pessoa
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createForestTerrain } from './terrain.ts';
import { createRiverStream } from './water.ts';
import { createBlueBell, createDrum, createWaterWheel } from './heroAssets.ts';
import { createParkEnvironment } from './environment.ts';
import { TrailAvatar } from './avatar.ts';

export function setupScene(container: HTMLElement) {
  // 1. Cena com Névoa Matinal Verde-Dourada
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2f4a38);
  scene.fog = new THREE.FogExp2(0x2f4a38, 0.016);

  // 2. Câmera Perspectiva
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100.0);

  // 3. Renderizador WebGL
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  // 4. PMREM Environment para reflexos nos sinos e na água
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;

  // 5. Iluminação Solar Matinal Motivada (Dourado de Manhã)
  const sunLight = new THREE.DirectionalLight(0xfff2d6, 3.8);
  sunLight.position.set(24.0, 32.0, -16.0);
  sunLight.target.position.set(4.0, 1.0, 0.0);
  scene.add(sunLight.target);

  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0003;
  sunLight.shadow.normalBias = 0.03;
  sunLight.shadow.radius = 1.8;
  sunLight.shadow.camera.near = 5.0;
  sunLight.shadow.camera.far = 70.0;
  sunLight.shadow.camera.left = -22.0;
  sunLight.shadow.camera.right = 22.0;
  sunLight.shadow.camera.top = 22.0;
  sunLight.shadow.camera.bottom = -22.0;
  sunLight.shadow.camera.updateProjectionMatrix();
  sunLight.name = 'sol_manha';
  scene.add(sunLight);

  // Luz hemisférica (céu florestal e chão de terra)
  const hemiLight = new THREE.HemisphereLight(0x81945b, 0x365a43, 0.65);
  hemiLight.name = 'luz_ambiente';
  scene.add(hemiLight);

  // Luz suave de preenchimento
  const fillLight = new THREE.DirectionalLight(0xddf0e0, 0.45);
  fillLight.position.set(-18.0, 15.0, 18.0);
  fillLight.name = 'luz_preenchimento';
  scene.add(fillLight);

  // Facho de sol volumétrico suave (god rays) atravessando a copa
  const rayGeo = new THREE.CylinderGeometry(0.8, 4.5, 26, 12, 1, true);
  rayGeo.rotateX(0.42);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xffeab8,
    transparent: true,
    opacity: 0.10,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const godRay = new THREE.Mesh(rayGeo, rayMat);
  godRay.position.set(12.0, 14.0, -8.0);
  scene.add(godRay);

  // 6. Construção dos Elementos da Cena
  const terrain = createForestTerrain();
  scene.add(terrain.group);

  const water = createRiverStream();
  scene.add(water.group);

  const environment = createParkEnvironment();
  scene.add(environment);

  const blueBell = createBlueBell();
  scene.add(blueBell.group);

  const drum = createDrum();
  scene.add(drum.group);

  const waterWheel = createWaterWheel();
  scene.add(waterWheel.group);

  const avatar = new TrailAvatar();
  scene.add(avatar.group);

  // Marcador de destino do clique no chão (anel de luz)
  const ringGeo = new THREE.RingGeometry(0.35, 0.45, 24);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xe5bc58,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const targetBeacon = new THREE.Mesh(ringGeo, ringMat);
  targetBeacon.position.set(0, -10, 0); // escondido inicialmente
  scene.add(targetBeacon);

  // 7. Controle de Câmera de Terceira Pessoa e Isométrica
  let cameraMode: 'follow' | 'isometric' = 'follow';

  function updateCamera(dt: number) {
    if (cameraMode === 'follow') {
      // Terceira pessoa elevada acompanhando o avatar com visão da ponte e do sino azul
      // Offset: atrás e acima do avatar
      const idealOffset = new THREE.Vector3(-4.8, 3.8, 6.2);
      idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), avatar.rotationY * 0.35);

      const targetCamPos = avatar.pos.clone().add(idealOffset);
      const targetLookAt = avatar.pos.clone().add(new THREE.Vector3(1.2, 1.4, -2.0)); // olha ligeiramente à frente em direção à ponte

      camera.position.lerp(targetCamPos, Math.min(1.0, dt * 5.0));
      camera.lookAt(targetLookAt);
    } else {
      // Visão isométrica geral elevada do parque
      const isoPos = new THREE.Vector3(18.0, 24.0, 26.0);
      const isoLook = new THREE.Vector3(2.0, 1.5, 0.0);
      camera.position.lerp(isoPos, Math.min(1.0, dt * 3.5));
      camera.lookAt(isoLook);
    }
  }

  function setCameraMode(mode: 'follow' | 'isometric') {
    cameraMode = mode;
  }

  // 8. Validação do Manifesto de Cena (SCENE_MANIFEST)
  function validateSceneManifest(): boolean {
    const manifestIds = [
      'avatar_rigado',
      'chao_floresta',
      'seixos_riacho',
      'superficie_riacho',
      'ponte_suspensa',
      'corda',
      'plataforma_estrela',
      'plataforma_espiral',
      'portao_trilha',
      'cabana_mirante',
      'barco_remanso',
      'arvores_e_rochas',
      'sino_azul',
      'tambor',
      'roda_dagua',
      'sol_manha',
      'luz_ambiente'
    ];

    let foundCount = 0;
    manifestIds.forEach(id => {
      const obj = scene.getObjectByName(id);
      console.assert(obj !== undefined && obj !== null, `[SCENE_MANIFEST] Objeto obrigatório não encontrado: ${id}`);
      if (obj) foundCount++;
    });

    console.log(`[SCENE_MANIFEST] Verificados com sucesso: ${foundCount}/${manifestIds.length} nós essenciais da cena.`);
    return foundCount === manifestIds.length;
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', resize);
  resize();

  return {
    scene,
    camera,
    renderer,
    sunLight,
    hemiLight,
    terrain,
    water,
    avatar,
    blueBell,
    drum,
    waterWheel,
    targetBeacon,
    setCameraMode,
    updateCamera,
    validateSceneManifest
  };
}
