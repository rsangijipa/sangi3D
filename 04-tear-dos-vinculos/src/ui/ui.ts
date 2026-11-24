// HUD próprio: Escolher fio / Entrelaçar · Tensionar · Separar / Ver tecido.
// Barra imersiva compacta, um painel contextual por vez, doca de fios, bottom sheet no celular.
import {
  HELP,
  INITIAL_CONFIGS,
  INVITES,
  MODES,
  PATTERNS,
  THICKNESSES,
  TOOL_LABELS,
  YARNS,
  yarnById,
  type Crossing,
  type ModeId,
  type PatternId,
  type ThicknessId,
  type ToolId,
} from '../game/content.ts';
import { openGaps, suggestedCrossing } from '../game/rules.ts';
import { rowCount, type AppState, type ObservationResult, type QualityId, type RowEntity } from '../game/state.ts';
import type { StoredCreation } from '../persist/storage.ts';
import type { ViewId } from '../scene/world.ts';
import { ICONS, type IconName } from './icons.ts';

export interface UiActions {
  start(mode: ModeId, configId: string | null, demo: boolean): void;
  tool(t: ToolId): void;
  yarn(id: string): void;
  thickness(t: ThicknessId): void;
  cross(c: Crossing): void;
  unweave(): void;
  fillRow(): void;
  assist(p: PatternId): void;
  tension(v: number): void;
  focusActive(): void;
  secure(endId: string): void;
  knot(endId: string): void;
  cut(): void;
  reconnect(gapId: string): void;
  clearSelection(): void;
  view(v: ViewId): void;
  undo(): void;
  redo(): void;
  sound(): void;
  ambience(on: boolean): void;
  volume(v: number): void;
  quality(q: QualityId): void;
  reducedMotion(on: boolean): void;
  hint(level: number): void;
  fullscreen(): void;
  pause(): void;
  resume(): void;
  exit(): void;
  exportPng(): void;
  exportSummary(): void;
  save(title: string, includeNames: boolean): void;
  refreshGallery(): void;
  loadCreation(id: string): void;
  deleteCreation(id: string): void;
  deleteAllData(): void;
  reset(): void;
  replay(): void;
  stopReplay(): void;
  setName(yarnId: string, name: string): void;
  observe(result: ObservationResult): void;
  removeObservation(id: string): void;
  skipDemo(): void;
  backToEntry(): void;
  togglePerf(): void;
}

type PanelId = ToolId | 'ajustes';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, html = ''): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
};

const TOOL_ICON: Record<ToolId, IconName> = { fio: 'ball', entrelacar: 'weave', tensionar: 'tension', separar: 'separate', tecido: 'fabric' };

export class UI {
  readonly root: HTMLElement;
  private hud: HTMLElement;
  private rail: HTMLElement;
  private panel: HTMLElement;
  private dock: HTMLElement;
  private actionsBox: HTMLElement;
  private status: HTMLElement;
  private live: HTMLElement;
  private entry: HTMLElement;
  private pauseOv: HTMLElement;
  private demoBar: HTMLElement;
  private modeTag: HTMLElement;
  private perf: HTMLElement;
  private dialog: HTMLDialogElement;
  private moreMenu: HTMLElement;
  private panelId: PanelId = 'fio';
  private panelOpen = true;
  private panelKey = '';
  private helpOpen = false;
  private statusTimer = 0;
  private app: AppState | null = null;
  private inviteIdx = 0;
  gallery: StoredCreation[] = [];
  soundOn = false;
  ambienceOn = false;
  canUndo = false;
  canRedo = false;
  replaying = false;
  opportunity = 1;
  private entryMode: ModeId = 'livre';
  private entryConfig: string = INITIAL_CONFIGS[1].id;
  private topButtons = new Map<string, HTMLButtonElement>();

