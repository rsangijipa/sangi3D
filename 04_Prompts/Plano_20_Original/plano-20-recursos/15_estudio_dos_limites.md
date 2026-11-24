# 15 · ESTÚDIO DOS LIMITES — Plano de execução
Porte **L** · Onda 3 · 8+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Dizer "não", pedir e sair de uma conversa são gestos que se ensaiam num ambiente seguro, com repetição e sem plateia.** O estúdio é um palco pequeno onde a pessoa escolhe cenário e complexidade, ensaia opções verbais e não verbais e repete quantas vezes quiser.
- Âncoras: treino de assertividade (Alberti & Emmons, 1970); ensaio comportamental; estrutura opcional de cartões inspirada em **DEAR MAN** (Linehan, 1993 — oferecida como *apoio*, não como regra); **distância estética** do teatro e do psicodrama (Landy; Moreno).
- **Não afirma:** que assertividade seja meta universal; sem pontuação; sem pressão; sem "melhor resposta".
- **Segurança:** **não é para reencenar situações traumáticas**; o botão **Sair da cena** está sempre disponível; o **modo roteiro do terapeuta** controla o conteúdo.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Teatro de ensaio intimista** de madeira e veludo |
| Verbo | **Ensaiar uma cena** |
| Assinatura técnica | **Cartões de roteiro** (DOM, aspecto datilografado) + opções **verbais** e **não verbais** (tom, distância, postura) + **cortina de veludo** com pregas em shader + **câmera lateral** para observar alternativas |
| Chrome | **Proscênio com ribalta** e **roteiro datilografado** |
| Tipografia | Courier Prime (roteiro) + Gloock (títulos) |
| Luz/grade | **Âmbar** com *barn doors*, preto fosco, cortina vinho desaturado |
| Áudio-assinatura | Falas **legendadas**; ruído de palco **desligado**; respostas podem ser **lidas** |
| Artefato | "Roteiro ensaiado" (árvore de escolhas, sem voz gravada) |
| **Não pode parecer** | Teatro de fantoches (17); cidade (13); museu (14) |

## 3. Jornada
1. Na plateia vazia, escolhe um **cenário** (recusar um convite, fazer um pedido, negociar, sair de uma conversa) e **nível** (1 a 3).
2. As duas cadeiras acendem; o **cartão de roteiro** apresenta a fala do outro personagem.
3. Escolhe **o que dizer** (cartões de frase) e **como** (tom suave/firme, distância, postura/gesto) — ou **cria a sua frase**.
4. O outro responde conforme o ramo; **câmera lateral** mostra a mesma cena de outro ângulo.
5. **Repete** sem pontuação; ou fecha a cortina (**pausa** ou **sair**).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `palco` | Z=−2→−4,5; 7 m; h=0,4 | piso de carvalho com AO nas tábuas |
| `cadeira_A` / `cadeira_B` | (−1,0,−2) / (1,0,−2) | madeira 0,6 |
| `cortina_L/R` | X=±4,5 | veludo **sheen 0,55** + normal de dobra; **sobre trilhos** |
| `luzes_teatro` | teto/laterais | **barn doors**, âmbar |
| `tapete`, `ferro_grafite` | proscênio | 0,75 |
| `proscenio` | Z=3 | área de **escolha e feedback** |
| `personagens` | 2 | manequins/figuras com rig básico, **gestos neutros** |
| `camera_lateral` | lateral | visão alternativa |
Câmera FOV 42°, (7,5,11)→(0,1.5,0).

## 5. Sistemas
- **Roteiros em árvore JSON** (cena → nós → opções) com **validador** (sempre uma saída).
- **Opções não verbais** como *cartões de parâmetros* (tom, distância, postura) que mudam **a animação e a fala exibida**, sem gravação de voz.
- **AnimationMixer** com *blend* simples de gestos (neutro, recuar, aproximar, cruzar braços, abrir mãos).
- **Nível de complexidade:** muda número de falas, relação (familiar/colega/autoridade) e comprimento.
- **Modo terapeuta:** editor de roteiro (JSON) + importação/exportação.
- **Estado:** `roteiro_ensaiado.json` — escolhas textuais.

## 6. Interface, bordas e ilustrações
- **Ribalta** como borda inferior (fileira de lâmpadas SVG com brilho suave, **sem piscar**).
- **Cartões de roteiro** em papel creme, **fonte datilografada** com margens e marcas de dobra.
- Ilustrações de **máscaras e cortinas** em linha; ícones de **tom/distância/postura** desenhados como figurinos de teatro.
- Menu "Direção de cena": cada opção é uma *marcação de palco* ("Entra", "Pausa", "Sai").

## 7. Áudio
Falas legendadas e **opcionais** (TTS local); ruído de palco desligado; **sem aplausos nem efeitos de avaliação**.

## 8. Acessibilidade, conforto, ética
- Teclado completo; leitura de cartões por leitor de tela.
- **Linguagem de ensaio, não de resultado**; nenhum retorno do tipo "você foi assertivo/a".
- **Sair da cena** retorna à plateia **sem custo**.
- Dados só locais; **sem gravação de voz**.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 cenários × 3 níveis, cartões verbais/não verbais, textos de pausa | **Aprovado por você** |
| **E1** Blocking | Palco, cadeiras, cortinas, proscênio, câmera | Validador; captura |
| **E2** Hero | Cadeiras, cortinas com pregas, luzes, personagens com rig | GLB; orçamento |
| **E3** Luz + assinatura | Âmbar, cortina em shader, ribalta | Cortina anima sem recorte; sem flicker |
| **E4** Mecânica | Árvore de roteiros, opções não verbais, repetir, câmera lateral, editor | Vitest: validador de roteiro; **repetir** reseta |
| **E5** Interface | Ribalta, cartões, ícones | Contraste; teclado |
| **E6** Áudio | TTS opcional | Nada toca sozinho |
| **E7** Segurança | Sair da cena, retenção, baixo desempenho (cortina estática) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Conteúdo que desperte situação real difícil (revisão com terapeuta + saída fácil) · cortina cara em shader (tier: normal estática) · tom "dramático" (manter acolhedor, não teatral).
