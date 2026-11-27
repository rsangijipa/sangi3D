import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGardenStore } from '../../store/useGardenStore';
import { getGardenTextures } from '../../textures/proceduralTextures';

/**
 * Gera uma geometria de vaso artesanal largo e baixo com silhueta levemente
 * irregular, borda arredondada feita à mão e micro-ondulações orgânicas.
 */
function createHandcraftedPotGeometry(): THREE.BufferGeometry {
  // Perfil de torneamento (x = raio, y = altura a partir da bancada y=0)
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.002),
    new THREE.Vector2(0.21, 0.002),
    new THREE.Vector2(0.235, 0.012), // anel de base
    new THREE.Vector2(0.255, 0.032),
    new THREE.Vector2(0.305, 0.092),
    new THREE.Vector2(0.352, 0.168),
    new THREE.Vector2(0.376, 0.232),
    new THREE.Vector2(0.384, 0.268), // leve barriga superior
    new THREE.Vector2(0.379, 0.292), // início da borda
    new THREE.Vector2(0.386, 0.304), // lábio artesanal externo
    new THREE.Vector2(0.378, 0.316), // topo da borda
    new THREE.Vector2(0.362, 0.315), // canto interno arredondado
    new THREE.Vector2(0.352, 0.302), // descida interna
    new THREE.Vector2(0.34, 0.24),
    new THREE.Vector2(0.295, 0.14),
    new THREE.Vector2(0.22, 0.045),
    new THREE.Vector2(0.0, 0.036),
  ];

  const geo = new THREE.LatheGeometry(profile, 64);
  const pos = geo.attributes.position;

  // Imperfeições artesanais orgânicas (ondulação sutil na borda e parede)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 0.005) continue;

    const angle = Math.atan2(z, x);
    const hNorm = Math.min(1, y / 0.316);

    // Leve ovalização e ondulação de peça feita à mão
    const radialWobble =
      Math.sin(angle * 2 + 0.5) * 0.0042 * hNorm +
      Math.cos(angle * 3 - 0.8) * 0.0028 * hNorm +
      Math.sin(angle * 5 + y * 16) * 0.0014;

    // Leve variação de altura na borda superior
    const rimWave =
      hNorm > 0.82
        ? (Math.sin(angle * 2 - 0.4) * 0.0038 + Math.cos(angle * 3 + 1.1) * 0.0022) *
          ((hNorm - 0.82) / 0.18)
        : 0;

    // Sulcos sutis de torno
    const throwRing = Math.sin(y * 105) * 0.0007 * (r > 0.25 ? 1 : 0);

    const scale = (r + radialWobble + throwRing) / r;
    pos.setXYZ(i, x * scale, y + rimWave, z * scale);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Gera a superfície esculpida da terra dentro do vaso com leve relevo orgânico
 * e depressão central suave para a semente.
 */
function createSoilSurfaceGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CircleGeometry(0.352, 48, 0, Math.PI * 2);
  geo.rotateX(-Math.PI / 2);

  // Subdividir radialmente criando anéis via Plane/Cylinder cap customizado
  // Usando CylinderGeometry fino com segmentos radiais para relevo suave
  geo.dispose();
  const cyl = new THREE.CylinderGeometry(0.352, 0.34, 0.05, 48, 6, false);
  const pos = cyl.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (y > 0) {
      const r = Math.hypot(x, z);
      const rNorm = Math.min(1, r / 0.352);
      const angle = Math.atan2(z, x);

      // Leve elevação orgânica no centro, caindo próximo à borda do vaso
      const dome = Math.cos(rNorm * Math.PI * 0.5) * 0.026;
      // Pequena concavidade central onde a semente repousa
      const seedDimple = -Math.exp(-r * r * 140) * 0.011;
      // Micro-ondulações orgânicas da terra
      const lumps =
        Math.sin(x * 22 + z * 15) * 0.0045 +
        Math.cos(x * 35 - z * 28) * 0.003 +
        Math.sin(angle * 4 + r * 18) * 0.0025;

      pos.setY(i, y + dome + seedDimple + lumps * (1 - rNorm * 0.5));
    }
  }

  cyl.computeVertexNormals();
  return cyl;
}

