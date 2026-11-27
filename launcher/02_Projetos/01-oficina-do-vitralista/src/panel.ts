export type Point = [number, number];
export const molds = ['roseta', 'botanico', 'geometrico'] as const;
export type Mold = typeof molds[number];
export const colors = {
  ambar: { name: 'Âmbar', glass: '#db860c', light: '#ffb237' },
  cobalto: { name: 'Azul-cobalto', glass: '#244a9a', light: '#537cff' },
  esmeralda: { name: 'Verde-esmeralda', glass: '#15836a', light: '#50ecc0' },
  rubi: { name: 'Rubi', glass: '#ac2943', light: '#ff6275' },
  opalino: { name: 'Opalino', glass: '#e8d3a5', light: '#ffecb2' },
};
export type Color = keyof typeof colors;
export type Pane = { id: string; outline: Point[]; center: Point; proposed: Color };
export type Seam = { id: string; panes: [string, string]; path: Point[] };
export type Work = { panes: Record<string, Color>; solder: Record<string, number> };

export const radius = 0.49;
const palettes: Record<Mold, Color[]> = {
  roseta: ['ambar', 'cobalto', 'esmeralda', 'rubi', 'opalino', 'esmeralda'],
  botanico: ['esmeralda', 'opalino', 'esmeralda', 'ambar', 'rubi', 'opalino'],
  geometrico: ['cobalto', 'rubi', 'ambar', 'opalino', 'esmeralda', 'cobalto'],
};

export function createPanel(mold: Mold) {
  const count = { roseta: 8, botanico: 10, geometrico: 6 }[mold];
  const angle = (i: number) => (i / count) * Math.PI * 2 + Math.PI / 2;
  const point = (r: number, a: number): Point => [r * Math.cos(a), r * Math.sin(a)];
  const rInner = mold === 'botanico' ? 0.112 : 0.135;
  const rMiddle = 0.32;
  const sample = (n: number, at: (t: number) => Point) => Array.from({ length: n + 1 }, (_, i) => at(i / n));
  const arc = (band: number, i: number) => sample(14, (t) => {
    const a = angle(i + t + (mold === 'botanico' && band === 1 ? 0.23 : 0));
    if (band === 1 && mold === 'geometrico') {
      const start = point(rMiddle, angle(i));
      const end = point(rMiddle, angle(i + 1));
      return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
    }
    const r = [rInner, rMiddle, radius][band] - (band === 1 ? Math.sin(Math.PI * t) ** 2 * (mold === 'botanico' ? -0.07 : -0.046) : 0);
    return point(r, a);
  });
  const spoke = (band: number, i: number) => sample(9, (t) => {
    const r0 = [rInner, rMiddle][band];
    const r1 = [rMiddle, radius][band];
    const twist = mold === 'botanico' ? (band === 0 ? t : 1 - t) * 0.23 : 0;
    const bend = mold === 'geometrico' ? 0 : Math.sin(t * Math.PI) * (band === 0 ? 0.13 : -0.10);
    return point(r0 + (r1 - r0) * t, angle(i + twist + bend));
  });
  const seams: Seam[] = [];
  const palette = palettes[mold];
  const panes: Pane[] = [{
    id: 'centro', outline: Array.from({ length: count }, (_, i) => arc(0, i).slice(0, -1)).flat(),
    center: [0, 0], proposed: 'ambar',
  }];
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    for (let band = 0; band < 2; band++) {
      const outline = [
        ...spoke(band, i).slice(0, -1),
        ...arc(band + 1, i).slice(0, -1),
        ...spoke(band, i + 1).reverse().slice(0, -1),
        ...arc(band, i).reverse().slice(0, -1),
      ];
      panes.push({
        id: `${band}-${i}`, outline,
        center: point(band === 0 ? 0.239 : 0.425, angle(i + 0.5 + (mold === 'botanico' ? 0.12 : 0))),
        proposed: palette[(i + band * 2) % palette.length],
      });
      seams.push({ id: `raio-${band}-${i}`, panes: [`${band}-${i}`, `${band}-${next}`], path: spoke(band, i + 1) });
    }
    seams.push({ id: `miolo-${i}`, panes: ['centro', `0-${i}`], path: arc(0, i) });
    seams.push({ id: `anel-${i}`, panes: [`0-${i}`, `1-${i}`], path: arc(1, i) });
  }
  return { panes, seams };
}

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';
export const fullSolder = 255;

export function createWorkshop(stored?: unknown, initial: Mold = 'roseta') {
  const panels = Object.fromEntries(molds.map(id => [id, createPanel(id)])) as Record<Mold, ReturnType<typeof createPanel>>;
  const jobs = {} as Partial<Record<Mold, Work>>;
  let mold = initial;

  for (const id of molds) {
    const prior = isObject(stored) ? stored[id] : undefined;
    if (!isObject(prior) || !isObject(prior.panes) || !isObject(prior.solder)) continue;
    const work: Work = { panes: {}, solder: {} };
    for (const pane of panels[id].panes) {
      const color = prior.panes[pane.id];
      if (typeof color === 'string' && Object.hasOwn(colors, color)) work.panes[pane.id] = color as Color;
    }
    for (const seam of panels[id].seams) {
      const mask = prior.solder[seam.id];
      if (typeof mask === 'number' && Number.isInteger(mask) && mask > 0 && mask <= fullSolder && seam.panes.every(key => work.panes[key])) {
        work.solder[seam.id] = mask;
      }
    }
    jobs[id] = work;
  }

  function current(): Work {
    if (!jobs[mold]) {
      const ids = mold === 'roseta' ? ['centro', '0-0', '0-1', '0-2', '0-3', '1-1'] : ['centro', '0-0', '0-1'];
      jobs[mold] = { panes: Object.fromEntries(ids.map(id => [id, panels[mold].panes.find(pane => pane.id === id)!.proposed])), solder: {} };
    }
    return jobs[mold]!;
  }

  return {
    get mold() { return mold; },
    get panel() { return panels[mold]; },
    get work() { return current(); },
    useMold(id: Mold) { mold = id; },
    snapshot() { current(); return jobs; },
    place(id: string, color: Color) {
      if (!panels[mold].panes.some(pane => pane.id === id) || current().panes[id] === color) return false;
      current().panes[id] = color;
      return true;
    },
    canSolder(seam: Seam) { return seam.panes.every(id => Boolean(current().panes[id])); },
    solder(id: string, from: number, to: number) {
      const seam = panels[mold].seams.find(entry => entry.id === id);
      const work = current();
      if (!seam || !seam.panes.every(key => work.panes[key])) return false;
      const index = (t: number) => Math.max(0, Math.min(7, Math.floor(t * 8)));
      const first = index(Math.min(from, to));
      const last = index(Math.max(from, to));
      const mask = ((1 << (last - first + 1)) - 1) << first;
      const old = work.solder[id] ?? 0;
      if ((old | mask) === old) return false;
      work.solder[id] = old | mask;
      return true;
    },
  };
}
