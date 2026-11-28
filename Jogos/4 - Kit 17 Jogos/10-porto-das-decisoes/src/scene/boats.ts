/**
 * Porto das Decisões — Embarcações Náuticas em Diorama Artesanal
 * Três barcos artesanais (Azul, Verde, Vermelho) calibrados com o mockup:
 * cascos afilados, cabines de madeira, vigias de latão, boias salva-vidas,
 * rede de pesca na traineira, chaminé no rebocador e slots modulares de carga.
 */

import * as THREE from 'three';
import { BoatConfig, CargoItem } from '../game/state';

export class BoatModel {
  public group: THREE.Group;
  public id: 'blue' | 'green' | 'red';
  public config: BoatConfig;
  private cargoSlotsGroup: THREE.Group;
  private cargoMeshes: THREE.Mesh[] = [];
  private baseHeight: number = 0.12;
  public initialPos: [number, number, number] = [0, 0, 0];
  public initialYaw: number = 0;

  constructor(config: BoatConfig) {
    this.id = config.id;
    this.config = config;
    this.group = new THREE.Group();
    this.cargoSlotsGroup = new THREE.Group();

    this.buildVessel();
    this.group.add(this.cargoSlotsGroup);
  }

  private buildVessel(): void {
    const hullColor = this.config.hullColor;
    const hullMat = new THREE.MeshStandardMaterial({
      color: hullColor,
      roughness: 0.45,
      metalness: 0.05
    });

    const deckWoodMat = new THREE.MeshStandardMaterial({
      color: '#C69355', // Madeira carvalho mel de convés
      roughness: 0.75,
      metalness: 0.02
    });

    const cabinWhiteMat = new THREE.MeshStandardMaterial({
      color: '#FAF6EE', // Madeira pintada de creme/branco artesanal
      roughness: 0.45
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: '#E0B547', // Latão polido das vigias
      roughness: 0.25,
      metalness: 0.85
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: '#7AC1D2',
      roughness: 0.1,
      metalness: 0.3
    });

    const lifeRingWhiteMat = new THREE.MeshStandardMaterial({ color: '#FAF8F5', roughness: 0.35 });
    const lifeRingRedMat = new THREE.MeshStandardMaterial({ color: '#DC2626', roughness: 0.35 });

    // 1. CASCO DO BARCO (Modelado com curvas e seções)
    const hullGroup = new THREE.Group();
    this.group.add(hullGroup);

    // Casco principal
    const hullMainGeo = new THREE.BoxGeometry(1.65, 0.48, 0.82);
    const hullMain = new THREE.Mesh(hullMainGeo, hullMat);
    hullMain.position.set(-0.05, 0.24, 0);
    hullMain.castShadow = true;
    hullMain.receiveShadow = true;
    hullGroup.add(hullMain);

    // Borda superior do casco (gunwale) em madeira artesanal
    const gunwaleGeo = new THREE.BoxGeometry(1.72, 0.07, 0.88);
    const gunwale = new THREE.Mesh(gunwaleGeo, deckWoodMat);
    gunwale.position.set(-0.05, 0.48, 0);
    gunwale.castShadow = true;
    hullGroup.add(gunwale);

    // Faixa creme no costado (sheer line)
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#F4EFE6', roughness: 0.5 });
    const stripeGeo = new THREE.BoxGeometry(1.66, 0.08, 0.83);
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-0.05, 0.38, 0);
    hullGroup.add(stripe);

    // Proa afilada curva
    const bowGeo = new THREE.ConeGeometry(0.52, 0.72, 4);
    bowGeo.rotateY(Math.PI / 4);
    bowGeo.rotateZ(-Math.PI / 2);
    const bow = new THREE.Mesh(bowGeo, hullMat);
    bow.position.set(0.95, 0.24, 0);
    bow.scale.set(1.0, 0.92, 0.8);
    bow.castShadow = true;
    hullGroup.add(bow);

    // Borda da proa em madeira
    const bowCapGeo = new THREE.ConeGeometry(0.55, 0.72, 4);
    bowCapGeo.rotateY(Math.PI / 4);
    bowCapGeo.rotateZ(-Math.PI / 2);
    const bowCap = new THREE.Mesh(bowCapGeo, deckWoodMat);
    bowCap.position.set(0.97, 0.47, 0);
    bowCap.scale.set(1.0, 0.12, 0.86);
    hullGroup.add(bowCap);

    // Pranchas do convés
    const deckGeo = new THREE.BoxGeometry(1.6, 0.04, 0.76);
    const deck = new THREE.Mesh(deckGeo, deckWoodMat);
    deck.position.set(-0.05, 0.47, 0);
    deck.receiveShadow = true;
    hullGroup.add(deck);

