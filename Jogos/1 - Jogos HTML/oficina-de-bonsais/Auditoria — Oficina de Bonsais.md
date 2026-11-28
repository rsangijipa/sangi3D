# Auditoria da Oficina de Bonsais

## 00 · Resumo executivo

A Oficina de Bonsais é um ateliê contemplativo em 3D. O visitante escolhe entre três espécies, poda e arama a copa, troca o vaso e observa a passagem das estações. O projeto também oferece guia, diário, captura de foto e exportação. A prioridade é tornar confiáveis a importação, a recuperação da interface e a seleção de galhos. Depois, o maior ganho visual vem da silhueta de cada espécie e do acabamento dos materiais vistos de perto.

O objeto da auditoria é o HTML indicado pelo usuário. As orientações do guia, os atalhos, as mensagens e os comentários desse arquivo descrevem o aplicativo. O trecho “Selecione um galho diretamente na cena ou pela lista”, por exemplo, instrui quem usa a ferramenta de poda. A invocação do plugin sem pedido de edição foi tratada como uma auditoria com proposta de aprimoramento.

## 01 · Inventário

| Área | Implementação observada |
|---|---|
| Entrada | `Oficina de Bonsais — HTML 3D interativo.html`, 76.039 bytes. HTML, CSS e módulo JavaScript no mesmo arquivo. |
| Dependências | Three.js 0.160.0 e `OrbitControls` da mesma versão, via jsDelivr e import map nas linhas 464–471. |
| Dados | Grafo criado por `makeTree` e projetado em 3D por `graph`. Pinheiro negro, ácer japonês e junípero. Quatro vasos, quatro estações, até 190 segmentos e 40 estados de histórico. |
| Cena | `make3D` cria renderizador WebGL, câmera, iluminação, bancada, shoji, bambuzal, cascalho, lanterna, ferramentas, vaso e árvore. |
| Interface | `renderUI`, `setTool`, `guideSteps` e `openJournal`. Dock com oito ferramentas, guia de cinco etapas e seletor de galhos. |
| Dados locais | `bonsai.v1` em `localStorage`, JSON com `schemaVersion: 1`, diário TXT e foto PNG. Expostos em `window`: `bonsaiState` e `bonsaiDiagnostics`. |
| Launcher | O link de volta aponta para `/`. O projeto aparece em `api/apps.json` e `launcher/api/apps.json`. A miniatura local está na pasta, mas o HTML não a carrega. O catálogo referencia uma capa WebP própria. |

## 02 · Achados e prioridades

| Prioridade | Evidência e impacto | Correção proposta e aceite |
|---|---|---|
| P0 | `validate` (783–798) deixa passar campos livres. A idade, o contador de podas e identificadores chegam a renderizações com `innerHTML` (994–1039, 1083–1086). A aceitação de um ramo com pai inexistente foi reproduzida em Node. `graph` passa a posicioná-lo como raiz. | Validar tipos e limites, identificadores inteiros únicos, uma raiz, relação de parentesco ordenada e contadores. Construir a UI de dados importados com APIs de texto. Importação inválida deve preservar árvore e histórico. Projetos válidos exportados pela versão 1 devem abrir. Esforço médio. |
| P1 | `toggleUI` (1288–1296) oculta o cabeçalho que contém o próprio botão de reabertura. O atalho H oferece recuperação com teclado. | Exibir um controle persistente fora do cabeçalho recolhido. Retornar o foco ao restaurar. Aceite com toque e teclado a partir do modo recolhido. Esforço baixo. |
| P1 | As importações estáticas (548–550) antecedem o tratamento de erro de `make3D` (2090–2098). Ao perder o contexto WebGL, o código cancela o loop e não registra retomada (2068–2073). | Mostrar feedback de carregamento já no HTML e tratar falhas de dependência e contexto. Recuperar a cena a partir do estado ou oferecer reinicialização explícita. Aceite com rede bloqueada e perda de contexto. Esforço médio. |
| P1 | `hit`, `pointerdown` e `mode` (1928–1965) usam a geometria fina dos galhos como alvo e suspendem a órbita em Poda e Aramação. A lista dá um caminho alternativo. | Ampliar a área de seleção e distinguir toque, órbita, pinça e arraste de aramação. Aceite com galhos próximos, gesto cancelado e câmera em uso. Esforço médio. |
| P1 | `triggerBranchFall` e `updateFallingBranches` (1848–1898) animam só a malha selecionada. Seus vértices já estão no espaço da árvore, enquanto a colisão usa a posição da malha, que começa em zero. Deslocamento e rotação são aplicados por quadro. | Recentrar o ramo no ponto de corte, agrupar os descendentes visíveis e testar o contato em coordenadas do mundo. Usar segundos para gravidade, velocidade e rotação. Aceite com trajetórias equivalentes a 30, 60 e 120 Hz. Esforço médio. |
| P1 | `sync` (1753–1844) reconstrói árvore e vaso até em mudanças de seleção. `clearGroup` libera geometria, mas o material local do musgo é recriado sem descarte explícito. No inverno do ácer, `leafInstancedMesh` pode referenciar a malha removida e o loop continua atualizando suas matrizes. | Atualizar realce sem reconstruir a cena, compartilhar o material do musgo e zerar a referência da copa ao removê-la. Aceite com ciclos de seleção, troca de vaso e inverno sem crescimento contínuo na contagem de recursos. Esforço médio. |
| P1 | `renderUI` troca todo o conteúdo do dock e painel (1017–1125), incluindo o controle com foco. O Diário usa uma `div` sem semântica modal nem gestão de foco (527–544, 994–1008). | Atualizar controles em lugar ou restaurar foco por ação. Abrir o Diário como diálogo rotulado, conter o foco e devolvê-lo ao fechar. Aceite por teclado e leitor de tela. Esforço médio. |
| P2 | O texto anuncia captura HD, porém `triggerPhotoMode` copia o tamanho atual do canvas (1978–1992). A restauração da interface fica no caminho de sucesso (2015–2018). | Identificar as dimensões reais da foto ou oferecer uma resolução dedicada. Restaurar a interface em qualquer saída. Aceite com qualidade Leve, captura repetida e falha de exportação. Esforço baixo a médio. |
| P2 | `makeTree(type, true)` cria quatro segmentos, mas registra seis anos, assim como a árvore de demonstração com 84 segmentos (615–654). O botão apresenta esse estado como “muda jovem”. | Definir uma idade inicial própria para a muda ou ajustar o rótulo para descrever o modelo reduzido. Aceite no cartão, diário e JSON. Esforço baixo. |

