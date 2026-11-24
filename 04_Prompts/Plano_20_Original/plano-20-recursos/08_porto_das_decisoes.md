# 08 · PORTO DAS DECISÕES — Plano de execução
Porte **XL** · Onda 4 · 8+ e adultos · Atenção, planejamento e funções executivas

## 1. Tese
**Planejar é antecipar etapas, limites e plano B.** O usuário distribui cargas entre barcos de capacidades distintas e traça rotas; depois **executa a simulação**, vê o resultado e compara alternativas.
- Âncoras: planejamento com restrições (formato próximo da *Torre de Londres*, Shallice, 1982); terapia de solução de problemas (D'Zurilla & Goldfried, 1971; Nezu): definir, gerar alternativas, avaliar, escolher, verificar; fragmentação para memória operacional (Baddeley); planos "se–então".
- **Não afirma:** avaliação de funções executivas. Comparação entre planos é **do próprio usuário**, sem "melhor/pior".

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Porto de armazéns de tijolo** com píeres de madeira |
| Verbo | **Planejar rota e carga** |
| Assinatura técnica | **Água de Gerstner simplificada** com normal animada + **espuma só em torno do casco** (rastro por decal) + **rotas Catmull-Rom arrastáveis** + **A\*** |
| Chrome | **Cordas**, carta náutica de pergaminho, **carimbos em estêncil** e cartões de pedido com pictogramas |
| Tipografia | Alegreya (corpo) + Stardos Stencil (caixotes/carimbos) |
| Luz/grade | Natural suave, mar azul petróleo, ferrugem desaturada |
| Áudio-assinatura | **Três canais independentes** (ondas, sinos, gaivotas) |
| Artefato | **Plano A × Plano B** lado a lado (viagens, caixas, distância) |
| **Não pode parecer** | Ilha (12); arquipélago (18, também água); cidade (13) |

## 3. Jornada
1. Vê três **cartões de pedido** (pictograma de carga + destino + quantidade).
2. **Aloca caixotes** nos barcos observando a capacidade de cada um (indicador visual de lotação).
3. **Traça a rota** arrastando pontos: a linha Catmull-Rom segue; o A\* evita píeres e boias.
4. **Executa** a simulação (0,5×–3×). Pedidos podem mudar no meio (configurável, **sem punição**).
5. **Refaz** e **compara alternativas** (Plano A × B).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `mar` | Z=3..16 | água Gerstner; cor azul petróleo |
| `pier_1`, `pier_2` | X=−7, X=6 | tábuas com veios, rug 0,85 |
| `deposito` | (−10,0,−10) | tijolo, portas |
| `mercado` | (8,0,−9) | tijolo, toldos |
| `farol` | (15,0,0) | baixo |
| `barco_1..3` | (−6,0,8) · (5,0,8) · (0,0,13) | capacidades **distintas** |
| `guindaste`, `ponte_movel`, `caixotes` | cais | caixotes empilháveis (instanciados) |
| `caminhos` | entre armazéns | pavimentados |
Câmera FOV 35°, (25,19,29)→(0,0,0).

## 5. Sistemas
- **Grafo de navegação** (A\*) sobre grade do mar com obstáculos; **splines** por Catmull-Rom ajustáveis.
- **Planejador de carga:** capacidade por barco, pedidos com destino/quantidade; validação em tempo real (**avisa, não impede**: o usuário pode tentar e ver o resultado).
- **Simulação determinística** com velocidade configurável; log de eventos neutro ("Barco 2 levou 5 caixas ao mercado").
- **Mudanças de contexto** configuráveis: pedido novo, píer ocupado, ponte levantada.
- **Água:** vertex Gerstner (2–3 ondas) + normal animada; espuma por decal só ao redor do casco; tier baixo = plano com normal estática.
- **Estado:** `planos.json` (A, B...).

## 6. Interface, bordas e ilustrações
- **Moldura de corda** (SVG, nós nos cantos).
- **Carta náutica** como painel de rotas (ilustração de linhas batimétricas + rosa-dos-ventos *diferente da do 01*).
- Cartões de pedido em **papel manilha** com **carimbo estêncil** e pictogramas (caixa, fruta, tecido, peça), nenhum texto na imagem.
- Indicadores de lotação como **cintas de carga** (barras com fivela).

## 7. Áudio
Ondas em loop suave; **sinos** curtos e raros (fim de viagem); gaivotas esparsas. Três canais com ganho separado + botão mudo.

## 8. Acessibilidade, conforto, ética
- Rota por **lista de pontos** (teclado) além do arrasto; lotação em texto.
- **Nenhum** cronômetro ou limite de tentativas.
- Comparação **descritiva**: "Plano A: 3 viagens · Plano B: 4 viagens". Sem veredito.
- Reduzir movimento: ondas estáticas e barcos em saltos de posição.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Pedidos-exemplo, cargas, vocabulário de comparação | Aprovado |
| **E1** Blocking | Mar, píeres, armazéns, barcos, câmera | Validador; captura |
| **E2** Hero | Armazéns, barcos (3 tipos), guindaste, ponte móvel, farol, caixotes | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Gerstner, espuma de casco, luz suave | 60 fps desktop com água |
| **E4** Mecânica | A\*, splines, alocação, simulação, comparação | Vitest: A\* contorna obstáculo; capacidade; determinismo da simulação |
| **E5** Interface | Cordas, carta, carimbos, cintas | Contraste; teclado |
| **E6** Áudio | 3 canais | Pico ≤ teto |
| **E7** Segurança | Baixo desempenho (água estática), retenção | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Custo da água em móvel (tier) · complexidade do planejador (começar com 3 pedidos fixos, depois configurável) · arrasto de pontos em toque (hitboxes generosas, alças grandes).