  constructor(host: HTMLElement, private act: UiActions) {
    this.root = host;
    this.hud = el('div', { class: 'hud', id: 'hud' });
    host.appendChild(this.hud);

    // Título
    const brand = el('div', { class: 'brand glass', role: 'banner' });
    brand.innerHTML = `${ICONS.loom}<h1>Tear dos Vínculos</h1>`;
    this.modeTag = el('span', { class: 'mode-tag' });
    brand.appendChild(this.modeTag);
    this.hud.appendChild(brand);

    // Barra superior
    const top = el('nav', { class: 'topbar glass', 'aria-label': 'Controles gerais' });
    const tb = (id: string, icon: IconName, label: string, fn: () => void, cls = '') => {
      const b = el('button', { class: `icon-btn ${cls}`, 'aria-label': label, title: label, 'data-id': id }, `${ICONS[icon]}<span>${label}</span>`) as HTMLButtonElement;
      b.addEventListener('click', fn);
      top.appendChild(b);
      this.topButtons.set(id, b);
      return b;
    };
    tb('ajuda', 'help', 'Ajuda', () => this.toggleHelp(), 'desk');
    tb('desfazer', 'undo', 'Desfazer', () => act.undo());
    tb('refazer', 'redo', 'Refazer', () => act.redo(), 'desk');
    tb('visao', 'camera', 'Visão', () => this.cycleView(), 'desk');
    tb('som', 'soundOff', 'Som', () => act.sound());
    top.appendChild(el('div', { class: 'sep desk' }));
    tb('ajustes', 'quality', 'Ajustes', () => this.openPanel('ajustes'), 'desk');
    tb('tela', 'full', 'Tela cheia', () => act.fullscreen(), 'desk');
    tb('hud', 'hud', 'Recolher', () => this.toggleHud(), 'desk');
    tb('pausa', 'pause', 'Pausa', () => act.pause());
    tb('sair', 'exit', 'Sair', () => act.exit(), 'desk');
    const more = el('button', { class: 'icon-btn mobile-only', 'aria-label': 'Mais opções', 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, `${ICONS.more}<span>Mais</span>`) as HTMLButtonElement;
    this.moreMenu = el('div', { class: 'more-menu glass', role: 'menu' });
    const mm = (icon: IconName, label: string, fn: () => void) => {
      const b = el('button', { role: 'menuitem' }, `${ICONS[icon]}${label}`);
      b.addEventListener('click', () => { this.moreMenu.classList.remove('open'); more.setAttribute('aria-expanded', 'false'); fn(); });
      this.moreMenu.appendChild(b);
    };
    mm('help', 'Ajuda desta ferramenta', () => this.toggleHelp());
    mm('redo', 'Refazer', () => act.redo());
    mm('camera', 'Mudar visão', () => this.cycleView());
    mm('quality', 'Ajustes', () => this.openPanel('ajustes'));
    mm('full', 'Tela cheia', () => act.fullscreen());
    mm('exit', 'Sair', () => act.exit());
    more.addEventListener('click', () => {
      const open = !this.moreMenu.classList.contains('open');
      this.moreMenu.classList.toggle('open', open);
      more.setAttribute('aria-expanded', String(open));
    });
    top.appendChild(more);
    top.appendChild(this.moreMenu);
    this.hud.appendChild(top);
    const style = document.createElement('style');
    style.textContent = '.mobile-only{display:none}@media (max-width:760px),(max-height:560px) and (pointer:coarse){.mobile-only{display:inline-flex}}';
    document.head.appendChild(style);

    // Trilho de ferramentas
    this.rail = el('nav', { class: 'rail glass', 'aria-label': 'Ferramentas' });
    (Object.keys(TOOL_LABELS) as ToolId[]).forEach((t, i) => {
      const b = el('button', { class: 'tool', 'aria-pressed': 'false', 'data-tool': t, 'aria-keyshortcuts': String(i + 1), title: `${TOOL_LABELS[t]} (${i + 1})` },
        `${ICONS[TOOL_ICON[t]]}<span>${TOOL_LABELS[t]}</span><i class="busy" aria-hidden="true"></i>`);
      b.addEventListener('click', () => {
        if (this.panelId === t && this.panelOpen && matchMedia('(max-width: 760px)').matches) { this.panelOpen = false; this.renderPanel(true); return; }
        act.tool(t);
      });
      this.rail.appendChild(b);
    });
    this.hud.appendChild(this.rail);

    // Painel contextual
    this.panel = el('section', { class: 'panel glass', 'aria-live': 'off', 'aria-label': 'Painel da ferramenta' });
    this.hud.appendChild(this.panel);

    // Doca de fios
    this.dock = el('div', { class: 'dock glass', role: 'group', 'aria-label': 'Fios disponíveis' });
    this.hud.appendChild(this.dock);

    // Ações rápidas de entrelaçar
    this.actionsBox = el('div', { class: 'actions glass hidden', role: 'group', 'aria-label': 'Passar o fio' });
    this.hud.appendChild(this.actionsBox);

    this.status = el('div', { class: 'status glass', role: 'status' });
    this.live = el('div', { class: 'sr-only', 'aria-live': 'polite' });
    this.hud.append(this.status, this.live);

    this.demoBar = el('div', { class: 'demo-bar glass hidden' });
    this.demoBar.innerHTML = '<span>Demonstração: observe a lançadeira passando.</span>';
    const skip = el('button', { class: 'btn' }, 'Pular demonstração');
    skip.addEventListener('click', () => act.skipDemo());
    this.demoBar.appendChild(skip);
    this.hud.appendChild(this.demoBar);

    this.perf = el('div', { class: 'perf', 'aria-hidden': 'true' });
    host.appendChild(this.perf);

    this.entry = el('div', { class: 'overlay', id: 'entrada' });
    host.appendChild(this.entry);
    this.pauseOv = el('div', { class: 'overlay hidden', id: 'pausa', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Pausa' });
    host.appendChild(this.pauseOv);
    this.dialog = el('dialog', { class: 'confirm' }) as HTMLDialogElement;
    host.appendChild(this.dialog);
    this.renderEntry();
    this.renderPause();
    this.renderDock();
  }

  // ---------- entrada ----------

  private renderEntry(): void {
    const structured = this.entryMode !== 'livre' && this.entryMode !== 'mapa';
    this.entry.innerHTML = '';
    const card = el('div', { class: 'card glass', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'entrada-titulo' });
    card.innerHTML = `<h1 id="entrada-titulo">Tear dos Vínculos</h1>
      <p class="lead">Uma oficina de tecelagem para entrelaçar fios, ajustar a tensão, separar e reconectar trechos. O significado de cada fio é seu.</p>
      <h3 style="font-size:12.5px;letter-spacing:.9px;text-transform:uppercase;color:var(--c-sand);margin:10px 0 8px">Como você quer começar?</h3>`;
    const grid = el('div', { class: 'grid', role: 'group', 'aria-label': 'Modos' });
    for (const m of MODES) {
      const b = el('button', { class: 'opt', 'aria-pressed': String(m.id === this.entryMode) }, `<strong>${m.nome}</strong><small>${m.descricao}</small>`);
      b.addEventListener('click', () => { this.entryMode = m.id; this.renderEntry(); });
      grid.appendChild(b);
    }
    card.appendChild(grid);
    if (structured) {
      card.appendChild(el('h3', { style: 'font-size:12.5px;letter-spacing:.9px;text-transform:uppercase;color:var(--c-sand);margin:18px 0 8px' }, 'Configuração inicial'));
      const cg = el('div', { class: 'grid', role: 'group', 'aria-label': 'Configurações' });
      for (const c of INITIAL_CONFIGS) {
        const b = el('button', { class: 'opt', 'aria-pressed': String(c.id === this.entryConfig) }, `<strong>${c.nome}</strong><small>${c.descricao}</small>`);
        b.addEventListener('click', () => { this.entryConfig = c.id; this.renderEntry(); });
        cg.appendChild(b);
      }
      card.appendChild(cg);
    }
    const actions = el('div', { class: 'big-actions' });
    const go = el('button', { class: 'btn primary' }, `${ICONS.play} Começar`);
    go.addEventListener('click', () => this.act.start(this.entryMode, structured ? this.entryConfig : null, false));
    const demo = el('button', { class: 'btn' }, `${ICONS.view} Ver demonstração antes`);
    demo.addEventListener('click', () => this.act.start(this.entryMode, structured ? this.entryConfig : null, true));
    actions.append(go, demo);
    card.appendChild(actions);
    card.appendChild(el('p', { class: 'note' }, 'Sem cronômetro, sem pontuação. O som começa desligado. Nada é enviado pela internet; salvar no navegador é opcional e pode ser apagado em Ajustes. Recurso expressivo complementar, não é instrumento de avaliação.'));
    this.entry.appendChild(card);
    setTimeout(() => (go as HTMLButtonElement).focus({ preventScroll: true }), 30);
  }

  showEntry(v: boolean): void {
    this.entry.classList.toggle('hidden', !v);
    this.hud.toggleAttribute('inert', v);
    if (v) this.renderEntry();
  }

  private renderPause(): void {
    this.pauseOv.innerHTML = '';
    const card = el('div', { class: 'card glass', style: 'width:min(420px,92vw)' });
    card.innerHTML = '<h1>Pausa</h1><p class="lead">A cena está parada. Nada foi perdido.</p>';
    const r = el('div', { class: 'big-actions' });
    const cont = el('button', { class: 'btn primary grow' }, `${ICONS.play} Continuar`);
    cont.addEventListener('click', () => this.act.resume());
    const exit = el('button', { class: 'btn grow' }, `${ICONS.exit} Sair`);
    exit.addEventListener('click', () => this.act.exit());
    const back = el('button', { class: 'btn grow' }, `${ICONS.reset} Voltar ao início`);
    back.addEventListener('click', () => this.act.backToEntry());
    r.append(cont, back, exit);
    card.appendChild(r);
    this.pauseOv.appendChild(card);
  }

  showPause(v: boolean): void {
    this.pauseOv.classList.toggle('hidden', !v);
    if (v) (this.pauseOv.querySelector('.btn.primary') as HTMLButtonElement)?.focus();
  }

  showDemo(v: boolean): void { this.demoBar.classList.toggle('hidden', !v); }

  // ---------- confirmação ----------

  confirm(title: string, text: string, okLabel: string, danger = true): Promise<boolean> {
    return new Promise((resolve) => {
      const d = this.dialog;
      d.innerHTML = '';
      const card = el('div', { class: 'card glass' });
      card.innerHTML = `<h2>${title}</h2><p class="lead" style="font-size:15.5px">${text}</p>`;
      const r = el('div', { class: 'big-actions' });
      const no = el('button', { class: 'btn grow' }, 'Cancelar');
      const ok = el('button', { class: `btn grow ${danger ? 'danger' : 'primary'}` }, okLabel);
      r.append(no, ok);
      card.appendChild(r);
      d.appendChild(card);
      const done = (v: boolean) => { d.close(); resolve(v); };
      no.addEventListener('click', () => done(false));
      ok.addEventListener('click', () => done(true));
      d.addEventListener('cancel', (e) => { e.preventDefault(); done(false); }, { once: true });
      d.showModal();
      (no as HTMLButtonElement).focus();
    });
  }

  get dialogOpen(): boolean { return this.dialog.open; }

  // ---------- doca ----------

  private yarnSwatch(id: string, size: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = c.height = size * 2;
    const x = c.getContext('2d')!;
    const y = yarnById(id);
    const r = size * 0.88;
    const g = x.createRadialGradient(size * 0.7, size * 0.65, r * 0.1, size, size, r);
    g.addColorStop(0, shade(y.brilho, 1.05)); g.addColorStop(0.55, y.cor); g.addColorStop(1, shade(y.cor, 0.55));
    x.fillStyle = g;
    x.beginPath(); x.arc(size, size, r, 0, Math.PI * 2); x.fill();
    x.strokeStyle = shade(y.cor, 0.62); x.lineWidth = size * 0.05;
    for (let i = 0; i < 7; i++) {
      x.beginPath();
      x.ellipse(size, size, r * 0.95, r * (0.15 + i * 0.12), -0.7 + i * 0.32, 0, Math.PI * 2);
      x.globalAlpha = 0.35; x.stroke();
    }
    x.globalAlpha = 1;
    return c;
  }

  private yarnButtons(container: HTMLElement, size: number): void {
    for (const y of YARNS) {
      const name = this.app?.sceneState.names[y.id];
      const b = el('button', { class: 'yarn', 'aria-pressed': String(this.app?.sceneState.selectedYarn === y.id), 'aria-label': `Fio ${y.nome}${name ? `, ${name}` : ''}`, title: y.nome, 'data-yarn': y.id });
      b.appendChild(this.yarnSwatch(y.id, size));
      b.appendChild(el('span', { class: 'nm' }, name || y.nome));
      b.addEventListener('click', () => this.act.yarn(y.id));
      container.appendChild(b);
    }
  }

  private renderDock(): void {
    this.dock.innerHTML = '';
    const prev = el('button', { class: 'arrow', 'aria-label': 'Fio anterior' }, ICONS.left);
    const next = el('button', { class: 'arrow', 'aria-label': 'Próximo fio' }, ICONS.right);
    const step = (d: number) => {
      const ids = YARNS.map((y) => y.id);
      const cur = ids.indexOf(this.app?.sceneState.selectedYarn ?? ids[0]);
      this.act.yarn(ids[(cur + d + ids.length) % ids.length]);
    };
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    const list = el('div', { class: 'yarns' });
    this.yarnButtons(list, 33);
    this.dock.append(prev, list, next);
  }

  // ---------- painel ----------

  openPanel(id: PanelId): void {
    this.panelId = id;
    this.panelOpen = true;
    this.helpOpen = false;
    this.renderPanel(true);
  }

  private toggleHelp(): void {
    if (!this.panelOpen) { this.panelOpen = true; this.renderPanel(true); }
    this.helpOpen = !this.helpOpen;
    this.panel.querySelector('.help')?.classList.toggle('open', this.helpOpen);
    this.panel.querySelector('[data-help]')?.setAttribute('aria-expanded', String(this.helpOpen));
  }

  private toggleHud(): void {
    const c = this.hud.classList.toggle('collapsed');
    const b = this.topButtons.get('hud');
    b?.setAttribute('aria-pressed', String(c));
    this.say(c ? 'Interface recolhida. Pressione H para mostrar.' : 'Interface visível.');
  }

  toggleHudKey(): void { this.toggleHud(); }

  closePanel(): void {
    if (this.moreMenu.classList.contains('open')) { this.moreMenu.classList.remove('open'); return; }
    this.panelOpen = false;
    this.renderPanel(true);
  }

  private cycleView(): void {
    const order: ViewId[] = ['geral', 'cruzamento', 'tecido', 'novelos'];
    const cur = Number(this.panel.dataset.view ?? 0);
    const next = (cur + 1) % order.length;
    this.panel.dataset.view = String(next);
    this.act.view(order[next]);
    this.say(`Visão: ${({ geral: 'geral', cruzamento: 'cruzamento de perto', tecido: 'tecido', novelos: 'novelos' })[order[next]]}.`);
  }

  private structuralKey(a: AppState): string {
    const s = a.sceneState;
    const ends = s.ends.map((e) => e.id + e.state).join(',');
    const sel = s.selection ? `${s.selection.fromId}-${s.selection.toId}` : '';
    const gaps = openGaps(s).map((g) => g.id).join(',');
    const active = s.active ? `${s.active.id}:${s.active.crossings.length}` : '-';
    return [this.panelId, this.panelOpen, a.mode, a.phase, ends, sel, gaps, rowCount(s), active, s.focusRowId, s.assist, s.thickness, s.selectedYarn, s.turn,
      this.gallery.length, this.soundOn, this.ambienceOn, a.settings.quality, a.settings.hintLevel, a.settings.reducedMotion, a.observations.length, this.replaying, s.warpCount].join('|');
  }

  render(a: AppState): void {
    this.app = a;
    this.modeTag.textContent = MODES.find((m) => m.id === a.mode)?.nome ?? '';
    if (a.tool !== this.panelId && this.panelId !== 'ajustes') this.panelId = a.tool;
    for (const b of this.rail.querySelectorAll<HTMLButtonElement>('.tool')) {
      b.setAttribute('aria-pressed', String(b.dataset.tool === a.tool));
      b.classList.toggle('working', b.dataset.tool === 'entrelacar' && Boolean(a.sceneState.active));
    }
    for (const b of this.dock.querySelectorAll<HTMLButtonElement>('.yarn')) b.setAttribute('aria-pressed', String(b.dataset.yarn === a.sceneState.selectedYarn));
    const showDock = a.tool === 'fio' || a.tool === 'entrelacar';
    this.dock.style.display = showDock ? '' : 'none';
    this.actionsBox.classList.toggle('hidden', a.tool !== 'entrelacar');
    const u = this.topButtons.get('desfazer');
    if (u) u.disabled = !this.canUndo;
    const r = this.topButtons.get('refazer');
    if (r) r.disabled = !this.canRedo;
    const snd = this.topButtons.get('som');
    if (snd) { snd.innerHTML = `${this.soundOn ? ICONS.soundOn : ICONS.soundOff}<span>${this.soundOn ? 'Som ligado' : 'Som'}</span>`; snd.setAttribute('aria-pressed', String(this.soundOn)); }
    this.renderPanel(false);
    this.renderActions(a);
  }

  private renderActions(a: AppState): void {
    const s = a.sceneState;
    const key = `${s.active?.crossings.length ?? 0}|${s.assist}|${a.settings.hintLevel}|${s.warpCount}`;
    if (this.actionsBox.dataset.key === key) return;
    this.actionsBox.dataset.key = key;
    this.actionsBox.innerHTML = '';
    const hint = a.settings.hintLevel >= 2 ? suggestedCrossing(s) : null;
    const b1 = el('button', { class: 'btn', 'aria-keyshortcuts': 'ArrowUp' }, `${ICONS.over} Por cima <span class="kbd">↑</span>`);
    const b2 = el('button', { class: 'btn', 'aria-keyshortcuts': 'ArrowDown' }, `${ICONS.under} Por baixo <span class="kbd">↓</span>`);
    if (hint === 'over') b1.classList.add('primary');
    if (hint === 'under') b2.classList.add('primary');
    b1.addEventListener('click', () => this.act.cross('over'));
    b2.addEventListener('click', () => this.act.cross('under'));
    const b3 = el('button', { class: 'btn', 'aria-keyshortcuts': 'Backspace' }, `${ICONS.undo} Desfazer cruzamento <span class="kbd">⌫</span>`);
    b3.addEventListener('click', () => this.act.unweave());
    this.actionsBox.append(b1, b2, b3);
    if (s.assist !== 'livre') {
      const b4 = el('button', { class: 'btn' }, `${ICONS.fill} Completar passada`);
      b4.addEventListener('click', () => this.act.fillRow());
      this.actionsBox.appendChild(b4);
    }
  }

  private renderPanel(force: boolean): void {
    const a = this.app;
    if (!a) return;
    const key = this.structuralKey(a);
    if (!force && key === this.panelKey) { this.updateDynamic(a); return; }
    this.panelKey = key;
    const p = this.panel;
    p.classList.toggle('closed', !this.panelOpen);
    p.innerHTML = '';
    if (!this.panelOpen) return;
    const grab = el('button', { class: 'grabber', 'aria-label': 'Expandir ou reduzir painel' });
    grab.addEventListener('click', () => p.classList.toggle('expanded'));
    p.appendChild(grab);
    const id = this.panelId;
    const title = id === 'ajustes' ? 'Ajustes' : TOOL_LABELS[id];
    const head = el('header');
    head.appendChild(el('h2', {}, title));
    if (id !== 'ajustes') {
      const hb = el('button', { class: 'mini', 'aria-label': `Ajuda: ${title}`, 'aria-expanded': String(this.helpOpen), 'data-help': '1', title: 'Ajuda' }, ICONS.help);
      hb.addEventListener('click', () => this.toggleHelp());
      head.appendChild(hb);
    }
    const cl = el('button', { class: 'mini', 'aria-label': 'Recolher painel', title: 'Recolher painel (Esc)' }, ICONS.collapse);
    cl.addEventListener('click', () => { this.panelOpen = false; this.renderPanel(true); });
    head.appendChild(cl);
    p.appendChild(head);
    if (id !== 'ajustes') p.appendChild(el('div', { class: `help${this.helpOpen ? ' open' : ''}` }, HELP[id]));
    switch (id) {
      case 'fio': this.panelFio(p, a); break;
      case 'entrelacar': this.panelEntrelacar(p, a); break;
      case 'tensionar': this.panelTensionar(p, a); break;
      case 'separar': this.panelSeparar(p, a); break;
      case 'tecido': this.panelTecido(p, a); break;
      case 'ajustes': this.panelAjustes(p, a); break;
    }
    if (a.mode === 'acompanhado' && id !== 'ajustes') this.sectionRegistro(p, a);
  }

  private updateDynamic(a: AppState): void {
    const s = a.sceneState;
    const t = this.panel.querySelector<HTMLInputElement>('input[data-tension]');
    if (t && document.activeElement !== t) {
      const row = s.focusRowId ? s.fabric.find((e): e is RowEntity => e.kind === 'row' && e.id === s.focusRowId) : null;
      t.value = String(Math.round((row ? row.tension : s.tension) * 100));
    }
    const out = this.panel.querySelector('[data-tension-out]');
    if (out && t) out.textContent = tensionWord(Number(t.value) / 100);
  }

  private invite(p: HTMLElement, i: number): void {
    p.appendChild(el('p', { class: 'invite' }, INVITES[(i + this.inviteIdx) % INVITES.length]));
  }

  private mobileDock(p: HTMLElement): void {
    const d = el('div', { class: 'dock-inline', role: 'group', 'aria-label': 'Fios' });
    this.yarnButtons(d, 23);
    p.appendChild(d);
  }

  private panelFio(p: HTMLElement, a: AppState): void {
    const s = a.sceneState;
    this.invite(p, 2);
    this.mobileDock(p);
    const y = yarnById(s.selectedYarn);
    p.appendChild(el('p', {}, `Fio escolhido: <strong style="color:var(--ink)">${y.nome}</strong>${s.names[y.id] ? ` — “${escapeHtml(s.names[y.id])}”` : ''}. Vale para a próxima passada.`));
    p.appendChild(el('h3', {}, 'Espessura'));
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Espessura do fio' });
    for (const t of THICKNESSES) {
      const b = el('button', { 'aria-pressed': String(s.thickness === t.id) }, t.nome);
      b.addEventListener('click', () => this.act.thickness(t.id));
      seg.appendChild(b);
    }
    p.appendChild(seg);
    if (a.mode === 'mapa') {
      p.appendChild(el('h3', {}, 'Mapa de vínculos (nomes opcionais)'));
      p.appendChild(el('p', {}, 'Se quiser, dê um nome a cada fio. Os nomes ficam só nesta sessão e aparecem nas etiquetas dos novelos.'));
      for (const yy of YARNS) {
        const used = s.fabric.filter((e) => e.kind === 'row' && e.yarnId === yy.id).length;
        const lab = el('label', { class: 'field' });
        lab.innerHTML = `<span style="display:flex;gap:8px;align-items:center"><span class="swatch" style="background:${yy.cor}"></span>${yy.nome} <small style="margin-left:auto">${used} ${used === 1 ? 'fileira' : 'fileiras'}</small></span>`;
        const inp = el('input', { type: 'text', maxlength: '32', placeholder: 'Nome (opcional)', value: s.names[yy.id] ?? '', 'aria-label': `Nome para o fio ${yy.nome}`, autocomplete: 'off' }) as HTMLInputElement;
        inp.addEventListener('change', () => this.act.setName(yy.id, inp.value));
        lab.appendChild(inp);
        p.appendChild(lab);
      }
    }
    const r = el('div', { class: 'row', style: 'margin-top:12px' });
    const go = el('button', { class: 'btn primary grow' }, `${ICONS.weave} Entrelaçar com este fio`);
    go.addEventListener('click', () => this.act.tool('entrelacar'));
    const v = el('button', { class: 'btn' }, `${ICONS.view} Ver novelos`);
    v.addEventListener('click', () => this.act.view('novelos'));
    r.append(go, v);
    p.appendChild(r);
  }

  private panelEntrelacar(p: HTMLElement, a: AppState): void {
    const s = a.sceneState;
    this.invite(p, 0);
    const n = s.warpCount;
    const done = s.active?.crossings.length ?? 0;
    const rows = rowCount(s);
    if (s.shared) p.appendChild(el('p', {}, `<strong style="color:var(--c-gold)">Vez de ${s.turn === 'A' ? 'pessoa A' : 'pessoa B'}</strong> — cada passada alterna.`));
    p.appendChild(el('p', {}, `Passada ${rows + 1}: <strong style="color:var(--ink)" data-progress>${done} de ${n}</strong> cruzamentos ${s.active ? (s.active.direction === 1 ? '(da esquerda para a direita)' : '(da direita para a esquerda)') : ''}`));
    p.appendChild(el('div', { class: 'meter', 'aria-hidden': 'true' }, `<i style="width:${(done / n) * 100}%"></i>`));
    const mob = el('div', { class: 'mobile-actions' });
    const hint = a.settings.hintLevel >= 2 ? suggestedCrossing(s) : null;
    const o = el('button', { class: `btn ${hint === 'over' ? 'primary' : ''}` }, `${ICONS.over} Por cima`);
    o.addEventListener('click', () => this.act.cross('over'));
    const u = el('button', { class: `btn ${hint === 'under' ? 'primary' : ''}` }, `${ICONS.under} Por baixo`);
    u.addEventListener('click', () => this.act.cross('under'));
    const d = el('button', { class: 'btn' }, `${ICONS.undo} Desfazer`);
    d.addEventListener('click', () => this.act.unweave());
    mob.append(o, u, d);
    if (s.assist !== 'livre') {
      const f = el('button', { class: 'btn' }, `${ICONS.fill} Completar`);
      f.addEventListener('click', () => this.act.fillRow());
      mob.appendChild(f);
    }
    p.appendChild(mob);
    this.mobileDock(p);
    p.appendChild(el('h3', {}, 'Padrão de apoio'));
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Padrão de apoio', style: 'flex-wrap:wrap' });
    for (const pt of PATTERNS) {
      const b = el('button', { 'aria-pressed': String(s.assist === pt.id), title: pt.descricao }, pt.nome);
      b.addEventListener('click', () => this.act.assist(pt.id));
      seg.appendChild(b);
    }
    p.appendChild(seg);
    p.appendChild(el('p', {}, PATTERNS.find((x) => x.id === s.assist)?.descricao ?? ''));
    if (a.mode === 'demonstrado' || a.mode === 'acompanhado') {
      p.appendChild(el('h3', {}, 'Pistas'));
      const hs = el('div', { class: 'seg', role: 'group', 'aria-label': 'Nível de pista' });
      ['Sem', 'Fio', 'Direção', 'Forte'].forEach((lbl, i) => {
        const b = el('button', { 'aria-pressed': String(a.settings.hintLevel === i) }, lbl);
        b.addEventListener('click', () => this.act.hint(i));
        hs.appendChild(b);
      });
      p.appendChild(hs);
      p.appendChild(el('p', {}, 'Fio: destaca o próximo fio. Direção: indica por cima ou por baixo. Forte: completa uma passada como modelo quando você pedir.'));
    }
    const r = el('div', { class: 'row', style: 'margin-top:10px' });
    const near = el('button', { class: 'btn grow' }, `${ICONS.view} Ver cruzamento de perto`);
    near.addEventListener('click', () => this.act.view('cruzamento'));
    const all = el('button', { class: 'btn' }, 'Visão geral');
    all.addEventListener('click', () => this.act.view('geral'));
    r.append(near, all);
    p.appendChild(r);
  }

  private panelTensionar(p: HTMLElement, a: AppState): void {
    const s = a.sceneState;
    this.invite(p, 1);
    const row = s.focusRowId ? s.fabric.find((e): e is RowEntity => e.kind === 'row' && e.id === s.focusRowId) : null;
    const value = row ? row.tension : s.tension;
    const idx = row ? s.fabric.filter((e) => e.kind === 'row').indexOf(row) + 1 : null;
    p.appendChild(el('p', {}, row ? `Ajustando a <strong style="color:var(--ink)">fileira ${idx}</strong> (${yarnById(row.yarnId).nome}).` : 'Ajustando a <strong style="color:var(--ink)">passada atual</strong> e as próximas.'));
    const lab = el('label', { class: 'field' });
    lab.innerHTML = `<span style="display:flex;justify-content:space-between"><span>Frouxo</span><strong data-tension-out style="color:var(--ink)">${tensionWord(value)}</strong><span>Tenso</span></span>`;
    const inp = el('input', { type: 'range', min: '0', max: '100', step: '1', value: String(Math.round(value * 100)), 'data-tension': '1', 'aria-label': 'Tensão do fio', 'aria-valuetext': tensionWord(value) }) as HTMLInputElement;
    inp.addEventListener('input', () => {
      this.act.tension(Number(inp.value) / 100);
      inp.setAttribute('aria-valuetext', tensionWord(Number(inp.value) / 100));
      const o = this.panel.querySelector('[data-tension-out]');
      if (o) o.textContent = tensionWord(Number(inp.value) / 100);
    });
    lab.appendChild(inp);
    p.appendChild(lab);
    const r = el('div', { class: 'row' });
    for (const [lbl, v] of [['Soltar', 0.15], ['Médio', 0.55], ['Firmar', 0.9]] as [string, number][]) {
      const b = el('button', { class: 'btn grow' }, lbl);
      b.addEventListener('click', () => this.act.tension(v));
      r.appendChild(b);
    }
    p.appendChild(r);
    if (row) {
      const back = el('button', { class: 'btn', style: 'margin-top:8px;width:100%' }, 'Voltar à passada atual');
      back.addEventListener('click', () => this.act.focusActive());
      p.appendChild(back);
    }
    p.appendChild(el('p', {}, 'Toque em uma fileira do tecido para ajustá-la. Arraste a roldana à direita do tear para cima ou para baixo.'));
    if (a.mode === 'tensao') {
      p.appendChild(el('h3', {}, 'Fileiras e tensões'));
      const ul = el('ul', { class: 'list' });
      s.fabric.filter((e): e is RowEntity => e.kind === 'row').slice(-10).reverse().forEach((rr) => {
        const li = el('li');
        li.innerHTML = `<span class="swatch" style="background:${yarnById(rr.yarnId).cor}"></span><span class="grow">${yarnById(rr.yarnId).nome}</span><span class="state-chip">${tensionWord(rr.tension)}</span>`;
        ul.appendChild(li);
      });
      if (!ul.children.length) ul.innerHTML = '<li>Teça algumas fileiras com tensões diferentes para comparar.</li>';
      p.appendChild(ul);
    }
  }

  private panelSeparar(p: HTMLElement, a: AppState): void {
    const s = a.sceneState;
    this.invite(p, 3);
    const sel = s.selection;
    const rowsList = s.fabric.filter((e) => e.kind === 'row');
    const n = (id: string | null) => (id ? rowsList.findIndex((e) => e.id === id) + 1 : 0);
    p.appendChild(el('h3', {}, 'Trecho'));
    p.appendChild(el('p', {}, !sel ? 'Toque na primeira fileira do trecho no tecido.' : sel.toId === null ? `Início na fileira ${n(sel.fromId)}. Toque na última fileira do trecho.` : `Trecho marcado: fileiras ${Math.min(n(sel.fromId), n(sel.toId))} a ${Math.max(n(sel.fromId), n(sel.toId))}.`));
    const r = el('div', { class: 'row' });
    const cut = el('button', { class: 'btn danger grow' }, `${ICONS.scissors} Cortar trecho`) as HTMLButtonElement;
    cut.disabled = !(sel && sel.toId);
    cut.addEventListener('click', () => this.act.cut());
    const clr = el('button', { class: 'btn' }, 'Limpar') as HTMLButtonElement;
    clr.disabled = !sel;
    clr.addEventListener('click', () => this.act.clearSelection());
    r.append(cut, clr);
    p.appendChild(r);
    const und = el('button', { class: 'btn', style: 'margin-top:8px;width:100%' }, `${ICONS.undo} Desfazer cruzamento`);
    und.addEventListener('click', () => this.act.unweave());
    p.appendChild(und);
    const gaps = openGaps(s);
    if (gaps.length) {
      p.appendChild(el('h3', {}, 'Trechos abertos'));
      for (const g of gaps) {
        const b = el('button', { class: 'btn primary', style: 'width:100%;margin-bottom:6px' }, `${ICONS.link} Reconectar (${g.removedRowIds.length} ${g.removedRowIds.length === 1 ? 'fileira removida' : 'fileiras removidas'})`);
        b.addEventListener('click', () => this.act.reconnect(g.id));
        p.appendChild(b);
      }
    }
    p.appendChild(el('h3', {}, 'Pontas'));
    if (!s.ends.length) p.appendChild(el('p', {}, 'Nenhuma ponta por enquanto. Pontas aparecem ao trocar de fio ou cortar um trecho.'));
    const ul = el('ul', { class: 'list' });
    s.ends.slice(-8).forEach((e) => {
      const li = el('li');
      li.innerHTML = `<span class="swatch" style="background:${yarnById(e.yarnId).cor}"></span><span class="grow">${yarnById(e.yarnId).nome} · ${e.side === 'left' ? 'esquerda' : 'direita'}</span><span class="state-chip ${e.state}">${e.state}</span>`;
      if (e.state === 'solta') {
        const b = el('button', { class: 'btn', title: 'Prender ponta com a agulha', 'aria-label': `Prender ponta ${yarnById(e.yarnId).nome}` }, ICONS.needle);
        b.addEventListener('click', () => this.act.secure(e.id));
        li.appendChild(b);
      } else if (e.state === 'presa') {
        const b = el('button', { class: 'btn', title: 'Dar nó', 'aria-label': `Dar nó na ponta ${yarnById(e.yarnId).nome}` }, ICONS.knot);
        b.addEventListener('click', () => this.act.knot(e.id));
        li.appendChild(b);
      }
      ul.appendChild(li);
    });
    p.appendChild(ul);
  }

  private panelTecido(p: HTMLElement, a: AppState): void {
    const s = a.sceneState;
    const rows = s.fabric.filter((e): e is RowEntity => e.kind === 'row');
    const crossings = rows.reduce((acc, r) => acc + r.crossings.length, 0) + (s.active?.crossings.length ?? 0);
    const colors = new Set(rows.map((r) => r.yarnId)).size;
    const dl = el('dl', { class: 'kv' });
    dl.innerHTML = `<dt>Fileiras</dt><dd>${rows.length}</dd><dt>Cruzamentos</dt><dd>${crossings}</dd><dt>Cores usadas</dt><dd>${colors}</dd>
      <dt>Trechos abertos</dt><dd>${openGaps(s).length}</dd><dt>Pontas soltas · presas · atadas</dt><dd>${['solta', 'presa', 'atada'].map((st) => s.ends.filter((e) => e.state === st).length).join(' · ')}</dd>`;
    p.appendChild(dl);
    p.appendChild(el('p', { class: 'invite' }, 'O que você percebe ao olhar o tecido inteiro?'));
    const views = el('div', { class: 'row', style: 'margin:8px 0' });
    for (const [v, lbl] of [['tecido', 'Tecido de perto'], ['geral', 'Visão geral']] as [ViewId, string][]) {
      const b = el('button', { class: 'btn grow' }, `${ICONS.view} ${lbl}`);
      b.addEventListener('click', () => this.act.view(v));
      views.appendChild(b);
    }
    p.appendChild(views);
    p.appendChild(el('h3', {}, 'Revisar'));
    const rp = el('button', { class: `btn ${this.replaying ? 'primary' : ''}`, style: 'width:100%' }, this.replaying ? `${ICONS.pause} Parar revisão` : `${ICONS.replay} Rever a construção passo a passo`);
    rp.addEventListener('click', () => (this.replaying ? this.act.stopReplay() : this.act.replay()));
    p.appendChild(rp);
    p.appendChild(el('h3', {}, 'Levar com você'));
    const ex = el('div', { class: 'row' });
    const png = el('button', { class: 'btn grow' }, `${ICONS.image} Exportar imagem`);
    png.addEventListener('click', () => this.act.exportPng());
    const sum = el('button', { class: 'btn grow' }, `${ICONS.doc} Resumo observável`);
    sum.addEventListener('click', () => this.act.exportSummary());
    ex.append(png, sum);
    p.appendChild(ex);
    p.appendChild(el('h3', {}, 'Salvar neste navegador (opcional)'));
    const title = el('input', { type: 'text', placeholder: 'Título (opcional)', maxlength: '48', 'aria-label': 'Título da criação' }) as HTMLInputElement;
    p.appendChild(title);
    const ck = el('label', { class: 'check' });
    const cbox = el('input', { type: 'checkbox' }) as HTMLInputElement;
    ck.append(cbox, el('span', {}, 'Incluir os nomes dados aos fios.'));
    p.appendChild(ck);
    p.appendChild(el('p', { style: 'font-size:13px' }, 'Fica guardado apenas neste dispositivo. Em aparelho compartilhado, outras pessoas podem ver. Você pode apagar a qualquer momento.'));
    const sv = el('button', { class: 'btn primary', style: 'width:100%' }, `${ICONS.save} Salvar criação`);
    sv.addEventListener('click', () => this.act.save(title.value, cbox.checked));
    p.appendChild(sv);
    if (this.gallery.length) {
      p.appendChild(el('h3', {}, 'Acervo'));
      const ul = el('ul', { class: 'list' });
      for (const c of this.gallery.slice(0, 8)) {
        const li = el('li');
        if (c.thumb) li.appendChild(el('img', { src: c.thumb, alt: '', width: '44', height: '30', style: 'border-radius:6px;object-fit:cover' }));
        li.appendChild(el('span', { class: 'grow' }, `${escapeHtml(c.title || 'Sem título')}<br><small style="color:var(--ink-soft)">${new Date(c.savedAt).toLocaleString('pt-BR')}</small>`));
        const o = el('button', { class: 'btn', 'aria-label': `Abrir ${c.title || 'criação'}` }, 'Abrir');
        o.addEventListener('click', () => this.act.loadCreation(c.id));
        const d = el('button', { class: 'btn', 'aria-label': `Apagar ${c.title || 'criação'}` }, ICONS.trash);
        d.addEventListener('click', () => this.act.deleteCreation(c.id));
        li.append(o, d);
        ul.appendChild(li);
      }
      p.appendChild(ul);
    }
    p.appendChild(el('h3', {}, 'Encerrar'));
    const end = el('div', { class: 'row' });
    const again = el('button', { class: 'btn grow' }, `${ICONS.reset} Recomeçar`);
    again.addEventListener('click', () => this.act.reset());
    const out = el('button', { class: 'btn grow' }, `${ICONS.exit} Sair`);
    out.addEventListener('click', () => this.act.exit());
    end.append(again, out);
    p.appendChild(end);
  }

  private panelAjustes(p: HTMLElement, a: AppState): void {
    p.appendChild(el('h3', {}, 'Qualidade'));
    const q = el('div', { class: 'seg', role: 'group', 'aria-label': 'Qualidade gráfica', style: 'flex-wrap:wrap' });
    for (const [id, lbl] of [['auto', 'Automática'], ['cinema', 'Cinema'], ['equilibrada', 'Equilibrada'], ['leve', 'Leve']] as [QualityId, string][]) {
      const b = el('button', { 'aria-pressed': String(a.settings.quality === id) }, lbl);
      b.addEventListener('click', () => this.act.quality(id));
      q.appendChild(b);
    }
    p.appendChild(q);
    p.appendChild(el('h3', {}, 'Som'));
    const sb = el('button', { class: `btn ${this.soundOn ? 'primary' : ''}`, style: 'width:100%' }, `${this.soundOn ? ICONS.soundOn : ICONS.soundOff} ${this.soundOn ? 'Desligar som' : 'Ligar som'}`);
    sb.addEventListener('click', () => this.act.sound());
    p.appendChild(sb);
    const vl = el('label', { class: 'field' }, '<span>Volume geral</span>');
    const vol = el('input', { type: 'range', min: '0', max: '100', value: String(Math.round(a.settings.volume * 100)), 'aria-label': 'Volume geral' }) as HTMLInputElement;
    vol.addEventListener('input', () => this.act.volume(Number(vol.value) / 100));
    vl.appendChild(vol);
    p.appendChild(vl);
    const amb = el('label', { class: 'check' });
    const ab = el('input', { type: 'checkbox' }) as HTMLInputElement;
    ab.checked = this.ambienceOn;
    ab.disabled = !this.soundOn;
    ab.addEventListener('change', () => this.act.ambience(ab.checked));
    amb.append(ab, el('span', {}, 'Ambiente do ateliê (vento e pássaros distantes)'));
    p.appendChild(amb);
    p.appendChild(el('h3', {}, 'Conforto'));
    const rm = el('label', { class: 'check' });
    const rb = el('input', { type: 'checkbox' }) as HTMLInputElement;
    rb.checked = a.settings.reducedMotion;
    rb.addEventListener('change', () => this.act.reducedMotion(rb.checked));
    rm.append(rb, el('span', {}, 'Reduzir movimento (sem animação de câmera e ferramentas)'));
    p.appendChild(rm);
    p.appendChild(el('h3', {}, 'Teclado'));
    p.appendChild(el('p', { style: 'font-size:13.5px' }, '1–5 ferramentas · ↑ por cima · ↓ por baixo · ⌫ desfazer cruzamento · + / − tensão · Ctrl+Z / Ctrl+Y desfazer e refazer · V visão · H recolher interface · F tela cheia · P pausa · Esc fecha painel'));
    p.appendChild(el('h3', {}, 'Dados'));
    const del = el('button', { class: 'btn danger', style: 'width:100%' }, `${ICONS.trash} Apagar acervo e preferências deste navegador`);
    del.addEventListener('click', () => this.act.deleteAllData());
    p.appendChild(del);
    const pf = el('button', { class: 'btn', style: 'width:100%;margin-top:8px' }, 'Mostrar medições de desempenho');
    pf.addEventListener('click', () => this.act.togglePerf());
    p.appendChild(pf);
    const back = el('button', { class: 'btn', style: 'width:100%;margin-top:8px' }, `${ICONS.reset} Voltar à tela inicial`);
    back.addEventListener('click', () => this.act.backToEntry());
    p.appendChild(back);
  }

  private sectionRegistro(p: HTMLElement, a: AppState): void {
    p.appendChild(el('h3', {}, `Registro do profissional · oportunidade ${Math.min(this.opportunity, a.settings.opportunities)} de ${a.settings.opportunities}`));
    p.appendChild(el('p', { style: 'font-size:13px' }, 'Registre apenas o que foi observado. Nenhuma interpretação é gerada.'));
    const r = el('div', { class: 'row' });
    for (const [res, lbl] of [['independente', 'Independente'], ['com_ajuda', 'Com ajuda'], ['nao_realizada', 'Não realizada'], ['recusada', 'Recusada']] as [ObservationResult, string][]) {
      const b = el('button', { class: 'btn grow', style: 'min-width:45%' }, lbl);
      b.addEventListener('click', () => this.act.observe(res));
      r.appendChild(b);
    }
    p.appendChild(r);
    if (a.observations.length) {
      const ul = el('ul', { class: 'list', style: 'margin-top:8px' });
      a.observations.slice(-5).reverse().forEach((o) => {
        const li = el('li', {}, `<span class="grow">#${o.opportunity} · ${o.step} · ${o.result.replace('_', ' ')}</span>`);
        const d = el('button', { class: 'btn', 'aria-label': 'Remover registro' }, ICONS.trash);
        d.addEventListener('click', () => this.act.removeObservation(o.id));
        li.appendChild(d);
        ul.appendChild(li);
      });
      p.appendChild(ul);
    }
  }

  // ---------- feedback ----------

  say(msg: string, warn = false): void {
    this.status.textContent = msg;
    this.status.classList.toggle('warn', warn);
    this.status.classList.add('show');
    this.live.textContent = msg;
    clearTimeout(this.statusTimer);
    this.statusTimer = window.setTimeout(() => this.status.classList.remove('show'), warn ? 4200 : 2600);
  }

  nextInvite(): void { this.inviteIdx++; }

  setPerf(text: string | null): void {
    this.perf.classList.toggle('show', text !== null);
    if (text !== null) this.perf.textContent = text;
  }

  get perfVisible(): boolean { return this.perf.classList.contains('show'); }

  refreshDock(): void { this.renderDock(); }

  forceRender(): void { this.panelKey = ''; if (this.app) this.render(this.app); }
}

export function tensionWord(v: number): string {
  if (v < 0.2) return 'bem frouxo';
  if (v < 0.42) return 'frouxo';
  if (v < 0.68) return 'médio';
  if (v < 0.86) return 'firme';
  return 'bem tenso';
}

function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
