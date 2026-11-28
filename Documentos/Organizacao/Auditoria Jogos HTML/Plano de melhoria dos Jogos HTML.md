# Sangi3D — Plano de melhoria dos 47 Jogos HTML

## 00 — Resumo executivo

A primeira rodada deve estabilizar a abertura dos jogos e validar três experiências que cobrem perfis diferentes: **Oficina de Mosaicos** para criação, **Universo de uma Gota** para exploração visual e **Moinho Hidráulico** para simulação. A prioridade é validar as interações já disponíveis e melhorar a apresentação delas. Isso dá uma base para decidir onde novas fases acrescentam valor.

Usei as 47 fichas de “1 - Jogos HTML” como ponto de partida e conferi as entradas no workspace Ambientes 3D. As fichas e seus prompts forneceram referências e hipóteses. Neste trabalho, as fases e a ordem dos pilotos são propostas. A implementação fica para a etapa seguinte.

## 01 — Inventário e cobertura

- O pacote anexado contém 47 diretórios com 94 arquivos de documentação. A [triagem por jogo](Triagem%20dos%2047%20jogos.csv) registra o caminho local de cada entrada, sinais identificados no HTML e nos módulos JS locais diretamente referenciados, status histórico, ocorrências atuais e uma sequência proposta para cada jogo. Os campos **Arte**, **Simulação** e **Aceite sugerido na ficha** vêm do inventário fornecido.
- A API dinâmica local encontrou 50 rotas dessa coleção, incluindo 46 das 47 fichas. Casa Flutuante, Jardim de Areia, Observatório das Auroras e Vale dos Vaga-lumes, antes marcados fora do catálogo, têm rota na cópia local em execução. A Agência Postal tem arquivo local e ficou fora da lista retornada. Revisar sua relação com o outro Correio antes de alterar o catálogo. O JSON estático `Sistema/api/apps.json`, consultado à parte, tinha 42 entradas desta coleção no momento da leitura.
- As quatro rotas adicionais foram Estufa dos Sentimentos, Geometria das Conchas, Jardim dos Caminhos Possíveis e Museu das Memórias. Entraram apenas no teste de abertura. `Jogos/1 - Jogos HTML/shared/` é infraestrutura local.
- A inspeção identificou sinais de Three.js em 45 das 47 entradas e menções a CDN do Three.js em 32. Há sinais de preferência por movimento reduzido em 33 e de integração com Sangi3D em 16. Essas contagens são de ocorrências no código pesquisado. Os jogos podem usar recursos indiretamente por meio de módulos compartilhados.

## 02 — Achados e ordem de trabalho

| ID | Achado e impacto | Mudança proposta e teste de aceite |
| --- | --- | --- |
| HTML-01 · P1 | Há dependências externas carregadas na inicialização. O smoke encontrou falhas de DNS para módulos e controles em vários títulos. Alguns chegaram a criar canvas antes de lançar erro. Confiança alta para o comportamento observado neste ambiente. | Priorizar módulos e addons essenciais na mesma revisão, começando pelo Moinho como piloto. Validar com localhost acessível e rede externa bloqueada. O loop principal precisa responder. Testar fontes e estilos separadamente com alternativas locais de layout. |
| HTML-02 · P1 | O relatório histórico, o catálogo gerado e o catálogo dinâmico têm coberturas diferentes. A Agência Postal requer decisão de produto sobre identidade e coexistência com o Correio original. | Conferir regra no catálogo, URL canônica e aliases. Registrar justificativa por divergência. Confirmar que atalhos antigos levam para a entrada aprovada e publicar o catálogo regenerado apenas no fluxo normal do projeto. |
| HTML-03 · P1 | `Sistema/scripts/check-all-games.mjs` considera a existência e as dimensões do canvas. Geometria das Conchas exemplifica um canvas que existe junto com um erro de módulo, e Restauro tem uma interface DOM inicial. | Classificar a abertura por tipo de experiência. Exigir uma ação de entrada que mude estado, uma imagem renderizada quando a fase usa canvas e um erro de inicialização visível para recuperação. Incluir desktop, toque emulado e launcher. |
| HTML-04 · P1 | A ficha histórica propõe registrar observações no Universo de uma Gota. A cópia local já contém `js/journal-system.js`, `js/sample-registry.js`, `js/quality-manager.js` e a bancada `js/laboratory-world.js`. | Refinar a transição entre bancada, observação e registro. Validar fluxo existente e atualizar a ficha depois do teste. Revisar também os prompts de Bolhas e Mosaicos, cujos controles e exportações já são implementados. |
| HTML-05 · P1, adjacente | Geometria das Conchas apresenta erro de módulo em execução. `js/ui-controller.js` importa `PHOTO_FRAMINGS` de `./state.js`, que o navegador relata não exportar o nome. Esse jogo está fora das 47 fichas, mas aparece no catálogo local. | Encaminhar a correção do contrato do módulo. Validar abertura, troca de enquadramento e exportação com a interface inicializada. |

