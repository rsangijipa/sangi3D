/**
 * Meteorologia das Emocoes — UI em DOM sobre a cena 3D.
 * HUD sincronizado com o estado; botoes +-; arrasto angular nos icones SVG;
 * editor de boletim opcional; overlays de inicio e resumo.
 */

import type { GameState, WeatherKind, EmotionTag, Step } from '../game/state.js';
import { WEATHER_LABELS, EMOTION_TAGS, TAG_LABELS, TEXTS, BULLETIN_HINT, BULLETIN_PLACEHOLDER } from '../game/content.js';
import { audioManager } from '../audio/index.js';

const deg = (d: number) => (d * Math.PI) / 180;

export type UiCallbacks = {
  onWeatherChange: (kind: WeatherKind, value: number) => void;
  onTagToggle: (tag: EmotionTag) => void;
  onBulletinChange: (text: string) => void;
  onSaveBulletin: () => void;
  onClearBulletin: () => void;
  onRestart: (confirmed: boolean) => void;
  onExport: () => void;
  onStart: (mode: GameState['mode']) => void;
  onStepChange: (step: Step) => void;
};

export class UIManager {
  private hud: HTMLElement;
  private overlays: HTMLElement;
  private cb: UiCallbacks;
  private state: () => GameState;

  private dialElements = new Map<WeatherKind, HTMLElement>();
  private valueElements = new Map<WeatherKind, HTMLElement>();
  private activeTags = new Set<EmotionTag>();

  constructor(hud: HTMLElement, overlays: HTMLElement, cb: UiCallbacks, state: () => GameState) {
    this.hud = hud;
    this.overlays = overlays;
    this.cb = cb;
    this.state = state;
    this.buildShell();
    this.render(this.state());
  }

  private buildShell(): void {
    this.hud.innerHTML = '';
    const header = document.createElement('header');
    header.className = 'hud-header';
    const h1 = document.createElement('h1');
    h1.textContent = TEXTS.appTitle;
    header.appendChild(h1);
    this.hud.appendChild(header);

    const body = document.createElement('div');
    body.className = 'hud-body';
    this.hud.appendChild(body);

    this.renderPanel(body, this.state());
  }

  private renderPanel(container: HTMLElement, s: GameState): void {
    container.innerHTML = '';
    this.dialElements.clear();
    this.valueElements.clear();

    if (s.step === 'compose' || s.step === 'review') {
      const panel = document.createElement('section');
      panel.className = 'dials-panel';
      panel.setAttribute('aria-label', TEXTS.composePanel);

      const title = document.createElement('h2');
      title.textContent = TEXTS.composePanel;
      panel.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'dials-grid';
      for (const kind of ['sun', 'cloud', 'rain', 'wind'] as WeatherKind[]) {
        grid.appendChild(this.buildDialDom(kind, s.weather[kind]));
      }
      panel.appendChild(grid);

      const actions = document.createElement('div');
      actions.className = 'hud-actions';

      const btnBulletin = document.createElement('button');
      btnBulletin.className = 'btn-primary';
      btnBulletin.type = 'button';
      btnBulletin.textContent = TEXTS.btnWriteBulletin;
      btnBulletin.setAttribute('aria-pressed', String(s.bulletin.length > 0));
      btnBulletin.addEventListener('click', () => this.cb.onSaveBulletin());
      actions.appendChild(btnBulletin);

      const btnRestart = document.createElement('button');
      btnRestart.className = 'btn-secondary';
      btnRestart.type = 'button';
      btnRestart.textContent = TEXTS.btnRestart;
      btnRestart.addEventListener('click', () => {
        const ok = confirm(TEXTS.confirmResetBody);
        this.cb.onRestart(ok);
      });
      actions.appendChild(btnRestart);

      panel.appendChild(actions);
      container.appendChild(panel);
    }
  }

  public render(s: GameState): void {
    const body = this.hud.querySelector('.hud-body')! as HTMLElement;
    this.renderPanel(body, s);
    this.syncDials(s);
  }
  private buildDialDom(kind: WeatherKind, value: number): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'dial-wrap';
    wrap.setAttribute('data-kind', kind);

