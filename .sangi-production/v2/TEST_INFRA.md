# E2E Test Infra: Sangi3D Production v2

> **Scope**: Opaque-box 4-tier E2E test suite (`test/v2-e2e/`) validating the Sangi3D canonical launcher, `SangiBridge` lifecycle/commands, catalog & deterministic online build parity, multi-viewport responsiveness, adaptive quality, and end-to-end 3D user journeys across all 8 collections.
> **Working Directory**: `c:\Users\aless\Downloads\Ambientes 3D`
> **Integration Branch**: `integration/sangi3d-production-v2` (E2E implementation branch/worktree: `qa/e2e-suite`)

## Test Philosophy
- **Opaque-box, requirement-driven**: Tests derive strictly from `ORIGINAL_REQUEST.md` (R1–R7, Workflow 2.0 `G00`–`G16`) and user-facing contracts in `PROJECT.md` (launcher UI, `SangiBridge` `postMessage` protocol, CLI scripts, and browser behavior). Tests do NOT import or couple to internal app modules.
- **Methodology**: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.
- **Complete feature & collection coverage**: Every user-facing feature area and all 8 catalog collections (`Jardins da TCC`, `Jardins do Sentir`, `Projetos 3D`, `Kit 17 jogos 3D`, `Adultos e marcas`, `Expressão e desenvolvimento`, `Ambientes avulsos`, `Legado arquivado`) are exercised.
- **Progressive testability**: Tier 1 verifies core launcher & entry-point contracts with minimal dependencies (HTTP + DOM + `SANGI_APP_READY`), so early milestones can be smoke-checked before Tier 3–4 integration tests run.
- **Zero-cheat / real browser verification**: All browser assertions run in real Chromium/Chrome via Playwright (`node --test`), asserting zero `pageerror`, zero `console.error` (excluding explicitly mocked error tests), zero unexpected `4xx/5xx`, live WebGL draw calls (`draws > 0`), and real mouse/touch input dispatch.

## Feature Inventory
Every user-facing E2E feature area (mapped to `PROJECT.md § Feature Inventory` and `ORIGINAL_REQUEST.md` R1–R7 / `G00`–`G16`):

| # | Feature Area | Source (requirement & contract) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---:|---|---|---:|---:|---:|:---:|
| F1 | Launcher Catalog Loading & Metadata | `ORIGINAL_REQUEST` R1/R2, `PROJECT.md` #2/#14 (`/api/apps`, `/api/apps.json`, 8 collections, thumbs, stats) | 5 | 5 | ✓ | ✓ |
| F2 | Search, Filter, Sort, Layout & Persistence | `ORIGINAL_REQUEST` R2/R5 (`#q`, `/` & `Esc`, `[data-view]`, `#sort`, `[data-layout]`, `#fav`, `recent`, `#random`, `localStorage`) | 6 | 5 | ✓ | ✓ |
| F3 | App Opening & Routing Across All 8 Collections | `ORIGINAL_REQUEST` R1/R2/R7 (`[data-play]`, `#playerModal`, `/play/<id>`, `/api/build/<id>`, `loading.html`, 8 collections) | 8 | 5 | ✓ | ✓ |
| F4 | Bridge Handshake & Lifecycle Commands | `PROJECT.md` Bridge Contract, `G12` (`SANGI_APP_READY`, `SANGI_COMMAND` / `PAUSE`/`RESUME`/`MUTE`/`UNMUTE`/`RESET`/`DISPOSE`) | 6 | 6 | ✓ | ✓ |
| F5 | Audio, Controls & Accessible HUD | `ORIGINAL_REQUEST` R3/R5, `G08`/`G09` (`#mutePlayerBtn`, `#openTabBtn`, `#closePlayerBtn`, `.imv-*`, `H`/`Esc`, focus restore) | 5 | 5 | ✓ | ✓ |
| F6 | Resource Teardown & Leak Hygiene | `ORIGINAL_REQUEST` R3/R7, `G08`/`G12` (WebGL context, `AudioContext`, `rAF`, `window`/`document` listeners on close/switch) | 5 | 6 | ✓ | ✓ |
| F7 | Responsive Viewports & Touch/Mouse Input | `ORIGINAL_REQUEST` R6, `G09`/`G10` (`360x640`, `390x844`, `768x1024`, `1366x768`, `1920x1080`, `#menuBtn`, touch & mouse) | 5 | 6 | ✓ | ✓ |
| F8 | Adaptive Quality & WebGL Resilience | `ORIGINAL_REQUEST` R6, `PROJECT.md` #3, `G11` (`LOW`/`BALANCED`/`HIGH`/`ULTRA`, `SET_QUALITY`, `webglcontextlost` recovery) | 5 | 5 | ✓ | ✓ |
| F9 | Catalog & Deterministic Build Parity | `ORIGINAL_REQUEST` R2, `PROJECT.md` #2/`prepare-online-build.mjs` & `verify-catalog.mjs` (`api/apps.json === launcher/api/apps.json`, `shared/`, `01_Jogos_HTML/`, `vercel.json`) | 5 | 5 | ✓ | ✓ |
| F10 | Hardware GPU Sustained Performance & Stability | `ORIGINAL_REQUEST` R6/R7, `G07`/`G11`/`D002` (`>=30 FPS` mobile / `>=60 FPS` desktop via Chrome D3D11, 30s median-of-3 option, zero `NaN`) | 5 | 5 | ✓ | ✓ |
| **Total** | **10 E2E Feature Areas** | | **55** | **53** | **14 pairs** | **8 scenarios** |

