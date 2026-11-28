import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HudSnapshot,
  IgarapeScene,
  ToolMode,
} from './engine/IgarapeScene';
import { TimePresetId } from './engine/lighting';
import { QualitySetting } from './engine/quality';
import { TitleOverlay } from './components/TitleOverlay';
import { ActivePanel, ImmersiveHUD } from './components/ImmersiveHUD';
import { Panels } from './components/Panels';

const COLLAPSE_STORAGE_KEY = 'ambientes:controles-recolhidos';

function readInitialCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<IgarapeScene | null>(null);
  const statusTimerRef = useRef<number>(0);

  const [hud, setHud] = useState<HudSnapshot | null>(null);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(readInitialCollapsed);
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    tone: 'info' | 'success' | 'warn';
  } | null>(null);
  const [photoFlash, setPhotoFlash] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);

  const activePanelRef = useRef<ActivePanel>('none');
  activePanelRef.current = activePanel;

  const showStatus = useCallback((text: string, tone: 'info' | 'success' | 'warn' = 'info') => {
    setStatusMsg({ text, tone });
    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => {
      setStatusMsg(null);
    }, 4200);
  }, []);

  const toggleCollapse = useCallback(() => {
    setHudCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  // Sync game state to document.body.dataset.state for testability & launcher integration
  useEffect(() => {
    document.body.dataset.state = hud?.phase ?? 'title';
  }, [hud?.phase]);

  // Mount WebGL scene once inside isolated ref container
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';

    try {
      const engine = new IgarapeScene(
        container,
        {
          onHudUpdate: (snapshot) => setHud(snapshot),
          onStatusMessage: (msg, tone) => showStatus(msg, tone),
          onPhotoFlash: () => {
            setPhotoFlash(true);
            window.setTimeout(() => setPhotoFlash(false), 180);
          },
          onContextLost: (lost) => setContextLost(lost),
          onHotkeyToggleHud: () => toggleCollapse(),
          onHotkeyEscape: () => {
            if (activePanelRef.current !== 'none') {
              setActivePanel('none');
            } else if (sceneRef.current) {
              setHud((prev) => {
                if (!prev) return prev;
                const nextPaused = prev.phase !== 'paused';
                sceneRef.current?.setPaused(nextPaused);
                return prev;
              });
            }
          },
        },
        autostart
      );
      sceneRef.current = engine;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'WebGL indisponível neste dispositivo.';
      setWebglError(message);
    }

    return () => {
      window.clearTimeout(statusTimerRef.current);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [showStatus, toggleCollapse]);

  // Listen for parent launcher postMessage & canonical SangiBridge events
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== 'object' || !sceneRef.current) return;
      if (data.tipo === 'pausar') sceneRef.current.setPaused(true);
      else if (data.tipo === 'retomar') sceneRef.current.setPaused(false);
      else if (data.tipo === 'mute') sceneRef.current.setMuted(Boolean(data.valor));
      else if (data.tipo === 'reset') sceneRef.current.resetExpedition();
    };
    const onPause = () => sceneRef.current?.setPaused(true);
    const onResume = () => sceneRef.current?.setPaused(false);
    const onMute = (e: Event) => {
      const detail = (e as CustomEvent<{ muted?: boolean }>).detail;
      sceneRef.current?.setMuted(Boolean(detail?.muted ?? true));
    };
    const onReset = () => sceneRef.current?.resetExpedition();
    const onDispose = () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };

    window.addEventListener('message', onMessage);
    window.addEventListener('sangi:pause', onPause);
    window.addEventListener('sangi:resume', onResume);
    window.addEventListener('sangi:mute', onMute);
    window.addEventListener('sangi:reset', onReset);
    window.addEventListener('sangi:dispose', onDispose);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('sangi:pause', onPause);
      window.removeEventListener('sangi:resume', onResume);
      window.removeEventListener('sangi:mute', onMute);
      window.removeEventListener('sangi:reset', onReset);
      window.removeEventListener('sangi:dispose', onDispose);
    };
  }, []);

  const handleStart = useCallback(() => {
    setActivePanel('none');
    sceneRef.current?.startExpedition();
  }, []);

  const handleSelectTool = useCallback((mode: ToolMode) => {
    setActivePanel('none');
    sceneRef.current?.setToolMode(mode);
  }, []);

  const handleTogglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? 'none' : panel));
  }, []);

  const handleExit = useCallback(() => {
    setActivePanel('none');
    const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';
    if (isEmbed && window.parent !== window) {
      window.parent.postMessage({ tipo: 'sair', origem: 'expedicao-igarape' }, '*');
    }
    sceneRef.current?.returnToTitle();
  }, []);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-[#08100b]">
      {/* Isolated WebGL canvas container (never re-rendered by React state updates) */}
      <div
        ref={canvasMountRef}
        className="fixed inset-0 w-full h-full z-0"
        aria-label="Cena 3D do Igarapé Amazônico"
      />

      {/* Camera shutter flash feedback */}
      {photoFlash && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-[#f6fff4]/65 pointer-events-none"
        />
      )}

      {/* WebGL Context Lost or Unsupported Fallback */}
      {(contextLost || webglError) && (
        <div
          role="alert"
          className="fixed inset-0 z-50 bg-[#08110b]/94 flex items-center justify-center p-6"
        >
          <div className="max-w-md rounded-2xl bg-[#111c14] border border-[#cde0be]/24 p-6 text-center space-y-4">
            <h1 className="text-lg font-bold text-[#f3f6ee]">
              {contextLost
                ? 'Contexto gráfico WebGL interrompido'
                : 'Não foi possível iniciar o WebGL 3D'}
            </h1>
            <p className="text-xs text-[#bfd1b6] leading-relaxed">
              {webglError ||
                'O navegador suspendeu temporariamente o contexto gráfico. Você pode alternar para o perfil Leve ou recarregar a expedição.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  sceneRef.current?.setQualitySetting('leve');
                  setContextLost(false);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#2a7a3e] text-white text-xs font-semibold cursor-pointer"
              >
                Usar perfil Leve
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1a281d] text-[#e7efe1] text-xs font-semibold border border-[#cde0be]/20 cursor-pointer"
              >
                Recarregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Screen Shell */}
      {hud && hud.phase === 'title' && (
        <TitleOverlay onStart={handleStart} detectedQuality={hud.detectedQuality} />
      )}

      {/* Active Gameplay HUD & On-Demand Panels */}
      {hud && hud.phase !== 'title' && (
        <>
          <ImmersiveHUD
            hud={hud}
            activePanel={activePanel}
            hudCollapsed={hudCollapsed}
            statusMsg={statusMsg}
            onSelectTool={handleSelectTool}
            onTogglePanel={handleTogglePanel}
            onToggleCamera={() =>
              sceneRef.current?.setCameraMode(
                hud.cameraMode === 'first_person' ? 'external' : 'first_person'
              )
            }
            onCapturePhoto={() => sceneRef.current?.capturePhoto()}
            onAimNearestFauna={() => sceneRef.current?.aimAtNearestFauna()}
            onToggleDock={() => sceneRef.current?.toggleDock()}
            onTogglePause={() => sceneRef.current?.setPaused(hud.phase !== 'paused')}
            onExit={handleExit}
            onToggleMute={() => sceneRef.current?.setMuted(!hud.muted)}
            onToggleCollapse={toggleCollapse}
            onAnalogControl={(t, s) => sceneRef.current?.setAnalogControl(t, s)}
            onManualStroke={(side) => sceneRef.current?.triggerManualStroke(side)}
          />

          <Panels
            hud={hud}
            activePanel={activePanel}
            onClosePanel={() => setActivePanel('none')}
            onSelectTimePreset={(id: TimePresetId) => sceneRef.current?.setTimePreset(id)}
            onSelectQuality={(q: QualitySetting) => sceneRef.current?.setQualitySetting(q)}
            onTeleportStretch={(id) => sceneRef.current?.teleportToStretch(id)}
            onSetVolume={(v) => sceneRef.current?.setVolume(v)}
            onToggleMute={() => sceneRef.current?.setMuted(!hud.muted)}
            onSetReducedMotion={(v) => sceneRef.current?.setReducedMotion(v)}
            onToggleCamera={() =>
              sceneRef.current?.setCameraMode(
                hud.cameraMode === 'first_person' ? 'external' : 'first_person'
              )
            }
            onReset={() => sceneRef.current?.resetExpedition()}
            onResume={() => sceneRef.current?.setPaused(false)}
            onExit={handleExit}
          />
        </>
      )}
    </main>
  );
}
