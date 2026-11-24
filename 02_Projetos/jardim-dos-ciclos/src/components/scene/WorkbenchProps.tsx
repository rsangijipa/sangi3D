import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGardenStore } from '../../store/useGardenStore';
import { CarePropId, INITIAL_PROP_LAYOUTS, SEEDS } from '../../types/garden';
import { getGardenTextures } from '../../textures/proceduralTextures';

function useSmoothPropTransform(
  propId: CarePropId,
  groupRef: React.RefObject<THREE.Group | null>,
  overrideAnim?: (grp: THREE.Group, elapsed: number, delta: number) => boolean
) {
  useFrame((state, delta) => {
    const grp = groupRef.current;
    if (!grp) return;
    if (overrideAnim && overrideAnim(grp, state.clock.elapsedTime, delta)) {
      return;
    }
    const idx = useGardenStore.getState().propSlotIndex[propId] ?? 0;
    const layout = INITIAL_PROP_LAYOUTS[propId][idx] ?? INITIAL_PROP_LAYOUTS[propId][0];
    const k = Math.min(1, delta * 4.5);
    grp.position.x = THREE.MathUtils.lerp(grp.position.x, layout.position[0], k);
    grp.position.y = THREE.MathUtils.lerp(grp.position.y, layout.position[1], k);
    grp.position.z = THREE.MathUtils.lerp(grp.position.z, layout.position[2], k);
    grp.rotation.x = THREE.MathUtils.lerp(grp.rotation.x, 0, k);
    grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, layout.rotationY, k);
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, 0, k);
  });
}

