/**
 * shared/engine/particles.js
 * Sistema de partículas GPU instanciadas (Poeira volumétrica, Faíscas, Ondas, Vapor)
 */

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.systems = [];
  }

  /**
   * Partículas de poeira suspensa com cintilação de luz
   */
  createDust({ count = 200, bounds = { x: 10, y: 6, z: 10 }, size = 0.04, color = 0xfffaed }) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * bounds.x;
      positions[i * 3 + 1] = Math.random() * bounds.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() * 0.04) + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: color,
      size: size,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    const dust = {
      points,
      positions,
      velocities,
      bounds,
      update(dt) {
        const pos = points.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          pos[i * 3] += velocities[i * 3] * dt;
          pos[i * 3 + 1] += velocities[i * 3 + 1] * dt;
          pos[i * 3 + 2] += velocities[i * 3 + 2] * dt;

          if (pos[i * 3 + 1] > bounds.y) pos[i * 3 + 1] = 0;
          if (Math.abs(pos[i * 3]) > bounds.x / 2) pos[i * 3] *= -0.9;
          if (Math.abs(pos[i * 3 + 2]) > bounds.z / 2) pos[i * 3 + 2] *= -0.9;
        }
        points.geometry.attributes.position.needsUpdate = true;
      },
      dispose() {
        geo.dispose();
        mat.dispose();
      }
    };

    this.systems.push(dust);
    return dust;
  }

  update(dt = 0.016) {
    for (let i = 0; i < this.systems.length; i++) {
      this.systems[i].update(dt);
    }
  }

  dispose() {
    for (let i = 0; i < this.systems.length; i++) {
      if (this.systems[i].points) {
        this.scene.remove(this.systems[i].points);
      }
      this.systems[i].dispose();
    }
    this.systems = [];
  }
}
