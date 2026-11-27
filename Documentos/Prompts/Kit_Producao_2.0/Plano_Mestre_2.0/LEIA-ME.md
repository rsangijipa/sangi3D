# Plano Mestre de Produção 2.0
**Portfólio de experiências web 3D • 24/11/2026 • versão de planejamento**

## Sumário executivo
O acervo reúne 18 HTMLs existentes, 20 propostas terapêuticas e 20 comerciais (58 entradas). O kit de 17 jogos está contido nas 20 propostas, não é uma quarta coleção. O catálogo recomendado tem 54 projetos: 18 migrações (quatro recebem modos integrados), 14 novos terapêuticos ativos, 20 novos comerciais e duas pendências. 52 têm prompt de execução; dois têm dossiê de decisão. A consolidação é uma proposta de arquitetura, não uma remoção física de arquivos. Nenhum aplicativo foi executado, alterado, publicado ou certificado nesta etapa.

## 1. Decisões de consolidação
| Origem | Destino | Decisão |
|---|---|---|
| T09 Bússola do Corpo | E04 Cartografia do Corpo Sentido | Modo observatório; preservar mapa existente |
| T13 Cidade das Conversas | E18 Vila dos Encontros | Modo bairro; manter contextos antigos sem escore |
| T17 Teatro das Histórias Possíveis | E16 Teatro das Possibilidades | Modo fantoches de papel e timeline |
| T18 Arquitetura dos Vínculos | E06 Cidade das Conexões | Modo arquipélago construtor |
| T11 Jardim dos Pensamentos | Pendente | Planilha marca duplicado; Rádio dos Pensamentos é proposta, não decisão |
| T19 Oficina do Ritmo Compartilhado | Pendente | Planilha marca implementado; recuperar oficina-do-ritmo.html antes de refazer |

Manter separados: Estação das Escolhas × Estação das Trocas (decisão simbólica × regras); Museu das Perspectivas × Museu dos Pontos de Vista (óptica × informação social); Planetário × Casa das Memórias; Santuário × Ilha das Pausas. Compartilhar motor, não identidade. O status da planilha não prova execução real. A referência Windows do motor realista e os mockups originais de cada jogo não acompanham estes arquivos; não declarar fidelidade pixel a pixel. A Ilha das Pausas adota como decisão 2.0 o mapa da planilha (farol, chalé, gramado, deck, jardim), mantendo a alternativa anterior apenas como referência histórica.

## 2. Arquitetura e interfaces
```text
apps/launcher/
apps/experiencias/{E,T,C}-slug/
packages/core/{render,quality,lifecycle,input,camera,assets}/
packages/systems/{physics,kinematics,audio,construction,narrative,timeline,storage}/
packages/ui/{immersive,accessible,embed}/
packages/testing/{fixtures,visual,performance}/
assets/library/{architecture,nature,mechanical,instruments,characters,materials,fx}/
```
Cada app tem módulo próprio, estado e identidade; carregar somente o app selecionado. Interface de referência: `mount(container, config) -> {pause,resume,resize,dispose,exportState}`; ações do app passam por dispatch; estado serializável com schemaVersion. Biblioteca com manifestos, licenças, dependências, pivôs, LOD e fallback. O host não lê estado clínico por padrão; mensagens inter-frame versionadas e allowlist de origem. Não impor Supabase ou login aos apps isolados.

## 3. Dependências e sequência de produção
| Onda | Escopo | Gate de saída |
|---|---|---|
| 0 | Recuperar motor de referência, HTML da Oficina do Ritmo, mockups, repositório e backups; congelar inventário, definir IDs, baseline e contratos | Código acessível; lacunas documentadas; build inicial e capturas reais |
| 1 | E15 Santuário (render), E01 Gesto Lento (deformação), T07 Torre (física), C08 Vinil (áudio/mecânica), E18 Vila (narrativa), E07 Correio (dados) | Cada vertical slice passa gesto central, mobile, build e testes; congela APIs apenas após evidências |
| 2 | E02, E03, E04, E05, E06, E08–E14, E16, E17; evoluir demais HTMLs e modos integrados | Regressão das funções antigas, privacidade, captura antes/depois e integração |
| 3 | T01, T02, T03, T04, T06, T10, T12 (sensorial, luz, tempo e câmera) | Sistemas compartilhados testados; acessibilidade e conforto |
| 4 | T05, T08, T14, T15, T16, T20 (regras, planejamento, personagem e construção) | Fluxos completos, simulação determinística onde aplicável, exportações voluntárias |
| 5 | C01–C07, C09–C20 (comerciais além do piloto) | Dois presets, embed/CTA, catálogo, acessibilidade, build independente |
| 6 | Launcher final, matriz de dispositivos, offline, auditoria de dados e release | Somente itens aprovados entram como disponíveis; falhas ficam em beta ou bloqueadas |

