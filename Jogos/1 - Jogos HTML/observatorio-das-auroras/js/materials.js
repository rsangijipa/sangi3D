/**
 * js/materials.js
 * Texturas procedurais offline (neve com cristais, madeira nórdica envelhecida,
 * rocha alpina e vidro panorâmico com borda levemente geada).
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

export function createObservatoryMaterials(seed = 5408) {
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

  // Neve ártica com micro-ondulações e brilho frio discreto
  const snowColor = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#dde6f0';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 6500; i++) {
        const x = rnd() * s;
        const y = rnd() * s;
        const v = Math.floor(218 + (rnd() - 0.35) * 34);
        ctx.fillStyle = `rgb(${v - 4}, ${v}, ${Math.min(255, v + 8)})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }),
    true,
    8,
    8
  );

  const snowBump = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 3) {
        const g = Math.floor(128 + Math.sin(y * 0.14) * 26);
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(0, y, s, 2);
      }
      for (let i = 0; i < 2000; i++) {
        const g = Math.floor(105 + rnd() * 50);
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    }),
    false,
    8,
    8
  );

  // Madeira de pinho nórdico quente (interior da cabana + varanda)
  const timberColor = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#6e4c32';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 95; i++) {
        const y = rnd() * s;
        ctx.fillStyle = rnd() > 0.5 ? 'rgba(42,26,15,0.28)' : 'rgba(138,100,66,0.22)';
        ctx.fillRect(0, y, s, 1 + rnd() * 3);
      }
    }),
    true,
    2,
    2
  );

  const darkBeamColor = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#2d231c';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 75; i++) {
        const y = rnd() * s;
        ctx.fillStyle = 'rgba(15,10,7,0.34)';
        ctx.fillRect(0, y, s, 1 + rnd() * 2.5);
      }
    }),
    true,
    2,
    2
  );

  // Mapa de rugosidade da geada sutil nas bordas do vidro panorâmico
  const frostRough = regTex(
    makeCanvas(256, (ctx, s) => {
      const grd = ctx.createRadialGradient(s * 0.5, s * 0.5, s * 0.24, s * 0.5, s * 0.5, s * 0.62);
      grd.addColorStop(0, '#0c0c0c');
      grd.addColorStop(0.75, '#1d1d1d');
      grd.addColorStop(1, '#7a7a7a');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, s, s);
    }),
    false,
    1,
    1
  );

  const snowMat = regMat(
    new THREE.MeshStandardMaterial({
      map: snowColor,
      bumpMap: snowBump,
      bumpScale: 0.035,
      roughness: 0.84,
      metalness: 0.02,
      vertexColors: true,
    })
  );

  const snowPlainMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6eff9,
      map: snowColor,
      bumpMap: snowBump,
      bumpScale: 0.03,
      roughness: 0.80,
      metalness: 0.03,
    })
  );

  const rockMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x454d59,
      roughness: 0.90,
      metalness: 0.05,
      vertexColors: true,
    })
  );

  const pineMat = regMat(
    new THREE.MeshStandardMaterial({
      map: timberColor,
      roughness: 0.68,
      metalness: 0.04,
    })
  );

  const darkTimberMat = regMat(
    new THREE.MeshStandardMaterial({
      map: darkBeamColor,
      roughness: 0.74,
      metalness: 0.06,
    })
  );

  const spruceMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e382e,
      roughness: 0.92,
      metalness: 0.0,
    })
  );

  const glassMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xcbe4f5,
      roughness: 0.11,
      roughnessMap: frostRough,
      metalness: 0.05,
      transparent: true,
      opacity: 0.16,
      reflectivity: 0.85,
      ior: 1.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );

  const ironMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x26292e,
      roughness: 0.48,
      metalness: 0.72,
    })
  );

  const emberMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xff8c38,
      emissive: 0xff6218,
      emissiveIntensity: 2.2,
      roughness: 0.5,
    })
  );

  const rugMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x6b2f2a,
      roughness: 0.96,
    })
  );

  return {
    snowMat,
    snowPlainMat,
    rockMat,
    pineMat,
    darkTimberMat,
    spruceMat,
    glassMat,
    ironMat,
    emberMat,
    rugMat,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
