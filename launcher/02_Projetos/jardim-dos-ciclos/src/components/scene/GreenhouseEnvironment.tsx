import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGardenStore } from '../../store/useGardenStore';
import { SEASONS } from '../../types/garden';
import { getGardenTextures } from '../../textures/proceduralTextures';

/**
 * Textura suave de gradiente radial para feixes de luz e partículas de poeira.
 */
function createSoftGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 245, 215, 0.95)');
  grad.addColorStop(0.35, 'rgba(255, 228, 175, 0.42)');
  grad.addColorStop(0.75, 'rgba(255, 210, 145, 0.08)');
  grad.addColorStop(1, 'rgba(255, 210, 145, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Textura suave de feixe de luz solar atravessando os painéis da estufa.
 */
function createSunbeamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const gradY = ctx.createLinearGradient(0, 0, 0, 512);
  gradY.addColorStop(0, 'rgba(255, 232, 185, 0.0)');
  gradY.addColorStop(0.18, 'rgba(255, 232, 185, 0.24)');
  gradY.addColorStop(0.65, 'rgba(255, 220, 165, 0.08)');
  gradY.addColorStop(1, 'rgba(255, 210, 150, 0.0)');
  ctx.fillStyle = gradY;
  ctx.fillRect(0, 0, 256, 512);

  // Máscara horizontal suave nas bordas do feixe
  ctx.globalCompositeOperation = 'destination-in';
  const gradX = ctx.createLinearGradient(0, 0, 256, 0);
  gradX.addColorStop(0, 'rgba(0,0,0,0)');
  gradX.addColorStop(0.32, 'rgba(0,0,0,1)');
  gradX.addColorStop(0.68, 'rgba(0,0,0,1)');
  gradX.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradX;
  ctx.fillRect(0, 0, 256, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Textura de fundo botânico desfocado atrás dos vidros da estufa (zero custo de geometria pesada).
 */
function createExteriorBokehBackdrop(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Céu quente de fim de tarde e folhagem externa difusa
  const bg = ctx.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#f3dfb8');
  bg.addColorStop(0.38, '#d5c7a3');
  bg.addColorStop(0.66, '#657557');
  bg.addColorStop(1, '#2b3626');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  // Círculos de bokeh botânico suaves
  let s = 777;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < 42; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 24 + rand() * 84;
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    const isLight = y < 270 && rand() > 0.35;
    if (isLight) {
      g.addColorStop(0, 'rgba(255, 240, 198, 0.42)');
      g.addColorStop(1, 'rgba(255, 230, 180, 0)');
    } else {
      g.addColorStop(0, 'rgba(54, 74, 46, 0.38)');
      g.addColorStop(1, 'rgba(42, 58, 36, 0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------------------
// PARTÍCULAS MÍNIMAS DE POEIRA NO CONTRALUZ
// ---------------------------------------------------------------------------
const BacklitDustMotes: React.FC = () => {
  const count = 82;
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const glowTex = useMemo(() => createSoftGlowTexture(), []);

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count * 3);
    let s = 2026;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 2.8;
      pos[i * 3 + 1] = 0.18 + rand() * 1.65;
      pos[i * 3 + 2] = -0.9 + rand() * 1.8;
      sd[i * 3] = rand() * Math.PI * 2;
      sd[i * 3 + 1] = 0.14 + rand() * 0.28;
      sd[i * 3 + 2] = 0.04 + rand() * 0.07;
    }
    return { positions: pos, seeds: sd };
  }, []);

  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const store = useGardenStore.getState();
    const season = SEASONS[store.seasonId];

    if (matRef.current) {
      matRef.current.color.set(season.particleColor);
      const sunVisibility = 0.25 + Math.sin(store.lightCycle * Math.PI) * 0.45;
      matRef.current.opacity = sunVisibility * 0.65;
    }

    if (store.reducedMotion) return;

    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const phase = seeds[i * 3];
      const speed = seeds[i * 3 + 1];
      const amp = seeds[i * 3 + 2];
      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      const baseZ = positions[i * 3 + 2];

      attr.setXYZ(
        i,
        baseX + Math.sin(t * speed + phase) * amp,
        baseY + Math.cos(t * speed * 0.7 + phase) * amp * 0.8,
        baseZ + Math.sin(t * speed * 0.5 + phase * 1.4) * amp * 0.6
      );
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={glowTex}
        size={0.032}
        transparent
        opacity={0.48}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// ---------------------------------------------------------------------------
// PLANTAS PENDENTES E TREPADEIRAS SUAVES NAS BORDAS SUPERIORES (InstancedMesh)
// ---------------------------------------------------------------------------
const HangingVinesFraming: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const groupRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.InstancedMesh>(null);

  const leafGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.085, 0.115, 2, 3);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const v = THREE.MathUtils.clamp((y + 0.0575) / 0.115, 0, 1);
      const taper = Math.sin(Math.pow(v, 0.75) * Math.PI);
      pos.setX(i, x * taper);
      pos.setZ(i, Math.sin(v * Math.PI) * 0.015);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const vineStrands = useMemo(() => {
    const strands: Array<{
      x: number;
      yTop: number;
      z: number;
      length: number;
      leaves: number;
    }> = [
      // Borda superior direita (referência editorial)
      { x: 1.38, yTop: 1.72, z: -0.25, length: 0.78, leaves: 11 },
      { x: 1.62, yTop: 1.68, z: -0.62, length: 0.92, leaves: 13 },
      { x: 1.12, yTop: 1.82, z: -0.58, length: 0.56, leaves: 9 },
      // Borda superior esquerda
      { x: -1.42, yTop: 1.74, z: -0.35, length: 0.72, leaves: 11 },
      { x: -1.68, yTop: 1.68, z: -0.75, length: 0.88, leaves: 12 },
      { x: -1.08, yTop: 1.85, z: -0.68, length: 0.52, leaves: 8 },
    ];
    return strands;
  }, []);

  const totalLeaves = useMemo(
    () => vineStrands.reduce((acc, s) => acc + s.leaves, 0),
    [vineStrands]
  );

  useEffect(() => {
    if (!leavesRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;
    vineStrands.forEach((strand, sIdx) => {
      for (let i = 0; i < strand.leaves; i++) {
        const f = i / Math.max(1, strand.leaves - 1);
        const side = i % 2 === 0 ? 1 : -1;
        const y = strand.yTop - f * strand.length;
        const x = strand.x + side * 0.032 + Math.sin(f * 5 + sIdx) * 0.025;
        const z = strand.z + Math.cos(f * 4 + sIdx) * 0.025;

        dummy.position.set(x, y, z);
        dummy.rotation.set(0.35 + f * 0.25, side * 0.65 + sIdx * 0.4, side * 0.45);
        const sc = 0.68 + (1 - f * 0.35) * 0.52;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        leavesRef.current!.setMatrixAt(idx, dummy.matrix);

        const gShift = 0.34 + (i % 4) * 0.045;
        color.setRGB(gShift * 0.74, gShift * 1.1, gShift * 0.56);
        leavesRef.current!.setColorAt(idx, color);
        idx++;
      }
    });
    leavesRef.current.instanceMatrix.needsUpdate = true;
    if (leavesRef.current.instanceColor) leavesRef.current.instanceColor.needsUpdate = true;
  }, [vineStrands]);

  useEffect(() => () => leafGeo.dispose(), [leafGeo]);

  useFrame((state) => {
    if (!groupRef.current || useGardenStore.getState().reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(t * 0.42) * 0.012;
  });

  return (
    <group ref={groupRef} name="hanging-vines">
      {/* Caules finos das trepadeiras */}
      {vineStrands.map((st, idx) => (
        <mesh key={idx} position={[st.x, st.yTop - st.length * 0.5, st.z]}>
          <cylinderGeometry args={[0.004, 0.0025, st.length, 5]} />
          <meshStandardMaterial color="#3d4c33" roughness={0.85} />
        </mesh>
      ))}
      {/* Folhas em 1 único draw call */}
      <instancedMesh ref={leavesRef} args={[leafGeo, undefined, totalLeaves]}>
        <meshStandardMaterial
          map={textures.leaf.map}
          normalMap={textures.leaf.normalMap}
          roughness={0.56}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// PRATELEIRA DESFOCADA AO FUNDO (Baixa complexidade geométrica / LOD visual)
// ---------------------------------------------------------------------------
const BackgroundGreenhouseShelf: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);

  return (
    <group name="background-shelf" position={[1.18, -0.35, -1.68]} rotation={[0, -0.26, 0]}>
      {/* Estrutura de madeira envelhecida */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]}>
          <boxGeometry args={[0.048, 1.85, 0.048]} />
          <meshStandardMaterial
            map={textures.wood.map}
            color="#584638"
            roughness={0.92}
          />
        </mesh>
      ))}
      {[0.48, 0.96, 1.44].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <boxGeometry args={[1.34, 0.036, 0.34]} />
          <meshStandardMaterial
            map={textures.wood.map}
            color="#65503f"
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Vasos secundários de terracota (baixa contagem de segmentos) */}
      <mesh position={[-0.36, 0.61, 0.02]}>
        <cylinderGeometry args={[0.105, 0.078, 0.22, 14]} />
        <meshStandardMaterial color="#9f5d43" roughness={0.88} />
      </mesh>
      <mesh position={[-0.12, 0.56, 0.04]}>
        <cylinderGeometry args={[0.075, 0.056, 0.14, 12]} />
        <meshStandardMaterial color="#b47558" roughness={0.88} />
      </mesh>
      {/* Folhagem suave de fundo no vaso */}
      <mesh position={[-0.36, 0.78, 0.02]} scale={[1.2, 0.85, 1.1]}>
        <dodecahedronGeometry args={[0.14, 1]} />
        <meshStandardMaterial color="#465e3b" roughness={0.9} />
      </mesh>

      {/* Frascos de vidro âmbar/verde na prateleira média */}
      <mesh position={[0.24, 1.09, -0.02]}>
        <cylinderGeometry args={[0.048, 0.052, 0.22, 12]} />
        <meshStandardMaterial color="#4e614e" roughness={0.28} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0.37, 1.06, 0.03]}>
        <cylinderGeometry args={[0.036, 0.038, 0.16, 12]} />
        <meshStandardMaterial color="#8f673c" roughness={0.28} transparent opacity={0.78} />
      </mesh>

      {/* Rolo de barbante e pilha de pratinhos de barro */}
      <mesh position={[-0.24, 1.03, 0.03]}>
        <cylinderGeometry args={[0.052, 0.052, 0.1, 12]} />
        <meshStandardMaterial color="#bda886" roughness={0.95} />
      </mesh>
      {[0, 0.024, 0.048].map((h, i) => (
        <mesh key={i} position={[0.02, 0.995 + h, 0.02]}>
          <cylinderGeometry args={[0.088, 0.074, 0.02, 12]} />
          <meshStandardMaterial color="#a4644b" roughness={0.88} />
        </mesh>
      ))}

      {/* Prateleira superior: vaso baixo com folhagem pendente */}
      <mesh position={[0.12, 1.54, 0.0]}>
        <cylinderGeometry args={[0.11, 0.085, 0.16, 14]} />
        <meshStandardMaterial color="#8e563e" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 1.66, 0.0]} scale={[1.35, 0.72, 1.15]}>
        <dodecahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial color="#4d683f" roughness={0.88} />
      </mesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// ESTUFA PRINCIPAL: BANCADA, VIDRAÇAS COM CAIXILHO ANTIGO E FEIXES DE LUZ
