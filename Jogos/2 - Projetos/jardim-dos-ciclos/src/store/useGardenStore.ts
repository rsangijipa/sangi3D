import { create } from 'zustand';
import {
  CarePropId,
  GROWTH_STAGES,
  INITIAL_PROP_LAYOUTS,
  JournalEntry,
  PanelTabId,
  PROP_LABELS,
  SEEDS,
  SeasonId,
  SeedId,
  TimeSpeedId,
  getStageFromProgress,
} from '../types/garden';
import { gardenAudio } from '../audio/gardenAudio';

const STORAGE_KEY = 'jardim-dos-ciclos-state-v1';

interface PersistedState {
  seedId: SeedId;
  selectedSeedToPlant: SeedId;
  growthProgress: number;
  moisture: number;
  waterIntensity: number;
  lightCycle: number; // 0 = amanhecer, 0.35 = manhã, 0.68 = fim de tarde, 0.94 = crepúsculo
  seasonId: SeasonId;
  timeSpeed: TimeSpeedId;
  propSlotIndex: Record<CarePropId, number>;
  journal: JournalEntry[];
}

interface GardenState extends PersistedState {
  // Transient interaction & UI state
  activePanel: PanelTabId;
  isPlantingAnim: boolean;
  plantingStartTime: number;
  isWateringAnim: boolean;
  wateringStartTime: number;
  wateringMode: 'regador' | 'borrifador';
  leafTouchPulse: number;
  rearrangeMode: boolean;
  contemplativeMode: boolean;
  audioEnabled: boolean;
  reducedMotion: boolean;
  audioCaption: string | null;
  toastMessage: string | null;
  lastSavedAt: string | null;

  // Actions
  setActivePanel: (panel: PanelTabId) => void;
  setSelectedSeedToPlant: (seedId: SeedId) => void;
  plantSeed: (seedId?: SeedId) => void;
  setWaterIntensity: (intensity: number) => void;
  triggerWatering: (forceMode?: 'regador' | 'borrifador') => void;
  setLightCycle: (val: number) => void;
  setSeason: (season: SeasonId) => void;
  setTimeSpeed: (speed: TimeSpeedId) => void;
  setGrowthProgress: (val: number) => void;
  advanceToNextStage: () => void;
  tickSimulation: (deltaSeconds: number) => void;
  pulseLeafTouch: () => void;
  toggleRearrangeMode: () => void;
  cyclePropSlot: (prop: CarePropId) => void;
  toggleContemplativeMode: () => void;
  toggleAudio: () => void;
  toggleReducedMotion: () => void;
  setAudioCaption: (caption: string | null) => void;
  showToast: (msg: string) => void;
  addJournalEntry: (title: string, note: string) => void;
  deleteJournalEntry: (id: string) => void;
  saveGardenExplicit: () => void;
  resetGarden: () => void;
}

const DEFAULT_PROP_SLOTS: Record<CarePropId, number> = {
  regador: 0,
  borrifador: 0,
  tigela: 0,
  caderno: 0,
  pano: 0,
  pedras: 0,
  etiquetas: 0,
};

const DEFAULT_PERSISTED: PersistedState = {
  seedId: 'camomila',
  selectedSeedToPlant: 'camomila',
  growthProgress: 0.43, // Starts at "Muda" so opening scene feels immediately alive and editorial
  moisture: 0.56,
  waterIntensity: 0.62,
  lightCycle: 0.68, // Golden late-afternoon light ("Fim de Tarde")
  seasonId: 'outono', // Warm golden editorial tones
  timeSpeed: 'lento',
  propSlotIndex: { ...DEFAULT_PROP_SLOTS },
  journal: [
    {
      id: 'initial-1',
      title: 'Primeiro olhar na estufa',
      note: 'A luz oblíqua de fim de tarde toca a borda da terracota enquanto as primeiras folhas se abrem sem pressa.',
      createdAt: new Date().toISOString(),
      seedId: 'camomila',
      stageId: 'muda',
      seasonId: 'outono',
    },
  ],
};

function loadInitialState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_PERSISTED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...DEFAULT_PERSISTED,
      ...parsed,
      propSlotIndex: {
        ...DEFAULT_PROP_SLOTS,
        ...(parsed.propSlotIndex || {}),
      },
      journal: Array.isArray(parsed.journal) ? parsed.journal : DEFAULT_PERSISTED.journal,
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

