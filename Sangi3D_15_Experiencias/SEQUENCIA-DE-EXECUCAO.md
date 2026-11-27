# Sangi3D — sequência de execução

O pacote contém 15 conceitos de produção. Os números das pastas seguem o ZIP. A coluna **Ordem** define quando desenvolver cada recurso. Cada pasta contém um mockup HTML com um estado de interação, a arte conceitual local em PNG e um prompt autocontido. Os três protótipos listados abaixo foram inspecionados estaticamente.

## Ordem recomendada

| Ordem | Recurso | Base que pode reaproveitar | Recorte para liberar a expansão |
|---:|---|---|---|
| 01 | [Refúgio da Chuva](14-refugio-da-chuva/mockup.html) · [Prompt](14-refugio-da-chuva/PROMPT.md) | — | Entrada independente, pausa, troca de clima, navegação curta e som por zona. |
| 02 | [Ateliê de Cerâmica](13-atelie-de-ceramica/mockup.html) · [Prompt](13-atelie-de-ceramica/PROMPT.md) | — | Manipulação precisa, seleção alternativa ao arraste e undo/redo. |
| 03 | [Universo Audioreativo](08-universo-audioreativo/mockup.html) · [Prompt](08-universo-audioreativo/PROMPT.md) | — | Fonte demonstrativa, troca de fonte, análise por bandas e reação a pausa. |
| 04 | [Floresta Bioluminescente](03-floresta-bioluminescente/mockup.html) · [Prompt](03-floresta-bioluminescente/PROMPT.md) | 01 · câmera e ação contextual | Dois marcos, travessia e continuidade com vegetação em qualidade baixa. |
| 05 | [Câmara Antigravitacional](12-camara-antigravitacional/mockup.html) · [Prompt](12-camara-antigravitacional/PROMPT.md) | 02 · captura e cancelamento de ponteiro | Gravidade zero, impulso e trajetória com passo fixo. |
| 06 | [Museu das Memórias](11-museu-das-memorias/mockup.html) · [Prompt](11-museu-das-memorias/PROMPT.md) | 01 + 02 · percurso, seleção e histórico | Slots, teclado e acervo local versionado. |
| 07 | [Corpo de Partículas](01-corpo-de-particulas/mockup.html) · [Prompt](01-corpo-de-particulas/PROMPT.md) | 02 + 03 · ponteiro e áudio com descarte | Resposta ao ponteiro e transição para repouso antes da câmera opcional. |
| 08 | [Laboratório de Ferrofluido](07-laboratorio-de-ferrofluido/mockup.html) · [Prompt](07-laboratorio-de-ferrofluido/PROMPT.md) | 02 + 05 · manipulação e passo fixo | Dois parâmetros de fonte e superfície estável na bancada. |
| 09 | [Oceano de Tinta](02-oceano-de-tinta/mockup.html) · [Prompt](02-oceano-de-tinta/PROMPT.md) | 02 + 08 · bancada, controles e diagnóstico de estabilidade | Solver mínimo reproduzível e preservação de estado ao mudar a orientação. |
| 10 | [Maestro Invisível](15-maestro-invisivel/mockup.html) · [Prompt](15-maestro-invisivel/PROMPT.md) | 03 + 07 · ciclo de áudio e entrada gestual | Pulso manual, áudio agendado e reprodução antes do gesto por câmera. |
| 11 | [Escultor de Planetas](09-escultor-de-planetas/mockup.html) · [Prompt](09-escultor-de-planetas/PROMPT.md) | 02 + 04 · histórico e malha com seed | Pincel contínuo, histórico e persistência antes de atmosfera e biomas adicionais. |
| 12 | [Trem sem Destino](05-trem-sem-destino/mockup.html) · [Prompt](05-trem-sem-destino/PROMPT.md) | 01 + 04 · zonas e paisagem procedural | Dois vagões, emendas de segmentos e rota de referência. |
| 13 | [Cidade da Madrugada](04-cidade-da-madrugada/mockup.html) · [Prompt](04-cidade-da-madrugada/PROMPT.md) | 01 + 04 + 12 · clima, navegação e streaming | Travessia funcional, café navegável e chuva por setor. |
| 14 | [Cidade Submersa](06-cidade-submersa/mockup.html) · [Prompt](06-cidade-submersa/PROMPT.md) | 04 + 13 · navegação, setores e legibilidade em névoa | Circuito em profundidade, alvo legível, diário e retorno. |
| 15 | [Arquitetura do Impossível](10-arquitetura-do-impossivel/mockup.html) · [Prompt](10-arquitetura-do-impossivel/PROMPT.md) | 04 + 05 · navegação e restrições | Alinhamento com colisão consistente, reset e transição confortável. |

