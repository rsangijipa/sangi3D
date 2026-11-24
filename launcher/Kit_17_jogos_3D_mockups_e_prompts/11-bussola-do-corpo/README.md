# Bússola do Corpo

Um mapa corporal voluntário em um observatório noturno. O jogo oferece um exemplo fictício e três modos de sessão. Durante a atividade, a pessoa pode marcar regiões na figura ou na lista, usar símbolos e palavras próprias e indicar uma intensidade opcional. Os pontos podem ser editados, removidos ou descartados ao sair.

## Jogar

No Windows, abra [Jogar.cmd](Jogar.cmd). O script serve o build em uma porta local e abre o navegador padrão. Também é possível iniciar pelo terminal com `node scripts/serve.mjs` e abrir o endereço exibido. O build estático em `dist/` pode ser hospedado em um subdiretório, servido por HTTP ou HTTPS.

| Comando | Função |
| --- | --- |
| `npm ci` | Instala as versões do lockfile para edição e testes. |
| `npm run dev` | Abre o servidor Vite para desenvolvimento. |
| `npm run build` | Verifica TypeScript e gera `dist/`. |
| `npm run preview` | Serve o build usando o Vite. |
| `npm test` | Executa os testes de regras e transições. |
| `npm run test:browser` | Testa o build no Chromium com Playwright. Use `BUSSOLA_CHROME` para escolher outro executável. |
| `npm run models` | Regenera os modelos GLB locais e o manifesto. |

Os scripts de desenvolvimento usam Node.js 24 ou posterior. O Chrome instalado no Windows é detectado pelos scripts de navegador. Em outros sistemas, instale o Chromium do Playwright ou informe o caminho do executável.

## Controles e privacidade

- **Figura** · toque ou clique para selecionar uma região. Use **Ver frente** e **Ver costas** para mudar o lado. A lista oferece as mesmas escolhas.
- **Símbolos** · use toque, clique, Tab ou setas. Enter confirma o botão focado. O símbolo selecionado tem contorno e seu nome aparece no painel.
- **Sessão** · Esc abre a pausa ou fecha o painel atual. H recolhe a Barra Imersiva. O som é opcional e começa após um gesto em **Ligar som**.
- **Ajustes** · há três níveis de renderização, três condições de luz, controle de volume e modo acessível. Se o WebGL for interrompido, o rascunho continua disponível pelas listas. O endereço aceita `?acessivel=1` para começar diretamente nesse modo.
- **Registro** · o rascunho fica em memória. O botão **Registrar neste dispositivo** pede confirmação antes de gravar no navegador. É possível apagar esse registro pelo jogo. A exportação JSON também pede confirmação. O jogo usa “Apenas descrição. O significado é de quem cria.”

## Arquitetura e integração

`game/` concentra dados, regras e reducer. `scene/` contém a figura implícita, os proxies não sobrepostos, o observatório procedural e o núcleo de renderização. `input/`, `ui/` e `audio/` ligam os gestos, a interface e o som ao estado da sessão. A imagem de briefing fica fora do build.

- `dist/launcher.html` oferece a entrada independente. Para um Launcher do mesmo host, publique `dist/` sob uma rota própria, aponte o card para a pasta e acrescente `?launcher=1` para o botão **Ambientes** retornar à raiz do host.
- Em um iframe da mesma origem, acrescente `?embed=1`. O jogo emite `ready`, `pause`, `resume`, `complete`, `exit` e `summary` com `{ source: "bussola-do-corpo", version: 1, event }`. O resumo inclui contagem de pontos, duração ativa, pausas e indicador de mapa fictício.
- Para pausar ou retomar via host, envie `{ source: "ambientes", version: 1, event: "pause" }` ou `event: "resume"`, usando a origem do jogo como destino. O jogo valida a origem e a janela pai.
- O [manifesto](assets/manifest.json) descreve os modelos GLB e a textura de papel. Os [créditos](assets/credits.md) registram a proveniência.

Veja o [relatório de verificação](VERIFICACAO.md) e a [comparação visual](design-qa.md).