// ---------------------------------------------------------------------------
// 1. REGADOR DE COBRE ENVELHECIDO (com animação suave de rega)
// ---------------------------------------------------------------------------
const CopperWateringCan: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const geometries = useMemo(() => {
    // Corpo cônico artesanal em cobre
    const bodyProfile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.115, 0.0),
      new THREE.Vector2(0.118, 0.015),
      new THREE.Vector2(0.108, 0.14),
      new THREE.Vector2(0.095, 0.235),
      new THREE.Vector2(0.101, 0.246), // borda dobrada
      new THREE.Vector2(0.088, 0.248),
      new THREE.Vector2(0.084, 0.22),
      new THREE.Vector2(0.0, 0.22),
    ];
    const body = new THREE.LatheGeometry(bodyProfile, 36);

    // Bico longo e elegante
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.095, 0.055, 0),
      new THREE.Vector3(0.185, 0.115, 0),
      new THREE.Vector3(0.275, 0.215, 0),
      new THREE.Vector3(0.325, 0.265, 0),
    ]);
    const spout = new THREE.TubeGeometry(spoutCurve, 20, 0.013, 10, false);
    const spPos = spout.attributes.position;
    const ring = 11;
    for (let t = 0; t <= 20; t++) {
      const f = t / 20;
      const c = spoutCurve.getPointAt(f);
      const s = THREE.MathUtils.lerp(1.35, 0.58, f);
      for (let r = 0; r < ring; r++) {
        const i = t * ring + r;
        spPos.setXYZ(
          i,
          c.x + (spPos.getX(i) - c.x) * s,
          c.y + (spPos.getY(i) - c.y) * s,
          c.z + (spPos.getZ(i) - c.z) * s
        );
      }
    }
    spout.computeVertexNormals();

    // Alça traseira arqueada
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.085, 0.225, 0),
      new THREE.Vector3(-0.185, 0.25, 0),
      new THREE.Vector3(-0.205, 0.14, 0),
      new THREE.Vector3(-0.155, 0.045, 0),
      new THREE.Vector3(-0.108, 0.04, 0),
    ]);
    const handle = new THREE.TubeGeometry(handleCurve, 22, 0.0085, 8, false);

    // Alça superior sutil
    const topHandleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.085, 0.24, 0),
      new THREE.Vector3(-0.015, 0.305, 0),
      new THREE.Vector3(0.068, 0.242, 0),
    ]);
    const topHandle = new THREE.TubeGeometry(topHandleCurve, 16, 0.007, 8, false);

    return { body, spout, handle, topHandle };
  }, []);

  useEffect(() => {
    return () => {
      geometries.body.dispose();
      geometries.spout.dispose();
      geometries.handle.dispose();
      geometries.topHandle.dispose();
    };
  }, [geometries]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useSmoothPropTransform('regador', groupRef, (grp, _elapsed, delta) => {
    const store = useGardenStore.getState();
    if (!store.isWateringAnim || store.wateringMode !== 'regador') return false;

    const now = performance.now() / 1000;
    const t = Math.max(0, Math.min(1, (now - store.wateringStartTime) / 3.2));
    // Curva suave: sobe -> inclina sobre o vaso -> retorna
    const lift = Math.sin(Math.min(1, t * 1.15) * Math.PI);
    const tilt = t > 0.18 && t < 0.82 ? Math.sin(((t - 0.18) / 0.64) * Math.PI) : 0;

    const k = Math.min(1, delta * 5.2);
    grp.position.x = THREE.MathUtils.lerp(grp.position.x, 0.44, k);
    grp.position.y = THREE.MathUtils.lerp(grp.position.y, 0.44 + lift * 0.08, k);
    grp.position.z = THREE.MathUtils.lerp(grp.position.z, 0.08, k);
    grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, Math.PI - 0.12, k);
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, -0.44 * tilt, k);
    return true;
  });

  const copperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: textures.copper.map,
        normalMap: textures.copper.normalMap,
        normalScale: new THREE.Vector2(0.45, 0.45),
        roughnessMap: textures.copper.roughnessMap,
        roughness: 0.42,
        metalness: 0.84,
        color: new THREE.Color('#d89974'),
      }),
    [textures]
  );

  useEffect(() => () => copperMat.dispose(), [copperMat]);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.regador[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.regador[0].rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        const st = useGardenStore.getState();
        if (st.rearrangeMode) {
          st.cyclePropSlot('regador');
        } else {
          st.triggerWatering('regador');
        }
      }}
    >
      <mesh geometry={geometries.body} material={copperMat} castShadow receiveShadow />
      <mesh geometry={geometries.spout} material={copperMat} castShadow />
      <mesh geometry={geometries.handle} material={copperMat} castShadow />
      <mesh geometry={geometries.topHandle} material={copperMat} castShadow />
      {/* Crivo / ponta delicada do regador */}
      <mesh position={[0.338, 0.276, 0]} rotation={[0, 0, -0.78]} castShadow>
        <cylinderGeometry args={[0.022, 0.011, 0.026, 16]} />
        <meshStandardMaterial color="#b48358" roughness={0.38} metalness={0.86} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 2. BORRIFADOR DELICADO (Vidro âmbar antigo + gatilho em latão)
