# 20 · CASA DAS MEMÓRIAS — Plano de execução
Porte **XL** · Onda 4 · adolescentes, adultos e idosos · Expressão simbólica e narrativa

## 1. Tese
**Lembrar é também escolher o que guardar — e o que não mostrar.** A casa dá espaço físico à memória: a pessoa organiza objetos em cômodos, associa histórias e monta uma linha do tempo **sem datas obrigatórias**, com o direito explícito de **omitir**.
- Âncoras: revisão de vida e reminiscência (Butler, 1963); **identidade narrativa** (McAdams, 2001); memória autobiográfica (Conway); o espaço como âncora (método dos *loci*). A evidência de terapias de reminiscência é **modesta e variável** (p.ex. Woods et al., 2018, Cochrane) — por isso o recurso **não promete benefício**.
- **Não afirma:** terapia de luto ou trauma; que lembrar faça bem; interpretação de objetos ou arranjos.
- **Privacidade máxima:** fotos e textos **nunca saem do dispositivo** sem decisão explícita.

## 2. DNA exclusivo
| Campo | Definição |
|---|---|
| Mundo | **Casa-miniatura** em corte (*dollhouse*): sala central, biblioteca à esquerda, ateliê à direita |
| Verbo | **Guardar, omitir, reorganizar** |
| Assinatura técnica | **Cena por cômodo com carregamento sob demanda** + **molduras que recebem fotos locais** + **gaveta de omissões** + **cofre local cifrado** (WebCrypto) |
| Chrome | **Cantoneiras de álbum**, **fitas-marcador**, etiquetas de gaveta |
| Tipografia | Cardo (texto) + Public Sans (interface); **texto ampliável** |
| Luz/grade | Lateral suave, sépia delicada; nogueira clara, creme, verde de plantas |
| Áudio-assinatura | **Silêncio por padrão**; leitura em voz sob pedido |
| Artefato | **A casa organizada** + linha do tempo; exportar só por decisão |
| **Não pode parecer** | Teatro de fantoches (17); galeria de texturas (04); casa da árvore (existente) |

## 3. Jornada
1. Vê a casa em corte (*overview*); **entra** num cômodo (modo livre a 1,5 m) ou fica no corte.
2. **Escolhe objetos** (livro, caixa, álbum, moldura, mala, planta, luminária) e os **coloca** em prateleiras/superfícies (snap).
3. **Associa uma narrativa** a cada objeto (texto, opcional); pode **colocar uma foto local** numa moldura.
4. **Guarda** na gaveta de lembranças, **omite** (gaveta fechada, sem justificativa) ou **reorganiza**.
5. Monta a **linha do tempo** com fitas "antes / depois / ao mesmo tempo", **sem datas**.
6. **Exporta** (ou não), mediante decisão explícita.

## 4. Cena (manifesto)
| ID | Posição | Notas |
|---|---|---|
| `sala_principal` | centro, 7×6 m | sofá bouclé, luminária, álbum aberto (páginas em branco), planta |
| `biblioteca` | X=−6, 5×5 m | **estantes com livros sem títulos**, caixas de lembrança, escrivaninha |
| `atelie_galeria` | X=+6, 5×5 m | **molduras vazias**, objetos em branco, malas |
| `portas_X` | entre cômodos | no eixo X |
| `escada_decorativa` | fundo | |
| `janelas_Z−6` | parede fundo | **paisagem neutra** |
Câmera **overview** FOV 39°, (14,10,17)→(0,1,0); **modo livre** 1,5 m. Materiais: madeira 0,58; papel de bordas finas irregulares; bouclé com normal; couro gasto moderado; vidro seletivo; metal discretamente envelhecido.

## 5. Sistemas
- **Cena por cômodo** (3 *chunks*) com *lazy loading*; apenas o cômodo ativo em qualidade total.
- **Drag-and-drop 3D com snap** em prateleira (slots por prateleira) + alternativa por botões ("Guardar na estante 2").
- **Modelo:** `Objeto { id, tipo, comodo, slot, narrativa?, foto?, estado: guardado|visivel|omitido }`.
- **Linha do tempo:** fitas ordenadas por relação, sem datas.
- **Fotos locais:** carregadas do dispositivo, convertidas em textura e guardadas em IndexedDB; **nunca enviadas**.
- **Cofre cifrado opcional:** senha → PBKDF2 → AES-GCM; **sem recuperação** (avisar). Sincronização com servidor **fora do escopo**; se um dia existir, **só com cifragem no cliente**.
- **Desfazer** em pilha; **exportar** apenas após confirmação em dois passos.

## 6. Interface, bordas e ilustrações
- **Cantoneiras de fotografia** (SVG) nos painéis; **fita-marcador** como indicador de seção.
- **Etiquetas de gaveta** com caligrafia (nunca texto na textura 3D).
- **Ilustrações:** planta baixa da casa em **nanquim** para navegação entre cômodos.
- **Botões grandes**, tipografia **ampliável até 200 %**, alto contraste opcional (idosos).

## 7. Áudio
**Silêncio por padrão**; ambiência leve opcional (relógio distante, folhas); **leitura em voz** dos textos sob pedido.

## 8. Acessibilidade, conforto, ética
- **Omitir sem explicar**; nada é "esquecido por você": a gaveta existe, o app não oferece reabrir de surpresa.
- **Linguagem de convite** ("se quiser, guarde…"); sem lembrete automático de memórias.
- "Ajuda agora" visível; nenhum conteúdo gerado por IA sobre as memórias do usuário.
- Navegação por lista de cômodos e objetos; leitor de tela.

## 9. Etapas
| Etapa | Entrega | Aceite verificável |
|---|---|---|
| **E0** Conteúdo | Convites, vocabulário, textos de privacidade e cofre | **Aprovado por você** |
| **E1** Blocking | 3 cômodos em corte, portas, escada, câmeras | Validador; captura |
| **E2** Hero | Sofá, estantes, álbum, molduras, malas, planta, luminária | GLB; instancing de livros |
| **E3** Luz + assinatura | Luz lateral sépia, molduras com foto local, poeira no feixe | Foto local aparece e **não sai** (teste de rede) |
| **E4** Mecânica | Guardar/omitir/reorganizar, linha do tempo, desfazer, exportar | Vitest: snap/slots; cofre cifra/decifra; **nenhuma requisição de rede** |
| **E5** Interface | Cantoneiras, fitas, planta baixa | Contraste; texto 200 % |
| **E6** Áudio | Ambiência e leitura | Nada toca sozinho |
| **E7** Segurança | Cofre, retenção, sessão anônima, baixo desempenho | axe; 30 fps móvel |
| **E8** Entrega | Capturas, divergências, README | 6 critérios com evidência |

## 10. Riscos
**Perda de senha = perda de dados** (aviso claro) · fotos grandes (redimensionar localmente) · conteúdo emocionalmente pesado (omitir sempre possível; ajuda agora) · escopo de três cenas (carregamento por cômodo).
