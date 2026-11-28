# 18 · ARQUITETURA DOS VÍNCULOS — Plano de execução
Porte **L** · Onda 4 · 7+ e adultos · Expressão simbólica e narrativa

## 1. Tese
**Relações podem ser externalizadas num espaço, e o significado do espaço é de quem o constrói.** Ilhas, pessoas, grupos e animais ganham posição; pontes são construídas — ou não — e **nenhuma distância, ponte ou ausência de ponte é interpretada pelo app**.
- Âncoras: **átomo social** e sociometria (Moreno, 1934); **modelo de comboio** (Kahn & Antonucci, 1980); **ecomapa** (Hartman, 1978) e genograma (McGoldrick) como tradições de representação; Gestalt — figura/fundo e fluxo de contato/retirada, como **linguagem de conversa** e não de análise.
- **Não afirma:** apego, vínculo "saudável/nocivo", isolamento, proximidade. **Sem** cálculo de distâncias, centralidade ou rede.
- **Dados de terceiros:** nomes de pessoas reais são dados pessoais de **outras pessoas** → **somente local**, com anonimização na exportação.
- **Diferença do Território dos Vínculos (caixa de areia):** aqui **não há miniaturas em bandeja**; há **ilhas e pontes construídas**, uma metáfora espacial diferente.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Arquipélago** de água rasa e azul acinzentada |
| Verbo | **Construir pontes** |
| Assinatura técnica | **Pontes por *spline* com tábuas segmentadas**, snap em píeres + **ilhas editáveis** (pintura de elevação/vértice) + **marcadores abstratos personalizáveis** |
| Chrome | **Cartões amarrados com barbante**; borda **aquarela** |
| Tipografia | Literata (texto) + Manrope (rótulos) |
| Luz/grade | Suave; água azul-acinzentada, areia bege, musgo, madeira |
| Áudio-assinatura | Água e vento opcionais, **sem atmosfera emocional pré-programada** |
| Artefato | **Versões do arquipélago** (JSON + imagem com opção de anonimizar) |
| **Não pode parecer** | Porto (08, também água); ilha de pausas (12); caixa de areia (existente) |

## 3. Jornada
1. Vê a **ilha principal** e **cinco ilhas** à deriva; nenhuma ponte.
2. **Cria e nomeia** ilhas (ou renomeia as existentes); coloca **cartões abstratos** (pessoa, grupo, animal, lugar, outro) com **forma, material e tamanho escolhidos por ela/ele**.
3. **Move** ilhas e cartões; **constrói** pontes entre píeres (ou nenhuma); pode retirá-las.
4. **Registra** o que cada posição ou ponte significa **para si**.
5. **Salva versões** e as compara (sobreposição transparente).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `ilha_principal` | (0,0,0) r=4 | elevação, casa simples, árvores |
| `ilha_2..6` | (−12,0,−7) · (12,0,−6) · (−14,0,8) · (12,0,10) · (0,0,13) | menores, editáveis |
| `agua_rasa` | base inteira | shader leve com profundidade (transparência gradual) |
| `pontos_encaixe` | em volta | permitem **adicionar ilhas** |
| `pier_*` | em cada ilha | pontos de ponte |
| `ponte_*` | entre píeres | **articuladas/segmentadas** em *spline* |
| `marcadores` | sobre ilhas | formas abstratas; **nenhum símbolo obrigatório** |
| `barcos_pequenos`, `pedras`, `vegetacao_baixa` | ao redor | instanciados |
Câmera FOV 35°, (26,20,32)→(0,0,0).

## 5. Sistemas
- **Ponte:** `CatmullRomCurve3` entre dois píeres com **N tábuas** orientadas pela tangente; **snap** ao píer; remoção suave.
- **Ilhas:** *heightfield* de baixa resolução com pintura por vértice (terra/rocha/areia).
- **Cartões:** `{ id, nome, forma, material, escala, nota }`; **sem tipos obrigatórios**.
- **Versões:** `versao_n.json` com posições, notas, pontes; **comparação** por ghost.
- **Exportação/screenshot com anonimização:** nomes → iniciais/forma, notas ocultas, opção "só formas".
- **Estado:** IndexedDB; retenção; apagar tudo.

## 6. Interface, bordas e ilustrações
- **Cartões** de papel com furo e **barbante**, cada um com cor de aquarela escolhida por quem usa (sem paleta "recomendada").
- **Moldura de aquarela** (SVG com bordas de pigmento) sem desenho decorativo carregado.
- **Ilustração de ponte** em tinta e lavagem; ícone de "construir" como **mãos e tábua** (sem uma "regra" visual).
- Painel de notas com **texto ampliável**.

## 7. Áudio
Água e vento **opcionais** e neutros; **sem** música que sugira emoção; sem reação sonora a escolhas.

## 8. Acessibilidade, conforto, ética
- Construir ponte por **lista** (origem → destino) além do arrasto.
- **Nenhuma leitura automática** do arranjo; textos do app: "esta é a **sua** representação".
- "Ajuda agora" discreto (texto livre sobre relações).
- Anonimização padrão **ligada** na exportação.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário neutro, convites, textos de privacidade | **Aprovado por você** |
| **E1** Blocking | Água, 6 ilhas, píeres, câmera | Validador; captura |
| **E2** Hero | Ilhas com relevo, casas, árvores, pontes segmentadas, barcos | GLB; instancing |
| **E3** Luz + assinatura | Água rasa, luz suave, ponte em *spline* | Tábuas seguem curva sem esticar |
| **E4** Mecânica | Criar/mover/nomear, pontes, versões, comparação, anonimizar | Vitest: snap, remoção, exportação anonimizada |
| **E5** Interface | Cartões, aquarela, ilustrações | Contraste; teclado |
| **E6** Áudio | Água/vento | Pico ≤ teto |
| **E7** Segurança | Retenção, anônimo, baixo desempenho (água opaca) | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Edição de ilha em toque (modo simples por botões) · privacidade de terceiros (anonimização, local-only) · tentação de métricas ("pontes: 3") → **proibido** no resumo.
