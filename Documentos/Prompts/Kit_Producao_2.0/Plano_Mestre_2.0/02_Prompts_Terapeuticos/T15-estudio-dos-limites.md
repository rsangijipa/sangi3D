# T15 — Estúdio dos Limites | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: ensaiar situação. Dependência: narrativa.
- Assets prioritários: palco, cadeiras, cortina, cartões, personagens.
- Mecânica: Roteiros editáveis, escolha de tom/distância, saída sempre disponível; respostas sem nota.
- Aceite específico: Ensaiar dizer não, pedir ajuda, sair; fechar cortina a qualquer momento.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 15. ESTÚDIO DOS LIMITES

Categoria: Habilidades sociais e cotidiano
Público: 8+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 12 × 9 × 6 m, palco de ensaio intimista.
Câmera: FOV 42°, câmera (7,5,11) mirando (0,1.5,0).
Paleta e iluminação: madeira natural, cortina vinho desaturado, preto fosco, luz âmbar.

## MAPA ESPACIAL DOS OBJETOS
Palco ocupa fundo Z=-2..-4,5 e mede 7 m de largura, 0,4 m de altura. Duas cadeiras frente a frente em (-1,0,-2) e (1,0,-2). Cortinas nas extremidades X=±4,5, sobre trilhos. Área de escolha e feedback no proscênio Z=3. Camerazinha lateral para observar alternativas.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Duas cadeiras de madeira, cortinas pesadas com vincos, luzes de teatro com barn doors, tapete, cartões de roteiro em HTML e manequins/personagens com rig básico e gestos neutros.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Veludo da cortina com sheen 0,55 e normal de dobra; madeira cadeira roughness 0,6; ferro grafite 0,75; piso de carvalho com AO nas tábuas.

## INTERAÇÕES, REGRAS E FEEDBACK
Escolher cenários e nível de complexidade, ensaiar dizer não, fazer um pedido, negociar ou sair da conversa, selecionar alternativas verbais/não verbais, repetir cena sem pontuação ou pressão; modo roteiro criado pelo terapeuta.

## ÁUDIO
Falas legendadas opcionais, ruído de palco desligado por padrão; respostas podem ser lidas em vez de ouvidas.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js + AnimationMixer e blend simples de gestos, roteiros em árvore JSON, captura de escolhas textuais sem gravar voz.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Pequeno teatro de ensaio 3D hiper-realista e intimista, palco de madeira com duas cadeiras frente a frente, cortinas de veludo vinho escuro nas laterais, refletores discretos âmbar e plateia vazia em primeiro plano, atmosfera acolhedora e não dramática, detalhes de tecido, sem pessoas reais, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 14/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Pequeno palco para ensaiar comunicação de limites, pedidos de espaço, recusas e encerramento de interações. Não estabelecer distância universal ou tom “correto”; respeitar escolha, segurança e autonomia. Sessão 4–12 min.
### Cena, câmera e assets
Palco arredondado de madeira, cortinas vinho com amarras de corda, três refletores de latão, duas cadeiras de madeira estofadas creme, cavalete com papel “Prefiro parar por aqui.”, seta de distância entre cadeiras, estante com livros, luminária cogumelo, lápis e planta. HUD “O que e como dizer?”, botões “Suave”, “Firme”, distância sugerida com setas, “Ensaiar”, “Fechar cortina”, etapa 3/5. Câmera frontal levemente elevada; mobile mantém palco inteiro e painel inferior. Assets `stage`, `curtain_left/right` com rig ou shape keys, `spotlights`, `chair_A/B`, `easel`, `phrase_card`, `distance_indicator`, `shelf`, `plant`, `basket`, `lamp`, `optional_puppet_set`. Textos DOM ancorados, sem palavras baked em texturas.
### Dinâmica completa
1. Escolher uma situação: toque não desejado, conversa longa, pedir espaço, empréstimo de objeto, pressão para participar, barulho (mínimo seis, situações neutras). 2. Escolher frase pronta, pictograma, frase própria ou não responder. 3. Ajustar distância entre cadeiras em cinco posições e estilo de apresentação suave/firme (sem equivaler firme a agressivo). 4. “Ensaiar” mostra texto e opcionalmente áudio pré-gravado da frase; adulto pode representar interlocutor, sem gravação. 5. Fechar cortina a qualquer momento para parar; reabrir só com consentimento; revisar opções e sair. Oferecer “Preciso de ajuda” quando limite não é respeitado, sem simulação de coerção intensa.
### Lógica, física e interação
Cadeiras deslizam simetricamente em eixo X com limites e colisão simples, indicador acompanha distância em unidades simbólicas; valores são preferências, não regras sociais. Cortina fecha com duas metades seguindo spline/rig em 600 ms; trava entrada de ensaio quando fechada, cancela áudio e retorna opções de saída/reabrir. Frase e tom alteram somente texto/áudio pré-programado, não julgamento. `scenario`, `phraseId`, `customPhrase`, `tone`, `distanceStep`, `curtainState`, `rehearsalCount`; teclado e modo de comunicação por cartões; feedback “Você pode escolher como comunicar seu limite”.
### Critérios específicos
Seis contextos e múltiplas frases por contexto; distância muda realmente o palco e não só indicador; cortina interrompe ensaio e áudio; opção de não falar não bloqueia conclusão; nenhum tom é pontuado como superior; modo sem áudio permite ensaio completo.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 15 · ESTÚDIO DOS LIMITES — Plano de execução
Porte **L** · Onda 3 · 8+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Dizer "não", pedir e sair de uma conversa são gestos que se ensaiam num ambiente seguro, com repetição e sem plateia.** O estúdio é um palco pequeno onde a pessoa escolhe cenário e complexidade, ensaia opções verbais e não verbais e repete quantas vezes quiser.
- Âncoras: treino de assertividade (Alberti & Emmons, 1970); ensaio comportamental; estrutura opcional de cartões inspirada em **DEAR MAN** (Linehan, 1993 — oferecida como *apoio*, não como regra); **distância estética** do teatro e do psicodrama (Landy; Moreno).
- **Não afirma:** que assertividade seja meta universal; sem pontuação; sem pressão; sem "melhor resposta".
- **Segurança:** **não é para reencenar situações traumáticas**; o botão **Sair da cena** está sempre disponível; o **modo roteiro do terapeuta** controla o conteúdo.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Teatro de ensaio intimista** de madeira e veludo |
| Verbo | **Ensaiar uma cena** |
| Assinatura técnica | **Cartões de roteiro** (DOM, aspecto datilografado) + opções **verbais** e **não verbais** (tom, distância, postura) + **cortina de veludo** com pregas em shader + **câmera lateral** para observar alternativas |
| Chrome | **Proscênio com ribalta** e **roteiro datilografado** |
| Tipografia | Courier Prime (roteiro) + Gloock (títulos) |
| Luz/grade | **Âmbar** com *barn doors*, preto fosco, cortina vinho desaturado |
| Áudio-assinatura | Falas **legendadas**; ruído de palco **desligado**; respostas podem ser **lidas** |
| Artefato | "Roteiro ensaiado" (árvore de escolhas, sem voz gravada) |
| **Não pode parecer** | Teatro de fantoches (17); cidade (13); museu (14) |