As ondas indicam dependências, não prazo prometido. Rodar em paralelo apenas após APIs comuns estáveis. A Oficina do Ritmo retorna à fila quando o fonte for recuperado; Jardim somente após decisão de identidade.

## 4. Backlog transversal
| ID | Entrega | Dependências | Evidência |
|---|---|---|---|
| SYS-01 | Engine, qualidade adaptativa e ciclo de vida | baseline | teste E15, captura e métricas |
| SYS-02 | Materiais, asset loader e manifestos | SYS-01 | validação GLB, close-ups e licenças |
| SYS-03 | Picking, câmera, gestos e acessibilidade | SYS-01 | mouse/toque/teclado e fallback DOM |
| SYS-04 | Deformação local e histórico | SYS-02/03 | E01, custo por gesto e undo |
| SYS-05 | Física rígida e cinemática | SYS-01/03 | T07, CCD, colisões e replay |
| SYS-06 | Mixer, síntese, player e mute | ciclo de vida | C08, teste de áudio suspenso |
| SYS-07 | Narrativa e NPCs | SYS-03 | E18, ramificações e saída livre |
| SYS-08 | Persistência opt-in, export e exclusão | schema de estado | E07, reload, exclusão e privacidade |
| SYS-09 | Construção, encaixes e inventário | SYS-03/05 | E06, montagem/undo |
| SYS-10 | Timeline e replay | SYS-03/06/07 | E16, gravação apenas da cena |
| SYS-11 | Embed e marcas | SYS-01/03 | C08, presets e origem de mensagens |
| SYS-12 | Launcher, build, cache e QA | sistemas anteriores | manifestos, rota, atualização offline e regressão |

## 5. Biblioteca de assets
| Família | Conteúdo compartilhável | Projetos de validação |
|---|---|---|
| Arquitetura/móveis | paredes, portas, janelas, estantes, mesas, pontes, trilhos | E05, E06, T05 |
| Natureza/FX | árvores, rochas, água, céu, vento, chuva, fumaça | E15, T10, C03 |
| Mecânica | engrenagens, eixos, polias, dobradiças, parafusos, molas | T07, E13, C11/C13 |
| Áudio | instrumentos, vitrola, sinos, tigelas, loops originais | C08, E11, T02 |
| Personagens | rigs, mãos estilizadas, fantoches, poses | E18, E16, C14 |
| Materiais | madeira, latão, papel, tecido, vidro, areia, argila | E01, E07, T04 |
| Interface | ícones, bottom sheet, foco, dock e launcher | todos; temas exclusivos |

Priorize hero assets e peças interativas; decoração depois. Cada asset recebe manifesto e licença; orçamento por cena aferido. Geração de imagem é referência/textura, não substitui malha 3D funcional.

## 6. Catálogo canônico e planos individuais
Os itens abaixo têm instrução específica, gesto, assets, mecânica e teste de aceite; os prompts no pacote aprofundam com especificações originais, decisões 2.0 e contrato completo. As duas pendências não devem receber implementação até desbloqueio.

### Ambientes existentes