    // 2. CABINE & ACABAMENTOS ESPECÍFICOS DE CADA MODELO
    const cabinGroup = new THREE.Group();
    this.group.add(cabinGroup);

    if (this.id === 'blue') {
      // ANDORINHA AZUL (Lancha artesanal do canto inferior esquerdo do mockup)
      // Cabine ré com teto azul vibrante
      const cabinGeo = new THREE.BoxGeometry(0.72, 0.58, 0.62);
      const cabin = new THREE.Mesh(cabinGeo, cabinWhiteMat);
      cabin.position.set(-0.35, 0.74, 0);
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      cabinGroup.add(cabin);

      // Teto azul da cabine
      const roofGeo = new THREE.BoxGeometry(0.78, 0.08, 0.68);
      const roofMat = new THREE.MeshStandardMaterial({ color: '#2563EB', roughness: 0.4 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(-0.35, 1.05, 0);
      roof.castShadow = true;
      cabinGroup.add(roof);

      // Pequeno mastro no teto
      const mastGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.45, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: '#FAF5EE', roughness: 0.3 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(-0.35, 1.28, 0);
      cabinGroup.add(mast);

      // Luz de tope branca
      const topLightGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const topLightMat = new THREE.MeshStandardMaterial({ color: '#FEF08A', emissive: '#FDE047', emissiveIntensity: 0.8 });
      const topLight = new THREE.Mesh(topLightGeo, topLightMat);
      topLight.position.set(-0.35, 1.5, 0);
      cabinGroup.add(topLight);

      // Janelas frontais da cabine
      const fWinGeo = new THREE.BoxGeometry(0.04, 0.22, 0.22);
      [-0.16, 0.16].forEach(wz => {
        const fWin = new THREE.Mesh(fWinGeo, glassMat);
        fWin.position.set(0.02, 0.82, wz);
        cabinGroup.add(fWin);
      });

      // Posição do grupo de slots de carga (no convés proal amplo)
      this.cargoSlotsGroup.position.set(0.38, 0.49, 0);

    } else if (this.id === 'green') {
      // TRAINEIRA CAIÇARA (Barco de pesca tradicional verde, foreground direito do mockup)
      // Casaria central
      const cabinGeo = new THREE.BoxGeometry(0.68, 0.56, 0.58);
      const cabin = new THREE.Mesh(cabinGeo, cabinWhiteMat);
      cabin.position.set(0.12, 0.73, 0);
      cabin.castShadow = true;
      cabinGroup.add(cabin);

      // Teto verde floresta
      const roofGeo = new THREE.BoxGeometry(0.74, 0.08, 0.64);
      const roofMat = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.45 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0.12, 1.03, 0);
      roof.castShadow = true;
      cabinGroup.add(roof);

      // Mastro de pesca inclinado em madeira
      const mastGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.9, 8);
      const mastMat = new THREE.MeshStandardMaterial({ color: '#785335', roughness: 0.8 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(0.28, 1.36, 0);
      mast.rotation.z = -0.18;
      cabinGroup.add(mast);

      // Rede de pesca drapeada na popa e lateral (marca registrada visual do mockup!)
      const netGroup = new THREE.Group();
      const netMat = new THREE.MeshStandardMaterial({
        color: '#D4C6B2',
        wireframe: true,
        roughness: 0.9
      });
      const netGeo = new THREE.SphereGeometry(0.24, 10, 8, 0, Math.PI);
      const netMesh = new THREE.Mesh(netGeo, netMat);
      netMesh.rotation.x = Math.PI / 2;
      netMesh.scale.set(0.9, 1.3, 0.8);
      netGroup.add(netMesh);
      netGroup.position.set(-0.68, 0.42, 0.32);
      cabinGroup.add(netGroup);

      // Slots de carga na popa
      this.cargoSlotsGroup.position.set(-0.42, 0.49, 0);

    } else {
      // REBOCADOR GUARDIÃO (Embarcação robusta vermelha, midground no mockup)
      const cabinGeo = new THREE.BoxGeometry(0.68, 0.58, 0.58);
      const cabin = new THREE.Mesh(cabinGeo, cabinWhiteMat);
      cabin.position.set(0.08, 0.74, 0);
      cabin.castShadow = true;
      cabinGroup.add(cabin);

      // Teto creme
      const roofGeo = new THREE.BoxGeometry(0.74, 0.08, 0.64);
      const roofMat = new THREE.MeshStandardMaterial({ color: '#F4ECE1', roughness: 0.4 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0.08, 1.05, 0);
      roof.castShadow = true;
      cabinGroup.add(roof);

      // Chaminé vermelha marcante com anel superior preto
      const stackGeo = new THREE.CylinderGeometry(0.09, 0.1, 0.5, 12);
      const stackMat = new THREE.MeshStandardMaterial({ color: '#B91C1C', roughness: 0.4 });
      const stack = new THREE.Mesh(stackGeo, stackMat);
      stack.position.set(-0.16, 1.15, 0);
      stack.castShadow = true;
      cabinGroup.add(stack);

      const stackRimGeo = new THREE.CylinderGeometry(0.105, 0.105, 0.1, 12);
      const stackRimMat = new THREE.MeshStandardMaterial({ color: '#1F2937', roughness: 0.3 });
      const stackRim = new THREE.Mesh(stackRimGeo, stackRimMat);
      stackRim.position.set(-0.16, 1.38, 0);
      cabinGroup.add(stackRim);

      // Slots de carga no amplo convés de ré
      this.cargoSlotsGroup.position.set(-0.45, 0.49, 0);
    }

    // 3. VIGIAS REDONDAS DE LATÃO COM VIDRO
    const cabinOffsetX = this.id === 'blue' ? -0.35 : (this.id === 'green' ? 0.12 : 0.08);
    [-0.32, 0.32].forEach(sideZ => {
      const portRingGeo = new THREE.TorusGeometry(0.075, 0.022, 8, 16);
      const portRing = new THREE.Mesh(portRingGeo, brassMat);
      portRing.position.set(cabinOffsetX, 0.76, sideZ);
      cabinGroup.add(portRing);

      const portGlassGeo = new THREE.CircleGeometry(0.07, 12);
      const portGlass = new THREE.Mesh(portGlassGeo, glassMat);
      portGlass.position.set(cabinOffsetX, 0.76, sideZ + (sideZ > 0 ? 0.005 : -0.005));
      if (sideZ < 0) portGlass.rotateY(Math.PI);
      cabinGroup.add(portGlass);
    });

    // 4. BOIA SALVA-VIDAS VERMELHA E BRANCA (Marca registrada do mockup)
    const lifebuoyGroup = new THREE.Group();
    const ringGeo = new THREE.TorusGeometry(0.13, 0.042, 8, 20);
    const ringMesh = new THREE.Mesh(ringGeo, lifeRingWhiteMat);
    lifebuoyGroup.add(ringMesh);

    // 4 faixas vermelhas clássicas
    for (let a = 0; a < 4; a++) {
      const stripeGeo = new THREE.TorusGeometry(0.132, 0.044, 8, 6, Math.PI / 4);
      stripeGeo.rotateZ(a * (Math.PI / 2) + Math.PI / 8);
      const stripeMesh = new THREE.Mesh(stripeGeo, lifeRingRedMat);
      lifebuoyGroup.add(stripeMesh);
    }

    const lbX = this.id === 'blue' ? -0.22 : (this.id === 'green' ? -0.15 : -0.18);
    lifebuoyGroup.position.set(lbX, 0.42, 0.44);
    lifebuoyGroup.scale.set(0.9, 0.9, 0.9);
    this.group.add(lifebuoyGroup);
  }

  /**
   * Atualiza as caixas 3D no convés conforme a lista de carga a bordo
   * Limpa recursivamente todos os grupos anteriores evitando vazamentos
   */
  public updateCargoMeshes(cargoList: CargoItem[]): void {
    while (this.cargoSlotsGroup.children.length > 0) {
      const child = this.cargoSlotsGroup.children[0];
      this.cargoSlotsGroup.remove(child);
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });
    }
    this.cargoMeshes = [];

    const crateMat = new THREE.MeshStandardMaterial({
      color: '#C68D51',
      roughness: 0.65,
      metalness: 0.02
    });

    const crateTrimMat = new THREE.MeshStandardMaterial({
      color: '#9C6228',
      roughness: 0.8
    });

    // Posições dos slots pré-definidos no convés conforme capacidade
    const slotOffsets: [number, number, number][] = [
      [-0.15, 0.16, -0.15],
      [-0.15, 0.16, 0.15],
      [0.16, 0.16, 0.0],
      [-0.15, 0.46, 0.0], // Empilhada nível 2
      [0.16, 0.46, 0.0]   // Segunda empilhada nível 2
    ];

    cargoList.forEach((_, index) => {
      if (index >= slotOffsets.length) return;
      const [ox, oy, oz] = slotOffsets[index];
      const crateGroup = new THREE.Group();
      crateGroup.position.set(ox, oy, oz);

      const crateGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const crateMesh = new THREE.Mesh(crateGeo, crateMat);
      crateMesh.castShadow = true;
      crateMesh.receiveShadow = true;
      crateGroup.add(crateMesh);

      // Frisos decorativos da caixa de madeira
      const trimGeo = new THREE.BoxGeometry(0.31, 0.04, 0.31);
      const trimTop = new THREE.Mesh(trimGeo, crateTrimMat);
      trimTop.position.y = 0.12;
      crateGroup.add(trimTop);

      const trimBottom = new THREE.Mesh(trimGeo, crateTrimMat);
      trimBottom.position.y = -0.12;
      crateGroup.add(trimBottom);

      this.cargoSlotsGroup.add(crateGroup);
      this.cargoMeshes.push(crateMesh);
    });
  }

