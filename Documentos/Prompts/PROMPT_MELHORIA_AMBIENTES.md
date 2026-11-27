# PROMPT — Plano de melhoria, realismo e novas funções dos Ambientes 3D

> Cole este prompt inteiro numa sessão do Claude Code aberta na pasta `Ambientes 3D`.
> Rode **um ambiente por sessão** (ou um lote pequeno da mesma coleção). Diga no início qual ambiente quer melhorar, por exemplo: *"Aplique o prompt ao ambiente: Oficina de Bonsais"*.

---

## Papel

Você é diretor técnico e de arte de experiências 3D para navegador (Three.js / WebGL). Sua tarefa é levar um ambiente já existente do acervo **Ambientes 3D** ao nível de uma peça de vitrine: mais realista, mais rica em funções, mais polida e mais estável — sem perder a proposta terapêutica, educativa ou contemplativa original.

## Contexto do acervo

- O launcher (`launcher/server.mjs` + `launcher/index.html`) varre a pasta e lista cada ambiente. Rode com `node launcher/server.mjs --port 5170` ou pelo `Abrir Launcher.cmd`.
- Tipos de ambiente:
  - **HTML único** (`kind: html`): um arquivo `.html` autocontido em `01_Jogos_HTML/<pasta>/`, na raiz ou em `ambientes-interativos-adultos-e-marcas/`.
  - **Projeto** (`kind: project`): Vite/TypeScript com `package.json`; o launcher compila para `dist/` sozinho.
- Prompts originais de cada ambiente ficam ao lado do código (`PROMPT.md`, `PROMPT_IMPLEMENTACAO.md`, `01_PROMPT_MESTRE.md`) ou em `04_Prompts/`. Eles são a fonte de verdade da intenção do ambiente: leia antes de mudar qualquer coisa.
- Versões antigas ficam em `01_Jogos_HTML/Legado_Arquivado/`. Não edite o legado; ele é referência.

## Regras invioláveis

1. **Preserve a intenção.** Ler o prompt original é obrigatório. Toda melhoria precisa servir à proposta do ambiente (regulação emocional, TCC, contemplação, aprendizagem, marca). Nada de gamificação ansiosa, cronômetros punitivos, sons estridentes ou violência.
2. **Não quebre o que funciona.** Antes de editar, abra o ambiente no launcher, jogue e anote o que já existe. Toda função atual tem de continuar funcionando.
3. **Mantenha o formato.** HTML único continua sendo um único arquivo autocontido (CDN só de `cdnjs`, `jsdelivr` ou `unpkg`, com versão exata). Projeto continua compilando com `npm run build`.
4. **Desempenho é requisito.** Alvo: 60 fps em notebook com GPU integrada; 30 fps estáveis em celular médio. Nada de travar a aba.
5. **Faça backup lógico.** Antes de reescrever um HTML único grande, copie o arquivo atual para `<pasta>/_versoes/<nome>-AAAA-MM-DD.html` (a pasta `_versoes` é ignorada pelo launcher).
6. **Português do Brasil** em toda a interface e nos textos.

## Processo obrigatório (por ambiente)

### Etapa 1 — Auditoria (não edite nada ainda)
Entregue uma tabela curta com:
- O que o ambiente promete (do prompt original) × o que entrega hoje.
- Notas de 0 a 10 em: **modelagem**, **materiais**, **iluminação**, **atmosfera/pós-processamento**, **animação e física**, **som**, **interações**, **interface**, **acessibilidade**, **desempenho**, **mobile**.
- Bugs encontrados (console, cliques que não respondem, câmera que atravessa objetos, textos cortados).
- Captura de tela do estado atual (desktop e mobile).

### Etapa 2 — Plano
Liste de 8 a 15 melhorias, cada uma com: objetivo, como implementar, risco e custo (P/M/G). Ordene por impacto. Separe em três blocos:
- **Realismo** — o que faz o mundo parecer físico e crível.
- **Funções** — o que dá mais coisas para fazer, explorar e guardar.
- **Qualidade** — estabilidade, acessibilidade, desempenho, acabamento.

Mostre o plano e siga direto para a execução, a menos que alguma melhoria mude a proposta do ambiente: nesse caso, pergunte antes.

### Etapa 3 — Execução
Implemente em passos pequenos, testando no navegador depois de cada bloco.

### Etapa 4 — Verificação
- Console sem erros; nenhuma requisição 404.
- Capturas antes/depois lado a lado (desktop 1440×900 e mobile 390×844).
- Medição de fps e de draw calls (`renderer.info`) antes/depois.
- Nova tabela de notas 0–10.
- Atualização do `<title>`, da `<meta name="description">` e de uma `miniatura.png` (1280×800) na pasta do ambiente, para o launcher mostrar capa e descrição.

---

## Padrão de qualidade — checklist de realismo

