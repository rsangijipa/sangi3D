# T08 — Porto das Decisões | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: planejar carga e rota. Dependência: construção/navegação.
- Assets prioritários: barcos, guindastes, caixotes, cais, carta náutica.
- Mecânica: Capacidade por peso/volume simbólico, snap, grafo de rotas, água leve, planos A/B.
- Aceite específico: Carregar até capacidade, bloquear rota inválida, simular dois planos e comparar.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 08. PORTO DAS DECISÕES

Categoria: Atenção, planejamento e funções executivas
Público: 8+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 40 × 32 m, porto e armazéns miniatura.
Câmera: FOV 35°, câmera (25,19,29) mirando (0,0,0).
Paleta e iluminação: mar azul petróleo, madeira cinza, armazéns de tijolo, equipamentos ferrugem suave.

## MAPA ESPACIAL DOS OBJETOS
Mar ocupa a metade frontal Z=3..16 com dois píeres em X=-7 e X=6. Depósito em (-10,0,-10), mercado de suprimentos em (8,0,-9), farol baixo em (15,0,0), três barcos iniciais atracados em (-6,0,8),(5,0,8),(0,0,13). Caminhos entre armazéns são pavimentados.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Três barcos com capacidade distinta, caixotes empilháveis, guindaste leve, ponte móvel, armazéns com portas, farol, cartões de pedidos com pictogramas, linhas de rota visíveis sob demanda.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Água por shader Gerstner simplificado e normal animada; tábuas com veios, madeira roughness 0,85; metal pintado 0,5; tijolos; espuma e ondas somente em torno do casco.

## INTERAÇÕES, REGRAS E FEEDBACK
Planejar rotas arrastando pontos, alocar cargas observando capacidade, executar simulação em velocidade configurável, refazer plano e comparar alternativas; restrições e mudanças de contexto configuráveis sem punição.

## ÁUDIO
Ondas, sinos leves e gaivotas em canais independentes, cada qual desativável.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js com grafo de navegação A*, barcos em splines Catmull-Rom, água shader econômica, colisões simples sem motor pesado.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Diorama portuário 3D hiper-realista visto de cima em perspectiva, água azul petróleo com pequenas ondulações, dois píeres de madeira, três barcos distintos, galpões de tijolo, guindaste, farol e caixas de mercadoria, rotas legíveis e iluminação natural suave, materiais PBR, sem texto, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 10/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Planejar cargas e rotas de pequenas embarcações. Explorar decisões, sequenciamento, capacidade e consequências previsíveis, com possibilidade de simular antes de confirmar. Sessão 5–15 min.
### Cena, câmera e assets
Porto artesanal isométrico: cais de madeira/pedra, armazéns terracota, portas verdes, guindaste amarelo, caixas de madeira, postes, cabos, defensas, três barcos azul, verde e vermelho sobre água turquesa. Trajeto com linha creme e nós circulares verdes, selecionado com halo claro. Painel “Traçar a rota”, “3 de 5 caixas”, progresso, “Simular”, “Editar carga”. Câmera ortográfica 35–45° de elevação; mobile foca barco e nós relevantes, pan limitado. Assets `harbor_base`, `warehouse_set`, `dock`, `crane` articulado, `hook`, `crate_set`, `boat_blue/green/red`, `buoy_nodes`, `route_line`, `bollard`, `rope`, `water`, `tree_set`. Barcos com cabine, vigias, salva-vidas e convés encaixável. Água com normal animada e reflexo aproximado, sem simulação fluida pesada.
### Dinâmica completa
1. Selecionar missão (levar caixas, distribuir dois destinos, retornar carga; pelo menos seis variantes). 2. Escolher barco e carregar caixas por toque/arrasto ou guindaste, capacidade indicada. 3. Traçar rota clicando nós conectados, desfazer última parada e editar carga. 4. Simular: observar percurso, tempo estimado e entregas; se exceder capacidade ou faltarem destinos, explicar antes de sair e permitir editar. 5. Confirmar viagem, descarregar nos cais, mostrar caixas entregues e restantes. 6. Comparar rota alternativa e concluir. Níveis: 3 nós/3 caixas, 5 nós/5 caixas, múltiplos destinos e restrições de capacidade; alternativas válidas não recebem nota inferior.
### Lógica, física e interação
Grafo `nodes[{id,pos,dock}]`, `edges[{from,to,length}]`, `cargo[{id,destination,weight}]`, `boat{capacity}`, `route[]`; validar adjacência, capacidade e entregas; simular em cópia sem alterar carga real. A cada chegada, descarregar apenas caixas do destino. Trajetória Catmull-Rom ajustada para evitar margem, movimento cinemático com aceleração e desaceleração suaves, orientação tangencial, bobbing discreto; guindaste rotaciona com pivô e gancho leva caixa ao slot, sem colisão com cabine. Arrasto inválido retorna à origem; capacidade visual e textual; rota pode ser alterada até confirmar. Estado `mode`, `mission`, `cargoOnboard`, `route`, `simResult`, `deliveredIds`, `undoStack`. Não exigir cálculo aritmético manual.
### Critérios específicos
Simular não modifica estado confirmado; rota inválida é explicada sem travar; caixas não duplicam/desaparecem; pelo menos duas rotas válidas em uma missão; capacidade e destinos são respeitados; editar carga e refazer funcionam após simulação.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 08 · PORTO DAS DECISÕES — Plano de execução
Porte **XL** · Onda 4 · 8+ e adultos · Atenção, planejamento e funções executivas

