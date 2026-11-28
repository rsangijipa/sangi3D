/**
 * js/materials.js
 * Materiais PBR para # 073 — Jardim dos Caminhos Possíveis:
 * gramado botânico, madeira de pontes/placas, pedras de trilha, riacho reflexivo e placas de texto.
 */
import * as THREE from 'three';
import { mulberry32 } from './state.js';

function makeCanvas(size, drawFn) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  drawFn(c.getContext('2d'), size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function createPathsGardenMaterials(seed = 7305) {
  const rnd = mulberry32(seed);
  const textures = [];
  const materials = [];

  const regTex = (t, srgb = true, rx = 1, ry = 1) => {
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.repeat.set(rx, ry);
    textures.push(t);
    return t;
  };
  const regMat = (m) => (materials.push(m), m);

  const grassTex = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#536e46';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 9000; i++) {
        const v = Math.floor(68 + (rnd() - 0.5) * 32);
        ctx.fillStyle = `rgb(${v}, ${v + 24}, ${Math.max(30, v - 14)})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 3);
      }
    }),
    true,
    8,
    8
  );

  const gravelTex = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#b9ad95';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 4500; i++) {
        const v = Math.floor(168 + (rnd() - 0.5) * 44);
        ctx.fillStyle = `rgb(${v + 8},${v},${v - 16})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    }),
    true,
    4,
    2
  );

  const woodTex = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#735134';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 80; i++) {
        const y = rnd() * s;
        ctx.fillStyle = 'rgba(42,26,14,0.26)';
        ctx.fillRect(0, y, s, 2);
      }
    }),
    true,
    2,
    2
  );

  const grassMat = regMat(new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.90 }));
  const gravelMat = regMat(new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 0.88 }));
  const woodMat = regMat(new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.72, metalness: 0.04 }));
  const stoneMat = regMat(new THREE.MeshStandardMaterial({ color: 0x7d8079, roughness: 0.86 }));
  const foliageMat = regMat(new THREE.MeshStandardMaterial({ color: 0x3f5e39, roughness: 0.80 }));
  const blossomMat = regMat(new THREE.MeshStandardMaterial({ color: 0xdfbfa8, roughness: 0.65 }));
  const lanternMat = regMat(new THREE.MeshStandardMaterial({ color: 0xffd28c, emissive: 0xffab40, emissiveIntensity: 1.4 }));
  const creekMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x3b6978,
      roughness: 0.14,
      metalness: 0.10,
      clearcoat: 0.85,
      transparent: true,
      opacity: 0.88,
    })
  );

  function makeSignMaterial(titleText, isActive = false) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.fillStyle = isActive ? '#3d2f22' : '#574230';
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = isActive ? '#e3c07b' : '#9c8364';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 88);
    ctx.fillStyle = '#f5efe2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 22px "Segoe UI", system-ui, sans-serif';
    ctx.fillText((titleText || 'Caminho').slice(0, 20), 128, 48);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.72 });
    return { mat, tex };
  }

  return {
    grassMat,
    gravelMat,
    woodMat,
    stoneMat,
    foliageMat,
    blossomMat,
    lanternMat,
    creekMat,
    makeSignMaterial,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
