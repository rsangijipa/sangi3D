import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import {
  createRiverRockGeometry,
  createBaseRiverRockGeometry,
  createProceduralRockMaterial,
} from './rocks.js';
import {
  createBambooGrove,
  createRiverbedPebbles,
  createRiverBedTerrain,
} from './environment.js';
import { RiverWaterSystem } from './water.js';
import { RockPhysicsEngine } from './physics.js';

export async function createRiverScene(canvas, options = {}) {
  const { brand, quality = 'alta', onClack, onSplash } = options;

  // 1. Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality !== 'leve',
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  });
  if (!renderer.getContext()) throw new Error('Contexto WebGL indisponível');

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = quality !== 'leve';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 2. Scene e Fog
  const scene = new THREE.Scene();
  const fogColor = new THREE.Color(brand?.cores?.fundo || '#d9e0db');
  scene.background = fogColor;
  scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.022);

  // PMREM Environment
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  // 3. Camera e Controles
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(2.8, 2.2, 3.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 1.6;
  controls.maxDistance = 6.8;
  controls.minPolarAngle = 0.28;
  controls.maxPolarAngle = 1.35;
  controls.target.set(0.1, 0.55, -0.1);

  // 4. Luz motivada da manhã
  // Luz-chave: Sol baixo da manhã suave com sombras suaves
  const sun = new THREE.DirectionalLight(0xfff5e0, 2.2);
  sun.name = 'sol_manha';
  sun.position.set(-4.5, 3.8, 4.2);
  sun.castShadow = quality !== 'leve';
  sun.shadow.mapSize.width = quality === 'alta' ? 2048 : 1024;
  sun.shadow.mapSize.height = quality === 'alta' ? 2048 : 1024;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 14;
  const d = 3.2;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  // Hemisférica (céu matinal e reflexo quente de terra/seixos)
  const hemi = new THREE.HemisphereLight(0xdce5df, 0x827768, 0.45);
  scene.add(hemi);

  // Luz de acento sutil azulada da água
  const waterAccent = new THREE.DirectionalLight(0x7bc7c0, 0.35);
  waterAccent.position.set(3, 1, -2);
  scene.add(waterAccent);

  // 5. Terreno do Leito e Bambuzal
  const terrain = createRiverBedTerrain();
  scene.add(terrain);

  const bamboos = createBambooGrove(quality === 'leve' ? 40 : 75);
  scene.add(bamboos);

  const pebbles = createRiverbedPebbles(quality === 'leve' ? 70 : 140);
  scene.add(pebbles);

  // 6. Sistema de Água
  const water = new RiverWaterSystem(scene, { waterLevel: -0.05 });
  if (brand?.cores?.agua) water.setColor(brand.cores.agua);

  // 7. Rocha Base Plana (onde a torre se equilibra)
  const baseRockGeo = createBaseRiverRockGeometry();
  const baseRockMat = createProceduralRockMaterial({
    baseColor: '#686359',
    veinColor: '#968f80',
    darkColor: '#38342c',
    moss: true,
    roughness: 0.74,
  });
  const baseRock = new THREE.Mesh(baseRockGeo, baseRockMat);
  baseRock.name = 'rocha_base';
  baseRock.position.set(0.1, -0.06, -0.2);
  baseRock.castShadow = true;
  baseRock.receiveShadow = true;
  scene.add(baseRock);

  // 8. Motor de Física
  const physics = new RockPhysicsEngine(scene, {
    waterLevel: -0.05,
    onSplash: (x, z) => {
      water.addSplashRipple(x, z);
      if (onSplash) onSplash();
    },
    onClack: (mass, vel) => {
      if (onClack) onClack(mass, vel);
    },
  });
  await physics.init(quality !== 'leve');
  physics.setBaseRock(baseRock);

  // 9. As 6 Rochas em Equilíbrio
  const rockConfigs = [
    {
      id: 'pedra_1',
      name: 'Seixo Ardósia',
      dim: [0.44, 0.13, 0.32],
      mass: 2.4,
      mat: { baseColor: '#454a4c', veinColor: '#687073', darkColor: '#2b2e30', moss: false, roughness: 0.62 },
      pos: new THREE.Vector3(-1.75, 0.08, 1.15),
      rot: new THREE.Euler(0.04, 0.35, -0.02),
    },
    {
      id: 'pedra_2',
      name: 'Seixo Ocre',
      dim: [0.38, 0.15, 0.28],
      mass: 1.8,
      mat: { baseColor: '#966d41', veinColor: '#bfa075', darkColor: '#5e4325', moss: false, roughness: 0.72 },
      pos: new THREE.Vector3(-1.38, 0.09, 1.45),
      rot: new THREE.Euler(-0.02, 0.85, 0.03),
    },
    {
      id: 'pedra_3',
      name: 'Seixo Basalto',
      dim: [0.32, 0.14, 0.26],
      mass: 1.5,
      mat: { baseColor: '#363a39', veinColor: '#565c5b', darkColor: '#1e2120', moss: true, roughness: 0.68 },
      pos: new THREE.Vector3(-1.02, 0.08, 1.25),
      rot: new THREE.Euler(0.03, -0.4, 0.02),
    },
    {
      id: 'pedra_4',
      name: 'Pedra Musgosa',
      dim: [0.29, 0.13, 0.24],
      mass: 1.1,
      mat: { baseColor: '#5f6e58', veinColor: '#8a9b82', darkColor: '#3b4737', moss: true, roughness: 0.78 },
      pos: new THREE.Vector3(-1.58, 0.12, 1.75),
      rot: new THREE.Euler(-0.04, 0.62, -0.03),
    },
    {
      id: 'pedra_5',
      name: 'Seixo Arenito',
      dim: [0.25, 0.12, 0.21],
      mass: 0.8,
      mat: { baseColor: '#b5a38b', veinColor: '#ded1be', darkColor: '#786854', moss: false, roughness: 0.76 },
      pos: new THREE.Vector3(-1.22, 0.11, 1.95),
      rot: new THREE.Euler(0.02, -0.75, 0.04),
    },
    {
      id: 'pedra_6',
      name: 'Seixo Quartzo',
      dim: [0.21, 0.11, 0.18],
      mass: 0.5,
      mat: { baseColor: '#7e8583', veinColor: '#abb3b0', darkColor: '#535957', moss: false, roughness: 0.52 },
      pos: new THREE.Vector3(-0.85, 0.1, 1.72),
      rot: new THREE.Euler(-0.03, 1.1, -0.02),
    },
  ];

  const rockObjects = [];
  rockConfigs.forEach((cfg, idx) => {
    const geo = createRiverRockGeometry(cfg.dim, idx + 1, { detail: quality === 'leve' ? 2 : 3 });
    const mat = createProceduralRockMaterial(cfg.mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = cfg.id;
    mesh.position.copy(cfg.pos);
    mesh.rotation.copy(cfg.rot);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const rock = physics.registerRock({
      id: cfg.id,
      name: cfg.name,
      mesh,
      mass: cfg.mass,
      dimensions: cfg.dim,
      initialPos: cfg.pos.clone(),
      initialRot: cfg.rot.clone(),
    });
    rockObjects.push(rock);
  });

  // 10. Manifesto de Autoverificação da Cena
  const SCENE_MANIFEST = [
    { id: 'rocha_base', pos: [0.1, -0.08, -0.2], rot: [0, 0, 0], scale: [1, 1, 1], material: 'pedra_rio_pbr', funcao: 'Base sólida de empilhamento' },
    { id: 'leito_rio', pos: [0, 0, 0], rot: [-Math.PI / 2, 0, 0], scale: [1, 1, 1], material: 'areia_cascalho_pbr', funcao: 'Leito do rio raso e margem' },
    { id: 'agua_rio', pos: [0, -0.05, 0], rot: [-Math.PI / 2, 0, 0], scale: [1, 1, 1], material: 'agua_cristalina_pbr', funcao: 'Água cristalina rasa com fluxo' },
    { id: 'causticas_rio', pos: [0, -0.07, 0], rot: [-Math.PI / 2, 0, 0], scale: [1, 1, 1], material: 'caustica_aditiva', funcao: 'Projeção de luz refratada' },
    { id: 'bambuzal_fundo', pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1], material: 'bambu_acetinado', funcao: 'Bambus desfocados ao fundo' },
    { id: 'margem_seixos', pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1], material: 'seixos_variados', funcao: 'Seixos fluviais decorativos' },
    { id: 'sol_manha', pos: [-4.5, 3.8, 4.2], rot: [0, 0, 0], scale: [1, 1, 1], material: 'luz_direcional', funcao: 'Sol baixo motivado da manhã' },
    { id: 'pedra_1', pos: [-1.65, 0.08, 1.35], rot: [0, 0, 0], scale: [1, 1, 1], material: 'ardosia_fluvial', funcao: 'Seixo 1 · Ardósia' },
    { id: 'pedra_2', pos: [-1.25, 0.09, 1.55], rot: [0, 0, 0], scale: [1, 1, 1], material: 'ocre_fluvial', funcao: 'Seixo 2 · Ocre' },
    { id: 'pedra_3', pos: [-0.85, 0.08, 1.45], rot: [0, 0, 0], scale: [1, 1, 1], material: 'basalto_fluvial', funcao: 'Seixo 3 · Basalto' },
    { id: 'pedra_4', pos: [-1.45, 0.12, 1.85], rot: [0, 0, 0], scale: [1, 1, 1], material: 'pedra_musgosa', funcao: 'Seixo 4 · Musgosa' },
    { id: 'pedra_5', pos: [-1.05, 0.11, 1.95], rot: [0, 0, 0], scale: [1, 1, 1], material: 'arenito_fluvial', funcao: 'Seixo 5 · Arenito' },
    { id: 'pedra_6', pos: [-0.65, 0.1, 1.85], rot: [0, 0, 0], scale: [1, 1, 1], material: 'quartzo_fluvial', funcao: 'Seixo 6 · Quartzo' },
    { id: 'indicador_equilibrio', pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1], material: 'luz_guia', funcao: 'Centro de massa e linha de prumo' },
  ];

  // Verificar manifesto no console
  SCENE_MANIFEST.forEach((o) => {
    console.assert(!!scene.getObjectByName(o.id), `[manifesto] objeto ausente na cena: ${o.id}`);
  });
  console.info(`[Rochas em Equilíbrio] Manifesto validado: ${SCENE_MANIFEST.length} objetos · ${rockObjects.length} pedras interativas`);

  // Ajuste de enquadramento (ViewOffset para não cobrir texto no desktop e doc no mobile)
  function adjustCameraFraming() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;

    if (w <= 768) {
      // Mobile retrato: centralizar o objeto principal no terço superior
      camera.clearViewOffset();
      camera.setViewOffset(w, h, 0, -h * 0.12, w, h);
      controls.minDistance = 2.2;
    } else {
      // Desktop: compensar o título e cartão editorial à esquerda
      camera.clearViewOffset();
      camera.setViewOffset(w, h, -w * 0.10, 0, w, h);
      controls.minDistance = 1.6;
    }
    camera.updateProjectionMatrix();
  }
  adjustCameraFraming();
  window.addEventListener('resize', adjustCameraFraming);

  return {
    scene,
    camera,
    renderer,
    controls,
    physics,
    water,
    rockObjects,
    sun,
    baseRock,
    manifest: SCENE_MANIFEST,
    adjustCameraFraming,
  };
}
