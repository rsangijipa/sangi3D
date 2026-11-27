# Sangi3D — Step 0 Environment, Tooling, Skills & Runtime Feasibility Report

**Date (UTC):** 2026-11-24  
**Workspace:** `c:\Users\aless\Downloads\Ambientes 3D`  
**Git Reference:** Branch `main` @ `a87f539c9bb66832a0b5474178941711064d62dd` (commit msg: `22`)  
**Working Tree State:** Clean except untracked `.sangi-production/v2/` (`git status --porcelain`: `?? .sangi-production/v2/`)  
**Active Worktrees:** 1 (`C:/Users/aless/Downloads/Ambientes 3D`)

---

## 1. Local Skills Discovery (Matt Pocock, Three.js, QA, Game Dev)

### 1.1 Matt Pocock Skills (`mattpocock/skills`)
- **Canonical Installed Path:** `C:\Users\aless\plugins\mattpocock-skills\` (with `.codex-plugin\plugin.json`, `README.md`, `LICENSE`, and `skills/`).
- **Note on Broken/Stub Paths:**
  - `C:\Users\aless\.agents\plugins\marketplace.json` references `"./plugins/mattpocock-skills"` (relative path broken inside `.agents/plugins/`; the actual plugin lives at `C:\Users\aless\plugins\mattpocock-skills\`).
  - `C:\Users\aless\.gemini\config\plugins\agentic-awesome-skills\skills\` contains empty directories for `tdd`, `improve-codebase-architecture`, `grill-me`, `to-prd`, `setup-matt-pocock-skills`, etc. (no `SKILL.md` files inside).
  - `C:\Users\aless\AntigravitySkills_OFF\agentic-awesome-skills\skills\setup-matt-pocock-skills` is an older/disabled copy.
- **25 Skills Available in `C:\Users\aless\plugins\mattpocock-skills\skills\`:**
  - **Engineering (User-invoked):** `ask-matt`, `grill-with-docs`, `triage`, `improve-codebase-architecture`, `setup-matt-pocock-skills`, `to-spec`, `to-tickets`, `implement`, `wayfinder`
  - **Engineering (Model-invoked):** `prototype`, `diagnosing-bugs`, `research`, `tdd`, `domain-modeling`, `codebase-design`, `code-review`, `resolving-merge-conflicts`, `wizard`
  - **Productivity (User-invoked):** `grill-me`, `handoff`, `teach`, `to-questionnaire`, `wait-what`
  - **Productivity (Model-invoked):** `grilling`, `writing-for-agents`
- **Key Principles Extracted for Sangi3D (R1):**
  - `tdd/SKILL.md`: Red → Green loop in **vertical tracer-bullet slices** (one seam, one test, one minimal implementation). Test behavior through **pre-agreed public seams**; avoid implementation-coupled tests (mocking internals) and tautological assertions (recomputing expected values via implementation logic).
  - `codebase-design/SKILL.md`: Design **deep modules** (rich behavior behind small interfaces at clean seams). Apply the **deletion test**, inject dependencies rather than hardcoding them, return results rather than mutating side-effect state, and treat the interface as the test surface.
  - `improve-codebase-architecture/SKILL.md`: Prioritize hot spots (`git log --oneline`), surface shallow pass-through modules, tighten locality.
  - `diagnosing-bugs/SKILL.md`: Build a **tight, deterministic, red-capable feedback loop** before hypothesising; minimise repro; rank 3–5 falsifiable hypotheses; instrument with tagged logs and clean up.
  - `domain-modeling/SKILL.md`: Maintain ubiquitous language in `CONTEXT.md` (no implementation details) and architectural trade-offs in `docs/adr/`.
  - `code-review/SKILL.md`: Two-axis parallel review (**Standards** + Fowler smell baseline vs **Spec** fidelity).

### 1.2 Three.js, Game Dev & QA Skills
| Source Directory | Count / Key Skills | Focus |
|---|---|---|
| `C:\Users\aless\.gemini\config\plugins\threejs-skills\skills\` | 24 skills (`threejs-director`, `tsl-materials`, `metal`, `glass`, `paint`, `rust`, `water`, `interior-mapping`, `lighting`, `indirect-lighting`, `procedural-geometry`, `signage`, `jolt-driving`, `character-*`, `card-grass`, `far-shade`, `ocean-water`, `photo-sky`, `snow-weather`, `engineered-environments`, `megacity`, `station-maglev`, `greenhouse`, `pipes`) | Three.js 0.187.0 WebGPU/TSL materials, lighting, procedural geometry, Jolt physics |
| `C:\Users\aless\.agents\skills\` & `C:\Users\aless\.claude\skills\` (`majidmanzarpour/threejs-game-skills`) | `threejs-game-director`, `threejs-3d-generator`, `threejs-aaa-graphics-builder`, `threejs-audio-generator`, `threejs-debug-profiler`, `threejs-game-ui-designer`, `threejs-gameplay-systems`, `threejs-image-generator`, `threejs-qa-release` | Three.js game architecture, procedural 3D, audio synthesis, perf profiling, QA |
| `C:\Users\aless\.agents\skills\` (`gamedev-skills/awesome-gamedev-agent-skills`) | `threejs-scene-setup`, `threejs-materials-lighting`, `threejs-gltf-loading`, `audio-design`, `camera-systems`, `physics-tuning`, `performance-optimization`, `shader-programming`, `input-systems`, `game-ui-ux`, `level-design`, `save-systems` | WebGL/Three.js scene setup, physics, audio, UI/UX, optimization |
| `C:\Users\aless\.gemini\config\plugins\qa-testing\skills\` | `performance-testing`, `quality-metrics`, `test-automation`, `test-frameworks` | QA automation & performance metrics |
| `C:\Users\aless\.gemini\config\plugins\claude-code-game-studios\skills\` | ~70 skills (`perf-profile`, `qa-plan`, `soak-test`, `smoke-check`, `team-audio`, `team-polish`, `team-qa`, `team-ui`, etc.) | Game studio QA & release gates |
| `C:\Users\aless\.agents\skills\` (General Web/Eng) | `webapp-testing` (Playwright), `code-review-and-quality`, `accessibility-compliance-accessibility-audit`, `frontend-developer` | Playwright testing, accessibility, code review |

---

## 2. Build, Package & Runtime Tooling

### 2.1 System Runtimes
| Tool | Path | Version | Notes |
|---|---|---|---|
| `node` | `C:\Program Files\nodejs\node.exe` | `v26.5.0` | Supports `--test` and native TypeScript type-stripping |
| `npm` | `C:\Program Files\nodejs\npm.ps1` | `11.17.0` | |
| `pnpm` | `C:\Users\aless\AppData\Roaming\npm\pnpm.ps1` | `10.0.0` | Installed globally |
| `npx` | `C:\Program Files\nodejs\npx.ps1` | `11.17.0` | |
| `yarn` | — | Not installed | |
| `git` | `C:\Program Files\Git\cmd\git.exe` | `2.55.0.windows.3` | `git worktree` supported |
| `python` / `py` | `Python314\python.exe` | `3.14.6` | No playwright/selenium pip packages |
| `uv` | `C:\Users\aless\.local\bin\uv.exe` | `0.13.5` | |

Global npm packages (`C:\Users\aless\AppData\Roaming\npm`): `better-sqlite3@13.0.3`, `hyperframes@0.9.64`, `pnpm@10.0.0`, `sql.js@1.14.1`, `supabase@2.116.0`.

### 2.2 Workspace Package & Dependency Matrix
There is **no root `package.json`** or root `node_modules/`. Instead, there are **39 non-launcher `package.json` files** across 5 subtrees, with fragmented toolchains:

| Subtree | Projects w/ `package.json` | Three.js Versions | Physics / 3D / UI Libs | Build / Bundler / TS | Test Frameworks |
|---|---|---|---|---|---|
| `02_Projetos/` | 7 (2 lack `node_modules`: `mochila-da-travessia-projeto`, `oficina-dos-gestos-compartilhados-projeto`, plus `referencia_3d`) | `0.128.0`, `^0.173.0`, `0.180.0`, `0.187.0` | React 19 + `@react-three/fiber@9.0.4`, `@react-three/drei@10.0.4`, `@react-three/postprocessing@3.0.4`, `postprocessing@6.36.7`, `zustand@5.0.3`, `framer-motion@12.4.7` (`jardim-dos-ciclos`) | Vite `^5.2.0`, `^6.1.0`, `^6.2.7`, `7.3.0`; TS `^5.4.0`–`5.9.3` | `node --test` (some `--experimental-strip-types`) |
| `03_Colecoes/Expressao_e_Desenvolvimento/` | 14 (#11, #13–#18 lack local `node_modules`; #02, #05–#10, #12 share collection-level `node_modules` via directory junctions `d----l`) | `0.183.2` (`@types/three@0.183.1`) | `@dimforge/rapier3d-compat@0.12.0` (#07–#18) | Vite `7.3.8`; TS `5.9.3` | `node --test`, `playwright@1.58.2` |
| `04-tear-dos-vinculos/` | 1 (`nm=True`) | `0.180.0` | None | Vite `6.2.7`; TS `5.6.3` | `node --test`, `tests/e2e.mjs` |
| `ambientes-interativos-adultos-e-marcas/` | 4 apps + 2 `demonstracao/` subprojects (`hyperframes@0.9.64`) | `0.160.0` (devDep bundled via esbuild) | `@dimforge/rapier3d-compat@0.14.0` (`03_rochas`), `@dimforge/rapier2d-compat@0.17.3` + `gsap@3.13.0` (`12_pinball`) | `esbuild@0.25.12` (`scripts/pack.mjs`) | `playwright@1.60.0`, `node --test`, `scripts/verify.mjs` |
| `Kit_17_jogos_3D_mockups_e_prompts/` | 11 (9 w/ `nm=True`; `_versao-anterior` & `15-casa-das-memorias` `nm=False`) | `^0.160.0`, `^0.172.0`, `0.183.2`, `0.187.0` | `gltf-validator@2.0.0-dev.3.10` (`11-bussola-do-corpo`) | Vite `^5.0.12`, `^5.4.0`, `7.3.8`, `8.3.8`; TS `^5.3.3`–`7.0.2` | `vitest` (`1.2.2`, `2.1.0`, `4.1.12`), `playwright` (`^1.48.0`, `1.58.2`, `1.60.0`), `node --test` |

- **Vendored Three.js (`shared/vendor/`):** `three.module.js` (658 KB), `three.core.js` (1.47 MB), `three-r128.min.js` (603 KB), `addons/controls/OrbitControls.js`.
- **Audio:** Pure Web Audio API (`shared/engine/audio.js` `ResponsiveAudio`, `shared/ambientes-kit.js` `ZenAudioEngine`). Zero external audio npm packages.

---

## 3. Headless Browser & WebGL Screenshot/Perf Capability

### 3.1 Installed Browsers & Automation Packages
- **System Browsers:**
  - Google Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - Microsoft Edge: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- **Playwright Browser Cache (`C:\Users\aless\AppData\Local\ms-playwright`):**
  - `chromium-1208` & `chromium_headless_shell-1208` (Chromium 145.0.7632.6 — matches `playwright@1.58.2`)
  - `chromium-1243` & `chromium_headless_shell-1243`
  - `firefox-1543`, `webkit-2359`, `ffmpeg-1011`
  - **Mismatch Warning:** `playwright@1.60.0` (used in `11-bussola-do-corpo` and `ambientes-interativos-adultos-e-marcas`) expects `chromium_headless_shell-1223`, which is **missing** in `ms-playwright`. Launching `playwright@1.60.0` without `channel: 'chrome'`/`'msedge'` fails. Passing `channel: 'chrome'` or `channel: 'msedge'` works on **both** `1.58.2` and `1.60.0`.
- **Puppeteer Cache:** `C:\Users\aless\.cache\puppeteer\chrome\win64-152.0.7977.75` (no `puppeteer` npm package found in workspace or global).

### 3.2 Live WebGL & Viewport Verification Results (Probe on `04-observatorio-da-luz`)
Verified against `node launcher/server.mjs --port 5299 --no-prebuild` using Playwright:

1. **WebGL2 Support & Renderer Modes:**
   - `playwright@1.58.2` bundled Chromium + `--enable-unsafe-swiftshader --use-angle=swiftshader`: **PASS** (`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`).
   - `channel: 'chrome'` + SwiftShader flags: **PASS** (SwiftShader Vulkan 1.3.0).
   - `channel: 'chrome'` (default, no SwiftShader) & `channel: 'msedge'` (default): **PASS with Hardware GPU** (`ANGLE (Intel, Intel(R) UHD Graphics (0x0000A78B) Direct3D11 vs_5_0 ps_5_0, D3D11)`).
2. **Telemetry & Capture Verification across All 5 Required Viewports (Hardware GPU Chrome):**
   - `desktop-1920` (`1920x1080`, DPR 1): **10.5 FPS** (`95.6 ms` avgFrameMs), `377` draws/frame, JS heap `17.84 / 23.58 MB`, PNG `1,428,654` bytes, `0` pageErrors.
   - `desktop-1366` (`1366x768`, DPR 1): **19.9 FPS** (`50.28 ms` avgFrameMs), `377` draws/frame, JS heap `13.28 / 22.58 MB`, PNG `751,034` bytes, `0` pageErrors.
   - `mobile-360` (`360x640`, DPR 2, `hasTouch: true, isMobile: true`): **47.3 FPS** (`21.15 ms` avgFrameMs), `331` draws/frame, canvas `[486, 492, 360, 365]`, JS heap `17.23 / 28.58 MB`, PNG `498,015` bytes, `0` pageErrors.
   - `mobile-390` (`390x844`, DPR 3, `hasTouch: true, isMobile: true`): **46.9 FPS** (`21.30 ms` avgFrameMs), `235` draws/frame, canvas `[526, 649, 390, 481]`, JS heap `13.23 / 21.83 MB`, PNG `1,088,468` bytes, `0` pageErrors.
   - `tablet-768` (`768x1024`, DPR 2, `hasTouch: true`): **24.7 FPS** (`40.48 ms` avgFrameMs), `359` draws/frame, canvas `[1036, 788, 768, 584]`, JS heap `14.71 / 22.33 MB`, PNG `1,342,243` bytes, `0` pageErrors.
3. **SwiftShader vs Hardware GPU Finding:**
   - Under SwiftShader, the same scene ran at **0.5–0.7 FPS** (`1388–2180 ms/frame`). Therefore:
     - Use **SwiftShader** only for headless CI fallback / deterministic functional, shader-error, and screenshot checks.
     - Use **`channel: 'chrome'` / `'msedge'` (Intel UHD D3D11)** for realistic FPS / frame-time / draw-call benchmarking (and notice `04-observatorio-da-luz` already fails the 60 FPS desktop target at 1920x1080 with 10.5 FPS and 377 draws/frame!).
   - Also note: `/favicon.ico` returns HTTP 404 on apps without an inline favicon (captured in `consoleErrors` under `page.on('console')`).

---

## 4. Build, Publish, Engine & Gate Pipeline Analysis

### 4.1 Launcher & Build Scripts
- `launcher/server.mjs` (372 lines): Serves `ROOT` on `127.0.0.1:5170`, dynamically scans apps up to depth 4 (skipping `SKIP_DIRS` including `launcher`, `node_modules`, `.claude`, `.git`, `shared`), resolves moved paths via `00_Organizacao/movimentacoes.json`, assigns `/play/<id>` for Vite/build projects, and prebuilds outdated `dist/` unless `--no-prebuild` is passed.
- `launcher/builder.mjs` (190 lines): Serialized build queue (`ensureBuilt`). Checks `hasInstalledDependencies` walking up parent directories (supporting `03_Colecoes` shared `node_modules`), runs `npm ci` / `npm install` + `npm run build` with backup/rollback (`.dist-launcher-backup`), preserves the `Voltar ao Launcher Principal` pill in `dist/index.html`, and writes `dist/.launcher-build`.
- `vercel.json` (root) vs `launcher/vercel.json`: Root `index.html` and `launcher/index.html` are currently byte-identical (`49,204` bytes), both rewriting `/api/apps` -> `/api/apps.json`.
- `scripts/generate-catalog.mjs` (44 lines): **Non-standalone** — requires `launcher/server.mjs` running on port `5170`, fetches `http://127.0.0.1:5170/api/apps`, writes `api/apps.json` and `launcher/api/apps.json`.
- `scripts/prepare-online-build.mjs` (94 lines): **Non-deterministic & incomplete** — recursively copies all apps (including `src`, excluding `node_modules`, `.git`, `.vite`, `_versoes`) and `shared/engine` + `shared/vendor` into `launcher/` (creating a full mirror inside `launcher/`), strips `index-html`, converts `/play/<id>` to `/<path>/dist/index.html`, and overwrites `api/apps.json` + `launcher/api/apps.json`. **Gaps:** Does NOT run `npm run build` on TS/Vite/esbuild projects before copying; does NOT copy `shared/sangi-bridge.js` or `shared/ambientes-kit.js` (only `shared/engine` and `shared/vendor`!); leaves stale files in `launcher/` if removed from root.
- `scripts/promote-batch1.mjs` & `scripts/promote-batch2.mjs`: Ad-hoc mutation scripts. Direct inspection of `api/apps.json` vs `launcher/api/apps.json` reveals:
  - Both have `101` entries, **all `status: "ready"`**, yet `8` Kit_17 entries still have `kind: "concept"` (`status: "ready"` + `kind: "concept"` contradiction from `promote-batch1.mjs`!).
  - **`api/apps.json` !== `launcher/api/apps.json`** (`9` entries in `ambientes-interativos-adultos-e-marcas` differ between the two files).
