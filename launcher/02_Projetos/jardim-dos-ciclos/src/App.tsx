import React, { Component, ReactNode, useCallback, useRef } from 'react';
import { GardenCanvas } from './components/scene/GardenCanvas';
import { GardenUI } from './components/ui/GardenUI';
import { useGardenStore } from './store/useGardenStore';
import { SEASONS, SEEDS, getStageFromProgress } from './types/garden';

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
            background: '#1c1814',
            color: '#f7f1e6',
          }}
        >
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, marginBottom: 8 }}>
            Jardim dos Ciclos
          </h1>
          <p style={{ maxWidth: 420, color: '#d7ccbc', lineHeight: 1.5 }}>
            Não foi possível inicializar o contexto gráfico 3D neste navegador. Tente recarregar a página ou habilitar a aceleração de hardware.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  const handleExportImage = useCallback(() => {
    const source = canvasRef.current;
    const store = useGardenStore.getState();
    if (!source) {
      store.showToast('A cena ainda está sendo preparada.');
      return;
    }

    try {
      const width = source.width;
      const height = source.height;
      const out = document.createElement('canvas');
      out.width = width;
      out.height = height;
      const ctx = out.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(source, 0, 0, width, height);

      // Assinatura editorial discreta no canto inferior esquerdo da fotografia exportada
      const stage = getStageFromProgress(store.growthProgress);
      const seed = SEEDS[store.seedId];
      const season = SEASONS[store.seasonId];

      const grad = ctx.createLinearGradient(0, height * 0.82, 0, height);
      grad.addColorStop(0, 'rgba(20, 16, 13, 0)');
      grad.addColorStop(1, 'rgba(20, 16, 13, 0.56)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, height * 0.82, width, height * 0.18);

      const pad = Math.round(Math.min(width, height) * 0.035);
      const titleSize = Math.max(20, Math.round(height * 0.032));
      const subSize = Math.max(12, Math.round(height * 0.016));

      ctx.fillStyle = 'rgba(252, 247, 238, 0.94)';
      ctx.font = `500 ${titleSize}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText('Jardim dos Ciclos', pad, height - pad - subSize - 6);

      ctx.fillStyle = 'rgba(235, 224, 207, 0.85)';
      ctx.font = `400 ${subSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(
        `${seed.name}  ·  ${stage.label}  ·  ${season.label}`,
        pad,
        height - pad
      );

      const url = out.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `jardim-dos-ciclos-${store.seedId}-${stage.id}.png`;
      link.href = url;
      link.click();
      store.showToast('Fotografia do jardim exportada em PNG.');
    } catch {
      store.showToast('Não foi possível exportar a imagem neste momento.');
    }
  }, []);

  return (
    <main className="app-root">
      <SceneErrorBoundary>
        <GardenCanvas onCanvasReady={handleCanvasReady} />
      </SceneErrorBoundary>
      <GardenUI onExportImage={handleExportImage} />
    </main>
  );
};

export default App;