| ID e experiência | Estado / verbo | Evolução principal |
|---|---|---|
| E01 [Ateliê do Gesto Lento](01_Prompts_Existentes/E01-atelie-do-gesto-lento.md) | Existente — piloto / moldar | Malha radial com conservação aproximada de volume, pincel localizado, umidade e espessura, rotação independente; esmaltação e queima simuladas; preservar exportação OBJ/PNG. |
| E02 [Ateliê dos Remendos e Transformações](01_Prompts_Existentes/E02-atelie-dos-remendos-e-transformacoes.md) | Existente — migração / remendar | Representar tecido em grade deformável leve e cortes por polígono; costura une bordas válidas; camadas e padrões de bordado; histórico de ações. |
| E03 [Biblioteca das Histórias Inacabadas](01_Prompts_Existentes/E03-biblioteca-das-historias-inacabadas.md) | Existente — migração / continuar | Grafo de histórias com escolhas e final livre, livros folheáveis, editor de cenas e leitura opcional; nenhuma interpretação de finais. |
| E04 [Cartografia do Corpo Sentido](01_Prompts_Existentes/E04-cartografia-do-corpo-sentido.md) | Existente — migração / localizar e nomear | Integrar Bússola do Corpo como modo observatório; regiões selecionáveis, intensidade autodeclarada, camadas, comparação opcional sem inferência. |
| E05 [Casa da Árvore das Emoções](01_Prompts_Existentes/E05-casa-da-arvore-das-emocoes.md) | Existente — migração / habitar | Carregar cômodos por zona, câmera guiada com colisão, portas animadas, decoração por snap, clima e quarto personalizável; preservar recursos atuais. |
| E06 [Cidade das Conexões](01_Prompts_Existentes/E06-cidade-das-conexoes.md) | Existente — migração / conectar | Integrar Arquitetura dos Vínculos como modo construtor; grafo navegável, encaixe e remoção de pontes, circulação sem cruzar água; implementar gravação real. |
| E07 [Correio das Palavras Não Ditas](01_Prompts_Existentes/E07-correio-das-palavras-nao-ditas.md) | Existente — piloto / escrever e guardar | Dobra de papel por animação articulada, envelopes e acervo; auditar armazenamento, criptografia, recuperação e exportação; sem envio externo automático. |
| E08 [Estação das Escolhas](01_Prompts_Existentes/E08-estacao-das-escolhas.md) | Existente — migração / escolher caminho | Mapa ferroviário ramificado, bagagem editável, movimento por spline, destinos narrativos; manter propósito simbólico distinto de Estação das Trocas. |
| E09 [Estúdio das Sombras e da Luz](01_Prompts_Existentes/E09-estudio-das-sombras-e-da-luz.md) | Existente — migração / projetar | Sombras dependentes da geometria real e posição, juntas com limites, fontes graduais, timeline de projeções; modo sem movimento. |
| E10 [Laboratório das Leis Imaginárias](01_Prompts_Existentes/E10-laboratorio-das-leis-imaginarias.md) | Existente — migração / experimentar forças | Corpos rígidos e forças parametrizadas, massas e atrito, limites de velocidade, combinação de campos, seed e replay; distinguir fantasia de física real. |
| E11 [Laboratório dos Sons e Silêncios](01_Prompts_Existentes/E11-laboratorio-dos-sons-e-silencios.md) | Existente — migração / escutar e silenciar | Ressonância por material, síntese/loops locais, espacialização opcional, mixer e ondas, retirar afirmações terapêuticas não demonstradas sobre 432 Hz. |
| E12 [Museu das Perspectivas](01_Prompts_Existentes/E12-museu-das-perspectivas.md) | Existente — migração / reenquadrar | Instalações ópticas coerentes com câmera, reflexos simplificados por qualidade, alinhamento com tolerância e manipulação de esculturas. |
| E13 [Oficina dos Robôs Imperfeitos](01_Prompts_Existentes/E13-oficina-dos-robos-imperfeitos.md) | Existente — migração / montar e reparar | Inventário e compatibilidade de peças, pivôs, encaixe por sockets, transmissão cinemática, corda e lubrificação simuladas; sem rotular imperfeição. |
| E14 [Planetário das Memórias](01_Prompts_Existentes/E14-planetario-das-memorias.md) | Existente — migração / constelar | Criação de estrelas, ligação em constelações, navegação e linha do tempo opcional; textos e memórias em sessão por padrão. |
| E15 [Santuário Zen 3D](01_Prompts_Existentes/E15-santuario-zen-3d.md) | Existente — piloto / contemplar | Validar motor realista, fumaça contínua e luz motivada, chuva e vento opcionais, objetos responsivos, som com fade e presets. |
| E16 [Teatro das Possibilidades](01_Prompts_Existentes/E16-teatro-das-possibilidades.md) | Existente — migração / encenar | Integrar Teatro das Histórias Possíveis como modo de fantoches de vara; timeline de poses, luz e cenas; replay determinístico, texto opcional. |
| E17 [Termômetro da Ansiedade](01_Prompts_Existentes/E17-termometro-da-ansiedade.md) | Existente — migração / graduar | Intensidade subjetiva, estratégias escolhidas, comparação voluntária, sem limiares diagnósticos; adaptar interface universal. |
| E18 [Vila dos Encontros](01_Prompts_Existentes/E18-vila-dos-encontros.md) | Existente — piloto / conversar | Integrar Cidade das Conversas como modo bairro; grafo de diálogos, respostas livres e opção de sair, múltiplas consequências plausíveis; retirar escore de assertividade. |

