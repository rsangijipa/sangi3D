# T12 — Ilha das Pausas | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: escolher pausa. Dependência: câmera/efeitos.
- Assets prioritários: farol, chalé, gramado, garça, deck, jardim.
- Mecânica: Adotar mapa da planilha: farol respirar, chalé descansar, gramado alongar, deck desenhar, jardim escolher; câmera por spline e saída livre.
- Aceite específico: Visitar cinco espaços, pular qualquer atividade, parar respiração e retornar sem ranking.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 12. ILHA DAS PAUSAS

Categoria: Emoções e autorregulação
Público: 4+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 55 × 45 m, ilha costeira com 5 espaços.
Câmera: FOV 35°, câmera (33,25,40) mirando (0,0,0).
Paleta e iluminação: azul acinzentado, vegetação oliva, areia quente, branco da espuma, madeira clara.

## MAPA ESPACIAL DOS OBJETOS
Ilha central elíptica 32 × 22 m, farol baixo ao norte em (0,0,-12), chalé de descanso em (-10,0,0), espaço de movimento em (10,0,0), deck de expressão em (-5,0,8), jardim de escolhas em (6,0,9). Caminhos sinuosos unem áreas sem bifurcação confusa; mar circunda por 10 m de cada lado.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Pedras de passagem, chalé, rede sem oscilação obrigatória, almofadas, farol, banco, árvores costeiras, papéis e lápis virtuais, mobiliário do deck e placas simbólicas sem textos na textura.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Terreno com mistura de areia/grama via vertex color, água shader simples com normal e espuma por decal, madeiras satin, fibras das almofadas e rochas rugosas; nuvens estáticas opcionais.

## INTERAÇÕES, REGRAS E FEEDBACK
Selecionar atividade de pausa, respirar com guia opcional sem retenção forçada, desenhar, alongar com personagem não impositivo, ouvir ou desligar mar, escolher espaço de descanso, registrar estratégia que ajudou ou não.

## ÁUDIO
Ondas e vento em canais independentes, mudo por padrão se preferência do usuário exigir; sem música obrigatória.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js, spline para câmera guiada, múltiplos pontos de interesse, render sob demanda, sketch canvas 2D integrado ao deck.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Ilha de refúgio terapêutico altamente realista em diorama 3D, enseada com água calma, farol baixo na ponta norte, chalé de madeira à esquerda, deck criativo diante da praia, espaço aberto para movimento à direita, jardim de caminhos de pedra, vegetação costeira, iluminação de fim de tarde suave, sem texto, sem pessoas, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 07/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Pequena ilha navegável que oferece atividades de pausa escolhidas livremente. Apoiar identificação de necessidades e experimentação de estratégias de descanso, sem impor respiração ou prometer regulação. Sessão 2–15 min ou sair quando quiser.
### Cena, câmera e assets
Costa de pedras com mar azul e reflexo do pôr do sol, farol de pedra branca com cúpula terracota e luz dourada, cabana com janela acesa, caminho sinuoso de pedras, gramado, árvore grande, flores, garça e mesa de desenho na varanda. Painel “Respirar no farol”, ícones de inspirar/expirar, “No seu ritmo”, “Começar”, “Escolher outra pausa”, etapa 2/6. Câmera perspectiva 45° contemplativa, farol central-esquerda, mobile recua para manter caminho e farol. Assets `island_terrain`, `lighthouse`, `lantern`, `cabin`, `wood_deck`, `drawing_table`, `paper_pencils`, `rock_set`, `path_tiles`, `flower_set`, `tree`, `heron`, `ocean_surface`, `bench`, `hammock`. Água com ondas suaves e reflexo aproximado, céu crepuscular estático em mobile, iluminação quente.
### Dinâmica completa
1. Escolher entre farol (respirar naturalmente), mesa (desenhar), banco (escutar/observar), cabana (silêncio), rede (descanso visual). 2. Farol: começar voluntariamente, luz cresce/diminui devagar como convite, pode seguir ritmo próprio ou ignorar; sem retenção respiratória. 3. Atividade selecionada: desenhar em tela com paleta/borracha, ouvir mar/pássaros só se opt-in, observar objetos ou reduzir estímulos. 4. Escolher continuar, trocar ou parar a qualquer momento. 5. Opcionalmente indicar “como estou agora?” com palavras livres/ícones e possibilidade não responder. 6. Encerrar por escolha e exibir resumo neutro de pausas exploradas. Não exigir terminar seis etapas para sair.
### Lógica, física e interação
Hotspots no caminho e navegação por seleção; câmera segue spline com easing, opção corte sem movimento. Farol alterna emissão em ciclo ajustável suave (exemplo 3–5 s por fase, sem contagem compulsória); botão parar congela/desativa ciclo. Ondas procedurais leves, folhas com movimento lento, garça com idle; tudo desativável. Desenho em canvas 2D mapeado a folha, undo/clear, export somente por ação; áudio fade e mute. Estado `activity`, `phase`, `durationActive`, `motionEnabled`, `audioEnabled`, `drawingStrokes`, `optionalCheckIn`. Pausa sempre distingue interrupção do cronômetro e atividade de descanso.
### Critérios específicos
Cinco locais interativos com ações diferentes, não simples troca de título; respiração sem exigência ou retenção; nenhuma atividade bloqueia saída; sem áudio/movimento automático não solicitado; desenho pode ser apagado; farol preserva clima visual sem flashes.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 12 · ILHA DAS PAUSAS — Plano de execução
Porte **XL** · **Onda 1 (piloto)** · 4+ e adultos · Emoções e autorregulação

