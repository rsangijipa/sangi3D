# 07 · TORRE DO IMPULSO — Plano de execução
Porte **XL** · Onda 4 · 5–15 · Atenção, planejamento e funções executivas

## 1. Tese
**Entre o sinal e a ação cabe uma pausa que se pode treinar.** A criança observa esferas descendo e decide *liberar* ou *aguardar* segundo um sinal, praticando "parar, pensar, agir".
- Âncoras: formato inspirado em *Go/No-Go* e *Stop-signal* (Logan & Cowan, 1984) como **mecânica**; autoinstrução verbal "pare–pense–aja" (Meichenbaum & Goodman, 1971); intenções "se–então" (Gollwitzer). Adiamento de gratificação (Mischel) **não é usado** como mecânica, por ressalvas de replicação (Watts, Duncan & Quan, 2018).
- **Não afirma:** teste de atenção/impulsividade, TDAH, "latência normal". A latência registrada é **descritiva e sem comparação**.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Torre mecânica de laboratório** (grafite, vidro esverdeado, luz uniforme) |
| Verbo | **Esperar o sinal** |
| Assinatura técnica | **Física real (Rapier)**: esferas rolando em **tubos espirais**, **comportas articuladas** e **luzes-torre de sinal** (formas + cores) |
| Chrome | **Painéis de instrumento** (estilo cabine) com lâmpadas e interruptores grandes |
| Tipografia | B612 + B612 Mono (desenhada para legibilidade em cabine) |
| Luz/grade | Uniforme de laboratório, esferas âmbar/azul como únicos acentos |
| Áudio-assinatura | Clique mecânico + rolagem **suaves**; **sem alarmes** |
| Artefato | "Registro de respostas" (tipo + latência) sem comparação |
| **Não pode parecer** | Estação (05); relógio (06); parque de diversões |

## 3. Jornada
1. Vê a torre; as esferas **ainda não** descem. Treino: o sinal aparece e a esfera segura.
2. Com o sinal **A** (símbolo ◆ âmbar): *liberar*. Com o sinal **B** (símbolo ● azul): *aguardar*. Regras configuráveis.
3. **Pausa de transição**: ao trocar de regra, a torre **para** e o painel convida a "respirar e reler a regra" (sem tempo), com botão **Pronto**.
4. Depois de cada escolha, **explica** a decisão com cartões (*vi o sinal · quis tentar · não tenho certeza*), sem julgamento.
5. Vê seu registro de hoje (descritivo).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `torre_corpo` | (0,0,0) r=2,6; h=11 | aço grafite metal 0,8/0,35 |
| `anel_passarela_1..3` | Y=2,5 · 5,5 · 8,5 | passarelas circulares |
| `tubo_espiral` | Y=9→1,2 | vidro reforçado `transmission` 0,75, **espessura** |
| `comporta_L/R` | (±1,5, 4, 0) ⚠ ambiguidade | articuladas com **pivôs** |
| `base_coleta` | Z=3 | **3 nichos** |
| `esferas` | no topo | cerâmica 0,38; cor + **símbolo** |
| `sensores`, `alavancas`, `paineis_estado` | anéis | LEDs emissivos **discretos** |
Câmera FOV 37°, (10,8,15)→(0,6,0).

## 5. Sistemas
- **Rapier** (carregado sob demanda, ~WASM): esferas dinâmicas; tubo como **cadeia de colliders simples** (cápsulas), não malha triangulada; comportas cinemáticas.
- **Modo determinístico (móvel/baixo):** esferas seguem **spline** com gravidade simulada por curva — mesma regra, sem WASM.
- **RuleEngine:** sinais → ação esperada; resultado = *acordou com a regra / não*, mas apresentado como **evento neutro** ("liberou com o sinal azul").
- **Registro:** tipo de resposta + latência de interação (ms) — **não comparado**, não exibido como "lento/rápido".
- **Estado:** `respostas.json`; reiniciar zera.

## 6. Interface, bordas e ilustrações
- Painéis em **metal escovado** com parafusos; **lâmpadas-torre** (3 níveis) em SVG animado; interruptores grandes ("LIBERAR", "AGUARDAR", "PRONTO").
- **Selo "pausa"** (SVG) que aparece nas transições.
- Ilustração: **diagrama do trajeto** (esfera → tubo → comporta → nicho).
- Nenhum vermelho de alerta; **forma + posição + texto** carregam o sinal, a cor apenas apoia.

## 7. Áudio
Clique mecânico grave e curto; rolagem em rampa; feedback de encaixe suave; **sem buzina/alarme**. Tudo opcional; modo sem som.

## 8. Acessibilidade, conforto, ética
- **Sem tempo** por padrão; "Prática" e "Jogo livre" separados.
- Alternativa por teclado (Espaço = liberar; "A" = aguardar) e botões grandes.
- Reduzir movimento: esferas viram **passos discretos** em vez de queda contínua.
- A criança nunca "perde": esferas não liberadas são reaproveitadas.
- Linguagem de pausa como **conquista de escolha**, não de controle.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Sinais, regras, textos de pausa, vocabulário de explicação | Aprovado |
| **E1** Blocking | Torre, anéis, tubo (caixa), câmera; resolver ambiguidade dos portões | Validador; captura |
| **E2** Hero | Torre, tubos espirais, comportas, esferas, painéis | Pivôs; GLB; orçamento |
| **E3** Luz + assinatura | Luz uniforme, lâmpadas-torre, brilho discreto | Sem flicker; bloom contido |
| **E4** Mecânica | Rapier + modo determinístico, RuleEngine, pausas, registro | Vitest: regras e transição; **mesmo resultado nos dois modos** |
| **E5** Interface | Painéis, selos, diagrama | Contraste; teclado |
| **E6** Áudio | Cliques/rolagem | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho, retenção | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Estabilidade de esferas em tubo espiral (colisores simples + limite de velocidade + *failsafe* de teletransporte para a base) · peso do WASM (sob demanda + modo determinístico) · interpretação clínica da latência (deixar claro "descritivo, sem norma").