**Renderização**
- `renderer.outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping` (ou AgX) com exposição ajustada.
- `physicallyCorrectLights`/unidades físicas; sombras `PCFSoftShadowMap` com bias ajustado e frustum justo à cena.
- Iluminação por ambiente: `RoomEnvironment` + `PMREMGenerator`, ou HDRI leve (≤ 2 MB) quando fizer sentido.
- `pixelRatio` limitado a `min(devicePixelRatio, 2)`; qualidade adaptativa (reduz sombras/pós quando fps cai).

**Materiais**
- `MeshStandardMaterial`/`MeshPhysicalMaterial` com roughness e metalness críveis; nada de cor chapada sem variação.
- Texturas procedurais (canvas/noise) para madeira, pedra, tecido, cerâmica, terra, papel; normal maps e roughness maps sutis.
- Vidro com `transmission`, `ior`, `thickness`; água com reflexo e refração simples; metal com anisotropia quando couber.
- Desgaste: bordas mais claras, sujeira em cavidades, variação de tom por instância.

**Modelagem e cena**
- Silhuetas com chanfro (bevel) — nada de caixas perfeitas.
- Objetos de cena que contam história (props secundários, poeira, folhas, ferramentas).
- `InstancedMesh` para repetição (grama, pedras, livros, sementes); LOD quando houver muitos objetos.
- Escala real coerente (1 unidade = 1 m).

**Atmosfera**
- Pós-processamento leve: SSAO ou AO assada, bloom discreto só em fontes de luz, vinheta suave, profundidade de campo opcional no modo foto.
- Névoa/partículas de poeira em feixes de luz quando o ambiente for interno.
- Ciclo de luz (manhã, tarde, entardecer, noite) quando combinar com a proposta.

**Movimento e física**
- Easing em toda animação (nada linear); inércia na câmera; objetos com peso.
- Física leve (cannon-es ou rapier) onde houver empilhar, soltar, rolar, derramar.
- Microanimações ociosas: vento em folhas, chama tremendo, água ondulando, poeira flutuando.

**Som**
- Ambiente sonoro em camadas (Web Audio), com som espacial (`PositionalAudio`) nos objetos.
- Sons de interação sutis e variados (2–3 variações por ação, pitch aleatório leve).
- Controle de volume geral e botão de silenciar; começa silenciado até o primeiro clique.

## Padrão de qualidade — checklist de funções

Escolha as que servem ao ambiente (não precisa de todas):
- **Boas-vindas e tutorial** em 3 passos, que pode ser pulado e revisto.
- **Modos**: livre/contemplativo e guiado (com etapas e reflexões ao fim).
- **Salvar progresso** em `localStorage` (com try/catch) e botão "recomeçar".
- **Modo foto**: esconde a interface, câmera livre, profundidade de campo, salvar PNG.
- **Diário/registro**: o que a pessoa criou ou sentiu, exportável em .txt ou imagem.
- **Personalização**: paleta, hora do dia, clima, trilha sonora.
- **Desafios gentis** opcionais (sem pontuação punitiva), conquistas discretas.
- **Modo terapeuta/educador** (quando o ambiente é clínico): roteiro, perguntas sugeridas, ocultar textos para a criança.
- **Atalhos de teclado** e painel de ajuda (`?`).
- **Botão "← Launcher"** fixo, discreto, no canto superior esquerdo, apontando para `/`.

## Padrão de qualidade — checklist de acabamento

- **Acessibilidade**: contraste AA na interface, foco visível, todos os controles por teclado, `prefers-reduced-motion` respeitado, textos ≥ 14 px, alvos de toque ≥ 44 px, legendas para sons importantes.
- **Mobile**: toque com pinça/arrasto, interface que não cobre a cena, sem rolagem horizontal, aviso de girar o aparelho só se for indispensável.
- **Carregamento**: tela de carregamento com progresso real; nada de tela preta.
- **Robustez**: `resize` correto, `visibilitychange` pausa render e som, `webglcontextlost` tratado com mensagem.
- **Código**: constantes de configuração no topo, funções nomeadas, sem variáveis globais soltas; em projetos, TypeScript sem `any` novo.

---

## Ideias específicas por ambiente

Use como ponto de partida — a auditoria pode mostrar prioridades diferentes.

### Jardins da TCC
- **Escada da Coragem** — degraus de pedra com musgo e desgaste; luz que aumenta a cada degrau; registro dos passos de exposição gradual com escala SUDS; modo terapeuta.
- **Pensar, Sentir e Agir** — três estações físicas (cabeça/coração/mãos) com objetos manipuláveis; diagrama do ciclo gerado a partir das escolhas; exportar folha de registro.
- **Termômetro da Ansiedade** — termômetro de vidro com líquido refrativo e escala gravada; respiração guiada sincronizada com o líquido; histórico das leituras. *(Hoje aponta para o legado: mover para pasta própria em `01_Jogos_HTML/`.)*
- **Tribunal dos Pensamentos** — sala de madeira escura com luz de janela alta; cartas de evidência com papel texturizado; balança física pesando prós e contras; veredito com pensamento alternativo.

