# PLANO MESTRE — 20 Recursos 3D Terapêuticos

> Este documento é o **plano**, não a execução. Nada foi codificado ainda.
> Cada recurso tem o seu próprio arquivo (`01_…` a `20_…`) com tese, identidade exclusiva, cena, sistemas, interface, áudio, ética e etapas verificáveis.

**Índice por onda**
- **Onda 1 (pilotos):** [03 Observatório da Luz](03_observatorio_da_luz.md) · [11 Jardim dos Pensamentos](11_jardim_dos_pensamentos.md) · [12 Ilha das Pausas](12_ilha_das_pausas.md) · [19 Oficina do Ritmo](19_oficina_do_ritmo_compartilhado.md)
- **Onda 2 (interiores e som):** [01 Cartografia dos Sons](01_cartografia_dos_sons.md) · [02 Laboratório de Camadas](02_laboratorio_camadas_sonoras.md) · [04 Atlas das Texturas](04_atlas_das_texturas.md) · [06 Oficina do Tempo](06_oficina_do_tempo.md) · [09 Bússola do Corpo](09_bussola_do_corpo.md) · [10 Meteorologia das Emoções](10_meteorologia_das_emocoes.md)
- **Onda 3 (personagens e cena):** [17 Teatro das Histórias](17_teatro_das_historias_possiveis.md) · [15 Estúdio dos Limites](15_estudio_dos_limites.md) · [14 Museu dos Pontos de Vista](14_museu_dos_pontos_de_vista.md) · [13 Cidade das Conversas](13_cidade_das_conversas.md)
- **Onda 4 (sistemas e grandes cenas):** [05 Estação das Trocas](05_estacao_das_trocas.md) · [07 Torre do Impulso](07_torre_do_impulso.md) · [08 Porto das Decisões](08_porto_das_decisoes.md) · [18 Arquitetura dos Vínculos](18_arquitetura_dos_vinculos.md) · [20 Casa das Memórias](20_casa_das_memorias.md) · [16 Ensaio do Cotidiano](16_ensaio_do_cotidiano.md)

---

## 1. Diagnóstico (o que li e o que isso muda)

**Li:** os 20 `PROMPT_NN_*.md`, o `Atlas_20_Recursos_3D.json`, a estrutura do atlas HTML e o acervo já construído em `C:\Users\aless\Desktop\11`.

**O acervo existente (base reutilizável, não molde visual):**
- `apps/territorio-dos-vinculos/src/realistic/core/` — `engine.ts` (HDR + GTAO seletivo + bloom + pass final com ACES/sRGB/gradação/vinheta/grão + resolução dinâmica), `pbr.ts` (amostradores procedurais: madeira, reboco, tatame, tecido, pedra, casca, telha, areia, chão, metal martelado, bronze, papel), `effects.ts` (poeira, feixes de luz, chama, fumaça, vaga-lumes, chuva, folhas, céu, vento), `model.ts`, `noise.ts`, `audio.ts`.
- Padrão `SceneBuilder → SceneController` com **carregamento sob demanda** por cena.
- Barra imersiva (`imersivo.css/js`): cena em tela cheia, controles recolhíveis (H), Esc fecha painel.
- `23/` (Ateliê do Gesto Lento): TypeScript modular estrito — `clay/ interaction/ audio/ session/ guided/ ui/` — com IndexedDB, exportação, prática guiada, teclado.

**Três fatos que mudam a execução:**

1. **Não existem arquivos de imagem de referência.** O atlas tem apenas campos de upload; as "prévias" eram dinâmicas na conversa. Por isso **não vou reivindicar fidelidade pixel a pixel** (o próprio contrato proíbe). A calibração usa as coordenadas + o prompt Nano Banana + uma ferramenta de comparação com *slot de upload* (E8 de cada recurso). Quando você gerar/anexar a imagem de cada recurso, a calibração vira lado a lado.
2. **O contrato pede GLB/glTF + Blender; o acervo é procedural em TypeScript.** Decisão: **procedural-first, com exportação GLB dos assets hero** via `GLTFExporter` num script de *bake* (navegador headless). Isso cumpre "modelos glTF 2.0/GLB, pivôs, nomes semânticos, estados idle/hover/selected/active" sem depender de Blender instalado. Blender entra só onde modelagem manual vale a pena (personagens de 13/14/15 se você quiser).
3. **Há sobreposição temática com o acervo existente.** Tratada abaixo, recurso a recurso, para nada parecer repetido.

