export {createEcosystemSimulation} from './js/ecosystem.js';
export const radius = 12.5;
export const step = 1 / 60;

export const specimens = [
  {name: 'Ciliado', form: 'Forma de paramécio', detail: 'Os cílios que margeiam a membrana impulsionam o corpo. As pequenas bolsas circulares representam vacúolos.', x: -0.65, y: 0.65, z: 0.2, angle: 0.64, size: 6.3, speed: 0.52},
  {name: 'Diatomácea', form: 'Forma navicular', detail: 'A frústula de sílica forma uma carapaça estriada. Algumas diatomáceas deslizam muito lentamente sobre superfícies.', x: 2.48, y: 2.47, z: 1.12, angle: -0.64, size: 3.65, speed: 0.12},
  {name: 'Alga filamentosa', form: 'Forma de espirógira', detail: 'Os cloroplastos acompanham o filamento em espiral. O filamento deriva com a água.', x: -2.65, y: -2.12, z: -0.56, angle: -0.52, size: 6.65, speed: 0.10},
  {name: 'Ameba', form: 'Forma com pseudópodes', detail: 'As extensões transitórias da célula são pseudópodes. Elas participam da locomoção e da alimentação.', x: 2.29, y: -2.73, z: 0.69, angle: 0.18, size: 3.7, speed: 0.16},
  {name: 'Colônia verde', form: 'Forma de vólvox', detail: 'Pontos verdes distribuídos na superfície representam as células da colônia. As esferas internas representam colônias-filhas.', x: -3.32, y: 2.37, z: -0.28, angle: -0.35, size: 2.77, speed: 0.24},
];

export function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function createSimulation() {
  const random = randomGenerator(29611);
  const agents = specimens.map((specimen, index) => ({
    ...specimen,
    index,
    energy: 0,
    target: null,
    phase: random() * Math.PI * 2,
    heading: specimen.angle,
    start: {x: specimen.x, y: specimen.y, z: specimen.z},
    previous: {x: specimen.x, y: specimen.y, z: specimen.z, angle: specimen.angle},
  }));
  const food = [];
  let time = 0;

  function dropFood(x, y) {
    if (food.length >= 5 || Math.hypot(x, y) > radius - 0.42) return false;
    food.push({x, y, remaining: 22});
    return true;
  }

  function update() {
    time += step;
    let eaten = null;
    for (const agent of agents) {
      const {previous, start, phase, index} = agent;
      Object.assign(previous, {x: agent.x, y: agent.y, z: agent.z, angle: agent.angle});
      const feed = index === 0 || index === 3;
      let closest = null;
      let nearest = 4.5;
      if (feed) {
        for (const item of food) {
          const distance = Math.hypot(item.x - agent.x, item.y - agent.y);
          if (item.remaining > 0 && distance < nearest) {
            closest = item;
            nearest = distance;
          }
        }
      }
      agent.target = closest;
      agent.energy = Math.max(0, agent.energy - step * 0.13);
      if (closest && nearest < 0.62) {
        closest.remaining = 0;
        agent.target = null;
        agent.energy = 1;
        eaten = agent;
      }
      const drift = time * (0.30 + index * 0.021) + phase;
      if (agent.target) {
        const dx = agent.target.x - agent.x;
        const dy = agent.target.y - agent.y;
        const heading = Math.atan2(dy, dx);
        agent.heading += Math.atan2(Math.sin(heading - agent.heading), Math.cos(heading - agent.heading)) * step * 2.8;
        const speed = agent.speed + (index === 0 ? 0.72 : 0.36);
        agent.x += Math.cos(agent.heading) * speed * step;
        agent.y += Math.sin(agent.heading) * speed * step;
      } else {
        const homeX = start.x + Math.cos(drift) * Math.min(1.5, agent.speed * 2.75);
        const homeY = start.y + Math.sin(drift * 1.17) * Math.min(0.75, agent.speed * 1.65);
        agent.x += (homeX - agent.x) * step * 0.36;
        agent.y += (homeY - agent.y) * step * 0.36;
        agent.heading = specimens[index].angle + Math.sin(drift * 0.89) * 0.29;
      }
      agent.angle += Math.atan2(Math.sin(agent.heading - agent.angle), Math.cos(agent.heading - agent.angle)) * step * 2.3;
      agent.z = start.z + Math.sin(time * 0.24 + phase) * 0.33;
      const distance = Math.hypot(agent.x, agent.y);
      const limit = radius - agent.size / 2;
      if (distance > limit) {
        agent.x *= limit / distance;
        agent.y *= limit / distance;
      }
    }
    for (let i = food.length - 1; i >= 0; i--) {
      food[i].remaining -= step;
      if (food[i].remaining <= 0) food.splice(i, 1);
    }
    return eaten;
  }

  return {agents, food, dropFood, update, get time() { return time; }};
}