// ---------------------------------------------------------------------------
const DelicateMister: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const bottleGeo = useMemo(() => {
    const profile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.044, 0.0),
      new THREE.Vector2(0.048, 0.015),
      new THREE.Vector2(0.049, 0.088),
      new THREE.Vector2(0.036, 0.118),
      new THREE.Vector2(0.018, 0.132),
      new THREE.Vector2(0.018, 0.148),
      new THREE.Vector2(0.014, 0.148),
    ];
    return new THREE.LatheGeometry(profile, 24);
  }, []);

  useEffect(() => () => bottleGeo.dispose(), [bottleGeo]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useSmoothPropTransform('borrifador', groupRef, (grp, _elapsed, delta) => {
    const store = useGardenStore.getState();
    if (!store.isWateringAnim || store.wateringMode !== 'borrifador') return false;
    const k = Math.min(1, delta * 5.0);
    grp.position.x = THREE.MathUtils.lerp(grp.position.x, 0.34, k);
    grp.position.y = THREE.MathUtils.lerp(grp.position.y, 0.44, k);
    grp.position.z = THREE.MathUtils.lerp(grp.position.z, 0.18, k);
    grp.rotation.y = THREE.MathUtils.lerp(grp.rotation.y, Math.PI + 0.35, k);
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, -0.18, k);
    return true;
  });

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.borrifador[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.borrifador[0].rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        const st = useGardenStore.getState();
        if (st.rearrangeMode) {
          st.cyclePropSlot('borrifador');
        } else {
          st.triggerWatering('borrifador');
        }
      }}
    >
      {/* Frasco de vidro delicado */}
      <mesh geometry={bottleGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#a8b59c"
          roughnessMap={textures.glassRoughness}
          roughness={0.14}
          transmission={0.82}
          thickness={0.04}
          ior={1.48}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Nível de água interior */}
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.072, 18]} />
        <meshPhysicalMaterial
          color="#cfe0d6"
          roughness={0.08}
          transmission={0.85}
          transparent
          opacity={0.48}
        />
      </mesh>
      {/* Colarinho e mecanismo em latão/cobre envelhecido */}
      <mesh position={[0, 0.156, 0]} castShadow>
        <cylinderGeometry args={[0.019, 0.02, 0.024, 16]} />
        <meshStandardMaterial color="#b48a54" roughness={0.35} metalness={0.86} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.032, 14]} />
        <meshStandardMaterial color="#a67c46" roughness={0.38} metalness={0.85} />
      </mesh>
      {/* Bico aspersor */}
      <mesh position={[0.026, 0.184, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.0055, 0.044, 10]} />
        <meshStandardMaterial color="#b48a54" roughness={0.35} metalness={0.86} />
      </mesh>
      {/* Argola de polegar */}
      <mesh position={[-0.024, 0.165, 0]}>
        <torusGeometry args={[0.016, 0.0028, 8, 18]} />
        <meshStandardMaterial color="#a67c46" roughness={0.4} metalness={0.85} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 3. GOTAS FÍSICAS LEVES / NÉVOA DE ÁGUA (InstancedMesh analítico)
// ---------------------------------------------------------------------------
const WaterDroplets: React.FC = () => {
  const count = 72;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dropGeo = useMemo(() => new THREE.SphereGeometry(0.0055, 7, 7), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Parâmetros determinísticos por gota
  const drops = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      phase: (i / count) * 1.0,
      spreadX: (Math.sin(i * 12.9898) * 43758.5453) % 1,
      spreadZ: (Math.cos(i * 78.233) * 19341.213) % 1,
      speed: 0.9 + ((i * 7) % 11) * 0.04,
    }));
  }, []);

  useEffect(() => () => dropGeo.dispose(), [dropGeo]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const store = useGardenStore.getState();

    if (!store.isWateringAnim) {
      if (mesh.visible) mesh.visible = false;
      return;
    }

    const now = performance.now() / 1000;
    const elapsed = now - store.wateringStartTime;
    const isMist = store.wateringMode === 'borrifador';
    const activeStart = isMist ? 0.25 : 0.45;
    const activeEnd = isMist ? 1.85 : 2.65;

    if (elapsed < activeStart || elapsed > activeEnd) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    const intensity = store.waterIntensity;
    const activeCount = Math.floor(count * (isMist ? 0.95 : 0.45 + intensity * 0.55));

    for (let i = 0; i < count; i++) {
      if (i >= activeCount) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const d = drops[i];
      const life = ((elapsed * (isMist ? 1.45 : 1.75) * d.speed) + d.phase) % 1;

      if (isMist) {
        // Névoa fina flutuante vinda do borrifador
        const x = THREE.MathUtils.lerp(0.29, -0.04 + d.spreadX * 0.24, life);
        const y = THREE.MathUtils.lerp(0.61, 0.34 + d.spreadZ * 0.14, life) - life * life * 0.08;
        const z = THREE.MathUtils.lerp(0.16, d.spreadZ * 0.22, life);
        const s = Math.sin(life * Math.PI) * 0.52;
        dummy.position.set(x, y, z);
        dummy.scale.set(s, s, s);
      } else {
        // Arco físico parabólico saindo do crivo do regador até a terra
        const startX = 0.14;
        const startY = 0.62;
        const startZ = 0.05;
        const x = startX - life * (0.14 + d.spreadX * 0.09);
        const z = startZ + (d.spreadZ - 0.3) * 0.14 * life;
        const y = startY - life * 0.08 - life * life * 0.29;
        const stretch = 1.0 + life * 1.4;
        const s = y > 0.275 ? 0.85 : 0;
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0.35);
        dummy.scale.set(s * 0.72, s * stretch, s * 0.72);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[dropGeo, undefined, count]} visible={false}>
      <meshPhysicalMaterial
        color="#e9f4f5"
        roughness={0.05}
        metalness={0.05}
        transmission={0.85}
        transparent
        opacity={0.78}
        emissive="#fff3d6"
        emissiveIntensity={0.22}
      />
    </instancedMesh>
  );
};

