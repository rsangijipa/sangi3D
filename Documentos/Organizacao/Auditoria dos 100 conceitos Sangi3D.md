# Auditoria de implementação dos 100 conceitos Sangi3D

Levantamento local de 28 de novembro de 2026 com base no [índice dos 100 conceitos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/INDICE.md>), no workspace Ambientes 3D, nos catálogos e nos projetos e ZIPs pertinentes da Área de Trabalho e de Downloads.

Encontrei **12 implementações diretas** (9 no launcher local e 3 avulsas), **26 conceitos com experiência relacionada** e **62 sem código localizado**.

- **Launcher** indica correspondência direta com entrada descoberta pelo launcher local. **Avulso** indica correspondência direta em pasta ou ZIP fora do catálogo.
- **Relacionado** indica reaproveitamento possível de uma mecânica ou uma variante próxima. **Sem código localizado** indica ausência de evidência suficiente nos locais consultados.
- Cada título da tabela abre o brief original. Os briefs e os prompts visuais são especificações. A implementação direta pode cobrir apenas parte do brief.

## Verificação no launcher

- Os nove jogos diretos no launcher responderam com HTTP 200 e inicializaram um canvas no Chromium com SwiftShader. A checagem foi de abertura e os fluxos completos ficaram fora da execução.
- Foram salvas seis capturas. A tentativa de captura do Jardim de Areia, da Casa Flutuante e do Vale dos Vaga-lumes esgotou o tempo limite após a inicialização do canvas.
- Os IDs **053, 055, 091 e 095** aparecem no catálogo dinâmico local e estão ausentes do catálogo estático salvo em [Sistema/api/apps.json](<C:/Users/aless/Downloads/Ambientes 3D/Sistema/api/apps.json>) e do pacote [Publicacao_Online](<C:/Users/aless/Downloads/Ambientes 3D/Publicacao_Online/api/apps.json>). A verificação se limita aos arquivos locais do pacote. O Jardim de Areia aparece com o rótulo “# 053”.
- Para Germinação e Dança das Sementes, os relatórios existentes documentam testes do modo alternativo Canvas. A validação WebGL não consta nesses relatórios. Para Duna Microscópica, foram conferidos código, README e arquivos de teste dentro do ZIP.

## Resumo por grupo

| Grupo | Launcher | Avulso | Relacionado | Sem código localizado |
| --- | ---: | ---: | ---: | ---: |
| 01 — Laboratórios de fenômenos físicos | 0 | 0 | 4 | 6 |
| 02 — Microcosmos e ecossistemas vivos | 0 | 1 | 1 | 8 |
| 03 — Galeria macro e fotografia tridimensional | 0 | 2 | 3 | 5 |
| 04 — Ateliês artísticos e materiais interativos | 1 | 0 | 3 | 6 |
| 05 — Simuladores de ofícios e mecanismos | 0 | 0 | 3 | 7 |
| 06 — Refúgios sensoriais e ambientes contemplativos | 2 | 0 | 1 | 7 |
| 07 — Mundos surrealistas e interativos | 3 | 0 | 1 | 6 |
| 08 — Ambientes terapêuticos e expressivos | 1 | 0 | 6 | 3 |
| 09 — Desenvolvimento infantil, ABA e Denver | 0 | 0 | 3 | 7 |
| 10 — Paisagens naturais e mundos abertos | 2 | 0 | 1 | 7 |
| **Total** | 9 | 3 | 26 | 62 |

## Conceitos e evidências

