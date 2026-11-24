# T01 — Cartografia dos Sons | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: escutar e posicionar. Dependência: áudio espacial.
- Assets prioritários: maquete, escola, padaria, praça, ônibus, tokens.
- Mecânica: Grafo de ruas e marcador de escuta; PannerNode e fallback estéreo; comparação A/B com ganho limitado.
- Aceite específico: Mover ônibus para perto/longe, comparar e silenciar tudo.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 01. CARTOGRAFIA DOS SONS

Categoria: Percepção e processamento sensorial
Público: 5+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 30 × 24 m, maquete urbana aberta, ruas na cota Y=0.
Câmera: ortográfica aparente, perspectiva real FOV 34°, câmera (21,19,26) mirando (0,0,0), azimute 40°.
Paleta e iluminação: alvenaria creme, telhas terracota, asfalto cinza-azulado, folhagens verde-musgo, luz matinal 4800 K.

## MAPA ESPACIAL DOS OBJETOS
A praça central ocupa (0,0,0) com raio 4 m e piso de placas de pedra. A cafeteria de fachada creme fica (-9,0,-5), com toldo listrado e três mesas externas. Escola de dois pavimentos em (8,0,-7), com janelas retangulares e portão gradeado. Parque arborizado em (-9,0,7), contendo bancos, arbustos e um chafariz discreto. Ponto de ônibus em (9,0,6); rua contorna o conjunto com meio-fio, faixa de pedestre, postes e um único carro opcional.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Cafeteria: porta de madeira com dobradiças, vidros com IOR aproximado 1,5, xícaras e máquina de café como objetos de cena; escola: 16 janelas repetidas via instancing; parque: 6 árvores de três geometrias, folhas por atlas alfa, chão grama; ponto: abrigo metálico, banco, painel; praça: fonte, jardineiras, ladrilhos; cinco ícones discretos de fonte sonora apenas quando selecionados.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Paredes com reboco microgranulado roughness 0,83; paralelepípedo normal map sutil 0,85; vidro com transmissão moderada e fallback opaco mobile; asfalto roughness 0,95 e decalques pintados; madeira PBR roughness 0,65; árvores com variação de verde e translucência simulada.

## INTERAÇÕES, REGRAS E FEEDBACK
Clique/toque em cada fonte da cidade para escutar prévia opcional; regular volume e desligar de imediato; arrastar fonte no mapa para comparar posição; alternar isolamento e mistura de fontes; marcar agradável/neutro/desconfortável/não sei; personalizar distância sonora, cenário e registro textual; pausar tudo com botão fixo. Nunca aumentar volume automaticamente.

