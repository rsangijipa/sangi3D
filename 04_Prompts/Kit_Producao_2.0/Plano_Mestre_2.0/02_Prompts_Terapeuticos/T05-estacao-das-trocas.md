# T05 — Estação das Trocas | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: embarcar por regra. Dependência: regras/navegação.
- Assets prioritários: passageiros, vagões, quadro split-flap, bilhetes.
- Mecânica: FSM de regras anunciadas, arraste com snap, retorno suave e trilhos por spline.
- Aceite específico: Trocar de regra com aviso; erro retorna sem punição; opção de pista.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 05. ESTAÇÃO DAS TROCAS

Categoria: Atenção, planejamento e funções executivas
Público: 5–14

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 26 × 16 m, estação ferroviária miniatura.
Câmera: FOV 35°, câmera (17,14,20) mirando (0,0,0).
Paleta e iluminação: tijolo vermelho queimado, cobre envelhecido, trilhos escuros, concreto claro, trens coloridos discretamente.

## MAPA ESPACIAL DOS OBJETOS
Três plataformas paralelas correm no eixo Z em X=-6,0,6. Edifício da estação com relógio central em (0,0,-6). Sala de espera no canto esquerdo (-10,0,-5); painéis de regras junto à margem frontal Z=7. Três trilhos se estendem do fundo ao primeiro plano; o jogador vê todos os passageiros e carrinhos.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Torre de relógio e engrenagens aparentes, placas de plataforma sem texto em textura, vagões com portas articuladas, passageiros estilizados identificados por atributos configuráveis, bilhetes com formas, cancelas e relógios de partida.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Tijolos com variação de tonalidade e normal map; cobre oxidado metalness 0,75; aço trilho 0,9; madeira bancos roughness 0,65; pintura dos vagões roughness 0,42 e AO das junções.

## INTERAÇÕES, REGRAS E FEEDBACK
Arrastar passageiros aos vagões segundo regra mostrada em HTML; após aviso, regra muda cor → destino → tipo de bilhete; permitir tempo livre, dicas e desfazer; representar erros sem punição; registrar tentativas, necessidade de ajuda e estratégias por rodada.

## ÁUDIO
Apito baixo opcional, rodagem suave do trem, feedback discreto de encaixe; modo sem sons e sem cronômetro.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js + raycasting, snap de posições por grid, máquina de estados de regras, GSAP para trem, sem necessidade de física completa.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Estação ferroviária miniatura 3D hiper-realista vista isométrica, edifício vitoriano em tijolo e torre de relógio no fundo, três plataformas paralelas com trens curtos coloridos, bancos, cancelas e passageiros estilizados organizáveis, engrenagens de latão e luz dourada matinal, textura PBR do aço e tijolo, legibilidade visual excelente, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 09/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Estação ferroviária de brinquedo onde regras de embarque mudam. Praticar flexibilidade, categorização e transição com pistas claras, não velocidade ou obediência. Sessão 5–12 min.
### Cena, câmera e assets
Estação com cobertura arqueada de ferro verde e vidro, relógio clássico, luminárias pendentes, plataforma de pedra, placas de destino. Trem com três vagões de feltro: verde montanha, azul praia, terracota cidade, janelas âmbar e portas de madeira articuladas. Dois personagens artesanais com mochila e bilhetes; placa suspensa “Estação das Trocas”. HUD “Nova regra”, bilhete com montanha, “Olhe o destino do bilhete”, “Ver regra”, “Embarcar”. Câmera perspectiva 40° a partir da plataforma, vagões visíveis à esquerda; mobile enquadra personagem, bilhete e vagão relevante e permite trocar visão. Assets `station_roof`, `platform`, `rail_tracks`, `train_engine`, `car_green/blue/clay`, `doors` pivot, `ticket_set` (cor, destino, forma), `signboard`, `clock`, `lamp`, `passenger_set` com idle/walk/board, `bench`, `plants`. Sons suaves de porta/rodas, apito não necessário.
### Dinâmica completa
1. Demonstração: embarcar pelo destino do bilhete (montanha, praia, cidade). 2. Rodadas simples escolhendo vagão. 3. Nova regra anunciada visualmente, ex. agora pela cor ou forma do selo, inclusive tickets em que cor e destino divergem; exibir regra sob demanda e confirmação antes de continuar. 4. Alternância gradual entre duas regras com dica, depois terceira em modo avançado; oferecer “preciso de tempo” e repetir. 5. Revisar viagens, explorar livremente e concluir. Conteúdo: ao menos 18 bilhetes e três regras, sem mudança oculta nem resposta cronometrada por padrão.
### Lógica, física e interação
Bilhete `ticket{id,color,destination,shape}`; cada vagão `car{id,color,destination,shape}` com valores únicos por regra; `ruleId` determina correspondência, gerador seed garante exatamente uma solução e balanceia conflitos. `selectCar → preview → confirm → feedback → board`; seleção inadequada não embarca, explica “Nesta viagem, olhe o destino”, permite tentar outro. NPC segue navmesh ou spline até porta; porta abre, personagem embarca sem atravessar degrau e trem desloca em trilho com aceleração suave; só anima depois de confirmar. Não exigir embarque após erro; pular ou pausar. Estado `ruleId`, `ticketId`, `selectedCar`, `round`, `transitionAnnounced`, `hints`, `attempts`.
### Critérios específicos
Conflitos cor/destino validam conforme regra ativa; cada mudança é explícita; três regras e 18 bilhetes funcionam; porta e personagem sincronizados; “Ver regra” acessível sem perder progresso; mobile permite selecionar todos os vagões.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 05 · ESTAÇÃO DAS TROCAS — Plano de execução
Porte **XL** · Onda 4 · 5–14 · Atenção, planejamento e funções executivas

