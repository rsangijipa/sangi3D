/**
 * Laboratório de Camadas Sonoras — Cenário da Bancada e Parede Perfurada
 * Bancada de carvalho mel, pegboard perfurado, janela arqueada com vista externa, bandeirolas e placa
 */

import * as THREE from 'three';

export class WorkbenchEnvironment {
  public group: THREE.Group;
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildWorkbenchTable();
    this.buildPegboardWall();
    this.buildArchedWindow();
    this.buildTitlePlaque();
  }

  private registerMaterial<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private registerGeometry<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  /**
   * 1. Bancada de madeira (carvalho mel) onde repousa o mixer e as redomas
   */
  private buildWorkbenchTable(): void {
    const tableWoodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#C68D51', // Carvalho mel artesanal
        roughness: 0.68,
        metalness: 0.05
      })
    );

    const feltMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#556B2F', // Feltro verde musgo sob a mesa de som
        roughness: 0.92,
        metalness: 0.0
      })
    );

    // Tampo principal da bancada
    const tableTopGeo = this.registerGeometry(new THREE.BoxGeometry(10.0, 0.4, 5.0));
    const tableTop = new THREE.Mesh(tableTopGeo, tableWoodMat);
    tableTop.position.set(0, -0.2, 0.5);
    tableTop.receiveShadow = true;
    this.group.add(tableTop);

    // Tapete de feltro verde musgo sob o mixer
    const feltPadGeo = this.registerGeometry(new THREE.BoxGeometry(4.8, 0.02, 2.6));
    const feltPad = new THREE.Mesh(feltPadGeo, feltMat);
    feltPad.position.set(0, 0.01, 0.55);
    feltPad.receiveShadow = true;
    this.group.add(feltPad);

    // Prateleira de madeira ao fundo
    const shelfGeo = this.registerGeometry(new THREE.BoxGeometry(10.0, 0.16, 0.8));
    const shelf = new THREE.Mesh(shelfGeo, tableWoodMat);
    shelf.position.set(0, 0.28, -1.2);
    shelf.receiveShadow = true;
    shelf.castShadow = true;
    this.group.add(shelf);
  }

  /**
   * 2. Parede perfurada de madeira (pegboard) com grade de furos estilizados
   */
  private buildPegboardWall(): void {
    const pegboardMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#D8B17A', // Madeira clara de pegboard com furos
        roughness: 0.8,
        metalness: 0.02
      })
    );

    const holeMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#5C442A', // Sombra interna dos furos
        roughness: 0.9
      })
    );

    // Painel principal traseiro
    const wallGeo = this.registerGeometry(new THREE.BoxGeometry(10.0, 4.5, 0.15));
    const wall = new THREE.Mesh(wallGeo, pegboardMat);
    wall.position.set(0, 2.2, -1.6);
    wall.receiveShadow = true;
    this.group.add(wall);

    // Matriz de furos perfurados decorativos (instanciados para alta performance)
    const holeGeo = this.registerGeometry(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8));
    holeGeo.rotateX(Math.PI / 2);

    const cols = 26;
    const rows = 12;
    const startX = -4.2;
    const startY = 0.6;
    const stepX = 0.34;
    const stepY = 0.30;

    const holeInstanced = new THREE.InstancedMesh(holeGeo, holeMat, cols * rows);
    const dummy = new THREE.Object3D();
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * stepX;
        const y = startY + r * stepY;
        // Pular área central da janela arqueada
        if (x > -1.6 && x < 1.6 && y > 1.0 && y < 3.2) {
          continue;
        }
        dummy.position.set(x, y, -1.52);
        dummy.updateMatrix();
        holeInstanced.setMatrixAt(idx++, dummy.matrix);
      }
    }
    holeInstanced.count = idx;
    holeInstanced.instanceMatrix.needsUpdate = true;
    this.group.add(holeInstanced);
  }

  /**
   * 3. Janela arqueada central com vista para árvores e bandeirolas de tecido
   */
  private buildArchedWindow(): void {
    const frameMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#A06B3E', roughness: 0.65 }) // Madeira do caixilho
    );

    const outsideMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#88B272', // Folhagens verdes ao ar livre
        roughness: 0.9,
        emissive: '#A3D48D',
        emissiveIntensity: 0.2
      })
    );

    // Fundo iluminado externo da janela
    const bgGeo = this.registerGeometry(new THREE.PlaneGeometry(3.0, 2.2));
    const bg = new THREE.Mesh(bgGeo, outsideMat);
    bg.position.set(0, 2.2, -1.58);
    this.group.add(bg);

    // Caixilho de madeira em arco
    const frameBottomGeo = this.registerGeometry(new THREE.BoxGeometry(2.8, 0.12, 0.22));
    const frameBottom = new THREE.Mesh(frameBottomGeo, frameMat);
    frameBottom.position.set(0, 1.2, -1.5);
    this.group.add(frameBottom);

    const frameLeftGeo = this.registerGeometry(new THREE.BoxGeometry(0.12, 1.3, 0.22));
    const frameLeft = new THREE.Mesh(frameLeftGeo, frameMat);
    frameLeft.position.set(-1.34, 1.85, -1.5);
    this.group.add(frameLeft);

    const frameRight = new THREE.Mesh(frameLeftGeo, frameMat);
    frameRight.position.set(1.34, 1.85, -1.5);
    this.group.add(frameRight);

    // Arco superior
    const archGeo = this.registerGeometry(new THREE.TorusGeometry(1.34, 0.08, 8, 24, Math.PI));
    const arch = new THREE.Mesh(archGeo, frameMat);
    arch.position.set(0, 2.45, -1.5);
    this.group.add(arch);

    // Bandeirolas de tecido penduradas no arco (como no mockup!)
    const buntingColors = ['#D97706', '#2F684B', '#FAF5EE', '#BF5730', '#556B2F'];
    for (let b = 0; b < 5; b++) {
      const bGeo = this.registerGeometry(new THREE.ConeGeometry(0.15, 0.24, 3));
      bGeo.rotateZ(Math.PI);
      const bMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: buntingColors[b % buntingColors.length],
          roughness: 0.85
        })
      );
      const bMesh = new THREE.Mesh(bGeo, bMat);
      const bx = -0.8 + b * 0.4;
      const by = 2.4 - Math.sin((b / 4) * Math.PI) * 0.12;
      bMesh.position.set(bx, by, -1.45);
      this.group.add(bMesh);
    }
  }

  /**
   * 4. Placa superior suspensa no pegboard com feltro e texto do mockup
   */
  private buildTitlePlaque(): void {
    const plaqueWoodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#A06B3E', roughness: 0.6 })
    );
    const feltGreenMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#254533', roughness: 0.9 })
    );

    // Moldura de madeira da placa
    const plaqueGeo = this.registerGeometry(new THREE.BoxGeometry(4.2, 0.65, 0.08));
    const plaque = new THREE.Mesh(plaqueGeo, plaqueWoodMat);
    plaque.position.set(0, 3.4, -1.5);
    plaque.castShadow = true;
    this.group.add(plaque);

    // Inset de feltro verde escuro costurado
    const insetGeo = this.registerGeometry(new THREE.BoxGeometry(4.0, 0.48, 0.09));
    const inset = new THREE.Mesh(insetGeo, feltGreenMat);
    inset.position.set(0, 3.4, -1.49);
    this.group.add(inset);
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
