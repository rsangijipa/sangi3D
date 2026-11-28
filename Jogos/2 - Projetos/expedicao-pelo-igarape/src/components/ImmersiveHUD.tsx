import React from 'react';
import {
  Anchor,
  Binoculars,
  Camera,
  Clock,
  Crosshair,
  Eye,
  EyeOff,
  LogOut,
  Map as MapIcon,
  Pause,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FAUNA_CATALOG } from '../sim/river';
import { HudSnapshot, ToolMode } from '../engine/IgarapeScene';
import { TIME_PRESETS } from '../engine/lighting';

export type ActivePanel = 'none' | 'mapa' | 'horario' | 'ajustes';

interface ImmersiveHUDProps {
  hud: HudSnapshot;
  activePanel: ActivePanel;
  hudCollapsed: boolean;
  statusMsg: { text: string; tone: 'info' | 'success' | 'warn' } | null;
  onSelectTool: (mode: ToolMode) => void;
  onTogglePanel: (panel: ActivePanel) => void;
  onToggleCamera: () => void;
  onCapturePhoto: () => void;
  onAimNearestFauna: () => void;
  onToggleDock: () => void;
  onTogglePause: () => void;
  onExit: () => void;
  onToggleMute: () => void;
  onToggleCollapse: () => void;
  onAnalogControl: (throttle: number, steer: number) => void;
  onManualStroke: (side: -1 | 1) => void;
}

/** Custom crossed-paddles SVG icon matching the mockup's "Remar" tool button */
const PaddlesIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 19L15 9M19 19L9 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 9L17.8 4.4C18.3 3.6 19.6 3.7 19.9 4.6C20.2 5.4 19.8 6.5 19 7.2L15 9Z"
      fill="currentColor"
    />
    <path
      d="M9 9L6.2 4.4C5.7 3.6 4.4 3.7 4.1 4.6C3.8 5.4 4.2 6.5 5 7.2L9 9Z"
      fill="currentColor"
    />
  </svg>
);