### Registro de ambiguidades de coordenadas (vírgula decimal nos prompts)
| Recurso | Texto original | Leitura que adoto (confirmar) |
|---|---|---|
| 02 | monitores em `(-2,1, -2,3)` | x=±2, y=1, z=−2,3 |
| 04 | `Z=-2,7,-0,8,1,1,3` | quatro pedestais por lado em Z = −2,7 · −0,8 · 1,1 · 3,0 |
| 07 | portões em `(±1,5,4,0)` | x=±1,5, y=4, z=0 (dentro da torre, no 2º trecho do tubo) |
| 15 | palco `Z=-2..-4,5` | do Z=−2 ao Z=−4,5 (profundidade 2,5 m; largura 7 m; altura 0,4 m) |
| 19 | torre de blocos `X=3,5` | x=3,5 |
| 09 | silhueta de 2,8 m numa plataforma de r=3,5 m | escala monumental intencional (observatório) |

### Sobreposição com o acervo existente → como será diferente
| Novo | Parecido com | Diferença obrigatória |
|---|---|---|
| 01 Cartografia dos Sons | Paisagem Sonora 3D (riacho e pássaros) | Cidade-maquete, fontes **arrastáveis**, mapa e frentes de onda; não é cena contemplativa natural |
| 10 Meteorologia das Emoções | Jardim dos Ciclos (estufa) | O **clima é o espetáculo** (céu/nuvem/chuva/vento paramétricos); a estufa é só o observatório |
| 11 Jardim dos Pensamentos | Santuário Zen / Jardim dos Ciclos | Mundo de **papel e origami**, texto do usuário como objeto; jardim seco/pomar, não botânica nem templo |
| 12 Ilha das Pausas | Lago 3D / Santuário | Mar, farol e **câmera guiada entre 5 espaços**; atividade em cada espaço |
| 18 Arquitetura dos Vínculos | Território dos Vínculos (caixa de areia) | Arquipélago com **pontes construídas**; areia/miniaturas não aparecem; metáfora espacial diferente |

---

## 2. Arquitetura: núcleo invisível, recursos com rosto próprio

```
recursos-3d/
├─ nucleo/                      (infraestrutura — NUNCA aparece para o usuário)
│  ├─ motor/        Engine v2: tiers de qualidade, render sob demanda, perfis de "look"
│  ├─ materiais/    amostradores PBR (extraídos de pbr.ts) + novos por recurso
│  ├─ efeitos/      partículas, céu, vento, feixes (de effects.ts) + novos
│  ├─ modelagem/    helpers de geometria, merge, instancing, export GLB
│  ├─ audio-seguro/ AudioContext + limitador + teto de volume + fades + polifonia máx.
│  ├─ a11y/         foco, roving-tabindex, aria-live para a cena, reduzir movimento
│  ├─ privacidade/  consentimento, retenção, sessão anônima, IndexedDB, exportar/apagar
│  ├─ manifesto/    schema do scene.json + validador (IDs, pos, rot, esc, material, função)
│  └─ captura/      screenshot determinística + comparador lado a lado + relatório
└─ recursos/
   └─ NN-slug/      (cada um: src/ tema/ assets/ scene.json README testes/)
```

**Regra de ouro:** o núcleo fornece *mecanismos*; **tudo o que o usuário vê é do recurso** (tema, bordas, menus, ilustrações, tipografia, grade de cor, assinatura de shader, áudio).

**Perfil "Conforto sensorial" (padrão):** o `FinalPass` atual liga grão (0,03) e aberração cromática (0,0022). Em todos os recursos o padrão passa a **grão 0, CA 0, bloom contido, sem flicker**; "Cinema" vira opção explícita. Isso atende ao critério 6 do contrato ("sem estímulos inesperados") e o 03 exige CA mínima.

**Stack:** Vite + TypeScript estrito + Three.js (versão fixada) + WebGL2; Rapier só no 07; Vitest (lógica), Playwright (fumaça/visual), axe-core (acessibilidade). Fontes **auto-hospedadas** (woff2, licenças OFL) — nenhuma requisição a terceiros, nem analytics.

---

## 3. Sistema anti-repetição ("DNA" de cada recurso)

Cada plano começa com um **cartão DNA** de 9 campos. Dois recursos não podem compartilhar *verbo de interação*, *assinatura técnica*, *chrome* nem *par tipográfico*. Matriz (resumo):