### Jardins do Sentir
- **Ateliê dos Remendos e Transformações** — tecidos com simulação de pano simples, costura animada, retalhos com estampas procedurais; galeria das peças criadas.
- **Biblioteca das Histórias Inacabadas** — estantes instanciadas, partículas de poeira na luz, livros que abrem com páginas viradas; escrever finais e guardar na estante.
- **Casa da Árvore das Emoções** — casca e folhas com vento, ciclo do dia, cômodos por emoção; diário pendurado na árvore. *(Hoje aponta para o legado: mover para pasta própria.)*
- **Cidade das Conexões** — cidade miniatura com tráfego e pedestres simples, pontes que se constroem entre casas; mapa das relações salvo.
- **Correio das Palavras Não Ditas** — agência postal com papel, carimbo e cera reais; escrever, selar e escolher enviar, guardar ou queimar (com fumaça e brasas).

### Projetos 3D
- **Tear dos Vínculos** — fios com sombra e brilho de fibra, tensão física no tear; padrões salvos e exportados em imagem.
- **Ateliê das Máscaras Emocionais** — argila com escultura por deformação, pincéis com textura; vitrine das máscaras.
- **Ateliê do Gesto Lento** — rastro de tinta/areia com dinâmica de fluido simples; metrônomo de respiração; modo prática guiada.
- **Jardim dos Ciclos** — estufa de vidro com transmissão real, plantas que crescem por estação; diário botânico.
- **Mochila da Travessia** — itens com peso físico, mochila que muda de volume; mapa da viagem; checklist de cuidado pessoal.
- **Oficina dos Gestos Compartilhados** — dois jogadores no mesmo aparelho ou turnos; ferramentas com física; galeria das criações em dupla.

### Kit 17 jogos 3D
- **Cartografia dos Sons** — áudio espacial real por bairro; mapa que se desenha conforme se escuta; exportar o mapa sonoro.
- **Atlas das Texturas** — materiais PBR detalhados com lupa macro e luz rasante móvel; fichas comparativas.
- **Laboratório de Camadas Sonoras** — mesa de mixagem com faders físicos, VU meters, equalização; salvar mixagens.
- **Meteorologia das Emoções** — céu volumétrico, chuva/neblina/sol com partículas; previsão da semana registrada.
- **Porto das Decisões** — água com ondas e flutuação física dos barcos; rotas com consequência visível; diário de bordo.
- **Bússola do Corpo** — corpo estilizado com mapa de calor das sensações; respiração guiada; linha do tempo.
- **Cidade das Conversas** — personagens com animação ociosa, balões de fala ramificados; árvore da conversa revisável.
- **Casa das Memórias** — cômodos com luz quente de fim de tarde, objetos que guardam memórias (texto/desenho); álbum exportável.
- **Ensaio do Cotidiano** — cenário de rotina (casa, escola, mercado) com etapas ensaiadas; quadro de rotina impresso.

### Ambientes avulsos
- **Bancada do Florista** — pétalas e folhas com subsurface simulado, embrulho de papel kraft; buquê salvo e fotografado.
- **Caixa de Música Perfurada** — cilindro de latão com pinos reais, pente metálico vibrando, som sintetizado fiel; compor perfurando a fita.
- **Colmeia Transparente** — favos hexagonais com mel translúcido, abelhas com voo em bando; ciclo da colmeia e painel educativo.
- **Confeitaria de Bolos** — massas e coberturas com brilho, glacê escorrendo; pedidos de clientes; vitrine dos bolos.
- **Cozinha das Descobertas** — ingredientes com física, vapor e fervura; receitas passo a passo; caderno de receitas.
- **Estufa das Borboletas** — asas com iridescência, ciclo de vida (ovo → lagarta → crisálida → borboleta); catálogo de espécies.
- **Gerador de Mundos Climáticos** — terreno com erosão simples, biomas por temperatura/umidade, nuvens volumétricas; salvar e compartilhar semente.
- **Jardim dos Fungos** — bioluminescência à noite, esporos em partículas, micélio que se espalha; ficha de cada espécie.
- **Lago 3D Interativo** — água com reflexo/refração e ondas ao toque, peixes com cardume, vitórias-régias; ciclo dia/noite com vagalumes.
- **Maquete que se Monta** — peças com encaixe magnético e sombra de contato, planta baixa ↔ 3D; exportar a maquete.
- **Máquina de Garra de Brindes** — garra com física de corda e pegada probabilística justa, vidro com reflexo; coleção de brindes.
- **Moinho Hidráulico** — roda com vazão real de água, engrenagens transmitindo torque, painel de potência; modo aula.
- **Oficina das Velas Artesanais** — cera derretendo com cor e perfume, chama com luz tremeluzente e fumaça; prateleira das velas.
- **Oficina de Bonsais** — poda e aramação com galhos articulados, crescimento por estação; diário do bonsai.
- **Oficina do Ritmo Compartilhado** — instrumentos com resposta física e som sampleado; turnos criança/adulto com loop gravado.
- **Paisagem Sonora** — fontes sonoras espaciais posicionáveis, visualização de ondas; salvar paisagens.
- **Pousada Vento Leve** — sinos de vento com física de pêndulo e síntese metálica, vento variável, varanda ao entardecer; modo sono.
- **Semáforo das Emoções** — praça com vida (pássaros, pessoas ao longe), semáforo com luz real; estratégias por cor; registro diário.
- **Terrário de Vidro** — vidro com condensação, umidade e luz afetando as plantas; montar camadas de substrato.
- **Trem de Engrenagens** — engrenagens com relação de transmissão correta e desafios de montagem; modo aula com velocidade/torque.
- **Vulcão em Miniatura** — lava com emissão e resfriamento, fumaça volumétrica, camadas geológicas em corte; modo laboratório.