/** Custom Amazonian leaf badge SVG matching top-left title pill in mockup */
const LeafBadgeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path
      d="M4 19C4 10.5 11.2 4.5 20 4.5C19.5 12.8 14.5 19.5 4 19Z"
      fill="#49b656"
    />
    <path
      d="M4.5 19.5L15.2 9.2"
      stroke="#0f1b11"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export const ImmersiveHUD: React.FC<ImmersiveHUDProps> = ({
  hud,
  activePanel,
  hudCollapsed,
  statusMsg,
  onSelectTool,
  onTogglePanel,
  onToggleCamera,
  onCapturePhoto,
  onAimNearestFauna,
  onToggleDock,
  onTogglePause,
  onExit,
  onToggleMute,
  onToggleCollapse,
  onAnalogControl,
  onManualStroke,
}) => {
  const timeInfo = TIME_PRESETS[hud.timePreset];

  if (hudCollapsed) {
    return (
      <div
        className="fixed inset-0 z-20 pointer-events-none flex justify-end items-start p-3 sm:p-4"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            onToggleCollapse();
          }}
          aria-label="Mostrar controles"
          className="pointer-events-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-[#101812]/88 hover:bg-[#19261c]/95 text-[#e8f0e2] border border-[#cde0be]/20 text-xs font-medium flex items-center gap-2 shadow-[0_6px_18px_rgba(0,0,0,0.45)] cursor-pointer"
        >
          <Eye className="w-4 h-4 text-[#7ee08f]" />
          <span>Mostrar controles</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-4"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* TOP BAR: Title Pill (left) + Compact Utility Controls (right) matching mockup */}
      <div className="flex items-start justify-between gap-2">
        {/* Top-left Title Pill + Subtle Stretch & Speed Readout */}
        <div className="flex flex-col gap-1.5 items-start max-w-[66vw]">
          <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#101812]/88 border border-[#d6e4ca]/18 shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
            <LeafBadgeIcon />
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base font-semibold text-[#f3f6ee] tracking-tight">
                Expedição pelo Igarapé
              </span>
              <span className="text-[11px] text-[#bfd1b5] hidden sm:inline tabular-nums">
                {hud.stretchName} · {hud.journal.length}/{FAUNA_CATALOG.length} espécies ·{' '}
                {hud.speedMs.toFixed(1)} m/s
              </span>
            </div>
          </div>

          {/* Mobile compact telemetry chip */}
          <div className="sm:hidden px-2.5 py-1 rounded-lg bg-[#101812]/82 border border-[#d6e4ca]/14 text-[11px] text-[#c7d7be] tabular-nums">
            T{hud.stretchId} · {hud.journal.length}/{FAUNA_CATALOG.length} esp. ·{' '}
            {hud.speedMs.toFixed(1)} m/s
          </div>
        </div>

        {/* Top-right Utility Icon Buttons matching mockup (Settings, Sound, Collapse, Pause, Exit) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={hud.muted ? 'Ativar som' : 'Silenciar som'}
            title={hud.muted ? 'Ativar som (M)' : 'Silenciar som (M)'}
            className="w-11 h-11 rounded-xl bg-[#101812]/88 hover:bg-[#1a281d] border border-[#d6e4ca]/18 text-[#e7eee1] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors cursor-pointer"
          >
            {hud.muted ? (
              <VolumeX className="w-5 h-5 text-[#e69a7a]" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#9ee0a6]" />
            )}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleCollapse();
            }}
            aria-label="Recolher controles"
            title="Recolher controles (H)"
            className="hidden sm:flex w-11 h-11 rounded-xl bg-[#101812]/88 hover:bg-[#1a281d] border border-[#d6e4ca]/18 text-[#e7eee1] items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors cursor-pointer"
          >
            <EyeOff className="w-5 h-5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onTogglePanel('ajustes');
            }}
            aria-label="Abrir ajustes"
            aria-expanded={activePanel === 'ajustes'}
            title="Ajustes e diagnóstico"
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors cursor-pointer ${
              activePanel === 'ajustes'
                ? 'bg-[#2a7a3e] border-[#77d98b] text-white'
                : 'bg-[#101812]/88 hover:bg-[#1a281d] border-[#d6e4ca]/18 text-[#e7eee1]'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onTogglePause();
            }}
            aria-label="Pausar expedição"
            title="Pausar (P ou Esc)"
            className="w-11 h-11 rounded-xl bg-[#101812]/88 hover:bg-[#1a281d] border border-[#d6e4ca]/18 text-[#e7eee1] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors cursor-pointer"
          >
            <Pause className="w-5 h-5" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onExit();
            }}
            aria-label="Sair para início"
            title="Sair para tela inicial"
            className="w-11 h-11 rounded-xl bg-[#101812]/88 hover:bg-[#35201c] border border-[#d6e4ca]/18 text-[#e7eee1] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* STATUS MESSAGE PILL (aria-live) */}
      {statusMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[108px] sm:top-[76px] left-1/2 -translate-x-1/2 z-20 max-w-[92vw] sm:max-w-xl pointer-events-none"
        >
          <div
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-center border shadow-[0_6px_18px_rgba(0,0,0,0.45)] ${
              statusMsg.tone === 'success'
                ? 'bg-[#17351f]/92 border-[#6cd482]/55 text-[#e4fbe6]'
                : statusMsg.tone === 'warn'
                ? 'bg-[#352613]/92 border-[#e4b35d]/55 text-[#fdf0d5]'
                : 'bg-[#101812]/90 border-[#cde0be]/22 text-[#e8f0e2]'
            }`}
          >
            {statusMsg.text}
          </div>
        </div>
      )}

      {/* OBSERVE / PHOTO VIEWFINDER RETICLE */}
      {hud.toolMode === 'observar' && activePanel === 'none' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div
            className={`relative w-[220px] h-[150px] sm:w-[300px] sm:h-[196px] transition-colors ${
              hud.framedFauna ? 'text-[#7ee694]' : 'text-[#e2ebd9]/65'
            }`}
          >
            {/* 4 crisp optical corner brackets */}
            <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-current rounded-tl-md" />
            <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-current rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-current rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-current rounded-br-md" />

            {/* Center optical cross */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-[1.5px] bg-current opacity-80" />
              <div className="absolute h-4 w-[1.5px] bg-current opacity-80" />
            </div>

            {/* Live species tag below viewfinder */}
            <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {hud.framedFauna ? (
                <div className="px-3 py-1 rounded-lg bg-[#102616]/92 border border-[#74dc89]/60 text-xs text-[#e8fce9] font-medium shadow-md">
                  {hud.framedFauna.name}{' '}
                  <span className="italic text-[#b6e4be]">
                    ({hud.framedFauna.scientificName})
                  </span>{' '}
                  · <span className="tabular-nums">{Math.round(hud.framedFauna.distance)} m</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-lg bg-[#101812]/82 border border-[#d6e4ca]/18 text-xs text-[#d6e0ce]">
                  Arraste para enquadrar a fauna
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CLUSTER: Contextual Action + Mobile Paddle Controls + Unified Dock + Camera Switch */}
      <div className="flex flex-col items-center gap-2.5 w-full">
        {/* Contextual Observe Shutter / Docking Action Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
          {hud.toolMode === 'observar' && (
            <>
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onCapturePhoto();
                }}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2a7a3e] hover:bg-[#35914b] text-white border border-[#82e296]/70 font-semibold text-sm flex items-center gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Fotografar</span>
                <span className="text-[11px] opacity-80 hidden sm:inline">[Espaço]</span>
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onAimNearestFauna();
                }}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#101812]/90 hover:bg-[#1a281d] text-[#e3ede0] border border-[#d6e4ca]/20 text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.45)] cursor-pointer"
              >
                <Crosshair className="w-4 h-4 text-[#8be098]" />
                <span>Focar fauna próxima</span>
              </button>
            </>
          )}

          {(hud.nearbyDockId || hud.dockedZoneId) && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleDock();
              }}
              className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_6px_18px_rgba(0,0,0,0.45)] cursor-pointer ${
                hud.dockedZoneId
                  ? 'bg-[#2a5c3a] hover:bg-[#337046] border-[#82e296]/65 text-white'
                  : 'bg-[#152418]/92 hover:bg-[#1e3523] border-[#79d98c]/50 text-[#e4f7e5]'
              }`}
            >
              <Anchor className="w-4 h-4 text-[#82e296]" />
              <span>
                {hud.dockedZoneId
                  ? `Desatracar (${hud.dockedZoneName})`
                  : `Atracar em ${hud.nearbyDockName}`}
              </span>
              <span className="text-[11px] opacity-75 hidden sm:inline">[E]</span>
            </button>
          )}
        </div>

        {/* Mobile Touch Navigation Pad (visible on narrow screens in Remar mode) */}
        {hud.toolMode === 'remar' && activePanel === 'none' && (
          <div className="sm:hidden flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              aria-label="Remar à esquerda"
              onPointerDown={() => {
                onManualStroke(-1);
                onAnalogControl(0.4, 0.85);
              }}
              onPointerUp={() => onAnalogControl(0, 0)}
              onPointerLeave={() => onAnalogControl(0, 0)}
              className="w-12 h-11 rounded-xl bg-[#101812]/88 active:bg-[#2a7a3e] border border-[#d6e4ca]/20 text-sm font-semibold text-[#eaf2e4]"
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Remar à frente"
              onPointerDown={() => onAnalogControl(1, 0)}
              onPointerUp={() => onAnalogControl(0, 0)}
              onPointerLeave={() => onAnalogControl(0, 0)}
              className="px-5 h-11 rounded-xl bg-[#2a7a3e]/92 active:bg-[#34944c] border border-[#79d98c]/55 text-xs font-semibold text-white"
            >
              ▲ Remar
            </button>
            <button
              type="button"
              aria-label="Frear canoa"
              onPointerDown={() => onAnalogControl(-0.85, 0)}
              onPointerUp={() => onAnalogControl(0, 0)}
              onPointerLeave={() => onAnalogControl(0, 0)}
              className="w-12 h-11 rounded-xl bg-[#101812]/88 active:bg-[#3a2819] border border-[#d6e4ca]/20 text-sm font-semibold text-[#eaf2e4]"
            >
              ▼
            </button>
            <button
              type="button"
              aria-label="Remar à direita"
              onPointerDown={() => {
                onManualStroke(1);
                onAnalogControl(0.4, -0.85);
              }}
              onPointerUp={() => onAnalogControl(0, 0)}
              onPointerLeave={() => onAnalogControl(0, 0)}
              className="w-12 h-11 rounded-xl bg-[#101812]/88 active:bg-[#2a7a3e] border border-[#d6e4ca]/20 text-sm font-semibold text-[#eaf2e4]"
            >
              ▶
            </button>
          </div>
        )}

        {/* MAIN BOTTOM BAR matching mockup: Centered 4-tool dock + Right camera toggle */}
        <div className="w-full flex items-end justify-between gap-2 relative">
          {/* Left spacer on desktop to keep the 4-tool dock centered */}
          <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
            <div className="px-3 py-1.5 rounded-xl bg-[#101812]/80 border border-[#d6e4ca]/14 text-[11px] text-[#cad8c2] tabular-nums">
              {timeInfo.hourLabel} · Corr. {hud.currentSpeedMs.toFixed(1)} m/s
            </div>
          </div>

          {/* Centered Segmented 4-Tool Dock (Remar · Observar · Mapa · Horário) */}
          <nav
            aria-label="Ferramentas da expedição"
            className="pointer-events-auto mx-auto max-w-[calc(100vw-68px)] overflow-x-auto hud-scroll rounded-2xl bg-[#101812]/92 border border-[#d6e4ca]/18 p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1 shadow-[0_10px_28px_rgba(0,0,0,0.55)]"
          >
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onSelectTool('remar');
              }}
              aria-pressed={hud.toolMode === 'remar' && activePanel === 'none'}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-xl text-[10.5px] sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                hud.toolMode === 'remar' && activePanel === 'none'
                  ? 'bg-[#2a7a3e] text-white border border-[#8ce89d]/75 shadow-inner'
                  : 'text-[#e3ece0] hover:bg-[#1b291e] border border-transparent'
              }`}
            >
              <PaddlesIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span>Remar</span>
            </button>

            <div className="w-px h-5 sm:h-6 bg-[#d6e4ca]/15 shrink-0" />

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onSelectTool('observar');
              }}
              aria-pressed={hud.toolMode === 'observar' && activePanel === 'none'}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-xl text-[10.5px] sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                hud.toolMode === 'observar' && activePanel === 'none'
                  ? 'bg-[#2a7a3e] text-white border border-[#8ce89d]/75'
                  : 'text-[#e3ece0] hover:bg-[#1b291e] border border-transparent'
              }`}
            >
              <Binoculars className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span>Observar</span>
            </button>

            <div className="w-px h-5 sm:h-6 bg-[#d6e4ca]/15 shrink-0" />

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onTogglePanel('mapa');
              }}
              aria-expanded={activePanel === 'mapa'}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-xl text-[10.5px] sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activePanel === 'mapa'
                  ? 'bg-[#2a7a3e] text-white border border-[#8ce89d]/75'
                  : 'text-[#e3ece0] hover:bg-[#1b291e] border border-transparent'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span>Mapa</span>
            </button>

            <div className="w-px h-5 sm:h-6 bg-[#d6e4ca]/15 shrink-0" />

            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onTogglePanel('horario');
              }}
              aria-expanded={activePanel === 'horario'}
              className={`min-h-[44px] px-2 sm:px-5 py-2 rounded-xl text-[10.5px] sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activePanel === 'horario'
                  ? 'bg-[#2a7a3e] text-white border border-[#8ce89d]/75'
                  : 'text-[#e3ece0] hover:bg-[#1b291e] border border-transparent'
              }`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span>Horário</span>
            </button>
          </nav>

          {/* Bottom-right Camera View Toggle matching mockup */}
          <div className="pointer-events-auto flex justify-end sm:min-w-[120px]">
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                onToggleCamera();
              }}
              aria-label={
                hud.cameraMode === 'first_person'
                  ? 'Alternar para vista externa da canoa'
                  : 'Alternar para primeira pessoa na canoa'
              }
              title={
                hud.cameraMode === 'first_person'
                  ? 'Vista Externa (C)'
                  : 'Primeira Pessoa (C)'
              }
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center shadow-[0_8px_22px_rgba(0,0,0,0.5)] transition-colors cursor-pointer ${
                hud.cameraMode === 'external'
                  ? 'bg-[#2a7a3e] border-[#8ce89d]/75 text-white'
                  : 'bg-[#101812]/90 hover:bg-[#1b291e] border-[#d6e4ca]/20 text-[#e7efe2]'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
