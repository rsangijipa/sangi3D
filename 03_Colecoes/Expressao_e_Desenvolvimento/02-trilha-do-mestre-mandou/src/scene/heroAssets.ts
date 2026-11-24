/**
 * Hero Assets Manipuláveis: Sino Azul, Tambor e Roda d'Água
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';

/**
 * 1. Sino Azul de Bronze e Campanário de Madeira
 */
export function createBlueBell() {
  const group = new THREE.Group();
  group.name = 'sino_azul_grupo';
  group.position.set(14.0, 3.2, -6.0);

  // Campanário de madeira rústica (duas vigas inclinadas e trave mestra)
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5a3d28,
    roughness: 0.72,
    metalness: 0.05
  });

  const postGeo = new THREE.CylinderGeometry(0.12, 0.15, 3.6, 12);
  [-1.1, 1.1].forEach(x => {
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.set(x, 1.8, 0);
    post.rotation.z = x > 0 ? -0.12 : 0.12;
    post.castShadow = true;
    post.receiveShadow = true;
    group.add(post);
  });

  const beamGeo = new THREE.BoxGeometry(2.6, 0.22, 0.22);
  const beam = new THREE.Mesh(beamGeo, woodMat);
  beam.position.set(0, 3.4, 0);
  beam.castShadow = true;
  group.add(beam);

  // Pivô de oscilação do sino suspenso
  const bellPivot = new THREE.Group();
  bellPivot.name = 'sino_pivot';
  bellPivot.position.set(0, 3.3, 0);

  // Sino de bronze com pátina azul celadon
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0.08, 0.0));
  points.push(new THREE.Vector2(0.18, -0.2));
  points.push(new THREE.Vector2(0.32, -0.6));
  points.push(new THREE.Vector2(0.55, -0.95)); // lábio do sino
  points.push(new THREE.Vector2(0.58, -1.02));
  points.push(new THREE.Vector2(0.48, -1.02));
  points.push(new THREE.Vector2(0.24, -0.5));
  points.push(new THREE.Vector2(0.06, -0.1));

  const bellGeo = new THREE.LatheGeometry(points, 32);
  const bellMat = new THREE.MeshStandardMaterial({
    color: 0x5599a5, // azul celadon
    roughness: 0.38,
    metalness: 0.78
  });
  const bellMesh = new THREE.Mesh(bellGeo, bellMat);
  bellMesh.name = 'sino_azul';
  bellMesh.castShadow = true;
  bellMesh.receiveShadow = true;
  bellPivot.add(bellMesh);

  // Borda dourada decorativa
  const ringGeo = new THREE.TorusGeometry(0.56, 0.035, 12, 32);
  ringGeo.rotateX(Math.PI / 2);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xe5bc58,
    metalness: 0.88,
    roughness: 0.25
  });
  const goldRing = new THREE.Mesh(ringGeo, goldMat);
  goldRing.position.y = -1.0;
  goldRing.castShadow = true;
  bellPivot.add(goldRing);

  // Badalo interno do sino
  const clapperGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const clapper = new THREE.Mesh(clapperGeo, goldMat);
  clapper.position.set(0, -1.05, 0);
  bellPivot.add(clapper);

  group.add(bellPivot);

  // Hitbox de toque invisível
  const hitGeo = new THREE.SphereGeometry(1.2, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  hitbox.position.set(0, 2.2, 0);
  hitbox.name = 'hitbox_sino_azul';
  group.add(hitbox);

  // Estado de animação de balanço
  let swingEnergy = 0;
  let swingTime = 0;

  function strike() {
    swingEnergy = 1.0;
    swingTime = 0;
  }

  function update(dt: number) {
    if (swingEnergy > 0.005) {
      swingTime += dt * 6.5;
      swingEnergy = Math.max(0, swingEnergy - dt * 0.45);
      bellPivot.rotation.z = Math.sin(swingTime) * swingEnergy * 0.45;
    } else {
      bellPivot.rotation.z = 0;
    }
  }

  return { group, bellMesh, hitbox, strike, update };
}

/**
 * 2. Tambor da Clareira
 */
