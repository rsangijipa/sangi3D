import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, SMAA } from '@react-three/postprocessing';
import { FilmGrade } from './post/FilmGrade';
import { ToneMappingMode } from 'postprocessing';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useGardenStore } from '../../store/useGardenStore';
import { SEASONS } from '../../types/garden';
import { gardenAudio } from '../../audio/gardenAudio';

function computeSunParams(lightCycle: number, seasonId: keyof typeof SEASONS) {
  const season = SEASONS[seasonId];
  // Arco solar lateral (esquerda-fundo -> topo-lateral -> direita-baixa dourada)
  const azimuth = THREE.MathUtils.lerp(-1.25, 0.72, lightCycle);
  const arcElevation = Math.sin(lightCycle * Math.PI);
  const elevation = Math.max(0.24, 0.34 + arcElevation * 0.72 + season.sunElevationOffset);

  const dist = 6.2;
  const x = Math.sin(azimuth) * Math.cos(elevation) * dist - 1.6;
  const y = Math.sin(elevation) * dist + 0.55;
  const z = -Math.cos(azimuth) * Math.cos(elevation) * dist * 0.55 + 1.1;

  // Cor solar contínua: amanhecer rosado -> manhã clara -> fim de tarde dourado -> crepúsculo âmbar-azulado
  const dawn = new THREE.Color('#ffcca3');
  const morning = new THREE.Color('#fff1d6');
  const golden = new THREE.Color('#ffbf75');
  const dusk = new THREE.Color('#b6a5c9');

  const sunColor = new THREE.Color();
  if (lightCycle < 0.35) {
    sunColor.copy(dawn).lerp(morning, lightCycle / 0.35);
  } else if (lightCycle < 0.78) {
    sunColor.copy(morning).lerp(golden, (lightCycle - 0.35) / 0.43);
  } else {
    sunColor.copy(golden).lerp(dusk, (lightCycle - 0.78) / 0.22);
  }
  sunColor.lerp(new THREE.Color(season.sunTint), 0.28);

  const intensity = THREE.MathUtils.lerp(1.4, 3.1, Math.sin(lightCycle * Math.PI) * 0.85 + 0.15);

  return {
    position: new THREE.Vector3(x, y, z),
    color: sunColor,
    intensity,
    ambientColor: new THREE.Color(season.ambientTint),
    fogColor: new THREE.Color(season.fogColor).lerp(
      new THREE.Color('#2d2930'),
      lightCycle > 0.82 ? ((lightCycle - 0.82) / 0.18) * 0.55 : 0
    ),
  };
}