> *Gate alignment*: `F4`/`F6`/`F8` cover both baseline bridge invariants (`SANGI_APP_READY`, `SANGI_APP_PAUSE|RESUME|MUTE|DISPOSE`) and v2 M0 additions (`SANGI_COMMAND`, `RESET`, `SET_QUALITY`, `window.__SANGI_QA__`, `shared/imersivo.js` HUD fix, deterministic `prepare-online-build.mjs` / strict `verify-catalog.mjs`). Any v2 M0 contract not yet landed on `integration/sangi3d-production-v2` fails explicitly until M0 merges.

## Test Architecture

### 1. Test Runner & Invocation
- **Primary Runner**: Node.js `v26.5.0` built-in test runner (`node --test`) via `node --test test/v2-e2e/*.test.mjs` and unified CLI wrapper `node test/v2-e2e/run-all.mjs` (supports `--tier=1|2|3|4|all`, `--gpu=hardware|swiftshader`, `--bench-seconds=<N>`, `--json`).
- **Pass/Fail Semantics**: Exit code `0` iff all executed assertions pass with zero unexpected runtime/WebGL/HTTP errors; non-zero (`1`) on any assertion failure, leak detection, parity mismatch, or benchmark threshold miss.
- **Playwright Resolution (Portable — No Root `package.json`)**:
  - `_harness.mjs` resolves Playwright in order:
    1. `process.env.SANGI_PLAYWRIGHT` (file path or module URL),
    2. `createRequire` anchored at `03_Colecoes/Expressao_e_Desenvolvimento/07-sala-das-cadeiras-possiveis/package.json` (`playwright@1.58.2`),
    3. Fallback `createRequire` anchored at `Kit_17_jogos_3D_mockups_e_prompts/08-meteorologia-das-emocoes/package.json` (`playwright@1.65.1`).
- **Browser Launch Modes**:
  - **Functional / Headless CI Mode (Tier 1–3)**: `chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] })` (fallback `channel: 'msedge'`, then bundled `chromium`).
  - **Performance Benchmark Mode (Tier 4 / `G11`)**: `chromium.launch({ channel: 'chrome' })` (fallback `'msedge'`) using **Hardware GPU** (`Intel UHD D3D11`, no SwiftShader flags), because SwiftShader caps software WebGL at ~0.5–0.7 FPS. Supports `SANGI_E2E_BENCH_SECONDS` (default `10` in fast smoke mode, `30` median-of-3 per `D002` in full release gate mode).
- **Server Lifecycle (`launcher/server.mjs`)**:
  - Harness spawns `node launcher/server.mjs --port <ephemeral_base_port> --no-prebuild` (and separate non-`--no-prebuild` or build-route test where `/play/<id>` queuing is verified).
  - Parses bound URL verbatim from stdout `Launcher dos Ambientes 3D rodando em http://127.0.0.1:<port>/` (handling `EADDRINUSE` auto-increment retries safely).
  - Always terminates server and browser cleanly in `try/finally` (`browser.close()`, `server.kill('SIGTERM')`, forced tree kill on Windows if needed).

### 2. Test Case Format & Telemetry Contract
- **Standardized Viewport Matrix (5 required viewports)**:
  - `mobile-360`: `{ width: 360, height: 640, deviceScaleFactor: 2, hasTouch: true, isMobile: true }`
  - `mobile-390`: `{ width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true, isMobile: true }`
  - `tablet-768`: `{ width: 768, height: 1024, deviceScaleFactor: 2, hasTouch: true, isMobile: false }`
  - `desktop-1366`: `{ width: 1366, height: 768, deviceScaleFactor: 1, hasTouch: false, isMobile: false }`
  - `desktop-1920`: `{ width: 1920, height: 1080, deviceScaleFactor: 1, hasTouch: false, isMobile: false }`
- **Error & Telemetry Instrumentation (Opaque-box Browser Context)**:
  - Attaches `page.on('pageerror')`, `page.on('console', msg => msg.type() === 'error')`, and `page.on('response', res => res.status() >= 400)` (ignoring known benign `/favicon.ico` only if explicitly tracked separately; otherwise flagging HTTP errors).
  - Injects read-only `addInitScript` spies in test harness (without modifying app code) to count live `WebGLRenderingContext` / `WebGL2RenderingContext` creations vs `loseContext()`, `AudioContext` creations vs `close()`, `requestAnimationFrame` active loops, and `window`/`document` listener balance across open/close cycles.
  - Reads `window.__SANGI_QA__` / `performance.memory` / `rAF` frame timestamps to compute FPS, avg/p95 frame time (ms), draw calls, and JS heap MB.