| # | Mundo | Verbo central | Assinatura técnica | Chrome (bordas/menus) | Tipografia |
|---|---|---|---|---|---|
| 01 | Maquete sobre prancheta de cartógrafo | Escutar e posicionar | Frentes de onda no chão com oclusão por prédios + HRTF | Neatline de mapa, rosa-dos-ventos, cartucho de legenda | Libre Caslon + IBM Plex Mono |
| 02 | Estúdio de gravação | Mixar e isolar | Cápsulas guiadas por FFT + fita de oscilograma 3D | Rack 19", parafusos, serigrafia | Barlow Condensed + JetBrains Mono |
| 03 | Pavilhão de vidro | Ajustar até ficar confortável | Prisma com dispersão espectral + adaptação suave de exposição | Traço-fino arquitetônico, tira espectral | Jost + Instrument Serif |
| 04 | Galeria de espécimes | Tocar (5 gestos exploratórios) | Micro-relevo + luz rasante real + rastros persistentes | Etiquetas de museu, fichas catalográficas | Spectral + Karla |
| 05 | Estação vitoriana | Embarcar pela regra (que muda) | Quadro *split-flap* + desvios de trilho + vapor | Placas esmaltadas, rebites | Zilla Slab + Oswald |
| 06 | Ateliê de relojoaria | Estimar → medir → comparar | Mecanismo funcional + ampulheta de areia + ponteiro-fantasma | Bisel de latão, guilloché | Cinzel + EB Garamond |
| 07 | Torre mecânica | Esperar o sinal | Rapier + tubos espirais + comportas | Painéis de instrumento, lâmpadas | B612 + B612 Mono |
| 08 | Porto | Planejar rota e carga | Água de Gerstner + rotas arrastáveis + A* | Cordas, carta náutica, estêncil | Alegreya + Stardos Stencil |
| 09 | Observatório corporal | Sentir e nomear | Corpo de vidro fosco + partículas-sensação + camada-fantasma | Anel finíssimo, quase sem moldura | Albert Sans + Newsreader |
| 10 | Observatório de clima | Compor o clima | Céu/nuvem/chuva/vento paramétricos + raios volumétricos | Instrumentos de cobre, prancha botânica | Crimson Pro + Overpass Mono |
| 11 | Jardim de papel | Plantar um pensamento | Origami instanciado com vincos + prefixo de distanciamento | Caderno de papel com borda irregular | Young Serif + Caveat |
| 12 | Ilha de refúgio | Escolher a pausa | Câmera em spline entre 5 espaços + farol que respira | Seixos arredondados, ondas de areia | Quicksand + Lora |
| 13 | Bairro | Conversar por ramos | NPCs com rig + balões HTML ancorados | Sinalização de transporte | Atkinson Hyperlegible + Archivo |
| 14 | Museu de dioramas | Ver pelos olhos de outro | Câmera por personagem + cone de visão com oclusão | Moldura dourada, plaquetas, audioguia | Bodoni Moda + Libre Franklin |
| 15 | Teatro de ensaio | Ensaiar uma cena | Cartões de roteiro + cortina de veludo em shader | Proscênio com ribalta, roteiro datilografado | Courier Prime + Gloock |
| 16 | Supermercado | Preparar-se e percorrer | 1ª pessoa + navmesh + dial sensorial | Wayfinding, bloco de lista com pictogramas | Lexend |
| 17 | Teatro de fantoches | Dar vida e gravar | Fantoches de vara + camadas de papel com parallax + linha do tempo | Boca-de-cena de papel recortado | Fraunces + Patrick Hand |
| 18 | Arquipélago | Construir pontes | Pontes por spline com snap + ilhas editáveis | Cartões amarrados com barbante, borda aquarela | Literata + Manrope |
| 19 | Sala de brincar | Alternar turnos sonoros | Síntese modal de xilofone + limitador + indicador de vez | Feltro com pontos de costura | Fredoka + Mulish |
| 20 | Casa-miniatura de memórias | Guardar, omitir, reorganizar | Corte *dollhouse* + fotos locais + cofre cifrado | Cantoneiras de álbum, fitas-marcador | Cardo + Public Sans |

**Reprovação automática na revisão de unicidade:** capturas de dois recursos que, sem logotipo, possam ser confundidas; mesma curva de easing/ritmo de animação de UI entre dois recursos; mesma paleta de acentos; ícone reaproveitado.

---

## 4. Pipeline por recurso (fases com portões)

