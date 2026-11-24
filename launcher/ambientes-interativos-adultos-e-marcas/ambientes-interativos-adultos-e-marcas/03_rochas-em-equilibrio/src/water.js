import * as THREE from 'three';

/**
 * Sistema de Água Rasa de Rio com cáusticas animadas, ondulações de fluxo
 * e sincronização com o ritmo respiratório do mindfulness.
 */
export class RiverWaterSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.waterLevel = options.waterLevel ?? -0.05;
    this.ripples = [];
    this.breathSpeed = 1.0;
    this.breathCycle = 10.0; // 4s inspirar + 2s pausar + 4s expirar

    this.initWater();
    this.initCaustics();
  }

  initWater() {
    // 1. Textura normal animada para fluxo do rio
    this.normalSize = 256;
    this.normalCanvas = document.createElement('canvas');
    this.normalCanvas.width = this.normalCanvas.height = this.normalSize;
    this.normalCtx = this.normalCanvas.getContext('2d');

    this.normalTex = new THREE.CanvasTexture(this.normalCanvas);
    this.normalTex.wrapS = this.normalTex.wrapT = THREE.RepeatWrapping;
    this.normalTex.repeat.set(12, 12);

    const geo = new THREE.PlaneGeometry(28, 24, 48, 48);
    geo.rotateX(-Math.PI / 2);

    this.material = new THREE.MeshStandardMaterial({
      color: 0x44a6a0,
      roughness: 0.04,
      metalness: 0.06,
      normalMap: this.normalTex,
      normalScale: new THREE.Vector2(0.32, 0.32),
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.name = 'agua_rio';
    this.mesh.position.y = this.waterLevel;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    this.time = 0;
    this.renderNormalMap(0);
  }

  initCaustics() {
    // 2. Plano de cáusticas projetadas no leito do rio e flanco da rocha
    this.causticSize = 256;
    this.causticCanvas = document.createElement('canvas');
    this.causticCanvas.width = this.causticCanvas.height = this.causticSize;
    this.causticCtx = this.causticCanvas.getContext('2d');

    this.causticTex = new THREE.CanvasTexture(this.causticCanvas);
    this.causticTex.wrapS = this.causticTex.wrapT = THREE.RepeatWrapping;
    this.causticTex.repeat.set(12, 12);

    const cGeo = new THREE.PlaneGeometry(24, 20);
    cGeo.rotateX(-Math.PI / 2);

    this.causticMat = new THREE.MeshBasicMaterial({
      map: this.causticTex,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.causticMesh = new THREE.Mesh(cGeo, this.causticMat);
    this.causticMesh.name = 'causticas_rio';
    this.causticMesh.position.y = this.waterLevel - 0.02;
    this.scene.add(this.causticMesh);
  }

  renderNormalMap(time) {
    const s = this.normalSize;
    const img = this.normalCtx.createImageData(s, s);
    const d = img.data;

    // Duas camadas de ondas cruzadas fluindo suavemente downstream
    const t1 = time * 0.9;
    const t2 = time * 0.6;

    for (let y = 0; y < s; y++) {
      const ny = (y / s) * Math.PI * 8;
      for (let x = 0; x < s; x++) {
        const nx = (x / s) * Math.PI * 8;

        const w1 = Math.sin(nx + t1 + Math.sin(ny * 0.5));
        const w2 = Math.cos(ny * 1.2 + t2 + Math.cos(nx * 0.6));
        const w3 = Math.sin((nx + ny) * 1.5 - t1 * 0.8) * 0.5;

        const sum = (w1 + w2 + w3) / 2.5;

        // Perturbação adicional se houver ondulações pontuais (splash de pedras)
        let rippleAdd = 0;
        for (const r of this.ripples) {
          const age = time - r.startTime;
          if (age > 0 && age < 3.5) {
            const currentRadius = age * 0.9;
            const dist = Math.hypot((x / s) * 2 - 1 - r.normX, (y / s) * 2 - 1 - r.normY);
            const delta = Math.abs(dist - currentRadius * 0.4);
            if (delta < 0.12) {
              const fade = (1 - age / 3.5) * (1 - delta / 0.12);
              rippleAdd += Math.sin(delta * 40 - age * 12) * fade * 0.8;
            }
          }
        }

        const totalH = sum + rippleAdd;
        const normX = Math.floor((Math.sin(totalH * Math.PI) * 0.5 + 0.5) * 255);
        const normY = Math.floor((Math.cos(totalH * Math.PI) * 0.5 + 0.5) * 255);

        const idx = (y * s + x) * 4;
        d[idx] = normX;
        d[idx + 1] = normY;
        d[idx + 2] = 230;
        d[idx + 3] = 255;
      }
    }

    this.normalCtx.putImageData(img, 0, 0);
    this.normalTex.needsUpdate = true;
  }

  renderCaustics(time) {
    const s = this.causticSize;
    const img = this.causticCtx.createImageData(s, s);
    const d = img.data;
    const t = time * 0.8;

    for (let y = 0; y < s; y++) {
      const ny = (y / s) * 10;
      for (let x = 0; x < s; x++) {
        const nx = (x / s) * 10;

        // Padrão de redes cáusticas luminosas (interseção de ondas harmônicas)
        const c1 = Math.sin(nx + Math.cos(ny * 1.3 + t));
        const c2 = Math.cos(ny + Math.sin(nx * 1.3 - t));
        const c3 = Math.sin((nx - ny) * 0.7 + t * 1.1);

        const v = Math.pow(Math.abs(c1 * c2 + c3 * 0.5), 2.2);
        const bright = Math.min(255, Math.floor(v * 210));

        const idx = (y * s + x) * 4;
        d[idx] = Math.floor(bright * 0.9);
        d[idx + 1] = Math.floor(bright * 1.0);
        d[idx + 2] = Math.floor(bright * 0.95);
        d[idx + 3] = bright;
      }
    }

    this.causticCtx.putImageData(img, 0, 0);
    this.causticTex.needsUpdate = true;
  }

  /**
   * Adiciona ondulação circular decorrente da queda de uma pedra na água.
   */
  addSplashRipple(worldX, worldZ) {
    const normX = (worldX / 6.0);
    const normY = (worldZ / 5.0);
    this.ripples.push({
      startTime: this.time,
      normX,
      normY,
    });

    // Limpar ondulações expiradas
    if (this.ripples.length > 8) {
      this.ripples.shift();
    }
  }

  setColor(hexColor) {
    if (this.material) this.material.color.set(hexColor);
  }

  update(delta) {
    this.time += delta;

    // Ciclo de respiração: 0 a 1 (4s inspira, 2s pausa, 4s expira)
    const cycleTime = (this.time % this.breathCycle) / this.breathCycle;
    let breathIntensity = 0.5;
    if (cycleTime < 0.4) {
      // Inspirar (0.0 -> 0.4)
      breathIntensity = Math.sin((cycleTime / 0.4) * Math.PI * 0.5);
    } else if (cycleTime < 0.6) {
      // Pausa plena (0.4 -> 0.6)
      breathIntensity = 1.0;
    } else {
      // Expirar (0.6 -> 1.0)
      breathIntensity = Math.cos(((cycleTime - 0.6) / 0.4) * Math.PI * 0.5);
    }

    // A correnteza acompanha suavemente a respiração
    const currentSpeed = 0.8 + breathIntensity * 0.4;
    this.normalTex.offset.x = (this.time * 0.04 * currentSpeed) % 1;
    this.normalTex.offset.y = (this.time * 0.025 * currentSpeed) % 1;

    this.causticTex.offset.x = (this.time * 0.02) % 1;
    this.causticTex.offset.y = (this.time * 0.015) % 1;

    // Atualizar mapa de normais a cada ~4 quadros para alta performance
    if (Math.floor(this.time * 24) % 3 === 0) {
      this.renderNormalMap(this.time * currentSpeed);
      this.renderCaustics(this.time);
    }

    return {
      breathIntensity,
      breathPhase: cycleTime < 0.4 ? 'inspirar' : cycleTime < 0.6 ? 'pausa' : 'expirar',
    };
  }
}