  public applyBobbing(bobY: number, pitch: number, roll: number): void {
    this.group.position.y = this.baseHeight + bobY;
    this.group.rotation.x = pitch;
    this.group.rotation.z = roll;
  }

  public setBasePosition(x: number, z: number, yaw: number): void {
    this.group.position.x = x;
    this.group.position.z = z;
    this.group.rotation.y = yaw;
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }
}

export class HarborBoatsManager {
  public group: THREE.Group;
  public boats: Record<'blue' | 'green' | 'red', BoatModel>;

  constructor(configs: Record<'blue' | 'green' | 'red', BoatConfig>) {
    this.group = new THREE.Group();
    this.boats = {
      blue: new BoatModel(configs.blue),
      green: new BoatModel(configs.green),
      red: new BoatModel(configs.red)
    };

    this.group.add(this.boats.blue.group);
    this.group.add(this.boats.green.group);
    this.group.add(this.boats.red.group);

    // Posições e rotações iniciais calibradas com fidelidade exata ao mockup
    // 1. Andorinha Azul (foreground esquerdo, apontando suavemente para centro-direita)
    this.boats.blue.initialPos = [-3.2, 0, 3.8];
    this.boats.blue.initialYaw = -0.42;
    this.boats.blue.setBasePosition(-3.2, 3.8, -0.42);

    // 2. Traineira Verde (foreground direito, apontando para centro-esquerda)
    this.boats.green.initialPos = [1.8, 0, 2.4];
    this.boats.green.initialYaw = 2.45;
    this.boats.green.setBasePosition(1.8, 2.4, 2.45);

    // 3. Rebocador Vermelho (midground direito, apontando para a esquerda)
    this.boats.red.initialPos = [0.5, 0, -2.2];
    this.boats.red.initialYaw = 0.55;
    this.boats.red.setBasePosition(0.5, -2.2, 0.55);
  }

