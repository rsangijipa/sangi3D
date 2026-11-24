import type { Workshop, PickHit } from '../scene/workshop';

/**
 * Ponteiro e teclado → intenções. Diferencia toque (clique), arraste no mundo (girar amostra,
 * mover luz, mover lupa) e gesto de câmera (órbita). A órbita fica desligada durante o gesto.
 * Todo gesto tem equivalente em botões e teclado (ver ui/app.ts).
 */

export type Gesture = 'rotate' | 'light' | 'lens' | 'orbit' | 'none';

export interface PointerIntent {
  /** Ferramenta ativa e estado relevante no momento do toque. */
  tool(): 'mao' | 'luz' | 'lupa';
  lensOn(): boolean;
  blocked(): boolean;
  onTap(hit: PickHit | null): void;
  onDragStart(g: Gesture): void;
  onDrag(g: Gesture, dx: number, dy: number, clientX: number, clientY: number): void;
  onDragEnd(g: Gesture): void;
  onHover(hit: PickHit | null, x: number, y: number): void;
}

const TAP_PX = 6;

export function attachPointer(el: HTMLElement, ws: Workshop, intent: PointerIntent) {
  const controls = ws.engine.controls;
  let down: { id: number; x: number; y: number; lx: number; ly: number; hit: PickHit | null; g: Gesture; moved: boolean } | null = null;
  let hoverRaf = 0;
  let lastMove: PointerEvent | null = null;

  const onDown = (e: PointerEvent) => {
    if (intent.blocked() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (down) return; // segundo dedo: deixa a câmera (pinça) com o OrbitControls
    const hit = ws.pick(e.clientX, e.clientY);
    const tool = intent.tool();
    let g: Gesture = 'orbit';
    if (intent.lensOn() && tool === 'lupa' && (hit?.kind === 'hero' || ws.trayPoint(e.clientX, e.clientY))) g = 'lens';
    else if (hit?.kind === 'lamp' || (tool === 'luz' && hit?.kind !== 'tray' && hit?.kind !== 'drawer' && hit?.kind !== 'magnifier')) g = 'light';
    else if (hit?.kind === 'hero' && tool === 'mao') g = 'rotate';
    if (g !== 'orbit') {
      controls.enabled = false;
      el.setPointerCapture(e.pointerId);
    }
    down = { id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, hit, g, moved: false };
  };

  const onMove = (e: PointerEvent) => {
    if (down && e.pointerId === down.id) {
      const dist = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (!down.moved && dist > TAP_PX) {
        down.moved = true;
        if (down.g !== 'orbit') intent.onDragStart(down.g);
      }
      if (down.moved && down.g !== 'orbit') {
        intent.onDrag(down.g, e.clientX - down.lx, e.clientY - down.ly, e.clientX, e.clientY);
        e.preventDefault();
      }
      down.lx = e.clientX;
      down.ly = e.clientY;
      return;
    }
    if (e.pointerType !== 'mouse') return;
    lastMove = e;
    if (!hoverRaf) {
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        if (!lastMove || intent.blocked()) return;
        const hit = ws.pick(lastMove.clientX, lastMove.clientY);
        intent.onHover(hit, lastMove.clientX, lastMove.clientY);
        el.style.cursor = !hit ? 'default' : hit.kind === 'hero' || (hit.kind === 'lamp' && !intent.lensOn()) ? 'grab' : 'pointer';
      });
    }
  };

  const onUp = (e: PointerEvent) => {
    if (!down || e.pointerId !== down.id) return;
    const d = down;
    down = null;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (ws.currentView !== 'luz') controls.enabled = true;
    if (d.moved) {
      if (d.g !== 'orbit') intent.onDragEnd(d.g);
      return;
    }
    if (e.type === 'pointerup') intent.onTap(d.hit);
  };

  const onLeave = () => intent.onHover(null, 0, 0);

  el.addEventListener('pointerdown', onDown, true);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointerdown', onDown, true);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
    el.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(hoverRaf);
  };
}

export interface KeyIntent {
  enabled(): boolean;
  escape(): void;
  enter(): void;
  arrow(dx: number, dy: number): void;
  lens(): void;
  zoom(d: number): void;
}

export function attachKeys(k: KeyIntent) {
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') {
      k.escape();
      return;
    }
    if (typing || !k.enabled()) return;
    const onButton = t && (t.tagName === 'BUTTON' || t.tagName === 'A');
    switch (e.key) {
      case 'Enter':
        if (!onButton) {
          e.preventDefault();
          k.enter();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        k.arrow(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        k.arrow(1, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        k.arrow(0, 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        k.arrow(0, -1);
        break;
      case 'l':
      case 'L':
        k.lens();
        break;
      case '+':
      case '=':
        k.zoom(0.5);
        break;
      case '-':
        k.zoom(-0.5);
        break;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}
