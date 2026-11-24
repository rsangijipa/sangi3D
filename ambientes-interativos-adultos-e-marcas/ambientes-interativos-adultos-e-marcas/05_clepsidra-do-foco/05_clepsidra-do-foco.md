# 05. Clepsidra do Foco

**Conceito.** Um relógio de água de vidro e latão para blocos de foco. O visitante escolhe a duração e abre a válvula: a água cai de uma câmara para outra, gira uma roda d'água e engrenagens, e uma boia sobe numa escala gravada. Ao fim, toca um sino suave e a peça vira para a pausa. O tempo fica visível, sem contagem regressiva estressante.

**Grupo:** Psicologia e bem-estar (adultos) · **Onde usar:** psicologia (TDAH adulto, ansiedade), coworkings, cursos · **Público:** adultos
**Passos:** Escolha o tempo → Abra a válvula → Foque → Pausa · **Marca fictícia do mockup:** Coworking Maré

---

## Mockup 1 de 3: página inicial (desktop)
```
Crie uma imagem 16:9, em alta resolução, que seja o mockup de uma página de site com um ambiente 3D interativo em destaque (seção principal), para a marca fictícia "Coworking Maré" (psicologia (TDAH adulto, ansiedade), coworkings, cursos).

CENA 3D (ocupa a tela inteira, atrás da interface):
Clepsidra de bancada com três câmaras de vidro, água azul translúcida, canos de latão, roda d'água de madeira, engrenagens expostas, boia com ponteiro numa escala gravada, tampo de pedra clara, plantas e luz clara de estúdio. Luz e cor: manhã clara de estúdio; latão, vidro, água azul, madeira clara e pedra.

NÍVEL DE REALISMO:
Render 3D em tempo real com aparência de "miniatura premium fotorrealista": materiais PBR (madeira com veio, metal escovado, vidro com reflexo, tecido com trama), luz motivada com sombras suaves de contato, tonemapping cinematográfico e leve profundidade de campo no fundo. NÃO é cartoon plano, low-poly, ilustração 2D nem fotografia real. Sem pessoas fotorrealistas identificáveis e sem logotipos ou marcas reais (só a marca fictícia citada).

INTERFACE SOBREPOSTA (estilo mostradores de latão e vidro, painéis claros com linhas gravadas finas):
- Barra de navegação fina e translúcida no topo: o logotipo em texto "Coworking Maré" à esquerda; os links "Início", "Serviços", "Sobre" e "Contato"; e o botão de destaque "Conhecer planos" à direita.
- À esquerda, sobre a cena: o título grande "Foco no ritmo da água.", uma frase de apoio curta e um cartão pequeno de passos com "1 · Escolha o tempo" destacado e os outros 3 passos em tom suave.
- Na base, centralizado: um dock flutuante com botões "15 min", "25 min", "45 min", "Abrir válvula", "Pausar" e o botão de som.
- Um selo pequeno "Toque e experimente" perto do objeto principal.
Tipografia no espírito de Cinzel (pouco) + IBM Plex Sans. Rótulos curtos em português do Brasil, legíveis e com alto contraste.

Atmosfera convidativa, sofisticada e calma. Sem marcas d'água e sem logotipos reais.
```

## Mockup 2 de 3: momento de interação (desktop)
```
Agora gere a mesma cena, mesma luz, mesma paleta e mesma interface, em 16:9, mostrando o momento de interação: a água caindo em fio da câmara superior, girando a roda d'água e as engrenagens, o nível subindo até a metade da câmara inferior e a boia marcando o meio da escala, com bolhas e reflexos. Mostre também um cartão "Foque" com a escala de água (só marcas, sem números grandes) e os botões "Pausar" e "Encerrar". O cartão de passos agora destaca "Foque".
```

## Mockup 3 de 3: celular
```
Agora gere a mesma página adaptada para celular, em formato retrato 9:19,5: barra do topo só com o logotipo, um ícone de menu e o botão "Conhecer planos" compacto; a cena reenquadrada com o objeto principal no centro da metade superior; o título "Foco no ritmo da água." menor; o dock vira uma barra inferior com botões grandes e fáceis de tocar, rolável na horizontal se precisar; e o cartão do momento de interação aparece como uma folha inferior curta acima do dock.
```

> Cole as 3 mensagens na mesma conversa do ChatGPT, em sequência. Para outro cliente, troque o nome da marca, o botão e as cores no primeiro prompt.

---

