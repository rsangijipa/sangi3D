export const SIDE = 21;
export const CELL = 0.31;
export const TOTAL = SIDE * SIDE;
export const STORAGE_KEY = 'sangi3d-040-mosaicos-v1';

export const colors = {
  marfim: { name: 'Marfim', hex: '#e6d3ab' },
  cobalto: { name: 'Cobalto', hex: '#184d83' },
  turquesa: { name: 'Turquesa', hex: '#347e82' },
  terracota: { name: 'Terracota', hex: '#bd5939' },
  acafrao: { name: 'Açafrão', hex: '#d8a13d' },
  oliva: { name: 'Oliva', hex: '#687448' },
};

export const shapes = {
  quadrado: { name: 'Quadrado', points: [[-.405, -.423], [.417, -.385], [.414, .405], [-.427, .414]] },
  triangulo: { name: 'Triângulo', points: [[-.420, -.419], [.418, -.414], [-.410, .419]] },
  losango: { name: 'Losango', points: [[-.441, .036], [-.022, -.444], [.444, -.027], [.04, .448]] },
};

export const grouts = {
  areia: { name: 'Areia', hex: '#c4ac86' },
  cal: { name: 'Cal', hex: '#dacab2' },
  ardósia: { name: 'Ardósia', hex: '#657172' },
};

export const presets = {
  rosa: 'Rosa dos ventos',
  limao: 'Ramo de limoeiro',
  mare: 'Peixes da maré',
  livre: 'Composição livre',
};

export function noise(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function motif(id, x, y) {
  const edge = Math.max(Math.abs(x), Math.abs(y));
  const along = Math.abs(x) === edge ? y : x;
  const radius = Math.hypot(x, y);
  const angle = Math.atan2(y, x);
  const dominant = id === 'limao' ? 'oliva' : 'cobalto';
  if (edge === 10) return Math.abs(along) % 4 === 0 ? 'acafrao' : dominant;
  if (edge === 9) return 'marfim';
  if (edge === 8) return Math.abs(along) % 4 === 2 ? 'terracota' : (id === 'limao' ? 'acafrao' : 'turquesa');

  if (id === 'rosa') {
    if (radius < 1.6) return 'acafrao';
    if (radius < 2.6) return 'terracota';
    const point = Math.abs(Math.cos(4 * angle));
    const reach = 2.35 + 4.7 * point ** 6;
    if (radius < reach) return Math.abs(Math.cos(2 * angle)) > .64 ? 'cobalto' : 'turquesa';
    if (radius > 5.65 && radius < 6.55) return 'acafrao';
    if (edge >= 6 && Math.min(Math.abs(x), Math.abs(y)) >= 5) return edge === 7 ? 'turquesa' : 'oliva';
    return 'marfim';
  }

  if (id === 'limao') {
    const fruit = [[-2, -4], [2, -2], [-3, 2], [2, 4]];
    if (fruit.some(([fx, fy]) => ((x - fx) / 1.5) ** 2 + ((y - fy) / 1.9) ** 2 < 1)) {
      return y < -3 && x === -2 ? 'marfim' : 'acafrao';
    }
    const leaf = [[-4, -5, 1], [3, -5, -1], [-3, -1, -1], [4, 2, 1], [-2, 5, 1]];
    if (leaf.some(([lx, ly, direction]) => ((x - lx) * .55) ** 2 + (y - ly - direction * (x - lx) * .6) ** 2 < 1.1)) return 'oliva';
    if (x === Math.round(Math.sin(y * .67)) || (x === 1 && y === -4)) return 'oliva';
    if (edge === 7 && Math.abs(along) >= 5) return 'acafrao';
    return 'marfim';
  }

  const orientation = y < 0 ? 1 : -1;
  const fishX = x * orientation;
  const fishY = Math.abs(y) - 3.5;
  if (fishX === 3 && Math.abs(fishY) === .5) return 'acafrao';
  if ((fishX / 4.7) ** 2 + (fishY / 2.4) ** 2 < 1) {
    return fishX > 1 || Math.abs(fishY) < .6 ? 'cobalto' : 'turquesa';
  }
  if (fishX < -4 && Math.abs(fishY) < (Math.abs(fishX) - 3) * .8) return 'cobalto';
  if (y === 0 && x % 3 === 0) return 'turquesa';
  if (Math.abs(x) === 6 && Math.abs(y) === 6) return 'acafrao';
  return 'marfim';
}

export function makeBoard(preset = 'rosa') {
  const tiles = Array.from({ length: TOTAL }, (_, index) => {
    const x = index % SIDE - 10;
    const y = Math.floor(index / SIDE) - 10;
    if (preset === 'livre' || (Math.abs(x) < 7 && Math.abs(y) < 7 && noise(index + 620) < .045)) return null;
    return {
      color: motif(preset, x, y),
      shape: 'quadrado',
      angle: 90 * Math.floor(noise(index + 149) * 4),
      cut: false,
    };
  });
  return { version: 1, preset, grout: 'areia', tiles, filled: Array(TOTAL).fill(false) };
}

export function readBoard(input) {
  const board = JSON.parse(input);
  if (board?.version !== 1 || !Object.hasOwn(presets, board.preset) ||
      !Object.hasOwn(grouts, board.grout) || board.tiles?.length !== TOTAL ||
      board.filled?.length !== TOTAL ||
      !Array.isArray(board.tiles) || !Array.isArray(board.filled)) throw new Error('Arquivo de mosaico inválido.');
  const tiles = board.tiles.map((tile) => {
    if (tile === null) return null;
    if (!tile || !Object.hasOwn(colors, tile.color) || !Object.hasOwn(shapes, tile.shape) ||
        !Number.isInteger(tile.angle) || tile.angle < 0 || tile.angle > 359 || tile.angle % 45 ||
        typeof tile.cut !== 'boolean') throw new Error('Peça inválida no arquivo.');
    return { color: tile.color, shape: tile.shape, angle: tile.angle, cut: tile.cut };
  });
  if (board.filled.some((filled) => typeof filled !== 'boolean')) throw new Error('Rejunte inválido no arquivo.');
  return { version: 1, preset: board.preset, grout: board.grout, tiles, filled: board.filled };
}

export function editBoard(board, index, tool, brush) {
  const tile = board.tiles[index];
  if (tool === 'grout') {
    if (board.filled[index] && board.grout === brush.grout) return 'same';
    board.grout = brush.grout;
    board.filled[index] = true;
    return 'changed';
  }
  if (tool === 'place') {
    if (tile) return 'overlap';
    board.tiles[index] = { color: brush.color, shape: brush.shape, angle: brush.angle, cut: brush.cut };
    return 'changed';
  }
  if (!tile) return 'empty';
  if (tool === 'erase') board.tiles[index] = null;
  if (tool === 'paint') {
    if (tile.color === brush.color) return 'same';
    board.tiles[index] = { ...tile, color: brush.color };
  }
  if (tool === 'rotate') board.tiles[index] = { ...tile, angle: normalizeAngle(tile.angle + 45) };
  if (tool === 'cut') {
    if (tile.cut) return 'same';
    board.tiles[index] = { ...tile, cut: true };
  }
  return 'changed';
}