### Terapêuticos

| ID e experiência | Estado / verbo | Evolução principal |
|---|---|---|
| T01 [Cartografia dos Sons](02_Prompts_Terapeuticos/T01-cartografia-dos-sons.md) | Novo terapêutico / escutar e posicionar | Grafo de ruas e marcador de escuta; PannerNode e fallback estéreo; comparação A/B com ganho limitado. |
| T02 [Laboratório de Camadas Sonoras](02_Prompts_Terapeuticos/T02-laboratorio-de-camadas-sonoras.md) | Novo terapêutico / mixar e isolar | Mixer por canal, solo/mute, FFT, escolha de foco; zero inicial e replay das configurações. |
| T03 [Observatório da Luz](02_Prompts_Terapeuticos/T03-observatorio-da-luz.md) | Novo terapêutico / ajustar | Exposição gradual, luz de cor/temperatura, vidro barato, comparação de presets sem flashes. |
| T04 [Atlas das Texturas](02_Prompts_Terapeuticos/T04-atlas-das-texturas.md) | Novo terapêutico / explorar materiais | Cinco gestos com reações distintas e micro-relevo; coleção subjetiva; não simular sensação tátil como medida. |
| T05 [Estação das Trocas](02_Prompts_Terapeuticos/T05-estacao-das-trocas.md) | Novo terapêutico / embarcar por regra | FSM de regras anunciadas, arraste com snap, retorno suave e trilhos por spline. |
| T06 [Oficina do Tempo](02_Prompts_Terapeuticos/T06-oficina-do-tempo.md) | Novo terapêutico / estimar e comparar | Relógio monotônico, previsão editável e comparação descritiva; tarefa real fora do jogo; pausa configurável. |
| T07 [Torre do Impulso](02_Prompts_Terapeuticos/T07-torre-do-impulso.md) | Novo terapêutico — piloto / aguardar o sinal | Rapier fixed step, CCD para esferas, sinal textual e por forma, troca de regra anunciada, replay por seed. |
| T08 [Porto das Decisões](02_Prompts_Terapeuticos/T08-porto-das-decisoes.md) | Novo terapêutico / planejar carga e rota | Capacidade por peso/volume simbólico, snap, grafo de rotas, água leve, planos A/B. |
| T10 [Meteorologia das Emoções](02_Prompts_Terapeuticos/T10-meteorologia-das-emocoes.md) | Novo terapêutico / compor clima | Interpolar sol, nuvens, vento e chuva independentemente; boletim sem classificação. |
| T11 [Jardim dos Pensamentos](04_Pendencias/T11-jardim-dos-pensamentos.md) | Pendente / plantar pensamento | Manter em espera; comparar com Tribunal dos Pensamentos/Pensar Sentir e Agir; Rádio dos Pensamentos é alternativa não aprovada. |
| T12 [Ilha das Pausas](02_Prompts_Terapeuticos/T12-ilha-das-pausas.md) | Novo terapêutico / escolher pausa | Adotar mapa da planilha: farol respirar, chalé descansar, gramado alongar, deck desenhar, jardim escolher; câmera por spline e saída livre. |
| T14 [Museu dos Pontos de Vista](02_Prompts_Terapeuticos/T14-museu-dos-pontos-de-vista.md) | Novo terapêutico / ver pelos olhos do outro | Câmera por personagem, cone de visão, raycast de oclusão e cartões de informação. |
| T15 [Estúdio dos Limites](02_Prompts_Terapeuticos/T15-estudio-dos-limites.md) | Novo terapêutico / ensaiar situação | Roteiros editáveis, escolha de tom/distância, saída sempre disponível; respostas sem nota. |
| T16 [Ensaio do Cotidiano](02_Prompts_Terapeuticos/T16-ensaio-do-cotidiano.md) | Novo terapêutico / preparar e percorrer | Navmesh, lista editável, NPCs e fila; imprevistos opcionais e dial sensorial. |
| T19 [Oficina do Ritmo Compartilhado](04_Pendencias/T19-oficina-do-ritmo-compartilhado.md) | Pendente / alternar turnos | Recuperar oficina-do-ritmo.html; validar sequência até quatro sons, imitação/variação e modo cuidador. |
| T20 [Casa das Memórias](02_Prompts_Terapeuticos/T20-casa-das-memorias.md) | Novo terapêutico / organizar lembranças | Snap em prateleiras, gavetas, fotos locais opcionais, linha do tempo sem datas; privacidade forte. |

