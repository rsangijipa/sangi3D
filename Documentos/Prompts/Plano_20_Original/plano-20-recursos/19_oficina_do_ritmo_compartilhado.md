# 19 · OFICINA DO RITMO COMPARTILHADO — Plano de execução
Porte **M** · **Onda 1 (piloto)** · 2–6 anos **com cuidador** · Expressão simbólica e narrativa

## 1. Tese
**A relação se constrói em ida e volta: um toca, o outro responde.** A sala de brincar oferece instrumentos suaves para que criança e adulto **alternem turnos**, imitem ou transformem um ritmo curto — sem pontuação e sem exigir fala.
- Âncoras: **"servir e devolver"** (*serve and return* — Center on the Developing Child, Harvard); **musicalidade comunicativa** (Trevarthen & Malloch, 2000); atenção conjunta e alternância de turnos; **seguir a liderança da criança** (Greenspan, Floortime/DIR; Kasari, JASPER); improvisação musical (Nordoff–Robbins) como inspiração.
- **Não afirma:** rastreio, marco de desenvolvimento, eficácia terapêutica; sem escore, sem comparação, sem "acertou".
- **Cuidado:** o recurso é **mediado** — o adulto é parte da cena.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Sala de brincar Montessori**: faia clara, feltro areia, luz de janela alta |
| Verbo | **Alternar turnos sonoros** |
| Assinatura técnica | **Síntese modal** de xilofone/tambores/animais em Web Audio com **limitador, teto de volume e polifonia máxima** + **indicador de vez por formas** + **portão do cuidador** |
| Chrome | **Feltro com pontos de costura** (bordas bordadas), botões de feltro/madeira **grandes** |
| Tipografia | Fredoka (criança, **texto mínimo**) + Mulish (painel do adulto) |
| Luz/grade | Natural suave; azul, amarelo e verde em **baixa saturação** |
| Áudio-assinatura | Sons curtos com **envelopes suaves** (ataque ≥ 8 ms); nunca estridentes |
| Artefato | "Padrões da sessão" (opcional, só para o adulto) |
| **Não pode parecer** | Sala de texturas (04); estúdio (02); brinquedo de TV infantil colorido |

## 3. Jornada
1. Chega à sala; **dois tapetes circulares** no primeiro plano marcam "meu turno" (criança) e "seu turno" (adulto).
2. A criança **toca** um animal, tambor ou lâmina; o **indicador de vez** (círculo azul / quadrado amarelo) passa para o adulto.
3. O adulto **imita** (eco) ou **transforma** (variação) o padrão; o app mostra o padrão como **bolinhas** na mesa.
4. **Pausa** quando quiserem; **objeto quieto** pode ser escolhido como "descanso".
5. **Muda de atividade** (animais → xilofone → tambores → blocos).

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `tapete_feltro` | 5×4 m, centro | microfibra |
| `mesa_baixa` | (0,0,0) 2×1,4 m; y=0,45 | faia, poros, **verniz fosco** |
| `armario_animais` | X=−4 | **animais de madeira com botões musicais** |
| `torre_blocos` | X=3,5 | blocos **arredondados** empilháveis |
| `tapetes_turno_1..3` | 1º plano | circulares, **pontos de interação** |
| `xilofone` | mesa | **8 lâminas**, metal 0,35 |
| `tambor_1`, `tambor_2` | mesa | **macios** |
| `sininhos_visuais`, `bolas_madeira` | prateleira | **grandes**, sem peças pequenas |
| `figuras_turno` | mesa | **formas**, não textos |
Câmera FOV 38°, (7,5.6,9)→(0,0.85,0). **Sem superfícies perfurantes e sem pequenas peças** que sugiram uso inseguro.

## 5. Sistemas
- **Raycast de toque** com hitboxes **muito generosas**.
- **Síntese modal:** xilofone (modos de barra livre ~ 1 : 2,76 : 5,4), tambores (ruído + ressonância), animais (timbres curtos originais).
- **Limitador:** teto padrão baixo (≈ −24 dBFS), **máx. 3 vozes**, rampa de entrada/saída.
- **Turnos:** máquina de estados `criança ⇄ adulto`; **sem cronômetro**; `aguardar` indefinido.
- **Padrões:** sequência de até 4 eventos; **eco** (repete), **variação** (muda altura/duração), **livre**.
- **Feedback visual** e **vibração** apenas por **opt-in** do cuidador.
- **Portão do cuidador:** *segurar 3 s* ou gesto de 2 passos para abrir configurações (alternativa por teclado).

## 6. Interface, bordas e ilustrações
- Moldura de **feltro com costura tracejada** (SVG), cantos arredondados; botões como **almofadinhas de feltro**.
- **Pictogramas de turno:** círculo azul (criança), quadrado amarelo (adulto), estrela verde (junto) — sem texto na criança.
- **Painel do adulto:** Mulish, tamanhos grandes, atrás do portão.
- Ilustração: **animais de madeira** desenhados com contorno suave; sem personagem "mascote".

## 7. Áudio
Sons **originais** e curtos; **envelopes suaves**; ganho master com **teto fixo**; **nunca vários acima do limite**; opção de **volume muito baixo**; legendas visuais (o animal "acende" em vez de texto).

## 8. Acessibilidade, conforto, ética
- **Touch-first**, botões enormes, **sem exigir fala**.
- LGPD **art. 14**: consentimento do responsável; **dados mínimos**; sessão anônima por padrão.
- Sem metas, sem nota, sem "bom/ruim"; linguagem "tocamos juntos".
- Opção **modo silencioso visual** (animação sem som).

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Pictogramas de turno, padrões simples, texto do adulto | Aprovado |
| **E1** Blocking | Sala, mesa, armário, torre, tapetes, câmera | Validador; captura |
| **E2** Hero | Animais, xilofone, tambores, blocos, bolas | GLB; instancing; pivôs |
| **E3** Luz + assinatura | Janela alta, feltro com microfibra, costura | Captura aprovada |
| **E4** Mecânica | Turnos, eco/variação, pausa, quieto, troca de atividade | Vitest: polifonia ≤ 3, teto de ganho, alternância correta |
| **E5** Interface | Feltro/costura, pictogramas, portão | Alvo ≥ 64 px; contraste |
| **E6** Áudio | Síntese modal, limitador | **Medição:** pico ≤ teto em **todas** as combinações |
| **E7** Segurança | Portão do adulto, retenção mínima, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
Volume em fones/alto-falantes diferentes (calibrar com teto + aviso ao adulto) · sons "de brinquedo" irritantes (timbres naturais) · peças pequenas visuais (revisão de segurança visual).

> **Piloto:** valida **áudio seguro, touch-first, portão do adulto e o tom infantil**.