## 1. Tese
**Mudar de regra é uma habilidade que se treina melhor com aviso, apoio e sem punição.** O jogador organiza passageiros segundo uma regra visível e, depois de um aviso, a regra troca (cor → destino → tipo de bilhete).
- Âncoras: o formato lembra a *Dimensional Change Card Sort* (Zelazo, Frye & Rapus, 1996) e o *Wisconsin Card Sorting* (Berg, 1948) — usados aqui **só como inspiração de mecânica**; andaimes (Wood, Bruner & Ross, 1976).
- **Não afirma:** avaliação de flexibilidade cognitiva ou de funções executivas. Sem escore, norma, tempo-alvo nem percentil.
- **Registro (descritivo):** tentativas, pedidos de ajuda e a estratégia que a criança nomeou, **por rodada**.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estação ferroviária vitoriana** em miniatura (tijolo, cobre, relógio de torre) |
| Verbo | **Embarcar conforme a regra — que muda** |
| Assinatura técnica | **Quadro de partidas *split-flap*** em DOM (as plaquinhas viram para anunciar a regra) + **desvios de trilho com alavanca** + vapor |
| Chrome | **Placas esmaltadas** com rebites de latão; menus como **bilheteria** (guichê, carimbo) |
| Tipografia | Zilla Slab (placas) + Oswald (sinalização) |
| Luz/grade | Dourada matinal; tijolo queimado e cobre oxidado |
| Áudio-assinatura | Apito **baixo** opcional + "rodagem" do trem + clique de encaixe discreto |
| Artefato | "Diário de rodadas" |
| **Não pode parecer** | Torre (07, também mecânica); porto (08); sala (06) |

## 3. Jornada
1. Plataforma tranquila; quadro *split-flap* mostra a regra: "Cor da jaqueta → vagão".
2. Arrasta os passageiros aos vagões (snap em grid); acerto = porta abre; **erro = passageiro volta à plataforma com um passo gentil**, sem som negativo.
3. **Aviso** (visual, sino opcional): "a regra vai mudar". Quadro vira para "Destino" (pictograma de estação).
4. Mais uma troca: "Tipo de bilhete" (formas: círculo, triângulo, quadrado).
5. Fecha a rodada nomeando o que ajudou ("olhei o bilhete antes", "repeti a regra").

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `plataforma_1..3` | X=−6, 0, 6 (eixo Z) | concreto claro, faixa tátil |
| `edificio_estacao` + `torre_relogio` | (0,0,−6) | tijolo c/ variação; **engrenagens aparentes**, cobre oxidado metal 0,75 |
| `sala_espera` | (−10,0,−5) | bancos de madeira 0,65 |
| `paineis_regras` | margem frontal Z=7 | placas **sem texto na textura**; texto no DOM |
| `trilho_1..3`, `trem_1..3` | do fundo ao 1º plano | aço trilho 0,9; vagões com **portas articuladas**, pintura 0,42 + AO nas juntas |
| `passageiro_*` | plataformas | atributos configuráveis: cor, destino, bilhete (forma) |
| `cancelas`, `relogios_partida` | trilhos | animação simples |
Câmera FOV 35°, (17,14,20)→(0,0,0). O jogador **vê todos os passageiros e vagões**.