// ---------------------------------------------------------------------------
// 4. TIGELA COM SEMENTES VARIADAS (Cerâmica esmaltada + InstancedMesh)
// ---------------------------------------------------------------------------
const SeedBowl: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const seedsRef = useRef<THREE.InstancedMesh>(null);
  const [hovered, setHovered] = useState(false);

  const bowlGeo = useMemo(() => {
    const profile = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.068, 0.0),
      new THREE.Vector2(0.096, 0.022),
      new THREE.Vector2(0.114, 0.052),
      new THREE.Vector2(0.116, 0.062),
      new THREE.Vector2(0.106, 0.064),
      new THREE.Vector2(0.092, 0.036),
      new THREE.Vector2(0.055, 0.015),
      new THREE.Vector2(0.0, 0.014),
    ];
    return new THREE.LatheGeometry(profile, 32);
  }, []);

  const seedGeo = useMemo(() => new THREE.DodecahedronGeometry(0.0085, 1), []);

  useEffect(() => {
    if (!seedsRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const palette = [
      SEEDS.camomila.seedColor,
      SEEDS.lavanda.seedColor,
      SEEDS.salvia.seedColor,
      SEEDS.samambaia.seedColor,
    ];
    let s = 9001;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    for (let i = 0; i < 42; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 0.072;
      const y = 0.022 + (1 - r / 0.08) * 0.014 + rand() * 0.008;
      dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3);
      dummy.scale.set(0.75 + rand() * 0.5, 1.15 + rand() * 0.5, 0.65 + rand() * 0.4);
      dummy.updateMatrix();
      seedsRef.current.setMatrixAt(i, dummy.matrix);

      color.set(palette[i % palette.length]);
      seedsRef.current.setColorAt(i, color);
    }
    seedsRef.current.instanceMatrix.needsUpdate = true;
    if (seedsRef.current.instanceColor) seedsRef.current.instanceColor.needsUpdate = true;
  }, []);

  useEffect(() => {
    return () => {
      bowlGeo.dispose();
      seedGeo.dispose();
    };
  }, [bowlGeo, seedGeo]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useSmoothPropTransform('tigela', groupRef);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.tigela[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.tigela[0].rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        const st = useGardenStore.getState();
        if (st.rearrangeMode) {
          st.cyclePropSlot('tigela');
        } else {
          st.setActivePanel('plantar');
        }
      }}
    >
      <mesh geometry={bowlGeo} castShadow receiveShadow>
        <meshStandardMaterial color="#d8cec0" roughness={0.48} metalness={0.04} />
      </mesh>
      <instancedMesh ref={seedsRef} args={[seedGeo, undefined, 42]} receiveShadow>
        <meshStandardMaterial roughness={0.62} metalness={0.05} />
      </instancedMesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 5. CADERNO DE REGISTROS COM CAPA DE TECIDO + LÁPIS
