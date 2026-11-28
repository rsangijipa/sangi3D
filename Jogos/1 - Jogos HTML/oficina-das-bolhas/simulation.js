export const defaults = Object.freeze({ ring: 14, breath: 45, wind: 0, mode: 'free' });
const limit = 28;

const examples = [
  [0.16, 1.89, 0.78, 0.57],
  [-0.81, 1.44, 0.57, 0.27],
  [0.86, 1.23, 0.82, 0.36],
  [0.73, 2.49, -0.13, 0.23],
  [-0.55, 2.27, 0.06, 0.22],
  [-0.08, 1.07, 1.36, 0.13],
  [0.98, 1.78, -0.44, 0.16],
  [-1.13, 1.84, -0.38, 0.11]
];

export function bubbleSimulation() {
  let nextId, random;
  const state = { settings: { ...defaults }, bubbles: [], time: 0, wet: false, popped: 0, merges: 0, maxDiameter: 0 };

  function noise() {
    random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
    return random / 4294967296;
  }

  function add(x, y, z, radius, demonstration = false, dragX = 0, dragY = 0) {
    if (state.bubbles.length >= limit) state.bubbles.shift();
    const phase = noise() * Math.PI * 2;
    const bubble = {
      id: nextId++, x, y, z, radius, phase, demonstration,
      vx: demonstration ? 0 : (noise() - .5) * .23 + dragX,
      vy: demonstration ? .009 : .08 + dragY,
      vz: demonstration ? 0 : .1 + noise() * .15,
      age: 0, lifetime: demonstration ? 70 + noise() * 20 : 20 + noise() * 15
    };
    state.bubbles.push(bubble);
    if (!demonstration) state.maxDiameter = Math.max(state.maxDiameter, Math.round(radius * 90));
    return bubble;
  }

  function reset() {
    nextId = 1;
    random = 1629;
    Object.assign(state, { settings: { ...defaults }, bubbles: [], time: 0, wet: false, popped: 0, merges: 0, maxDiameter: 0 });
    for (const item of examples) add(...item, true);
  }

  function dip() { state.wet = true; }

  function release(position, drag = { x: 0, y: 0 }) {
    if (!state.wet) return [];
    state.wet = false;
    const { mode, ring, breath } = state.settings;
    const size = ring / 34;
    const pressure = breath / 100;
    const radius = mode === 'giant' ? .38 + size * (.36 + pressure * .8) : .082 + size * (.12 + pressure * .35);
    const count = mode === 'giant' ? 1 : 1 + Math.floor(pressure * 4);
    const released = [];
    for (let index = 0; index < count; index++) {
      const spread = (index - (count - 1) / 2) * (radius * 2 + .055);
      const variation = index === 0 ? 1 : .68 + noise() * .24;
      const x = position.x + spread + (mode === 'giant' ? radius * .4 : 0);
      const y = Math.max(radius + .08, position.y + index * .11 + (mode === 'giant' ? radius * .26 : 0));
      const z = position.z + .19 + index * .1;
      released.push(add(x, y, z, radius * variation, false, drag.x, drag.y));
    }
    return released;
  }

  function pop(id) {
    const index = state.bubbles.findIndex(bubble => bubble.id === id);
    if (index < 0) return null;
    state.popped++;
    return state.bubbles.splice(index, 1)[0];
  }

  function step(dt) {
    state.time += dt;
    for (const bubble of state.bubbles) {
      bubble.age += dt;
      const drift = Math.sin(bubble.phase + state.time * .86) * .035;
      const speed = bubble.demonstration ? .013 : .25 + bubble.radius * .1;
      const crosswind = state.settings.wind * (bubble.demonstration ? .0017 : .008);
      const drag = Math.min(1, dt * 1.55);
      bubble.vx += (drift + crosswind - bubble.vx) * drag;
      bubble.vy += (speed * (1 + Math.abs(state.settings.wind) * .003) - bubble.vy) * drag;
      bubble.vz += (drift * .55 - bubble.vz) * drag;
      bubble.x += bubble.vx * dt;
      bubble.y += bubble.vy * dt;
      bubble.z += bubble.vz * dt;
    }
    state.bubbles = state.bubbles.filter(bubble => bubble.age < bubble.lifetime && Math.abs(bubble.x) < 5 && bubble.y < 5.5);
    for (let i = 0; i < state.bubbles.length; i++) {
      const a = state.bubbles[i];
      if (a.demonstration || a.age < 1.15) continue;
      for (let j = i + 1; j < state.bubbles.length; j++) {
        const b = state.bubbles[j];
        if (b.demonstration || b.age < 1.15) continue;
        const contactDistance = (a.radius + b.radius) * .58;
        if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > contactDistance) continue;
        const otherShare = b.radius ** 3 / (a.radius ** 3 + b.radius ** 3);
        a.x += (b.x - a.x) * otherShare;
        a.y += (b.y - a.y) * otherShare;
        a.z += (b.z - a.z) * otherShare;
        a.radius = Math.cbrt(a.radius ** 3 + b.radius ** 3);
        a.age = .8;
        state.maxDiameter = Math.max(state.maxDiameter, Math.round(a.radius * 90));
        state.bubbles.splice(j, 1);
        state.merges++;
        break;
      }
    }
  }

  reset();
  return { state, reset, dip, release, pop, step };
}
