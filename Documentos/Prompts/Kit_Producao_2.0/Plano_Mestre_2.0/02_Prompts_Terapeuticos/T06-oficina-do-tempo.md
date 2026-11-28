# T06 — Oficina do Tempo | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: estimar e comparar. Dependência: tempo/mecânica.
- Assets prioritários: relógio, ampulheta, ponteiro fantasma, cartões.
- Mecânica: Relógio monotônico, previsão editável e comparação descritiva; tarefa real fora do jogo; pausa configurável.
- Aceite específico: Prever, medir, pausar e comparar durações; sem penalidade.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 06. OFICINA DO TEMPO

Categoria: Atenção, planejamento e funções executivas
Público: 7+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 10 × 8 × 4 m, ateliê de relojoaria.
Câmera: FOV 39°, câmera (8,5.5,9) olhando para (0,1,0).
Paleta e iluminação: madeira caramelo, latão envelhecido, granito cinza-quente, luz âmbar.

## MAPA ESPACIAL DOS OBJETOS
Bancada principal 3,6 × 0,95 m em (0,0,0), tampo Y=0,85. Parede de fundo Z=-4 com seis relógios diferentes. Torre de ampulhetas à esquerda (-3,0,-2). Quadro de cronograma deslocado à direita (3,1,-3). Prateleiras com engrenagens em altura variada.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Relógio analógico grande desmontável, ponteiros com pivôs, três ampulhetas de durações visuais distintas, peças de engrenagem, cartões de tarefas móveis, mostrador de previsão vs duração, pequeno metrônomo opcional.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Madeira com poros e veios; engrenagens com latão metalness 0,85 roughness 0,38; vidro de ampulheta, areia simulada por shader e partículas simples; papéis com bordas e fibras; feltro das bandejas.

## INTERAÇÕES, REGRAS E FEEDBACK
Escolher tarefa, estimar duração em relógio, iniciar e pausar cronômetro com controle visível, comparar previsão com duração real, montar uma sequência de etapas, inserir intervalos e antecipar transições; sem ranking ou pressão de velocidade.