## 03 — Scorecard de evidências

| Escopo | Resultado observado | Limite |
| --- | --- | --- |
| HTTP nas rotas da coleção | 50/50 responderam 200 | Presença da página HTML. |
| Smoke sem ocorrência e com canvas detectado | 22/50 rotas locais, sendo 19/46 entre as fichas catalogadas | Chrome headless, viewport desktop, janela curta. Canvas presente tem cobertura inferior a um teste funcional. |
| Ocorrências | 28/50. Rede externa, erro local de importação e uma abertura sem canvas visível no detector. | A execução permitiu GET para alguns CDNs e bloqueou outros domínios externos, inclusive Tailwind. DNS e bloqueio de domínio precisam ser distinguidos na triagem. |
| Testes unitários existentes | 14/14 em Bolhas e Gota | Casos de simulação e modelos de jogo cobertos por quatro arquivos de teste. |
| Testes funcionais de amostra | Bolhas e Mosaicos passaram em desktop, retrato, paisagem e ao abrir/voltar pelo launcher. Na Gota, identificação, objetiva de 20× e download PNG responderam no desktop. | Nos dois primeiros jogos o toque foi emulado. A amostra da Gota não cobriu diário ou loop do launcher. |
| Arte comparativa, acessibilidade completa, FPS e mobile físico | Pendentes para a coleção | Sem nota global de qualidade. |

## 04 — Fases e recursos por família

| Família | Qtde. | Estrutura recomendada | Critério pela mecânica |
| --- | ---: | --- | --- |
| Ateliês e criação | 13 | Demonstração curta → primeira peça → composição ou restauração → criação livre. | Desfazer uma ação restaura geometria e estado; exportar/reabrir preserva a obra quando a função se aplica. |
| Natureza, luz e materiais | 11 | Vista geral → observação em detalhe → comparação opcional de condições. | Distância e foco deixam o assunto legível; a experiência continua controlável sem efeitos intensos. |
| Espaços de exploração | 6 | Marco na entrada → rota curta com um ponto de interesse → exploração livre. | A pessoa reconhece um marco e consegue retornar após visitar uma área com teclado e toque. |
| Mecânica | 3 | Calibração → teste de uma variável → desafio opcional. | Uma alteração de entrada produz consequência repetível e clara. Reset restaura o estado inicial. |
| Narrativas reflexivas | 10 | Escolha inicial → percursos curtos → revisão ou encerramento voluntário. | Pausar, pular e sair estão disponíveis. Escrita e persistência são voluntárias. |
| Áudio e ritmo | 4 | Demonstração local → interação → variação ou reprodução. | Ações de ouvir e silenciar têm resposta visual. Um modo local está disponível onde microfone for opcional. |

## 05 — UI, UX e direção de arte

Mantenha visível a próxima ação da fase guiada e deixe modo livre disponível. Em desktop, use o painel lateral para propriedades; em retrato, use painel inferior rolável e preserve o centro para a interação. Limite atalhos de jogo à área ativa. Inclua nomes dos controles, foco visível, saída por teclado, opções para movimentos complexos e feedback sem depender de cor ou áudio.

