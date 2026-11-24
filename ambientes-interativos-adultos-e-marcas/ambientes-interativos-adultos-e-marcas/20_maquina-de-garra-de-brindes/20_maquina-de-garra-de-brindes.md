# 20. Máquina de Garra de Brindes

**Conceito.** Uma máquina de garra retrô cheia de cápsulas e pelúcias originais da marca. O visitante move a garra, desce e tenta pegar uma cápsula; a garra tem física de verdade e pode escorregar, mas o brinde é garantido: em até três tentativas a cápsula abre e revela um cupom ou um conteúdo. Sem pagamento e sem sorteio.

**Grupo:** Marcas e nichos · **Onde usar:** campanhas de qualquer marca: lojas, salões, cafés, confeitarias, eventos · **Público:** todas as idades
**Passos:** Mova a garra → Desça → Pegue a cápsula → Abra o brinde · **Marca fictícia do mockup:** Doce Mel Confeitaria

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Doce Mel Confeitaria" (campanhas de qualquer marca: lojas, salões, cafés, confeitarias, eventos).

CENA 3D (ocupa a tela inteira, atrás da interface):
Máquina de garra retrô em gabinete de madeira e cromado com vidro, cheia de cápsulas de acrílico coloridas e pelúcias originais de abelhinhas da marca fictícia, LEDs em volta, letreiro luminoso com o nome da marca, joystick vermelho e um botão grande. Luz e cor: LEDs coloridos e neon com reflexos no vidro; cromado, madeira, tons pastel e as cores da marca.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo fliperama pastel: painéis de acrílico com bordas cromadas e botões arcade grandes):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Doce Mel Confeitaria" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Usar meu cupom" à direita.
- À esquerda, sobre a cena: o título grande "Pegue seu brinde.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Mova a garra" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com joystick, botão grande "Descer", indicador "Tentativas 1/3", som e "Regras".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Baloo 2 + Rubik. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a garra descendo aberta sobre uma cápsula rosa, com a sombra projetada no monte de cápsulas, as luzes do gabinete brilhando suavemente e uma seta indicando a posição. Mostre também um painel "Tentativa 2 de 3 · o brinde está garantido" com o joystick e o botão "Descer". O cartão de passos agora destaca "Pegue a cápsula".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Usar meu cupom" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Pegue seu brinde." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Máquina de Garra de Brindes"** (Marcas e nichos; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (campanhas de qualquer marca: lojas, salões, cafés, confeitarias, eventos). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma máquina de garra retrô cheia de cápsulas e pelúcias originais da marca. O visitante move a garra, desce e tenta pegar uma cápsula; a garra tem física de verdade e pode escorregar, mas o brinde é garantido: em até três tentativas a cápsula abre e revela um cupom ou um conteúdo. Sem pagamento e sem sorteio.

## Mecânica
- Joystick ou setas para mover a garra; botão "Descer".
- A garra fecha e sobe com física.
- Contador de tentativas visível e regra clara: "o brinde sai em até 3 tentativas".
- A cápsula abre com animação e revela o brinde.
- Cupom copiável.

## Passos guiados (4)
1. Mova a garra
2. Desça
3. Pegue a cápsula
4. Abra o brinde
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Máquina de garra retrô em gabinete de madeira e cromado com vidro, cheia de cápsulas de acrílico coloridas e pelúcias originais de abelhinhas da marca fictícia, LEDs em volta, letreiro luminoso com o nome da marca, joystick vermelho e um botão grande. Luz e cor: LEDs coloridos e neon com reflexos no vidro; cromado, madeira, tons pastel e as cores da marca. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: fliperama pastel: painéis de acrílico com bordas cromadas e botões arcade grandes. Tipografia: Baloo 2 + Rubik. Barra de navegação de demonstração (escondida em `?embed=1`), título "Pegue seu brinde." com frase de apoio, dock com joystick, botão grande "Descer", indicador "Tentativas 1/3", som e "Regras", botão de ação "Usar meu cupom" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Motor da garra, cabo, clique da garra, fanfarra curta ao ganhar. Volume baixo.

## Sistemas específicos
- Rapier com garra de 3 dedos articulada (juntas com motores limitados) e cápsulas como corpos dinâmicos.
- Garantia: na última tentativa, ajuda física discreta (mais atrito e força), explicada nas regras.
- Cupons numa lista JSON configurada pela marca (código fixo ou lista), sem servidor.
- Botão de copiar o cupom.

## Cuidados
Evitar mecânica de jogo de azar: sem pagamento, sem prêmio aleatório de valor e com regras claras. É brinde garantido, não sorteio (no Brasil, sorteios promocionais exigem autorização).

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `maquina-de-garra-de-brindes.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Doce Mel Confeitaria" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_maquina-de-garra-de-brindes_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
