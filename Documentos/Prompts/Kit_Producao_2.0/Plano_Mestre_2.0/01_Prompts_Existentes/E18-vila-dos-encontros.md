# E18 — Vila dos Encontros | Evolução 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Baseline e escopo
- Fonte: `ambientes-html.7z/ambientes-html/vila-dos-encontros.html` (41,005 bytes; SHA-256 `c9aca54fa4e0a2ac720cba4b38d2e30d3a38f54ca4647fe3b012c78f5c18c443`).
- IDs de controles encontrados (amostra para regressão, não prova de funcionamento): `btn-sound-toggle`, `btn-close-dialogue`, `opt-passive`, `opt-assertive`, `opt-aggressive`, `cam-square`, `cam-clara`, `cam-bento`, `cam-julia`, `btn-fountain-wish`, `btn-drawer-toggle`, `btn-close-drawer`, `btn-save-note`.
- Estado: código existente, execução não validada nesta entrega. Prioridade: piloto.
- Identidade: preservar paleta e composição existentes, reconstruir close-ups usando materiais próprios; verbo central **conversar**.
- Assets prioritários: praça, padaria, escola, parque, personagens articulados.
- Evolução mecânica e funcional: Integrar Cidade das Conversas como modo bairro; grafo de diálogos, respostas livres e opção de sair, múltiplas consequências plausíveis; retirar escore de assertividade.
- Migração: mapear handlers, estado e armazenamento atuais; escrever testes de caracterização; migrar gesto principal sem remover opções existentes; preservar/exportar dados anteriores com migração versionada e opção de rollback; não migrar automaticamente conteúdo sensível para outra finalidade.
- Aceite específico: Percorrer respostas distintas, pedir ajuda, sair e repetir; verificar ausência de classificação moral e escore.
- Entregar captura antes/depois em três enquadramentos, registro de regressões e justificativa das mudanças. 

# Modo integrado T13 — Cidade das Conversas
Preserve identidade visual própria deste modo; não substitua o ambiente antigo sem aprovação.
## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: conversar por ramos. Dependência: narrativa.
- Assets prioritários: bairro, NPCs, balões, cartões.
- Mecânica: Integrar ao E18; preservar escolha livre, pedir tempo ou sair, consequências plausíveis.
- Aceite específico: Dois ramos por cenário, resposta própria, reiniciar sem nota.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 13. CIDADE DAS CONVERSAS

Categoria: Habilidades sociais e cotidiano
Público: 7+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 50 × 36 m, bairro de 4 locais.
Câmera: FOV 37°, câmera (30,19,35) mirando (0,0,0).
Paleta e iluminação: tijolo creme, verde de árvores, asfalto azul-acinzentado e luz diurna.

## MAPA ESPACIAL DOS OBJETOS
Cruzamento central (0,0,0) com faixa de pedestre. Biblioteca em (-14,0,-10), cafeteria em (12,0,-11), praça no quadrante (-11,0,9), parada de ônibus em (13,0,8); calçadas acessíveis contornam todos os locais. A cena conserva espaço central desobstruído para balões de diálogo HTML.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
NPCs estilizados com poses corporais distintas, mesas, cadeiras, livros, máquina de venda, semáforo acessível visual, banco, bicicleta e objetos de cotidiano. Personagens com expressões sutis e diversidade de aparências sem estereótipos.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Reboco e tijolo PBR, madeira, roupa com textura de tecido, vidro de vitrines, metal pintado e pavimento com decals.

## INTERAÇÕES, REGRAS E FEEDBACK
Escolher personagem, ouvir/ler situação, selecionar resposta ou compor frase livre, simular consequências plausíveis e alternativas, permitir refazer, botão pedir ajuda e revisão com terapeuta. Não punir diferenças de contato visual, fala ou comportamento social.

