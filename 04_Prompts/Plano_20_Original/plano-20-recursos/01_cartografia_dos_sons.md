# 01 · CARTOGRAFIA DOS SONS — Plano de execução
Porte **L** · Onda 2 · 5+ e adultos · Percepção e processamento sensorial

## 1. Tese
**Escutar é uma atividade de exploração, e o controle sobre o som muda a experiência dele.** O usuário não "recebe" ruído: ele coloca, move, isola e nomeia cada fonte numa cidade em miniatura.
- Âncoras: *soundscape* e escuta ativa (R. M. Schafer, 1977; "soundwalk"); análise de cena auditiva (Bregman, 1990); controle percebido reduz o incômodo do ruído (Glass & Singer, 1972).
- Dunn só entra como **vocabulário de preferências** (procuro / evito / noto), nunca como escore.
- **Não afirma:** hiperacusia, misofonia, perfil sensorial, TEA/TDAH. Sem comparação com norma.
- **Diferença do acervo:** a *Paisagem Sonora 3D* é contemplativa e natural; aqui é **mapa urbano manipulável**, com fontes arrastáveis e classificação pessoal.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | Maquete urbana sobre uma **prancheta de cartógrafo** (papel quadriculado, régua de latão nas bordas da mesa) |
| Verbo | **Escutar e posicionar** |
| Assinatura técnica | **Frentes de onda** no chão: anéis que saem da fonte selecionada e **são barrados pelos prédios** (grade 2D de oclusão 64×48); isocontornos de distância |
| Chrome | Neatline dupla com marcas de escala, **rosa-dos-ventos que gira com a câmera**, *cartucho de legenda* como menu |
| Tipografia | Libre Caslon Text (rótulos, itálico de mapa) + IBM Plex Mono (coordenadas) |
| Luz/grade | Manhã 4800 K, sombras longas e suaves, grade de cor "papel quente" |
| Áudio-assinatura | Som **abafa atrás de prédios** (passa-baixa por oclusão) |
| Artefato do usuário | "Folha de escuta": mapa com fontes, posições e rótulos pessoais (JSON + PNG) |
| **Não pode parecer** | Cena natural contemplativa; painel genérico flutuante; ícones de "alto-falante" |

## 3. Jornada
1. Chegada: mapa em silêncio. Legenda mostra 5 fontes (nada toca).
2. Toque numa fonte → ícone aparece, **fade de 400 ms** até o volume que o usuário definiu; frentes de onda se espalham.
3. Arrasta a fonte pelo mapa; ouve e vê o alcance mudar. Alterna **isolar** × **misturar**.
4. Marca cada fonte: *agradável · neutro · desconfortável · não sei* (ícone + texto) + nota livre opcional.
5. Fecha com a "folha de escuta"; exporta ou apaga.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `praca_central` | (0,0,0) r=4 | placas de pedra, normal sutil; jardineiras; fonte |
| `cafeteria` | (−9,0,−5) | fachada creme, **toldo listrado** (tecido com leve balanço), porta de madeira com dobradiças, vidros IOR 1,5, 3 mesas, xícaras, máquina de café |
| `escola` | (8,0,−7) | 2 pavimentos, **16 janelas instanciadas**, portão gradeado |
| `parque` | (−9,0,7) | 6 árvores de **3 geometrias** com LOD, bancos, arbustos, chafariz discreto |
| `ponto_onibus` | (9,0,6) | abrigo metálico, banco, painel |
| `rua_anel` | contorna | meio-fio, **faixa de pedestre em decal**, postes, 1 carro opcional |
Câmera FOV 34°, (21,19,26)→(0,0,0), azimute 40°. Botão **"Prancheta"**: vista superior para posicionar com precisão.
**Fontes (5):** pássaros (parque) · vozes simuladas (escola) · tráfego (rua) · água (chafariz) · cafeteria. **Chuva** é *cenário* (clima opcional), não fonte — leitura que adoto do prompt (6 sons, "cinco ícones").

