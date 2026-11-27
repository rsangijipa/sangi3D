# 14 · MUSEU DOS PONTOS DE VISTA — Plano de execução
Porte **L** · Onda 3 · 8+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**O que alguém vê, o que lhe contaram e o que ele não tem como saber são coisas diferentes — e dá para olhar isso com geometria.** O museu mostra o *campo de visão* de cada personagem numa cena em miniatura e separa **viu · ouviu contar · não dá para saber**.
- Âncoras: tomada de perspectiva visual níveis 1–2 (Flavell et al., 1981); tarefa das **três montanhas** (Piaget & Inhelder, 1948); "ver leva a saber" (Pratt & Bryant, 1990); estados epistêmicos; a lógica da falsa crença (Wimmer & Perner, 1983) como inspiração de cenário.
- **Não afirma:** avaliação de teoria da mente; que linha de visão = o que a pessoa pensa. A visão é **geometria**; interpretar é do usuário.
- **Não define uma interpretação universal.**

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Museu de dioramas** marfim e nogueira, luz de galeria |
| Verbo | **Ver pelos olhos de outra pessoa** |
| Assinatura técnica | **Câmera por personagem** (visão em quadro dentro do quadro) + **cone de visão** com oclusão por *raycast* + **vitrine rotativa** com engrenagens + **espelhos por reflexão pré-renderizada** |
| Chrome | **Molduras douradas/bronze**, plaquetas de museu, **audioguia** como controle |
| Tipografia | Bodoni Moda (títulos) + Libre Franklin (leitura) |
| Luz/grade | Galeria direcional, sombras suaves; marfim, nogueira, bronze, veludo cinza |
| Áudio-assinatura | Narração opcional + som contextual de **cada diorama** |
| Artefato | "Livro de observações" (viu/ouviu/não sabe + hipóteses) |
| **Não pode parecer** | Galeria de texturas (04); cidade (13); palco (15) |

## 3. Jornada
1. No salão, a **vitrine rotativa** apresenta os três dioramas; escolhe um pedestal.
2. **Alterna entre as câmeras** das três pessoas do diorama; vê a cena do ponto de vista de cada uma.
3. **Revela o cone de visão** (geometria) e vê o que fica fora dele.
4. **Arrasta cartões de fatos** para as colunas **viu · ouviu contar · não dá para saber**.
5. **Testa hipóteses** movendo uma peça (uma divisória, uma caixa) e vendo o que muda; **compara relatos** que divergem e reconhece **informação desconhecida**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `vitrine_rotativa` | (0,0,0) | vidro e bronze; **engrenagens** visíveis |
| `diorama_A` | (−4,0,−3) | "Duas cadeiras e uma divisória" (visão) |
| `diorama_B` | (4,0,−3) | "Quem viu e quem soube" (viu × ouviu contar) |
| `diorama_C` | (0,0,4) | "A caixa fechada" (informação desconhecida) |
| `espelhos_L/R` | paredes laterais | **cube probes** estáticos |
| `molduras_vazadas`, `janelas_observacao` | paredes | |
| `personagens` | 3 por diorama | material tecido; **linha de visão** representável |
**Tela de leitura** em HTML fora do canvas. Câmera FOV 39°, (10,7.5,13)→(0,1.5,0).

## 5. Sistemas
- **Múltiplas `PerspectiveCamera`**; *picture-in-picture* por *render target* pequeno (256²), **atualizado só sob demanda**.
- **Cone de visão:** frustum limitado em ângulo + **raycast de oclusão**; objetos fora/ocultos recebem sombreamento "não visto".
- **FSM narrativa** por diorama; **cartões de fatos** com tipos de evidência ("vi", "me contaram", "não sei").
- **Snapshots** de escolhas + **análise descritiva** ("você colocou 3 fatos em *viu*, 1 em *não sei*") — sem avaliação.
- **Espelhos:** *CubeCamera* renderizada uma vez por diorama.

## 6. Interface, bordas e ilustrações
- **Moldura dourada** (SVG, relevo) em torno da tela de leitura; **plaquetas** com número de sala.
- **Audioguia:** botão redondo e display "analógico" em DOM (sem texto embutido em textura).
- Ilustração de **olho/cone** em linhas finas; diagramas "vista de cima" do campo de visão.
- Livro de observações com **colunas** pintadas à mão.

## 7. Áudio
Narração opcional em voz sintetizada local, **sons contextuais por diorama** (conversa abafada, objetos), botão para desativar; legendas.

## 8. Acessibilidade, conforto, ética
- Cada câmera tem **botão e teclado**; descrição textual do que cada pessoa vê.
- Linguagem de **hipótese**: "pode ser que…"; nunca "ele sabe".
- Sem escores; sem "resposta certa"; **"não dá para saber"** é resposta legítima.
- Crianças 8+: poucos fatos por vez; adulto edita cartões.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 3 cenários, cartões de fatos, textos neutros | Aprovado |
| **E1** Blocking | Salão, vitrine, 3 pedestais, câmera | Validador; captura |
| **E2** Hero | Vitrine com engrenagens, 3 dioramas, personagens, molduras | GLB; orçamento |
| **E3** Luz + assinatura | Luz de galeria, PiP, **cone de visão** | Cone **bloqueado** por divisória (teste de oclusão) |
| **E4** Mecânica | Câmeras, cartões, hipóteses, relatos | Vitest: classificação de fatos; visibilidade geométrica |
| **E5** Interface | Molduras, audioguia, livro | Contraste; teclado |
| **E6** Áudio | Narração + contextual | Pico ≤ teto |
| **E7** Segurança | Render sob demanda, retenção, baixo desempenho (sem PiP) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Custo de PiP (resolução baixa + sob demanda) · tentação de "tirar conclusão" sobre a mente → texto revisado · conteúdo de falsa crença muito "escolar" (variar cenários).
