# 13 · CIDADE DAS CONVERSAS — Plano de execução
Porte **XL** · Onda 3 · 7+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Conversar se ensaia, e quase toda situação tem mais de um caminho válido.** O usuário escolhe um lugar e uma pessoa, lê ou ouve a situação, escolhe (ou escreve) o que dizer e vê **o que pode acontecer** — podendo refazer, pedir ajuda ou pausar.
- Âncoras: ensaio comportamental / *role-play*; histórias sociais (Gray, 1991 — evidência mista, usadas como **formato**, não como regra); **problema da dupla empatia** (Milton, 2012): o mal-entendido entre pessoas com estilos diferentes é **bidirecional**; prática afirmativa da neurodiversidade; reparo de conversa ("pode repetir?").
- **Não afirma:** avaliação de habilidades sociais, "resposta certa", comportamento "adequado". Contato visual, fala e ritmo **diferentes não são punidos nem corrigidos**.
- **Diferença dos vizinhos:** o 15 ensaia **limites** num palco; o 14 trata **perspectiva**; o 13 percorre **lugares comuns** com ramos de conversa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Bairro em miniatura** com 4 lugares (biblioteca, cafeteria, praça, parada de ônibus) |
| Verbo | **Conversar por ramos** |
| Assinatura técnica | **NPCs com rig e *AnimationMixer*** + **balões HTML ancorados na cabeça** de cada pessoa + **"ver duas possibilidades"** (dois ramos lado a lado) |
| Chrome | **Sinalização de transporte** (placas, mapa de linhas) e balões de estilos distintos |
| Tipografia | Atkinson Hyperlegible (diálogos) + Archivo (sinalização) |
| Luz/grade | Diurna clara; tijolo creme, verde de árvores, asfalto azul-acinzentado |
| Áudio-assinatura | **TTS opcional + legendas sincronizadas**; ambiente muito suave |
| Artefato | "Caminho da conversa" (sequência de escolhas) para revisar com terapeuta |
| **Não pode parecer** | Cidade-maquete de som (01); palco (15); museu (14) |

## 3. Jornada
1. Vista aérea do bairro; escolhe **um dos quatro lugares** e **uma pessoa**.
2. A câmera aproxima; a cena **pausa** e o balão apresenta a situação (texto + voz opcional).
3. Escolhe entre **3–4 respostas** (nenhuma "certa"; inclui *dizer que precisa de um tempo* e *sair da conversa*) **ou** escreve a sua.
4. Vê **o que pode acontecer** (duas ou três continuações plausíveis; não determinismo) e escolhe seguir uma.
5. **Refazer**, **pedir ajuda** (opções de reparo) ou **concluir**; no fim, "Revisão com terapeuta" mostra o caminho.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `cruzamento` | (0,0,0) | **faixa de pedestre** acessível; semáforo visual acessível |
| `biblioteca` | (−14,0,−10) | janelas, livros, mesas |
| `cafeteria` | (12,0,−11) | balcão, mesas, **máquina de venda** |
| `praca` | (−11,0,9) | banco, árvores sombreadas |
| `parada_onibus` | (13,0,8) | abrigo, banco, painel |
| `calcadas_acessiveis` | contornam | rampas, piso tátil |
| `npc_*` | por local | **poses distintas**, expressões sutis, diversidade (idades, corpos, tons, apoios de mobilidade/audição) |
| `bicicleta`, `objetos` | rua | cotidiano |
**Espaço central desobstruído** para balões HTML. Câmera FOV 37°, (30,19,35)→(0,0,0).

## 5. Sistemas
- **Grafo de diálogo em JSON** (`nó { fala, opções[], efeitos }`), com **validador**: sem becos sem saída, **sempre** há uma saída ("sair da conversa").
- **Frase livre:** o texto do usuário entra no balão como fala dele; **sem NLP/IA**; o app oferece continuações **pré-escritas** para escolher.
- **NPCs:** rig procedural (esqueleto + malha) com *idle*, *falar*, *ouvir/assentir*, *acenar*, *sentar*, *andar*; blendshapes sutis de sobrancelha/boca.
- **TTS local** (quando compatível) com legendas; **modo textual equivalente**.
- **Densidade** de pessoas em cena (0–3) e volume ambiente ajustáveis.
- **Estado:** `caminho.json` (apenas escolhas), exportável.

## 6. Interface, bordas e ilustrações
- Balões **HTML** com **caudas diferentes** por tipo: fala · pensamento *(somente se o usuário optar por "ver possibilidades")* · narração.
- **Moldura de placa de ponto de ônibus** (SVG) e **mapa de linhas** como seletor de lugar.
- Ilustração: **pictogramas de reparo** ("repetir", "tempo", "ajuda", "sair").
- Botões grandes com ícones; foco com **contorno amarelo-escuro** de alto contraste.

## 7. Áudio
Ambiente de bairro **muito suave**, com opção de silêncio; vozes por TTS (voz escolhida pelo usuário, velocidade ajustável); sem microfone **nem gravação** por padrão.

## 8. Acessibilidade, conforto, ética
- **Sem pontuação**, sem "correto/errado", sem avaliar contato visual.
- Linguagem sobre o outro: "**pode** estar pensando…" apenas como **hipótese**; opcional.
- "Pausa" congela a cena; "Pedir ajuda" nunca encerra.
- Modo terapeuta: edição do grafo e exportação do caminho.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 situações × ramos, repertório de reparo, textos; **revisão neuroafirmativa** | Aprovado |
| **E1** Blocking | Bairro, quarteirões, câmera | Validador; captura |
| **E2** Hero | 4 edifícios, praça, 8–10 NPCs com rig | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Luz diurna, balões ancorados, **duas possibilidades** | Balão segue NPC sem sobrepor outros |
| **E4** Mecânica | Grafo, validador, frases livres, refazer, ajuda | Vitest: todo nó alcança saída; export correto |
| **E5** Interface | Sinalização, balões, pictogramas | Contraste; teclado |
| **E6** Áudio | TTS + legendas | Legenda sincronizada |
| **E7** Segurança | Densidade, modo textual, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Rigs procedurais convincentes (ficar em estilo **estilizado**, não realista) · estereótipos (revisão de elenco e roteiros) · TTS variável por navegador (fallback textual).
