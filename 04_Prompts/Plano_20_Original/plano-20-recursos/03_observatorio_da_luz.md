# 03 · OBSERVATÓRIO DA LUZ — Plano de execução
Porte **M** · Onda 1 (piloto) · 4+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Conforto visual é pessoal, e se descobre ajustando, não respondendo a perguntas.** A pessoa regula intensidade e temperatura da luz até "ficar bom" e vê a faixa que serviu para ela, hoje.
- Âncoras: **método do ajuste** da psicofísica (Fechner; o participante controla o estímulo até um critério subjetivo); adaptação à luz e ao escuro; luz como tema de ambiente (conforto, leitura).
- **Não afirma:** fotofobia, estresse visual, necessidade de lentes/filtros coloridos, ritmo circadiano individual. **Sem** atribuir significado emocional a cores.
- **Diferença de tudo:** é a **única sala de luz como objeto** — o próprio feixe, o prisma e o vidro são o assunto.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Pavilhão branco de calcário e vidro** (arquitetura de exposição) |
| Verbo | **Ajustar até ficar confortável** |
| Assinatura técnica | **Prisma hexagonal com dispersão espectral** (refração por comprimento de onda em shader próprio) + **sombras coloridas projetadas** (decal/lightmap) + **adaptação suave de exposição** |
| Chrome | Traço-fino arquitetônico, painel de **vidro fosco** (não "glassmorphism" decorativo) e **tira espectral** como controle |
| Tipografia | Jost (leve, geométrica) + Instrument Serif (itálico para observações) |
| Luz/grade | Difusa diurna, branco-marfim; CA mínima; sem bloom forte |
| Áudio | **Quase silêncio** (desligado por padrão); narração descritiva sob demanda |
| Artefato | "Faixa de conforto de hoje" (intervalo definido pelo usuário, sem norma) |
| **Não pode parecer** | Estúdio (02); galeria (04); estufa (10) |

## 3. Jornada
1. Entra com luz **estável e média**. Nenhuma mudança brusca, nunca.
2. Mexe em **intensidade** e **temperatura** (tira espectral/escala em kelvin) até marcar *confortável*; marca também *muito claro · muito escuro*.
3. Gira os três **painéis de vidro** (âmbar/azul/rosa pálido) e abre/fecha **persianas**; vê as sombras coloridas se moverem lentamente.
4. Compara duas condições de leitura (amostra de leitura sem texto: faixas de linhas/ícones).
5. Registra conforto e vê "sua faixa de hoje".

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `piso_calcario` | 12×9 m | microvariação, roughness 0,82 |
| `painel_vidro_1..3` | fundo Z=−4,5; 2,2×3 m | moldura individual, **pivô de giro**, estado de opacidade; âmbar/azul/rosa |
| `prisma_hex` | (0,1,0) sobre `pedestal_circular` | facetado; `MeshPhysicalMaterial` com `transmission` controlada, thickness 0,1 |
| `cabine_luz_L/R` | X=−3 e X=3 | áreas de comparação |
| `venezianas`, `persianas` | janelas | móveis |
| `vasos_folhas`, `banco_pedra_1..2` | laterais | folhas grandes translúcidas |
Câmera FOV 38°, (9,5.3,11)→(0,1.4,0). Painel de controles **em HTML fora do canvas**.

## 5. Sistemas
- **Luz:** 1 key + hemisférica; *lightmap/decal* para sombras coloridas (transmissão real de luz só onde viável); **limitador de variação de luminância** (nunca salto > X por segundo).
- **Prisma:** shader de dispersão simples (3–7 amostras espectrais) com fallback de transmissão cromática para tier baixo.
- **Exposição adaptativa:** a imagem "se acostuma" em ~1,5 s; limites rígidos de exposição/tone mapping.
- **Cenários pré-calculados:** 5 condições (baixa/média/alta × quente/neutra/fria) interpoladas — sem custo de GI em tempo real.
- **Modo reduzido:** iluminação **constante**, painéis estáticos.

## 6. Interface, bordas e ilustrações
- **Tira espectral** (SVG/Canvas) como slider de temperatura; handle largo.
- Painéis de vidro fosco com **bordas de 1 px** e cantos retos (sem arredondamento "app"), indicando valores em kelvin e "intensidade relativa" (%).
- Ilustração: **diagrama linear do prisma** (SVG) que explica "o que acontece" sem jargão; ícones finos de persiana/painel.
- Seletor de **leitura**: três amostras de texto *abstrato* (blocos tipográficos sem palavras legíveis) para evitar viés de conteúdo.

## 7. Áudio
Desligado por padrão; ambiente quase silencioso opcional (ar muito baixo); **narração descritiva** ("a luz está mais quente; as sombras ficaram âmbar") via síntese local sob pedido.

## 8. Acessibilidade, conforto, ética
- **Nenhum flash, nenhuma transição < 600 ms** em luminância; `prefers-reduced-motion` = luz constante.
- Texto equivalente para cada estado de luz (`aria-live`).
- Para crianças 4+: modo "só tocar nos painéis", sem kelvin; portão do adulto para registros.
- Registro = **auto-relato descritivo**, sem escala clínica; sem recomendação de "o que usar".

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário (confortável/claro/escuro), narrações, textos infantis | Aprovado |
| **E1** Blocking | `scene.json`, volumes, câmera | Validador verde; captura |
| **E2** Hero | Prisma facetado, 3 painéis com moldura/pivô, persianas, cabines, bancos | Pivôs e estados idle/hover/selected/active |
| **E3** Luz + assinatura | Dispersão espectral, sombras coloridas, exposição adaptativa | **Teste automático:** variação de luminância/s ≤ limite em varredura completa |
| **E4** Mecânica | Ajuste, comparação, registro de faixa | Vitest do intervalo de conforto; efeito visual e lógico |
| **E5** Interface | Tira espectral, painel fosco, diagrama do prisma | Contraste ≥ 4,5:1 sobre o fosco |
| **E6** Áudio | Narração sob pedido | Nada toca sem ação |
| **E7** Segurança | Fallback 2D (cenas pré-renderizadas), baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Transmissão física cara em móvel → fallback opaco/pré-calculado · dispersão pode parecer "efeito" demais → intensidade moderada e opcional · sombras coloridas sem GI → lightmap bem calibrado.
