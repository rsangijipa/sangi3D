# T04 — Atlas das Texturas | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: explorar materiais. Dependência: materiais/deformação.
- Assets prioritários: vitrines, amostras, luz rasante, cartões.
- Mecânica: Cinco gestos com reações distintas e micro-relevo; coleção subjetiva; não simular sensação tátil como medida.
- Aceite específico: Cinco gestos funcionam em amostras diversas; comparar com objeto real quando mediado.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 04. ATLAS DAS TEXTURAS

Categoria: Percepção e processamento sensorial
Público: 3+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 11 × 8 m, galeria com oito pedestais.
Câmera: FOV 39°, câmera (8,5.2,10) mirando (0,1.1,0).
Paleta e iluminação: paredes creme, piso areia, madeira natural, metais neutros e objetos em cores de material real.

## MAPA ESPACIAL DOS OBJETOS
Sala retangular com oito pedestais, quatro de cada lado em X=±3,2, Z=-2,7,-0,8,1,1,3. Uma bancada de exame em (0,0,0) mede 2 × 1 m. A parede de fundo exibe quadrados táteis sem legenda impressa; interface explica o material ao selecionar.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Objetos de veludo, argila, vidro, madeira, metal escovado, pedra, couro vegetal e areia simulada. Cada objeto tem uma versão ampliada rotacionável e uma amostra de superfície esférica ou cúbica. Pedestais de calcário com borda arredondada.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Veludo com sheen e trama em normal; madeira com veios orientados e roughness 0,55; cerâmica roughness 0,38 com micro-arranhões; vidro transmission; metal metalness 0,9 e roughness 0,28; pedra roughness 0,9 e displacement muito discreto.

## INTERAÇÕES, REGRAS E FEEDBACK
Arrastar objeto para bancada, girar em 360°, zoom de macro, alternar luz rasante para revelar relevo, agrupar materiais por preferências, associar lembranças, salvar coleção; opção com materiais físicos reais mediada pelo terapeuta.

