# 12 · ILHA DAS PAUSAS — Plano de execução
Porte **XL** · **Onda 1 (piloto)** · 4+ e adultos · Emoções e autorregulação

## 1. Tese
**Pausar é uma habilidade com repertório: cada pessoa descobre o que a ajuda, e isso muda.** A ilha oferece cinco espaços, cada um com uma forma de pausar; no fim, a pessoa registra o que ajudou.
- Âncoras: modelo de processo da regulação emocional (Gross, 1998: escolha da situação, deslocamento da atenção, modulação da resposta…); **ambientes restauradores** (Kaplan & Kaplan — Teoria da Restauração da Atenção; Ulrich, 1984); respiração lenta **sem retenção**; automonitoramento ("o que ajudou?").
- **Não afirma:** tratamento de ansiedade, mede frequência cardíaca, garante calma. Nenhuma estratégia é "a certa".
- **Diferença do acervo:** é a **única cena de mar com câmera guiada** e **cinco atividades locais** (lago e santuário são contemplativos de um ponto só).

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Ilha costeira** de refúgio, fim de tarde |
| Verbo | **Escolher a pausa** |
| Assinatura técnica | **Câmera em spline** entre 5 pontos de interesse + **farol que "respira"** (luz lenta, opcional) + água com espuma por decal |
| Chrome | **Seixos arredondados** como botões, bordas em **ondas de areia** |
| Tipografia | Quicksand (curta) + Lora (texto longo) |
| Luz/grade | Azul acinzentado, oliva, areia quente, espuma branca; sol baixo |
| Áudio-assinatura | **Ondas e vento em canais independentes** |
| Artefato | **Diário de pausas** (o que ajudou: *ajudou · mais ou menos · não ajudou · não sei*) |
| **Não pode parecer** | Porto (08); arquipélago (18); lago existente |

## 3. Jornada
1. Chegada de **câmera guiada** (curta, pulável) sobre a enseada; a pessoa **escolhe um espaço**.
2. **Farol — respirar:** a luz do farol sobe e desce devagar (padrão ajustável, p.ex. 4 s / 6 s, **sem retenção**); pode ouvir o mar ou desligar.
3. **Chalé — descansar:** rede parada (oscilação opcional), almofadas, luz baixa; silêncio por tempo escolhido, ou sem tempo.
4. **Espaço de movimento — alongar:** uma **garça estilizada** convida a alongar; pode ignorar.
5. **Deck de expressão — desenhar:** papel e lápis virtuais; o traço aparece no papel do deck.
6. **Jardim de escolhas:** cartões neutros de estratégia ("ouvir o mar", "olhar para 5 coisas", "beber água") — escolhe e, depois, **registra o que ajudou**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `ilha` | elíptica 32×22 | areia↔grama por **vertex color** |
| `farol` | (0,0,−12) | baixo, ao norte |
| `chale_descanso` | (−10,0,0) | madeira satin; rede, almofadas |
| `espaco_movimento` | (10,0,0) | gramado aberto; garça |
| `deck_expressao` | (−5,0,8) | mesa, papel e lápis |
| `jardim_escolhas` | (6,0,9) | caminho de pedras com cartões |
| `caminhos` | sinuosos | sem bifurcação confusa |
| `mar` | 10 m ao redor | shader simples + normal; espuma por decal |
| `nuvens`, `arvores_costeiras`, `pedras` | espalhados | estáticas |
Câmera FOV 35°, (33,25,40)→(0,0,0). **Render sob demanda**.

## 5. Sistemas
- **Câmera guiada:** `CatmullRomCurve3` com 5 pontos + transições; **modo livre** (OrbitControls limitado); reduzir movimento = **cortes**.
- **Farol respira:** emissivo/luz com período configurável ≥ 8 s; **sem flashes**; opção de desligar.
- **Atividades** como módulos independentes (respiração, descanso, alongar, desenho, escolhas).
- **Desenho:** `canvas` 2D → textura do deck; salvar PNG local (com consentimento).
- **Diário:** `{ estrategia, data?, ajudou }`; **sem somas** nem "estratégia favorita".
- **Estado:** `pausas.json`.

## 6. Interface, bordas e ilustrações
- Menu em **seixos** (botões grandes, arredondados, textura de pedra lisa); moldura **ondulada de areia** (SVG).
- **Mapa-ilha** ilustrado (nanquim + aquarela) como seletor dos cinco espaços.
- Cartões de estratégia em **papel salgado de praia**, ilustrações de linha (ouvido, olhos, copo).
- Guia de respiração: **anel que expande** (nunca contador de tempo agressivo).

## 7. Áudio
**Ondas e vento em canais separados**; mudo por padrão quando a preferência exigir; sem música obrigatória; legenda sonora "[ondas suaves]".

## 8. Acessibilidade, conforto, ética
- Todos os cinco espaços acessíveis por **lista e teclado**; descrição de cena em texto.
- **Nenhuma retenção** de ar; respiração é **convite**, com saída fácil.
- Criança 4+: menus com **desenho** e poucos cartões; adulto ajusta.
- Sem promessa terapêutica; sem desfecho "você está calmo".

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Textos dos 5 espaços, cartões de estratégia, padrões de respiração | Aprovado |
| **E1** Blocking | Ilha, mar, 5 locais, caminhos, spline | Validador; captura |
| **E2** Hero | Farol, chalé, deck, garça, jardim de pedras, árvores | GLB; orçamento; instancing |
| **E3** Luz + assinatura | Fim de tarde, água, espuma, farol que respira | 60 fps desktop **sob demanda** |
| **E4** Mecânica | Atividades, câmera guiada, desenho, diário | Vitest: spline/POIs; desenho gera PNG; diário persiste |
| **E5** Interface | Seixos, ondas, mapa-ilha | Contraste; teclado |
| **E6** Áudio | Ondas/vento | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho, portão do adulto | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Cena grande em móvel (LOD + sob demanda) · água cara (tier) · garça animada (rig simples, poucos ossos) · tentação de "meta" de respiração (evitar).

> **Piloto:** valida **água, spline de câmera, cena grande sob demanda, módulos de atividade** e o modo infantil.
