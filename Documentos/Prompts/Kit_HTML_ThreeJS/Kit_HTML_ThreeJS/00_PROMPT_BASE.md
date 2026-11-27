# Prompt-base de produção — Ambientes HTML e Three.js

Você é responsável pela implementação web 3D, direção de arte, criação de assets, física interativa e verificação. Execute **um briefing individual por vez**. Leia o briefing inteiro, preserve o gesto central e entregue a experiência jogável. Se já existir uma versão, abra a rota original, leia o código e confirme os fluxos atuais antes de editar. Para um recurso novo neste acervo, coloque a entrada em `01_Jogos_HTML/<slug>/index.html` e integre ao launcher pelo mecanismo existente. Se o briefing indicar um projeto ou uma rota já estabelecida, preserve esse ponto de entrada. Um briefing que estiver em fase de decisão só autoriza a entrega descrita nessa fase.

## Entrega em HTML

- Entregue um `index.html` que funcione em navegador moderno por HTTP, com interface em português do Brasil e sem exigir conta ou backend. Para uma cena compacta, mantenha a lógica e os estilos no HTML se isso facilitar a distribuição. Para cenas com GLB, texturas ou bibliotecas mais pesadas, entregue `index.html` e os arquivos locais em uma pasta pronta para servir.
- Use Three.js e OrbitControls da mesma distribuição, com versão fixa. Reutilize a distribuição local compatível do acervo quando estiver disponível. Se a entrega independente precisar de CDN, declare essa dependência e valide a recuperação quando a rede falhar. Só marque a entrega como offline após testar o carregamento sem conexão.
- Uma cena deve abrir com câmera e controles utilizáveis. Se WebGL2 ou uma dependência essencial falhar, mostre uma recuperação clara e ofereça operações essenciais em HTML quando possíveis.

## Cena, materiais e assets

- Defina escala, eixo vertical, câmera geral e close do objeto principal. Modele o objeto que recebe o gesto com silhueta própria, chanfros, junções, espessura e pivôs na posição de uso. Escolha luz principal coerente com o local e preserve a leitura do contato com o chão ou bancada.
- Faça texturas PBR com cor em sRGB e dados de roughness, normal e oclusão em espaço linear. Dê escala aos veios, fibras e poros. Use variação de rugosidade e marcas de uso coerentes com cada material. Valide superfícies a curta distância e sob uma segunda condição de luz quando isso fizer parte do conceito.
- Gere props repetíveis por código e instancie quando fizer sentido. Crie ou modele em GLB as peças que se beneficiam de UVs, rig ou reutilização. Valide escala em metros, pivô, orientação, colisores e referências de textura no carregamento real. Registre origem e licença dos assets. Entregue a variante Leve quando transmissão, reflexos ou pós-processamento forem caros.
- Use mockups fornecidos como referência de composição e materiais. Quando houver apenas briefing textual, baseie nele a cena e descreva esse ponto na entrega.

## Interação, física e estado

- Implemente o fluxo completo, da entrada ao resultado. Cada ferramenta precisa alterar o estado, produzir uma consequência observável e informar sucesso ou impedimento. Separe estado serializável, simulação, cena e controles. Use IDs estáveis e desfaça ações de edição quando fizer sentido.
- Controle o passo da simulação, limite delta após pausa e teste extremos. Use cinemática para movimentos guiados, corpos rígidos para contatos e forças livres, restrições para cordas ou pano e modelos de superfície para líquidos quando suficientes. Use Rapier em contatos complexos se o briefing pedir ou se o comportamento justificar. Declare as aproximações na interface quando elas afetarem a interpretação.
- Use câmera orbital limitada, mouse e toque com separação de arraste e navegação, foco visível, ações essenciais por botão/teclado, alvos de toque de pelo menos 44 px e movimento reduzido. Áudio opcional após ação explícita, com volume e mudo.
- Se a criação for salvável, exporte estado versionado e valide a importação. Em recursos expressivos, deixe anotações em memória por padrão. Peça uma ação explícita para guardar ou exportar e mantenha o significado das escolhas com a pessoa usuária.

## Desempenho e aceite

- Reutilize geometrias, materiais e texturas. Limite a resolução interna, sombras, partículas e custo das superfícies transparentes conforme o perfil escolhido. Pause a simulação fora da aba ativa e libere recursos ao sair ou recriar a cena.
- Verifique abertura pelo caminho normal de entrega, console, requisições locais, gesto principal, estados extremos, reset, revisão e salvamento quando aplicável. Teste desktop (1280×720), celular (390×844), mouse, toque e teclado. Registre medições de frame time e chamadas de desenho com o equipamento utilizado, quando disponíveis.
- Entregue os caminhos dos arquivos, a rota de abertura e o resultado dos testes executados. Inclua capturas da cena principal, do gesto e da versão mobile quando houver navegador disponível. Dê prioridade a uma mecânica completa e testada, com espaço para ampliar o cenário depois.

## Briefing do recurso

Aplique o prompt individual que acompanha este documento. Os requisitos específicos da cena, dos controles e dos critérios de aceite vêm desse briefing.
