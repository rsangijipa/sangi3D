# 10 · METEOROLOGIA DAS EMOÇÕES — Plano de execução
Porte **L** · Onda 2 · 4+ e adultos · Emoções e autorregulação

## 1. Tese
**Dar nome e forma ao estado de agora ajuda a olhar para ele de fora.** A pessoa compõe um clima (sol, nuvem, chuva, vento) como metáfora — e pode criar um clima *impossível*, porque a metáfora é dela.
- Âncoras: **rotulagem de afeto** (Lieberman et al., 2007); granularidade emocional (Barrett); externalização (White & Epston, 1990); a metáfora ACT do **céu e do tempo** ("eu sou o céu; pensamentos e emoções são o clima", Hayes e col.).
- **Não afirma:** que chuva = tristeza, sol = alegria, vento = ansiedade. Nenhum mapeamento fixo; **sem leitura automática**.
- **Diferença do Jardim dos Ciclos:** lá é botânica; aqui o **clima é o espetáculo** e a estufa é só o mirante.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Estufa geodésica de vidro e cobre** como observatório de clima |
| Verbo | **Compor o clima** |
| Assinatura técnica | **Céu, nuvem, chuva e vento paramétricos** (shader de nuvem *dithered* + partículas instanciadas + **raios de luz volumétricos** falsos) interpolados suavemente |
| Chrome | **Instrumentos de cobre** (mostradores) e **prancha botânica** científica |
| Tipografia | Crimson Pro + Overpass Mono |
| Luz/grade | **Dirigida pelo clima** (azul/cinza das nuvens ↔ ouro do sol); vidro e cobre |
| Áudio-assinatura | Vento, chuva e folhas em **canais separados**; **sem trovoada** |
| Artefato | "Boletim" (clima + narração do motivo) e "diário do tempo" |
| **Não pode parecer** | Jardim dos Ciclos; Santuário; Casa da Árvore |

## 3. Jornada
1. Entra na estufa com **céu neutro**. Quatro colunas de cobre ao redor (sol, nuvem, chuva, vento).
2. Gira o **dial** de cada coluna (nada → um pouco → bastante); o céu responde em 2–4 s.
3. **Narra o motivo** ("hoje parece…") por texto ou áudio local opcional.
4. **Registra** o boletim; mais tarde, **reconstrói** um boletim anterior ou compara.
5. Pode fazer clima **impossível** (chuva sem nuvem, sol à noite) **sem aviso de erro**.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `cupula` | (0,0,0) topo y=7,5 | **varetas de cobre** em geodésica, vidro com reflexos seletivos |
| `jardim_circular` | r=5 | piso de pedra e grama |
| `ilha_riacho` | (0,0,0) | grama + riacho |
| `coluna_sol`, `coluna_nuvem`, `coluna_chuva`, `coluna_vento` | quadrantes X/Z=±3 | controle + **mostrador de cobre** |
| `banco` | (−3,0,1) | madeira |
| `arvore_pequena` | (2,0,−2) | folhas com translucidez simulada |
| `nuvens`, `sol_disco`, `plumas_vento`, `cartoes_metaforas` | interior da cúpula | nuvens **low-poly suavizadas / volumetria falsa** |
Câmera FOV 40°, (10,7,13)→(0,2,0). Folha de **cartões de metáforas** (convites).

## 5. Sistemas
- **`ClimaState {sol, nuvem, chuva, vento}`** 0–1 → céu (`createSky`/`lerpSky`), nuvens (shader), chuva (partículas instanciadas), vento (shader nas folhas) + luz.
- **Transições** com easing lento; **opção reduzir movimento** = salto suave sem partículas.
- **Diário:** lista de `{estado, motivo, quando?}`; "**reconstruir**" aplica o estado antigo; "**comparar**" mostra dois mini-boletins lado a lado.
- **Orçamento:** nuvens sem raymarch pesado (planos *dithered* + ruído), chuva instanciada com teto de partículas por tier.

## 6. Interface, bordas e ilustrações
- **Mostradores de cobre** em SVG (agulha, escala sem números clínicos; "nada · um pouco · bastante").
- **Prancha botânica:** moldura de papel de herbário com **ilustrações científicas** (folha, gota, nuvem, rajada) feitas em SVG de linha.
- **Boletim:** cartão de "estação meteorológica" com símbolos desenhados (não ícones de app de previsão).
- Modo infantil (4+): **4 botões grandes** com desenhos e três níveis.

## 7. Áudio
Vento (filtro com variação lenta), chuva (ruído filtrado, densidade por parâmetro), folhas (farfalhar leve). **Ganhos separados**; sem trovão; teto no limitador; ligar/desligar sem estalo.

## 8. Acessibilidade, conforto, ética
- Cada dial tem **teclado e texto**; descrição `aria-live` do clima atual ("céu parcialmente nublado, chuva fraca, vento calmo").
- **Nenhum flash** (nada de relâmpago); luz muda em rampas longas.
- Texto de convite sempre **aberto** ("Se quiser, escolha o clima que combina com agora…").
- Boletins não geram rótulo; ficam privados; sessão anônima.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, metáforas, modo infantil | Aprovado |
| **E1** Blocking | Cúpula, coluna x4, jardim, câmera | Validador; captura |
| **E2** Hero | Cúpula geodésica de cobre, colunas-instrumento, árvore, banco, cartões | GLB; orçamento |
| **E3** Luz + assinatura | Céu/nuvem/chuva/vento paramétricos, raios de luz | Combinações extremas rodam a 60 fps desktop |
| **E4** Mecânica | Dials, narração, diário, reconstruir, comparar | Vitest: interpolação e persistência; efeito visual e lógico |
| **E5** Interface | Mostradores, prancha, boletim | Contraste; teclado |
| **E6** Áudio | 3 canais | Pico ≤ teto |
| **E7** Segurança | Reduzir movimento, baixo desempenho (sem partículas), anônimo | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Vidro com transmissão cara (opaco no tier baixo) · nuvens que parecem "fumaça" (calibrar com capturas) · tentação de rotular clima = emoção (revisão de texto).
