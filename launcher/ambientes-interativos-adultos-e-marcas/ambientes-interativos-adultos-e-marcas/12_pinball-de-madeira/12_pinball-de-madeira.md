# 12. Pinball de Madeira

**Conceito.** Uma mesa de pinball artesanal de madeira e latão, com rampas, bumpers que acendem e um painel retrô. O visitante lança a bola com o êmbolo e usa os flippers pelo teclado ou tocando nas laterais da tela. Alvos, ilustrações e cores mudam conforme a marca. Sem dinheiro e sem prêmio aleatório.

**Grupo:** Mecânica das coisas · **Onde usar:** qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas · **Público:** todas as idades
**Passos:** Puxe o êmbolo → Use os flippers → Acerte os alvos → Jogue de novo · **Marca fictícia do mockup:** Hamburgueria Brasa

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Hamburgueria Brasa" (qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas).

CENA 3D (ocupa a tela inteira, atrás da interface):
Mesa de pinball vista de cima em perspectiva, tampo de madeira clara com marchetaria, bumpers cilíndricos de latão com topo de acrílico iluminado, flippers marfim, rampa de arame cromado, backbox com letreiro de neon da marca fictícia e vidro com reflexos. Luz e cor: neon quente e luzes dos bumpers com reflexos no vidro; madeira, latão e as cores da marca.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo fliperama retrô com bordas cromadas e placar de dígitos que viram):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Hamburgueria Brasa" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Pedir agora" à direita.
- À esquerda, sobre a cena: o título grande "Jogue uma rodada.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Puxe o êmbolo" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões grandes "Flipper esquerdo" e "Flipper direito" nas laterais, "Lançar", "Modo relax" e som.
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Bungee + Rubik. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a bola de aço em pleno voo entre dois bumpers acesos com faíscas de luz, o flipper direito levantado e o placar no backbox subindo. Mostre também um placar de dígitos que viram com "Bola 2 de 3" e os botões grandes dos flippers nas laterais. O cartão de passos agora destaca "Acerte os alvos".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Pedir agora" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Jogue uma rodada." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Pinball de Madeira"** (Mecânica das coisas; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (qualquer marca (re-skin), bares, hamburguerias, eventos, campanhas). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma mesa de pinball artesanal de madeira e latão, com rampas, bumpers que acendem e um painel retrô. O visitante lança a bola com o êmbolo e usa os flippers pelo teclado ou tocando nas laterais da tela. Alvos, ilustrações e cores mudam conforme a marca. Sem dinheiro e sem prêmio aleatório.

## Mecânica
- Êmbolo: segurar e soltar (força pela duração).
- Flippers: teclas laterais ou toque nas metades da tela.
- Bumpers, alvos e rampa com efeitos de luz.
- 3 bolas por rodada, placar só local.
- "Modo relax": sem fim de jogo.

## Passos guiados (4)
1. Puxe o êmbolo
2. Use os flippers
3. Acerte os alvos
4. Jogue de novo
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Mesa de pinball vista de cima em perspectiva, tampo de madeira clara com marchetaria, bumpers cilíndricos de latão com topo de acrílico iluminado, flippers marfim, rampa de arame cromado, backbox com letreiro de neon da marca fictícia e vidro com reflexos. Luz e cor: neon quente e luzes dos bumpers com reflexos no vidro; madeira, latão e as cores da marca. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: fliperama retrô com bordas cromadas e placar de dígitos que viram. Tipografia: Bungee + Rubik. Barra de navegação de demonstração (escondida em `?embed=1`), título "Jogue uma rodada." com frase de apoio, dock com botões grandes "Flipper esquerdo" e "Flipper direito" nas laterais, "Lançar", "Modo relax" e som, botão de ação "Pedir agora" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Bumper (pop elétrico), flipper (solenoide), bola rolando, sino de pontos; trilha opcional.

## Sistemas específicos
- Física restrita ao plano inclinado (Rapier 2D ou 3D travado), CCD para a bola, flippers cinemáticos com alta velocidade angular, impulso nos bumpers.
- Bola de aço espelhada pelo envMap.
- Layout da mesa e tema (cores, imagens, textos) num JSON de configuração da marca.

## Cuidados
Nada de aposta, compra ou prêmio aleatório; placar só local.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `pinball-de-madeira.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Hamburgueria Brasa" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_pinball-de-madeira_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
