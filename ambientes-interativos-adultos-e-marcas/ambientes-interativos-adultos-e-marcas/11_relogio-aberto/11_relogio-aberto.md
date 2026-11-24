# 11. Relógio Aberto

**Conceito.** Um relógio mecânico de pulso em escala gigante, com fundo transparente. O visitante dá corda pela coroa, vê a mola guardar energia, o trem de engrenagens girar e o escape fazer o tic-tac. Pode abrir a vista explodida para separar as peças e tocar em cada uma para saber o que ela faz.

**Grupo:** Mecânica das coisas · **Onde usar:** relojoarias, joalherias, escolas técnicas, museus · **Público:** adultos
**Passos:** Dê corda → Veja a energia passar → Abra o mecanismo → Conheça cada peça · **Marca fictícia do mockup:** Relojoaria Ponteiro Fino

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Relojoaria Ponteiro Fino" (relojoarias, joalherias, escolas técnicas, museus).

CENA 3D (ocupa a tela inteira, atrás da interface):
Movimento de relógio mecânico em macro: platina com perlage, pontes com côtes de Genève, rubis vermelhos, roda de balanço oscilando, engrenagens douradas e parafusos de aço azulado, caixa de aço polida e fundo escuro aveludado com reflexos. Luz e cor: estúdio de produto com luz-chave e luz de contorno, reflexos ricos; aço, ouro rosé, rubi e azul.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo mostrador minimalista: painéis escuros com fios finos e índices, botões como coroa canelada):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Relojoaria Ponteiro Fino" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Ver coleção" à direita.
- À esquerda, sobre a cena: o título grande "Veja o tempo por dentro.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Dê corda" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Dar corda", "Câmera lenta", "Vista explodida", "Peças" e "Acertar hora".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Cormorant + Inter. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a vista explodida em camadas flutuando alinhadas (mostrador, ponteiros, pontes, trem de engrenagens, balanço), com a roda de escape destacada por um contorno de luz e um cartão explicativo. Mostre também um cartão "Conheça cada peça" com o nome "Roda de escape", duas linhas de explicação e o slider "Abrir". O cartão de passos agora destaca "Abra o mecanismo".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Ver coleção" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Veja o tempo por dentro." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Relógio Aberto"** (Mecânica das coisas; público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (relojoarias, joalherias, escolas técnicas, museus). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Um relógio mecânico de pulso em escala gigante, com fundo transparente. O visitante dá corda pela coroa, vê a mola guardar energia, o trem de engrenagens girar e o escape fazer o tic-tac. Pode abrir a vista explodida para separar as peças e tocar em cada uma para saber o que ela faz.

## Mecânica
- Arrastar a coroa dá corda (barra de reserva de marcha).
- Velocidade normal ou câmera lenta.
- Slider "Abrir": vista explodida das camadas.
- Tocar numa peça mostra nome e função.
- Puxar a coroa para acertar a hora.

## Passos guiados (4)
1. Dê corda
2. Veja a energia passar
3. Abra o mecanismo
4. Conheça cada peça
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Movimento de relógio mecânico em macro: platina com perlage, pontes com côtes de Genève, rubis vermelhos, roda de balanço oscilando, engrenagens douradas e parafusos de aço azulado, caixa de aço polida e fundo escuro aveludado com reflexos. Luz e cor: estúdio de produto com luz-chave e luz de contorno, reflexos ricos; aço, ouro rosé, rubi e azul. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: mostrador minimalista: painéis escuros com fios finos e índices, botões como coroa canelada. Tipografia: Cormorant + Inter. Barra de navegação de demonstração (escondida em `?embed=1`), título "Veja o tempo por dentro." com frase de apoio, dock com botões "Dar corda", "Câmera lenta", "Vista explodida", "Peças" e "Acertar hora", botão de ação "Ver coleção" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Tic-tac do escape a 6 batidas por segundo (21.600 alternâncias por hora), catraca da corda, reverberação curta.

## Sistemas específicos
- Engrenagens com razões reais (barrilete → centro → terceira → quarta → escape) e dentes gerados proceduralmente com ExtrudeGeometry.
- Balanço harmônico com o escape sincronizado; energia da mola decrescendo.
- Vista explodida por interpolação ao longo do eixo.
- Metais com envMap forte; na Alta, AO e bloom contidos.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `relogio-aberto.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Relojoaria Ponteiro Fino" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_relogio-aberto_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
