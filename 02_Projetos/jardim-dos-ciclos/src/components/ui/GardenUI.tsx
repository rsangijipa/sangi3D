import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Camera,
  ChevronLeft,
  ChevronUp,
  CloudSun,
  Droplets,
  Eye,
  Maximize2,
  Flower2,
  Move,
  RotateCcw,
  Save,
  Sparkles,
  Sprout,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  Wind,
  X,
} from 'lucide-react';
import { useGardenStore } from '../../store/useGardenStore';
import {
  CarePropId,
  GROWTH_STAGES,
  PanelTabId,
  PROP_LABELS,
  SEASONS,
  SEEDS,
  SeasonId,
  SeedId,
  TimeSpeedId,
  getStageFromProgress,
} from '../../types/garden';

/** Servido pelo Launcher, a raiz do site é o Launcher de ambientes. */
const LAUNCHER_HREF = '/';
const COLLAPSE_KEY = 'ambientes:controles-recolhidos';

interface GardenUIProps {
  onExportImage: () => void;
}

const LIGHT_PRESETS = [
  { label: 'Amanhecer', value: 0.14 },
  { label: 'Manhã', value: 0.36 },
  { label: 'Fim de Tarde', value: 0.68 },
  { label: 'Crepúsculo', value: 0.91 },
];

const TIME_SPEEDS: Array<{ id: TimeSpeedId; label: string }> = [
  { id: 'pausado', label: 'Pausado' },
  { id: 'lento', label: 'Lento' },
  { id: 'contemplativo', label: 'Contemplativo' },
];

const CARE_PROPS_LIST: CarePropId[] = [
  'regador',
  'borrifador',
  'tigela',
  'caderno',
  'pano',
  'pedras',
  'etiquetas',
];

function getLightLabel(val: number): string {
  if (val < 0.24) return 'Amanhecer';
  if (val < 0.52) return 'Manhã';
  if (val < 0.82) return 'Fim de Tarde';
  return 'Crepúsculo';
}

