import type { Intensity, Mode, Region, Sensation } from './content.ts';
import { empty, hasContent, isRegion, isSensation, toggle, validIntensity, type Entry } from './rules.ts';

export type Phase = 'entry' | 'region' | 'sensation' | 'intensity' | 'review' | 'done';
export interface State {
  version: 1;
  seed: number;
  mode: Mode;
  phase: Phase;
  bodyView: 'front' | 'back';
  fictionalMode: boolean;
  saveConsent: boolean;
  paused: boolean;
  exited: boolean;
  entries: Entry[];
  draft: Entry;
  editing: number | null;
  shortcuts: { review: boolean };
}
export const initial = (seed = 1117): State => ({
  version: 1, seed, mode: 'free', phase: 'entry', bodyView: 'front', fictionalMode: true,
  saveConsent: false, paused: false, exited: false, entries: [], draft: empty(), editing: null,
  shortcuts: { review: false },
});
export type Action =
  | { type: 'mode'; mode: Mode }
  | { type: 'start'; fictional: boolean }
  | { type: 'region'; id: Region }
  | { type: 'sensation'; id: Sensation }
  | { type: 'word'; word: string }
  | { type: 'intensity'; value: Intensity }
  | { type: 'flip' | 'back' | 'next' | 'skip' | 'another' | 'cancelEdit' | 'exit' | 'reset' | 'clear' | 'discardPoint' | 'demo' }
  | { type: 'edit' | 'remove'; index: number }
  | { type: 'pause'; value: boolean }
  | { type: 'finish'; save: boolean }
  | { type: 'restore'; entries: Entry[]; fictional: boolean; mode: Mode };

function commit(state: State, phase: Phase): State {
  const entry = { ...state.draft, customWord: state.draft.customWord.trim() };
  const entries = [...state.entries];
  if (state.editing !== null) {
    if (hasContent(entry)) entries[state.editing] = entry;
    else entries.splice(state.editing, 1);
  } else if (hasContent(entry)) entries.push(entry);
  return { ...state, entries, phase, editing: null, shortcuts: { review: false }, draft: empty() };
}
export function reducer(s: State, a: Action): State {
  if (a.type === 'reset') return initial(s.seed);
  if (a.type === 'exit') return { ...initial(s.seed), phase: 'done', exited: true };
  if (a.type === 'pause') return { ...s, paused: a.value };
  if (s.paused || s.phase === 'done') return s;

  switch (a.type) {
    case 'mode': return s.phase === 'entry' ? { ...s, mode: a.mode } : s;
    case 'start': return s.phase === 'entry' ? {
      ...s, phase: 'region', fictionalMode: a.fictional, draft: s.fictionalMode === a.fictional ? s.draft : empty(),
    } : s;
    case 'demo': return s.phase === 'entry'
      ? { ...s, phase: 'sensation', fictionalMode: true, draft: { ...empty(), regionIds: ['foreL'], sensationIds: ['waves'] } } : s;
    case 'restore': return s.phase === 'entry' ? { ...s, entries: a.entries, phase: 'review', fictionalMode: a.fictional, mode: a.mode } : s;
    case 'flip': return { ...s, bodyView: s.bodyView === 'front' ? 'back' : 'front' };
    case 'region': {
      if (s.phase !== 'region' || !isRegion(a.id)) return s;
      const list = a.id === 'unknown' ? s.draft.regionIds.filter(id => id === a.id) : s.draft.regionIds.filter(id => id !== 'unknown');
      return { ...s, draft: { ...s.draft, regionIds: toggle(list, a.id) } };
    }
    case 'sensation': return s.phase === 'sensation' && isSensation(a.id)
      ? { ...s, draft: { ...s.draft, sensationIds: toggle(s.draft.sensationIds, a.id) } } : s;
    case 'word': return s.phase === 'sensation' ? { ...s, draft: { ...s.draft, customWord: a.word.slice(0, 80) } } : s;
    case 'intensity': return s.phase === 'intensity' && validIntensity(a.value) ? { ...s, draft: { ...s.draft, intensity: a.value } } : s;
    case 'edit': return s.phase === 'review' && s.entries[a.index]
      ? { ...s, draft: s.entries[a.index], phase: 'region', editing: a.index, shortcuts: { review: true } } : s;
    case 'cancelEdit': return s.editing !== null ? { ...s, draft: empty(), phase: 'review', editing: null, shortcuts: { review: false } } : s;
    case 'remove': return s.phase === 'review' ? { ...s, entries: s.entries.filter((_, i) => i !== a.index) } : s;
    case 'clear': return s.phase === 'review' ? { ...s, entries: [], draft: empty() } : s;
    case 'discardPoint': return s.phase === 'intensity' ? commit({ ...s, draft: empty() }, 'review') : s;
    case 'another': return s.phase === 'review' ? { ...s, draft: empty(), phase: 'region', shortcuts: { review: true } }
      : s.phase === 'intensity' ? commit(s, 'region') : s;
    case 'finish': return s.phase === 'review' && (!a.save || s.entries.length > 0)
      ? { ...s, phase: 'done', saveConsent: a.save } : s;
    case 'back':
      if (s.phase === 'review') {
        const index = s.entries.length - 1;
        return index >= 0
          ? { ...s, phase: 'intensity', draft: s.entries[index], editing: index, shortcuts: { review: true } }
          : { ...s, phase: 'intensity' };
      }
      if (s.phase === 'intensity') return { ...s, phase: 'sensation' };
      if (s.phase === 'sensation') return { ...s, phase: 'region' };
      if (s.phase === 'region') return s.shortcuts.review ? { ...s, phase: 'review', draft: empty(), editing: null, shortcuts: { review: false } } :
        s.entries.length ? { ...s, phase: 'review', draft: empty() } : { ...s, phase: 'entry' };
      return s;
    case 'next':
    case 'skip': {
      const skip = a.type === 'skip';
      if (s.phase === 'entry') return skip ? { ...s, phase: 'review' } : s;
      if (s.phase === 'region') return { ...s, phase: 'sensation', draft: { ...s.draft, regionIds: skip ? [] : s.draft.regionIds } };
      if (s.phase === 'sensation') return { ...s, phase: 'intensity', draft: skip ? { ...s.draft, sensationIds: [], customWord: '' } : s.draft };
      if (s.phase === 'intensity') return commit(skip ? { ...s, draft: { ...s.draft, intensity: null } } : s, 'review');
      return s;
    }
  }
}
