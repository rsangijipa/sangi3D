/**
 * Porto das Decisões — Água Turquesa e Ondulação Hidrostática de Diorama
 * Superfície marítima procedural com reflexo suave e mapa de normais harmônicos
 */

import * as THREE from 'three';

export interface WaterOptions {
  size?: number;
  color?: string;
  depthColor?: string;
}

export class HarborWater {
  public mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private normalTexture: THREE.CanvasTexture;
  private material: THREE.MeshStandardMaterial;

  constructor(options: WaterOptions = {}) {
    const size = options.size || 70;
    const geometry = new THREE.PlaneGeometry(size, size, 64, 64);
    geometry.rotateX(-Math.PI / 2);

    // Mapa normal procedural harmônico via Canvas 2D
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 256;
    this.generateWaveNormalMap(0);

    this.normalTexture = new THREE.CanvasTexture(this.canvas);
    this.normalTexture.wrapS = THREE.RepeatWrapping;
    this.normalTexture.wrapT = THREE.RepeatWrapping;
    this.normalTexture.repeat.set(14, 14);

    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.color || '#238E9B'), // Turquesa rico e vibrante do mockup
      roughness: 0.16,
      metalness: 0.06,
      normalMap: this.normalTexture,
      normalScale: new THREE.Vector2(0.42, 0.42),
      transparent: true,
      opacity: 0.95
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.position.y = 0;
  }

  private generateWaveNormalMap(time: number): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const freq1 = 0.045;
    const freq2 = 0.09;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = Math.cos(x * freq1 + time * 1.5) * freq1 * 24.0 + Math.cos((x + y) * freq2 - time * 2.0) * freq2 * 10.0;
        const dy = Math.sin(y * freq1 + time * 1.2) * freq1 * 24.0 + Math.cos((x + y) * freq2 - time * 2.0) * freq2 * 10.0;

        const nx = Math.floor(Math.max(0, Math.min(255, 128 + dx * 22)));
        const ny = Math.floor(Math.max(0, Math.min(255, 128 + dy * 22)));
        const nz = 255;

        const idx = (y * width + x) * 4;
        data[idx] = nx;
        data[idx + 1] = ny;
        data[idx + 2] = nz;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Cálculo determinístico da ondulação para balanço suave de barcos e boias
   */
  public getWaterHeight(x: number, z: number, time: number): { y: number; pitch: number; roll: number } {
    const w1 = Math.sin(x * 0.75 + time * 1.5) * 0.035;
    const w2 = Math.cos(z * 0.65 + time * 1.1) * 0.03;
    const y = w1 + w2;

    const pitch = Math.sin(z * 0.85 + time * 1.4) * 0.025;
    const roll = Math.cos(x * 0.75 + time * 1.3) * 0.02;

    return { y, pitch, roll };
  }

  public update(time: number): void {
    this.normalTexture.offset.x = (time * 0.025) % 1;
    this.normalTexture.offset.y = (time * 0.018) % 1;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.normalTexture.dispose();
  }
}
