(() => {
  'use strict';

  const trails = [
    { width: 1.55, points: [[0, 6.6], [0, -4.65], [-0.63, -5.65], [-0.63, -7.8], [0, -10.5]] },
    { width: 1.12, points: [[0, -10.5], [-4.4, -13], [-5, -17], [-3, -20.5], [0, -21.8]] },
    { width: 1.12, points: [[0, -10.5], [4.2, -12.8], [5, -17.4], [3.7, -20.3], [0, -21.8]] },
    { width: 1.18, points: [[0, -21.8], [0, -25.7], [0, -28]] },
  ];
  const landmarks = [
    { name: 'Escada de Pedra', hint: 'Suba os sete degraus até o pergolado.' },
    { name: 'Pergolado', x: -0.63, z: -7.35, radius: 0.84, hint: 'Escolha a Trilha das Flores ou a Trilha do Bosque.' },
    { name: 'Clareira', x: 0, z: -21.8, radius: 1.05, hint: 'Atravesse a ponte de madeira até o mirante.' },
    { name: 'Mirante', x: 0, z: -28, radius: 1.1, hint: 'Percurso concluído. Você pode voltar e explorar a outra trilha.' },
  ];
  const footbridge = { front: -23.1, back: -25.55, width: 2.4 };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const trailHeight = z => 2.71 + Math.max(0, -z - 9) * 0.086;
  const lookoutRadius = 2.15;
  const segments = trails.flatMap(({ width, points }) => points.slice(1).map(([bx, bz], i) => {
    const [ax, az] = points[i];
    const dx = bx - ax;
    const dz = bz - az;
    return { width, ax, az, dx, dz, lengthSq: dx * dx + dz * dz };
  }));

  function pathEdge(x, z) {
    let edge = Math.hypot(x, z + 28) - lookoutRadius;
    for (const { width, ax, az, dx, dz, lengthSq } of segments) {
      const t = clamp(((x - ax) * dx + (z - az) * dz) / lengthSq, 0, 1);
      edge = Math.min(edge, Math.hypot(x - ax - t * dx, z - az - t * dz) - width);
    }
    return edge;
  }

  function createRoute(stairs) {
    return {
      floor(x, z, ground) {
        if (pathEdge(x, z) > -0.16) return null;
        // Bench and the four pergola posts, including clearance around the player.
        if (x > -0.31 && x < 1.95 && z > -7.48 && z < -6.59) return null;
        if ([-1.6, 1.9].some(px => [-5.49, -7.79].some(pz => Math.hypot(x - px, z - pz) < 0.34))) return null;
        if (z < footbridge.front && z > footbridge.back && Math.abs(x) > 0.95) return null;
        if (z < stairs.at(-1).z - 0.5) return trailHeight(z);
        const tread = stairs.findLast(stair => z <= stair.z + 0.57);
        return tread ? tread.y : Math.max(0, ground);
      },
    };
  }

  function advance(phase, x, z) {
    const next = landmarks[phase + 1];
    return next && Math.hypot(x - next.x, z - next.z) <= next.radius
      ? { phase: phase + 1 }
      : { phase };
  }

  function terrainHeight(x, z, original) {
    if (z >= -4.5) return original;
    const edge = pathEdge(x, z);
    const valley = clamp(Math.min(footbridge.front - z, z - footbridge.back) / 0.7, 0, 1);
    const height = trailHeight(z) - 0.16 - valley * 1.25
      + clamp((edge - 0.6) / 6, 0, 1) * (1.3 + Math.sin(x * 0.64 + z * 0.45) * 1.1);
    return original + (height - original) * clamp((-z - 4.5) / 1.35, 0, 1);
  }

  function buildGarden(THREE, garden) {
    const { scene, woodMat, stoneMat } = garden;
    const grit = document.createElement('canvas');
    grit.width = grit.height = 128;
    const paint = grit.getContext('2d');
    const flecks = paint.createImageData(grit.width, grit.height);
    let seed = 5891;
    for (let i = 0; i < flecks.data.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const tone = seed >>> 24;
      flecks.data[i] = 162 + tone * 0.3;
      flecks.data[i + 1] = 138 + tone * 0.29;
      flecks.data[i + 2] = 104 + tone * 0.27;
      flecks.data[i + 3] = 255;
    }
    paint.putImageData(flecks, 0, 0);
    const pathTexture = new THREE.CanvasTexture(grit);
    pathTexture.colorSpace = THREE.SRGBColorSpace;
    pathTexture.wrapS = pathTexture.wrapT = THREE.RepeatWrapping;
    pathTexture.anisotropy = Math.min(8, garden.renderer.capabilities.getMaxAnisotropy());
    const pathMat = new THREE.MeshStandardMaterial({ map: pathTexture, roughness: 0.97, polygonOffset: true, polygonOffsetFactor: -1 });
    const petals = new THREE.MeshStandardMaterial({ color: 0xd48b9e, roughness: 0.8 });
    const bark = new THREE.MeshStandardMaterial({ color: 0x604631, roughness: 0.96 });
    const glow = new THREE.MeshBasicMaterial({ color: 0xffdaa1 });
    const point = (x, z, lift = 0) => new THREE.Vector3(x, trailHeight(z) + lift, z);

    function mesh(geometry, material, x, y, z) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(x, y, z);
      object.receiveShadow = true;
      scene.add(object);
      return object;
    }

    function box(w, h, d, mat, x, y, z) {
      return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
    }

    // A single ground ribbon mesh with round junctions joins both paths.
    const vertices = [];
    const uvs = [];
    const triangle = (...points) => points.forEach(v => {
      vertices.push(v.x, v.y, v.z);
      uvs.push(v.x * 1.4, v.z * 1.4);
    });
    function ribbonSegment(width, ax, az, dx, dz) {
      const lengthSq = dx * dx + dz * dz;
      const nx = -dz * width / Math.sqrt(lengthSq);
      const nz = dx * width / Math.sqrt(lengthSq);
      const a = point(ax - nx, az - nz, 0.008);
      const b = point(ax + nx, az + nz, 0.008);
      const c = point(ax + dx + nx, az + dz + nz, 0.008);
      const d = point(ax + dx - nx, az + dz - nz, 0.008);
      triangle(a, b, c);
      triangle(a, c, d);
    }
    for (const { width, ax, az, dx, dz } of segments.slice(4, -2)) ribbonSegment(width, ax, az, dx, dz);
    ribbonSegment(1.18, 0, -21.8, 0, footbridge.front + 21.8);
    ribbonSegment(1.18, 0, footbridge.back, 0, -28 - footbridge.back);
    function circle(x, z, radius, lift) {
      for (let i = 0; i < 28; i++) {
        const a = i * Math.PI / 14;
        const b = (i + 1) * Math.PI / 14;
        triangle(point(x, z, lift), point(x + radius * Math.cos(b), z + radius * Math.sin(b), lift),
          point(x + radius * Math.cos(a), z + radius * Math.sin(a), lift));
      }
    }
    for (const { width, points } of trails.slice(1, 3)) {
      points.slice(1).forEach(([x, z]) => circle(x, z, width, 0.01));
    }
    // Join the rear edge of the original patio to the fork.
    const patio = [point(-1.45, -8.53), point(1.45, -8.53), point(1.12, -10.5), point(-1.12, -10.5)];
    triangle(patio[0], patio[1], patio[2]);
    triangle(patio[0], patio[2], patio[3]);
    circle(0, -28, lookoutRadius, 0.025);
    const ribbon = new THREE.BufferGeometry();
    ribbon.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    ribbon.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    ribbon.computeVertexNormals();
    mesh(ribbon, pathMat, 0, 0, 0);

    const { front, back, width } = footbridge;
    const count = 13;
    const spacing = (front - back) / count;
    for (let i = 0; i < count; i++) {
      const z = front - (i + 0.5) * spacing;
      box(width, 0.14, spacing + 0.005, woodMat, 0, trailHeight(z) - 0.04, z).rotation.x = Math.atan(0.086);
    }
    const mid = (front + back) / 2;
    for (const x of [-1.13, 1.13]) {
      for (const z of [front, mid, back]) box(0.13, 1.93, 0.13, woodMat, x, trailHeight(z) + 0.02, z);
      box(0.11, 0.13, front - back + 0.16, woodMat, x, trailHeight(mid) + 0.84, mid).rotation.x = Math.atan(0.086);
    }

    function marker(x, z, title, line, angle = 0) {
      const y = trailHeight(z);
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#28392f';
      ctx.fillRect(0, 0, 512, 160);
      ctx.strokeStyle = '#c5a671';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 492, 140);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffebc1';
      ctx.font = 'bold 40px Georgia';
      ctx.fillText(title, 256, 68, 465);
      ctx.font = '26px sans-serif';
      ctx.fillText(line, 256, 117, 465);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      box(0.105, 1.85, 0.11, woodMat, x - Math.sin(angle) * 0.11, y + 0.86, z - Math.cos(angle) * 0.11).rotation.y = angle;
      box(1.91, 0.62, 0.075, woodMat, x, y + 1.61, z).rotation.y = angle;
      const board = mesh(new THREE.PlaneGeometry(1.83, 0.57), new THREE.MeshBasicMaterial({ map: texture }),
        x + Math.sin(angle) * 0.045, y + 1.61, z + Math.cos(angle) * 0.045);
      board.rotation.y = angle;
    }
    marker(0, -12.03, 'Bifurcação', '← Flores       Bosque →');
    marker(1.5, -22.48, 'Clareira', 'Ponte do mirante ↑', -0.28);
    marker(1.82, -29.45, 'Mirante', 'Fim do percurso', -0.3);

    const railAxis = new THREE.Vector3(1, 0, 0);
    let previousPost = null;
    for (let i = 0; i <= 8; i++) {
      const angle = i * Math.PI / 8;
      const x = Math.cos(angle) * (lookoutRadius + 0.02);
      const z = -28 - Math.sin(angle) * (lookoutRadius + 0.02);
      box(0.14, 1.12, 0.14, woodMat, x, trailHeight(z) + 0.46, z);
      const post = point(x, z, 0.87);
      if (previousPost) {
        const direction = post.clone().sub(previousPost);
        const midPoint = post.clone().lerp(previousPost, 0.5);
        for (const drop of [0, 0.39]) {
          box(direction.length(), 0.12, 0.11, woodMat, midPoint.x, midPoint.y - drop, midPoint.z)
            .quaternion.setFromUnitVectors(railAxis, direction.clone().normalize());
        }
      }
      previousPost = post;
    }

    const rock = new THREE.IcosahedronGeometry(1, 1);
    const crown = new THREE.IcosahedronGeometry(1, 2);
    const trunk = new THREE.CylinderGeometry(0.13, 0.28, 1, 7);
    const canopyMats = [0x3a5639, 0x516b3d, 0x697144].map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.94 }));
    const blossom = new THREE.SphereGeometry(0.15, 7, 5);
    const foliage = new THREE.InstancedMesh(blossom, petals, 108);
    const dummy = new THREE.Object3D();
    const trunkMatrices = [];
    const crownBuckets = [[], [], []];
    const rockMatrices = [];
    let flowers = 0;
    for (let i = 0; i < 22; i++) {
      const z = -10.7 - i * 0.85;
      for (const side of [-1, 1]) {
        const x = side * (6.8 + Math.sin(i * 2.4 + side) * 1.3);
        if (pathEdge(x, z) < 0.66 || (z < -22.6 && z > -26)) continue;
        const y = garden.groundHeight(x, z);
        if (i % 2 === 0) {
          const height = 2.7 + Math.sin(i * 1.4 + side) * 0.7;
          dummy.position.set(x, y + height / 2, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, height, 1);
          dummy.updateMatrix();
          trunkMatrices.push(dummy.matrix.clone());
          for (let k = 0; k < 3; k++) {
            dummy.position.set(x + (k - 1) * 0.55, y + height + k * 0.38, z + Math.sin(k) * 0.6);
            dummy.scale.set(1.03, 0.88, 1.0);
            dummy.updateMatrix();
            crownBuckets[(i + k) % 3].push(dummy.matrix.clone());
          }
        } else {
          dummy.position.set(x, y + 0.13, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(0.75, 0.53, 0.65);
          dummy.updateMatrix();
          rockMatrices.push(dummy.matrix.clone());
        }
      }
    }
    const addInst = (geo, mat, mats) => {
      if (!mats.length) return;
      const inst = new THREE.InstancedMesh(geo, mat, mats.length);
      inst.castShadow = true;
      inst.receiveShadow = true;
      mats.forEach((m, idx) => inst.setMatrixAt(idx, m));
      inst.instanceMatrix.needsUpdate = true;
      scene.add(inst);
    };
    addInst(trunk, bark, trunkMatrices);
    canopyMats.forEach((m, idx) => addInst(crown, m, crownBuckets[idx]));
    addInst(rock, stoneMat, rockMatrices);

    for (let i = 0; i < 18; i++) {
      const z = -12.1 - i * 0.48;
      for (let k = 0; k < 6; k++) {
        const x = -2.45 - 1.12 * Math.sin(i * 0.17) + Math.sin(k * 4.7) * 0.36;
        if (pathEdge(x, z) < 0.23) continue;
        dummy.position.set(x, garden.groundHeight(x, z) + 0.16 + k * 0.029, z + Math.cos(k) * 0.24);
        dummy.scale.setScalar(0.6 + k * 0.09);
        dummy.updateMatrix();
        foliage.setMatrixAt(flowers++, dummy.matrix);
      }
    }
    foliage.count = flowers;
    foliage.instanceMatrix.needsUpdate = true;
    scene.add(foliage);

    for (const [x, z] of [[-1.42, -9.65], [1.4, -9.65], [-1.3, -21.64], [1.34, -25.9], [-2.16, -27.7]]) {
      const y = trailHeight(z);
      box(0.1, 0.8, 0.1, woodMat, x, y + 0.37, z);
      box(0.24, 0.26, 0.24, glow, x, y + 0.83, z);
      mesh(new THREE.ConeGeometry(0.24, 0.18, 4), woodMat, x, y + 1.04, z).rotation.y = Math.PI / 4;
    }
  }

  const movementKeys = new Map([
    ['KeyW', 'forward'], ['ArrowUp', 'forward'], ['KeyS', 'back'], ['ArrowDown', 'back'],
    ['KeyA', 'left'], ['ArrowLeft', 'left'], ['KeyD', 'right'], ['ArrowRight', 'right'],
    ['KeyQ', 'lookLeft'], ['KeyE', 'lookRight'],
  ]);

  class WalkController {
    constructor(garden, onStep) {
      this.garden = garden;
      this.onStep = onStep;
      this.stairs = garden.stepGroups.map(({ worldCenter }) => ({ y: worldCenter.y, z: worldCenter.z }));
      this.route = createRoute(this.stairs);
      this.keys = new Set();
      this.touch = new Map();
      this.x = 0;
      this.z = 6;
      this.eyeY = 1.62;
      this.yaw = 0;
      this.pitch = -0.045;
      this.phase = 0;
      this.step = -1;
      this.active = false;
      this.hud = document.getElementById('walk-hud');
      this.start = document.getElementById('btn-walk');
      this.exit = document.getElementById('walk-exit');
      this.bindInput();
      this.start.disabled = false;
      this.updateHud();
    }

    bindInput() {
      const canvas = this.garden.renderer.domElement;
      this.start.addEventListener('click', () => this.setActive(true));
      this.exit.addEventListener('click', () => this.setActive(false));
      window.addEventListener('keydown', event => {
        if (!this.active) return;
        if (event.code === 'Escape') {
          event.preventDefault();
          this.setActive(false);
        } else if (movementKeys.has(event.code) && !event.altKey && !event.metaKey && !event.ctrlKey) {
          event.preventDefault();
          this.keys.add(event.code);
        }
      });
      window.addEventListener('keyup', event => this.keys.delete(event.code));
      window.addEventListener('blur', () => this.clearInput());
      document.addEventListener('visibilitychange', () => this.clearInput());

      canvas.addEventListener('pointerdown', event => {
        if (!this.active || event.button !== 0 || this.drag) return;
        this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
        canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener('pointermove', event => {
        if (!this.active || this.drag?.id !== event.pointerId) return;
        this.yaw -= (event.clientX - this.drag.x) * 0.005;
        this.pitch = clamp(this.pitch - (event.clientY - this.drag.y) * 0.005, -1.18, 1.18);
        this.drag.x = event.clientX;
        this.drag.y = event.clientY;
      });
      canvas.addEventListener('lostpointercapture', event => {
        if (this.drag?.id === event.pointerId) this.drag = null;
      });

      this.hud.querySelectorAll('[data-walk]').forEach(button => {
        button.addEventListener('pointerdown', event => {
          event.preventDefault();
          button.setPointerCapture(event.pointerId);
          this.touch.set(event.pointerId, button.dataset.walk);
        });
        button.addEventListener('lostpointercapture', event => this.touch.delete(event.pointerId));
      });
    }

    clearInput() {
      this.keys.clear();
      this.touch.clear();
      this.drag = null;
    }

    setActive(active) {
      this.active = active;
      this.clearInput();
      this.garden.cameraAnim = null;
      this.garden.hoveredStep = -1;
      this.garden.syncStepsVisualState();
      document.getElementById('step-tooltip').classList.remove('visible');
      document.body.classList.toggle('walk-mode', active);
      this.hud.hidden = !active;
      this.garden.controls.enabled = !active;
      this.garden.camera.fov = active ? 64 : 42;
      this.garden.camera.updateProjectionMatrix();
      if (active) {
        this.update(0, true);
        this.exit.focus({ preventScroll: true });
      } else {
        this.garden.updateCameraFraming(true);
        this.start.focus({ preventScroll: true });
      }
    }

    updateHud() {
      const { name, hint } = landmarks[this.phase];
      this.hud.querySelector('#walk-phase').textContent = `${this.phase + 1} / ${landmarks.length} · ${name}`;
      this.hud.querySelector('#walk-goal').textContent = hint;
    }

    update(dt, reducedMotion) {
      const actions = new Set(this.touch.values());
      for (const code of this.keys) actions.add(movementKeys.get(code));
      this.yaw += (Number(actions.has('lookLeft')) - Number(actions.has('lookRight'))) * dt * 1.9;
      const dx = Number(actions.has('right')) - Number(actions.has('left'));
      const dz = Number(actions.has('back')) - Number(actions.has('forward'));
      const stride = dt * 2.25 / (Math.hypot(dx, dz) || 1);
      if (dx || dz) {
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const nx = this.x + (dx * cos + dz * sin) * stride;
        const nz = this.z + (dz * cos - dx * sin) * stride;
        if (this.route.floor(nx, nz, 0) !== null) {
          this.x = nx;
          this.z = nz;
        } else {
          if (this.route.floor(nx, this.z, 0) !== null) this.x = nx;
          if (this.route.floor(this.x, nz, 0) !== null) this.z = nz;
        }
      }

      const ground = this.z > 2.57 ? this.garden.groundHeight(this.x, this.z) : 0;
      const eye = this.route.floor(this.x, this.z, ground) + 1.62;
      this.eyeY += (eye - this.eyeY) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 13));
      this.garden.camera.position.set(this.x, this.eyeY, this.z);
      this.garden.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
      const step = this.stairs.findIndex(stair => Math.abs(stair.z - this.z) < 0.45);
      if (step !== this.step) {
        this.step = step;
        if (step >= 0) this.onStep(step);
      }
      const { phase } = advance(this.phase, this.x, this.z);
      if (phase !== this.phase) {
        this.phase = phase;
        this.updateHud();
      }
    }
  }

  globalThis.CourageWalk = { createRoute, advance, buildGarden, terrainHeight, trails, WalkController };
})();