| Fase | O que acontece | Portão de saída |
|---|---|---|
| **F0 Fundamento** | Conceito psicológico, vocabulário, textos de convite, limites do que o recurso *não* afirma. Revisão com o terapeuta. | Roteiro de conteúdo aprovado |
| **F1 Blocking** | `scene.json` com todos os objetos principais; caixas cinzas; câmera/FOV do prompt | Validador de manifesto verde + captura de enquadramento |
| **F2 Assets hero** | Geometria dos objetos de destaque, UV, pivôs, nomes semânticos, estados idle/hover/selected/active; export GLB | Contagem de triângulos/draw calls dentro do orçamento |
| **F3 Luz & assinatura** | Iluminação, grade de cor, o efeito-assinatura exclusivo | Comparação lado a lado (ou coordenadas) e checklist do DNA |
| **F4 Mecânica** | Interação central, máquinas de estado, persistência | Testes de lógica verdes; efeito visual **e** lógico verificável |
| **F5 Interface** | Chrome próprio, menus, bordas, ilustrações SVG, ícones, microanimações | Contraste ≥ 4,5:1, foco visível, toque ≥ 48 px |
| **F6 Áudio** | Síntese/amostras, mixagem, limitador, legendas | Nenhum pico acima do teto; tudo desligável |
| **F7 Segurança** | Consentimento, retenção, anônimo, modo baixo desempenho, fallback 2D, reduzir movimento | axe-core sem violações sérias; 30 fps em perfil móvel |
| **F8 Entrega** | Capturas, relatório de divergências, README, scene.json final, testes | Todos os 6 critérios do prompt marcados com evidência |

---

## 5. Definição de "pronto" (vale para os 20)

Os **6 critérios de cada prompt**, mais quatro que eu acrescento:
1. Cena 3D de verdade, volumes coerentes com a referência (ou com as coordenadas, enquanto não houver imagem).
2. Cada objeto principal no `scene.json`: **ID, posição, rotação, escala, material, função** — o validador compara manifesto × cena montada.
3. Interface completa em português, teclado/toque, áudio opcional com controle de intensidade.
4. Ações com efeito visual e lógico verificável; reiniciar e salvar quando apropriado.
5. Captura lado a lado, ajuste de câmera, relatório de divergências.
6. Modo baixo desempenho; sem estímulos inesperados; **zero resultado diagnóstico automático**.
7. **Unicidade:** passa na revisão do cartão DNA.
8. **Conforto sensorial:** perfil padrão sem grão/CA/flicker; nenhum som ou luz muda sozinho.
9. **Privacidade:** nada sai do dispositivo sem ação explícita; anônimo disponível; apagar tudo em um clique.
10. **Teste com o terapeuta** (você): roteiro de uso de 10 minutos por recurso, com observações registradas.

---

## 6. Ética, clínica e privacidade (transversal)

- **Não diagnóstico por padrão.** Eventos observáveis descritos em linguagem neutra ("você marcou X"); sem escores, percentis, rótulos nem leitura simbólica fixa.
- **Citações de psicologia = âncoras conceituais**, não alegações de eficácia do app. Cada plano lista o limite explícito. Recomendo revisão bibliográfica final por você antes de qualquer texto virar material clínico.
- **Consentimento e retenção** (módulo `privacidade`): *Só nesta sessão* · *7 dias* · *Até eu apagar*; sessão anônima; exportar JSON; apagar tudo.
- **Crianças (03, 04, 10, 12, 17, 19):** LGPD art. 14 exige consentimento específico de responsável; há ainda a legislação de proteção de crianças no ambiente digital (ECA Digital) — **validar com assessoria jurídica**. Portão do adulto nos recursos infantis.
- **Texto livre (09, 11, 18, 20, 13, 15):** armazenamento só local; sem análise automática de conteúdo.
- **Decisão sua:** botão discreto e permanente **"Preciso de ajuda agora"** nos recursos de adolescentes/adultos com texto livre (CVV 188, SAMU 192). Recomendo ativar; é conteúdo estático, não detecção.
- **Nada vai ao serviço de geração visual** além dos prompts já escritos: sem voz, vídeo, relatos ou dados pessoais. Texturas/decalques gerados por IA não podem conter texto nem pessoas reais.
- **Áudio:** voz sintetizada só sob pedido; gravação de microfone **nunca** por padrão.

