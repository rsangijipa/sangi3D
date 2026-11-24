/**
 * Gerador de Texturas Procedurais PBR e Sistema de Altura Dinâmico da Areia
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

import * as THREE from 'three';

/**
 * Converte um Canvas de altura em um mapa de normais por diferenças centrais
 */
export function createNormalMapFromHeight(heightCanvas, strength = 2.0) {
  const width = heightCanvas.width;
  const height = heightCanvas.height;
  const ctx = heightCanvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normCtx = normalCanvas.getContext('2d');
  const normData = normCtx.createImageData(width, height);
  const nData = normData.data;

  const getH = (x, y) => {
    x = (x + width) % width;
    y = (y + height) % height;
    const idx = (y * width + x) * 4;
    return (data[idx] + data[idx + 1] + data[idx + 2]) / (3 * 255.0);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = getH(x - 1, y);
      const right = getH(x + 1, y);
      const down = getH(x, y - 1);
      const up = getH(x, y + 1);

      const dx = (right - left) * strength;
      const dy = (up - down) * strength;
      const dz = 1.0;

      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = (dx / len) * 0.5 + 0.5;
      const ny = (dy / len) * 0.5 + 0.5;
      const nz = (dz / len) * 0.5 + 0.5;

      const idx = (y * width + x) * 4;
      nData[idx] = Math.floor(nx * 255);
      nData[idx + 1] = Math.floor(ny * 255);
      nData[idx + 2] = Math.floor(nz * 255);
      nData[idx + 3] = 255;
    }
  }

  normCtx.putImageData(normData, 0, 0);
  const tex = new THREE.CanvasTexture(normalCanvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Textura procedural de Nogueira Escura (Walnut) com veios orgânicos
 */
export function createWalnutWoodTextures(width = 1024, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Gradiente base de nogueira nobre e escura
  const grad = ctx.createLinearGradient(0, 0, width, height * 0.3);
  grad.addColorStop(0, '#2c1a0e');
  grad.addColorStop(0.3, '#3b2415');
  grad.addColorStop(0.7, '#22140b');
  grad.addColorStop(1, '#301c10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Veios ondulados característicos de madeira de lei
  const numVeios = 120;
  for (let i = 0; i < numVeios; i++) {
    const yBase = (i / numVeios) * height;
    ctx.beginPath();
    ctx.moveTo(0, yBase);

    const freq1 = 0.003 + (i % 5) * 0.001;
    const freq2 = 0.008 + (i % 3) * 0.002;
    const amp = 18 + (i % 7) * 8;

    for (let x = 0; x <= width; x += 16) {
      const yOffset = Math.sin(x * freq1) * amp + Math.cos(x * freq2) * (amp * 0.4);
      ctx.lineTo(x, yBase + yOffset);
    }

    const tomEscuro = (i % 4 === 0);
    const alpha = tomEscuro ? 0.35 : 0.18;
    ctx.strokeStyle = tomEscuro ? '#1a0e08' : '#573822';
    ctx.lineWidth = tomEscuro ? 2.5 : 1.2;
    ctx.stroke();
  }

  // Poros finos de madeira
  const imgData = ctx.getImageData(0, 0, width, height);
  const d = imgData.data;
  for (let idx = 0; idx < d.length; idx += 4) {
    if (Math.random() < 0.25) {
      const noise = (Math.random() - 0.5) * 16;
      d[idx] = Math.max(0, Math.min(255, d[idx] + noise));
      d[idx + 1] = Math.max(0, Math.min(255, d[idx + 1] + noise * 0.7));
      d[idx + 2] = Math.max(0, Math.min(255, d[idx + 2] + noise * 0.4));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;

  // Mapa de normais
  const normalMap = createNormalMapFromHeight(canvas, 1.8);

  // Mapa de rugosidade
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = '#666666'; // acabamento semibrilho acetinado de nogueira
  rCtx.fillRect(0, 0, width, height);
  rCtx.drawImage(canvas, 0, 0);
  const rData = rCtx.getImageData(0, 0, width, height);
  for (let idx = 0; idx < rData.data.length; idx += 4) {
    const val = 80 + (rData.data[idx] * 0.4);
    rData.data[idx] = val;
    rData.data[idx + 1] = val;
    rData.data[idx + 2] = val;
  }
  rCtx.putImageData(rData, 0, 0);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);

  return { diffuseMap, normalMap, roughnessMap };
}

/**
 * Sistema de Areia Zen com Heightmap Interativo
 */
export class ZenSandSystem {
  constructor(size = 512) {
    this.size = size;
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext('2d');

    // Canvas de traçado para o sulco contínuo
    this.grooveCanvas = document.createElement('canvas');
    this.grooveCanvas.width = size;
    this.grooveCanvas.height = size;
    this.grooveCtx = this.grooveCanvas.getContext('2d');

    this.lastDrawPos = null;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;

    this.resetSand();
  }

  resetSand() {
    const s = this.size;
    const ctx = this.ctx;

    // Fundo base bege marfim suave com textura arenosa fina
    ctx.fillStyle = '#eee8db';
    ctx.fillRect(0, 0, s, s);

    // Círculos concêntricos zen finíssimos prévios
    ctx.lineWidth = 1.0;
    const center = s / 2;
    for (let r = 20; r < center - 10; r += 14) {
      ctx.strokeStyle = (r % 28 === 0) ? '#ddd4c2' : '#f5f0e6';
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Granulação micro
    const imgData = ctx.getImageData(0, 0, s, s);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Limpar groove canvas
    this.grooveCtx.clearRect(0, 0, s, s);
    this.lastDrawPos = null;
    this.texture.needsUpdate = true;
  }

  /**
   * Traça sulco na areia com efeito de reentrância e sombra nas bordas
   */
  carveAt(normX, normY, width = 6) {
    const s = this.size;
    const px = ((normX * 0.5) + 0.5) * s;
    const py = ((-normY * 0.5) + 0.5) * s;

    // Verificar limites circulares
    const dx = px - s / 2;
    const dy = py - s / 2;
    if (dx * dx + dy * dy > (s * 0.46) * (s * 0.46)) {
      this.lastDrawPos = null;
      return;
    }

    const gCtx = this.grooveCtx;
    const ctx = this.ctx;

    if (this.lastDrawPos) {
      // Linha de depressão no centro (sombra profunda)
      ctx.beginPath();
      ctx.moveTo(this.lastDrawPos.x, this.lastDrawPos.y);
      ctx.lineTo(px, py);
      ctx.lineWidth = width * 1.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(110, 92, 72, 0.85)';
      ctx.stroke();

      // Centro do sulco bem escuro (reentrância profunda)
      ctx.beginPath();
      ctx.moveTo(this.lastDrawPos.x, this.lastDrawPos.y);
      ctx.lineTo(px, py);
      ctx.lineWidth = width * 0.7;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(55, 42, 30, 0.95)';
      ctx.stroke();

      // Borda iluminada (crista da areia empurrada)
      ctx.beginPath();
      ctx.moveTo(this.lastDrawPos.x + 1.5, this.lastDrawPos.y - 1.5);
      ctx.lineTo(px + 1.5, py - 1.5);
      ctx.lineWidth = width * 0.5;
      ctx.strokeStyle = 'rgba(255, 252, 240, 0.7)';
      ctx.stroke();
    } else {
      // Ponto de contato inicial
      ctx.beginPath();
      ctx.arc(px, py, width * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(55, 42, 30, 0.95)';
      ctx.fill();
    }

    this.lastDrawPos = { x: px, y: py };
    this.texture.needsUpdate = true;
  }

  releaseCarve() {
    this.lastDrawPos = null;
  }

  /**
   * Animação do rastelo alisando a areia
   */
  smoothStep(factor = 0.08) {
    const s = this.size;
    const ctx = this.ctx;
    // Pinta camada semitransparente da cor base da areia
    ctx.fillStyle = `rgba(238, 232, 219, ${factor})`;
    ctx.fillRect(0, 0, s, s);

    // Restaura sutilmente anéis zen
    const center = s / 2;
    ctx.lineWidth = 0.5;
    for (let r = 20; r < center - 10; r += 14) {
      ctx.strokeStyle = `rgba(221, 212, 194, ${factor * 0.6})`;
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.texture.needsUpdate = true;
  }
}

/**
 * Textura de brocado bordado oriental para a almofada da tigela tibetana
 */
export function createBrocadeTexture(baseColor = '#932621', goldColor = '#d4a047') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Trama cruzada de tecido damascado
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 8) {
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }

  // Motivos florais dourados entrelaçados
  ctx.strokeStyle = goldColor;
  ctx.fillStyle = goldColor;
  const step = 64;
  for (let y = step / 2; y < 512; y += step) {
    for (let x = step / 2; x < 512; x += step) {
      // Flor de lótus simplificada
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();

      for (let a = 0; a < 8; a++) {
        const rad = (a * Math.PI) / 4;
        const px = x + Math.cos(rad) * 16;
        const py = y + Math.sin(rad) * 16;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/**
 * Textura metálica martelada / escovada para a tigela de bronze
 */
export function createHammeredBronzeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Gradiente de bronze dourado antigo
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#be9446');
  grad.addColorStop(0.5, '#d4ab59');
  grad.addColorStop(1, '#9b7632');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Facetas sutis de martelamento manual
  const numFacetas = 400;
  for (let i = 0; i < numFacetas; i++) {
    const fx = Math.random() * 512;
    const fy = Math.random() * 512;
    const fr = 8 + Math.random() * 14;

    const fGrad = ctx.createRadialGradient(fx - fr * 0.3, fy - fr * 0.3, 1, fx, fy, fr);
    fGrad.addColorStop(0, 'rgba(255, 230, 160, 0.22)');
    fGrad.addColorStop(0.7, 'rgba(120, 85, 30, 0.15)');
    fGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
  }

  const diffuseMap = new THREE.CanvasTexture(canvas);
  const normalMap = createNormalMapFromHeight(canvas, 1.5);
  return { diffuseMap, normalMap };
}
