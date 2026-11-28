# 02 · LABORATÓRIO DE CAMADAS SONORAS — Plano de execução
Porte **L** · Onda 2 · 6+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Figura e fundo também existem no som.** Ao separar e recombinar camadas, a pessoa percebe o que "sobe" à atenção e o que recua, e ganha agência para dosar o ambiente.
- Âncoras: atenção seletiva / "festa de coquetel" (Cherry, 1953); segregação de fluxos (Bregman, 1990); figura-fundo e proximidade (Gestalt — aplicáveis ao auditivo).
- **Não afirma:** transtorno de processamento auditivo, nem "mede" nada. O prompt já proíbe algoritmo que "identifique processamento".
- **Diferença do 01:** o 01 é **espaço geográfico** (onde estão as fontes); o 02 é **camada e proporção** (quanto de cada uma). Sem mapa, sem cidade, sem ícones de lugar.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estúdio de gravação** de nogueira e feltro, luz âmbar/ciano indireta |
| Verbo | **Mixar e isolar** |
| Assinatura técnica | **Cápsulas de vidro que "respiram" com o espectro** (FFT → emissivo/escala) + **fita de oscilograma 3D** flutuante + faders com mola e *slew rate* limitado |
| Chrome | **Rack 19"**: orelhas com parafusos Phillips (SVG), serigrafia, medidores LED em DOM |
| Tipografia | Barlow Condensed (rótulos de painel) + JetBrains Mono (valores em dB) |
| Luz/grade | Teto indireto âmbar + filete ciano; contraste médio, sem bloom forte |
| Áudio-assinatura | Quatro famílias com **mesma loudness** para comparação justa |
| Artefato | "Perfil de mixagem" (snapshot JSON nomeável) |
| **Não pode parecer** | Mapa/cidade (01); painel azul de "dashboard"; estúdio genérico de stock |

## 3. Jornada
1. Entra com **todos os faders no mínimo** (silêncio).
2. Sobe um fader: a cápsula acende e pulsa com o som daquela família.
3. **Solo/Mute**; arrasta cápsulas num **círculo de escuta** (o ouvinte no centro) e percebe a espacialização.
4. Escolhe uma fonte como **foco de atenção** (spotlight visual) e marca *foi fácil / mais ou menos / foi difícil / não sei*.
5. **A/B com volumes normalizados**; salva o perfil; **zerar** devolve tudo a zero sem picos.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `mesa_mixer` | (0,0,−1), 2,6 m, tampo y=0,78 | semicírculo em *loft* com bordas arredondadas; **8 faders**, **8 potenciômetros** serrilhados, botões LED, **2 VU meters** |
| `difusor_parede` | Z=−3,5 | difusor acústico de madeira com **poços de profundidades variadas** (tipo QRD) |
| `monitor_L` / `monitor_R` | (±2, 1, −2,3) ⚠ ambiguidade registrada | cone, tecido acústico, suporte |
| `pedestal_1..4` | X=−3, −1, 1, 3 · Z=2 | com **cápsulas**: voz, natureza, trânsito, música |
| `visor_ondas` | ao fundo, flutuante | **geometria** (fita 3D a partir do analisador), não texto projetado |
| `estante_instrumentos`, `cabos` | lateral | cabos como tubos com **caída por gravidade** |
Câmera FOV 42°, (7,5.1,8)→(0,1,0). Materiais: nogueira 0,55; aço escovado metal 0,8/rug 0,4; borracha 0,9; vidro fosco 0,12; feltro com normal procedural.

## 5. Sistemas
- **Mixer real:** 4 `GainNode` + limitador conservador; solo/mute; mudanças de ganho com **slew rate** (nunca degrau).
- **Controles DOM acessíveis** (sliders nativos) sincronizados ao fader 3D (mola animada); setas ±1 dB.
- **Espacialização:** `PannerNode` em círculo de raio ajustável; arrastar cápsula atualiza azimute.
- **A/B normalizado:** casamento de RMS antes de alternar.
- **Visualizador:** `AnalyserNode` → shader leve; **quadros limitados a 30 fps**; "reduzir movimento" congela em instantâneo.
- **Estado:** `mix.json` (ganhos, posições, solo/mute, nota de "foi fácil").

## 6. Interface, bordas e ilustrações
- Painel lateral em **módulo de rack** com orelhas e parafusos; cada família tem um módulo (ícone de pictograma próprio: voz, folha, carro, nota).
- **Medidores LED** em canvas 2D (rápidos, acessíveis com texto "−18 dB" em `aria`).
- Botões físicos com *press depth* (sombras internas), sem néon.
- Serigrafia em contornos finos; nenhum rótulo embutido em textura 3D.

## 7. Áudio (desenho)
Quatro famílias **originais e geradas**: voz = murmúrio de formantes ininteligível; natureza = vento + riacho + chilros; trânsito = drone + passagens; música = laço generativo suave (acordes de baixa densidade). Todas loopáveis, normalizadas por RMS, legendadas.

## 8. Acessibilidade, conforto, ética
- Teto de volume ajustável; **fader nunca salta**; "zerar mixagem" = rampa 120 ms.
- Sem "resultado": as respostas de "foi fácil" ficam num registro **descritivo** do próprio usuário.
- Sem cor como único sinal (LED + texto + posição).

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | 4 famílias, vocabulário do "foi fácil", textos | Aprovado por você |
| **E1** Blocking | `scene.json`, caixas cinzas, câmera do prompt, resolver ambiguidade dos monitores | Validador verde; captura |
| **E2** Hero | Mesa em *loft*, faders, potenciômetros, difusor QRD, monitores, cápsulas, cabos | Orçamento de triângulos; GLB hero; pivôs dos faders corretos |
| **E3** Luz + assinatura | Âmbar/ciano indireto, cápsulas guiadas por FFT, fita 3D | Cápsula reage só à **sua** família (teste com 1 fader) |
| **E4** Mecânica | Mixer, solo/mute, círculo de escuta, A/B, snapshots | Vitest: ganho e RMS; sem salto > limite de *slew* |
| **E5** Interface | Rack, medidores, ícones | Contraste, foco, teclado completo |
| **E6** Áudio | 4 famílias geradas, limitador | Medição de pico ≤ teto; loudness equivalente ±1 dB |
| **E7** Segurança | Baixo desempenho (sem FFT 3D), fallback 2D (só painel), anônimo | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Sincronia DOM↔3D (fonte única de verdade no store) · custo do FFT 3D em móvel (tier baixo troca por barras DOM) · ambiguidade dos monitores (confirmar).