## 7. Acessibilidade e desempenho (transversal)
- WCAG 2.2 AA: contraste, alvo de toque ≥ 48 px, foco visível, ordem lógica, `prefers-reduced-motion`, redimensionamento de texto até 200 %.
- **Paridade teclado/toque/leitor de tela:** tudo que se faz no 3D tem equivalente em lista/botões, com `aria-live` descrevendo o que mudou na cena.
- Tiers de qualidade (alta/média/baixa) a partir de `detectQuality()`; **render sob demanda** em cenas estáticas (04, 09, 14, 20); modo baixo desempenho remove sombras suaves, AO, bloom e partículas.
- Orçamentos do contrato: < 450 k triângulos móvel / 750 k desktop; < 150 / < 300 draw calls; texturas 1–2 k (4 k só hero desktop). `renderer.info` é lido no teste e falha o build se estourar.

## 8. Testes e verificação (como cada critério vira evidência)
- **Manifesto:** `validate-scene` percorre a cena montada e exige os campos dos 6 atributos para cada objeto principal.
- **Lógica:** Vitest para máquinas de estado, grafos de diálogo, A*, planejador de carga, matemática de áudio/ganho, etc.
- **Fumaça + acessibilidade:** Playwright (abre, interage, reinicia, salva) + axe-core.
- **Visual:** captura determinística (câmera fixa do prompt, semente fixa, tempo congelado) → `captura/` gera par referência × render e relatório `.md` de divergências.
- **Orçamento:** triângulos, draw calls, tempo de quadro em perfil móvel simulado.
- Eu só marco um critério como cumprido **com a saída do teste ou a captura anexada**.

---

## 9. Ordem de execução (ondas) e porte

**Onda 0 — Núcleo.** Esquema + validador de manifesto, Engine v2 (perfis/tiers/sob demanda), `audio-seguro`, `a11y`, `privacidade`, `captura`, hub integrado ao launcher (porta 4567).

**Onda 1 — Quatro pilotos**, cada um prova uma família técnica e um tom clínico diferente:
- **11 Jardim dos Pensamentos** (L): instancing, texto como objeto, estado privado, tom adolescente/adulto.
- **03 Observatório da Luz** (M): materiais físicos/transmissão, conforto sensorial, sala pequena.
- **19 Oficina do Ritmo** (M): áudio ativo seguro, touch-first, criança + cuidador.
- **12 Ilha das Pausas** (XL): água, câmera em spline, cena grande sob demanda.

**Onda 2 — Interiores e som:** 02 (L) · 01 (L) · 04 (L) · 06 (L) · 09 (M) · 10 (L)
**Onda 3 — Personagens e cena:** 17 (XL) · 15 (L) · 14 (L) · 13 (XL)
**Onda 4 — Sistemas e grandes cenas:** 05 (XL) · 07 (XL, Rapier) · 08 (XL) · 18 (L) · 20 (XL, cofre cifrado) · 16 (XL, 1ª pessoa)

Porte: M ≈ cena pequena e uma mecânica; L ≈ cena rica + sistema próprio; XL ≈ cena grande ou sistema complexo (física, navegação, personagens).
Ordem é recomendação; pode ser trocada sem quebrar nada, exceto que o núcleo vem antes.

## 10. Decisões que preciso de você (com o meu padrão)
1. **Estrutura:** monorepo `recursos-3d/` com `nucleo/` + 20 apps *(padrão)* — ou uma única aplicação multirrota.
2. **GLB:** procedural + export GLB dos assets hero *(padrão)* — ou Blender manual para personagens.
3. **"Preciso de ajuda agora"** nos recursos de adolescentes/adultos *(padrão: sim)*.
4. **Linha clínica do texto:** vou escrever os convites em tom de *experimento fenomenológico* (como no Ateliê: "convite", não "instrução"), coerente com o seu acervo de Gestalt-terapia. Se o público ou a abordagem for outra, me avise.
5. **Fontes:** pares acima são proposta; valido legibilidade em teste antes de fixar.
6. **Imagens de referência:** gerar com o prompt Nano Banana de cada recurso e anexar; sem elas, a fidelidade é "por coordenadas".

## 11. O que eu não vou fazer
- Afirmar fidelidade pixel a pixel sem a imagem.
- Prometer eficácia clínica, atribuir significado fixo a cor/distância/forma/personagem, ou "interpretar" o usuário.
- Reaproveitar a mesma cena com troca de textura. Compartilhar motor, sim; compartilhar rosto, não.
- Enviar dado pessoal a qualquer serviço externo.
