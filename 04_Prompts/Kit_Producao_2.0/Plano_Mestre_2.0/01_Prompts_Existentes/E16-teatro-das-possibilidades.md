# E16 — Teatro das Possibilidades | Evolução 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Baseline e escopo
- Fonte: `ambientes-html.7z/ambientes-html/teatro-das-possibilidades.html` (64,051 bytes; SHA-256 `6fdc395d071d1bc5be2b43ba812f0b213638295484d9b2b17385bb3bff96bb24`).
- IDs de controles encontrados (amostra para regressão, não prova de funcionamento): `btn-curtain-toggle`, `btn-light-cycle`, `btn-audio-toggle`, `btn-camera-reset`, `btn-toggle-director`, `pose-talk`, `pose-bow`, `pose-surprise`, `pose-dance`, `btn-bell`, `btn-save-shot`, `btn-close-drawer`, `btn-save-act`, `btn-play-story`, `btn-version-a`, `btn-version-b`.
- Estado: código existente, execução não validada nesta entrega. Prioridade: migração.
- Identidade: preservar paleta e composição existentes, reconstruir close-ups usando materiais próprios; verbo central **encenar**.
- Assets prioritários: palco, cortinas, fantoches, figurinos, cenários, focos.
- Evolução mecânica e funcional: Integrar Teatro das Histórias Possíveis como modo de fantoches de vara; timeline de poses, luz e cenas; replay determinístico, texto opcional.
- Migração: mapear handlers, estado e armazenamento atuais; escrever testes de caracterização; migrar gesto principal sem remover opções existentes; preservar/exportar dados anteriores com migração versionada e opção de rollback; não migrar automaticamente conteúdo sensível para outra finalidade.
- Aceite específico: Criar dois atos, editar ordem, reproduzir e exportar cena sem captar voz ou imagem por padrão.
- Entregar captura antes/depois em três enquadramentos, registro de regressões e justificativa das mudanças. 

# Modo integrado T17 — Teatro das Histórias Possíveis
Preserve identidade visual própria deste modo; não substitua o ambiente antigo sem aprovação.
## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: dar vida e gravar. Dependência: animação.
- Assets prioritários: fantoches de vara, cenário papel, ribalta, timeline.
- Mecânica: Integrar E16 com estética de papel recortado preservada como modo próprio.
- Aceite específico: Criar poses e dois momentos, editar luz, replay e saída sem gravação de pessoas.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 17. TEATRO DAS HISTÓRIAS POSSÍVEIS

Categoria: Expressão simbólica e narrativa
Público: 3+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 11 × 9 × 7 m, teatro de fantoches e cenário trocável.
Câmera: FOV 40°, câmera (8,5.5,11) mirando (0,2,0).
Paleta e iluminação: madeira mel, veludo azul-petróleo, papel pintado, luz âmbar macia.

## MAPA ESPACIAL DOS OBJETOS
Palco central 6 × 3m e altura 1,0, com duas coxias; cortina no eixo Z=-3. Mesa de personagens fica à esquerda (-4,0,2), depósitos de cenários à direita (4,0,2). Fundo do palco recebe camadas de cenografia movíveis em três planos Z=-4, -3, -2.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Fantoches articulados de animais, pessoas e seres imaginários, árvores de papel recortado, casinhas, nuvens, pedras, barco e portas, varas de controle e três luzes de cena. Personagens com pivôs separados para cabeça, mãos e corpo.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Madeira com lascas muito discretas, papel cartão rugoso com espessura real, tecidos de veludo e feltro, cordões e pequenas fibras, pintura artesanal sem acabamento plástico.

## INTERAÇÕES, REGRAS E FEEDBACK
Arrastar personagens ao palco, manipular membros/posição, gravar sequência de estados sem vídeo do usuário, selecionar fundo, controlar iluminação, criar cenas e recomeçar; narrar via digitação/áudio local opcional e exportar roteiro com consentimento.