## 1. Tese
**Planejar é antecipar etapas, limites e plano B.** O usuário distribui cargas entre barcos de capacidades distintas e traça rotas; depois **executa a simulação**, vê o resultado e compara alternativas.
- Âncoras: planejamento com restrições (formato próximo da *Torre de Londres*, Shallice, 1982); terapia de solução de problemas (D'Zurilla & Goldfried, 1971; Nezu): definir, gerar alternativas, avaliar, escolher, verificar; fragmentação para memória operacional (Baddeley); planos "se–então".
- **Não afirma:** avaliação de funções executivas. Comparação entre planos é **do próprio usuário**, sem "melhor/pior".

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Porto de armazéns de tijolo** com píeres de madeira |
| Verbo | **Planejar rota e carga** |
| Assinatura técnica | **Água de Gerstner simplificada** com normal animada + **espuma só em torno do casco** (rastro por decal) + **rotas Catmull-Rom arrastáveis** + **A\*** |
| Chrome | **Cordas**, carta náutica de pergaminho, **carimbos em estêncil** e cartões de pedido com pictogramas |
| Tipografia | Alegreya (corpo) + Stardos Stencil (caixotes/carimbos) |
| Luz/grade | Natural suave, mar azul petróleo, ferrugem desaturada |
| Áudio-assinatura | **Três canais independentes** (ondas, sinos, gaivotas) |
| Artefato | **Plano A × Plano B** lado a lado (viagens, caixas, distância) |
| **Não pode parecer** | Ilha (12); arquipélago (18, também água); cidade (13) |

## 3. Jornada
1. Vê três **cartões de pedido** (pictograma de carga + destino + quantidade).
2. **Aloca caixotes** nos barcos observando a capacidade de cada um (indicador visual de lotação).
3. **Traça a rota** arrastando pontos: a linha Catmull-Rom segue; o A\* evita píeres e boias.
4. **Executa** a simulação (0,5×–3×). Pedidos podem mudar no meio (configurável, **sem punição**).
5. **Refaz** e **compara alternativas** (Plano A × B).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `mar` | Z=3..16 | água Gerstner; cor azul petróleo |
| `pier_1`, `pier_2` | X=−7, X=6 | tábuas com veios, rug 0,85 |
| `deposito` | (−10,0,−10) | tijolo, portas |
| `mercado` | (8,0,−9) | tijolo, toldos |
| `farol` | (15,0,0) | baixo |
| `barco_1..3` | (−6,0,8) · (5,0,8) · (0,0,13) | capacidades **distintas** |
| `guindaste`, `ponte_movel`, `caixotes` | cais | caixotes empilháveis (instanciados) |
| `caminhos` | entre armazéns | pavimentados |
Câmera FOV 35°, (25,19,29)→(0,0,0).

## 5. Sistemas
- **Grafo de navegação** (A\*) sobre grade do mar com obstáculos; **splines** por Catmull-Rom ajustáveis.
- **Planejador de carga:** capacidade por barco, pedidos com destino/quantidade; validação em tempo real (**avisa, não impede**: o usuário pode tentar e ver o resultado).
- **Simulação determinística** com velocidade configurável; log de eventos neutro ("Barco 2 levou 5 caixas ao mercado").
- **Mudanças de contexto** configuráveis: pedido novo, píer ocupado, ponte levantada.
- **Água:** vertex Gerstner (2–3 ondas) + normal animada; espuma por decal só ao redor do casco; tier baixo = plano com normal estática.
- **Estado:** `planos.json` (A, B...).

## 6. Interface, bordas e ilustrações
- **Moldura de corda** (SVG, nós nos cantos).
- **Carta náutica** como painel de rotas (ilustração de linhas batimétricas + rosa-dos-ventos *diferente da do 01*).
- Cartões de pedido em **papel manilha** com **carimbo estêncil** e pictogramas (caixa, fruta, tecido, peça), nenhum texto na imagem.
- Indicadores de lotação como **cintas de carga** (barras com fivela).

## 7. Áudio
Ondas em loop suave; **sinos** curtos e raros (fim de viagem); gaivotas esparsas. Três canais com ganho separado + botão mudo.

## 8. Acessibilidade, conforto, ética
- Rota por **lista de pontos** (teclado) além do arrasto; lotação em texto.
- **Nenhum** cronômetro ou limite de tentativas.
- Comparação **descritiva**: "Plano A: 3 viagens · Plano B: 4 viagens". Sem veredito.
- Reduzir movimento: ondas estáticas e barcos em saltos de posição.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Pedidos-exemplo, cargas, vocabulário de comparação | Aprovado |
| **E1** Blocking | Mar, píeres, armazéns, barcos, câmera | Validador; captura |
| **E2** Hero | Armazéns, barcos (3 tipos), guindaste, ponte móvel, farol, caixotes | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Gerstner, espuma de casco, luz suave | 60 fps desktop com água |
| **E4** Mecânica | A\*, splines, alocação, simulação, comparação | Vitest: A\* contorna obstáculo; capacidade; determinismo da simulação |
| **E5** Interface | Cordas, carta, carimbos, cintas | Contraste; teclado |
| **E6** Áudio | 3 canais | Pico ≤ teto |
| **E7** Segurança | Baixo desempenho (água estática), retenção | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Custo da água em móvel (tier) · complexidade do planejador (começar com 3 pedidos fixos, depois configurável) · arrasto de pontos em toque (hitboxes generosas, alças grandes).


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