## ÁUDIO
Voz por TTS opcional, legendas sincronizadas, som de ambiente suave; não exigir microfone nem registrar voz por padrão.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js com animações glTF/AnimationMixer, diálogos em grafo JSON, telas HTML acessíveis, TTS local quando compatível e modo textual equivalente.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Bairro em miniatura 3D muito realista com cruzamento e faixas acessíveis no centro, biblioteca com janelas à esquerda, cafeteria do outro lado, praça sombreada com banco, parada de ônibus e pequenos personagens amigáveis não caricatos, materiais de cidade premium, dia claro, vista isométrica, sem textos legíveis, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 12/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Cidade de miniaturas com conversas ramificadas em situações cotidianas. Praticar pedidos, esclarecimento, tempo, recusa e saída respeitosa, sem exigir contato visual, fala oral ou um estilo social único. Sessão 5–15 min.
### Cena, câmera e assets
Rua de pedra com padaria em destaque, toldo verde/creme, placa de madeira “Padaria”, vitrine de pães, balcão, potes, bolos e luz quente. Personagem jogador de costas com mochila e suéter terracota, atendente com avental e cabelo artesanal; escola, praça com balanço e ponto de ônibus visíveis atrás. Balão “Posso te ajudar?”. HUD “O que dizer?”, estágio 3/5, “Quero perguntar”, “Preciso de um tempo”, “Prefiro sair”, “Continuar”, “Refazer”. Câmera terceira pessoa fixa/sem movimento forçado, close na padaria, mobile enquadra ambos interlocutores. Assets `bakery_exterior/interior`, `counter`, `bread_set`, `glass_display`, `awning`, `school`, `bus_stop`, `park`, `library`, `shop`, `avatar_set` com diversidade visual, `npc_baker` e outros NPCs, clips `idle`, `wave`, `offer`, `wait`, `walk`, `farewell`. Balão HTML ancorado em posição 3D.
### Dinâmica completa
1. Escolher local entre padaria, escola, biblioteca, praça e ponto de ônibus. 2. NPC apresenta situação e opções pictográficas/textuais. 3. Escolher pergunta/pedido, pedir tempo, sair ou digitar frase própria (não enviar a IA). 4. NPC responde conforme ramo: se pedir tempo, aguarda até usuário indicar pronto; se sair, respeita e encerra sem punição; se perguntar, oferece informação e nova escolha. 5. Rever o diálogo, trocar papel em modo acompanhado ou experimentar outro caminho. Pelo menos 3 situações por local (ex. pedir pão, perguntar preço, item indisponível; pedir material, pedir ajuda, pedir intervalo). Oferecer comunicação por símbolos, texto e narração opcional; alternativas equivalentes.
### Lógica, física e interação
Árvore declarativa `scenario{id,nodes[{id,text,choices[{id,label,nextId,effect}]}]}`; validar todos links e terminais; história de diálogo mantém `visitedNodes`, `chosenResponses`, `pauseRequested`, `exitRequested`. Texto próprio registrado como escolha livre, resposta neutra pré-programada, sem fingir interpretação semântica. NPC usa animation mixer e estados de espera/turno; sem animação labial necessária, áudio opcional com legendas. Caminho do avatar segue spline ou clique em destinos, colisores em balcão e edifícios; câmera não se move durante escolha. Refazer volta ao início do cenário com confirmação; saída pode ir ao mapa ou encerrar.
### Critérios específicos
15 cenários com ramificações reais, não respostas idênticas; pedir tempo pausa diálogo até pronto; preferir sair é sempre válido; refazer e voltar não pulam falas; legenda/símbolos funcionam sem áudio; revisão não classifica habilidade social.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 13 · CIDADE DAS CONVERSAS — Plano de execução
Porte **XL** · Onda 3 · 7+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Conversar se ensaia, e quase toda situação tem mais de um caminho válido.** O usuário escolhe um lugar e uma pessoa, lê ou ouve a situação, escolhe (ou escreve) o que dizer e vê **o que pode acontecer** — podendo refazer, pedir ajuda ou pausar.
- Âncoras: ensaio comportamental / *role-play*; histórias sociais (Gray, 1991 — evidência mista, usadas como **formato**, não como regra); **problema da dupla empatia** (Milton, 2012): o mal-entendido entre pessoas com estilos diferentes é **bidirecional**; prática afirmativa da neurodiversidade; reparo de conversa ("pode repetir?").
- **Não afirma:** avaliação de habilidades sociais, "resposta certa", comportamento "adequado". Contato visual, fala e ritmo **diferentes não são punidos nem corrigidos**.
- **Diferença dos vizinhos:** o 15 ensaia **limites** num palco; o 14 trata **perspectiva**; o 13 percorre **lugares comuns** com ramos de conversa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Bairro em miniatura** com 4 lugares (biblioteca, cafeteria, praça, parada de ônibus) |
| Verbo | **Conversar por ramos** |
| Assinatura técnica | **NPCs com rig e *AnimationMixer*** + **balões HTML ancorados na cabeça** de cada pessoa + **"ver duas possibilidades"** (dois ramos lado a lado) |
| Chrome | **Sinalização de transporte** (placas, mapa de linhas) e balões de estilos distintos |
| Tipografia | Atkinson Hyperlegible (diálogos) + Archivo (sinalização) |
| Luz/grade | Diurna clara; tijolo creme, verde de árvores, asfalto azul-acinzentado |
| Áudio-assinatura | **TTS opcional + legendas sincronizadas**; ambiente muito suave |
| Artefato | "Caminho da conversa" (sequência de escolhas) para revisar com terapeuta |
| **Não pode parecer** | Cidade-maquete de som (01); palco (15); museu (14) |