## ÁUDIO
Efeitos leves de palco sob demanda, trilha original opcional e silêncio permitido.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js AnimationMixer, transform controls restritos, timeline de eventos, snapshots JSON, glTF para bonecos; sem inferência psicológica sobre personagem escolhido.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Teatro de marionetes artesanal 3D hiper-realista com palco de madeira e cortina de veludo azul petróleo, cenário de papel em três camadas, personagens de madeira e feltro sobre mesa à esquerda, compartimentos com cenários à direita, luz de teatro cálida, fibras reais e pequenas irregularidades feitas à mão, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 16/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Teatro artesanal de fantoches em que usuário cria narrativas ramificadas, combina personagens e dá vida a cenas. Explorar imaginação, sequência narrativa e múltiplos finais, sem impor interpretação. Sessão 5–15 min.
### Cena, câmera e assets
Palco de madeira com moldura de feltro creme, folhas ornamentais, cortinas terracota, camadas de montanhas e árvores em feltro, lua amarela. Raposa laranja articulada com rebites e pássaro azul em varetas, elementos de cenário recortados. HUD “Dar vida”, três miniaturas de cena, etapa 3/5, “Gravar cena”, “Assistir”. Câmera frontal quase ortográfica, preservar textura e profundidade de teatro de papel, mobile palco acima de timeline. Assets `puppet_stage`, `curtains`, `forest_backdrop`, `mountain_layers`, `moon`, `fox_puppet` com pivôs de braços/cauda, `bird_puppet` com asas, `rabbit`, `bear`, `turtle`, `tree`, `props` (ponte, casa, flor, caixa), `backdrop_set` (floresta, praia, vila), `puppet_rod`, `thumbnail_camera`. Feltro com bordas finas, sombras entre camadas, animação stop-motion suave opcional.
### Dinâmica completa
1. Selecionar cenário e 1–3 personagens. 2. Montar início, meio e fim com cartões de ação (chegar, cumprimentar, procurar, esperar, ajudar, mudar caminho, despedir). 3. “Dar vida”: arrastar fantoche em palco ou escolher movimentos; registrar keyframes/eventos da cena ao apertar “Gravar cena”; parar e regravar. 4. “Assistir” reproduz timeline, permite pausar e escolher final alternativo; editar e desfazer. 5. Rever história em três a seis cenas e salvar arquivo JSON ou exportar vídeo do próprio canvas se navegador suportar, explicitamente sem microfone/câmera; alternativa storyboard em PNG. Modo acompanhado com turnos opcionais de adulto/criança, modo livre sem narrativa prescrita.
### Lógica, física e interação
Plano do palco X/Y com trilhos de varetas e limites; fantoches em camadas Z discretas para evitar interpenetração, articulações limitadas (braços ±70°, asas ±45°, cauda ±35°). `story{backdrop,characters,scenes[{durationMs,events[{t,actor,action,position}],caption}]}`, timeline monotônica, keyframes interpolados, seed para efeitos. Gravação captura eventos locais do jogo, não dados pessoais; `MediaRecorder` de canvas somente mediante clique, detectar suporte e fallback storyboard; replay reproduz estado inicial, não grava de novo. Miniaturas renderizadas da cena real em baixa resolução; máximo 6 cenas e 30 s por cena configurável. Áudio de efeitos e narração opcional, sem captação de voz.
### Critérios específicos
Três cenários, cinco fantoches, ações e finais diferentes; replay mantém sequência e posições; gravar/parar/regravar funcionam sem câmera/mic; timeline editável e miniaturas coerentes; modo livre e história com final alternativo completos; exportar só quando suportado, fallback funcional.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 17 · TEATRO DAS HISTÓRIAS POSSÍVEIS — Plano de execução
Porte **XL** · Onda 3 (primeiro da onda) · 3+ e adultos · Expressão simbólica e narrativa

