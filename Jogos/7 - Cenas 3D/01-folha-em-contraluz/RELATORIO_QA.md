# Relatório de QA — S3D-117 Folha em Contraluz (piloto)

**Data:** 2026-11-28 · **Branch:** `feat/s3d-117-folha-contraluz-piloto` · **Ambiente:** Windows 11, painel de navegador do Claude Desktop (Chromium), launcher local `Sistema/launcher/server.mjs`.

## Baseline (antes)
Arquivo único `index.html` (Three r128 global + `sangi-bridge.js`). Já existia: folha com shader SSS procedural, galho, sol ocluso/flare, bokeh, capim, pólen, sliders Sol/Brisa/Bokeh, presets de câmera, toque com mola, áudio sintetizado, pausa/mute/reset/dispose do host.
Lacunas confirmadas: sem tutorial, sem atividade/objetivo, sem foto, gotas estáticas, sem perfis de qualidade nem `SET_QUALITY`, sem tratamento de falha de WebGL/perda de contexto, sem pausa do usuário nem pausa por aba oculta, alvos de toque 32–38 px, sem pinça, sem `prefers-reduced-motion`.

## Resultados
| Teste | Resultado | Evidência |
|---|---|---|
| Smoke `check-all-games.mjs folha-em-contraluz` | ✅ 1/1 | `.tmp/check-all-games.json` |
| URL direta, console | ✅ 0 erros | `read_console_messages` |
| **Aceite: luz posterior revela nervuras** | ✅ métrica contraluz ≈0,78–0,80 com sol −20…−30, ≈0 com sol ±100; meta do diário dispara | `__S3D117__.backlight()` |
| **Aceite: folha não se separa do pecíolo** | ✅ desvio 0,0000 em 20 impulsos fortes com vento 100% | `__S3D117__.petioleGap()` |
| Gotas escorrem/pingam | ✅ 3 pingos, deslocamento 1,55 em ~5 s com vento 100% | `__S3D117__.dew()` |
| Inspeção por toque | ✅ nervura central, lateral, mordida/furo e lâmina identificadas | varredura de toques |
| Diário 6/6 + persistência | ✅ salvo e recarregado | `localStorage` |
| Armazenamento corrompido | ✅ JSON inválido ignorado, cena abre | reload com `{not json` |
| Foto | ✅ PNG via blob, imagem não-preta (média RGB 86) | `lastPhotoMean()` |
| PAUSE/RESUME host ×10 | ✅ 10/10 | `postMessage SANGI_COMMAND` |
| Pausa do usuário não é desfeita por RESUME do host (e vice-versa) | ✅ | teste combinado |
| SET_QUALITY / RESET / DISPOSE | ✅ | idem |
| Layout 390×844 | ✅ sem scroll horizontal; diário movido para o topo (antes cobria o slider do Sol) | captura |
| Layout desktop (pane ~800×600) | ✅ | captura |

## Não validado (não declarar)
- **FPS**: o painel mediu p50 ≈33 ms / p95 >200 ms, mas o painel em segundo plano limita frames; números não representam hardware. Medir p50/p95 em sessão de 10 min em desktop e celular reais.
- Dispositivo físico (toque real, pinça, safe areas), 360×640, 768×1024, 1366×768 e paisagem em celular.
- Abertura via iframe do launcher (testado por URL direta + eventos do bridge).
- Falha real de WebGL / perda de contexto (caminho de código existe, não forçado).
- Áudio audível (dependente de gesto; lógica revisada, não ouvida).

## Limitações / riscos registrados
- `sangi-bridge.js` aceita `postMessage` de qualquer origem (`onMessage` sem checar `event.origin`). Arquivo compartilhado: **não alterado**; coordenar correção no contrato do launcher.
- SSS e gotas são aproximações visuais rotuladas, não simulação física/óptica.
- Valor de `SET_QUALITY` do host também fica salvo como preferência local.

**Status:** piloto funcional; **não** marcar produção até validar FPS e mobile em dispositivo real.