## ÁUDIO
Tique-taque e metrônomo desligados por padrão; feedback sonoro opcional e suave.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js; relógios por Transform de ponteiros, animação procedural, estado persistido em IndexedDB; não dependente de física.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Oficina de relojoeiro 3D realista e aconchegante vista três-quartos, grande bancada central de madeira caramelo com mecanismo de relógio e ferramentas minúsculas, seis relógios variados na parede, três ampulhetas de vidro à esquerda, cronograma em painel à direita, engrenagens de latão e luz lateral âmbar, microtexturas altamente detalhadas, sem palavras, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 05/17** | Anexe `mockup.png` e `mockup-variante-2.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Planejar uma tarefa, estimar duração, realizar uma sequência e comparar estimativa com tempo real ativo. Trabalhar percepção temporal e organização sem pressionar velocidade. Dois mockups representam a mesma oficina: relógio analógico de duração e display digital alternável.
### Cena, câmera e assets
Oficina de madeira com janela ensolarada, relógio grande de moldura de carvalho, mostrador creme, ponteiro verde e trilha pontilhada cinza; mochila de feltro à esquerda, engrenagens, ferramentas, livros, vasos e relógios menores. HUD “Comparar os tempos”, “Previ 4 min”, “Levou 6 min”, “Ver sequência”, “Refazer”, etapa 4/5. Versão digital com números 06:00 grandes e placa de couro no painel: oferecer alternância analógico/digital, não criar dois jogos. Assets `clock_body`, `clock_face`, `hand_actual`, `hand_estimate`, `clock_stand`, `backpack` com aba, `book`, `pencil_case`, `bottle`, `notebook`, `gear_set`, `task_cards`, `tool_shelf`. Câmera frontal 40°; relógio dominante à esquerda, mobile centralizado acima do HUD. Relógio de duração com escala explícita de 0–12 min ou 0–60 min e legenda; não confundir posições de horas com minutos de relógio comum.
### Dinâmica completa
1. Escolher tarefa: organizar mochila, arrumar mesa, separar materiais ou ordenar rotina (mínimo quatro). 2. Estimar duração por dial, botões ±30 s ou campo numérico, sem resposta obrigatória. 3. Executar 3–6 passos em 3D (selecionar objetos, arrastar para mochila/caixa, fechar); iniciar/pausar relógio ativo, oferecer dica ou reordenar. 4. Comparar duração prevista e medida em arcos proporcionais, números mm:ss e diferença neutra; exemplos 4/6 min somente para demo, jamais hardcode resultado. 5. “Ver sequência” reproduz as ações registradas com passos e tempos; refazer com outra previsão ou finalizar. Modo livre e modo acompanhado permitem ocultar cronômetro durante execução e usar tarefa externa com início/fim manual.
### Lógica, física e interação
Relógio monotônico `performance.now()` acumulado exclusivamente em estado RUNNING; pausa, aba oculta e modal não contam; restaurar sessão interrompida como pausada. `estimateMs`, `activeElapsedMs`, `taskId`, `steps[{id,doneAt}]`, `clockMode`, `scaleMaxMs`. Ponteiros representam duração sobre escala rotulada, 360°×duração/escala, escala cresce se ultrapassar limite; digital formata mm:ss ou hh:mm:ss. Objetos encaixam em slots físicos de mochila; arrasto no plano da mesa, snap, colisores simples; aba abre por dobradiça e só fecha quando usuário confirma, sem bloqueio frustrante. Comparar com mensagens “levou mais/menos/igual ao previsto” sem julgamento, não converter em nota.
### Critérios específicos
Teste com estimativa 4 min e duração simulada 6 min mostra +2 min corretamente; relógio pausa sem acumular intervalo de aba oculta; digital e analógico concordam; quatro tarefas realmente distintas e replay da sequência; sem corrida contra o relógio.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 06 · OFICINA DO TEMPO — Plano de execução
Porte **L** · Onda 2 · 7+ e adultos · Atenção, planejamento e funções executivas

## 1. Tese
**O tempo é invisível; a oficina o torna objeto.** A pessoa prevê quanto uma tarefa leva, faz a tarefa na vida real, e compara — sem nota, sem relógio apressando.
- Âncoras: falácia do planejamento (Kahneman & Tversky, 1979); estimativa de tempo prospectiva × retrospectiva (Block & Zakay); intenções de implementação (Gollwitzer, 1999); apoios visuais ao tempo descritos na literatura de funções executivas (p.ex. Barkley).
- **Não afirma:** diagnóstico de TDAH, "cegueira ao tempo", ou capacidade de estimar. Sem ranking nem pressão de velocidade.
- O app **não mede a tarefa por conta própria**: a tarefa é na vida real ("arrumar a mochila"); o relógio apenas registra o que a pessoa dispara/pausa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Ateliê de relojoaria** de madeira caramelo, latão, granito |
| Verbo | **Estimar → medir → comparar** |
| Assinatura técnica | **Movimento de relógio funcional** (trem de engrenagens com razões reais) + **ampulheta de areia** (shader de nível + fio de partículas) + **ponteiro-fantasma** da previsão |
| Chrome | **Bisel de latão** e gravação *guilloché*; botões de coroa |
| Tipografia | Cinzel (numerais romanos, gravura) + EB Garamond |
| Luz/grade | Âmbar lateral, sombras longas, latão envelhecido |
| Áudio-assinatura | Tique-taque e metrônomo **desligados por padrão** |
| Artefato | "Previsto × Levou" por tarefa (sem ranking) |
| **Não pode parecer** | Estação (05, também engrenagens); torre (07) |

## 3. Jornada
1. Escolhe uma **tarefa** (cartão: "arrumar a mochila", "escovar os dentes", ou cria a sua).
2. **Estima** arrastando um arco-sombra sobre o relógio grande (previsão).
3. Inicia o cronômetro (**visível ou oculto**, escolha dela/dele); pode **pausar**.
4. Ao terminar, o **ponteiro real** encontra o **fantasma** da previsão; a oficina mostra a diferença **descritivamente** ("levou um pouco mais / bem perto / bem menos").
5. Monta uma **sequência** de etapas com intervalos e escolhe **avisos de transição** (ampulheta quase vazia).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `bancada_principal` | (0,0,0) 3,6×0,95; tampo y=0,85 | madeira com poros e veios |
| `relogio_grande` | sobre a bancada | **desmontável**: caixa, mostrador, ponteiros com **pivôs**, mecanismo visível |
| `parede_relogios` | Z=−4 | **seis relógios diferentes** (pêndulo, cuco, digital de lâminas, sol, solar, de parede simples) |
| `torre_ampulhetas` | (−3,0,−2) | **3 ampulhetas** de durações visuais distintas |
| `quadro_cronograma` | (3,1,−3) | cartões de tarefas móveis; DOM para texto |
| `prateleiras_engrenagens` | variadas | latão 0,85/0,38 |
| `metronomo` (opcional), `mostrador_previsao_duracao` | bancada | |
Câmera FOV 39°, (8,5.5,9)→(0,1,0).

## 5. Sistemas
- **Engrenagens com razões corretas** (minutos:horas = 12:1, escape/pêndulo ilustrativo) — animação procedural por transformações.
- **Ampulheta:** fração de nível por duração configurável; fio de areia em partículas; **não** é fonte de verdade do tempo (o tempo vem do relógio do sistema).
- **Estimativa → medição → comparação:** `TarefaRegistro { nome, previsto_s, real_s, pausas }`; diferença descrita em faixas amplas e **neutras**.
- **Sequência de etapas:** arrastar cartões; inserir intervalo; aviso de transição configurável (X min antes).
- **Persistência:** IndexedDB; exportar.
- Opção **"não mostrar o tempo enquanto faço"**.

## 6. Interface, bordas e ilustrações
- **Moldura de bisel** circular em torno do relógio-controle; botões com **gravação** e coroa (clique-gire para ajustar).
- Cartões de tarefa como **etiquetas de oficina** (papel com bordas e fibras).
- Ilustrações: **corte técnico do mecanismo** (SVG) que explica "um minuto = 60 segundos = uma volta do ponteiro" sem texto longo.
- Painel "Previsto × Levou" com **dois arcos concêntricos** (previsto fantasma, real sólido).

## 7. Áudio
Tique-taque e metrônomo opcionais, volume baixo, frequência baixa (sem agudos); toque suave de **"sineta"** ao fim, sempre desativável.

## 8. Acessibilidade, conforto, ética
- Linguagem sem julgamento ("levou mais **do que eu previa**", nunca "atrasou").
- Alternativa numérica para o arco; teclado ajusta em passos de 1 min.
- Sem comparações entre pessoas; sem meta de velocidade.
- Para crianças 7+: ampulhetas coloridas como apoio; adulto configura as durações.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Tarefas-exemplo, vocabulário neutro de comparação | Aprovado |
| **E1** Blocking | Bancada, parede, torre, quadro, câmera | Validador; captura |
| **E2** Hero | Relógio desmontável, 6 relógios, 3 ampulhetas, engrenagens | Pivôs de ponteiros; GLB |
| **E3** Luz + assinatura | Âmbar, ampulheta com areia, **ponteiro-fantasma** | Fantasma e real convergem corretamente |
| **E4** Mecânica | Estimar, cronometrar, comparar, sequenciar, avisos | Vitest: razões de engrenagem, diferença prevista×real, pausa não perde tempo |
| **E5** Interface | Bisel, cartões, corte técnico | Contraste; teclado |
| **E6** Áudio | Tique-taque/metrônomo/sineta | Desligados por padrão; pico ≤ teto |
| **E7** Segurança | IndexedDB, retenção, baixo desempenho (areia sem partículas) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Tempo real × animação (usar `performance.now()` e relógio do sistema, nunca frames) · aba em segundo plano (compensar por timestamps) · ansiedade com cronômetro visível → opção oculta.


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
