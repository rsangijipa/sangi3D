# 05 · ESTAÇÃO DAS TROCAS — Plano de execução
Porte **XL** · Onda 4 · 5–14 · Atenção, planejamento e funções executivas

## 1. Tese
**Mudar de regra é uma habilidade que se treina melhor com aviso, apoio e sem punição.** O jogador organiza passageiros segundo uma regra visível e, depois de um aviso, a regra troca (cor → destino → tipo de bilhete).
- Âncoras: o formato lembra a *Dimensional Change Card Sort* (Zelazo, Frye & Rapus, 1996) e o *Wisconsin Card Sorting* (Berg, 1948) — usados aqui **só como inspiração de mecânica**; andaimes (Wood, Bruner & Ross, 1976).
- **Não afirma:** avaliação de flexibilidade cognitiva ou de funções executivas. Sem escore, norma, tempo-alvo nem percentil.
- **Registro (descritivo):** tentativas, pedidos de ajuda e a estratégia que a criança nomeou, **por rodada**.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estação ferroviária vitoriana** em miniatura (tijolo, cobre, relógio de torre) |
| Verbo | **Embarcar conforme a regra — que muda** |
| Assinatura técnica | **Quadro de partidas *split-flap*** em DOM (as plaquinhas viram para anunciar a regra) + **desvios de trilho com alavanca** + vapor |
| Chrome | **Placas esmaltadas** com rebites de latão; menus como **bilheteria** (guichê, carimbo) |
| Tipografia | Zilla Slab (placas) + Oswald (sinalização) |
| Luz/grade | Dourada matinal; tijolo queimado e cobre oxidado |
| Áudio-assinatura | Apito **baixo** opcional + "rodagem" do trem + clique de encaixe discreto |
| Artefato | "Diário de rodadas" |
| **Não pode parecer** | Torre (07, também mecânica); porto (08); sala (06) |

## 3. Jornada
1. Plataforma tranquila; quadro *split-flap* mostra a regra: "Cor da jaqueta → vagão".
2. Arrasta os passageiros aos vagões (snap em grid); acerto = porta abre; **erro = passageiro volta à plataforma com um passo gentil**, sem som negativo.
3. **Aviso** (visual, sino opcional): "a regra vai mudar". Quadro vira para "Destino" (pictograma de estação).
4. Mais uma troca: "Tipo de bilhete" (formas: círculo, triângulo, quadrado).
5. Fecha a rodada nomeando o que ajudou ("olhei o bilhete antes", "repeti a regra").

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `plataforma_1..3` | X=−6, 0, 6 (eixo Z) | concreto claro, faixa tátil |
| `edificio_estacao` + `torre_relogio` | (0,0,−6) | tijolo c/ variação; **engrenagens aparentes**, cobre oxidado metal 0,75 |
| `sala_espera` | (−10,0,−5) | bancos de madeira 0,65 |
| `paineis_regras` | margem frontal Z=7 | placas **sem texto na textura**; texto no DOM |
| `trilho_1..3`, `trem_1..3` | do fundo ao 1º plano | aço trilho 0,9; vagões com **portas articuladas**, pintura 0,42 + AO nas juntas |
| `passageiro_*` | plataformas | atributos configuráveis: cor, destino, bilhete (forma) |
| `cancelas`, `relogios_partida` | trilhos | animação simples |
Câmera FOV 35°, (17,14,20)→(0,0,0). O jogador **vê todos os passageiros e vagões**.

## 5. Sistemas
- **RuleEngine** (máquina de estados JSON): regras plugáveis; sequência configurável por você (quando troca, quantas rodadas, se há aviso, dicas, tempo livre).
- **Dicas em escada:** 1) destaca o atributo da regra; 2) destaca o grupo; 3) mostra um exemplo resolvido.
- **Desfazer** ilimitado; **sem cronômetro** por padrão.
- **Trem:** tween (GSAP ou próprio) com aceleração suave; sem física.
- **Passageiros:** geometria estilizada (corpo + cabeça + cartão), 3 poses distintas; diversidade de aparência sem estereótipo.
- **Estado:** `rodadas.json`.

## 6. Interface, bordas e ilustrações
- **Quadro split-flap** DOM com animação de "virar" (CSS 3D), som opcional de cliques baixos.
- Placas esmaltadas (SVG) com **rebites e quinas arredondadas**; ícones de destino desenhados como **pictogramas ferroviários**.
- **Bilheteria:** menu "Opções" como guichê com cartões de bilhete (formas) que explicam as regras.
- Moldura: **janela de vagão** em madeira com latão.

## 7. Áudio
Apito curto e grave (opcional), rodagem em loop suave, "clique" de cancela, **sem sons de erro**. Modo **sem sons e sem cronômetro** garantido.

## 8. Acessibilidade, conforto, ética
- Arrastar tem **alternativa**: selecionar passageiro e vagão por botões/teclado.
- A regra sempre **visível e verbalizada** (texto + pictograma); nunca só cor.
- Aviso de troca **antes** (nunca surpresa), configurável a 0 para quem quiser treinar surpresa.
- Resultados descritivos; **sem "acertou x%".**

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Regras, pictogramas, textos de dica e de aviso | Aprovado |
| **E1** Blocking | Plataformas, trilhos, edifício, câmera | Validador; captura |
| **E2** Hero | Estação, torre com engrenagens, trem/vagões com portas, passageiros | Pivôs de porta; GLB; orçamento |
| **E3** Luz + assinatura | Luz dourada, vapor, **split-flap** | Quadro vira em sincronia com a regra |
| **E4** Mecânica | RuleEngine, snap, dicas, desfazer, diário | Vitest: cada regra valida corretamente; troca só após aviso; desfazer restaura estado |
| **E5** Interface | Placas, bilheteria, moldura | Contraste; teclado |
| **E6** Áudio | Apito/rodagem/clique | Pico ≤ teto |
| **E7** Segurança | Sem cronômetro, anônimo, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Passageiros sobrepostos no mapa (aumentar hitboxes, agrupar na plataforma) · dificuldade de rodada (parametrizar, nunca adaptar sozinho) · **todos veem tudo** no enquadramento, calibrar altura/FOV.
