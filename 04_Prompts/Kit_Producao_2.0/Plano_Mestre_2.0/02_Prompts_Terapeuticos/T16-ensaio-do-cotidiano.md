# T16 — Ensaio do Cotidiano | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: preparar e percorrer. Dependência: navegação/narrativa.
- Assets prioritários: supermercado, corredores, produtos, caixa, pictogramas.
- Mecânica: Navmesh, lista editável, NPCs e fila; imprevistos opcionais e dial sensorial.
- Aceite específico: Preparar lista, encontrar, pedir ajuda, esperar e pagar ficha; testar item em falta opcional.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 16. ENSAIO DO COTIDIANO

Categoria: Habilidades sociais e cotidiano
Público: 5+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 22 × 16 × 4.5 m, supermercado realista modular.
Câmera: FOV 65° em modo pessoa, altura 1,4–1,65 m conforme perfil; overview FOV 38° em (14,9,18).
Paleta e iluminação: prateleiras brancas, pisos cinza-quente, produtos coloridos mas agrupados, teto difuso.

## MAPA ESPACIAL DOS OBJETOS
Entrada em (0,0,7). Quatro corredores paralelos no eixo Z em X=-7,-2,3,8. Checkout com esteira no fundo direito (8,0,-7). Balcão de informação à esquerda (-9,0,-7); depósito parcialmente visível atrás. Corredores com largura mínima visual 1,8m.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Carrinho com rodízios, cestinha, vinte tipos de produtos reutilizando modelos base e rótulos fictícios, prateleiras com volumes instanciados, refrigeradores com portas e gôndolas, caixa, esteira e sinalizações HTML de navegação.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Piso vinílico roughness 0,65; prateleiras metal pintado; caixa de papel com fibras; frutas com roughness variável, embalagens brilhantes moderadas; iluminação fluorescente simulada por áreas de luz com sombra pré-computada.

## INTERAÇÕES, REGRAS E FEEDBACK
Explorar em primeira pessoa ou vista elevada, selecionar lista visual, localizar produtos, pedir informação, esperar na fila, finalizar compra simulada sem valores reais e praticar mudanças inesperadas configuráveis; sem exposição obrigatória a multidões/ruídos.