## 03 · Avaliação

A nota parcial de engenharia é **5,7/10**, com cobertura de **13 dos 29 pontos de peso aplicáveis**. A escala mede prontidão para os fluxos do aplicativo. Estabilidade, interação, mobile, acessibilidade e performance têm peso 2. Funcionalidades é avaliada junto de interação. As categorias restantes têm peso 1. N/V indica verificação pendente.

| Categoria | Nota | Confiança, evidência e meta |
|---|---:|---|
| Modelagem | 6 | Média. Há vasos, árvores e adereços próprios. Meta 8 com ramos cônicos e silhuetas distintas. |
| Geometria | 6 | Média. Tubos, vasos torneados e instâncias são observáveis no código. Meta 8 com pivôs corretos e seleção independente da malha. |
| Materiais e texturas | 6 cada | Média. Há mapas de cor procedurais e parâmetros físicos. Meta 8 com escalas UV independentes e relevo sutil onde fizer diferença. |
| Interação e funcionalidades | 7 | Média. Poda, aramação, estações e trocas têm ações próprias. Meta 9 com fluxos validados por toque e teclado. |
| Física | 3 | Alta para a implementação. Colisão do corte usa a origem da malha e integração mista por quadro. Meta 7 com trajetória consistente e contato na bancada. |
| Gameplay | 7 | Média. O ciclo livre de cultivo e o guia atendem ao propósito. Meta 8 com feedback de ação em cada etapa. |
| Arquitetura | 6 | Alta. Há separação entre modelo, UI e adaptador 3D, com invalidação ampla. Meta 8 com atualizações localizadas e descarte explícito. |
| Estabilidade | 5 | Alta para a validação observada, média para o aplicativo completo. Meta 8 com importação estrita e recuperação de falhas. |
| Acessibilidade | 5 | Alta para a inspeção do código. Há rótulos, foco visível, avisos e seletor de galhos. Meta 8 com foco preservado, modal semântico e redução de movimento no 3D. |
| Realismo visual, iluminação, sombras, composição, ambientes, animações, VFX, áudio, UI, UX, controles em uso, mobile, performance e completude | N/V | Requerem observação da cena ou dos fluxos em execução. |

## 04 · Direção de arte

Compor a bancada como centro da cena, com a tesoura à esquerda e o carretel à direita. Usar o shoji como fundo, os bambus nas laterais e a lanterna recuada à direita. No enquadramento próximo, preservar espaço entre copa e fundo para a leitura dos galhos. Dar a cada espécie uma silhueta legível por forma e densidade, mesmo sem cor. Manter a paleta de madeira, cerâmica e verde do pátio, com o âmbar da seleção reservado à ação.

## 05 · Assets e geometria

