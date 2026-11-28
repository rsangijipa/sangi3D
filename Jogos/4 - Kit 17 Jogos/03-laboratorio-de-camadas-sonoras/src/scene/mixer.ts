/**
 * Laboratório de Camadas Sonoras — Mesa de Mixagem em Madeira
 * Corpo inclinado artesanal (mixer_body), 5 faders com trilhos graduados e botões de fone solo
 */

import * as THREE from 'three';
import { ChannelId } from '../game/state';
import { CHANNELS_CATALOG } from '../game/content';

export interface FaderTrackInfo {
  channelId: ChannelId;
  knobGroup: THREE.Group;
  trackGroup: THREE.Group;
  soloButtonMesh: THREE.Mesh;
  colliderKnob: THREE.Mesh;
  colliderButton: THREE.Mesh;
  knobMat: THREE.MeshStandardMaterial;
  soloBtnMat: THREE.MeshStandardMaterial;
}

export class MixingDesk {
  public group: THREE.Group;
  public tracks: Map<ChannelId, FaderTrackInfo> = new Map();
  public clickColliders: THREE.Mesh[] = [];
  public dragColliders: THREE.Mesh[] = [];

  private materials: THREE.Material[] = [];
  private geometries: THREE.BufferGeometry[] = [];

  // Dimensões do curso do fader
  public readonly trackLength = 1.15;
  public readonly startZ = 0.95; // Posição z para volume 0.0 (baixo do fader)
  public readonly endZ = 0.05;   // Posição z para volume 1.0 (topo do fader)
  public readonly slopeAngle = 0.28; // ~16° de inclinação do painel frontal

