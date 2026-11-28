/**
 * js/materials.js
 * Materiais PBR para a galeria íntima de madeira, vitrines em vidro,
 * placas de legenda legíveis e texturas locais sob demanda (zero upload).
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

export function createMemoryMuseumMaterials(seed = 7208) {
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

  // Assoalho de madeira espinha-de-peixe quente
  const parquetTex = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#5c3c24';
      ctx.fillRect(0, 0, s, s);
      const plankH = 32;
      const plankW = 128;
      for (let y = 0; y < s; y += plankH) {
        const off = ((y / plankH) % 2) * (plankW * 0.5);
        for (let x = -plankW; x < s + plankW; x += plankW) {
          const shade = Math.floor(82 + (rnd() - 0.5) * 28);
          ctx.fillStyle = `rgb(${shade + 22}, ${shade - 8}, ${Math.max(12, shade - 34)})`;
          ctx.fillRect(x + off + 1, y + 1, plankW - 2, plankH - 2);
        }
      }
    }),
    true,
    4,
    4
  );

  // Parede em gesso bege quente de galeria
  const wallTex = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#ddd3c2';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 4000; i++) {
        const v = Math.floor(215 + (rnd() - 0.5) * 18);
        ctx.fillStyle = `rgb(${v},${v - 6},${v - 18})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    }),
    true,
    3,
    2
  );

  const woodFloorMat = regMat(new THREE.MeshStandardMaterial({ map: parquetTex, roughness: 0.56, metalness: 0.04 }));
  const walnutMat = regMat(new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.58, metalness: 0.05 }));
  const plasterMat = regMat(new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.90 }));
  const brassMat = regMat(new THREE.MeshStandardMaterial({ color: 0xc29e57, roughness: 0.30, metalness: 0.85 }));
  const paperMat = regMat(new THREE.MeshStandardMaterial({ color: 0xf4eee2, roughness: 0.78 }));
  const ceramicMat = regMat(new THREE.MeshStandardMaterial({ color: 0xd9cfc2, roughness: 0.34, metalness: 0.05 }));
  const linenMat = regMat(new THREE.MeshStandardMaterial({ color: 0x5c4738, roughness: 0.85 }));
  const glassMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe2eef2,
      roughness: 0.08,
      metalness: 0.04,
      transparent: true,
      opacity: 0.16,
      reflectivity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );

  function makePlaqueMaterial(text) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#211c17';
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = '#c29e57';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 88);
    ctx.fillStyle = '#f2e8d5';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = (text || '').trim();
    if (label) {
      ctx.font = '600 22px "Segoe UI", system-ui, sans-serif';
      ctx.fillText(label.slice(0, 22), 128, 48);
    } else {
      ctx.fillStyle = 'rgba(242,232,213,0.28)';
      ctx.font = 'italic 16px "Segoe UI", system-ui, sans-serif';
      ctx.fillText('— legenda vazia —', 128, 48);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65 });
    return { mat, tex };
  }

  return {
    woodFloorMat,
    walnutMat,
    plasterMat,
    brassMat,
    paperMat,
    ceramicMat,
    linenMat,
    glassMat,
    makePlaqueMaterial,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
