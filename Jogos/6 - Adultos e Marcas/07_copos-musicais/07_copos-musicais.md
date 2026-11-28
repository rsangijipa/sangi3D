# 07. Copos Musicais

**Conceito.** Sobre um balcão de mármore, oito taças de cristal. O visitante enche ou esvazia cada taça com uma jarra (a nota muda com o nível da água), toca com uma colher ou passa o dedo na borda para fazê-las cantar. Um afinador mostra a nota mais próxima, e dá para afinar uma escala e tocar melodias simples.

**Grupo:** Sonoros e musicais · **Onde usar:** bares, cafés, escolas, eventos · **Público:** todas as idades
**Passos:** Encha as taças → Toque com a colher → Faça a borda cantar → Toque uma melodia · **Marca fictícia do mockup:** Bar Cristal

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Bar Cristal" (bares, cafés, escolas, eventos).

CENA 3D (ocupa a tela inteira, atrás da interface):
Balcão de mármore branco com veios, oito taças de cristal com níveis de água diferentes (levemente âmbar), jarra de vidro, colher de prata, fundo de bar desfocado com bokeh dourado e garrafas. Luz e cor: bokeh quente de bar com luz pontual sobre o balcão; cristal, mármore, âmbar e preto.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo vidro escuro com bordas douradas finas em estilo art déco, botões geométricos):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Bar Cristal" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Reservar mesa" à direita.
- À esquerda, sobre a cena: o título grande "Afine com água.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Encha as taças" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Jarra", "Colher", "Dedo na borda", "Afinador" e "Esvaziar tudo".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Poiret One + Jost. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a jarra inclinada despejando um fio de água numa taça, ondas na superfície, o afinador mostrando "Sol" e outra taça vibrando com ondulação concêntrica ao ser tocada pela colher. Mostre também um cartão "Encha as taças" com o afinador e a lista das 8 taças com seus níveis. O cartão de passos agora destaca "Faça a borda cantar".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Reservar mesa" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Afine com água." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Copos Musicais"** (Sonoros e musicais; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (bares, cafés, escolas, eventos). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Sobre um balcão de mármore, oito taças de cristal. O visitante enche ou esvazia cada taça com uma jarra (a nota muda com o nível da água), toca com uma colher ou passa o dedo na borda para fazê-las cantar. Um afinador mostra a nota mais próxima, e dá para afinar uma escala e tocar melodias simples.

## Mecânica
- Jarra: arrastar sobre uma taça despeja água; segurar mais, enche mais.
- Esvaziar: inclinar a taça com um gesto para o lado.
- Toque: a colher bate (som curto).
- Dedo na borda: gesto circular faz a taça cantar enquanto durar.
- Afinador mostra a nota mais próxima de cada taça.

## Passos guiados (4)
1. Encha as taças
2. Toque com a colher
3. Faça a borda cantar
4. Toque uma melodia
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Balcão de mármore branco com veios, oito taças de cristal com níveis de água diferentes (levemente âmbar), jarra de vidro, colher de prata, fundo de bar desfocado com bokeh dourado e garrafas. Luz e cor: bokeh quente de bar com luz pontual sobre o balcão; cristal, mármore, âmbar e preto. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: vidro escuro com bordas douradas finas em estilo art déco, botões geométricos. Tipografia: Poiret One + Jost. Barra de navegação de demonstração (escondida em `?embed=1`), título "Afine com água." com frase de apoio, dock com botões "Jarra", "Colher", "Dedo na borda", "Afinador" e "Esvaziar tudo", botão de ação "Reservar mesa" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Taça com frequência derivada do nível da água (modelo simplificado), golpe = síntese modal curta, borda = som sustentado com batimentos e excitação proporcional à velocidade do gesto; respingos.

## Sistemas específicos
- Cristal com MeshPhysicalMaterial (transmission na Alta, fallback opaco brilhante nas outras).
- Água com nível animado e superfície ondulando por shader.
- Fio de água da jarra.
- Mapeamento nível → frequência (mais água, nota mais grave) e limitador de áudio.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `copos-musicais.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Bar Cristal" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_copos-musicais_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
