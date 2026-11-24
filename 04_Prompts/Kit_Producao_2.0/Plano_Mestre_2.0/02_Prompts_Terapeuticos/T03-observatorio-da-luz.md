# T03 — Observatório da Luz | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: ajustar. Dependência: render.
- Assets prioritários: pavilhão de vidro, persianas, prismas, dials.
- Mecânica: Exposição gradual, luz de cor/temperatura, vidro barato, comparação de presets sem flashes.
- Aceite específico: Mudar intensidade, girar painel, abrir persiana e comparar; modo leve sem refração.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 03. OBSERVATÓRIO DA LUZ

Categoria: Percepção e processamento sensorial
Público: 4+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 12 × 9 × 5 m, pavilhão branco de vidro.
Câmera: FOV 38°, câmera (9,5.3,11) mirando (0,1.4,0).
Paleta e iluminação: marfim, calcário claro, vidro translúcido azul-pálido, âmbar suave, luz diurna difusa.

## MAPA ESPACIAL DOS OBJETOS
Pavilhão central com piso calcário de (12 × 9 m), fundo Z=-4,5 formado por três painéis de vidro colorido, cada um de 2,2 × 3 m. Um prisma facetado em (0,1,0) sobre pedestal circular. Área comparativa em X=-3 e X=3 com duas cabines de luz. Controles e indicador de condições ficam em painel HTML externo, não desenhados no vidro.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Prisma hexagonal facetado, painéis de vidro âmbar/azul/rosa claro, venezianas móveis, persianas difusoras, vasos com folhas grandes e dois bancos de pedra. Cada painel tem malha de moldura individual, pivô de giro e estado de opacidade.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Calcário de microvariações roughness 0,82; alumínio anodizado metalness 0,65; vidros MeshPhysicalMaterial transmission controlada, thickness 0,1; sombras coloridas simuladas por decals/lightmap quando luz transmissiva real não for viável; evitar chromatic aberration intensa.

## INTERAÇÕES, REGRAS E FEEDBACK
Selecionar intensidade/temperatura simulada, girar painéis, abrir e fechar persianas, comparar condições de leitura, registrar conforto visual. Modo reduzido mantém iluminação constante. Nenhum flash ou mudança brusca de luminância.

