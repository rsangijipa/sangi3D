# 13. Trem de Engrenagens

**Conceito.** Uma placa perfurada com eixos, onde o visitante encaixa engrenagens de tamanhos diferentes para levar o movimento de uma manivela até um objetivo: girar um moinho, subir uma bandeira ou tocar um sino. Ele vê na hora a relação de transmissão: a engrenagem grande gira devagar e com força, a pequena gira rápido.

**Grupo:** Mecânica das coisas · **Onde usar:** escolas maker, engenharia, indústria, museus de ciência · **Público:** todas as idades
**Passos:** Encaixe as engrenagens → Gire a manivela → Observe a velocidade → Alcance o objetivo · **Marca fictícia do mockup:** Escola Maker Faísca

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Escola Maker Faísca" (escolas maker, engenharia, indústria, museus de ciência).

CENA 3D (ocupa a tela inteira, atrás da interface):
Placa de madeira com furos em grade, engrenagens coloridas de acrílico translúcido e de latão, manivela à esquerda, um pequeno moinho, uma bandeira e um sino à direita, e uma oficina clara ao fundo. Luz e cor: luz clara de estúdio com sombras coloridas das engrenagens translúcidas; madeira, acrílico laranja, azul e verde, latão.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo régua e esquadro: painéis brancos com grade técnica e cotas finas, botões como etiquetas técnicas):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Escola Maker Faísca" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Inscreva-se" à direita.
- À esquerda, sobre a cena: o título grande "Faça girar.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Encaixe as engrenagens" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "Engrenagens", "Manivela", "Correia", "Mostrar rpm", "Desafios" e "Limpar".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Archivo + JetBrains Mono. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: um trem de quatro engrenagens girando, com setas finas indicando os sentidos alternados, a última movendo o moinho e sombras coloridas projetadas na placa. Mostre também um cartão "Observe a velocidade" com rpm de entrada e de saída e o texto "Relação 1 : 3". O cartão de passos agora destaca "Observe a velocidade".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Inscreva-se" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Faça girar." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Trem de Engrenagens"** (Mecânica das coisas; público: todas as idades). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (escolas maker, engenharia, indústria, museus de ciência). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma placa perfurada com eixos, onde o visitante encaixa engrenagens de tamanhos diferentes para levar o movimento de uma manivela até um objetivo: girar um moinho, subir uma bandeira ou tocar um sino. Ele vê na hora a relação de transmissão: a engrenagem grande gira devagar e com força, a pequena gira rápido.

## Mecânica
- Arrastar engrenagens (8, 12, 16, 24 e 32 dentes) para os eixos.
- Acoplamento automático quando os dentes se encontram.
- Manivela de entrada; indicadores de rotação e sentido.
- Correias opcionais e desafios.

## Passos guiados (4)
1. Encaixe as engrenagens
2. Gire a manivela
3. Observe a velocidade
4. Alcance o objetivo
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Placa de madeira com furos em grade, engrenagens coloridas de acrílico translúcido e de latão, manivela à esquerda, um pequeno moinho, uma bandeira e um sino à direita, e uma oficina clara ao fundo. Luz e cor: luz clara de estúdio com sombras coloridas das engrenagens translúcidas; madeira, acrílico laranja, azul e verde, latão. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: régua e esquadro: painéis brancos com grade técnica e cotas finas, botões como etiquetas técnicas. Tipografia: Archivo + JetBrains Mono. Barra de navegação de demonstração (escondida em `?embed=1`), título "Faça girar." com frase de apoio, dock com botões "Engrenagens", "Manivela", "Correia", "Mostrar rpm", "Desafios" e "Limpar", botão de ação "Inscreva-se" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Zumbido de engrenagens proporcional à rotação, clique de encaixe, sino ao alcançar o objetivo.

## Sistemas específicos
- Grafo de acoplamento (distância entre eixos = soma dos raios primitivos) e propagação da velocidade angular com sinal.
- Engrenagens procedurais com módulo comum.
- Detecção de travamento (ciclo com número ímpar de engrenagens) com aviso visual.
- Sem motor de física pesado.

## Cuidados
Nenhum cuidado especial.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `trem-de-engrenagens.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Escola Maker Faísca" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_trem-de-engrenagens_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
