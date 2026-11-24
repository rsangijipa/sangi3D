# 19. Terrário de Vidro

**Conceito.** Um pote de vidro vazio sobre a mesa. O visitante monta um terrário em camadas reais (pedriscos, carvão, substrato, musgo), planta suculentas ou samambaias, coloca pedras e miniaturas, borrifa água e fecha a tampa. Depois acelera o tempo para ver a condensação do dia e as plantas crescerem devagar.

**Grupo:** Marcas e nichos · **Onde usar:** lojas de plantas, garden centers, decoração, psicologia, escolas · **Público:** todas as idades
**Passos:** Escolha o pote → Faça as camadas → Plante e decore → Feche e veja o ciclo · **Marca fictícia do mockup:** Verde Miúdo Plantas

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Verde Miúdo Plantas" (lojas de plantas, garden centers, decoração, psicologia, escolas).

CENA 3D (ocupa a tela inteira, atrás da interface):
Mesa de madeira clara com um grande pote de vidro em forma de gota, camadas visíveis de pedriscos brancos, carvão, terra escura e musgo verde vivo, suculentas e uma samambaia pequena, pedras e um cogumelo de cerâmica, borrifador, sacos de substrato e ferramentas pequenas, com luz lateral de janela. Luz e cor: luz lateral suave com reflexos e cáusticas no vidro; vidro, verdes, terra e branco.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo fichas de herbário em papel de algodão com desenhos botânicos em nanquim, botões em forma de sementes):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Verde Miúdo Plantas" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Montar o meu" à direita.
- À esquerda, sobre a cena: o título grande "Um mundo num pote.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha o pote" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Pote", "Camadas", "Plantas", "Decorar", "Borrifar", "Tampa" e "Tempo".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Fraunces + Nunito Sans. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: o substrato sendo despejado em cascata dentro do pote, formando uma camada sobre o carvão com grãos rolando, e uma suculenta esperando ao lado com uma guia de plantio. Mostre também um cartão "Faça as camadas" com as 4 camadas em ordem e os botões "Despejar" e "Nivelar". O cartão de passos agora destaca "Plante e decore".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Montar o meu" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Um mundo num pote." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Terrário de Vidro"** (Marcas e nichos; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (lojas de plantas, garden centers, decoração, psicologia, escolas). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Um pote de vidro vazio sobre a mesa. O visitante monta um terrário em camadas reais (pedriscos, carvão, substrato, musgo), planta suculentas ou samambaias, coloca pedras e miniaturas, borrifa água e fecha a tampa. Depois acelera o tempo para ver a condensação do dia e as plantas crescerem devagar.

## Mecânica
- Escolher o pote (gota, garrafa, cúpula).
- Despejar as camadas arrastando o saco; o material se acomoda.
- Cavar e plantar; decorar com pedras e miniaturas.
- Borrifar água e fechar a tampa.
- Controle de tempo: ciclo dia e noite com condensação e crescimento lento; salvar imagem e pedir o kit.

## Passos guiados (4)
1. Escolha o pote
2. Faça as camadas
3. Plante e decore
4. Feche e veja o ciclo
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Mesa de madeira clara com um grande pote de vidro em forma de gota, camadas visíveis de pedriscos brancos, carvão, terra escura e musgo verde vivo, suculentas e uma samambaia pequena, pedras e um cogumelo de cerâmica, borrifador, sacos de substrato e ferramentas pequenas, com luz lateral de janela. Luz e cor: luz lateral suave com reflexos e cáusticas no vidro; vidro, verdes, terra e branco. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: fichas de herbário em papel de algodão com desenhos botânicos em nanquim, botões em forma de sementes. Tipografia: Fraunces + Nunito Sans. Barra de navegação de demonstração (escondida em `?embed=1`), título "Um mundo num pote." com frase de apoio, dock com botões "Pote", "Camadas", "Plantas", "Decorar", "Borrifar", "Tampa" e "Tempo", botão de ação "Montar o meu" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Grãos caindo (granular), borrifo, vidro, gotas de condensação.

## Sistemas específicos
- Vidro com transmission na Alta e fallback nas outras qualidades.
- Camadas como heightfields que crescem onde o material cai (partículas instanciadas que assentam e viram altura).
- Plantas procedurais (rosetas de suculenta instanciadas, frondes de samambaia por L-system simples).
- Condensação por textura animada na face interna do vidro.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `terrario-de-vidro.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Verde Miúdo Plantas" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_terrario-de-vidro_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
