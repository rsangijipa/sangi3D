/**
 * Meteorologia das Emocoes — ceu, camadas de nuvens e particulas de chuva/vento.
 * Chuva fica do lado de fora do vidro. Sem raios nem trovoes.
 */

import * as THREE from 'three';
import { PALETTE, materials } from './objects.js';

export class Sky {
  scene: THREE.Scene;
  dome: THREE.Mesh;
  clouds: THREE.Group;
  rain: THREE.Points | null = null;
  rainGeo: THREE.BufferGeometry | null = null;

  private cloudMeshes: THREE.Mesh[] = [];
  private maxDrops: number;
  private windInfluence = 0;

  constructor(scene: THREE.Scene, maxDrops = 300) {
    this.scene = scene;
    this.maxDrops = maxDrops;
    this.dome = this.buildSkyDome();
    this.clouds = this.buildClouds();
    scene.add(this.dome);
    scene.add(this.clouds);
  }

  private buildSkyDome(): THREE.Mesh {
    // Ceo dividido: lado da chuva (escuro, tempestade) e lado do por do sol (quente).
    const geo = new THREE.SphereGeometry(14, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    // inverte faces para ficar visivel do lado de dentro
    geo.scale(-1, 1, 1);

    const vertexColors = new Float32Array(geo.attributes.position.count * 3);
    const pos = geo.attributes.position;
    const storm = new THREE.Color(PALETTE.skyStorm);
    const sunset = new THREE.Color(0xff8c42);
    const horizon = new THREE.Color(0xf2e4cc);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // lado esquerdo = chuva, lado direito = sol; altura influencia mistura com o horizonte
      const side = x < 0 ? 1 : 0;
      const h = Math.max(0, y / 7);
      const c = side === 0
        ? new THREE.Color().lerpColors(sunset, horizon, h)
        : new THREE.Color().lerpColors(storm, horizon, h);
      vertexColors[i * 3] = c.r;
      vertexColors[i * 3 + 1] = c.g;
      vertexColors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));

    const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
    const dome = new THREE.Mesh(geo, mat);
    dome.name = 'sky_dome';
    dome.renderOrder = 0;
    return dome;
  }

  private buildClouds(): THREE.Group {
    const g = new THREE.Group();
    g.name = 'cloud_layers';
    const positions: [number, number, number, number][] = [
      [-4, 2.2, -2, 1.2],
      [-1.5, 2.6, -2.2, 1.0],
      [1.5, 2.0, -1.8, 0.9],
      [4, 2.4, -2, 1.1],
      [-2.5, 1.6, -1, 0.8],
      [2.5, 1.9, -1, 0.7],
    ];
    positions.forEach(([x, y, s], i) => {
      const cloud = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.5 * s, 16, 12),
          materials.cloud
        );
        puff.position.set((j - 2) * 0.55 * s, (Math.sin(j) * 0.2) * s, 0);
        cloud.add(puff);
      }
      cloud.position.set(x, y, 0);
      cloud.name = `cloud_${i}`;
      g.add(cloud);
      this.cloudMeshes.push(cloud as unknown as THREE.Mesh);
    });
    return g;
  }

  setCloudOpacity(value: number): void {
    const v = Math.min(1, Math.max(0, value / 4));
    this.clouds.traverse((c) => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshStandardMaterial) {
        c.material.opacity = 0.35 + 0.5 * v;
      }
    });
  }

  buildRain(): void {
    if (this.rain) {
      this.scene.remove(this.rain);
      this.rain = null;
      this.rainGeo = null;
    }
    const count = this.maxDrops;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 9;
      positions[i * 3 + 2] = -6 - Math.random() * 2; // fora do vidro (lado de fora)
      speeds[i] = 0.015 + Math.random() * 0.025;
    }
    this.rainGeo = new THREE.BufferGeometry();
    this.rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.rainGeo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    const mat = new THREE.PointsMaterial({
      color: 0xa8c4d4,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    this.rain = new THREE.Points(this.rainGeo, mat);
    this.rain.name = 'rain_particles';
    this.rain.frustumCulled = false;
    this.scene.add(this.rain);
    this.rain.visible = false;
  }

  setRainIntensity(value: number): void {
    const v = Math.min(1, Math.max(0, value / 4));
    if (!this.rain) return;
    this.rain.visible = v > 0.02;
    (this.rain.material as THREE.PointsMaterial).opacity = 0.2 + 0.5 * v;
    (this.rain.material as THREE.PointsMaterial).size = 0.03 + 0.05 * v;
  }

  setWindInfluence(wind: number): void {
    this.windInfluence = wind / 4;
  }

  update(dt: number): void {
    if (!this.rain || !this.rainGeo) return;
    const positions = this.rainGeo.attributes.position as THREE.BufferAttribute;
    const speeds = this.rainGeo.attributes.speed as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i++) {
      let y = positions.getY(i);
      const speed = speeds.getX(i);
      y -= speed * dt * 30 * (0.6 + this.windInfluence * 0.6);
      let x = positions.getX(i);
      x += this.windInfluence * 0.002 * dt * 30;
      if (y < -1) {
        y = 9;
        x = (Math.random() - 0.5) * 14;
      }
      positions.setY(i, y);
      positions.setX(i, x);
    }
    positions.needsUpdate = true;
  }

  dispose(): void {
    this.scene.remove(this.dome);
    this.scene.remove(this.clouds);
    if (this.rain) this.scene.remove(this.rain);
    this.dome.geometry.dispose();
    this.clouds.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        (c.material as THREE.Material).dispose();
      }
    });
  }
}
