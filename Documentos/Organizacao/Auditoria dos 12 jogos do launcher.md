# Auditoria dos 12 jogos do launcher

Comparei os títulos identificados nas capturas, incluindo a Sopraria no endereço da página e os dois jogos que apareceram dentro dela. Observei a primeira cena, a leitura dos controles, a resposta de ações representativas e a adequação da simulação à proposta de cada experiência.

## Prioridades

1. **Laboratório de Ferrofluido — física e legibilidade.** É o caso mais fraco entre os simuladores científicos. A superfície soma uma função de campo a cristas definidas por cossenos. O próprio painel descreve a simulação como uma aproximação visual. Na prática, o prato muito escuro dificulta comparar a ação dos ímãs. A primeira melhoria seria permitir repetir o mesmo ensaio com outra altura, força ou polaridade e comparar o relevo com iluminação lateral e uma escala.
2. **Maestro Invisível — direção de arte e resposta visual.** Marcar o pulso, selecionar a seção e reouvir a sequência funcionaram no teste. O palco, porém, parece vazio e as bancadas são parecidas de longe. A movimentação visual vem de pequenas inclinações dos instrumentos ao tocar. Vale dar a cada seção uma silhueta própria e destacar no palco qual seção entrou e em que tempo.
3. **Oceano de Tinta — enquadramento e primeira interação.** O tanque parece uma placa escura e o efeito demora a comunicar que há algo para manipular. A simulação de pigmento é mais elaborada do que a apresentação sugere. Ela tem advecção em 2D, projeção aproximada de pressão e uma barreira que altera o fluxo. Um enquadramento voltado para o tanque e um primeiro ensaio guiado mostrariam essa diferença.
4. **Universo Audioreativo — variedade de ações.** A análise de graves, médios e agudos responde ao áudio, com quatro cenários, fontes integradas e faixa local. A maior parte do uso gira em torno de escolher cenário, fonte e sensibilidade. Quem procura interação contínua encontra mais no Corpo de Partículas ou no Maestro. Dentro do catálogo há também outra entrada chamada Universo Audioreativo, já sinalizada como variante.
5. **Câmara Antigravitacional — precisão do modelo.** O teste confirmou impulso, leitura de velocidade, criação de corpos e reinício. O cálculo de colisões usa raios e uma resposta baseada em massa e elasticidade. O cubo e o anel têm formas visuais diferentes, mas usam a mesma aproximação por raio. Isso importa se a intenção for ensinar como a forma muda uma colisão.

## Semelhanças

| Jogos | Semelhança e diferença prática |
| --- | --- |
| **Ateliê de Cerâmica e Sopraria das Transformações** | É o par mais parecido na mecânica. Ambos usam modelagem de um perfil de revolução para criar e expor uma peça. A Cerâmica tem torno, esmalte e queima. A Sopraria usa calor, pressão, sopro e resfriamento, além de exportar a malha em OBJ. |
| **Oceano de Tinta e Laboratório de Ferrofluido** | A bancada, o recipiente escuro e o painel de parâmetros criam uma leitura inicial semelhante. O Oceano acompanha pigmento transportado por um fluxo. O Ferrofluido recalcula a altura de uma superfície a partir dos ímãs. |
| **Cidade da Madrugada, Floresta Bioluminescente e Arquitetura do Impossível** | Compartilham exploração em primeira pessoa e interações por proximidade. A Cidade gira em torno de trânsito e setores urbanos. A Floresta incentiva descoberta e registro de espécies. A Arquitetura combina alinhamento de plataformas, gravidade local, portais e salas. |
| **Corpo de Partículas, Universo Audioreativo e Maestro Invisível** | Compartilham a apresentação sensorial. O Corpo responde ao gesto e aos atratores, o Universo reage às bandas do áudio e o Maestro transforma o pulso do jogador em um ensaio. |
| **Escultor de Planetas, Cerâmica e Sopraria** | Os três editam a forma de uma peça ou mundo na tela. O planeta se diferencia pela pintura esférica, pelo terreno procedural gerado por seed e pelo ajuste do nível do mar. |

## Leitura por jogo

| Jogo | O que já funciona | Principal ponto de revisão |
| --- | --- | --- |
| Cidade da Madrugada | Semáforo, travessia, porta, setores e interações no café e na cidade. | Melhorar a leitura do caminho e dos pontos interativos à noite. A física é voltada a navegação e bloqueios de passagem. |
| Floresta Bioluminescente | Percurso, descoberta de espécies e caderno que persiste ao reabrir. | Aumentar a variedade visual e tornar espécies e rotas mais identificáveis à distância. |
| Arquitetura do Impossível | Observação, giro, alinhamento e travessia testados. O código tem regras próprias para gravidade e portais. | Ensinar as etapas da ponte dentro da cena. Os testes executados se concentraram na travessia inicial. |
| Escultor de Planetas | Escultura, desfazer, refazer e persistência verificados. | Melhorar o acabamento facetado do relevo e o contraste entre biomas. É um editor procedural. |
| Ateliê de Cerâmica | Alteração do perfil, histórico, acabamento e gravação da peça. | Mostrar melhor onde o gesto aplica pressão. O torno e a queima usam regras de forma e acabamento. |
| Sopraria das Transformações | Fluxo de aquecer, soprar e resfriar verificado no player. | O código de sincronização recria a peça da vitrine ao concluir, mas só limpa a vitrine dentro da condição de peça concluída. Vale verificar se desfazer e reiniciar deixam uma peça antiga exposta. |
| Oceano de Tinta | Injeção, avanço passo a passo, barreira e limpeza do tanque. | Dar legibilidade ao pigmento contra o fundo e facilitar o primeiro gesto. |
| Laboratório de Ferrofluido | Altura e força alteram o relevo gerado. Há presets e inversão de polaridade. | Melhorar a iluminação de leitura e introduzir comparação reproduzível entre duas configurações. |
| Câmara Antigravitacional | Impulso, monitor de velocidade, criação de corpos e reinício. | Deixar claro o alcance das colisões por raio e oferecer uma comparação lado a lado das trajetórias. |
| Corpo de Partículas | Dispersão, rastros e entrada manual quando a câmera é negada. | Dar ao jogador um gesto inicial visível. A simulação usa força de atração, recomposição e amortecimento para produzir o efeito. |
| Maestro Invisível | Pulso ajustável, seções e reprodução da sequência. | Vincular o retorno sonoro ao palco com uma indicação mais clara do compasso e da seção ativa. |
| Universo Audioreativo | Faixas de teste, medidores, cenários e preset. | Aumentar o controle sobre como cada banda altera a cena e deixar a variante do catálogo mais fácil de distinguir. |

## Evidências e limites

Usei o código das cenas, as capturas enviadas e testes no Chromium com renderização por software. A suíte funcional da coleção passou nos 11 títulos selecionados. Os testes de layout cobriram os 12 jogos em 1366 × 768 e 390 × 844, com verificação do preenchimento do player, do acesso aos controles e do retorno ao catálogo. A avaliação de física compara o modelo implementado com a proposta de cada jogo. Ela cobre ações representativas e fórmulas do código. FPS em aparelhos reais, calibração científica e todos os caminhos de cada experiência ficaram fora dessa rodada.
