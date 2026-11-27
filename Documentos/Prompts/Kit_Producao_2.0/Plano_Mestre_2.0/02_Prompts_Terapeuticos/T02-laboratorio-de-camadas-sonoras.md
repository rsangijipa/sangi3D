# T02 — Laboratório de Camadas Sonoras | Produção 2.0

## Instruções para o agente de código
Implemente a experiência completa no repositório real; não entregue só mockup ou plano. Este arquivo reúne a decisão 2.0 e as referências específicas de produção. Leia o código existente, se houver. Se faltar a referência visual, siga a descrição textual e registre a ausência. Não simule testes nem aprovação. Execute em etapas pequenas: baseline → estado/regras → cena e assets → gesto principal → conteúdo/etapas → UI/áudio → persistência → testes → build e integração. Em cada etapa, valide o gesto e o estado antes de decorar. Anexe ao agente o mockup original e, para migração, o HTML/repositório correspondente.

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: mixar e isolar. Dependência: áudio.
- Assets prioritários: rack, cápsulas, monitores, faders, oscilograma.
- Mecânica: Mixer por canal, solo/mute, FFT, escolha de foco; zero inicial e replay das configurações.
- Aceite específico: Solo não deixa outras fontes ativas; mute geral e alternativa visual.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 02. LABORATÓRIO DE CAMADAS SONORAS

Categoria: Percepção e processamento sensorial
Público: 6+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 9 × 7 m, estúdio de som de uma sala.
Câmera: perspectiva FOV 42°, câmera (7,5.1,8) mirando (0,1,0).
Paleta e iluminação: nogueira escura, feltro antracite, equipamentos grafite e pontos de luz âmbar/ciano.

## MAPA ESPACIAL DOS OBJETOS
Mesa principal em semicírculo em (0,0,-1) com 2,6 m de largura, superfície na altura 0,78 m. Painel difusor de madeira ocupa a parede posterior Z=-3,5. Dois monitores de referência simétricos em (-2,1, -2,3) e (2,1,-2,3); quatro pedestais menores de fontes sonoras em X=-3, -1, 1, 3 e Z=2. Um visor de ondas flutuante fica ao fundo, não como texto projetado.

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Mesa mixer com oito faders 3D, oito potenciômetros, botões LED e dois VU meters; alto-falantes com tecido acústico e cones; estante lateral de instrumentos; cabos organizados; quatro cápsulas transparentes contendo representações de voz, natureza, trânsito e música.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Madeira escura roughness 0,55; aço escovado metalness 0,8 roughness 0,4; borracha dos botões roughness 0,9; telas emissivas sem bloom exagerado; vidro fosco cápsulas roughness 0,12; feltro absorvente com normal procedimental.

## INTERAÇÕES, REGRAS E FEEDBACK
Faders individuais controlam ganho real de quatro famílias de áudio; solo/mute; reposicionar cápsulas em círculo para observar espacialização; escolher atenção a uma fonte e registrar se foi fácil; comparar A/B com volumes normalizados; salvar perfil e zerar mixagem sem picos.

## ÁUDIO
Mixagem estéreo e espacial com AudioContext, GainNode, PannerNode, compressor/limitador conservador; snapshots em JSON; sem qualquer algoritmo alegando identificar processamento auditivo.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js + controles DOM acessíveis sincronizados ao mixer 3D; Web Audio; tweening de faders; shaders leves para visualizador FFT; limite de ganho; animação sob demanda.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Sala de estúdio sonoro realista e acolhedora, render 3D em perspectiva três-quartos, painel acústico de madeira nogueira, mesa de mixagem curva central com faders táteis, dois monitores de áudio, cápsulas de vidro luminoso sobre quatro pedestais simbolizando camadas sonoras, teto com luz indireta âmbar e ciano sutil; fios limpos, texturas fotográficas PBR, atmosfera premium, sem texto, sem logos, horizontal 16:9. Separar atlas de botões e sinais visuais, texturas de feltro e nogueira, cápsulas isoladas transparentes.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Dinâmica ampliada do kit de 17 jogos (prioridade de conteúdo após decisão 2.0)
**Projeto 03/17** | Anexe `mockup.png`.

Implemente o jogo completo descrito abaixo usando o mockup como alvo visual. Os requisitos específicos têm prioridade em caso de adaptação de layout; mantenha o contrato técnico comum.

