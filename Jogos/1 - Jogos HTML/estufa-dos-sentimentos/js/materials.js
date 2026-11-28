/**
 * js/materials.js
 * Materiais naturais PBR para a Estufa dos Sentimentos:
 *  - Madeira de cedro da bancada, ladrilho de pedra, terracota de vaso, vidro translúcido
 *  - Folhagem e pétalas tingíveis dinamicamente sem juízo de valor
 *  - Etiqueta de madeira/papel em branco atualizada por CanvasTexture local
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

export function createGreenhouseMaterials(seed = 7104) {
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

  const woodTex = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#8b6240';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 85; i++) {
        const y = rnd() * s;
        ctx.fillStyle = rnd() > 0.5 ? 'rgba(60,36,18,0.20)' : 'rgba(175,134,92,0.20)';
        ctx.fillRect(0, y, s, 1 + rnd() * 2.5);
      }
    }),
    true,
    2,
    2
  );

  const stoneTex = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#9aa19b';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 6000; i++) {
        const v = Math.floor(136 + (rnd() - 0.5) * 44);
        ctx.fillStyle = `rgb(${v},${v + 2},${v - 2})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
      ctx.strokeStyle = 'rgba(72,78,74,0.45)';
      ctx.lineWidth = 3;
      const step = 128;
      for (let g = 0; g <= s; g += step) {
        ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(s, g); ctx.stroke();
      }
    }),
    true,
    4,
    4
  );

  const soilTex = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#3f2e22';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 5000; i++) {
        const v = Math.floor(46 + rnd() * 34);
        ctx.fillStyle = `rgb(${v + 14},${v + 4},${v - 6})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    }),
    true,
    1,
    1
  );

  // Canvas dinâmico da etiqueta em branco espetada no vaso
  const tagCanvas = document.createElement('canvas');
  tagCanvas.width = 256;
  tagCanvas.height = 128;
  const tagTex = new THREE.CanvasTexture(tagCanvas);
  tagTex.colorSpace = THREE.SRGBColorSpace;
  textures.push(tagTex);

  const cedarMat = regMat(new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.72, metalness: 0.04 }));
  const floorMat = regMat(new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.86, metalness: 0.02 }));
  const soilMat = regMat(new THREE.MeshStandardMaterial({ map: soilTex, roughness: 0.96 }));
  const potMat = regMat(new THREE.MeshStandardMaterial({ color: 0xb86846, roughness: 0.78, metalness: 0.03 }));
  const ironMat = regMat(new THREE.MeshStandardMaterial({ color: 0x333c3a, roughness: 0.50, metalness: 0.65 }));
  const brassMat = regMat(new THREE.MeshStandardMaterial({ color: 0xb8964e, roughness: 0.34, metalness: 0.82 }));
  const glassMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd9ece8,
      roughness: 0.14,
      metalness: 0.04,
      transparent: true,
      opacity: 0.22,
      reflectivity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );

  const stemMat = regMat(new THREE.MeshStandardMaterial({ color: 0x4f7448, roughness: 0.68 }));
  const foliageMat = regMat(new THREE.MeshStandardMaterial({ color: 0x5fa876, roughness: 0.54, side: THREE.DoubleSide }));
  const accentBloomMat = regMat(new THREE.MeshStandardMaterial({ color: 0x5fa876, roughness: 0.44, side: THREE.DoubleSide }));
  const bgLeafMat = regMat(new THREE.MeshStandardMaterial({ color: 0x466d4a, roughness: 0.74, side: THREE.DoubleSide }));
  const tagMat = regMat(new THREE.MeshStandardMaterial({ map: tagTex, roughness: 0.82 }));

  function updateTagCanvas(text) {
    const ctx = tagCanvas.getContext('2d');
    ctx.fillStyle = '#efe6d5';
    ctx.fillRect(0, 0, tagCanvas.width, tagCanvas.height);
    ctx.strokeStyle = '#c9bba2';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, tagCanvas.width - 8, tagCanvas.height - 8);

    ctx.fillStyle = '#3c332a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = (text || '').trim();
    if (label) {
      ctx.font = '600 26px "Segoe UI", system-ui, sans-serif';
      ctx.fillText(label.slice(0, 22), tagCanvas.width / 2, tagCanvas.height / 2);
    } else {
      ctx.strokeStyle = 'rgba(100,88,72,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(36, 52); ctx.lineTo(220, 52);
      ctx.moveTo(52, 82); ctx.lineTo(204, 82);
      ctx.stroke();
    }
    tagTex.needsUpdate = true;
  }

  function applyColorChoice(hex, moisture = 0.6) {
    accentBloomMat.color.set(hex);
    // Folhagem responde sutilmente ao tom escolhido misturado ao verde botânico natural
    const chosen = new THREE.Color(hex);
    const botGreen = new THREE.Color(0x4b7d53);
    foliageMat.color.copy(botGreen).lerp(chosen, 0.58);
    // Umidade altera brilho superficial das folhas sem juízo emocional
    foliageMat.roughness = 0.66 - moisture * 0.24;
    soilMat.color.setRGB(0.85 - moisture * 0.25, 0.85 - moisture * 0.25, 0.85 - moisture * 0.25);
  }

  updateTagCanvas('');

  return {
    cedarMat,
    floorMat,
    soilMat,
    potMat,
    ironMat,
    brassMat,
    glassMat,
    stemMat,
    foliageMat,
    accentBloomMat,
    bgLeafMat,
    tagMat,
    updateTagCanvas,
    applyColorChoice,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