### 3. Directory Layout (`test/v2-e2e/`)
- `test/v2-e2e/_harness.mjs` — Shared server spawner, portable Playwright resolver, 5-viewport presets, error/resource-leak/FPS instrumentation, bridge `postMessage` helper, and deterministic catalog loader.
- `test/v2-e2e/tier1-feature-coverage.test.mjs` — Tier 1 isolated feature tests (`>= 55` checks across F1–F10 and all 8 collections).
- `test/v2-e2e/tier2-boundaries.test.mjs` — Tier 2 boundary, negative, leak, context-loss, and 5-viewport responsive tests (`>= 53` checks).
- `test/v2-e2e/tier3-combinations.test.mjs` — Tier 3 pairwise cross-feature combinations + CLI/source-vs-`launcher/` build parity tests (`>= 14` pairs).
- `test/v2-e2e/tier4-scenarios.test.mjs` — Tier 4 real-world multi-step user journeys + mouse/touch 3D interactions + Chrome Hardware GPU FPS benchmarks (`>= 8` scenarios).
- `test/v2-e2e/run-all.mjs` — Unified runner orchestrating Tiers 1–4 with structured JSON/Markdown report output.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Collections / Apps Exercised | Features Exercised | Complexity |
|---:|---|---|---|---|
| S1 | Therapeutic Exploration Journey (TCC + Sentir) | `Jardins da TCC` (`escada-da-coragem`), `Jardins do Sentir` (`casa-da-arvore-das-emocoes`, `correio-das-palavras-nao-ditas`) | F1, F2, F3, F4, F5, F6, F10 | Medium |
| S2 | Complex 3D Studio & Vite Project Flow | `Projetos 3D` (`04-tear-dos-vinculos`, `02_projetos-ateliemascaras`, `01-oficina-do-vitralista`) | F1, F3, F4, F6, F7, F8 | High |
| S3 | Kit 17 Dual-Runtime Session (Vite + Engine HTML) | `Kit 17 jogos 3D` (`02-atlas-das-texturas`, `04-observatorio-da-luz`, `11-bussola-do-corpo`) | F2, F3, F4, F5, F8, F10 | High |
| S4 | Adultos e Marcas Physics & Audio Session | `Adultos e marcas` (`03_rochas-em-equilibrio`, `05_clepsidra-do-foco`, `12_pinball-de-madeira`) | F3, F4, F5, F6, F7, F10 | High |
| S5 | Expressão e Desenvolvimento Rapier3D Journey | `Expressão e desenvolvimento` (`07-sala-das-cadeiras-possiveis`, `09-pavilhao-dos-tecidos-flutuantes`) | F3, F4, F7, F8, F10 | High |
| S6 | Ambientes Avulsos Interactive Craft & Mobile Touch | `Ambientes avulsos` (`lago-3d-interativo`, `oficina-de-bonsais`, `oficina-de-estofados`) | F2, F3, F5, F7 (`360x640`, `390x844`), F10 | Medium |
| S7 | Mobile-to-Desktop Cross-Viewport & Quality Adaptation | Launcher + multi-app across `360x640`, `390x844`, `768x1024`, `1366x768`, `1920x1080` | F2, F5, F7, F8, F10 (`30 FPS` mobile / `60 FPS` desktop) | High |
| S8 | Deterministic Online Mirror & Legado Governance Journey | `prepare-online-build.mjs` -> `verify-catalog.mjs` -> static mirror launch + `Legado arquivado` filter/audit | F1, F2, F3, F6, F9 | High |

## Coverage Thresholds
- **Minimum Requirement (`N = 10` features)**:
  - Tier 1: `>= 5 × 10 = 50` (Designed: **55**)
  - Tier 2: `>= 5 × 10 = 50` (Designed: **53**)
  - Tier 3: `>= 10` pairwise combinations (Designed: **14**)
  - Tier 4: `>= max(5, 10 ÷ 2) = 5` real-world scenarios (Designed: **8**)
  - **Total Minimum**: `115` → **Designed Total: 130+ E2E assertions/scenarios**
- **Hardware / Gate Caveat (`B001` / `G16`)**: Physical mobile device validation is marked `DEVICE_VALIDATION_PENDING` in `.sangi-production/v2/blockers.md`; automated mobile verification runs via Playwright Chromium emulation (`360x640`, `390x844`, `hasTouch: true, isMobile: true`) + Chrome Hardware GPU benchmarks (`30 FPS` mobile / `60 FPS` desktop targets).