## ÁUDIO
Web Audio API: fonte por PannerNode HRTF; GainNode por categoria; limitador de ganho e botão de silêncio; sons inicia apenas por ação explícita e gradualmente com fade curto; sons de pássaros, vozes simuladas, tráfego, chuva, água e cafeteria em arquivos separados.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js Raycaster, scene graph por quarteirão, LOD nas árvores, AudioListener na câmera, shader de vento leve; mapa de fontes em JSON; Web Audio com PannerNode/GainNode.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Use a imagem fornecida como referência visual primária. Render 3D altamente realista de maquete urbana interativa acolhedora, vista isométrica três-quartos: praça central de pedras, cafeteria creme à esquerda com toldo e mesas, escola à direita ao fundo, parque verde à esquerda à frente, abrigo de ônibus à direita à frente, rua de asfalto ao redor; luz matinal cálida, sombras suaves, materiais PBR e detalhes de miniatura premium; composição limpa que permita identificar cada origem de som; sem pessoas identificáveis, sem texto, sem logotipos, 16:9, 4k. Gerar em seguida separado: fachadas, decalques, folhas e ícones em PNG transparente; texturas seamless de reboco, asfalto e placas de piso.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 01/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Explore uma cidade em miniatura como cartógrafo sonoro: localizar, deslocar, comparar e combinar fontes de som em um mapa tridimensional. Trabalhar discriminação auditiva, percepção espacial e comunicação de preferências; não avaliar audição clínica. Sessão sugerida 5–12 min, livre sem limite. O momento mostrado é etapa 3/5, “Mover e comparar”.
### Cena, câmera e assets
Diorama sobre mesa de madeira com mapa de papel topográfico, ruas de asfalto cinza, calçadas de pedra, padaria terracota à frente esquerda, escola de tijolo com relógio e bandeira ao fundo, casas amarelas, praça com fonte circular, árvores felpudas, canteiros floridos, bancos e lampiões. Prancheta, lupa, lápis e livro nas bordas. Câmera ortográfica isométrica ~45° de azimute e 35° de elevação; mapa ocupa esquerda, painel creme à direita. Mobile reenquadrar praça/ônibus, não o mapa inteiro espremido. Luz difusa de janela quente, pequenas emissões nas janelas. Assets GLB: `map_board`, `school`, `bakery`, `house_set`, `road_tiles`, `fountain`, `tree_set`, `bench`, `lamppost`, `bus_token`, `bird_token`, `bell_token`, `water_token`, `footstep_token`, `listener_marker`, `sound_rings`. Cada token tem ícone branco em peça arredondada e contorno de seleção ciano; ondas concêntricas translúcidas sem piscar. Áudio: ônibus distante, água, pássaros, sino suave, passos, voz ambiente ininteligível opcional; loops limpos e não abruptos.
### Dinâmica completa
1. Escolher uma área e ligar som voluntariamente; ouvir uma fonte isolada, associá-la ao objeto visual. 2. Posicionar o marcador de escuta em um ponto próximo ou distante e perceber mudanças. 3. Mover o token azul do ônibus por caminhos permitidos; alternar ferramentas “Ouvir”, “Mover”, “Comparar”, com botão Ouvir e Silenciar tudo como na referência. 4. Selecionar fontes A e B, ouvir separadamente, marcar “mais perto”, “mais longe”, “parecidos” ou “não sei”; mostrar comparação visual de alcance. 5. Criar composição de até três fontes, salvar mapa somente se solicitado e rever. Níveis: 2 fontes com pistas, 4 fontes, depois combinação espacial; sem sons surpresa. Modo acompanhado seleciona fontes e intensidade máxima.
### Lógica, física e interação
Mapa com grafo de calçadas/ruas; tokens encaixam no ponto válido mais próximo, retorno suave se inválido. Arrastar com raycast no plano XZ, snap de 0,25 m; opção setas e botões de posição. Ônibus segue spline da rua sem atravessar prédios. Posicionamento sonoro com PannerNode quando suportado, fallback estéreo; distância reduz ganho de maneira contínua e limitada (não simular dB reais); fonte e ouvinte atualizam coordenadas. Ondas sincronizadas apenas enquanto fonte toca; sliders de volume, mute individual e global, crossfade de 150–300 ms. Fonte ativa selecionada não implica reprodução automática. Estado: `sources[{id,pos,gain,muted}]`, `listenerPos`, `tool`, `comparisonIds`, `observations`. Contabilizar fontes exploradas, comparações, pedidos de pista, preferências sem pontuar subjetividade.
### Critérios específicos
Ao mover ônibus para longe, ganho diminui e ondas acompanham; comparar A/B não deixa loops concorrentes indevidos; mute interrompe todas as fontes inclusive ambiente; mapa tem pelo menos 5 fontes e 3 áreas distintas; cada ferramenta funciona por mouse, toque e teclado; concluir após revisar, inclusive com áudio desativado.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 01 · CARTOGRAFIA DOS SONS — Plano de execução
Porte **L** · Onda 2 · 5+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Escutar é uma atividade de exploração, e o controle sobre o som muda a experiência dele.** O usuário não "recebe" ruído: ele coloca, move, isola e nomeia cada fonte numa cidade em miniatura.
- Âncoras: *soundscape* e escuta ativa (R. M. Schafer, 1977; "soundwalk"); análise de cena auditiva (Bregman, 1990); controle percebido reduz o incômodo do ruído (Glass & Singer, 1972).
- Dunn só entra como **vocabulário de preferências** (procuro / evito / noto), nunca como escore.
- **Não afirma:** hiperacusia, misofonia, perfil sensorial, TEA/TDAH. Sem comparação com norma.
- **Diferença do acervo:** a *Paisagem Sonora 3D* é contemplativa e natural; aqui é **mapa urbano manipulável**, com fontes arrastáveis e classificação pessoal.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | Maquete urbana sobre uma **prancheta de cartógrafo** (papel quadriculado, régua de latão nas bordas da mesa) |
| Verbo | **Escutar e posicionar** |
| Assinatura técnica | **Frentes de onda** no chão: anéis que saem da fonte selecionada e **são barrados pelos prédios** (grade 2D de oclusão 64×48); isocontornos de distância |
| Chrome | Neatline dupla com marcas de escala, **rosa-dos-ventos que gira com a câmera**, *cartucho de legenda* como menu |
| Tipografia | Libre Caslon Text (rótulos, itálico de mapa) + IBM Plex Mono (coordenadas) |
| Luz/grade | Manhã 4800 K, sombras longas e suaves, grade de cor "papel quente" |
| Áudio-assinatura | Som **abafa atrás de prédios** (passa-baixa por oclusão) |
| Artefato do usuário | "Folha de escuta": mapa com fontes, posições e rótulos pessoais (JSON + PNG) |
| **Não pode parecer** | Cena natural contemplativa; painel genérico flutuante; ícones de "alto-falante" |