// ---------------------------------------------------------------------------
const BotanicalJournal: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useSmoothPropTransform('caderno', groupRef);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.caderno[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.caderno[0].rotationY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        const st = useGardenStore.getState();
        if (st.rearrangeMode) {
          st.cyclePropSlot('caderno');
        } else {
          st.setActivePanel('registro');
        }
      }}
    >
      {/* Capa inferior */}
      <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.006, 0.31]} />
        <meshStandardMaterial
          map={textures.linen.map}
          normalMap={textures.linen.normalMap}
          roughnessMap={textures.linen.roughnessMap}
          color="#6d6958"
          roughness={0.92}
        />
      </mesh>
      {/* Miolo de papel creme */}
      <mesh position={[0.004, 0.019, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.226, 0.022, 0.296]} />
        <meshStandardMaterial color="#ece3d0" roughness={0.9} />
      </mesh>
      {/* Capa superior de tecido */}
      <mesh position={[0, 0.033, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.006, 0.31]} />
        <meshStandardMaterial
          map={textures.linen.map}
          normalMap={textures.linen.normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={textures.linen.roughnessMap}
          color="#797461"
          roughness={0.92}
        />
      </mesh>
      {/* Lombada arredondada */}
      <mesh position={[-0.12, 0.019, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.017, 0.017, 0.31, 14]} />
        <meshStandardMaterial
          map={textures.linen.map}
          normalMap={textures.linen.normalMap}
          color="#686452"
          roughness={0.92}
        />
      </mesh>
      {/* Fita marcadora em terracota suave */}
      <mesh position={[0.055, 0.016, 0.168]} rotation={[0.12, 0.22, 0]}>
        <boxGeometry args={[0.012, 0.002, 0.068]} />
        <meshStandardMaterial color="#a95a3f" roughness={0.85} />
      </mesh>
      {/* Lápis de madeira natural pousado sobre o caderno */}
      <group position={[0.02, 0.041, -0.02]} rotation={[0, 0.42, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.0048, 0.0048, 0.22, 6]} />
          <meshStandardMaterial color="#b98f61" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.122, 0]}>
          <coneGeometry args={[0.0048, 0.024, 6]} />
          <meshStandardMaterial color="#dec09b" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.132, 0]}>
          <coneGeometry args={[0.0018, 0.007, 6]} />
          <meshStandardMaterial color="#383430" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 6. PANO DE LINHO DOBRADO (Trama visível e dobras naturais)
// ---------------------------------------------------------------------------
const FoldedLinenCloth: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);

  const clothGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.38, 0.014, 0.44, 16, 2, 16);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Leves dobras orgânicas no linho cru
      const wave =
        Math.sin(x * 16 + z * 8) * 0.0038 +
        Math.cos(z * 14 - x * 6) * 0.0025;
      const edgeSoft = Math.max(0, 1 - (Math.abs(x) / 0.19) ** 4) * Math.max(0, 1 - (Math.abs(z) / 0.22) ** 4);
      pos.setY(i, y + wave * edgeSoft + (y > 0 ? edgeSoft * 0.004 : 0));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => () => clothGeo.dispose(), [clothGeo]);
  useSmoothPropTransform('pano', groupRef);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.pano[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.pano[0].rotationY, 0]}
      onClick={(e) => {
        if (useGardenStore.getState().rearrangeMode) {
          e.stopPropagation();
          useGardenStore.getState().cyclePropSlot('pano');
        }
      }}
    >
      <mesh geometry={clothGeo} position={[0, 0.007, 0]} receiveShadow castShadow>
        <meshStandardMaterial
          map={textures.linen.map}
          normalMap={textures.linen.normalMap}
          normalScale={new THREE.Vector2(0.9, 0.9)}
          roughnessMap={textures.linen.roughnessMap}
          color="#d9ceb9"
          roughness={0.94}
        />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// 7. PEDRAS PEQUENAS, MUSGO E FOLHAS SECAS