## ÁUDIO
Som de manuseio opcional para algumas superfícies, intensidade sempre reduzida; legenda e controle individual.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
OrbitControls por objeto, SSAO econômico, texturas anisotrópicas, KTX2, PBR com normal map; instancing dos pedestais.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Museu realista de materiais com oito pedestais de pedra em duas fileiras simétricas, amostras isoladas de veludo, madeira, cerâmica, vidro, metal, pedra, couro vegetal e areia; bancada central de inspeção, luz suave de galeria e destaques rasantes para mostrar microtexturas PBR, estética contemplativa premium, vista isométrica, sem texto, 16:9. Gerar amostras de baseColor, roughness/normal de cada matéria em arquivos separados seamless.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 02/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Ateliê de investigação visual de superfícies. Colecionar amostras, manipular luz rasante e lupa para descrever diferenças de textura e preferências. Não afirmar que a tela reproduz tato físico. Sessão 5–10 min; referência mostra cortiça sob luz rasante.
### Cena, câmera e assets
Mesa de madeira mel, bandeja principal com feltro verde e pedaço irregular de cortiça altamente detalhado; luminária de metal articulada à esquerda, lupa circular em suporte à direita, bandejas ao fundo com lã, pedra escura, tecido cru e folha em primeiro plano. Estante, livros, planta pendente, quadro botânico e globo desfocados. Câmera perspectiva 40° em close de bancada, foco em cortiça, mobile preserva luminária e superfície. Painel “Luz rasante”, “Girar a luz”, “Guardar”, ícone mão com rótulo acessível. Assets: `workbench`, `tray_felt`, `cork_hero`, `wool`, `slate`, `linen`, `leaf`, `smooth_wood`, `ceramic`, `sandstone`, `lamp_arm` com juntas, `magnifier`, `sample_drawer`, `shelf_props`. Cortiça com macrogeometria irregular e normal/roughness de poros; lã com fibras simplificadas, pedra com microrelevo, tecido com normal trançado, folha com nervuras e translucidez aproximada. Lupa real por câmera secundária ou zoom local, sem refração cara no mobile.
### Dinâmica completa
1. Escolher duas entre oito amostras. 2. Observar à luz difusa, aproximar e girar a amostra. 3. Luz rasante: girar luminária e ver relevo mudar. 4. Comparar lado a lado com a mesma iluminação, selecionar descritores opcionais “liso”, “rugoso”, “fibroso”, “granulado”, “outro”, “não sei”. 5. Guardar em atlas visual, com cartão de preferência “gostei”, “indiferente”, “prefiro evitar” ou omitir. 6. Revisar coleção e experimentar outra. Modo livre permite troca instantânea; modo acompanhado limita conjunto a 2–4 amostras. Desafios de correspondência opcionais com imagem ampliada, sem classificar preferência.
### Lógica, física e interação
Luz SpotLight com pivô de rotação no braço, azimute -75° a +75°, elevação 15–65°, intensidade limitada; sombras mudam conforme rotação. Lupa move em plano sobre amostra com limites e zoom 1–3×; amostra gira em torno do centro de massa, sem cair; guardar anima bandeja até gaveta por spline e marca entrada no atlas. Comparação mantém câmera, ângulo de luz e escala equivalentes. Estado: `sampleId`, `rotation`, `lampAngle`, `lampElevation`, `magnifierPos`, `zoom`, `collection[]`, `descriptors[]`. Botões discretos de rotação e ajuste para teclado; não obrigar gesto de pinça. Sons suaves de madeira, gaveta e papel, opcionais.
### Critérios específicos
Luz gira de fato e muda sombras; oito amostras distinguíveis por geometria/material e não apenas cor; lupa amplia detalhe real; guardar e retirar amostras altera coleção sem duplicação acidental; comparação mantém condições equivalentes; modo sem movimento funciona.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 04 · ATLAS DAS TEXTURAS — Plano de execução
Porte **L** · Onda 2 · 3+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Tocar é um conjunto de gestos, cada um revela uma propriedade.** Em vez de "ver" a textura, a pessoa a **explora com gestos distintos** e depois agrupa por preferência e memória.
- Âncoras: procedimentos exploratórios manuais (Lederman & Klatzky, 1987): movimento lateral → rugosidade; pressão → dureza; contato estático → temperatura; envolvimento → forma/volume; seguimento de contorno → borda. Preferências táteis como **vocabulário descritivo**; associação livre de lembranças (abordagem fenomenológica).
- **Não afirma:** defensividade tátil, integração sensorial, perfil sensorial.
- Opção com **materiais físicos reais** mediada por você, o app guia a conversa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Galeria de espécimes** com bancada de exame |
| Verbo | **Tocar** (5 gestos exploratórios) |
| Assinatura técnica | **Micro-relevo** (normal + paralaxe) + **luz rasante real** controlável + **rastros persistentes** na superfície (cabelo do veludo penteado, sulcos na areia, impressão na argila) |
| Chrome | **Fichas catalográficas** e etiquetas de museu amarradas aos pedestais |
| Tipografia | Spectral + Karla (versaletes nas etiquetas) |
| Luz/grade | Galeria: spots de baixo ângulo, paredes creme, piso areia |
| Áudio-assinatura | Sons de **manuseio muito baixos** por material (veludo, areia, vidro, madeira...) |
| Artefato | "Coleção": materiais agrupados + lembranças (texto livre) |
| **Não pode parecer** | Museu do 14; estúdio; ateliê (cerâmica já existente) |

