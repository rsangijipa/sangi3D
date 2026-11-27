# 06. Caixa de Música Perfurada

**Conceito.** Uma caixa de música aberta com uma fita de papel perfurada. O visitante clica na grade da fita para fazer furos (as notas), gira a manivela e vê a fita passar pelo pente de aço, que toca cada furo. Pode girar rápido ou devagar, voltar, apagar, usar melodias prontas de domínio público e baixar a sua.

**Grupo:** Sonoros e musicais · **Onde usar:** lojas de presentes, escolas de música, festas, surpresa escondida em qualquer site · **Público:** todas as idades
**Passos:** Perfure as notas → Gire a manivela → Ajuste o ritmo → Guarde a melodia · **Marca fictícia do mockup:** Loja Corda e Melodia

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Loja Corda e Melodia" (lojas de presentes, escolas de música, festas, surpresa escondida em qualquer site).

CENA 3D (ocupa a tela inteira, atrás da interface):
Caixa de música de nogueira com a tampa aberta, mecanismo de latão com pente de aço e rolos de alimentação, fita de papel creme perfurada saindo em curva, manivela de latão com punho de madeira, mesa de feltro verde e luz de abajur. Luz e cor: abajur quente com latão brilhante; nogueira, latão, papel creme e feltro verde.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo papel pautado de partitura com bordas perfuradas, botões de latão):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Loja Corda e Melodia" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Ver presentes" à direita.
- À esquerda, sobre a cena: o título grande "Perfure. Gire. Ouça.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Perfure as notas" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Perfurar", "Girar manivela", "Velocidade", "Apagar", "Melodias prontas" e "Baixar".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Playfair Display + Work Sans. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a manivela em giro, a fita passando sob o pente, dois dentes de aço vibrando com pequenas linhas de movimento e partículas de luz nas notas tocadas, com a grade de furos visível. Mostre também um cartão "Gire a manivela" com o controle "Velocidade" e os botões "Voltar" e "Repetir". O cartão de passos agora destaca "Ajuste o ritmo".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Ver presentes" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Perfure. Gire. Ouça." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Caixa de Música Perfurada"** (Sonoros e musicais; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (lojas de presentes, escolas de música, festas, surpresa escondida em qualquer site). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma caixa de música aberta com uma fita de papel perfurada. O visitante clica na grade da fita para fazer furos (as notas), gira a manivela e vê a fita passar pelo pente de aço, que toca cada furo. Pode girar rápido ou devagar, voltar, apagar, usar melodias prontas de domínio público e baixar a sua.

## Mecânica
- Grade de 15 notas (escala maior) × 32 passos: clicar perfura ou fecha um furo.
- Manivela: arrastar em círculo controla a velocidade (o som segue a mão); botão de giro automático.
- Os dentes do pente vibram visivelmente ao tocar.
- Melodias prontas apenas de domínio público (ex.: "Brilha, brilha, estrelinha", "Ode à Alegria").
- Baixar a melodia (arquivo da fita e áudio WAV).

## Passos guiados (4)
1. Perfure as notas
2. Gire a manivela
3. Ajuste o ritmo
4. Guarde a melodia
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Caixa de música de nogueira com a tampa aberta, mecanismo de latão com pente de aço e rolos de alimentação, fita de papel creme perfurada saindo em curva, manivela de latão com punho de madeira, mesa de feltro verde e luz de abajur. Luz e cor: abajur quente com latão brilhante; nogueira, latão, papel creme e feltro verde. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: papel pautado de partitura com bordas perfuradas, botões de latão. Tipografia: Playfair Display + Work Sans. Barra de navegação de demonstração (escondida em `?embed=1`), título "Perfure. Gire. Ouça." com frase de apoio, dock com botões "Perfurar", "Girar manivela", "Velocidade", "Apagar", "Melodias prontas" e "Baixar", botão de ação "Ver presentes" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Síntese modal de dente de aço (parciais inarmônicas, decaimento longo), catraca da manivela, atrito do papel. Polifonia limitada.

## Sistemas específicos
- Sequenciador guiado pela posição da fita, não pelo relógio: o som acompanha a velocidade da manivela.
- Gesto circular convertido em velocidade angular.
- Grade da fita em CanvasTexture.
- Exportar JSON da melodia e WAV via OfflineAudioContext.

## Cuidados
Melodias prontas só de domínio público.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `caixa-de-musica-perfurada.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Loja Corda e Melodia" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_caixa-de-musica-perfurada_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
