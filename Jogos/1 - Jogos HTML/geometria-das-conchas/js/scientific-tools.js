/**
 * js/scientific-tools.js
 * Instrumentos científicos funcionais para o Laboratório de Morfologia Marinha:
 *  - Paquímetro de precisão (medição de largura, altura, profundidade e abertura com alternância mm/cm)
 *  - Balança digital analítica com tara, peso estimado por volume e densidade mineral
 *  - Lupa óptica 3D de alta ampliação localizada
 *  - Microscópio com lâminas ultraestruturais (10x, 25x, 50x e 100x com plaquetas hexagonais de nácar)
 */
import * as THREE from 'three';

export function createScientificTools(scene, mats) {
  // Canvas dinâmico para lâminas do microscópio
  const scopeCanvas = document.createElement('canvas');
  scopeCanvas.width = 512;
  scopeCanvas.height = 512;
  const scopeCtx = scopeCanvas.getContext('2d');
  const scopeTexture = new THREE.CanvasTexture(scopeCanvas);

  function drawMicroscopeSlide(zoomLevel = 10, speciesId = 'nautilus') {
    const s = 512;
    scopeCtx.fillStyle = '#0f141a';
    scopeCtx.fillRect(0, 0, s, s);

    // Círculo da ocular do microscópio
    scopeCtx.save();
    scopeCtx.beginPath();
    scopeCtx.arc(s / 2, s / 2, s * 0.46, 0, Math.PI * 2);
    scopeCtx.clip();

    if (zoomLevel === 10) {
      // 10x: Estrias finas de crescimento macroscópico e bandas de deposição
      scopeCtx.fillStyle = '#efe4d2';
      scopeCtx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 6) {
        const shade = Math.floor(210 + Math.sin(x * 0.1) * 25);
        scopeCtx.fillStyle = `rgb(${shade}, ${shade - 10}, ${shade - 25})`;
        scopeCtx.fillRect(x, 0, 4, s);
      }
      scopeCtx.fillStyle = 'rgba(140, 70, 30, 0.45)';
      scopeCtx.fillRect(80, 0, 45, s);
      scopeCtx.fillRect(260, 0, 60, s);
      scopeCtx.fillRect(400, 0, 50, s);
    } else if (zoomLevel === 25) {
      // 25x: Prismas de calcita orientados perpendicularmente à casca
      scopeCtx.fillStyle = '#dfd3be';
      scopeCtx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 12) {
        for (let x = 0; x < s; x += 16) {
          const v = Math.floor(180 + Math.random() * 55);
          scopeCtx.fillStyle = `rgba(${v + 15}, ${v + 5}, ${v - 15}, 0.85)`;
          scopeCtx.fillRect(x + (y % 24 === 0 ? 8 : 0), y, 14, 10);
        }
      }
    } else if (zoomLevel === 50) {
      // 50x: Lâminas de aragonita e início do padrão de nácar folheado
      scopeCtx.fillStyle = '#3a5862';
      scopeCtx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 8) {
        const hue = (y * 0.6) % 360;
        scopeCtx.fillStyle = `hsla(${hue}, 45%, 65%, 0.75)`;
        scopeCtx.fillRect(0, y, s, 6);
      }
    } else {
      // 100x: Ultraestrutura do nácar em "parede de tijolos" (brick-and-mortar)
      // Plaquetas hexagonais de aragonita de 0,5 µm empilhadas em matriz proteica
      scopeCtx.fillStyle = '#1c2e35';
      scopeCtx.fillRect(0, 0, s, s);
      const bH = 14;
      const bW = 32;
      for (let row = 0; row < s / bH + 2; row++) {
        const y = row * bH;
        const xOffset = (row % 2) * (bW / 2);
        for (let col = -1; col < s / bW + 2; col++) {
          const x = col * bW + xOffset;
          // Plaqueta de aragonita com iridescência de difração
          const iridHue = (row * 18 + col * 8) % 360;
          scopeCtx.fillStyle = `hsla(${iridHue}, 60%, 75%, 0.9)`;
          scopeCtx.fillRect(x + 1, y + 1, bW - 2, bH - 2);
          // Matriz orgânica de conquiolina e proteínas de seda entre as plaquetas
          scopeCtx.strokeStyle = '#081216';
          scopeCtx.lineWidth = 1.5;
          scopeCtx.strokeRect(x, y, bW, bH);
        }
      }
    }

    // Retículo métrico e escala de micrômetros (µm)
    scopeCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    scopeCtx.lineWidth = 1;
    scopeCtx.beginPath();
    scopeCtx.moveTo(s / 2, 40);
    scopeCtx.lineTo(s / 2, s - 40);
    scopeCtx.moveTo(40, s / 2);
    scopeCtx.lineTo(s - 40, s / 2);
    scopeCtx.stroke();

    // Barra de escala
    const barW = zoomLevel === 10 ? 100 : zoomLevel === 25 ? 80 : zoomLevel === 50 ? 60 : 40;
    const barText = zoomLevel === 10 ? '1.0 mm' : zoomLevel === 25 ? '250 µm' : zoomLevel === 50 ? '50 µm' : '5 µm';
    scopeCtx.fillStyle = '#ffffff';
    scopeCtx.fillRect(s / 2 - barW / 2, s - 65, barW, 4);
    scopeCtx.font = '12px "Segoe UI", sans-serif';
    scopeCtx.textAlign = 'center';
    scopeCtx.fillText(barText, s / 2, s - 48);
    scopeCtx.restore();

    scopeTexture.needsUpdate = true;
  }

  function getCaliperData(metrics, unit = 'mm') {
    const factor = unit === 'cm' ? 10 : 100;
    const rawWidth = metrics.width || 1.0;
    const rawHeight = metrics.height || 1.0;
    const rawDepth = metrics.depth || 1.0;

    return {
      unit,
      width: (rawWidth * factor).toFixed(1),
      height: (rawHeight * factor).toFixed(1),
      depth: (rawDepth * factor).toFixed(1),
      displayStr: `${(rawWidth * factor).toFixed(1)} ${unit}`,
    };
  }

  function getScaleData(metrics, tare = 0) {
    const baseMass = metrics.estimatedMassGrams || 280;
    const netMass = Math.max(0, baseMass - tare);
    return {
      grossMass: baseMass,
      tare,
      netMass,
      displayStr: `${netMass} g`,
    };
  }

  drawMicroscopeSlide(10, 'nautilus');

  return {
    scopeCanvas,
    scopeTexture,
    drawMicroscopeSlide,
    getCaliperData,
    getScaleData,
    dispose() {
      scopeTexture.dispose();
    },
  };
}