Em ateliês, concentre detalhe nas ferramentas e no objeto de trabalho. Em ambientes, componha entrada, marco intermediário e destino usando escala, iluminação e contraste antes de acrescentar objetos. Em experiências com gráficos abstratos, mantenha a legibilidade da linguagem visual original.

## 06 — Gráficos, física e áudio

- Comece por luz difusa, sombras de contato e rugosidade coerente com a escala. Compare capturas da mesma câmera e mesma ação antes/depois. Meça efeitos de pós-processamento antes de adotá-los no perfil padrão.
- Modele apenas o fenômeno necessário para a ação. No Moinho, ligar controle da água à leitura de rotação e à desaceleração. Nas Bolhas, usar os testes existentes para proteger formação, limite de entidades e ruptura. Em Mosaicos, priorizar encaixe visual e feedback da ferramenta.
- Mantenha silêncio inicial, acionamento de áudio por gesto e estado de pausa consistente com o launcher. Em atividades com microfone opcional, começar com demonstração local e tratar recusa, interrupção e encerramento da captura.

## 07 — Ambientes e recursos dos pilotos

| Piloto | Recurso já existente | Trabalho proposto | Validação |
| --- | --- | --- | --- |
| **Oficina de Mosaicos** | `main.js` expõe giro, pré-corte, rejunte, histórico e exportação. `model.js` define tabuleiro 21 × 21 e armazenamento. `scene.js` renderiza a bancada. | Tutorial de uma faixa de tesselas, acabamento e criação livre. Aproximar câmera da junta durante o rejunte, dar textura à cerâmica e manter diferença visual entre ferramenta ativa e ação aplicada. | Assentar/girar/rejuntar, desfazer/refazer, exportar JSON, reabrir e comparar a obra. Conferir legibilidade da grade nos dois formatos. |
| **Universo de uma Gota** | Bancada, catálogo, objetivas, diário e recursos de óptica já estão no código atual. | Preparar uma amostra virtual → focar e acompanhar → registrar uma observação. Reforçar a transição bancada–visor e manter as fichas e ferramentas de observação legíveis em macro. | Selecionar uma amostra, trocar objetiva, acompanhar e salvar no diário. Validar recuperação e exportação de fotografia. A experiência trabalha com representações virtuais. |
| **Moinho Hidráulico** | O HTML já declara os modos Livre, Guiado e Desafios e ferramentas de navegação. O smoke registrou falha na resolução do módulo Three.js remoto. | Estabilizar os módulos, revisar guias existentes e usar câmera e luz para destacar comporta, roda e transmissão. Oferecer uma leitura visual da cadeia de causa e efeito. | No Guiado, abrir e fechar a comporta, observar rotação subir e cair e repetir após reset. Executar com rede externa bloqueada. |

O manifesto de cada piloto deve indicar geometria, materiais/texturas, áudio, capa, origem, licença, orçamento e aplicação. Priorize os assets existentes e procedurais. Para pacotes 3D novos, planeje inspeção, validação do formato e admissão local antes de trocar a origem do asset. O comando `game-dev` não foi encontrado no PATH. Produção e admissão de pacotes, captura especializada e telemetria desse plugin ficaram fora da execução. O smoke usou o resolvedor Playwright do repositório.

## 08 — Mobile, acessibilidade e desempenho

Adote 360 × 640, 390 × 844, 844 × 390 e 1366 × 768 como matriz inicial. Valide o viewport antes de acrescentar arte de maior custo. Separe gesto de câmera do gesto de ferramenta em jogos com ambos. Um toque simples deve selecionar; pinça e arraste devem cancelar seleção. Verifique teclado, ampliação, menu rolável, áreas seguras e redução de movimento. Use o mesmo roteiro no launcher e na URL direta.

Medição proposta por piloto: 5 s de aquecimento e 30 s de cenário reproduzível, seguidos de 10 ciclos de abrir/sair para observar acúmulo de memória quando mensurável. Registre frame time p50/p95, DPR, draw calls, triângulos e tempo até a primeira ação. Metas iniciais de p95 ≤ 33,3 ms no perfil Baixo em celular e ≤ 20 ms no Alto em desktop. Fixe o cenário e o hardware antes de comparar candidatos. Em caso de estouro, reduzir custo de sombras ou pós-processamento antes de prejudicar controles e leitura do objeto.

