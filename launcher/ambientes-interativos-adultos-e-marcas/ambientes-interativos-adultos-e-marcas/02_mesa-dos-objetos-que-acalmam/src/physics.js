/**
 * Motores Físicos Analíticos e Simuladores dos 4 Objetos Sensoriais
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

/**
 * 1. Oscilador Harmônico 2D Acoplado do Pêndulo de Areia (Curvas de Lissajous)
 */
export class SandPendulumPhysics {
  constructor() {
    this.armLength = 0.45; // metros
    this.g = 9.81;
    this.omegaBase = Math.sqrt(this.g / this.armLength); // ~4.67 rad/s

    // Frequências ligeiramente distintas em X e Y para gerar rosáceas e Lissajous perfeitas
    this.freqX = this.omegaBase * 1.0;
    this.freqY = this.omegaBase * 1.04;
    this.damping = 0.045; // amortecimento suave e gradual

    this.ampX = 0.02;
    this.ampY = 0.015;
    this.phaseX = 0;
    this.phaseY = Math.PI * 0.25;

    this.time = 0;
    this.isActive = false;
    this.isDragging = false;

    this.currentPos = { x: 0, y: 0 };
    this.currentVel = { x: 0, y: 0 };
  }

  setImpulse(x, y, vx = 0, vy = 0) {
    this.time = 0;
    this.ampX = Math.min(0.20, Math.max(0.01, Math.hypot(x, vx / this.freqX)));
    this.ampY = Math.min(0.20, Math.max(0.01, Math.hypot(y, vy / this.freqY)));
    this.phaseX = Math.atan2(vx / this.freqX, x);
    this.phaseY = Math.atan2(vy / this.freqY, y) + (Math.abs(x) < 0.02 ? 0.4 : 0);
    this.isActive = true;
  }

  update(dt) {
    if (this.isDragging) return this.currentPos;
    if (!this.isActive) return this.currentPos;

    this.time += dt;
    const decay = Math.exp(-this.damping * this.time);

    // Equações analíticas do oscilador 2D
    const x = this.ampX * decay * Math.cos(this.freqX * this.time + this.phaseX);
    const y = this.ampY * decay * Math.sin(this.freqY * this.time + this.phaseY);

    // Velocidade instantânea para cálculo do som de atrito na areia
    const vx = -this.ampX * decay * (this.damping * Math.cos(this.freqX * this.time + this.phaseX) + this.freqX * Math.sin(this.freqX * this.time + this.phaseX));
    const vy = this.ampY * decay * (-this.damping * Math.sin(this.freqY * this.time + this.phaseY) + this.freqY * Math.cos(this.freqY * this.time + this.phaseY));

    this.currentPos.x = x;
    this.currentPos.y = y;
    this.currentVel.x = vx;
    this.currentVel.y = vy;

    const speed = Math.hypot(vx, vy);
    if (decay < 0.02 && speed < 0.005) {
      this.isActive = false;
    }

    return this.currentPos;
  }

  getSpeed() {
    return Math.hypot(this.currentVel.x, this.currentVel.y);
  }
}

/**
 * 2. Simulador Analítico do Berço de Newton (5 Esferas com Colisões Elásticas)
 */
export class NewtonsCradlePhysics {
  constructor(sphereCount = 5, onImpactCallback = null) {
    this.count = sphereCount;
    this.onImpact = onImpactCallback;

    this.wireLength = 0.16; // metros
    this.omega = Math.sqrt(9.81 / this.wireLength);
    this.damping = 0.035;

    // Ângulo theta e velocidade angular omega para cada esfera
    this.theta = new Float32Array(sphereCount);
    this.dTheta = new Float32Array(sphereCount);

    this.sphereRadius = 0.012; // 12mm
    this.spacing = this.sphereRadius * 2.02; // distância entre pivôs

    // Iniciar com uma esfera puxada
    this.pullSphere(0, -0.65);
  }

  pullSphere(index, angle) {
    if (index >= 0 && index < this.count) {
      this.theta[index] = angle;
      this.dTheta[index] = 0;
    }
  }

  pullMultiple(count, angle) {
    for (let i = 0; i < count; i++) {
      this.theta[i] = angle;
      this.dTheta[i] = 0;
    }
  }

  update(dt) {
    const gOverL = (this.omega * this.omega);

    // Integração Verlet / Euler simplificada
    for (let i = 0; i < this.count; i++) {
      const alpha = -gOverL * Math.sin(this.theta[i]) - this.damping * this.dTheta[i];
      this.dTheta[i] += alpha * dt;
      this.theta[i] += this.dTheta[i] * dt;
    }

    // Resolução sequencial de colisões elásticas de contato
    let hadImpact = false;
    let impactIntensity = 0;

    for (let i = 0; i < this.count - 1; i++) {
      // Se esfera i tenta ultrapassar esfera i+1 pela direita
      if (this.theta[i] > this.theta[i + 1]) {
        const relVel = this.dTheta[i] - this.dTheta[i + 1];
        if (relVel > 0.01) {
          hadImpact = true;
          impactIntensity = Math.max(impactIntensity, Math.abs(relVel));

          // Troca de momento com coeficiente de restituição quase elástico (0.985)
          const e = 0.985;
          const v1 = this.dTheta[i];
          const v2 = this.dTheta[i + 1];

          this.dTheta[i] = ((1 - e) * v1 + (1 + e) * v2) * 0.5;
          this.dTheta[i + 1] = ((1 + e) * v1 + (1 - e) * v2) * 0.5;

          // Separação de penetração
          const mid = (this.theta[i] + this.theta[i + 1]) * 0.5;
          this.theta[i] = mid - 0.0005;
          this.theta[i + 1] = mid + 0.0005;
        }
      }
    }

    if (hadImpact && this.onImpact && impactIntensity > 0.04) {
      this.onImpact(Math.min(1.0, impactIntensity * 0.8));
    }
  }
}

