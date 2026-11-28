# T11 — Jardim dos Pensamentos

**BLOQUEADO: não iniciar implementação.**

## Escopo específico 2.0 — prevalece sobre versões antigas
- Verbo: plantar pensamento. Dependência: narrativa/privacidade.
- Assets prioritários: origamis, jardim de papel, caderno.
- Mecânica: Manter em espera; comparar com Tribunal dos Pensamentos/Pensar Sentir e Agir; Rádio dos Pensamentos é alternativa não aprovada.
- Aceite específico: Gate de decisão de identidade antes de produzir qualquer código.

## Referência original de geometria, arte, materiais e interação (não normativa em conflitos)
# 11. JARDIM DOS PENSAMENTOS

Categoria: Emoções e autorregulação
Público: 9+ e adultos

## REFERÊNCIA VISUAL
Utilizar como imagem-guia a prévia apresentada ao lado do recurso no atlas ou, preferencialmente, o arquivo original anexado. A referência é uma direção visual; coordenadas a seguir são proposta inicial de reconstrução, sujeitas a calibração visual.

## GEOMETRIA E CÂMERA
Ambiente: 18 × 14 m, jardim zen e pomar simbólico.
Câmera: FOV 35°, câmera (13,10,18) mirando (0,0,0).
Paleta e iluminação: verde sálvia, cerâmica areia, madeira natural, papel branco-quente.

## MAPA ESPACIAL DOS OBJETOS
Caminho de pedra em curva S atravessa jardim desde (0,0,7) até (0,0,-6). Três canteiros ficam X=-4,0,4 e Z=-1. Árvore central baixa (0,0,-3) de 4m. Bancada de sementes em (-5,0,5); pérgola com caixas de papel em (5,0,4).

## MESHES E ASSETS QUE DEVEM SER MODELADOS
Sementes com formas distintas, vasos de barro, folhas de papel dobrado que surgem nas plantas, pedras, regador, caderno de registro em interface, ferramentas de jardinagem e pequenos móbiles.

## MATERIAIS, TEXTURAS E ACABAMENTOS
Terra com normal e variação de roughness; cerâmica porosa 0,88; papel fosco 0,9; madeira envelhecida; folhas de tecido/papel dobrado com espessura de malha.

## INTERAÇÕES, REGRAS E FEEDBACK
Registrar pensamento em campo HTML, associar situação/emoção/ação, plantar semente simbólica, observar possibilidades, experimentar perguntas alternativas, reorganizar o jardim sem obrigatoriedade de substituir pensamento negativo.

## ÁUDIO
Vento baixo e água distante opcionais; leitura em voz apenas sob solicitação.

## TECNOLOGIA E SISTEMAS ESPECÍFICOS
Three.js instancing de folhas e plantas; crescimento via scale + morph targets; texto renderizado em DOM ligado a IDs de sementes, dados locais editáveis.

## PROMPT INDIVIDUAL PARA GOOGLE NANO BANANA
Jardim tridimensional contemplativo fotorrealista com três canteiros, caminho sinuoso de pedras, pequena árvore com folhas como origamis de papel, sementes em bancada de madeira à esquerda e pérgola à direita, vasos de barro, luz da manhã e materiais orgânicos ricos em detalhe, sem texto legível, 16:9.

## CRITÉRIOS DE ACEITAÇÃO
1. Cena realmente tridimensional, não apenas fundo estático em 2D; câmera, peças e volumes coerentes com a referência.
2. Cada objeto principal possui ID, posição, rotação, escala, material e função no manifesto da cena.
3. Interface completa em português com navegação por teclado/toque; áudio opcional e controle de intensidade.
4. Ações executadas têm efeito visual e lógico verificável; estado pode ser reiniciado e salvo quando apropriado.
5. Captura lado a lado (referência vs implementação), ajuste da câmera e relatório de divergências.
6. Modo baixo desempenho, sem efeitos que provoquem estímulos inesperados; sem resultados diagnósticos automáticos.

---

## Plano original de DNA, jornada e cena — referência de identidade; etapas antigas são substituídas pela sequência 2.0
# 11 · JARDIM DOS PENSAMENTOS — Plano de execução
Porte **L** · **Onda 1 (piloto)** · 9+ e adultos · Emoções e autorregulação

## 1. Tese
**Um pensamento é um evento mental, não um fato — e dá para observá-lo com curiosidade, sem ter de vencê-lo.** O jardim torna o pensamento um **objeto**: escrito, plantado, olhado de perto e de longe, com perguntas que *acrescentam* possibilidades em vez de *apagar* o pensamento.
- Âncoras: **defusão cognitiva** (Hayes, Strosahl & Wilson, 1999; ACT), incluindo o prefixo *"Estou tendo o pensamento de que…"*; **descentramento** (Teasdale; MBCT); registro de pensamentos (Beck) apenas como **campos opcionais** (situação/emoção/ação).
- **Não afirma:** que existam "pensamentos negativos a substituir". Sem análise de sentimento, sem detecção de risco, sem pontuação, sem "pensamento saudável".
- **Diferença do acervo:** mundo de **papel e origami** com texto do usuário como objeto, **jardim seco e pomar**; não é botânica (Ciclos) nem templo (Santuário).

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Jardim de pedras e pomar de papel** em manhã clara |
| Verbo | **Plantar um pensamento e observar** |
| Assinatura técnica | **Folhas de origami instanciadas com vincos reais** (geometria dobrada, espessura de malha) + **crescimento por *scale* + *morph targets*** + **prefixo de distanciamento** no texto |
| Chrome | **Caderno de papel artesanal** com **borda irregular (deckle)**, fita *washi*, carimbo |
| Tipografia | Young Serif (UI) + Caveat (texto do usuário no caderno) |
| Luz/grade | Manhã, verde-sálvia, cerâmica areia, papel branco-quente |
| Áudio-assinatura | Vento baixo e água distante, opcionais |
| Artefato | **O próprio jardim** (cada pensamento = uma planta); exportar só por decisão |
| **Não pode parecer** | Estufa (Ciclos); estufa-clima (10); templo (Santuário) |

