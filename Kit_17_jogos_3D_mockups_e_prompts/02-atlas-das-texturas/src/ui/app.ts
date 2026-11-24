import {
  DESCRIPTORS,
  DESCRIPTOR_LABEL,
  DISCLAIMER,
  LIGHT_PRESETS,
  LIGHT_PRESET_LABEL,
  MODES,
  MODE_INFO,
  NOT_TOUCH,
  OPEN_QUESTIONS,
  PREFERENCES,
  PREFERENCE_LABEL,
  SAMPLES,
  SAMPLE_IDS,
  STEPS,
  type SampleId,
} from '../game/content';
import { compareOrder, stepId, type SessionState } from '../game/state';
import { LIMITS } from '../game/rules';
import { icon } from './icons';
import { Imersivo, type PanelApi } from './imersivo';

/**
 * Interface DOM do Atlas das Texturas. Renderiza a partir do mesmo estado que a cena consome
 * e emite comandos (data-cmd) para o orquestrador. Nenhuma regra de jogo mora aqui.
 */

export type Cmd = (name: string, arg?: string) => void;

export interface UiPrefs {
  quality: 'auto' | 'alta' | 'media' | 'baixa';
  detected: 'alta' | 'media' | 'baixa';
  sound: boolean;
  volume: number;
  reduced: boolean;
}

export interface UiExtras {
  activeMs: number;
  savedLocal: boolean;
  view: string;
  challenge: { target: SampleId; options: SampleId[]; answer: SampleId | null; image: string } | null;
  webgl: boolean;
  busy: boolean;
}

