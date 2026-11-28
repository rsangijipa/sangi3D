// Convites da prática guiada: observações objetivas, nunca notas.
import type { ToolId } from './clay';

interface Counters { spinTime: number; shapeWork: number; smoothWork: number; saved: number; wetted: number; idleTime: number; marks: number }
export interface Step { title: string; text: string; done: string; tool?: ToolId; check: (c: Counters) => boolean }

export const STEPS: Step[] = [
  {
    title: '1. Chegar — luz e presença',
    text: 'Observe a luz lateral tocando a bancada e o barro ainda quieto. Gire a câmera arrastando fora da peça. Respire uma vez antes do primeiro toque.',
    done: 'Você ficou alguns instantes só olhando.',
    check: (c) => c.idleTime > 5,
  },
  {
    title: '2. Centrar — o giro do torno',
    text: 'Toque em “Girar” (ou Espaço). Escute o zumbido do torno e perceba o ritmo antes de tocar o barro.',
    done: 'O torno girou por alguns segundos.',
    check: (c) => c.spinTime > 4,
  },
  {
    title: '3. Abrir e erguer',
    text: 'Com “Modelar”, arraste devagar sobre a peça: para fora abre, para dentro acintura. Note como o barro sobe quando é abraçado.',
    done: 'A forma mudou com o seu gesto.',
    tool: 'modelar',
    check: (c) => c.shapeWork > 0.08,
  },
  {
    title: '4. Alisar com água',
    text: 'Escolha “Alisar” ou toque na tigela d’água. Passe a esponja sem pressa e veja o brilho úmido voltar à superfície.',
    done: 'A superfície recebeu água e suavidade.',
    tool: 'alisar',
    check: (c) => c.smoothWork > 4 || c.wetted > 0,
  },
  {
    title: '5. Marcar e guardar',
    text: 'Com “Marcar”, deixe um rastro: sulco, onda, folha ou espiral. Quando sentir que basta, guarde a peça na estante.',
    done: 'Uma peça descansa na estante. Imperfeita e sua.',
    tool: 'marcar',
    check: (c) => c.saved > 0,
  },
];
