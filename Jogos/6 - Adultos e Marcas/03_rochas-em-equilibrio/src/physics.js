import * as THREE from 'three';

/**
 * Motor de física e análise de estabilidade das pedras.
 * Suporta Rapier3D (WASM) e solver cinemático de empilhamento com cálculo real de polígono de sustentação.
 */
export class RockPhysicsEngine {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.waterLevel = options.waterLevel ?? -0.05;
    this.onSplash = options.onSplash || (() => {});
    this.onClack = options.onClack || (() => {});
    this.onRecover = options.onRecover || (() => {});

    this.rapier = null;
    this.world = null;
    this.useRapier = false;
    this.rocks = [];
    this.baseRock = null;

    this.gravity = -9.81;
    this.initBalanceHelper();
  }

  async init(useWasm = true) {
    if (useWasm) {
      try {
        const RAPIER = await import('@dimforge/rapier3d-compat');
        if (RAPIER && RAPIER.init) {
          await RAPIER.init();
          this.rapier = RAPIER;
          const gravity = new RAPIER.Vector3(0, this.gravity, 0);
          this.world = new RAPIER.World(gravity);
          this.useRapier = true;
          console.info('[Física] Rapier 3D WASM ativo com colisores convexos');
        }
      } catch (err) {
        console.warn('[Física] Rapier indisponível ou desativado, usando solver cinemático inteligente:', err);
        this.useRapier = false;
      }
    }
  }

  initBalanceHelper() {
    this.balanceHelper = new THREE.Group();
    this.balanceHelper.name = 'indicador_equilibrio';
    this.balanceHelper.visible = false;

    // 1. Ponto de luz no centro de massa (esfera luminosa dourada)
    const cmGeo = new THREE.SphereGeometry(0.024, 16, 16);
    const cmMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    this.cmSphere = new THREE.Mesh(cmGeo, cmMat);
    this.balanceHelper.add(this.cmSphere);

    // 2. Linha de prumo vertical (vetor de gravidade)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.6, 0),
    ]);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xffd255,
      dashSize: 0.035,
      gapSize: 0.02,
      transparent: true,
      opacity: 0.9,
    });
    this.plumbLine = new THREE.Line(lineGeo, lineMat);
    this.plumbLine.computeLineDistances();
    this.balanceHelper.add(this.plumbLine);

    // 3. Anel de ponto de contato projetado
    const ringGeo = new THREE.RingGeometry(0.045, 0.065, 32);
    ringGeo.rotateX(-Math.PI / 2);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0x69db70,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
    });
    this.contactRing = new THREE.Mesh(ringGeo, this.ringMat);
    this.balanceHelper.add(this.contactRing);

    this.scene.add(this.balanceHelper);
  }

  setBaseRock(mesh) {
    this.baseRock = mesh;
    if (this.useRapier && this.world) {
      const pos = mesh.position;
      const bodyDesc = this.rapier.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z);
      const body = this.world.createRigidBody(bodyDesc);

      const colliderDesc = this.rapier.ColliderDesc.cylinder(0.27, 1.35)
        .setFriction(0.95)
        .setRestitution(0.04);
      this.world.createCollider(colliderDesc, body);
    }
  }

  registerRock(rockData) {
    const rock = {
      ...rockData,
      isHeld: false,
      isStacked: false,
      isFalling: false,
      fallTimer: 0,
      velocity: new THREE.Vector3(),
      angularVelocity: new THREE.Vector3(),
      body: null,
      collider: null,
    };

    if (this.useRapier && this.world) {
      const geo = rock.mesh.geometry;
      const positions = geo.attributes.position.array;
      const bodyDesc = this.rapier.RigidBodyDesc.dynamic()
        .setTranslation(rock.mesh.position.x, rock.mesh.position.y, rock.mesh.position.z)
        .setLinearDamping(0.8)
        .setAngularDamping(0.88);

      const body = this.world.createRigidBody(bodyDesc);
      body.sleep();

      const colliderDesc = this.rapier.ColliderDesc.convexHull(positions)
        .setFriction(0.95)
        .setRestitution(0.04);

      const collider = this.world.createCollider(colliderDesc, body);
      rock.body = body;
      rock.collider = collider;
    }

    this.rocks.push(rock);
    return rock;
  }

  /**
   * Avalia o ponto de equilíbrio de uma pedra suspensa.
   */
  evaluateBalance(heldRock, worldPos, worldRot) {
    const below = this.findSurfaceBelow(heldRock, worldPos);
    const cmLocal = heldRock.mesh.geometry.userData.centerOfMass || new THREE.Vector3(0, 0, 0);
    const cmWorld = cmLocal.clone().applyEuler(worldRot).add(worldPos);

    if (!below) {
      return {
        status: 'instavel',
        label: 'Aproxime da pilha',
        stabilityMargin: -1,
        contactPoint: new THREE.Vector3(worldPos.x, this.waterLevel, worldPos.z),
        centerOfMass: cmWorld,
        targetY: worldPos.y,
      };
    }

    const supportCenter = below.point;
    const supportRadius = below.radius;
    const hDist = Math.hypot(cmWorld.x - supportCenter.x, cmWorld.z - supportCenter.z);
    const margin = supportRadius > 0 ? (supportRadius - hDist) / supportRadius : -1;

    let status = 'estavel';
    let label = 'Estável';
    if (margin < -0.05) {
      status = 'instavel';
      label = 'Instável';
    } else if (margin < 0.28) {
      status = 'oscilando';
      label = 'Oscilando';
    }

    const rockHalfHeight = heldRock.dimensions[1] || 0.14;
    return {
      status,
      label,
      stabilityMargin: margin,
      contactPoint: below.point,
      centerOfMass: cmWorld,
      targetY: below.point.y + rockHalfHeight * 0.95,
      supportObject: below.object,
    };
  }

  findSurfaceBelow(heldRock, pos) {
    let highestY = -999;
    let target = null;

    // 1. Rocha base
    if (this.baseRock) {
      const bPos = this.baseRock.position;
      const distToBaseCenter = Math.hypot(pos.x - bPos.x, pos.z - bPos.z);
      if (distToBaseCenter < 1.75) {
        highestY = bPos.y + 0.25;
        target = {
          object: this.baseRock,
          point: new THREE.Vector3(bPos.x, highestY, bPos.z),
          radius: 1.15,
        };
      }
    }

    // 2. Pedras já empilhadas
    for (const r of this.rocks) {
      if (r === heldRock || !r.isStacked) continue;
      const rPos = r.mesh.position;
      const d = Math.hypot(pos.x - rPos.x, pos.z - rPos.z);
      const rRadius = Math.max(r.dimensions[0], r.dimensions[2]) * 1.05;

      if (d < rRadius) {
        const topY = rPos.y + (r.dimensions[1] || 0.14);
        if (topY > highestY) {
          highestY = topY;
          target = {
            object: r.mesh,
            point: new THREE.Vector3(rPos.x, topY, rPos.z),
            radius: rRadius * 0.85,
          };
        }
      }
    }

    return target;
  }

  updateBalanceVisuals(balanceData, isVisible) {
    this.balanceHelper.visible = isVisible;
    if (!isVisible || !balanceData) return;

    const cm = balanceData.centerOfMass;
    const cp = balanceData.contactPoint;

    this.cmSphere.position.copy(cm);

    const linePos = this.plumbLine.geometry.attributes.position;
    linePos.setXYZ(0, cm.x, cm.y, cm.z);
    linePos.setXYZ(1, cp.x, cp.y, cp.z);
    linePos.needsUpdate = true;
    this.plumbLine.computeLineDistances();

    this.contactRing.position.set(cp.x, cp.y + 0.005, cp.z);

    if (balanceData.status === 'estavel') {
      this.ringMat.color.setHex(0x56b86e);
      this.cmSphere.material.color.setHex(0x76db8e);
    } else if (balanceData.status === 'oscilando') {
      this.ringMat.color.setHex(0xe5a93b);
      this.cmSphere.material.color.setHex(0xffc85e);
    } else {
      this.ringMat.color.setHex(0xd9534f);
      this.cmSphere.material.color.setHex(0xff6b67);
    }
  }

  /**
   * Solta a pedra segurada. Se for estável, assenta perfeitamente na pilha.
   * Se for instável, rola e cai no rio.
   */
  dropRock(rock, balanceData) {
    rock.isHeld = false;

    if (!balanceData) {
      balanceData = this.evaluateBalance(rock, rock.mesh.position, rock.mesh.rotation);
    }

    if (balanceData.status === 'estavel' || balanceData.status === 'oscilando') {
      // Assentamento perfeito e sereno na torre
      rock.isStacked = true;
      rock.isFalling = false;
      rock.isInWater = false;
      rock.mesh.position.y = balanceData.targetY;

      if (balanceData.status === 'oscilando') {
        rock.mesh.rotation.z += 0.04;
      }

      if (this.useRapier && rock.body) {
        rock.body.setTranslation(rock.mesh.position.x, rock.mesh.position.y, rock.mesh.position.z, true);
        rock.body.setRotation(rock.mesh.quaternion, true);
        rock.body.setLinvel(new this.rapier.Vector3(0, 0, 0), true);
        rock.body.setAngvel(new this.rapier.Vector3(0, 0, 0), true);
        rock.body.sleep();
      }

      this.onClack(rock.mass, 0.85);
    } else {
      // Instável: cai e rola para a água
      rock.isStacked = false;
      rock.isFalling = true;

      const dirX = rock.mesh.position.x - (balanceData.contactPoint?.x || 0.1);
      const dirZ = rock.mesh.position.z - (balanceData.contactPoint?.z || -0.2);
      const len = Math.hypot(dirX, dirZ) || 1;

      rock.velocity.set((dirX / len) * 1.2, 0.1, (dirZ / len) * 1.2);

      if (this.useRapier && rock.body) {
        rock.body.setTranslation(rock.mesh.position.x, rock.mesh.position.y, rock.mesh.position.z, true);
        rock.body.setRotation(rock.mesh.quaternion, true);
        rock.body.setLinvel(new this.rapier.Vector3(rock.velocity.x, 0.1, rock.velocity.z), true);
        rock.body.setAngvel(new this.rapier.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2), true);
        rock.body.wakeUp();
      }
    }
  }

  update(delta) {
    if (this.useRapier && this.world) {
      this.world.step();
    }

    const bPos = this.baseRock ? this.baseRock.position : new THREE.Vector3(0.1, 0, -0.2);

    for (const r of this.rocks) {
      if (r.isHeld) continue;

      if (r.isFalling) {
        if (this.useRapier && r.body) {
          const t = r.body.translation();
          const rot = r.body.rotation();
          r.mesh.position.set(t.x, t.y, t.z);
          r.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        } else {
          r.velocity.y += this.gravity * delta * 0.7;
          r.mesh.position.addScaledVector(r.velocity, delta);
          r.mesh.rotation.x += delta * 2.0;
          r.mesh.rotation.z += delta * 1.5;
        }
      }

      // Checar se caiu na água (distância da base > 1.3m e y <= água)
      const distFromBase = Math.hypot(r.mesh.position.x - bPos.x, r.mesh.position.z - bPos.z);
      if (r.mesh.position.y <= this.waterLevel + 0.04 && distFromBase > 1.25) {
        if (!r.isInWater) {
          r.isInWater = true;
          r.isStacked = false;
          r.isFalling = false;
          this.onSplash(r.mesh.position.x, r.mesh.position.z);
          r.fallTimer = 0;
          if (r.body) {
            r.body.setLinvel(new this.rapier.Vector3(0, 0, 0), true);
            r.body.setAngvel(new this.rapier.Vector3(0, 0, 0), true);
            r.body.sleep();
          }
        } else {
          r.fallTimer += delta;
          if (r.fallTimer >= 1.6) {
            this.recoverRockToBank(r);
          }
        }
      }
    }
  }

  recoverRockToBank(rock) {
    rock.isInWater = false;
    rock.isFalling = false;
    rock.isStacked = false;
    rock.fallTimer = 0;
    rock.velocity.set(0, 0, 0);

    rock.mesh.position.copy(rock.initialPos);
    rock.mesh.rotation.copy(rock.initialRot);

    if (this.useRapier && rock.body) {
      rock.body.setTranslation(rock.initialPos.x, rock.initialPos.y, rock.initialPos.z, true);
      rock.body.setRotation(rock.mesh.quaternion, true);
      rock.body.setLinvel(new this.rapier.Vector3(0, 0, 0), true);
      rock.body.setAngvel(new this.rapier.Vector3(0, 0, 0), true);
      rock.body.sleep();
    }

    this.onRecover(rock);
  }

  resetAllToBank() {
    for (const r of this.rocks) {
      this.recoverRockToBank(r);
    }
  }
}
