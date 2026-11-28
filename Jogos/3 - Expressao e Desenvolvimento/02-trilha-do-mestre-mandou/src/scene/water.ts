/**
 * Riacho Cristalino da Trilha
 * Projeto: 02. Trilha do Mestre Mandou
 */

import * as THREE from 'three';

export function createRiverStream() {
  const group = new THREE.Group();
  group.name = 'riacho_florestal';

  // Superfície plana da água no nível y = -0.35
  const riverWidth = 14;
  const riverLength = 62;
  const geo = new THREE.PlaneGeometry(riverWidth, riverLength, 32, 64);
  geo.rotateX(-Math.PI / 2);

  // Deformar a malha para seguir a curva serpenteante do rio
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const riverCenter = Math.sin(z * 0.12) * 5.0 - 2.0;
    pos.setX(i, pos.getX(i) + riverCenter);
    pos.setY(i, -0.32);
  }
  geo.computeVertexNormals();

  // Textura dinâmica de ondulações da água
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#5599a5'); // azul celadon da água florestal
  grad.addColorStop(0.5, '#41828e');
  grad.addColorStop(1, '#5599a5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Estrias e ondas
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2.0;
  for (let y = 0; y < 256; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.1) * 3);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 8);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0x5599a5,
    transparent: true,
    opacity: 0.82,
    roughness: 0.12,
    metalness: 0.15
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'superficie_riacho';
  mesh.receiveShadow = true;
  group.add(mesh);

  function update(dt: number) {
    texture.offset.y = (texture.offset.y + dt * 0.12) % 1.0;
  }

  return { group, mesh, update };
}
