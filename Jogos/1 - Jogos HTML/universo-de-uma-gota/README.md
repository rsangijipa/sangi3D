# Universo de uma Gota 2.0 — Laboratório de Vida Microscópica

Laboratório virtual de microbiologia na plataforma Sangi3D para explorar 20 formas de vida microscópica em 10 amostras virtuais de água e microambientes, com organismos 3D deformáveis, 5 modalidades ópticas, anatomia celular interativa, física de fluidos em microescala, ferramentas científicas e diário persistente.

## Abrir

Na raiz do repositório, rode `node Sistema/launcher/server.mjs` e abra **Universo de uma Gota** pelo catálogo Sangi3D. Requer navegador com WebGL 2. Os módulos Three.js e Sangi3D são servidos localmente pelo próprio repositório (funcionamento offline).

## Modos e controles

- **Percurso guiado**: escolha uma amostra virtual, passe pela bancada, localize um organismo e refine o foco. Abra o diário para salvar uma observação local. Use **Sair do percurso** para voltar à observação livre a qualquer momento.
- **Observação**: escolha a amostra (10 lâminas), modalidade óptica (Campo escuro, Campo claro, Contraste de fase, DIC, Fluorescência simulada), objetiva (`4×` a `100×`), zoom fino, foco `Z` (µm) e iluminação. Deposite 5 tipos de recursos alimentares e acompanhe organismos.
- **Anatomia**: isole o organismo selecionado, ajuste a transparência da membrana, rotacione em 3D e destaque organelas compatíveis com distinção entre observação óptica e visualização didática.
- **Ecossistema**: ajuste temperatura, luminosidade, corrente, oxigênio, salinidade, pH e velocidade temporal didática (`0×` a `10×`) com gráficos em tempo real.
- **Ferramentas**: régua microscópica (µm), marcadores científicos, trajetórias, grade calibrada de 40 µm, contagem no campo e empilhamento de foco (focus stacking).
- **Bancada 3D**: estação opcional para pipetar a gota, posicionar lamínula e montar a lâmina no microscópio.
- **Diário e Fotografia**: captura PNG limpa ou com barra de escala, gravação WebM (quando suportada) e álbum persistente em IndexedDB com exportação JSON.
- **Descoberta**: 10 atividades opcionais de exploração científica sem cronômetros ou punições.

**Salvar registro** guarda a cena e a anotação no diário. Para baixar uma imagem, use **Fotografar** ou **Foto com escala**.

## Modelo e validação científica

A escala usa a convenção de `40 µm` por unidade virtual. A física em microescala adota arrasto viscoso dominante, campo vetorial 2D/3D de fluido, movimento browniano e separação espacial O(n). Modalidades ópticas, fluorescência e ciclos reprodutivos acelerados são aproximações computacionais educativas e não substituem um microscópio real ou diagnóstico laboratorial.

## Verificação

Na raiz do repositório:
- Testes unitários e de ecossistema: `node --test "Jogos/1 - Jogos HTML/universo-de-uma-gota/simulation.test.mjs" "Jogos/1 - Jogos HTML/universo-de-uma-gota/tests/organisms.test.mjs" "Jogos/1 - Jogos HTML/universo-de-uma-gota/tests/ecosystem.test.mjs"`
- Teste de navegador (Chromium + Playwright): `node "Jogos/1 - Jogos HTML/universo-de-uma-gota/tests/browser.test.mjs"`
- Para gerar capturas no teste de navegador, defina `SANGI_GOTA_CAPTURES` com a pasta de saída desejada.
