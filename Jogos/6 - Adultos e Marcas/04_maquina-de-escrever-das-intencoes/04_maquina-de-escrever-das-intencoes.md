# 04. Máquina de Escrever das Intenções

**Conceito.** Uma escrivaninha com uma máquina de escrever antiga. O visitante digita uma intenção curta para a semana: cada tecla desce, o tipo bate no papel, o carro anda e o sino toca no fim da linha. Depois ele pode carimbar a folha, dobrá-la num envelope ou baixá-la como imagem. Nada é enviado para lugar nenhum.

**Grupo:** Psicologia e bem-estar (adultos) · **Onde usar:** psicologia, coaching, papelarias, escritórios criativos · **Público:** adultos
**Passos:** Escreva sua intenção → Releia → Carimbe ou dobre → Guarde ou baixe · **Marca fictícia do mockup:** Atelier Palavra Viva

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Atelier Palavra Viva" (psicologia, coaching, papelarias, escritórios criativos).

CENA 3D (ocupa a tela inteira, atrás da interface):
Máquina de escrever vintage verde-água com teclas redondas cromadas e uma folha creme inserida, escrivaninha de carvalho, luminária de mesa de latão, caneta-tinteiro, envelope kraft, carimbo de madeira, xícara de chá e luz quente da noite. Luz e cor: luminária de mesa quente na penumbra; verde-água, carvalho, latão e creme.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo papel datilografado com bordas serrilhadas e pedaços de fita adesiva, botões como teclas redondas):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Atelier Palavra Viva" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Agendar sessão" à direita.
- À esquerda, sobre a cena: o título grande "Escreva uma intenção.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escreva sua intenção" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Teclado", "Retorno do carro", "Carimbar", "Dobrar e guardar" e "Baixar imagem".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Courier Prime + Libre Baskerville. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: close na máquina com uma barra de tipo no ar no instante de bater no papel, a frase "Esta semana eu vou…" já datilografada na folha, o carro avançado e o sino prestes a tocar. Mostre também um cartão "Releia" mostrando a intenção e os botões "Corrigir", "Carimbar" e "Dobrar e guardar". O cartão de passos agora destaca "Carimbe ou dobre".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Agendar sessão" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Escreva uma intenção." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Máquina de Escrever das Intenções"** (Psicologia e bem-estar (adultos); público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (psicologia, coaching, papelarias, escritórios criativos). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma escrivaninha com uma máquina de escrever antiga. O visitante digita uma intenção curta para a semana: cada tecla desce, o tipo bate no papel, o carro anda e o sino toca no fim da linha. Depois ele pode carimbar a folha, dobrá-la num envelope ou baixá-la como imagem. Nada é enviado para lugar nenhum.

## Mecânica
- Digitar pelo teclado físico ou pelo teclado virtual na tela.
- Cada tecla aciona a sua barra de tipo, que bate no papel; o carro avança um caractere.
- Alavanca de retorno no fim da linha (com sino).
- "Carimbar" aplica um carimbo de tinta na folha; "Dobrar e guardar" anima a folha entrando no envelope.
- "Baixar imagem" gera um PNG da folha.

## Passos guiados (4)
1. Escreva sua intenção
2. Releia
3. Carimbe ou dobre
4. Guarde ou baixe
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Máquina de escrever vintage verde-água com teclas redondas cromadas e uma folha creme inserida, escrivaninha de carvalho, luminária de mesa de latão, caneta-tinteiro, envelope kraft, carimbo de madeira, xícara de chá e luz quente da noite. Luz e cor: luminária de mesa quente na penumbra; verde-água, carvalho, latão e creme. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: papel datilografado com bordas serrilhadas e pedaços de fita adesiva, botões como teclas redondas. Tipografia: Courier Prime + Libre Baskerville. Barra de navegação de demonstração (escondida em `?embed=1`), título "Escreva uma intenção." com frase de apoio, dock com botões "Teclado", "Retorno do carro", "Carimbar", "Dobrar e guardar" e "Baixar imagem", botão de ação "Agendar sessão" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Clique de tecla, golpe do tipo (impacto com ruído curto), catraca do carro, sino de fim de linha, retorno do carro. Volume baixo.

## Sistemas específicos
- Texto desenhado numa CanvasTexture da folha com fonte monoespaçada e pequenas variações de tinta e alinhamento por caractere.
- Barras de tipo com pivôs em arco, animadas pelo índice da tecla.
- Campo de texto real oculto e sincronizado, para leitores de tela, colar, teclado do celular e acentos.
- Limite de linhas e de caracteres.

## Cuidados
Texto só local, com botão de apagar. Incluir no rodapé "Preciso de ajuda agora" (CVV 188).

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `maquina-de-escrever-das-intencoes.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Atelier Palavra Viva" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_maquina-de-escrever-das-intencoes_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
