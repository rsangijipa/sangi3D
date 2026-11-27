import { modes, regions, sensations, stages, type Sensation, type Mode } from '../game/content';
import type { Entry } from '../game/rules';
import type { State } from '../game/state';
import { icon } from './icons';

export const escapeHtml = (text: string) => text.replace(/[&<>"']/g,x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]!));
const button = (action: string, label: string, css = '', data = '', disabled = false) =>
  `<button type="button" class="${css}" data-action="${action}" ${data} ${disabled?'disabled':''}>${label}</button>`;
const check = (action: string, label: string, data: string, selected: boolean) =>
  button(action, `${selected ? icon('check') : ''}${label}`, 'chip', `${data} aria-pressed="${selected}"`);
export const order = Object.keys(sensations) as Sensation[];
export function orbitButtons() {
  return order.map((id,i) => {
    const angle = i * Math.PI / 4;
    return `<button type="button" class="token paper" data-action="sensation" data-id="${id}" style="--dx:${Math.sin(angle)};--dy:${-Math.cos(angle)}" aria-label="${sensations[id][0]}" title="${sensations[id][0]}" aria-pressed="false" disabled>${icon(sensations[id][1])}</button>`;
  }).join('');
}
export interface ViewOptions {
  ownWord: boolean;
  showChoices: boolean;
  saved: boolean;
  point?: number;
  activeSeconds: number;
}
export function describe(entry: Entry) {
  const place = entry.regionIds.map(id => regions[id]).join(', ') || 'Sem região';
  const words = [...entry.sensationIds.map(id => sensations[id][0]), ...(entry.customWord ? [entry.customWord] : [])];
  const scale = entry.intensity === 'unknown' ? 'Intensidade indefinida' :
    entry.intensity === null ? 'Sem intensidade' : `Intensidade ${entry.intensity} de 4`;
  return { place, words: words.join(' · ') || 'Sem palavras ou símbolos', scale };
}
const titles = {
  entry:'Como você quer começar?', region:'Onde você percebe?', sensation:'Que sensação?',
  intensity:'Com que intensidade?', review:'Seu mapa do corpo', done:'Mapa encerrado',
};

export function panel(s: State, options: ViewOptions) {
  const phase = s.phase;
  const stage = phase === 'done' ? 5 : ['entry','region','sensation','intensity','review'].indexOf(phase)+1;
  const regionNames = s.draft.regionIds.map(id => regions[id]).join(' · ');
  let body = '', actions = '';
  switch (phase) {
    case 'entry':
      body = `<p>Um mapa para localizar sensações e dar nomes a elas, no seu ritmo.</p>
        <fieldset><legend>Modo da sessão</legend><div class="chips">${(Object.keys(modes) as Mode[]).map(id=>check('mode',modes[id],`data-id="${id}"`,s.mode===id)).join('')}</div></fieldset>
        <small>${s.mode === 'guided' ? 'Convites curtos acompanham cada etapa.' : s.mode === 'accompanied' ? 'Ofereça palavras se a pessoa pedir. Ela pode escolher, pular ou sair a qualquer momento.' : 'Explore o mapa com liberdade.'}</small>`;
      actions = `${button('start','Observar meu corpo','primary','data-id="own"')}${button('start','Usar mapa fictício','secondary','data-id="fiction"')}
        <div class="links">${button('demo','Ver exemplo','plain')}${button('skip','Pular','plain')}</div>
        ${options.saved ? button('restore','Abrir registro deste dispositivo','secondary') : ''}`;
      break;
    case 'region':
      body = `<p>${s.fictionalMode ? 'Escolha uma ou mais regiões da figura fictícia.' : 'Se quiser, toque em uma ou mais regiões da figura.'}</p>
        <small>Os lados são os da figura. De frente, a esquerda dela aparece à sua direita.</small>
        <div class="region-chosen" data-region-display>${regionNames || 'Selecione na figura ou na lista.'}</div>
        <div class="chips region-controls">${button('flip',icon('rotate') + (s.bodyView === 'front' ? 'Ver costas':'Ver frente'),'chip')}${button('choices',icon('list')+'Lista de regiões','chip',`aria-expanded="${options.showChoices}"`)}</div>
        <div class="chips choice-list" ${options.showChoices ? '' : 'hidden'}>${Object.entries(regions).filter(([id])=>id!=='unknown').map(([id,label])=>check('region',label,`data-id="${id}"`,s.draft.regionIds.includes(id as keyof typeof regions))).join('')}</div>
        ${check('region', regions.unknown, 'data-id="unknown"', s.draft.regionIds.includes('unknown'))}`;
      actions = `${button('next','Continuar','primary')}${button('skip','Pular','secondary')}`;
      break;
    case 'sensation':
      body = `<p>${s.mode === 'guided' ? 'Explore os símbolos. Uma mesma sensação pode ter mais de um nome.' : 'Escolha um ou mais símbolos, se quiser.'}</p>
        <div class="sensation-tools"><div class="selected-sensations" data-sensation-display>${s.draft.sensationIds.map(id=>sensations[id][0]).join(' · ') || 'Símbolos opcionais'}</div>
        ${button('choices',icon('list')+'Lista de símbolos','plain',`aria-expanded="${options.showChoices}"`)}</div>
        <div class="word">${button('wordToggle',`<span class="checkbox">${options.ownWord ? icon('check') : ''}</span>Usar minha palavra`,'secondary',`aria-expanded="${options.ownWord}"`)}
        ${options.ownWord ? `<label for="word">Minha palavra</label><input id="word" maxlength="80" type="text" autocomplete="off" spellcheck="false" value="${escapeHtml(s.draft.customWord)}">` : ''}</div>
        <div class="chips choice-list" ${options.showChoices ? '' : 'hidden'}>${order.map(id=>check('sensation',icon(sensations[id][1])+sensations[id][0],`data-id="${id}"`,s.draft.sensationIds.includes(id))).join('')}</div>`;
      actions = `${button('next','Registrar','primary')}${button('skip','Pular','secondary')}`;
      break;
    case 'intensity':
      body = `<p>Marque de 0 (nenhuma) a 4 (intensa), se fizer sentido para você.</p>
        <fieldset><legend>Intensidade opcional</legend><div class="scale">${[0,1,2,3,4].map(n=>check('intensity',String(n),`data-id="${n}"`,s.draft.intensity===n)).join('')}</div></fieldset>
        ${check('intensity','Não sei','data-id="unknown"',s.draft.intensity==='unknown')}
        <div class="links additional">${button('another','Adicionar outro ponto','plain')}${button('discardPoint','Remover ponto','plain')}</div>`;
      actions = `${button('next','Rever mapa','primary')}${button('skip','Pular','secondary')}`;
      break;
    case 'review':
      body = `<p>Apenas descrição. O significado é de quem cria.</p>
        <small>${s.fictionalMode ? 'Mapa fictício' : 'Observação do corpo'} · ${s.entries.length} ${s.entries.length===1?'ponto':'pontos'}</small>
        ${s.entries.length ? `<ol class="entries">${s.entries.map((entry,i) => {
          const item = describe(entry);
          return `<li><strong>${item.place}</strong><span>${escapeHtml(item.words)}</span><small>${item.scale}</small>
            <div class="links">${button('edit','Editar','plain',`data-id="${i}" aria-label="Editar ponto ${i+1}"`)}${button('remove','Remover','plain',`data-id="${i}" aria-label="Remover ponto ${i+1}"`)}</div></li>`;
        }).join('')}</ol>` : '<p>Você pode encerrar com o mapa vazio ou adicionar um ponto.</p>'}
        <div class="links additional">${button('another','Adicionar ponto','plain')}${button('clear','Apagar mapa','plain','',!s.entries.length&&!options.saved)}</div>
        <small>Ao salvar, o mapa fica disponível para quem usar este navegador.</small>`;
      actions = `${button('save','Registrar neste dispositivo','primary','',!s.entries.length)}
        ${button('finish','Concluir sem salvar','secondary')}`;
      break;
    case 'done':
      body = s.exited ? '<p>A sessão foi encerrada. O rascunho foi apagado.</p>' :
        `<p>${s.saveConsent ? 'O mapa foi registrado neste dispositivo.' : 'A sessão terminou sem salvar o mapa neste dispositivo.'}</p>
        <small>${s.entries.length} ${s.entries.length === 1 ? 'ponto' : 'pontos'} · ${Math.floor(options.activeSeconds/60)} min ${options.activeSeconds%60} s de atividade</small>`;
      actions = `${button('reset','Começar de novo','primary')}
        ${!s.exited && s.entries.length ? button('export','Exportar registro','secondary') : ''}
        ${options.saved ? button('savedClear','Apagar registro deste dispositivo','plain') : ''}`;
      break;
  }
  return `<div class="panel-handle" aria-hidden="true"></div>
    <div class="panel-scroll"><h1 id="stage-title" tabindex="-1">${titles[phase]}</h1>${body}<div class="step-actions">${actions}</div></div>
    <footer>${phase !== 'done' && phase !== 'entry' ? button('back', icon('arrow')+'Voltar','plain') : '<span></span>'}
      <div class="progress" role="img" aria-label="Etapa ${stage} de 5 · ${stages[stage-1]}">${stages.map((_,i)=>`<i class="${i < stage?'done':''}" ${i===stage-1?'data-current':''}></i>`).join('')}</div>
      ${phase !== 'done' ? button(s.editing===null?'exit':'cancelEdit',s.editing===null?'Sair':'Cancelar','plain') : '<span></span>'}</footer>`;
}
