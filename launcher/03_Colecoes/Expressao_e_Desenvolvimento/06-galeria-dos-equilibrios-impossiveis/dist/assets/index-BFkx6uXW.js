(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();const re="modulepreload",le=function(e,t){return new URL(e,t).href},U={},ce=function(t,o,a){let s=Promise.resolve();if(o&&o.length>0){let r=function(u){return Promise.all(u.map(b=>Promise.resolve(b).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};const l=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),f=c?.nonce||c?.getAttribute("nonce");s=r(o.map(u=>{if(u=le(u,a),u in U)return;U[u]=!0;const b=u.endsWith(".css"),h=b?'[rel="stylesheet"]':"";if(a)for(let A=l.length-1;A>=0;A--){const C=l[A];if(C.href===u&&(!b||C.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const g=document.createElement("link");if(g.rel=b?"stylesheet":re,b||(g.as="script"),g.crossOrigin="",g.href=u,f&&g.setAttribute("nonce",f),document.head.appendChild(g),b)return new Promise((A,C)=>{g.addEventListener("load",A),g.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return s.then(l=>{for(const c of l||[])c.status==="rejected"&&i(c.reason);return t().catch(i)})};class de{ctx=null;enabled=!1;initCtx(){if(!this.ctx&&typeof window<"u"){const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx=new t)}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}async toggle(){return this.enabled=!this.enabled,this.enabled&&(this.initCtx(),this.play("click")),this.enabled}isEnabled(){return this.enabled}play(t){if(!this.enabled)return;const o=this.initCtx();if(!o)return;const a=o.currentTime,s=o.createOscillator(),i=o.createGain();switch(s.connect(i),i.connect(o.destination),t){case"hang":{s.type="sine",s.frequency.setValueAtTime(880,a),s.frequency.exponentialRampToValueAtTime(440,a+.15),i.gain.setValueAtTime(.2,a),i.gain.exponentialRampToValueAtTime(.001,a+.25),s.start(a),s.stop(a+.25);break}case"unhang":{s.type="triangle",s.frequency.setValueAtTime(520,a),s.frequency.exponentialRampToValueAtTime(320,a+.12),i.gain.setValueAtTime(.15,a),i.gain.exponentialRampToValueAtTime(.001,a+.15),s.start(a),s.stop(a+.15);break}case"slide":{s.type="sawtooth",s.frequency.setValueAtTime(240,a),s.frequency.linearRampToValueAtTime(360,a+.08),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.09),s.start(a),s.stop(a+.09);break}case"equilibrium":{[523.25,659.25,783.99,1046.5].forEach((c,f)=>{const r=o.createOscillator(),u=o.createGain();r.type="sine",r.frequency.setValueAtTime(c,a),u.gain.setValueAtTime(.08/(f+1),a),u.gain.exponentialRampToValueAtTime(1e-4,a+1.2),r.connect(u),u.connect(o.destination),r.start(a),r.stop(a+1.2)});break}case"creak":{s.type="sine",s.frequency.setValueAtTime(140,a),s.frequency.exponentialRampToValueAtTime(110,a+.3),i.gain.setValueAtTime(.06,a),i.gain.exponentialRampToValueAtTime(.001,a+.35),s.start(a),s.stop(a+.35);break}default:{s.type="triangle",s.frequency.setValueAtTime(440,a),i.gain.setValueAtTime(.05,a),i.gain.exponentialRampToValueAtTime(.001,a+.05),s.start(a),s.stop(a+.05);break}}}}const k={terracotta:{type:"terracotta",name:"Vaso de terracota",mass:5,description:"Cerâmica artesanal com relevos ondulados horizontais e alça de latão.",color:"#A44D40"},fluted:{type:"fluted",name:"Esfera canelada verde",mass:2,description:"Cerâmica esmaltada verde-oliva com estrias verticais e argola superior.",color:"#596F69"},glass:{type:"glass",name:"Esfera de vidro",mass:3,description:"Vidro translúcido maciço com refração e suspensão pontual.",color:"#DCE4E3"},ring:{type:"ring",name:"Anel de pedra",mass:1.5,description:"Toróide em travertino claro pontilhado com engate em latão.",color:"#DBCDB5"},crackle:{type:"crackle",name:"Cúpula craquelada",mass:2.5,description:"Cúpula em cerâmica celadon com craqueluras sutis e borda terracota.",color:"#7D958B"},cylinder:{type:"cylinder",name:"Peso de latão",mass:4,description:"Cilindro maciço em latão acetinado com olhal usinado.",color:"#9D814A"}},G={brass:{type:"brass",name:"Braço secundário de latão",mass:1.2,halfSpan:15,description:"Barra perfurada proporcional em latão para níveis encadeados de móbile."},wood:{type:"wood",name:"Braço secundário de madeira",mass:.8,halfSpan:16,description:"Barra esculpida em carvalho claro com ganchos de latão polido."}},z={free:{title:"Escultura livre",subtitle:"Composição aberta",description:"Explore o móbile cinético, adicione pesos e sub-barras sem restrições ou pontuação."},challenge:{title:"Desafio de equilíbrio",subtitle:"Busca pela linha horizontal",description:"Posicione as massas ou desloque o fulcro para alcançar o ângulo de 0,0°."},asymmetry:{title:"Assimetria intencional",subtitle:"Tensão poética e peso visual",description:"Crie composições desbalanceadas estáveis que expressem contrastes materiais."},partner:{title:"Composição em parceria",subtitle:"Alternância de turnos",description:"Duas pessoas interagem em turnos alternados, equilibrando ou transformando a escultura."}},T={mockup:{label:"Galeria Original (Mockup)",description:"Composição clássica da galeria com vaso de terracota, esferas e níveis encadeados.",setup:e=>{e.sceneState.fulcrumPosition=0,e.sceneState.subBeams=[{id:"sub-brass",type:"brass",slot:-10,angle:-3.5},{id:"sub-wood",type:"wood",slot:20,angle:2.1}],e.sceneState.weights=[{id:"w1",type:"terracotta",slot:-35},{id:"w2",type:"glass",slot:-20},{id:"w3",type:"fluted",slot:-10,subBeamId:"sub-brass",subSlot:"left"},{id:"w4",type:"cylinder",slot:-10,subBeamId:"sub-brass",subSlot:"right"},{id:"w5",type:"ring",slot:20,subBeamId:"sub-wood",subSlot:"left"},{id:"w6",type:"crackle",slot:20,subBeamId:"sub-wood",subSlot:"right"},{id:"w7",type:"cylinder",slot:35}]}},symmetric:{label:"Equilíbrio Puro (0,0°)",description:"Massas simétricas a distâncias iguais resultando em linha de nível perfeita.",setup:e=>{e.sceneState.fulcrumPosition=0,e.sceneState.subBeams=[],e.sceneState.weights=[{id:"w1",type:"cylinder",slot:-30},{id:"w2",type:"fluted",slot:-15},{id:"w3",type:"fluted",slot:15},{id:"w4",type:"cylinder",slot:30}]}},calder:{label:"Cascata de Calder",description:"Três níveis sobrepostos encadeados com anéis e esferas em balanço sutil.",setup:e=>{e.sceneState.fulcrumPosition=-5,e.sceneState.subBeams=[{id:"sub-brass",type:"brass",slot:-25,angle:0},{id:"sub-wood",type:"wood",slot:25,angle:0}],e.sceneState.weights=[{id:"w1",type:"ring",slot:-25,subBeamId:"sub-brass",subSlot:"left"},{id:"w2",type:"crackle",slot:-25,subBeamId:"sub-brass",subSlot:"right"},{id:"w3",type:"fluted",slot:25,subBeamId:"sub-wood",subSlot:"left"},{id:"w4",type:"glass",slot:25,subBeamId:"sub-wood",subSlot:"right"}]}}},_=2,ue=[-40,-35,-30,-25,-20,-15,-10,-5,5,10,15,20,25,30,35,40];function p(e,t=.8){const a=e.fulcrumPosition/100;let s=_*9.81*(0-a),i=_;for(const b of e.weights)if(!b.subBeamId){const h=k[b.type].mass,g=b.slot/100;s+=h*9.81*(g-a),i+=h}for(const b of e.subBeams){const h=G[b.type];let g=h.mass,A=0;const C=e.weights.filter(R=>R.subBeamId===b.id);for(const R of C){const W=k[R.type].mass;g+=W;const ne=(R.subSlot==="left"?-h.halfSpan:h.halfSpan)/100;A+=W*9.81*ne}const oe=Math.max(-25,Math.min(25,A/(g*9.81*.08+.1)*(180/Math.PI)));b.angle=Number(oe.toFixed(1));const ie=b.slot/100;s+=g*9.81*(ie-a),i+=g}const l=Number((i*9.81*.1).toFixed(1)),c=i*9.81*.06+.8,f=s/c*(180/Math.PI),r=Number(Math.max(-35,Math.min(35,f)).toFixed(1)),u=Math.abs(r)<=t;return{totalMass:Number(i.toFixed(2)),dynamometerTension:l,netTorque:Number(s.toFixed(2)),targetAngle:r,isEquilibrated:u}}function ke(e,t,o=!1){const a=p(e);if(e.targetAngle=a.targetAngle,o){e.mainAngle=e.targetAngle,e.angularVelocity=0;return}const s=3.5,i=.45,l=e.mainAngle-e.targetAngle,c=-2*i*s*e.angularVelocity-s*s*(l*(Math.PI/180));e.angularVelocity+=c*t,e.mainAngle+=e.angularVelocity*(180/Math.PI)*t,e.mainAngle>35?(e.mainAngle=35,e.angularVelocity=Math.min(0,e.angularVelocity)):e.mainAngle<-35&&(e.mainAngle=-35,e.angularVelocity=Math.max(0,e.angularVelocity)),Math.abs(e.mainAngle-e.targetAngle)<.02&&Math.abs(e.angularVelocity)<.01&&(e.mainAngle=e.targetAngle,e.angularVelocity=0)}function pe(e,t){switch((t.type==="move-fulcrum"||t.type==="add-weight"||t.type==="remove-weight"||t.type==="move-weight"||t.type==="add-subbeam"||t.type==="remove-subbeam"||t.type==="reset")&&(e.history.push(JSON.parse(JSON.stringify(e.sceneState))),e.history.length>30&&e.history.shift(),e.future=[]),t.type){case"start":{e.phase="work",t.mode&&(e.mode=t.mode);const a=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=a.targetAngle,e.sceneState.mainAngle=a.targetAngle,`Modo ${e.mode} iniciado. Inclinação: ${a.targetAngle}°`}case"pause":return e.phase="paused","Galeria em pausa.";case"resume":return e.phase="work","Interação retomada.";case"review":return e.phase="review","Revisão da escultura.";case"exit":return e.phase="entry","Retorno à entrada da galeria.";case"undo":return e.history.length?(e.future.push(JSON.parse(JSON.stringify(e.sceneState))),e.sceneState=e.history.pop(),`Ação desfeita. Inclinação: ${p(e.sceneState,e.settings.tolerance).targetAngle}°`):"Nada a desfazer.";case"redo":return e.future.length?(e.history.push(JSON.parse(JSON.stringify(e.sceneState))),e.sceneState=e.future.pop(),`Ação refeita. Inclinação: ${p(e.sceneState,e.settings.tolerance).targetAngle}°`):"Nada a refazer.";case"reset":{e.sceneState.fulcrumPosition=0,e.sceneState.weights=[],e.sceneState.subBeams=[];const a=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=a.targetAngle,e.sceneState.mainAngle=a.targetAngle,"Móbile reiniciado."}case"move-fulcrum":{const a=Math.max(-30,Math.min(30,Math.round(t.position/5)*5));e.sceneState.fulcrumPosition=a;const s=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=s.targetAngle,`Fulcro ajustado em ${a>0?"+":""}${a} cm. Inclinação: ${s.targetAngle}°`}case"add-weight":{const a={id:"w_"+Math.random().toString(36).slice(2,8),type:t.weightType,slot:t.slot,subBeamId:t.subBeamId,subSlot:t.subSlot};e.sceneState.weights.push(a);const s=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=s.targetAngle,`${k[t.weightType].name} adicionado em ${t.slot} cm. Inclinação: ${s.targetAngle}°`}case"remove-weight":{const a=e.sceneState.weights.findIndex(s=>s.id===t.weightId);if(a!==-1){const s=e.sceneState.weights.splice(a,1)[0],i=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=i.targetAngle,`${k[s.type].name} removido. Inclinação: ${i.targetAngle}°`}return"Peso não encontrado."}case"move-weight":{const a=e.sceneState.weights.find(s=>s.id===t.weightId);if(a){a.slot=t.newSlot;const s=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=s.targetAngle,`${k[a.type].name} deslocado para ${t.newSlot} cm. Inclinação: ${s.targetAngle}°`}return"Peso não encontrado."}case"add-subbeam":{const a={id:"sb_"+Math.random().toString(36).slice(2,8),type:t.beamType,slot:t.slot,angle:0};e.sceneState.subBeams.push(a);const s=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=s.targetAngle,`${G[t.beamType].name} conectado em ${t.slot} cm.`}case"remove-subbeam":{const a=e.sceneState.subBeams.findIndex(s=>s.id===t.subBeamId);if(a!==-1){e.sceneState.subBeams.splice(a,1),e.sceneState.weights=e.sceneState.weights.filter(i=>i.subBeamId!==t.subBeamId);const s=p(e.sceneState,e.settings.tolerance);return e.sceneState.targetAngle=s.targetAngle,"Braço secundário removido."}return"Braço secundário não encontrado."}case"toggle-ruler":return e.sceneState.rulerVisible=!e.sceneState.rulerVisible,e.sceneState.rulerVisible?"Régua visível.":"Régua oculta.";case"toggle-dynamometer":return e.sceneState.dynamometerVisible=!e.sceneState.dynamometerVisible,e.sceneState.dynamometerVisible?"Dinamômetro visível.":"Dinamômetro oculto.";case"observe":{const a=e.sceneState.observations.find(s=>s.opportunity===t.opportunity);return a?a.result=t.result:e.sceneState.observations.push({opportunity:t.opportunity,result:t.result}),`Oportunidade ${t.opportunity} registrada: ${t.result}.`}}}function me(e=!1){return{version:1,seed:Date.now(),mode:"free",phase:"entry",settings:{quality:"auto",reduced:e,tolerance:.8,sound:!1,opportunities:5,instruction:"both"},sceneState:{fulcrumPosition:0,mainAngle:7.4,targetAngle:7.4,angularVelocity:0,weights:[{id:"w1",type:"terracotta",slot:-35},{id:"w2",type:"glass",slot:-20},{id:"w3",type:"fluted",slot:-10,subBeamId:"sub-brass",subSlot:"left"},{id:"w4",type:"cylinder",slot:-10,subBeamId:"sub-brass",subSlot:"right"},{id:"w5",type:"ring",slot:20,subBeamId:"sub-wood",subSlot:"left"},{id:"w6",type:"crackle",slot:20,subBeamId:"sub-wood",subSlot:"right"},{id:"w7",type:"cylinder",slot:35}],subBeams:[{id:"sub-brass",type:"brass",slot:-10,angle:-3.5},{id:"sub-wood",type:"wood",slot:20,angle:2.1}],rulerVisible:!0,dynamometerVisible:!0,observations:[]},history:[],future:[]}}async function F(e,t){const o=await new Promise((a,s)=>{const i=indexedDB.open("galeria-equilibrios-db",2);i.onupgradeneeded=()=>{i.result.objectStoreNames.contains("sculptures")&&i.result.deleteObjectStore("sculptures"),i.result.createObjectStore("sculptures")},i.onsuccess=()=>a(i.result),i.onerror=()=>s(i.error)});try{return await new Promise((a,s)=>{const i=o.transaction("sculptures",e==="read"?"readonly":"readwrite"),l=i.objectStore("sculptures"),c=t?{...t,sceneState:{...t.sceneState,observations:[]},history:[],future:[]}:void 0,f=e==="read"?l.get("saved"):e==="delete"?l.delete("saved"):l.put(c,"saved");i.oncomplete=()=>a(e==="read"?f.result:void 0),i.onerror=()=>s(i.error),i.onabort=()=>s(i.error)})}finally{o.close()}}function be(e){e.innerHTML=`
    <div id="experience" class="entrance">
      <!-- 3D Canvas Container -->
      <div id="world" role="region" aria-label="Galeria 3D dos Equilíbrios Impossíveis"></div>

      <!-- Accessible 2D Fallback Diagram -->
      <div id="fallback" hidden aria-label="Diagrama 2D de Equilíbrio">
        <div class="fallback-card">
          <h2>Modo Simplificado (Diagrama 2D)</h2>
          <p>O acelerador gráfico WebGL2 não está ativo. Você pode interagir pelo diagrama abaixo e pelos controles da interface.</p>
          <div id="diagram" class="diagram-canvas"></div>
          <p id="fallback-status" class="fallback-note"></p>
        </div>
      </div>

      <!-- Screen reader status live region -->
      <div id="status" class="sr-only" role="status" aria-live="polite"></div>

      <!-- Top Immersive Bar -->
      <header id="top-bar" class="top-bar">
        <div class="top-left">
          <button class="icon-btn" data-action="exit" aria-label="Voltar para a entrada">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
        </div>
        <div class="top-center">
          <h1 class="gallery-title">Galeria dos Equilíbrios Impossíveis</h1>
        </div>
        <div class="top-right">
          <button class="icon-btn" data-action="sound" aria-label="Ativar som" aria-pressed="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </button>
          <button class="icon-btn" data-action="capture" aria-label="Capturar fotografia">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <button class="icon-btn" data-action="pause" aria-label="Pausar galeria">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
          <button class="icon-btn" data-action="fullscreen" aria-label="Alternar tela cheia">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
      </header>

      <!-- Welcome Entrance Screen -->
      <div id="entry" class="entry-screen">
        <div class="entry-card">
          <p class="collection-tag">Coleção Gestalt & Expressiva · Verbo Equilibrar</p>
          <h2 class="entry-title">Galeria dos Equilíbrios Impossíveis</h2>
          <p class="entry-text">
            Um espaço sereno para explorar pesos, pontos de suspensão e níveis encadeados de móbiles cinéticos.
            Experimente a física intuitiva das alavancas e componha harmonias em latão, cerâmica, pedra e vidro.
          </p>
          <div class="entry-actions">
            <button class="btn primary" data-action="start">Explorar Galeria</button>
            <button class="btn secondary" data-action="activity">Escolher Atividade</button>
          </div>
          <p class="entry-disclaimer">
            Recurso expressivo e complementar. As escolhas artísticas não recebem escore.
          </p>
        </div>
      </div>

      <!-- Right Side Contextual Tool Panel -->
      <aside id="panel" class="contextual-panel" role="complementary" aria-label="Painel de Ferramentas"></aside>

      <!-- Bottom Dock / HUD -->
      <nav id="dock" class="bottom-dock" role="toolbar" aria-label="Ferramentas principais">
        <button class="dock-pill active" data-action="tool-add-weight" aria-pressed="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/></svg>
          <span>Adicionar peso</span>
        </button>
        <button class="dock-pill" data-action="tool-move-fulcrum" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 11 21 7 17 3"/><polyline points="7 21 3 17 7 13"/><line x1="21" y1="7" x2="9" y2="7"/><line x1="3" y1="17" x2="15" y2="17"/></svg>
          <span>Mover fulcro</span>
        </button>
        <button class="dock-pill" data-action="tool-observe" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Observar movimento</span>
        </button>
        <button class="dock-pill" data-action="tool-free-balance" aria-pressed="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>
          <span>Equilíbrio livre</span>
        </button>
      </nav>

      <!-- Floating Reopen Controls Button (when H pressed) -->
      <button class="floating-btn" data-action="show" hidden aria-label="Mostrar controles da galeria">
        Mostrar controles (H)
      </button>

      <!-- Modal Dialog -->
      <dialog id="dialog" class="gallery-dialog" aria-modal="true">
        <div id="dialog-content" class="dialog-body"></div>
      </dialog>
    </div>
  `}function ge(e,t,o,a,s,i){const{sceneState:l}=t,c=p(l,t.settings.tolerance);return e==="add-weight"?`
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6-6 6 6v12H6z"/></svg>
            <h2 class="panel-title">Adicionar peso</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Escolha um peso e pendure na barra ou em um gancho.</p>

        <!-- Weights Grid (2x3) -->
        <div class="weights-grid" role="radiogroup" aria-label="Tipos de peso">
          ${Object.values(k).map(r=>`
            <button class="weight-card ${r.type===o?"selected":""}" data-action="select-weight-type" data-type="${r.type}" aria-label="${r.name} (${r.mass} kg)">
              <div class="weight-thumb" style="background-color: ${r.color}22; border-color: ${r.color}">
                <span class="weight-dot" style="background-color: ${r.color}"></span>
              </div>
              <span class="weight-name">${r.name}</span>
              <span class="weight-mass">${r.mass.toFixed(1)} kg</span>
            </button>
          `).join("")}
        </div>

        <!-- Slot Selector -->
        <div class="control-row">
          <label for="slot-select">Furo na barra:</label>
          <select id="slot-select" class="select-field">
            ${ue.map(r=>`<option value="${r}" ${r===a?"selected":""}>${r>0?"+":""}${r} cm ${r<0?"(Esq)":r>0?"(Dir)":""}</option>`).join("")}
          </select>
        </div>

        <!-- Sub-Beam Attachment Option -->
        ${l.subBeams.length>0?`
          <div class="control-row">
            <label for="subbeam-select">Ou pendurar no braço:</label>
            <select id="subbeam-select" class="select-field">
              <option value="" ${s?"":"selected"}>Barra Principal</option>
              ${l.subBeams.map(r=>`<option value="${r.id}" ${s===r.id?"selected":""}>${G[r.type].name} (${r.slot} cm)</option>`).join("")}
            </select>
          </div>
        `:""}

        <div class="panel-actions">
          <button class="btn primary wide" data-action="hang-weight">Pendurar peso <span aria-hidden="true">→</span></button>
        </div>

        <!-- Secondary Sub-Beam Addition -->
        <div class="subbeam-section">
          <p class="subbeam-title">Criar nível encadeado (Móbile):</p>
          <div class="btn-group">
            <button class="btn secondary sm" data-action="add-subbeam-brass">+ Braço de latão</button>
            <button class="btn secondary sm" data-action="add-subbeam-wood">+ Braço de madeira</button>
          </div>
        </div>

        <!-- Switches -->
        <div class="switches-section">
          <label class="switch-row">
            <span class="switch-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="17" y1="8" x2="17" y2="16"/></svg>
              Régua
            </span>
            <input type="checkbox" id="toggle-ruler" ${l.rulerVisible?"checked":""}>
            <span class="switch-slider"></span>
          </label>
          <label class="switch-row">
            <span class="switch-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
              Dinamômetro
            </span>
            <input type="checkbox" id="toggle-dynamometer" ${l.dynamometerVisible?"checked":""}>
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>
    `:e==="move-fulcrum"?`
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 11 21 7 17 3"/><polyline points="7 21 3 17 7 13"/></svg>
            <h2 class="panel-title">Mover fulcro</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Ajuste o ponto de apoio ao longo da barra perfurada para alterar os braços de alavanca.</p>

        <div class="fulcrum-slider-wrap">
          <div class="slider-header">
            <span>Posição do fulcro:</span>
            <strong id="fulcrum-val">${l.fulcrumPosition>0?"+":""}${l.fulcrumPosition} cm</strong>
          </div>
          <input type="range" id="fulcrum-range" min="-30" max="30" step="5" value="${l.fulcrumPosition}" class="range-slider">
          <div class="slider-ticks">
            <span>-30 cm (Esq)</span>
            <span>0 (Centro)</span>
            <span>+30 cm (Dir)</span>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn secondary sm" data-action="fulcrum-left">← Deslocar -5 cm</button>
          <button class="btn secondary sm" data-action="fulcrum-center">Centro (0)</button>
          <button class="btn secondary sm" data-action="fulcrum-right">+5 cm →</button>
        </div>

        <div class="metrics-preview">
          <div class="metric-item">
            <span class="metric-label">Torque resultante:</span>
            <span class="metric-val">${c.netTorque>0?"+":""}${c.netTorque} N·m</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Inclinação estática:</span>
            <span class="metric-val ${c.isEquilibrated?"equilibrated":""}">${c.targetAngle>0?"+":""}${c.targetAngle}°</span>
          </div>
        </div>
      </div>
    `:e==="observe"?`
      <div class="panel-card">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <h2 class="panel-title">Observar movimento</h2>
          </div>
          <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
        </div>
        <p class="panel-instruction">Acompanhe as oscilações harmônicas e os dados físicos da escultura.</p>

        <div class="readout-card">
          <div class="readout-angle">
            <span class="readout-label">Inclinação atual</span>
            <span class="readout-number ${c.isEquilibrated?"green":""}">${l.mainAngle.toFixed(1)}°</span>
            <span class="readout-badge ${c.isEquilibrated?"badge-equilibrated":"badge-tilted"}">
              ${c.isEquilibrated?"✓ Equilíbrio Perfeito":"Desbalanceado"}
            </span>
          </div>
          <div class="readout-grid">
            <div class="readout-col">
              <span class="lbl">Carga Total</span>
              <span class="val">${c.totalMass} kg</span>
            </div>
            <div class="readout-col">
              <span class="lbl">Dinamômetro</span>
              <span class="val">${c.dynamometerTension} N</span>
            </div>
            <div class="readout-col">
              <span class="lbl">Torque Líquido</span>
              <span class="val">${c.netTorque} N·m</span>
            </div>
          </div>
        </div>

        <div class="view-selector">
          <span class="view-title">Enquadramentos da câmera:</span>
          <div class="view-buttons">
            <button class="btn secondary sm ${i==="panoramic"?"active":""}" data-action="view-panoramic">Panorâmica</button>
            <button class="btn secondary sm ${i==="fulcrum"?"active":""}" data-action="view-fulcrum">Fulcro</button>
            <button class="btn secondary sm ${i==="top"?"active":""}" data-action="view-top">Superior</button>
            <button class="btn secondary sm ${i==="weights"?"active":""}" data-action="view-weights">Pesos</button>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn secondary" data-action="undo" ${t.history.length?"":"disabled"}>↶ Desfazer</button>
          <button class="btn secondary" data-action="redo" ${t.future.length?"":"disabled"}>↷ Refazer</button>
          <button class="btn secondary" data-action="review">Revisar Peça</button>
        </div>
      </div>
    `:`
    <div class="panel-card">
      <div class="panel-header">
        <div class="panel-title-wrap">
          <svg class="panel-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>
          <h2 class="panel-title">${z[t.mode].title}</h2>
        </div>
        <button class="icon-btn-sm" data-action="close-panel" aria-label="Recolher painel">∧</button>
      </div>
      <p class="panel-instruction">${z[t.mode].description}</p>

      <div class="presets-section">
        <p class="presets-title">Composições sugeridas:</p>
        <div class="presets-list">
          ${Object.entries(T).map(([f,r])=>`
            <button class="preset-item" data-action="load-preset" data-preset="${f}">
              <strong>${r.label}</strong>
              <small>${r.description}</small>
            </button>
          `).join("")}
        </div>
      </div>

      <div class="btn-group">
        <button class="btn secondary" data-action="settings">Configurações</button>
        <button class="btn secondary" data-action="reset">Limpar Móbile</button>
      </div>
    </div>
  `}const D=document.querySelector("#app");be(D);const m=e=>document.getElementById(e),M=m("dialog"),L=m("world"),j=m("panel"),ve=m("fallback"),I=new de;let n=me(matchMedia("(prefers-reduced-motion: reduce)").matches),$,y="add-weight",N="panoramic",H="terracotta",P=-35,Z,ee=null,x=!0,S=!1,V=!1,J=!1;const te=new URLSearchParams(location.search).get("embed")==="1";document.body.classList.toggle("embedded",te);function B(e){m("status").textContent=e}function E(e,t={}){const o={source:"galeria-equilibrios",version:1,type:e,...t};if(window.dispatchEvent(new CustomEvent("galeria:session",{detail:o})),!te||window.parent===window||!document.referrer)return;const a=new URL(document.referrer).origin;a===location.origin&&window.parent.postMessage(o,a)}function K(){J||(J=!0,E("ready",{renderer:V?"fallback":"webgl2"}))}function Q(e){V=e,ve.hidden=!e,L.classList.toggle("unavailable",e),e&&ae()}function ae(){if(!V)return;const e=m("diagram"),t=p(n.sceneState,n.settings.tolerance),o=n.sceneState.mainAngle,a=n.sceneState.fulcrumPosition;e.innerHTML=`
    <svg viewBox="-250 -100 500 200" width="100%" height="100%">
      <!-- Fulcrum Triangle Support -->
      <polygon points="${a*4},-5 ${a*4-20},40 ${a*4+20},40" fill="#9D814A" />
      <circle cx="${a*4}" cy="-5" r="4" fill="#231F1D" />

      <!-- Horizontal Level Line (dashed) -->
      <line x1="-200" y1="-5" x2="200" y2="-5" stroke="#BBB" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Tilted Balance Beam -->
      <g transform="rotate(${o}, ${a*4}, -5)">
        <rect x="-200" y="-12" width="400" height="14" rx="4" fill="#B59550" stroke="#7E632D" stroke-width="2" />
        <!-- Holes and graduations -->
        ${[-40,-30,-20,-10,10,20,30,40].map(s=>`
          <circle cx="${s*4.5}" cy="-5" r="3" fill="#231F1D" />
          <text x="${s*4.5}" y="-16" font-size="9" text-anchor="middle" fill="#665">${Math.abs(s)}</text>
        `).join("")}

        <!-- Hanging Weights on Main Beam -->
        ${n.sceneState.weights.filter(s=>!s.subBeamId).map(s=>`
          <line x1="${s.slot*4.5}" y1="-5" x2="${s.slot*4.5}" y2="35" stroke="#444" stroke-width="1.5" />
          <circle cx="${s.slot*4.5}" cy="45" r="${k[s.type].mass*2.5}" fill="${k[s.type].color}" stroke="#333" stroke-width="1.5" />
          <text x="${s.slot*4.5}" y="70" font-size="8" text-anchor="middle" fill="#333">${k[s.type].name}</text>
        `).join("")}
      </g>
    </svg>
  `,m("fallback-status").textContent=`Inclinação: ${o.toFixed(1)}° · Carga total: ${t.totalMass} kg (${t.dynamometerTension} N)`}function O(){$&&$.sync({state:n,tool:y,view:N,selectedWeightId:ee}),V&&ae()}function v(){const e=n.phase==="work",t=n.phase==="entry";m("entry").hidden=!t,m("dock").hidden=!e||S,m("top-bar").hidden=t||S,D.querySelector('[data-action="show"]').hidden=!S,document.body.classList.toggle("controls-hidden",S),D.querySelectorAll(".dock-pill").forEach(a=>{const s=a.dataset.action,i=s==="tool-add-weight"&&y==="add-weight"||s==="tool-move-fulcrum"&&y==="move-fulcrum"||s==="tool-observe"&&y==="observe"||s==="tool-free-balance"&&y==="free-balance";a.classList.toggle("active",i),a.setAttribute("aria-pressed",String(i))}),j.hidden=!e||!x||S,j.hidden||(j.innerHTML=ge(y,n,H,P,Z,N)),O()}function d(e,t=!1){const o=n.sceneState,a=pe(n,e);(!t||n.sceneState!==o)&&B(a),o!==n.sceneState&&(e.type==="add-weight"&&I.play("hang"),e.type==="remove-weight"&&I.play("unhang"),e.type==="move-fulcrum"&&I.play("slide"),p(n.sceneState,n.settings.tolerance).isEquilibrated&&I.play("equilibrium")),v()}function q(e,t,o){M.dataset.kind=o,m("dialog-content").innerHTML=`
    <div class="dialog-head">
      <h2>${e}</h2>
      <button class="icon-btn-sm" data-action="close-dialog" aria-label="Fechar">✕</button>
    </div>
    ${t}
  `,M.open||M.showModal()}function w(){M.open&&M.close()}function X(e="free",t){if(w(),y="add-weight",N="panoramic",x=!0,S=!1,d({type:"start",mode:e}),t&&T[t]){T[t].setup(n);const o=p(n.sceneState,n.settings.tolerance);n.sceneState.targetAngle=o.targetAngle,n.sceneState.mainAngle=o.targetAngle}v()}function he(){q("Escolher Atividade",`
    <div class="control-row">
      <label for="mode-select">Modalidade de interação:</label>
      <select id="mode-select" class="select-field">
        ${Object.entries(z).map(([e,t])=>`<option value="${e}" ${e===n.mode?"selected":""}>${t.title} — ${t.subtitle}</option>`).join("")}
      </select>
    </div>
    <div class="control-row">
      <label for="preset-select">Configuração inicial:</label>
      <select id="preset-select" class="select-field">
        ${Object.entries(T).map(([e,t])=>`<option value="${e}">${t.label}</option>`).join("")}
      </select>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary" data-action="close-dialog">Cancelar</button>
      <button class="btn primary" data-action="start-custom">Iniciar Atividade →</button>
    </div>
  `,"activity")}function fe(){q("Configurações da Galeria",`
    <div class="control-row">
      <label for="quality-select">Qualidade gráfica:</label>
      <select id="quality-select" class="select-field">
        <option value="auto" ${n.settings.quality==="auto"?"selected":""}>Automática</option>
        <option value="light" ${n.settings.quality==="light"?"selected":""}>Leve</option>
        <option value="balanced" ${n.settings.quality==="balanced"?"selected":""}>Equilibrada</option>
        <option value="cinema" ${n.settings.quality==="cinema"?"selected":""}>Cinema (GTAO + HalfFloat)</option>
      </select>
    </div>
    <div class="control-row">
      <label for="tolerance-range">Tolerância de equilíbrio: <strong id="tol-val">${n.settings.tolerance}°</strong></label>
      <input type="range" id="tolerance-range" min="0.2" max="2.0" step="0.1" value="${n.settings.tolerance}" class="range-slider">
    </div>
    <div class="control-row">
      <label class="switch-row">
        <span>Reduzir movimentos e oscilações</span>
        <input type="checkbox" id="toggle-reduced" ${n.settings.reduced?"checked":""}>
        <span class="switch-slider"></span>
      </label>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary sm" data-action="load-save">Abrir Peça Salva</button>
      <button class="btn secondary sm" data-action="delete-save">Excluir Peça Salva</button>
      <button class="btn primary sm" data-action="close-dialog">Concluir</button>
    </div>
  `,"settings")}function Y(){const e=p(n.sceneState,n.settings.tolerance);q("Revisar Escultura",`
    <div class="readout-card">
      <dl class="metrics-preview">
        <div class="metric-item"><dt>Total de pesos:</dt><dd>${n.sceneState.weights.length}</dd></div>
        <div class="metric-item"><dt>Níveis de braços (móbiles):</dt><dd>${n.sceneState.subBeams.length+1}</dd></div>
        <div class="metric-item"><dt>Carga total suspensa:</dt><dd>${e.totalMass} kg</dd></div>
        <div class="metric-item"><dt>Força no dinamômetro:</dt><dd>${e.dynamometerTension} N</dd></div>
        <div class="metric-item"><dt>Inclinação final:</dt><dd>${n.sceneState.mainAngle.toFixed(1)}° (${e.isEquilibrated?"Equilibrado":"Desbalanceado"})</dd></div>
      </dl>
    </div>
    <p class="panel-instruction" style="text-align: center; font-style: italic;">
      "O que você percebe quando experimenta outra forma de equilibrar?"
    </p>
    <div class="dialog-actions">
      <button class="btn secondary sm" data-action="save-local">Salvar neste dispositivo</button>
      <button class="btn secondary sm" data-action="export-summary">Exportar Resumo (JSON)</button>
      <button class="btn primary sm" data-action="finish-session">Concluir Sessão →</button>
    </div>
  `,"review")}function ye(){q("Registro de Observação (Modo Acompanhado)",`
    <p class="panel-instruction">Registre as ações observadas do cliente/participante sem inferir valor subjetivo.</p>
    <div class="control-row">
      <label for="obs-opp">Oportunidade:</label>
      <select id="obs-opp" class="select-field">
        ${[1,2,3,4,5].map(e=>`<option value="${e}">Oportunidade ${e}</option>`).join("")}
      </select>
    </div>
    <div class="control-row">
      <label for="obs-result">Ação observada:</label>
      <select id="obs-result" class="select-field">
        <option value="Independente">Independente</option>
        <option value="Com ajuda">Com ajuda</option>
        <option value="Não realizada">Não realizada</option>
        <option value="Recusada">Recusada</option>
      </select>
    </div>
    <div class="dialog-actions">
      <button class="btn secondary" data-action="close-dialog">Cancelar</button>
      <button class="btn primary" data-action="record-obs">Registrar Observação</button>
    </div>
  `,"observe")}function se(e,t){const o=document.createElement("a");o.href=t,o.download=e,o.click()}function we(){const e=p(n.sceneState,n.settings.tolerance),t={version:1,collection:"Gestalt e expressiva",experience:"Galeria dos Equilíbrios Impossíveis",timestamp:new Date().toISOString(),mode:n.mode,weightsCount:n.sceneState.weights.length,subBeamsCount:n.sceneState.subBeams.length,totalMassKg:e.totalMass,dynamometerTensionN:e.dynamometerTension,finalAngleDeg:n.sceneState.mainAngle,isEquilibrated:e.isEquilibrated,observations:n.sceneState.observations},o=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),a=URL.createObjectURL(o);se("galeria-resumo.json",a),setTimeout(()=>URL.revokeObjectURL(a),1e3),E("summary",{totalMass:e.totalMass,angle:n.sceneState.mainAngle})}async function Se(e,t){if(e.startsWith("tool-")){y=e.slice(5),x=!0,v();return}if(e.startsWith("view-")){N=e.slice(5),v();return}switch(e){case"start":X("free");break;case"activity":he();break;case"start-custom":{const o=m("mode-select").value,a=m("preset-select").value;X(o,a);break}case"settings":fe();break;case"pause":d({type:"pause"}),E("pause"),q("Galeria em Pausa",`
        <p class="panel-instruction">A simulação cinética está pausada.</p>
        <div class="dialog-actions">
          <button class="btn secondary" data-action="exit">Sair para o Menu</button>
          <button class="btn primary" data-action="resume">Retomar Galeria →</button>
        </div>
      `,"pause");break;case"resume":w(),d({type:"resume"}),E("resume");break;case"exit":w(),d({type:"exit"}),E("exit");break;case"sound":{const o=await I.toggle(),a=D.querySelector('[data-action="sound"]');a.setAttribute("aria-pressed",String(o)),a.setAttribute("aria-label",o?"Silenciar som":"Ativar som"),B(o?"Som ativado.":"Som silenciado.");break}case"capture":{if($&&!V){const o=$.snapshot();o&&se("galeria-equilibrio.png",o)}break}case"fullscreen":document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen();break;case"close-dialog":w();break;case"close-panel":x=!x,v();break;case"show":S=!1,v();break;case"select-weight-type":t?.dataset.type&&(H=t.dataset.type,v());break;case"hang-weight":{const o=Number(m("slot-select").value),a=m("subbeam-select")?.value||void 0;d({type:"add-weight",weightType:H,slot:o,subBeamId:a,subSlot:"left"});break}case"add-subbeam-brass":d({type:"add-subbeam",beamType:"brass",slot:P});break;case"add-subbeam-wood":d({type:"add-subbeam",beamType:"wood",slot:P});break;case"fulcrum-left":d({type:"move-fulcrum",position:n.sceneState.fulcrumPosition-5});break;case"fulcrum-center":d({type:"move-fulcrum",position:0});break;case"fulcrum-right":d({type:"move-fulcrum",position:n.sceneState.fulcrumPosition+5});break;case"undo":d({type:"undo"});break;case"redo":d({type:"redo"});break;case"reset":q("Limpar Móbile?",`
        <p class="panel-instruction">Todos os pesos e sub-braços serão removidos da barra principal.</p>
        <div class="dialog-actions">
          <button class="btn secondary" data-action="close-dialog">Cancelar</button>
          <button class="btn primary" data-action="confirm-reset">Limpar</button>
        </div>
      `,"confirm");break;case"confirm-reset":w(),d({type:"reset"});break;case"review":d({type:"review"}),Y();break;case"open-observe":ye();break;case"save-local":await F("write",n),B("Escultura salva neste navegador."),Y();break;case"load-save":{const o=await F("read");o?.version===1?(n=o,n.phase="work",w(),v(),B("Peça carregada do armazenamento local.")):q("Sem Peça Salva",'<p class="panel-instruction">Nenhuma escultura salva encontrada neste navegador.</p><div class="dialog-actions"><button class="btn primary sm" data-action="close-dialog">Ok</button></div>',"notice");break}case"delete-save":await F("delete"),B("Cópia local excluída."),w();break;case"export-summary":we();break;case"finish-session":E("complete",{weights:n.sceneState.weights.length}),w(),d({type:"exit"}),E("exit");break;case"load-preset":{const o=t?.dataset.preset;if(o&&T[o]){T[o].setup(n);const a=p(n.sceneState,n.settings.tolerance);n.sceneState.targetAngle=a.targetAngle,n.sceneState.mainAngle=a.targetAngle,v(),B(`Composição "${T[o].label}" carregada.`)}break}case"record-obs":{const o=Number(m("obs-opp").value),a=m("obs-result").value;d({type:"observe",opportunity:o,result:a}),w();break}}}document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");t&&!("disabled"in t&&t.disabled)&&Se(t.dataset.action,t).catch(o=>{console.warn("Action failed:",o)})});document.addEventListener("input",e=>{const t=e.target;if(t.id==="fulcrum-range"){const o=Number(t.value);d({type:"move-fulcrum",position:o})}if(t.id==="tolerance-range"){n.settings.tolerance=Number(t.value);const o=m("tol-val");o&&(o.textContent=t.value+"°")}});document.addEventListener("change",e=>{const t=e.target;t.id==="slot-select"&&(P=Number(t.value)),t.id==="subbeam-select"&&(Z=t.value||void 0),t.id==="toggle-ruler"&&d({type:"toggle-ruler"}),t.id==="toggle-dynamometer"&&d({type:"toggle-dynamometer"}),t.id==="toggle-reduced"&&(n.settings.reduced=t.checked,O()),t.id==="quality-select"&&(n.settings.quality=t.value,O())});document.addEventListener("keydown",e=>{M.open||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||(e.key.toLowerCase()==="h"&&(S=!S,v()),e.key==="Escape"&&n.phase==="work"&&x&&(x=!1,v()),n.phase==="work"&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"&&(e.preventDefault(),d({type:e.shiftKey?"redo":"undo"})))});window.addEventListener("resize",()=>{$&&$.resize(L.clientWidth||window.innerWidth,L.clientHeight||window.innerHeight)});v();ce(async()=>{const{init:e}=await import("./scene-dQ5pLJE5.js");return{init:e}},[],import.meta.url).then(({init:e})=>{$=e(L,{selectWeight(t){ee=t,t&&(y="observe",x=!0),v()},selectHole(t){P=t,y="add-weight",x=!0,v()},moveFulcrum(t){d({type:"move-fulcrum",position:t})},status:B,fallback(t){Q(t)}}),O(),K()}).catch(()=>{Q(!0),K()});addEventListener("pagehide",e=>{e.persisted||$?.dispose()});if("serviceWorker"in navigator){const e=new URL(".",location.href);navigator.serviceWorker.register(new URL("sw.js",e),{scope:e.pathname}).catch(()=>{})}export{p as c,ke as s};
