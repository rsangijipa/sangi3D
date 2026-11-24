# 06 · OFICINA DO TEMPO — Plano de execução
Porte **L** · Onda 2 · 7+ e adultos · Atenção, planejamento e funções executivas

## 1. Tese
**O tempo é invisível; a oficina o torna objeto.** A pessoa prevê quanto uma tarefa leva, faz a tarefa na vida real, e compara — sem nota, sem relógio apressando.
- Âncoras: falácia do planejamento (Kahneman & Tversky, 1979); estimativa de tempo prospectiva × retrospectiva (Block & Zakay); intenções de implementação (Gollwitzer, 1999); apoios visuais ao tempo descritos na literatura de funções executivas (p.ex. Barkley).
- **Não afirma:** diagnóstico de TDAH, "cegueira ao tempo", ou capacidade de estimar. Sem ranking nem pressão de velocidade.
- O app **não mede a tarefa por conta própria**: a tarefa é na vida real ("arrumar a mochila"); o relógio apenas registra o que a pessoa dispara/pausa.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Ateliê de relojoaria** de madeira caramelo, latão, granito |
| Verbo | **Estimar → medir → comparar** |
| Assinatura técnica | **Movimento de relógio funcional** (trem de engrenagens com razões reais) + **ampulheta de areia** (shader de nível + fio de partículas) + **ponteiro-fantasma** da previsão |
| Chrome | **Bisel de latão** e gravação *guilloché*; botões de coroa |
| Tipografia | Cinzel (numerais romanos, gravura) + EB Garamond |
| Luz/grade | Âmbar lateral, sombras longas, latão envelhecido |
| Áudio-assinatura | Tique-taque e metrônomo **desligados por padrão** |
| Artefato | "Previsto × Levou" por tarefa (sem ranking) |
| **Não pode parecer** | Estação (05, também engrenagens); torre (07) |

## 3. Jornada
1. Escolhe uma **tarefa** (cartão: "arrumar a mochila", "escovar os dentes", ou cria a sua).
2. **Estima** arrastando um arco-sombra sobre o relógio grande (previsão).
3. Inicia o cronômetro (**visível ou oculto**, escolha dela/dele); pode **pausar**.
4. Ao terminar, o **ponteiro real** encontra o **fantasma** da previsão; a oficina mostra a diferença **descritivamente** ("levou um pouco mais / bem perto / bem menos").
5. Monta uma **sequência** de etapas com intervalos e escolhe **avisos de transição** (ampulheta quase vazia).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `bancada_principal` | (0,0,0) 3,6×0,95; tampo y=0,85 | madeira com poros e veios |
| `relogio_grande` | sobre a bancada | **desmontável**: caixa, mostrador, ponteiros com **pivôs**, mecanismo visível |
| `parede_relogios` | Z=−4 | **seis relógios diferentes** (pêndulo, cuco, digital de lâminas, sol, solar, de parede simples) |
| `torre_ampulhetas` | (−3,0,−2) | **3 ampulhetas** de durações visuais distintas |
| `quadro_cronograma` | (3,1,−3) | cartões de tarefas móveis; DOM para texto |
| `prateleiras_engrenagens` | variadas | latão 0,85/0,38 |
| `metronomo` (opcional), `mostrador_previsao_duracao` | bancada | |
Câmera FOV 39°, (8,5.5,9)→(0,1,0).

## 5. Sistemas
- **Engrenagens com razões corretas** (minutos:horas = 12:1, escape/pêndulo ilustrativo) — animação procedural por transformações.
- **Ampulheta:** fração de nível por duração configurável; fio de areia em partículas; **não** é fonte de verdade do tempo (o tempo vem do relógio do sistema).
- **Estimativa → medição → comparação:** `TarefaRegistro { nome, previsto_s, real_s, pausas }`; diferença descrita em faixas amplas e **neutras**.
- **Sequência de etapas:** arrastar cartões; inserir intervalo; aviso de transição configurável (X min antes).
- **Persistência:** IndexedDB; exportar.
- Opção **"não mostrar o tempo enquanto faço"**.

## 6. Interface, bordas e ilustrações
- **Moldura de bisel** circular em torno do relógio-controle; botões com **gravação** e coroa (clique-gire para ajustar).
- Cartões de tarefa como **etiquetas de oficina** (papel com bordas e fibras).
- Ilustrações: **corte técnico do mecanismo** (SVG) que explica "um minuto = 60 segundos = uma volta do ponteiro" sem texto longo.
- Painel "Previsto × Levou" com **dois arcos concêntricos** (previsto fantasma, real sólido).

## 7. Áudio
Tique-taque e metrônomo opcionais, volume baixo, frequência baixa (sem agudos); toque suave de **"sineta"** ao fim, sempre desativável.

## 8. Acessibilidade, conforto, ética
- Linguagem sem julgamento ("levou mais **do que eu previa**", nunca "atrasou").
- Alternativa numérica para o arco; teclado ajusta em passos de 1 min.
- Sem comparações entre pessoas; sem meta de velocidade.
- Para crianças 7+: ampulhetas coloridas como apoio; adulto configura as durações.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Tarefas-exemplo, vocabulário neutro de comparação | Aprovado |
| **E1** Blocking | Bancada, parede, torre, quadro, câmera | Validador; captura |
| **E2** Hero | Relógio desmontável, 6 relógios, 3 ampulhetas, engrenagens | Pivôs de ponteiros; GLB |
| **E3** Luz + assinatura | Âmbar, ampulheta com areia, **ponteiro-fantasma** | Fantasma e real convergem corretamente |
| **E4** Mecânica | Estimar, cronometrar, comparar, sequenciar, avisos | Vitest: razões de engrenagem, diferença prevista×real, pausa não perde tempo |
| **E5** Interface | Bisel, cartões, corte técnico | Contraste; teclado |
| **E6** Áudio | Tique-taque/metrônomo/sineta | Desligados por padrão; pico ≤ teto |
| **E7** Segurança | IndexedDB, retenção, baixo desempenho (areia sem partículas) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Tempo real × animação (usar `performance.now()` e relógio do sistema, nunca frames) · aba em segundo plano (compensar por timestamps) · ansiedade com cronômetro visível → opção oculta.
