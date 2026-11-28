/**
 * Porto das Decisões — Cenário do Porto e Arquitetura de Diorama Artesanal
 * Cais de pedra calcária em L, deck de carvalho mel, armazéns terracota com vigas de madeira,
 * portas verdes e vermelhas, poste de ferro curvado com luz âmbar,
 * defensas, cabeços de amarração com cordas, topiárias em vasos e árvores de diorama.
 */

import * as THREE from 'three';

export class HarborEnvironment {
  public group: THREE.Group;
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.buildHarborBase();
    this.buildWarehouses();
    this.buildQuayDetails();
    this.buildDioramaBorderFoliage();
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
   * Cais contínuo em L: sai do enquadramento superior esquerdo,
   * avança na área do guindaste e recua no primeiro plano para a lancha azul flutuar
   */
  private buildHarborBase(): void {
    const stoneWallMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#E8DCC8', // Pedra calcária clara do cais
        roughness: 0.85,
        metalness: 0.04
      })
    );

    const stoneBaseMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#766B5E', // Pedra submersa escura
        roughness: 0.95,
        metalness: 0.05
      })
    );

    const woodDeckMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#C69355', // Madeira carvalho mel artesanal
        roughness: 0.72,
        metalness: 0.02
      })
    );

    const fenderWoodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#8A5832', // Madeira de proteção de borda
        roughness: 0.8,
        metalness: 0.02
      })
    );

    // 1. Bloco principal traseiro do cais (sustenta os armazéns)
    const wharfGeo = this.registerGeometry(new THREE.BoxGeometry(8.0, 1.1, 5.0));
    const wharf = new THREE.Mesh(wharfGeo, stoneWallMat);
    wharf.position.set(-6.0, 0.5, -1.5);
    wharf.castShadow = true;
    wharf.receiveShadow = true;
    this.group.add(wharf);

    const subWharfGeo = this.registerGeometry(new THREE.BoxGeometry(8.0, 1.8, 5.0));
    const subWharf = new THREE.Mesh(subWharfGeo, stoneBaseMat);
    subWharf.position.set(-6.0, -0.9, -1.5);
    this.group.add(subWharf);

    // 2. Projeção central do cais (onde o guindaste amarelo opera)
    const pierGeo = this.registerGeometry(new THREE.BoxGeometry(2.8, 1.1, 2.6));
    const pier = new THREE.Mesh(pierGeo, stoneWallMat);
    pier.position.set(-2.8, 0.5, -0.4);
    pier.castShadow = true;
    pier.receiveShadow = true;
    this.group.add(pier);

    const subPierGeo = this.registerGeometry(new THREE.BoxGeometry(2.8, 1.8, 2.6));
    const subPier = new THREE.Mesh(subPierGeo, stoneBaseMat);
    subPier.position.set(-2.8, -0.9, -0.4);
    this.group.add(subPier);

    // 3. Extensão do cais lateral para a esquerda (recuada atrás do barco azul)
    const sideWharfGeo = this.registerGeometry(new THREE.BoxGeometry(4.0, 1.1, 4.4));
    const sideWharf = new THREE.Mesh(sideWharfGeo, stoneWallMat);
    sideWharf.position.set(-6.0, 0.5, 2.7);
    sideWharf.castShadow = true;
    sideWharf.receiveShadow = true;
    this.group.add(sideWharf);

    const subSideWharfGeo = this.registerGeometry(new THREE.BoxGeometry(4.0, 1.8, 4.4));
    const subSideWharf = new THREE.Mesh(subSideWharfGeo, stoneBaseMat);
    subSideWharf.position.set(-6.0, -0.9, 2.7);
    this.group.add(subSideWharf);

    // 4. Piso do cais em madeira carvalho mel
    const deck1Geo = this.registerGeometry(new THREE.BoxGeometry(8.02, 0.06, 5.02));
    const deck1 = new THREE.Mesh(deck1Geo, woodDeckMat);
    deck1.position.set(-6.0, 1.06, -1.5);
    deck1.receiveShadow = true;
    this.group.add(deck1);

    const deck2Geo = this.registerGeometry(new THREE.BoxGeometry(2.82, 0.06, 2.62));
    const deck2 = new THREE.Mesh(deck2Geo, woodDeckMat);
    deck2.position.set(-2.8, 1.06, -0.4);
    deck2.receiveShadow = true;
    this.group.add(deck2);

    const deck3Geo = this.registerGeometry(new THREE.BoxGeometry(4.02, 0.06, 4.42));
    const deck3 = new THREE.Mesh(deck3Geo, woodDeckMat);
    deck3.position.set(-6.0, 1.06, 2.7);
    deck3.receiveShadow = true;
    this.group.add(deck3);

    // 5. Vigas de proteção de borda (fenders) ao longo da face de atracação
    const fender1Geo = this.registerGeometry(new THREE.BoxGeometry(0.14, 0.16, 2.7));
    const fender1 = new THREE.Mesh(fender1Geo, fenderWoodMat);
    fender1.position.set(-1.42, 0.95, -0.4);
    fender1.castShadow = true;
    this.group.add(fender1);

    const fender2Geo = this.registerGeometry(new THREE.BoxGeometry(2.6, 0.16, 0.14));
    const fender2 = new THREE.Mesh(fender2Geo, fenderWoodMat);
    fender2.position.set(-2.7, 0.95, 0.88);
    fender2.castShadow = true;
    this.group.add(fender2);

    const fender3Geo = this.registerGeometry(new THREE.BoxGeometry(0.14, 0.16, 3.6));
    const fender3 = new THREE.Mesh(fender3Geo, fenderWoodMat);
    fender3.position.set(-4.02, 0.95, 2.7);
    fender3.castShadow = true;
    this.group.add(fender3);

    // Estacas verticais de suporte de madeira (pilings)
    const pilingMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#543D2B', roughness: 0.9 })
    );
    const pilingsPos: [number, number][] = [
      [-1.42, -1.5], [-1.42, -0.4], [-1.42, 0.7],
      [-2.6, 0.88], [-4.02, 0.9],
      [-4.02, 2.0], [-4.02, 3.1], [-4.02, 4.2]
    ];
    pilingsPos.forEach(([px, pz]) => {
      const pGeo = this.registerGeometry(new THREE.CylinderGeometry(0.07, 0.07, 2.2, 10));
      const pMesh = new THREE.Mesh(pGeo, pilingMat);
      pMesh.position.set(px, 0.1, pz);
      pMesh.castShadow = true;
      this.group.add(pMesh);
    });
  }

  /**
   * Armazéns portuários com telhados terracota, paredes creme, portas verdes e vermelhas
   */
  private buildWarehouses(): void {
    const wallMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#EDE0CA', roughness: 0.85 })
    );
    const roofMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#C6532B', roughness: 0.65 }) // Telha terracota vibrante
    );
    const roofRidgeMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#9E3C1B', roughness: 0.6 })
    );
    const greenDoorMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#244F38', roughness: 0.55 }) // Verde floresta
    );
    const redDoorMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#A33428', roughness: 0.55 }) // Vermelho escuro
    );
    const timberBeamMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#6A4325', roughness: 0.8 })
    );

    // 1. Armazém Central (com grande porta verde corrediça)
    const wh1BodyGeo = this.registerGeometry(new THREE.BoxGeometry(2.8, 1.8, 2.4));
    const wh1Body = new THREE.Mesh(wh1BodyGeo, wallMat);
    wh1Body.position.set(-5.0, 1.96, -0.7);
    wh1Body.castShadow = true;
    wh1Body.receiveShadow = true;
    this.group.add(wh1Body);

    // Telhado de duas águas artesanal
    const roofSlope1Geo = this.registerGeometry(new THREE.BoxGeometry(1.6, 0.1, 2.6));
    roofSlope1Geo.rotateZ(0.42);
    const roofSlope1 = new THREE.Mesh(roofSlope1Geo, roofMat);
    roofSlope1.position.set(-4.35, 3.02, -0.7);
    roofSlope1.castShadow = true;
    this.group.add(roofSlope1);

    const roofSlope2Geo = this.registerGeometry(new THREE.BoxGeometry(1.6, 0.1, 2.6));
    roofSlope2Geo.rotateZ(-0.42);
    const roofSlope2 = new THREE.Mesh(roofSlope2Geo, roofMat);
    roofSlope2.position.set(-5.65, 3.02, -0.7);
    roofSlope2.castShadow = true;
    this.group.add(roofSlope2);

    const ridgeGeo = this.registerGeometry(new THREE.BoxGeometry(0.12, 0.12, 2.62));
    const ridge = new THREE.Mesh(ridgeGeo, roofRidgeMat);
    ridge.position.set(-5.0, 3.32, -0.7);
    this.group.add(ridge);

    // Grande porta verde corrediça voltada para o cais/água (+X)
    const door1Geo = this.registerGeometry(new THREE.BoxGeometry(0.08, 1.35, 1.55));
    const door1 = new THREE.Mesh(door1Geo, greenDoorMat);
    door1.position.set(-3.56, 1.74, -0.7);
    door1.castShadow = true;
    this.group.add(door1);

    const trackGeo = this.registerGeometry(new THREE.BoxGeometry(0.12, 0.08, 1.8));
    const track = new THREE.Mesh(trackGeo, timberBeamMat);
    track.position.set(-3.55, 2.46, -0.7);
    this.group.add(track);

    // 2. Armazém da Esquerda (com a porta vermelha do mockup)
    const wh2BodyGeo = this.registerGeometry(new THREE.BoxGeometry(2.4, 1.6, 2.2));
    const wh2Body = new THREE.Mesh(wh2BodyGeo, wallMat);
    wh2Body.position.set(-6.2, 1.86, 1.3);
    wh2Body.castShadow = true;
    wh2Body.receiveShadow = true;
    this.group.add(wh2Body);

    const roof2Slope1Geo = this.registerGeometry(new THREE.BoxGeometry(1.4, 0.1, 2.4));
    roof2Slope1Geo.rotateZ(0.42);
    const roof2Slope1 = new THREE.Mesh(roof2Slope1Geo, roofMat);
    roof2Slope1.position.set(-5.65, 2.82, 1.3);
    roof2Slope1.castShadow = true;
    this.group.add(roof2Slope1);

    const roof2Slope2Geo = this.registerGeometry(new THREE.BoxGeometry(1.4, 0.1, 2.4));
    roof2Slope2Geo.rotateZ(-0.42);
    const roof2Slope2 = new THREE.Mesh(roof2Slope2Geo, roofMat);
    roof2Slope2.position.set(-6.75, 2.82, 1.3);
    roof2Slope2.castShadow = true;
    this.group.add(roof2Slope2);

    const door2Geo = this.registerGeometry(new THREE.BoxGeometry(0.08, 1.25, 0.85));
    const door2 = new THREE.Mesh(door2Geo, redDoorMat);
    door2.position.set(-4.96, 1.69, 1.3);
    door2.castShadow = true;
    this.group.add(door2);

    const atticVentGeo = new THREE.CircleGeometry(0.16, 16);
    const atticVentMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#27272A', roughness: 0.9 })
    );
    const vent = new THREE.Mesh(atticVentGeo, atticVentMat);
    vent.position.set(-4.95, 2.38, 1.3);
    vent.rotateY(Math.PI / 2);
    this.group.add(vent);
  }

  /**
   * Detalhes do cais: poste de ferro curvado, cabeços com cordas, topiárias em vasos e caixas empilhadas
   */
  private buildQuayDetails(): void {
    const bollardMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.45, metalness: 0.75 })
    );
    const ropeMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#C8A878', roughness: 0.95 })
    );
    const lampMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#242424', roughness: 0.4, metalness: 0.65 })
    );
    const lanternGlowMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#FFF2C6',
        emissive: '#FFBA42',
        emissiveIntensity: 0.9,
        roughness: 0.25
      })
    );

    // Cabeços de amarração (bollards) com corda enrolada na base
    const bollardCoords: [number, number][] = [
      [-1.5, 0.6],
      [-1.5, -0.6],
      [-2.6, 0.8],
      [-4.2, 1.2],
      [-4.2, 2.4],
      [-4.2, 3.6]
    ];
    bollardCoords.forEach(([bx, bz]) => {
      const bPost = this.registerGeometry(new THREE.CylinderGeometry(0.07, 0.09, 0.24, 12));
      const bHead = this.registerGeometry(new THREE.SphereGeometry(0.09, 12, 12));
      const postMesh = new THREE.Mesh(bPost, bollardMat);
      const headMesh = new THREE.Mesh(bHead, bollardMat);
      postMesh.position.set(bx, 1.18, bz);
      headMesh.position.set(bx, 1.3, bz);
      postMesh.castShadow = true;

      const ropeRingGeo = this.registerGeometry(new THREE.TorusGeometry(0.11, 0.035, 8, 16));
      ropeRingGeo.rotateX(Math.PI / 2);
      const ropeRing = new THREE.Mesh(ropeRingGeo, ropeMat);
      ropeRing.position.set(bx, 1.09, bz);

      this.group.add(postMesh);
      this.group.add(headMesh);
      this.group.add(ropeRing);
    });

    // Poste de ferro curvado vintage (idêntico ao cais do mockup)
    const lampX = -4.6;
    const lampZ = 1.8;
    const poleGeo = this.registerGeometry(new THREE.CylinderGeometry(0.035, 0.045, 1.35, 10));
    const poleMesh = new THREE.Mesh(poleGeo, lampMat);
    poleMesh.position.set(lampX, 1.73, lampZ);
    poleMesh.castShadow = true;
    this.group.add(poleMesh);

    const armGeo = this.registerGeometry(new THREE.TorusGeometry(0.16, 0.025, 8, 14, Math.PI * 0.75));
    const armMesh = new THREE.Mesh(armGeo, lampMat);
    armMesh.position.set(lampX + 0.08, 2.38, lampZ);
    armMesh.rotation.z = Math.PI / 4;
    this.group.add(armMesh);

    const lanternGeo = this.registerGeometry(new THREE.CylinderGeometry(0.07, 0.05, 0.15, 8));
    const lanternMesh = new THREE.Mesh(lanternGeo, lanternGlowMat);
    lanternMesh.position.set(lampX + 0.18, 2.26, lampZ);
    this.group.add(lanternMesh);

    const lampLight = new THREE.PointLight('#FFE2A0', 0.85, 4.0);
    lampLight.position.set(lampX + 0.18, 2.22, lampZ);
    this.group.add(lampLight);

    // Topiárias em vasos de terracota (como no mockup)
    this.createPottedTopiary(-5.2, 2.8);
    this.createPottedTopiary(-7.0, 2.4);

    // Pilhas de caixas de madeira no cais
    this.createCrateStack(-2.8, -0.9, 4); // Perto do guindaste
    this.createCrateStack(-4.0, 0.2, 3);  // Frente do armazém
    this.createSingleCrate(-4.8, 1.4);     // Perto do poste
  }

  private createPottedTopiary(x: number, z: number): void {
    const potMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#A8552D', roughness: 0.75 })
    );
    const foliageMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#3F6A32', roughness: 0.9 })
    );

    const potGeo = this.registerGeometry(new THREE.CylinderGeometry(0.22, 0.16, 0.38, 12));
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(x, 1.25, z);
    pot.castShadow = true;
    this.group.add(pot);

    const foliageGeo = this.registerGeometry(new THREE.SphereGeometry(0.36, 12, 12));
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(x, 1.64, z);
    foliage.castShadow = true;
    this.group.add(foliage);
  }

  private createSingleCrate(x: number, z: number): void {
    const crateMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#C28E53', roughness: 0.7 })
    );
    const crateGeo = this.registerGeometry(new THREE.BoxGeometry(0.38, 0.38, 0.38));
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.set(x, 1.25, z);
    crate.rotation.y = 0.15;
    crate.castShadow = true;
    crate.receiveShadow = true;
    this.group.add(crate);
  }

  private createCrateStack(baseX: number, baseZ: number, count: number = 3): void {
    const crateMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#C28E53', roughness: 0.7 })
    );
    const crateGeo = this.registerGeometry(new THREE.BoxGeometry(0.38, 0.38, 0.38));

    const c1 = new THREE.Mesh(crateGeo, crateMat);
    c1.position.set(baseX, 1.25, baseZ);
    c1.rotation.y = 0.05;
    c1.castShadow = true;
    this.group.add(c1);

    const c2 = new THREE.Mesh(crateGeo, crateMat);
    c2.position.set(baseX + 0.42, 1.25, baseZ + 0.03);
    c2.rotation.y = -0.08;
    c2.castShadow = true;
    this.group.add(c2);

    const c3 = new THREE.Mesh(crateGeo, crateMat);
    c3.position.set(baseX + 0.18, 1.63, baseZ + 0.02);
    c3.rotation.y = 0.12;
    c3.castShadow = true;
    this.group.add(c3);

    if (count >= 4) {
      const c4 = new THREE.Mesh(crateGeo, crateMat);
      c4.position.set(baseX - 0.38, 1.25, baseZ - 0.05);
      c4.rotation.y = 0.2;
      c4.castShadow = true;
      this.group.add(c4);
    }
  }

  /**
   * Árvores de diorama no canto inferior direito (idênticas às do mockup)
   */
  private buildDioramaBorderFoliage(): void {
    const treeMat1 = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#3A6836', roughness: 0.9 })
    );
    const treeMat2 = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#4D7D44', roughness: 0.9 })
    );

    const treePositions: [number, number, number, number][] = [
      [2.6, 3.4, 0.55, 0],
      [3.2, 3.0, 0.68, 1],
      [3.0, 4.0, 0.5, 0],
      [3.8, 3.6, 0.62, 1]
    ];

    treePositions.forEach(([tx, tz, scale, matIdx]) => {
      const geo = this.registerGeometry(new THREE.SphereGeometry(scale, 12, 12));
      const mesh = new THREE.Mesh(geo, matIdx === 0 ? treeMat1 : treeMat2);
      mesh.position.set(tx, scale * 0.7, tz);
      mesh.scale.set(1.0, 1.25, 1.0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    });
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
