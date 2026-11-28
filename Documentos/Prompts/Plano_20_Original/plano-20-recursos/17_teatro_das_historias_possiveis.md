# 17 · TEATRO DAS HISTÓRIAS POSSÍVEIS — Plano de execução
Porte **XL** · Onda 3 (primeiro da onda) · 3+ e adultos · Expressão simbólica e narrativa

## 1. Tese
**Uma história contada por fantoches cria distância suficiente para dizer o que, em primeira pessoa, seria difícil — e liberdade suficiente para brincar.** A pessoa monta o palco, dá vida aos personagens, grava a sequência e conta.
- Âncoras: brincar não diretivo (Axline, 1947); **o brincar como espaço de experiência** (Winnicott, 1971); fantoches em terapia e educação (Bernier & O'Hare, 2005); **externalização narrativa** (White & Epston, 1990).
- **Não afirma:** que personagem, cor, cenário ou final escolhido "signifiquem" algo; **sem inferência psicológica** de nenhum tipo, sem projetivo, sem análise de enredo.
- **Diferença do 15:** o 15 é ensaio **com roteiro**; o 17 é **criação livre**, sem cena prescrita.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Teatro de marionetes artesanal** de madeira mel e veludo azul-petróleo |
| Verbo | **Dar vida e gravar a história** |
| Assinatura técnica | **Fantoches de vara articulados** (cabeça, mãos, corpo com pivôs) + **cenário em 3 camadas de papel** com *parallax* + **linha do tempo gravável de estados** (sem vídeo) |
| Chrome | **Boca-de-cena de papel recortado** (festões) e **programa de teatro** |
| Tipografia | Fraunces (títulos) + Patrick Hand (texto do usuário) |
| Luz/grade | Âmbar macio; papel pintado; irregularidade de feito à mão |
| Áudio-assinatura | Efeitos de palco **leves e sob demanda**; trilha original **opcional**; silêncio permitido |
| Artefato | "Roteiro da história" (linha do tempo + narração digitada), exportável **com consentimento** |
| **Não pode parecer** | Teatro de ensaio (15); casa de memórias (20) |

## 3. Jornada
1. Vê o palco vazio, a **mesa de personagens** à esquerda e os **depósitos de cenários** à direita.
2. **Arrasta** personagens ao palco; **muda de cenário** (3 camadas: fundo, meio, frente).
3. **Manipula** cabeça, mãos e posição com as varas (alças).
4. **Controla a luz** (3 luzes de cena).
5. **Grava** estados na linha do tempo (cada "cena" = um estado), **narra** por digitação (ou áudio local opcional) e **assiste** à peça; recomeça quando quiser.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `palco` | 6×3 m, h=1,0 | madeira com lascas discretas; **duas coxias** |
| `cortina_Z−3` | eixo Z=−3 | veludo azul-petróleo |
| `camada_cenario_1..3` | Z=−4, −3, −2 | **papel cartão rugoso com espessura real** |
| `mesa_personagens` | (−4,0,2) | madeira |
| `depositos_cenarios` | (4,0,2) | compartimentos |
| `fantoche_*` | mesa/palco | **animais, pessoas, seres imaginários**; madeira/feltro |
| `arvores_papel`, `casinhas`, `nuvens`, `pedras`, `barco`, `portas` | camadas | recortes pintados |
| `varas_controle`, `luzes_cena` | palco | 3 luzes |
Câmera FOV 40°, (8,5.5,11)→(0,2,0).

## 5. Sistemas
- **Fantoches:** hierarquia `corpo → cabeça`, `mão_L/R` com **pivôs separados**; poses por *AnimationMixer* + alças restritas (*transform controls limitados*).
- **Camadas de cenário:** troca por "gaveta"; *parallax* sutil com a câmera.
- **Linha do tempo:** lista de **estados** `{ personagens[], poses, camadas, luz, narracao }`; reprodução com interpolação suave.
- **Sem gravação de vídeo nem de voz**; áudio local só se o usuário optar.
- **Exportação:** JSON/Markdown **com consentimento**; apagar tudo.
- **Estado:** `historia.json`.

## 6. Interface, bordas e ilustrações
- **Boca-de-cena** de papel recortado (SVG, camadas, sombras de papel) como **moldura** do canvas.
- **Programa de teatro** (ficha com título editável) como painel de linha do tempo; **ingressos** como botões de cena.
- **Ilustrações de personagens** (miniaturas desenhadas) nos cartões da mesa.
- Controles **grandes** para 3+; adulto vê opções avançadas.

## 7. Áudio
Efeitos leves (passos de papel, vento de cortina, gotas) **sob demanda**; trilha original gerada, em loop calmo, **opcional**; silêncio como padrão.

## 8. Acessibilidade, conforto, ética
- Todas as ações por **botões** (adicionar/remover/mover) além do arrastar.
- Descrição `aria-live` da cena ("Coelho entrou à esquerda; luz âmbar").
- **Nada é interpretado.** O app apenas registra posições e texto.
- Crianças 3+: portão do adulto para exportar/configurar.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Elenco (animais/pessoas/seres), cenários, nomenclatura neutra | Aprovado |
| **E1** Blocking | Palco, mesa, depósitos, 3 camadas, câmera | Validador; captura |
| **E2** Hero | Palco, 8–10 fantoches, 8 cenários de papel, varas | GLB; pivôs; orçamento |
| **E3** Luz + assinatura | Âmbar macio, papel com espessura, *parallax* | Camadas sem *z-fighting* |
| **E4** Mecânica | Arrastar, articular, camadas, luz, linha do tempo, exportar | Vitest: gravar→reproduzir devolve **os mesmos estados**; exportar só com consentimento |
| **E5** Interface | Boca-de-cena, programa, ingressos | Contraste; teclado |
| **E6** Áudio | Efeitos e trilha | Nada toca sozinho; pico ≤ teto |
| **E7** Segurança | Portão do adulto, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Articulação por toque (alças grandes + modo por botões) · peso de muitos fantoches (instancing nas camadas de fundo) · tentação de "ler" o enredo (remover qualquer análise).
