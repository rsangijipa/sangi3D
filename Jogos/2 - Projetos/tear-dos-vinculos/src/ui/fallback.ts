// Alternativa DOM funcional (sem WebGL ou após perda de contexto): rascunho de tecelagem em SVG.
// Preserva a função central: cada célula mostra a trama por cima (cor do fio) ou por baixo (urdidura).
import { yarnById } from '../game/content.ts';
import { crossingAtWarp, type SceneState } from '../game/state.ts';

export class DraftView {
  readonly el: HTMLElement;
  private svg: SVGSVGElement;

  constructor(host: HTMLElement, reason: string) {
    this.el = document.createElement('div');
    this.el.className = 'fallback';
    this.el.innerHTML = `<div style="text-align:center;max-width:720px;width:100%">
      <p style="color:#cfc4b1;font-size:15px;margin:90px 0 12px">${reason} Você pode continuar tecendo neste rascunho: os botões e o teclado funcionam igual.</p></div>`;
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('role', 'img');
    this.svg.setAttribute('aria-label', 'Rascunho do tecido');
    this.svg.style.width = 'min(92vw, 640px)';
    this.svg.style.height = 'auto';
    this.svg.style.maxHeight = '56dvh';
    this.el.firstElementChild!.appendChild(this.svg);
    // Abaixo do HUD (que continua operável), acima do canvas.
    const hud = host.querySelector('#hud');
    host.insertBefore(this.el, hud ?? null);
  }

  sync(s: SceneState): void {
    const n = s.warpCount;
    const rows = s.fabric;
    const total = rows.length + 1;
    const cw = 20, ch = 12;
    const W = n * cw, H = Math.max(10, total) * ch;
    this.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    let out = `<rect width="${W}" height="${H}" fill="#3a3027"/>`;
    for (let w = 0; w < n; w++) out += `<rect x="${w * cw + cw * 0.38}" y="0" width="${cw * 0.24}" height="${H}" fill="#EEE5D4" opacity=".55"/>`;
    const drawRow = (r: number, row: { crossings: ('over' | 'under')[]; direction: 1 | -1; yarnId: string }) => {
      const y = H - (r + 1) * ch;
      const col = yarnById(row.yarnId).cor;
      for (let w = 0; w < n; w++) {
        const c = crossingAtWarp(row, w, n);
        if (!c) continue;
        out += c === 'over'
          ? `<rect x="${w * cw}" y="${y + 1}" width="${cw}" height="${ch - 2}" rx="4" fill="${col}"/>`
          : `<rect x="${w * cw}" y="${y + 1}" width="${cw}" height="${ch - 2}" rx="4" fill="${col}" opacity=".35"/><rect x="${w * cw + cw * 0.38}" y="${y}" width="${cw * 0.24}" height="${ch}" fill="#EEE5D4"/>`;
      }
    };
    rows.forEach((e, i) => {
      if (e.kind === 'row') drawRow(i, e);
      else out += `<rect x="0" y="${H - (i + 1) * ch}" width="${W}" height="${ch}" fill="none" stroke="#D7B86D" stroke-dasharray="4 3"/>`;
    });
    if (s.active) drawRow(rows.length, s.active);
    this.svg.innerHTML = out;
  }

  dispose(): void { this.el.remove(); }
}