## 5. Sistemas
- **RuleEngine** (máquina de estados JSON): regras plugáveis; sequência configurável por você (quando troca, quantas rodadas, se há aviso, dicas, tempo livre).
- **Dicas em escada:** 1) destaca o atributo da regra; 2) destaca o grupo; 3) mostra um exemplo resolvido.
- **Desfazer** ilimitado; **sem cronômetro** por padrão.
- **Trem:** tween (GSAP ou próprio) com aceleração suave; sem física.
- **Passageiros:** geometria estilizada (corpo + cabeça + cartão), 3 poses distintas; diversidade de aparência sem estereótipo.
- **Estado:** `rodadas.json`.

## 6. Interface, bordas e ilustrações
- **Quadro split-flap** DOM com animação de "virar" (CSS 3D), som opcional de cliques baixos.
- Placas esmaltadas (SVG) com **rebites e quinas arredondadas**; ícones de destino desenhados como **pictogramas ferroviários**.
- **Bilheteria:** menu "Opções" como guichê com cartões de bilhete (formas) que explicam as regras.
- Moldura: **janela de vagão** em madeira com latão.

## 7. Áudio
Apito curto e grave (opcional), rodagem em loop suave, "clique" de cancela, **sem sons de erro**. Modo **sem sons e sem cronômetro** garantido.

## 8. Acessibilidade, conforto, ética
- Arrastar tem **alternativa**: selecionar passageiro e vagão por botões/teclado.
- A regra sempre **visível e verbalizada** (texto + pictograma); nunca só cor.
- Aviso de troca **antes** (nunca surpresa), configurável a 0 para quem quiser treinar surpresa.
- Resultados descritivos; **sem "acertou x%".**

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Regras, pictogramas, textos de dica e de aviso | Aprovado |
| **E1** Blocking | Plataformas, trilhos, edifício, câmera | Validador; captura |
| **E2** Hero | Estação, torre com engrenagens, trem/vagões com portas, passageiros | Pivôs de porta; GLB; orçamento |
| **E3** Luz + assinatura | Luz dourada, vapor, **split-flap** | Quadro vira em sincronia com a regra |
| **E4** Mecânica | RuleEngine, snap, dicas, desfazer, diário | Vitest: cada regra valida corretamente; troca só após aviso; desfazer restaura estado |
| **E5** Interface | Placas, bilheteria, moldura | Contraste; teclado |
| **E6** Áudio | Apito/rodagem/clique | Pico ≤ teto |
| **E7** Segurança | Sem cronômetro, anônimo, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Passageiros sobrepostos no mapa (aumentar hitboxes, agrupar na plataforma) · dificuldade de rodada (parametrizar, nunca adaptar sozinho) · **todos veem tudo** no enquadramento, calibrar altura/FOV.


---
# Contrato de produção 2.0 — obrigatório

**Precedência:** este contrato define tecnologia, privacidade e aceite. As decisões específicas 2.0 do projeto prevalecem sobre versões antigas de conteúdo. As referências preservadas orientam cena e identidade, não impõem stack antiga, dimensões não confirmadas ou funcionalidades incompatíveis. Em caso de conflito não resolvido, registre e preserve o comportamento existente até validação. Não declare implementação ou teste sem evidência.

