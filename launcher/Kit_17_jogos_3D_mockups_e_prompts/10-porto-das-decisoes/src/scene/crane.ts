/**
 * Porto das Decisões — Guindaste Amarelo Articulado em Diorama
 * Estrutura amarela industrial com pórtico giratório, lança em treliça,
 * contrapeso, cabos de aço, gancho e caixa de madeira suspensa em balanço
 */

import * as THREE from 'three';

export class HarborCrane {
  public group: THREE.Group;
  private rotatingUpper: THREE.Group;
  private hookGroup: THREE.Group;
  private suspendedCrate: THREE.Mesh;
  private cableLine: THREE.Line;
  private cableGeo: THREE.BufferGeometry;
  private currentYaw: number = -0.65;
  private targetYaw: number = -0.65;
  private isAnimating: boolean = false;
  private animStartTime: number = 0;
  private animDuration: number = 1.2;
  private startYaw: number = -0.65;

  constructor(x: number = -1.65, y: number = 1.05, z: number = -0.4) {
    this.group = new THREE.Group();
    this.group.position.set(x, y, z);

    const yellowMat = new THREE.MeshStandardMaterial({
      color: '#E5A015', // Amarelo industrial quente do mockup
      roughness: 0.42,
      metalness: 0.25
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: '#262626',
      roughness: 0.55,
      metalness: 0.75
    });

    const crateWoodMat = new THREE.MeshStandardMaterial({
      color: '#C68D51', // Madeira de caixa artesanal
      roughness: 0.65,
      metalness: 0.02
    });

    // 1. BASE FIXA DO PÓRTICO (Plataforma circular no piso do cais)
    const basePillarGeo = new THREE.CylinderGeometry(0.48, 0.58, 0.25, 20);
    const basePillar = new THREE.Mesh(basePillarGeo, darkMetalMat);
    basePillar.position.y = 0.125;
    basePillar.castShadow = true;
    basePillar.receiveShadow = true;
    this.group.add(basePillar);

    const ringTurntableGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20);
    const ringTurntable = new THREE.Mesh(ringTurntableGeo, yellowMat);
    ringTurntable.position.y = 0.28;
    ringTurntable.castShadow = true;
    this.group.add(ringTurntable);

    // 2. PARTE SUPERIOR GIRATÓRIA (Cabine, lança inclinada e contrapeso)
    this.rotatingUpper = new THREE.Group();
    this.rotatingUpper.position.y = 0.32;
    this.group.add(this.rotatingUpper);

