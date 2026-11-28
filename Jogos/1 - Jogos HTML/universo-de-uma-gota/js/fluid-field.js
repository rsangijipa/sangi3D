/**
 * Campo vetorial de fluido em microescala (baixo Reynolds: arrasto viscoso domina sobre inércia).
 * Grade 16x16 determinística com correntes locais, vórtices suaves, movimento browniano e gradientes.
 */

export function createFluidField(radius = 12.5, gridSize = 16) {
  const count = gridSize * gridSize;
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const vz = new Float32Array(count);
  const nutrients = new Float32Array(count);
  const cellSpan = (radius * 2) / gridSize;

  function sampleGrid(arr, x, y) {
    const gx = Math.max(0, Math.min(gridSize - 1.001, (x + radius) / cellSpan));
    const gy = Math.max(0, Math.min(gridSize - 1.001, (y + radius) / cellSpan));
    const x0 = gx | 0;
    const y0 = gy | 0;
    const x1 = Math.min(gridSize - 1, x0 + 1);
    const y1 = Math.min(gridSize - 1, y0 + 1);
    const fx = gx - x0;
    const fy = gy - y0;
    const i00 = y0 * gridSize + x0;
    const i10 = y0 * gridSize + x1;
    const i01 = y1 * gridSize + x0;
    const i11 = y1 * gridSize + x1;
    const a = arr[i00] + (arr[i10] - arr[i00]) * fx;
    const b = arr[i01] + (arr[i11] - arr[i01]) * fx;
    return a + (b - a) * fy;
  }

  function addNutrientPulse(x, y, amount = 0.6) {
    const gx = Math.max(0, Math.min(gridSize - 1, Math.round((x + radius) / cellSpan)));
    const gy = Math.max(0, Math.min(gridSize - 1, Math.round((y + radius) / cellSpan)));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) continue;
        const falloff = dx === 0 && dy === 0 ? 1 : 0.45;
        nutrients[ny * gridSize + nx] = Math.min(2.0, nutrients[ny * gridSize + nx] + amount * falloff);
      }
    }
  }

  function update(time, currentIntensity = 0.2, dt = 1 / 60) {
    const strength = 0.05 + currentIntensity * 0.42;
    const streamAngle = Math.sin(time * 0.08) * 0.45 + 0.35;
    const streamCos = Math.cos(streamAngle);
    const streamSin = Math.sin(streamAngle);

    for (let j = 0; j < gridSize; j++) {
      const y = (j + 0.5) * cellSpan - radius;
      for (let i = 0; i < gridSize; i++) {
        const x = (i + 0.5) * cellSpan - radius;
        const idx = j * gridSize + i;
        // Escoamento laminar com vórtice suave confinado à gota
        const rNorm = Math.hypot(x, y) / radius;
        const wallDamp = Math.max(0.05, 1 - rNorm * rNorm);
        const curlX = Math.sin(y * 0.34 + time * 0.21) * 0.6 + Math.cos((x + y) * 0.22 - time * 0.14) * 0.4;
        const curlY = -Math.cos(x * 0.31 - time * 0.18) * 0.6 + Math.sin((x - y) * 0.25 + time * 0.16) * 0.4;
        vx[idx] = (streamCos * 0.55 + curlX * 0.65) * strength * wallDamp;
        vy[idx] = (streamSin * 0.55 + curlY * 0.65) * strength * wallDamp;
        vz[idx] = Math.sin(x * 0.4 + y * 0.35 + time * 0.25) * strength * 0.15 * wallDamp;
        // Decaimento suave de nutrientes dissolvidos
        nutrients[idx] = Math.max(0, nutrients[idx] - dt * 0.018);
      }
    }
  }

  function sampleVelocity(x, y, out) {
    out.x = sampleGrid(vx, x, y);
    out.y = sampleGrid(vy, x, y);
    out.z = sampleGrid(vz, x, y);
    return out;
  }

  function sampleNutrient(x, y) {
    return sampleGrid(nutrients, x, y);
  }

  // Gradiente luminoso simples (mais claro próximo ao centro/quadrante superior direito)
  function sampleLight(x, y, envLight = 0.7) {
    const cx = 2.5;
    const cy = 2.0;
    const d = Math.hypot(x - cx, y - cy) / (radius * 1.4);
    return Math.max(0.05, envLight * (1.15 - d * 0.65));
  }

  function reset() {
    vx.fill(0);
    vy.fill(0);
    vz.fill(0);
    nutrients.fill(0);
  }

  return {
    update,
    sampleVelocity,
    sampleNutrient,
    sampleLight,
    addNutrientPulse,
    reset,
    gridSize,
  };
}
