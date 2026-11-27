import React, { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { HeroPotAndSoil } from './HeroPotAndSoil';
import { HeroPlant } from './HeroPlant';
import { WorkbenchProps } from './WorkbenchProps';
import { GreenhouseEnvironment } from './GreenhouseEnvironment';
import { LightingAndCamera } from './LightingAndCamera';
import { getOptimizedGLTFLoader } from '../../utils/assetLoaders';

interface GardenCanvasProps {
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const GardenCanvas: React.FC<GardenCanvasProps> = ({ onCanvasReady }) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      className="garden-canvas-wrapper"
      role="region"
      aria-label="Cena 3D interativa da estufa Jardim dos Ciclos"
    >
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        camera={{
          position: isMobile ? [0.18, 0.96, 2.02] : [0.22, 0.86, 1.72],
          fov: isMobile ? 40 : 34,
          near: 0.08,
          far: 30,
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.04,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          // Prepara pipeline DRACO/KTX2 caso ativos externos sejam carregados
          getOptimizedGLTFLoader(gl);
          onCanvasReady(gl.domElement);
        }}
      >
        <Suspense fallback={null}>
          <LightingAndCamera />
          <GreenhouseEnvironment />
          <HeroPotAndSoil />
          <HeroPlant />
          <WorkbenchProps />
        </Suspense>
      </Canvas>
    </div>
  );
};
