/**
 * shared/engine/physics.js
 * Modelos computacionais de física para Sangi3D:
 * - Damped Harmonic Oscillators (Spring-Damper)
 * - Verlet Integration (Cordas, Tecidos, Pêndulos)
 * - Heightfield Wave Ripple (Ondulações líquidas 2D)
 * - Angular Kinematics (Engrenagens, Roldanas e Eixos)
 * - Impulso e Colisões Rígidas Básicas
 */

export class PhysicsSolver {
  constructor(fixedDt = 1 / 60) {
    this.fixedDt = fixedDt;
    this.accumulator = 0;
    this.lastTime = performance.now();
    this.springs = [];
    this.verlets = [];
    this.heightfields = [];
    this.rotators = [];
  }

  /**
   * Registra mola amortecida 1D ou 3D
   */
  addSpring({ current, target, velocity = 0, stiffness = 120, damping = 14, mass = 1.0 }) {
    const spring = { current, target, velocity, stiffness, damping, mass };
    this.springs.push(spring);
    return spring;
  }

  /**
   * Sistema de ondas em superfície líquida (Heightfield Wave Equation)
   */
  createHeightfieldWave(width = 32, height = 32, damping = 0.985) {
    const size = width * height;
    const buffer1 = new Float32Array(size);
    const buffer2 = new Float32Array(size);
    const wave = {
      width,
      height,
      damping,
      current: buffer1,
      previous: buffer2,
      disturb(x, y, amount) {
        if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
        const idx = y * width + x;
        this.current[idx] += amount;
      },
      step() {
        for (let y = 1; y < height - 1; y++) {
          const row = y * width;
          for (let x = 1; x < width - 1; x++) {
            const idx = row + x;
            const val =
              (this.current[idx - 1] +
                this.current[idx + 1] +
                this.current[idx - width] +
                this.current[idx + width]) * 0.5 -
              this.previous[idx];
            this.previous[idx] = val * damping;
          }
        }
        // Troca de buffers
        const tmp = this.current;
        this.current = this.previous;
        this.previous = tmp;
      }
    };
    this.heightfields.push(wave);
    return wave;
  }

  /**
   * Simulação Verlet 1D/3D (Corda / Pêndulo elástico)
   */
  createVerletChain(numPoints = 8, spacing = 0.25, gravity = -9.8) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: 0,
        y: -i * spacing,
        z: 0,
        oldX: 0,
        oldY: -i * spacing,
        oldZ: 0,
        pinned: i === 0
      });
    }
    const chain = {
      points,
      spacing,
      gravity,
      iterations: 6,
      step(dt) {
        const dtSq = dt * dt;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (p.pinned) continue;
          const vx = p.x - p.oldX;
          const vy = p.y - p.oldY;
          const vz = p.z - p.oldZ;
          p.oldX = p.x;
          p.oldY = p.y;
          p.oldZ = p.z;
          p.x += vx;
          p.y += vy + gravity * dtSq;
          p.z += vz;
        }
        // Restrições de distância
        for (let it = 0; it < this.iterations; it++) {
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dz = p2.z - p1.z;
            const dist = Math.hypot(dx, dy, dz) || 0.0001;
            const diff = (dist - spacing) / dist;
            const adjustX = dx * 0.5 * diff;
            const adjustY = dy * 0.5 * diff;
            const adjustZ = dz * 0.5 * diff;

            if (!p1.pinned) {
              p1.x += adjustX;
              p1.y += adjustY;
              p1.z += adjustZ;
            }
            if (!p2.pinned) {
              p2.x -= adjustX;
              p2.y -= adjustY;
              p2.z -= adjustZ;
            }
          }
        }
      }
    };
    this.verlets.push(chain);
    return chain;
  }

  /**
   * Registra corpo rotatório com inércia e atrito (Ex: Toca-discos, engrenagens, roldanas)
   */
  addRotator({ angle = 0, angularVelocity = 0, friction = 0.98, targetVelocity = null }) {
    const rotator = {
      angle,
      angularVelocity,
      friction,
      targetVelocity,
      applyTorque(torque) {
        this.angularVelocity += torque;
      },
      step(dt) {
        if (this.targetVelocity !== null) {
          this.angularVelocity += (this.targetVelocity - this.angularVelocity) * (1 - Math.exp(-5 * dt));
        } else {
          this.angularVelocity *= Math.pow(this.friction, dt * 60);
        }
        this.angle += this.angularVelocity * dt;
      }
    };
    this.rotators.push(rotator);
    return rotator;
  }

  /**
   * Atualização com passo fixo (Fixed Timestep Accumulator)
   */
  update(currentTime = performance.now()) {
    const elapsed = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.accumulator += elapsed;

    while (this.accumulator >= this.fixedDt) {
      this.step(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }
  }

  step(dt) {
    // 1. Molas
    for (let i = 0; i < this.springs.length; i++) {
      const s = this.springs[i];
      const force = -s.stiffness * (s.current - s.target) - s.damping * s.velocity;
      const acceleration = force / s.mass;
      s.velocity += acceleration * dt;
      s.current += s.velocity * dt;
    }

    // 2. Ondas Heightfield
    for (let i = 0; i < this.heightfields.length; i++) {
      this.heightfields[i].step();
    }

    // 3. Verlets
    for (let i = 0; i < this.verlets.length; i++) {
      this.verlets[i].step(dt);
    }

    // 4. Rotators
    for (let i = 0; i < this.rotators.length; i++) {
      this.rotators[i].step(dt);
    }
  }
}
