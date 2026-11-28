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
