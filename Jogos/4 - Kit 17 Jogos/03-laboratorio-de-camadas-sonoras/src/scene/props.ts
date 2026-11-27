/**
 * Laboratório de Camadas Sonoras — Acessórios e Cenografia da Bancada
 * Luminária articulada (desk_lamp), microfone de estúdio (microphone_prop),
 * caneca de cerâmica, livros encadernados, vasos de plantas e bloco de anotações
 */

import * as THREE from 'three';

export class StudioProps {
  public group: THREE.Group;
  public lampLight: THREE.PointLight;
  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.lampLight = new THREE.PointLight('#FFE2A3', 1.8, 6.0);

    this.buildDeskLamp();
    this.buildVintageMicrophone();
    this.buildBookshelfItems();
    this.buildDeskAccessories();
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
   * 1. Luminária de mesa articulada de metal (desk_lamp) no canto esquerdo
   */
  private buildDeskLamp(): void {
    const lampMetalMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#D8D8D8', // Alumínio escovado / aço fosco
        roughness: 0.35,
        metalness: 0.8
      })
    );

    const lampBulbMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#FFF2C6',
        emissive: '#FFB84D',
        emissiveIntensity: 2.2,
        roughness: 0.2
      })
    );

    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2.7, 0.05, -0.1);

    // Base circular pesada
    const baseGeo = this.registerGeometry(new THREE.CylinderGeometry(0.32, 0.36, 0.08, 24));
    const base = new THREE.Mesh(baseGeo, lampMetalMat);
    base.castShadow = true;
    lampGroup.add(base);

    // Braço inferior articulado inclinado para a direita
    const lowerArmGeo = this.registerGeometry(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8));
    const lowerArm = new THREE.Mesh(lowerArmGeo, lampMetalMat);
    lowerArm.position.set(0.18, 0.6, 0);
    lowerArm.rotation.z = -0.32;
    lowerArm.castShadow = true;
    lampGroup.add(lowerArm);

    // Junta articulada intermediária
    const jointGeo = this.registerGeometry(new THREE.SphereGeometry(0.05, 12, 12));
    const joint = new THREE.Mesh(jointGeo, lampMetalMat);
    joint.position.set(0.36, 1.15, 0);
    lampGroup.add(joint);

    // Braço superior inclinado para a frente/centro
    const upperArmGeo = this.registerGeometry(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8));
    const upperArm = new THREE.Mesh(upperArmGeo, lampMetalMat);
    upperArm.position.set(0.68, 1.35, 0.1);
    upperArm.rotation.z = -1.05;
    upperArm.castShadow = true;
    lampGroup.add(upperArm);

    // Cúpula cônica da lâmpada apontando para a mesa e redomas
    const shadeGeo = this.registerGeometry(new THREE.ConeGeometry(0.28, 0.38, 24, 1, true));
    shadeGeo.rotateZ(Math.PI * 0.65);
    shadeGeo.rotateY(Math.PI * 0.15);
    const shade = new THREE.Mesh(shadeGeo, lampMetalMat);
    shade.position.set(1.05, 1.45, 0.15);
    shade.castShadow = true;
    lampGroup.add(shade);

    // Lâmpada brilhante interna
    const bulbGeo = this.registerGeometry(new THREE.SphereGeometry(0.08, 12, 12));
    const bulb = new THREE.Mesh(bulbGeo, lampBulbMat);
    bulb.position.set(1.0, 1.42, 0.15);
    lampGroup.add(bulb);

    // Luz pontual motivada da lâmpada
    this.lampLight.position.set(1.0, 1.4, 0.2);
    this.lampLight.castShadow = true;
    this.lampLight.shadow.mapSize.width = 1024;
    this.lampLight.shadow.mapSize.height = 1024;
    this.lampLight.shadow.bias = -0.001;
    lampGroup.add(this.lampLight);

    this.group.add(lampGroup);
  }

  /**
   * 2. Microfone de estúdio condensador vintage (microphone_prop) desligado no canto direito
   */
  private buildVintageMicrophone(): void {
    const micDarkMetalMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.5, metalness: 0.7 })
    );
    const micGrilleMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#C0C0C0', // Grelha de malha prateada
        roughness: 0.3,
        metalness: 0.85,
        wireframe: false
      })
    );

    const micGroup = new THREE.Group();
    micGroup.position.set(2.8, 0.28, -0.7);

    // Base redonda do suporte
    const baseGeo = this.registerGeometry(new THREE.CylinderGeometry(0.24, 0.26, 0.05, 16));
    const base = new THREE.Mesh(baseGeo, micDarkMetalMat);
    base.castShadow = true;
    micGroup.add(base);

    // Haste vertical
    const poleGeo = this.registerGeometry(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8));
    const pole = new THREE.Mesh(poleGeo, micDarkMetalMat);
    pole.position.y = 0.3;
    micGroup.add(pole);

    // Anel de suspensão elástica (shockmount)
    const ringGeo = this.registerGeometry(new THREE.TorusGeometry(0.16, 0.015, 8, 24));
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, micDarkMetalMat);
    ring.position.y = 0.58;
    micGroup.add(ring);

    // Cápsula cilíndrica com topo arredondado (corpo do microfone)
    const micBodyGeo = this.registerGeometry(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 16));
    const micBody = new THREE.Mesh(micBodyGeo, micGrilleMat);
    micBody.position.y = 0.65;
    micBody.castShadow = true;
    micGroup.add(micBody);

    const micDomeGeo = this.registerGeometry(new THREE.SphereGeometry(0.09, 16, 12));
    const micDome = new THREE.Mesh(micDomeGeo, micGrilleMat);
    micDome.position.y = 0.8;
    micDome.castShadow = true;
    micGroup.add(micDome);

    this.group.add(micGroup);
  }

  /**
   * 3. Itens na prateleira esquerda: livros encadernados, brinquedo arco-íris e planta
   */
  private buildBookshelfItems(): void {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.2, 0.36, -1.2);

    // Livros encadernados na vertical
    const bookColors = ['#A8422B', '#254533', '#D97706', '#2563EB', '#F2E4CC'];
    for (let i = 0; i < 5; i++) {
      const bMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: bookColors[i],
          roughness: 0.75
        })
      );
      const bGeo = this.registerGeometry(new THREE.BoxGeometry(0.07, 0.45 + (i % 2) * 0.08, 0.32));
      const book = new THREE.Mesh(bGeo, bMat);
      book.position.set(-0.2 + i * 0.085, 0.25, 0);
      book.castShadow = true;
      shelfGroup.add(book);
    }

    // Mini arco-íris decorativo de madeira (como no mockup à esquerda!)
    const rainbowColors = ['#E2B383', '#D48C56', '#5B7C6E'];
    rainbowColors.forEach((color, rIdx) => {
      const rMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
      const rad = 0.22 - rIdx * 0.06;
      const rGeo = this.registerGeometry(new THREE.TorusGeometry(rad, 0.025, 8, 16, Math.PI));
      const arch = new THREE.Mesh(rGeo, rMat);
      arch.position.set(0.65, 0.1, 0);
      shelfGroup.add(arch);
    });

    // Planta pendente no vaso
    const potMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#A0522D', roughness: 0.8 }));
    const leafMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#2E7D32', roughness: 0.85 }));

    const potGeo = this.registerGeometry(new THREE.CylinderGeometry(0.14, 0.1, 0.22, 12));
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(-0.8, 0.12, 0);
    shelfGroup.add(pot);

    // Folhagens penduradas
    for (let f = 0; f < 6; f++) {
      const leafGeo = this.registerGeometry(new THREE.SphereGeometry(0.08, 8, 8));
      leafGeo.scale(0.8, 1.4, 0.4);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const ang = (f / 6) * Math.PI * 2;
      leaf.position.set(-0.8 + Math.cos(ang) * 0.12, 0.22 - (f % 3) * 0.08, Math.sin(ang) * 0.12);
      leaf.rotation.z = Math.PI * 0.2;
      shelfGroup.add(leaf);
    }

    this.group.add(shelfGroup);
  }

  /**
   * 4. Acessórios da mesa de trabalho: caneca de café com folha, porta-lápis e caderno espiral
   */
  private buildDeskAccessories(): void {
    // Caneca de cerâmica com ramo de folhas na frente esquerda (como no mockup!)
    const mugMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#FAF5EE', roughness: 0.35 })
    );
    const coasterMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#B08855', roughness: 0.85 }) // Cortiça
    );

    const coasterGeo = this.registerGeometry(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16));
    const coaster = new THREE.Mesh(coasterGeo, coasterMat);
    coaster.position.set(-2.4, 0.02, 1.25);
    this.group.add(coaster);

    const mugGeo = this.registerGeometry(new THREE.CylinderGeometry(0.16, 0.14, 0.3, 16));
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-2.4, 0.18, 1.25);
    mug.castShadow = true;
    this.group.add(mug);

    // Asa da caneca
    const handleGeo = this.registerGeometry(new THREE.TorusGeometry(0.09, 0.025, 8, 16, Math.PI));
    handleGeo.rotateY(Math.PI / 2);
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(-2.55, 0.18, 1.25);
    this.group.add(handle);

    // Bloco de anotações com espiral à direita (como no canto inferior direito do mockup!)
    const paperMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#FAF5EE', roughness: 0.9 }));
    const coverGreenMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#2F684B', roughness: 0.8 }));
    const spiralMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.4 }));

    const notebookGeo = this.registerGeometry(new THREE.BoxGeometry(0.65, 0.06, 0.85));
    const notebook = new THREE.Mesh(notebookGeo, paperMat);
    notebook.position.set(2.4, 0.04, 1.1);
    notebook.rotation.y = -0.15;
    notebook.castShadow = true;
    this.group.add(notebook);

    // Livrinho verde menor sobre o caderno
    const diaryGeo = this.registerGeometry(new THREE.BoxGeometry(0.35, 0.05, 0.45));
    const diary = new THREE.Mesh(diaryGeo, coverGreenMat);
    diary.position.set(2.45, 0.1, 1.05);
    diary.rotation.y = -0.05;
    diary.castShadow = true;
    this.group.add(diary);

    // Espiral metálica lateral
    for (let s = 0; s < 7; s++) {
      const spRingGeo = this.registerGeometry(new THREE.TorusGeometry(0.04, 0.008, 6, 12));
      const spRing = new THREE.Mesh(spRingGeo, spiralMat);
      spRing.position.set(2.08, 0.06, 0.8 + s * 0.1);
      this.group.add(spRing);
    }
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