// ---------------------------------------------------------------------------
export const GreenhouseEnvironment: React.FC = () => {
  const textures = useMemo(() => getGardenTextures(), []);
  const sunbeamTex = useMemo(() => createSunbeamTexture(), []);
  const backdropTex = useMemo(() => createExteriorBokehBackdrop(), []);

  const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const sunbeamMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const sunbeamMat2Ref = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    return () => {
      sunbeamTex.dispose();
      backdropTex.dispose();
    };
  }, [sunbeamTex, backdropTex]);

  useFrame(() => {
    const store = useGardenStore.getState();
    const season = SEASONS[store.seasonId];

    if (glassMatRef.current) {
      glassMatRef.current.roughness = 0.18 + season.glassFrost * 0.58;
      glassMatRef.current.opacity = 0.24 + season.glassFrost * 0.28;
    }

    const sunGlow = Math.sin(store.lightCycle * Math.PI);
    if (sunbeamMatRef.current) {
      sunbeamMatRef.current.color.set(season.sunTint);
      sunbeamMatRef.current.opacity = 0.05 + sunGlow * 0.22;
    }
    if (sunbeamMat2Ref.current) {
      sunbeamMat2Ref.current.color.set(season.sunTint);
      sunbeamMat2Ref.current.opacity = 0.03 + sunGlow * 0.14;
    }
  });

  const frameColor = '#2c312e';

  return (
    <group name="greenhouse-environment">
      {/* BANCADA DE MADEIRA ENVELHECIDA */}
      <group position={[0, -0.045, 0]}>
        {/* Tampo principal de tábuas grossas */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.7, 0.09, 1.48]} />
          <meshStandardMaterial
            map={textures.wood.map}
            normalMap={textures.wood.normalMap}
            normalScale={new THREE.Vector2(0.85, 0.85)}
            roughnessMap={textures.wood.roughnessMap}
            roughness={0.82}
            metalness={0.03}
            color="#d8c8b6"
          />
        </mesh>
        {/* Saia/estrutura inferior da bancada */}
        <mesh position={[0, -0.14, 0.04]}>
          <boxGeometry args={[3.48, 0.2, 1.24]} />
          <meshStandardMaterial color="#4a392c" roughness={0.92} />
        </mesh>
      </group>

      {/* PAREDE LATERAL E TETO INCLINADO DE ESTUFA COM CAIXILHO METÁLICO ANTIGO */}
      <group name="greenhouse-glazing">
        {/* Fundo botânico externo difuso atrás das vidraças */}
        <mesh position={[-0.4, 1.25, -3.15]}>
          <planeGeometry args={[9.5, 5.4]} />
          <meshBasicMaterial map={backdropTex} />
        </mesh>

        {/* Vidraça posterior principal com leve embaçamento/sujeira nas bordas */}
        <mesh position={[0, 1.22, -2.35]}>
          <planeGeometry args={[7.2, 3.6]} />
          <meshPhysicalMaterial
            ref={glassMatRef}
            color="#eef2ea"
            roughnessMap={textures.glassRoughness}
            roughness={0.26}
            metalness={0.08}
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>

        {/* Caixilhos verticais antigos de ferro escuro */}
        {[-2.8, -1.85, -0.92, 0.0, 0.92, 1.85, 2.8].map((x, idx) => (
          <mesh key={`v-bar-${idx}`} position={[x, 1.25, -2.3]}>
            <boxGeometry args={[0.045, 3.8, 0.055]} />
            <meshStandardMaterial color={frameColor} roughness={0.68} metalness={0.62} />
          </mesh>
        ))}

        {/* Travessas horizontais da janela */}
        {[0.12, 1.05, 1.98].map((y, idx) => (
          <mesh key={`h-bar-${idx}`} position={[0, y, -2.3]}>
            <boxGeometry args={[7.4, 0.048, 0.06]} />
            <meshStandardMaterial color={frameColor} roughness={0.68} metalness={0.62} />
          </mesh>
        ))}

        {/* Teto envidraçado inclinado (assinatura visual da estufa na referência) */}
        <group position={[0, 2.38, -1.12]} rotation={[0.56, 0, 0]}>
          {[-2.4, -1.45, -0.5, 0.45, 1.4, 2.35].map((x, idx) => (
            <mesh key={`roof-rib-${idx}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.052, 0.065, 3.1]} />
              <meshStandardMaterial color={frameColor} roughness={0.66} metalness={0.64} />
            </mesh>
          ))}
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6.8, 3.0]} />
            <meshPhysicalMaterial
              color="#f3f4ec"
              roughnessMap={textures.glassRoughness}
              roughness={0.22}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Caixilho lateral esquerdo por onde entra a luz dourada principal */}
        <group position={[-2.45, 1.18, -0.45]} rotation={[0, Math.PI / 2, 0]}>
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.05, 3.4, 0.055]} />
              <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[3.6, 0.05, 0.055]} />
            <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.6} />
          </mesh>
        </group>

        {/* Feixes leves de luz dourada no contraluz (zero raymarching pesado) */}
        <group position={[-0.75, 1.05, -0.55]} rotation={[0.12, 0.22, -0.58]}>
          <mesh>
            <planeGeometry args={[1.45, 3.2]} />
            <meshBasicMaterial
              ref={sunbeamMatRef}
              map={sunbeamTex}
              color="#ffe2b0"
              transparent
              opacity={0.22}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0.85, 0.15, -0.35]}>
            <planeGeometry args={[1.15, 2.9]} />
            <meshBasicMaterial
              ref={sunbeamMat2Ref}
              map={sunbeamTex}
              color="#ffe2b0"
              transparent
              opacity={0.14}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Prateleira desfocada ao fundo */}
      <BackgroundGreenhouseShelf />

      {/* Trepadeiras e plantas pendentes nas bordas superiores */}
      <HangingVinesFraming />

      {/* Partículas mínimas de poeira visíveis no contraluz */}
      <BacklitDustMotes />
    </group>
  );
};