    // Cabine do operador amarela
    const cabinGeo = new THREE.BoxGeometry(0.68, 0.72, 0.56);
    const cabin = new THREE.Mesh(cabinGeo, yellowMat);
    cabin.position.set(-0.1, 0.42, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    this.rotatingUpper.add(cabin);

    // Janela panorâmica frontal da cabine
    const winGeo = new THREE.BoxGeometry(0.04, 0.32, 0.38);
    const winMat = new THREE.MeshStandardMaterial({ color: '#7EBBCB', roughness: 0.15, metalness: 0.3 });
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(0.25, 0.5, 0);
    this.rotatingUpper.add(win);

    // Contrapeso traseiro de ferro fundido escuro
    const counterGeo = new THREE.BoxGeometry(0.48, 0.38, 0.48);
    const counter = new THREE.Mesh(counterGeo, darkMetalMat);
    counter.position.set(-0.52, 0.34, 0);
    counter.castShadow = true;
    this.rotatingUpper.add(counter);

    // Torrete / cavalete da lança
    const towerGeo = new THREE.BoxGeometry(0.12, 0.65, 0.42);
    const tower = new THREE.Mesh(towerGeo, yellowMat);
    tower.position.set(0.05, 0.9, 0);
    tower.castShadow = true;
    this.rotatingUpper.add(tower);

    // LANÇA ARTICULADA EM TRELIÇA (Angulada para cima e para fora sobre a água)
    const boomArm = new THREE.Group();
    boomArm.position.set(0.12, 0.65, 0);
    // Inclinada para cima a ~38° em relação ao plano horizontal
    boomArm.rotation.z = Math.PI * 0.20; 
    this.rotatingUpper.add(boomArm);

    // Hastes principais da lança
    const armLen = 2.4;
    const chordMat = yellowMat;
    
    // Duas longarinas paralelas
    [-0.1, 0.1].forEach(sideZ => {
      const chordGeo = new THREE.BoxGeometry(armLen, 0.05, 0.04);
      const chord = new THREE.Mesh(chordGeo, chordMat);
      chord.position.set(armLen / 2, 0, sideZ);
      chord.castShadow = true;
      boomArm.add(chord);

      const topChordGeo = new THREE.BoxGeometry(armLen * 0.9, 0.04, 0.04);
      const topChord = new THREE.Mesh(topChordGeo, chordMat);
      topChord.position.set(armLen * 0.45, 0.2, sideZ);
      topChord.castShadow = true;
      boomArm.add(topChord);
    });

    // Travessas treliçadas diagonais
    for (let i = 1; i <= 4; i++) {
      const braceGeo = new THREE.BoxGeometry(0.03, 0.22, 0.03);
      const brace = new THREE.Mesh(braceGeo, chordMat);
      brace.position.set(i * 0.45, 0.1, 0);
      brace.rotation.z = (i % 2 === 0 ? 0.4 : -0.4);
      boomArm.add(brace);
    }

    // Polia na extremidade da lança
    const pulleyGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
    pulleyGeo.rotateX(Math.PI / 2);
    const pulley = new THREE.Mesh(pulleyGeo, darkMetalMat);
    pulley.position.set(armLen, 0, 0);
    boomArm.add(pulley);

    // 3. CABO DE AÇO, GANCHO E CAIXA SUSPENSA
    // Posição calculada da ponta da lança no referencial do rotatingUpper:
    // x = 0.12 + armLen * cos(0.20 * PI) ≈ 0.12 + 2.4 * 0.809 = 2.06
    // y = 0.65 + armLen * sin(0.20 * PI) ≈ 0.65 + 2.4 * 0.588 = 2.06
    const tipX = 0.12 + armLen * Math.cos(Math.PI * 0.20);
    const tipY = 0.65 + armLen * Math.sin(Math.PI * 0.20);

    // Grupo do gancho e carga suspensa
    this.hookGroup = new THREE.Group();
    this.hookGroup.position.set(tipX, 0.95, 0); // Altura da caixa suspensa acima da água
    this.rotatingUpper.add(this.hookGroup);

    // Cabo de aço que desce da ponta até o gancho
    const cablePoints = [
      new THREE.Vector3(tipX, tipY, 0),
      new THREE.Vector3(tipX, 0.95, 0)
    ];
    this.cableGeo = new THREE.BufferGeometry().setFromPoints(cablePoints);
    const cableMat = new THREE.LineBasicMaterial({ color: '#1F2937', linewidth: 2 });
    this.cableLine = new THREE.Line(this.cableGeo, cableMat);
    this.rotatingUpper.add(this.cableLine);

    // Gancho de aço
    const hookGeo = new THREE.TorusGeometry(0.07, 0.022, 8, 16, Math.PI * 1.35);
    const hookMesh = new THREE.Mesh(hookGeo, darkMetalMat);
    hookMesh.rotation.y = Math.PI / 2;
    this.hookGroup.add(hookMesh);

    // Caixa de madeira suspensa no ar
    const crateGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    this.suspendedCrate = new THREE.Mesh(crateGeo, crateWoodMat);
    this.suspendedCrate.position.y = -0.28;
    this.suspendedCrate.castShadow = true;
    this.suspendedCrate.receiveShadow = true;
    this.hookGroup.add(this.suspendedCrate);

    // Cabos diagonais conectando o gancho aos 4 cantos da caixa
    const tiesGeo = new THREE.ConeGeometry(0.22, 0.24, 4);
    tiesGeo.rotateY(Math.PI / 4);
    const tiesMat = new THREE.MeshBasicMaterial({ color: '#27272A', wireframe: true });
    const ties = new THREE.Mesh(tiesGeo, tiesMat);
    ties.position.y = -0.12;
    this.hookGroup.add(ties);

    // Rotação inicial apontando em direção à bacia central
    this.rotatingUpper.rotation.y = this.currentYaw;
  }

  public rotateTo(yaw: number, durationSec: number = 1.2): void {
    this.startYaw = this.currentYaw;
    this.targetYaw = yaw;
    this.animDuration = durationSec;
    this.animStartTime = performance.now();
    this.isAnimating = true;
  }

  public triggerLoadAnimation(): void {
    // Anima o guindaste girando para o cais, recolhendo e levando ao barco
    this.rotateTo(-1.1, 0.8);
    setTimeout(() => {
      this.rotateTo(-0.4, 0.9);
    }, 700);
  }

  public update(time: number): void {
    if (this.isAnimating) {
      const elapsed = (performance.now() - this.animStartTime) / 1000;
      const progress = Math.min(1.0, elapsed / this.animDuration);
      // Smoothstep easing
      const t = progress * progress * (3 - 2 * progress);
      this.currentYaw = this.startYaw + (this.targetYaw - this.startYaw) * t;
      this.rotatingUpper.rotation.y = this.currentYaw;

      if (progress >= 1.0) {
        this.isAnimating = false;
      }
    } else {
      // Pequeno balanço natural de pêndulo na caixa com o vento marítimo
      const sway = Math.sin(time * 1.5) * 0.035;
      this.hookGroup.rotation.z = sway;
      this.suspendedCrate.rotation.y = Math.sin(time * 0.7) * 0.05;
    }
  }

  public setCrateVisible(visible: boolean): void {
    this.suspendedCrate.visible = visible;
  }

  public dispose(): void {
    this.cableGeo.dispose();
  }
}
