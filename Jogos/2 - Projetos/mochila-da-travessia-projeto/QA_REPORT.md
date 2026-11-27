# Relatório de QA — 19. Mochila da Travessia (v2.0.0)

## Matriz de Evidências (Aceite Específico e Comum)

| Critério | Status | Evidência real |
|---|---|---|
| Validação estática HTML/JS/handlers (`check_web_app.py`) | **PASS** | `OK: no issues found.` — sem botões mortos, sem APIs bloqueadas, sem erros de sintaxe. |
| Itens não se sobrepõem em modo físico (`strictPhysics: true`) | **PASS** | Teste automatizado #2 em `tests/run_tests.mjs` validou bloqueio de sobreposição e encaixe livre. |
| Volume, massa física e centro de massa coerentes | **PASS** | Teste automatizado #3 validou cálculo de `%` de ocupação, soma de kg e deslocamento do centro de massa (`comX`). |
| Objetos simbólicos independentes de massa/peso emocional | **PASS** | Teste automatizado #4 confirmou `pedra` e `cartoes_semanticos` com `0 kg` automático e sem escore clínico. |
| Girar 90° (`Girar e acomodar`) e mover entre bolsos | **PASS** | Teste automatizado #5 validou rotação de footprint e transferência entre Compartimento Principal e Bolso Frontal. |
| Undo e Redo restauram estado físico exato | **PASS** | Teste automatizado #6 confirmou restauração integral da posição física na grade e na mesa. |
| Ações extremas, pausa, alternância de modo, fechar/reabrir sem completar e reset | **PASS** | Teste automatizado #7 validou fechamento/reabertura da aba da mochila, pausa, troca de modo e reset. |
| Privacidade e resumo observável sem dados sensíveis | **PASS** | Teste automatizado #8 confirmou omissão padrão de anotação voluntária, ausência de escore subjetivo e aviso não clínico. |
| Renderização WebGL em GPU real / Playwright multi-resolução | **NÃO TESTADO** | Sandbox offline sem instalação de Playwright e sem GPU dedicada; renderização headless atingiu timeout no snapshot contínuo. Recomenda-se validação visual final em navegador desktop (1920×1080 / 1280×720) e mobile real (390×844 / 360×640). |
| Empacotamento offline / Service Worker | **NÃO TESTADO** | Versão Canvas carrega Three.js r128 via CDN para compatibilidade imediata; para uso 100% offline em servidor local, substituir o `<script>` pelo bundle local de `three.min.js`. |
