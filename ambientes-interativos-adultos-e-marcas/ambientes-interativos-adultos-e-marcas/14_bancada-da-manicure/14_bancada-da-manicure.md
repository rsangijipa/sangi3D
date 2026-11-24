# 14. Bancada da Manicure

**Conceito.** Uma bancada de nail design onde a visitante cria uma combinação: escolhe o formato (amendoado, quadrado, stiletto, bailarina) e o comprimento, a cor num carrossel de esmaltes que gira, aplica as camadas com pinceladas, adiciona nail art (francesinha, glitter, pedrinhas) e escolhe o acabamento (brilho, fosco, cromado), terminando na cabine UV. No fim, salva a imagem e agenda. A mão é de manequim estilizado.

**Grupo:** Marcas e nichos · **Onde usar:** salões de unhas, nail designers, marcas de esmalte · **Público:** adultos
**Passos:** Formato e comprimento → Escolha a cor → Pinte e decore → Acabamento e salvar · **Marca fictícia do mockup:** Studio Lúmen Nails

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Studio Lúmen Nails" (salões de unhas, nail designers, marcas de esmalte).

CENA 3D (ocupa a tela inteira, atrás da interface):
Bancada de salão branca e rosa-nude com tampo de mármore, mão de manequim de porcelana estilizada (sem pele realista) apoiada numa almofada de veludo, carrossel giratório de frascos de esmalte coloridos, cabine UV, pincéis, lixas, flores secas e luz de ring light. Luz e cor: ring light suave com reflexos de estúdio; nude, rosa, branco e dourado.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo cartões de vidro leitoso com borda dourada fina, botões pílula em tons nude):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Studio Lúmen Nails" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Agendar horário" à direita.
- À esquerda, sobre a cena: o título grande "Crie suas unhas.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Formato e comprimento" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Formato", "Cor", "Pincel", "Nail art", "Acabamento" e "Salvar".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Italiana + Manrope. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: close na mão de manequim com três unhas já pintadas em vinho brilhante e uma recebendo a pincelada (o pincel deixando a cor com borda viva), e o carrossel de esmaltes girado com o frasco escolhido em destaque. Mostre também um cartão "Pinte e decore" com uma paleta de 8 cores e os botões "Glitter", "Francesinha" e "Pedrinhas". O cartão de passos agora destaca "Pinte e decore".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Agendar horário" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Crie suas unhas." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Bancada da Manicure"** (Marcas e nichos; público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (salões de unhas, nail designers, marcas de esmalte). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma bancada de nail design onde a visitante cria uma combinação: escolhe o formato (amendoado, quadrado, stiletto, bailarina) e o comprimento, a cor num carrossel de esmaltes que gira, aplica as camadas com pinceladas, adiciona nail art (francesinha, glitter, pedrinhas) e escolhe o acabamento (brilho, fosco, cromado), terminando na cabine UV. No fim, salva a imagem e agenda. A mão é de manequim estilizado.

## Mecânica
- Formato e comprimento das unhas.
- Carrossel de esmaltes que gira; tocar escolhe a cor.
- Pincel: arrastar sobre a unha aplica a camada (a cobertura cresce com o traço).
- Nail art arrastável (francesinha, glitter, pedrinhas, desenhos).
- Acabamento brilho, fosco ou cromado; animação na cabine UV; "Salvar" gera PNG e "Quero esta" leva ao agendamento com a escolha.

## Passos guiados (4)
1. Formato e comprimento
2. Escolha a cor
3. Pinte e decore
4. Acabamento e salvar
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Bancada de salão branca e rosa-nude com tampo de mármore, mão de manequim de porcelana estilizada (sem pele realista) apoiada numa almofada de veludo, carrossel giratório de frascos de esmalte coloridos, cabine UV, pincéis, lixas, flores secas e luz de ring light. Luz e cor: ring light suave com reflexos de estúdio; nude, rosa, branco e dourado. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: cartões de vidro leitoso com borda dourada fina, botões pílula em tons nude. Tipografia: Italiana + Manrope. Barra de navegação de demonstração (escondida em `?embed=1`), título "Crie suas unhas." com frase de apoio, dock com botões "Formato", "Cor", "Pincel", "Nail art", "Acabamento" e "Salvar", botão de ação "Agendar horário" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Opcional: clique do frasco, pincel suave, bip da cabine UV.

## Sistemas específicos
- Unhas como geometria paramétrica (formato e comprimento por curvas, curvada sobre o leito).
- Pintura por máscara em CanvasTexture (cobertura acumulada por traço).
- Acabamentos por roughness, clearcoat e metalness (cromado).
- Nail art como decals.
- Catálogo de cores e efeitos no JSON da marca; PNG com o logo; link de agendamento com a escolha na URL (?cor=…&formato=…).

## Cuidados
Mão estilizada, não fotorrealista. Se houver opção de foto da própria mão, ela fica só no aparelho.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `bancada-da-manicure.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Studio Lúmen Nails" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_bancada-da-manicure_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
