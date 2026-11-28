import type { Region } from '../game/content';

export function bindBodyPointer(
  canvas: HTMLCanvasElement,
  pick: (x: number, y: number) => Region | null,
  select: (id: Region) => void,
  hover: (id: Region | null) => void,
  signal: AbortSignal,
) {
  let pointer: { id: number; x: number; y: number; moved: boolean } | null = null;
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId);
  }, { signal });
  canvas.addEventListener('pointermove', event => {
    if (pointer?.id === event.pointerId && Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y) > 10) pointer.moved = true;
    if (pointer || event.pointerType === 'touch') return;
    const id = pick(event.clientX,event.clientY);
    canvas.style.cursor = id ? 'pointer' : '';
    hover(id);
  }, { signal });
  canvas.addEventListener('pointerup', event => {
    if (pointer?.id !== event.pointerId) return;
    const id = !pointer.moved && pick(event.clientX,event.clientY);
    pointer = null;
    if (id) select(id);
  }, { signal });
  canvas.addEventListener('pointercancel', () => { pointer = null; hover(null); }, { signal });
  canvas.addEventListener('pointerleave', () => hover(null), { signal });
}
