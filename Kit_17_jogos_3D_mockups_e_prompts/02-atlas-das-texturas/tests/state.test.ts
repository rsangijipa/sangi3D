import { describe, expect, it } from 'vitest';
import { initialState, reducer, summarize, compareOrder, type Action, type SessionState } from '../src/game/state';
import { fillChoice, makeChallenge, toggleChoice, validCompanionSet, LIMITS } from '../src/game/rules';
import { SAMPLE_IDS, STEPS } from '../src/game/content';

const run = (s: SessionState, ...actions: Action[]) => actions.reduce(reducer, s);
const started = (mode: 'livre' | 'guiado' = 'guiado') => run(initialState(7), { type: 'start', mode });

describe('fluxo e FSM', () => {
  it('começa na entrada e vai para a primeira etapa', () => {
    const s = started();
    expect(s.phase).toBe('jogo');
    expect(s.step).toBe(0);
    expect(s.visited).toEqual(['escolher']);
  });

  it('exige duas amostras para avançar da escolha, mas pular completa de forma reprodutível', () => {
    let s = started();
    s = reducer(s, { type: 'next' });
    expect(s.step).toBe(0);
    const a = reducer(s, { type: 'skip' });
    const b = reducer(s, { type: 'skip' });
    expect(a.step).toBe(1);
    expect(a.chosen).toHaveLength(2);
    expect(a.chosen).toEqual(b.chosen);
    expect(a.counters.skips).toBe(1);
  });

  it('percorre todas as etapas até o resumo', () => {
    let s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'slate' });
    for (let i = 0; i < STEPS.length; i++) s = reducer(s, { type: 'next' });
    expect(s.phase).toBe('resumo');
    expect(s.visited).toHaveLength(STEPS.length);
  });

  it('luz difusa ao observar e rasante a seguir', () => {
    let s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'wool' }, { type: 'next' });
    expect(s.lampOn).toBe(false);
    s = reducer(s, { type: 'next' });
    expect(s.lampOn).toBe(true);
    expect(s.tool).toBe('luz');
  });

  it('pausa bloqueia comandos até retomar', () => {
    let s = run(started(), { type: 'pause' });
    expect(s.paused).toBe(true);
    const blocked = reducer(s, { type: 'choose', id: 'cork' });
    expect(blocked).toBe(s);
    s = run(s, { type: 'resume' }, { type: 'choose', id: 'cork' });
    expect(s.chosen).toEqual(['cork']);
    expect(s.counters.pauses).toBe(1);
  });

  it('voltar e reiniciar', () => {
    let s = run(started(), { type: 'skip' }, { type: 'back' });
    expect(s.step).toBe(0);
    expect(s.counters.backs).toBe(1);
    s = reducer(s, { type: 'reset' });
    expect(s.phase).toBe('entrada');
    expect(s.collection).toEqual([]);
  });
});

describe('limites de manipulação', () => {
  it('luminária presa a -75..75 e 15..65', () => {
    let s = started();
    s = reducer(s, { type: 'setLamp', angle: 400, elevation: -20 });
    expect(s.lampAngle).toBe(75);
    expect(s.lampElevation).toBe(15);
    s = reducer(s, { type: 'nudgeLamp', dAngle: -1000, dElevation: 1000 });
    expect(s.lampAngle).toBe(-75);
    expect(s.lampElevation).toBe(65);
  });

  it('zoom 1–3× e lupa dentro da bandeja', () => {
    let s = run(started(), { type: 'setZoom', zoom: 9 }, { type: 'moveMagnifier', x: 5, z: -5 });
    expect(s.zoom).toBe(3);
    expect(s.magnifierPos).toEqual([LIMITS.magnifier.x, -LIMITS.magnifier.z]);
    s = reducer(s, { type: 'setZoom', zoom: 0 });
    expect(s.zoom).toBe(1);
  });

  it('rotação normalizada sem acumular', () => {
    const s = run(started(), { type: 'rotate', delta: -30 }, { type: 'rotate', delta: 750 });
    expect(s.rotation).toBe(0);
    expect(s.counters.rotations).toBe(2);
  });
});