### Comerciais

| ID e experiência | Estado / verbo | Evolução principal |
|---|---|---|
| C01 [Sala de Espera Sonora](03_Prompts_Comerciais/C01-sala-de-espera-sonora.md) | Novo comercial / combinar sons | Mixer espacial com cinco canais; gesto vertical com alternativa; respiração opcional sem retenção e saída imediata. |
| C02 [Mesa dos Objetos que Acalmam](03_Prompts_Comerciais/C02-mesa-dos-objetos-que-acalmam.md) | Novo comercial / manipular | Pêndulo com amortecimento e traço persistente, colisões e líquido aproximado; módulos independentes. |
| C03 [Rochas em Equilíbrio](03_Prompts_Comerciais/C03-rochas-em-equilibrio.md) | Novo comercial / empilhar | Corpos convexos, atrito, massa, centro de massa e CCD; água visual, quedas naturais. |
| C04 [Máquina de Escrever das Intenções](03_Prompts_Comerciais/C04-maquina-de-escrever-das-intencoes.md) | Novo comercial / datilografar | Teclas articuladas, avanço de carro e papel, campainha opcional, edição acessível; texto local. |
| C05 [Clepsidra do Foco](03_Prompts_Comerciais/C05-clepsidra-do-foco.md) | Novo comercial / organizar foco | Relógio monotônico independente de FPS, fluido visual sincronizado e pausas sem cobrança. |
| C06 [Caixa de Música Perfurada](03_Prompts_Comerciais/C06-caixa-de-musica-perfurada.md) | Novo comercial / perfurar e tocar | Sequenciador por grade, notas originais e fita animada; sincronizar cursor e áudio. |
| C07 [Copos Musicais](03_Prompts_Comerciais/C07-copos-musicais.md) | Novo comercial / afinar | Nível de água altera frequência em modelo calibrado para gesto de toque; ressonância e indicação visual. |
| C08 [Toca-Discos de Vinil](03_Prompts_Comerciais/C08-toca-discos-de-vinil.md) | Novo comercial — piloto / tocar discos | FSM energia/prato/braço, inércia, 33/45 rpm e pitch; AudioBuffer original, scratch limitado e sincronização angular. |
| C09 [Varanda dos Sinos de Vento](03_Prompts_Comerciais/C09-varanda-dos-sinos-de-vento.md) | Novo comercial / produzir vento | Pêndulos com amortecimento e rajadas; colisões com cooldown e polifonia limitada. |
| C10 [Máquina de Reação em Cadeia](03_Prompts_Comerciais/C10-maquina-de-reacao-em-cadeia.md) | Novo comercial / encadear | Editor com sockets e snap, Rapier, teste passo a passo, replay por seed e reset. |
| C11 [Relógio Aberto](03_Prompts_Comerciais/C11-relogio-aberto.md) | Novo comercial / explorar mecanismo | Transmissão cinemática por relações de dentes, vista explodida e corte, velocidade ajustável. |
| C12 [Pinball de Madeira](03_Prompts_Comerciais/C12-pinball-de-madeira.md) | Novo comercial / rebater | Rapier fixed step, CCD, flippers motorizados, reset de bola, placar opcional apenas comercial. |
| C13 [Trem de Engrenagens](03_Prompts_Comerciais/C13-trem-de-engrenagens.md) | Novo comercial / transmitir movimento | Grafo de encaixes, razão e sentido de rotação por dentes, detectar travamento e explicar. |
| C14 [Bancada da Manicure](03_Prompts_Comerciais/C14-bancada-da-manicure.md) | Novo comercial / compor unhas | Formatos/cores/camadas com máscaras, undo, catálogo e preview; UV apenas simulado. |
| C15 [Barista de Bancada](03_Prompts_Comerciais/C15-barista-de-bancada.md) | Novo comercial / preparar café | Estados moagem/dosagem/extração/espuma, partículas visuais e desenho de latte art; não afirmar precisão culinária. |
| C16 [Bancada do Florista](03_Prompts_Comerciais/C16-bancada-do-florista.md) | Novo comercial / arranjar | Curvas de haste, encaixes livres, corte de comprimento, composição de buquê e catálogo configurável. |
| C17 [Maquete que se Monta](03_Prompts_Comerciais/C17-maquete-que-se-monta.md) | Novo comercial / construir em camadas | Montagem por etapas com snap, corte/visita, acabamentos e luz solar; não é projeto estrutural. |
| C18 [Órgão do Perfumista](03_Prompts_Comerciais/C18-orgao-do-perfumista.md) | Novo comercial / compor notas | Notas de saída/coração/fundo em proporções conceituais; visualização sem promessa de aroma real ou fórmula segura. |
| C19 [Terrário de Vidro](03_Prompts_Comerciais/C19-terrario-de-vidro.md) | Novo comercial / plantar | Camadas, snap com limites do recipiente, umidade e crescimento ilustrativos; vidro simplificado. |
| C20 [Máquina de Garra de Brindes](03_Prompts_Comerciais/C20-maquina-de-garra-de-brindes.md) | Novo comercial / capturar | Controle XYZ com limites, garra e contatos, modo demonstração gratuito; cupons reais só com validação externa autorizada e regras transparentes. |