## 3. Jornada
1. Escolhe um pedestal; o objeto sobe/gira suavemente até a **bancada** (arrastar).
2. A bancada mostra **cinco gestos** (ícones): deslizar, apertar, apoiar, envolver, contornar. Cada um **muda a imagem e o som** (ex.: apoiar cria um halo térmico, **sem** afirmar temperatura medida).
3. **Luz rasante**: o usuário gira a luz e o relevo salta.
4. **Zoom macro** (a amostra esférica/cúbica aproxima a superfície).
5. Agrupa os materiais ("gosto / evito / depende / curioso") e **anota lembranças**; salva a coleção.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `pedestal_L1..4`, `pedestal_R1..4` | X=±3,2 · Z=−2,7 · −0,8 · 1,1 · 3,0 | calcário com borda arredondada, **instanciados** |
| `bancada_exame` | (0,0,0) 2×1 m | superfície de trabalho + suporte de rotação |
| `parede_tatil` | fundo | **quadrados táteis sem legenda** |
| 8 espécimes | nos pedestais | veludo, argila, vidro, madeira, metal escovado, pedra, couro vegetal, areia simulada; cada um com **versão ampliada rotacionável** + **amostra** esférica/cúbica |
Câmera FOV 39°, (8,5.2,10)→(0,1.1,0). Materiais: sheen+trama no veludo; veios orientados 0,55; cerâmica 0,38 com micro-arranhões; vidro transmission; metal 0,9/0,28; pedra 0,9 + displacement discreto.

## 5. Sistemas
- **Gestos → propriedades** (tabela dirigida por dados): cada espécime declara `rugosidade, dureza, temperatura-visual, forma` como **parâmetros de render** (não de "medida").
- **Rastros persistentes:** textura de "estado" por objeto (RenderTarget pequeno) que alimenta normal/roughness; veludo tem **direção de cabelo** (escurece a contrapelo).
- **Luz rasante:** `DirectionalLight` livre, com sombra de contato; AO econômico.
- **Texturas** com anisotropia e compressão KTX2 em 1–2 k por material; 4 k só nos espécimes hero.
- **Coleção:** `colecao.json` (material, grupo, nota).

## 6. Interface, bordas e ilustrações
- **Ficha catalográfica** como painel: número de tombo fictício (sem texto na textura 3D), campos "Nome que eu dou", "Lembra de...".
- Etiquetas de pedestal em **cartão com furo e barbante** (SVG), **ilustração de mão** com os cinco gestos (desenho de linha, uma mão por gesto).
- Moldura de **linho e latão**, sem brilho de "cromado".
- Botões do estilo "gaveta de arquivo".

## 7. Áudio
Foleys **procedurais** de muito baixa energia (ruído filtrado por material: farfalhar de veludo, areia deslizando, tilintar de vidro, madeira); legenda "[som de veludo, suave]"; controle individual por material; teto fixo de volume.

## 8. Acessibilidade, conforto, ética
- Gestos têm **alternativa de botão**; tudo por teclado (setas giram; Enter "apoia").
- **Preferências ≠ avaliação**: sem somas, sem "perfil". Aviso: "estas são suas escolhas de hoje".
- Crianças 3+: materiais com cores de objeto real (sem abstração); texto mínimo; modo adulto para anotações.
- Respeitar quem **evita** alguns materiais: opção "esconder este material" na coleção.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 8 materiais, 5 gestos, vocabulário de preferência | Aprovado |
| **E1** Blocking | Sala, 8 pedestais instanciados, bancada | Validador verde; captura |
| **E2** Hero | 8 espécimes + amostras; UV; PBR compartilhada | Orçamento; GLB dos hero |
| **E3** Luz + assinatura | Luz rasante, micro-relevo, **rastros persistentes** | Arrastar no veludo muda tom e **permanece** após soltar (teste de imagem) |
| **E4** Mecânica | Bancada, gestos, agrupamento, coleção | Vitest do mapa gesto→parâmetro; coleção persiste |
| **E5** Interface | Ficha, etiquetas, ilustrações das mãos | Contraste; teclado |
| **E6** Áudio | Foleys por material | Pico ≤ teto; legenda |
| **E7** Segurança | Render sob demanda, baixo desempenho (sem displacement) | 30 fps móvel; axe |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Rastros persistentes por objeto aumentam memória (limitar a 256² por espécime) · displacement em móvel (trocar por normal) · conteúdo sensorial intenso para alguns → opção de ocultar.


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