- `scripts/verify-catalog.mjs` (123 lines): Passes with `0` errors / `0` warnings currently, **because** it does not check equality between `api/apps.json` and `launcher/api/apps.json`, nor `kind === 'concept' && status === 'ready'`, nor missing `dist/` at root when `launcher/` has a fallback copy.
- `scripts/smoke-test.mjs` (93 lines): Starts `launcher/server.mjs --port 5178` (WITHOUT `--no-prebuild`!), checks HTTP `< 400` and `length > 0` for `ready` URLs. Does not verify JS execution, WebGL rendering, assets/chunks, or console errors.

### 4.2 Shared Engine (`shared/engine/` & `shared/`)
- `shared/engine/` contains 11 modules: `assets.js`, `audio.js`, `craft-workbench.js`, `input.js`, `lifecycle.js`, `lighting.js`, `materials.js`, `particles.js`, `performance.js`, `physics.js`, `renderer.js`, `scene-details.js`, `studio-environment.js`, `workshop.js` (actually 14 files!).
- **Architectural & Reliability Gaps Identified:**
  1. **Inconsistent Three.js resolution:** `materials.js` & `scene-details.js` use relative ESM `import * as THREE from '../vendor/three.module.js'`; `workshop.js` uses absolute `/shared/vendor/three.module.js`; `renderer.js`, `input.js`, `lighting.js`, `assets.js`, `particles.js` rely on an **implicit global `THREE`**, which will throw `ReferenceError` in strict ESM apps without `window.THREE`.
  2. **Lifecycle / Listener leaks in `shared/ambientes-kit.js`:** `ZenAudioEngine` has no `dispose()` / `ctx.close()` method; `setupEnvironmentLifecycle()` and `setupSangiBridge()` register `visibilitychange`, `matchMedia`, and `message` listeners with no teardown/unsubscribe handle.
  3. **Fixed-quality vs R6 gaps in `shared/engine/performance.js` & `renderer.js`:** `PerformanceMonitor` only downgrades `HIGH -> BALANCED -> LOW` (never upgrades back, only adjusts pixelRatio and boolean `shadowMap.enabled`, does not expose draw calls, triangles, LOD, or particle budgets).
  4. **Inconsistent `sangi-bridge.js`:** `scripts/sync-imersivo.mjs` embeds a bridge snippet into `imersivo.js` (`SANGI_APP_READY`, `PAUSE`, `RESUME`, `DISPOSE` without `MUTE`), whereas `shared/sangi-bridge.js` and `shared/ambientes-kit.js` implement `MUTE` too.

