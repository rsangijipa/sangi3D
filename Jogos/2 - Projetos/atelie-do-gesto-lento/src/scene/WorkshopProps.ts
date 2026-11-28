import * as THREE from 'three';

export class WorkshopProps {
  public group: THREE.Group;
  public wheelGroup: THREE.Group;
  public estecaMesh: THREE.Group;
  public bowlMesh: THREE.Group;

  private woodMat: THREE.MeshStandardMaterial;
  private darkWoodMat: THREE.MeshStandardMaterial;
  private wallMat: THREE.MeshStandardMaterial;
  private floorMat: THREE.MeshStandardMaterial;
  private linenMat: THREE.MeshStandardMaterial;
  private oliveMat: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();
    this.wheelGroup = new THREE.Group();
    this.estecaMesh = new THREE.Group();
    this.bowlMesh = new THREE.Group();

    // 1. Procedural textures
    const woodTex = this.generateWoodTexture();
    const wallTex = this.generateWallTexture();

    // 2. Materials
    this.woodMat = new THREE.MeshStandardMaterial({
      color: 0xb18c69,
      roughness: 0.68,
      metalness: 0.0,
      map: woodTex
    });

    this.darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5a4430,
      roughness: 0.74,
      metalness: 0.0
    });

    this.wallMat = new THREE.MeshStandardMaterial({
      color: 0xe7ddcb,
      roughness: 0.94,
      metalness: 0.0,
      map: wallTex
    });

    this.floorMat = new THREE.MeshStandardMaterial({
      color: 0x9d927e,
      roughness: 0.88,
      metalness: 0.0
    });

    this.linenMat = new THREE.MeshStandardMaterial({
      color: 0xc7b99c,
      roughness: 0.92,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    this.oliveMat = new THREE.MeshStandardMaterial({
      color: 0x68734a,
      roughness: 0.82,
      metalness: 0.0
    });

    this.buildArchitecture();
    this.buildWorkbench();
    this.buildTurningWheel();
    this.buildLinenAndTools();
    this.buildShelvesAndCeramics();
    this.buildStoolAndPlant();
  }

  private generateWoodTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#a6815e';
    ctx.fillRect(0, 0, 512, 512);

    let seed = 53;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 3000; i++) {
      const p = rand() * 512;
      const q = rand() * 512;
      ctx.strokeStyle = `rgba(54, 29, 12, ${rand() * 0.12})`;
      ctx.lineWidth = rand() * 1.5 + 0.3;
      ctx.beginPath();
      ctx.moveTo(p, q);
      ctx.lineTo(p + rand() * 180, q + rand() * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }

  private generateWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ddd2bc';
    ctx.fillRect(0, 0, 512, 512);

    let seed = 99;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 2000; i++) {
      const p = rand() * 512;
      const q = rand() * 512;
      ctx.strokeStyle = `rgba(80, 64, 42, ${rand() * 0.05})`;
      ctx.lineWidth = rand() * 1.2 + 0.2;
      ctx.beginPath();
      ctx.moveTo(p, q);
      ctx.lineTo(p + 2, q + 1);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  private createBox(
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = this.group
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  private buildArchitecture(): void {
    // Floor
    this.createBox(5.0, 0.08, 5.0, this.floorMat, 0, -0.04, 0);

    // Back Wall
    this.createBox(4.6, 2.85, 0.10, this.wallMat, 0, 1.425, -2.1);

    // Right Wall
    this.createBox(0.10, 2.85, 4.2, this.wallMat, 2.3, 1.425, 0);

    // Left Wall with large window cutout
    this.createBox(0.10, 1.0, 4.2, this.wallMat, -2.3, 0.5, 0);
    this.createBox(0.10, 0.35, 4.2, this.wallMat, -2.3, 2.675, 0);
    this.createBox(0.10, 1.5, 0.8, this.wallMat, -2.3, 1.75, -1.7);
    this.createBox(0.10, 1.5, 1.55, this.wallMat, -2.3, 1.75, 1.325);

    // Window sill
    this.createBox(0.25, 0.08, 2.4, this.woodMat, -2.2, 0.98, -0.25);

    // Window wooden mullions
    for (const z of [-1.32, -0.64, 0.08, 0.82]) {
      this.createBox(0.14, 1.58, 0.045, this.darkWoodMat, -2.24, 1.76, z);
    }
    for (const y of [1.0, 1.73, 2.5]) {
      this.createBox(0.15, 0.055, 2.25, this.darkWoodMat, -2.24, y, -0.25);
    }

    // Outdoor illuminated daylight backdrop
    const outdoorGeo = new THREE.PlaneGeometry(2.3, 1.65);
    const outdoorMat = new THREE.MeshBasicMaterial({ color: '#f3efe0' });
    const outdoor = new THREE.Mesh(outdoorGeo, outdoorMat);
    outdoor.position.set(-2.36, 1.75, -0.25);
    outdoor.rotation.y = Math.PI / 2;
    this.group.add(outdoor);
  }

  private buildWorkbench(): void {
    // Top surface with 5 separated planks
    for (let n = 0; n < 5; n++) {
      this.createBox(2.4, 0.065, 0.173, this.woodMat, 0, 0.78, (n - 2) * 0.176);
    }

    // Legs
    for (const x of [-1.02, 1.02]) {
      for (const z of [-0.31, 0.31]) {
        this.createBox(0.09, 0.74, 0.09, this.darkWoodMat, x, 0.37, z);
      }
    }

    // Structural stretchers / rails
    this.createBox(2.13, 0.09, 0.06, this.darkWoodMat, 0, 0.28, -0.31);
    this.createBox(2.13, 0.09, 0.06, this.darkWoodMat, 0, 0.28, 0.31);
  }

  private buildTurningWheel(): void {
    // Base turntable block
    const baseCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.265, 0.27, 0.038, 64),
      this.darkWoodMat
    );
    baseCyl.position.set(0, 0.832, 0);
    baseCyl.receiveShadow = true;
    this.group.add(baseCyl);

    // Rotating manual wheel
    const wheelCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.018, 64),
      this.woodMat
    );
    wheelCyl.position.set(0, 0.86, 0);
    wheelCyl.castShadow = true;
    wheelCyl.receiveShadow = true;
    this.wheelGroup.add(wheelCyl);

    // Recessed turning rings (visual concentric grooves)
    for (let r = 0.17; r < 0.247; r += 0.018) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.0009, 6, 80),
        this.darkWoodMat
      );
      ring.position.set(0, 0.87, 0);
      ring.rotation.x = Math.PI / 2;
      this.wheelGroup.add(ring);
    }

    this.group.add(this.wheelGroup);
  }

  private buildLinenAndTools(): void {
    // Folded linen cloth with procedural folds
    const clothGeo = new THREE.PlaneGeometry(0.53, 0.36, 36, 28);
    clothGeo.rotateX(-Math.PI / 2);
    const cp = clothGeo.attributes.position;
    for (let i = 0; i < cp.count; i++) {
      const x = cp.getX(i);
      const z = cp.getZ(i);
      cp.setY(i, 0.004 + Math.sin(x * 70 + z * 12) * 0.0025 + Math.sin(z * 31) * 0.002);
    }
    clothGeo.computeVertexNormals();

    const cloth = new THREE.Mesh(clothGeo, this.linenMat);
    cloth.position.set(-0.62, 0.819, 0.08);
    cloth.receiveShadow = true;
    this.group.add(cloth);

    // Sculpted Wooden Esteca Tools
    const buildTool = (x: number, z: number, rotY: number) => {
      const g = new THREE.Group();
      g.position.set(x, 0.831, z);
      g.rotation.y = rotY;

      // Handle
      const handle = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.008, 0.19, 6, 12),
        this.woodMat
      );
      handle.rotation.z = Math.PI / 2;
      handle.castShadow = true;
      g.add(handle);

      // Carving blade / tip
      const blade = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 16, 10),
        this.woodMat
      );
      blade.scale.set(1.8, 0.15, 0.65);
      blade.position.set(0.118, 0.006, 0);
      blade.castShadow = true;
      g.add(blade);

      return g;
    };

    const tool1 = buildTool(-0.62, 0.07, 0.2);
    const tool2 = buildTool(-0.67, 0.16, -0.09);
    this.estecaMesh.add(tool1);
    this.estecaMesh.add(tool2);
    this.group.add(this.estecaMesh);

    // Water Bowl with transparent water
    this.bowlMesh.position.set(0.55, 0.818, 0.07);
    const bowlGeo = new THREE.CylinderGeometry(0.105, 0.07, 0.065, 36, 1, true);
    const bowlPot = new THREE.Mesh(bowlGeo, new THREE.MeshStandardMaterial({ color: '#c6b58c', roughness: 0.82 }));
    bowlPot.castShadow = true;
    bowlPot.receiveShadow = true;
    this.bowlMesh.add(bowlPot);

    // Water inside bowl
    const waterGeo = new THREE.CylinderGeometry(0.098, 0.098, 0.002, 32);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: '#b3b8a2',
      roughness: 0.12,
      transmission: 0.65,
      transparent: true,
      opacity: 0.75
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 0.028;
    this.bowlMesh.add(water);

    this.group.add(this.bowlMesh);
  }

  private buildShelvesAndCeramics(): void {
    // Background Shelves
    for (const y of [1.25, 1.88]) {
      this.createBox(1.6, 0.055, 0.30, this.woodMat, 0.90, y, -1.87);
      for (const x of [0.25, 1.55]) {
        this.createBox(0.045, 0.28, 0.25, this.darkWoodMat, x, y - 0.16, -1.88);
      }

      // Static ceramic jars / vases on shelf
      const colors = ['#a4684c', '#d1c3a2', '#6a7053', '#8e7154'];
      for (let n = 0; n < 4; n++) {
        const r = 0.065 + (n % 2) * 0.025;
        const h = 0.10 + (n % 3) * 0.045;
        const pts: THREE.Vector2[] = [];
        pts.push(new THREE.Vector2(0, 0));
        pts.push(new THREE.Vector2(r * 0.7, 0));
        for (let j = 0; j <= 20; j++) {
          const t = j / 20;
          const rad = r * (0.65 + 0.35 * Math.sin(t * Math.PI) - 0.1 * t);
          pts.push(new THREE.Vector2(rad, h * t));
        }
        pts.push(new THREE.Vector2(r * 0.5, h));
        pts.push(new THREE.Vector2(0, h));

        const latheGeo = new THREE.LatheGeometry(pts, 32);
        const jarMat = new THREE.MeshStandardMaterial({ color: colors[n], roughness: 0.78 });
        const jar = new THREE.Mesh(latheGeo, jarMat);
        jar.position.set(0.30 + n * 0.38, y + 0.028, -1.85);
        jar.castShadow = true;
        jar.receiveShadow = true;
        this.group.add(jar);
      }
    }
  }

  private buildStoolAndPlant(): void {
    // 3-legged stool
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.23, 0.06, 32),
      this.woodMat
    );
    seat.position.set(-1.12, 0.49, -0.92);
    seat.castShadow = true;
    seat.receiveShadow = true;
    this.group.add(seat);

    for (let n = 0; n < 3; n++) {
      const a = (n * Math.PI * 2) / 3;
      const leg = this.createBox(
        0.045,
        0.49,
        0.045,
        this.darkWoodMat,
        -1.12 + Math.cos(a) * 0.14,
        0.245,
        -0.92 + Math.sin(a) * 0.14
      );
      leg.rotation.z = 0.08;
    }

    // Potted Olive Plant near window
    const plantGroup = new THREE.Group();
    plantGroup.position.set(-1.77, 0, -1.35);

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.135, 0.29, 32),
      new THREE.MeshStandardMaterial({ color: '#b58b69', roughness: 0.82 })
    );
    pot.position.y = 0.145;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plantGroup.add(pot);

    // Stems & Leaves
    for (let i = 0; i < 17; i++) {
      const a = i * 2.399;
      const h = 0.45 + (i % 5) * 0.13;
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.003, h, 5),
        this.oliveMat
      );
      stem.position.set(Math.sin(a) * 0.10, 0.27 + h / 2, Math.cos(a) * 0.10);
      stem.rotation.z = Math.sin(a) * 0.22;
      plantGroup.add(stem);

      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.10, 10, 8),
        this.oliveMat
      );
      leaf.scale.set(0.55, 1.7, 0.10);
      leaf.position.set(Math.sin(a) * 0.19, 0.27 + h, Math.cos(a) * 0.19);
      leaf.rotation.set(0.6, a, 0.3);
      plantGroup.add(leaf);
    }

    this.group.add(plantGroup);
  }

  public setWheelRotation(angleRad: number): void {
    this.wheelGroup.rotation.y = angleRad;
  }
}
