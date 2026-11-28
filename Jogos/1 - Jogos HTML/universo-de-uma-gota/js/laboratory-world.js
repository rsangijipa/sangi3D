/**
 * Estação de laboratório tridimensional opcional para preparação de lâminas.
 * Modela bancada, microscópio, lâmina de vidro, lamínula, pipeta e frascos de amostra.
 */

import * as THREE from '../../../../Sistema/shared/vendor/three.module.js';

export function createLaboratoryStation(container, onComplete) {
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement;
  canvas.className = 'gota-lab-canvas';
  container.append(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#060d12');
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 3.4, 5.2);
  camera.lookAt(0, 0.35, 0);

  const ambient = new THREE.AmbientLight(0x88b4c4, 0.9);
  const key = new THREE.DirectionalLight(0xeef9f7, 1.5);
  key.position.set(3, 5, 4);
  const rim = new THREE.PointLight(0x69b88b, 1.2, 12);
  rim.position.set(-3, 2, -2);
  scene.add(ambient, key, rim);

  // Bancada científica
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.3, 4.5),
    new THREE.MeshStandardMaterial({color: 0x0e1d26, roughness: 0.72, metalness: 0.12}),
  );
  bench.position.y = -0.15;
  scene.add(bench);

  // Lâmina de vidro
  const slideGroup = new THREE.Group();
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfe8ec,
    transparent: true,
    opacity: 0.48,
    roughness: 0.15,
    metalness: 0.05,
  });
  const glassSlide = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 0.78), glassMat);
  slideGroup.add(glassSlide);

  // Gota virtual com menisco
  const dropMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 24, 16),
    new THREE.MeshPhysicalMaterial({color: 0x7fd8cf, transparent: true, opacity: 0.72, roughness: 0.08}),
  );
  dropMesh.scale.set(1, 0.32, 1);
  dropMesh.position.set(0, 0.06, 0);
  dropMesh.visible = false;
  slideGroup.add(dropMesh);

  // Lamínula
  const coverslip = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.65), glassMat);
  coverslip.position.set(-1.4, 0.45, 0.2);
  slideGroup.add(coverslip);
  scene.add(slideGroup);

  // Pipeta
  const pipette = new THREE.Group();
  const pipetteBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.015, 1.6, 12),
    new THREE.MeshStandardMaterial({color: 0xd4ece9, transparent: true, opacity: 0.75, roughness: 0.2}),
  );
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 10),
    new THREE.MeshStandardMaterial({color: 0xd2b375, roughness: 0.6}),
  );
  bulb.position.y = 0.85;
  pipette.add(pipetteBody, bulb);
  pipette.position.set(1.4, 1.4, 0.2);
  pipette.rotation.z = 0.25;
  scene.add(pipette);

  // Microscópio estilizado ao fundo
  const scope = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({color: 0x1b2e3a, roughness: 0.4, metalness: 0.6});
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 1.3), metalMat);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.6, 0.26), metalMat);
  arm.position.set(0, 0.85, -0.45);
  const stagePlate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.9), metalMat);
  stagePlate.position.set(0, 0.65, 0);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 16), metalMat);
  tube.position.set(0, 1.35, 0);
  tube.rotation.x = 0.22;
  scope.add(base, arm, stagePlate, tube);
  scope.position.set(0, 0.08, -1.35);
  scene.add(scope);

  let step = 0; // 0: amostra escolhida, 1: gota pipetada, 2: lamínula colocada, 3: montada no microscópio
  let animProgress = 0;
  let raf = 0;
  let disposed = false;
  let completionTimer = 0;

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  function tick() {
    if (disposed) return;
    animProgress = Math.min(1, animProgress + 0.04);
    if (step >= 1) {
      pipette.position.lerp(new THREE.Vector3(0.05, 1.1, 0), 0.1);
      dropMesh.visible = true;
      const targetScaleY = step >= 2 ? 0.10 : 0.35;
      const targetScaleXZ = step >= 2 ? 1.45 : 1.0;
      dropMesh.scale.y += (targetScaleY - dropMesh.scale.y) * 0.12;
      dropMesh.scale.x += (targetScaleXZ - dropMesh.scale.x) * 0.12;
      dropMesh.scale.z = dropMesh.scale.x;
    }
    if (step >= 2) {
      coverslip.position.lerp(new THREE.Vector3(0, 0.06, 0), 0.12);
    }
    if (step >= 3) {
      slideGroup.position.lerp(new THREE.Vector3(0, 0.72, -1.35), 0.1);
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  function observeSample() {
    if (!disposed) onComplete?.();
  }

  return {
    advanceStep() {
      step = Math.min(3, step + 1);
      animProgress = 0;
      if (step === 3 && !completionTimer) completionTimer = setTimeout(observeSample, 550);
      return step;
    },
    observeSample,
    getStep() { return step; },
    dispose() {
      disposed = true;
      clearTimeout(completionTimer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}
