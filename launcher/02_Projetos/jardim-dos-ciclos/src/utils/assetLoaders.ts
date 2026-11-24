import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

let cachedGltfLoader: GLTFLoader | null = null;

/**
 * Configura GLTFLoader com suporte a DRACO e KTX2/Basis Universal
 * para carregamento otimizado de modelos externos quando presentes.
 */
export function getOptimizedGLTFLoader(renderer?: THREE.WebGLRenderer): GLTFLoader {
  if (cachedGltfLoader) return cachedGltfLoader;

  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  if (renderer) {
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.173.0/examples/jsm/libs/basis/');
    ktx2Loader.detectSupport(renderer);
    loader.setKTX2Loader(ktx2Loader);
  }

  cachedGltfLoader = loader;
  return loader;
}
