/**
 * Barra Imersiva (porte TS do kit `ambientes-html/shared/imersivo.js`, mesmas classes CSS).
 * Barra superior (← Ambientes, título, ações, painéis, tela cheia, Recolher), barra inferior de gestos,
 * painéis de vidro sob demanda (um por vez) e botão discreto "Mostrar controles". Tecla H recolhe.
 * A preferência de recolher é compartilhada entre ambientes (`ambientes:controles-recolhidos`).
 */

import { icon } from './icons';

const STORE_KEY = 'ambientes:controles-recolhidos';

export interface PanelApi {
  el: HTMLElement;
  body: HTMLElement;
  btn: HTMLButtonElement;
  id: string;
  toggle(force?: boolean): void;
  isOpen(): boolean;
}

export interface ImersivoConfig {
  title: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
  backHref?: string;
  onCollapse?: (collapsed: boolean) => void;
  onPanelChange?: (open: PanelApi | null) => void;
}

function make<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

function readCollapsed() {
  try {
    return localStorage.getItem(STORE_KEY) === '1';
  } catch {
    return false;
  }
}
function writeCollapsed(v: boolean) {
  try {
    localStorage.setItem(STORE_KEY, v ? '1' : '0');
  } catch {
    /* armazenamento indisponível */
  }
}

export function launcherHref() {
  if (location.protocol === 'file:') return '../index.html';
  // dentro de iframe do Launcher ou servido por ele, a raiz é o Launcher
  return '/';
}