export const LightingAndCamera: React.FC = () => {
  const { scene, size } = useThree();
  const isMobile = size.width < 768;

  const sunRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const propSlotIndex = useGardenStore((s) => s.propSlotIndex);
  const reducedMotion = useGardenStore((s) => s.reducedMotion);

  // Recalcula o ContactShadows sob demanda (frames={1}) apenas quando um objeto é movido
  const shadowBakeKey = useMemo(() => JSON.stringify(propSlotIndex), [propSlotIndex]);

  const [fogColorInit] = useState('#d5c7b4');

  // Configura fundo atmosférico da cena
  useEffect(() => {
    scene.fog = new THREE.FogExp2(fogColorInit, 0.06);
    scene.background = new THREE.Color(fogColorInit);
    return () => {
      scene.fog = null;
    };
  }, [scene, fogColorInit]);

  useFrame((state, delta) => {
    const store = useGardenStore.getState();
    const params = computeSunParams(store.lightCycle, store.seasonId);
    const k = Math.min(1, delta * 2.5);
    gardenAudio.setDayPhase(store.lightCycle);

    if (sunRef.current) {
      sunRef.current.position.lerp(params.position, k);
      sunRef.current.color.lerp(params.color, k);
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, params.intensity, k);
    }

    if (rimRef.current) {
      rimRef.current.color.lerp(params.color, k);
      rimRef.current.intensity = THREE.MathUtils.lerp(
        rimRef.current.intensity,
        0.55 + Math.sin(store.lightCycle * Math.PI) * 0.45,
        k
      );
    }

    if (hemiRef.current) {
      hemiRef.current.color.lerp(params.ambientColor, k);
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        hemiRef.current.intensity,
        0.48 + Math.sin(store.lightCycle * Math.PI) * 0.25,
        k
      );
    }

    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.lerp(params.fogColor, k);
    }
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(params.fogColor, k);
    }

    // Movimento inercial quase imperceptível na câmera (respiração cinematográfica)
    if (controlsRef.current && !store.reducedMotion && !isMobile) {
      const t = state.clock.elapsedTime;
      const targetX = Math.sin(t * 0.22) * 0.014;
      const targetY = 0.29 + Math.cos(t * 0.17) * 0.006;
      controlsRef.current.target.x = THREE.MathUtils.lerp(controlsRef.current.target.x, targetX, delta * 1.4);
      controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, targetY, delta * 1.4);
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Luz solar lateral principal com sombras suaves e longas */}
      <directionalLight
        ref={sunRef}
        position={[-3.2, 3.4, 1.4]}
        intensity={2.65}
        color="#ffca85"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.0}
        shadow-camera-bottom={-1.4}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
        shadow-radius={4}
      />

      {/* Rim light discreta no contraluz para acentuar folhas, cobre e borda do vaso */}
      <directionalLight
        ref={rimRef}
        position={[-1.8, 2.2, -3.2]}
        intensity={0.85}
        color="#ffdcb0"
      />

      {/* Preenchimento ambiente muito leve (céu de estufa + reflexo quente da madeira) */}
      <hemisphereLight
        ref={hemiRef}
        args={['#d8dfd2', '#6e523d', 0.62]}
      />

      {/* HDRI procedural leve para reflexos realistas em cobre, vidro e umidade */}
      <Environment resolution={256} frames={1}>
        {/* Teto envidraçado difuso */}
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#fff4e0"
          scale={[8, 4, 1]}
          position={[0, 4.5, -1]}
          rotation={[Math.PI / 2.4, 0, 0]}
        />
        {/* Janela lateral dourada */}
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#ffd191"
          scale={[4, 3, 1]}
          position={[-4.5, 2.0, -0.5]}
          rotation={[0, Math.PI / 2, 0]}
        />
        {/* Preenchimento verde-estufa discreto */}
        <Lightformer
          form="circle"
          intensity={0.75}
          color="#a8bfa2"
          scale={4}
          position={[3.5, 1.5, -2]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* Reflexo quente vindo da bancada de madeira */}
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#7a573d"
          scale={[6, 6, 1]}
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </Environment>

      {/* Oclusão de contato suave sob os objetos da bancada (bake único sob demanda) */}
      <ContactShadows
        key={shadowBakeKey}
        position={[0, 0.002, 0]}
        opacity={0.44}
        scale={3.6}
        blur={2.1}
        far={0.75}
        resolution={512}
        frames={1}
        color="#241810"
      />

      {/* Controles cinematográficos suaves e contidos */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, 0.29, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={reducedMotion ? 0.14 : 0.055}
        rotateSpeed={isMobile ? 0.35 : 0.5}
        zoomSpeed={isMobile ? 0.45 : 0.65}
        minDistance={isMobile ? 1.55 : 1.15}
        maxDistance={isMobile ? 2.45 : 2.35}
        minAzimuthAngle={isMobile ? -0.35 : -0.68}
        maxAzimuthAngle={isMobile ? 0.35 : 0.68}
        minPolarAngle={0.58}
        maxPolarAngle={1.24}
      />

      {/* Pós-processamento muito leve: bloom discreto + vignette sutil + ACES Filmic */}
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.92}
          luminanceSmoothing={0.2}
          intensity={0.32}
          radius={0.62}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <FilmGrade grain={isMobile ? 0.025 : 0.035} />
        <SMAA />
        <Vignette eskil={false} offset={0.24} darkness={0.46} />
      </EffectComposer>
    </>
  );
};