### 4.3 Existing Test Suite (`test/`) & `.sangi-production/`
- `test/e2e-environments.test.mjs` (808 lines): Static HTML regex + `verify-catalog.mjs` + HTTP 200 smoke for 17 specific environments only (not the 101-app catalog).
- `test/browser-environments.mjs` (187 lines): Playwright functional checks for 10 apps + launcher iframe open/close (`channel: 'chrome'`, SwiftShader). Hardcodes `createRequire` to `03_Colecoes/.../07-sala-das-cadeiras-possiveis/package.json`.
- `test/player-regressions.mjs` (112 lines): Playwright checks for launcher iframe focus restoration, `imersivo.css/js?v=3`, 4 apps, and `04-tear-dos-vinculos/dist/`.
- `test/realistic-environments.mjs` (71 lines): **Broken portability** — imports `file:///C:/Users/aless/Downloads/Sitefiguraviva/node_modules/playwright-core/index.mjs` (outside repo!).
- `.sangi-production/`:
  - `progress.json` is stale (`PRODUCTION_RELEASE_COMPLETE`, `catalogReady: 97` vs actual `101` in `api/apps.json`).
  - `quality-gates.json` defines `GATE_01..GATE_10` (pre-v2), whereas Master Production Workflow 2.0 requires `.sangi-production/v2/` with gates `G00..G16`.
  - `.sangi-production/v2/` exists as an untracked directory in the workspace (`git status`).
