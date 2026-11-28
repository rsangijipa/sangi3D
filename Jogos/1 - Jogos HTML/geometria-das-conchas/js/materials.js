/**
 * js/materials.js
 * Materiais PBR naturalistas para museu de conchas:
 *  - Exterior da concha (periostraco calcificado: náutilo listrado, costelas marfim, marfim nacarado)
 *  - Interior em madrepérola (MeshPhysicalMaterial com iridescência real r187)
 *  - Parede de corte sólida e septos camerais translúcidos/nacarados
 *  - Areia fina de praia em bandeja de ardósia escura e latão de paquímetro
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

export function createShellMuseumMaterials(seed = 2509) {
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

  // Textura 1: Listras orgânicas de Náutilo (faixas castanho-âmbar flamejantes sobre marfim)
  const bandedTex = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#efe6d5';
      ctx.fillRect(0, 0, s, s);
      // Estrias finas de crescimento longitudinal
      for (let x = 0; x < s; x += 2) {
        const shade = 232 + Math.floor((rnd() - 0.5) * 14);
        ctx.fillStyle = `rgb(${shade}, ${shade - 8}, ${shade - 22})`;
        ctx.fillRect(x, 0, 1, s);
      }
      // Faixas flamejantes sinuosas (padrão característico de Nautilus pompilius)
      for (let band = 0; band < 18; band++) {
        const xBase = (band / 18) * s;
        ctx.beginPath();
        for (let y = 0; y <= s; y += 8) {
          const wave = Math.sin((y / s) * Math.PI * 3.0 + band * 0.7) * 14;
          const x = xBase + wave;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 10 + (band % 3) * 3;
        ctx.strokeStyle = band % 2 === 0 ? 'rgba(134, 68, 32, 0.78)' : 'rgba(168, 92, 46, 0.55)';
        ctx.stroke();
      }
    }),
    true,
    4,
    1
  );

  // Textura 2: Costelas calcárias em marfim/ocre quente com sulcos escurecidos
  const ribbedTex = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#e7dac2';
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x++) {
        const ridge = Math.sin((x / s) * Math.PI * 2 * 14);
        const l = Math.floor(210 + ridge * 26 + (rnd() - 0.5) * 8);
        ctx.fillStyle = `rgb(${l + 10}, ${l}, ${l - 18})`;
        ctx.fillRect(x, 0, 1, s);
      }
      // Linhas suaves de pausa sazonal
      for (let y = 0; y < s; y += 64) {
        ctx.fillStyle = 'rgba(122, 92, 62, 0.18)';
        ctx.fillRect(0, y, s, 3);
      }
    }),
    true,
    3,
    1
  );

  // Textura 3: Marfim perolado suave para variação Nacarado Liso
  const ivoryTex = regTex(
    makeCanvas(512, (ctx, s) => {
      const grad = ctx.createLinearGradient(0, 0, 0, s);
      grad.addColorStop(0, '#f4ede2');
      grad.addColorStop(0.5, '#e8dccb');
      grad.addColorStop(1, '#f0e5d4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 3) {
        ctx.fillStyle = 'rgba(190, 168, 142, 0.12)';
        ctx.fillRect(x, 0, 1, s);
      }
    }),
    true,
    2,
    1
  );

  // Bump map fino das linhas de crescimento calcárias
  const shellBump = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 2) {
        const g = Math.floor(128 + Math.sin(x * 0.45) * 32 + (rnd() - 0.5) * 18);
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(x, 0, 2, s);
      }
    }),
    false,
    6,
    1
  );

  // Areia mineral de museu com micro-grãos e conchinhas claras
  const sandColor = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#b9aa8e';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 18000; i++) {
        const x = rnd() * s;
        const y = rnd() * s;
        const v = Math.floor(156 + (rnd() - 0.38) * 64);
        ctx.fillStyle = `rgb(${v + 12}, ${v + 4}, ${Math.max(40, v - 16)})`;
        ctx.fillRect(x, y, rnd() > 0.9 ? 2 : 1, 1);
      }
    }),
    true,
    4,
    4
  );

  const sandBump = regTex(
    makeCanvas(256, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 9000; i++) {
        const g = Math.floor(96 + rnd() * 68);
        ctx.fillStyle = `rgb(${g},${g},${g})`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
    }),
    false,
    5,
    5
  );

  // Materiais da Concha
  const outerShellMat = regMat(
    new THREE.MeshPhysicalMaterial({
      map: bandedTex,
      bumpMap: shellBump,
      bumpScale: 0.014,
      roughness: 0.34,
      metalness: 0.02,
      clearcoat: 0.42,
      clearcoatRoughness: 0.28,
      iridescence: 0.16,
      iridescenceIOR: 1.36,
    })
  );

  // Borda maciça de corte e septos internos (dupla face para iluminação uniforme dos septos)
  const nacreMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf4eff4,
      roughness: 0.16,
      metalness: 0.06,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      iridescence: 0.92,
      iridescenceIOR: 1.42,
      iridescenceThicknessRange: [180, 560],
      side: THREE.DoubleSide,
    })
  );

  // Borda maciça de corte (aragonita nacarada polida)
  const cutRimMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xebe3d7,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.55,
      iridescence: 0.45,
      iridescenceIOR: 1.38,
      side: THREE.DoubleSide,
    })
  );

  // Cenário de bancada de museu
  const sandMat = regMat(
    new THREE.MeshStandardMaterial({
      map: sandColor,
      bumpMap: sandBump,
      bumpScale: 0.022,
      roughness: 0.90,
      metalness: 0.02,
    })
  );

  const slateMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x171b22,
      roughness: 0.72,
      metalness: 0.12,
    })
  );

  const brassMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xb89652,
      roughness: 0.32,
      metalness: 0.86,
    })
  );

  function setOuterTexture(styleKey) {
    if (styleKey === 'nacre') {
      outerShellMat.map = ivoryTex;
      outerShellMat.iridescence = 0.65;
      outerShellMat.roughness = 0.22;
      outerShellMat.bumpScale = 0.008;
    } else if (styleKey === 'ribbed') {
      outerShellMat.map = ribbedTex;
      outerShellMat.iridescence = 0.12;
      outerShellMat.roughness = 0.44;
      outerShellMat.bumpScale = 0.024;
    } else {
      outerShellMat.map = bandedTex;
      outerShellMat.iridescence = 0.22;
      outerShellMat.roughness = 0.30;
      outerShellMat.bumpScale = 0.014;
    }
    outerShellMat.needsUpdate = true;
  }

  return {
    outerShellMat,
    nacreMat,
    cutRimMat,
    sandMat,
    slateMat,
    brassMat,
    setOuterTexture,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