## 3. Jornada
1. Na plateia vazia, escolhe um **cenário** (recusar um convite, fazer um pedido, negociar, sair de uma conversa) e **nível** (1 a 3).
2. As duas cadeiras acendem; o **cartão de roteiro** apresenta a fala do outro personagem.
3. Escolhe **o que dizer** (cartões de frase) e **como** (tom suave/firme, distância, postura/gesto) — ou **cria a sua frase**.
4. O outro responde conforme o ramo; **câmera lateral** mostra a mesma cena de outro ângulo.
5. **Repete** sem pontuação; ou fecha a cortina (**pausa** ou **sair**).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `palco` | Z=−2→−4,5; 7 m; h=0,4 | piso de carvalho com AO nas tábuas |
| `cadeira_A` / `cadeira_B` | (−1,0,−2) / (1,0,−2) | madeira 0,6 |
| `cortina_L/R` | X=±4,5 | veludo **sheen 0,55** + normal de dobra; **sobre trilhos** |
| `luzes_teatro` | teto/laterais | **barn doors**, âmbar |
| `tapete`, `ferro_grafite` | proscênio | 0,75 |
| `proscenio` | Z=3 | área de **escolha e feedback** |
| `personagens` | 2 | manequins/figuras com rig básico, **gestos neutros** |
| `camera_lateral` | lateral | visão alternativa |
Câmera FOV 42°, (7,5,11)→(0,1.5,0).

## 5. Sistemas
- **Roteiros em árvore JSON** (cena → nós → opções) com **validador** (sempre uma saída).
- **Opções não verbais** como *cartões de parâmetros* (tom, distância, postura) que mudam **a animação e a fala exibida**, sem gravação de voz.
- **AnimationMixer** com *blend* simples de gestos (neutro, recuar, aproximar, cruzar braços, abrir mãos).
- **Nível de complexidade:** muda número de falas, relação (familiar/colega/autoridade) e comprimento.
- **Modo terapeuta:** editor de roteiro (JSON) + importação/exportação.
- **Estado:** `roteiro_ensaiado.json` — escolhas textuais.

## 6. Interface, bordas e ilustrações
- **Ribalta** como borda inferior (fileira de lâmpadas SVG com brilho suave, **sem piscar**).
- **Cartões de roteiro** em papel creme, **fonte datilografada** com margens e marcas de dobra.
- Ilustrações de **máscaras e cortinas** em linha; ícones de **tom/distância/postura** desenhados como figurinos de teatro.
- Menu "Direção de cena": cada opção é uma *marcação de palco* ("Entra", "Pausa", "Sai").

## 7. Áudio
Falas legendadas e **opcionais** (TTS local); ruído de palco desligado; **sem aplausos nem efeitos de avaliação**.

## 8. Acessibilidade, conforto, ética
- Teclado completo; leitura de cartões por leitor de tela.
- **Linguagem de ensaio, não de resultado**; nenhum retorno do tipo "você foi assertivo/a".
- **Sair da cena** retorna à plateia **sem custo**.
- Dados só locais; **sem gravação de voz**.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 cenários × 3 níveis, cartões verbais/não verbais, textos de pausa | **Aprovado por você** |
| **E1** Blocking | Palco, cadeiras, cortinas, proscênio, câmera | Validador; captura |
| **E2** Hero | Cadeiras, cortinas com pregas, luzes, personagens com rig | GLB; orçamento |
| **E3** Luz + assinatura | Âmbar, cortina em shader, ribalta | Cortina anima sem recorte; sem flicker |
| **E4** Mecânica | Árvore de roteiros, opções não verbais, repetir, câmera lateral, editor | Vitest: validador de roteiro; **repetir** reseta |
| **E5** Interface | Ribalta, cartões, ícones | Contraste; teclado |
| **E6** Áudio | TTS opcional | Nada toca sozinho |
| **E7** Segurança | Sair da cena, retenção, baixo desempenho (cortina estática) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Conteúdo que desperte situação real difícil (revisão com terapeuta + saída fácil) · cortina cara em shader (tier: normal estática) · tom "dramático" (manter acolhedor, não teatral).


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