### Conceito e objetivo
Mesa de mixagem artesanal para explorar sons sobrepostos e escolher foco. Prática de seleção auditiva, controle de estímulos e preferências; não confundir com teste auditivo. Sessões de 4–10 min.
### Cena, câmera e assets
Bancada frontal em perspectiva leve, cinco redomas de vidro sobre bases de madeira com ícones físicos: fala, tênis/passos, ventilador, cidade e nota musical. Mesa de cinco faders verticais com trilhos, marcações e botão fone por canal, redoma selecionada em verde suave. Parede perfurada de madeira, janela arqueada, luminária, microfone decorativo desligado, livros, plantas e bandeirolas. Câmera 40° centralizada para leitura simultânea de faders e redomas; mobile mostra cinco em fila e sliders horizontais no painel. Assets `mixer_body`, `fader_knob`×5, `dome_glass`×5, `speech_icon`, `shoe_model`, `fan_model`, `city_model`, `music_note`, `headphone_button`, `pegboard`, `desk_lamp`, `window`, `microphone_prop`. Áudio stems independentes de fala não identificável, passos, ventilador, cidade e melodia original suave, todos com loop e normalização.
### Dinâmica completa
1. Ativar som e explorar canais um a um. 2. Reconhecer visualmente cada fonte, ajustar volume e observar sua redoma. 3. Escolher foco (mockup), modificar mix e tocar botão fone para escutar canal solo. 4. Em desafio opcional, encontrar uma fonte indicada por ícone ou texto entre 2–5 canais, podendo usar “isolar”. 5. Montar mix confortável e comparar antes/depois com alternância A/B. 6. Rever preferências e finalizar. Modo livre sem metas; acompanhado configura canais ativos e teto de volume. Começar sempre silencioso.
### Lógica, física e interação
`AudioContext → source → GainNode por canal → master gain → compressor/limiter → destination`; stems compartilham início quando mix ativo, ajuste via rampas para evitar cliques. Solo não destrói valores anteriores: se solo ativo, ganho efetivo dos outros é zero; mute global prevalece; restaurar mix após solo. Fader 3D desliza em trilho limitado e sincroniza slider DOM, passo teclado 5%; redoma emissiva proporcional ao ganho efetivo, ventilador gira só quando ativo (movimento reduzido desliga). Estado `channels[{id,level,mute}]`, `soloId`, `masterMute`, `mixA`, `mixB`, `targetId`. Não habilitar microfone. Exibir rótulos de canal e nível; feedback visual de reprodução sem espectro piscante.
### Critérios específicos
Cinco canais reais independentes, controles 3D/DOM idênticos; ao isolar, só canal escolhido é audível; silenciar tudo cancela qualquer som imediatamente com fade curto; restaurar A/B e volume funciona após pausa; sessão totalmente utilizável sem som com indicação visual.

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 02 · LABORATÓRIO DE CAMADAS SONORAS — Plano de execução
Porte **L** · Onda 2 · 6+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Figura e fundo também existem no som.** Ao separar e recombinar camadas, a pessoa percebe o que "sobe" à atenção e o que recua, e ganha agência para dosar o ambiente.
- Âncoras: atenção seletiva / "festa de coquetel" (Cherry, 1953); segregação de fluxos (Bregman, 1990); figura-fundo e proximidade (Gestalt — aplicáveis ao auditivo).
- **Não afirma:** transtorno de processamento auditivo, nem "mede" nada. O prompt já proíbe algoritmo que "identifique processamento".
- **Diferença do 01:** o 01 é **espaço geográfico** (onde estão as fontes); o 02 é **camada e proporção** (quanto de cada uma). Sem mapa, sem cidade, sem ícones de lugar.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estúdio de gravação** de nogueira e feltro, luz âmbar/ciano indireta |
| Verbo | **Mixar e isolar** |
| Assinatura técnica | **Cápsulas de vidro que "respiram" com o espectro** (FFT → emissivo/escala) + **fita de oscilograma 3D** flutuante + faders com mola e *slew rate* limitado |
| Chrome | **Rack 19"**: orelhas com parafusos Phillips (SVG), serigrafia, medidores LED em DOM |
| Tipografia | Barlow Condensed (rótulos de painel) + JetBrains Mono (valores em dB) |
| Luz/grade | Teto indireto âmbar + filete ciano; contraste médio, sem bloom forte |
| Áudio-assinatura | Quatro famílias com **mesma loudness** para comparação justa |
| Artefato | "Perfil de mixagem" (snapshot JSON nomeável) |
| **Não pode parecer** | Mapa/cidade (01); painel azul de "dashboard"; estúdio genérico de stock |

