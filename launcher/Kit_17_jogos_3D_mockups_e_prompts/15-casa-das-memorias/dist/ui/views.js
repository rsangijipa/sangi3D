import {rooms,roomKeys,kinds,marks,symbols,stages,words,         } from '../game/content.js';
import {visibleReview,                     } from '../game/state.js';
const eye='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>';
const drawer='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h16l2 7-2 7H4l-2-7zm-2 7h6l2 3h4l2-3h6"/></svg>';
export const esc=(s       )=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ));
const b=(a       ,value              ,text       ,cls='',attrs='')=>'<button data-action="'+a+'" value="'+value+'" data-key="'+a+'-'+value+'" class="'+cls+'" '+attrs+'>'+text+'</button>';
const nav=(stage       ,label       ,primary=false)=>b('stage',stage,label,primary?'primary':'');
function roomsUI(s      ){return '<div class="room-grid">'+roomKeys.map(room=>b('room',room,rooms[room].name,'','aria-pressed="'+(s.room===room&&s.focused)+'"')).join('')+'</div>';}
function drawing(entry      ){
 if(!entry.drawing.length)return '';
 return '<svg class="mini-drawing" role="img" aria-label="Desenho escolhido para este símbolo" viewBox="0 0 280 108">'+entry.drawing.map(line=>'<polyline points="'+line.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>').join('')+'</svg>';
}
function manage(s      ){
 const entry=(t      )=>{
  const revealed=t.visibility==='visible'||(t.room==='studio'?s.drawer:s.caseOpen);
  const label=revealed?symbols[t.type]+(t.label?' · '+esc(t.label):''):'Símbolo guardado';
  return '<li><strong>'+label+'</strong><small>'+rooms[t.room].name+' · '+(t.visibility==='visible'?'À vista':'Guardado')+'</small><div class="manage"><label><span class="sr">Mover símbolo</span><select data-action="move" data-id="'+t.id+'"><option value="">Mover para…</option>'+roomKeys.map(room=>'<option value="'+room+'|visible">'+rooms[room].name+' · à vista</option>').join('')+'<option value="studio|stored">Gaveta</option><option value="storage|stored">Mala</option></select></label>'+b('delete',t.id,'Retirar','','aria-label="Remover símbolo da sessão"')+'</div></li>';
 };
 return '<div class="row">'+b('drawer','toggle',s.drawer?'Fechar gaveta':'Abrir gaveta')+b('case','toggle',s.caseOpen?'Fechar mala':'Abrir mala')+'</div>'+(s.tokens.length?'<ul class="entries">'+s.tokens.map(entry).join('')+'</ul>':'<p>A casa ainda está livre de símbolos.</p>')+'<div class="row">'+nav(1,'Novo símbolo')+nav(5,'Ir para revisão',true)+'</div>';
}
export function panel(s      ,notice       ){
 let body='';
 const title=s.finished?'Visita concluída':stages[s.stage];
 const guide=['','Use a vista da casa para escolher um cômodo.','Uma cor ou forma já pode representar o que você imaginou.','Escolha onde o símbolo vai ficar durante a visita.','Você pode trocar um símbolo de lugar quantas vezes quiser.','Selecione os objetos que quer incluir no resumo.'];
 if(s.finished){body='<p>Você pode revisar seus símbolos ou sair e descartar a sessão.</p><div class="row">'+nav(5,'Voltar à revisão')+b('exit','ask','Sair da casa','primary')+'</div>';}
 else switch(s.stage){
 case 0:body='<p>Escolha símbolos para uma casa de bonecas e decida quais deixar à vista.</p>'+b('open','start','Entrar na casa','primary wide')+b('open','demo','Ver demonstração','wide');break;
 case 1:body=(s.story?'<p class="note">Imagine alguém preparando a casa para uma visita. Que objeto poderia deixar como lembrança?</p>':'')+'<p>Escolha um cômodo e um símbolo.</p>'+roomsUI(s)+'<div class="symbols">'+kinds.map(k=>b('symbol',k,'<span aria-hidden="true">'+marks[k]+'</span>'+symbols[k])).join('')+'</div>';break;
 case 2:body=s.draft?'<p>'+symbols[s.draft.type]+' · os detalhes são opcionais.</p><label>Nome ou palavra<input id="label" maxlength="55" value="'+esc(s.draft.label)+'" autocomplete="off" placeholder="Opcional"></label><div class="words">'+words.map(w=>b('word',w,w)).join('')+'</div><details '+(s.draft.drawing.length?'open':'')+'><summary>Desenhar no símbolo</summary><canvas width="280" height="108" id="drawing" aria-label="Área de desenho opcional"></canvas>'+b('clear','draw','Limpar desenho')+'</details>'+nav(3,'Continuar',true):'<p>Escolha um símbolo para acrescentar detalhes.</p>'+nav(1,'Escolher símbolo',true);break;
 case 3:body=s.draft?'<p>'+symbols[s.draft.type]+' · '+rooms[s.room].name+'</p>'+b('place','visible',eye+' Deixar à vista','primary wide')+b('place','stored',drawer+(s.room==='storage'?' Guardar na mala':' Guardar na gaveta'),'wide')+'<p class="quiet">O móvel guarda o símbolo durante a visita. A sessão fica em memória.</p>': '<p>Você pode seguir sem criar um símbolo.</p>'+nav(1,'Escolher um símbolo');break;
 case 4:body=manage(s);break;
 case 5:body='<p>Escolha o que mostrar no resumo desta visita.</p>'+(s.tokens.length?'<div class="show-list">'+s.tokens.map((t,i)=>'<label><input type="checkbox" data-action="show" value="'+t.id+'" '+(s.show.includes(t.id)?'checked':'')+'> '+(t.visibility==='visible'?symbols[t.type]:'Símbolo guardado '+(i+1))+'</label>').join('')+'</div>':'<p>Nenhum símbolo na sessão.</p>')+(visibleReview(s).length?'<ul class="entries review">'+visibleReview(s).map(t=>'<li><strong>'+symbols[t.type]+'</strong>'+(t.label?'<p>'+esc(t.label)+'</p>':'')+drawing(t)+'</li>').join('')+'</ul>':'')+'<div class="row">'+b('finish','now','Concluir visita','primary')+b('export','ask','Exportar seleção','',visibleReview(s).length?'':'disabled')+'</div>';break;
 }
 return '<div class="handle"></div><div class="progress"><span>Etapa '+(s.stage+1)+' de 6</span><span aria-hidden="true">'+stages.map((_,i)=>'<i class="'+(i===s.stage?'current':'')+'"></i>').join('')+'</span></div><h2 tabindex="-1">'+title+'</h2>'+body+(s.mode==='guiado'&&s.stage>0&&!s.finished?'<p class="note">'+guide[s.stage]+'</p>':'')+(notice?'<p class="notice">'+esc(notice)+'</p>':'')+'<footer>'+(s.stage>0&&!s.finished?nav(s.stage-1,'Voltar'):'')+(s.stage>0&&s.stage<5?b('skip','next','Pular'):'')+(s.stage>0?b('pause','open','Pausar'):'')+b('mute','toggle',s.muted?'Som desligado':'Som ligado')+b('motion','toggle',s.reduced?'Movimento reduzido':'Movimento normal')+(s.stage>0?b('reset','ask','Reiniciar'):'')+'</footer>';
}
export function setup(){
 return '<p class="kicker">CASA DE BONECAS</p><h2>Como quer visitar?</h2><p>Escolha qualquer rota. Você pode passar por um cômodo sem criar um símbolo.</p><label>Modo<select id="mode"><option value="livre">Livre</option><option value="guiado">Guiado</option><option value="acompanhado">Acompanhado</option></select></label><label id="companion" hidden>Cômodo inicial<select id="first-room">'+roomKeys.map(room=>'<option value="'+room+'">'+rooms[room].name+'</option>').join('')+'</select></label><div class="row"><button class="primary" value="visit">Visitar a casa</button><button value="story">Usar uma história fictícia</button><button value="close">Voltar</button></div>';
}
