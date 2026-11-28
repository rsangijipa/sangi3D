/**
 * Porto das Decisões — Trajetória em Fita Creme e Boias Náuticas em Diorama
 * Boias circulares verde-escuro e creme, fita contínua sobre a água
 * e anel de foco verde-limão com 4 traços radiais idênticos ao mockup.
 */

import * as THREE from 'three';
import { HARBOR_NODES, getNodeById } from '../game/content';

export class RouteView {
  public group: THREE.Group;
  public nodeMeshes: Map<string, THREE.Group> = new Map();
  public clickColliders: THREE.Mesh[] = [];
  private pathLineMesh: THREE.Mesh | null = null;
  private haloGroup: THREE.Group;
  private selectedNodeId: string | null = null;
  private hoveredNodeId: string | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.haloGroup = new THREE.Group();
    this.buildHaloRing();
    this.group.add(this.haloGroup);
    this.haloGroup.visible = false;

    this.buildAllNodeMarkers();
  }

  /**
   * Constrói o anel verde-limão e os 4 traços radiais superiores do mockup
   */
  private buildHaloRing(): void {
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#86EFAC', // Verde limão luminoso do mockup
      side: THREE.DoubleSide
    });

    // Anel externo luminoso
    const ringGeo = new THREE.RingGeometry(0.36, 0.46, 36);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, haloMat);
    this.haloGroup.add(ringMesh);

    // 4 traços radiais estilizados apontando para fora na parte superior (iguais ao mockup!)
    const tickMat = new THREE.MeshBasicMaterial({ color: '#FAF5EE' });
    const angles = [
      Math.PI * 0.25,
      Math.PI * 0.42,
      Math.PI * 0.58,
      Math.PI * 0.75
    ];
    angles.forEach(ang => {
      const tickGeo = new THREE.BoxGeometry(0.04, 0.02, 0.16);
      const tick = new THREE.Mesh(tickGeo, tickMat);
      const r = 0.58;
      tick.position.set(Math.cos(ang) * r, 0.015, -Math.sin(ang) * r);
      tick.rotation.y = ang + Math.PI / 2;
      this.haloGroup.add(tick);
    });
  }

  /**
   * Constrói todas as boias circulares verdes e creme nos nós navegáveis
   */
  private buildAllNodeMarkers(): void {
    const rimMat = new THREE.MeshStandardMaterial({
      color: '#254533', // Verde floresta escuro da borda
      roughness: 0.45,
      metalness: 0.05
    });

    const innerCreamMat = new THREE.MeshStandardMaterial({
      color: '#FAF5EE', // Creme artesanal do mockup
      roughness: 0.35,
      metalness: 0.02
    });

    const brassRingMat = new THREE.MeshStandardMaterial({
      color: '#D4AF37', // Filete de latão
      roughness: 0.3,
      metalness: 0.7
    });

    HARBOR_NODES.forEach(node => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.pos[0], 0.08, node.pos[2]);

      // Anel circular externo verde escuro
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 28);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.castShadow = true;
      rim.receiveShadow = true;
      nodeGroup.add(rim);

      // Filete de latão intermediário
      const brassGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.082, 28);
      const brass = new THREE.Mesh(brassGeo, brassRingMat);
      nodeGroup.add(brass);

      // Disco interno creme
      const discGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.085, 28);
      const disc = new THREE.Mesh(discGeo, innerCreamMat);
      disc.position.y = 0.003;
      disc.receiveShadow = true;
      nodeGroup.add(disc);

      // Colisor invisível ampliado para facilitar toque e clique no diorama
      const hitGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.6, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { nodeId: node.id };
      nodeGroup.add(hitMesh);
      this.clickColliders.push(hitMesh);

      this.group.add(nodeGroup);
      this.nodeMeshes.set(node.id, nodeGroup);
    });
  }

  /**
   * Atualiza a curva e malha da fita creme que conecta a rota ativa
   */
  public updateRoutePath(routeNodeIds: string[]): void {
    if (this.pathLineMesh) {
      this.group.remove(this.pathLineMesh);
      this.pathLineMesh.geometry.dispose();
      this.pathLineMesh = null;
    }

    if (routeNodeIds.length < 2) {
      if (routeNodeIds.length === 1) {
        this.setSelectedNode(routeNodeIds[0]);
      } else {
        this.haloGroup.visible = false;
      }
      return;
    }

    const points: THREE.Vector3[] = [];
    routeNodeIds.forEach(id => {
      const node = getNodeById(id);
      if (node) {
        points.push(new THREE.Vector3(node.pos[0], 0.12, node.pos[2]));
      }
    });

    if (points.length < 2) return;

    // Curva Catmull-Rom suave
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.25);
    const tubeGeo = new THREE.TubeGeometry(curve, points.length * 20, 0.048, 10, false);

    const ribbonCreamMat = new THREE.MeshStandardMaterial({
      color: '#FAF6EE', // Fita contínua creme do mockup
      roughness: 0.35,
      metalness: 0.04
    });

    this.pathLineMesh = new THREE.Mesh(tubeGeo, ribbonCreamMat);
    this.pathLineMesh.castShadow = true;
    this.pathLineMesh.receiveShadow = true;
    this.group.add(this.pathLineMesh);

    // Destacar o último nó ativo da rota
    const lastId = routeNodeIds[routeNodeIds.length - 1];
    this.setSelectedNode(lastId);
  }

  public setSelectedNode(nodeId: string | null): void {
    this.selectedNodeId = nodeId;
    if (!nodeId) {
      this.haloGroup.visible = false;
      return;
    }

    const node = getNodeById(nodeId);
    if (node) {
      this.haloGroup.position.set(node.pos[0], 0.13, node.pos[2]);
      this.haloGroup.visible = true;
    }
  }

  public setHoveredNode(nodeId: string | null): void {
    this.hoveredNodeId = nodeId;
  }

  public getSelectedNodeId(): string | null {
    return this.selectedNodeId;
  }

  public getHoveredNodeId(): string | null {
    return this.hoveredNodeId;
  }

  public update(time: number): void {
    if (this.haloGroup.visible) {
      // Pulso suave no halo verde
      const pulse = 1.0 + Math.sin(time * 3.5) * 0.06;
      this.haloGroup.scale.set(pulse, 1.0, pulse);
    }
  }

  public dispose(): void {
    if (this.pathLineMesh) {
      this.pathLineMesh.geometry.dispose();
    }
  }
}
