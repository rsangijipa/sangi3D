import * as THREE from 'three';
import { PALETTE, PIGMENT_COLORS, createCanvasWeaveTexture, createWoodTextures } from '../core/textures';
import { blendPigments, hexToRgb } from '../physics/kernels';

export interface PaintStationHandle {
  group: THREE.Group;
  canvasMesh: THREE.Mesh;
  pigmentBowls: THREE.Mesh[];
  cameraTarget: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  handlePointer: (
    uv: THREE.Vector2,
    prevUv: THREE.Vector2 | null,
    phase: 'start' | 'move' | 'end',
    toolId: string,
    colorHex: string,
    participant: 'A' | 'B',
    mirror: boolean
  ) => void;
  setActiveColor: (index: number) => void;
  setVisibleMaterialsCount: (count: number) => void;
  undo: () => boolean;
  redo: () => boolean;
  clear: () => void;
  exportImageDataUrl: () => string;
  dispose: () => void;
}

export function createPaintStation(scene: THREE.Scene): PaintStationHandle {
  const group = new THREE.Group();
  group.position.set(0, 0, 0.72);
  scene.add(group);

  const woodTex = createWoodTextures(2, 2);
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex.map,
    roughnessMap: woodTex.roughnessMap,
    roughness: 0.8,
    metalness: 0.04
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: '#B8964C',
    roughness: 0.35,
    metalness: 0.75
  });

  // Easel / Drafting Table Frame
  const legGeo = new THREE.BoxGeometry(0.11, 0.85, 0.11);
  for (const lx of [-1.25, 1.25]) {
    for (const lz of [-0.55, 0.48]) {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(lx, 0.425, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      group.add(leg);
    }
  }

  // Front bench / ledge for pigment bowls
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(2.75, 0.08, 0.46), woodMat);
  ledge.position.set(0, 0.72, 0.78);
  ledge.castShadow = true;
  ledge.receiveShadow = true;
  group.add(ledge);

  // Tilted Board
  const boardGroup = new THREE.Group();
  boardGroup.position.set(0, 1.05, 0.02);
  boardGroup.rotation.x = -0.52;
  group.add(boardGroup);

  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(2.78, 1.66, 0.08), woodMat);
  boardFrame.castShadow = true;
  boardFrame.receiveShadow = true;
  boardGroup.add(boardFrame);

  // Brass corner brackets
  for (const bx of [-1.32, 1.32]) {
    for (const by of [-0.76, 0.76]) {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.095), brassMat);
      bracket.position.set(bx, by, 0.005);
      boardGroup.add(bracket);
    }
  }

  // Paint Canvas (1024x640) + Impasto Bump Canvas
  const W = 1024;
  const H = 640;
  const paintCanvas = document.createElement('canvas');
  paintCanvas.width = W;
  paintCanvas.height = H;
  const pCtx = paintCanvas.getContext('2d', { willReadFrequently: true })!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = W;
  bumpCanvas.height = H;
  const bCtx = bumpCanvas.getContext('2d')!;

  const paintTex = new THREE.CanvasTexture(paintCanvas);
  paintTex.encoding = THREE.sRGBEncoding;
  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  const weaveTex = createCanvasWeaveTexture();

  const canvasMat = new THREE.MeshStandardMaterial({
    map: paintTex,
    bumpMap: bumpTex,
    bumpScale: 0.028,
    roughnessMap: weaveTex,
    roughness: 0.76,
    metalness: 0.02
  });

  const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.54, 1.46), canvasMat);
  canvasMesh.position.z = 0.044;
  canvasMesh.receiveShadow = true;
  canvasMesh.name = 'paint_surface';
  boardGroup.add(canvasMesh);

  // Dual participant glowing cursor rings (matching mockup)
  const makeCursorRing = (color: string) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.042, 0.062, 32),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    ring.position.z = 0.052;
    ring.visible = false;
    boardGroup.add(ring);
    return ring;
  };
  const ringA = makeCursorRing('#3B9BFF');
  const ringB = makeCursorRing('#FF8A3D');

  // Ceramic Jar with Brushes on left of ledge
  const jarMat = new THREE.MeshStandardMaterial({ color: '#D8CDB8', roughness: 0.65 });
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.24, 18), jarMat);
  jar.position.set(-1.08, 0.88, 0.78);
  jar.castShadow = true;
  group.add(jar);

  for (let i = 0; i < 4; i++) {
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.008, 0.34, 8),
      new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? PALETTE.wood : '#4A3424', roughness: 0.7 })
    );
    handle.position.set(-1.1 + i * 0.02, 1.03, 0.77 + (i % 2) * 0.02);
    handle.rotation.z = (i - 1.5) * 0.14;
    handle.rotation.x = 0.08;
    group.add(handle);
  }

  // 6 Ceramic Pigment Bowls on front ledge
  const pigmentBowls: THREE.Mesh[] = [];
  const bowlGeo = new THREE.CylinderGeometry(0.095, 0.068, 0.075, 20);
  const liquidGeo = new THREE.CircleGeometry(0.078, 20);
  PIGMENT_COLORS.forEach((col, i) => {
    const bx = -0.62 + i * 0.245;
    const bowl = new THREE.Mesh(
      bowlGeo,
      new THREE.MeshStandardMaterial({ color: col.hex, roughness: 0.48, metalness: 0.05 })
    );
    bowl.position.set(bx, 0.798, 0.78);
    bowl.castShadow = true;
    bowl.userData = { pigmentIndex: i };
    group.add(bowl);

    const liquid = new THREE.Mesh(
      liquidGeo,
      new THREE.MeshStandardMaterial({ color: col.hex, roughness: 0.18, metalness: 0.08 })
    );
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.set(bx, 0.836, 0.78);
    group.add(liquid);

    pigmentBowls.push(bowl);
  });

  // Paint-stained cloth on right of ledge
  const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.035, 0.34),
    new THREE.MeshStandardMaterial({ color: '#DFD2BE', roughness: 0.94 })
  );
  cloth.position.set(1.06, 0.775, 0.78);
  cloth.rotation.y = 0.22;
  cloth.castShadow = true;
  group.add(cloth);

  // Undo / Redo history
  const undoStack: ImageData[] = [];
  const redoStack: ImageData[] = [];

  const pushHistory = () => {
    undoStack.push(pCtx.getImageData(0, 0, W, H));
    if (undoStack.length > 24) undoStack.shift();
    redoStack.length = 0;
  };

  const resetCanvasBase = () => {
    pCtx.fillStyle = '#F3EAD8';
    pCtx.fillRect(0, 0, W, H);
    // Subtle paper grain
    for (let i = 0; i < 1800; i++) {
      pCtx.fillStyle = i % 2 === 0 ? 'rgba(210,194,168,0.16)' : 'rgba(255,252,245,0.22)';
      pCtx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    bCtx.fillStyle = '#707070';
    bCtx.fillRect(0, 0, W, H);
  };

  // Seed graceful initial dual gesture strokes inspired by the mockup
  const seedInitialGestures = () => {
    resetCanvasBase();
    const drawRibbonCurve = (
      pts: Array<[number, number]>,
      hexA: string,
      hexB: string,
      width: number
    ) => {
      for (let s = 0; s < pts.length - 1; s++) {
        const [x0, y0] = pts[s];
        const [x1, y1] = pts[s + 1];
        const steps = 22;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = x0 + (x1 - x0) * t;
          const y = y0 + (y1 - y0) * t;
          const col = s < pts.length / 2 ? hexA : hexB;
          drawBristleDab(x, y, x + 2, y + 1, width * (0.7 + 0.3 * Math.sin(t * Math.PI)), col, 'pincel_largo');
        }
      }
    };
    drawRibbonCurve(
      [[190, 440], [310, 470], [420, 340], [310, 220], [450, 150]],
      '#315E67',
      '#4D8B93',
      30
    );
    drawRibbonCurve(
      [[570, 460], [720, 480], [820, 340], [670, 210], [790, 160]],
      '#B86A4B',
      '#D3AC57',
      30
    );
    paintTex.needsUpdate = true;
    bumpTex.needsUpdate = true;
  };

  const drawBristleDab = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    size: number,
    colorHex: string,
    toolId: string
  ) => {
    const strokeRgb = hexToRgb(colorHex);
    const sampleX = Math.max(0, Math.min(W - 1, Math.round(x1)));
    const sampleY = Math.max(0, Math.min(H - 1, Math.round(y1)));
    const pixel = pCtx.getImageData(sampleX, sampleY, 1, 1).data;
    const isPaper = pixel[0] > 235 && pixel[1] > 225 && pixel[2] > 205;

    const finalRgb = isPaper
      ? strokeRgb
      : blendPigments([pixel[0], pixel[1], pixel[2]], strokeRgb, toolId === 'esponja' ? 0.4 : 0.72);

    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const speedPressure = Math.max(0.55, Math.min(1.25, 1.15 - dist * 0.008));
    const effSize = size * speedPressure;

    pCtx.save();
    pCtx.translate(x1, y1);
    pCtx.rotate(angle);

    if (toolId === 'espatula') {
      pCtx.fillStyle = `rgba(${finalRgb[0]},${finalRgb[1]},${finalRgb[2]},0.92)`;
      pCtx.fillRect(-effSize * 0.5, -effSize * 0.28, effSize, effSize * 0.56);
      bCtx.fillStyle = 'rgba(235,235,235,0.45)';
      bCtx.fillRect(x1 - effSize * 0.4, y1 - effSize * 0.25, effSize * 0.8, effSize * 0.5);
    } else if (toolId === 'esponja') {
      const grad = pCtx.createRadialGradient(0, 0, 2, 0, 0, effSize);
      grad.addColorStop(0, `rgba(${finalRgb[0]},${finalRgb[1]},${finalRgb[2]},0.35)`);
      grad.addColorStop(1, `rgba(${finalRgb[0]},${finalRgb[1]},${finalRgb[2]},0)`);
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(0, 0, effSize, 0, Math.PI * 2);
      pCtx.fill();
    } else {
      const bristles = toolId === 'pincel_fino' ? 5 : 11;
      for (let b = 0; b < bristles; b++) {
        const offset = ((b / (bristles - 1)) - 0.5) * effSize * 0.9;
        const alpha = 0.42 + (b % 3) * 0.16;
        pCtx.fillStyle = `rgba(${finalRgb[0]},${finalRgb[1]},${finalRgb[2]},${alpha})`;
        pCtx.beginPath();
        pCtx.ellipse(0, offset, Math.max(3, effSize * 0.35), Math.max(1.5, effSize * 0.12), 0, 0, Math.PI * 2);
        pCtx.fill();
      }
      bCtx.fillStyle = 'rgba(210,210,210,0.22)';
      bCtx.beginPath();
      bCtx.arc(x1, y1, effSize * 0.45, 0, Math.PI * 2);
      bCtx.fill();
    }
    pCtx.restore();
  };

  seedInitialGestures();

  return {
    group,
    canvasMesh,
    pigmentBowls,
    cameraTarget: new THREE.Vector3(0, 1.02, 0.72),
    cameraPosition: new THREE.Vector3(0, 2.38, 3.05),
    handlePointer(uv, prevUv, phase, toolId, colorHex, participant, mirror) {
      const ring = participant === 'A' ? ringA : ringB;
      const otherRing = participant === 'A' ? ringB : ringA;
      ring.position.x = (uv.x - 0.5) * 2.54;
      ring.position.y = (uv.y - 0.5) * 1.46;
      ring.visible = phase !== 'end';
      if (mirror) {
        otherRing.position.x = -ring.position.x;
        otherRing.position.y = ring.position.y;
        otherRing.visible = phase !== 'end';
      }

      if (phase === 'start') {
        pushHistory();
      }
      if (phase === 'end') return;

      const x1 = uv.x * W;
      const y1 = (1 - uv.y) * H;
      const x0 = prevUv ? prevUv.x * W : x1;
      const y0 = prevUv ? (1 - prevUv.y) * H : y1;

      const size =
        toolId === 'pincel_fino' ? 12 : toolId === 'pincel_largo' ? 28 : toolId === 'espatula' ? 32 : 34;

      const dist = Math.hypot(x1 - x0, y1 - y0);
      const steps = Math.max(1, Math.ceil(dist / 6));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const ix = x0 + (x1 - x0) * t;
        const iy = y0 + (y1 - y0) * t;
        drawBristleDab(x0, y0, ix, iy, size, colorHex, toolId);
        if (mirror) {
          drawBristleDab(W - x0, y0, W - ix, iy, size, colorHex, toolId);
        }
      }
      paintTex.needsUpdate = true;
      bumpTex.needsUpdate = true;
    },
    setActiveColor(index: number) {
      pigmentBowls.forEach((b, i) => {
        b.scale.setScalar(i === index ? 1.14 : 1.0);
      });
    },
    setVisibleMaterialsCount(count: number) {
      pigmentBowls.forEach((b, i) => {
        b.visible = i < count;
      });
    },
    undo() {
      const prev = undoStack.pop();
      if (!prev) return false;
      redoStack.push(pCtx.getImageData(0, 0, W, H));
      pCtx.putImageData(prev, 0, 0);
      paintTex.needsUpdate = true;
      return true;
    },
    redo() {
      const next = redoStack.pop();
      if (!next) return false;
      undoStack.push(pCtx.getImageData(0, 0, W, H));
      pCtx.putImageData(next, 0, 0);
      paintTex.needsUpdate = true;
      return true;
    },
    clear() {
      pushHistory();
      resetCanvasBase();
      paintTex.needsUpdate = true;
      bumpTex.needsUpdate = true;
    },
    exportImageDataUrl() {
      return paintCanvas.toDataURL('image/png');
    },
    dispose() {
      woodTex.map.dispose();
      woodTex.roughnessMap.dispose();
      paintTex.dispose();
      bumpTex.dispose();
      weaveTex.dispose();
      canvasMat.dispose();
    }
  };
}