## 3. Jornada
1. Chegada: mapa em silêncio. Legenda mostra 5 fontes (nada toca).
2. Toque numa fonte → ícone aparece, **fade de 400 ms** até o volume que o usuário definiu; frentes de onda se espalham.
3. Arrasta a fonte pelo mapa; ouve e vê o alcance mudar. Alterna **isolar** × **misturar**.
4. Marca cada fonte: *agradável · neutro · desconfortável · não sei* (ícone + texto) + nota livre opcional.
5. Fecha com a "folha de escuta"; exporta ou apaga.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `praca_central` | (0,0,0) r=4 | placas de pedra, normal sutil; jardineiras; fonte |
| `cafeteria` | (−9,0,−5) | fachada creme, **toldo listrado** (tecido com leve balanço), porta de madeira com dobradiças, vidros IOR 1,5, 3 mesas, xícaras, máquina de café |
| `escola` | (8,0,−7) | 2 pavimentos, **16 janelas instanciadas**, portão gradeado |
| `parque` | (−9,0,7) | 6 árvores de **3 geometrias** com LOD, bancos, arbustos, chafariz discreto |
| `ponto_onibus` | (9,0,6) | abrigo metálico, banco, painel |
| `rua_anel` | contorna | meio-fio, **faixa de pedestre em decal**, postes, 1 carro opcional |
Câmera FOV 34°, (21,19,26)→(0,0,0), azimute 40°. Botão **"Prancheta"**: vista superior para posicionar com precisão.
**Fontes (5):** pássaros (parque) · vozes simuladas (escola) · tráfego (rua) · água (chafariz) · cafeteria. **Chuva** é *cenário* (clima opcional), não fonte — leitura que adoto do prompt (6 sons, "cinco ícones").

## 5. Sistemas
- **Áudio espacial:** `AudioContext` + `PannerNode` HRTF por fonte, `GainNode` por categoria, `DynamicsCompressor` como limitador, `AudioListener` na câmera; 1 m virtual = 1 m de áudio.
- **Oclusão acústica:** raio 2D fonte→ouvinte contra a grade de prédios → passa-baixa + queda de ganho (suave, sem degrau).
- **Frentes de onda:** shader no plano do solo, textura de oclusão atualizada só quando uma fonte se move.
- **Estado:** `fontes.json` (id, x, z, raio, rótulo, nota), cenário (manhã/chuva leve/fim de tarde). IndexedDB + retenção escolhida.
- **Regra dura:** *nunca* aumentar volume automaticamente; "silenciar tudo" = rampa de 80 ms (sem estalo).

## 6. Interface, bordas e ilustrações
- Moldura *neatline* dupla com **marcas de escala em metros** e coordenadas nas bordas (IBM Plex Mono).
- **Cartucho de legenda** (menu): 5 emblemas gravados em SVG (pássaro, vozes, ônibus, gota, xícara), cada um com seletor de rótulo e controle de raio.
- Rosa-dos-ventos SVG animada pelo azimute; **barra de escala** que muda com o zoom.
- Textura de papel só nos painéis HTML (nunca atrás do texto de leitura → contraste mantido).
- Botão fixo **"Silenciar tudo"** sempre visível; recolher controles com **H**.

## 7. Áudio (desenho)
Síntese procedural primeiro (sem direitos autorais): pássaros = chilros FM curtos com intervalos irregulares; tráfego = drone de ruído filtrado + passagens; vozes = murmúrio de formantes **ininteligível**; água = ruído filtrado modulado; cafeteria = murmúrio + tilintar leve. Slot opcional para amostras CC0 (licença verificada e registrada no manifesto). Normalização por RMS entre fontes, teto no limitador, legenda textual de cada som.

## 8. Acessibilidade, conforto, ética
- Lista de fontes navegável por teclado; setas movem a fonte em passos de 0,5 m; `aria-live`: "Tráfego movido para 6 m da praça".
- Reduzir movimento: frentes de onda viram **contorno estático**.
- Sem "ranking" de conforto; as quatro marcas são do usuário e não geram resultado.
- Sessão anônima; exportar/apagar; fallback 2D = mapa SVG com as mesmas fontes e o mesmo áudio.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário de escuta, textos dos convites, rótulos, 3 cenários | Revisado por você |
| **E1** Blocking | `scene.json` + caixas cinzas + grade de oclusão + câmera do prompt | Validador verde; captura do enquadramento |
| **E2** Assets hero | Cafeteria, escola, parque, ponto, praça, rua; GLB dos hero | Dentro do orçamento; nomes semânticos; estados idle/hover/selected/active nas fontes |
| **E3** Luz + assinatura | Sol 4800 K, sombras, frentes de onda, chuva-cenário, vento nas folhas | Frentes **param** em prédios (teste visual com fonte atrás da escola) |
| **E4** Mecânica | Arrastar, isolar/misturar, marcação, raio por fonte, persistência | Vitest: oclusão, ganho × distância; mover fonte altera ganho **e** imagem |
| **E5** Interface | Neatline, cartucho, rosa-dos-ventos, ícones | Contraste ≥ 4,5:1; foco visível; alvo ≥ 48 px |
| **E6** Áudio | 5 fontes + chuva; limitador; legendas | Medição: nenhum pico acima do teto; fade 400 ms |
| **E7** Segurança | Anônimo, retenção, baixo desempenho, fallback 2D | axe sem violações sérias; 30 fps móvel |
| **E8** Entrega | Capturas, relatório de divergências, README | 6 critérios com evidência |

## 10. Riscos
- Realismo do áudio procedural → plano B: amostras CC0.
- HRTF em móvel pesado → cair para `equalpower` no tier baixo.
- Efeito "miniatura" (tilt-shift) pode incomodar → só como opção.


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