## 1. Arquitetura e entrega
- Inventariar repositório e executar baseline antes de editar; preservar rota, slug, integrações e funcionalidades existentes. Trabalhar em branch própria; migração incremental, rollback e snapshots de estados reais. Não sobrescrever outros jogos.
- Vite + TypeScript estrito + Three.js WebGL2, versão compatível fixada no lockfile após teste de API. React Three Fiber somente se host já for React e se não houver dois renderers. Dependências, fontes, decoders e assets locais; nenhum CDN em runtime. Não presumir acesso a caminhos Windows. Se disponíveis, reutilizar `engine.ts`, `pbr.ts`, `effects.ts`, `model.ts`, `audio.ts` e Barra Imersiva; senão implementar equivalentes, não alegar cópia.
- Separar `game/{state,content,rules}.ts`, `scene/`, `input/`, `audio/`, `ui/`, `assets/`, `tests/`; módulo de cena lazy-load com init, resize, pause, resume, dispose. Um estado serializável e comandos únicos; simulação determinística onde útil. Não persistir objetos Three. Entregar código, package.json/lockfile, README, manifestos, testes, build estático e relatório.
- HTML legado: manter entrada compatível, permitir exportar build estático para subdiretório; distribuição em pasta HTML+assets local é padrão. Arquivo HTML único só como export adicional quando realmente viável (bibliotecas/asset embutidos e testados). `file://` não é pressuposto; documentar servidor HTTP. Offline após instalação/cache validado, com service worker versionado, fallback e teste sem rede.
- Integração: rota ou iframe isolado, eventos `ready`, `pause`, `resume`, `complete`, `exit`, `summary` versionados e origem permitida. Não enviar textos ou dados pessoais por padrão. Launcher com id, título, categoria, descrição, entrada, thumbnail própria, capabilities e status.

## 2. Motor e identidade
- Núcleo invisível comum; cada projeto preserva verbo, paleta, composição, materiais, tipografia e ferramentas contextuais do mockup aprovado. Não reaproveitar tema visual por conveniência. Reconstruir em 3D real, nunca imagem inteira clicável. Coordenadas originais são propostas; calibrar com referência real. Se mockup faltar, usar texto e declarar fidelidade visual não verificada.
- Pipeline: WebGLRenderer + EffectComposer quando suportado, alvo HalfFloat/MSAA com fallback testado, RenderPass, GTAO meia resolução só Cinema, bloom contido opcional, um pass final ACES/sRGB/gradação (sem dupla conversão). PCFShadowMap se compatível com versão; sombras sob demanda com invalidação por movimento/luz, câmera de sombra atualizada após alteração. PMREM do cenário; luz principal motivada; contato sob objetos, fachos que desaparecem perto da câmera. Sem flashes. Grão e aberração desativados por padrão; conforto prevalece.
- Cinema / Equilibrada / Leve + Automática; detectar capacidades e medir, não só nome da GPU. Orçamento inicial 3,6 / 1,15 / 0,55 MP, reduzir escala após custo sustentado acima de 24 ms e aumentar lentamente com histerese abaixo de 17 ms; Leve sem pós pesado. Pause quando aba oculta ou canvas fora de tela; recuperar contexto ou fallback DOM funcional.
- Geometria detalhada procedural para comuns; GLB para hero/rig quando justificado. Bevel, lathe, tubos afunilados, pivôs por função, metros/Y-up, IDs e colliders separados. Texturas PBR com cor sRGB e mapas de dados lineares; veios e micro-relevo, UV em metros; cache, atlas, instancing, merge estático, LOD. 512–1024 px comuns, 2k hero só com justificativa. Vidro/transparência barata em mobile; evitar transmission em Leve. Manifesto por asset: id, caminho, licença, tamanho, LOD, materiais, pivô, colisão, clips, fallback; `scene.json` com pos/rot/scale/função. Gerar modelos efetivos, não placeholders. Proveniência e licença em credits.md.