## 5. Sistemas
- **Áudio espacial:** `AudioContext` + `PannerNode` HRTF por fonte, `GainNode` por categoria, `DynamicsCompressor` como limitador, `AudioListener` na câmera; 1 m virtual = 1 m de áudio.
- **Oclusão acústica:** raio 2D fonte→ouvinte contra a grade de prédios → passa-baixa + queda de ganho (suave, sem degrau).
- **Frentes de onda:** shader no plano do solo, textura de oclusão atualizada só quando uma fonte se move.
- **Estado:** `fontes.json` (id, x, z, raio, rótulo, nota), cenário (manhã/chuva leve/fim de tarde). IndexedDB + retenção escolhida.
- **Regra dura:** *nunca* aumentar volume automaticamente; "silenciar tudo" = rampa de 80 ms (sem estalo).

## 6. Interface, bordas e ilustrações
- Moldura *neatline* dupla com **marcas de escala em metros** e coordenadas nas bordas (IBM Plex Mono).
- **Cartucho de legenda** (menu): 5 emblemas gravados em SVG (pássaro, vozes, ônibus, gota, xícara), cada um com seletor de rótulo e controle de raio.
- Rosa-dos-ventos SVG animada pelo azimute; **barra de escala** que muda com o zoom.
- Textura de papel só nos painéis HTML (nunca atrás do texto de leitura → contraste mantido).
- Botão fixo **"Silenciar tudo"** sempre visível; recolher controles com **H**.

## 7. Áudio (desenho)
Síntese procedural primeiro (sem direitos autorais): pássaros = chilros FM curtos com intervalos irregulares; tráfego = drone de ruído filtrado + passagens; vozes = murmúrio de formantes **ininteligível**; água = ruído filtrado modulado; cafeteria = murmúrio + tilintar leve. Slot opcional para amostras CC0 (licença verificada e registrada no manifesto). Normalização por RMS entre fontes, teto no limitador, legenda textual de cada som.

## 8. Acessibilidade, conforto, ética
- Lista de fontes navegável por teclado; setas movem a fonte em passos de 0,5 m; `aria-live`: "Tráfego movido para 6 m da praça".
- Reduzir movimento: frentes de onda viram **contorno estático**.
- Sem "ranking" de conforto; as quatro marcas são do usuário e não geram resultado.
- Sessão anônima; exportar/apagar; fallback 2D = mapa SVG com as mesmas fontes e o mesmo áudio.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Vocabulário de escuta, textos dos convites, rótulos, 3 cenários | Revisado por você |
| **E1** Blocking | `scene.json` + caixas cinzas + grade de oclusão + câmera do prompt | Validador verde; captura do enquadramento |
| **E2** Assets hero | Cafeteria, escola, parque, ponto, praça, rua; GLB dos hero | Dentro do orçamento; nomes semânticos; estados idle/hover/selected/active nas fontes |
| **E3** Luz + assinatura | Sol 4800 K, sombras, frentes de onda, chuva-cenário, vento nas folhas | Frentes **param** em prédios (teste visual com fonte atrás da escola) |
| **E4** Mecânica | Arrastar, isolar/misturar, marcação, raio por fonte, persistência | Vitest: oclusão, ganho × distância; mover fonte altera ganho **e** imagem |
| **E5** Interface | Neatline, cartucho, rosa-dos-ventos, ícones | Contraste ≥ 4,5:1; foco visível; alvo ≥ 48 px |
| **E6** Áudio | 5 fontes + chuva; limitador; legendas | Medição: nenhum pico acima do teto; fade 400 ms |
| **E7** Segurança | Anônimo, retenção, baixo desempenho, fallback 2D | axe sem violações sérias; 30 fps móvel |
| **E8** Entrega | Capturas, relatório de divergências, README | 6 critérios com evidência |

## 10. Riscos
- Realismo do áudio procedural → plano B: amostras CC0.
- HRTF em móvel pesado → cair para `equalpower` no tier baixo.
- Efeito "miniatura" (tilt-shift) pode incomodar → só como opção.
