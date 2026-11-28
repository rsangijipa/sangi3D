import React, { useMemo, useState } from 'react';
import {
  Anchor,
  BookOpen,
  Check,
  Compass,
  Play,
  RotateCcw,
  Sun,
  X,
} from 'lucide-react';
import {
  DOCK_ZONES,
  FAUNA_CATALOG,
  RIVER_LENGTH,
  STRETCHES,
  getFaunaWorldPosition,
  sampleRiver,
} from '../sim/river';
import { HudSnapshot } from '../engine/IgarapeScene';
import { TIME_PRESET_LIST, TimePresetId } from '../engine/lighting';
import { QualitySetting } from '../engine/quality';
import { ActivePanel } from './ImmersiveHUD';

interface PanelsProps {
  hud: HudSnapshot;
  activePanel: ActivePanel;
  onClosePanel: () => void;
  onSelectTimePreset: (id: TimePresetId) => void;
  onSelectQuality: (q: QualitySetting) => void;
  onTeleportStretch: (stretchId: number) => void;
  onSetVolume: (v: number) => void;
  onToggleMute: () => void;
  onSetReducedMotion: (v: boolean) => void;
  onToggleCamera: () => void;
  onReset: () => void;
  onResume: () => void;
  onExit: () => void;
}

const QUALITY_LABELS: Record<string, string> = {
  cinema: 'Cinema',
  equilibrada: 'Equilibrada',
  leve: 'Leve',
};