## ÁUDIO
Ambiente opcional quase silencioso, controle sonoro desligado por padrão, narração descritiva acessível.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js MeshPhysicalMaterial, controle de exposure/tone mapping com limites; cenários pré-calculados para simular luz; fallback 2D para dispositivos fracos.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Pavilhão arquitetônico de luz altamente realista em miniatura, salão claro de calcário, três grandes placas de vidro translúcido em tons pálidos ao fundo, prisma cristalino sobre pedestal central e dois espaços de comparação laterais, venezianas de madeira, iluminação difusa do dia, sombras geométricas coloridas extremamente suaves, materiais físicos, sem ofuscamento, sem texto, 16:9 4k. Exportar referências individuais de prismas e painéis, textura pedra seamless.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 04/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Explorar iluminação, intensidade, temperatura aparente e direção em um observatório acolhedor. Comparar configurações, identificar conforto visual e registrar preferência. Sem alegar calibração de lux ou temperatura real da tela.
### Cena, câmera e assets
Estufa envidraçada com estrutura de madeira, persianas horizontais, plantas, jardim ao entardecer, mesa redonda, dois painéis de vidro canelado em base de latão (azul-esverdeado e âmbar), prancheta com sliders, vaso, lápis, tapete e almofadas. Lâmpada cogumelo na estante à esquerda. Câmera perspectiva 38–45°, composição simétrica dos painéis à esquerda e HUD superior direito. Mobile mostra as duas lâmpadas e prancheta acima do painel. Assets `greenhouse`, `window_frames`, `blinds` articuladas, `table_round`, `light_panel_A`, `light_panel_B`, `ribbed_glass`, `brass_stands`, `clipboard`, `slider_knob`, `lamp_mushroom`, `plant_set`, `cushions`, `garden_baked`. Vidro canelado via geometria simplificada ou normal map, sem refração dinâmica obrigatória. Ambiente quente, sombras das persianas.
### Dinâmica completa
1. Escolher luz inicial suave. 2. Ajustar intensidade de 0–100% com limites seguros de render. 3. Ajustar temperatura de quente a fria (rótulos e cor), direção e abertura de persiana em etapa avançada. 4. “Comparar” lado a lado A e B ou alternar sem flash, conservar configuração A enquanto modifica B. 5. Selecionar preferência “A”, “B”, “ambas”, “nenhuma”, “não sei”; guardar configuração opcional e voltar. Modo acompanhado fixa uma variável para explorar outra. Presets: amanhecer, tarde, luz difusa e noite suave.
### Lógica, física e interação
Intensidade controla luz emissiva e Area/SpotLight aproximada; temperatura visual interpola cores em espaço linear entre quente e fria, pode rotular Kelvin como valor simulado apenas se explicitado. Direção inclina painel com pivô limitado ±25°; persianas giram 0–75°; sombras baked para ambiente e uma luz dinâmica por painel conforme orçamento. Sliders físicos e DOM sincronizados, resposta suave em 200–400 ms, sem estrobo, bloom moderado/desligável. Estado `A/B{intensity,warmth,angle,blind}`, `activePreset`, `compareMode`, `preference`; snapshot A imutável até edição explícita. Permitir reduzir intensidade da própria cena, separada da variável do exercício.
### Critérios específicos
Alteração de sliders modifica o ambiente, não só cor do botão; A/B mantém valores independentes; modo mobile mostra ambos os painéis; brilho reduzido sempre disponível; reset retorna preset seguro; preferências não são avaliadas como erro.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 03 · OBSERVATÓRIO DA LUZ — Plano de execução
Porte **M** · Onda 1 (piloto) · 4+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Conforto visual é pessoal, e se descobre ajustando, não respondendo a perguntas.** A pessoa regula intensidade e temperatura da luz até "ficar bom" e vê a faixa que serviu para ela, hoje.
- Âncoras: **método do ajuste** da psicofísica (Fechner; o participante controla o estímulo até um critério subjetivo); adaptação à luz e ao escuro; luz como tema de ambiente (conforto, leitura).
- **Não afirma:** fotofobia, estresse visual, necessidade de lentes/filtros coloridos, ritmo circadiano individual. **Sem** atribuir significado emocional a cores.
- **Diferença de tudo:** é a **única sala de luz como objeto** — o próprio feixe, o prisma e o vidro são o assunto.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Pavilhão branco de calcário e vidro** (arquitetura de exposição) |
| Verbo | **Ajustar até ficar confortável** |
| Assinatura técnica | **Prisma hexagonal com dispersão espectral** (refração por comprimento de onda em shader próprio) + **sombras coloridas projetadas** (decal/lightmap) + **adaptação suave de exposição** |
| Chrome | Traço-fino arquitetônico, painel de **vidro fosco** (não "glassmorphism" decorativo) e **tira espectral** como controle |
| Tipografia | Jost (leve, geométrica) + Instrument Serif (itálico para observações) |
| Luz/grade | Difusa diurna, branco-marfim; CA mínima; sem bloom forte |
| Áudio | **Quase silêncio** (desligado por padrão); narração descritiva sob demanda |
| Artefato | "Faixa de conforto de hoje" (intervalo definido pelo usuário, sem norma) |
| **Não pode parecer** | Estúdio (02); galeria (04); estufa (10) |