## 7. Procedimento de trabalho por projeto
1. Abrir o prompt individual e anexar fonte existente (se aplicável) e mockup aprovado; conferir integrações e versões. Registrar o que falta, não inventar referências.
2. Construir vertical slice: estado serializável, cena, gesto central real, feedback e saída. Testar com mouse, toque e teclado antes de expandir.
3. Finalizar hero assets, materiais, iluminação, clima e áudio coerentes; implementar todas as etapas específicas; incluir acesso livre e controles alternativos.
4. Implementar persistência voluntária quando necessária; revisar privacidade e compatibilidade com host. Medir orçamento de render e ajustar qualidade.
5. Rodar QA, capturar screenshots e relatório; comparar com referência aprovada. Corrigir falhas; publicar somente após aprovação humana. Preservar versões antigas e migrar de forma reversível.

## 8. Template de evidências e status
Status possíveis: PENDENTE, EM PRODUÇÃO, EM QA, BLOQUEADO, APROVADO. Não marcar APROVADO sem evidência.

| Campo | Valor a preencher no release |
|---|---|
| ID / commit / versão | — |
| Ambiente / hardware / navegador | — |
| Build / tsc / console / 404 | PASS / FAIL / NÃO TESTADO + evidência |
| Gesto principal e critérios individuais | PASS / FAIL / NÃO TESTADO |
| Mouse / toque / teclado / fallback | — |
| Áudio, pausa e contexto WebGL | — |
| Privacidade e exclusão | — |
| FPS / p50/p95 frame time / draw calls / tris / bytes | — |
| Capturas desktop/mobile e close-ups | — |
| Offline / integração / rollback | — |
| Pendências e aprovação humana | — |

## 9. Como usar o pacote
- `00_Contrato_Producao_2.0.md`: fonte normativa comum. Também está incorporado a cada um dos 52 prompts, de modo que cada arquivo pode ser usado individualmente.
- `01_Prompts_Existentes/`: 18 prompts de evolução, incluindo modos integrados e IDs de controles existentes para regressão.
- `02_Prompts_Terapeuticos/`: 14 prompts de implementação. Contêm a geometria, interações, DNA e planos originais como referência, com prioridade explícita para as decisões 2.0.
- `03_Prompts_Comerciais/`: 20 prompts de implementação, cada um com três prompts de mockup originais e requisitos de marca.
- `04_Pendencias/`: dois dossiês de recuperação/decisão, não prompts de execução.
- `05_Referencias_Originais/`: os 10 arquivos recebidos, preservados sem alterações. `catalogo.json`: índice legível por software, não manifesto de apps já construídos.

## 10. Fontes e limites
Fontes: PROMPT_BASE_PADRAO_DOS_APPS.md e cópia (1), BASE-TECNICA-COMUM.md, LEIA-ME.md, Prompts_completos_17_jogos(1).md, Prompts_20_Recursos_3D(1).zip, plano-20-recursos.7z, ambientes-interativos-TODOS.md, ambientes-html.7z e Recursos 3D — Conceitos, Mockups e Implementação(2).xlsx. A decisão 2.0, as melhorias e a arquitetura são recomendações elaboradas a partir dessas fontes. O código foi inspecionado estaticamente, sem testes reais nesta etapa. Os planos originais podem mencionar arquivos não fornecidos. Não há comprovação de FPS, de fidelidade a mockup ou de segurança criptográfica pelo simples fato de existir código. Nenhum original alterado.

---
# Contrato de produção 2.0 — obrigatório