/**
 * 3. Ampulheta Líquida (Cinemática de Gotas Viscosas e Inversão 180°)
 */
export class LiquidHourglassPhysics {
  constructor(onDripCallback = null) {
    this.onDrip = onDripCallback;
    this.rotation = 0; // 0 ou Math.PI
    this.targetRotation = 0;
    this.isRotating = false;

    // Gotas simuladas
    this.dropCount = 14;
    this.drops = [];
    for (let i = 0; i < this.dropCount; i++) {
      this.drops.push({
        y: (i / this.dropCount) * 0.22 - 0.11,
        colorType: i % 2 === 0 ? 'amber' : 'blue',
        speed: 0.045 + (i % 3) * 0.008,
        active: true
      });
    }

    this.dripTimer = 0;
  }

  flip() {
    this.targetRotation += Math.PI;
    this.isRotating = true;
  }

  update(dt) {
    // Interpolação suave da rotação do corpo de vidro
    if (this.isRotating) {
      const diff = this.targetRotation - this.rotation;
      this.rotation += diff * Math.min(1.0, dt * 5.0);
      if (Math.abs(diff) < 0.005) {
        this.rotation = this.targetRotation;
        this.isRotating = false;
      }
    }

    // Movimentação das gotas no sentido da gravidade local
    const flowDirection = Math.cos(this.rotation) >= 0 ? -1 : 1;
    this.dripTimer += dt;

    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i];
      d.y += flowDirection * d.speed * dt;

      // Se a gota atinge o reservatório inferior
      if (flowDirection === -1 && d.y < -0.11) {
        d.y = 0.11;
        if (this.onDrip && this.dripTimer > 0.28) {
          this.onDrip(d.colorType);
          this.dripTimer = 0;
        }
      } else if (flowDirection === 1 && d.y > 0.11) {
        d.y = -0.11;
        if (this.onDrip && this.dripTimer > 0.28) {
          this.onDrip(d.colorType);
          this.dripTimer = 0;
        }
      }
    }
  }
}

/**
 * 4. Dinâmica da Tigela Tibetana (Impacto Modal e Canto Sustentado por Atrito)
 */
export class SingingBowlPhysics {
  constructor(onChimeCallback = null, onDroneCallback = null) {
    this.onChime = onChimeCallback;
    this.onDrone = onDroneCallback;

    this.strikeAmplitude = 0;
    this.frictionSustain = 0;

    this.lastAngle = null;
    this.angularSpeed = 0;
    this.strikerAngle = 0;
    this.isExciting = false;
  }

  strike(force = 0.8) {
    this.strikeAmplitude = Math.min(1.0, force);
    if (this.onChime) {
      this.onChime(this.strikeAmplitude);
    }
  }

  trackCircularMotion(angle, dt) {
    if (this.lastAngle !== null && dt > 0.0001) {
      let delta = angle - this.lastAngle;
      // Normalizar delta em [-PI, PI]
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;

      this.angularSpeed = Math.abs(delta) / dt;
      this.strikerAngle = angle;

      // Velocidade ideal para cantar: entre 1.5 e 7.0 rad/s
      if (this.angularSpeed > 1.2 && this.angularSpeed < 8.0) {
        const sweetSpot = 1.0 - Math.min(1.0, Math.abs(this.angularSpeed - 3.5) / 3.0);
        this.frictionSustain = Math.min(1.0, this.frictionSustain + sweetSpot * dt * 0.8);
        this.isExciting = true;
      } else {
        this.frictionSustain = Math.max(0, this.frictionSustain - dt * 0.5);
        this.isExciting = false;
      }
    } else {
      this.lastAngle = angle;
    }
    this.lastAngle = angle;

    if (this.onDrone) {
      this.onDrone(this.frictionSustain, this.angularSpeed);
    }
  }

  releaseStriker() {
    this.lastAngle = null;
    this.isExciting = false;
  }

  update(dt) {
    // Decaimento natural da oscilação do impacto
    if (this.strikeAmplitude > 0) {
      this.strikeAmplitude = Math.max(0, this.strikeAmplitude - dt * 0.12);
    }

    if (!this.isExciting && this.frictionSustain > 0) {
      this.frictionSustain = Math.max(0, this.frictionSustain - dt * 0.35);
      if (this.onDrone) {
        this.onDrone(this.frictionSustain, 0);
      }
    }
  }

  getTotalEnergy() {
    return Math.min(1.0, this.strikeAmplitude + this.frictionSustain);
  }
}