| Recurso | Origem atual e trabalho proposto | Fallback |
|---|---|---|
| Árvore, raízes e arames | Procedurais a partir do grafo. Preservar IDs. Ajustar afunilamento e separar as malhas visuais das áreas de seleção. | Tubos, cone e esfera já disponíveis no HTML. |
| Folhagem | Cone instanciado no pinheiro, esfera achatada nas demais espécies. Usar agulhas agrupadas, folha lobada simples para ácer e pequenos ramos escamados para junípero. | Instâncias de silhueta simplificada em Leve. |
| Vaso, substrato e musgo | Lathe e caixas para o vaso, base lisa para substrato e musgo instanciado. Acrescentar bordas arredondadas e grãos discretos visíveis no close. | Formas e texturas procedurais existentes. |
| Bancada, shoji, bambu e lanterna | Formas primitivas procedurais. Agrupar peças repetidas e orientar os veios conforme cada tábua. | Geometrias e mapas existentes. |
| Tesoura e carretel | Malhas próprias sobre a bancada. Usar a tesoura como referência visual do gesto de corte. | Adereços atuais e acionamento pelo painel. |
| Selo, ícones e som | Selo em texto, ícones SVG inline e síntese Web Audio. | Rótulos em texto e feedback visual suficiente para jogar sem som. |

O plano pode usar apenas recursos gerados no projeto. Se a implementação vier a incorporar bibliotecas localmente ou acrescentar assets externos, registrar origem e licença no pacote.

## 06 · Renderização e materiais

O HTML usa ACES, saída sRGB, sol direcional, preenchimento hemisférico e direcional, neblina e uma sombra de contato radial abaixo do vaso. A qualidade altera DPR e sombras. `stone`, `gravelMat` e `plasterMat` compartilham `stoneTex`, portanto o ajuste de repetição do cascalho também chega à pedra e ao reboco. O comentário “Normal Maps” descreve uma intenção: os materiais referenciam mapas de cor. Separar as escalas UV, alinhar o veio da casca ao ramo e dar à cerâmica celadon reflexo suave por meio de um ambiente leve, se a comparação visual justificar. Conferir detalhes na pedra, no vaso e na casca em Geral e Close.

## 07 · Física e interações

Poda remove a subárvore do grafo. Aramação modifica `bend`, marca `wire` e transmite parte da orientação aos descendentes. Preservar essas operações autorais. Para a queda visual, adotar unidades de cena em metros, bancada em Y ≈ 1,055 m e gravidade inicial de 9,8 m/s². Usar colisão com o tampo limitada ao retângulo da bancada, raio do ramo como tolerância e restituição inicial de 0,25. Testar a aparência antes de finalizar os parâmetros. Um passo fixo de 1/60 s com acumulador é suficiente para esse efeito. Remover o fragmento temporário ao desfazer o corte. A aramação pode continuar cinemática, com indicação clara de que altera a forma.

## 08 · Atividades e expansão

Usar o guia atual para ensinar uma ação verificável em cada etapa. Escolher espécie ou muda, selecionar e cortar um ramo, mudar a curvatura e retirar o arame, comparar dois vasos e avançar até observar a mudança sazonal. O visitante pode desfazer ações ou continuar em modo livre. O Diário pode consolidar a sessão com os dados já disponíveis. Uma comparação de silhueta antes/depois é expansão opcional depois da estabilização do fluxo principal.

## 09 · UI, UX e mobile

Manter o seletor de galhos acessível por teclado. Em retrato, transformar ferramentas superiores secundárias em menu e testar o painel inferior sem cobrir o ponto de seleção. Respeitar as áreas seguras e usar 44 px como meta para as ações principais. Em paisagem curta, limitar altura do painel e permitir rolagem no Diário. No canvas, permitir órbita com gesto distinto da ação sobre um galho. Manter sempre visível o caminho de retorno dos controles recolhidos. Aplicar a preferência por movimento reduzido às folhas, à poeira e à queda, além do CSS.

## 10 · Áudio, animação e efeitos

`ZenAudioEngine` inicia com som desligado e sintetiza tesoura, arame, sino e toque. O loop anima vento e poeira. Para o próximo ciclo, conservar o retorno sonoro das ações, verificar ativação por gesto e mute em navegador, e controlar velocidade da poeira por tempo. Sincronizar o estalo ao corte e usar dissolução curta só após o contato, com alternativa de transição simples para movimento reduzido.

## 11 · Arquitetura e performance

Usar `commit` para ações que modificam o estado e sincronizar apenas o que mudou. Desacoplar vaso, geometria de copa, seleção e iluminação sazonal. Controlar o descarte de geometrias, materiais, texturas e instâncias pelo seu proprietário. Medir primeiro uma árvore inicial e uma próxima do limite de 190 segmentos, comparando tempos de quadro, draw calls e recursos antes/depois de ciclos de poda, troca de vaso e estações. Como meta inicial para os testes, medir p95 até 33,3 ms por quadro em Leve no aparelho móvel de referência e 16,7 ms em Equilibrado na máquina de referência. Registrar hardware, navegador, resolução e duração de 30 segundos. A edição atual é um HTML único conectado à CDN. Um pacote offline só deve ser declarado depois de um teste sem rede.

