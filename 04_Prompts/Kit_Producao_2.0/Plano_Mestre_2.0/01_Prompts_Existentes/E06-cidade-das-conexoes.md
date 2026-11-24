# E06 — Cidade das Conexões | Evolução 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Baseline e escopo
- Fonte: `ambientes-html.7z/ambientes-html/cidade-das-conexoes.html` (31,129 bytes; SHA-256 `3e8d62bfee1daeb5abb0ce054fbb3c1d32d2535798e1f1543b6427caedf851eb`).
- IDs de controles encontrados (amostra para regressão, não prova de funcionamento): `btn-sound-toggle`, `toggle-bridge-1`, `toggle-bridge-2`, `toggle-bridge-3`, `btn-day-mode`, `btn-sunset-mode`, `cam-iso`, `cam-canal`, `cam-park`, `cam-avenue`, `btn-bell`, `btn-drawer-toggle`, `btn-close-drawer`, `btn-save-note`.
- Estado: código existente, execução não validada nesta entrega. Prioridade: migração.
- Identidade: preservar paleta e composição existentes, reconstruir close-ups usando materiais próprios; verbo central **conectar**.
- Assets prioritários: bairros, canais, pontes modulares, ilhas, personagens, barreiras.
- Evolução mecânica e funcional: Integrar Arquitetura dos Vínculos como modo construtor; grafo navegável, encaixe e remoção de pontes, circulação sem cruzar água; implementar gravação real.
- Migração: mapear handlers, estado e armazenamento atuais; escrever testes de caracterização; migrar gesto principal sem remover opções existentes; preservar/exportar dados anteriores com migração versionada e opção de rollback; não migrar automaticamente conteúdo sensível para outra finalidade.
- Aceite específico: Construir e remover conexão; rota responde ao grafo; salvar, recarregar e apagar sem inferência psicológica.
- Entregar captura antes/depois em três enquadramentos, registro de regressões e justificativa das mudanças. 

# Modo integrado T18 — Arquitetura dos Vínculos
Preserve identidade visual própria deste modo; não substitua o ambiente antigo sem aprovação.
## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: construir pontes. Dependência: construção.
- Assets prioritários: ilhas, pontes, encaixes, barreiras.
- Mecânica: Integrar E06; modo arquipélago e pontes modulares; significado atribuído pelo usuário.
- Aceite específico: Adicionar/remover ponte e observar conexões; exportação voluntária.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 18. ARQUITETURA DOS VÍNCULOS

Categoria: Expressão simbólica e narrativa
Público: 7+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 42 × 32 m, arquipélago metafórico de ilhotas.
Câmera: FOV 35°, câmera (26,20,32) mirando (0,0,0).
Paleta e iluminação: água azul acinzentada, areia bege, árvores verde musgo, pontes de madeira.

## MAPA ESPACIAL DOS OBJETOS
Ilha principal em (0,0,0) de raio 4, cinco ilhas menores posicionadas (-12,0,-7), (12,0,-6), (-14,0,8),(12,0,10),(0,0,13). Água rasa percorre toda a base; pontos de encaixe permitem adicionar ilhas. Pontes inicialmente desconectadas são construídas manualmente entre píeres.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Ilhas com elevação, casas simples, árvores, pedras, pontes articuladas/segmentadas, embarcações pequenas, marcadores de vínculos como objetos abstratos personalizáveis; nenhum símbolo obrigatório.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Terra e rocha com pintura por vértice, água shader leve, madeira tábuas roughness 0,82, argila das casas e vegetação baixa instanciada.

## INTERAÇÕES, REGRAS E FEEDBACK
Criar e nomear ilhas, adicionar pessoas/grupos/animais usando cartões abstratos, mover posições, construir ou retirar pontes, registrar significados pessoais e salvar versões; nenhuma distância ou ponte possui interpretação automática.

## ÁUDIO
Som de água e vento opcionais, sem atmosfera emocional pré-programada por escolhas.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js, snapping em pontos de ponte, splines geométricas para pontes, exportação JSON com posições e notas, screenshots com opção de anonimização.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Arquipélago poético em diorama tridimensional fotorrealista, ilha central cercada por cinco ilhas menores em água azul acinzentada, pequenas casas, árvores e pontes de madeira desconectadas ou construíveis, luz suave, vegetação detalhada, composição legível vista isométrica, nenhum texto, nenhum símbolo clínico fixo, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 18 · ARQUITETURA DOS VÍNCULOS — Plano de execução
Porte **L** · Onda 4 · 7+ e adultos · Expressão simbólica e narrativa