export class Imersivo {
  readonly top: HTMLElement;
  readonly bottom: HTMLElement;
  readonly actions: HTMLElement;
  readonly reveal: HTMLButtonElement;
  readonly status: HTMLElement;
  private tools: HTMLElement;
  private subtitleEl: HTMLElement;
  private panels: PanelApi[] = [];
  private cfg: ImersivoConfig;
  private root = document.documentElement;
  private statusTimer = 0;
  private onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'h' || e.key === 'H') this.setCollapsed(!this.collapsed);
  };

  constructor(cfg: ImersivoConfig) {
    this.cfg = cfg;
    const root = this.root;
    root.classList.add('imv-root');
    if (cfg.theme === 'light') root.classList.add('imv-light');

    const top = make('div', 'imv-top imv-glass');
    top.setAttribute('role', 'toolbar');
    top.setAttribute('aria-label', 'Controles do ambiente');
    const back = make('a', 'imv-back', icon('back') + '<span class="imv-label">Ambientes</span>');
    back.href = cfg.backHref ?? launcherHref();
    back.target = '_top';
    back.title = 'Voltar ao Launcher de ambientes';
    back.dataset.action = 'exit';
    const title = make('div', 'imv-title');
    title.appendChild(make('strong', '', cfg.title));
    this.subtitleEl = make('span', '', cfg.subtitle ?? '');
    title.appendChild(this.subtitleEl);
    this.actions = make('div', 'imv-actions');
    this.tools = make('div', 'imv-actions');
    this.tools.style.overflow = 'visible';
    top.append(back, title, make('div', 'imv-spacer'), this.actions, this.tools);

    const bottom = make('div', 'imv-bottom imv-glass');
    bottom.setAttribute('role', 'toolbar');
    bottom.setAttribute('aria-label', 'Ferramentas e pontos de vista');

    const reveal = make('button', 'imv-reveal', icon('eye') + '<span class="imv-label">Mostrar controles</span>');
    reveal.type = 'button';
    reveal.title = 'Mostrar controles (H)';
    reveal.addEventListener('click', () => this.setCollapsed(false));

    const status = make('div', 'imv-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    document.body.append(top, bottom, reveal, status);
    this.top = top;
    this.bottom = bottom;
    this.reveal = reveal;
    this.status = status;
    window.addEventListener('keydown', this.onKey, true);
  }

  get collapsed() {
    return this.root.classList.contains('imv-collapsed');
  }

  finishTools() {
    this.tools.appendChild(make('span', 'imv-sep'));
    const fs = make('button', 'imv-btn imv-icon', icon('full'));
    fs.type = 'button';
    fs.title = 'Tela cheia';
    fs.setAttribute('aria-label', 'Tela cheia');
    fs.addEventListener('click', () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen?.().catch(() => {});
    });
    const hide = make('button', 'imv-btn', icon('hide') + '<span class="imv-label">Recolher</span>');
    hide.type = 'button';
    hide.title = 'Recolher controles (H)';
    hide.addEventListener('click', () => this.setCollapsed(true));
    this.tools.append(fs, hide);
    if (readCollapsed()) this.setCollapsed(true);
  }

  setSubtitle(text: string) {
    this.subtitleEl.textContent = text;
  }

  setCollapsed(v: boolean) {
    this.root.classList.toggle('imv-collapsed', v);
    writeCollapsed(v);
    this.cfg.onCollapse?.(v);
    if (!v) (this.top.querySelector('.imv-back') as HTMLElement | null)?.focus({ preventScroll: true });
  }

  addAction(btn: HTMLElement) {
    btn.classList.add('imv-moved');
    this.actions.appendChild(btn);
  }

  addPanel(p: { id: string; label: string; icon: string; side?: 'left' | 'right'; width?: number }): PanelApi {
    const el = make('section', `imv-panel imv-glass ${p.side === 'left' ? 'is-left' : 'is-right'}`);
    el.hidden = true;
    el.id = `painel-${p.id}`;
    if (p.width) el.style.width = `min(${p.width}px, calc(100% - 20px))`;
    el.setAttribute('aria-label', p.label);
    el.setAttribute('role', 'region');
    const head = make('div', 'imv-panel-head', `<span class="imv-grip" aria-hidden="true"></span><span>${p.label}</span>`);
    const close = make('button', 'imv-btn imv-icon', icon('close'));
    close.type = 'button';
    close.title = 'Fechar painel';
    close.setAttribute('aria-label', `Fechar ${p.label}`);
    head.appendChild(close);
    const body = make('div', 'imv-panel-body');
    el.append(head, body);
    document.body.appendChild(el);
    const btn = make('button', 'imv-btn', icon(p.icon) + `<span class="imv-label">${p.label}</span>`);
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', el.id);
    btn.title = p.label;
    this.tools.appendChild(btn);
    const api: PanelApi = {
      el,
      body,
      btn,
      id: p.id,
      isOpen: () => !el.hidden,
      toggle: (force?: boolean) => {
        const open = typeof force === 'boolean' ? force : el.hidden;
        this.panels.forEach((o) => {
          if (o !== api) {
            o.el.hidden = true;
            o.btn.setAttribute('aria-expanded', 'false');
          }
        });
        el.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        this.cfg.onPanelChange?.(open ? api : this.openPanel());
      },
    };
    btn.addEventListener('click', () => api.toggle());
    close.addEventListener('click', () => {
      api.toggle(false);
      btn.focus({ preventScroll: true });
    });
    this.panels.push(api);
    return api;
  }

  openPanel(): PanelApi | null {
    return this.panels.find((p) => p.isOpen()) ?? null;
  }

  closePanels() {
    const open = this.openPanel();
    if (open) open.toggle(false);
    return !!open;
  }

  /** Mensagem curta em pílula translúcida, com tom de convite. */
  say(text: string, ms = 4200) {
    window.clearTimeout(this.statusTimer);
    this.status.textContent = text;
    this.status.classList.add('is-on');
    this.statusTimer = window.setTimeout(() => this.status.classList.remove('is-on'), ms);
  }

  dispose() {
    window.removeEventListener('keydown', this.onKey, true);
    [this.top, this.bottom, this.reveal, this.status, ...this.panels.map((p) => p.el)].forEach((n) => n.remove());
  }
}
