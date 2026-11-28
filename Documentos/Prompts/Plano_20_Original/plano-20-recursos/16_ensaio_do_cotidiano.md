# 16 · ENSAIO DO COTIDIANO — Plano de execução
Porte **XL** · Onda 4 (último) · 5+ e adultos · Habilidades sociais e cotidiano

## 1. Tese
**Antecipar o passo a passo reduz o imprevisto — e o imprevisto também pode ser treinado, aos poucos, sob controle de quem treina.** O supermercado virtual permite preparar a ida, percorrer os corredores, pedir informação, esperar na fila e "pagar" sem valor real, com os estímulos regulados.
- Âncoras: **estrutura visual e previsibilidade** (TEACCH — *o que fazer, quanto, quando termina, o que vem depois*); exposição **graduada** como princípio (sempre com mediação do terapeuta); treino de atividades de vida diária; supermercados virtuais em reabilitação (formato).
- **Não afirma:** terapia de exposição sem acompanhamento; nenhum "nível adequado" de multidão ou ruído; sem diagnóstico, sem tempo-alvo.
- **Controle sensorial é central:** sem multidão nem ruído obrigatórios.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Supermercado contemporâneo modular**: prateleiras brancas, piso cinza-quente, teto difuso |
| Verbo | **Preparar-se e percorrer** |
| Assinatura técnica | **Primeira pessoa / vista elevada** + **lista visual** + **navmesh** + 20 produtos instanciados + **dial sensorial** (densidade e ruído 0–3) + **mudanças configuráveis** |
| Chrome | **Wayfinding**: placas de corredor, setas, **bloco de lista com pictogramas** |
| Tipografia | Lexend (desenhada para leitura) — única família, com pictogramas |
| Luz/grade | Fluorescente difusa simulada por **áreas de luz + AO pré-computado**; cores de produto agrupadas |
| Áudio-assinatura | Refrigeração e murmúrios **muito baixos**; silêncio total opcional |
| Artefato | "Passo a passo da compra" (checklist visual) |
| **Não pode parecer** | Cidade (13); museu/loja de texturas (04) |

## 3. Jornada
1. **Preparar:** escolhe a **lista visual** (pictogramas de 5–7 itens) e o **dial sensorial** (padrão: **zero** pessoas e **zero** ruído).
2. **Entrar** (0,0,7): vista elevada de reconhecimento e depois **primeira pessoa**, ou toque-para-ir.
3. **Localizar** itens nos corredores; os cartazes sobem de cor suave quando perto.
4. **Pedir informação** no balcão (diálogo curto, repetível); **esperar na fila** (curta e configurável).
5. **Finalizar** com ficha simbólica de "pagar" (**sem valores**); fecha o passo a passo.
6. Opcional: **mudança inesperada** configurável (item em falta, corredor interditado, caixa trocado), por níveis.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `entrada` | (0,0,7) | portas automáticas, tapete |
| `corredor_1..4` | X=−7, −2, 3, 8 (eixo Z) | **largura visual ≥ 1,8 m** |
| `checkout` + `esteira` | (8,0,−7) | caixa de papel, esteira |
| `balcao_info` | (−9,0,−7) | atendimento |
| `deposito` | atrás | parcialmente visível |
| `refrigeradores`, `gondolas` | laterais | portas, vidro |
| `produtos` | prateleiras | **20 tipos** reaproveitando modelos-base; **rótulos fictícios** (formas/cores/pictogramas, sem texto) |
| `carrinho`, `cestinha` | entrada | rodízios |
Câmera: **pessoa** FOV 65° altura 1,4–1,65 m (perfil) · **overview** FOV 38° (14,9,18).

## 5. Sistemas
- **Navegação:** *pointer lock* **somente desktop**; **joystick touch** e **toque-para-ir**; colisão por **navmesh/grade**.
- **NPCs** (poucos): rotas curtas, *idle*; densidade 0–3.
- **Instancing:** 1 `InstancedMesh` por tipo de produto; prateleiras *merged*; **oclusão** por corredor.
- **Luz:** `RectAreaLight` poucos + **AO por vértice pré-computado**; sem sombras dinâmicas de muitas fontes.
- **Tarefas como estados:** lista → localizar → balcão → fila → pagar → sair.
- **Mudanças inesperadas** como *regras* (parametrizadas, nunca automáticas).
- **Conforto de movimento:** *head bob* desligado por padrão; FOV ajustável; opção de **somente vista elevada**.

## 6. Interface, bordas e ilustrações
- **Placas de corredor** penduradas (SVG com pictograma + número); setas de wayfinding no piso (decals).
- **Bloco de lista** de papel com pictogramas e **caixinha de marcar**, que também aparece na cena como cartão da mão.
- **Moldura:** barra de **cesto** (alça) na base com status "itens: 3/6".
- Ilustrações: **pictogramas de produto** (fruta, pão, leite, sabonete…) próprios, consistentes, **sem marcas**.

## 7. Áudio
Refrigeração e murmúrio em volume baixo, controles de **densidade** e **ruído** separados; **silêncio total** opcional; **sem sustos e sem anúncios automáticos**.

## 8. Acessibilidade, conforto, ética
- Todo percurso tem **versão em lista** ("Ir para o corredor 2"); alternativa sem 3D de primeira pessoa.
- **Mudanças inesperadas** só quando o terapeuta/usuário liga; níveis nomeados.
- Sem pontuação; "levou X minutos" **só se pedido**.
- Enjoo de movimento: vista elevada e teleporte (toque-para-ir).

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Listas, pictogramas, diálogos do balcão, mudanças e níveis | Aprovado |
| **E1** Blocking | Planta, corredores, checkout, câmeras | Validador; captura; **larguras ≥ 1,8 m** |
| **E2** Hero | Gôndolas, refrigeradores, caixa/esteira, carrinho, 20 produtos | GLB; instancing; orçamento |
| **E3** Luz + assinatura | Luz fluorescente + AO; dial sensorial visual | 60 fps desktop com 4 corredores |
| **E4** Mecânica | Lista, navegação, balcão, fila, pagar, mudanças | Vitest: navmesh sem colisão atravessando; estados de tarefa |
| **E5** Interface | Wayfinding, lista, cesto, pictogramas | Contraste; teclado |
| **E6** Áudio | Refrigeração/murmúrio | Pico ≤ teto; silêncio total funciona |
| **E7** Segurança | Joystick, vista elevada, retenção, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
**Maior escopo da série** (por isso é o último) · desempenho em móvel (instancing + oclusão + AO baked) · enjoo em primeira pessoa · risco de "exposição sem mediação" (documentar uso com terapeuta).