## Prompt de implementação
```
Você é um desenvolvedor sênior de experiências 3D para web (Three.js) e vai implementar o ambiente interativo **"Clepsidra do Foco"** (Psicologia e bem-estar (adultos); público: adultos). Ele precisa funcionar como **seção principal de um site** e ser reaproveitado por marcas diferentes (psicologia (TDAH adulto, ansiedade), coworkings, cursos). Anexei os 3 mockups aprovados (referência visual primária: preserve paleta, enquadramento, materiais e interface) e o arquivo `oficina-do-ritmo.html` como referência de nível 3D e de código.

## Conceito
Um relógio de água de vidro e latão para blocos de foco. O visitante escolhe a duração e abre a válvula: a água cai de uma câmara para outra, gira uma roda d'água e engrenagens, e uma boia sobe numa escala gravada. Ao fim, toca um sino suave e a peça vira para a pausa. O tempo fica visível, sem contagem regressiva estressante.

## Mecânica
- Escolher 15, 25 ou 45 minutos.
- "Abrir válvula" inicia; "Pausar" fecha a válvula.
- Ao fim, sino suave e convite para uma pausa curta (a clepsidra vira).
- Os blocos do dia aparecem como marquinhas no tubo.

## Passos guiados (4)
1. Escolha o tempo
2. Abra a válvula
3. Foque
4. Pausa
Mostre os passos num cartão discreto que se recolhe; o visitante pode ignorar e explorar livre.

## Cena
Clepsidra de bancada com três câmaras de vidro, água azul translúcida, canos de latão, roda d'água de madeira, engrenagens expostas, boia com ponteiro numa escala gravada, tampo de pedra clara, plantas e luz clara de estúdio. Luz e cor: manhã clara de estúdio; latão, vidro, água azul, madeira clara e pedra. Monte cada objeto principal como peça própria, com pivô correto e nome semântico.

## Interface
Estilo: mostradores de latão e vidro, painéis claros com linhas gravadas finas. Tipografia: Cinzel (pouco) + IBM Plex Sans. Barra de navegação de demonstração (escondida em `?embed=1`), título "Foco no ritmo da água." com frase de apoio, dock com botões "15 min", "25 min", "45 min", "Abrir válvula", "Pausar" e o botão de som, botão de ação "Conhecer planos" sempre visível e um modal "Sobre esta experiência" com os créditos e a explicação de privacidade.

## Áudio
Fio de água contínuo e baixo, tique das engrenagens, sino ao fim. Opção de silêncio total.

## Sistemas específicos
- Nível do líquido por shader (corte por altura) com superfície ondulando.
- Fio de água por faixa com ruído animado.
- Engrenagens com razão de transmissão real, velocidade derivada da vazão.
- Tempo medido pelo relógio do sistema (continua certo com a aba em segundo plano); notificação opcional, só com permissão.

## Cuidados
Sem ranking de produtividade; a pausa é valorizada tanto quanto o foco.

## Padrão técnico (mesmo nível da série; use `oficina-do-ritmo.html` como referência de acabamento)
- **Um único arquivo** `clepsidra-do-foco.html`, sem build, que funciona sozinho e também **embutido** num site: `?embed=1` esconde a barra de navegação de demonstração e deixa só a cena, o título e o dock; ao clicar no botão de ação, envia `postMessage({tipo:'cta'})` para a página-mãe e abre o link configurado.
- **Re-skin por configuração:** no topo do script, um objeto `MARCA` com `nome`, `logoTexto`, `cores` (primária, secundária, fundo, texto, destaque), `fontes` (título e texto), `cta` (texto e link), `textos` (título, frase de apoio, passos) e os catálogos do recurso. Trocar `MARCA` muda a interface **e** os acentos dos materiais 3D (tecidos, vernizes, luzes de destaque), sem mexer no código. Inclua dois presets prontos: o da marca fictícia "Coworking Maré" e um preset neutro.
- **Three.js r160 por import dinâmico** a partir de um importmap (URLs num só bloco, trocáveis por `./vendor/` para uso offline). Se o import ou o WebGL falhar, mostrar uma imagem estática da cena com os controles 2D essenciais e o botão de ação.
- **Render:** `SRGBColorSpace`, `ACESFilmicToneMapping` (exposição ≈ 0,95–1,0), envMap `RoomEnvironment` via PMREM com `envMapIntensity ≈ 0,45`, hemisférica baixa, **uma luz-chave motivada** com sombras `PCFSoftShadowMap` (e paredes/objetos que projetam a mancha de luz quando houver janela), 1–2 luzes de acento, `FogExp2` leve, sombras de contato falsas sob os objetos.
- **Materiais e geometria:** texturas procedurais em `CanvasTexture`, peças chanfradas (`RoundedBoxGeometry`, `LatheGeometry` com perfil arredondado, `ExtrudeGeometry` com bevel), detalhes secundários, `InstancedMesh` para repetições.
- **Qualidade Alta / Equilibrada / Leve** (detecção + troca manual), bloom contido só na Alta, **render sob demanda**, meta < 150 draw calls e 30 fps no celular.
- **Câmera:** `OrbitControls` com limites e amortecimento; `camera.setViewOffset` para centralizar a cena fora da área do título (desktop) e acima do dock (celular).
- **Interação:** hitboxes invisíveis generosas, toque só conta sem arrasto, atalhos de teclado, todo controle 3D com botão equivalente no dock e anúncio em `aria-live`. Alvo de toque ≥ 48 px, foco visível, `prefers-reduced-motion` respeitado.
- **Áudio seguro:** Web Audio procedural (sem arquivos externos), começa só depois do primeiro toque, botão de som sempre visível, teto de ganho (≈ −24 dBFS), limitador e polifonia limitada.
- **Privacidade:** nenhum rastreamento ou analytics, nenhum dado pessoal coletado; só preferências em `localStorage` (`amb3d_clepsidra-do-foco_v1`). Imagens geradas pelo visitante ficam no aparelho até ele baixar.
- **Autoverificação:** `SCENE_MANIFEST` (id, pos, rot, scale, material, função) com `console.assert` de cada id, e log de triângulos e draw calls.

## Entrega e aceite
Entregue o `.html`, a lista de chaves do objeto `MARCA` com um exemplo preenchido e 3 capturas no enquadramento dos mockups (desktop inicial, desktop no momento de interação, celular). Confirme: sem erros no console; todos os controles funcionam pelo 3D, pelo dock e pelo teclado; o re-skin troca cores, textos e acentos 3D; `?embed=1` funciona; a qualidade Leve fica fluida no celular; nenhuma requisição de rede além das bibliotecas e das fontes.
```
