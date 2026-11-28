# 09 · BÚSSOLA DO CORPO — Plano de execução
Porte **M** · Onda 2 · 6+ e adultos · Emoções e autorregulação

## 1. Tese
**Sensações corporais ganham vocabulário quando são nomeadas, localizadas e dosadas por quem as sente.** A pessoa escolhe uma região, uma sensação, uma intensidade e as próprias palavras — sem que o app diga o que significa.
- Âncoras: interocepção (Craig, 2002); *focusing* e "sentido sentido" (Gendlin, 1978) e *continuum de consciência* (Gestalt) como forma de convite; mapas corporais de emoção (Nummenmaa et al., 2014) **apenas como inspiração do formato — nenhum mapeamento pré-definido é usado**.
- **Não afirma:** que determinada sensação "é" determinada emoção; nenhuma interpretação automática; nenhuma norma de intensidade.
- **Cuidado central:** atenção ao corpo pode ser aversiva para algumas pessoas (p.ex. histórias de trauma). Por isso o recurso nasce com **saídas explícitas** (ver §8).

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Observatório corporal circular**: plataforma de calcário, sala acolhedora de luz difusa |
| Verbo | **Sentir e nomear** a região |
| Assinatura técnica | **Corpo de vidro fosco** (transmissão moderada + fresnel suave) + **partículas-sensação** cujo movimento é escolhido pelo usuário + **camada-fantasma** para comparar dois momentos |
| Chrome | **Anel finíssimo**, quase sem moldura; sem cartões pesados; lavanda discreta |
| Tipografia | Albert Sans leve + Newsreader itálico (palavras do usuário) |
| Luz/grade | Quente neutra, marfim/areia, lavanda mínima |
| Áudio | Ambiente opcional, **silêncio por padrão**; leitura sob demanda |
| Artefato | "Momento" (mapa de sensações salvo) + comparação de dois momentos |
| **Não pode parecer** | Anatomia médica; escaner de saúde; painel clínico |

## 3. Jornada
1. Chega à sala em silêncio; a silhueta **neutra e sem marcadores de gênero** gira devagar (ou fica parada).
2. Escolhe uma **região** (toque na silhueta ou lista).
3. Escolhe uma sensação do **anel de oito ícones** — *pressão · formigamento · calor · frescor · aperto · leveza · pulsação · vazio* — ou digita **outra palavra**.
4. Ajusta a **intensidade** num *dimmer* (0–10, sem "bom/ruim") e marca *confortável · desconfortável · sem sensação*.
5. Compara **dois momentos** (camada transparente) e salva.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `plataforma` | (0,0,0) r=3,5 | calcário 0,85 |
| `silhueta` | (0,0,0) h=2,8 | **monumental e não anatômica**; segmentos: cabeça, tronco, braços, mãos, pernas, pés; roughness 0,4 |
| `anel_icones` | r=3,2, y=1,2 | oito ícones flutuantes (um por sensação) |
| `paineis_semicirculo` | atrás | informativos; **sem obstruir** a figura |
| `marcadores` | sobre a silhueta | emissivos suaves, **sem flashes** |
Câmera FOV 37°, (6,4.5,10)→(0,2.2,0). **Mapa abstrato** alternativo (campo de formas concêntricas) sem figura humana.

## 5. Sistemas
- **Picking por malha segmentada**; marcador projetado em coordenada de mundo/UV.
- **Partículas-sensação:** 8 "movimentos" (pulso, vibração, fluxo, ponto fixo, nó, brisa, ondulação, vazio) escolhidos por ícone; velocidade ligada à intensidade — **e o usuário vê e muda o mapeamento**.
- **Comparação:** dois *snapshots* sobrepostos em transparência ajustável.
- **Persistência com privacidade:** `momentos.json`; retenção escolhida; apagar tudo.
- **Acessibilidade:** lista de regiões com `aria` ("mão direita — formigamento, intensidade 3").

## 6. Interface, bordas e ilustrações
- **Anel de ícones** feitos como **linhas únicas** (um traço contínuo por sensação), sem preenchimento.
- Moldura: um **círculo hairline** em torno do painel, sem sombra pesada; cores sempre com texto.
- Mapa abstrato como **ilustração generativa** (formas concêntricas) em vez de corpo.
- Textos de convite curtos, em **tom de experimento** ("Se quiser, repare no que acontece na sua mão").

## 7. Áudio
Silêncio por padrão; ambiente (ar leve) opcional; **leitura em voz** dos convites sob demanda, com velocidade ajustável.

## 8. Acessibilidade, conforto, ética (centrais aqui)
- **Saídas sempre visíveis:** *Pular esta região* · *Prefiro não olhar para o corpo agora* (troca para o **mapa abstrato**) · *Olhar para o ambiente* (a câmera se afasta para a sala) · *Sair*.
- Nunca usa o termo "corpo errado", "tensão ruim", "emoção".
- Sem comparação com normas; sem "resumo emocional".
- Crianças 6+: vocabulário simples e ícones; adulto vê o registro.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, 8 sensações, vocabulário, saídas | Aprovado por você (prioridade) |
| **E1** Blocking | Plataforma, silhueta segmentada, anel | Validador; captura |
| **E2** Hero | Silhueta de vidro segmentada, 8 ícones, painéis | Segmentos pickáveis; GLB; estados idle/hover/selected/active |
| **E3** Luz + assinatura | Vidro fosco, partículas-sensação, camada-fantasma | Fantasma e atual distinguíveis |
| **E4** Mecânica | Região→sensação→intensidade→palavras→conforto; comparar | Vitest: persistência; selecionar via lista = via 3D |
| **E5** Interface | Anel, círculo hairline, mapa abstrato | Contraste; teclado |
| **E6** Áudio | Ambiente + leitura | Nada toca sozinho |
| **E7** Segurança | Saídas, retenção, anônimo, render sob demanda | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Material translúcido caro (tier: opaco fosco) · figura humana pode incomodar → mapa abstrato desde o início · interpretação de cor/intensidade pelo usuário final (deixar explícito que **é dele**).
