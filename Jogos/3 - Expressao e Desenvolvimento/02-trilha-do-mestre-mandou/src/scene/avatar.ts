/**
 * Avatar Explorador Articulado e Controlador de Movimento
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';
import { getTerrainHeightAt } from './terrain.ts';

export type AvatarAnimState = 'idle' | 'walk' | 'jump' | 'interact';

export class TrailAvatar {
  public group: THREE.Group;
  public pos: THREE.Vector3;
  public vel: THREE.Vector3;
  public rotationY: number = 0;
  public animState: AvatarAnimState = 'idle';

  private walkCycle: number = 0;
  private animTimer: number = 0;
  private isGrounded: boolean = true;
  private targetDestination: THREE.Vector3 | null = null;

  // Membros articulados para animação procedural
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private torso: THREE.Group;
  private head: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'avatar_rigado';

    this.pos = new THREE.Vector3(0.0, 1.4, -2.0); // Começa na entrada da ponte em direção ao sino azul
    this.vel = new THREE.Vector3();
    this.group.position.copy(this.pos);

    // Materiais PBR estilizados do personagem
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5cfb3, roughness: 0.6 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: 0x81945b, roughness: 0.7 }); // verde sálvia
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xb9634b, roughness: 0.75 }); // terracota
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 }); // couro
    const packMat = new THREE.MeshStandardMaterial({ color: 0x9a704a, roughness: 0.8 });

    // 1. Tronco e Mochila
    this.torso = new THREE.Group();
    this.torso.position.y = 0.85;

    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.55, 12);
    const body = new THREE.Mesh(bodyGeo, clothesMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.torso.add(body);

    // Mochila nas costas
    const packGeo = new THREE.BoxGeometry(0.32, 0.42, 0.22);
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.05, -0.22);
    pack.castShadow = true;
    this.torso.add(pack);

    // Rolo de mapa/manta no topo da mochila
    const rollGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.36, 8);
    rollGeo.rotateZ(Math.PI / 2);
    const roll = new THREE.Mesh(rollGeo, hatMat);
    roll.position.set(0, 0.3, -0.22);
    this.torso.add(roll);

    this.group.add(this.torso);

    // 2. Cabeça e Chapéu/Gorro
    this.head = new THREE.Group();
    this.head.position.y = 1.32;

    const headGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Gorro/Boina de explorador
    const hatGeo = new THREE.ConeGeometry(0.25, 0.18, 16);
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 0.16, -0.04);
    hat.rotation.x = -0.15;
    this.head.add(hat);

    const brimGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.03, 16);
    const brim = new THREE.Mesh(brimGeo, hatMat);
    brim.position.y = 0.08;
    this.head.add(brim);

    this.group.add(this.head);

    // 3. Braços Articulados (ombro -> mão)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.42, 8);
    armGeo.translate(0, -0.2, 0);

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.32, 1.1, 0);
    const lArmMesh = new THREE.Mesh(armGeo, clothesMat);
    lArmMesh.castShadow = true;
    this.leftArm.add(lArmMesh);
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.32, 1.1, 0);
    const rArmMesh = new THREE.Mesh(armGeo, clothesMat);
    rArmMesh.castShadow = true;
    this.rightArm.add(rArmMesh);
    this.group.add(this.rightArm);

    // 4. Pernas Articuladas (quadril -> bota)
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.52, 8);
    legGeo.translate(0, -0.26, 0);

    const footGeo = new THREE.BoxGeometry(0.12, 0.1, 0.18);
    footGeo.translate(0, -0.52, 0.04);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.14, 0.6, 0);
    const lLegMesh = new THREE.Mesh(legGeo, clothesMat);
    const lFootMesh = new THREE.Mesh(footGeo, bootMat);
    lLegMesh.castShadow = true;
    lFootMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);
    this.leftLeg.add(lFootMesh);
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.14, 0.6, 0);
    const rLegMesh = new THREE.Mesh(legGeo, clothesMat);
    const rFootMesh = new THREE.Mesh(footGeo, bootMat);
    rLegMesh.castShadow = true;
    rFootMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);
    this.rightLeg.add(rFootMesh);
    this.group.add(this.rightLeg);
  }

  setDestination(x: number, z: number) {
    this.targetDestination = new THREE.Vector3(x, 0, z);
  }

  jump() {
    if (this.isGrounded) {
      this.vel.y = 6.2;
      this.isGrounded = false;
      this.animState = 'jump';
    }
  }

  interact() {
    this.animState = 'interact';
    this.animTimer = 0.5;
  }

  update(dt: number, inputForward: number = 0, inputStrafe: number = 0, onFootstep?: (isWood: boolean) => void) {
    // 1. Controle de Movimento por Navegação ou Teclado
    let moveX = 0;
    let moveZ = 0;

    if (this.targetDestination) {
      const dx = this.targetDestination.x - this.pos.x;
      const dz = this.targetDestination.z - this.pos.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.4) {
        moveX = dx / dist;
        moveZ = dz / dist;
      } else {
        this.targetDestination = null;
      }
    }

    if (Math.abs(inputForward) > 0.1 || Math.abs(inputStrafe) > 0.1) {
      this.targetDestination = null;
      moveX = inputStrafe;
      moveZ = -inputForward;
      const len = Math.hypot(moveX, moveZ);
      if (len > 0.01) {
        moveX /= len;
        moveZ /= len;
      }
    }

    const isMoving = Math.hypot(moveX, moveZ) > 0.1;
    const moveSpeed = 4.8; // metros por segundo

    if (isMoving) {
      this.pos.x += moveX * moveSpeed * dt;
      this.pos.z += moveZ * moveSpeed * dt;
      this.rotationY = Math.atan2(moveX, moveZ);
      if (this.isGrounded && this.animState !== 'interact') {
        this.animState = 'walk';
      }
    } else if (this.isGrounded && this.animState !== 'interact') {
      this.animState = 'idle';
    }

    // 2. Gravidade e Contato com o Chão / Pontes
    const terrainY = getTerrainHeightAt(this.pos.x, this.pos.z);

    // Checar se está sobre a ponte suspensa
    let surfaceY = terrainY;
    const bridgeMinZ = -6.0;
    const bridgeMaxZ = -1.5;
    if (this.pos.z >= bridgeMinZ && this.pos.z <= bridgeMaxZ && this.pos.x >= -0.8 && this.pos.x <= 11.0) {
      const t = (this.pos.x) / 10.5;
      if (t >= 0 && t <= 1.0) {
        const bridgeY = 1.4 + t * 1.5 + Math.sin(t * Math.PI) * 0.45;
        if (bridgeY > surfaceY) surfaceY = bridgeY;
      }
    }

    // Aplicação da gravidade
    if (!this.isGrounded) {
      this.vel.y -= 16.0 * dt;
      this.pos.y += this.vel.y * dt;

      if (this.pos.y <= surfaceY) {
        this.pos.y = surfaceY;
        this.vel.y = 0;
        this.isGrounded = true;
        this.animState = isMoving ? 'walk' : 'idle';
      }
    } else {
      // Segue o relevo com suavização
      this.pos.y = THREE.MathUtils.lerp(this.pos.y, surfaceY, Math.min(1.0, dt * 12.0));
    }

    // 3. Rotação Suave do Avatar
    this.group.position.copy(this.pos);
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, this.rotationY, Math.min(1.0, dt * 10.0));

    // 4. Animação Procedural dos Membros
    if (this.animState === 'walk') {
      this.walkCycle += dt * 9.5;
      const legAngle = Math.sin(this.walkCycle) * 0.65;
      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;
      this.leftArm.rotation.x = -legAngle * 0.8;
      this.rightArm.rotation.x = legAngle * 0.8;
      this.torso.position.y = 0.85 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.05;

      // Som de passos periódicos
      if (Math.sin(this.walkCycle) > 0.95 && onFootstep) {
        onFootstep(surfaceY > terrainY + 0.1);
      }
    } else if (this.animState === 'jump') {
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = -0.4;
      this.leftArm.rotation.x = 0.8;
      this.rightArm.rotation.x = 0.8;
    } else if (this.animState === 'interact') {
      this.animTimer -= dt;
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, -1.6, dt * 14.0);
      this.leftArm.rotation.x = 0;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      if (this.animTimer <= 0) {
        this.animState = 'idle';
      }
    } else {
      // Idle: respiração sutil
      const breath = Math.sin(performance.now() * 0.003) * 0.04;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = breath;
      this.rightArm.rotation.x = -breath;
      this.torso.position.y = 0.85 + breath * 0.3;
    }
  }
}