## 09 — Roadmap com portas de saída

1. **Base e abertura · 2–4 dias.** Reproduzir ocorrências e separar falha local, import externo e fallback de estilo. Revisar divergências de catálogo e identificar os pares de versões. Entregar uma matriz por entrada e um caminho executável sem rede no primeiro piloto dependente de CDN.
2. **Três pilotos · 1–2 semanas.** Mosaicos valida criação e persistência. Gota valida observação e transição entre cenas. Moinho valida onboarding e resposta causal. Cada piloto sai com o loop já existente exercitado, uma fase curta melhorada e capturas da mesma ação antes/depois.
3. **Aplicação por famílias · lotes de 5–8 jogos.** Começar por oficinas e simuladores com dependências parecidas. Em seguida, trabalhar exploração/natureza, narrativas e áudio. Usar a sequência de cada jogo da triagem como hipótese e aprovar o próximo lote após revisar os resultados do bloco anterior.
4. **Aceitação e catálogo.** Testar dispositivos físicos, validar carregamento e recuperação, atualizar capas a partir do que roda e registrar status de QA por jogo. Manter o fluxo normal de publicação do projeto.

Estimativas para uma pessoa familiarizada com o projeto. O esforço varia com a disponibilidade de hardware, necessidade de localizar dependências e retrabalho nos jogos HTML legados.

## 10 — QA e critérios de aceitação

- **Abertura.** Rota direta e iframe do catálogo chegam ao primeiro controle utilizável. Jogos em que há fase DOM antes do canvas precisam de ação específica para chegar à cena. Registre erros de script, HTTP, recurso externo e fallback.
- **Loop principal.** Toda fase proposta deve ter ação, consequência observável e saída. Teste o uso repetido de ferramentas, erro de entrada, cancelamento, reset, pausa e retomada, conforme o gênero.
- **Persistência.** Obra ou registro previsto reabre depois de recarregar; dados inválidos recebem resposta recuperável. Valide exportação abrindo o arquivo gerado e comparando conteúdo.
- **Compatibilidade e qualidade visual.** Capture a mesma cena, câmera, luz e estado. Use diffs de imagem para localizar mudanças e revisão humana para decidir se são desejáveis. Registre os cenários pendentes, inclusive iOS e Android físicos.
- **Evidência atual.** O [JSON do smoke](Smoke%20do%20catálogo%20local.json) contém as 50 rotas e o resultado de cada uma. O ensaio usou Chrome 158 headless, 1280 × 800, launcher local com `--no-prebuild`. A lista permitida de GET externo cobriu jsDelivr, cdnjs, unpkg, Google Fonts e esm.sh. O resultado mede o carregamento nessa configuração e não garante execução em uma rede normal nem o loop completo. Em uma segunda passagem, Restauro exibiu o quebra-cabeça na interface DOM, sem canvas visível, e Conchas repetiu o erro de importação.
- **Testes funcionais realizados.** Rodei `node Sistema/test/sangi-workbenches-browser.mjs oficina-das-bolhas` e o mesmo comando para `oficina-de-mosaicos`. No Chrome headless com SwiftShader, cada jogo passou em 1440 × 900, 390 × 844 e 844 × 390, e ao abrir/voltar pelo launcher. Bolhas formou e estourou bolhas e verificou o modo gigante. Mosaicos verificou rejunte, desfazer/refazer, JSON e persistência após recarregar. A passagem dedicada pela Gota no Chrome desktop 1366 × 768 observou o contador `1 / 20`, objetiva `20× (200× total)` e evento de download `universo-de-uma-gota-01.png`. Não foi feita validação de conteúdo desse PNG.

## 11 — Material para implementação

Use o [prompt mestre da coleção](PROMPT_MESTRE_JOGOS_HTML.md) e a triagem junto com o workspace. As fichas e os prompts do pacote original continuam úteis como contexto de cada jogo. Confirme a mecânica na entrada local antes de implementar uma proposta de qualquer ficha.
