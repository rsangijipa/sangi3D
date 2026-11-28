/**
 * js/sand-physics.js
 * Heightmap editável da areia (Float32Array), cálculo parcial de normais dinâmicas,
 * colisão rastelo-pedras (T02), traçado multi-dente alinhado à tangente (T01)
 * e pilha determinística de desfazer (T03).
 */
import * as THREE from 'three';
import {
   BASIN_W,
   BASIN_D,
   GRID_NX,
   GRID_NZ,
   RAKE_WIDTHS,
} from './state.js';

export function createSandSimulation(scene, sandMat, rocksState) {
  const count = (GRID_NX + 1) * (GRID_NZ + 1);
  const heights = new Float32Array(count);
  const undoStack = [];
  const MAX_UNDO = 24;

  const dxCell = BASIN_W / GRID_NX;
  const dzCell = BASIN_D / GRID_NZ;

  const geo = new THREE.PlaneGeometry(BASIN_W, BASIN_D, GRID_NX, GRID_NZ);
  geo.rotateX(-Math.PI / 2);
  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;

  const sandMesh = new THREE.Mesh(geo, sandMat);
  sandMesh.receiveShadow = true;
  sandMesh.castShadow = false;
  sandMesh.position.y = 0;
  scene.add(sandMesh);

  function gridIdx(ix, iz) {
    return iz * (GRID_NX + 1) + ix;
  }

  function worldToGrid(wx, wz) {
    const fx = ((wx + BASIN_W * 0.5) / BASIN_W) * GRID_NX;
    const fz = ((wz + BASIN_D * 0.5) / BASIN_D) * GRID_NZ;
    return { fx, fz };
  }

  function gridToWorld(ix, iz) {
    return {
      x: -BASIN_W * 0.5 + ix * dxCell,
      z: -BASIN_D * 0.5 + iz * dzCell,
    };
  }

  /** Recalcula apenas a caixa suja de normais para manter 60 FPS durante o arrasto. */
  function syncGeometry(minX = 0, maxX = GRID_NX, minZ = 0, maxZ = GRID_NZ) {
    const x0 = Math.max(0, minX);
    const x1 = Math.min(GRID_NX, maxX);
    const z0 = Math.max(0, minZ);
    const z1 = Math.min(GRID_NZ, maxZ);

    for (let iz = z0; iz <= z1; iz++) {
      for (let ix = x0; ix <= x1; ix++) {
        const i = gridIdx(ix, iz);
        posAttr.setY(i, heights[i]);
      }
    }

    for (let iz = z0; iz <= z1; iz++) {
      const izL = Math.max(0, iz - 1);
      const izR = Math.min(GRID_NZ, iz + 1);
      for (let ix = x0; ix <= x1; ix++) {
        const ixL = Math.max(0, ix - 1);
        const ixR = Math.min(GRID_NX, ix + 1);

        const hL = heights[gridIdx(ixL, iz)];
        const hR = heights[gridIdx(ixR, iz)];
        const hD = heights[gridIdx(ix, izL)];
        const hU = heights[gridIdx(ix, izR)];

        const nx = hL - hR;
        const ny = dxCell * 2.0;
        const nz = (hD - hU) * (dxCell / dzCell);
        const inv = 1 / Math.hypot(nx, ny, nz);
        const i = gridIdx(ix, iz);
        normAttr.setXYZ(i, nx * inv, ny * inv, nz * inv);
      }
    }
    posAttr.needsUpdate = true;
    normAttr.needsUpdate = true;
  }

  function snapshotForUndo() {
    undoStack.push(new Float32Array(heights));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    return undoStack.length;
  }

  /** T03: Desfazer recupera exatamente o mapa de altura e normais anteriores. */
  function undo() {
    if (!undoStack.length) return false;
    const prev = undoStack.pop();
    heights.set(prev);
    syncGeometry(0, GRID_NX, 0, GRID_NZ);
    return true;
  }

  /** Verifica se o centro do rastelo colide com alguma pedra/borda e retorna pedra bloqueadora se houver. */
  function testRakeCollision(wx, wz, headRadius) {
    // Limite interno das vigas de cedro ao redor do tanque
    const halfW = BASIN_W * 0.5 - 0.16;
    const halfD = BASIN_D * 0.5 - 0.16;
    if (Math.abs(wx) > halfW || Math.abs(wz) > halfD) {
      return { blocked: true, reason: 'wall', rock: null };
    }
    for (let k = 0; k < rocksState.length; k++) {
      const rk = rocksState[k];
      const d = Math.hypot(wx - rk.x, wz - rk.z);
      if (d < rk.r + headRadius * 0.42 + 0.12) {
        return { blocked: true, reason: 'rock', rock: rk };
      }
    }
    return { blocked: false, reason: null, rock: null };
  }

  /** Desliza/impede o rastelo ao tocar uma pedra para nunca atravessá-la (T02). */
  function clampRakePosition(wx, wz, headWidth) {
    let x = Math.max(-BASIN_W * 0.5 + 0.22, Math.min(BASIN_W * 0.5 - 0.22, wx));
    let z = Math.max(-BASIN_D * 0.5 + 0.22, Math.min(BASIN_D * 0.5 - 0.22, wz));
    let hitRock = false;

    const effR = headWidth * 0.34;
    for (let k = 0; k < rocksState.length; k++) {
      const rk = rocksState[k];
      const minD = rk.r + effR + 0.08;
      const dx = x - rk.x;
      const dz = z - rk.z;
      const d = Math.hypot(dx, dz);
      if (d < minD) {
        hitRock = true;
        if (d > 1e-4) {
          x = rk.x + (dx / d) * minD;
          z = rk.z + (dz / d) * minD;
        } else {
          x = rk.x + minD;
        }
      }
    }
    return { x, z, hitRock };
  }

  /**
   * T01: Escava sulcos paralelos ao longo da direção tangente ao gesto entre (x0,z0)->(x1,z1).
   * Respeita colisão de pedras por célula para impedir sulcos dentro da zona da pedra (T02).
   */
  function carveStrokeSegment(x0, z0, x1, z1, widthKey) {
    const spec = RAKE_WIDTHS[widthKey] || RAKE_WIDTHS.medio;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const segLen = Math.hypot(dx, dz);
    if (segLen < 0.008) return { carved: false, hitRock: false };

    const dirX = dx / segLen;
    const dirZ = dz / segLen;
    // Vetor lateral ortogonal ao movimento
    const sideX = -dirZ;
    const sideZ = dirX;

    const steps = Math.max(1, Math.ceil(segLen / 0.045));
    const halfSpan = ((spec.tines - 1) * spec.spacing) * 0.5 + spec.spacing * 0.72;
    const gMin = worldToGrid(Math.min(x0, x1) - halfSpan - 0.2, Math.min(z0, z1) - halfSpan - 0.2);
    const gMax = worldToGrid(Math.max(x0, x1) + halfSpan + 0.2, Math.max(z0, z1) + halfSpan + 0.2);
    const ixStart = Math.max(0, Math.floor(gMin.fx));
    const ixEnd = Math.min(GRID_NX, Math.ceil(gMax.fx));
    const izStart = Math.max(0, Math.floor(gMin.fz));
    const izEnd = Math.min(GRID_NZ, Math.ceil(gMax.fz));

    let anyRockContact = false;
    const halfTines = (spec.tines - 1) * 0.5;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const clamped = clampRakePosition(x0 + dx * t, z0 + dz * t, spec.headWidth);
      if (clamped.hitRock) anyRockContact = true;

      for (let iz = izStart; iz <= izEnd; iz++) {
        for (let ix = ixStart; ix <= ixEnd; ix++) {
          const w = gridToWorld(ix, iz);
          const relX = w.x - clamped.x;
          const relZ = w.z - clamped.z;

          // Distância ao longo e perpendicular à cabeça do rastelo
          const along = relX * dirX + relZ * dirZ;
          if (Math.abs(along) > 0.14) continue;
          const lat = relX * sideX + relZ * sideZ;
          if (Math.abs(lat) > halfSpan) continue;

          // Não esculpe dentro do raio físico das pedras
          let insideRock = false;
          for (let r = 0; r < rocksState.length; r++) {
            const rk = rocksState[r];
            if (Math.hypot(w.x - rk.x, w.z - rk.z) < rk.r + 0.09) {
              insideRock = true;
              break;
            }
          }
          if (insideRock) continue;

          // Perfil periódico realista de cristas e sulcos criados pelos dentes
          const tinePos = lat / spec.spacing + halfTines;
          const nearest = Math.round(tinePos);
          let targetH;
          if (nearest >= 0 && nearest < spec.tines) {
            const dTine = Math.abs(tinePos - nearest); // 0 no dente, 0.5 na crista intermediária
            // Dente cava um vale (-ridgeAmp), bordas sobem levemente (+0.65 * ridgeAmp)
            targetH = spec.ridgeAmp * (Math.cos(dTine * Math.PI * 2) * -0.88 + 0.12);
          } else {
            // Borda externa deslocada suavemente
            const edgeFade = Math.max(0, 1 - (Math.abs(lat) - halfTines * spec.spacing) / (spec.spacing * 0.72));
            targetH = spec.ridgeAmp * 0.42 * edgeFade;
          }

          const env = 1 - Math.abs(along) / 0.14;
          const idx = gridIdx(ix, iz);
          heights[idx] = heights[idx] + (targetH - heights[idx]) * (0.48 * env);
        }
      }
    }

    syncGeometry(ixStart - 1, ixEnd + 1, izStart - 1, izEnd + 1);
    return { carved: true, hitRock: anyRockContact };
  }

  /** Cria colar de areia levemente revolvida ao redor de uma pedra movida. */
  function stampRockCollar(rock) {
    const rOuter = rock.r + 0.28;
    const gMin = worldToGrid(rock.x - rOuter, rock.z - rOuter);
    const gMax = worldToGrid(rock.x + rOuter, rock.z + rOuter);
    const ix0 = Math.max(0, Math.floor(gMin.fx));
    const ix1 = Math.min(GRID_NX, Math.ceil(gMax.fx));
    const iz0 = Math.max(0, Math.floor(gMin.fz));
    const iz1 = Math.min(GRID_NZ, Math.ceil(gMax.fz));

    for (let iz = iz0; iz <= iz1; iz++) {
      for (let ix = ix0; ix <= ix1; ix++) {
        const w = gridToWorld(ix, iz);
        const d = Math.hypot(w.x - rock.x, w.z - rock.z);
        if (d > rock.r * 0.85 && d < rOuter) {
          const u = (d - rock.r * 0.85) / (rOuter - rock.r * 0.85);
          const collar = Math.sin(u * Math.PI) * 0.022;
          const idx = gridIdx(ix, iz);
          heights[idx] = Math.max(heights[idx], collar);
        }
      }
    }
    syncGeometry(ix0 - 1, ix1 + 1, iz0 - 1, iz1 + 1);
  }

  /** Aplica padrões Zen tradicionais opcionais (ondas, anéis concêntricos ou plano). */
  function applyPresetPattern(preset = 'waves', recordUndo = true) {
    if (recordUndo) snapshotForUndo();

    for (let iz = 0; iz <= GRID_NZ; iz++) {
      for (let ix = 0; ix <= GRID_NX; ix++) {
        const { x, z } = gridToWorld(ix, iz);
        const idx = gridIdx(ix, iz);
        if (preset === 'flat') {
          heights[idx] = (Math.sin(x * 19.3 + z * 13.7) * 0.0018);
          continue;
        }

        // Anéis concêntricos próximos às pedras misturados suavemente às ondas longitudinais
        let ringInfluence = 0;
        let ringHeight = 0;
        for (let r = 0; r < rocksState.length; r++) {
          const rk = rocksState[r];
          const d = Math.hypot(x - rk.x, z - rk.z) - rk.r;
          if (d < 1.15) {
            const w = Math.max(0, 1 - d / 1.15);
            const hRing = Math.cos(Math.max(0, d) * (Math.PI * 2 / 0.16)) * 0.024;
            if (w > ringInfluence) {
              ringInfluence = w;
              ringHeight = hRing;
            }
          }
        }

        const waveZ = preset === 'rings'
          ? z * (1 + 0.06 * Math.sin(x * 0.5))
          : z + Math.sin(x * 0.58) * 0.28;
        const linearGrooves = Math.cos(waveZ * (Math.PI * 2 / 0.16)) * 0.022;

        // Suaviza perto da borda interna da moldura
        const borderX = Math.max(0, 1 - Math.max(0, Math.abs(x) - (BASIN_W * 0.5 - 0.35)) / 0.35);
        const borderZ = Math.max(0, 1 - Math.max(0, Math.abs(z) - (BASIN_D * 0.5 - 0.35)) / 0.35);
        const fade = Math.min(borderX, borderZ);

        const blended = ringHeight * ringInfluence + linearGrooves * (1 - ringInfluence);
        heights[idx] = blended * fade;
      }
    }
    syncGeometry(0, GRID_NX, 0, GRID_NZ);
  }

  function sampleHeightAt(wx, wz) {
    const { fx, fz } = worldToGrid(wx, wz);
    const ix = Math.max(0, Math.min(GRID_NX, Math.round(fx)));
    const iz = Math.max(0, Math.min(GRID_NZ, Math.round(fz)));
    return heights[gridIdx(ix, iz)];
  }

  // Inicializa com sulcos Zen serenos em torno das pedras
  applyPresetPattern('waves', false);

  return {
    mesh: sandMesh,
    heights,
    get undoCount() { return undoStack.length; },
    snapshotForUndo,
    undo,
    testRakeCollision,
    clampRakePosition,
    carveStrokeSegment,
    stampRockCollar,
    applyPresetPattern,
    sampleHeightAt,
    clearUndoHistory() { undoStack.length = 0; },
    dispose() {
      geo.dispose();
    },
  };
}