## 3. Jornada
1. Abre o **caderno**: "O que passou pela sua cabeça?" Pode ativar *Estou tendo o pensamento de que…*.
2. Campos **opcionais** de situação / emoção / ação (rótulos livres; podem ficar vazios).
3. Escolhe uma **semente** (forma e papel que **ela/ele** escolhe — não deduzidos do texto) na **bancada de sementes** e um **canteiro**.
4. **Planta**; o broto cresce devagar. Crescer não quer dizer "melhorar".
5. **Observa:** "sentar-se perto" (câmera aproxima) ↔ "ver de longe" (visão do pomar).
6. **Perguntas alternativas** (cartões na pérgola) **enxertam novos ramos** de papel na mesma planta; o pensamento original **permanece**.
7. **Reorganiza** o jardim (mover, renomear canteiros). Nada é "removido": **soltar** leva a planta para as caixas de papel da pérgola.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `caminho_pedra_S` | (0,0,7)→(0,0,−6) | curva em S |
| `canteiro_1..3` | (−4,0,−1) · (0,0,−1) · (4,0,−1) | terra com normal e roughness variando |
| `arvore_central` | (0,0,−3) h=4 m | folhas de **origami** instanciadas |
| `bancada_sementes` | (−5,0,5) | madeira envelhecida; sementes de **6 formas** distintas |
| `pergola_caixas` | (5,0,4) | caixas de papel (arquivo de pensamentos soltos) |
| `vasos`, `pedras`, `regador`, `ferramentas`, `moveis_mobiles` | espalhados | cerâmica porosa 0,88; papel 0,9 |
Câmera FOV 35°, (13,10,18)→(0,0,0). Texto do usuário **sempre em DOM**, ligado ao ID da semente.

## 5. Sistemas
- **Instancing:** folhas e brotos em `InstancedMesh`; vinco = geometria dobrada por duas faces com espessura.
- **Crescimento:** `scale` + *morph target* por planta; velocidade configurável (ou **sem animação**).
- **Modelo:** `Pensamento { id, texto, prefixo?, situacao?, emocao?, acao?, semente, canteiro, ramos[] }`.
- **Perguntas alternativas:** banco de cartões **do terapeuta** (editável) e do usuário; resposta opcional.
- **Persistência:** IndexedDB; retenção escolhida; **"esconder textos"** (modo tela compartilhada); exportar mediante decisão.
- **Ajuda agora:** botão discreto estático (CVV 188 / SAMU 192) — *sem* detecção.

## 6. Interface, bordas e ilustrações
- **Caderno:** páginas em papel com **bordas irregulares** (máscara SVG), fita washi nos cantos, carimbo "plantado" em tinta (sem texto legível na textura 3D).
- **Sementes ilustradas** em aquarela de linha (SVG), sem simbolismo fixo.
- **Cartões de pergunta**: papel creme com dobra; **sem** ícones de lâmpada/solução.
- Moldura: **margem de caderno** com furos de espiral na esquerda.

## 7. Áudio
Vento baixo e água distante opcionais; **leitura em voz** do próprio texto sob pedido (síntese local); nenhum som de "recompensa".

## 8. Acessibilidade, conforto, ética
- Texto ampliável; campo com `aria-label`; teclado percorre canteiros e plantas.
- **Linguagem de convite**, nunca de correção. Perguntas oferecidas como **possibilidades**.
- **Nunca** apagamento forçado, nem "plantas murchas" por conteúdo.
- Processamento 100 % local; sem envio de texto a serviços externos.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, banco de perguntas, textos do prefixo, rótulos opcionais | **Aprovado por você** |
| **E1** Blocking | Caminho, canteiros, árvore, bancada, pérgola, câmera | Validador; captura |
| **E2** Hero | Árvore de origami, sementes (6), vasos, pérgola, caderno | GLB; instancing; orçamento |
| **E3** Luz + assinatura | Manhã, sombras suaves, vento nas folhas, crescimento | Brotar roda a 60 fps com 40 plantas |
| **E4** Mecânica | Escrever→plantar→observar→enxertar→reorganizar→soltar | Vitest do modelo; efeito visual e lógico (planta nasce e persiste) |
| **E5** Interface | Caderno, washi, ilustrações | Contraste sobre papel ≥ 4,5:1 |
| **E6** Áudio | Vento/água/voz | Nada toca sozinho |
| **E7** Segurança | "Esconder textos", retenção, anônimo, baixo desempenho (sem sombras suaves) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Origami caro instanciado (LOD e *impostor* no pomar) · texto do usuário no 3D vs DOM (manter DOM) · tom clínico: **nunca** corrigir o usuário.

> **Piloto:** este recurso valida o núcleo de **instancing, texto como objeto, privacidade e capturas**.



## Gate de desbloqueio
Gate de decisão de identidade antes de produzir qualquer código.
