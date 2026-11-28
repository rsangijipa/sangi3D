# 15. Barista de Bancada

**Conceito.** Uma máquina de espresso de alavanca no balcão. O visitante mói o grão, dosa, compacta com o tamper, encaixa o porta-filtro, puxa a alavanca e acompanha o manômetro e o fluxo; depois vaporiza o leite e despeja desenhando uma latte art simples. O encanto está na mecânica: pressão, fluxo e crema.

**Grupo:** Marcas e nichos · **Onde usar:** cafeterias, torrefações, escolas de barista · **Público:** adultos
**Passos:** Moa e dose → Compacte → Extraia → Vaporize e desenhe · **Marca fictícia do mockup:** Torra Norte Café

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Torra Norte Café" (cafeterias, torrefações, escolas de barista).

CENA 3D (ocupa a tela inteira, atrás da interface):
Máquina de espresso de alavanca cromada e verde-oliva sobre balcão de madeira, moedor cônico, jarra de inox, xícaras de cerâmica, grãos espalhados, vitrine de doces desfocada, vapor e luz quente de manhã. Luz e cor: manhã quente pela janela com reflexos cromados; cromo, verde-oliva, madeira e creme.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo quadro de giz: painéis pretos texturizados com letras de giz, botões de madeira):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Torra Norte Café" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Ver cardápio" à direita.
- À esquerda, sobre a cena: o título grande "Tire seu espresso.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Moa e dose" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Moer", "Compactar", "Alavanca", "Vapor", "Despejar" e "Recomeçar".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Bitter + Inter. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a alavanca puxada, o manômetro marcando 9 bar, dois fios de espresso cor de mel caindo na xícara, a crema se formando e um vapor sutil. Mostre também um cartão "Extraia" com o manômetro, uma barra "Volume na xícara" e o texto descritivo "fluxo constante" (sem nota). O cartão de passos agora destaca "Extraia".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Ver cardápio" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Tire seu espresso." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Barista de Bancada"** (Marcas e nichos; público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (cafeterias, torrefações, escolas de barista). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma máquina de espresso de alavanca no balcão. O visitante mói o grão, dosa, compacta com o tamper, encaixa o porta-filtro, puxa a alavanca e acompanha o manômetro e o fluxo; depois vaporiza o leite e despeja desenhando uma latte art simples. O encanto está na mecânica: pressão, fluxo e crema.

## Mecânica
- Moedor: girar e escolher a moagem; dose em gramas.
- Tamper: pressionar e segurar.
- Porta-filtro: encaixar girando.
- Alavanca: puxar e segurar, com manômetro e fluxo.
- Vapor e despejo: a inclinação e o movimento da jarra desenham coração ou tulipa.

## Passos guiados (4)
1. Moa e dose
2. Compacte
3. Extraia
4. Vaporize e desenhe
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Máquina de espresso de alavanca cromada e verde-oliva sobre balcão de madeira, moedor cônico, jarra de inox, xícaras de cerâmica, grãos espalhados, vitrine de doces desfocada, vapor e luz quente de manhã. Luz e cor: manhã quente pela janela com reflexos cromados; cromo, verde-oliva, madeira e creme. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: quadro de giz: painéis pretos texturizados com letras de giz, botões de madeira. Tipografia: Bitter + Inter. Barra de navegação de demonstração (escondida em `?embed=1`), título "Tire seu espresso." com frase de apoio, dock com botões "Moer", "Compactar", "Alavanca", "Vapor", "Despejar" e "Recomeçar", botão de ação "Ver cardápio" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Moedor (ruído com variação de pitch), toque do tamper, mola da alavanca, fluxo da extração, vaporizador (chiado modulável), xícara no pires.

## Sistemas específicos
- Extração simulada: pressão × resistência (moagem e compactação) = vazão, com retorno descritivo.
- Líquido por partículas e shader de fluxo.
- Latte art por simulação 2D simples numa CanvasTexture (o leite segue a trajetória da jarra).
- Vapor por sprites.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `barista-de-bancada.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Torra Norte Café" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_barista-de-bancada_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