**Precedência:** este contrato define tecnologia, privacidade e aceite. As decisões específicas 2.0 do projeto prevalecem sobre versões antigas de conteúdo. As referências preservadas orientam cena e identidade, não impõem stack antiga, dimensões não confirmadas ou funcionalidades incompatíveis. Em caso de conflito não resolvido, registre e preserve o comportamento existente até validação. Não declare implementação ou teste sem evidência.

## 1. Arquitetura e entrega
- Inventariar repositório e executar baseline antes de editar; preservar rota, slug, integrações e funcionalidades existentes. Trabalhar em branch própria; migração incremental, rollback e snapshots de estados reais. Não sobrescrever outros jogos.
- Vite + TypeScript estrito + Three.js WebGL2, versão compatível fixada no lockfile após teste de API. React Three Fiber somente se host já for React e se não houver dois renderers. Dependências, fontes, decoders e assets locais; nenhum CDN em runtime. Não presumir acesso a caminhos Windows. Se disponíveis, reutilizar `engine.ts`, `pbr.ts`, `effects.ts`, `model.ts`, `audio.ts` e Barra Imersiva; senão implementar equivalentes, não alegar cópia.
- Separar `game/{state,content,rules}.ts`, `scene/`, `input/`, `audio/`, `ui/`, `assets/`, `tests/`; módulo de cena lazy-load com init, resize, pause, resume, dispose. Um estado serializável e comandos únicos; simulação determinística onde útil. Não persistir objetos Three. Entregar código, package.json/lockfile, README, manifestos, testes, build estático e relatório.
- HTML legado: manter entrada compatível, permitir exportar build estático para subdiretório; distribuição em pasta HTML+assets local é padrão. Arquivo HTML único só como export adicional quando realmente viável (bibliotecas/asset embutidos e testados). `file://` não é pressuposto; documentar servidor HTTP. Offline após instalação/cache validado, com service worker versionado, fallback e teste sem rede.
- Integração: rota ou iframe isolado, eventos `ready`, `pause`, `resume`, `complete`, `exit`, `summary` versionados e origem permitida. Não enviar textos ou dados pessoais por padrão. Launcher com id, título, categoria, descrição, entrada, thumbnail própria, capabilities e status.

## 2. Motor e identidade
- Núcleo invisível comum; cada projeto preserva verbo, paleta, composição, materiais, tipografia e ferramentas contextuais do mockup aprovado. Não reaproveitar tema visual por conveniência. Reconstruir em 3D real, nunca imagem inteira clicável. Coordenadas originais são propostas; calibrar com referência real. Se mockup faltar, usar texto e declarar fidelidade visual não verificada.
- Pipeline: WebGLRenderer + EffectComposer quando suportado, alvo HalfFloat/MSAA com fallback testado, RenderPass, GTAO meia resolução só Cinema, bloom contido opcional, um pass final ACES/sRGB/gradação (sem dupla conversão). PCFShadowMap se compatível com versão; sombras sob demanda com invalidação por movimento/luz, câmera de sombra atualizada após alteração. PMREM do cenário; luz principal motivada; contato sob objetos, fachos que desaparecem perto da câmera. Sem flashes. Grão e aberração desativados por padrão; conforto prevalece.
- Cinema / Equilibrada / Leve + Automática; detectar capacidades e medir, não só nome da GPU. Orçamento inicial 3,6 / 1,15 / 0,55 MP, reduzir escala após custo sustentado acima de 24 ms e aumentar lentamente com histerese abaixo de 17 ms; Leve sem pós pesado. Pause quando aba oculta ou canvas fora de tela; recuperar contexto ou fallback DOM funcional.
- Geometria detalhada procedural para comuns; GLB para hero/rig quando justificado. Bevel, lathe, tubos afunilados, pivôs por função, metros/Y-up, IDs e colliders separados. Texturas PBR com cor sRGB e mapas de dados lineares; veios e micro-relevo, UV em metros; cache, atlas, instancing, merge estático, LOD. 512–1024 px comuns, 2k hero só com justificativa. Vidro/transparência barata em mobile; evitar transmission em Leve. Manifesto por asset: id, caminho, licença, tamanho, LOD, materiais, pivô, colisão, clips, fallback; `scene.json` com pos/rot/scale/função. Gerar modelos efetivos, não placeholders. Proveniência e licença em credits.md.