## 3. Jornada
1. Entra com luz **estável e média**. Nenhuma mudança brusca, nunca.
2. Mexe em **intensidade** e **temperatura** (tira espectral/escala em kelvin) até marcar *confortável*; marca também *muito claro · muito escuro*.
3. Gira os três **painéis de vidro** (âmbar/azul/rosa pálido) e abre/fecha **persianas**; vê as sombras coloridas se moverem lentamente.
4. Compara duas condições de leitura (amostra de leitura sem texto: faixas de linhas/ícones).
5. Registra conforto e vê "sua faixa de hoje".

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `piso_calcario` | 12×9 m | microvariação, roughness 0,82 |
| `painel_vidro_1..3` | fundo Z=−4,5; 2,2×3 m | moldura individual, **pivô de giro**, estado de opacidade; âmbar/azul/rosa |
| `prisma_hex` | (0,1,0) sobre `pedestal_circular` | facetado; `MeshPhysicalMaterial` com `transmission` controlada, thickness 0,1 |
| `cabine_luz_L/R` | X=−3 e X=3 | áreas de comparação |
| `venezianas`, `persianas` | janelas | móveis |
| `vasos_folhas`, `banco_pedra_1..2` | laterais | folhas grandes translúcidas |
Câmera FOV 38°, (9,5.3,11)→(0,1.4,0). Painel de controles **em HTML fora do canvas**.

## 5. Sistemas
- **Luz:** 1 key + hemisférica; *lightmap/decal* para sombras coloridas (transmissão real de luz só onde viável); **limitador de variação de luminância** (nunca salto > X por segundo).
- **Prisma:** shader de dispersão simples (3–7 amostras espectrais) com fallback de transmissão cromática para tier baixo.
- **Exposição adaptativa:** a imagem "se acostuma" em ~1,5 s; limites rígidos de exposição/tone mapping.
- **Cenários pré-calculados:** 5 condições (baixa/média/alta × quente/neutra/fria) interpoladas — sem custo de GI em tempo real.
- **Modo reduzido:** iluminação **constante**, painéis estáticos.

## 6. Interface, bordas e ilustrações
- **Tira espectral** (SVG/Canvas) como slider de temperatura; handle largo.
- Painéis de vidro fosco com **bordas de 1 px** e cantos retos (sem arredondamento "app"), indicando valores em kelvin e "intensidade relativa" (%).
- Ilustração: **diagrama linear do prisma** (SVG) que explica "o que acontece" sem jargão; ícones finos de persiana/painel.
- Seletor de **leitura**: três amostras de texto *abstrato* (blocos tipográficos sem palavras legíveis) para evitar viés de conteúdo.

## 7. Áudio
Desligado por padrão; ambiente quase silencioso opcional (ar muito baixo); **narração descritiva** ("a luz está mais quente; as sombras ficaram âmbar") via síntese local sob pedido.

## 8. Acessibilidade, conforto, ética
- **Nenhum flash, nenhuma transição < 600 ms** em luminância; `prefers-reduced-motion` = luz constante.
- Texto equivalente para cada estado de luz (`aria-live`).
- Para crianças 4+: modo "só tocar nos painéis", sem kelvin; portão do adulto para registros.
- Registro = **auto-relato descritivo**, sem escala clínica; sem recomendação de "o que usar".

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário (confortável/claro/escuro), narrações, textos infantis | Aprovado |
| **E1** Blocking | `scene.json`, volumes, câmera | Validador verde; captura |
| **E2** Hero | Prisma facetado, 3 painéis com moldura/pivô, persianas, cabines, bancos | Pivôs e estados idle/hover/selected/active |
| **E3** Luz + assinatura | Dispersão espectral, sombras coloridas, exposição adaptativa | **Teste automático:** variação de luminância/s ≤ limite em varredura completa |
| **E4** Mecânica | Ajuste, comparação, registro de faixa | Vitest do intervalo de conforto; efeito visual e lógico |
| **E5** Interface | Tira espectral, painel fosco, diagrama do prisma | Contraste ≥ 4,5:1 sobre o fosco |
| **E6** Áudio | Narração sob pedido | Nada toca sem ação |
| **E7** Segurança | Fallback 2D (cenas pré-renderizadas), baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Transmissão física cara em móvel → fallback opaco/pré-calculado · dispersão pode parecer "efeito" demais → intensidade moderada e opcional · sombras coloridas sem GI → lightmap bem calibrado.


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