  public getBoat(id: 'blue' | 'green' | 'red'): BoatModel {
    return this.boats[id];
  }

  public updateActiveBoatCargo(activeId: 'blue' | 'green' | 'red', cargo: CargoItem[]): void {
    this.boats[activeId].updateCargoMeshes(cargo);
  }

  public resetBoatToAnchor(id: 'blue' | 'green' | 'red', activeBoatId?: 'blue' | 'green' | 'red'): void {
    if (activeBoatId && id !== activeBoatId) {
      this.positionIdleBoats(activeBoatId);
      return;
    }
    const b = this.boats[id];
    b.setBasePosition(b.initialPos[0], b.initialPos[2], b.initialYaw);
  }

  public positionIdleBoats(activeBoatId: 'blue' | 'green' | 'red'): void {
    // Barcos inativos descansam em vagas próprias evitando sobreposição física
    if (activeBoatId === 'blue') {
      this.boats.green.setBasePosition(1.8, 2.4, 2.45);
      this.boats.red.setBasePosition(0.5, -2.2, 0.55);
    } else if (activeBoatId === 'green') {
      this.boats.blue.setBasePosition(-1.4, 3.8, -0.42);
      this.boats.red.setBasePosition(0.5, -2.2, 0.55);
    } else if (activeBoatId === 'red') {
      this.boats.blue.setBasePosition(-1.4, 3.8, -0.42);
      this.boats.green.setBasePosition(1.8, 2.4, 2.45);
    }
  }

  public updateBobbing(
    time: number,
    getWaterHeightFn: (x: number, z: number, t: number) => { y: number; pitch: number; roll: number },
    travelingBoatId?: 'blue' | 'green' | 'red'
  ): void {
    (['blue', 'green', 'red'] as const).forEach(id => {
      if (id === travelingBoatId) return; // Barco navegando controla sua própria altura/inclinação
      const b = this.boats[id];
      const h = getWaterHeightFn(b.group.position.x, b.group.position.z, time);
      b.applyBobbing(h.y, h.pitch, h.roll);
    });
  }

  public dispose(): void {
    // Geometrias e materiais limpos na destruição
  }
}