## 3. Mecânica e controles
- Ação central muda estado e cena; feedback por objeto, texto e som opcional. Raycast em hitboxes; pointer capture; separar toque de arraste, câmera e HUD; teclado e botões equivalentes. Orbit limitado; câmera não atravessa objetos. Zoom/visões nomeadas, reduz movimento e transições sem tremor. Undo/redo para criação, reset destrutivo confirmado.
- Física: usar Rapier para contatos/corpos rígidos necessários, passo fixo 1/60 s, substeps/CCD quando necessário, limite de delta após pausa; parâmetros em unidades coerentes. Mecanismos de engrenagem, trilho, dobradiça e animação guiada usam cinemática determinística se suficiente. Fluidos, tecidos, aroma e sensação tátil podem ser aproximações explícitas. Deformações locais recalculam somente região alterada; meta <6 ms por gesto medido.
- Fluxo: entrada → modo livre/guiado/acompanhado quando apropriado → demonstração pulável → interações com feedback → revisão → repetir ou sair. Pausa e saída sempre acessíveis. Não forçar completar etapas subjetivas. Estados extremos e resets devem manter consistência.

## 4. Interface, áudio e privacidade
- Barra Imersiva: cena inteira; topo compacto com título, voltar, ações, tela cheia, recolher H; Esc fecha painel; barra inferior de ferramentas; um painel contextual por vez. Mobile 100dvh, safe-area, bottom sheet, câmera reenquadrada, alvos >=44 px (48 px preferível), foco visível, contraste 4,5:1, aria-live, navegação por teclado e alternativa DOM para ações essenciais. Não copiar HUD fixo do mockup: manter textos, hierarquia e composição 3D.
- Web Audio só após gesto explícito de som; mixer/master mute, fades, compressor/limitador e teto digital conservador, polifonia limitada. Não prometer segurança auditiva baseada apenas em dBFS. Silêncio inicial e alternativas visuais. Sem microfone/câmera por padrão. Assets sonoros locais e licenciados/originais.
- Terapêuticos: convites fenomenológicos, sem diagnóstico, interpretação, benefício clínico garantido, ranking, escore subjetivo, punição ou cronômetro coercitivo. Regras objetivas podem receber feedback descritivo. Registre só observáveis e autorrelatos voluntários; significado pertence a quem cria. Mediação configurável, especialmente com crianças; evitar estímulos inesperados. Dados sensíveis em memória por padrão, persistência somente opt-in, exportação seletiva e exclusão. localStorage apenas preferências não sensíveis; IndexedDB para acervo voluntário com proteção adequada e aviso de dispositivo compartilhado. Não logar conteúdo pessoal. Sem analytics remoto.
- Comerciais: `MARCA` com nome, logoTexto, cores, fontes, textos, CTA, catálogo, dois presets (original e neutro). Re-skin também altera acentos 3D. Preservar nav/título/CTA em site; `?embed=1` oculta navegação demo. CTA por evento versionado com `tipo:'cta'`, origem validada e link configurado; evitar abertura duplicada; sem dados pessoais por padrão. Placar permitido somente entretenimento comercial não clínico, opcional. Prêmios reais dependem de sistema e regras verificados, nunca inventar emissão.

## 5. Aceite e orçamento
- Metas iniciais, não garantias: 60 fps desktop, 30 fps celular intermediário real; Intel UHD Equilibrada <=25 ms a 1280×720 na medição de referência e Cinema <=45 ms, separados de FPS sustentado; draw calls ~100 mobile / 180 desktop, triângulos ~150k / 350k, primeira cena jogável ~5 MB transferidos. Medir em dispositivo real quando disponível, registrar hardware, browser, tier, resolução, p50/p95 frame time, chamadas, tris, bytes, memória aproximada, tempo de carregamento. Explicar exceções com perfil e justificativa. Não usar FPS de aba oculta.
- Testes: unitário (FSM, regras, reset, pausa, extremos), integração (picking, toque, teclado, mute, reload, resize, context loss, dispose, persistência), Playwright 1920×1080, 1280×720, 390×844, 360×640, tablet/landscape; axe quando aplicável. Testar sessões repetidas e offline. Build/tsc limpos, sem console errors/404. Verificar acessibilidade e ausência de dados sensíveis em eventos/logs.
- Capturas: entrada, interação principal, conclusão, mobile, cada preset/visão e close-up dos hero assets. Comparar lado a lado com mockup aprovado se disponível; registrar desvios. Sem referência não declare fidelidade visual. Restaurar preferências alteradas nos testes. Entregar matriz de evidências com PASS/FAIL/NÃO TESTADO, medições reais e pendências. Só declarar pronto após critérios específicos e comuns; bloqueios não podem ser mascarados com placeholder.
