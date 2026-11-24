import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGardenStore } from '../../store/useGardenStore';
import { SEEDS, SeedId } from '../../types/garden';
import { getGardenTextures } from '../../textures/proceduralTextures';

/**
 * Cria geometria de folha botânica realista com curvatura longitudinal,
 * leve concavidade transversal e ponta afilada (origem no pecíolo em y=0).
 */
function createOrganicLeafGeometry(
  length: number,
  maxWidth: number,
  arch: number,
  cup: number,
  widthSegments = 6,
  lengthSegments = 12
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(1, 1, widthSegments, lengthSegments);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    // PlaneGeometry vai de -0.5 a 0.5 em x e y
    const u = pos.getX(i) + 0.5; // 0..1 across width
    const v = pos.getY(i) + 0.5; // 0..1 base to tip

    // Silhueta lanceolada/ovada natural
    const widthProfile = Math.sin(Math.pow(v, 0.78) * Math.PI) * (1 - 0.14 * v);
    const localX = (u - 0.5) * 2 * (maxWidth * 0.5) * widthProfile;

    // Curvatura longitudinal suave (arqueia para fora e cai na ponta)
    const forwardZ = v * length;
    const droopY = Math.sin(v * Math.PI * 0.85) * arch * length - v * v * arch * 0.55 * length;

    // Leve formato de concha (V suave ao redor da nervura central)
    const distCenter = Math.abs(u - 0.5) * 2;
    const cupY = distCenter * distCenter * cup * widthProfile;

    // Leve ondulação orgânica na borda
    const edgeRipple = Math.sin(v * Math.PI * 5 + (u > 0.5 ? 0.6 : 0)) * 0.0022 * distCenter;

    pos.setXYZ(i, localX, droopY + cupY + edgeRipple, forwardZ);
    uv.setXY(i, u, v);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Cria geometria de pétala delicada com leve curvatura côncava.
 */
function createPetalGeometry(length = 0.036, width = 0.011): THREE.BufferGeometry {
  return createOrganicLeafGeometry(length, width, 0.18, 0.003, 4, 7);
}

/**
 * Cria um caule curvo afinado (TubeGeometry orgânico) saindo de (0,0,0) até o topo.
 */
function createCurvedStemGeometry(
  height: number,
  leanX: number,
  leanZ: number,
  baseRadius: number,
  tipRadius: number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(leanX * 0.25, height * 0.34, leanZ * 0.25),
    new THREE.Vector3(leanX * 0.72, height * 0.72, leanZ * 0.72),
    new THREE.Vector3(leanX, height, leanZ),
  ]);

  const tubularSegments = 14;
  const radialSegments = 7;
  const geo = new THREE.TubeGeometry(curve, tubularSegments, baseRadius, radialSegments, false);
  const pos = geo.attributes.position;
  const ringSize = radialSegments + 1;

  // Afina suavemente o caule da base até o topo
  for (let t = 0; t <= tubularSegments; t++) {
    const frac = t / tubularSegments;
    const center = curve.getPointAt(frac);
    const scale = THREE.MathUtils.lerp(1, tipRadius / baseRadius, frac);
    for (let r = 0; r < ringSize; r++) {
      const idx = t * ringSize + r;
      const vx = pos.getX(idx) - center.x;
      const vy = pos.getY(idx) - center.y;
      const vz = pos.getZ(idx) - center.z;
      pos.setXYZ(idx, center.x + vx * scale, center.y + vy * scale, center.z + vz * scale);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

interface LeafDef {
  y: number;
  angle: number;
  pitch: number;
  scale: number;
  appearAt: number;
  radialOffset: number;
  branchIndex: number;
}

interface BranchDef {
  height: number;
  leanX: number;
  leanZ: number;
  appearAt: number;
  hasBlossom: boolean;
  blossomOffset: number;
}

function buildBotanicalBlueprint(seedId: SeedId): {
  branches: BranchDef[];
  leaves: LeafDef[];
} {
  const isFern = seedId === 'samambaia';
  const isLavender = seedId === 'lavanda';
  const isSage = seedId === 'salvia';

  const branches: BranchDef[] = [
    // Caule central principal
    { height: isLavender ? 0.36 : isFern ? 0.28 : 0.31, leanX: 0.015, leanZ: 0.01, appearAt: 0.26, hasBlossom: true, blossomOffset: 0.0 },
    // Ramos secundários distribuídos em espiral orgânica
    { height: isLavender ? 0.33 : 0.27, leanX: -0.075, leanZ: 0.048, appearAt: 0.38, hasBlossom: true, blossomOffset: 0.04 },
    { height: isLavender ? 0.31 : 0.26, leanX: 0.078, leanZ: 0.052, appearAt: 0.42, hasBlossom: true, blossomOffset: 0.06 },
    { height: isLavender ? 0.29 : 0.25, leanX: -0.045, leanZ: -0.078, appearAt: 0.48, hasBlossom: true, blossomOffset: 0.09 },
    { height: isLavender ? 0.28 : 0.24, leanX: 0.064, leanZ: -0.068, appearAt: 0.52, hasBlossom: true, blossomOffset: 0.11 },
    // Ramos complementares de copa baixa
    { height: 0.2, leanX: -0.105, leanZ: -0.015, appearAt: 0.56, hasBlossom: !isSage, blossomOffset: 0.13 },
    { height: 0.19, leanX: 0.098, leanZ: -0.008, appearAt: 0.58, hasBlossom: !isSage, blossomOffset: 0.14 },
  ];

  const leaves: LeafDef[] = [];
  const goldenAngle = 2.3999632; // 137.5° filotaxia natural
  const totalLeaves = isFern ? 28 : isLavender ? 24 : 20;

  for (let i = 0; i < totalLeaves; i++) {
    const frac = i / totalLeaves;
    const branchIndex = i < 6 ? 0 : (i % branches.length);
    const angle = i * goldenAngle + (branchIndex * 0.45);
    const y = 0.045 + frac * (isFern ? 0.17 : 0.2);
    const pitch = isFern
      ? -0.38 + (1 - frac) * 0.42
      : isLavender
      ? -0.68 + (1 - frac) * 0.34
      : -0.46 + (1 - frac) * 0.44;
    const scale = isSage
      ? 0.9 + (1 - Math.abs(frac - 0.45)) * 0.52
      : isFern
      ? 0.85 + (1 - frac * 0.35) * 0.72
      : 0.75 + (1 - frac * 0.3) * 0.48;

    leaves.push({
      y,
      angle,
      pitch,
      scale,
      appearAt: 0.28 + frac * 0.36,
      radialOffset: 0.012 + frac * 0.025,
      branchIndex,
    });
  }

  return { branches, leaves };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Flor específica por espécie botânica (Camomila, Lavanda, Sálvia, Orvalho de Samambaia).
 */
const SpeciesBlossom: React.FC<{
  seedId: SeedId;
  petalGeo: THREE.BufferGeometry;
  blossomColor: string;
  centerColor: string;
}> = ({ seedId, petalGeo, blossomColor, centerColor }) => {
  if (seedId === 'camomila') {
    const petalCount = 11;
    return (
      <group>
        {/* Centro dourado levemente abaulado */}
        <mesh castShadow>
          <sphereGeometry args={[0.0145, 14, 10]} />
          <meshStandardMaterial color={centerColor} roughness={0.68} />
        </mesh>
        {/* Pétalas delicadas radiantes */}
        {Array.from({ length: petalCount }).map((_, idx) => {
          const a = (idx / petalCount) * Math.PI * 2;
          return (
            <group key={idx} rotation={[0, a, 0]}>
              <mesh
                geometry={petalGeo}
                position={[0, 0.001, 0.01]}
                rotation={[0.22 + (idx % 2) * 0.06, 0, 0]}
                castShadow
              >
                <meshPhysicalMaterial
                  color={blossomColor}
                  roughness={0.55}
                  sheen={0.35}
                  sheenColor="#fff7e6"
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    );
  }

  if (seedId === 'lavanda') {
    // Espiga vertical em verticilos de pequenos cálices violáceos
    return (
      <group>
        {[0, 0.018, 0.036, 0.054, 0.07].map((h, tier) => (
          <group key={tier} position={[0, h, 0]} scale={1 - tier * 0.13}>
            {[0, 1, 2, 3].map((k) => {
              const a = (k / 4) * Math.PI * 2 + tier * 0.78;
              return (
                <mesh
                  key={k}
                  position={[Math.cos(a) * 0.008, 0, Math.sin(a) * 0.008]}
                  rotation={[0.45, -a, 0]}
                  castShadow
                >
                  <capsuleGeometry args={[0.0046, 0.009, 4, 6]} />
                  <meshStandardMaterial
                    color={k % 2 === 0 ? blossomColor : centerColor}
                    roughness={0.62}
                  />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    );
  }

  if (seedId === 'salvia') {
    // Racemo quente de flores labiadas em terracota-coral e âmbar
    return (
      <group>
        {[0, 0.022, 0.044].map((h, tier) => (
          <group key={tier} position={[0, h, 0]} scale={1 - tier * 0.16}>
            {[0, 1, 2].map((k) => {
              const a = (k / 3) * Math.PI * 2 + tier * 1.05;
              return (
                <group key={k} rotation={[0, a, 0]}>
                  <mesh
                    geometry={petalGeo}
                    position={[0, 0, 0.006]}
                    rotation={[-0.25, 0, 0]}
                    scale={[1.15, 1.15, 0.9]}
                    castShadow
                  >
                    <meshPhysicalMaterial
                      color={blossomColor}
                      roughness={0.58}
                      sheen={0.4}
                      sheenColor="#f5c6a5"
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                  <mesh position={[0, 0.005, 0.015]}>
                    <sphereGeometry args={[0.005, 8, 8]} />
                    <meshStandardMaterial color={centerColor} roughness={0.5} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    );
  }

  // Samambaia de Orvalho: espiral delicada (báculo) com gotículas luminosas no contraluz
  return (
    <group>
      <mesh rotation={[0.4, 0, 0]} castShadow>
        <torusGeometry args={[0.013, 0.0036, 8, 16, Math.PI * 1.65]} />
        <meshStandardMaterial color="#6d944c" roughness={0.52} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[Math.cos(i * 2.1) * 0.012, 0.008 + i * 0.004, Math.sin(i * 2.1) * 0.012]}
        >
          <sphereGeometry args={[0.0042, 10, 10]} />
          <meshPhysicalMaterial
            color="#f5f1da"
            roughness={0.08}
            transmission={0.85}
            thickness={0.02}
            ior={1.33}
            emissive={blossomColor}
            emissiveIntensity={0.28}
          />
        </mesh>
      ))}
    </group>
  );
};

export const HeroPlant: React.FC = () => {
  const seedId = useGardenStore((s) => s.seedId);
  const spec = SEEDS[seedId];
  const textures = useMemo(() => getGardenTextures(), []);

  const rootRef = useRef<THREE.Group>(null);
  const seedRef = useRef<THREE.Mesh>(null);
  const sproutRef = useRef<THREE.Group>(null);
  const branchRefs = useRef<(THREE.Group | null)[]>([]);
  const leafRefs = useRef<(THREE.Group | null)[]>([]);
  const blossomRefs = useRef<(THREE.Group | null)[]>([]);
  const fallenLeavesRef = useRef<THREE.Group>(null);

  const sharedLeafMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: textures.leaf.map,
        normalMap: textures.leaf.normalMap,
        normalScale: new THREE.Vector2(0.7, 0.7),
        roughnessMap: textures.leaf.roughnessMap,
        color: new THREE.Color(spec.leafColor),
        roughness: 0.48,
        metalness: 0.02,
        sheen: 0.32,
        sheenColor: new THREE.Color('#c6d99e'),
        emissive: new THREE.Color(spec.leafHighlight),
        emissiveIntensity: 0.12,
        side: THREE.DoubleSide,
      }),
    [textures, spec.leafColor, spec.leafHighlight]
  );

  const sharedStemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.stemColor),
        roughness: 0.74,
        metalness: 0.02,
      }),
    [spec.stemColor]
  );

  useEffect(() => {
    return () => {
      sharedLeafMat.dispose();
      sharedStemMat.dispose();
    };
  }, [sharedLeafMat, sharedStemMat]);

  const blueprint = useMemo(() => buildBotanicalBlueprint(seedId), [seedId]);

  // Geometrias específicas por espécie
  const geometries = useMemo(() => {
    const isLavender = seedId === 'lavanda';
    const isSage = seedId === 'salvia';
    const isFern = seedId === 'samambaia';

    const mainLeaf = createOrganicLeafGeometry(
      isFern ? 0.155 : isLavender ? 0.115 : isSage ? 0.125 : 0.105,
      isFern ? 0.048 : isLavender ? 0.018 : isSage ? 0.056 : 0.04,
      isFern ? 0.42 : isLavender ? 0.16 : 0.28,
      isSage ? 0.012 : 0.008
    );

    const cotyledon = createOrganicLeafGeometry(0.044, 0.024, 0.22, 0.004, 4, 8);
    const petal = createPetalGeometry(0.036, 0.011);
    const branchGeos = blueprint.branches.map((b, idx) =>
      createCurvedStemGeometry(
        b.height,
        b.leanX,
        b.leanZ,
        idx === 0 ? 0.0068 : 0.0046,
        idx === 0 ? 0.0024 : 0.0018
      )
    );
    const sproutStem = createCurvedStemGeometry(0.072, 0.008, 0.006, 0.0042, 0.0024);

    return { mainLeaf, cotyledon, petal, branchGeos, sproutStem };
  }, [seedId, blueprint]);

  useEffect(() => {
    return () => {
      geometries.mainLeaf.dispose();
      geometries.cotyledon.dispose();
      geometries.petal.dispose();
      geometries.sproutStem.dispose();
      geometries.branchGeos.forEach((g) => g.dispose());
    };
  }, [geometries]);

  // Cores para transição orgânica até o estágio de Recolhimento (âmbar/ouro seco)
  const freshLeafColor = useMemo(() => new THREE.Color(spec.leafColor), [spec.leafColor]);
  const autumnLeafColor = useMemo(() => new THREE.Color('#9c7b46'), []);
  const freshStemColor = useMemo(() => new THREE.Color(spec.stemColor), [spec.stemColor]);
  const autumnStemColor = useMemo(() => new THREE.Color('#77613e'), []);
  const backlightTint = useMemo(() => new THREE.Color(spec.leafHighlight), [spec.leafHighlight]);
  const workingColor = useMemo(() => new THREE.Color(), []);

  const smoothProgress = useRef(useGardenStore.getState().growthProgress);
  const smoothLean = useRef(0);

  useFrame((state, delta) => {
    const store = useGardenStore.getState();
    store.tickSimulation(Math.min(delta, 0.1));

    const t = state.clock.elapsedTime;
    const nowPerf = performance.now() / 1000;
    const reduced = store.reducedMotion;

    // Interpolação sedosa do crescimento
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      store.growthProgress,
      Math.min(1, delta * 3.0)
    );
    const p = smoothProgress.current;

    // Fator de recolhimento (0.86 -> 1.0)
    const retreat = smoothstep(0.85, 1.0, p);

    // Fototropismo suave (planta se inclina delicadamente na direção do sol lateral)
    const targetSunLean = (store.lightCycle - 0.5) * -0.18;
    smoothLean.current = THREE.MathUtils.lerp(smoothLean.current, targetSunLean, Math.min(1, delta * 1.6));

    // Pulso delicado quando usuário toca na planta
    const touchAge = nowPerf - store.leafTouchPulse;
    const touchWave =
      !reduced && touchAge > 0 && touchAge < 1.8
        ? Math.sin(touchAge * 9.5) * Math.exp(-touchAge * 2.4) * 0.045
        : 0;

    // Balanço botânico mínimo na brisa da estufa
    const swayX = reduced ? 0 : Math.sin(t * 0.72) * 0.014 + Math.sin(t * 1.45) * 0.005;
    const swayZ = reduced ? 0 : Math.cos(t * 0.58) * 0.012;

    if (rootRef.current) {
      rootRef.current.rotation.z = smoothLean.current + swayX + touchWave;
      rootRef.current.rotation.x = swayZ + retreat * 0.09;
    }

    // 1. Animação da semente sendo depositada e afundando na terra
    if (seedRef.current) {
      const seedVisible = p < 0.22;
      seedRef.current.visible = seedVisible;
      if (seedVisible) {
        if (store.isPlantingAnim) {
          const animElapsed = Math.max(0, nowPerf - store.plantingStartTime);
          const dropT = Math.min(1, animElapsed / 1.35);
          const easeDrop = 1 - Math.pow(1 - dropT, 3);
          const sinkT = smoothstep(1.2, 2.5, animElapsed);
          const dropY = THREE.MathUtils.lerp(0.28, 0.012, easeDrop) - sinkT * 0.014;
          const arcX = Math.sin((1 - easeDrop) * Math.PI * 0.5) * -0.09;
          seedRef.current.position.set(arcX, dropY, 0.01 * (1 - easeDrop));
          seedRef.current.rotation.set(easeDrop * 2.4, easeDrop * 1.6, 0.4);
          seedRef.current.scale.set(...spec.seedScale);
        } else {
          const sink = smoothstep(0.06, 0.2, p);
          seedRef.current.position.set(0, 0.014 - sink * 0.028, 0);
          const s = 1 - sink * 0.65;
          seedRef.current.scale.set(spec.seedScale[0] * s, spec.seedScale[1] * s, spec.seedScale[2] * s);
        }
      }
    }

    // 2. Broto inicial (cotilédones emergindo da terra: 0.14 -> 0.46)
    if (sproutRef.current) {
      const emerge = smoothstep(0.13, 0.34, p);
      const fadeIntoMature = 1 - smoothstep(0.62, 0.84, p) * 0.45;
      sproutRef.current.visible = emerge > 0.005;
      if (emerge > 0.005) {
        const s = emerge * fadeIntoMature;
        sproutRef.current.scale.set(s, s, s);
        sproutRef.current.position.y = -0.022 * (1 - emerge);
      }
    }

    // 3. Ramos & Florescimento
    blueprint.branches.forEach((b, idx) => {
      const grp = branchRefs.current[idx];
      if (!grp) return;
      const g = smoothstep(b.appearAt, b.appearAt + 0.26, p);
      grp.visible = g > 0.005;
      if (g > 0.005) {
        const scaleY = g;
        const scaleXZ = 0.4 + 0.6 * g;
        grp.scale.set(scaleXZ, scaleY, scaleXZ);
        // Leve curvatura serena no recolhimento
        const droop = retreat * (0.14 + idx * 0.02);
        const branchBreeze = reduced ? 0 : Math.sin(t * 0.9 + idx * 1.1) * 0.012;
        grp.rotation.z = branchBreeze + droop * (b.leanX >= 0 ? -1 : 1);
        grp.rotation.x = droop * 0.6;
      }

      // Flores no topo de cada ramo
      const bl = blossomRefs.current[idx];
      if (bl) {
        const bloomStart = 0.64 + b.blossomOffset;
        const open = smoothstep(bloomStart, bloomStart + 0.17, p);
        const closeInRetreat = 1 - retreat * 0.42;
        bl.visible = open > 0.01;
        if (open > 0.01) {
          const s = open * closeInRetreat;
          bl.scale.set(s, s, s);
          bl.rotation.x = retreat * 0.45;
        }
      }
    });

    // 4. Folhas com filotaxia e balanço mínimo individual
    blueprint.leaves.forEach((lf, idx) => {
      const grp = leafRefs.current[idx];
      if (!grp) return;
      const grow = smoothstep(lf.appearAt, lf.appearAt + 0.2, p);
      grp.visible = grow > 0.005;
      if (grow > 0.005) {
        const shrinkRetreat = 1 - retreat * 0.14;
        const s = lf.scale * grow * shrinkRetreat;
        grp.scale.set(s, s, s);
        const flutter = reduced ? 0 : Math.sin(t * 1.25 + idx * 0.85) * 0.018;
        grp.rotation.x = lf.pitch + (1 - grow) * -0.45 + retreat * 0.26 + flutter;
      }
    });

    // 5. Folhas secas pousadas na terra durante o Recolhimento (ou Outono)
    if (fallenLeavesRef.current) {
      const fallenOpacity = Math.max(retreat, store.seasonId === 'outono' ? 0.55 : 0);
      fallenLeavesRef.current.visible = fallenOpacity > 0.15;
      const fs = smoothstep(0.15, 0.85, fallenOpacity);
      fallenLeavesRef.current.scale.set(fs, fs, fs);
    }

    // 6. Atualização de cor orgânica e translucidez no contraluz (material compartilhado)
    const autumnFactor = retreat * 0.72 + (store.seasonId === 'outono' ? 0.2 : 0);
    workingColor.copy(freshLeafColor).lerp(autumnLeafColor, Math.min(0.85, autumnFactor));
    sharedLeafMat.color.copy(workingColor);

    const sunStrength = Math.sin(store.lightCycle * Math.PI);
    sharedLeafMat.emissive.copy(backlightTint);
    sharedLeafMat.emissiveIntensity = 0.06 + sunStrength * 0.14 * (1 - retreat * 0.5);

    workingColor.copy(freshStemColor).lerp(autumnStemColor, retreat * 0.65);
    sharedStemMat.color.copy(workingColor);
  });

  return (
    <group
      ref={rootRef}
      name="hero-plant"
      position={[0, 0.285, 0]}
      onClick={(e) => {
        e.stopPropagation();
        useGardenStore.getState().pulseLeafTouch();
      }}
    >
      {/* Semente detalhada da espécie escolhida */}
      <mesh ref={seedRef} castShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={spec.seedColor}
          roughness={0.62}
          metalness={0.04}
        />
      </mesh>

      {/* Broto inicial com 2 cotilédones translúcidos */}
      <group ref={sproutRef}>
        <mesh geometry={geometries.sproutStem} castShadow>
          <meshStandardMaterial color="#7da259" roughness={0.55} />
        </mesh>
        <group position={[0.008, 0.07, 0.006]}>
          <mesh
            geometry={geometries.cotyledon}
            rotation={[0.22, 0.4, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              map={textures.leaf.map}
              normalMap={textures.leaf.normalMap}
              roughnessMap={textures.leaf.roughnessMap}
              color="#7ca658"
              roughness={0.44}
              sheen={0.35}
              sheenColor="#cbe09a"
              emissive="#648c3e"
              emissiveIntensity={0.14}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh
            geometry={geometries.cotyledon}
            rotation={[0.26, Math.PI + 0.35, 0]}
            castShadow
          >
            <meshPhysicalMaterial
              map={textures.leaf.map}
              normalMap={textures.leaf.normalMap}
              roughnessMap={textures.leaf.roughnessMap}
              color="#7ca658"
              roughness={0.44}
              sheen={0.35}
              sheenColor="#cbe09a"
              emissive="#648c3e"
              emissiveIntensity={0.14}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Ramos curvos e flores nas pontas */}
      {blueprint.branches.map((b, idx) => (
        <group
          key={`branch-${seedId}-${idx}`}
          ref={(el) => {
            branchRefs.current[idx] = el;
          }}
        >
          <mesh geometry={geometries.branchGeos[idx]} material={sharedStemMat} castShadow receiveShadow />
          {b.hasBlossom && (
            <group
              ref={(el) => {
                blossomRefs.current[idx] = el;
              }}
              position={[b.leanX, b.height, b.leanZ]}
              rotation={[0.12, idx * 1.1, 0]}
            >
              <SpeciesBlossom
                seedId={seedId}
                petalGeo={geometries.petal}
                blossomColor={spec.blossomColor}
                centerColor={spec.blossomCenter}
              />
            </group>
          )}
        </group>
      ))}

      {/* Copa de folhas orgânicas com mapa de nervuras e translucidez controlada */}
      {blueprint.leaves.map((lf, idx) => {
        const parentBranch = blueprint.branches[lf.branchIndex];
        const fracY = Math.min(0.85, lf.y / parentBranch.height);
        const bx = parentBranch.leanX * fracY * 0.8 + Math.cos(lf.angle) * lf.radialOffset;
        const bz = parentBranch.leanZ * fracY * 0.8 + Math.sin(lf.angle) * lf.radialOffset;
        return (
          <group
            key={`leaf-${seedId}-${idx}`}
            position={[bx, lf.y, bz]}
            rotation={[0, lf.angle, 0]}
          >
            <group
              ref={(el) => {
                leafRefs.current[idx] = el;
              }}
            >
              <mesh geometry={geometries.mainLeaf} material={sharedLeafMat} castShadow receiveShadow />
            </group>
          </group>
        );
      })}

      {/* Folhas secas delicadas repousando sobre a terra no Recolhimento */}
      <group ref={fallenLeavesRef} position={[0, 0.008, 0]}>
        {[
          { pos: [0.11, 0.004, 0.09] as [number, number, number], rot: [0.12, 0.7, 0.15] as [number, number, number] },
          { pos: [-0.13, 0.002, 0.06] as [number, number, number], rot: [-0.1, 2.3, -0.08] as [number, number, number] },
          { pos: [0.05, 0.002, -0.14] as [number, number, number], rot: [0.08, -1.2, 0.1] as [number, number, number] },
        ].map((fl, i) => (
          <mesh
            key={i}
            geometry={geometries.cotyledon}
            position={fl.pos}
            rotation={fl.rot}
            scale={[1.45, 1.45, 1.45]}
            receiveShadow
          >
            <meshStandardMaterial
              map={textures.leaf.map}
              normalMap={textures.leaf.normalMap}
              color="#9a6b3d"
              roughness={0.86}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