## 12 · Roadmap e QA

1. **P0 — Dados.** Validar importação e restauração, e montar o DOM com texto. Cobrir JSON exportado pela versão 1, pai inexistente, raiz extra, valores fora da faixa e cancelamento. Confirmar que falha ou cancelamento mantém estado e histórico.
2. **P1 — Fluxos.** Corrigir recuperação da interface, foco, entrada por toque, queda e gestão de recursos. Testar pinça, seleção pelo canvas e pela lista, poda, Desfazer/Refazer, aramar, remover arame, quatro estações, inverno do ácer, os quatro vasos, salvar/reabrir, guia, diário e foto.
3. **P2 — Apresentação.** Comparar Geral e Close em 1440 × 900, 390 × 844 e 844 × 390. Testar redução de movimento, mudo, captura PNG, exportação TXT/JSON e retorno ao launcher na origem em que ele é servido.
4. **P3/P4 — Expansão e otimização.** Avaliar comparação de silhueta e otimizações adicionais após medir o custo da versão funcional. Fazer o teste sem rede se houver entrega offline.

**Verificado nesta auditoria.** A compilação sintática do módulo com `node --input-type=module --check` passou. Em Node.js 26.5.0, foram executadas funções extraídas do HTML para verificar 84 segmentos iniciais, quatro segmentos e idade seis no modo muda, ida e volta por JSON, coordenadas finitas da árvore inicial, aceitação indevida de um pai inexistente e o diagnóstico interno. O diagnóstico passou para as três espécies nas verificações de dados existentes. A mensagem “física e JSON 100% íntegros” vai além da cobertura desse teste. WebGL, renderização, navegador, toque, áudio, FPS e retorno ao launcher ficaram pendentes de teste em execução.

## 13 · Prompt mestre de implementação

> Trabalhe em uma cópia de `Oficina de Bonsais — HTML 3D interativo.html`. O projeto é um pátio contemplativo de cultivo criativo para navegador, em HTML, CSS, JavaScript, Three.js 0.160.0, OrbitControls e Web Audio. Preserve o ciclo livre de escolher espécie, podar, aramar, trocar vaso e avançar estações. Preserve o guia opcional, o diário, a foto, a exportação JSON v1 e TXT, a chave `bonsai.v1` e a rota de retorno usada pelo launcher.
>
> Primeiro, endureça `validate` e `loadTree` para que os dados sejam validados antes de afetar a árvore e o histórico. Valide raízes, pais, IDs, geometrias e contadores. Insira valores importados por APIs de texto em `openJournal` e `renderUI`. Mantenha projetos v1 válidos legíveis. Cubra falhas de inicialização da dependência e perda de WebGL. Corrija o texto do diagnóstico para descrever as regras exercitadas.
>
> Depois, torne seleção, órbita e aramação utilizáveis por teclado, mouse e toque. Em `toggleUI`, deixe um controle de recuperação visível. Conserve foco após atualizações do dock e painel, e faça o Diário devolver o foco ao fechar. Use as áreas seguras em retrato e limite a altura dos painéis em paisagem curta. Separe realce, vaso, copa e luz sazonal em `sync`. Anime o fragmento podado em `triggerBranchFall` a partir do ponto de corte, com passo fixo, unidades por segundo e contato na bancada. Faça os efeitos respeitarem movimento reduzido. Preserve o áudio procedural desligado inicialmente.
>
> Refine a composição mantendo bancada central, tesoura à esquerda, carretel à direita, shoji ao fundo, bambus nas laterais e lanterna recuada. Use geometria procedural para agulhas do pinheiro, folhas lobadas do ácer e ramos escamados do junípero. Reforce o contato com o substrato, separe escalas UV de pedra e cascalho e melhore bordas e acabamento dos vasos. Mantenha a iluminação suave e verifique em Geral e Close. Faça a captura PNG informar ou respeitar uma dimensão definida e sempre restaurar a interface.
>
> Teste importação de projeto v1 e rejeição de grafo inválido sem mudar o estado. Compare a queda a 30, 60 e 120 Hz. Exercite teclado, mouse e toque em 1440 × 900, 390 × 844 e 844 × 390. Cubra as três espécies, os quatro vasos, o inverno do ácer, desfazer/refazer, foto, exportações, persistência, mudo, perda de WebGL e retorno ao launcher. Meça 30 segundos nos perfis Leve e Equilibrado com a árvore inicial e outra próxima do limite de 190 segmentos. Registre p95 de tempo de quadro, draw calls e contagem de recursos. Entregue o HTML completo, instruções de abertura, dependências e licenças aplicáveis e o registro de testes com navegador, dispositivo e métricas quando disponíveis.