describe('escolha e coleção', () => {
  it('livre troca instantaneamente; guiado não passa de duas', () => {
    expect(toggleChoice(['cork', 'wool'], 'slate', SAMPLE_IDS, 'livre')).toEqual(['wool', 'slate']);
    expect(toggleChoice(['cork', 'wool'], 'slate', SAMPLE_IDS, 'guiado')).toEqual(['cork', 'wool']);
    expect(toggleChoice(['cork', 'wool'], 'cork', SAMPLE_IDS, 'guiado')).toEqual(['wool']);
  });

  it('guardar duas vezes não duplica e atualiza a entrada', () => {
    let s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'leaf' }, { type: 'next' });
    s = run(s, { type: 'save', id: 'cork' }, { type: 'toggleDescriptor', id: 'cork', descriptor: 'rugoso' }, { type: 'save', id: 'cork' });
    expect(s.collection).toHaveLength(1);
    expect(s.collection[0].descriptors).toEqual(['rugoso']);
    expect(s.counters.saves).toBe(1);
    s = reducer(s, { type: 'setPreference', id: 'cork', preference: 'gostei' });
    expect(s.collection[0].preference).toBe('gostei');
    s = reducer(s, { type: 'remove', id: 'cork' });
    expect(s.collection).toHaveLength(0);
    expect(reducer(s, { type: 'remove', id: 'cork' })).toBe(s);
  });

  it('descritores só para amostras escolhidas; preferência pode ser omitida', () => {
    let s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'leaf' });
    expect(reducer(s, { type: 'toggleDescriptor', id: 'wool', descriptor: 'fibroso' })).toBe(s);
    s = run(s, { type: 'save', id: 'leaf' });
    expect(s.collection[0].preference).toBeNull();
  });

  it('comparação troca de lado sem perder a escolha', () => {
    const s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'slate' });
    expect(compareOrder(s)).toEqual(['cork', 'slate']);
    expect(compareOrder(reducer(s, { type: 'swapCompare' }))).toEqual(['slate', 'cork']);
  });

  it('experimentar outra mantém o atlas', () => {
    let s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'slate' }, { type: 'save', id: 'cork' }, { type: 'tryAnother' });
    expect(s.step).toBe(0);
    expect(s.chosen).toEqual([]);
    expect(s.collection).toHaveLength(1);
    s = reducer(s, { type: 'next' });
    expect(s.step).toBe(0);
  });
});

describe('modo acompanhado', () => {
  it('aceita apenas 2 a 4 amostras distintas', () => {
    expect(validCompanionSet(['cork'])).toBe(false);
    expect(validCompanionSet(['cork', 'cork'])).toBe(false);
    expect(validCompanionSet(['cork', 'wool', 'slate', 'leaf', 'linen'])).toBe(false);
    expect(validCompanionSet(['cork', 'wool', 'slate'])).toBe(true);
  });

  it('limita o conjunto e recusa amostras fora dele', () => {
    let s = reducer(initialState(3), { type: 'start', mode: 'acompanhado', companion: ['slate', 'leaf', 'wool'] });
    expect(s.allowed).toEqual(['slate', 'leaf', 'wool']);
    s = reducer(s, { type: 'choose', id: 'cork' });
    expect(s.chosen).toEqual([]);
    expect(reducer(initialState(3), { type: 'start', mode: 'acompanhado', companion: ['cork'] }).phase).toBe('entrada');
  });
});

describe('semente e resumo', () => {
  it('mesma semente, mesmo preenchimento e mesmo desafio', () => {
    expect(fillChoice([], SAMPLE_IDS, 42)).toEqual(fillChoice([], SAMPLE_IDS, 42));
    expect(makeChallenge(SAMPLE_IDS, 9, 2)).toEqual(makeChallenge(SAMPLE_IDS, 9, 2));
    const c = makeChallenge(['cork', 'wool'], 1, 0);
    expect(c.options).toContain(c.target);
    expect(new Set(c.options).size).toBe(c.options.length);
  });

  it('resumo é serializável e sem inferências', () => {
    const s = run(started(), { type: 'choose', id: 'cork' }, { type: 'choose', id: 'slate' }, { type: 'save', id: 'cork' }, { type: 'hint' }, { type: 'finish' });
    const sum = summarize(s, 65_400);
    expect(sum.activeSeconds).toBe(65);
    expect(sum.hintsUsed).toBe(1);
    expect(JSON.parse(JSON.stringify(sum))).toEqual(sum);
    const { note: _note, ...data } = sum;
    expect(JSON.stringify(data)).not.toMatch(/diagn|ansie|transtorno|score|pontua/i);
  });

  it('estado extremo: ações inválidas não quebram', () => {
    let s = started();
    s = run(s, { type: 'goto', step: 99 }, { type: 'goto', step: -1 }, { type: 'back' }, { type: 'remove', id: 'cork' }, { type: 'setActive', id: 'cork' });
    expect(s.step).toBe(0);
    for (let i = 0; i < 20; i++) s = reducer(s, { type: 'hint' });
    expect(s.hintLevel).toBe(STEPS[0].hints.length);
  });
});