## 3. Jornada
1. Vista aérea do bairro; escolhe **um dos quatro lugares** e **uma pessoa**.
2. A câmera aproxima; a cena **pausa** e o balão apresenta a situação (texto + voz opcional).
3. Escolhe entre **3–4 respostas** (nenhuma "certa"; inclui *dizer que precisa de um tempo* e *sair da conversa*) **ou** escreve a sua.
4. Vê **o que pode acontecer** (duas ou três continuações plausíveis; não determinismo) e escolhe seguir uma.
5. **Refazer**, **pedir ajuda** (opções de reparo) ou **concluir**; no fim, "Revisão com terapeuta" mostra o caminho.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `cruzamento` | (0,0,0) | **faixa de pedestre** acessível; semáforo visual acessível |
| `biblioteca` | (−14,0,−10) | janelas, livros, mesas |
| `cafeteria` | (12,0,−11) | balcão, mesas, **máquina de venda** |
| `praca` | (−11,0,9) | banco, árvores sombreadas |
| `parada_onibus` | (13,0,8) | abrigo, banco, painel |
| `calcadas_acessiveis` | contornam | rampas, piso tátil |
| `npc_*` | por local | **poses distintas**, expressões sutis, diversidade (idades, corpos, tons, apoios de mobilidade/audição) |
| `bicicleta`, `objetos` | rua | cotidiano |
**Espaço central desobstruído** para balões HTML. Câmera FOV 37°, (30,19,35)→(0,0,0).

## 5. Sistemas
- **Grafo de diálogo em JSON** (`nó { fala, opções[], efeitos }`), com **validador**: sem becos sem saída, **sempre** há uma saída ("sair da conversa").
- **Frase livre:** o texto do usuário entra no balão como fala dele; **sem NLP/IA**; o app oferece continuações **pré-escritas** para escolher.
- **NPCs:** rig procedural (esqueleto + malha) com *idle*, *falar*, *ouvir/assentir*, *acenar*, *sentar*, *andar*; blendshapes sutis de sobrancelha/boca.
- **TTS local** (quando compatível) com legendas; **modo textual equivalente**.
- **Densidade** de pessoas em cena (0–3) e volume ambiente ajustáveis.
- **Estado:** `caminho.json` (apenas escolhas), exportável.

## 6. Interface, bordas e ilustrações
- Balões **HTML** com **caudas diferentes** por tipo: fala · pensamento *(somente se o usuário optar por "ver possibilidades")* · narração.
- **Moldura de placa de ponto de ônibus** (SVG) e **mapa de linhas** como seletor de lugar.
- Ilustração: **pictogramas de reparo** ("repetir", "tempo", "ajuda", "sair").
- Botões grandes com ícones; foco com **contorno amarelo-escuro** de alto contraste.

## 7. Áudio
Ambiente de bairro **muito suave**, com opção de silêncio; vozes por TTS (voz escolhida pelo usuário, velocidade ajustável); sem microfone **nem gravação** por padrão.

## 8. Acessibilidade, conforto, ética
- **Sem pontuação**, sem "correto/errado", sem avaliar contato visual.
- Linguagem sobre o outro: "**pode** estar pensando…" apenas como **hipótese**; opcional.
- "Pausa" congela a cena; "Pedir ajuda" nunca encerra.
- Modo terapeuta: edição do grafo e exportação do caminho.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 situações × ramos, repertório de reparo, textos; **revisão neuroafirmativa** | Aprovado |
| **E1** Blocking | Bairro, quarteirões, câmera | Validador; captura |
| **E2** Hero | 4 edifícios, praça, 8–10 NPCs com rig | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Luz diurna, balões ancorados, **duas possibilidades** | Balão segue NPC sem sobrepor outros |
| **E4** Mecânica | Grafo, validador, frases livres, refazer, ajuda | Vitest: todo nó alcança saída; export correto |
| **E5** Interface | Sinalização, balões, pictogramas | Contraste; teclado |
| **E6** Áudio | TTS + legendas | Legenda sincronizada |
| **E7** Segurança | Densidade, modo textual, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Rigs procedurais convincentes (ficar em estilo **estilizado**, não realista) · estereótipos (revisão de elenco e roteiros) · TTS variável por navegador (fallback textual).


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