// ---------------------------------------------------------------------------
const StonesMossAndDryLeaves: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  const seasonId = useGardenStore((s) => s.seasonId);

  useSmoothPropTransform('pedras', groupRef);

  const dryLeafGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.068, 0.036, 6, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const curl = (x * x * 12 + y * y * 14) * 0.45;
      pos.setZ(i, curl);
    }
    geo.rotateX(-Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useEffect(() => () => dryLeafGeo.dispose(), [dryLeafGeo]);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.pedras[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.pedras[0].rotationY, 0]}
      onClick={(e) => {
        if (useGardenStore.getState().rearrangeMode) {
          e.stopPropagation();
          useGardenStore.getState().cyclePropSlot('pedras');
        }
      }}
    >
      {/* Pedras lisas de rio */}
      <mesh position={[0, 0.015, 0]} scale={[1.3, 0.62, 0.95]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.028, 2]} />
        <meshStandardMaterial color="#878178" roughness={0.76} />
      </mesh>
      <mesh position={[0.048, 0.011, 0.025]} scale={[1.1, 0.58, 0.9]} rotation={[0, 0.8, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.021, 2]} />
        <meshStandardMaterial color="#6e685f" roughness={0.82} />
      </mesh>
      <mesh position={[-0.036, 0.009, 0.032]} scale={[1.0, 0.55, 0.85]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.016, 2]} />
        <meshStandardMaterial color="#a4998a" roughness={0.74} />
      </mesh>

      {/* Tufo de musgo aveludado */}
      <group position={[-0.02, 0.008, -0.028]}>
        {[
          [0, 0, 0, 0.028],
          [0.024, -0.002, 0.008, 0.022],
          [-0.022, -0.003, 0.01, 0.019],
          [0.008, 0.002, -0.018, 0.02],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} scale={[1.15, 0.58, 1.05]} castShadow receiveShadow>
            <dodecahedronGeometry args={[r, 1]} />
            <meshStandardMaterial
              color={seasonId === 'inverno' ? '#4d6146' : '#4a6b38'}
              roughness={0.96}
            />
          </mesh>
        ))}
      </group>

      {/* Folhas secas delicadas sobre a madeira */}
      <mesh
        geometry={dryLeafGeo}
        position={[0.08, 0.006, -0.04]}
        rotation={[0.05, 0.65, 0.08]}
        receiveShadow
      >
        <meshStandardMaterial
          map={textures.leaf.map}
          normalMap={textures.leaf.normalMap}
          color="#96693c"
          roughness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>
      {(seasonId === 'outono' || seasonId === 'inverno') && (
        <mesh
          geometry={dryLeafGeo}
          position={[-0.075, 0.006, 0.055]}
          rotation={[-0.04, 2.2, 0.06]}
          scale={[0.85, 0.85, 0.85]}
          receiveShadow
        >
          <meshStandardMaterial
            map={textures.leaf.map}
            normalMap={textures.leaf.normalMap}
            color="#825632"
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------
// 8. ETIQUETAS DE MADEIRA SOBRE A BANCADA
// ---------------------------------------------------------------------------
const WoodenLabelsBundle: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  useSmoothPropTransform('etiquetas', groupRef);

  return (
    <group
      ref={groupRef}
      position={INITIAL_PROP_LAYOUTS.etiquetas[0].position}
      rotation={[0, INITIAL_PROP_LAYOUTS.etiquetas[0].rotationY, 0]}
      onClick={(e) => {
        if (useGardenStore.getState().rearrangeMode) {
          e.stopPropagation();
          useGardenStore.getState().cyclePropSlot('etiquetas');
        }
      }}
    >
      {[
        { pos: [0, 0.003, 0] as [number, number, number], rotY: 0.05 },
        { pos: [0.008, 0.009, 0.012] as [number, number, number], rotY: 0.24 },
        { pos: [-0.012, 0.003, -0.032] as [number, number, number], rotY: -0.18 },
      ].map((lb, idx) => (
        <mesh
          key={idx}
          position={lb.pos}
          rotation={[0, lb.rotY, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.135, 0.0045, 0.024]} />
          <meshStandardMaterial
            map={textures.wood.map}
            normalMap={textures.wood.normalMap}
            color="#d8be98"
            roughness={0.86}
          />
        </mesh>
      ))}
    </group>
  );
};

export const WorkbenchProps: React.FC = () => {
  return (
    <group name="workbench-care-props">
      <CopperWateringCan />
      <DelicateMister />
      <WaterDroplets />
      <SeedBowl />
      <BotanicalJournal />
      <FoldedLinenCloth />
      <StonesMossAndDryLeaves />
      <WoodenLabelsBundle />
    </group>
  );
};