## 1. Tese
**Relações podem ser externalizadas num espaço, e o significado do espaço é de quem o constrói.** Ilhas, pessoas, grupos e animais ganham posição; pontes são construídas — ou não — e **nenhuma distância, ponte ou ausência de ponte é interpretada pelo app**.
- Âncoras: **átomo social** e sociometria (Moreno, 1934); **modelo de comboio** (Kahn & Antonucci, 1980); **ecomapa** (Hartman, 1978) e genograma (McGoldrick) como tradições de representação; Gestalt — figura/fundo e fluxo de contato/retirada, como **linguagem de conversa** e não de análise.
- **Não afirma:** apego, vínculo "saudável/nocivo", isolamento, proximidade. **Sem** cálculo de distâncias, centralidade ou rede.
- **Dados de terceiros:** nomes de pessoas reais são dados pessoais de **outras pessoas** → **somente local**, com anonimização na exportação.
- **Diferença do Território dos Vínculos (caixa de areia):** aqui **não há miniaturas em bandeja**; há **ilhas e pontes construídas**, uma metáfora espacial diferente.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Arquipélago** de água rasa e azul acinzentada |
| Verbo | **Construir pontes** |
| Assinatura técnica | **Pontes por *spline* com tábuas segmentadas**, snap em píeres + **ilhas editáveis** (pintura de elevação/vértice) + **marcadores abstratos personalizáveis** |
| Chrome | **Cartões amarrados com barbante**; borda **aquarela** |
| Tipografia | Literata (texto) + Manrope (rótulos) |
| Luz/grade | Suave; água azul-acinzentada, areia bege, musgo, madeira |
| Áudio-assinatura | Água e vento opcionais, **sem atmosfera emocional pré-programada** |
| Artefato | **Versões do arquipélago** (JSON + imagem com opção de anonimizar) |
| **Não pode parecer** | Porto (08, também água); ilha de pausas (12); caixa de areia (existente) |

## 3. Jornada
1. Vê a **ilha principal** e **cinco ilhas** à deriva; nenhuma ponte.
2. **Cria e nomeia** ilhas (ou renomeia as existentes); coloca **cartões abstratos** (pessoa, grupo, animal, lugar, outro) com **forma, material e tamanho escolhidos por ela/ele**.
3. **Move** ilhas e cartões; **constrói** pontes entre píeres (ou nenhuma); pode retirá-las.
4. **Registra** o que cada posição ou ponte significa **para si**.
5. **Salva versões** e as compara (sobreposição transparente).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `ilha_principal` | (0,0,0) r=4 | elevação, casa simples, árvores |
| `ilha_2..6` | (−12,0,−7) · (12,0,−6) · (−14,0,8) · (12,0,10) · (0,0,13) | menores, editáveis |
| `agua_rasa` | base inteira | shader leve com profundidade (transparência gradual) |
| `pontos_encaixe` | em volta | permitem **adicionar ilhas** |
| `pier_*` | em cada ilha | pontos de ponte |
| `ponte_*` | entre píeres | **articuladas/segmentadas** em *spline* |
| `marcadores` | sobre ilhas | formas abstratas; **nenhum símbolo obrigatório** |
| `barcos_pequenos`, `pedras`, `vegetacao_baixa` | ao redor | instanciados |
Câmera FOV 35°, (26,20,32)→(0,0,0).

## 5. Sistemas
- **Ponte:** `CatmullRomCurve3` entre dois píeres com **N tábuas** orientadas pela tangente; **snap** ao píer; remoção suave.
- **Ilhas:** *heightfield* de baixa resolução com pintura por vértice (terra/rocha/areia).
- **Cartões:** `{ id, nome, forma, material, escala, nota }`; **sem tipos obrigatórios**.
- **Versões:** `versao_n.json` com posições, notas, pontes; **comparação** por ghost.
- **Exportação/screenshot com anonimização:** nomes → iniciais/forma, notas ocultas, opção "só formas".
- **Estado:** IndexedDB; retenção; apagar tudo.

## 6. Interface, bordas e ilustrações
- **Cartões** de papel com furo e **barbante**, cada um com cor de aquarela escolhida por quem usa (sem paleta "recomendada").
- **Moldura de aquarela** (SVG com bordas de pigmento) sem desenho decorativo carregado.
- **Ilustração de ponte** em tinta e lavagem; ícone de "construir" como **mãos e tábua** (sem uma "regra" visual).
- Painel de notas com **texto ampliável**.

## 7. Áudio
Água e vento **opcionais** e neutros; **sem** música que sugira emoção; sem reação sonora a escolhas.

## 8. Acessibilidade, conforto, ética
- Construir ponte por **lista** (origem → destino) além do arrasto.
- **Nenhuma leitura automática** do arranjo; textos do app: "esta é a **sua** representação".
- "Ajuda agora" discreto (texto livre sobre relações).
- Anonimização padrão **ligada** na exportação.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário neutro, convites, textos de privacidade | **Aprovado por você** |
| **E1** Blocking | Água, 6 ilhas, píeres, câmera | Validador; captura |
| **E2** Hero | Ilhas com relevo, casas, árvores, pontes segmentadas, barcos | GLB; instancing |
| **E3** Luz + assinatura | Água rasa, luz suave, ponte em *spline* | Tábuas seguem curva sem esticar |
| **E4** Mecânica | Criar/mover/nomear, pontes, versões, comparação, anonimizar | Vitest: snap, remoção, exportação anonimizada |
| **E5** Interface | Cartões, aquarela, ilustrações | Contraste; teclado |
| **E6** Áudio | Água/vento | Pico ≤ teto |
| **E7** Segurança | Retenção, anônimo, baixo desempenho (água opaca) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Edição de ilha em toque (modo simples por botões) · privacidade de terceiros (anonimização, local-only) · tentação de métricas ("pontes: 3") → **proibido** no resumo.


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