## 1. Tese
**Uma história contada por fantoches cria distância suficiente para dizer o que, em primeira pessoa, seria difícil — e liberdade suficiente para brincar.** A pessoa monta o palco, dá vida aos personagens, grava a sequência e conta.
- Âncoras: brincar não diretivo (Axline, 1947); **o brincar como espaço de experiência** (Winnicott, 1971); fantoches em terapia e educação (Bernier & O'Hare, 2005); **externalização narrativa** (White & Epston, 1990).
- **Não afirma:** que personagem, cor, cenário ou final escolhido "signifiquem" algo; **sem inferência psicológica** de nenhum tipo, sem projetivo, sem análise de enredo.
- **Diferença do 15:** o 15 é ensaio **com roteiro**; o 17 é **criação livre**, sem cena prescrita.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Teatro de marionetes artesanal** de madeira mel e veludo azul-petróleo |
| Verbo | **Dar vida e gravar a história** |
| Assinatura técnica | **Fantoches de vara articulados** (cabeça, mãos, corpo com pivôs) + **cenário em 3 camadas de papel** com *parallax* + **linha do tempo gravável de estados** (sem vídeo) |
| Chrome | **Boca-de-cena de papel recortado** (festões) e **programa de teatro** |
| Tipografia | Fraunces (títulos) + Patrick Hand (texto do usuário) |
| Luz/grade | Âmbar macio; papel pintado; irregularidade de feito à mão |
| Áudio-assinatura | Efeitos de palco **leves e sob demanda**; trilha original **opcional**; silêncio permitido |
| Artefato | "Roteiro da história" (linha do tempo + narração digitada), exportável **com consentimento** |
| **Não pode parecer** | Teatro de ensaio (15); casa de memórias (20) |

## 3. Jornada
1. Vê o palco vazio, a **mesa de personagens** à esquerda e os **depósitos de cenários** à direita.
2. **Arrasta** personagens ao palco; **muda de cenário** (3 camadas: fundo, meio, frente).
3. **Manipula** cabeça, mãos e posição com as varas (alças).
4. **Controla a luz** (3 luzes de cena).
5. **Grava** estados na linha do tempo (cada "cena" = um estado), **narra** por digitação (ou áudio local opcional) e **assiste** à peça; recomeça quando quiser.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `palco` | 6×3 m, h=1,0 | madeira com lascas discretas; **duas coxias** |
| `cortina_Z−3` | eixo Z=−3 | veludo azul-petróleo |
| `camada_cenario_1..3` | Z=−4, −3, −2 | **papel cartão rugoso com espessura real** |
| `mesa_personagens` | (−4,0,2) | madeira |
| `depositos_cenarios` | (4,0,2) | compartimentos |
| `fantoche_*` | mesa/palco | **animais, pessoas, seres imaginários**; madeira/feltro |
| `arvores_papel`, `casinhas`, `nuvens`, `pedras`, `barco`, `portas` | camadas | recortes pintados |
| `varas_controle`, `luzes_cena` | palco | 3 luzes |
Câmera FOV 40°, (8,5.5,11)→(0,2,0).

## 5. Sistemas
- **Fantoches:** hierarquia `corpo → cabeça`, `mão_L/R` com **pivôs separados**; poses por *AnimationMixer* + alças restritas (*transform controls limitados*).
- **Camadas de cenário:** troca por "gaveta"; *parallax* sutil com a câmera.
- **Linha do tempo:** lista de **estados** `{ personagens[], poses, camadas, luz, narracao }`; reprodução com interpolação suave.
- **Sem gravação de vídeo nem de voz**; áudio local só se o usuário optar.
- **Exportação:** JSON/Markdown **com consentimento**; apagar tudo.
- **Estado:** `historia.json`.

## 6. Interface, bordas e ilustrações
- **Boca-de-cena** de papel recortado (SVG, camadas, sombras de papel) como **moldura** do canvas.
- **Programa de teatro** (ficha com título editável) como painel de linha do tempo; **ingressos** como botões de cena.
- **Ilustrações de personagens** (miniaturas desenhadas) nos cartões da mesa.
- Controles **grandes** para 3+; adulto vê opções avançadas.

## 7. Áudio
Efeitos leves (passos de papel, vento de cortina, gotas) **sob demanda**; trilha original gerada, em loop calmo, **opcional**; silêncio como padrão.

## 8. Acessibilidade, conforto, ética
- Todas as ações por **botões** (adicionar/remover/mover) além do arrastar.
- Descrição `aria-live` da cena ("Coelho entrou à esquerda; luz âmbar").
- **Nada é interpretado.** O app apenas registra posições e texto.
- Crianças 3+: portão do adulto para exportar/configurar.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Elenco (animais/pessoas/seres), cenários, nomenclatura neutra | Aprovado |
| **E1** Blocking | Palco, mesa, depósitos, 3 camadas, câmera | Validador; captura |
| **E2** Hero | Palco, 8–10 fantoches, 8 cenários de papel, varas | GLB; pivôs; orçamento |
| **E3** Luz + assinatura | Âmbar macio, papel com espessura, *parallax* | Camadas sem *z-fighting* |
| **E4** Mecânica | Arrastar, articular, camadas, luz, linha do tempo, exportar | Vitest: gravar→reproduzir devolve **os mesmos estados**; exportar só com consentimento |
| **E5** Interface | Boca-de-cena, programa, ingressos | Contraste; teclado |
| **E6** Áudio | Efeitos e trilha | Nada toca sozinho; pico ≤ teto |
| **E7** Segurança | Portão do adulto, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Articulação por toque (alças grandes + modo por botões) · peso de muitos fantoches (instancing nas camadas de fundo) · tentação de "ler" o enredo (remover qualquer análise).


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