## ÁUDIO
Refrigeração e murmúrios em volume baixo, opção silêncio total, sem sustos e sem anúncios automáticos.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js pointer lock somente desktop com alternativa joystick touch; navegação em malha/navmesh, NPCs com caminhos curtos, instancing e occlusion culling; estados por tarefas.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Supermercado contemporâneo 3D muito realista em perspectiva aérea três-quartos, entrada e quatro corredores organizados de prateleiras com produtos fictícios, área de caixa no fundo direito com esteira, balcão de informação à esquerda, carrinho e iluminação de teto difusa, texturas PBR, sem marcas comerciais, sem nomes legíveis, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 17/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Simulador de situações cotidianas para planejar passos, encontrar objetos, pedir ajuda e realizar escolhas. Mercadinho como cenário principal e extensões de biblioteca e preparação de mochila. Sessão 5–15 min, sem pressão de tempo.
### Cena, câmera e assets
Mercadinho acolhedor em primeira pessoa guiada: prateleiras de madeira dos dois lados, frutas vermelhas/verdes, bananas, laranjas, potes com grãos, sacos, cestas, carrinho metálico verde, passadeira musgo, balcão com caixa, campainha e placa de informação, pendentes verdes e janela ao fundo. HUD “Encontrar os itens”, cartões de maçã/arroz/pão, “Ver lista”, “Pedir ajuda”, botões luz/som/repetir, etapa 3/6. Câmera perspectiva 45–55° com movimentação por pontos (não FPS livre obrigatório), mobile reenquadra corredor e itens visíveis. Assets `market_interior`, `shelf_modules`, `apple_set`, `banana_set`, `orange_set`, `rice_bag/jar`, `bread_set`, `beans`, `milk`, `soap`, `cart` com rodas, `basket`, `checkout`, `register`, `info_sign`, `cashier_npc`, `pendant_lamp`, `rug`, `door`, `bag`; extensões `library_shelf/book_set`, `backpack/study_items`. Objetos selecionáveis com nomes e ícones reais, não hotspots invisíveis.
### Dinâmica completa
1. Escolher missão (compra de 3 itens como mockup, compra de 5, biblioteca, mochila; pelo menos seis missões entre variantes). 2. Revisar lista pictográfica e escolher carrinho/cesta; ajustar brilho e som antes de começar. 3. Navegar por corredor/pontos e selecionar produtos; item entra no carrinho, lista marca encontrado; opção desfazer. 4. Pedir ajuda por cartão: “Onde está o arroz?”, “Preciso de um tempo”, “Não encontrei”; NPC oferece indicação visual ou acompanha, sem penalizar. 5. Conferir lista, escolher ir ao caixa, lidar opcionalmente com item indisponível (substituir, retirar ou pedir ajuda), confirmar compra simbólica sem dinheiro real. 6. Revisar passos, finalizar ou refazer. Níveis com 2–5 itens e mudanças anunciadas; nenhum cronômetro obrigatório.
### Lógica, física e interação
`mission{requiredIds,optionalAlternatives,waypoints}`, `inventory[]`, `cartSlots[]`, `availableItems[]`, `currentWaypoint`, `helpCount`, `step`. Caminho em navmesh simplificada/grafo, colisores de prateleira, carrinho segue câmera ou posição por spline e rodas giram conforme distância. Picking por ID, impedir duplicação de produto único e checar quantidade quando missão exigir múltiplos. Item anima até slot com curva; checkout compara multiconjunto da lista e itens permitidos; produto extra pode ser removido ou aceito em modo livre. Ajuda destaca local com caminho e texto, nunca desloca sem confirmação. Controle luz altera exposição limitada e som ambiente opcional; repetir instrução via texto/narração. Navegação com clique, setas ou botões acessíveis, sem câmera acelerada.
### Critérios específicos
Missão maçã/arroz/pão usa objetos reais e lista sincronizada; pelo menos 6 missões jogáveis, com 3 contextos; item indisponível tem alternativas válidas; carrinho não atravessa estantes; pedir ajuda, voltar, desfazer e concluir funcionam; modo de baixa estimulação e navegação sem gestos funcionais.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 16 · ENSAIO DO COTIDIANO — Plano de execução
Porte **XL** · Onda 4 (último) · 5+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Antecipar o passo a passo reduz o imprevisto — e o imprevisto também pode ser treinado, aos poucos, sob controle de quem treina.** O supermercado virtual permite preparar a ida, percorrer os corredores, pedir informação, esperar na fila e "pagar" sem valor real, com os estímulos regulados.
- Âncoras: **estrutura visual e previsibilidade** (TEACCH — *o que fazer, quanto, quando termina, o que vem depois*); exposição **graduada** como princípio (sempre com mediação do terapeuta); treino de atividades de vida diária; supermercados virtuais em reabilitação (formato).
- **Não afirma:** terapia de exposição sem acompanhamento; nenhum "nível adequado" de multidão ou ruído; sem diagnóstico, sem tempo-alvo.
- **Controle sensorial é central:** sem multidão nem ruído obrigatórios.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Supermercado contemporâneo modular**: prateleiras brancas, piso cinza-quente, teto difuso |
| Verbo | **Preparar-se e percorrer** |
| Assinatura técnica | **Primeira pessoa / vista elevada** + **lista visual** + **navmesh** + 20 produtos instanciados + **dial sensorial** (densidade e ruído 0–3) + **mudanças configuráveis** |
| Chrome | **Wayfinding**: placas de corredor, setas, **bloco de lista com pictogramas** |
| Tipografia | Lexend (desenhada para leitura) — única família, com pictogramas |
| Luz/grade | Fluorescente difusa simulada por **áreas de luz + AO pré-computado**; cores de produto agrupadas |
| Áudio-assinatura | Refrigeração e murmúrios **muito baixos**; silêncio total opcional |
| Artefato | "Passo a passo da compra" (checklist visual) |
| **Não pode parecer** | Cidade (13); museu/loja de texturas (04) |

