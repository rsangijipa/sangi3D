# Architectural & Production Decisions — Sangi3D 2.0

## D001: Versioning and Git Branching Strategy
- Dedicated local integration branch: `integration/sangi3d-production-v2`
- Task branches:
  - `upgrade/<app-id>` for isolated app upgrades
  - `engine/<module>` for shared engine improvements
  - `qa/<app-id>` for QA verification scripts and benchmark suites
- No remote pushes or force pushes. Purely local integration with verification.

## D002: Zero-Placeholders and Empirical Verification Policy
- Strict adherence to R0.5 and R0.6: All mechanical claims must be verified with automated behavior tests.
- Visual review must be conducted by independent QA using the structured 10-criteria rubric (target mean >= 4.0, no score < 3.0).
- Performance must be benchmarked using reproducible scenarios (30-second interaction runs, median of 3 runs).

## D003: Dedicated State Isolation
- Baseline and new mission metadata resides in `.sangi-production/v2/`.
- Prior historical runs in `.sangi-production/` are preserved for reference and baseline comparison.

## D004: Catalog Canonicalization & Deterministic Build Rules
- `scripts/lib/catalog.mjs` is the single shared catalog scanner and canonical override source for both `scripts/generate-catalog.mjs` and `launcher/server.mjs` (offline deterministic generation without requiring `:5170`).
- `02_Projetos/01-oficina-do-vitralista` is canonical (`canonicalRole: "canonical"`), while `01_Jogos_HTML/oficina-do-vitralista/index.html` is disambiguated as `"Oficina do Vitralista (HTML)"` (`canonicalRole: "variant"`, `variantOf: "02_projetos-01-oficina-do-vitralista"`).
- `Kit_17_jogos_3D_mockups_e_prompts/04-observatorio-da-luz` keeps exact `name: "Observatório da Luz"` (`canonicalRole: "canonical"`), while `01_Jogos_HTML/observatorio-da-luz/index.html` is disambiguated as `"Observatório da Luz (HTML)"` (`canonicalRole: "variant"`).
- The 4 `Jardins do Sentir` vs `Legado arquivado` pairs (#5/#83, #6/#84, #8/#86, #9/#87) keep all legacy entries tagged with `isLegacy: true` and `archivedFrom: <activeId>`; `correio-das-palavras-nao-ditas-agencia-postal` remains attached solely to `#9.versions`.
- The 8 Batch-1 Kit 17 ready apps (#20–#23, #25, #29, #30, #32) flip from `kind: "concept", isConcept: true` to `kind: "html", isConcept: false`.
- `index.html` (and synced `launcher/index.html`) maps `KIND.game = 'Jogo'`.
- `launcher/capas/` supports both `.webp` and `.png` cover images; every `status: "ready"` entry must have a real cover screenshot on disk (`verify-catalog.mjs` fails on `thumb: null` or missing file).
- `scripts/prepare-online-build.mjs` conditionally rebuilds stale projects (`needsBuild()`), syncs `shared/*.js`, `01_Jogos_HTML/`, `02_Projetos/`, `03_Colecoes/`, `04-tear-dos-vinculos/`, `Kit_17_jogos_3D_mockups_e_prompts/`, `ambientes-interativos-adultos-e-marcas/`, root HTMLs, `index.html`, and `launcher/capas/`, prunes orphaned files in `launcher/`, preserves `launcher/vercel.json`, and writes byte-identical `api/apps.json` and `launcher/api/apps.json`.

## D005: Git Worktree & NTFS Junction Policy
- M0 (`engine/infra-v2`) executes on primary workspace checkout to preserve `.sangi-production/v2/` untracked files and existing `node_modules` / Playwright caches.
- Broken NTFS junction `03_Colecoes/Expressao_e_Desenvolvimento/02-trilha-do-mestre-mandou/node_modules` is removed cleanly via `cmd /c rmdir` so resolution falls back to shared `03_Colecoes/Expressao_e_Desenvolvimento/node_modules`.
- Later Vite/TS app batches (`M4`, `M5`, `M7`) running in `git worktree`s must link `node_modules` via NTFS junctions and never run concurrent `npm install` against shared parent `node_modules`.