export const HeroPotAndSoil: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const potGeo = useMemo(() => createHandcraftedPotGeometry(), []);
  const soilGeo = useMemo(() => createSoilSurfaceGeometry(), []);

  const soilMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const potMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const crumbsRef = useRef<THREE.InstancedMesh>(null);
  const pebblesRef = useRef<THREE.InstancedMesh>(null);
  const smoothMoisture = useRef(useGardenStore.getState().moisture);

  // Geometrias simples reutilizadas para instancing de partículas orgânicas na terra
  const crumbGeo = useMemo(() => new THREE.DodecahedronGeometry(0.0065, 0), []);
  const pebbleGeo = useMemo(() => new THREE.IcosahedronGeometry(0.0075, 1), []);

  // Posiciona grânulos de terra orgânica e minúsculas pedrinhas/perlita via InstancedMesh
  useEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    if (crumbsRef.current) {
      let seed = 1337;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < 150; i++) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * 0.325;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const rNorm = r / 0.352;
        const dome = Math.cos(rNorm * Math.PI * 0.5) * 0.026;
        const dimple = -Math.exp(-r * r * 140) * 0.011;
        const y = 0.278 + dome + dimple + (rand() - 0.5) * 0.004;

        dummy.position.set(x, y, z);
        dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3);
        const s = 0.55 + rand() * 1.15;
        dummy.scale.set(s * (0.8 + rand() * 0.5), s * 0.65, s * (0.8 + rand() * 0.5));
        dummy.updateMatrix();
        crumbsRef.current.setMatrixAt(i, dummy.matrix);

        // Variação orgânica de húmus e casca escura
        const shade = 0.16 + rand() * 0.14;
        color.setRGB(shade * 1.15, shade * 0.86, shade * 0.64);
        crumbsRef.current.setColorAt(i, color);
      }
      crumbsRef.current.instanceMatrix.needsUpdate = true;
      if (crumbsRef.current.instanceColor) crumbsRef.current.instanceColor.needsUpdate = true;
    }

    if (pebblesRef.current) {
      let seed = 4242;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < 32; i++) {
        const a = rand() * Math.PI * 2;
        const r = 0.07 + Math.sqrt(rand()) * 0.255;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const rNorm = r / 0.352;
        const dome = Math.cos(rNorm * Math.PI * 0.5) * 0.026;
        const y = 0.279 + dome;

        dummy.position.set(x, y, z);
        dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3);
        const s = 0.6 + rand() * 1.25;
        dummy.scale.set(s * 1.2, s * 0.55, s * 0.9);
        dummy.updateMatrix();
        pebblesRef.current.setMatrixAt(i, dummy.matrix);

        const tone = 0.44 + rand() * 0.24;
        color.setRGB(tone * 1.04, tone * 0.98, tone * 0.88);
        pebblesRef.current.setColorAt(i, color);
      }
      pebblesRef.current.instanceMatrix.needsUpdate = true;
      if (pebblesRef.current.instanceColor) pebblesRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

  useEffect(() => {
    return () => {
      potGeo.dispose();
      soilGeo.dispose();
      crumbGeo.dispose();
      pebbleGeo.dispose();
    };
  }, [potGeo, soilGeo, crumbGeo, pebbleGeo]);

  // Cores interpoladas de terra seca -> terra úmida escura
  const drySoilColor = useMemo(() => new THREE.Color('#7a5f49'), []);
  const wetSoilColor = useMemo(() => new THREE.Color('#2d1f16'), []);
  const dryPotColor = useMemo(() => new THREE.Color('#e8d8cc'), []);
  const dampPotColor = useMemo(() => new THREE.Color('#c8ae9c'), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const targetMoisture = useGardenStore.getState().moisture;
    smoothMoisture.current = THREE.MathUtils.lerp(
      smoothMoisture.current,
      targetMoisture,
      Math.min(1, delta * 2.2)
    );
    const m = smoothMoisture.current;

    if (soilMatRef.current) {
      tempColor.copy(drySoilColor).lerp(wetSoilColor, m);
      soilMatRef.current.color.copy(tempColor);
      // Terra molhada ganha leve brilho úmido realista
      soilMatRef.current.roughness = THREE.MathUtils.lerp(0.95, 0.46, m);
    }

    if (potMatRef.current) {
      // Terracota absorve umidade sutilmente
      tempColor.copy(dryPotColor).lerp(dampPotColor, m * 0.55);
      potMatRef.current.color.copy(tempColor);
      potMatRef.current.roughness = THREE.MathUtils.lerp(0.92, 0.76, m * 0.6);
    }
  });

  return (
    <group name="hero-pot-assembly" position={[0, 0, 0]}>
      {/* Vaso principal de terracota artesanal */}
      <mesh
        geometry={potGeo}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          useGardenStore.getState().pulseLeafTouch();
        }}
      >
        <meshStandardMaterial
          ref={potMatRef}
          map={textures.terracotta.map}
          normalMap={textures.terracotta.normalMap}
          normalScale={new THREE.Vector2(0.75, 0.75)}
          roughnessMap={textures.terracotta.roughnessMap}
          roughness={0.86}
          metalness={0.02}
          color="#dfd0c4"
        />
      </mesh>

      {/* Superfície da terra orgânica escura */}
      <mesh geometry={soilGeo} position={[0, 0.252, 0]} receiveShadow>
        <meshStandardMaterial
          ref={soilMatRef}
          map={textures.soil.map}
          normalMap={textures.soil.normalMap}
          normalScale={new THREE.Vector2(1.15, 1.15)}
          roughnessMap={textures.soil.roughnessMap}
          roughness={0.82}
          metalness={0.02}
          color="#543f2f"
        />
      </mesh>

      {/* Partículas orgânicas da terra (InstancedMesh) */}
      <instancedMesh
        ref={crumbsRef}
        args={[crumbGeo, undefined, 150]}
        receiveShadow
      >
        <meshStandardMaterial roughness={0.92} metalness={0.0} />
      </instancedMesh>

      {/* Pequenas pedrinhas minerais e perlita na superfície da terra */}
      <instancedMesh
        ref={pebblesRef}
        args={[pebbleGeo, undefined, 32]}
        receiveShadow
      >
        <meshStandardMaterial roughness={0.78} metalness={0.04} />
      </instancedMesh>

      {/* Etiqueta de madeira delicadamente fincada na borda interna da terra */}
      <group position={[0.21, 0.305, -0.14]} rotation={[0.14, -0.52, -0.18]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.028, 0.135, 0.0045]} />
          <meshStandardMaterial
            map={textures.wood.map}
            normalMap={textures.wood.normalMap}
            roughnessMap={textures.wood.roughnessMap}
            color="#d8be98"
            roughness={0.88}
          />
        </mesh>
        {/* Pequena marcação artesanal a lápis na etiqueta */}
        <mesh position={[0, 0.032, 0.0026]}>
          <planeGeometry args={[0.018, 0.0025]} />
          <meshBasicMaterial color="#4d3f32" transparent opacity={0.55} />
        </mesh>
        <mesh position={[-0.002, 0.022, 0.0026]}>
          <planeGeometry args={[0.014, 0.002]} />
          <meshBasicMaterial color="#4d3f32" transparent opacity={0.42} />
        </mesh>
      </group>
    </group>
  );
};
