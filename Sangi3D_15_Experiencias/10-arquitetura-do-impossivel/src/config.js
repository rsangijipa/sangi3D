/**
 * Configuração espacial, sementes e constantes de Arquitetura do Impossível.
 * Mantém a câmera e seed iniciais alinhadas ao recorte de referência (cena.png).
 */

export const CONFIG = {
  slug: 'arquitetura-do-impossivel',
  title: 'Arquitetura do Impossível',
  seed: 44391,
  storageKey: 'sangi3d:15:10:v1',
  schemaVersion: 1,
  fixedDt: 1 / 60,
  maxSubsteps: 5,
  maxFrameDt: 0.05,
  eyeHeight: 1.65,
  playerRadius: 0.42,
  walkSpeed: 3.35,
  defaultFov: 60,
  minFov: 50,
  maxFov: 84,
  initialPose: {
    pos: [0, 1.65, 8.15],
    yaw: 0,
    pitch: -0.04,
    room: 'hub',
    gravityId: 'floor',
  },
  observationPoint: {
    x: 0,
    z: 3.8,
    range: 1.15,
  },
  galleryObservationPoint: {
    x: -26,
    z: 0.5,
    range: 1.35,
  },
  panoramicPose: {
    pos: [0, 11.4, 9.6],
    yaw: 0,
    pitch: -0.44,
  },
  qualityProfiles: {
    LOW: {
      label: 'Econômica',
      maxDpr: 1.0,
      shadows: false,
      shadowSize: 512,
      portalsLive: false,
      mirrorsLive: false,
      godrays: false,
      mirrorWidth: 256,
    },
    BALANCED: {
      label: 'Equilibrada',
      maxDpr: 1.45,
      shadows: true,
      shadowSize: 1024,
      portalsLive: true,
      mirrorsLive: true,
      godrays: true,
      mirrorWidth: 384,
    },
    HIGH: {
      label: 'Alta',
      maxDpr: 2.0,
      shadows: true,
      shadowSize: 2048,
      portalsLive: true,
      mirrorsLive: true,
      godrays: true,
      mirrorWidth: 512,
    },
  },
};

export const ROOMS = [
  {
    id: 'hub',
    name: 'Hub Central · Átrio do Compasso',
    shortName: 'Hub Central',
    rule: 'Observe o museu, escolha qualquer sala ou caminhe até o Ponto de Observação.',
    spawn: { pos: [0, 1.65, 8.15], yaw: 0, pitch: -0.04, gravityId: 'floor' },
    reverb: { decay: 2.1, wetness: 0.28, cutoff: 1400 },
  },
  {
    id: 'ponte',
    name: 'Sala 1 · Ponte Anamórfica',
    shortName: 'Ponte Anamórfica',
    rule: 'Gire o mecanismo em 90° e alinhe as plataformas a partir do Ponto de Observação.',
    spawn: { pos: [0, 1.65, 3.8], yaw: 0, pitch: -0.05, gravityId: 'floor' },
    reverb: { decay: 2.3, wetness: 0.34, cutoff: 1250 },
  },
  {
    id: 'galeria',
    name: 'Sala 2 · Galeria de Perspectivas',
    shortName: 'Galeria de Perspectivas',
    rule: 'Alinhe os fragmentos suspensos pelo ângulo correto para formar a rampa elevada.',
    spawn: { pos: [-26, 1.65, 5.2], yaw: 0, pitch: -0.05, gravityId: 'floor' },
    reverb: { decay: 1.75, wetness: 0.26, cutoff: 1650 },
  },
  {
    id: 'gravidade',
    name: 'Sala 3 · Escada de Gravidade Variável',
    shortName: 'Gravidade Variável',
    rule: 'Ative os selos gravitacionais para caminhar pelas paredes e pelo teto com segurança.',
    spawn: { pos: [20.0, 1.65, -4.0], yaw: -Math.PI / 2, pitch: -0.04, gravityId: 'floor' },
    reverb: { decay: 1.45, wetness: 0.22, cutoff: 1850 },
  },
  {
    id: 'portais',
    name: 'Sala 4 · Corredor de Portais',
    shortName: 'Corredor de Portais',
    rule: 'Atravesse os arcos de dobra espacial preservando sua direção relativa.',
    spawn: { pos: [0, 1.65, -16.8], yaw: 0, pitch: -0.03, gravityId: 'floor' },
    reverb: { decay: 1.2, wetness: 0.31, cutoff: 1100 },
  },
  {
    id: 'espelhos',
    name: 'Sala 5 · Salão de Espelhos',
    shortName: 'Salão de Espelhos',
    rule: 'Inspecione o prisma nos dois espelhos ortogonais para revelar o selo oculto.',
    spawn: { pos: [0, 1.65, -42.5], yaw: 0, pitch: -0.04, gravityId: 'floor' },
    reverb: { decay: 2.75, wetness: 0.38, cutoff: 2100 },
  },
];

export function rng(seed = CONFIG.seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
