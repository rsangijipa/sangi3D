# 09. Pavilhão dos Tecidos Flutuantes — Prompt de implementação de alto padrão

**Coleção:** Gestalt e expressiva  · **Verbo central:** envolver e afastar

Atue como um estúdio sênior multidisciplinar de jogos 3D web, direção artística, modelagem, física, engenharia de áudio, UX, acessibilidade e QA. Implemente uma aplicação completa e não uma landing page, cena estática ou protótipo com botões fictícios. Use os HTMLs de referência (Ateliê do Gesto Lento, Casa da Árvore das Emoções, Correio das Palavras Não Ditas e Santuário Zen) como parâmetro de acabamento, não como molde visual a copiar. O mockup de Pavilhão dos Tecidos Flutuantes orienta composição, materiais e hierarquia; reconstrua todos os elementos em 3D real. Se o mockup ainda não estiver disponível, use a direção de arte abaixo e registre a fidelidade visual como não verificada.

## 1. Conceito e fundamento
O gesto central é **envolver e afastar**. A interação física deve produzir alterações visíveis, reversíveis quando apropriado e consistentes com o estado da cena. Finalidade proposta: Expressão não verbal, proteção, proximidade e afastamento; escolher o quanto se expor e sem interpretação automática. Recurso complementar, não instrumento de avaliação validado ou promessa de resultado clínico. Escolhas subjetivas não recebem escore. Em modo acompanhado o profissional define a tarefa, registra somente observáveis e respeita pausa, recusa e encerramento.

## 2. Cena, câmera e arte
Pavilhão de arte contemporânea com grandes tecidos translúcidos suspensos, piso mineral, claraboia, arcos e faixas de seda em tonalidades naturais; luz filtrada por camadas. Câmera: câmera ao nível dos olhos olhando através de véus, tecido principal próximo ao cursor; vista superior opcional. Paleta de referência: `#DCC8B1 #B56C76 #477F80 #CCAB67 #8D799C`. Use materiais PBR com micro-relevo, sombras de contato e iluminação motivada por aberturas ou luminárias. Crie profundidade com planos de fundo reais, não textura de cenário inteiro. Objetos principais têm geometria detalhada, bordas chanfradas, juntas e pivôs coerentes. Não reutilize a identidade visual de outros projetos. Para mobile, reenquadre o objeto ativo e deixe a zona de manipulação livre da interface. Sem desfoque durante ações de precisão.

## 3. Inventário de assets
Produzir efetivamente os seguintes assets, com escala em metros, nomes estáveis, materiais, colisores, pivôs e LOD quando pertinente:
- `paineis_de_seda_e_linho` — painéis de seda e linho; classificar como interativo ou decorativo e documentar licença.
- `trilhos` — trilhos; classificar como interativo ou decorativo e documentar licença.
- `ganchos` — ganchos; classificar como interativo ou decorativo e documentar licença.
- `pesos` — pesos; classificar como interativo ou decorativo e documentar licença.
- `ventiladores_discretos` — ventiladores discretos; classificar como interativo ou decorativo e documentar licença.
- `barras` — barras; classificar como interativo ou decorativo e documentar licença.
- `tesoura_virtual` — tesoura virtual; classificar como interativo ou decorativo e documentar licença.

Modelar proceduralmente itens simples com detalhe suficiente e utilizar GLB para modelos complexos. Priorizar os objetos manipulados antes de decorar. O manifesto deve listar assets finais, tamanhos, materiais, animações, colisores e alternativas leves. Sons próprios ou licenciados, sem recursos externos obrigatórios.

## 4. Fluxo e mecânicas reais
Entrada com opção de explorar ou escolher uma atividade; demonstração pulável; controles sempre acessíveis. Implementar as ações a seguir com feedback visual contextual, áudio opcional e alternativa de teclado/toque:
1. **Escolher tecido**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
2. **Prender em trilho**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
3. **Puxar e deslocar**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
4. **Sobrepor**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
5. **Criar aberturas**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
6. **Regular vento**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
7. **Experimentar percurso**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.
8. **Restaurar configuração**. Validar pré-condições, atualizar estado serializável e animar resultado sem bloquear pausa ou saída.