## 3. Jornada
1. **Preparar:** escolhe a **lista visual** (pictogramas de 5–7 itens) e o **dial sensorial** (padrão: **zero** pessoas e **zero** ruído).
2. **Entrar** (0,0,7): vista elevada de reconhecimento e depois **primeira pessoa**, ou toque-para-ir.
3. **Localizar** itens nos corredores; os cartazes sobem de cor suave quando perto.
4. **Pedir informação** no balcão (diálogo curto, repetível); **esperar na fila** (curta e configurável).
5. **Finalizar** com ficha simbólica de "pagar" (**sem valores**); fecha o passo a passo.
6. Opcional: **mudança inesperada** configurável (item em falta, corredor interditado, caixa trocado), por níveis.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `entrada` | (0,0,7) | portas automáticas, tapete |
| `corredor_1..4` | X=−7, −2, 3, 8 (eixo Z) | **largura visual ≥ 1,8 m** |
| `checkout` + `esteira` | (8,0,−7) | caixa de papel, esteira |
| `balcao_info` | (−9,0,−7) | atendimento |
| `deposito` | atrás | parcialmente visível |
| `refrigeradores`, `gondolas` | laterais | portas, vidro |
| `produtos` | prateleiras | **20 tipos** reaproveitando modelos-base; **rótulos fictícios** (formas/cores/pictogramas, sem texto) |
| `carrinho`, `cestinha` | entrada | rodízios |
Câmera: **pessoa** FOV 65° altura 1,4–1,65 m (perfil) · **overview** FOV 38° (14,9,18).

## 5. Sistemas
- **Navegação:** *pointer lock* **somente desktop**; **joystick touch** e **toque-para-ir**; colisão por **navmesh/grade**.
- **NPCs** (poucos): rotas curtas, *idle*; densidade 0–3.
- **Instancing:** 1 `InstancedMesh` por tipo de produto; prateleiras *merged*; **oclusão** por corredor.
- **Luz:** `RectAreaLight` poucos + **AO por vértice pré-computado**; sem sombras dinâmicas de muitas fontes.
- **Tarefas como estados:** lista → localizar → balcão → fila → pagar → sair.
- **Mudanças inesperadas** como *regras* (parametrizadas, nunca automáticas).
- **Conforto de movimento:** *head bob* desligado por padrão; FOV ajustável; opção de **somente vista elevada**.

## 6. Interface, bordas e ilustrações
- **Placas de corredor** penduradas (SVG com pictograma + número); setas de wayfinding no piso (decals).
- **Bloco de lista** de papel com pictogramas e **caixinha de marcar**, que também aparece na cena como cartão da mão.
- **Moldura:** barra de **cesto** (alça) na base com status "itens: 3/6".
- Ilustrações: **pictogramas de produto** (fruta, pão, leite, sabonete…) próprios, consistentes, **sem marcas**.

## 7. Áudio
Refrigeração e murmúrio em volume baixo, controles de **densidade** e **ruído** separados; **silêncio total** opcional; **sem sustos e sem anúncios automáticos**.

## 8. Acessibilidade, conforto, ética
- Todo percurso tem **versão em lista** ("Ir para o corredor 2"); alternativa sem 3D de primeira pessoa.
- **Mudanças inesperadas** só quando o terapeuta/usuário liga; níveis nomeados.
- Sem pontuação; "levou X minutos" **só se pedido**.
- Enjoo de movimento: vista elevada e teleporte (toque-para-ir).

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Listas, pictogramas, diálogos do balcão, mudanças e níveis | Aprovado |
| **E1** Blocking | Planta, corredores, checkout, câmeras | Validador; captura; **larguras ≥ 1,8 m** |
| **E2** Hero | Gôndolas, refrigeradores, caixa/esteira, carrinho, 20 produtos | GLB; instancing; orçamento |
| **E3** Luz + assinatura | Luz fluorescente + AO; dial sensorial visual | 60 fps desktop com 4 corredores |
| **E4** Mecânica | Lista, navegação, balcão, fila, pagar, mudanças | Vitest: navmesh sem colisão atravessando; estados de tarefa |
| **E5** Interface | Wayfinding, lista, cesto, pictogramas | Contraste; teclado |
| **E6** Áudio | Refrigeração/murmúrio | Pico ≤ teto; silêncio total funciona |
| **E7** Segurança | Joystick, vista elevada, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
**Maior escopo da série** (por isso é o último) · desempenho em móvel (instancing + oclusão + AO baked) · enjoo em primeira pessoa · risco de "exposição sem mediação" (documentar uso com terapeuta).


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