    const labelInfo = WEATHER_LABELS.find((l) => l.kind === kind)!;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '-52 -52 104 104');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');

    const ring = document.createElementNS(svgNS, 'circle');
    ring.setAttribute('r', '46');
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#8f6b3b');
    ring.setAttribute('stroke-width', '5');
    svg.appendChild(ring);

    for (let i = 0; i < 5; i++) {
      const a = deg(-110 + i * 55) - Math.PI / 2;
      const x1 = Math.cos(a) * 38;
      const y1 = Math.sin(a) * 38;
      const x2 = Math.cos(a) * 46;
      const y2 = Math.sin(a) * 46;
      const tick = document.createElementNS(svgNS, 'line');
      tick.setAttribute('x1', String(x1));
      tick.setAttribute('y1', String(y1));
      tick.setAttribute('x2', String(x2));
      tick.setAttribute('y2', String(y2));
      tick.setAttribute('stroke', '#5b4a3a');
      tick.setAttribute('stroke-width', '3');
      tick.setAttribute('stroke-linecap', 'round');
      svg.appendChild(tick);
    }

    const knob = document.createElementNS(svgNS, 'line');
    knob.setAttribute('id', `knob-${kind}`);
    knob.setAttribute('x1', '0');
    knob.setAttribute('y1', '0');
    const startAngle = deg(-110 + value * 55) - Math.PI / 2;
    knob.setAttribute('x2', String(Math.cos(startAngle) * 34));
    knob.setAttribute('y2', String(Math.sin(startAngle) * 34));
    knob.setAttribute('stroke', '#d8ae66');
    knob.setAttribute('stroke-width', '5');
    knob.setAttribute('stroke-linecap', 'round');
    svg.appendChild(knob);

    const icon = document.createElementNS(svgNS, 'path');
    icon.setAttribute('fill', '#5b4a3a');
    icon.setAttribute('d', this.iconPath(kind));
    svg.appendChild(icon);

    wrap.appendChild(svg);

    const controls = document.createElement('div');
    controls.className = 'dial-controls';

    const btnDec = document.createElement('button');
    btnDec.type = 'button';
    btnDec.textContent = '−';
    btnDec.setAttribute('aria-label', `Diminuir ${labelInfo.title}`);
    btnDec.addEventListener('click', () => this.cb.onWeatherChange(kind, -1));
    controls.appendChild(btnDec);

    const val = document.createElement('span');
    val.className = 'dial-value';
    val.textContent = String(value);
    val.setAttribute('aria-label', `${labelInfo.title}: ${value} de 4`);
    controls.appendChild(val);

    const btnInc = document.createElement('button');
    btnInc.type = 'button';
    btnInc.textContent = '＋';
    btnInc.setAttribute('aria-label', `Aumentar ${labelInfo.title}`);
    btnInc.addEventListener('click', () => this.cb.onWeatherChange(kind, +1));
    controls.appendChild(btnInc);

    wrap.appendChild(controls);

    const lbl = document.createElement('span');
    lbl.className = 'dial-label';
    lbl.textContent = labelInfo.title;
    wrap.appendChild(lbl);

    this.installDialDrag(svg, kind);

    this.dialElements.set(kind, wrap);
    this.valueElements.set(kind, val);
    return wrap;
  }

  private iconPath(kind: WeatherKind): string {
    if (kind === 'sun') {
      return 'M-8 -8 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 Z M-16 0 L-26 0 M16 0 L26 0 M0 -16 L0 -26 M0 16 L0 26';
    }
    if (kind === 'cloud') {
      return 'M-12 -4 Q-14 -12 -6 -12 Q2 -12 4 -4 Q10 -4 12 4 Q12 10 6 12 Q-2 12 -6 4 Q-10 4 -12 -4 Z';
    }
    if (kind === 'rain') {
      return 'M-10 -6 Q-12 -12 -6 -12 Q0 -12 2 -6 L-2 -6 Z M-2 -6 L-2 10 M4 -6 L4 10 M10 -6 L10 10';
    }
    return 'M-14 6 Q0 0 14 -6 M-10 2 Q2 0 10 -2 M-6 -2 Q2 0 6 2';
  }

  private installDialDrag(svg: SVGSVGElement, kind: WeatherKind): void {
    let active = false;
    let startAngle = 0;
    let startValue = 0;

    const getAngle = (clientX: number, clientY: number) => {
      const rect = svg.getBoundingClientRect();
      const dx = clientX - rect.left - rect.width / 2;
      const dy = clientY - rect.top - rect.height / 2;
      return Math.atan2(dy, dx) + Math.PI / 2;
    };

    const start = (clientX: number, clientY: number) => {
      active = true;
      startAngle = getAngle(clientX, clientY);
      startValue = this.state().weather[kind];
      svg.classList.add('dragging');
      audioManager.playUiClick('click');
    };
    const move = (clientX: number, clientY: number) => {
      if (!active) return;
      const a = getAngle(clientX, clientY);
      let delta = a - startAngle;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      const step = deg(55);
      const value = Math.round(startValue + delta / step);
      this.cb.onWeatherChange(kind, value);
    };
    const end = () => {
      if (!active) return;
      active = false;
      svg.classList.remove('dragging');
      audioManager.playUiClick('tick');
    };

    svg.addEventListener('mousedown', (e) => start(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);

    svg.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      start(t.clientX, t.clientY);
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if (active) {
        e.preventDefault();
        const t = e.changedTouches[0];
        move(t.clientX, t.clientY);
      }
    }, { passive: false });
    window.addEventListener('touchend', end);
  }

  private syncDials(s: GameState): void {
    for (const [kind, wrap] of this.dialElements) {
      const val = this.valueElements.get(kind)!;
      val.textContent = String(s.weather[kind]);
      const svg = wrap.querySelector('svg')!;
      const knob = svg.querySelector(`#knob-${kind}`) as SVGLineElement | null;
      if (knob) {
        const a = deg(-110 + s.weather[kind] * 55) - Math.PI / 2;
        knob.setAttribute('x2', String(Math.cos(a) * 34));
        knob.setAttribute('y2', String(Math.sin(a) * 34));
      }
    }
    const btn = this.hud.querySelector('.btn-primary');
    if (btn) btn.setAttribute('aria-pressed', String(s.bulletin.length > 0));
  }

  // ------------------------------------------------------------------
  // Editor de boletim (opcional)
  // ------------------------------------------------------------------

  openBulletinEditor(s: GameState): void {
    this.closeOverlays();
    const el = document.createElement('div');
    el.className = 'overlay';
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'bulletin-title');

    const backdrop = document.createElement('div');
    backdrop.className = 'overlay-backdrop';
    this.overlays.appendChild(backdrop);
    this.overlays.appendChild(el);

    const h2 = document.createElement('h2');
    h2.id = 'bulletin-title';
    h2.textContent = TEXTS.btnWriteBulletin;
    el.appendChild(h2);

    const p = document.createElement('p');
    p.textContent = BULLETIN_HINT;
    el.appendChild(p);

    const field = document.createElement('div');
    field.className = 'field';
    const label = document.createElement('label');
    label.textContent = 'Boletim';
    label.setAttribute('for', 'bulletin-text');
    const textarea = document.createElement('textarea');
    textarea.id = 'bulletin-text';
    textarea.placeholder = BULLETIN_PLACEHOLDER;
    textarea.value = s.bulletin;
    textarea.setAttribute('aria-label', 'Boletim opcional');
    field.appendChild(label);
    field.appendChild(textarea);
    el.appendChild(field);

    const tagsLabel = document.createElement('label');
    tagsLabel.textContent = 'Associar palavras (opcional):';
    tagsLabel.style.display = 'block';
    tagsLabel.style.marginBottom = '6px';
    tagsLabel.style.fontWeight = '600';
    tagsLabel.style.fontSize = '0.9rem';
    tagsLabel.style.color = '#5b4a3a';
    el.appendChild(tagsLabel);

    const tagList = document.createElement('div');
    tagList.className = 'tag-list';
    for (const tag of EMOTION_TAGS) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `tag-chip ${this.activeTags.has(tag) ? 'active' : ''}`;
      chip.textContent = TAG_LABELS[tag];
      chip.setAttribute('aria-pressed', String(this.activeTags.has(tag)));
      chip.addEventListener('click', () => {
        this.activeTags = this.activeTags.has(tag)
          ? new Set([...this.activeTags].filter((t) => t !== tag))
          : new Set([...this.activeTags, tag]);
        chip.classList.toggle('active');
        chip.setAttribute('aria-pressed', String(this.activeTags.has(tag)));
      });
      tagList.appendChild(chip);
    }
    el.appendChild(tagList);

    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Voce pode deixar o boletim em branco. Ele so e guardado se voce escolher.';
    el.appendChild(hint);

    const actions = document.createElement('div');
    actions.className = 'actions-row';

    const btnSave = document.createElement('button');
    btnSave.type = 'button';
    btnSave.className = 'btn-primary';
    btnSave.textContent = 'Guardar boletim';
    btnSave.addEventListener('click', () => {
      this.cb.onBulletinChange(textarea.value);
      this.cb.onSaveBulletin();
      this.closeOverlays();
    });
    actions.appendChild(btnSave);

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'btn-secondary';
    btnClear.textContent = 'Apagar boletim';
    btnClear.addEventListener('click', () => {
      this.cb.onBulletinChange('');
      this.cb.onClearBulletin();
      this.closeOverlays();
    });
    actions.appendChild(btnClear);

    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'btn-secondary';
    btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', () => this.closeOverlays());
    actions.appendChild(btnCancel);

    el.appendChild(actions);
    textarea.focus();
  }

  // ------------------------------------------------------------------
  // Overlay de inicio
  // ------------------------------------------------------------------

  openStartOverlay(): void {
    this.closeOverlays();
    const el = document.createElement('div');
    el.className = 'overlay';
    el.setAttribute('aria-modal', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = 'overlay-backdrop';
    this.overlays.appendChild(backdrop);
    this.overlays.appendChild(el);

    const h2 = document.createElement('h2');
    h2.textContent = TEXTS.appTitle;
    el.appendChild(h2);

    const p = document.createElement('p');
    p.textContent = 'Antes de comecar, nos diga seu nome (opcional) e o objetivo desta sessao em uma frase.';
    el.appendChild(p);

    const nameField = document.createElement('div');
    nameField.className = 'field';
    const nLabel = document.createElement('label');
    nLabel.textContent = TEXTS.lblYourName;
    const nInput = document.createElement('input');
    nInput.placeholder = 'Seu nome';
    nInput.setAttribute('aria-label', TEXTS.lblYourName);
    nameField.appendChild(nLabel);
    nameField.appendChild(nInput);
    el.appendChild(nameField);

    const goalField = document.createElement('div');
    goalField.className = 'field';
    const gLabel = document.createElement('label');
    gLabel.textContent = TEXTS.lblGoal;
    const gInput = document.createElement('textarea');
    gInput.placeholder = 'Exemplo: entender como estou me sentindo hoje.';
    gInput.setAttribute('aria-label', TEXTS.lblGoal);
    goalField.appendChild(gLabel);
    goalField.appendChild(gInput);
    el.appendChild(goalField);

    const modeLabel = document.createElement('label');
    modeLabel.textContent = 'Modo de jogo:';
    modeLabel.style.display = 'block';
    modeLabel.style.marginBottom = '6px';
    modeLabel.style.fontWeight = '600';
    modeLabel.style.fontSize = '0.9rem';
    modeLabel.style.color = '#5b4a3a';
    el.appendChild(modeLabel);

    const modeList = document.createElement('div');
    modeList.style.display = 'grid';
    modeList.style.gap = '8px';
    for (const m of [
      { id: 'free' as const, title: 'Livre', desc: 'Explore sem avaliacao.' },
      { id: 'guided' as const, title: 'Guiada', desc: 'Pistas graduais; voce decide.' },
      { id: 'accompanied' as const, title: 'Acompanhada', desc: 'Adulto define os parametros.' },
    ]) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-secondary';
      btn.style.textAlign = 'left';
      btn.style.padding = '10px 14px';
      btn.innerHTML = `<div style="font-weight:700">${m.title}</div><div style="font-size:0.8rem;color:#5b4a3a">${m.desc}</div>`;
      btn.addEventListener('click', () => {
        this.closeOverlays();
        this.cb.onStart(m.id);
      });
      modeList.appendChild(btn);
    }
    el.appendChild(modeList);

    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = TEXTS.noClinicalPromise;
    el.appendChild(hint);

    const actions = document.createElement('div');
    actions.className = 'actions-row';
    const btnStart = document.createElement('button');
    btnStart.type = 'button';
    btnStart.className = 'btn-primary';
    btnStart.textContent = TEXTS.btnStart;
    btnStart.addEventListener('click', () => {
      this.closeOverlays();
      this.cb.onStart(this.state().mode);
    });
    actions.appendChild(btnStart);
    el.appendChild(actions);
  }

  // ------------------------------------------------------------------
  // Overlay de resumo / conclusao
  // ------------------------------------------------------------------

  openSummary(s: GameState): void {
    this.closeOverlays();
    const el = document.createElement('div');
    el.className = 'overlay';
    el.setAttribute('aria-modal', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = 'overlay-backdrop';
    this.overlays.appendChild(backdrop);
    this.overlays.appendChild(el);

    const h2 = document.createElement('h2');
    h2.textContent = 'Resumo da sessao';
    el.appendChild(h2);

    const txt = document.createElement('p');
    txt.textContent = [
      `Modo: ${s.mode}.`,
      `Etapa final: ${s.step}.`,
      `Clima composto — sol ${s.weather.sun}/4, nuvens ${s.weather.cloud}/4, chuva ${s.weather.rain}/4, vento ${s.weather.wind}/4.`,
      s.emotionTags.length ? `Palavras: ${s.emotionTags.join(', ')}.` : 'Nenhuma palavra associada.',
      s.bulletin ? `Boletim: "${s.bulletin}".` : 'Boletim: em branco.',
      `Snapshots guardados: ${s.snapshots.length}.`,
      `Duracao ativa: ${s.counters.activeSeconds}s.`,
    ].join(' ');
    el.appendChild(txt);

    const notice = document.createElement('p');
    notice.className = 'hint';
    notice.textContent = TEXTS.sharedDeviceNotice;
    el.appendChild(notice);

    const actions = document.createElement('div');
    actions.className = 'actions-row';

    const btnExport = document.createElement('button');
    btnExport.type = 'button';
    btnExport.className = 'btn-secondary';
    btnExport.textContent = TEXTS.btnExport;
    btnExport.addEventListener('click', () => this.cb.onExport());
    actions.appendChild(btnExport);

    const btnRepeat = document.createElement('button');
    btnRepeat.type = 'button';
    btnRepeat.className = 'btn-secondary';
    btnRepeat.textContent = TEXTS.btnRestart;
    btnRepeat.addEventListener('click', () => {
      const ok = confirm(TEXTS.confirmResetBody);
      this.cb.onRestart(ok);
      this.closeOverlays();
    });
    actions.appendChild(btnRepeat);

    const btnExit = document.createElement('button');
    btnExit.type = 'button';
    btnExit.className = 'btn-primary';
    btnExit.textContent = TEXTS.btnExit;
    btnExit.addEventListener('click', () => this.cb.onStepChange('exit'));
    actions.appendChild(btnExit);

    el.appendChild(actions);
  }

  public closeOverlays(): void {
    this.overlays.querySelectorAll('.overlay-backdrop, .overlay').forEach((n) => n.remove());
  }

  destroy(): void {
    this.closeOverlays();
    this.hud.innerHTML = '';
  }
}