### 01 — Laboratórios de fenômenos físicos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 001 | [Laboratório de Fluidos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/001-laboratorio-de-fluidos/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Oceano de Tinta](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/02-oceano-de-tinta>) · Compartilha advecção e mistura de pigmentos. O laboratório propõe também experimentos de estratificação e vórtice. |
| 002 | [Esculturas Magnéticas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/002-esculturas-magneticas/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Laboratório de Ferrofluido](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/07-laboratorio-de-ferrofluido>) · As fontes magnéticas movem um fluido. A escultura proposta usa partículas e desafios de simetria. |
| 003 | [Geometria do Som](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/003-geometria-do-som/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Universo Audioreativo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/08-universo-audioreativo>) · Visualização reativa a áudio. A geometria proposta usa placas vibratórias e comparação de padrões de areia. |
| 004 | [Túnel de Vento](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/004-tunel-de-vento/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 005 | [Câmara de Gravidades](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/005-camara-de-gravidades/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Câmara Antigravitacional](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/12-camara-antigravitacional>) · Simula corpos com gravidade, colisão e campo central. O brief pede três cenários gravitacionais e sandbox. |
| 006 | [Laboratório de Superfícies](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/006-laboratorio-de-superficies/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 007 | [Máquina dos Pêndulos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/007-maquina-dos-pendulos/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 008 | [Jardim de Cristalização](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/008-jardim-de-cristalizacao/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 009 | [Oficina das Bolhas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/009-oficina-das-bolhas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 010 | [Laboratório de Capilaridade](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/01-laboratorios-fisicos/010-laboratorio-de-capilaridade/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 02 — Microcosmos e ecossistemas vivos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 011 | [Universo de uma Gota](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/011-universo-de-uma-gota/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 012 | [Formigueiro Subterrâneo](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/012-formigueiro-subterraneo/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 013 | [Microfloresta Bioluminescente](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/013-microfloresta-bioluminescente/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Floresta Bioluminescente](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/03-floresta-bioluminescente>) · Exploração e registro de espécies em trilha. O brief pede também lente macro e comparação do brilho dos fungos em diferentes umidades. |
| 014 | [Berçário de Corais](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/014-bercario-de-corais/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 015 | [Mundo Debaixo da Pedra](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/015-mundo-debaixo-da-pedra/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 016 | [Laboratório de Germinação](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/016-laboratorio-de-germinacao/PROTOTIPO_JOGAVEL.md>) | Avulso | [Arquivo](<C:/Users/aless/Desktop/Laboratorio_de_Germinacao_Sangi3D/laboratorio-germinacao/index.html>) · Semeadura, umidade, fototropismo, comparação e diário. O relatório registra testes no Canvas alternativo. |
| 017 | [Ecossistema de Manguezal](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/017-ecossistema-de-manguezal/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 018 | [Jardim Carnívoro](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/018-jardim-carnivoro/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 019 | [Ilha dos Caracóis](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/019-ilha-dos-caracois/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 020 | [Anatomia de uma Árvore](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/02-microcosmos-ecossistemas/020-anatomia-de-uma-arvore/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 03 — Galeria macro e fotografia tridimensional

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 021 | [Orvalho e Refração](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/021-orvalho-e-refracao/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Observatório da Luz](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/4 - Kit 17 Jogos/04-observatorio-da-luz>) · A refração já é explorada no observatório. O brief pede gotas sobre uma folha e controles de fotografia macro. |
| 022 | [Arquitetura das Asas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/022-arquitetura-das-asas/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Cosmos & Hesperiidae](<C:/Users/aless/Downloads/cosmos_hesperiidae_reconstru_o_3d_macro_de_alta_fidelidade.html>) · Reconstrução macro de borboleta com órbita, hotspots e referências fotográficas. O brief especifica inspeção das escamas de uma asa iridescente. |
| 023 | [Dança das Sementes](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/023-danca-das-sementes/PROTOTIPO_JOGAVEL.md>) | Avulso | [Arquivo](<C:/Users/aless/Desktop/Danca_das_Sementes_Sangi3D/danca-das-sementes/index.html>) · Trajetórias de três tipos de sementes, vento, comparação e exportação. O relatório registra testes da física e da interface alternativa. |
| 024 | [Cristais de Gelo](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/024-cristais-de-gelo/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 025 | [Geometria das Conchas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/025-geometria-das-conchas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 026 | [Líquens sobre a Rocha](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/026-liquens-sobre-a-rocha/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 027 | [Teia ao Amanhecer](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/027-teia-ao-amanhecer/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 028 | [Arquitetura de uma Pena](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/028-arquitetura-de-uma-pena/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 029 | [Duna Microscópica](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/029-duna-microscopica/PROTOTIPO_JOGAVEL.md>) | Avulso | [Arquivo](<C:/Users/aless/Desktop/duna-microscópica.zip>) · Fontes React, Three.js e TypeScript, com vento, inclinação, peneira e fotografia macro. O ZIP contém instruções e testes de simulação, e requer build. |
| 030 | [O Desabrochar](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/03-galeria-macro/030-o-desabrochar/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Flor Rosa · Macro 3D](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/7 - Cenas 3D/09-flor-macro>) · Flor navegável em macro. O brief pede abertura progressiva do botão e comparação de estágios. |

### 04 — Ateliês artísticos e materiais interativos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 031 | [Ateliê de Cerâmica](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/031-atelie-de-ceramica/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/13-atelie-de-ceramica/index.html>) · Modelagem de argila, esmalte, queima e exportação. As três formas orientadas e a galeria de peças pedidas no brief ficaram sem comprovação. |
| 032 | [Sopraria de Vidro](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/032-sopraria-de-vidro/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Sopraria das Transformações](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/3 - Expressao e Desenvolvimento/08-sopraria-das-transformacoes/README.md>) · O ciclo de aquecer, expandir, modelar e resfriar existe. Os modos explícitos de esfera, vaso e forma livre do brief ficaram sem comprovação. |
| 033 | [Pintura sobre a Água](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/033-pintura-sobre-a-agua/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Oceano de Tinta](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/02-oceano-de-tinta>) · A manipulação de pigmento em água existe. A transferência de um desenho flutuante ao papel ficou sem evidência. |
| 034 | [Ateliê de Tecelagem](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/034-atelie-de-tecelagem/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Tear dos Vínculos](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/2 - Projetos/tear-dos-vinculos>) · O tear interativo oferece uma base. O brief pede três padrões têxteis e exportação do desenho. |
| 035 | [Escultor de Pedra](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/035-escultor-de-pedra/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 036 | [Oficina de Papel Artesanal](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/036-oficina-de-papel-artesanal/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 037 | [Arte em Resina](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/037-arte-em-resina/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 038 | [Ateliê de Encadernação](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/038-atelie-de-encadernacao/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 039 | [Pintura Impasto](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/039-pintura-impasto/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 040 | [Oficina de Mosaicos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/04-atelies-artisticos/040-oficina-de-mosaicos/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 05 — Simuladores de ofícios e mecanismos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 041 | [Relojoaria Mecânica](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/041-relojoaria-mecanica/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Relógio Aberto](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/6 - Adultos e Marcas/11_relogio-aberto>) · Corda, engrenagens, escape e vista explodida. A proposta inclui desmontagem, montagem em estágios e reparo guiado. |
| 042 | [Oficina do Luthier](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/042-oficina-do-luthier/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 043 | [Estaleiro em Miniatura](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/043-estaleiro-em-miniatura/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 044 | [Tipografia Artesanal](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/044-tipografia-artesanal/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 045 | [Oficina de Autômatos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/045-oficina-de-automatos/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 046 | [Laboratório de Perfumaria](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/046-laboratorio-de-perfumaria/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Órgão do Perfumista](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/6 - Adultos e Marcas/18_orgao-do-perfumista>) · Escolha de essências, dosagem e composição. O brief descreve três fórmulas virtuais e biblioteca. |
| 047 | [Torrefação de Café](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/047-torrefacao-de-cafe/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Barista de Bancada](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/6 - Adultos e Marcas/15_barista-de-bancada>) · Preparo de café em bancada. O conceito pede controle e acompanhamento da torra. |
| 048 | [Oficina de Marcenaria](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/048-oficina-de-marcenaria/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 049 | [Miniatura Ferroviária](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/049-miniatura-ferroviaria/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 050 | [Laboratório de Pontes](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/05-oficios-mecanismos/050-laboratorio-de-pontes/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 06 — Refúgios sensoriais e ambientes contemplativos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 051 | [Estufa da Chuva](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/051-estufa-da-chuva/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Refúgio da Chuva](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/14-refugio-da-chuva>) · Já oferece clima, chuva e exploração contemplativa em cabana. A estufa proposta acrescenta plantas, ventilação e composição climática. |
| 052 | [Refúgio Termal](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/052-refugio-termal/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 053 | [Jardim de Areia](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/053-jardim-de-areia/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/1 - Jogos HTML/jardim-de-areia/index.html>) · Rastelo, pedras móveis, padrões e desfazer. A entrada local aparece como “# 053”. |
| 054 | [Observatório das Auroras](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/054-observatorio-das-auroras/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 055 | [Casa Flutuante no Lago](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/055-casa-flutuante-no-lago/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/1 - Jogos HTML/casa-flutuante/index.html>) · Caminhada, cortinas, assento, clima, balanço e luz. A cópia do workspace abriu pelo launcher. |
| 056 | [Deserto ao Entardecer](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/056-deserto-ao-entardecer/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 057 | [Cabana na Neve](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/057-cabana-na-neve/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 058 | [Caverna das Gotas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/058-caverna-das-gotas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 059 | [Corredor das Lanternas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/059-corredor-das-lanternas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 060 | [Jardim de Fontes](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/06-refugios-sensoriais/060-jardim-de-fontes/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 07 — Mundos surrealistas e interativos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 061 | [Arquitetura do Impossível](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/061-arquitetura-do-impossivel/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/10-arquitetura-do-impossivel/index.html>) · Ponte alinhada por perspectiva e travessia via portal. O brief pede três travessias. A documentação descreve uma. |
| 062 | [Oceano de Tinta](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/062-oceano-de-tinta/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/02-oceano-de-tinta/index.html>) · Injeção de pigmento, advecção, obstáculo e viscosidade. As três ilhas de paletas pedidas no brief ficaram sem comprovação. |
| 063 | [O Céu das Medusas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/063-o-ceu-das-medusas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 064 | [Escultor de Planetas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/064-escultor-de-planetas/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/09-escultor-de-planetas/index.html>) · Pincéis sobre globo, mar ajustável, comparação e importação/exportação. |
| 065 | [Cidade de Papel](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/065-cidade-de-papel/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 066 | [Mundo dentro do Espelho](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/066-mundo-dentro-do-espelho/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 067 | [Montanhas de Tecido](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/067-montanhas-de-tecido/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 068 | [Floresta de Relógios](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/068-floresta-de-relogios/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 069 | [Museu da Gravidade](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/069-museu-da-gravidade/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Câmara Antigravitacional](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/12-camara-antigravitacional>) · Oferece experimentos de gravidade. O conceito pede salas navegáveis com mudanças no eixo de gravidade. |
| 070 | [Universo de Origamis](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/07-mundos-surrealistas/070-universo-de-origamis/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

### 08 — Ambientes terapêuticos e expressivos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 071 | [Estufa dos Sentimentos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/071-estufa-dos-sentimentos/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 072 | [Museu das Memórias](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/072-museu-das-memorias/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/11-museu-das-memorias/index.html>) · Quatro galerias e oito espaços editáveis com texto, símbolo ou foto, mais importação/exportação de acervo. |
| 073 | [Jardim dos Caminhos Possíveis](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/073-jardim-dos-caminhos-possiveis/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 074 | [Ateliê das Marcas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/074-atelie-das-marcas/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Ateliê das Reconstruções](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/3 - Expressao e Desenvolvimento/05-atelie-das-reconstrucoes-kintsugi/README.md>) · A recomposição de fragmentos por kintsugi existe sob outra proposta. O recorte específico do brief ficou sem comprovação. |
| 075 | [Casa das Fronteiras](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/075-casa-das-fronteiras/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Estúdio dos Limites](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/4 - Kit 17 Jogos/14-estudio-dos-limites>) · Há uma experiência sobre limites. A casa proposta usa portas e divisórias manipuláveis para compor diferentes configurações. |
| 076 | [Oficina das Vozes Internas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/076-oficina-das-vozes-internas/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Rádio dos Pensamentos](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/3 - Expressao e Desenvolvimento/11-radio-dos-pensamentos>) · Compartilha a representação interativa de pensamentos em áudio. O brief usa personagens e caixas sonoras num palco. |
| 077 | [Porto das Despedidas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/077-porto-das-despedidas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 078 | [Mochila Invisível](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/078-mochila-invisivel/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Mochila da Travessia](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/2 - Projetos/mochila-da-travessia-projeto>) · Compartilha a metáfora da mochila e de objetos manipuláveis. A experiência exata do brief ficou sem comprovação. |
| 079 | [Cidade das Perspectivas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/079-cidade-das-perspectivas/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Museu dos Pontos de Vista](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/4 - Kit 17 Jogos/13-museu-dos-pontos-de-vista>) · Há uma atividade de perspectivas. O conceito pede alternar entre personagens em praça urbana. |
| 080 | [Atlas do Corpo Sentido](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/08-terapeuticos-expressivos/080-atlas-do-corpo-sentido/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Cartografia do Corpo Sentido](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/9 - Arquivados/cartografia-do-corpo-sentido.html>) · Versão arquivada com mapa corporal. A comparação voluntária de sessões do novo brief ficou sem comprovação. |

### 09 — Desenvolvimento infantil, ABA e Denver

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 081 | [Oficina dos Brinquedos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/081-oficina-dos-brinquedos/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 082 | [Estação das Sequências](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/082-estacao-das-sequencias/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 083 | [Teatro dos Gestos](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/083-teatro-dos-gestos/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Oficina dos Gestos Compartilhados](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/2 - Projetos/oficina-dos-gestos-compartilhados-projeto>) · Compartilha a atividade de gestos. O teatro proposto pede fantoche articulado, sequências e criação livre. |
| 084 | [Mercado das Descobertas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/084-mercado-das-descobertas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 085 | [Fazenda das Rotinas](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/085-fazenda-das-rotinas/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 086 | [Fábrica das Cores](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/086-fabrica-das-cores/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 087 | [Construção a Dois](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/087-construcao-a-dois/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 088 | [Oficina de Causa e Efeito](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/088-oficina-de-causa-e-efeito/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Máquina de Reação em Cadeia](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/6 - Adultos e Marcas/10_maquina-de-reacao-em-cadeia>) · Interação com mecanismos encadeados. O brief pede parede infantil com rampas, sinos, bolas e luzes. |
| 089 | [Jardim do Faz de Conta](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/089-jardim-do-faz-de-conta/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 090 | [Expedição dos Sons](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/09-desenvolvimento-infantil/090-expedicao-dos-sons/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Cartografia dos Sons](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/4 - Kit 17 Jogos/01-cartografia-dos-sons>) · Atividade de exploração e localização sonora. O percurso infantil por estações do bosque ficou sem evidência. |

### 10 — Paisagens naturais e mundos abertos

| ID | Conceito | Situação | Evidência |
| --- | --- | --- | --- |
| 091 | [Expedição pelo Igarapé](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/091-expedicao-pelo-igarape/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/2 - Projetos/expedicao-pelo-igarape/README.md>) · Canoa, correnteza, atracagem, fauna e diário fotográfico. O workspace contém código e build. |
| 092 | [Floresta das Nuvens](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/092-floresta-das-nuvens/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 093 | [Estufa Esquecida](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/093-estufa-esquecida/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 094 | [Floresta Submersa](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/094-floresta-submersa/PROTOTIPO_JOGAVEL.md>) | Relacionado | [Cidade Submersa](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/5 - Sangi3D 15 Experiencias/06-cidade-submersa>) · Nado, lanterna e exploração subaquática. O brief propõe floresta amazônica sazonalmente inundada, três zonas ecológicas e fotografia. |
| 095 | [Vale dos Vaga-lumes](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/095-vale-dos-vaga-lumes/PROTOTIPO_JOGAVEL.md>) | Launcher | [Arquivo](<C:/Users/aless/Downloads/Ambientes 3D/Jogos/1 - Jogos HTML/vale-dos-vaga-lumes/index.html>) · Trilha, enxames luminosos, ajuste de hora, fotografia e diário de padrões. |
| 096 | [Arquipélago das Marés](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/096-arquipelago-das-mares/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 097 | [Observatório da Tempestade](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/097-observatorio-da-tempestade/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 098 | [Cidade Abandonada pela Natureza](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/098-cidade-abandonada-pela-natureza/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 099 | [Expedição Glacial](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/099-expedicao-glacial/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |
| 100 | [Jardim das Estações](<C:/Users/aless/Desktop/Sangi3D_100_Conceitos_Prompts_e_Prototipos/Sangi3D_100_Conceitos/10-paisagens-mundos-abertos/100-jardim-das-estacoes/PROTOTIPO_JOGAVEL.md>) | Sem código localizado | — |