## 1. Tese
**Pausar é uma habilidade com repertório: cada pessoa descobre o que a ajuda, e isso muda.** A ilha oferece cinco espaços, cada um com uma forma de pausar; no fim, a pessoa registra o que ajudou.
- Âncoras: modelo de processo da regulação emocional (Gross, 1998: escolha da situação, deslocamento da atenção, modulação da resposta…); **ambientes restauradores** (Kaplan & Kaplan — Teoria da Restauração da Atenção; Ulrich, 1984); respiração lenta **sem retenção**; automonitoramento ("o que ajudou?").
- **Não afirma:** tratamento de ansiedade, mede frequência cardíaca, garante calma. Nenhuma estratégia é "a certa".
- **Diferença do acervo:** é a **única cena de mar com câmera guiada** e **cinco atividades locais** (lago e santuário são contemplativos de um ponto só).

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Ilha costeira** de refúgio, fim de tarde |
| Verbo | **Escolher a pausa** |
| Assinatura técnica | **Câmera em spline** entre 5 pontos de interesse + **farol que "respira"** (luz lenta, opcional) + água com espuma por decal |
| Chrome | **Seixos arredondados** como botões, bordas em **ondas de areia** |
| Tipografia | Quicksand (curta) + Lora (texto longo) |
| Luz/grade | Azul acinzentado, oliva, areia quente, espuma branca; sol baixo |
| Áudio-assinatura | **Ondas e vento em canais independentes** |
| Artefato | **Diário de pausas** (o que ajudou: *ajudou · mais ou menos · não ajudou · não sei*) |
| **Não pode parecer** | Porto (08); arquipélago (18); lago existente |

## 3. Jornada
1. Chegada de **câmera guiada** (curta, pulável) sobre a enseada; a pessoa **escolhe um espaço**.
2. **Farol — respirar:** a luz do farol sobe e desce devagar (padrão ajustável, p.ex. 4 s / 6 s, **sem retenção**); pode ouvir o mar ou desligar.
3. **Chalé — descansar:** rede parada (oscilação opcional), almofadas, luz baixa; silêncio por tempo escolhido, ou sem tempo.
4. **Espaço de movimento — alongar:** uma **garça estilizada** convida a alongar; pode ignorar.
5. **Deck de expressão — desenhar:** papel e lápis virtuais; o traço aparece no papel do deck.
6. **Jardim de escolhas:** cartões neutros de estratégia ("ouvir o mar", "olhar para 5 coisas", "beber água") — escolhe e, depois, **registra o que ajudou**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `ilha` | elíptica 32×22 | areia↔grama por **vertex color** |
| `farol` | (0,0,−12) | baixo, ao norte |
| `chale_descanso` | (−10,0,0) | madeira satin; rede, almofadas |
| `espaco_movimento` | (10,0,0) | gramado aberto; garça |
| `deck_expressao` | (−5,0,8) | mesa, papel e lápis |
| `jardim_escolhas` | (6,0,9) | caminho de pedras com cartões |
| `caminhos` | sinuosos | sem bifurcação confusa |
| `mar` | 10 m ao redor | shader simples + normal; espuma por decal |
| `nuvens`, `arvores_costeiras`, `pedras` | espalhados | estáticas |
Câmera FOV 35°, (33,25,40)→(0,0,0). **Render sob demanda**.

## 5. Sistemas
- **Câmera guiada:** `CatmullRomCurve3` com 5 pontos + transições; **modo livre** (OrbitControls limitado); reduzir movimento = **cortes**.
- **Farol respira:** emissivo/luz com período configurável ≥ 8 s; **sem flashes**; opção de desligar.
- **Atividades** como módulos independentes (respiração, descanso, alongar, desenho, escolhas).
- **Desenho:** `canvas` 2D → textura do deck; salvar PNG local (com consentimento).
- **Diário:** `{ estrategia, data?, ajudou }`; **sem somas** nem "estratégia favorita".
- **Estado:** `pausas.json`.

## 6. Interface, bordas e ilustrações
- Menu em **seixos** (botões grandes, arredondados, textura de pedra lisa); moldura **ondulada de areia** (SVG).
- **Mapa-ilha** ilustrado (nanquim + aquarela) como seletor dos cinco espaços.
- Cartões de estratégia em **papel salgado de praia**, ilustrações de linha (ouvido, olhos, copo).
- Guia de respiração: **anel que expande** (nunca contador de tempo agressivo).

## 7. Áudio
**Ondas e vento em canais separados**; mudo por padrão quando a preferência exigir; sem música obrigatória; legenda sonora "[ondas suaves]".

## 8. Acessibilidade, conforto, ética
- Todos os cinco espaços acessíveis por **lista e teclado**; descrição de cena em texto.
- **Nenhuma retenção** de ar; respiração é **convite**, com saída fácil.
- Criança 4+: menus com **desenho** e poucos cartões; adulto ajusta.
- Sem promessa terapêutica; sem desfecho "você está calmo".

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Textos dos 5 espaços, cartões de estratégia, padrões de respiração | Aprovado |
| **E1** Blocking | Ilha, mar, 5 locais, caminhos, spline | Validador; captura |
| **E2** Hero | Farol, chalé, deck, garça, jardim de pedras, árvores | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Fim de tarde, água, espuma, farol que respira | 60 fps desktop **sob demanda** |
| **E4** Mecânica | Atividades, câmera guiada, desenho, diário | Vitest: spline/POIs; desenho gera PNG; diário persiste |
| **E5** Interface | Seixos, ondas, mapa-ilha | Contraste; teclado |
| **E6** Áudio | Ondas/vento | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho, portão do adulto | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Cena grande em móvel (LOD + sob demanda) · água cara (tier) · garça animada (rig simples, poucos ossos) · tentação de "meta" de respiração (evitar).

> **Piloto:** valida **água, spline de câmera, cena grande sob demanda, módulos de atividade** e o modo infantil.


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