As dependências indicam componentes candidatos a reaproveitamento. Cada jogo deve iniciar e rodar sozinho. Extraia código comum depois de validar o mesmo comportamento em duas cenas.

## Lotes

1. **01–03 · Controles, criação e áudio.** Valide três recortes pequenos para testar navegação contextual, ferramenta contínua e relógio/controle de áudio.
2. **04–06 · Navegação, colisões e persistência.** Cubra câmera em ambientes, físicas determinísticas em pequena escala e exportação/importação local.
3. **07–11 · Gestos e simulações.** Use entradas de mouse, teclado e toque antes dos sensores. Construa cenas pequenas para provar cada solver e editor.
4. **12–15 · Mundos extensos e transições espaciais.** Amplie setores só após testar câmera, streaming, pontos de referência, saída segura e desempenho do primeiro circuito.

## Fluxo verificável por experiência

1. Leia o prompt e abra o mockup. Se houver HTML, registre os fluxos preservados, versão, modo de execução e comportamento da câmera e input. Crie uma cópia de trabalho.
2. Escreva a menor verificação do recorte. Construa a cena em blocos e implemente o circuito da ação, feedback, pausa, reset e saída. Em jogos que usam seed, exporte a configuração e o roteiro de entrada usados no teste.
3. Gere a geometria em escala antes de instalar materiais. Faça uma captura de referência com a câmera do mockup. Registre origem, geração, licença, unidades e variações dos assets. Refine PBR, materiais, iluminação, áudio e alternativas de acessibilidade após provar o circuito.
4. Acerte desktop e toque dentro do recorte. Teste teclado, foco, pausa/retomada, movimento reduzido, reset e falhas de inicialização. Para recursos que usam câmera ou microfone, teste recusa, troca de fonte e liberação de tracks, inclusive dentro de iframe quando aplicável.
5. Registre resolução, aparelho, backend e frame time. Use as metas do prompt de 30 FPS em celular intermediário e 60 FPS em desktop capaz como objetivos a medir. Revise p95 de frame time, memória e custo dos efeitos em cenas equivalentes. Se o Game Development Studio estiver instalado, use o manifesto e o adaptador aplicável para captura e comparação entre execuções equivalentes. O comando game-dev não foi localizado no PATH deste workspace durante a preparação do kit.
6. Valide primeiro a entrada independente. Inspecione o contrato real do launcher antes de integrar e teste em separado pausa, retorno, descarte e permissões.

## Protótipos localizados

- Trem sem Destino tem uma cena train() com um vagão, paisagem reciclada, interação por proximidade e renderização Three.js online opcional. [HTML existente](../01_Jogos_HTML/trem-sem-destino/trem-sem-destino.html)
- Cidade Submersa tem uma cena city() com arcos e pontos de descoberta. O primeiro recorte usa seus marcos como referência para testar profundidade, lanterna e diário. [HTML existente](../01_Jogos_HTML/cidade-submersa/cidade-submersa.html)
- Universo Audioreativo tem uma cena tunnel() e um analisador com amplitude agregada. O recorte usa tons controlados para testar resposta separada por bandas. [HTML existente](../01_Jogos_HTML/universo-audioreativo/universo-audioreativo.html)

## Referência técnica

A estratégia para o renderizador parte do Three.js Director e do backend existente de cada protótipo. Antes de ampliar o escopo, valide o backend WebGPU ou WebGL 2 no dispositivo-alvo, incluindo o custo de efeitos TSL e de compute. [Manual oficial](https://threejs.org/manual/pages/webgpurenderer)

A fonte original é Sangi3D_Pacote_15_Prompts.zip. As imagens do kit são artes conceituais geradas com ImageGen. Os mockups representam intenção de arte e interface. Desempenho, fidelidade das simulações e integração são critérios de produção futura.
