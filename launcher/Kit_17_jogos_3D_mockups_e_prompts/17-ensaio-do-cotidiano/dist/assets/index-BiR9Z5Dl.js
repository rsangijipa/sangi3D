(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const C="modulepreload",E=function(i,e){return new URL(i,e).href},k={},M=function(e,a,t){let n=Promise.resolve();if(a&&a.length>0){let u=function(c){return Promise.all(c.map(h=>Promise.resolve(h).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};const s=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),d=r?.nonce||r?.getAttribute("nonce");n=u(a.map(c=>{if(c=E(c,t),c in k)return;k[c]=!0;const h=c.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(t)for(let g=s.length-1;g>=0;g--){const f=s[g];if(f.href===c&&(!h||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${v}`))return;const m=document.createElement("link");if(m.rel=h?"stylesheet":C,h||(m.as="script"),m.crossOrigin="",m.href=c,d&&m.setAttribute("nonce",d),document.head.appendChild(m),h)return new Promise((g,f)=>{m.addEventListener("load",g),m.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(s){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=s,window.dispatchEvent(r),!r.defaultPrevented)throw s}return n.then(s=>{for(const r of s||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};function I(i=!1){return{version:1,seed:Date.now(),phase:"entry",currentMissionId:"market_snack",carrier:"cart",currentWaypoint:"entrance",inventory:[],helpCount:0,activeHelpMessage:null,activeHighlightId:null,lowStimulation:!1,settings:{quality:"auto",sound:!1,brightness:1,reducedMotion:i,opportunities:5},history:[],future:[],observations:[]}}const y={apple:{id:"apple",name:"Maçã Vermelha",category:"fruit",color:"#B93226",waypoint:"produce",description:"Maçã gala madura, fresca e crocante da banca de frutas.",icon:"🍎",position:[-1.35,.95,1.45]},apple_green:{id:"apple_green",name:"Maçã Verde",category:"fruit",color:"#659C35",waypoint:"produce",description:"Maçã verde ácida e refrescante, colhida no sítio.",icon:"🍏",position:[-1.35,.95,1.25]},banana:{id:"banana",name:"Penca de Bananas",category:"fruit",color:"#D8AE36",waypoint:"produce",description:"Penca de banana prata doce em cesto de palha.",icon:"🍌",position:[-1.35,.95,.85]},orange:{id:"orange",name:"Laranjas Frescas",category:"fruit",color:"#E06D1A",waypoint:"produce",description:"Laranjas doces para suco em caixote de ripas de madeira.",icon:"🍊",position:[-1.35,.95,.55]},rice:{id:"rice",name:"Arroz Branco",category:"grain",color:"#F4EFE6",waypoint:"pantry",description:"Pacote de 1 kg de arroz branco tipo 1 em papel kraft costurado.",icon:"🌾",position:[1.35,1.15,.95]},beans:{id:"beans",name:"Feijão Preto",category:"grain",color:"#342D28",waypoint:"pantry",description:"Pote hermético de vidro com feijão selecionado para caldo.",icon:"🫘",position:[1.35,1.15,.65]},bread:{id:"bread",name:"Pão Caseiro Rústico",category:"bakery",color:"#A86A3D",waypoint:"bakery",description:"Pão rústico de fermentação lenta com crosta dourada.",icon:"🍞",position:[1.35,1.05,-.95]},milk:{id:"milk",name:"Leite Fresco",category:"dairy",color:"#FFFFFF",waypoint:"bakery",description:"Garrafa de vidro tradicional de leite integral da fazenda.",icon:"🥛",position:[1.35,.85,-1.25]},soap:{id:"soap",name:"Sabonete de Oliva",category:"hygiene",color:"#849669",waypoint:"pantry",description:"Barra de sabonete artesanal perfumado embrulhado em linho.",icon:"🧼",position:[1.35,.85,.35]},soap_liquid:{id:"soap_liquid",name:"Sabonete Líquido Neutro",category:"hygiene",color:"#C6D4C0",waypoint:"pantry",description:"Frasco de sabonete líquido suave para as mãos (alternativa recomendada).",icon:"🧴",position:[1.35,.85,.15]},book_history:{id:"book_history",name:"Livro de História",category:"study",color:"#26425A",waypoint:"pantry",description:"Volume encapado em tecido azul sobre cidades antigas.",icon:"📖",position:[1.35,1.45,.55]},notebook:{id:"notebook",name:"Caderno de Anotações",category:"study",color:"#B57448",waypoint:"pantry",description:"Caderno espiral com capa de papel kraft pautado.",icon:"📓",position:[1.35,1.45,.25]},pencil:{id:"pencil",name:"Estojo com Lápis",category:"study",color:"#E2B855",waypoint:"bakery",description:"Estojo de feltro com lápis apontados e borracha macia.",icon:"✏️",position:[1.35,1.45,-.85]},water_bottle:{id:"water_bottle",name:"Garrafa Térmica",category:"study",color:"#497566",waypoint:"produce",description:"Garrafa reutilizável de alumínio verde musgo com alça.",icon:"🍶",position:[-1.35,1.35,.4]}},p={market_snack:{id:"market_snack",title:"Lanche da Tarde",context:"market",subtitle:"Mercadinho Acolhedor · 3 itens",description:"Encontre 1 maçã vermelha, 1 pacote de arroz e 1 pão rústico para o lanche.",requiredItemIds:["apple","rice","bread"],targetCarrier:"cart"},market_dinner:{id:"market_dinner",title:"Jantar em Família",context:"market",subtitle:"Mercadinho Acolhedor · 5 itens",description:"Reúna arroz, feijão, laranjas, pão fresco e leite para a refeição da noite.",requiredItemIds:["rice","beans","orange","bread","milk"],targetCarrier:"cart"},market_hygiene:{id:"market_hygiene",title:"Cuidados e Lanche",context:"market",subtitle:"Mercadinho Acolhedor · com alternativa",description:"Busque sabonete, maçã e leite. Se a barra de sabonete estiver em falta, substitua pelo sabonete líquido.",requiredItemIds:["soap","apple","milk"],alternatives:{soap:"soap_liquid"},targetCarrier:"basket"},library_research:{id:"library_research",title:"Pesquisa Escolar",context:"library",subtitle:"Canto dos Livros · 3 itens",description:"Localize o livro de história, o caderno de anotações e o estojo com lápis.",requiredItemIds:["book_history","notebook","pencil"],targetCarrier:"basket"},backpack_morning:{id:"backpack_morning",title:"Organizar a Mochila",context:"backpack",subtitle:"Preparação Matinal · 4 itens",description:"Separe caderno, estojo, garrafa térmica e uma fruta antes de sair.",requiredItemIds:["notebook","pencil","water_bottle","apple"],targetCarrier:"basket"},market_free:{id:"market_free",title:"Exploração Livre",context:"market",subtitle:"Sem lista obrigatória",description:"Caminhe livremente pelos corredores, toque a campainha do caixa e monte sua própria cesta.",requiredItemIds:[],targetCarrier:"cart"}},S={entrance:{id:"entrance",label:"Entrada do Mercadinho",cameraPos:[0,1.48,2.9],cameraLook:[0,1.35,0],cartPos:[.38,0,2.3]},produce:{id:"produce",label:"Banca de Frutas",cameraPos:[-.65,1.38,1.3],cameraLook:[-1.4,1.05,1],cartPos:[-.25,0,1.1]},pantry:{id:"pantry",label:"Estante de Mantimentos",cameraPos:[.65,1.38,.7],cameraLook:[1.4,1.15,.5],cartPos:[.22,0,.6]},bakery:{id:"bakery",label:"Padaria e Laticínios",cameraPos:[.6,1.38,-.9],cameraLook:[1.35,1.15,-1.15],cartPos:[.18,0,-.85]},checkout:{id:"checkout",label:"Balcão do Caixa",cameraPos:[-.6,1.38,-1.35],cameraLook:[-1.35,1.25,-1.55],cartPos:[-.2,0,-1.3]}},b={rice:"O arroz branco fica logo ali na segunda prateleira da estante de mantimentos, à sua direita!",apple:"As maçãs mais doces e frescas estão na primeira banca de frutas, à sua esquerda!",bread:"O pão caseiro quentinho fica no cesto de vime, perto dos laticínios no fundo da loja.",soap:"Os sabonetes artesanais estão na prateleira baixa de mantimentos. Temos em barra e líquido!",time:"Sem pressa nenhuma! Respire com calma e olhe o mercadinho no seu tempo.",not_found:"Não se preocupe: se não encontrar exatamente o mesmo item, você pode levar um substituto equivalente."};function x(i){const e=p[i.currentMissionId]||p.market_snack,a=e.requiredItemIds;if(a.length===0)return{missionTitle:e.title,totalRequired:i.inventory.length,foundCount:i.inventory.length,isComplete:!0,missingItems:[],hasValidSubstitutes:!1};let t=0;const n=[];let o=!1;for(const s of a){const r=i.inventory.includes(s),d=e.alternatives?.[s],u=d&&i.inventory.includes(d);r?t++:u?(t++,o=!0):n.push(s)}return{missionTitle:e.title,totalRequired:a.length,foundCount:t,isComplete:t>=a.length,missingItems:n,hasValidSubstitutes:o}}function l(i,e){switch((e.type==="add-to-cart"||e.type==="remove-from-cart"||e.type==="move-waypoint"||e.type==="reset")&&(i.history.push({currentWaypoint:i.currentWaypoint,carrier:i.carrier,inventory:[...i.inventory],helpCount:i.helpCount,activeHelpMessage:i.activeHelpMessage,activeHighlightId:i.activeHighlightId,lowStimulation:i.lowStimulation}),i.history.length>25&&i.history.shift(),i.future=[]),e.type){case"start":return i.phase="work",e.missionId&&(i.currentMissionId=e.missionId),e.carrier&&(i.carrier=e.carrier),i.inventory=[],i.currentWaypoint="entrance",i.helpCount=0,i.activeHelpMessage=null,i.activeHighlightId=null,`Missão "${(p[i.currentMissionId]||p.market_snack).title}" iniciada. Siga pelo corredor do mercadinho.`;case"move-waypoint":return i.currentWaypoint=e.waypoint,i.activeHelpMessage=null,i.activeHighlightId=null,`Você agora está em: ${e.waypoint}.`;case"add-to-cart":{const t=y[e.itemId];if(!t)return"Produto não encontrado.";if(i.inventory.includes(e.itemId))return`${t.name} já está no seu ${i.carrier==="cart"?"carrinho":"cesta"}.`;i.inventory.push(e.itemId),i.activeHighlightId=null;const n=x(i);return`${t.name} colocado no ${i.carrier==="cart"?"carrinho":"cesta"}. (${n.foundCount}/${n.totalRequired})`}case"remove-from-cart":{const t=i.inventory.indexOf(e.itemId);if(t!==-1){i.inventory.splice(t,1);const n=y[e.itemId];return`${n?n.name:"Item"} retirado.`}return"Item não estava no carrinho."}case"ask-help":{i.helpCount++;const t=b[e.topic]||b.not_found;return i.activeHelpMessage=t,y[e.topic]?i.activeHighlightId=e.topic:i.activeHighlightId=null,`Atendente: "${t}"`}case"dismiss-help":return i.activeHelpMessage=null,i.activeHighlightId=null,"Ajuda concluída.";case"toggle-low-stim":return i.lowStimulation=!i.lowStimulation,i.lowStimulation?"Modo de baixa estimulação ativado.":"Modo normal ativado.";case"set-carrier":return i.carrier=e.carrier,`Usando agora: ${e.carrier==="cart"?"carrinho de compras":"cesta de mão"}.`;case"checkout":return i.phase="checkout",i.currentWaypoint="checkout","No balcão do caixa para conferência da compra.";case"confirm-purchase":return i.phase="review","Compra finalizada com sucesso no caixa!";case"undo":{if(!i.history.length)return"Nada a desfazer.";i.future.push({currentWaypoint:i.currentWaypoint,carrier:i.carrier,inventory:[...i.inventory],helpCount:i.helpCount,activeHelpMessage:i.activeHelpMessage,activeHighlightId:i.activeHighlightId,lowStimulation:i.lowStimulation});const t=i.history.pop();return i.currentWaypoint=t.currentWaypoint,i.carrier=t.carrier,i.inventory=t.inventory,i.helpCount=t.helpCount,i.activeHelpMessage=t.activeHelpMessage,i.activeHighlightId=t.activeHighlightId,i.lowStimulation=t.lowStimulation,"Última ação desfeita."}case"redo":{if(!i.future.length)return"Nada a refazer.";i.history.push({currentWaypoint:i.currentWaypoint,carrier:i.carrier,inventory:[...i.inventory],helpCount:i.helpCount,activeHelpMessage:i.activeHelpMessage,activeHighlightId:i.activeHighlightId,lowStimulation:i.lowStimulation});const t=i.future.pop();return i.currentWaypoint=t.currentWaypoint,i.carrier=t.carrier,i.inventory=t.inventory,i.helpCount=t.helpCount,i.activeHelpMessage=t.activeHelpMessage,i.activeHighlightId=t.activeHighlightId,i.lowStimulation=t.lowStimulation,"Ação refeita."}case"reset":return i.inventory=[],i.helpCount=0,i.activeHelpMessage=null,i.activeHighlightId=null,i.currentWaypoint="entrance","Lista e carrinho reiniciados.";case"pause":return i.phase="paused","Sessão pausada.";case"resume":return i.phase="work","Sessão retomada.";case"exit":return i.phase="entry","Retorno à entrada principal.";case"observe":return i.observations.push({opportunity:e.opportunity,action:e.actionName,result:e.result}),`Oportunidade ${e.opportunity} registrada: ${e.result}.`}}class B{ctx=null;enabled=!1;initCtx(){if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}async toggle(){return this.enabled=!this.enabled,this.enabled&&(this.initCtx(),this.play("click")),this.enabled}isEnabled(){return this.enabled}play(e){if(!this.enabled)return;const a=this.initCtx();if(!a)return;const t=a.currentTime;switch(e){case"bell":{const n=a.createOscillator(),o=a.createOscillator(),s=a.createGain();n.type="sine",o.type="sine",n.frequency.setValueAtTime(2093,t),o.frequency.setValueAtTime(3135,t),s.gain.setValueAtTime(.22,t),s.gain.exponentialRampToValueAtTime(1e-4,t+1.2),n.connect(s),o.connect(s),s.connect(a.destination),n.start(t),o.start(t),n.stop(t+1.2),o.stop(t+1.2);break}case"pick":{const n=a.createOscillator(),o=a.createGain();n.type="triangle",n.frequency.setValueAtTime(420,t),n.frequency.exponentialRampToValueAtTime(680,t+.08),o.gain.setValueAtTime(.12,t),o.gain.exponentialRampToValueAtTime(.001,t+.1),n.connect(o),o.connect(a.destination),n.start(t),n.stop(t+.1);break}case"drop":{const n=a.createOscillator(),o=a.createGain();n.type="sine",n.frequency.setValueAtTime(260,t),n.frequency.exponentialRampToValueAtTime(140,t+.12),o.gain.setValueAtTime(.15,t),o.gain.exponentialRampToValueAtTime(.001,t+.14),n.connect(o),o.connect(a.destination),n.start(t),n.stop(t+.14);break}case"step":{const n=a.createOscillator(),o=a.createGain();n.type="sine",n.frequency.setValueAtTime(110,t),n.frequency.exponentialRampToValueAtTime(70,t+.1),o.gain.setValueAtTime(.06,t),o.gain.exponentialRampToValueAtTime(.001,t+.12),n.connect(o),o.connect(a.destination),n.start(t),n.stop(t+.12);break}case"wheels":{const n=a.createOscillator(),o=a.createGain();n.type="triangle",n.frequency.setValueAtTime(180,t),n.frequency.linearRampToValueAtTime(160,t+.25),o.gain.setValueAtTime(.05,t),o.gain.exponentialRampToValueAtTime(.001,t+.3),n.connect(o),o.connect(a.destination),n.start(t),n.stop(t+.3);break}case"success":{[523.25,659.25,783.99,1046.5].forEach((o,s)=>{const r=a.createOscillator(),d=a.createGain();r.type="sine",r.frequency.setValueAtTime(o,t+s*.05),d.gain.setValueAtTime(.08/(s+1),t+s*.05),d.gain.exponentialRampToValueAtTime(1e-4,t+1.4),r.connect(d),d.connect(a.destination),r.start(t+s*.05),r.stop(t+1.4)});break}default:{const n=a.createOscillator(),o=a.createGain();n.type="triangle",n.frequency.setValueAtTime(500,t),o.gain.setValueAtTime(.05,t),o.gain.exponentialRampToValueAtTime(.001,t+.04),n.connect(o),o.connect(a.destination),n.start(t),n.stop(t+.04);break}}}}async function w(i,e){const a=await new Promise((t,n)=>{const o=indexedDB.open("ensaio-cotidiano-db",1);o.onupgradeneeded=()=>o.result.createObjectStore("sessions"),o.onsuccess=()=>t(o.result),o.onerror=()=>n(o.error)});try{return await new Promise((t,n)=>{const o=a.transaction("sessions",i==="read"?"readonly":"readwrite"),s=o.objectStore("sessions"),r=e?{...e,observations:[],history:[],future:[]}:void 0,d=i==="read"?s.get("saved"):i==="delete"?s.delete("saved"):s.put(r,"saved");o.oncomplete=()=>t(i==="read"?d.result:void 0),o.onerror=()=>n(o.error),o.onabort=()=>n(o.error)})}finally{a.close()}}class A{container;events;liveStatusEl;appTitleEl;soundBtn;lowStimBtn;missionHud;waypointBar;npcBubble;fallback2DEl;missionsModal;checkoutModal;summaryModal;settingsModal;controlsHidden=!1;constructor(e,a){this.container=e,this.events=a,this.buildDOM()}buildDOM(){this.container.innerHTML=`
      <div id="viewport-container">
        <canvas id="webgl-canvas"></canvas>
      </div>

      <!-- 2D Fallback Planogram (shown when WebGL fails or disabled) -->
      <div id="fallback-2d" hidden>
        <div class="fallback-content">
          <h2 style="color: var(--color-primary); margin-bottom: 8px;">🗺️ Mercadinho Acolhedor · Vista 2D</h2>
          <p style="font-size: 13px; color: var(--color-text-muted);">
            Plano esquemático interativo com navegação e seleção direta de itens.
          </p>
          <svg class="fallback-svg-map" viewBox="0 0 600 320">
            <!-- Floor -->
            <rect x="10" y="10" width="580" height="300" rx="14" fill="#FAF5E9" stroke="#A76C3D" stroke-width="2"/>
            <!-- Moss rug aisle -->
            <rect x="230" y="20" width="140" height="280" rx="8" fill="#48634B" opacity="0.35"/>
            <!-- Shelves Left (Produce) -->
            <rect x="30" y="30" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="115" y="50" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🍎 Banca de Frutas</text>
            <!-- Shelves Right (Pantry) -->
            <rect x="400" y="30" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="485" y="50" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🌾 Mantimentos</text>
            <!-- Shelves Right-Back (Bakery) -->
            <rect x="400" y="160" width="170" height="110" rx="6" fill="#DECEB5" stroke="#A76C3D" stroke-width="1.5"/>
            <text x="485" y="180" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🍞 Padaria & Leite</text>
            <!-- Checkout Counter (Back-Left) -->
            <rect x="30" y="160" width="170" height="110" rx="6" fill="#C89D66" stroke="#254533" stroke-width="2"/>
            <text x="115" y="180" font-size="12" font-weight="bold" fill="#254533" text-anchor="middle">🔔 Balcão do Caixa</text>
            <!-- Waypoint circles -->
            <circle cx="300" cy="270" r="16" fill="#254533" class="svg-wp" data-wp="entrance" style="cursor:pointer"/>
            <text x="300" y="275" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">1</text>
            <circle cx="115" cy="85" r="16" fill="#254533" class="svg-wp" data-wp="produce" style="cursor:pointer"/>
            <text x="115" y="90" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">2</text>
            <circle cx="485" cy="85" r="16" fill="#254533" class="svg-wp" data-wp="pantry" style="cursor:pointer"/>
            <text x="485" y="90" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">3</text>
            <circle cx="485" cy="215" r="16" fill="#254533" class="svg-wp" data-wp="bakery" style="cursor:pointer"/>
            <text x="485" y="220" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">4</text>
            <circle cx="115" cy="215" r="16" fill="#254533" class="svg-wp" data-wp="checkout" style="cursor:pointer"/>
            <text x="115" y="220" font-size="11" fill="#FFF" text-anchor="middle" pointer-events="none">5</text>
          </svg>
          <div id="fallback-item-chips" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 12px;"></div>
        </div>
      </div>

      <!-- Top Immersive Bar -->
      <header id="immersive-bar">
        <div class="bar-cluster-left">
          <button id="btn-missions" class="icon-button" title="Mudar Missão" aria-label="Mudar Missão">
            📋 <span style="font-size: 12px;">Missões</span>
          </button>
          <button id="btn-carrier-toggle" class="icon-button" title="Alternar Carrinho/Cesta" aria-label="Alternar Carrinho ou Cesta">
            🛒 <span id="carrier-label" style="font-size: 12px;">Carrinho</span>
          </button>
        </div>

        <div class="bar-center">
          <span class="app-title">Ensaio do Cotidiano</span>
          <span class="context-badge" id="context-badge">Mercadinho</span>
        </div>

        <div class="bar-cluster-right">
          <button id="btn-sound" class="icon-button active" title="Som" aria-label="Alternar Som">🔊</button>
          <button id="btn-low-stim" class="icon-button" title="Baixo Estímulo" aria-label="Modo Baixo Estímulo">🌿</button>
          <button id="btn-settings" class="icon-button" title="Ajustes" aria-label="Ajustes">⚙️</button>
          <button id="btn-hide-ui" class="icon-button" title="Ocultar Interface (H)" aria-label="Ocultar Controles">👁️</button>
        </div>
      </header>

      <!-- Mission HUD -->
      <aside id="mission-hud">
        <div class="hud-header">
          <div class="hud-title-wrap">
            <span class="hud-mission-title" id="hud-mission-title">Lanche da Tarde</span>
            <span class="hud-carrier-tag" id="hud-carrier-tag">Uso: Carrinho</span>
          </div>
          <button id="btn-ask-help" class="btn-hud" title="Pedir Ajuda">
            🙋 Ajuda
          </button>
        </div>
        <div class="hud-checklist" id="hud-checklist"></div>
        <div class="hud-actions">
          <button id="btn-open-checkout" class="btn-hud btn-checkout">
            🔔 Finalizar no Caixa
          </button>
        </div>
      </aside>

      <!-- Bottom Waypoint Bar -->
      <nav id="waypoint-bar" aria-label="Navegação de Setores"></nav>

      <!-- Cashier / NPC Bubble -->
      <div id="npc-speech-bubble" hidden>
        <div class="speech-avatar">🧑‍🌾</div>
        <div class="speech-text-wrap">
          <div class="speech-title">Atendente do Mercadinho</div>
          <div class="speech-message" id="npc-speech-text">Olá! Em que posso te ajudar hoje?</div>
        </div>
        <button id="btn-close-speech" class="speech-close" aria-label="Fechar">✕</button>
      </div>

      <!-- Live Status Badge (for tests & accessibility) -->
      <div id="live-status" role="status" aria-live="polite">Status: Pronto</div>

      <!-- Modals Container -->
      <div id="modals-root"></div>
    `,this.initElements(),this.renderWaypoints(),this.renderModals(),this.bindDOMEvents()}initElements(){this.liveStatusEl=document.getElementById("live-status"),this.appTitleEl=document.querySelector(".app-title"),this.soundBtn=document.getElementById("btn-sound"),this.lowStimBtn=document.getElementById("btn-low-stim"),this.missionHud=document.getElementById("mission-hud"),this.waypointBar=document.getElementById("waypoint-bar"),this.npcBubble=document.getElementById("npc-speech-bubble"),this.fallback2DEl=document.getElementById("fallback-2d")}renderWaypoints(){this.waypointBar.innerHTML=Object.values(S).map(e=>`
        <button class="waypoint-btn ${e.id==="entrance"?"active":""}" data-wp="${e.id}">
          ${e.label}
        </button>
      `).join("")}renderModals(){const e=document.getElementById("modals-root");this.missionsModal=document.createElement("div"),this.missionsModal.id="modal-missions",this.missionsModal.className="modal-overlay",this.missionsModal.hidden=!0,this.missionsModal.innerHTML=`
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">📋 Escolha uma Atividade do Cotidiano</h2>
          <button class="modal-close-btn" data-close="missions">✕</button>
        </div>
        <div class="modal-body">
          <div class="mission-grid" id="modal-mission-list">
            ${Object.values(p).map(a=>`
              <div class="mission-card-option" data-mission="${a.id}">
                <div style="font-weight: 700; color: var(--color-primary); font-size: 14px;">${a.title}</div>
                <div style="font-size: 12px; color: var(--color-accent);">${a.subtitle}</div>
                <div style="font-size: 12px; color: var(--color-text-muted);">${a.description}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,e.appendChild(this.missionsModal),this.checkoutModal=document.createElement("div"),this.checkoutModal.id="modal-checkout",this.checkoutModal.className="modal-overlay",this.checkoutModal.hidden=!0,this.checkoutModal.innerHTML=`
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">🔔 Caixa do Mercadinho</h2>
          <button class="modal-close-btn" data-close="checkout">✕</button>
        </div>
        <div class="modal-body">
          <div class="service-bell-cta" id="btn-modal-bell">
            🛎️ Toque a campainha para chamar o atendente
          </div>
          <div style="font-weight: 600; font-size: 14px;">Itens colocados no cesto:</div>
          <div id="checkout-items-list" style="display:flex; flex-direction:column; gap:6px;"></div>
          <div id="checkout-validation-status" style="padding:10px; border-radius:8px; font-size:13px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" data-close="checkout">Voltar às compras</button>
          <button class="btn-primary" id="btn-finish-payment">Concluir no Caixa</button>
        </div>
      </div>
    `,e.appendChild(this.checkoutModal),this.summaryModal=document.createElement("div"),this.summaryModal.id="modal-summary",this.summaryModal.className="modal-overlay",this.summaryModal.hidden=!0,this.summaryModal.innerHTML=`
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">🎉 Atividade Concluída!</h2>
          <button class="modal-close-btn" data-close="summary">✕</button>
        </div>
        <div class="modal-body">
          <p id="summary-feedback" style="font-size: 14px; color: var(--color-text);">Parabéns! Você passou pelo caixa com sucesso.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #FAF5E9; padding: 12px; border-radius: 10px;">
            <div><strong>Itens comprados:</strong> <span id="summary-items-count">0</span></div>
            <div><strong>Pedidos de ajuda:</strong> <span id="summary-help-count">0</span></div>
          </div>
          <div style="border-top: 1px solid #EAE3D5; padding-top: 10px;">
            <label style="font-weight: 600; font-size: 13px;">Registro do Acompanhante / Avaliação:</label>
            <div style="display:flex; gap:8px; margin: 8px 0; flex-wrap: wrap;">
              <button class="btn-secondary btn-obs" data-obs="Independente">Independente</button>
              <button class="btn-secondary btn-obs" data-obs="Com ajuda">Com ajuda</button>
              <button class="btn-secondary btn-obs" data-obs="Não realizada">Não realizada</button>
              <button class="btn-secondary btn-obs" data-obs="Recusada">Recusada</button>
            </div>
            <textarea id="summary-obs-notes" rows="2" placeholder="Observações clínicas ou pedagógicas..." style="width: 100%; border: 1px solid var(--color-border); border-radius: 8px; padding: 8px; font-family: inherit; font-size: 12px;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" id="btn-save-summary">Salvar e Continuar</button>
        </div>
      </div>
    `,e.appendChild(this.summaryModal),this.settingsModal=document.createElement("div"),this.settingsModal.id="modal-settings",this.settingsModal.className="modal-overlay",this.settingsModal.hidden=!0,this.settingsModal.innerHTML=`
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Ajustes e Acessibilidade</h2>
          <button class="modal-close-btn" data-close="settings">✕</button>
        </div>
        <div class="modal-body">
          <div class="setting-row">
            <div>
              <div class="setting-label">🌿 Modo Baixo Estímulo</div>
              <div class="setting-desc">Luz suave, cores atenuadas e sem brilhos intensos</div>
            </div>
            <input type="checkbox" id="chk-low-stim" style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">🔊 Efeitos Sonoros</div>
              <div class="setting-desc">Campainha de serviço, passos e colocação no carrinho</div>
            </div>
            <input type="checkbox" id="chk-sound" checked style="width:20px; height:20px; cursor:pointer"/>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">🗺️ Modo Planta 2D</div>
              <div class="setting-desc">Visualizar mapa simplificado sem renderização 3D</div>
            </div>
            <input type="checkbox" id="chk-fallback-2d" style="width:20px; height:20px; cursor:pointer"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" data-close="settings">Concluído</button>
        </div>
      </div>
    `,e.appendChild(this.settingsModal)}bindDOMEvents(){this.waypointBar.addEventListener("click",a=>{const t=a.target.closest(".waypoint-btn");t&&t.dataset.wp&&this.events.onSelectWaypoint(t.dataset.wp)}),this.fallback2DEl.addEventListener("click",a=>{const t=a.target.closest(".svg-wp");t&&t.dataset.wp&&this.events.onSelectWaypoint(t.dataset.wp);const n=a.target.closest(".fallback-item-btn");n&&n.dataset.item&&this.events.onPick2DItem(n.dataset.item)}),document.getElementById("btn-sound").addEventListener("click",()=>this.events.onToggleSound()),document.getElementById("btn-low-stim").addEventListener("click",()=>this.events.onToggleLowStim()),document.getElementById("btn-carrier-toggle").addEventListener("click",()=>this.events.onToggleCarrier()),document.getElementById("btn-missions").addEventListener("click",()=>this.events.onOpenMissions()),document.getElementById("btn-settings").addEventListener("click",()=>this.events.onOpenSettings()),document.getElementById("btn-hide-ui").addEventListener("click",()=>this.events.onToggleControlsHide()),document.getElementById("btn-ask-help").addEventListener("click",()=>this.events.onAskHelp()),document.getElementById("btn-open-checkout").addEventListener("click",()=>this.events.onOpenCheckout()),document.getElementById("btn-close-speech").addEventListener("click",()=>{this.npcBubble.hidden=!0}),document.querySelectorAll("[data-close]").forEach(a=>{a.addEventListener("click",t=>{const n=t.currentTarget.dataset.close;n==="missions"&&(this.missionsModal.hidden=!0),n==="checkout"&&(this.checkoutModal.hidden=!0),n==="summary"&&(this.summaryModal.hidden=!0),n==="settings"&&(this.settingsModal.hidden=!0)})}),document.getElementById("modal-mission-list").addEventListener("click",a=>{const t=a.target.closest(".mission-card-option");t&&t.dataset.mission&&(this.events.onSelectMission(t.dataset.mission),this.missionsModal.hidden=!0)}),document.getElementById("btn-modal-bell").addEventListener("click",()=>this.events.onRingBell()),document.getElementById("btn-finish-payment").addEventListener("click",()=>this.events.onConfirmCheckout());let e="Independente";this.summaryModal.querySelectorAll(".btn-obs").forEach(a=>{a.addEventListener("click",t=>{this.summaryModal.querySelectorAll(".btn-obs").forEach(o=>o.classList.remove("btn-primary"));const n=t.currentTarget;n.classList.add("btn-primary"),e=n.dataset.obs})}),document.getElementById("btn-save-summary").addEventListener("click",()=>{const a=document.getElementById("summary-obs-notes").value;this.events.onSaveObservation(e,a),this.summaryModal.hidden=!0}),document.getElementById("chk-low-stim").addEventListener("change",()=>this.events.onToggleLowStim()),document.getElementById("chk-sound").addEventListener("change",()=>this.events.onToggleSound()),document.getElementById("chk-fallback-2d").addEventListener("change",()=>this.events.onToggleFallback())}updateState(e){this.waypointBar.querySelectorAll(".waypoint-btn").forEach(u=>{const c=u;c.dataset.wp===e.currentWaypoint?c.classList.add("active"):c.classList.remove("active")});const a=document.getElementById("carrier-label");a.textContent=e.carrier==="cart"?"Carrinho":"Cesta";const t=document.getElementById("hud-carrier-tag");t.textContent=`Uso: ${e.carrier==="cart"?"Carrinho de Metal":"Cesta de Vime"}`,this.soundBtn.classList.toggle("active",e.settings.sound),this.soundBtn.textContent=e.settings.sound?"🔊":"🔇",this.lowStimBtn.classList.toggle("active",e.lowStimulation);const n=document.getElementById("chk-low-stim");n&&(n.checked=e.lowStimulation);const o=document.getElementById("chk-sound");o&&(o.checked=e.settings.sound);const s=p[e.currentMissionId]||p.market_snack;document.getElementById("hud-mission-title").textContent=s.title;const r=document.getElementById("hud-checklist");r.innerHTML=s.requiredItemIds.map(u=>{const c=y[u],h=e.inventory.includes(u)||s.alternatives?.[u]&&e.inventory.includes(s.alternatives[u]);return`
        <div class="hud-item ${h?"collected":""}">
          <span class="hud-item-icon">${c?.icon||"📦"}</span>
          <span style="flex:1;">${c?.name||u}</span>
          <span class="hud-item-check">${h?"✓":"○"}</span>
        </div>
      `}).join("");const d=document.getElementById("context-badge");d.textContent=s.context==="market"?"Mercadinho":s.context==="library"?"Biblioteca":"Mochila",this.updateFallbackItems(e),this.liveStatusEl.textContent=`Status: ${e.phase} | Setor: ${e.currentWaypoint} | Itens: ${e.inventory.length}`}updateFallbackItems(e){const a=document.getElementById("fallback-item-chips");a&&(a.innerHTML=Object.values(y).map(t=>{const n=e.inventory.includes(t.id);return`
        <button class="btn-secondary fallback-item-btn" data-item="${t.id}" style="${n?"background:#E8F0EA; border-color:#2E7D32;":""}">
          ${t.icon} ${t.name} ${n?"✓":"+"}
        </button>
      `}).join(""))}showSpeech(e){const a=document.getElementById("npc-speech-text");a.textContent=e,this.npcBubble.hidden=!1}hideSpeech(){this.npcBubble.hidden=!0}openCheckoutModal(e){const a=document.getElementById("checkout-items-list"),t=document.getElementById("checkout-validation-status");e.inventory.length===0?a.innerHTML='<div style="font-size:13px; color:var(--color-text-muted); font-style:italic;">Seu cesto está vazio no momento.</div>':a.innerHTML=e.inventory.map(o=>{const s=y[o];return`
          <div style="display:flex; align-items:center; justify-content:space-between; background:#FAF5E9; padding:6px 10px; border-radius:6px; font-size:13px;">
            <span>${s?.icon||"📦"} ${s?.name||o}</span>
            <span style="color:var(--color-success); font-weight:bold;">No carrinho</span>
          </div>
        `}).join("");const n=x(e);n.isComplete?(t.style.background="#E8F5E9",t.style.color="#2E7D32",t.textContent="✓ Todos os itens da missão foram conferidos e validados!"):(t.style.background="#FFF3E0",t.style.color="#B96A46",t.textContent=`Atenção: faltam itens (${n.missingItems.map(o=>y[o]?.name||o).join(", ")}). Você pode concluir assim mesmo ou continuar procurando.`),this.checkoutModal.hidden=!1}openSummaryModal(e){this.checkoutModal.hidden=!0,document.getElementById("summary-items-count").textContent=`${e.inventory.length}`,document.getElementById("summary-help-count").textContent=`${e.helpCount}`,this.summaryModal.hidden=!1}toggleControlsHide(){this.controlsHidden=!this.controlsHidden,this.missionHud.hidden=this.controlsHidden,this.waypointBar.hidden=this.controlsHidden}}class T{state;ui;audio;scene=null;appEl;constructor(){this.appEl=document.getElementById("app"),this.audio=new B,this.state=I(window.matchMedia("(prefers-reduced-motion: reduce)").matches),this.init()}async init(){this.ui=new A(this.appEl,{onSelectWaypoint:e=>this.handleWaypointSelect(e),onToggleSound:()=>this.handleToggleSound(),onToggleLowStim:()=>this.handleToggleLowStim(),onToggleCarrier:()=>this.handleToggleCarrier(),onAskHelp:()=>this.handleAskHelp(),onOpenCheckout:()=>this.handleOpenCheckout(),onOpenMissions:()=>this.handleOpenMissions(),onOpenSettings:()=>this.handleOpenSettings(),onToggleFallback:()=>this.handleToggleFallback(),onRingBell:()=>this.handleRingBell(),onConfirmCheckout:()=>this.handleConfirmCheckout(),onSaveObservation:(e,a)=>this.handleSaveObservation(e,a),onRestartMission:()=>this.handleRestartMission(),onSelectMission:e=>this.handleSelectMission(e),onPick2DItem:e=>this.handlePickItem(e),onToggleControlsHide:()=>this.ui.toggleControlsHide()});try{const e=await w("read");e&&(this.state.currentWaypoint=e.currentWaypoint,this.state.carrier=e.carrier,this.state.inventory=[...e.inventory],this.state.helpCount=e.helpCount,this.state.lowStimulation=e.lowStimulation)}catch(e){console.warn("Could not load IndexedDB snapshot:",e)}await this.setupScene(),this.setupKeyboard(),this.setupIframeProtocol(),this.syncAll(),window.parent!==window&&window.parent.postMessage({type:"ready",app:"17-ensaio-do-cotidiano"},"*")}async setupScene(){const e=document.getElementById("webgl-canvas"),a=document.getElementById("viewport-container");try{const{MarketScene:t}=await M(async()=>{const{MarketScene:n}=await import("./scene-LYygTtlB.js");return{MarketScene:n}},[],import.meta.url);this.scene=new t(a,e,{onPickItem:n=>this.handlePickItem(n),onRingBell:()=>this.handleRingBell(),onWaypointReached:n=>{l(this.state,{type:"move-waypoint",waypoint:n}),this.syncUI()}}),this.scene.setWaypoint(this.state.currentWaypoint,!0),this.scene.updateCartCarrier(this.state.carrier),this.scene.updateCartContents(this.state.inventory),this.scene.setLowStimulation(this.state.lowStimulation)}catch(t){console.warn("WebGL2 not available or scene error, enabling 2D fallback mode:",t),this.enableFallback2D()}}enableFallback2D(){this.ui.fallback2DEl.hidden=!1;const e=document.getElementById("viewport-container");e&&(e.hidden=!0)}disableFallback2D(){this.ui.fallback2DEl.hidden=!0;const e=document.getElementById("viewport-container");e&&(e.hidden=!1)}setupKeyboard(){window.addEventListener("keydown",e=>{if(!["INPUT","TEXTAREA"].includes(e.target?.tagName)){if(e.key==="h"||e.key==="H")this.ui.toggleControlsHide();else if(e.key==="Escape")this.ui.missionsModal.hidden=!0,this.ui.checkoutModal.hidden=!0,this.ui.summaryModal.hidden=!0,this.ui.settingsModal.hidden=!0,this.ui.hideSpeech();else if(e.key==="z"&&(e.ctrlKey||e.metaKey)&&!e.shiftKey)e.preventDefault(),l(this.state,{type:"undo"}),this.audio.play("drop"),this.syncAll();else if(e.key==="z"&&(e.ctrlKey||e.metaKey)&&e.shiftKey||e.key==="y"&&(e.ctrlKey||e.metaKey))e.preventDefault(),l(this.state,{type:"redo"}),this.audio.play("drop"),this.syncAll();else if(["1","2","3","4","5"].includes(e.key)){const t=["entrance","produce","pantry","bakery","checkout"][parseInt(e.key,10)-1];t&&this.handleWaypointSelect(t)}}})}setupIframeProtocol(){window.addEventListener("message",e=>{const a=e.data;if(!(!a||typeof a!="object"))switch(a.type){case"ping":window.parent.postMessage({type:"ready",app:"17-ensaio-do-cotidiano"},"*");break;case"pause":l(this.state,{type:"pause"}),this.syncUI();break;case"resume":l(this.state,{type:"resume"}),this.syncUI();break;case"restart":this.handleRestartMission();break;case"get-state":window.parent.postMessage({type:"state-reply",state:{phase:this.state.phase,waypoint:this.state.currentWaypoint,inventory:this.state.inventory,helpCount:this.state.helpCount}},"*");break}})}handleWaypointSelect(e){this.state.currentWaypoint!==e&&(this.audio.play("step"),l(this.state,{type:"move-waypoint",waypoint:e}),this.scene?.setWaypoint(e),this.syncUI(),this.persist())}handlePickItem(e){this.state.inventory.includes(e)?(l(this.state,{type:"remove-from-cart",itemId:e}),this.audio.play("drop")):(l(this.state,{type:"add-to-cart",itemId:e}),this.audio.play("pick"),this.scene&&this.scene.playFlyItemAnimation(e,()=>{this.audio.play("drop")})),this.scene?.updateCartContents(this.state.inventory),this.syncUI(),this.persist()}handleRingBell(){this.audio.play("bell"),this.scene?.ringBellAnimation(),this.ui.showSpeech('🔔 Plim! O atendente vem até o balcão: "Olá! Como posso ajudar você a conferir suas compras?"')}handleAskHelp(){const a=(p[this.state.currentMissionId]||p.market_snack).requiredItemIds.find(n=>!this.state.inventory.includes(n)),t=a&&b[a]?b[a]:b.time;l(this.state,{type:"ask-help",topic:a||"geral"}),this.audio.play("success"),this.ui.showSpeech(t),this.syncUI(),this.persist()}handleToggleCarrier(){const e=this.state.carrier==="cart"?"basket":"cart";l(this.state,{type:"set-carrier",carrier:e}),this.audio.play("pick"),this.scene?.updateCartCarrier(e),this.syncUI(),this.persist()}async handleToggleSound(){const e=await this.audio.toggle();this.state.settings.sound=e,this.syncUI()}handleToggleLowStim(){const e=!this.state.lowStimulation;l(this.state,{type:"toggle-low-stim"}),this.scene?.setLowStimulation(e),this.syncUI(),this.persist()}handleToggleFallback(){this.ui.fallback2DEl.hidden?this.enableFallback2D():this.disableFallback2D()}handleOpenCheckout(){l(this.state,{type:"checkout"}),this.handleWaypointSelect("checkout"),this.ui.openCheckoutModal(this.state),this.syncUI()}handleConfirmCheckout(){this.audio.play("success"),this.ui.openSummaryModal(this.state),l(this.state,{type:"confirm-purchase"}),this.syncUI(),this.persist()}handleSaveObservation(e,a){l(this.state,{type:"observe",opportunity:this.state.observations.length+1,actionName:"checkout_completion",result:e}),window.parent!==window&&window.parent.postMessage({type:"session-complete",app:"17-ensaio-do-cotidiano",observation:e,notes:a,inventory:this.state.inventory,helpCount:this.state.helpCount},"*"),this.persist(),this.ui.showSpeech("Registro salvo com sucesso! Você pode explorar o mercadinho ou selecionar outra missão.")}handleOpenMissions(){this.ui.missionsModal.hidden=!1}handleOpenSettings(){this.ui.settingsModal.hidden=!1}handleSelectMission(e){l(this.state,{type:"start",missionId:e}),this.scene?.updateCartContents(this.state.inventory),this.syncAll(),this.persist()}handleRestartMission(){l(this.state,{type:"reset"}),this.scene?.setWaypoint("entrance"),this.scene?.updateCartContents(this.state.inventory),this.syncAll(),this.persist()}persist(){w("write",this.state).catch(e=>{console.warn("IDB write failure:",e)})}syncUI(){this.ui.updateState(this.state)}syncAll(){this.syncUI(),this.scene?.updateCartContents(this.state.inventory),this.scene?.updateCartCarrier(this.state.carrier)}}window.addEventListener("DOMContentLoaded",()=>{new T,"serviceWorker"in navigator&&(window.location.protocol==="https:"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&navigator.serviceWorker.register("./sw.js").catch(()=>{})});export{y as P,S as W};
