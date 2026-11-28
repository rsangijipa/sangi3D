/**
 * Configuração da Cena 3D, Iluminação Motivada e Manifesto
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function setupScene(container) {
  // 1. Cena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x18120d);
  scene.fog = new THREE.FogExp2(0x18120d, 0.035);

  // 2. Câmera Perspectiva
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(34, aspect, 0.05, 15.0);
  // Posição inicial enquadrada perfeitamente com todos os 4 objetos visíveis e topo do tripé livre
  camera.position.set(0.10, 0.66, 1.28);
  const lookTarget = new THREE.Vector3(0.12, 0.20, 0.04);
  camera.lookAt(lookTarget);

  // 3. Renderizador WebGL
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Ambiente PMREM RoomEnvironment para reflexos metálicos
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = roomEnv;
  scene.environmentIntensity = 0.45;

  // 5. Iluminação Motivada de Tarde (Sol Âmbar + Faixas de Persiana)
  // Sol principal que atravessa as lâminas da persiana
  const sunLight = new THREE.DirectionalLight(0xffecd4, 4.2);
  sunLight.position.set(1.65, 2.05, -0.32);
  sunLight.target.position.set(0.05, 0.08, 0.08);
  scene.add(sunLight.target);

  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 4096;
  sunLight.shadow.mapSize.height = 4096;
  sunLight.shadow.bias = -0.00012;
  sunLight.shadow.normalBias = 0.02;
  sunLight.shadow.radius = 1.0; // sombras de persiana nítidas e autênticas
  sunLight.shadow.camera.near = 0.4;
  sunLight.shadow.camera.far = 4.2;
  sunLight.shadow.camera.left = -1.1;
  sunLight.shadow.camera.right = 1.1;
  sunLight.shadow.camera.top = 1.1;
  sunLight.shadow.camera.bottom = -1.1;
  sunLight.shadow.camera.updateProjectionMatrix();
  sunLight.name = 'sol_tarde';
  scene.add(sunLight);

  // Luz hemisférica suave (céu âmbar e chão nogueira)
  const hemiLight = new THREE.HemisphereLight(0xf7ece0, 0x322014, 0.55);
  hemiLight.name = 'luz_ambiente';
  scene.add(hemiLight);

  // Luz suave de preenchimento frontal-esquerda
  const fillLight = new THREE.DirectionalLight(0xfff2e6, 0.45);
  fillLight.position.set(-1.6, 1.1, 1.1);
  fillLight.castShadow = false;
  fillLight.name = 'luz_preenchimento';
  scene.add(fillLight);

  // Luz de acento na tigela tibetana
  const bowlSpot = new THREE.PointLight(0xffd599, 1.2, 1.8, 1.5);
  bowlSpot.position.set(0.75, 0.35, 0.32);
  bowlSpot.castShadow = false;
  bowlSpot.name = 'luz_acento_tigela';
  scene.add(bowlSpot);

  // 6. Controles Orbitais
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.copy(lookTarget);
  controls.maxPolarAngle = Math.PI / 2 - 0.06; // não descer abaixo do tampo da mesa
  controls.minDistance = 0.45;
  controls.maxDistance = 2.4;

  // Presets de câmera
  const cameraPresets = {
    geral: {
      pos: new THREE.Vector3(0.10, 0.66, 1.28),
      target: new THREE.Vector3(0.12, 0.20, 0.04)
    },
    pendulo: {
      pos: new THREE.Vector3(-0.06, 0.44, 0.44),
      target: new THREE.Vector3(-0.06, 0.04, 0.06)
    },
    berco: {
      pos: new THREE.Vector3(0.27, 0.35, 0.32),
      target: new THREE.Vector3(0.27, 0.12, -0.17)
    },
    ampulheta: {
      pos: new THREE.Vector3(0.48, 0.30, 0.32),
      target: new THREE.Vector3(0.48, 0.11, -0.07)
    },
    tigela: {
      pos: new THREE.Vector3(0.56, 0.32, 0.48),
      target: new THREE.Vector3(0.56, 0.08, 0.18)
    },
    celular: {
      pos: new THREE.Vector3(0.06, 0.84, 1.48),
      target: new THREE.Vector3(0.06, 0.22, 0.06)
    }
  };

  let targetCameraPos = camera.position.clone();
  let targetLookPos = lookTarget.clone();
  let isTransitioningCamera = false;

  function switchCameraPreset(presetKey) {
    const p = cameraPresets[presetKey] || cameraPresets.geral;
    targetCameraPos.copy(p.pos);
    targetLookPos.copy(p.target);
    isTransitioningCamera = true;
  }

  function updateCameraTransition(dt) {
    if (!isTransitioningCamera) return;
    camera.position.lerp(targetCameraPos, Math.min(1.0, dt * 4.0));
    controls.target.lerp(targetLookPos, Math.min(1.0, dt * 4.0));
    if (camera.position.distanceTo(targetCameraPos) < 0.005) {
      camera.position.copy(targetCameraPos);
      controls.target.copy(targetLookPos);
      isTransitioningCamera = false;
    }
  }

  // Ajuste do enquadramento (ViewOffset para dar espaço ao texto do Hero à esquerda)
  function adjustViewOffset() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;

    if (w > 1024) {
      // Desktop: afasta a cena sutilmente para a direita para deixar o hero editorial livre
      camera.setViewOffset(w, h, -w * 0.04, 0, w, h);
    } else if (w <= 640) {
      // Celular: eleva o centro para deixar espaço para o dock inferior
      camera.setViewOffset(w, h, 0, -h * 0.06, w, h);
    } else {
      camera.clearViewOffset();
    }

    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', adjustViewOffset);
  adjustViewOffset();

  // 7. Validação do Manifesto de Cena (SCENE_MANIFEST)
  function validateSceneManifest() {
    const manifestIds = [
      'tampo_mesa',
      'parede_fundo',
      'persiana_janela',
      'planta_decorativa',
      'pendulo_areia_grupo',
      'areia_disco',
      'tripe_pendulo',
      'peso_pendulo',
      'ponta_estilete',
      'berco_newton',
      'ampulheta_liquida',
      'tigela_tibetana_grupo',
      'almofada_tigela',
      'tigela_bronze',
      'sol_tarde',
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

  return {
    scene,
    camera,
    renderer,
    controls,
    sunLight,
    hemiLight,
    fillLight,
    bowlSpot,
    cameraPresets,
    switchCameraPreset,
    updateCameraTransition,
    adjustViewOffset,
    validateSceneManifest
  };
}
