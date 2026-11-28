/**
 * js/materials.js
 * Sistema avançado de materiais PBR naturalistas de museu:
 *  - 10 texturas procedurais determinísticas para as 10 famílias marinhas
 *  - Nácar (madrepérola) físico multicamada com iridescência real (Three.js MeshPhysicalMaterial)
 *  - Superfícies fossilizadas, calcárias, esmaltadas de porcelana e lamelares
 *  - Materiais de corte mineral sólido, septos translúcidos e sifúnculo 3D
 *  - Material de Raio X holográfico / volumétrico estilizado
 *  - Materiais da bancada: madeira nobre com veios, ardósia, veludo, latão envelhecido, água 3D e vidro
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
  const regMat = (m) => {
    materials.push(m);
    return m;
  };

  // ==========================================================================
  // TEXTURAS PROCEDURAIS DETERMINÍSTICAS DAS 10 FAMÍLIAS
  // ==========================================================================

  // 1. Náutilo: Chamas em faixas castanho-âmbar e estrias de crescimento finas sobre marfim
  const texNautilus = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#f2ece0';
      ctx.fillRect(0, 0, s, s);
      // Micro-estrias longitudinais de crescimento
      for (let x = 0; x < s; x += 2) {
        const v = 236 + Math.floor((rnd() - 0.5) * 16);
        ctx.fillStyle = `rgb(${v}, ${v - 8}, ${v - 22})`;
        ctx.fillRect(x, 0, 1, s);
      }
      // Faixas flamejantes características de Nautilus pompilius
      const bands = 24;
      for (let b = 0; b < bands; b++) {
        const xBase = (b / bands) * s;
        ctx.beginPath();
        for (let y = 0; y <= s; y += 8) {
          const w1 = Math.sin((y / s) * Math.PI * 4.0 + b * 0.8) * 18;
          const w2 = Math.sin((y / s) * Math.PI * 8.0) * 6;
          const x = xBase + w1 + w2;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 14 + (b % 3) * 4;
        ctx.strokeStyle = b % 2 === 0 ? 'rgba(142, 64, 24, 0.82)' : 'rgba(182, 94, 42, 0.62)';
        ctx.stroke();
      }
    }),
    true,
    4,
    1
  );

  // 2. Amonite: Fóssil mineral oxidado com ferrugem, calcita, sedimentos escuros e suturas
  const texAmmonite = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#42372e';
      ctx.fillRect(0, 0, s, s);
      // Matriz fóssil com granulação de pirita e oxidação
      for (let i = 0; i < 40000; i++) {
        const x = rnd() * s;
        const y = rnd() * s;
        const gray = Math.floor(60 + rnd() * 80);
        ctx.fillStyle = `rgba(${gray + 40}, ${gray + 20}, ${gray}, 0.35)`;
        ctx.fillRect(x, y, 2, 2);
      }
      // Costelas fósseis proeminentes
      for (let b = 0; b < 38; b++) {
        const x = (b / 38) * s;
        const grad = ctx.createLinearGradient(x - 8, 0, x + 8, 0);
        grad.addColorStop(0, 'rgba(30, 24, 18, 0.7)');
        grad.addColorStop(0.5, 'rgba(155, 118, 74, 0.9)');
        grad.addColorStop(1, 'rgba(30, 24, 18, 0.7)');
        ctx.fillStyle = grad;
        ctx.fillRect(x - 8, 0, 16, s);
      }
      // Suturas amoníticas simuladas (ondas com pontas)
      ctx.strokeStyle = 'rgba(215, 180, 120, 0.45)';
      ctx.lineWidth = 1.5;
      for (let y = 30; y < s; y += 60) {
        ctx.beginPath();
        for (let x = 0; x < s; x += 4) {
          const sy = y + Math.sin(x * 0.12) * 8 + Math.sin(x * 0.45) * 4;
          if (x === 0) ctx.moveTo(x, sy);
          else ctx.lineTo(x, sy);
        }
        ctx.stroke();
      }
    }),
    true,
    3,
    1
  );

  // 3. Turritela: Espira ocre claro com cordões espirais longitudinais e estrias finas
  const texTurritella = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#e8d8be';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 4) {
        const c = 205 + Math.sin(y * 0.18) * 35;
        ctx.fillStyle = `rgb(${c + 15}, ${c}, ${c - 20})`;
        ctx.fillRect(0, y, s, 3);
      }
      for (let y = 0; y < s; y += 32) {
        ctx.fillStyle = 'rgba(125, 85, 45, 0.45)';
        ctx.fillRect(0, y, s, 5);
      }
    }),
    true,
    1,
    8
  );

  // 4. Conus: Estampa têxtil fractal triangular / autómatos celulares em tons de marrom e branco
  const texConus = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#dfaf68';
      ctx.fillRect(0, 0, s, s);
      // Fundo castanho rico
      for (let i = 0; i < 20000; i++) {
        ctx.fillStyle = 'rgba(110, 52, 16, 0.08)';
        ctx.fillRect(rnd() * s, rnd() * s, 4, 4);
      }
      // Triângulos de Conus textile em múltiplas escalas
      for (let row = 0; row < 36; row++) {
        const y = (row / 36) * s;
        const triW = 28 + (row % 4) * 6;
        for (let x = 0; x < s; x += triW) {
          if (rnd() > 0.28) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + triW * 0.5, y + triW * 0.85);
            ctx.lineTo(x + triW, y);
            ctx.closePath();
            ctx.fillStyle = '#f8f4ec';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#4a240e';
            ctx.stroke();
          }
        }
      }
    }),
    true,
    2,
    2
  );

  // 5. Murex: Marfim fosco texturizado com pontuações rosadas e bases espinhosas
  const texMurex = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#eee4d4';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 25000; i++) {
        const v = 220 + Math.floor(rnd() * 25);
        ctx.fillStyle = `rgba(${v + 10}, ${v - 5}, ${v - 15}, 0.4)`;
        ctx.fillRect(rnd() * s, rnd() * s, 2, 2);
      }
      for (let y = 0; y < s; y += 48) {
        ctx.fillStyle = 'rgba(185, 120, 100, 0.18)';
        ctx.fillRect(0, y, s, 6);
      }
    }),
    true,
    2,
    2
  );

  // 6. Vieira: Costelas radiais em leque caneladas com bandas concêntricas cor de tijolo/coral
  const texScallop = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#e5ccb4';
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x++) {
        const ridge = Math.sin((x / s) * Math.PI * 2 * 16);
        const l = Math.floor(200 + ridge * 35);
        ctx.fillStyle = `rgb(${l + 25}, ${l}, ${l - 20})`;
        ctx.fillRect(x, 0, 1, s);
      }
      for (let y = 0; y < s; y += 40) {
        const ringColor = y % 80 === 0 ? 'rgba(175, 75, 50, 0.65)' : 'rgba(145, 60, 40, 0.35)';
        ctx.fillStyle = ringColor;
        ctx.fillRect(0, y, s, 10);
      }
    }),
    true,
    1,
    2
  );

  // 7. Ostra: Lamelar cinza-esverdeada irregular e áspera com camadas de calcita e folhelho
  const texOyster = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#7a766c';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 50000; i++) {
        const g = Math.floor(90 + rnd() * 70);
        ctx.fillStyle = `rgb(${g + 8}, ${g + 4}, ${g - 8})`;
        ctx.fillRect(rnd() * s, rnd() * s, 3, 2);
      }
      for (let y = 0; y < s; y += 24) {
        ctx.fillStyle = 'rgba(40, 38, 34, 0.55)';
        ctx.fillRect(0, y, s, 4);
      }
    }),
    true,
    2,
    2
  );

  // 8. Abalone (Paua): Nácar policromático profundo de iridescência vívida
  const texAbalone = regTex(
    makeCanvas(1024, (ctx, s) => {
      const grad = ctx.createLinearGradient(0, 0, s, s);
      grad.addColorStop(0, '#2e6b75');
      grad.addColorStop(0.25, '#42938a');
      grad.addColorStop(0.5, '#5d7398');
      grad.addColorStop(0.75, '#845785');
      grad.addColorStop(1, '#c88c58');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
      // Moiré e lâminas nacaradas
      for (let i = 0; i < 30000; i++) {
        const x = rnd() * s;
        const y = rnd() * s;
        ctx.fillStyle = `rgba(${Math.floor(140 + rnd() * 100)}, ${Math.floor(180 + rnd() * 75)}, ${Math.floor(190 + rnd() * 65)}, 0.18)`;
        ctx.fillRect(x, y, 4, 1);
      }
    }),
    true,
    2,
    2
  );

  // 9. Búzio (Triton): Mosaico geométrico ocre, marrom e salmão
  const texTriton = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#eedac0';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 48) {
        for (let x = 0; x < s; x += 64) {
          ctx.fillStyle = (x + y) % 128 === 0 ? '#6d391f' : '#b2713e';
          ctx.beginPath();
          ctx.ellipse(x + 32, y + 24, 24, 16, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }),
    true,
    2,
    4
  );

  // 10. Cypraea: Esmalte de porcelana vítreo com manchas ovais de leopardo/tigre
  const texCypraea = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#f6f1e6';
      ctx.fillRect(0, 0, s, s);
      // Manchas escuras de leopardo com auréola âmbar
      for (let i = 0; i < 220; i++) {
        const cx = rnd() * s;
        const cy = rnd() * s;
        const rad = 8 + rnd() * 16;
        ctx.fillStyle = 'rgba(164, 94, 38, 0.45)';
        ctx.beginPath();
        ctx.arc(cx, cy, rad * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22160f';
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }),
    true,
    2,
    2
  );

  // Bump maps de micro-textura
  const bumpShell = regTex(
    makeCanvas(512, (ctx, s) => {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 2) {
        const val = Math.floor(128 + Math.sin(x * 0.4) * 28 + (rnd() - 0.5) * 16);
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, 0, 2, s);
      }
    }),
    false,
    6,
    2
  );

  // Textura de madeira nobre para a bancada
  const woodDeskTex = regTex(
    makeCanvas(1024, (ctx, s) => {
      ctx.fillStyle = '#231812';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y++) {
        const grain = Math.sin(y * 0.08) * 8 + Math.sin(y * 0.02) * 20;
        const c = Math.floor(35 + grain + (rnd() - 0.5) * 6);
        ctx.fillStyle = `rgb(${c + 12}, ${c + 4}, ${c})`;
        ctx.fillRect(0, y, s, 1);
      }
    }),
    true,
    4,
    4
  );

  // ==========================================================================
  // MATERIAIS PBR DE ALTO REALISMO
  // ==========================================================================

  // Casca Externa (dinâmica por família)
  const outerShellMat = regMat(
    new THREE.MeshPhysicalMaterial({
      map: texNautilus,
      bumpMap: bumpShell,
      bumpScale: 0.014,
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      iridescence: 0.15,
      iridescenceIOR: 1.36,
    })
  );

  // Madrepérola Interior (Nácar autêntico de aragonita biogênica)
  const nacreMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf6f0f6,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      iridescence: 0.95,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [180, 580],
      side: THREE.DoubleSide,
    })
  );

  // Borda mineral maciça de corte (aragonita polida na seção anatômica)
  const cutRimMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xede4d8,
      roughness: 0.26,
      metalness: 0.02,
      clearcoat: 0.55,
      iridescence: 0.4,
      iridescenceIOR: 1.38,
      side: THREE.DoubleSide,
    })
  );

  // Septos camerais (aragonita translúcida côncava)
  const septaMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xf2ebf4,
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 0.8,
      iridescence: 0.85,
      iridescenceIOR: 1.44,
      transmission: 0.15,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    })
  );

  // Sifúnculo 3D (cordão vascular orgânico com tubo de conchiolina calcificada)
  const siphuncleMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xb57852,
      roughness: 0.45,
      metalness: 0.05,
    })
  );

  // Modo Raio X (holográfico anatômico / volumétrico estilizado)
  const xrayMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x38b8d0,
      emissive: 0x124855,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      transmission: 0.75,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );

  // ==========================================================================
  // MATERIAIS DO AMBIENTE & INSTRUMENTOS CIENTÍFICOS
  // ==========================================================================

  // Madeira escura da bancada
  const woodDeskMat = regMat(
    new THREE.MeshStandardMaterial({
      map: woodDeskTex,
      roughness: 0.65,
      metalness: 0.08,
    })
  );

  // Bandeja de ardósia escura
  const slateMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x171b22,
      roughness: 0.72,
      metalness: 0.12,
    })
  );

  // Latão envelhecido (paquímetro, molduras, luminária)
  const brassMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xb99859,
      roughness: 0.32,
      metalness: 0.88,
    })
  );

  // Aço cirúrgico / instrumentos de precisão
  const steelMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xd8dde5,
      roughness: 0.22,
      metalness: 0.94,
    })
  );

  // Veludo / feltro de proteção
  const velvetMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x221a28,
      roughness: 0.95,
      metalness: 0.0,
    })
  );

  // Vidro transparente (lente da lupa, frascos, aquário de flutuabilidade)
  const glassMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1.0,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.4,
    })
  );

  // Água 3D do tanque de flutuabilidade
  const waterMat = regMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x286e7a,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.08,
      ior: 1.333,
      thickness: 0.8,
    })
  );

  // Areia mineral
  const sandMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xb4a48a,
      roughness: 0.92,
      metalness: 0.02,
    })
  );

  // Dicionário de texturas das 10 espécies
  const speciesTextureMap = {
    nautilus_flames: { tex: texNautilus, roughness: 0.32, clearcoat: 0.42, irid: 0.22 },
    fossil_ammonite: { tex: texAmmonite, roughness: 0.65, clearcoat: 0.12, irid: 0.1 },
    turritella_bands: { tex: texTurritella, roughness: 0.45, clearcoat: 0.25, irid: 0.15 },
    conus_textile: { tex: texConus, roughness: 0.18, clearcoat: 0.75, irid: 0.35 },
    murex_spines: { tex: texMurex, roughness: 0.48, clearcoat: 0.2, irid: 0.15 },
    scallop_fan: { tex: texScallop, roughness: 0.42, clearcoat: 0.28, irid: 0.3 },
    oyster_lamellar: { tex: texOyster, roughness: 0.78, clearcoat: 0.08, irid: 0.05 },
    abalone_paua: { tex: texAbalone, roughness: 0.22, clearcoat: 0.85, irid: 0.98 },
    triton_leopard: { tex: texTriton, roughness: 0.34, clearcoat: 0.48, irid: 0.25 },
    cypraea_tiger: { tex: texCypraea, roughness: 0.08, clearcoat: 0.95, irid: 0.65 },
  };

  function applySpeciesMaterial(textureStyleKey) {
    const spec = speciesTextureMap[textureStyleKey] || speciesTextureMap.nautilus_flames;
    outerShellMat.map = spec.tex;
    outerShellMat.roughness = spec.roughness;
    outerShellMat.clearcoat = spec.clearcoat;
    outerShellMat.iridescence = spec.irid;
    outerShellMat.needsUpdate = true;
  }

  return {
    outerShellMat,
    nacreMat,
    cutRimMat,
    septaMat,
    siphuncleMat,
    xrayMat,
    woodDeskMat,
    slateMat,
    brassMat,
    steelMat,
    velvetMat,
    glassMat,
    waterMat,
    sandMat,
    applySpeciesMaterial,
    dispose() {
      textures.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