function persistState(state: PersistedState) {
  if (typeof window === 'undefined') return;
  try {
    const toSave: PersistedState = {
      seedId: state.seedId,
      selectedSeedToPlant: state.selectedSeedToPlant,
      growthProgress: state.growthProgress,
      moisture: state.moisture,
      waterIntensity: state.waterIntensity,
      lightCycle: state.lightCycle,
      seasonId: state.seasonId,
      timeSpeed: state.timeSpeed,
      propSlotIndex: state.propSlotIndex,
      journal: state.journal,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore storage quota errors
  }
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let toastTimer: number | null = null;
let captionTimer: number | null = null;

export const useGardenStore = create<GardenState>((set, get) => {
  const initial = loadInitialState();

  return {
    ...initial,
    activePanel: null,
    isPlantingAnim: false,
    plantingStartTime: 0,
    isWateringAnim: false,
    wateringStartTime: 0,
    wateringMode: 'regador',
    leafTouchPulse: 0,
    rearrangeMode: false,
    contemplativeMode: false,
    audioEnabled: false,
    reducedMotion: detectReducedMotion(),
    audioCaption: null,
    toastMessage: null,
    lastSavedAt: null,

    setActivePanel: (panel) =>
      set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),

    setSelectedSeedToPlant: (seedId) => set({ selectedSeedToPlant: seedId }),

    plantSeed: (explicitSeed) => {
      const state = get();
      const targetSeed = explicitSeed ?? state.selectedSeedToPlant;
      const now = performance.now() / 1000;
      gardenAudio.playPlantSeed();
      set({
        seedId: targetSeed,
        selectedSeedToPlant: targetSeed,
        growthProgress: 0.04,
        isPlantingAnim: true,
        plantingStartTime: now,
        moisture: Math.max(state.moisture, 0.32),
      });
      persistState(get());
      get().showToast(`${SEEDS[targetSeed].name} plantada na terra preparada.`);
    },

    setWaterIntensity: (intensity) =>
      set({ waterIntensity: Math.max(0.15, Math.min(1, intensity)) }),

    triggerWatering: (forceMode) => {
      const state = get();
      const now = performance.now() / 1000;
      const mode: 'regador' | 'borrifador' =
        forceMode ?? (state.waterIntensity < 0.38 ? 'borrifador' : 'regador');
      gardenAudio.playWatering(mode === 'borrifador' ? 0.25 : state.waterIntensity);

      const addedMoisture =
        mode === 'borrifador' ? 0.16 : 0.24 + state.waterIntensity * 0.34;

      set({
        isWateringAnim: true,
        wateringStartTime: now,
        wateringMode: mode,
        moisture: Math.min(1, state.moisture + addedMoisture),
      });
      persistState(get());
      get().showToast(
        mode === 'borrifador'
          ? 'Névoa delicada borrifada sobre a planta.'
          : 'Terra umedecida com água fresca.'
      );
    },

    setLightCycle: (val) => {
      const clamped = Math.max(0, Math.min(1, val));
      set({ lightCycle: clamped });
    },

    setSeason: (seasonId) => {
      gardenAudio.playLeafRustle();
      set({ seasonId });
      persistState(get());
    },

    setTimeSpeed: (timeSpeed) => {
      set({ timeSpeed });
      persistState(get());
    },

    setGrowthProgress: (val) => {
      const clamped = Math.max(0.02, Math.min(1, val));
      set({ growthProgress: clamped });
    },

    advanceToNextStage: () => {
      const state = get();
      const currentStage = getStageFromProgress(state.growthProgress);
      const currentIdx = GROWTH_STAGES.findIndex((st) => st.id === currentStage.id);
      const nextIdx = (currentIdx + 1) % GROWTH_STAGES.length;
      const nextStage = GROWTH_STAGES[nextIdx];
      const mid =
        nextStage.minProgress + (nextStage.maxProgress - nextStage.minProgress) * 0.45;
      gardenAudio.playLeafRustle();
      set({
        growthProgress: mid,
        moisture: Math.max(0.35, state.moisture),
      });
      persistState(get());
      get().showToast(`Ciclo avançou para ${nextStage.label}.`);
    },

    tickSimulation: (deltaSeconds) => {
      const state = get();
      const now = performance.now() / 1000;
      const updates: Partial<GardenState> = {};

      // End planting animation after 2.6s
      if (state.isPlantingAnim && now - state.plantingStartTime > 2.6) {
        updates.isPlantingAnim = false;
      }

      // End watering animation after duration
      const waterDur = state.wateringMode === 'borrifador' ? 2.2 : 3.2;
      if (state.isWateringAnim && now - state.wateringStartTime > waterDur) {
        updates.isWateringAnim = false;
      }

      // Gentle moisture evaporation
      const evapRate = state.seasonId === 'verao' ? 0.0042 : state.seasonId === 'inverno' ? 0.0018 : 0.0028;
      if (state.moisture > 0.12) {
        updates.moisture = Math.max(0.12, state.moisture - evapRate * deltaSeconds);
      }

      // Organic growth progression when time is active
      if (state.timeSpeed !== 'pausado' && state.growthProgress < 0.995) {
        const baseSpeed = state.timeSpeed === 'contemplativo' ? 0.015 : 0.0038;
        const moistureFactor = 0.45 + state.moisture * 0.75;
        const lightFactor = 0.6 + Math.sin(state.lightCycle * Math.PI) * 0.55;
        updates.growthProgress = Math.min(
          0.995,
          state.growthProgress + baseSpeed * moistureFactor * lightFactor * deltaSeconds
        );
      }

      if (Object.keys(updates).length > 0) {
        set(updates);
      }
    },

    pulseLeafTouch: () => {
      gardenAudio.playLeafRustle();
      set({ leafTouchPulse: performance.now() / 1000 });
    },

    toggleRearrangeMode: () => {
      const next = !get().rearrangeMode;
      set({ rearrangeMode: next });
      get().showToast(
        next
          ? 'Modo organizar ativo: clique nos objetos da bancada para mudar sua posição.'
          : 'Arranjo da bancada mantido.'
      );
    },

    cyclePropSlot: (prop) => {
      const state = get();
      const slots = INITIAL_PROP_LAYOUTS[prop];
      const nextSlot = ((state.propSlotIndex[prop] ?? 0) + 1) % slots.length;
      gardenAudio.playCopperTouch();
      set({
        propSlotIndex: {
          ...state.propSlotIndex,
          [prop]: nextSlot,
        },
      });
      persistState(get());
      get().showToast(`${PROP_LABELS[prop]} reposicionado na bancada.`);
    },

    toggleContemplativeMode: () =>
      set((s) => ({
        contemplativeMode: !s.contemplativeMode,
        activePanel: !s.contemplativeMode ? null : s.activePanel,
      })),

    toggleAudio: () => {
      const next = !get().audioEnabled;
      gardenAudio.setEnabled(next);
      set({ audioEnabled: next });
      get().showToast(next ? 'Som ambiente da estufa ativado.' : 'Som ambiente silenciado.');
    },

    toggleReducedMotion: () => {
      const next = !get().reducedMotion;
      set({ reducedMotion: next });
      get().showToast(
        next ? 'Modo de movimento reduzido ativado.' : 'Animações suaves reativadas.'
      );
    },

    setAudioCaption: (caption) => {
      if (captionTimer !== null) window.clearTimeout(captionTimer);
      set({ audioCaption: caption });
      if (caption) {
        captionTimer = window.setTimeout(() => {
          set({ audioCaption: null });
        }, 4200);
      }
    },

    showToast: (msg) => {
      if (toastTimer !== null) window.clearTimeout(toastTimer);
      set({ toastMessage: msg });
      toastTimer = window.setTimeout(() => {
        set({ toastMessage: null });
      }, 3600);
    },

    addJournalEntry: (title, note) => {
      const state = get();
      const cleanTitle = title.trim() || 'Registro silencioso';
      const cleanNote = note.trim();
      if (!cleanNote && !title.trim()) return;

      const stage = getStageFromProgress(state.growthProgress);
      const entry: JournalEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: cleanTitle,
        note: cleanNote,
        createdAt: new Date().toISOString(),
        seedId: state.seedId,
        stageId: stage.id,
        seasonId: state.seasonId,
      };
      const nextJournal = [entry, ...state.journal].slice(0, 40);
      set({ journal: nextJournal });
      persistState(get());
      gardenAudio.playCopperTouch();
      get().showToast('Registro guardado no caderno.');
    },

    deleteJournalEntry: (id) => {
      const nextJournal = get().journal.filter((e) => e.id !== id);
      set({ journal: nextJournal });
      persistState(get());
    },

    saveGardenExplicit: () => {
      persistState(get());
      const nowStr = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      set({ lastSavedAt: nowStr });
      get().showToast(`Jardim salvo localmente às ${nowStr}.`);
    },

    resetGarden: () => {
      const now = performance.now() / 1000;
      gardenAudio.playPlantSeed();
      set({
        seedId: 'camomila',
        selectedSeedToPlant: 'camomila',
        growthProgress: 0.05,
        moisture: 0.42,
        waterIntensity: 0.62,
        lightCycle: 0.68,
        seasonId: 'primavera',
        timeSpeed: 'lento',
        propSlotIndex: { ...DEFAULT_PROP_SLOTS },
        isPlantingAnim: true,
        plantingStartTime: now,
        isWateringAnim: false,
      });
      persistState(get());
      get().showToast('Jardim reiniciado com terra renovada e nova semente.');
    },
  };
});

// Wire audio captions into store
gardenAudio.setCaptionHandler((caption) => {
  useGardenStore.getState().setAudioCaption(caption);
});