export function createDrum() {
  const group = new THREE.Group();
  group.name = 'tambor_grupo';
  group.position.set(10.0, 0.8, 12.0);

  // Corpo de madeira maciça torneada
  const bodyGeo = new THREE.CylinderGeometry(0.75, 0.65, 0.9, 24);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x8a5538,
    roughness: 0.68,
    metalness: 0.08
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Pele de couro com tom terracota
  const skinGeo = new THREE.CircleGeometry(0.74, 24);
  skinGeo.rotateX(-Math.PI / 2);
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xb9634b, // terracota artesanal
    roughness: 0.85,
    metalness: 0.02
  });
  const skin = new THREE.Mesh(skinGeo, skinMat);
  skin.position.y = 0.452;
  skin.receiveShadow = true;
  skin.name = 'tambor';
  group.add(skin);

  // Cordas de amarração laterais
  const cordMat = new THREE.MeshStandardMaterial({ color: 0xdec699, roughness: 0.8 });
  const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.04, 8, 24).rotateX(Math.PI / 2), cordMat);
  ringTop.position.y = 0.42;
  group.add(ringTop);

  // Baqueta de madeira fincada ao lado
  const stickGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.8, 12);
  const stick = new THREE.Mesh(stickGeo, bodyMat);
  stick.position.set(0.9, 0.35, 0.2);
  stick.rotation.z = 0.35;
  stick.castShadow = true;
  group.add(stick);

  // Hitbox de toque
  const hitGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 16);
  const hitbox = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
  hitbox.position.y = 0.45;
  hitbox.name = 'hitbox_tambor';
  group.add(hitbox);

  let pulseTimer = 0;
  function strike() {
    pulseTimer = 0.25;
  }

  function update(dt: number) {
    if (pulseTimer > 0) {
      pulseTimer = Math.max(0, pulseTimer - dt);
      const scale = 1.0 + Math.sin(pulseTimer * 25.0) * 0.08 * (pulseTimer / 0.25);
      skin.scale.set(scale, 1.0, scale);
    } else {
      skin.scale.set(1.0, 1.0, 1.0);
    }
  }

  return { group, skin, hitbox, strike, update };
}

/**
 * 3. Roda d'Água Hidráulica
 */
export function createWaterWheel() {
  const group = new THREE.Group();
  group.name = 'roda_dagua_grupo';
  group.position.set(-8.0, 0.6, -10.0);

  // Pilares de pedra no leito do rio
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6e766d, roughness: 0.8 });
  const pillarGeo = new THREE.BoxGeometry(0.6, 2.2, 0.8);

  [-1.2, 1.2].forEach(z => {
    const pillar = new THREE.Mesh(pillarGeo, stoneMat);
    pillar.position.set(0, 0.5, z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);
  });

  // Eixo e roda giratória
  const wheelPivot = new THREE.Group();
  wheelPivot.name = 'roda_dagua';
  wheelPivot.position.set(0, 1.2, 0);

  const axleGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.6, 12);
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x523621, roughness: 0.7 });
  const axle = new THREE.Mesh(axleGeo, woodMat);
  axle.rotation.x = Math.PI / 2;
  axle.castShadow = true;
  wheelPivot.add(axle);

  // 10 Pás de madeira com aros duplos
  const paddleCount = 10;
  const paddleGeo = new THREE.BoxGeometry(0.18, 0.03, 1.8);
  const paddleMat = new THREE.MeshStandardMaterial({
    color: 0x8a5538,
    roughness: 0.65
  });

  for (let i = 0; i < paddleCount; i++) {
    const angle = (i * Math.PI * 2) / paddleCount;
    const paddle = new THREE.Mesh(paddleGeo, paddleMat);
    paddle.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
    paddle.rotation.z = angle;
    paddle.castShadow = true;
    wheelPivot.add(paddle);

    // Raios de sustentação do cubo central
    const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    [-0.7, 0.7].forEach(z => {
      const spoke = new THREE.Mesh(spokeGeo, woodMat);
      spoke.position.set(Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, z);
      spoke.rotation.z = angle - Math.PI / 2;
      wheelPivot.add(spoke);
    });
  }

  // Aros circulares de ferro
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
  [-0.7, 0.7].forEach(z => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 8, 32), ironMat);
    rim.position.z = z;
    rim.castShadow = true;
    wheelPivot.add(rim);
  });

  group.add(wheelPivot);

  // Hitbox de interação
  const hitGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.4, 16);
  hitGeo.rotateX(Math.PI / 2);
  const hitbox = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
  hitbox.position.set(0, 1.2, 0);
  hitbox.name = 'hitbox_roda_dagua';
  group.add(hitbox);

  let angularVelocity = 1.2; // velocidade constante da correnteza
  let boostTimer = 0;

  function boost() {
    boostTimer = 3.5;
  }

  function update(dt: number) {
    if (boostTimer > 0) {
      boostTimer = Math.max(0, boostTimer - dt);
      angularVelocity = 3.8;
    } else {
      angularVelocity = 1.2;
    }
    wheelPivot.rotation.z -= angularVelocity * dt;
  }

  return { group, wheelPivot, hitbox, boost, update };
}