export const GardenUI: React.FC<GardenUIProps> = ({ onExportImage }) => {
  const seedId = useGardenStore((s) => s.seedId);
  const selectedSeedToPlant = useGardenStore((s) => s.selectedSeedToPlant);
  const growthProgress = useGardenStore((s) => s.growthProgress);
  const moisture = useGardenStore((s) => s.moisture);
  const waterIntensity = useGardenStore((s) => s.waterIntensity);
  const lightCycle = useGardenStore((s) => s.lightCycle);
  const seasonId = useGardenStore((s) => s.seasonId);
  const timeSpeed = useGardenStore((s) => s.timeSpeed);
  const activePanel = useGardenStore((s) => s.activePanel);
  const rearrangeMode = useGardenStore((s) => s.rearrangeMode);
  const contemplativeMode = useGardenStore((s) => s.contemplativeMode);
  const audioEnabled = useGardenStore((s) => s.audioEnabled);
  const reducedMotion = useGardenStore((s) => s.reducedMotion);
  const audioCaption = useGardenStore((s) => s.audioCaption);
  const toastMessage = useGardenStore((s) => s.toastMessage);
  const journal = useGardenStore((s) => s.journal);

  const setActivePanel = useGardenStore((s) => s.setActivePanel);
  const setSelectedSeedToPlant = useGardenStore((s) => s.setSelectedSeedToPlant);
  const plantSeed = useGardenStore((s) => s.plantSeed);
  const setWaterIntensity = useGardenStore((s) => s.setWaterIntensity);
  const triggerWatering = useGardenStore((s) => s.triggerWatering);
  const setLightCycle = useGardenStore((s) => s.setLightCycle);
  const setSeason = useGardenStore((s) => s.setSeason);
  const setTimeSpeed = useGardenStore((s) => s.setTimeSpeed);
  const setGrowthProgress = useGardenStore((s) => s.setGrowthProgress);
  const advanceToNextStage = useGardenStore((s) => s.advanceToNextStage);
  const toggleRearrangeMode = useGardenStore((s) => s.toggleRearrangeMode);
  const cyclePropSlot = useGardenStore((s) => s.cyclePropSlot);
  const toggleContemplativeMode = useGardenStore((s) => s.toggleContemplativeMode);
  const toggleAudio = useGardenStore((s) => s.toggleAudio);
  const toggleReducedMotion = useGardenStore((s) => s.toggleReducedMotion);
  const addJournalEntry = useGardenStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useGardenStore((s) => s.deleteJournalEntry);
  const saveGardenExplicit = useGardenStore((s) => s.saveGardenExplicit);
  const resetGarden = useGardenStore((s) => s.resetGarden);

  const [entryTitle, setEntryTitle] = useState('');
  const [entryNote, setEntryNote] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const currentStage = getStageFromProgress(growthProgress);
  const currentSeed = SEEDS[seedId];
  const currentSeason = SEASONS[seasonId];

  // Fechar painel com Escape para navegação por teclado
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmReset) {
          setConfirmReset(false);
        } else if (activePanel) {
          setActivePanel(null);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePanel, confirmReset, setActivePanel]);

  // Barra Imersiva: o "modo contemplação" é o estado recolhido padrão (tecla H, lembrado entre ambientes)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('imv-root');
    root.style.setProperty('--imv-accent', '#d9a066');
    try {
      const want = localStorage.getItem(COLLAPSE_KEY) === '1';
      if (want !== useGardenStore.getState().contemplativeMode) toggleContemplativeMode();
    } catch {
      /* armazenamento indisponível */
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'h' || e.key === 'H') useGardenStore.getState().toggleContemplativeMode();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('imv-collapsed', contemplativeMode);
    try {
      localStorage.setItem(COLLAPSE_KEY, contemplativeMode ? '1' : '0');
    } catch {
      /* armazenamento indisponível */
    }
  }, [contemplativeMode]);

  const panelTransition = reducedMotion
    ? { duration: 0.01 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() && !entryNote.trim()) return;
    addJournalEntry(entryTitle, entryNote);
    setEntryTitle('');
    setEntryNote('');
  };

  const navItems: Array<{
    id: PanelTabId | 'reiniciar' | 'salvar' | 'exportar';
    label: string;
    icon: React.ReactNode;
    action: () => void;
    isActive?: boolean;
  }> = [
    {
      id: 'plantar',
      label: 'Plantar',
      icon: <Sprout size={18} aria-hidden="true" />,
      action: () => setActivePanel('plantar'),
      isActive: activePanel === 'plantar',
    },
    {
      id: 'regar',
      label: 'Regar',
      icon: <Droplets size={18} aria-hidden="true" />,
      action: () => setActivePanel('regar'),
      isActive: activePanel === 'regar',
    },
    {
      id: 'luz',
      label: 'Luz',
      icon: <Sun size={18} aria-hidden="true" />,
      action: () => setActivePanel('luz'),
      isActive: activePanel === 'luz',
    },
    {
      id: 'estacao',
      label: 'Estação',
      icon: <CloudSun size={18} aria-hidden="true" />,
      action: () => setActivePanel('estacao'),
      isActive: activePanel === 'estacao',
    },
    {
      id: 'registro',
      label: 'Meu registro',
      icon: <BookOpen size={18} aria-hidden="true" />,
      action: () => setActivePanel('registro'),
      isActive: activePanel === 'registro',
    },
    {
      id: 'reiniciar',
      label: 'Reiniciar jardim',
      icon: <RotateCcw size={18} aria-hidden="true" />,
      action: () => setConfirmReset(true),
    },
    {
      id: 'salvar',
      label: 'Salvar',
      icon: <Save size={18} aria-hidden="true" />,
      action: () => saveGardenExplicit(),
    },
    {
      id: 'exportar',
      label: 'Exportar imagem',
      icon: <Camera size={18} aria-hidden="true" />,
      action: () => onExportImage(),
    },
  ];

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div className="garden-ui-layer">
      {/* BARRA IMERSIVA SUPERIOR (padrão de todos os ambientes do Launcher) */}
      <header className="imv-top imv-glass" role="toolbar" aria-label="Controles da estufa">
        <a className="imv-back" href={LAUNCHER_HREF} target="_top" title="Voltar ao Launcher de ambientes">
          <ChevronLeft aria-hidden="true" />
          <span className="imv-label">Ambientes</span>
        </a>
        <div className="imv-title" aria-live="polite">
          <strong>Jardim dos Ciclos</strong>
          <span>
            {currentStage.label} · {currentSeed.name} · {currentSeason.label}
          </span>
        </div>
        <div className="imv-spacer" />
        <div className="imv-actions">
          <button
            type="button"
            className={`imv-btn ${rearrangeMode ? 'is-active' : ''}`}
            onClick={toggleRearrangeMode}
            aria-pressed={rearrangeMode}
            title="Reorganizar elementos da bancada"
          >
            <Move aria-hidden="true" />
            <span className="imv-label">Organizar</span>
          </button>
          <button
            type="button"
            className={`imv-btn ${audioEnabled ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-pressed={audioEnabled}
            aria-label={audioEnabled ? 'Desativar áudio ambiente' : 'Ativar áudio ambiente'}
            title={audioEnabled ? 'Silenciar estufa' : 'Ativar som ambiente suave'}
          >
            {audioEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
            <span className="imv-label">Som</span>
          </button>
          <button
            type="button"
            className={`imv-btn imv-icon ${reducedMotion ? 'is-active' : ''}`}
            onClick={toggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-label="Alternar modo de movimento reduzido"
            title="Modo de movimento reduzido"
          >
            <Wind aria-hidden="true" />
          </button>
        </div>
        <div className="imv-actions" style={{ overflow: 'visible' }}>
          <span className="imv-sep" />
          <button type="button" className="imv-btn imv-icon" onClick={toggleFullscreen} title="Tela cheia" aria-label="Tela cheia">
            <Maximize2 aria-hidden="true" />
          </button>
          <button type="button" className="imv-btn" onClick={toggleContemplativeMode} title="Recolher controles (H)">
            <ChevronUp aria-hidden="true" />
            <span className="imv-label">Recolher</span>
          </button>
        </div>
      </header>
      <button type="button" className="imv-reveal" onClick={toggleContemplativeMode} title="Mostrar controles (H)">
        <Eye aria-hidden="true" />
        <span className="imv-label">Mostrar controles</span>
      </button>

      {/* FAIXA DE MODO ORGANIZAR BANCADA (ACESSÍVEL POR CLIQUE E TECLADO) */}
      <AnimatePresence>
        {rearrangeMode && !contemplativeMode && (
          <motion.aside
            className="rearrange-banner"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={panelTransition}
            aria-label="Reorganizar elementos de cuidado"
          >
            <div className="rearrange-banner-head">
              <span>Clique nos objetos na bancada ou escolha abaixo para reposicionar:</span>
              <button
                type="button"
                className="rearrange-done-btn"
                onClick={toggleRearrangeMode}
              >
                Concluir
              </button>
            </div>
            <div className="rearrange-chips">
              {CARE_PROPS_LIST.map((propId) => (
                <button
                  key={propId}
                  type="button"
                  className="chip-btn"
                  onClick={() => cyclePropSlot(propId)}
                >
                  {PROP_LABELS[propId]}
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* PAINEL LATERAL FLUTUANTE CONTEXTUAL */}
      <AnimatePresence>
        {activePanel && !contemplativeMode && (
          <motion.aside
            key={activePanel}
            className="garden-side-panel"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={panelTransition}
            role="dialog"
            aria-modal="false"
            aria-label="Painel de cuidado do jardim"
          >
            <div className="panel-header">
              <h2 className="panel-title">
                {activePanel === 'plantar' && 'Sementes & Ciclo'}
                {activePanel === 'regar' && 'Água & Umidade'}
                {activePanel === 'luz' && 'Luz & Tempo'}
                {activePanel === 'estacao' && 'Estações da Estufa'}
                {activePanel === 'registro' && 'Meu Registro'}
              </h2>
              <button
                type="button"
                className="panel-close-btn"
                onClick={() => setActivePanel(null)}
                aria-label="Fechar painel"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="panel-body">
              {/* ABA: PLANTAR */}
              {activePanel === 'plantar' && (
                <div className="panel-section">
                  <p className="panel-intro">
                    Escolha uma semente para depositar na terra preparada do vaso central.
                  </p>
                  <div className="seed-grid" role="radiogroup" aria-label="Escolha de sementes">
                    {(Object.keys(SEEDS) as SeedId[]).map((id) => {
                      const s = SEEDS[id];
                      const selected = selectedSeedToPlant === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`seed-card ${selected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedSeedToPlant(id)}
                        >
                          <div className="seed-card-top">
                            <span
                              className="seed-swatch"
                              style={{ backgroundColor: s.blossomColor, borderColor: s.leafColor }}
                              aria-hidden="true"
                            />
                            <div>
                              <div className="seed-name">{s.name}</div>
                              <div className="seed-latin">{s.latinName}</div>
                            </div>
                          </div>
                          <p className="seed-desc">{s.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    className="primary-action-btn"
                    onClick={() => plantSeed(selectedSeedToPlant)}
                  >
                    <Sprout size={18} aria-hidden="true" />
                    <span>Plantar {SEEDS[selectedSeedToPlant].name}</span>
                  </button>

                  <div className="stage-timeline">
                    <div className="stage-timeline-head">
                      <span>Estágio atual: <strong>{currentStage.label}</strong></span>
                      <button
                        type="button"
                        className="subtle-link-btn"
                        onClick={advanceToNextStage}
                      >
                        Observar próximo estágio
                      </button>
                    </div>
                    <p className="stage-note">{currentStage.shortNote}</p>
                    <div className="stage-dots" role="list" aria-label="Estados do ciclo botânico">
                      {GROWTH_STAGES.map((st) => {
                        const isCur = st.id === currentStage.id;
                        const isPassed = growthProgress >= st.minProgress;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            className={`stage-pill ${isCur ? 'is-current' : isPassed ? 'is-passed' : ''}`}
                            onClick={() =>
                              setGrowthProgress(
                                st.minProgress + (st.maxProgress - st.minProgress) * 0.48
                              )
                            }
                          >
                            {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA: REGAR */}
              {activePanel === 'regar' && (
                <div className="panel-section">
                  <p className="panel-intro">
                    Ajuste a intensidade da água. Doses suaves acionam o borrifador; regas mais profundas inclinam o regador de cobre.
                  </p>

                  <div className="meter-block">
                    <div className="meter-labels">
                      <span>Umidade da terra</span>
                      <strong>{Math.round(moisture * 100)}%</strong>
                    </div>
                    <div className="meter-track" aria-hidden="true">
                      <div
                        className="meter-fill"
                        style={{ width: `${Math.round(moisture * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="slider-group">
                    <label htmlFor="water-intensity-slider" className="slider-label">
                      <span>Intensidade de água</span>
                      <strong>
                        {waterIntensity < 0.38
                          ? 'Névoa suave'
                          : waterIntensity < 0.72
                          ? 'Rega equilibrada'
                          : 'Rega generosa'}
                      </strong>
                    </label>
                    <input
                      id="water-intensity-slider"
                      type="range"
                      min={0.15}
                      max={1}
                      step={0.01}
                      value={waterIntensity}
                      onChange={(e) => setWaterIntensity(parseFloat(e.target.value))}
                      className="editorial-slider"
                    />
                  </div>

                  <div className="action-row">
                    <button
                      type="button"
                      className="primary-action-btn"
                      onClick={() => triggerWatering()}
                    >
                      <Droplets size={18} aria-hidden="true" />
                      <span>
                        {waterIntensity < 0.38 ? 'Borrifar névoa' : 'Regar com cobre'}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="secondary-action-btn"
                      onClick={() => triggerWatering('borrifador')}
                    >
                      Borrifar folhas
                    </button>
                  </div>
                </div>
              )}

              {/* ABA: LUZ E PASSAGEM DE TEMPO */}
              {activePanel === 'luz' && (
                <div className="panel-section">
                  <p className="panel-intro">
                    Conduza a claridade pelas vidraças da estufa e observe como as folhas se inclinam suavemente em resposta à luz.
                  </p>

                  <div className="slider-group">
                    <label htmlFor="light-cycle-slider" className="slider-label">
                      <span>Ciclo de luz</span>
                      <strong>{getLightLabel(lightCycle)}</strong>
                    </label>
                    <input
                      id="light-cycle-slider"
                      type="range"
                      min={0.05}
                      max={0.96}
                      step={0.01}
                      value={lightCycle}
                      onChange={(e) => setLightCycle(parseFloat(e.target.value))}
                      className="editorial-slider"
                    />
                  </div>

                  <div className="preset-grid">
                    {LIGHT_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className={`preset-btn ${
                          Math.abs(lightCycle - preset.value) < 0.08 ? 'is-selected' : ''
                        }`}
                        onClick={() => setLightCycle(preset.value)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="divider-line" />

                  <div className="slider-group">
                    <span className="slider-label">
                      <span>Passagem de tempo</span>
                      <strong>
                        {TIME_SPEEDS.find((t) => t.id === timeSpeed)?.label}
                      </strong>
                    </span>
                    <div className="preset-grid preset-grid-3">
                      {TIME_SPEEDS.map((sp) => (
                        <button
                          key={sp.id}
                          type="button"
                          className={`preset-btn ${timeSpeed === sp.id ? 'is-selected' : ''}`}
                          onClick={() => setTimeSpeed(sp.id)}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="secondary-action-btn full-width"
                    onClick={advanceToNextStage}
                  >
                    <Sparkles size={16} aria-hidden="true" />
                    <span>Avançar suavemente para próximo estágio</span>
                  </button>
                </div>
              )}

              {/* ABA: ESTAÇÃO */}
              {activePanel === 'estacao' && (
                <div className="panel-section">
                  <p className="panel-intro">
                    Alterne a estação para transformar discretamente a temperatura da luz, o vidro da estufa e a atmosfera.
                  </p>
                  <div className="season-list" role="radiogroup" aria-label="Estações do ano">
                    {(Object.keys(SEASONS) as SeasonId[]).map((id) => {
                      const s = SEASONS[id];
                      const active = seasonId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={`season-card ${active ? 'is-selected' : ''}`}
                          onClick={() => setSeason(id)}
                        >
                          <div className="season-card-head">
                            <span
                              className="season-dot"
                              style={{ backgroundColor: s.sunTint }}
                              aria-hidden="true"
                            />
                            <span className="season-name">{s.label}</span>
                          </div>
                          <p className="season-desc">{s.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ABA: MEU REGISTRO */}
              {activePanel === 'registro' && (
                <div className="panel-section">
                  <p className="panel-intro">
                    Um caderno pessoal para anotar pequenos detalhes percebidos ao longo do ciclo — apenas para você guardar.
                  </p>

                  <form className="journal-form" onSubmit={handleSaveEntry}>
                    <div className="field-group">
                      <label htmlFor="journal-title" className="field-label">
                        Título opcional
                      </label>
                      <input
                        id="journal-title"
                        type="text"
                        value={entryTitle}
                        onChange={(e) => setEntryTitle(e.target.value)}
                        placeholder="Ex.: Luz na terracota, Primeira folha..."
                        maxLength={80}
                        className="editorial-input"
                      />
                    </div>

                    <div className="field-group">
                      <label htmlFor="journal-note" className="field-label">
                        O que você observa nesse ciclo?
                      </label>
                      <textarea
                        id="journal-note"
                        rows={3}
                        value={entryNote}
                        onChange={(e) => setEntryNote(e.target.value)}
                        placeholder="Escreva livremente o que chama sua atenção neste momento..."
                        maxLength={400}
                        className="editorial-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      className="primary-action-btn"
                      disabled={!entryTitle.trim() && !entryNote.trim()}
                    >
                      <BookOpen size={17} aria-hidden="true" />
                      <span>Guardar no caderno</span>
                    </button>
                  </form>

                  <div className="journal-list" aria-label="Anotações salvas">
                    {journal.length === 0 ? (
                      <p className="journal-empty">
                        O caderno ainda está em branco.
                      </p>
                    ) : (
                      journal.map((item) => {
                        const dateStr = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        });
                        const stageObj = GROWTH_STAGES.find((st) => st.id === item.stageId);
                        return (
                          <article key={item.id} className="journal-entry-card">
                            <div className="journal-entry-head">
                              <div>
                                <h3 className="journal-entry-title">{item.title}</h3>
                                <div className="journal-entry-meta">
                                  {dateStr} · {SEEDS[item.seedId].name} · {stageObj?.label}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="journal-delete-btn"
                                onClick={() => deleteJournalEntry(item.id)}
                                aria-label={`Remover anotação ${item.title}`}
                              >
                                <Trash2 size={15} aria-hidden="true" />
                              </button>
                            </div>
                            {item.note && <p className="journal-entry-text">{item.note}</p>}
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* LEGENDAS SONORAS ACESSÍVEIS E NOTIFICAÇÕES SUAVES */}
      <div className="feedback-stack" aria-live="polite" aria-atomic="true">
        <AnimatePresence>
          {audioCaption && (
            <motion.div
              key="audio-caption"
              className="audio-caption-pill"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={panelTransition}
            >
              <Flower2 size={14} aria-hidden="true" />
              <span>Som: {audioCaption}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              key="toast"
              className="toast-pill"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={panelTransition}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MENU PRINCIPAL INFERIOR EDITORIAL */}
      <nav className="imv-bottom imv-glass" aria-label="Menu principal do jardim">
        {navItems.map((item) => (
          <button
            key={String(item.id)}
            type="button"
            className={`imv-btn ${item.isActive ? 'is-active' : ''}`}
            onClick={item.action}
            aria-pressed={item.isActive}
          >
            {item.icon}
            <span className="imv-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* DIÁLOGO SUAVE DE CONFIRMAÇÃO PARA REINICIAR JARDIM */}
      <AnimatePresence>
        {confirmReset && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmReset(false)}
          >
            <motion.div
              className="confirm-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="reset-dialog-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={panelTransition}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="reset-dialog-title" className="panel-title">
                Reiniciar o jardim?
              </h2>
              <p className="panel-intro">
                A terra do vaso será renovada para um novo começo. Suas anotações no caderno continuarão preservadas.
              </p>
              <div className="action-row">
                <button
                  type="button"
                  className="secondary-action-btn"
                  onClick={() => setConfirmReset(false)}
                >
                  Continuar neste ciclo
                </button>
                <button
                  type="button"
                  className="primary-action-btn"
                  onClick={() => {
                    resetGarden();
                    setConfirmReset(false);
                  }}
                >
                  Renovar vaso
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
