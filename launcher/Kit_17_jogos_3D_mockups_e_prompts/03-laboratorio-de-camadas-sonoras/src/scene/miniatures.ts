/**
 * Laboratório de Camadas Sonoras — Miniaturas Físicas Dentro das Redomas
 * 1. Balão de fala, 2. Tênis verde com cadarço, 3. Ventilador com pás móveis,
 * 4. Cidade em miniatura com poste de luz âmbar, 5. Nota musical em madeira
 */

import * as THREE from 'three';
import { CHANNELS_CATALOG } from '../game/content';

export class MiniaturesManager {
  public group: THREE.Group;
  private fanRotor: THREE.Group | null = null;
  private shoeMesh: THREE.Group | null = null;
  private streetLampLight: THREE.PointLight | null = null;
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildMiniatures();
  }

  private registerMaterial<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private registerGeometry<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private buildMiniatures(): void {
    const spacing = 0.86;
    const startX = -2 * spacing;
    const baseY = 0.28;
    const baseZ = -0.55;

    CHANNELS_CATALOG.forEach((channel, idx) => {
      const posX = startX + idx * spacing;
      const minGroup = new THREE.Group();
      minGroup.position.set(posX, baseY + 0.12, baseZ);

      switch (channel.id) {
        case 'speech':
          this.buildSpeechMiniature(minGroup);
          break;
        case 'footsteps':
          this.buildShoeMiniature(minGroup);
          break;
        case 'fan':
          this.buildFanMiniature(minGroup);
          break;
        case 'city':
          this.buildCityMiniature(minGroup);
          break;
        case 'music':
          this.buildMusicNoteMiniature(minGroup);
          break;
      }

      this.group.add(minGroup);
    });
  }

  /**
   * 1. Balão de fala (Speech Bubble) com três pontos
   */
  private buildSpeechMiniature(parent: THREE.Group): void {
    const bubbleMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#FAF5EE', // Creme papel artesanal
        roughness: 0.45
      })
    );
    const dotMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#A08060', roughness: 0.6 })
    );

    // Corpo oval do balão
    const bodyGeo = this.registerGeometry(new THREE.BoxGeometry(0.36, 0.26, 0.12));
    const body = new THREE.Mesh(bodyGeo, bubbleMat);
    body.position.y = 0.28;
    body.castShadow = true;
    parent.add(body);

    // Ponta do balão (tail)
    const tailGeo = this.registerGeometry(new THREE.ConeGeometry(0.08, 0.14, 3));
    tailGeo.rotateZ(Math.PI * 0.7);
    const tail = new THREE.Mesh(tailGeo, bubbleMat);
    tail.position.set(-0.14, 0.12, 0);
    parent.add(tail);

    // 3 pontos debossados
    for (let i = -1; i <= 1; i++) {
      const dotGeo = this.registerGeometry(new THREE.SphereGeometry(0.022, 10, 10));
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(i * 0.08, 0.28, 0.065);
      parent.add(dot);
    }
  }

  /**
   * 2. Tênis verde oliva esportivo com sola e cadarços brancos (Shoe Model do mockup!)
   */
  private buildShoeMiniature(parent: THREE.Group): void {
    this.shoeMesh = new THREE.Group();
    this.shoeMesh.position.y = 0.26;
    this.shoeMesh.rotation.y = -Math.PI * 0.15; // Levemente inclinado como no mockup

    const greenCanvasMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#3B6846', // Verde oliva clássico do tênis
        roughness: 0.8
      })
    );
    const whiteRubberMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#FAF5EE',
        roughness: 0.4
      })
    );
    const laceMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.6 })
    );

    // Sola de borracha branca
    const soleGeo = this.registerGeometry(new THREE.BoxGeometry(0.44, 0.06, 0.18));
    const sole = new THREE.Mesh(soleGeo, whiteRubberMat);
    sole.position.set(0, 0, 0);
    sole.castShadow = true;
    this.shoeMesh.add(sole);

    // Biqueira de borracha (toe cap)
    const toeCapGeo = this.registerGeometry(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12));
    toeCapGeo.rotateZ(Math.PI / 2);
    const toeCap = new THREE.Mesh(toeCapGeo, whiteRubberMat);
    toeCap.position.set(0.16, 0.04, 0);
    this.shoeMesh.add(toeCap);

    // Corpo de lona verde
    const upperGeo = this.registerGeometry(new THREE.BoxGeometry(0.32, 0.16, 0.16));
    const upper = new THREE.Mesh(upperGeo, greenCanvasMat);
    upper.position.set(-0.04, 0.09, 0);
    upper.castShadow = true;
    this.shoeMesh.add(upper);

    // Cano alto / calcanhar
    const heelGeo = this.registerGeometry(new THREE.BoxGeometry(0.16, 0.18, 0.15));
    const heel = new THREE.Mesh(heelGeo, greenCanvasMat);
    heel.position.set(-0.12, 0.15, 0);
    this.shoeMesh.add(heel);

    // Cadarços brancos horizontais
    for (let l = 0; l < 4; l++) {
      const laceGeo = this.registerGeometry(new THREE.BoxGeometry(0.02, 0.015, 0.11));
      const lace = new THREE.Mesh(laceGeo, laceMat);
      lace.position.set(-0.06 + l * 0.05, 0.18 + l * 0.02, 0);
      this.shoeMesh.add(lace);
    }

    parent.add(this.shoeMesh);
  }

  /**
   * 3. Ventilador de mesa com 4 pás rotativas (Fan Model)
   */
  private buildFanMiniature(parent: THREE.Group): void {
    const standMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#5B7C6E', roughness: 0.6 }) // Base verde sage
    );
    const bladeMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#E8D5B5', roughness: 0.4 }) // Pás creme
    );

    // Base circular
    const baseGeo = this.registerGeometry(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 16));
    const base = new THREE.Mesh(baseGeo, standMat);
    base.position.y = 0.02;
    parent.add(base);

    // Haste de suporte
    const poleGeo = this.registerGeometry(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8));
    const pole = new THREE.Mesh(poleGeo, standMat);
    pole.position.set(0, 0.14, 0);
    parent.add(pole);

    // Carcaça do motor
    const motorGeo = this.registerGeometry(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12));
    motorGeo.rotateX(Math.PI / 2);
    const motor = new THREE.Mesh(motorGeo, standMat);
    motor.position.set(0, 0.26, 0);
    parent.add(motor);

    // Grade / anel protetor externo
    const cageGeo = this.registerGeometry(new THREE.TorusGeometry(0.18, 0.015, 8, 24));
    const cage = new THREE.Mesh(cageGeo, standMat);
    cage.position.set(0, 0.26, 0.04);
    parent.add(cage);

    // Rotor giratório com 4 pás
    this.fanRotor = new THREE.Group();
    this.fanRotor.position.set(0, 0.26, 0.05);

    for (let b = 0; b < 4; b++) {
      const bGeo = this.registerGeometry(new THREE.BoxGeometry(0.06, 0.15, 0.01));
      const blade = new THREE.Mesh(bGeo, bladeMat);
      blade.position.y = 0.08;
      blade.rotation.z = b * (Math.PI / 2);
      this.fanRotor.add(blade);
    }
    parent.add(this.fanRotor);
  }

  /**
   * 4. Cidade em miniatura com prédios, rua e poste de luz âmbar funcional (City Model)
   */
  private buildCityMiniature(parent: THREE.Group): void {
    const buildingMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#D4B892', roughness: 0.7 }) // Tijolo/concreto quente
    );
    const roadMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#3A3A3A', roughness: 0.85 }) // Asfalto
    );
    const windowMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#2B3B48', roughness: 0.3 })
    );

    // Base de rua asfáltica curva com marcações
    const roadGeo = this.registerGeometry(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 16));
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.position.y = 0.02;
    parent.add(road);

    // Edifício 1 (mais alto, à esquerda)
    const b1Geo = this.registerGeometry(new THREE.BoxGeometry(0.15, 0.35, 0.15));
    const b1 = new THREE.Mesh(b1Geo, buildingMat);
    b1.position.set(-0.08, 0.2, -0.05);
    b1.castShadow = true;
    parent.add(b1);

    // Janelas do edifício 1
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const winGeo = this.registerGeometry(new THREE.BoxGeometry(0.03, 0.04, 0.01));
        const win = new THREE.Mesh(winGeo, windowMat);
        win.position.set(-0.11 + c * 0.06, 0.12 + r * 0.08, 0.03);
        parent.add(win);
      }
    }

    // Edifício 2 (menor, à direita)
    const b2Geo = this.registerGeometry(new THREE.BoxGeometry(0.12, 0.24, 0.14));
    const b2 = new THREE.Mesh(b2Geo, buildingMat);
    b2.position.set(0.08, 0.14, -0.06);
    b2.castShadow = true;
    parent.add(b2);

    // Mini poste de luz vintage com lanterna âmbar acesa (como no mockup!)
    const lampPostGeo = this.registerGeometry(new THREE.CylinderGeometry(0.01, 0.015, 0.22, 6));
    const lampMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.5, metalness: 0.6 })
    );
    const lampPost = new THREE.Mesh(lampPostGeo, lampMat);
    lampPost.position.set(0.05, 0.13, 0.1);
    parent.add(lampPost);

    const lanternGlowMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#FFDF9E',
        emissive: '#FFB84D',
        emissiveIntensity: 1.2,
        roughness: 0.2
      })
    );
    const lanternGeo = this.registerGeometry(new THREE.SphereGeometry(0.025, 8, 8));
    const lantern = new THREE.Mesh(lanternGeo, lanternGlowMat);
    lantern.position.set(0.05, 0.24, 0.1);
    parent.add(lantern);

    // Luz pontual âmbar suave
    this.streetLampLight = new THREE.PointLight('#FFDF9E', 0.6, 1.2);
    this.streetLampLight.position.set(0.05, 0.24, 0.1);
    parent.add(this.streetLampLight);
  }

  /**
   * 5. Nota musical em madeira esculpida (Music Note)
   */
  private buildMusicNoteMiniature(parent: THREE.Group): void {
    const noteWoodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#EAD9C0', // Madeira clara artesanal
        roughness: 0.5,
        metalness: 0.02
      })
    );

    // Par de colcheias ligadas (quaver pair)
    const noteGroup = new THREE.Group();
    noteGroup.position.set(-0.06, 0.14, 0);

    // Cabeça da nota 1
    const head1Geo = this.registerGeometry(new THREE.SphereGeometry(0.05, 12, 12));
    head1Geo.scale(1.2, 0.8, 0.8);
    head1Geo.rotateZ(0.3);
    const head1 = new THREE.Mesh(head1Geo, noteWoodMat);
    head1.position.set(0, 0, 0);
    head1.castShadow = true;
    noteGroup.add(head1);

    // Haste 1
    const stem1Geo = this.registerGeometry(new THREE.CylinderGeometry(0.012, 0.012, 0.24));
    const stem1 = new THREE.Mesh(stem1Geo, noteWoodMat);
    stem1.position.set(0.05, 0.12, 0);
    noteGroup.add(stem1);

    // Cabeça da nota 2
    const head2 = new THREE.Mesh(head1Geo, noteWoodMat);
    head2.position.set(0.14, 0.04, 0);
    head2.castShadow = true;
    noteGroup.add(head2);

    // Haste 2
    const stem2 = new THREE.Mesh(stem1Geo, noteWoodMat);
    stem2.position.set(0.19, 0.16, 0);
    noteGroup.add(stem2);

    // Barra de ligação superior (beam)
    const beamGeo = this.registerGeometry(new THREE.BoxGeometry(0.18, 0.035, 0.024));
    beamGeo.rotateZ(0.25);
    const beam = new THREE.Mesh(beamGeo, noteWoodMat);
    beam.position.set(0.12, 0.26, 0);
    noteGroup.add(beam);

    parent.add(noteGroup);
  }

  /**
   * Atualização contínua de animações das miniaturas (rotação de ventilador e flutuação suave do tênis)
   */
  public update(time: number, fanGain: number, reducedMotion: boolean): void {
    // 1. Rotação das pás do ventilador se houver volume no canal de vento
    if (this.fanRotor) {
      if (!reducedMotion && fanGain > 0.01) {
        this.fanRotor.rotation.z += fanGain * 0.45;
      }
    }

    // 2. Flutuação suave do tênis verde
    if (this.shoeMesh && !reducedMotion) {
      const bob = Math.sin(time * 2.2) * 0.02;
      this.shoeMesh.position.y = 0.26 + bob;
    }
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