## 3. Mecânica e controles
- Ação central muda estado e cena; feedback por objeto, texto e som opcional. Raycast em hitboxes; pointer capture; separar toque de arraste, câmera e HUD; teclado e botões equivalentes. Orbit limitado; câmera não atravessa objetos. Zoom/visões nomeadas, reduz movimento e transições sem tremor. Undo/redo para criação, reset destrutivo confirmado.
- Física: usar Rapier para contatos/corpos rígidos necessários, passo fixo 1/60 s, substeps/CCD quando necessário, limite de delta após pausa; parâmetros em unidades coerentes. Mecanismos de engrenagem, trilho, dobradiça e animação guiada usam cinemática determinística se suficiente. Fluidos, tecidos, aroma e sensação tátil podem ser aproximações explícitas. Deformações locais recalculam somente região alterada; meta <6 ms por gesto medido.
- Fluxo: entrada → modo livre/guiado/acompanhado quando apropriado → demonstração pulável → interações com feedback → revisão → repetir ou sair. Pausa e saída sempre acessíveis. Não forçar completar etapas subjetivas. Estados extremos e resets devem manter consistência.

## 4. Interface, áudio e privacidade
- Barra Imersiva: cena inteira; topo compacto com título, voltar, ações, tela cheia, recolher H; Esc fecha painel; barra inferior de ferramentas; um painel contextual por vez. Mobile 100dvh, safe-area, bottom sheet, câmera reenquadrada, alvos >=44 px (48 px preferível), foco visível, contraste 4,5:1, aria-live, navegação por teclado e alternativa DOM para ações essenciais. Não copiar HUD fixo do mockup: manter textos, hierarquia e composição 3D.
- Web Audio só após gesto explícito de som; mixer/master mute, fades, compressor/limitador e teto digital conservador, polifonia limitada. Não prometer segurança auditiva baseada apenas em dBFS. Silêncio inicial e alternativas visuais. Sem microfone/câmera por padrão. Assets sonoros locais e licenciados/originais.
- Terapêuticos: convites fenomenológicos, sem diagnóstico, interpretação, benefício clínico garantido, ranking, escore subjetivo, punição ou cronômetro coercitivo. Regras objetivas podem receber feedback descritivo. Registre só observáveis e autorrelatos voluntários; significado pertence a quem cria. Mediação configurável, especialmente com crianças; evitar estímulos inesperados. Dados sensíveis em memória por padrão, persistência somente opt-in, exportação seletiva e exclusão. localStorage apenas preferências não sensíveis; IndexedDB para acervo voluntário com proteção adequada e aviso de dispositivo compartilhado. Não logar conteúdo pessoal. Sem analytics remoto.
- Comerciais: `MARCA` com nome, logoTexto, cores, fontes, textos, CTA, catálogo, dois presets (original e neutro). Re-skin também altera acentos 3D. Preservar nav/título/CTA em site; `?embed=1` oculta navegação demo. CTA por evento versionado com `tipo:'cta'`, origem validada e link configurado; evitar abertura duplicada; sem dados pessoais por padrão. Placar permitido somente entretenimento comercial não clínico, opcional. Prêmios reais dependem de sistema e regras verificados, nunca inventar emissão.

## 5. Aceite e orçamento
- Metas iniciais, não garantias: 60 fps desktop, 30 fps celular intermediário real; Intel UHD Equilibrada <=25 ms a 1280×720 na medição de referência e Cinema <=45 ms, separados de FPS sustentado; draw calls ~100 mobile / 180 desktop, triângulos ~150k / 350k, primeira cena jogável ~5 MB transferidos. Medir em dispositivo real quando disponível, registrar hardware, browser, tier, resolução, p50/p95 frame time, chamadas, tris, bytes, memória aproximada, tempo de carregamento. Explicar exceções com perfil e justificativa. Não usar FPS de aba oculta.
- Testes: unitário (FSM, regras, reset, pausa, extremos), integração (picking, toque, teclado, mute, reload, resize, context loss, dispose, persistência), Playwright 1920×1080, 1280×720, 390×844, 360×640, tablet/landscape; axe quando aplicável. Testar sessões repetidas e offline. Build/tsc limpos, sem console errors/404. Verificar acessibilidade e ausência de dados sensíveis em eventos/logs.
- Capturas: entrada, interação principal, conclusão, mobile, cada preset/visão e close-up dos hero assets. Comparar lado a lado com mockup aprovado se disponível; registrar desvios. Sem referência não declare fidelidade visual. Restaurar preferências alteradas nos testes. Entregar matriz de evidências com PASS/FAIL/NÃO TESTADO, medições reais e pendências. Só declarar pronto após critérios específicos e comuns; bloqueios não podem ser mascarados com placeholder.