## 3. Jornada
1. Entra com **todos os faders no mínimo** (silêncio).
2. Sobe um fader: a cápsula acende e pulsa com o som daquela família.
3. **Solo/Mute**; arrasta cápsulas num **círculo de escuta** (o ouvinte no centro) e percebe a espacialização.
4. Escolhe uma fonte como **foco de atenção** (spotlight visual) e marca *foi fácil / mais ou menos / foi difícil / não sei*.
5. **A/B com volumes normalizados**; salva o perfil; **zerar** devolve tudo a zero sem picos.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `mesa_mixer` | (0,0,−1), 2,6 m, tampo y=0,78 | semicírculo em *loft* com bordas arredondadas; **8 faders**, **8 potenciômetros** serrilhados, botões LED, **2 VU meters** |
| `difusor_parede` | Z=−3,5 | difusor acústico de madeira com **poços de profundidades variadas** (tipo QRD) |
| `monitor_L` / `monitor_R` | (±2, 1, −2,3) ⚠ ambiguidade registrada | cone, tecido acústico, suporte |
| `pedestal_1..4` | X=−3, −1, 1, 3 · Z=2 | com **cápsulas**: voz, natureza, trânsito, música |
| `visor_ondas` | ao fundo, flutuante | **geometria** (fita 3D a partir do analisador), não texto projetado |
| `estante_instrumentos`, `cabos` | lateral | cabos como tubos com **caída por gravidade** |
Câmera FOV 42°, (7,5.1,8)→(0,1,0). Materiais: nogueira 0,55; aço escovado metal 0,8/rug 0,4; borracha 0,9; vidro fosco 0,12; feltro com normal procedural.

## 5. Sistemas
- **Mixer real:** 4 `GainNode` + limitador conservador; solo/mute; mudanças de ganho com **slew rate** (nunca degrau).
- **Controles DOM acessíveis** (sliders nativos) sincronizados ao fader 3D (mola animada); setas ±1 dB.
- **Espacialização:** `PannerNode` em círculo de raio ajustável; arrastar cápsula atualiza azimute.
- **A/B normalizado:** casamento de RMS antes de alternar.
- **Visualizador:** `AnalyserNode` → shader leve; **quadros limitados a 30 fps**; "reduzir movimento" congela em instantâneo.
- **Estado:** `mix.json` (ganhos, posições, solo/mute, nota de "foi fácil").

## 6. Interface, bordas e ilustrações
- Painel lateral em **módulo de rack** com orelhas e parafusos; cada família tem um módulo (ícone de pictograma próprio: voz, folha, carro, nota).
- **Medidores LED** em canvas 2D (rápidos, acessíveis com texto "−18 dB" em `aria`).
- Botões físicos com *press depth* (sombras internas), sem néon.
- Serigrafia em contornos finos; nenhum rótulo embutido em textura 3D.

## 7. Áudio (desenho)
Quatro famílias **originais e geradas**: voz = murmúrio de formantes ininteligível; natureza = vento + riacho + chilros; trânsito = drone + passagens; música = laço generativo suave (acordes de baixa densidade). Todas loopáveis, normalizadas por RMS, legendadas.

## 8. Acessibilidade, conforto, ética
- Teto de volume ajustável; **fader nunca salta**; "zerar mixagem" = rampa 120 ms.
- Sem "resultado": as respostas de "foi fácil" ficam num registro **descritivo** do próprio usuário.
- Sem cor como único sinal (LED + texto + posição).

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 famílias, vocabulário do "foi fácil", textos | Aprovado por você |
| **E1** Blocking | `scene.json`, caixas cinzas, câmera do prompt, resolver ambiguidade dos monitores | Validador verde; captura |
| **E2** Hero | Mesa em *loft*, faders, potenciômetros, difusor QRD, monitores, cápsulas, cabos | Orçamento de triângulos; GLB hero; pivôs dos faders corretos |
| **E3** Luz + assinatura | Âmbar/ciano indireto, cápsulas guiadas por FFT, fita 3D | Cápsula reage só à **sua** família (teste com 1 fader) |
| **E4** Mecânica | Mixer, solo/mute, círculo de escuta, A/B, snapshots | Vitest: ganho e RMS; sem salto > limite de *slew* |
| **E5** Interface | Rack, medidores, ícones | Contraste, foco, teclado completo |
| **E6** Áudio | 4 famílias geradas, limitador | Medição de pico ≤ teto; loudness equivalente ±1 dB |
| **E7** Segurança | Baixo desempenho (sem FFT 3D), fallback 2D (só painel), anônimo | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Sincronia DOM↔3D (fonte única de verdade no store) · custo do FFT 3D em móvel (tier baixo troca por barras DOM) · ambiguidade dos monitores (confirmar).


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
