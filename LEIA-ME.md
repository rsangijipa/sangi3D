# Ambientes 3D

## Como jogar

Dê dois cliques em **Abrir Launcher.cmd**. O navegador abre com todos os jogos.

- Deixe a janela preta aberta enquanto joga; feche-a para desligar.
- Se o launcher já estiver aberto, o mesmo arquivo só abre o navegador nele de novo.
- Na primeira vez é preciso ter o [Node.js](https://nodejs.org) instalado (versão LTS).

No launcher, use **Explorar** para navegar por categorias e **Lançamentos** para ver ambientes novos e atualizados. No celular, toque em **Menu** dentro do jogo para ver controles e som, e em **Voltar** para retornar ao catálogo.

## Pastas

```
Ambientes 3D/
  Abrir Launcher.cmd        ← abre tudo
  LEIA-ME.md
  Jogos/                    ← todos os jogos, um por pasta
    1 - Jogos HTML/           jogos de um arquivo HTML
    2 - Projetos/             projetos com código-fonte e build próprio
    3 - Expressao e Desenvolvimento/
    4 - Kit 17 Jogos/
    5 - Sangi3D 15 Experiencias/
    6 - Adultos e Marcas/
    9 - Arquivados/           versões antigas, guardadas para consulta
  Documentos/               ← organização, prompts e referências
    Organizacao/  Prompts/  Referencias/
  Sistema/                  ← o que faz o launcher funcionar (não precisa mexer)
    launcher/   servidor, tela do launcher e capas
    shared/     código 3D comum usado pelos jogos
    scripts/    catálogo, verificação e publicação
    test/       testes automáticos
    api/        catálogo gerado (apps.json)
```

Para incluir um jogo novo, coloque a pasta dele dentro da coleção certa em `Jogos/`. O launcher encontra sozinho.

Links e favoritos antigos (`01_Jogos_HTML/...`, `Colmeia Transparente.html`, `04-tear-dos-vinculos/` etc.) continuam funcionando: o servidor redireciona conforme `Sistema/launcher/redirecionamentos.json`.

## Documentos

- [Catálogo pesquisável](Documentos/Organizacao/CATALOGO.html)
- [Prompts pendentes](Documentos/Organizacao/PENDENTES.md)
- [Relatório completo](Documentos/Organizacao/RELATORIO.md)
- [CSV dos prompts](Documentos/Organizacao/prompts-e-status.csv)

## Para quem mantém

Conferir se todos os jogos abrem (abre cada um num navegador invisível e lista erros de JavaScript, arquivos faltando ou tela 3D vazia):

```
node Sistema/scripts/check-all-games.mjs
```

Para conferir só alguns, passe um trecho do id: `node Sistema/scripts/check-all-games.mjs vitralista`.

Publicar online: `node Sistema/scripts/prepare-online-build.mjs` compila o que estiver desatualizado e monta a pasta `Publicacao_Online/` (fora do git) com o launcher e os jogos. Publique essa pasta na Vercel (ela já traz o `vercel.json`).

Para incluir uma novidade na aba **Lançamentos**, registre a data, o tipo (`new` ou `updated`) e o nome da pasta do jogo em `Sistema/shared/launcher-catalog.js`.