  constructor() {
    this.group = new THREE.Group();
    this.buildMixerBody();
    this.buildTracksAndKnobs();
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
   * 1. Corpo principal da mesa de mixagem com superfície chanfrada inclinada
   */
  private buildMixerBody(): void {
    const woodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#D4A373', // Carvalho mel polido da mesa de som
        roughness: 0.55,
        metalness: 0.04
      })
    );

    const darkWoodMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({
        color: '#8A5A36', // Laterais chanfradas mais escuras
        roughness: 0.7
      })
    );

    // Bloco inclinado do console
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, 0.16, 0.55);

    // Tampo inclinado frontal
    const topGeo = this.registerGeometry(new THREE.BoxGeometry(4.4, 0.14, 1.8));
    topGeo.rotateX(this.slopeAngle);
    const topMesh = new THREE.Mesh(topGeo, woodMat);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    bodyGroup.add(topMesh);

    // Laterais de acabamento arredondado
    [-2.22, 2.22].forEach(sideX => {
      const sideGeo = this.registerGeometry(new THREE.BoxGeometry(0.08, 0.36, 1.85));
      sideGeo.rotateX(this.slopeAngle);
      const sideMesh = new THREE.Mesh(sideGeo, darkWoodMat);
      sideMesh.position.x = sideX;
      sideMesh.castShadow = true;
      bodyGroup.add(sideMesh);
    });

    this.group.add(bodyGroup);
  }

  /**
   * 2. 5 Trilhos de fader verticais com marcações de graduação e knobs deslizantes
   */
  private buildTracksAndKnobs(): void {
    const slotDarkMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#2B231D', roughness: 0.9 }) // Ranhura escura do trilho
    );
    const tickMat = this.registerMaterial(
      new THREE.MeshStandardMaterial({ color: '#8A735E', roughness: 0.8 }) // Marcações gravadas
    );

    const spacing = 0.86;
    const startX = -2 * spacing;

    CHANNELS_CATALOG.forEach((channel, idx) => {
      const posX = startX + idx * spacing;
      const trackGroup = new THREE.Group();
      trackGroup.position.set(posX, 0.28, 0.55);
      trackGroup.rotation.x = this.slopeAngle;

      // 1. Fenda/trilho central rebaixado
      const slotGeo = this.registerGeometry(new THREE.BoxGeometry(0.05, 0.03, this.trackLength));
      const slotMesh = new THREE.Mesh(slotGeo, slotDarkMat);
      slotMesh.position.set(0, 0, 0);
      trackGroup.add(slotMesh);

      // Marcações de graduação nas laterais do trilho (ticks como no mockup)
      for (let t = -5; t <= 5; t++) {
        const tickZ = (t / 5) * (this.trackLength * 0.44);
        const tickGeo = this.registerGeometry(new THREE.BoxGeometry(0.06, 0.005, 0.015));
        const tickLeft = new THREE.Mesh(tickGeo, tickMat);
        tickLeft.position.set(-0.06, 0.01, tickZ);
        trackGroup.add(tickLeft);

        const tickRight = new THREE.Mesh(tickGeo, tickMat);
        tickRight.position.set(0.06, 0.01, tickZ);
        trackGroup.add(tickRight);
      }

      // 2. Fader Knob deslizante
      // No canal 1 (footsteps) no mockup, o knob é verde floresta; nos demais, madeira clara
      const isShoeChannel = channel.id === 'footsteps';
      const knobMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: isShoeChannel ? '#2F684B' : '#EFE4D2',
          roughness: 0.5,
          metalness: 0.1
        })
      );

      const knobGroup = new THREE.Group();
      const knobBodyGeo = this.registerGeometry(new THREE.BoxGeometry(0.24, 0.08, 0.14));
      const knobMesh = new THREE.Mesh(knobBodyGeo, knobMat);
      knobMesh.position.y = 0.05;
      knobMesh.castShadow = true;
      knobGroup.add(knobMesh);

      // Ranhura tátil central no topo do knob
      const ridgeGeo = this.registerGeometry(new THREE.BoxGeometry(0.22, 0.01, 0.02));
      const ridgeMat = this.registerMaterial(new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.5 }));
      const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
      ridge.position.y = 0.095;
      knobGroup.add(ridge);

      // Colisor invisível generoso para arrasto do knob
      const colKnobGeo = this.registerGeometry(new THREE.BoxGeometry(0.36, 0.3, 0.3));
      const colKnobMat = this.registerMaterial(new THREE.MeshBasicMaterial({ visible: false }));
      const colliderKnob = new THREE.Mesh(colKnobGeo, colKnobMat);
      colliderKnob.position.y = 0.06;
      colliderKnob.userData = { channelId: channel.id, type: 'knob' };
      knobGroup.add(colliderKnob);
      this.dragColliders.push(colliderKnob);

      trackGroup.add(knobGroup);

      // 3. Botão circular de fone (solo) na parte inferior do trilho
      const soloBtnMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: isShoeChannel ? '#254533' : '#FAF5EE', // Verde escuro quando ativo, creme quando inativo
          roughness: 0.45,
          metalness: 0.05
        })
      );

      const soloBtnGeo = this.registerGeometry(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24));
      const soloBtn = new THREE.Mesh(soloBtnGeo, soloBtnMat);
      soloBtn.position.set(0, 0.02, 0.72);
      soloBtn.castShadow = true;

      // Ícone estilizado de fone no topo do botão
      const hpIconMat = this.registerMaterial(
        new THREE.MeshStandardMaterial({
          color: isShoeChannel ? '#FAF5EE' : '#254533', // Branco sobre verde ou verde sobre creme
          roughness: 0.3
        })
      );
      const hpRingGeo = this.registerGeometry(new THREE.TorusGeometry(0.045, 0.012, 6, 16, Math.PI));
      hpRingGeo.rotateX(Math.PI / 2);
      const hpRing = new THREE.Mesh(hpRingGeo, hpIconMat);
      hpRing.position.y = 0.025;
      soloBtn.add(hpRing);

      // Colisor de clique para o botão solo
      const colBtnGeo = this.registerGeometry(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12));
      const colBtnMat = this.registerMaterial(new THREE.MeshBasicMaterial({ visible: false }));
      const colliderBtn = new THREE.Mesh(colBtnGeo, colBtnMat);
      colliderBtn.position.set(0, 0.04, 0.72);
      colliderBtn.userData = { channelId: channel.id, type: 'soloButton' };
      trackGroup.add(colliderBtn);
      this.clickColliders.push(colliderBtn);

      trackGroup.add(soloBtn);

      this.group.add(trackGroup);

      this.tracks.set(channel.id, {
        channelId: channel.id,
        knobGroup,
        trackGroup,
        soloButtonMesh: soloBtn,
        colliderKnob,
        colliderButton: colliderBtn,
        knobMat,
        soloBtnMat
      });
    });
  }

  /**
   * Atualiza a posição 3D de cada knob de fader e o visual de solo dos botões
   */
  public updateFaderPositions(
    channels: Array<{ id: ChannelId; level: number }>,
    soloId: ChannelId | null,
    focusedChannelId: ChannelId
  ): void {
    channels.forEach(ch => {
      const track = this.tracks.get(ch.id);
      if (!track) return;

      // Posiciona o knob relativo ao centro do trilho (0.0 no meio)
      track.knobGroup.position.z = (0.5 - ch.level) * (this.trackLength * 0.85);

      const isSolo = soloId === ch.id;
      const isFocused = focusedChannelId === ch.id;

      // Cor do knob
      if (isFocused || isSolo) {
        track.knobMat.color.set('#2F684B'); // Verde destaque do mockup
      } else {
        track.knobMat.color.set('#EFE4D2'); // Madeira clara padrão
      }

      // Cor do botão fone (solo)
      if (isSolo) {
        track.soloBtnMat.color.set('#254533'); // Fone ativo verde escuro
      } else {
        track.soloBtnMat.color.set('#FAF5EE'); // Fone inativo creme
      }
    });
  }

  public dispose(): void {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