Ao final, oferecer revisão, repetir, salvar explicitamente quando adequado ou sair. O modo livre não requer concluir etapas. Expor um botão de ajuda contextual em cada interação, sem pop-ups intrusivos.

## 5. Física e lógica de simulação
PBD/Verlet em grade com constraints de alongamento e cisalhamento; colisões esfera/cápsula; corte por arestas selecionadas com limite; transparência ordenada e versão leve por shader. Separe objetos visuais de colliders. Use unidades coerentes, limites de força e velocidade, amortecimento, dt limitado e passo fixo onde necessário. O gesto deve ter resposta imediata; evite simulações pesadas sem ganho visual. Implementar fallback simplificado que preserve a função central, não só aparência. Para mecanismos determinísticos, não usar física geral desnecessariamente. Reinício, undo e replay devem restaurar o estado físico, não apenas a UI.

## 6. Modos e conteúdo
Livre; instalação colaborativa; percursos entre véus; desenho de espaços; contemplação. O modo guiado apresenta demonstrações, pistas graduais e opção de pular. O modo acompanhado oferece configuração de complexidade, número de oportunidades, modalidades de instrução e apoios pertinentes; não exigir tarefas ABA onde o recurso é expressivo. Quando houver objetivo observável, distinguir ação independente, com ajuda, não realizada e recusada; não inferir função psicológica pela escolha. Disponibilizar no mínimo 3 configurações iniciais realmente distintas para os modos estruturados, mais editor simples quando fizer sentido; nenhum tempo coercitivo. Exemplo de convite aberto: “O que você percebe quando experimenta outra forma de envolver e afastar?”

## 7. Interface e estados
HUD próprio: **Tecido / Vento / Aproximar · Afastar · Sobrepor / Vista geral**. Barra Imersiva compacta; painel contextual de ferramentas recolhível; controles de áudio, qualidade, câmera, pausa e saída. Desktop 1920×1080 e 1280×720; mobile 390×844 e 360×640 com bottom sheet e safe-area. Texto pt-BR, contraste e foco visível; ícones com rótulos. Diferencie seleção, ação disponível, ação em andamento, resultado e recuperação de erro. Não usar a imagem de referência como UI clicável.

Estado mínimo: `version`, `seed`, `mode`, `phase`, `settings`, `sceneState`, `history`, `observations` opcionais. Definir tipos específicos para as entidades citadas nas mecânicas, comandos idempotentes e validações de domínio; separar estado de renderização. Persistência voluntária e exclusão clara; sem dados sensíveis remotos. Exportar resumo observável seletivo e captura da criação quando pertinente; não gerar relatório interpretativo.

## 8. Aceite específico obrigatório
Tecido mantém pontos de fixação; soltar produz balanço amortecido; corte não destrói outros painéis; modo movimento reduzido congelável. Para cada critério, criar pelo menos um teste de interação automatizado e uma verificação visual. Exercitar ações extremas, pausa durante simulação, alternância de modo, undo/redo, reset confirmado e resize. Capturar estado inicial, ação principal, resultado e celular. Compare o mockup com screenshots reais, sem confundir conceito com implementação comprovada.

## 9. Ordem de produção
1. Inventariar repositório e dependências locais; identificar módulos reutilizáveis.
2. Implementar vertical slice do verbo central com asset principal final e câmera correta.
3. Completar os assets, simulação, regras e modos; adicionar conteúdo e estados de erro.
4. Polir luz, som, animações e interface; testar acessibilidade e touch.
5. Medir desempenho, implementar níveis de qualidade e verificar sessões repetidas.
6. Gerar build, documentação, manifesto, capturas e relatório real de QA. Integrar ao launcher somente com os contratos de eventos validados.

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

