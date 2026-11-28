# Coleção de jogos 3D — kit de implementação

17 jogos, 18 referências. Cada pasta inclui o mockup original e um prompt autossuficiente, pronto para copiar. Os textos especificam assets a produzir, não modelos 3D já gerados. O arquivo de entrada com extensão XLSX era uma imagem PNG da Estação das Trocas e foi preservado com extensão correta. As duas referências de Oficina do Tempo foram reunidas.

## Como usar
1. Abra uma pasta de jogo.
2. Anexe `mockup.png` (e variante, quando houver) ao agente de código.
3. Copie `PROMPT.md` integralmente e envie com o repositório aberto, ou em um projeto vazio.
4. Solicite implementação e execução dos testes, não apenas planejamento. Verifique as capturas desktop/mobile e compare com a referência.
5. Após aprovação, integre o build ao catálogo e reutilize a arquitetura comum.

## Ordem sugerida de produção
- Lote 1 — fundação e interação mecânica: Torre do Impulso, Oficina do Tempo, Atlas das Texturas, Observatório da Luz.
- Lote 2 — áudio e ambiente: Cartografia dos Sons, Laboratório de Camadas Sonoras, Meteorologia das Emoções, Ilha das Pausas.
- Lote 3 — simulações e regras: Estação das Trocas, Porto das Decisões, Ensaio do Cotidiano, Cidade das Conversas, Museu dos Pontos de Vista.
- Lote 4 — criação e experiências expressivas: Bússola do Corpo, Estúdio dos Limites, Casa das Memórias, Teatro das Histórias Possíveis.

## Índice
- 01. [Cartografia dos Sons](01-cartografia-dos-sons/PROMPT.md) — 1 referência(s), 1890 palavras de especificação.
- 02. [Atlas das Texturas](02-atlas-das-texturas/PROMPT.md) — 1 referência(s), 1823 palavras de especificação.
- 03. [Laboratório de Camadas Sonoras](03-laboratorio-de-camadas-sonoras/PROMPT.md) — 1 referência(s), 1792 palavras de especificação.
- 04. [Observatório da Luz](04-observatorio-da-luz/PROMPT.md) — 1 referência(s), 1763 palavras de especificação.
- 05. [Oficina do Tempo](05-oficina-do-tempo/PROMPT.md) — 2 referência(s), 1821 palavras de especificação.
- 06. [Torre do Impulso](06-torre-do-impulso/PROMPT.md) — 1 referência(s), 1810 palavras de especificação.
- 07. [Ilha das Pausas](07-ilha-das-pausas/PROMPT.md) — 1 referência(s), 1777 palavras de especificação.
- 08. [Meteorologia das Emoções](08-meteorologia-das-emocoes/PROMPT.md) — 1 referência(s), 1769 palavras de especificação.
- 09. [Estação das Trocas](09-estacao-das-trocas/PROMPT.md) — 1 referência(s), 1780 palavras de especificação.
- 10. [Porto das Decisões](10-porto-das-decisoes/PROMPT.md) — 1 referência(s), 1773 palavras de especificação.
- 11. [Bússola do Corpo](11-bussola-do-corpo/PROMPT.md) — 1 referência(s), 1813 palavras de especificação.
- 12. [Cidade das Conversas](12-cidade-das-conversas/PROMPT.md) — 1 referência(s), 1796 palavras de especificação.
- 13. [Museu dos Pontos de Vista](13-museu-dos-pontos-de-vista/PROMPT.md) — 1 referência(s), 1815 palavras de especificação.
- 14. [Estúdio dos Limites](14-estudio-dos-limites/PROMPT.md) — 1 referência(s), 1775 palavras de especificação.
- 15. [Casa das Memórias](15-casa-das-memorias/PROMPT.md) — 1 referência(s), 1775 palavras de especificação.
- 16. [Teatro das Histórias Possíveis](16-teatro-das-historias-possiveis/PROMPT.md) — 1 referência(s), 1795 palavras de especificação.
- 17. [Ensaio do Cotidiano](17-ensaio-do-cotidiano/PROMPT.md) — 1 referência(s), 1830 palavras de especificação.

## Gate de produção
Antes de replicar a base para todos os jogos, implemente Torre do Impulso como vertical slice: entrada, gameplay, pausa, resumo, assets finais, build e QA desktop/mobile. Congele convenções de runtime e assets somente após testar esse jogo. Depois implemente os demais em lotes, com QA próprio.
