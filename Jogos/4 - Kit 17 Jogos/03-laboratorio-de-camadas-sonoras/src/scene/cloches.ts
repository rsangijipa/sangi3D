/**
 * Laboratório de Camadas Sonoras — Redomas de Vidro e Bases de Madeira
 * 5 redomas artesanais (dome_glass) sobre bases torneadas com anéis emissores de feedback
 */

import * as THREE from 'three';
import { ChannelId } from '../game/state';
import { CHANNELS_CATALOG } from '../game/content';

export class ClochesManager {
  public group: THREE.Group;
  public cloches: Map<ChannelId, {
    baseGroup: THREE.Group;
    glassMesh: THREE.Mesh;
    glowRing: THREE.Mesh;
    collider: THREE.Mesh;
  }> = new Map();

  public clickColliders: THREE.Mesh[] = [];
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildFiveCloches();
  }

  private registerMaterial<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private registerGeometry<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private buildFiveCloches(): void {
    const woodBaseMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#A26838', // Carvalho mel artesanal torneado
        roughness: 0.65,
        metalness: 0.05
      })
    );

    // Material de vidro artesanal de redoma com transmissão e refração física (TSL/Physical)
    const glassMat = this.registerMaterial(
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        transmission: 0.94,
        opacity: 1.0,
        transparent: true,
        roughness: 0.08,
        ior: 1.52,
        thickness: 0.45,
        specularIntensity: 1.0,
        specularColor: new THREE.Color('#FFFFFF')
      })
    );

    // Espaçamento horizontal dos 5 canais (alinhados com os faders da bancada)
    const spacing = 0.86;
    const startX = -2 * spacing;
    const baseY = 0.28;
    const baseZ = -0.55;

    CHANNELS_CATALOG.forEach((channel, idx) => {
      const clocheGroup = new THREE.Group();
      const posX = startX + idx * spacing;
      clocheGroup.position.set(posX, baseY, baseZ);

      // 1. Base torneada circular de madeira
      const baseGeo = this.registerGeometry(new THREE.CylinderGeometry(0.36, 0.40, 0.1, 32));
      const baseMesh = new THREE.Mesh(baseGeo, woodBaseMat);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      clocheGroup.add(baseMesh);

      const baseRimGeo = this.registerGeometry(new THREE.TorusGeometry(0.38, 0.03, 8, 32));
      baseRimGeo.rotateX(Math.PI / 2);
      const baseRim = new THREE.Mesh(baseRimGeo, woodBaseMat);
      baseRim.position.y = 0.04;
      clocheGroup.add(baseRim);

      // 2. Halo / Anel luminoso emissivo de feedback na base da redoma (como o brilho verde do tênis no mockup!)
      const glowMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: '#86EFAC',
          emissive: '#4ADE80',
          emissiveIntensity: idx === 1 ? 1.4 : 0.0, // Canal 1 (tênis) ativo inicialmente
          roughness: 0.3
        })
      );

      const glowRingGeo = this.registerGeometry(new THREE.TorusGeometry(0.34, 0.025, 8, 32));
      glowRingGeo.rotateX(Math.PI / 2);
      const glowRing = new THREE.Mesh(glowRingGeo, glowMat);
      glowRing.position.y = 0.06;
      clocheGroup.add(glowRing);

      // 3. Redoma de vidro (cilindro inferior com cúpula esférica no topo)
      const glassGroup = new THREE.Group();
      glassGroup.position.y = 0.05;

      // Cilindro do corpo
      const cylinderGeo = this.registerGeometry(new THREE.CylinderGeometry(0.32, 0.32, 0.65, 32, 1, true));
      const cylinder = new THREE.Mesh(cylinderGeo, glassMat);
      cylinder.position.y = 0.35;
      glassGroup.add(cylinder);

      // Cúpula superior
      const domeGeo = this.registerGeometry(new THREE.SphereGeometry(0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2));
      const dome = new THREE.Mesh(domeGeo, glassMat);
      dome.position.y = 0.675;
      glassGroup.add(dome);

      // Puxador/pomo de vidro no topo da redoma
      const knobGeo = this.registerGeometry(new THREE.SphereGeometry(0.04, 12, 12));
      const knob = new THREE.Mesh(knobGeo, glassMat);
      knob.position.y = 1.02;
      glassGroup.add(knob);

      clocheGroup.add(glassGroup);

      // 4. Colisor invisível para raycasting
      const colliderGeo = this.registerGeometry(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 12));
      const colliderMat = this.registerMaterial(new THREE.MeshBasicMaterial({ visible: false }));
      const collider = new THREE.Mesh(colliderGeo, colliderMat);
      collider.position.y = 0.55;
      collider.userData = { channelId: channel.id, type: 'cloche' };
      clocheGroup.add(collider);

      this.clickColliders.push(collider);
      this.cloches.set(channel.id, {
        baseGroup: clocheGroup,
        glassMesh: cylinder,
        glowRing,
        collider
      });

      this.group.add(clocheGroup);
    });
  }

  /**
   * Atualiza a emissão de luz de cada redoma com base no ganho efetivo (0.0 a 1.0)
   */
  public updateGlowLevels(gains: Record<ChannelId, number>, focusedChannelId: ChannelId): void {
    this.cloches.forEach((cloche, id) => {
      const gain = gains[id] ?? 0;
      const isFocused = id === focusedChannelId;
      const glowMat = cloche.glowRing.material as THREE.MeshStandardMaterial;

      // Intensidade baseada no volume efetivo mais destaque se estiver focado
      const baseIntensity = gain * 1.5;
      const focusBoost = isFocused ? 0.6 : 0.0;
      glowMat.emissiveIntensity = Math.min(2.5, baseIntensity + focusBoost);

      // Cor sutilmente mais intensa no canal focado
      if (isFocused) {
        glowMat.emissive.set('#4ADE80');
      } else {
        glowMat.emissive.set(gain > 0.05 ? '#68D391' : '#1A3626');
      }
    });
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