### Adultos e marcas
- **Sala de Espera Sonora** — sala com materiais de design de interiores, luz natural de janela; presets de paisagem sonora por marca.
- **Mesa dos Objetos que Acalmam** — pêndulo de areia com rastro real, objetos de pedra e madeira com física; sessão cronometrada gentil.
- **Casa Seixo — Rochas em Equilíbrio** — rio com água em movimento, seixos com física estável e som de pedra; galeria das torres.
- **Pinball de Madeira** — física de bola precisa, latão polido e madeira envernizada, placar mecânico; mesas temáticas.

### Expressão e desenvolvimento
- **Trilha do Mestre Mandou** — personagem com animações claras, trilha com obstáculos variados; níveis de dificuldade.
- **Ateliê das Reconstruções (Kintsugi)** — fratura procedural da cerâmica, laca dourada com brilho metálico; vitrine de peças restauradas.
- **Galeria dos Equilíbrios Impossíveis** — esculturas com física e centro de massa visível; modo desafio.
- **Sala das Cadeiras Possíveis** — cadeiras de materiais variados, simulação de distância/proximidade; mapa de lugares.
- **Sopraria das Transformações** — vidro incandescente com cor por temperatura, sopro e modelagem; prateleira das peças.
- **Pavilhão dos Tecidos Flutuantes** — tecido com simulação de pano e vento, luz através do tecido; composição salva.
- **Agência de Investigação dos Pensamentos** — mural de cortiça com fios, lupa e fichas; casos variados; relatório final.
- **Rádio dos Pensamentos** — rádio antigo com válvulas acesas e dial físico, chiado entre estações; trocar de frequência = reformular pensamento.
- **Máquina das Consequências** — máquina de Rube Goldberg com física real; bifurcações; registro previsão × resultado.
- **Central dos Planos Alternativos** — maquete ferroviária com desvios e sinais; planos A/B/C comparados.
- **Relojoaria das Prioridades** — mecanismo de relógio exposto, engrenagens reais; agenda de 24 h exportável.
- **Farol da Atenção** — mar noturno com ondas e névoa, feixe volumétrico; níveis de foco.
- **Vale dos Balões Passageiros** — balões com física de flutuação e vento, céu com nuvens; prática de desfusão cognitiva.
- **Navegador dos Valores** — barco com física de vela e leme, mar com ondas; bússola de valores pessoais.
- **Areias do Impermanente** — areia com deformação por altura (heightmap), umidade escurecendo; ancinho com rastro; apagar com onda.

---

## Melhorias transversais (fazer uma vez, vale para todos)

Antes de começar pelos ambientes, considere criar em `00_Organizacao/` ou numa pasta `shared/`:
- Um **kit comum** (`ambientes-kit.js`): botão "← Launcher", menu de pausa, volume, modo foto, tela de carregamento, salvar/recomeçar, `reduced-motion`, ajuda `?`. HTML único pode copiar o trecho embutido; projetos podem importar.
- Um **script de capturas** (Playwright) que abre cada ambiente pelo launcher, espera carregar, salva `miniatura.png` e registra erros de console num relatório.
- Mover **Termômetro da Ansiedade** e **Casa da Árvore das Emoções** do legado para pastas próprias em `01_Jogos_HTML/`.

## Formato da resposta

1. Tabela de auditoria com notas.
2. Plano (Realismo / Funções / Qualidade).
3. Execução com resumo do que mudou por arquivo.
4. Verificação: capturas antes/depois, fps, console, novas notas.
5. Lista do que ficou para depois e por quê.
