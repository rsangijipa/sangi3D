# 02. Mesa dos Objetos que Acalmam

**Conceito.** Uma mesa de nogueira com objetos de escritório que prendem a atenção de forma gentil: um pêndulo de areia que desenha figuras quando empurrado, um berço de Newton, uma ampulheta líquida e uma tigela tibetana. É puramente sensorial e mecânico: ninguém precisa fazer certo. Ao fim, um rastelo alisa a areia e tudo recomeça.

**Grupo:** Psicologia e bem-estar (adultos) · **Onde usar:** psicologia, terapia ocupacional, spas, escritórios · **Público:** adultos
**Passos:** Empurre o pêndulo → Observe o desenho → Alise a areia → Escolha outro objeto · **Marca fictícia do mockup:** Clínica Ponto Quieto

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Clínica Ponto Quieto" (psicologia, terapia ocupacional, spas, escritórios).

CENA 3D (ocupa a tela inteira, atrás da interface):
Mesa de nogueira escura, bandeja redonda de areia fina clara com um pêndulo de latão suspenso num tripé de madeira, berço de Newton cromado, ampulheta de líquido azul e âmbar, tigela tibetana de bronze sobre almofada, luz lateral de fim de tarde entrando por uma persiana. Luz e cor: âmbar lateral com faixas de sombra de persiana; nogueira, areia, latão e bronze.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo papel creme texturizado com cantos arredondados e sombra suave, botões como pedras polidas):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Clínica Ponto Quieto" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Conhecer o espaço" à direita.
- À esquerda, sobre a cena: o título grande "Mexa devagar.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Empurre o pêndulo" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões com ícone "Pêndulo", "Berço de Newton", "Ampulheta", "Tigela" e "Alisar areia".
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Cormorant Garamond + Karla. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: o pêndulo em movimento traçando uma rosácea delicada na areia, com o sulco fazendo sombra fina, câmera próxima e o berço de Newton desfocado ao fundo. Mostre também um cartão "Observe o desenho" com os controles "Força" e "Direção" (uma seta) e o botão "Alisar areia". O cartão de passos agora destaca "Alise a areia".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Conhecer o espaço" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Mexa devagar." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Mesa dos Objetos que Acalmam"** (Psicologia e bem-estar (adultos); público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (psicologia, terapia ocupacional, spas, escritórios). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Uma mesa de nogueira com objetos de escritório que prendem a atenção de forma gentil: um pêndulo de areia que desenha figuras quando empurrado, um berço de Newton, uma ampulheta líquida e uma tigela tibetana. É puramente sensorial e mecânico: ninguém precisa fazer certo. Ao fim, um rastelo alisa a areia e tudo recomeça.

## Mecânica
- Pêndulo: arrastar define direção e força do empurrão; ele desenha curvas (rosáceas, Lissajous) na areia, perdendo energia aos poucos.
- "Alisar areia": um rastelo passa e apaga o desenho.
- Berço de Newton: puxar 1 a 3 esferas e soltar.
- Ampulheta líquida: virar com um toque.
- Tigela: tocar faz soar; arrastar em círculo na borda faz cantar sustentado.

## Passos guiados (4)
1. Empurre o pêndulo
2. Observe o desenho
3. Alise a areia
4. Escolha outro objeto
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Mesa de nogueira escura, bandeja redonda de areia fina clara com um pêndulo de latão suspenso num tripé de madeira, berço de Newton cromado, ampulheta de líquido azul e âmbar, tigela tibetana de bronze sobre almofada, luz lateral de fim de tarde entrando por uma persiana. Luz e cor: âmbar lateral com faixas de sombra de persiana; nogueira, areia, latão e bronze. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: papel creme texturizado com cantos arredondados e sombra suave, botões como pedras polidas. Tipografia: Cormorant Garamond + Karla. Barra de navegação de demonstração (escondida em `?embed=1`), título "Mexa devagar." com frase de apoio, dock com botões com ícone "Pêndulo", "Berço de Newton", "Ampulheta", "Tigela" e "Alisar areia", botão de ação "Conhecer o espaço" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Areia (ruído marrom filtrado proporcional à velocidade), cliques do berço (impacto metálico com variação), tigela (síntese modal com batimentos, sustentada pelo gesto circular), ampulheta (bolhas suaves).

## Sistemas específicos
- Pêndulo como oscilador 2D amortecido (dois osciladores harmônicos com frequências próximas), desenhando num heightmap da areia em CanvasTexture usado como normal/bump map.
- Rastelo apaga o heightmap com animação de passada.
- Berço de Newton por solução analítica de colisões elásticas em sequência (sem motor de física).
- Ampulheta por partículas instanciadas ou shader de fluido simples.
- Tigela: toque = golpe; gesto circular = excitação contínua proporcional à velocidade.

## Cuidados
Sem metas, sem cronômetro, sem pontuação. Respeitar "Reduzir movimento" (o pêndulo pode desenhar em velocidade baixa).

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `mesa-dos-objetos-que-acalmam.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Clínica Ponto Quieto" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_mesa-dos-objetos-que-acalmam_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