export const Panels: React.FC<PanelsProps> = ({
  hud,
  activePanel,
  onClosePanel,
  onSelectTimePreset,
  onSelectQuality,
  onTeleportStretch,
  onSetVolume,
  onToggleMute,
  onSetReducedMotion,
  onToggleCamera,
  onReset,
  onResume,
  onExit,
}) => {
  const [mapTab, setMapTab] = useState<'mapa' | 'diario'>('mapa');

  // Precompute top-down SVG path for the curved igarapé centerline
  const riverSvgData = useMemo(() => {
    const pts: string[] = [];
    const mapX = (wx: number) => 110 + wx * 2.75;
    const mapY = (wz: number) => 260 + wz * 0.96;
    for (let s = 0; s <= RIVER_LENGTH; s += 4) {
      const sample = sampleRiver(s);
      pts.push(`${mapX(sample.center.x).toFixed(1)},${mapY(sample.center.z).toFixed(1)}`);
    }
    return { polyline: pts.join(' '), mapX, mapY };
  }, []);

  // Pause Modal takes precedence when paused
  if (hud.phase === 'paused') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Expedição pausada"
        className="fixed inset-0 z-40 bg-[#050a07]/72 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-2xl bg-[#101912] border border-[#cde0be]/24 shadow-[0_20px_50px_rgba(0,0,0,0.75)] p-6">
          <h2 className="text-xl font-bold text-[#f3f6ee] tracking-tight">
            Expedição Pausada
          </h2>
          <p className="text-xs text-[#b7cab0] mt-1">
            {hud.stretchName} · A simulação e o áudio estão suspensos com segurança.
          </p>

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="rounded-xl bg-[#17241a] border border-[#cde0be]/12 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-[#9db697]">
                Espécies
              </div>
              <div className="text-lg font-bold text-[#eff6ea] tabular-nums mt-0.5">
                {hud.journal.length}/{FAUNA_CATALOG.length}
              </div>
            </div>
            <div className="rounded-xl bg-[#17241a] border border-[#cde0be]/12 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-[#9db697]">
                Distância
              </div>
              <div className="text-lg font-bold text-[#eff6ea] tabular-nums mt-0.5">
                {Math.round(hud.distanceTraveled)} m
              </div>
            </div>
            <div className="rounded-xl bg-[#17241a] border border-[#cde0be]/12 p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider text-[#9db697]">
                Remadas
              </div>
              <div className="text-lg font-bold text-[#eff6ea] tabular-nums mt-0.5">
                {hud.strokeCount}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onResume}
              className="min-h-[46px] w-full rounded-xl bg-[#2a7a3e] hover:bg-[#35914b] text-white font-semibold text-sm border border-[#82e296]/70 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Retomar Expedição</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] w-full rounded-xl bg-[#18251b] hover:bg-[#223426] text-[#e6efe0] font-medium text-sm border border-[#cde0be]/18 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar do Início</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="min-h-[44px] w-full rounded-xl bg-[#241917] hover:bg-[#34221e] text-[#f3ddd7] font-medium text-sm border border-[#e09c89]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sair para Tela Inicial</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activePanel === 'none') return null;

  return (
    <aside
      role="dialog"
      aria-label={
        activePanel === 'mapa'
          ? 'Mapa e Diário Naturalista'
          : activePanel === 'horario'
          ? 'Horário e Clima'
          : 'Ajustes e Diagnóstico'
      }
      className="fixed z-30 right-3 sm:right-4 bottom-[86px] sm:top-[76px] sm:bottom-[92px] w-[calc(100vw-24px)] sm:w-[376px] max-h-[68dvh] sm:max-h-none rounded-2xl bg-[#0f1811]/95 border border-[#d6e4ca]/22 shadow-[0_18px_46px_rgba(0,0,0,0.68)] flex flex-col overflow-hidden pointer-events-auto"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#d6e4ca]/14">
        <h2 className="text-sm font-bold text-[#f2f6ed] tracking-wide flex items-center gap-2">
          {activePanel === 'mapa' && (
            <>
              <Compass className="w-4 h-4 text-[#7ce08e]" />
              <span>Mapa &amp; Diário Naturalista</span>
            </>
          )}
          {activePanel === 'horario' && (
            <>
              <Sun className="w-4 h-4 text-[#f2cb6e]" />
              <span>Horário &amp; Clima do Igarapé</span>
            </>
          )}
          {activePanel === 'ajustes' && <span>Ajustes, Acessibilidade &amp; Modelo</span>}
        </h2>
        <button
          type="button"
          onClick={onClosePanel}
          aria-label="Fechar painel"
          className="w-9 h-9 rounded-lg bg-[#1a261d] hover:bg-[#253629] text-[#dce7d5] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto hud-scroll p-4 space-y-4 text-sm">
        {activePanel === 'mapa' && (
          <>
            {/* Sub-tabs: Mapa vs Diário Naturalista */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#162219] border border-[#d6e4ca]/12">
              <button
                type="button"
                onClick={() => setMapTab('mapa')}
                className={`min-h-[38px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  mapTab === 'mapa'
                    ? 'bg-[#2a7a3e] text-white'
                    : 'text-[#c9d8c0] hover:bg-[#1f3023]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Mapa do Rio</span>
              </button>
              <button
                type="button"
                onClick={() => setMapTab('diario')}
                className={`min-h-[38px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  mapTab === 'diario'
                    ? 'bg-[#2a7a3e] text-white'
                    : 'text-[#c9d8c0] hover:bg-[#1f3023]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  Diário ({hud.journal.length}/{FAUNA_CATALOG.length})
                </span>
              </button>
            </div>

            {mapTab === 'mapa' ? (
              <>
                {/* Interactive Top-Down Curved Igarapé Map */}
                <div className="rounded-xl bg-[#0a120c] border border-[#cde0be]/15 p-3">
                  <svg viewBox="0 0 220 278" className="w-full h-auto">
                    {/* Riverbank shadow corridor */}
                    <polyline
                      points={riverSvgData.polyline}
                      fill="none"
                      stroke="#1c3422"
                      strokeWidth="26"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Dark water channel */}
                    <polyline
                      points={riverSvgData.polyline}
                      fill="none"
                      stroke="#2a5943"
                      strokeWidth="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Authorized Docking Zones */}
                    {DOCK_ZONES.map((z) => {
                      const cx = riverSvgData.mapX(z.position.x);
                      const cy = riverSvgData.mapY(z.position.z);
                      return (
                        <g key={z.id}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r="5"
                            fill="#163b22"
                            stroke="#7be090"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })}
                    {/* Fauna markers */}
                    {FAUNA_CATALOG.map((f) => {
                      const pos = getFaunaWorldPosition(f, 0);
                      const cx = riverSvgData.mapX(pos.x);
                      const cy = riverSvgData.mapY(pos.z);
                      const discovered = hud.journal.some((j) => j.speciesId === f.id);
                      return (
                        <circle
                          key={f.id}
                          cx={cx}
                          cy={cy}
                          r={discovered ? 4.2 : 3.2}
                          fill={discovered ? '#65e07f' : '#f0b854'}
                          stroke="#0a120c"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {/* Live Canoe Marker */}
                    <g
                      transform={`translate(${riverSvgData.mapX(hud.x)}, ${riverSvgData.mapY(hud.z)}) rotate(${(-hud.yaw * 180) / Math.PI})`}
                    >
                      <polygon
                        points="0,-8 5,6 0,3 -5,6"
                        fill="#ffffff"
                        stroke="#1b5e2b"
                        strokeWidth="1.4"
                      />
                    </g>
                  </svg>
                  <div className="flex items-center justify-between text-[11px] text-[#b4c6ac] mt-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f0b854] inline-block" />
                      Fauna
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#65e07f] inline-block" />
                      Registrada
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Anchor className="w-3 h-3 text-[#7be090]" />
                      Atracagem
                    </span>
                  </div>
                </div>

                {/* 3 Stretches Navigation / Return Points */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#9db697]">
                    Trechos da Expedição (ir / retornar)
                  </div>
                  {STRETCHES.map((st) => {
                    const active = hud.stretchId === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          onTeleportStretch(st.id);
                          onClosePanel();
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1c3824] border-[#78df8d]/60'
                            : 'bg-[#141f17] hover:bg-[#1b2b20] border-[#cde0be]/12'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-[#f0f5eb]">
                            {st.name}
                          </span>
                          {active && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#2a7a3e] text-white">
                              Atual
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#b8cab0] mt-1 leading-relaxed">
                          {st.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Diário Naturalista Tab */
              <div className="space-y-2.5">
                <p className="text-xs text-[#b7cab0]">
                  Use o modo <strong className="text-[#eef5ea]">Observar</strong> para enquadrar e
                  fotografar cada espécie nativa nos 3 trechos do igarapé.
                </p>
                {FAUNA_CATALOG.map((sp) => {
                  const entry = hud.journal.find((j) => j.speciesId === sp.id);
                  return (
                    <div
                      key={sp.id}
                      className={`rounded-xl p-3 border ${
                        entry
                          ? 'bg-[#172c1d] border-[#72da88]/45'
                          : 'bg-[#131d16] border-[#cde0be]/12'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#0b120d] border border-[#cde0be]/14 shrink-0 flex items-center justify-center">
                          {entry?.thumbnailDataUrl ? (
                            <img
                              src={entry.thumbnailDataUrl}
                              alt={`Registro fotográfico de ${sp.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#7c9177] text-center px-1">
                              Trecho {sp.stretchId}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-[#f1f6ec] truncate">
                              {sp.name}
                            </span>
                            {entry && (
                              <span className="shrink-0 text-[#79e28f] flex items-center gap-0.5 text-[11px] font-semibold">
                                <Check className="w-3.5 h-3.5" />
                                {entry.distanceMeters}m
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] italic text-[#9eb598]">
                            {sp.scientificName}
                          </div>
                          <p className="text-[11px] text-[#c2d1ba] mt-1 leading-snug">
                            {sp.habitatNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activePanel === 'horario' && (
          <div className="space-y-2.5">
            <p className="text-xs text-[#b7cab0]">
              Transição suave de iluminação solar, névoa, reflexos na água e paisagem sonora (~3,5 s).
            </p>
            {TIME_PRESET_LIST.map((p) => {
              const active = hud.timePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectTimePreset(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1f3b26] border-[#7ce090]/65'
                      : 'bg-[#141f17] hover:bg-[#1b2b20] border-[#cde0be]/14'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f2f6ee]">{p.label}</span>
                    <span className="text-xs font-mono tabular-nums text-[#a6c49e]">
                      {p.hourLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#b9cbb1] mt-1 leading-snug">{p.subtitle}</p>
                </button>
              );
            })}
          </div>
        )}

        {activePanel === 'ajustes' && (
          <div className="space-y-4">
            {/* Quality Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9db697] mb-2">
                Qualidade Gráfica
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['auto', 'cinema', 'equilibrada', 'leve'] as QualitySetting[]).map((q) => {
                  const selected = hud.qualitySetting === q;
                  const label =
                    q === 'auto'
                      ? `Automática (${QUALITY_LABELS[hud.detectedQuality]})`
                      : QUALITY_LABELS[q];
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onSelectQuality(q)}
                      className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#2a7a3e] border-[#82e296]/70 text-white'
                          : 'bg-[#141f17] hover:bg-[#1c2c21] border-[#cde0be]/15 text-[#dbe6d5]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {hud.isSoftwareGl && (
                <p className="text-[11px] text-[#b4c5ad] mt-1.5">
                  Renderização WebGL por software detectada: perfil Leve mantido para fluidez.
                </p>
              )}
            </div>

            {/* Audio Controls */}
            <div className="rounded-xl bg-[#141f17] border border-[#cde0be]/14 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="volume-slider" className="text-xs font-semibold text-[#eef4e9]">
                  Volume Geral ({Math.round(hud.volume * 100)}%)
                </label>
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#1d2d22] hover:bg-[#273c2d] text-[#dce8d5] cursor-pointer"
                >
                  {hud.muted ? 'Ativar áudio' : 'Silenciar'}
                </button>
              </div>
              <input
                id="volume-slider"
                type="range"
                min={0}
                max={100}
                value={Math.round(hud.volume * 100)}
                onChange={(e) => onSetVolume(Number(e.target.value) / 100)}
                className="w-full accent-[#4ec768] cursor-pointer"
              />
            </div>

            {/* Accessibility & Camera */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#141f17] border border-[#cde0be]/14 cursor-pointer">
                <span className="text-xs font-medium text-[#e8f0e2]">
                  Reduzir movimento (ondas e vento)
                </span>
                <input
                  type="checkbox"
                  checked={hud.reducedMotion}
                  onChange={(e) => onSetReducedMotion(e.target.checked)}
                  className="w-4 h-4 accent-[#4ec768]"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onToggleCamera}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-[#162319] hover:bg-[#203324] border border-[#cde0be]/16 text-xs font-semibold text-[#e6efe0] cursor-pointer"
                >
                  Câmera: {hud.cameraMode === 'first_person' ? '1ª Pessoa' : 'Externa'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    onClosePanel();
                  }}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-[#271d18] hover:bg-[#382921] border border-[#e0aa84]/24 text-xs font-semibold text-[#f5e3d6] cursor-pointer"
                >
                  Reiniciar Expedição
                </button>
              </div>
            </div>

            {/* Measured Telemetry & Didactic Physical Model Transparency (§3 & §5) */}
            <div className="rounded-xl bg-[#0c140e] border border-[#cde0be]/14 p-3 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9db697]">
                Parâmetros &amp; Telemetria Medida
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-[#cedbc7] tabular-nums">
                <div>Velocidade: {hud.speedMs.toFixed(2)} m/s</div>
                <div>Correnteza: {hud.currentSpeedMs.toFixed(2)} m/s</div>
                <div>Progresso: {Math.round(hud.s)}/{RIVER_LENGTH} m</div>
                <div>Desvio lateral: {hud.lateral.toFixed(1)} m</div>
                <div>Quadro: {hud.frameTimeMs.toFixed(1)} ms</div>
                <div>Draw calls: {hud.drawCalls}</div>
                <div>Perfil ativo: {QUALITY_LABELS[hud.activeQuality]}</div>
                <div>Escala res.: {Math.round(hud.adaptiveScale * 100)}%</div>
              </div>
              <p className="text-[10.5px] text-[#9cb096] leading-relaxed pt-1 border-t border-[#cde0be]/10">
                Modelo didático: correnteza analítica parabólica (0,16–0,62 m/s), arrasto
                hidrodinâmico planar linear/quadrático (passo fixo 60 Hz), balanço harmônico
                aproximado e colisão contínua nas margens.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
