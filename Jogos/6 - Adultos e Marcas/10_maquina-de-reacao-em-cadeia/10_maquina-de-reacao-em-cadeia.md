# 10. Máquina de Reação em Cadeia

**Conceito.** Uma bancada de oficina com peças de uma máquina de reação em cadeia (estilo Rube Goldberg): dominós, rampas, bola de gude, gangorra, polia, roda e alavanca. O visitante encaixa as peças numa grade e solta a primeira bolinha; se a cadeia chegar ao fim, um sino toca e um painel se abre com a mensagem da marca. Errar faz parte da graça: ajusta e solta de novo.

**Grupo:** Mecânica das coisas · **Onde usar:** campanhas e lançamentos de qualquer marca, escolas, agências, engenharia · **Público:** todas as idades
**Passos:** Escolha as peças → Encaixe na bancada → Solte a bolinha → Ajuste e tente de novo · **Marca fictícia do mockup:** Engenho Criativo Agência

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Engenho Criativo Agência" (campanhas e lançamentos de qualquer marca, escolas, agências, engenharia).

CENA 3D (ocupa a tela inteira, atrás da interface):
Bancada de marcenaria com tampo de compensado e pegboard ao fundo, peças de madeira pintadas e de metal, trilhos de rampa, dominós coloridos em fila, bola de gude de vidro, sino de latão no fim do percurso, ferramentas na parede e luz de oficina. Luz e cor: luminária industrial e luz de janela; compensado, cores primárias suaves e latão.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo pegboard e fita crepe: painéis de compensado com furos e etiquetas escritas à mão, botões em forma de peças):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Engenho Criativo Agência" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Fale com a gente" à direita.
- À esquerda, sobre a cena: o título grande "Monte. Solte. Veja acontecer.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha as peças" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Peças", "Girar", "Rodar", "Câmera lenta", "Reiniciar" e "Modo livre".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Space Grotesk + Inter. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a bola de gude descendo a rampa enquanto a fila de dominós cai em onda, a gangorra prestes a lançar uma segunda bola em direção ao sino e um leve rastro de movimento. Mostre também um cartão "Solte a bolinha" com os botões "Rodar", "Câmera lenta" e "Parar". O cartão de passos agora destaca "Solte a bolinha".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Fale com a gente" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Monte. Solte. Veja acontecer." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Máquina de Reação em Cadeia"** (Mecânica das coisas; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (campanhas e lançamentos de qualquer marca, escolas, agências, engenharia). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma bancada de oficina com peças de uma máquina de reação em cadeia (estilo Rube Goldberg): dominós, rampas, bola de gude, gangorra, polia, roda e alavanca. O visitante encaixa as peças numa grade e solta a primeira bolinha; se a cadeia chegar ao fim, um sino toca e um painel se abre com a mensagem da marca. Errar faz parte da graça: ajusta e solta de novo.

## Mecânica
- Inventário de peças; arrastar para a grade com encaixe (snap) e giro de 90°.
- Modo "Montar" e modo "Rodar".
- Câmera lenta e reinício instantâneo.
- Três desafios prontos e modo livre.
- Ao concluir, o sino toca e revela a mensagem e o botão da marca.

## Passos guiados (4)
1. Escolha as peças
2. Encaixe na bancada
3. Solte a bolinha
4. Ajuste e tente de novo
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Bancada de marcenaria com tampo de compensado e pegboard ao fundo, peças de madeira pintadas e de metal, trilhos de rampa, dominós coloridos em fila, bola de gude de vidro, sino de latão no fim do percurso, ferramentas na parede e luz de oficina. Luz e cor: luminária industrial e luz de janela; compensado, cores primárias suaves e latão. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: pegboard e fita crepe: painéis de compensado com furos e etiquetas escritas à mão, botões em forma de peças. Tipografia: Space Grotesk + Inter. Barra de navegação de demonstração (escondida em `?embed=1`), título "Monte. Solte. Veja acontecer." com frase de apoio, dock com botões "Peças", "Girar", "Rodar", "Câmera lenta", "Reiniciar" e "Modo livre", botão de ação "Fale com a gente" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Impactos de madeira, dominós em sequência (cliques com variação), bola rolando (ruído filtrado pela velocidade), sino final.

## Sistemas específicos
- Rapier com corpos dinâmicos (bola, dominós, gangorra com junta revoluta, polia por juntas), passo fixo de 1/120 s e CCD para a bola.
- Determinismo: a mesma montagem dá o mesmo resultado.
- Grade com snapping e limite de peças para caber no orçamento.
- Montagem salva localmente.

## Cuidados
A mensagem da marca é opcional e configurável.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `maquina-de-reacao-em-cadeia.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Engenho Criativo Agência" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_maquina-de-reacao-em-cadeia_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
