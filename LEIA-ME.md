# Ambientes 3D

Abra **Abrir Launcher.cmd** para acessar os jogos. Use **Explorar** para navegar por categorias e **Lançamentos** para ver ambientes novos e atualizados. Os links de prompts ficam no menu lateral.

No celular, abra um jogo pelo catálogo e toque em **Menu** para acessar os controles do jogo, as opções de som e o link para abrir em outra aba. Toque em **Voltar** para retornar ao catálogo.

- [Catálogo pesquisável](00_Organizacao/CATALOGO.html)
- [Prompts pendentes](00_Organizacao/PENDENTES.md)
- [Relatório completo](00_Organizacao/RELATORIO.md)
- [CSV dos prompts](00_Organizacao/prompts-e-status.csv)

Se abrir o `index.html` com duplo clique, ele procura o launcher já rodando e entra sozinho; se o servidor estiver desligado, mostra como ligá-lo.

## Onde fica cada jogo

- `01_Jogos_HTML/` — jogos de um arquivo HTML só (uma pasta por jogo).
- `02_Projetos/` — projetos com código-fonte e build próprio (`dist/`).
- `03_Colecoes/` — coleções temáticas (Expressão e Desenvolvimento).
- `Kit_17_jogos_3D_mockups_e_prompts/`, `Sangi3D_15_Experiencias/`, `ambientes-interativos-adultos-e-marcas/` — coleções originais.
- `launcher/` — servidor, tela do launcher, capas e a cópia usada na versão online.

Links antigos (`Colmeia Transparente.html`, `04-tear-dos-vinculos/` etc.) continuam funcionando: o servidor redireciona conforme `00_Organizacao/movimentacoes.json`.

## Conferir se todos os jogos abrem

```
node scripts/check-all-games.mjs
```

Abre cada jogo num navegador invisível e lista os que tiverem erro de JavaScript, arquivo faltando ou tela 3D vazia. Para conferir só alguns, passe um trecho do id: `node scripts/check-all-games.mjs vitralista`.

Os projetos bloqueados pelo Windows estão registrados no relatório e continuam disponíveis no local anterior.

Para incluir uma novidade na aba **Lançamentos**, registre a data, o tipo (`new` ou `updated`) e o identificador da pasta do ambiente em `shared/launcher-catalog.js`. O preparo da versão online espelha esse arquivo em `launcher/shared/`.