const QUALITY_LABEL = { alta: 'Cinema', media: 'Equilibrada', baixa: 'Leve' } as const;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function btn(cmd: string, label: string, o: { arg?: string; cls?: string; ico?: string; pressed?: boolean; disabled?: boolean; title?: string; iconOnly?: boolean } = {}) {
  const attrs = [
    `type="button"`,
    `data-cmd="${cmd}"`,
    o.arg !== undefined ? `data-arg="${esc(o.arg)}"` : '',
    o.pressed !== undefined ? `aria-pressed="${o.pressed}"` : '',
    o.disabled ? 'disabled' : '',
    o.title ? `title="${esc(o.title)}"` : '',
    o.iconOnly ? `aria-label="${esc(label)}"` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const inner = (o.ico ? icon(o.ico) : '') + (o.iconOnly ? '' : `<span>${esc(label)}</span>`);
  return `<button class="${o.cls ?? 'b-sec'}" ${attrs}>${inner}</button>`;
}

function fmtTime(ms: number) {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m ? `${m} min ${String(s % 60).padStart(2, '0')} s` : `${s} s`;
}

export class AppUI {
  readonly bar: Imersivo;
  private cmd: Cmd;
  private panels: Record<string, PanelApi> = {};
  private thumbs: Partial<Record<SampleId, string>> = {};
  private overlay: HTMLElement;
  private hover: HTMLElement;
  private actionsEl: Record<string, HTMLButtonElement> = {};
  private companionDraft: SampleId[] = [];
  private draftMode: (typeof MODES)[number] = 'livre';
  private lastOverlayKey = '';
  onInsets: ((right: number, bottom: number) => void) | null = null;

  constructor(cmd: Cmd) {
    this.cmd = cmd;
    this.bar = new Imersivo({
      title: 'Atlas das Texturas',
      subtitle: 'Ateliê de observação de superfícies',
      theme: 'light',
      onPanelChange: () => this.reportInsets(),
      onCollapse: () => this.reportInsets(),
    });
    const mk = (id: string, label: string, ico: string) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'imv-btn';
      b.dataset.cmd = id;
      b.innerHTML = icon(ico) + `<span class="imv-label">${label}</span>`;
      b.title = label;
      b.setAttribute('aria-label', label);
      this.bar.addAction(b);
      this.actionsEl[id] = b;
      return b;
    };
    mk('pause', 'Pausar', 'pause');
    mk('sound', 'Som', 'mute');
    mk('restart', 'Recomeçar', 'reset');
    this.panels.etapa = this.bar.addPanel({ id: 'etapa', label: 'Etapa', icon: 'steps', width: 372 });
    this.panels.atlas = this.bar.addPanel({ id: 'atlas', label: 'Atlas', icon: 'book', width: 372 });
    this.panels.registro = this.bar.addPanel({ id: 'registro', label: 'Registro', icon: 'list', width: 372 });
    this.panels.ajustes = this.bar.addPanel({ id: 'ajustes', label: 'Ajustes', icon: 'sliders', width: 340 });
    this.bar.finishTools();

    this.overlay = document.createElement('div');
    this.overlay.className = 'ov';
    this.overlay.hidden = true;
    document.body.appendChild(this.overlay);
    this.hover = document.createElement('div');
    this.hover.className = 'hover-label';
    this.hover.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.hover);

    document.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest('[data-cmd]') as HTMLElement | null;
      if (!t || (t as HTMLButtonElement).disabled) return;
      if (t.tagName === 'A' && t.dataset.cmd === 'exit') {
        this.cmd('exit', 'link');
        return;
      }
      e.preventDefault();
      this.cmd(t.dataset.cmd!, t.dataset.arg);
    });
    document.addEventListener('input', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.dataset.input) this.cmd(t.dataset.input, t.value);
    });
    const ro = new ResizeObserver(() => this.reportInsets());
    Object.values(this.panels).forEach((p) => ro.observe(p.el));
    window.addEventListener('resize', () => this.reportInsets());
  }

  setThumbs(t: Partial<Record<SampleId, string>>) {
    this.thumbs = t;
  }

  openPanel(id: string, open = true) {
    this.panels[id]?.toggle(open);
  }

  isPanelOpen() {
    return !!this.bar.openPanel();
  }

  /** Espaço ocupado pelos painéis: a câmera desloca o enquadramento para não esconder a amostra. */
  reportInsets() {
    const p = this.bar.openPanel();
    const mobile = window.innerWidth <= 720;
    let right = 0;
    let bottom = 0;
    if (p && !this.bar.collapsed) {
      const r = p.el.getBoundingClientRect();
      if (mobile) bottom = Math.max(0, window.innerHeight - r.top);
      else right = r.width + 10;
    }
    this.onInsets?.(right, bottom);
  }

  showHover(text: string | null, x = 0, y = 0) {
    if (!text) {
      this.hover.classList.remove('is-on');
      return;
    }
    this.hover.textContent = text;
    this.hover.style.transform = `translate(${Math.round(x)}px, ${Math.round(y - 34)}px) translateX(-50%)`;
    this.hover.classList.add('is-on');
  }

  say(text: string, ms?: number) {
    this.bar.say(text, ms);
  }

  /* ---------------------------------------------------------------- */

  render(s: SessionState, prefs: UiPrefs, x: UiExtras) {
    const id = stepId(s);
    const st = STEPS[s.step];
    this.bar.setSubtitle(s.phase === 'jogo' ? `Etapa ${s.step + 1} de ${STEPS.length} · ${st.title}` : 'Ateliê de observação de superfícies');
    const p = this.actionsEl;
    p.pause.innerHTML = icon(s.paused ? 'play' : 'pause') + `<span class="imv-label">${s.paused ? 'Retomar' : 'Pausar'}</span>`;
    p.pause.setAttribute('aria-label', s.paused ? 'Retomar' : 'Pausar');
    p.pause.disabled = s.phase !== 'jogo';
    p.sound.innerHTML = icon(prefs.sound ? 'sound' : 'mute') + `<span class="imv-label">${prefs.sound ? 'Som ligado' : 'Som desligado'}</span>`;
    p.sound.setAttribute('aria-label', prefs.sound ? 'Desligar som' : 'Ligar som');
    p.sound.setAttribute('aria-pressed', String(prefs.sound));
    p.restart.disabled = s.phase === 'entrada';

    this.patch(this.panels.etapa.body, s.phase === 'jogo' ? this.stepHtml(s, x) : this.idleHtml());
    this.patch(this.panels.atlas.body, this.atlasHtml(s));
    this.patch(this.panels.registro.body, this.registroHtml(s, x));
    this.patch(this.panels.ajustes.body, this.ajustesHtml(s, prefs, x));
    this.patch(this.bar.bottom, s.phase === 'jogo' ? this.bottomHtml(s, x) : '');
    this.renderOverlay(s, x);
    void id;
  }

  /** Troca o conteúdo preservando o foco de teclado no mesmo comando. */
  private patch(el: HTMLElement, html: string) {
    if ((el as HTMLElement & { _html?: string })._html === html) return;
    const a = document.activeElement as HTMLElement | null;
    const key = a && el.contains(a) && a.dataset.cmd ? `[data-cmd="${a.dataset.cmd}"]${a.dataset.arg !== undefined ? `[data-arg="${CSS.escape(a.dataset.arg)}"]` : ''}` : null;
    const inputKey = a && el.contains(a) && (a as HTMLInputElement).dataset.input ? `[data-input="${(a as HTMLInputElement).dataset.input}"]` : null;
    if (inputKey) return; // não interrompe um controle deslizante em uso
    el.innerHTML = html;
    (el as HTMLElement & { _html?: string })._html = html;
    if (key) (el.querySelector(key) as HTMLElement | null)?.focus({ preventScroll: true });
  }

  private dots(s: SessionState) {
    return `<div class="dots" aria-hidden="true">${STEPS.map((st, i) => `<span class="${i === s.step ? 'on' : s.visited.includes(st.id) ? 'seen' : ''}"></span>`).join('')}</div>`;
  }

  private thumb(id: SampleId, cls = '') {
    const src = this.thumbs[id];
    return src ? `<img class="thumb ${cls}" src="${src}" alt="" width="56" height="56" />` : `<span class="thumb ${cls} thumb-txt" aria-hidden="true">${SAMPLES[id].name.slice(0, 2)}</span>`;
  }

  private idleHtml() {
    return `<p class="muted">Escolha um modo na entrada para começar.</p>`;
  }

  private stepHtml(s: SessionState, x: UiExtras): string {
    const st = STEPS[s.step];
    const id = st.id;
    const head = `<div class="step-head"><span class="step-label">Etapa ${s.step + 1} de ${STEPS.length}</span>${this.dots(s)}</div>
      <h2 class="step-title">${esc(st.title)}</h2><p class="invite">${esc(st.invite)}</p>`;
    const hint =
      s.mode === 'guiado'
        ? `<div class="hints">${st.hints
            .slice(0, s.hintLevel)
            .map((h) => `<p class="hint">${icon('help')}<span>${esc(h)}</span></p>`)
            .join('')}${s.hintLevel < st.hints.length ? btn('hint', s.hintLevel ? 'Outra pista' : 'Pedir uma pista', { ico: 'help', cls: 'b-ghost' }) : ''}</div>`
        : '';
    const canNext = id !== 'escolher' || s.chosen.length >= LIMITS.chooseCount;
    const nav = `<div class="nav">${btn('back', 'Voltar', { ico: 'prev', cls: 'b-ghost', disabled: s.step === 0 })}${btn('skip', 'Pular', { ico: 'skip', cls: 'b-ghost' })}${
      id === 'revisar' ? btn('finish', 'Concluir', { ico: 'check', cls: 'b-cta' }) : btn('next', 'Continuar', { ico: 'next', cls: 'b-cta', disabled: !canNext })
    }</div>`;
    const switcher =
      s.chosen.length > 1 && (id === 'observar' || id === 'rasante')
        ? `<div class="chips" role="group" aria-label="Amostra na bandeja">${s.chosen
            .map((c) => `<button type="button" class="chip-s" data-cmd="active" data-arg="${c}" aria-pressed="${c === s.sampleId}">${this.thumb(c, 'sm')}<span>${esc(SAMPLES[c].name)}</span></button>`)
            .join('')}</div>`
        : '';
    const sample = s.sampleId ? SAMPLES[s.sampleId] : null;
    const detail = sample && (id === 'observar' || id === 'rasante') ? `<p class="detail"><strong>${esc(sample.name)}.</strong> ${esc(sample.detail)}</p><p class="question">${esc(sample.question)}</p>` : '';
    let body = '';
    switch (id) {
      case 'escolher':
        body = `<p class="count" aria-live="polite">${s.chosen.length} de ${LIMITS.chooseCount} escolhidas${s.mode === 'livre' ? ' · troca livre' : ''}</p>
        <div class="grid" role="group" aria-label="Amostras">${s.allowed
          .map(
            (c) =>
              `<button type="button" class="card-s" data-cmd="choose" data-arg="${c}" aria-pressed="${s.chosen.includes(c)}">${this.thumb(c)}<span class="nm">${esc(SAMPLES[c].name)}</span>${
                s.chosen.includes(c) ? `<span class="badge">${s.chosen.indexOf(c) === 0 ? 'A' : 'B'}</span>` : ''
              }</button>`,
          )
          .join('')}</div>`;
        break;
      case 'observar':
        body = `${switcher}${detail}
        <div class="row">${btn('view', x.view === 'perto' ? 'Afastar' : 'Aproximar', { arg: x.view === 'perto' ? 'bancada' : 'perto', ico: 'near', cls: 'b-cta' })}</div>
        <div class="ctl"><span>Girar a amostra</span><div class="pair">${btn('rot', 'Girar para a esquerda', { arg: '-15', ico: 'rotl', iconOnly: true })}${btn('rot', 'Girar para a direita', {
          arg: '15',
          ico: 'rotr',
          iconOnly: true,
        })}</div></div>
        <p class="muted small">${esc(NOT_TOUCH)}</p>`;
        break;
      case 'rasante':
        body = `${switcher}
        <div class="stack">${btn('sweep', s.lampSweep ? 'Parar o giro' : 'Girar a luz', { ico: 'bulb', cls: 'b-cta big', pressed: s.lampSweep })}
        ${btn('save', 'Guardar', { arg: s.sampleId ?? '', ico: 'inbox', cls: 'b-sec big', disabled: x.busy })}
        <div class="row center">${btn('tool', s.tool === 'mao' ? 'Mão: girar a amostra (ativa)' : 'Mão: girar a amostra', { arg: 'mao', ico: 'hand', cls: 'b-round', iconOnly: true, pressed: s.tool === 'mao' })}
        ${btn('lens', s.magnifierOn ? 'Guardar a lupa' : 'Usar a lupa', { ico: 'lens', cls: 'b-round', iconOnly: true, pressed: s.magnifierOn })}</div></div>
        ${detail}
        <div class="ctl"><span>Ângulo <b>${Math.round(s.lampAngle)}°</b></span><div class="pair">${btn('lamp-az', 'Girar a luz para trás', { arg: '-10', ico: 'minus', iconOnly: true, disabled: s.lampAngle <= LIMITS.lampAngle.min })}${btn(
          'lamp-az',
          'Girar a luz para a frente',
          { arg: '10', ico: 'plus', iconOnly: true, disabled: s.lampAngle >= LIMITS.lampAngle.max },
        )}</div></div>
        <div class="ctl"><span>Altura <b>${Math.round(s.lampElevation)}°</b></span><div class="pair">${btn('lamp-el', 'Baixar a luz', { arg: '-5', ico: 'minus', iconOnly: true, disabled: s.lampElevation <= LIMITS.lampElevation.min })}${btn(
          'lamp-el',
          'Subir a luz',
          { arg: '5', ico: 'plus', iconOnly: true, disabled: s.lampElevation >= LIMITS.lampElevation.max },
        )}</div></div>
        ${s.magnifierOn ? `<div class="ctl"><span>Lupa <b>${s.zoom.toFixed(1).replace('.', ',')}×</b></span><div class="pair">${btn('zoom', 'Menos zoom', { arg: '-0.5', ico: 'minus', iconOnly: true, disabled: s.zoom <= LIMITS.zoom.min })}${btn('zoom', 'Mais zoom', { arg: '0.5', ico: 'plus', iconOnly: true, disabled: s.zoom >= LIMITS.zoom.max })}</div></div>` : ''}`;
        break;
      case 'comparar': {
        const pair = compareOrder(s);
        body = pair
          ? `<p class="muted small">Mesma luz (${Math.round(s.lampAngle)}°, altura ${Math.round(s.lampElevation)}°), mesma escala e mesmo giro.</p>
          <div class="cmp">${pair
            .map(
              (c, i) => `<div class="cmp-col"><div class="cmp-h">${this.thumb(c, 'sm')}<span>${i === 0 ? 'Esquerda' : 'Direita'}: <b>${esc(SAMPLES[c].name)}</b></span></div>
            <div class="chips wrap" role="group" aria-label="Descritores para ${esc(SAMPLES[c].name)}">${DESCRIPTORS.map(
              (d) => `<button type="button" class="chip" data-cmd="desc" data-arg="${c}|${d}" aria-pressed="${(s.descriptors[c] ?? []).includes(d)}">${esc(DESCRIPTOR_LABEL[d])}</button>`,
            ).join('')}</div></div>`,
            )
            .join('')}</div>
          <div class="row">${btn('swap', 'Trocar lados', { ico: 'swap' })}${btn('view', 'Rente à mesa', { arg: 'rente', ico: 'low' })}</div>
          <p class="question">${esc(OPEN_QUESTIONS[2])}</p>`
          : '<p class="muted">Escolha duas amostras para comparar.</p>';
        break;
      }
      case 'guardar':
        body = s.chosen
          .map((c) => {
            const saved = s.collection.some((e) => e.sampleId === c);
            const pref = s.preferences[c] ?? null;
            return `<div class="save-card">${this.thumb(c, 'sm')}<div class="sc-body"><b>${esc(SAMPLES[c].name)}</b>
            <div class="chips wrap" role="radiogroup" aria-label="Cartão de preferência para ${esc(SAMPLES[c].name)}">${PREFERENCES.map(
              (p) => `<button type="button" class="chip" role="radio" data-cmd="pref" data-arg="${c}|${p}" aria-checked="${pref === p}">${esc(PREFERENCE_LABEL[p])}</button>`,
            ).join('')}<button type="button" class="chip" role="radio" data-cmd="pref" data-arg="${c}|" aria-checked="${pref === null}">omitir</button></div>
            ${btn('save', saved ? 'Atualizar no atlas' : 'Guardar no atlas', { arg: c, ico: 'inbox', cls: saved ? 'b-sec' : 'b-cta', disabled: x.busy })}
            ${saved ? `<span class="ok">${icon('check')} no atlas</span>` : ''}</div></div>`;
          })
          .join('');
        break;
      case 'revisar':
        body = `<p class="count">${s.collection.length} ${s.collection.length === 1 ? 'entrada' : 'entradas'} no atlas</p>
        <div class="row wrap">${btn('panel', 'Abrir o atlas', { arg: 'atlas', ico: 'book', cls: 'b-cta' })}${btn('another', 'Experimentar outras', { ico: 'reset' })}${btn('challenge', 'Desafio de correspondência', { ico: 'puzzle' })}</div>
        ${this.challengeHtml(x)}
        <p class="question">${esc(OPEN_QUESTIONS[3])}</p>`;
        break;
    }
    return `${head}${body}${hint}${nav}`;
  }

  private challengeHtml(x: UiExtras) {
    const c = x.challenge;
    if (!c) return '';
    const res = c.answer
      ? `<p class="hint" role="status">${icon('check')}<span>${c.answer === c.target ? `É a ${esc(SAMPLES[c.target].name)}.` : `Esta imagem é da ${esc(SAMPLES[c.target].name)}; você marcou ${esc(SAMPLES[c.answer].name)}.`} O que na imagem ajudou a decidir?</span></p>${btn('challenge', 'Outra imagem', { ico: 'puzzle', cls: 'b-ghost' })}`
      : '';
    return `<div class="challenge"><img src="${c.image}" alt="Detalhe ampliado de uma das amostras" width="200" height="200"/>
      <p class="small">De qual amostra é este detalhe? Não há pontuação.</p>
      <div class="chips wrap">${c.options.map((o) => `<button type="button" class="chip" data-cmd="challenge-answer" data-arg="${o}" aria-pressed="${c.answer === o}" ${c.answer ? 'disabled' : ''}>${esc(SAMPLES[o].name)}</button>`).join('')}</div>${res}</div>`;
  }

  private atlasHtml(s: SessionState) {
    if (!s.collection.length) return `<p class="muted">O atlas ainda está vazio. Guarde uma amostra na etapa de luz rasante ou em “Guardar no atlas”.</p>`;
    const entries = [...s.collection].sort((a, b) => a.order - b.order);
    return `<ol class="atlas">${entries
      .map(
        (e) => `<li class="entry">${this.thumb(e.sampleId)}<div><b>${esc(SAMPLES[e.sampleId].name)}</b>
      <p class="small">${e.descriptors.length ? e.descriptors.map((d) => DESCRIPTOR_LABEL[d]).join(', ') : 'sem descritor'} · ${e.preference ? PREFERENCE_LABEL[e.preference] : 'preferência omitida'}</p>
      <p class="small muted">Luz a ${Math.round(e.lampAngle)}°, altura ${Math.round(e.lampElevation)}°</p>
      ${btn('remove', 'Retirar', { arg: e.sampleId, ico: 'trash', cls: 'b-ghost' })}</div></li>`,
      )
      .join('')}</ol>`;
  }

  private registroHtml(s: SessionState, x: UiExtras) {
    const c = s.counters;
    const rows: [string, string][] = [
      ['Tempo ativo', fmtTime(x.activeMs)],
      ['Modo', MODE_INFO[s.mode].name],
      ['Etapas visitadas', `${s.visited.length} de ${STEPS.length}`],
      ['Amostras escolhidas', s.chosen.map((c2) => SAMPLES[c2].name).join(', ') || '—'],
      ['Giros da amostra', String(c.rotations)],
      ['Ajustes de luz', String(c.lampMoves)],
      ['Usos da lupa', String(c.magnifierUses)],
      ['Entradas no atlas', String(s.collection.length)],
      ['Pistas pedidas', String(c.hints)],
      ['Pausas', String(c.pauses)],
      ['Desafios vistos', String(c.challenges)],
    ];
    return `<dl class="reg">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <p class="question">${esc(OPEN_QUESTIONS[0])}</p>
      <p class="disclaimer">${esc(DISCLAIMER)}</p>
      <div class="stack">${btn('export', 'Exportar resumo (JSON)', { ico: 'download' })}
      ${btn('save-local', x.savedLocal ? 'Atualizar no aparelho' : 'Salvar neste aparelho', { ico: 'save' })}
      ${x.savedLocal ? btn('clear-local', 'Apagar dados salvos', { ico: 'trash', cls: 'b-ghost' }) : ''}</div>
      <p class="small muted">Salvar fica só neste navegador. Em aparelho compartilhado, apague ao terminar.</p>`;
  }

  private ajustesHtml(s: SessionState, prefs: UiPrefs, x: UiExtras) {
    const q = (['auto', 'alta', 'media', 'baixa'] as const)
      .map((k) => `<button type="button" class="chip" role="radio" data-cmd="quality" data-arg="${k}" aria-checked="${prefs.quality === k}">${k === 'auto' ? `Automática (${QUALITY_LABEL[prefs.detected]})` : QUALITY_LABEL[k]}</button>`)
      .join('');
    const lp = LIGHT_PRESETS.map((k) => `<button type="button" class="chip" role="radio" data-cmd="preset" data-arg="${k}" aria-checked="${s.lightPreset === k}">${esc(LIGHT_PRESET_LABEL[k])}</button>`).join('');
    return `<h3 class="h3">Luz da sala</h3><div class="chips wrap" role="radiogroup" aria-label="Luz da sala">${lp}</div>
      <p class="small muted">O que muda nas superfícies quando a luz da sala muda?</p>
      <h3 class="h3">Som</h3>
      <div class="row">${btn('sound', prefs.sound ? 'Desligar som' : 'Ligar som', { ico: prefs.sound ? 'sound' : 'mute', pressed: prefs.sound })}</div>
      <label class="range"><span>Volume</span><input type="range" min="0" max="1" step="0.05" value="${prefs.volume}" data-input="volume" aria-label="Volume" /></label>
      <h3 class="h3">Movimento</h3>
      <div class="row">${btn('reduced', prefs.reduced ? 'Movimento reduzido: ligado' : 'Movimento reduzido: desligado', { ico: 'eye', pressed: prefs.reduced })}</div>
      <h3 class="h3">Qualidade gráfica</h3><div class="chips wrap" role="radiogroup" aria-label="Qualidade gráfica">${q}</div>
      <p class="small muted">${x.webgl ? 'Trocar a qualidade recarrega a cena e mantém esta sessão.' : 'Cena 3D indisponível: modo descritivo ativo.'}</p>
      <h3 class="h3">Atalhos</h3>
      <p class="small">Setas giram a amostra (ou a luz, com a ferramenta Luz). Enter continua. Esc fecha painéis ou pausa. H recolhe os controles. L abre a lupa.</p>`;
  }

  private bottomHtml(s: SessionState, x: UiExtras) {
    const tools = `${btn('tool', 'Mão', { arg: 'mao', ico: 'hand', cls: 'imv-btn', pressed: s.tool === 'mao', title: 'Arrastar gira a amostra' })}
      ${btn('tool', 'Luz', { arg: 'luz', ico: 'bulb', cls: 'imv-btn', pressed: s.tool === 'luz', title: 'Arrastar move a luminária' })}
      ${btn('lens', 'Lupa', { ico: 'lens', cls: 'imv-btn', pressed: s.magnifierOn, title: 'Lupa (L)' })}
      ${s.magnifierOn ? btn('zoom', 'Menos zoom', { arg: '-0.5', ico: 'minus', cls: 'imv-btn imv-icon', iconOnly: true }) + btn('zoom', 'Mais zoom', { arg: '0.5', ico: 'plus', cls: 'imv-btn imv-icon', iconOnly: true }) : ''}`;
    const views = (
      [
        ['bancada', 'Bancada', 'camera'],
        ['geral', 'Geral', 'overview'],
        ['perto', 'Perto', 'near'],
        ['rente', 'Rente', 'low'],
        ['luz', 'Da luz', 'sun'],
      ] as const
    )
      .map(([v, l, i]) => btn('view', l, { arg: v, ico: i, cls: 'imv-btn', pressed: x.view === v, title: v === 'luz' ? 'Ver do lugar da luminária' : `Ponto de vista: ${l}` }))
      .join('');
    const back = x.view === 'luz' ? btn('view', 'Voltar', { arg: 'bancada', ico: 'prev', cls: 'imv-btn is-active' }) : '';
    const lamp = btn('lamp-toggle', s.lampOn ? 'Apagar luminária' : 'Acender luminária', { ico: 'bulb', cls: 'imv-btn', pressed: s.lampOn });
    return `${back}${tools}<span class="imv-sep"></span>${lamp}<span class="imv-sep"></span>${views}`;
  }

  /* ---------------------------------------------------------------- */
  /* Sobreposições: entrada, pausa, resumo                             */
  /* ---------------------------------------------------------------- */

  private renderOverlay(s: SessionState, x: UiExtras) {
    let html = '';
    let key = '';
    if (s.phase === 'entrada') {
      key = `entrada:${this.draftMode}:${this.companionDraft.join(',')}:${x.savedLocal}`;
      html = this.entradaHtml(x.savedLocal);
    } else if (s.phase === 'resumo') {
      key = `resumo:${s.collection.length}:${x.savedLocal}`;
      html = this.resumoHtml(s, x);
    } else if (s.paused) {
      key = 'pausa';
      html = `<div class="card" role="dialog" aria-modal="true" aria-labelledby="t-pausa"><h2 id="t-pausa" class="serif">Pausa</h2>
        <p>Tudo fica como está. Quando quiser, retome de onde parou.</p>
        <div class="row">${btn('resume', 'Retomar', { ico: 'play', cls: 'b-cta' })}${btn('restart', 'Recomeçar', { ico: 'reset' })}${btn('finish', 'Ver resumo', { ico: 'list', cls: 'b-ghost' })}</div></div>`;
    }
    this.overlay.hidden = !html;
    document.documentElement.classList.toggle('has-overlay', !!html);
    if (key !== this.lastOverlayKey) {
      this.lastOverlayKey = key;
      this.overlay.innerHTML = html;
      if (window.parent === window || navigator.userActivation.hasBeenActive) {
        this.overlay.querySelector<HTMLElement>('.b-cta, button')?.focus({ preventScroll: true });
      }
    }
  }

  setDraftMode(m: (typeof MODES)[number]) {
    this.draftMode = m;
  }
  get draft() {
    return { mode: this.draftMode, companion: [...this.companionDraft] };
  }
  toggleCompanion(id: SampleId) {
    const i = this.companionDraft.indexOf(id);
    if (i >= 0) this.companionDraft.splice(i, 1);
    else if (this.companionDraft.length < LIMITS.companionMax) this.companionDraft.push(id);
  }

  private entradaHtml(saved: boolean) {
    const modes = MODES.map(
      (m) => `<button type="button" class="mode" role="radio" data-cmd="mode" data-arg="${m}" aria-checked="${this.draftMode === m}"><b>${MODE_INFO[m].name}</b><span>${esc(MODE_INFO[m].text)}</span></button>`,
    ).join('');
    const comp =
      this.draftMode === 'acompanhado'
        ? `<fieldset class="comp"><legend>Amostras desta sessão (${this.companionDraft.length} de 2 a 4)</legend><div class="grid">${SAMPLE_IDS.map(
            (c) => `<button type="button" class="card-s" data-cmd="companion" data-arg="${c}" aria-pressed="${this.companionDraft.includes(c)}">${this.thumb(c)}<span class="nm">${esc(SAMPLES[c].name)}</span></button>`,
          ).join('')}</div></fieldset>`
        : '';
    const ok = this.draftMode !== 'acompanhado' || (this.companionDraft.length >= 2 && this.companionDraft.length <= 4);
    return `<div class="card intro" role="dialog" aria-modal="true" aria-labelledby="t-intro">
      <p class="kicker">Ateliê de observação</p>
      <h1 id="t-intro" class="serif">Atlas das Texturas</h1>
      <p class="lead">Observe superfícies sob luzes diferentes e anote, se quiser, o que você percebe.</p>
      <div class="modes" role="radiogroup" aria-label="Modo">${modes}</div>${comp}
      <div class="row">${btn('start', 'Começar', { ico: 'next', cls: 'b-cta big', disabled: !ok })}${btn('demo', 'Ver demonstração', { ico: 'eye' })}${saved ? btn('restore-local', 'Retomar sessão salva', { ico: 'save', cls: 'b-ghost' }) : ''}</div>
      <p class="small muted">${esc(NOT_TOUCH)} Sem cadastro: nada sai deste aparelho.</p></div>`;
  }

  private resumoHtml(s: SessionState, x: UiExtras) {
    const entries = [...s.collection].sort((a, b) => a.order - b.order);
    return `<div class="card wide" role="dialog" aria-modal="true" aria-labelledby="t-res">
      <h2 id="t-res" class="serif">Revisão da sessão</h2>
      <p class="small">${fmtTime(x.activeMs)} de tempo ativo · ${s.visited.length} etapas · ${s.counters.lampMoves} ajustes de luz · ${s.counters.magnifierUses} usos da lupa · ${s.counters.pauses} pausas</p>
      ${entries.length ? `<ol class="atlas cols">${entries.map((e) => `<li class="entry">${this.thumb(e.sampleId)}<div><b>${esc(SAMPLES[e.sampleId].name)}</b><p class="small">${e.descriptors.length ? e.descriptors.map((d) => DESCRIPTOR_LABEL[d]).join(', ') : 'sem descritor'} · ${e.preference ? PREFERENCE_LABEL[e.preference] : 'preferência omitida'}</p></div></li>`).join('')}</ol>` : '<p class="muted">Nenhuma amostra foi guardada nesta sessão.</p>'}
      <ul class="qs">${OPEN_QUESTIONS.slice(0, 3).map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
      <p class="disclaimer">${esc(DISCLAIMER)}</p>
      <div class="row wrap">${btn('export', 'Exportar JSON', { ico: 'download' })}${btn('save-local', x.savedLocal ? 'Atualizar no aparelho' : 'Salvar neste aparelho', { ico: 'save' })}${btn('new', 'Nova sessão', { ico: 'reset', cls: 'b-cta' })}${btn('exit', 'Sair', { ico: 'back', cls: 'b-ghost' })}</div></div>`;
  }

  confirm(text: string, okLabel: string): Promise<boolean> {
    return new Promise((resolve) => {
      const d = document.createElement('div');
      d.className = 'ov confirm';
      d.innerHTML = `<div class="card" role="alertdialog" aria-modal="true" aria-labelledby="t-cf"><p id="t-cf">${esc(text)}</p><div class="row"><button type="button" class="b-sec" data-c="0">Cancelar</button><button type="button" class="b-cta" data-c="1">${esc(okLabel)}</button></div></div>`;
      document.body.appendChild(d);
      const prev = document.activeElement as HTMLElement | null;
      (d.querySelector('[data-c="0"]') as HTMLElement).focus();
      const done = (v: boolean) => {
        d.remove();
        window.removeEventListener('keydown', key, true);
        prev?.focus?.({ preventScroll: true });
        resolve(v);
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          e.preventDefault();
          done(false);
        }
      };
      window.addEventListener('keydown', key, true);
      d.addEventListener('click', (e) => {
        const b = (e.target as HTMLElement).closest('[data-c]') as HTMLElement | null;
        if (b) {
          e.stopPropagation();
          done(b.dataset.c === '1');
        }
      });
    });
  }
}
